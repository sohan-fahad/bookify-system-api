# FROM node:22-alpine

# RUN apk add --no-cache dumb-init curl
# RUN npm install -g pnpm@10.13.1

# WORKDIR /usr/src/app

# COPY package.json pnpm-lock.yaml ./
# RUN pnpm install --frozen-lockfile

# COPY . .

# RUN pnpm build
# RUN pnpm prune --prod

# ENV PORT=4001
# EXPOSE 4001

# HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
#   CMD curl --fail http://localhost:${PORT}/health || exit 1

# CMD ["dumb-init", "node", "dist/app.js"]


# Stage 1 — build the TypeScript app
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy dependency files
COPY pnpm-lock.yaml package.json tsconfig.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the app
COPY . .

# Build TypeScript code
RUN pnpm build

# Stage 2 — production image
FROM node:22-alpine

WORKDIR /app
RUN npm install -g pnpm

# Copy only needed files
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist

# Expose app port
EXPOSE 4001

# Default environment
ENV NODE_ENV=production

CMD ["node", "dist/app.js"]
