"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("supertest");
var fs_1 = require("fs");
var path_1 = require("path");
var __1 = require("../..");
var jwtdecoder_1 = require("../../jwtdecoder");
var jwt = require("jwt-simple");
var config = JSON.parse(fs_1.readFileSync(path_1.resolve(__dirname, "..", "..", "..", "config.json"), "utf-8"));
config.server.expose = true;
Reflect.deleteProperty(config.jwtdecoder, "notify");
function getValidToken() {
    var jwtkey = jwtdecoder_1.JWTDecoder.getJwtKeyFromConfig(config.jwtdecoder);
    var validTokenContent = {
        user: "test",
        exp: (Date.now() / 1000) + 100
    };
    return jwt.encode(validTokenContent, jwtkey);
}
function getInvalidToken() {
    var jwtkey = jwtdecoder_1.JWTDecoder.getJwtKeyFromConfig({
        "secret": "00",
        "format": "base64"
    });
    var validTokenContent = {
        user: "test",
        exp: (Date.now() / 1000) + 100
    };
    return jwt.encode(validTokenContent, jwtkey);
}
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
describe("Should work as expected", function () {
    beforeEach(function () {
        var configWithJWTPlugin = Object.assign({}, config, { restproxyplugins: ["api"] });
        var app = new __1.App(configWithJWTPlugin);
        return app.register().then(function () {
            _this.app = app.app;
        });
    });
    it("should return ok when asking for api", function (done) {
        var token = getValidToken();
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
describe("Should work as expected", function () {
    beforeEach(function () {
        var configWithJWTPlugin = Object.assign({}, config, { restproxyplugins: ["jwt"] });
        var app = new __1.App(configWithJWTPlugin);
        return app.register().then(function () {
            _this.app = app.app;
        });
    });
    it("should return NOT AUTHORIZED when asking for /", function (done) {
        request(_this.app)
            .get("/")
            .expect(function (res) {
            expect(res.status).toBe(401);
            done();
        })
            .end(function (err) {
            if (err)
                throw err;
        });
    });
    it("should return NOT AUTHORIZED when asking for /", function (done) {
        var token = getInvalidToken();
        var url = "/";
        request(_this.app)
            .get(url)
            .set("Authorization", "Bearer " + token)
            .set('Accept', 'application/json')
            .expect(function (res) {
            expect(res.status).toBe(401);
            done();
        })
            .end(function (err) {
            if (err)
                throw err;
        });
    });
    it("should return NOT FOUND when asking for /", function (done) {
        var token = getValidToken();
        var url = "/";
        request(_this.app)
            .get(url)
            .set("Authorization", "Bearer " + token)
            .set('Accept', 'application/json')
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
//# sourceMappingURL=token.spec.js.map