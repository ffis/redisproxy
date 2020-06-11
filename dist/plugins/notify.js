"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("assert");
var tiny = require("tiny-json-http");
var NotifyPlugin = /** @class */ (function () {
    function NotifyPlugin(config) {
        this.config = config;
        assert_1.ok(typeof config === "object", "config must be set when using notify plugin");
        assert_1.ok(typeof config.url === "string", "url attribute must be set when using notify plugin");
        assert_1.ok(config.url.startsWith("http://") || config.url.startsWith("https://"), "url attribute must start with http:// or https:// when using notify plugin");
        assert_1.ok(!config.MAX_CONTENT_LENGTH || typeof config.MAX_CONTENT_LENGTH === "number", "MAX_CONTENT_LENGTH attribute must be numeric when exists using notify plugin");
        this.MAX_CONTENT_LENGTH = config.MAX_CONTENT_LENGTH ? config.MAX_CONTENT_LENGTH : 1000000;
    }
    NotifyPlugin.prototype.ready = function () {
        return Promise.resolve();
    };
    NotifyPlugin.prototype.register = function (app) {
        var _this = this;
        app.app.use(function (req, res, next) {
            var user = res.locals.user;
            var data = {
                user: user,
                ip: req.get("X-Real-IP"),
                method: req.method,
                originalUrl: req.originalUrl,
                body: req.body,
                headers: req.headers
            };
            var contentLength = req.headers["content-length"] ? parseInt(req.headers["content-length"], 10) : null;
            if (contentLength && contentLength > _this.MAX_CONTENT_LENGTH) {
                Reflect.deleteProperty(data, "body");
            }
            var url = user ? Object.keys(user).reduce(function (p, c) { return p.replace(":" + c, user[c]); }, _this.config.url) : _this.config.url;
            tiny
                .post({ data: data, url: url })
                .catch(function (err) { return console.error(err); });
            next();
        });
        return Promise.resolve();
    };
    return NotifyPlugin;
}());
exports.default = NotifyPlugin;
//# sourceMappingURL=notify.js.map