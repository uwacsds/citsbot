#!/bin/bash

LOCAL_KUBE_CONTEXT=$(kubectl config get-contexts | grep kind | sed -e 's/^[ |*]*//' | sed -e 's/\(^[^ ]*\).*$/\1/')

kubectl config use-context $LOCAL_KUBE_CONTEXT
