import { generateContent } from "./gemini";
import { readToString } from "./utils";

(async () => {
    const promptPath = "static/prompt.md";
    const prompt = await readToString(promptPath);
    const result = await generateContent(prompt);
    console.log(result);
})();
