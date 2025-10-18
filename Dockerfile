FROM node:22-alpine

RUN npm install -g pnpm@10.13.1

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install

COPY dist ./dist

RUN echo "Verifying copied files:" && ls -la dist

ARG PORT=4001
ENV PORT=${PORT}

EXPOSE ${PORT}

# Healthcheck for container monitoring
HEALTHCHECK --interval=5s --timeout=3s \
    CMD curl --fail --retry 3 --retry-delay 5 http://localhost:${PORT}/health || exit 1


CMD [ "node", "./dist/app.js" ]