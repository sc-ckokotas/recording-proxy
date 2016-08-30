"use strict";

class ResponseObserver {
    constructor(response){
        let _write = response.write,
            _end = response.end;

        this.chunks = [];

        response.write = function(chunk){
            this.chunks.push(chunk);
            _write.apply(response, arguments);
        }.bind(this);

        response.end = function(chunk){
            if(chunk) this.chunks.push(chunk);
            _end.apply(response, arguments);
        }.bind(this);
    }

    toString(){
        return Buffer.concat(this.chunks).toString('utf8')
    }
}

module.exports = ResponseObserver;