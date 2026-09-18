import path from "node:path";
import "./agent-scope-y9xQv_q1.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import {
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import {
  n as isAvatarDataUrl,
  o as isWindowsAbsolutePath,
  r as isAvatarHttpUrl,
  t as hasAvatarUriScheme,
} from "./avatar-policy-CTkphvvu.js";
import { i as resolveLocalAgentAvatarPath } from "./identity-avatar-file-QU3dVYWF.js";
import { n as resolveAgentIdentity } from "./identity-CceraXdn.js";
import { n as loadAgentIdentityFromWorkspace } from "./identity-file-DXr4SX5Y.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/agents/identity-avatar.ts
/**
 * Resolves public avatar sources for configured agent identities.
 */
const PUBLIC_AVATAR_SOURCE_MAX_CHARS = 256;
const PUBLIC_DATA_AVATAR_HEADER_MAX_CHARS = 64;
function resolveAvatarSource(cfg, agentId, opts) {
  const normalizedAgentId = normalizeAgentId(agentId);
  const defaultAgentId = normalizeAgentId(resolveDefaultAgentId(cfg));
  const fromUiConfig = normalizeOptionalString(cfg.ui?.assistant?.avatar) ?? null;
  if (opts?.includeUiOverride) {
    if (normalizedAgentId === defaultAgentId && fromUiConfig) return fromUiConfig;
  }
  const fromConfig =
    normalizeOptionalString(resolveAgentIdentity(cfg, normalizedAgentId)?.avatar) ?? null;
  if (fromConfig) return fromConfig;
  const fromIdentity =
    normalizeOptionalString(
      loadAgentIdentityFromWorkspace(resolveAgentWorkspaceDir(cfg, normalizedAgentId))?.avatar,
    ) ?? null;
  if (fromIdentity) return fromIdentity;
  return opts?.includeUiOverride ? fromUiConfig : null;
}
function isSafeRelativeAvatarSource(source) {
  if (
    source.length > PUBLIC_AVATAR_SOURCE_MAX_CHARS ||
    source.startsWith("~") ||
    path.isAbsolute(source) ||
    isWindowsAbsolutePath(source) ||
    (hasAvatarUriScheme(source) && !isWindowsAbsolutePath(source)) ||
    source.includes("\0")
  )
    return false;
  return source
    .replace(/\\/g, "/")
    .split("/")
    .every((part) => part !== "..");
}
/** Return a safe public description of the configured avatar source. */
function resolvePublicAgentAvatarSource(resolved) {
  const source = normalizeOptionalString(resolved.source) ?? null;
  if (!source) return;
  if (isAvatarDataUrl(source)) {
    const commaIndex = source.indexOf(",");
    return `${commaIndex > 0 ? source.slice(0, Math.min(commaIndex, PUBLIC_DATA_AVATAR_HEADER_MAX_CHARS)) : source.slice(0, PUBLIC_DATA_AVATAR_HEADER_MAX_CHARS)},...`;
  }
  if (isAvatarHttpUrl(source)) return "remote URL";
  return isSafeRelativeAvatarSource(source) ? source : void 0;
}
/** Resolve the effective avatar for an agent, including config and IDENTITY.md. */
function resolveAgentAvatar(cfg, agentId, opts) {
  const source = resolveAvatarSource(cfg, agentId, opts);
  if (!source)
    return {
      kind: "none",
      reason: "missing",
    };
  if (isAvatarHttpUrl(source))
    return {
      kind: "remote",
      url: source,
      source,
    };
  if (isAvatarDataUrl(source))
    return {
      kind: "data",
      url: source,
      source,
    };
  const resolved = resolveLocalAgentAvatarPath({
    raw: source,
    workspaceDir: resolveAgentWorkspaceDir(cfg, agentId),
  });
  if (!resolved.ok)
    return {
      kind: "none",
      reason: resolved.reason,
      source,
    };
  return {
    kind: "local",
    filePath: resolved.value.filePath,
    source,
  };
}
//#endregion
export { resolvePublicAgentAvatarSource as n, resolveAgentAvatar as t };
