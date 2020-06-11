"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.App = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var redis_1 = require("redis");
var express = require("express");
var utils_1 = require("./utils");
var util_1 = require("util");
var plugins_1 = require("./plugins");
var BloomFilter = require("bloom.js");
var App = /** @class */ (function () {
    function App(config) {
        var _this = this;
        this.config = config;
        if (!config.restproxyplugins) {
            throw new Error("You need to enable at least one plugin. Try editing config.json file and add plugin: [\"redisproxy\"]");
        }
        this.app = express();
        this.filter = new BloomFilter();
        this.redisclient = redis_1.createClient(config.redis);
        this.readyP = new Promise(function (resolve, reject) {
            _this.redisclient.once("ready", function () {
                resolve();
                _this.refresh();
            });
            _this.redisclient.once("error", function () {
                reject();
            });
            _this.keys = util_1.promisify(_this.redisclient.keys).bind(_this.redisclient);
        });
    }
    App.prototype.isValid = function (key) {
        return this.filter.contains(key);
    };
    App.prototype.refresh = function () {
        var _this = this;
        return this.keys("*").then(function (vals) {
            _this.filter = new BloomFilter();
            vals.forEach(function (value) {
                _this.filter.add(value);
            });
            return vals;
        });
    };
    App.prototype.ready = function () {
        var _this = this;
        this.plugins = plugins_1.buildPlugins(this.config);
        return Promise.all(this.plugins.map(function (p) { return p.ready(); })).then(function () { return _this.readyP; });
    };
    App.prototype.register = function () {
        var _this = this;
        return this.ready().then(function () {
            _this.plugins.forEach(function (plugin) {
                plugin.register(_this);
            });
        });
    };
    App.prototype.listen = function () {
        var _this = this;
        if (!this.config.server || !this.config.server.port || !this.config.server.bind) {
            throw new Error("No valid config for server has been set");
        }
        this.server = utils_1.getServer(this.config, this.app);
        this.server.listen(this.config.server.port, this.config.server.bind, function () {
            var protocol = _this.config.server.https ? "https" : "http";
            console.log("Listening on", protocol + "://" + _this.config.server.bind + ":" + _this.config.server.port);
        });
    };
    return App;
}());
exports.App = App;
function run() {
    var config = JSON.parse(fs_1.readFileSync(path_1.resolve(__dirname, "..", "config.json"), "utf-8"));
    var app = new App(config);
    app.register().then(function () {
        app.listen();
    }).catch(function (err) {
        console.error(err);
        throw err;
    });
}
exports.run = run;
if (require.main === module) {
    run();
}
//# sourceMappingURL=index.js.map