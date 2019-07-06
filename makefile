.PHONY: clean build audit

build: build/bin.wasm build/index.js

build/bin.wasm: source/*.cpp source/*.h makefile
	@ docker run --rm -v `pwd`:`pwd` -w="`pwd`" \
	trzeci/emscripten-slim:sdk-tag-1.38.32-64bit \
		emcc source/*.cpp -o build/bin.wasm \
		-O3 -s WASM=1 -std=c++11 -s SIDE_MODULE=1 \

build/index.js: package.json source/*.js makefile
	@ docker run --rm -v `pwd`:`pwd` -w="`pwd`" \
	node:8.16.0-alpine \
		npm --silent install \
		&& npm --silent run build

audit: source/index.js makefile
	@ docker run --rm -v `pwd`:`pwd` -w="`pwd`" \
	node:8.16.0-alpine \
		npm audit

audit-fix: source/index.js makefile
	@ docker run --rm -v `pwd`:`pwd` -w="`pwd`" \
	node:8.16.0-alpine \
		npm audit fix

clean:
	@ yes | rm build/*
