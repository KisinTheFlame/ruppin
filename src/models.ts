import OpenAI from "openai";

const GeminiApiKey = process.env.GEMINI_API_KEY!;
const DeepseekApiKey = process.env.DEEPSEEK_API_KEY!;

export type AIClient = OpenAI;

export type SupplierName = "gemini" | "deepseek";

export type Supplier = {
    baseURL: string,
    apiKey: string,
    model: string
}

export const suppliers: { [key in SupplierName]: Supplier } = {
    gemini: {
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
        apiKey: GeminiApiKey,
        model: "gemini-2.0-flash",
    },
    deepseek: {
        baseURL: "https://api.deepseek.com",
        apiKey: DeepseekApiKey,
        model: "deepseek-chat",
    },
};
