FROM node:20-bookworm-slim

RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    fonts-noto-color-emoji \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

ENV CHROME_PATH=/usr/bin/chromium
ENV NODE_ENV=production
ENV PORT=3847
ENV HOST=0.0.0.0

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY server.js ./
COPY public ./public
COPY data/templates ./data/templates

RUN mkdir -p uploads output data

EXPOSE 3847

CMD ["node", "server.js"]
