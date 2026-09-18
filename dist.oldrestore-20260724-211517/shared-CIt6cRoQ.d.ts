import { Ot as ProviderAuthResult } from "./types-Ga3mNO_F.js";
import { a as ModelApi, m as ModelProviderDeclarationConfig } from "./types.models-BqJSiNyu.js";
import { Rt as AuthConfig } from "./types.openclaw-DDo8sH3F.js";
import { d as SecretInput } from "./types.secrets-C15Z_eLX.js";
//#region extensions/microsoft-foundry/shared.d.ts
declare const PROVIDER_ID = "microsoft-foundry";
declare const DEFAULT_API = "openai-completions";
declare const DEFAULT_GPT5_API = "openai-responses";
declare const ANTHROPIC_MESSAGES_API = "anthropic-messages";
declare const COGNITIVE_SERVICES_RESOURCE = "https://cognitiveservices.azure.com";
declare const FOUNDRY_ANTHROPIC_SCOPE = "https://ai.azure.com/.default";
declare const TOKEN_REFRESH_MARGIN_MS: number;
interface AzAccount {
  name: string;
  id: string;
  tenantId?: string;
  user?: {
    name?: string;
  };
  state?: string;
  isDefault?: boolean;
}
interface AzAccessToken {
  accessToken: string;
  expiresOn?: string;
}
interface AzCognitiveAccount {
  id: string;
  name: string;
  kind: string;
  location?: string;
  resourceGroup?: string;
  endpoint?: string | null;
  customSubdomain?: string | null;
  projects?: string[] | null;
}
interface FoundryResourceOption {
  id: string;
  accountName: string;
  kind: "AIServices" | "OpenAI";
  location?: string;
  resourceGroup: string;
  endpoint: string;
  projects: string[];
}
interface AzDeploymentSummary {
  name: string;
  modelName?: string;
  modelVersion?: string;
  state?: string;
  sku?: string;
}
type FoundrySelection = {
  endpoint: string;
  modelId: string;
  modelNameHint?: string;
  api: FoundryProviderApi;
};
type CachedTokenEntry = {
  token: string;
  expiresAt: number;
};
type FoundryProviderApi =
  | typeof DEFAULT_API
  | typeof DEFAULT_GPT5_API
  | typeof ANTHROPIC_MESSAGES_API;
