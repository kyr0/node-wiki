var express = require("express"),
    http = require("http"),
    mongoose = require("mongoose"),
    config = require("./config/" + (process.env.NODE_ENV || "development")),
    instanceConfig = config.instances[process.env.configIndex];

//console.log('instanceConfig', process.env.configIndex, instanceConfig);

// Connect to mongo db database
mongoose.connect(instanceConfig.databaseURI, function (err) {
    if (err) {
        console.log("Could not connect to database \"" +
            instanceConfig.databaseURI +
            "\". Ensure that a mongo db instance is up and running.");
        console.log(err);
        process.exit(1);
    }
});
require("express-mongoose");

var app = express();
app.disable("x-powered-by");

app.configure(function () {
    app.config = instanceConfig;
    app.set("port", instanceConfig.localPort);
    app.set("views", __dirname + "/views/" + instanceConfig.locale);
    app.set("view engine", "jade");
    app.use(express.favicon());
    app.use(express.logger("dev"));
    app.use(express.bodyParser({
        uploadDir: __dirname + "/uploads"
    }));
    app.use(express.cookieParser());
    app.use(express.methodOverride());

    app.use(express.static(__dirname + "/public"));
    app.use(app.router);
});

app.configure("development", function () {
    app.use(express.errorHandler());
});

app.all("*", require("./middleware/load-history"));
if (instanceConfig.dynamicNavigation) app.all("*", require("./middleware/load-navigation"));
if (instanceConfig.staticNavigation) app.all("*", require("./middleware/load-static-navigation"));
app.all("*", require("./middleware/build-breadcrumbs"));
app.all("*", require("./middleware/load-page"));

require("./routes")(app);

http.createServer(app).listen(instanceConfig.localPort, function () {
    console.log("Express server listening on port " + instanceConfig.localPort);
});