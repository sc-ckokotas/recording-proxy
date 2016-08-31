"use strict"

const ResponseObserver = require('./ResponseObserver');

/**
 * An object who's middleware method will wait for a starting request and then store all requests and responses until 
 * an ending request is encountered. The Recorder can be replayed to simulate the recorded session for debugging 
 * purposes.  
 * 
 * @class Recorder
 */
class Recorder {

	/**
	 * Creates an instance of Recorder.
	 * 
	 * @param {Object} options
	 * @param {Object} options.start
	 * @param {Object} options.end
	 * @param {Function} options.callback
	 */
	constructor(options){
		if(!options.start || !options.end || !options.callback) throw new Error('Recorder requires an "options" argument. "options" should have three properties: "start", "end", "callback".');

		this._start = validateStart(options.start);
		this._end = validateEnd(options.end);

		if(typeof options.callback !== 'function') throw new Error('Recorder constructed with bad "options.callback"... Must be a function');

		this._key = null;
		this._done = false;
		this._replay = false;
		this._recording = false;
		this._requests = {};
		this._cb = options.callback;

		this.middleware = (request, response, next) => {
			if(this._replay){
				replay.call(this, request, response);
			}else{
				record.call(this, request, response);
			}

			if(next) next();
		};
	}

	get replay(){
		return this._replay;
	}

	set replay(value){
		if(!this._recording && this._done){
			this._replay = !!value;
			if(this._replay) console.log('ReplayMode: ACTIVE');
		}
	}

	/**
	 * Determines if the request object has identical properties to the start marker for this Recorder.
	 * 
	 * @param {Request} req
	 * @returns Boolean
	 */
	requestMatchesStart(req){
		return matchesMarker(this._start, req);
	}

	/**
	 * Determines if the request object has identical properties to the end marker for this Recorder.
	 * 
	 * @param {Request} req
	 * @returns Boolean
	 */
	requestMatchesEnd(req){
		return matchesMarker(this._end, req);
	}

	stringify(indent){
		return JSON.stringify(this._requests, indent ? prettifier : null, indent ? (typeof indent === 'number' ? indent : 4) : 0);
	}
}

module.exports = Recorder;

// middleware abstractions ////////////////////////////////////////////////////////////////////////////////////////////

function record(req, res){
	if(!this._recording){
		if(this.requestMatchesStart(req)){
			this._recording = true;
			this.middleware(req, res); // recurse to reach the else case if this.requestMatchesStart === true
		}
	}else{
		let key = makeKey(req);

		if(!this._key) this._key = key;
		this._requests[key] = new ResponseObserver(res);

		if(this.requestMatchesEnd(req)){
			this._recording = false;
			this._done = true;
			this._cb(this);
		}
	}
}

function replay(req, res){
	const cachedResponse = this._requests[makeKey(req)];

	if(cachedResponse){
		console.log('replaying cached response!');
		res.send(cachedResponse.toString());
	}
}

// helpers ////////////////////////////////////////////////////////////////////////////////////////////////////////////

function prettifier(key, value){
	if(Array.isArray(value)){
		return JSON.stringify(value);
	}
	return value;
}

function makeKey(req){
	return JSON.stringify({
		headers: req.headers,
		method: req.method,
		path: req.path
	});
}

function matchesMarker(marker, req){
	if(!req) throw new Error('Expected a request object.');
	return Object.keys(marker).reduce((out, key) => {
		if(!out) return out;
		return req[key] === marker[key];
	}, true);
}

// validators /////////////////////////////////////////////////////////////////////////////////////////////////////////

function validateStart(marker){
	if(!validateMarker(marker)) throw new Error('Recorder constructed with bad "startMarker"');
	return marker;
}

function validateEnd(marker){
	if(!validateMarker(marker)) throw new Error('Recorder constructed with bad "endMarker"')
	return marker;
}

function validateMarker(marker){
	if(typeof marker.method === 'string' && typeof marker.path === 'string'){
		marker.method = marker.method.toUpperCase();
		return true;
	}else{
		return false;
	}
}

// todo ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

