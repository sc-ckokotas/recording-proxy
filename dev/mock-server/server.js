"use strict";

const SimpleServer = require('../../lib/SimpleServer'),
	path = require('path');

const CONFIG = require('../../config.json').DEV,
	REDIRECT_PATH = path.join(__dirname, './views/redirect.ejs'),
	APIS = makeAPIMap(CONFIG.APIS);

// server definition //////////////////////////////////////////////////////////////////////////////////////////////////

new SimpleServer({
	port: CONFIG.PORT,
	routes: Object.assign({}, APIS, {
		[`GET--${CONFIG.START_PATH}`]: (req, res) => {
			res.render(REDIRECT_PATH, {
				delay: CONFIG.REDIRECT_DELAY,
				target: CONFIG.API_PATH + 0
			});
		},
		[`GET--${CONFIG.END_PATH}`]: (req, res) => {
			res.end('success!');
		}
	})
});

// helper abstractions ////////////////////////////////////////////////////////////////////////////////////////////////

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
			target: isLast ? CONFIG.END_PATH : apiPath
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