import { Server as httpServer } from "http";
import { Server, Socket } from "socket.io";
import { RTEventsSubscriber } from "..";

export class SocketIORTEventSubscriber implements RTEventsSubscriber {
    private io: Server;
    private clients: Socket[];
    public logger: Console = console; 

    listen(server: httpServer) {
        this.io = require("socket.io")(server);

        this.io.on("connection", (client) => {
            this.logger.log("Added client", this.clients.length);
            client.on("event", (data) => {
                this.logger.log(data);
                this.clients.push(client);
            });
            client.on("disconnect", () => {
                const index = this.clients.indexOf(client);
                if (index > -1) {
                    this.clients.splice(index, 1);
                }
                this.logger.log("removed client. Now we have", this.clients.length, "clients");
            });
        })
    }

    publish(message): Promise<void> {
        this.clients.forEach((socket) => {
            socket.send(message);
        });

        return Promise.resolve();
    }
}