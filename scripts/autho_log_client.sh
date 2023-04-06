eval $(minikube -p minikube docker-env)
kubectl logs -f $(kubectl get pods | awk '/^client-depl-.*$/{print $1}') | lnav