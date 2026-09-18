import { t as resolveOpenClawAgentDir } from "../agent-dir-compat-d7bWcNLv.js";
import {
  a as COPILOT_USER_AGENT,
  i as COPILOT_INTEGRATION_ID,
  n as COPILOT_EDITOR_VERSION,
  r as COPILOT_GITHUB_API_VERSION,
  s as buildCopilotIdeHeaders,
  t as COPILOT_EDITOR_PLUGIN_VERSION,
} from "../copilot-dynamic-headers-CF9zPORX.js";
import {
  r as hasUsableOAuthCredential,
  t as DEFAULT_OAUTH_REFRESH_MARGIN_MS,
} from "../credential-state-DvOWxJSx.js";
import {
  o as readClaudeCliCredentialsCached,
  s as readCodexCliCredentialsCached,
} from "../external-auth-aN0UYCd0.js";
import { o as resolveRequiredHomeDir } from "../home-dir-DxrrpDft.js";
import { t as resolveEnvApiKey } from "../model-auth-env-DLe5znyS.js";
import {
  d as isNonSecretApiKeyMarker,
  g as resolveNonEnvSecretRefApiKeyMarker,
  i as MINIMAX_OAUTH_MARKER,
  n as CUSTOM_LOCAL_AUTH_MARKER,
  u as isKnownEnvApiKeyMarker,
  v as resolveOAuthApiKeyMarker,
} from "../model-auth-markers-CA2Xy59Z.js";
import { r as normalizeApiKeyConfig } from "../models-config.providers.secrets-Dh4joY6h.js";
import {
  n as normalizeSecretInput,
  t as normalizeOptionalSecretInput,
} from "../normalize-secret-input-Df_qhWv_.js";
import { D as CODEX_CLI_PROFILE_ID, E as CLAUDE_CLI_PROFILE_ID } from "../persisted-B2tK2f7d.js";
import { n as listProfilesForProvider } from "../profile-list-I4BheGlK.js";
import {
  a as removeProviderAuthProfilesWithLock,
  c as upsertAuthProfileWithLock,
  s as upsertAuthProfile,
} from "../profiles-DxTOoenK.js";
import { t as createProviderApiKeyAuthMethod } from "../provider-api-key-auth-CXfFv7q7.js";
import {
  i as writeOAuthCredentials,
  n as buildApiKeyCredential,
  r as upsertApiKeyProfile,
  t as applyAuthProfileConfig,
} from "../provider-auth-helpers-CLs4Yz61.js";
import {
  a as normalizeSecretInputModeInput,
  i as normalizeApiKeyInput,
  n as ensureApiKeyFromOptionEnvOrPrompt,
  r as formatApiKeyPreview,
  s as validateApiKeyInput,
  t as ensureApiKeyFromEnvOrPrompt,
} from "../provider-auth-input-BukgsQa4.js";
import { t as resolveSecretInputModeForEnvSelection } from "../provider-auth-mode-7FOSjRoY.js";
import {
  a as listUsableProviderAuthProfileIds,
  c as resolveProviderAuthProfileApiKey,
  d as toFormUrlEncoded,
  f as buildOpenAICodexCredentialExtra,
  g as resolveOpenAICodexImportProfileName,
  h as resolveOpenAICodexAuthIdentity,
  i as isProviderAuthProfileConfigured,
  l as generateHexPkceVerifierChallenge,
  m as resolveOpenAICodexAccessTokenExpiry,
  n as deriveCopilotApiBaseUrlFromToken,
  o as normalizeGithubCopilotDomain,
  p as decodeOpenAICodexJwtPayload,
  r as isProviderApiKeyConfigured,
  s as resolveCopilotApiToken,
  t as DEFAULT_COPILOT_API_BASE_URL,
  u as generatePkceVerifierChallenge,
} from "../provider-auth-mypr64nh.js";
import { n as promptSecretRefForSetup } from "../provider-auth-ref-BCUXVZz5.js";
import { t as buildOauthProviderAuthResult } from "../provider-auth-result-C3SBJpUX.js";
import {
  n as validateAnthropicSetupToken,
  t as buildTokenProfileId,
} from "../provider-auth-token-DyHOhkct.js";
import {
  i as omitEnvKeysCaseInsensitive,
  n as listKnownProviderAuthEnvVarNames,
} from "../provider-env-vars-BZiQzob_.js";
import { c as resolveDefaultSecretProviderAlias } from "../ref-contract-DVV0zYUk.js";
import { n as suggestOAuthProfileIdForLegacyDefault } from "../repair-bhv6VYT3.js";
import {
  a as ensureAuthProfileStoreForLocalUpdate,
  i as ensureAuthProfileStore,
  y as updateAuthProfileStoreWithLock,
} from "../store-B7DoDdVM.js";
import { c as hasConfiguredSecretInput, s as coerceSecretRef } from "../types.secrets-BV0ywRAy.js";
export {
  CLAUDE_CLI_PROFILE_ID,
  CODEX_CLI_PROFILE_ID,
  COPILOT_EDITOR_PLUGIN_VERSION,
  COPILOT_EDITOR_VERSION,
  COPILOT_GITHUB_API_VERSION,
  COPILOT_INTEGRATION_ID,
  COPILOT_USER_AGENT,
  CUSTOM_LOCAL_AUTH_MARKER,
  DEFAULT_COPILOT_API_BASE_URL,
  DEFAULT_OAUTH_REFRESH_MARGIN_MS,
  MINIMAX_OAUTH_MARKER,
  applyAuthProfileConfig,
  buildApiKeyCredential,
  buildCopilotIdeHeaders,
  buildOauthProviderAuthResult,
  buildOpenAICodexCredentialExtra,
  buildTokenProfileId,
  coerceSecretRef,
  createProviderApiKeyAuthMethod,
  decodeOpenAICodexJwtPayload,
  deriveCopilotApiBaseUrlFromToken,
  ensureApiKeyFromEnvOrPrompt,
  ensureApiKeyFromOptionEnvOrPrompt,
  ensureAuthProfileStore,
  ensureAuthProfileStoreForLocalUpdate,
  formatApiKeyPreview,
  generateHexPkceVerifierChallenge,
  generatePkceVerifierChallenge,
  hasConfiguredSecretInput,
  hasUsableOAuthCredential,
  isKnownEnvApiKeyMarker,
  isNonSecretApiKeyMarker,
  isProviderApiKeyConfigured,
  isProviderAuthProfileConfigured,
  listKnownProviderAuthEnvVarNames,
  listProfilesForProvider,
  listUsableProviderAuthProfileIds,
  normalizeApiKeyConfig,
  normalizeApiKeyInput,
  normalizeGithubCopilotDomain,
  normalizeOptionalSecretInput,
  normalizeSecretInput,
  normalizeSecretInputModeInput,
  omitEnvKeysCaseInsensitive,
  promptSecretRefForSetup,
  readClaudeCliCredentialsCached,
  readCodexCliCredentialsCached,
  removeProviderAuthProfilesWithLock,
  resolveCopilotApiToken,
  resolveDefaultSecretProviderAlias,
  resolveEnvApiKey,
  resolveNonEnvSecretRefApiKeyMarker,
  resolveOAuthApiKeyMarker,
  resolveOpenAICodexAccessTokenExpiry,
  resolveOpenAICodexAuthIdentity,
  resolveOpenAICodexImportProfileName,
  resolveOpenClawAgentDir,
  resolveProviderAuthProfileApiKey,
  resolveRequiredHomeDir,
  resolveSecretInputModeForEnvSelection,
  suggestOAuthProfileIdForLegacyDefault,
  toFormUrlEncoded,
  updateAuthProfileStoreWithLock,
  upsertApiKeyProfile,
  upsertAuthProfile,
  upsertAuthProfileWithLock,
  validateAnthropicSetupToken,
  validateApiKeyInput,
  writeOAuthCredentials,
};
