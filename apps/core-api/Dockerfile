# Stage 1: Builder
FROM node:20-alpine AS builder

# Enable corepack to use pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy root workspace configs
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy the core-api package.json
COPY apps/core-api/package.json ./apps/core-api/

# Install dependencies across the workspace
RUN pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the core-api typescript code to javascript (into the /dist folder)
RUN pnpm --filter core-api build

# pnpm deploy isolates the specific package and its runtime dependencies
# into a single directory, stripping out devDependencies for production
RUN pnpm deploy --filter core-api --prod /app/pruned

# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy the isolated app from the builder stage
COPY --from=builder /app/pruned ./

# Standard port for core-api
EXPOSE 5000

# Start the compiled server code
CMD ["node", "dist/server.js"]
