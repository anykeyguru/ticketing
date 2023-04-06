echo "####"
echo "RESTARTIN NATS STREAM"
kubectl delete pod $(kubectl get pods | awk '/^nats-depl-.*$/{print $1}')
echo "Wait ..."
sleep 2
kubectl get pod $(kubectl get pods | awk '/^nats-depl-.*$/{print $1}')
echo "Done"