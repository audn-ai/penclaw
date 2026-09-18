import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import "./fs-safe-RNq3oO57.js";
import { fileURLToPath } from "node:url";
import { r as resolveChannelRemoteInboundAttachmentRoots } from "./channel-inbound-roots-CnP4OM7H.js";
import { t as ensureSandboxWorkspaceForSession } from "./context-CEFGZ0oc.js";
import { C as slugifySessionKey } from "./docker-yvxsWR8P.js";
import { r as runCommandWithTimeout } from "./exec-CXKmx4dL.js";
import { r as logVerbose } from "./globals-CNUzHTcU.js";
import { t as isInboundPathAllowed } from "./inbound-path-policy-CH_uJYn5.js";
import { a as resolveInboundMediaReference } from "./media-reference-Cboth956.js";
import { C as FsSafeError } from "./path-DILYn_gk.js";
import { n as assertSandboxPath } from "./sandbox-paths-DxDLkOQF.js";
import { i as normalizeScpRemotePath, r as normalizeScpRemoteHost } from "./scp-host-BtrM4IVE.js";
import { a as root } from "./secure-temp-dir-DMUMnweR.js";
import "./sandbox-BbGZOuCz.js";
import { s as getMediaDir, t as MEDIA_MAX_BYTES } from "./store-BfbXoJVN.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-uPgNO8da.js";
import { n as sliceUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import { t as CONFIG_DIR } from "./utils-DtcDeqWS.js";
//#region src/auto-reply/reply/stage-sandbox-media.ts
const STAGED_MEDIA_MAX_BYTES = MEDIA_MAX_BYTES;
const SCP_STDERR_TAIL_CHARS = 16384;
const EMPTY_STAGE_RESULT = { staged: /* @__PURE__ */ new Map() };
async function stageSandboxMedia(params) {
  const { ctx, sessionCtx, cfg, sessionKey, workspaceDir } = params;
  const hasPathsArray = Array.isArray(ctx.MediaPaths) && ctx.MediaPaths.length > 0;
  const rawPaths = resolveRawPaths(ctx);
  if (rawPaths.length === 0 || !sessionKey) return EMPTY_STAGE_RESULT;
  const sandbox =
    ctx.MediaRemoteHost && params.remoteMediaMode === "cache"
      ? null
      : await ensureSandboxWorkspaceForSession({
          config: cfg,
          sessionKey,
          workspaceDir,
        });
  const remoteMediaCacheDir = ctx.MediaRemoteHost
    ? path.join(CONFIG_DIR, "media", "remote-cache", slugifySessionKey(sessionKey))
    : null;
  const effectiveWorkspaceDir = sandbox?.workspaceDir ?? remoteMediaCacheDir ?? workspaceDir;
  if (!effectiveWorkspaceDir) return EMPTY_STAGE_RESULT;
  await fs.mkdir(effectiveWorkspaceDir, { recursive: true });
  const remoteAttachmentRoots = ctx.MediaRemoteHost
    ? (resolveChannelRemoteInboundAttachmentRoots({
        cfg,
        ctx,
      }) ?? [])
    : [];
  const usedNames = /* @__PURE__ */ new Set();
  const staged = /* @__PURE__ */ new Map();
  const hostWorkspaceStagingDir =
    !sandbox && !ctx.MediaRemoteHost
      ? path.join("media", "inbound", `openclaw-staged-${crypto.randomUUID()}`)
      : void 0;
  for (const raw of rawPaths) {
    const source = await resolveStageableMediaSource(raw);
    if (!source || staged.has(source.lookupKey) || staged.has(source.physicalPath)) continue;
    if (
      !(await isAllowedSourcePath({
        source: source.physicalPath,
        mediaRemoteHost: ctx.MediaRemoteHost,
        remoteAttachmentRoots,
      }))
    )
      continue;
    const fileName = allocateStagedFileName(source.pathForFileName, usedNames);
    if (!fileName) continue;
    const stageIntoSandboxMediaDir = Boolean(sandbox);
    const relativeDest =
      stageIntoSandboxMediaDir || hostWorkspaceStagingDir
        ? path.join(hostWorkspaceStagingDir ?? path.join("media", "inbound"), fileName)
        : fileName;
    const dest = path.join(effectiveWorkspaceDir, relativeDest);
    try {
      if (ctx.MediaRemoteHost)
        await stageRemoteFileIntoRoot({
          remoteHost: ctx.MediaRemoteHost,
          remotePath: source.physicalPath,
          rootDir: effectiveWorkspaceDir,
          relativeDestPath: relativeDest,
          maxBytes: STAGED_MEDIA_MAX_BYTES,
        });
      else
        await stageLocalFileIntoRoot({
          sourcePath: await fs.realpath(source.physicalPath).catch(() => source.physicalPath),
          rootDir: effectiveWorkspaceDir,
          relativeDestPath: relativeDest,
          maxBytes: STAGED_MEDIA_MAX_BYTES,
        });
    } catch (err) {
      if (err instanceof FsSafeError && err.code === "too-large")
        logVerbose(
          `Blocking inbound media staging above ${STAGED_MEDIA_MAX_BYTES} bytes: ${source.physicalPath}`,
        );
      else logVerbose(`Failed to stage inbound media path ${source.physicalPath}: ${String(err)}`);
      continue;
    }
    const stagedPath = stageIntoSandboxMediaDir ? toPosixRelativePath(relativeDest) : dest;
    staged.set(source.lookupKey, stagedPath);
    if (source.physicalPath !== source.lookupKey) staged.set(source.physicalPath, stagedPath);
  }
  rewriteStagedMediaPaths({
    ctx,
    sessionCtx,
    rawPaths,
    staged,
    hasPathsArray,
  });
  return { staged };
}
function toPosixRelativePath(filePath) {
  return filePath.split(path.sep).join(path.posix.sep);
}
async function resolveStageableMediaSource(value) {
  const raw = value.trim();
  if (!raw) return null;
  const inboundReference = await resolveInboundMediaReference(raw).catch(() => null);
  if (inboundReference)
    return {
      lookupKey: raw,
      pathForFileName: inboundReference.physicalPath,
      physicalPath: inboundReference.physicalPath,
    };
  const source = resolveAbsolutePath(raw);
  return source
    ? {
        lookupKey: source,
        pathForFileName: source,
        physicalPath: source,
      }
    : null;
}
async function stageLocalFileIntoRoot(params) {
  await (
    await root(params.rootDir)
  ).copyIn(params.relativeDestPath, params.sourcePath, { maxBytes: params.maxBytes });
}
async function stageRemoteFileIntoRoot(params) {
  const tmpRoot = resolvePreferredOpenClawTmpDir();
  await fs.mkdir(tmpRoot, { recursive: true });
  const tmpDir = await fs.mkdtemp(path.join(tmpRoot, "stage-sandbox-media-"));
  const tmpPath = path.join(tmpDir, "download");
  try {
    await scpFile(params.remoteHost, params.remotePath, tmpPath);
    await stageLocalFileIntoRoot({
      sourcePath: tmpPath,
      rootDir: params.rootDir,
      relativeDestPath: params.relativeDestPath,
      maxBytes: params.maxBytes,
    });
  } finally {
    await fs
      .rm(tmpDir, {
        recursive: true,
        force: true,
      })
      .catch(() => {});
  }
}
function resolveRawPaths(ctx) {
  const pathsFromArray = Array.isArray(ctx.MediaPaths) ? ctx.MediaPaths : void 0;
  return pathsFromArray && pathsFromArray.length > 0
    ? pathsFromArray
    : normalizeOptionalString(ctx.MediaPath)
      ? [normalizeOptionalString(ctx.MediaPath)]
      : [];
}
function resolveAbsolutePath(value) {
  let resolved = value.trim();
  if (!resolved) return null;
  if (resolved.startsWith("file://"))
    try {
      resolved = fileURLToPath(resolved);
    } catch {
      return null;
    }
  if (!path.isAbsolute(resolved)) return null;
  return resolved;
}
async function isAllowedSourcePath(params) {
  if (params.mediaRemoteHost) {
    if (
      !isInboundPathAllowed({
        filePath: params.source,
        roots: params.remoteAttachmentRoots,
      })
    ) {
      logVerbose(`Blocking remote media staging from disallowed attachment path: ${params.source}`);
      return false;
    }
    return true;
  }
  if (await resolveInboundMediaReference(params.source).catch(() => null)) return true;
  const mediaDir = getMediaDir();
  const canonicalMediaDir = await fs.realpath(mediaDir).catch(() => mediaDir);
  if (
    !isInboundPathAllowed({
      filePath: params.source,
      roots: [mediaDir, canonicalMediaDir],
    })
  ) {
    logVerbose(`Blocking attempt to stage media from outside media directory: ${params.source}`);
    return false;
  }
  try {
    await assertSandboxPath({
      filePath: await fs.realpath(params.source).catch(() => params.source),
      cwd: canonicalMediaDir,
      root: canonicalMediaDir,
    });
    return true;
  } catch {
    logVerbose(`Blocking attempt to stage media from outside media directory: ${params.source}`);
    return false;
  }
}
function allocateStagedFileName(source, usedNames) {
  const baseName = path.basename(source);
  if (!baseName) return null;
  const parsed = path.parse(baseName);
  let fileName = baseName;
  let suffix = 1;
  while (usedNames.has(fileName)) {
    fileName = `${parsed.name}-${suffix}${parsed.ext}`;
    suffix += 1;
  }
  usedNames.add(fileName);
  return fileName;
}
function rewriteStagedMediaPaths(params) {
  const rewriteIfStaged = (value) => {
    const raw = normalizeOptionalString(value);
    if (!raw) return value;
    const abs = resolveAbsolutePath(raw);
    return params.staged.get(raw) ?? (abs ? params.staged.get(abs) : void 0) ?? value;
  };
  const nextMediaPaths = params.hasPathsArray
    ? params.rawPaths.map((p) => rewriteIfStaged(p) ?? p)
    : void 0;
  if (nextMediaPaths) {
    params.ctx.MediaPaths = nextMediaPaths;
    params.sessionCtx.MediaPaths = nextMediaPaths;
    params.ctx.MediaPath = nextMediaPaths[0];
    params.sessionCtx.MediaPath = nextMediaPaths[0];
  } else {
    const rewritten = rewriteIfStaged(params.ctx.MediaPath);
    if (rewritten && rewritten !== params.ctx.MediaPath) {
      params.ctx.MediaPath = rewritten;
      params.sessionCtx.MediaPath = rewritten;
    }
  }
  if (Array.isArray(params.ctx.MediaUrls) && params.ctx.MediaUrls.length > 0) {
    const nextUrls = params.ctx.MediaUrls.map((u) => rewriteIfStaged(u) ?? u);
    params.ctx.MediaUrls = nextUrls;
    params.sessionCtx.MediaUrls = nextUrls;
  }
  const rewrittenUrl = rewriteIfStaged(params.ctx.MediaUrl);
  if (rewrittenUrl && rewrittenUrl !== params.ctx.MediaUrl) {
    params.ctx.MediaUrl = rewrittenUrl;
    params.sessionCtx.MediaUrl = rewrittenUrl;
  }
}
async function scpFile(remoteHost, remotePath, localPath) {
  const safeRemoteHost = normalizeScpRemoteHost(remoteHost);
  if (!safeRemoteHost) throw new Error("invalid remote host for SCP");
  const safeRemotePath = normalizeScpRemotePath(remotePath);
  if (!safeRemotePath) throw new Error("invalid remote path for SCP");
  const result = await runCommandWithTimeout(
    [
      "scp",
      "-o",
      "BatchMode=yes",
      "-o",
      "StrictHostKeyChecking=yes",
      "--",
      `${safeRemoteHost}:${safeRemotePath}`,
      localPath,
    ],
    {
      maxOutputBytes: {
        stdout: 1,
        stderr: SCP_STDERR_TAIL_CHARS * 4,
      },
    },
  );
  if (result.code !== 0) {
    const stderr = appendScpStderrTail("", result.stderr).trim();
    throw new Error(`scp failed (${result.code}): ${stderr}`);
  }
}
function appendScpStderrTail(current, chunk, maxChars = SCP_STDERR_TAIL_CHARS) {
  const combined = `${current}${chunk}`;
  if (combined.length <= maxChars) return combined;
  return sliceUtf16Safe(combined, Math.max(0, combined.length - maxChars));
}
//#endregion
export { stageSandboxMedia as t };
