import { readFileSync } from "fs";
import { resolve } from "path";
import * as io from "socket.io-client";
import * as portfinder from "portfinder";

import { App } from "../../..";
import { IConfig } from "../../../config";
import { MockedDatabase } from "../../database.mock";
import { createClient, RedisClient } from "redis";

const config: IConfig = JSON.parse(readFileSync(resolve(__dirname, "..", "..", "..", "..", "config.json"), "utf-8"));
const redischannels = ["read", "update", "create", "delete", "updates"];

interface ThisSpecInstance {
    app: App;
    url: string;
    redispub: RedisClient;
}

describe("Should work as expected", () => {
    beforeEach(function(this: ThisSpecInstance) {
        return portfinder.getPortPromise({port: 9000}).then((port) => {
            
            const configWithRTPlugin: IConfig = Object.assign({}, config, {restproxyplugins: [["realtimeproxy", {redischannels, redis: config.redis}]]});
            this.redispub = createClient(configWithRTPlugin.redis);

            configWithRTPlugin.server.https = false;
            configWithRTPlugin.server.port = port;
            configWithRTPlugin.server.bind = "localhost";
            this.url = "http://localhost:" + port;

            const app = new App(configWithRTPlugin, new MockedDatabase());
            app.logger = Object.assign({}, console, {log: () => {}});
            app.setServer();
            return app.register().then(() => {
                this.app = app;

                return app.listen();
            });
        });
    });

    afterEach(function(this: ThisSpecInstance) {
        const app: App = this.app;

        return app.close();
    });

    it("should proxy a text notification received from redis to socket.io", function(this: ThisSpecInstance, done: DoneFn) {
        const app: App = this.app;
        const socket = io(this.url, {autoConnect: false, reconnection: false, rejectUnauthorized: false });
        const myMessage = "my message";
        let received = redischannels.map(() => false);

        socket.once("disconnect", () => {
            received.forEach((has) => {
                expect(has).withContext("should have received message").toBeTrue();
            });

            done();
        });

        socket.once("connect_error", (m) => {
            console.error(m);
            done.fail("Error connecting via socket.io");
        });

        redischannels.forEach((channel, i) => {
            socket.once(channel, (msg) => {
                expect(msg).toBe(myMessage);
                received[i] = true;
    
                const notyet = received.filter((a) => !a);
                if (notyet.length === 0) {
                    socket.close();
                }
            });
        });

        socket.on("connect", () => {

            redischannels.forEach((channel) => {
                this.redispub.publish(channel, myMessage);
            });
        });

        socket.connect();
    });

    it("should proxy an object notification received from redis to socket.io", function(this: ThisSpecInstance, done: DoneFn) {
        const app: App = this.app;
        const socket = io(this.url, {autoConnect: false, reconnection: false, rejectUnauthorized: false });
        const myMessage = {type: "message", content: "my message"};
        let received = redischannels.map(() => false);

        socket.once("disconnect", () => {
            received.forEach((has) => {
                expect(has).withContext("should have received message").toBeTrue();
            });

            done();
        });

        socket.once("connect_error", (m) => {
            console.error(m);
            done.fail("Error connecting via socket.io");
        });

        redischannels.forEach((channel, i) => {
            socket.once(channel, (msg) => {
                expect(msg).toEqual(myMessage);
                received[i] = true;
    
                const notyet = received.filter((a) => !a);
                if (notyet.length === 0) {
                    socket.close();
                }
            });
        });

        socket.on("connect", () => {
            redischannels.forEach((channel) => {
                this.redispub.publish(channel, JSON.stringify(myMessage));
            });
        });

        socket.connect();
    });
});
