"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServer = void 0;
var https_1 = require("https");
var fs_1 = require("fs");
var path_1 = require("path");
function getServer(config, app) {
    var server;
    if (config.server.https) {
        var options = Object.assign({}, config.server.options);
        options.key = fs_1.readFileSync(path_1.resolve(__dirname, "..", options.key), "utf-8");
        options.cert = fs_1.readFileSync(path_1.resolve(__dirname, "..", options.cert), "utf-8");
        server = https_1.createServer(options, app);
    }
    else {
        server = require('http').createServer(app);
    }
    return server;
}
exports.getServer = getServer;
//# sourceMappingURL=utils.js.map