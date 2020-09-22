"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("assert");
var Cryptr = require("cryptr");
var redisproxy_1 = require("./redisproxy");
var DecryptPlugin = /** @class */ (function (_super) {
    __extends(DecryptPlugin, _super);
    function DecryptPlugin(config) {
        var _this = _super.call(this) || this;
        assert_1.ok(typeof config === "object", "config must be set when using Decrypt plugin");
        assert_1.ok(typeof config.secret === "string", "secret attribute must be set when using Decrypt plugin");
        _this.cryptr = new Cryptr(config.secret);
        return _this;
    }
    DecryptPlugin.prototype.ready = function () {
        return Promise.resolve();
    };
    DecryptPlugin.prototype.parse = function () {
        var _this = this;
        return function (s) {
            return JSON.parse(_this.cryptr.decrypt(s));
        };
    };
    return DecryptPlugin;
}(redisproxy_1.default));
exports.default = DecryptPlugin;
//# sourceMappingURL=decrypt.js.map