"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisRTEventsSource = void 0;
var util_1 = require("util");
var console_1 = require("console");
var RedisRTEventsSource = /** @class */ (function () {
    function RedisRTEventsSource(redissubs, channels) {
        this.redissubs = redissubs;
        this.channels = channels;
        this.subscribers = [];
    }
    RedisRTEventsSource.prototype.subscribe = function () {
        var _this = this;
        this.redissubs.on("message", function (channel, data) {
            var parsedData = data;
            try {
                parsedData = JSON.parse(data);
            }
            catch (err) { }
            _this.subscribers.forEach(function (sb) {
                sb.publish(channel, parsedData);
            });
        });
        var subscribe = util_1.promisify(this.redissubs.subscribe).bind(this.redissubs);
        return Promise.all(this.channels.map(function (channel) { return subscribe(channel); })).then(function () { });
    };
    RedisRTEventsSource.prototype.pipe = function (to) {
        this.subscribers.push(to);
    };
    RedisRTEventsSource.prototype.unpipe = function (who) {
        var idx = this.subscribers.indexOf(who);
        console_1.assert(idx >= 0, "you cannot unpipe what is not already piped");
        this.subscribers.splice(idx, 1);
    };
    return RedisRTEventsSource;
}());
exports.RedisRTEventsSource = RedisRTEventsSource;
//# sourceMappingURL=redisbased.js.map