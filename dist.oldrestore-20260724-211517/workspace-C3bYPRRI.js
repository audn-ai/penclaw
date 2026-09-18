import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { a as resolveHookEntries } from "./config-CzBjCjbr.js";
import {
  i as resolveOpenClawMetadata,
  n as resolveHookInvocationPolicy,
  t as parseFrontmatter,
} from "./frontmatter-D_LnCPcN.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import "./boundary-file-read-CBe_wA_B.js";
import { n as MANIFEST_KEY } from "./legacy-names-NIXaj2oi.js";
import {
  c as resolveMemorySlotDecision,
  o as normalizePluginsConfigWithResolver,
  s as resolveEffectivePluginActivationState,
} from "./manifest-registry-CXy9BBfE.js";
import { a as isPathInsideWithRealpath } from "./path-DILYn_gk.js";
import { i as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-BMgImu0m.js";
import "./scan-paths-Bve2UhXh.js";
import { i as openRootFileSync } from "./root-file-9jkyxRTl.js";
import { r as hasKind } from "./slots-kpL659LX.js";
import { d as normalizeTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { t as CONFIG_DIR } from "./utils-DtcDeqWS.js";
//#region src/hooks/internal-hook-types.ts
const KNOWN_INTERNAL_HOOK_EVENT_FAMILIES = ["command", "session", "agent", "gateway", "message"];
/**
 * Event keys emitted by core trigger sites (see docs/automation/hooks.md
 * events table — keep both in sync when adding a trigger). Hooks can also
 * subscribe to a bare family key to receive every action of that family.
 * Plugins can emit additional keys via the deprecated plugin-sdk/hook-runtime
 * barrel, so anything outside this set is flagged as a likely typo
 * (advisory), not rejected.
 */
const KNOWN_INTERNAL_HOOK_EVENT_KEYS = [
  "agent:bootstrap",
  "command:new",
  "command:reset",
  "command:stop",
  "gateway:pre-restart",
  "gateway:shutdown",
  "gateway:startup",
  "message:preprocessed",
  "message:received",
  "message:sent",
  "message:transcribed",
  "session:compact:after",
  "session:compact:before",
  "session:patch",
];
function isKnownInternalHookEventKey(key) {
  return (
    KNOWN_INTERNAL_HOOK_EVENT_KEYS.includes(key) || KNOWN_INTERNAL_HOOK_EVENT_FAMILIES.includes(key)
  );
}
//#endregion
//#region src/hooks/bundled-dir.ts
function resolveBundledHooksDir() {
  const override = process.env.OPENCLAW_BUNDLED_HOOKS_DIR?.trim();
  if (override) return override;
  try {
    const execDir = path.dirname(process.execPath);
    const sibling = path.join(execDir, "hooks", "bundled");
    if (fs.existsSync(sibling)) return sibling;
  } catch {}
  try {
    const moduleDir = path.dirname(fileURLToPath(import.meta.url));
    const distBundled = path.join(moduleDir, "bundled");
    if (fs.existsSync(distBundled)) return distBundled;
  } catch {}
  try {
    const moduleDir = path.dirname(fileURLToPath(import.meta.url));
    const root = path.resolve(moduleDir, "..", "..");
    const srcBundled = path.join(root, "src", "hooks", "bundled");
    if (fs.existsSync(srcBundled)) return srcBundled;
  } catch {}
}
//#endregion
//#region src/hooks/plugin-hooks.ts
const log$1 = createSubsystemLogger("hooks");
/** Resolve hook directories declared by active plugin manifests. */
function resolvePluginHookDirs(params) {
  const workspaceDir = (params.workspaceDir ?? "").trim();
  if (!workspaceDir) return [];
  const metadataSnapshot = loadPluginMetadataSnapshot({
    workspaceDir,
    config: params.config ?? {},
    env: process.env,
  });
  const registry = metadataSnapshot.manifestRegistry;
  if (registry.plugins.length === 0) return [];
  const normalizedPlugins = normalizePluginsConfigWithResolver(
    params.config?.plugins,
    metadataSnapshot.normalizePluginId,
  );
  const memorySlot = normalizedPlugins.slots.memory;
  let selectedMemoryPluginId = null;
  const seen = /* @__PURE__ */ new Set();
  const resolved = [];
  for (const record of registry.plugins) {
    if (!record.hooks || record.hooks.length === 0) continue;
    if (
      !resolveEffectivePluginActivationState({
        id: record.id,
        origin: record.origin,
        config: normalizedPlugins,
        rootConfig: params.config,
      }).activated
    )
      continue;
    const memoryDecision = resolveMemorySlotDecision({
      id: record.id,
      kind: record.kind,
      slot: memorySlot,
      selectedId: selectedMemoryPluginId,
    });
    if (!memoryDecision.enabled) continue;
    if (memoryDecision.selected && hasKind(record.kind, "memory"))
      selectedMemoryPluginId = record.id;
    for (const raw of record.hooks) {
      const trimmed = raw.trim();
      if (!trimmed) continue;
      const candidate = path.resolve(record.rootDir, trimmed);
      if (!fs.existsSync(candidate)) {
        log$1.warn(`plugin hook path not found (${record.id}): ${candidate}`);
        continue;
      }
      if (!isPathInsideWithRealpath(record.rootDir, candidate, { requireRealpath: true })) {
        log$1.warn(`plugin hook path escapes plugin root (${record.id}): ${candidate}`);
        continue;
      }
      if (seen.has(candidate)) continue;
      seen.add(candidate);
      resolved.push({
        dir: candidate,
        pluginId: record.id,
      });
    }
  }
  return resolved;
}
//#endregion
//#region src/hooks/workspace.ts
const log = createSubsystemLogger("hooks/workspace");
function readHookPackageManifest(dir) {
  const raw = readRootFileUtf8({
    absolutePath: path.join(dir, "package.json"),
    rootPath: dir,
    boundaryLabel: "hook package directory",
  });
  if (raw === null) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function resolvePackageHooks(manifest) {
  return normalizeTrimmedStringList(manifest[MANIFEST_KEY]?.hooks);
}
function resolveContainedDir(baseDir, targetDir) {
  const base = path.resolve(baseDir);
  const resolved = path.resolve(baseDir, targetDir);
  if (!isPathInsideWithRealpath(base, resolved, { requireRealpath: true })) return null;
  return resolved;
}
function loadHookFromDir(params) {
  const hookMdPath = path.join(params.hookDir, "HOOK.md");
  const content = readRootFileUtf8({
    absolutePath: hookMdPath,
    rootPath: params.hookDir,
    boundaryLabel: "hook directory",
  });
  if (content === null) return null;
  try {
    const frontmatter = parseFrontmatter(content);
    const name = frontmatter.name || params.nameHint || path.basename(params.hookDir);
    const description = frontmatter.description || "";
    const handlerCandidates = ["handler.ts", "handler.js", "index.ts", "index.js"];
    let handlerPath;
    for (const candidate of handlerCandidates) {
      const safeCandidatePath = resolveRootFilePath({
        absolutePath: path.join(params.hookDir, candidate),
        rootPath: params.hookDir,
        boundaryLabel: "hook directory",
      });
      if (safeCandidatePath) {
        handlerPath = safeCandidatePath;
        break;
      }
    }
    if (!handlerPath) {
      log.warn(`Hook "${name}" has HOOK.md but no handler file in ${params.hookDir}`);
      return null;
    }
    let baseDir = params.hookDir;
    try {
      baseDir = fs.realpathSync.native(params.hookDir);
    } catch {}
    return {
      hook: {
        name,
        description,
        source: params.source,
        pluginId: params.pluginId,
        filePath: hookMdPath,
        baseDir,
        handlerPath,
      },
      frontmatter,
    };
  } catch (err) {
    const message = err instanceof Error ? (err.stack ?? err.message) : String(err);
    log.warn(`Failed to load hook from ${params.hookDir}: ${message}`);
    return null;
  }
}
/**
 * Scan a directory for hooks (subdirectories containing HOOK.md)
 */
function loadHooksFromDir(params) {
  const { dir, source, pluginId } = params;
  if (!fs.existsSync(dir)) return [];
  if (!fs.statSync(dir).isDirectory()) return [];
  const hooks = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const hookDir = path.join(dir, entry.name);
    const manifest = readHookPackageManifest(hookDir);
    const packageHooks = manifest ? resolvePackageHooks(manifest) : [];
    if (packageHooks.length > 0) {
      for (const hookPath of packageHooks) {
        const resolvedHookDir = resolveContainedDir(hookDir, hookPath);
        if (!resolvedHookDir) {
          log.warn(
            `Ignoring out-of-package hook path "${hookPath}" in ${hookDir} (must be within package directory)`,
          );
          continue;
        }
        const hook = loadHookFromDir({
          hookDir: resolvedHookDir,
          source,
          pluginId,
          nameHint: path.basename(resolvedHookDir),
        });
        if (hook) hooks.push(hook);
      }
      continue;
    }
    const hook = loadHookFromDir({
      hookDir,
      source,
      pluginId,
      nameHint: entry.name,
    });
    if (hook) hooks.push(hook);
  }
  return hooks;
}
function loadHookEntriesFromDir(params) {
  return loadHooksFromDir({
    dir: params.dir,
    source: params.source,
    pluginId: params.pluginId,
  }).map(({ hook, frontmatter }) => {
    return {
      hook: {
        ...hook,
        source: params.source,
        pluginId: params.pluginId,
      },
      frontmatter,
      metadata: resolveOpenClawMetadata(frontmatter),
      invocation: resolveHookInvocationPolicy(frontmatter),
    };
  });
}
function discoverWorkspaceHookEntries(workspaceDir, opts) {
  const managedHooksDir = opts?.managedHooksDir ?? path.join(CONFIG_DIR, "hooks");
  const workspaceHooksDir = path.join(workspaceDir, "hooks");
  const bundledHooksDir = opts?.bundledHooksDir ?? resolveBundledHooksDir();
  const extraDirs = normalizeTrimmedStringList(
    opts?.config?.hooks?.internal?.load?.extraDirs ?? [],
  );
  const pluginHookDirs = resolvePluginHookDirs({
    workspaceDir,
    config: opts?.config,
  });
  const bundledHooks = bundledHooksDir
    ? loadHookEntriesFromDir({
        dir: bundledHooksDir,
        source: "openclaw-bundled",
      })
    : [];
  const extraHooks = extraDirs.flatMap((dir) => {
    return loadHookEntriesFromDir({
      dir: resolveUserPath(dir),
      source: "openclaw-managed",
    });
  });
  const pluginHooks = pluginHookDirs.flatMap(({ dir, pluginId }) =>
    loadHookEntriesFromDir({
      dir,
      source: "openclaw-plugin",
      pluginId,
    }),
  );
  const managedHooks = loadHookEntriesFromDir({
    dir: managedHooksDir,
    source: "openclaw-managed",
  });
  const workspaceHooks = loadHookEntriesFromDir({
    dir: workspaceHooksDir,
    source: "openclaw-workspace",
  });
  return [...extraHooks, ...bundledHooks, ...pluginHooks, ...managedHooks, ...workspaceHooks];
}
function loadWorkspaceHookEntries(workspaceDir, opts) {
  return resolveHookEntries(opts?.entries ?? discoverWorkspaceHookEntries(workspaceDir, opts), {
    onCollisionIgnored: ({ name, kept, ignored }) => {
      log.warn(
        `Ignoring ${ignored.hook.source} hook "${name}" because it cannot override ${kept.hook.source} hook code`,
      );
    },
  });
}
function readRootFileUtf8(params) {
  return withOpenedRootFileSync(params, (opened) => {
    try {
      return fs.readFileSync(opened.fd, "utf-8");
    } catch {
      return null;
    }
  });
}
function withOpenedRootFileSync(params, read) {
  const opened = openRootFileSync({
    absolutePath: params.absolutePath,
    rootPath: params.rootPath,
    boundaryLabel: params.boundaryLabel,
  });
  if (!opened.ok) return null;
  try {
    return read({
      fd: opened.fd,
      path: opened.path,
    });
  } finally {
    fs.closeSync(opened.fd);
  }
}
function resolveRootFilePath(params) {
  return withOpenedRootFileSync(params, (opened) => opened.path);
}
//#endregion
export { isKnownInternalHookEventKey as n, loadWorkspaceHookEntries as t };
