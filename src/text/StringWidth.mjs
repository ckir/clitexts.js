// https://github.com/sindresorhus/string-width

import stripAnsi from './AnsiStrip.mjs';
import { eastAsianWidth } from './EastAsianWidth.mjs';
import emojiRegex from './RegexEmoji.mjs';

export default function stringWidth(string, options = {}) {
	if (typeof string !== 'string' || string.length === 0) {
		return 0;
	}

	const {
		ambiguousIsNarrow = true,
		countAnsiEscapeCodes = false,
	} = options;

	if (!countAnsiEscapeCodes) {
		string = stripAnsi(string);
	}

	if (string.length === 0) {
		return 0;
	}

	let width = 0;

	for (const { segment: character } of new Intl.Segmenter().segment(string)) {
		const codePoint = character.codePointAt(0);

		// Ignore control characters
		if (codePoint <= 0x1F || (codePoint >= 0x7F && codePoint <= 0x9F)) {
			continue;
		}

		// Ignore combining characters
		if (codePoint >= 0x3_00 && codePoint <= 0x3_6F) {
			continue;
		}

		if (emojiRegex().test(character)) {
			width += 2;
			continue;
		}

		width += eastAsianWidth(codePoint, { ambiguousAsWide: !ambiguousIsNarrow });
	}

	return width;
}

// console.log(stringWidth('\u001B[1m古\u001B[22m'))