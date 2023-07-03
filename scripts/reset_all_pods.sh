#!/usr/bin/env bash

cd /home/ernest/ticketing
eval $(minikube -p minikube docker-env)

# Define the array
pods_arr=("nats-depl")
pods_arr+=("expiration-redis-depl")

pods_arr+=("auth-mongo-depl")
pods_arr+=("payments-mongo-depl")
pods_arr+=("tickets-mongo-depl")

pods_arr+=("auth-depl")
pods_arr+=("expiration-depl")
pods_arr+=("orders-depl")
pods_arr+=("payments-depl")
pods_arr+=("tickets-depl")
pods_arr+=("client-depl")

if [ $# -gt 0 ]; then
  pod=$(kubectl get pods --no-headers | awk -v name="$1" '$0 ~ name {print $1}')
  kubectl delete pod "$pod"
else
  for pod_name in "${pods_arr[@]}"; do
      pod=$(kubectl get pods --no-headers | awk -v name="$pod_name" '$0 ~ name {print $1}')
      if [[ -n "$pod" ]]; then
          kubectl delete pod "$pod"
        else
          echo "Pod '$pod_name' not found."
        fi
      sleep 5
  done
fi








