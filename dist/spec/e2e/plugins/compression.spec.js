"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("supertest");
var fs_1 = require("fs");
var path_1 = require("path");
var __1 = require("../../..");
var config = JSON.parse(fs_1.readFileSync(path_1.resolve(__dirname, "..", "..", "..", "..", "config.json"), "utf-8"));
describe("Should work as expected", function () {
    beforeEach(function () {
        var configWithCompressionPlugin = Object.assign({}, config, { restproxyplugins: [["compression", { threshold: 1 }]] });
        var app = new __1.App(configWithCompressionPlugin);
        return app.register().then(function () {
            _this.app = app.app;
        });
    });
    it("should use compression when asking for /", function (done) {
        var url = "/";
        request(_this.app)
            .get(url)
            .set("Accept-Encoding", "gzip")
            .expect(function (res) {
            expect(res.header["content-encoding"]).toBe("gzip");
            done();
        })
            .end(function () { });
    });
});
//# sourceMappingURL=compression.spec.js.map