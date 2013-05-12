"use strict";

var Page = require('../models/page');
var async = require("async");

var subNodes = function (req, res, cb) {
    Page.subNodes(req.path, function (err, subPages) {
        if (!err && subPages.length > 0 && req.path !== '/') {
            res.locals.navigation = subPages;
            res.locals.dynamicNavigationEnabled = true;
        }



        cb(err);
    });
};

var wrap = function (req, res, fn) {
    return function (cb) {
        fn(req, res, cb);
    };
};

module.exports = function (req, res, next) {
    async.parallel([
        wrap(req, res, subNodes)
    ],
        next
    );
};







