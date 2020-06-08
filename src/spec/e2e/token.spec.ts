import request = require("supertest");
import { readFileSync } from "fs";
import { resolve } from "path";
import { App } from "../..";
import { JWTDecoder } from "../../jwtdecoder";

const jwt = require("jwt-simple");
const config = JSON.parse(readFileSync(resolve(__dirname, "..", "..", "..", "config.json"), "utf-8"));

config.server.expose = true;

Reflect.deleteProperty(config.jwtdecoder, "notify");

function getValidToken(): string {
    const jwtkey = JWTDecoder.getJwtKeyFromConfig(config.jwtdecoder);
    const validTokenContent = {
        user: "test",
        exp: (Date.now() / 1000) + 100
    };
    return jwt.encode(validTokenContent, jwtkey);
}

function getInvalidToken(): string {
    const jwtkey = JWTDecoder.getJwtKeyFromConfig({
        "secret": "00",
        "format": "base64"
	});
    const validTokenContent = {
        user: "test",
        exp: (Date.now() / 1000) + 100
    };
    return jwt.encode(validTokenContent, jwtkey);
}

describe("should work without plugins", () => {
    beforeEach(() => {
        const configWithoutPlugins = Object.assign({}, config, {restproxyplugins: []});
        const app = new App(configWithoutPlugins);
        return app.register().then(() => {
            this.app = app.app;
        });
    });
    it("should return NOT FOUND error when asking for /", (done) => {
        request(this.app)
            .get("/")
            .expect((res) => {
                expect(res.status).toBe(404);
                done();
            })
            .end((err) => {
                if (err) throw err;
            });
    });
});


describe("Should work as expected", () => {

    beforeEach(() => {
        const configWithJWTPlugin = Object.assign({}, config, {restproxyplugins: ["api"]});
        const app = new App(configWithJWTPlugin);
        return app.register().then(() => {
            this.app = app.app;
        });
    });
    it("should return ok when asking for api", (done) => {
        const token = getValidToken();
        
        const url = "/api";
        request(this.app)
            .get(url)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect((res) => {
                expect(res.status).toBe(200);
                const collection = res.body;
                expect(Array.isArray(collection)).toBeTrue();
                expect(collection.length).toBeGreaterThan(0);
                done();
            })
            .end((err) => {
                if (err) throw err;
            });
    });
});

describe("Should work as expected", () => {

    beforeEach(() => {
        const configWithJWTPlugin = Object.assign({}, config, {restproxyplugins: ["jwt"]});
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
