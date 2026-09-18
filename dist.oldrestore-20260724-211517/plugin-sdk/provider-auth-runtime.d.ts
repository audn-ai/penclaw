import {
  O as requireApiKey,
  j as resolveEnvApiKey,
  k as resolveAwsSdkEnvVarName,
  w as ResolvedProviderAuth,
} from "../model-auth-DQnRyl6R.js";
import { a as NON_ENV_SECRETREF_MARKER } from "../model-auth-markers-BhPapeFt.js";
import {
  a as getRuntimeAuthForModel,
  c as resolveProviderAuthProfileMetadata,
  d as executeWithApiKeyRotation,
  i as generateOAuthState,
  l as waitForLocalOAuthCallback,
  n as ProviderAuthProfileMetadata,
  o as parseOAuthCallbackInput,
  r as buildOAuthCallbackOriginResolver,
  s as resolveApiKeyForProvider,
  t as OAuthCallbackResult,
  u as collectProviderApiKeysForExecution,
} from "../provider-auth-runtime-DU6_5Jop.js";
import {
  hn as ProviderPreparedRuntimeAuth,
  zl as ResolvedProviderRuntimeAuth,
} from "../types-Ga3mNO_F.js";
export {
  NON_ENV_SECRETREF_MARKER,
  OAuthCallbackResult,
  ProviderAuthProfileMetadata,
  type ProviderPreparedRuntimeAuth,
  type ResolvedProviderAuth,
  type ResolvedProviderRuntimeAuth,
  buildOAuthCallbackOriginResolver,
  collectProviderApiKeysForExecution,
  executeWithApiKeyRotation,
  generateOAuthState,
  getRuntimeAuthForModel,
  parseOAuthCallbackInput,
  requireApiKey,
  resolveApiKeyForProvider,
  resolveAwsSdkEnvVarName,
  resolveEnvApiKey,
  resolveProviderAuthProfileMetadata,
  waitForLocalOAuthCallback,
};
