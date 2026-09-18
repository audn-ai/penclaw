import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
//#region src/channels/plugins/setup-group-access.ts
/**
 * Channel setup group access prompts.
 *
 * Prompts and normalizes allowlist/open/disabled group access policy choices.
 */
/**
 * Parses comma, semicolon, or newline separated allowlist entries.
 */
function parseAllowlistEntries(raw) {
  return normalizeStringEntries(raw.split(/[\n,;]+/g));
}
/**
 * Formats allowlist entries for setup prompt initial values.
 */
function formatAllowlistEntries(entries) {
  return normalizeStringEntries(entries).join(", ");
}
/**
 * Prompts for the group access policy allowed by the channel setup flow.
 */
async function promptChannelAccessPolicy(params) {
  const options = [
    {
      value: "allowlist",
      label: "Allowlist (recommended)",
    },
  ];
  if (params.allowOpen !== false)
    options.push({
      value: "open",
      label: "Open (allow all channels)",
    });
  if (params.allowDisabled !== false)
    options.push({
      value: "disabled",
      label: "Disabled (block all channels)",
    });
  const initialValue = params.currentPolicy ?? "allowlist";
  return await params.prompter.select({
    message: `${params.label} access`,
    options,
    initialValue,
  });
}
/**
 * Prompts for group allowlist entries and normalizes the response.
 */
async function promptChannelAllowlist(params) {
  const initialValue =
    params.currentEntries && params.currentEntries.length > 0
      ? formatAllowlistEntries(params.currentEntries)
      : void 0;
  return parseAllowlistEntries(
    await params.prompter.text({
      message: `${params.label} allowlist (comma-separated)`,
      placeholder: params.placeholder,
      initialValue,
    }),
  );
}
/**
 * Prompts for the full group access config, including allowlist entries when needed.
 */
async function promptChannelAccessConfig(params) {
  const hasEntries = (params.currentEntries ?? []).length > 0;
  const shouldPrompt = params.defaultPrompt ?? !hasEntries;
  if (
    !(await params.prompter.confirm({
      message: params.updatePrompt
        ? `Update ${params.label} access?`
        : `Configure ${params.label} access?`,
      initialValue: shouldPrompt,
    }))
  )
    return null;
  const policy = await promptChannelAccessPolicy({
    prompter: params.prompter,
    label: params.label,
    currentPolicy: params.currentPolicy,
    allowOpen: params.allowOpen,
    allowDisabled: params.allowDisabled,
  });
  if (policy !== "allowlist")
    return {
      policy,
      entries: [],
    };
  if (params.skipAllowlistEntries)
    return {
      policy,
      entries: [],
    };
  return {
    policy,
    entries: await promptChannelAllowlist({
      prompter: params.prompter,
      label: params.label,
      currentEntries: params.currentEntries,
      placeholder: params.placeholder,
    }),
  };
}
//#endregion
export { promptChannelAccessConfig as t };
