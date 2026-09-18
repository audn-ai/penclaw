import fs from "node:fs/promises";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { a as resolveAgentDir, n as listAgentIds } from "../../agent-scope-config-DVIR1nBa.js";
import "../../agent-runtime-BiQiwmwD.js";
import { y as resolveSessionAgentIds } from "../../agent-scope-y9xQv_q1.js";
import { o as withFileLock } from "../../file-lock-C2Kr7iLJ.js";
import {
  n as CODEX_APP_SERVER_BINDING_NAMESPACE,
  t as CODEX_APP_SERVER_BINDING_MAX_ENTRIES,
} from "../../session-binding-meta-B7aEMU7g.js";
import {
  m as resolveStorePath,
  s as patchSessionEntry,
} from "../../session-store-runtime-BwE6SlGz.js";
//#region extensions/codex/src/migration/session-binding-sidecar-archive.ts
async function pathExists$1(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
async function firstFreeArchivePath(sourcePath) {
  for (let index = 2; ; index++) {
    const candidate = `${sourcePath}.migrated.${index}`;
    if (!(await pathExists$1(candidate))) return candidate;
  }
}
async function archiveBindingSidecar(sourcePath) {
  const archivePath = `${sourcePath}.migrated`;
  if (!(await pathExists$1(archivePath))) {
    await fs.rename(sourcePath, archivePath);
    return;
  }
  const [sourceBytes, archiveBytes] = await Promise.all([
    fs.readFile(sourcePath),
    fs.readFile(archivePath),
  ]);
  if (sourceBytes.equals(archiveBytes)) {
    await fs.rm(sourcePath, { force: true });
    return;
  }
  await fs.rename(sourcePath, await firstFreeArchivePath(sourcePath));
}
//#endregion
//#region extensions/codex/src/migration/session-binding-sidecars.ts
const LEGACY_BINDING_SUFFIX = ".codex-app-server.json";
const CODEX_AGENT_HARNESS_ID = "codex";
const MAX_SESSION_DIRECTORY_DEPTH = 16;
const LEGACY_BINDING_LOCK_OPTIONS = {
  retries: {
    retries: 75,
    factor: 1,
    minTimeout: 1e3,
    maxTimeout: 1e3,
  },
  stale: 12e4,
};
async function collectSessionSurfaces(params) {
  const surfaces = /* @__PURE__ */ new Map();
  const stateRoot = await canonicalizePath(params.stateDir);
  const add = async (root, storePath, agentId, scan) => {
    const canonicalRoot = await canonicalizePath(root);
    const surface = surfaces.get(canonicalRoot) ?? {
      root: canonicalRoot,
      scan: false,
      storePaths: /* @__PURE__ */ new Set(),
      agentIds: /* @__PURE__ */ new Set(),
    };
    surface.scan ||= scan;
    surface.storePaths.add(path.resolve(storePath));
    surface.agentIds.add(agentId);
    surfaces.set(canonicalRoot, surface);
  };
  const agentIds = new Set(listAgentIds(params.config));
  const agentsDir = path.join(params.stateDir, "agents");
  for (const entry of await readDirectoryEntries(agentsDir)) {
    if (!entry.isDirectory() || entry.isSymbolicLink()) continue;
    const agentId = resolveSessionAgentIds({
      agentId: entry.name,
      config: params.config,
    }).sessionAgentId;
    agentIds.add(agentId);
    const root = path.join(agentsDir, entry.name, "sessions");
    await add(root, path.join(root, "sessions.json"), agentId, true);
  }
  for (const agentId of agentIds) {
    const storePath = resolveStorePath(params.config.session?.store, {
      agentId,
      env: params.env,
    });
    const root = path.dirname(storePath);
    await add(root, storePath, agentId, isPathWithin(stateRoot, await canonicalizePath(root)));
  }
  const legacyRoot = path.join(params.stateDir, "sessions");
  const defaultAgentId = resolveSessionAgentIds({ config: params.config }).defaultAgentId;
  await add(legacyRoot, path.join(legacyRoot, "sessions.json"), defaultAgentId, true);
  return [...surfaces.values()].toSorted((a, b) => a.root.localeCompare(b.root));
}
async function collectLegacyBindingSources(params, options = {}) {
  const surfaces = await collectSessionSurfaces(params);
  const sources = /* @__PURE__ */ new Map();
  const addSource = async (sidecarPath, surface) => {
    const canonicalSidecar = await canonicalizePath(sidecarPath);
    const source = sources.get(canonicalSidecar) ?? {
      sidecarPath: canonicalSidecar,
      transcriptPath: sidecarPath.slice(0, -22),
      agentIds: /* @__PURE__ */ new Set(),
    };
    for (const agentId of surface.agentIds) source.agentIds.add(agentId);
    sources.set(canonicalSidecar, source);
    return source;
  };
  for (const surface of surfaces) {
    const sidecars = surface.scan ? walkSidecars(surface.root) : iterateIndexedSidecars(surface);
    for await (const sidecarPath of sidecars) {
      const source = await addSource(sidecarPath, surface);
      if (options.firstOnly)
        return {
          sources: [source],
          surfaces,
        };
    }
  }
  return {
    sources: [...sources.values()].toSorted((a, b) => a.sidecarPath.localeCompare(b.sidecarPath)),
    surfaces,
  };
}
async function readLegacySessionIndex(storePath) {
  let contents;
  try {
    contents = await fs.readFile(storePath, "utf8");
  } catch (error) {
    const code = error.code;
    return code === "ENOENT"
      ? { entries: [] }
      : { failure: `session index ${storePath} could not be read${code ? ` (${code})` : ""}` };
  }
  let raw;
  try {
    raw = JSON.parse(contents);
  } catch {
    return { failure: `session index ${storePath} could not be read (invalid JSON)` };
  }
  if (!isRecord(raw)) return { failure: `session index ${storePath} has invalid entries` };
  const entries = [];
  for (const [sessionKey, value] of Object.entries(raw)) {
    if (!isRecord(value)) return { failure: `session index ${storePath} has invalid entries` };
    if (value.sessionId === void 0) continue;
    const sessionId = typeof value.sessionId === "string" ? value.sessionId.trim() : "";
    const sessionFile = value.sessionFile;
    const lifecycleRevision = value.lifecycleRevision;
    const agentHarnessId = value.agentHarnessId;
    if (
      !isSafeLegacySessionId(value.sessionId) ||
      (sessionFile !== void 0 && typeof sessionFile !== "string") ||
      (lifecycleRevision !== void 0 && typeof lifecycleRevision !== "string") ||
      (agentHarnessId !== void 0 && typeof agentHarnessId !== "string")
    )
      return { failure: `session index ${storePath} has invalid entries` };
    entries.push({
      sessionKey,
      entry: {
        sessionId,
        ...(typeof sessionFile === "string" ? { sessionFile } : {}),
        ...(typeof lifecycleRevision === "string" ? { lifecycleRevision } : {}),
        ...(typeof agentHarnessId === "string" ? { agentHarnessId } : {}),
        ...(typeof value.updatedAt === "number" &&
        Number.isFinite(value.updatedAt) &&
        value.updatedAt >= 0
          ? { updatedAt: value.updatedAt }
          : {}),
      },
    });
  }
  return { entries };
}
async function* iterateIndexedSidecars(surface) {
  for (const storePath of surface.storePaths) {
    const index = await readLegacySessionIndex(storePath);
    if ("failure" in index) continue;
    for (const { entry } of index.entries) {
      if ((entry.sessionFile?.trim() ?? "").startsWith("sqlite:")) continue;
      let transcriptPath;
      try {
        transcriptPath = await resolveLegacySessionFileLocator(
          path.dirname(storePath),
          entry,
          entry.sessionId,
        );
      } catch {
        continue;
      }
      const sidecarPath = `${transcriptPath}${LEGACY_BINDING_SUFFIX}`;
      if (await isRegularFile(sidecarPath)) yield sidecarPath;
    }
  }
}
async function* walkSidecars(root) {
  const pending = [
    {
      directory: root,
      depth: 0,
    },
  ];
  while (pending.length > 0) {
    const current = pending.pop();
    for (const entry of (await readDirectoryEntries(current.directory)).toSorted((a, b) =>
      a.name.localeCompare(b.name),
    )) {
      if (entry.isSymbolicLink()) continue;
      const entryPath = path.join(current.directory, entry.name);
      if (entry.isFile() && entry.name.endsWith(LEGACY_BINDING_SUFFIX)) yield entryPath;
      else if (entry.isDirectory() && current.depth < MAX_SESSION_DIRECTORY_DEPTH)
        pending.push({
          directory: entryPath,
          depth: current.depth + 1,
        });
    }
  }
}
async function collectBindingOwners(sources, surfaces, params) {
  const sourcePaths = new Set(
    await Promise.all(sources.map((source) => canonicalizePath(source.transcriptPath))),
  );
  const owners = /* @__PURE__ */ new Map();
  const storePaths = new Set(surfaces.flatMap((surface) => [...surface.storePaths]));
  const storeAgentIds = /* @__PURE__ */ new Map();
  for (const surface of surfaces)
    for (const storePath of surface.storePaths) {
      const agents = storeAgentIds.get(storePath) ?? /* @__PURE__ */ new Set();
      for (const agentId of surface.agentIds) agents.add(agentId);
      storeAgentIds.set(storePath, agents);
    }
  const failures = [];
  for (const storePath of storePaths) {
    const canonicalStorePath = await canonicalizePath(storePath);
    const index = await readLegacySessionIndex(storePath);
    if ("failure" in index) {
      failures.push(index.failure);
      continue;
    }
    const sessionsDir = path.dirname(storePath);
    for (const { sessionKey, entry } of index.entries) {
      const sessionId = entry.sessionId;
      const agentId = resolveLegacyBindingOwnerAgentId({
        sessionKey,
        config: params.config,
        storeAgentIds: storeAgentIds.get(storePath),
      });
      let legacyTranscriptPath;
      let canonicalLegacyTranscriptPath;
      try {
        legacyTranscriptPath = await resolveLegacySessionFileLocator(sessionsDir, entry, sessionId);
        canonicalLegacyTranscriptPath = await canonicalizePath(legacyTranscriptPath);
      } catch {
        failures.push(`session index ${storePath} has an invalid locator for ${sessionKey}`);
        continue;
      }
      if (!sourcePaths.has(canonicalLegacyTranscriptPath)) continue;
      const owner = {
        agentId,
        sessionId,
        sessionKey,
        storePath,
        transcriptPath: legacyTranscriptPath,
        ...(entry.lifecycleRevision ? { lifecycleRevision: entry.lifecycleRevision } : {}),
        ...(entry.agentHarnessId?.trim() ? { agentHarnessId: entry.agentHarnessId.trim() } : {}),
        ...(entry.updatedAt !== void 0 ? { updatedAt: entry.updatedAt } : {}),
      };
      const candidates = owners.get(canonicalLegacyTranscriptPath) ?? /* @__PURE__ */ new Map();
      const ownerKey = `${agentId}\0${sessionId}\0${sessionKey}\0${canonicalStorePath}`;
      const configuredStorePath = resolveStorePath(params.config.session?.store, {
        agentId,
        env: params.env,
      });
      if (!candidates.has(ownerKey) || storePath === configuredStorePath)
        candidates.set(ownerKey, owner);
      owners.set(canonicalLegacyTranscriptPath, candidates);
    }
  }
  return {
    owners: new Map([...owners].map(([key, values]) => [key, [...values.values()]])),
    failures,
  };
}
async function resolveLegacySessionFileLocator(sessionsDir, entry, sessionId) {
  const base = path.resolve(sessionsDir);
  const fallback = path.join(base, `${sessionId}.jsonl`);
  const sessionFile = entry.sessionFile?.trim();
  if (!sessionFile) return fallback;
  const candidate = path.resolve(base, sessionFile);
  const [canonicalBase, canonicalCandidate] = await Promise.all([
    canonicalizePathForContainment(base),
    canonicalizePathForContainment(candidate),
  ]);
  if (!isPathWithin(canonicalBase, canonicalCandidate))
    throw new Error("legacy session file locator escapes its session directory");
  return candidate;
}
function resolveLegacyBindingOwnerAgentId(params) {
  if (params.sessionKey.trim().toLowerCase().startsWith("agent:"))
    return resolveSessionAgentIds({
      sessionKey: params.sessionKey,
      config: params.config,
    }).sessionAgentId;
  const storeAgentId = params.storeAgentIds?.size === 1 ? [...params.storeAgentIds][0] : void 0;
  return resolveSessionAgentIds({
    sessionKey: params.sessionKey,
    config: params.config,
    ...(storeAgentId ? { agentId: storeAgentId } : {}),
  }).sessionAgentId;
}
function copyBindingForSession(stored, sessionId) {
  return stored.state === "active"
    ? {
        version: 1,
        state: "active",
        binding: stored.binding,
        sessionId,
      }
    : {
        version: 1,
        state: "cleared",
        sessionId,
        ...(stored.retired ? { retired: true } : {}),
      };
}
async function migrateSource(source, candidates, params, store) {
  let importedKeys = 0;
  const retain = (reason) => ({
    archived: false,
    importedKeys,
    warning: `Left Codex binding sidecar in place because ${reason}: ${source.sidecarPath}`,
  });
  const retainNotice = (reason) => ({
    archived: false,
    importedKeys,
    notice: `Left Codex binding sidecar in place because ${reason}: ${source.sidecarPath}`,
  });
  const owner = candidates.length === 1 ? candidates[0] : void 0;
  try {
    return await withFileLock(source.sidecarPath, LEGACY_BINDING_LOCK_OPTIONS, async () => {
      const [contents, stat] = await Promise.all([
        fs.readFile(source.sidecarPath, "utf8"),
        fs.stat(source.sidecarPath),
      ]);
      const raw = JSON.parse(contents);
      const [
        {
          bindingStoreKey,
          createStoredCodexAppServerBinding,
          normalizeStoredCodexAppServerBindingFingerprints,
          readStoredCodexAppServerBinding,
        },
        { legacyCodexConversationBindingId },
      ] = await Promise.all([
        import("../../session-binding-C8Ve8W4V.js"),
        import("../../conversation-binding-data-BgxGv7nh.js"),
      ]);
      const agentId =
        owner?.agentId ?? (source.agentIds.size === 1 ? [...source.agentIds][0] : void 0);
      const baseStored = createStoredCodexAppServerBinding(raw, {
        now: stat.mtime.toISOString(),
        lookup: {
          config: params.config,
          ...(agentId ? { agentDir: resolveAgentDir(params.config, agentId, params.env) } : {}),
        },
      });
      if (!baseStored) return retain("its binding is invalid");
      if (candidates.length > 1)
        return retain(`${candidates.length} matching session owners make ownership ambiguous`);
      if (owner?.agentHarnessId && owner.agentHarnessId !== CODEX_AGENT_HARNESS_ID)
        return retainNotice(`its session is owned by agent harness ${owner.agentHarnessId}`);
      const sourceSessionFile =
        typeof raw.sessionFile === "string" && raw.sessionFile.trim()
          ? raw.sessionFile
          : source.transcriptPath;
      const ownerSessionFile =
        typeof raw.sessionFile === "string" && raw.sessionFile.trim()
          ? raw.sessionFile
          : owner?.transcriptPath;
      const conversationKeys = [
        sourceSessionFile,
        ...(ownerSessionFile && ownerSessionFile !== sourceSessionFile ? [ownerSessionFile] : []),
      ].map((sessionFile) =>
        bindingStoreKey({
          kind: "conversation",
          bindingId: legacyCodexConversationBindingId(sessionFile),
        }),
      );
      const normalizeStoredRow = async (key, current) => {
        const parsed = readStoredCodexAppServerBinding(current);
        if (!parsed) return { warning: `canonical plugin state is invalid at ${key}` };
        const normalized = normalizeStoredCodexAppServerBindingFingerprints(parsed);
        if (!normalized) return { warning: `canonical plugin state is invalid at ${key}` };
        if (isDeepStrictEqual(parsed, normalized)) return { value: parsed };
        if (parsed.lease && parsed.lease.expiresAt > Date.now())
          return { warning: `canonical plugin state is leased at ${key}` };
        const update = store.update;
        if (!update) return { warning: `canonical plugin state could not be normalized at ${key}` };
        await update(key, (candidate) => {
          const candidateParsed = readStoredCodexAppServerBinding(candidate);
          if (!candidateParsed || !isDeepStrictEqual(candidateParsed, parsed)) return;
          return normalized;
        });
        const persisted = readStoredCodexAppServerBinding(await store.lookup(key));
        if (!persisted || !isDeepStrictEqual(persisted, normalized))
          return { warning: `canonical plugin state changed at ${key}` };
        importedKeys++;
        return { value: normalized };
      };
      let currentConversation;
      for (const key of conversationKeys) {
        const current = await store.lookup(key);
        if (current === void 0) continue;
        const result = await normalizeStoredRow(key, current);
        if (result.warning || !result.value)
          return retain(result.warning ?? `canonical plugin state is invalid at ${key}`);
        currentConversation ??= result.value;
      }
      const stored = currentConversation ?? baseStored;
      const sessionKey = owner
        ? bindingStoreKey({
            kind: "session",
            agentId: owner.agentId,
            sessionId: owner.sessionId,
            sessionKey: owner.sessionKey,
          })
        : void 0;
      const conversationEntries = conversationKeys.map((key) => ({
        key,
        value: stored,
      }));
      const sessionEntry =
        owner && sessionKey
          ? {
              key: sessionKey,
              value: copyBindingForSession(stored, owner.sessionId),
            }
          : void 0;
      const entries = [...conversationEntries, ...(sessionEntry ? [sessionEntry] : [])];
      const hasExpected = (value, target) => {
        const parsed = readStoredCodexAppServerBinding(value);
        if (!parsed) return false;
        return target.state === "cleared"
          ? parsed.state === "cleared" &&
              parsed.sessionId === target.sessionId &&
              parsed.retired === target.retired
          : parsed.state === "active" &&
              parsed.sessionId === target.sessionId &&
              isDeepStrictEqual(parsed.binding, target.binding);
      };
      for (const entry of entries) {
        const current = await store.lookup(entry.key);
        if (current === void 0) continue;
        const result = await normalizeStoredRow(entry.key, current);
        if (result.warning || !result.value)
          return retain(result.warning ?? `canonical plugin state is invalid at ${entry.key}`);
        if (!hasExpected(result.value, entry.value))
          return retain(`canonical plugin state changed at ${entry.key}`);
      }
      for (const entry of entries) {
        if (await store.registerIfAbsent(entry.key, entry.value)) importedKeys++;
        if (!hasExpected(await store.lookup(entry.key), entry.value))
          return retain(`canonical plugin state changed at ${entry.key}`);
      }
      if (owner) {
        const ownershipWarning = await recordSessionOwner(owner, params.env);
        if (ownershipWarning) {
          if (sessionEntry?.value.state === "active") {
            const update = store.update;
            if (!update)
              return retain(`${ownershipWarning}; its stale session binding could not be retired`);
            await update(sessionEntry.key, (current) => {
              const parsed = readStoredCodexAppServerBinding(current);
              if (parsed?.lease && parsed.lease.expiresAt > Date.now()) return;
              if (!hasExpected(current, sessionEntry.value)) return;
              return {
                version: 1,
                state: "cleared",
                sessionId: owner.sessionId,
                retired: true,
              };
            });
            if (hasExpected(await store.lookup(sessionEntry.key), sessionEntry.value))
              return retain(`${ownershipWarning}; its stale session binding could not be retired`);
          }
          return retainNotice(ownershipWarning);
        }
        for (const entry of entries)
          if (!hasExpected(await store.lookup(entry.key), entry.value))
            return retain(`canonical plugin state changed at ${entry.key}`);
      }
      await archiveBindingSidecar(source.sidecarPath);
      return {
        archived: true,
        importedKeys,
      };
    });
  } catch (error) {
    if (error.code === "ENOENT" && !(await pathExists(source.sidecarPath)))
      return {
        archived: true,
        importedKeys,
      };
    return retain(`migration or archiving failed: ${String(error)}`);
  }
}
async function recordSessionOwner(owner, env) {
  const currentIndex = await readLegacySessionIndex(owner.storePath);
  if ("failure" in currentIndex) return "its legacy session owner could not be revalidated";
  const currentOwner = currentIndex.entries.find(
    ({ sessionKey }) => sessionKey === owner.sessionKey,
  );
  if (!currentOwner || currentOwner.entry.sessionId !== owner.sessionId)
    return "its session owner changed before Codex ownership could be recorded";
  let currentTranscriptPath;
  try {
    currentTranscriptPath = await resolveLegacySessionFileLocator(
      path.dirname(owner.storePath),
      currentOwner.entry,
      currentOwner.entry.sessionId,
    );
  } catch {
    return "its session owner changed before Codex ownership could be recorded";
  }
  if (
    (await canonicalizePath(currentTranscriptPath)) !==
      (await canonicalizePath(owner.transcriptPath)) ||
    currentOwner.entry.lifecycleRevision !== owner.lifecycleRevision
  )
    return "its session owner changed before Codex ownership could be recorded";
  const legacyHarnessId = currentOwner.entry.agentHarnessId?.trim();
  if (currentOwner.entry.agentHarnessId !== void 0 && !legacyHarnessId)
    return "its session owner changed before Codex ownership could be recorded";
  if (legacyHarnessId && legacyHarnessId !== CODEX_AGENT_HARNESS_ID)
    return `its session is owned by agent harness ${legacyHarnessId}`;
  let observedForeignHarness;
  const updated = await patchSessionEntry({
    agentId: owner.agentId,
    env,
    fallbackEntry: {
      sessionId: owner.sessionId,
      updatedAt: currentOwner.entry.updatedAt ?? owner.updatedAt ?? 0,
      ...(owner.lifecycleRevision ? { lifecycleRevision: owner.lifecycleRevision } : {}),
    },
    preserveActivity: true,
    requireWriteSuccess: true,
    skipMaintenance: true,
    storePath: owner.storePath,
    sessionKey: owner.sessionKey,
    update: (entry) => {
      if (
        entry.sessionId.trim() !== owner.sessionId ||
        entry.lifecycleRevision !== owner.lifecycleRevision
      )
        return null;
      const harnessId =
        typeof entry.agentHarnessId === "string" ? entry.agentHarnessId.trim() : void 0;
      if (entry.agentHarnessId !== void 0 && !harnessId) return null;
      if (harnessId && harnessId !== CODEX_AGENT_HARNESS_ID) {
        observedForeignHarness = harnessId;
        return null;
      }
      return { agentHarnessId: CODEX_AGENT_HARNESS_ID };
    },
  });
  if (!updated)
    return observedForeignHarness
      ? `its session is owned by agent harness ${observedForeignHarness}`
      : "its session owner changed before Codex ownership could be recorded";
  if (
    updated.sessionId.trim() !== owner.sessionId ||
    updated.lifecycleRevision !== owner.lifecycleRevision
  )
    return "its session owner changed before Codex ownership could be recorded";
  const harnessId = updated.agentHarnessId?.trim();
  return harnessId === CODEX_AGENT_HARNESS_ID
    ? void 0
    : harnessId
      ? `its session is owned by agent harness ${harnessId}`
      : "Codex harness ownership could not be recorded on its session";
}
async function readDirectoryEntries(directory) {
  try {
    return await fs.readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (["EACCES", "ENOENT", "ENOTDIR", "EPERM"].includes(error.code ?? "")) return [];
    throw error;
  }
}
async function isRegularFile(filePath) {
  try {
    return (await fs.stat(filePath)).isFile();
  } catch {
    return false;
  }
}
function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function isSafeLegacySessionId(value) {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  return (
    trimmed.length > 0 && trimmed.length <= 255 && /^[A-Za-z0-9][A-Za-z0-9._:@-]*$/.test(trimmed)
  );
}
function isPathWithin(root, candidate) {
  const relative = path.relative(root, candidate);
  return (
    relative === "" ||
    (relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative))
  );
}
async function canonicalizePath(filePath) {
  try {
    return await fs.realpath(filePath);
  } catch {
    return path.resolve(filePath);
  }
}
async function canonicalizePathForContainment(filePath) {
  const resolved = path.resolve(filePath);
  const suffix = [];
  let probe = resolved;
  while (true)
    try {
      const realProbe = await fs.realpath(probe);
      return suffix.length === 0 ? realProbe : path.join(realProbe, ...suffix.toReversed());
    } catch {
      const parent = path.dirname(probe);
      if (parent === probe) return resolved;
      suffix.push(path.basename(probe));
      probe = parent;
    }
}
async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
const stateMigrations = [
  {
    id: "codex-app-server-sidecars-to-plugin-state",
    label: "Codex app-server thread bindings",
    async detectLegacyState(params) {
      const { sources } = await collectLegacyBindingSources(params, { firstOnly: true });
      return sources.length > 0
        ? {
            preview: [
              `- Codex app-server bindings: legacy sidecar -> plugin state (${CODEX_APP_SERVER_BINDING_NAMESPACE})`,
            ],
          }
        : null;
    },
    async migrateLegacyState(params) {
      const changes = [];
      const warnings = [];
      const notices = [];
      const { sources, surfaces } = await collectLegacyBindingSources(params);
      if (sources.length === 0)
        return {
          changes,
          warnings,
        };
      const ownerCollection = await collectBindingOwners(sources, surfaces, params);
      if (ownerCollection.failures.length > 0) {
        warnings.push(
          `Left ${sources.length} Codex binding sidecar(s) in place because session ownership is indeterminate: ${ownerCollection.failures.join("; ")}`,
        );
        return {
          changes,
          warnings,
        };
      }
      const store = params.context.openPluginStateKeyedStore({
        namespace: CODEX_APP_SERVER_BINDING_NAMESPACE,
        maxEntries: CODEX_APP_SERVER_BINDING_MAX_ENTRIES,
        overflowPolicy: "reject-new",
      });
      let migrated = 0;
      let partialImports = 0;
      for (const source of sources) {
        const result = await migrateSource(
          source,
          ownerCollection.owners.get(await canonicalizePath(source.transcriptPath)) ?? [],
          params,
          store,
        );
        if (result.warning) warnings.push(result.warning);
        if (result.notice) notices.push(result.notice);
        if (result.archived) migrated++;
        else partialImports += result.importedKeys;
      }
      if (migrated > 0)
        changes.push(
          `Migrated ${migrated} Codex app-server binding sidecar(s) to plugin state and archived the legacy sources`,
        );
      if (partialImports > 0)
        changes.push(
          `Migrated ${partialImports} safe Codex app-server binding row(s) to plugin state; retained legacy sidecars needing review`,
        );
      return {
        changes,
        warnings,
        ...(notices.length > 0 ? { notices } : {}),
      };
    },
  },
];
//#endregion
//#region extensions/codex/doctor-contract-api.ts
function asRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}
function hasRetiredDynamicToolsProfile(value) {
  return Object.hasOwn(asRecord(value) ?? {}, "codexDynamicToolsProfile");
}
function hasLegacyPluginDestructivePolicy(value) {
  const codexPlugins = asRecord(value);
  if (!codexPlugins) return false;
  if (codexPlugins.allow_destructive_actions === "on-request") return true;
  const plugins = asRecord(codexPlugins.plugins);
  return Object.values(plugins ?? {}).some(
    (plugin) => asRecord(plugin)?.allow_destructive_actions === "on-request",
  );
}
function hasRetiredOnFailureApprovalPolicy(value) {
  return asRecord(value)?.approvalPolicy === "on-failure";
}
/** Legacy Codex config keys that doctor should report or repair. */
const legacyConfigRules = [
  {
    path: ["plugins", "entries", "codex", "config"],
    message:
      'plugins.entries.codex.config.codexDynamicToolsProfile is retired; Codex app-server always keeps Codex-native workspace tools native. Run "openclaw doctor --fix".',
    match: hasRetiredDynamicToolsProfile,
  },
  {
    path: ["plugins", "entries", "codex", "config", "codexPlugins"],
    message:
      'plugins.entries.codex.config.codexPlugins.allow_destructive_actions="on-request" was renamed to "auto". Run "openclaw doctor --fix".',
    match: hasLegacyPluginDestructivePolicy,
  },
  {
    path: ["plugins", "entries", "codex", "config", "appServer"],
    message:
      'plugins.entries.codex.config.appServer.approvalPolicy="on-failure" was retired by Codex 0.143; use "on-request". Run "openclaw doctor --fix".',
    match: hasRetiredOnFailureApprovalPolicy,
  },
];
/**
 * Removes retired Codex plugin config keys while preserving unrelated config.
 */
