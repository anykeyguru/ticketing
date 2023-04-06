eval $(minikube -p minikube docker-env)
kubectl logs -f $(kubectl get pods -n ingress-nginx | awk '/^ingress-nginx-controller-.*$/{print $1}') -n ingress-nginx | lnav