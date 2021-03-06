"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var io = require("socket.io-client");
var portfinder = require("portfinder");
var __1 = require("../../..");
var database_mock_1 = require("../../database.mock");
var redis_1 = require("redis");
var config = JSON.parse(fs_1.readFileSync(path_1.resolve(__dirname, "..", "..", "..", "..", "config.json"), "utf-8"));
var redischannels = ["read", "update", "create", "delete", "updates"];
describe("Should work as expected", function () {
    beforeEach(function () {
        var _this = this;
        return portfinder.getPortPromise({ port: 9000 }).then(function (port) {
            var configWithRTPlugin = Object.assign({}, config, { restproxyplugins: [["realtimeproxy", { redischannels: redischannels, redis: config.redis }]] });
            _this.redispub = redis_1.createClient(configWithRTPlugin.redis);
            configWithRTPlugin.server.https = false;
            configWithRTPlugin.server.port = port;
            configWithRTPlugin.server.bind = "localhost";
            _this.url = "http://localhost:" + port;
            var app = new __1.App(configWithRTPlugin, new database_mock_1.MockedDatabase());
            app.logger = Object.assign({}, console, { log: function () { } });
            app.setServer();
            return app.register().then(function () {
                _this.app = app;
                return app.listen();
            });
        });
    });
    afterEach(function () {
        var app = this.app;
        return app.close();
    });
    it("should proxy a text notification received from redis to socket.io", function (done) {
        var _this = this;
        var app = this.app;
        var socket = io(this.url, { autoConnect: false, reconnection: false, rejectUnauthorized: false });
        var myMessage = "my message";
        var received = redischannels.map(function () { return false; });
        socket.once("disconnect", function () {
            received.forEach(function (has) {
                expect(has).withContext("should have received message").toBeTrue();
            });
            done();
        });
        socket.once("connect_error", function (m) {
            console.error(m);
            done.fail("Error connecting via socket.io");
        });
        redischannels.forEach(function (channel, i) {
            socket.once(channel, function (msg) {
                expect(msg).toBe(myMessage);
                received[i] = true;
                var notyet = received.filter(function (a) { return !a; });
                if (notyet.length === 0) {
                    socket.close();
                }
            });
        });
        socket.on("connect", function () {
            redischannels.forEach(function (channel) {
                _this.redispub.publish(channel, myMessage);
            });
        });
        socket.connect();
    });
    it("should proxy an object notification received from redis to socket.io", function (done) {
        var _this = this;
        var app = this.app;
        var socket = io(this.url, { autoConnect: false, reconnection: false, rejectUnauthorized: false });
        var myMessage = { type: "message", content: "my message" };
        var received = redischannels.map(function () { return false; });
        socket.once("disconnect", function () {
            received.forEach(function (has) {
                expect(has).withContext("should have received message").toBeTrue();
            });
            done();
        });
        socket.once("connect_error", function (m) {
            console.error(m);
            done.fail("Error connecting via socket.io");
        });
        redischannels.forEach(function (channel, i) {
            socket.once(channel, function (msg) {
                expect(msg).toEqual(myMessage);
                received[i] = true;
                var notyet = received.filter(function (a) { return !a; });
                if (notyet.length === 0) {
                    socket.close();
                }
            });
        });
        socket.on("connect", function () {
            redischannels.forEach(function (channel) {
                _this.redispub.publish(channel, JSON.stringify(myMessage));
            });
        });
        socket.connect();
    });
});
//# sourceMappingURL=realtimeproxy.spec.js.map