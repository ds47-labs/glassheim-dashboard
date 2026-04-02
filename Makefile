REGISTRY := git.ds47.dev
USER     := calautigo
IMAGE    := $(REGISTRY)/$(USER)/glasheim-dashboard
VERSION  := $(shell git describe --tags --abbrev=0 2>/dev/null | sed 's/^v//' || echo "0.1.0")

.PHONY: build push run dev login dev-build release git-push

git-push: ## Commit and push all uncommitted changes
	@bash -c 'if [ -n "$$(git status --porcelain)" ]; then \
		echo "Uncommitted changes detected, committing..."; \
		git add -A && git commit -m "chore: pre-release" && git push; \
	else \
		echo "Nothing to commit."; \
	fi'

release: git-push ## Usage: make release [TAG=v1.2.3] or make release (auto-bumps patch)
ifdef TAG
	git tag $(TAG)
	git push origin $(TAG)
	$(MAKE) push VERSION=$(shell echo $(TAG) | sed 's/^v//')
else
	@echo "No TAG specified, auto-bumping patch version..."
	@bash -c 'EXISTING_TAG=$$(git tag --points-at HEAD 2>/dev/null | head -1); \
		if [ -n "$$EXISTING_TAG" ]; then \
			echo "HEAD already tagged as $$EXISTING_TAG, skipping tag creation"; \
			$(MAKE) push VERSION=$$(echo $$EXISTING_TAG | sed "s/^v//"); \
		else \
			LAST_TAG=$$(git describe --tags --abbrev=0 2>/dev/null || echo "v0.1.0"); \
			VERSION=$$(echo $$LAST_TAG | sed "s/^v//; s/^\\.//" ); \
			MAJOR=$$(echo $$VERSION | cut -d. -f1); \
			MINOR=$$(echo $$VERSION | cut -d. -f2); \
			PATCH=$$(echo $$VERSION | cut -d. -f3); \
			NEW_PATCH=$$((PATCH + 1)); \
			NEW_VERSION=$$MAJOR.$$MINOR.$$NEW_PATCH; \
			NEW_TAG=v$$NEW_VERSION; \
			echo "Creating release: $$NEW_TAG"; \
			git tag $$NEW_TAG && git push origin $$NEW_TAG && \
			$(MAKE) push VERSION=$$NEW_VERSION; \
		fi'
endif

build:
	docker build -f docker/Dockerfile --build-arg BUILD_VERSION=$(VERSION) -t $(IMAGE):$(VERSION) -t $(IMAGE):latest .

push: build
	docker push $(IMAGE):$(VERSION)
	docker push $(IMAGE):latest

run:
	docker run --rm -p 80:80 $(IMAGE):latest

dev-build:
	docker build -f docker/Dockerfile.dev -t glasheim-dashboard:dev .

dev: dev-build
	docker run --rm -it \
		-p 5173:5173 \
		-v $(PWD):/app \
		-v /app/node_modules \
		glasheim-dashboard:dev

login:
	docker login $(REGISTRY)
