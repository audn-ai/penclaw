import {
  Cc as ContextEngineHostCapability,
  Dc as ContextEngineOperation,
  Sc as ContextEngine,
} from "./types-Ga3mNO_F.js";

//#region src/context-engine/host-compat.d.ts
type ContextEngineHostSupport = {
  id: string;
  label: string;
  capabilities: readonly ContextEngineHostCapability[];
};
declare const CODEX_APP_SERVER_CONTEXT_ENGINE_HOST: {
  readonly id: "codex-app-server";
  readonly label: "Codex app-server harness";
  readonly capabilities: readonly [
    "bootstrap",
    "assemble-before-prompt",
    "after-turn",
    "maintain",
    "compact",
    "runtime-llm-complete",
    "thread-bootstrap-projection",
  ];
};
/** Assert that a context engine can safely run under the supplied host. */
declare function assertContextEngineHostSupport(params: {
  contextEngine: ContextEngine;
  operation: ContextEngineOperation;
  host: ContextEngineHostSupport;
}): void;
//#endregion
export {
  ContextEngineHostSupport as n,
  assertContextEngineHostSupport as r,
  CODEX_APP_SERVER_CONTEXT_ENGINE_HOST as t,
};
