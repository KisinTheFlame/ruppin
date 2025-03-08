import { Supplier } from "./models";
import OpenAI from "openai";

export const chat = async (supplier: Supplier, prompt: string) => {
    const openai = new OpenAI({
        baseURL: supplier.baseURL,
        apiKey: supplier.apiKey,
    });
    return await openai.chat.completions.create({
        model: supplier.model,
        messages: [
            {
                role: "system",
                content: prompt,
            },
            {
                role: "user",
                content: "我想做一个命令行程序，可以接受两个数，输出它们的和。",
            },
        ],
        response_format: { type: "json_object" },
    });
};
