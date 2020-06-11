"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("supertest");
var fs_1 = require("fs");
var path_1 = require("path");
var http_1 = require("http");
var __1 = require("../../..");
var portfinder = require("portfinder");
var config = JSON.parse(fs_1.readFileSync(path_1.resolve(__dirname, "..", "..", "..", "..", "config.json"), "utf-8"));
describe("Should work as expected", function () {
    beforeEach(function () {
        return portfinder.getPortPromise().then(function (port) {
            var url = "http://localhost:" + port;
            _this.port = port;
            var configWithNotifyPlugin = Object.assign({}, config, { restproxyplugins: [["notify", { url: url }]] });
            var app = new __1.App(configWithNotifyPlugin);
            return app.register().then(function () {
                _this.app = app.app;
            });
        });
    });
    it("should notify when asking for /", function (done) {
        var server = http_1.createServer(function (req, res) {
            res.writeHead(201);
            res.end();
            expect(req.method).toBe("POST");
            server.close();
            done();
        }).listen(_this.port);
        var url = "/";
        request(_this.app)
            .get(url)
            .end(function (err) {
            if (err)
                throw err;
        });
    });
});
//# sourceMappingURL=notify.spec.js.map