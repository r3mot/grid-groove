SERVICE=web

.PHONY: dev dev-build build test coverage lint pretty shell stop clean

dev:
	docker compose up

dev-build:
	docker compose up --build

build:
	docker compose run --rm $(SERVICE) npm run build

test:
	docker compose run --rm $(SERVICE) npm test -- $(ARGS)

coverage:
	docker compose run --rm $(SERVICE) npm run coverage

lint:
	docker compose run --rm $(SERVICE) npm run lint

pretty:
	docker compose run --rm $(SERVICE) npm run pretty

shell:
	docker compose run --rm $(SERVICE) sh

stop:
	docker compose down

clean:
	docker compose down --volumes --remove-orphans
