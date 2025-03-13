import * as fs from "fs/promises";
import * as path from "path";
import { todoPath, workspacePath } from "./workspace";
import { readToString } from "./utils";
import { execSync, SpawnSyncReturns } from "child_process";
import { tools } from "./tools";

export type FunctionName = typeof tools[number]["function"]["name"];

export type FunctionArgs = Record<string, string | number | boolean>

export type FunctionCallResponse = {
    status: "success" | "fail",
    display: boolean,
    result?: object,
    notification?: string,
    ask: boolean,
}

export async function functionCall(workspace: string, name: FunctionName, args: string): Promise<FunctionCallResponse> {
    switch (name) {
        case "notify_user": {
            return notifyUser(JSON.parse(args) as NotifyUserRequest);
        }
        case "ask_user": {
            return {
                status: "success",
                display: false,
                result: {
                    response: askUser(JSON.parse(args) as AskUserRequest),
                },
                ask: false,
            };
        }
        case "read_file":
            return {
                status: "success",
                display: true,
                result: {
                    content: await readFile(workspace, JSON.parse(args) as ReadFileRequest),
                },
                ask: false,
            };
        case "write_file":
            await writeFile(workspace, JSON.parse(args) as WriteFileRequest);
            return {
                status: "success",
                display: true,
                ask: false,
            };
        case "shell_exec":
            return {
                status: "success",
                display: true,
                result: {
                    output: shell_exec(workspace, JSON.parse(args) as ShellExecRequest),
                },
                ask: false,
            };
        case "review_todo":
            return {
                status: "success",
                display: true,
                result: {
                    todo: await reviewTodo(workspace),
                },
                ask: false,
            };
        case "update_todo": {
            await updateTodo(workspace, JSON.parse(args) as UpdateTodoRequest);
            return {
                status: "success",
                display: true,
                ask: false,
            };
        }
        case "pause": {
            return {
                status: "success",
                display: true,
                ask: true,
            };
        }
    }
}

type NotifyUserRequest = {
    message: string,
}

function notifyUser(
    request: NotifyUserRequest,
): FunctionCallResponse {
    return {
        status: "success",
        display: false,
        notification: request.message,
        ask: false,
    };
}

type AskUserRequest = {
    message: string,
}

function askUser(
    request: AskUserRequest,
): FunctionCallResponse {
    return {
        status: "success",
        display: false,
        notification: request.message,
        ask: true,
    };
}

type ReadFileRequest = {
    path: string,
};

async function readFile(
    workspace: string,
    request: ReadFileRequest,
): Promise<string> {
    const filePath = path.join(workspacePath(workspace), request.path);
    return readToString(filePath);
}

type WriteFileRequest = {
    path: string,
    content: string,
}

async function writeFile(
    workspace: string,
    request: WriteFileRequest,
) {
    const filePath = path.join(workspacePath(workspace), request.path);
    const dirPath = path.join(workspacePath(workspace), path.dirname(request.path));
    await fs.mkdir(dirPath, { recursive: true });
    await fs.writeFile(filePath, request.content, { encoding: "utf-8" });
}

type ShellExecRequest = {
    command: string,
}

function shell_exec(
    workspace: string,
    request: ShellExecRequest,
): string {
    try {
        return execSync(request.command, {
            cwd: workspacePath(workspace),
            encoding: "utf-8",
        });
    } catch (error) {
        const execError = error as SpawnSyncReturns<string>;
        return execError.stderr;
    }
}

async function reviewTodo(workspace: string) {
    return readToString(todoPath(workspace));
}

type UpdateTodoRequest = {
    content: string
}

async function updateTodo(
    workspace: string,
    request: UpdateTodoRequest,
) {
    await fs.writeFile(todoPath(workspace), request.content);
}
