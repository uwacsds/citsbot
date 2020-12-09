#!/bin/bash

. .env

if [ -z "$DISCORD_TOKEN" ]; then
  echo "DISCORD_TOKEN is not set in .env"
  exit 1
fi

VERSION=$(cat ./helm/citsbot/Chart.yaml | grep version | awk '{ print $2 }')
BOT_CONFIG_FILE="config.dev.json"

kubectl config use-context docker-desktop

# build
docker build -t citsbot:${VERSION} . --target dev

# uninstall old chart
if [[ $(helm list -n citsbot | grep citsbot) ]]; then
    helm uninstall -n citsbot citsbot
fi

# install
helm upgrade -i citsbot ./helm/citsbot \
  --namespace citsbot --create-namespace \
  -f ./helm/citsbot/values.local.yaml \
  --set localSecrets.token=$DISCORD_TOKEN \
  --set-file localSecrets.config=$BOT_CONFIG_FILE
