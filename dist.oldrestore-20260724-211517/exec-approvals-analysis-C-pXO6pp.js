import { s as resolveCommandResolutionFromArgv } from "./exec-command-resolution-CApTmCLK.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import "./src-Bl7G9qvi.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region src/infra/windows-shell-command.ts
const WINDOWS_UNSUPPORTED_TOKENS = /* @__PURE__ */ new Set([
  "&",
  "|",
  "<",
  ">",
  ";",
  "^",
  "(",
  ")",
  "%",
  "!",
  "`",
  "\n",
  "\r",
]);
const WINDOWS_ALWAYS_UNSAFE_TOKENS = /* @__PURE__ */ new Set(["\n", "\r", "%", "`"]);
function findWindowsUnsupportedToken(command) {
  let inDouble = false;
  for (let i = 0; i < command.length; i++) {
    const ch = command.charAt(i);
    if (ch === '"') {
      inDouble = !inDouble;
      continue;
    }
    if (ch === "$") {
      const next = command[i + 1];
      if (next !== void 0 && /[A-Za-z_{(?$]/.test(next)) return "$";
      continue;
    }
    if (WINDOWS_UNSUPPORTED_TOKENS.has(ch)) {
      if (inDouble && !WINDOWS_ALWAYS_UNSAFE_TOKENS.has(ch)) continue;
      if (ch === "\n" || ch === "\r") return "newline";
      return ch;
    }
  }
  return null;
}
function tokenizeWindowsSegment(segment) {
  const tokens = [];
  let buf = "";
  let inDouble = false;
  let inSingle = false;
  let wasQuoted = false;
  const pushToken = () => {
    if (buf.length > 0 || wasQuoted) {
      tokens.push(buf);
      buf = "";
    }
    wasQuoted = false;
  };
  for (let i = 0; i < segment.length; i += 1) {
    const ch = segment.charAt(i);
    if (ch === '"' && !inSingle) {
      if (!inDouble) wasQuoted = true;
      inDouble = !inDouble;
      continue;
    }
    if (ch === "'" && !inDouble) {
      if (inSingle && segment[i + 1] === "'") {
        buf += "'";
        i += 1;
        continue;
      }
      if (!inSingle) wasQuoted = true;
      inSingle = !inSingle;
      continue;
    }
    if (!inDouble && !inSingle && /\s/.test(ch)) {
      pushToken();
      continue;
    }
    buf += ch;
  }
  if (inDouble || inSingle) return null;
  pushToken();
  return tokens.length > 0 ? tokens : null;
}
function stripWindowsShellWrapper(command) {
  const maxDepth = 5;
  let result = command;
  for (let i = 0; i < maxDepth; i++) {
    const previous = result;
    result = stripWindowsShellWrapperOnce(result.trim());
    if (result === previous) break;
  }
  return result;
}
function stripWindowsShellWrapperOnce(command) {
  const psCallMatch = command.match(/^&\s+(.+)$/s);
  if (psCallMatch) return expectDefined(psCallMatch[1], "ps call match capture group 1");
  const psFlags =
    /(?:-(?!c(?:ommand)?\b|-command\b)\w+(?:\s+(?!-)(?:"[^"]*(?:""[^"]*)*"|'[^']*(?:''[^']*)*'|\S+))?\s+)*/i
      .source;
  const psCommandFlag = `(?:-command|-c|--command)`;
  const psInvokeMatch = command.match(
    new RegExp(`^(?:powershell|pwsh)(?:\\.exe)?\\s+${psFlags}${psCommandFlag}\\s+"(.+)"$`, "is"),
  );
  if (psInvokeMatch)
    return expectDefined(psInvokeMatch[1], "ps invoke match capture group 1").replace(/""/g, '"');
  const psInvokeSingleQuote = command.match(
    new RegExp(`^(?:powershell|pwsh)(?:\\.exe)?\\s+${psFlags}${psCommandFlag}\\s+'(.+)'$`, "is"),
  );
  if (psInvokeSingleQuote)
    return expectDefined(psInvokeSingleQuote[1], "ps invoke single quote capture group 1").replace(
      /''/g,
      "'",
    );
  const psInvokeNoQuote = command.match(
    new RegExp(`^(?:powershell|pwsh)(?:\\.exe)?\\s+${psFlags}${psCommandFlag}\\s+(.+)$`, "is"),
  );
  if (psInvokeNoQuote)
    return expectDefined(psInvokeNoQuote[1], "ps invoke no quote capture group 1");
  return command;
}
function analyzeWindowsShellCommand(params) {
  const effective = stripWindowsShellWrapper(params.command.trim());
  const unsupported = findWindowsUnsupportedToken(effective);
  if (unsupported)
    return {
      ok: false,
      reason: `unsupported windows shell token: ${unsupported}`,
      segments: [],
    };
  const argv = tokenizeWindowsSegment(effective);
  if (!argv || argv.length === 0)
    return {
      ok: false,
      reason: "unable to parse windows command",
      segments: [],
    };
  return {
    ok: true,
    segments: [
      {
        raw: params.command,
        argv,
        resolution: resolveCommandResolutionFromArgv(
          argv,
          params.cwd,
          params.env,
          params.platform ?? void 0,
        ),
      },
    ],
  };
}
function isWindowsPlatform(platform) {
  return normalizeLowercaseStringOrEmpty(platform).startsWith("win");
}
const WINDOWS_UNSAFE_CMD_META = /[%`]|\$(?=[A-Za-z_{(?$])/;
function windowsEscapeArg(value) {
  if (value === "")
    return {
      ok: true,
      escaped: '""',
    };
  if (WINDOWS_UNSAFE_CMD_META.test(value)) return { ok: false };
  if (/^[a-zA-Z0-9_./:~\\=-]+$/.test(value))
    return {
      ok: true,
      escaped: value,
    };
  return {
    ok: true,
    escaped: `"${value.replace(/"/g, '""')}"`,
  };
}
function rebuildWindowsShellCommandFromSource(params) {
  const source = stripWindowsShellWrapper(params.command.trim());
  if (!source)
    return {
      ok: false,
      reason: "empty command",
    };
  const unsupported = findWindowsUnsupportedToken(source);
  if (unsupported)
    return {
      ok: false,
      reason: `unsupported windows shell token: ${unsupported}`,
    };
  const rendered = params.renderSegment(source, 0);
  if (!rendered.ok)
    return {
      ok: false,
      reason: rendered.reason,
    };
  return {
    ok: true,
    command: `& ${rendered.rendered}`,
    segmentCount: 1,
  };
}
//#endregion
//#region src/infra/exec-argv-analysis.ts
function analyzeArgvCommand(params) {
  const argv = params.argv.filter((entry) => entry.trim().length > 0);
  if (argv.length === 0)
    return {
      ok: false,
      reason: "empty argv",
      segments: [],
    };
  return {
    ok: true,
    segments: [
      {
        raw: argv.join(" "),
        argv,
        sourceArgv: [...params.argv],
        resolution: resolveCommandResolutionFromArgv(
          argv,
          params.cwd,
          params.env,
          params.platform ?? void 0,
        ),
      },
    ],
  };
}
//#endregion
//#region src/infra/exec-approvals-analysis.ts
function renderWindowsQuotedArgv(argv) {
  const parts = [];
  for (const token of argv) {
    const result = windowsEscapeArg(token);
    if (!result.ok)
      return {
        ok: false,
        reason: `unsafe windows token: ${token}`,
      };
    parts.push(result.escaped);
  }
  return {
    ok: true,
    rendered: parts.join(" "),
  };
}
function resolvePlannedSegmentArgv(segment) {
  if (segment.resolution?.policyBlocked === true) return null;
  const baseArgv =
    segment.resolution?.effectiveArgv && segment.resolution.effectiveArgv.length > 0
      ? segment.resolution.effectiveArgv
      : segment.argv;
  if (baseArgv.length === 0) return null;
  const argv = [...baseArgv];
  const execution = segment.resolution?.execution;
  const resolvedExecutable =
    execution?.resolvedRealPath?.trim() ?? execution?.resolvedPath?.trim() ?? "";
  if (resolvedExecutable) argv[0] = resolvedExecutable;
  return argv;
}
function buildEnforcedShellCommand(params) {
  if (params.platform !== "win32")
    return {
      ok: false,
      reason: "unsupported platform",
    };
  const rebuilt = rebuildWindowsShellCommandFromSource({
    command: params.command,
    renderSegment: (_raw, segmentIndex) => {
      const segment = params.segments[segmentIndex];
      if (!segment)
        return {
          ok: false,
          reason: "segment mapping failed",
        };
      const argv = resolvePlannedSegmentArgv(segment);
      if (!argv)
        return {
          ok: false,
          reason: "segment execution plan unavailable",
        };
      return renderWindowsQuotedArgv(argv);
    },
  });
  if (!rebuilt.ok)
    return {
      ok: false,
      reason: rebuilt.reason,
    };
  if (rebuilt.segmentCount !== params.segments.length)
    return {
      ok: false,
      reason: "segment count mismatch",
    };
  return {
    ok: true,
    command: rebuilt.command,
  };
}
//#endregion
export {
  isWindowsPlatform as a,
  analyzeWindowsShellCommand as i,
  resolvePlannedSegmentArgv as n,
  tokenizeWindowsSegment as o,
  analyzeArgvCommand as r,
  windowsEscapeArg as s,
  buildEnforcedShellCommand as t,
};
