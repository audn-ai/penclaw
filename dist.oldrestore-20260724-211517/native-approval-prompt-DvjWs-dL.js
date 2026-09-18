import { n as resolveChannelApprovalCapability } from "./plugins-BKdf-5tW.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
//#region src/channels/plugins/native-approval-prompt.ts
/**
 * Native approval prompt capability helpers.
 *
 * Detects loaded or known channels that can render approval prompts natively.
 */
const NATIVE_APPROVAL_PROMPT_RUNTIME_CAPABILITY = "nativeApprovals";
const NATIVE_APPROVAL_PROMPT_RUNTIME_CAPABILITY_NORMALIZED = "nativeapprovals";
const KNOWN_NATIVE_APPROVAL_PROMPT_CHANNELS = /* @__PURE__ */ new Set([
  "discord",
  "googlechat",
  "matrix",
  "qqbot",
  "slack",
  "telegram",
  "signal",
]);
function channelPluginHasNativeApprovalPromptUi(plugin) {
  const capability = resolveChannelApprovalCapability(plugin);
  return Boolean(capability?.native || capability?.nativeRuntime);
}
function isKnownNativeApprovalPromptChannel(channel) {
  const normalized = normalizeOptionalLowercaseString(channel);
  return Boolean(normalized && KNOWN_NATIVE_APPROVAL_PROMPT_CHANNELS.has(normalized));
}
function hasNativeApprovalPromptRuntimeCapability(capabilities) {
  return Boolean(
    capabilities?.some(
      (capability) =>
        normalizeOptionalLowercaseString(capability) ===
        NATIVE_APPROVAL_PROMPT_RUNTIME_CAPABILITY_NORMALIZED,
    ),
  );
}
//#endregion
export {
  isKnownNativeApprovalPromptChannel as i,
  channelPluginHasNativeApprovalPromptUi as n,
  hasNativeApprovalPromptRuntimeCapability as r,
  NATIVE_APPROVAL_PROMPT_RUNTIME_CAPABILITY as t,
};
