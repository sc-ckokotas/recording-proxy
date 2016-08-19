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
	constructor(startMarker, endMarker){
		if(!startMarker || !endMarker) throw new Error('Recorder requires two arguments at construction.');

		this._key = null;
		this._recording = false;
		this._requests = {};
		this._start = validateStart(startMarker);
		this._end = validateEnd(endMarker);

		this.middleware = (req, res) => {
			if(!this._recording){
				this._recording = this.requestMatchesStart(req);
				this.middleware(req, res); // recurse to reach the else case if this.requestMatchesStart === true
			}else{
				if(!this._key){
					this._key = JSON.stringify({
						headers: req.headers,
						method: req.method,
						path: req.path
					});

					// do something with res
				}else{
					// add all other req and res
				}
			}
		};
	}

	/**
	 * Does the request object have identical properties to the start marker for this Recorder.
	 * 
	 * @param {Request} req
	 * @returns Boolean
	 */
	requestMatchesStart(req){
		return matchesMarker(this._start, req);
	}

	/**
	 * Does the request object have identical properties to the end marker for this Recorder.
	 * 
	 * @param {any} req
	 * @returns
	 */
	requestMatchesEnd(req){
		return matchesMarker(this._end, req);
	}
}

module.exports = Recorder;

// helpers ////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
