import { t as defineBundledChannelEntry } from "../../channel-entry-contract-Cy1kYSbr.js";
import { r as createLazyRuntimeModule } from "../../lazy-runtime-B-Fc-m0I.js";
//#region extensions/line/index.ts
function createLineCardCommandLoader(api) {
  return createLazyRuntimeModule(async () => {
    let registered = null;
    const { registerLineCardCommand } = await import("../../card-command-DnrC1OXQ.js");
    registerLineCardCommand({
      ...api,
      registerCommand(command) {
        registered = command;
      },
    });
    if (!registered) throw new Error("LINE card command registration unavailable");
    return registered;
  });
}
var line_default = defineBundledChannelEntry({
  id: "line",
  name: "LINE",
  description: "LINE Messaging API channel plugin",
  importMetaUrl: import.meta.url,
  plugin: {
    specifier: "./channel-plugin-api.js",
    exportName: "linePlugin",
  },
  runtime: {
    specifier: "./runtime-api.js",
    exportName: "setLineRuntime",
  },
  registerFull(api) {
    const loadLineCardCommand = createLineCardCommandLoader(api);
    api.registerCommand({
      name: "card",
      description: "Send a rich card message (LINE).",
      acceptsArgs: true,
      requireAuth: false,
      async handler(ctx) {
        return await (await loadLineCardCommand()).handler(ctx);
      },
    });
  },
});
//#endregion
export { line_default as default };
