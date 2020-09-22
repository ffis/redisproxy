"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var url_1 = require("url");
var utils_1 = require("./utils");
var RedisProxyPlugin = /** @class */ (function () {
    function RedisProxyPlugin() {
    }
    RedisProxyPlugin.prototype.parse = function () {
        return JSON.parse;
    };
    RedisProxyPlugin.prototype.ready = function () {
        return Promise.resolve();
    };
    RedisProxyPlugin.prototype.register = function (app) {
        var _this = this;
        app.app.get("*", function (req, res, next) {
            var key = url_1.parse(req.url).pathname;
            if (app.isValid(key)) {
                _this.sendData2Output(app, key, res);
            }
            else {
                app.refresh().then(function () {
                    if (app.isValid(key)) {
                        _this.sendData2Output(app, key, res);
                    }
                    else {
                        next();
                    }
                });
            }
        });
        return Promise.resolve();
    };
    RedisProxyPlugin.prototype.sendData2Output = function (app, key, res) {
        var _this = this;
        app.database.get(key).then(function (value) {
            utils_1.sendCb(res, _this.parse)(null, value);
        }).catch(function (err) {
            utils_1.sendCb(res, _this.parse)(err);
        });
    };
    return RedisProxyPlugin;
}());
exports.default = RedisProxyPlugin;
//# sourceMappingURL=redisproxy.js.map