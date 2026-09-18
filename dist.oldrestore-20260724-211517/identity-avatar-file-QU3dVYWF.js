import fs from "node:fs";
import path from "node:path";
import { o as resolveAgentWorkspaceDir } from "./agent-scope-config-DVIR1nBa.js";
import "./utils-DtcDeqWS.js";
import "./boundary-file-read-CBe_wA_B.js";
import "./agent-scope-y9xQv_q1.js";
import {
  a as isSupportedLocalAvatarExtension,
  c as resolveAvatarMime,
  d as isRenderableAvatarImageDataUrl,
  i as isPathWithinRoot,
  l as AVATAR_MAX_BYTES,
  n as isAvatarDataUrl,
  o as isWindowsAbsolutePath,
  r as isAvatarHttpUrl,
  t as hasAvatarUriScheme,
} from "./avatar-policy-CTkphvvu.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { i as openRootFileSync } from "./root-file-9jkyxRTl.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/infra/file-descriptor-read.ts
const READ_CHUNK_BYTES = 64 * 1024;
function createScratchBuffer(maxBytes) {
  return Buffer.allocUnsafe(Math.min(READ_CHUNK_BYTES, Math.max(1, maxBytes + 1)));
}
function appendChunk(params) {
  const total = params.total + params.bytesRead;
  if (total > params.maxBytes) throw new RangeError(`File exceeds ${params.maxBytes} bytes`);
  params.chunks.push(Buffer.from(params.scratch.subarray(0, params.bytesRead)));
  return total;
}
/** Read at most maxBytes from the descriptor without an unbounded allocation. */
function readFileDescriptorBoundedSync(fd, maxBytes) {
  const chunks = [];
  const scratch = createScratchBuffer(maxBytes);
  let total = 0;
  while (true) {
    const bytesRead = fs.readSync(fd, scratch, 0, scratch.length, null);
    if (bytesRead === 0) return Buffer.concat(chunks, total);
    total = appendChunk({
      chunks,
      scratch,
      bytesRead,
      total,
      maxBytes,
    });
  }
}
function readChunk(fd, scratch) {
  return new Promise((resolve, reject) => {
    fs.read(fd, scratch, 0, scratch.length, null, (error, bytesRead) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(bytesRead);
    });
  });
}
/** Async variant for request paths; caller retains descriptor ownership. */
async function readFileDescriptorBounded(fd, maxBytes) {
  const chunks = [];
  const scratch = createScratchBuffer(maxBytes);
  let total = 0;
  while (true) {
    const bytesRead = await readChunk(fd, scratch);
    if (bytesRead === 0) return Buffer.concat(chunks, total);
    total = appendChunk({
      chunks,
      scratch,
      bytesRead,
      total,
      maxBytes,
    });
  }
}
//#endregion
//#region src/agents/identity-avatar-file.ts
function resolveExistingPath(value) {
  try {
    return fs.realpathSync(value);
  } catch {
    return path.resolve(value);
  }
}
/** Resolve one local avatar source while retaining its canonical workspace root. */
function resolveLocalAgentAvatarPath(params) {
  const workspaceRoot = resolveExistingPath(params.workspaceDir);
  const filePath = resolveExistingPath(
    params.raw.startsWith("~") || path.isAbsolute(params.raw)
      ? resolveUserPath(params.raw)
      : path.resolve(workspaceRoot, params.raw),
  );
  if (!isPathWithinRoot(workspaceRoot, filePath))
    return {
      ok: false,
      reason: "outside_workspace",
    };
  if (!isSupportedLocalAvatarExtension(filePath))
    return {
      ok: false,
      reason: "unsupported_extension",
    };
  try {
    const stat = fs.statSync(filePath);
    if (!stat.isFile())
      return {
        ok: false,
        reason: "missing",
      };
    if (stat.size > 2097152)
      return {
        ok: false,
        reason: "too_large",
      };
  } catch {
    return {
      ok: false,
      reason: "missing",
    };
  }
  return {
    ok: true,
    value: {
      filePath,
      workspaceRoot,
    },
  };
}
function openResolvedLocalAgentAvatarFile(resolved) {
  try {
    const opened = openRootFileSync({
      absolutePath: resolved.filePath,
      rootPath: resolved.workspaceRoot,
      rootRealPath: resolved.workspaceRoot,
      boundaryLabel: "agent workspace",
      maxBytes: AVATAR_MAX_BYTES,
      rejectHardlinks: true,
      skipLexicalRootCheck: true,
    });
    if (!opened.ok) return null;
    if (!isSupportedLocalAvatarExtension(opened.path)) {
      fs.closeSync(opened.fd);
      return null;
    }
    return {
      path: opened.path,
      fd: opened.fd,
    };
  } catch {
    return null;
  }
}
/**
 * Open one selected local avatar under its agent workspace.
 * A successful caller owns `file.fd` and must close it exactly once.
 */
function openLocalAgentAvatarFile(params) {
  const resolved = resolveLocalAgentAvatarPath({
    raw: params.source,
    workspaceDir: resolveAgentWorkspaceDir(params.cfg, params.agentId),
  });
  if (!resolved.ok) return resolved;
  const file = openResolvedLocalAgentAvatarFile(resolved.value);
  return file
    ? {
        ok: true,
        file,
      }
    : {
        ok: false,
        reason: "unreadable",
      };
}
/** Consume a pinned local avatar descriptor into a data URL. Always closes it. */
function readOpenedLocalAgentAvatarDataUrl(opened) {
  try {
    const buffer = readFileDescriptorBoundedSync(opened.fd, AVATAR_MAX_BYTES);
    return `data:${resolveAvatarMime(opened.path)};base64,${buffer.toString("base64")}`;
  } catch {
    return;
  } finally {
    fs.closeSync(opened.fd);
  }
}
/** Resolve one configured avatar source for agent-list projections. */
function resolveAgentAvatarUrlFromSource(cfg, agentId, source) {
  const normalized = normalizeOptionalString(source);
  if (!normalized) return;
  if (isAvatarHttpUrl(normalized) || isRenderableAvatarImageDataUrl(normalized)) return normalized;
  if (
    isAvatarDataUrl(normalized) ||
    (hasAvatarUriScheme(normalized) && !isWindowsAbsolutePath(normalized))
  )
    return;
  const opened = openLocalAgentAvatarFile({
    cfg,
    agentId,
    source: normalized,
  });
  return opened.ok ? readOpenedLocalAgentAvatarDataUrl(opened.file) : void 0;
}
//#endregion
export {
  readFileDescriptorBounded as a,
  resolveLocalAgentAvatarPath as i,
  readOpenedLocalAgentAvatarDataUrl as n,
  resolveAgentAvatarUrlFromSource as r,
  openLocalAgentAvatarFile as t,
};
