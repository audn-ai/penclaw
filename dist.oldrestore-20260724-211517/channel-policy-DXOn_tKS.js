import { t as sanitizeForLog } from "./ansi-D4OHEz5F.js";
import { l as createScopedDmSecurityResolver } from "./channel-config-helpers-BFvX3ldW.js";
import { t as collectProviderDangerousNameMatchingScopes } from "./dangerous-name-matching-Z6nhxFXz.js";
import { a as resolveToolsBySender, i as resolveChannelGroups } from "./group-policy-7QrY--DR.js";
import {
  i as resolveOpenProviderRuntimeGroupPolicy,
  n as resolveAllowlistProviderRuntimeGroupPolicy,
  r as resolveDefaultGroupPolicy,
} from "./runtime-group-policy-BEjP88cf.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import "./channel-access-compat-Btt8XWBu.js";
import {
  _ as uniqueStrings,
  l as normalizeStringEntries,
} from "./string-normalization-CRyoFBPt.js";
//#region src/channels/plugins/group-policy-warnings.ts
/**
 * Channel group-policy warning collectors.
 *
 * Composes warning helpers for default, allowlist, and open-provider group policy states.
 */
function composeWarningCollectors(...collectors) {
  return (params) => collectors.flatMap((collector) => collector?.(params) ?? []);
}
function projectWarningCollector(project, collector) {
  return (params) => collector(project(params));
}
function projectConfigWarningCollector(collector) {
  return projectWarningCollector((params) => ({ cfg: params.cfg }), collector);
}
function projectConfigAccountIdWarningCollector(collector) {
  return projectWarningCollector(
    (params) => ({
      cfg: params.cfg,
      accountId: params.accountId,
    }),
    collector,
  );
}
function projectAccountWarningCollector(collector) {
  return projectWarningCollector((params) => params.account, collector);
}
function projectAccountConfigWarningCollector(projectCfg, collector) {
  return projectWarningCollector(
    (params) => ({
      account: params.account,
      cfg: projectCfg(params.cfg),
    }),
    collector,
  );
}
function createConditionalWarningCollector(...collectors) {
  return (params) =>
    collectors.flatMap((collector) => {
      const next = collector(params);
      if (!next) return [];
      return Array.isArray(next) ? next : [next];
    });
}
function composeAccountWarningCollectors(baseCollector, ...collectors) {
  return composeWarningCollectors(
    baseCollector,
    createConditionalWarningCollector(
      ...collectors.map(
        (collector) =>
          ({ account }) =>
            collector(account),
      ),
    ),
  );
}
function buildOpenGroupPolicyWarning(params) {
  return `- ${params.surface}: groupPolicy="open" ${params.openBehavior}. ${params.remediation}.`;
}
function buildOpenGroupPolicyRestrictSendersWarning(params) {
  const mentionSuffix = params.mentionGated === false ? "" : " (mention-gated)";
  return buildOpenGroupPolicyWarning({
    surface: params.surface,
    openBehavior: `allows ${params.openScope} to trigger${mentionSuffix}`,
    remediation: `Set ${params.groupPolicyPath}="allowlist" + ${params.groupAllowFromPath} to restrict senders`,
  });
}
function buildOpenGroupPolicyNoRouteAllowlistWarning(params) {
  const mentionSuffix = params.mentionGated === false ? "" : " (mention-gated)";
  return buildOpenGroupPolicyWarning({
    surface: params.surface,
    openBehavior: `with no ${params.routeAllowlistPath} allowlist; any ${params.routeScope} can add + ping${mentionSuffix}`,
    remediation: `Set ${params.groupPolicyPath}="allowlist" + ${params.groupAllowFromPath} or configure ${params.routeAllowlistPath}`,
  });
}
function buildOpenGroupPolicyConfigureRouteAllowlistWarning(params) {
  const mentionSuffix = params.mentionGated === false ? "" : " (mention-gated)";
  return buildOpenGroupPolicyWarning({
    surface: params.surface,
    openBehavior: `allows ${params.openScope} to trigger${mentionSuffix}`,
    remediation: `Set ${params.groupPolicyPath}="allowlist" and configure ${params.routeAllowlistPath}`,
  });
}
function collectOpenGroupPolicyRestrictSendersWarnings(params) {
  if (params.groupPolicy !== "open") return [];
  return [buildOpenGroupPolicyRestrictSendersWarning(params)];
}
function collectAllowlistProviderRestrictSendersWarnings(params) {
  return collectAllowlistProviderGroupPolicyWarnings({
    cfg: params.cfg,
    providerConfigPresent: params.providerConfigPresent,
    configuredGroupPolicy: params.configuredGroupPolicy,
    collect: (groupPolicy) =>
      collectOpenGroupPolicyRestrictSendersWarnings({
        groupPolicy,
        surface: params.surface,
        openScope: params.openScope,
        groupPolicyPath: params.groupPolicyPath,
        groupAllowFromPath: params.groupAllowFromPath,
        mentionGated: params.mentionGated,
      }),
  });
}
/** Build an account-aware allowlist-provider warning collector for sender-restricted groups. */
function createAllowlistProviderRestrictSendersWarningCollector(params) {
  return createAllowlistProviderGroupPolicyWarningCollector({
    providerConfigPresent: params.providerConfigPresent,
    resolveGroupPolicy: ({ account }) => params.resolveGroupPolicy(account),
    collect: ({ groupPolicy }) =>
      collectOpenGroupPolicyRestrictSendersWarnings({
        groupPolicy,
        surface: params.surface,
        openScope: params.openScope,
        groupPolicyPath: params.groupPolicyPath,
        groupAllowFromPath: params.groupAllowFromPath,
        mentionGated: params.mentionGated,
      }),
  });
}
/** Build a direct account-aware warning collector when the policy already lives on the account. */
function createOpenGroupPolicyRestrictSendersWarningCollector(params) {
  return (account) =>
    collectOpenGroupPolicyRestrictSendersWarnings({
      groupPolicy: params.resolveGroupPolicy(account) ?? params.defaultGroupPolicy ?? "allowlist",
      surface: params.surface,
      openScope: params.openScope,
      groupPolicyPath: params.groupPolicyPath,
      groupAllowFromPath: params.groupAllowFromPath,
      mentionGated: params.mentionGated,
    });
}
function collectAllowlistProviderGroupPolicyWarnings(params) {
  const defaultGroupPolicy = resolveDefaultGroupPolicy(params.cfg);
  const { groupPolicy } = resolveAllowlistProviderRuntimeGroupPolicy({
    providerConfigPresent: params.providerConfigPresent,
    groupPolicy: params.configuredGroupPolicy ?? void 0,
    defaultGroupPolicy,
  });
  return params.collect(groupPolicy);
}
/** Build a config-aware allowlist-provider warning collector from an arbitrary policy resolver. */
function createAllowlistProviderGroupPolicyWarningCollector(params) {
  return (runtime) =>
    collectAllowlistProviderGroupPolicyWarnings({
      cfg: runtime.cfg,
      providerConfigPresent: params.providerConfigPresent(runtime.cfg),
      configuredGroupPolicy: params.resolveGroupPolicy(runtime),
      collect: (groupPolicy) =>
        params.collect({
          ...runtime,
          groupPolicy,
        }),
    });
}
function collectOpenProviderGroupPolicyWarnings(params) {
  const defaultGroupPolicy = resolveDefaultGroupPolicy(params.cfg);
  const { groupPolicy } = resolveOpenProviderRuntimeGroupPolicy({
    providerConfigPresent: params.providerConfigPresent,
    groupPolicy: params.configuredGroupPolicy ?? void 0,
    defaultGroupPolicy,
  });
  return params.collect(groupPolicy);
}
/** Build a config-aware open-provider warning collector from an arbitrary policy resolver. */
function createOpenProviderGroupPolicyWarningCollector(params) {
  return (runtime) =>
    collectOpenProviderGroupPolicyWarnings({
      cfg: runtime.cfg,
      providerConfigPresent: params.providerConfigPresent(runtime.cfg),
      configuredGroupPolicy: params.resolveGroupPolicy(runtime),
      collect: (groupPolicy) =>
        params.collect({
          ...runtime,
          groupPolicy,
        }),
    });
}
/** Build an account-aware allowlist-provider warning collector for simple open-policy warnings. */
function createAllowlistProviderOpenWarningCollector(params) {
  return createAllowlistProviderGroupPolicyWarningCollector({
    providerConfigPresent: params.providerConfigPresent,
    resolveGroupPolicy: ({ account }) => params.resolveGroupPolicy(account),
    collect: ({ groupPolicy }) =>
      groupPolicy === "open" ? [buildOpenGroupPolicyWarning(params.buildOpenWarning)] : [],
  });
}
function collectOpenGroupPolicyRouteAllowlistWarnings(params) {
  if (params.groupPolicy !== "open") return [];
  if (params.routeAllowlistConfigured)
    return [buildOpenGroupPolicyRestrictSendersWarning(params.restrictSenders)];
  return [buildOpenGroupPolicyNoRouteAllowlistWarning(params.noRouteAllowlist)];
}
/** Build an account-aware allowlist-provider warning collector for route-allowlisted groups. */
function createAllowlistProviderRouteAllowlistWarningCollector(params) {
  return createAllowlistProviderGroupPolicyWarningCollector({
    providerConfigPresent: params.providerConfigPresent,
    resolveGroupPolicy: ({ account }) => params.resolveGroupPolicy(account),
    collect: ({ account, groupPolicy }) =>
      collectOpenGroupPolicyRouteAllowlistWarnings({
        groupPolicy,
        routeAllowlistConfigured: params.resolveRouteAllowlistConfigured(account),
        restrictSenders: params.restrictSenders,
        noRouteAllowlist: params.noRouteAllowlist,
      }),
  });
}
function collectOpenGroupPolicyConfiguredRouteWarnings(params) {
  if (params.groupPolicy !== "open") return [];
  if (params.routeAllowlistConfigured)
    return [buildOpenGroupPolicyConfigureRouteAllowlistWarning(params.configureRouteAllowlist)];
  return [buildOpenGroupPolicyWarning(params.missingRouteAllowlist)];
}
/** Build an account-aware open-provider warning collector for configured-route channels. */
function createOpenProviderConfiguredRouteWarningCollector(params) {
  return createOpenProviderGroupPolicyWarningCollector({
    providerConfigPresent: params.providerConfigPresent,
    resolveGroupPolicy: ({ account }) => params.resolveGroupPolicy(account),
    collect: ({ account, groupPolicy }) =>
      collectOpenGroupPolicyConfiguredRouteWarnings({
        groupPolicy,
        routeAllowlistConfigured: params.resolveRouteAllowlistConfigured(account),
        configureRouteAllowlist: params.configureRouteAllowlist,
        missingRouteAllowlist: params.missingRouteAllowlist,
      }),
  });
}
//#endregion
//#region src/config/group-scope-tree.ts
function buildChannelGroupsScopeTree(cfg, channel, accountId) {
  const { "*": defaults, ...scopes } = resolveChannelGroups(cfg, channel, accountId) ?? {};
  return {
    defaults,
    scopes,
  };
}
function resolveScopeKeyCaseInsensitive(tree, key) {
  if (!key) return;
  if (Object.hasOwn(tree.scopes, key)) return key;
  const target = normalizeLowercaseStringOrEmpty(key);
  return Object.keys(tree.scopes).find(
    (scopeKey) => normalizeLowercaseStringOrEmpty(scopeKey) === target,
  );
}
function resolveFromScopes(params) {
  for (let index = params.path.length - 1; index >= 0; index -= 1) {
    const key = params.path[index];
    if (key === void 0 || !Object.hasOwn(params.tree.scopes, key)) continue;
    const node = params.tree.scopes[key];
    if (!node) continue;
    const value = params.resolveNode(node);
    if (value !== void 0) return value;
  }
  return params.tree.defaults ? params.resolveNode(params.tree.defaults) : void 0;
}
function resolveScopeRequireMention(params) {
  const { requireMentionOverride, overrideOrder = "after-config" } = params;
  const configuredMention = resolveFromScopes({
    tree: params.tree,
    path: params.path,
    resolveNode: (node) => node.requireMention,
  });
  if (overrideOrder === "before-config" && typeof requireMentionOverride === "boolean")
    return requireMentionOverride;
  if (typeof configuredMention === "boolean") return configuredMention;
  if (overrideOrder !== "before-config" && typeof requireMentionOverride === "boolean")
    return requireMentionOverride;
  if (
    params.configuredScopeDefaultsToNoMention &&
    params.path.some((key) => Object.hasOwn(params.tree.scopes, key))
  )
    return false;
  return true;
}
function resolveScopeToolsPolicy(params) {
  return resolveFromScopes({
    tree: params.tree,
    path: params.path,
    resolveNode: (node) =>
      resolveToolsBySender({
        toolsBySender: node.toolsBySender,
        senderId: params.senderId,
        senderName: params.senderName,
        senderUsername: params.senderUsername,
        senderE164: params.senderE164,
        messageProvider: params.messageProvider,
      }) ?? node.tools,
  });
}
function resolveScopeIntroHint(params) {
  return resolveFromScopes({
    tree: params.tree,
    path: params.path,
    resolveNode: (node) => node.introHint,
  });
}
//#endregion
//#region src/plugin-sdk/channel-policy.ts
/** Normalizes allowFrom entries into trimmed unique string identifiers. */
function normalizeAllowFromList(list) {
  if (!Array.isArray(list)) return [];
  return normalizeStringEntries(list);
}
/** Coerces native feature settings to the supported boolean/auto shape. */
function coerceNativeSetting(value) {
  if (value === true || value === false || value === "auto") return value;
}
function collectMutableAllowlistWarningLines(hits, channel) {
  if (hits.length === 0) return [];
  const exampleLines = hits
    .slice(0, 8)
    .map((hit) => `- ${sanitizeForLog(hit.path)}: ${sanitizeForLog(hit.entry)}`);
  const remaining =
    hits.length > 8 ? `- +${hits.length - 8} more mutable allowlist entries.` : null;
  const flagPaths = uniqueStrings(hits.map((hit) => hit.dangerousFlagPath));
  const flagHint =
    flagPaths.length === 1
      ? sanitizeForLog(flagPaths[0] ?? "")
      : `${sanitizeForLog(flagPaths[0] ?? "")} (and ${flagPaths.length - 1} other scope flags)`;
  return [
    `- Found ${hits.length} mutable allowlist ${hits.length === 1 ? "entry" : "entries"} across ${channel} while name matching is disabled by default.`,
    ...exampleLines,
    ...(remaining ? [remaining] : []),
    `- Option A (break-glass): enable ${flagHint}=true to keep name/email/nick matching.`,
    "- Option B (recommended): resolve names/emails/nicks to stable sender IDs and rewrite the allowlist entries.",
  ];
}
/**
 * Create a warning collector for mutable name/email/nick allowlists while stable-id matching is required.
 * Channel plugins provide a detector for entries that depend on dangerous name matching.
 */
