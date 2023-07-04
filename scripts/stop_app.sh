echo "STOPPING"
echo ""
echo "INGRESS"
INFRA_PATH=infra/k8s-local_dev
INGRESS_PATH=infra/k8s-dev
kubectl delete -f $INGRESS_PATH/ingress-srv.yaml

sleep 5
echo ""
echo "STOPPING DEPLOYMENTS..."
kubectl delete -f $INFRA_PATH/auth-depl.yaml
kubectl delete -f $INFRA_PATH/client-depl.yaml
kubectl delete -f $INFRA_PATH/orders-depl.yaml
kubectl delete -f $INFRA_PATH/tickets-depl.yaml
kubectl delete -f $INFRA_PATH/expiration-depl.yaml
kubectl delete -f $INFRA_PATH/payments-depl.yaml

echo "Done"

sleep 5
echo ""
echo "STOPPING DATABASES..."
kubectl delete -f $INFRA_PATH/tickets-mongo-depl.yaml
echo "Done"

sleep 5
echo ""
echo "STOPPING VOLUMES..."
kubectl delete -f $INFRA_PATH/ticket-mongo-pv.yaml
echo "Done"

echo ""
echo "STOPPING NATS..."
kubectl delete -f $INFRA_PATH/nats-depl.yaml
echo "STOPPING EXPIRATION REDIS..."
kubectl delete -f $INFRA_PATH/expiration-redis-depl.yaml

echo "INFRA STOPPED"
echo "Done"


kubectl get pods