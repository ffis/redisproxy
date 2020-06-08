"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compression = require("compression");
var JWTPlugin = /** @class */ (function () {
    function JWTPlugin(config) {
        this.config = config;
    }
    JWTPlugin.prototype.ready = function () {
        return Promise.resolve();
    };
    JWTPlugin.prototype.register = function (app) {
        app.app.use(compression());
        return Promise.resolve();
    };
    return JWTPlugin;
}());
exports.default = JWTPlugin;
//# sourceMappingURL=compression.js.map