function normalizeCompatibilityConfig({ cfg }) {
  const rawPluginConfig = asRecord(asRecord(cfg.plugins?.entries?.codex)?.config);
  const rawCodexPlugins = asRecord(rawPluginConfig?.codexPlugins);
  const rawAppServer = asRecord(rawPluginConfig?.appServer);
  const shouldRemoveDynamicToolsProfile =
    rawPluginConfig !== null && hasRetiredDynamicToolsProfile(rawPluginConfig);
  const shouldRewriteDestructivePolicy = hasLegacyPluginDestructivePolicy(rawCodexPlugins);
  const shouldRewriteApprovalPolicy = hasRetiredOnFailureApprovalPolicy(rawAppServer);
  if (
    !rawPluginConfig ||
    (!shouldRemoveDynamicToolsProfile &&
      !shouldRewriteDestructivePolicy &&
      !shouldRewriteApprovalPolicy)
  )
    return {
      config: cfg,
      changes: [],
    };
  const nextConfig = structuredClone(cfg);
  const nextPluginConfig = asRecord(
    asRecord(asRecord(asRecord(nextConfig.plugins)?.entries)?.codex)?.config,
  );
  if (!nextPluginConfig)
    return {
      config: cfg,
      changes: [],
    };
  const changes = [];
  if (shouldRemoveDynamicToolsProfile) {
    delete nextPluginConfig.codexDynamicToolsProfile;
    changes.push(
      "Removed retired plugins.entries.codex.config.codexDynamicToolsProfile; Codex app-server always keeps Codex-native workspace tools native.",
    );
  }
  if (shouldRewriteDestructivePolicy) {
    const nextCodexPlugins = asRecord(nextPluginConfig.codexPlugins);
    if (nextCodexPlugins?.allow_destructive_actions === "on-request")
      nextCodexPlugins.allow_destructive_actions = "auto";
    const nextPluginPolicies = asRecord(nextCodexPlugins?.plugins);
    for (const plugin of Object.values(nextPluginPolicies ?? {})) {
      const nextPlugin = asRecord(plugin);
      if (nextPlugin?.allow_destructive_actions === "on-request")
        nextPlugin.allow_destructive_actions = "auto";
    }
    changes.push(
      'Renamed plugins.entries.codex.config.codexPlugins allow_destructive_actions="on-request" values to "auto".',
    );
  }
  if (shouldRewriteApprovalPolicy) {
    const nextAppServer = asRecord(nextPluginConfig.appServer);
    if (nextAppServer?.approvalPolicy === "on-failure") nextAppServer.approvalPolicy = "on-request";
    changes.push(
      'Renamed plugins.entries.codex.config.appServer.approvalPolicy="on-failure" to "on-request".',
    );
  }
  return {
    config: nextConfig,
    changes,
  };
}
/** Session/auth ownership metadata used by doctor route-state checks. */
const sessionRouteStateOwners = [
  {
    id: "codex",
    label: "Codex",
    providerIds: ["codex", "codex-cli", "openai-codex"],
    runtimeIds: ["codex", "codex-cli"],
    cliSessionKeys: ["codex-cli"],
    authProfilePrefixes: ["codex:", "codex-cli:", "openai-codex:"],
  },
];
//#endregion
export {
  legacyConfigRules,
  normalizeCompatibilityConfig,
  sessionRouteStateOwners,
  stateMigrations,
};
