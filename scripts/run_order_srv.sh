#!/usr/bin/env bash
INFRA_PATH=$INFRA_PATH
kubectl apply -f $INFRA_PATH/nats-depl.yaml

sleep 5
kubectl apply -f $INFRA_PATH/orders-mongo-depl.yaml

sleep 5
kubectl apply -f $INFRA_PATH/orders-depl.yaml

sleep 5
kubectl apply -f $INFRA_PATH/ingress-srv.yaml