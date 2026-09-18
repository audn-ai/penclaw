import path from "node:path";
import {
  a as resolveIMessageAccount,
  i as resolveDefaultIMessageAccountId,
} from "./accounts--1GXl2sX.js";
import { a as stripAssistantInternalScaffolding } from "./assistant-visible-text-DV1Yognj.js";
import { t as createIMessageRpcClient } from "./client-B2SbygAK.js";
import { t as detectBinary } from "./detect-binary-BkSLZSbH.js";
import { r as runCommandWithTimeout } from "./exec-CXKmx4dL.js";
import { t as createSetupTranslator } from "./i18n-BDUMKn0X.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import "./media-runtime-BhmZORKM.js";
import "./number-runtime-B-n-wjMn.js";
import "./runtime-config-snapshot-hRn3WGyJ.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./text-chunking-Dr19ggf-.js";
import "./text-utility-runtime-CJESZCN5.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import "./core-V3U0lOIj.js";
import {
  C as resolveExpiresAtMsFromDurationMs,
  o as asDateTimestampMs,
} from "./number-coercion-CJQ8TR--.js";
import {
  r as setCachedIMessagePrivateApiStatus,
  t as getCachedIMessagePrivateApiStatus,
} from "./private-api-status-lj9GJ_TF.js";
import { i as createPatchedAccountSetupAdapter } from "./setup-helpers-Dl0hnWtQ.js";
import {
  C as parseSetupEntriesAllowingWildcard,
  J as setSetupChannelEnabled,
  T as patchChannelConfigForAccount,
  V as setAccountAllowFromForChannel,
  j as promptParsedAllowFromForAccount,
  v as mergeAllowFromEntries,
} from "./setup-wizard-helpers-Kz9xlQ7e.js";
import "./setup-CM3hyaUe.js";
import "./setup-runtime-ByFHbls2.js";
import "./setup-tools-DI8M-Tdb.js";
import "./process-runtime-BKNTr1ic.js";
import "./status-helpers-SdoCNDDu.js";
import "./channel-status-B8fwcUOI.js";
import {
  a as createDelegatedSetupWizardProxy,
  c as createDelegatedTextInputShouldPrompt,
  o as createCliPathTextInput,
} from "./setup-wizard-proxy-DIVPLm_0.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { c as parseIMessageTarget, o as normalizeIMessageHandle } from "./targets-BO9NhvfG.js";
import "./normalize-D37IclcM.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region extensions/imessage/src/setup-core.ts
const t = createSetupTranslator();
const channel = "imessage";
const IMESSAGE_INSTALL_COMMAND = "brew install steipete/tap/imsg";
const IMESSAGE_UPDATE_COMMAND = "brew update && brew upgrade imsg";
const HOMEBREW_IMSG_PATHS = /* @__PURE__ */ new Set([
  "/opt/homebrew/bin/imsg",
  "/opt/homebrew/opt/imsg/bin/imsg",
  "/usr/local/bin/imsg",
  "/usr/local/opt/imsg/bin/imsg",
]);
function normalizeIMessageCliPathForSetup(cliPath) {
  return cliPath?.trim() || "imsg";
}
function isAutoManagedIMessageCliPath(cliPath, opts) {
  const normalized = normalizeIMessageCliPathForSetup(cliPath);
  return (!opts?.explicit && normalized === "imsg") || HOMEBREW_IMSG_PATHS.has(normalized);
}
const CHAT_TARGET_ALLOWFROM_PREFIXES = [
  "chat_id:",
  "chatid:",
  "chat:",
  "chat_guid:",
  "chatguid:",
  "guid:",
  "chat_identifier:",
  "chatidentifier:",
  "chatident:",
];
const SERVICE_ALLOWFROM_PREFIXES = ["imessage:", "sms:", "auto:"];
function normalizeAllowFromEntryForPrefixCheck(entry) {
  let lower = normalizeLowercaseStringOrEmpty(entry);
  let stripped = true;
  while (stripped) {
    stripped = false;
    for (const prefix of SERVICE_ALLOWFROM_PREFIXES)
      if (lower.startsWith(prefix)) {
        lower = lower.slice(prefix.length).trim();
        stripped = true;
      }
  }
  return lower;
}
function parseIMessageAllowFromEntries(raw) {
  return parseSetupEntriesAllowingWildcard(raw, (entry) => {
    const lower = normalizeAllowFromEntryForPrefixCheck(entry);
    if (CHAT_TARGET_ALLOWFROM_PREFIXES.some((prefix) => lower.startsWith(prefix)))
      return { error: `iMessage allowFrom entries must be sender handles: ${entry}` };
    if (!normalizeIMessageHandle(entry)) return { error: `Invalid handle: ${entry}` };
    return { value: entry };
  });
}
function buildIMessageSetupPatch(input) {
  return {
    ...(input.cliPath ? { cliPath: input.cliPath } : {}),
    ...(input.dbPath ? { dbPath: input.dbPath } : {}),
    ...(input.service ? { service: input.service } : {}),
    ...(input.region ? { region: input.region } : {}),
  };
}
async function promptIMessageAllowFrom(params) {
  return promptParsedAllowFromForAccount({
    cfg: params.cfg,
    accountId: params.accountId,
    defaultAccountId: resolveDefaultIMessageAccountId(params.cfg),
    prompter: params.prompter,
    noteTitle: "iMessage allowlist",
    noteLines: [
      "Allowlist iMessage DMs by sender handle.",
      "Examples:",
      "- +15555550123",
      "- user@example.com",
      "Multiple entries: comma-separated.",
      `Docs: ${formatDocsLink("/imessage", "imessage")}`,
    ],
    message: "iMessage allowFrom (sender handle)",
    placeholder: "+15555550123, user@example.com",
    parseEntries: parseIMessageAllowFromEntries,
    getExistingAllowFrom: ({ cfg, accountId }) =>
      resolveIMessageAccount({
        cfg,
        accountId,
      }).config.allowFrom ?? [],
    applyAllowFrom: ({ cfg, accountId, allowFrom }) =>
      setAccountAllowFromForChannel({
        cfg,
        channel,
        accountId,
        allowFrom,
      }),
  });
}
const imessageDmPolicy = {
  label: "iMessage",
  channel,
  policyKey: "channels.imessage.dmPolicy",
  allowFromKey: "channels.imessage.allowFrom",
  resolveConfigKeys: (_cfg, accountId) => {
    const targetAccountId = accountId ?? resolveDefaultIMessageAccountId(_cfg);
    return targetAccountId !== "default"
      ? {
          policyKey: `channels.imessage.accounts.${targetAccountId}.dmPolicy`,
          allowFromKey: `channels.imessage.accounts.${targetAccountId}.allowFrom`,
        }
      : {
          policyKey: "channels.imessage.dmPolicy",
          allowFromKey: "channels.imessage.allowFrom",
        };
  },
  getCurrent: (cfg, accountId) => {
    return (
      resolveIMessageAccount({
        cfg,
        accountId: accountId ?? resolveDefaultIMessageAccountId(cfg),
      }).config.dmPolicy ?? "pairing"
    );
  },
  setPolicy: (cfg, policy, accountId) => {
    const targetAccountId = accountId ?? resolveDefaultIMessageAccountId(cfg);
    return patchChannelConfigForAccount({
      cfg,
      channel,
      accountId: targetAccountId,
      patch:
        policy === "open"
          ? {
              dmPolicy: "open",
              allowFrom: mergeAllowFromEntries(
                resolveIMessageAccount({
                  cfg,
                  accountId: targetAccountId,
                }).config.allowFrom,
                ["*"],
              ),
            }
          : { dmPolicy: policy },
    });
  },
  promptAllowFrom: promptIMessageAllowFrom,
};
function resolveIMessageCliPath(params) {
  return resolveIMessageAccount(params).config.cliPath ?? "imsg";
}
function createIMessageCliPathTextInput(shouldPrompt) {
  return createCliPathTextInput({
    inputKey: "cliPath",
    message: "imsg CLI path",
    resolvePath: ({ cfg, accountId }) =>
      resolveIMessageCliPath({
        cfg,
        accountId,
      }),
    shouldPrompt,
    helpTitle: "iMessage",
    helpLines: [
      "imsg CLI path required to enable iMessage.",
      `Install imsg on the Messages Mac: ${IMESSAGE_INSTALL_COMMAND}`,
      `Update imsg when channel probes report missing RPC or private API capabilities: ${IMESSAGE_UPDATE_COMMAND}`,
    ],
  });
}
const imessageCompletionNote = {
  title: "iMessage next steps",
  lines: [
    "For the usual setup, run OpenClaw on the Mac signed into Messages.",
    "If the Gateway runs elsewhere, set cliPath to a transparent SSH wrapper that runs imsg on the Messages Mac.",
    `Install imsg on the Messages Mac: ${IMESSAGE_INSTALL_COMMAND}`,
    `Update imsg after imsg fixes or missing-capability errors: ${IMESSAGE_UPDATE_COMMAND}`,
    "Private API mode is strongly encouraged for replies, tapbacks, effects, polls, attachments, and group actions.",
    "After Private API setup, run `imsg launch`, then `openclaw channels status --probe`.",
    "Ensure OpenClaw has Full Disk Access to Messages DB.",
    "Grant Automation permission for Messages when prompted.",
    "List chats with: imsg chats --limit 20",
    `Docs: ${formatDocsLink("/imessage", "imessage")}`,
  ],
};
const imessageSetupAdapter = createPatchedAccountSetupAdapter({
  channelKey: channel,
  buildPatch: (input) => buildIMessageSetupPatch(input),
});
const imessageSetupStatusBase = {
  configuredLabel: t("wizard.channels.statusConfigured"),
  unconfiguredLabel: t("wizard.channels.statusNeedsSetup"),
  configuredHint: t("wizard.imessage.imsgFound"),
  unconfiguredHint: t("wizard.imessage.imsgMissing"),
  configuredScore: 1,
  unconfiguredScore: 0,
  resolveConfigured: ({ cfg, accountId }) =>
    resolveIMessageAccount({
      cfg,
      accountId,
    }).configured,
};
function createIMessageSetupWizardProxy(loadWizard) {
  return createDelegatedSetupWizardProxy({
    channel,
    loadWizard,
    status: {
      configuredLabel: imessageSetupStatusBase.configuredLabel,
      unconfiguredLabel: imessageSetupStatusBase.unconfiguredLabel,
      configuredHint: imessageSetupStatusBase.configuredHint,
      unconfiguredHint: imessageSetupStatusBase.unconfiguredHint,
      configuredScore: imessageSetupStatusBase.configuredScore,
      unconfiguredScore: imessageSetupStatusBase.unconfiguredScore,
    },
    delegatePrepare: true,
    credentials: [],
    textInputs: [
      createIMessageCliPathTextInput(
        createDelegatedTextInputShouldPrompt({
          loadWizard,
          inputKey: "cliPath",
        }),
      ),
    ],
    completionNote: imessageCompletionNote,
    dmPolicy: imessageDmPolicy,
    disable: (cfg) => setSetupChannelEnabled(cfg, channel, false),
  });
}
//#endregion
//#region extensions/imessage/src/probe.ts
const RPC_SUPPORT_CACHE_TTL_MS = 300 * 1e3;
const PRIVATE_API_NEGATIVE_TTL_MS = 10 * 1e3;
const rpcSupportCache = /* @__PURE__ */ new Map();
function cacheIMessagePrivateApiStatus(cliPath, status) {
  if (status.available) {
    setCachedIMessagePrivateApiStatus(cliPath, status, 0);
    return;
  }
  const expiresAt = resolveExpiresAtMsFromDurationMs(PRIVATE_API_NEGATIVE_TTL_MS);
  if (expiresAt !== void 0) setCachedIMessagePrivateApiStatus(cliPath, status, expiresAt);
}
function getCachedRpcSupport(cliPath) {
  const cached = rpcSupportCache.get(cliPath);
  if (!cached) return;
  const now = asDateTimestampMs(Date.now());
  if (now === void 0 || cached.expiresAt <= now) {
    rpcSupportCache.delete(cliPath);
    return;
  }
  return cached.result;
}
function setCachedRpcSupport(cliPath, result) {
  const expiresAt = resolveExpiresAtMsFromDurationMs(RPC_SUPPORT_CACHE_TTL_MS);
  if (expiresAt === void 0) return;
  rpcSupportCache.set(cliPath, {
    result,
    expiresAt,
  });
}
function isDefaultLocalIMessageCliPath(cliPath) {
  const trimmed = cliPath.trim();
  return trimmed === "imsg" || (!trimmed.includes("/") && path.basename(trimmed) === "imsg");
}
function resolveIMessageNonMacHostError(cliPath, platform = process.platform) {
  if (platform === "darwin" || !isDefaultLocalIMessageCliPath(cliPath)) return;
  return "iMessage via the default imsg CLI must run on macOS. Run OpenClaw on the signed-in Messages Mac, or set channels.imessage.cliPath to an SSH wrapper that runs imsg on that Mac.";
}
async function probeRpcSupport(cliPath, timeoutMs) {
  const cached = getCachedRpcSupport(cliPath);
  if (cached) return cached;
  try {
    const result = await runCommandWithTimeout([cliPath, "rpc", "--help"], { timeoutMs });
    const combined = `${result.stdout}\n${result.stderr}`.trim();
    const normalized = normalizeLowercaseStringOrEmpty(combined);
    if (normalized.includes("unknown command") && normalized.includes("rpc")) {
      const fatal = {
        supported: false,
        fatal: true,
        error: `imsg CLI does not support the "rpc" subcommand. Update imsg on the Messages Mac: ${IMESSAGE_UPDATE_COMMAND}`,
      };
      setCachedRpcSupport(cliPath, fatal);
      return fatal;
    }
    if (result.code === 0) {
      const supported = { supported: true };
      setCachedRpcSupport(cliPath, supported);
      return supported;
    }
    return {
      supported: false,
      error: combined || `imsg rpc --help failed (code ${String(result.code ?? "unknown")})`,
    };
  } catch (err) {
    return {
      supported: false,
      error: String(err),
    };
  }
}
function parseStatusPayload(stdout) {
  const lines = normalizeStringEntries(stdout.split(/\r?\n/));
  for (const line of lines.toReversed())
    try {
      const value = JSON.parse(line);
      if (value && typeof value === "object" && !Array.isArray(value)) return { payload: value };
    } catch {}
  return {
    payload: null,
    firstLineSnippet: lines[0] ? truncateUtf16Safe(lines[0], 120) : void 0,
  };
}
function selectorsFromPayload(payload) {
  const raw = payload.selectors;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const selectors = {};
  for (const [key, value] of Object.entries(raw))
    if (typeof value === "boolean") selectors[key] = value;
  return selectors;
}
function rpcMethodsFromPayload(payload) {
  const raw = payload.rpc_methods;
  if (!Array.isArray(raw)) return [];
  return raw.filter((entry) => typeof entry === "string");
}
async function probeSendRichSupportsAttachment(cliPath, timeoutMs) {
  try {
    const result = await runCommandWithTimeout([cliPath, "send-rich", "--help"], { timeoutMs });
    if (result.code !== 0) return false;
    const combined = `${result.stdout}\n${result.stderr}`;
    return /(?:^|\s)--file\b/m.test(combined);
  } catch {
    return false;
  }
}
async function probeIMessagePrivateApi(cliPath, timeoutMs, options = {}) {
  const key = cliPath.trim() || "imsg";
  if (!options.forceRefresh) {
    const cached = getCachedIMessagePrivateApiStatus(key);
    if (cached) return cached;
  }
  try {
    const result = await runCommandWithTimeout([key, "status", "--json"], { timeoutMs });
    const combined = `${result.stdout}\n${result.stderr}`.trim();
    const { payload, firstLineSnippet } = parseStatusPayload(result.stdout);
    const selectors = payload ? selectorsFromPayload(payload) : {};
    const rpcMethods = payload ? rpcMethodsFromPayload(payload) : [];
    const advancedFeatures = payload?.advanced_features === true;
    const v2Ready = payload?.v2_ready === true;
    const statusMessage = typeof payload?.message === "string" ? payload.message : void 0;
    const sendRichSupportsAttachment = await probeSendRichSupportsAttachment(key, timeoutMs);
    const status = {
      available: result.code === 0 && advancedFeatures && v2Ready,
      v2Ready,
      selectors,
      rpcMethods,
      cliCapabilities: { sendRichSupportsAttachment },
      ...(statusMessage ? { statusMessage } : {}),
      ...(result.code === 0
        ? !payload && firstLineSnippet
          ? {
              error: `imsg status --json returned no parseable JSONL (first line: "${firstLineSnippet}") — output schema may have changed`,
            }
          : {}
        : { error: combined || `imsg status --json failed (code ${String(result.code)})` }),
    };
    cacheIMessagePrivateApiStatus(key, status);
    return status;
  } catch (err) {
    const status = {
      available: false,
      v2Ready: false,
      selectors: {},
      rpcMethods: [],
      cliCapabilities: { sendRichSupportsAttachment: false },
      error: String(err),
    };
    cacheIMessagePrivateApiStatus(key, status);
    return status;
  }
}
/**
 * Probe iMessage RPC availability.
 * @param timeoutMs - Explicit timeout in ms. If undefined, uses config or default.
 * @param opts - Additional options (cliPath, dbPath, runtime).
 */
