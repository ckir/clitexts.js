import process from 'node:process';
// These lines make "require" available
import { createRequire } from "module"
const require = createRequire(import.meta.url)

import onetime from '../misc/OneTime.mjs';
// import signalExit from 'signal-exit';
const signalExit = require('signal-exit')

const restoreCursor = onetime(() => {
	signalExit.onExit(() => {
		process.stderr.write('\u001B[?25h');
	}, {alwaysLast: true});
});

export default restoreCursor;