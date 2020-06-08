import { JWTDecoder } from "../jwtdecoder";
import { RestProxyPlugin } from ".";
import { App } from "..";

export default class JWTPlugin implements RestProxyPlugin {
    constructor(private config) { }

    ready(): Promise<void> {
        return Promise.resolve();
    }

    register(app: App): Promise<void> {
        const jwtdecoder = new JWTDecoder(this.config.jwtdecoder);
        jwtdecoder.register(app.app);

        return Promise.resolve();
    }

}
