include .env

all: build

build:
	npx tsc

server: build
	node target/packages/@ruppin/server/src/main.js

clean:
	rm -rf target
