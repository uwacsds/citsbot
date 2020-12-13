#!/bin/bash

sh ./local-set-context.sh

VERSION=$(cat ./helm/citsbot/Chart.yaml | grep version | awk '{ print $2 }')
docker build -t citsbot:${VERSION} . --target dev
