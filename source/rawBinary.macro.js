import fs from 'fs';
import path from 'path';

import { createMacro } from 'babel-plugin-macros';

function rawBinary({ references, state, babel }) {
	const { default: rawBinary = [] } = references

	const sourceDir = state.file.opts.filename;

	rawBinary.forEach(reference => {

		if (reference.parentPath.type !== 'CallExpression') {
			return;
		}

		const callRef   = reference.parentPath;
		const shortPath = callRef.get("arguments")[0].evaluate().value;
		const binPath   = require.resolve(shortPath, path.dirname(sourceDir));

		const data = fs.readFileSync(binPath);
		const t    = babel.types;

		callRef.replaceWith(
			t.callExpression(
				t.memberExpression(
					t.identifier('Uint8Array'), t.identifier('from')
				), [
					t.arrayExpression(
						Array.from(data).map(byte => {
							return t.numericLiteral(byte)
						})
					)
				]
			)
		);
	});
}

export default createMacro(rawBinary);
