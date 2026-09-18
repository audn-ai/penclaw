import fs from "node:fs";
import {
  a as resolveAgentDir,
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import "./src-Bl7G9qvi.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { c as normalizePluginsConfig } from "./config-state-C1Qyxaws.js";
import {
  i as maybeRepairWorkspaceMemoryHealth,
  o as noteWorkspaceMemoryHealth,
} from "./doctor-workspace-aTRVuJ96.js";
import {
  r as resolveQmdBinaryUnavailableReason,
  t as checkQmdBinaryAvailability,
} from "./engine-qmd-sbHvD8ZT.js";
import "./utils-DtcDeqWS.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { t as formatByteSize } from "./format-DBMNwbgU.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import "./agent-scope-y9xQv_q1.js";
import {
  c as repairShortTermPromotionArtifacts,
  n as auditDreamingArtifacts,
  r as auditShortTermPromotionArtifacts,
  s as repairDreamingArtifacts,
} from "./memory-core-engine-runtime-DNGHoSRz.js";
import {
  i as resolveActiveMemoryBackendConfig,
  r as getActiveMemorySearchManager,
} from "./memory-runtime-CzgrvPt7.js";
import { t as resolveMemorySearchConfig } from "./memory-search-C1x_ATR9.js";
import "./auth-profiles-CX7JDmZ9.js";
import {
  f as resolveApiKeyForProvider,
  g as resolveUsableCustomProviderApiKey,
} from "./model-auth-BWFdcEzF.js";
import { t as resolveEnvApiKey } from "./model-auth-env-DLe5znyS.js";
import { t as note } from "./note-Uvqr4R1d.js";
import { t as isConfiguredAwsSdkAuthProfileForProvider } from "./order-BNCpk81x.js";
import { t as getProviderEnvVars } from "./provider-env-vars-BZiQzob_.js";
import {
  n as findNormalizedProviderValue,
  r as normalizeProviderId,
} from "./provider-id-BIcU_2-A.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { t as hasConfiguredMemorySecretInput } from "./secret-input-BxM5UYg1.js";
import { n as defaultSlotIdForKey } from "./slots-kpL659LX.js";
import "./legacy-config-record-shared-COKcbmOX.js";
import {
  n as hasAuthProfileStoreSourceForProvider,
  t as hasAnyAuthProfileStoreSource,
} from "./source-check-yAijvhd5.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/commands/doctor-memory-search.ts
function formatRuntimeBytes(bytes) {
  return formatByteSize(bytes, {
    style: "legacy-binary",
    maxUnit: "tera",
    separator: " ",
    fractionDigits: (value, unit) => (unit === "byte" ? null : value >= 10 ? 0 : 1),
  });
}
function formatLocalRuntimeDoctorNote(facts) {
  const backend = facts.backend ?? "unknown";
  const build = facts.buildType ? `, ${facts.buildType}` : "";
  const devices = facts.deviceNames?.length ? `\nDevices: ${facts.deviceNames.join(", ")}` : "";
  const memory = facts.memory
    ? `\nVRAM snapshot: ${formatRuntimeBytes(facts.memory.usedBytes)} used, ${formatRuntimeBytes(facts.memory.freeBytes)} free, ${formatRuntimeBytes(facts.memory.totalBytes)} total${facts.memory.unifiedBytes > 0 ? `, ${formatRuntimeBytes(facts.memory.unifiedBytes)} unified` : ""} (${new Date(facts.memory.observedAtMs).toISOString()})`
    : "";
  const offload =
    typeof facts.offload?.offloadedLayers === "number" &&
    typeof facts.offload.totalLayers === "number"
      ? `\nGPU offload: ${facts.offload.offloadedLayers}/${facts.offload.totalLayers} layers`
      : facts.offload
        ? `\nGPU offload: ${facts.offload.supported ? "supported" : "unsupported"}`
        : "";
  const context = facts.context ? `\nRequested context: ${facts.context.requestedSize} tokens` : "";
  const loadError = facts.loadError ? `\nLoad error: ${facts.loadError}` : "";
  return `llama.cpp runtime: ${backend}${build}${facts.state === "ready" ? "" : ` (${facts.state})`}${devices}${memory}${offload}${context}${loadError}`;
}
const BUNDLED_MEMORY_EMBEDDING_PROVIDER_DOCTOR_METADATA = [
  {
    providerId: "github-copilot",
    authProviderId: "github-copilot",
    transport: "remote",
    autoSelectPriority: 15,
  },
  {
    providerId: "openai",
    authProviderId: "openai",
    transport: "remote",
    autoSelectPriority: 20,
  },
  {
    providerId: "gemini",
    authProviderId: "google",
    transport: "remote",
    autoSelectPriority: 30,
  },
  {
    providerId: "voyage",
    authProviderId: "voyage",
    transport: "remote",
    autoSelectPriority: 40,
  },
  {
    providerId: "mistral",
    authProviderId: "mistral",
    transport: "remote",
    autoSelectPriority: 50,
  },
  {
    providerId: "bedrock",
    authProviderId: "amazon-bedrock",
    transport: "remote",
    autoSelectPriority: 60,
  },
];
const DEFAULT_MEMORY_EMBEDDING_PROVIDER = "openai";
const OPENAI_COMPATIBLE_MEMORY_EMBEDDING_PROVIDER = "openai-compatible";
const OPENAI_COMPATIBLE_MODEL_APIS = /* @__PURE__ */ new Set([
  "openai-completions",
  "openai-responses",
]);
function resolveMemoryEmbeddingProviderDoctorMetadata(providerId) {
  const metadata =
    BUNDLED_MEMORY_EMBEDDING_PROVIDER_DOCTOR_METADATA.find(
      (candidate) => candidate.providerId === providerId,
    ) ?? null;
  if (!metadata) return null;
  return {
    ...metadata,
    envVars: getProviderEnvVars(metadata.authProviderId),
  };
}
function listAutoSelectMemoryEmbeddingProviderDoctorMetadata() {
  return BUNDLED_MEMORY_EMBEDDING_PROVIDER_DOCTOR_METADATA.filter(
    (provider) => typeof provider.autoSelectPriority === "number",
  )
    .toSorted((a, b) => (a.autoSelectPriority ?? 0) - (b.autoSelectPriority ?? 0))
    .map((provider) => ({
      providerId: provider.providerId,
      authProviderId: provider.authProviderId,
      transport: provider.transport,
      autoSelectPriority: provider.autoSelectPriority,
      envVars: getProviderEnvVars(provider.authProviderId),
    }));
}
function resolveSuggestedRemoteMemoryProvider() {
  return listAutoSelectMemoryEmbeddingProviderDoctorMetadata().find(
    (provider) => provider.transport === "remote",
  )?.providerId;
}
function hasConfiguredAwsSdkAuthForProvider(provider, cfg) {
  if (findNormalizedProviderValue(cfg.models?.providers, provider)?.auth === "aws-sdk") return true;
  return (
    findNormalizedProviderValue(cfg.auth?.order, provider) ??
    (cfg.auth?.profiles ? Object.keys(cfg.auth.profiles) : [])
  ).some((profileId) =>
    isConfiguredAwsSdkAuthProfileForProvider({
      cfg,
      provider,
      profileId,
    }),
  );
}
function isOpenAICompatibleMemoryProvider(providerId, cfg) {
  const normalizedProviderId = normalizeProviderId(providerId);
  if (normalizedProviderId === OPENAI_COMPATIBLE_MEMORY_EMBEDDING_PROVIDER) return true;
  if (
    BUNDLED_MEMORY_EMBEDDING_PROVIDER_DOCTOR_METADATA.some(
      (provider) => provider.providerId === normalizedProviderId,
    )
  )
    return false;
  const providerConfig = findNormalizedProviderValue(cfg.models?.providers, providerId);
  if (!providerConfig) return false;
  const api = normalizeProviderId(providerConfig.api ?? "");
  if (api === OPENAI_COMPATIBLE_MEMORY_EMBEDDING_PROVIDER || OPENAI_COMPATIBLE_MODEL_APIS.has(api))
    return true;
  return !api && Boolean(normalizeOptionalString(providerConfig.baseUrl));
}
function resolveOpenAICompatibleMemoryBaseUrl(providerId, cfg, remoteBaseUrl) {
  return (
    normalizeOptionalString(remoteBaseUrl) ??
    normalizeOptionalString(findNormalizedProviderValue(cfg.models?.providers, providerId)?.baseUrl)
  );
}
function isKeyOptionalMemoryProvider(providerId, cfg) {
  return (
    providerId === "local" ||
    providerId === "ollama" ||
    providerId === "lmstudio" ||
    isOpenAICompatibleMemoryProvider(providerId, cfg)
  );
}
async function resolveRuntimeMemoryAuditContext(cfg) {
  const manager = (
    await getActiveMemorySearchManager({
      cfg,
      agentId: resolveDefaultAgentId(cfg),
      purpose: "status",
    })
  ).manager;
  if (!manager) return null;
  try {
    const status = manager.status();
    const customQmd =
      isRecord(status.custom) && isRecord(status.custom.qmd) ? status.custom.qmd : null;
    return {
      workspaceDir: status.workspaceDir?.trim(),
      backend: status.backend,
      dbPath: status.dbPath,
      qmdCollections: typeof customQmd?.collections === "number" ? customQmd.collections : void 0,
    };
  } finally {
    await manager.close?.().catch(() => void 0);
  }
}
function buildMemoryRecallIssueNote(audit) {
  if (audit.issues.length === 0) return null;
  const issueLines = audit.issues.map((issue) => `- ${issue.message}`);
  const guidance = audit.issues.some((issue) => issue.fixable)
    ? `Fix: ${formatCliCommand("openclaw doctor --fix")} or ${formatCliCommand("openclaw memory status --fix")}`
    : `Verify: ${formatCliCommand("openclaw memory status --deep")}`;
  return [
    "Memory recall artifacts need attention:",
    ...issueLines,
    `Recall store: ${audit.storePath}`,
    guidance,
  ].join("\n");
}
function buildDreamingArtifactIssueNote(audit) {
  if (audit.issues.length === 0) return null;
  const issueLines = audit.issues.map((issue) => `- ${issue.message}`);
  const hasFixableIssue = audit.issues.some((issue) => issue.fixable);
  return [
    "Dreaming artifacts need attention:",
    ...issueLines,
    `Dream corpus: ${audit.sessionCorpusDir}`,
    hasFixableIssue
      ? `Fix: ${formatCliCommand("openclaw doctor --fix")} or ${formatCliCommand("openclaw memory status --fix")}`
      : `Verify: ${formatCliCommand("openclaw memory status --deep")}`,
  ].join("\n");
}
async function noteMemoryRecallHealth(cfg) {
  try {
    const context = await resolveRuntimeMemoryAuditContext(cfg);
    const workspaceDir = context?.workspaceDir?.trim();
    if (!workspaceDir) return;
    const message = buildMemoryRecallIssueNote(
      await auditShortTermPromotionArtifacts({
        workspaceDir,
        qmd:
          context?.backend === "qmd"
            ? {
                dbPath: context.dbPath,
                collections: context.qmdCollections,
              }
            : void 0,
      }),
    );
    if (message) note(message, "Memory search");
    const dreamingMessage = buildDreamingArtifactIssueNote(
      await auditDreamingArtifacts({ workspaceDir }),
    );
    if (dreamingMessage) note(dreamingMessage, "Memory search");
  } catch (err) {
    note(`Memory recall audit could not be completed: ${formatErrorMessage(err)}`, "Memory search");
  }
}
async function maybeRepairMemoryRecallHealth(params) {
  await maybeRepairWorkspaceMemoryHealth(params);
  try {
    const context = await resolveRuntimeMemoryAuditContext(params.cfg);
    const workspaceDir = context?.workspaceDir?.trim();
    if (!workspaceDir) return;
    if (
      (
        await auditShortTermPromotionArtifacts({
          workspaceDir,
          qmd:
            context?.backend === "qmd"
              ? {
                  dbPath: context.dbPath,
                  collections: context.qmdCollections,
                }
              : void 0,
        })
      ).issues.some((issue) => issue.fixable)
    ) {
      if (
        await params.prompter.confirmRuntimeRepair({
          message: "Normalize memory recall artifacts and remove stale promotion locks?",
          initialValue: true,
        })
      ) {
        const repair = await repairShortTermPromotionArtifacts({ workspaceDir });
        if (repair.changed) {
          const removedOverflowEntries = repair.removedOverflowEntries ?? 0;
          const details = [
            repair.removedInvalidEntries > 0
              ? `-${repair.removedInvalidEntries} invalid entries`
              : null,
            removedOverflowEntries > 0 ? `-${removedOverflowEntries} overflow entries` : null,
          ]
            .filter(Boolean)
            .join(", ");
          note(
            [
              "Memory recall artifacts repaired:",
              repair.rewroteStore
                ? `- rewrote recall store${details ? ` (${details})` : ""}`
                : null,
              repair.removedStaleLock ? "- removed stale promotion lock" : null,
              `Verify: ${formatCliCommand("openclaw memory status --deep")}`,
            ]
              .filter(Boolean)
              .join("\n"),
            "Doctor changes",
          );
        }
      }
    }
    if (!(await auditDreamingArtifacts({ workspaceDir })).issues.some((issue) => issue.fixable))
      return;
    if (
      !(await params.prompter.confirmRuntimeRepair({
        message: "Archive contaminated dreaming artifacts and reset derived dream corpus state?",
        initialValue: true,
      }))
    )
      return;
    const dreamingRepair = await repairDreamingArtifacts({ workspaceDir });
    if (!dreamingRepair.changed) return;
    note(
      [
        "Dreaming artifacts repaired:",
        dreamingRepair.archivedSessionCorpus ? "- archived session corpus" : null,
        dreamingRepair.archivedSessionIngestion ? "- archived session-ingestion state" : null,
        dreamingRepair.archivedDreamsDiary ? "- archived dream diary" : null,
        dreamingRepair.archiveDir ? `- archive dir: ${dreamingRepair.archiveDir}` : null,
        ...dreamingRepair.warnings.map((warning) => `- warning: ${warning}`),
        `Verify: ${formatCliCommand("openclaw memory status --deep")}`,
      ]
        .filter(Boolean)
        .join("\n"),
      "Doctor changes",
    );
  } catch (err) {
    note(
      `Memory artifact repair could not be completed: ${formatErrorMessage(err)}`,
      "Memory search",
    );
  }
}
function hasActiveAlternateMemoryPluginSlot(cfg) {
  const plugins = normalizePluginsConfig(cfg.plugins);
  if (!plugins.enabled) return false;
  const memorySlot = plugins.slots.memory;
  if (typeof memorySlot !== "string" || memorySlot.length === 0) return false;
  if (memorySlot === defaultSlotIdForKey("memory")) return false;
  if (plugins.deny.includes(memorySlot)) return false;
  if (!Object.hasOwn(plugins.entries, memorySlot)) return false;
  const entry = plugins.entries[memorySlot];
  if (!entry || entry.enabled === false) return false;
  return entry.enabled === true || entry.config !== void 0;
}
/**
 * Check whether memory search has a usable embedding provider.
 * Runs as part of `openclaw doctor` — config-only checks where possible;
 * may spawn a short-lived probe process when `memory.backend=qmd` to verify
 * the configured `qmd` binary is available.
 */
async function noteMemorySearchHealth(cfg, opts) {
  const noteFn = opts?.noteFn ?? note;
  if (opts?.includeWorkspaceMemoryHealth !== false) await noteWorkspaceMemoryHealth(cfg);
  const agentId = resolveDefaultAgentId(cfg);
  const agentDir = resolveAgentDir(cfg, agentId);
  const resolved = resolveMemorySearchConfig(cfg, agentId);
  const hasRemoteApiKey = hasConfiguredMemorySecretInput(resolved?.remote?.apiKey);
  if (!resolved) {
    noteFn("Memory search is explicitly disabled (enabled: false).", "Memory search");
    return;
  }
  const provider =
    resolved.provider === "auto" ? DEFAULT_MEMORY_EMBEDDING_PROVIDER : resolved.provider;
  const backendConfig = resolveActiveMemoryBackendConfig({
    cfg,
    agentId,
  });
  if (!backendConfig) {
    if (opts?.gatewayMemoryProbe?.checked && opts.gatewayMemoryProbe.ready) return;
    if (hasActiveAlternateMemoryPluginSlot(cfg)) return;
    noteFn("No active memory plugin is registered for the current config.", "Memory search");
    return;
  }
  if (backendConfig.backend === "qmd") {
    if (opts?.skipQmdBinaryProbe !== true) {
      const qmdCheck = await checkQmdBinaryAvailability({
        command: backendConfig.qmd?.command ?? "qmd",
        env: process.env,
        cwd: resolveAgentWorkspaceDir(cfg, agentId),
      });
      if (!qmdCheck.available) {
        const workspaceProbeFailed =
          resolveQmdBinaryUnavailableReason(qmdCheck) === "workspace-cwd";
        const probeError = qmdCheck.error.trim();
        noteFn(
          [
            workspaceProbeFailed
              ? "QMD memory backend is configured, but the agent workspace directory could not be used for the QMD startup probe."
              : `QMD memory backend is configured, but the qmd binary could not be started (${backendConfig.qmd?.command ?? "qmd"}).`,
            probeError ? `Probe error: ${probeError}` : null,
            "",
            "Fix (pick one):",
            workspaceProbeFailed
              ? "- Create the missing workspace directory or update the agent workspace path to an existing directory."
              : "- Install the supported QMD package: npm install -g @tobilu/qmd (or bun install -g @tobilu/qmd)",
            workspaceProbeFailed
              ? "- Verify the resolved workspace path for the affected agent before retrying."
              : `- Set an explicit binary path: ${formatCliCommand("openclaw config set memory.qmd.command /absolute/path/to/qmd")}`,
            `- Or switch back to builtin memory: ${formatCliCommand("openclaw config set memory.backend builtin")}`,
            "",
            `Verify: ${formatCliCommand("openclaw memory status --deep")}`,
          ]
            .filter(Boolean)
            .join("\n"),
          "Memory search",
        );
      }
    }
    if (resolved.sources?.includes("sessions") && cfg.memory?.qmd?.sessions?.enabled !== true)
      noteFn(
        [
          "QMD memory backend is configured and the default agent resolves memorySearch.sources with sessions,",
          "but QMD session transcript export is not enabled (memory.qmd.sessions.enabled is not true).",
          "Session transcript hits will not appear in QMD-backed memory search until QMD session export is enabled.",
          "",
          "Fix (pick one):",
          `- Enable QMD session export: ${formatCliCommand("openclaw config set memory.qmd.sessions.enabled true")}`,
          "- Or remove sessions from the default agent's memorySearch.sources if QMD session recall is not intended.",
          "",
          `Verify: ${formatCliCommand("openclaw memory status --deep")}`,
        ].join("\n"),
        "Memory search",
      );
    return;
  }
  if (provider === "local") {
    const suggestedRemoteProvider = resolveSuggestedRemoteMemoryProvider();
    const runtimeFacts = opts?.gatewayMemoryProbe?.runtimeFacts;
    if (opts?.gatewayMemoryProbe?.checked && opts.gatewayMemoryProbe.ready) {
      if (runtimeFacts) noteFn(formatLocalRuntimeDoctorNote(runtimeFacts), "Memory search");
      return;
    }
    const hasExplicitLocalModel = hasLocalEmbeddings(resolved.local);
    const hasUnavailableConfiguredLocalModel =
      Boolean(normalizeOptionalString(resolved.local.modelPath)) && !hasExplicitLocalModel;
    if (opts?.gatewayMemoryProbe?.skipped && !hasUnavailableConfiguredLocalModel) return;
    const detail = opts?.gatewayMemoryProbe?.error?.trim();
    const gatewayDetail = detail && detail !== runtimeFacts?.loadError ? detail : null;
    noteFn(
      [
        runtimeFacts ? formatLocalRuntimeDoctorNote(runtimeFacts) : null,
        runtimeFacts ? "" : null,
        hasExplicitLocalModel
          ? 'Memory search provider is set to "local" and a local model path is configured, but local embeddings are not confirmed ready.'
          : 'Memory search provider is set to "local", but local embeddings are not confirmed ready.',
        gatewayDetail ? `Gateway probe: ${gatewayDetail}` : null,
        "",
        "Fix (pick one):",
        `- Install the llama.cpp provider plugin: ${formatCliCommand("openclaw plugins install @openclaw/llama-cpp-provider")}`,
        `- Set a local GGUF model path in config`,
        suggestedRemoteProvider
          ? `- Switch to a remote provider: ${formatCliCommand(`openclaw config set agents.defaults.memorySearch.provider ${suggestedRemoteProvider}`)}`
          : `- Switch to a remote embedding provider in config`,
        "",
        `Verify: ${formatCliCommand("openclaw memory status --deep")}`,
      ]
        .filter(Boolean)
        .join("\n"),
      "Memory search",
    );
    return;
  }
  if (
    isOpenAICompatibleMemoryProvider(provider, cfg) &&
    !resolveOpenAICompatibleMemoryBaseUrl(provider, cfg, resolved.remote?.baseUrl)
  ) {
    noteFn(
      [
        `Memory search provider is set to "${provider}" but no OpenAI-compatible embeddings endpoint was configured.`,
        "Set agents.defaults.memorySearch.remote.baseUrl to the /v1 endpoint for your embeddings server.",
        "",
        "Fix:",
        `- ${formatCliCommand("openclaw config set agents.defaults.memorySearch.remote.baseUrl http://127.0.0.1:1234/v1")}`,
        "",
        `Verify: ${formatCliCommand("openclaw memory status --deep")}`,
      ].join("\n"),
      "Memory search",
    );
    return;
  }
  if (isOpenAICompatibleMemoryProvider(provider, cfg) && !normalizeOptionalString(resolved.model)) {
    noteFn(
      [
        `Memory search provider is set to "${provider}" but no OpenAI-compatible embedding model was configured.`,
        "Set agents.defaults.memorySearch.model to the embedding model id your server expects.",
        "",
        "Fix:",
        `- ${formatCliCommand("openclaw config set agents.defaults.memorySearch.model text-embedding-bge-m3")}`,
        "",
        `Verify: ${formatCliCommand("openclaw memory status --deep")}`,
      ].join("\n"),
      "Memory search",
    );
    return;
  }
  if (isKeyOptionalMemoryProvider(provider, cfg)) {
    if (opts?.gatewayMemoryProbe?.checked && opts.gatewayMemoryProbe.ready) return;
    if (opts?.gatewayMemoryProbe?.skipped) return;
    const gatewayProbeWarning = buildGatewayProbeWarning(opts?.gatewayMemoryProbe);
    noteFn(
      [
        gatewayProbeWarning
          ? `Memory search provider "${provider}" is configured, but the gateway reports embeddings are not ready.`
          : `Memory search provider "${provider}" is configured, but the gateway could not confirm embeddings are ready.`,
        gatewayProbeWarning,
        `Verify: ${formatCliCommand("openclaw memory status --deep")}`,
      ]
        .filter(Boolean)
        .join("\n"),
      "Memory search",
    );
    return;
  }
  if (
    hasRemoteApiKey ||
    (await hasApiKeyForProvider(provider, cfg, agentDir, {
      skipProfileResolution: opts?.skipAuthProfileResolution === true,
    }))
  )
    return;
  if (opts?.gatewayMemoryProbe?.checked && opts.gatewayMemoryProbe.ready) {
    noteFn(
      [
        `Memory search provider is set to "${provider}" but the API key was not found in the CLI environment.`,
        "The running gateway reports memory embeddings are ready for the default agent.",
        `Verify: ${formatCliCommand("openclaw memory status --deep")}`,
      ].join("\n"),
      "Memory search",
    );
    return;
  }
  const gatewayProbeWarning = buildGatewayProbeWarning(opts?.gatewayMemoryProbe);
  const envVar = resolvePrimaryMemoryProviderEnvVar(provider);
  noteFn(
    [
      `Memory search provider is set to "${provider}" but no API key was found.`,
      `Semantic recall will not work without a valid API key.`,
      gatewayProbeWarning ? gatewayProbeWarning : null,
      "",
      "Fix (pick one):",
      `- Set ${envVar} in your environment`,
      `- Configure credentials: ${formatCliCommand("openclaw configure --section model")}`,
      `- To disable: ${formatCliCommand("openclaw config set agents.defaults.memorySearch.enabled false")}`,
      "",
      `Verify: ${formatCliCommand("openclaw memory status --deep")}`,
    ].join("\n"),
    "Memory search",
  );
}
/**
 * Check whether local embeddings are available.
 *
 */
function hasLocalEmbeddings(local) {
  const modelPath = normalizeOptionalString(local.modelPath);
  if (!modelPath) return false;
  if (/^(hf:|https?:)/i.test(modelPath)) return true;
  const resolved = resolveUserPath(modelPath);
  try {
    return fs.statSync(resolved).isFile();
  } catch {
    return false;
  }
}
async function hasApiKeyForProvider(provider, cfg, agentDir, opts) {
  const authProviderId =
    resolveMemoryEmbeddingProviderDoctorMetadata(provider)?.authProviderId ?? provider;
  if (
    resolveEnvApiKey(authProviderId) ||
    resolveUsableCustomProviderApiKey({
      cfg,
      provider: authProviderId,
    })
  )
    return true;
  if (opts?.skipProfileResolution === true) {
    if (authProviderId === "amazon-bedrock")
      return hasConfiguredAwsSdkAuthForProvider(authProviderId, cfg);
    const orderedProfileIds = findNormalizedProviderValue(cfg.auth?.order, authProviderId);
    return orderedProfileIds === void 0
      ? hasAuthProfileStoreSourceForProvider(authProviderId, agentDir)
      : hasAuthProfileStoreSourceForProvider(authProviderId, agentDir, {
          profileIds: orderedProfileIds,
        });
  }
  if (authProviderId !== "amazon-bedrock" && !hasAnyAuthProfileStoreSource(agentDir)) return false;
  try {
    await resolveApiKeyForProvider({
      provider: authProviderId,
      cfg,
      agentDir,
    });
    return true;
  } catch {
    return false;
  }
}
function resolvePrimaryMemoryProviderEnvVar(provider) {
  if (provider === "openai") return "OPENAI_API_KEY";
  return (
    resolveMemoryEmbeddingProviderDoctorMetadata(provider)?.envVars[0] ??
    `${provider.toUpperCase()}_API_KEY`
  );
}
function buildGatewayProbeWarning(probe) {
  if (!probe?.checked || probe.ready) return null;
  const detail = probe.error?.trim();
  return detail
    ? `Gateway memory probe for default agent is not ready: ${detail}`
    : "Gateway memory probe for default agent is not ready.";
}
//#endregion
export { maybeRepairMemoryRecallHealth, noteMemoryRecallHealth, noteMemorySearchHealth };
