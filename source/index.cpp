#include <iostream>
#include <emscripten.h>

#include "./log.h"
#include "./Test.h"

// extern "C" void get(char*);
extern "C" void _get(char*, void (*func)(char* str));
extern "C" void fetch(char*, void (*func)());

extern "C"
{

	int EMSCRIPTEN_KEEPALIVE add(int a, int b)
	{
		log("Adding!");

		Test* test = new Test(a, b);

		return test->add()
;	}

	int EMSCRIPTEN_KEEPALIVE sub(int a, int b)
	{
		log("Subtracting!!");

		Test* test = new Test(a,b);

		return test->sub();
	}

	int EMSCRIPTEN_KEEPALIVE multiply(int a, int b)
	{
		log("Mulitplying!");

		Test *test = new Test();

		return Test::multiply(a, b);
	}

	double EMSCRIPTEN_KEEPALIVE divide(double a, double b)
	{
		log("Dividing!");

		Test *test = new Test();

		return Test::divide(a, b);
	}


	char* EMSCRIPTEN_KEEPALIVE status(int code = 0)
	{
		log("Checking status!");

		char* statusCode = (char*) "ok!";

		switch(code)
		{
			case 1: statusCode = (char*) "error!"; break;
		}

		return statusCode;
	}

	void EMSCRIPTEN_KEEPALIVE echo()
	{
		char str[256] = "wow!";

		_get(str, [](char* res) {
			log("2");
			log(res);
		});

		log("1");
		log(str);

		log("Input text:");
	}
}
