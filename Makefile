#!make
PORT = 8080
SERVICE_NAME = tree_api
CONTAINER_NAME = $(SERVICE_NAME)
DOCKER_COMPOSE_TAG = $(SERVICE_NAME)_1


# Pipeline commands
setup:
	npm install

unit:
	npm run test

uncached-unit:
	npm run-script clear-cache; npm run-script test

integration: down-rm up
	docker compose -f ./docker-compose.yml run integration_tests jest -c jest.integration.config.ts ./ -i --forceExit --detectOpenHandles --no-cache

integration-dev:
	docker compose -f ./docker-compose.dev.yml -f ./docker-compose.inf.yml up --exit-code-from integration_tests integration_tests

scan:
	npx better-npm-audit audit --production --level=high

lint:
	npm run lint

lint-fix:
	npm run lint:fix

check:
	npm run check

format:
	npm run format

commitready: format unit integration

prready: scan format uncached-unit integration

check-format: check format

health-check:
	curl --location 'http://localhost:$(PORT)/healthz' --verbose

# External services
run-external-services:
	docker compose -f ./docker-compose.inf.yml up -d db

# Docker commands
build-base:
	@DOCKER_BUILDKIT=1 docker buildx build -f Dockerfile.base -t $(SERVICE_NAME)_base .

up: build-base
	COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker compose -f ./docker-compose.yml -f ./docker-compose.inf.yml build --parallel
	docker compose -f ./docker-compose.yml -f ./docker-compose.inf.yml up -d --force-recreate --scale integration_tests=0

up-integration:
	COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker compose -f ./docker-compose.yml -f ./docker-compose.inf.yml up --build -d

down:
	docker compose -f ./docker-compose.yml -f ./docker-compose.inf.yml down --remove-orphans

down-rm:
	docker compose -f ./docker-compose.inf.yml down --remove-orphans --rmi all --volumes

downup: down up

dev-up: build-base
	COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker compose -f ./docker-compose.dev.yml -f ./docker-compose.inf.yml build
	docker compose -f ./docker-compose.dev.yml -f ./docker-compose.inf.yml up -d --force-recreate --scale integration_tests=0

dev-down:
	docker compose -f ./docker-compose.dev.yml -f ./docker-compose.inf.yml down --remove-orphans

dev-downup: dev-down dev-up

infra-up:
	docker compose -f ./docker-compose.inf.yml build
	docker compose -f ./docker-compose.inf.yml up -d --force-recreate

infra-down:
	docker compose -f ./docker-compose.inf.yml down --remove-orphans

infra-downup: infra-down infra-up

rebuild:
	docker compose -f ./docker-compose.yml -f ./docker-compose.inf.yml up --build --force-recreate --no-deps $(SERVICE_NAME)

run: rebuild
	docker run  -p $(PORT):$(PORT) --name $(DOCKER_COMPOSE_TAG) -it $(DOCKER_COMPOSE_TAG) /bin/sh

exec-shell:
	docker exec -it $(DOCKER_COMPOSE_TAG) /bin/bash

docker-build:
	docker build -t $(SERVICE_NAME) .

docker-run: docker-build
	docker run  -p $(PORT):$(PORT) --name $(SERVICE_NAME) -it $(SERVICE_NAME)

docker-exec-shell:
	docker exec -it $(SERVICE_NAME) /bin/bash

just-integration:
	docker compose -f ./docker-compose.yml run integration_tests jest -c jest.integration.config.ts ./ --detectOpenHandles --forceExit

docker-kill-all:
	docker kill $(shell docker ps -q)
