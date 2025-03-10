import { FunctionCall } from "./functions";

export type Response =
    | {
        action: "think",
        thought: string,
    }
    | {
        action: "function_call",
        call: FunctionCall,
    }
    | {
        action: "pause",
    };
