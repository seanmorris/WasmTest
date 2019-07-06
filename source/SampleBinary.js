import { Binary } from './Binary';

// const prompt = require('prompt');

export class SampleBinary extends Binary
{
	puts(line)
	{
		"outFunc";
		"type:char *";

		console.error('>> ' + line);
	}

	_get(index, callback)
	{
		"outFunc";
		"type:char *";

		return new Promise((accept) => {
			process.stdin.resume();
			process.stdin.once('readable', () => {

				const res = process.stdin.read();

				// console.log(res);

				accept( res );

			});			
		});
	}

	echo()
	{
		"inFunc";
		// "type:char *";
	}

	status(code)
	{
		"inFunc";
		"type:char *";

		return code;
	}

	fetch(...args)
	{
		console.log(args);
	}
}
