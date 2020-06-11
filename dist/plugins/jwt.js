"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require("jwt-simple");
var assert_1 = require("assert");
var supportedFormats = ["hex", "base64"];
var JWTPlugin = /** @class */ (function () {
    function JWTPlugin(config) {
        this.config = config;
        assert_1.ok(typeof config === "object", "config must be set when using jwt plugin");
        assert_1.ok(typeof config.secret === "string", "secret field must exist when using jwt plugin");
        if (config.ignoreUrls) {
            assert_1.ok(Array.isArray(config.ignoreUrls), "ignoreUrls field must be an array of strings");
            var types = Array.from(config.ignoreUrls.reduce(function (p, c) {
                var type = typeof c;
                p.add(type);
                return p;
            }, new Set()));
            assert_1.ok(types.length === 0 || (types.length === 1 && types[0] === "string"), "ignoreUrls field must be an array of strings");
        }
        if (config.format) {
            assert_1.ok(supportedFormats.indexOf(config.format) >= 0, "format can be only one of supported: [" + supportedFormats.join(",") + "]");
        }
        this.jwtKey = JWTPlugin.getJwtKeyFromConfig(config);
    }
    JWTPlugin.getJwtKeyFromConfig = function (config) {
        var jwtKey = config.secret;
        switch (config.format) {
            case "hex":
                jwtKey = Buffer.from(jwtKey, "hex");
                break;
            case "base64":
                jwtKey = Buffer.from(jwtKey, "base64");
                break;
            default:
        }
        return jwtKey;
    };
    JWTPlugin.prototype.ready = function () {
        return Promise.resolve();
    };
    JWTPlugin.prototype.register = function (app) {
        var _this = this;
        app.app.use(function (req, res, next) {
            if (Array.isArray(_this.config.ignoreUrls) && _this.config.ignoreUrls.indexOf(req.originalUrl) >= 0) {
                return next();
            }
            var auth = req.header("Authorization");
            if (auth && auth.startsWith("Bearer ")) {
                var token = auth.replace("Bearer ", "");
                try {
                    var decoded = jwt.decode(token, _this.jwtKey);
                    res.locals.user = decoded;
                    next();
                }
                catch (e) {
                    res.status(401).send("Unauthorized");
                }
            }
            else {
                res.status(401).send("Unauthorized");
            }
        });
        return Promise.resolve();
    };
    return JWTPlugin;
}());
exports.default = JWTPlugin;
//# sourceMappingURL=jwt.js.map