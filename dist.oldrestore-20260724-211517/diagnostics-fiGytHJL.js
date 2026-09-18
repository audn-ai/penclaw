import fs from "node:fs/promises";
import {
  a as resolveGatewaySupervisorLogPaths,
  r as resolveGatewayLogPaths,
} from "./restart-logs-D5D9y8VP.js";
//#region src/daemon/diagnostics.ts
/** Reads recent gateway service logs for actionable daemon restart diagnostics. */
const GATEWAY_LOG_ERROR_PATTERNS = [
  /\bENOSPC\b/i,
  /no space left on device/i,
  /refusing to bind gateway/i,
  /gateway auth mode/i,
  /gateway start blocked/i,
  /failed to bind gateway socket/i,
  /tailscale .* requires/i,
];
const GATEWAY_DIAGNOSTIC_LOG_TAIL_BYTES = 256 * 1024;
async function readTailWindow(handle, size) {
  const length = Math.min(size, GATEWAY_DIAGNOSTIC_LOG_TAIL_BYTES);
  const readStart = size - length;
  const buffer = Buffer.alloc(length);
  let bytesRead = 0;
  while (bytesRead < length) {
    const result = await handle.read(buffer, bytesRead, length - bytesRead, readStart + bytesRead);
    if (result.bytesRead === 0) break;
    bytesRead += result.bytesRead;
  }
  return {
    buffer,
    bytesRead,
    readStart,
  };
}
/** Reads complete lines from a bounded gateway log tail. */
async function readGatewayLogTailLines(filePath) {
  const handle = await fs.open(filePath, "r");
  try {
    const stat = await handle.stat();
    if (!stat.isFile() || stat.size <= 0) return [];
    let window = await readTailWindow(handle, stat.size);
    if (window.bytesRead < window.buffer.length) {
      const refreshedStat = await handle.stat();
      if (!refreshedStat.isFile() || refreshedStat.size <= 0) return [];
      if (refreshedStat.size !== stat.size)
        window = await readTailWindow(handle, refreshedStat.size);
    }
    const { buffer, bytesRead, readStart } = window;
    let textStart = 0;
    if (readStart > 0) {
      const precedingByte = Buffer.alloc(1);
      if (
        (await handle.read(precedingByte, 0, 1, readStart - 1)).bytesRead !== 1 ||
        precedingByte[0] !== 10
      ) {
        const firstNewline = buffer.subarray(0, bytesRead).indexOf(10);
        if (firstNewline === -1) return [];
        textStart = firstNewline + 1;
      }
    }
    const lines = buffer.subarray(textStart, bytesRead).toString("utf8").split(/\r?\n/u);
    if (lines.at(-1) === "") lines.pop();
    return lines;
  } finally {
    await handle.close();
  }
}
function findLastNonEmptyLine(lines) {
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    const line = lines[i]?.trim();
    if (line) return line;
  }
  return null;
}
async function readLastGatewayErrorLine(env, options) {
  const platform = options?.platform ?? process.platform;
  const readStderr = platform !== "darwin";
  const { stdoutPath, stderrPath } =
    platform === "darwin"
      ? resolveGatewaySupervisorLogPaths(env, { platform })
      : resolveGatewayLogPaths(env);
  const stderrLines = readStderr ? await readGatewayLogTailLines(stderrPath).catch(() => []) : [];
  const stdoutLines = await readGatewayLogTailLines(stdoutPath).catch(() => []);
  const lines = [...stdoutLines, ...stderrLines].map((line) => line.trim());
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    const line = lines[i];
    if (!line) continue;
    if (GATEWAY_LOG_ERROR_PATTERNS.some((pattern) => pattern.test(line))) return line;
  }
  if (options?.requirePatternMatch) return null;
  return readStderr
    ? (findLastNonEmptyLine(stderrLines) ?? findLastNonEmptyLine(stdoutLines))
    : findLastNonEmptyLine(stdoutLines);
}
//#endregion
export { readLastGatewayErrorLine as n, readGatewayLogTailLines as t };
