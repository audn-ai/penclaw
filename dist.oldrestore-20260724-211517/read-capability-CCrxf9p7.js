import "./fs-safe-RNq3oO57.js";
import path from "node:path";
import "./agent-scope-y9xQv_q1.js";
import { o as resolveAgentWorkspaceDir } from "./agent-scope-config-DVIR1nBa.js";
import { i as resolveGroupToolPolicy } from "./agent-tools.policy-BQgyHzcD.js";
import {
  c as resolveEffectiveToolFsRootExpansionAllowed,
  i as getAgentScopedMediaLocalRootsForSources,
  r as getAgentScopedMediaLocalRoots,
} from "./local-roots-CgMgS9r2.js";
import { t as resolvePathFromInput } from "./path-policy-D_kcZMAl.js";
import { i as readLocalFileSafely } from "./secure-temp-dir-DMUMnweR.js";
import { t as isToolAllowedByPolicies } from "./tool-policy-match-Bq6mIgOa.js";
import { n as resolveWorkspaceRoot } from "./workspace-dir-C7a6XA8X.js";
//#region src/media/read-capability.ts
function isAgentScopedHostMediaReadAllowed(params) {
  if (
    !resolveEffectiveToolFsRootExpansionAllowed({
      cfg: params.cfg,
      agentId: params.agentId,
    })
  )
    return false;
  const groupPolicy = resolveGroupToolPolicy({
    config: params.cfg,
    sessionKey: params.sessionKey,
    messageProvider: params.messageProvider,
    groupId: params.groupId,
    groupChannel: params.groupChannel,
    groupSpace: params.groupSpace,
    accountId: params.accountId,
    senderId: params.requesterSenderId,
    senderName: params.requesterSenderName,
    senderUsername: params.requesterSenderUsername,
    senderE164: params.requesterSenderE164,
  });
  if (groupPolicy && !isToolAllowedByPolicies("read", [groupPolicy])) return false;
  return true;
}
/** Creates a host reader bound to the agent workspace and configured local-file safety checks. */
function createAgentScopedHostMediaReadFile(params) {
  if (!isAgentScopedHostMediaReadAllowed(params)) return;
  const workspaceRoot = resolveWorkspaceRoot(
    params.workspaceDir ??
      (params.agentId ? resolveAgentWorkspaceDir(params.cfg, params.agentId) : void 0),
  );
  return async (filePath) => {
    return (await readLocalFileSafely({ filePath: resolvePathFromInput(filePath, workspaceRoot) }))
      .buffer;
  };
}
function appendWorkspaceDirToLocalRoots(roots, workspaceDir) {
  if (!workspaceDir) return roots;
  const resolvedWorkspaceDir = path.resolve(workspaceDir);
  if (!roots?.length) return [resolvedWorkspaceDir];
  if (roots.some((root) => path.resolve(root) === resolvedWorkspaceDir)) return roots;
  return [...roots, resolvedWorkspaceDir];
}
/** Resolves roots and optional host read capability for outbound media in an agent context. */
function resolveAgentScopedOutboundMediaAccess(params) {
  const resolvedWorkspaceDir =
    params.workspaceDir ??
    params.mediaAccess?.workspaceDir ??
    (params.agentId ? resolveAgentWorkspaceDir(params.cfg, params.agentId) : void 0);
  const hostMediaReadAllowed = isAgentScopedHostMediaReadAllowed(params);
  const localRoots = appendWorkspaceDirToLocalRoots(
    params.mediaAccess?.localRoots ??
      (hostMediaReadAllowed
        ? getAgentScopedMediaLocalRootsForSources({
            cfg: params.cfg,
            agentId: params.agentId,
            mediaSources: params.mediaSources,
          })
        : getAgentScopedMediaLocalRoots(params.cfg, params.agentId)),
    resolvedWorkspaceDir,
  );
  const readFile =
    params.mediaAccess?.readFile ??
    params.mediaReadFile ??
    (hostMediaReadAllowed
      ? createAgentScopedHostMediaReadFile({
          cfg: params.cfg,
          agentId: params.agentId,
          workspaceDir: resolvedWorkspaceDir,
          sessionKey: params.sessionKey,
          messageProvider: params.messageProvider,
          groupId: params.groupId,
          groupChannel: params.groupChannel,
          groupSpace: params.groupSpace,
          accountId: params.accountId,
          requesterSenderId: params.requesterSenderId,
          requesterSenderName: params.requesterSenderName,
          requesterSenderUsername: params.requesterSenderUsername,
          requesterSenderE164: params.requesterSenderE164,
        })
      : void 0);
  return {
    ...(localRoots?.length ? { localRoots } : {}),
    ...(readFile ? { readFile } : {}),
    ...(resolvedWorkspaceDir ? { workspaceDir: resolvedWorkspaceDir } : {}),
  };
}
//#endregion
export { resolveAgentScopedOutboundMediaAccess as t };
