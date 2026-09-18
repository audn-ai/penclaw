import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import dotenv from "dotenv";
import { o as resolveRequiredHomeDir } from "./home-dir-DxrrpDft.js";
import { a as normalizeEnvVarKey } from "./host-env-security-pMY6K0Qy.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { d as resolveConfigDir } from "./utils-DtcDeqWS.js";
//#region src/infra/dotenv-global.ts
const logger = createSubsystemLogger("infra:dotenv");
function readDotEnvFile(params) {
  let content;
  try {
    content = fs.readFileSync(params.filePath, "utf8");
  } catch (error) {
    if (!params.quiet) {
      if (
        (error && typeof error === "object" && "code" in error ? String(error.code) : void 0) !==
        "ENOENT"
      )
        logger.warn(`Failed to read ${params.filePath}: ${String(error)}`, { error });
    }
    return null;
  }
  let parsed;
  try {
    parsed = dotenv.parse(content);
  } catch (error) {
    if (!params.quiet)
      logger.warn(`Failed to parse ${params.filePath}: ${String(error)}`, { error });
    return null;
  }
  const entries = [];
  for (const [rawKey, value] of Object.entries(parsed)) {
    const key = normalizeEnvVarKey(rawKey, { portable: true });
    if (key && (params.entryFilter?.(key, value) ?? true))
      entries.push({
        key,
        value,
      });
  }
  return {
    filePath: params.filePath,
    entries,
  };
}
function loadParsedDotEnvFiles(files) {
  const preExistingKeys = new Set(Object.keys(process.env));
  const conflicts = /* @__PURE__ */ new Map();
  const firstSeen = /* @__PURE__ */ new Map();
  const appliedKeysByFile = /* @__PURE__ */ new Map();
  for (const file of files)
    for (const { key, value } of file.entries) {
      if (preExistingKeys.has(key)) continue;
      const previous = firstSeen.get(key);
      if (previous) {
        if (previous.value !== value) {
          const conflictKey = `${previous.filePath}\u0000${file.filePath}`;
          const existing = conflicts.get(conflictKey);
          if (existing) existing.keys.add(key);
          else
            conflicts.set(conflictKey, {
              keptPath: previous.filePath,
              ignoredPath: file.filePath,
              keys: /* @__PURE__ */ new Set([key]),
            });
        }
        continue;
      }
      firstSeen.set(key, {
        value,
        filePath: file.filePath,
      });
      if (process.env[key] === void 0) {
        process.env[key] = value;
        const appliedKeys = appliedKeysByFile.get(file.filePath);
        if (appliedKeys) appliedKeys.push(key);
        else appliedKeysByFile.set(file.filePath, [key]);
      }
    }
  for (const conflict of conflicts.values()) {
    const keys = [...conflict.keys].toSorted();
    if (keys.length === 0) continue;
    logger.warn(
      `Conflicting values in ${conflict.keptPath} and ${conflict.ignoredPath} for ${keys.join(", ")}; keeping ${conflict.keptPath}.`,
      {
        keptPath: conflict.keptPath,
        ignoredPath: conflict.ignoredPath,
        keys,
      },
    );
  }
  return appliedKeysByFile;
}
/** Load global runtime dotenv files into `process.env` with first-wins precedence. */
function loadGlobalRuntimeDotEnvFiles(opts) {
  const quiet = opts?.quiet ?? true;
  const stateEnvPath = opts?.stateEnvPath ?? path.join(resolveConfigDir(process.env), ".env");
  const globalEnvPaths = [
    .../* @__PURE__ */ new Set([stateEnvPath, ...(opts?.additionalEnvPaths ?? [])]),
  ];
  const defaultStateEnvPath = path.join(
    resolveRequiredHomeDir(process.env, os.homedir),
    ".openclaw",
    ".env",
  );
  const hasExplicitNonDefaultStateDir =
    process.env.OPENCLAW_STATE_DIR?.trim() !== void 0 &&
    path.resolve(stateEnvPath) !== path.resolve(defaultStateEnvPath);
  const globalEnvs = globalEnvPaths.map((filePath) =>
    readDotEnvFile({
      entryFilter: opts?.entryFilter,
      filePath,
      quiet,
    }),
  );
  const parsedFiles = [...globalEnvs];
  let gatewayEnv = null;
  if (!hasExplicitNonDefaultStateDir) {
    gatewayEnv = readDotEnvFile({
      entryFilter: opts?.entryFilter,
      filePath: path.join(
        resolveRequiredHomeDir(process.env, os.homedir),
        ".config",
        "openclaw",
        "gateway.env",
      ),
      quiet,
    });
    parsedFiles.push(gatewayEnv);
  }
  const appliedKeysByFile = loadParsedDotEnvFiles(parsedFiles.filter((file) => file !== null));
  return {
    stateEnvAppliedKeys: globalEnvs.flatMap((file) =>
      file ? (appliedKeysByFile.get(file.filePath) ?? []) : [],
    ),
    gatewayEnvAppliedKeys: gatewayEnv ? (appliedKeysByFile.get(gatewayEnv.filePath) ?? []) : [],
  };
}
//#endregion
export { readDotEnvFile as n, loadGlobalRuntimeDotEnvFiles as t };
