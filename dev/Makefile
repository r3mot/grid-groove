SERVICE=web

.PHONY: dev dev-build build test coverage lint pretty shell logs stop clean

dev:
	docker compose up

dev-build:
	docker compose up --build

logs:
	docker compose logs -f $(SERVICE)

build:
	docker compose run --rm $(SERVICE) npm run build $(ARGS)

test:
	docker compose run --rm $(SERVICE) npm test -- $(ARGS)

coverage:
	docker compose run --rm $(SERVICE) npm run coverage $(ARGS)

lint:
	docker compose run --rm $(SERVICE) npm run lint $(ARGS)

pretty:
	docker compose run --rm $(SERVICE) npm run pretty $(ARGS)

shell:
	docker compose run --rm $(SERVICE) sh

stop:
	docker compose down

clean:
	docker compose down --volumes --remove-orphans
