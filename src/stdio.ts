import * as readline from "readline/promises";

const stdio = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

export const question = async (message: string): Promise<string> => {
    return await stdio.question(message);
};
