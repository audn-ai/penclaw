import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import "./utils-DtcDeqWS.js";
import * as tar from "tar";
import { n as buildBackupArchivePath } from "./backup-shared-BWnwOu6q.js";
import { n as formatDiskSpaceBytes, r as tryReadDiskSpace } from "./disk-space-CzASwJhY.js";
import { i as loadSqliteVecExtension } from "./engine-storage-DV2x5DKD.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { t as requireNodeSqlite } from "./node-sqlite-BJtdZavS.js";
import { k as assertSqliteIntegrity } from "./openclaw-state-db-Bsa8Tv1Z.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { i as writeRuntimeJson } from "./runtime-Bz6o617W.js";
import { p as readStringValue } from "./string-coerce-DW4mBlAt.js";
//#region src/commands/backup-verify.ts
const WINDOWS_ABSOLUTE_ARCHIVE_PATH_RE = /^[A-Za-z]:[\\/]/;
const MAX_MANIFEST_BYTES = 1024 * 1024;
const MAX_SQLITE_SNAPSHOT_EXTRACT_BYTES = 64 * 1024 * 1024 * 1024;
const SQLITE_SNAPSHOT_FREE_SPACE_RESERVE_BYTES = 256 * 1024 * 1024;
const SQLITE_SNAPSHOT_SIDECAR_SUFFIXES = ["-wal", "-shm", "-journal"];
const SQLITE_BACKUP_EXCLUDED_SUFFIXES = [".reindex-lock.sqlite"];
const SQLITE_BACKUP_REINDEX_TRANSIENT_PATTERN =
  /\.sqlite\.(?:backup|memory-reindex|tmp)-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu;
