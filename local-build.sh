#!/bin/bash

sh ./local-set-context.sh

VERSION=$(cat ./helm/citsbot/Chart.yaml | grep version | awk '{ print $2 }')
docker build -t citsbot:${VERSION} . --target dev

# minikube uses a separate daemon to the host, so images built on the host need to be transferred to it
if [[ "$LOCAL_KUBE_ENV" = "minikube" ]]; then
  docker save citsbot:${VERSION} | (eval $(minikube docker-env) && docker load)
fi
