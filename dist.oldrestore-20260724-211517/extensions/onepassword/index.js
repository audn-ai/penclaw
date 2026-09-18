import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs";
import fs$1 from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import "../../process-runtime-BKNTr1ic.js";
import {
  c as normalizePluginsConfig,
  l as resolveEffectiveEnableState,
} from "../../config-state-C1Qyxaws.js";
import { n as runExec } from "../../exec-CXKmx4dL.js";
import { n as resolveLivePluginConfigObject } from "../../plugin-config-runtime-ef53THzv.js";
import { t as definePluginEntry } from "../../plugin-entry-DzBhXPVE.js";
import { t as jsonResult } from "../../tool-results-BCM3fdVS.js";
//#region extensions/onepassword/src/config.ts
const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{0,63}$/;
const MAX_DESCRIPTION_LENGTH = 200;
function isRecord$1(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function requiredString(record, key) {
  const value = record[key];
  if (typeof value !== "string" || !value.trim())
    throw new Error(`1Password config ${key} must be a non-empty string`);
  return value.trim();
}
function optionalString(record, key) {
  const value = record[key];
  if (value === void 0) return;
  if (typeof value !== "string" || !value.trim())
    throw new Error(`1Password config ${key} must be a non-empty string`);
  return value.trim();
}
function readPolicy(value, label, fallback) {
  if (value === void 0) return fallback;
  if (value === "auto" || value === "approve" || value === "deny") return value;
  throw new Error(`1Password config ${label} must be auto, approve, or deny`);
}
function readNumber(record, key, fallback, options) {
  const value = record[key] ?? fallback;
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    (options.integer && !Number.isInteger(value)) ||
    (options.allowZero ? value < 0 : value <= 0)
  )
    throw new Error(`1Password config ${key} must be a valid positive number`);
  return value;
}
function parseOnePasswordConfig(value) {
  if (!isRecord$1(value) || Object.keys(value).length === 0) return;
  const vault = requiredString(value, "vault");
  if (vault.startsWith("-")) throw new Error("1Password config vault must not start with a hyphen");
  const defaultPolicy = readPolicy(value.defaultPolicy, "defaultPolicy", "approve");
  if (!isRecord$1(value.items) || Object.keys(value.items).length === 0)
    throw new Error("1Password config items must contain at least one registered slug");
  if (Object.keys(value.items).length > 32)
    throw new Error(`1Password config items must contain at most 32 registered slugs`);
  const items = Object.create(null);
  for (const [slug, rawItem] of Object.entries(value.items)) {
    if (!SLUG_PATTERN.test(slug)) throw new Error(`Invalid 1Password item slug: ${slug}`);
    if (!isRecord$1(rawItem)) throw new Error(`1Password config item ${slug} must be an object`);
    const item = requiredString(rawItem, "item");
    if (item.startsWith("-"))
      throw new Error(`1Password config item ${slug} item must not start with a hyphen`);
    const itemVault = optionalString(rawItem, "vault") ?? vault;
    if (itemVault.startsWith("-"))
      throw new Error(`1Password config item ${slug} vault must not start with a hyphen`);
    const description = optionalString(rawItem, "description");
    if (description && description.length > MAX_DESCRIPTION_LENGTH)
      throw new Error(
        `1Password config item ${slug} description must be at most ${MAX_DESCRIPTION_LENGTH} characters`,
      );
    const field = optionalString(rawItem, "field") ?? "credential";
    if (field.includes(","))
      throw new Error(`1Password config item ${slug} field must not contain commas`);
    items[slug] = {
      item,
      vault: itemVault,
      field,
      policy: readPolicy(rawItem.policy, `items.${slug}.policy`, defaultPolicy),
      ...(description ? { description } : {}),
    };
  }
  const opBin = optionalString(value, "opBin");
  if (opBin && !path.isAbsolute(opBin))
    throw new Error("1Password config opBin must be an absolute path");
  return {
    vault,
    ...(opBin ? { opBin } : {}),
    defaultPolicy,
    cacheTtlSeconds: readNumber(value, "cacheTtlSeconds", 300, {
      integer: true,
      allowZero: true,
    }),
    grantTtlHours: readNumber(value, "grantTtlHours", 720, {
      integer: false,
      allowZero: false,
    }),
    opTimeoutMs: readNumber(value, "opTimeoutMs", 15e3, {
      integer: true,
      allowZero: false,
    }),
    items,
  };
}
//#endregion
//#region extensions/onepassword/src/errors.ts
var OnePasswordError = class extends Error {
  constructor(code, message, options) {
    super(message, options);
    this.name = "OnePasswordError";
    this.code = code;
  }
};
//#endregion
//#region extensions/onepassword/src/pending-authorization.ts
function takePendingAuthorization(pending, exactKey, request) {
  const exact = pending.get(exactKey);
  if (exact) {
    pending.delete(exactKey);
    return exact;
  }
  let match;
  for (const entry of pending) {
    const candidate = entry[1];
    if (
      candidate.agentId !== request.agentId ||
      candidate.toolCallId !== request.toolCallId ||
      candidate.slug !== request.slug ||
      candidate.reason !== request.reason
    )
      continue;
    if (match) return;
    match = entry;
  }
  if (!match) return;
  pending.delete(match[0]);
  return match[1];
}
//#endregion
//#region extensions/onepassword/src/broker.ts
const APPROVAL_TIMEOUT_MS = 6e5;
const PENDING_AUTHORIZATION_TTL_MS = APPROVAL_TIMEOUT_MS;
function textParam(params, key) {
  const value = params[key];
  return typeof value === "string" ? value.trim() : void 0;
}
var BrokerError = class extends Error {
  constructor(code, message) {
    super(message);
    this.name = "BrokerError";
    this.code = code;
  }
};
function internalError(code, message) {
  return new BrokerError(code, message);
}
function fingerprintOnePasswordTarget(item) {
  return createHash("sha256")
    .update(JSON.stringify([item.vault, item.item, item.field]))
    .digest("hex");
}
function standingGrantKey(agentId, slug) {
  return createHash("sha256")
    .update(JSON.stringify([agentId, slug]))
    .digest("hex");
}
function parseToolInput(params) {
  if (params.action === "list") return { action: "list" };
  if (params.action !== "get") throw internalError("INVALID_ACTION", "action must be list or get");
  const reason = textParam(params, "reason");
  if (!reason || reason.length > 300)
    throw internalError("INVALID_REASON", "reason is required and must be at most 300 characters");
  const slug = textParam(params, "slug");
  if (!slug || !SLUG_PATTERN.test(slug))
    throw internalError("INVALID_SLUG", "slug must match ^[a-z0-9][a-z0-9-]{0,63}$");
  return {
    action: "get",
    slug,
    reason,
  };
}
function errorCode(error) {
  if (error instanceof OnePasswordError) return error.code;
  if (error instanceof BrokerError) return error.code;
}
var OnePasswordBroker = class {
  constructor(options) {
    this.cache = /* @__PURE__ */ new Map();
    this.pending = /* @__PURE__ */ new Map();
    this.resolveConfig = options.resolveConfig;
    this.opClient = options.opClient;
    this.stores = options.stores;
    this.now = options.now ?? Date.now;
  }
  observeConfigFingerprint(fingerprint) {
    if (this.lastConfigFingerprint !== void 0 && this.lastConfigFingerprint !== fingerprint) {
      this.cache.clear();
      this.pending.clear();
    }
    this.lastConfigFingerprint = fingerprint;
  }
  currentConfig() {
    const config = this.resolveConfig();
    if (!config) {
      this.observeConfigFingerprint(null);
      throw internalError("POLICY_CHANGED", "1Password broker is no longer configured");
    }
    const fingerprint = createHash("sha256").update(JSON.stringify(config)).digest("hex");
    this.observeConfigFingerprint(fingerprint);
    return {
      config,
      fingerprint,
    };
  }
  context(event, ctx, input) {
    return {
      agentId: ctx.agentId ?? "unknown",
      sessionKey: ctx.sessionKey ?? "unknown",
      sessionId: ctx.sessionId ?? "unknown",
      toolCallId: event.toolCallId ?? ctx.toolCallId ?? "unknown",
      slug: input.slug ?? "unknown",
      reason: input.reason ?? "",
    };
  }
  pendingKey(context) {
    const { agentId, sessionKey, sessionId, toolCallId } = context;
    return JSON.stringify([agentId, sessionKey, sessionId, toolCallId]);
  }
  async audit(context, outcome, options = {}) {
    const timestampMs = this.now();
    const key = `${String(timestampMs).padStart(16, "0")}:${context.toolCallId}:${randomUUID()}`;
    await this.stores.audit.register(key, {
      timestampMs,
      agentId: context.agentId,
      sessionKey: context.sessionKey,
      toolCallId: context.toolCallId,
      slug: context.slug,
      reason: context.reason,
      outcome,
      ...(options.errorCode ? { errorCode: options.errorCode } : {}),
    });
  }
  sweepPending() {
    const now = this.now();
    for (const [key, authorization] of this.pending)
      if (authorization.expiresAtMs <= now) this.pending.delete(key);
  }
  async pruneStaleGrants(config) {
    const now = this.now();
    for (const entry of await this.stores.grants.entries()) {
      const item = Object.hasOwn(config.items, entry.value.slug)
        ? config.items[entry.value.slug]
        : void 0;
      if (
        !item ||
        entry.key !== standingGrantKey(entry.value.agentId, entry.value.slug) ||
        entry.value.expiresAtMs <= now ||
        entry.value.targetFingerprint !== fingerprintOnePasswordTarget(item)
      )
        await this.stores.grants.delete(entry.key);
    }
  }
  async beforeToolCall(event, ctx) {
    if (event.toolName !== "onepassword") return;
    let input;
    try {
      input = parseToolInput(event.params);
    } catch (error) {
      const context = this.context(event, ctx, {
        slug: textParam(event.params, "slug"),
        reason: textParam(event.params, "reason"),
      });
      await this.audit(context, "error", { errorCode: errorCode(error) ?? "INVALID_ACTION" });
      return {
        block: true,
        blockReason: error instanceof Error ? error.message : "Invalid request",
      };
    }
    if (input.action === "list") return;
    const context = this.context(event, ctx, input);
    let config;
    let configFingerprint;
    try {
      ({ config, fingerprint: configFingerprint } = this.currentConfig());
    } catch (error) {
      await this.audit(context, "error", { errorCode: errorCode(error) });
      return {
        block: true,
        blockReason: error instanceof Error ? error.message : "1Password broker is unavailable",
      };
    }
    if (!Object.hasOwn(config.items, input.slug)) {
      await this.audit(context, "error", { errorCode: "UNKNOWN_SLUG" });
      return {
        block: true,
        blockReason: `Unknown 1Password slug: ${input.slug}`,
      };
    }
    const item = config.items[input.slug];
    if (!item) throw new Error(`Missing 1Password config for registered slug: ${input.slug}`);
    if (!event.toolCallId && !ctx.toolCallId) {
      await this.audit(context, "error", { errorCode: "TOOL_CALL_ID_MISSING" });
      return {
        block: true,
        blockReason: "1Password request is missing a tool call id",
      };
    }
    if (item.policy === "deny") {
      await this.audit(context, "policy-denied");
      return {
        block: true,
        blockReason: `1Password access denied by policy for ${input.slug}`,
      };
    }
    this.sweepPending();
    if (item.policy === "auto") {
      this.pending.set(this.pendingKey(context), {
        ...context,
        outcome: "auto",
        persistGrant: false,
        configFingerprint,
        targetFingerprint: fingerprintOnePasswordTarget(item),
        expiresAtMs: this.now() + PENDING_AUTHORIZATION_TTL_MS,
      });
      return;
    }
    const grantKey =
      context.agentId === "unknown" ? void 0 : standingGrantKey(context.agentId, input.slug);
    const grant = grantKey ? await this.stores.grants.lookup(grantKey) : void 0;
    if (
      grant &&
      grant.agentId === context.agentId &&
      grant.slug === input.slug &&
      grant.expiresAtMs > this.now() &&
      grant.targetFingerprint === fingerprintOnePasswordTarget(item)
    ) {
      this.pending.set(this.pendingKey(context), {
        ...context,
        outcome: "grant",
        persistGrant: false,
        configFingerprint,
        targetFingerprint: fingerprintOnePasswordTarget(item),
        expiresAtMs: this.now() + PENDING_AUTHORIZATION_TTL_MS,
      });
      return;
    }
    if (grant && grantKey) await this.stores.grants.delete(grantKey);
    return {
      requireApproval: {
        title: `1Password: ${input.slug}`,
        description: `Agent ${context.agentId} requests ${input.slug}. Reason: ${input.reason}`,
        severity: "warning",
        timeoutMs: APPROVAL_TIMEOUT_MS,
        allowedDecisions:
          context.agentId === "unknown"
            ? ["allow-once", "deny"]
            : ["allow-once", "allow-always", "deny"],
        onResolution: async (decision) => {
          if (decision === "allow-once" || decision === "allow-always") {
            this.pending.set(this.pendingKey(context), {
              ...context,
              outcome: "approved",
              persistGrant: decision === "allow-always" && context.agentId !== "unknown",
              configFingerprint,
              targetFingerprint: fingerprintOnePasswordTarget(item),
              expiresAtMs: this.now() + PENDING_AUTHORIZATION_TTL_MS,
            });
            return;
          }
          if (decision === "deny") {
            await this.audit(context, "denied");
            return;
          }
          if (decision === "timeout") {
            await this.audit(context, "timeout");
            return;
          }
          await this.audit(context, "error", { errorCode: "APPROVAL_CANCELLED" });
        },
      },
    };
  }
  async list(invocation) {
    const { config } = this.currentConfig();
    const grants = new Map(
      (await this.stores.grants.entries()).map((entry) => [entry.key, entry.value]),
    );
    const now = this.now();
    const agentId = invocation.agentId;
    return Object.entries(config.items)
      .toSorted(([left], [right]) => left.localeCompare(right))
      .map(([slug, item]) => {
        const grant = agentId ? grants.get(standingGrantKey(agentId, slug)) : void 0;
        return {
          slug,
          description: item.description ?? "",
          policy: item.policy,
          standingGrantActive: Boolean(
            grant &&
            grant.agentId === agentId &&
            grant.slug === slug &&
            grant.expiresAtMs > now &&
            grant.targetFingerprint === fingerprintOnePasswordTarget(item),
          ),
        };
      });
  }
  async get(toolCallId, input, invocation) {
    this.sweepPending();
    const fallbackContext = {
      agentId: invocation.agentId ?? "unknown",
      sessionKey: invocation.sessionKey ?? "unknown",
      sessionId: invocation.sessionId ?? "unknown",
      toolCallId,
      slug: input.slug,
      reason: input.reason,
    };
    const key = this.pendingKey(fallbackContext);
    const authorization = takePendingAuthorization(this.pending, key, fallbackContext);
    if (
      !authorization ||
      authorization.slug !== input.slug ||
      authorization.reason !== input.reason
    ) {
      await this.audit(fallbackContext, "error", { errorCode: "POLICY_NOT_EVALUATED" });
      throw internalError(
        "POLICY_NOT_EVALUATED",
        "1Password policy was not evaluated for this request",
      );
    }
    let config;
    let configFingerprint;
    try {
      ({ config, fingerprint: configFingerprint } = this.currentConfig());
    } catch (error) {
      await this.audit(authorization, "error", { errorCode: errorCode(error) });
      throw error;
    }
    if (!Object.hasOwn(config.items, input.slug)) {
      await this.audit(authorization, "error", { errorCode: "UNKNOWN_SLUG" });
      throw internalError("UNKNOWN_SLUG", `Unknown 1Password slug: ${input.slug}`);
    }
    const item = config.items[input.slug];
    if (!item) throw new Error(`Missing 1Password config for registered slug: ${input.slug}`);
    if (item.policy === "deny") {
      await this.audit(authorization, "policy-denied");
      throw internalError("POLICY_CHANGED", `1Password access denied by policy for ${input.slug}`);
    }
    if (
      (authorization.outcome === "auto" && item.policy !== "auto") ||
      (authorization.outcome !== "auto" && item.policy !== "approve") ||
      authorization.configFingerprint !== configFingerprint ||
      authorization.targetFingerprint !== fingerprintOnePasswordTarget(item)
    ) {
      await this.audit(authorization, "error", { errorCode: "POLICY_CHANGED" });
      throw internalError("POLICY_CHANGED", "1Password policy changed before tool execution");
    }
    if (authorization.outcome === "grant") {
      const grant = await this.stores.grants.lookup(
        standingGrantKey(authorization.agentId, input.slug),
      );
      if (
        !grant ||
        grant.agentId !== authorization.agentId ||
        grant.slug !== input.slug ||
        grant.expiresAtMs <= this.now() ||
        grant.targetFingerprint !== fingerprintOnePasswordTarget(item)
      ) {
        await this.audit(authorization, "error", { errorCode: "GRANT_EXPIRED" });
        throw internalError(
          "GRANT_EXPIRED",
          "1Password standing grant expired before tool execution",
        );
      }
    }
    if (authorization.persistGrant) {
      const grantedAtMs = this.now();
      const ttlMs = Math.round(config.grantTtlHours * 60 * 60 * 1e3);
      try {
        await this.pruneStaleGrants(config);
        await this.stores.grants.register(
          standingGrantKey(authorization.agentId, input.slug),
          {
            agentId: authorization.agentId,
            slug: input.slug,
            grantedAtMs,
            expiresAtMs: grantedAtMs + ttlMs,
            targetFingerprint: fingerprintOnePasswordTarget(item),
          },
          { ttlMs },
        );
      } catch (error) {
        await this.audit(authorization, "error", { errorCode: errorCode(error) });
        throw error;
      }
    }
    const cached = this.cache.get(input.slug);
    const targetFingerprint = fingerprintOnePasswordTarget(item);
    if (
      cached &&
      cached.expiresAtMs > this.now() &&
      cached.targetFingerprint === targetFingerprint
    ) {
      await this.audit(authorization, "cache-hit");
      return {
        slug: input.slug,
        value: cached.value,
        itemTitle: cached.itemTitle,
        fieldLabel: cached.fieldLabel,
      };
    }
    this.cache.delete(input.slug);
    try {
      const secret = await this.opClient.getItem(item);
      await this.audit(authorization, authorization.outcome);
      if (config.cacheTtlSeconds > 0)
        this.cache.set(input.slug, {
          ...secret,
          targetFingerprint,
          expiresAtMs: this.now() + config.cacheTtlSeconds * 1e3,
        });
      return {
        slug: input.slug,
        ...secret,
      };
    } catch (error) {
      await this.audit(authorization, "error", { errorCode: errorCode(error) });
      throw error;
    }
  }
};
//#endregion
//#region extensions/onepassword/src/op-client.ts
const MAX_STDOUT_BYTES = 1024 * 1024;
async function defaultRunner(file, args, options) {
  return await runExec(file, args, {
    baseEnv: {},
    env: options.env,
    logOutput: false,
    maxBuffer: options.maxBufferBytes,
    timeoutMs: options.timeoutMs,
  });
}
function isExecutable(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.X_OK);
    return true;
  } catch {
    return false;
  }
}
function resolveOpBinary(configuredPath, pathEnv) {
  if (configuredPath) return isExecutable(configuredPath) ? configuredPath : void 0;
  const executable = process.platform === "win32" ? "op.exe" : "op";
  for (const directory of pathEnv.split(path.delimiter)) {
    if (!directory) continue;
    const candidate = path.resolve(directory, executable);
    if (isExecutable(candidate)) return candidate;
  }
}
function errorRecord(error) {
  return error && typeof error === "object" ? error : {};
}
function classifyOpError(error) {
  if (error instanceof OnePasswordError) return error;
  const record = errorRecord(error);
  const normalized = (typeof record.stderr === "string" ? record.stderr : "").toLowerCase();
  if (record.code === "ENOENT")
    return new OnePasswordError("OP_NOT_FOUND", "1Password CLI executable was not found");
  if (
    record.killed === true ||
    record.timedOut === true ||
    record.code === "ETIMEDOUT" ||
    record.signal === "SIGTERM"
  )
    return new OnePasswordError("TIMEOUT", "1Password CLI request timed out");
  if (
    /item.+(is not found|isn't found|not found|does not exist)|could not find.+item|isn't an item\b/u.test(
      normalized,
    )
  )
    return new OnePasswordError("ITEM_NOT_FOUND", "1Password item was not found");
  if (
    /isn't a field\b|field.+(?:is not found|isn't found|not found|does not exist)/u.test(normalized)
  )
    return new OnePasswordError("FIELD_NOT_FOUND", "1Password field was not found");
  if (
    /unauthorized|authentication|not signed in|invalid service account|permission denied/u.test(
      normalized,
    )
  )
    return new OnePasswordError("AUTH_FAILED", "1Password service account authentication failed");
  if (/\b429\b|rate[ -]?limit|too many requests/u.test(normalized))
    return new OnePasswordError("RATE_LIMITED", "1Password rate limit reached");
  return new OnePasswordError("OP_ERROR", "1Password CLI request failed");
}
function parseField(stdout, requestedField, itemTitle) {
  let field;
  try {
    const parsed = JSON.parse(stdout);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      throw new Error("field response is not an object");
    field = parsed;
  } catch (error) {
    throw new OnePasswordError("OP_ERROR", "1Password CLI returned invalid JSON", { cause: error });
  }
  if (
    (field.label !== requestedField && field.id !== requestedField) ||
    typeof field.value !== "string"
  )
    throw new OnePasswordError(
      "FIELD_NOT_FOUND",
      `1Password field ${requestedField} was not found`,
    );
  return {
    value: field.value,
    itemTitle,
    fieldLabel: typeof field.label === "string" ? field.label : requestedField,
  };
}
var OpClient = class {
  constructor(options) {
    this.permissionWarningEmitted = false;
    this.opBin = resolveOpBinary(options.opBin, options.pathEnv ?? process.env.PATH ?? "");
    this.tokenFile = options.tokenFile;
    this.timeoutMs = options.timeoutMs;
    this.runner = options.runner ?? defaultRunner;
    this.home = options.home ?? os.homedir();
    this.warn = options.warn ?? (() => void 0);
  }
  async tokenFilePresent() {
    try {
      await fs$1.access(this.tokenFile, fs.constants.R_OK);
      return true;
    } catch {
      return false;
    }
  }
  async readToken() {
    let contents;
    try {
      const [raw, stat] = await Promise.all([
        fs$1.readFile(this.tokenFile, "utf8"),
        fs$1.stat(this.tokenFile),
      ]);
      contents = raw.trim();
      if (
        !this.permissionWarningEmitted &&
        process.platform !== "win32" &&
        (stat.mode & 63) !== 0
      ) {
        this.permissionWarningEmitted = true;
        this.warn("1Password service account token file permissions are broader than 0600");
      }
    } catch (error) {
      throw new OnePasswordError(
        "TOKEN_MISSING",
        "1Password service account token file is missing",
        { cause: error },
      );
    }
    if (!contents)
      throw new OnePasswordError("TOKEN_MISSING", "1Password service account token file is empty");
    return contents;
  }
  async getItem(params) {
    if (!this.opBin)
      throw new OnePasswordError("OP_NOT_FOUND", "1Password CLI executable was not found");
    const token = await this.readToken();
    const args = [
      "item",
      "get",
      params.item,
      "--vault",
      params.vault,
      "--fields",
      params.field,
      "--format",
      "json",
      "--cache=false",
    ];
    try {
      return parseField(
        (
          await this.runner(this.opBin, args, {
            env: {
              OP_SERVICE_ACCOUNT_TOKEN: token,
              HOME: this.home,
            },
            timeoutMs: this.timeoutMs,
            maxBufferBytes: MAX_STDOUT_BYTES,
          })
        ).stdout,
        params.field,
        params.item,
      );
    } catch (error) {
      throw classifyOpError(error);
    }
  }
};
//#endregion
//#region extensions/onepassword/src/tool.ts
const OnePasswordToolSchema = {
  type: "object",
  additionalProperties: false,
  required: ["action"],
  properties: {
    action: {
      type: "string",
      enum: ["list", "get"],
      description: "List registered secret slugs or get one registered secret.",
    },
    slug: {
      type: "string",
      pattern: "^[a-z0-9][a-z0-9-]{0,63}$",
      description: "Registered secret slug. Required for get.",
    },
    reason: {
      type: "string",
      minLength: 1,
      maxLength: 300,
      description: "Why the agent needs this secret. Required for get.",
    },
  },
};
function errorResult(error) {
  return jsonResult({
    ok: false,
    error: {
      code:
        error instanceof OnePasswordError
          ? error.code
          : error && typeof error === "object" && "code" in error && typeof error.code === "string"
            ? error.code
            : "OP_ERROR",
      message: error instanceof Error ? error.message : "1Password request failed",
    },
  });
}
function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function redactPersistedOnePasswordResult(event) {
  if (
    event.message.role !== "toolResult" ||
    (event.toolName ?? event.message.toolName) !== "onepassword"
  )
    return;
  const details = event.message.details;
  const contentText = event.message.content
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n");
  if (
    !((isRecord(details) && typeof details.value === "string") || /"value"\s*:/.test(contentText))
  )
    return;
  const safeDetails = isRecord(details) ? details : {};
  const persisted = {
    ok: true,
    redacted: true,
    ...(typeof safeDetails.slug === "string" ? { slug: safeDetails.slug } : {}),
    ...(typeof safeDetails.itemTitle === "string" ? { itemTitle: safeDetails.itemTitle } : {}),
    ...(typeof safeDetails.fieldLabel === "string" ? { fieldLabel: safeDetails.fieldLabel } : {}),
  };
  return {
    message: {
      ...event.message,
      content: [
        {
          type: "text",
          text: JSON.stringify(persisted, null, 2),
        },
      ],
      details: persisted,
    },
  };
}
function createOnePasswordTool(broker, invocation) {
  return {
    name: "onepassword",
    label: "1Password",
    description:
      "List curated 1Password secret slugs or retrieve one secret under its configured access policy.",
    parameters: OnePasswordToolSchema,
    execute: async (toolCallId, rawParams) => {
      const params =
        rawParams && typeof rawParams === "object" && !Array.isArray(rawParams) ? rawParams : {};
      try {
        const input = parseToolInput(params);
        if (input.action === "list")
          return jsonResult({
            ok: true,
            items: await broker.list(invocation),
          });
        return jsonResult({
          ok: true,
          ...(await broker.get(toolCallId, input, invocation)),
        });
      } catch (error) {
        return errorResult(error);
      }
    },
  };
}
//#endregion
//#region extensions/onepassword/index.ts
const MAX_AUDIT_ROWS = 4e4;
const MAX_STANDING_GRANTS = 1024;
var onepassword_default = definePluginEntry({
  id: "onepassword",
  name: "1Password",
  description: "Curated 1Password secrets broker with approval policy and SQLite audit history.",
  register(api) {
    const startupConfig = parseOnePasswordConfig(api.pluginConfig);
    const resolveCurrentConfig = () => {
      const liveConfig = api.runtime.config?.current ? api.runtime.config.current() : void 0;
      if (!liveConfig) return startupConfig;
      const livePluginConfig = resolveLivePluginConfigObject(
        () => liveConfig,
        "onepassword",
        api.pluginConfig,
      );
      return resolveEffectiveEnableState({
        id: "onepassword",
        origin: "bundled",
        config: normalizePluginsConfig(liveConfig.plugins),
        rootConfig: liveConfig,
        enabledByDefault: livePluginConfig !== void 0,
      }).enabled
        ? parseOnePasswordConfig(livePluginConfig)
        : void 0;
    };
    const grants = api.runtime.state.openKeyedStore({
      namespace: "grants",
      maxEntries: MAX_STANDING_GRANTS,
      overflowPolicy: "evict-oldest",
    });
    const audit = api.runtime.state.openKeyedStore({
      namespace: "audit",
      maxEntries: MAX_AUDIT_ROWS,
      overflowPolicy: "evict-oldest",
    });
    const tokenFile = path.join(
      api.runtime.state.resolveStateDir(process.env),
      "credentials",
      "onepassword",
      "service-account-token",
    );
    let cachedOpClient;
    const resolveCurrentOpClient = () => {
      const config = resolveCurrentConfig();
      const key = JSON.stringify([config?.opBin ?? null, config?.opTimeoutMs ?? 15e3]);
      if (cachedOpClient?.key === key) return cachedOpClient.client;
      const client = new OpClient({
        opBin: config?.opBin,
        tokenFile,
        timeoutMs: config?.opTimeoutMs ?? 15e3,
        warn: (message) => api.logger.warn(message),
      });
      cachedOpClient = {
        key,
        client,
      };
      return client;
    };
    const broker = startupConfig
      ? new OnePasswordBroker({
          resolveConfig: resolveCurrentConfig,
          opClient: { getItem: (params) => resolveCurrentOpClient().getItem(params) },
          stores: {
            audit,
            grants,
          },
        })
      : void 0;
    api.registerCli(
      async ({ program }) => {
        const { registerOnePasswordCommands } = await import("../../cli-0d0gFu2O.js");
        registerOnePasswordCommands({
          program,
          resolveConfig: resolveCurrentConfig,
          resolveOpClient: resolveCurrentOpClient,
          auditStore: audit,
        });
      },
      {
        descriptors: [
          {
            name: "onepassword",
            description: "Inspect the 1Password secrets broker",
            hasSubcommands: true,
          },
        ],
      },
    );
    if (!broker) return;
    api.registerTool((context) => createOnePasswordTool(broker, context), { name: "onepassword" });
    api.on("before_tool_call", (event, ctx) => broker.beforeToolCall(event, ctx));
    api.on("tool_result_persist", redactPersistedOnePasswordResult);
  },
});
//#endregion
export { onepassword_default as default };
