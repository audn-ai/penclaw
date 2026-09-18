import { c as resolveMergedAccountConfig } from "./account-helpers-BAtt8fRD.js";
import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { p as isRecord$1 } from "./accounts-upJPqv8I.js";
import {
  l as resolveScopeToolsPolicy,
  s as resolveScopeKeyCaseInsensitive,
} from "./channel-policy-DXOn_tKS.js";
import { t as ToolAuthorizationError } from "./common-DyDSUect.js";
import {
  n as createChannelIngressResolver,
  o as defineStableChannelIngressIdentity,
} from "./message-access-DY5sc0VK.js";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-C0uxiauk.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import "./channel-outbound-DlkFd7rO.js";
import "./account-resolution-DijsTQIy.js";
import "./channel-actions-C9vNf9jw.js";
import {
  i as resolveOpenProviderRuntimeGroupPolicy,
  r as resolveDefaultGroupPolicy,
} from "./runtime-group-policy-BEjP88cf.js";
import "./channel-ingress-runtime-B6CHO2ZB.js";
import {
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { r as normalizeFeishuTarget, t as detectIdType } from "./targets-5VnlkfaZ.js";
//#region extensions/feishu/src/card-interaction.ts
const FEISHU_CARD_INTERACTION_VERSION = "ocf1";
function isInteractionKind(value) {
  return value === "button" || value === "quick" || value === "meta";
}
function isMetadataValue(value) {
  return (
    value === null ||
    value === void 0 ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}
function createFeishuCardInteractionEnvelope(envelope) {
  return {
    oc: FEISHU_CARD_INTERACTION_VERSION,
    ...envelope,
  };
}
function buildFeishuCardActionTextFallback(event) {
  const actionValue = event.action.value;
  if (isRecord$1(actionValue)) {
    if (typeof actionValue.text === "string") return actionValue.text;
    if (typeof actionValue.command === "string") return actionValue.command;
    return JSON.stringify(actionValue);
  }
  return String(actionValue);
}
function decodeFeishuCardAction(params) {
  const { event, now = Date.now() } = params;
  const actionValue = event.action.value;
  if (!isRecord$1(actionValue) || actionValue.oc !== "ocf1")
    return {
      kind: "legacy",
      text: buildFeishuCardActionTextFallback(event),
    };
  if (!isInteractionKind(actionValue.k) || typeof actionValue.a !== "string" || !actionValue.a)
    return {
      kind: "invalid",
      reason: "malformed",
    };
  if (actionValue.q !== void 0 && typeof actionValue.q !== "string")
    return {
      kind: "invalid",
      reason: "malformed",
    };
  if (actionValue.m !== void 0) {
    if (!isRecord$1(actionValue.m))
      return {
        kind: "invalid",
        reason: "malformed",
      };
    for (const value of Object.values(actionValue.m))
      if (!isMetadataValue(value))
        return {
          kind: "invalid",
          reason: "malformed",
        };
  }
  if (actionValue.c !== void 0) {
    if (!isRecord$1(actionValue.c))
      return {
        kind: "invalid",
        reason: "malformed",
      };
    if (actionValue.c.u !== void 0 && typeof actionValue.c.u !== "string")
      return {
        kind: "invalid",
        reason: "malformed",
      };
    if (actionValue.c.h !== void 0 && typeof actionValue.c.h !== "string")
      return {
        kind: "invalid",
        reason: "malformed",
      };
    if (actionValue.c.s !== void 0 && typeof actionValue.c.s !== "string")
      return {
        kind: "invalid",
        reason: "malformed",
      };
    if (actionValue.c.e !== void 0 && !Number.isFinite(actionValue.c.e))
      return {
        kind: "invalid",
        reason: "malformed",
      };
    if (actionValue.c.t !== void 0 && actionValue.c.t !== "p2p" && actionValue.c.t !== "group")
      return {
        kind: "invalid",
        reason: "malformed",
      };
    if (typeof actionValue.c.e === "number" && actionValue.c.e < now)
      return {
        kind: "invalid",
        reason: "stale",
      };
    const expectedUser = actionValue.c.u?.trim();
    if (expectedUser && expectedUser !== (event.operator.open_id ?? "").trim())
      return {
        kind: "invalid",
        reason: "wrong_user",
      };
    const expectedChat = actionValue.c.h?.trim();
    if (expectedChat && expectedChat !== (event.context.chat_id ?? "").trim())
      return {
        kind: "invalid",
        reason: "wrong_conversation",
      };
  }
  return {
    kind: "structured",
    envelope: actionValue,
  };
}
//#endregion
//#region extensions/feishu/src/chat-type.ts
function normalizeFeishuChatType(value) {
  if (value === "group" || value === "topic_group") return "group";
  if (value === "p2p") return "p2p";
}
function normalizeFeishuChatMode(value) {
  if (value === "group" || value === "topic" || value === "topic_group") return "group";
  return value === "p2p" ? "p2p" : void 0;
}
function resolveFeishuChatType(chat) {
  return normalizeFeishuChatMode(chat.chat_mode) ?? normalizeFeishuChatType(chat.chat_type);
}
//#endregion
//#region extensions/feishu/src/policy.ts
const FEISHU_PROVIDER_PREFIX_RE = /^(feishu|lark):/i;
const FEISHU_TYPED_PREFIX_RE = /^(chat|group|channel|user|dm|open_id):/i;
const FEISHU_ID_KIND = "plugin:feishu-id";
const feishuIngressIdentity = defineStableChannelIngressIdentity({
  key: "feishu-id",
  kind: FEISHU_ID_KIND,
  normalize: normalizeFeishuAllowEntry,
  sensitivity: "pii",
  aliases: [
    {
      key: "feishu-alt-id",
      kind: FEISHU_ID_KIND,
      normalizeEntry: () => null,
      normalizeSubject: normalizeFeishuAllowEntry,
      sensitivity: "pii",
    },
  ],
  isWildcardEntry: (entry) => normalizeFeishuAllowEntry(entry) === "*",
  resolveEntryId: ({ entryIndex }) => `feishu-entry-${entryIndex + 1}`,
});
function normalizeFeishuAllowEntry(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (trimmed === "*") return "*";
  let withoutProviderPrefix = trimmed;
  while (FEISHU_PROVIDER_PREFIX_RE.test(withoutProviderPrefix))
    withoutProviderPrefix = withoutProviderPrefix.replace(FEISHU_PROVIDER_PREFIX_RE, "").trim();
  if (withoutProviderPrefix === "*") return "*";
  const lowered = normalizeOptionalLowercaseString(withoutProviderPrefix) ?? "";
  if (!lowered) return "";
  const prefixed = lowered.match(FEISHU_TYPED_PREFIX_RE);
  if (prefixed?.[1]) {
    const kind = ["chat", "group", "channel"].includes(prefixed[1]) ? "chat" : "user";
    const value = withoutProviderPrefix.slice(prefixed[0].length).trim();
    return value === "*" ? "*" : value ? `${kind}:${value}` : "";
  }
  const detectedType = detectIdType(withoutProviderPrefix);
  if (detectedType === "chat_id") return `chat:${withoutProviderPrefix}`;
  if (detectedType === "open_id" || detectedType === "user_id")
    return `user:${withoutProviderPrefix}`;
  return "";
}
function normalizeFeishuDmPolicy(policy) {
  return policy === "open" ||
    policy === "pairing" ||
    policy === "allowlist" ||
    policy === "disabled"
    ? policy
    : "pairing";
}
function normalizeFeishuGroupPolicy(policy) {
  return policy === "allowall" ? "open" : policy;
}
function createFeishuIngressSubject(params) {
  const ids = [params.primaryId, ...(params.alternateIds ?? [])]
    .map((value) => value?.trim())
    .filter((value) => Boolean(value));
  return {
    stableId: ids[0],
    aliases: { "feishu-alt-id": ids[1] },
  };
}
function createFeishuIngressResolver(params) {
  return createChannelIngressResolver({
    channelId: "feishu",
    accountId: normalizeAccountId(params.accountId) ?? "default",
    identity: feishuIngressIdentity,
    cfg: params.cfg,
    ...(params.readAllowFromStore ? { readStoreAllowFrom: params.readAllowFromStore } : {}),
  });
}
async function resolveFeishuDmIngressAccess(params) {
  return await createFeishuIngressResolver({
    cfg: params.cfg,
    accountId: params.accountId,
    readAllowFromStore: params.readAllowFromStore,
  }).message({
    subject: createFeishuIngressSubject({
      primaryId: params.senderOpenId,
      alternateIds: [params.senderUserId],
    }),
    conversation: {
      kind: "direct",
      id: params.conversationId,
    },
    event: { mayPair: params.mayPair },
    dmPolicy: normalizeFeishuDmPolicy(params.dmPolicy),
    groupPolicy: "disabled",
    allowFrom: params.allowFrom ?? [],
    ...(params.command ? { command: params.command } : {}),
  });
}
async function resolveFeishuGroupConversationIngressAccess(params) {
  const groupPolicy = normalizeFeishuGroupPolicy(params.groupPolicy);
  const groupAllowFrom =
    groupPolicy === "allowlist" && params.groupExplicitlyConfigured
      ? [...(params.groupAllowFrom ?? []), params.chatId]
      : (params.groupAllowFrom ?? []);
  return await createFeishuIngressResolver({
    cfg: params.cfg,
    accountId: params.accountId,
  }).message({
    subject: createFeishuIngressSubject({ primaryId: params.chatId }),
    conversation: {
      kind: "group",
      id: params.chatId,
    },
    dmPolicy: "disabled",
    groupPolicy,
    groupAllowFrom,
  });
}
async function resolveFeishuGroupSenderActivationIngressAccess(params) {
  const groupAllowFrom = params.allowFrom ?? [];
  return await createFeishuIngressResolver({
    cfg: params.cfg,
    accountId: params.accountId,
  }).message({
    subject: createFeishuIngressSubject({
      primaryId: params.senderOpenId,
      alternateIds: [params.senderUserId],
    }),
    conversation: {
      kind: "group",
      id: params.chatId,
    },
    dmPolicy: "disabled",
    groupPolicy: groupAllowFrom.length > 0 ? "allowlist" : "open",
    groupAllowFrom,
    mentionFacts: {
      canDetectMention: true,
      wasMentioned: params.mentionedBot,
    },
    policy: {
      activation: {
        requireMention: params.requireMention,
        allowTextCommands: false,
      },
    },
    ...(params.command ? { command: params.command } : {}),
  });
}
function resolveFeishuGroupConfig(params) {
  const groups = params.cfg?.groups ?? {};
  const wildcard = groups["*"];
  const groupId = params.groupId?.trim();
  if (!groupId) return;
  const direct = groups[groupId];
  if (direct) return direct;
  const lowered = normalizeOptionalLowercaseString(groupId) ?? "";
  const matchKey = Object.keys(groups).find(
    (key) => normalizeOptionalLowercaseString(key) === lowered,
  );
  if (matchKey) return groups[matchKey];
  return wildcard;
}
function hasExplicitFeishuGroupConfig(params) {
  const groups = params.cfg?.groups ?? {};
  const groupId = params.groupId?.trim();
  if (!groupId) return false;
  if (Object.hasOwn(groups, groupId) && groupId !== "*") return true;
  const lowered = normalizeOptionalLowercaseString(groupId) ?? "";
  return Object.keys(groups).some(
    (key) => key !== "*" && normalizeOptionalLowercaseString(key) === lowered,
  );
}
function resolveFeishuGroupToolPolicy(params) {
  const cfg = params.cfg.channels?.feishu;
  if (!cfg) return;
  const groups = cfg.groups ?? {};
  const tree = {
    scopes: Object.fromEntries(
      Object.entries(groups).map(([key, entry]) => [key, { tools: entry?.tools }]),
    ),
  };
  const groupId = params.groupId?.trim();
  const matchedKey = resolveScopeKeyCaseInsensitive(tree, groupId);
  const scopeKey = groupId && !matchedKey && Object.hasOwn(tree.scopes, "*") ? "*" : matchedKey;
  return resolveScopeToolsPolicy({
    tree,
    path: scopeKey ? [scopeKey] : [],
  });
}
function resolveFeishuReplyPolicy(params) {
  if (params.isDirectMessage) return { requireMention: false };
  const feishuCfg = params.cfg.channels?.feishu;
  const resolvedCfg = resolveMergedAccountConfig({
    channelConfig: feishuCfg,
    accounts: feishuCfg?.accounts,
    accountId: normalizeAccountId(params.accountId),
    normalizeAccountId,
    omitKeys: ["defaultAccount"],
  });
  const groupRequireMention = resolveFeishuGroupConfig({
    cfg: resolvedCfg,
    groupId: params.groupId,
  })?.requireMention;
  return {
    requireMention:
      typeof groupRequireMention === "boolean"
        ? groupRequireMention
        : typeof resolvedCfg.requireMention === "boolean"
          ? resolvedCfg.requireMention
          : params.groupPolicy !== "open",
  };
}
//#endregion
//#region extensions/feishu/src/read-policy.ts
function isActionContext(ctx) {
  return "toolContext" in ctx;
}
function normalizeChatId(raw) {
  if (!raw) return "";
  return normalizeFeishuTarget(raw) ?? raw.trim();
}
function readContextFields(ctx) {
  if (isActionContext(ctx))
    return {
      accountId: normalizeOptionalString(ctx.accountId),
      currentChannelId: normalizeOptionalString(ctx.toolContext?.currentChannelId),
      currentProvider: normalizeOptionalString(ctx.toolContext?.currentChannelProvider),
      requesterAccountId: normalizeOptionalString(ctx.requesterAccountId),
      requesterSenderId: normalizeOptionalString(ctx.requesterSenderId),
      directOperator: ctx.conversationReadOrigin === "direct-operator",
    };
  return {
    accountId: normalizeOptionalString(ctx.agentAccountId),
    currentChannelId: normalizeOptionalString(ctx.nativeChannelId),
    currentProvider: normalizeOptionalString(ctx.messageChannel ?? ctx.deliveryContext?.channel),
    requesterAccountId: normalizeOptionalString(ctx.deliveryContext?.accountId),
    requesterSenderId: normalizeOptionalString(ctx.requesterSenderId),
    directOperator: ctx.conversationReadOrigin === "direct-operator",
  };
}
function isCurrentChat(params) {
  const context = readContextFields(params.ctx);
  return (
    context.currentProvider?.toLowerCase() === "feishu" &&
    context.requesterAccountId === params.account.accountId &&
    (context.accountId ?? params.account.accountId) === params.account.accountId &&
    normalizeChatId(context.currentChannelId) === normalizeChatId(params.chatId)
  );
}
function resolveFeishuReadGroupPolicy(cfg, account) {
  return resolveOpenProviderRuntimeGroupPolicy({
    providerConfigPresent: cfg.channels?.feishu !== void 0,
    groupPolicy: account.config.groupPolicy,
    defaultGroupPolicy: resolveDefaultGroupPolicy(cfg),
  }).groupPolicy;
}
function isFeishuGroupReadAllowed(cfg, account, chatId, current) {
  const policy = resolveFeishuReadGroupPolicy(cfg, account);
  if (policy === "disabled") return false;
  if (
    resolveFeishuGroupConfig({
      cfg: account.config,
      groupId: chatId,
    })?.enabled === false
  )
    return false;
  if (current) return true;
  if (policy === "open") return true;
  const explicitlyConfigured = hasExplicitFeishuGroupConfig({
    cfg: account.config,
    groupId: chatId,
  });
  const normalizedChatId = normalizeFeishuAllowEntry(chatId);
  return (
    explicitlyConfigured ||
    (account.config.groupAllowFrom ?? []).some((entry) => {
      const normalized = normalizeFeishuAllowEntry(String(entry));
      return normalized === "*" || normalized === normalizedChatId;
    })
  );
}
function isFeishuGroupReadEnabled(cfg, account, chatId) {
  if (resolveFeishuReadGroupPolicy(cfg, account) === "disabled") return false;
  return (
    resolveFeishuGroupConfig({
      cfg: account.config,
      groupId: chatId,
    })?.enabled !== false
  );
}
function isDmUniversallyAllowed(account) {
  return (account.config.allowFrom ?? []).some(
    (entry) => normalizeFeishuAllowEntry(String(entry)) === "*",
  );
}
function assertFeishuChatReadAllowed(params) {
  const authorization = resolveFeishuChatReadPreliminaryAuthorization(params);
  if (authorization.decision !== "allow")
    throw new ToolAuthorizationError("Feishu read target is not allowed.");
  return authorization.chatId;
}
function resolveFeishuChatReadPreliminaryAuthorization(params) {
  const chatId = normalizeChatId(params.chatId);
  const resolvedChatType = normalizeFeishuChatType(params.chatType);
  const knownGroup =
    resolvedChatType === "group" ||
    (params.chatType === void 0 &&
      hasExplicitFeishuGroupConfig({
        cfg: params.account.config,
        groupId: chatId,
      }));
  const knownDm = resolvedChatType === "p2p";
  const current = isCurrentChat({
    account: params.account,
    chatId,
    ctx: params.ctx,
  });
  const directOperator = readContextFields(params.ctx).directOperator;
  const groupAllowed = directOperator
    ? isFeishuGroupReadEnabled(params.cfg, params.account, chatId)
    : isFeishuGroupReadAllowed(params.cfg, params.account, chatId, current);
  const dmAllowed = directOperator || current || isDmUniversallyAllowed(params.account);
  if (knownGroup)
    return {
      chatId,
      decision: groupAllowed ? "allow" : "deny",
    };
  if (knownDm)
    return {
      chatId,
      decision: dmAllowed ? "allow" : "deny",
    };
  if (groupAllowed === dmAllowed)
    return {
      chatId,
      decision: groupAllowed ? "allow" : "deny",
    };
  return {
    chatId,
    decision: "needs-metadata",
  };
}
function authorizeFeishuChatMemberRead(params) {
  const chatId = assertFeishuChatReadAllowed(params);
  const chatType = normalizeFeishuChatType(params.chatType);
  if (chatType === "group")
    return {
      kind: "group",
      chatId,
    };
  if (chatType !== "p2p")
    throw new ToolAuthorizationError("Feishu chat member reads require a known chat type.");
  if (
    !isCurrentChat({
      account: params.account,
      chatId,
      ctx: params.ctx,
    })
  )
    throw new ToolAuthorizationError(
      "Feishu direct-chat member reads require the current conversation.",
    );
  const requesterSenderId = normalizeChatId(readContextFields(params.ctx).requesterSenderId);
  if (!requesterSenderId)
    throw new ToolAuthorizationError("Feishu direct-chat member identity is unavailable.");
  const requesterSenderIdType = detectIdType(requesterSenderId);
  if (requesterSenderIdType !== "open_id" && requesterSenderIdType !== "user_id")
    throw new ToolAuthorizationError("Feishu direct-chat member identity type is unavailable.");
  if (params.memberIdType && params.memberIdType !== requesterSenderIdType)
    throw new ToolAuthorizationError(
      "Feishu direct-chat member identifier type must match the current sender.",
    );
  if (params.memberId && normalizeChatId(params.memberId) !== requesterSenderId)
    throw new ToolAuthorizationError(
      "Feishu direct-chat member reads are limited to the current sender.",
    );
  return {
    kind: "direct",
    chatId,
    memberId: requesterSenderId,
    memberIdType: requesterSenderIdType,
  };
}
function canEnumerateAllFeishuGroups(cfg, account) {
  const policy = resolveFeishuReadGroupPolicy(cfg, account);
  return (
    policy === "open" ||
    (policy === "allowlist" &&
      (account.config.groupAllowFrom ?? []).some(
        (entry) => normalizeFeishuAllowEntry(String(entry)) === "*",
      ))
  );
}
function canEnumerateAllFeishuPeers(account) {
  return isDmUniversallyAllowed(account);
}
//#endregion
//#region extensions/feishu/src/native-card.ts
const FEISHU_CARD_TEMPLATES = /* @__PURE__ */ new Set([
  "blue",
  "green",
  "red",
  "orange",
  "purple",
  "indigo",
  "wathet",
  "turquoise",
  "yellow",
  "grey",
  "carmine",
  "violet",
  "lime",
]);
function resolveFeishuCardTemplate(template) {
  const normalized = normalizeOptionalLowercaseString(template);
  if (!normalized || !FEISHU_CARD_TEMPLATES.has(normalized)) return;
  return normalized;
}
function escapeFeishuCardMarkdownText(text) {
  return text.replace(/[&<>]/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      default:
        return char;
    }
  });
}
function escapeFeishuCardPlainText(text) {
  return escapeFeishuCardMarkdownText(text).replace(/([\\`*_{}[\]()#+\-!|>~])/g, "\\$1");
}
function resolveSafeFeishuButtonUrl(url) {
  const trimmed = typeof url === "string" ? url.trim() : "";
  if (!trimmed) return;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? trimmed : void 0;
  } catch {
    return;
  }
}
function sanitizeNativeFeishuButtonBehavior(behavior) {
  if (!isRecord(behavior)) return;
  if (behavior.type === "open_url") {
    const safeUrl =
      resolveSafeFeishuButtonUrl(behavior.default_url) ?? resolveSafeFeishuButtonUrl(behavior.url);
    return safeUrl
      ? {
          type: "open_url",
          default_url: safeUrl,
        }
      : void 0;
  }
  if (behavior.type === "callback" && isRecord(behavior.value) && behavior.value.oc === "ocf1")
    return {
      type: "callback",
      value: behavior.value,
    };
}
function sanitizeNativeFeishuCardButton(button) {
  if (!isRecord(button)) return;
  const text =
    isRecord(button.text) && typeof button.text.content === "string" ? button.text.content : void 0;
  if (!text?.trim()) return;
  const style =
    button.type === "danger"
      ? "danger"
      : button.type === "primary" || button.type === "success"
        ? "primary"
        : void 0;
  const behaviors = Array.isArray(button.behaviors)
    ? button.behaviors
        .map((behavior) => sanitizeNativeFeishuButtonBehavior(behavior))
        .filter((behavior) => Boolean(behavior))
    : [];
  const rootSafeUrl = resolveSafeFeishuButtonUrl(button.url);
  if (rootSafeUrl)
    behaviors.push({
      type: "open_url",
      default_url: rootSafeUrl,
    });
  if (isRecord(button.value) && button.value.oc === "ocf1")
    behaviors.push({
      type: "callback",
      value: button.value,
    });
  if (behaviors.length === 0) return;
  return {
    tag: "button",
    text: {
      tag: "plain_text",
      content: text,
    },
    type: style === "danger" ? "danger" : style === "primary" ? "primary" : "default",
    behaviors,
  };
}
function sanitizeNativeFeishuCardElements(element) {
  if (!isRecord(element) || typeof element.tag !== "string") return [];
  if (element.tag === "hr") return [{ tag: "hr" }];
  if (element.tag === "markdown" && typeof element.content === "string")
    return [
      {
        tag: "markdown",
        content: escapeFeishuCardMarkdownText(element.content),
      },
    ];
  if (element.tag === "div" && isRecord(element.text)) {
    const text = element.text;
    if (text.tag === "lark_md" && typeof text.content === "string")
      return [
        {
          tag: "markdown",
          content: escapeFeishuCardMarkdownText(text.content),
        },
      ];
    if (text.tag === "plain_text" && typeof text.content === "string")
      return [
        {
          tag: "markdown",
          content: escapeFeishuCardPlainText(text.content),
        },
      ];
    return [];
  }
  if (element.tag === "button") {
    const button = sanitizeNativeFeishuCardButton(element);
    return button ? [button] : [];
  }
  if (element.tag === "action" && Array.isArray(element.actions))
    return element.actions
      .map((action) => sanitizeNativeFeishuCardButton(action))
      .filter((action) => Boolean(action));
  return [];
}
function sanitizeNativeFeishuCard(card) {
  const normalizedCard = card.type === "interactive" && isRecord(card.card) ? card.card : card;
  const body = isRecord(normalizedCard.body) ? normalizedCard.body : void 0;
  const elements = (
    Array.isArray(body?.elements)
      ? body.elements
      : Array.isArray(normalizedCard.elements)
        ? normalizedCard.elements
        : []
  )
    .flatMap((element) => sanitizeNativeFeishuCardElements(element))
    .filter((element) => Boolean(element));
  if (elements.length === 0) return;
  const header = isRecord(normalizedCard.header) ? normalizedCard.header : void 0;
  const title =
    isRecord(header?.title) && typeof header.title.content === "string"
      ? header.title.content
      : void 0;
  return {
    schema: "2.0",
    config: { width_mode: "fill" },
    ...(title?.trim()
      ? {
          header: {
            title: {
              tag: "plain_text",
              content: title,
            },
            template:
              resolveFeishuCardTemplate(
                typeof header?.template === "string" ? header.template : void 0,
              ) ?? "blue",
          },
        }
      : {}),
    body: { elements },
  };
}
function readNativeFeishuCardJson(text, options) {
  let trimmed = text?.trim();
  const responsePrefix = options?.responsePrefix;
  if (trimmed && responsePrefix && trimmed.startsWith(responsePrefix)) {
    const suffix = trimmed.slice(responsePrefix.length);
    if (/^\s+\{/.test(suffix)) trimmed = suffix.trimStart();
  }
  if (!trimmed?.startsWith("{") || !trimmed.endsWith("}")) return;
  try {
    const parsed = JSON.parse(trimmed);
    return isRecord(parsed) ? sanitizeNativeFeishuCard(parsed) : void 0;
  } catch {
    return;
  }
}
//#endregion
//#region extensions/feishu/src/send-result.ts
function resolveFeishuReceiptKind(msgType) {
  switch (msgType) {
    case "audio":
      return "voice";
    case "image":
    case "media":
    case "file":
      return "media";
    case "interactive":
      return "card";
    case "post":
    case "text":
      return "text";
    default:
      return "unknown";
  }
}
function createFeishuSendReceipt(params) {
  const messageId = params.messageId?.trim();
  const chatId = params.chatId.trim();
  return createMessageReceiptFromOutboundResults({
    results: messageId
      ? [
          {
            channel: "feishu",
            messageId,
            chatId,
            conversationId: chatId,
          },
        ]
      : [],
    ...(chatId ? { threadId: chatId } : {}),
    kind: params.kind ?? "unknown",
  });
}
function assertFeishuMessageApiSuccess(response, errorPrefix) {
  if (response.code !== 0)
    throw new Error(`${errorPrefix}: ${response.msg || `code ${response.code}`}`);
}
function toFeishuSendResult(response, chatId, kind) {
  const messageId = response.data?.message_id ?? "unknown";
  return {
    messageId,
    chatId,
    receipt: createFeishuSendReceipt({
      messageId,
      chatId,
      kind,
    }),
  };
}
//#endregion
export {
  normalizeFeishuChatType as C,
  createFeishuCardInteractionEnvelope as D,
  buildFeishuCardActionTextFallback as E,
  decodeFeishuCardAction as O,
  resolveFeishuReplyPolicy as S,
  FEISHU_CARD_INTERACTION_VERSION as T,
  resolveFeishuDmIngressAccess as _,
  readNativeFeishuCardJson as a,
  resolveFeishuGroupSenderActivationIngressAccess as b,
  assertFeishuChatReadAllowed as c,
  canEnumerateAllFeishuPeers as d,
  isFeishuGroupReadAllowed as f,
  normalizeFeishuAllowEntry as g,
  hasExplicitFeishuGroupConfig as h,
  toFeishuSendResult as i,
  authorizeFeishuChatMemberRead as l,
  resolveFeishuChatReadPreliminaryAuthorization as m,
  createFeishuSendReceipt as n,
  resolveFeishuCardTemplate as o,
  isFeishuGroupReadEnabled as p,
  resolveFeishuReceiptKind as r,
  sanitizeNativeFeishuCard as s,
  assertFeishuMessageApiSuccess as t,
  canEnumerateAllFeishuGroups as u,
  resolveFeishuGroupConfig as v,
  resolveFeishuChatType as w,
  resolveFeishuGroupToolPolicy as x,
  resolveFeishuGroupConversationIngressAccess as y,
};