function createDangerousNameMatchingMutableAllowlistWarningCollector(params) {
  return ({ cfg }) => {
    const hits = [];
    for (const scope of collectProviderDangerousNameMatchingScopes(cfg, params.channel)) {
      if (scope.dangerousNameMatchingEnabled) continue;
      for (const candidate of params.collectLists(scope)) {
        if (!Array.isArray(candidate.list)) continue;
        for (const entry of candidate.list) {
          const text = String(entry).trim();
          if (!text || text === "*" || !params.detector(text)) continue;
          hits.push({
            path: candidate.pathLabel,
            entry: text,
            dangerousFlagPath: scope.dangerousFlagPath,
          });
        }
      }
    }
    return collectMutableAllowlistWarningLines(hits, params.channel);
  };
}
/**
 * Compose the common account-scoped DM policy resolver with restrict-senders group warnings.
 * This is the shared adapter shape for channels whose DM security and group policy live together.
 */
function createRestrictSendersChannelSecurity(params) {
  return {
    resolveDmPolicy: createScopedDmSecurityResolver({
      channelKey: params.channelKey,
      resolvePolicy: params.resolveDmPolicy,
      resolveAllowFrom: params.resolveDmAllowFrom,
      resolveFallbackAccountId: params.resolveFallbackAccountId,
      defaultPolicy: params.defaultDmPolicy,
      allowFromPathSuffix: params.allowFromPathSuffix,
      policyPathSuffix: params.policyPathSuffix,
      approveChannelId: params.approveChannelId,
      approveHint: params.approveHint,
      normalizeEntry: params.normalizeDmEntry,
      inheritSharedDefaultsFromDefaultAccount: params.inheritSharedDefaultsFromDefaultAccount,
    }),
    collectWarnings: createAllowlistProviderRestrictSendersWarningCollector({
      providerConfigPresent:
        params.providerConfigPresent ?? ((cfg) => cfg.channels?.[params.channelKey] !== void 0),
      resolveGroupPolicy: params.resolveGroupPolicy,
      surface: params.surface,
      openScope: params.openScope,
      groupPolicyPath: params.groupPolicyPath,
      groupAllowFromPath: params.groupAllowFromPath,
      mentionGated: params.mentionGated,
    }),
  };
}
//#endregion
export {
  projectAccountWarningCollector as A,
  createAllowlistProviderRestrictSendersWarningCollector as C,
  createOpenProviderConfiguredRouteWarningCollector as D,
  createOpenGroupPolicyRestrictSendersWarningCollector as E,
  projectConfigWarningCollector as M,
  projectWarningCollector as N,
  createOpenProviderGroupPolicyWarningCollector as O,
  createAllowlistProviderOpenWarningCollector as S,
  createConditionalWarningCollector as T,
  collectOpenGroupPolicyRouteAllowlistWarnings as _,
  buildChannelGroupsScopeTree as a,
  composeWarningCollectors as b,
  resolveScopeRequireMention as c,
  buildOpenGroupPolicyRestrictSendersWarning as d,
  buildOpenGroupPolicyWarning as f,
  collectOpenGroupPolicyRestrictSendersWarnings as g,
  collectOpenGroupPolicyConfiguredRouteWarnings as h,
  normalizeAllowFromList as i,
  projectConfigAccountIdWarningCollector as j,
  projectAccountConfigWarningCollector as k,
  resolveScopeToolsPolicy as l,
  collectAllowlistProviderRestrictSendersWarnings as m,
  createDangerousNameMatchingMutableAllowlistWarningCollector as n,
  resolveScopeIntroHint as o,
  collectAllowlistProviderGroupPolicyWarnings as p,
  createRestrictSendersChannelSecurity as r,
  resolveScopeKeyCaseInsensitive as s,
  coerceNativeSetting as t,
  buildOpenGroupPolicyConfigureRouteAllowlistWarning as u,
  collectOpenProviderGroupPolicyWarnings as v,
  createAllowlistProviderRouteAllowlistWarningCollector as w,
  createAllowlistProviderGroupPolicyWarningCollector as x,
  composeAccountWarningCollectors as y,
};
