import { s as spawnTerminalPty } from "../types-Dz3ohwUV.js";
import { or as OpenClawPluginNodeHostCommandIo } from "../types-Ga3mNO_F.js";

//#region src/node-host/pty-command.d.ts
type NodePtyCommandResult = {
  exitCode: number;
  signal?: number;
};
type NodePtyResumeParams = {
  threadId: string;
  cwd?: string;
  cols: number;
  rows: number;
};
declare function decodeNodePtyResumeParams(
  paramsJSON: string | null | undefined,
  validateThreadId: (value: unknown) => string,
): NodePtyResumeParams;
/** Runs one allowlisted plugin-owned command in an interactive node PTY. */
declare function runNodePtyCommand(
  params: {
    file: string;
    args: string[];
    cwd?: string;
    cols: number;
    rows: number;
  },
  io: OpenClawPluginNodeHostCommandIo,
  spawn?: typeof spawnTerminalPty,
): Promise<NodePtyCommandResult>;
//#endregion
//#region src/node-host/invoke-agent-cli-claude-params.d.ts
/** Claude CLI session ids are bounded, non-option argv values. */
declare function validateClaudeSessionId(value: unknown): string;
//#endregion
//#region src/infra/executable-path.d.ts
declare function resolveExecutableFromPathEnv(
  executable: string,
  pathEnv: string,
  env?: NodeJS.ProcessEnv,
  options?: {
    includeExtensionless?: boolean;
  },
): string | undefined;
//#endregion
export {
  type NodePtyCommandResult,
  type NodePtyResumeParams,
  type OpenClawPluginNodeHostCommandIo,
  decodeNodePtyResumeParams,
  resolveExecutableFromPathEnv,
  runNodePtyCommand,
  validateClaudeSessionId,
};
