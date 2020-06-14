import { RedisClient, createClient, ClientOpts } from "redis";
import { RedisRTEventsSource } from "../rtevent/sources/redisbased";
import { SocketIORTEventSubscriber } from "../rtevent/subscribers/socketio";
import { RealtimeEventsProxy } from "../rtproxy";
import { App } from "..";
import { RestProxyPlugin } from ".";

export interface RealTimeProxyPluginOptions {
    "redis"?: ClientOpts;
    "redischannels": string[]
}

export type RealTimeProxyPluginDefinition = ["realtimeproxy", RealTimeProxyPluginOptions];

export default class RealTimeProxyPlugin implements RestProxyPlugin {
    private proxy: RealtimeEventsProxy;
    constructor(private config: RealTimeProxyPluginOptions) {

    }

    ready(): Promise<void> {
        return Promise.resolve();
    }

    register(app: App): Promise<void> {
        const sourceBuilder = () => {
            const redissub: RedisClient = createClient(this.config.redis);

            return new RedisRTEventsSource(redissub, this.config.redischannels);
        }

        const destBuilder = () => {
            const dest = new SocketIORTEventSubscriber();
            dest.listen(app.server);

            return dest;
        }

        this.proxy = new RealtimeEventsProxy(sourceBuilder, destBuilder);

        return this.proxy.run();
    }

    unregister(): Promise<void> {
        return this.proxy.close();
    }
}