import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.GEMINI_API_KEY!;

const gemini = new GoogleGenerativeAI(geminiApiKey);

const model = gemini.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
        responseMimeType: "application/json",
    },
});

export async function generateContent(prompt: string): Promise<string> {
    const result = await model.generateContent(prompt);
    return result.response.text();
}
