"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCb = exports.getServer = void 0;
var https_1 = require("https");
var fs_1 = require("fs");
var path_1 = require("path");
function getServer(config, app) {
    var server;
    if (config.server.https) {
        config.server.options.key = fs_1.readFileSync(path_1.resolve(__dirname, "..", config.server.options.key));
        config.server.options.cert = fs_1.readFileSync(path_1.resolve(__dirname, "..", config.server.options.cert));
        server = https_1.createServer(config.server.options, app);
        Reflect.deleteProperty(config.server, 'options');
    }
    else {
        server = require('http').createServer(app);
    }
    return server;
}
exports.getServer = getServer;
function sendCb(res) {
    return function (err, val) {
        if (err) {
            res.status(500).jsonp('Error!');
        }
        else if (val) {
            if (typeof val === 'string') {
                try {
                    var obj = JSON.parse(val);
                    res.jsonp(obj);
                }
                catch (e) {
                    res.jsonp(val);
                }
            }
            else {
                res.jsonp(val);
            }
        }
        else {
            res.status(404).jsonp('Not found!');
        }
    };
}
exports.sendCb = sendCb;
//# sourceMappingURL=utils.js.map