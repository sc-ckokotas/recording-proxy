"use strict";

const SimpleServer = require('./lib/SimpleServer'),
	Recorder = require('./lib/Recorder'),
	proxyAll = require('./lib/proxyAll');

const CONFIG = require('./config.json'),
	DEV_CONFIG = require('./dev/mock-server/config.json'),
	PACKAGE = require('./package.json');

// CLI argument parsing ///////////////////////////////////////////////////////////////////////////////////////////////

const ARGS = require('commander')
	.version(PACKAGE.version)
	.option('-d, --dev', 'Dev mode.')
	.parse(process.argv);

// server definition //////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Create recorder
 */
const recorder = new Recorder({
	start: (ARGS.dev ? DEV_CONFIG : CONFIG)['START_MARKER'],
	end: (ARGS.dev ? DEV_CONFIG : CONFIG)['END_MARKER'],
	callback: () => {
		recorder.replay = true;
		console.log(recorder.stringify(4));
	}
});

/**
 * Setup Proxy
 */
new SimpleServer({
	port: CONFIG.PORT,
	routes: {
		'GET--/recording-proxy/dashboard'(req, res){
			res.end('--TODO--');
		}
	},
	middleware: [
		recorder.middleware,
		proxyAll(ARGS.dev ? DEV_CONFIG : CONFIG)
	],
});

// helper abstractions ////////////////////////////////////////////////////////////////////////////////////////////////


/* TODO ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

	recorded sessions will be stored after end. Beginning marker will act as key for response sequence ??? should use actual hashmap ???

	status-code, headers, body, start-time, latency(time to first byte), total-time, total-size -- (headers as JSON OK) (body as Blob or some binary data)

	admin page with HAR(http-archive) (see kuit / ask steve) to view all recorders and manage them

*/
