FROM node:16-alpine as base
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 600000
COPY tsconfig.json /app
COPY src/ /app/src/
RUN yarn build

FROM node:16-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 600000 --prod
COPY --from=base /app/dist/ ./dist/
CMD ["node", "/app/dist/start.js"]
