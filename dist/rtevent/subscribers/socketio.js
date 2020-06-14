"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIORTEventSubscriber = void 0;
var SocketIORTEventSubscriber = /** @class */ (function () {
    function SocketIORTEventSubscriber() {
        this.logger = console;
    }
    SocketIORTEventSubscriber.prototype.listen = function (server) {
        this.clients = [];
        this.io = require("socket.io")(server);
    };
    SocketIORTEventSubscriber.prototype.publish = function (channel, message) {
        this.io.emit(channel, message);
        return Promise.resolve();
    };
    return SocketIORTEventSubscriber;
}());
exports.SocketIORTEventSubscriber = SocketIORTEventSubscriber;
//# sourceMappingURL=socketio.js.map