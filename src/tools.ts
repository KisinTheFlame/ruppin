import { ChatCompletionTool } from "openai/resources/chat/completions";

type Tool =
    & ChatCompletionTool
    & {
        function: {
            name: string
            description: string,
            strict: true,
            parameters?: {
                type: "object",
                properties: {
                    [property: string]: {
                        type: "string" | "number" | "bool",
                        description: string,
                    },
                },
            },
        },
    };

export const tools = [
    {
        type: "function",
        function: {
            name: "notify_user",
            description: "向用户发送一条通知，从而和用户分享你当前的进度，报告任务的完成情况等。",
            strict: true,
            parameters: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        description: "欲向用户展示的通知信息",
                    },
                },
            },
        },
    },
    {
        type: "function",
        function: {
            name: "ask_user",
            description: "向用户发送一条信息，并等待用户回复，从而了解更具体的需求并收集更多信息。",
            strict: true,
            parameters: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        description: "欲向用户展示的信息",
                    },
                },
            },
        },
    },
    {
        type: "function",
        function: {
            name: "read_file",
            description: "读取一个 workspace 中的文件，返回文件内容。",
            strict: true,
            parameters: {
                type: "object",
                properties: {
                    path: {
                        type: "string",
                        description: "要读取的文件对于 workspace 的相对路径。",
                    },
                },
            },
        },
    },
    {
        type: "function",
        function: {
            name: "write_file",
            description: "覆盖写入一个 workspace 中指定路径的文件，如果文件不存在则会自动创建。目录也会自动创建。",
            strict: true,
            parameters: {
                type: "object",
                properties: {
                    path: {
                        type: "string",
                        description: "要写入的文件对于 workspace 的相对路径。",
                    },
                    content: {
                        type: "string",
                        description: "需要写入的内容。",
                    },
                },
            },
        },
    },
    {
        type: "function",
        function: {
            name: "shell_exec",
            description: "执行一条 Shell 命令，并返回执行命令中的控制台输出。",
            strict: true,
            parameters: {
                type: "object",
                properties: {
                    command: {
                        type: "string",
                        description: "所需要执行的 shell 命令。",
                    },
                },
            },
        },
    },
    {
        type: "function",
        function: {
            name: "review_todo",
            description: "查看你制定的 todo 备忘录。",
            strict: true,
        },
    },
    {
        type: "function",
        function: {
            name: "update_todo",
            description: "覆盖地更新你的 todo 备忘录。请使用 markdown 的格式，比如标题和 todo 列表格式。",
            strict: true,
            parameters: {
                type: "object",
                properties: {
                    content: {
                        type: "string",
                        description: "新的 todo 备忘录内容。",
                    },
                },
            },
        },
    },
    {
        type:"function",
        function: {
            name: "pause",
            description: "当你完成工作时，调用这个函数来暂停，以便用户验收。",
            strict: true,
        },
    },
] as const satisfies Array<Tool>;
