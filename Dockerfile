FROM node:22-alpine

RUN npm install -g pnpm@10.13.1

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

RUN pnpm prune --prod

RUN echo "Verifying copied files:" && ls -la dist

ARG PORT=4001
ENV PORT=${PORT}
ENV MODE="production"
ENV MONGO_URI="mongodb://admin:123456178@db:27017/referral-system-db?authSource=admin"

EXPOSE ${PORT}

# Healthcheck for container monitoring
HEALTHCHECK --interval=5s --timeout=3s \
    CMD curl --fail --retry 3 --retry-delay 5 http://localhost:${PORT}/health || exit 1


CMD ["dumb-init", "node", "dist/index.js"]