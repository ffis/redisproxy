"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("supertest");
var fs_1 = require("fs");
var path_1 = require("path");
var __1 = require("../../..");
var config = JSON.parse(fs_1.readFileSync(path_1.resolve(__dirname, "..", "..", "..", "..", "config.json"), "utf-8"));
describe("Should work as expected", function () {
    it("should throw error when running without a proper configuration of plugins", function () {
        var notValidConfig = Object.assign({}, config);
        Reflect.deleteProperty(notValidConfig, "restproxyplugins");
        expect(function () {
            var app = new __1.App(notValidConfig);
        }).toThrow();
    });
});
describe("should work without plugins", function () {
    beforeEach(function () {
        var configWithoutPlugins = Object.assign({}, config, { restproxyplugins: [] });
        var app = new __1.App(configWithoutPlugins);
        return app.register().then(function () {
            _this.app = app.app;
        });
    });
    it("should return NOT FOUND error when asking for /", function (done) {
        request(_this.app)
            .get("/")
            .expect(function (res) {
            expect(res.status).toBe(404);
            done();
        })
            .end(function (err) {
            if (err)
                throw err;
        });
    });
});
//# sourceMappingURL=empty.spec.js.map