"use strict";

var Page = require("../models/page");

var next = function (versions, id) {
    for (var i = 0; i < versions.length; i++) {
        if (versions[i]._id == id && versions[i + 1]) return versions[i + 1];
    }
};

var previous = function (versions, id) {
    for (var i = 0; i < versions.length; i++) {
        if (versions[i]._id == id && versions[i - 1]) return versions[i - 1];
    }
};


var loadPage = function (req, res, next) {
    Page.findOne({_id: req.params.pageId }, function (err, page) {
        if (err) {
            console.error(err);
            res.send(500);
        }
        if (!page) {
            return res.send(404);
        }

        req.page = page;

        next();
    });
};

var loadVersion = function (req, res, next) {
    Page.VersionedModel.findOne({refId: req.params.pageId }, function (err, history) {
        if (err) {
            console.error(err);
            res.send(500);
        }

        req.version = history.versions.id(req.params.version);

        if (!history || !req.version) {
            return res.send(404);
        }

        next();
    });
};

module.exports = function (app) {

    var i18n = require("../public/locale/" + app.config.locale);

    app.get("/versions", function (req, res) {
        Page.VersionedModel.latest(100, function (err, pages) {

            // Show latest existing pages
            var existingPages = [];
            var checked = 0;

            for (var i=0; i<pages.length; i++) {

                Page.findOne({
                    title: pages[i].title
                }, function(err, page) {

                    if (page) {

                        for (var j=0; j<pages.length; j++) {
                            if (pages[j].title === page.title) {
                                existingPages.push(pages[j]);
                            }
                        }
                    }
                    checked++;
                });
            }

            var checkIter = setInterval(function() {

                if (checked === pages.length) {
                    clearInterval(checkIter);

                    res.render("versionedpages", {
                        pages: existingPages,
                        title: i18n["Page Versions"]
                    });
                }
            }, 10);

        });
    });

    app.get("/versions/:pageId", function (req, res) {
        var pageId = req.param("pageId");

        if (!pageId) {
            return res.send(400);
        }

        Page.VersionedModel.findOne({
            refId: pageId
        }, function(err, document) {

            // Sort
            if (document && document.versions) {

                document.versions.sort(function(pageA, pageB) {
                    return pageA.lastModified < pageB.lastModified;
                });

                console.log('pages sorted', document.versions);

            }

            res.render("versions", {
                document: document,
                page: Page.findOne({
                    _id: pageId
                }),
                title: i18n["Versions"]
            });
        });
    });

    app.get("/versions/:pageId/:version", function (req, res) {
        Page.VersionedModel.findOne({
            refId: req.params.pageId
        }).exec(function (err, history) {


                console.log('history', history);

            if (err) {
                console.error(err);
                return res.send(500);
            }

            var version = history.versions.id(req.params.version);

            if (!version) {
                return res.send(404);
            }

            console.log('version', version);

            res.render("version", {
                version: version,
                page: Page.findOne({
                    _id: req.params.pageId
                }),
                title: i18n["Version for"] + " " + version.title,
                next: next(history.versions, req.params.version),
                previous: previous(history.versions, req.params.version)
            });
        });
    });

    app.post("/versions/:pageId/:version/restore", [loadPage, loadVersion], function (req, res) {
        var page = req.page;
        var version = req.version;

        page.title = version.title;
        page.content = version.content;
        page.modifiedBy = version.modifiedBy;
        page.tags = version.tags;

        page.save(function (err) {
            if (err) {
                return res.send(500);
            }

            res.redirect(page.path);
        });
    });
};
