import { RedisClient } from "redis";
import { RTEventsSource, RTEventsSubscriber } from "..";

export class RedisRTEventsSource implements RTEventsSource {
    private subscribers: RTEventsSubscriber[];
    public logger: Console = console; 

    constructor(private redissubs: RedisClient) {
        this.subscribers = [];
    }

    subscribe(): Promise<void> {
        this.redissubs.subscribe("updates", (evt) => {
            this.logger.log(evt);
        });

        this.redissubs.on("message", (channel: string, data) => {
            this.logger.log(channel, data);
            this.subscribers.forEach((sb) => {
                sb.publish(data);
            });
        });

        return Promise.resolve();
    }

    pipe(to: RTEventsSubscriber) {
        this.subscribers.push(to);
    }

    unpipe(who: RTEventsSubscriber) {
        const idx = this.subscribers.indexOf(who);
        if (idx >= 0) {
            this.subscribers.splice(idx, 1);
        }
    }
}