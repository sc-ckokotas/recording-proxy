"use strict";

const SimpleServer = require('../../lib/SimpleServer'),
	path = require('path');

const CONFIG = require('./config.json'),
	REDIRECT_PATH = path.join(__dirname, './views/redirect.ejs'),
	apis = makeAPIMap(CONFIG.APIS);

// server definition //////////////////////////////////////////////////////////////////////////////////////////////////

const startRoute = makeKey(CONFIG.START_MARKER),
	endRoute = makeKey(CONFIG.END_MARKER);

new SimpleServer({
	port: CONFIG.PORT,
	routes: Object.assign({}, apis, {
		[startRoute]: (req, res) => {
			res.render(REDIRECT_PATH, {
				delay: CONFIG.REDIRECT_DELAY,
				target: CONFIG.API_PATH + 0
			});
		},
		[endRoute]: (req, res) => {
			res.end('success!');
		}
	})
});

// helper abstractions ////////////////////////////////////////////////////////////////////////////////////////////////

function makeKey(marker){
	return `${marker.method.toUpperCase()}--${marker.path}`;
}

/**
 * Creates an object with routes that redirect in order.
 * 
 * @param {Number} num
 * @returns
 */
function makeAPIMap(num){
	return Array(num).fill(null).reduce((apis, key, i) => {
		const thisPath = CONFIG.API_PATH + i;
		const nextPath = CONFIG.API_PATH + (i+1);
		apis[`GET--${thisPath}`] = delay(makeHandler(nextPath, i === num-1));
		return apis;
	}, {});
}

/**
 * Creates a function that will redirect to an api or the end route.
 * 
 * @param {String} apiPath
 * @param {Boolean} isLast
 * @returns
 */
function makeHandler(apiPath, isLast){
	return (req, res) => {
		res.render(REDIRECT_PATH, {
			delay: CONFIG.REDIRECT_DELAY,
			target: isLast ? CONFIG.END_MARKER.path : apiPath
		});
	};
}

/**
 * Wraps a function in a setTimeout.
 * 
 * @param {Function} cb
 * @returns
 */
function delay(cb){
	return function _delayed(){
		var args = arguments;
		setTimeout(_ => {
			cb.apply(null, args);
		}, CONFIG.RESPONSE_DELAY);
	}
}