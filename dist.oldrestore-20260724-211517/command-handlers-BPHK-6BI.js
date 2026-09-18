import crypto from "node:crypto";
import { a as resolveAgentDir } from "./agent-scope-config-DVIR1nBa.js";
import { y as resolveSessionAgentIds } from "./agent-scope-y9xQv_q1.js";
import { n as resolveCodexBindingAppServerConnection } from "./binding-connection-D_wKlTHe.js";
import { t as CODEX_CONTROL_METHODS } from "./capabilities-BTxju7z9.js";
import {
  a as formatComputerUseStatus,
  c as formatSkills,
  i as formatCodexStatus,
  l as formatThreads,
  n as formatAccount,
  o as formatList,
  r as formatCodexDisplayText,
  s as formatModels,
  t as buildHelp,
  u as readString$1,
} from "./command-formatters-BGtw1ew1.js";
import {
  c as formatCodexCliSessions,
  i as safeCodexControlRequest,
  n as readCodexStatusProbes,
  r as requestOptions,
  t as codexControlRequest,
} from "./command-rpc-DMq_WAk0.js";
import {
  i as readCodexComputerUseStatus,
  n as installCodexComputerUse,
} from "./computer-use-Cov7_CRJ.js";
import { c as isCodexFastServiceTier } from "./config-C1imjxk6.js";
import {
  i as readCodexConversationBindingData,
  n as createCodexConversationBindingData,
  o as resolveCodexDefaultWorkspaceDir,
  t as createCodexCliNodeConversationBindingData,
} from "./conversation-binding-data-xW0riOKv.js";
import {
  a as setCodexConversationFastMode,
  c as steerCodexConversationTurn,
  d as CODEX_NATIVE_EXECUTION_AUTH_ERROR,
  f as canMutateCodexHost,
  i as readCodexConversationActiveTurn,
  l as stopCodexConversationTurn,
  n as parseCodexFastModeArg,
  o as setCodexConversationModel,
  r as parseCodexPermissionsModeArg,
  s as setCodexConversationPermissions,
  t as formatPermissionsMode,
} from "./conversation-control-D3Hmz0X5.js";
import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import "./number-runtime-B-n-wjMn.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./text-utility-runtime-CJESZCN5.js";
import {
  a as isModelSelectionLocked,
  t as MODEL_SELECTION_LOCKED_MESSAGE,
} from "./model-overrides-BlzAR7Nc.js";
import "./routing-CwvmVRHd.js";
import { n as findNormalizedProviderValue } from "./model-selection-normalize-BoKGJiBx.js";
import "./model-session-runtime-C8Tj7-5X.js";
import "./agent-runtime-BiQiwmwD.js";
import { t as listAllCodexAppServerModels } from "./models-D8uZmu75.js";
import { b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
import {
  i as resolveAuthProfileOrder,
  r as resolveAuthProfileEligibility,
} from "./order-BNCpk81x.js";
import { i as isJsonObject } from "./protocol-BMifTfdW.js";
import { n as assertCodexThreadResumeResponse } from "./protocol-validators-CfDblFS1.js";
import { s as summarizeCodexAccountUsage } from "./rate-limits-CGMwC7L1.js";
import {
  n as resolveCodexNativeExecutionBlock,
  r as resolveCodexNativeSandboxBlock,
} from "./sandbox-guard-D4QOS1Tr.js";
import {
  h as sessionBindingIdentity,
  i as bindingStoreKey,
  l as normalizeCodexAppServerBindingModelProvider,
  p as reclaimCurrentCodexSessionGeneration,
  r as assertCodexBindingMayBeReplaced,
} from "./session-binding-CxW6VTON.js";
import { c as parseAgentSessionKey } from "./session-key-utils-B8sNp9l4.js";
import { m as resolveStorePath, r as getSessionEntry } from "./session-store-runtime-BwE6SlGz.js";
import { T as resolveCodexAppServerAuthProfileIdForAgent } from "./shared-client-a36Mluj-.js";
import { i as ensureAuthProfileStore } from "./store-B7DoDdVM.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { p as normalizeUniqueStringEntries } from "./string-normalization-CRyoFBPt.js";
import { o as resolveProfileUnusableUntilForDisplay } from "./usage-BZgGbRoq.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region extensions/codex/src/command-account.ts
const OPENAI_PROVIDER_ID = "openai";
const OPENAI_CODEX_PROVIDER_ID = OPENAI_PROVIDER_ID;
async function readCodexAccountAuthOverview(params) {
  const config = params.ctx.config;
  const agentDir = params.agentDir;
  const store = ensureAuthProfileStore(agentDir, {
    allowKeychainPrompt: false,
    config,
  });
  const { order, explicit: explicitOrder } = resolveDisplayAuthOrder({
    config,
    store,
  });
  if (order.length === 0) return;
  const now = Date.now();
  const activeProfileId = resolveActiveProfileId({
    store,
    order,
    explicitOrder,
    config,
    account: params.account,
    limits: params.limits,
    now,
  });
  const subscriptionProfileId = order.find((profileId) =>
    isChatGptSubscriptionProfile(store.profiles[profileId]),
  );
  const activeIsSubscription =
    activeProfileId !== void 0 && isChatGptSubscriptionProfile(store.profiles[activeProfileId]);
  const activeUsage =
    activeIsSubscription && params.limits.ok
      ? summarizeCodexAccountUsage(params.limits.value, now)
      : void 0;
  const subscriptionUsage =
    subscriptionProfileId && (!activeIsSubscription || subscriptionProfileId !== activeProfileId)
      ? await readSubscriptionUsage({
          ...params,
          agentDir,
          config,
          subscriptionProfileId,
          now,
        })
      : activeUsage;
  if (!params.account.ok && !params.limits.ok && !subscriptionUsage) return;
  const rows = order.map((profileId, index) =>
    buildProfileRow({
      store,
      config,
      profileId,
      activeProfileId,
      activeIndex: activeProfileId ? order.indexOf(activeProfileId) : -1,
      index,
      now,
      usage: profileId === subscriptionProfileId ? subscriptionUsage : void 0,
    }),
  );
  const activeRow = rows.find((row) => row.active);
  if (!activeRow)
    return {
      currentLine: "OpenAI credentials: no working credential",
      orderTitle: "Auth order",
      rows,
    };
  const activeIsApiKey = store.profiles[activeRow.profileId]?.type === "api_key";
  const subscriptionLabel = subscriptionProfileId
    ? formatProfileLabel(subscriptionProfileId, store.profiles[subscriptionProfileId])
    : activeIsSubscription
      ? activeRow.label
      : void 0;
  const subscriptionUsageLine = formatSubscriptionUsageLine(subscriptionUsage);
  return {
    ...(activeIsApiKey ? { currentLine: buildApiKeyActiveLine(activeRow, subscriptionUsage) } : {}),
    ...(subscriptionLabel ? { subscriptionLabel } : {}),
    ...(subscriptionUsageLine ? { subscriptionUsage: subscriptionUsageLine } : {}),
    orderTitle: "Auth order",
    rows,
  };
}
function resolveDisplayAuthOrder(params) {
  const codexOrder =
    resolveOrder(params.store.order, OPENAI_CODEX_PROVIDER_ID) ??
    resolveOrder(params.config?.auth?.order, OPENAI_CODEX_PROVIDER_ID);
  if (codexOrder && codexOrder.length > 0)
    return {
      order: normalizeUniqueStringEntries(codexOrder),
      explicit: true,
    };
  return {
    order: resolveAuthProfileOrder({
      cfg: params.config,
      store: params.store,
      provider: OPENAI_CODEX_PROVIDER_ID,
    }),
    explicit: hasExplicitOpenAiAuthOrder(params),
  };
}
function hasExplicitOpenAiAuthOrder(params) {
  const sources = [params.store.order, params.config?.auth?.order];
  for (const source of sources) {
    const codex = resolveOrder(source, OPENAI_CODEX_PROVIDER_ID);
    if (codex && codex.length > 0) return true;
    const openai = resolveOrder(source, OPENAI_PROVIDER_ID);
    if (openai && openai.length > 0) return true;
  }
  return false;
}
function resolveOrder(order, provider) {
  return findNormalizedProviderValue(order, provider);
}
function resolveActiveProfileId(params) {
  const liveProfileId = resolveLiveAccountProfileId({
    account: params.account,
    store: params.store,
    order: params.order,
  });
  if (liveProfileId) return liveProfileId;
  if (params.explicitOrder)
    return params.order.find(
      (profileId) =>
        isActiveProfileCandidate(params, profileId) &&
        resolveAuthProfileEligibility({
          cfg: params.config,
          store: params.store,
          provider: OPENAI_CODEX_PROVIDER_ID,
          profileId,
          now: params.now,
        }).eligible,
    );
  const lastGood = [
    params.store.lastGood?.[OPENAI_PROVIDER_ID],
    params.store.lastGood?.[OPENAI_CODEX_PROVIDER_ID],
  ].find(
    (profileId) =>
      typeof profileId === "string" &&
      params.order.includes(profileId) &&
      isActiveProfileCandidate(params, profileId),
  );
  if (lastGood) return lastGood;
  const mostRecent = params.order
    .map((profileId) => ({
      profileId,
      lastUsed: params.store.usageStats?.[profileId]?.lastUsed ?? 0,
    }))
    .filter((entry) => entry.lastUsed > 0 && isActiveProfileCandidate(params, entry.profileId))
    .toSorted((left, right) => right.lastUsed - left.lastUsed)[0]?.profileId;
  if (mostRecent) return mostRecent;
  if (shouldInferApiKeyActiveFromRateLimitProbe(params.limits)) {
    const apiKeyProfile = params.order.find(
      (profileId) => params.store.profiles[profileId]?.type === "api_key",
    );
    if (apiKeyProfile) return apiKeyProfile;
  }
  return resolveAuthProfileOrder({
    cfg: params.config,
    store: params.store,
    provider: OPENAI_CODEX_PROVIDER_ID,
  })[0];
}
function isActiveProfileCandidate(params, profileId) {
  return !isActiveUntil(
    resolveProfileUnusableUntilForDisplay(params.store, profileId) ?? void 0,
    params.now,
  );
}
function resolveLiveAccountProfileId(params) {
  if (!params.account.ok || !isJsonObject(params.account.value)) return;
  const account = isJsonObject(params.account.value.account)
    ? params.account.value.account
    : params.account.value;
  const type = readString(account, "type")?.toLowerCase();
  if (type === "chatgpt") {
    const email = readString(account, "email")?.toLowerCase();
    const firstSubscription = params.order.find((profileId) =>
      isChatGptSubscriptionProfile(params.store.profiles[profileId]),
    );
    if (!email) return firstSubscription;
    return (
      params.order.find((profileId) => {
        const credential = params.store.profiles[profileId];
        if (!credential || !isChatGptSubscriptionProfile(credential)) return false;
        return (
          (
            credential.email?.trim().toLowerCase() ?? extractEmailFromProfileId(profileId)
          )?.toLowerCase() === email
        );
      }) ?? firstSubscription
    );
  }
  if (type === "apikey" || type === "api_key")
    return params.order.find((profileId) => params.store.profiles[profileId]?.type === "api_key");
}
function shouldInferApiKeyActiveFromRateLimitProbe(limits) {
  return !limits.ok && limits.error.toLowerCase().includes("chatgpt authentication required");
}
async function readSubscriptionUsage(params) {
  const limits = await params.safeCodexControlRequest(
    params.pluginConfig,
    CODEX_CONTROL_METHODS.rateLimits,
    void 0,
    {
      config: params.config,
      agentDir: params.agentDir,
      authProfileId: params.subscriptionProfileId,
      isolated: true,
    },
  );
  if (!limits.ok) return;
  return summarizeCodexAccountUsage(limits.value, params.now);
}
function buildProfileRow(params) {
  const credential = params.store.profiles[params.profileId];
  const label = formatProfileLabel(params.profileId, credential);
  const kind = formatProfileKind(credential);
  const active = params.profileId === params.activeProfileId;
  const status = active
    ? "active now"
    : params.usage?.blocked
      ? formatUsageBlockedStatus(params.usage)
      : describeInactiveProfileStatus({
          store: params.store,
          config: params.config,
          profileId: params.profileId,
          credential,
          now: params.now,
          afterActive: params.activeIndex >= 0 && params.index > params.activeIndex,
        });
  return {
    profileId: params.profileId,
    label,
    kind,
    status,
    active,
    ...(credential?.type === "api_key" && active ? { billingNote: "billed per token" } : {}),
    ...(params.usage?.usageLine ? { usage: params.usage.usageLine } : {}),
  };
}
function formatUsageBlockedStatus(usage) {
  return usage.blocked ? "rate-limited" : "available if needed";
}
function describeInactiveProfileStatus(params) {
  const stats = params.store.usageStats?.[params.profileId];
  const blockedUntil = stats?.blockedUntil;
  if (isActiveUntil(blockedUntil, params.now))
    return `rate-limited - resets ${formatRelativeReset(blockedUntil, params.now)}`;
  if (
    isActiveUntil(
      resolveProfileUnusableUntilForDisplay(params.store, params.profileId) ?? void 0,
      params.now,
    )
  )
    return describeFailureStatus(stats?.disabledReason ?? stats?.cooldownReason, params.credential);
  const eligibility = resolveAuthProfileEligibility({
    cfg: params.config,
    store: params.store,
    provider: OPENAI_CODEX_PROVIDER_ID,
    profileId: params.profileId,
    now: params.now,
  });
  if (!eligibility.eligible)
    return describeEligibilityStatus(eligibility.reasonCode, params.credential);
  return "available if needed";
}
function buildApiKeyActiveLine(activeRow, subscriptionUsage) {
  if (subscriptionUsage?.blocked) {
    const switchBack = subscriptionUsage.blockedResetRelative
      ? ` · switches back ${subscriptionUsage.blockedResetRelative}`
      : " · switches back automatically";
    return `Now using: ${activeRow.label} - subscription rate-limited${switchBack}`;
  }
  return `Now using: ${activeRow.label} - subscription unavailable · switches back automatically`;
}
function formatSubscriptionUsageLine(usage) {
  if (!usage) return;
  const parts = usage.usageLine ? [formatUsageLineForDisplay(usage.usageLine)] : [];
  if (usage.blockedResetRelative) parts.push(`Resets ${usage.blockedResetRelative}`);
  return parts.length > 0 ? parts.join(" · ") : void 0;
}
function formatUsageLineForDisplay(value) {
  return value.replace(/^weekly\b/u, "Weekly").replace(/\bshort-term\b/u, "Short-term");
}
function readString(record, key) {
  const value = record[key];
  return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function isChatGptSubscriptionProfile(credential) {
  return credential?.type === "oauth" || credential?.type === "token";
}
function formatProfileKind(credential) {
  if (!credential) return "credential";
  if (isChatGptSubscriptionProfile(credential)) return "ChatGPT subscription";
  if (credential.type === "api_key") return "API key";
  return "credential";
}
function formatProfileLabel(profileId, credential) {
  const tail = profileId.includes(":") ? profileId.slice(profileId.indexOf(":") + 1) : profileId;
  const displayName = credential?.displayName?.trim();
  if (displayName)
    return credential?.type === "api_key"
      ? simplifyApiKeyDisplayName(displayName, tail)
      : displayName;
  const email = credential?.email?.trim() ?? extractEmailFromProfileId(profileId);
  if (email) return email;
  if (credential?.type === "api_key") return tail || "API key";
  return humanizeProfileTail(tail);
}
function simplifyApiKeyDisplayName(value, tail) {
  const stripped = value.replace(/^OpenAI\s+/iu, "").trim();
  if (tail && stripped.toLowerCase() === humanizeApiKeyProfileTail(tail).toLowerCase()) return tail;
  return stripped || value;
}
function humanizeApiKeyProfileTail(tail) {
  const words = splitProfileTail(tail);
  const hasBackup = words.includes("backup");
  return [
    words
      .filter((word) => word !== "api" && word !== "key" && word !== "backup")
      .map(titleCase)
      .join(" "),
    "API key",
    hasBackup ? "backup" : "",
  ]
    .filter(Boolean)
    .join(" ");
}
function humanizeProfileTail(tail) {
  const words = splitProfileTail(tail);
  return words.length > 0 ? words.map(titleCase).join(" ") : tail;
}
function splitProfileTail(tail) {
  return tail
    .replace(/[_\s]+/gu, "-")
    .split("-")
    .map((word) => word.trim().toLowerCase())
    .filter(Boolean);
}
function titleCase(value) {
  return value ? `${value[0]?.toUpperCase() ?? ""}${value.slice(1)}` : value;
}
function extractEmailFromProfileId(profileId) {
  const tail = profileId.includes(":") ? profileId.slice(profileId.indexOf(":") + 1) : profileId;
  return /^[^\s@<>()[\]`]+@[^\s@<>()[\]`]+\.[^\s@<>()[\]`]+$/.test(tail) ? tail : void 0;
}
function describeFailureStatus(reason, credential) {
  if (reason === "auth" || reason === "auth_permanent" || reason === "session_expired")
    return credential?.type === "api_key" ? "auth failed - check key" : "sign-in expired";
  if (reason === "billing") return "billing unavailable";
  if (reason === "rate_limit") return "rate-limited";
  return "temporarily unavailable";
}
function describeEligibilityStatus(reason, credential) {
  if (reason === "profile_missing" || reason === "missing_credential")
    return credential?.type === "api_key" ? "not configured" : "sign-in required";
  if (reason === "expired" || reason === "invalid_expires") return "sign-in expired";
  if (reason === "unresolved_ref") return "credential unavailable";
  if (reason === "provider_mismatch") return "wrong provider";
  if (reason === "mode_mismatch") return "wrong credential type";
  return "unavailable";
}
function isActiveUntil(value, now) {
  return typeof value === "number" && Number.isFinite(value) && value > now;
}
function formatRelativeReset(untilMs, nowMs) {
  const durationMs = Math.max(1e3, untilMs - nowMs);
  const minuteMs = 6e4;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;
  if (durationMs < hourMs) {
    const minutes = Math.ceil(durationMs / minuteMs);
    return `in ${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  }
  if (durationMs < dayMs) {
    const hours = Math.ceil(durationMs / hourMs);
    return `in ${hours} ${hours === 1 ? "hour" : "hours"}`;
  }
  const days = Math.ceil(durationMs / dayMs);
  return `in ${days} ${days === 1 ? "day" : "days"}`;
}
//#endregion
//#region extensions/codex/src/command-diagnostics-state.ts
/** Runtime state for diagnostics upload throttling and confirmation handshakes. */
const codexDiagnosticsFeedbackState = {
  lastUploadByThread: /* @__PURE__ */ new Map(),
  lastUploadByScope: /* @__PURE__ */ new Map(),
  pendingConfirmations: /* @__PURE__ */ new Map(),
  pendingTokensByScope: /* @__PURE__ */ new Map(),
  clear() {
    this.lastUploadByThread.clear();
    this.lastUploadByScope.clear();
    this.pendingConfirmations.clear();
    this.pendingTokensByScope.clear();
  },
};
//#endregion
//#region extensions/codex/src/command-presentation.ts
function buildCodexCommandPickerPresentation(title, prompt, buttons) {
  return {
    title,
    blocks: [
      {
        type: "text",
        text: prompt,
      },
      {
        type: "buttons",
        buttons: buttons.map((button) => ({
          label: button.label,
          action: {
            type: "command",
            command: button.command,
          },
        })),
      },
    ],
  };
}
//#endregion
//#region extensions/codex/src/command-plugins-management.ts
const POLICY_REFRESH_HINT =
  "New Codex conversations pick this up automatically. Use /new or /reset to refresh the current one.";
async function handleCodexPluginsSubcommand(ctx, rest, io) {
  const [verb = "list", ...args] = rest;
  const normalized = verb.toLowerCase();
  if (normalized === "menu") {
    if (args.length > 0) return { text: "Usage: /codex plugins menu" };
    return buildPluginsMenuReply();
  }
  if (normalized === "help") {
    if (args.length > 0) return { text: "Usage: /codex plugins help" };
    return { text: buildPluginsHelp() };
  }
  if (normalized === "list") {
    if (args.length > 0) return { text: "Usage: /codex plugins list" };
    const current = await io.readConfig();
    return {
      text: formatPluginList(current.plugins ?? {}, { globalEnabled: current.enabled === true }),
    };
  }
  const target = args[0];
  if (normalized === "enable" || normalized === "disable") {
    if (args.length === 0) return buildPluginNamePickerReply(normalized, await io.readConfig());
    if (!target || args.length > 1) return { text: `Usage: /codex plugins ${normalized} <name>` };
    if (!canMutateCodexHost(ctx))
      return {
        text: `Only an owner or operator.admin gateway client can run /codex plugins ${normalized}.`,
      };
    const wantEnabled = normalized === "enable";
    if (!((await io.readConfig()).plugins ?? {})[target])
      return {
        text: `Codex sub-plugin '${formatCodexDisplayText(target)}' is not configured. Run '/codex plugins list' to see configured plugins.`,
      };
    await io.mutate((block) => {
      if (wantEnabled) block.enabled = true;
      block.plugins ??= {};
      block.plugins[target] = {
        ...block.plugins[target],
        enabled: wantEnabled,
      };
    });
    return {
      text: `${formatCodexDisplayText(target)}: ${wantEnabled ? "enabled" : "disabled"} in openclaw.json. ${POLICY_REFRESH_HINT}`,
    };
  }
  return {
    text: `Unknown /codex plugins subcommand: ${formatCodexDisplayText(verb)}\n\n${buildPluginsHelp()}`,
  };
}
function buildPluginsMenuReply() {
  return {
    text: [
      "Codex sub-plugins. Pick a sub-action or type:",
      "",
      "  1. /codex plugins list",
      "  2. /codex plugins enable",
      "  3. /codex plugins disable",
      "  4. /codex plugins help",
      "",
      "Type '/codex' to go back to the main menu.",
    ].join("\n"),
    presentation: buildCodexCommandPickerPresentation(
      "Codex sub-plugins",
      "Pick a Codex sub-plugin action:",
      [
        {
          label: "list",
          command: "/codex plugins list",
        },
        {
          label: "enable",
          command: "/codex plugins enable",
        },
        {
          label: "disable",
          command: "/codex plugins disable",
        },
        {
          label: "help",
          command: "/codex plugins help",
        },
        {
          label: "back",
          command: "/codex",
        },
      ],
    ),
  };
}
function buildPluginNamePickerReply(verb, current) {
  const globalEnabled = current.enabled === true;
  const eligible = Object.entries(current.plugins ?? {})
    .toSorted(([left], [right]) => left.localeCompare(right))
    .filter(([, entry]) => {
      const effectivelyEnabled = globalEnabled && entry.enabled !== false;
      return verb === "disable" ? effectivelyEnabled : !effectivelyEnabled;
    });
  if (eligible.length === 0)
    return {
      text: [
        `No configured ${verb === "enable" ? "disabled" : "enabled"} Codex sub-plugins found.`,
        "",
        "Type '/codex plugins list' to inspect configured sub-plugins.",
        "Type '/codex plugins menu' to go back to the plugins menu.",
      ].join("\n"),
      presentation: buildCodexCommandPickerPresentation(
        "Codex sub-plugins",
        "Pick another Codex sub-plugin action:",
        [
          {
            label: "list",
            command: "/codex plugins list",
          },
          {
            label: "back",
            command: "/codex plugins menu",
          },
        ],
      ),
    };
  const buttons = [
    ...eligible.map(([key]) => ({
      label: formatCodexDisplayText(key),
      command: `/codex plugins ${verb} ${key}`,
    })),
    {
      label: "back",
      command: "/codex plugins menu",
    },
  ];
  return {
    text: [
      `Codex sub-plugins to ${verb}. Pick one or type:`,
      "",
      ...eligible.map(([key], index) => `  ${index + 1}. /codex plugins ${verb} ${key}`),
      "",
      ...(verb === "enable" && !globalEnabled
        ? [
            "Global codexPlugins.enabled is off; enabling one configured sub-plugin turns it on.",
            "",
          ]
        : []),
      "Type '/codex plugins menu' to go back to the plugins menu.",
    ].join("\n"),
    presentation: buildCodexCommandPickerPresentation(
      "Codex sub-plugins",
      `Pick a Codex sub-plugin to ${verb}:`,
      buttons,
    ),
  };
}
function buildPluginsHelp() {
  return [
    "Codex sub-plugin management (writes only to ~/.openclaw/openclaw.json, never to ~/.codex/config.toml):",
    "- /codex plugins                  (alias for list)",
    "- /codex plugins list             show all configured Codex sub-plugins",
    "- /codex plugins enable <name>    enable a configured sub-plugin",
    "- /codex plugins disable <name>   disable a configured sub-plugin",
  ].join("\n");
}
function formatPluginList(plugins, options = {}) {
  const globalEnabled = options.globalEnabled === true;
  const keys = Object.keys(plugins).toSorted();
  if (keys.length === 0)
    return "No Codex sub-plugins configured under plugins.entries.codex.config.codexPlugins.plugins";
  const rows = keys.map((key) => {
    const entry = plugins[key] ?? {};
    const state = globalEnabled && entry.enabled !== false ? "ON " : "OFF";
    return {
      displayKey: formatCodexDisplayText(key),
      state,
      pluginName: formatCodexDisplayText(entry.pluginName ?? key),
      marketplace: formatCodexDisplayText(entry.marketplaceName ?? "?"),
    };
  });
  const keyW = Math.max(...rows.map((r) => r.displayKey.length));
  const pluginW = Math.max(...rows.map((r) => r.pluginName.length));
  return [
    "Codex sub-plugins in Openclaw config (~/.openclaw/openclaw.json):",
    "",
    ...rows.map(
      (r) =>
        `  ${r.state}  ${r.displayKey.padEnd(keyW)}  ${r.pluginName.padEnd(pluginW)}  [${r.marketplace}]`,
    ),
    "",
    ...(globalEnabled
      ? []
      : ["Global codexPlugins.enabled is off; configured sub-plugins are inactive.", ""]),
    "New Codex conversations pick up policy changes automatically; /new or /reset to refresh the current one.",
  ].join("\n");
}
//#endregion
//#region extensions/codex/src/command-handlers.ts
const defaultCodexCommandDeps = {
  codexControlRequest,
  listCodexAppServerModels: listAllCodexAppServerModels,
  readCodexStatusProbes,
  requestOptions,
  safeCodexControlRequest,
  readCodexComputerUseStatus,
  installCodexComputerUse,
  resolveCodexDefaultWorkspaceDir,
  readCodexConversationActiveTurn,
  setCodexConversationFastMode,
  setCodexConversationModel,
  setCodexConversationPermissions,
  steerCodexConversationTurn,
  stopCodexConversationTurn,
  listCodexCliSessionsOnNode: async () => {
    throw new Error("Codex CLI node sessions require Gateway node runtime.");
  },
  resolveCodexCliSessionForBindingOnNode: async () => {
    throw new Error("Codex CLI node sessions require Gateway node runtime.");
  },
};
const CODEX_DIAGNOSTICS_SOURCE = "openclaw-diagnostics";
const CODEX_DIAGNOSTICS_REASON_MAX_CHARS = 2048;
const CODEX_DIAGNOSTICS_COOLDOWN_MS = 6e4;
const CODEX_DIAGNOSTICS_ERROR_MAX_CHARS = 500;
const CODEX_DIAGNOSTICS_COOLDOWN_MAX_THREADS = 100;
const CODEX_DIAGNOSTICS_COOLDOWN_MAX_SCOPES = 100;
const CODEX_DIAGNOSTICS_CONFIRMATION_TTL_MS = 5 * 6e4;
const CODEX_DIAGNOSTICS_CONFIRMATION_MAX_REQUESTS_PER_SCOPE = 100;
const CODEX_DIAGNOSTICS_CONFIRMATION_MAX_SCOPES = 100;
const CODEX_DIAGNOSTICS_SCOPE_FIELD_MAX_CHARS = 128;
const CODEX_RESUME_SAFE_THREAD_ID_PATTERN = /^[A-Za-z0-9._:-]+$/;
const CODEX_NATIVE_EXECUTION_SUBCOMMANDS = /* @__PURE__ */ new Set([
  "bind",
  "resume",
  "steer",
  "model",
  "fast",
  "permissions",
  "compact",
  "review",
]);
const CODEX_NATIVE_CONTROL_SUBCOMMANDS = /* @__PURE__ */ new Set([
  ...CODEX_NATIVE_EXECUTION_SUBCOMMANDS,
  "detach",
  "unbind",
  "stop",
]);
const {
  lastUploadByThread: lastCodexDiagnosticsUploadByThread,
  lastUploadByScope: lastCodexDiagnosticsUploadByScope,
  pendingConfirmations: pendingCodexDiagnosticsConfirmations,
  pendingTokensByScope: pendingCodexDiagnosticsConfirmationTokensByScope,
} = codexDiagnosticsFeedbackState;
/**
 * No-arg `/codex` picker. Codex owns the command tree; channels render the
 * portable command actions as inline controls when their transport can.
 */
function buildCodexSubcommandPickerReply() {
  const verbs = [
    {
      label: "plugins",
      command: "/codex plugins menu",
    },
    {
      label: "permissions",
      command: "/codex permissions menu",
    },
    {
      label: "fast",
      command: "/codex fast menu",
    },
    {
      label: "computer-use",
      command: "/codex computer-use menu",
    },
    {
      label: "account",
      command: "/codex account",
    },
    {
      label: "help",
      command: "/codex help",
    },
  ];
  return {
    text: [
      "Codex commands. Pick a category or type:",
      "",
      ...verbs.map((v, i) => `  ${i + 1}. ${v.command}`),
      "",
      "Tap 'help' (or type /codex help) for the full list of typeable verbs",
      "including threads, mcp, binding, detach, skills, resume, bind, steer,",
      "model, diagnostics, compact, review, computer-use.",
      "",
      "Top-level shortcuts cover everyday operations: /status, /fast, /help, /stop, /models.",
    ].join("\n"),
    presentation: buildCodexCommandPickerPresentation(
      "Codex commands",
      "Pick a Codex subcommand:",
      verbs,
    ),
  };
}
/** Sub-picker for `/codex fast menu` (on / off / status). */
function buildCodexFastMenuReply() {
  const modes = ["on", "off", "status"];
  const buttons = [
    ...modes.map((mode) => ({
      label: mode,
      command: `/codex fast ${mode}`,
    })),
    {
      label: "back",
      command: "/codex",
    },
  ];
  return {
    text: [
      "Codex fast mode. Pick one or type /codex fast <mode>:",
      "",
      ...modes.map((m, i) => `  ${i + 1}. /codex fast ${m}`),
      "",
      "Type '/codex' to go back to the main menu.",
    ].join("\n"),
    presentation: buildCodexCommandPickerPresentation(
      "Codex fast mode",
      "Pick a Codex fast mode:",
      buttons,
    ),
  };
}
/** Sub-picker for `/codex permissions menu` (default / yolo / status). */
function buildCodexPermissionsMenuReply() {
  const modes = ["default", "yolo", "status"];
  const buttons = [
    ...modes.map((mode) => ({
      label: mode,
      command: `/codex permissions ${mode}`,
    })),
    {
      label: "back",
      command: "/codex",
    },
  ];
  return {
    text: [
      "Codex permissions. Pick one or type /codex permissions <mode>:",
      "",
      ...modes.map((m, i) => `  ${i + 1}. /codex permissions ${m}`),
      "",
      "Type '/codex' to go back to the main menu.",
    ].join("\n"),
    presentation: buildCodexCommandPickerPresentation(
      "Codex permissions",
      "Pick a Codex permissions mode:",
      buttons,
    ),
  };
}
/** Sub-picker for `/codex computer-use menu` (status / install). */
function buildCodexComputerUseMenuReply() {
  const actions = ["status", "install"];
  const buttons = [
    ...actions.map((action) => ({
      label: action,
      command: `/codex computer-use ${action}`,
    })),
    {
      label: "back",
      command: "/codex",
    },
  ];
  return {
    text: [
      "Codex computer-use. Pick one or type /codex computer-use <action>:",
      "",
      ...actions.map((a, i) => `  ${i + 1}. /codex computer-use ${a}`),
      "",
      "Flag-driven invocations (--source, --marketplace-path, --marketplace) are not in the picker. Type '/codex computer-use' or read '/codex help' for the full surface.",
      "",
      "Type '/codex' to go back to the main menu.",
    ].join("\n"),
    presentation: buildCodexCommandPickerPresentation(
      "Codex computer-use",
      "Pick a Codex computer-use action:",
      buttons,
    ),
  };
}
/** Returns true when the rest-args are exactly `["menu"]` (case-insensitive). */
function isMenuVerb(rest) {
  return rest.length === 1 && (rest[0] ?? "").trim().toLowerCase() === "menu";
}
async function handleCodexSubcommand(ctx, options) {
  const deps = {
    ...defaultCodexCommandDeps,
    ...options.deps,
  };
  const args = splitArgs(ctx.args);
  if (args.length === 0) return buildCodexSubcommandPickerReply();
  const [subcommand = "status", ...rest] = args;
  const normalized = subcommand.toLowerCase();
  if (normalized === "help") return { text: buildHelp() };
  if (
    CODEX_NATIVE_CONTROL_SUBCOMMANDS.has(normalized) &&
    !returnsBeforeNativeCodexExecution(normalized, rest) &&
    !canMutateCodexHost(ctx)
  )
    return { text: CODEX_NATIVE_EXECUTION_AUTH_ERROR };
  const sandboxBlock = resolveCodexNativeCommandSandboxBlock(ctx, normalized, rest);
  if (sandboxBlock) return { text: sandboxBlock };
  if (normalized === "plugins") {
    if (!deps.codexPluginsManagementIo)
      return {
        text: "Codex sub-plugin management is not wired up (codexPluginsManagementIo dep is undefined). Edit ~/.openclaw/openclaw.json or use `openclaw config patch` until the runtime exposes the IO.",
      };
    return await handleCodexPluginsSubcommand(ctx, rest, deps.codexPluginsManagementIo);
  }
  if (normalized === "status") {
    if (rest.length > 0) return { text: "Usage: /codex status" };
    const { agentDir } = resolveCodexConversationControlScope(ctx);
    return {
      text: formatCodexStatus(
        await deps.readCodexStatusProbes(options.pluginConfig, ctx.config, agentDir),
      ),
    };
  }
  if (normalized === "models") {
    if (rest.length > 0) return { text: "Usage: /codex models" };
    const { agentDir } = resolveCodexConversationControlScope(ctx);
    return {
      text: formatModels(
        await deps.listCodexAppServerModels(
          deps.requestOptions(options.pluginConfig, 100, ctx.config, agentDir),
        ),
      ),
    };
  }
  if (normalized === "threads")
    return { text: await buildThreads(deps, ctx, options.pluginConfig, rest.join(" ")) };
  if (normalized === "sessions") return { text: await buildCodexCliSessions(deps, rest) };
  if (normalized === "resume")
    return { text: await resumeThread(deps, ctx, options.pluginConfig, rest) };
  if (normalized === "bind") return await bindConversation(deps, ctx, options.pluginConfig, rest);
  if (normalized === "detach" || normalized === "unbind") {
    if (rest.length > 0) return { text: "Usage: /codex detach" };
    return { text: await detachConversation(deps, ctx) };
  }
  if (normalized === "binding") {
    if (rest.length > 0) return { text: "Usage: /codex binding" };
    return { text: await describeConversationBinding(deps, ctx) };
  }
  if (normalized === "stop") {
    if (rest.length > 0) return { text: "Usage: /codex stop" };
    return { text: await stopConversationTurn(deps, ctx, options.pluginConfig) };
  }
  if (normalized === "steer")
    return { text: await steerConversationTurn(deps, ctx, options.pluginConfig, rest.join(" ")) };
  if (normalized === "model")
    return { text: await setConversationModel(deps, ctx, options.pluginConfig, rest) };
  if (normalized === "fast") {
    if (isMenuVerb(rest)) return buildCodexFastMenuReply();
    return { text: await setConversationFastMode(deps, ctx, rest) };
  }
  if (normalized === "permissions") {
    if (isMenuVerb(rest)) return buildCodexPermissionsMenuReply();
    return { text: await setConversationPermissions(deps, ctx, rest) };
  }
  if (normalized === "compact")
    return { text: await startThreadAction(deps, ctx, options.pluginConfig, "compact", rest) };
  if (normalized === "review")
    return { text: await startThreadAction(deps, ctx, options.pluginConfig, "review", rest) };
  if (normalized === "diagnostics")
    return await handleCodexDiagnosticsFeedback(
      deps,
      ctx,
      options.pluginConfig,
      rest.join(" "),
      "/codex diagnostics",
    );
  if (normalized === "computer-use" || normalized === "computeruse") {
    if (isMenuVerb(rest)) return buildCodexComputerUseMenuReply();
    return { text: await handleComputerUseCommand(deps, ctx, options.pluginConfig, rest) };
  }
  if (normalized === "mcp") {
    if (rest.length > 0) return { text: "Usage: /codex mcp" };
    const scope = await resolveCommandAppServerScope(deps, ctx, options.pluginConfig);
    return {
      text: formatList(
        await deps.codexControlRequest(
          options.pluginConfig,
          CODEX_CONTROL_METHODS.listMcpServers,
          { limit: 100 },
          {
            config: ctx.config,
            ...scope,
          },
        ),
        "MCP servers",
      ),
    };
  }
  if (normalized === "skills") {
    if (rest.length > 0) return { text: "Usage: /codex skills" };
    const scope = await resolveCommandAppServerScope(deps, ctx, options.pluginConfig);
    return {
      text: formatSkills(
        await deps.codexControlRequest(
          options.pluginConfig,
          CODEX_CONTROL_METHODS.listSkills,
          {},
          {
            config: ctx.config,
            ...scope,
          },
        ),
      ),
    };
  }
  if (normalized === "account") {
    if (rest.length > 0) return { text: "Usage: /codex account" };
    const scope = await resolveCommandAppServerScope(deps, ctx, options.pluginConfig);
    const requestScope = {
      config: ctx.config,
      ...scope,
    };
    const [account, limits] = await Promise.all([
      deps.safeCodexControlRequest(
        options.pluginConfig,
        CODEX_CONTROL_METHODS.account,
        { refreshToken: false },
        requestScope,
      ),
      deps.safeCodexControlRequest(
        options.pluginConfig,
        CODEX_CONTROL_METHODS.rateLimits,
        void 0,
        requestScope,
      ),
    ]);
    return {
      text: formatAccount(
        account,
        limits,
        await readCodexAccountAuthOverview({
          ctx,
          agentDir: scope.agentDir,
          pluginConfig: options.pluginConfig,
          safeCodexControlRequest: deps.safeCodexControlRequest,
          account,
          limits,
        }),
      ),
    };
  }
  return { text: `Unknown Codex command: ${formatCodexDisplayText(subcommand)}\n\n${buildHelp()}` };
}
function isCurrentSessionModelSelectionLocked(ctx) {
  const sessionKey = ctx.sessionKey?.trim();
  if (!sessionKey) return false;
  return isModelSelectionLocked(
    getSessionEntry({
      storePath: resolveStorePath(ctx.config.session?.store, { agentId: ctx.agentId }),
      sessionKey,
      hydrateSkillPromptRefs: false,
      readConsistency: "latest",
    }),
  );
}
function resolveCodexNativeCommandSandboxBlock(ctx, subcommand, args) {
  if (!CODEX_NATIVE_EXECUTION_SUBCOMMANDS.has(subcommand)) return;
  if (returnsBeforeNativeCodexExecution(subcommand, args)) return;
  if (isCodexCliNodeResumeBind(subcommand, args))
    return resolveCodexNativeSandboxBlock({
      config: ctx.config,
      sessionKey: ctx.sessionKey,
      sessionId: ctx.sessionId,
      surface: `/${["codex", subcommand].join(" ")}`,
    });
  return resolveCodexNativeExecutionBlock({
    config: ctx.config,
    agentId: ctx.agentId,
    sessionKey: ctx.sessionKey,
    sessionId: ctx.sessionId,
    surface: `/${["codex", subcommand].join(" ")}`,
  });
}
function returnsBeforeNativeCodexExecution(subcommand, args) {
  switch (subcommand) {
    case "bind":
      return parseBindArgs([...args]).help === true;
    case "resume":
      return returnsBeforeNativeCodexResume(args);
    case "steer":
      return args.join(" ").trim() === "";
    case "model":
      return args.length === 0 || args.length > 1;
    case "fast":
      return args.length === 0 || args.length > 1 || parseCodexFastModeArg(args[0]) === void 0;
    case "permissions":
      return (
        args.length === 0 || args.length > 1 || parseCodexPermissionsModeArg(args[0]) === void 0
      );
    case "compact":
    case "review":
    case "detach":
    case "unbind":
    case "stop":
      return args.length > 0;
    default:
      return false;
  }
}
function isCodexCliNodeResumeBind(subcommand, args) {
  if (subcommand !== "resume") return false;
  const parsed = parseResumeArgs([...args]);
  return Boolean(parsed.host && parsed.threadId && parsed.bindHere === true && !parsed.help);
}
function returnsBeforeNativeCodexResume(args) {
  const parsed = parseResumeArgs([...args]);
  const normalizedThreadId = parsed.threadId?.trim();
  if (parsed.help) return true;
  if (parsed.host) return !normalizedThreadId || parsed.bindHere !== true;
  return !normalizedThreadId || args.length !== 1;
}
async function handleComputerUseCommand(deps, ctx, pluginConfig, args) {
  const parsed = parseComputerUseArgs(args);
  if (parsed.help)
    return [
      "Usage: /codex computer-use [status|install] [--source <marketplace-source>] [--marketplace-path <path>] [--marketplace <name>]",
      "Checks or installs the configured Codex Computer Use plugin through app-server.",
    ].join("\n");
  if (Object.keys(parsed.persistentIdentity).length > 0)
    return formatComputerUsePersistentIdentityMigration(parsed);
  if (parsed.action === "install" && !canMutateCodexHost(ctx))
    return "Only an owner or operator.admin gateway client can configure Codex Computer Use.";
  const { agentDir } = resolveCodexConversationControlScope(ctx);
  const params = {
    pluginConfig,
    config: ctx.config,
    agentDir,
    forceEnable: parsed.action === "install" || parsed.hasOverrides,
    ...(Object.keys(parsed.overrides).length > 0 ? { overrides: parsed.overrides } : {}),
  };
  if (parsed.action === "install")
    return formatComputerUseStatus(await deps.installCodexComputerUse(params));
  return formatComputerUseStatus(await deps.readCodexComputerUseStatus(params));
}
async function bindConversation(deps, ctx, pluginConfig, args) {
  const parsed = parseBindArgs(args);
  if (parsed.help)
    return {
      text: "Usage: /codex bind [thread-id] [--cwd <path>] [--model <model>] [--provider <provider>]",
    };
  if (isCurrentSessionModelSelectionLocked(ctx)) return { text: MODEL_SELECTION_LOCKED_MESSAGE };
  const scope = resolveCodexConversationControlScope(ctx);
  const workspaceDir = parsed.cwd ?? deps.resolveCodexDefaultWorkspaceDir(pluginConfig);
  const currentConversation = await ctx.getCurrentConversationBinding();
  const currentConversationData = readCodexConversationBindingData(currentConversation);
  const bindingId =
    currentConversationData?.kind === "codex-app-server-session"
      ? currentConversationData.bindingId
      : currentConversation
        ? `conversation-${currentConversation.bindingId}`
        : void 0;
  const sessionOwner = ctx.sessionId
    ? sessionBindingIdentity({
        sessionId: ctx.sessionId,
        sessionKey: ctx.sessionKey,
        agentId: scope.agentId,
        config: ctx.config,
      })
    : void 0;
  const currentOwner =
    currentConversationData?.kind === "codex-app-server-session"
      ? conversationBindingIdentity(currentConversationData.bindingId)
      : sessionOwner;
  const existingBinding = currentOwner ? await deps.bindingStore.read(currentOwner) : void 0;
  assertCodexBindingMayBeReplaced(existingBinding, "binding this conversation to another thread");
  const sessionSource =
    sessionOwner && existingBinding
      ? {
          agentId: sessionOwner.agentId,
          sessionId: sessionOwner.sessionId,
          threadId: existingBinding.threadId,
          ...(sessionOwner.sessionKey ? { sessionKey: sessionOwner.sessionKey } : {}),
        }
      : void 0;
  const authProfileId = existingBinding?.authProfileId;
  const data = createCodexConversationBindingData({
    bindingId,
    workspaceDir,
    agentId: scope.agentId,
    agentDir: scope.agentDir,
    source:
      currentConversationData?.kind === "codex-app-server-session"
        ? currentConversationData.source
        : sessionSource,
    start: {
      id: crypto.randomUUID(),
      threadId: parsed.threadId,
      model: parsed.model,
      modelProvider: parsed.provider,
      authProfileId,
    },
  });
  const threadLabel = parsed.threadId ?? "a new thread";
  const request = await ctx.requestConversationBinding({
    summary: `Codex app-server thread ${formatCodexDisplayText(threadLabel)} in ${formatCodexDisplayText(workspaceDir)}`,
    detachHint: "/codex detach",
    data,
  });
  if (request.status === "pending") return request.reply;
  if (request.status === "error") return { text: formatCodexDisplayText(request.message) };
  return {
    text: `Bound this conversation to ${formatCodexDisplayText(threadLabel)} in ${formatCodexDisplayText(workspaceDir)}. The next message will initialize it.`,
  };
}
async function detachConversation(deps, ctx) {
  if (isCurrentSessionModelSelectionLocked(ctx)) return MODEL_SELECTION_LOCKED_MESSAGE;
  const data = readCodexConversationBindingData(await ctx.getCurrentConversationBinding());
  if (data?.kind === "codex-app-server-session")
    assertCodexBindingMayBeReplaced(
      await deps.bindingStore.read(conversationBindingIdentity(data.bindingId)),
      "detaching its conversation binding",
    );
  const detached = await ctx.detachConversationBinding();
  if (data?.kind === "codex-app-server-session")
    await deps.bindingStore.mutate(conversationBindingIdentity(data.bindingId), { kind: "clear" });
  return detached.removed
    ? "Detached this conversation from Codex."
    : "No Codex conversation binding was attached.";
}
async function describeConversationBinding(deps, ctx) {
  const current = await ctx.getCurrentConversationBinding();
  const data = readCodexConversationBindingData(current);
  if (!current || !data) return "No Codex conversation binding is attached.";
  if (data.kind === "codex-cli-node-session")
    return [
      "Codex conversation binding:",
      "- Mode: Codex CLI node session",
      `- Node: ${formatCodexDisplayText(data.nodeId)}`,
      `- Session: ${formatCodexDisplayText(data.sessionId)}`,
      `- Workspace: ${formatCodexDisplayText(data.cwd ?? "unknown")}`,
      "- Active run: not tracked",
    ].join("\n");
  const identity = conversationBindingIdentity(data.bindingId);
  const threadBinding = await deps.bindingStore.read(identity);
  const active = deps.readCodexConversationActiveTurn(identity);
  return [
    "Codex conversation binding:",
    `- Thread: ${formatCodexDisplayText(threadBinding?.threadId ?? "unknown")}`,
    `- Workspace: ${formatCodexDisplayText(data.workspaceDir)}`,
    `- Model: ${formatCodexDisplayText(threadBinding?.model ?? "default")}`,
    `- Fast: ${isCodexFastServiceTier(threadBinding?.serviceTier) ? "on" : "off"}`,
    `- Permissions: ${threadBinding ? formatPermissionsMode(threadBinding) : "default"}`,
    `- Active run: ${formatCodexDisplayText(active ? active.turnId : "none")}`,
    `- Binding: ${formatCodexDisplayText(data.bindingId)}`,
  ].join("\n");
}
async function buildThreads(deps, ctx, pluginConfig, filter) {
  const scope = await resolveCommandAppServerScope(deps, ctx, pluginConfig);
  return formatThreads(
    await deps.codexControlRequest(
      pluginConfig,
      CODEX_CONTROL_METHODS.listThreads,
      {
        limit: 10,
        ...(filter.trim() ? { searchTerm: filter.trim() } : {}),
      },
      {
        config: ctx.config,
        ...scope,
      },
    ),
  );
}
async function buildCodexCliSessions(deps, args) {
  const parsed = parseCodexCliSessionsArgs(args);
  if (parsed.help || !parsed.host)
    return "Usage: /codex sessions --host <node> [filter] [--limit <n>]";
  return formatCodexCliSessions(
    await deps.listCodexCliSessionsOnNode({
      requestedNode: parsed.host,
      filter: parsed.filter,
      limit: parsed.limit,
    }),
  );
}
async function resumeThread(deps, ctx, pluginConfig, args) {
  const parsed = parseResumeArgs(args);
  const normalizedThreadId = parsed.threadId?.trim();
  if (parsed.help)
    return args.includes("--help") || args.includes("-h") || parsed.host
      ? "Usage: /codex resume <thread-id>\nUsage: /codex resume <session-id> --host <node> --bind here"
      : "Usage: /codex resume <thread-id>";
  if (parsed.host) return await bindCodexCliNodeSession(deps, ctx, parsed);
  if (!normalizedThreadId || args.length !== 1) return "Usage: /codex resume <thread-id>";
  if (isCurrentSessionModelSelectionLocked(ctx)) return MODEL_SELECTION_LOCKED_MESSAGE;
  if (!ctx.sessionId)
    return "Cannot attach a Codex thread because this command did not include an OpenClaw session id.";
  const scope = resolveCodexConversationControlScope(ctx);
  const identity = sessionBindingIdentity({
    sessionId: ctx.sessionId,
    sessionKey: ctx.sessionKey,
    agentId: scope.agentId,
    config: ctx.config,
  });
  return await deps.bindingStore.withLease(identity, async () => {
    if (
      !(await reclaimCurrentCodexSessionGeneration({
        bindingStore: deps.bindingStore,
        identity,
        config: ctx.config,
      }))
    )
      throw new Error(`Codex session generation is no longer current: ${identity.sessionId}`);
    const currentBinding = await deps.bindingStore.read(identity);
    assertCodexBindingMayBeReplaced(currentBinding, "attaching a different resumed thread");
    const authProfileId = resolveCodexAppServerAuthProfileIdForAgent({
      authProfileId: currentBinding?.authProfileId,
      agentDir: scope.agentDir,
      config: ctx.config,
    });
    const response = assertCodexThreadResumeResponse(
      await deps.codexControlRequest(
        pluginConfig,
        CODEX_CONTROL_METHODS.resumeThread,
        {
          threadId: normalizedThreadId,
          excludeTurns: true,
        },
        {
          config: ctx.config,
          agentDir: scope.agentDir,
          authProfileId,
          sessionKey: ctx.sessionKey,
          sessionId: ctx.sessionId,
        },
      ),
    );
    const effectiveThreadId = response.thread.id;
    if (effectiveThreadId !== normalizedThreadId)
      throw new Error(
        `Codex thread/resume returned ${effectiveThreadId} for ${normalizedThreadId}`,
      );
    const resumedCwd = response.thread.cwd;
    if (typeof resumedCwd !== "string")
      throw new Error(`Codex thread/resume returned no cwd for ${normalizedThreadId}`);
    const modelProvider = normalizeCodexAppServerBindingModelProvider({
      authProfileId,
      modelProvider: response.modelProvider ?? void 0,
      agentDir: scope.agentDir,
      config: ctx.config,
    });
    assertCodexBindingMayBeReplaced(
      await deps.bindingStore.read(identity),
      "committing a different resumed thread",
    );
    if (
      !(await deps.bindingStore.mutate(identity, {
        kind: "set",
        binding: {
          threadId: effectiveThreadId,
          cwd: resumedCwd,
          authProfileId,
          model: response.model,
          modelProvider,
          historyCoveredThrough: /* @__PURE__ */ new Date().toISOString(),
        },
      }))
    )
      throw new Error("Codex thread binding changed while attaching the resumed thread.");
    return `Attached this OpenClaw session to Codex thread ${formatCodexDisplayText(effectiveThreadId)}.`;
  });
}
async function bindCodexCliNodeSession(deps, ctx, parsed) {
  if (!parsed.threadId || !parsed.host || parsed.bindHere !== true)
    return "Usage: /codex resume <session-id> --host <node> --bind here";
  if (isCurrentSessionModelSelectionLocked(ctx)) return MODEL_SELECTION_LOCKED_MESSAGE;
  if (ctx.sessionId) {
    const scope = resolveCodexConversationControlScope(ctx);
    assertCodexBindingMayBeReplaced(
      await deps.bindingStore.read(
        sessionBindingIdentity({
          sessionId: ctx.sessionId,
          sessionKey: ctx.sessionKey,
          agentId: scope.agentId,
          config: ctx.config,
        }),
      ),
      "binding a Codex CLI node session",
    );
  }
  const resolved = await deps.resolveCodexCliSessionForBindingOnNode({
    requestedNode: parsed.host,
    sessionId: parsed.threadId,
  });
  if (!resolved.session)
    return `No Codex CLI session ${formatCodexDisplayText(parsed.threadId)} was found on ${formatCodexDisplayText(parsed.host)}.`;
  const nodeId = resolved.node.nodeId;
  if (!nodeId)
    return "Cannot bind Codex CLI session because the selected node did not include a node id.";
  const scope = resolveCodexConversationControlScope(ctx);
  const data = createCodexCliNodeConversationBindingData({
    nodeId,
    sessionId: parsed.threadId,
    agentId: scope.agentId,
    cwd: resolved.session?.cwd,
  });
  const summary = `Codex CLI session ${formatCodexDisplayText(parsed.threadId)} on ${formatCodexDisplayText(nodeId)}`;
  const request = await ctx.requestConversationBinding({
    summary,
    detachHint: "/codex detach",
    data,
  });
  if (request.status === "bound")
    return `Bound this conversation to Codex CLI session ${formatCodexDisplayText(parsed.threadId)} on ${formatCodexDisplayText(nodeId)}.`;
  if (request.status === "pending")
    return request.reply.text ?? "Codex CLI session binding is pending approval.";
  return formatCodexDisplayText(request.message);
}
async function stopConversationTurn(deps, ctx, pluginConfig) {
  const target = await resolveControlTarget(ctx);
  if (!target)
    return "Cannot stop Codex because this command did not include a stable binding identity.";
  return (
    await deps.stopCodexConversationTurn({
      identity: target.identity,
      bindingStore: deps.bindingStore,
      pluginConfig,
      agentDir: target.agentDir,
      config: ctx.config,
    })
  ).message;
}
async function steerConversationTurn(deps, ctx, pluginConfig, message) {
  const target = await resolveControlTarget(ctx);
  if (!target)
    return "Cannot steer Codex because this command did not include a stable binding identity.";
  return (
    await deps.steerCodexConversationTurn({
      identity: target.identity,
      bindingStore: deps.bindingStore,
      message,
      pluginConfig,
      agentDir: target.agentDir,
      config: ctx.config,
    })
  ).message;
}
async function setConversationModel(deps, ctx, pluginConfig, args) {
  if (args.length > 1) return "Usage: /codex model <model>";
  const [model = ""] = args;
  const normalized = model.trim();
  if (normalized && isCurrentSessionModelSelectionLocked(ctx))
    return MODEL_SELECTION_LOCKED_MESSAGE;
  const target = await resolveControlTarget(ctx);
  if (!target)
    return "Cannot set Codex model because this command did not include a stable binding identity.";
  if (!normalized) {
    const binding = await deps.bindingStore.read(target.identity);
    return binding?.model
      ? `Codex model: ${formatCodexDisplayText(binding.model)}`
      : "Usage: /codex model <model>";
  }
  return await deps.setCodexConversationModel({
    identity: target.identity,
    bindingStore: deps.bindingStore,
    pluginConfig,
    model: normalized,
    agentDir: target.agentDir,
    config: ctx.config,
  });
}
async function setConversationFastMode(deps, ctx, args) {
  if (args.length > 1) return "Usage: /codex fast [on|off|status]";
  const target = await resolveControlTarget(ctx);
  if (!target)
    return "Cannot set Codex fast mode because this command did not include a stable binding identity.";
  const value = args[0];
  const parsed = parseCodexFastModeArg(value);
  if (value && parsed == null && value.trim().toLowerCase() !== "status")
    return "Usage: /codex fast [on|off|status]";
  return await deps.setCodexConversationFastMode({
    identity: target.identity,
    bindingStore: deps.bindingStore,
    enabled: parsed,
  });
}
async function setConversationPermissions(deps, ctx, args) {
  if (args.length > 1) return "Usage: /codex permissions [default|yolo|status]";
  const target = await resolveControlTarget(ctx);
  if (!target)
    return "Cannot set Codex permissions because this command did not include a stable binding identity.";
  const value = args[0];
  const parsed = parseCodexPermissionsModeArg(value);
  if (value && !parsed && value.trim().toLowerCase() !== "status")
    return "Usage: /codex permissions [default|yolo|status]";
  return await deps.setCodexConversationPermissions({
    identity: target.identity,
    bindingStore: deps.bindingStore,
    mode: parsed,
  });
}
async function resolveControlTarget(ctx) {
  const data = readCodexConversationBindingData(await ctx.getCurrentConversationBinding());
  const scope = resolveCodexConversationControlScope(ctx);
  if (data?.kind === "codex-app-server-session")
    return {
      identity: conversationBindingIdentity(data.bindingId),
      agentId: data.agentId ?? scope.agentId,
      agentDir: data.agentDir ?? scope.agentDir,
      requestedAuthProfileId: data.start?.authProfileId,
    };
  return ctx.sessionId
    ? {
        identity: sessionBindingIdentity({
          sessionId: ctx.sessionId,
          sessionKey: ctx.sessionKey,
          agentId: scope.agentId,
          config: ctx.config,
        }),
        agentId: scope.agentId,
        agentDir: scope.agentDir,
      }
    : void 0;
}
async function resolveCommandAppServerScope(deps, ctx, pluginConfig) {
  const target = await resolveControlTarget(ctx);
  const fallback = resolveCodexConversationControlScope(ctx);
  const agentDir = target?.agentDir ?? fallback.agentDir;
  const binding = target ? await deps.bindingStore.read(target.identity) : void 0;
  const connection = resolveCodexBindingAppServerConnection({
    binding,
    authProfileId:
      binding?.connectionScope === "supervision"
        ? void 0
        : resolveCodexAppServerAuthProfileIdForAgent({
            authProfileId: binding?.authProfileId ?? target?.requestedAuthProfileId,
            agentDir,
            config: ctx.config,
          }),
    pluginConfig,
  });
  return {
    agentId: target?.agentId ?? fallback.agentId,
    agentDir,
    ...(connection.clientAuthProfileId !== void 0
      ? { authProfileId: connection.clientAuthProfileId }
      : {}),
    ...(connection.usesSupervisionConnection ? { startOptions: connection.appServer.start } : {}),
    ...(ctx.sessionKey ? { sessionKey: ctx.sessionKey } : {}),
    ...(ctx.sessionId ? { sessionId: ctx.sessionId } : {}),
  };
}
function conversationBindingIdentity(bindingId) {
  return {
    kind: "conversation",
    bindingId,
  };
}
function resolveCodexConversationControlScope(ctx) {
  const { sessionAgentId } = resolveSessionAgentIds({
    sessionKey: ctx.sessionKey,
    agentId: ctx.agentId,
    config: ctx.config,
  });
  return {
    agentId: sessionAgentId,
    agentDir: resolveAgentDir(ctx.config, sessionAgentId),
  };
}
async function handleCodexDiagnosticsFeedback(deps, ctx, pluginConfig, args, commandPrefix) {
  if (ctx.senderIsOwner !== true) return { text: "Only an owner can send Codex diagnostics." };
  const parsed = parseDiagnosticsArgs(args);
  if (parsed.action === "usage") return { text: formatDiagnosticsUsage(commandPrefix) };
  if (parsed.action === "confirm")
    return { text: await confirmCodexDiagnosticsFeedback(deps, ctx, pluginConfig, parsed.token) };
  if (parsed.action === "cancel")
    return { text: cancelCodexDiagnosticsFeedback(ctx, parsed.token) };
  if (ctx.diagnosticsUploadApproved === true)
    return {
      text: await sendCodexDiagnosticsFeedbackForContext(deps, ctx, pluginConfig, parsed.note),
    };
  if (ctx.diagnosticsPreviewOnly === true)
    return { text: await previewCodexDiagnosticsFeedbackApproval(deps, ctx, parsed.note) };
  return await requestCodexDiagnosticsFeedbackApproval(deps, ctx, parsed.note, commandPrefix);
}
async function requestCodexDiagnosticsFeedbackApproval(deps, ctx, note, commandPrefix) {
  if (!(await hasAnyCodexDiagnosticsIdentity(ctx)))
    return {
      text: "Cannot send Codex diagnostics because this command did not include a stable session identity.",
    };
  const targets = await resolveCodexDiagnosticsTargets(deps, ctx);
  if (targets.length === 0)
    return {
      text: [
        "No Codex thread is attached to this OpenClaw session yet.",
        "Use /codex threads to find a thread, then /codex resume <thread-id> before sending diagnostics.",
      ].join("\n"),
    };
  const now = Date.now();
  const cooldownMessage = readCodexDiagnosticsTargetsCooldownMessage(targets, ctx, now);
  if (cooldownMessage) return { text: cooldownMessage };
  if (!ctx.senderId)
    return {
      text: "Cannot send Codex diagnostics because this command did not include a sender identity.",
    };
  const reason = normalizeDiagnosticsReason(note);
  const token = createCodexDiagnosticsConfirmation({
    targets,
    note: reason,
    senderId: ctx.senderId,
    channel: ctx.channel,
    scopeKey: readCodexDiagnosticsCooldownScope(ctx),
    privateRouted: ctx.diagnosticsPrivateRouted === true,
    ...readCodexDiagnosticsConfirmationScope(ctx),
    now,
  });
  const confirmCommand = `${commandPrefix} confirm ${token}`;
  const cancelCommand = `${commandPrefix} cancel ${token}`;
  const displayReason = reason ? escapeCodexChatText(formatCodexTextForDisplay(reason)) : void 0;
  return {
    text: [
      targets.length === 1 ? "Codex runtime thread detected." : "Codex runtime threads detected.",
      `Codex diagnostics can send ${targets.length === 1 ? "this thread's feedback bundle" : "these threads' feedback bundles"} to OpenAI servers.`,
      "Codex sessions:",
      ...formatCodexDiagnosticsTargetLines(targets),
      ...(displayReason ? [`Note: ${displayReason}`] : []),
      "Included: Codex logs and spawned Codex subthreads when available.",
      `To send: ${confirmCommand}`,
      `To cancel: ${cancelCommand}`,
      "This request expires in 5 minutes.",
    ].join("\n"),
    interactive: {
      blocks: [
        {
          type: "buttons",
          buttons: [
            {
              label: "Send diagnostics",
              action: {
                type: "command",
                command: confirmCommand,
              },
              value: confirmCommand,
              style: "danger",
            },
            {
              label: "Cancel",
              action: {
                type: "command",
                command: cancelCommand,
              },
              value: cancelCommand,
              style: "secondary",
            },
          ],
        },
      ],
    },
  };
}
async function previewCodexDiagnosticsFeedbackApproval(deps, ctx, note) {
  if (!(await hasAnyCodexDiagnosticsIdentity(ctx)))
    return "Cannot send Codex diagnostics because this command did not include a stable session identity.";
  const targets = await resolveCodexDiagnosticsTargets(deps, ctx);
  if (targets.length === 0)
    return [
      "No Codex thread is attached to this OpenClaw session yet.",
      "Use /codex threads to find a thread, then /codex resume <thread-id> before sending diagnostics.",
    ].join("\n");
  const cooldownMessage = readCodexDiagnosticsTargetsCooldownMessage(targets, ctx, Date.now(), {
    includeThreadId: false,
  });
  if (cooldownMessage) return cooldownMessage;
  const reason = normalizeDiagnosticsReason(note);
  const displayReason = reason ? escapeCodexChatText(formatCodexTextForDisplay(reason)) : void 0;
  return [
    targets.length === 1 ? "Codex runtime thread detected." : "Codex runtime threads detected.",
    `Approving diagnostics will also send ${targets.length === 1 ? "this thread's feedback bundle" : "these threads' feedback bundles"} to OpenAI servers.`,
    "The completed diagnostics reply will list the OpenClaw session ids and Codex thread ids that were sent.",
    ...(displayReason ? [`Note: ${displayReason}`] : []),
    "Included: Codex logs and spawned Codex subthreads when available.",
  ].join("\n");
}
async function confirmCodexDiagnosticsFeedback(deps, ctx, pluginConfig, token) {
  const pending = readPendingCodexDiagnosticsConfirmation(token, Date.now());
  if (!pending)
    return "No pending Codex diagnostics confirmation was found. Run /diagnostics again to create a fresh request.";
  if (!pending.senderId || !ctx.senderId)
    return "Cannot confirm Codex diagnostics because this command did not include the original sender identity.";
  if (pending.senderId !== ctx.senderId)
    return "Only the user who requested these Codex diagnostics can confirm the upload.";
  if (pending.channel !== ctx.channel)
    return "This Codex diagnostics confirmation belongs to a different channel.";
  const scopeMismatch = readCodexDiagnosticsScopeMismatch(pending, ctx);
  if (scopeMismatch) return scopeMismatch.confirmMessage;
  deletePendingCodexDiagnosticsConfirmation(token);
  if (!pending.privateRouted && !(await hasAnyCodexDiagnosticsIdentity(ctx)))
    return "Cannot send Codex diagnostics because this command did not include a stable session identity.";
  const currentTargets = pending.privateRouted
    ? await resolvePendingCodexDiagnosticsTargets(deps, pending.targets, ctx.config)
    : await resolveCodexDiagnosticsTargets(deps, ctx);
  if (!codexDiagnosticsTargetsMatch(pending.targets, currentTargets))
    return "The Codex diagnostics sessions changed before confirmation. Run /diagnostics again for the current threads.";
  return await sendCodexDiagnosticsFeedbackForTargets(
    deps,
    ctx,
    pluginConfig,
    pending.note ?? "",
    currentTargets,
    { cooldownScope: pending.scopeKey },
  );
}
function cancelCodexDiagnosticsFeedback(ctx, token) {
  const pending = readPendingCodexDiagnosticsConfirmation(token, Date.now());
  if (!pending) return "No pending Codex diagnostics confirmation was found.";
  if (!pending.senderId || !ctx.senderId)
    return "Cannot cancel Codex diagnostics because this command did not include the original sender identity.";
  if (pending.senderId !== ctx.senderId)
    return "Only the user who requested these Codex diagnostics can cancel the upload.";
  if (pending.channel !== ctx.channel)
    return "This Codex diagnostics confirmation belongs to a different channel.";
  const scopeMismatch = readCodexDiagnosticsScopeMismatch(pending, ctx);
  if (scopeMismatch) return scopeMismatch.cancelMessage;
  deletePendingCodexDiagnosticsConfirmation(token);
  return [
    "Codex diagnostics upload canceled.",
    "Codex sessions:",
    ...formatCodexDiagnosticsTargetLines(pending.targets),
  ].join("\n");
}
async function sendCodexDiagnosticsFeedbackForContext(deps, ctx, pluginConfig, note) {
  if (!(await hasAnyCodexDiagnosticsIdentity(ctx)))
    return "Cannot send Codex diagnostics because this command did not include a stable session identity.";
  const targets = await resolveCodexDiagnosticsTargets(deps, ctx);
  if (targets.length === 0)
    return [
      "No Codex thread is attached to this OpenClaw session yet.",
      "Use /codex threads to find a thread, then /codex resume <thread-id> before sending diagnostics.",
    ].join("\n");
  return await sendCodexDiagnosticsFeedbackForTargets(deps, ctx, pluginConfig, note, targets);
}
async function sendCodexDiagnosticsFeedbackForTargets(
  deps,
  ctx,
  pluginConfig,
  note,
  targets,
  options = {},
) {
  if (targets.length === 0)
    return [
      "No Codex thread is attached to this OpenClaw session yet.",
      "Use /codex threads to find a thread, then /codex resume <thread-id> before sending diagnostics.",
    ].join("\n");
  const now = Date.now();
  const cooldownMessage = readCodexDiagnosticsTargetsCooldownMessage(targets, ctx, now, {
    cooldownScope: options.cooldownScope,
  });
  if (cooldownMessage) return cooldownMessage;
  const reason = normalizeDiagnosticsReason(note);
  const sent = [];
  const failed = [];
  for (const target of targets) {
    let connection;
    try {
      connection = resolveCodexBindingAppServerConnection({
        binding: target,
        authProfileId: target.authProfileId,
        pluginConfig,
      });
    } catch (error) {
      failed.push({
        target,
        error: error instanceof Error ? error.message : String(error),
      });
      continue;
    }
    const response = await deps.safeCodexControlRequest(
      pluginConfig,
      CODEX_CONTROL_METHODS.feedback,
      {
        classification: "bug",
        threadId: target.threadId,
        includeLogs: true,
        tags: buildDiagnosticsTags(ctx),
        ...(reason ? { reason } : {}),
      },
      {
        config: ctx.config,
        agentDir: target.agentDir,
        ...(connection.clientAuthProfileId !== void 0
          ? { authProfileId: connection.clientAuthProfileId }
          : {}),
        ...(connection.usesSupervisionConnection
          ? { startOptions: connection.appServer.start }
          : {}),
        ...(target.sessionId ? { sessionId: target.sessionId } : {}),
        ...(target.sessionKey ? { sessionKey: target.sessionKey } : {}),
      },
    );
    if (!response.ok) {
      failed.push({
        target,
        error: response.error,
      });
      continue;
    }
    const responseThreadId = isJsonObject(response.value)
      ? readString$1(response.value, "threadId")
      : void 0;
    sent.push({
      ...target,
      threadId: responseThreadId ?? target.threadId,
    });
    recordCodexDiagnosticsUpload(target.threadId, ctx, now, options.cooldownScope);
  }
  return formatCodexDiagnosticsUploadResult(sent, failed);
}
async function hasAnyCodexDiagnosticsIdentity(ctx) {
  if (await resolveControlTarget(ctx)) return true;
  return (ctx.diagnosticsSessions ?? []).some((session) => Boolean(session.sessionId));
}
async function resolveCodexDiagnosticsTargets(deps, ctx) {
  const activeTarget = await resolveControlTarget(ctx);
  const candidates = [];
  if (activeTarget)
    candidates.push({
      identity: activeTarget.identity,
      agentDir: activeTarget.agentDir,
      sessionKey: ctx.sessionKey,
      sessionId: ctx.sessionId,
      channel: ctx.channel,
      channelId: ctx.channelId,
      accountId: ctx.accountId,
      messageThreadId: ctx.messageThreadId,
      threadParentId: ctx.threadParentId,
    });
  for (const session of ctx.diagnosticsSessions ?? []) {
    if (!session.sessionId) continue;
    const inventoryAgentId = session.sessionKey
      ? parseAgentSessionKey(session.sessionKey)?.agentId
      : void 0;
    const identity = sessionBindingIdentity({
      sessionId: session.sessionId,
      sessionKey: session.sessionKey,
      agentId: inventoryAgentId ?? ctx.agentId,
      config: ctx.config,
    });
    candidates.push({
      identity,
      agentDir: resolveAgentDir(ctx.config, identity.agentId),
      sessionKey: session.sessionKey,
      sessionId: session.sessionId,
      channel: session.channel,
      channelId: session.channelId,
      accountId: session.accountId,
      messageThreadId: session.messageThreadId,
      threadParentId: session.threadParentId,
    });
  }
  const seenBindingKeys = /* @__PURE__ */ new Set();
  const seenThreadIds = /* @__PURE__ */ new Set();
  const targets = [];
  for (const candidate of candidates) {
    const key = bindingStoreKey(candidate.identity);
    if (seenBindingKeys.has(key)) continue;
    seenBindingKeys.add(key);
    const binding = await deps.bindingStore.read(candidate.identity);
    if (!binding?.threadId || seenThreadIds.has(binding.threadId)) continue;
    seenThreadIds.add(binding.threadId);
    targets.push(resolveCodexDiagnosticsTarget(candidate, binding, ctx.config));
  }
  return targets;
}
async function resolvePendingCodexDiagnosticsTargets(deps, targets, config) {
  const resolved = [];
  for (const target of targets) {
    const binding = await deps.bindingStore.read(target.identity);
    if (!binding?.threadId) continue;
    resolved.push(resolveCodexDiagnosticsTarget(target, binding, config));
  }
  return resolved;
}
function resolveCodexDiagnosticsTarget(target, binding, config) {
  const candidate = {
    identity: target.identity,
    agentDir: target.agentDir,
    sessionKey: target.sessionKey,
    sessionId: target.sessionId,
    channel: target.channel,
    channelId: target.channelId,
    accountId: target.accountId,
    messageThreadId: target.messageThreadId,
    threadParentId: target.threadParentId,
  };
  if (binding.connectionScope === "supervision")
    return {
      ...candidate,
      threadId: binding.threadId,
      connectionScope: binding.connectionScope,
      appServerRuntimeFingerprint: binding.appServerRuntimeFingerprint,
      pendingSupervisionBranch: binding.pendingSupervisionBranch,
    };
  const authProfileId = resolveCodexAppServerAuthProfileIdForAgent({
    authProfileId: binding.authProfileId,
    agentDir: target.agentDir,
    config,
  });
  return {
    ...candidate,
    threadId: binding.threadId,
    authProfileId,
  };
}
function codexDiagnosticsTargetsMatch(expected, actual) {
  const fingerprint = (target) =>
    JSON.stringify([
      bindingStoreKey(target.identity),
      target.threadId,
      target.connectionScope ?? null,
      target.pendingSupervisionBranch?.connectionFingerprint ??
        target.appServerRuntimeFingerprint ??
        null,
      target.authProfileId ?? null,
    ]);
  const expectedTargets = expected.map(fingerprint).toSorted();
  const actualTargets = actual.map(fingerprint).toSorted();
  return (
    expectedTargets.length === actualTargets.length &&
    expectedTargets.every((target, index) => target === actualTargets[index])
  );
}
function formatCodexDiagnosticsUploadResult(sent, failed) {
  const lines = [];
  if (sent.length > 0) {
    lines.push("Codex diagnostics sent to OpenAI servers:");
    lines.push(...formatCodexDiagnosticsTargetLines(sent));
    lines.push("Included Codex logs and spawned Codex subthreads when available.");
  }
  if (failed.length > 0) {
    if (lines.length > 0) lines.push("");
    lines.push("Could not send Codex diagnostics:");
    lines.push(
      ...failed.map(
        ({ target, error }) =>
          `${formatCodexDiagnosticsTargetLine(target)}: ${formatCodexErrorForDisplay(error)}`,
      ),
    );
    lines.push("Inspect locally:");
    lines.push(
      ...failed.map(({ target }) => `- ${formatCodexResumeCommandForDisplay(target.threadId)}`),
    );
  }
  return lines.join("\n");
}
function formatCodexDiagnosticsTargetLines(targets) {
  return targets.flatMap((target, index) => {
    const lines = formatCodexDiagnosticsTargetBlock(target, index);
    return index < targets.length - 1 ? [...lines, ""] : lines;
  });
}
function formatCodexDiagnosticsTargetBlock(target, index) {
  const lines = [`Session ${index + 1}`];
  if (target.channel) lines.push(`Channel: ${formatCodexValueForDisplay(target.channel)}`);
  if (target.sessionKey)
    lines.push(`OpenClaw session key: ${formatCodexCopyableValueForDisplay(target.sessionKey)}`);
  if (target.sessionId)
    lines.push(`OpenClaw session id: ${formatCodexCopyableValueForDisplay(target.sessionId)}`);
  lines.push(`Codex thread id: ${formatCodexCopyableValueForDisplay(target.threadId)}`);
  lines.push(`Inspect locally: ${formatCodexResumeCommandForDisplay(target.threadId)}`);
  return lines;
}
function formatCodexDiagnosticsTargetLine(target) {
  const parts = [];
  if (target.channel) parts.push(`channel ${formatCodexValueForDisplay(target.channel)}`);
  const sessionLabel = target.sessionId || target.sessionKey;
  if (sessionLabel) parts.push(`OpenClaw session ${formatCodexValueForDisplay(sessionLabel)}`);
  parts.push(`Codex thread ${formatCodexThreadIdForDisplay(target.threadId)}`);
  return `- ${parts.join(", ")}`;
}
function normalizeDiagnosticsReason(note) {
  const normalized = normalizeOptionalString(note);
  return normalized ? truncateUtf16Safe(normalized, CODEX_DIAGNOSTICS_REASON_MAX_CHARS) : void 0;
}
function parseDiagnosticsArgs(args) {
  const [action, token, ...extra] = splitArgs(args);
  const normalizedAction = action?.toLowerCase();
  if (
    (normalizedAction === "confirm" || normalizedAction === "--confirm") &&
    token &&
    extra.length === 0
  )
    return {
      action: "confirm",
      token,
    };
  if (
    (normalizedAction === "cancel" || normalizedAction === "--cancel") &&
    token &&
    extra.length === 0
  )
    return {
      action: "cancel",
      token,
    };
  if (
    normalizedAction === "confirm" ||
    normalizedAction === "--confirm" ||
    normalizedAction === "cancel" ||
    normalizedAction === "--cancel"
  )
    return { action: "usage" };
  return {
    action: "request",
    note: args,
  };
}
function formatDiagnosticsUsage(commandPrefix) {
  return [
    `Usage: ${commandPrefix} [note]`,
    `Usage: ${commandPrefix} confirm <token>`,
    `Usage: ${commandPrefix} cancel <token>`,
  ].join("\n");
}
function createCodexDiagnosticsConfirmation(params) {
  prunePendingCodexDiagnosticsConfirmations(params.now);
  if (
    !pendingCodexDiagnosticsConfirmationTokensByScope.has(params.scopeKey) &&
    pendingCodexDiagnosticsConfirmationTokensByScope.size >=
      CODEX_DIAGNOSTICS_CONFIRMATION_MAX_SCOPES
  ) {
    const oldestScopeKey = pendingCodexDiagnosticsConfirmationTokensByScope.keys().next().value;
    if (typeof oldestScopeKey === "string")
      deletePendingCodexDiagnosticsConfirmationScope(oldestScopeKey);
  }
  const scopeTokens = pendingCodexDiagnosticsConfirmationTokensByScope.get(params.scopeKey) ?? [];
  while (scopeTokens.length >= CODEX_DIAGNOSTICS_CONFIRMATION_MAX_REQUESTS_PER_SCOPE) {
    const oldestToken = scopeTokens.shift();
    if (!oldestToken) break;
    pendingCodexDiagnosticsConfirmations.delete(oldestToken);
  }
  const token = crypto.randomBytes(6).toString("hex");
  scopeTokens.push(token);
  pendingCodexDiagnosticsConfirmationTokensByScope.set(params.scopeKey, scopeTokens);
  pendingCodexDiagnosticsConfirmations.set(token, {
    token,
    targets: params.targets,
    note: params.note,
    senderId: params.senderId,
    channel: params.channel,
    accountId: params.accountId,
    channelId: params.channelId,
    messageThreadId: params.messageThreadId,
    threadParentId: params.threadParentId,
    sessionKey: params.sessionKey,
    scopeKey: params.scopeKey,
    ...(params.privateRouted === void 0 ? {} : { privateRouted: params.privateRouted }),
    createdAt: params.now,
  });
  return token;
}
function readCodexDiagnosticsConfirmationScope(ctx) {
  return {
    accountId: normalizeCodexDiagnosticsScopeField(ctx.accountId),
    channelId: normalizeCodexDiagnosticsScopeField(ctx.channelId),
    messageThreadId:
      typeof ctx.messageThreadId === "string" || typeof ctx.messageThreadId === "number"
        ? normalizeCodexDiagnosticsScopeField(String(ctx.messageThreadId))
        : void 0,
    threadParentId: normalizeCodexDiagnosticsScopeField(ctx.threadParentId),
    sessionKey: normalizeCodexDiagnosticsScopeField(ctx.sessionKey),
  };
}
function readCodexDiagnosticsScopeMismatch(pending, ctx) {
  const current = readCodexDiagnosticsConfirmationScope(ctx);
  if (pending.accountId !== current.accountId)
    return {
      confirmMessage: "This Codex diagnostics confirmation belongs to a different account.",
      cancelMessage: "This Codex diagnostics confirmation belongs to a different account.",
    };
  if (pending.privateRouted) return;
  if (pending.channelId !== current.channelId)
    return {
      confirmMessage:
        "This Codex diagnostics confirmation belongs to a different channel instance.",
      cancelMessage: "This Codex diagnostics confirmation belongs to a different channel instance.",
    };
  if (pending.messageThreadId !== current.messageThreadId)
    return {
      confirmMessage: "This Codex diagnostics confirmation belongs to a different thread.",
      cancelMessage: "This Codex diagnostics confirmation belongs to a different thread.",
    };
  if (pending.threadParentId !== current.threadParentId)
    return {
      confirmMessage: "This Codex diagnostics confirmation belongs to a different parent thread.",
      cancelMessage: "This Codex diagnostics confirmation belongs to a different parent thread.",
    };
  if (pending.sessionKey !== current.sessionKey)
    return {
      confirmMessage: "This Codex diagnostics confirmation belongs to a different session.",
      cancelMessage: "This Codex diagnostics confirmation belongs to a different session.",
    };
}
function readPendingCodexDiagnosticsConfirmation(token, now) {
  prunePendingCodexDiagnosticsConfirmations(now);
  return pendingCodexDiagnosticsConfirmations.get(token);
}
function prunePendingCodexDiagnosticsConfirmations(now) {
  for (const [token, pending] of pendingCodexDiagnosticsConfirmations)
    if (now - pending.createdAt >= CODEX_DIAGNOSTICS_CONFIRMATION_TTL_MS)
      deletePendingCodexDiagnosticsConfirmation(token);
}
function deletePendingCodexDiagnosticsConfirmation(token) {
  const pending = pendingCodexDiagnosticsConfirmations.get(token);
  pendingCodexDiagnosticsConfirmations.delete(token);
  if (!pending) return;
  const scopeTokens = pendingCodexDiagnosticsConfirmationTokensByScope.get(pending.scopeKey);
  if (!scopeTokens) return;
  const tokenIndex = scopeTokens.indexOf(token);
  if (tokenIndex >= 0) scopeTokens.splice(tokenIndex, 1);
  if (scopeTokens.length === 0)
    pendingCodexDiagnosticsConfirmationTokensByScope.delete(pending.scopeKey);
}
function deletePendingCodexDiagnosticsConfirmationScope(scopeKey) {
  const scopeTokens = pendingCodexDiagnosticsConfirmationTokensByScope.get(scopeKey) ?? [];
  for (const token of scopeTokens) pendingCodexDiagnosticsConfirmations.delete(token);
  pendingCodexDiagnosticsConfirmationTokensByScope.delete(scopeKey);
}
function buildDiagnosticsTags(ctx) {
  const tags = { source: CODEX_DIAGNOSTICS_SOURCE };
  addTag(tags, "channel", ctx.channel);
  return tags;
}
function addTag(tags, key, value) {
  if (typeof value === "string" && value.trim()) tags[key] = value.trim();
}
function formatCodexThreadIdForDisplay(threadId) {
  return escapeCodexChatText(formatCodexTextForDisplay(threadId));
}
function formatCodexValueForDisplay(value) {
  return escapeCodexChatText(formatCodexTextForDisplay(value));
}
function formatCodexCopyableValueForDisplay(value) {
  const safe = formatCodexTextForDisplay(value);
  if (CODEX_RESUME_SAFE_THREAD_ID_PATTERN.test(safe)) return `\`${safe}\``;
  return escapeCodexChatText(safe);
}
function formatCodexTextForDisplay(value) {
  let safe = "";
  for (const character of value) {
    const codePoint = character.codePointAt(0);
    safe += codePoint != null && isUnsafeDisplayCodePoint(codePoint) ? "?" : character;
  }
  safe = safe.trim();
  return safe || "<unknown>";
}
function escapeCodexChatText(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("@", "＠")
    .replaceAll("`", "｀")
    .replaceAll("[", "［")
    .replaceAll("]", "］")
    .replaceAll("(", "（")
    .replaceAll(")", "）")
    .replaceAll("*", "∗")
    .replaceAll("_", "＿")
    .replaceAll("~", "～")
    .replaceAll("|", "｜");
}
function readCodexDiagnosticsCooldownMs(threadId, now) {
  const lastSentAt = lastCodexDiagnosticsUploadByThread.get(threadId);
  if (!lastSentAt) return 0;
  const remainingMs = Math.max(0, CODEX_DIAGNOSTICS_COOLDOWN_MS - (now - lastSentAt));
  if (remainingMs === 0) lastCodexDiagnosticsUploadByThread.delete(threadId);
  return remainingMs;
}
function readCodexDiagnosticsTargetsCooldownMessage(targets, ctx, now, options = {}) {
  for (const target of targets) {
    const cooldownMs = readCodexDiagnosticsCooldownMs(target.threadId, now);
    if (cooldownMs > 0) {
      if (options.includeThreadId === false)
        return `Codex diagnostics were already sent for one of these Codex threads recently. Try again in ${Math.ceil(cooldownMs / 1e3)}s.`;
      return `Codex diagnostics were already sent for thread ${formatCodexThreadIdForDisplay(target.threadId)} recently. Try again in ${Math.ceil(cooldownMs / 1e3)}s.`;
    }
  }
  const scopeCooldownMs = readCodexDiagnosticsScopeCooldownMs(
    options.cooldownScope ?? readCodexDiagnosticsCooldownScope(ctx),
    now,
  );
  if (scopeCooldownMs > 0)
    return `Codex diagnostics were already sent for this account or channel recently. Try again in ${Math.ceil(scopeCooldownMs / 1e3)}s.`;
}
function readCodexDiagnosticsScopeCooldownMs(scope, now) {
  const lastSentAt = lastCodexDiagnosticsUploadByScope.get(scope);
  if (!lastSentAt) return 0;
  const remainingMs = Math.max(0, CODEX_DIAGNOSTICS_COOLDOWN_MS - (now - lastSentAt));
  if (remainingMs === 0) lastCodexDiagnosticsUploadByScope.delete(scope);
  return remainingMs;
}
function recordCodexDiagnosticsUpload(threadId, ctx, now, cooldownScope) {
  pruneCodexDiagnosticsCooldowns(now);
  recordBoundedCodexDiagnosticsCooldown(
    lastCodexDiagnosticsUploadByScope,
    cooldownScope ?? readCodexDiagnosticsCooldownScope(ctx),
    CODEX_DIAGNOSTICS_COOLDOWN_MAX_SCOPES,
    now,
  );
  recordBoundedCodexDiagnosticsCooldown(
    lastCodexDiagnosticsUploadByThread,
    threadId,
    CODEX_DIAGNOSTICS_COOLDOWN_MAX_THREADS,
    now,
  );
}
function recordBoundedCodexDiagnosticsCooldown(map, key, maxSize, now) {
  if (!map.has(key))
    while (map.size >= maxSize) {
      const oldestKey = map.keys().next().value;
      if (typeof oldestKey !== "string") break;
      map.delete(oldestKey);
    }
  map.set(key, now);
}
function readCodexDiagnosticsCooldownScope(ctx) {
  const scope = readCodexDiagnosticsConfirmationScope(ctx);
  const payload = JSON.stringify({
    accountId: scope.accountId ?? null,
    channelId: scope.channelId ?? null,
    sessionKey: scope.sessionKey ?? null,
    messageThreadId: scope.messageThreadId ?? null,
    threadParentId: scope.threadParentId ?? null,
    senderId: normalizeCodexDiagnosticsScopeField(ctx.senderId) ?? null,
    channel: normalizeCodexDiagnosticsScopeField(ctx.channel) ?? "",
  });
  return crypto.createHash("sha256").update(payload).digest("hex");
}
function pruneCodexDiagnosticsCooldowns(now) {
  pruneCodexDiagnosticsCooldownMap(lastCodexDiagnosticsUploadByThread, now);
  pruneCodexDiagnosticsCooldownMap(lastCodexDiagnosticsUploadByScope, now);
}
function pruneCodexDiagnosticsCooldownMap(map, now) {
  for (const [key, lastSentAt] of map)
    if (now - lastSentAt >= CODEX_DIAGNOSTICS_COOLDOWN_MS) map.delete(key);
}
function formatCodexErrorForDisplay(error) {
  return (
    escapeCodexChatText(
      truncateUtf16Safe(formatCodexTextForDisplay(error), CODEX_DIAGNOSTICS_ERROR_MAX_CHARS),
    ) || "unknown error"
  );
}
function formatCodexResumeCommandForDisplay(threadId) {
  const safeThreadId = formatCodexTextForDisplay(threadId);
  if (!CODEX_RESUME_SAFE_THREAD_ID_PATTERN.test(safeThreadId))
    return "run codex resume and paste the thread id shown above";
  return `\`codex resume ${safeThreadId}\``;
}
function isUnsafeDisplayCodePoint(codePoint) {
  return (
    codePoint <= 31 ||
    (codePoint >= 127 && codePoint <= 159) ||
    codePoint === 173 ||
    codePoint === 1564 ||
    codePoint === 6158 ||
    (codePoint >= 8203 && codePoint <= 8207) ||
    (codePoint >= 8234 && codePoint <= 8238) ||
    (codePoint >= 8288 && codePoint <= 8303) ||
    codePoint === 65279 ||
    (codePoint >= 65529 && codePoint <= 65531) ||
    (codePoint >= 917504 && codePoint <= 917631)
  );
}
function normalizeCodexDiagnosticsScopeField(value) {
  const normalized = normalizeOptionalString(value);
  if (!normalized) return;
  if (normalized.length <= CODEX_DIAGNOSTICS_SCOPE_FIELD_MAX_CHARS) return normalized;
  return `sha256:${crypto.createHash("sha256").update(normalized).digest("hex")}`;
}
async function startThreadAction(deps, ctx, pluginConfig, kind, args) {
  const label = kind === "compact" ? "compaction" : "review";
  if (args.length > 0) return `Usage: /codex ${label === "compaction" ? "compact" : label}`;
  const target = await resolveControlTarget(ctx);
  if (!target)
    return `Cannot start Codex ${label} because this command did not include a stable binding identity.`;
  const binding = await deps.bindingStore.read(target.identity);
  if (!binding?.threadId) return `No Codex thread is attached to this OpenClaw session yet.`;
  const connection = resolveCodexBindingAppServerConnection({
    binding,
    authProfileId: binding.authProfileId,
    pluginConfig,
  });
  await deps.codexControlRequest(
    pluginConfig,
    kind === "compact" ? CODEX_CONTROL_METHODS.compact : CODEX_CONTROL_METHODS.review,
    kind === "review"
      ? {
          threadId: binding.threadId,
          target: { type: "uncommittedChanges" },
        }
      : { threadId: binding.threadId },
    {
      agentDir: target.agentDir,
      authProfileId: connection.clientAuthProfileId,
      config: ctx.config,
      ...(connection.usesSupervisionConnection ? { startOptions: connection.appServer.start } : {}),
    },
  );
  return `Started Codex ${label} for thread ${formatCodexDisplayText(binding.threadId)}.`;
}
function splitArgs(value) {
  const input = value ?? "";
  const args = [];
  let current = "";
  let quote;
  let escaping = false;
  let tokenStarted = false;
  for (const char of input) {
    if (escaping) {
      current += char;
      escaping = false;
      tokenStarted = true;
      continue;
    }
    if (char === "\\" && quote !== "'") {
      escaping = true;
      tokenStarted = true;
      continue;
    }
    if (quote) {
      if (char === quote) quote = void 0;
      else current += char;
      tokenStarted = true;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      tokenStarted = true;
      continue;
    }
    if (/\s/.test(char)) {
      if (tokenStarted) {
        args.push(current);
        current = "";
        tokenStarted = false;
      }
      continue;
    }
    current += char;
    tokenStarted = true;
  }
  if (escaping) current += "\\";
  if (tokenStarted) args.push(current);
  return args;
}
function parseBindArgs(args) {
  const parsed = {};
  for (let index = 0; index < args.length; index += 1) {
    const arg = expectDefined(args[index], "current Codex bind argument");
    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
      continue;
    }
    if (arg === "--cwd") {
      const value = readRequiredOptionValue(args, index);
      if (!value || parsed.cwd !== void 0) {
        parsed.help = true;
        continue;
      }
      parsed.cwd = value;
      index += 1;
      continue;
    }
    if (arg === "--model") {
      const value = readRequiredOptionValue(args, index);
      if (!value || parsed.model !== void 0) {
        parsed.help = true;
        continue;
      }
      parsed.model = value;
      index += 1;
      continue;
    }
    if (arg === "--provider" || arg === "--model-provider") {
      const value = readRequiredOptionValue(args, index);
      if (!value || parsed.provider !== void 0) {
        parsed.help = true;
        continue;
      }
      parsed.provider = value;
      index += 1;
      continue;
    }
    if (!arg.startsWith("-") && !parsed.threadId) {
      parsed.threadId = arg;
      continue;
    }
    parsed.help = true;
  }
  parsed.threadId = normalizeOptionalString(parsed.threadId);
  parsed.cwd = normalizeOptionalString(parsed.cwd);
  parsed.model = normalizeOptionalString(parsed.model);
  parsed.provider = normalizeOptionalString(parsed.provider);
  return parsed;
}
function parseCodexCliSessionsArgs(args) {
  const parsed = { filter: "" };
  const filter = [];
  for (let index = 0; index < args.length; index += 1) {
    const arg = expectDefined(args[index], "current Codex sessions argument");
    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
      continue;
    }
    if (arg === "--host" || arg === "--node") {
      const value = readRequiredOptionValue(args, index);
      if (!value || parsed.host !== void 0) {
        parsed.help = true;
        continue;
      }
      parsed.host = value;
      index += 1;
      continue;
    }
    if (arg === "--limit") {
      const parsedLimit = parseStrictPositiveInteger(readRequiredOptionValue(args, index));
      if (parsedLimit === void 0) {
        parsed.help = true;
        continue;
      }
      parsed.limit = parsedLimit;
      index += 1;
      continue;
    }
    if (arg.startsWith("-")) {
      parsed.help = true;
      continue;
    }
    filter.push(arg);
  }
  parsed.host = normalizeOptionalString(parsed.host);
  parsed.filter = filter.join(" ").trim();
  return parsed;
}
function parseResumeArgs(args) {
  const parsed = {};
  for (let index = 0; index < args.length; index += 1) {
    const arg = expectDefined(args[index], "current Codex resume argument");
    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
      continue;
    }
    if (arg === "--host" || arg === "--node") {
      const value = readRequiredOptionValue(args, index);
      if (!value || parsed.host !== void 0) {
        parsed.help = true;
        continue;
      }
      parsed.host = value;
      index += 1;
      continue;
    }
    if (arg === "--bind") {
      if (readRequiredOptionValue(args, index) !== "here" || parsed.bindHere !== void 0) {
        parsed.help = true;
        continue;
      }
      parsed.bindHere = true;
      index += 1;
      continue;
    }
    if (!arg.startsWith("-") && !parsed.threadId) {
      parsed.threadId = arg;
      continue;
    }
    parsed.help = true;
  }
  parsed.threadId = normalizeOptionalString(parsed.threadId);
  parsed.host = normalizeOptionalString(parsed.host);
  return parsed;
}
function parseComputerUseArgs(args) {
  const parsed = {
    action: "status",
    overrides: {},
    hasOverrides: false,
    persistentIdentity: {},
  };
  let sawAction = false;
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
      continue;
    }
    if (arg === "status" || arg === "install") {
      if (sawAction) {
        parsed.help = true;
        continue;
      }
      sawAction = true;
      parsed.action = arg;
      continue;
    }
    if (arg === "--source" || arg === "--marketplace-source") {
      const value = readRequiredOptionValue(args, index);
      if (!value || parsed.overrides.marketplaceSource !== void 0) {
        parsed.help = true;
        continue;
      }
      parsed.overrides.marketplaceSource = value;
      index += 1;
      continue;
    }
    if (arg === "--marketplace-path" || arg === "--path") {
      const value = readRequiredOptionValue(args, index);
      if (!value || parsed.overrides.marketplacePath !== void 0) {
        parsed.help = true;
        continue;
      }
      parsed.overrides.marketplacePath = value;
      index += 1;
      continue;
    }
    if (arg === "--marketplace") {
      const value = readRequiredOptionValue(args, index);
      if (!value || parsed.overrides.marketplaceName !== void 0) {
        parsed.help = true;
        continue;
      }
      parsed.overrides.marketplaceName = value;
      index += 1;
      continue;
    }
    if (arg === "--plugin" || arg === "--server" || arg === "--mcp-server") {
      const value = readRequiredOptionValue(args, index);
      const configKey = arg === "--plugin" ? "pluginName" : "mcpServerName";
      if (!value || parsed.persistentIdentity[configKey] !== void 0) {
        parsed.help = true;
        continue;
      }
      parsed.persistentIdentity[configKey] = value.trim();
      index += 1;
      continue;
    }
    parsed.help = true;
  }
  parsed.overrides = normalizeComputerUseStringOverrides(parsed.overrides);
  parsed.hasOverrides = Object.values(parsed.overrides).some(Boolean);
  return parsed;
}
function formatComputerUsePersistentIdentityMigration(parsed) {
  const configPrefix = "plugins.entries.codex.config.computerUse";
  const settings = [
    parsed.persistentIdentity.pluginName
      ? `${configPrefix}.pluginName = ${JSON.stringify(parsed.persistentIdentity.pluginName)}`
      : void 0,
    parsed.persistentIdentity.mcpServerName
      ? `${configPrefix}.mcpServerName = ${JSON.stringify(parsed.persistentIdentity.mcpServerName)}`
      : void 0,
  ].filter((setting) => Boolean(setting));
  const retryArgs = [
    `/codex computer-use ${parsed.action}`,
    parsed.overrides.marketplaceSource
      ? `--source ${JSON.stringify(parsed.overrides.marketplaceSource)}`
      : void 0,
    parsed.overrides.marketplacePath
      ? `--marketplace-path ${JSON.stringify(parsed.overrides.marketplacePath)}`
      : void 0,
    parsed.overrides.marketplaceName
      ? `--marketplace ${JSON.stringify(parsed.overrides.marketplaceName)}`
      : void 0,
  ].filter((arg) => Boolean(arg));
  return [
    "One-off Computer Use plugin/server overrides are no longer supported.",
    `Set ${settings.join(" and ")} persistently, then rerun ${retryArgs.join(" ")}.`,
  ].join(" ");
}
function readRequiredOptionValue(args, index) {
  const value = args[index + 1];
  const normalized = value?.trim();
  if (!normalized || normalized.startsWith("-")) return;
  return value;
}
function normalizeComputerUseStringOverrides(overrides) {
  const normalized = {};
  const marketplaceSource = normalizeOptionalString(overrides.marketplaceSource);
  if (marketplaceSource) normalized.marketplaceSource = marketplaceSource;
  const marketplacePath = normalizeOptionalString(overrides.marketplacePath);
  if (marketplacePath) normalized.marketplacePath = marketplacePath;
  const marketplaceName = normalizeOptionalString(overrides.marketplaceName);
  if (marketplaceName) normalized.marketplaceName = marketplaceName;
  return normalized;
}
//#endregion
export { handleCodexSubcommand };
