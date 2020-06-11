"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var url_1 = require("url");
function sendCb(res) {
    return function (err, val) {
        if (err) {
            res.status(500).jsonp('Error!');
        }
        else if (val) {
            if (typeof val === 'string') {
                try {
                    var obj = JSON.parse(val);
                    res.jsonp(obj);
                }
                catch (e) {
                    res.jsonp(val);
                }
            }
            else {
                res.jsonp(val);
            }
        }
        else {
            res.status(404).jsonp('Not found!');
        }
    };
}
var RedisProxyPlugin = /** @class */ (function () {
    function RedisProxyPlugin() {
    }
    RedisProxyPlugin.prototype.ready = function () {
        return Promise.resolve();
    };
    RedisProxyPlugin.prototype.register = function (app) {
        app.app.get("*", function (req, res, next) {
            var key = url_1.parse(req.url).pathname;
            if (app.isValid(key)) {
                app.redisclient.get(key, sendCb(res));
            }
            else {
                app.refresh().then(function () {
                    if (app.isValid(key)) {
                        app.redisclient.get(key, sendCb(res));
                    }
                    else {
                        next();
                    }
                });
            }
        });
        return Promise.resolve();
    };
    return RedisProxyPlugin;
}());
exports.default = RedisProxyPlugin;
//# sourceMappingURL=redisproxy.js.map