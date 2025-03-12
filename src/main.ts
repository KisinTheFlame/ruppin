import { oneTurnChat } from "./client";
import { initContext } from "./context";

(async () => {
    let context = await initContext({
        task: "实现一个命令行的计算器。",
    });
    while (true) {
        context = await oneTurnChat(context);
    }
})();
