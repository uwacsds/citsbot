#!/bin/bash

./local-set-context.sh

./local-stop.sh && ./local-build.sh && ./local-start.sh && ./local-tail.sh
