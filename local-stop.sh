#!/bin/bash

kubectl config use-context docker-desktop

if [[ $(helm list -n citsbot | grep citsbot) ]]; then
    helm uninstall -n citsbot citsbot
fi
