"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("supertest");
var __1 = require("../../..");
var jwt = require("jwt-simple");
var jwt_1 = require("../../../plugins/jwt");
var config = {
    secret: Math.random().toString().substr(-16),
    format: "base64",
    ignoreUrls: ["/test"]
};
function getValidToken() {
    var jwtkey = jwt_1.default.getJwtKeyFromConfig(config);
    var validTokenContent = {
        user: "test",
        exp: (Date.now() / 1000) + 100
    };
    return jwt.encode(validTokenContent, jwtkey);
}
function getInvalidToken() {
    var jwtkey = jwt_1.default.getJwtKeyFromConfig({
        "secret": "00",
        "format": "base64"
    });
    var validTokenContent = {
        user: "test",
        exp: (Date.now() / 1000) + 100
    };
    return jwt.encode(validTokenContent, jwtkey);
}
describe("Should work as expected", function () {
    beforeEach(function () {
        var configWithJWTPlugin = { restproxyplugins: [["jwt", config]] };
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
            .end(function () { });
    });
    it("should return NOT FOUND when asking for /", function (done) {
        request(_this.app)
            .get(config.ignoreUrls[0])
            .expect(function (res) {
            expect(res.status).toBe(404);
            done();
        })
            .end(function () { });
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
            .end(function () { });
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
            .end(function () { });
    });
});
//# sourceMappingURL=jwt.spec.js.map