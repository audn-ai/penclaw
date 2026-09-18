import { n as describeAccountSnapshot } from "./account-helpers-BAtt8fRD.js";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-C7N4Rwku.js";
import {
  a as resolveIMessageAccount,
  i as resolveDefaultIMessageAccountId,
  r as listIMessageAccountIds,
  t as collectIMessageDuplicateAccountSourceWarnings,
} from "./accounts--1GXl2sX.js";
import { n as buildDmGroupAccountAllowlistAdapter } from "./allowlist-config-edit-DTUSGqK-.js";
import { r as createChannelApprovalCapability } from "./approval-delivery-helpers-BMCDWKJ5.js";
import { n as createLazyChannelApprovalNativeRuntimeAdapter } from "./approval-handler-adapter-runtime-DjbKLbMW.js";
import {
  a as createNativeApprovalForwardingFallbackSuppressor,
  c as shouldSuppressLocalNativeExecApprovalPrompt,
  i as createNativeApprovalChannelRouteGates,
  n as createChannelApproverDmTargetResolver,
  r as createChannelNativeOriginTargetResolver,
} from "./approval-native-helpers-BZsvz7Nq.js";
import {
  _ as getIMessageApprovalApprovers,
  n as addIMessageApprovalReactionHintToText,
  v as imessageApprovalAuth,
} from "./approval-reactions-BxzyMVQA.js";
import { o as buildTypedPluginApprovalPendingReplyPayload } from "./approval-renderers-DA2dW1_1.js";
import { t as buildOutboundBaseSessionKey } from "./base-session-key-BIYQJTxQ.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import {
  p as formatTrimmedAllowFromEntries,
  s as createScopedChannelConfigAdapter,
  t as adaptScopedAccountAccessor,
} from "./channel-config-helpers-BFvX3ldW.js";
import { w as defineChannelMessageAdapter } from "./channel-outbound-DlkFd7rO.js";
import "./channel-core-Z_rV5hXh.js";
import "./routing-CwvmVRHd.js";
import { r as createRestrictSendersChannelSecurity } from "./channel-policy-DXOn_tKS.js";
import { t as IMessageChannelConfigSchema } from "./config-schema-D2_5RXnf.js";
import { t as createIMessageConversationBindingManager } from "./conversation-bindings-KdKhZzib.js";
import "./approval-delivery-runtime-D6blv2E7.js";
import {
  c as getChatChannelMeta,
  i as createChatChannelPlugin,
  r as createChannelPluginBase,
} from "./core-V3U0lOIj.js";
import { t as resolveExecApprovalCommandDisplay } from "./exec-approval-command-display-SUzu7-Pq.js";
import {
  d as buildTypedExecApprovalPendingReplyPayload,
  h as getExecApprovalReplyMetadata,
} from "./exec-approval-reply-Djiq6tOJ.js";
import { H as resolveExecApprovalRequestAllowedDecisions } from "./exec-approvals-Bz218bS2.js";
import "./approval-native-runtime-BCKDIyz_.js";
import "./approval-reply-runtime-BpszN-io.js";
import "./approval-runtime-LmbhNzmC.js";
import { n as buildPassiveProbedChannelStatusSummary } from "./extension-shared-DqZe9psR.js";
import {
  n as resolveIMessageGroupToolPolicy,
  r as imessageMessageActions,
  t as resolveIMessageGroupRequireMention,
} from "./group-policy-K3n-fVwn.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import {
  n as resolveIMessageAttachmentRoots,
  r as resolveIMessageRemoteAttachmentRoots,
} from "./media-contract-D9j7tfog.js";
import { n as normalizeIMessageMessagingTarget } from "./normalize-D37IclcM.js";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-C0uxiauk.js";
import {
  a as resolveIMessageConversationIdFromTarget,
  i as normalizeIMessageAcpConversationId,
  p as imessageSetupAdapter,
  r as matchIMessageAcpConversation,
  t as sanitizeOutboundText,
  u as createIMessageSetupWizardProxy,
} from "./sanitize-outbound-DuVgJyZw.js";
import { t as sanitizeForPlainText } from "./sanitize-text-BCxyPW9Z.js";
import { c as parseAgentSessionKey } from "./session-key-utils-B8sNp9l4.js";
import {
  c as collectStatusIssuesFromLastError,
  d as createDefaultChannelRuntimeState,
  u as createComputedAccountStatusAdapter,
} from "./status-helpers-SdoCNDDu.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import {
  a as looksLikeIMessageExplicitTargetId,
  c as parseIMessageTarget,
  n as inferIMessageTargetChatType,
  o as normalizeIMessageHandle,
} from "./targets-BO9NhvfG.js";
import { t as chunkTextForOutbound } from "./text-chunking-Dr19ggf-.js";
//#region extensions/imessage/src/approval-text.ts
function replaceApprovalIdPlaceholder(text, approvalId) {
  const safeApprovalId = approvalId.replace(/\$/g, "$$$$");
  return (text ?? "").replace(/\/approve\s+<id>/g, `/approve ${safeApprovalId}`);
}
//#endregion
//#region extensions/imessage/src/approval-native.ts
const DEFAULT_APPROVAL_FORWARDING_MODE = "session";
const DEFAULT_PLUGIN_APPROVAL_DECISIONS = ["allow-once", "allow-always", "deny"];
function isIMessageApprovalTransportEnabled(params) {
  return resolveIMessageAccount({
    cfg: params.cfg,
    accountId: params.accountId,
  }).enabled;
}
function normalizeIMessageForwardTarget(target) {
  if (normalizeLowercaseStringOrEmpty(target.channel) !== "imessage") return null;
  const to = normalizeIMessageMessagingTarget(target.to);
  if (!to) return null;
  return {
    to,
    accountId: normalizeOptionalString(target.accountId),
    threadId: target.threadId ?? null,
  };
}
function resolveTurnSourceIMessageOriginTarget(request) {
  if (normalizeLowercaseStringOrEmpty(request.request.turnSourceChannel) !== "imessage")
    return null;
  const to = normalizeIMessageMessagingTarget(request.request.turnSourceTo ?? "");
  if (!to) return null;
  return {
    to,
    accountId: normalizeOptionalString(request.request.turnSourceAccountId),
  };
}
function resolveSessionIMessageOriginTarget(sessionTarget) {
  const to = normalizeIMessageMessagingTarget(sessionTarget.to);
  return to
    ? {
        to,
        accountId: normalizeOptionalString(sessionTarget.accountId),
      }
    : null;
}
const {
  canApprovalPotentiallyRouteToChannel: canApprovalPotentiallyRouteToIMessage,
  canAnyApprovalPotentiallyRouteToChannel: canAnyApprovalPotentiallyRouteToIMessage,
  isSessionApprovalEligible: isIMessageSessionApprovalEligible,
  isExplicitTargetEligible: isIMessageExplicitTargetEligible,
  shouldHandleApprovalRequest: shouldHandleIMessageApprovalRequest,
} = createNativeApprovalChannelRouteGates({
  channel: "imessage",
  defaultForwardingMode: DEFAULT_APPROVAL_FORWARDING_MODE,
  isTransportEnabled: isIMessageApprovalTransportEnabled,
  listAccountIds: listIMessageAccountIds,
  resolveDefaultAccountId: resolveDefaultIMessageAccountId,
  normalizeForwardTarget: normalizeIMessageForwardTarget,
  resolveTurnSourceTarget: resolveTurnSourceIMessageOriginTarget,
});
function resolveIMessageSessionTargetFromSessionKey(sessionKey) {
  const rest = parseAgentSessionKey(sessionKey)?.rest ?? normalizeOptionalString(sessionKey);
  if (!rest || !normalizeLowercaseStringOrEmpty(rest).startsWith("imessage:")) return null;
  const route = rest.slice(9).trim();
  const routeLower = normalizeLowercaseStringOrEmpty(route);
  if (
    !route ||
    routeLower.startsWith("group:") ||
    routeLower.startsWith("channel:") ||
    routeLower.startsWith("chat:")
  )
    return null;
  if (routeLower.startsWith("direct:")) {
    const to = normalizeIMessageMessagingTarget(route.slice(7));
    return to ? { to } : null;
  }
  const accountScopedDirect = /^([^:]+):direct:(.+)$/i.exec(route);
  if (accountScopedDirect) {
    const to = normalizeIMessageMessagingTarget(accountScopedDirect[2] ?? "");
    return to
      ? {
          to,
          accountId: normalizeAccountId(accountScopedDirect[1] ?? ""),
        }
      : null;
  }
  const to = normalizeIMessageMessagingTarget(route);
  if (!to || inferIMessageTargetChatType(to) !== "direct") return null;
  return { to };
}
function shouldSuppressLocalIMessageExecApprovalPrompt(params) {
  if (
    shouldSuppressLocalNativeExecApprovalPrompt({
      ...params,
      isTransportEnabled: isIMessageApprovalTransportEnabled,
      isSessionRouteEligible: ({ cfg, accountId, metadata }) => {
        if (
          getIMessageApprovalApprovers({
            cfg,
            accountId,
          }).length > 0
        )
          return true;
        const sessionTarget = resolveIMessageSessionTargetFromSessionKey(metadata.sessionKey);
        if (!sessionTarget || inferIMessageTargetChatType(sessionTarget.to) !== "direct")
          return false;
        const targetAccountId = normalizeOptionalString(sessionTarget.accountId);
        return (
          !targetAccountId ||
          !accountId ||
          normalizeAccountId(targetAccountId) === normalizeAccountId(accountId)
        );
      },
    })
  )
    return true;
  const metadata = getExecApprovalReplyMetadata(params.payload);
  if (
    params.hint?.kind !== "approval-pending" ||
    params.hint.approvalKind !== "exec" ||
    params.hint.nativeRouteActive !== true ||
    metadata?.approvalKind !== "exec"
  )
    return false;
  if (metadata.agentId || metadata.sessionKey) return false;
  if (
    getIMessageApprovalApprovers({
      cfg: params.cfg,
      accountId: params.accountId,
    }).length === 0
  )
    return false;
  return canApprovalPotentiallyRouteToIMessage({
    ...params,
    approvalKind: "exec",
    nativeSessionOnly: true,
  });
}
const resolveIMessageOriginTargetBase = createChannelNativeOriginTargetResolver({
  channel: "imessage",
  shouldHandleRequest: shouldHandleIMessageApprovalRequest,
  resolveTurnSourceTarget: resolveTurnSourceIMessageOriginTarget,
  resolveSessionTarget: resolveSessionIMessageOriginTarget,
  normalizeTarget: (target) => {
    const to = normalizeIMessageMessagingTarget(target.to);
    return to
      ? {
          ...target,
          to,
        }
      : null;
  },
});
function resolveIMessageOriginTarget(params) {
  const target = resolveIMessageOriginTargetBase(params);
  if (!target) return null;
  if (
    inferIMessageTargetChatType(target.to) === "group" &&
    getIMessageApprovalApprovers({
      cfg: params.cfg,
      accountId: params.accountId,
    }).length === 0
  )
    return null;
  return target;
}
const resolveIMessageApproverDmTargets = createChannelApproverDmTargetResolver({
  shouldHandleRequest: shouldHandleIMessageApprovalRequest,
  resolveApprovers: getIMessageApprovalApprovers,
  mapApprover: (approver, params) => {
    const to = normalizeIMessageMessagingTarget(approver);
    if (!to) return null;
    return {
      to,
      accountId: normalizeOptionalString(params.accountId),
    };
  },
});
const shouldSuppressIMessageForwardingFallback = createNativeApprovalForwardingFallbackSuppressor({
  channel: "imessage",
  normalizeForwardTarget: normalizeIMessageForwardTarget,
  resolveAccountId: ({ forwardingTarget, request }) =>
    forwardingTarget.accountId ?? normalizeOptionalString(request.request.turnSourceAccountId),
  resolveForwardingTargetForMatch: ({ forwardingTarget, accountId }) => ({
    ...forwardingTarget,
    accountId,
  }),
  isSessionRouteEligible: isIMessageSessionApprovalEligible,
  isExplicitTargetEligible: isIMessageExplicitTargetEligible,
  resolveOriginTarget: resolveIMessageOriginTarget,
  resolveApproverDmTargets: resolveIMessageApproverDmTargets,
});
function appendIMessageReactionHint(params) {
  return addIMessageApprovalReactionHintToText({
    text: params.text ?? "",
    allowedDecisions: params.allowedDecisions,
  });
}
function buildIMessageExecPendingPayload(params) {
  const allowedDecisions = resolveExecApprovalRequestAllowedDecisions(params.request.request);
  const command = resolveExecApprovalCommandDisplay(params.request.request).commandText;
  const payload = buildTypedExecApprovalPendingReplyPayload({
    approvalId: params.request.id,
    approvalSlug: params.request.id.slice(0, 8),
    approvalCommandId: params.request.id,
    warningText: params.request.request.warningText ?? void 0,
    ask: params.request.request.ask ?? null,
    agentId: params.request.request.agentId ?? null,
    allowedDecisions,
    command,
    cwd: params.request.request.cwd ?? void 0,
    host: params.request.request.host === "node" ? "node" : "gateway",
    nodeId: params.request.request.nodeId ?? void 0,
    sessionKey: params.request.request.sessionKey ?? null,
    expiresAtMs: params.request.expiresAtMs,
    nowMs: params.nowMs,
  });
  return {
    ...payload,
    text: appendIMessageReactionHint({
      text: replaceApprovalIdPlaceholder(payload.text, params.request.id),
      allowedDecisions,
    }),
  };
}
function buildIMessagePluginPendingPayload(params) {
  const configuredDecisions = params.request.request.allowedDecisions;
  const allowedDecisions =
    configuredDecisions && configuredDecisions.length > 0
      ? configuredDecisions
      : DEFAULT_PLUGIN_APPROVAL_DECISIONS;
  const payload = buildTypedPluginApprovalPendingReplyPayload({
    request: params.request,
    nowMs: params.nowMs,
    allowedDecisions,
  });
  return {
    ...payload,
    text: appendIMessageReactionHint({
      text: replaceApprovalIdPlaceholder(payload.text, params.request.id),
      allowedDecisions,
    }),
  };
}
const imessageApprovalCapability = createChannelApprovalCapability({
  ...imessageApprovalAuth,
  getActionAvailabilityState: ({ cfg, accountId, approvalKind }) =>
    (
      approvalKind
        ? canApprovalPotentiallyRouteToIMessage({
            cfg,
            accountId,
            approvalKind,
          })
        : canAnyApprovalPotentiallyRouteToIMessage({
            cfg,
            accountId,
          })
    )
      ? { kind: "enabled" }
      : { kind: "disabled" },
  getExecInitiatingSurfaceState: ({ cfg, accountId }) =>
    canApprovalPotentiallyRouteToIMessage({
      cfg,
      accountId,
      approvalKind: "exec",
    })
      ? { kind: "enabled" }
      : { kind: "disabled" },
  describeExecApprovalSetup: ({ accountId }) => {
    return `iMessage supports native exec approvals for this account when \`approvals.exec.enabled\` is true and the route allows iMessage. Keep the macOS imsg bridge running and configure \`${accountId && accountId !== "default" ? `channels.imessage.accounts.${accountId}` : "channels.imessage"}.allowFrom\` to restrict approvers.`;
  },
  delivery: {
    hasConfiguredDmRoute: ({ cfg }) =>
      listIMessageAccountIds(cfg).some((accountId) => {
        if (
          !canAnyApprovalPotentiallyRouteToIMessage({
            cfg,
            accountId,
            nativeSessionOnly: true,
          })
        )
          return false;
        return (
          getIMessageApprovalApprovers({
            cfg,
            accountId,
          }).length > 0
        );
      }),
    shouldSuppressForwardingFallback: shouldSuppressIMessageForwardingFallback,
  },
  render: {
    exec: {
      buildPendingPayload: ({ request, nowMs }) =>
        buildIMessageExecPendingPayload({
          request,
          nowMs,
        }),
    },
    plugin: {
      buildPendingPayload: ({ request, nowMs }) =>
        buildIMessagePluginPendingPayload({
          request,
          nowMs,
        }),
    },
  },
  native: {
    describeDeliveryCapabilities: ({ cfg, accountId, approvalKind, request }) => {
      const originTarget = resolveIMessageOriginTarget({
        cfg,
        accountId,
        approvalKind,
        request,
      });
      const approverTargets = resolveIMessageApproverDmTargets({
        cfg,
        accountId,
        approvalKind,
        request,
      });
      return {
        enabled: Boolean(originTarget) || approverTargets.length > 0,
        preferredSurface: originTarget ? "origin" : "approver-dm",
        supportsOriginSurface: Boolean(originTarget),
        supportsApproverDmSurface: approverTargets.length > 0,
        notifyOriginWhenDmOnly: true,
      };
    },
    resolveOriginTarget: resolveIMessageOriginTarget,
    resolveApproverDmTargets: resolveIMessageApproverDmTargets,
  },
  nativeRuntime: createLazyChannelApprovalNativeRuntimeAdapter({
    eventKinds: ["exec", "plugin"],
    isConfigured: ({ cfg, accountId, context }) =>
      Boolean(context) &&
      canAnyApprovalPotentiallyRouteToIMessage({
        cfg,
        accountId,
        nativeSessionOnly: true,
      }),
    shouldHandle: ({ cfg, accountId, context, approvalKind, request }) =>
      Boolean(context) &&
      shouldHandleIMessageApprovalRequest({
        cfg,
        accountId,
        approvalKind,
        request,
      }),
    load: async () =>
      (await import("./approval-handler.runtime-B-QtpzBX.js")).imessageApprovalNativeRuntime,
  }),
});
//#endregion
//#region extensions/imessage/src/doctor.ts
const imessageDoctor = {
  groupAllowFromFallbackToAllowFrom: false,
  collectPreviewWarnings: ({ cfg }) => collectIMessageDuplicateAccountSourceWarnings({ cfg }),
};
//#endregion
//#region extensions/imessage/src/shared.ts
const IMESSAGE_CHANNEL = "imessage";
async function loadIMessageChannelRuntime$1() {
  return await import("./channel.runtime-DCjlbTFM.js");
}
const imessageSetupWizard = createIMessageSetupWizardProxy(
  async () => (await loadIMessageChannelRuntime$1()).imessageSetupWizard,
);
const imessageConfigAdapter = createScopedChannelConfigAdapter({
  sectionKey: IMESSAGE_CHANNEL,
  listAccountIds: listIMessageAccountIds,
  resolveAccount: adaptScopedAccountAccessor(resolveIMessageAccount),
  defaultAccountId: resolveDefaultIMessageAccountId,
  clearBaseFields: ["cliPath", "dbPath", "service", "region", "name"],
  resolveAllowFrom: (account) => account.config.allowFrom,
  formatAllowFrom: (allowFrom) => formatTrimmedAllowFromEntries(allowFrom),
  resolveDefaultTo: (account) => account.config.defaultTo,
});
const imessageSecurityAdapter = createRestrictSendersChannelSecurity({
  channelKey: IMESSAGE_CHANNEL,
  resolveDmPolicy: (account) => account.config.dmPolicy,
  resolveDmAllowFrom: (account) => account.config.allowFrom,
  resolveGroupPolicy: (account) => account.config.groupPolicy,
  surface: "iMessage groups",
  openScope: "any member",
  groupPolicyPath: "channels.imessage.groupPolicy",
  groupAllowFromPath: "channels.imessage.groupAllowFrom",
  mentionGated: false,
  policyPathSuffix: "dmPolicy",
});
function createIMessagePluginBase(params) {
  return {
    ...createChannelPluginBase({
      id: IMESSAGE_CHANNEL,
      meta: {
        ...getChatChannelMeta(IMESSAGE_CHANNEL),
        aliases: ["imsg"],
        showConfigured: false,
      },
      setupWizard: params.setupWizard,
      capabilities: {
        chatTypes: ["direct", "group"],
        media: true,
        tts: {
          voice: {
            synthesisTarget: "audio-file",
            audioFileFormats: ["mp3", "caf", "audio/mpeg", "audio/x-caf"],
            preferAudioFileFormat: "caf",
          },
        },
        reactions: true,
        edit: true,
        unsend: true,
        reply: true,
        effects: true,
        groupManagement: true,
      },
      reload: { configPrefixes: ["channels.imessage"] },
      configSchema: IMessageChannelConfigSchema,
      config: {
        ...imessageConfigAdapter,
        isConfigured: (account) => account.configured,
        describeAccount: (account) =>
          describeAccountSnapshot({
            account,
            configured: account.configured,
          }),
      },
      security: imessageSecurityAdapter,
      setup: params.setup,
    }),
    messaging: {
      resolveInboundAttachmentRoots: (paramsValue) =>
        resolveIMessageAttachmentRoots({
          accountId: paramsValue.accountId,
          cfg: paramsValue.cfg,
        }),
      resolveRemoteInboundAttachmentRoots: (paramsLocal) =>
        resolveIMessageRemoteAttachmentRoots({
          accountId: paramsLocal.accountId,
          cfg: paramsLocal.cfg,
        }),
    },
  };
}
//#endregion
//#region extensions/imessage/src/status-core.ts
async function probeIMessageStatusAccount(params) {
  return await params.probeIMessageAccount({
    timeoutMs: params.timeoutMs,
    cliPath: params.account.config.cliPath,
    dbPath: params.account.config.dbPath,
  });
}
//#endregion
//#region extensions/imessage/src/channel.ts
const loadIMessageChannelRuntime = createLazyRuntimeModule(
  () => import("./channel.runtime-DCjlbTFM.js"),
);
function toIMessageMessageSendResult(result, kind, replyToId) {
  const receipt =
    result.receipt ??
    createMessageReceiptFromOutboundResults({
      results: result.messageId
        ? [
            {
              channel: "imessage",
              messageId: result.messageId,
            },
          ]
        : [],
      kind,
      ...(replyToId ? { replyToId } : {}),
    });
  return {
    messageId: result.messageId || receipt.primaryPlatformMessageId,
    receipt,
    ...(result.meta && Object.keys(result.meta).length > 0 ? { meta: result.meta } : {}),
  };
}
const loadIMessageApprovalReactionsModule = createLazyRuntimeModule(
  () => import("./approval-reactions-2_PRdC1i.js"),
);
async function prepareForwardedIMessageApprovalPayload(params) {
  const prepared = (
    await loadIMessageApprovalReactionsModule()
  ).addIMessageApprovalReactionHintToStructuredPayload(params);
  if (prepared) Object.assign(params.payload, prepared);
}
async function registerDeliveredIMessageApprovalPayload(params) {
  const accountId = resolveIMessageAccount({
    cfg: params.cfg,
    accountId: params.target.accountId,
  }).accountId;
  (
    await loadIMessageApprovalReactionsModule()
  ).registerIMessageApprovalReactionTargetForDeliveredPayload({
    accountId,
    target: params.target,
    payload: params.payload,
    results: params.results,
  });
}
const imessageMessageAdapter = defineChannelMessageAdapter({
  id: "imessage",
  durableFinal: {
    capabilities: {
      text: true,
      media: true,
      replyTo: true,
      messageSendingHooks: true,
    },
  },
  send: {
    text: async (ctx) => {
      return toIMessageMessageSendResult(
        await (
          await loadIMessageChannelRuntime()
        ).sendIMessageOutbound({
          cfg: ctx.cfg,
          to: ctx.to,
          text: ctx.text,
          accountId: ctx.accountId ?? void 0,
          deps: ctx.deps,
          replyToId: ctx.replyToId ?? void 0,
        }),
        "text",
        ctx.replyToId,
      );
    },
    media: async (ctx) => {
      return toIMessageMessageSendResult(
        await (
          await loadIMessageChannelRuntime()
        ).sendIMessageOutbound({
          cfg: ctx.cfg,
          to: ctx.to,
          text: ctx.text,
          mediaUrl: ctx.mediaUrl,
          mediaLocalRoots: ctx.mediaLocalRoots,
          audioAsVoice: ctx.audioAsVoice,
          accountId: ctx.accountId ?? void 0,
          deps: ctx.deps,
          replyToId: ctx.replyToId ?? void 0,
        }),
        ctx.audioAsVoice ? "voice" : "media",
        ctx.replyToId,
      );
    },
  },
});
function buildIMessageBaseSessionKey(params) {
  return buildOutboundBaseSessionKey({
    ...params,
    channel: "imessage",
  });
}
function isCanonicalIMessageDirectHandle(raw, normalized) {
  const trimmed = raw.trim();
  if (!trimmed || !normalized) return false;
  if (normalized.startsWith("+")) return /^[+\d\s().-]+$/.test(trimmed);
  return /^[^\s@<>()[\]`]+@[^\s@<>()[\]`]+\.[^\s@<>()[\]`]+$/.test(trimmed);
}
function resolveIMessageOutboundSessionRoute(params) {
  const parsed = parseIMessageTarget(params.target);
  if (parsed.kind === "handle") {
    const handle = normalizeIMessageHandle(parsed.to);
    if (!handle) return null;
    const account = resolveIMessageAccount({
      cfg: params.cfg,
      accountId: params.accountId,
    });
    const directTarget = `${parsed.serviceExplicit || parsed.service !== "auto" ? parsed.service : account.config.service === "sms" ? "sms" : "imessage"}:${handle}`;
    const peer = {
      kind: "direct",
      id: handle,
    };
    const baseSessionKey = buildIMessageBaseSessionKey({
      cfg: params.cfg,
      agentId: params.agentId,
      accountId: params.accountId,
      peer,
    });
    return {
      sessionKey: baseSessionKey,
      baseSessionKey,
      recipientSessionExact: isCanonicalIMessageDirectHandle(parsed.to, handle),
      peer,
      chatType: "direct",
      from: directTarget,
      to: directTarget,
    };
  }
  const peerId =
    parsed.kind === "chat_id"
      ? String(parsed.chatId)
      : parsed.kind === "chat_guid"
        ? parsed.chatGuid
        : parsed.chatIdentifier;
  if (!peerId) return null;
  const peer = {
    kind: "group",
    id: peerId,
  };
  const baseSessionKey = buildIMessageBaseSessionKey({
    cfg: params.cfg,
    agentId: params.agentId,
    accountId: params.accountId,
    peer,
  });
  const toPrefix =
    parsed.kind === "chat_id"
      ? "chat_id"
      : parsed.kind === "chat_guid"
        ? "chat_guid"
        : "chat_identifier";
  return {
    sessionKey: baseSessionKey,
    baseSessionKey,
    recipientSessionExact: false,
    peer,
    chatType: "group",
    from: `imessage:group:${peerId}`,
    to: `${toPrefix}:${peerId}`,
  };
}
const imessagePlugin = createChatChannelPlugin({
  base: {
    ...createIMessagePluginBase({
      setupWizard: imessageSetupWizard,
      setup: imessageSetupAdapter,
    }),
    allowlist: buildDmGroupAccountAllowlistAdapter({
      channelId: "imessage",
      resolveAccount: resolveIMessageAccount,
      normalize: ({ values }) => formatTrimmedAllowFromEntries(values),
      resolveDmAllowFrom: (account) => account.config.allowFrom,
      resolveGroupAllowFrom: (account) => account.config.groupAllowFrom,
      resolveDmPolicy: (account) => account.config.dmPolicy,
      resolveGroupPolicy: (account) => account.config.groupPolicy,
    }),
    groups: {
      resolveRequireMention: resolveIMessageGroupRequireMention,
      resolveToolPolicy: resolveIMessageGroupToolPolicy,
    },
    doctor: imessageDoctor,
    conversationBindings: {
      supportsCurrentConversationBinding: true,
      createManager: ({ cfg, accountId }) =>
        createIMessageConversationBindingManager({
          cfg,
          accountId: accountId ?? void 0,
        }),
    },
    bindings: {
      compileConfiguredBinding: ({ conversationId }) =>
        normalizeIMessageAcpConversationId(conversationId),
      matchInboundConversation: ({ compiledBinding, conversationId }) =>
        matchIMessageAcpConversation({
          bindingConversationId: compiledBinding.conversationId,
          conversationId,
        }),
      resolveCommandConversation: ({ originatingTo, commandTo, fallbackTo }) => {
        const conversationId =
          resolveIMessageConversationIdFromTarget(originatingTo ?? "") ??
          resolveIMessageConversationIdFromTarget(commandTo ?? "") ??
          resolveIMessageConversationIdFromTarget(fallbackTo ?? "");
        return conversationId ? { conversationId } : null;
      },
    },
    messaging: {
      normalizeTarget: normalizeIMessageMessagingTarget,
      inferTargetChatType: ({ to }) => inferIMessageTargetChatType(to),
      resolveOutboundSessionRoute: (params) => resolveIMessageOutboundSessionRoute(params),
      targetResolver: {
        looksLikeId: looksLikeIMessageExplicitTargetId,
        hint: "<handle|chat_id:ID>",
        resolveTarget: async ({ normalized }) => {
          const to = normalized?.trim();
          if (!to) return null;
          const chatType = inferIMessageTargetChatType(to);
          if (!chatType) return null;
          return {
            to,
            kind: chatType === "direct" ? "user" : "group",
            source: "normalized",
          };
        },
      },
    },
    status: createComputedAccountStatusAdapter({
      defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID, {
        cliPath: null,
        dbPath: null,
      }),
      collectStatusIssues: (accounts) => collectStatusIssuesFromLastError("imessage", accounts),
      buildChannelSummary: ({ snapshot }) =>
        buildPassiveProbedChannelStatusSummary(snapshot, {
          cliPath: snapshot.cliPath ?? null,
          dbPath: snapshot.dbPath ?? null,
        }),
      probeAccount: async ({ account, timeoutMs }) =>
        await probeIMessageStatusAccount({
          account,
          timeoutMs,
          probeIMessageAccount: async (params) =>
            await (await loadIMessageChannelRuntime()).probeIMessageAccount(params),
        }),
      resolveAccountSnapshot: ({ account, runtime }) => ({
        accountId: account.accountId,
        name: account.name,
        enabled: account.enabled,
        configured: account.configured,
        extra: {
          cliPath: runtime?.cliPath ?? account.config.cliPath ?? null,
          dbPath: runtime?.dbPath ?? account.config.dbPath ?? null,
        },
      }),
      resolveAccountState: ({ enabled }) => (enabled ? "enabled" : "disabled"),
    }),
    gateway: {
      startAccount: async (ctx) => {
        const conversationBindings = createIMessageConversationBindingManager({
          cfg: ctx.cfg,
          accountId: ctx.accountId,
        });
        try {
          return await (await loadIMessageChannelRuntime()).startIMessageGatewayAccount(ctx);
        } finally {
          conversationBindings.stop();
        }
      },
    },
    message: imessageMessageAdapter,
    actions: imessageMessageActions,
    approvalCapability: imessageApprovalCapability,
  },
  pairing: {
    text: {
      idLabel: "imessageSenderId",
      message: "OpenClaw: your access has been approved.",
      notify: async ({ id, cfg }) =>
        await (
          await loadIMessageChannelRuntime()
        ).notifyIMessageApproval({
          id,
          cfg,
        }),
    },
  },
  security: imessageSecurityAdapter,
  outbound: {
    base: {
      deliveryMode: "direct",
      chunker: chunkTextForOutbound,
      chunkerMode: "text",
      textChunkLimit: 4e3,
      sanitizeText: ({ text }) =>
        sanitizeForPlainText(sanitizeOutboundText(text), { style: "markdown" }),
      shouldSuppressLocalPayloadPrompt: ({ cfg, accountId, payload, hint }) =>
        shouldSuppressLocalIMessageExecApprovalPrompt({
          cfg,
          accountId,
          payload,
          hint,
        }),
      beforeDeliverPayload: async ({ payload, hint }) => {
        if (hint?.kind !== "approval-pending") return;
        await prepareForwardedIMessageApprovalPayload({
          payload,
          approvalKind: hint.approvalKind,
        });
      },
      afterDeliverPayload: async (params) => await registerDeliveredIMessageApprovalPayload(params),
      deliveryCapabilities: {
        durableFinal: {
          text: true,
          media: true,
          replyTo: true,
          messageSendingHooks: true,
        },
      },
    },
    attachedResults: {
      channel: "imessage",
      sendText: async ({ cfg, to, text, accountId, deps, replyToId }) =>
        await (
          await loadIMessageChannelRuntime()
        ).sendIMessageOutbound({
          cfg,
          to,
          text,
          accountId: accountId ?? void 0,
          deps,
          replyToId: replyToId ?? void 0,
        }),
      sendMedia: async ({
        cfg,
        to,
        text,
        mediaUrl,
        mediaLocalRoots,
        audioAsVoice,
        accountId,
        deps,
        replyToId,
      }) =>
        await (
          await loadIMessageChannelRuntime()
        ).sendIMessageOutbound({
          cfg,
          to,
          text,
          mediaUrl,
          mediaLocalRoots,
          audioAsVoice,
          accountId: accountId ?? void 0,
          deps,
          replyToId: replyToId ?? void 0,
        }),
    },
  },
});
//#endregion
export { createIMessagePluginBase as n, imessageSetupWizard as r, imessagePlugin as t };
