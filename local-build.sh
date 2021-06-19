#!/bin/bash

sh ./local-set-context.sh

VERSION=$(cat ./helm/citsbot/Chart.yaml | grep version | awk '{ print $2 }')
docker build -t citsbot:${VERSION} .

if [[ "$LOCAL_KUBE_CONTEXT" = "minikube" ]]; then
  # minikube uses a separate daemon to the host, so images built on the host need to be transferred to it
  docker save citsbot:${VERSION} | (eval $(minikube docker-env) && docker load)
elif [[ ! -z "$LOCAL_KUBE_CONTEXT" ]]; then
  # kind uses a separate daemon to the host, so images built on the host need to be transferred to it
  kind load docker-image citsbot:${VERSION} --name $LOCAL_KUBE_CONTEXT
fi
