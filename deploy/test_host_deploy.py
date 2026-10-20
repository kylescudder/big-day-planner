"""Big Day Planner deploy settings and hooks, and the vendored core's integrity."""
import hashlib
import importlib.util
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
spec = importlib.util.spec_from_file_location('host_deploy', HERE / 'host-deploy.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
core = module.core
D = 'sha256:' + 'a' * 64
CANDIDATE = module.APP.image + '@' + D


class Settings(unittest.TestCase):
    def test_vendored_core_matches_its_lock(self):
        # Edit deploy-core and run its sync.py instead of changing the vendored copy.
        lock = json.loads((HERE / 'deploy_core.lock').read_text())
        for name, digest in lock['sha256'].items():
            self.assertEqual(hashlib.sha256((HERE / name).read_bytes()).hexdigest(), digest, name)

    def test_release_identity(self):
        app = module.APP
        self.assertEqual((app.image, app.repo, app.workflow, app.branch, app.image_var, app.service),
                         ('ghcr.io/kylescudder/big-day-planner', 'kylescudder/big-day-planner', 'release.yml',
                          'main', 'BIG_DAY_PLANNER_IMAGE', 'web'))
        self.assertEqual(app.app_dir, HERE.parent)
        self.assertTrue(app.public_status and app.backups)


class Hooks(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        platform = Path(self.temp.name)
        core.configure(module.APP)
        for name, value in [('APP', platform / 'apps/big-day-planner'), ('BACKUPS', platform / 'backups')]:
            p = patch.object(core, name, value)
            p.start()
            self.addCleanup(p.stop)
        self.password = platform / 'projects/big_day_planner/owner-password'
        self.password.parent.mkdir(parents=True)
        self.password.write_text('owner')
        self.password.chmod(0o600)
        self.calls = []

    def test_health_and_acceptance_run_inside_the_started_image(self):
        with patch.object(core, 'compose', side_effect=lambda *a, **k: self.calls.append((a, k['image']))):
            module.health(CANDIDATE)
            module.accept(CANDIDATE)
        self.assertEqual(self.calls, [(('exec', '-T', 'web', 'bun', 'deploy/healthcheck.ts'), CANDIDATE),
                                      (('exec', '-T', 'web', 'bun', 'deploy/verify.ts'), CANDIDATE)])

    def test_prepare_backs_up_then_migrates_with_a_mounted_owner_credential(self):
        with patch.object(core, 'backup_database', side_effect=lambda db: self.calls.append(('backup', db))), \
             patch.object(core, 'run', side_effect=lambda args, **k: self.calls.append(args)):
            module.prepare(CANDIDATE, None)
        self.assertEqual(self.calls[0], ('backup', 'big_day_planner'))
        migrate = self.calls[1]
        self.assertEqual(migrate[-3:], [CANDIDATE, 'bun', 'server/migrate.ts'])
        self.assertIn(f'type=bind,src={self.password},dst=/run/secrets/database_password,readonly', migrate)
        self.assertIn('DATABASE_URL=postgres://big_day_planner_owner@postgres:5432/big_day_planner', migrate)

    def test_unprotected_migration_credential_is_rejected(self):
        self.password.chmod(0o644)
        with patch.object(core, 'backup_database'), patch.object(core, 'run') as run:
            with self.assertRaisesRegex(core.Error, 'protected regular file'):
                module.prepare(CANDIDATE, None)
            run.assert_not_called()


if __name__ == '__main__':
    unittest.main()
