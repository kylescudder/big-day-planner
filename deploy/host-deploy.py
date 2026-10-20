#!/usr/bin/env python3
"""Big Day Planner settings and hooks for the shared host deployer (deploy_core.py)."""
from pathlib import Path

import deploy_core as core

NAME = 'big_day_planner'


def health(image):
    core.compose('exec', '-T', 'web', 'bun', 'deploy/healthcheck.ts', image=image)


def accept(image):
    core.compose('exec', '-T', 'web', 'bun', 'deploy/verify.ts', image=image)


def migrate(candidate):
    password = core.protected_file(core.APP.parents[1] / f'projects/{NAME}/owner-password', 'Migration credential')
    core.run(['docker', 'run', '--rm', '--read-only', '--cap-drop', 'ALL', '--security-opt',
              'no-new-privileges:true', '--user', '501:20', '--network', 'platform-db',
              '--memory', '256m', '--cpus', '0.5', '--mount',
              f'type=bind,src={password},dst=/run/secrets/database_password,readonly',
              '--env', f'DATABASE_URL=postgres://{NAME}_owner@postgres:5432/{NAME}',
              '--env', 'DATABASE_PASSWORD_FILE=/run/secrets/database_password',
              candidate, 'bun', 'server/migrate.ts'])


def prepare(candidate, current):
    core.backup_database(NAME)
    migrate(candidate)
    core.log('owner migrations applied; runtime remains restricted')


APP = core.App(
    name='big-day-planner', title='Big Day Planner',
    image='ghcr.io/kylescudder/big-day-planner', repo='kylescudder/big-day-planner',
    image_var='BIG_DAY_PLANNER_IMAGE', service='web', app_dir=Path(__file__).resolve().parents[1],
    health=health, accept=accept, prepare=prepare, public_status=True, backups=True)

if __name__ == '__main__':
    core.cli(APP, __file__)