type FoundryDeploymentConfigInput = {
  name: string;
  modelName?: string;
  api?: FoundryProviderApi;
};
type FoundryModelCapabilities = {
  modelName: string;
  api: FoundryProviderApi;
  reasoning: boolean;
  thinkingLevelMap?: Record<string, string | null>;
  input: Array<"text" | "image">;
  contextWindow: number;
  maxTokens: number;
  compat?: FoundryModelCompat;
};
type FoundryModelCompat = {
  supportsStore?: boolean;
  supportsReasoningEffort?: boolean;
  supportedReasoningEfforts?: string[];
  maxTokensField: "max_completion_tokens" | "max_tokens";
};
type FoundryConfigShape = {
  auth?: AuthConfig;
  models?: {
    providers?: Record<string, ModelProviderDeclarationConfig>;
  };
};
declare function isAnthropicFoundryDeployment(modelName?: string | null): boolean;
declare function isFoundryClaudeMythosPreview(value?: string | null): boolean;
declare function usesFoundryResponsesByDefault(value?: string | null): boolean;
declare function isFoundryMaiImageModel(value?: string | null): boolean;
declare function supportsFoundryReasoningContent(value?: string | null): boolean;
declare function supportsFoundryImageInput(value?: string | null): boolean;
declare function requiresFoundryEntraIdClaudeAuth(value?: string | null): boolean;
declare function requiresFoundryMandatoryAdaptiveClaudeThinking(value?: string | null): boolean;
declare function requiresFoundryMaxCompletionTokens(value?: string | null): boolean;
declare function supportsFoundryReasoningEffort(value?: string | null): boolean;
declare function isFoundryProviderApi(value?: string | null): value is FoundryProviderApi;
declare function formatFoundryApiLabel(api: FoundryProviderApi): string;
declare function normalizeFoundryEndpoint(endpoint: string): string;
declare function resolveFoundryApi(
  modelId: string,
  modelNameHint?: string | null,
  configuredApi?: ModelApi | null,
): FoundryProviderApi;
declare function buildFoundryProviderBaseUrl(
  endpoint: string,
  modelId: string,
  modelNameHint?: string | null,
  configuredApi?: ModelApi | null,
): string;
declare function extractFoundryEndpoint(baseUrl: string | null | undefined): string | undefined;
declare function resolveFoundryModelCapabilities(
  modelId: string,
  modelNameHint?: string | null,
  configuredApi?: ModelApi | null,
  existingInput?: unknown,
): FoundryModelCapabilities;
declare function mergeFoundryCanonicalModelParams(
  params: Record<string, unknown> | undefined,
  modelName: string,
): Record<string, unknown>;
declare function resolveConfiguredModelNameHint(
  modelId: string,
  modelNameHint?: string | null,
): string | undefined;
declare function listConfiguredFoundryProfileIds(config: FoundryConfigShape): string[];
declare function buildFoundryAuthResult(params: {
  profileId: string;
  apiKey: SecretInput;
  secretInputMode?: "plaintext" | "ref";
  endpoint: string;
  modelId: string;
  modelNameHint?: string | null;
  api: FoundryProviderApi;
  authMethod: "api-key" | "entra-id";
  subscriptionId?: string;
  subscriptionName?: string;
  tenantId?: string;
  notes?: string[] /** Current plugins.allow so the provider can self-allowlist during onboard. */;
  currentPluginsAllow?: string[];
  currentProviderProfileIds?: string[];
  deployments?: FoundryDeploymentConfigInput[];
}): ProviderAuthResult;
declare function applyFoundryProfileBinding(config: FoundryConfigShape, profileId: string): void;
declare function applyFoundryProviderConfig(
  config: FoundryConfigShape,
  providerConfig: ModelProviderDeclarationConfig,
): void;
declare function resolveFoundryTargetProfileId(config: FoundryConfigShape): string | undefined;
//#endregion
export {
  requiresFoundryMandatoryAdaptiveClaudeThinking as A,
  isFoundryClaudeMythosPreview as C,
  mergeFoundryCanonicalModelParams as D,
  listConfiguredFoundryProfileIds as E,
  resolveFoundryTargetProfileId as F,
  supportsFoundryImageInput as I,
  supportsFoundryReasoningContent as L,
  resolveConfiguredModelNameHint as M,
  resolveFoundryApi as N,
  normalizeFoundryEndpoint as O,
  resolveFoundryModelCapabilities as P,
  supportsFoundryReasoningEffort as R,
  isAnthropicFoundryDeployment as S,
  isFoundryProviderApi as T,
  applyFoundryProviderConfig as _,
  AzDeploymentSummary as a,
  extractFoundryEndpoint as b,
  DEFAULT_API as c,
  FoundryProviderApi as d,
  FoundryResourceOption as f,
  applyFoundryProfileBinding as g,
  TOKEN_REFRESH_MARGIN_MS as h,
  AzCognitiveAccount as i,
  requiresFoundryMaxCompletionTokens as j,
  requiresFoundryEntraIdClaudeAuth as k,
  DEFAULT_GPT5_API as l,
  PROVIDER_ID as m,
  AzAccessToken as n,
  COGNITIVE_SERVICES_RESOURCE as o,
  FoundrySelection as p,
  AzAccount as r,
  CachedTokenEntry as s,
  ANTHROPIC_MESSAGES_API as t,
  FOUNDRY_ANTHROPIC_SCOPE as u,
  buildFoundryAuthResult as v,
  isFoundryMaiImageModel as w,
  formatFoundryApiLabel as x,
  buildFoundryProviderBaseUrl as y,
  usesFoundryResponsesByDefault as z,
};
