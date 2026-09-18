import { existsSync } from "node:fs";
import "./utils-DtcDeqWS.js";
import path from "node:path";
import "./installed-plugin-index-records-BP7rp3ti.js";
import { n as enablePluginInConfig } from "./enable-DK_lFguo.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { t as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-D7CXgzhH.js";
//#region src/commands/runtime-plugin-install.ts
/**
 * Runtime plugin install helpers for model selection.
 *
 * Model choices can require runtime plugins such as Codex or Copilot; this
 * module installs, enables, or repairs those plugins from a shared descriptor.
 */
function isInstalledRecordPresentOnDisk(record, env) {
  const installPath = record?.installPath?.trim();
  if (!installPath) return false;
  return existsSync(path.join(resolveUserPath(installPath, env), "package.json"));
}
/** Ensures the runtime plugin required by the selected model is installed and enabled. */
async function ensureRuntimePluginForModelSelection(params) {
  if (
    !params.shouldEnsure({
      cfg: params.cfg,
      model: params.model,
      agentId: params.agentId,
    })
  )
    return {
      cfg: params.cfg,
      required: false,
      installed: false,
    };
  if (
    isInstalledRecordPresentOnDisk(
      (await loadInstalledPluginIndexInstallRecords({ env: process.env }))[
        params.descriptor.pluginId
      ],
      process.env,
    )
  ) {
    const repair = await repairRuntimePluginInstallForModelSelection({
      cfg: params.cfg,
      model: params.model,
      agentId: params.agentId,
      env: process.env,
      descriptor: params.descriptor,
      shouldEnsure: params.shouldEnsure,
    });
    for (const change of repair.changes) params.runtime.log?.(change);
    for (const warning of repair.warnings)
      params.runtime.log?.(`${params.descriptor.warningLabel} update warning: ${warning}`);
    const enableResult = enablePluginInConfig(params.cfg, params.descriptor.pluginId);
    return {
      cfg: enableResult.config,
      required: true,
      installed: enableResult.enabled,
      status: enableResult.enabled ? "installed" : "failed",
      ...(enableResult.reason ? { reason: enableResult.reason } : {}),
    };
  }
  const { ensureOnboardingPluginInstalled } =
    await import("./onboarding-plugin-install-DCRPcBnf.js");
  const result = await ensureOnboardingPluginInstalled({
    cfg: params.cfg,
    entry: {
      pluginId: params.descriptor.pluginId,
      label: params.descriptor.label,
      install: {
        npmSpec: params.descriptor.npmSpec,
        defaultChoice: "npm",
      },
      trustedSourceLinkedOfficialInstall: true,
    },
    prompter: params.prompter,
    runtime: params.runtime,
    ...(params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {}),
    promptInstall: false,
    autoConfirmSingleSource: true,
  });
  return {
    cfg: result.cfg,
    required: true,
    installed: result.installed,
    status: result.status,
    ...(result.error ? { reason: result.error } : {}),
  };
}
/** Repairs missing install records for runtime plugins required by model selection. */
async function repairRuntimePluginInstallForModelSelection(params) {
  if (
    !params.shouldEnsure({
      cfg: params.cfg,
      model: params.model,
      agentId: params.agentId,
    })
  )
    return {
      required: false,
      changes: [],
      warnings: [],
    };
  const { repairMissingPluginInstallsForIds } =
    await import("./missing-configured-plugin-install-D0_ND_6e.js");
  const result = await repairMissingPluginInstallsForIds({
    cfg: params.cfg,
    pluginIds: [params.descriptor.pluginId],
    ...(params.env !== void 0 ? { env: params.env } : {}),
  });
  return {
    required: true,
    changes: result.changes,
    warnings: [...result.warnings, ...(result.notices ?? [])],
  };
}
/** Creates ensure/repair helpers pre-bound to a runtime plugin descriptor. */
function createRuntimePluginModelSelectionHelpers(params) {
  return {
    ensure: (ensureParams) =>
      ensureRuntimePluginForModelSelection({
        ...ensureParams,
        descriptor: params.descriptor,
        shouldEnsure: params.shouldEnsure,
      }),
    repair: (repairParams) =>
      repairRuntimePluginInstallForModelSelection({
        ...repairParams,
        descriptor: params.descriptor,
        shouldEnsure: params.shouldEnsure,
      }),
  };
}
//#endregion
export { createRuntimePluginModelSelectionHelpers as t };
