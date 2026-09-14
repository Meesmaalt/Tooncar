# Multi-stage build for Toon Car Racing 3D
# 1. Build Stage: Compiles Vite frontend & Node backend
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package manifests first for efficient Docker layer caching
COPY package.json ./

# Install all dependencies (including devDependencies needed for build)
RUN npm install

# Copy source code and project configuration files
COPY . .

# Build frontend and bundled backend into dist/
RUN npm run build

# 2. Production Runtime Stage: Minimal lightweight container
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package files and install only production dependencies
COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force

# Copy compiled assets and standalone server bundle from builder
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Healthcheck using Node 22 built-in fetch
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/api/rooms').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["node", "dist/server.cjs"]

