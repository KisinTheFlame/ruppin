import { readFile } from "fs/promises";

export function dedent(str: string): string {
    const lines = str.split("\n");
    const minIndent = Math.min(
        ...lines
            .filter(line => line.trim().length > 0)
            .map(line => line.match(/^(\s*)/)![1].length),
    );

    return lines.map(line => line.slice(minIndent)).join("\n").trim();
}

export const readToString = async (path: string): Promise<string> => {
    return readFile(path, "utf8");
};
