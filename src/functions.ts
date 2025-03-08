import * as fs from "fs/promises";
import * as path from "path";
import { draftPath, workspacePath } from "./workspace";
import { readToString } from "./utils";
import { execSync } from "child_process";

export type FunctionCall =
    & {
        function: string,
        request: object
    }
    | {
        function: "read_file",
        request: ReadFileRequest,
    }
    | {
        function: "write_file",
        request: WriteFileRequest,
    }
    | {
        function: "shell",
        request: ShellRequest,
    }
    | {
        function: "review_draft",
        request: void
    }
    | {
        function: "update_draft",
        request: UpdateDraftRequest,
    };

export type FunctionCallResponse = {
    status: "success" | "fail",
    result?: object | string,
};

export async function functionCall(fc: FunctionCall): Promise<FunctionCallResponse> {
    switch (fc.function) {
        case "read_file":
            return {
                status: "success",
                result: {
                    content: await readFile("default", fc.request as ReadFileRequest),
                },
            };
        case "write_file":
            await writeFile("default", fc.request as WriteFileRequest);
            return {
                status: "success",
            };
        case "shell":
            return {
                status: "success",
                result: {
                    output: shell("default", fc.request as ShellRequest),
                },
            };
        case "review_draft":
            return {
                status: "success",
                result: {
                    draft: await reviewDraft("default"),
                },
            };
        case "update_draft":
            await updateDraft("default", fc.request as UpdateDraftRequest);
            return {
                status: "success",
            };
        default:
            return {
                status: "fail",
                result: {
                    error: `Function ${fc.function} not found`,
                },
            };
    }
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
    await fs.writeFile(filePath, request.content);
}

type ShellRequest = {
    command: string,
}

function shell(
    workspace: string,
    request: ShellRequest,
): string {
    return execSync(request.command, { encoding: "utf-8" });
}

async function reviewDraft(workspace: string) {
    return readToString(draftPath(workspace));
}

type UpdateDraftRequest = {
    content: string
}

async function updateDraft(
    workspace: string,
    request: UpdateDraftRequest,
) {
    await fs.writeFile(draftPath(workspace), request.content);
}
