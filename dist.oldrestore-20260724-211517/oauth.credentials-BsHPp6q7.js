import { existsSync, readFileSync, readdirSync, realpathSync } from "node:fs";
import "./string-coerce-runtime-BUe4iD0r.js";
import { delimiter, dirname, join } from "node:path";
import { n as CLIENT_ID_KEYS, r as CLIENT_SECRET_KEYS } from "./oauth.shared-BD6M390i.js";
import { r as lowercasePreservingWhitespace } from "./string-coerce-DW4mBlAt.js";
//#region extensions/google/oauth.credentials.ts
const defaultFs = {
  existsSync,
  readFileSync,
  realpathSync,
  readdirSync,
};
let credentialFs = defaultFs;
const GEMINI_CLI_TREE_SEARCH_DEPTH = 10;
function resolveEnv(keys) {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
}
let cachedGeminiCliCredentials = null;
let geminiCliCredentialExtractError = null;
function clearCredentialsCache() {
  cachedGeminiCliCredentials = null;
  geminiCliCredentialExtractError = null;
}
function setOAuthCredentialsFsForTest(overrides) {
  credentialFs = overrides
    ? {
        ...defaultFs,
        ...overrides,
      }
    : defaultFs;
}
function extractGeminiCliCredentials() {
  if (cachedGeminiCliCredentials) return cachedGeminiCliCredentials;
  geminiCliCredentialExtractError = null;
  const diagnostics = {
    searchedPaths: [],
    recursiveSearchRoots: [],
    parseFailures: [],
    readErrors: [],
  };
  try {
    const geminiPath = findInPath("gemini");
    if (!geminiPath) {
      geminiCliCredentialExtractError =
        "Gemini CLI binary was not found in PATH during OAuth credential extraction.";
      return null;
    }
    const resolvedPath = credentialFs.realpathSync(geminiPath);
    const geminiCliDirs = resolveGeminiCliDirs(geminiPath, resolvedPath);
    for (const geminiCliDir of geminiCliDirs) {
      const directCredentials = readGeminiCliCredentialsFromKnownPaths(geminiCliDir, diagnostics);
      if (directCredentials) {
        cachedGeminiCliCredentials = directCredentials;
        return directCredentials;
      }
      const bundledCredentials = readGeminiCliCredentialsFromBundle(geminiCliDir, diagnostics);
      if (bundledCredentials) {
        cachedGeminiCliCredentials = bundledCredentials;
        return bundledCredentials;
      }
      diagnostics.recursiveSearchRoots.push(geminiCliDir);
      const discoveredCredentials = findGeminiCliCredentialsInTree(
        geminiCliDir,
        GEMINI_CLI_TREE_SEARCH_DEPTH,
        diagnostics,
      );
      if (discoveredCredentials) {
        cachedGeminiCliCredentials = discoveredCredentials;
        return discoveredCredentials;
      }
    }
    geminiCliCredentialExtractError = formatGeminiCliCredentialExtractError({
      geminiPath,
      resolvedPath,
      diagnostics,
    });
  } catch (error) {
    geminiCliCredentialExtractError = `Unexpected error while extracting Gemini CLI OAuth credentials: ${formatError(error)}`;
  }
  return null;
}
function formatGeminiCliCredentialExtractError({ geminiPath, resolvedPath, diagnostics }) {
  const prefix = [
    "Found Gemini CLI in PATH, but could not extract OAuth credentials.",
    `geminiPath=${geminiPath}`,
    `resolvedPath=${resolvedPath}`,
  ];
  if (diagnostics.parseFailures.length > 0)
    return [
      ...prefix,
      "Candidate credential files did not contain a parseable OAuth client id/secret.",
      `candidates=${diagnostics.parseFailures.join(", ")}`,
    ].join(" ");
  if (diagnostics.readErrors.length > 0)
    return [
      ...prefix,
      "Unexpected errors occurred while reading candidate credential files/directories.",
      `errors=${diagnostics.readErrors.join(", ")}`,
    ].join(" ");
  return [
    ...prefix,
    "Could not locate oauth2.js or bundled credential source.",
    `searched=${diagnostics.searchedPaths.join(", ") || "(none)"}`,
    `recursiveSearchRoots=${diagnostics.recursiveSearchRoots.join(", ") || "(none)"}`,
    `recursiveSearchDepth=${GEMINI_CLI_TREE_SEARCH_DEPTH}`,
  ].join(" ");
}
function formatError(error) {
  return error instanceof Error ? error.message : String(error);
}
function resolveGeminiCliDirs(geminiPath, resolvedPath) {
  const binDir = dirname(geminiPath);
  const candidates = [
    dirname(dirname(resolvedPath)),
    join(dirname(resolvedPath), "node_modules", "@google", "gemini-cli"),
    join(binDir, "node_modules", "@google", "gemini-cli"),
    join(dirname(binDir), "node_modules", "@google", "gemini-cli"),
    join(dirname(binDir), "lib", "node_modules", "@google", "gemini-cli"),
  ];
  const deduped = [];
  const seen = /* @__PURE__ */ new Set();
  for (const candidate of candidates)
    for (const searchDir of resolveGeminiCliSearchDirs(candidate)) {
      const key =
        process.platform === "win32"
          ? lowercasePreservingWhitespace(searchDir.replace(/\\/g, "/"))
          : searchDir;
      if (seen.has(key)) continue;
      seen.add(key);
      deduped.push(searchDir);
    }
  return deduped;
}
function resolveGeminiCliSearchDirs(candidate) {
  return [
    candidate,
    join(candidate, "node_modules", "@google", "gemini-cli"),
    join(candidate, "lib", "node_modules", "@google", "gemini-cli"),
  ].filter(looksLikeGeminiCliDir);
}
function looksLikeGeminiCliDir(candidate) {
  return (
    credentialFs.existsSync(join(candidate, "package.json")) ||
    credentialFs.existsSync(join(candidate, "node_modules", "@google", "gemini-cli-core"))
  );
}
function findInPath(name) {
  const exts = process.platform === "win32" ? [".cmd", ".bat", ".exe", ""] : [""];
  for (const dir of (process.env.PATH ?? "").split(delimiter))
    for (const ext of exts) {
      const path = join(dir, name + ext);
      if (credentialFs.existsSync(path)) return path;
    }
  return null;
}
function readGeminiCliCredentialsFile(path, diagnostics) {
  try {
    const credentials = parseGeminiCliCredentials(credentialFs.readFileSync(path, "utf8"));
    if (!credentials) diagnostics.parseFailures.push(path);
    return credentials;
  } catch (error) {
    diagnostics.readErrors.push(`${path}: ${formatError(error)}`);
    return null;
  }
}
function parseGeminiCliCredentials(content) {
  const clientId =
    content.match(/OAUTH_CLIENT_ID\s*=\s*["']([^"']+)["']/)?.[1] ??
    content.match(/(\d+-[a-z0-9]+\.apps\.googleusercontent\.com)/)?.[1];
  const clientSecret =
    content.match(/OAUTH_CLIENT_SECRET\s*=\s*["']([^"']+)["']/)?.[1] ??
    content.match(/(GOCSPX-[A-Za-z0-9_-]+)/)?.[1];
  if (!clientId || !clientSecret) return null;
  return {
    clientId,
    clientSecret,
  };
}
function readGeminiCliCredentialsFromKnownPaths(geminiCliDir, diagnostics) {
  const searchPaths = [
    join(
      geminiCliDir,
      "node_modules",
      "@google",
      "gemini-cli-core",
      "dist",
      "src",
      "code_assist",
      "oauth2.js",
    ),
    join(
      geminiCliDir,
      "node_modules",
      "@google",
      "gemini-cli-core",
      "dist",
      "code_assist",
      "oauth2.js",
    ),
  ];
  diagnostics.searchedPaths.push(...searchPaths);
  for (const path of searchPaths) {
    if (!credentialFs.existsSync(path)) continue;
    const credentials = readGeminiCliCredentialsFile(path, diagnostics);
    if (credentials) return credentials;
  }
  return null;
}
function readGeminiCliCredentialsFromBundle(geminiCliDir, diagnostics) {
  const bundleDir = join(geminiCliDir, "bundle");
  if (!credentialFs.existsSync(bundleDir)) return null;
  try {
    for (const entry of credentialFs.readdirSync(bundleDir, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith(".js")) continue;
      const credentials = readGeminiCliCredentialsFile(join(bundleDir, entry.name), diagnostics);
      if (credentials) return credentials;
    }
  } catch (error) {
    diagnostics.readErrors.push(`${bundleDir}: ${formatError(error)}`);
  }
  return null;
}
function findGeminiCliCredentialsInTree(dir, depth, diagnostics) {
  if (depth <= 0) return null;
  try {
    for (const entry of credentialFs.readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isFile() && entry.name === "oauth2.js") {
        const credentials = readGeminiCliCredentialsFile(path, diagnostics);
        if (credentials) return credentials;
        continue;
      }
      if (entry.isDirectory() && !entry.name.startsWith(".")) {
        const found = findGeminiCliCredentialsInTree(path, depth - 1, diagnostics);
        if (found) return found;
      }
    }
  } catch (error) {
    diagnostics.readErrors.push(`${dir}: ${formatError(error)}`);
  }
  return null;
}
function resolveOAuthClientConfig() {
  const envClientId = resolveEnv(CLIENT_ID_KEYS);
  const envClientSecret = resolveEnv(CLIENT_SECRET_KEYS);
  if (envClientId)
    return {
      clientId: envClientId,
      clientSecret: envClientSecret,
    };
  const extracted = extractGeminiCliCredentials();
  if (extracted) return extracted;
  const detail = geminiCliCredentialExtractError
    ? ` Details: ${geminiCliCredentialExtractError}`
    : "";
  throw new Error(
    `Gemini CLI not found. Install it first: brew install gemini-cli (or npm install -g @google/gemini-cli), or set GEMINI_CLI_OAUTH_CLIENT_ID.${detail}`,
  );
}
//#endregion
export {
  setOAuthCredentialsFsForTest as i,
  extractGeminiCliCredentials as n,
  resolveOAuthClientConfig as r,
  clearCredentialsCache as t,
};
