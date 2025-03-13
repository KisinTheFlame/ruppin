import { ChatCompletionMessageParam } from "openai/resources";
import { createWorkspace } from "./workspace";
import { readToStringSync } from "./utils";

export type History = ChatCompletionMessageParam;

export type Context = {
    readonly workspace: string,
    readonly histories: History[],
}

const promptPath = "static/prompt.md";
const prompt = readToStringSync(promptPath);

export const initContext = async (
    init: {
        task: string,
    },
): Promise<Context> => {
    const workspace = await createWorkspace();
    return {
        workspace: workspace,
        histories: [
            {
                role: "system",
                content: prompt,
            },
            {
                role: "user",
                content: init.task,
            },
        ],
    };
};

export const iterateContext = (context: Context, newHistories: History[]): Context => {
    return {
        workspace: context.workspace,
        histories: [...context.histories, ...newHistories],
    };
};
