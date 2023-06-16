#!/usr/bin/env bash
minikube ssh -- docker system prune

eval $(minikube -p minikube docker-env)
docker rmi $(docker images 'ernestmr/mk-orders' -a -q) -f \
              && docker rmi $(docker images 'ernestmr/mk-tickets' -a -q) -f \
              && docker rmi $(docker images 'ernestmr/mk-auth' -a -q) -f \
              && docker rmi $(docker images 'ernestmr/client' -a -q) -f \
              && docker rmi $(docker images 'ernestmr/mk-expiration' -a -q) -f \
              && docker rmi $(docker images 'ernestmr/mk-payment' -a -q) -f \
