# Vânător — single-service image: builds the web app and serves the API + static
# frontend from one Bun process (packages/web/src/__server.ts).
FROM oven/bun:1

WORKDIR /app

# Skip the heavy Electron binary download from the desktop package — the web
# service does not need it.
ENV ELECTRON_SKIP_BINARY_DOWNLOAD=1
ENV NODE_ENV=production

COPY . .

RUN bun install
RUN cd packages/web && bun run build

# Render provides $PORT; __server.ts reads it (falls back to 4200 locally).
WORKDIR /app/packages/web
EXPOSE 4200
CMD ["bun", "src/__server.ts"]
