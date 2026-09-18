import { s as SessionEntry } from "./types-Dk-ocvLl.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region src/agents/thinking-runtime.d.ts
/** Resolves an explicit session override before configured model/provider policy. */
declare function resolveEffectiveAgentRuntime(params: {
  cfg: OpenClawConfig;
  provider: string;
  modelId: string;
  agentId?: string;
  sessionKey?: string;
  sessionEntry?: Pick<SessionEntry, "agentHarnessId" | "agentRuntimeOverride">;
}): string;
//#endregion
export { resolveEffectiveAgentRuntime as t };
