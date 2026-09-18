import { createHash, randomBytes, randomUUID } from "node:crypto";
import { chmodSync, mkdirSync } from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { Type } from "typebox";
import { r as formatErrorMessage } from "../../errors-BoHeli7m.js";
import "../../error-runtime-BIAwr399.js";
import "../../security-runtime-CraX8Pqe.js";
import { t as getPluginRuntimeGatewayRequestScope } from "../../gateway-request-scope-CiIBNuZX.js";
import { C as FsSafeError } from "../../path-DILYn_gk.js";
import "../../core-V3U0lOIj.js";
import "../../plugin-runtime-Cwru8G47.js";
import "../../plugin-state-runtime-BfXDrY7_.js";
import "../../state-paths-DU65nx5N.js";
import { y as resolveStateDir } from "../../paths-DEklnbzU.js";
import { t as definePluginEntry } from "../../plugin-entry-DzBhXPVE.js";
import {
  a as WorkspaceBindingResolutionError,
  i as DATA_READ_RPC_ALLOWLIST,
  n as isWorkspaceActor,
  o as normalizeWorkspaceDataLogicalPath,
  r as validateWorkspaceDoc,
  t as BUILTIN_WIDGET_KINDS,
} from "../../schema-Dl6Ohw9o.js";
import { a as root } from "../../secure-temp-dir-DMUMnweR.js";
import { t as configureSqliteConnectionPragmas } from "../../sqlite-wal-C_AVzaTm.js";
import { t as escapeHtml } from "../../text-utility-runtime-CJESZCN5.js";
import { t as jsonResult } from "../../tool-results-BCM3fdVS.js";
//#region extensions/workspaces/src/broadcast.ts
let handle;
/** Called by every workspace gateway method; idempotent after the first call. */
function rememberWorkspaceBroadcast(broadcast) {
  handle = broadcast;
}
/** The remembered broadcast, or undefined before any gateway method has run. */
function workspaceBroadcast() {
  return handle;
}
//#endregion
//#region extensions/workspaces/src/data-read.ts
const MAX_FILE_BYTES = 1024 * 1024;
function isRecord$3(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function readBinding(value) {
  if (!isRecord$3(value) || typeof value.source !== "string")
    throw new WorkspaceBindingResolutionError("binding_invalid", "binding source is required");
  if (value.source === "static")
    return {
      source: "static",
      value: value.value,
    };
  if (value.source === "rpc") {
    if (typeof value.method !== "string" || !value.method.trim())
      throw new WorkspaceBindingResolutionError(
        "binding_invalid",
        "rpc binding method is required",
      );
    const params = isRecord$3(value.params) ? value.params : void 0;
    return {
      source: "rpc",
      method: value.method,
      ...(params ? { params } : {}),
    };
  }
  if (value.source === "file") {
    if (typeof value.path !== "string")
      throw new WorkspaceBindingResolutionError("binding_invalid", "file binding path is required");
    if (value.pointer !== void 0 && typeof value.pointer !== "string")
      throw new WorkspaceBindingResolutionError(
        "binding_invalid",
        "file binding pointer is invalid",
      );
    return {
      source: "file",
      path: value.path,
      ...(value.pointer !== void 0 ? { pointer: value.pointer } : {}),
    };
  }
  throw new WorkspaceBindingResolutionError("binding_invalid", "binding source is invalid");
}
function decodePointerSegment(value) {
  return value.replaceAll("~1", "/").replaceAll("~0", "~");
}
function applyJsonPointer(value, pointer) {
  if (pointer === void 0 || pointer === "") return value;
  if (!pointer.startsWith("/"))
    throw new WorkspaceBindingResolutionError("binding_invalid", "JSON pointer is invalid");
  let current = value;
  for (const rawSegment of pointer.slice(1).split("/")) {
    const segment = decodePointerSegment(rawSegment);
    if (Array.isArray(current)) {
      const index = Number(segment);
      if (!Number.isInteger(index) || index < 0 || index >= current.length)
        throw new WorkspaceBindingResolutionError("binding_not_found", "JSON pointer not found");
      current = current[index];
      continue;
    }
    if (!isRecord$3(current) || !Object.hasOwn(current, segment))
      throw new WorkspaceBindingResolutionError("binding_not_found", "JSON pointer not found");
    current = current[segment];
  }
  return current;
}
async function resolveFileBinding(binding, options) {
  const logicalPath = normalizeWorkspaceDataLogicalPath(binding.path);
  const stateDir = path.resolve(options.stateDir ?? resolveStateDir());
  const dataRoot = path.join(stateDir, "workspaces", "data");
  let content;
  try {
    const state = await root(stateDir);
    const data = await root(dataRoot);
    const expectedDataRoot = path.join(state.rootReal, "workspaces", "data");
    if (data.rootReal !== expectedDataRoot)
      throw new WorkspaceBindingResolutionError("binding_invalid", "file binding path is invalid");
    content = (
      await data.readAbsolute(path.join(data.rootDir, logicalPath), {
        hardlinks: "reject",
        maxBytes: MAX_FILE_BYTES,
        symlinks: "reject",
      })
    ).buffer.toString("utf8");
  } catch (error) {
    if (error instanceof FsSafeError) {
      if (error.code === "too-large")
        throw new WorkspaceBindingResolutionError("binding_too_large", "file binding is too large");
      if (error.code === "not-found" || error.code === "not-file")
        throw new WorkspaceBindingResolutionError("binding_not_found", "file binding not found");
      throw new WorkspaceBindingResolutionError("binding_invalid", "file binding path is invalid");
    }
    if (error.code === "ENOENT")
      throw new WorkspaceBindingResolutionError("binding_not_found", "file binding not found");
    throw error;
  }
  const extension = path.extname(logicalPath).toLowerCase();
  if (extension === ".md" || extension === ".csv") return content;
  try {
    return applyJsonPointer(JSON.parse(content), binding.pointer);
  } catch (error) {
    if (error instanceof WorkspaceBindingResolutionError) throw error;
    throw new WorkspaceBindingResolutionError("binding_invalid", "file binding JSON is invalid");
  }
}
async function resolveBinding(bindingInput, options = {}) {
  const binding = readBinding(bindingInput);
  if (binding.source === "static") return binding.value;
  if (binding.source === "rpc")
    throw new WorkspaceBindingResolutionError(
      "binding_client_resolved",
      "rpc workspace bindings are resolved by the Control UI gateway client",
    );
  return await resolveFileBinding(binding, options);
}
//#endregion
//#region extensions/workspaces/src/manifest.ts
const CUSTOM_WIDGET_NAME_PATTERN$2 = /^(?!__proto__$)[A-Za-z0-9._-]{1,64}$/;
/**
 * Content types the widget route will serve, keyed by lowercase extension. Owned
 * here because approval hashes exactly the set of files the route can hand to a
 * browser — the two must never drift.
 */
const WIDGET_CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
};
/** Max servable files one widget may have; keeps the approval digest bounded. */
const MAX_WIDGET_FILES = 64;
const MAX_WIDGET_TREE_ENTRIES = 256;
/**
 * Byte caps on the assets approval hashes. Pending widget files are agent-authored
 * and untrusted: without a cap, dropping one huge file into the scaffold directory
 * would make approval read it into memory and stall or OOM the gateway.
 */
const MAX_WIDGET_FILE_BYTES = 2 * 1024 * 1024;
const MAX_WIDGET_TOTAL_BYTES = 8 * 1024 * 1024;
/** sha256 of one file's bytes, lowercase hex. */
function hashBytes(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}
async function listServableWidgetFiles(stateRoot, widgetRelativeDir) {
  const files = [];
  let entriesSeen = 0;
  async function visit(relativeDir, logicalDir) {
    const entries = await stateRoot.list(relativeDir, { withFileTypes: true });
    for (const entry of entries) {
      entriesSeen += 1;
      if (entriesSeen > MAX_WIDGET_TREE_ENTRIES)
        throw new Error(`widget has more than ${MAX_WIDGET_TREE_ENTRIES} filesystem entries`);
      const relative = path.posix.join(relativeDir, entry.name);
      const logical = path.posix.join(logicalDir, entry.name);
      if (entry.isDirectory) await visit(relative, logical);
      else if (entry.isFile && path.extname(logical).toLowerCase() in WIDGET_CONTENT_TYPES)
        files.push(logical);
    }
  }
  await visit(widgetRelativeDir, "");
  return files;
}
/**
 * Reads a widget's directory once and returns both the digests of every servable
 * file and the manifest parsed from the very bytes that were hashed.
 *
 * This is what an operator approves. Hashing matters because "approved" must name
 * the code, not the directory: otherwise an agent could win approval on an
 * innocuous tree and write the real payload afterwards. Parsing the manifest from
 * the hashed bytes matters for the same reason one level up — reading `widget.json`
 * twice would let it change between the read that validates the entrypoint and the
 * read that freezes the digest, so the operator would approve one manifest while a
 * different one got served.
 */
