FROM node:lts-jod AS base
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
FROM base AS pruner
COPY . .
RUN turbo prune @databank/api

# INSTALL DEPENDENCIES AND BUILD
FROM base AS installer
COPY tsconfig.base.json vitest.config.js vitest.workspace.js ./
COPY --from=pruner /app/out/ .
RUN pnpm install --frozen-lockfile 
RUN turbo build --filter=@databank/api

# RUN SERVER
FROM base AS runner
COPY --from=installer /app/api/dist/ /app/dist/
RUN mkdir -p /app/uploads && chown node:node /app/uploads
USER node
CMD [ "node", "./dist/app.js" ]
