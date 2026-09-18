import fs from "node:fs";
import path from "node:path";
import { n as parseExecArgvToken } from "./exec-command-resolution-CApTmCLK.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import {
  _ as uniqueStrings,
  g as sortUniqueStrings,
  s as normalizeSortedUniqueStringEntries,
} from "./string-normalization-CRyoFBPt.js";
//#region src/infra/exec-safe-bin-policy-profiles.ts
const NO_FLAGS$1 = /* @__PURE__ */ new Set();
const DEFAULT_SAFE_BINS = ["cut", "uniq", "head", "tail", "tr", "wc"];
const toFlagSet = (flags) => {
  if (!flags || flags.length === 0) return NO_FLAGS$1;
  return new Set(flags);
};
function collectKnownLongFlags(allowedValueFlags, deniedFlags, allowedBooleanFlags = NO_FLAGS$1) {
  const known = /* @__PURE__ */ new Set();
  for (const flag of allowedValueFlags) if (flag.startsWith("--")) known.add(flag);
  for (const flag of allowedBooleanFlags) if (flag.startsWith("--")) known.add(flag);
  for (const flag of deniedFlags) if (flag.startsWith("--")) known.add(flag);
  return Array.from(known);
}
function buildLongFlagPrefixMap(knownLongFlags) {
  const prefixMap = /* @__PURE__ */ new Map();
  for (const flag of knownLongFlags) {
    if (!flag.startsWith("--") || flag.length <= 2) continue;
    for (let length = 3; length <= flag.length; length += 1) {
      const prefix = flag.slice(0, length);
      const existing = prefixMap.get(prefix);
      if (existing === void 0) {
        prefixMap.set(prefix, flag);
        continue;
      }
      if (existing !== flag) prefixMap.set(prefix, null);
    }
  }
  return prefixMap;
}
function compileSafeBinProfile(fixture) {
  const allowedValueFlags = toFlagSet(fixture.allowedValueFlags);
  const allowedBooleanFlags = toFlagSet(fixture.allowedBooleanFlags);
  const deniedFlags = toFlagSet(fixture.deniedFlags);
  const knownLongFlags = collectKnownLongFlags(allowedValueFlags, deniedFlags, allowedBooleanFlags);
  return {
    minPositional: fixture.minPositional,
    maxPositional: fixture.maxPositional,
    allowedValueFlags,
    allowedBooleanFlags,
    deniedFlags,
    knownLongFlags,
    knownLongFlagsSet: new Set(knownLongFlags),
    longFlagPrefixMap: buildLongFlagPrefixMap(knownLongFlags),
  };
}
function compileSafeBinProfiles(fixtures) {
  return Object.fromEntries(
    Object.entries(fixtures).map(([name, fixture]) => [name, compileSafeBinProfile(fixture)]),
  );
}
const SAFE_BIN_PROFILES = compileSafeBinProfiles({
  jq: {
    maxPositional: 1,
    allowedValueFlags: ["--arg", "--argjson", "--argstr"],
    deniedFlags: [
      "--argfile",
      "--rawfile",
      "--slurpfile",
      "--from-file",
      "--library-path",
      "-L",
      "-f",
    ],
  },
  grep: {
    maxPositional: 0,
    allowedValueFlags: [
      "--regexp",
      "--max-count",
      "--after-context",
      "--before-context",
      "--context",
      "--devices",
      "--binary-files",
      "--exclude",
      "--include",
      "--label",
      "-e",
      "-m",
      "-A",
      "-B",
      "-C",
      "-D",
    ],
    deniedFlags: [
      "--file",
      "--exclude-from",
      "--dereference-recursive",
      "--directories",
      "--recursive",
      "-f",
      "-d",
      "-r",
      "-R",
    ],
  },
  cut: {
    maxPositional: 0,
    allowedValueFlags: [
      "--bytes",
      "--characters",
      "--fields",
      "--delimiter",
      "--output-delimiter",
      "-b",
      "-c",
      "-f",
      "-d",
    ],
    allowedBooleanFlags: [
      "--complement",
      "--only-delimited",
      "--zero-terminated",
      "-n",
      "-s",
      "-z",
    ],
  },
  sort: {
    maxPositional: 0,
    allowedValueFlags: [
      "--key",
      "--field-separator",
      "--buffer-size",
      "--parallel",
      "--batch-size",
      "-k",
      "-t",
      "-S",
    ],
    deniedFlags: [
      "--compress-program",
      "--files0-from",
      "--output",
      "--random-source",
      "--temporary-directory",
      "-T",
      "-o",
    ],
  },
  uniq: {
    maxPositional: 0,
    allowedValueFlags: [
      "--skip-fields",
      "--skip-chars",
      "--check-chars",
      "--group",
      "-f",
      "-s",
      "-w",
    ],
    allowedBooleanFlags: [
      "--count",
      "--repeated",
      "--unique",
      "--ignore-case",
      "--zero-terminated",
      "-c",
      "-d",
      "-u",
      "-i",
      "-z",
    ],
  },
  head: {
    maxPositional: 0,
    allowedValueFlags: ["--lines", "--bytes", "-n", "-c"],
    allowedBooleanFlags: [
      "--quiet",
      "--silent",
      "--verbose",
      "--zero-terminated",
      "-q",
      "-v",
      "-z",
    ],
  },
  tail: {
    maxPositional: 0,
    allowedValueFlags: [
      "--lines",
      "--bytes",
      "--sleep-interval",
      "--max-unchanged-stats",
      "--pid",
      "-n",
      "-c",
    ],
    allowedBooleanFlags: [
      "--quiet",
      "--silent",
      "--verbose",
      "--zero-terminated",
      "-q",
      "-v",
      "-z",
    ],
    deniedFlags: ["--follow", "--retry", "-F", "-f"],
  },
  tr: {
    minPositional: 1,
    maxPositional: 2,
    allowedBooleanFlags: [
      "--complement",
      "--delete",
      "--squeeze-repeats",
      "--truncate-set1",
      "-C",
      "-c",
      "-d",
      "-s",
      "-t",
    ],
  },
  wc: {
    maxPositional: 0,
    allowedBooleanFlags: [
      "--bytes",
      "--chars",
      "--lines",
      "--max-line-length",
      "--words",
      "-L",
      "-c",
      "-l",
      "-m",
      "-w",
    ],
    deniedFlags: ["--files0-from"],
  },
});
function normalizeSafeBinProfileName(raw) {
  const name = normalizeLowercaseStringOrEmpty(raw);
  return name.length > 0 ? name : null;
}
function normalizeFixtureLimit(raw) {
  if (typeof raw !== "number" || !Number.isFinite(raw)) return;
  const next = Math.trunc(raw);
  return next >= 0 ? next : void 0;
}
function normalizeFixtureFlags(flags) {
  if (!Array.isArray(flags) || flags.length === 0) return;
  const normalized = Array.from(
    new Set(flags.map((flag) => flag.trim()).filter((flag) => flag.length > 0)),
  ).toSorted((a, b) => a.localeCompare(b));
  return normalized.length > 0 ? normalized : void 0;
}
function normalizeSafeBinProfileFixture(fixture) {
  const minPositional = normalizeFixtureLimit(fixture.minPositional);
  const maxPositionalRaw = normalizeFixtureLimit(fixture.maxPositional);
  return {
    minPositional,
    maxPositional:
      minPositional !== void 0 && maxPositionalRaw !== void 0 && maxPositionalRaw < minPositional
        ? minPositional
        : maxPositionalRaw,
    allowedValueFlags: normalizeFixtureFlags(fixture.allowedValueFlags),
    deniedFlags: normalizeFixtureFlags(fixture.deniedFlags),
  };
}
function normalizeSafeBinProfileFixtures(fixtures) {
  const normalized = {};
  if (!fixtures) return normalized;
  for (const [rawName, fixture] of Object.entries(fixtures)) {
    const name = normalizeSafeBinProfileName(rawName);
    if (!name) continue;
    normalized[name] = normalizeSafeBinProfileFixture(fixture);
  }
  return normalized;
}
function resolveSafeBinProfiles(fixtures) {
  const normalizedFixtures = normalizeSafeBinProfileFixtures(fixtures);
  if (Object.keys(normalizedFixtures).length === 0) return SAFE_BIN_PROFILES;
  return {
    ...SAFE_BIN_PROFILES,
    ...compileSafeBinProfiles(normalizedFixtures),
  };
}
//#endregion
//#region src/infra/exec-safe-bin-semantics.ts
const ALWAYS_DENY_SAFE_BIN_SEMANTICS = () => false;
const UNSAFE_SAFE_BIN_WARNINGS = {
  awk: "awk-family interpreters can execute commands, access ENVIRON, and write files, so prefer explicit allowlist entries or approval-gated runs instead of safeBins.",
  jq: "jq can read environment data and load jq code from modules or startup files, so prefer explicit allowlist entries or approval-gated runs instead of safeBins.",
  sed: "sed scripts can execute commands and write files, so prefer explicit allowlist entries or approval-gated runs instead of safeBins.",
};
const SAFE_BIN_SEMANTIC_RULES = {
  jq: {
    validate: ALWAYS_DENY_SAFE_BIN_SEMANTICS,
    configWarning: UNSAFE_SAFE_BIN_WARNINGS.jq,
  },
  awk: {
    validate: ALWAYS_DENY_SAFE_BIN_SEMANTICS,
    configWarning: UNSAFE_SAFE_BIN_WARNINGS.awk,
  },
  gawk: {
    validate: ALWAYS_DENY_SAFE_BIN_SEMANTICS,
    configWarning: UNSAFE_SAFE_BIN_WARNINGS.awk,
  },
  mawk: {
    validate: ALWAYS_DENY_SAFE_BIN_SEMANTICS,
    configWarning: UNSAFE_SAFE_BIN_WARNINGS.awk,
  },
  nawk: {
    validate: ALWAYS_DENY_SAFE_BIN_SEMANTICS,
    configWarning: UNSAFE_SAFE_BIN_WARNINGS.awk,
  },
  sed: {
    validate: ALWAYS_DENY_SAFE_BIN_SEMANTICS,
    configWarning: UNSAFE_SAFE_BIN_WARNINGS.sed,
  },
  gsed: {
    validate: ALWAYS_DENY_SAFE_BIN_SEMANTICS,
    configWarning: UNSAFE_SAFE_BIN_WARNINGS.sed,
  },
};
/** Normalizes a configured safe-bin entry to its executable basename without Windows suffixes. */
function normalizeSafeBinName(raw) {
  const trimmed = normalizeLowercaseStringOrEmpty(raw);
  if (!trimmed) return "";
  return (trimmed.split(/[\\/]/).at(-1) ?? trimmed).replace(/\.(?:exe|cmd|bat|com)$/i, "");
}
function getSafeBinSemanticRule(binName) {
  const normalized = typeof binName === "string" ? normalizeSafeBinName(binName) : "";
  return normalized ? SAFE_BIN_SEMANTIC_RULES[normalized] : void 0;
}
/** Applies command-specific semantic gates for executables that are risky as broad safeBins. */
function validateSafeBinSemantics(params) {
  return getSafeBinSemanticRule(params.binName)?.validate?.(params) ?? true;
}
/** Lists configured safeBins that need operator warnings because their semantics are broad. */
function listRiskyConfiguredSafeBins(entries) {
  const hits = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    const normalized = normalizeSafeBinName(entry);
    if (!normalized || hits.has(normalized)) continue;
    const warning = getSafeBinSemanticRule(normalized)?.configWarning;
    if (!warning) continue;
    hits.set(normalized, warning);
  }
  return Array.from(hits.entries())
    .map(([bin, warning]) => ({
      bin,
      warning,
    }))
    .toSorted((a, b) => a.bin.localeCompare(b.bin));
}
//#endregion
//#region src/infra/exec-safe-bin-policy-validator.ts
function isPathLikeToken(value) {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed === "-") return false;
  if (trimmed.startsWith("./") || trimmed.startsWith("../") || trimmed.startsWith("~")) return true;
  if (trimmed.startsWith("/")) return true;
  return /^[A-Za-z]:[\\/]/.test(trimmed);
}
function hasGlobToken(value) {
  return /[*?[\]]/.test(value);
}
function hasShellExpansionToken(value) {
  return /\$(?:[A-Za-z0-9_@*?!$#-]|\{|\(|\[)/.test(value);
}
const NO_FLAGS = /* @__PURE__ */ new Set();
function isSafeLiteralToken(value) {
  if (!value || value === "-") return true;
  return !hasGlobToken(value) && !hasShellExpansionToken(value) && !isPathLikeToken(value);
}
function isInvalidValueToken(value) {
  return !value || !isSafeLiteralToken(value);
}
function resolveCanonicalLongFlag(params) {
  if (!params.flag.startsWith("--") || params.flag.length <= 2) return null;
  if (params.knownLongFlagsSet.has(params.flag)) return params.flag;
  return params.longFlagPrefixMap.get(params.flag) ?? null;
}
function consumeLongOptionToken(params) {
  const canonicalFlag = resolveCanonicalLongFlag({
    flag: params.flag,
    knownLongFlagsSet: params.knownLongFlagsSet,
    longFlagPrefixMap: params.longFlagPrefixMap,
  });
  if (!canonicalFlag) return -1;
  if (params.deniedFlags.has(canonicalFlag)) return -1;
  const expectsValue = params.allowedValueFlags.has(canonicalFlag);
  if (params.inlineValue !== void 0) {
    if (!expectsValue) return -1;
    return isSafeLiteralToken(params.inlineValue) ? params.index + 1 : -1;
  }
  if (!expectsValue) return params.index + 1;
  return isInvalidValueToken(params.args[params.index + 1]) ? -1 : params.index + 2;
}
function consumeShortOptionClusterToken(params) {
  for (const [j, flag] of params.flags.entries()) {
    if (params.deniedFlags.has(flag)) return -1;
    if (params.allowedValueFlags.has(flag)) {
      const inlineValue = params.cluster.slice(j + 1);
      if (inlineValue) return isSafeLiteralToken(inlineValue) ? params.index + 1 : -1;
      return isInvalidValueToken(params.args[params.index + 1]) ? -1 : params.index + 2;
    }
    if (params.allowedBooleanFlags.has(flag)) continue;
    return -1;
  }
  return params.index + 1;
}
function consumePositionalToken(token, positional) {
  if (!isSafeLiteralToken(token)) return false;
  positional.push(token);
  return true;
}
function validatePositionalCount(positional, profile) {
  const minPositional = profile.minPositional ?? 0;
  if (positional.length < minPositional) return false;
  if (typeof profile.maxPositional === "number" && positional.length > profile.maxPositional)
    return false;
  return true;
}
function collectPositionalTokens(args, profile) {
  const allowedValueFlags = profile.allowedValueFlags ?? NO_FLAGS;
  const allowedBooleanFlags = profile.allowedBooleanFlags ?? NO_FLAGS;
  const deniedFlags = profile.deniedFlags ?? NO_FLAGS;
  const knownLongFlags =
    profile.knownLongFlags ??
    collectKnownLongFlags(allowedValueFlags, deniedFlags, allowedBooleanFlags);
  const knownLongFlagsSet = profile.knownLongFlagsSet ?? new Set(knownLongFlags);
  const longFlagPrefixMap = profile.longFlagPrefixMap ?? buildLongFlagPrefixMap(knownLongFlags);
  const positional = [];
  let i = 0;
  while (i < args.length) {
    const token = parseExecArgvToken(args[i] ?? "");
    if (token.kind === "empty" || token.kind === "stdin") {
      i += 1;
      continue;
    }
    if (token.kind === "terminator") {
      for (let j = i + 1; j < args.length; j += 1) {
        const rest = args[j];
        if (!rest || rest === "-") continue;
        if (!consumePositionalToken(rest, positional)) return null;
      }
      break;
    }
    if (token.kind === "positional") {
      if (!consumePositionalToken(token.raw, positional)) return null;
      i += 1;
      continue;
    }
    if (token.style === "long") {
      const nextIndex = consumeLongOptionToken({
        args,
        index: i,
        flag: token.flag,
        inlineValue: token.inlineValue,
        allowedValueFlags,
        deniedFlags,
        knownLongFlagsSet,
        longFlagPrefixMap,
      });
      if (nextIndex < 0) return null;
      i = nextIndex;
      continue;
    }
    const nextIndex = consumeShortOptionClusterToken({
      args,
      index: i,
      cluster: token.cluster,
      flags: token.flags,
      allowedValueFlags,
      allowedBooleanFlags,
      deniedFlags,
    });
    if (nextIndex < 0) return null;
    i = nextIndex;
  }
  return positional;
}
function validateSafeBinArgv(args, profile, options) {
  const positional = collectPositionalTokens(args, profile);
  if (!positional) return false;
  if (!validatePositionalCount(positional, profile)) return false;
  return validateSafeBinSemantics({
    binName: options?.binName,
    positional,
  });
}
//#endregion
//#region src/infra/exec-safe-bin-trust.ts
const DEFAULT_SAFE_BIN_TRUSTED_DIRS = ["/bin", "/usr/bin"];
let trustedSafeBinCache = null;
function swapAsciiCase(value) {
  return value.replace(/[A-Za-z]/g, (char) => {
    const lower = char.toLowerCase();
    return char === lower ? char.toUpperCase() : lower;
  });
}
function sameFsObject(a, b) {
  return a.dev === b.dev && a.ino === b.ino;
}
function pathCaseInsensitive(value) {
  let candidate = value;
  for (;;) {
    const swapped = swapAsciiCase(candidate);
    if (swapped !== candidate)
      try {
        const original = fs.statSync(candidate);
        try {
          return sameFsObject(original, fs.statSync(swapped));
        } catch {
          return false;
        }
      } catch {}
    const parent = path.dirname(candidate);
    if (parent === candidate) return process.platform === "win32";
    candidate = parent;
  }
}
function normalizeTrustComparisonPath(value) {
  const resolved = path.resolve(value);
  return pathCaseInsensitive(resolved) ? resolved.toLowerCase() : resolved;
}
function normalizeTrustedDir(value, forComparison = true) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  return forComparison ? normalizeTrustComparisonPath(trimmed) : path.resolve(trimmed);
}
function normalizeTrustedSafeBinDirs(entries) {
  if (!Array.isArray(entries)) return [];
  return uniqueStrings(entries.map((entry) => entry.trim()).filter((entry) => entry.length > 0));
}
function resolveTrustedSafeBinDirs(entries, forComparison = true) {
  return sortUniqueStrings(
    entries
      .map((entry) => normalizeTrustedDir(entry, forComparison))
      .filter((entry) => Boolean(entry)),
  );
}
function hasPathSelector(value) {
  return value.includes("/") || value.includes("\\");
}
function isExecutableSafeBinFile(value) {
  try {
    if (!fs.statSync(value).isFile()) return false;
    if (process.platform === "win32") return true;
    fs.accessSync(value, fs.constants.X_OK);
    return true;
  } catch {
    return false;
  }
}
function resolveTrustedSafeBinTargetDirs(entries, safeBins, forComparison = true) {
  const dirs = [];
  const bins = Array.from(
    new Set(
      safeBins.map((entry) => entry.trim()).filter((entry) => entry && !hasPathSelector(entry)),
    ),
  ).toSorted();
  if (bins.length === 0) return dirs;
  for (const entry of normalizeTrustedSafeBinDirs(entries)) {
    const dir = path.resolve(entry);
    for (const bin of bins) {
      const candidate = path.join(dir, bin);
      if (!isExecutableSafeBinFile(candidate)) continue;
      try {
        const normalized = normalizeTrustedDir(
          path.dirname(fs.realpathSync(candidate)),
          forComparison,
        );
        if (normalized) dirs.push(normalized);
      } catch {}
    }
  }
  return sortUniqueStrings(dirs);
}
function buildTrustedSafeBinCacheKey(entries, safeBins, targetDirs) {
  return `${resolveTrustedSafeBinDirs(normalizeTrustedSafeBinDirs(entries)).join("")}\u0002${normalizeSortedUniqueStringEntries(safeBins).join("")}\u0002${targetDirs.join("")}`;
}
function getTrustedSafeBinDirs(params = {}) {
  const baseDirs = params.baseDirs ?? DEFAULT_SAFE_BIN_TRUSTED_DIRS;
  const extraDirs = params.extraDirs ?? [];
  const safeBins = params.safeBins ?? [];
  const entries = [
    ...normalizeTrustedSafeBinDirs(baseDirs),
    ...normalizeTrustedSafeBinDirs(extraDirs),
  ];
  const targetDirs = resolveTrustedSafeBinTargetDirs(entries, safeBins);
  const key = buildTrustedSafeBinCacheKey(entries, safeBins, targetDirs);
  if (!params.refresh && trustedSafeBinCache?.key === key) return trustedSafeBinCache.dirs;
  const dirs = /* @__PURE__ */ new Set([...resolveTrustedSafeBinDirs(entries), ...targetDirs]);
  trustedSafeBinCache = {
    key,
    dirs,
  };
  return dirs;
}
function isTrustedSafeBinPath(params) {
  const trustedDirs = params.trustedDirs ?? getTrustedSafeBinDirs();
  const resolvedDir = normalizeTrustComparisonPath(path.dirname(path.resolve(params.resolvedPath)));
  return trustedDirs.has(resolvedDir);
}
function listWritableExplicitTrustedSafeBinDirs(entries) {
  if (process.platform === "win32") return [];
  const resolved = resolveTrustedSafeBinDirs(normalizeTrustedSafeBinDirs(entries), false);
  const hits = [];
  for (const dir of resolved) {
    let stat;
    try {
      stat = fs.statSync(dir);
    } catch {
      continue;
    }
    if (!stat.isDirectory()) continue;
    const mode = stat.mode & 511;
    const groupWritable = (mode & 16) !== 0;
    const worldWritable = (mode & 2) !== 0;
    if (!groupWritable && !worldWritable) continue;
    hits.push({
      dir,
      groupWritable,
      worldWritable,
    });
  }
  return hits;
}
//#endregion
export {
  validateSafeBinArgv as a,
  DEFAULT_SAFE_BINS as c,
  resolveSafeBinProfiles as d,
  normalizeTrustedSafeBinDirs as i,
  SAFE_BIN_PROFILES as l,
  isTrustedSafeBinPath as n,
  listRiskyConfiguredSafeBins as o,
  listWritableExplicitTrustedSafeBinDirs as r,
  normalizeSafeBinName as s,
  getTrustedSafeBinDirs as t,
  normalizeSafeBinProfileFixtures as u,
};
