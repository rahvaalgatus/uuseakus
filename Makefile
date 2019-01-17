ENV = development
BUNDLE = bundle
NANOC = $(BUNDLE) exec nanoc --env=$(ENV)
PORT = 4000
NODE = node
NODE_OPTS =
TEST =
TEST_OPTS =

export ENV

love:
	@$(NANOC) compile

compile: love

autocompile: export NANOC_ENV = $(ENV)
autocompile:
	@$(BUNDLE) exec guard start

server:
	@$(NANOC) view --port $(PORT) --live-reload

autoserver:
	@$(NANOC) live --port $(PORT) --live-reload

test:
	@$(NODE) $(NODE_OPTS) ./node_modules/.bin/_mocha -R dot $(TEST_OPTS)

spec:
	@$(NODE) $(NODE_OPTS) ./node_modules/.bin/_mocha -R spec $(TEST_OPTS)

autotest:
	@$(NODE) $(NODE_OPTS) ./node_modules/.bin/_mocha -R dot --watch $(TEST_OPTS)

autospec:
	@$(NODE) $(NODE_OPTS) ./node_modules/.bin/_mocha -R spec --watch $(TEST_OPTS)

deploy: ENV = production
deploy: compile
	@$(NANOC) deploy -t default
	
shrinkwrap:
	npm shrinkwrap --dev

.PHONY: love
.PHONY: compile autocompile
.PHONY: server autoserver
.PHONY: test spec autotest autospec
.PHONY: shrinkwrap
.PHONY: deploy
