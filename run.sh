#!/bin/bash

docker build -t citsbot . \ # build the image
&& docker run --name citsbot -it -v src:/app/src --env-file .env citsbot \ # create and run a new container from the image
|| docker restart citsbot && docker container attach citsbot \ # if we already have a continer, restart and attach to it
; docker stop citsbot # finally always stop the container