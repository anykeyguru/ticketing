eval $(minikube -p minikube docker-env)

cd /home/ernest/ticketing
make rebuild-client
kubectl delete pod $(kubectl get pods | awk '/^client-depl-.*$/{print $1}')
