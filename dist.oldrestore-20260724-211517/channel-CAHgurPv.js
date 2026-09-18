import { r as describeWebhookAccountSnapshot } from "./account-helpers-BAtt8fRD.js";
import { t as DEFAULT_ACCOUNT_ID } from "./account-id-C7N4Rwku.js";
import {
  i as resolveZaloAccount,
  n as listZaloAccountIds,
  r as resolveDefaultZaloAccountId,
  t as listEnabledZaloAccounts,
} from "./accounts-C71qLp4D.js";
import { t as formatAllowFromLowercase } from "./allow-from-BCaLdTTU.js";
import { t as createChannelApprovalAuth } from "./approval-auth-helpers-BtEiGp-a.js";
import {
  l as createScopedDmSecurityResolver,
  m as mapAllowFromEntries,
  s as createScopedChannelConfigAdapter,
  t as adaptScopedAccountAccessor,
} from "./channel-config-helpers-BFvX3ldW.js";
import { w as defineChannelMessageAdapter } from "./channel-outbound-DlkFd7rO.js";
import {
  O as createOpenProviderGroupPolicyWarningCollector,
  d as buildOpenGroupPolicyRestrictSendersWarning,
  f as buildOpenGroupPolicyWarning,
} from "./channel-policy-DXOn_tKS.js";
import {
  a as createEmptyChannelResult,
  i as createAttachedChannelResultAdapter,
} from "./channel-send-result-Dn_C6AJS.js";
import { y as readStringParam } from "./common-DyDSUect.js";
import {
  n as buildCatchallMultiAccountChannelSchema,
  r as buildChannelConfigSchema,
  t as AllowFromListSchema,
} from "./config-schema-qmCQZl6j.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import {
  d as stripTargetKindPrefix,
  i as createChatChannelPlugin,
  t as buildChannelOutboundSessionRoute,
  u as stripChannelTargetPrefix,
} from "./core-V3U0lOIj.js";
import { p as listResolvedDirectoryUserEntriesFromAllowFrom } from "./directory-config-helpers-6PdjajJm.js";
import { n as createChannelDirectoryAdapter } from "./directory-runtime-VSo_cGzY.js";
import "./channel-core-Z_rV5hXh.js";
import {
  a as coerceStatusIssueAccountId,
  d as readStatusIssueFields,
} from "./extension-shared-DqZe9psR.js";
import {
  i as createLazyRuntimeNamedExport,
  r as createLazyRuntimeModule,
} from "./lazy-runtime-B-Fc-m0I.js";
import "./channel-config-schema-C-vJvjtu.js";
import { b as sendPayloadWithChunkedTextAndMedia } from "./reply-payload-DDwHXDkv.js";
import { At as boolean, Rn as string, Tn as object, wn as number } from "./schemas-CBJjibl3.js";
import {
  n as collectRuntimeConfigAssignments,
  r as secretTargetRegistryEntries,
} from "./secret-contract-CXsNLVDa.js";
import { r as buildSecretInputSchema } from "./secret-input-D1aG0n6v.js";
import { r as zaloSetupAdapter, t as createZaloSetupWizardProxy } from "./setup-core-DKbqmmLd.js";
import "./conversation-runtime-DuXhVyjf.js";
import {
  d as createDefaultChannelRuntimeState,
  o as buildTokenChannelStatusSummary,
  u as createComputedAccountStatusAdapter,
} from "./status-helpers-SdoCNDDu.js";
import "./channel-status-B8fwcUOI.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import "./channel-actions-C9vNf9jw.js";
import { t as chunkTextForOutbound } from "./text-chunking-Dr19ggf-.js";
import { n as createStaticReplyToModeResolver } from "./threading-helpers-CMXJIj4M.js";
import { t as jsonResult } from "./tool-results-BCM3fdVS.js";
import { t as extractToolSend } from "./tool-send-DlIp2cBO.js";
import {
  _ as MarkdownConfigSchema,
  c as DmPolicySchema,
  d as GroupPolicySchema,
} from "./zod-schema.core-CWTCY1ZZ.js";
//#region extensions/zalo/src/actions.ts
const loadZaloActionsRuntime = createLazyRuntimeNamedExport(
  () => import("./actions.runtime-DnKUjkbR.js"),
  "zaloActionsRuntime",
);
const providerId = "zalo";
function listEnabledAccounts(cfg, accountId) {
  return (
    accountId
      ? [
          resolveZaloAccount({
            cfg,
            accountId,
          }),
        ]
      : listEnabledZaloAccounts(cfg)
  ).filter((account) => account.enabled && account.tokenSource !== "none");
}
const zaloMessageActions = {
  describeMessageTool: ({ cfg, accountId }) => {
    if (listEnabledAccounts(cfg, accountId).length === 0) return null;
    const actions = /* @__PURE__ */ new Set(["send"]);
    return {
      actions: Array.from(actions),
      capabilities: [],
    };
  },
  extractToolSend: ({ args }) => extractToolSend(args, "sendMessage"),
  handleAction: async ({ action, params, cfg, accountId }) => {
    if (action === "send") {
      const to = readStringParam(params, "to", { required: true });
      const content = readStringParam(params, "message", {
        required: true,
        allowEmpty: true,
      });
      const mediaUrl = readStringParam(params, "media", { trim: false });
      const { sendMessageZalo } = await loadZaloActionsRuntime();
      const result = await sendMessageZalo(to ?? "", content ?? "", {
        accountId: accountId ?? void 0,
        mediaUrl: mediaUrl ?? void 0,
        cfg,
      });
      if (!result.ok)
        return jsonResult({
          ok: false,
          error: result.error ?? "Failed to send Zalo message",
        });
      return jsonResult({
        ok: true,
        to,
        messageId: result.messageId,
      });
    }
    throw new Error(`Action ${action} is not supported for provider ${providerId}.`);
  },
};
//#endregion
//#region extensions/zalo/src/approval-auth.ts
function normalizeZaloApproverId(value) {
  const normalized = String(value)
    .trim()
    .replace(/^(zalo|zl):/i, "")
    .trim();
  return /^\d+$/.test(normalized) ? normalized : void 0;
}
const zaloApprovalAuth = createChannelApprovalAuth({
  channelLabel: "Zalo",
  resolveInputs: ({ cfg, accountId }) => {
    return {
      allowFrom: resolveZaloAccount({
        cfg,
        accountId,
      }).config.allowFrom,
    };
  },
  normalizeApprover: normalizeZaloApproverId,
}).approvalAuth;
const ZaloConfigSchema = buildCatchallMultiAccountChannelSchema(
  object({
    name: string().optional(),
    enabled: boolean().optional(),
    markdown: MarkdownConfigSchema,
    botToken: buildSecretInputSchema().optional(),
    tokenFile: string().optional(),
    webhookUrl: string().optional(),
    webhookSecret: buildSecretInputSchema().optional(),
    webhookPath: string().optional(),
    dmPolicy: DmPolicySchema.optional(),
    allowFrom: AllowFromListSchema,
    groupPolicy: GroupPolicySchema.optional(),
    groupAllowFrom: AllowFromListSchema,
    mediaMaxMb: number().optional(),
    proxy: string().optional(),
    responsePrefix: string().optional(),
  }),
);
//#endregion
//#region extensions/zalo/src/session-route.ts
function resolveZaloOutboundSessionRoute(params) {
  const trimmed = stripChannelTargetPrefix(params.target, "zalo", "zl");
  if (!trimmed) return null;
  const normalizedTarget = normalizeLowercaseStringOrEmpty(trimmed);
  const isGroup = normalizedTarget.startsWith("group:");
  const recipientSessionExact = /^(?:group|user|dm):/.test(normalizedTarget);
  const peerId = stripTargetKindPrefix(trimmed);
  if (!peerId) return null;
  return buildChannelOutboundSessionRoute({
    cfg: params.cfg,
    agentId: params.agentId,
    channel: "zalo",
    accountId: params.accountId,
    recipientSessionExact,
    peer: {
      kind: isGroup ? "group" : "direct",
      id: peerId,
    },
    chatType: isGroup ? "group" : "direct",
    from: isGroup ? `zalo:group:${peerId}` : `zalo:${peerId}`,
    to: `zalo:${peerId}`,
  });
}
//#endregion
//#region extensions/zalo/src/status-issues.ts
const ZALO_STATUS_FIELDS = ["accountId", "enabled", "configured", "dmPolicy"];
function collectZaloStatusIssues(accounts) {
  const issues = [];
  for (const entry of accounts) {
    const account = readStatusIssueFields(entry, ZALO_STATUS_FIELDS);
    if (!account) continue;
    const accountId = coerceStatusIssueAccountId(account.accountId) ?? "default";
    const enabled = account.enabled !== false;
    const configured = account.configured === true;
    if (!enabled || !configured) continue;
    if (account.dmPolicy === "open")
      issues.push({
        channel: "zalo",
        accountId,
        kind: "config",
        message: 'Zalo dmPolicy is "open", allowing any user to message the bot without pairing.',
        fix: 'Set channels.zalo.dmPolicy to "pairing" or "allowlist" to restrict access.',
      });
  }
  return issues;
}
//#endregion
//#region extensions/zalo/src/channel.ts
const meta = {
  id: "zalo",
  label: "Zalo",
  selectionLabel: "Zalo (Bot API)",
  docsPath: "/channels/zalo",
  docsLabel: "zalo",
  blurb: "Vietnam-focused messaging platform with Bot API.",
  aliases: ["zl"],
  order: 80,
  quickstartAllowFrom: true,
};
function normalizeZaloMessagingTarget(raw) {
  const trimmed = raw?.trim();
  if (!trimmed) return;
  return trimmed.replace(/^(zalo|zl):/i, "").trim();
}
function looksLikeZaloChatId(raw, normalized) {
  const target = normalizeZaloMessagingTarget(normalized ?? raw);
  return Boolean(target);
}
const loadZaloChannelRuntime = createLazyRuntimeModule(
  () => import("./channel.runtime-U9M1wmkg.js"),
);
const zaloSetupWizard = createZaloSetupWizardProxy(
  async () => (await import("./setup-surface-CiNKvs6h.js")).zaloSetupWizard,
);
const zaloTextChunkLimit = 2e3;
async function sendZaloDelivery(ctx) {
  const result = await (
    await loadZaloChannelRuntime()
  ).sendZaloText({
    to: ctx.to,
    text: ctx.text,
    accountId: ctx.accountId ?? void 0,
    mediaUrl: ctx.mediaUrl,
    cfg: ctx.cfg,
  });
  if (!result.ok)
    throw new Error(result.error ?? `Failed to send Zalo ${ctx.mediaUrl ? "media" : "message"}`);
  return {
    messageId: result.messageId ?? "",
    receipt: result.receipt,
  };
}
const zaloSendResultAdapter = createAttachedChannelResultAdapter({
  channel: "zalo",
  sendText: sendZaloDelivery,
  sendMedia: sendZaloDelivery,
});
const zaloMessageAdapter = defineChannelMessageAdapter({
  id: "zalo",
  durableFinal: {
    capabilities: {
      text: true,
      media: true,
      messageSendingHooks: true,
    },
  },
  send: {
    text: sendZaloDelivery,
    media: sendZaloDelivery,
  },
});
const zaloConfigAdapter = createScopedChannelConfigAdapter({
  sectionKey: "zalo",
  listAccountIds: listZaloAccountIds,
  resolveAccount: adaptScopedAccountAccessor(resolveZaloAccount),
  defaultAccountId: resolveDefaultZaloAccountId,
  clearBaseFields: ["botToken", "tokenFile", "name"],
  resolveAllowFrom: (account) => account.config.allowFrom,
  formatAllowFrom: (allowFrom) =>
    formatAllowFromLowercase({
      allowFrom,
      stripPrefixRe: /^(zalo|zl):/i,
    }),
});
const resolveZaloDmPolicy = createScopedDmSecurityResolver({
  channelKey: "zalo",
  resolvePolicy: (account) => account.config.dmPolicy,
  resolveAllowFrom: (account) => account.config.allowFrom,
  policyPathSuffix: "dmPolicy",
  normalizeEntry: (raw) => raw.trim().replace(/^(zalo|zl):/i, ""),
});
const collectZaloSecurityWarnings = createOpenProviderGroupPolicyWarningCollector({
  providerConfigPresent: (cfg) => cfg.channels?.zalo !== void 0,
  resolveGroupPolicy: ({ account }) => account.config.groupPolicy,
  collect: ({ account, groupPolicy }) => {
    if (groupPolicy !== "open") return [];
    const explicitGroupAllowFrom = mapAllowFromEntries(account.config.groupAllowFrom);
    const dmAllowFrom = mapAllowFromEntries(account.config.allowFrom);
    if ((explicitGroupAllowFrom.length > 0 ? explicitGroupAllowFrom : dmAllowFrom).length > 0)
      return [
        buildOpenGroupPolicyRestrictSendersWarning({
          surface: "Zalo groups",
          openScope: "any member",
          groupPolicyPath: "channels.zalo.groupPolicy",
          groupAllowFromPath: "channels.zalo.groupAllowFrom",
        }),
      ];
    return [
      buildOpenGroupPolicyWarning({
        surface: "Zalo groups",
        openBehavior:
          "with no groupAllowFrom/allowFrom allowlist; any member can trigger (mention-gated)",
        remediation: 'Set channels.zalo.groupPolicy="allowlist" + channels.zalo.groupAllowFrom',
      }),
    ];
  },
});
const zaloPlugin = createChatChannelPlugin({
  base: {
    id: "zalo",
    meta,
    setup: zaloSetupAdapter,
    setupWizard: zaloSetupWizard,
    capabilities: {
      chatTypes: ["direct", "group"],
      media: true,
      reactions: false,
      threads: false,
      polls: false,
      nativeCommands: false,
      blockStreaming: true,
    },
    reload: { configPrefixes: ["channels.zalo"] },
    configSchema: buildChannelConfigSchema(ZaloConfigSchema),
    config: {
      ...zaloConfigAdapter,
      isConfigured: (account) => Boolean(account.token?.trim()),
      describeAccount: (account) =>
        describeWebhookAccountSnapshot({
          account,
          configured: Boolean(account.token?.trim()),
          mode: account.config.webhookUrl ? "webhook" : "polling",
          extra: { tokenSource: account.tokenSource },
        }),
    },
    approvalCapability: zaloApprovalAuth,
    secrets: {
      secretTargetRegistryEntries,
      collectRuntimeConfigAssignments,
    },
    groups: { resolveRequireMention: () => true },
    actions: zaloMessageActions,
    messaging: {
      targetPrefixes: ["zalo", "zl"],
      normalizeTarget: normalizeZaloMessagingTarget,
      resolveOutboundSessionRoute: (params) => resolveZaloOutboundSessionRoute(params),
      targetResolver: {
        looksLikeId: looksLikeZaloChatId,
        hint: "<chatId>",
      },
    },
    directory: createChannelDirectoryAdapter({
      listPeers: async (params) =>
        listResolvedDirectoryUserEntriesFromAllowFrom({
          ...params,
          resolveAccount: adaptScopedAccountAccessor(resolveZaloAccount),
          resolveAllowFrom: (account) => account.config.allowFrom,
          normalizeId: (entry) => entry.trim().replace(/^(zalo|zl):/i, ""),
        }),
      listGroups: async () => [],
    }),
    status: createComputedAccountStatusAdapter({
      defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID),
      collectStatusIssues: collectZaloStatusIssues,
      buildChannelSummary: ({ snapshot }) => buildTokenChannelStatusSummary(snapshot),
      probeAccount: async ({ account, timeoutMs }) =>
        await (
          await loadZaloChannelRuntime()
        ).probeZaloAccount({
          account,
          timeoutMs,
        }),
      resolveAccountSnapshot: ({ account }) => {
        const configured = Boolean(account.token?.trim());
        return {
          accountId: account.accountId,
          name: account.name,
          enabled: account.enabled,
          configured,
          extra: {
            tokenSource: account.tokenSource,
            mode: account.config.webhookUrl ? "webhook" : "polling",
            dmPolicy: account.config.dmPolicy ?? "pairing",
          },
        };
      },
    }),
    gateway: {
      startAccount: async (ctx) =>
        await (await loadZaloChannelRuntime()).startZaloGatewayAccount(ctx),
    },
    message: zaloMessageAdapter,
  },
  security: {
    resolveDmPolicy: resolveZaloDmPolicy,
    collectWarnings: collectZaloSecurityWarnings,
  },
  pairing: {
    text: {
      idLabel: "zaloUserId",
      message: "Your pairing request has been approved.",
      normalizeAllowEntry: (entry) => entry.trim().replace(/^(zalo|zl):/i, ""),
      notify: async (params) =>
        await (await loadZaloChannelRuntime()).notifyZaloPairingApproval(params),
    },
  },
  threading: { resolveReplyToMode: createStaticReplyToModeResolver("off") },
  outbound: {
    deliveryMode: "direct",
    chunker: chunkTextForOutbound,
    chunkerMode: "text",
    textChunkLimit: zaloTextChunkLimit,
    sendPayload: async (ctx) =>
      await sendPayloadWithChunkedTextAndMedia({
        ctx,
        textChunkLimit: zaloTextChunkLimit,
        chunker: chunkTextForOutbound,
        sendText: (nextCtx) => zaloSendResultAdapter.sendText(nextCtx),
        sendMedia: (nextCtx) => zaloSendResultAdapter.sendMedia(nextCtx),
        emptyResult: createEmptyChannelResult("zalo"),
        onResult: ctx.onDeliveryResult,
      }),
    ...zaloSendResultAdapter,
  },
});
//#endregion
export { zaloPlugin as t };
