"use strict";

var Page = require("../models/page");

module.exports = function (app) {

    var i18n = require("../public/locale/" + app.config.locale);

    app.get("/search", function (req, res) {
        var query = req.param("q");

        Page.search(query, function (err, results) {
            // TODO: err
            return res.render("search", {
                title: i18n["search"] + " " + query,
                results: results
            });
        });
    });
};
