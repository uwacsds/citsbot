#!/bin/bash


CONFIG_FILE_PATH=$1
CONFIG_FILE=$(jq -c . < $CONFIG_FILE_PATH)

ENV_BASE=$(cat .env)
ENV_CONFIG=$(echo "CONFIG='$CONFIG_FILE'")

echo $ENV_BASE > .env.generated
echo $ENV_CONFIG >> .env.generated
