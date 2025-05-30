FROM oven/bun:1.1.0 AS builder

WORKDIR /app

COPY bun.lock package.json tsconfig.json ./
COPY src ./src

RUN bun install

RUN bun run build

FROM oven/bun:1.1.0 AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/bun.lockb /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

CMD ["bun", "dist/index.js"]
