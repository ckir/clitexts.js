


import gradient from './colors/GradientString.mjs'
let duck = gradient('orange', 'yellow').multiline([
    "  __",
    "<(o )___",
    " ( ._> /",
    "  `---'",
].join('\n'));
console.log(duck);

// Works with aliases
console.log(gradient.atlas.multiline('Multi line\nstring'));

// Works with advanced options
console.log(gradient('cyan', 'pink').multiline('Multi line\nstring', {interpolation: 'hsv'}));

import widestLine from './text/WidestLine.mjs'
let b = widestLine('古\n\u001B[1m@\u001B[22m');

import Table from "./boxes/Table.mjs"
const table = new Table({
    chars: {
        'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗',
        'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝',
        'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼',
        'right': '║', 'right-mid': '╢', 'middle': '│'
    }
});

table.push(
    ['foo', 'bar', 'baz'],
    ['frob', 'bar', 'quuz']
);

console.log(table.toString());





import cliTruncate from './text/CliTruncate.mjs'


import stripAnsi from './text/AnsiStrip.mjs';

console.log(stripAnsi('\u001B[4mUnicorn\u001B[0m'));
//=> 'Unicorn'

console.log(stripAnsi('\u001B]8;;https://github.com\u0007Click\u001B]8;;\u0007'));
//=> 'Click'

