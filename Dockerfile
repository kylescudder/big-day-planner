FROM oven/bun:1.4.4@sha256:1d22548f177f4ff38e0c15baa3c2c46c6c2060ba2d1bc573bb4720b407548f1d AS dependencies
WORKDIR /app
COPY package.json bun.lock ./
ENV HUSKY=0
RUN bun install --frozen-lockfile --network-concurrency 8

FROM dependencies AS build
COPY . .
RUN bun run typecheck && bun run build

FROM dependencies AS production-dependencies
RUN rm -rf node_modules && bun install --production --frozen-lockfile --ignore-scripts --network-concurrency 8

FROM oven/bun:1.4.4@sha256:1d22548f177f4ff38e0c15baa3c2c46c6c2060ba2d1bc573bb4720b407548f1d AS runtime
WORKDIR /app
ARG BIG_DAY_PLANNER_REVISION=development
LABEL org.opencontainers.image.source="https://github.com/kylescudder/big-day-planner" \
      org.opencontainers.image.revision="${BIG_DAY_PLANNER_REVISION}"
ENV NODE_ENV=production PORT=3000 TZ=Europe/London
ENV BIG_DAY_PLANNER_REVISION=${BIG_DAY_PLANNER_REVISION}
COPY --from=production-dependencies --chown=bun:bun /app/node_modules ./node_modules
COPY --from=build --chown=bun:bun /app/dist ./dist
COPY --chown=bun:bun package.json tsconfig.json ./
COPY --chown=bun:bun drizzle ./drizzle
COPY --chown=bun:bun server/index.ts server/migrate.ts ./server/
COPY --chown=bun:bun src/lib/sentry.ts ./src/lib/
COPY --chown=bun:bun src/server/db/connection.ts ./src/server/db/
COPY --chown=bun:bun deploy/healthcheck.ts deploy/verify.ts ./deploy/
USER bun
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=10s --start-period=15s --retries=3 \
  CMD ["bun", "deploy/healthcheck.ts"]
CMD ["bun", "server/index.ts"]
