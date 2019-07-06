import { SampleBinary } from './SampleBinary';

const fs       = require('fs');
const fsp      = fs.promises;
const util     = require('util');

const wasmFile   = './SampleBinary.wasm';

let binary;

fsp.readFile(wasmFile).then(bin => {

	binary = new SampleBinary(bin);

}).then((result) => binary.ready).then(() => {

	console.log( binary.add(8,18) );
	console.log( binary.sub(8,18) );
	console.log( binary.multiply(8,18) );
	console.log( binary.divide(8,18) );

	console.log( binary.status() );
	console.log( binary.status(1) );

	binary.echo();

	binary.number();


}).catch(error => console.error(error));
