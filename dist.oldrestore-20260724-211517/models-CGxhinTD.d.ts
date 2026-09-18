import {
  i as CodexAppServerStartOptions,
  n as resolveCodexAppServerAuthProfileIdForAgent,
} from "./auth-bridge-C7wLdHtu.js";

//#region extensions/codex/src/app-server/models.d.ts
/** Normalized model metadata returned by the Codex app-server model listing helper. */
type CodexAppServerModel = {
  id: string;
  model: string;
  displayName?: string;
  description?: string;
  hidden?: boolean;
  isDefault?: boolean;
  inputModalities: string[];
  supportedReasoningEfforts: string[];
  defaultReasoningEffort?: string;
};
/** One page of Codex app-server model metadata plus optional pagination state. */
type CodexAppServerModelListResult = {
  models: CodexAppServerModel[];
  nextCursor?: string;
  truncated?: boolean;
};
/** Options for querying Codex app-server models through a shared or isolated client. */
type CodexAppServerListModelsOptions = {
  limit?: number;
  cursor?: string;
  includeHidden?: boolean;
  timeoutMs?: number;
  startOptions?: CodexAppServerStartOptions;
  authProfileId?: string;
  agentDir?: string;
  config?: Parameters<typeof resolveCodexAppServerAuthProfileIdForAgent>[0]["config"];
  sharedClient?: boolean;
};
//#endregion
export {
  CodexAppServerModel as n,
  CodexAppServerModelListResult as r,
  CodexAppServerListModelsOptions as t,
};
