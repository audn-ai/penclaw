import { a as resolveLegacyAuthChoiceAliasesForCli } from "./auth-choice-legacy-CW2uqEG-.js";
import {
  c as normalizePluginsConfig,
  l as resolveEffectiveEnableState,
} from "./config-state-C1Qyxaws.js";
import { r as resolveManifestProviderAuthChoices } from "./provider-auth-choices-LxMRetjr.js";
import { n as resolveProviderInstallCatalogEntries } from "./provider-install-catalog-BrWdgyBm.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { t as sortFlowContributionsByLabel } from "./types-CnTXyUgM.js";
//#region src/flows/provider-flow.ts
const DEFAULT_PROVIDER_FLOW_SCOPE = "text-inference";
function includesProviderFlowScope(scopes, scope) {
  return scopes ? scopes.includes(scope) : scope === DEFAULT_PROVIDER_FLOW_SCOPE;
}
function resolveInstallCatalogProviderSetupFlowContributions(params) {
  const scope = params?.scope ?? DEFAULT_PROVIDER_FLOW_SCOPE;
  const normalizedPluginsConfig = normalizePluginsConfig(params?.config?.plugins);
  return resolveProviderInstallCatalogEntries({
    ...params,
    includeUntrustedWorkspacePlugins: false,
  })
    .filter(
      (entry) =>
        includesProviderFlowScope(entry.onboardingScopes, scope) &&
        resolveEffectiveEnableState({
          id: entry.pluginId,
          origin: entry.origin,
          config: normalizedPluginsConfig,
          rootConfig: params?.config,
          enabledByDefault: true,
        }).enabled,
    )
    .map((entry) => {
      const groupId = entry.groupId ?? entry.providerId;
      const groupLabel = entry.groupLabel ?? entry.label;
      return Object.assign(
        {
          id: `provider:setup:${entry.choiceId}`,
          kind: `provider`,
          surface: `setup`,
          providerId: entry.providerId,
          pluginId: entry.pluginId,
          option: {
            value: entry.choiceId,
            label: entry.choiceLabel,
            ...(entry.choiceHint ? { hint: entry.choiceHint } : {}),
            ...(entry.assistantPriority !== void 0
              ? { assistantPriority: entry.assistantPriority }
              : {}),
            ...(entry.assistantVisibility
              ? { assistantVisibility: entry.assistantVisibility }
              : {}),
            group: {
              id: groupId,
              label: groupLabel,
              ...(entry.groupHint ? { hint: entry.groupHint } : {}),
            },
          },
        },
        entry.onboardingScopes ? { onboardingScopes: [...entry.onboardingScopes] } : {},
        { source: `install-catalog` },
      );
    });
}
function resolveManifestProviderSetupFlowContributions(params) {
  const scope = params?.scope ?? DEFAULT_PROVIDER_FLOW_SCOPE;
  return resolveManifestProviderAuthChoices({
    ...params,
    includeUntrustedWorkspacePlugins: false,
  })
    .filter((choice) => includesProviderFlowScope(choice.onboardingScopes, scope))
    .map((choice) => {
      const groupId = choice.groupId ?? choice.providerId;
      const groupLabel = choice.groupLabel ?? choice.choiceLabel;
      return Object.assign(
        {
          id: `provider:setup:${choice.choiceId}`,
          kind: `provider`,
          surface: `setup`,
          providerId: choice.providerId,
          pluginId: choice.pluginId,
          option: {
            value: choice.choiceId,
            label: choice.choiceLabel,
            ...(choice.choiceHint ? { hint: choice.choiceHint } : {}),
            ...(choice.assistantPriority !== void 0
              ? { assistantPriority: choice.assistantPriority }
              : {}),
            ...(choice.assistantVisibility
              ? { assistantVisibility: choice.assistantVisibility }
              : {}),
            ...(choice.onboardingFeatured ? { onboardingFeatured: true } : {}),
            group: {
              id: groupId,
              label: groupLabel,
              ...(choice.groupHint ? { hint: choice.groupHint } : {}),
            },
          },
        },
        choice.onboardingScopes ? { onboardingScopes: [...choice.onboardingScopes] } : {},
        { source: `manifest` },
      );
    });
}
function resolveProviderSetupFlowContributions(params) {
  const scope = params?.scope ?? DEFAULT_PROVIDER_FLOW_SCOPE;
  const manifestContributions = resolveManifestProviderSetupFlowContributions({
    ...params,
    scope,
  });
  const seenOptionValues = new Set(
    manifestContributions.map((contribution) => contribution.option.value),
  );
  const installCatalogContributions = resolveInstallCatalogProviderSetupFlowContributions({
    ...params,
    scope,
  }).filter((contribution) => !seenOptionValues.has(contribution.option.value));
  return sortFlowContributionsByLabel([...manifestContributions, ...installCatalogContributions]);
}
//#endregion
//#region src/commands/auth-choice-options.static.ts
const CORE_AUTH_CHOICE_OPTIONS = [
  {
    value: "custom-api-key",
    label: "Custom Provider",
    hint: "Any OpenAI or Anthropic compatible endpoint",
    groupId: "custom",
    groupLabel: "Custom Provider",
    groupHint: "Any OpenAI or Anthropic compatible endpoint",
  },
];
/** Format static auth-choice values for Commander help/validation text. */
function formatStaticAuthChoiceChoicesForCli(params) {
  const includeSkip = params?.includeSkip ?? true;
  const includeLegacyAliases = params?.includeLegacyAliases ?? false;
  const values = CORE_AUTH_CHOICE_OPTIONS.map((opt) => opt.value);
  if (includeSkip) values.push("skip");
  if (includeLegacyAliases) values.push(...resolveLegacyAuthChoiceAliasesForCli(params));
  return values.join("|");
}
//#endregion
//#region src/commands/auth-choice-options.ts
function compareOptionLabels(a, b) {
  return a.label.localeCompare(b.label);
}
const FEATURED_AUTH_GROUP_ORDER = /* @__PURE__ */ new Map([
  ["openai", 0],
  ["anthropic", 1],
  ["xai", 2],
  ["google", 3],
  ["openrouter", 4],
]);
/** Keep the first-tier provider list stable; every other group belongs under More. */
function isFeaturedAuthChoiceGroup(group) {
  return FEATURED_AUTH_GROUP_ORDER.has(group.value);
}
function compareAssistantOptions(a, b) {
  return (a.assistantPriority ?? 0) - (b.assistantPriority ?? 0) || compareOptionLabels(a, b);
}
function compareLabelsCaseInsensitive(a, b) {
  return a.localeCompare(b, void 0, { sensitivity: "base" });
}
/** Sort auth-choice groups with featured providers first, then stable labels. */
function compareAuthChoiceGroups(a, b) {
  return (
    (FEATURED_AUTH_GROUP_ORDER.get(a.value) ?? Number.POSITIVE_INFINITY) -
      (FEATURED_AUTH_GROUP_ORDER.get(b.value) ?? Number.POSITIVE_INFINITY) ||
    compareLabelsCaseInsensitive(a.label, b.label) ||
    compareLabelsCaseInsensitive(a.value, b.value)
  );
}
function resolveProviderChoiceOptions(params) {
  return resolveProviderSetupFlowContributions({
    ...params,
    scope: "text-inference",
  }).map((contribution) =>
    Object.assign(
      {},
      {
        value: contribution.option.value,
        label: contribution.option.label,
      },
      { providerId: contribution.providerId },
      contribution.option.hint ? { hint: contribution.option.hint } : {},
      contribution.option.assistantPriority !== void 0
        ? { assistantPriority: contribution.option.assistantPriority }
        : {},
      contribution.option.assistantVisibility
        ? { assistantVisibility: contribution.option.assistantVisibility }
        : {},
      contribution.option.group
        ? {
            groupId: contribution.option.group.id,
            groupLabel: contribution.option.group.label,
            ...(contribution.option.group.hint
              ? { groupHint: contribution.option.group.hint }
              : {}),
          }
        : {},
      contribution.option.onboardingFeatured ? { onboardingFeatured: true } : {},
    ),
  );
}
/** Format all currently available auth-choice values for CLI help/validation. */
function formatAuthChoiceChoicesForCli(params) {
  return uniqueStrings([
    ...formatStaticAuthChoiceChoicesForCli(params).split("|"),
    ...resolveProviderSetupFlowContributions({
      ...params,
      scope: "text-inference",
    }).map((contribution) => contribution.option.value),
  ]).join("|");
}
/** Build flat auth-choice options from core choices plus provider setup flows. */
function buildAuthChoiceOptions(params) {
  params.store;
  const optionByValue = /* @__PURE__ */ new Map();
  for (const option of CORE_AUTH_CHOICE_OPTIONS) optionByValue.set(option.value, option);
  for (const option of resolveProviderChoiceOptions({
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
  }))
    optionByValue.set(option.value, option);
  const options = Array.from(optionByValue.values())
    .toSorted(compareOptionLabels)
    .filter((option) =>
      params.assistantVisibleOnly ? option.assistantVisibility !== "manual-only" : true,
    );
  if (params.includeSkip)
    options.push({
      value: "skip",
      label: "Skip for now",
    });
  return options;
}
/** Build grouped auth choices, filtering manual-only methods by default. */
function buildAuthChoiceGroups(params) {
  const options = buildAuthChoiceOptions({
    ...params,
    includeSkip: false,
    assistantVisibleOnly: params.assistantVisibleOnly ?? true,
  });
  const groupsById = /* @__PURE__ */ new Map();
  for (const option of options) {
    if (!option.groupId || !option.groupLabel) continue;
    const existing = groupsById.get(option.groupId);
    if (existing) {
      existing.options.push(option);
      if (option.providerId)
        existing.providerIds = uniqueStrings([...(existing.providerIds ?? []), option.providerId]);
      continue;
    }
    const providerIds = option.providerId ? [option.providerId] : [];
    groupsById.set(option.groupId, {
      value: option.groupId,
      label: option.groupLabel,
      ...(option.groupHint ? { hint: option.groupHint } : {}),
      ...(providerIds.length > 0 ? { providerIds } : {}),
      options: [option],
    });
  }
  return {
    groups: Array.from(groupsById.values())
      .map((group) =>
        Object.assign({}, group, { options: [...group.options].toSorted(compareAssistantOptions) }),
      )
      .toSorted(compareAuthChoiceGroups),
    skipOption: params.includeSkip
      ? {
          value: "skip",
          label: "Skip for now",
        }
      : void 0,
  };
}
//#endregion
export {
  isFeaturedAuthChoiceGroup as i,
  compareAuthChoiceGroups as n,
  formatAuthChoiceChoicesForCli as r,
  buildAuthChoiceGroups as t,
};
