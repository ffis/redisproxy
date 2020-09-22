"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("supertest");
var fs_1 = require("fs");
var path_1 = require("path");
var __1 = require("../../..");
var dabase_mock_1 = require("../../dabase.mock");
var config = JSON.parse(fs_1.readFileSync(path_1.resolve(__dirname, "..", "..", "..", "..", "config.json"), "utf-8"));
describe("Should work as expected", function () {
    beforeEach(function () {
        var _this = this;
        var directory = path_1.resolve(__dirname);
        var configWithStaticPlugin = Object.assign({}, config, { restproxyplugins: [["static", { endpoint: "/", directory: directory }]] });
        var app = new __1.App(configWithStaticPlugin, new dabase_mock_1.MockedDatabase());
        app.setServer();
        return app.register().then(function () {
            _this.app = app.app;
        });
    });
    it("should return ok when asking for /" + path_1.basename(__filename), function (done) {
        var url = "/" + path_1.basename(__filename);
        request(this.app)
            .get(url)
            .expect(function (res) {
            expect(res.status).toBe(200);
            done();
        })
            .end(function () { });
    });
});
//# sourceMappingURL=static.spec.js.map