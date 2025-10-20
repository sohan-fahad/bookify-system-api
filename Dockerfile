FROM node:22-alpine

RUN apk add --no-cache dumb-init curl
RUN npm install -g pnpm@10.13.1

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
COPY .env .

RUN pnpm build
RUN pnpm prune --prod

ENV PORT=4001
EXPOSE 4001

HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
  CMD curl --fail http://localhost:${PORT}/health || exit 1

CMD ["dumb-init", "node", "dist/app.js"]