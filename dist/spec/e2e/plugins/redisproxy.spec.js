"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("supertest");
var fs_1 = require("fs");
var path_1 = require("path");
var __1 = require("../../..");
var config = JSON.parse(fs_1.readFileSync(path_1.resolve(__dirname, "..", "..", "..", "..", "config.json"), "utf-8"));
function ensureStartsBy(s, what) {
    return s.startsWith(what) ? s : what + s;
}
describe("Should work as expected", function () {
    beforeEach(function () {
        var configWithRPlugin = Object.assign({}, config, { restproxyplugins: ["redisproxy"] });
        var app = new __1.App(configWithRPlugin);
        return app.register().then(function () {
            _this.app = app;
        });
    });
    it("auxiliary function should work as expected", function () {
        expect(ensureStartsBy("a", "/")).toBe("/a");
        expect(ensureStartsBy("/a", "/")).toBe("/a");
    });
    it("should return ok when asking for valid content", function (done) {
        _this.app.refresh().then(function (validurls) {
            var validurl = validurls[0];
            var url = ensureStartsBy(validurl, "/");
            request(_this.app.app)
                .get(url)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(function (res) {
                expect(res.status).toBe(200);
                done();
            })
                .end(function () { });
        });
    });
    it("should return NOT FOUND when asking for no valid content", function (done) {
        _this.app.refresh().then(function (validurls) {
            var notvalidurl = validurls[0] + "veryrandomtextveryrandomtext";
            var url = ensureStartsBy(notvalidurl, "/");
            request(_this.app.app)
                .get(url)
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