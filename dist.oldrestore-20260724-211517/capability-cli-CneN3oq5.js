import { randomUUID } from "node:crypto";
import { createWriteStream } from "node:fs";
import "./parse-finite-number-Z7n6tXLk.js";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { a as resolveAgentDir, c as resolveDefaultAgentId } from "./agent-scope-config-DVIR1nBa.js";
import "./agent-scope-y9xQv_q1.js";
import { _ as randomIdempotencyKey, c as callGateway } from "./call-BVMO6az_.js";
import { n as runCommandWithRuntime } from "./cli-utils-f3ET47a0.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-Br1guPTt.js";
import { t as resolveCommandConfigWithSecrets } from "./command-config-resolution-Ca6zEZc0.js";
import {
  a as getCapabilityWebSearchCommandSecretTargets,
  c as getMemoryEmbeddingCommandSecretTargetIds,
  l as getModelsCommandSecretTargetIds,
  m as getTtsCommandSecretTargetIds,
  r as getCapabilityWebFetchCommandSecretTargets,
} from "./command-secret-targets-Dm7sNhry.js";
import { t as removeCommandByName } from "./command-tree-CA1ToIBK.js";
import "./thinking-CVcRbjTC.js";
import { r as resolveGeneratedMediaMaxBytes } from "./configured-max-bytes-RHpfttuD.js";
import { t as buildGatewayConnectionDetailsWithResolvers } from "./connection-details-ByYgagYn.js";
import "./config-BDv-QbJ6.js";
import { r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { u as buildMediaUnderstandingRegistry } from "./defaults.constants-Ci5WOufw.js";
import {
  o as listSpeechProviders,
  r as canonicalizeSpeechProviderId,
} from "./directives-Bnz26kFk.js";
import { n as listEmbeddingProviders } from "./embedding-provider-runtime-BSH7bFMk.js";
import { t as collectOption } from "./helpers-WGaRKVcg.js";
import { d as readResponseWithLimit } from "./http-body-aoMvQQlg.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import "./auth-profiles-CX7JDmZ9.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { s as convertHeicToJpeg, u as getImageMetadata } from "./media-services-Czws84B5.js";
import { t as createEmbeddingProvider } from "./memory-core-bundled-runtime-7rVZrzKd.js";
import { t as resolveMemorySearchConfig } from "./memory-search-C1x_ATR9.js";
import { n as detectMime, r as extensionForMime, u as normalizeMimeType } from "./mime-BSEMEb3s.js";
import { f as resolveApiKeyForProvider } from "./model-auth-BWFdcEzF.js";
import { n as loadModelCatalog } from "./model-catalog-DxYvPELu.js";
import { a as runWithImageModelFallback } from "./model-fallback-CQfk1H6I.js";
import { i as resolveAgentModelPrimaryValue } from "./model-input-B7OGjVYg.js";
import { n as canonicalizeCaseOnlyCatalogModelRef } from "./model-selection-DOlkTrQa.js";
import { i as isLoopbackHost } from "./net-BpMGIYrw.js";
import {
  _ as parseStrictFiniteNumber,
  b as parseStrictPositiveInteger,
} from "./number-coercion-CJQ8TR--.js";
import { t as ADMIN_SCOPE } from "./operator-scopes-CpPJIv7P.js";
import { n as parseTimeoutMsWithFallback } from "./parse-timeout-DZMZaF9B.js";
import { n as listProfilesForProvider } from "./profile-list-I4BheGlK.js";
import { t as getProviderEnvVars } from "./provider-env-vars-BZiQzob_.js";
import { r as assertOkOrThrowHttpError } from "./provider-http-errors-DLMRBkZU.js";
import { u as sanitizeConfiguredModelProviderRequest } from "./provider-request-config-DpW-uV6A.js";
import "./tts-BzX0GOhC.js";
import { T as listMemoryEmbeddingProviders } from "./registry-B14M_H8G.js";
import { y as inspectLocalAudioSelection } from "./runner.entries-BYq5cGUt.js";
import {
  n as listRuntimeImageGenerationProviders,
  t as generateImage,
} from "./runtime-0eEMS5sH.js";
import { i as writeRuntimeJson, r as defaultRuntime } from "./runtime-Bz6o617W.js";
import {
  c as transcribeAudioFile,
  i as describeVideoFile,
  o as prepareImageDescriptionInput,
  r as describePreparedImageWithModel,
  t as describeImageFile,
} from "./runtime-BzZe4Z88.js";
import {
  i as resolveWebFetchDefinition,
  n as isWebFetchProviderConfigured,
  r as listWebFetchProviders,
} from "./runtime-Dda60aJo.js";
import {
  n as listRuntimeVideoGenerationProviders,
  t as generateVideo,
} from "./runtime-DTZO5SxU.js";
import "./provider-http-BDIltggC.js";
import {
  a as runWebSearch,
  r as listWebSearchProviders,
  t as isWebSearchProviderConfigured,
} from "./runtime-Inp394Wl.js";
import {
  s as getRuntimeConfigSourceSnapshot,
  x as setRuntimeConfigSnapshot,
} from "./runtime-snapshot-BbbqRiDR.js";
import { t as buildExplicitSessionIdSessionKey } from "./session-CABQ2dYG.js";
import {
  o as fetchWithTimeoutGuarded,
  p as resolveProviderHttpRequestConfig,
} from "./shared-CfGzzOqJ.js";
import {
  r as prepareSimpleCompletionModelForAgent,
  t as completeWithPreparedSimpleCompletionModel,
} from "./simple-completion-runtime-DThW6g7z.js";
import {
  u as loadAuthProfileStoreForRuntime,
  y as updateAuthProfileStoreWithLock,
} from "./store-B7DoDdVM.js";
import { u as saveMediaBuffer } from "./store-BfbXoJVN.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  f as normalizeStringifiedOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { s as normalizeThinkLevel } from "./thinking.shared-BWnbgBUO.js";
import {
  S as setTtsEnabled,
  T as setTtsProvider,
  _ as resolveTtsPrefsPath,
  d as listSpeechVoices,
  f as listTtsPersonas,
  g as resolveTtsConfig,
  k as textToSpeech,
  m as resolveExplicitTtsOverrides,
  o as getTtsPersona,
  s as getTtsProvider,
  w as setTtsPersona,
} from "./tts-runtime-D_fIXfNP.js";
//#region src/cli/capability-cli.ts
const IMAGE_OUTPUT_FORMATS = ["png", "jpeg", "webp"];
const IMAGE_BACKGROUNDS = ["transparent", "opaque", "auto"];
const GENERATED_VIDEO_DOWNLOAD_TIMEOUT_MS = 12e4;
const LOCAL_MODEL_RUN_SYSTEM_PROMPT = "You are a personal assistant running inside OpenClaw.";
const HEIC_MODEL_RUN_MIMES = /* @__PURE__ */ new Set(["image/heic", "image/heif"]);
const CAPABILITY_METADATA = [
  {
    id: "model.run",
    description: "Run a one-shot inference turn through the selected model provider.",
    transports: ["local", "gateway"],
    flags: ["--prompt", "--file", "--model", "--thinking", "--local", "--gateway", "--json"],
    resultShape: "normalized payloads plus provider/model attribution",
  },
  {
    id: "model.list",
    description: "List known models from the model catalog.",
    transports: ["local"],
    flags: ["--json"],
    resultShape: "catalog entries",
  },
  {
    id: "model.inspect",
    description: "Inspect one model catalog entry.",
    transports: ["local"],
    flags: ["--model", "--json"],
    resultShape: "single catalog entry",
  },
  {
    id: "model.providers",
    description: "List model providers discovered from the catalog.",
    transports: ["local"],
    flags: ["--json"],
    resultShape: "provider ids with counts and defaults",
  },
  {
    id: "model.auth.login",
    description: "Run the existing provider auth login flow.",
    transports: ["local"],
    flags: ["--provider", "--method"],
    resultShape: "interactive auth result",
  },
  {
    id: "model.auth.logout",
    description: "Remove saved auth profiles for one provider.",
    transports: ["local"],
    flags: ["--provider", "--agent", "--json"],
    resultShape: "removed profile ids",
  },
  {
    id: "model.auth.status",
    description: "Show configured model auth state.",
    transports: ["local"],
    flags: ["--json"],
    resultShape: "model status summary",
  },
  {
    id: "image.generate",
    description: "Generate raster images with configured image providers.",
    transports: ["local"],
    flags: [
      "--prompt",
      "--model",
      "--count",
      "--size",
      "--aspect-ratio",
      "--resolution",
      "--output-format",
      "--background",
      "--openai-background",
      "--openai-moderation",
      "--quality",
      "--timeout-ms",
      "--output",
      "--json",
    ],
    resultShape: "saved image files plus attempts",
  },
  {
    id: "image.edit",
    description: "Generate edited images from one or more input files.",
    transports: ["local"],
    flags: [
      "--file",
      "--prompt",
      "--model",
      "--count",
      "--size",
      "--aspect-ratio",
      "--resolution",
      "--output-format",
      "--background",
      "--openai-background",
      "--openai-moderation",
      "--quality",
      "--timeout-ms",
      "--output",
      "--json",
    ],
    resultShape: "saved image files plus attempts",
  },
  {
    id: "image.describe",
    description: "Describe one image file through media-understanding providers.",
    transports: ["local"],
    flags: ["--file", "--prompt", "--model", "--timeout-ms", "--json"],
    resultShape: "normalized text output",
  },
  {
    id: "image.describe-many",
    description: "Describe multiple image files independently.",
    transports: ["local"],
    flags: ["--file", "--prompt", "--model", "--timeout-ms", "--json"],
    resultShape: "one text output per file",
  },
  {
    id: "image.providers",
    description: "List image generation providers.",
    transports: ["local"],
    flags: ["--json"],
    resultShape: "provider ids and defaults",
  },
  {
    id: "audio.transcribe",
    description: "Transcribe one audio file.",
    transports: ["local"],
    flags: ["--file", "--language", "--prompt", "--model", "--json"],
    resultShape: "normalized text output",
  },
  {
    id: "audio.providers",
    description: "List audio transcription providers.",
    transports: ["local"],
    flags: ["--json"],
    resultShape: "provider ids and capabilities",
  },
  {
    id: "tts.convert",
    description: "Convert text to speech.",
    transports: ["local", "gateway"],
    flags: [
      "--text",
      "--channel",
      "--voice",
      "--model",
      "--output",
      "--local",
      "--gateway",
      "--json",
    ],
    resultShape: "saved audio file plus attempts",
  },
  {
    id: "tts.voices",
    description: "List voices for a speech provider.",
    transports: ["local"],
    flags: ["--provider", "--json"],
    resultShape: "voice entries",
  },
  {
    id: "tts.providers",
    description: "List speech providers.",
    transports: ["local", "gateway"],
    flags: ["--local", "--gateway", "--json"],
    resultShape: "provider ids, configured state, models, voices",
  },
  {
    id: "tts.personas",
    description: "List TTS personas.",
    transports: ["local", "gateway"],
    flags: ["--local", "--gateway", "--json"],
    resultShape: "persona ids, labels, providers, active persona",
  },
  {
    id: "tts.status",
    description: "Show gateway-managed TTS state.",
    transports: ["gateway"],
    flags: ["--gateway", "--json"],
    resultShape: "enabled/provider state",
  },
  {
    id: "tts.enable",
    description: "Enable TTS in prefs.",
    transports: ["local", "gateway"],
    flags: ["--local", "--gateway", "--json"],
    resultShape: "enabled state",
  },
  {
    id: "tts.disable",
    description: "Disable TTS in prefs.",
    transports: ["local", "gateway"],
    flags: ["--local", "--gateway", "--json"],
    resultShape: "enabled state",
  },
  {
    id: "tts.set-provider",
    description: "Set the active TTS provider.",
    transports: ["local", "gateway"],
    flags: ["--provider", "--local", "--gateway", "--json"],
    resultShape: "selected provider",
  },
  {
    id: "tts.set-persona",
    description: "Set the active TTS persona.",
    transports: ["local", "gateway"],
    flags: ["--persona", "--off", "--local", "--gateway", "--json"],
    resultShape: "selected persona",
  },
  {
    id: "video.generate",
    description: "Generate video files with configured video providers.",
    transports: ["local"],
    flags: [
      "--prompt",
      "--model",
      "--size",
      "--aspect-ratio",
      "--resolution",
      "--duration",
      "--audio",
      "--watermark",
      "--timeout-ms",
      "--output",
      "--json",
    ],
    resultShape: "saved video files plus attempts",
  },
  {
    id: "video.describe",
    description: "Describe one video file through media-understanding providers.",
    transports: ["local"],
    flags: ["--file", "--model", "--json"],
    resultShape: "normalized text output",
  },
  {
    id: "video.providers",
    description: "List video generation and description providers.",
    transports: ["local"],
    flags: ["--json"],
    resultShape: "provider ids and defaults",
  },
  {
    id: "web.search",
    description: "Run provider-backed web search.",
    transports: ["local"],
    flags: ["--query", "--provider", "--limit", "--json"],
    resultShape: "search provider result",
  },
  {
    id: "web.fetch",
    description: "Fetch URL content through configured web fetch providers.",
    transports: ["local"],
    flags: ["--url", "--provider", "--format", "--json"],
    resultShape: "fetch provider result",
  },
  {
    id: "web.providers",
    description: "List web search and fetch providers.",
    transports: ["local"],
    flags: ["--json"],
    resultShape: "provider ids grouped by family",
  },
  {
    id: "embedding.create",
    description: "Create embeddings through embedding providers.",
    transports: ["local"],
    flags: ["--text", "--provider", "--model", "--json"],
    resultShape: "vectors with provider/model attribution",
  },
  {
    id: "embedding.providers",
    description: "List embedding providers.",
    transports: ["local"],
    flags: ["--json"],
    resultShape: "provider ids and default models",
  },
];
function findCapabilityMetadata(id) {
  return CAPABILITY_METADATA.find((entry) => entry.id === id);
}
function resolveTransport(opts) {
  if (opts.local && opts.gateway) throw new Error("Pass only one of --local or --gateway.");
  if (opts.local) {
    if (!opts.supported.includes("local"))
      throw new Error("This command does not support --local.");
    return "local";
  }
  if (opts.gateway) {
    if (!opts.supported.includes("gateway"))
      throw new Error("This command does not support --gateway.");
    return "gateway";
  }
  return opts.defaultTransport;
}
function emitJsonOrText(runtime, json, value, textFormatter) {
  if (json) {
    writeRuntimeJson(runtime, value);
    return;
  }
  runtime.log(textFormatter(value));
}
function formatEnvelopeForText(value) {
  const envelope = value;
  if (!envelope.ok) return `${envelope.capability} failed: ${envelope.error ?? "unknown error"}`;
  const lines = [
    `${envelope.capability} via ${envelope.transport}`,
    ...(envelope.provider ? [`provider: ${envelope.provider}`] : []),
    ...(envelope.model ? [`model: ${envelope.model}`] : []),
    ...(envelope.ignoredOverrides && envelope.ignoredOverrides.length > 0
      ? [`ignoredOverrides: ${JSON.stringify(envelope.ignoredOverrides)}`]
      : []),
    `outputs: ${String(envelope.outputs.length)}`,
  ];
  for (const output of envelope.outputs) {
    const pathValue = typeof output.path === "string" ? output.path : void 0;
    const textValue = typeof output.text === "string" ? output.text : void 0;
    if (pathValue) lines.push(pathValue);
    else if (textValue) lines.push(textValue);
    else lines.push(JSON.stringify(output));
  }
  return lines.join("\n");
}
function providerSummaryText(value) {
  return value.map((entry) => JSON.stringify(entry)).join("\n");
}
function hasOwnKeys(value) {
  return Boolean(value && typeof value === "object" && Object.keys(value).length > 0);
}
function resolveSelectedProviderFromModelRef(modelRef) {
  return resolveModelRefOverride(modelRef).provider;
}
function getAuthProfileIdsForProvider(cfg, providerId) {
  return listProfilesForProvider(
    loadAuthProfileStoreForRuntime(resolveAgentDir(cfg, resolveDefaultAgentId(cfg))),
    providerId,
  );
}
function providerHasGenericConfig(params) {
  const modelsProviders = params.cfg.models?.providers ?? {};
  const pluginEntries = params.cfg.plugins?.entries ?? {};
  const ttsProviders = params.cfg.messages?.tts?.providers ?? {};
  const envConfigured = (params.envVars ?? []).some((envVar) =>
    Boolean(process.env[envVar]?.trim()),
  );
  return (
    getAuthProfileIdsForProvider(params.cfg, params.providerId).length > 0 ||
    hasOwnKeys(modelsProviders[params.providerId]) ||
    hasOwnKeys(pluginEntries[params.providerId]?.config) ||
    hasOwnKeys(ttsProviders[params.providerId]) ||
    envConfigured
  );
}
async function writeOutputAsset(params) {
  if (!params.outputPath) {
    const saved = await saveMediaBuffer(
      params.buffer,
      params.mimeType,
      params.subdir,
      Number.MAX_SAFE_INTEGER,
      params.originalFilename,
    );
    return {
      path: saved.path,
      mimeType: saved.contentType,
      size: saved.size,
    };
  }
  const resolvedOutput = path.resolve(params.outputPath);
  const parsed = path.parse(resolvedOutput);
  const detectedMime =
    (await detectMime({
      buffer: params.buffer,
      headerMime: params.mimeType,
    })) ?? params.mimeType;
  const requestedMime = normalizeMimeType(await detectMime({ filePath: resolvedOutput }));
  const detectedNormalized = normalizeMimeType(detectedMime);
  const canonicalDetectedExt = extensionForMime(detectedNormalized);
  const fallbackExt = parsed.ext || path.extname(params.originalFilename ?? "") || "";
  const ext =
    parsed.ext && requestedMime === detectedNormalized
      ? parsed.ext
      : (canonicalDetectedExt ?? fallbackExt);
  const filePath =
    params.outputCount <= 1
      ? path.join(parsed.dir, `${parsed.name}${ext}`)
      : path.join(parsed.dir, `${parsed.name}-${String(params.outputIndex + 1)}${ext}`);
  await fs$1.mkdir(path.dirname(filePath), { recursive: true });
  await fs$1.writeFile(filePath, params.buffer);
  return {
    path: filePath,
    mimeType: detectedNormalized ?? params.mimeType,
    size: params.buffer.byteLength,
  };
}
async function readInputFiles(files) {
  return await Promise.all(
    files.map(async (filePath) => ({
      path: path.resolve(filePath),
      buffer: await fs$1.readFile(path.resolve(filePath)),
    })),
  );
}
function resolveModelRefOverride(raw) {
  const trimmed = raw?.trim();
  if (!trimmed) return {};
  const slash = trimmed.indexOf("/");
  if (slash <= 0 || slash === trimmed.length - 1) return { model: trimmed };
  return {
    provider: trimmed.slice(0, slash),
    model: trimmed.slice(slash + 1),
  };
}
async function canonicalizeModelRunRef(params) {
  return await canonicalizeCaseOnlyCatalogModelRef({
    cfg: params.cfg,
    raw: params.raw,
    defaultProvider: DEFAULT_PROVIDER,
    loadCatalog: () =>
      loadModelCatalog({
        config: params.cfg,
        readOnly: true,
      }),
    preserveAuthProfile: params.preserveAuthProfile,
  });
}
function requireProviderModelOverride(raw) {
  const resolved = resolveModelRefOverride(raw);
  if (!raw?.trim()) return;
  if (!resolved.provider || !resolved.model)
    throw new Error("Model overrides must use the form <provider/model>.");
  return {
    provider: resolved.provider,
    model: resolved.model,
  };
}
function collectModelRunText(content) {
  return content
    .map((block) => (block.type === "text" && typeof block.text === "string" ? block.text : ""))
    .join("")
    .trim();
}
function requireModelRunPrompt(value) {
  if (typeof value !== "string" || normalizeOptionalString(value) === void 0)
    throw new Error("--prompt cannot be empty or whitespace-only.");
  return value;
}
async function readModelRunImageFiles(files) {
  if (!files || files.length === 0) return [];
  return await Promise.all(
    files.map(async (filePath) => {
      const resolvedPath = path.resolve(filePath);
      const buffer = await fs$1.readFile(resolvedPath);
      const mimeType = normalizeMimeType(
        await detectMime({
          buffer,
          filePath: resolvedPath,
        }),
      );
      if (!mimeType?.startsWith("image/"))
        throw new Error(
          `Unsupported --file for model run: ${resolvedPath}. Only image files are supported; use infer audio transcribe for audio files.`,
        );
      if (HEIC_MODEL_RUN_MIMES.has(mimeType)) {
        const converted = await convertHeicToJpeg(buffer);
        return {
          path: resolvedPath,
          fileName: path.basename(resolvedPath),
          mimeType: "image/jpeg",
          data: converted.toString("base64"),
        };
      }
      return {
        path: resolvedPath,
        fileName: path.basename(resolvedPath),
        mimeType,
        data: buffer.toString("base64"),
      };
    }),
  );
}
function normalizeModelRunThinking(value) {
  if (value === void 0) return;
  if (typeof value !== "string") throw new Error("--thinking must be a string.");
  const normalized = normalizeThinkLevel(value);
  if (!normalized)
    throw new Error(
      "Invalid thinking level. Use one of: off, minimal, low, medium, high, adaptive, xhigh, max.",
    );
  return normalized;
}
async function runModelRun(params) {
  const cfg =
    params.transport === "local"
      ? await resolveLocalCapabilityRuntimeConfig({
          commandName: "infer model run",
          targetIds: getModelsCommandSecretTargetIds(),
        })
      : getRuntimeConfig();
  const agentId = resolveDefaultAgentId(cfg);
  const modelRef = await canonicalizeModelRunRef({
    raw: params.model,
    cfg,
    preserveAuthProfile: params.transport === "local",
  });
  const explicitModelOverride = resolveModelRefOverride(params.model);
  const hasExplicitProviderModelOverride = Boolean(
    params.model?.trim() && explicitModelOverride.provider && explicitModelOverride.model,
  );
  const imageFiles = await readModelRunImageFiles(params.files);
  const messageContent =
    imageFiles.length > 0
      ? [
          {
            type: "text",
            text: params.prompt,
          },
          ...imageFiles.map((image) => ({
            type: "image",
            data: image.data,
            mimeType: image.mimeType,
          })),
        ]
      : params.prompt;
  if (params.transport === "local") {
    const prepared = await prepareSimpleCompletionModelForAgent({
      cfg,
      agentId,
      modelRef,
      allowMissingApiKeyModes: ["aws-sdk"],
      ...(hasExplicitProviderModelOverride ? { allowBundledStaticCatalogFallback: true } : {}),
      skipAgentDiscovery: true,
    });
    if ("error" in prepared) throw new Error(prepared.error);
    if (prepared.selection.provider === "codex")
      throw new Error(
        'The codex provider is served by the Codex app-server agent runtime, not the local simple-completion transport. Use an openai/<model> ref with provider/model agentRuntime.id: "codex", run through the gateway, or use /codex commands.',
      );
    const localModelRunSystemPrompt =
      prepared.model.api === "openai-chatgpt-responses" ? LOCAL_MODEL_RUN_SYSTEM_PROMPT : void 0;
    const result = await completeWithPreparedSimpleCompletionModel({
      model: prepared.model,
      auth: prepared.auth,
      cfg,
      context: {
        ...(localModelRunSystemPrompt ? { systemPrompt: localModelRunSystemPrompt } : {}),
        messages: [
          {
            role: "user",
            content: messageContent,
            timestamp: Date.now(),
          },
        ],
      },
      options: {
        maxTokens:
          typeof prepared.model.maxTokens === "number" && Number.isFinite(prepared.model.maxTokens)
            ? prepared.model.maxTokens
            : void 0,
        ...(params.thinking ? { reasoning: params.thinking } : {}),
      },
    });
    const text = collectModelRunText(result.content);
    if (!text) {
      const providerErrorMessage = result.errorMessage;
      const detail =
        typeof providerErrorMessage === "string" && providerErrorMessage.trim()
          ? `: ${providerErrorMessage.trim()}`
          : "";
      throw new Error(
        `No text output returned for provider "${prepared.selection.provider}" model "${prepared.selection.modelId}"${detail}.`,
      );
    }
    return {
      ok: true,
      capability: "model.run",
      transport: "local",
      provider: prepared.selection.provider,
      model: prepared.selection.modelId,
      attempts: [],
      ...(imageFiles.length > 0
        ? {
            inputs: imageFiles.map((image) => ({
              path: image.path,
              mimeType: image.mimeType,
            })),
          }
        : {}),
      outputs: [
        {
          text,
          mediaUrl: null,
        },
      ],
    };
  }
  const { provider, model } = resolveModelRefOverride(modelRef);
  const hasModelOverride = Boolean(provider || model);
  const sessionId = `model-run-${randomUUID()}`;
  const response = await callGateway({
    method: "agent",
    params: {
      agentId,
      sessionId,
      sessionKey: buildExplicitSessionIdSessionKey({
        agentId,
        sessionId,
      }),
      message: params.prompt,
      attachments:
        imageFiles.length > 0
          ? imageFiles.map((image) => ({
              type: "image",
              fileName: image.fileName,
              mimeType: image.mimeType,
              content: image.data,
            }))
          : void 0,
      provider,
      model,
      ...(params.thinking ? { thinking: params.thinking } : {}),
      modelRun: true,
      promptMode: "none",
      cleanupBundleMcpOnRunEnd: true,
      idempotencyKey: randomIdempotencyKey(),
    },
    expectFinal: true,
    timeoutMs: 12e4,
    clientName: hasModelOverride ? GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT : GATEWAY_CLIENT_NAMES.CLI,
    mode: hasModelOverride ? GATEWAY_CLIENT_MODES.BACKEND : GATEWAY_CLIENT_MODES.CLI,
    ...(hasModelOverride ? { scopes: [ADMIN_SCOPE] } : {}),
  });
  return {
    ok: true,
    capability: "model.run",
    transport: "gateway",
    provider: response?.result?.meta?.agentMeta?.provider,
    model: response?.result?.meta?.agentMeta?.model,
    attempts: response?.result?.meta?.agentMeta?.fallbackAttempts ?? [],
    outputs: (response?.result?.payloads ?? []).map((payload) => ({
      text: payload.text,
      mediaUrl: payload.mediaUrl,
      mediaUrls: payload.mediaUrls,
    })),
    ...(imageFiles.length > 0
      ? {
          inputs: imageFiles.map((image) => ({
            path: image.path,
            mimeType: image.mimeType,
          })),
        }
      : {}),
  };
}
async function buildModelProviders() {
  const cfg = getRuntimeConfig();
  const catalog = await loadModelCatalog({ config: cfg });
  const selectedProvider = resolveSelectedProviderFromModelRef(
    resolveAgentModelPrimaryValue(cfg.agents?.defaults?.model),
  );
  const grouped = /* @__PURE__ */ new Map();
  for (const entry of catalog) {
    const current = grouped.get(entry.provider) ?? {
      provider: entry.provider,
      count: 0,
      defaults: [],
      available: true,
      configured: providerHasGenericConfig({
        cfg,
        providerId: entry.provider,
      }),
      selected: selectedProvider === entry.provider,
    };
    current.count += 1;
    if (current.defaults.length < 3) current.defaults.push(entry.id);
    grouped.set(entry.provider, current);
  }
  return [...grouped.values()].toSorted((a, b) => a.provider.localeCompare(b.provider));
}
async function runModelAuthStatus() {
  const captured = [];
  const { modelsStatusCommand } = await import("./list.status-command-BbCDzNXP.js");
  await modelsStatusCommand(
    { json: true },
    {
      log: (...args) => captured.push(args.join(" ")),
      error: (message) => {
        throw message instanceof Error ? message : new Error(String(message));
      },
      exit: (code) => {
        throw new Error(`exit ${code}`);
      },
    },
  );
  const raw = captured.find((line) => line.trim().startsWith("{"));
  return raw ? JSON.parse(raw) : {};
}
async function runModelAuthLogout(provider, agent) {
  const cfg = getRuntimeConfig();
  const agentDir = resolveAgentDir(cfg, agent?.trim() || resolveDefaultAgentId(cfg));
  const profileIds = listProfilesForProvider(loadAuthProfileStoreForRuntime(agentDir), provider);
  if (
    !(await updateAuthProfileStoreWithLock({
      agentDir,
      updater: (nextStore) => {
        let changed = false;
        for (const profileId of profileIds) {
          if (nextStore.profiles[profileId]) {
            delete nextStore.profiles[profileId];
            changed = true;
          }
          if (nextStore.usageStats?.[profileId]) {
            delete nextStore.usageStats[profileId];
            changed = true;
          }
        }
        if (nextStore.order?.[provider]) {
          delete nextStore.order[provider];
          changed = true;
        }
        if (nextStore.lastGood?.[provider]) {
          delete nextStore.lastGood[provider];
          changed = true;
        }
        return changed;
      },
    }))
  )
    throw new Error(`Failed to remove saved auth profiles for provider ${provider}.`);
  return {
    provider,
    removedProfiles: profileIds,
  };
}
async function runImageGenerate(params) {
  const cfg = await resolveLocalCapabilityRuntimeConfig({
    commandName: `infer ${params.capability}`,
    targetIds: getModelsCommandSecretTargetIds(),
  });
  const agentDir = resolveAgentDir(cfg, resolveDefaultAgentId(cfg));
  const inputImages =
    params.file && params.file.length > 0
      ? await Promise.all(
          (await readInputFiles(params.file)).map(async (entry) => ({
            buffer: entry.buffer,
            fileName: path.basename(entry.path),
            mimeType:
              (await detectMime({
                buffer: entry.buffer,
                filePath: entry.path,
              })) ?? "image/png",
          })),
        )
      : void 0;
  const result = await generateImage({
    cfg,
    agentDir,
    prompt: params.prompt,
    modelOverride: params.model,
    count: params.count,
    size: params.size,
    aspectRatio: params.aspectRatio,
    resolution: params.resolution,
    quality: params.quality,
    outputFormat: params.outputFormat,
    background: params.background,
    providerOptions:
      params.openaiBackground || params.openaiModeration
        ? {
            openai: {
              ...(params.openaiBackground ? { background: params.openaiBackground } : {}),
              ...(params.openaiModeration ? { moderation: params.openaiModeration } : {}),
            },
          }
        : void 0,
    timeoutMs: params.timeoutMs,
    inputImages,
  });
  const outputs = await Promise.all(
    result.images.map(async (image, index) => {
      const written = await writeOutputAsset({
        buffer: image.buffer,
        mimeType: image.mimeType,
        originalFilename: image.fileName,
        outputPath: params.output,
        outputIndex: index,
        outputCount: result.images.length,
        subdir: "generated",
      });
      const metadata = await getImageMetadata(image.buffer).catch(() => void 0);
      return {
        ...written,
        width: metadata?.width,
        height: metadata?.height,
        revisedPrompt: image.revisedPrompt,
      };
    }),
  );
  return {
    ok: true,
    capability: params.capability,
    transport: "local",
    provider: result.provider,
    model: result.model,
    attempts: result.attempts,
    outputs,
    ignoredOverrides: result.ignoredOverrides,
  };
}
async function runImageDescribe(params) {
  const cfg = await resolveLocalCapabilityRuntimeConfig({
    commandName: `infer ${params.capability}`,
    targetIds: getModelsCommandSecretTargetIds(),
  });
  const agentDir = resolveAgentDir(cfg, resolveDefaultAgentId(cfg));
  const activeModel = requireProviderModelOverride(params.model);
  const prompt = normalizeOptionalString(params.prompt);
  const outputs = await Promise.all(
    params.files.map(async (filePath) => {
      const resolvedPath = resolveImageDescribeInput(filePath);
      const isRemoteUrl = /^https?:\/\//i.test(resolvedPath);
      const preparedImage = activeModel
        ? await prepareImageDescriptionInput({
            filePath: resolvedPath,
            ...(isRemoteUrl ? { mediaUrl: resolvedPath } : {}),
            cfg,
            timeoutMs: params.timeoutMs,
          })
        : void 0;
      const result =
        activeModel && preparedImage
          ? await runWithImageModelFallback({
              cfg,
              modelOverride: `${activeModel.provider}/${activeModel.model}`,
              run: async (provider, model) => {
                const described = await describePreparedImageWithModel({
                  image: preparedImage,
                  cfg,
                  agentDir,
                  provider,
                  model,
                  prompt: prompt ?? "Describe the image.",
                  timeoutMs: params.timeoutMs,
                });
                if (!described.text?.trim())
                  throw new Error(`No description returned for image: ${resolvedPath}`);
                return described;
              },
            })
          : {
              result: await describeImageFile({
                filePath: resolvedPath,
                ...(isRemoteUrl ? { mediaUrl: resolvedPath } : {}),
                cfg,
                agentDir,
                prompt,
                timeoutMs: params.timeoutMs,
              }),
              provider: void 0,
              model: void 0,
              attempts: [],
            };
      if (!result.result.text) {
        if (isMissingMediaUnderstandingProvider(result.result))
          throw new Error(
            "No image understanding provider is configured or ready. Configure tools.media.image.models or agents.defaults.imageModel.primary, or pass --model <provider/model> after configuring that provider's auth/API key.",
          );
        throw new Error(`No description returned for image: ${resolvedPath}`);
      }
      return {
        path: resolvedPath,
        text: result.result.text,
        provider: result.provider ?? result.result.provider,
        model: result.result.model ?? result.model,
        attempts: result.attempts,
        kind: "image.description",
      };
    }),
  );
  return {
    ok: true,
    capability: params.capability,
    transport: "local",
    provider: outputs[0]?.provider,
    model: outputs[0]?.model,
    attempts: outputs.flatMap((output) => output.attempts),
    outputs: outputs.map(({ attempts: _attempts, ...output }) => output),
  };
}
function isMissingMediaUnderstandingProvider(result) {
  const decision = result.decision;
  return (
    decision?.outcome === "skipped" &&
    decision.attachments.length > 0 &&
    decision.attachments.every((attachment) => attachment.attempts.length === 0)
  );
}
async function runAudioTranscribe(params) {
  const cfg = await resolveLocalCapabilityRuntimeConfig({
    commandName: "infer audio transcribe",
    targetIds: getModelsCommandSecretTargetIds(),
  });
  const activeModel = requireProviderModelOverride(params.model);
  const result = await transcribeAudioFile({
    filePath: path.resolve(params.file),
    cfg,
    language: params.language,
    activeModel,
    prompt: params.prompt,
  });
  if (!result.text) {
    if (isMissingMediaUnderstandingProvider(result))
      throw new Error(
        "No audio transcription provider is configured or ready. Configure tools.media.audio.models, or pass --model <provider/model> after configuring that provider's auth/API key.",
      );
    throw new Error(`No transcript returned for audio: ${path.resolve(params.file)}`);
  }
  return {
    ok: true,
    capability: "audio.transcribe",
    transport: "local",
    attempts: [],
    outputs: [
      {
        path: path.resolve(params.file),
        text: result.text,
        kind: "audio.transcription",
      },
    ],
  };
}
function parseOptionalFiniteNumber(raw, label) {
  if (raw === void 0 || (typeof raw === "string" && raw.trim() === "")) return;
  const value = parseStrictFiniteNumber(raw);
  if (value === void 0) throw new Error(`${label} must be a finite number`);
  return value;
}
function parseOptionalPositiveInteger(raw, label) {
  if (raw === void 0 || (typeof raw === "string" && raw.trim() === "")) return;
  const value = parseStrictPositiveInteger(raw);
  if (value === void 0) throw new Error(`${label} must be a positive integer`);
  return value;
}
function parseOptionalTimeoutMs(raw) {
  if (raw === void 0 || (typeof raw === "string" && raw.trim() === "")) return;
  return parseTimeoutMsWithFallback(raw, 0, { invalidType: "error" });
}
function normalizeImageOutputFormat(raw) {
  const normalized = normalizeLowercaseStringOrEmpty(raw);
  if (!normalized) return;
  if (IMAGE_OUTPUT_FORMATS.includes(normalized)) return normalized;
  throw new Error("--output-format must be one of png, jpeg, or webp");
}
function normalizeImageBackground(raw, label = "--background") {
  const normalized = normalizeLowercaseStringOrEmpty(raw);
  if (!normalized) return;
  if (IMAGE_BACKGROUNDS.includes(normalized)) return normalized;
  throw new Error(`${label} must be one of transparent, opaque, or auto`);
}
function normalizeImageQuality(raw) {
  const normalized = normalizeLowercaseStringOrEmpty(raw);
  if (!normalized) return;
  if (
    normalized === "low" ||
    normalized === "medium" ||
    normalized === "high" ||
    normalized === "auto"
  )
    return normalized;
  throw new Error("--quality must be one of low, medium, high, or auto");
}
function normalizeOpenAIModeration(raw) {
  const normalized = normalizeLowercaseStringOrEmpty(raw);
  if (!normalized) return;
  if (normalized === "low" || normalized === "auto") return normalized;
  throw new Error("--openai-moderation must be one of low or auto");
}
function normalizeVideoResolution(raw) {
  const normalized = raw?.trim().toUpperCase();
  if (!normalized) return;
  if (
    normalized === "360P" ||
    normalized === "480P" ||
    normalized === "540P" ||
    normalized === "720P" ||
    normalized === "768P" ||
    normalized === "1080P"
  )
    return normalized;
  throw new Error("video resolution must be one of 360P, 480P, 540P, 720P, 768P, or 1080P");
}
async function fetchGeneratedVideoDownload(params) {
  const providerConfig = params.cfg.models?.providers?.[params.provider];
  const { allowPrivateNetwork, dispatcherPolicy } = resolveProviderHttpRequestConfig({
    baseUrl: params.url,
    defaultBaseUrl: params.url,
    request: sanitizeConfiguredModelProviderRequest(providerConfig?.request),
    provider: params.provider,
    capability: "video",
    transport: "http",
  });
  const result = await fetchWithTimeoutGuarded(
    params.url,
    { method: "GET" },
    GENERATED_VIDEO_DOWNLOAD_TIMEOUT_MS,
    fetch,
    {
      ...(allowPrivateNetwork ? { ssrfPolicy: { allowPrivateNetwork: true } } : {}),
      ...(dispatcherPolicy ? { dispatcherPolicy } : {}),
      auditContext: `${params.provider}-generated-video-download`,
    },
  );
  try {
    await assertOkOrThrowHttpError(
      result.response,
      `${params.provider} generated video download failed`,
    );
    return result;
  } catch (error) {
    await result.release();
    throw error;
  }
}
async function runVideoGenerate(params) {
  const cfg = await resolveLocalCapabilityRuntimeConfig({
    commandName: "infer video.generate",
    targetIds: getModelsCommandSecretTargetIds(),
  });
  const result = await generateVideo({
    cfg,
    agentDir: resolveAgentDir(cfg, resolveDefaultAgentId(cfg)),
    prompt: params.prompt,
    modelOverride: params.model,
    size: params.size,
    aspectRatio: params.aspectRatio,
    resolution: params.resolution,
    durationSeconds: params.durationSeconds,
    audio: params.audio,
    watermark: params.watermark,
    timeoutMs: params.timeoutMs,
  });
  const outputs = await Promise.all(
    result.videos.map(async (video, index) => {
      if (!video.buffer && !video.url)
        throw new Error(`Video asset at index ${index} has neither buffer nor url`);
      let videoBuffer = video.buffer;
      if (!videoBuffer && video.url) {
        const download = await fetchGeneratedVideoDownload({
          cfg,
          provider: result.provider,
          url: video.url,
        });
        const response = download.response;
        try {
          if (params.output && response.body) {
            const ext =
              extensionForMime(normalizeMimeType(video.mimeType)) ||
              path.extname(video.fileName ?? "") ||
              path.extname(params.output ?? "");
            const resolvedOutput = path.resolve(params.output);
            const parsed = path.parse(resolvedOutput);
            const filePath =
              result.videos.length <= 1
                ? path.join(parsed.dir, `${parsed.name}${ext}`)
                : path.join(parsed.dir, `${parsed.name}-${String(index + 1)}${ext}`);
            await fs$1.mkdir(path.dirname(filePath), { recursive: true });
            await pipeline(Readable.fromWeb(response.body), createWriteStream(filePath));
            const stat = await fs$1.stat(filePath);
            return {
              path: filePath,
              mimeType: video.mimeType,
              size: stat.size,
            };
          }
          videoBuffer = await readResponseWithLimit(
            response,
            resolveGeneratedMediaMaxBytes(cfg, "video"),
            {
              onOverflow: ({ maxBytes }) =>
                /* @__PURE__ */ new Error(
                  `${result.provider} generated video download exceeds ${maxBytes} bytes; pass --output to stream large videos to disk`,
                ),
            },
          );
        } finally {
          await download.release();
        }
      }
      return {
        ...(await writeOutputAsset({
          buffer: videoBuffer,
          mimeType: video.mimeType,
          originalFilename: video.fileName,
          outputPath: params.output,
          outputIndex: index,
          outputCount: result.videos.length,
          subdir: "generated",
        })),
      };
    }),
  );
  return {
    ok: true,
    capability: "video.generate",
    transport: "local",
    provider: result.provider,
    model: result.model,
    attempts: result.attempts,
    outputs,
  };
}
async function runVideoDescribe(params) {
  const cfg = await resolveLocalCapabilityRuntimeConfig({
    commandName: "infer video.describe",
    targetIds: getModelsCommandSecretTargetIds(),
  });
  const activeModel = requireProviderModelOverride(params.model);
  const result = await describeVideoFile({
    filePath: path.resolve(params.file),
    cfg,
    activeModel,
  });
  if (!result.text)
    throw new Error(`No description returned for video: ${path.resolve(params.file)}`);
  return {
    ok: true,
    capability: "video.describe",
    transport: "local",
    provider: result.provider,
    model: result.model,
    attempts: [],
    outputs: [
      {
        path: path.resolve(params.file),
        text: result.text,
        kind: "video.description",
      },
    ],
  };
}
async function runTtsConvert(params) {
  if (params.transport === "gateway") {
    const gatewayConnection = buildGatewayConnectionDetailsWithResolvers({
      config: getRuntimeConfig(),
    });
    const result = await callGateway({
      method: "tts.convert",
      params: {
        text: params.text,
        channel: params.channel,
        provider: normalizeOptionalString(params.provider),
        modelId: params.modelId,
        voiceId: params.voiceId,
      },
      timeoutMs: 12e4,
    });
    let outputPath = result.audioPath;
    if (params.output && result.audioPath) {
      const gatewayHost = new URL(gatewayConnection.url).hostname;
      if (!isLoopbackHost(gatewayHost))
        throw new Error(
          `--output is not supported for remote gateway TTS yet (gateway target: ${gatewayConnection.url}).`,
        );
      const target = path.resolve(params.output);
      await fs$1.mkdir(path.dirname(target), { recursive: true });
      await fs$1.copyFile(result.audioPath, target);
      outputPath = target;
    }
    return {
      ok: true,
      capability: "tts.convert",
      transport: "gateway",
      provider: result.provider,
      attempts: [],
      outputs: [
        {
          path: outputPath,
          format: result.outputFormat,
          voiceCompatible: result.voiceCompatible,
        },
      ],
    };
  }
  const cfg = await resolveLocalCapabilityRuntimeConfig({
    commandName: "infer tts convert",
    targetIds: getTtsCommandSecretTargetIds(),
  });
  const effectiveCfg = await injectTtsAuthProfileApiKey({
    cfg,
    provider: resolveTtsProviderForAuthHydration({
      cfg,
      provider: params.provider,
      modelId: params.modelId,
      channelId: params.channel,
    }),
    channelId: params.channel,
  });
  if (effectiveCfg !== cfg) pinRuntimeConfigSnapshot(effectiveCfg);
  const overrides = resolveExplicitTtsOverrides({
    cfg: effectiveCfg,
    provider: params.provider,
    modelId: params.modelId,
    voiceId: params.voiceId,
    channelId: params.channel,
  });
  const hasExplicitSelection = Boolean(
    overrides.provider ||
    normalizeOptionalString(params.modelId) ||
    normalizeOptionalString(params.voiceId),
  );
  const result = await textToSpeech({
    text: params.text,
    cfg: effectiveCfg,
    channel: params.channel,
    overrides,
    disableFallback: hasExplicitSelection,
  });
  if (!result.success || !result.audioPath)
    throw new Error(result.error ?? "TTS conversion failed");
  let outputPath = result.audioPath;
  if (params.output) {
    const target = path.resolve(params.output);
    await fs$1.mkdir(path.dirname(target), { recursive: true });
    await fs$1.copyFile(result.audioPath, target);
    outputPath = target;
  }
  return {
    ok: true,
    capability: "tts.convert",
    transport: "local",
    provider: result.provider,
    attempts: result.attempts ?? [],
    outputs: [
      {
        path: outputPath,
        format: result.outputFormat,
        voiceCompatible: result.voiceCompatible,
      },
    ],
  };
}
function resolveTtsProviderForAuthHydration(params) {
  const explicitProvider =
    params.provider ?? resolveSelectedProviderFromModelRef(normalizeOptionalString(params.modelId));
  if (explicitProvider) return explicitProvider;
  const ttsConfig = resolveTtsConfig(params.cfg, { channelId: params.channelId });
  return getTtsProvider(ttsConfig, resolveTtsPrefsPath(ttsConfig));
}
async function injectTtsAuthProfileApiKey(params) {
  if (!params.provider) return params.cfg;
  const providerId =
    canonicalizeSpeechProviderId(params.provider, params.cfg) ??
    normalizeLowercaseStringOrEmpty(params.provider);
  if (!providerId) return params.cfg;
  if (
    resolvedTtsConfigHasProviderApiKey(
      resolveTtsConfig(params.cfg, { channelId: params.channelId }),
      providerId,
    )
  )
    return params.cfg;
  const existingProviderConfig = resolveExistingTtsProviderConfig({
    cfg: params.cfg,
    providerId,
    channelId: params.channelId,
  });
  if (ttsProviderConfigHasApiKey(existingProviderConfig?.value)) return params.cfg;
  const auth = await resolveApiKeyForProvider({
    provider: providerId,
    cfg: params.cfg,
    credentialPrecedence: "profile-first",
  }).catch(() => void 0);
  if (!auth?.apiKey || auth.mode !== "api-key") return params.cfg;
  if (existingProviderConfig?.scope === "channel") {
    const channels = { ...params.cfg.channels };
    const channel = channels[existingProviderConfig.channelKey];
    if (!isObjectRecord(channel)) return params.cfg;
    const nextChannel = {
      ...channel,
      tts: buildTtsConfigWithHydratedProvider({
        tts: channel.tts,
        existingProviderConfig,
        providerId,
        apiKey: auth.apiKey,
      }),
    };
    return {
      ...params.cfg,
      channels: {
        ...channels,
        [existingProviderConfig.channelKey]: nextChannel,
      },
    };
  }
  const messages = { ...params.cfg.messages };
  const nextTts = buildTtsConfigWithHydratedProvider({
    tts: messages.tts,
    existingProviderConfig,
    providerId,
    apiKey: auth.apiKey,
  });
  return {
    ...params.cfg,
    messages: {
      ...messages,
      tts: nextTts,
    },
  };
}
function resolveExistingTtsProviderConfig(params) {
  const channelTts = resolveChannelTtsConfigForAuthHydration(params);
  if (channelTts) {
    const channelProviderConfig = resolveExistingTtsProviderConfigInTts({
      cfg: params.cfg,
      tts: channelTts.tts,
      providerId: params.providerId,
    });
    if (channelProviderConfig)
      return {
        ...channelProviderConfig,
        scope: "channel",
        channelKey: channelTts.channelKey,
      };
  }
  const rootProviderConfig = resolveExistingTtsProviderConfigInTts({
    cfg: params.cfg,
    tts: params.cfg.messages?.tts,
    providerId: params.providerId,
  });
  return rootProviderConfig
    ? {
        ...rootProviderConfig,
        scope: "root",
      }
    : void 0;
}
function resolveExistingTtsProviderConfigInTts(params) {
  if (!isObjectRecord(params.tts)) return;
  const providers = isObjectRecord(params.tts.providers) ? params.tts.providers : void 0;
  if (!providers) return resolveDirectTtsProviderConfig(params);
  const exact = providers[params.providerId];
  if (exact !== void 0)
    return {
      container: "providers",
      key: params.providerId,
      value: exact,
    };
  for (const [key, value] of Object.entries(providers))
    if (
      normalizeLowercaseStringOrEmpty(canonicalizeSpeechProviderId(key, params.cfg) ?? key) ===
      params.providerId
    )
      return {
        container: "providers",
        key,
        value,
      };
  return resolveDirectTtsProviderConfig(params);
}
const TTS_CONFIG_RESERVED_KEYS = /* @__PURE__ */ new Set([
  "auto",
  "enabled",
  "maxTextLength",
  "mode",
  "modelOverrides",
  "persona",
  "personas",
  "prefsPath",
  "provider",
  "providers",
  "summaryModel",
  "timeoutMs",
]);
function resolveDirectTtsProviderConfig(params) {
  if (!isObjectRecord(params.tts)) return;
  for (const [key, value] of Object.entries(params.tts)) {
    if (TTS_CONFIG_RESERVED_KEYS.has(key)) continue;
    if (
      normalizeLowercaseStringOrEmpty(canonicalizeSpeechProviderId(key, params.cfg) ?? key) ===
      params.providerId
    )
      return {
        container: "direct",
        key,
        value,
      };
  }
}
function resolveChannelTtsConfigForAuthHydration(params) {
  const channels = params.cfg.channels;
  const normalizedChannelId = normalizeOptionalString(params.channelId);
  if (!isObjectRecord(channels) || !normalizedChannelId) return;
  const channelKey = Object.hasOwn(channels, normalizedChannelId)
    ? normalizedChannelId
    : Object.keys(channels).find(
        (candidate) =>
          normalizeLowercaseStringOrEmpty(candidate) ===
          normalizeLowercaseStringOrEmpty(normalizedChannelId),
      );
  const channel = channelKey ? channels[channelKey] : void 0;
  if (!channelKey || !isObjectRecord(channel)) return;
  return {
    channelKey,
    tts: channel.tts,
  };
}
function buildTtsConfigWithHydratedProvider(params) {
  const tts = isObjectRecord(params.tts) ? { ...params.tts } : {};
  const providers = isObjectRecord(tts.providers) ? { ...tts.providers } : {};
  const providerConfigKey = params.existingProviderConfig?.key ?? params.providerId;
  const nextProviderConfig = {
    ...(isObjectRecord(params.existingProviderConfig?.value)
      ? params.existingProviderConfig.value
      : {}),
    apiKey: params.apiKey,
  };
  if (params.existingProviderConfig?.container === "direct")
    tts[providerConfigKey] = nextProviderConfig;
  else {
    providers[providerConfigKey] = nextProviderConfig;
    tts.providers = providers;
  }
  return tts;
}
function isObjectRecord(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function ttsProviderConfigHasApiKey(value) {
  return isObjectRecord(value) && "apiKey" in value;
}
function resolvedTtsConfigHasProviderApiKey(config, providerId) {
  if (!isObjectRecord(config) || !isObjectRecord(config.providerConfigs)) return false;
  return ttsProviderConfigHasApiKey(config.providerConfigs[providerId]);
}
async function runTtsProviders(transport) {
  const cfg = getRuntimeConfig();
  if (transport === "gateway") {
    const payload = await callGateway({
      method: "tts.providers",
      timeoutMs: 3e4,
    });
    return {
      ...payload,
      providers: (payload.providers ?? []).map((provider) => {
        const id = typeof provider.id === "string" ? provider.id : "";
        return Object.assign(
          {
            available: true,
            configured:
              typeof provider.configured === `boolean`
                ? provider.configured
                : providerHasGenericConfig({
                    cfg,
                    providerId: id,
                  }),
            selected: Boolean(id && payload.active === id),
          },
          provider,
        );
      }),
    };
  }
  const config = resolveTtsConfig(cfg);
  const active = getTtsProvider(config, resolveTtsPrefsPath(config));
  return {
    providers: listSpeechProviders(cfg).map((provider) => ({
      available: true,
      configured:
        active === provider.id ||
        providerHasGenericConfig({
          cfg,
          providerId: provider.id,
        }),
      selected: active === provider.id,
      id: provider.id,
      name: provider.label,
      models: [...(provider.models ?? [])],
      voices: [...(provider.voices ?? [])],
    })),
    active,
  };
}
function resolveImageDescribeInput(filePath) {
  const trimmed = filePath.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : path.resolve(filePath);
}
async function runTtsPersonas(transport) {
  if (transport === "gateway")
    return await callGateway({
      method: "tts.personas",
      timeoutMs: 3e4,
    });
  const config = resolveTtsConfig(getRuntimeConfig());
  return {
    active: getTtsPersona(config, resolveTtsPrefsPath(config))?.id ?? null,
    personas: listTtsPersonas(config).map((persona) => ({
      id: persona.id,
      label: persona.label,
      description: persona.description,
      provider: persona.provider,
      fallbackPolicy: persona.fallbackPolicy,
      providers: Object.keys(persona.providers ?? {}),
    })),
  };
}
async function runTtsVoices(providerRaw) {
  const cfg = await resolveLocalCapabilityRuntimeConfig({
    commandName: "infer tts voices",
    targetIds: getTtsCommandSecretTargetIds(),
  });
  const config = resolveTtsConfig(cfg);
  const prefsPath = resolveTtsPrefsPath(config);
  return await listSpeechVoices({
    provider: normalizeOptionalString(providerRaw) || getTtsProvider(config, prefsPath),
    cfg,
    config,
  });
}
async function runTtsStateMutation(params) {
  if (params.transport === "gateway")
    return await callGateway({
      method:
        params.capability === "tts.enable"
          ? "tts.enable"
          : params.capability === "tts.disable"
            ? "tts.disable"
            : params.capability === "tts.set-provider"
              ? "tts.setProvider"
              : "tts.setPersona",
      params:
        params.capability === "tts.set-provider"
          ? { provider: params.provider }
          : params.capability === "tts.set-persona"
            ? { persona: params.persona ?? "off" }
            : void 0,
      timeoutMs: 3e4,
    });
  const cfg = getRuntimeConfig();
  const config = resolveTtsConfig(cfg);
  const prefsPath = resolveTtsPrefsPath(config);
  if (params.capability === "tts.enable") {
    setTtsEnabled(prefsPath, true);
    return { enabled: true };
  }
  if (params.capability === "tts.disable") {
    setTtsEnabled(prefsPath, false);
    return { enabled: false };
  }
  if (params.capability === "tts.set-persona") {
    if (!params.persona) {
      setTtsPersona(prefsPath, null);
      return { persona: null };
    }
    const persona = listTtsPersonas(config).find(
      (entry) => entry.id === normalizeLowercaseStringOrEmpty(params.persona ?? ""),
    );
    if (!persona) throw new Error(`Unknown TTS persona: ${params.persona}`);
    setTtsPersona(prefsPath, persona.id);
    return { persona: persona.id };
  }
  if (!params.provider) throw new Error("--provider is required");
  const provider = canonicalizeSpeechProviderId(params.provider, cfg);
  if (!provider) throw new Error(`Unknown speech provider: ${params.provider}`);
  setTtsProvider(prefsPath, provider);
  return { provider };
}
async function resolveLocalCapabilityRuntimeConfig(params) {
  const { effectiveConfig } = await resolveCommandConfigWithSecrets({
    config: params.config ?? getRuntimeConfig(),
    commandName: params.commandName,
    targetIds: params.targetIds,
    ...(params.allowedPaths ? { allowedPaths: params.allowedPaths } : {}),
    ...(params.forcedActivePaths ? { forcedActivePaths: params.forcedActivePaths } : {}),
    ...(params.optionalActivePaths ? { optionalActivePaths: params.optionalActivePaths } : {}),
    runtime: defaultRuntime,
    autoEnable: true,
  });
  pinRuntimeConfigSnapshot(effectiveConfig);
  return effectiveConfig;
}
function pinRuntimeConfigSnapshot(config) {
  const sourceConfig = getRuntimeConfigSourceSnapshot();
  if (sourceConfig) setRuntimeConfigSnapshot(config, sourceConfig);
  else setRuntimeConfigSnapshot(config);
}
async function runWebSearchCommand(params) {
  const rawConfig = getRuntimeConfig();
  const scopedTargets = getCapabilityWebSearchCommandSecretTargets(rawConfig, {
    providerId: params.provider,
  });
  const result = await runWebSearch({
    config: await resolveLocalCapabilityRuntimeConfig({
      commandName: "infer web search",
      targetIds: scopedTargets.targetIds,
      ...(scopedTargets.allowedPaths ? { allowedPaths: scopedTargets.allowedPaths } : {}),
      ...(scopedTargets.forcedActivePaths
        ? { forcedActivePaths: scopedTargets.forcedActivePaths }
        : {}),
      ...(scopedTargets.optionalActivePaths
        ? { optionalActivePaths: scopedTargets.optionalActivePaths }
        : {}),
      config: rawConfig,
    }),
    providerId: params.provider,
    args: {
      query: params.query,
      count: params.limit,
      limit: params.limit,
    },
  });
  return {
    ok: true,
    capability: "web.search",
    transport: "local",
    provider: result.provider,
    attempts: [],
    outputs: [{ result: result.result }],
  };
}
async function runWebFetchCommand(params) {
  const rawConfig = getRuntimeConfig();
  const scopedTargets = getCapabilityWebFetchCommandSecretTargets(rawConfig, {
    providerId: params.provider,
  });
  const resolved = resolveWebFetchDefinition({
    config: await resolveLocalCapabilityRuntimeConfig({
      commandName: "infer web fetch",
      targetIds: scopedTargets.targetIds,
      ...(scopedTargets.allowedPaths ? { allowedPaths: scopedTargets.allowedPaths } : {}),
      ...(scopedTargets.forcedActivePaths
        ? { forcedActivePaths: scopedTargets.forcedActivePaths }
        : {}),
      ...(scopedTargets.optionalActivePaths
        ? { optionalActivePaths: scopedTargets.optionalActivePaths }
        : {}),
      config: rawConfig,
    }),
    providerId: params.provider,
  });
  if (!resolved) throw new Error("web.fetch is disabled or no provider is available.");
  const result = await resolved.definition.execute({
    url: params.url,
    format: params.format,
  });
  return {
    ok: true,
    capability: "web.fetch",
    transport: "local",
    provider: resolved.provider.id,
    attempts: [],
    outputs: [{ result }],
  };
}
async function runMemoryEmbeddingCreate(params) {
  const cfg = await resolveLocalCapabilityRuntimeConfig({
    commandName: "infer embedding create",
    targetIds: getMemoryEmbeddingCommandSecretTargetIds(),
  });
  const modelRef = resolveModelRefOverride(params.model);
  const requestedProvider = normalizeOptionalString(params.provider) || modelRef.provider || "auto";
  const result = await createEmbeddingProvider({
    config: cfg,
    agentDir: resolveAgentDir(cfg, resolveDefaultAgentId(cfg)),
    provider: requestedProvider,
    fallback: "none",
    model: modelRef.model ?? "",
  });
  if (!result.provider)
    throw new Error(result.providerUnavailableReason ?? "No embedding provider available.");
  const embeddings = await result.provider.embedBatch(params.texts);
  return {
    ok: true,
    capability: "embedding.create",
    transport: "local",
    provider: result.provider.id,
    model: result.provider.model,
    attempts: result.fallbackFrom
      ? [
          {
            provider: result.fallbackFrom,
            outcome: "failed",
            error: result.fallbackReason,
          },
        ]
      : [],
    outputs: embeddings.map((embedding, index) => ({
      text: params.texts[index],
      embedding,
      dimensions: embedding.length,
    })),
  };
}
function registerCapabilityListAndInspect(capability) {
  capability
    .command("list")
    .description("List canonical capability ids and supported transports")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const result = CAPABILITY_METADATA.map((entry) => ({
          id: entry.id,
          transports: entry.transports,
          description: entry.description,
        }));
        emitJsonOrText(defaultRuntime, Boolean(opts.json), result, providerSummaryText);
      });
    });
  capability
    .command("inspect")
    .description("Inspect one canonical capability id")
    .requiredOption("--name <capability>", "Capability id")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const entry = findCapabilityMetadata(String(opts.name));
        if (!entry) throw new Error(`Unknown capability: ${String(opts.name)}`);
        emitJsonOrText(defaultRuntime, Boolean(opts.json), entry, (value) =>
          JSON.stringify(value, null, 2),
        );
      });
    });
}
function registerCapabilityCli(program) {
  removeCommandByName(program, "infer");
  removeCommandByName(program, "capability");
  const capability = program
    .command("infer")
    .alias("capability")
    .description("Run provider-backed inference commands through a stable CLI surface")
    .addHelpText(
      "after",
      () =>
        `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/infer", "docs.openclaw.ai/cli/infer")}\n`,
    );
  registerCapabilityListAndInspect(capability);
  const model = capability
    .command("model")
    .description("Text inference and model catalog commands");
  model
    .command("run")
    .description("Run a one-shot model turn")
    .requiredOption("--prompt <text>", "Prompt text")
    .option("--file <path>", "Image file", collectOption, [])
    .option("--model <provider/model>", "Model override")
    .option("--thinking <level>", "Thinking level override")
    .option("--local", "Force local execution", false)
    .option("--gateway", "Force gateway execution", false)
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const prompt = requireModelRunPrompt(opts.prompt);
        const thinking = normalizeModelRunThinking(opts.thinking);
        const transport = resolveTransport({
          local: Boolean(opts.local),
          gateway: Boolean(opts.gateway),
          supported: ["local", "gateway"],
          defaultTransport: "local",
        });
        const result = await runModelRun({
          prompt,
          files: opts.file,
          model: opts.model,
          thinking,
          transport,
        });
        emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
      });
    });
  model
    .command("list")
    .description("List known models")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const result = await loadModelCatalog({ config: getRuntimeConfig() });
        emitJsonOrText(defaultRuntime, Boolean(opts.json), result, providerSummaryText);
      });
    });
  model
    .command("inspect")
    .description("Inspect one model catalog entry")
    .requiredOption("--model <provider/model>", "Model id")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const target = normalizeStringifiedOptionalString(opts.model) ?? "";
        const catalog = await loadModelCatalog({ config: getRuntimeConfig() });
        const entry =
          catalog.find((candidate) => `${candidate.provider}/${candidate.id}` === target) ??
          catalog.find((candidate) => candidate.id === target);
        if (!entry) throw new Error(`Model not found: ${target}`);
        emitJsonOrText(defaultRuntime, Boolean(opts.json), entry, (value) =>
          JSON.stringify(value, null, 2),
        );
      });
    });
  model
    .command("providers")
    .description("List model providers from the catalog")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const result = await buildModelProviders();
        emitJsonOrText(defaultRuntime, Boolean(opts.json), result, providerSummaryText);
      });
    });
  const modelAuth = model.command("auth").description("Provider auth helpers");
  modelAuth
    .command("login")
    .description("Run provider auth login")
    .requiredOption("--provider <id>", "Provider id")
    .option("--method <id>", "Provider auth method id")
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const { modelsAuthLoginCommand } = await import("./auth-D52tXFem.js");
        await modelsAuthLoginCommand(
          {
            provider: String(opts.provider),
            method: opts.method ? String(opts.method) : void 0,
          },
          defaultRuntime,
        );
      });
    });
  modelAuth
    .command("logout")
    .description("Remove saved auth profiles for one provider")
    .requiredOption("--provider <id>", "Provider id")
    .option("--agent <id>", "Agent id (default: configured default agent)")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const result = await runModelAuthLogout(
          String(opts.provider),
          typeof opts.agent === "string" ? opts.agent : void 0,
        );
        emitJsonOrText(defaultRuntime, Boolean(opts.json), result, (value) =>
          JSON.stringify(value, null, 2),
        );
      });
    });
  modelAuth
    .command("status")
    .description("Show configured auth state")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const result = await runModelAuthStatus();
        emitJsonOrText(defaultRuntime, Boolean(opts.json), result, (value) =>
          JSON.stringify(value, null, 2),
        );
      });
    });
  const image = capability.command("image").description("Image generation and description");
  image
    .command("generate")
    .description("Generate images")
    .requiredOption("--prompt <text>", "Prompt text")
    .option("--model <provider/model>", "Model override")
    .option("--count <n>", "Number of images")
    .option("--size <size>", "Size hint like 1024x1024")
    .option("--aspect-ratio <ratio>", "Aspect ratio hint like 16:9")
    .option("--resolution <value>", "Resolution hint: 1K, 2K, or 4K")
    .option("--output-format <format>", "Output format hint: png, jpeg, or webp")
    .option("--background <value>", "Background hint: transparent, opaque, or auto")
    .option("--openai-background <value>", "OpenAI background hint: transparent, opaque, or auto")
    .option("--openai-moderation <value>", "OpenAI moderation hint: low or auto")
    .option("--quality <value>", "Quality hint: low, medium, high, or auto")
    .option("--timeout-ms <ms>", "Provider request timeout in milliseconds")
    .option("--output <path>", "Output path")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const result = await runImageGenerate({
          capability: "image.generate",
          prompt: String(opts.prompt),
          model: opts.model,
          count: parseOptionalPositiveInteger(opts.count, "--count"),
          size: opts.size,
          aspectRatio: opts.aspectRatio,
          resolution: opts.resolution,
          outputFormat: normalizeImageOutputFormat(opts.outputFormat),
          background: normalizeImageBackground(opts.background),
          openaiBackground: normalizeImageBackground(opts.openaiBackground, "--openai-background"),
          openaiModeration: normalizeOpenAIModeration(opts.openaiModeration),
          quality: normalizeImageQuality(opts.quality),
          timeoutMs: parseOptionalTimeoutMs(opts.timeoutMs),
          output: opts.output,
        });
        emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
      });
    });
  image
    .command("edit")
    .description("Edit images with one or more input files")
    .requiredOption("--file <path>", "Input file", collectOption, [])
    .requiredOption("--prompt <text>", "Prompt text")
    .option("--model <provider/model>", "Model override")
    .option("--count <n>", "Number of images")
    .option("--size <size>", "Size hint like 1024x1024")
    .option("--aspect-ratio <ratio>", "Aspect ratio hint like 16:9")
    .option("--resolution <value>", "Resolution hint: 1K, 2K, or 4K")
    .option("--output-format <format>", "Output format hint: png, jpeg, or webp")
    .option("--background <value>", "Background hint: transparent, opaque, or auto")
    .option("--openai-background <value>", "OpenAI background hint: transparent, opaque, or auto")
    .option("--openai-moderation <value>", "OpenAI moderation hint: low or auto")
    .option("--quality <value>", "Quality hint: low, medium, high, or auto")
    .option("--timeout-ms <ms>", "Provider request timeout in milliseconds")
    .option("--output <path>", "Output path")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const files = Array.isArray(opts.file) ? opts.file : [String(opts.file)];
        const result = await runImageGenerate({
          capability: "image.edit",
          prompt: String(opts.prompt),
          model: opts.model,
          count: parseOptionalPositiveInteger(opts.count, "--count"),
          size: opts.size,
          aspectRatio: opts.aspectRatio,
          resolution: opts.resolution,
          file: files,
          outputFormat: normalizeImageOutputFormat(opts.outputFormat),
          background: normalizeImageBackground(opts.background),
          openaiBackground: normalizeImageBackground(opts.openaiBackground, "--openai-background"),
          openaiModeration: normalizeOpenAIModeration(opts.openaiModeration),
          quality: normalizeImageQuality(opts.quality),
          timeoutMs: parseOptionalTimeoutMs(opts.timeoutMs),
          output: opts.output,
        });
        emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
      });
    });
  image
    .command("describe")
    .description("Describe one image file")
    .requiredOption("--file <path>", "Image file")
    .option("--prompt <text>", "Prompt hint")
    .option("--model <provider/model>", "Model override")
    .option("--timeout-ms <ms>", "Provider request timeout in milliseconds")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const result = await runImageDescribe({
          capability: "image.describe",
          files: [String(opts.file)],
          model: opts.model,
          prompt: opts.prompt,
          timeoutMs: parseOptionalTimeoutMs(opts.timeoutMs),
        });
        emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
      });
    });
  image
    .command("describe-many")
    .description("Describe multiple image files")
    .requiredOption("--file <path>", "Image file", collectOption, [])
    .option("--prompt <text>", "Prompt hint")
    .option("--model <provider/model>", "Model override")
    .option("--timeout-ms <ms>", "Provider request timeout in milliseconds")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const result = await runImageDescribe({
          capability: "image.describe-many",
          files: opts.file,
          model: opts.model,
          prompt: opts.prompt,
          timeoutMs: parseOptionalTimeoutMs(opts.timeoutMs),
        });
        emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
      });
    });
  image
    .command("providers")
    .description("List image generation providers")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const cfg = getRuntimeConfig();
        const selectedProvider = resolveSelectedProviderFromModelRef(
          resolveAgentModelPrimaryValue(cfg.agents?.defaults?.imageGenerationModel),
        );
        const result = listRuntimeImageGenerationProviders({ config: cfg }).map((provider) => ({
          available: true,
          configured:
            selectedProvider === provider.id ||
            providerHasGenericConfig({
              cfg,
              providerId: provider.id,
            }),
          selected: selectedProvider === provider.id,
          id: provider.id,
          label: provider.label,
          defaultModel: provider.defaultModel,
          models: provider.models ?? [],
          capabilities: provider.capabilities,
        }));
        emitJsonOrText(defaultRuntime, Boolean(opts.json), result, providerSummaryText);
      });
    });
  const audio = capability.command("audio").description("Audio transcription");
  audio
    .command("transcribe")
    .description("Transcribe one audio file")
    .requiredOption("--file <path>", "Audio file")
    .option("--language <code>", "Language hint")
    .option("--prompt <text>", "Prompt hint")
    .option("--model <provider/model>", "Model override")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const result = await runAudioTranscribe({
          file: String(opts.file),
          language: opts.language,
          model: opts.model,
          prompt: opts.prompt,
        });
        emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
      });
    });
  audio
    .command("providers")
    .description("List audio transcription providers")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const cfg = getRuntimeConfig();
        const remoteProviders = [...buildMediaUnderstandingRegistry(void 0, cfg).values()]
          .filter((provider) => provider.capabilities?.includes("audio"))
          .map((provider) => ({
            available: true,
            configured: providerHasGenericConfig({
              cfg,
              providerId: provider.id,
              envVars: getProviderEnvVars(provider.id, {
                config: cfg,
                includeUntrustedWorkspacePlugins: false,
              }),
            }),
            selected: false,
            id: provider.id,
            capabilities: provider.capabilities,
            defaultModels: provider.defaultModels,
          }));
        const localProviders = (await inspectLocalAudioSelection()).candidates
          .filter((candidate) => candidate.available)
          .map((candidate) =>
            Object.assign(
              {
                available: candidate.available,
                configured: candidate.ready,
                selected: false,
                localFallbackSelected: candidate.selected,
                id: `local/${candidate.id}`,
                transport: "local-cli",
                command: candidate.command,
                observedBackend: candidate.observedBackend ?? "unknown",
                evidence: candidate.evidence,
              },
              candidate.capableBackend ? { capableBackend: candidate.capableBackend } : {},
              candidate.requestedBackend ? { requestedBackend: candidate.requestedBackend } : {},
              candidate.reason ? { reason: candidate.reason } : {},
            ),
          );
        const providers = [...remoteProviders, ...localProviders];
        emitJsonOrText(defaultRuntime, Boolean(opts.json), providers, providerSummaryText);
      });
    });
  const tts = capability.command("tts").description("Text to speech");
  tts
    .command("convert")
    .description("Convert text to speech")
    .requiredOption("--text <text>", "Input text")
    .option("--channel <id>", "Channel hint")
    .option("--voice <id>", "Voice hint")
    .option("--model <provider/model>", "Model override")
    .option("--output <path>", "Output path")
    .option("--local", "Force local execution", false)
    .option("--gateway", "Force gateway execution", false)
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const transport = resolveTransport({
          local: Boolean(opts.local),
          gateway: Boolean(opts.gateway),
          supported: ["local", "gateway"],
          defaultTransport: "local",
        });
        const modelRef = resolveModelRefOverride(opts.model);
        if (opts.model && !modelRef.provider)
          throw new Error("TTS model overrides must use the form <provider/model>.");
        const result = await runTtsConvert({
          text: String(opts.text),
          channel: opts.channel,
          provider: modelRef.provider,
          modelId: modelRef.provider ? modelRef.model : void 0,
          voiceId: opts.voice,
          output: opts.output,
          transport,
        });
        emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
      });
    });
  tts
    .command("voices")
    .description("List voices for a TTS provider")
    .option("--provider <id>", "Speech provider id")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const voices = await runTtsVoices(opts.provider);
        emitJsonOrText(defaultRuntime, Boolean(opts.json), voices, providerSummaryText);
      });
    });
  tts
    .command("providers")
    .description("List speech providers")
    .option("--local", "Force local execution", false)
    .option("--gateway", "Force gateway execution", false)
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const result = await runTtsProviders(
          resolveTransport({
            local: Boolean(opts.local),
            gateway: Boolean(opts.gateway),
            supported: ["local", "gateway"],
            defaultTransport: "local",
          }),
        );
        emitJsonOrText(defaultRuntime, Boolean(opts.json), result, (value) =>
          JSON.stringify(value, null, 2),
        );
      });
    });
  tts
    .command("personas")
    .description("List TTS personas")
    .option("--local", "Force local execution", false)
    .option("--gateway", "Force gateway execution", false)
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const result = await runTtsPersonas(
          resolveTransport({
            local: Boolean(opts.local),
            gateway: Boolean(opts.gateway),
            supported: ["local", "gateway"],
            defaultTransport: "local",
          }),
        );
        emitJsonOrText(defaultRuntime, Boolean(opts.json), result, (value) =>
          JSON.stringify(value, null, 2),
        );
      });
    });
  tts
    .command("status")
    .description("Show TTS status")
    .option("--gateway", "Force gateway execution", false)
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const transport = resolveTransport({
          gateway: Boolean(opts.gateway),
          supported: ["gateway"],
          defaultTransport: "gateway",
        });
        const result = await callGateway({
          method: "tts.status",
          timeoutMs: 3e4,
        });
        emitJsonOrText(
          defaultRuntime,
          Boolean(opts.json),
          {
            transport,
            ...result,
          },
          (value) => JSON.stringify(value, null, 2),
        );
      });
    });
  for (const [commandName, capabilityId] of [
    ["enable", "tts.enable"],
    ["disable", "tts.disable"],
  ])
    tts
      .command(commandName)
      .description(`${commandName === "enable" ? "Enable" : "Disable"} TTS`)
      .option("--local", "Force local execution", false)
      .option("--gateway", "Force gateway execution", false)
      .option("--json", "Output JSON", false)
      .action(async (opts) => {
        await runCommandWithRuntime(defaultRuntime, async () => {
          const transport = resolveTransport({
            local: Boolean(opts.local),
            gateway: Boolean(opts.gateway),
            supported: ["local", "gateway"],
            defaultTransport: "gateway",
          });
          const result = await runTtsStateMutation({
            capability: capabilityId,
            transport,
          });
          emitJsonOrText(defaultRuntime, Boolean(opts.json), result, (value) =>
            JSON.stringify(value, null, 2),
          );
        });
      });
  tts
    .command("set-provider")
    .description("Set the active TTS provider")
    .requiredOption("--provider <id>", "Speech provider id")
    .option("--local", "Force local execution", false)
    .option("--gateway", "Force gateway execution", false)
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const transport = resolveTransport({
          local: Boolean(opts.local),
          gateway: Boolean(opts.gateway),
          supported: ["local", "gateway"],
          defaultTransport: "gateway",
        });
        const result = await runTtsStateMutation({
          capability: "tts.set-provider",
          provider: String(opts.provider),
          transport,
        });
        emitJsonOrText(defaultRuntime, Boolean(opts.json), result, (value) =>
          JSON.stringify(value, null, 2),
        );
      });
    });
  tts
    .command("set-persona")
    .description("Set the active TTS persona")
    .option("--persona <id>", "TTS persona id")
    .option("--off", "Disable the active TTS persona", false)
    .option("--local", "Force local execution", false)
    .option("--gateway", "Force gateway execution", false)
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const transport = resolveTransport({
          local: Boolean(opts.local),
          gateway: Boolean(opts.gateway),
          supported: ["local", "gateway"],
          defaultTransport: "gateway",
        });
        if (!opts.off && !opts.persona)
          throw new Error("--persona is required unless --off is set");
        const result = await runTtsStateMutation({
          capability: "tts.set-persona",
          persona: opts.off ? null : String(opts.persona),
          transport,
        });
        emitJsonOrText(defaultRuntime, Boolean(opts.json), result, (value) =>
          JSON.stringify(value, null, 2),
        );
      });
    });
  const video = capability.command("video").description("Video generation and description");
  video
    .command("generate")
    .description("Generate video")
    .requiredOption("--prompt <text>", "Prompt text")
    .option("--model <provider/model>", "Model override")
    .option("--size <size>", "Size hint like 1280x720")
    .option("--aspect-ratio <ratio>", "Aspect ratio hint like 16:9")
    .option("--resolution <value>", "Resolution hint: 360P, 480P, 540P, 720P, 768P, or 1080P")
    .option("--duration <seconds>", "Target duration in seconds")
    .option("--audio", "Enable generated audio when supported")
    .option("--watermark", "Request provider watermark when supported")
    .option("--timeout-ms <ms>", "Provider request timeout in milliseconds")
    .option("--output <path>", "Output path")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const result = await runVideoGenerate({
          prompt: String(opts.prompt),
          model: opts.model,
          output: opts.output,
          size: opts.size,
          aspectRatio: opts.aspectRatio,
          resolution: normalizeVideoResolution(opts.resolution),
          durationSeconds: parseOptionalFiniteNumber(opts.duration, "--duration"),
          audio: opts.audio === true ? true : void 0,
          watermark: opts.watermark === true ? true : void 0,
          timeoutMs: parseOptionalTimeoutMs(opts.timeoutMs),
        });
        emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
      });
    });
  video
    .command("describe")
    .description("Describe one video file")
    .requiredOption("--file <path>", "Video file")
    .option("--model <provider/model>", "Model override")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const result = await runVideoDescribe({
          file: String(opts.file),
          model: opts.model,
        });
        emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
      });
    });
  video
    .command("providers")
    .description("List video generation and description providers")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const cfg = getRuntimeConfig();
        const selectedGenerationProvider = resolveSelectedProviderFromModelRef(
          resolveAgentModelPrimaryValue(cfg.agents?.defaults?.videoGenerationModel),
        );
        const result = {
          generation: listRuntimeVideoGenerationProviders({ config: cfg }).map((provider) => ({
            available: true,
            configured:
              selectedGenerationProvider === provider.id ||
              providerHasGenericConfig({
                cfg,
                providerId: provider.id,
              }),
            selected: selectedGenerationProvider === provider.id,
            id: provider.id,
            label: provider.label,
            defaultModel: provider.defaultModel,
            models: provider.models ?? [],
            capabilities: provider.capabilities,
          })),
          description: [...buildMediaUnderstandingRegistry(void 0, cfg).values()]
            .filter((provider) => provider.capabilities?.includes("video"))
            .map((provider) => ({
              available: true,
              configured: providerHasGenericConfig({
                cfg,
                providerId: provider.id,
              }),
              selected: false,
              id: provider.id,
              capabilities: provider.capabilities,
              defaultModels: provider.defaultModels,
            })),
        };
        emitJsonOrText(defaultRuntime, Boolean(opts.json), result, (value) =>
          JSON.stringify(value, null, 2),
        );
      });
    });
  const web = capability.command("web").description("Web capabilities");
  web
    .command("search")
    .description("Run web search")
    .requiredOption("--query <text>", "Search query")
    .option("--provider <id>", "Provider id")
    .option("--limit <n>", "Result limit")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const result = await runWebSearchCommand({
          query: String(opts.query),
          provider: opts.provider,
          limit: parseOptionalPositiveInteger(opts.limit, "--limit"),
        });
        emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
      });
    });
  web
    .command("fetch")
    .description("Fetch one URL")
    .requiredOption("--url <url>", "URL")
    .option("--provider <id>", "Provider id")
    .option("--format <format>", "Format hint")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const result = await runWebFetchCommand({
          url: String(opts.url),
          provider: opts.provider,
          format: opts.format,
        });
        emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
      });
    });
  web
    .command("providers")
    .description("List web providers")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const cfg = getRuntimeConfig();
        const selectedSearchProvider =
          typeof cfg.tools?.web?.search?.provider === "string"
            ? normalizeLowercaseStringOrEmpty(cfg.tools.web.search.provider)
            : "";
        const selectedFetchProvider =
          typeof cfg.tools?.web?.fetch?.provider === "string"
            ? normalizeLowercaseStringOrEmpty(cfg.tools.web.fetch.provider)
            : "";
        const result = {
          search: listWebSearchProviders({ config: cfg }).map((provider) => ({
            available: true,
            configured: isWebSearchProviderConfigured({
              provider,
              config: cfg,
            }),
            selected: provider.id === selectedSearchProvider,
            id: provider.id,
            envVars: provider.envVars,
          })),
          fetch: listWebFetchProviders({ config: cfg }).map((provider) => ({
            available: true,
            configured: isWebFetchProviderConfigured({
              provider,
              config: cfg,
            }),
            selected: provider.id === selectedFetchProvider,
            id: provider.id,
            envVars: provider.envVars,
          })),
        };
        emitJsonOrText(defaultRuntime, Boolean(opts.json), result, (value) =>
          JSON.stringify(value, null, 2),
        );
      });
    });
  const embedding = capability.command("embedding").description("Embedding providers");
  embedding
    .command("create")
    .description("Create embeddings")
    .requiredOption("--text <text>", "Input text", collectOption, [])
    .option("--provider <id>", "Provider id")
    .option("--model <provider/model>", "Model override")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const result = await runMemoryEmbeddingCreate({
          texts: opts.text,
          provider: opts.provider,
          model: opts.model,
        });
        emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
      });
    });
  embedding
    .command("providers")
    .description("List embedding providers")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        const cfg = getRuntimeConfig();
        const resolvedMemory = resolveMemorySearchConfig(cfg, resolveDefaultAgentId(cfg));
        const selectedProvider = resolvedMemory?.provider;
        const providers = new Map(
          listMemoryEmbeddingProviders().map((provider) => [
            provider.id,
            {
              id: provider.id,
              defaultModel: provider.defaultModel,
              transport: provider.transport,
              autoSelectPriority: provider.autoSelectPriority,
            },
          ]),
        );
        for (const provider of listEmbeddingProviders(cfg)) {
          if (providers.has(provider.id)) continue;
          providers.set(provider.id, {
            id: provider.id,
            defaultModel: provider.defaultModel,
            transport: provider.transport,
            autoSelectPriority: void 0,
          });
        }
        if (selectedProvider && !providers.has(selectedProvider))
          providers.set(selectedProvider, {
            id: selectedProvider,
            defaultModel: resolvedMemory?.model || void 0,
            transport: providerHasGenericConfig({
              cfg,
              providerId: selectedProvider,
            })
              ? "remote"
              : void 0,
            autoSelectPriority: void 0,
          });
        const result = Array.from(providers.values()).map((provider) => ({
          available: true,
          configured:
            provider.id === selectedProvider ||
            providerHasGenericConfig({
              cfg,
              providerId: provider.id,
            }),
          selected: provider.id === selectedProvider,
          id: provider.id,
          defaultModel: provider.defaultModel,
          transport: provider.transport,
          autoSelectPriority: provider.autoSelectPriority,
        }));
        emitJsonOrText(defaultRuntime, Boolean(opts.json), result, providerSummaryText);
      });
    });
}
//#endregion
export { CAPABILITY_METADATA, registerCapabilityCli };
