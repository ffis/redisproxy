"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeEventsProxy = void 0;
var RealtimeEventsProxy = /** @class */ (function () {
    function RealtimeEventsProxy(sourceBuilder, destBuilder) {
        this.sourceBuilder = sourceBuilder;
        this.destBuilder = destBuilder;
    }
    Object.defineProperty(RealtimeEventsProxy.prototype, "source", {
        get: function () {
            if (this.rtsource) {
                return this.rtsource;
            }
            this.rtsource = this.sourceBuilder();
            return this.rtsource;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RealtimeEventsProxy.prototype, "subscriber", {
        get: function () {
            if (this.rtdest) {
                return this.rtdest;
            }
            this.rtdest = this.destBuilder();
            return this.rtdest;
        },
        enumerable: false,
        configurable: true
    });
    RealtimeEventsProxy.prototype.run = function () {
        this.source.pipe(this.subscriber);
    };
    return RealtimeEventsProxy;
}());
exports.RealtimeEventsProxy = RealtimeEventsProxy;
//# sourceMappingURL=rtproxy.js.map