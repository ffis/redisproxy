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
        var configWithApiPlugin = Object.assign({}, config, { restproxyplugins: ["api"] });
        var app = new __1.App(configWithApiPlugin);
        return app.register().then(function () {
            _this.app = app.app;
        });
    });
    it("should return ok when asking for api", function (done) {
        var url = "/api";
        request(_this.app)
            .get(url)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function (res) {
            expect(res.status).toBe(200);
            var collection = res.body;
            expect(Array.isArray(collection)).toBeTrue();
            expect(collection.length).toBeGreaterThan(0);
            done();
        })
            .end(function (err) {
            if (err)
                throw err;
        });
    });
});
//# sourceMappingURL=api.spec.js.map