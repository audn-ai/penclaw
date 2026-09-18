import openClawRootFsSync from "node:fs";
import openClawRootFs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
//#region src/infra/openclaw-root.ts
const CORE_PACKAGE_NAMES = /* @__PURE__ */ new Set(["openclaw"]);
const packageNameCache = /* @__PURE__ */ new Map();
const packageRootCache = /* @__PURE__ */ new Map();
const packageRootsCache = /* @__PURE__ */ new Map();
const argv1CandidateCache = /* @__PURE__ */ new Map();
function parsePackageName(raw) {
  const parsed = JSON.parse(raw);
  return typeof parsed.name === "string" ? parsed.name : null;
}
async function readPackageName(dir) {
  const packageJsonPath = path.join(path.resolve(dir), "package.json");
  if (packageNameCache.has(packageJsonPath)) return packageNameCache.get(packageJsonPath) ?? null;
  try {
    const name = parsePackageName(await openClawRootFs.readFile(packageJsonPath, "utf-8"));
    packageNameCache.set(packageJsonPath, name);
    return name;
  } catch {
    packageNameCache.set(packageJsonPath, null);
    return null;
  }
}
function readPackageNameSync(dir) {
  const packageJsonPath = path.join(path.resolve(dir), "package.json");
  if (packageNameCache.has(packageJsonPath)) return packageNameCache.get(packageJsonPath) ?? null;
  try {
    const name = parsePackageName(openClawRootFsSync.readFileSync(packageJsonPath, "utf-8"));
    packageNameCache.set(packageJsonPath, name);
    return name;
  } catch {
    packageNameCache.set(packageJsonPath, null);
    return null;
  }
}
async function findPackageRoot(startDir, maxDepth = 12) {
  for (const current of iterAncestorDirs(startDir, maxDepth)) {
    const name = await readPackageName(current);
    if (name && CORE_PACKAGE_NAMES.has(name)) return current;
  }
  return null;
}
function findPackageRootSync(startDir, maxDepth = 12) {
  for (const current of iterAncestorDirs(startDir, maxDepth)) {
    const name = readPackageNameSync(current);
    if (name && CORE_PACKAGE_NAMES.has(name)) return current;
  }
  return null;
}
function* iterAncestorDirs(startDir, maxDepth) {
  let current = path.resolve(startDir);
  for (let i = 0; i < maxDepth; i += 1) {
    yield current;
    if (path.basename(current) === "node_modules") break;
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
}
function candidateDirsFromArgv1(argv1) {
  const cacheKey = path.resolve(argv1);
  const cached = argv1CandidateCache.get(cacheKey);
  if (cached) return [...cached];
  const normalized = path.resolve(argv1);
  const candidates = [];
  try {
    const resolved = openClawRootFsSync.realpathSync(normalized);
    if (resolved !== normalized) candidates.push(path.dirname(resolved));
  } catch {}
  candidates.push(path.dirname(normalized));
  const parts = normalized.split(path.sep);
  const binIndex = parts.lastIndexOf(".bin");
  if (binIndex > 0 && parts[binIndex - 1] === "node_modules") {
    const binName = path.basename(normalized);
    const nodeModulesDir = parts.slice(0, binIndex).join(path.sep);
    candidates.push(path.join(nodeModulesDir, binName));
  }
  const deduped = dedupeCandidates(candidates);
  argv1CandidateCache.set(cacheKey, deduped);
  return [...deduped];
}
async function resolveOpenClawPackageRoot(opts) {
  const candidates = buildCandidates(opts);
  const cacheKey = createPackageRootCacheKey(candidates);
  if (packageRootCache.has(cacheKey)) return packageRootCache.get(cacheKey) ?? null;
  for (const candidate of candidates) {
    const found = await findPackageRoot(candidate);
    if (found) {
      packageRootCache.set(cacheKey, found);
      return found;
    }
  }
  packageRootCache.set(cacheKey, null);
  return null;
}
function resolveOpenClawPackageRootsSync(opts) {
  const candidates = buildCandidates(opts);
  const cacheKey = createPackageRootCacheKey(candidates);
  const cached = packageRootsCache.get(cacheKey);
  if (cached) return [...cached];
  const seen = /* @__PURE__ */ new Set();
  const roots = [];
  for (const candidate of candidates) {
    const found = findPackageRootSync(candidate);
    if (found && !seen.has(found)) {
      seen.add(found);
      roots.push(found);
    }
  }
  packageRootsCache.set(cacheKey, roots);
  return [...roots];
}
function resolveOpenClawPackageRootSync(opts) {
  return resolveOpenClawPackageRootsSync(opts)[0] ?? null;
}
function buildCandidates(opts) {
  const candidates = [];
  if (opts.moduleUrl)
    try {
      candidates.push(path.dirname(fileURLToPath(opts.moduleUrl)));
    } catch {}
  if (opts.argv1) candidates.push(...candidateDirsFromArgv1(opts.argv1));
  if (opts.cwd) candidates.push(opts.cwd);
  return dedupeCandidates(candidates);
}
function dedupeCandidates(candidates) {
  const seen = /* @__PURE__ */ new Set();
  const deduped = [];
  for (const candidate of candidates) {
    const resolved = path.resolve(candidate);
    if (seen.has(resolved)) continue;
    seen.add(resolved);
    deduped.push(resolved);
  }
  return deduped;
}
function createPackageRootCacheKey(candidates) {
  return candidates.join("\0");
}
//#endregion
export {
  resolveOpenClawPackageRootSync as n,
  resolveOpenClawPackageRootsSync as r,
  resolveOpenClawPackageRoot as t,
};
