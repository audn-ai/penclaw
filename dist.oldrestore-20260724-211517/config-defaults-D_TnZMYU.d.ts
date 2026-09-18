import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region extensions/anthropic/config-defaults.d.ts
/** Normalize Anthropic provider config defaults for one provider entry. */
declare function normalizeAnthropicProviderConfigForProvider<
  T extends {
    api?: string;
    models?: unknown[];
  },
>(params: { provider: string; providerConfig: T }): T;
/** Apply Anthropic and Claude CLI defaults to an OpenClaw config object. */
declare function applyAnthropicConfigDefaults(params: {
  config: OpenClawConfig;
  env: NodeJS.ProcessEnv;
}): OpenClawConfig;
//#endregion
export { normalizeAnthropicProviderConfigForProvider as n, applyAnthropicConfigDefaults as t };
