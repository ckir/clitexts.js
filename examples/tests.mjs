import * as antsy from '../src/terminal/antsy/antsy.js'
import { createAnsiSequenceParser, createColorPalette } from '../src/text/AnsiSequenceParser/index.js'
import chalk from "chalk";

const input = 'The quick 🌷🎁💩😜👍🏳️‍🌈 brown ' + chalk.red('fox jumped over ') +
    'the lazy ' + chalk.green('dog and then ran') + chalk.underline(' away with the unicorn. 💛')

const canvas = new antsy.Canvas(120, 24);
const region = canvas.all();

region.at(0, 23).write(input);

// now write it out to the terminal!
// generates: '\e[37m\e[40m\e[2J\e[H\e[23B\e[44mi am on a blue background!\e[H'
let paint = canvas.paint()
process.stdout.write(paint);

region.at(10, 10).color("#ff0").write("BLUE");

// now update that word!
// generates: '\e[24;11H\e[38;5;11mBLUE\e[H'
process.stdout.write(canvas.paint());
