#!/bin/bash

sh ./local-set-context.sh

if [[ $(helm list -n citsbot | grep citsbot) ]]; then
    helm uninstall -n citsbot citsbot
fi
