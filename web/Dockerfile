FROM node:jod-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_OPTIONS="--max-old-space-size=8192"
RUN corepack enable
RUN npm install -g corepack@latest
RUN pnpm install -g turbo@2.x

# PRUNE WORKSPACE
# Note: Here we cannot use --docker, as is recommended, since the generated
# json directory does not allow linking package.json executable files
FROM base AS builder
COPY . .
RUN turbo prune @databank/web

# INSTALL DEPENDENCIES AND BUILD
FROM base AS installer
COPY tsconfig.base.json vitest.config.js vitest.workspace.js ./
COPY --from=builder /app/out/ .
RUN pnpm install --frozen-lockfile 
RUN turbo build --filter=@databank/web

# RUN SERVER
FROM base AS runner
RUN pnpm install -g @import-meta-env/cli@0.6.8 http-server@14.1.1
COPY --from=installer /app/web/.env.public /app/web/dist/ ./
CMD [ "sh", "-c", "import-meta-env -x .env.public -p index.html && http-server -s -p 80 -P http://localhost:80? --gzip ." ]