async function probeIMessage(timeoutMs, opts = {}) {
  const cfg = opts.cliPath || opts.dbPath ? void 0 : getRuntimeConfig();
  const explicitCliPath = opts.cliPath?.trim() || cfg?.channels?.imessage?.cliPath?.trim();
  const cliPath = explicitCliPath || "imsg";
  const dbPath = opts.dbPath?.trim() || cfg?.channels?.imessage?.dbPath?.trim();
  const effectiveTimeout = timeoutMs ?? cfg?.channels?.imessage?.probeTimeoutMs ?? 1e4;
  const nonMacHostError = resolveIMessageNonMacHostError(cliPath, opts.platform);
  if (nonMacHostError)
    return {
      ok: false,
      fatal: true,
      error: nonMacHostError,
    };
  if (!(await detectBinary(cliPath)))
    return {
      ok: false,
      error: isAutoManagedIMessageCliPath(cliPath, { explicit: explicitCliPath !== void 0 })
        ? `imsg not found (${cliPath}). Install imsg on the Messages Mac: ${IMESSAGE_INSTALL_COMMAND}`
        : `imsg command not found (${cliPath}). Check the configured iMessage cliPath or wrapper.`,
    };
  const rpcSupport = await probeRpcSupport(cliPath, effectiveTimeout);
  if (!rpcSupport.supported)
    return {
      ok: false,
      error: rpcSupport.error ?? "imsg rpc unavailable",
      fatal: rpcSupport.fatal,
    };
  const privateApi = await probeIMessagePrivateApi(cliPath, effectiveTimeout, {
    forceRefresh: opts.forceRefresh,
  });
  const client = await createIMessageRpcClient({
    cliPath,
    dbPath,
    runtime: opts.runtime,
  });
  try {
    await client.request("chats.list", { limit: 1 }, { timeoutMs: effectiveTimeout });
    return {
      ok: true,
      privateApi,
    };
  } catch (err) {
    return {
      ok: false,
      error: String(err),
      privateApi,
    };
  } finally {
    await client.stop();
  }
}
//#endregion
//#region extensions/imessage/src/conversation-id-core.ts
function normalizeIMessageAcpConversationId(conversationId) {
  const trimmed = conversationId.trim();
  if (!trimmed) return null;
  try {
    const parsed = parseIMessageTarget(trimmed);
    if (parsed.kind === "handle") {
      const handle = normalizeIMessageHandle(parsed.to);
      return handle ? { conversationId: handle } : null;
    }
    if (parsed.kind === "chat_id") return { conversationId: String(parsed.chatId) };
    if (parsed.kind === "chat_guid") return { conversationId: parsed.chatGuid };
    return { conversationId: parsed.chatIdentifier };
  } catch {
    const handle = normalizeIMessageHandle(trimmed);
    return handle ? { conversationId: handle } : null;
  }
}
function matchIMessageAcpConversation(params) {
  const binding = normalizeIMessageAcpConversationId(params.bindingConversationId);
  const conversation = normalizeIMessageAcpConversationId(params.conversationId);
  if (!binding || !conversation) return null;
  if (binding.conversationId !== conversation.conversationId) return null;
  return {
    conversationId: conversation.conversationId,
    matchPriority: 2,
  };
}
function resolveIMessageConversationIdFromTarget(target) {
  return normalizeIMessageAcpConversationId(target)?.conversationId;
}
//#endregion
//#region extensions/imessage/src/conversation-id.ts
function resolveIMessageInboundConversationId(params) {
  if (params.isGroup)
    return params.chatId != null && Number.isFinite(params.chatId) ? String(params.chatId) : void 0;
  return normalizeIMessageHandle(params.sender) || void 0;
}
//#endregion
//#region extensions/imessage/src/monitor/sanitize-outbound.ts
/**
 * Patterns that indicate assistant-internal metadata leaked into text.
 * These must never reach a user-facing channel.
 */
