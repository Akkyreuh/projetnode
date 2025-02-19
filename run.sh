#!/bin/bash
docker network create networknode
docker run -d --name databasenode --network networknode --network-alias databasenode mongo
docker build -t my-node-app .
docker run -d --name conteneurnode --network networknode my-node-app

