#!/usr/bin/env bash
kubectl apply -f infra/k8s/nats-depl.yaml

sleep 5
kubectl apply -f infra/k8s/orders-mongo-depl.yaml

sleep 5
kubectl apply -f infra/k8s/orders-depl.yaml

sleep 5
kubectl apply -f infra/k8s/ingress-srv.yaml