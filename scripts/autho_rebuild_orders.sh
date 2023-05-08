#!/bin/bash
image='ernestmr/mk-orders'
podname='orders-depl'
echo "####"
echo "BUILD: $image"
eval $(minikube -p minikube docker-env)
pwd
cd ./orders
isupgrade=$1
if [ "$isupgrade"  == 'u' ]
then 
    npm update @qptickets/common --save
fi
#
if [ "$isupgrade"  == 'c' ]
then
    docker build --no-cache -t  $image .
else
    docker build -t $image .
fi


#kubectl delete pod $(kubectl get pods | awk '/^$podname-.*$/{print $1}')
#echo "Wait ..."
#sleep 2
#kubectl get pods
echo "Done"
#kubectl logs -f $(kubectl get pods | awk '/^$podname-.*$/{print $1}')