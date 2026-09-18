import { spawn } from "node:child_process";
import "./parse-finite-number-Z7n6tXLk.js";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { constants as constants$1, tmpdir } from "node:os";
import { join } from "node:path";
import { c as callGateway } from "./call-BVMO6az_.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-Br1guPTt.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
//#region src/cli/attach-cli.ts
function writeClaudeMcpConfig(mcpConfig) {
  const dir = mkdtempSync(join(tmpdir(), "openclaw-attach-"));
  const path = join(dir, ".mcp.json");
  writeFileSync(path, JSON.stringify(mcpConfig, null, 2), {
    encoding: "utf8",
    mode: 384,
  });
  return {
    path,
    cleanup: () =>
      rmSync(dir, {
        recursive: true,
        force: true,
      }),
  };
}
async function registerAttachCli(program, _argv = process.argv) {
  program
    .command("attach")
    .description("Attach Claude Code to a gateway session with scoped MCP tools")
    .option("--session <key>", "Gateway session key to bind (default: main session)")
    .option(
      "--ttl <ms>",
      "Grant TTL in positive base-10 integer milliseconds (default: gateway policy)",
    )
    .option("--bin <path>", "Claude Code binary to spawn", "claude")
    .option(
      "--print-config",
      "Mint the grant + write the .mcp.json, print how to launch it, and exit without spawning",
      false,
    )
    .addHelpText(
      "after",
      "\nExamples:\n  openclaw attach                       Attach Claude Code to the main session\n  openclaw attach --session agent:main:telegram:123 --ttl 600000\n  openclaw attach --print-config        Set up the grant + config and print how to launch it yourself\n",
    )
    .action(async (opts) => {
      let ttlMs;
      if (opts.ttl !== void 0) {
        ttlMs = parseStrictPositiveInteger(opts.ttl);
        if (ttlMs === void 0) {
          defaultRuntime.error(
            `--ttl must be a positive integer of milliseconds. Got: ${JSON.stringify(opts.ttl)}`,
          );
          defaultRuntime.exit(1);
          return;
        }
      }
      const cfg = getRuntimeConfig();
      const granted = await callGateway({
        config: cfg,
        method: "attach.grant",
        params: {
          sessionKey: opts.session,
          ttlMs,
        },
        mode: GATEWAY_CLIENT_MODES.CLI,
        clientName: GATEWAY_CLIENT_NAMES.CLI,
      });
      if (
        !granted ||
        typeof granted.token !== "string" ||
        typeof granted.sessionKey !== "string" ||
        typeof granted.expiresAtMs !== "number" ||
        !Number.isFinite(granted.expiresAtMs) ||
        !granted.mcpConfig?.mcpServers ||
        typeof granted.env !== "object" ||
        granted.env === null
      ) {
        defaultRuntime.error("attach.grant returned an unexpected response from the gateway.");
        defaultRuntime.exit(1);
        return;
      }
      const grant = granted;
      const { path: configPath, cleanup } = writeClaudeMcpConfig(grant.mcpConfig);
      const expiresAt = new Date(grant.expiresAtMs).toISOString();
      const claudeArgs = ["--strict-mcp-config", "--mcp-config", configPath];
      if (opts.printConfig) {
        defaultRuntime.log(
          JSON.stringify(
            {
              sessionKey: grant.sessionKey,
              expiresAt,
              env: grant.env,
              configPath,
              launch: [opts.bin, ...claudeArgs],
            },
            null,
            2,
          ),
        );
        defaultRuntime.log(
          `Grant is live until ${expiresAt} and auto-expires; it is not revoked here. Launch with the env above, then delete ${configPath} when done.`,
        );
        return;
      }
      let revokePromise;
      const revokeOnce = () =>
        (revokePromise ??= (async () => {
          try {
            await callGateway({
              config: cfg,
              method: "attach.revoke",
              params: { token: grant.token },
              mode: GATEWAY_CLIENT_MODES.CLI,
              clientName: GATEWAY_CLIENT_NAMES.CLI,
            });
          } catch (error) {
            defaultRuntime.error(
              `Warning: failed to revoke attach grant; it remains live until ${expiresAt}. ${String(error)}`,
            );
          }
          cleanup();
        })());
      defaultRuntime.log(
        `Attaching Claude Code to session ${grant.sessionKey} (grant expires ${expiresAt})…`,
      );
      const child = spawn(opts.bin, claudeArgs, {
        stdio: "inherit",
        env: {
          ...process.env,
          ...grant.env,
        },
      });
      const onSigint = () => {};
      const onSigterm = () => child.kill("SIGTERM");
      const finish = (code) => {
        process.off("SIGINT", onSigint);
        process.off("SIGTERM", onSigterm);
        defaultRuntime.exit(code);
      };
      child.on("error", (error) => {
        (async () => {
          defaultRuntime.error(`Failed to launch '${opts.bin}': ${String(error)}`);
          await revokeOnce();
          finish(1);
        })();
      });
      child.on("exit", (code, signal) => {
        (async () => {
          await revokeOnce();
          const signalCode = signal ? 128 + (constants$1.signals[signal] ?? 0) : null;
          finish(signalCode ?? code ?? 0);
        })();
      });
      process.on("SIGINT", onSigint);
      process.on("SIGTERM", onSigterm);
    });
}
//#endregion
export { registerAttachCli, writeClaudeMcpConfig };
