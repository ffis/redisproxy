import request = require("supertest");
import { readFileSync } from "fs";
import { resolve } from "path";
import { CorsOptions } from "cors";

import { App } from "../../..";
import { IConfig } from "../../../config";

const config = JSON.parse(readFileSync(resolve(__dirname, "..", "..", "..", "..", "config.json"), "utf-8"));

const fakeServer = "https://example.com";

describe("Should work as expected", () => {
    beforeEach(() => {
        const options: CorsOptions = {
            origin: [fakeServer]
        };
        const configWithCorsPlugin: IConfig = Object.assign({}, config, {restproxyplugins: [["cors", options]]});
        const app = new App(configWithCorsPlugin);
        return app.register().then(() => {
            this.app = app.app;
        });
    });
    it("should use cors when asking for /", (done) => {

        const url = "/";
        request(this.app)
            .options(url)
            .set("Origin", fakeServer)
            .expect((res) => {
                expect(res.header["access-control-allow-origin"]).toBe(fakeServer);
               
                done();
            })
            .end(() => {});
    });

    it("should fail using cors when asking for /", (done) => {

        const url = "/";
        request(this.app)
            .options(url)
            .set("Origin", fakeServer + "err")
            .expect((res) => {
                expect(res.header["access-control-allow-origin"]).not.toBe(fakeServer);
                expect(res.header["access-control-allow-origin"]).not.toBe(fakeServer + "err");
               
                done();
            })
            .end(() => {});
    });
});
