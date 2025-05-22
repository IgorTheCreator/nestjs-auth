# Dockerfile для Nest.js
FROM bitnami/node:24.1.0 AS base

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

CMD ["npm", "run", "start:prod"]