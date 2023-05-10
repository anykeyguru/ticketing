eval $(minikube -p minikube docker-env)
kubectl logs -f $(kubectl get pods | awk '/^orders-depl-.*$/{print $1}') | lnav