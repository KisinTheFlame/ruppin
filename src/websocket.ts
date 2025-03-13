import { WebSocket } from "ws";
import { Queue } from "./utils";

export class WebSocketConnection<LocalMessage, RemoteMessage> {
    private readonly ws: WebSocket;
    private readonly messageQueue = new Queue<RemoteMessage>();

    constructor(ws: WebSocket) {
        this.ws = ws;
        ws.on("message", async (data: string) => {
            const message = JSON.parse(data) as RemoteMessage;
            this.messageQueue.enqueue(message);
        });
    }

    public send(message: LocalMessage) {
        this.ws.send(JSON.stringify(message));
    }

    public async recv(): Promise<RemoteMessage> {
        return await this.messageQueue.dequeue();
    }
}
