import request = require("supertest");
import { Application } from "express";
import { readFileSync } from "fs";
import { resolve } from "path";

import { App } from "../../..";

import * as jwt from "jwt-simple";
import JWTPlugin, { JWTOptions } from "../../../plugins/jwt";
import { IConfig } from "../../../config";
import { MockedDatabase } from "../../dabase.mock";

interface ThisSpecInstance {
    app: Application;
    port: number;
}

const jwtconfig: JWTOptions = {
    secret: Math.random().toString().substr(-32),
    format: "base64",
    ignoreUrls: ["/test"]
};

function getValidToken(): string {
    const jwtkey = JWTPlugin.getJwtKeyFromConfig(jwtconfig);
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

const config = JSON.parse(readFileSync(resolve(__dirname, "..", "..", "..", "..", "config.json"), "utf-8"));

describe("Should work as expected", () => {

    beforeEach(function(this: ThisSpecInstance) {
        const configWithJWTPlugin: IConfig = Object.assign({}, config, { restproxyplugins: [["jwt", jwtconfig]] });
        const app = new App(configWithJWTPlugin, new MockedDatabase());

        return app.register().then(() => {
            this.app = app.app;
        });
    });

    it("should return NOT AUTHORIZED when asking for /", function(this: ThisSpecInstance, done: DoneFn) {
        request(this.app)
            .get("/")
            .expect((res) => {
                expect(res.status).toBe(401);
                done();
            })
            .end(() => {});
    });
    it("should return NOT FOUND when asking for /", function(this: ThisSpecInstance, done: DoneFn) {
        request(this.app)
            .get(jwtconfig.ignoreUrls[0])
            .expect((res) => {
                expect(res.status).toBe(404);
                done();
            })
            .end(() => {});
    });
    it("should return NOT AUTHORIZED when asking for /", function(this: ThisSpecInstance, done: DoneFn) {
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
            .end(() => {});
    });
    it("should return NOT FOUND when asking for /", function(this: ThisSpecInstance, done: DoneFn) {
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
            .end(() => {});
    });

});