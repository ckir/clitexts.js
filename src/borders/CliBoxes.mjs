// https://github.com/sindresorhus/cli-boxes

'use strict';
// These lines make "require" available
import { createRequire } from "module"
const require = createRequire(import.meta.url)

const cliBoxes = require('./CliBoxes.json');

export default cliBoxes;
