// https://github.com/chalk/strip-ansi
import ansiRegex from './RegexAnsi.mjs';

export default function stripAnsi(string) {
	if (typeof string !== 'string') {
		throw new TypeError(`Expected a \`string\`, got \`${typeof string}\``);
	}

	return string.replace(ansiRegex(), '');
}

// console.log(stripAnsi('\u001B[4mUnicorn\u001B[0m'));
// //=> 'Unicorn'

// console.log(stripAnsi('\u001B]8;;https://github.com\u0007Click\u001B]8;;\u0007'));
// //=> 'Click'
