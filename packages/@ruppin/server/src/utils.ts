import { readFileSync } from "fs";
import { readdir, readFile } from "fs/promises";

export function trim(str: string): string {
    return str.trim();
}

export const readToString = async (path: string): Promise<string> => {
    return await readFile(path, "utf-8");
};

export const readToStringSync = (path: string): string => {
    return readFileSync(path, "utf-8");
};

export const listFiles = async (dir: string): Promise<string[]> => {
    return await readdir(dir, { encoding: "utf-8", recursive: true });
};

export class Queue<T> {
    private readonly queue: T[] = [];
    private readonly resolves: ((value: T) => void)[] = [];

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
