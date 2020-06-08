"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTDecoder = void 0;
var tiny = require("tiny-json-http");
var jwt = require("jwt-simple");
var MAX_CONTENT_LENGTH = 1000000;
var JWTDecoder = /** @class */ (function () {
    function JWTDecoder(config) {
        this.config = config;
        this.jwtKey = JWTDecoder.getJwtKeyFromConfig(config);
    }
    JWTDecoder.getJwtKeyFromConfig = function (config) {
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
    JWTDecoder.prototype.register = function (app) {
        var _this = this;
        app.use(function (req, res, next) {
            if (_this.config.ignoreUrls && _this.config.ignoreUrls.indexOf(req.originalUrl) >= 0) {
                return next();
            }
            var auth = req.header("Authorization");
            if (auth && auth.startsWith("Bearer ")) {
                var token = auth.replace("Bearer ", "");
                try {
                    var decoded_1 = jwt.decode(token, _this.jwtKey);
                    res.locals.user = decoded_1;
                    var data = {
                        user: decoded_1,
                        ip: req.get("X-Real-IP"),
                        method: req.method,
                        originalUrl: req.originalUrl,
                        body: req.body,
                        headers: req.headers
                    };
                    var contentLength = req.headers["content-length"] ? parseInt(req.headers["content-length"], 10) : null;
                    if (contentLength && contentLength > MAX_CONTENT_LENGTH) {
                        Reflect.deleteProperty(data, "body");
                    }
                    // esto se hace en paralelo
                    if (_this.config.notify) {
                        var url = Object.keys(decoded_1).reduce(function (p, c) { return p.replace(":" + c, decoded_1[c]); }, _this.config.notify);
                        tiny.post({
                            url: url,
                            data: data
                        }).then(function () { }).catch(function (err) { return console.error(err); });
                    }
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
    };
    return JWTDecoder;
}());
exports.JWTDecoder = JWTDecoder;
//# sourceMappingURL=jwtdecoder.js.map