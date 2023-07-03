#!/usr/bin/env bash
minikube ssh -- sudo  rsync -av --delete /home/docker/appdata /hosthome/ernest/projects/ticketing/data