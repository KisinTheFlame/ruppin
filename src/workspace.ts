import * as fs from "fs/promises";
import * as path from "path";

const WorkspaceRoot = "~/.ruppin/workspace";

export function workspacePath(workspace: string): string {
    return path.join(WorkspaceRoot, workspace);
}

export function draftPath(workspace: string): string {
    return path.join(workspacePath(workspace), ".ruppin", "draft.md");
}

export async function createWorkspace(name: string) {
    const workspace = workspacePath(name);
    await fs.mkdir(workspace);
    const ruppinPath = path.join(workspace, ".ruppin");
    await fs.mkdir(ruppinPath);
    const draftPath = path.join(ruppinPath, "draft.md");
    await fs.writeFile(path.join(draftPath), "");
}

(async () => {
    await fs.mkdir(WorkspaceRoot, { recursive: true });
})();
