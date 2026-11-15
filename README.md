# Big Day Planner

Plan your big day with this site! Guests open their invitation with a unique
code to RSVP, choose their menu and request a song; the couple manage guests
and wedding details at `/guests`.

Built with TanStack Start, React, a tRPC API, Better Auth (see `deploy/README.md`), Drizzle and PostgreSQL, using Bun.

## Development

```sh
bun install
cp .env.example .env    # then fill in the keys
./start-database.sh
bun run db:migrate
bun run dev
```

- `bun run db:generate` creates a migration after changing `src/server/db/schema.ts`.
- `bun run typecheck`, `bun run format:check` and
  `TEST_DATABASE_URL=… bun run test` match CI.

## Deployment

Merges to `main` are built, attested and deployed to the self-hosted platform. See
[deploy/README.md](deploy/README.md).

## Self-contained browser tests

Run `bun install --frozen-lockfile`, install Chromium with
`bunx --no-install playwright install chromium`, then run `bun run test:e2e`.
Homebrew PostgreSQL tools (`brew install postgresql@18`) must be on PATH.
The harness creates a temporary local cluster, migrates it, seeds a verified
throwaway account with a random password, builds the app, and signs in through
the real password form. It stops and removes the cluster on completion.
No production accounts or stored credentials are needed.

Tests live permanently in `e2e/`. Reports are ignored artifacts.
`E2E_SKIP_BUILD=1` reuses a current build. `E2E_DATABASE_URL` may name a
disposable local database with the prefix in `e2e/run.ts`; migrations and
fixtures modify that database, so never point it at valuable data.
Passkeys, real email delivery and production are not exercised.
