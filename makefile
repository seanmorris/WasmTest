.PHONY: clean build build-test audit audit-fix

build: Binary.js

SampleBinary.wasm: test/*.cpp test/*.h makefile
	@ docker run --rm -v `pwd`:`pwd` -w="`pwd`" \
	trzeci/emscripten-slim:sdk-tag-1.38.32-64bit \
		emcc test/*.cpp -o SampleBinary.wasm \
		-O3 -s WASM=1 -std=c++11 -s SIDE_MODULE=1 \

Binary.js: package.json source/*.js makefile
	@ docker run --rm -v `pwd`:`pwd` -w="`pwd`" \
	node:8.16.0-alpine \
		npm --silent install \
		&& npm --silent run build

build-test: package.json source/*.js test/*.js makefile build SampleBinary.wasm
	@ docker run --rm -v `pwd`:`pwd` -w="`pwd`" \
	node:8.16.0-alpine \
		npm --silent install \
		&& npm --silent run build-test

audit: source/index.js makefile
	@ docker run --rm -v `pwd`:`pwd` -w="`pwd`" \
	node:8.16.0-alpine \
		npm audit

audit-fix: source/index.js makefile
	@ docker run --rm -v `pwd`:`pwd` -w="`pwd`" \
	node:8.16.0-alpine \
		npm audit fix

clean:
	@ rm *.js *.wasm
