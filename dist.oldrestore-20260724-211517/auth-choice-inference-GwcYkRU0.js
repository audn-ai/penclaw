import { t as CORE_ONBOARD_AUTH_FLAGS } from "./onboard-core-auth-flags-DYp3a9_x.js";
import { i as resolveProviderOnboardAuthFlags } from "./provider-auth-choices-LxMRetjr.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/commands/onboard-non-interactive/local/auth-choice-inference.ts
/**
 * Infers a non-interactive auth choice from explicit CLI flags.
 *
 * This keeps setup deterministic when users provide API-key flags without also
 * passing `--auth`, including plugin-defined provider auth flags.
 */
function hasStringValue(value) {
  return typeof value === "string" ? Boolean(normalizeOptionalString(value)) : Boolean(value);
}
/** Infers auth choice from core, plugin, and custom provider API-key flags. */
function inferAuthChoiceFromFlags(opts, params) {
  const matches = [
    ...CORE_ONBOARD_AUTH_FLAGS,
    ...resolveProviderOnboardAuthFlags({
      config: params?.config,
      workspaceDir: params?.workspaceDir,
      env: params?.env,
      includeUntrustedWorkspacePlugins: false,
    }),
  ]
    .filter(({ optionKey }) => hasStringValue(opts[optionKey]))
    .map((flag) => ({
      optionKey: flag.optionKey,
      authChoice: flag.authChoice,
      label: flag.cliFlag,
    }));
  if (
    hasStringValue(opts.customBaseUrl) ||
    hasStringValue(opts.customModelId) ||
    hasStringValue(opts.customApiKey)
  )
    matches.push({
      optionKey: "customBaseUrl",
      authChoice: "custom-api-key",
      label: "--custom-base-url/--custom-model-id/--custom-api-key",
    });
  return {
    choice: matches[0]?.authChoice,
    matches,
  };
}
//#endregion
export { inferAuthChoiceFromFlags };
