import { tools } from "./tools";

export type FunctionArgs = Record<string, string | number | boolean>

export type FunctionName = typeof tools[number]["function"]["name"];

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
