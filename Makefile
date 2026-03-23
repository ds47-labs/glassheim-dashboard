REGISTRY := git.ds47.dev
USER     := calautigo
IMAGE    := $(REGISTRY)/$(USER)/glasheim-dashboard
VERSION  := $(shell git describe --tags --abbrev=0 2>/dev/null | sed 's/^v//' || echo "0.1.0")

.PHONY: build push run dev login dev-build release

release: ## Usage: make release TAG=v1.2.3
ifndef TAG
	$(error TAG is required, e.g. make release TAG=v1.2.3)
endif
	git tag $(TAG)
	git push origin $(TAG)
	$(MAKE) push VERSION=$(shell echo $(TAG) | sed 's/^v//')

build:
	docker build --build-arg BUILD_VERSION=$(VERSION) -t $(IMAGE):$(VERSION) -t $(IMAGE):latest .

push: build
	docker push $(IMAGE):$(VERSION)
	docker push $(IMAGE):latest

run:
	docker run --rm -p 80:80 $(IMAGE):latest

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
