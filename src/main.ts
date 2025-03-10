import { chat } from "./client";
import { suppliers } from "./models";
import { readToString } from "./utils";

(async () => {
    const promptPath = "static/prompt.md";
    const prompt = await readToString(promptPath);

    const model = suppliers["gemini"];
    const response = await chat(model, prompt);
    console.log(response.choices[0].message);
})();
