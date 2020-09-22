"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("supertest");
var fs_1 = require("fs");
var path_1 = require("path");
var __1 = require("../../..");
var jwt = require("jwt-simple");
var jwt_1 = require("../../../plugins/jwt");
var dabase_mock_1 = require("../../dabase.mock");
var jwtconfig = {
    secret: Math.random().toString().substr(-32),
    format: "base64",
    ignoreUrls: ["/test"]
};
function getValidToken() {
    var jwtkey = jwt_1.default.getJwtKeyFromConfig(jwtconfig);
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
var config = JSON.parse(fs_1.readFileSync(path_1.resolve(__dirname, "..", "..", "..", "..", "config.json"), "utf-8"));
describe("Should work as expected", function () {
    beforeEach(function () {
        var _this = this;
        var configWithJWTPlugin = Object.assign({}, config, { restproxyplugins: [["jwt", jwtconfig]] });
        var app = new __1.App(configWithJWTPlugin, new dabase_mock_1.MockedDatabase());
        return app.register().then(function () {
            _this.app = app.app;
        });
    });
    it("should return NOT AUTHORIZED when asking for /", function (done) {
        request(this.app)
            .get("/")
            .expect(function (res) {
            expect(res.status).toBe(401);
            done();
        })
            .end(function () { });
    });
    it("should return NOT FOUND when asking for /", function (done) {
        request(this.app)
            .get(jwtconfig.ignoreUrls[0])
            .expect(function (res) {
            expect(res.status).toBe(404);
            done();
        })
            .end(function () { });
    });
    it("should return NOT AUTHORIZED when asking for /", function (done) {
        var token = getInvalidToken();
        var url = "/";
        request(this.app)
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
        request(this.app)
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