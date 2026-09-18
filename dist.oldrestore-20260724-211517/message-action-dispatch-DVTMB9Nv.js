import { n as normalizeAccountId, r as normalizeOptionalAccountId } from "./account-id-C7N4Rwku.js";
import { n as estimateBase64DecodedBytes, t as canonicalizeBase64 } from "./base64-hBzWwdnH.js";
import { t as readBooleanParam$1 } from "./boolean-param-AuSHeYDH.js";
import "./fs-safe-RNq3oO57.js";
import { l as hasPotentialPluginActionParam } from "./channel-target-Bp_kJEK2.js";
import { t as normalizeChatType } from "./chat-type-BARlA53h.js";
import {
  _ as readStringArrayParam,
  w as resolveSnakeCaseParamKey,
  y as readStringParam,
} from "./common-DyDSUect.js";
import { t as resolveChannelAccountMediaMaxMb } from "./configured-max-bytes-RHpfttuD.js";
import { t as normalizeConversationReadInvocationOrigin } from "./conversation-read-origin-E3olMOwo.js";
import { t as basenameFromAnyPath } from "./file-name-D1nUHSBH.js";
import "./local-file-access-CBe_wA_B.js";
import {
  n as resolveOutboundMediaAccess,
  r as resolveOutboundMediaLocalRoots,
  t as buildOutboundMediaLoadOptions,
} from "./load-options-VzbF4ozo.js";
import { a as resolveChannelMessageToolMediaSourceParamKeys } from "./message-action-discovery-B2Y90cRg.js";
import { r as extensionForMime } from "./mime-BSEMEb3s.js";
import { t as resolveOutboundAttachmentFromBuffer } from "./outbound-attachment-B7sr-r6U.js";
import "./store-BfbXoJVN.js";
import { _ as basenameFromMediaSource } from "./path-DILYn_gk.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { o as resolveChannelPluginRegistration } from "./registry-mc8oBRx8.js";
import {
  o as resolveSandboxedMediaSource,
  t as assertMediaNotDataUrl,
} from "./sandbox-paths-DxDLkOQF.js";
import { a as root } from "./secure-temp-dir-DMUMnweR.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { n as loadWebMedia } from "./web-media-3hQ71Ejp.js";
//#region src/infra/outbound/message-action-params.ts
/** Shared boolean param reader used by message-action argument normalization. */
const readBooleanParam = readBooleanParam$1;
const BASE_ACTION_MEDIA_SOURCE_PARAM_KEYS = [
  "media",
  "path",
  "filePath",
  "mediaUrl",
  "fileUrl",
  "image",
];
const STRUCTURED_ATTACHMENT_MEDIA_SOURCE_PARAM_KEYS = [
  "media",
  "mediaUrl",
  "path",
  "filePath",
  "fileUrl",
  "url",
];
const STRUCTURED_ATTACHMENT_FILE_SOURCE_PARAM_KEYS = /* @__PURE__ */ new Set([
  "path",
  "filePath",
  "fileUrl",
]);
const SEND_BUFFER_DRY_RUN_MEDIA_URL = "buffer://message-send/attachment";
function readMediaParam(args, key) {
  return readStringParam(args, key, { trim: false });
}
function resolveMediaParamEntry(args, key) {
  const resolvedKey = resolveSnakeCaseParamKey(args, key);
  if (!resolvedKey) return;
  const value = readMediaParam(args, key);
  if (!value) return;
  return {
    key: resolvedKey,
    value,
  };
}
function hasExplicitAttachmentPayload(args, extraParamKeys) {
  if (readStringParam(args, "buffer", { trim: false })) return true;
  return buildActionMediaSourceParamKeys(extraParamKeys).some((key) => {
    const entry = resolveMediaParamEntry(args, key);
    return Boolean(entry && normalizeOptionalString(entry.value));
  });
}
function hasExplicitSendMediaSource(args, extraParamKeys) {
  if (
    buildActionMediaSourceParamKeys(extraParamKeys).some((key) => {
      const entry = resolveMediaParamEntry(args, key);
      const value = entry ? normalizeOptionalString(entry.value) : void 0;
      return Boolean(value && value !== SEND_BUFFER_DRY_RUN_MEDIA_URL);
    })
  )
    return true;
  if (
    readStringArrayParam(args, "mediaUrls")?.some((value) => {
      const normalized = normalizeOptionalString(value);
      return Boolean(normalized && normalized !== SEND_BUFFER_DRY_RUN_MEDIA_URL);
    })
  )
    return true;
  return collectStructuredAttachmentSources(args).some((source) =>
    Boolean(normalizeOptionalString(source.value)),
  );
}
function collectStructuredAttachmentSources(args) {
  const attachments = args.attachments;
  if (!Array.isArray(attachments)) return [];
  const sources = [];
  for (const attachment of attachments) {
    if (!isRecord(attachment)) continue;
    for (const key of STRUCTURED_ATTACHMENT_MEDIA_SOURCE_PARAM_KEYS) {
      const entry = resolveMediaParamEntry(attachment, key);
      if (!entry || !normalizeOptionalString(entry.value)) continue;
      sources.push({
        attachment,
        key: entry.key,
        value: entry.value,
        kind: STRUCTURED_ATTACHMENT_FILE_SOURCE_PARAM_KEYS.has(key) ? "file" : "media",
        contentType:
          readStringParam(attachment, "contentType") ?? readStringParam(attachment, "mimeType"),
        filename: readStringParam(attachment, "filename") ?? readStringParam(attachment, "name"),
      });
      break;
    }
  }
  return sources;
}
function resolveStructuredAttachmentSource(args, extraParamKeys) {
  if (hasExplicitAttachmentPayload(args, extraParamKeys)) return;
  return collectStructuredAttachmentSources(args)[0];
}
function buildActionMediaSourceParamKeys(extraParamKeys) {
  const keys = new Set(BASE_ACTION_MEDIA_SOURCE_PARAM_KEYS);
  extraParamKeys?.forEach((key) => keys.add(key));
  return Array.from(keys);
}
/** Resolves plugin-declared media source param aliases for a message action. */
function resolveExtraActionMediaSourceParamKeys(params) {
  if (!hasPotentialPluginActionParam(params.args)) return [];
  return resolveChannelMessageToolMediaSourceParamKeys({
    cfg: params.cfg,
    action: params.action,
    channel: params.channel,
    accountId: params.accountId,
    sessionKey: params.sessionKey,
    sessionId: params.sessionId,
    agentId: params.agentId,
    requesterSenderId: params.requesterSenderId,
    senderIsOwner: params.senderIsOwner,
  });
}
/** Collects candidate media source strings from message-action args. */
function collectActionMediaSourceHints(args, extraParamKeys, options) {
  const sources = [];
  for (const key of buildActionMediaSourceParamKeys(extraParamKeys)) {
    const entry = resolveMediaParamEntry(args, key);
    if (entry && normalizeOptionalString(entry.value)) sources.push(entry.value);
  }
  for (const value of readStringArrayParam(args, "mediaUrls") ?? [])
    if (normalizeOptionalString(value)) sources.push(value);
  if (options?.structuredAttachments === "all")
    sources.push(...collectStructuredAttachmentSources(args).map((source) => source.value));
  else {
    const attachmentSource = resolveStructuredAttachmentSource(args, extraParamKeys);
    if (attachmentSource) sources.push(attachmentSource.value);
  }
  return sources;
}
function readAttachmentMediaHint(args) {
  return readMediaParam(args, "media") ?? readMediaParam(args, "mediaUrl");
}
function readAttachmentFileHint(args) {
  return (
    readMediaParam(args, "path") ??
    readMediaParam(args, "filePath") ??
    readMediaParam(args, "fileUrl")
  );
}
function resolveAttachmentMaxBytes(params) {
  const limitMb =
    resolveChannelAccountMediaMaxMb(params) ?? params.cfg.agents?.defaults?.mediaMaxMb;
  return typeof limitMb === "number" ? limitMb * 1024 * 1024 : void 0;
}
function inferAttachmentFilename(params) {
  const mediaHint = params.mediaHint?.trim();
  if (mediaHint) {
    const base = basenameFromMediaSource(mediaHint);
    const safeBase = base ? basenameFromAnyPath(base) : void 0;
    if (safeBase) return safeBase;
  }
  const ext = params.contentType ? extensionForMime(params.contentType) : void 0;
  return ext ? `attachment${ext}` : "attachment";
}
function normalizeBase64Payload(params) {
  if (!params.base64)
    return {
      base64: params.base64,
      contentType: params.contentType,
    };
  const match = /^data:([^;]+);base64,(.*)$/i.exec(params.base64.trim());
  if (!match)
    return {
      base64: params.base64,
      contentType: params.contentType,
    };
  const [, mime, payload] = match;
  return {
    base64: payload,
    contentType: params.contentType ?? mime,
  };
}
function resolveSendBufferMaxBytes(params) {
  return (
    resolveAttachmentMaxBytes({
      cfg: params.cfg,
      channel: params.channel,
      accountId: params.accountId,
    }) ?? 5242880
  );
}
function decodeBoundedBase64Attachment(params) {
  const estimatedBytes = estimateBase64DecodedBytes(params.base64);
  if (estimatedBytes > params.maxBytes)
    throw new Error(`Media too large: ${estimatedBytes} bytes (limit: ${params.maxBytes} bytes)`);
  const canonicalBase64 = canonicalizeBase64(params.base64);
  if (!canonicalBase64) throw new Error("message.send buffer has invalid base64 data");
  const buffer = Buffer.from(canonicalBase64, "base64");
  if (buffer.byteLength > params.maxBytes)
    throw new Error(
      `Media too large: ${buffer.byteLength} bytes (limit: ${params.maxBytes} bytes)`,
    );
  return buffer;
}
async function hydrateSendBufferMediaParams(params) {
  if (hasExplicitSendMediaSource(params.args, params.extraParamKeys)) {
    delete params.args.buffer;
    return;
  }
  const rawBuffer = readStringParam(params.args, "buffer", { trim: false });
  if (!rawBuffer) return;
  const normalized = normalizeBase64Payload({
    base64: rawBuffer,
    contentType: readStringParam(params.args, "contentType") ?? void 0,
  });
  if (!normalized.base64) return;
  const contentType =
    readStringParam(params.args, "contentType") ??
    readStringParam(params.args, "mimeType") ??
    normalized.contentType;
  const filename =
    readStringParam(params.args, "filename") ??
    inferAttachmentFilename({ contentType: contentType ?? void 0 });
  const maxBytes = resolveSendBufferMaxBytes(params);
  if (params.dryRun || params.preserveBuffer) {
    decodeBoundedBase64Attachment({
      base64: normalized.base64,
      maxBytes,
    });
    params.args.media = SEND_BUFFER_DRY_RUN_MEDIA_URL;
    params.args.mediaUrl = SEND_BUFFER_DRY_RUN_MEDIA_URL;
    params.args.mediaUrls = [SEND_BUFFER_DRY_RUN_MEDIA_URL];
    if (!params.preserveBuffer) delete params.args.buffer;
    if (normalized.contentType && !readStringParam(params.args, "contentType"))
      params.args.contentType = normalized.contentType;
    if (filename && !readStringParam(params.args, "filename")) params.args.filename = filename;
    return;
  }
  const staged = await resolveOutboundAttachmentFromBuffer(
    decodeBoundedBase64Attachment({
      base64: normalized.base64,
      maxBytes,
    }),
    maxBytes,
    {
      contentType: contentType ?? void 0,
      filename,
    },
  );
  params.args.media = staged.path;
  params.args.mediaUrl = staged.path;
  params.args.mediaUrls = [staged.path];
  delete params.args.buffer;
  if (staged.contentType && !readStringParam(params.args, "contentType"))
    params.args.contentType = staged.contentType;
  if (filename && !readStringParam(params.args, "filename")) params.args.filename = filename;
}
/** Chooses sandbox or host media loading policy for attachment hydration. */
function resolveAttachmentMediaPolicy(params) {
  const sandboxRoot = params.sandboxRoot?.trim();
  if (sandboxRoot)
    return {
      mode: "sandbox",
      sandboxRoot,
    };
  const explicitLocalRoots = resolveOutboundMediaLocalRoots(params.mediaLocalRoots);
  return {
    mode: "host",
    mediaAccess: resolveOutboundMediaAccess({
      mediaAccess: params.mediaAccess,
      mediaLocalRoots: explicitLocalRoots === "any" ? void 0 : explicitLocalRoots,
      mediaReadFile: params.mediaAccess?.readFile ? void 0 : params.mediaReadFile,
    }),
    ...(explicitLocalRoots !== void 0 ? { mediaLocalRoots: explicitLocalRoots } : {}),
    ...(params.mediaAccess?.readFile
      ? {}
      : params.mediaReadFile
        ? { mediaReadFile: params.mediaReadFile }
        : {}),
  };
}
function buildAttachmentMediaLoadOptions(params) {
  if (params.policy.mode === "sandbox") {
    const sandboxRoot = params.policy.sandboxRoot.trim();
    let sandboxFsPromise;
    const readSandboxFile = async (filePath) => {
      sandboxFsPromise ??= root(sandboxRoot);
      return await (await sandboxFsPromise).readBytes(filePath);
    };
    return {
      maxBytes: params.maxBytes,
      ...(params.optimizeImages !== void 0 ? { optimizeImages: params.optimizeImages } : {}),
      sandboxValidated: true,
      readFile: readSandboxFile,
    };
  }
  return buildOutboundMediaLoadOptions({
    maxBytes: params.maxBytes,
    mediaAccess: params.policy.mediaAccess,
    mediaLocalRoots: params.policy.mediaLocalRoots,
    mediaReadFile: params.policy.mediaReadFile,
    optimizeImages: params.optimizeImages,
  });
}
async function hydrateAttachmentPayload(params) {
  const contentTypeParam = params.contentTypeParam ?? void 0;
  const rawBuffer = readStringParam(params.args, "buffer", { trim: false });
  const normalized = normalizeBase64Payload({
    base64: rawBuffer,
    contentType: contentTypeParam ?? void 0,
  });
  if (normalized.base64 !== rawBuffer && normalized.base64) {
    params.args.buffer = normalized.base64;
    if (normalized.contentType && !contentTypeParam)
      params.args.contentType = normalized.contentType;
  }
  const filename = readStringParam(params.args, "filename");
  const mediaSource = (params.mediaHint ?? void 0) || (params.fileHint ?? void 0);
  if (!params.dryRun && !readStringParam(params.args, "buffer", { trim: false }) && mediaSource) {
    const maxBytes = resolveAttachmentMaxBytes({
      cfg: params.cfg,
      channel: params.channel,
      accountId: params.accountId,
    });
    const media = await loadWebMedia(
      mediaSource,
      buildAttachmentMediaLoadOptions({
        policy: params.mediaPolicy,
        maxBytes,
        optimizeImages: params.optimizeImages,
      }),
    );
    params.args.buffer = media.buffer.toString("base64");
    if (!contentTypeParam && media.contentType) params.args.contentType = media.contentType;
    if (!filename)
      params.args.filename = inferAttachmentFilename({
        mediaHint: media.fileName ?? mediaSource,
        contentType: media.contentType ?? contentTypeParam ?? void 0,
      });
  } else if (!filename)
    params.args.filename = inferAttachmentFilename({
      mediaHint: mediaSource,
      contentType: contentTypeParam ?? void 0,
    });
}
/** Rewrites action media params to sandbox-safe paths and rejects data URLs. */
async function normalizeSandboxMediaParams(params) {
  const sandboxRoot =
    params.mediaPolicy.mode === "sandbox" ? params.mediaPolicy.sandboxRoot.trim() : void 0;
  for (const key of buildActionMediaSourceParamKeys(params.extraParamKeys)) {
    const entry = resolveMediaParamEntry(params.args, key);
    if (!entry) continue;
    assertMediaNotDataUrl(entry.value);
    if (!sandboxRoot) continue;
    const normalized = await resolveSandboxedMediaSource({
      media: entry.value,
      sandboxRoot,
    });
    if (normalized !== entry.value) params.args[entry.key] = normalized;
  }
  const attachmentSources =
    params.structuredAttachments === "all"
      ? collectStructuredAttachmentSources(params.args)
      : [resolveStructuredAttachmentSource(params.args, params.extraParamKeys)].filter((source) =>
          Boolean(source),
        );
  if (attachmentSources.length === 0) return;
  for (const attachmentSource of attachmentSources) {
    assertMediaNotDataUrl(attachmentSource.value);
    if (!sandboxRoot) continue;
    const normalized = await resolveSandboxedMediaSource({
      media: attachmentSource.value,
      sandboxRoot,
    });
    if (normalized !== attachmentSource.value)
      attachmentSource.attachment[attachmentSource.key] = normalized;
  }
}
/** Normalizes a list of media hints against an optional sandbox root. */
async function normalizeSandboxMediaList(params) {
  const sandboxRoot = params.sandboxRoot?.trim();
  const normalized = [];
  const seen = /* @__PURE__ */ new Set();
  for (const value of params.values) {
    const raw = value?.trim();
    if (!raw) continue;
    assertMediaNotDataUrl(raw);
    const resolved = sandboxRoot
      ? await resolveSandboxedMediaSource({
          media: raw,
          sandboxRoot,
        })
      : raw;
    if (seen.has(resolved)) continue;
    seen.add(resolved);
    normalized.push(resolved);
  }
  return normalized;
}
async function hydrateAttachmentActionPayload(params) {
  const attachmentSource = resolveStructuredAttachmentSource(params.args, params.extraParamKeys);
  const mediaHint = readAttachmentMediaHint(params.args);
  const fileHint = readAttachmentFileHint(params.args);
  const contentTypeParam =
    readStringParam(params.args, "contentType") ??
    readStringParam(params.args, "mimeType") ??
    attachmentSource?.contentType;
  if (attachmentSource?.filename && !readStringParam(params.args, "filename"))
    params.args.filename = attachmentSource.filename;
  if (attachmentSource?.contentType && !readStringParam(params.args, "contentType"))
    params.args.contentType = attachmentSource.contentType;
  if (params.allowMessageCaptionFallback) {
    const caption = readStringParam(params.args, "caption", { allowEmpty: true })?.trim();
    const message = readStringParam(params.args, "message", { allowEmpty: true })?.trim();
    if (!caption && message) params.args.caption = message;
  }
  await hydrateAttachmentPayload({
    cfg: params.cfg,
    channel: params.channel,
    accountId: params.accountId,
    args: params.args,
    dryRun: params.dryRun,
    contentTypeParam,
    mediaHint: mediaHint ?? (attachmentSource?.kind === "media" ? attachmentSource.value : void 0),
    fileHint: fileHint ?? (attachmentSource?.kind === "file" ? attachmentSource.value : void 0),
    mediaPolicy: params.mediaPolicy,
    optimizeImages: params.optimizeImages,
  });
}
/** Hydrates attachment-bearing message actions with base64 buffers and metadata. */
async function hydrateAttachmentParamsForAction(params) {
  const shouldHydrateUploadFile = params.action === "upload-file";
  if (params.action === "send") {
    await hydrateSendBufferMediaParams({
      cfg: params.cfg,
      channel: params.channel,
      accountId: params.accountId,
      args: params.args,
      dryRun: params.dryRun,
      preserveBuffer: params.preserveSendBuffer,
      extraParamKeys: params.extraParamKeys,
    });
    return;
  }
  if (
    params.action !== "sendAttachment" &&
    params.action !== "setGroupIcon" &&
    params.action !== "reply" &&
    !shouldHydrateUploadFile
  )
    return;
  const forceDocument =
    readBooleanParam$1(params.args, "forceDocument") ??
    readBooleanParam$1(params.args, "asDocument") ??
    false;
  await hydrateAttachmentActionPayload({
    cfg: params.cfg,
    channel: params.channel,
    accountId: params.accountId,
    args: params.args,
    dryRun: params.dryRun,
    mediaPolicy: params.mediaPolicy,
    extraParamKeys: params.extraParamKeys,
    optimizeImages: shouldHydrateUploadFile && forceDocument ? false : void 0,
    allowMessageCaptionFallback: params.action === "sendAttachment" || shouldHydrateUploadFile,
  });
}
/** Parses a named string param as JSON for structured message action fields. */
function parseJsonMessageParam(params, key) {
  const raw = params[key];
  if (typeof raw !== "string") return;
  const trimmed = raw.trim();
  if (!trimmed) {
    delete params[key];
    return;
  }
  try {
    params[key] = JSON.parse(trimmed);
  } catch {
    throw new Error(`--${key} must be valid JSON`);
  }
}
/** Parses the interactive message action param as JSON when provided as a string. */
function parseInteractiveParam(params) {
  const raw = params.interactive;
  if (typeof raw !== "string") return;
  const trimmed = raw.trim();
  if (!trimmed) {
    delete params.interactive;
    return;
  }
  try {
    params.interactive = JSON.parse(trimmed);
  } catch {
    throw new Error("--interactive must be valid JSON");
  }
}
//#endregion
//#region src/channels/plugins/message-action-dispatch.ts
const READ_DEPENDENT_ACTIONS = /* @__PURE__ */ new Set([
  "poll-vote",
  "react",
  "reactions",
  "read",
  "edit",
  "unsend",
  "delete",
  "pin",
  "unpin",
  "list-pins",
  "permissions",
  "thread-list",
  "search",
  "sticker-search",
  "member-info",
  "role-info",
  "emoji-list",
  "channel-info",
  "channel-list",
  "voice-status",
  "event-list",
  "download-file",
]);
const BUNDLED_CHANNELS_WITH_PROVIDER_READ_GATES = /* @__PURE__ */ new Set([
  "discord",
  "feishu",
  "matrix",
  "msteams",
  "slack",
]);
const HOST_TARGET_KIND_PREFIXES = /* @__PURE__ */ new Set([
  "user",
  "channel",
  "room",
  "chat",
  "group",
  "dm",
  "conversation",
]);
function stripHostProviderPrefix(params) {
  const prefixes = [params.channel, ...(params.providerPrefixes ?? [])]
    .map((prefix) => prefix.trim().toLowerCase())
    .filter((prefix) => Boolean(prefix) && !HOST_TARGET_KIND_PREFIXES.has(prefix));
  const lowered = params.value.toLowerCase();
  const prefix = prefixes.find((candidate) => lowered.startsWith(`${candidate}:`));
  return prefix ? params.value.slice(prefix.length + 1).trim() : params.value;
}
function normalizeHostConversationTarget(params) {
  if (typeof params.value !== "string") return;
  const rawValue = params.value.trim();
  const value = params.normalizeTarget ? params.normalizeTarget(rawValue)?.trim() : rawValue;
  if (!value) return;
  const withoutProvider = stripHostProviderPrefix({
    value,
    channel: params.channel,
    providerPrefixes: params.providerPrefixes,
  });
  if (!withoutProvider) return;
  const typedTarget = withoutProvider.match(
    /^(user|channel|room|chat|group|dm|conversation):(.*)$/i,
  );
  if (typedTarget) {
    const id = typedTarget[2]?.trim();
    if (!id) return;
    return {
      id,
      kind: typedTarget[1]?.toLowerCase(),
    };
  }
  return {
    id: withoutProvider,
    ...(params.impliedKind ? { kind: params.impliedKind } : {}),
  };
}
function targetKey(target) {
  return `${target.kind ?? ""}\0${target.id}`;
}
function addHostConversationTarget(targets, target) {
  if (target) targets.set(targetKey(target), target);
}
function hasConflictingTargetKinds(targets) {
  const kindsById = /* @__PURE__ */ new Map();
  for (const target of targets) {
    if (!target.kind) continue;
    const kinds = kindsById.get(target.id) ?? /* @__PURE__ */ new Set();
    kinds.add(target.kind);
    kindsById.set(target.id, kinds);
  }
  return Array.from(kindsById.values()).some((kinds) => kinds.size > 1);
}
function currentTargetsMatchRequested(params) {
  const sameId = params.currentTargets.filter(
    (currentTarget) => currentTarget.id === params.requestedTarget.id,
  );
  if (sameId.length === 0 || !params.requestedTarget.kind) return sameId.length > 0;
  const typedCurrentTargets = sameId.filter((currentTarget) => currentTarget.kind);
  if (typedCurrentTargets.length === 0) {
    if (
      !params.requestedTargets.some(
        (requestedTarget) =>
          requestedTarget.id === params.requestedTarget.id && !requestedTarget.kind,
      )
    )
      return false;
    if (params.currentChatType === "direct")
      return params.requestedTarget.kind === "user" || params.requestedTarget.kind === "dm";
    if (params.currentChatType === "group")
      return params.requestedTarget.kind === "group" || params.requestedTarget.kind === "room";
    if (params.currentChatType === "channel") return params.requestedTarget.kind === "channel";
    return false;
  }
  return typedCurrentTargets.some(
    (currentTarget) => currentTarget.kind === params.requestedTarget.kind,
  );
}
function hasMatchingCurrentAccountContext(ctx) {
  const rawAccountId = ctx.accountId?.trim() ?? "";
  const rawRequesterAccountId = ctx.requesterAccountId?.trim() ?? "";
  if (!rawRequesterAccountId) return false;
  if (
    (rawAccountId && !normalizeOptionalAccountId(rawAccountId)) ||
    !normalizeOptionalAccountId(rawRequesterAccountId)
  )
    return false;
  return normalizeAccountId(rawAccountId) === normalizeAccountId(rawRequesterAccountId);
}
function hasMatchingCurrentProviderContext(ctx) {
  const currentProvider = ctx.toolContext?.currentChannelProvider?.trim().toLowerCase();
  return Boolean(currentProvider && currentProvider === ctx.channel.trim().toLowerCase());
}
function hasCurrentConversationTarget(ctx) {
  return [ctx.toolContext?.currentChannelId, ctx.toolContext?.currentMessagingTarget].some(
    (value) => typeof value === "string" && Boolean(value.trim()),
  );
}
function hasTargetInput(value) {
  if (typeof value === "string") return Boolean(value.trim());
  return typeof value === "number" && Number.isFinite(value);
}
function isExactCurrentConversation(params) {
  if (
    !hasMatchingCurrentProviderContext(params.ctx) ||
    !hasMatchingCurrentAccountContext(params.ctx)
  )
    return false;
  const normalizeTarget =
    params.pluginOrigin === "bundled" ? params.plugin.messaging?.normalizeTarget : void 0;
  const providerPrefixes = params.plugin.messaging?.targetPrefixes;
  const aliasSpec =
    params.pluginOrigin === "bundled"
      ? params.plugin.actions?.messageActionTargetAliases?.[params.ctx.action]
      : void 0;
  const deliveryTargetAliases = new Set(aliasSpec?.deliveryTargetAliases ?? []);
  const requestedTargets = /* @__PURE__ */ new Map();
  for (const [key, impliedKind] of [
    ["target", void 0],
    ["to", void 0],
    ["channelId", "channel"],
    ["roomId", "room"],
    ["chatId", "chat"],
  ]) {
    const rawTarget = params.ctx.params[key];
    if (deliveryTargetAliases.has(key)) continue;
    const normalizedTarget = normalizeHostConversationTarget({
      value: rawTarget,
      channel: params.ctx.channel,
      impliedKind,
      normalizeTarget,
      providerPrefixes,
    });
    if (hasTargetInput(rawTarget) && !normalizedTarget) return false;
    addHostConversationTarget(requestedTargets, normalizedTarget);
  }
  let hasDeliveryAliasInput = false;
  let normalizedAliasTarget;
  if (params.pluginOrigin === "bundled") {
    hasDeliveryAliasInput = (aliasSpec?.deliveryTargetAliases ?? []).some((alias) =>
      hasTargetInput(params.ctx.params[alias]),
    );
    const resolvedAliasTarget = aliasSpec?.resolveDeliveryTarget?.({ args: params.ctx.params });
    normalizedAliasTarget = normalizeHostConversationTarget({
      value: resolvedAliasTarget,
      channel: params.ctx.channel,
      normalizeTarget,
      providerPrefixes,
    });
    if (
      (hasDeliveryAliasInput && !resolvedAliasTarget) ||
      (resolvedAliasTarget !== void 0 && !normalizedAliasTarget)
    )
      return false;
    addHostConversationTarget(requestedTargets, normalizedAliasTarget);
  }
  const normalizedAliasTargetKey = normalizedAliasTarget
    ? targetKey(normalizedAliasTarget)
    : void 0;
  const nonAliasRequestedTargets = Array.from(requestedTargets.values()).filter(
    (target) => targetKey(target) !== normalizedAliasTargetKey,
  );
  const requestedTargetList = Array.from(requestedTargets.values());
  if (hasConflictingTargetKinds(requestedTargetList)) return false;
  const currentTargets = /* @__PURE__ */ new Map();
  for (const value of [
    params.ctx.toolContext?.currentChannelId,
    params.ctx.toolContext?.currentMessagingTarget,
  ])
    addHostConversationTarget(
      currentTargets,
      normalizeHostConversationTarget({
        value,
        channel: params.ctx.channel,
        normalizeTarget,
        providerPrefixes,
      }),
    );
  const currentTargetList = Array.from(currentTargets.values());
  if (currentTargetList.length === 0 || hasConflictingTargetKinds(currentTargetList)) return false;
  if (requestedTargetList.length === 0) return false;
  const currentChatType = normalizeChatType(params.ctx.toolContext?.currentChatType);
  const matchesCurrentTarget = (requestedTarget) =>
    currentTargetsMatchRequested({
      currentTargets: currentTargetList,
      requestedTargets: requestedTargetList,
      requestedTarget,
      currentChatType,
    });
  if (requestedTargetList.every(matchesCurrentTarget)) return true;
  if (
    params.pluginOrigin !== "bundled" ||
    !hasDeliveryAliasInput ||
    !params.ctx.toolContext ||
    !aliasSpec?.matchesCurrentConversation ||
    !nonAliasRequestedTargets.every(matchesCurrentTarget)
  )
    return false;
  return aliasSpec.matchesCurrentConversation({
    args: params.ctx.params,
    accountId: normalizeAccountId(params.ctx.accountId),
    toolContext: params.ctx.toolContext,
  });
}
function assertConversationReadAllowed(params) {
  const usesBundledProviderReadGate =
    params.pluginOrigin === "bundled" &&
    BUNDLED_CHANNELS_WITH_PROVIDER_READ_GATES.has(params.ctx.channel);
  if (
    normalizeConversationReadInvocationOrigin(params.ctx.conversationReadOrigin) ===
      "direct-operator" ||
    usesBundledProviderReadGate ||
    !READ_DEPENDENT_ACTIONS.has(params.ctx.action)
  )
    return;
  if (
    (params.pluginOrigin === "bundled" &&
      params.ctx.action === "sticker-search" &&
      hasMatchingCurrentProviderContext(params.ctx) &&
      hasMatchingCurrentAccountContext(params.ctx) &&
      hasCurrentConversationTarget(params.ctx)) ||
    isExactCurrentConversation({
      ctx: params.ctx,
      plugin: params.plugin,
      pluginOrigin: params.pluginOrigin,
    })
  )
    return;
  throw new Error(
    `Delegated ${params.ctx.channel}:${params.ctx.action} requires the exact current conversation and account for this plugin.`,
  );
}
function canonicalizeExternalExactCurrentTarget(params) {
  if (
    params.pluginOrigin === "bundled" ||
    normalizeConversationReadInvocationOrigin(params.ctx.conversationReadOrigin) ===
      "direct-operator" ||
    !READ_DEPENDENT_ACTIONS.has(params.ctx.action)
  )
    return;
  const target = params.ctx.params.target;
  const resolvedTarget = [params.ctx.params.to, params.ctx.params.channelId].find(
    (value) => typeof value === "string" && Boolean(value.trim()),
  );
  if (typeof target === "string" && target.trim() && resolvedTarget)
    params.ctx.params.target = resolvedTarget;
}
function requiresTrustedRequesterSender(ctx, plugin) {
  return Boolean(
    plugin?.actions?.requiresTrustedRequesterSender?.({
      action: ctx.action,
      toolContext: ctx.toolContext,
    }),
  );
}
/**
 * Runs a channel message action if the target plugin supports it.
 */
