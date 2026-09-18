import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { n as CANVAS_HOST_PATH } from "./a2ui-shared-CYxiODnT.js";
import "./security-runtime-CraX8Pqe.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import "./state-paths-DU65nx5N.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import "./a2ui-RdgwszOx.js";
import { a as root } from "./secure-temp-dir-DMUMnweR.js";
import { r as sanitizeUntrustedFileName } from "./sibling-temp-B46XkYIp.js";
import { t as escapeHtml } from "./text-utility-runtime-CJESZCN5.js";
//#region extensions/canvas/src/documents.ts
/**
 * Canvas document materialization helpers for hosted HTML, media, documents,
 * and asset manifests.
 */
const CANVAS_DOCUMENTS_DIR_NAME = "documents";
function isPdfPathLike(value) {
  return /\.pdf(?:[?#].*)?$/i.test(value.trim());
}
function buildPdfWrapper(url) {
  const escaped = escapeHtml(url);
  return `<!doctype html><html><body style="margin:0;background:#e5e7eb;"><object data="${escaped}" type="application/pdf" style="width:100%;height:100vh;border:0;"><iframe src="${escaped}" style="width:100%;height:100vh;border:0;"></iframe><p style="padding:16px;font:14px system-ui,sans-serif;">Unable to render PDF preview. <a href="${escaped}" target="_blank" rel="noopener noreferrer">Open PDF</a>.</p></object></body></html>`;
}
function normalizeLogicalPath(value) {
  const parts = value.replaceAll("\\", "/").replace(/^\/+/, "").split("/").filter(Boolean);
  if (
    parts.length === 0 ||
    parts.some(
      (part) => part === "." || part === ".." || part.includes(":") || hasControlCharacter(part),
    )
  )
    throw new Error("canvas document logicalPath invalid");
  return parts.join("/");
}
function hasControlCharacter(value) {
  for (const char of value) {
    const code = char.charCodeAt(0);
    if (code < 32 || code === 127) return true;
  }
  return false;
}
function canvasDocumentId() {
  return `cv_${randomUUID().replaceAll("-", "")}`;
}
function normalizeCanvasDocumentId(value) {
  const normalized = value.trim();
  if (
    !normalized ||
    normalized === "." ||
    normalized === ".." ||
    !/^[A-Za-z0-9._-]+$/.test(normalized)
  )
    throw new Error("canvas document id invalid");
  return normalized;
}
function resolveCanvasRootDir(rootDir, stateDir = resolveStateDir()) {
  const resolved = rootDir?.trim() ? resolveUserPath(rootDir) : path.join(stateDir, "canvas");
  return path.resolve(resolved);
}
function resolveCanvasDocumentsDir(rootDir, stateDir = resolveStateDir()) {
  return path.join(resolveCanvasRootDir(rootDir, stateDir), CANVAS_DOCUMENTS_DIR_NAME);
}
async function pruneCanvasDocumentsForScope(params) {
  const entries = await fs.readdir(params.documentsDir, { withFileTypes: true });
  const scopedDocuments = (
    await Promise.all(
      entries
        .filter((entry) => entry.isDirectory())
        .map(async (entry) => {
          try {
            const manifest = JSON.parse(
              await fs.readFile(
                path.join(params.documentsDir, entry.name, "manifest.json"),
                "utf8",
              ),
            );
            if (
              manifest.retentionScope !== params.retentionScope ||
              typeof manifest.createdAt !== "string"
            )
              return null;
            return {
              id: entry.name,
              createdAt: manifest.createdAt,
            };
          } catch {
            return null;
          }
        }),
    )
  ).filter((entry) => entry !== null);
  const deleteCount = Math.max(0, scopedDocuments.length - params.maxDocuments);
  const oldest = scopedDocuments
    .toSorted(
      (left, right) =>
        left.createdAt.localeCompare(right.createdAt) || left.id.localeCompare(right.id),
    )
    .slice(0, deleteCount);
  await Promise.all(
    oldest.map((entry) =>
      fs.rm(path.join(params.documentsDir, entry.id), {
        recursive: true,
        force: true,
      }),
    ),
  );
}
/** Resolves the on-disk directory for one Canvas document id. */
function resolveCanvasDocumentDir(documentId, options) {
  return path.join(resolveCanvasDocumentsDir(options?.rootDir, options?.stateDir), documentId);
}
/** Builds the hosted URL path for a Canvas document entrypoint. */
function buildCanvasDocumentEntryUrl(documentId, entrypoint) {
  const encodedEntrypoint = normalizeLogicalPath(entrypoint)
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${CANVAS_HOST_PATH}/${CANVAS_DOCUMENTS_DIR_NAME}/${encodeURIComponent(documentId)}/${encodedEntrypoint}`;
}
function buildCanvasDocumentAssetUrl(documentId, logicalPath) {
  return buildCanvasDocumentEntryUrl(documentId, logicalPath);
}
/** Maps a Canvas hosted document URL path back to a local file path. */
function resolveCanvasHttpPathToLocalPath(requestPath, options) {
  const trimmed = requestPath.trim();
  const prefix = `${CANVAS_HOST_PATH}/${CANVAS_DOCUMENTS_DIR_NAME}/`;
  if (!trimmed.startsWith(prefix)) return null;
  const relative = trimmed.replace(/[?#].*$/, "").slice(prefix.length);
  const segments = [];
  for (const segment of relative.split("/")) {
    if (!segment) continue;
    try {
      segments.push(decodeURIComponent(segment));
    } catch {
      return null;
    }
  }
  if (segments.length < 2) return null;
  const [rawDocumentId, ...entrySegments] = segments;
  if (!rawDocumentId) return null;
  try {
    const documentId = normalizeCanvasDocumentId(rawDocumentId);
    const normalizedEntrypoint = normalizeLogicalPath(entrySegments.join("/"));
    const documentsDir = path.resolve(
      resolveCanvasDocumentsDir(options?.rootDir, options?.stateDir),
    );
    const candidatePath = path.resolve(
      resolveCanvasDocumentDir(documentId, options),
      normalizedEntrypoint,
    );
    if (!(candidatePath === documentsDir || candidatePath.startsWith(`${documentsDir}${path.sep}`)))
      return null;
    return candidatePath;
  } catch {
    return null;
  }
}
async function writeManifest(root, manifest) {
  await root.writeJson("manifest.json", manifest, { space: 2 });
}
async function copyAssets(root, assets, workspaceDir) {
  const copied = [];
  for (const asset of assets ?? []) {
    const logicalPath = normalizeLogicalPath(asset.logicalPath);
    const sourcePath = asset.sourcePath.startsWith("~")
      ? resolveUserPath(asset.sourcePath)
      : path.isAbsolute(asset.sourcePath)
        ? path.resolve(asset.sourcePath)
        : path.resolve(workspaceDir, asset.sourcePath);
    await root.copyIn(logicalPath, sourcePath);
    copied.push({
      logicalPath,
      ...(asset.contentType ? { contentType: asset.contentType } : {}),
    });
  }
  return copied;
}
async function materializeEntrypoint(rootDir, root, input, workspaceDir) {
  const entrypoint = input.entrypoint;
  if (!entrypoint) throw new Error("canvas document entrypoint required");
  if (entrypoint.type === "html") {
    const fileName = "index.html";
    await root.write(fileName, entrypoint.value);
    return {
      localEntrypoint: fileName,
      entryUrl: buildCanvasDocumentEntryUrl(path.basename(rootDir), fileName),
    };
  }
  if (entrypoint.type === "url") {
    if (input.kind === "document" && isPdfPathLike(entrypoint.value)) {
      const fileName = "index.html";
      await root.write(fileName, buildPdfWrapper(entrypoint.value));
      return {
        localEntrypoint: fileName,
        externalUrl: entrypoint.value,
        entryUrl: buildCanvasDocumentEntryUrl(path.basename(rootDir), fileName),
      };
    }
    return {
      externalUrl: entrypoint.value,
      entryUrl: entrypoint.value,
    };
  }
  const resolvedPath = entrypoint.value.startsWith("~")
    ? resolveUserPath(entrypoint.value)
    : path.isAbsolute(entrypoint.value)
      ? path.resolve(entrypoint.value)
      : path.resolve(workspaceDir, entrypoint.value);
  if (input.kind === "image" || input.kind === "video_asset") {
    const copiedName = sanitizeUntrustedFileName(path.basename(resolvedPath), "asset");
    await root.copyIn(copiedName, resolvedPath);
    const wrapper =
      input.kind === "image"
        ? `<!doctype html><html><body style="margin:0;background:#0f172a;display:flex;align-items:center;justify-content:center;"><img src="${escapeHtml(copiedName)}" style="max-width:100%;max-height:100vh;object-fit:contain;" /></body></html>`
        : `<!doctype html><html><body style="margin:0;background:#0f172a;"><video src="${escapeHtml(copiedName)}" controls autoplay style="width:100%;height:100vh;object-fit:contain;background:#000;"></video></body></html>`;
    await root.write("index.html", wrapper);
    return {
      localEntrypoint: "index.html",
      entryUrl: buildCanvasDocumentEntryUrl(path.basename(rootDir), "index.html"),
    };
  }
  const fileName = sanitizeUntrustedFileName(path.basename(resolvedPath), "document");
  await root.copyIn(fileName, resolvedPath);
  if (input.kind === "document" && isPdfPathLike(fileName)) {
    await root.write("index.html", buildPdfWrapper(fileName));
    return {
      localEntrypoint: "index.html",
      entryUrl: buildCanvasDocumentEntryUrl(path.basename(rootDir), "index.html"),
    };
  }
  return {
    localEntrypoint: fileName,
    entryUrl: buildCanvasDocumentEntryUrl(path.basename(rootDir), fileName),
  };
}
/** Creates a Canvas document directory, copies assets, and writes its manifest. */
async function createCanvasDocument(input, options) {
  const workspaceDir = options?.workspaceDir ?? process.cwd();
  const id = input.id?.trim() ? normalizeCanvasDocumentId(input.id) : canvasDocumentId();
  const rootDir = resolveCanvasDocumentDir(id, {
    stateDir: options?.stateDir,
    rootDir: options?.canvasRootDir,
  });
  await fs
    .rm(rootDir, {
      recursive: true,
      force: true,
    })
    .catch(() => void 0);
  await fs.mkdir(rootDir, { recursive: true });
  const root$1 = await root(rootDir);
  const assets = await copyAssets(root$1, input.assets, workspaceDir);
  const entry = await materializeEntrypoint(rootDir, root$1, input, workspaceDir);
  const manifest = {
    id,
    kind: input.kind,
    ...(input.title?.trim() ? { title: input.title.trim() } : {}),
    ...(typeof input.preferredHeight === "number"
      ? { preferredHeight: input.preferredHeight }
      : {}),
    ...(input.surface ? { surface: input.surface } : {}),
    ...(input.retentionScope ? { retentionScope: input.retentionScope } : {}),
    ...(input.cspSandbox ? { cspSandbox: input.cspSandbox } : {}),
    createdAt: /* @__PURE__ */ new Date().toISOString(),
    entryUrl: entry.entryUrl,
    ...(entry.localEntrypoint ? { localEntrypoint: entry.localEntrypoint } : {}),
    ...(entry.externalUrl ? { externalUrl: entry.externalUrl } : {}),
    assets,
  };
  await writeManifest(root$1, manifest);
  if (input.retentionScope && options?.maxDocumentsPerScope)
    await pruneCanvasDocumentsForScope({
      documentsDir: resolveCanvasDocumentsDir(options.canvasRootDir, options.stateDir),
      retentionScope: input.retentionScope,
      maxDocuments: options.maxDocumentsPerScope,
    });
  return manifest;
}
/** Resolves manifest assets to local paths and hosted URLs. */
function resolveCanvasDocumentAssets(manifest, options) {
  const baseUrl = options?.baseUrl?.trim().replace(/\/+$/, "");
  const documentDir = resolveCanvasDocumentDir(manifest.id, {
    stateDir: options?.stateDir,
    rootDir: options?.canvasRootDir,
  });
  return manifest.assets.map((asset) => ({
    logicalPath: asset.logicalPath,
    ...(asset.contentType ? { contentType: asset.contentType } : {}),
    localPath: path.join(documentDir, asset.logicalPath),
    url: baseUrl
      ? `${baseUrl}${buildCanvasDocumentAssetUrl(manifest.id, asset.logicalPath)}`
      : buildCanvasDocumentAssetUrl(manifest.id, asset.logicalPath),
  }));
}
//#endregion
export {
  resolveCanvasHttpPathToLocalPath as a,
  resolveCanvasDocumentDir as i,
  createCanvasDocument as n,
  resolveCanvasDocumentAssets as r,
  buildCanvasDocumentEntryUrl as t,
};
