import OpenAI from "openai";

const GeminiApiKey = process.env.GEMINI_API_KEY;
const DeepseekApiKey = process.env.DEEPSEEK_API_KEY;
const VolcengineApiKey = process.env.VOLCENGINE_API_KEY;

export type AIClient = OpenAI;

export type SupplierName = "gemini" | "deepseek" | "volcengine";

export type Supplier = {
    baseURL: string,
    apiKey?: string,
    model: string
}

export const suppliers: Record<SupplierName, Supplier> = {
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
    volcengine: {
        baseURL: "https://ark.cn-beijing.volces.com/api/v3",
        apiKey: VolcengineApiKey,
        model: "deepseek-v3-241226",
    },
};
