import { constants } from "node:fs";
import fs$1 from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { t as resolveChannelInboundAttachmentRoots } from "./channel-inbound-roots-CnP4OM7H.js";
import { r as resolveDefaultModelForAgent } from "./codex-plugin-diagnostics-DxsLhCf5.js";
import {
  d as getMediaUnderstandingProvider,
  u as buildMediaUnderstandingRegistry,
} from "./defaults.constants-Ci5WOufw.js";
import { n as runExec } from "./exec-CXKmx4dL.js";
import { a as shouldLogVerbose, r as logVerbose } from "./globals-CNUzHTcU.js";
import { r as mergeInboundPathRoots } from "./inbound-path-policy-CH_uJYn5.js";
import { i as getOrCreatePromise } from "./lazy-promise-EhsWch5m.js";
import {
  i as createLazyRuntimeNamedExport,
  r as createLazyRuntimeModule,
} from "./lazy-runtime-B-Fc-m0I.js";
import "./model-selection-DOlkTrQa.js";
import { a as getDefaultMediaLocalRoots } from "./local-roots-CgMgS9r2.js";
import { a as logWarn } from "./logger-BegyOJlO.js";
import { n as isMinimaxVlmProvider, t as isMinimaxVlmModel } from "./minimax-vlm-TmmO9Dl7.js";
import {
  i as resolveAgentModelPrimaryValue,
  r as resolveAgentModelFallbackValues,
} from "./model-input-B7OGjVYg.js";
import {
  i as buildModelAliasIndex,
  u as inferUniqueProviderFromConfiguredModels,
  x as resolveModelRefFromString,
} from "./model-selection-shared-BliwFXJy.js";
import { n as resolveOpenAiAudioAuthModelApi } from "./openai-audio-api-BEkNYRPi.js";
import { n as findNormalizedProviderValue } from "./provider-id-BIcU_2-A.js";
import {
  n as normalizeMediaProviderId,
  t as normalizeMediaExecutionProviderId,
} from "./provider-id-DSbuCFIb.js";
import { t as providerSupportsCapability } from "./provider-supports-msSTK_XS.js";
import { a as resolveModelEntries, s as resolveScopeDecision } from "./resolve-CmR3wGR-.js";
import {
  S as selectAttachments,
  _ as clearLocalAudioInspectionCacheForTests,
  a as runCliEntry,
  b as MediaAttachmentCache,
  o as runProviderEntry,
  r as formatDecisionSummary,
  t as buildModelDecision,
  w as normalizeAttachments,
  x as isMediaUnderstandingSkipError,
  y as inspectLocalAudioSelection,
} from "./runner.entries-BYq5cGUt.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  o as normalizeNullableString,
} from "./string-coerce-DW4mBlAt.js";
import {
  _ as uniqueStrings,
  l as normalizeStringEntries,
} from "./string-normalization-CRyoFBPt.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-uPgNO8da.js";
//#region src/media-understanding/runner.attachments.ts
/** Normalizes message context media fields for the media-understanding runner. */
function normalizeMediaAttachments(ctx) {
  const attachments = normalizeAttachments(ctx);
  return ctx.SkipStickerMediaUnderstanding
    ? attachments.filter((attachment) => attachment.index !== 0)
    : attachments;
}
/** Creates the lazy attachment cache used by image, audio, video, and document providers. */
function createMediaAttachmentCache(attachments, options) {
  return new MediaAttachmentCache(attachments, options);
}
//#endregion
//#region src/media-understanding/runner.ts
const loadHasAvailableAuthForProvider = createLazyRuntimeNamedExport(
  () => import("./model-auth-C6PbJmme.js"),
  "hasAvailableAuthForProvider",
);
const loadModelCatalogApi = createLazyRuntimeModule(
  async () => await import("./model-catalog-CKXmb4DJ.js"),
);
function resolveLiteralProviderApiKey(cfg, providerId) {
  return normalizeNullableString(
    findNormalizedProviderValue(cfg?.models?.providers, providerId)?.apiKey,
  );
}
async function hasProviderAuthAvailable(params) {
  if (resolveLiteralProviderApiKey(params.cfg, params.provider)) return true;
  return await (
    await loadHasAvailableAuthForProvider()
  )({
    ...params,
    modelApi: resolveOpenAiAudioAuthModelApi({
      capability: params.capability,
      providerId: params.provider,
    }),
  });
}
function resolveConfiguredKeyProviderOrder(params) {
  return uniqueStrings([
    ...uniqueStrings(
      Object.keys(params.cfg.models?.providers ?? {})
        .map((providerId) => normalizeMediaExecutionProviderId(providerId))
        .filter(Boolean),
    ).filter((providerId) =>
      providerSupportsCapability(
        params.providerRegistry.get(normalizeMediaProviderId(providerId)),
        params.capability,
      ),
    ),
    ...params.fallbackProviders,
  ]);
}
function resolveConfiguredImageModelId(params) {
  if (isMinimaxVlmProvider(params.providerId)) return;
  return resolveConfiguredImageModel(params)?.id?.trim() || void 0;
}
function resolveConfiguredImageModel(params) {
  return findNormalizedProviderValue(params.cfg.models?.providers, params.providerId)?.models?.find(
    (entry) => {
      const id = entry?.id?.trim();
      return Boolean(id) && entry?.input?.includes("image");
    },
  );
}
function resolveCatalogImageModelId(params) {
  const matches = params.catalog.filter(
    (entry) =>
      normalizeMediaProviderId(entry.provider) === normalizeMediaProviderId(params.providerId) &&
      params.modelSupportsVision(entry),
  );
  if (matches.length === 0) return;
  return normalizeOptionalString(
    (matches.find((entry) => normalizeLowercaseStringOrEmpty(entry.id) === "auto") ?? matches[0])
      ?.id,
  );
}
function resolveDefaultMediaModelFromRegistry(params) {
  return normalizeOptionalString(
    params.providerRegistry.get(normalizeMediaProviderId(params.providerId))?.defaultModels?.[
      params.capability
    ],
  );
}
function resolveAutoMediaKeyProvidersFromRegistry(params) {
  return [...params.providerRegistry.values()]
    .filter(
      (provider) =>
        provider.capabilities?.includes(params.capability) ??
        providerSupportsCapability(provider, params.capability),
    )
    .map((provider) => {
      const priority = provider.autoPriority?.[params.capability];
      return typeof priority === "number" && Number.isFinite(priority)
        ? {
            provider,
            priority,
          }
        : null;
    })
    .filter((entry) => entry !== null)
    .toSorted((left, right) => {
      if (left.priority !== right.priority) return left.priority - right.priority;
      return left.provider.id.localeCompare(right.provider.id);
    })
    .map((entry) => normalizeMediaProviderId(entry.provider.id))
    .filter(Boolean);
}
async function explicitImageModelVisionStatus(params) {
  if (
    isMinimaxVlmProvider(params.providerId) &&
    !isMinimaxVlmModel(params.providerId, params.model)
  )
    return "unsupported";
  const configured = resolveConfiguredImageModel(params);
  if (configured?.id?.trim() === params.model && configured.input?.includes("image"))
    return "supported";
  const { findModelInCatalog, loadModelCatalog, modelSupportsVision } = await loadModelCatalogApi();
  const entry = findModelInCatalog(
    await loadModelCatalog({ config: params.cfg }),
    params.providerId,
    params.model,
  );
  if (!entry) return "unknown";
  return modelSupportsVision(entry) ? "supported" : "unsupported";
}
async function resolveAutoImageModelId(params) {
  const explicit = normalizeOptionalString(params.explicitModel);
  if (explicit) {
    if (
      (await explicitImageModelVisionStatus({
        cfg: params.cfg,
        providerId: params.providerId,
        model: explicit,
      })) !== "unsupported"
    )
      return explicit;
  }
  if (isMinimaxVlmProvider(params.providerId)) return "MiniMax-VL-01";
  const configuredModel = resolveConfiguredImageModelId(params);
  if (configuredModel) return configuredModel;
  const defaultModel = resolveDefaultMediaModelFromRegistry({
    providerId: params.providerId,
    capability: "image",
    providerRegistry: params.providerRegistry,
  });
  if (defaultModel) return defaultModel;
  const { resolveDefaultMediaModel } = await import("./defaults-aXYbjksP.js");
  const bundledDefaultModel = resolveDefaultMediaModel({
    cfg: params.cfg,
    providerId: params.providerId,
    capability: "image",
    workspaceDir: params.workspaceDir,
  });
  if (bundledDefaultModel) return bundledDefaultModel;
  const { loadModelCatalog, modelSupportsVision } = await loadModelCatalogApi();
  const catalog = await loadModelCatalog({ config: params.cfg });
  return resolveCatalogImageModelId({
    providerId: params.providerId,
    catalog,
    modelSupportsVision,
  });
}
function buildProviderRegistry(overrides, cfg) {
  return buildMediaUnderstandingRegistry(overrides, cfg);
}
function resolveMediaAttachmentLocalRoots(params) {
  const workspaceDir = params.ctx.MediaWorkspaceDir ?? params.workspaceDir;
  return mergeInboundPathRoots(
    getDefaultMediaLocalRoots(),
    workspaceDir ? [path.resolve(workspaceDir)] : void 0,
    resolveChannelInboundAttachmentRoots(params),
  );
}
const binaryCache = /* @__PURE__ */ new Map();
const antigravityCliCache = /* @__PURE__ */ new Map();
function clearMediaUnderstandingBinaryCacheForTests() {
  binaryCache.clear();
  antigravityCliCache.clear();
  clearLocalAudioInspectionCacheForTests();
}
function expandHomeDir(value) {
  if (!value.startsWith("~")) return value;
  const home = os.homedir();
  if (value === "~") return home;
  if (value.startsWith("~/")) return path.join(home, value.slice(2));
  return value;
}
function hasPathSeparator(value) {
  return value.includes("/") || value.includes("\\");
}
function candidateBinaryNames(name) {
  if (process.platform !== "win32") return [name];
  if (path.extname(name)) return [name];
  return [
    name,
    ...uniqueStrings(
      normalizeStringEntries((process.env.PATHEXT ?? ".EXE;.CMD;.BAT;.COM").split(";")).map(
        (item) => (item.startsWith(".") ? item : `.${item}`),
      ),
    ).map((item) => `${name}${item}`),
  ];
}
async function isExecutable(filePath) {
  try {
    if (!(await fs$1.stat(filePath)).isFile()) return false;
    if (process.platform === "win32") return true;
    await fs$1.access(filePath, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}
async function findBinary(name) {
  return await getOrCreatePromise(binaryCache, name, async () => {
    const direct = expandHomeDir(name.trim());
    if (direct && hasPathSeparator(direct)) {
      for (const candidate of candidateBinaryNames(direct))
        if (await isExecutable(candidate)) return candidate;
    }
    const searchName = name.trim();
    if (!searchName) return null;
    const pathEntries = (process.env.PATH ?? "").split(path.delimiter);
    const candidates = candidateBinaryNames(searchName);
    for (const entryRaw of pathEntries) {
      const entry = expandHomeDir(entryRaw.trim().replace(/^"(.*)"$/, "$1"));
      if (!entry) continue;
      for (const candidate of candidates) {
        const fullPath = path.join(entry, candidate);
        if (await isExecutable(fullPath)) return fullPath;
      }
    }
    return null;
  });
}
async function probeAntigravityCliCandidate(command) {
  const resolved = await findBinary(command);
  if (!resolved) return null;
  const probeDir = await fs$1.mkdtemp(
    path.join(resolvePreferredOpenClawTmpDir(), "openclaw-antigravity-probe-"),
  );
  try {
    const { stdout } = await runExec(resolved, ["--help"], {
      timeoutMs: 3e3,
      cwd: probeDir,
    });
    return stdout.includes("--print") &&
      stdout.includes("--add-dir") &&
      stdout.includes("--sandbox")
      ? resolved
      : null;
  } catch {
    return null;
  } finally {
    await fs$1
      .rm(probeDir, {
        recursive: true,
        force: true,
      })
      .catch(() => {});
  }
}
async function resolveAntigravityCliBinary() {
  return await getOrCreatePromise(antigravityCliCache, "agy", async () => {
    const candidates = [process.env.OPENCLAW_ANTIGRAVITY_CLI?.trim(), "agy", "antigravity"].filter(
      (value) => Boolean(value),
    );
    for (const candidate of candidates) {
      const command = await probeAntigravityCliCandidate(candidate);
      if (command) return command;
    }
    return null;
  });
}
async function resolveAntigravityCliEntry(capability) {
  if (capability === "audio") return null;
  const command = await resolveAntigravityCliBinary();
  if (!command) return null;
  return {
    type: "cli",
    command,
    args: [
      "--sandbox",
      "--add-dir",
      "{{MediaDir}}",
      "--print",
      "{{Prompt}} Inspect {{MediaPath}} and reply with only the requested media description.",
    ],
  };
}
async function resolveKeyEntry(params) {
  const { cfg, agentDir, workspaceDir, providerRegistry, capability } = params;
  const checkProvider = async (providerId, model) => {
    const provider = getMediaUnderstandingProvider(providerId, providerRegistry);
    if (!provider) return null;
    if (capability === "audio" && !provider.transcribeAudio) return null;
    if (capability === "image" && !provider.describeImage) return null;
    if (capability === "video" && !provider.describeVideo) return null;
    if (
      !(await hasProviderAuthAvailable({
        capability,
        provider: providerId,
        cfg,
        agentDir,
        workspaceDir,
      }))
    )
      return null;
    const resolvedModel =
      capability === "image"
        ? await resolveAutoImageModelId({
            cfg,
            providerId,
            providerRegistry,
            explicitModel: model,
            workspaceDir,
          })
        : capability === "audio"
          ? resolveDefaultMediaModelFromRegistry({
              providerId,
              capability: "audio",
              providerRegistry,
            })
          : (model ??
            resolveDefaultMediaModelFromRegistry({
              providerId,
              capability: "video",
              providerRegistry,
            }));
    if (capability === "image" && !resolvedModel) return null;
    return {
      type: "provider",
      provider: providerId,
      model: resolvedModel,
    };
  };
  const activeProvider = params.activeModel?.provider?.trim();
  if (activeProvider) {
    const activeEntry = await checkProvider(activeProvider, params.activeModel?.model);
    if (activeEntry) return activeEntry;
  }
  for (const providerId of resolveConfiguredKeyProviderOrder({
    cfg,
    providerRegistry,
    capability,
    fallbackProviders: resolveAutoMediaKeyProvidersFromRegistry({
      capability,
      providerRegistry,
    }),
  })) {
    const entry = await checkProvider(providerId, void 0);
    if (entry) return entry;
  }
  return null;
}
function resolveImageModelFromAgentDefaults(params) {
  const refs = [];
  const primary = resolveAgentModelPrimaryValue(params.cfg.agents?.defaults?.imageModel);
  if (primary?.trim()) refs.push(primary.trim());
  for (const fb of resolveAgentModelFallbackValues(params.cfg.agents?.defaults?.imageModel))
    if (fb?.trim()) refs.push(fb.trim());
  if (refs.length === 0) return [];
  const defaultProvider = resolveDefaultModelForAgent({
    cfg: params.cfg,
    agentId: params.agentId,
  }).provider;
  const entries = [];
  for (const ref of refs) {
    const effectiveDefaultProvider = ref.includes("/")
      ? defaultProvider
      : (inferUniqueProviderFromConfiguredModels({
          cfg: params.cfg,
          model: ref,
        }) ?? defaultProvider);
    const aliasIndex = buildModelAliasIndex({
      cfg: params.cfg,
      defaultProvider: effectiveDefaultProvider,
    });
    const resolved = resolveModelRefFromString({
      cfg: params.cfg,
      raw: ref,
      defaultProvider: effectiveDefaultProvider,
      aliasIndex,
    });
    if (!resolved) continue;
    entries.push({
      type: "provider",
      provider: resolved.ref.provider,
      model: resolved.ref.model,
    });
  }
  return entries;
}
function hasExplicitImageUnderstandingConfig(params) {
  return (params.config?.models?.length ?? 0) > 0;
}
function isMinimaxNativeVisionModel(params) {
  return (
    isMinimaxVlmProvider(params.provider) &&
    /^MiniMax-M3(\b|[-.])/i.test(params.model?.trim() ?? "")
  );
}
async function activeModelSupportsNativeVision(params) {
  const activeProvider = params.activeModel?.provider?.trim();
  if (!activeProvider) return false;
  if (
    isMinimaxVlmProvider(activeProvider) &&
    !isMinimaxNativeVisionModel({
      provider: activeProvider,
      model: params.activeModel?.model,
    })
  )
    return false;
  const { findModelInCatalog, loadModelCatalog, modelSupportsVision } = await loadModelCatalogApi();
  return modelSupportsVision(
    findModelInCatalog(
      await loadModelCatalog({ config: params.cfg }),
      activeProvider,
      params.activeModel?.model ?? "",
    ),
  );
}
async function resolveAutoEntries(params) {
  if (params.capability === "image") {
    if (
      !(await activeModelSupportsNativeVision({
        cfg: params.cfg,
        activeModel: params.activeModel,
      }))
    ) {
      const imageModelEntries = resolveImageModelFromAgentDefaults({
        cfg: params.cfg,
        agentId: params.agentId,
      });
      if (imageModelEntries.length > 0) return imageModelEntries;
    }
  }
  const activeEntry = await resolveActiveModelEntry(params);
  if (activeEntry) return [activeEntry];
  if (params.capability === "audio") {
    const keyEntry = await resolveKeyEntry(params);
    if (keyEntry) return [keyEntry];
    const localAudio = await inspectLocalAudioSelection();
    if (localAudio.entries.length > 0) return localAudio.entries;
  }
  const keys = await resolveKeyEntry(params);
  if (keys) return [keys];
  const antigravity = await resolveAntigravityCliEntry(params.capability);
  if (antigravity) return [antigravity];
  return [];
}
async function resolveAutoImageModel(params) {
  const providerRegistry = buildProviderRegistry(void 0, params.cfg);
  const toActive = (entry) => {
    if (!entry || entry.type === "cli") return null;
    const provider = entry.provider;
    const model = entry.model?.trim();
    if (!provider || !model) return null;
    return {
      provider,
      model,
    };
  };
  const configuredImageModel = resolveImageModelFromAgentDefaults({
    cfg: params.cfg,
    agentId: params.agentId,
  })
    .map((entry) => toActive(entry))
    .find((entry) => entry !== null);
  if (configuredImageModel) return configuredImageModel;
  const resolvedActive = toActive(
    await resolveActiveModelEntry({
      cfg: params.cfg,
      agentDir: params.agentDir,
      workspaceDir: params.workspaceDir,
      providerRegistry,
      capability: "image",
      activeModel: params.activeModel,
    }),
  );
  if (resolvedActive) return resolvedActive;
  return toActive(
    await resolveKeyEntry({
      cfg: params.cfg,
      agentDir: params.agentDir,
      workspaceDir: params.workspaceDir,
      providerRegistry,
      capability: "image",
      activeModel: params.activeModel,
    }),
  );
}
async function resolveActiveModelEntry(params) {
  const activeProviderRaw = params.activeModel?.provider?.trim();
  if (!activeProviderRaw) return null;
  const providerId = normalizeMediaExecutionProviderId(activeProviderRaw);
  if (!providerId) return null;
  const provider = getMediaUnderstandingProvider(providerId, params.providerRegistry);
  if (!provider) return null;
  if (params.capability === "audio" && !provider.transcribeAudio) return null;
  if (params.capability === "image" && !provider.describeImage) return null;
  if (params.capability === "video" && !provider.describeVideo) return null;
  if (
    !(await hasProviderAuthAvailable({
      capability: params.capability,
      provider: providerId,
      cfg: params.cfg,
      agentDir: params.agentDir,
      workspaceDir: params.workspaceDir,
    }))
  )
    return null;
  let model;
  if (params.capability === "image")
    model = await resolveAutoImageModelId({
      cfg: params.cfg,
      providerId,
      providerRegistry: params.providerRegistry,
      explicitModel: params.activeModel?.model,
      workspaceDir: params.workspaceDir,
    });
  else if (params.capability === "audio")
    model = resolveDefaultMediaModelFromRegistry({
      providerId,
      capability: "audio",
      providerRegistry: params.providerRegistry,
    });
  else
    model =
      params.activeModel?.model ??
      resolveDefaultMediaModelFromRegistry({
        providerId,
        capability: "video",
        providerRegistry: params.providerRegistry,
      });
  if (params.capability === "image" && !model) return null;
  return {
    type: "provider",
    provider: providerId,
    model,
  };
}
async function runAttachmentEntries(params) {
  const { entries, capability } = params;
  const attempts = [];
  for (const entry of entries) {
    const entryType = entry.type ?? (entry.command ? "cli" : "provider");
    try {
      const result =
        entryType === "cli"
          ? await runCliEntry({
              capability,
              entry,
              cfg: params.cfg,
              ctx: params.ctx,
              attachmentIndex: params.attachmentIndex,
              cache: params.cache,
              config: params.config,
            })
          : await runProviderEntry({
              capability,
              entry,
              cfg: params.cfg,
              ctx: params.ctx,
              attachmentIndex: params.attachmentIndex,
              cache: params.cache,
              agentDir: params.agentDir,
              workspaceDir: params.workspaceDir,
              providerRegistry: params.providerRegistry,
              config: params.config,
            });
      if (result) {
        const decision = buildModelDecision({
          entry,
          entryType,
          outcome: "success",
        });
        if (result.provider) decision.provider = result.provider;
        if (result.model) decision.model = result.model;
        if (result.requestedBackend) decision.requestedBackend = result.requestedBackend;
        if (result.observedBackend) decision.observedBackend = result.observedBackend;
        attempts.push(decision);
        return {
          output: result,
          attempts,
        };
      }
      attempts.push(
        buildModelDecision({
          entry,
          entryType,
          outcome: "skipped",
          reason: "empty output",
        }),
      );
    } catch (err) {
      if (isMediaUnderstandingSkipError(err)) {
        attempts.push(
          buildModelDecision({
            entry,
            entryType,
            outcome: "skipped",
            reason: `${err.reason}: ${err.message}`,
          }),
        );
        if (shouldLogVerbose())
          logVerbose(`Skipping ${capability} model due to ${err.reason}: ${err.message}`);
        continue;
      }
      attempts.push(
        buildModelDecision({
          entry,
          entryType,
          outcome: "failed",
          reason: String(err),
        }),
      );
      if (shouldLogVerbose()) logVerbose(`${capability} understanding failed: ${String(err)}`);
    }
  }
  return {
    output: null,
    attempts,
  };
}
function hasFailedMediaAttempt(attachments) {
  return attachments.some((attachment) =>
    attachment.attempts.some((attempt) => attempt.outcome === "failed"),
  );
}
async function runCapability(params) {
  const { capability, cfg, ctx } = params;
  const config = params.config ?? cfg.tools?.media?.[capability];
  if (config?.enabled === false)
    return {
      outputs: [],
      decision: {
        capability,
        outcome: "disabled",
        attachments: [],
      },
    };
  const attachmentPolicy = config?.attachments;
  const selected = selectAttachments({
    capability,
    attachments: params.media,
    policy: attachmentPolicy,
  });
  if (selected.length === 0)
    return {
      outputs: [],
      decision: {
        capability,
        outcome: "no-attachment",
        attachments: [],
      },
    };
  if (
    resolveScopeDecision({
      scope: config?.scope,
      ctx,
    }) === "deny"
  ) {
    if (shouldLogVerbose()) logVerbose(`${capability} understanding disabled by scope policy.`);
    return {
      outputs: [],
      decision: {
        capability,
        outcome: "scope-deny",
        attachments: selected.map((item) => ({
          attachmentIndex: item.index,
          attempts: [],
        })),
      },
    };
  }
  const activeProvider = params.activeModel?.provider?.trim();
  if (
    capability === "image" &&
    activeProvider &&
    !hasExplicitImageUnderstandingConfig({ config })
  ) {
    if (
      await activeModelSupportsNativeVision({
        cfg,
        activeModel: params.activeModel,
      })
    ) {
      if (shouldLogVerbose())
        logVerbose("Skipping image understanding: primary model supports vision natively");
      const model = params.activeModel?.model?.trim();
      const reason = "primary model supports vision natively";
      return {
        outputs: [],
        decision: {
          capability,
          outcome: "skipped",
          attachments: selected.map((item) => {
            const attempt = {
              type: "provider",
              provider: activeProvider,
              model: model || void 0,
              outcome: "skipped",
              reason,
            };
            return {
              attachmentIndex: item.index,
              attempts: [attempt],
              chosen: attempt,
            };
          }),
        },
      };
    }
  }
  let resolvedEntries = resolveModelEntries({
    cfg,
    capability,
    config,
    providerRegistry: params.providerRegistry,
  });
  if (resolvedEntries.length === 0)
    resolvedEntries = await resolveAutoEntries({
      cfg,
      agentId: params.agentId,
      agentDir: params.agentDir,
      workspaceDir: params.workspaceDir,
      providerRegistry: params.providerRegistry,
      capability,
      activeModel: params.activeModel,
    });
  if (resolvedEntries.length === 0)
    return {
      outputs: [],
      decision: {
        capability,
        outcome: "skipped",
        attachments: selected.map((item) => ({
          attachmentIndex: item.index,
          attempts: [],
        })),
      },
    };
  const outputs = [];
  const attachmentDecisions = [];
  for (const attachment of selected) {
    const { output, attempts } = await runAttachmentEntries({
      capability,
      cfg,
      ctx,
      attachmentIndex: attachment.index,
      agentDir: params.agentDir,
      workspaceDir: params.workspaceDir,
      providerRegistry: params.providerRegistry,
      cache: params.attachments,
      entries: resolvedEntries,
      config,
    });
    if (output) outputs.push(output);
    attachmentDecisions.push({
      attachmentIndex: attachment.index,
      attempts,
      chosen: attempts.find((attempt) => attempt.outcome === "success"),
    });
  }
  const decision = {
    capability,
    outcome:
      outputs.length > 0
        ? "success"
        : hasFailedMediaAttempt(attachmentDecisions)
          ? "failed"
          : "skipped",
    attachments: attachmentDecisions,
  };
  if (decision.outcome === "failed")
    logWarn(`media-understanding: ${formatDecisionSummary(decision)}`);
  else if (shouldLogVerbose()) logVerbose(`Media understanding ${formatDecisionSummary(decision)}`);
  return {
    outputs,
    decision,
  };
}
//#endregion
export {
  runCapability as a,
  resolveMediaAttachmentLocalRoots as i,
  clearMediaUnderstandingBinaryCacheForTests as n,
  createMediaAttachmentCache as o,
  resolveAutoImageModel as r,
  normalizeMediaAttachments as s,
  buildProviderRegistry as t,
};
