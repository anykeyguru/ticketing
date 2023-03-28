eval $(minikube -p minikube docker-env)
cd ./auth
docker build --no-cache -t ernestmr/mk-auth . 

kubectl delete pod $(kubectl get pods | awk '/^auth-depl-.*$/{print $1}')
echo "Wait ..."
sleep 2
kubectl get pods
echo "Done"