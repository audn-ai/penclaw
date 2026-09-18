import { Type } from "typebox";
import { a as resolveMatrixAccountConfig } from "./account-config-Cth1-JFA.js";
import { n as describeAccountSnapshot } from "./account-helpers-BAtt8fRD.js";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-C7N4Rwku.js";
import { n as requiresExplicitMatrixDefaultAccount } from "./account-selection-CiG2_E20.js";
import {
  i as resolveMatrixAccount,
  r as resolveDefaultMatrixAccountId,
  t as listMatrixAccountIds,
} from "./accounts-qvek289C.js";
import { n as normalizeMatrixUserId } from "./allowlist-D7LjwHLa.js";
import {
  i as splitChannelApprovalCapability,
  n as createApproverRestrictedNativeApprovalCapability,
  r as createChannelApprovalCapability,
} from "./approval-delivery-helpers-BMCDWKJ5.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { n as createLazyChannelApprovalNativeRuntimeAdapter } from "./approval-handler-adapter-runtime-DjbKLbMW.js";
import { t as normalizeMatrixApproverId } from "./approval-ids-gJ_fLEM_.js";
import { r as createChannelNativeOriginTargetResolver } from "./approval-native-helpers-BZsvz7Nq.js";
import "./channel-core-Z_rV5hXh.js";
import "./routing-CwvmVRHd.js";
import { n as sanitizeAssistantVisibleText } from "./assistant-visible-text-DV1Yognj.js";
import {
  l as createScopedDmSecurityResolver,
  t as adaptScopedAccountAccessor,
} from "./channel-config-helpers-BFvX3ldW.js";
import { C as createChannelMessageAdapterFromOutbound } from "./channel-outbound-DlkFd7rO.js";
import { i as createPairingPrefixStripper } from "./channel-pairing-1V8FM4wM.js";
import {
  S as createAllowlistProviderOpenWarningCollector,
  c as resolveScopeRequireMention,
  k as projectAccountConfigWarningCollector,
  l as resolveScopeToolsPolicy,
} from "./channel-policy-DXOn_tKS.js";
import {
  h as readPositiveIntegerParam,
  i as createActionGate,
  t as ToolAuthorizationError,
  y as readStringParam,
} from "./common-DyDSUect.js";
import "./approval-delivery-runtime-D6blv2E7.js";
import {
  n as matrixConfigAdapter,
  t as MatrixChannelConfigSchema,
} from "./config-schema-CkgvEuT1.js";
import {
  i as createChatChannelPlugin,
  n as buildThreadAwareOutboundSessionRoute,
  t as buildChannelOutboundSessionRoute,
} from "./core-V3U0lOIj.js";
import { i as createResolvedDirectoryEntriesLister } from "./directory-config-helpers-6PdjajJm.js";
import "./approval-native-runtime-BCKDIyz_.js";
import { n as createChannelDirectoryAdapter } from "./directory-runtime-VSo_cGzY.js";
import "./conversation-runtime-DuXhVyjf.js";
import {
  n as normalizeCompatibilityConfig,
  t as legacyConfigRules,
} from "./doctor-contract-BGpUCkwm.js";
import { t as formatMatrixErrorMessage } from "./errors-DJRnBTUk.js";
import "./channel-status-B8fwcUOI.js";
import "./channel-actions-C9vNf9jw.js";
import { n as resolveApprovalRequestSessionConversation } from "./exec-approval-session-target-GSisVfGX.js";
import {
  a as isMatrixExecApprovalAuthorizedSender,
  c as shouldHandleMatrixApprovalRequest,
  d as matrixApprovalAuth,
  i as isMatrixApprovalClientEnabled,
  l as shouldSuppressLocalMatrixExecApprovalPrompt,
  n as getMatrixExecApprovalApprovers,
  o as isMatrixExecApprovalClientEnabled,
  r as isMatrixAnyApprovalClientEnabled,
  s as resolveMatrixExecApprovalTarget,
  t as getMatrixApprovalApprovers,
  u as getMatrixApprovalAuthApprovers,
} from "./exec-approvals-BQVf9_eL.js";
import {
  i as createLazyRuntimeNamedExport,
  r as createLazyRuntimeModule,
} from "./lazy-runtime-B-Fc-m0I.js";
import { t as PAIRING_APPROVED_MESSAGE } from "./pairing-message-DNhqI-OE.js";
import {
  r as resolveMatrixRoomScopePath,
  t as buildMatrixRoomScopeTree,
} from "./rooms-RrimWzo2.js";
import {
  n as createRuntimeOutboundDelegates,
  t as createRuntimeDirectoryLiveAdapter,
} from "./runtime-forwarders-Dxil5z45.js";
import {
  n as collectRuntimeConfigAssignments,
  r as secretTargetRegistryEntries,
} from "./secret-contract-D92E_YSZ.js";
import { f as parseThreadSessionSuffix } from "./session-key-utils-B8sNp9l4.js";
import { t as resolveMatrixStoredSessionMeta } from "./session-store-metadata-ClU8Lvaz.js";
import { m as resolveStorePath, r as getSessionEntry } from "./session-store-runtime-BwE6SlGz.js";
import {
  n as matrixSetupAdapter,
  t as createMatrixSetupWizardProxy,
} from "./setup-core-jlLCuFmn.js";
import {
  a as namedAccountPromotionKeys,
  o as resolveSingleAccountPromotionTarget,
  s as singleAccountKeysToMove,
} from "./setup-dm-policy-D3L8FHGb.js";
import {
  c as collectStatusIssuesFromLastError,
  d as createDefaultChannelRuntimeState,
  i as buildProbeChannelStatusSummary,
  u as createComputedAccountStatusAdapter,
} from "./status-helpers-SdoCNDDu.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  l as normalizeOptionalStringifiedId,
} from "./string-coerce-DW4mBlAt.js";
import {
  a as resolveMatrixTargetIdentity,
  i as resolveMatrixDirectUserId,
  n as normalizeMatrixMessagingTarget,
  r as normalizeMatrixResolvableTarget,
  t as isMatrixQualifiedUserId,
} from "./target-ids-CmrXcyY1.js";
import { t as chunkTextForOutbound } from "./text-chunking-Dr19ggf-.js";
import {
  n as resolveMatrixInboundConversation,
  t as defaultTopLevelPlacement,
} from "./thread-binding-api-DWYk5goC.js";
import {
  d as setMatrixThreadBindingIdleTimeoutBySessionKey,
  p as setMatrixThreadBindingMaxAgeBySessionKey,
} from "./thread-bindings-shared-jccfWjhC.js";
import { t as createScopedAccountReplyToModeResolver } from "./threading-helpers-CMXJIj4M.js";
import { t as extractToolSend } from "./tool-send-DlIp2cBO.js";
//#region extensions/matrix/src/actions.ts
const MATRIX_PLUGIN_HANDLED_ACTIONS = /* @__PURE__ */ new Set([
  "send",
  "poll-vote",
  "react",
  "reactions",
  "read",
  "edit",
  "delete",
  "pin",
  "unpin",
  "list-pins",
  "set-profile",
  "member-info",
  "channel-info",
  "permissions",
]);
const MATRIX_PROFILE_MEDIA_PROPERTIES = {
  avatarUrl: Type.Optional(
    Type.String({
      description:
        "Profile avatar URL for Matrix self-profile update actions. Matrix accepts mxc:// and http(s) URLs.",
    }),
  ),
  avatar_url: Type.Optional(
    Type.String({
      description:
        "snake_case alias of avatarUrl for Matrix self-profile update actions. Matrix accepts mxc:// and http(s) URLs.",
    }),
  ),
  avatarPath: Type.Optional(
    Type.String({
      description:
        "Local avatar file path for Matrix self-profile update actions. Matrix uploads this file and sets the resulting MXC URI.",
    }),
  ),
  avatar_path: Type.Optional(
    Type.String({
      description:
        "snake_case alias of avatarPath for Matrix self-profile update actions. Matrix uploads this file and sets the resulting MXC URI.",
    }),
  ),
};
const MATRIX_PROFILE_MEDIA_SOURCE_PARAMS = Object.freeze(["avatarUrl", "avatarPath"]);
function createMatrixExposedActions(params) {
  const actions = /* @__PURE__ */ new Set(["poll", "poll-vote"]);
  if (params.gate("messages")) {
    actions.add("send");
    actions.add("read");
    actions.add("edit");
    actions.add("delete");
  }
  if (params.gate("reactions")) {
    actions.add("react");
    actions.add("reactions");
  }
  if (params.gate("pins")) {
    actions.add("pin");
    actions.add("unpin");
    actions.add("list-pins");
  }
  if (params.gate("profile") && params.senderIsOwner === true) actions.add("set-profile");
  if (params.gate("memberInfo")) actions.add("member-info");
  if (params.gate("channelInfo")) actions.add("channel-info");
  if (params.encryptionEnabled && params.gate("verification")) actions.add("permissions");
  return actions;
}
function buildMatrixProfileToolSchema() {
  return {
    actions: ["set-profile"],
    properties: {
      displayName: Type.Optional(
        Type.String({
          description: "Profile display name for Matrix self-profile update actions.",
        }),
      ),
      display_name: Type.Optional(
        Type.String({
          description: "snake_case alias of displayName for Matrix self-profile update actions.",
        }),
      ),
      ...MATRIX_PROFILE_MEDIA_PROPERTIES,
    },
  };
}
const matrixMessageActions = {
  describeMessageTool: ({ cfg, accountId, senderIsOwner }) => {
    const resolvedCfg = cfg;
    if (!accountId && requiresExplicitMatrixDefaultAccount(resolvedCfg))
      return {
        actions: [],
        capabilities: [],
      };
    const account = resolveMatrixAccount({
      cfg: resolvedCfg,
      accountId: accountId ?? resolveDefaultMatrixAccountId(resolvedCfg),
    });
    if (!account.enabled || !account.configured)
      return {
        actions: [],
        capabilities: [],
      };
    const actions = createMatrixExposedActions({
      gate: createActionGate(account.config.actions),
      encryptionEnabled: account.config.encryption === true,
      senderIsOwner,
    });
    const listedActions = Array.from(actions);
    return {
      actions: listedActions,
      capabilities: ["presentation"],
      schema: listedActions.includes("set-profile") ? buildMatrixProfileToolSchema() : null,
      mediaSourceParams: listedActions.includes("set-profile")
        ? { "set-profile": MATRIX_PROFILE_MEDIA_SOURCE_PARAMS }
        : null,
    };
  },
  supportsAction: ({ action }) => MATRIX_PLUGIN_HANDLED_ACTIONS.has(action),
  extractToolSend: ({ args }) => {
    return extractToolSend(args, "sendMessage");
  },
  handleAction: async (ctx) => {
    const { handleMatrixAction } = await import("./tool-actions.runtime.js");
    const { action, params, cfg, accountId, mediaLocalRoots } = ctx;
    const dispatch = async (actionParams) =>
      await handleMatrixAction(
        {
          ...actionParams,
          ...(accountId ? { accountId } : {}),
        },
        cfg,
        {
          mediaLocalRoots,
          readContext: {
            accountId,
            requesterAccountId: ctx.requesterAccountId,
            currentChannelId: ctx.toolContext?.currentChannelId,
            currentChannelProvider: ctx.toolContext?.currentChannelProvider,
            currentChatType: ctx.toolContext?.currentChatType,
            conversationReadOrigin: ctx.conversationReadOrigin,
          },
        },
      );
    const resolveRoomId = () =>
      readStringParam(params, "roomId") ??
      readStringParam(params, "channelId") ??
      readStringParam(params, "to", { required: true });
    if (action === "send") {
      const to = readStringParam(params, "to", { required: true });
      const mediaUrl =
        readStringParam(params, "media", { trim: false }) ??
        readStringParam(params, "mediaUrl", { trim: false }) ??
        readStringParam(params, "filePath", { trim: false }) ??
        readStringParam(params, "path", { trim: false });
      const content = readStringParam(params, "message", {
        required: !mediaUrl,
        allowEmpty: true,
      });
      const replyTo = readStringParam(params, "replyTo");
      const threadId = readStringParam(params, "threadId");
      const audioAsVoice =
        typeof params.asVoice === "boolean"
          ? params.asVoice
          : typeof params.audioAsVoice === "boolean"
            ? params.audioAsVoice
            : void 0;
      return await dispatch({
        action: "sendMessage",
        to,
        content,
        mediaUrl: mediaUrl ?? void 0,
        replyToId: replyTo ?? void 0,
        threadId: threadId ?? void 0,
        audioAsVoice,
      });
    }
    if (action === "poll-vote")
      return await dispatch({
        ...params,
        action: "pollVote",
      });
    if (action === "react") {
      const messageId = readStringParam(params, "messageId", { required: true });
      const emoji = readStringParam(params, "emoji", { allowEmpty: true });
      const remove = typeof params.remove === "boolean" ? params.remove : void 0;
      return await dispatch({
        action: "react",
        roomId: resolveRoomId(),
        messageId,
        emoji,
        remove,
      });
    }
    if (action === "reactions") {
      const messageId = readStringParam(params, "messageId", { required: true });
      const limit = readPositiveIntegerParam(params, "limit", {
        message: "limit must be a positive integer.",
      });
      return await dispatch({
        action: "reactions",
        roomId: resolveRoomId(),
        messageId,
        limit,
      });
    }
    if (action === "read") {
      const limit = readPositiveIntegerParam(params, "limit", {
        message: "limit must be a positive integer.",
      });
      return await dispatch({
        action: "readMessages",
        roomId: resolveRoomId(),
        limit,
        before: readStringParam(params, "before"),
        after: readStringParam(params, "after"),
        threadId: readStringParam(params, "threadId"),
      });
    }
    if (action === "edit") {
      const messageId = readStringParam(params, "messageId", { required: true });
      const content = readStringParam(params, "message", { required: true });
      return await dispatch({
        action: "editMessage",
        roomId: resolveRoomId(),
        messageId,
        content,
      });
    }
    if (action === "delete") {
      const messageId = readStringParam(params, "messageId", { required: true });
      return await dispatch({
        action: "deleteMessage",
        roomId: resolveRoomId(),
        messageId,
      });
    }
    if (action === "pin" || action === "unpin" || action === "list-pins") {
      const messageId =
        action === "list-pins" ? void 0 : readStringParam(params, "messageId", { required: true });
      return await dispatch({
        action: action === "pin" ? "pinMessage" : action === "unpin" ? "unpinMessage" : "listPins",
        roomId: resolveRoomId(),
        messageId,
      });
    }
    if (action === "set-profile") {
      if (ctx.senderIsOwner !== true)
        throw new ToolAuthorizationError("Matrix profile updates require owner access.");
      const avatarPath =
        readStringParam(params, "avatarPath") ??
        readStringParam(params, "path") ??
        readStringParam(params, "filePath");
      return await dispatch({
        action: "setProfile",
        displayName: readStringParam(params, "displayName") ?? readStringParam(params, "name"),
        avatarUrl: readStringParam(params, "avatarUrl"),
        avatarPath,
      });
    }
    if (action === "member-info")
      return await dispatch({
        action: "memberInfo",
        userId: readStringParam(params, "userId", { required: true }),
        roomId: resolveRoomId(),
      });
    if (action === "channel-info")
      return await dispatch({
        action: "channelInfo",
        roomId: resolveRoomId(),
      });
    if (action === "permissions") {
      const operation = normalizeLowercaseStringOrEmpty(
        readStringParam(params, "operation") ??
          readStringParam(params, "mode") ??
          "verification-list",
      );
      const operationToAction = {
        "encryption-status": "encryptionStatus",
        "verification-status": "verificationStatus",
        "verification-bootstrap": "verificationBootstrap",
        "verification-recovery-key": "verificationRecoveryKey",
        "verification-backup-status": "verificationBackupStatus",
        "verification-backup-restore": "verificationBackupRestore",
        "verification-list": "verificationList",
        "verification-request": "verificationRequest",
        "verification-accept": "verificationAccept",
        "verification-cancel": "verificationCancel",
        "verification-start": "verificationStart",
        "verification-generate-qr": "verificationGenerateQr",
        "verification-scan-qr": "verificationScanQr",
        "verification-sas": "verificationSas",
        "verification-confirm": "verificationConfirm",
        "verification-mismatch": "verificationMismatch",
        "verification-confirm-qr": "verificationConfirmQr",
      };
      const resolvedAction = operationToAction[operation];
      if (!resolvedAction)
        throw new Error(
          `Unsupported Matrix permissions operation: ${operation}. Supported values: ${Object.keys(operationToAction).join(", ")}`,
        );
      return await dispatch({
        ...params,
        action: resolvedAction,
      });
    }
    throw new Error(`Action ${action} is not supported for provider matrix.`);
  },
};
//#endregion
//#region extensions/matrix/src/approval-native.ts
function normalizeComparableTarget(value) {
  const target = resolveMatrixTargetIdentity(value);
  if (!target) return normalizeLowercaseStringOrEmpty(value);
  if (target.kind === "user") return `user:${normalizeMatrixUserId(target.id)}`;
  return `${normalizeLowercaseStringOrEmpty(target.kind)}:${target.id}`;
}
function resolveMatrixNativeTarget(raw) {
  const target = resolveMatrixTargetIdentity(raw);
  if (!target) return null;
  return target.kind === "user" ? `user:${target.id}` : `room:${target.id}`;
}
function resolveTurnSourceMatrixOriginTarget(request) {
  const turnSourceChannel = normalizeLowercaseStringOrEmpty(request.request.turnSourceChannel);
  const target = resolveMatrixNativeTarget(request.request.turnSourceTo?.trim() || "");
  if (turnSourceChannel !== "matrix" || !target) return null;
  return {
    to: target,
    threadId: normalizeOptionalStringifiedId(request.request.turnSourceThreadId),
  };
}
function resolveSessionMatrixOriginTarget(sessionTarget) {
  const target = resolveMatrixNativeTarget(sessionTarget.to);
  if (!target) return null;
  return {
    to: target,
    threadId: normalizeOptionalStringifiedId(sessionTarget.threadId),
  };
}
function normalizeMatrixOriginTarget(target) {
  return {
    ...target,
    to: normalizeComparableTarget(target.to),
  };
}
function hasMatrixPluginApprovers(params) {
  return getMatrixApprovalAuthApprovers(params).length > 0;
}
function availabilityState(enabled) {
  return enabled ? { kind: "enabled" } : { kind: "disabled" };
}
function hasMatrixApprovalApprovers(params) {
  return (
    getMatrixApprovalApprovers({
      cfg: params.cfg,
      accountId: params.accountId,
      approvalKind: params.approvalKind,
    }).length > 0
  );
}
function hasAnyMatrixApprovalApprovers(params) {
  return (
    getMatrixExecApprovalApprovers(params).length > 0 ||
    getMatrixApprovalAuthApprovers(params).length > 0
  );
}
function isMatrixPluginAuthorizedSender(params) {
  const normalizedSenderId = params.senderId ? normalizeMatrixApproverId(params.senderId) : void 0;
  if (!normalizedSenderId) return false;
  return getMatrixApprovalAuthApprovers(params).includes(normalizedSenderId);
}
function resolveSuppressionAccountId(params) {
  return (
    params.target.accountId?.trim() || params.request.request.turnSourceAccountId?.trim() || void 0
  );
}
const resolveMatrixOriginTarget = createChannelNativeOriginTargetResolver({
  channel: "matrix",
  shouldHandleRequest: ({ cfg, accountId, approvalKind, request }) => {
    if (approvalKind !== "exec" && approvalKind !== "plugin") return false;
    return shouldHandleMatrixApprovalRequest({
      cfg,
      accountId,
      approvalKind,
      request,
    });
  },
  resolveTurnSourceTarget: resolveTurnSourceMatrixOriginTarget,
  resolveSessionTarget: resolveSessionMatrixOriginTarget,
  normalizeTargetForMatch: normalizeMatrixOriginTarget,
  resolveFallbackTarget: (request) => {
    const sessionConversation = resolveApprovalRequestSessionConversation({
      request,
      channel: "matrix",
    });
    if (!sessionConversation) return null;
    const target = resolveMatrixNativeTarget(sessionConversation.id);
    if (!target) return null;
    return {
      to: target,
      threadId: normalizeOptionalStringifiedId(sessionConversation.threadId),
    };
  },
});
function resolveMatrixApproverDmTargets(params) {
  if (!shouldHandleMatrixApprovalRequest(params)) return [];
  return getMatrixApprovalApprovers(params)
    .map((approver) => {
      const normalized = normalizeMatrixUserId(approver);
      return normalized ? { to: `user:${normalized}` } : null;
    })
    .filter((target) => target !== null);
}
const matrixNativeApprovalCapability = createApproverRestrictedNativeApprovalCapability({
  channel: "matrix",
  channelLabel: "Matrix",
  describeExecApprovalSetup: ({ accountId }) => {
    const prefix =
      accountId && accountId !== "default"
        ? `channels.matrix.accounts.${accountId}`
        : "channels.matrix";
    return `Approve it from the Web UI or terminal UI for now. Matrix supports native exec approvals for this account. Configure \`${prefix}.execApprovals.approvers\` or \`${prefix}.dm.allowFrom\`; leave \`${prefix}.execApprovals.enabled\` unset/\`auto\` or set it to \`true\`.`;
  },
  listAccountIds: listMatrixAccountIds,
  hasApprovers: ({ cfg, accountId }) =>
    hasAnyMatrixApprovalApprovers({
      cfg,
      accountId,
    }),
  isExecAuthorizedSender: ({ cfg, accountId, senderId }) =>
    isMatrixExecApprovalAuthorizedSender({
      cfg,
      accountId,
      senderId,
    }),
  isPluginAuthorizedSender: ({ cfg, accountId, senderId }) =>
    isMatrixPluginAuthorizedSender({
      cfg,
      accountId,
      senderId,
    }),
  isNativeDeliveryEnabled: ({ cfg, accountId }) =>
    isMatrixExecApprovalClientEnabled({
      cfg,
      accountId,
    }),
  resolveNativeDeliveryMode: ({ cfg, accountId }) =>
    resolveMatrixExecApprovalTarget({
      cfg,
      accountId,
    }),
  requireMatchingTurnSourceChannel: true,
  resolveSuppressionAccountId,
  resolveOriginTarget: resolveMatrixOriginTarget,
  resolveApproverDmTargets: resolveMatrixApproverDmTargets,
  notifyOriginWhenDmOnly: true,
  nativeRuntime: createLazyChannelApprovalNativeRuntimeAdapter({
    eventKinds: ["exec", "plugin"],
    isConfigured: ({ cfg, accountId }) =>
      isMatrixAnyApprovalClientEnabled({
        cfg,
        accountId,
      }),
    shouldHandle: ({ cfg, accountId, approvalKind, request }) =>
      shouldHandleMatrixApprovalRequest({
        cfg,
        accountId,
        approvalKind,
        request,
      }),
    load: async () =>
      (await import("./approval-handler.runtime-BGBZX0Ni.js")).matrixApprovalNativeRuntime,
  }),
});
const splitMatrixApprovalCapability = splitChannelApprovalCapability(
  matrixNativeApprovalCapability,
);
const matrixBaseNativeApprovalAdapter = splitMatrixApprovalCapability.native;
const matrixBaseDeliveryAdapter = splitMatrixApprovalCapability.delivery;
const matrixDeliveryAdapter = matrixBaseDeliveryAdapter && {
  ...matrixBaseDeliveryAdapter,
  shouldSuppressForwardingFallback: (params) => {
    const accountId = resolveSuppressionAccountId(params);
    if (
      !hasMatrixApprovalApprovers({
        cfg: params.cfg,
        accountId,
        approvalKind: params.approvalKind,
      })
    )
      return false;
    if (params.approvalKind === "plugin") {
      const targetChannel = normalizeLowercaseStringOrEmpty(params.target.channel);
      const turnSourceChannel = normalizeLowercaseStringOrEmpty(
        params.request.request.turnSourceChannel,
      );
      return (
        targetChannel === "matrix" &&
        turnSourceChannel === "matrix" &&
        shouldHandleMatrixApprovalRequest({
          cfg: params.cfg,
          accountId,
          approvalKind: "plugin",
          request: params.request,
        })
      );
    }
    return matrixBaseDeliveryAdapter.shouldSuppressForwardingFallback?.(params) ?? false;
  },
};
const matrixNativeAdapter = matrixBaseNativeApprovalAdapter && {
  describeDeliveryCapabilities: (params) => {
    const capabilities = matrixBaseNativeApprovalAdapter.describeDeliveryCapabilities(params);
    const hasApprovers = hasMatrixApprovalApprovers({
      cfg: params.cfg,
      accountId: params.accountId,
      approvalKind: params.approvalKind,
    });
    const clientEnabled = isMatrixApprovalClientEnabled({
      cfg: params.cfg,
      accountId: params.accountId,
      approvalKind: params.approvalKind,
    });
    return {
      ...capabilities,
      enabled: hasApprovers && clientEnabled,
    };
  },
  resolveOriginTarget: matrixBaseNativeApprovalAdapter.resolveOriginTarget,
  resolveApproverDmTargets: matrixBaseNativeApprovalAdapter.resolveApproverDmTargets,
};
const matrixApprovalCapability = createChannelApprovalCapability({
  authorizeActorAction: (params) => {
    if (params.approvalKind !== "plugin")
      return matrixNativeApprovalCapability.authorizeActorAction?.(params) ?? { authorized: true };
    if (
      !hasMatrixPluginApprovers({
        cfg: params.cfg,
        accountId: params.accountId,
      })
    )
      return {
        authorized: false,
        reason: "❌ Matrix plugin approvals are not enabled for this bot account.",
      };
    return matrixApprovalAuth.authorizeActorAction(params);
  },
  getActionAvailabilityState: (params) => {
    if (params.approvalKind === "plugin")
      return availabilityState(
        hasMatrixPluginApprovers({
          cfg: params.cfg,
          accountId: params.accountId,
        }),
      );
    return (
      matrixNativeApprovalCapability.getActionAvailabilityState?.(params) ?? { kind: "disabled" }
    );
  },
  getExecInitiatingSurfaceState: (params) =>
    matrixNativeApprovalCapability.getExecInitiatingSurfaceState?.(params) ?? { kind: "disabled" },
  describeExecApprovalSetup: matrixNativeApprovalCapability.describeExecApprovalSetup,
  delivery: matrixDeliveryAdapter,
  nativeRuntime: matrixNativeApprovalCapability.nativeRuntime,
  native: matrixNativeAdapter,
  render: matrixNativeApprovalCapability.render,
});
//#endregion
//#region extensions/matrix/src/channel-account-paths.ts
function createMatrixProbeAccount(params) {
  return async ({ account, timeoutMs, cfg }) => {
    try {
      const auth = await params.resolveMatrixAuth({
        cfg,
        accountId: account.accountId,
      });
      return await params.probeMatrix({
        homeserver: auth.homeserver,
        accessToken: auth.accessToken,
        userId: auth.userId,
        deviceId: auth.deviceId,
        timeoutMs: timeoutMs ?? 5e3,
        accountId: account.accountId,
        allowPrivateNetwork: auth.allowPrivateNetwork,
        ssrfPolicy: auth.ssrfPolicy,
        dispatcherPolicy: auth.dispatcherPolicy,
      });
    } catch (err) {
      return {
        ok: false,
        error: formatMatrixErrorMessage(err),
        elapsedMs: 0,
      };
    }
  };
}
function createMatrixPairingText(sendMessageMatrix) {
  return {
    idLabel: "matrixUserId",
    message: PAIRING_APPROVED_MESSAGE,
    normalizeAllowEntry: createPairingPrefixStripper(/^matrix:/i),
    notify: async ({ id, message, cfg, accountId }) => {
      await sendMessageMatrix(`user:${id}`, message, {
        cfg,
        ...(accountId ? { accountId } : {}),
      });
    },
  };
}
//#endregion
//#region extensions/matrix/src/group-mentions.ts
function resolveMatrixGroupScope(params) {
  const matrixConfig = resolveMatrixAccountConfig({
    cfg: params.cfg,
    accountId: params.accountId,
  });
  const tree = buildMatrixRoomScopeTree(matrixConfig.groups ?? matrixConfig.rooms);
  const roomId = normalizeMatrixResolvableTarget(params.groupId?.trim() ?? "");
  const groupChannel = normalizeMatrixResolvableTarget(params.groupChannel?.trim() ?? "");
  return {
    tree,
    path: resolveMatrixRoomScopePath({
      tree,
      roomId,
      aliases: groupChannel ? [groupChannel] : [],
    }),
  };
}
function resolveMatrixGroupRequireMention(params) {
  return resolveScopeRequireMention(resolveMatrixGroupScope(params));
}
function resolveMatrixGroupToolPolicy(params) {
  return resolveScopeToolsPolicy(resolveMatrixGroupScope(params));
}
//#endregion
//#region extensions/matrix/src/resolver.ts
const loadMatrixChannelRuntime$1 = createLazyRuntimeNamedExport(
  () => import("./resolver.runtime.js"),
  "matrixResolverRuntime",
);
const matrixResolverAdapter = {
  resolveTargets: async ({ cfg, accountId, inputs, kind, runtime }) =>
    (await loadMatrixChannelRuntime$1()).resolveMatrixTargets({
      cfg,
      accountId,
      inputs,
      kind,
      runtime,
    }),
};
//#endregion
//#region extensions/matrix/src/session-route.ts
function resolveEffectiveMatrixAccountId(params) {
  return normalizeAccountId(params.accountId ?? resolveDefaultMatrixAccountId(params.cfg));
}
function resolveMatrixDmSessionScope(params) {
  return (
    resolveMatrixAccountConfig({
      cfg: params.cfg,
      accountId: params.accountId,
    }).dm?.sessionScope ?? "per-user"
  );
}
function resolveMatrixCurrentDmRoomId(params) {
  const sessionKey =
    parseThreadSessionSuffix(params.currentSessionKey).baseSessionKey ??
    params.currentSessionKey?.trim();
  if (!sessionKey) return;
  try {
    const currentSession = resolveMatrixStoredSessionMeta(
      getSessionEntry({
        storePath: resolveStorePath(params.cfg.session?.store, { agentId: params.agentId }),
        sessionKey,
      }),
    );
    if (!currentSession) return;
    if (currentSession.accountId && currentSession.accountId !== params.accountId) return;
    if (!currentSession.directUserId || currentSession.directUserId !== params.targetUserId) return;
    return currentSession.roomId;
  } catch {
    return;
  }
}
function resolveMatrixOutboundSessionRoute(params) {
  const target =
    resolveMatrixTargetIdentity(params.resolvedTarget?.to ?? params.target) ??
    resolveMatrixTargetIdentity(params.target);
  if (!target) return null;
  const effectiveAccountId = resolveEffectiveMatrixAccountId(params);
  const dmSessionScope = resolveMatrixDmSessionScope({
    cfg: params.cfg,
    accountId: effectiveAccountId,
  });
  const roomScopedDmId =
    target.kind === "user" && dmSessionScope === "per-room"
      ? resolveMatrixCurrentDmRoomId({
          cfg: params.cfg,
          agentId: params.agentId,
          accountId: effectiveAccountId,
          currentSessionKey: params.currentSessionKey,
          targetUserId: target.id,
        })
      : void 0;
  const peer =
    roomScopedDmId !== void 0
      ? {
          kind: "channel",
          id: roomScopedDmId,
        }
      : {
          kind: target.kind === "user" ? "direct" : "channel",
          id: target.id,
        };
  const chatType = target.kind === "user" ? "direct" : "channel";
  const from = target.kind === "user" ? `matrix:${target.id}` : `matrix:channel:${target.id}`;
  const to = `room:${roomScopedDmId ?? target.id}`;
  return buildThreadAwareOutboundSessionRoute({
    route: buildChannelOutboundSessionRoute({
      cfg: params.cfg,
      agentId: params.agentId,
      channel: "matrix",
      accountId: effectiveAccountId,
      recipientSessionExact:
        target.kind === "room"
          ? dmSessionScope === "per-room" && target.id.startsWith("!") && target.id.includes(":")
          : dmSessionScope === "per-user"
            ? isMatrixQualifiedUserId(target.id)
            : roomScopedDmId !== void 0,
      peer,
      chatType,
      from,
      to,
    }),
    replyToId: params.replyToId,
    threadId: params.threadId,
    currentSessionKey: params.currentSessionKey,
    normalizeThreadId: (threadId) => threadId,
    canRecoverCurrentThread: ({ route }) =>
      route.peer.kind !== "direct" || (params.cfg.session?.dmScope ?? "main") !== "main",
  });
}
//#endregion
//#region extensions/matrix/src/channel.ts
let matrixStartupLock = Promise.resolve();
const loadMatrixSetupWizard = createLazyRuntimeNamedExport(
  () => import("./setup-surface-T3kLPC3N.js"),
  "matrixSetupWizard",
);
const loadMatrixChannelRuntime = createLazyRuntimeNamedExport(
  () => import("./channel.runtime-DtzIBHjj.js"),
  "matrixChannelRuntime",
);
const loadMatrixDoctorModule = createLazyRuntimeModule(() => import("./doctor-BxGyTBh7.js"));
const meta = {
  id: "matrix",
  label: "Matrix",
  selectionLabel: "Matrix (plugin)",
  docsPath: "/channels/matrix",
  docsLabel: "matrix",
  blurb: "open protocol; configure a homeserver + access token.",
  order: 70,
  markdownCapable: true,
  quickstartAllowFrom: true,
};
function buildMatrixTrafficStatusSummary(snapshot) {
  return {
    lastInboundAt: snapshot?.lastInboundAt ?? null,
    lastOutboundAt: snapshot?.lastOutboundAt ?? null,
  };
}
const matrixDoctor = {
  dmAllowFromMode: "nestedOnly",
  groupModel: "sender",
  groupAllowFromFallbackToAllowFrom: false,
  warnOnEmptyGroupSenderAllowlist: true,
  legacyConfigRules,
  normalizeCompatibilityConfig,
  runConfigSequence: async ({ cfg, env, shouldRepair }) =>
    await (
      await loadMatrixDoctorModule()
    ).runMatrixDoctorSequence({
      cfg,
      env,
      shouldRepair,
    }),
  cleanStaleConfig: async ({ cfg }) =>
    await (await loadMatrixDoctorModule()).cleanStaleMatrixPluginConfig(cfg),
};
const listMatrixDirectoryPeersFromConfig = createResolvedDirectoryEntriesLister({
  kind: "user",
  resolveAccount: adaptScopedAccountAccessor(resolveMatrixAccount),
  resolveSources: (account) => [
    account.config.dm?.allowFrom ?? [],
    account.config.groupAllowFrom ?? [],
    ...Object.values(account.config.groups ?? account.config.rooms ?? {}).map(
      (room) => room.users ?? [],
    ),
  ],
  normalizeId: (entry) => {
    const raw = entry.replace(/^matrix:/i, "").trim();
    if (!raw || raw === "*") return null;
    const cleaned = normalizeLowercaseStringOrEmpty(raw).startsWith("user:")
      ? raw.slice(5).trim()
      : raw;
    return cleaned.startsWith("@") ? `user:${cleaned}` : cleaned;
  },
});
const listMatrixDirectoryGroupsFromConfig = createResolvedDirectoryEntriesLister({
  kind: "group",
  resolveAccount: adaptScopedAccountAccessor(resolveMatrixAccount),
  resolveSources: (account) => [Object.keys(account.config.groups ?? account.config.rooms ?? {})],
  normalizeId: (entry) => {
    const raw = entry.replace(/^matrix:/i, "").trim();
    if (!raw || raw === "*") return null;
    const lowered = normalizeLowercaseStringOrEmpty(raw);
    if (lowered.startsWith("room:") || lowered.startsWith("channel:")) return raw;
    return raw.startsWith("!") ? `room:${raw}` : raw;
  },
});
function projectMatrixConversationBinding(binding) {
  return {
    boundAt: binding.boundAt,
    lastActivityAt:
      typeof binding.metadata?.lastActivityAt === "number"
        ? binding.metadata.lastActivityAt
        : binding.boundAt,
    idleTimeoutMs:
      typeof binding.metadata?.idleTimeoutMs === "number" ? binding.metadata.idleTimeoutMs : void 0,
    maxAgeMs: typeof binding.metadata?.maxAgeMs === "number" ? binding.metadata.maxAgeMs : void 0,
  };
}
const resolveMatrixDmPolicy = createScopedDmSecurityResolver({
  channelKey: "matrix",
  resolvePolicy: (account) => account.config.dm?.policy,
  resolveAllowFrom: (account) => account.config.dm?.allowFrom,
  allowFromPathSuffix: "dm.",
  normalizeEntry: (raw) => normalizeMatrixUserId(raw),
});
const collectMatrixSecurityWarnings = createAllowlistProviderOpenWarningCollector({
  providerConfigPresent: (cfg) => cfg.channels?.matrix !== void 0,
  resolveGroupPolicy: (account) => account.config.groupPolicy,
  buildOpenWarning: {
    surface: "Matrix rooms",
    openBehavior: "allows any room to trigger (mention-gated)",
    remediation:
      'Set channels.matrix.groupPolicy="allowlist" + channels.matrix.groups (and optionally channels.matrix.groupAllowFrom) to restrict rooms',
  },
});
function resolveMatrixAccountConfigPath(accountId, field) {
  return accountId === "default"
    ? `channels.matrix.${field}`
    : `channels.matrix.accounts.${accountId}.${field}`;
}
function collectMatrixSecurityWarningsForAccount(params) {
  const warnings = collectMatrixSecurityWarnings(params);
  if (params.account.accountId !== "default") {
    const groupPolicyPath = resolveMatrixAccountConfigPath(params.account.accountId, "groupPolicy");
    const groupsPath = resolveMatrixAccountConfigPath(params.account.accountId, "groups");
    const groupAllowFromPath = resolveMatrixAccountConfigPath(
      params.account.accountId,
      "groupAllowFrom",
    );
    return warnings.map((warning) =>
      warning
        .replace("channels.matrix.groupPolicy", groupPolicyPath)
        .replace("channels.matrix.groups", groupsPath)
        .replace("channels.matrix.groupAllowFrom", groupAllowFromPath),
    );
  }
  if (params.account.config.autoJoin !== "always") return warnings;
  const autoJoinPath = resolveMatrixAccountConfigPath(params.account.accountId, "autoJoin");
  const autoJoinAllowlistPath = resolveMatrixAccountConfigPath(
    params.account.accountId,
    "autoJoinAllowlist",
  );
  return [
    ...warnings,
    `- Matrix invites: autoJoin="always" joins any invited room before message policy applies. Set ${autoJoinPath}="allowlist" + ${autoJoinAllowlistPath} (or ${autoJoinPath}="off") to restrict joins.`,
  ];
}
function normalizeMatrixAcpConversationId(conversationId) {
  const target = resolveMatrixTargetIdentity(conversationId);
  if (!target || target.kind !== "room") return null;
  return { conversationId: target.id };
}
function matchMatrixAcpConversation(params) {
  const binding = normalizeMatrixAcpConversationId(params.bindingConversationId);
  if (!binding) return null;
  if (binding.conversationId === params.conversationId)
    return {
      conversationId: params.conversationId,
      matchPriority: 2,
    };
  if (
    params.parentConversationId &&
    params.parentConversationId !== params.conversationId &&
    binding.conversationId === params.parentConversationId
  )
    return {
      conversationId: params.parentConversationId,
      matchPriority: 1,
    };
  return null;
}
function resolveMatrixCommandConversation(params) {
  const parentConversationId = [params.originatingTo, params.commandTo, params.fallbackTo]
    .map((candidate) => {
      const trimmed = candidate?.trim();
      if (!trimmed) return;
      const target = resolveMatrixTargetIdentity(trimmed);
      return target?.kind === "room" ? target.id : void 0;
    })
    .find((candidate) => Boolean(candidate));
  if (params.threadId)
    return {
      conversationId: params.threadId,
      ...(parentConversationId ? { parentConversationId } : {}),
    };
  return parentConversationId ? { conversationId: parentConversationId } : null;
}
function resolveMatrixDeliveryTarget(params) {
  const parentConversationId = params.parentConversationId?.trim();
  if (parentConversationId && parentConversationId !== params.conversationId.trim()) {
    const parentTarget = resolveMatrixTargetIdentity(parentConversationId);
    if (parentTarget?.kind === "room")
      return {
        to: `room:${parentTarget.id}`,
        threadId: params.conversationId.trim(),
      };
  }
  const conversationTarget = resolveMatrixTargetIdentity(params.conversationId);
  if (conversationTarget?.kind === "room") return { to: `room:${conversationTarget.id}` };
  return null;
}
const matrixChannelOutbound = {
  deliveryMode: "direct",
  chunker: chunkTextForOutbound,
  chunkerMode: "markdown",
  textChunkLimit: 4e3,
  sanitizeText: ({ text }) => sanitizeAssistantVisibleText(text),
  deliveryCapabilities: {
    durableFinal: {
      text: true,
      media: true,
      replyTo: true,
      thread: true,
      messageSendingHooks: true,
    },
  },
  presentationCapabilities: {
    supported: true,
    buttons: true,
    selects: true,
    context: true,
    divider: true,
    limits: {
      text: {
        markdownDialect: "markdown",
        supportsEdit: true,
      },
    },
  },
  shouldSuppressLocalPayloadPrompt: ({ cfg, accountId, payload }) =>
    shouldSuppressLocalMatrixExecApprovalPrompt({
      cfg,
      accountId,
      payload,
    }),
  ...createRuntimeOutboundDelegates({
    getRuntime: loadMatrixChannelRuntime,
    renderPresentation: {
      resolve: (runtime) => runtime.matrixOutbound.renderPresentation,
      unavailableMessage: "Matrix outbound presentation rendering is unavailable",
    },
    sendPayload: {
      resolve: (runtime) => runtime.matrixOutbound.sendPayload,
      unavailableMessage: "Matrix outbound payload delivery is unavailable",
    },
    sendText: {
      resolve: (runtime) => runtime.matrixOutbound.sendText,
      unavailableMessage: "Matrix outbound text delivery is unavailable",
    },
    sendMedia: {
      resolve: (runtime) => runtime.matrixOutbound.sendMedia,
      unavailableMessage: "Matrix outbound media delivery is unavailable",
    },
    sendPoll: {
      resolve: (runtime) => runtime.matrixOutbound.sendPoll,
      unavailableMessage: "Matrix outbound poll delivery is unavailable",
    },
  }),
};
const matrixMessageAdapter = createChannelMessageAdapterFromOutbound({
  id: "matrix",
  outbound: matrixChannelOutbound,
  live: {
    capabilities: {
      draftPreview: true,
      previewFinalization: true,
      progressUpdates: true,
      quietFinalization: true,
    },
    finalizer: {
      capabilities: {
        finalEdit: true,
        normalFallback: true,
        discardPending: true,
        previewReceipt: true,
      },
    },
  },
});
const matrixPlugin = createChatChannelPlugin({
  base: {
    id: "matrix",
    meta,
    setupWizard: createMatrixSetupWizardProxy(async () => ({
      matrixSetupWizard: await loadMatrixSetupWizard(),
    })),
    capabilities: {
      chatTypes: ["direct", "group", "thread"],
      polls: true,
      reactions: true,
      threads: true,
      media: true,
      tts: { voice: { synthesisTarget: "voice-note" } },
    },
    reload: { configPrefixes: ["channels.matrix"] },
    configSchema: MatrixChannelConfigSchema,
    config: {
      ...matrixConfigAdapter,
      isConfigured: (account) => account.configured,
      describeAccount: (account) =>
        describeAccountSnapshot({
          account,
          configured: account.configured,
          extra: { baseUrl: account.homeserver },
        }),
    },
    approvalCapability: matrixApprovalCapability,
    groups: {
      resolveRequireMention: resolveMatrixGroupRequireMention,
      resolveToolPolicy: resolveMatrixGroupToolPolicy,
    },
    conversationBindings: {
      supportsCurrentConversationBinding: true,
      defaultTopLevelPlacement,
      setIdleTimeoutBySessionKey: ({ targetSessionKey, accountId, idleTimeoutMs }) =>
        setMatrixThreadBindingIdleTimeoutBySessionKey({
          targetSessionKey,
          accountId: accountId ?? "",
          idleTimeoutMs,
        }).map(projectMatrixConversationBinding),
      setMaxAgeBySessionKey: ({ targetSessionKey, accountId, maxAgeMs }) =>
        setMatrixThreadBindingMaxAgeBySessionKey({
          targetSessionKey,
          accountId: accountId ?? "",
          maxAgeMs,
        }).map(projectMatrixConversationBinding),
    },
    messaging: {
      defaultMarkdownTableMode: "bullets",
      targetPrefixes: ["matrix"],
      normalizeTarget: normalizeMatrixMessagingTarget,
      resolveInboundConversation: ({ to, conversationId, threadId }) =>
        resolveMatrixInboundConversation({
          to,
          conversationId,
          threadId,
        }),
      resolveDeliveryTarget: ({ conversationId, parentConversationId }) =>
        resolveMatrixDeliveryTarget({
          conversationId,
          parentConversationId,
        }),
      resolveOutboundSessionRoute: (params) => resolveMatrixOutboundSessionRoute(params),
      targetResolver: {
        looksLikeId: (raw) => {
          const trimmed = raw.trim();
          if (!trimmed) return false;
          if (/^(matrix:)?[!#@]/i.test(trimmed)) return true;
          return trimmed.includes(":");
        },
        hint: "<room|alias|user>",
      },
    },
    directory: createChannelDirectoryAdapter({
      listPeers: async (params) => {
        return (await listMatrixDirectoryPeersFromConfig(params)).map((entry) => {
          const raw = entry.id.startsWith("user:") ? entry.id.slice(5) : entry.id;
          return !raw.startsWith("@") || !raw.includes(":")
            ? Object.assign({}, entry, { name: `incomplete id; expected @user:server` })
            : entry;
        });
      },
      listGroups: async (params) => await listMatrixDirectoryGroupsFromConfig(params),
      ...createRuntimeDirectoryLiveAdapter({
        getRuntime: loadMatrixChannelRuntime,
        listPeersLive: (runtime) => runtime.listMatrixDirectoryPeersLive,
        listGroupsLive: (runtime) => runtime.listMatrixDirectoryGroupsLive,
      }),
    }),
    resolver: matrixResolverAdapter,
    actions: matrixMessageActions,
    message: matrixMessageAdapter,
    secrets: {
      secretTargetRegistryEntries,
      collectRuntimeConfigAssignments,
    },
    setup: {
      ...matrixSetupAdapter,
      singleAccountKeysToMove,
      namedAccountPromotionKeys,
      resolveSingleAccountPromotionTarget,
    },
    bindings: {
      compileConfiguredBinding: ({ conversationId }) =>
        normalizeMatrixAcpConversationId(conversationId),
      matchInboundConversation: ({ compiledBinding, conversationId, parentConversationId }) =>
        matchMatrixAcpConversation({
          bindingConversationId: compiledBinding.conversationId,
          conversationId,
          parentConversationId,
        }),
      resolveCommandConversation: ({ threadId, originatingTo, commandTo, fallbackTo }) =>
        resolveMatrixCommandConversation({
          threadId,
          originatingTo,
          commandTo,
          fallbackTo,
        }),
    },
    status: createComputedAccountStatusAdapter({
      defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID),
      collectStatusIssues: (accounts) => collectStatusIssuesFromLastError("matrix", accounts),
      buildChannelSummary: ({ snapshot }) =>
        buildProbeChannelStatusSummary(snapshot, { baseUrl: snapshot.baseUrl ?? null }),
      probeAccount: async ({ account, timeoutMs, cfg }) =>
        await createMatrixProbeAccount({
          resolveMatrixAuth: async ({ cfg: cfgLocal, accountId }) =>
            (await loadMatrixChannelRuntime()).resolveMatrixAuth({
              cfg: cfgLocal,
              accountId,
            }),
          probeMatrix: async (params) =>
            await (await loadMatrixChannelRuntime()).probeMatrix(params),
        })({
          account,
          timeoutMs,
          cfg,
        }),
      resolveAccountSnapshot: ({ account, runtime }) => ({
        accountId: account.accountId,
        name: account.name,
        enabled: account.enabled,
        configured: account.configured,
        extra: {
          baseUrl: account.homeserver,
          lastProbeAt: runtime?.lastProbeAt ?? null,
          ...buildMatrixTrafficStatusSummary(runtime),
        },
      }),
    }),
    gateway: {
      startAccount: async (ctx) => {
        const account = ctx.account;
        ctx.setStatus({
          accountId: account.accountId,
          baseUrl: account.homeserver,
        });
        ctx.log?.info(
          `[${account.accountId}] starting provider (${account.homeserver ?? "matrix"})`,
        );
        const previousLock = matrixStartupLock;
        let releaseLock = () => {};
        matrixStartupLock = new Promise((resolve) => {
          releaseLock = resolve;
        });
        await previousLock;
        let monitorMatrixProvider;
        try {
          monitorMatrixProvider = (await import("./monitor-R54DjdwC.js")).monitorMatrixProvider;
        } finally {
          releaseLock();
        }
        return monitorMatrixProvider({
          runtime: ctx.runtime,
          channelRuntime: ctx.channelRuntime,
          abortSignal: ctx.abortSignal,
          mediaMaxMb: account.config.mediaMaxMb,
          initialSyncLimit: account.config.initialSyncLimit,
          replyToMode: account.config.replyToMode,
          accountId: account.accountId,
          setStatus: ctx.setStatus,
        });
      },
    },
    doctor: matrixDoctor,
    heartbeat: {
      sendTyping: async ({ cfg, to, accountId }) => {
        await (
          await loadMatrixChannelRuntime()
        ).sendTypingMatrix(to, true, {
          cfg,
          ...(accountId ? { accountId } : {}),
        });
      },
      clearTyping: async ({ cfg, to, accountId }) => {
        await (
          await loadMatrixChannelRuntime()
        ).sendTypingMatrix(to, false, {
          cfg,
          ...(accountId ? { accountId } : {}),
        });
      },
    },
  },
  security: {
    resolveDmPolicy: resolveMatrixDmPolicy,
    collectWarnings: projectAccountConfigWarningCollector(
      (cfg) => cfg,
      collectMatrixSecurityWarningsForAccount,
    ),
  },
  pairing: {
    text: createMatrixPairingText(
      async (to, message, options) =>
        await (await loadMatrixChannelRuntime()).sendMessageMatrix(to, message, options),
    ),
  },
  threading: {
    resolveReplyToMode: createScopedAccountReplyToModeResolver({
      resolveAccount: adaptScopedAccountAccessor(resolveMatrixAccountConfig),
      resolveReplyToMode: (account) => account.replyToMode,
    }),
    buildToolContext: ({ context, hasRepliedRef }) => {
      const currentTarget = context.To;
      return {
        currentChannelId: normalizeOptionalString(currentTarget),
        currentThreadTs: context.MessageThreadId != null ? String(context.MessageThreadId) : void 0,
        currentDirectUserId: resolveMatrixDirectUserId({
          from: context.From,
          to: context.To,
          chatType: context.ChatType,
        }),
        hasRepliedRef,
      };
    },
  },
  outbound: matrixChannelOutbound,
});
//#endregion
export { matrixPlugin as t };
