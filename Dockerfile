FROM oven/bun:1.3.10-alpine AS build
WORKDIR /app

COPY . .

ARG VITE_API_BASE_URL=http://127.0.0.1:3000
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN if [ -f bun.lock ]; then bun install --frozen-lockfile; else bun install; fi
RUN bun run build

FROM caddy:2.11.2-alpine AS runtime
WORKDIR /srv

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /usr/share/caddy

EXPOSE 80
