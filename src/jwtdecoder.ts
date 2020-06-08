import { Request, Response, NextFunction } from "express";

const tiny = require("tiny-json-http");
const jwt = require("jwt-simple");

const MAX_CONTENT_LENGTH = 1000000;

export class JWTDecoder {
    private jwtKey: string | Buffer;
    constructor(private config: any) {
        this.jwtKey = JWTDecoder.getJwtKeyFromConfig(config);
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

    register(app) {
        app.use((req: Request, res: Response, next: NextFunction) => {
            if (this.config.ignoreUrls && this.config.ignoreUrls.indexOf(req.originalUrl) >= 0) {
                return next();
            }
            const auth = req.header("Authorization");
            if (auth && auth.startsWith("Bearer ")) {
                const token = auth.replace("Bearer ", "");
                try {
                    const decoded = jwt.decode(token, this.jwtKey);
                    res.locals.user = decoded;

                    const data = {
                        user: decoded,
                        ip: req.get("X-Real-IP"),
                        method: req.method,
                        originalUrl: req.originalUrl,
                        body: req.body,
                        headers: req.headers
                    };

                    const contentLength = req.headers["content-length"] ? parseInt(req.headers["content-length"], 10) : null;
                    if (contentLength && contentLength > MAX_CONTENT_LENGTH) {
                        Reflect.deleteProperty(data, "body");
                    }

                    // esto se hace en paralelo
                    if (this.config.notify) {
                        const url = Object.keys(decoded).reduce((p, c) => p.replace(":" + c, decoded[c]), this.config.notify);
                        tiny.post({
                            url: url,
                            data: data
                        }).then(() => { }).catch((err) => console.error(err));
                    }

                    next();
                } catch (e) {
                    res.status(401).send("Unauthorized");
                }
            } else {
                res.status(401).send("Unauthorized");
            }

        });
    }
}

