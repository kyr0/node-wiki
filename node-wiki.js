"use strict";

var config = require("./config/" + (process.env.NODE_ENV || "development")),
    vhoster = require("./lib/vhoster"),
    childProcess = require("child_process");

// start port-forwarding
vhoster(config);

// Start each configured instance...
for (var i=0; i<config.instances.length; i++) {

    childProcess.fork('./node-wiki-app', [], {
        env: {
            configIndex: i
        }
    });
}