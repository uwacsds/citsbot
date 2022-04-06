#!/bin/bash

./local-set-context.sh

function is_pod_running() {
  POD_NAME=$(kubectl get pods -n citsbot -o jsonpath="{.items[0].metadata.name}")
  kubectl logs -n citsbot $POD_NAME >/dev/null 2>&1
  if [ $? -ne 0 ]; then
    return 1
  fi
  return 0
}

for i in {1..10}; do
  echo 'Checking if citsbot is up (attempt '$i')...'
  if is_pod_running; then
    echo 'Citsbot is running'
    break
  else
    if [ $i -eq 10 ]; then
      echo 'Citsbot failed to start after 10s'
      exit 1
    fi
    sleep 1
  fi
done

POD_NAME=$(kubectl get pods -n citsbot -o jsonpath="{.items[0].metadata.name}")
kubectl logs -n citsbot --follow $POD_NAME
