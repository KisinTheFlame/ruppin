include .env

all: build

build:
	npx tsc

run: build
	node target/main.js
