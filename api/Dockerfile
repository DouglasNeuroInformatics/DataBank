FROM node:lts-alpine AS runtime

FROM runtime AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_OPTIONS="--max-old-space-size=8192"
RUN corepack enable
RUN pnpm install -g turbo@latest

# PRUNE SOURCE CODE
FROM base AS pruner
COPY . .
RUN turbo prune @databank/api

# INSTALL DEPENDENCIES AND BUILD
FROM base AS installer
COPY tsconfig.base.json ./
COPY --from=pruner /app/out/ .
RUN pnpm install --frozen-lockfile 
RUN turbo build --filter=@databank/api

# RUN SERVER
FROM runtime AS runner
WORKDIR /app
COPY --from=installer /app/api/dist/ /app/dist/
COPY --from=installer /app/api/public/ /app/public/
COPY --from=installer /app/api/dist/prisma/client/ /.prisma/client/
RUN echo '{ "type": "module" }' > package.json
USER node
CMD [ "node", "./dist/app.js" ]
