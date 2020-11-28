FROM node:14-alpine as base
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --pure-lockfile --network-timeout 600000
COPY tsconfig.json /app
COPY src/ /app/src/

FROM base as dev
CMD ["yarn", "watch"]

FROM base as builder
COPY jest.config.js /app
RUN yarn build
RUN yarn test dist/

FROM node:12-alpine as prod
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --pure-lockfile --network-timeout 600000 --prod
COPY --from=builder /app/dist/ ./dist/
CMD ["yarn", "start"]
