import path from "node:path";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import { i as redactSecrets, u as redactToolPayloadText } from "./redact-CUe6Oey5.js";
//#region src/config/redact-argv.ts
const SECRET_FLAG_NAMES = /* @__PURE__ */ new Set([
  "--token",
  "--api-key",
  "--apikey",
  "--secret",
  "--password",
  "--passwd",
  "--auth-token",
  "--access-token",
  "--refresh-token",
  "--client-secret",
  "--hook-token",
  "--gateway-token",
  "--bot-token",
  "--app-token",
  "--remote-token",
  "--push-token",
  "--webhook-secret",
  "--webhook-token",
  "--service-account-token",
  "--op-service-account-token",
  "--bearer",
  "--bearer-token",
  "--pat",
  "--personal-access-token",
  "--oauth-token",
  "--id-token",
  "--identity-token",
  "--session-token",
  "--service-token",
  "--private-key",
  "--recovery-key",
  "--gateway-key",
  "--session-key",
  "--active-key",
]);
const SECRET_FLAG_SUFFIX_PATTERN =
  /^--(?:[a-z0-9]+(?:[-_][a-z0-9]+)*[-_])?(?:token|secret|password|passwd|passphrase|pin|api[-_]?key|api[-_]?secret|secret[-_]?key|secret[-_]?access[-_]?key|access[-_]?key(?:[-_]?id)?|account[-_]?key|client[-_]?key|consumer[-_]?key|license[-_]?key|subscription[-_]?key|webhook|credentials?|creds?|auth(?:orization)?|bearer|pat|cookie|private[-_]?key|recovery[-_]?key|signing[-_]?key|encryption[-_]?key|master[-_]?key|session[-_]?key|gateway[-_]?key|service[-_]?key|hook[-_]?key)$/;
function parseFlagName(arg) {
  if (!arg.startsWith("--")) return null;
  const equalsIndex = arg.indexOf("=");
  return (equalsIndex === -1 ? arg : arg.slice(0, equalsIndex)).toLowerCase();
}
function isSecretFlagName(flagName) {
  return SECRET_FLAG_NAMES.has(flagName) || SECRET_FLAG_SUFFIX_PATTERN.test(flagName);
}
/**
 * Redacts recognized argv secrets without changing array length or non-secret flags.
 * Known secret flags bind the next value even when it begins with a dash; other
 * elements use the shared deterministic secret-text patterns.
 */
