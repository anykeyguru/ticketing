echo "STOPPING"
echo ""
echo "INGRESS"
kubectl delete -f infra/k8s/ingress-srv.yaml

sleep 5
echo ""
echo "STOPPING DEPLOYMENTS..."
kubectl delete -f infra/k8s/auth-depl.yaml
kubectl delete -f infra/k8s/client-depl.yaml
kubectl delete -f infra/k8s/orders-depl.yaml
kubectl delete -f infra/k8s/tickets-depl.yaml
kubectl delete -f infra/k8s/expiration-depl.yaml
kubectl delete -f infra/k8s/payments-depl.yaml

echo "Done"

sleep 5
echo ""
echo "STOPPING DATABASES..."
#kubectl delete -f infra/k8s/auth-mongo-depl.yaml
kubectl delete -f infra/k8s/tickets-mongo-depl.yaml
#kubectl delete -f infra/k8s/orders-mongo-depl.yaml
#kubectl delete -f infra/k8s/payments-mongo-depl.yaml
echo "Done"

sleep 5
echo ""
echo "STOPPING VOLUMES..."
kubectl delete -f infra/k8s/ticket-mongo-pv.yaml
kubectl delete -f infra/k8s/auth-mongo-pv.yaml
kubectl delete -f infra/k8s/order-mongo-pv.yaml
kubectl delete -f infra/k8s/payments-mongo-pv.yaml
kubectl delete -f infra/k8s/service-pv.yaml
echo "Done"

echo ""
echo "STOPPING NATS..."
kubectl delete -f infra/k8s/nats-depl.yaml
echo "STOPPING EXPIRATION REDIS..."
kubectl delete -f infra/k8s/expiration-redis-depl.yaml
echo "Done"

echo "INFRA STOPPED"
echo "====================================================="
echo "BACKUP DB"
minikube ssh -- sudo  rsync -av --delete /home/docker/appdata /hosthome/ernest/projects/ticketing/data
echo "Done"










kubectl get pods