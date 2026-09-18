import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/config/sessions/cli-session-binding.ts
const CLAUDE_CLI_BACKEND_ID = "claude-cli";
const SHA256_HEX_PATTERN = /^[a-f0-9]{64}$/;
function normalizeCliSessionReseedReceipt(value) {
  const promptHash = normalizeOptionalString(value?.promptHash);
  const localSessionId = normalizeOptionalString(value?.localSessionId);
  const userTurnDisposition = value?.userTurnDisposition;
  if (
    value?.version !== 1 ||
    !promptHash ||
    !SHA256_HEX_PATTERN.test(promptHash) ||
    !localSessionId ||
    (userTurnDisposition !== "persisted" && userTurnDisposition !== "omitted")
  )
    return;
  return {
    version: 1,
    promptHash,
    localSessionId,
    userTurnDisposition,
  };
}
/**
 * Re-own omitted reseed receipts when a reset intentionally preserves the
 * native CLI conversation. Persisted turns keep their old owner and fail open
 * because their canonical user row belongs to the archived local transcript.
 */
function rebindCliSessionReseedReceiptsForReset(bindings, localSessionId) {
  const normalizedLocalSessionId = normalizeOptionalString(localSessionId);
  if (!bindings || !normalizedLocalSessionId) return bindings;
  let rebound;
  for (const [provider, binding] of Object.entries(bindings)) {
    const receipt = normalizeCliSessionReseedReceipt(binding.reseedReceipt);
    if (!receipt || receipt.userTurnDisposition !== "omitted") continue;
    rebound ??= { ...bindings };
    rebound[provider] = {
      ...binding,
      reseedReceipt: {
        ...receipt,
        localSessionId: normalizedLocalSessionId,
      },
    };
  }
  return rebound ?? bindings;
}
/** Read the stored CLI session binding for a provider, including legacy Claude state. */
function getCliSessionBinding(entry, provider) {
  if (!entry) return;
  const normalized = normalizeProviderId(provider);
  const fromBindings = entry.cliSessionBindings?.[normalized];
  const bindingSessionId = normalizeOptionalString(fromBindings?.sessionId);
  if (bindingSessionId)
    return {
      sessionId: bindingSessionId,
      ...(fromBindings?.forceReuse === true ? { forceReuse: true } : {}),
      ...(fromBindings?.forkNextResume === true ? { forkNextResume: true } : {}),
      authProfileId: normalizeOptionalString(fromBindings?.authProfileId),
      authEpoch: normalizeOptionalString(fromBindings?.authEpoch),
      authEpochVersion: fromBindings?.authEpochVersion,
      extraSystemPromptHash: normalizeOptionalString(fromBindings?.extraSystemPromptHash),
      messageToolPolicyHash: normalizeOptionalString(fromBindings?.messageToolPolicyHash),
      promptToolNamesHash: normalizeOptionalString(fromBindings?.promptToolNamesHash),
      cwdHash: normalizeOptionalString(fromBindings?.cwdHash),
      mcpConfigHash: normalizeOptionalString(fromBindings?.mcpConfigHash),
      mcpResumeHash: normalizeOptionalString(fromBindings?.mcpResumeHash),
      reseedReceipt: normalizeCliSessionReseedReceipt(fromBindings?.reseedReceipt),
    };
  const fromMap = entry.cliSessionIds?.[normalized];
  const normalizedFromMap = normalizeOptionalString(fromMap);
  if (normalizedFromMap) return { sessionId: normalizedFromMap };
  if (normalized === CLAUDE_CLI_BACKEND_ID) {
    const legacy = normalizeOptionalString(entry.claudeCliSessionId);
    if (legacy) return { sessionId: legacy };
  }
}
/** Read just the reusable CLI session ID for a provider. */
function getCliSessionId(entry, provider) {
  return getCliSessionBinding(entry, provider)?.sessionId;
}
//#endregion
export {
  rebindCliSessionReseedReceiptsForReset as i,
  getCliSessionId as n,
  normalizeCliSessionReseedReceipt as r,
  getCliSessionBinding as t,
};
