import * as fs from "fs/promises";
import * as path from "path";
import { listFiles } from "./utils";
import { formatDate } from "date-fns";
import { mkdirSync } from "fs";

const WorkspaceRoot = "/Users/kisin/.ruppin/workspace";

export function workspacePath(workspace: string): string {
    return path.join(WorkspaceRoot, workspace);
}

export function todoPath(workspace: string): string {
    return path.join(workspacePath(workspace), ".ruppin", "draft.md");
}

export async function createWorkspace(): Promise<string> {
    const workspaceName = newWorkspaceName();
    const workspace = workspacePath(workspaceName);
    await fs.mkdir(workspace);
    const ruppinPath = path.join(workspace, ".ruppin");
    await fs.mkdir(ruppinPath);
    const draftPath = path.join(ruppinPath, "draft.md");
    await fs.writeFile(path.join(draftPath), "");
    return workspaceName;
}

export const dirWorkspace = async (workspace: string): Promise<string[]> => {
    const allFiles = await listFiles(workspacePath(workspace));
    return allFiles.filter(path => !/\.ruppin.*/.test(path));
};

const newWorkspaceName = (): string => {
    const now = new Date();
    return formatDate(now, `yyyy-MM-dd_HH-mm-ss_${now.getMilliseconds()}`);
};

mkdirSync(WorkspaceRoot, { recursive: true });
