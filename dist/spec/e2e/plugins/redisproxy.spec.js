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
        var configWithRPlugin = Object.assign({}, config, { restproxyplugins: ["redisproxy"] });
        var app = new __1.App(configWithRPlugin, new dabase_mock_1.MockedDatabase());
        app.setServer();
        return app.register().then(function () {
            _this.app = app;
        });
    });
    it("should return ok when asking for a valid content", function (done) {
        var _this = this;
        this.app.refresh().then(function (urls) {
            var validurls = urls.filter(function (u) { return u.startsWith("/"); });
            if (validurls.length === 0) {
                return done();
            }
            var url = validurls[0];
            request(_this.app.app)
                .get(url)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(function (res) {
                expect(res.status).toBe(200);
                done();
            })
                .end(function () { });
        }).catch(function (err) {
            expect(err).toBeUndefined();
            done();
        });
    });
    it("should return NOT FOUND when asking for no valid content", function (done) {
        var _this = this;
        this.app.refresh().then(function () {
            var notvalidurl = "/veryrandomtextveryrandomtext";
            request(_this.app.app)
                .get(notvalidurl)
                .set('Accept', 'application/json')
                .expect(function (res) {
                expect(res.status).toBe(404);
                done();
            })
                .end(function () { });
        });
    });
});
//# sourceMappingURL=redisproxy.spec.js.map