function redactSensitiveArgv(argv, redactedValue) {
  const replacement = redactedValue ?? "***";
  const result = [];
  let redactNext = false;
  for (const current of argv) {
    if (redactNext) {
      redactNext = false;
      result.push(replacement);
      continue;
    }
    const currentFlag = parseFlagName(current);
    if (currentFlag !== null && isSecretFlagName(currentFlag)) {
      const equalsIndex = current.indexOf("=");
      if (equalsIndex !== -1) {
        result.push(`${current.slice(0, equalsIndex + 1)}${replacement}`);
        continue;
      }
      result.push(current);
      redactNext = true;
      continue;
    }
    const redacted = redactToolPayloadText(current);
    result.push(redacted === current ? current : (redactedValue ?? redacted));
  }
  return result;
}
//#endregion
//#region src/config/io.audit.ts
const CONFIG_AUDIT_ARGV_CAP = 8;
function redactConfigAuditArgv(argv) {
  return redactSensitiveArgv(argv);
}
function capArgv(argv) {
  if (!Array.isArray(argv)) return [];
  return argv.slice(0, CONFIG_AUDIT_ARGV_CAP);
}
function snapshotConfigAuditProcessInfo() {
  return {
    pid: process.pid,
    ppid: process.ppid,
    cwd: process.cwd(),
    argv: redactConfigAuditArgv(capArgv(process.argv)),
    execArgv: redactConfigAuditArgv(capArgv(process.execArgv)),
  };
}
const CONFIG_AUDIT_LOG_FILENAME = "config-audit.jsonl";
function normalizeAuditLabel(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
function resolveConfigAuditProcessInfo(processInfo) {
  if (processInfo)
    return {
      ...processInfo,
      argv: redactConfigAuditArgv(capArgv(processInfo.argv)),
      execArgv: redactConfigAuditArgv(capArgv(processInfo.execArgv)),
    };
  return snapshotConfigAuditProcessInfo();
}
function resolveConfigAuditLogPath(env, homedir) {
  return path.join(resolveStateDir(env, homedir), "logs", CONFIG_AUDIT_LOG_FILENAME);
}
function formatConfigOverwriteLogMessage(params) {
  const changeSummary =
    typeof params.changedPathCount === "number" ? `, changedPaths=${params.changedPathCount}` : "";
  return `Config overwrite: ${params.configPath} (sha256 ${params.previousHash ?? "unknown"} -> ${params.nextHash}, backup=${params.configPath}.bak${changeSummary})`;
}
function createConfigWriteAuditRecordBase(params) {
  const processSnapshot = resolveConfigAuditProcessInfo(params.processInfo);
  return {
    ts: params.now ?? /* @__PURE__ */ new Date().toISOString(),
    source: "config-io",
    event: "config.write",
    configPath: params.configPath,
    pid: processSnapshot.pid,
    ppid: processSnapshot.ppid,
    cwd: processSnapshot.cwd,
    argv: processSnapshot.argv,
    execArgv: processSnapshot.execArgv,
    watchMode: params.env.OPENCLAW_WATCH_MODE === "1",
    watchSession: normalizeAuditLabel(params.env.OPENCLAW_WATCH_SESSION),
    watchCommand: normalizeAuditLabel(params.env.OPENCLAW_WATCH_COMMAND),
    existsBefore: params.existsBefore,
    previousHash: params.previousHash,
    nextHash: params.nextHash,
    previousBytes: params.previousBytes,
    nextBytes: params.nextBytes,
    previousDev: params.previousMetadata.dev,
    previousIno: params.previousMetadata.ino,
    previousMode: params.previousMetadata.mode,
    previousNlink: params.previousMetadata.nlink,
    previousUid: params.previousMetadata.uid,
    previousGid: params.previousMetadata.gid,
    changedPathCount: typeof params.changedPathCount === "number" ? params.changedPathCount : null,
    hasMetaBefore: params.hasMetaBefore,
    hasMetaAfter: params.hasMetaAfter,
    gatewayModeBefore: params.gatewayModeBefore,
    gatewayModeAfter: params.gatewayModeAfter,
    suspicious: params.suspicious,
  };
}
function finalizeConfigWriteAuditRecord(params) {
  const errorCode =
    params.err &&
    typeof params.err === "object" &&
    "code" in params.err &&
    typeof params.err.code === "string"
      ? params.err.code
      : void 0;
  const errorMessage =
    params.err &&
    typeof params.err === "object" &&
    "message" in params.err &&
    typeof params.err.message === "string"
      ? params.err.message
      : void 0;
  const nextMetadata = params.nextMetadata ?? {
    dev: null,
    ino: null,
    mode: null,
    nlink: null,
    uid: null,
    gid: null,
  };
  const success = params.result !== "failed" && params.result !== "rejected";
  return {
    ...params.base,
    result: params.result,
    nextHash: success ? params.base.nextHash : null,
    nextBytes: success ? params.base.nextBytes : null,
    nextDev: success ? nextMetadata.dev : null,
    nextIno: success ? nextMetadata.ino : null,
    nextMode: success ? nextMetadata.mode : null,
    nextNlink: success ? nextMetadata.nlink : null,
    nextUid: success ? nextMetadata.uid : null,
    nextGid: success ? nextMetadata.gid : null,
    errorCode,
    errorMessage,
  };
}
function resolveConfigAuditAppendRecord(params) {
  if ("record" in params) return redactSecrets(params.record);
  const { fs: _fs, env: _env, homedir: _homedir, ...record } = params;
  return redactSecrets(record);
}
async function scrubConfigAuditLog(params) {
  const auditPath = resolveConfigAuditLogPath(params.env, params.homedir);
  let raw;
  try {
    raw = await params.fs.promises.readFile(auditPath, "utf-8");
  } catch (err) {
    if (err?.code === "ENOENT")
      return {
        scanned: 0,
        rewritten: 0,
        skipped: 0,
        aborted: false,
      };
    throw err;
  }
  const originalByteLength = Buffer.byteLength(raw, "utf-8");
  let scanned = 0;
  let rewritten = 0;
  let skipped = 0;
  let changed = false;
  const outLines = [];
  const lines = raw.split("\n");
  for (const line of lines) {
    if (line.length === 0) {
      outLines.push(line);
      continue;
    }
    scanned += 1;
    let record;
    try {
      record = JSON.parse(line);
    } catch {
      outLines.push(line);
      skipped += 1;
      continue;
    }
    if (!record || typeof record !== "object" || Array.isArray(record)) {
      outLines.push(line);
      skipped += 1;
      continue;
    }
    const obj = record;
    let mutated = false;
    for (const key of ["argv", "execArgv"]) {
      const value = obj[key];
      if (!Array.isArray(value)) continue;
      if (!value.every((entry) => typeof entry === "string")) continue;
      const redacted = redactConfigAuditArgv(value);
      let differs = false;
      for (let i = 0; i < redacted.length; i++)
        if (redacted[i] !== value[i]) {
          differs = true;
          break;
        }
      if (differs) {
        obj[key] = redacted;
        mutated = true;
      }
    }
    if (mutated) {
      rewritten += 1;
      changed = true;
      outLines.push(JSON.stringify(obj));
    } else outLines.push(line);
  }
  if (!changed || params.dryRun)
    return {
      scanned,
      rewritten,
      skipped,
      aborted: false,
    };
  let preRenameSize;
  try {
    preRenameSize = (await params.fs.promises.stat(auditPath)).size;
  } catch {
    return {
      scanned,
      rewritten,
      skipped,
      aborted: true,
    };
  }
  if (preRenameSize !== originalByteLength)
    return {
      scanned,
      rewritten,
      skipped,
      aborted: true,
    };
  const tmpPath = `${auditPath}.scrub.tmp`;
  try {
    await params.fs.promises.writeFile(tmpPath, outLines.join("\n"), {
      encoding: "utf-8",
      mode: 384,
    });
    let finalPreRenameSize;
    try {
      finalPreRenameSize = (await params.fs.promises.stat(auditPath)).size;
    } catch {
      try {
        await params.fs.promises.unlink(tmpPath);
      } catch {}
      return {
        scanned,
        rewritten,
        skipped,
        aborted: true,
      };
    }
    if (finalPreRenameSize !== originalByteLength) {
      try {
        await params.fs.promises.unlink(tmpPath);
      } catch {}
      return {
        scanned,
        rewritten,
        skipped,
        aborted: true,
      };
    }
    await params.fs.promises.rename(tmpPath, auditPath);
  } catch (err) {
    try {
      await params.fs.promises.unlink(tmpPath);
    } catch {}
    throw err;
  }
  return {
    scanned,
    rewritten,
    skipped,
    aborted: false,
  };
}
async function appendConfigAuditRecord(params) {
  try {
    const auditPath = resolveConfigAuditLogPath(params.env, params.homedir);
    const record = resolveConfigAuditAppendRecord(params);
    await params.fs.promises.mkdir(path.dirname(auditPath), {
      recursive: true,
      mode: 448,
    });
    await params.fs.promises.appendFile(auditPath, `${JSON.stringify(record)}\n`, {
      encoding: "utf-8",
      mode: 384,
    });
  } catch {}
}
function appendConfigAuditRecordSync(params) {
  try {
    const auditPath = resolveConfigAuditLogPath(params.env, params.homedir);
    const record = resolveConfigAuditAppendRecord(params);
    params.fs.mkdirSync(path.dirname(auditPath), {
      recursive: true,
      mode: 448,
    });
    params.fs.appendFileSync(auditPath, `${JSON.stringify(record)}\n`, {
      encoding: "utf-8",
      mode: 384,
    });
  } catch {}
}
//#endregion
export {
  formatConfigOverwriteLogMessage as a,
  snapshotConfigAuditProcessInfo as c,
  finalizeConfigWriteAuditRecord as i,
  redactSensitiveArgv as l,
  appendConfigAuditRecordSync as n,
  resolveConfigAuditLogPath as o,
  createConfigWriteAuditRecordBase as r,
  scrubConfigAuditLog as s,
  appendConfigAuditRecord as t,
};
