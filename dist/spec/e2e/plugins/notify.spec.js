"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("supertest");
var fs_1 = require("fs");
var path_1 = require("path");
var http_1 = require("http");
var __1 = require("../../..");
var portfinder = require("portfinder");
var database_mock_1 = require("../../database.mock");
var config = JSON.parse(fs_1.readFileSync(path_1.resolve(__dirname, "..", "..", "..", "..", "config.json"), "utf-8"));
describe("Should work as expected", function () {
    beforeEach(function () {
        var _this = this;
        return portfinder.getPortPromise().then(function (port) {
            var url = "http://localhost:" + port;
            _this.port = port;
            var options = { url: url, MAX_CONTENT_LENGTH: 2 };
            var configWithNotifyPlugin = Object.assign({}, config, { restproxyplugins: [["notify", options]] });
            var app = new __1.App(configWithNotifyPlugin, new database_mock_1.MockedDatabase());
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
        }).listen(this.port);
        var url = "/";
        request(this.app)
            .get(url)
            .end(function () { });
    });
    it("should notify when no body for /", function (done) {
        var server = http_1.createServer(function (req, res) {
            res.writeHead(201);
            res.end();
            expect(req.method).toBe("POST");
            server.close();
            done();
        }).listen(this.port);
        var url = "/";
        request(this.app)
            .post(url)
            .send({ "close": "example" })
            .end(function () { });
    });
});
//# sourceMappingURL=notify.spec.js.map