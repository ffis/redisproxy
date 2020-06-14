import { RedisClient } from "redis";
import { RTEventsSource, RTEventsSubscriber } from "..";
import { promisify } from "util";
import { assert } from "console";

export class RedisRTEventsSource implements RTEventsSource {
    private subscribers: RTEventsSubscriber[];

    constructor(private redissubs: RedisClient, private channels: string[]) {
        this.subscribers = [];
    }

    subscribe(): Promise<void> {
        this.redissubs.on("message", (channel: string, data) => {
            let parsedData = data;
            try {
                parsedData = JSON.parse(data);
            } catch(err){}

            this.subscribers.forEach((sb) => {
                sb.publish(channel, parsedData);
            });
        });

        const subscribe = promisify(this.redissubs.subscribe).bind(this.redissubs);

        return Promise.all(this.channels.map((channel) => subscribe(channel))).then(() => { });
    }

    pipe(to: RTEventsSubscriber) {
        this.subscribers.push(to);
    }

    unpipe(who: RTEventsSubscriber) {
        const idx = this.subscribers.indexOf(who);
        assert(idx >= 0, "you cannot unpipe what is not already piped");
        
        this.subscribers.splice(idx, 1);
    }
}