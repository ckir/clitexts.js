// https://github.com/sindresorhus/widest-line

import stringWidth from './StringWidth.mjs';

export default function widestLine(string) {
	let lineWidth = 0;

	for (const line of string.split('\n')) {
		lineWidth = Math.max(lineWidth, stringWidth(line));
	}

	return lineWidth;
}
