import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { n as isRestartEnabled } from "./commands.flags-CxQ7a14j.js";
import { i as GATEWAY_SERVICE_RUNTIME_PID_ENV } from "./constants-obO8goqF.js";
import {
  n as resolveControlPlaneActor,
  t as formatControlPlaneActor,
} from "./control-plane-audit-CN8L3SYx.js";
import "./config-BDv-QbJ6.js";
import { t as extractDeliveryInfo } from "./delivery-info-Du3-Z2RS.js";
import { r as runCommandWithTimeout } from "./exec-CXKmx4dL.js";
import { i as resolveGatewayInstallEntrypoint } from "./gateway-entrypoint-Cmek2XHM.js";
import "./sessions-CEG7v41b.js";
import { u as readConfigFileSnapshot } from "./io-B3ne6NxF.js";
import { t as resolveOpenClawPackageRoot } from "./openclaw-root-DSkQ6e_8.js";
import { r as readPackageVersion } from "./package-json-pCn6I6Ni.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import {
  f as resolveGatewayRestartDeferralTimeoutMs,
  m as scheduleGatewaySigusr1Restart,
} from "./restart-DuVWNzPR.js";
import { t as parseRestartRequestParams } from "./restart-request-Dwzphc2f.js";
import { d as writeRestartSentinel, u as trimLogTail } from "./restart-sentinel-CJp3hEwi.js";
import {
  i as refreshLatestUpdateRestartSentinel,
  n as recordLatestUpdateRestartSentinel,
  t as getLatestUpdateRestartSentinel,
} from "./server-restart-sentinel-BYSMe2ua.js";
import { Fi as validateUpdateRunParams, Ii as validateUpdateStatusParams } from "./src-CIJf1lT0.js";
import { t as resolveStableNodePath } from "./stable-node-path-C86C9Dv2.js";
import { n as detectRespawnSupervisor } from "./supervisor-markers-BnpKGoUs.js";
import {
  i as UPDATE_EFFECTIVE_CHANNEL_ENV,
  l as normalizeUpdateChannel,
} from "./update-channels-CQNa2YMG.js";
import {
  l as buildUpdateRestartSentinelPayload,
  t as CONTROL_PLANE_UPDATE_HANDOFF_STARTED_REASON,
} from "./update-control-plane-sentinel-DS3ELeta.js";
import {
  n as formatManagedServiceUpdateCommand,
  r as startManagedServiceUpdateHandoff,
  t as buildManagedServiceHandoffUnavailableMessage,
} from "./update-managed-service-handoff-B_eGRS-f.js";
import { t as POST_CORE_UPDATE_SOURCE_CONFIG_PATH_ENV } from "./update-post-core-context-CcP9rLhB.js";
import {
  n as resolveUpdateInstallSurface,
  r as runGatewayUpdate,
} from "./update-runner-DMOEFPUe.js";
import { t as assertValidParams } from "./validation-DyMnkiTp.js";
//#region src/infra/update-post-core-finalize.ts
const FINALIZE_PROCESS_TIMEOUT_FLOOR_MS = 30 * 6e4;
const FINALIZE_PROCESS_STEP_BUDGET_MULTIPLIER = 6;
function buildFinalizeEnv(
  baseEnv,
  effectiveChannel,
  compatHostVersion,
  sourceConfigPath,
  serviceRepairPolicy,
) {
  const env = { ...baseEnv };
  delete env.OPENCLAW_SERVICE_MARKER;
  delete env.OPENCLAW_SERVICE_KIND;
  delete env[GATEWAY_SERVICE_RUNTIME_PID_ENV];
  env[UPDATE_EFFECTIVE_CHANNEL_ENV] = effectiveChannel;
  if (compatHostVersion) env.OPENCLAW_COMPATIBILITY_HOST_VERSION = compatHostVersion;
  if (sourceConfigPath) env[POST_CORE_UPDATE_SOURCE_CONFIG_PATH_ENV] = sourceConfigPath;
  if (serviceRepairPolicy) env.OPENCLAW_SERVICE_REPAIR_POLICY = serviceRepairPolicy;
  return env;
}
const defaultFinalizeSpawner = async ({ argv, cwd, timeoutMs, env }) => {
  const res = await runCommandWithTimeout(argv, {
    cwd,
    timeoutMs,
    env,
  });
  return {
    code: res.code,
    ...(res.stderr ? { stderr: res.stderr } : {}),
  };
};
function isGitUpdateNeedingFinalize(result) {
  return (
    result.status === "ok" &&
    result.mode === "git" &&
    typeof result.root === "string" &&
    result.root.length > 0
  );
}
function buildFinalizeArgv(params) {
  const argv = [
    params.nodePath,
    params.entrypoint,
    "update",
    "finalize",
    "--json",
    "--yes",
    "--no-restart",
  ];
  if (typeof params.timeoutMs === "number" && Number.isFinite(params.timeoutMs))
    argv.push("--timeout", String(Math.max(1, Math.ceil(params.timeoutMs / 1e3))));
  return argv;
}
async function runPostCoreFinalizeAfterGatewayUpdate(params) {
  const { result } = params;
  if (!isGitUpdateNeedingFinalize(result))
    return {
      status: "skipped",
      reason: "not-git-update",
    };
  const entrypoint = await (params.resolveEntrypoint ?? resolveGatewayInstallEntrypoint)(
    result.root,
  );
  if (!entrypoint)
    return {
      status: "skipped",
      reason: "entrypoint-missing",
    };
  const spawnFinalize = params.spawnFinalize ?? defaultFinalizeSpawner;
  const perStepTimeoutMs =
    typeof params.timeoutMs === "number" && Number.isFinite(params.timeoutMs)
      ? params.timeoutMs
      : void 0;
  const effectiveChannel = params.channel ?? "dev";
  const argv = buildFinalizeArgv({
    nodePath: await resolveStableNodePath(process.execPath),
    entrypoint,
    ...(perStepTimeoutMs === void 0 ? {} : { timeoutMs: perStepTimeoutMs }),
  });
  const compatHostVersion = result.after?.version ?? void 0;
  const processTimeoutMs = Math.max(
    FINALIZE_PROCESS_TIMEOUT_FLOOR_MS,
    (perStepTimeoutMs ?? 0) * FINALIZE_PROCESS_STEP_BUDGET_MULTIPLIER,
  );
  let sourceConfigDir;
  try {
    let sourceConfigPath;
    if (params.preUpdateConfig) {
      sourceConfigDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-update-post-core-"));
      sourceConfigPath = path.join(sourceConfigDir, "source-config.json");
      await fs.writeFile(sourceConfigPath, `${JSON.stringify(params.preUpdateConfig)}\n`, "utf-8");
    }
    const env = buildFinalizeEnv(
      params.env ?? process.env,
      effectiveChannel,
      compatHostVersion,
      sourceConfigPath,
      params.serviceRepairPolicy,
    );
    const spawnResult = await spawnFinalize({
      argv,
      cwd: path.dirname(entrypoint),
      timeoutMs: processTimeoutMs,
      env,
    });
    if (spawnResult.code === 0)
      return {
        status: "ok",
        entrypoint,
      };
    return {
      status: "error",
      reason: "nonzero-exit",
      entrypoint,
      ...(typeof spawnResult.code === "number" ? { exitCode: spawnResult.code } : {}),
      ...(spawnResult.stderr ? { message: spawnResult.stderr } : {}),
    };
  } catch (err) {
    return {
      status: "error",
      reason: "spawn-failed",
      entrypoint,
      message: err instanceof Error ? err.message : String(err),
    };
  } finally {
    if (sourceConfigDir)
      await fs
        .rm(sourceConfigDir, {
          recursive: true,
          force: true,
        })
        .catch(() => void 0);
  }
}
function foldPostCoreFinalizeIntoResult(result, outcome) {
  if (outcome.status !== "error") return result;
  return {
    ...result,
    status: "error",
    reason: "post-core-plugin-finalize-failed",
    steps: [
      ...result.steps,
      {
        name: "post-core plugin finalize",
        command: "openclaw update finalize",
        cwd: result.root ?? process.cwd(),
        durationMs: 0,
        exitCode: outcome.reason === "nonzero-exit" ? (outcome.exitCode ?? 1) : 1,
        ...(outcome.message ? { stderrTail: trimLogTail(outcome.message) } : {}),
      },
    ],
  };
}
//#endregion
//#region src/gateway/server-methods/update.ts
const MANAGED_HANDOFF_RESTART_DELAY_MS = 2e3;
function formatUpdateRunErrorMessage(err) {
  if (err instanceof Error) return err.message || err.name;
  return String(err);
}
function tryResolveProcessCwd() {
  try {
    return process.cwd();
  } catch {
    return;
  }
}
async function readPreUpdateConfigForPostCoreFinalize() {
  const snapshot = await readConfigFileSnapshot({ skipPluginValidation: true });
  if (!snapshot.valid) return;
  return {
    sourceConfig: snapshot.sourceConfig,
    authoredConfig: isRecord(snapshot.parsed) ? snapshot.parsed : snapshot.sourceConfig,
  };
}
function resolveManagedServiceHandoffRestartDelayMs(restartDelayMs, supervisor) {
  const resolvedDelayMs = restartDelayMs ?? MANAGED_HANDOFF_RESTART_DELAY_MS;
  if (supervisor !== "systemd") return resolvedDelayMs;
  return Math.max(resolvedDelayMs, MANAGED_HANDOFF_RESTART_DELAY_MS);
}
function hasManagedServiceHandoffContext(env, supervisor) {
  if (supervisor === "launchd")
    return Boolean(
      env.OPENCLAW_LAUNCHD_LABEL?.trim() ||
      env.LAUNCH_JOB_LABEL?.trim() ||
      env.LAUNCH_JOB_NAME?.trim() ||
      env.XPC_SERVICE_NAME?.trim(),
    );
  if (supervisor === "systemd") return Boolean(env.OPENCLAW_SYSTEMD_UNIT?.trim());
  if (supervisor === "schtasks")
    return Boolean(
      env.OPENCLAW_WINDOWS_TASK_NAME?.trim() ||
      (env.OPENCLAW_SERVICE_MARKER?.trim() === "openclaw" &&
        env.OPENCLAW_SERVICE_KIND?.trim() === "gateway"),
    );
  return false;
}
const updateHandlers = {
  "update.status": async ({ params, respond, context }) => {
    if (!assertValidParams(params, validateUpdateStatusParams, "update.status", respond)) return;
    let sentinel;
    try {
      sentinel = await refreshLatestUpdateRestartSentinel();
    } catch (err) {
      context?.logGateway?.warn(
        `update.status sentinel refresh failed: ${formatUpdateRunErrorMessage(err)}`,
      );
      sentinel = getLatestUpdateRestartSentinel();
    }
    respond(true, { sentinel });
  },
  "update.run": async ({ params, respond, client, context }) => {
    if (!assertValidParams(params, validateUpdateRunParams, "update.run", respond)) return;
    const actor = resolveControlPlaneActor(client);
    const {
      sessionKey,
      deliveryContext: requestedDeliveryContext,
      threadId: requestedThreadId,
      note,
      continuationMessage,
      restartDelayMs,
    } = parseRestartRequestParams(params);
    const { deliveryContext: sessionDeliveryContext, threadId: sessionThreadId } =
      extractDeliveryInfo(sessionKey);
    const deliveryContext = requestedDeliveryContext ?? sessionDeliveryContext;
    const threadId = requestedThreadId ?? sessionThreadId;
    const timeoutMsRaw = params.timeoutMs;
    const timeoutMs =
      typeof timeoutMsRaw === "number" && Number.isFinite(timeoutMsRaw)
        ? Math.max(1e3, Math.floor(timeoutMsRaw))
        : void 0;
    let result;
    let handoff = null;
    let managedHandoffRestart = null;
    const sentinelMeta = {
      ...(sessionKey ? { sessionKey } : {}),
      ...(deliveryContext ? { deliveryContext } : {}),
      ...(threadId ? { threadId } : {}),
      ...(note !== void 0 ? { note } : {}),
      ...(continuationMessage !== void 0 ? { continuationMessage } : {}),
    };
    try {
      const config = context.getRuntimeConfig();
      const configChannel = normalizeUpdateChannel(config.update?.channel);
      const invocationCwd = tryResolveProcessCwd();
      const root =
        (await resolveOpenClawPackageRoot({
          moduleUrl: import.meta.url,
          argv1: process.argv[1],
          ...(invocationCwd ? { cwd: invocationCwd } : {}),
        })) ??
        invocationCwd ??
        os.homedir();
      const installSurface = await resolveUpdateInstallSurface({
        timeoutMs,
        cwd: root,
        argv1: process.argv[1],
      });
      const supervisor = detectRespawnSupervisor(process.env, process.platform);
      const hasHandoffContext = supervisor
        ? hasManagedServiceHandoffContext(process.env, supervisor)
        : false;
      const requiresManagedServiceHandoff =
        installSurface.kind === "global" || (installSurface.kind === "git" && supervisor !== null);
      if (configChannel === "extended-stable" && installSurface.kind === "git")
        result = {
          status: "error",
          mode: "git",
          root: installSurface.root,
          reason: "unsupported_git_channel",
          steps: [],
          durationMs: 0,
        };
      else if (!isRestartEnabled(config) && !supervisor) {
        const beforeVersion = installSurface.root
          ? await readPackageVersion(installSurface.root)
          : null;
        result = {
          status: "skipped",
          mode: installSurface.mode,
          ...(installSurface.root ? { root: installSurface.root } : {}),
          reason: installSurface.kind === "global" ? "restart-unavailable" : "restart-disabled",
          ...(beforeVersion ? { before: { version: beforeVersion } } : {}),
          steps: [],
          durationMs: 0,
        };
      } else if (requiresManagedServiceHandoff) {
        const handoffChannel = installSurface.kind === "git" ? void 0 : (configChannel ?? void 0);
        const command = formatManagedServiceUpdateCommand({
          timeoutMs,
          ...(handoffChannel ? { channel: handoffChannel } : {}),
        });
        if (supervisor && hasHandoffContext)
          try {
            const beforeVersion = installSurface.root
              ? await readPackageVersion(installSurface.root)
              : null;
            const startedAt = Date.now();
            const handoffId = randomUUID();
            const managedRestartDelayMs = resolveManagedServiceHandoffRestartDelayMs(
              restartDelayMs,
              supervisor,
            );
            sentinelMeta.handoffId = handoffId;
            const started = await startManagedServiceUpdateHandoff({
              root,
              timeoutMs,
              restartDrainTimeoutMs: resolveGatewayRestartDeferralTimeoutMs(
                config.gateway?.reload?.deferralTimeoutMs,
              ),
              ...(handoffChannel ? { channel: handoffChannel } : {}),
              restartDelayMs: managedRestartDelayMs,
              meta: sentinelMeta,
              handoffId,
              supervisor,
            });
            handoff = {
              status: "started",
              ...(started.pid ? { pid: started.pid } : {}),
              command: started.command,
            };
            managedHandoffRestart = scheduleGatewaySigusr1Restart({
              delayMs: managedRestartDelayMs,
              reason: "update.run",
              skipDeferral: true,
              skipCooldown: true,
              audit: {
                actor: actor.actor,
                deviceId: actor.deviceId,
                clientIp: actor.clientIp,
                changedPaths: [],
              },
            });
            result = {
              status: "skipped",
              mode: installSurface.mode,
              root: installSurface.root,
              reason: CONTROL_PLANE_UPDATE_HANDOFF_STARTED_REASON,
              ...(beforeVersion ? { before: { version: beforeVersion } } : {}),
              steps: [
                {
                  name: "managed-service update handoff",
                  command: started.command,
                  cwd: root,
                  durationMs: Date.now() - startedAt,
                  exitCode: null,
                },
              ],
              durationMs: Date.now() - startedAt,
            };
          } catch (err) {
            context?.logGateway?.warn(
              `update.run managed-service handoff failed ${formatControlPlaneActor(actor)} error=${formatUpdateRunErrorMessage(err)}`,
            );
            result = {
              status: "error",
              mode: installSurface.mode,
              root: installSurface.root,
              reason: "managed-service-handoff-failed",
              steps: [],
              durationMs: 0,
            };
          }
        else {
          const beforeVersion = installSurface.root
            ? await readPackageVersion(installSurface.root)
            : null;
          handoff = {
            status: "unavailable",
            command,
            message: buildManagedServiceHandoffUnavailableMessage(command),
          };
          result = {
            status: "skipped",
            mode: installSurface.mode,
            root: installSurface.root,
            reason: "managed-service-handoff-unavailable",
            ...(beforeVersion ? { before: { version: beforeVersion } } : {}),
            steps: [],
            durationMs: 0,
          };
        }
      } else {
        const preUpdateConfig =
          installSurface.kind === "git"
            ? await readPreUpdateConfigForPostCoreFinalize().catch((err) => {
                context?.logGateway?.warn(
                  `update.run could not capture pre-update config ${formatControlPlaneActor(actor)} error=${formatUpdateRunErrorMessage(err)}`,
                );
              })
            : void 0;
        result = await runGatewayUpdate({
          timeoutMs,
          cwd: root,
          argv1: process.argv[1],
          channel: configChannel ?? void 0,
          allowGatewayServiceRepair: false,
          allowGatewayActivation: false,
        });
        const finalizeOutcome = await runPostCoreFinalizeAfterGatewayUpdate({
          result,
          channel: configChannel ?? void 0,
          serviceRepairPolicy: "external",
          ...(timeoutMs === void 0 ? {} : { timeoutMs }),
          ...(preUpdateConfig ? { preUpdateConfig } : {}),
        });
        if (finalizeOutcome.status === "error")
          context?.logGateway?.warn(
            `update.run post-core plugin finalize failed ${formatControlPlaneActor(actor)} reason=${finalizeOutcome.reason}`,
          );
        result = foldPostCoreFinalizeIntoResult(result, finalizeOutcome);
      }
    } catch {
      result = {
        status: "error",
        mode: "unknown",
        reason: "unexpected-error",
        steps: [],
        durationMs: 0,
      };
    }
    const payload = buildUpdateRestartSentinelPayload({
      result,
      meta: sentinelMeta,
    });
    let sentinelPersisted;
    try {
      await writeRestartSentinel(payload);
      sentinelPersisted = true;
      recordLatestUpdateRestartSentinel(payload);
    } catch {
      sentinelPersisted = false;
    }
    const updateWasPackageSwap = result.status === "ok" && result.mode !== "git";
    const restart =
      managedHandoffRestart ??
      (result.status === "ok"
        ? scheduleGatewaySigusr1Restart({
            delayMs: updateWasPackageSwap ? 0 : restartDelayMs,
            reason: "update.run",
            skipDeferral: updateWasPackageSwap,
            skipCooldown: updateWasPackageSwap,
            audit: {
              actor: actor.actor,
              deviceId: actor.deviceId,
              clientIp: actor.clientIp,
              changedPaths: [],
            },
          })
        : null);
    context?.logGateway?.info(
      `update.run completed ${formatControlPlaneActor(actor)} changedPaths=<n/a> restartReason=update.run status=${result.status}`,
    );
    if (restart?.coalesced)
      context?.logGateway?.warn(
        `update.run restart coalesced ${formatControlPlaneActor(actor)} delayMs=${restart.delayMs}`,
      );
    respond(
      true,
      {
        ok: result.status === "ok" || handoff?.status === "started",
        result,
        ...(handoff ? { handoff } : {}),
        restart,
        sentinel: {
          persisted: sentinelPersisted,
          payload,
        },
      },
      void 0,
    );
  },
};
//#endregion
export { updateHandlers };
