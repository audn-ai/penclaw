import { i as OpenClawConfig } from "../types.openclaw-DDo8sH3F.js";

//#region src/agents/realtime-bootstrap-context.d.ts
/** Default ordered profile files included in realtime bootstrap context. */
declare const REALTIME_BOOTSTRAP_CONTEXT_FILE_NAMES: readonly ["IDENTITY.md", "USER.md", "SOUL.md"];
/** Profile file names allowed in realtime bootstrap context. */
type RealtimeBootstrapContextFileName = (typeof REALTIME_BOOTSTRAP_CONTEXT_FILE_NAMES)[number];
/** Builds bounded realtime instructions from selected profile bootstrap files. */
declare function resolveRealtimeBootstrapContextInstructions(params: {
  agentId: string;
  config: OpenClawConfig;
  files?: readonly RealtimeBootstrapContextFileName[];
  sessionKey?: string;
  warn?: (message: string) => void;
}): Promise<string | undefined>;
//#endregion
export {
  REALTIME_BOOTSTRAP_CONTEXT_FILE_NAMES,
  type RealtimeBootstrapContextFileName,
  resolveRealtimeBootstrapContextInstructions,
};
