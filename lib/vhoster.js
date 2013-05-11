"use strict";

var httpProxy = require('http-proxy'),
    proxyServer;

module.exports = function(routingConfig) {

    //console.log('routing config', routingConfig);

    // Validate routing config
    if (!routingConfig.port) {
        throw new Error('No external listening port given!');
    }

    if (!routingConfig.vhosts) {
        throw new Error('No vhosts configuration given!');
    }

    try {

        console.log('Virtual hosting external port: ', routingConfig.port);
        console.log('Virtual host routes: ', routingConfig.vhosts);

        // Create proxy server
        proxyServer = httpProxy.createServer({
            router: routingConfig.vhosts
        });

        // Listen on source port
        proxyServer.listen(routingConfig.port);

    } catch (e) {
        throw e;
    }
};