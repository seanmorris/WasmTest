import { Binary } from './Binary';

export class SampleBinary extends Binary
{
	puts(line)
	{
		"outFunc";
		"type:string";

		console.error('>> ', line);
	}

	prInt(number)
	{
		"outFunc";

		console.log('>> ', number);
	}

	_get(...args)
	{
		"outFunc";
		"type:string";
		"size:256";

		return new Promise((accept) => {
			process.stdin.resume();
			process.stdin.once('readable', () => {

				accept( process.stdin.read() );

			});			
		});
	}

	_getInt(...args)
	{
		"outFunc"

		return new Promise((accept) => {
			setTimeout(
				()=> accept( 1000 )
				, 500
			);
		});

		return 259;
	}

	echo()
	{
		"inFunc";
	}

	status(code)
	{
		"inFunc";
		"type:string";
		"size:256";

		return code;
	}
}
