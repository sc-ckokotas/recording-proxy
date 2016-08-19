"use strict"

class Recorder {
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

	requestMatchesStart(req){
		return Object.keys(this._start).reduce((out, key) => {
			if(!out) return out;
			return req[key] === this._start[key];
		}, true);
	}
}

module.exports = Recorder;

// validators /////////////////////////////////

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
