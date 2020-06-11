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
        var configWithRPlugin = Object.assign({}, config, { restproxyplugins: ["redisproxy"] });
        var app = new __1.App(configWithRPlugin);
        return app.register().then(function () {
            _this.app = app;
        });
    });
    it("should return ok when asking for valid content", function (done) {
        _this.app.refresh().then(function (validurls) {
            if (validurls.length > 0) {
                var validurl = validurls[0];
                var url = validurl.startsWith("/") ? validurl : "/" + validurl;
                request(_this.app.app)
                    .get(url)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(function (res) {
                    expect(res.status).toBe(200);
                    done();
                })
                    .end(function (err) {
                    if (err)
                        throw err;
                });
            }
            else {
                done();
            }
        });
    });
});
//# sourceMappingURL=redisproxy.spec.js.map