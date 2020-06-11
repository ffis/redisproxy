import { Request, Response, NextFunction } from "express";
import * as jwt from "jwt-simple";
import { ok } from "assert";

import { RestProxyPlugin } from ".";
import { App } from "..";

const supportedFormats = ["hex", "base64"];

export default class JWTPlugin implements RestProxyPlugin {
    private jwtKey: string | Buffer;

    constructor(private config: {
        secret: string;
        ignoreUrls?: string[],
        format?: "hex" | "base64",
    }) {
        ok(typeof config === "object", "config must be set when using jwt plugin");
        ok(typeof config.secret === "string", "secret field must exist when using jwt plugin");
        if (config.ignoreUrls) {
            ok(Array.isArray(config.ignoreUrls), "ignoreUrls field must be an array of strings");
            const types = Array.from(config.ignoreUrls.reduce((p: Set<string>, c) => {
                const type: string = typeof c;
                p.add(type);

                return p;
            }, new Set()));
            ok(types.length === 0 || (types.length === 1 && types[0] === "string"), "ignoreUrls field must be an array of strings");
        }
        if (config.format) {
            ok(supportedFormats.indexOf(config.format) >= 0, "format can be only one of supported: [" + supportedFormats.join(",") + "]");
        }

        this.jwtKey = JWTPlugin.getJwtKeyFromConfig(config);
    }

    static getJwtKeyFromConfig(config: any): string|Buffer {
        let jwtKey = config.secret;

        switch (config.format) {
            case "hex":
                jwtKey = Buffer.from(jwtKey as string, "hex");
                break;
            case "base64":
                jwtKey = Buffer.from(jwtKey as string, "base64");
                break;
            default:
        }

        return jwtKey;
    }

    ready(): Promise<void> {
        return Promise.resolve();
    }

    register(app: App): Promise<void> {
        app.app.use((req: Request, res: Response, next: NextFunction) => {
            if (Array.isArray(this.config.ignoreUrls) && this.config.ignoreUrls.indexOf(req.originalUrl) >= 0) {
                return next();
            }
            const auth = req.header("Authorization");
            if (auth && auth.startsWith("Bearer ")) {
                const token = auth.replace("Bearer ", "");
                try {
                    const decoded = jwt.decode(token, this.jwtKey as string);
                    res.locals.user = decoded;

                    next();
                } catch (e) {
                    res.status(401).send("Unauthorized");
                }
            } else {
                res.status(401).send("Unauthorized");
            }
        });

        return Promise.resolve();
    }
}
