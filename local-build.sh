#!/bin/bash

./local-set-context.sh

VERSION=$(cat ./helm/citsbot/Chart.yaml | grep version | awk '{ print $2 }')
docker build -t citsbot:${VERSION} .

# kind uses a separate daemon to the host, so images built on the host need to be transferred to it
LOCAL_KUBE_CONTEXT=$(kubectl config get-contexts | grep kind | sed -e 's/^[ |*]*//' | sed -e 's/\(^[^ ]*\).*$/\1/')
kind load docker-image citsbot:${VERSION} --name "$LOCAL_KUBE_CONTEXT"
