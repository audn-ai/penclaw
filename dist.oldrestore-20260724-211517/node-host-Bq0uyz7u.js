import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { t as spawnTerminalPty } from "./terminal-pty-BOVSjGUD.js";
//#region src/node-host/pty-command.ts
function resolvePtyCwd(candidate) {
  if (candidate && path.isAbsolute(candidate))
    try {
      if (fs.statSync(candidate).isDirectory()) return candidate;
    } catch {}
  return os.homedir();
}
function decodePtyInput(payloadJSON) {
  try {
    const value = JSON.parse(payloadJSON);
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const input = value;
    if (input.kind === "data" && typeof input.data === "string")
      return {
        kind: "data",
        data: input.data,
      };
    if (
      input.kind === "resize" &&
      Number.isInteger(input.cols) &&
      Number.isInteger(input.rows) &&
      input.cols >= 1 &&
      input.cols <= 2e3 &&
      input.rows >= 1 &&
      input.rows <= 2e3
    )
      return {
        kind: "resize",
        cols: input.cols,
        rows: input.rows,
      };
    return null;
  } catch {
    return null;
  }
}
function decodeNodePtyResumeParams(paramsJSON, validateThreadId) {
  let value;
  try {
    value = JSON.parse(paramsJSON ?? "");
  } catch {
    throw new Error("INVALID_REQUEST: terminal resume params must be valid JSON");
  }
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("INVALID_REQUEST: terminal resume params must be an object");
  const record = value;
  const allowed = /* @__PURE__ */ new Set(["threadId", "cwd", "cols", "rows"]);
  const unknown = Object.keys(record).find((key) => !allowed.has(key));
  if (unknown) throw new Error(`INVALID_REQUEST: unknown terminal resume parameter: ${unknown}`);
  const dimension = (candidate, label) => {
    if (!Number.isInteger(candidate) || candidate < 1 || candidate > 2e3)
      throw new Error(`INVALID_REQUEST: ${label} must be an integer from 1 to 2000`);
    return candidate;
  };
  if (
    record.cwd !== void 0 &&
    (typeof record.cwd !== "string" || Buffer.byteLength(record.cwd, "utf8") > 4096)
  )
    throw new Error("INVALID_REQUEST: cwd must be a bounded string");
  return {
    threadId: validateThreadId(record.threadId),
    ...(typeof record.cwd === "string" && record.cwd ? { cwd: record.cwd } : {}),
    cols: dimension(record.cols, "cols"),
    rows: dimension(record.rows, "rows"),
  };
}
/** Runs one allowlisted plugin-owned command in an interactive node PTY. */
async function runNodePtyCommand(params, io, spawn = spawnTerminalPty) {
  if (io.signal.aborted) return { exitCode: 130 };
  const env = Object.fromEntries(
    Object.entries(process.env).filter((entry) => entry[1] !== void 0),
  );
  env.TERM ??= "xterm-256color";
  env.OPENCLAW_TERMINAL = "1";
  const pty = await spawn({
    file: params.file,
    args: params.args,
    cwd: resolvePtyCwd(params.cwd),
    env,
    cols: params.cols,
    rows: params.rows,
  });
  let outputQueue = Promise.resolve();
  let settled = false;
  const kill = () => pty.kill();
  io.signal.addEventListener("abort", kill, { once: true });
  if (io.signal.aborted) kill();
  io.onInput((payloadJSON) => {
    if (settled || io.signal.aborted) return;
    const input = decodePtyInput(payloadJSON);
    try {
      if (input?.kind === "data") pty.write(input.data);
      else if (input?.kind === "resize") pty.resize(input.cols, input.rows);
    } catch {}
  });
  pty.onData((chunk) => {
    if (settled) return;
    pty.pause();
    outputQueue = outputQueue.then(() => io.emitChunk(chunk)).finally(() => pty.resume());
  });
  return await new Promise((resolve) => {
    pty.onExit((event) => {
      if (settled) return;
      settled = true;
      io.signal.removeEventListener("abort", kill);
      outputQueue.finally(() =>
        resolve({
          exitCode: event.exitCode,
          ...(event.signal ? { signal: event.signal } : {}),
        }),
      );
    });
  });
}
//#endregion
export { runNodePtyCommand as n, decodeNodePtyResumeParams as t };
