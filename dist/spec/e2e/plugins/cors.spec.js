"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("supertest");
var fs_1 = require("fs");
var path_1 = require("path");
var __1 = require("../../..");
var dabase_mock_1 = require("../../dabase.mock");
var config = JSON.parse(fs_1.readFileSync(path_1.resolve(__dirname, "..", "..", "..", "..", "config.json"), "utf-8"));
var fakeServer = "https://example.com";
describe("Should work as expected", function () {
    beforeEach(function () {
        var _this = this;
        var options = {
            origin: [fakeServer]
        };
        var configWithCorsPlugin = Object.assign({}, config, { restproxyplugins: [["cors", options]] });
        var app = new __1.App(configWithCorsPlugin, new dabase_mock_1.MockedDatabase());
        return app.register().then(function () {
            _this.app = app.app;
        });
    });
    it("should use cors when asking for /", function (done) {
        var url = "/";
        request(this.app)
            .options(url)
            .set("Origin", fakeServer)
            .expect(function (res) {
            expect(res.header["access-control-allow-origin"]).toBe(fakeServer);
            done();
        })
            .end(function () { });
    });
    it("should fail using cors when asking for /", function (done) {
        var url = "/";
        request(this.app)
            .options(url)
            .set("Origin", fakeServer + "err")
            .expect(function (res) {
            expect(res.header["access-control-allow-origin"]).not.toBe(fakeServer);
            expect(res.header["access-control-allow-origin"]).not.toBe(fakeServer + "err");
            done();
        })
            .end(function () { });
    });
});
//# sourceMappingURL=cors.spec.js.map