import * as fs from "fs/promises";
import * as path from "path";
import { todoPath, workspacePath } from "./workspace";
import { readToString } from "./utils";
import { execSync, SpawnSyncReturns } from "child_process";
import { question } from "./stdio";
import { tools } from "./tools";

export type FunctionName = typeof tools[number]["function"]["name"];

export type FunctionCallResponse = {
    status: "success" | "fail",
    result?: object,
};

export async function functionCall(workspace: string, name: FunctionName, args: string): Promise<FunctionCallResponse> {
    switch (name) {
        case "notify_user": {
            notifyUser(JSON.parse(args) as NotifyUserRequest);
            return {
                status: "success",
            };
        }
        case "ask_user": {
            return {
                status: "success",
                result: {
                    response: await askUser(JSON.parse(args) as AskUserRequest),
                },
            };
        }
        case "read_file":
            return {
                status: "success",
                result: {
                    content: await readFile(workspace, JSON.parse(args) as ReadFileRequest),
                },
            };
        case "write_file":
            await writeFile(workspace, JSON.parse(args) as WriteFileRequest);
            return {
                status: "success",
            };
        case "shell_exec":
            return {
                status: "success",
                result: {
                    output: shell_exec(workspace, JSON.parse(args) as ShellExecRequest),
                },
            };
        case "review_todo":
            return {
                status: "success",
                result: {
                    todo: await reviewTodo(workspace),
                },
            };
        case "update_todo": {
            await updateTodo(workspace, JSON.parse(args) as UpdateTodoRequest);
            return {
                status: "success",
            };
        }
        case "pause": {
            process.exit(0);
        }
    }
}

type NotifyUserRequest = {
    message: string,
}

function notifyUser(
    request: NotifyUserRequest,
) {
    console.log(request.message);
}

type AskUserRequest = {
    message: string,
}

async function askUser(
    request: AskUserRequest,
): Promise<string> {
    return await question(request.message);
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
