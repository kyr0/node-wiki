"use strict"

module.exports = {

    // External listening port
    port: 3000,

    // Configure one or more wiki-instances.
    // This enables e.g. multi-language support
    // and reduces server configuration hassle.
    instances: [{
        databaseURI: "mongodb://localhost/nodewiki-de",
        locale: "de",
        contentManagerPassword: "admin_de",
        dynamicNavigation: false,
        staticNavigation: true,
        localPort: 3001
    }, {
        databaseURI: "mongodb://localhost/nodewiki-en",
        locale: "en",
        contentManagerPassword: "admin_en",
        dynamicNavigation: false,
        staticNavigation: true,
        localPort: 3002
    }],

    vhosts: {

        // Mapping (sub-)domain's onto local instances
        // Requests to $domainName:$port get routed
        // to proper local instances magically.
        "mywiki.local": "127.0.0.1:3001",
        "www.mywiki.local": "127.0.0.1:3001",
        "de.mywiki.local": "127.0.0.1:3001",
        "en.mywiki.local": "127.0.0.1:3002"
    }
};