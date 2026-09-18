import {
  n as executeWithApiKeyRotation,
  t as collectProviderApiKeysForExecution,
} from "../api-key-rotation-BCk3rfbn.js";
import { t as resolveEnvApiKey } from "../model-auth-env-DLe5znyS.js";
import { a as NON_ENV_SECRETREF_MARKER } from "../model-auth-markers-CA2Xy59Z.js";
import {
  o as requireApiKey,
  s as resolveAwsSdkEnvVarName,
} from "../model-auth-runtime-shared-BVzqP6NP.js";
import {
  a as resolveApiKeyForProvider,
  i as parseOAuthCallbackInput,
  n as generateOAuthState,
  o as resolveProviderAuthProfileMetadata,
  r as getRuntimeAuthForModel,
  s as waitForLocalOAuthCallback,
  t as buildOAuthCallbackOriginResolver,
} from "../provider-auth-runtime-DpUprUn3.js";
export {
  NON_ENV_SECRETREF_MARKER,
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
