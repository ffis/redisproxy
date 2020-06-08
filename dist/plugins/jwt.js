"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwtdecoder_1 = require("../jwtdecoder");
var JWTPlugin = /** @class */ (function () {
    function JWTPlugin(config) {
        this.config = config;
    }
    JWTPlugin.prototype.ready = function () {
        return Promise.resolve();
    };
    JWTPlugin.prototype.register = function (app) {
        var jwtdecoder = new jwtdecoder_1.JWTDecoder(this.config.jwtdecoder);
        jwtdecoder.register(app.app);
        return Promise.resolve();
    };
    return JWTPlugin;
}());
exports.default = JWTPlugin;
//# sourceMappingURL=jwt.js.map