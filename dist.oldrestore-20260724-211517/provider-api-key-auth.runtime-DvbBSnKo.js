import {
  n as buildApiKeyCredential,
  t as applyAuthProfileConfig,
} from "./provider-auth-helpers-CLs4Yz61.js";
import {
  i as normalizeApiKeyInput,
  n as ensureApiKeyFromOptionEnvOrPrompt,
  s as validateApiKeyInput,
} from "./provider-auth-input-BukgsQa4.js";
import { t as applyPrimaryModel } from "./provider-model-primary-DroEB3g9.js";
//#region src/plugins/provider-api-key-auth.runtime.ts
/** Runtime API-key auth helper bundle exposed to provider setup code. */
const providerApiKeyAuthRuntime = {
  applyAuthProfileConfig,
  applyPrimaryModel,
  buildApiKeyCredential,
  ensureApiKeyFromOptionEnvOrPrompt,
  normalizeApiKeyInput,
  validateApiKeyInput,
};
//#endregion
export { providerApiKeyAuthRuntime };
