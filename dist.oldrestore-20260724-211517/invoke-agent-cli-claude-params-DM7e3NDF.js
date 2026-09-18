import fs from "node:fs/promises";
//#region src/node-host/invoke-agent-cli-claude-params.ts
const MAX_ARG_COUNT = 128;
const MAX_ARG_BYTES = 1024 * 1024;
const MAX_REQUEST_BYTES = 2 * 1024 * 1024;
const MAX_TIMEOUT_MS = 1440 * 60 * 1e3;
const MIN_IDLE_TIMEOUT_MS = 1e3;
const MAX_IDLE_TIMEOUT_MS = 1800 * 1e3;
const BARE_ARGS = /* @__PURE__ */ new Set([
  "-p",
  "--print",
  "--include-partial-messages",
  "--verbose",
  "--fork-session",
  "--safe-mode",
  "--bare",
  "--no-chrome",
  "--disable-slash-commands",
  "--no-session-persistence",
  "--exclude-dynamic-system-prompt-sections",
  "--include-hook-events",
  "--replay-user-messages",
]);
const VALUE_ARGS = /* @__PURE__ */ new Set([
  "--output-format",
  "--input-format",
  "--setting-sources",
  "--permission-mode",
  "--resume",
  "-r",
  "--session-id",
  "--model",
  "--effort",
  "--max-turns",
  "--fallback-model",
  "--prompt-suggestions",
  "--max-budget-usd",
  "--tools",
  "--disallowedTools",
]);
const ENV_ALLOWLIST = /* @__PURE__ */ new Set([
  "FORCE_COLOR",
  "LANG",
  "LC_ALL",
  "LC_CTYPE",
  "NO_COLOR",
  "TERM",
]);
function asRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}
function decodeJson(raw) {
  if (!raw) throw new Error("INVALID_REQUEST: paramsJSON required");
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("INVALID_REQUEST: paramsJSON malformed JSON");
  }
}
function requireBoundedString(value, label, maxBytes) {
  if (typeof value !== "string" || Buffer.byteLength(value, "utf8") > maxBytes)
    throw new Error(`INVALID_REQUEST: ${label} must be a bounded string`);
  return value;
}
/** Claude CLI session ids are bounded, non-option argv values. */
function validateClaudeSessionId(value) {
  const sessionId = requireBoundedString(value, "threadId", MAX_ARG_BYTES).trim();
  if (!sessionId || sessionId.startsWith("-"))
    throw new Error("INVALID_REQUEST: threadId must be a Claude session id");
  return sessionId;
}
function validateArgs(value) {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_ARG_COUNT)
    throw new Error("INVALID_REQUEST: argv must be a bounded non-empty array");
  const args = value.map((entry, index) =>
    requireBoundedString(entry, `argv[${index}]`, MAX_ARG_BYTES),
  );
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index] ?? "";
    const equalsIndex = arg.indexOf("=");
    const name = equalsIndex > 0 ? arg.slice(0, equalsIndex) : arg;
    if (BARE_ARGS.has(arg)) continue;
    if (!VALUE_ARGS.has(name))
      throw new Error(`INVALID_REQUEST: unsupported Claude CLI argument: ${arg || "<empty>"}`);
    if (equalsIndex > 0) {
      const inlineValue = arg.slice(equalsIndex + 1);
      if (!inlineValue || inlineValue.startsWith("-"))
        throw new Error(
          `INVALID_REQUEST: Claude CLI argument requires a non-option value: ${name}`,
        );
      if (name === "--permission-mode" && inlineValue === "bypassPermissions")
        throw new Error("INVALID_REQUEST: bypassPermissions is not allowed for node agent runs");
      continue;
    }
    if (index + 1 >= args.length)
      throw new Error(`INVALID_REQUEST: Claude CLI argument requires a value: ${name}`);
    if (args[index + 1]?.startsWith("-"))
      throw new Error(`INVALID_REQUEST: Claude CLI argument requires a non-option value: ${name}`);
    if (name === "--permission-mode" && args[index + 1] === "bypassPermissions")
      throw new Error("INVALID_REQUEST: bypassPermissions is not allowed for node agent runs");
    index += 1;
  }
  return args;
}
function validateTimeout(value, label, min, max) {
  if (!Number.isInteger(value) || value < min || value > max)
    throw new Error(`INVALID_REQUEST: ${label} must be an integer from ${min} to ${max}`);
  return value;
}
/** Decode the narrow, binary-free request accepted by the Claude node command. */
async function decodeClaudeCliNodeRunParams(raw) {
  if (Buffer.byteLength(raw ?? "", "utf8") > MAX_REQUEST_BYTES)
    throw new Error("INVALID_REQUEST: Claude CLI request is too large");
  const value = asRecord(decodeJson(raw));
  if (!value) throw new Error("INVALID_REQUEST: Claude CLI params must be an object");
  const allowed = /* @__PURE__ */ new Set([
    "argv",
    "stdin",
    "cwd",
    "env",
    "systemPrompt",
    "agentId",
    "sessionKey",
    "approvalDecision",
    "systemRunPlan",
    "idleTimeoutMs",
    "timeoutMs",
  ]);
  const unknown = Object.keys(value).find((key) => !allowed.has(key));
  if (unknown) throw new Error(`INVALID_REQUEST: unknown Claude CLI parameter: ${unknown}`);
  const argv = validateArgs(value.argv);
  const stdin =
    value.stdin === void 0 ? void 0 : requireBoundedString(value.stdin, "stdin", MAX_REQUEST_BYTES);
  const systemPrompt =
    value.systemPrompt === void 0
      ? void 0
      : requireBoundedString(value.systemPrompt, "systemPrompt", MAX_REQUEST_BYTES);
  const agentId =
    value.agentId === void 0
      ? void 0
      : requireBoundedString(value.agentId, "agentId", MAX_ARG_BYTES);
  const sessionKey =
    value.sessionKey === void 0
      ? void 0
      : requireBoundedString(value.sessionKey, "sessionKey", MAX_ARG_BYTES);
  const approvalDecision =
    value.approvalDecision === "allow-once" || value.approvalDecision === "allow-always"
      ? value.approvalDecision
      : void 0;
  if (value.approvalDecision !== void 0 && !approvalDecision)
    throw new Error("INVALID_REQUEST: approvalDecision is invalid");
  const systemRunPlan = value.systemRunPlan === void 0 ? void 0 : asRecord(value.systemRunPlan);
  if (value.systemRunPlan !== void 0 && !systemRunPlan)
    throw new Error("INVALID_REQUEST: systemRunPlan must be an object");
  const cwd = value.cwd === void 0 ? void 0 : requireBoundedString(value.cwd, "cwd", MAX_ARG_BYTES);
  if (cwd) {
    if (!(await fs.stat(cwd).catch(() => void 0))?.isDirectory())
      throw new Error("INVALID_REQUEST: cwd must be an existing directory on the node");
  }
  let env;
  if (value.env !== void 0) {
    const envValue = asRecord(value.env);
    if (!envValue) throw new Error("INVALID_REQUEST: env must be an object");
    env = {};
    for (const [key, candidate] of Object.entries(envValue)) {
      if (!ENV_ALLOWLIST.has(key))
        throw new Error(`INVALID_REQUEST: environment key is not allowed: ${key}`);
      env[key] = requireBoundedString(candidate, `env.${key}`, MAX_ARG_BYTES);
    }
  }
  return {
    argv,
    ...(stdin !== void 0 ? { stdin } : {}),
    ...(systemPrompt !== void 0 ? { systemPrompt } : {}),
    ...(agentId ? { agentId } : {}),
    ...(sessionKey ? { sessionKey } : {}),
    ...(approvalDecision ? { approvalDecision } : {}),
    ...(systemRunPlan ? { systemRunPlan } : {}),
    ...(cwd ? { cwd } : {}),
    ...(env ? { env } : {}),
    idleTimeoutMs: validateTimeout(
      value.idleTimeoutMs,
      "idleTimeoutMs",
      MIN_IDLE_TIMEOUT_MS,
      MAX_IDLE_TIMEOUT_MS,
    ),
    timeoutMs: validateTimeout(value.timeoutMs, "timeoutMs", 1, MAX_TIMEOUT_MS),
  };
}
//#endregion
export { validateClaudeSessionId as n, decodeClaudeCliNodeRunParams as t };
