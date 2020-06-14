"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redis_1 = require("redis");
var redisbased_1 = require("../rtevent/sources/redisbased");
var socketio_1 = require("../rtevent/subscribers/socketio");
var rtproxy_1 = require("../rtproxy");
var RealTimeProxyPlugin = /** @class */ (function () {
    function RealTimeProxyPlugin(config) {
        this.config = config;
    }
    RealTimeProxyPlugin.prototype.ready = function () {
        return Promise.resolve();
    };
    RealTimeProxyPlugin.prototype.register = function (app) {
        var _this = this;
        var sourceBuilder = function () {
            var redissub = redis_1.createClient(_this.config.redis);
            return new redisbased_1.RedisRTEventsSource(redissub, _this.config.redischannels);
        };
        var destBuilder = function () {
            var dest = new socketio_1.SocketIORTEventSubscriber();
            dest.listen(app.server);
            return dest;
        };
        this.proxy = new rtproxy_1.RealtimeEventsProxy(sourceBuilder, destBuilder);
        return this.proxy.run();
    };
    RealTimeProxyPlugin.prototype.unregister = function () {
        return this.proxy.close();
    };
    return RealTimeProxyPlugin;
}());
exports.default = RealTimeProxyPlugin;
//# sourceMappingURL=realtimeproxy.js.map