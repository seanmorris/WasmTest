const readySymbol      = Symbol('ready');
const tableSymbol      = Symbol('table');
const bufferSymbol     = Symbol('buffer');
const funcTypeSymbol   = Symbol('buffer');
const readSymbol       = Symbol('readSymbol');
const readStringSymbol = Symbol('readString');

export class Binary
{
	constructor(source)
	{
		const bytes  = new Uint8Array(source);
		const memory = new WebAssembly.Memory({initial: 256});
		const buffer = new Uint8Array(memory.buffer);
		const table  = new WebAssembly.Table({
			element:   'anyfunc'
			, initial: 256
		});

		const env = {
			memory
			, table
			, __memory_base: 0
			, __table_base:  0
			, '_memset': (...args)=>{}
			, '_memcpy': (...args)=>{}
			, 'abort': (...args)=>{
				console.error(args)
			}
		};

		const envProxy = new Proxy(env, {
			get: (target, name) => {

				if(name[0] !== '_')
				{
					return target[name];
				}

				if(name in target)
				{
					return target[name];
				}

				if(!this[ name.substr(1) ])
				{
					return;
				}

				if(this[ name.substr(1) ] instanceof Function)
				{
					const annotations = this[funcTypeSymbol]( this[ name.substr(1) ] );

					if(!annotations.outFunc)
					{
						return;
					}

					let _function = (...args) => this[ name.substr(1) ](...args);

					_function = (index, callback = null) => {

						let result;

						switch(annotations.type)
						{
							case 'string':
								const param = this[readStringSymbol](buffer, index);

								result = this[ name.substr(1) ](param);
								break;
							default:
							case 'int':
							case 'int32':
								const slice = buffer.slice(index, index + 4);
								const view  = new DataView(slice.buffer);

								result = this[ name.substr(1) ](view.getInt32(0, true));
								break;
						}

						if(callback === null)
						{
							return result;
						}

						if(typeof result !== 'function'
							|| !(result instanceof Promise)
						){
							result = Promise.resolve(result);
						}

						result.then((_result)=>{

							switch(annotations.type)
							{
								case 'string':
									break;
								default:
								case 'int':
								case 'int32':
									let __result = _result;

									_result  = new ArrayBuffer(4);
									let view = new DataView(_result);

									view.setInt32(0, __result, true);

									_result  = new Int8Array(_result);

									break;
							}

							let i;

							for(i = 0; i < _result.length; i++)
							{
								if(annotations.size && i+1 >= annotations.size)
								{
									break;
								}

								if(typeof _result === 'string')
								{
									buffer[index + i] = _result.charCodeAt(i);
								}
								else if(typeof _result === 'object')
								{
									buffer[index + i] = _result[i];
								}
							}

							if(annotations.type == 'string')
							{
								buffer[index +  i] = 0x00;
							}

							table.get(callback)(index);
						});
					}

					return _function;
				}
			}
		});

		Object.defineProperty(this, 'ready', {
			enumerable:      false
			, writable:      false
			, configureable: false
			, value:         WebAssembly.instantiate(source, {env: envProxy})
		});

		Object.defineProperty(this, readySymbol, {
			enumerable:      false
			, writable:      true
			, configureable: false
			, value:         false
		});

		this.ready.then((result) => {
			this[readySymbol] = result;
		}).catch(error => console.error(error));

		const binProxy = new Proxy(this, {
			get: (target, name) => {

				const alias = `_${name}`;

				if(this[name])
				{
					let _function = this[name];

					if(typeof _function === 'function')
					{
						const annotations = this[funcTypeSymbol]( this[name] );
						const binaryFunction = this[readySymbol].instance.exports[alias];

						if(!annotations.inFunc)
						{
							return _function;
						}

						switch(annotations.type)
						{
							case 'string':
								_function = (...args) => {
									const result = binaryFunction(...args);

									return this[readStringSymbol](
										buffer
										, result
									);
								};
								break;
							default:
								_function = (...args) => {
									return  binaryFunction(...args);
								};
								break;
						}
					}

					return _function;
				}

				if(!this[readySymbol])
				{
					throw new Error('Binary is not yet ready');
				}

				if(this[readySymbol].instance.exports[alias])
				{
					return (...args) => {
						return this[readySymbol].instance.exports[alias](...args)
					};
				}
			}
		});

		return binProxy;
	}

	[readStringSymbol](buffer, index)
	{
		const result = [];

		while(buffer[index] !== 0x00)
		{
			result.push(String.fromCharCode(buffer[index++]));
		}

		return result.join('');
	}

	[funcTypeSymbol](func)
	{
		const source      = func.toString().split(/[{};]/);
		const annotations = {};

		for(let line of source)
		{
			line = line.trim();

			if(line.match(/^(function|{})/))
			{
				continue;
			}

			let groups;

			if(!(groups = line.match(/^"(.+?)(?:\:(.+?))?"$/)))
			{
				break;
			}

			if(groups[2])
			{
				annotations[ groups[1] ] = groups[2];
			}
			else
			{
				annotations[ groups[1] ] = true;
			}
		}

		return annotations;
	}
}
