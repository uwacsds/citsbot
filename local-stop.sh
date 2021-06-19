#!/bin/bash

sh ./local-set-context.sh

sudo helm uninstall -n citsbot citsbot || true
