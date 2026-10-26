# Big Day Planner

Plan your big day with this site! Guests open their invitation with a unique
code to RSVP, choose their menu and request a song; the couple manage guests
and wedding details at `/guests`.

Built with TanStack Start, React, a tRPC API, Clerk, Drizzle and PostgreSQL, using Bun.

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
