FROM node:22-bookworm-slim AS base

RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    netcat-openbsd \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@11.18.0

WORKDIR /app

# Copy dependency definitions
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/auth-client/package.json ./packages/auth-client/
COPY packages/config/package.json ./packages/config/
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/database/package.json ./packages/database/
COPY packages/ui/package.json ./packages/ui/
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY apps/demo-app-a/package.json ./apps/demo-app-a/
COPY apps/demo-app-b/package.json ./apps/demo-app-b/

# Install all monorepo dependencies
RUN pnpm install

# Copy source code
COPY packages/ ./packages/
COPY apps/ ./apps/

# Generate Prisma Client and build internal workspace packages
RUN pnpm db:generate && \
    pnpm --filter @ls-auth/config run build && \
    pnpm --filter @ls-auth/contracts run build && \
    pnpm --filter @ls-auth/ui run build && \
    pnpm --filter @ls-auth/auth-client run build && \
    pnpm --filter @ls-auth/database run build

# Stage: API
FROM base AS api
WORKDIR /app
COPY infra/docker/api-entrypoint.sh /app/api-entrypoint.sh
RUN chmod +x /app/api-entrypoint.sh && pnpm --filter @ls-auth/api run build
EXPOSE 3001
ENTRYPOINT ["/bin/sh", "/app/api-entrypoint.sh"]

# Stage: Web Portal
FROM base AS web
WORKDIR /app
EXPOSE 3000
CMD ["pnpm", "dev:web"]

# Stage: Demo App A
FROM base AS demo-app-a
WORKDIR /app
EXPOSE 4001
CMD ["pnpm", "dev:demo-a"]

# Stage: Demo App B
FROM base AS demo-app-b
WORKDIR /app
EXPOSE 4002
CMD ["pnpm", "dev:demo-b"]
