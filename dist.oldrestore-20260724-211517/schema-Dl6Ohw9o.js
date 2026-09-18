import path from "node:path";
//#region extensions/workspaces/src/binding-contract.ts
const DATA_READ_RPC_ALLOWLIST = [
  "health",
  "system-presence",
  "usage.status",
  "usage.cost",
  "agents.list",
  "sessions.list",
  "sessions.resolve",
  "sessions.get",
  "sessions.usage",
  "sessions.usage.timeseries",
  "sessions.usage.logs",
  "node.list",
  "node.describe",
  "cron.get",
  "cron.list",
  "cron.status",
  "cron.runs",
];
var WorkspaceBindingResolutionError = class extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = "WorkspaceBindingResolutionError";
  }
};
function hasControlCharacter(value) {
  for (const char of value) {
    const code = char.charCodeAt(0);
    if (code < 32 || code === 127) return true;
  }
  return false;
}
function normalizeWorkspaceDataLogicalPath(value) {
  if (
    value.startsWith("/") ||
    path.isAbsolute(value) ||
    path.win32.isAbsolute(value) ||
    hasControlCharacter(value)
  )
    throw new WorkspaceBindingResolutionError("binding_invalid", "file binding path is invalid");
  const parts = value.replaceAll("\\", "/").split("/").filter(Boolean);
  if (
    parts.length === 0 ||
    parts[0] === "~" ||
    parts.some((part) => part === "." || part === ".." || part.includes(":"))
  )
    throw new WorkspaceBindingResolutionError("binding_invalid", "file binding path is invalid");
  return parts.join("/");
}
//#endregion
//#region extensions/workspaces/src/schema.ts
const CURRENT_WORKSPACE_SCHEMA_VERSION = 1;
const TAB_SLUG_PATTERN = /^[a-z0-9-]{1,40}$/;
const ACTOR_PATTERN = /^(user|system|agent:[A-Za-z0-9._-]{1,64})$/;
const WIDGET_ID_PATTERN = /^[A-Za-z0-9_-]{1,48}$/;
/** The trusted widget set. Exported so tool schemas can name them for the model. */
const BUILTIN_WIDGET_KINDS = [
  "builtin:stat-card",
  "builtin:markdown",
  "builtin:table",
  "builtin:iframe-embed",
  "builtin:sessions",
  "builtin:usage",
  "builtin:cron",
  "builtin:instances",
  "builtin:activity",
];
const BUILTIN_KINDS = new Set(BUILTIN_WIDGET_KINDS);
const CUSTOM_KIND_PATTERN = /^custom:(?!__proto__$)[A-Za-z0-9._-]{1,64}$/;
const CUSTOM_WIDGET_NAME_PATTERN = /^(?!__proto__$)[A-Za-z0-9._-]{1,64}$/;
const MAX_STATIC_BINDING_BYTES = 8 * 1024;
const MAX_RPC_BINDING_PARAMS_BYTES = 8 * 1024;
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function assertRecord(value, path) {
  if (!isRecord(value)) throw new Error(`${path} must be an object`);
  return value;
}
function assertKnownKeys(record, allowed, path) {
  for (const key of Object.keys(record))
    if (!allowed.includes(key)) throw new Error(`${path}.${key} is not allowed`);
}
function requireString(record, key, path) {
  const value = record[key];
  if (typeof value !== "string") throw new Error(`${path}.${key} must be a string`);
  return value;
}
function optionalString(record, key, path) {
  const value = record[key];
  if (value === void 0) return;
  if (typeof value !== "string") throw new Error(`${path}.${key} must be a string`);
  return value;
}
function requireBoolean(record, key, path) {
  const value = record[key];
  if (typeof value !== "boolean") throw new Error(`${path}.${key} must be a boolean`);
  return value;
}
function requireArray(value, path) {
  if (!Array.isArray(value)) throw new Error(`${path} must be an array`);
  return value;
}
function validateActor(value, path) {
  if (typeof value !== "string" || !ACTOR_PATTERN.test(value))
    throw new Error(`${path} createdBy is invalid`);
  return value;
}
function isWorkspaceActor(value) {
  return typeof value === "string" && ACTOR_PATTERN.test(value);
}
function assertIntegerRange(value, path, min, max) {
  if (!Number.isInteger(value) || value < min || value > max)
    throw new Error(`${path} must be an integer from ${min} to ${max}`);
  return value;
}
function validateGrid(value, path) {
  const record = assertRecord(value, path);
  assertKnownKeys(record, ["x", "y", "w", "h"], path);
  const grid = {
    x: assertIntegerRange(record.x, `${path}.x`, 0, 11),
    y: assertIntegerRange(record.y, `${path}.y`, 0, 499),
    w: assertIntegerRange(record.w, `${path}.w`, 1, 12),
    h: assertIntegerRange(record.h, `${path}.h`, 1, 20),
  };
  if (grid.x + grid.w > 12) throw new Error(`${path}.x + w must be 12 or less`);
  return grid;
}
function assertJsonValue(value, path) {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean" ||
    (typeof value === "number" && Number.isFinite(value))
  )
    return value;
  if (Array.isArray(value))
    return value.map((entry, index) => assertJsonValue(entry, `${path}[${index}]`));
  if (isRecord(value)) {
    const next = {};
    for (const [key, entry] of Object.entries(value))
      next[key] = assertJsonValue(entry, `${path}.${key}`);
    return next;
  }
  throw new Error(`${path} must be JSON-serializable`);
}
function serializedBytes(value) {
  return Buffer.byteLength(JSON.stringify(value), "utf8");
}
function validateBinding(value, path) {
  const record = assertRecord(value, path);
  const source = requireString(record, "source", path);
  if (source === "rpc") {
    assertKnownKeys(record, ["source", "method", "params"], path);
    const method = requireString(record, "method", path);
    if (!DATA_READ_RPC_ALLOWLIST.includes(method))
      throw new Error(
        `${path}.method is not allowlisted; allowed: ${DATA_READ_RPC_ALLOWLIST.join(", ")}`,
      );
    const params =
      record.params === void 0
        ? void 0
        : assertJsonValue(assertRecord(record.params, `${path}.params`), `${path}.params`);
    if (params !== void 0 && serializedBytes(params) > MAX_RPC_BINDING_PARAMS_BYTES)
      throw new Error(`${path}.params must serialize to 8 KB or less`);
    return {
      source,
      method,
      ...(params !== void 0 ? { params } : {}),
    };
  }
  if (source === "file") {
    assertKnownKeys(record, ["source", "path", "pointer"], path);
    const bindingPath = requireString(record, "path", path);
    normalizeWorkspaceDataLogicalPath(bindingPath);
    const pointer = optionalString(record, "pointer", path);
    return {
      source,
      path: bindingPath,
      ...(pointer !== void 0 ? { pointer } : {}),
    };
  }
  if (source === "static") {
    assertKnownKeys(record, ["source", "value"], path);
    const jsonValue = assertJsonValue(record.value, `${path}.value`);
    if (serializedBytes(jsonValue) > MAX_STATIC_BINDING_BYTES)
      throw new Error(`${path}.value must serialize to 8 KB or less`);
    return {
      source,
      value: jsonValue,
    };
  }
  throw new Error(`${path}.source is invalid`);
}
function validateBindingRecord(value, path) {
  const record = assertRecord(value, path);
  return Object.fromEntries(
    Object.entries(record).map(([key, entry]) => {
      if (key === "__proto__" || !/^[A-Za-z0-9._-]{1,64}$/.test(key))
        throw new Error(`${path}.${key} binding id is invalid`);
      return [key, validateBinding(entry, `${path}.${key}`)];
    }),
  );
}
function validateWidget(value, path) {
  const record = assertRecord(value, path);
  assertKnownKeys(
    record,
    ["id", "kind", "title", "grid", "collapsed", "hidden", "createdBy", "bindings", "props"],
    path,
  );
  const id = requireString(record, "id", path);
  if (!WIDGET_ID_PATTERN.test(id)) throw new Error(`${path}.id is invalid`);
  const kind = requireString(record, "kind", path);
  if (!BUILTIN_KINDS.has(kind) && !CUSTOM_KIND_PATTERN.test(kind))
    throw new Error(
      `${path}.kind is invalid: expected custom:<name> or one of ${BUILTIN_WIDGET_KINDS.join(", ")}`,
    );
  const title = optionalString(record, "title", path);
  if (title !== void 0 && title.length > 80)
    throw new Error(`${path}.title must be 80 characters or fewer`);
  const bindings =
    record.bindings === void 0
      ? void 0
      : validateBindingRecord(record.bindings, `${path}.bindings`);
  const props = record.props === void 0 ? void 0 : assertJsonValue(record.props, `${path}.props`);
  return {
    id,
    kind,
    ...(title !== void 0 ? { title } : {}),
    grid: validateGrid(record.grid, `${path}.grid`),
    collapsed: requireBoolean(record, "collapsed", path),
    hidden: requireBoolean(record, "hidden", path),
    createdBy: validateActor(record.createdBy, `${path}.createdBy`),
    ...(bindings !== void 0 ? { bindings } : {}),
    ...(props !== void 0 ? { props } : {}),
  };
}
function validateTab(value, path) {
  const record = assertRecord(value, path);
  assertKnownKeys(record, ["slug", "title", "icon", "hidden", "createdBy", "widgets"], path);
  const slug = requireString(record, "slug", path);
  if (!TAB_SLUG_PATTERN.test(slug)) throw new Error(`${path}.slug is invalid`);
  const title = requireString(record, "title", path);
  if (title.length < 1 || title.length > 80)
    throw new Error(`${path}.title must be 1-80 characters`);
  const icon = optionalString(record, "icon", path);
  if (icon !== void 0 && icon.length > 40)
    throw new Error(`${path}.icon must be 40 characters or fewer`);
  const widgets = requireArray(record.widgets, `${path}.widgets`);
  if (widgets.length > 24) throw new Error(`${path}.widgets must contain at most 24 entries`);
  return {
    slug,
    title,
    ...(icon !== void 0 ? { icon } : {}),
    hidden: requireBoolean(record, "hidden", path),
    createdBy: validateActor(record.createdBy, `${path}.createdBy`),
    widgets: widgets.map((widget, index) => validateWidget(widget, `${path}.widgets[${index}]`)),
  };
}
const SHA256_HEX_PATTERN = /^[a-f0-9]{64}$/;
const WIDGET_FILE_PATH_PATTERN = /^[A-Za-z0-9._-]+(\/[A-Za-z0-9._-]+)*$/;
function validateApprovedFiles(value, path) {
  const record = assertRecord(value, path);
  const files = {};
  for (const [logicalPath, digest] of Object.entries(record)) {
    if (!WIDGET_FILE_PATH_PATTERN.test(logicalPath) || logicalPath.includes(".."))
      throw new Error(`${path}.${logicalPath} is not a valid widget file path`);
    if (typeof digest !== "string" || !SHA256_HEX_PATTERN.test(digest))
      throw new Error(`${path}.${logicalPath} must be a sha256 hex digest`);
    files[logicalPath] = digest;
  }
  return files;
}
function validateRegistryEntry(value, path) {
  const record = assertRecord(value, path);
  assertKnownKeys(
    record,
    ["status", "createdBy", "approvedBy", "approvedAt", "approvedFiles"],
    path,
  );
  const status = requireString(record, "status", path);
  if (status !== "pending" && status !== "approved" && status !== "rejected")
    throw new Error(`${path}.status is invalid`);
  const approvedBy =
    record.approvedBy === void 0 ? void 0 : validateActor(record.approvedBy, `${path}.approvedBy`);
  const approvedAt = optionalString(record, "approvedAt", path);
  const approvedFiles =
    record.approvedFiles === void 0
      ? void 0
      : validateApprovedFiles(record.approvedFiles, `${path}.approvedFiles`);
  return {
    status,
    createdBy: validateActor(record.createdBy, `${path}.createdBy`),
    ...(approvedBy !== void 0 ? { approvedBy } : {}),
    ...(approvedAt !== void 0 ? { approvedAt } : {}),
    ...(approvedFiles !== void 0 ? { approvedFiles } : {}),
  };
}
function validateWidgetsRegistry(value) {
  const record = assertRecord(value, "widgetsRegistry");
  return Object.fromEntries(
    Object.entries(record).map(([name, entry]) => {
      if (!CUSTOM_WIDGET_NAME_PATTERN.test(name))
        throw new Error(`widgetsRegistry.${name} name is invalid`);
      return [name, validateRegistryEntry(entry, `widgetsRegistry.${name}`)];
    }),
  );
}
function validatePrefs(value, tabSlugs) {
  const record = assertRecord(value, "prefs");
  assertKnownKeys(record, ["tabOrder"], "prefs");
  const tabOrder = requireArray(record.tabOrder, "prefs.tabOrder");
  const seen = /* @__PURE__ */ new Set();
  return {
    tabOrder: tabOrder.map((entry, index) => {
      if (typeof entry !== "string" || !TAB_SLUG_PATTERN.test(entry))
        throw new Error(`prefs.tabOrder[${index}] is invalid`);
      if (!tabSlugs.has(entry)) throw new Error(`prefs.tabOrder[${index}] is not a tab slug`);
      if (seen.has(entry)) throw new Error(`prefs.tabOrder contains duplicate slug: ${entry}`);
      seen.add(entry);
      return entry;
    }),
  };
}
function assertUniqueTabs(tabs) {
  const slugs = /* @__PURE__ */ new Set();
  for (const tab of tabs) {
    if (slugs.has(tab.slug)) throw new Error(`duplicate tab slug: ${tab.slug}`);
    slugs.add(tab.slug);
  }
  return slugs;
}
function assertUniqueWidgets(tabs) {
  const ids = /* @__PURE__ */ new Set();
  for (const tab of tabs)
    for (const widget of tab.widgets) {
      if (ids.has(widget.id)) throw new Error(`duplicate widget id: ${widget.id}`);
      ids.add(widget.id);
    }
}
function validateWorkspaceDoc(value) {
  const record = assertRecord(value, "workspaces");
  assertKnownKeys(
    record,
    ["schemaVersion", "workspaceVersion", "tabs", "widgetsRegistry", "prefs"],
    "workspaces",
  );
  if (record.schemaVersion !== CURRENT_WORKSPACE_SCHEMA_VERSION)
    throw new Error(`schemaVersion must be ${CURRENT_WORKSPACE_SCHEMA_VERSION}`);
  const workspaceVersion = assertIntegerRange(
    record.workspaceVersion,
    "workspaceVersion",
    0,
    Number.MAX_SAFE_INTEGER,
  );
  const rawTabs = requireArray(record.tabs, "tabs");
  if (rawTabs.length > 32) throw new Error("tabs must contain at most 32 entries");
  const tabs = rawTabs.map((tab, index) => validateTab(tab, `tabs[${index}]`));
  const tabSlugs = assertUniqueTabs(tabs);
  assertUniqueWidgets(tabs);
  return {
    schemaVersion: CURRENT_WORKSPACE_SCHEMA_VERSION,
    workspaceVersion,
    tabs,
    widgetsRegistry: validateWidgetsRegistry(record.widgetsRegistry),
    prefs: validatePrefs(record.prefs, tabSlugs),
  };
}
//#endregion
export {
  WorkspaceBindingResolutionError as a,
  DATA_READ_RPC_ALLOWLIST as i,
  isWorkspaceActor as n,
  normalizeWorkspaceDataLogicalPath as o,
  validateWorkspaceDoc as r,
  BUILTIN_WIDGET_KINDS as t,
};
