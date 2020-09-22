import request = require("supertest");
import { Application } from "express";
import { readFileSync } from "fs";
import { resolve } from "path";
import { App } from "../../..";
import { IConfig } from "../../../config";
import { MockedDatabase } from "../../dabase.mock";

interface ThisSpecInstance {
    app: Application;
}

const config = JSON.parse(readFileSync(resolve(__dirname, "..", "..", "..", "..", "config.json"), "utf-8"));

describe("Should work as expected", () => {
    beforeEach(function(this: ThisSpecInstance) {
        const configWithApiPlugin: IConfig = Object.assign({}, config, {restproxyplugins: ["api"]});
        const app = new App(configWithApiPlugin, new MockedDatabase());
        return app.register().then(() => {
            this.app = app.app;
        });
    });
    it("should return ok when asking for api", function(this: ThisSpecInstance, done: DoneFn) {

        const url = "/api";
        request(this.app)
            .get(url)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect((res) => {
                expect(res.status).toBe(200);
                const collection = res.body;
                expect(Array.isArray(collection)).toBeTrue();
                expect(collection.length).toBeGreaterThan(0);
                done();
            })
            .end(() => {});
    });
});
