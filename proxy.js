const express = require('express'),
			bodyParser = require('body-parser'),
			cookieParser = require('cookie-parser');

const Recorder = require('./Recorder');

var server = express();

server.use(cookieParser());
server.use(bodyParser.json());

server.all('*', (req, res)=>{
	res.end(logRequest(req));
});

server.listen(8000);

function logRequest(request){
	return JSON.stringify([request.originalUrl ,request.body, request.cookies, request.headers], null, 2);
}

// create functional tests using jasmine

// config specifiying urls that will mark beginning and end of recording session

// recorded sessions will be stored after end. Beginning marker will act as key for response sequence ??? should use actual hashmap ???
