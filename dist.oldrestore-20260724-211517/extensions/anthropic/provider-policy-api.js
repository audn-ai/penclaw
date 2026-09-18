import { n as CLAUDE_CLI_OFF_THINKING_PROFILE } from "../../cli-shared-KlT4css5.js";
import {
  n as normalizeAnthropicProviderConfigForProvider,
  t as applyAnthropicConfigDefaults,
} from "../../config-defaults-BdrX_r_H.js";
import "../../provider-model-shared-CYlCpWlu.js";
import { n as resolveClaudeThinkingProfile } from "../../provider-claude-thinking-CsXQZZNW.js";
import {
  a as resolveClaudeFable5ModelIdentity,
  o as resolveClaudeModelIdentity,
  s as resolveClaudeMythos5ModelIdentity,
} from "../../src-Dcc_hMY6.js";
//#region extensions/anthropic/provider-policy-api.ts
/**
 * Provider-policy API for Anthropic and Claude CLI. Core calls this lightweight
 * path for config defaults and thinking profiles.
 */
/** Normalize Anthropic provider config without importing runtime registration. */
function normalizeConfig(params) {
  return normalizeAnthropicProviderConfigForProvider(params);
}
/** Apply Anthropic config defaults through the provider-policy seam. */
function applyConfigDefaults(params) {
  return applyAnthropicConfigDefaults(params);
}
/** Resolve Claude thinking profile for Anthropic or Claude CLI providers. */
function resolveThinkingProfile(params) {
  const contractModelId = resolveClaudeModelIdentity({
    id: params.modelId,
    params: params.params,
  });
  switch (params.provider.trim().toLowerCase()) {
    case "anthropic":
      return resolveClaudeThinkingProfile(contractModelId, void 0, { includeNativeMax: true });
    case "claude-cli":
      if (
        resolveClaudeFable5ModelIdentity({ id: contractModelId }) ||
        resolveClaudeMythos5ModelIdentity({ id: contractModelId })
      )
        return CLAUDE_CLI_OFF_THINKING_PROFILE;
      return resolveClaudeThinkingProfile(contractModelId, void 0, { includeNativeMax: true });
    default:
      return null;
  }
}
//#endregion
export { applyConfigDefaults, normalizeConfig, resolveThinkingProfile };
