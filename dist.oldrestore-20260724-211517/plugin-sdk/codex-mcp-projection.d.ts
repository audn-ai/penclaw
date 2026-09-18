import { i as OpenClawConfig } from "../types.openclaw-DDo8sH3F.js";
//#region src/agents/cli-runner/bundle-mcp-codex.d.ts
type CodexThreadConfigValue =
  | string
  | number
  | boolean
  | null
  | CodexThreadConfigValue[]
  | {
      [key: string]: CodexThreadConfigValue;
    };
type CodexThreadConfigObject = {
  [key: string]: CodexThreadConfigValue;
};
type CodexUserMcpServersProjectionOptions = {
  agentId?: string;
  agentDir?: string;
  allowLiteralOAuthProjection?: boolean;
  onServerUnavailable?: (serverName: string, error: unknown) => void;
};
/** Returns Codex CLI args with TOML MCP server overrides injected. */
/**
 * Codex app-server runtime (extensions/codex) receives its thread config as a
 * JSON object through JSON-RPC `thread/start`/`thread/resume`, not as `-c` CLI
 * args. This returns a thread-config patch projecting user-configured
 * `cfg.mcp.servers` entries into Codex's `mcp_servers` table using the same
 * per-server normalization the CLI path uses, so app-server agents see the
 * same user MCP servers the CLI runtime exposes via `injectCodexMcpConfigArgs`.
 *
 * Only user-configured servers (`cfg.mcp.servers`) are projected. Plugin-
 * curated app-server apps are already attached separately through the codex
 * plugin thread-config `apps` patch, so they must not be re-projected here.
 */
declare function buildCodexUserMcpServersThreadConfigPatch(
  cfg: OpenClawConfig | undefined,
  options?: CodexUserMcpServersProjectionOptions,
):
  | {
      mcp_servers: CodexThreadConfigObject;
    }
  | undefined;
/** Async runtime projection that resolves OpenClaw-managed MCP bearer tokens. */
declare function buildCodexUserMcpServersThreadConfigPatchForRuntime(
  cfg: OpenClawConfig | undefined,
  options?: CodexUserMcpServersProjectionOptions,
): Promise<
  | {
      mcp_servers: CodexThreadConfigObject;
    }
  | undefined
>;
//#endregion
export {
  buildCodexUserMcpServersThreadConfigPatch,
  buildCodexUserMcpServersThreadConfigPatchForRuntime,
};
