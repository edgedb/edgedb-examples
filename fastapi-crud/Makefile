path := ./

define Comment
	- Run `make help` to see all the available options.
	- Run `make setup` to run first-time project setup.
	- Run `make lint` to run the linter.
	- Run `make lint-check` to check linter conformity.
endef


.PHONY: lint
lint: black isort flake mypy	## Apply all the linters.


.PHONY: lint-check
lint-check:  ## Check whether the codebase satisfies the linter rules.
	@echo "Checking linter rules..."
	@echo "========================"
	@echo
	@. ./myvenv/bin/activate && black --fast --check $(path)
	@. ./myvenv/bin/activate && isort --check $(path)
	@. ./myvenv/bin/activate && flake8 $(path)
	@echo 'y' | mypy $(path) --install-types


.PHONY: black
black: ## Apply black.
	@echo
	@echo "Applying black..."
	@echo "================="
	@echo
	@. ./myvenv/bin/activate && black --fast $(path)
	@echo


.PHONY: isort
isort: ## Apply isort.
	@echo "Applying isort..."
	@echo "================="
	@echo
	@. ./myvenv/bin/activate && isort $(path)


.PHONY: flake
flake: ## Apply flake8.
	@echo
	@echo "Applying flake8..."
	@echo "================="
	@echo
	@. ./myvenv/bin/activate && flake8 $(path)


.PHONY: mypy
mypy: ## Apply mypy.
	@echo
	@echo "Applying mypy..."
	@echo "================="
	@echo
	@. ./myvenv/bin/activate && mypy $(path)


.PHONY: help
help: ## Show this help message.
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'


.PHONY: test
test: ## Run the tests against the current version of Python.
	@. ./myvenv/bin/activate && pytest


.PHONY: dep-install
dep-install: ## Install latest versions of prod dependencies
	@echo
	@echo "Installing dependencies..."
	@echo "=========================="
	@. ./myvenv/bin/activate && pip install edgedb fastapi uvicorn


.PHONY: dep-install-dev
dep-install-dev: ## Install latest versions of dev dependencies
	@echo
	@echo "Installing dev dependencies..."
	@echo "=============================="
	@. ./myvenv/bin/activate && pip install 'httpx[cli]' black flake8 isort mypy pytest pytest-asyncio

.PHONY: install-edgedb
install-edgedb: ## Install the EdgeDB CLI
	@echo
	@echo "Installing EdgeDB..."
	@echo "===================="
	@which edgedb > /dev/null 2>&1 || (curl --proto '=https' --tlsv1.2 -sSf https://sh.edgedb.com | sh)


.PHONY: init-project
init-project: ## Install the EdgeDB CLI
	@echo
	@echo "Initializing EdgeDB project..."
	@echo "=============================="
	@edgedb project init


.PHONY: dev-server
dev-server: ## Spin up local dev server.
	@. ./myvenv/bin/activate && uvicorn app.main:fast_api --port 5001 --reload


.PHONY: health-check
health-check: ## Perfrom health check on the uvicorn server.
	@chmod +x ./scripts/health_check
	@./scripts/health_check


.PHONY: generate
generate: ## Generate code from .edgeql files
	@echo
	@echo "Generating code..."
	@echo "=================="
	@. ./myvenv/bin/activate && edgedb-py


.PHONY: create-venv
create-venv: ## Create a virtual environment for the project
	@echo "Creating virtual environment..."
	@python -m venv myvenv


.PHONY: activate-venv
activate-venv: ## Activate the project's virtual environment
	@echo "This cannot be done from Make. Run \`source myvenv/bin/activate\` in your shell to activate."


.PHONY: setup
setup: create-venv dep-install dep-install-dev install-edgedb init-project generate ## Run first-time setup
	@echo
	@echo "${Green}All set!${NC} Run \`make dev-server\` to start a uvicorn dev server on port 5001."
