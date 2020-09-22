import { ok } from "assert";
import Cryptr = require("cryptr");

import { parseFunction } from ".";
import RedisProxyPlugin from "./redisproxy";

export interface DecryptPluginOptions {
    secret: string;
}

export type DecryptPluginDefinition = ["Decrypt", DecryptPluginOptions];

export default class DecryptPlugin extends RedisProxyPlugin {
    private cryptr: Cryptr;

    constructor(config: DecryptPluginOptions) {
        super();
        ok(typeof config === "object", "config must be set when using Decrypt plugin");
        ok(typeof config.secret === "string", "secret attribute must be set when using Decrypt plugin");
        this.cryptr = new Cryptr(config.secret);
    }

    ready(): Promise<void> {
        return Promise.resolve();
    }

    parse(): parseFunction {
        return (s: string) => {
            return JSON.parse(this.cryptr.decrypt(s));
        };
    }
}