import request = require("supertest");
import { readFileSync } from "fs";
import { resolve } from "path";
import { createServer } from "http";

import { App } from "../../..";
import * as portfinder from "portfinder";

const config = JSON.parse(readFileSync(resolve(__dirname, "..", "..", "..", "..", "config.json"), "utf-8"));

describe("Should work as expected", () => {
    beforeEach(() => {
        return portfinder.getPortPromise().then((port) => {
                const url = "http://localhost:" + port;
                this.port = port;
                const configWithNotifyPlugin = Object.assign({}, config, {restproxyplugins: [["notify", {url}]]});
                const app = new App(configWithNotifyPlugin);
                return app.register().then(() => {
                    this.app = app.app;
                });
            });
    });
    it("should notify when asking for /", (done) => {
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
            .end((err) => {
                if (err) throw err;
            });
    });
});
