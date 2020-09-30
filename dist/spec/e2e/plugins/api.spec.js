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
        var configWithApiPlugin = Object.assign({}, config, { restproxyplugins: ["api"] });
        var app = new __1.App(configWithApiPlugin, new database_mock_1.MockedDatabase());
        return app.register().then(function () {
            _this.app = app.app;
        });
    });
    it("should return ok when asking for api", function (done) {
        var url = "/api";
        request(this.app)
            .get(url)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(function (res) {
            expect(res.status).toBe(200);
            var collection = res.body;
            expect(Array.isArray(collection)).toBeTrue();
            expect(collection.length).toBeGreaterThan(0);
            done();
        })
            .end(function () { });
    });
});
//# sourceMappingURL=api.spec.js.map