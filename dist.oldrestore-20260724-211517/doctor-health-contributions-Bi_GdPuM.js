import fs from "node:fs";
import path from "node:path";
import { t as normalizeHealthCheck } from "./health-check-adapter-N54q7s7x.js";
import { m as resolveIsNixMode } from "./paths-DEklnbzU.js";
import { l as isLegacyParentWritableUpdateDoctorPass } from "./update-phase-RYqcMEby.js";
//#region src/flows/doctor-health-contributions.ts
const loadAgentDefaultsModule = async () => await import("./defaults-RjT9WtG0.js");
const loadAgentScopeModule = async () => await import("./agent-scope-DfhU1PO5.js");
const loadCommandFormatModule = async () => await import("./command-format-CXDS0zKO.js");
const loadConfigModule = async () => await import("./config/config.js");
const loadDoctorCoreChecksModule = async () => await import("./doctor-core-checks-DmtnTWa-.js");
const loadDoctorStateIntegrityModule = async () =>
  await import("./doctor-state-integrity-ssAKnITK.js");
const loadHealthCheckRegistryModule = async () =>
  await import("./health-check-registry-BzU8tXic.js");
const loadModelCatalogModule = async () => await import("./model-catalog-CKXmb4DJ.js");
const loadModelSelectionModule = async () => await import("./model-selection-Dc7njIe_.js");
const loadNoteModule = async () => await import("./terminal-core/note.js");
const loadOnboardHelpersModule = async () => await import("./onboard-helpers-LaeM9LZm.js");
const loadSecretTypesModule = async () => await import("./types.secrets-Cuw-Yrgp.js");
function isUpdateDoctorRun(env) {
  const value = env.OPENCLAW_UPDATE_IN_PROGRESS;
  return value === "1" || value === "true";
}
function resolveDoctorMode(cfg) {
  return cfg.gateway?.mode === "remote" ? "remote" : "local";
}
function isTruthyEnvValue(value) {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized !== "" && normalized !== "0" && normalized !== "false" && normalized !== "no";
}
function shouldSkipLegacyUpdateDoctorConfigWrite(params) {
  if (!isTruthyEnvValue(params.env.OPENCLAW_UPDATE_IN_PROGRESS)) return false;
  if (isTruthyEnvValue(params.env["OPENCLAW_UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE"]))
    return false;
  return true;
}
function createDoctorHealthContribution(params) {
  const healthChecks = normalizeHealthChecks({
    contributionId: params.id,
    healthChecks: params.healthChecks,
  });
  const healthCheckIds = params.healthCheckIds ?? healthChecks.map((check) => check.id);
  if (params.run === void 0 && healthChecks.length === 0)
    throw new Error(`doctor contribution ${params.id} must define run or healthChecks`);
  return {
    id: params.id,
    kind: "core",
    surface: "health",
    option: {
      value: params.id,
      label: params.label,
      ...(params.hint ? { hint: params.hint } : {}),
    },
    source: "doctor",
    healthChecks,
    healthCheckIds,
    run:
      params.run ??
      ((ctx) =>
        runStructuredDoctorHealthContribution({
          contributionId: params.id,
          ctx,
          checks: healthChecks,
        })),
  };
}
function normalizeHealthChecks(params) {
  if (params.healthChecks === void 0) return [];
  const checks = Array.isArray(params.healthChecks) ? params.healthChecks : [params.healthChecks];
  return checks.map((check) =>
    normalizeContributionHealthCheck({
      check,
      contributionId: params.contributionId,
      count: checks.length,
    }),
  );
}
function normalizeContributionHealthCheck(params) {
  const id =
    params.check.id ??
    (params.count === 1 ? deriveCoreHealthCheckId(params.contributionId) : void 0);
  if (id === void 0)
    throw new Error(
      `doctor contribution ${params.contributionId} must specify health check ids when it declares multiple healthChecks`,
    );
  return {
    ...params.check,
    id,
    kind: params.check.kind ?? "core",
    source: params.check.source ?? "doctor",
  };
}
function deriveCoreHealthCheckId(contributionId) {
  if (contributionId.startsWith("doctor:")) return `core/doctor/${contributionId.slice(7)}`;
  return `core/doctor/${contributionId}`;
}
async function runStructuredDoctorHealthContribution(params) {
  if (params.checks.length === 0)
    throw new Error(`doctor contribution ${params.contributionId} has no structured health`);
  const { runDoctorHealthRepairs } = await import("./doctor-repair-flow-CvT2yVsm.js");
  const { resolveAgentWorkspaceDir, resolveDefaultAgentId } =
    await import("./agent-scope-DfhU1PO5.js");
  const workspaceDir = resolveAgentWorkspaceDir(
    params.ctx.cfg,
    resolveDefaultAgentId(params.ctx.cfg),
  );
  const result = await runDoctorHealthRepairs(
    {
      mode: "fix",
      runtime: params.ctx.runtime,
      cfg: params.ctx.cfg,
      cwd: workspaceDir,
      configPath: params.ctx.configPath,
      dryRun: !params.ctx.prompter.shouldRepair,
      allowExecSecretRefs: params.ctx.options.allowExec === true,
    },
    {
      checks: params.checks,
      dryRun: !params.ctx.prompter.shouldRepair,
    },
  );
  params.ctx.cfg = result.config;
  renderStructuredHealthFindings(params.ctx, result.findings);
  for (const warning of result.warnings) params.ctx.runtime.error(warning);
  for (const change of result.changes) params.ctx.runtime.log(change);
}
function renderStructuredHealthFindings(ctx, findings) {
  for (const finding of findings) {
    (finding.severity === "error" ? ctx.runtime.error : ctx.runtime.log)(
      formatStructuredHealthFinding(finding),
    );
    if (finding.fixHint !== void 0) ctx.runtime.log(`  fix: ${finding.fixHint}`);
  }
}
function formatStructuredHealthFinding(finding) {
  const where = finding.path !== void 0 ? ` ${finding.path}` : "";
  const line = finding.line !== void 0 ? `:${finding.line}` : "";
  return `[${finding.severity}] ${finding.checkId}${where}${line} - ${finding.message}`;
}
async function runGatewayConfigHealth(ctx) {
  const { formatCliCommand } = await loadCommandFormatModule();
  const { hasAmbiguousGatewayAuthModeConfig } = await import("./auth-mode-policy-Cp5nid-3.js");
  const { note } = await loadNoteModule();
  if (!ctx.cfg.gateway?.mode) {
    const lines = [
      "gateway.mode is unset; gateway start will be blocked.",
      `Fix: run ${formatCliCommand("openclaw configure")} and set Gateway mode (local/remote).`,
      `Or set directly: ${formatCliCommand("openclaw config set gateway.mode local")}`,
    ];
    if (!fs.existsSync(ctx.configPath))
      lines.push(`Missing config: run ${formatCliCommand("openclaw setup")} first.`);
    note(lines.join("\n"), "Gateway");
  }
  if (resolveDoctorMode(ctx.cfg) === "local" && hasAmbiguousGatewayAuthModeConfig(ctx.cfg))
    note(
      [
        "gateway.auth.token and gateway.auth.password are both configured while gateway.auth.mode is unset.",
        "Set an explicit mode to avoid ambiguous auth selection and startup/runtime failures.",
        `Set token mode: ${formatCliCommand("openclaw config set gateway.auth.mode token")}`,
        `Set password mode: ${formatCliCommand("openclaw config set gateway.auth.mode password")}`,
      ].join("\n"),
      "Gateway auth",
    );
}
async function runAuthProfileHealth(ctx) {
  const { maybeRepairLegacyFlatAuthProfileStores, maybeRepairCanonicalApiKeyFieldAlias } =
    await import("./doctor-auth-flat-profiles-wonS6jA1.js");
  const { maybeRepairLegacyOAuthProfileIds } =
    await import("./doctor-auth-legacy-oauth-CCJ9hRZT.js");
  const { maybeRepairLegacyOAuthSidecarProfiles } =
    await import("./doctor-auth-oauth-sidecar-BICipRVq.js");
  const { noteAuthProfileHealth, noteLegacyCodexProviderOverride } =
    await import("./doctor-auth-BZ_YWo2v.js");
  const { buildGatewayConnectionDetails } = await import("./call-BtFiTrFI.js");
  const { note } = await loadNoteModule();
  await maybeRepairLegacyFlatAuthProfileStores({
    cfg: ctx.cfg,
    prompter: ctx.prompter,
  });
  await maybeRepairCanonicalApiKeyFieldAlias({
    cfg: ctx.cfg,
    prompter: ctx.prompter,
  });
  await maybeRepairLegacyOAuthSidecarProfiles({
    cfg: ctx.cfg,
    prompter: ctx.prompter,
  });
  ctx.cfg = await maybeRepairLegacyOAuthProfileIds(ctx.cfg, ctx.prompter);
  await noteAuthProfileHealth({
    cfg: ctx.cfg,
    prompter: ctx.prompter,
    allowKeychainPrompt: ctx.options.nonInteractive !== true && process.stdin.isTTY,
  });
  noteLegacyCodexProviderOverride(ctx.cfg);
  ctx.gatewayDetails = buildGatewayConnectionDetails({ config: ctx.cfg });
  if (ctx.gatewayDetails.remoteFallbackNote) note(ctx.gatewayDetails.remoteFallbackNote, "Gateway");
}
async function runGatewayAuthHealth(ctx) {
  const { resolveSecretInputRef } = await loadSecretTypesModule();
  const { buildGatewayTokenSecretRefFixHint, buildGatewayTokenSecretRefUnavailableMessage } =
    await loadDoctorCoreChecksModule();
  const { resolveGatewayAuth } = await import("./auth-C_KHiNe6.js");
  const { resolveGatewayAuthToken } = await import("./auth-token-resolution-D3aKVo8a.js");
  const { note } = await loadNoteModule();
  const { randomToken } = await loadOnboardHelpersModule();
  if (resolveDoctorMode(ctx.cfg) !== "local" || !ctx.sourceConfigValid) return;
  const gatewayTokenRef = resolveSecretInputRef({
    value: ctx.cfg.gateway?.auth?.token,
    defaults: ctx.cfg.secrets?.defaults,
  }).ref;
  const auth = resolveGatewayAuth({
    authConfig: ctx.cfg.gateway?.auth,
    tailscaleMode: ctx.cfg.gateway?.tailscale?.mode ?? "off",
  });
  const hasInlineToken = typeof auth.token === "string" && auth.token.trim() !== "";
  if (
    !(
      auth.mode !== "password" &&
      auth.mode !== "none" &&
      auth.mode !== "trusted-proxy" &&
      (auth.mode !== "token" || !hasInlineToken || Boolean(gatewayTokenRef))
    )
  )
    return;
  let unresolvedRefReason;
  if (gatewayTokenRef && gatewayTokenRef.source === "exec") {
    const { getSkippedExecRefStaticError } = await import("./exec-resolution-policy-Bb21EeoL.js");
    if (
      getSkippedExecRefStaticError({
        ref: gatewayTokenRef,
        config: ctx.cfg,
      })
    )
      unresolvedRefReason = void 0;
    else if (ctx.options.allowExec !== true) return;
    else {
      const resolvedToken = await resolveGatewayAuthToken({
        cfg: ctx.cfg,
        env: ctx.env ?? process.env,
        unresolvedReasonStyle: "detailed",
        envFallback: "never",
      });
      if (resolvedToken.source === "secretRef") return;
      unresolvedRefReason = resolvedToken.unresolvedRefReason;
    }
  } else {
    const resolvedToken = await resolveGatewayAuthToken({
      cfg: ctx.cfg,
      env: ctx.env ?? process.env,
      unresolvedReasonStyle: "detailed",
      envFallback: gatewayTokenRef ? "never" : "always",
    });
    if (gatewayTokenRef ? resolvedToken.source === "secretRef" : resolvedToken.token) return;
    unresolvedRefReason = resolvedToken.unresolvedRefReason;
  }
  if (gatewayTokenRef) {
    note(
      [
        buildGatewayTokenSecretRefUnavailableMessage({
          cfg: ctx.cfg,
          ref: gatewayTokenRef,
          unresolvedRefReason,
        }),
        "Doctor will not overwrite gateway.auth.token with a plaintext value.",
        buildGatewayTokenSecretRefFixHint(gatewayTokenRef),
      ].join("\n"),
      "Gateway auth",
    );
    return;
  }
  note(
    "Gateway auth is off or missing a token. Token auth is now the recommended default (including loopback).",
    "Gateway auth",
  );
  if (
    !(ctx.options.generateGatewayToken === true
      ? true
      : ctx.options.nonInteractive === true
        ? false
        : await ctx.prompter.confirmAutoFix({
            message: "Generate and configure a gateway token now?",
            initialValue: true,
          }))
  )
    return;
  const nextToken = randomToken();
  ctx.cfg = {
    ...ctx.cfg,
    gateway: {
      ...ctx.cfg.gateway,
      auth: {
        ...ctx.cfg.gateway?.auth,
        mode: "token",
        token: nextToken,
      },
    },
  };
  note("Gateway token configured.", "Gateway auth");
}
async function runCommandOwnerHealth(ctx) {
  const { noteCommandOwnerHealth } = await import("./doctor-command-owner-DxwFqqEI.js");
  noteCommandOwnerHealth(ctx.cfg);
}
async function runStructuredHealthRepairs(ctx) {
  if (!ctx.prompter.shouldRepair) return;
  const { registerBundledHealthChecks } = await import("./bundled-health-checks-DgRldFv-.js");
  const { listExtensionHealthChecksForDoctor } = await loadHealthCheckRegistryModule();
  const { runDoctorHealthRepairs } = await import("./doctor-repair-flow-CvT2yVsm.js");
  const { resolveAgentWorkspaceDir, resolveDefaultAgentId } = await loadAgentScopeModule();
  const { note } = await loadNoteModule();
  const workspaceDir = resolveAgentWorkspaceDir(ctx.cfg, resolveDefaultAgentId(ctx.cfg));
  registerBundledHealthChecks({
    cfg: ctx.cfg,
    cwd: workspaceDir,
  });
  const checks = listExtensionHealthChecksForDoctor(await resolveDoctorContributionHealthChecks());
  const result = await runDoctorHealthRepairs(
    {
      mode: "fix",
      runtime: ctx.runtime,
      cfg: ctx.cfg,
      cwd: workspaceDir,
      configPath: ctx.configPath,
    },
    { checks },
  );
  ctx.cfg = result.config;
  if (result.changes.length > 0) note(result.changes.join("\n"), "Doctor changes");
  if (result.warnings.length > 0) note(result.warnings.join("\n"), "Doctor warnings");
}
async function runClaudeCliHealth(ctx) {
  const { noteClaudeCliHealth } = await import("./doctor-claude-cli-DTDM5QtI.js");
  noteClaudeCliHealth(ctx.cfg);
}
async function runCoreContributionHealthRepair(ctx, checkIds) {
  if (!ctx.prompter.shouldRepair || checkIds.length === 0) return;
  const { CORE_HEALTH_CHECKS } = await import("./doctor-core-checks-DmtnTWa-.js");
  const { runDoctorHealthRepairs } = await import("./doctor-repair-flow-CvT2yVsm.js");
  const { resolveAgentWorkspaceDir, resolveDefaultAgentId } =
    await import("./agent-scope-DfhU1PO5.js");
  const { note } = await import("./terminal-core/note.js");
  const selectedIds = new Set(checkIds);
  const checks = CORE_HEALTH_CHECKS.filter((check) => selectedIds.has(check.id));
  if (checks.length === 0) return;
  const workspaceDir = resolveAgentWorkspaceDir(ctx.cfg, resolveDefaultAgentId(ctx.cfg));
  const result = await runDoctorHealthRepairs(
    {
      mode: "fix",
      runtime: ctx.runtime,
      cfg: ctx.cfg,
      cwd: workspaceDir,
      configPath: ctx.configPath,
    },
    { checks },
  );
  ctx.cfg = result.config;
  if (result.changes.length > 0) note(result.changes.join("\n"), "Doctor changes");
  if (result.warnings.length > 0) note(result.warnings.join("\n"), "Doctor warnings");
}
async function runLegacyStateHealth(ctx) {
  const { detectLegacyStateMigrations, runLegacyStateMigrations } =
    await import("./doctor-state-migrations-Cuhh0aLt.js");
  const { note } = await loadNoteModule();
  const operatorCanApproveCrossStateDirImports =
    ctx.prompter.repairMode.canPrompt || ctx.prompter.shouldRepair;
  const legacyState = await detectLegacyStateMigrations({
    cfg: ctx.cfg,
    crossStateDirImports:
      ctx.options.crossStateDirImports === true && operatorCanApproveCrossStateDirImports,
  });
  if (legacyState.warnings.length > 0) note(legacyState.warnings.join("\n"), "Doctor warnings");
  if (legacyState.notices.length > 0) note(legacyState.notices.join("\n"), "Doctor notices");
  if (legacyState.preview.length === 0) return;
  note(legacyState.preview.join("\n"), "Legacy state detected");
  if (
    !(ctx.options.nonInteractive === true
      ? true
      : await ctx.prompter.confirm({
          message: "Migrate legacy state (sessions/agent/WhatsApp auth) now?",
          initialValue: true,
        }))
  )
    return;
  const migrated = await runLegacyStateMigrations({
    detected: legacyState,
    config: ctx.cfg,
    recoverCorruptTargetStore: ctx.options.repair === true || ctx.options.yes === true,
  });
  if (migrated.changes.length > 0) note(migrated.changes.join("\n"), "Doctor changes");
  const notices = migrated.notices ?? [];
  if (notices.length > 0) note(notices.join("\n"), "Doctor notices");
  if (migrated.warnings.length > 0) note(migrated.warnings.join("\n"), "Doctor warnings");
}
async function runLegacyPluginManifestHealth(ctx) {
  const { maybeRepairLegacyPluginManifestContracts } =
    await import("./doctor-plugin-manifests-DQ1zTC0m.js");
  await maybeRepairLegacyPluginManifestContracts({
    config: ctx.cfg,
    env: process.env,
    runtime: ctx.runtime,
    prompter: ctx.prompter,
  });
}
async function runPluginRegistryHealth(ctx) {
  const { maybeRepairPluginRegistryState } = await import("./doctor-plugin-registry-Ukvz7ijG.js");
  ctx.cfg = await maybeRepairPluginRegistryState({
    config: ctx.cfg,
    env: process.env,
    prompter: ctx.prompter,
  });
}
async function runReleaseConfiguredPluginInstallsHealth(ctx) {
  if (!ctx.sourceConfigValid) return;
  if (!ctx.prompter.shouldRepair) return;
  const { maybeRunConfiguredPluginInstallReleaseStep } =
    await import("./release-configured-plugin-installs-CLZO1N9J.js");
  const { note } = await loadNoteModule();
  const { VERSION } = await import("./version-BmsGkjsI.js");
  const result = await maybeRunConfiguredPluginInstallReleaseStep({
    cfg: ctx.cfg,
    env: ctx.env ?? process.env,
    touchedVersion: ctx.configResult.sourceLastTouchedVersion ?? ctx.cfg.meta?.lastTouchedVersion,
  });
  if (result.postInstallDoctorResult) ctx.postInstallDoctorResult = result.postInstallDoctorResult;
  if (result.changes.length > 0) note(result.changes.join("\n"), "Doctor changes");
  if (result.warnings.length > 0) note(result.warnings.join("\n"), "Doctor warnings");
  if (!result.touchedConfig) return;
  const lastTouchedVersion = isLegacyParentWritableUpdateDoctorPass(ctx.env ?? process.env)
    ? ctx.configResult.sourceLastTouchedVersion?.trim() ||
      ctx.cfg.meta?.lastTouchedVersion ||
      VERSION
    : VERSION;
  ctx.cfg = {
    ...ctx.cfg,
    meta: {
      ...ctx.cfg.meta,
      lastTouchedVersion,
      lastTouchedAt: /* @__PURE__ */ new Date().toISOString(),
    },
  };
}
async function runDiskSpaceHealth(ctx) {
  const { noteDiskSpace } = await import("./doctor-disk-space-CdOGU4eF.js");
  noteDiskSpace(ctx.cfg);
}
async function runDatabaseBloatHealth(ctx) {
  const { noteSqliteDatabaseBloat } = await import("./doctor-db-bloat-BVQw6o9A.js");
  noteSqliteDatabaseBloat(ctx.cfg);
}
async function runStateIntegrityHealth(ctx) {
  const { noteStateIntegrity } = await loadDoctorStateIntegrityModule();
  await noteStateIntegrity(ctx.cfg, ctx.prompter, ctx.configPath);
}
async function runCodexSessionRouteHealth(ctx) {
  const { maybeRepairCodexSessionRoutes } = await import("./codex-route-warnings-BY9naVj7.js");
  const { note } = await loadNoteModule();
  const result = await maybeRepairCodexSessionRoutes({
    cfg: ctx.cfg,
    env: ctx.env ?? process.env,
    shouldRepair: ctx.prompter.shouldRepair,
  });
  if (result.changes.length > 0) note(result.changes.join("\n"), "Doctor changes");
  if (result.warnings.length > 0) note(result.warnings.join("\n"), "Doctor warnings");
}
async function runSessionLocksHealth(ctx) {
  const { noteSessionLockHealth } = await import("./doctor-session-locks-E85kWLhg.js");
  await noteSessionLockHealth({
    shouldRepair: ctx.prompter.shouldRepair,
    config: ctx.cfg,
    env: ctx.env,
  });
}
async function runSessionTranscriptsHealth(ctx) {
  const { noteSessionTranscriptHealth } = await import("./doctor-session-transcripts-CEOY1x4Q.js");
  await noteSessionTranscriptHealth({
    env: ctx.env ?? process.env,
    shouldRepair: ctx.prompter.shouldRepair,
  });
}
async function runSessionSnapshotsHealth(ctx) {
  const { noteSessionSnapshotHealth } = await import("./doctor-session-snapshots-DYATd-mD.js");
  await noteSessionSnapshotHealth({
    cfg: ctx.cfg,
    env: ctx.env ?? process.env,
    shouldRepair: ctx.prompter.shouldRepair,
  });
}
async function runConfigAuditScrubHealth(ctx) {
  await (
    await import("./doctor-usage-cost-cache-mwFI7JbB.js")
  ).maybeRepairLegacyRuntimeFiles(ctx.prompter.shouldRepair, ctx.env);
}
async function runLegacyCronHealth(ctx) {
  const { maybeRepairLegacyCronStore, noteLegacyWhatsAppCrontabHealthCheck } =
    await import("./cron-By4ujAvV.js");
  await noteLegacyWhatsAppCrontabHealthCheck();
  await maybeRepairLegacyCronStore({
    cfg: ctx.cfg,
    options: ctx.options,
    prompter: ctx.prompter,
  });
}
async function runSandboxHealth(ctx) {
  const { maybeRepairSandboxImages, maybeRepairSandboxRegistryFiles, noteSandboxScopeWarnings } =
    await import("./doctor-sandbox-BsSoPPjx.js");
  await maybeRepairSandboxRegistryFiles(ctx.prompter);
  ctx.cfg = await maybeRepairSandboxImages(ctx.cfg, ctx.runtime, ctx.prompter);
  noteSandboxScopeWarnings(ctx.cfg);
}
async function runGatewayServicesHealth(ctx) {
  const { maybeRepairGatewayServiceConfig, maybeScanExtraGatewayServices } =
    await import("./doctor-gateway-services-Cg7eCfmR.js");
  const {
    noteMacLaunchAgentOverrides,
    noteMacLaunchctlGatewayEnvOverrides,
    noteMacStaleOpenClawUpdateLaunchdJobs,
  } = await import("./doctor-platform-notes-CRE_5TcP.js");
  await maybeScanExtraGatewayServices(ctx.options, ctx.runtime, ctx.prompter);
  const updateDoctorRun = isUpdateDoctorRun(ctx.env ?? process.env);
  ctx.cfg = await maybeRepairGatewayServiceConfig(
    ctx.cfg,
    resolveDoctorMode(ctx.cfg),
    ctx.runtime,
    ctx.prompter,
    {
      allowExecSecretRefs: ctx.options.allowExec === true,
      allowConfigSizeDrop: ctx.configResult.shouldWriteConfig === true || updateDoctorRun,
      skipPluginValidation:
        ctx.configResult.skipPluginValidationOnWrite === true || updateDoctorRun,
      preservedLegacyRootKeys: ctx.configResult.preservedLegacyRootKeys,
      ...resolveLegacyParentVersionOverride(ctx),
    },
  );
  await noteMacLaunchAgentOverrides();
  await noteMacStaleOpenClawUpdateLaunchdJobs();
  await noteMacLaunchctlGatewayEnvOverrides(ctx.cfg);
}
async function runStartupChannelMaintenanceHealth(ctx) {
  const { maybeRunDoctorStartupChannelMaintenance } =
    await import("./doctor-startup-channel-maintenance-DPug4g6a.js");
  await maybeRunDoctorStartupChannelMaintenance({
    cfg: ctx.cfg,
    env: process.env,
    runtime: ctx.runtime,
    shouldRepair: ctx.prompter.shouldRepair,
  });
}
async function runSecurityHealth(ctx) {
  const { noteInstallPolicyHealth } = await import("./doctor-install-policy-CCnV4rJ2.js");
  const { noteSecurityWarnings } = await import("./doctor-security-CxeSh8PI.js");
  await noteSecurityWarnings(ctx.cfg);
  await noteInstallPolicyHealth(ctx.cfg, {
    deep: ctx.options.deep === true,
    env: ctx.env,
  });
}
async function runBrowserHealth(ctx) {
  const { noteChromeMcpBrowserReadiness } = await import("./doctor-browser-CTUi5y-x.js");
  await runCoreContributionHealthRepair(ctx, ["core/doctor/browser-clawd-profile-residue"]);
  await noteChromeMcpBrowserReadiness(ctx.cfg);
}
async function runOpenAIOAuthTlsHealth(ctx) {
  const { noteOpenAIOAuthTlsPrerequisites } =
    await import("./provider-openai-chatgpt-oauth-tls-CEAncoMZ.js");
  await noteOpenAIOAuthTlsPrerequisites({
    cfg: ctx.cfg,
    deep: ctx.options.deep === true,
  });
}
async function runHooksModelHealth(ctx) {
  if (!ctx.cfg.hooks?.gmail?.model?.trim()) return;
  const { DEFAULT_MODEL, DEFAULT_PROVIDER } = await loadAgentDefaultsModule();
  const { loadModelCatalog } = await loadModelCatalogModule();
  const { getModelRefStatus, resolveConfiguredModelRef, resolveHooksGmailModel } =
    await loadModelSelectionModule();
  const { note } = await loadNoteModule();
  const hooksModelRef = resolveHooksGmailModel({
    cfg: ctx.cfg,
    defaultProvider: DEFAULT_PROVIDER,
  });
  if (!hooksModelRef) {
    note(`- hooks.gmail.model "${ctx.cfg.hooks.gmail.model}" could not be resolved`, "Hooks");
    return;
  }
  const { provider: defaultProvider, model: defaultModel } = resolveConfiguredModelRef({
    cfg: ctx.cfg,
    defaultProvider: DEFAULT_PROVIDER,
    defaultModel: DEFAULT_MODEL,
  });
  const catalog = await loadModelCatalog({
    config: ctx.cfg,
    readOnly: true,
  });
  const status = getModelRefStatus({
    cfg: ctx.cfg,
    catalog,
    ref: hooksModelRef,
    defaultProvider,
    defaultModel,
  });
  const warnings = [];
  if (!status.allowed)
    warnings.push(
      `- hooks.gmail.model "${status.key}" not in agents.defaults.models allowlist (will use primary instead)`,
    );
  if (!status.inCatalog)
    warnings.push(
      `- hooks.gmail.model "${status.key}" not in the model catalog (may fail at runtime)`,
    );
  if (warnings.length > 0) note(warnings.join("\n"), "Hooks");
}
async function collectToolResultCapFindings(cfg) {
  const { resolveAgentContextLimits } = await loadAgentScopeModule();
  const { normalizeAgentId } = await import("./session-key-DhlsKyCw.js");
  const targets = [];
  const defaultsConfiguredCap = cfg.agents?.defaults?.contextLimits?.toolResultMaxChars;
  if (defaultsConfiguredCap !== void 0)
    targets.push({
      configuredCap: defaultsConfiguredCap,
      path: "agents.defaults.contextLimits.toolResultMaxChars",
      scopeLabel: "defaults",
      target: "agents.defaults",
    });
  for (const entry of cfg.agents?.list ?? []) {
    const normalizedAgentId = normalizeAgentId(entry.id);
    if (
      !normalizedAgentId ||
      (defaultsConfiguredCap === void 0 && entry.contextLimits?.toolResultMaxChars === void 0)
    )
      continue;
    targets.push({
      agentId: normalizedAgentId,
      configuredCap: resolveAgentContextLimits(cfg, normalizedAgentId)?.toolResultMaxChars,
      path:
        entry.contextLimits?.toolResultMaxChars === void 0
          ? "agents.defaults.contextLimits.toolResultMaxChars"
          : `agents.list.${normalizedAgentId}.contextLimits.toolResultMaxChars`,
      scopeLabel: `agent "${normalizedAgentId}"`,
      target: `agents.list.${normalizedAgentId}`,
    });
  }
  if (targets.length === 0) return [];
  const { collectToolResultCapDoctorIssues, toolResultCapDoctorIssueToHealthFinding } =
    await import("./doctor-tool-result-cap-advice-DeQ1BceS.js");
  return collectToolResultCapTargetAdvice({
    cfg,
    readOnlyCatalog: true,
    targets,
  }).then((entries) =>
    entries.flatMap((entry) =>
      collectToolResultCapDoctorIssues(entry).map(toolResultCapDoctorIssueToHealthFinding),
    ),
  );
}
async function collectToolResultCapTargetAdvice(params) {
  const { DEFAULT_CONTEXT_TOKENS } = await loadAgentDefaultsModule();
  const { loadModelCatalog, findModelCatalogEntry } = await loadModelCatalogModule();
  const { resolveContextWindowInfo } = await import("./context-window-guard-CBnJCzfQ.js");
  const { resolveDefaultModelForAgent, modelKey } = await loadModelSelectionModule();
  const catalog = await loadModelCatalog({
    config: params.cfg,
    ...(params.readOnlyCatalog ? { readOnly: true } : {}),
  });
  return params.targets.map((target) => {
    const modelRef = resolveDefaultModelForAgent({
      cfg: params.cfg,
      agentId: target.agentId,
    });
    const entry = findModelCatalogEntry(catalog, {
      provider: modelRef.provider,
      modelId: modelRef.model,
    });
    return {
      contextWindowTokens: resolveContextWindowInfo({
        cfg: params.cfg,
        provider: modelRef.provider,
        modelId: modelRef.model,
        modelContextTokens: entry?.contextTokens,
        modelContextWindow: entry?.contextWindow,
        defaultTokens: DEFAULT_CONTEXT_TOKENS,
      }).tokens,
      modelKey: modelKey(modelRef.provider, modelRef.model),
      configuredCap: target.configuredCap,
      path: target.path,
      scopeLabel: target.scopeLabel,
      target: target.target,
    };
  });
}
async function runToolResultCapHealth(ctx) {
  const { resolveAgentContextLimits } = await loadAgentScopeModule();
  const { normalizeAgentId } = await import("./session-key-DhlsKyCw.js");
  const targets = [];
  const defaultsConfiguredCap = ctx.cfg.agents?.defaults?.contextLimits?.toolResultMaxChars;
  if (ctx.options.deep === true || defaultsConfiguredCap !== void 0)
    targets.push({
      configuredCap: defaultsConfiguredCap,
      scopeLabel: "defaults",
    });
  for (const entry of ctx.cfg.agents?.list ?? []) {
    const normalizedAgentId = normalizeAgentId(entry.id);
    if (
      !normalizedAgentId ||
      (ctx.options.deep !== true &&
        defaultsConfiguredCap === void 0 &&
        entry.contextLimits?.toolResultMaxChars === void 0)
    )
      continue;
    targets.push({
      agentId: normalizedAgentId,
      configuredCap: resolveAgentContextLimits(ctx.cfg, normalizedAgentId)?.toolResultMaxChars,
      scopeLabel: `agent "${normalizedAgentId}"`,
    });
  }
  if (targets.length === 0) return;
  const { buildToolResultCapDoctorAdvice } =
    await import("./doctor-tool-result-cap-advice-DeQ1BceS.js");
  const { note } = await loadNoteModule();
  const lines = (
    await collectToolResultCapTargetAdvice({
      cfg: ctx.cfg,
      targets,
    })
  ).flatMap((entry) =>
    buildToolResultCapDoctorAdvice({
      ...entry,
      deep: ctx.options.deep === true,
    }),
  );
  if (lines.length > 0) note(lines.join("\n"), "Tool result cap");
}
async function runSystemdLingerHealth(ctx) {
  if (
    ctx.options.nonInteractive === true ||
    process.platform !== "linux" ||
    resolveDoctorMode(ctx.cfg) !== "local"
  )
    return;
  const { resolveGatewayService } = await import("./service-CrBu5U55.js");
  const { ensureSystemdUserLingerInteractive } = await import("./systemd-linger-CRThYqWy.js");
  const { note } = await loadNoteModule();
  const service = resolveGatewayService();
  let loaded;
  try {
    loaded = await service.isLoaded({ env: process.env });
  } catch {
    loaded = false;
  }
  if (!loaded) return;
  await ensureSystemdUserLingerInteractive({
    runtime: ctx.runtime,
    prompter: {
      confirm: async (p) => ctx.prompter.confirm(p),
      note,
    },
    reason:
      "Gateway runs as a systemd user service. Without lingering, systemd stops the user session on logout/idle and kills the Gateway.",
    requireConfirm: true,
  });
}
async function detectSystemdLingerFindings(ctx) {
  if (process.platform !== "linux" || resolveDoctorMode(ctx.cfg) !== "local") return [];
  const { resolveGatewayService } = await import("./service-CrBu5U55.js");
  const service = resolveGatewayService();
  let loaded;
  try {
    loaded = await service.isLoaded({ env: process.env });
  } catch {
    loaded = false;
  }
  if (!loaded) return [];
  const { isSystemdUserServiceAvailable, readSystemdUserLingerStatus } =
    await import("./systemd-DfZRoXVo.js");
  if (!(await isSystemdUserServiceAvailable(process.env))) return [];
  const status = await readSystemdUserLingerStatus(process.env);
  if (!status || status.linger === "yes") return [];
  return [
    {
      checkId: "core/doctor/systemd-linger",
      severity: "warning",
      source: "doctor",
      message: `Systemd lingering is disabled for ${status.user}.`,
      target: `systemd.user.${status.user}`,
      requirement: "systemd user lingering enabled",
      fixHint: `Run: sudo loginctl enable-linger ${status.user}`,
    },
  ];
}
async function hasActiveGatewayExecCredential(ctx, mode = resolveDoctorMode(ctx.cfg)) {
  const { resolveSecretInputRef } = await loadSecretTypesModule();
  const { gatewaySecretInputPathCanWin } = await import("./credentials-secret-inputs-BGnCt9U9.js");
  const { ALL_GATEWAY_SECRET_INPUT_PATHS, readGatewaySecretInputValue } =
    await import("./secret-input-paths-B4b1wPE8.js");
  return ALL_GATEWAY_SECRET_INPUT_PATHS.some((path) => {
    if (
      !gatewaySecretInputPathCanWin({
        config: ctx.cfg,
        env: process.env,
        modeOverride: mode,
        path,
      })
    )
      return false;
    return (
      resolveSecretInputRef({
        value: readGatewaySecretInputValue(ctx.cfg, path),
        defaults: ctx.cfg.secrets?.defaults,
      }).ref?.source === "exec"
    );
  });
}
async function collectWorkspaceStatusPluginVersionDrift(params) {
  if (params.cfg.gateway?.mode !== "remote")
    try {
      const { gatherDaemonStatus } = await import("./status.gather-CnDEbV58.js");
      const allowExecSecretRefs = params.options?.allowExec === true;
      const status = await gatherDaemonStatus({
        rpc: {
          timeout: params.options?.nonInteractive === true ? "3000" : "10000",
          json: true,
        },
        probe: true,
        requireRpc: false,
        deep: params.options?.deep === true,
        allowExecSecretRefs,
      });
      const hasProbedGatewayVersion =
        typeof status.gateway?.version === "string" && status.gateway.version.trim() !== "";
      if (status.pluginVersionDrift && hasProbedGatewayVersion && !status.rpc?.authWarning)
        return status.pluginVersionDrift;
    } catch {}
}
async function runWorkspaceStatusHealth(ctx) {
  const pluginVersionDrift = await collectWorkspaceStatusPluginVersionDrift({
    cfg: ctx.cfg,
    options: ctx.options,
  });
  const { noteWorkspaceStatus } = await import("./doctor-workspace-status-BKEFL5i3.js");
  noteWorkspaceStatus(ctx.cfg, { pluginVersionDrift });
}
async function runSkillsHealth(ctx) {
  const { maybeRepairSkillReadiness } = await import("./doctor-skills-BSnGj_yJ.js");
  ctx.cfg = await maybeRepairSkillReadiness({
    cfg: ctx.cfg,
    prompter: ctx.prompter,
  });
}
async function runBootstrapSizeHealth(ctx) {
  const { noteBootstrapFileSize } = await import("./doctor-bootstrap-size-BIpJxMaH.js");
  await noteBootstrapFileSize(ctx.cfg);
}
async function runHeartbeatTemplateRepairHealth(ctx) {
  const { maybeRepairHeartbeatTemplate } =
    await import("./doctor-heartbeat-template-repair-wTwUAxyr.js");
  await maybeRepairHeartbeatTemplate({
    cfg: ctx.cfg,
    shouldRepair: ctx.prompter.shouldRepair,
  });
}
async function runShellCompletionHealth(ctx) {
  const { doctorShellCompletion } = await import("./doctor-completion-BX_3VyjU.js");
  await doctorShellCompletion(ctx.runtime, ctx.prompter, {
    nonInteractive: ctx.options.nonInteractive,
  });
}
async function runGatewayHealthChecks(ctx) {
  const { note } = await loadNoteModule();
  if ((await hasActiveGatewayExecCredential(ctx)) && ctx.options.allowExec !== true) {
    note(
      "Gateway health probes skipped because gateway credentials use an exec SecretRef. Run `openclaw doctor --allow-exec` to verify Gateway health with exec SecretRefs.",
      "Gateway",
    );
    ctx.gatewayHealthSkipped = true;
    ctx.gatewayMemoryProbe = {
      checked: false,
      ready: false,
      skipped: true,
    };
    return;
  }
  const { checkGatewayHealth, probeGatewayMemoryStatus } =
    await import("./doctor-gateway-health-C2Qk3_p1.js");
  const { healthOk, authenticated, status } = await checkGatewayHealth({
    runtime: ctx.runtime,
    cfg: ctx.cfg,
    timeoutMs: ctx.options.nonInteractive === true ? 3e3 : 1e4,
  });
  ctx.gatewayHealthSkipped = false;
  ctx.healthOk = healthOk;
  ctx.gatewayHealthAuthenticated = authenticated;
  ctx.gatewayStatus = status;
  ctx.gatewayMemoryProbe = authenticated
    ? await probeGatewayMemoryStatus({
        cfg: ctx.cfg,
        timeoutMs: ctx.options.nonInteractive === true ? 3e3 : 1e4,
      })
    : {
        checked: false,
        ready: false,
        skipped: healthOk,
      };
}
async function runWhatsappResponsivenessHealth(ctx) {
  const { noteWhatsappResponsivenessHealth } =
    await import("./doctor-whatsapp-responsiveness-W2WKBAVw.js");
  await noteWhatsappResponsivenessHealth({
    cfg: ctx.cfg,
    status: ctx.gatewayStatus,
    shouldRepair: ctx.prompter.shouldRepair,
  });
}
async function runMemorySearchHealthContribution(ctx) {
  const { maybeRepairMemoryRecallHealth, noteMemoryRecallHealth, noteMemorySearchHealth } =
    await import("./doctor-memory-search-Do8T_LIp.js");
  if (ctx.prompter.shouldRepair)
    await maybeRepairMemoryRecallHealth({
      cfg: ctx.cfg,
      prompter: ctx.prompter,
    });
  await noteMemorySearchHealth(ctx.cfg, {
    gatewayMemoryProbe: ctx.gatewayMemoryProbe ?? {
      checked: false,
      ready: false,
      skipped: false,
    },
  });
  if (ctx.options.deep === true) await noteMemoryRecallHealth(ctx.cfg);
}
function memorySearchNoteToFinding(message) {
  const lines = message.split("\n");
  const firstLine = (lines[0] ?? message).trim();
  if (firstLine === "Memory search is explicitly disabled (enabled: false).") return null;
  const fixHint = lines
    .slice(1)
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
  return {
    checkId: "core/doctor/memory-search",
    severity: "warning",
    message: firstLine,
    path: inferMemorySearchFindingPath(firstLine),
    ...(fixHint ? { fixHint } : {}),
  };
}
function inferMemorySearchFindingPath(message) {
  if (message.includes("No active memory plugin")) return "plugins.slots.memory";
  if (message.includes("QMD memory backend")) return "memory.backend";
  if (message.includes("OpenAI-compatible embeddings endpoint"))
    return "agents.defaults.memorySearch.remote.baseUrl";
  if (message.includes("OpenAI-compatible embedding model"))
    return "agents.defaults.memorySearch.model";
  return "agents.defaults.memorySearch.provider";
}
async function collectMemorySearchHealthFindings(ctx) {
  const { noteMemorySearchHealth } = await import("./doctor-memory-search-Do8T_LIp.js");
  const notes = [];
  await noteMemorySearchHealth(ctx.cfg, {
    includeWorkspaceMemoryHealth: false,
    skipQmdBinaryProbe: true,
    skipAuthProfileResolution: true,
    gatewayMemoryProbe: {
      checked: false,
      ready: false,
      skipped: true,
    },
    noteFn: (message) => {
      notes.push(String(message));
    },
  });
  return notes.flatMap((message) => {
    const finding = memorySearchNoteToFinding(message);
    return finding ? [finding] : [];
  });
}
async function runDevicePairingHealth(ctx) {
  const { noteDevicePairingHealth } = await import("./doctor-device-pairing-CljpDFzA.js");
  await noteDevicePairingHealth({
    cfg: ctx.cfg,
    healthOk: ctx.healthOk ?? false,
  });
}
async function runGatewayDaemonHealth(ctx) {
  const { maybeRepairGatewayDaemon } = await import("./doctor-gateway-daemon-flow-WqDhxR2t.js");
  await maybeRepairGatewayDaemon({
    cfg: ctx.cfg,
    runtime: ctx.runtime,
    prompter: ctx.prompter,
    options: ctx.options,
    gatewayDetailsMessage: ctx.gatewayDetails?.message ?? "",
    healthOk: ctx.healthOk ?? false,
    healthSkipped: ctx.gatewayHealthSkipped === true,
  });
}
async function runWriteConfigHealth(ctx) {
  const { applyWizardMetadata } = await loadOnboardHelpersModule();
  const { replaceConfigFile } = await loadConfigModule();
  const { logConfigUpdated } = await import("./logging-DtclSUgM.js");
  const { shortenHomePath } = await import("./utils-hXjrfoaN.js");
  if (
    ctx.configResult.shouldWriteConfig ||
    JSON.stringify(ctx.cfg) !== JSON.stringify(ctx.cfgForPersistence)
  ) {
    const updateDoctorRun = isUpdateDoctorRun(ctx.env ?? process.env);
    ctx.cfg = applyWizardMetadata(ctx.cfg, {
      command: "doctor",
      mode: resolveDoctorMode(ctx.cfg),
    });
    if (shouldSkipLegacyUpdateDoctorConfigWrite({ env: ctx.env ?? process.env })) {
      ctx.runtime.log("Skipping doctor config write during legacy update handoff.");
      return;
    }
    const legacyParentVersionOverride =
      resolveLegacyParentVersionOverride(ctx).lastTouchedVersionOverride;
    await replaceConfigFile({
      nextConfig: ctx.cfg,
      afterWrite: { mode: "auto" },
      writeOptions: {
        allowConfigSizeDrop: ctx.configResult.shouldWriteConfig === true || updateDoctorRun,
        skipPluginValidation:
          ctx.configResult.skipPluginValidationOnWrite === true || updateDoctorRun,
        preservedLegacyRootKeys: ctx.configResult.preservedLegacyRootKeys,
        ...(legacyParentVersionOverride
          ? { lastTouchedVersionOverride: legacyParentVersionOverride }
          : {}),
      },
    });
    logConfigUpdated(ctx.runtime);
    const preUpdateSnapshotPath = `${ctx.configPath}.pre-update`;
    if (updateDoctorRun && fs.existsSync(preUpdateSnapshotPath))
      ctx.runtime.log(
        `Update changed config; pre-update backup: ${shortenHomePath(preUpdateSnapshotPath)}`,
      );
  }
}
async function collectWriteConfigHealthFindings(ctx) {
  const findings = [];
  const configPath = ctx.configPath;
  if (resolveIsNixMode(process.env))
    findings.push({
      checkId: "core/doctor/write-config",
      severity: "warning",
      message: "Doctor config writes are disabled because OpenClaw is running in Nix mode.",
      ...(configPath ? { path: configPath } : {}),
      requirement: "mutable-config-write-path",
      fixHint:
        "Edit the Nix source for this install and rebuild; do not run doctor --fix against this config file.",
    });
  if (!configPath) return findings;
  const configDirectory = path.dirname(configPath);
  const configPathExists = fs.existsSync(configPath);
  const existingParent = configPathExists
    ? configDirectory
    : findNearestExistingParent(configDirectory);
  if (!isDirectoryPath(existingParent)) {
    findings.push({
      checkId: "core/doctor/write-config",
      severity: "warning",
      message: "Doctor cannot create the config directory because a path component is a file.",
      path: existingParent,
      target: configDirectory,
      requirement: "config-directory-path",
      fixHint: "Move the file blocking the config directory path before running doctor --fix.",
    });
    return findings;
  }
  try {
    fs.accessSync(existingParent, fs.constants.W_OK | fs.constants.X_OK);
  } catch {
    findings.push({
      checkId: "core/doctor/write-config",
      severity: "warning",
      message: configPathExists
        ? "Doctor cannot write config because the config directory is not writable."
        : "Doctor cannot create the config directory because the nearest existing parent is not writable.",
      path: existingParent,
      target: configPathExists ? configPath : configDirectory,
      requirement: "writable-config-directory",
      fixHint:
        "Make the existing config directory or parent directory writable before running doctor --fix.",
    });
  }
  return findings;
}
function findNearestExistingParent(path$1) {
  let candidate = path$1;
  while (!pathEntryExists(candidate)) {
    const parent = path.dirname(candidate);
    if (parent === candidate) return candidate;
    candidate = parent;
  }
  return candidate;
}
function pathEntryExists(path) {
  if (fs.existsSync(path)) return true;
  try {
    fs.lstatSync(path);
    return true;
  } catch {
    return false;
  }
}
function isDirectoryPath(path) {
  try {
    return fs.statSync(path).isDirectory();
  } catch {
    return false;
  }
}
function resolveLegacyParentVersionOverride(ctx) {
  if (!isLegacyParentWritableUpdateDoctorPass(ctx.env ?? process.env)) return {};
  const version =
    ctx.configResult.sourceLastTouchedVersion?.trim() || ctx.cfg.meta?.lastTouchedVersion;
  return version ? { lastTouchedVersionOverride: version } : {};
}
async function runWorkspaceSuggestionsHealth(ctx) {
  if (ctx.options.workspaceSuggestions === false) return;
  const { resolveAgentWorkspaceDir, resolveDefaultAgentId } = await loadAgentScopeModule();
  const { noteWorkspaceBackupTip } = await loadDoctorStateIntegrityModule();
  const { MEMORY_SYSTEM_PROMPT, shouldSuggestMemorySystem } =
    await import("./doctor-workspace-BBdv1ZLp.js");
  const { note } = await loadNoteModule();
  const workspaceDir = resolveAgentWorkspaceDir(ctx.cfg, resolveDefaultAgentId(ctx.cfg));
  noteWorkspaceBackupTip(workspaceDir);
  if (await shouldSuggestMemorySystem(workspaceDir)) note(MEMORY_SYSTEM_PROMPT, "Workspace");
}
async function runFinalConfigValidationHealth(ctx) {
  const { readConfigFileSnapshot } = await loadConfigModule();
  const finalSnapshot = await readConfigFileSnapshot({
    skipPluginValidation: isUpdateDoctorRun(ctx.env ?? process.env),
    preservedLegacyRootKeys: ctx.configResult.preservedLegacyRootKeys,
  });
  if (finalSnapshot.exists && !finalSnapshot.valid) {
    ctx.runtime.error("Invalid config:");
    for (const issue of finalSnapshot.issues) {
      const path = issue.path || "<root>";
      ctx.runtime.error(`- ${path}: ${issue.message}`);
    }
  }
}
function formatHealthFindings(findings) {
  return findings
    .map((finding) => {
      const lines = [`- ${finding.message}`];
      if (finding.path) lines.push(`  path: ${finding.path}`);
      if (finding.requirement) lines.push(`  issue: ${finding.requirement}`);
      if (finding.fixHint) lines.push(`  fix: ${finding.fixHint}`);
      return lines.join("\n");
    })
    .join("\n");
}
async function runCoreHealthFindingNote(ctx, checkId) {
  const { registerCoreHealthChecks } = await loadDoctorCoreChecksModule();
  const { getHealthCheck } = await loadHealthCheckRegistryModule();
  const { resolveAgentWorkspaceDir, resolveDefaultAgentId } = await loadAgentScopeModule();
  const { note } = await loadNoteModule();
  registerCoreHealthChecks();
  const check = getHealthCheck(checkId);
  if (!check) return;
  const findings = await check.detect({
    mode: "doctor",
    runtime: ctx.runtime,
    cfg: ctx.cfg,
    cwd: resolveAgentWorkspaceDir(ctx.cfg, resolveDefaultAgentId(ctx.cfg)),
    configPath: ctx.configPath,
  });
  if (findings.length === 0) return;
  const information = findings.filter((finding) => finding.severity === "info");
  const warnings = findings.filter((finding) => finding.severity !== "info");
  if (information.length > 0) note(formatHealthFindings(information), "Doctor information");
  if (warnings.length > 0) {
    ctx.healthOk = false;
    note(formatHealthFindings(warnings), "Doctor warnings");
  }
}
async function runProviderCatalogProjectionHealth(ctx) {
  await runCoreHealthFindingNote(ctx, "core/doctor/provider-catalog-projection");
}
async function runLocalAudioAccelerationHealth(ctx) {
  await runCoreHealthFindingNote(ctx, "core/doctor/local-audio-acceleration");
}
async function runRuntimeToolSchemasHealth(ctx) {
  await runCoreHealthFindingNote(ctx, "core/doctor/runtime-tool-schemas");
}
async function runSkillWorkshopToolPolicyHealth(ctx) {
  await runCoreHealthFindingNote(ctx, "core/doctor/skill-workshop-tool-policy");
}
function resolveDoctorHealthContributions() {
  return [
    createDoctorHealthContribution({
      id: "doctor:gateway-config",
      label: "Gateway config",
      healthCheckIds: ["core/doctor/gateway-config"],
      run: runGatewayConfigHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:auth-profiles",
      label: "Auth profiles",
      healthChecks: {
        id: "core/doctor/auth-profiles",
        kind: "core",
        description: "Auth profile cooldown, expiry, missing credential, and legacy override state",
        defaultEnabled: false,
        async detect(ctx) {
          const { collectAuthProfileHealthFindings } = await import("./doctor-auth-BZ_YWo2v.js");
          return collectAuthProfileHealthFindings({
            cfg: ctx.cfg,
            allowKeychainPrompt: false,
          });
        },
      },
      run: runAuthProfileHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:claude-cli",
      label: "Claude CLI",
      healthCheckIds: ["core/doctor/claude-cli"],
      run: runClaudeCliHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:gateway-auth",
      label: "Gateway auth",
      healthCheckIds: ["core/doctor/gateway-auth"],
      run: runGatewayAuthHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:command-owner",
      label: "Command owner",
      healthCheckIds: ["core/doctor/command-owner"],
      run: runCommandOwnerHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:structured-health-repairs",
      label: "Structured health repairs",
      run: runStructuredHealthRepairs,
    }),
    createDoctorHealthContribution({
      id: "doctor:legacy-state",
      label: "Legacy state",
      healthCheckIds: ["core/doctor/legacy-state"],
      run: runLegacyStateHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:legacy-plugin-manifests",
      label: "Legacy plugin manifests",
      healthChecks: {
        id: "core/doctor/legacy-plugin-manifests",
        description: "Legacy plugin manifest capability keys are reported as findings.",
        defaultEnabled: false,
        async detect(ctx) {
          const {
            collectLegacyPluginManifestContractMigrations,
            legacyPluginManifestContractMigrationToHealthFinding,
          } = await import("./doctor-plugin-manifests-DQ1zTC0m.js");
          return collectLegacyPluginManifestContractMigrations({
            config: ctx.cfg,
            env: process.env,
          }).map(legacyPluginManifestContractMigrationToHealthFinding);
        },
      },
      run: runLegacyPluginManifestHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:legacy-plugin-dependencies",
      label: "Legacy plugin dependencies",
      healthChecks: {
        id: "core/doctor/legacy-plugin-dependencies",
        description: "Legacy plugin dependency state roots are represented as findings.",
        defaultEnabled: false,
        async detect() {
          const {
            detectLegacyPluginDependencyStateIssues,
            legacyPluginDependencyStateIssueToHealthFinding,
          } = await import("./plugin-dependency-cleanup-DS7POWrM.js");
          return (await detectLegacyPluginDependencyStateIssues({ env: process.env })).map(
            legacyPluginDependencyStateIssueToHealthFinding,
          );
        },
      },
      run: async () => {},
    }),
    createDoctorHealthContribution({
      id: "doctor:stale-plugin-runtime-symlinks",
      label: "Stale plugin runtime symlinks",
      healthChecks: {
        id: "core/doctor/stale-plugin-runtime-symlinks",
        description: "Stale plugin-runtime symlinks are represented as findings.",
        defaultEnabled: false,
        async detect() {
          const { collectStalePluginRuntimeSymlinkHealthFindings } =
            await import("./plugin-runtime-symlinks-DNYzdFo-.js");
          return await collectStalePluginRuntimeSymlinkHealthFindings();
        },
      },
      run: async () => {},
    }),
    createDoctorHealthContribution({
      id: "doctor:release-configured-plugin-installs",
      label: "Configured plugin repair",
      healthChecks: {
        id: "core/doctor/configured-plugin-installs",
        description: "Configured plugin install records and package payloads are repairable.",
        defaultEnabled: false,
        async detect(ctx) {
          const {
            detectConfiguredPluginInstallHealthIssues,
            configuredPluginInstallIssueToHealthFinding,
          } = await import("./missing-configured-plugin-install-D0_ND_6e.js");
          return (
            await detectConfiguredPluginInstallHealthIssues({
              cfg: ctx.cfg,
              env: process.env,
            })
          ).map(configuredPluginInstallIssueToHealthFinding);
        },
        async repair(ctx) {
          const {
            detectConfiguredPluginInstallHealthIssues,
            configuredPluginInstallIssueToRepairEffect,
          } = await import("./missing-configured-plugin-install-D0_ND_6e.js");
          const effects = (
            await detectConfiguredPluginInstallHealthIssues({
              cfg: ctx.cfg,
              env: process.env,
            })
          ).map(configuredPluginInstallIssueToRepairEffect);
          if (ctx.dryRun === true)
            return {
              status: "repaired",
              changes: [],
              effects,
            };
          return {
            status: "skipped",
            reason: "legacy doctor configured plugin install repair owns package mutation",
            changes: [],
            effects,
          };
        },
      },
      run: runReleaseConfiguredPluginInstallsHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:plugin-registry",
      label: "Plugin registry",
      healthChecks: {
        id: "core/doctor/plugin-registry",
        description: "Plugin registry migration, stale shadow, and peer-link issues are findings.",
        defaultEnabled: false,
        async detect(ctx) {
          const { detectPluginRegistryHealthIssues, pluginRegistryIssueToHealthFinding } =
            await import("./doctor-plugin-registry-Ukvz7ijG.js");
          return (
            await detectPluginRegistryHealthIssues({
              config: ctx.cfg,
              env: process.env,
              prompter: { shouldRepair: false },
            })
          ).map(pluginRegistryIssueToHealthFinding);
        },
        async repair(ctx) {
          const { detectPluginRegistryHealthIssues, pluginRegistryIssueToRepairEffect } =
            await import("./doctor-plugin-registry-Ukvz7ijG.js");
          const effects = (
            await detectPluginRegistryHealthIssues({
              config: ctx.cfg,
              env: process.env,
              prompter: { shouldRepair: false },
            })
          ).map(pluginRegistryIssueToRepairEffect);
          if (ctx.dryRun === true)
            return {
              status: "repaired",
              changes: [],
              effects,
            };
          return {
            status: "skipped",
            reason: "legacy doctor plugin registry contribution owns registry repairs",
            changes: [],
            effects,
          };
        },
      },
      run: runPluginRegistryHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:ui-protocol-freshness",
      label: "UI protocol freshness",
      healthCheckIds: ["core/doctor/ui-protocol-freshness"],
      run: async () => {},
    }),
    createDoctorHealthContribution({
      id: "doctor:disk-space",
      label: "Disk space",
      healthChecks: {
        id: "core/doctor/disk-space",
        description: "Low disk space around the OpenClaw state directory is a finding.",
        defaultEnabled: false,
        async detect(ctx) {
          const { collectDiskSpaceHealthFindings } =
            await import("./doctor-disk-space-CdOGU4eF.js");
          return collectDiskSpaceHealthFindings(ctx.cfg);
        },
      },
      run: runDiskSpaceHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:db-bloat",
      label: "SQLite database size",
      run: runDatabaseBloatHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:state-integrity",
      label: "State integrity",
      healthChecks: {
        id: "core/doctor/state-integrity",
        description: "State directory, config permission, and runtime state issues are findings.",
        defaultEnabled: false,
        async detect(ctx) {
          const { detectStateIntegrityHealthIssues, stateIntegrityIssueToHealthFinding } =
            await import("./doctor-state-integrity-ssAKnITK.js");
          return detectStateIntegrityHealthIssues(ctx.cfg, {
            configPath: ctx.configPath,
            env: process.env,
          }).map(stateIntegrityIssueToHealthFinding);
        },
        async repair(ctx) {
          const { detectStateIntegrityHealthIssues, stateIntegrityIssueToRepairEffect } =
            await import("./doctor-state-integrity-ssAKnITK.js");
          const effects = detectStateIntegrityHealthIssues(ctx.cfg, {
            configPath: ctx.configPath,
            env: process.env,
          }).map(stateIntegrityIssueToRepairEffect);
          if (ctx.dryRun === true)
            return {
              status: "repaired",
              changes: [],
              effects,
            };
          return {
            status: "skipped",
            reason: "legacy doctor state integrity contribution owns state repairs",
            changes: [],
            effects,
          };
        },
      },
      run: runStateIntegrityHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:codex-session-routes",
      label: "Codex session routes",
      healthCheckIds: ["core/doctor/codex-session-routes"],
      run: runCodexSessionRouteHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:session-locks",
      label: "Session locks",
      healthCheckIds: ["core/doctor/session-locks"],
      run: runSessionLocksHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:session-transcripts",
      label: "Session transcripts",
      healthChecks: {
        id: "core/doctor/session-transcripts",
        description: "Legacy or branchy session transcript files are represented as findings.",
        defaultEnabled: false,
        async detect() {
          const { detectSessionTranscriptHealthIssues, sessionTranscriptIssueToHealthFinding } =
            await import("./doctor-session-transcripts-CEOY1x4Q.js");
          return (await detectSessionTranscriptHealthIssues()).map(
            sessionTranscriptIssueToHealthFinding,
          );
        },
        async repair(ctx) {
          const { detectSessionTranscriptHealthIssues, sessionTranscriptIssueToRepairEffect } =
            await import("./doctor-session-transcripts-CEOY1x4Q.js");
          const effects = (await detectSessionTranscriptHealthIssues()).map(
            sessionTranscriptIssueToRepairEffect,
          );
          if (ctx.dryRun === true)
            return {
              status: "repaired",
              changes: [],
              effects,
            };
          return {
            status: "skipped",
            reason: "legacy doctor session transcript contribution owns transcript rewrites",
            changes: [],
            effects,
          };
        },
      },
      run: runSessionTranscriptsHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:session-snapshots",
      label: "Session snapshots",
      healthChecks: {
        id: "core/doctor/session-snapshots",
        description: "Stale cached session snapshot paths are represented as findings.",
        defaultEnabled: false,
        async detect(ctx) {
          const { detectSessionSnapshotHealthIssues, sessionSnapshotIssueToHealthFinding } =
            await import("./doctor-session-snapshots-DYATd-mD.js");
          return (
            await detectSessionSnapshotHealthIssues({
              cfg: ctx.cfg,
              env: process.env,
            })
          ).map(sessionSnapshotIssueToHealthFinding);
        },
        async repair(ctx) {
          const { detectSessionSnapshotHealthIssues, sessionSnapshotIssueToRepairEffect } =
            await import("./doctor-session-snapshots-DYATd-mD.js");
          const effects = (
            await detectSessionSnapshotHealthIssues({
              cfg: ctx.cfg,
              env: process.env,
            })
          ).map(sessionSnapshotIssueToRepairEffect);
          if (ctx.dryRun === true)
            return {
              status: "repaired",
              changes: [],
              effects,
            };
          return {
            status: "skipped",
            reason: "legacy doctor session snapshot contribution owns snapshot rewrites",
            changes: [],
            effects,
          };
        },
      },
      run: runSessionSnapshotsHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:config-audit-scrub",
      label: "Config audit",
      healthChecks: {
        description:
          "Historical config-audit argv redaction gaps are represented as structured findings.",
        defaultEnabled: false,
        async detect() {
          const { configAuditScrubToHealthFinding, detectConfigAuditScrubIssue } =
            await import("./doctor-config-audit-scrub-DUTwXKoB.js");
          const result = await detectConfigAuditScrubIssue();
          return result.rewritten > 0 ? [configAuditScrubToHealthFinding(result)] : [];
        },
        async repair(ctx) {
          const { configAuditScrubToRepairEffect, detectConfigAuditScrubIssue } =
            await import("./doctor-config-audit-scrub-DUTwXKoB.js");
          const result = await detectConfigAuditScrubIssue();
          const effects = result.rewritten > 0 ? [configAuditScrubToRepairEffect(result)] : [];
          if (ctx.dryRun === true)
            return {
              status: "repaired",
              changes: [],
              effects,
            };
          return {
            status: "skipped",
            reason: "legacy doctor config audit contribution owns cleanup",
            changes: [],
            effects,
          };
        },
      },
      run: runConfigAuditScrubHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:legacy-cron",
      label: "Legacy cron",
      healthCheckIds: ["core/doctor/legacy-whatsapp-crontab", "core/doctor/legacy-cron-store"],
      run: runLegacyCronHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:sandbox",
      label: "Sandbox",
      healthChecks: {
        id: "core/doctor/sandbox/registry-files",
        description: "Legacy sandbox registry files are represented in SQLite registry storage.",
        async detect() {
          const {
            detectLegacySandboxRegistryFileIssues,
            legacySandboxRegistryInspectionToHealthFinding,
          } = await import("./doctor-sandbox-BsSoPPjx.js");
          return (await detectLegacySandboxRegistryFileIssues()).map(
            legacySandboxRegistryInspectionToHealthFinding,
          );
        },
        async repair(ctx) {
          const {
            detectLegacySandboxRegistryFileIssues,
            legacySandboxRegistryInspectionToRepairEffect,
          } = await import("./doctor-sandbox-BsSoPPjx.js");
          const effects = (await detectLegacySandboxRegistryFileIssues()).map(
            legacySandboxRegistryInspectionToRepairEffect,
          );
          if (ctx.dryRun === true)
            return {
              status: "repaired",
              changes: [],
              effects,
            };
          return {
            status: "skipped",
            reason: "legacy doctor sandbox contribution owns registry migration",
            changes: [],
            effects,
          };
        },
      },
      run: runSandboxHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:gateway-services",
      label: "Gateway services",
      healthCheckIds: [
        "core/doctor/gateway-services/extra",
        "core/doctor/gateway-services/platform-notes",
      ],
      run: runGatewayServicesHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:default-account-routing",
      label: "Default account routing",
      healthChecks: {
        id: "core/doctor/default-account-routing",
        description: "Multi-account channels have explicit default routing or complete bindings.",
        defaultEnabled: false,
        async detect(ctx) {
          const {
            collectMissingDefaultAccountBindingWarnings,
            collectMissingExplicitDefaultAccountWarnings,
          } = await import("./default-account-warnings-BfC4qB2j.js");
          return [
            ...collectMissingDefaultAccountBindingWarnings(ctx.cfg),
            ...collectMissingExplicitDefaultAccountWarnings(ctx.cfg),
          ].map((message) => ({
            checkId: "core/doctor/default-account-routing",
            severity: "warning",
            message: message.replace(/^- /, "").trim(),
          }));
        },
      },
    }),
    createDoctorHealthContribution({
      id: "doctor:startup-channel-maintenance",
      label: "Startup channel maintenance",
      healthCheckIds: [
        "core/doctor/channel-plugin-blockers",
        "core/doctor/channel-preview-warnings",
      ],
      healthChecks: [
        {
          id: "core/doctor/channel-plugin-blockers",
          description: "Configured channels must have loadable backing channel plugins.",
          defaultEnabled: false,
          async detect(ctx) {
            const { channelPluginBlockerHitToHealthFinding, scanConfiguredChannelPluginBlockers } =
              await import("./channel-plugin-blockers-CAcz0cNV.js");
            return scanConfiguredChannelPluginBlockers(ctx.cfg, process.env).map(
              channelPluginBlockerHitToHealthFinding,
            );
          },
        },
        {
          id: "core/doctor/channel-preview-warnings",
          description: "Channel doctor preview warnings are captured as structured findings.",
          defaultEnabled: false,
          async detect(ctx) {
            const { collectChannelPreviewWarningHealthFindings } =
              await import("./doctor-startup-channel-maintenance-DPug4g6a.js");
            return collectChannelPreviewWarningHealthFindings({
              cfg: ctx.cfg,
              allowExec: ctx.allowExecSecretRefs === true,
            });
          },
        },
      ],
      run: runStartupChannelMaintenanceHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:security",
      label: "Security",
      healthCheckIds: ["core/doctor/security"],
      run: runSecurityHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:browser",
      label: "Browser",
      healthCheckIds: ["core/doctor/browser", "core/doctor/browser-clawd-profile-residue"],
      run: runBrowserHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:oauth-tls",
      label: "OAuth TLS",
      healthCheckIds: ["core/doctor/oauth-tls"],
      run: runOpenAIOAuthTlsHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:hooks-model",
      label: "Hooks model",
      healthCheckIds: ["core/doctor/hooks-model"],
      run: runHooksModelHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:tool-result-cap",
      label: "Tool result cap",
      healthChecks: {
        id: "core/doctor/tool-result-cap",
        description:
          "Detect explicit toolResultMaxChars settings that fight model-window defaults.",
        defaultEnabled: false,
        detect: async (ctx) => collectToolResultCapFindings(ctx.cfg),
      },
      run: runToolResultCapHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:provider-catalog-projection",
      label: "Provider catalog projection",
      healthCheckIds: ["core/doctor/provider-catalog-projection"],
      run: runProviderCatalogProjectionHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:local-audio-acceleration",
      label: "Local audio acceleration",
      healthCheckIds: ["core/doctor/local-audio-acceleration"],
      run: runLocalAudioAccelerationHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:runtime-tool-schemas",
      label: "Runtime tool schemas",
      healthCheckIds: ["core/doctor/runtime-tool-schemas"],
      run: runRuntimeToolSchemasHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:skill-workshop-tool-policy",
      label: "Skill Workshop tool policy",
      healthCheckIds: ["core/doctor/skill-workshop-tool-policy"],
      run: runSkillWorkshopToolPolicyHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:systemd-linger",
      label: "systemd linger",
      healthChecks: {
        id: "core/doctor/systemd-linger",
        description: "Disabled systemd user lingering is reported as a finding.",
        defaultEnabled: false,
        detect: detectSystemdLingerFindings,
      },
      run: runSystemdLingerHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:workspace-status",
      label: "Workspace status",
      healthChecks: {
        id: "core/doctor/workspace-status",
        description: "Workspace plugin/status diagnostics are exposed as findings.",
        defaultEnabled: false,
        async detect(ctx) {
          const { collectWorkspaceStatusHealthFindings } =
            await import("./doctor-workspace-status-BKEFL5i3.js");
          const pluginVersionDrift = await collectWorkspaceStatusPluginVersionDrift({
            cfg: ctx.cfg,
            options: {
              nonInteractive: true,
              allowExec: ctx.allowExecSecretRefs === true,
            },
          });
          return collectWorkspaceStatusHealthFindings(ctx.cfg, { pluginVersionDrift });
        },
      },
      run: runWorkspaceStatusHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:skill-curator",
      label: "Skill curator",
      healthChecks: {
        id: "core/doctor/skill-curator",
        description: "Stalled skill lifecycle curation is reported as a warning.",
        defaultEnabled: false,
        async detect() {
          const { getSkillCuratorDoctorWarning } = await import("./curator-DrPZdidL.js");
          const warning = getSkillCuratorDoctorWarning();
          return warning
            ? [
                {
                  checkId: "core/doctor/skill-curator",
                  severity: "warning",
                  source: "doctor",
                  message: warning,
                  target: "skill-curator",
                  requirement:
                    "latest sweep succeeds and attempts do not trail success by seven days",
                },
              ]
            : [];
        },
      },
    }),
    createDoctorHealthContribution({
      id: "doctor:skills",
      label: "Skills",
      healthCheckIds: ["core/doctor/skills-readiness"],
      run: runSkillsHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:bootstrap-size",
      label: "Bootstrap size",
      healthCheckIds: ["core/doctor/bootstrap-size"],
      run: runBootstrapSizeHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:heartbeat-template-repair",
      label: "Heartbeat template repair",
      healthChecks: {
        id: "core/doctor/heartbeat-template",
        description: "Legacy HEARTBEAT.md documentation templates are findings.",
        defaultEnabled: false,
        async detect(ctx) {
          const { collectHeartbeatTemplateHealthFindings } =
            await import("./doctor-heartbeat-template-repair-wTwUAxyr.js");
          return await collectHeartbeatTemplateHealthFindings(ctx.cfg);
        },
      },
      run: runHeartbeatTemplateRepairHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:shell-completion",
      label: "Shell completion",
      healthCheckIds: ["core/doctor/shell-completion"],
      run: runShellCompletionHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:gateway-health",
      label: "Gateway health",
      healthCheckIds: ["core/doctor/gateway-health"],
      run: runGatewayHealthChecks,
    }),
    createDoctorHealthContribution({
      id: "doctor:whatsapp-responsiveness",
      label: "WhatsApp responsiveness",
      healthChecks: {
        id: "core/doctor/whatsapp-responsiveness",
        description:
          "WhatsApp responsiveness pressure from degraded Gateway and local TUI clients.",
        defaultEnabled: false,
        async detect(ctx) {
          const { collectWhatsappResponsivenessHealthFindings } =
            await import("./doctor-whatsapp-responsiveness-W2WKBAVw.js");
          let status;
          if (
            !(
              (await hasActiveGatewayExecCredential({ cfg: ctx.cfg })) &&
              ctx.allowExecSecretRefs !== true
            )
          ) {
            const { callGateway } = await import("./call-BtFiTrFI.js");
            status = await callGateway({
              method: "status",
              params: { includeChannelSummary: false },
              timeoutMs: 3e3,
              config: ctx.cfg,
              deviceIdentity: null,
            }).catch(() => void 0);
          }
          return collectWhatsappResponsivenessHealthFindings({
            cfg: ctx.cfg,
            status,
          });
        },
      },
      run: runWhatsappResponsivenessHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:memory-search",
      label: "Memory search",
      healthChecks: {
        description: "Memory search provider and backend readiness are captured as findings.",
        defaultEnabled: false,
        detect: collectMemorySearchHealthFindings,
      },
      run: runMemorySearchHealthContribution,
    }),
    createDoctorHealthContribution({
      id: "doctor:device-pairing",
      label: "Device pairing",
      healthChecks: {
        id: "core/doctor/device-pairing",
        description: "Device pairing requests and stale device-auth records are findings.",
        defaultEnabled: false,
        async detect(ctx) {
          const { collectDevicePairingHealthFindings } =
            await import("./doctor-device-pairing-CljpDFzA.js");
          return await collectDevicePairingHealthFindings({
            cfg: ctx.cfg,
            healthOk: false,
          });
        },
      },
      run: runDevicePairingHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:gateway-daemon",
      label: "Gateway daemon",
      healthCheckIds: ["core/doctor/gateway-daemon"],
      run: runGatewayDaemonHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:write-config",
      label: "Write config",
      healthChecks: {
        id: "core/doctor/write-config",
        description: "Config write blockers are findings before doctor repair writes.",
        defaultEnabled: false,
        detect: collectWriteConfigHealthFindings,
      },
      run: runWriteConfigHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:workspace-suggestions",
      label: "Workspace suggestions",
      healthCheckIds: ["core/doctor/workspace-suggestions"],
      run: runWorkspaceSuggestionsHealth,
    }),
    createDoctorHealthContribution({
      id: "doctor:final-config-validation",
      label: "Final config validation",
      healthCheckIds: ["core/doctor/final-config-validation"],
      run: runFinalConfigValidationHealth,
    }),
  ];
}
async function resolveDoctorContributionHealthChecks() {
  const { CORE_HEALTH_CHECKS } = await import("./doctor-core-checks-DmtnTWa-.js");
  const checksById = new Map(CORE_HEALTH_CHECKS.map((check) => [check.id, check]));
  const checks = [];
  for (const contribution of resolveDoctorHealthContributions()) {
    if (contribution.healthChecks.length > 0) {
      checks.push(...contribution.healthChecks.map(normalizeHealthCheck));
      continue;
    }
    for (const id of contribution.healthCheckIds) {
      const check = checksById.get(id);
      if (check === void 0)
        throw new Error(
          `doctor contribution ${contribution.id} references unknown core health check ${id}`,
        );
      checks.push(check);
    }
  }
  return checks;
}
async function runDoctorHealthContributions(ctx) {
  for (const contribution of resolveDoctorHealthContributions()) await contribution.run(ctx);
}
//#endregion
export {
  shouldSkipLegacyUpdateDoctorConfigWrite as a,
  runDoctorHealthContributions as i,
  resolveDoctorContributionHealthChecks as n,
  resolveDoctorHealthContributions as r,
  createDoctorHealthContribution as t,
};
