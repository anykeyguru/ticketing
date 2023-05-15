#!/usr/bin/env bash
minikube ssh -- docker system prune

eval $(minikube -p minikube docker-env)
docker rmi $(docker images 'ernestmr/mk-orders' -a -q) \
              && docker rmi $(docker images 'ernestmr/mk-tickets' -a -q) \
              && docker rmi $(docker images 'ernestmr/mk-auth' -a -q) \
              && docker rmi $(docker images 'ernestmr/client' -a -q) \
