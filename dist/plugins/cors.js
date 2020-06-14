"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cors = require("cors");
var CorsPlugin = /** @class */ (function () {
    function CorsPlugin(config) {
        this.config = config;
    }
    CorsPlugin.prototype.ready = function () {
        return Promise.resolve();
    };
    CorsPlugin.prototype.register = function (app) {
        app.app.use(cors(this.config));
        return Promise.resolve();
    };
    return CorsPlugin;
}());
exports.default = CorsPlugin;
//# sourceMappingURL=cors.js.map