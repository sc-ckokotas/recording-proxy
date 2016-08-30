"use strict";

const SimpleServer = require('./lib/SimpleServer'),
	cookieParser = require('cookie-parser'),
	httpRequest = require('request'),
	bodyParser = require('body-parser'),
	Recorder = require('./Recorder');

const CONFIG = require('./config.json'),
	PACKAGE = require('./package.json');

// CLI argument parsing ///////////////////////////////////////////////////////////////////////////////////////////////

const ARGS = require('commander')
	.version(PACKAGE.version)
	.option('-d, --dev', 'Dev mode.')
	.parse(process.argv);

// server definition //////////////////////////////////////////////////////////////////////////////////////////////////

var routes;
var middleware = [
	cookieParser(),
	bodyParser.json()
];

if(ARGS.dev){
	/**
	 * Setup routes to point to mock-server
	 */
	const LOCAL_URL = `http://localhost:${CONFIG.DEV.PORT}`;

	routes = {
		'ALL--*': (req, res)=>{
			const URL = LOCAL_URL + req.originalUrl,
				METHOD = req.method.toLowerCase();

			httpRequest[METHOD](URL).on('error', console.error).pipe(res);
		}
	};

	/**
	 * Create dev recorder
	 */
	const recorder = new Recorder({
		method: 'GET',
		path: CONFIG.DEV.START_PATH
	}, {
		method: 'GET',
		path: CONFIG.DEV.END_PATH
	}, recordingFinished);

	middleware = middleware.concat(recorder.middleware);
}else{
	/**
	 * 
	 */
	// --todo--
}

new SimpleServer({
	port: CONFIG.PORT,
	middleware: middleware,
	routes: routes
});

// helper abstractions ////////////////////////////////////////////////////////////////////////////////////////////////

function recordingFinished(instance){
	console.log('done')
}

function logRequest(request){
	console.log(Date.now() + ' :: ' + JSON.stringify({
		url: request.originalUrl, 
		body: request.body, 
		cookies: request.cookies, 
		headers: request.headers
	}, null, 2) + '\n');
}

// notes //////////////////////////////////////////////////////////////////////////////////////////////////////////////

// config specifiying urls that will mark beginning and end of recording session

// recorded sessions will be stored after end. Beginning marker will act as key for response sequence ??? should use actual hashmap ???

// status-code, headers, body, start-time, latency(time to first byte), total-time, total-size -- (headers as JSON OK) (body as Blob or some binary data)

// admin page with HAR(http-archive) (see kuit / ask steve) to view all recorders and manage them
