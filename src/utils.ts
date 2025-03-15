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

export class Queue<T> {
    private readonly queue: Array<T> = [];
    private readonly resolves: Array<(value: T) => void> = [];

    public enqueue(t: T) {
        const resolve = this.resolves.shift();
        if (resolve !== undefined) {
            resolve(t);
            return;
        }
        this.queue.push(t);
    }

    public async dequeue(): Promise<T> {
        const t = this.queue.shift();
        if (t !== undefined) {
            return t;
        }
        return new Promise((resolve) => {
            this.resolves.push(resolve);
        });
    }
}
