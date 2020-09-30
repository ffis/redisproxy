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
        var directory = path_1.resolve(__dirname);
        var configWithStaticPlugin = Object.assign({}, config, { restproxyplugins: [["static", { endpoint: "/", directory: directory }]] });
        var app = new __1.App(configWithStaticPlugin, new database_mock_1.MockedDatabase());
        app.setServer();
        return app.register().then(function () {
            _this.app = app.app;
        });
    });
    it("should return ok when asking for /" + path_1.basename(__filename), function () {
        var url = "/" + path_1.basename(__filename);
        return request(this.app)
            .get(url)
            .expect(200);
    });
});
//# sourceMappingURL=static.spec.js.map