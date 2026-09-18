import {
  n as ChannelAccountPredicate,
  r as ChannelAccountSurface,
} from "./channel-secret-basic-runtime-Czv9Jf_v.js";
import { r as SecretDefaults, t as ResolverContext } from "./runtime-shared-Djq1PqEV.js";

//#region src/secrets/channel-secret-tts-runtime.d.ts
/** Collects nested TTS provider SecretRefs from channel root and account-specific blocks. */
declare function collectNestedChannelTtsAssignments(params: {
  /** Channel config key used in runtime warning/assignment paths. */ channelKey: string /** Nested channel config field that owns the `tts` block, such as `outbound`. */;
  nestedKey: string;
  channel: Record<string, unknown>;
  surface: ChannelAccountSurface;
  defaults: SecretDefaults | undefined;
  context: ResolverContext /** Whether the top-level nested `tts` block can affect runtime behavior. */;
  topLevelActive: boolean;
  topInactiveReason: string /** Per-account activity predicate for account-specific nested `tts` blocks. */;
  accountActive: ChannelAccountPredicate;
  accountInactiveReason:
    | string
    | ((entry: {
        accountId: string;
        account: Record<string, unknown>;
        enabled: boolean;
      }) => string);
}): void;
//#endregion
export { collectNestedChannelTtsAssignments as t };