function stripTrailingSlashes(value) {
  return value.replace(/\/+$/u, "");
}
function normalizeArchivePath(entryPath, label) {
  const trimmed = stripTrailingSlashes(entryPath.trim());
  if (!trimmed) throw new Error(`${label} is empty.`);
  if (trimmed.startsWith("/") || WINDOWS_ABSOLUTE_ARCHIVE_PATH_RE.test(trimmed))
    throw new Error(`${label} must be relative: ${entryPath}`);
  if (trimmed.includes("\\")) throw new Error(`${label} must use forward slashes: ${entryPath}`);
  if (trimmed.split("/").some((segment) => segment === "." || segment === ".."))
    throw new Error(`${label} contains path traversal segments: ${entryPath}`);
  const normalized = stripTrailingSlashes(path.posix.normalize(trimmed));
  if (!normalized || normalized === "." || normalized === ".." || normalized.startsWith("../"))
    throw new Error(`${label} resolves outside the archive root: ${entryPath}`);
  return normalized;
}
function normalizeArchiveRoot(rootName) {
  const normalized = normalizeArchivePath(rootName, "Backup manifest archiveRoot");
  if (normalized.includes("/"))
    throw new Error(`Backup manifest archiveRoot must be a single path segment: ${rootName}`);
  return normalized;
}
function isArchivePathWithin(child, parent) {
  const relative = path.posix.relative(parent, child);
  return relative === "" || (!relative.startsWith("../") && relative !== "..");
}
function parseManifest(raw) {
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error("Backup manifest is not valid JSON.", { cause: err });
  }
  if (!isRecord(parsed)) throw new Error("Backup manifest must be an object.");
  if (parsed.schemaVersion !== 1)
    throw new Error(`Unsupported backup manifest schemaVersion: ${String(parsed.schemaVersion)}`);
  if (typeof parsed.archiveRoot !== "string" || !parsed.archiveRoot.trim())
    throw new Error("Backup manifest is missing archiveRoot.");
  if (typeof parsed.createdAt !== "string" || !parsed.createdAt.trim())
    throw new Error("Backup manifest is missing createdAt.");
  if (!Array.isArray(parsed.assets)) throw new Error("Backup manifest is missing assets.");
  const assets = [];
  for (const asset of parsed.assets) {
    if (!isRecord(asset)) throw new Error("Backup manifest contains a non-object asset.");
    if (typeof asset.kind !== "string" || !asset.kind.trim())
      throw new Error("Backup manifest asset is missing kind.");
    if (typeof asset.sourcePath !== "string" || !asset.sourcePath.trim())
      throw new Error("Backup manifest asset is missing sourcePath.");
    if (typeof asset.archivePath !== "string" || !asset.archivePath.trim())
      throw new Error("Backup manifest asset is missing archivePath.");
    assets.push({
      kind: asset.kind,
      sourcePath: asset.sourcePath,
      archivePath: asset.archivePath,
    });
  }
  return {
    schemaVersion: 1,
    archiveRoot: parsed.archiveRoot,
    createdAt: parsed.createdAt,
    runtimeVersion:
      typeof parsed.runtimeVersion === "string" && parsed.runtimeVersion.trim()
        ? parsed.runtimeVersion
        : "unknown",
    platform: typeof parsed.platform === "string" ? parsed.platform : "unknown",
    nodeVersion: typeof parsed.nodeVersion === "string" ? parsed.nodeVersion : "unknown",
    options: isRecord(parsed.options)
      ? { includeWorkspace: parsed.options.includeWorkspace }
      : void 0,
    paths: isRecord(parsed.paths)
      ? {
          stateDir: readStringValue(parsed.paths.stateDir),
          configPath: readStringValue(parsed.paths.configPath),
          oauthDir: readStringValue(parsed.paths.oauthDir),
          workspaceDirs: Array.isArray(parsed.paths.workspaceDirs)
            ? parsed.paths.workspaceDirs.filter((entry) => typeof entry === "string")
            : void 0,
        }
      : void 0,
    assets,
    skipped: Array.isArray(parsed.skipped) ? parsed.skipped : void 0,
  };
}
async function listArchiveEntries(archivePath) {
  const entries = [];
  await tar.t({
    file: archivePath,
    gzip: true,
    onReadEntry: (entry) => {
      entries.push({
        path: entry.path,
        ...(entry.linkpath ? { linkpath: entry.linkpath } : {}),
        ...(Number.isSafeInteger(entry.size) && entry.size >= 0 ? { size: entry.size } : {}),
        ...(entry.type ? { type: entry.type } : {}),
      });
    },
  });
  return entries;
}
async function extractManifest(params) {
  const limitError = /* @__PURE__ */ new Error(
    `Backup manifest exceeds ${MAX_MANIFEST_BYTES} byte limit.`,
  );
  let manifestContentPromise;
  await tar.t({
    file: params.archivePath,
    gzip: true,
    filter: (entryPath) => entryPath === params.manifestEntryPath,
    onReadEntry: (entry) => {
      manifestContentPromise =
        entry.size > MAX_MANIFEST_BYTES
          ? Promise.resolve(limitError)
          : entry
              .concat()
              .catch((error) => (error instanceof Error ? error : new Error(String(error))));
    },
  });
  if (!manifestContentPromise)
    throw new Error(`Archive is missing manifest entry: ${params.manifestEntryPath}`);
  const content = await manifestContentPromise;
  if (content instanceof Error) throw content;
  return content.toString("utf8");
}
function isRootManifestEntry(entryPath) {
  const parts = entryPath.split("/");
  return parts.length === 2 && parts[0] !== "" && parts[1] === "manifest.json";
}
function verifyManifestAgainstEntries(manifest, entries) {
  const archiveRoot = normalizeArchiveRoot(manifest.archiveRoot);
  const manifestEntryPath = path.posix.join(archiveRoot, "manifest.json");
  const normalizedEntries = [...entries];
  const normalizedEntrySet = new Set(normalizedEntries);
  if (!normalizedEntrySet.has(manifestEntryPath))
    throw new Error(`Archive is missing manifest entry: ${manifestEntryPath}`);
  for (const entry of normalizedEntries)
    if (!isArchivePathWithin(entry, archiveRoot))
      throw new Error(`Archive entry is outside the declared archive root: ${entry}`);
  const payloadRoot = path.posix.join(archiveRoot, "payload");
  for (const asset of manifest.assets) {
    const assetArchivePath = normalizeArchivePath(asset.archivePath, "Backup manifest asset path");
    if (!isArchivePathWithin(assetArchivePath, payloadRoot))
      throw new Error(`Manifest asset path is outside payload root: ${asset.archivePath}`);
    const exact = normalizedEntrySet.has(assetArchivePath);
    const nested = normalizedEntries.some(
      (entry) => entry !== assetArchivePath && isArchivePathWithin(entry, assetArchivePath),
    );
    if (!exact && !nested)
      throw new Error(`Archive is missing payload for manifest asset: ${assetArchivePath}`);
  }
}
function verifyHardlinkTargetsAgainstArchiveRoot(hardlinkTargets, archiveRoot, entries) {
  const normalizedRoot = normalizeArchiveRoot(archiveRoot);
  for (const target of hardlinkTargets) {
    const normalizedTarget = isArchivePathWithin(target.normalized, normalizedRoot)
      ? target.normalized
      : path.posix.join(normalizedRoot, target.normalized);
    if (!isArchivePathWithin(normalizedTarget, normalizedRoot))
      throw new Error(
        `Archive hardlink target is outside the declared archive root: ${target.entryPath} -> ${normalizedTarget}`,
      );
    if (!entries.has(normalizedTarget))
      throw new Error(
        `Archive hardlink target is missing from archive entries: ${target.entryPath} -> ${normalizedTarget}`,
      );
  }
}
function formatResult(result) {
  return [
    `Backup archive OK: ${result.archivePath}`,
    `Archive root: ${result.archiveRoot}`,
    `Created at: ${result.createdAt}`,
    `Runtime version: ${result.runtimeVersion}`,
    `Assets verified: ${result.assetCount}`,
    `Archive entries scanned: ${result.entryCount}`,
  ].join("\n");
}
function findDuplicateNormalizedEntryPath(entries) {
  const seen = /* @__PURE__ */ new Set();
  for (const entry of entries) {
    if (seen.has(entry.normalized)) return entry.normalized;
    seen.add(entry.normalized);
  }
}
function resolvePortableArchivePathKey(value) {
  return value.normalize("NFC").toLowerCase();
}
function findPortableArchiveEntryPathCollision(entries) {
  const seen = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    const key = resolvePortableArchivePathKey(entry.normalized);
    const first = seen.get(key);
    if (first && first !== entry.normalized)
      return {
        first,
        second: entry.normalized,
      };
    seen.set(key, entry.normalized);
  }
}
function isRegularArchiveFile(entryType) {
  return entryType === "File" || entryType === "OldFile" || entryType === "ContiguousFile";
}
function resolveCanonicalStateAssetRoot(manifest) {
  const stateAssets = manifest.assets.filter((asset) => asset.kind === "state");
  if (stateAssets.length === 0) return;
  if (stateAssets.length !== 1)
    throw new Error(
      `Backup manifest must contain at most one state asset; found ${stateAssets.length}.`,
    );
  const stateAsset = stateAssets[0];
  if (!stateAsset) return;
  const stateAssetRoot = normalizeArchivePath(
    stateAsset.archivePath,
    "Backup manifest state asset path",
  );
  if (
    stateAssetRoot !==
    buildBackupArchivePath(normalizeArchiveRoot(manifest.archiveRoot), stateAsset.sourcePath)
  )
    throw new Error("Backup manifest state asset archivePath does not match its sourcePath.");
  return stateAssetRoot;
}
function isSqliteSnapshotRelativePath(relativePath) {
  const portablePath = resolvePortableArchivePathKey(relativePath);
  if (!portablePath.endsWith(".sqlite")) return false;
  if (resolveExpectedSqliteRoleFromRelativePath(relativePath)) return true;
  return (
    !portablePath.split("/").includes("node_modules") &&
    !SQLITE_BACKUP_REINDEX_TRANSIENT_PATTERN.test(relativePath) &&
    !SQLITE_BACKUP_EXCLUDED_SUFFIXES.some((suffix) => portablePath.endsWith(suffix))
  );
}
function resolveSqliteSnapshotSidecarDatabasePath(relativePath) {
  const portablePath = resolvePortableArchivePathKey(relativePath);
  for (const suffix of SQLITE_SNAPSHOT_SIDECAR_SUFFIXES)
    if (portablePath.endsWith(suffix)) {
      const databasePath = relativePath.slice(0, -suffix.length);
      return isSqliteSnapshotRelativePath(databasePath) ? databasePath : void 0;
    }
}
function assertCanonicalSqlitePathCasing(relativePath, archivePath) {
  const segments = relativePath.split("/");
  const isGlobalAlias =
    resolvePortableArchivePathKey(relativePath) === "state/openclaw.sqlite" &&
    relativePath !== "state/openclaw.sqlite";
  const isAgentAlias =
    segments.length === 4 &&
    segments[0]?.toLowerCase() === "agents" &&
    Boolean(segments[1]) &&
    segments[2]?.toLowerCase() === "agent" &&
    segments[3]?.toLowerCase() === "openclaw-agent.sqlite" &&
    (segments[0] !== "agents" ||
      segments[2] !== "agent" ||
      segments[3] !== "openclaw-agent.sqlite");
  if (isGlobalAlias || isAgentAlias)
    throw new Error(`Backup contains a case-mangled canonical SQLite path: ${archivePath}`);
}
function listSqliteSnapshotEntries(manifest, entries) {
  const declaredStateAssetRoots = manifest.assets
    .filter((asset) => asset.kind === "state")
    .map((asset) => normalizeArchivePath(asset.archivePath, "Backup manifest state asset path"));
  for (const root of declaredStateAssetRoots) {
    const portableRoot = resolvePortableArchivePathKey(root);
    for (const entry of entries) {
      const isExactStateEntry = isArchivePathWithin(entry.normalized, root);
      if (
        isArchivePathWithin(resolvePortableArchivePathKey(entry.normalized), portableRoot) &&
        !isExactStateEntry
      )
        throw new Error(`Backup contains a case-mangled state asset path: ${entry.normalized}`);
    }
  }
  if (
    !entries.some((entry) =>
      declaredStateAssetRoots.some((root) => {
        if (!isArchivePathWithin(entry.normalized, root)) return false;
        const relativePath = path.posix.relative(root, entry.normalized);
        return (
          isSqliteSnapshotRelativePath(relativePath) ||
          resolveSqliteSnapshotSidecarDatabasePath(relativePath) !== void 0
        );
      }),
    )
  )
    return [];
  const stateAssetRoot = resolveCanonicalStateAssetRoot(manifest);
  if (!stateAssetRoot) return [];
  for (const entry of entries) {
    if (!isArchivePathWithin(entry.normalized, stateAssetRoot)) continue;
    const relativePath = path.posix.relative(stateAssetRoot, entry.normalized);
    assertCanonicalSqlitePathCasing(relativePath, entry.normalized);
    if (resolveSqliteSnapshotSidecarDatabasePath(relativePath))
      throw new Error(`Backup contains a SQLite snapshot sidecar: ${entry.normalized}`);
  }
  return entries.flatMap((entry) => {
    if (!isArchivePathWithin(entry.normalized, stateAssetRoot)) return [];
    if (!isSqliteSnapshotRelativePath(path.posix.relative(stateAssetRoot, entry.normalized)))
      return [];
    const candidate = {
      ...entry,
      stateAssetRoot,
    };
    if (!resolveExpectedSqliteRole(candidate) && !isRegularArchiveFile(entry.type)) return [];
    return [candidate];
  });
}
function resolveExpectedSqliteRole(entry) {
  return resolveExpectedSqliteRoleFromRelativePath(
    path.posix.relative(entry.stateAssetRoot, entry.normalized),
  );
}
function resolveExpectedSqliteRoleFromRelativePath(relativePath) {
  if (relativePath === "state/openclaw.sqlite") return "global";
  const segments = relativePath.split("/");
  if (
    segments.length === 4 &&
    segments[0] === "agents" &&
    segments[1] &&
    segments[2] === "agent" &&
    segments[3] === "openclaw-agent.sqlite"
  )
    return "agent";
}
function resolveSqliteExtractionBytes(entries) {
  let totalBytes = 0;
  for (const entry of entries) {
    if (!Number.isSafeInteger(entry.size) || (entry.size ?? -1) < 0)
      throw new Error(`SQLite snapshot has an invalid archive size: ${entry.normalized}`);
    if (entry.size === 0) throw new Error(`SQLite snapshot is empty: ${entry.normalized}`);
    totalBytes += entry.size ?? 0;
    if (!Number.isSafeInteger(totalBytes))
      throw new Error("SQLite snapshot extraction size exceeds the supported integer range.");
  }
  return totalBytes;
}
function assertSqliteExtractionBudget(params) {
  const totalBytes = resolveSqliteExtractionBytes(params.entries);
  if (totalBytes > MAX_SQLITE_SNAPSHOT_EXTRACT_BYTES)
    throw new Error(
      `SQLite snapshots require ${formatDiskSpaceBytes(totalBytes)} of extraction space; the verification limit is ${formatDiskSpaceBytes(MAX_SQLITE_SNAPSHOT_EXTRACT_BYTES)}.`,
    );
  const diskSpace = (params.readDiskSpace ?? tryReadDiskSpace)(params.tempRoot);
  if (diskSpace && totalBytes + SQLITE_SNAPSHOT_FREE_SPACE_RESERVE_BYTES > diskSpace.availableBytes)
    throw new Error(
      `SQLite snapshots require ${formatDiskSpaceBytes(totalBytes)} of extraction space, but only ${formatDiskSpaceBytes(diskSpace.availableBytes)} is available near ${params.tempRoot}; verification reserves ${formatDiskSpaceBytes(SQLITE_SNAPSHOT_FREE_SPACE_RESERVE_BYTES)} for the host.`,
    );
}
function assertExpectedSqliteRole(database, archivePath, expectedRole) {
  if (
    database.prepare("SELECT type FROM sqlite_schema WHERE name = 'schema_meta'").get()?.type !==
    "table"
  )
    throw new Error(`SQLite snapshot ${archivePath} is missing the expected schema_meta table.`);
  const metadata = database
    .prepare("SELECT role FROM schema_meta WHERE meta_key = 'primary'")
    .get();
  const actualRole = typeof metadata?.role === "string" ? metadata.role : "missing";
  if (actualRole !== expectedRole)
    throw new Error(
      `SQLite snapshot ${archivePath} has role ${actualRole}; expected ${expectedRole}.`,
    );
}
async function assertSqliteSnapshotFileShape(extractedPath, archivePath, expectedSize) {
  const header = Buffer.alloc(100);
  const handle = await fs.open(extractedPath, "r");
  try {
    const { bytesRead } = await handle.read(header, 0, header.byteLength, 0);
    if (
      bytesRead !== header.byteLength ||
      header.subarray(0, 16).toString("utf8") !== "SQLite format 3\0"
    )
      throw new Error(`SQLite snapshot ${archivePath} has an invalid database header.`);
  } finally {
    await handle.close();
  }
  const encodedPageSize = header.readUInt16BE(16);
  const pageSize = encodedPageSize === 1 ? 65536 : encodedPageSize;
  if (
    !(pageSize >= 512 && pageSize <= 65536 && (pageSize & (pageSize - 1)) === 0) ||
    expectedSize % pageSize !== 0
  )
    throw new Error(`SQLite snapshot ${archivePath} has an invalid page layout.`);
  const changeCounter = header.readUInt32BE(24);
  const declaredPageCount = header.readUInt32BE(28);
  const versionValidFor = header.readUInt32BE(92);
  if (
    declaredPageCount !== 0 &&
    changeCounter === versionValidFor &&
    declaredPageCount !== expectedSize / pageSize
  )
    throw new Error(`SQLite snapshot ${archivePath} has an invalid page layout.`);
}
async function verifySqliteSnapshots(params) {
  const sqliteEntries = listSqliteSnapshotEntries(params.manifest, params.entries);
  if (sqliteEntries.length === 0) return;
  for (const entry of sqliteEntries)
    if (!isRegularArchiveFile(entry.type))
      throw new Error(`SQLite snapshot must be a regular archive file: ${entry.normalized}`);
  const tempRoot = os.tmpdir();
  assertSqliteExtractionBudget({
    entries: sqliteEntries,
    tempRoot,
  });
  const tempDir = await fs.mkdtemp(path.join(tempRoot, "openclaw-backup-verify-sqlite-"));
  try {
    const sqliteEntriesByRawPath = new Map(sqliteEntries.map((entry) => [entry.raw, entry]));
    await tar.x({
      file: params.archivePath,
      gzip: true,
      cwd: tempDir,
      strict: true,
      preserveOwner: false,
      filter: (entryPath, archiveEntry) => {
        const expected = sqliteEntriesByRawPath.get(entryPath);
        if (!expected) return false;
        if (archiveEntry.size !== expected.size)
          throw new Error(`SQLite snapshot size changed during verification: ${entryPath}`);
        return true;
      },
    });
    for (const entry of sqliteEntries) {
      const extractedPath = path.join(tempDir, ...entry.normalized.split("/"));
      const extractedStat = await fs.lstat(extractedPath);
      if (!extractedStat.isFile())
        throw new Error(`Extracted SQLite snapshot is not a regular file: ${entry.normalized}`);
      if (extractedStat.size !== entry.size)
        throw new Error(
          `Extracted SQLite snapshot size does not match archive: ${entry.normalized}`,
        );
      let database;
      try {
        await assertSqliteSnapshotFileShape(extractedPath, entry.normalized, extractedStat.size);
        const expectedRole = resolveExpectedSqliteRole(entry);
        if (!expectedRole) continue;
        database = new (requireNodeSqlite().DatabaseSync)(extractedPath, {
          allowExtension: true,
          readOnly: true,
        });
        database.exec("PRAGMA query_only = ON; PRAGMA trusted_schema = OFF;");
        await loadSqliteVecExtension({ db: database });
        assertSqliteIntegrity(database, entry.normalized);
        assertExpectedSqliteRole(database, entry.normalized, expectedRole);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        throw new Error(
          `Backup SQLite snapshot failed verification: ${entry.normalized}. ${message}`,
          { cause: err },
        );
      } finally {
        database?.close();
      }
    }
  } finally {
    await fs.rm(tempDir, {
      recursive: true,
      force: true,
    });
  }
}
/** Verify a backup archive, including snapshot shape and canonical SQLite integrity checks. */
async function backupVerifyCommand(runtime, opts) {
  const archivePath = resolveUserPath(opts.archive);
  const rawEntries = await listArchiveEntries(archivePath);
  if (rawEntries.length === 0) throw new Error("Backup archive is empty.");
  const entries = rawEntries.map((entry) => ({
    raw: entry.path,
    normalized: normalizeArchivePath(entry.path, "Archive entry"),
    ...(entry.size !== void 0 ? { size: entry.size } : {}),
    ...(entry.type ? { type: entry.type } : {}),
  }));
  const hardlinkTargets = rawEntries
    .filter((entry) => entry.type === "Link" && entry.linkpath)
    .map((entry) => ({
      entryPath: entry.path,
      normalized: normalizeArchivePath(
        entry.linkpath ?? "",
        `Archive hardlink target for ${entry.path}`,
      ),
    }));
  const normalizedEntrySet = new Set(entries.map((entry) => entry.normalized));
  const manifestMatches = entries.filter((entry) => isRootManifestEntry(entry.normalized));
  if (manifestMatches.length !== 1)
    throw new Error(`Expected exactly one backup manifest entry, found ${manifestMatches.length}.`);
  const duplicateEntryPath = findDuplicateNormalizedEntryPath(entries);
  if (duplicateEntryPath)
    throw new Error(`Archive contains duplicate entry path: ${duplicateEntryPath}`);
  const portablePathCollision = findPortableArchiveEntryPathCollision(entries);
  if (portablePathCollision)
    throw new Error(
      `Archive contains a portable path collision: ${portablePathCollision.first} and ${portablePathCollision.second}`,
    );
  const manifestEntryPath = manifestMatches[0]?.raw;
  if (!manifestEntryPath) throw new Error("Backup archive manifest entry could not be resolved.");
  const manifest = parseManifest(
    await extractManifest({
      archivePath,
      manifestEntryPath,
    }),
  );
  verifyManifestAgainstEntries(manifest, normalizedEntrySet);
  verifyHardlinkTargetsAgainstArchiveRoot(
    hardlinkTargets,
    manifest.archiveRoot,
    normalizedEntrySet,
  );
  await verifySqliteSnapshots({
    archivePath,
    entries,
    manifest,
  });
  const result = {
    ok: true,
    archivePath,
    archiveRoot: manifest.archiveRoot,
    createdAt: manifest.createdAt,
    runtimeVersion: manifest.runtimeVersion,
    assetCount: manifest.assets.length,
    entryCount: rawEntries.length,
  };
  if (opts.json) writeRuntimeJson(runtime, result);
  else runtime.log(formatResult(result));
  return result;
}
const testApi = { assertSqliteExtractionBudget };
//#endregion
export { testApi as n, backupVerifyCommand as t };
