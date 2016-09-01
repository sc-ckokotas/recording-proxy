"use strict";

const httpRequest = require('request');

module.exports = function proxyAll(CONFIG){
    const targetUrl = CONFIG.TARGET_URL || `http://localhost:${CONFIG.PORT}`;

    return function proxyAllMiddleware(req, res, next){
        const url = targetUrl + req.originalUrl,
			method = req.method.toLowerCase();

        httpRequest[method](url, function(err, response){
            if(err){
                res.end(err);
            }else{
                res.end(response.body);
            }
        });
    }
};