async function dispatchChannelMessageAction(ctx) {
  const registration = resolveChannelPluginRegistration(ctx.channel);
  if (!registration) return null;
  const { plugin } = registration;
  const actions = plugin.actions;
  if (!actions?.handleAction) return null;
  assertConversationReadAllowed({
    ctx,
    plugin,
    pluginOrigin: registration.origin,
  });
  canonicalizeExternalExactCurrentTarget({
    ctx,
    pluginOrigin: registration.origin,
  });
  if (requiresTrustedRequesterSender(ctx, plugin) && !ctx.requesterSenderId?.trim())
    throw new Error(
      `Trusted sender identity is required for ${ctx.channel}:${ctx.action} in tool-driven contexts.`,
    );
  if (actions.supportsAction && !actions.supportsAction({ action: ctx.action })) return null;
  return await actions.handleAction(ctx);
}
//#endregion
export {
  normalizeSandboxMediaParams as a,
  readBooleanParam as c,
  normalizeSandboxMediaList as i,
  resolveAttachmentMediaPolicy as l,
  collectActionMediaSourceHints as n,
  parseInteractiveParam as o,
  hydrateAttachmentParamsForAction as r,
  parseJsonMessageParam as s,
  dispatchChannelMessageAction as t,
  resolveExtraActionMediaSourceParamKeys as u,
};
