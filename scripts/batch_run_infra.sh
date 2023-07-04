#!/bin/bash
search_dir=./infra/k8s/local_dev
for entry in "$search_dir"/*
do
  echo ""
  echo "run $entry"
  kubectl apply -f $entry
  sleep 6
done
