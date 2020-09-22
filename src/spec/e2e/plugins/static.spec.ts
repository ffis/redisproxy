import request = require("supertest");
import { readFileSync } from "fs";
import { basename, resolve } from "path";
import { Application } from "express";
import { App } from "../../..";
import { IConfig } from "../../../config";
import { MockedDatabase } from "../../dabase.mock";

const config = JSON.parse(readFileSync(resolve(__dirname, "..", "..", "..", "..", "config.json"), "utf-8"));

interface ThisSpecInstance {
    app: Application;
}

describe("Should work as expected", function(this: ThisSpecInstance) {
    beforeEach(function(this: ThisSpecInstance) {
        const directory = resolve(__dirname);
        const configWithStaticPlugin: IConfig = Object.assign({}, config, {restproxyplugins: [["static", {endpoint: "/", directory }]]});
        const app = new App(configWithStaticPlugin, new MockedDatabase());
        app.setServer();

        return app.register().then(() => {
            this.app = app.app;
        });
    });

    it("should return ok when asking for /" + basename(__filename),  function(this: ThisSpecInstance, done: DoneFn) {
        const url = "/" + basename(__filename);

        request(this.app)
            .get(url)
            .expect((res) => {
                expect(res.status).toBe(200);
                done();
            })
            .end(() => {});
    });
});
