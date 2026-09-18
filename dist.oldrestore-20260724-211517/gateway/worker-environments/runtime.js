import { createHash, randomUUID } from "node:crypto";
import { constants, createReadStream } from "node:fs";
import fs$1 from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import * as tar from "tar";
import { r as runCommandWithTimeout } from "../../exec-CXKmx4dL.js";
import { r as isExactSemverVersion } from "../../npm-registry-spec-CqBTTiC9.js";
import { n as resolveOpenClawPackageRootSync } from "../../openclaw-root-DSkQ6e_8.js";
import "../../worker-admission-BAoXlOyb.js";
import { n as collectPackageDistInventory } from "../../package-dist-inventory-TfuUCUDb.js";
import { y as resolveStateDir } from "../../paths-DEklnbzU.js";
import { c as redactSensitiveText } from "../../redact-CUe6Oey5.js";
import { n as resolveSecretRefString } from "../../resolve-Dvpn9c2h.js";
import { i as normalizeScpRemotePath } from "../../scp-host-BtrM4IVE.js";
import { Ji as validateWorkerAdmissionHandshake } from "../../src-CIJf1lT0.js";
import {
  i as workerSshRemoteCommand,
  n as workerSshCommandOptions,
  r as workerSshOptions,
  t as prepareWorkerSsh,
} from "../../ssh-YqrgGeNl.js";
import { r as truncateUtf16Safe } from "../../utf16-slice-lH-m0h6-.js";
import { n as VERSION } from "../../version-CeFj_iGk.js";
//#region src/gateway/worker-environments/bundle-staging.ts
const WORKER_PACKAGE_LIFECYCLE_FIELDS = ["devDependencies", "scripts", "pnpm"];
function comparePaths(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}
function readManifestDependencies(parsed) {
  return parsed.dependencies && typeof parsed.dependencies === "object" ? parsed.dependencies : {};
}
function withoutLifecycleFields(parsed) {
  const prunedFields = WORKER_PACKAGE_LIFECYCLE_FIELDS.filter((key) => key in parsed);
  const pruned = { ...parsed };
  for (const key of prunedFields) delete pruned[key];
  return {
    pruned,
    prunedFieldCount: prunedFields.length,
  };
}
function serializePackageManifest(parsed) {
  return Buffer.from(`${JSON.stringify(parsed, null, 2)}\n`, "utf8");
}
function pruneWorkerPackageManifest(contents, vendoredDirsByName) {
  const parsed = JSON.parse(contents.toString("utf8"));
  const dependencies = readManifestDependencies(parsed);
  let workspaceSpecCount = 0;
  const portable = {};
  for (const [name, spec] of Object.entries(dependencies)) {
    if (!spec.startsWith("workspace:")) {
      portable[name] = spec;
      continue;
    }
    workspaceSpecCount += 1;
    const vendorDir = vendoredDirsByName.get(name);
    if (vendorDir) portable[name] = `file:./${vendorDir}`;
  }
  const { pruned, prunedFieldCount } = withoutLifecycleFields(parsed);
  if (prunedFieldCount === 0 && workspaceSpecCount === 0) return contents;
  pruned.dependencies = portable;
  return serializePackageManifest(pruned);
}
function pruneVendoredPackageManifest(contents) {
  const { pruned, prunedFieldCount } = withoutLifecycleFields(
    JSON.parse(contents.toString("utf8")),
  );
  return prunedFieldCount === 0 ? contents : serializePackageManifest(pruned);
}
function normalizePortableMode(mode, relativePath) {
  return relativePath === "openclaw.mjs" || (mode & 73) !== 0 ? 448 : 384;
}
async function stageFileEntry(stagingRoot, source) {
  const { sourcePath, expectedRealPath, stagedPath } = source;
  if ((await fs$1.realpath(sourcePath)) !== expectedRealPath)
    throw new Error(`Unsafe worker bundle path: ${stagedPath}`);
  const stats = await fs$1.lstat(sourcePath);
  if (stats.isSymbolicLink() || !stats.isFile())
    throw new Error(`Unsafe worker bundle path: ${stagedPath}`);
  const handle = await fs$1.open(sourcePath, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
  let contents;
  let mode;
  try {
    const openedStats = await handle.stat();
    const currentStats = await fs$1.lstat(sourcePath);
    const currentRealPath = await fs$1.realpath(sourcePath);
    if (
      !openedStats.isFile() ||
      currentStats.isSymbolicLink() ||
      !currentStats.isFile() ||
      currentRealPath !== expectedRealPath ||
      currentStats.dev !== openedStats.dev ||
      currentStats.ino !== openedStats.ino
    )
      throw new Error(`Worker bundle path changed while packaging: ${stagedPath}`);
    contents = await handle.readFile();
    if (source.transform) contents = source.transform(contents);
    mode = normalizePortableMode(openedStats.mode, stagedPath);
  } finally {
    await handle.close();
  }
  const stagedFilePath = path.join(stagingRoot, ...stagedPath.split("/"));
  await fs$1.mkdir(path.dirname(stagedFilePath), { recursive: true });
  await fs$1.writeFile(stagedFilePath, contents, { mode });
  await fs$1.chmod(stagedFilePath, mode);
  return {
    entry: {
      path: stagedPath,
      mode,
      size: contents.byteLength,
      sha256: createHash("sha256").update(contents).digest("hex"),
    },
    contents,
  };
}
async function stageManifestEntry(
  sourceRoot,
  sourceRootRealPath,
  stagingRoot,
  relativePath,
  transform,
) {
  return await stageFileEntry(stagingRoot, {
    sourcePath: path.join(sourceRoot, relativePath),
    expectedRealPath: path.resolve(sourceRootRealPath, ...relativePath.split("/")),
    stagedPath: relativePath,
    transform,
  });
}
const OPENCLAW_IMPORT_SPECIFIER_PATTERN =
  /["'`](@openclaw\/[a-z0-9-]+)(?:\/[A-Za-z0-9./_-]+)?["'`]/gu;
function collectOpenclawImportSpecifiers(relativePath, contents, into) {
  if (!/\.(?:cjs|js|mjs)$/u.test(relativePath)) return;
  for (const match of contents.toString("utf8").matchAll(OPENCLAW_IMPORT_SPECIFIER_PATTERN)) {
    const packageName = match[1];
    if (packageName) into.add(packageName);
  }
}
async function readWorkspaceDependencyNames(sourceRoot) {
  const raw = await fs$1.readFile(path.join(sourceRoot, "package.json"), "utf8");
  const dependencies = readManifestDependencies(JSON.parse(raw));
  const names = Object.entries(dependencies)
    .filter(([, spec]) => spec.startsWith("workspace:"))
    .map(([name]) => name);
  return new Set(names);
}
async function collectVendoredPackageFiles(packageName, vendorRealRoot) {
  const files = ["package.json"];
  if (
    (
      await fs$1.lstat(path.join(vendorRealRoot, "npm-shrinkwrap.json")).catch(() => void 0)
    )?.isFile()
  )
    files.push("npm-shrinkwrap.json");
  const walk = async (relativeDir) => {
    const dirents = await fs$1.readdir(path.join(vendorRealRoot, ...relativeDir.split("/")), {
      withFileTypes: true,
    });
    for (const dirent of dirents) {
      const relativePath = `${relativeDir}/${dirent.name}`;
      if (dirent.isDirectory()) await walk(relativePath);
      else if (dirent.isFile()) files.push(relativePath);
      else throw new Error(`Unsafe worker bundle vendor path: ${packageName}/${relativePath}`);
    }
  };
  try {
    await walk("dist");
  } catch (error) {
    if (error.code === "ENOENT")
      throw new Error(
        `Workspace dependency ${packageName} referenced by the worker dist has no built dist directory at ${vendorRealRoot}`,
        { cause: error },
      );
    throw error;
  }
  return files.toSorted(comparePaths);
}
async function stageVendoredWorkspacePackages(params) {
  const entries = [];
  const vendoredDirsByName = /* @__PURE__ */ new Map();
  for (const packageName of [...params.packageNames].toSorted(comparePaths)) {
    const linkedPath = path.join(params.sourceRoot, "node_modules", ...packageName.split("/"));
    let vendorRealRoot;
    try {
      vendorRealRoot = await fs$1.realpath(linkedPath);
    } catch (error) {
      throw new Error(
        `Worker bundle cannot resolve workspace dependency ${packageName} referenced by dist; expected an installed package at ${linkedPath}`,
        { cause: error },
      );
    }
    const vendorDir = `vendor/${packageName.replace(/^@/u, "").replaceAll("/", "-")}`;
    for (const relativePath of await collectVendoredPackageFiles(packageName, vendorRealRoot)) {
      const { entry } = await stageFileEntry(params.stagingRoot, {
        sourcePath: path.join(vendorRealRoot, ...relativePath.split("/")),
        expectedRealPath: path.resolve(vendorRealRoot, ...relativePath.split("/")),
        stagedPath: `${vendorDir}/${relativePath}`,
        transform: relativePath === "package.json" ? pruneVendoredPackageManifest : void 0,
      });
      entries.push(entry);
    }
    vendoredDirsByName.set(packageName, vendorDir);
  }
  return {
    entries,
    vendoredDirsByName,
  };
}
async function collectWorkerBundleManifest(sourceRoot, stagingRoot) {
  const sourceRootRealPath = await fs$1.realpath(sourceRoot);
  const distFiles = await collectPackageDistInventory(sourceRoot);
  if (distFiles.length === 0)
    throw new Error(
      `OpenClaw worker bundle has no packaged dist files; build the running package at ${sourceRoot}`,
    );
  const referencedPackages = /* @__PURE__ */ new Set();
  const entries = [];
  for (const relativePath of ["openclaw.mjs", ...distFiles].toSorted(comparePaths)) {
    const { entry, contents } = await stageManifestEntry(
      sourceRoot,
      sourceRootRealPath,
      stagingRoot,
      relativePath,
    );
    collectOpenclawImportSpecifiers(relativePath, contents, referencedPackages);
    entries.push(entry);
  }
  const vendored = await stageVendoredWorkspacePackages({
    sourceRoot,
    stagingRoot,
    packageNames: [...(await readWorkspaceDependencyNames(sourceRoot))].filter((name) =>
      referencedPackages.has(name),
    ),
  });
  entries.push(...vendored.entries);
  const manifest = await stageManifestEntry(
    sourceRoot,
    sourceRootRealPath,
    stagingRoot,
    "package.json",
    (contents) => pruneWorkerPackageManifest(contents, vendored.vendoredDirsByName),
  );
  entries.push(manifest.entry);
  return entries.toSorted((left, right) => comparePaths(left.path, right.path));
}
//#endregion
//#region src/gateway/worker-environments/bundle.ts
const WORKER_BUNDLE_MANIFEST_VERSION = "openclaw-worker-bundle-v1";
const OPENCLAW_NPM_REGISTRY = "https://registry.npmjs.org/";
const NPM_RELEASE_PROOF_TIMEOUT_MS = 6e4;
const NPM_SHA512_INTEGRITY_PATTERN = /^sha512-[A-Za-z0-9+/]{86}==$/u;
function normalizeProtocolFeatures(features) {
  const normalized = features.map((feature) => feature.trim());
  if (normalized.some((feature) => feature.length === 0))
    throw new Error("Worker protocol features must be non-empty strings");
  return [...new Set(normalized)].toSorted(comparePaths);
}
function resolvePackageRoot(packageRoot) {
  if (packageRoot) return path.resolve(packageRoot);
  const resolved = resolveOpenClawPackageRootSync({
    moduleUrl: import.meta.url,
    argv1: process.argv[1],
    cwd: process.cwd(),
  });
  if (!resolved)
    throw new Error("Unable to locate the running OpenClaw package root for worker bundling");
  return resolved;
}
async function isReleasedPackageInstall(packageRoot) {
  const entries = new Set(await fs$1.readdir(packageRoot));
  return (
    entries.has("npm-shrinkwrap.json") &&
    !entries.has(".git") &&
    !entries.has("pnpm-lock.yaml") &&
    !entries.has("bun.lock") &&
    !entries.has("bun.lockb")
  );
}
function readNonEmptyString(record, key) {
  const value = record[key];
  return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function parseNpmPackageIdentity(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  const record = value;
  const name = readNonEmptyString(record, "name");
  const version = readNonEmptyString(record, "version");
  const integrity =
    readNonEmptyString(record, "integrity") ?? readNonEmptyString(record, "dist.integrity");
  const filename = readNonEmptyString(record, "filename");
  return name && version && integrity
    ? {
        name,
        version,
        integrity,
        filename,
      }
    : void 0;
}
async function runNpmProofCommand(params) {
  let result;
  try {
    result = await params.runCommand(params.argv, {
      cwd: params.cwd,
      timeoutMs: NPM_RELEASE_PROOF_TIMEOUT_MS,
      env: {
        COREPACK_ENABLE_DOWNLOAD_PROMPT: "0",
        NPM_CONFIG_IGNORE_SCRIPTS: "true",
      },
    });
  } catch {
    throw new Error(params.failureMessage);
  }
  if (result.code !== 0 || result.stdoutTruncatedBytes) throw new Error(params.failureMessage);
  try {
    return JSON.parse(result.stdout.trim());
  } catch {
    throw new Error(params.failureMessage);
  }
}
async function updateHashFromFile(hash, filePath) {
  for await (const chunk of createReadStream(filePath)) hash.update(chunk);
}
async function hashNpmTarballIntegrity(tarballPath) {
  const hash = createHash("sha512");
  await updateHashFromFile(hash, tarballPath);
  return `sha512-${hash.digest("base64")}`;
}
async function hashWorkerBundleTarball(tarballPath) {
  const hash = createHash("sha256");
  await updateHashFromFile(hash, tarballPath);
  return hash.digest("hex");
}
async function verifyPublishedNpmRelease(params) {
  const runCommand = params.runCommand ?? runCommandWithTimeout;
  const temporaryRoot = await fs$1.mkdtemp(path.join(os.tmpdir(), "openclaw-worker-npm-proof-"));
  try {
    const published = parseNpmPackageIdentity(
      await runNpmProofCommand({
        argv: [
          "npm",
          "view",
          `openclaw@${params.version}`,
          "name",
          "version",
          "dist.integrity",
          "--json",
          `--registry=${OPENCLAW_NPM_REGISTRY}`,
        ],
        cwd: temporaryRoot,
        failureMessage: `OpenClaw ${params.version} is not published; use the worker bundle install`,
        runCommand,
      }),
    );
    if (
      published?.name !== "openclaw" ||
      published.version !== params.version ||
      !NPM_SHA512_INTEGRITY_PATTERN.test(published.integrity)
    )
      throw new Error(
        `Cannot verify exact public npm release openclaw@${params.version}; use the worker bundle install`,
      );
    const packedValue = await runNpmProofCommand({
      argv: [
        "npm",
        "pack",
        `openclaw@${params.version}`,
        "--pack-destination",
        temporaryRoot,
        "--ignore-scripts",
        "--json",
        `--registry=${OPENCLAW_NPM_REGISTRY}`,
      ],
      cwd: temporaryRoot,
      failureMessage:
        "Unable to verify the installed OpenClaw package; use the worker bundle install",
      runCommand,
    });
    const packed = Array.isArray(packedValue) ? parseNpmPackageIdentity(packedValue[0]) : void 0;
    if (!packed?.filename || path.basename(packed.filename) !== packed.filename)
      throw new Error("npm pack returned incomplete worker package metadata");
    const packedTarballPath = path.join(temporaryRoot, packed.filename);
    let packedTarballIntegrity;
    try {
      packedTarballIntegrity = await hashNpmTarballIntegrity(packedTarballPath);
    } catch {
      throw new Error(
        "Unable to verify the installed OpenClaw package; use the worker bundle install",
      );
    }
    if (
      packed.name !== published.name ||
      packed.version !== published.version ||
      packed.integrity !== published.integrity ||
      packedTarballIntegrity !== published.integrity
    )
      throw new Error(
        `Installed OpenClaw ${params.version} does not match the published package; use the worker bundle install`,
      );
    const extractedRoot = path.join(temporaryRoot, "package");
    await fs$1.mkdir(extractedRoot);
    await tar.extract({
      cwd: extractedRoot,
      file: packedTarballPath,
      preservePaths: false,
      strict: true,
      strip: 1,
    });
    if (
      (
        await prepareWorkerBundle({
          packageRoot: extractedRoot,
          cacheDir: path.join(temporaryRoot, "bundle-cache"),
          openclawVersion: params.version,
        })
      ).bundleHash !== params.bundleHash
    )
      throw new Error(
        `Published OpenClaw ${params.version} does not match the prepared worker bundle; use the worker bundle install`,
      );
    return published.integrity;
  } finally {
    await fs$1.rm(temporaryRoot, {
      recursive: true,
      force: true,
    });
  }
}
function hashWorkerBundleManifest(entries) {
  const hash = createHash("sha256");
  hash.update(`${WORKER_BUNDLE_MANIFEST_VERSION}\0`);
  for (const entry of entries)
    hash.update(`${entry.path}\0${entry.mode.toString(8)}\0${entry.size}\0${entry.sha256}\0`);
  return hash.digest("hex");
}
function manifestsMatch(left, right) {
  return (
    left.length === right.length &&
    left.every((entry, index) => {
      const other = right[index];
      return (
        other !== void 0 &&
        entry.path === other.path &&
        entry.mode === other.mode &&
        entry.size === other.size &&
        entry.sha256 === other.sha256
      );
    })
  );
}
async function readTarballManifest(tarballPath) {
  const pending = [];
  await tar.list({
    file: tarballPath,
    strict: true,
    onReadEntry(entry) {
      const hash = createHash("sha256");
      const item = {
        path: entry.path,
        mode: entry.mode,
        headerSize: entry.size,
        actualSize: 0,
        type: entry.type,
      };
      pending.push(item);
      entry.on("data", (chunk) => {
        item.actualSize += chunk.byteLength;
        hash.update(chunk);
      });
      entry.on("end", () => {
        item.sha256 = hash.digest("hex");
      });
      entry.on("error", (error) => {
        item.error = error instanceof Error ? error : new Error(String(error));
      });
    },
  });
  return pending
    .map((entry) => {
      if (entry.error) throw entry.error;
      if (
        entry.type !== "File" ||
        entry.mode === void 0 ||
        entry.actualSize !== entry.headerSize ||
        entry.sha256 === void 0
      )
        throw new Error(`Invalid worker bundle tar entry: ${entry.path}`);
      return {
        path: entry.path,
        mode: entry.mode,
        size: entry.actualSize,
        sha256: entry.sha256,
      };
    })
    .toSorted((left, right) => comparePaths(left.path, right.path));
}
async function isCachedTarball(filePath) {
  try {
    const stats = await fs$1.lstat(filePath);
    if (stats.isSymbolicLink() || !stats.isFile())
      throw new Error(`Unsafe worker bundle cache path: ${filePath}`);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}
async function cachedTarballMatches(tarballPath, manifest) {
  if (!(await isCachedTarball(tarballPath))) return false;
  try {
    return manifestsMatch(await readTarballManifest(tarballPath), manifest);
  } catch {
    return false;
  }
}
async function writeTarball(params) {
  const temporaryPath = `${params.tarballPath}.${process.pid}.${randomUUID()}.tmp`;
  try {
    await tar.create(
      {
        cwd: params.stagingRoot,
        file: temporaryPath,
        gzip: true,
        noDirRecurse: true,
        noMtime: true,
        portable: true,
        strict: true,
      },
      params.entries.map((entry) => entry.path),
    );
    try {
      await fs$1.rename(temporaryPath, params.tarballPath);
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
      if (!(await cachedTarballMatches(params.tarballPath, params.entries))) {
        await fs$1.rm(params.tarballPath, { force: true });
        try {
          await fs$1.rename(temporaryPath, params.tarballPath);
        } catch (publishError) {
          if (
            publishError.code !== "EEXIST" ||
            !(await cachedTarballMatches(params.tarballPath, params.entries))
          )
            throw publishError;
        }
      }
    }
  } finally {
    await fs$1.rm(temporaryPath, { force: true });
  }
}
async function prepareWorkerBundle(options) {
  const packageRoot = resolvePackageRoot(options.packageRoot);
  const cacheDir = options.cacheDir
    ? path.resolve(options.cacheDir)
    : path.join(resolveStateDir(), "cache", "worker-bundles");
  const openclawVersion = (options.openclawVersion ?? VERSION).trim();
  if (!openclawVersion) throw new Error("Worker bundle requires a non-empty OpenClaw version");
  const protocolFeatures = normalizeProtocolFeatures(options.protocolFeatures ?? []);
  await fs$1.mkdir(cacheDir, { recursive: true });
  const stagingRoot = await fs$1.mkdtemp(path.join(cacheDir, ".staging-"));
  try {
    const manifest = await collectWorkerBundleManifest(packageRoot, stagingRoot);
    const bundleHash = hashWorkerBundleManifest(manifest);
    const tarballPath = path.join(cacheDir, `${bundleHash}.tgz`);
    if (!(await cachedTarballMatches(tarballPath, manifest)))
      await writeTarball({
        stagingRoot,
        entries: manifest,
        tarballPath,
      });
    return {
      install: "bundle",
      bundleHash,
      openclawVersion,
      protocolFeatures,
      tarballSha256: await hashWorkerBundleTarball(tarballPath),
      tarballPath,
    };
  } finally {
    await fs$1.rm(stagingRoot, {
      recursive: true,
      force: true,
    });
  }
}
/** Creates a process-lifecycle bundle producer that scans the running build at most once. */
function createWorkerBundleProducer(options = {}) {
  let prepared;
  return {
    prepare() {
      if (!prepared) {
        const pending = prepareWorkerBundle(options).catch((error) => {
          if (prepared === pending) prepared = void 0;
          throw error;
        });
        prepared = pending;
      }
      return prepared;
    },
  };
}
/**
 * Selects the exact npm package only after the public tarball's canonical worker manifest proves
 * parity with the running gateway bundle.
 */
async function resolveWorkerNpmInstallationArtifact(params) {
  const version = params.bundle.openclawVersion.trim();
  if (!isExactSemverVersion(version))
    throw new Error(
      `Worker npm install requires the exact published gateway version; expected ${version}`,
    );
  const packageRoot = resolvePackageRoot(params.packageRoot);
  if (
    !(params.isPackageInstall
      ? await params.isPackageInstall(packageRoot)
      : await isReleasedPackageInstall(packageRoot))
  )
    throw new Error(
      "Worker npm install requires the gateway to run from a packaged release install",
    );
  const packageIntegrity = await (params.verifyRelease ?? verifyPublishedNpmRelease)({
    bundleHash: params.bundle.bundleHash,
    version,
  });
  return {
    install: "npm",
    bundleHash: params.bundle.bundleHash,
    openclawVersion: version,
    packageIntegrity,
    protocolFeatures: params.bundle.protocolFeatures,
    packageSpec: `openclaw@${version}`,
  };
}
//#endregion
//#region src/gateway/worker-environments/bootstrap.ts
const BOOTSTRAP_ROOT = ".openclaw-worker";
const BOOTSTRAP_RECEIPT = "bootstrap-receipt.json";
const DEFAULT_BOOTSTRAP_TIMEOUT_MS = 10 * 6e4;
const NODE_MISSING_EXIT_CODE = 42;
const NPM_MISSING_EXIT_CODE = 43;
const LOCK_TIMEOUT_EXIT_CODE = 44;
const NODE_UNSUPPORTED_EXIT_CODE = 45;
const LOCK_MAX_AGE_SECONDS = 3600;
const NODE_MISSING_MARKER = "OPENCLAW_WORKER_NODE_MISSING";
const NODE_UNSUPPORTED_MARKER = "OPENCLAW_WORKER_NODE_UNSUPPORTED";
const NPM_MISSING_MARKER = "OPENCLAW_WORKER_NPM_MISSING";
const BOOTSTRAP_OUTPUT_TAG = "OPENCLAW_WORKER_BOOTSTRAP_V1";
const BUNDLE_HASH_PATTERN = /^[a-f0-9]{64}$/u;
const NPM_INTEGRITY_PATTERN = /^sha512-[A-Za-z0-9+/]{86}==$/u;
const NODE_RUNTIME_CHECK_JS = String.raw`const parse = (value) => /^(\d+)\.(\d+)\.(\d+)$/.exec(value)?.slice(1).map(Number); const atLeast = (version, floor) => version[0] > floor[0] || (version[0] === floor[0] && (version[1] > floor[1] || (version[1] === floor[1] && version[2] >= floor[2])));
const node = parse(process.versions.node); if (!node) process.exit(1);
const nodeSafe = (node[0] === 22 && atLeast(node, [22, 22, 3])) || (node[0] === 24 && atLeast(node, [24, 15, 0])) || (node[0] === 25 && atLeast(node, [25, 9, 0])) || node[0] >= 26;
if (!nodeSafe) process.exit(1);
try { const { DatabaseSync } = require("node:sqlite"); const db = new DatabaseSync(":memory:");
  const sqlite = parse(String(db.prepare("SELECT sqlite_version() AS version").get()?.version ?? ""));
  db.close(); if (!sqlite) process.exit(1);
  const sqliteSafe = atLeast(sqlite, [3, 51, 3]) || (sqlite[0] === 3 && ((sqlite[1] === 50 && sqlite[2] >= 7) || (sqlite[1] === 44 && sqlite[2] >= 6)));
  process.exit(sqliteSafe ? 0 : 1); } catch { process.exit(1); }`;
const RECEIPT_MATCH_JS = String.raw`const fs = require("node:fs");
try {
  const actual = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
  const expected = JSON.parse(process.argv[2]);
  const shapeMatches =
    Object.keys(actual).sort().join(",") === "bundleHash,openclawVersion,protocolFeatures";
  const featuresMatch =
    Array.isArray(actual.protocolFeatures) &&
    Array.isArray(expected.protocolFeatures) &&
    actual.protocolFeatures.length === expected.protocolFeatures.length &&
    actual.protocolFeatures.every((feature, index) => feature === expected.protocolFeatures[index]);
  process.exit(
    shapeMatches &&
      actual.bundleHash === expected.bundleHash &&
      actual.openclawVersion === expected.openclawVersion &&
      featuresMatch
      ? 0
      : 1,
  );
} catch {
  process.exit(1);
}`;
const VERIFY_ARCHIVE_JS = String.raw`const crypto = require("node:crypto");
const fs = require("node:fs");
try {
  const actual = crypto.createHash("sha256").update(fs.readFileSync(process.argv[1])).digest("hex");
  process.exit(actual === process.argv[2] ? 0 : 1);
} catch {
  process.exit(1);
}`;
const VERIFY_NPM_PACKAGE_JS = String.raw`const crypto = require("node:crypto");
const fs = require("node:fs");
try {
  const actual = "sha512-" + crypto.createHash("sha512").update(fs.readFileSync(process.argv[1])).digest("base64");
  process.exit(actual === process.argv[2] ? 0 : 1);
} catch {
  process.exit(1);
}`;
const READ_NPM_PACK_FILENAME_JS = String.raw`const fs = require("node:fs");
const path = require("node:path");
try {
  const value = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
  const filename = Array.isArray(value) && value.length === 1 ? value[0]?.filename : undefined;
  if (typeof filename !== "string" || !filename || path.basename(filename) !== filename) {
    process.exit(1);
  }
  process.stdout.write(filename);
} catch {
  process.exit(1);
}`;
const VERIFY_INSTALL_JS = String.raw`const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const root = process.argv[1];
const expected = process.argv[2];
const install = process.argv[3];
const entries = [];
function fail(message) {
  throw new Error(message);
}
function assertRoot() {
  const stats = fs.lstatSync(root);
  if (stats.isSymbolicLink() || !stats.isDirectory()) {
    fail("unsafe worker install root");
  }
  fs.chmodSync(root, 0o700);
}
function assertDirectory(relative) {
  const absolute = path.join(root, ...relative.split("/"));
  const stats = fs.lstatSync(absolute);
  if (stats.isSymbolicLink() || !stats.isDirectory()) {
    fail("unsafe worker directory: " + relative);
  }
  fs.chmodSync(absolute, 0o700);
}
function addFile(relative) {
  const parts = relative.split("/");
  for (let index = 1; index < parts.length; index += 1) {
    assertDirectory(parts.slice(0, index).join("/"));
  }
  const absolute = path.join(root, ...relative.split("/"));
  const stats = fs.lstatSync(absolute);
  if (stats.isSymbolicLink() || !stats.isFile()) {
    fail("unsafe worker file: " + relative);
  }
  const contents = fs.readFileSync(absolute);
  const mode = relative === "openclaw.mjs" || (stats.mode & 0o111) !== 0 ? 0o700 : 0o600;
  fs.chmodSync(absolute, mode);
  entries.push({
    path: relative,
    mode,
    size: contents.byteLength,
    sha256: crypto.createHash("sha256").update(contents).digest("hex"),
  });
}
function walk(relativeDirectory) {
  assertDirectory(relativeDirectory);
  const absoluteDirectory = path.join(root, ...relativeDirectory.split("/"));
  for (const name of fs.readdirSync(absoluteDirectory).sort()) {
    const relative = relativeDirectory + "/" + name;
    const stats = fs.lstatSync(path.join(root, ...relative.split("/")));
    if (stats.isSymbolicLink()) {
      fail("unsafe worker path: " + relative);
    }
    if (stats.isDirectory()) {
      walk(relative);
    } else {
      addFile(relative);
    }
  }
}
function readNpmInventory() {
  assertDirectory("dist");
  const inventoryPath = path.join(root, "dist", "postinstall-inventory.json");
  const inventoryStats = fs.lstatSync(inventoryPath);
  if (inventoryStats.isSymbolicLink() || !inventoryStats.isFile()) {
    fail("unsafe worker dist inventory");
  }
  const value = JSON.parse(fs.readFileSync(inventoryPath, "utf8"));
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== "string")) {
    fail("invalid worker dist inventory");
  }
  const unique = new Set(value);
  if (unique.size !== value.length) {
    fail("duplicate worker dist inventory entry");
  }
  for (const relative of value) {
    if (
      !relative.startsWith("dist/") ||
      relative.includes("\\") ||
      path.posix.normalize(relative) !== relative ||
      relative === "dist/postinstall-inventory.json"
    ) {
      fail("unsafe worker dist inventory entry: " + relative);
    }
    addFile(relative);
  }
}
try {
  assertRoot();
  addFile("openclaw.mjs");
  addFile("package.json");
  if (install === "npm") {
    readNpmInventory();
  } else if (install === "bundle") {
    walk("dist");
    // Vendored workspace packages ship inside the bundle and are part of its hash;
    // node_modules is installed after verification and never walked here.
    const vendorPath = path.join(root, "vendor");
    const vendorStats = fs.existsSync(vendorPath) ? fs.lstatSync(vendorPath) : undefined;
    if (vendorStats) {
      if (vendorStats.isSymbolicLink() || !vendorStats.isDirectory()) {
        fail("unsafe worker vendor directory");
      }
      walk("vendor");
    }
  } else {
    fail("invalid worker install channel");
  }
  if (entries.length < 3) {
    fail("worker dist is empty");
  }
  entries.sort((left, right) => left.path < right.path ? -1 : left.path > right.path ? 1 : 0);
  const separator = String.fromCharCode(0);
  const hash = crypto.createHash("sha256");
  hash.update("${WORKER_BUNDLE_MANIFEST_VERSION}" + separator);
  for (const entry of entries) {
    hash.update(entry.path + separator + entry.mode.toString(8) + separator + entry.size + separator + entry.sha256 + separator);
  }
  process.exit(hash.digest("hex") === expected ? 0 : 1);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}`;
const PREFLIGHT_SCRIPT = String.raw`set -eu
umask 077
hash=$1
expected_receipt=$2
install=$3
root=$HOME/${BOOTSTRAP_ROOT}
install_dir=$root/$hash
receipt=$install_dir/${BOOTSTRAP_RECEIPT}

ensure_private_directory() {
  directory=$1
  if [ -e "$directory" ] || [ -L "$directory" ]; then
    if [ ! -d "$directory" ] || [ -L "$directory" ]; then
      printf '%s\n' 'unsafe worker bootstrap directory' >&2
      exit 2
    fi
  else
    mkdir "$directory"
  fi
  chmod 700 "$directory"
}

ensure_private_directory "$root"

if ! command -v node >/dev/null 2>&1; then
  printf '%s\n' '${NODE_MISSING_MARKER}' >&2
  exit ${NODE_MISSING_EXIT_CODE}
fi

if ! node -e '${NODE_RUNTIME_CHECK_JS}'; then
  printf '%s: ' '${NODE_UNSUPPORTED_MARKER}' >&2
  node --version >&2 || true
  exit ${NODE_UNSUPPORTED_EXIT_CODE}
fi

if [ -d "$install_dir" ] && [ ! -L "$install_dir" ] && [ -f "$receipt" ] &&
  node -e '${RECEIPT_MATCH_JS}' "$receipt" "$expected_receipt" &&
  node -e '${VERIFY_INSTALL_JS}' "$install_dir" "$hash" "$install"; then
  printf '%s\t%s\t' '${BOOTSTRAP_OUTPUT_TAG}' current
  cat "$receipt"
  printf '\n'
  exit 0
fi

incoming=$root/.incoming
ensure_private_directory "$incoming"
incoming=$(cd "$incoming" && pwd -P)
find "$incoming" -type f -name 'openclaw-upload-*.tgz.*' -mmin +60 -exec rm -f -- {} + 2>/dev/null || true
upload=$(mktemp "$incoming/openclaw-upload-$hash.tgz.XXXXXXXX")
printf '%s\t%s\t%s\n' '${BOOTSTRAP_OUTPUT_TAG}' install "$upload"
`;
const INSTALL_SCRIPT = String.raw`set -eu
umask 077
install=$1
hash=$2
package_spec=$3
package_integrity=$4
receipt_json=$5
upload=$6
archive_sha256=$7
root=$HOME/${BOOTSTRAP_ROOT}
install_dir=$root/$hash
receipt=$install_dir/${BOOTSTRAP_RECEIPT}
staging=$root/.staging-$hash-$$
lock_root=$root/.locks
lock=$lock_root/$hash
locked=0
lock_identity="$$:$(date +%s)"

ensure_private_directory() {
  directory=$1
  if [ -e "$directory" ] || [ -L "$directory" ]; then
    if [ ! -d "$directory" ] || [ -L "$directory" ]; then
      printf '%s\n' 'unsafe worker bootstrap directory' >&2
      exit 2
    fi
  else
    mkdir "$directory"
  fi
  chmod 700 "$directory"
}

ensure_private_directory "$root"
ensure_private_directory "$lock_root"

cleanup() {
  rm -rf "$staging"
  if [ "$locked" -eq 1 ]; then
    owner=$(readlink "$lock" 2>/dev/null || true)
    if [ "$owner" = "$lock_identity" ]; then
      rm -f "$lock"
    fi
  fi
  if [ -n "$upload" ]; then
    rm -f "$upload"
  fi
}
trap cleanup 0
trap 'exit 1' 1 2 15

receipt_matches() {
  [ -d "$install_dir" ] && [ ! -L "$install_dir" ] && [ -f "$receipt" ] &&
    node -e '${RECEIPT_MATCH_JS}' "$receipt" "$receipt_json" &&
    node -e '${VERIFY_INSTALL_JS}' "$install_dir" "$hash" "$install"
}

read_lock_owner() {
  if [ -L "$lock" ]; then
    readlink "$lock" 2>/dev/null || true
  elif [ -r "$lock/pid" ]; then
    cat "$lock/pid" 2>/dev/null || true
  fi
}

attempt=0
while ! ln -s "$lock_identity" "$lock" 2>/dev/null; do
  if receipt_matches; then
    printf '%s\t%s\t' '${BOOTSTRAP_OUTPUT_TAG}' receipt
    cat "$receipt"
    printf '\n'
    exit 0
  fi
  owner=$(read_lock_owner)
  stale_owner=0
  case "$owner" in
    *:*:*) valid_owner=0 ;;
    *:*)
      owner_pid=${"${"}owner%%:*}
      owner_started=${"${"}owner#*:}
      case "$owner_pid" in
        *[!0-9]*|'') valid_owner=0 ;;
        *)
          case "$owner_started" in
            *[!0-9]*|'') valid_owner=0 ;;
            *)
              now=$(date +%s)
              if [ "$owner_started" -le "$now" ] && [ $((now - owner_started)) -le ${LOCK_MAX_AGE_SECONDS} ]; then
                valid_owner=1
              else
                valid_owner=0
                stale_owner=1
              fi
              ;;
          esac
          ;;
      esac
      ;;
    *) valid_owner=0 ;;
  esac
  if [ "$stale_owner" -eq 1 ]; then
    current_owner=$(read_lock_owner)
    if [ "$current_owner" = "$owner" ]; then
      if [ -L "$lock" ]; then rm -f "$lock"; else rm -rf "$lock"; fi
    fi
    continue
  fi
  if [ "$valid_owner" -eq 1 ] && kill -0 "$owner_pid" 2>/dev/null; then
    attempt=$((attempt + 1))
    if [ "$attempt" -ge 60 ]; then
      printf '%s\n' 'worker bootstrap lock timed out' >&2
      exit ${LOCK_TIMEOUT_EXIT_CODE}
    fi
    sleep 1
    continue
  fi
  if [ "$valid_owner" -eq 1 ]; then
    current_owner=$(read_lock_owner)
    if [ "$current_owner" = "$owner" ]; then
      if [ -L "$lock" ]; then rm -f "$lock"; else rm -rf "$lock"; fi
    fi
    continue
  fi
  attempt=$((attempt + 1))
  if [ "$valid_owner" -eq 0 ] && [ "$attempt" -ge 5 ]; then
    current_owner=$(read_lock_owner)
    if [ "$current_owner" = "$owner" ]; then
      if [ -L "$lock" ]; then rm -f "$lock"; else rm -rf "$lock"; fi
    fi
    continue
  fi
  sleep 1
done
locked=1

# The per-hash lock makes cleanup safe: no live installer for this build can own an older staging dir.
for stale_staging in "$root"/.staging-"$hash"-*; do
  if [ -L "$stale_staging" ]; then
    rm -f "$stale_staging"
  elif [ -d "$stale_staging" ]; then
    rm -rf "$stale_staging"
  fi
done

if receipt_matches; then
  printf '%s\t%s\t' '${BOOTSTRAP_OUTPUT_TAG}' receipt
  cat "$receipt"
  printf '\n'
  exit 0
fi

rm -rf "$staging"
mkdir -p "$staging"
case "$install" in
  bundle)
    if ! node -e '${VERIFY_ARCHIVE_JS}' "$upload" "$archive_sha256"; then
      printf '%s\n' 'worker bundle archive digest mismatch' >&2
      exit 2
    fi
    tar -xzf "$upload" -C "$staging"
    ;;
  npm)
    if ! command -v npm >/dev/null 2>&1; then
      printf '%s\n' '${NPM_MISSING_MARKER}' >&2
      exit ${NPM_MISSING_EXIT_CODE}
    fi
    npm_prefix=$staging/.npm-prefix
    npm_pack_json=$staging/npm-pack.json
    OPENCLAW_DISABLE_PLUGIN_REGISTRY_MIGRATION=1 npm pack "$package_spec" --pack-destination "$staging" --ignore-scripts --json --registry=https://registry.npmjs.org/ > "$npm_pack_json"
    package_archive=$(node -e '${READ_NPM_PACK_FILENAME_JS}' "$npm_pack_json")
    package_archive=$staging/$package_archive
    if ! node -e '${VERIFY_NPM_PACKAGE_JS}' "$package_archive" "$package_integrity"; then
      printf '%s\n' 'worker npm package integrity mismatch' >&2
      exit 2
    fi
    OPENCLAW_DISABLE_PLUGIN_REGISTRY_MIGRATION=1 npm install --global --prefix "$npm_prefix" --ignore-scripts --omit=dev --no-audit --no-fund "$package_archive"
    package_dir=$npm_prefix/lib/node_modules/openclaw
    if [ ! -f "$package_dir/openclaw.mjs" ]; then
      printf '%s\n' 'npm did not install the OpenClaw package root' >&2
      exit 2
    fi
    # Match bundle layout so the worker entry always lives under the versioned root.
    cp -R "$package_dir/." "$staging/"
    rm -rf "$npm_prefix"
    rm -f "$npm_pack_json" "$package_archive"
    ;;
  *)
    printf '%s\n' 'invalid worker install channel' >&2
    exit 2
    ;;
esac

if ! node -e '${VERIFY_INSTALL_JS}' "$staging" "$hash" "$install"; then
  printf '%s\n' 'worker install content does not match the expected bundle hash' >&2
  exit 2
fi
# Materialize production dependencies only after the pristine bundle passed its
# integrity check; npm install writes node_modules the hash intentionally excludes.
if [ "$install" = bundle ]; then
  if ! command -v npm >/dev/null 2>&1; then
    printf '%s\n' '${NPM_MISSING_MARKER}' >&2
    exit ${NPM_MISSING_EXIT_CODE}
  fi
  OPENCLAW_DISABLE_PLUGIN_REGISTRY_MIGRATION=1 npm install --prefix "$staging" --ignore-scripts --omit=dev --no-audit --no-fund >&2
fi
printf '%s\n' "$receipt_json" > "$staging/${BOOTSTRAP_RECEIPT}"
chmod 600 "$staging/${BOOTSTRAP_RECEIPT}"
rm -rf "$install_dir"
mv "$staging" "$install_dir"
printf '%s\t%s\t' '${BOOTSTRAP_OUTPUT_TAG}' receipt
cat "$receipt"
printf '\n'
`;
function normalizeHandshake(artifact) {
  const bundleHash = artifact.bundleHash.trim();
  const openclawVersion = artifact.openclawVersion.trim();
  const protocolFeatures = artifact.protocolFeatures.map((feature) => feature.trim());
  if (!BUNDLE_HASH_PATTERN.test(bundleHash))
    throw new Error("Worker bundle hash must be a lowercase SHA-256 digest");
  if (!openclawVersion) throw new Error("Worker OpenClaw version must be non-empty");
  if (
    protocolFeatures.length > 64 ||
    protocolFeatures.some((feature) => !feature) ||
    protocolFeatures.some((feature) => feature.length > 128) ||
    new Set(protocolFeatures).size !== protocolFeatures.length
  )
    throw new Error("Worker protocol features must be unique non-empty strings");
  if (artifact.install === "npm") {
    if (
      !isExactSemverVersion(openclawVersion) ||
      artifact.packageSpec !== `openclaw@${openclawVersion}`
    )
      throw new Error(`Worker npm install must use exact package openclaw@${openclawVersion}`);
    if (!NPM_INTEGRITY_PATTERN.test(artifact.packageIntegrity))
      throw new Error("Worker npm install requires a pinned SHA-512 package integrity");
  } else if (!BUNDLE_HASH_PATTERN.test(artifact.tarballSha256))
    throw new Error("Worker bundle archive digest must be a lowercase SHA-256 digest");
  return {
    bundleHash,
    openclawVersion,
    protocolFeatures,
  };
}
function parseReceiptJson(value, expected) {
  let parsed;
  try {
    parsed = JSON.parse(value ?? "");
  } catch {
    throw new Error("Worker bootstrap returned an invalid receipt");
  }
  if (!validateWorkerAdmissionHandshake(parsed))
    throw new Error("Worker bootstrap returned an invalid receipt");
  if (
    parsed.bundleHash !== expected.bundleHash ||
    parsed.openclawVersion !== expected.openclawVersion ||
    parsed.protocolFeatures.length !== expected.protocolFeatures.length ||
    parsed.protocolFeatures.some((feature, index) => feature !== expected.protocolFeatures[index])
  )
    throw new Error("Worker bootstrap receipt does not match the requested artifact");
  return parsed;
}
function commandFailure(phase, result) {
  const output = truncateUtf16Safe(
    redactSensitiveText(result.stderr.trim() || result.stdout.trim(), { mode: "tools" }).replace(
      /\s+/gu,
      " ",
    ),
    512,
  );
  const status =
    result.termination === "exit" ? `exit ${result.code ?? "unknown"}` : result.termination;
  return /* @__PURE__ */ new Error(
    `Worker bootstrap ${phase} failed (${status})${output ? `: ${output}` : ""}`,
  );
}
function isSuccess(result) {
  return result.termination === "exit" && result.code === 0;
}
async function runSshScript(params) {
  return await params.runCommand(
    [
      "ssh",
      ...workerSshOptions(params.prepared, { forwarding: "disabled" }),
      "-a",
      "-x",
      "-T",
      "-p",
      String(params.prepared.port),
      "--",
      params.prepared.sshTarget,
      workerSshRemoteCommand(["sh", "-s", "--", ...params.scriptArgs]),
    ],
    workerSshCommandOptions({
      input: params.script,
      timeoutMs: params.timeoutMs,
      signal: params.signal,
    }),
  );
}
const CLEANUP_UPLOAD_SCRIPT = String.raw`set -eu
rm -f -- "$1"
`;
async function cleanupRemoteUpload(params) {
  await runSshScript({
    prepared: params.prepared,
    runCommand: params.runCommand,
    script: CLEANUP_UPLOAD_SCRIPT,
    scriptArgs: [params.remotePath],
    timeoutMs: Math.min(params.timeoutMs, 1e4),
  }).catch(() => void 0);
}
function parseTaggedOutput(stdout) {
  const prefix = `${BOOTSTRAP_OUTPUT_TAG}\t`;
  const record = stdout.split(/\r?\n/u).findLast((line) => line.startsWith(prefix));
  if (!record) return;
  const actionEnd = record.indexOf("	", prefix.length);
  if (actionEnd === -1) return;
  const action = record.slice(prefix.length, actionEnd);
  const payload = record.slice(actionEnd + 1).trim();
  return action && payload
    ? {
        action,
        payload,
      }
    : void 0;
}
function parsePreflight(result, expected) {
  if (
    result.code === NODE_MISSING_EXIT_CODE ||
    result.stderr.includes(NODE_MISSING_MARKER) ||
    result.stdout.includes(NODE_MISSING_MARKER)
  )
    throw new Error(
      "Worker bootstrap requires Node.js on the leased host; install Node in the provider setup phase and retry",
    );
  if (
    result.code === NODE_UNSUPPORTED_EXIT_CODE ||
    result.stderr.includes(NODE_UNSUPPORTED_MARKER) ||
    result.stdout.includes(NODE_UNSUPPORTED_MARKER)
  )
    throw new Error(
      "Worker bootstrap requires Node 22.22.3+, 24.15.0+, or 25.9.0+ with WAL-reset-safe SQLite on the leased host; install a supported Node runtime in the provider setup phase and retry",
    );
  if (!isSuccess(result)) throw commandFailure("preflight", result);
  const output = parseTaggedOutput(result.stdout);
  if (output?.action === "current")
    return {
      action: "current",
      receipt: parseReceiptJson(output.payload, expected),
    };
  const normalizedPath = normalizeScpRemotePath(
    output?.action === "install" ? output.payload : void 0,
  );
  if (!normalizedPath)
    throw new Error("Worker bootstrap preflight returned an invalid upload path");
  return {
    action: "install",
    path: normalizedPath,
  };
}
/** Installs one exact worker artifact over SSH and returns its admission receipt. */
async function bootstrapWorker(request, dependencies) {
  const receipt = normalizeHandshake(request.artifact);
  const timeoutMs = dependencies.timeoutMs ?? DEFAULT_BOOTSTRAP_TIMEOUT_MS;
  const runCommand = dependencies.runCommand ?? runCommandWithTimeout;
  const prepared = await prepareWorkerSsh({
    ssh: request.ssh,
    pinnedHostKey: request.pinnedHostKey,
    resolveIdentity: dependencies.resolveIdentity,
    temporaryDirectoryPrefix: "openclaw-worker-bootstrap-",
  });
  try {
    const preflight = parsePreflight(
      await runSshScript({
        prepared,
        runCommand,
        script: PREFLIGHT_SCRIPT,
        scriptArgs: [receipt.bundleHash, JSON.stringify(receipt), request.artifact.install],
        timeoutMs,
        signal: dependencies.signal,
      }),
      receipt,
    );
    if (preflight.action === "current") return preflight.receipt;
    try {
      if (request.artifact.install === "bundle") {
        const transfer = await runCommand(
          [
            "scp",
            ...workerSshOptions(prepared, { forwarding: "disabled" }),
            "-P",
            String(prepared.port),
            "--",
            request.artifact.tarballPath,
            `${prepared.scpTarget}:${preflight.path}`,
          ],
          workerSshCommandOptions({
            timeoutMs,
            signal: dependencies.signal,
          }),
        );
        if (!isSuccess(transfer)) throw commandFailure("bundle transfer", transfer);
      }
      const install = await runSshScript({
        prepared,
        runCommand,
        script: INSTALL_SCRIPT,
        scriptArgs: [
          request.artifact.install,
          receipt.bundleHash,
          request.artifact.install === "npm" ? request.artifact.packageSpec : "",
          request.artifact.install === "npm" ? request.artifact.packageIntegrity : "",
          JSON.stringify(receipt),
          preflight.path,
          request.artifact.install === "bundle" ? request.artifact.tarballSha256 : "",
        ],
        timeoutMs,
        signal: dependencies.signal,
      });
      if (
        install.code === NPM_MISSING_EXIT_CODE ||
        install.stderr.includes(NPM_MISSING_MARKER) ||
        install.stdout.includes(NPM_MISSING_MARKER)
      )
        throw new Error(
          "Worker npm bootstrap requires npm on the leased host; use bundle install or provide npm in the provider setup phase",
        );
      if (!isSuccess(install)) throw commandFailure("install", install);
      const output = parseTaggedOutput(install.stdout);
      if (output?.action !== "receipt")
        throw new Error("Worker bootstrap install returned an invalid receipt");
      return parseReceiptJson(output.payload, receipt);
    } catch (error) {
      await cleanupRemoteUpload({
        prepared,
        remotePath: preflight.path,
        runCommand,
        timeoutMs,
      });
      throw error;
    }
  } finally {
    await prepared.dispose();
  }
}
//#endregion
//#region src/gateway/worker-environments/identity.ts
function requireIdentity(value) {
  if (
    typeof value === "object" &&
    value !== null &&
    "kind" in value &&
    value.kind === "path" &&
    "path" in value &&
    typeof value.path === "string" &&
    value.path.trim()
  )
    return {
      kind: "path",
      path: value.path,
    };
  if (
    typeof value === "object" &&
    value !== null &&
    "kind" in value &&
    value.kind === "material" &&
    "contents" in value &&
    typeof value.contents === "string" &&
    value.contents.trim()
  )
    return {
      kind: "material",
      contents: value.contents,
    };
  throw new Error("Worker SSH identity resolver returned an invalid identity");
}
/** Routes dynamic identities to their provider owner and configured refs to the generic resolver. */
async function resolveWorkerSshIdentity(params) {
  return requireIdentity(
    params.provider.resolveSshIdentity
      ? await params.provider.resolveSshIdentity({
          leaseId: params.leaseId,
          profile: params.profile,
          keyRef: params.keyRef,
        })
      : await params.resolveGeneric(params.keyRef),
  );
}
//#endregion
export {
  bootstrapWorker,
  createWorkerBundleProducer,
  resolveSecretRefString,
  resolveWorkerNpmInstallationArtifact,
  resolveWorkerSshIdentity,
};
