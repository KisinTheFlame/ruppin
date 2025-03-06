import { readFileSync } from "fs";
import { generateContent } from "./gemini";

(async () => {
    const promptPath = "static/prompt.md";
    const prompt = readFileSync(promptPath, "utf8");
    const result = await generateContent(prompt);
    console.log(result);
})();
