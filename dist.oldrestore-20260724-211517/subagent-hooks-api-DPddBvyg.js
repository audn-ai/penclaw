import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
//#region extensions/feishu/subagent-hooks-api.ts
const loadFeishuSubagentHooksModule = createLazyRuntimeModule(
  () => import("./subagent-hooks-B9LBwqJ8.js"),
);
function registerFeishuSubagentHooks(api) {
  api.on("subagent_delivery_target", async (event) => {
    const { handleFeishuSubagentDeliveryTarget } = await loadFeishuSubagentHooksModule();
    return handleFeishuSubagentDeliveryTarget(event);
  });
  api.on("subagent_ended", async (event) => {
    const { handleFeishuSubagentEnded } = await loadFeishuSubagentHooksModule();
    handleFeishuSubagentEnded(event);
  });
}
//#endregion
export { registerFeishuSubagentHooks as t };
