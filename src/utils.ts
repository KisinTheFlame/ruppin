import { readFileSync } from "fs";
import { readdir, readFile } from "fs/promises";

export function dedent(str: string): string {
    const lines = str.split("\n");
    const minIndent = Math.min(
        ...lines
            .filter(line => line.trim().length > 0)
            .map(line => line.match(/^(\s*)/)![1].length),
    );

    return lines.map(line => line.slice(minIndent)).join("\n").trim();
}

export function trim(str: string): string {
    return str.trim();
}

export const readToString = async (path: string): Promise<string> => {
    return await readFile(path, "utf-8");
};

export const readToStringSync = (path: string): string => {
    return readFileSync(path, "utf-8");
};

export const listFiles = async (dir: string): Promise<Array<string>> => {
    return await readdir(dir, { encoding: "utf-8", recursive: true });
};
