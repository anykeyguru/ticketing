# Load environment variables from .env file
include .env
export
init:
	@make eval
	@kubectl create secret generic next-telemetry-disable  --from-literal=NEXT_TELEMETRY_DISABLED=1 || true
	@kubectl create secret generic next-telemetry --from-literal=NEXT_TELEMETRY=1 || true
	@kubectl create secret generic jwt-secret --from-literal=JWT_KEY=$(JWT_KEY) || true
	@kubectl create secret generic client-baseurl --from-literal=CLIENT_BASE_URL=$(CLIENT_BASE_URL) || true
	@kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=$(STRIPE_KEY) || true
	@kubectl create secret generic stripe-public --from-literal=STRIPE_PUB_KEY=$(STRIPE_PUB_KEY) || true
	@kubectl create secret generic timezone-secret --from-literal=TIMEZONE=$(TIMEZONE) || true

minikube-create-docker:
	@minikube stop || true
	@minikube delete || true
	@rm -rf ~/.minikube
	@minikube start --memory 4096 --cpus 4 --driver docker --addons ingress
	@sleep 20
	@echo "define owner for /data folder"
	@minikube ssh -- mkdir /data
	@minikube ssh -- sudo chown -R docker:docker /data
	@sleep 20
	@echo "initialise environments vars"
	@make init
minikube-create-vbox:
	@minikube stop || true
	@minikube delete || true
	@rm -rf ~/.minikube
	@minikube start --memory 4096 --cpus 4 --driver virtualbox  --cache-images --addons ingress
	@sleep 20
	@echo "define owner for /data folder"
	@minikube ssh -- mkdir /data
	@minikube ssh -- sudo chown -R docker:docker /data
	@sleep 20
	@echo "initialise environments vars"
	@minikube kubectl -- get pods
	@make init

eval:
	@eval $(minikube -p minikube docker-env)  || true

start:
	@make eval
	@./scripts/start_app.sh


stop:
	@make eval
	@./scripts/stop_app.sh

restart:
	@make eval
	@make stop  || true
	@make start  || true


rebuild-client:
	@make eval
	@./scripts/rebuild_app.sh client $(ARG)
rebuild-auth:
	@make eval
	@./scripts/rebuild_app.sh auth $(ARG)
rebuild-tickets:
	@make eval
	@./scripts/rebuild_app.sh tickets $(ARG)
rebuild-orders:
	@make eval
	@./scripts/rebuild_app.sh orders $(ARG)
rebuild-expiration:
	@make eval
	@./scripts/rebuild_app.sh expiration $(ARG)
rebuild-payments:
	@make eval
	@./scripts/rebuild_app.sh payments $(ARG)

docker-push:
	@make eval
	@docker push ernestmr/mk-orders
	@make eval
	@docker push ernestmr/mk-auth
	@make eval
	@docker push ernestmr/client
	@make eval
	@docker push ernestmr/mk-tickets
	@make eval
	@docker push ernestmr/mk-expiration
	@make eval
	@docker push ernestmr/mk-payments

rebuildall:
ifdef ARG
	@echo "Performing update param - $(ARG)..."
	@sleep 5
endif

ifeq ($(strip $(ARG)),c)
	# Argument is "c"
	@echo "Argument is equal to 'c'"
	# Handle the case when the argument is "c"
	# ...
endif
ifeq ($(strip $(ARG)),u)
	# Argument is "u"
	@echo "Argument is equal to 'u'"
	# ...
endif
	@make rebuild-client
	@make rebuild-auth
	@make rebuild-tickets
	@make rebuild-orders
	@make rebuild-expiration
	@make rebuild-payments

sync-common:
	@./scripts/sync_common.sh
	@make rebuildall

#	@./scripts/autho_log_client.sh


shutdown-global:
	@kubectl delete -f infra/k8s || true
	@minikube stop

powerup-global:
	@minikube start
	@make init

log-client:
	@./scripts/autho_log_client.sh

sk-deploy:
	@make eval
	@skaffold deploy

clean-images:
	@docker rmi $(shell docker images -f "dangling=true" -q) -f

restart-nats:
	@./scripts/autho_restart_nats.sh

logs:
	@kubectl get pods --namespace default -o jsonpath='{range .items[*]}{.metadata.name}{"\n"}{end}' | xargs -I {} kubectl logs {} --namespace default
.PHONY:  eval