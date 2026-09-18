import {
  i as isFeaturedAuthChoiceGroup,
  n as compareAuthChoiceGroups,
  t as buildAuthChoiceGroups,
} from "./auth-choice-options-YVV3GGLL.js";
import "./src-Bl7G9qvi.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { i as resolveAgentModelPrimaryValue } from "./model-input-B7OGjVYg.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
//#region src/commands/auth-choice-prompt.ts
const BACK_VALUE = "__back";
const MORE_VALUE = "__more";
const KEEP_CURRENT_AUTH_CHOICE = "__keep-current";
function resolveConfiguredModelRef(config) {
  return resolveAgentModelPrimaryValue(config?.agents?.defaults?.model);
}
function resolveConfiguredProvider(config) {
  const modelRef = resolveConfiguredModelRef(config);
  const slashIndex = modelRef?.indexOf("/") ?? -1;
  if (!modelRef || slashIndex <= 0) return;
  return normalizeProviderId(modelRef.slice(0, slashIndex)) || void 0;
}
function groupMatchesProvider(group, provider) {
  if (!provider) return false;
  return [group.value, ...(group.providerIds ?? [])].some(
    (candidate) => normalizeProviderId(candidate) === provider,
  );
}
function groupToOption(group, configuredProvider) {
  const configured = groupMatchesProvider(group, configuredProvider);
  return {
    value: group.value,
    label: configured ? `${group.label} (currently configured)` : group.label,
    hint: group.hint,
  };
}
async function promptAuthChoiceGrouped(params) {
  const { groups, skipOption } = buildAuthChoiceGroups(params);
  const availableGroups = [
    ...(params.allowedChoices
      ? groups.map((group) => ({
          ...group,
          options: group.options.filter((option) => params.allowedChoices?.has(option.value)),
        }))
      : groups),
    ...(params.additionalGroups ?? []),
  ].filter((group) => group.options.length > 0);
  const groupById = new Map(availableGroups.map((group) => [group.value, group]));
  const featuredGroups = availableGroups
    .filter(isFeaturedAuthChoiceGroup)
    .toSorted(compareAuthChoiceGroups);
  const moreGroups = availableGroups
    .filter((group) => !isFeaturedAuthChoiceGroup(group))
    .toSorted(compareAuthChoiceGroups);
  const configuredModelRef = resolveConfiguredModelRef(params.config);
  const configuredProvider = params.allowKeepCurrentProvider
    ? resolveConfiguredProvider(params.config)
    : void 0;
  const pickMethod = async (group) => {
    const keepCurrentOption = groupMatchesProvider(group, configuredProvider)
      ? {
          value: KEEP_CURRENT_AUTH_CHOICE,
          label: "Keep current config",
          ...(configuredModelRef ? { hint: `Keep ${configuredModelRef}` } : {}),
        }
      : void 0;
    if (group.options.length === 1 && !keepCurrentOption)
      return expectDefined(group.options[0], "options entry at 0").value;
    return await params.prompter.select({
      message: `${group.label} auth method`,
      options: [
        ...(keepCurrentOption ? [keepCurrentOption] : []),
        ...group.options,
        {
          value: BACK_VALUE,
          label: "Back",
        },
      ],
    });
  };
  const pickFromMore = async () => {
    while (true) {
      const options = moreGroups.map((group) => groupToOption(group, configuredProvider));
      options.push({
        value: BACK_VALUE,
        label: "Back",
      });
      const selection = await params.prompter.select({
        message: "Model/auth provider",
        options,
        searchable: true,
      });
      if (selection === BACK_VALUE) return BACK_VALUE;
      const group = groupById.get(selection);
      if (!group) continue;
      const method = await pickMethod(group);
      if (method === BACK_VALUE) continue;
      return method;
    }
  };
  const runFlat = async () => {
    while (true) {
      const flatOptions = moreGroups.map((group) => groupToOption(group, configuredProvider));
      if (skipOption)
        flatOptions.push({
          value: skipOption.value,
          label: skipOption.label,
        });
      const selection = await params.prompter.select({
        message: "Model/auth provider",
        options: flatOptions,
        searchable: true,
      });
      if (selection === "skip") return "skip";
      const group = groupById.get(selection);
      if (!group || group.options.length === 0) {
        await params.prompter.note(
          "No auth methods available for that provider.",
          "Model/auth choice",
        );
        continue;
      }
      const method = await pickMethod(group);
      if (method === BACK_VALUE) continue;
      return method;
    }
  };
  if (featuredGroups.length === 0) return runFlat();
  while (true) {
    const topTier = featuredGroups.map((group) => groupToOption(group, configuredProvider));
    if (moreGroups.length > 0)
      topTier.push({
        value: MORE_VALUE,
        label: "More…",
      });
    if (skipOption)
      topTier.push({
        value: skipOption.value,
        label: skipOption.label,
      });
    const topSelection = await params.prompter.select({
      message: "Model/auth provider",
      options: topTier,
    });
    if (topSelection === "skip") return "skip";
    if (topSelection === MORE_VALUE) {
      const more = await pickFromMore();
      if (more === BACK_VALUE) continue;
      return more;
    }
    const group = groupById.get(topSelection);
    if (!group || group.options.length === 0) {
      await params.prompter.note(
        "No auth methods available for that provider.",
        "Model/auth choice",
      );
      continue;
    }
    const method = await pickMethod(group);
    if (method === BACK_VALUE) continue;
    return method;
  }
}
//#endregion
export { promptAuthChoiceGrouped as n, KEEP_CURRENT_AUTH_CHOICE as t };
