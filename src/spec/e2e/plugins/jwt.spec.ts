import request = require("supertest");
import { App } from "../../..";

import * as jwt from "jwt-simple";
import JWTPlugin from "../../../plugins/jwt";
import { IConfig } from "../../../config";

const config = {
    secret: Math.random().toString().substr(-16),
    format: "base64"
}

function getValidToken(): string {
    const jwtkey = JWTPlugin.getJwtKeyFromConfig(config);
    const validTokenContent = {
        user: "test",
        exp: (Date.now() / 1000) + 100
    };
    return jwt.encode(validTokenContent, jwtkey as string);
}

function getInvalidToken(): string {
    const jwtkey = JWTPlugin.getJwtKeyFromConfig({
        "secret": "00",
        "format": "base64"
	});
    const validTokenContent = {
        user: "test",
        exp: (Date.now() / 1000) + 100
    };
    return jwt.encode(validTokenContent, jwtkey as string);
}

describe("Should work as expected", () => {

    beforeEach(() => {
        const configWithJWTPlugin: IConfig = { restproxyplugins: [["jwt", config]] };
        const app = new App(configWithJWTPlugin);
        return app.register().then(() => {
            this.app = app.app;
        });
    });

    it("should return NOT AUTHORIZED when asking for /", (done) => {
        request(this.app)
            .get("/")
            .expect((res) => {
                expect(res.status).toBe(401);
                done();
            })
            .end((err) => {
                if (err) throw err;
            });
    });
    it("should return NOT AUTHORIZED when asking for /", (done) => {
        const token = getInvalidToken();

        const url = "/";
        request(this.app)
            .get(url)
            .set("Authorization", "Bearer " + token)
            .set('Accept', 'application/json')
            .expect((res) => {
                expect(res.status).toBe(401);
                done();
            })
            .end((err) => {
                if (err) throw err;
            });
    });
    it("should return NOT FOUND when asking for /", (done) => {
        const token = getValidToken();

        const url = "/";
        request(this.app)
            .get(url)
            .set("Authorization", "Bearer " + token)
            .set('Accept', 'application/json')
            .expect((res) => {
                expect(res.status).toBe(404);
                done();
            })
            .end((err) => {
                if (err) throw err;
            });
    });

});