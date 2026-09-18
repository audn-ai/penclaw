import fs from "node:fs/promises";
import path from "node:path";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import {
  i as isServiceRepairExternallyManaged,
  t as EXTERNAL_SERVICE_REPAIR_NOTE,
} from "./doctor-service-repair-policy-D0NFzdqc.js";
import { n as isTruthyEnvValue } from "./env-Di-LcxqW.js";
import { r as runCommandWithTimeout } from "./exec-CXKmx4dL.js";
import { t as note } from "./note-Uvqr4R1d.js";
import { t as createUpdateProgress } from "./progress-Dhq6LZEY.js";
import { a as resolveGatewayService, i as readGatewayServiceState } from "./service-Dw37Ek79.js";
import { t as summarizeGatewayServiceLayout } from "./service-layout-Djhk2cQN.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { r as runGatewayUpdate } from "./update-runner-DMOEFPUe.js";
//#region src/commands/doctor-update.ts
/** Optional pre-doctor update prompt for source checkouts and package installs. */
async function resolveComparablePath(target) {
  return await fs.realpath(target).catch(() => path.resolve(target));
}
async function detectOpenClawGitCheckout(root) {
  const res = await runCommandWithTimeout(["git", "-C", root, "rev-parse", "--show-toplevel"], {
    timeoutMs: 5e3,
  }).catch(() => null);
  if (!res) return "unknown";
  if (res.code !== 0) {
    if (normalizeLowercaseStringOrEmpty(res.stderr).includes("not a git repository"))
      return "not-git";
    return "unknown";
  }
  return (await resolveComparablePath(res.stdout.trim())) === (await resolveComparablePath(root))
    ? "git"
    : "not-git";
}
const NO_GATEWAY_SERVICE_UPDATE = {
  allowGatewayServiceRepair: false,
  allowGatewayActivation: false,
};
async function inspectGatewayServiceForUpdate(root) {
  if (isServiceRepairExternallyManaged()) return NO_GATEWAY_SERVICE_UPDATE;
  try {
    const service = resolveGatewayService();
    const state = await readGatewayServiceState(service, { env: process.env });
    if (!state.installed) return NO_GATEWAY_SERVICE_UPDATE;
    const layout = await summarizeGatewayServiceLayout(state.command);
    const serviceRoot = layout?.packageRootReal ?? layout?.packageRoot;
    const serviceEntrypoint = layout?.entrypoint;
    if (
      !serviceRoot ||
      !serviceEntrypoint ||
      (!path.isAbsolute(serviceEntrypoint) && !path.win32.isAbsolute(serviceEntrypoint))
    )
      return NO_GATEWAY_SERVICE_UPDATE;
    const [serviceRootReal, updateRootReal] = await Promise.all([
      resolveComparablePath(serviceRoot),
      resolveComparablePath(root),
    ]);
    if (serviceRootReal !== updateRootReal) return NO_GATEWAY_SERVICE_UPDATE;
    return {
      allowGatewayServiceRepair: true,
      allowGatewayActivation: state.running,
      service,
      state,
    };
  } catch {
    return NO_GATEWAY_SERVICE_UPDATE;
  }
}
async function restartRunningGatewayServiceAfterUpdate(runtime, root, wasOwnedAndRunning) {
  if (isServiceRepairExternallyManaged()) {
    note(EXTERNAL_SERVICE_REPAIR_NOTE, "Update");
    return true;
  }
  if (!wasOwnedAndRunning) return true;
  const inspection = await inspectGatewayServiceForUpdate(root);
  if (!inspection.allowGatewayServiceRepair || !inspection.service || !inspection.state)
    return true;
  try {
    await inspection.service.restart({
      env: inspection.state.env,
      stdout: process.stdout,
    });
    note("Restarted the running gateway service after updating OpenClaw.", "Update");
    return true;
  } catch (err) {
    runtime.error(`Update completed, but gateway service restart failed: ${String(err)}`);
    return false;
  }
}
/** Offers to update OpenClaw before doctor when running interactively from an updatable install. */
async function maybeOfferUpdateBeforeDoctor(params) {
  if (
    !(
      !isTruthyEnvValue(process.env.OPENCLAW_UPDATE_IN_PROGRESS) &&
      params.options.nonInteractive !== true &&
      params.options.yes !== true &&
      params.options.repair !== true &&
      process.stdin.isTTY
    ) ||
    !params.root
  )
    return { updated: false };
  const git = await detectOpenClawGitCheckout(params.root);
  if (git === "git") {
    if (
      !(await params.confirm({
        message: "Update OpenClaw from git before running doctor?",
        initialValue: true,
      }))
    )
      return { updated: false };
    note("Running update…", "Update");
    const serviceInspection = await inspectGatewayServiceForUpdate(params.root);
    const serviceUpdatePolicy = {
      allowGatewayServiceRepair: serviceInspection.allowGatewayServiceRepair,
      allowGatewayActivation: serviceInspection.allowGatewayActivation,
    };
    const { progress, stop } = createUpdateProgress(process.stdout.isTTY);
    let result;
    try {
      result = await runGatewayUpdate({
        cwd: params.root,
        argv1: process.argv[1],
        progress,
        ...serviceUpdatePolicy,
      });
    } finally {
      stop();
    }
    note(
      [
        `Status: ${result.status}`,
        `Mode: ${result.mode}`,
        result.root ? `Root: ${result.root}` : null,
        result.reason ? `Reason: ${result.reason}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
      "Update result",
    );
    if (result.status === "ok") {
      if (
        !(await restartRunningGatewayServiceAfterUpdate(
          params.runtime,
          params.root,
          serviceUpdatePolicy.allowGatewayActivation,
        ))
      ) {
        params.outro("Update completed, but gateway service restart failed.");
        params.runtime.exit(1);
        return {
          updated: true,
          handled: true,
        };
      }
      params.outro("Update completed (doctor already ran as part of the update).");
      return {
        updated: true,
        handled: true,
      };
    }
    return {
      updated: true,
      handled: false,
    };
  }
  if (git === "not-git")
    note(
      [
        "This install is not a git checkout.",
        `Run \`${formatCliCommand("openclaw update")}\` to update via your package manager (npm/pnpm), then rerun doctor.`,
      ].join("\n"),
      "Update",
    );
  return { updated: false };
}
//#endregion
export { maybeOfferUpdateBeforeDoctor };
