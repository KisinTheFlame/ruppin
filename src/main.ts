import { WebSocketServer, WebSocket } from "ws";
import { oneTurnChat } from "./client";
import { initContext } from "./context";
import { WebSocketConnection } from "./websocket";
import { ClientMessage, diffHistories, ServerMessage } from "./server";

const port = 22049;
const maxTurn = 20;

const wss = new WebSocketServer({ port: 22049 });

wss.on("connection", async (ws: WebSocket) => {
    console.log("new client connected");
    const conn = new WebSocketConnection<ServerMessage, ClientMessage>(ws);
    const task = (await conn.recv()).message;
    let context = await initContext({
        task: task,
    });
    let oldHistories = context.histories;
    let turn = 0;
    while (turn < maxTurn) {
        const [newContext, ask, notifications] = await oneTurnChat(context);
        const newHistories = newContext.histories;
        const progresses = diffHistories(oldHistories, newHistories);
        for (const progress of progresses) {
            conn.send({
                action: "progress_append",
                info: progress,
            });
        }
        notifications.forEach(notification => {
            conn.send({
                action: "notify_user",
                message: notification,
            });
        });
        if (ask) {
            await conn.recv();
        }
        context = newContext;
        oldHistories = context.histories;
        turn++;
    }
});

console.log(`WebSocket server running on ws://localhost:${port}`);
