"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("supertest");
var fs_1 = require("fs");
var path_1 = require("path");
var __1 = require("../../..");
var database_mock_1 = require("../../database.mock");
var config = JSON.parse(fs_1.readFileSync(path_1.resolve(__dirname, "..", "..", "..", "..", "config.json"), "utf-8"));
describe("Should work as expected", function () {
    beforeEach(function () {
        var _this = this;
        var configWithRPlugin = Object.assign({}, config, { restproxyplugins: ["redisproxy"] });
        var app = new __1.App(configWithRPlugin, new database_mock_1.MockedDatabase());
        app.setServer();
        return app.register().then(function () {
            _this.app = app;
        });
    });
    it("should return ok when asking for a valid content", function () {
        var _this = this;
        return this.app.refresh().then(function (urls) {
            var validurls = urls.filter(function (u) { return u.startsWith("/"); });
            if (validurls.length === 0) {
                return;
            }
            var url = validurls[0];
            return request(_this.app.app)
                .get(url)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
        });
    });
    it("should return NOT FOUND when asking for no valid content", function () {
        var _this = this;
        return this.app.refresh().then(function () {
            var notvalidurl = "/veryrandomtextveryrandomtext";
            return request(_this.app.app)
                .get(notvalidurl)
                .set('Accept', 'application/json')
                .expect(404);
        });
    });
});
//# sourceMappingURL=redisproxy.spec.js.map