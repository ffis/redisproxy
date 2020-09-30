import request = require("supertest");
import { Application } from "express";
import { readFileSync } from "fs";
import { resolve } from "path";
import { createServer } from "http";

import { App } from "../../..";
import * as portfinder from "portfinder";
import { IConfig } from "../../../config";
import { NotifyPluginOptions } from "../../../plugins/notify";
import { MockedDatabase } from "../../database.mock";

const config = JSON.parse(readFileSync(resolve(__dirname, "..", "..", "..", "..", "config.json"), "utf-8"));

interface ThisSpecInstance {
    app: Application;
    port: number;
}

describe("Should work as expected", () => {
    beforeEach(function(this: ThisSpecInstance) {
        return portfinder.getPortPromise().then((port) => {
                const url = "http://localhost:" + port;
                this.port = port;
                const options: NotifyPluginOptions = {url, MAX_CONTENT_LENGTH: 2};
                const configWithNotifyPlugin: IConfig = Object.assign({}, config, {restproxyplugins: [["notify", options]]});
                const app = new App(configWithNotifyPlugin, new MockedDatabase());
                return app.register().then(() => {
                    this.app = app.app;
                });
            });
    });
    it("should notify when asking for /", function(this: ThisSpecInstance, done: DoneFn) {
        const server = createServer((req, res) => {
            res.writeHead(201);
            res.end();
            expect(req.method).toBe("POST");
            server.close();
            done();
        }).listen(this.port);

        const url = "/";
        request(this.app)
            .get(url)
            .end(() => {});
    });
    it("should notify when no body for /", function(this: ThisSpecInstance, done: DoneFn) {
        const server = createServer((req, res) => {
            res.writeHead(201);
            res.end();
            expect(req.method).toBe("POST");
            server.close();
            done();
        }).listen(this.port);

        const url = "/";
        request(this.app)
            .post(url)
            .send({"close": "example"})
            .end(() => {});
    });
});
