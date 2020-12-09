#!/bin/bash

POD_NAME=$(kubectl get pods -n citsbot -o jsonpath="{.items[0].metadata.name}")

if [[ -z "$POD_NAME" ]]; then
  echo "Could not find any running pods"
fi

kubectl logs -n citsbot --follow $POD_NAME
