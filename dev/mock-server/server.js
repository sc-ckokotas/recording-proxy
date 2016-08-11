"use strict";

const fs = require('fs'),
			path = require('path'),
			express = require('express'),
			bodyParser = require('body-parser'),
			cookieParser = require('cookie-parser');

const DUMMY_PAGE = fs.readFileSync(path.join(__dirname, 'views/form.html'));

const routes = {
	'GET--/': delay((req, res) => {
		res.end(DUMMY_PAGE);
	}),
	'GET--/form-submit-proxy': delay((req, res) => {
		res.end('success');
	}),
	'POST--/login': delay((req, res) => {
		res.end('!');
	}),
	'POST--/user': delay((req, res) => {
		res.end('!');
	}),
	'POST--/random': delay((req, res) => {
		res.end('!');
	})
};

var mock = express();
Object.keys(routes).forEach((key) => {
	const method = key.split('--')[0].toLowerCase();
	const route = key.split('--')[1];
	const handler = routes[key];
	mock[method](route, handler);
});
mock.listen(8001, function(){
	console.log('listening on 8001');
});

// helper abstractions ///////////////////////////////

function delay(cb){
	return function _delayed(){
		var args = arguments;
		setTimeout(_ => {
			cb.apply(null, args);
		}, 1000);
	}
}
