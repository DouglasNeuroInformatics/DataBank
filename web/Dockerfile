FROM node:lts-alpine AS runtime

FROM runtime AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_OPTIONS="--max-old-space-size=8192"
RUN corepack enable
RUN pnpm install -g turbo@latest

# PRUNE SOURCE CODE
FROM base AS builder
COPY . .
RUN turbo prune @databank/web

# INSTALL DEPENDENCIES AND BUILD
FROM base AS installer
COPY tsconfig.base.json ./
COPY --from=builder /app/out/ .
RUN pnpm install --frozen-lockfile 
RUN turbo build --filter=@databank/web

# RUN SERVER
FROM runtime AS runner
RUN npm install -g @import-meta-env/cli@0.7.0  http-server@14.1.1
COPY --from=installer /app/web/.env.public /app/web/dist/ ./
CMD [ "sh", "-c", "import-meta-env -x .env.public -p index.html && http-server -s -p 80 -P http://localhost:80? ." ]
