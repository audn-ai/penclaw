import "./agent-scope-y9xQv_q1.js";
import {
  a as resolveAgentDir,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { t as runEmbeddedAgent } from "./embedded-agent-T_kAEk06.js";
import { n as resolveAgentIdentity } from "./identity-CceraXdn.js";
import { t as resolveThinkingDefault } from "./model-thinking-default-C_eCEq4B.js";
import "./model-selection-DOlkTrQa.js";
import { l as resolveStorePath } from "./paths-TfuVT-K8.js";
import { o as updateSessionStoreEntry } from "./store-CzZJhTF6.js";
import "./sessions-CEG7v41b.js";
import { n as resolveAgentTimeoutMs } from "./timeout-CjPlNzdm.js";
import { d as ensureAgentWorkspace } from "./workspace-DXzCbuC0.js";
//#region src/extensionAPI.ts
if (process.env.VITEST !== "true" && process.env.OPENCLAW_SUPPRESS_EXTENSION_API_WARNING !== "1")
  process.emitWarning(
    "openclaw/extension-api is deprecated. Migrate to api.runtime.agent.* or focused openclaw/plugin-sdk/<subpath> imports. See https://docs.openclaw.ai/plugins/sdk-migration",
    {
      code: "OPENCLAW_EXTENSION_API_DEPRECATED",
      detail:
        "This compatibility bridge is temporary. Bundled plugins should use the injected plugin runtime instead of importing host-side agent helpers directly. Migration guide: https://docs.openclaw.ai/plugins/sdk-migration",
    },
  );
//#endregion
export {
  DEFAULT_MODEL,
  DEFAULT_PROVIDER,
  ensureAgentWorkspace,
  resolveAgentDir,
  resolveAgentIdentity,
  resolveAgentTimeoutMs,
  resolveAgentWorkspaceDir,
  resolveStorePath,
  resolveThinkingDefault,
  runEmbeddedAgent,
  runEmbeddedAgent as runEmbeddedPiAgent,
  updateSessionStoreEntry,
};
