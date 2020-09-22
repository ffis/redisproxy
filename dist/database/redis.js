"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisDatabase = void 0;
var redis_1 = require("redis");
var util_1 = require("util");
var RedisDatabase = /** @class */ (function () {
    function RedisDatabase(config) {
        this.redisclient = redis_1.createClient(config);
    }
    RedisDatabase.prototype.keys = function (p) {
        var _this = this;
        return this.ready().then(function () { return _this.keysFn(p); });
    };
    RedisDatabase.prototype.get = function (key) {
        var _this = this;
        return this.ready().then(function () { return _this.getFn(key); });
    };
    RedisDatabase.prototype.ready = function () {
        var _this = this;
        if (!this.isReady) {
            this.isReady = new Promise(function (resolve, reject) {
                _this.redisclient.once("ready", function () {
                    _this.keysFn = util_1.promisify(_this.redisclient.keys).bind(_this.redisclient);
                    _this.getFn = util_1.promisify(_this.redisclient.get).bind(_this.redisclient);
                    resolve();
                });
                _this.redisclient.once("error", function () {
                    reject();
                });
            });
        }
        return this.isReady;
    };
    return RedisDatabase;
}());
exports.RedisDatabase = RedisDatabase;
//# sourceMappingURL=redis.js.map