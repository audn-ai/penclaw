import { t as DEFAULT_ACCOUNT_ID } from "./account-id-C7N4Rwku.js";
import {
  i as resolveGoogleChatAccount,
  n as listGoogleChatAccountIds,
} from "./accounts-MI4x6Lvk.js";
import { t as CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY } from "./approval-handler-adapter-runtime-DjbKLbMW.js";
import {
  i as shouldSuppressLocalGoogleChatExecApprovalPrompt,
  n as isGoogleChatNativeApprovalClientEnabled,
  t as googleChatApprovalCapability,
} from "./approval-native-D5AVY9xv.js";
import "./channel-core-Z_rV5hXh.js";
import { n as GoogleChatConfigSchema } from "./bundled-channel-config-schema-DCnN0in2.js";
import {
  n as createGoogleChatPluginBase,
  t as GOOGLECHAT_CHANNEL_ID,
} from "./channel-base-RUfwdV4Q.js";
import {
  i as runPassiveAccountLifecycle,
  t as createAccountStatusSink,
} from "./channel-lifecycle.core-BZ1pethE.js";
import { n as createDangerousNameMatchingMutableAllowlistWarningCollector } from "./channel-policy-DXOn_tKS.js";
import "./channel-outbound-DlkFd7rO.js";
import { r as registerChannelRuntimeContext } from "./channel-runtime-context-gztTEkoq.js";
import {
  a as googlechatPairingTextAdapter,
  i as googlechatOutboundAdapter,
  n as googlechatGroupsAdapter,
  o as googlechatSecurityAdapter,
  r as googlechatMessageAdapter,
  s as googlechatThreadingAdapter,
  t as googlechatDirectoryAdapter,
} from "./channel.adapters-j6xkJ5Le.js";
import { r as buildChannelConfigSchema } from "./config-schema-qmCQZl6j.js";
import { i as createChatChannelPlugin } from "./core-V3U0lOIj.js";
import {
  n as normalizeCompatibilityConfig,
  t as legacyConfigRules,
} from "./doctor-contract-BAfPDY_a.js";
import { n as buildPassiveProbedChannelStatusSummary } from "./extension-shared-DqZe9psR.js";
import { i as createLazyRuntimeNamedExport } from "./lazy-runtime-B-Fc-m0I.js";
import {
  n as collectRuntimeConfigAssignments,
  r as secretTargetRegistryEntries,
} from "./secret-contract-DRBxSaAM.js";
import {
  d as createDefaultChannelRuntimeState,
  u as createComputedAccountStatusAdapter,
} from "./status-helpers-SdoCNDDu.js";
import {
  a as resolveGoogleChatOutboundSessionRoute,
  i as normalizeGoogleChatTarget,
  n as isGoogleChatSpaceTarget,
  r as isGoogleChatUserTarget,
} from "./targets-CXCvMn2h.js";
import { t as extractToolSend } from "./tool-send-DlIp2cBO.js";
//#region extensions/googlechat/src/doctor.ts
function asObjectRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}
function isGoogleChatMutableAllowEntry(raw) {
  const text = raw.trim();
  if (!text || text === "*") return false;
  const withoutPrefix = text.replace(/^(googlechat|google-chat|gchat):/i, "").trim();
  if (!withoutPrefix) return false;
  return withoutPrefix.replace(/^users\//i, "").includes("@");
}
const collectGoogleChatMutableAllowlistWarnings =
  createDangerousNameMatchingMutableAllowlistWarningCollector({
    channel: "googlechat",
    detector: isGoogleChatMutableAllowEntry,
    collectLists: (scope) => {
      const lists = [
        {
          pathLabel: `${scope.prefix}.groupAllowFrom`,
          list: scope.account.groupAllowFrom,
        },
      ];
      const dm = asObjectRecord(scope.account.dm);
      if (dm)
        lists.push({
          pathLabel: `${scope.prefix}.dm.allowFrom`,
          list: dm.allowFrom,
        });
      const groups = asObjectRecord(scope.account.groups);
      if (groups)
        for (const [groupKey, groupRaw] of Object.entries(groups)) {
          const group = asObjectRecord(groupRaw);
          if (!group) continue;
          lists.push({
            pathLabel: `${scope.prefix}.groups.${groupKey}.users`,
            list: group.users,
          });
        }
      return lists;
    },
  });
//#endregion
//#region extensions/googlechat/src/gateway.ts
const loadGoogleChatChannelRuntime$1 = createLazyRuntimeNamedExport(
  () => import("./channel.runtime-2a6Fq_xA.js"),
  "googleChatChannelRuntime",
);
async function startGoogleChatGatewayAccount(ctx) {
  const account = ctx.account;
  const statusSink = createAccountStatusSink({
    accountId: account.accountId,
    setStatus: ctx.setStatus,
  });
  ctx.log?.info?.(`[${account.accountId}] starting Google Chat webhook`);
  const { resolveGoogleChatWebhookPath, startGoogleChatMonitor } =
    await loadGoogleChatChannelRuntime$1();
  statusSink({
    running: true,
    lastStartAt: Date.now(),
    webhookPath: resolveGoogleChatWebhookPath({ account }),
    audienceType: account.config.audienceType,
    audience: account.config.audience,
  });
  let stopped = false;
  const markStopped = () => {
    if (stopped) return;
    stopped = true;
    statusSink({
      running: false,
      lastStopAt: Date.now(),
    });
  };
  if (
    isGoogleChatNativeApprovalClientEnabled({
      cfg: ctx.cfg,
      accountId: account.accountId,
    })
  )
    registerChannelRuntimeContext({
      channelRuntime: ctx.channelRuntime,
      channelId: "googlechat",
      accountId: account.accountId,
      capability: CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY,
      context: { account },
      abortSignal: ctx.abortSignal,
    });
  try {
    await runPassiveAccountLifecycle({
      abortSignal: ctx.abortSignal,
      start: async () =>
        await startGoogleChatMonitor({
          account,
          config: ctx.cfg,
          runtime: ctx.runtime,
          abortSignal: ctx.abortSignal,
          webhookPath: account.config.webhookPath,
          webhookUrl: account.config.webhookUrl,
          statusSink,
        }),
      stop: async (unregister) => {
        unregister?.();
      },
      onStop: async () => {
        markStopped();
      },
    });
  } catch (error) {
    markStopped();
    throw error;
  }
}
//#endregion
//#region extensions/googlechat/src/channel.ts
const loadGoogleChatChannelRuntime = createLazyRuntimeNamedExport(
  () => import("./channel.runtime-2a6Fq_xA.js"),
  "googleChatChannelRuntime",
);
const googlechatActions = {
  describeMessageTool: ({ cfg, accountId }) => {
    if (
      (accountId
        ? [
            resolveGoogleChatAccount({
              cfg,
              accountId,
            }),
          ].filter((account) => account.enabled && account.credentialSource !== "none")
        : listGoogleChatAccountIds(cfg)
            .map((id) =>
              resolveGoogleChatAccount({
                cfg,
                accountId: id,
              }),
            )
            .filter((account) => account.enabled && account.credentialSource !== "none")
      ).length === 0
    )
      return null;
    return { actions: ["send"] };
  },
  supportsAction: ({ action }) => action === "send",
  extractToolSend: ({ args }) => extractToolSend(args, "sendMessage"),
  handleAction: async (ctx) => {
    const { googlechatMessageActions } = await import("./actions-4ueky70r.js");
    if (!googlechatMessageActions.handleAction)
      throw new Error("Google Chat actions are not available.");
    return await googlechatMessageActions.handleAction(ctx);
  },
};
const googlechatPlugin = createChatChannelPlugin({
  base: {
    ...createGoogleChatPluginBase({
      configSchema: buildChannelConfigSchema(GoogleChatConfigSchema),
    }),
    approvalCapability: googleChatApprovalCapability,
    secrets: {
      secretTargetRegistryEntries,
      collectRuntimeConfigAssignments,
    },
    groups: googlechatGroupsAdapter,
    messaging: {
      targetPrefixes: ["googlechat", "google-chat", "gchat"],
      normalizeTarget: normalizeGoogleChatTarget,
      resolveOutboundSessionRoute: (params) => resolveGoogleChatOutboundSessionRoute(params),
      targetResolver: {
        looksLikeId: (raw, normalized) => {
          const value = normalized ?? raw.trim();
          return isGoogleChatSpaceTarget(value) || isGoogleChatUserTarget(value);
        },
        hint: "<spaces/{space}|users/{user}>",
      },
    },
    directory: googlechatDirectoryAdapter,
    message: googlechatMessageAdapter,
    resolver: {
      resolveTargets: async ({ inputs, kind }) => {
        return inputs.map((input) => {
          const normalized = normalizeGoogleChatTarget(input);
          if (!normalized)
            return {
              input,
              resolved: false,
              note: "empty target",
            };
          if (kind === "user" && isGoogleChatUserTarget(normalized))
            return {
              input,
              resolved: true,
              id: normalized,
            };
          if (kind === "group" && isGoogleChatSpaceTarget(normalized))
            return {
              input,
              resolved: true,
              id: normalized,
            };
          return {
            input,
            resolved: false,
            note: "use spaces/{space} or users/{user}",
          };
        });
      },
    },
    actions: googlechatActions,
    doctor: {
      dmAllowFromMode: "nestedOnly",
      groupModel: "route",
      groupAllowFromFallbackToAllowFrom: false,
      warnOnEmptyGroupSenderAllowlist: false,
      legacyConfigRules,
      normalizeCompatibilityConfig,
      collectMutableAllowlistWarnings: collectGoogleChatMutableAllowlistWarnings,
    },
    status: createComputedAccountStatusAdapter({
      defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID),
      collectStatusIssues: (accounts) =>
        accounts.flatMap((entry) => {
          const accountId = entry.accountId ?? "default";
          const enabled = entry.enabled !== false;
          const configured = entry.configured === true;
          if (!enabled || !configured) return [];
          const issues = [];
          if (!entry.audience)
            issues.push({
              channel: GOOGLECHAT_CHANNEL_ID,
              accountId,
              kind: "config",
              message: "Google Chat audience is missing (set channels.googlechat.audience).",
              fix: "Set channels.googlechat.audienceType and channels.googlechat.audience.",
            });
          if (!entry.audienceType)
            issues.push({
              channel: GOOGLECHAT_CHANNEL_ID,
              accountId,
              kind: "config",
              message: "Google Chat audienceType is missing (app-url or project-number).",
              fix: "Set channels.googlechat.audienceType and channels.googlechat.audience.",
            });
          return issues;
        }),
      buildChannelSummary: ({ snapshot }) =>
        buildPassiveProbedChannelStatusSummary(snapshot, {
          credentialSource: snapshot.credentialSource ?? "none",
          audienceType: snapshot.audienceType ?? null,
          audience: snapshot.audience ?? null,
          webhookPath: snapshot.webhookPath ?? null,
          webhookUrl: snapshot.webhookUrl ?? null,
        }),
      probeAccount: async ({ account }) =>
        (await loadGoogleChatChannelRuntime()).probeGoogleChat(account),
      resolveAccountSnapshot: ({ account }) => ({
        accountId: account.accountId,
        name: account.name,
        enabled: account.enabled,
        configured: account.credentialSource !== "none",
        extra: {
          credentialSource: account.credentialSource,
          audienceType: account.config.audienceType,
          audience: account.config.audience,
          webhookPath: account.config.webhookPath,
          webhookUrl: account.config.webhookUrl,
          dmPolicy: account.config.dm?.policy ?? "pairing",
        },
      }),
    }),
    gateway: { startAccount: startGoogleChatGatewayAccount },
  },
  pairing: { text: googlechatPairingTextAdapter },
  security: googlechatSecurityAdapter,
  threading: googlechatThreadingAdapter,
  outbound: {
    ...googlechatOutboundAdapter,
    base: {
      ...googlechatOutboundAdapter.base,
      shouldSuppressLocalPayloadPrompt: ({ cfg, accountId, payload, hint }) =>
        shouldSuppressLocalGoogleChatExecApprovalPrompt({
          cfg,
          accountId,
          payload,
          hint,
        }),
    },
  },
});
//#endregion
export { googlechatPlugin as t };
