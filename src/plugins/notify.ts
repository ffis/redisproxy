import { Request, Response, NextFunction } from "express";
import { ok } from "assert";

import * as tiny from "tiny-json-http";

import { RestProxyPlugin } from ".";
import { App } from "..";

export interface NotifyPluginOptions {
    url: string
    MAX_CONTENT_LENGTH?: number;
}

export type NotifyPluginDefinition = ["notify", NotifyPluginOptions];

export default class NotifyPlugin implements RestProxyPlugin {
    private MAX_CONTENT_LENGTH: number;

    constructor(private config: NotifyPluginOptions) {
        ok(typeof config === "object", "config must be set when using notify plugin");
        ok(typeof config.url === "string", "url attribute must be set when using notify plugin");
        ok(config.url.startsWith("http://") || config.url.startsWith("https://"), "url attribute must start with http:// or https:// when using notify plugin");
        ok(!config.MAX_CONTENT_LENGTH || typeof config.MAX_CONTENT_LENGTH === "number", "MAX_CONTENT_LENGTH attribute must be numeric when exists using notify plugin");

        this.MAX_CONTENT_LENGTH = config.MAX_CONTENT_LENGTH ? config.MAX_CONTENT_LENGTH : 1000000;
    }

    ready(): Promise<void> {
        return Promise.resolve();
    }

    register(app: App): Promise<void> {
        app.app.use((req: Request, res: Response, next: NextFunction) => {
            const user = res.locals.user;

            const data = {
                user: user,
                ip: req.get("X-Real-IP"),
                method: req.method,
                originalUrl: req.originalUrl,
                body: req.body,
                headers: req.headers
            };

            const contentLength = req.headers["content-length"] ? parseInt(req.headers["content-length"], 10) : null;
            if (contentLength && contentLength > this.MAX_CONTENT_LENGTH) {
                Reflect.deleteProperty(data, "body");
            }

            const url = user ? Object.keys(user).reduce((p, c) => p.replace(":" + c, user[c]), this.config.url) : this.config.url;

            tiny
                .post({data, url})
                .catch((err) => console.error(err));

            next();
        });

        return Promise.resolve();
    }

}
