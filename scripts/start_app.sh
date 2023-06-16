echo "START"
echo ""
echo "START NATS..."
kubectl apply -f infra/k8s/nats-depl.yaml
echo "START EXPIRATION REDIS..."
kubectl apply -f infra/k8s/expiration-redis-depl.yaml

echo "Done"

sleep 5
echo ""
echo "START VOLUMES..."
kubectl apply -f infra/k8s/ticket-mongo-pv.yaml
kubectl apply -f infra/k8s/auth-mongo-pv.yaml
kubectl apply -f infra/k8s/order-mongo-pv.yaml
kubectl apply -f infra/k8s/payments-mongo-pv.yaml
kubectl apply -f infra/k8s/service-pv.yaml
echo "Done"

sleep 10
echo ""
echo "START DATABASES..."
kubectl apply -f infra/k8s/auth-mongo-depl.yaml
sleep 5
kubectl apply -f infra/k8s/tickets-mongo-depl.yaml
sleep 5
kubectl apply -f infra/k8s/orders-mongo-depl.yaml
sleep 5
kubectl apply -f infra/k8s/payments-mongo-depl.yaml
echo "Done"

sleep 30
echo ""
echo "START DEPLOYMENTS..."
kubectl apply -f infra/k8s/auth-depl.yaml
sleep 30
kubectl apply -f infra/k8s/tickets-depl.yaml
sleep 30
kubectl apply -f infra/k8s/orders-depl.yaml
sleep 30
kubectl apply -f infra/k8s/client-depl.yaml
sleep 30
kubectl apply -f infra/k8s/expiration-depl.yaml
sleep 30
kubectl apply -f infra/k8s/payments-depl.yaml
echo "Done"

sleep 30
echo ""
echo "START INGRESS..."
kubectl apply -f infra/k8s/ingress-srv.yaml
echo "Done"

kubectl get pods
kubectl get ingress
echo "STARTING DONE"
echo "====================================================="
echo ""
