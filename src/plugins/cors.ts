import cors = require('cors');

import { RestProxyPlugin } from ".";
import { App } from "../";

export type CorsPluginDefinition = "cors" | ["cors" | cors.CorsOptions];

export default class CorsPlugin implements RestProxyPlugin {
    constructor(private config?: cors.CorsOptions){}

    ready(): Promise<void> {
        return Promise.resolve();
    }

    register(app: App): Promise<void> {

        app.app.use(cors(this.config));

        return Promise.resolve();
    }
}