#!/bin/bash

kubectl config use-context docker-desktop

VERSION=$(cat ./helm/citsbot/Chart.yaml | grep version | awk '{ print $2 }')
docker build -t citsbot:${VERSION} . --target dev
