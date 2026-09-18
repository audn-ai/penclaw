import { a as resolveIMessageAccount } from "./accounts--1GXl2sX.js";
import { t as createChannelApprovalAuth } from "./approval-auth-helpers-BtEiGp-a.js";
import "./number-runtime-B-n-wjMn.js";
import {
  c as createApprovalReactionTargetStore,
  d as listApprovalReactionBindings,
  i as buildApprovalReactionHint,
  l as hasApprovalReactionHintText,
  m as resolveTypedApprovalReactionTarget,
  n as addApprovalReactionHintToText,
} from "./approval-reaction-runtime-BmaCRg-j.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import {
  C as resolveExpiresAtMsFromDurationMs,
  m as isFutureDateTimestampMs,
  o as asDateTimestampMs,
} from "./number-coercion-CJQ8TR--.js";
import { n as getOptionalIMessageRuntime } from "./runtime-CKNRV1AW.js";
import { c as parseIMessageTarget, o as normalizeIMessageHandle } from "./targets-BO9NhvfG.js";
//#region extensions/imessage/src/approval-auth.ts
function normalizeIMessageApproverId(value) {
  const raw = String(value).trim();
  if (!raw) return;
  const normalized = normalizeIMessageHandle(raw);
  if (
    !normalized ||
    normalized.startsWith("chat_id:") ||
    normalized.startsWith("chat_guid:") ||
    normalized.startsWith("chat_identifier:")
  )
    return;
  return normalized;
}
function normalizeIMessageApproverEntry(value) {
  return String(value).trim() === "*" ? "*" : normalizeIMessageApproverId(value);
}
const imessageApproval = createChannelApprovalAuth({
  channelLabel: "iMessage",
  resolveInputs: ({ cfg, accountId }) => {
    return {
      allowFrom: resolveIMessageAccount({
        cfg,
        accountId,
      }).config.allowFrom,
    };
  },
  normalizeApprover: normalizeIMessageApproverEntry,
  normalizeSenderId: normalizeIMessageApproverId,
  isWildcardAuthorized: ({ purpose, approvers }) => purpose === "action" && approvers.includes("*"),
});
const getIMessageApprovalApprovers = imessageApproval.resolveApprovers;
const imessageApprovalAuth = imessageApproval.approvalAuth;
//#endregion
//#region extensions/imessage/src/monitor/reaction-context.ts
const TAPBACK_TEXT_PATTERNS = [
  {
    prefix: "loved",
    action: "added",
    emoji: "❤️",
  },
  {
    prefix: "liked",
    action: "added",
    emoji: "👍",
  },
  {
    prefix: "disliked",
    action: "added",
    emoji: "👎",
  },
  {
    prefix: "laughed at",
    action: "added",
    emoji: "😂",
  },
  {
    prefix: "emphasized",
    action: "added",
    emoji: "‼️",
  },
  {
    prefix: "questioned",
    action: "added",
    emoji: "❓",
  },
  {
    prefix: "removed a heart from",
    action: "removed",
    emoji: "❤️",
  },
  {
    prefix: "removed a like from",
    action: "removed",
    emoji: "👍",
  },
  {
    prefix: "removed a dislike from",
    action: "removed",
    emoji: "👎",
  },
  {
    prefix: "removed a laugh from",
    action: "removed",
    emoji: "😂",
  },
  {
    prefix: "removed an emphasis from",
    action: "removed",
    emoji: "‼️",
  },
  {
    prefix: "removed a question from",
    action: "removed",
    emoji: "❓",
  },
];
function normalizeReactionValue(value) {
  return typeof value === "string" ? value.trim().replace(/^p:\d+\//iu, "") || void 0 : void 0;
}
function resolveReactionTargetGuidCandidates(...values) {
  const candidates = [];
  for (const value of values) {
    if (typeof value !== "string") continue;
    const raw = value.trim();
    if (!raw) continue;
    const normalized = raw.replace(/^p:\d+\//iu, "");
    for (const candidate of [normalized, raw])
      if (candidate && !candidates.includes(candidate)) candidates.push(candidate);
  }
  return candidates;
}
function resolveTapbackTextContext(bodyText) {
  const lower = bodyText.toLowerCase();
  for (const pattern of TAPBACK_TEXT_PATTERNS) {
    if (!lower.startsWith(pattern.prefix)) continue;
    const afterPrefix = bodyText.slice(pattern.prefix.length).trim();
    if (!/^["“]/u.test(afterPrefix)) continue;
    return {
      action: pattern.action,
      emoji: pattern.emoji,
      targetText: afterPrefix
        .replace(/^["“]/u, "")
        .replace(/["”]$/u, "")
        .trim(),
    };
  }
  return null;
}
function resolveIMessageReactionContext(message, bodyText) {
  if (
    message.is_reaction === true ||
    message.is_tapback === true ||
    (typeof message.associated_message_type === "number" &&
      Number.isFinite(message.associated_message_type) &&
      message.associated_message_type >= 2e3 &&
      message.associated_message_type < 4e3)
  ) {
    const targetGuids = resolveReactionTargetGuidCandidates(
      message.reacted_to_guid,
      message.associated_message_guid,
    );
    return {
      action: message.is_reaction_add === false ? "removed" : "added",
      emoji:
        normalizeReactionValue(message.reaction_emoji) ??
        normalizeReactionValue(message.reaction_type) ??
        "reaction",
      targetGuid: targetGuids[0],
      targetGuids,
    };
  }
  return resolveTapbackTextContext(bodyText);
}
//#endregion
//#region extensions/imessage/src/approval-reactions.ts
const PERSISTENT_NAMESPACE = "imessage.approval-reactions";
const PERSISTENT_MAX_ENTRIES = 1e3;
const DEFAULT_REACTION_TARGET_TTL_MS = 1440 * 60 * 1e3;
const resolverRuntimeLoader = createLazyRuntimeModule(
  () => import("./approval-resolver-Dfauuuss.js"),
);
const pendingReactionPollTargets = /* @__PURE__ */ new Map();
const loadApprovalResolver = resolverRuntimeLoader;
function chatIdToKeyValue(chatId) {
  if (chatId == null || chatId === "") return null;
  if (typeof chatId === "number")
    return Number.isFinite(chatId) && chatId > 0 ? String(chatId) : null;
  return chatId.trim() || null;
}
function enumerateConversationKeyForms(conversation) {
  const forms = [];
  const chatGuid = conversation.chatGuid?.trim();
  if (chatGuid) forms.push(`chat_guid:${chatGuid}`);
  const chatIdentifier = conversation.chatIdentifier?.trim();
  if (chatIdentifier) forms.push(`chat_identifier:${chatIdentifier}`);
  const chatIdValue = chatIdToKeyValue(conversation.chatId);
  if (chatIdValue) forms.push(`chat_id:${chatIdValue}`);
  const handle = conversation.handle?.trim();
  if (handle) forms.push(`handle:${handle}`);
  return forms;
}
function normalizeConversationKey(conversation) {
  return enumerateConversationKeyForms(conversation)[0];
}
function enumerateReactionTargetKeys(params) {
  const accountId = params.accountId.trim();
  const messageId = params.messageId.trim();
  if (!accountId || !messageId) return [];
  return enumerateConversationKeyForms(params.conversation).map(
    (form) => `${accountId}:${form}:${messageId}`,
  );
}
function prunePendingReactionPollTargets(nowMs = Date.now()) {
  for (const [key, target] of pendingReactionPollTargets.entries())
    if (!isFutureDateTimestampMs(target.expiresAtMs, { nowMs }))
      pendingReactionPollTargets.delete(key);
}
function resolvePendingReactionPollExpiry(ttlMs) {
  const nowMs = asDateTimestampMs(Date.now());
  if (nowMs === void 0) return;
  const expiresAtMs =
    resolveExpiresAtMsFromDurationMs(ttlMs ?? DEFAULT_REACTION_TARGET_TTL_MS, { nowMs }) ??
    resolveExpiresAtMsFromDurationMs(DEFAULT_REACTION_TARGET_TTL_MS, { nowMs });
  if (expiresAtMs === void 0) return;
  return {
    ttlMs: expiresAtMs - nowMs,
    expiresAtMs,
  };
}
function normalizePollTargetMessageId(messageId) {
  return messageId.trim().replace(/^p:\d+\//iu, "");
}
function mergePollTargetConversation(left, right) {
  return {
    chatGuid: left.chatGuid ?? right.chatGuid,
    chatIdentifier: left.chatIdentifier ?? right.chatIdentifier,
    chatId: left.chatId ?? right.chatId,
    handle: left.handle ?? right.handle,
  };
}
function listPendingIMessageApprovalReactionPollTargets(params) {
  const accountId = params.accountId.trim();
  if (!accountId) return [];
  prunePendingReactionPollTargets();
  const targetByApprovalAndMessage = /* @__PURE__ */ new Map();
  for (const target of pendingReactionPollTargets.values()) {
    if (target.accountId !== accountId) continue;
    const key = `${target.approvalId}:${normalizePollTargetMessageId(target.messageId)}`;
    const existing = targetByApprovalAndMessage.get(key);
    if (!existing) {
      targetByApprovalAndMessage.set(key, target);
      continue;
    }
    targetByApprovalAndMessage.set(key, {
      ...existing,
      conversation: mergePollTargetConversation(existing.conversation, target.conversation),
      expiresAtMs: Math.max(existing.expiresAtMs, target.expiresAtMs),
    });
  }
  return [...targetByApprovalAndMessage.values()];
}
function reportPersistentApprovalReactionError(error) {
  try {
    getOptionalIMessageRuntime()
      ?.logging.getChildLogger({
        plugin: "imessage",
        feature: "approval-reaction-state",
      })
      .warn("iMessage persistent approval reaction state failed", { error: String(error) });
  } catch {}
}
function reportApprovalBindingCorrelationMismatch(binding) {
  try {
    getOptionalIMessageRuntime()
      ?.logging.getChildLogger({
        plugin: "imessage",
        feature: "approval-reaction-state",
      })
      .warn("iMessage approval prompt text failed binding correlation; tapbacks disabled", {
        approvalId: binding.approvalId,
        approvalKind: binding.approvalKind,
      });
  } catch {}
}
function readPersistedTarget(value) {
  const target = value;
  if (
    !target ||
    typeof target.approvalId !== "string" ||
    !Array.isArray(target.allowedDecisions) ||
    (target.approvalKind !== "exec" && target.approvalKind !== "plugin")
  )
    return null;
  const allowedDecisions = target.allowedDecisions
    .map((valueValue) =>
      typeof valueValue === "string" ? normalizeApprovalDecision(valueValue) : null,
    )
    .filter((valueLocal) => Boolean(valueLocal));
  if (allowedDecisions.length === 0) return null;
  return {
    approvalId: target.approvalId,
    approvalKind: target.approvalKind,
    allowedDecisions,
  };
}
const imessageApprovalReactionTargets = createApprovalReactionTargetStore({
  namespace: PERSISTENT_NAMESPACE,
  maxEntries: PERSISTENT_MAX_ENTRIES,
  defaultTtlMs: DEFAULT_REACTION_TARGET_TTL_MS,
  openStore: (params) => getOptionalIMessageRuntime()?.state.openKeyedStore(params),
  logPersistentError: reportPersistentApprovalReactionError,
  readPersistedTarget,
});
function listIMessageApprovalReactionBindings(allowedDecisions) {
  return listApprovalReactionBindings({ allowedDecisions });
}
function buildIMessageApprovalReactionHint(allowedDecisions) {
  return buildApprovalReactionHint({ allowedDecisions });
}
function addIMessageApprovalReactionHintToText(params) {
  return addApprovalReactionHintToText(params);
}
function appendIMessageApprovalReactionHintForOutboundMessage(text) {
  if (hasApprovalReactionHintText(text)) return text;
  const binding = extractIMessageApprovalPromptBinding(text);
  if (!binding) return text;
  return addIMessageApprovalReactionHintToText({
    text,
    allowedDecisions: binding.allowedDecisions,
  });
}
const IMESSAGE_APPROVAL_DELIVERY_BINDING_KEY = "imessageApprovalReactionBindingV1";
function readStrictDecisionList(value) {
  if (!Array.isArray(value) || value.length === 0) return null;
  const decisions = [];
  for (const entry of value) {
    if (entry !== "allow-once" && entry !== "allow-always" && entry !== "deny") return null;
    if (decisions.includes(entry)) return null;
    decisions.push(entry);
  }
  return decisions;
}
function decisionSetsMatch(left, right) {
  return left.length === right.length && left.every((decision) => right.includes(decision));
}
function readStrictApprovalMetadata(payload) {
  const value = payload.channelData?.execApproval;
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value;
  const approvalId = typeof record.approvalId === "string" ? record.approvalId.trim() : "";
  const approvalSlug = typeof record.approvalSlug === "string" ? record.approvalSlug.trim() : "";
  const approvalKind = record.approvalKind;
  const allowedDecisions = readStrictDecisionList(record.allowedDecisions);
  if (
    !approvalId ||
    !approvalSlug ||
    (approvalKind !== "exec" && approvalKind !== "plugin") ||
    !allowedDecisions
  )
    return null;
  return {
    approvalId,
    approvalSlug,
    approvalKind,
    allowedDecisions,
  };
}
function bindingsMatch(left, right) {
  return (
    left.approvalId === right.approvalId &&
    left.approvalSlug === right.approvalSlug &&
    left.approvalKind === right.approvalKind &&
    decisionSetsMatch(left.allowedDecisions, right.allowedDecisions)
  );
}
function readTypedApprovalPresentationBinding(payload) {
  const metadata = readStrictApprovalMetadata(payload);
  if (!metadata) return null;
  const approvalActions = (payload.presentation?.blocks ?? [])
    .flatMap((block) => (block.type === "buttons" ? block.buttons : []))
    .map((button) => button.action)
    .filter((action) => action?.type === "approval");
  if (approvalActions.length === 0) return null;
  const allowedDecisions = [];
  for (const action of approvalActions) {
    if (
      action.approvalId !== metadata.approvalId ||
      action.approvalKind !== metadata.approvalKind ||
      allowedDecisions.includes(action.decision)
    )
      return null;
    allowedDecisions.push(action.decision);
  }
  return decisionSetsMatch(metadata.allowedDecisions, allowedDecisions) ? metadata : null;
}
function visibleApprovalBindingMatches(text, binding, options) {
  if (!text) return false;
  const lines = text.split(/\r?\n/).map((line) => line.trim());
  const normalizedHeaders = lines.map((line) => line.replace(/^[^A-Za-z0-9]*/, ""));
  const hasKindHeader =
    binding.approvalKind === "exec"
      ? lines.includes("Approval required.") ||
        normalizedHeaders.some((line) => /^Exec approval required$/i.test(line))
      : normalizedHeaders.some((line) => /^Plugin approval required$/i.test(line));
  const hasId =
    lines.includes(`ID: ${binding.approvalId}`) ||
    lines.includes(`Full id: \`${binding.approvalId}\``) ||
    lines.includes(`Full id: ${binding.approvalId}`);
  if (!hasKindHeader || !hasId) return false;
  const visibleDecisions = [];
  for (const line of lines) {
    const match = line.match(APPROVE_COMMAND_LINE_RE);
    const approvalId = match?.[1];
    const decisionsText = match?.[2];
    if (
      !approvalId ||
      !decisionsText ||
      (approvalId !== binding.approvalId && approvalId !== binding.approvalSlug)
    )
      continue;
    for (const token of decisionsText.split(/[\s|,]+/)) {
      const decision = normalizeApprovalDecision(token);
      if (decision && !visibleDecisions.includes(decision)) visibleDecisions.push(decision);
    }
  }
  if (!decisionSetsMatch(binding.allowedDecisions, visibleDecisions)) return false;
  if (!options.requireReactionHint) return true;
  const hint = buildIMessageApprovalReactionHint(binding.allowedDecisions);
  return Boolean(hint && text.includes(hint));
}
function readDeliveredApprovalBinding(payload) {
  const metadata = readStrictApprovalMetadata(payload);
  const value = payload.channelData?.[IMESSAGE_APPROVAL_DELIVERY_BINDING_KEY];
  if (!metadata || !value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value;
  const approvalId = typeof record.approvalId === "string" ? record.approvalId.trim() : "";
  const approvalSlug = typeof record.approvalSlug === "string" ? record.approvalSlug.trim() : "";
  const approvalKind = record.approvalKind;
  const allowedDecisions = readStrictDecisionList(record.allowedDecisions);
  if (
    record.version !== 1 ||
    !approvalId ||
    !approvalSlug ||
    (approvalKind !== "exec" && approvalKind !== "plugin") ||
    !allowedDecisions
  )
    return null;
  return bindingsMatch(metadata, {
    approvalId,
    approvalSlug,
    approvalKind,
    allowedDecisions,
  })
    ? metadata
    : null;
}
/** Preserve a validated typed approval binding until the iMessage GUID is known. */
function addIMessageApprovalReactionHintToStructuredPayload(params) {
  const metadata = readTypedApprovalPresentationBinding(params.payload);
  const text = params.payload.text;
  if (metadata?.approvalKind !== params.approvalKind || !text) return null;
  if (!visibleApprovalBindingMatches(text, metadata, { requireReactionHint: false })) {
    reportApprovalBindingCorrelationMismatch(metadata);
    return null;
  }
  return {
    ...params.payload,
    text: addIMessageApprovalReactionHintToText({
      text,
      allowedDecisions: metadata.allowedDecisions,
    }),
    channelData: {
      ...params.payload.channelData,
      [IMESSAGE_APPROVAL_DELIVERY_BINDING_KEY]: {
        version: 1,
        approvalId: metadata.approvalId,
        approvalSlug: metadata.approvalSlug,
        approvalKind: metadata.approvalKind,
        allowedDecisions: metadata.allowedDecisions,
      },
    },
  };
}
function normalizeApprovalDecision(value) {
  const normalized = value.trim().toLowerCase();
  if (normalized === "always") return "allow-always";
  if (normalized === "allow-once" || normalized === "allow-always" || normalized === "deny")
    return normalized;
  return null;
}
const APPROVAL_ID_LINE_RE = /^\s*ID:\s*([A-Za-z0-9][A-Za-z0-9._:-]*)\s*$/i;
const APPROVE_COMMAND_LINE_RE = /\/approve(?:@[^\s]+)?\s+([A-Za-z0-9][A-Za-z0-9._:-]*)\s+(.+)$/i;
function extractIMessageApprovalPromptBinding(text) {
  const lines = text.split(/\r?\n/);
  const hasExecHeader = lines.some((line) =>
    /^\s*[^A-Za-z0-9]*Exec approval required\s*$/i.test(line),
  );
  const hasPluginHeader = lines.some((line) =>
    /^\s*[^A-Za-z0-9]*Plugin approval required\s*$/i.test(line),
  );
  if (hasExecHeader === hasPluginHeader) return null;
  const approvalKind = hasPluginHeader ? "plugin" : "exec";
  const idHeaderMatch = lines
    .map((line) => line.match(APPROVAL_ID_LINE_RE))
    .find((match) => Boolean(match));
  if (!idHeaderMatch) return null;
  const approvalId = idHeaderMatch[1];
  if (!approvalId) return null;
  const allowedDecisions = [];
  for (const line of lines) {
    const match = line.match(APPROVE_COMMAND_LINE_RE);
    const decisionsText = match?.[2];
    if (!match || match[1] !== approvalId || !decisionsText) continue;
    const decisions = decisionsText.split(/[\s|,]+/);
    for (const decisionText of decisions) {
      const decision = normalizeApprovalDecision(decisionText);
      if (decision && !allowedDecisions.includes(decision)) allowedDecisions.push(decision);
    }
  }
  return allowedDecisions.length > 0
    ? {
        approvalId,
        approvalKind,
        allowedDecisions,
      }
    : null;
}
function registerIMessageApprovalReactionTarget(params) {
  const approvalId = params.approvalId.trim();
  const allowedDecisions = listIMessageApprovalReactionBindings(params.allowedDecisions).map(
    (binding) => binding.decision,
  );
  if (
    !approvalId ||
    (params.approvalKind !== "exec" && params.approvalKind !== "plugin") ||
    allowedDecisions.length === 0
  )
    return null;
  const target = {
    approvalId,
    approvalKind: params.approvalKind,
    allowedDecisions,
  };
  const expiry = resolvePendingReactionPollExpiry(params.ttlMs);
  if (!expiry) return null;
  const keys = enumerateReactionTargetKeys({
    accountId: params.accountId,
    conversation: params.conversation,
    messageId: params.messageId,
  });
  if (keys.length === 0) return null;
  for (const key of keys) {
    imessageApprovalReactionTargets.register(key, target, { ttlMs: expiry.ttlMs });
    pendingReactionPollTargets.set(key, {
      accountId: params.accountId,
      conversation: params.conversation,
      messageId: params.messageId,
      approvalId,
      approvalKind: params.approvalKind,
      allowedDecisions,
      expiresAtMs: expiry.expiresAtMs,
    });
  }
  prunePendingReactionPollTargets();
  return target;
}
function registerIMessageApprovalReactionTargetForOutboundMessage(params) {
  const binding = extractIMessageApprovalPromptBinding(params.text);
  if (!binding || binding.approvalKind !== params.approvalKind) return false;
  return Boolean(
    registerIMessageApprovalReactionTarget({
      accountId: params.accountId,
      conversation: params.conversation,
      messageId: params.messageId,
      approvalId: binding.approvalId,
      approvalKind: params.approvalKind,
      allowedDecisions: binding.allowedDecisions,
      ttlMs: params.ttlMs,
    }),
  );
}
function buildIMessageApprovalConversationKeyForTarget(to) {
  try {
    const target = parseIMessageTarget(to);
    if (target.kind === "chat_id") return { chatId: target.chatId };
    if (target.kind === "chat_guid") return { chatGuid: target.chatGuid };
    if (target.kind === "chat_identifier") return { chatIdentifier: target.chatIdentifier };
    const handle = normalizeIMessageHandle(target.to);
    return handle ? { handle } : null;
  } catch {
    return null;
  }
}
function listDeliveredIMessageApprovalGuids(params) {
  const deliveries = [];
  const seen = /* @__PURE__ */ new Set();
  for (const result of params.results) {
    if (result.channel !== "imessage") continue;
    const guid =
      typeof result.meta?.imessageMessageGuid === "string"
        ? result.meta.imessageMessageGuid.trim()
        : "";
    const visibleText = result.meta?.imessageVisibleText;
    if (!guid || /^\d+$/.test(guid) || seen.has(guid) || typeof visibleText !== "string") continue;
    seen.add(guid);
    deliveries.push({
      guid,
      visibleText,
    });
  }
  if (
    !visibleApprovalBindingMatches(
      deliveries.map((delivery) => delivery.visibleText).join("\n"),
      params.binding,
      { requireReactionHint: true },
    )
  ) {
    if (params.results.some((result) => result.channel === "imessage"))
      reportApprovalBindingCorrelationMismatch(params.binding);
    return [];
  }
  return deliveries.map((delivery) => delivery.guid);
}
/** Bind a typed forwarded approval after iMessage returns the stable tapback GUID. */
function registerIMessageApprovalReactionTargetForDeliveredPayload(params) {
  if (params.target.channel.trim().toLowerCase() !== "imessage") return false;
  const binding = readDeliveredApprovalBinding(params.payload);
  if (!binding) return false;
  const conversation = buildIMessageApprovalConversationKeyForTarget(params.target.to);
  if (!conversation) return false;
  let registered = false;
  for (const messageId of listDeliveredIMessageApprovalGuids({
    binding,
    results: params.results,
  }))
    registered =
      Boolean(
        registerIMessageApprovalReactionTarget({
          accountId: params.accountId,
          conversation,
          messageId,
          approvalId: binding.approvalId,
          approvalKind: binding.approvalKind,
          allowedDecisions: binding.allowedDecisions,
          ttlMs: params.ttlMs,
        }),
      ) || registered;
  return registered;
}
function unregisterIMessageApprovalReactionTarget(params) {
  const keys = enumerateReactionTargetKeys(params);
  for (const key of keys) {
    imessageApprovalReactionTargets.delete(key);
    pendingReactionPollTargets.delete(key);
  }
}
function resolveTarget(params) {
  const target = resolveTypedApprovalReactionTarget(params);
  return target
    ? {
        approvalId: target.approvalId,
        approvalKind: target.approvalKind,
        decision: target.decision,
      }
    : null;
}
function formatCanonicalApprovalTerminalState(approval) {
  const decision =
    approval.status === "allowed" || approval.status === "denied"
      ? ` decision=${approval.decision}`
      : "";
  return `status=${approval.status}${decision} reason=${approval.reason}`;
}
async function resolveIMessageApprovalReactionTargetWithPersistence(params) {
  const keys = enumerateReactionTargetKeys(params);
  for (const key of keys) {
    const target = resolveTarget({
      target: await imessageApprovalReactionTargets.lookup(key),
      reactionKey: params.reactionKey,
    });
    if (target) return target;
  }
  return null;
}
function readApprovalReactionEvent(message, bodyText) {
  const reaction = resolveIMessageReactionContext(message, bodyText);
  if (!reaction) return null;
  const reactionKey = reaction.emoji.trim();
  const candidates = (reaction.targetGuids ?? [])
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
  const primary = reaction.targetGuid?.trim() || candidates[0] || "";
  const messageIdCandidates = candidates.length > 0 ? candidates : primary ? [primary] : [];
  const actorHandle = normalizeIMessageHandle((message.sender ?? "").trim());
  if (!reactionKey || !primary || !actorHandle) return null;
  const conversation = {
    ...(message.chat_guid?.trim() ? { chatGuid: message.chat_guid.trim() } : {}),
    ...(message.chat_identifier?.trim() ? { chatIdentifier: message.chat_identifier.trim() } : {}),
    ...(chatIdToKeyValue(message.chat_id ?? void 0) ? { chatId: message.chat_id } : {}),
    ...(message.is_group ? {} : { handle: actorHandle }),
  };
  if (!normalizeConversationKey(conversation)) return null;
  return {
    conversation,
    messageId: primary,
    messageIdCandidates,
    actorHandle,
    reactionKey,
    action: reaction.action,
  };
}
async function handleIMessageApprovalReaction(params) {
  const event = readApprovalReactionEvent(params.message, params.bodyText);
  if (!event)
    return {
      handled: false,
      stopPolling: false,
    };
  if (event.action === "removed")
    return {
      handled: false,
      stopPolling: false,
    };
  let target = null;
  let matchedMessageId = null;
  for (const candidate of event.messageIdCandidates) {
    target = await resolveIMessageApprovalReactionTargetWithPersistence({
      accountId: params.accountId,
      conversation: event.conversation,
      messageId: candidate,
      reactionKey: event.reactionKey,
    });
    if (target) {
      matchedMessageId = candidate;
      break;
    }
  }
  if (!target)
    return {
      handled: false,
      stopPolling: false,
    };
  if (
    getIMessageApprovalApprovers({
      cfg: params.cfg,
      accountId: params.accountId,
    }).length === 0
  ) {
    params.logVerboseMessage?.(
      `imessage: approval reaction denied id=${target.approvalId}; reactions require explicit approvers`,
    );
    return {
      handled: true,
      stopPolling: false,
    };
  }
  if (
    !imessageApprovalAuth.authorizeActorAction({
      cfg: params.cfg,
      accountId: params.accountId,
      senderId: event.actorHandle,
      action: "approve",
      approvalKind: target.approvalKind,
    }).authorized
  ) {
    params.logVerboseMessage?.(
      `imessage: approval reaction denied id=${target.approvalId} sender=${event.actorHandle}`,
    );
    return {
      handled: true,
      stopPolling: false,
    };
  }
  const { isApprovalNotFoundError, resolveIMessageApproval } = await loadApprovalResolver();
  try {
    const result = await resolveIMessageApproval({
      cfg: params.cfg,
      approvalId: target.approvalId,
      approvalKind: target.approvalKind,
      decision: target.decision,
      senderId: event.actorHandle,
      gatewayUrl: params.gatewayUrl,
    });
    for (const candidate of event.messageIdCandidates)
      unregisterIMessageApprovalReactionTarget({
        accountId: params.accountId,
        conversation: event.conversation,
        messageId: candidate,
      });
    const outcome = result.applied ? "resolved" : "already resolved";
    params.logVerboseMessage?.(
      `imessage: approval reaction ${outcome} id=${target.approvalId} sender=${event.actorHandle} ${formatCanonicalApprovalTerminalState(result.approval)} via messageId=${matchedMessageId ?? event.messageId}`,
    );
    return {
      handled: true,
      stopPolling: true,
      stopPollingReason: "resolved",
    };
  } catch (error) {
    if (isApprovalNotFoundError(error)) {
      for (const candidate of event.messageIdCandidates)
        unregisterIMessageApprovalReactionTarget({
          accountId: params.accountId,
          conversation: event.conversation,
          messageId: candidate,
        });
      params.logVerboseMessage?.(
        `imessage: approval reaction ignored for expired approval id=${target.approvalId} sender=${event.actorHandle}`,
      );
      return {
        handled: true,
        stopPolling: true,
        stopPollingReason: "not-found",
      };
    }
    try {
      getOptionalIMessageRuntime()
        ?.logging.getChildLogger({
          plugin: "imessage",
          feature: "approval-reactions",
        })
        .warn("approval reaction failed", {
          approvalId: target.approvalId,
          senderId: event.actorHandle,
          error: String(error),
        });
    } catch {}
    params.logVerboseMessage?.(
      `imessage: approval reaction failed id=${target.approvalId} sender=${event.actorHandle}: ${String(error)}`,
    );
    return {
      handled: true,
      stopPolling: true,
      stopPollingReason: "resolver-error",
    };
  }
}
async function maybeResolveIMessageApprovalReaction(params) {
  return (await handleIMessageApprovalReaction(params)).handled;
}
function clearIMessageApprovalReactionTargetsForTest() {
  imessageApprovalReactionTargets.clearForTest();
  pendingReactionPollTargets.clear();
  resolverRuntimeLoader.clear();
}
//#endregion
export {
  getIMessageApprovalApprovers as _,
  buildIMessageApprovalReactionHint as a,
  handleIMessageApprovalReaction as c,
  registerIMessageApprovalReactionTarget as d,
  registerIMessageApprovalReactionTargetForDeliveredPayload as f,
  resolveIMessageReactionContext as g,
  unregisterIMessageApprovalReactionTarget as h,
  buildIMessageApprovalConversationKeyForTarget as i,
  listPendingIMessageApprovalReactionPollTargets as l,
  resolveIMessageApprovalReactionTargetWithPersistence as m,
  addIMessageApprovalReactionHintToText as n,
  clearIMessageApprovalReactionTargetsForTest as o,
  registerIMessageApprovalReactionTargetForOutboundMessage as p,
  appendIMessageApprovalReactionHintForOutboundMessage as r,
  extractIMessageApprovalPromptBinding as s,
  addIMessageApprovalReactionHintToStructuredPayload as t,
  maybeResolveIMessageApprovalReaction as u,
  imessageApprovalAuth as v,
};
