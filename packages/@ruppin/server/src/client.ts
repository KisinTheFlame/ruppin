import { Context, History, iterateContext } from "./context";
import { functionCall } from "./functions";
import { SupplierName, suppliers } from "./models";
import { tools } from "./tools";
import { trim } from "./utils";
import OpenAI from "openai";
import { dirWorkspace } from "./workspace";
import { FunctionName } from "@ruppin/contract/src/messages";

const supplierName = (process.env.MODEL ?? "gemini") as SupplierName;
const supplier = suppliers[supplierName];
const openai = new OpenAI({
    baseURL: supplier.baseURL,
    apiKey: supplier.apiKey,
});

export const oneTurnChat = async (
    context: Context,
): Promise<[Context, boolean, string[]]> => {
    const contextMessage = await genInfo(context.workspace);
    const response = await openai.chat.completions.create({
        model: supplier.model,
        messages: [
            ...context.histories,
            {
                role: "system",
                content: contextMessage,
            },
        ],
        tools: [...tools],
        tool_choice: "auto",
        response_format: { type: "text" },
    });
    const message = response.choices[0].message;
    const newHistories: History[] = [message];
    const content = message.content;
    if (content) {
        console.log("message: ", content);
    }
    const tool_calls = response.choices[0].message.tool_calls;
    let ask = false;
    const notifications = [];
    if (tool_calls && tool_calls.length > 0) {
        console.log(tool_calls);
        for (const tool_call of tool_calls) {
            const name = tool_call.function.name as FunctionName;
            const args = tool_call.function.arguments;
            const response = await functionCall(context.workspace, name, args);
            if (response.ask) {
                ask = true;
            }
            if (response.notification) {
                notifications.push(response.notification);
            }
            newHistories.push({
                role: "tool",
                tool_call_id: tool_call.id,
                content: JSON.stringify({
                    status: response.status,
                    result: response.result ?? "",
                }),
            });
        }
    }
    return [iterateContext(context, newHistories), ask, notifications];
};

export const genInfo = async (workspace: string): Promise<string> => {
    const files = (await dirWorkspace(workspace)).join("\n");
    return trim(`
# 当地时间

${new Date().toLocaleString()}

# workspace 文件列表

${files}
    `);
};
