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
RESEND_API_KEY=<Resend sending key>
EMAIL_FROM_ADDRESS=<sender address on a domain verified in Resend>
SONG_REQUEST_EMAIL=<address that receives song requests>
# Optional: the postcode lookup is off unless both are set
GETADDRESS_URL=https://api.getaddress.io
GETADDRESS_API_KEY=<getAddress.io key>
UPLOADTHING_TOKEN=<UploadThing token>
BETTER_AUTH_URL=https://<public planner hostname>
BETTER_AUTH_SECRET=<stable, cryptographically random app-specific secret>
BREVO_API_KEY=<Big Day Planner transactional API key>
AUTH_EMAIL_FROM=<sender address on a domain verified in Brevo>
AUTH_EMAIL_DAILY_LIMIT=40
AUTH_ALLOWED_EMAILS=<couple's email>,<partner's email>
```

The previous keys lived in a Vercel project that has since been deleted;
collect or reissue them from each provider. Unknown variables in `app.env` are
ignored. `app.env` is ignored by Git and Docker; never print it or resolved
Compose output.

## Sign-in (Better Auth)

Planners sign in with Better Auth. The `0001_better_auth` migration adds
`auth_user`, `auth_session`, `auth_account`, `auth_verification`,
`auth_passkey`, `auth_rate_limit` and `auth_email_limit`; `0002_profile` adds
`user_profile`. They do not touch guests, details or any other wedding data.
The app has no per-user data: a session only decides that a request is signed
in. Access is the allowlist below.

The Better Auth settings above are required. Startup errors name missing
settings without printing values. `BETTER_AUTH_URL` must be `https://` in
production. Generate a secret of at least 32 characters and keep it stable
across releases. Keep it and the sending API key out of Git, image layers and
CI. `AUTH_ALLOWED_EMAILS` is the server-side allowlist: only these addresses
can get an account, receive sign-in mail or reach the guest list, uploads and
admin procedures. Access also needs a verified email, and removing an address
revokes access for existing sessions. The passkey RP ID is the exact hostname in
`BETTER_AUTH_URL`, with that same trusted origin. Changing these settings
requires recreating the app container.

After a deploy, check the homepage and guest pages without signing in, the
signed-out `/guests` redirect to `/auth/sign-in`, and sign-in for an
allowlisted address.

Planner sign-in lives at `/auth/<view>` and offers four methods, each linking
to the others: password (`/auth/sign-in`), email code (`/auth/email-otp`),
magic link (`/auth/magic-link`) and passkey. Forgot/reset password use
`/auth/forgot-password` and `/auth/reset-password`; `/sign-in` and
`/auth/sign-up` redirect to `/auth/sign-in`. All use the official Better Auth
UI shadcn components in the planner's colours; guest pages do not load them.
Every method returns to `/guests`, or to a same-site `?redirectTo=` path such as
`/profile`. Off-site `redirectTo`, `callbackURL` and reset `redirectTo` values
are refused (on the server and in the client's `safeAppPath`).

There is no sign-up. Accounts are created only for allowlisted addresses by an
email code or magic link; a password is added afterwards from Profile ("Set
password" sends a reset link) and then changed there. Passwords are 12–128
characters. A reset revokes existing sessions. Email codes are six digits,
valid once for ten minutes with five attempts, and stored as a keyed hash.
Magic links (10 minutes) are single-use and stored hashed; reset links (30
minutes) are single-use. All three share persistent limits: a 60-second
per-recipient resend cooldown, five emails per recipient per hour and an
app-wide budget (`AUTH_EMAIL_DAILY_LIMIT`, default 40 per rolling 24 hours),
plus per-IP limits on every auth endpoint. Other addresses receive the same
generic response and no email. On phones, magic links open wherever the mail
app opens links, so email codes remain the most reliable mobile method.
`/api/auth/*` forwards only the endpoints these screens use; everything else,
including sign-up, returns 404. Sessions last seven days.

Signed-in planners get an avatar menu (Better Auth UI `UserButton`) in the
guest list header with Profile and Sign out. Sign-out returns to the homepage.
`/profile` edits the display name and optional first/last names, shows the
verified email read-only, sets or changes the password and manages passkeys.
It also sets a profile photo, shown in the header menu. The photo goes to
`/api/profile/avatar`, which needs a
verified, still-allowlisted session and works only on that user's own photo.
Uploads are limited to 2 MB of JPEG, PNG or WebP, checked by signature,
re-encoded with `sharp` to a 256 px JPEG without metadata, and stored in the
`user_profile` table, so the photo is private and covered by the database
backups. It is served with `no-store`, `nosniff` and same-origin CORP. It never
goes to UploadThing, which stays for wedding images. Email codes remain the
recovery method. For mobile
reloads while waiting for a code, tab-scoped session storage keeps only the
pending email and request time for ten minutes; it never stores the code.

Brevo's free plan adds a `List-Unsubscribe` header even to transactional email,
which can show a mailing-list banner in some clients. See
[Brevo's header explanation](https://help.brevo.com/hc/en-us/articles/19100260472850-FAQs-About-list-unsubscribe-and-list-help-headers-in-emails).

## Database and recovery

The database is `big_day_planner`. Provision it with
`python3 /Users/kyle/platform/scripts/provision-project.py big_day_planner`
and register it for the weekly encrypted NAS backups. Only `runtime-password`
is mounted into the app. The owner password is mounted only into the one-shot
migration container; database credentials never enter GitHub, the image,
receiver or webhook.

Migrations are Drizzle SQL files in `drizzle/`, generated with
`bun run db:generate` and applied by `server/migrate.ts`. Drizzle records
applied migrations in `drizzle.__drizzle_migrations`, a schema the runtime role
cannot read or change; `server/migrate.ts` moves the journal there once from
`public`, where earlier releases kept it. `0000_baseline.sql`
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
