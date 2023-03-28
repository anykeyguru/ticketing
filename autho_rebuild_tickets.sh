echo "####"
echo "BUILD: ernestmr/mk-tickets"
eval $(minikube -p minikube docker-env)
cd ./tickets
npm update @qptickets/common --save
docker build -t ernestmr/mk-tickets . 

kubectl delete pod $(kubectl get pods | awk '/^tickets-depl-.*$/{print $1}')
echo "Wait ..."
sleep 2
kubectl get pods
echo "Done"