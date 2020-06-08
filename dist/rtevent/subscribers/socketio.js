"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIORTEventSubscriber = void 0;
var SocketIORTEventSubscriber = /** @class */ (function () {
    function SocketIORTEventSubscriber() {
        this.logger = console;
    }
    SocketIORTEventSubscriber.prototype.listen = function (server) {
        var _this = this;
        this.io = require("socket.io")(server);
        this.io.on("connection", function (client) {
            _this.logger.log("Added client", _this.clients.length);
            client.on("event", function (data) {
                _this.logger.log(data);
                _this.clients.push(client);
            });
            client.on("disconnect", function () {
                var index = _this.clients.indexOf(client);
                if (index > -1) {
                    _this.clients.splice(index, 1);
                }
                _this.logger.log("removed client. Now we have", _this.clients.length, "clients");
            });
        });
    };
    SocketIORTEventSubscriber.prototype.publish = function (message) {
        this.clients.forEach(function (socket) {
            socket.send(message);
        });
        return Promise.resolve();
    };
    return SocketIORTEventSubscriber;
}());
exports.SocketIORTEventSubscriber = SocketIORTEventSubscriber;
//# sourceMappingURL=socketio.js.map