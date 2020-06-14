"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var ApiPlugin = /** @class */ (function () {
    function ApiPlugin() {
    }
    ApiPlugin.prototype.ready = function () {
        return Promise.resolve();
    };
    ApiPlugin.prototype.register = function (app) {
        var keys = util_1.promisify(app.redisclient.keys).bind(app.redisclient);
        app.app.get("/api", function (req, res) {
            keys("*").then(function (keys) {
                res.jsonp(keys);
            }).catch(function (err) {
                console.error(err);
                res.status(500).send("Error");
            });
        });
        return Promise.resolve();
    };
    return ApiPlugin;
}());
exports.default = ApiPlugin;
//# sourceMappingURL=api.js.map