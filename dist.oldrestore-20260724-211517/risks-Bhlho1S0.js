import { b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
import {
  A as resolveCarrierCommandArgv,
  D as SOURCE_EXECUTABLES,
  E as COMMAND_CARRIER_EXECUTABLES,
  N as splitShellArgs,
  O as isEnvAssignmentToken,
  T as unwrapKnownDispatchWrapperInvocation,
  a as extractShellWrapperInlineCommand,
  c as isShellWrapperExecutable,
  f as POSIX_INLINE_COMMAND_FLAGS,
  j as normalizeExecutableToken,
  k as parseEnvInvocationPrelude,
  y as resolveInlineCommandMatch,
} from "./shell-wrapper-resolution-DlXABXcG.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import "./parse-finite-number-Z7n6tXLk.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import "./exec-wrapper-resolution-CSf7MIn-.js";
//#region src/infra/command-analysis/inline-eval.ts
const VERSION_SUFFIX_PATTERN = /-?\d+(?:\.\d+)*$/;
const FLAG_INTERPRETER_INLINE_EVAL_SPECS = [
  {
    names: ["python", "python2", "python3", "pypy", "pypy3"],
    exactFlags: /* @__PURE__ */ new Set(["-c"]),
    shortClusterFlags: [
      {
        label: "-c",
        flag: "c",
        prefixChars: /* @__PURE__ */ new Set([
          "B",
          "E",
          "I",
          "O",
          "P",
          "R",
          "S",
          "b",
          "d",
          "i",
          "q",
          "s",
          "u",
          "v",
          "x",
        ]),
      },
    ],
  },
  {
    names: ["node", "nodejs", "bun", "deno"],
    exactFlags: /* @__PURE__ */ new Set(["-e", "--eval", "-p", "--print"]),
  },
  {
    names: ["awk", "gawk", "mawk", "nawk"],
    exactFlags: /* @__PURE__ */ new Set(["-e", "--source"]),
    prefixFlags: [
      {
        label: "--source",
        prefix: "--source=",
      },
    ],
  },
  {
    names: ["ruby"],
    exactFlags: /* @__PURE__ */ new Set(["-e"]),
    shortClusterFlags: [
      {
        label: "-e",
        flag: "e",
        prefixChars: /* @__PURE__ */ new Set([
          "S",
          "U",
          "W",
          "a",
          "c",
          "d",
          "l",
          "n",
          "p",
          "s",
          "v",
          "w",
        ]),
        allowNumericRecordSeparator: true,
        numericValuePrefixChars: /* @__PURE__ */ new Set(["W"]),
      },
    ],
  },
  {
    names: ["perl"],
    exactFlags: /* @__PURE__ */ new Set(["-e", "-E"]),
    shortClusterFlags: [
      {
        label: "-e",
        flag: "e",
        prefixChars: /* @__PURE__ */ new Set([
          "S",
          "T",
          "W",
          "X",
          "U",
          "V",
          "a",
          "c",
          "d",
          "f",
          "l",
          "n",
          "p",
          "s",
          "t",
          "u",
          "w",
        ]),
        allowNumericRecordSeparator: true,
        numericValuePrefixChars: /* @__PURE__ */ new Set(["l"]),
      },
      {
        label: "-e",
        flag: "E",
        prefixChars: /* @__PURE__ */ new Set([
          "S",
          "T",
          "W",
          "X",
          "U",
          "V",
          "a",
          "c",
          "d",
          "f",
          "l",
          "n",
          "p",
          "s",
          "t",
          "u",
          "w",
        ]),
        allowNumericRecordSeparator: true,
        numericValuePrefixChars: /* @__PURE__ */ new Set(["l"]),
      },
    ],
  },
  {
    names: ["php"],
    exactFlags: /* @__PURE__ */ new Set(["-r"]),
    rawExactFlags: /* @__PURE__ */ new Map([
      ["-B", "-B"],
      ["-E", "-E"],
      ["-R", "-R"],
    ]),
  },
  {
    names: ["r", "rscript"],
    exactFlags: /* @__PURE__ */ new Set(["-e"]),
  },
  {
    names: ["lua"],
    exactFlags: /* @__PURE__ */ new Set(["-e"]),
  },
  {
    names: ["osascript"],
    exactFlags: /* @__PURE__ */ new Set(["-e"]),
  },
  {
    names: ["find"],
    exactFlags: /* @__PURE__ */ new Set(["-exec", "-execdir", "-ok", "-okdir"]),
    scanPastDoubleDash: true,
  },
  {
    names: ["make", "gmake"],
    exactFlags: /* @__PURE__ */ new Set(["-f", "--file", "--makefile", "--eval"]),
    rawExactFlags: /* @__PURE__ */ new Map([["-E", "-E"]]),
    rawPrefixFlags: [
      {
        label: "-E",
        prefix: "-E",
      },
    ],
    prefixFlags: [
      {
        label: "-f",
        prefix: "-f",
      },
      {
        label: "--file",
        prefix: "--file=",
      },
      {
        label: "--makefile",
        prefix: "--makefile=",
      },
      {
        label: "--eval",
        prefix: "--eval=",
      },
    ],
  },
  {
    names: ["sed", "gsed"],
    exactFlags: /* @__PURE__ */ new Set(),
    rawExactFlags: /* @__PURE__ */ new Map([["-e", "-e"]]),
    rawPrefixFlags: [
      {
        label: "-e",
        prefix: "-e",
      },
    ],
  },
];
const POSITIONAL_INTERPRETER_INLINE_EVAL_SPECS = [
  {
    names: ["awk", "gawk", "mawk", "nawk"],
    fileFlags: /* @__PURE__ */ new Set(["-f", "--file"]),
    fileFlagPrefixes: ["-f", "--file="],
    exactValueFlags: /* @__PURE__ */ new Set([
      "-f",
      "--file",
      "-F",
      "--field-separator",
      "-v",
      "--assign",
      "-i",
      "--include",
      "-l",
      "--load",
      "-W",
    ]),
    prefixValueFlags: ["-F", "--field-separator=", "-v", "--assign=", "--include=", "--load="],
    flag: "<program>",
  },
  {
    names: ["xargs"],
    exactValueFlags: /* @__PURE__ */ new Set([
      "-a",
      "--arg-file",
      "-d",
      "--delimiter",
      "-E",
      "-I",
      "-L",
      "--max-lines",
      "-n",
      "--max-args",
      "-P",
      "--max-procs",
      "-s",
      "--max-chars",
    ]),
    exactOptionalValueFlags: /* @__PURE__ */ new Set(["--eof", "--replace"]),
    prefixValueFlags: [
      "-a",
      "--arg-file=",
      "-d",
      "--delimiter=",
      "-E",
      "--eof=",
      "-I",
      "--replace=",
      "-i",
      "-L",
      "--max-lines=",
      "-l",
      "-n",
      "--max-args=",
      "-P",
      "--max-procs=",
      "-s",
      "--max-chars=",
    ],
    flag: "<command>",
  },
  {
    names: ["sed", "gsed"],
    fileFlags: /* @__PURE__ */ new Set(["-f", "--file"]),
    fileFlagPrefixes: ["-f", "--file="],
    exactValueFlags: /* @__PURE__ */ new Set(["-f", "--file", "-l", "--line-length"]),
    exactOptionalValueFlags: /* @__PURE__ */ new Set(["-i", "--in-place"]),
    prefixValueFlags: ["-f", "--file=", "--in-place=", "--line-length="],
    flag: "<program>",
  },
];
const INTERPRETER_ALLOWLIST_NAMES = new Set(
  FLAG_INTERPRETER_INLINE_EVAL_SPECS.flatMap((entry) => entry.names).concat(
    POSITIONAL_INTERPRETER_INLINE_EVAL_SPECS.flatMap((entry) => entry.names),
  ),
);
function stripInterpreterVersionSuffix(value) {
  const stripped = value.replace(VERSION_SUFFIX_PATTERN, "");
  return stripped.length > 0 ? stripped : value;
}
function interpreterNameVariants(value) {
  const stripped = stripInterpreterVersionSuffix(value);
  return stripped === value || stripped.length < 2 ? [value] : [value, stripped];
}
function specNamesInclude(names, normalizedExecutable) {
  return interpreterNameVariants(normalizedExecutable).some((candidate) =>
    names.includes(candidate),
  );
}
function findInterpreterSpec(executable) {
  const normalized = normalizeExecutableToken(executable);
  for (const spec of FLAG_INTERPRETER_INLINE_EVAL_SPECS)
    if (specNamesInclude(spec.names, normalized)) return spec;
  return null;
}
function findPositionalInterpreterSpec(executable) {
  const normalized = normalizeExecutableToken(executable);
  for (const spec of POSITIONAL_INTERPRETER_INLINE_EVAL_SPECS)
    if (specNamesInclude(spec.names, normalized)) return spec;
  return null;
}
function createInlineEvalHit(executable, argv, flag) {
  return {
    executable,
    normalizedExecutable: normalizeExecutableToken(executable),
    flag,
    argv,
  };
}
function matchJoinedExactFlag(spec, token, lower) {
  for (const flag of spec.exactFlags) {
    if (flag.startsWith("--")) {
      const prefix = `${flag}=`;
      if (lower.startsWith(prefix) && lower.length > prefix.length) return flag;
      continue;
    }
    if (/^-[A-Za-z]$/.test(flag) && token.startsWith(flag) && token.length > flag.length)
      return normalizeLowercaseStringOrEmpty(flag);
  }
  return null;
}
function matchJoinedRawExactFlag(spec, token) {
  for (const [flag, label] of spec.rawExactFlags ?? [])
    if (/^-[A-Za-z]$/.test(flag) && token.startsWith(flag) && token.length > flag.length)
      return label;
  return null;
}
function matchShortClusterFlag(spec, token) {
  if (!token.startsWith("-") || token.startsWith("--")) return null;
  for (const clusterFlag of spec.shortClusterFlags ?? []) {
    const index = token.indexOf(clusterFlag.flag, 2);
    if (index < 2) continue;
    if (isShortClusterPrefixAllowed(clusterFlag, token.slice(1, index))) return clusterFlag.label;
  }
  return null;
}
function isShortClusterPrefixAllowed(clusterFlag, prefix) {
  for (let index = 0; index < prefix.length; index += 1) {
    const char = prefix[index] ?? "";
    if (clusterFlag.prefixChars.has(char)) {
      if (clusterFlag.numericValuePrefixChars?.has(char) === true)
        while (/^[0-9]$/.test(prefix[index + 1] ?? "")) index += 1;
      continue;
    }
    if (clusterFlag.allowNumericRecordSeparator === true && char === "0") {
      while (/^[0-9]$/.test(prefix[index + 1] ?? "")) index += 1;
      continue;
    }
    return false;
  }
  return true;
}
function detectInterpreterInlineEvalArgv(argv) {
  if (!Array.isArray(argv) || argv.length === 0) return null;
  const executable = argv[0]?.trim();
  if (!executable) return null;
  const spec = findInterpreterSpec(executable);
  if (spec)
    for (let idx = 1; idx < argv.length; idx += 1) {
      const token = argv[idx]?.trim();
      if (!token) continue;
      if (token === "--") {
        if (spec.scanPastDoubleDash) continue;
        break;
      }
      const rawExactFlag = spec.rawExactFlags?.get(token);
      if (rawExactFlag) return createInlineEvalHit(executable, argv, rawExactFlag);
      const joinedRawExactFlag = matchJoinedRawExactFlag(spec, token);
      if (joinedRawExactFlag) return createInlineEvalHit(executable, argv, joinedRawExactFlag);
      const rawPrefixFlag = spec.rawPrefixFlags?.find(
        ({ prefix }) => token.startsWith(prefix) && token.length > prefix.length,
      );
      if (rawPrefixFlag) return createInlineEvalHit(executable, argv, rawPrefixFlag.label);
      const lower = normalizeLowercaseStringOrEmpty(token);
      if (spec.exactFlags.has(lower)) return createInlineEvalHit(executable, argv, lower);
      const joinedExactFlag = matchJoinedExactFlag(spec, token, lower);
      if (joinedExactFlag) return createInlineEvalHit(executable, argv, joinedExactFlag);
      const shortClusterFlag = matchShortClusterFlag(spec, token);
      if (shortClusterFlag) return createInlineEvalHit(executable, argv, shortClusterFlag);
      const prefixFlag = spec.prefixFlags?.find(
        ({ prefix }) => lower.startsWith(prefix) && lower.length > prefix.length,
      );
      if (prefixFlag) return createInlineEvalHit(executable, argv, prefixFlag.label);
    }
  const positionalSpec = findPositionalInterpreterSpec(executable);
  if (!positionalSpec) return null;
  for (let idx = 1; idx < argv.length; idx += 1) {
    const token = argv[idx]?.trim();
    if (!token) continue;
    if (token === "--") {
      if (!argv[idx + 1]?.trim()) return null;
      return createInlineEvalHit(executable, argv, positionalSpec.flag);
    }
    if (positionalSpec.fileFlags?.has(token)) return null;
    if (
      positionalSpec.fileFlagPrefixes?.some(
        (prefix) => token.startsWith(prefix) && token.length > prefix.length,
      )
    )
      return null;
    if (positionalSpec.exactValueFlags?.has(token)) {
      idx += 1;
      continue;
    }
    if (positionalSpec.exactOptionalValueFlags?.has(token)) continue;
    if (
      positionalSpec.prefixValueFlags?.some(
        (prefix) => token.startsWith(prefix) && token.length > prefix.length,
      )
    )
      continue;
    if (token.startsWith("-")) continue;
    return createInlineEvalHit(executable, argv, positionalSpec.flag);
  }
  return null;
}
function describeInterpreterInlineEval(hit) {
  if (hit.flag === "<command>") return `${hit.normalizedExecutable} inline command`;
  if (hit.flag === "<program>") return `${hit.normalizedExecutable} inline program`;
  return `${hit.normalizedExecutable} ${hit.flag}`;
}
function isInterpreterLikeAllowlistPattern(pattern) {
  const trimmed = normalizeLowercaseStringOrEmpty(pattern);
  if (!trimmed) return false;
  if (
    interpreterNameVariants(normalizeExecutableToken(trimmed)).some((candidate) =>
      INTERPRETER_ALLOWLIST_NAMES.has(candidate),
    )
  )
    return true;
  const basename = trimmed.replace(/\\/g, "/").split("/").pop() ?? trimmed;
  return interpreterNameVariants(
    (basename.endsWith(".exe") ? basename.slice(0, -4) : basename)
      .replace(/[*?[\]{}()]/g, "")
      .replace(/[.-]+$/, ""),
  ).some((candidate) => INTERPRETER_ALLOWLIST_NAMES.has(candidate));
}
//#endregion
//#region src/infra/command-analysis/risks.ts
function commandArgvKey(argv) {
  return argv.join("\0");
}
function isCommandCarrierExecutable(executable, options) {
  return (
    COMMAND_CARRIER_EXECUTABLES.has(executable) ||
    Boolean(options?.includeExec && executable === "exec")
  );
}
/** Builds candidate command payload strings from nested carriers and shell wrappers. */
function buildCommandPayloadCandidates(argv, seenArgv = /* @__PURE__ */ new Set()) {
  const key = commandArgvKey(argv);
  if (seenArgv.has(key)) return argv.length > 0 ? [argv.join(" ")] : [];
  seenArgv.add(key);
  const assignmentStrippedArgv = stripLeadingEnvAssignments(argv);
  const carriedArgv = resolveCarrierCommandArgv(assignmentStrippedArgv, 0, { includeExec: true });
  const executableArgv = carriedArgv ?? assignmentStrippedArgv;
  const carriedCandidates = carriedArgv ? buildCommandPayloadCandidates(carriedArgv, seenArgv) : [];
  const shellWrapperPayload = extractShellWrapperInlineCommand(executableArgv);
  const shellWrapperCandidates = shellWrapperPayload
    ? (() => {
        const innerArgv = splitShellArgs(shellWrapperPayload);
        return innerArgv
          ? buildCommandPayloadCandidates(innerArgv, seenArgv)
          : [shellWrapperPayload];
      })()
    : [];
  return uniqueCommandPayloadCandidates([
    ...(executableArgv.length > 0 ? [executableArgv.join(" ")] : []),
    ...carriedCandidates,
    ...shellWrapperCandidates,
  ]);
}
function stripLeadingEnvAssignments(argv) {
  let index = 0;
  while (index < argv.length && isEnvAssignmentToken(argv[index] ?? "")) index += 1;
  return index > 0 ? argv.slice(index) : argv;
}
function uniqueCommandPayloadCandidates(candidates) {
  return uniqueStrings(candidates.filter((candidate) => candidate.trim().length > 0));
}
function normalizeShellPositionalToken(token) {
  const match = (
    token.length >= 2 && token.startsWith('"') && token.endsWith('"') ? token.slice(1, -1) : token
  ).match(/^\$(?:([0-9@*])|\{([0-9@*])\})$/u);
  const value = match?.[1] ?? match?.[2];
  if (value === void 0) return null;
  if (value === "@") return { kind: "all" };
  if (value === "*") return { kind: "star" };
  if (value === "0") return { kind: "zero" };
  const index = parseStrictPositiveInteger(value);
  return index === void 0
    ? null
    : {
        kind: "index",
        index,
      };
}
function resolveShellPositionalCarrierPlan(command) {
  const trimmed = command.trim();
  if (trimmed.length === 0) return null;
  const shellWhitespace = String.raw`[^\S\r\n]+`;
  const positionalZero = String.raw`(?:\$(?:0|\{0\})|"\$(?:0|\{0\})")`;
  const positionalArg = String.raw`(?:\$(?:[@*]|[1-9]|\{[@*1-9]\})|"\$(?:[@*]|[1-9]|\{[@*1-9]\})")`;
  if (
    !new RegExp(
      `^(?:exec${shellWhitespace}(?:--${shellWhitespace})?)?${positionalZero}(?:${shellWhitespace}${positionalArg})*$`,
      "u",
    ).test(trimmed)
  )
    return null;
  const tokens = trimmed.match(/"[^"]*"|\S+/gu) ?? [];
  let index = 0;
  if (tokens[index] === "exec") {
    index += 1;
    if (tokens[index] === "--") index += 1;
  }
  if (normalizeShellPositionalToken(tokens[index] ?? "")?.kind !== "zero") return null;
  index += 1;
  const indexes = [0];
  for (; index < tokens.length; index += 1) {
    const positional = normalizeShellPositionalToken(tokens[index] ?? "");
    if (positional === null || positional.kind === "zero" || positional.kind === "star")
      return null;
    if (positional.kind === "all") return { kind: "all" };
    if (positional.kind === "index") indexes.push(positional.index);
  }
  return {
    kind: "indexes",
    indexes,
  };
}
function resolveShellPositionalCarrierArgv(params) {
  const positionalArgv = params.executableArgv.slice(params.valueTokenIndex + 1);
  return (
    params.plan.kind === "all"
      ? positionalArgv
      : params.plan.indexes.map((index) => positionalArgv[index] ?? "")
  )
    .map((token) => token.trim())
    .filter((token) => token.length > 0);
}
function detectShellPositionalCarrierInlineEvalArgvInternal(argv, seenArgv) {
  const executableArgv = stripLeadingEnvAssignments(argv);
  const executable = normalizeExecutableToken(executableArgv[0] ?? "");
  if (!isShellWrapperExecutable(executable)) return null;
  if (!["ash", "bash", "dash", "fish", "ksh", "sh", "zsh"].includes(executable)) return null;
  const key = commandArgvKey(executableArgv);
  if (seenArgv.has(key)) return null;
  seenArgv.add(key);
  const inlineMatch = resolveInlineCommandMatch(executableArgv, POSIX_INLINE_COMMAND_FLAGS, {
    allowCombinedC: true,
  });
  if (inlineMatch.valueTokenIndex === null || !inlineMatch.command) return null;
  const carrierPlan = resolveShellPositionalCarrierPlan(inlineMatch.command);
  if (!carrierPlan) return null;
  const carriedArgv = resolveShellPositionalCarrierArgv({
    executableArgv,
    valueTokenIndex: inlineMatch.valueTokenIndex,
    plan: carrierPlan,
  });
  if (carriedArgv.length === 0) return null;
  return detectInlineEvalArgvInternal(carriedArgv, seenArgv);
}
function detectCarrierInlineEvalArgvInternal(argv, seenArgv) {
  const executableArgv = stripLeadingEnvAssignments(argv);
  const key = commandArgvKey(executableArgv);
  if (seenArgv.has(key)) return null;
  seenArgv.add(key);
  const dispatchUnwrap = unwrapKnownDispatchWrapperInvocation(executableArgv);
  if (dispatchUnwrap.kind === "unwrapped")
    return detectInlineEvalArgvInternal(dispatchUnwrap.argv, seenArgv);
  if (
    !isCommandCarrierExecutable(normalizeExecutableToken(executableArgv[0] ?? ""), {
      includeExec: true,
    })
  )
    return null;
  const carriedArgv = resolveCarrierCommandArgv(executableArgv, 0, { includeExec: true });
  if (!carriedArgv) return null;
  return detectInlineEvalArgvInternal(carriedArgv, seenArgv);
}
function detectCarrierInlineEvalArgv(argv) {
  return detectCarrierInlineEvalArgvInternal(argv, /* @__PURE__ */ new Set());
}
function detectInlineEvalArgvInternal(argv, seenArgv) {
  if (!Array.isArray(argv)) return null;
  return (
    detectInterpreterInlineEvalArgv(argv) ??
    detectShellPositionalCarrierInlineEvalArgvInternal(argv, seenArgv) ??
    detectCarrierInlineEvalArgvInternal(argv, seenArgv)
  );
}
function detectInlineEvalArgv(argv) {
  return detectInlineEvalArgvInternal(argv, /* @__PURE__ */ new Set());
}
function detectInlineEvalInSegments(segments) {
  for (const segment of segments) {
    const hit =
      detectInlineEvalArgv(segment.resolution?.effectiveArgv ?? segment.argv) ??
      detectInlineEvalArgv(segment.argv);
    if (hit) return hit;
  }
  return null;
}
function detectCommandCarrierArgv(argv) {
  const executable = argv[0];
  if (!executable) return [];
  const normalizedExecutable = normalizeExecutableToken(executable);
  const hits = [];
  if (normalizedExecutable === "find") {
    const flag = argv.find((arg) => ["-exec", "-execdir", "-ok", "-okdir"].includes(arg));
    if (flag)
      hits.push({
        command: executable,
        flag,
      });
  }
  if (normalizedExecutable === "xargs") hits.push({ command: normalizedExecutable });
  const splitStringFlag = detectEnvSplitStringFlag(argv);
  if (splitStringFlag)
    hits.push({
      command: normalizedExecutable,
      flag: splitStringFlag,
    });
  return hits;
}
function detectEnvSplitStringFlag(argv) {
  if (normalizeExecutableToken(argv[0] ?? "") !== "env") return null;
  const parsed = parseEnvInvocationPrelude(argv);
  if (!parsed?.splitArgv) return null;
  for (const arg of argv.slice(1, parsed.commandIndex)) {
    const token = arg.trim();
    if (token === "-S" || token === "-s") return token;
    if (token === "--split-string") return "--split-string";
    if (token.startsWith("--split-string=") || (token.startsWith("-S") && token.length > 2))
      return token.startsWith("--") ? "--split-string" : "-S";
    if (token.startsWith("-") && !token.startsWith("--"))
      for (const option of token.slice(1)) {
        if (option === "S") return "-S";
        if (option === "s") return "-s";
      }
  }
  return null;
}
function detectShellWrapperThroughCarrierArgv(argv, shellCommandFlag) {
  const executable = normalizeExecutableToken(argv[0] ?? "");
  if (!isCommandCarrierExecutable(executable, { includeExec: true })) return null;
  const carriedArgv = resolveCarrierCommandArgv(argv, 0, { includeExec: true });
  if (!carriedArgv) return null;
  if (isShellWrapperExecutable(carriedArgv[0] ?? "") && shellCommandFlag(carriedArgv, 1))
    return executable;
  return detectShellWrapperThroughCarrierArgv(carriedArgv, shellCommandFlag) ? executable : null;
}
function detectCarriedShellBuiltinArgv(argv) {
  if (!isCommandCarrierExecutable(normalizeExecutableToken(argv[0] ?? ""), { includeExec: true }))
    return null;
  const carriedArgv = resolveCarrierCommandArgv(argv, 0, { includeExec: true });
  if (!carriedArgv) return null;
  const nestedCarrierHit = detectCarriedShellBuiltinArgv(carriedArgv);
  if (nestedCarrierHit) return nestedCarrierHit;
  const carriedCommand = carriedArgv[0];
  const normalizedCarriedCommand = carriedCommand
    ? normalizeExecutableToken(carriedCommand)
    : void 0;
  if (normalizedCarriedCommand === "eval") return { kind: "eval" };
  if (normalizedCarriedCommand && SOURCE_EXECUTABLES.has(normalizedCarriedCommand))
    return {
      kind: "source",
      command: normalizedCarriedCommand,
    };
  return null;
}
//#endregion
export {
  detectInlineEvalArgv as a,
  describeInterpreterInlineEval as c,
  detectCommandCarrierArgv as i,
  isInterpreterLikeAllowlistPattern as l,
  detectCarriedShellBuiltinArgv as n,
  detectInlineEvalInSegments as o,
  detectCarrierInlineEvalArgv as r,
  detectShellWrapperThroughCarrierArgv as s,
  buildCommandPayloadCandidates as t,
};
