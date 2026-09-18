import {
  n as BROWSER_REQUEST_GATEWAY_SCOPE,
  t as BROWSER_REQUEST_GATEWAY_METHOD,
} from "./browser-gateway-contract-B6OC_gCs.js";
import {
  n as describeBrowserTool,
  t as BrowserToolSchema,
} from "./browser-tool.schema-CbcSu9RM.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { t as configureSystemProfileImportStateStore } from "./system-profile-import-state-DFy4mHBX.js";
//#region extensions/browser/plugin-registration.ts
const EAGER_BROWSER_CONTROL_SERVICE_ENV = "OPENCLAW_EAGER_BROWSER_CONTROL_SERVER";
const loadBrowserRegistrationRuntimeModule = createLazyRuntimeModule(
  () => import("./extensions/browser/register.runtime.js"),
);
function isTruthyEnvValue(value) {
  return /^(?:1|true|yes|on)$/iu.test(value?.trim() ?? "");
}
function deriveChatTypeFromSessionKey(sessionKey) {
  const tokens = new Set(sessionKey?.toLowerCase().split(":").filter(Boolean) ?? []);
  if (tokens.has("group")) return "group";
  if (tokens.has("channel")) return "channel";
  if (tokens.has("direct") || tokens.has("dm")) return "direct";
}
const BROWSER_CLI_DESCRIPTOR = {
  name: "browser",
  description: "Manage OpenClaw's dedicated browser (Chrome/Chromium)",
  hasSubcommands: true,
};
function createLazyBrowserTool(opts) {
  return {
    label: "Browser",
    name: "browser",
    description: describeBrowserTool({
      targetDefault: opts?.sandboxBridgeUrl ? "sandbox" : "host",
      hostHint:
        opts?.allowHostControl === false
          ? "Host target blocked by policy."
          : "Host target allowed.",
    }),
    parameters: BrowserToolSchema,
    execute: async (toolCallId, args, signal, onUpdate) => {
      const { createBrowserTool } = await loadBrowserRegistrationRuntimeModule();
      return await createBrowserTool(opts).execute(toolCallId, args, signal, onUpdate);
    },
  };
}
function createBrowserToolOptions(ctx) {
  const mediaChannel = ctx.deliveryContext?.channel ?? ctx.messageChannel;
  const mediaChatType = deriveChatTypeFromSessionKey(ctx.sessionKey);
  return {
    ...(ctx.browser?.sandboxBridgeUrl ? { sandboxBridgeUrl: ctx.browser.sandboxBridgeUrl } : {}),
    ...(ctx.browser?.allowHostControl !== void 0
      ? { allowHostControl: ctx.browser.allowHostControl }
      : {}),
    ...(ctx.sessionKey ? { agentSessionKey: ctx.sessionKey } : {}),
    ...(ctx.agentDir ? { agentDir: ctx.agentDir } : {}),
    ...(ctx.workspaceDir ? { workspaceDir: ctx.workspaceDir } : {}),
    ...(ctx.activeModel?.provider || ctx.activeModel?.modelId
      ? {
          activeModel: {
            provider: ctx.activeModel.provider,
            model: ctx.activeModel.modelId,
          },
        }
      : {}),
    ...(ctx.sessionKey || mediaChannel
      ? {
          mediaScope: {
            ...(ctx.sessionKey ? { sessionKey: ctx.sessionKey } : {}),
            ...(mediaChannel ? { channel: mediaChannel } : {}),
            ...(mediaChatType ? { chatType: mediaChatType } : {}),
          },
        }
      : {}),
  };
}
/** Browser plugin reload policy. */
const browserPluginReload = {
  restartPrefixes: ["browser"],
  hotPrefixes: ["browser.profiles"],
};
/** Node-host command descriptors exposed by the Browser plugin. */
const browserPluginNodeHostCommands = [
  {
    command: "browser.proxy",
    cap: "browser",
    isAvailable: ({ config }) =>
      config.browser?.enabled !== false && config.nodeHost?.browserProxy?.enabled !== false,
    handle: async (paramsJSON) => {
      const { runBrowserProxyCommand } = await loadBrowserRegistrationRuntimeModule();
      return await runBrowserProxyCommand(paramsJSON);
    },
  },
];
/** Security audit collectors contributed by the Browser plugin. */
const browserSecurityAuditCollectors = [
  async (ctx) => {
    const { collectBrowserSecurityAuditFindings } = await loadBrowserRegistrationRuntimeModule();
    return collectBrowserSecurityAuditFindings(ctx);
  },
];
function createLazyBrowserPluginService() {
  let service = null;
  const loadService = async () => {
    if (!service) {
      const { createBrowserPluginService } = await loadBrowserRegistrationRuntimeModule();
      service = createBrowserPluginService();
    }
    return service;
  };
  return {
    id: "browser-control",
    start: async (ctx) => {
      if (!isTruthyEnvValue(process.env[EAGER_BROWSER_CONTROL_SERVICE_ENV])) return;
      await (await loadService()).start(ctx);
    },
    stop: async (ctx) => {
      if (!service) {
        const { stopBrowserControlService } = await import("./control-service-BkQZDn4M.js");
        await stopBrowserControlService();
        return;
      }
      await service.stop?.(ctx);
    },
  };
}
/** Register Browser tool factories, CLI, gateway methods, services, and audits. */
function registerBrowserPlugin(api) {
  configureSystemProfileImportStateStore(
    api.runtime.state.openKeyedStore({
      namespace: "browser.system-profile-import",
      maxEntries: 1,
    }),
  );
  api.registerTool((ctx) => createLazyBrowserTool(createBrowserToolOptions(ctx)));
  api.registerCli(
    async ({ program }) => {
      const { registerBrowserCli } = await import("./browser-cli-CGjdjMID.js");
      registerBrowserCli(program, process.argv, api.rootDir);
    },
    {
      commands: ["browser"],
      descriptors: [BROWSER_CLI_DESCRIPTOR],
    },
  );
  api.registerGatewayMethod(
    BROWSER_REQUEST_GATEWAY_METHOD,
    async (opts) => {
      const { handleBrowserGatewayRequest } = await loadBrowserRegistrationRuntimeModule();
      return await handleBrowserGatewayRequest(opts);
    },
    { scope: BROWSER_REQUEST_GATEWAY_SCOPE },
  );
  api.registerHttpRoute({
    path: "/browser/extension",
    auth: "plugin",
    match: "exact",
    handler: (_req, res) => {
      res.writeHead(426, { "Content-Type": "text/plain" });
      res.end("Upgrade Required: connect the OpenClaw Chrome extension over WebSocket.");
    },
    handleUpgrade: async (req, socket, head) => {
      const { handleGatewayExtensionUpgrade } = await import("./gateway-relay-route-BCURm2dl.js");
      return await handleGatewayExtensionUpgrade(req, socket, head);
    },
  });
  api.registerService(createLazyBrowserPluginService());
}
//#endregion
export {
  registerBrowserPlugin as i,
  browserPluginReload as n,
  browserSecurityAuditCollectors as r,
  browserPluginNodeHostCommands as t,
};
