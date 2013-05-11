"use strict";

var Page = require("../models/page");

module.exports = function (app) {

    var i18n = require("../public/locale/" + app.config.locale);

    app.get("/tags", function (req, res) {
        Page.mapReduce({
            map: map,
            reduce: reduce
        }, function (err, result) {
            if (err) {
                return res.send(500);
            }
            res.render("tags", {
                title: i18n["All Pages"],
                tags: result
            });
        });
    });

    app.get("/tags/:tag", function (req, res) {
        Page.find({
            tags: req.params.tag
        }, function (err, result) {
            if (err) {
                res.send(500);
            }

            res.render("tag", {
                title: i18n["Tag"] + ": " + req.params.tag,
                pages: result
            });
        });
    });
};

var map = function () {
    if (!this.tags) {
        return;
    }

    for (var index in this.tags) {
        if (this.tags[index]) {
            emit(this.tags[index], 1);
        }
    }
};

var reduce = function (previous, current) {
    var count = 0;

    for (var index in current) {
        if (current.hasOwnProperty(index)) {
            count += current[index];
        }
    }

    return count;
};
