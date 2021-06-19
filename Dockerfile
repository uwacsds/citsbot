FROM node:14-alpine as base
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --pure-lockfile --network-timeout 600000
COPY tsconfig.json /app
COPY src/ /app/src/
RUN yarn build

FROM node:14-alpine as prod
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --pure-lockfile --network-timeout 600000 --prod
COPY --from=base /app/dist/ ./dist/
CMD ["node", "/app/dist/start.js"]
