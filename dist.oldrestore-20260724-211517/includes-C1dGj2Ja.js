import crypto from "node:crypto";
import "./src-Bl7G9qvi.js";
import fs from "node:fs";
import path from "node:path";
import { t as mergeDeep } from "./deep-merge-DH7N3urv.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import "./utils-DtcDeqWS.js";
import "./boundary-file-read-CBe_wA_B.js";
import { t as parseJsonWithJson5Fallback } from "./parse-json-compat-CmZHj-1e.js";
import "./boundary-path-CBe_wA_B.js";
import "./scan-paths-Bve2UhXh.js";
import { i as isPathInside } from "./path-DILYn_gk.js";
import { t as isPlainObject } from "./plain-object-jVBUx3XB.js";
import { i as openRootFileSync, t as canUseRootFileOpen } from "./root-file-9jkyxRTl.js";
import { n as resolvePathViaExistingAncestorSync } from "./root-path-D-mKQHrm.js";
//#region src/config/includes.ts
/**
 * Config includes: $include directive for modular configs
 *
 * @example
 * ```json5
 * {
 *   "$include": "./base.json5",           // single file
 *   "$include": ["./a.json5", "./b.json5"] // merge multiple
 * }
 * ```
 */
const INCLUDE_KEY = "$include";
const MAX_INCLUDE_FILE_BYTES = 2 * 1024 * 1024;
/** Maximum length for $include path and resolved path (CWE-22 hardening). */
const MAX_INCLUDE_PATH_LENGTH = 4096;
function hashConfigIncludeRaw(raw) {
  const hash = crypto.createHash("sha256");
  if (raw === null) hash.update("missing");
  else {
    hash.update("present\0");
    hash.update(raw, "utf-8");
  }
  return hash.digest("hex");
}
/** Resolve an include write target through its current ancestors and allowed roots. */
function resolveConfigIncludeWritePath(params) {
  const resolvedPath = path.normalize(path.resolve(params.includePath));
  const roots = [path.dirname(params.configPath), ...(params.allowedRoots ?? [])]
    .filter((root) => path.isAbsolute(root))
    .map((root) => path.normalize(root));
  if (!roots.some((root) => isPathInside(root, resolvedPath)))
    throw new ConfigIncludeError(
      `Include write path escapes config directory: ${params.includePath}`,
      params.includePath,
    );
  const canonicalPath = path.normalize(resolvePathViaExistingAncestorSync(resolvedPath));
  if (
    !roots
      .map((root) => path.normalize(safeRealpath(root)))
      .some((root) => isPathInside(root, canonicalPath))
  )
    throw new ConfigIncludeError(
      `Include write path resolves outside config directory (symlink): ${params.includePath}`,
      params.includePath,
    );
  return canonicalPath;
}
var ConfigIncludeError = class extends Error {
  constructor(message, includePath, cause) {
    super(message);
    this.includePath = includePath;
    this.cause = cause;
    this.name = "ConfigIncludeError";
  }
};
var CircularIncludeError = class extends ConfigIncludeError {
  constructor(chain) {
    super(
      `Circular include detected: ${chain.join(" -> ")}`,
      expectDefined(chain[chain.length - 1], "chain entry at chain.length 1"),
    );
    this.chain = chain;
    this.name = "CircularIncludeError";
  }
};
/** Deep merge: arrays concatenate, objects merge recursively, primitives: source wins */
function deepMerge(target, source) {
  return mergeDeep(target, source, {
    arrays: "concat",
    undefinedValues: "replace",
  });
}
var IncludeProcessor = class IncludeProcessor {
  constructor(basePath, resolver, boundary) {
    this.basePath = basePath;
    this.resolver = resolver;
    this.boundary = boundary;
    this.visited = /* @__PURE__ */ new Set();
    this.depth = 0;
    this.visited.add(path.normalize(basePath));
  }
  get rootDir() {
    return this.boundary.configRoot.rootDir;
  }
  process(obj) {
    if (Array.isArray(obj)) return obj.map((item) => this.process(item));
    if (!isPlainObject(obj)) return obj;
    if (!("$include" in obj)) return this.processObject(obj);
    return this.processInclude(obj);
  }
  processObject(obj) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) result[key] = this.process(value);
    return result;
  }
  processInclude(obj) {
    const includeValue = obj[INCLUDE_KEY];
    const otherKeys = Object.keys(obj).filter((k) => k !== INCLUDE_KEY);
    const included = this.resolveInclude(includeValue);
    if (otherKeys.length === 0) return included;
    if (!isPlainObject(included))
      throw new ConfigIncludeError(
        "Sibling keys require included content to be an object",
        typeof includeValue === "string" ? includeValue : INCLUDE_KEY,
      );
    const rest = {};
    for (const key of otherKeys) rest[key] = this.process(obj[key]);
    return deepMerge(included, rest);
  }
  resolveInclude(value) {
    if (typeof value === "string") return this.loadFile(value);
    if (Array.isArray(value))
      return value.reduce((merged, item) => {
        if (typeof item !== "string")
          throw new ConfigIncludeError(
            `Invalid $include array item: expected string, got ${typeof item}`,
            String(item),
          );
        return deepMerge(merged, this.loadFile(item));
      }, {});
    throw new ConfigIncludeError(
      `Invalid $include value: expected string or array of strings, got ${typeof value}`,
      String(value),
    );
  }
  loadFile(includePath) {
    const { resolvedPath, root } = this.resolvePath(includePath);
    this.checkCircular(resolvedPath);
    this.checkDepth(includePath);
    const raw = this.readFile(includePath, resolvedPath, root);
    const parsed = this.parseFile(includePath, resolvedPath, raw);
    return this.processNested(resolvedPath, parsed);
  }
  resolvePath(includePath) {
    if (includePath.includes("\0"))
      throw new ConfigIncludeError("Include path must not contain null bytes", includePath);
    if (includePath.length >= MAX_INCLUDE_PATH_LENGTH)
      throw new ConfigIncludeError(
        `Include path exceeds maximum length (${MAX_INCLUDE_PATH_LENGTH} characters)`,
        includePath,
      );
    const configDir = path.dirname(this.basePath);
    const resolved = path.isAbsolute(includePath)
      ? includePath
      : path.resolve(configDir, includePath);
    const normalized = path.normalize(resolved);
    if (normalized.length >= MAX_INCLUDE_PATH_LENGTH)
      throw new ConfigIncludeError(
        `Resolved include path exceeds maximum length (${MAX_INCLUDE_PATH_LENGTH} characters)`,
        includePath,
      );
    const lexicalMatch = this.findContainingRoot(normalized, "rootDir");
    if (!lexicalMatch)
      throw new ConfigIncludeError(
        `Include path escapes config directory: ${includePath} (root: ${this.rootDir})`,
        includePath,
      );
    try {
      const real = fs.realpathSync(normalized);
      const realMatch = this.findContainingRoot(real, "rootRealDir");
      if (!realMatch)
        throw new ConfigIncludeError(
          `Include path resolves outside config directory (symlink): ${includePath} (root: ${this.rootDir})`,
          includePath,
        );
      return {
        resolvedPath: normalized,
        root: realMatch,
      };
    } catch (err) {
      if (err instanceof ConfigIncludeError) throw err;
      if (isNotFoundError(err))
        return {
          resolvedPath: normalized,
          root: lexicalMatch,
        };
      throw new ConfigIncludeError(
        `Failed to resolve include file realpath: ${includePath} (resolved: ${normalized})`,
        includePath,
        err instanceof Error ? err : void 0,
      );
    }
  }
  findContainingRoot(candidate, field) {
    if (isPathInside(this.boundary.configRoot[field], candidate)) return this.boundary.configRoot;
    for (const root of this.boundary.allowedRoots)
      if (isPathInside(root[field], candidate)) return root;
    return null;
  }
  checkCircular(resolvedPath) {
    if (this.visited.has(resolvedPath))
      throw new CircularIncludeError([...this.visited, resolvedPath]);
  }
  checkDepth(includePath) {
    if (this.depth >= 10)
      throw new ConfigIncludeError(
        `Maximum include depth (10) exceeded at: ${includePath}`,
        includePath,
      );
  }
  readFile(includePath, resolvedPath, root) {
    try {
      if (this.resolver.readFileWithGuards)
        return this.resolver.readFileWithGuards({
          includePath,
          resolvedPath,
          rootRealDir: root.rootRealDir,
        });
      return this.resolver.readFile(resolvedPath);
    } catch (err) {
      if (err instanceof ConfigIncludeError) throw err;
      throw new ConfigIncludeError(
        `Failed to read include file: ${includePath} (resolved: ${resolvedPath})`,
        includePath,
        err instanceof Error ? err : void 0,
      );
    }
  }
  parseFile(includePath, resolvedPath, raw) {
    try {
      return this.resolver.parseJson(raw);
    } catch (err) {
      throw new ConfigIncludeError(
        `Failed to parse include file: ${includePath} (resolved: ${resolvedPath})`,
        includePath,
        err instanceof Error ? err : void 0,
      );
    }
  }
  processNested(resolvedPath, parsed) {
    const nested = new IncludeProcessor(resolvedPath, this.resolver, this.boundary);
    nested.visited = /* @__PURE__ */ new Set([...this.visited, resolvedPath]);
    nested.depth = this.depth + 1;
    return nested.process(parsed);
  }
};
function safeRealpath(target) {
  try {
    return fs.realpathSync(target);
  } catch {
    return target;
  }
}
/** Capture the lexical and canonical include roots once for a resolver traversal. */
function createConfigIncludeBoundary(configPath, allowedRoots = []) {
  const configRootDir = path.normalize(path.dirname(configPath));
  return {
    configRoot: {
      rootDir: configRootDir,
      rootRealDir: path.normalize(safeRealpath(configRootDir)),
    },
    allowedRoots: allowedRoots
      .filter((entry) => typeof entry === "string" && entry.length > 0 && path.isAbsolute(entry))
      .map((entry) => {
        const rootDir = path.normalize(entry);
        return {
          rootDir,
          rootRealDir: path.normalize(safeRealpath(rootDir)),
        };
      }),
  };
}
function isNotFoundError(error) {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === "ENOENT");
}
function readConfigIncludeFileWithGuards(params) {
  const ioFs = params.ioFs ?? fs;
  const maxBytes = params.maxBytes ?? MAX_INCLUDE_FILE_BYTES;
  if (!canUseRootFileOpen(ioFs)) {
    const raw = ioFs.readFileSync(params.resolvedPath, "utf-8");
    try {
      params.onResolvedPath?.(path.normalize(ioFs.realpathSync(params.resolvedPath)));
    } catch {}
    return raw;
  }
  const opened = openRootFileSync({
    absolutePath: params.resolvedPath,
    rootPath: params.rootRealDir,
    rootRealPath: params.rootRealDir,
    boundaryLabel: "config directory",
    skipLexicalRootCheck: true,
    maxBytes,
    ioFs,
  });
  if (!opened.ok) {
    if (opened.reason === "validation")
      throw new ConfigIncludeError(
        `Include file failed security checks (regular file, max ${maxBytes} bytes, no hardlinks): ${params.includePath}`,
        params.includePath,
      );
    throw new ConfigIncludeError(
      `Failed to read include file: ${params.includePath} (resolved: ${params.resolvedPath})`,
      params.includePath,
      opened.error instanceof Error ? opened.error : void 0,
    );
  }
  try {
    const raw = ioFs.readFileSync(opened.fd, "utf-8");
    params.onResolvedPath?.(path.normalize(opened.path));
    return raw;
  } finally {
    ioFs.closeSync(opened.fd);
  }
}
const defaultResolver = {
  readFile: (p) => fs.readFileSync(p, "utf-8"),
  readFileWithGuards: ({ includePath, resolvedPath, rootRealDir }) =>
    readConfigIncludeFileWithGuards({
      includePath,
      resolvedPath,
      rootRealDir,
    }),
  parseJson: parseJsonWithJson5Fallback,
};
function resolveConfigIncludesWithinBoundary(obj, configPath, resolver, boundary) {
  return new IncludeProcessor(configPath, resolver, boundary).process(obj);
}
/**
 * Creates a resolver that shares one immutable root snapshot across independent
 * include resolutions. Used when callers must isolate malformed sibling graphs.
 */
function createConfigIncludeResolutionSession(configPath, allowedRoots = []) {
  const boundary = createConfigIncludeBoundary(configPath, allowedRoots);
  return (obj, basePath, resolver = defaultResolver) =>
    resolveConfigIncludesWithinBoundary(obj, basePath, resolver, boundary);
}
/**
 * Resolves all $include directives in a parsed config object.
 */
function resolveConfigIncludes(obj, configPath, resolver = defaultResolver, options = {}) {
  return resolveConfigIncludesWithinBoundary(
    obj,
    configPath,
    resolver,
    createConfigIncludeBoundary(configPath, options.allowedRoots ?? []),
  );
}
//#endregion
export {
  hashConfigIncludeRaw as a,
  resolveConfigIncludes as c,
  createConfigIncludeResolutionSession as i,
  ConfigIncludeError as n,
  readConfigIncludeFileWithGuards as o,
  INCLUDE_KEY as r,
  resolveConfigIncludeWritePath as s,
  CircularIncludeError as t,
};
