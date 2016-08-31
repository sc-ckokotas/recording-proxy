"use strict";

const express = require('express'),
    cookieParser = require('cookie-parser')(),
	bodyParser = require('body-parser').json();

/**
 * An easy-lift express wrapper
 * 
 * @class SimpleServer
 */
class SimpleServer {
    /**
     * Creates an instance of SimpleServer.
     * 
     * @param {Object} options
     * @param {Number} options.port - Port to listen on.
     * @param {Object} options.routes - Route map.
     * @param {Array}  options[middleware] - List of middleware to decorate with.
     */
    constructor(options){
        this.express_instance = express();
        this.express_instance.use(cookieParser);
        this.express_instance.use(bodyParser);

        /**
         * Lazy route express instance with "routes" object.
         */
        Object.keys(options.routes).forEach(key => {
            /*** ROUTE SYNTAX ***
             * key: 	"METHOD--/pathTo/somewhere"
             * value: 	Handler
             */
            const method = key.split('--')[0].toLowerCase();
            const route = key.split('--')[1];
            const handler = options.routes[key];
            this.express_instance[method](route, handler);
        });

        /** 
         * Decorate with middleware
         */
        if(options.middleware){
            options.middleware.forEach(middleware => {
                this.express_instance.use(middleware);
            });
        }

        /** 
         * Start server
         */
        this.express_instance.listen(options.port, () => {
            console.log(`SimpleServer listening on ${options.port}`);
        });
    }
}

module.exports = SimpleServer;