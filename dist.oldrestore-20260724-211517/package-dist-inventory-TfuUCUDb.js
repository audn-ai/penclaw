import fs from "node:fs/promises";
import path from "node:path";
import pLimit from "p-limit";
import { a as readJsonIfExists } from "./json-files-CTWRDHag.js";
import { g as sortUniqueStrings } from "./string-normalization-CRyoFBPt.js";
/**
 * Dist paths that contain local build metadata and should not be packaged as source.
 * @internal Shared repository-script contract.
 */
const LOCAL_BUILD_METADATA_DIST_PATHS = Object.freeze([
  `dist/.buildstamp`,
  `dist/.runtime-postbuildstamp`,
]);
const LOCAL_BUILD_METADATA_DIST_PATH_SET = new Set(LOCAL_BUILD_METADATA_DIST_PATHS);
/** Return whether a dist-relative path is local build metadata. */
function isLocalBuildMetadataDistPath(relativePath) {
  return LOCAL_BUILD_METADATA_DIST_PATH_SET.has(relativePath);
}
//#endregion
//#region src/infra/package-dist-inventory.ts
const PACKAGE_DIST_INVENTORY_RELATIVE_PATH = "dist/postinstall-inventory.json";
const PACKAGE_DIST_INVENTORY_SCAN_CONCURRENCY = 32;
const LEGACY_QA_CHANNEL_DIR = ["qa", "channel"].join("-");
const LEGACY_QA_LAB_DIR = ["qa", "lab"].join("-");
const OMITTED_QA_EXTENSION_PREFIXES = [
  `dist/extensions/${LEGACY_QA_CHANNEL_DIR}/`,
  `dist/extensions/${LEGACY_QA_LAB_DIR}/`,
  "dist/extensions/qa-matrix/",
];
const OMITTED_PRIVATE_QA_PLUGIN_SDK_PREFIXES = [
  `dist/plugin-sdk/extensions/${LEGACY_QA_CHANNEL_DIR}/`,
  `dist/plugin-sdk/extensions/${LEGACY_QA_LAB_DIR}/`,
];
const OMITTED_PRIVATE_QA_PLUGIN_SDK_FILES = /* @__PURE__ */ new Set([
  `dist/plugin-sdk/${LEGACY_QA_CHANNEL_DIR}.d.ts`,
  `dist/plugin-sdk/${LEGACY_QA_CHANNEL_DIR}.js`,
  `dist/plugin-sdk/${LEGACY_QA_CHANNEL_DIR}-protocol.d.ts`,
  `dist/plugin-sdk/${LEGACY_QA_CHANNEL_DIR}-protocol.js`,
  `dist/plugin-sdk/${LEGACY_QA_LAB_DIR}.d.ts`,
  `dist/plugin-sdk/${LEGACY_QA_LAB_DIR}.js`,
  "dist/plugin-sdk/qa-runtime.d.ts",
  "dist/plugin-sdk/qa-runtime.js",
  `dist/plugin-sdk/src/plugin-sdk/${LEGACY_QA_CHANNEL_DIR}.d.ts`,
  `dist/plugin-sdk/src/plugin-sdk/${LEGACY_QA_CHANNEL_DIR}-protocol.d.ts`,
  `dist/plugin-sdk/src/plugin-sdk/${LEGACY_QA_LAB_DIR}.d.ts`,
  "dist/plugin-sdk/src/plugin-sdk/qa-runtime.d.ts",
]);
const OMITTED_DEEP_PLUGIN_SDK_DECLARATION_PREFIX = "dist/plugin-sdk/src/";
const OMITTED_PRIVATE_QA_DIST_PREFIXES = ["dist/qa-runtime-"];
const OMITTED_PLUGIN_SDK_TEST_FILES = /* @__PURE__ */ new Set([
  "dist/plugin-sdk/agent-runtime-test-contracts.d.ts",
  "dist/plugin-sdk/agent-runtime-test-contracts.js",
  "dist/plugin-sdk/channel-contract-testing.d.ts",
  "dist/plugin-sdk/channel-contract-testing.js",
  "dist/plugin-sdk/channel-target-testing.d.ts",
  "dist/plugin-sdk/channel-target-testing.js",
  "dist/plugin-sdk/channel-test-helpers.d.ts",
  "dist/plugin-sdk/channel-test-helpers.js",
  "dist/plugin-sdk/plugin-test-api.d.ts",
  "dist/plugin-sdk/plugin-test-api.js",
  "dist/plugin-sdk/plugin-test-contracts.d.ts",
  "dist/plugin-sdk/plugin-test-contracts.js",
  "dist/plugin-sdk/plugin-test-runtime.d.ts",
  "dist/plugin-sdk/plugin-test-runtime.js",
  "dist/plugin-sdk/provider-http-test-mocks.d.ts",
  "dist/plugin-sdk/provider-http-test-mocks.js",
  "dist/plugin-sdk/provider-test-contracts.d.ts",
  "dist/plugin-sdk/provider-test-contracts.js",
  "dist/plugin-sdk/test-env.d.ts",
  "dist/plugin-sdk/test-env.js",
  "dist/plugin-sdk/test-fixtures.d.ts",
  "dist/plugin-sdk/test-fixtures.js",
  "dist/plugin-sdk/test-node-mocks.d.ts",
  "dist/plugin-sdk/test-node-mocks.js",
  "dist/plugin-sdk/testing.d.ts",
  "dist/plugin-sdk/testing.js",
]);
const OMITTED_PLUGIN_SDK_TEST_PREFIXES = [
  "dist/plugin-sdk/src/agents/test-helpers/",
  "dist/plugin-sdk/src/plugin-sdk/test-helpers/",
  "dist/plugin-sdk/src/test-helpers/",
  "dist/plugin-sdk/src/test-utils/",
];
const OMITTED_DIST_SUBTREE_PATTERNS = [
  /^dist\/extensions\/node_modules(?:\/|$)/u,
  /^dist\/extensions\/[^/]+\/node_modules(?:\/|$)/u,
  /^dist\/extensions\/qa-matrix(?:\/|$)/u,
  /^dist\/plugin-sdk\/src(?:\/|$)/u,
  new RegExp(`^dist/plugin-sdk/extensions/${LEGACY_QA_CHANNEL_DIR}(?:/|$)`, "u"),
  new RegExp(`^dist/plugin-sdk/extensions/${LEGACY_QA_LAB_DIR}(?:/|$)`, "u"),
];
function normalizeRelativePath(value) {
  return value.replace(/\\/g, "/");
}
function splitRelativePath(relativePath) {
  return normalizeRelativePath(relativePath).split("/");
}
function isLegacyPluginDependencyDirPath(relativePath) {
  const parts = splitRelativePath(relativePath);
  if (parts[0]?.toLowerCase() !== "dist" || parts[1]?.toLowerCase() !== "extensions") return false;
  if ((parts[2] ?? "").toLowerCase() === "node_modules") return true;
  return (parts[3] ?? "").toLowerCase() === "node_modules";
}
function escapeRegExp(value) {
  return value.replace(/[\\^$+?.()|[\]{}]/g, "\\$&");
}
function compilePackageFilesExclusionPattern(pattern) {
  let source = "^";
  for (let index = 0; index < pattern.length; index += 1) {
    const char = pattern[index];
    if (char === "*") {
      if (pattern[index + 1] === "*")
        if (pattern[index + 2] === "/") {
          source += "(?:[^/]+/)*";
          index += 2;
        } else {
          source += ".*";
          index += 1;
        }
      else source += "[^/]*";
      continue;
    }
    source += escapeRegExp(char ?? "");
  }
  source += "$";
  return new RegExp(source, "u");
}
function collectPackageDistInventoryRules(rootPackageJson) {
  if (!rootPackageJson || typeof rootPackageJson !== "object")
    return {
      externalizedExtensionIds: /* @__PURE__ */ new Set(),
      exclusions: {
        files: /* @__PURE__ */ new Set(),
        prefixes: [],
        patterns: [],
      },
    };
  const files = rootPackageJson.files;
  if (!Array.isArray(files))
    return {
      externalizedExtensionIds: /* @__PURE__ */ new Set(),
      exclusions: {
        files: /* @__PURE__ */ new Set(),
        prefixes: [],
        patterns: [],
      },
    };
  const externalizedExtensionIds = /* @__PURE__ */ new Set();
  const excludedFiles = /* @__PURE__ */ new Set();
  const excludedPrefixes = [];
  const excludedPatterns = [];
  for (const entry of files) {
    if (typeof entry !== "string") continue;
    const normalized = normalizeRelativePath(entry);
    const match = /^!dist\/extensions\/([^/]+)\/\*\*$/u.exec(normalized);
    if (match?.[1]) externalizedExtensionIds.add(match[1]);
    if (!normalized.startsWith("!dist/")) continue;
    const excludedPath = normalized.slice(1);
    if (excludedPath.endsWith("/**") && !excludedPath.slice(0, -3).includes("*"))
      excludedPrefixes.push(excludedPath.slice(0, -2));
    else if (excludedPath.includes("*"))
      excludedPatterns.push(compilePackageFilesExclusionPattern(excludedPath));
    else excludedFiles.add(excludedPath);
  }
  return {
    externalizedExtensionIds,
    exclusions: {
      files: excludedFiles,
      prefixes: excludedPrefixes.toSorted((left, right) => left.localeCompare(right)),
      patterns: excludedPatterns,
    },
  };
}
function isExternalizedBundledExtensionDistPath(relativePath, externalizedExtensionIds) {
  if (externalizedExtensionIds.size === 0) return false;
  const parts = normalizeRelativePath(relativePath).split("/");
  return (
    parts.length >= 3 &&
    parts[0] === "dist" &&
    parts[1] === "extensions" &&
    Boolean(parts[2]) &&
    externalizedExtensionIds.has(parts[2] ?? "")
  );
}
function isOmittedPluginSdkTestPath(relativePath) {
  return (
    OMITTED_PLUGIN_SDK_TEST_FILES.has(relativePath) ||
    OMITTED_PLUGIN_SDK_TEST_PREFIXES.some(
      (prefix) => relativePath === prefix.slice(0, -1) || relativePath.startsWith(prefix),
    )
  );
}
async function collectPackageDistInventoryRulesForRoot(packageRoot) {
  return collectPackageDistInventoryRules(
    await readJsonIfExists(path.join(packageRoot, "package.json")),
  );
}
function isPackageFilesExcludedDistPath(relativePath, exclusions) {
  return (
    exclusions.files.has(relativePath) ||
    exclusions.prefixes.some((prefix) => relativePath.startsWith(prefix)) ||
    exclusions.patterns.some((pattern) => pattern.test(relativePath))
  );
}
function isPackagedDistPath(relativePath, rules) {
  if (!relativePath.startsWith("dist/")) return false;
  if (isExternalizedBundledExtensionDistPath(relativePath, rules.externalizedExtensionIds))
    return false;
  if (isPackageFilesExcludedDistPath(relativePath, rules.exclusions)) return false;
  if (isLegacyPluginDependencyDirPath(relativePath)) return false;
  if (relativePath === "dist/postinstall-inventory.json") return false;
  if (isLocalBuildMetadataDistPath(relativePath)) return false;
  if (relativePath.endsWith(".map")) return false;
  if (relativePath === "dist/plugin-sdk/.tsbuildinfo") return false;
  if (isOmittedPluginSdkTestPath(relativePath)) return false;
  if (relativePath.startsWith(OMITTED_DEEP_PLUGIN_SDK_DECLARATION_PREFIX)) return false;
  if (
    OMITTED_PRIVATE_QA_PLUGIN_SDK_PREFIXES.some((prefix) => relativePath.startsWith(prefix)) ||
    OMITTED_PRIVATE_QA_PLUGIN_SDK_FILES.has(relativePath) ||
    OMITTED_PRIVATE_QA_DIST_PREFIXES.some((prefix) => relativePath.startsWith(prefix))
  )
    return false;
  if (OMITTED_QA_EXTENSION_PREFIXES.some((prefix) => relativePath.startsWith(prefix))) return false;
  return true;
}
function isPackageFilesExcludedDistSubtree(relativePath, exclusions) {
  return isPackageFilesExcludedDistPath(`${relativePath}/`, exclusions);
}
function isOmittedDistSubtree(relativePath, rules) {
  return (
    isExternalizedBundledExtensionDistPath(relativePath, rules.externalizedExtensionIds) ||
    isPackageFilesExcludedDistSubtree(relativePath, rules.exclusions) ||
    isLegacyPluginDependencyDirPath(relativePath) ||
    isOmittedPluginSdkTestPath(relativePath) ||
    OMITTED_DIST_SUBTREE_PATTERNS.some((pattern) => pattern.test(relativePath))
  );
}
async function collectRelativeFiles(rootDir, baseDir, rules, fsLimit) {
  const rootRelativePath = normalizeRelativePath(path.relative(baseDir, rootDir));
  if (rootRelativePath && isOmittedDistSubtree(rootRelativePath, rules)) return [];
  try {
    const rootStats = await fsLimit(() => fs.lstat(rootDir));
    if (!rootStats.isDirectory() || rootStats.isSymbolicLink())
      throw new Error(
        `Unsafe package dist path: ${normalizeRelativePath(path.relative(baseDir, rootDir))}`,
      );
    const entries = await fsLimit(() => fs.readdir(rootDir, { withFileTypes: true }));
    return (
      await Promise.all(
        entries.map(async (entry) => {
          const entryPath = path.join(rootDir, entry.name);
          const relativePath = normalizeRelativePath(path.relative(baseDir, entryPath));
          if (entry.isSymbolicLink()) throw new Error(`Unsafe package dist path: ${relativePath}`);
          if (entry.isDirectory())
            return await collectRelativeFiles(entryPath, baseDir, rules, fsLimit);
          if (entry.isFile()) return isPackagedDistPath(relativePath, rules) ? [relativePath] : [];
          return [];
        }),
      )
    )
      .flat()
      .toSorted((left, right) => left.localeCompare(right));
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}
/** Collects package dist files that should be present after install/update publication. */
async function collectPackageDistInventory(packageRoot) {
  const rules = await collectPackageDistInventoryRulesForRoot(packageRoot);
  const fsLimit = pLimit(PACKAGE_DIST_INVENTORY_SCAN_CONCURRENCY);
  return await collectRelativeFiles(path.join(packageRoot, "dist"), packageRoot, rules, fsLimit);
}
async function readPackageDistInventoryOptional(packageRoot) {
  const parsed = await readJsonIfExists(
    path.join(packageRoot, PACKAGE_DIST_INVENTORY_RELATIVE_PATH),
  );
  if (parsed === null) return null;
  if (!Array.isArray(parsed) || parsed.some((entry) => typeof entry !== "string"))
    throw new Error(`Invalid package dist inventory at ${PACKAGE_DIST_INVENTORY_RELATIVE_PATH}`);
  return sortUniqueStrings(parsed.map(normalizeRelativePath));
}
/** Reads an existing package dist inventory, returning null when the inventory is absent. */
async function readPackageDistInventoryIfPresent(packageRoot) {
  return await readPackageDistInventoryOptional(packageRoot);
}
//#endregion
export {
  collectPackageDistInventory as n,
  readPackageDistInventoryIfPresent as r,
  PACKAGE_DIST_INVENTORY_RELATIVE_PATH as t,
};
