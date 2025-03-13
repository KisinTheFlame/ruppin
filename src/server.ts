import { ChatCompletionAssistantMessageParam, ChatCompletionToolMessageParam } from "openai/resources";
import { History } from "./context";
import { FunctionArgs, FunctionCallResponse, FunctionName } from "./functions";

export type ServerMessage =
    | {
        action: "notify_user",
        message: string,
    }
    | {
        action: "ask_user",
    }
    | {
        action: "progress_append",
        info: ProgressAppend,
    }

export type ProgressAppend =
    & {
        type: string,
    }
    & (
        | {
            type: "thought",
            thought: string,
        }
        | {
            type: "notify",
            message: string,
        }
        | {
            type: "tool",
            name: FunctionName,
            args?: FunctionArgs,
            response: {
                status: "success" | "fail",
                result?: object,
            },
        }
        | {
            type: "user"
            message: string,
        }
    )

export type ClientMessage = {
    message: string,
}

export const diffHistories = (oldHistories: History[], newHistories: History[]): ProgressAppend[] => {
    const start = oldHistories.length;
    const diff = newHistories.slice(start);
    const result = [] as ProgressAppend[];
    const assistantMessage = diff[0] as ChatCompletionAssistantMessageParam;
    if (assistantMessage.content) {
        result.push({
            type: "thought",
            thought: assistantMessage.content as string,
        });
    }
    if (assistantMessage.tool_calls) {
        const toolCalls = assistantMessage.tool_calls;
        for (const toolCall of toolCalls) {
            const args = JSON.parse(toolCall.function.arguments) as FunctionArgs;
            const response = diff.find(d => d.role === "tool" && d.tool_call_id === toolCall.id) as ChatCompletionToolMessageParam;
            if (!(JSON.parse(response.content as string) as FunctionCallResponse).display) {
                continue;
            }
            result.push({
                type: "tool",
                name: toolCall.function.name as FunctionName,
                args: args,
                response: JSON.parse(response.content as string) as {
                    status: "success" | "fail",
                    result?: object,
                },
            });
        }
    }
    return result;
};
