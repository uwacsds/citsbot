#!/bin/bash

sh ./local-set-context.sh

if [[ $(sudo helm list -n citsbot | grep citsbot) ]]; then
    sudo helm uninstall -n citsbot citsbot
fi
