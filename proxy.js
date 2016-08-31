"use strict";

const SimpleServer = require('./lib/SimpleServer'),
	cookieParser = require('cookie-parser'),
	httpRequest = require('request'),
	bodyParser = require('body-parser'),
	Recorder = require('./lib/Recorder');

const CONFIG = require('./config.json'),
	PACKAGE = require('./package.json');

// CLI argument parsing ///////////////////////////////////////////////////////////////////////////////////////////////

const ARGS = require('commander')
	.version(PACKAGE.version)
	.option('-d, --dev', 'Dev mode.')
	.parse(process.argv);

// server definition //////////////////////////////////////////////////////////////////////////////////////////////////

var targetUrl, startMarker, endMarker,
	middleware = [
		cookieParser(),
		bodyParser.json()
	];

if(ARGS.dev){
	const DEV_CONFIG = require('./dev/mock-server/config.json');

	targetUrl = `http://localhost:${DEV_CONFIG.PORT}`;
	startMarker = DEV_CONFIG.START_MARKER;
	endMarker = DEV_CONFIG.END_MARKER;
}else{
	targetUrl = CONFIG.TARGET_URL;
	startMarker = CONFIG.START_MARKER;
	endMarker = CONFIG.END_MARKER;
}

/**
 * Setup routes
 */
const routes = {
	'ALL--*': (req, res) => {
		const url = targetUrl + req.originalUrl,
			method = req.method.toLowerCase();

		if(!res.headersSent){
			console.log(`Proxying request to: ${url}`);
			httpRequest[method](url).on('error', console.error).pipe(res);
		}else{
			res.end();
		}
	}
};

/**
 * Create recorder
 */
const recorder = new Recorder({
	start: startMarker,
	end: endMarker,
	callback: instance => {
		instance.replay = true;
		console.log(instance.stringify(4));
	}
});

new SimpleServer({
	port: CONFIG.PORT,
	middleware: middleware.concat(recorder.middleware),
	routes: routes
});

// helper abstractions ////////////////////////////////////////////////////////////////////////////////////////////////


/* TODO ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

	recorded sessions will be stored after end. Beginning marker will act as key for response sequence ??? should use actual hashmap ???

	status-code, headers, body, start-time, latency(time to first byte), total-time, total-size -- (headers as JSON OK) (body as Blob or some binary data)

	admin page with HAR(http-archive) (see kuit / ask steve) to view all recorders and manage them

*/
