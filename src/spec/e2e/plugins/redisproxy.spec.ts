import request = require("supertest");
import { readFileSync } from "fs";
import { resolve } from "path";
import { App } from "../../..";
import { IConfig } from "../../../config";

const config = JSON.parse(readFileSync(resolve(__dirname, "..", "..", "..", "..", "config.json"), "utf-8"));

function ensureStartsBy(s: string, what: string) {
    return s.startsWith(what) ? s : what + s;
}

describe("Should work as expected", () => {
    beforeEach(() => {
        const configWithRPlugin: IConfig = Object.assign({}, config, {restproxyplugins: ["redisproxy"]});
        const app = new App(configWithRPlugin);
        return app.register().then(() => {
            this.app = app;
        });
    });
    it("auxiliary function should work as expected", () => {
        expect(ensureStartsBy("a", "/")).toBe("/a");
        expect(ensureStartsBy("/a", "/")).toBe("/a");
    });
    it("should return ok when asking for valid content", (done) => {
        this.app.refresh().then((validurls) => {
            const validurl = validurls[0];
            const url = ensureStartsBy(validurl, "/");

            request(this.app.app)
                .get(url)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect((res) => {
                    expect(res.status).toBe(200);
                    done();
                })
                .end(() => {});
        });
    });
    it("should return NOT FOUND when asking for no valid content", (done) => {
        this.app.refresh().then((validurls) => {
            const notvalidurl = validurls[0] + "veryrandomtextveryrandomtext";
            const url = ensureStartsBy(notvalidurl, "/");

            request(this.app.app)
                .get(url)
                .set('Accept', 'application/json')
                .expect((res) => {
                    expect(res.status).toBe(404);
                    done();
                })
                .end(() => {});
        });
    });
});