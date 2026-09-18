import { f as ContextVisibilityMode } from "./types.base-ibSxQuK3.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region src/config/context-visibility.d.ts
type ContextVisibilityDefaultsConfig = {
  channels?: {
    defaults?: {
      /**
       * Global default supplemental context visibility for channels without a local override.
       */
      contextVisibility?: ContextVisibilityMode;
    };
  };
};
/** Reads the global channel default supplemental context visibility mode. */
declare function resolveDefaultContextVisibility(
  cfg: ContextVisibilityDefaultsConfig,
): ContextVisibilityMode | undefined;
/** Resolves supplemental context visibility using explicit, account, channel, default precedence. */
declare function resolveChannelContextVisibilityMode(params: {
  /** Full OpenClaw config containing channel defaults and per-channel overrides. */ cfg: OpenClawConfig /** Channel id whose visibility policy is being resolved. */;
  channel: string /** Optional channel account id used for account-specific overrides. */;
  accountId?:
    | string
    | null /** Runtime adapter override that takes precedence over config-backed policy. */;
  configuredContextVisibility?: ContextVisibilityMode;
}): ContextVisibilityMode;
//#endregion
export { resolveDefaultContextVisibility as n, resolveChannelContextVisibilityMode as t };
