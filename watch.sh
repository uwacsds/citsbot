#!/bin/bash

# start containers
docker-compose up &

# watch for changes and restart
./venv/bin/watchmedo shell-command \
    --patterns="*.py" \
    --recursive \
    --command="docker-compose down -t 0 && docker-compose rm && docker-compose up" \
    .