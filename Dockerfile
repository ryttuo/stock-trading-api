FROM node:20.19.0-alpine

RUN node --version | grep -q "v20.19.0" || (echo "Node version must be 20.19.0" && exit 1)

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production
ENV DATABASE_URL=postgresql://postgres:postgres@postgres:5432/stock_trading
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379
ENV CRON_RUN="0 0 * * *"
ENV SMTP_HOST=maildev
ENV SMTP_PORT=1025
ENV SMTP_USER=
ENV SMTP_PASS=

CMD ["npm", "run", "start:prod"] 