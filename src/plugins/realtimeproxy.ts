import { RedisClient, createClient } from "redis";
import { RedisRTEventsSource } from "../rtevent/sources/redisbased";
import { SocketIORTEventSubscriber } from "../rtevent/subscribers/socketio";
import { RealtimeEventsProxy } from "../rtproxy";
import { App } from "..";
import { RestProxyPlugin } from ".";

export default class RealTimeProxyPlugin implements RestProxyPlugin {
    constructor(private config) { }

    ready(): Promise<void> {
        return Promise.resolve();
    }

    register(app: App): Promise<void> { 

        const sourceBuilder = () => {
            const redissub: RedisClient = createClient(this.config.redis);
            return new RedisRTEventsSource(redissub);
        }

        const destBuilder = () => {
            const dest = new SocketIORTEventSubscriber();
            dest.listen(app.server);

            return dest;
        }

        const rtep = new RealtimeEventsProxy(sourceBuilder, destBuilder);
        rtep.run();

        return Promise.resolve();
    }
}