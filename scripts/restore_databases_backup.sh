#!/usr/bin/env bash
minikube ssh -- sudo  rsync -avp --delete  /hosthome/ernest/projects/ticketing/data/appdata/* /home/docker/appdata/