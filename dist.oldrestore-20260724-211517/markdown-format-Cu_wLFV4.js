import { r as runCommandWithTimeout } from "./exec-CXKmx4dL.js";
import "./process-runtime-BKNTr1ic.js";
//#region extensions/imessage/src/cli-output.ts
const IMESSAGE_CLI_STDOUT_MAX_BYTES = 8 * 1024 * 1024;
const IMESSAGE_CLI_STDERR_TAIL_BYTES = 64 * 1024;
function parseLastJsonObject(stdout) {
  const last = stdout
    .split(/\r?\n/u)
    .findLast((line) => line.trim().length > 0)
    ?.trim();
  if (!last) return null;
  try {
    const value = JSON.parse(last);
    return value && typeof value === "object" && !Array.isArray(value) ? value : null;
  } catch {
    return null;
  }
}
async function runIMessageCliJsonCommand(params) {
  const dbPath = params.dbPath?.trim();
  const result = await runCommandWithTimeout(
    [params.cliPath, ...params.args, ...(dbPath ? ["--db", dbPath] : []), "--json"],
    {
      killProcessTree: true,
      maxOutputBytes: {
        stdout: IMESSAGE_CLI_STDOUT_MAX_BYTES,
        stderr: IMESSAGE_CLI_STDERR_TAIL_BYTES,
      },
      outputCapture: {
        stdout: "head",
        stderr: "tail",
      },
      terminateOnOutputLimit: { stdout: true },
      timeoutMs: params.timeoutMs,
    },
  );
  if (result.termination === "timeout")
    throw new Error(`iMessage action timed out after ${params.timeoutMs}ms`);
  if (result.outputLimitExceeded || result.stdoutTruncatedBytes)
    throw new Error(`imsg stdout exceeded ${IMESSAGE_CLI_STDOUT_MAX_BYTES} bytes`);
  const parsed = parseLastJsonObject(result.stdout);
  if (result.code !== 0) {
    const detail =
      (typeof parsed?.error === "string" && parsed.error.trim()) ||
      result.stderr.trim() ||
      result.stdout.trim() ||
      `imsg exited with code ${result.code}`;
    throw new Error(detail);
  }
  if (!parsed)
    throw new Error(
      `imsg returned non-JSON output: ${result.stdout.trim() || result.stderr.trim()}`,
    );
  if (parsed.success === false) {
    const detail =
      typeof parsed.error === "string" && parsed.error.trim()
        ? parsed.error.trim()
        : "iMessage action failed";
    throw new Error(detail);
  }
  return parsed;
}
//#endregion
//#region extensions/imessage/src/markdown-format.ts
const MARKERS = [
  {
    marker: "***",
    styles: ["bold", "italic"],
    requireWordBoundary: false,
  },
  {
    marker: "___",
    styles: ["underline", "italic"],
    requireWordBoundary: true,
  },
  {
    marker: "~~",
    styles: ["strikethrough"],
    requireWordBoundary: false,
  },
  {
    marker: "**",
    styles: ["bold"],
    requireWordBoundary: false,
  },
  {
    marker: "__",
    styles: ["underline"],
    requireWordBoundary: true,
  },
  {
    marker: "*",
    styles: ["italic"],
    requireWordBoundary: false,
  },
  {
    marker: "_",
    styles: ["italic"],
    requireWordBoundary: true,
  },
];
function tryConsumeMarker(input, i, m) {
  if (!input.startsWith(m.marker, i)) return null;
  if (m.marker.length === 1 && input[i + 1] === m.marker) return null;
  if (m.marker.length === 2 && input[i + 2] === m.marker[0]) return null;
  const isAtBoundary = (ch) => ch === void 0 || /\s/.test(ch);
  if (m.requireWordBoundary && i > 0 && !isAtBoundary(input[i - 1])) return null;
  const startInner = i + m.marker.length;
  const close = input.indexOf(m.marker, startInner);
  if (close === -1 || close === startInner) return null;
  if (m.requireWordBoundary && !isAtBoundary(input[close + m.marker.length])) return null;
  const inner = input.slice(startInner, close);
  if (!inner.trim()) return null;
  return {
    close,
    inner,
  };
}
function parseInternal(input, baseOffset, sink) {
  let out = "";
  let i = 0;
  while (i < input.length) {
    let consumed = false;
    for (const m of MARKERS) {
      const hit = tryConsumeMarker(input, i, m);
      if (!hit) continue;
      const innerOffset = baseOffset + out.length;
      const innerStripped = parseInternal(hit.inner, innerOffset, sink);
      for (const style of m.styles)
        sink.push({
          start: innerOffset,
          length: innerStripped.length,
          styles: [style],
        });
      out += innerStripped;
      i = hit.close + m.marker.length;
      consumed = true;
      break;
    }
    if (!consumed) {
      out += input[i];
      i += 1;
    }
  }
  return out;
}
function extractMarkdownFormatRuns(input) {
  const ranges = [];
  return {
    text: parseInternal(input, 0, ranges),
    ranges,
  };
}
//#endregion
export { runIMessageCliJsonCommand as n, extractMarkdownFormatRuns as t };
