"use strict"

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
	 * @param {Object} startMarker
	 * @param {Object} endMarker
	 */
	constructor(startMarker, endMarker, callback){
		if(!startMarker || !endMarker || !callback) throw new Error('Recorder requires three arguments at construction: "startMarker", "endMarker", and "callback".');

		this._start = validateStart(startMarker);
		this._end = validateEnd(endMarker);

		if(typeof callback !== 'function') throw new Error('Recorder constructed with bad "callback"... Must be a function');

		this._key = null;
		this._recording = false;
		this._requests = {};

		this.middleware = (request, response, next) => {
			if(!this._recording){
				if(this.requestMatchesStart(request)){
					this._recording = true;
					this.middleware(request, response); // recurse to reach the else case if this.requestMatchesStart === true
				}
			}else{
				if(!this._key) this._key = makeKey(request);
				this._requests[makeKey(request)] = response;

				if(this.requestMatchesEnd(request)){
					this._recording = false;
					callback(this);
				}
			}

			if(next) next();
		};
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
}

module.exports = Recorder;

// helpers ////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
		return true;
	}else{
		return false;
	}
}
