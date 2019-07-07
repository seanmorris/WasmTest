# WASM Test

This is just a test of WASM's functionality. **This is not production-ready code.**

## Dependencies

Building the project requires the following dependencies:

* [docker](https://docs.docker.com/install/)
* [make](https://www.gnu.org/software/make/)

## Building

Simply run `make` to build the project.

```bash
$ make
```

## Running

```bash
$ node build/index.js
```

## Features

* Passing integers & floats back and forth between JS & C++.
* Passing strings back and forth between JS & C++.
* Async callbacks from C++ to JS via promises.
* Inline WASM with companion JS class.
