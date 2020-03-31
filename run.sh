#!/bin/bash

docker build -t citsbot . && docker run -it -v src:/app/src --env-file .env citsbot
