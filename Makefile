GUIDELINE_NETWORK=guideline
SERVICE_NAME=vicentinos-sao-pedro

export WEB_TARGET
export SERVICE_COMMAND

run: WEB_TARGET=production
run: SERVICE_COMMAND=node server.js
run: build
	@echo 'Executando a aplicação em modo produção (sem debug)'
	@docker compose up --remove-orphans -d

watch: WEB_TARGET=deps
watch: SERVICE_COMMAND=npm run dev
watch: build
	@echo 'Executando a aplicação em modo watch (dev)'
	@docker compose up --remove-orphans -d

build: setup
	@echo 'Executando build da aplicação'
	@docker compose build --pull

logs:
	@docker compose logs -f

logs-app:
	@docker compose logs $(SERVICE_NAME) -f

test:
	npm run test

test-e2e:
	npm run test:e2e

lint:
	npm run lint

create-guideline-network:
ifeq (,$(shell docker network ls -q --filter name=$(GUIDELINE_NETWORK)))
	@docker network create $(GUIDELINE_NETWORK)
else
	@echo "Network já configurada"
endif

copy-env:
ifeq (,$(wildcard .env))
	@echo "Variáveis de ambiente aplicadas"
	@cp .env.sample .env
else
	@echo "Já existem variáveis de ambiente"
endif

setup: copy-env create-guideline-network
