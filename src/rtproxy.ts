import { RTEventsSubscriber, RTEventsSource } from "./rtevent";

export class RealtimeEventsProxy {
    private rtsource: RTEventsSource;
    private rtdest: RTEventsSubscriber;
    constructor(private sourceBuilder: () => RTEventsSource, private destBuilder: () => RTEventsSubscriber) {
        
    }

    public get source(): RTEventsSource {
        if (this.rtsource) {
            return this.rtsource;
        }

        this.rtsource = this.sourceBuilder();

        return this.rtsource;
    }

    public get subscriber(): RTEventsSubscriber {
        if (this.rtdest) {
            return this.rtdest;
        }

        this.rtdest = this.destBuilder();

        return this.rtdest;
    }

    public run(): Promise<void> {
        this.source.pipe(this.subscriber);
        
        return this.source.subscribe();
    }

    public close(): Promise<void> {
        this.source.unpipe(this.subscriber);

        return Promise.resolve();
    }
}
