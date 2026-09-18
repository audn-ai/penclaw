import process from "node:process";
import "./src-Bl7G9qvi.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
//#region src/infra/runtime-guard.ts
const defaultRuntime = {
  log: (...args) => console.log(...args),
  error: (...args) => console.error(...args),
  exit: (code) => {
    process.exit(code);
  },
};
const MIN_NODE_22 = {
  major: 22,
  minor: 22,
  patch: 3,
};
const MIN_NODE_24 = {
  major: 24,
  minor: 15,
  patch: 0,
};
const MIN_NODE_25 = {
  major: 25,
  minor: 9,
  patch: 0,
};
const MINIMUM_ENGINE_RE = /^\s*>=\s*v?(\d+\.\d+\.\d+)\s*$/i;
const ENGINE_CLAUSE_RE = /^\s*>=\s*v?(\d+\.\d+\.\d+)(?:\s+<\s*v?(\d+(?:\.\d+\.\d+)?))?\s*$/i;
const SEMVER_RE = /(\d+)\.(\d+)\.(\d+)/;
/** Parses the first major/minor/patch triple from a runtime or package version label. */
function parseSemver(version) {
  if (!version) return null;
  const match = version.match(SEMVER_RE);
  if (!match) return null;
  const [, major, minor, patch] = match;
  return {
    major: Number.parseInt(expectDefined(major, "runtime guard major"), 10),
    minor: Number.parseInt(expectDefined(minor, "runtime guard minor"), 10),
    patch: Number.parseInt(expectDefined(patch, "runtime guard patch"), 10),
  };
}
/** Compares parsed semver triples against an inclusive minimum version. */
function isAtLeast(version, minimum) {
  if (!version) return false;
  if (version.major !== minimum.major) return version.major > minimum.major;
  if (version.minor !== minimum.minor) return version.minor > minimum.minor;
  return version.patch >= minimum.patch;
}
/** Reads current process runtime metadata for startup support checks. */
function detectRuntime() {
  const bunVersion = process.versions?.bun;
  return {
    kind: bunVersion ? "bun" : process.versions?.node ? "node" : "unknown",
    version: bunVersion ?? process.versions?.node ?? null,
    execPath: process.execPath ?? null,
    pathEnv: process.env.PATH ?? "(not set)",
  };
}
/** Returns whether a detected runtime meets OpenClaw's minimum runtime contract. */
function runtimeSatisfies(details) {
  if (details.kind === "node") return isSupportedNodeVersion(details.version);
  return false;
}
/** Checks a Node version label against OpenClaw's supported Node version range. */
function isSupportedNodeVersion(version) {
  const parsed = parseSemver(version);
  if (!parsed) return false;
  if (parsed.major === MIN_NODE_22.major) return isAtLeast(parsed, MIN_NODE_22);
  if (parsed.major === MIN_NODE_24.major) return isAtLeast(parsed, MIN_NODE_24);
  if (parsed.major === MIN_NODE_25.major) return isAtLeast(parsed, MIN_NODE_25);
  return parsed.major > MIN_NODE_25.major;
}
/** Parses simple package `engines.node` ranges of the form `>=x.y.z`. */
function parseMinimumNodeEngine(engine) {
  if (!engine) return null;
  const match = engine.match(MINIMUM_ENGINE_RE);
  if (!match) return null;
  return parseSemver(match[1] ?? null);
}
/** Returns whether a Node version satisfies a supported engine range, or null if unsupported. */
function nodeVersionSatisfiesEngine(version, engine) {
  const minimum = parseMinimumNodeEngine(engine);
  if (minimum) return isAtLeast(parseSemver(version), minimum);
  if (!engine) return null;
  const parsed = parseSemver(version);
  if (!parsed) return false;
  const clauses = engine.split("||");
  let satisfied = false;
  for (const clause of clauses) {
    const match = clause.match(ENGINE_CLAUSE_RE);
    if (!match) return null;
    const clauseMinimum = parseSemver(match[1] ?? null);
    const upperRaw = match[2];
    const upper = upperRaw
      ? parseSemver(upperRaw.includes(".") ? upperRaw : `${upperRaw}.0.0`)
      : null;
    if (!clauseMinimum || (upperRaw && !upper)) return null;
    if (isAtLeast(parsed, clauseMinimum) && (!upper || !isAtLeast(parsed, upper))) satisfied = true;
  }
  return satisfied;
}
/** Exits through the provided runtime when the current Node runtime is unsupported. */
function assertSupportedRuntime(runtime = defaultRuntime, details = detectRuntime()) {
  if (runtimeSatisfies(details)) return;
  const versionLabel = details.version ?? "unknown";
  const runtimeLabel =
    details.kind === "unknown" ? "unknown runtime" : `${details.kind} ${versionLabel}`;
  const execLabel = details.execPath ?? "unknown";
  const requirement =
    details.kind === "bun"
      ? "openclaw cannot run under Bun because the runtime does not provide node:sqlite."
      : "openclaw requires Node >=22.22.3 <23, >=24.15.0 <25, or >=25.9.0.";
  const retryHint =
    details.kind === "bun"
      ? "Run OpenClaw with Node; Bun remains supported for installs and package scripts."
      : "Upgrade Node and re-run openclaw.";
  runtime.error(
    [
      requirement,
      `Detected: ${runtimeLabel} (exec: ${execLabel}).`,
      `PATH searched: ${details.pathEnv}`,
      "Install Node: https://nodejs.org/en/download",
      retryHint,
    ].join("\n"),
  );
  runtime.exit(1);
}
//#endregion
export {
  parseSemver as a,
  nodeVersionSatisfiesEngine as i,
  isAtLeast as n,
  isSupportedNodeVersion as r,
  assertSupportedRuntime as t,
};
