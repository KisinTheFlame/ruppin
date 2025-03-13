include .env

all: build

build:
	npx tsc

run: build
	node target/src/main.js

clean:
	rm -rf target
