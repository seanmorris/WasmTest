#include <iostream>
#include <emscripten.h>
#include <stdio.h>

#include "./log.h"
#include "./Test.h"

extern "C" void _get(char*, void (*func)(char* str));
extern "C" void _getInt(int*, void (*func)(int* input));

extern "C" void prInt(int*);
// extern "C" void fetch(char*, void (*func)());

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
		char str[8] = "initial";

		_get(str, [](char* res) {
			log("2");
			log(res);
		});

		log("1");
		log(str);

		log("Input text:");
	}

	void EMSCRIPTEN_KEEPALIVE number()
	{
		int num   = 0;
		int* _num = &num;

		_getInt(_num, [](int* res){
			prInt(res);
		});

		// prInt(&num);
	}
}
