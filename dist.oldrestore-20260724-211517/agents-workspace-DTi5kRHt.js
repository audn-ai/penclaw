import "./agent-scope-y9xQv_q1.js";
import path from "node:path";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { n as listAgentIds, o as resolveAgentWorkspaceDir } from "./agent-scope-config-DVIR1nBa.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import { n as detectMime } from "./mime-BSEMEb3s.js";
import {
  d as validateAgentsWorkspaceGetParams,
  f as validateAgentsWorkspaceListParams,
} from "./src-CIJf1lT0.js";
import { t as assertValidParams } from "./validation-DyMnkiTp.js";
import {
  a as readWorkspaceFile,
  c as sortWorkspaceEntries,
  f as workspaceStatKind,
  i as normalizeRelativePath,
  l as statWorkspacePath,
  n as decodeUtf8Strict,
  o as resolveWorkspacePath,
  r as listWorkspacePath,
  t as WORKSPACE_PREVIEW_MAX_BYTES,
  u as toUpdatedAtMs,
} from "./workspace-fs-DUogRy5S.js";
//#region src/gateway/server-methods/agents-workspace.ts
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const DEFAULT_LIST_LIMIT = 250;
const MAX_LIST_LIMIT = 500;
const IMAGE_EXTENSIONS = /* @__PURE__ */ new Set([
  ".avif",
  ".bmp",
  ".gif",
  ".heic",
  ".heif",
  ".jpeg",
  ".jpg",
  ".png",
  ".webp",
]);
const SUPPORTED_IMAGE_MIME_TYPES = /* @__PURE__ */ new Set([
  "image/avif",
  "image/bmp",
  "image/gif",
  "image/heic",
  "image/heif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);
function workspaceError(type, message, details) {
  return errorShape(ErrorCodes.INVALID_REQUEST, message, {
    details: {
      type,
      ...details,
    },
  });
}
function resolveWorkspaceScopeOrRespond(params, cfg, respond) {
  const agentId = normalizeAgentId(params.agentId);
  if (!new Set(listAgentIds(cfg)).has(agentId)) {
    respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown agent id"));
    return null;
  }
  const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
  const rawPath = params.path ?? "";
  const portablePath = rawPath.replaceAll("\\", "/");
  if (path.posix.isAbsolute(portablePath) || path.win32.isAbsolute(rawPath)) {
    respond(
      false,
      void 0,
      workspaceError("workspace_path_invalid", "path must be workspace-relative", {
        path: rawPath,
      }),
    );
    return null;
  }
  const browserPath = normalizeRelativePath(params.path);
  if (!resolveWorkspacePath(workspaceDir, browserPath || ".")) {
    respond(
      false,
      void 0,
      workspaceError("workspace_path_invalid", "path escapes the agent workspace", {
        path: params.path ?? "",
      }),
    );
    return null;
  }
  return {
    agentId,
    workspaceDir,
    browserPath,
  };
}
/** Gateway handlers for read-only agent workspace browsing. */
const agentsWorkspaceHandlers = {
  "agents.workspace.list": async ({ params, respond, context }) => {
    if (
      !assertValidParams(
        params,
        validateAgentsWorkspaceListParams,
        "agents.workspace.list",
        respond,
      )
    )
      return;
    const scope = resolveWorkspaceScopeOrRespond(params, context.getRuntimeConfig(), respond);
    if (!scope) return;
    const { agentId, workspaceDir, browserPath } = scope;
    const stat = await statWorkspacePath(workspaceDir, browserPath);
    const dirents =
      stat && workspaceStatKind(stat) === "directory"
        ? await listWorkspacePath(workspaceDir, browserPath)
        : void 0;
    if (!dirents) {
      respond(
        false,
        void 0,
        workspaceError("workspace_path_not_found", "workspace directory not found", {
          path: browserPath,
        }),
      );
      return;
    }
    const entries = sortWorkspaceEntries(
      dirents.flatMap((dirent) => {
        const statKind = workspaceStatKind(dirent);
        const kind = statKind === "directory" ? "directory" : statKind === "file" ? "file" : null;
        if (!kind) return [];
        return [
          {
            path: browserPath ? `${browserPath}/${dirent.name}` : dirent.name,
            name: dirent.name,
            kind,
            ...(kind === "file" ? { size: dirent.size } : {}),
            updatedAtMs: toUpdatedAtMs(dirent.mtimeMs),
          },
        ];
      }),
    );
    const offset = Math.min(params.offset ?? 0, entries.length);
    const limit = Math.min(params.limit ?? DEFAULT_LIST_LIMIT, MAX_LIST_LIMIT);
    const parent = path.dirname(browserPath);
    respond(true, {
      agentId,
      path: browserPath,
      ...(browserPath ? { parentPath: parent === "." ? "" : parent } : {}),
      entries: entries.slice(offset, offset + limit),
      totalEntries: entries.length,
      offset,
    });
  },
  "agents.workspace.get": async ({ params, respond, context }) => {
    if (
      !assertValidParams(params, validateAgentsWorkspaceGetParams, "agents.workspace.get", respond)
    )
      return;
    const scope = resolveWorkspaceScopeOrRespond(params, context.getRuntimeConfig(), respond);
    if (!scope) return;
    const { agentId, workspaceDir, browserPath } = scope;
    const respondNotFound = () => {
      respond(
        false,
        void 0,
        workspaceError("workspace_file_not_found", "workspace file not found", {
          path: browserPath,
        }),
      );
    };
    if (!browserPath) {
      respondNotFound();
      return;
    }
    const stat = await statWorkspacePath(workspaceDir, browserPath);
    if (!stat || workspaceStatKind(stat) !== "file") {
      respondNotFound();
      return;
    }
    const expectsImage = IMAGE_EXTENSIONS.has(path.extname(browserPath).toLowerCase());
    const maxBytes = expectsImage ? MAX_IMAGE_BYTES : WORKSPACE_PREVIEW_MAX_BYTES;
    const read =
      stat.size > maxBytes
        ? "too-large"
        : await readWorkspaceFile(workspaceDir, browserPath, { maxBytes });
    if (read === "too-large") {
      respond(
        false,
        void 0,
        workspaceError("workspace_file_too_large", "workspace file is too large to preview", {
          maxBytes,
          path: browserPath,
          size: stat.size,
        }),
      );
      return;
    }
    if (!read) {
      respondNotFound();
      return;
    }
    const respondUnsupported = () => {
      respond(
        false,
        void 0,
        workspaceError(
          "workspace_file_unsupported",
          "workspace file is not UTF-8 text or a supported image",
          { path: browserPath },
        ),
      );
    };
    if (expectsImage) {
      const sniffedMime = await detectMime({ buffer: read.buffer });
      if (!sniffedMime || !SUPPORTED_IMAGE_MIME_TYPES.has(sniffedMime)) {
        respondUnsupported();
        return;
      }
      respond(true, {
        agentId,
        file: {
          path: browserPath,
          name: path.basename(browserPath),
          size: read.stat.size,
          updatedAtMs: toUpdatedAtMs(read.stat.mtimeMs),
          mimeType: sniffedMime,
          encoding: "base64",
          content: read.buffer.toString("base64"),
        },
      });
      return;
    }
    const text = decodeUtf8Strict(read.buffer);
    if (text === void 0) {
      respondUnsupported();
      return;
    }
    respond(true, {
      agentId,
      file: {
        path: browserPath,
        name: path.basename(browserPath),
        size: read.stat.size,
        updatedAtMs: toUpdatedAtMs(read.stat.mtimeMs),
        mimeType: "text/plain",
        encoding: "utf8",
        content: text,
      },
    });
  },
};
//#endregion
export { agentsWorkspaceHandlers };
