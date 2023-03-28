
init:
	@make eval
	@kubectl create secret generic next-telemetry-disable  --from-literal=NEXT_TELEMETRY_DISABLED=1 || true
	@kubectl create secret generic next-telemetry --from-literal=NEXT_TELEMETRY=1 || true
	@kubectl create secret generic jwt-secret --from-literal=JWT_KEY=secretword || true
	@kubectl create secret generic client-baseurl --from-literal=CLIENT_BASE_URL=https://ticketing.com || true

eval:
	@eval $(minikube -p minikube docker-env)  || true

start:
	@make eval
	@kubectl apply -f infra/k8s/

stop:
	@make eval
	@kubectl delete -f infra/k8s/

restart-dev:
	@make eval
	@kubectl delete -f infra/k8s/ || true
	@kubectl apply -f infra/k8s/

rebuild:
	@./autho_rebuild_client.sh
	@./autho_rebuild_auth.sh
	@./autho_rebuild_tickets.sh
#	@./autho_log_client.sh


shutdown-global:
	@kubectl delete -f infra/k8s || true
	@minikube stop

powerup-global:
	@minikube start
	@make init

log-client:
	@./autho_log_client.sh

sk-deploy:
	@make eval
	@skaffold deploy

clean-images:
	@docker rmi $(shell docker images -f "dangling=true" -q) -f

.PHONY: restart-dev eval