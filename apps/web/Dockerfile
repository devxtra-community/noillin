# Stage 1: Builder
FROM node:20-alpine AS builder

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy root workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy the specific web package.json (preserving the folder structure)
COPY apps/web/package.json ./apps/web/

# Install dependencies for the workspace
RUN pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the Next.js web application
RUN pnpm --filter web build

# Stage 2: Runner (Production Environment)
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Next.js standalone output automatically copies node_modules and required files
# We just need to copy the standalone directory from the builder
COPY --from=builder /app/apps/web/.next/standalone ./
# Copy static assets (standalone doesn't include public/ or static/ by default)
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# The standalone build creates an isolated server.js file inside apps/web
CMD ["node", "apps/web/server.js"]
