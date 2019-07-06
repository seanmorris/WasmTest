#include <emscripten.h>

#include "./log.h"

class Test
{
	private: int a, b;

	public: Test(int a = 0, int b = 0)
	{
		this->a = a;
		this->b = b;
	}

	public: int add()
	{
		return this->a + this->b;
	}

	public: int sub()
	{
		return this->a - this->b;
	}

	public: static int multiply(int a, int b)
	{
		return a * b;
	}

	public: static double divide(double a, double b)
	{
		return a / b;
	}
};
