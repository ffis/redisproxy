"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisRTEventsSource = void 0;
var RedisRTEventsSource = /** @class */ (function () {
    function RedisRTEventsSource(redissubs) {
        this.redissubs = redissubs;
        this.logger = console;
        this.subscribers = [];
    }
    RedisRTEventsSource.prototype.subscribe = function () {
        var _this = this;
        this.redissubs.subscribe("updates", function (evt) {
            _this.logger.log(evt);
        });
        this.redissubs.on("message", function (channel, data) {
            _this.logger.log(channel, data);
            _this.subscribers.forEach(function (sb) {
                sb.publish(data);
            });
        });
        return Promise.resolve();
    };
    RedisRTEventsSource.prototype.pipe = function (to) {
        this.subscribers.push(to);
    };
    RedisRTEventsSource.prototype.unpipe = function (who) {
        var idx = this.subscribers.indexOf(who);
        if (idx >= 0) {
            this.subscribers.splice(idx, 1);
        }
    };
    return RedisRTEventsSource;
}());
exports.RedisRTEventsSource = RedisRTEventsSource;
//# sourceMappingURL=redisbased.js.map