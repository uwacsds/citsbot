#!/bin/bash

if [ -z "$LOCAL_KUBE_CONTEXT" ]; then
  LOCAL_KUBE_CONTEXT='docker-desktop'
fi

kubectl config use-context $LOCAL_KUBE_CONTEXT
