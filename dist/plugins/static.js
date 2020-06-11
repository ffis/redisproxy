"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("assert");
var express_1 = require("express");
var StaticPlugin = /** @class */ (function () {
    function StaticPlugin(config) {
        this.config = config;
        assert_1.ok(typeof config === "object", "config must be set when using static plugin");
        assert_1.ok(typeof config.endpoint === "string", "endpoint attribute must be set when using static plugin");
        assert_1.ok(typeof config.directory === "string", "directory attribute must be set when using static plugin");
    }
    StaticPlugin.prototype.ready = function () {
        return Promise.resolve();
    };
    StaticPlugin.prototype.register = function (app) {
        var options = Object.assign({}, { dotfiles: "deny", index: false }, this.config.options);
        app.app.use(this.config.endpoint, express_1.static(this.config.directory, options));
        return Promise.resolve();
    };
    return StaticPlugin;
}());
exports.default = StaticPlugin;
//# sourceMappingURL=static.js.map