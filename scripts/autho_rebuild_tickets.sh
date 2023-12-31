#!/bin/bash

echo "####"
echo "BUILD: ernestmr/mk-tickets"
eval $(minikube -p minikube docker-env)
pwd
cd ./tickets
isupgrade=$1
if [ "$isupgrade"  == 'u' ]
then 
    npm update @qptickets/common --save
fi
# 
docker build -t ernestmr/mk-tickets . 

#kubectl delete pod $(kubectl get pods | awk '/^tickets-depl-.*$/{print $1}')
#echo "Wait ..."
#sleep 2
#kubectl get pods
echo "Done"
#kubectl logs -f $(kubectl get pods | awk '/^tickets-depl-.*$/{print $1}')