export interface RTEventsSource {
    subscribe(): Promise<void>;
    pipe(to: RTEventsSubscriber): void;
    unpipe(to: RTEventsSubscriber): void;
}

export interface RTEventsSubscriber {
    publish(message: any): Promise<void>;
}