const INTERNAL_SEPARATOR_RE = /(?:#\+){2,}#?/g;
const ASSISTANT_ROLE_MARKER_RE = /\bassistant\s+to\s*=\s*\w+/gi;
const ROLE_TURN_MARKER_RE = /^[ \t]*(?:user|system|assistant)\s*:\s*$/gm;
/**
 * Strip all assistant-internal scaffolding from outbound text before delivery.
 * Applies reasoning/thinking tag removal, memory tag removal, and
 * model-specific internal separator stripping.
 */
function sanitizeOutboundText(text) {
  if (!text) return text;
  let cleaned = stripAssistantInternalScaffolding(text);
  cleaned = cleaned.replace(INTERNAL_SEPARATOR_RE, "");
  cleaned = cleaned.replace(ASSISTANT_ROLE_MARKER_RE, "");
  cleaned = cleaned.replace(ROLE_TURN_MARKER_RE, "");
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n").trim();
  return cleaned;
}
//#endregion
export {
  resolveIMessageConversationIdFromTarget as a,
  IMESSAGE_INSTALL_COMMAND as c,
  imessageCompletionNote as d,
  imessageDmPolicy as f,
  normalizeIMessageCliPathForSetup as g,
  isAutoManagedIMessageCliPath as h,
  normalizeIMessageAcpConversationId as i,
  createIMessageCliPathTextInput as l,
  imessageSetupStatusBase as m,
  resolveIMessageInboundConversationId as n,
  probeIMessage as o,
  imessageSetupAdapter as p,
  matchIMessageAcpConversation as r,
  probeIMessagePrivateApi as s,
  sanitizeOutboundText as t,
  createIMessageSetupWizardProxy as u,
};
