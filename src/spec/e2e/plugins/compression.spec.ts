import request = require("supertest");
import { Application } from "express";
import { readFileSync } from "fs";
import { resolve } from "path";
import { App } from "../../..";
import { IConfig } from "../../../config";
import { MockedDatabase } from "../../database.mock";

interface ThisSpecInstance {
    app: Application;
}

const config = JSON.parse(readFileSync(resolve(__dirname, "..", "..", "..", "..", "config.json"), "utf-8"));

describe("Should work as expected", () => {
    beforeEach(function(this: ThisSpecInstance) {
        const configWithCompressionPlugin: IConfig = Object.assign({}, config, {restproxyplugins: [["compression", {threshold: 1}]]});
        const app = new App(configWithCompressionPlugin, new MockedDatabase());
        return app.register().then(() => {
            this.app = app.app;
        });
    });
    it("should use compression when asking for /", function(this: ThisSpecInstance, done: DoneFn) {

        const url = "/";
        request(this.app)
            .get(url)
            .set("Accept-Encoding", "gzip")
            .expect((res) => {
                expect(res.header["content-encoding"]).toBe("gzip");
               
                done();
            })
            .end(() => {});
    });
});
