import {
  n as normalizeCompatibilityConfig,
  t as legacyConfigRules,
} from "./doctor-contract-BGpUCkwm.js";
import {
  n as formatPluginInstallPathIssue,
  t as detectPluginInstallPathIssue,
} from "./plugin-install-path-warnings-Duku8fVw.js";
import "./runtime-doctor-DOtJb07X.js";
import { o as removePluginFromConfig } from "./uninstall-gwewgRmX.js";
//#region extensions/matrix/src/doctor.ts
async function collectMatrixInstallPathWarnings(cfg) {
  const issue = await detectPluginInstallPathIssue({
    pluginId: "matrix",
    install: cfg.plugins?.installs?.matrix,
  });
  if (!issue) return [];
  return formatPluginInstallPathIssue({
    issue,
    pluginLabel: "Matrix",
    defaultInstallCommand: "openclaw plugins install @openclaw/matrix",
  }).map((entry) => `- ${entry}`);
}
async function cleanStaleMatrixPluginConfig(cfg) {
  const issue = await detectPluginInstallPathIssue({
    pluginId: "matrix",
    install: cfg.plugins?.installs?.matrix,
  });
  if (!issue || issue.kind !== "missing-path")
    return {
      config: cfg,
      changes: [],
    };
  const { config, actions } = removePluginFromConfig(cfg, "matrix");
  const removed = [];
  if (actions.install) removed.push("install record");
  if (actions.loadPath) removed.push("load path");
  if (actions.entry) removed.push("plugin entry");
  if (actions.allowlist) removed.push("allowlist entry");
  if (removed.length === 0)
    return {
      config: cfg,
      changes: [],
    };
  return {
    config,
    changes: [
      `Removed stale Matrix plugin references (${removed.join(", ")}). The previous install path no longer exists: ${issue.path}`,
    ],
  };
}
async function runMatrixDoctorSequence(params) {
  const warningNotes = [];
  const installWarnings = await collectMatrixInstallPathWarnings(params.cfg);
  if (installWarnings.length > 0) warningNotes.push(installWarnings.join("\n"));
  return {
    changeNotes: [],
    warningNotes,
  };
}
const matrixDoctor = {
  dmAllowFromMode: "nestedOnly",
  groupModel: "sender",
  groupAllowFromFallbackToAllowFrom: false,
  warnOnEmptyGroupSenderAllowlist: true,
  legacyConfigRules,
  normalizeCompatibilityConfig,
  runConfigSequence: async ({ cfg, env, shouldRepair }) =>
    await runMatrixDoctorSequence({
      cfg,
      env,
      shouldRepair,
    }),
  cleanStaleConfig: async ({ cfg }) => await cleanStaleMatrixPluginConfig(cfg),
};
//#endregion
export {
  cleanStaleMatrixPluginConfig,
  collectMatrixInstallPathWarnings,
  matrixDoctor,
  runMatrixDoctorSequence,
};
