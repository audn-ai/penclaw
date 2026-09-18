import { t as collectConfiguredAgentHarnessRuntimes } from "./harness-runtimes-Bweud8_5.js";
import { i as asOptionalRecord } from "./record-coerce-DHZ4bFlT.js";
//#region src/commands/doctor/shared/configured-runtime-plugin-installs.ts
const CONFIGURED_RUNTIME_PLUGIN_INSTALL_CANDIDATES = [
  {
    pluginId: "acpx",
    label: "ACPX Runtime",
    npmSpec: "@openclaw/acpx",
    trustedSourceLinkedOfficialInstall: true,
  },
  {
    pluginId: "codex",
    label: "Codex",
    npmSpec: "@openclaw/codex",
    trustedSourceLinkedOfficialInstall: true,
  },
];
/** Resolve the official install candidate for a configured runtime id. */
function resolveConfiguredRuntimePluginInstallCandidate(runtimeId) {
  return CONFIGURED_RUNTIME_PLUGIN_INSTALL_CANDIDATES.find(
    (candidate) => candidate.pluginId === runtimeId,
  );
}
function acpxRuntimeIsConfigured(cfg) {
  const acp = asOptionalRecord(cfg.acp);
  const backend = typeof acp?.backend === "string" ? acp.backend.trim().toLowerCase() : "";
  return (
    (backend === "acpx" ||
      acp?.enabled === true ||
      asOptionalRecord(acp?.dispatch)?.enabled === true) &&
    (!backend || backend === "acpx")
  );
}
/** Collect runtime plugin ids implied by configured harness runtimes and ACPX settings. */
function collectConfiguredRuntimePluginIds(cfg, options) {
  const ids = new Set(collectConfiguredAgentHarnessRuntimes(cfg, options));
  if (acpxRuntimeIsConfigured(cfg)) ids.add("acpx");
  return [...ids].toSorted((left, right) => left.localeCompare(right));
}
//#endregion
export {
  collectConfiguredRuntimePluginIds as n,
  resolveConfiguredRuntimePluginInstallCandidate as r,
  CONFIGURED_RUNTIME_PLUGIN_INSTALL_CANDIDATES as t,
};
