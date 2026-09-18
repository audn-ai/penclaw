import { n as CodexAppServerModel } from "../../models-CGxhinTD.js";
import {
  m as ModelProviderDeclarationConfig,
  s as ModelDefinitionConfig,
} from "../../types.models-BqJSiNyu.js";

//#region extensions/codex/provider-catalog.d.ts
/** Provider id used by Codex model refs. */
declare const CODEX_PROVIDER_ID = "codex";
/** Synthetic base URL used to route Codex app-server model requests. */
declare const CODEX_BASE_URL = "https://chatgpt.com/backend-api";
/** Synthetic auth marker understood by Codex app-server runtime paths. */
declare const CODEX_APP_SERVER_AUTH_MARKER = "codex-app-server";
/** Offline fallback catalog used when live app-server discovery is unavailable. */
declare const FALLBACK_CODEX_MODELS: (
  | {
      id: string;
      model: string;
      displayName: string;
      description: string;
      isDefault: true;
      contextWindow: number;
      inputModalities: string[];
      supportedReasoningEfforts: string[];
    }
  | {
      id: string;
      model: string;
      displayName: string;
      description: string;
      contextWindow: number;
      inputModalities: string[];
      supportedReasoningEfforts: string[];
      isDefault?: undefined;
    }
  | {
      id: string;
      model: string;
      displayName: string;
      description: string;
      inputModalities: string[];
      supportedReasoningEfforts: string[];
      isDefault?: undefined;
      contextWindow?: undefined;
    }
)[];
/**
 * Converts a Codex app-server model record into OpenClaw provider model config.
 */
declare function buildCodexModelDefinition(model: {
  id: string;
  model: string;
  displayName?: string;
  contextWindow?: number;
  inputModalities: string[];
  supportedReasoningEfforts?: string[];
}): ModelDefinitionConfig;
/** Builds the synthetic Codex provider config for a model list. */
declare function buildCodexProviderConfig(
  models: CodexAppServerModel[],
): ModelProviderDeclarationConfig;
//#endregion
export {
  CODEX_APP_SERVER_AUTH_MARKER,
  CODEX_BASE_URL,
  CODEX_PROVIDER_ID,
  FALLBACK_CODEX_MODELS,
  buildCodexModelDefinition,
  buildCodexProviderConfig,
};
