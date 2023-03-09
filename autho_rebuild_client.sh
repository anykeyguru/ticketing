eval $(minikube -p minikube docker-env)
# cd ./auth
# docker build -t ernestmr/mk-auth .
# cd ..
cd ./client
docker build -t ernestmr/client .

kubectl delete pod $(kubectl get pods | awk '/^client-depl-.*$/{print $1}')
echo "Wait ..."
sleep 2
kubectl get pods
echo "Done"