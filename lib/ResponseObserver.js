"use strict";

const Promise = require('bluebird');

class ResponseObserver {
    constructor(response, timeout){
        let _write = response.write,
            _end = response.end;

        this._data = [];
        this.timeoutID = null;

        this.status = new Promise((resolve, reject) => {
            this.timeoutID = setTimeout(() => {
                // do we need to end the response??? or will rejection be enough
                reject('Observer timed out');
            }, timeout || 60 * 1000);

            response.write = function(data){
                if(data instanceof Buffer) this._data.push(data);
                _write.apply(response, arguments);
            }.bind(this);

            response.end = function(data){
                if(typeof data === 'string') this._data = data;
                _end.apply(response, arguments);
                clearTimeout(this.timeoutID);
                resolve(this.toString());
            }.bind(this);
        });
    }

    toString(){
        return Array.isArray(this._data) ? Buffer.concat(this._data).toString('utf8') : this._data;
    }
}

module.exports = ResponseObserver;
