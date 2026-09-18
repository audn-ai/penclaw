import { g as OpenClawPluginApi } from "./plugin-entry-DPCR66aO.js";
import { an as ProviderPlugin } from "./types-Ga3mNO_F.js";
//#region extensions/anthropic/register.runtime.d.ts
/** Build the full Anthropic provider descriptor used by runtime registration. */
declare function buildAnthropicProvider(): ProviderPlugin;
/** Register Anthropic provider, Claude CLI backend, and media understanding provider. */
declare function registerAnthropicPlugin(api: OpenClawPluginApi): void;
//#endregion
export { registerAnthropicPlugin as n, buildAnthropicProvider as t };
