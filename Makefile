REGISTRY := git.ds47.dev
USER     := calautigo
IMAGE    := $(REGISTRY)/$(USER)/glasheim-dashboard
VERSION  := $(shell git describe --tags --abbrev=0 2>/dev/null | sed 's/^v//' || echo "0.1.0")

.PHONY: build push run dev login dev-build

build:
	docker build -t $(IMAGE):$(VERSION) -t $(IMAGE):latest .

push: build
	docker push $(IMAGE):$(VERSION)
	docker push $(IMAGE):latest

run:
	docker run --rm -p 3000:3000 $(IMAGE):latest

dev-build:
	docker build -f Dockerfile.dev -t glasheim-dashboard:dev .

dev: dev-build
	docker run --rm -it \
		-p 5173:5173 \
		-v $(PWD):/app \
		-v /app/node_modules \
		glasheim-dashboard:dev

login:
	docker login $(REGISTRY)
