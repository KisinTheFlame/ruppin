include .env

all: build

build:
	npx tsc

run: build
	GEMINI_API_KEY=$(GEMINI_API_KEY) node target/main.js