async function snapshotApprovedWidget(name, options = {}) {
  const stateDir = path.resolve(options.stateDir ?? resolveStateDir());
  const widgetDir = resolveWidgetDir(name, stateDir);
  const widgetRelativeDir = path.posix.join("workspaces", "widgets", name);
  let widgetRoot;
  let widgetReal;
  let logicalFiles;
  try {
    widgetRoot = await root(stateDir, {
      hardlinks: "reject",
      maxBytes: MAX_WIDGET_FILE_BYTES,
      nonBlockingRead: true,
      symlinks: "reject",
    });
    const widgetStat = await fs$1.lstat(widgetDir);
    widgetReal = await fs$1.realpath(widgetDir);
    const expectedWidgetReal = path.join(widgetRoot.rootReal, "workspaces", "widgets", name);
    if (
      widgetStat.isSymbolicLink() ||
      !widgetStat.isDirectory() ||
      widgetReal !== expectedWidgetReal
    )
      throw new Error("widget directory is unsafe");
    logicalFiles = await listServableWidgetFiles(widgetRoot, widgetRelativeDir);
  } catch (error) {
    if (error.code === "ENOENT" || (error instanceof FsSafeError && error.code === "not-found"))
      throw new Error(`workspace widget not found: ${name}`, { cause: error });
    throw error;
  }
  const files = {};
  let manifestBytes;
  let totalBytes = 0;
  for (const logical of logicalFiles) {
    if (Object.keys(files).length >= MAX_WIDGET_FILES)
      throw new Error(`widget has more than ${MAX_WIDGET_FILES} servable files`);
    let bytes;
    try {
      const read = await widgetRoot.read(path.posix.join(widgetRelativeDir, logical), {
        hardlinks: "reject",
        maxBytes: MAX_WIDGET_FILE_BYTES,
        nonBlockingRead: true,
        symlinks: "reject",
      });
      if (read.realPath !== widgetReal && !read.realPath.startsWith(`${widgetReal}${path.sep}`))
        throw new Error("widget directory changed during approval");
      bytes = read.buffer;
    } catch (error) {
      if (error instanceof FsSafeError && error.code === "too-large")
        throw new Error(`widget file is too large: ${logical}`, { cause: error });
      throw new Error(`widget file is unsafe: ${logical}`, { cause: error });
    }
    totalBytes += bytes.byteLength;
    if (totalBytes > MAX_WIDGET_TOTAL_BYTES)
      throw new Error("widget assets exceed the approval size limit");
    files[logical] = hashBytes(bytes);
    if (logical === "widget.json") manifestBytes = bytes;
  }
  if (!manifestBytes || manifestBytes.byteLength > MANIFEST_MAX_BYTES)
    throw new Error(`workspace widget not found: ${name}`);
  let parsed;
  try {
    parsed = JSON.parse(manifestBytes.toString("utf8"));
  } catch (error) {
    throw new Error("widget.json is not valid JSON", { cause: error });
  }
  const manifest = validateWidgetManifest(parsed, name);
  if (!files[manifest.entrypoint])
    throw new Error(`workspace widget entrypoint is missing: ${manifest.entrypoint}`);
  return {
    files,
    manifest,
  };
}
/** True when `bytes` are exactly what was approved for `logicalPath`. */
function matchesApprovedFile(approvedFiles, logicalPath, bytes) {
  const expected = approvedFiles?.[logicalPath];
  return expected !== void 0 && expected === hashBytes(bytes);
}
const BINDING_ID_PATTERN = /^(?!__proto__$)[A-Za-z0-9._-]{1,64}$/;
const WIDGET_CAPABILITIES = ["data:read", "prompt:send"];
const MANIFEST_MAX_BYTES = 32 * 1024;
function isRecord$2(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function assertRecord(value, at) {
  if (!isRecord$2(value)) throw new Error(`${at} must be an object`);
  return value;
}
function assertKnownKeys(record, allowed, at) {
  for (const key of Object.keys(record))
    if (!allowed.includes(key)) throw new Error(`${at}.${key} is not allowed`);
}
function requireString(record, key, at) {
  const value = record[key];
  if (typeof value !== "string") throw new Error(`${at}.${key} must be a string`);
  return value;
}
function assertIntegerRange(value, at, min, max) {
  if (!Number.isInteger(value) || value < min || value > max)
    throw new Error(`${at} must be an integer from ${min} to ${max}`);
  return value;
}
function validateBinding(value, at) {
  const record = assertRecord(value, at);
  const id = requireString(record, "id", at);
  if (!BINDING_ID_PATTERN.test(id)) throw new Error(`${at}.id is invalid`);
  const source = requireString(record, "source", at);
  if (source === "static") {
    assertKnownKeys(record, ["id", "source", "value"], at);
    return {
      id,
      source,
      value: record.value,
    };
  }
  throw new Error(`${at}.source must be static`);
}
function validateCapabilities(value) {
  if (value === void 0) return [];
  if (!Array.isArray(value)) throw new Error("capabilities must be an array");
  const seen = /* @__PURE__ */ new Set();
  for (const entry of value) {
    if (typeof entry !== "string" || !WIDGET_CAPABILITIES.includes(entry))
      throw new Error(`capability is invalid: ${String(entry)}`);
    seen.add(entry);
  }
  return [...seen];
}
/** Validates a parsed `widget.json` object against the schema (00 §2). */
function validateWidgetManifest(value, expectedName) {
  const record = assertRecord(value, "widget.json");
  assertKnownKeys(
    record,
    ["schemaVersion", "name", "title", "entrypoint", "bindings", "capabilities", "preferredSize"],
    "widget.json",
  );
  if (record.schemaVersion !== 1) throw new Error("widget.json schemaVersion must be 1");
  const name = requireString(record, "name", "widget.json");
  if (!CUSTOM_WIDGET_NAME_PATTERN$2.test(name)) throw new Error("widget.json name is invalid");
  if (expectedName !== void 0 && name !== expectedName)
    throw new Error("widget.json name does not match its directory");
  const title = requireString(record, "title", "widget.json");
  if (title.length < 1 || title.length > 80)
    throw new Error("widget.json title must be 1-80 characters");
  const entrypoint = requireString(record, "entrypoint", "widget.json");
  normalizeWorkspaceDataLogicalPath(entrypoint);
  const rawBindings = record.bindings;
  if (!Array.isArray(rawBindings)) throw new Error("widget.json bindings must be an array");
  if (rawBindings.length > 32)
    throw new Error("widget.json bindings must contain at most 32 entries");
  const bindings = rawBindings.map((binding, index) =>
    validateBinding(binding, `widget.json.bindings[${index}]`),
  );
  const ids = /* @__PURE__ */ new Set();
  for (const binding of bindings) {
    if (ids.has(binding.id)) throw new Error(`widget.json duplicate binding id: ${binding.id}`);
    ids.add(binding.id);
  }
  const capabilities = validateCapabilities(record.capabilities);
  const preferredSize =
    record.preferredSize === void 0
      ? void 0
      : (() => {
          const size = assertRecord(record.preferredSize, "widget.json.preferredSize");
          assertKnownKeys(size, ["w", "h"], "widget.json.preferredSize");
          return {
            w: assertIntegerRange(size.w, "widget.json.preferredSize.w", 1, 12),
            h: assertIntegerRange(size.h, "widget.json.preferredSize.h", 1, 20),
          };
        })();
  return {
    schemaVersion: 1,
    name,
    title,
    entrypoint,
    bindings,
    capabilities,
    ...(preferredSize !== void 0 ? { preferredSize } : {}),
  };
}
/** Resolves the on-disk directory for one custom widget by name. */
function resolveWidgetDir(name, stateDir = resolveStateDir()) {
  if (!CUSTOM_WIDGET_NAME_PATTERN$2.test(name)) throw new Error("widget name is invalid");
  const widgetsRoot = path.resolve(stateDir, "workspaces", "widgets");
  const widgetDir = path.resolve(widgetsRoot, name);
  if (widgetDir !== widgetsRoot && !widgetDir.startsWith(`${widgetsRoot}${path.sep}`))
    throw new Error("widget name is invalid");
  return widgetDir;
}
//#endregion
//#region extensions/workspaces/src/scaffold.ts
const CUSTOM_WIDGET_NAME_PATTERN$1 = /^(?!__proto__$)[A-Za-z0-9._-]{1,64}$/;
function scaffoldTitle(name, title) {
  if (title?.trim()) return title.trim();
  return name
    .replace(/[-_.]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}
function widgetManifest(name, title) {
  return {
    schemaVersion: 1,
    name,
    title,
    entrypoint: "index.html",
    bindings: [
      {
        id: "value",
        source: "static",
        value: "Hello from your workspace widget.",
      },
    ],
    capabilities: ["data:read"],
    preferredSize: {
      w: 6,
      h: 4,
    },
  };
}
function widgetHtml(title, createdBy) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>
    :root { color-scheme: light dark; --wg-bg: Canvas; --wg-text: CanvasText; --wg-accent: #ff5c5c; }
    body { margin: 0; padding: 16px; font-family: var(--font-sans, system-ui, sans-serif);
      background: var(--wg-bg); color: var(--wg-text); }
    h1 { margin: 0 0 12px; font-size: 1.1rem; }
    #value { white-space: pre-wrap; overflow-wrap: anywhere; }
    footer { margin-top: 16px; font-size: 0.75rem; color: var(--wg-accent); }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <pre id="value">Waiting for workspace data...</pre>
  <footer>Built by ${escapeHtml(createdBy)}</footer>
  <script>
    const valueNode = document.getElementById("value");
    const bridge = window.openclawWorkspaceBridge;
    function post(type, payload = {}) {
      bridge.postMessage({ v: 1, type, ...payload });
    }
    function render(data) {
      valueNode.textContent = typeof data === "string" ? data : JSON.stringify(data, null, 2);
    }
    function onData(message) {
      render(message.data);
    }
    function applyTheme(tokens) {
      const root = document.documentElement.style;
      if (tokens["--bg"]) root.setProperty("--wg-bg", tokens["--bg"]);
      if (tokens["--text"]) root.setProperty("--wg-text", tokens["--text"]);
      if (tokens["--accent"]) root.setProperty("--wg-accent", tokens["--accent"]);
    }
    bridge.addEventListener("message", (event) => {
      const message = event.data;
      if (!message || message.v !== 1) return;
      if (message.type === "workspace:data" || message.type === "workspace:push") onData(message);
      else if (message.type === "workspace:theme") applyTheme(message.tokens || {});
      else if (message.type === "workspace:error") render({ error: message.message });
    });
    post("workspace:ready");
    post("workspace:getData", { requestId: "initial", bindingId: "value" });
    post("workspace:getTheme", { requestId: "theme" });
  <\/script>
</body>
</html>
`;
}
function widgetReadme(name) {
  return `# ${name}

This workspace widget runs inside a sandboxed iframe and talks to the parent
Control UI through the document-bound workspace message bridge exposed as
\`window.openclawWorkspaceBridge\`.

- Send messages with \`window.openclawWorkspaceBridge.postMessage(...)\`.
- Listen with \`window.openclawWorkspaceBridge.addEventListener("message", ...)\`.
- Send \`{ "v": 1, "type": "workspace:ready" }\` when loaded.
- Send \`workspace:getData\` with a \`requestId\` and \`bindingId\` to read a declared binding.
- Re-render on \`workspace:data\` and \`workspace:push\`.
- Do not fetch gateway data directly; the authenticated parent resolves bindings.
`;
}
function isErrnoException(error) {
  return error instanceof Error && "code" in error;
}
async function scaffoldWorkspaceWidget(options) {
  const name = options.name.trim();
  if (!CUSTOM_WIDGET_NAME_PATTERN$1.test(name)) throw new Error("widget name is invalid");
  const widgetsRoot = path.resolve(options.stateDir ?? resolveStateDir(), "workspaces", "widgets");
  const widgetDir = path.resolve(widgetsRoot, name);
  if (widgetDir === widgetsRoot || !widgetDir.startsWith(`${widgetsRoot}${path.sep}`))
    throw new Error("widget name is invalid");
  const title = scaffoldTitle(name, options.title);
  validateWidgetManifest(widgetManifest(name, title), name);
  await fs$1.mkdir(widgetsRoot, {
    recursive: true,
    mode: 448,
  });
  try {
    await fs$1.mkdir(widgetDir, { mode: 448 });
  } catch (error) {
    if (isErrnoException(error) && error.code === "EEXIST")
      throw new Error("widget already exists", { cause: error });
    throw error;
  }
  const manifestPath = path.join(widgetDir, "widget.json");
  const htmlPath = path.join(widgetDir, "index.html");
  const readmePath = path.join(widgetDir, "README.md");
  await Promise.all([
    fs$1.writeFile(
      `${manifestPath}.tmp`,
      `${JSON.stringify(widgetManifest(name, title), null, 2)}\n`,
      { mode: 384 },
    ),
    fs$1.writeFile(`${htmlPath}.tmp`, widgetHtml(title, options.createdBy ?? "an agent"), {
      mode: 384,
    }),
    fs$1.writeFile(`${readmePath}.tmp`, widgetReadme(name), { mode: 384 }),
  ]);
  await Promise.all([
    fs$1.rename(`${manifestPath}.tmp`, manifestPath),
    fs$1.rename(`${htmlPath}.tmp`, htmlPath),
    fs$1.rename(`${readmePath}.tmp`, readmePath),
  ]);
  return {
    name,
    title,
    dir: widgetDir,
    manifestPath,
    htmlPath,
    readmePath,
  };
}
//#endregion
//#region extensions/workspaces/src/asset-tokens.ts
const TOKEN_TTL_MS = 720 * 60 * 1e3;
const MAX_TOKENS = 512;
function approvalFingerprint(files) {
  const canonical = Object.entries(files).toSorted(([left], [right]) => left.localeCompare(right));
  return createHash("sha256").update(JSON.stringify(canonical)).digest("hex");
}
/** In-memory capabilities for one approved widget snapshot. Restart revokes all tokens. */
var WidgetAssetTokens = class {
  constructor() {
    this.tokens = /* @__PURE__ */ new Map();
  }
  issue(name, approvedFiles) {
    const now = Date.now();
    this.prune(now);
    while (this.tokens.size >= MAX_TOKENS) {
      const oldest = this.tokens.keys().next().value;
      if (typeof oldest !== "string") break;
      this.tokens.delete(oldest);
    }
    const token = randomBytes(32).toString("base64url");
    this.tokens.set(token, {
      name,
      approval: approvalFingerprint(approvedFiles),
      expiresAt: now + TOKEN_TTL_MS,
    });
    return token;
  }
  expiresAt(token, name) {
    return this.isIssued(token, name) ? (this.tokens.get(token)?.expiresAt ?? null) : null;
  }
  isIssued(token, name) {
    const entry = this.tokens.get(token);
    if (!entry || entry.name !== name || entry.expiresAt <= Date.now()) {
      this.tokens.delete(token);
      return false;
    }
    return true;
  }
  allows(token, name, approvedFiles) {
    const entry = this.tokens.get(token);
    return this.isIssued(token, name) && entry?.approval === approvalFingerprint(approvedFiles);
  }
  prune(now) {
    for (const [token, entry] of this.tokens) if (entry.expiresAt <= now) this.tokens.delete(token);
  }
};
//#endregion
//#region extensions/workspaces/src/default-workspace.ts
const DEFAULT_WORKSPACE = {
  schemaVersion: 1,
  workspaceVersion: 1,
  tabs: [
    {
      slug: "main",
      title: "Overview",
      icon: "layoutWorkspace",
      hidden: false,
      createdBy: "system",
      widgets: [
        {
          id: "cost-today",
          kind: "builtin:stat-card",
          title: "Cost Today",
          grid: {
            x: 0,
            y: 0,
            w: 4,
            h: 2,
          },
          collapsed: false,
          hidden: false,
          createdBy: "system",
          bindings: {
            value: {
              source: "rpc",
              method: "usage.cost",
              params: {
                days: 1,
                agentScope: "all",
              },
            },
          },
          props: {
            metric: "todayCost",
            format: "usd",
          },
        },
        {
          id: "tokens-today",
          kind: "builtin:stat-card",
          title: "Tokens Today",
          grid: {
            x: 4,
            y: 0,
            w: 4,
            h: 2,
          },
          collapsed: false,
          hidden: false,
          createdBy: "system",
          bindings: {
            value: {
              source: "rpc",
              method: "usage.cost",
              params: {
                days: 1,
                agentScope: "all",
              },
            },
          },
          props: {
            metric: "todayTokens",
            format: "int",
          },
        },
        {
          id: "instances-health",
          kind: "builtin:instances",
          title: "Instances",
          grid: {
            x: 8,
            y: 0,
            w: 4,
            h: 2,
          },
          collapsed: false,
          hidden: false,
          createdBy: "system",
          bindings: {
            presence: {
              source: "rpc",
              method: "system-presence",
            },
          },
        },
        {
          id: "sessions",
          kind: "builtin:sessions",
          title: "Sessions",
          grid: {
            x: 0,
            y: 2,
            w: 6,
            h: 5,
          },
          collapsed: false,
          hidden: false,
          createdBy: "system",
          bindings: {
            sessions: {
              source: "rpc",
              method: "sessions.list",
            },
          },
        },
        {
          id: "cron",
          kind: "builtin:cron",
          title: "Cron",
          grid: {
            x: 6,
            y: 2,
            w: 6,
            h: 5,
          },
          collapsed: false,
          hidden: false,
          createdBy: "system",
          bindings: {
            jobs: {
              source: "rpc",
              method: "cron.list",
            },
          },
        },
        {
          id: "activity",
          kind: "builtin:activity",
          title: "Activity",
          grid: {
            x: 0,
            y: 7,
            w: 12,
            h: 8,
          },
          collapsed: false,
          hidden: false,
          createdBy: "system",
          bindings: {
            runs: {
              source: "rpc",
              method: "cron.runs",
            },
          },
        },
      ],
    },
  ],
  widgetsRegistry: {},
  prefs: { tabOrder: ["main"] },
};
//#endregion
//#region extensions/workspaces/src/store.ts
const MAX_WORKSPACE_BYTES = 256 * 1024;
const UNDO_RING_SIZE = 20;
const DIR_MODE = 448;
const FILE_MODE = 384;
const BUSY_TIMEOUT_MS = 5e3;
const SCHEMA = `
CREATE TABLE IF NOT EXISTS workspace (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  version INTEGER NOT NULL,
  doc TEXT NOT NULL,
  updated_ms INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS undo (
  version INTEGER PRIMARY KEY,
  doc TEXT NOT NULL,
  created_ms INTEGER NOT NULL
);
`;
function serializeWorkspaceDoc(doc) {
  return JSON.stringify(doc);
}
function assertWorkspaceSize(serialized) {
  if (Buffer.byteLength(serialized, "utf8") > MAX_WORKSPACE_BYTES)
    throw new Error("workspace document exceeds 256 KB");
}
/**
 * Reconciles a whole-document replacement against what is already stored, inside
 * the write transaction. Two fields are never taken from the caller:
 *
 * - **the registry itself.** Entries are minted by `workspace_widget_scaffold` and
 *   nowhere else. Replacement preserves the complete current registry and ignores
 *   the incoming field: otherwise a caller could delete approval decisions or mint a `pending`
 *   entry for a name with no widget on disk, have an operator approve it, and only
 *   then write the code the operator "approved". Status likewise changes only
 *   through `workspaces.widget.approve` — a document that arrives already marked
 *   `approved` would skip the gate entirely and the asset route would serve it.
 * - **provenance (`createdBy`).** Otherwise an agent could stamp its own tabs and
 *   widgets `user`, or an operator could stamp `agent:<id>`, and the AI-provenance
 *   chip would be a lie. Existing entities keep their stamp; new ones get `actor`.
 */
function reconcileReplace(incoming, current, actor) {
  const widgetsRegistry = structuredClone(current.widgetsRegistry);
  const existingTabs = new Map(current.tabs.map((tab) => [tab.slug, tab]));
  const existingWidgets = new Map(
    current.tabs.flatMap((tab) => tab.widgets.map((widget) => [widget.id, widget])),
  );
  return {
    ...incoming,
    widgetsRegistry,
    tabs: incoming.tabs.map((tab) => ({
      ...tab,
      createdBy: existingTabs.get(tab.slug)?.createdBy ?? actor,
      widgets: tab.widgets.map((widget) => ({
        ...widget,
        createdBy: existingWidgets.get(widget.id)?.createdBy ?? actor,
      })),
    })),
  };
}
var WorkspaceStore = class {
  constructor(options = {}) {
    this.assetTokens = new WidgetAssetTokens();
    this.cached = null;
    this.stateDir = options.stateDir ?? resolveStateDir();
    this.workspaceDir = path.join(this.stateDir, "workspaces");
    this.dbPath = path.join(this.workspaceDir, "workspaces.sqlite");
    mkdirSync(this.workspaceDir, {
      recursive: true,
      mode: DIR_MODE,
    });
    this.db = new DatabaseSync(this.dbPath);
    try {
      configureSqliteConnectionPragmas(this.db, { busyTimeoutMs: BUSY_TIMEOUT_MS });
      chmodSync(this.dbPath, FILE_MODE);
      this.db.exec(SCHEMA);
    } catch (error) {
      this.db.close();
      throw error;
    }
  }
  close() {
    this.db.close();
  }
  read() {
    if (this.cached) return structuredClone(this.cached);
    const row = this.db.prepare("SELECT doc FROM workspace WHERE id = 1").get();
    if (!row) {
      const seeded = validateWorkspaceDoc(structuredClone(DEFAULT_WORKSPACE));
      this.commit(seeded, { snapshot: null });
      return structuredClone(seeded);
    }
    const doc = validateWorkspaceDoc(JSON.parse(row.doc));
    this.cached = doc;
    return structuredClone(doc);
  }
  /** Registry entry for one custom widget, or null when it was never scaffolded. */
  widgetEntry(name) {
    return this.read().widgetsRegistry[name] ?? null;
  }
  /** Approval status for one custom widget. */
  widgetStatus(name) {
    return this.widgetEntry(name)?.status ?? null;
  }
  /**
   * Applies `fn` to a draft of the current document and persists the result.
   * `fn` must be synchronous: it runs inside the write transaction, which is what
   * serializes concurrent RPC / CLI / agent-tool callers.
   */
  mutate(fn, _options) {
    return this.transact((current) => {
      const draft = structuredClone(current);
      return fn(draft) ?? draft;
    });
  }
  /**
   * Replaces the whole document (bulk authoring). Approval state and provenance
   * are always reconciled against the stored document, so replace can neither
   * self-approve a custom widget nor forge a `createdBy` stamp.
   */
  replace(doc, options) {
    return this.transact((current) =>
      reconcileReplace(structuredClone(doc), current, options.actor),
    );
  }
  /**
   * Restores the newest undo snapshot as a NEW version. The restored document is
   * a fresh write, not a rewind: `workspaceVersion` stays monotonic so connected
   * UIs — which refetch only on a strictly newer version — see the undo.
   */
  undo() {
    return this.transact(
      (current) => {
        const row = this.db
          .prepare("SELECT version, doc FROM undo ORDER BY version DESC LIMIT 1")
          .get();
        if (!row) throw new Error("no workspace undo snapshot available");
        this.db.prepare("DELETE FROM undo WHERE version = ?").run(row.version);
        return {
          ...validateWorkspaceDoc(JSON.parse(row.doc)),
          widgetsRegistry: current.widgetsRegistry,
        };
      },
      { snapshot: false },
    ).doc;
  }
  /**
   * One BEGIN IMMEDIATE transaction: read current, derive next, snapshot the old
   * document into the undo ring, write, trim. Any throw rolls the whole thing
   * back, so a rejected write never leaves a partially applied document.
   */
  transact(derive, options = {}) {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      this.cached = null;
      const current = this.read();
      const next = validateWorkspaceDoc({
        ...derive(current),
        workspaceVersion: current.workspaceVersion + 1,
      });
      this.commit(next, { snapshot: options.snapshot === false ? null : current });
      this.db.exec("COMMIT");
      return {
        doc: next,
        changed: true,
      };
    } catch (error) {
      this.db.exec("ROLLBACK");
      this.cached = null;
      throw error;
    }
  }
  /** Persists `doc` as the current workspace, pushing `snapshot` onto the undo ring. */
  commit(doc, params) {
    const serialized = serializeWorkspaceDoc(doc);
    assertWorkspaceSize(serialized);
    const now = Date.now();
    if (params.snapshot) {
      this.db
        .prepare("INSERT OR REPLACE INTO undo (version, doc, created_ms) VALUES (?, ?, ?)")
        .run(doc.workspaceVersion, serializeWorkspaceDoc(params.snapshot), now);
      this.db
        .prepare(
          "DELETE FROM undo WHERE version NOT IN (SELECT version FROM undo ORDER BY version DESC LIMIT ?)",
        )
        .run(UNDO_RING_SIZE);
    }
    this.db
      .prepare(
        "INSERT INTO workspace (id, version, doc, updated_ms) VALUES (1, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET version = excluded.version, doc = excluded.doc, updated_ms = excluded.updated_ms",
      )
      .run(doc.workspaceVersion, serialized, now);
    this.cached = doc;
  }
};
//#endregion
//#region extensions/workspaces/src/gateway.ts
const READ_SCOPE = "operator.read";
const WRITE_SCOPE = "operator.write";
const APPROVE_SCOPE = "operator.approvals";
const TAB_SLUG_PATTERN$1 = /^[a-z0-9-]{1,40}$/;
const WIDGET_ID_PATTERN$1 = /^[A-Za-z0-9_-]{1,48}$/;
const CUSTOM_WIDGET_NAME_PATTERN = /^(?!__proto__$)[A-Za-z0-9._-]{1,64}$/;
function respondError(respond, error) {
  respond(false, void 0, {
    code:
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof error.code === "string"
        ? error.code
        : "workspace_error",
    message: formatErrorMessage(error),
  });
}
function isRecord$1(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function approvedFilesMatch(left, right) {
  const leftKeys = Object.keys(left);
  return (
    leftKeys.length === Object.keys(right).length &&
    leftKeys.every((key) => left[key] === right[key])
  );
}
function readParams(params, allowedKeys) {
  if (!isRecord$1(params)) throw new Error("params must be an object");
  for (const key of Object.keys(params))
    if (!allowedKeys.includes(key)) throw new Error(`unexpected param: ${key}`);
  return params;
}
function readRequiredString$1(record, key, description) {
  const value = record[key];
  if (typeof value !== "string" || !value.trim()) throw new Error(`${description} is required`);
  return value.trim();
}
function readOptionalString$1(record, key) {
  const value = record[key];
  if (value === void 0) return;
  if (typeof value !== "string") throw new Error(`${key} must be a string`);
  return value.trim();
}
const RPC_ACTOR = "user";
function readSlug$1(record, key = "slug") {
  const slug = readRequiredString$1(record, key, key);
  if (!TAB_SLUG_PATTERN$1.test(slug)) throw new Error(`${key} is invalid`);
  return slug;
}
function readWidgetId$1(record, key = "id") {
  const id = readRequiredString$1(record, key, key);
  if (!WIDGET_ID_PATTERN$1.test(id)) throw new Error(`${key} is invalid`);
  return id;
}
function readBooleanPatch(record, key) {
  if (!Object.hasOwn(record, key)) return;
  const value = record[key];
  if (typeof value !== "boolean") throw new Error(`${key} must be a boolean`);
  return value;
}
function readGrid$1(value, path = "grid") {
  if (!isRecord$1(value)) throw new Error(`${path} must be an object`);
  for (const key of Object.keys(value))
    if (!["x", "y", "w", "h"].includes(key)) throw new Error(`${path}.${key} is not allowed`);
  return {
    x: readGridInt$1(value.x, `${path}.x`, 0, 11),
    y: readGridInt$1(value.y, `${path}.y`, 0, 499),
    w: readGridInt$1(value.w, `${path}.w`, 1, 12),
    h: readGridInt$1(value.h, `${path}.h`, 1, 20),
  };
}
function readGridInt$1(value, path, min, max) {
  if (!Number.isInteger(value) || value < min || value > max)
    throw new Error(`${path} must be an integer from ${min} to ${max}`);
  return value;
}
function slugBase$1(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "");
}
function makeUniqueSlug$1(title, tabs) {
  const used = new Set(tabs.map((tab) => tab.slug));
  const base = slugBase$1(title) || "tab";
  if (!used.has(base)) return base;
  for (let index = 2; index < 1e3; index += 1) {
    const suffix = `-${index}`;
    const candidate = `${base.slice(0, 40 - suffix.length)}${suffix}`;
    if (!used.has(candidate)) return candidate;
  }
  throw new Error("could not generate a unique tab slug");
}
function makeWidgetIdBase$1(value) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48)
      .replace(/-+$/g, "") || `w_${randomUUID().replaceAll("-", "").slice(0, 12)}`
  );
}
function makeUniqueWidgetId$1(widget, doc) {
  const existing = new Set(doc.tabs.flatMap((tab) => tab.widgets.map((entry) => entry.id)));
  const explicit = widget.id;
  if (explicit !== void 0) {
    if (typeof explicit !== "string" || !WIDGET_ID_PATTERN$1.test(explicit))
      throw new Error("widget.id is invalid");
    if (existing.has(explicit)) throw new Error(`duplicate widget id: ${explicit}`);
    return explicit;
  }
  const base = makeWidgetIdBase$1(
    typeof widget.title === "string"
      ? widget.title
      : typeof widget.kind === "string"
        ? widget.kind
        : "widget",
  );
  if (!existing.has(base)) return base;
  for (let index = 2; index < 1e3; index += 1) {
    const suffix = `-${index}`;
    const candidate = `${base.slice(0, 48 - suffix.length)}${suffix}`;
    if (!existing.has(candidate)) return candidate;
  }
  throw new Error("could not generate a unique widget id");
}
function findTab$1(doc, slug) {
  const tab = doc.tabs.find((entry) => entry.slug === slug);
  if (!tab) throw new Error(`workspace tab not found: ${slug}`);
  return tab;
}
function findWidget$1(tab, id) {
  const widget = tab.widgets.find((entry) => entry.id === id);
  if (!widget) throw new Error(`workspace widget not found: ${id}`);
  return widget;
}
function readWidgetInput$1(value, doc, actor) {
  if (!isRecord$1(value)) throw new Error("widget must be an object");
  for (const key of Object.keys(value))
    if (!["id", "kind", "title", "grid", "collapsed", "hidden", "bindings", "props"].includes(key))
      throw new Error(`widget.${key} is not allowed`);
  const title = readOptionalString$1(value, "title");
  return {
    id: makeUniqueWidgetId$1(value, doc),
    kind: readRequiredString$1(value, "kind", "widget.kind"),
    ...(title !== void 0 ? { title } : {}),
    grid: readGrid$1(value.grid, "widget.grid"),
    collapsed: value.collapsed === void 0 ? false : readRequiredBoolean(value, "collapsed"),
    hidden: value.hidden === void 0 ? false : readRequiredBoolean(value, "hidden"),
    createdBy: actor,
    ...(value.bindings !== void 0 ? { bindings: value.bindings } : {}),
    ...(value.props !== void 0 ? { props: value.props } : {}),
  };
}
function readRequiredBoolean(record, key) {
  const value = record[key];
  if (typeof value !== "boolean") throw new Error(`${key} must be a boolean`);
  return value;
}
function readTabPatch(value) {
  const patch = readParams(value, ["title", "icon", "hidden"]);
  const title = readOptionalString$1(patch, "title");
  if (title !== void 0 && (title.length < 1 || title.length > 80))
    throw new Error("patch.title must be 1-80 characters");
  const icon = readOptionalString$1(patch, "icon");
  if (icon !== void 0 && icon.length > 40)
    throw new Error("patch.icon must be 40 characters or fewer");
  const hidden = readBooleanPatch(patch, "hidden");
  return {
    ...(title !== void 0 ? { title } : {}),
    ...(icon !== void 0 ? { icon } : {}),
    ...(hidden !== void 0 ? { hidden } : {}),
  };
}
function readWidgetPatch$1(value) {
  const patch = readParams(value, ["title", "grid", "collapsed", "hidden", "bindings", "props"]);
  const title = readOptionalString$1(patch, "title");
  if (title !== void 0 && title.length > 80)
    throw new Error("patch.title must be 80 characters or fewer");
  return {
    ...(title !== void 0 ? { title } : {}),
    ...(patch.grid !== void 0 ? { grid: readGrid$1(patch.grid, "patch.grid") } : {}),
    ...(readBooleanPatch(patch, "collapsed") !== void 0
      ? { collapsed: readBooleanPatch(patch, "collapsed") }
      : {}),
    ...(readBooleanPatch(patch, "hidden") !== void 0
      ? { hidden: readBooleanPatch(patch, "hidden") }
      : {}),
    ...(patch.bindings !== void 0 ? { bindings: patch.bindings } : {}),
    ...(patch.props !== void 0 ? { props: patch.props } : {}),
  };
}
function readLayout$1(value) {
  if (!Array.isArray(value)) throw new Error("layout must be an array");
  return value.map((entry, index) => {
    const record = readParams(entry, ["id", "grid"]);
    return {
      id: readWidgetId$1(record),
      grid: readGrid$1(record.grid, `layout[${index}].grid`),
    };
  });
}
function appendMissingTabsToOrder$1(doc) {
  const seen = new Set(doc.prefs.tabOrder);
  for (const tab of doc.tabs) if (!seen.has(tab.slug)) doc.prefs.tabOrder.push(tab.slug);
}
function broadcastChange$1(broadcast, params) {
  rememberWorkspaceBroadcast(broadcast);
  broadcast("plugin.workspaces.changed", {
    workspaceVersion: params.doc.workspaceVersion,
    ...(params.changedTabSlug ? { changedTabSlug: params.changedTabSlug } : {}),
    actor: params.actor,
  });
}
async function respondWrite(opts, actor, changedTabSlug, run) {
  const result = await run();
  broadcastChange$1(opts.context.broadcast, {
    doc: result.doc,
    actor,
    changedTabSlug,
  });
  opts.respond(true, {
    doc: result.doc,
    workspaceVersion: result.doc.workspaceVersion,
  });
}
function registerWorkspaceGatewayMethods(options) {
  const { api } = options;
  const store = options.store ?? new WorkspaceStore();
  api.registerGatewayMethod(
    "workspaces.get",
    async ({ respond, context }) => {
      try {
        rememberWorkspaceBroadcast(context.broadcast);
        const doc = store.read();
        respond(true, {
          doc,
          workspaceVersion: doc.workspaceVersion,
        });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: READ_SCOPE },
  );
  api.registerGatewayMethod(
    "workspaces.widget.frame",
    async ({ params: rawParams, respond }) => {
      try {
        const name = readRequiredString$1(readParams(rawParams, ["name"]), "name", "name");
        if (!CUSTOM_WIDGET_NAME_PATTERN.test(name)) throw new Error("name is invalid");
        const entry = store.widgetEntry(name);
        if (entry?.status !== "approved" || !entry.approvedFiles)
          throw new Error(`workspace widget is not approved: ${name}`);
        const snapshot = await snapshotApprovedWidget(name, { stateDir: store.stateDir });
        if (!approvedFilesMatch(snapshot.files, entry.approvedFiles))
          throw new Error(`workspace widget approval no longer matches: ${name}`);
        const frameToken = store.assetTokens.issue(name, entry.approvedFiles);
        const frameExpiresAt = store.assetTokens.expiresAt(frameToken, name);
        if (frameExpiresAt === null)
          throw new Error(`workspace widget frame capability failed: ${name}`);
        respond(true, {
          manifest: snapshot.manifest,
          frameToken,
          frameExpiresAt,
        });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: READ_SCOPE },
  );
  api.registerGatewayMethod(
    "workspaces.tab.create",
    async (opts) => {
      try {
        const params = readParams(opts.params, ["slug", "title", "icon"]);
        const title = readRequiredString$1(params, "title", "title");
        const icon = readOptionalString$1(params, "icon");
        const result = store.mutate(
          (draft) => {
            const slug =
              params.slug === void 0 ? makeUniqueSlug$1(title, draft.tabs) : readSlug$1(params);
            if (draft.tabs.some((tab) => tab.slug === slug))
              throw new Error(`workspace tab already exists: ${slug}`);
            draft.tabs.push({
              slug,
              title,
              ...(icon !== void 0 ? { icon } : {}),
              hidden: false,
              createdBy: RPC_ACTOR,
              widgets: [],
            });
            draft.prefs.tabOrder.push(slug);
          },
          { actor: RPC_ACTOR },
        );
        const changedTabSlug = result.doc.tabs.at(-1)?.slug;
        broadcastChange$1(opts.context.broadcast, {
          doc: result.doc,
          actor: RPC_ACTOR,
          changedTabSlug,
        });
        opts.respond(true, {
          doc: result.doc,
          workspaceVersion: result.doc.workspaceVersion,
        });
      } catch (error) {
        respondError(opts.respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workspaces.tab.update",
    async (opts) => {
      try {
        const params = readParams(opts.params, ["slug", "patch"]);
        const slug = readSlug$1(params);
        const patch = readTabPatch(params.patch);
        await respondWrite(opts, RPC_ACTOR, slug, async () =>
          store.mutate(
            (draft) => {
              Object.assign(findTab$1(draft, slug), patch);
            },
            { actor: RPC_ACTOR },
          ),
        );
      } catch (error) {
        respondError(opts.respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workspaces.tab.delete",
    async (opts) => {
      try {
        const slug = readSlug$1(readParams(opts.params, ["slug"]));
        await respondWrite(opts, RPC_ACTOR, slug, async () =>
          store.mutate(
            (draft) => {
              const nextTabs = draft.tabs.filter((tab) => tab.slug !== slug);
              if (nextTabs.length === draft.tabs.length)
                throw new Error(`workspace tab not found: ${slug}`);
              draft.tabs = nextTabs;
              draft.prefs.tabOrder = draft.prefs.tabOrder.filter((entry) => entry !== slug);
            },
            { actor: RPC_ACTOR },
          ),
        );
      } catch (error) {
        respondError(opts.respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workspaces.tab.reorder",
    async (opts) => {
      try {
        const order = readSlugOrder(readParams(opts.params, ["order"]).order);
        await respondWrite(opts, RPC_ACTOR, void 0, async () =>
          store.mutate(
            (draft) => {
              const slugs = new Set(draft.tabs.map((tab) => tab.slug));
              for (const slug of order)
                if (!slugs.has(slug)) throw new Error(`workspace tab not found: ${slug}`);
              draft.prefs.tabOrder = order;
              appendMissingTabsToOrder$1(draft);
            },
            { actor: RPC_ACTOR },
          ),
        );
      } catch (error) {
        respondError(opts.respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workspaces.widget.add",
    async (opts) => {
      try {
        const params = readParams(opts.params, ["tab", "widget"]);
        const slug = readRequiredString$1(params, "tab", "tab");
        await respondWrite(opts, RPC_ACTOR, slug, async () =>
          store.mutate(
            (draft) => {
              findTab$1(draft, slug).widgets.push(
                readWidgetInput$1(params.widget, draft, RPC_ACTOR),
              );
            },
            { actor: RPC_ACTOR },
          ),
        );
      } catch (error) {
        respondError(opts.respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workspaces.widget.update",
    async (opts) => {
      try {
        const params = readParams(opts.params, ["tab", "id", "patch"]);
        const slug = readRequiredString$1(params, "tab", "tab");
        const id = readWidgetId$1(params);
        const patch = readWidgetPatch$1(params.patch);
        await respondWrite(opts, RPC_ACTOR, slug, async () =>
          store.mutate(
            (draft) => {
              Object.assign(findWidget$1(findTab$1(draft, slug), id), patch);
            },
            { actor: RPC_ACTOR },
          ),
        );
      } catch (error) {
        respondError(opts.respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workspaces.widget.move",
    async (opts) => {
      try {
        const params = readParams(opts.params, ["tab", "id", "grid", "toTab"]);
        if (params.grid !== void 0 && params.toTab !== void 0)
          throw new Error("workspaces.widget.move accepts either grid or toTab, not both");
        const id = readWidgetId$1(params);
        const changedTabSlug =
          typeof params.toTab === "string"
            ? params.toTab
            : typeof params.tab === "string"
              ? params.tab
              : void 0;
        await respondWrite(opts, RPC_ACTOR, changedTabSlug, async () =>
          store.mutate(
            (draft) => {
              if (params.grid !== void 0) {
                const slug = readRequiredString$1(params, "tab", "tab");
                findWidget$1(findTab$1(draft, slug), id).grid = readGrid$1(params.grid);
                return;
              }
              const destination = findTab$1(draft, readRequiredString$1(params, "toTab", "toTab"));
              for (const tab of draft.tabs) {
                const index = tab.widgets.findIndex((widget) => widget.id === id);
                if (index >= 0) {
                  destination.widgets.push(tab.widgets.splice(index, 1)[0]);
                  return;
                }
              }
              throw new Error(`workspace widget not found: ${id}`);
            },
            { actor: RPC_ACTOR },
          ),
        );
      } catch (error) {
        respondError(opts.respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workspaces.widget.remove",
    async (opts) => {
      try {
        const params = readParams(opts.params, ["tab", "id"]);
        const slug = readRequiredString$1(params, "tab", "tab");
        const id = readWidgetId$1(params);
        await respondWrite(opts, RPC_ACTOR, slug, async () =>
          store.mutate(
            (draft) => {
              const tab = findTab$1(draft, slug);
              const next = tab.widgets.filter((widget) => widget.id !== id);
              if (next.length === tab.widgets.length)
                throw new Error(`workspace widget not found: ${id}`);
              tab.widgets = next;
            },
            { actor: RPC_ACTOR },
          ),
        );
      } catch (error) {
        respondError(opts.respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workspaces.widget.setLayout",
    async (opts) => {
      try {
        const params = readParams(opts.params, ["tab", "layout"]);
        const slug = readRequiredString$1(params, "tab", "tab");
        const layout = readLayout$1(params.layout);
        await respondWrite(opts, RPC_ACTOR, slug, async () =>
          store.mutate(
            (draft) => {
              const tab = findTab$1(draft, slug);
              for (const entry of layout) findWidget$1(tab, entry.id).grid = entry.grid;
            },
            { actor: RPC_ACTOR },
          ),
        );
      } catch (error) {
        respondError(opts.respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workspaces.widget.scaffold",
    async (opts) => {
      try {
        const params = readParams(opts.params, ["name", "title"]);
        const name = readRequiredString$1(params, "name", "name");
        const title = readOptionalString$1(params, "title");
        const scaffold = await scaffoldWorkspaceWidget({
          name,
          ...(title !== void 0 ? { title } : {}),
          stateDir: store.stateDir,
          createdBy: RPC_ACTOR,
        });
        const result = store.mutate(
          (draft) => {
            draft.widgetsRegistry[scaffold.name] = {
              status: "pending",
              createdBy: RPC_ACTOR,
            };
          },
          { actor: RPC_ACTOR },
        );
        broadcastChange$1(opts.context.broadcast, {
          doc: result.doc,
          actor: RPC_ACTOR,
        });
        opts.respond(true, {
          ...scaffold,
          registry: result.doc.widgetsRegistry[scaffold.name],
          workspaceVersion: result.doc.workspaceVersion,
        });
      } catch (error) {
        respondError(opts.respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workspaces.widget.approve",
    async (opts) => {
      try {
        const params = readParams(opts.params, ["name", "decision"]);
        const name = readRequiredString$1(params, "name", "name");
        if (!CUSTOM_WIDGET_NAME_PATTERN.test(name)) throw new Error("name is invalid");
        const decision = readRequiredString$1(params, "decision", "decision");
        if (decision !== "approved" && decision !== "rejected")
          throw new Error("decision must be approved or rejected");
        const approvedFiles =
          decision === "approved"
            ? (await snapshotApprovedWidget(name, { stateDir: store.stateDir })).files
            : void 0;
        const result = store.mutate(
          (draft) => {
            const existing = draft.widgetsRegistry[name];
            if (!existing) throw new Error(`workspace widget not found: ${name}`);
            draft.widgetsRegistry[name] = {
              status: decision,
              createdBy: existing.createdBy,
              ...(approvedFiles
                ? {
                    approvedBy: RPC_ACTOR,
                    approvedAt: /* @__PURE__ */ new Date().toISOString(),
                    approvedFiles,
                  }
                : {}),
            };
          },
          { actor: RPC_ACTOR },
        );
        broadcastChange$1(opts.context.broadcast, {
          doc: result.doc,
          actor: RPC_ACTOR,
        });
        opts.respond(true, {
          name,
          registry: result.doc.widgetsRegistry[name],
          workspaceVersion: result.doc.workspaceVersion,
        });
      } catch (error) {
        respondError(opts.respond, error);
      }
    },
    { scope: APPROVE_SCOPE },
  );
  api.registerGatewayMethod(
    "workspaces.replace",
    async (opts) => {
      try {
        const doc = validateWorkspaceDoc(readParams(opts.params, ["doc"]).doc);
        await respondWrite(opts, RPC_ACTOR, void 0, async () =>
          store.replace(doc, { actor: RPC_ACTOR }),
        );
      } catch (error) {
        respondError(opts.respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workspaces.undo",
    async (opts) => {
      try {
        readParams(opts.params, []);
        const doc = store.undo();
        broadcastChange$1(opts.context.broadcast, {
          doc,
          actor: RPC_ACTOR,
        });
        opts.respond(true, {
          doc,
          workspaceVersion: doc.workspaceVersion,
        });
      } catch (error) {
        respondError(opts.respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workspaces.data.read",
    async ({ params: requestParams, respond }) => {
      try {
        respond(true, {
          data: await resolveBinding(
            readParams(requestParams, ["binding"]).binding,
            options.dataRead,
          ),
        });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: READ_SCOPE },
  );
}
function readSlugOrder(value) {
  if (!Array.isArray(value)) throw new Error("order must be an array");
  const seen = /* @__PURE__ */ new Set();
  return value.map((entry, index) => {
    if (typeof entry !== "string" || !TAB_SLUG_PATTERN$1.test(entry))
      throw new Error(`order[${index}] is invalid`);
    if (seen.has(entry)) throw new Error(`order contains duplicate slug: ${entry}`);
    seen.add(entry);
    return entry;
  });
}
//#endregion
//#region extensions/workspaces/src/serve.ts
const WIDGETS_ROUTE_PREFIX = "/plugins/workspaces/widgets";
const WIDGET_CSP =
  "sandbox allow-scripts; default-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'none'; frame-ancestors 'self'";
const BRIDGE_TOKEN_PATTERN = /^[A-Za-z0-9_-]{20,100}$/;
/**
 * Runs before approved widget bytes and creates a MessagePort owned by that exact
 * document. WindowProxy identity survives navigation; a port does not, so a
 * replacement page can never inherit the parent bridge.
 */
function injectBridgeBootstrap(data, bridgeToken) {
  if (!bridgeToken || !BRIDGE_TOKEN_PATTERN.test(bridgeToken)) return data;
  const bootstrap = `<script>(()=>{const channel=new MessageChannel();const listeners=new Set();const port=channel.port1;port.onmessage=(event)=>{for(const listener of listeners)listener(event)};port.start();Object.defineProperty(window,"openclawWorkspaceBridge",{configurable:false,writable:false,value:Object.freeze({postMessage:(message)=>port.postMessage(message),addEventListener:(type,listener)=>{if(type==="message")listeners.add(listener)},removeEventListener:(type,listener)=>{if(type==="message")listeners.delete(listener)}})});window.parent.postMessage({v:1,type:"workspace:bridge:init",token:"${bridgeToken}"},"*",[channel.port2])})();<\/script>`;
  const html = data.toString("utf8");
  const doctype = html.match(/^\uFEFF?(?:\s|<!--[\s\S]*?-->)*<!doctype[^>]*>/i)?.[0] ?? "";
  return Buffer.from(`${doctype}${bootstrap}${html.slice(doctype.length)}`);
}
/** Copy of the canvas logical-path normalizer (documents.ts:79). */
function normalizeLogicalPath(value) {
  const parts = value.replaceAll("\\", "/").replace(/^\/+/, "").split("/").filter(Boolean);
  if (
    parts.length === 0 ||
    parts.some(
      (part) => part === "." || part === ".." || part.includes(":") || hasControlCharacter(part),
    )
  )
    throw new Error("widget logical path invalid");
  return parts.join("/");
}
function hasControlCharacter(value) {
  for (const char of value) {
    const code = char.charCodeAt(0);
    if (code < 32 || code === 127) return true;
  }
  return false;
}
/** True when the pathname is under this route's prefix (so the route owns it). */
function isWidgetRoutePath(pathname) {
  return (
    pathname === "/plugins/workspaces/widgets" ||
    pathname.startsWith(`/plugins/workspaces/widgets/`)
  );
}
/**
 * Splits a request pathname under the widgets prefix into `{ name, logicalPath }`.
 * Returns null when the pathname is not under the prefix or is malformed. Each
 * segment is URL-decoded; a decode failure yields null (→ 404).
 */
function parseWidgetRequestPath(pathname) {
  const prefix = `${WIDGETS_ROUTE_PREFIX}/`;
  if (!pathname.startsWith(prefix)) return null;
  const rawSegments = pathname.slice(prefix.length).split("/");
  const segments = [];
  for (const segment of rawSegments) {
    if (!segment) continue;
    try {
      segments.push(decodeURIComponent(segment));
    } catch {
      return null;
    }
  }
  if (segments.length < 3) return null;
  const [frameToken, name, ...entry] = segments;
  if (!frameToken || !name) return null;
  if (!BRIDGE_TOKEN_PATTERN.test(frameToken)) return null;
  if (name === "." || name === ".." || !CUSTOM_WIDGET_NAME_PATTERN$2.test(name)) return null;
  let logicalPath;
  try {
    logicalPath = normalizeLogicalPath(entry.join("/"));
  } catch {
    return null;
  }
  return {
    frameToken,
    name,
    logicalPath,
  };
}
/**
 * Content type for a logical path, or null when the extension is not servable.
 * The table lives in `manifest.ts` because approval hashes exactly this file set.
 */
function extensionContentType(logicalPath) {
  return WIDGET_CONTENT_TYPES[path.extname(logicalPath).toLowerCase()] ?? null;
}
/**
 * The strict security headers EVERY widget-route response must carry — 200 and
 * 404 alike. A 404 is still an attacker-influenced response served from the
 * widget origin, so it needs the same `connect-src 'none'` lockdown. Shared here
 * so the two response paths can never drift apart again. Content-Type is set
 * per-path (it differs) and is intentionally not included.
 */
function setSecurityHeaders(res) {
  res.setHeader("Content-Security-Policy", WIDGET_CSP);
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Cache-Control", "no-store");
}
function notFound(res) {
  res.statusCode = 404;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  setSecurityHeaders(res);
  res.end("not found");
  return true;
}
/**
 * Resolves and serves a static asset for an approved custom widget, writing the
 * response directly. Returns true when the request was under this route (handled),
 * false when the pathname is not a widget path (caller may fall through).
 *
 * Every failure mode (wrong method, unknown/pending/rejected widget, jail
 * violation, disallowed extension, missing file) is a 404 — never 403 — so the
 * unauthenticated route reveals nothing about what exists on disk.
 */
async function serveWidgetAsset(req, res, deps) {
  if (!isWidgetRoutePath(req.pathname)) return false;
  const parsed = parseWidgetRequestPath(req.pathname);
  if (!parsed) return notFound(res);
  if (req.method !== "GET" && req.method !== "HEAD") return notFound(res);
  const contentType = extensionContentType(parsed.logicalPath);
  if (!contentType) return notFound(res);
  if (!deps.store.assetTokens.isIssued(parsed.frameToken, parsed.name)) return notFound(res);
  let approvedFiles;
  try {
    const entry = deps.store.widgetEntry(parsed.name);
    if (entry?.status !== "approved") return notFound(res);
    approvedFiles = entry.approvedFiles;
    if (
      !approvedFiles ||
      !deps.store.assetTokens.allows(parsed.frameToken, parsed.name, approvedFiles)
    )
      return notFound(res);
  } catch {
    return notFound(res);
  }
  const stateDir = path.resolve(deps.stateDir ?? resolveStateDir());
  let widgetDir;
  try {
    widgetDir = resolveWidgetDir(parsed.name, stateDir);
  } catch {
    return notFound(res);
  }
  let data;
  try {
    const widgetRoot = await root(stateDir, {
      hardlinks: "reject",
      maxBytes: MAX_WIDGET_FILE_BYTES,
      nonBlockingRead: true,
      symlinks: "reject",
    });
    const widgetStat = await fs$1.lstat(widgetDir);
    const widgetReal = await fs$1.realpath(widgetDir);
    const expectedWidgetReal = path.join(widgetRoot.rootReal, "workspaces", "widgets", parsed.name);
    if (
      widgetStat.isSymbolicLink() ||
      !widgetStat.isDirectory() ||
      widgetReal !== expectedWidgetReal
    )
      return notFound(res);
    const read = await widgetRoot.read(
      path.posix.join("workspaces", "widgets", parsed.name, parsed.logicalPath),
      {
        hardlinks: "reject",
        maxBytes: MAX_WIDGET_FILE_BYTES,
        nonBlockingRead: true,
        symlinks: "reject",
      },
    );
    if (read.realPath !== widgetReal && !read.realPath.startsWith(`${widgetReal}${path.sep}`))
      return notFound(res);
    data = read.buffer;
  } catch {
    return notFound(res);
  }
  if (!matchesApprovedFile(approvedFiles, parsed.logicalPath, data)) return notFound(res);
  res.statusCode = 200;
  res.setHeader("Content-Type", contentType);
  setSecurityHeaders(res);
  if (req.method === "HEAD") res.end();
  else {
    const body = contentType.startsWith("text/html")
      ? injectBridgeBootstrap(data, parsed.frameToken)
      : data;
    res.end(body);
  }
  return true;
}
//#endregion
//#region extensions/workspaces/src/http-route.ts
/** Creates the HTTP route handler bound to the shared workspace store. */
function createWidgetHttpRouteHandler(params) {
  return {
    async handleHttpRequest(req, res) {
      const url = new URL(req.url ?? "/", "http://localhost");
      return await serveWidgetAsset(
        {
          method: req.method,
          pathname: url.pathname,
        },
        res,
        {
          store: params.store,
          ...(params.stateDir ? { stateDir: params.stateDir } : {}),
        },
      );
    },
  };
}
//#endregion
//#region extensions/workspaces/src/tools.ts
const TAB_SLUG_PATTERN = /^[a-z0-9-]{1,40}$/;
const WIDGET_ID_PATTERN = /^[A-Za-z0-9_-]{1,48}$/;
const TOOL_DESCRIPTION_SUFFIX = " Call workspace_get first when you need the current document.";
/**
 * Both lists below exist because a model can only see tool schemas. An agent that
 * has to brute-force the valid `kind` values or the rpc allowlist burns dozens of
 * round-trips against "kind is invalid" / "method is not allowlisted".
 */
const WIDGET_KIND_DESCRIPTION = [
  `Widget kind: custom:<name>, or one of ${BUILTIN_WIDGET_KINDS.join(", ")}.`,
  "builtin:stat-card (big number; props {label?, format?: usd|percent|int}; binding id `value`),",
  "builtin:markdown (props {markdown} or {text}, or a file binding of a .md file),",
  "builtin:table (binding id `rows`; props {columns: string[]}),",
  "builtin:iframe-embed (props {url}),",
  "builtin:sessions, builtin:usage, builtin:cron, builtin:instances, builtin:activity",
  "(each reads its own rpc binding; see workspace_get for a worked example).",
  "Charts are not builtins — author one with workspace_widget_scaffold and use custom:<name>.",
].join(" ");
const JsonSchema = Type.Unknown({
  description: "JSON-compatible value. Per-kind shapes are described on `kind`.",
});
const GridSchema = Type.Object(
  {
    x: Type.Integer({
      minimum: 0,
      maximum: 11,
      description: "Grid x column, 0-11.",
    }),
    y: Type.Integer({
      minimum: 0,
      maximum: 499,
      description: "Grid row, 0-499.",
    }),
    w: Type.Integer({
      minimum: 1,
      maximum: 12,
      description: "Grid width, 1-12.",
    }),
    h: Type.Integer({
      minimum: 1,
      maximum: 20,
      description: "Grid height, 1-20.",
    }),
  },
  { additionalProperties: false },
);
const BindingSchema = Type.Union([
  Type.Object(
    {
      source: Type.Literal("rpc"),
      method: Type.String({
        description: `Allowlisted gateway read method, one of: ${DATA_READ_RPC_ALLOWLIST.join(", ")}.`,
      }),
      params: Type.Optional(
        Type.Record(Type.String(), JsonSchema, {
          description: "Bounded JSON parameters required by the selected gateway method.",
        }),
      ),
    },
    { additionalProperties: false },
  ),
  Type.Object(
    {
      source: Type.Literal("file"),
      path: Type.String({ description: "Relative path under workspace/data." }),
      pointer: Type.Optional(Type.String({ description: "Optional JSON pointer." })),
    },
    { additionalProperties: false },
  ),
  Type.Object(
    {
      source: Type.Literal("static"),
      value: JsonSchema,
    },
    { additionalProperties: false },
  ),
]);
const BindingsRecordSchema = Type.Record(Type.String(), BindingSchema, {
  description: "Widget binding map keyed by binding id.",
});
const WidgetPatchSchema = Type.Object(
  {
    title: Type.Optional(Type.String({ description: "Widget title, 80 chars max." })),
    grid: Type.Optional(GridSchema),
    collapsed: Type.Optional(Type.Boolean({ description: "Collapse widget body." })),
    hidden: Type.Optional(Type.Boolean({ description: "Hide widget." })),
    bindings: Type.Optional(BindingsRecordSchema),
    props: Type.Optional(JsonSchema),
  },
  { additionalProperties: false },
);
const WidgetInputSchema = Type.Object(
  {
    id: Type.Optional(Type.String({ description: "Optional unique widget id." })),
    kind: Type.String({ description: WIDGET_KIND_DESCRIPTION }),
    title: Type.Optional(Type.String({ description: "Widget title." })),
    grid: GridSchema,
    collapsed: Type.Optional(Type.Boolean({ description: "Initial collapsed state." })),
    hidden: Type.Optional(Type.Boolean({ description: "Initial hidden state." })),
    bindings: Type.Optional(BindingsRecordSchema),
    props: Type.Optional(JsonSchema),
  },
  { additionalProperties: false },
);
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function readRecord(params, allowedKeys) {
  if (!isRecord(params)) throw new Error("params must be an object");
  for (const key of Object.keys(params))
    if (!allowedKeys.includes(key)) throw new Error(`unexpected param: ${key}`);
  return params;
}
function readRequiredString(record, key, description = key) {
  const value = record[key];
  if (typeof value !== "string" || !value.trim()) throw new Error(`${description} is required`);
  return value.trim();
}
function readOptionalString(record, key) {
  const value = record[key];
  if (value === void 0) return;
  if (typeof value !== "string") throw new Error(`${key} must be a string`);
  return value.trim();
}
function readOptionalBoolean(record, key) {
  const value = record[key];
  if (value === void 0) return;
  if (typeof value !== "boolean") throw new Error(`${key} must be a boolean`);
  return value;
}
function readSlug(record, key = "slug") {
  const slug = readRequiredString(record, key, key);
  if (!TAB_SLUG_PATTERN.test(slug)) throw new Error(`${key} is invalid`);
  return slug;
}
function readWidgetId(record, key = "id") {
  const id = readRequiredString(record, key, key);
  if (!WIDGET_ID_PATTERN.test(id)) throw new Error(`${key} is invalid`);
  return id;
}
function readGrid(value, pathName = "grid") {
  if (!isRecord(value)) throw new Error(`${pathName} must be an object`);
  for (const key of Object.keys(value))
    if (!["x", "y", "w", "h"].includes(key)) throw new Error(`${pathName}.${key} is not allowed`);
  return {
    x: readGridInt(value.x, `${pathName}.x`, 0, 11),
    y: readGridInt(value.y, `${pathName}.y`, 0, 499),
    w: readGridInt(value.w, `${pathName}.w`, 1, 12),
    h: readGridInt(value.h, `${pathName}.h`, 1, 20),
  };
}
function readGridInt(value, pathName, min, max) {
  if (!Number.isInteger(value) || value < min || value > max)
    throw new Error(`${pathName} must be an integer from ${min} to ${max}`);
  return value;
}
function readBindings(value) {
  if (value === void 0) return;
  if (!isRecord(value)) throw new Error("bindings must be an object");
  return value;
}
function slugBase(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "");
}
function makeUniqueSlug(title, tabs) {
  const used = new Set(tabs.map((tab) => tab.slug));
  const base = slugBase(title) || "tab";
  if (!used.has(base)) return base;
  for (let index = 2; index < 1e3; index += 1) {
    const suffix = `-${index}`;
    const candidate = `${base.slice(0, 40 - suffix.length)}${suffix}`;
    if (!used.has(candidate)) return candidate;
  }
  throw new Error("could not generate a unique tab slug");
}
function makeWidgetIdBase(value) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48)
      .replace(/-+$/g, "") || "widget"
  );
}
function makeUniqueWidgetId(widget, doc) {
  const existing = new Set(doc.tabs.flatMap((tab) => tab.widgets.map((entry) => entry.id)));
  const explicit = widget.id;
  if (explicit !== void 0) {
    if (typeof explicit !== "string" || !WIDGET_ID_PATTERN.test(explicit))
      throw new Error("widget.id is invalid");
    if (existing.has(explicit)) throw new Error(`duplicate widget id: ${explicit}`);
    return explicit;
  }
  const base = makeWidgetIdBase(
    typeof widget.title === "string"
      ? widget.title
      : typeof widget.kind === "string"
        ? widget.kind
        : "widget",
  );
  if (!existing.has(base)) return base;
  for (let index = 2; index < 1e3; index += 1) {
    const suffix = `-${index}`;
    const candidate = `${base.slice(0, 48 - suffix.length)}${suffix}`;
    if (!existing.has(candidate)) return candidate;
  }
  throw new Error("could not generate a unique widget id");
}
function findTab(doc, slug) {
  const tab = doc.tabs.find((entry) => entry.slug === slug);
  if (!tab) throw new Error(`workspace tab not found: ${slug}`);
  return tab;
}
function findWidget(tab, id) {
  const widget = tab.widgets.find((entry) => entry.id === id);
  if (!widget) throw new Error(`workspace widget not found: ${id}`);
  return widget;
}
function readWidgetInput(value, doc, actor) {
  const record = readRecord(value, [
    "id",
    "kind",
    "title",
    "grid",
    "collapsed",
    "hidden",
    "bindings",
    "props",
  ]);
  const title = readOptionalString(record, "title");
  const bindings = readBindings(record.bindings);
  return {
    id: makeUniqueWidgetId(record, doc),
    kind: readRequiredString(record, "kind", "kind"),
    ...(title !== void 0 ? { title } : {}),
    grid: readGrid(record.grid),
    collapsed: readOptionalBoolean(record, "collapsed") ?? false,
    hidden: readOptionalBoolean(record, "hidden") ?? false,
    createdBy: actor,
    ...(bindings !== void 0 ? { bindings } : {}),
    ...(record.props !== void 0 ? { props: record.props } : {}),
  };
}
function readWidgetPatch(value) {
  const record = readRecord(value, ["title", "grid", "collapsed", "hidden", "bindings", "props"]);
  const title = readOptionalString(record, "title");
  const collapsed = readOptionalBoolean(record, "collapsed");
  const hidden = readOptionalBoolean(record, "hidden");
  const bindings = readBindings(record.bindings);
  return {
    ...(title !== void 0 ? { title } : {}),
    ...(record.grid !== void 0 ? { grid: readGrid(record.grid) } : {}),
    ...(collapsed !== void 0 ? { collapsed } : {}),
    ...(hidden !== void 0 ? { hidden } : {}),
    ...(bindings !== void 0 ? { bindings } : {}),
    ...(record.props !== void 0 ? { props: record.props } : {}),
  };
}
function readLayout(value) {
  if (!Array.isArray(value)) throw new Error("layout must be an array");
  return value.map((entry, index) => {
    const record = readRecord(entry, ["id", "grid"]);
    return {
      id: readWidgetId(record),
      grid: readGrid(record.grid, `layout[${index}].grid`),
    };
  });
}
function readOrder(value) {
  if (!Array.isArray(value)) throw new Error("order must be an array");
  const seen = /* @__PURE__ */ new Set();
  return value.map((entry, index) => {
    if (typeof entry !== "string" || !TAB_SLUG_PATTERN.test(entry))
      throw new Error(`order[${index}] is invalid`);
    if (seen.has(entry)) throw new Error(`order contains duplicate slug: ${entry}`);
    seen.add(entry);
    return entry;
  });
}
function appendMissingTabsToOrder(doc) {
  const seen = new Set(doc.prefs.tabOrder);
  for (const tab of doc.tabs) if (!seen.has(tab.slug)) doc.prefs.tabOrder.push(tab.slug);
}
function contextOwner(ctx) {
  const record = ctx ?? {};
  return (
    (typeof record.agentId === "string" && record.agentId) ||
    (typeof record.sessionKey === "string" && record.sessionKey) ||
    (typeof record.sessionId === "string" && record.sessionId) ||
    "agent"
  );
}
function actorFromContext(ctx) {
  const actor = `agent:${
    contextOwner(ctx)
      .replace(/[^A-Za-z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 64) || "agent"
  }`;
  if (!isWorkspaceActor(actor))
    throw new Error("tool context owner cannot be used as workspace actor");
  return actor;
}
function broadcastChange(broadcast, params) {
  broadcast?.("plugin.workspaces.changed", {
    workspaceVersion: params.doc.workspaceVersion,
    ...(params.changedTabSlug ? { changedTabSlug: params.changedTabSlug } : {}),
    actor: params.actor,
  });
}
function resolveWorkspaceBroadcast(broadcast) {
  return (
    broadcast ?? getPluginRuntimeGatewayRequestScope()?.context?.broadcast ?? workspaceBroadcast()
  );
}
async function runMutation(params) {
  const result = params.store.mutate(params.mutate, { actor: params.actor });
  broadcastChange(params.broadcast, {
    doc: result.doc,
    actor: params.actor,
    changedTabSlug: params.changedTabSlug,
  });
  return jsonResult({
    doc: result.doc,
    workspaceVersion: result.doc.workspaceVersion,
  });
}
function toolDescription(text) {
  return `${text}${TOOL_DESCRIPTION_SUFFIX}`;
}
function createWorkspaceTools(params) {
  const store = params.store ?? new WorkspaceStore();
  const actor = actorFromContext(params.context);
  const broadcast = resolveWorkspaceBroadcast(params.broadcast);
  const mutationBase = {
    store,
    actor,
    broadcast,
  };
  return [
    {
      name: "workspace_get",
      label: "Workspace Get",
      description: "Read the full Workspaces document so an agent can diff before mutating it.",
      parameters: Type.Object({}, { additionalProperties: false }),
      execute: async () => {
        const doc = store.read();
        return jsonResult({
          doc,
          workspaceVersion: doc.workspaceVersion,
        });
      },
    },
    {
      name: "workspace_tab_create",
      label: "Workspace Tab Create",
      description: toolDescription(
        "Create a workspace tab. Slugs are lowercase letters, digits, and dashes, max 40 chars.",
      ),
      parameters: Type.Object(
        {
          title: Type.String({ description: "Tab title, 1-80 chars." }),
          slug: Type.Optional(Type.String({ description: "Optional tab slug." })),
          icon: Type.Optional(Type.String({ description: "Optional icon name." })),
        },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        const record = readRecord(rawParams, ["title", "slug", "icon"]);
        const title = readRequiredString(record, "title", "title");
        const icon = readOptionalString(record, "icon");
        let changedTabSlug;
        return await runMutation({
          ...mutationBase,
          mutate: (draft) => {
            const slug =
              record.slug === void 0 ? makeUniqueSlug(title, draft.tabs) : readSlug(record);
            if (draft.tabs.some((tab) => tab.slug === slug))
              throw new Error(`workspace tab already exists: ${slug}`);
            changedTabSlug = slug;
            draft.tabs.push({
              slug,
              title,
              ...(icon !== void 0 ? { icon } : {}),
              hidden: false,
              createdBy: actor,
              widgets: [],
            });
            draft.prefs.tabOrder.push(slug);
          },
          get changedTabSlug() {
            return changedTabSlug;
          },
        });
      },
    },
    {
      name: "workspace_tab_update",
      label: "Workspace Tab Update",
      description: toolDescription("Update a workspace tab title, icon, or hidden state."),
      parameters: Type.Object(
        {
          slug: Type.String({ description: "Tab slug." }),
          title: Type.Optional(Type.String({ description: "New title." })),
          icon: Type.Optional(Type.String({ description: "New icon." })),
          hidden: Type.Optional(Type.Boolean({ description: "Hide or show the tab." })),
        },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        const record = readRecord(rawParams, ["slug", "title", "icon", "hidden"]);
        const slug = readSlug(record);
        const title = readOptionalString(record, "title");
        const icon = readOptionalString(record, "icon");
        const hidden = readOptionalBoolean(record, "hidden");
        return await runMutation({
          ...mutationBase,
          changedTabSlug: slug,
          mutate: (draft) => {
            Object.assign(findTab(draft, slug), {
              ...(title !== void 0 ? { title } : {}),
              ...(icon !== void 0 ? { icon } : {}),
              ...(hidden !== void 0 ? { hidden } : {}),
            });
          },
        });
      },
    },
    {
      name: "workspace_tab_delete",
      label: "Workspace Tab Delete",
      description: toolDescription("Delete a workspace tab and all widgets inside it."),
      parameters: Type.Object(
        { slug: Type.String({ description: "Tab slug." }) },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        const slug = readSlug(readRecord(rawParams, ["slug"]));
        return await runMutation({
          ...mutationBase,
          changedTabSlug: slug,
          mutate: (draft) => {
            const nextTabs = draft.tabs.filter((tab) => tab.slug !== slug);
            if (nextTabs.length === draft.tabs.length)
              throw new Error(`workspace tab not found: ${slug}`);
            draft.tabs = nextTabs;
            draft.prefs.tabOrder = draft.prefs.tabOrder.filter((entry) => entry !== slug);
          },
        });
      },
    },
    {
      name: "workspace_tabs_reorder",
      label: "Workspace Tabs Reorder",
      description: toolDescription("Set workspace tab order. Missing existing tabs are appended."),
      parameters: Type.Object(
        { order: Type.Array(Type.String({ description: "Tab slug." })) },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        const order = readOrder(readRecord(rawParams, ["order"]).order);
        return await runMutation({
          ...mutationBase,
          mutate: (draft) => {
            const slugs = new Set(draft.tabs.map((tab) => tab.slug));
            for (const slug of order)
              if (!slugs.has(slug)) throw new Error(`workspace tab not found: ${slug}`);
            draft.prefs.tabOrder = order;
            appendMissingTabsToOrder(draft);
          },
        });
      },
    },
    {
      name: "workspace_widget_add",
      label: "Workspace Widget Add",
      description: toolDescription(
        "Add a widget to a tab. Grid x+w must fit within the 12-column workspace grid.",
      ),
      parameters: Type.Object(
        {
          tab: Type.String({ description: "Target tab slug." }),
          ...WidgetInputSchema.properties,
        },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        const record = readRecord(rawParams, [
          "tab",
          "id",
          "kind",
          "title",
          "grid",
          "collapsed",
          "hidden",
          "bindings",
          "props",
        ]);
        const tabSlug = readSlug(record, "tab");
        const widgetInput = { ...record };
        delete widgetInput.tab;
        return await runMutation({
          ...mutationBase,
          changedTabSlug: tabSlug,
          mutate: (draft) => {
            findTab(draft, tabSlug).widgets.push(readWidgetInput(widgetInput, draft, actor));
          },
        });
      },
    },
    {
      name: "workspace_widget_update",
      label: "Workspace Widget Update",
      description: toolDescription("Patch a widget title, grid, visibility, bindings, or props."),
      parameters: Type.Object(
        {
          tab: Type.String({ description: "Tab slug." }),
          id: Type.String({ description: "Widget id." }),
          ...WidgetPatchSchema.properties,
        },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        const record = readRecord(rawParams, [
          "tab",
          "id",
          "title",
          "grid",
          "collapsed",
          "hidden",
          "bindings",
          "props",
        ]);
        const tabSlug = readSlug(record, "tab");
        const id = readWidgetId(record);
        const { tab: _tab, id: _id, ...patchInput } = record;
        const patch = readWidgetPatch(patchInput);
        return await runMutation({
          ...mutationBase,
          changedTabSlug: tabSlug,
          mutate: (draft) => {
            Object.assign(findWidget(findTab(draft, tabSlug), id), patch);
          },
        });
      },
    },
    {
      name: "workspace_widget_move",
      label: "Workspace Widget Move",
      description: toolDescription(
        "Move a widget by changing its grid OR moving it to another tab — exactly one of `grid` and `toTab`, never both. A cross-tab move keeps the widget's old grid position, so follow it with a second call to reposition.",
      ),
      parameters: Type.Object(
        {
          tab: Type.Optional(Type.String({ description: "Current tab slug for grid moves." })),
          id: Type.String({ description: "Widget id." }),
          grid: Type.Optional(GridSchema),
          toTab: Type.Optional(Type.String({ description: "Destination tab slug." })),
        },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        const record = readRecord(rawParams, ["tab", "id", "grid", "toTab"]);
        if (record.grid !== void 0 && record.toTab !== void 0)
          throw new Error("workspace_widget_move accepts either grid or toTab, not both");
        if (record.grid === void 0 && record.toTab === void 0)
          throw new Error("workspace_widget_move requires grid or toTab");
        const id = readWidgetId(record);
        const changedTabSlug =
          typeof record.toTab === "string"
            ? record.toTab
            : typeof record.tab === "string"
              ? record.tab
              : void 0;
        return await runMutation({
          ...mutationBase,
          changedTabSlug,
          mutate: (draft) => {
            if (record.grid !== void 0) {
              const tabSlug = readSlug(record, "tab");
              findWidget(findTab(draft, tabSlug), id).grid = readGrid(record.grid);
              return;
            }
            const destination = findTab(draft, readSlug(record, "toTab"));
            for (const tab of draft.tabs) {
              const index = tab.widgets.findIndex((widget) => widget.id === id);
              if (index >= 0) {
                destination.widgets.push(tab.widgets.splice(index, 1)[0]);
                return;
              }
            }
            throw new Error(`workspace widget not found: ${id}`);
          },
        });
      },
    },
    {
      name: "workspace_widget_remove",
      label: "Workspace Widget Remove",
      description: toolDescription("Remove a widget from a tab."),
      parameters: Type.Object(
        {
          tab: Type.String({ description: "Tab slug." }),
          id: Type.String({ description: "Widget id." }),
        },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        const record = readRecord(rawParams, ["tab", "id"]);
        const tabSlug = readSlug(record, "tab");
        const id = readWidgetId(record);
        return await runMutation({
          ...mutationBase,
          changedTabSlug: tabSlug,
          mutate: (draft) => {
            const tab = findTab(draft, tabSlug);
            const next = tab.widgets.filter((widget) => widget.id !== id);
            if (next.length === tab.widgets.length)
              throw new Error(`workspace widget not found: ${id}`);
            tab.widgets = next;
          },
        });
      },
    },
    {
      name: "workspace_layout_set",
      label: "Workspace Layout Set",
      description: toolDescription("Batch-update widget grids for one tab."),
      parameters: Type.Object(
        {
          tab: Type.String({ description: "Tab slug." }),
          layout: Type.Array(
            Type.Object(
              {
                id: Type.String({ description: "Widget id." }),
                grid: GridSchema,
              },
              { additionalProperties: false },
            ),
          ),
        },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        const record = readRecord(rawParams, ["tab", "layout"]);
        const tabSlug = readSlug(record, "tab");
        const layout = readLayout(record.layout);
        return await runMutation({
          ...mutationBase,
          changedTabSlug: tabSlug,
          mutate: (draft) => {
            const tab = findTab(draft, tabSlug);
            for (const entry of layout) findWidget(tab, entry.id).grid = entry.grid;
          },
        });
      },
    },
    {
      name: "workspace_replace",
      label: "Workspace Replace",
      description: toolDescription(
        "Replace the full workspace document after local validation and size/schema caps.",
      ),
      parameters: Type.Object({ doc: Type.Unknown() }, { additionalProperties: false }),
      execute: async (_toolCallId, rawParams) => {
        const doc = validateWorkspaceDoc(readRecord(rawParams, ["doc"]).doc);
        const result = store.replace(doc, { actor });
        broadcastChange(broadcast, {
          doc: result.doc,
          actor,
        });
        return jsonResult({
          doc: result.doc,
          workspaceVersion: result.doc.workspaceVersion,
        });
      },
    },
    {
      name: "workspace_widget_scaffold",
      label: "Workspace Widget Scaffold",
      description: toolDescription(
        "Create a custom widget scaffold and register it as pending. Agent-authored widget code never renders until a human approves it, and there is no tool to approve it — ask the operator to approve from the Workspaces tab, or to run `openclaw workspaces widget-approve <name>`. Edit the scaffolded index.html to build the widget.",
      ),
      parameters: Type.Object(
        {
          name: Type.String({ description: "Custom widget name, A-Z a-z 0-9 . _ - only." }),
          title: Type.Optional(Type.String({ description: "Widget display title." })),
        },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        const record = readRecord(rawParams, ["name", "title"]);
        const scaffold = await scaffoldWorkspaceWidget({
          name: readRequiredString(record, "name", "name"),
          title: readOptionalString(record, "title"),
          stateDir: store.stateDir,
          createdBy: actor,
        });
        const result = store.mutate(
          (draft) => {
            draft.widgetsRegistry[scaffold.name] = {
              status: "pending",
              createdBy: actor,
            };
          },
          { actor },
        );
        broadcastChange(broadcast, {
          doc: result.doc,
          actor,
        });
        return jsonResult({
          ...scaffold,
          registry: result.doc.widgetsRegistry[scaffold.name],
          workspaceVersion: result.doc.workspaceVersion,
        });
      },
    },
    {
      name: "workspace_undo",
      label: "Workspace Undo",
      description: "Restore the newest workspace undo snapshot.",
      parameters: Type.Object({}, { additionalProperties: false }),
      execute: async () => {
        const doc = store.undo();
        broadcastChange(broadcast, {
          doc,
          actor,
        });
        return jsonResult({
          doc,
          workspaceVersion: doc.workspaceVersion,
        });
      },
    },
    {
      name: "workspace_data_read",
      label: "Workspace Data Read",
      description:
        'Resolve a workspace binding exactly as a widget sees it. `file` and `static` bindings return their data; an `rpc` binding returns { status: "binding_client_resolved" } because only the trusted Control UI may call the gateway on a widget\'s behalf.',
      parameters: Type.Object({ binding: BindingSchema }, { additionalProperties: false }),
      execute: async (_toolCallId, rawParams) => {
        const record = readRecord(rawParams, ["binding"]);
        try {
          return jsonResult({ data: await resolveBinding(record.binding, params.dataRead) });
        } catch (error) {
          if (
            error instanceof WorkspaceBindingResolutionError &&
            error.code === "binding_client_resolved"
          )
            return jsonResult({
              status: "binding_client_resolved",
              message: error.message,
            });
          throw error;
        }
      },
    },
  ];
}
//#endregion
//#region extensions/workspaces/index.ts
var workspaces_default = definePluginEntry({
  id: "workspaces",
  name: "Workspaces",
  description: "Agent-composable Workspaces document and control-plane backend.",
  register(api) {
    const store = new WorkspaceStore();
    registerWorkspaceGatewayMethods({
      api,
      store,
    });
    api.registerCli(
      async ({ program }) => {
        const { registerWorkspaceCli } = await import("../../cli-CxpowBCH.js");
        registerWorkspaceCli({ program });
      },
      {
        descriptors: [
          {
            name: "workspaces",
            description: "Manage Workspaces tabs and widgets",
            hasSubcommands: true,
          },
        ],
      },
    );
    api.registerTool(
      (context) =>
        createWorkspaceTools({
          api,
          context,
          store,
        }),
      {
        names: [
          "workspace_get",
          "workspace_tab_create",
          "workspace_tab_update",
          "workspace_tab_delete",
          "workspace_tabs_reorder",
          "workspace_widget_add",
          "workspace_widget_update",
          "workspace_widget_move",
          "workspace_widget_remove",
          "workspace_layout_set",
          "workspace_replace",
          "workspace_widget_scaffold",
          "workspace_undo",
          "workspace_data_read",
        ],
        optional: true,
      },
    );
    api.session.controls.registerControlUiDescriptor({
      surface: "tab",
      id: "workspaces",
      label: "Workspaces",
      description: "Composable workspaces you and your agents build together.",
      icon: "puzzle",
      group: "control",
      order: -10,
      requiredScopes: ["operator.read"],
    });
    const widgetRoute = createWidgetHttpRouteHandler({ store });
    api.registerHttpRoute({
      path: WIDGETS_ROUTE_PREFIX,
      auth: "plugin",
      match: "prefix",
      handler: async (req, res) => await widgetRoute.handleHttpRequest(req, res),
    });
  },
});
//#endregion
export { workspaces_default as default };
