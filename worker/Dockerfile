# Node image + Playwright Chromium (matches package-lock playwright version).
FROM node:22-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

COPY package.json package-lock.json ./
RUN npm ci

RUN npx playwright install-deps chromium
RUN npx playwright install chromium

COPY tsconfig.json ./
COPY scripts/worker.ts ./scripts/
COPY worker/start.sh ./worker/
COPY src ./src/

RUN chmod +x worker/start.sh

CMD ["./worker/start.sh"]
