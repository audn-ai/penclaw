import { createHash } from "node:crypto";
import path from "node:path";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import "./fs-safe-RNq3oO57.js";
import "./agent-scope-y9xQv_q1.js";
import {
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import { C as FsSafeError } from "./path-DILYn_gk.js";
import { n as resolveToCwd } from "./path-utils-CMJImZDW.js";
import { r as asOptionalObjectRecord } from "./record-coerce-DHZ4bFlT.js";
import { c as parseAgentSessionKey } from "./session-key-utils-B8sNp9l4.js";
import { g as visitSessionMessagesAsync } from "./session-transcript-readers-Bv0ty7AX.js";
import { u as loadSessionEntry } from "./session-utils-DjTWBI0J.js";
import {
  er as validateSessionsFilesGetParams,
  nr as validateSessionsFilesSetParams,
  tr as validateSessionsFilesListParams,
} from "./src-CIJf1lT0.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as assertValidParams } from "./validation-DyMnkiTp.js";
import {
  a as readWorkspaceFile,
  c as sortWorkspaceEntries,
  d as updateWorkspaceFile,
  f as workspaceStatKind,
  i as normalizeRelativePath,
  l as statWorkspacePath,
  n as decodeUtf8Strict,
  o as resolveWorkspacePath,
  r as listWorkspacePath,
  s as sortDirents,
  t as WORKSPACE_PREVIEW_MAX_BYTES,
  u as toUpdatedAtMs,
} from "./workspace-fs-DUogRy5S.js";
//#region src/gateway/server-methods/sessions-files.ts
const MAX_PREVIEW_BYTES = WORKSPACE_PREVIEW_MAX_BYTES;
const MAX_BROWSER_ENTRIES = 250;
const MAX_SEARCH_ENTRIES = 500;
const MAX_SEARCH_VISITED_ENTRIES = 5e3;
const SEARCH_SKIP_DIRS = /* @__PURE__ */ new Set([
  ".git",
  ".hg",
  ".next",
  ".turbo",
  ".yarn",
  "coverage",
  "dist",
  "node_modules",
]);
function sessionFilesError(type, message, details) {
  return errorShape(ErrorCodes.INVALID_REQUEST, message, {
    details: {
      type,
      ...details,
    },
  });
}
function normalizePathValue(value) {
  if (typeof value !== "string") return;
  return value.trim() || void 0;
}
function readPathArg(args) {
  return (
    normalizePathValue(args.path) ??
    normalizePathValue(args.file_path) ??
    normalizePathValue(args.filePath) ??
    normalizePathValue(args.file)
  );
}
function addTouchedFile(files, filePath, kind) {
  if (!filePath) return;
  const existing = files.get(filePath);
  if (existing?.kind === "modified" || (existing && kind === "read")) return;
  files.set(filePath, {
    path: filePath,
    kind,
  });
}
function addRawPatchFiles(files, input) {
  if (typeof input !== "string") return;
  for (const match of input.matchAll(/^\*\*\* (?:Add|Update|Delete) File: (.+)$/gm))
    addTouchedFile(files, match[1]?.trim(), "modified");
  for (const match of input.matchAll(/^\*\*\* Move to: (.+)$/gm))
    addTouchedFile(files, match[1]?.trim(), "modified");
}
function addStructuredPatchFiles(files, changes) {
  if (!Array.isArray(changes)) return;
  for (const changeValue of changes) {
    const change = asOptionalObjectRecord(changeValue);
    addTouchedFile(files, normalizePathValue(change?.path), "modified");
    const kind = asOptionalObjectRecord(change?.kind);
    addTouchedFile(
      files,
      normalizePathValue(kind?.move_path) ?? normalizePathValue(kind?.movePath),
      "modified",
    );
  }
}
function addPatchFiles(files, args) {
  addRawPatchFiles(files, args.input);
  addStructuredPatchFiles(files, args.changes);
}
function isToolCallBlockType(value) {
  if (typeof value !== "string") return false;
  const normalized = value.toLowerCase().replace(/[_-]/g, "");
  return normalized === "toolcall" || normalized === "tooluse";
}
function collectTouchedFilesFromMessage(message, files) {
  const record = asOptionalObjectRecord(message);
  if (record?.role !== "assistant" || !Array.isArray(record.content)) return;
  for (const blockValue of record.content) {
    const block = asOptionalObjectRecord(blockValue);
    if (!block || !isToolCallBlockType(block.type)) continue;
    const toolName = normalizeOptionalString(block.name)?.toLowerCase();
    const args =
      asOptionalObjectRecord(block.arguments) ??
      asOptionalObjectRecord(block.input) ??
      asOptionalObjectRecord(block.args);
    if (!toolName || !args) continue;
    if (toolName === "read") addTouchedFile(files, readPathArg(args), "read");
    else if (toolName === "write" || toolName === "edit")
      addTouchedFile(files, readPathArg(args), "modified");
    else if (toolName === "apply_patch") addPatchFiles(files, args);
  }
}
function toDisplayPath(root, resolved) {
  const relative = path.relative(root, resolved);
  if (!relative) return "";
  return relative.split(path.sep).join("/");
}
function isInsideRoot(root, candidate) {
  const relative = path.relative(root, candidate);
  return (
    relative === "" ||
    (relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative))
  );
}
function resolveTouchedFilePath(params) {
  if (!params.root) return;
  const base = params.fileRoot ?? params.root;
  const resolved = resolveToCwd(params.filePath, base);
  if (!isInsideRoot(params.root, resolved)) return;
  return resolved;
}
function resolveFileRoot(params) {
  if (!params.root) return;
  if (!params.spawnedCwd) return params.root;
  const resolvedCwd = path.resolve(params.spawnedCwd);
  return isInsideRoot(path.resolve(params.root), resolvedCwd) ? params.spawnedCwd : params.root;
}
function relevanceForKind(kind) {
  return kind;
}
function mergeRelevance(current, next) {
  if (!current) return next;
  if (!next || current === next) return current;
  return "mixed";
}
function buildSessionRelevanceMap(files, root, fileRoot) {
  const relevance = /* @__PURE__ */ new Map();
  if (!root) {
    for (const file of files)
      relevance.set(normalizeRelativePath(file.path), relevanceForKind(file.kind));
    return relevance;
  }
  for (const file of files) {
    const resolved = resolveTouchedFilePath({
      root,
      fileRoot,
      filePath: file.path,
    });
    if (!resolved) continue;
    relevance.set(toDisplayPath(root, resolved), relevanceForKind(file.kind));
  }
  return relevance;
}
function relevanceForBrowserPath(browserPath, kind, relevance) {
  if (kind === "file") return relevance.get(browserPath);
  const prefix = browserPath ? `${browserPath}/` : "";
  let aggregate;
  for (const [filePath, sessionKind] of relevance)
    if (filePath.startsWith(prefix) && filePath !== browserPath)
      aggregate = mergeRelevance(aggregate, sessionKind);
  return aggregate;
}
function displayNameForPath(filePath) {
  return path.basename(filePath) || filePath;
}
async function toSessionFileEntry(touched, root, fileRoot, opts = {}) {
  const resolved = resolveTouchedFilePath({
    root,
    fileRoot,
    filePath: touched.path,
  });
  const base = {
    path: touched.path,
    name: displayNameForPath(touched.path),
    kind: touched.kind,
  };
  if (!resolved)
    return {
      ...base,
      missing: true,
    };
  const browserPath = toDisplayPath(root, resolved);
  const stat = await statWorkspacePath(root, browserPath);
  if (!stat || workspaceStatKind(stat) !== "file")
    return {
      ...base,
      missing: true,
    };
  const entry = {
    ...base,
    workspacePath: browserPath,
    missing: false,
    size: stat.size,
    updatedAtMs: toUpdatedAtMs(stat.mtimeMs),
  };
  if (opts.includeContent && stat.size <= MAX_PREVIEW_BYTES) {
    const read = await readWorkspaceFile(root, browserPath);
    if (!read)
      return {
        ...base,
        missing: true,
      };
    if (read !== "too-large") {
      entry.workspacePath = read.canonicalPath;
      entry.size = read.stat.size;
      entry.updatedAtMs = toUpdatedAtMs(read.stat.mtimeMs);
      const text = decodeUtf8Strict(read.buffer);
      entry.content = text ?? read.buffer.toString("utf8");
      if (text !== void 0) entry.hash = createHash("sha256").update(read.buffer).digest("hex");
    }
  }
  return entry;
}
function loadSessionFileRoot(params) {
  const loaded = loadSessionEntry(params.sessionKey, { agentId: params.agentId });
  if (!loaded.entry?.sessionId)
    return {
      ...loaded,
      agentId: void 0,
      root: void 0,
      fileRoot: void 0,
    };
  const agentId = normalizeAgentId(
    parseAgentSessionKey(loaded.canonicalKey)?.agentId ??
      params.agentId ??
      parseAgentSessionKey(params.sessionKey)?.agentId ??
      resolveDefaultAgentId(loaded.cfg),
  );
  const spawnedCwd = normalizePathValue(loaded.entry.spawnedCwd);
  const root =
    normalizePathValue(loaded.entry.spawnedWorkspaceDir) ??
    spawnedCwd ??
    normalizePathValue(resolveAgentWorkspaceDir(loaded.cfg, agentId));
  return {
    ...loaded,
    agentId,
    root,
    fileRoot: resolveFileRoot({
      root,
      spawnedCwd,
    }),
  };
}
function resolveSessionFileCandidates(params) {
  return [
    resolveTouchedFilePath(params),
    resolveWorkspacePath(params.root, params.filePath),
  ].filter((candidate, index, all) => {
    return candidate !== void 0 && all.indexOf(candidate) === index;
  });
}
async function toBrowserEntry(browserPath, dirent, relevance) {
  const statKind = workspaceStatKind(dirent);
  const kind = statKind === "directory" ? "directory" : statKind === "file" ? "file" : null;
  if (!kind) return;
  const sessionKind = relevanceForBrowserPath(browserPath, kind, relevance);
  return {
    path: browserPath,
    name: dirent.name,
    kind,
    ...(kind === "file" ? { size: dirent.size } : {}),
    updatedAtMs: toUpdatedAtMs(dirent.mtimeMs),
    ...(sessionKind ? { sessionKind } : {}),
  };
}
function matchesSearch(entryPath, name, query) {
  const normalizedQuery = query.toLowerCase();
  return (
    name.toLowerCase().includes(normalizedQuery) ||
    entryPath.toLowerCase().includes(normalizedQuery)
  );
}
async function searchBrowserEntries(params) {
  const entries = [];
  let visitedEntries = 0;
  let truncated = false;
  const shouldStop = () => {
    if (entries.length >= MAX_SEARCH_ENTRIES || visitedEntries >= MAX_SEARCH_VISITED_ENTRIES) {
      truncated = true;
      return true;
    }
    return false;
  };
  const visit = async (dir) => {
    if (shouldStop()) return;
    const dirents = await listWorkspacePath(params.root, dir);
    if (!dirents) return;
    for (const dirent of sortDirents(dirents)) {
      if (shouldStop()) return;
      visitedEntries += 1;
      const browserPath = dir ? `${dir}/${dirent.name}` : dirent.name;
      if (matchesSearch(browserPath, dirent.name, params.query)) {
        const entry = await toBrowserEntry(browserPath, dirent, params.relevance);
        if (entry) entries.push(entry);
      }
      if (workspaceStatKind(dirent) === "directory" && !SEARCH_SKIP_DIRS.has(dirent.name))
        await visit(browserPath);
    }
  };
  await visit("");
  return {
    entries: sortWorkspaceEntries(entries),
    ...(truncated ? { truncated } : {}),
  };
}
async function buildBrowserResult(params) {
  if (!params.root) return;
  const search = normalizePathValue(params.search);
  const relevance = buildSessionRelevanceMap(params.files, params.root, params.fileRoot);
  if (search) {
    const result = await searchBrowserEntries({
      root: params.root,
      query: search,
      relevance,
    });
    return {
      path: "",
      search,
      entries: result.entries,
      ...(result.truncated ? { truncated: result.truncated } : {}),
    };
  }
  const browserPath = normalizeRelativePath(params.path);
  if (!resolveWorkspacePath(params.root, browserPath)) return;
  const stat = await statWorkspacePath(params.root, browserPath);
  if (!stat || workspaceStatKind(stat) !== "directory") return;
  const dirents = await listWorkspacePath(params.root, browserPath);
  if (!dirents) return;
  const entries = (
    await Promise.all(
      sortDirents(dirents)
        .slice(0, 251)
        .map((dirent) => {
          return toBrowserEntry(
            browserPath ? `${browserPath}/${dirent.name}` : dirent.name,
            dirent,
            relevance,
          );
        }),
    )
  ).filter((entry) => Boolean(entry));
  const parent = path.dirname(browserPath);
  return {
    path: browserPath,
    ...(browserPath ? { parentPath: parent === "." ? "" : parent } : {}),
    entries: sortWorkspaceEntries(entries.slice(0, MAX_BROWSER_ENTRIES)),
    ...(entries.length > MAX_BROWSER_ENTRIES ? { truncated: true } : {}),
  };
}
async function loadSessionFiles(params) {
  const loaded = loadSessionFileRoot(params);
  const { storePath, entry, canonicalKey, agentId } = loaded;
  if (!entry?.sessionId || !storePath || !agentId) return { files: [] };
  const files = /* @__PURE__ */ new Map();
  await visitSessionMessagesAsync(
    {
      agentId,
      sessionEntry: entry,
      sessionId: entry.sessionId,
      sessionKey: canonicalKey,
      storePath,
    },
    (message) => collectTouchedFilesFromMessage(message, files),
    {
      mode: "full",
      reason: "session files transcript scan",
      cache: "reuse",
    },
  );
  return {
    root: loaded.root,
    fileRoot: loaded.fileRoot,
    files: [...files.values()].toSorted((a, b) => {
      if (a.kind !== b.kind) return a.kind === "modified" ? -1 : 1;
      return a.path.localeCompare(b.path);
    }),
  };
}
async function buildListResult(params) {
  const loaded = await loadSessionFiles(params);
  const root = loaded.root;
  const workspaceFiles = root
    ? loaded.files.filter((file) =>
        Boolean(
          resolveTouchedFilePath({
            root,
            fileRoot: loaded.fileRoot,
            filePath: file.path,
          }),
        ),
      )
    : loaded.files;
  const files = await Promise.all(
    workspaceFiles.map((file) => toSessionFileEntry(file, loaded.root, loaded.fileRoot)),
  );
  const browser = await buildBrowserResult({
    root,
    fileRoot: loaded.fileRoot,
    path: params.path,
    search: params.search,
    files: workspaceFiles,
  });
  return {
    ...(root ? { root } : {}),
    files,
    ...(browser ? { browser } : {}),
  };
}
async function findSessionFile(params) {
  const loaded = await loadSessionFiles(params);
  const exactTouched = loaded.files.find((file) => file.path === params.path);
  if (exactTouched)
    return {
      ...(loaded.root ? { root: loaded.root } : {}),
      file: await toSessionFileEntry(exactTouched, loaded.root, loaded.fileRoot, {
        includeContent: true,
      }),
    };
  if (!loaded.root) return {};
  const candidates = resolveSessionFileCandidates({
    root: loaded.root,
    fileRoot: loaded.fileRoot,
    filePath: params.path,
  });
  if (candidates.length === 0) return { root: loaded.root };
  const relevance = buildSessionRelevanceMap(loaded.files, loaded.root, loaded.fileRoot);
  for (const candidate of candidates) {
    const browserPath = toDisplayPath(loaded.root, candidate);
    const file = await toSessionFileEntry(
      {
        path: browserPath,
        kind: relevance.get(browserPath) === "modified" ? "modified" : "read",
      },
      loaded.root,
      loaded.root,
      { includeContent: true },
    );
    if (!file.missing)
      return {
        root: loaded.root,
        file,
      };
  }
  return { root: loaded.root };
}
function respondSessionFileNotFound(respond, filePath) {
  respond(
    false,
    void 0,
    sessionFilesError("session_file_not_found", "session file not found", { path: filePath }),
  );
}
function respondSessionFileTooLarge(respond, file, filePath) {
  respond(
    false,
    void 0,
    sessionFilesError("session_file_too_large", "session file is too large to preview", {
      maxPreviewBytes: MAX_PREVIEW_BYTES,
      path: file.path || filePath,
      size: file.size,
    }),
  );
}
function respondSessionFileUnsafe(respond, filePath) {
  respond(
    false,
    void 0,
    sessionFilesError("session_file_unsafe", "session file could not be written safely", {
      path: filePath,
    }),
  );
}
/** Gateway handlers for session files and workspace browsing. */
const sessionsFilesHandlers = {
  "sessions.files.list": async ({ params, respond }) => {
    if (!assertValidParams(params, validateSessionsFilesListParams, "sessions.files.list", respond))
      return;
    const result = await buildListResult(params);
    respond(true, {
      sessionKey: params.sessionKey,
      ...result,
    });
  },
  "sessions.files.get": async ({ params, respond }) => {
    if (!assertValidParams(params, validateSessionsFilesGetParams, "sessions.files.get", respond))
      return;
    const result = await findSessionFile(params);
    if (typeof result.file?.content !== "string") {
      if (result.file && !result.file.missing) {
        respondSessionFileTooLarge(respond, result.file, params.path);
        return;
      }
      respondSessionFileNotFound(respond, params.path);
      return;
    }
    respond(true, {
      sessionKey: params.sessionKey,
      ...result,
    });
  },
  "sessions.files.set": async ({ params, respond }) => {
    if (!assertValidParams(params, validateSessionsFilesSetParams, "sessions.files.set", respond))
      return;
    if (params.content.includes("\0")) {
      respondSessionFileUnsafe(respond, params.path);
      return;
    }
    const contentBuffer = Buffer.from(params.content, "utf8");
    if (contentBuffer.toString("utf8") !== params.content) {
      respondSessionFileUnsafe(respond, params.path);
      return;
    }
    const contentSize = contentBuffer.byteLength;
    if (contentSize > MAX_PREVIEW_BYTES) {
      respond(
        false,
        void 0,
        sessionFilesError("session_file_too_large", "session file content is too large", {
          maxPreviewBytes: MAX_PREVIEW_BYTES,
          path: params.path,
          size: contentSize,
        }),
      );
      return;
    }
    const loaded = loadSessionFileRoot(params);
    if (!loaded.root) {
      respondSessionFileNotFound(respond, params.path);
      return;
    }
    const candidates = resolveSessionFileCandidates({
      root: loaded.root,
      fileRoot: loaded.fileRoot,
      filePath: params.path,
    });
    let browserPath;
    for (const candidate of candidates) {
      const candidatePath = toDisplayPath(loaded.root, candidate);
      const stat = await statWorkspacePath(loaded.root, candidatePath);
      if (stat && workspaceStatKind(stat) === "file") {
        browserPath = candidatePath;
        break;
      }
    }
    if (!browserPath) {
      respondSessionFileNotFound(respond, params.path);
      return;
    }
    let update;
    try {
      update = await updateWorkspaceFile(
        loaded.root,
        browserPath,
        params.content,
        params.expectedHash,
      );
    } catch (err) {
      if (!(err instanceof FsSafeError)) throw err;
      respondSessionFileUnsafe(respond, params.path);
      return;
    }
    if (update.status === "conflict") {
      respond(
        false,
        void 0,
        sessionFilesError("session_file_conflict", "session file changed since it was read", {
          path: params.path,
          currentHash: update.currentHash,
        }),
      );
      return;
    }
    if (update.status === "unsafe") {
      respondSessionFileUnsafe(respond, params.path);
      return;
    }
    respond(true, {
      sessionKey: params.sessionKey,
      root: loaded.root,
      file: {
        path: params.path,
        workspacePath: update.canonicalPath,
        name: displayNameForPath(update.canonicalPath),
        kind: "modified",
        missing: false,
        size: update.stat.size,
        updatedAtMs: toUpdatedAtMs(update.stat.mtimeMs),
        hash: update.hash,
      },
    });
  },
};
//#endregion
export { sessionsFilesHandlers };
