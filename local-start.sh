#!/bin/bash

sh ./local-set-context.sh

. .env
if [ -z "$DISCORD_TOKEN" ]; then
  echo "DISCORD_TOKEN is not set in .env"
  exit 1
fi
BOT_CONFIG_FILE="config.local.json"

sudo helm upgrade -i citsbot ./helm/citsbot \
  --namespace citsbot --create-namespace \
  -f ./helm/citsbot/values.local.yaml \
  --set localSecrets.token=$DISCORD_TOKEN
