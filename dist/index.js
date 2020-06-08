"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.App = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var redis_1 = require("redis");
var utils_1 = require("./utils");
var util_1 = require("util");
var plugins_1 = require("./plugins");
var express = require("express"), url = require("url"), BloomFilter = require("bloom.js");
var App = /** @class */ (function () {
    function App(config) {
        var _this = this;
        this.config = config;
        this.app = express();
        this.server = utils_1.getServer(this.config, this.app);
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
            _this.app.get("*", function (req, res) {
                var key = url.parse(req.url).pathname;
                if (_this.filter.contains(key)) {
                    _this.redisclient.get(key, utils_1.sendCb(res));
                }
                else {
                    _this.refresh().then(function () {
                        if (_this.filter.contains(key)) {
                            _this.redisclient.get(key, utils_1.sendCb(res));
                        }
                        else {
                            res.status(404).jsonp("Not found");
                        }
                    });
                }
            });
        });
    };
    App.prototype.listen = function () {
        var _this = this;
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