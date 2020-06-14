"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compression = require("compression");
var CompressionPlugin = /** @class */ (function () {
    function CompressionPlugin(config) {
        this.config = config;
    }
    CompressionPlugin.prototype.ready = function () {
        return Promise.resolve();
    };
    CompressionPlugin.prototype.register = function (app) {
        app.app.use(compression(this.config));
        return Promise.resolve();
    };
    return CompressionPlugin;
}());
exports.default = CompressionPlugin;
//# sourceMappingURL=compression.js.map