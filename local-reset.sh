#!/bin/bash

sh ./local-set-context.sh

sh ./local-stop.sh && ./local-build.sh && ./local-start.sh && ./local-tail.sh
