# Big Day Planner on the host

## Shared deployment service

This app is registered as `big-day-planner` in the central deployment registry
`/Users/kyle/platform/deploy-core/apps.json`. LaunchAgent
`com.kylescudder.deploy-core` runs the single installed engine. Application hooks
are `deploy/hooks.py`; the receiver, credentials, queues,
state and database contracts below remain app-specific. Manual deployment uses
`./deploy/host-deploy.sh sha256:<digest>`.

Engine updates, application registration, failure inspection and service rollback
are documented in [deploy-core](https://github.com/kylescudder/deploy-core).
There are no vendored engine files, lock files or sync PRs. Do not install an
app-specific LaunchAgent. Apply future engine changes once through the central service.

Every push to `main` runs **Release**. CI typechecks and builds the app with
the frozen Bun lockfile, checks formatting, runs Drizzle migrations and
repository tests against a disposable Postgres, and tests the webhook receiver
and host deployment gates. GitHub builds native AMD64/ARM64 images, publishes
an immutable GHCR manifest and attests its provenance. The workflow succeeds
only when the public `/healthz` reports that commit in
`X-Big-Day-Planner-Revision` and the host acknowledges the same commit and image
digest after completed acceptance checks.

This follows the Office Tracker deployment
(`kylescudder/thursday-office-tracker`); differences are noted below.

## Services and trust boundaries

- Public app: `vars.BIG_DAY_PLANNER_BASE_URL`, upstream `big-day-planner:3000`.
- Deploy hook: https://deploy-bigday.kylescudder.co.uk/hooks/big-day-planner.
- Checkout: `/Users/kyle/platform/apps/big-day-planner`.
- LaunchAgent: `com.kylescudder.deploy-core`, running as Colima's owner.
- Deployer: the centrally installed service; application behavior lives in `hooks.py`.
- Image: `ghcr.io/kylescudder/big-day-planner@sha256:<digest>`.
- `.env` (mode 0600, ignored by Git): holds only `BIG_DAY_PLANNER_IMAGE`, which
  the deployer rewrites after each healthy deploy. It may be empty (but must exist) before
  the first release; the deployer passes the candidate image explicitly to every
  Compose call, so no seeding is needed. `compose.yaml`
  refuses to run without an image, so manual `docker compose --env-file .env`
  commands only work after the first successful deploy.

The TanStack Start app runs as one non-root Bun container on `platform-web`
and internal `platform-db`, with no host ports, a read-only filesystem,
384 MiB / 1 CPU limits, bounded logs and a four-connection pool. It serves
the built client assets and the SSR handler from `server/index.ts`.

The receiver joins only `platform-web`, has no Docker socket, host shell
credentials or database access, and can write only its queue. It checks exact
paths, HMAC-SHA256 signatures, a five-minute timestamp window, request size and
queue bounds. Cloudflare Access protects the whole deploy hostname with one
Service Auth policy allowing only `github-big-day-planner-deploy`.

The host independently verifies provenance for `kylescudder/big-day-planner`,
`.github/workflows/release.yml`, `refs/heads/main` and GitHub-hosted runners
before pulling the exact digest. Deployments are serialized; queued requests
coalesce to the newest request.

## Application secrets

Unlike the Office Tracker, the app needs third-party keys. Create `app.env`
in the checkout with mode 0600, using unquoted single-line values:

```dotenv
CLERK_PUBLISHABLE_KEY=<production Clerk publishable key>
CLERK_SECRET_KEY=<matching Clerk secret key>
RESEND_API_KEY=<Resend sending key>
EMAIL_FROM_ADDRESS=<sender address on a domain verified in Resend>
SONG_REQUEST_EMAIL=<address that receives song requests>
# Optional: the postcode lookup is off unless both are set
GETADDRESS_URL=https://api.getaddress.io
GETADDRESS_API_KEY=<getAddress.io key>
UPLOADTHING_TOKEN=<UploadThing token>
```

Clerk's publishable key is read at runtime and sent to the browser during SSR,
so it is not baked into the image. Add the public origin to the Clerk
production instance. The previous keys lived in a Vercel project that has
since been deleted; collect or reissue them from each provider.
`app.env` is ignored by Git and Docker; never print it or resolved Compose output.

## Database and recovery

The database is `big_day_planner`. Provision it with
`python3 /Users/kyle/platform/scripts/provision-project.py big_day_planner`
and register it for the weekly encrypted NAS backups. Only `runtime-password`
is mounted into the app. The owner password is mounted only into the one-shot
migration container; database credentials never enter GitHub, the image,
receiver or webhook.

Migrations are Drizzle SQL files in `drizzle/`, generated with
`bun run db:generate` and applied by `server/migrate.ts`. Drizzle records
applied migrations in `public.__drizzle_migrations`. `0000_baseline.sql`
creates the current schema; the earlier migration history had drifted from
the schema and was replaced.

After verifying an image, the deployer saves a private pre-deploy `pg_dump`, retains
the latest 14 dumps, runs owner migrations and waits for application health.
`deploy/verify.ts` then checks the restricted runtime role, HTML and built
assets, the revision and cache headers, the signed-out admin redirect and upload
rejection, the removal of the old email endpoints, and guest page rendering
from a temporary guest that it always deletes. A failed migration leaves the
current app running. A failed acceptance check restores the previous image, which must pass the same
checks. If
there is no previous running image (the first release), the failed candidate is
stopped and kept for `docker logs`; the next deploy replaces it whatever its state,
and a stopped container is never used as a rollback target.
Migrations are not reversed, so schema changes must stay compatible with the
previous runtime.

### Importing the existing data

Do this once before switching DNS, after the first successful deploy has
created the schema. The old database is on Neon: copy the direct (not pooled)
connection string from the Neon console without echoing it, then:

```sh
pg_dump --data-only --no-owner --no-privileges \
  --exclude-table='*drizzle_migrations*' "$OLD_DATABASE_URL" > big-day-planner.sql
docker compose -f /Users/kyle/platform/compose.yaml exec -T --user postgres \
  postgres psql -v ON_ERROR_STOP=1 -d big_day_planner \
  -c 'SET ROLE big_day_planner_owner' -f - < big-day-planner.sql
```

Compare row counts per table between the old and new databases, keep the dump
in the protected archive, and delete the Neon project only after production is
verified on the host.

## Configuration and commands

GitHub's `production` environment permits `main` only. Its secrets are
`DEPLOY_WEBHOOK_SECRET`, `CF_ACCESS_CLIENT_ID` and `CF_ACCESS_CLIENT_SECRET`.
Repository variables are `DEPLOY_ENABLED=true` and `BIG_DAY_PLANNER_BASE_URL`.

From the checkout:

```sh
docker compose -f deploy/compose.deploy-hook.yaml --env-file .env.deploy-hook up -d --wait
launchctl print gui/501/com.kylescudder.deploy-core
tail -n 100 state/deploy.log
docker compose --env-file .env ps
```

Pause automatic deployment:

```sh
gh variable set DEPLOY_ENABLED --body false --repo kylescudder/big-day-planner
```

Redeploy or roll back to a previously attested main digest:

```sh
./deploy/host-deploy.sh sha256:<verified-main-digest>
```

Access must exist before registering the exact hook route. From the platform:

```sh
python3 scripts/hostname.py add big-day-planner-deploy deploy-bigday.kylescudder.co.uk --upstream big-day-planner-deploy-hook:9000 --path /hooks/big-day-planner --dry-run
python3 scripts/hostname.py add big-day-planner-deploy deploy-bigday.kylescudder.co.uk --upstream big-day-planner-deploy-hook:9000 --path /hooks/big-day-planner
```

## Database connection budget

The runtime role is limited to eight PostgreSQL connections. Application work
uses at most four, health checks at most one, and deployment verification or
database CLI work at most one. Sequential deployment commands use their own
one-connection client instead of importing the application pool. This leaves
two slots for operator connections during a release; owner migrations use a
separate role.

CI exercises the real deployment client against an eight-connection test role,
with all four application slots held open. Concurrent deployment queries must
share one backend, health must still connect, two spare slots must remain usable,
and a ninth connection must be rejected by PostgreSQL.
