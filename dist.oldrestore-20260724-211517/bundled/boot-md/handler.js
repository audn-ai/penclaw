import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import "../../agent-scope-y9xQv_q1.js";
import { t as agentCommand } from "../../agent-command-CxzoW4-d.js";
import {
  n as listAgentIds,
  o as resolveAgentWorkspaceDir,
} from "../../agent-scope-config-DVIR1nBa.js";
import { t as createDefaultDeps } from "../../deps-BDX9tA_j.js";
import { r as formatErrorMessage } from "../../errors-BoHeli7m.js";
import { o as isGatewayStartupEvent } from "../../internal-hooks-CckLIOgu.js";
import {
  a as OPENCLAW_RUNTIME_CONTEXT_NOTICE,
  n as INTERNAL_RUNTIME_CONTEXT_END,
  s as escapeInternalRuntimeContextDelimiters,
  t as INTERNAL_RUNTIME_CONTEXT_BEGIN,
} from "../../internal-runtime-context-BW7WOTKc.js";
import {
  a as resolveMainSessionKey,
  r as resolveAgentMainSessionKey,
} from "../../main-session-nrmKYo2W.js";
import {
  c as clearBootEchoContextForSession,
  l as setBootEchoContextForSession,
} from "../../openclaw-tools-DGecpaCF.js";
import { l as resolveStorePath } from "../../paths-TfuVT-K8.js";
import { r as defaultRuntime } from "../../runtime-Bz6o617W.js";
import { N as preserveTemporarySessionMapping } from "../../session-accessor-PZVNxFCV.js";
import "../../agent-DzWgmb_I.js";
import { d as resolveAgentIdFromSessionKey } from "../../session-key-druuY-GG.js";
import { t as runStartupTasks } from "../../startup-tasks-tqDIwhuO.js";
import { t as createSubsystemLogger } from "../../subsystem-Nlw-XKx1.js";
import { n as SILENT_REPLY_TOKEN } from "../../tokens-DKI4eGAu.js";
//#region src/gateway/boot.ts
function generateBootSessionId() {
  return `boot-${/* @__PURE__ */ new Date().toISOString().replace(/[:.]/g, "-").replace("T", "_").replace("Z", "")}-${crypto.randomUUID().slice(0, 8)}`;
}
const log$1 = createSubsystemLogger("gateway/boot");
const BOOT_FILENAME = "BOOT.md";
function buildBootPrompt(content) {
  return [
    "You are running a boot check. Follow BOOT.md instructions exactly.",
    "",
    INTERNAL_RUNTIME_CONTEXT_BEGIN,
    OPENCLAW_RUNTIME_CONTEXT_NOTICE,
    "",
    "BOOT.md:",
    escapeInternalRuntimeContextDelimiters(content),
    INTERNAL_RUNTIME_CONTEXT_END,
    "",
    "If BOOT.md asks you to send a message, use the message tool (action=send with channel + target).",
    "Use the `target` field (not `to`) for message tool destinations.",
    `After sending with the message tool, reply with ONLY: ${SILENT_REPLY_TOKEN}.`,
    `If nothing needs attention, reply with ONLY: ${SILENT_REPLY_TOKEN}.`,
  ].join("\n");
}
function resolveBootSessionKey(sessionKey) {
  return `agent:${resolveAgentIdFromSessionKey(sessionKey)}:boot`;
}
async function loadBootFile(workspaceDir) {
  const bootPath = path.join(workspaceDir, BOOT_FILENAME);
  try {
    const trimmed = (await fs.readFile(bootPath, "utf-8")).trim();
    if (!trimmed) return { status: "empty" };
    return {
      status: "ok",
      content: trimmed,
    };
  } catch (err) {
    if (err.code === "ENOENT") return { status: "missing" };
    throw err;
  }
}
async function runBootOnce(params) {
  const bootRuntime = {
    log: () => {},
    error: (message) => log$1.error(String(message)),
    exit: defaultRuntime.exit,
  };
  let result;
  try {
    result = await loadBootFile(params.workspaceDir);
  } catch (err) {
    const message = formatErrorMessage(err);
    log$1.error(`boot: failed to read ${BOOT_FILENAME}: ${message}`);
    return {
      status: "failed",
      reason: message,
    };
  }
  if (result.status === "missing" || result.status === "empty")
    return {
      status: "skipped",
      reason: result.status,
    };
  const sessionKey = resolveBootSessionKey(
    params.agentId
      ? resolveAgentMainSessionKey({
          cfg: params.cfg,
          agentId: params.agentId,
        })
      : resolveMainSessionKey(params.cfg),
  );
  const message = buildBootPrompt(result.content ?? "");
  const sessionId = generateBootSessionId();
  const agentId = resolveAgentIdFromSessionKey(sessionKey);
  const mappingPreservation = await preserveTemporarySessionMapping(
    {
      storePath: resolveStorePath(params.cfg.session?.store, { agentId }),
      sessionKey,
    },
    async () => {
      setBootEchoContextForSession(sessionKey, message);
      try {
        await agentCommand(
          {
            message,
            sessionKey,
            sessionId,
            deliver: false,
            suppressPromptPersistence: true,
          },
          bootRuntime,
          params.deps,
        );
        return;
      } catch (err) {
        const failure = formatErrorMessage(err);
        log$1.error(`boot: agent run failed: ${failure}`);
        return failure;
      } finally {
        clearBootEchoContextForSession(sessionKey);
      }
    },
  );
  const agentFailure = mappingPreservation.result;
  if (mappingPreservation.snapshotFailure)
    log$1.debug("boot: could not snapshot session mapping", {
      sessionKey,
      error: mappingPreservation.snapshotFailure,
    });
  const mappingRestoreFailure = mappingPreservation.restoreFailure;
  if (mappingRestoreFailure)
    log$1.error(`boot: failed to restore session mapping: ${mappingRestoreFailure}`);
  if (!agentFailure && !mappingRestoreFailure) return { status: "ran" };
  return {
    status: "failed",
    reason: [
      agentFailure ? `agent run failed: ${agentFailure}` : void 0,
      mappingRestoreFailure ? `mapping restore failed: ${mappingRestoreFailure}` : void 0,
    ]
      .filter((part) => Boolean(part))
      .join("; "),
  };
}
//#endregion
//#region src/hooks/bundled/boot-md/handler.ts
const log = createSubsystemLogger("hooks/boot-md");
/** Gateway-startup hook that runs BOOT.md checks once per unique agent workspace. */
const runBootChecklist = async (event) => {
  if (!isGatewayStartupEvent(event)) return;
  if (!event.context.cfg) return;
  const cfg = event.context.cfg;
  const deps = event.context.deps ?? createDefaultDeps();
  const seenWorkspaces = /* @__PURE__ */ new Set();
  await runStartupTasks({
    tasks: listAgentIds(cfg)
      .map((agentId) => {
        return {
          agentId,
          workspaceDir: resolveAgentWorkspaceDir(cfg, agentId),
        };
      })
      .filter(({ workspaceDir }) => {
        if (seenWorkspaces.has(workspaceDir)) return false;
        seenWorkspaces.add(workspaceDir);
        return true;
      })
      .map(({ agentId, workspaceDir }) => ({
        source: "boot-md",
        agentId,
        workspaceDir,
        run: () =>
          runBootOnce({
            cfg,
            deps,
            workspaceDir,
            agentId,
          }),
      })),
    log,
  });
};
//#endregion
export { runBootChecklist as default };
