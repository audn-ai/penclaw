import { t as DEFAULT_ASSISTANT_IDENTITY } from "./assistant-identity-CQSUJYSy.js";
import {
  d as isRenderableAvatarImageDataUrl,
  n as isAvatarDataUrl,
  o as isWindowsAbsolutePath,
  r as isAvatarHttpUrl,
  s as looksLikeAvatarPath,
  t as hasAvatarUriScheme,
} from "./avatar-policy-CTkphvvu.js";
import {
  r as normalizeControlUiBasePath,
  t as CONTROL_UI_AVATAR_PREFIX,
} from "./control-ui-shared-BqBD1Err.js";
import {
  n as readOpenedLocalAgentAvatarDataUrl,
  t as openLocalAgentAvatarFile,
} from "./identity-avatar-file-QU3dVYWF.js";
//#region src/gateway/assistant-avatar.ts
function resolveSameOriginAvatarUrl(cfg, source) {
  const basePath = normalizeControlUiBasePath(cfg.gateway?.controlUi?.basePath);
  const unbasedPrefix = `${CONTROL_UI_AVATAR_PREFIX}/`;
  const basedPrefix = basePath ? `${basePath}${unbasedPrefix}` : unbasedPrefix;
  if (basePath && source.startsWith(unbasedPrefix)) return `${basePath}${source}`;
  return source.startsWith(basedPrefix) ? source : void 0;
}
/**
 * Resolve and open a selected local avatar for route delivery.
 * A projection with `openedFile` transfers fd ownership to the caller.
 */
function openGatewayAssistantAvatar(params) {
  const { cfg, identity } = params;
  const source = identity.avatar;
  if (isAvatarHttpUrl(source))
    return {
      resolution: {
        kind: "remote",
        url: source,
        source,
      },
    };
  if (isRenderableAvatarImageDataUrl(source))
    return {
      resolution: {
        kind: "data",
        url: source,
        source,
      },
    };
  if (isAvatarDataUrl(source))
    return {
      resolution: {
        kind: "none",
        reason: "unsupported_data_url",
        source,
      },
    };
  if (hasAvatarUriScheme(source) && !isWindowsAbsolutePath(source))
    return {
      resolution: {
        kind: "none",
        reason: "unsupported_uri",
        source,
      },
    };
  if (resolveSameOriginAvatarUrl(cfg, source)) return { resolution: null };
  if (!looksLikeAvatarPath(source)) return { resolution: null };
  const opened = openLocalAgentAvatarFile({
    cfg,
    agentId: identity.agentId,
    source,
  });
  if (!opened.ok)
    return {
      resolution: {
        kind: "none",
        reason: opened.reason,
        source,
      },
    };
  return {
    resolution: {
      kind: "local",
      filePath: opened.file.path,
      source,
    },
    openedFile: opened.file,
  };
}
/** Resolve one selected identity avatar and its matching public metadata. */
function resolveGatewayAssistantAvatar(params) {
  const { cfg, identity } = params;
  const source = identity.avatar;
  const sameOriginAvatarUrl = resolveSameOriginAvatarUrl(cfg, source);
  if (sameOriginAvatarUrl)
    return {
      avatar: sameOriginAvatarUrl,
      resolution: null,
    };
  const opened = openGatewayAssistantAvatar(params);
  if (opened.resolution?.kind === "none")
    return {
      avatar: identity.emoji ?? DEFAULT_ASSISTANT_IDENTITY.avatar,
      resolution: opened.resolution,
    };
  if (!opened.openedFile)
    return {
      avatar: source,
      resolution: opened.resolution,
    };
  const dataUrl = readOpenedLocalAgentAvatarDataUrl(opened.openedFile);
  if (!dataUrl)
    return {
      avatar: identity.emoji ?? DEFAULT_ASSISTANT_IDENTITY.avatar,
      resolution: {
        kind: "none",
        reason: "unreadable",
        source,
      },
    };
  return {
    avatar: dataUrl,
    resolution: opened.resolution,
  };
}
//#endregion
export { resolveGatewayAssistantAvatar as n, openGatewayAssistantAvatar as t };
