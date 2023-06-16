#!/bin/bash

function help_me {
  echo "To build services"
  echo "orders service            : rebuild_app.sh orders"
  echo "auth service              : rebuild_app.sh auth"
  echo "client service            : rebuild_app.sh client"
  echo "tickets service           : rebuild_app.sh tickets"
  echo ""
  echo "To build with update and clean example"
  echo "tickets service           : rebuild_app.sh tickets u"
  echo ""
  echo "To build with no cache and clean example"
  echo "tickets service           : rebuild_app.sh tickets c"
}

# Define an associative array
declare -A images
declare -A paths
images["orders"]="ernestmr/mk-orders"
paths["orders"]="orders"

images["auth"]="ernestmr/mk-auth"
paths["auth"]="auth"

images["client"]="ernestmr/client"
paths["client"]="client"

images["tickets"]="ernestmr/mk-tickets"
paths["tickets"]="tickets"

images["expiration"]="ernestmr/mk-expiration"
paths["expiration"]="expiration"

images["payments"]="ernestmr/mk-payments"
paths["payments"]="payments"

# Get a value by key from the associative array
service_name=$1

if [ -z "$service_name" ]; then
  help_me
  exit
else
  # Check if the key $service_name exists
  if [[ ${images[$service_name]+abc} ]]; then
    echo "Name ['$service_name'] exists in the associative array images"
  else
    echo "Name ['$service_name'] does not exist in the associative array images"
    exit
  fi
  echo "START BUILD"
fi

image=${images[$service_name]}
path=${paths[$service_name]}


echo ""
echo "BUILD $image service"
echo "####"

eval $(minikube -p minikube docker-env)


echo "Building: $image"
cd ./"$path" || exit
pwd
sleep 3

isupgrade=$2
old_image=$(docker images "$image" -a -q)
echo $old_image
if [ "$isupgrade"  == 'u' ]
then
    echo ">> Removing old image $image"
    docker rmi $(docker images "$image" -a -q)
    docker image ls | grep $image
    npm update @qptickets/common --save
fi
#
if [ "$isupgrade"  == 'c' ]
then
    docker build --no-cache -t  $image .
else
    docker build -t $image .
    current_image=$(docker images "$image" -a -q)

fi

if [ "$old_image" != "$current_image" ]; then
  echo "The images are not equal"
  docker rmi $old_image
else
  echo "The images are equal"
fi
echo "current image ($current_image)"
docker image ls | grep $image
echo "Done"



