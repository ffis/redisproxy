import request = require("supertest");
import { readFileSync } from "fs";
import { resolve } from "path";
import { App } from "../../..";
import { IConfig } from "../../../config";

const config = JSON.parse(readFileSync(resolve(__dirname, "..", "..", "..", "..", "config.json"), "utf-8"));

describe("Should work as expected", () => {
    beforeEach(() => {
        const configWithRPlugin: IConfig = Object.assign({}, config, {restproxyplugins: ["redisproxy"]});
        const app = new App(configWithRPlugin);
        app.setServer();
        return app.register().then(() => {
            this.app = app;
        });
    });
    it("should return ok when asking for a valid content", (done) => {
        this.app.refresh().then((urls) => {
            const validurls = urls.filter((u) => u.startsWith("/"));

            if (validurls.length === 0) {
                return done();
            }
            const url = validurls[0];

            request(this.app.app)
                .get(url)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect((res) => {
                    expect(res.status).toBe(200);
                    done();
                })
                .end(() => {});
        }).catch((err) => {
            expect(err).toBeUndefined();
            done();
        });
    });
    it("should return NOT FOUND when asking for no valid content", (done) => {
        this.app.refresh().then(() => {
            const notvalidurl = "/veryrandomtextveryrandomtext";

            request(this.app.app)
                .get(notvalidurl)
                .set('Accept', 'application/json')
                .expect((res) => {
                    expect(res.status).toBe(404);
                    done();
                })
                .end(() => {});
        });
    });
});