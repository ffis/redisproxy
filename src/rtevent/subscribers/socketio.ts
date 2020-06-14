import { Server as httpServer } from "http";
import { Server, Socket } from "socket.io";
import { RTEventsSubscriber } from "..";

export class SocketIORTEventSubscriber implements RTEventsSubscriber {
    private io: Server;
    private clients: Socket[];
    public logger: Console = console; 

    listen(server: httpServer) {
        this.clients = [];
        this.io = require("socket.io")(server);
    }

    publish(channel: string, message: string): Promise<void> {
        this.io.emit(channel, message);

        return Promise.resolve();
    }
}