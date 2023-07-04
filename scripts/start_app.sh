echo "START"
echo ""
echo "START NATS..."
INFRA_PATH=infra/k8s-local_dev
INGRESS_PATH=infra/k8s-dev
SLEEPTIME=2
kubectl apply -f $INFRA_PATH/nats-depl.yaml
echo "START EXPIRATION REDIS..."
kubectl apply -f $INFRA_PATH/expiration-redis-depl.yaml

echo "Done"

sleep $SLEEPTIME
echo ""
echo "START VOLUMES..."
kubectl apply -f $INFRA_PATH/ticket-mongo-pv.yaml
kubectl apply -f $INFRA_PATH/service-pv.yaml
echo "Done"

sleep $SLEEPTIME
echo "START DATABASES..."
kubectl apply -f $INFRA_PATH/tickets-mongo-depl.yaml
sleep $SLEEPTIME
echo "Done"

sleep $SLEEPTIME
echo ""
echo "START DEPLOYMENTS..."
kubectl apply -f $INFRA_PATH/auth-depl.yaml
sleep $SLEEPTIME
kubectl apply -f $INFRA_PATH/tickets-depl.yaml
sleep $SLEEPTIME
kubectl apply -f $INFRA_PATH/orders-depl.yaml
sleep $SLEEPTIME
kubectl apply -f $INFRA_PATH/client-depl.yaml
sleep $SLEEPTIME
kubectl apply -f $INFRA_PATH/expiration-depl.yaml
sleep $SLEEPTIME
kubectl apply -f $INFRA_PATH/payments-depl.yaml
echo "Done"

sleep $SLEEPTIME
echo ""
echo "START INGRESS..."
kubectl apply -f $INGRESS_PATH/ingress-srv.yaml
echo "Done"

kubectl get pods
kubectl get ingress
echo "STARTING DONE"
echo "====================================================="
echo ""
