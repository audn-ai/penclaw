import {
  C as ExecTarget,
  S as ExecSecurity,
  x as ExecMode,
  y as ExecAsk,
} from "./exec-approvals-B59RubLo.js";
import { s as SessionEntry } from "./types-Dk-ocvLl.js";
//#region src/agents/exec-defaults.d.ts
/** Session-scoped exec fields that may be carried across an isolated runtime boundary. */
type ExecSessionDefaults = Pick<
  SessionEntry,
  "execHost" | "execSecurity" | "execAsk" | "execNode" | "execCwd"
>;
type ResolvedExecConfig = {
  host?: ExecTarget;
  mode?: ExecMode;
  security?: ExecSecurity;
  ask?: ExecAsk;
  node?: string;
};
type ExecPolicyOverrides = Omit<ResolvedExecConfig, "mode">;
//#endregion
export { ExecSessionDefaults as n, ExecPolicyOverrides as t };
