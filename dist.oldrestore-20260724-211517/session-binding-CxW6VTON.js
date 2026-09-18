import { AsyncLocalStorage } from "node:async_hooks";
import { createHash, randomUUID } from "node:crypto";
import { s as resolveDefaultAgentDir } from "./agent-scope-config-DVIR1nBa.js";
import { y as resolveSessionAgentIds } from "./agent-scope-y9xQv_q1.js";
import {
  n as CODEX_PLUGINS_WORKSPACE_MARKETPLACE_NAME,
  t as CODEX_PLUGINS_MARKETPLACE_NAME,
  u as normalizeCodexServiceTier,
} from "./config-C1imjxk6.js";
import { t as log } from "./logger-C5RMMskO.js";
import { r as resolveProviderIdForAuth } from "./provider-auth-aliases-RaEzqkSo.js";
import "./agent-runtime-BiQiwmwD.js";
import "./agent-harness-runtime-BjY9gsEs.js";
import {
  An as preprocess,
  At as boolean,
  Bt as discriminatedUnion,
  Et as array,
  Lt as custom,
  Nn as record,
  Rn as string,
  Tn as object,
  Xn as union,
  dn as literal,
  wn as number,
  yt as _enum,
} from "./schemas-CBJjibl3.js";
import { m as resolveStorePath, r as getSessionEntry } from "./session-store-runtime-BwE6SlGz.js";
import { i as ensureAuthProfileStore } from "./store-B7DoDdVM.js";
//#region extensions/codex/src/app-server/session-binding.ts
/** SQLite-backed Codex app-server thread bindings. */
const CODEX_APP_SERVER_NATIVE_AUTH_PROVIDER = "openai";
const PUBLIC_OPENAI_MODEL_PROVIDER = "openai";
const BINDING_LEASE_RETRY_INTERVAL_MS = 1e3;
const BOUNDED_BINDING_FINGERPRINT_PATTERN = /^sha256:[a-f0-9]{64}$/i;
const CODEX_APP_SERVER_BINDING_GUARDED_REQUEST_TIMEOUT_MS = 6e4;
const BINDING_LEASE_STALE_MS = 65e3;
const BINDING_LEASE_WAIT_MS = 7e4;
const BINDING_LEASE_RENEW_INTERVAL_MS = Math.floor(BINDING_LEASE_STALE_MS / 3);
const PHYSICAL_SESSION_RETIRE_TTL_MS = BINDING_LEASE_WAIT_MS;
/** Resolves the same agent scope OpenClaw uses for transcript/session ownership. */
function sessionBindingIdentity(params) {
  const { sessionAgentId } = resolveSessionAgentIds(params);
  const sessionKey = params.sessionKey?.trim();
  return {
    kind: "session",
    agentId: sessionAgentId,
    sessionId: params.sessionId,
    ...(sessionKey ? { sessionKey } : {}),
  };
}
const optionalStringSchema = string()
  .optional()
  .catch(void 0);
const optionalBooleanSchema = boolean()
  .optional()
  .catch(void 0);
const optionalNonBlankStringSchema = string()
  .refine((value) => Boolean(value.trim()))
  .optional()
  .catch(void 0);
const optionalTimestampSchema = string()
  .refine((value) => Number.isFinite(Date.parse(value)))
  .optional()
  .catch(void 0);
const pendingSupervisionBranchSchema = object({
  sourceThreadId: string().trim().min(1),
  connectionFingerprint: string().trim().min(1).optional(),
  lastTurnId: string().trim().min(1).optional(),
  cleanupThreadIds: array(string().trim().min(1)).max(2).optional(),
})
  .strict()
  .superRefine((pending, context) => {
    const cleanupThreadIds = pending.cleanupThreadIds ?? [];
    if (new Set(cleanupThreadIds).size !== cleanupThreadIds.length)
      context.addIssue({
        code: "custom",
        message: "pending supervision cleanup thread ids must be unique",
      });
    if (cleanupThreadIds.includes(pending.sourceThreadId))
      context.addIssue({
        code: "custom",
        message: "pending supervision cleanup cannot target its source",
      });
  });
const contextEngineProjectionSchema = object({
  schemaVersion: literal(1),
  mode: literal("thread_bootstrap"),
  epoch: string().refine((value) => Boolean(value.trim())),
  fingerprint: optionalStringSchema,
}).strict();
const contextEngineSchema = object({
  schemaVersion: literal(1),
  engineId: string(),
  policyFingerprint: string(),
  projection: contextEngineProjectionSchema.optional().catch(void 0),
}).strict();
const destructiveApprovalModeSchema = _enum(["allow", "deny", "auto", "ask"])
  .optional()
  .catch(void 0);
const accountAppPolicyEntrySchema = object({
  source: literal("account"),
  appName: string(),
  allowDestructiveActions: boolean(),
  destructiveApprovalMode: destructiveApprovalModeSchema,
  mcpServerNames: array(string()),
}).strict();
const pluginAppPolicyEntrySchema = object({
  source: literal("plugin").optional(),
  configKey: string(),
  marketplaceName: _enum([
    CODEX_PLUGINS_MARKETPLACE_NAME,
    CODEX_PLUGINS_WORKSPACE_MARKETPLACE_NAME,
  ]),
  pluginName: string(),
  allowDestructiveActions: boolean(),
  destructiveApprovalMode: destructiveApprovalModeSchema,
  mcpServerNames: array(string()),
}).strict();
const pluginAppPolicyContextSchema = object({
  fingerprint: string(),
  apps: record(string(), union([accountAppPolicyEntrySchema, pluginAppPolicyEntrySchema])),
  pluginAppIds: record(string(), array(string())).default({}),
}).strict();
const threadBindingSchema = object({
  threadId: string().refine((value) => Boolean(value.trim())),
  clientId: optionalStringSchema,
  cwd: string(),
  connectionScope: literal("supervision").optional(),
  supervisionSourceThreadId: string().trim().min(1).optional(),
  authProfileId: optionalStringSchema,
  model: optionalStringSchema,
  preserveNativeModel: literal(true)
    .optional()
    .catch(void 0),
  pendingSupervisionBranch: pendingSupervisionBranchSchema.optional(),
  modelProvider: string()
    .transform((value) => value.trim())
    .pipe(string().min(1))
    .optional()
    .catch(void 0),
  approvalPolicy: preprocess(
    (value) => (value === "on-failure" ? "on-request" : value),
    _enum(["never", "on-request", "untrusted"]).optional(),
  ).catch(void 0),
  sandbox: _enum(["read-only", "workspace-write", "danger-full-access"])
    .optional()
    .catch(void 0),
  serviceTier: preprocess(
    normalizeCodexServiceTier,
    custom((value) => typeof value === "string").optional(),
  )
    .optional()
    .catch(void 0),
  networkProxyProfileName: optionalStringSchema,
  networkProxyConfigFingerprint: optionalStringSchema,
  dynamicToolsFingerprint: optionalStringSchema,
  dynamicToolsContainDeferred: optionalBooleanSchema,
  webSearchThreadConfigFingerprint: optionalStringSchema,
  userMcpServersFingerprint: optionalStringSchema,
  mcpServersFingerprint: optionalStringSchema,
  ringZeroConfigFingerprint: optionalStringSchema,
  ringZeroClientInstanceId: optionalStringSchema,
  nativeHookRelayGeneration: optionalNonBlankStringSchema,
  appServerRuntimeFingerprint: optionalStringSchema,
  pluginAppsFingerprint: optionalStringSchema,
  pluginAppsInputFingerprint: optionalStringSchema,
  pluginAppPolicyContext: pluginAppPolicyContextSchema.optional().catch(void 0),
  contextEngine: contextEngineSchema.optional().catch(void 0),
  environmentSelectionFingerprint: optionalStringSchema,
  conversationStartId: optionalStringSchema,
  conversationSourceTransferComplete: literal(true)
    .optional()
    .catch(void 0),
  historyCoveredThrough: optionalTimestampSchema,
}).superRefine((binding, context) => {
  if (binding.connectionScope === "supervision") {
    if (!binding.supervisionSourceThreadId)
      context.addIssue({
        code: "custom",
        message: "supervision connection ownership requires its native source thread id",
      });
    if (binding.preserveNativeModel !== true)
      context.addIssue({
        code: "custom",
        message: "supervision connection ownership requires native model ownership",
      });
    if (binding.conversationSourceTransferComplete !== true)
      context.addIssue({
        code: "custom",
        message: "supervision connection ownership requires a completed source transfer",
      });
    if (!binding.pendingSupervisionBranch && (!binding.model?.trim() || !binding.modelProvider))
      context.addIssue({
        code: "custom",
        message: "materialized supervision bindings require a native model and provider",
      });
  }
  if (binding.supervisionSourceThreadId && binding.connectionScope !== "supervision")
    context.addIssue({
      code: "custom",
      message: "a supervision source thread id requires supervision connection ownership",
    });
  if (!binding.pendingSupervisionBranch) return;
  if (binding.threadId !== binding.pendingSupervisionBranch.sourceThreadId)
    context.addIssue({
      code: "custom",
      message: "pending supervision source must match the provisional thread binding",
    });
  if (binding.supervisionSourceThreadId !== binding.pendingSupervisionBranch.sourceThreadId)
    context.addIssue({
      code: "custom",
      message: "pending supervision source must match its durable source identity",
    });
  if (binding.preserveNativeModel !== true)
    context.addIssue({
      code: "custom",
      message: "pending supervision bindings must defer model selection to Codex App Server",
    });
  if (binding.connectionScope !== "supervision")
    context.addIssue({
      code: "custom",
      message: "pending supervision bindings require supervision connection ownership",
    });
});
var CodexSupervisionBindingReplacementError = class extends Error {
  constructor(threadId, operation) {
    super(
      `Refusing to replace supervised Codex thread ${threadId} while ${operation}; its native user-home connection and model ownership must be preserved`,
    );
    this.name = "CodexSupervisionBindingReplacementError";
  }
};
function assertCodexBindingMayBeReplaced(binding, operation) {
  if (binding?.connectionScope === "supervision")
    throw new CodexSupervisionBindingReplacementError(binding.threadId, operation);
}
const bindingLeaseSchema = object({
  token: string().refine((value) => Boolean(value.trim())),
  expiresAt: number().finite(),
});
const storedSessionIdSchema = string()
  .transform((value) => value.trim())
  .pipe(string().min(1))
  .optional()
  .catch(void 0);
const storedBindingSchema = discriminatedUnion("state", [
  object({
    version: literal(1),
    state: literal("active"),
    binding: threadBindingSchema,
    sessionId: storedSessionIdSchema,
    lease: bindingLeaseSchema.optional().catch(void 0),
  }),
  object({
    version: literal(1),
    state: literal("cleared"),
    sessionId: storedSessionIdSchema,
    lease: bindingLeaseSchema.optional().catch(void 0),
    retired: literal(true)
      .optional()
      .catch(void 0),
  }),
]);
function hashCodexAppServerBindingFingerprint(canonical) {
  return `sha256:${createHash("sha256").update(canonical).digest("hex")}`;
}
function normalizeLegacyBindingFingerprint(value) {
  if (
    typeof value !== "string" ||
    value === "" ||
    value === "[]" ||
    BOUNDED_BINDING_FINGERPRINT_PATTERN.test(value)
  )
    return value;
  return hashCodexAppServerBindingFingerprint(value);
}
function normalizeLegacyBindingFingerprints(record) {
  let normalized = record;
  for (const key of ["dynamicToolsFingerprint", "userMcpServersFingerprint"]) {
    const value = record[key];
    const next = normalizeLegacyBindingFingerprint(value);
    if (next === value) continue;
    if (normalized === record) normalized = { ...record };
    normalized[key] = next;
  }
  return normalized;
}
function normalizeStoredCodexAppServerBindingFingerprints(value) {
  const stored = readStoredCodexAppServerBinding(value);
  if (!stored || stored.state !== "active") return stored;
  const binding = normalizeLegacyBindingFingerprints(stored.binding);
  return binding === stored.binding
    ? stored
    : readStoredCodexAppServerBinding({
        ...stored,
        binding,
      });
}
/** Encodes a migrated sidecar binding as one canonical plugin-state row. */
function createStoredCodexAppServerBinding(value, options = {}) {
  const rawRecord = asRecord(value);
  if (!rawRecord) return;
  const record = normalizeLegacyBindingFingerprints(rawRecord);
  if (record.schemaVersion !== 1 && record.schemaVersion !== 2) return;
  const pluginAppPolicyContext = readPluginAppPolicyContext(
    record.pluginAppPolicyContext,
    record.schemaVersion,
  );
  const historyCoveredThrough =
    readTimestamp(record.historyCoveredThrough) ??
    readTimestamp(record.updatedAt) ??
    readTimestamp(record.createdAt) ??
    readTimestamp(options.now) ??
    /* @__PURE__ */ new Date().toISOString();
  const authProfileId = typeof record.authProfileId === "string" ? record.authProfileId : void 0;
  const binding = readCodexAppServerThreadBinding({
    ...record,
    modelProvider: normalizeCodexAppServerBindingModelProvider({
      ...options.lookup,
      authProfileId,
      modelProvider: typeof record.modelProvider === "string" ? record.modelProvider : void 0,
    }),
    cwd: typeof record.cwd === "string" ? record.cwd : "",
    pluginAppPolicyContext,
    historyCoveredThrough,
  });
  return binding
    ? {
        version: 1,
        state: "active",
        binding: stripUndefinedBinding(binding),
      }
    : void 0;
}
function bindingLeaseLostError(key, cause) {
  return new Error(`Lost Codex binding lease: ${key}`, cause === void 0 ? void 0 : { cause });
}
/** Lets the authoritative OpenClaw session generation claim a stale stable binding row. */
async function reclaimCurrentCodexSessionGeneration(params) {
  const sessionKey = params.identity.sessionKey?.trim();
  if (!sessionKey) return true;
  const plan = await params.bindingStore.prepareSessionGenerationReclaim(params.identity);
  if (plan.kind === "resolved") return plan.result;
  try {
    const storePath = resolveStorePath(params.config?.session?.store, {
      agentId: params.identity.agentId,
    });
    if (
      getSessionEntry({
        agentId: params.identity.agentId,
        hydrateSkillPromptRefs: false,
        readConsistency: "latest",
        sessionKey,
        storePath,
      })?.sessionId !== params.identity.sessionId
    )
      return false;
  } catch {
    return false;
  }
  return await params.bindingStore.mutate(params.identity, {
    kind: "reclaim-generation",
    expectedPreviousSessionId: plan.expectedPreviousSessionId,
  });
}
/** Creates the single binding facade owned by the Codex plugin runtime. */
function createCodexAppServerBindingStore(state) {
  const update = state.update?.bind(state);
  if (!update) throw new Error("Codex app-server bindings require atomic plugin-state updates");
  const leaseContext = new AsyncLocalStorage();
  const archiveContext = new AsyncLocalStorage();
  let activeBindingMutations = 0;
  let pendingArchives = 0;
  let archiveTail = Promise.resolve();
  let bindingMutationsDrained = [];
  const waitForBindingMutations = async () => {
    if (activeBindingMutations === 0) return;
    await new Promise((resolve) => {
      bindingMutationsDrained.push(resolve);
    });
  };
  const runBindingMutation = async (run) => {
    if (archiveContext.getStore() === true) return await run();
    if (pendingArchives > 0)
      throw new Error(
        "Codex binding mutation blocked while a native archive is in progress; retry",
      );
    activeBindingMutations += 1;
    try {
      return await run();
    } finally {
      activeBindingMutations -= 1;
      if (activeBindingMutations === 0) {
        const drained = bindingMutationsDrained;
        bindingMutationsDrained = [];
        for (const resolve of drained) resolve();
      }
    }
  };
  const renewLease = (key, owner) => {
    if (owner.failure) return;
    try {
      let renewed = false;
      const stored = update(key, (raw) => {
        const current = readStoredCodexAppServerBinding(raw);
        if (raw !== void 0 && !current)
          throw new Error(`Invalid Codex app-server binding row: ${key}`);
        const lease = current?.lease;
        const now = Date.now();
        if (!lease || lease.token !== owner.token || lease.expiresAt <= now) return;
        renewed = true;
        return {
          ...current,
          lease: {
            token: owner.token,
            expiresAt: now + BINDING_LEASE_STALE_MS,
          },
        };
      });
      if (!renewed || !stored) owner.failure = bindingLeaseLostError(key);
    } catch (error) {
      owner.failure = bindingLeaseLostError(key, error);
    }
  };
  const transactKey = async (key, apply, ttlMs) => {
    const deadline = Date.now() + BINDING_LEASE_WAIT_MS;
    while (true) {
      let busy = false;
      let leaseLost = false;
      let result;
      const ownedLease = leaseContext.getStore()?.get(key);
      if (ownedLease?.failure) throw ownedLease.failure;
      const ownedToken = ownedLease?.token;
      update(
        key,
        (raw) => {
          const current = readStoredCodexAppServerBinding(raw);
          if (raw !== void 0 && !current)
            throw new Error(`Invalid Codex app-server binding row: ${key}`);
          const activeLease = current?.lease;
          const now = Date.now();
          if (
            ownedToken &&
            (!activeLease || activeLease.token !== ownedToken || activeLease.expiresAt <= now)
          ) {
            leaseLost = true;
            return;
          }
          if (activeLease && activeLease.token !== ownedToken && activeLease.expiresAt > now) {
            busy = true;
            return;
          }
          const applied = apply(current, ownedToken);
          result = applied.result;
          return applied.next;
        },
        ttlMs == null ? void 0 : { ttlMs },
      );
      if (leaseLost) {
        const failure = bindingLeaseLostError(key);
        if (ownedLease) ownedLease.failure = failure;
        throw failure;
      }
      if (!busy) return result;
      if (Date.now() >= deadline)
        throw new Error(`Timed out waiting for Codex binding lease: ${key}`);
      await sleep(BINDING_LEASE_RETRY_INTERVAL_MS);
    }
  };
  return {
    async read(identity) {
      const key = bindingStoreKey(identity);
      const raw = state.lookup(key);
      const stored = readStoredCodexAppServerBinding(raw);
      if (raw !== void 0 && !stored)
        throw new Error(`Invalid Codex app-server binding row: ${key}`);
      return stored?.state === "active" && ownsStoredSessionGeneration(identity, stored)
        ? stored.binding
        : void 0;
    },
    async hasOtherThreadOwner(threadId, currentIdentity) {
      const currentKey = currentIdentity ? bindingStoreKey(currentIdentity) : void 0;
      return state.entries().some(({ key, value }) => {
        const stored = readStoredCodexAppServerBinding(value);
        if (!stored) throw new Error(`Invalid Codex app-server binding row: ${key}`);
        const isCurrentOwner =
          currentIdentity !== void 0 &&
          key === currentKey &&
          (currentIdentity.kind === "conversation" ||
            stored.sessionId === currentIdentity.sessionId.trim());
        if (stored.state !== "active" || stored.binding.threadId !== threadId || isCurrentOwner)
          return false;
        return true;
      });
    },
    async prepareSessionGenerationReclaim(identity) {
      const key = bindingStoreKey(identity);
      const raw = state.lookup(key);
      const current = readStoredCodexAppServerBinding(raw);
      if (raw !== void 0 && !current)
        throw new Error(`Invalid Codex app-server binding row: ${key}`);
      if (!current)
        return {
          kind: "resolved",
          result: true,
        };
      const currentSessionId = current.sessionId;
      if (!currentSessionId || currentSessionId === identity.sessionId)
        return {
          kind: "resolved",
          result: current.state !== "cleared" || current.retired !== true,
        };
      return {
        kind: "verify",
        expectedPreviousSessionId: currentSessionId,
      };
    },
    async mutate(identity, mutation) {
      return await runBindingMutation(async () => {
        const key = bindingStoreKey(identity);
        const retainLegacyClear =
          mutation.kind === "clear" && key.startsWith("conversation:legacy-");
        return await transactKey(
          key,
          (current, leaseToken) => {
            const ownsGeneration = ownsStoredSessionGeneration(identity, current);
            const ownedLease =
              current?.lease && current.lease.token === leaseToken ? { lease: current.lease } : {};
            if (mutation.kind === "reclaim-generation") {
              if (identity.kind !== "session" || !identity.sessionKey?.trim())
                return { result: false };
              if (!current) return { result: true };
              if (ownsGeneration)
                return { result: current.state !== "cleared" || current.retired !== true };
              if (current.sessionId !== mutation.expectedPreviousSessionId)
                return { result: false };
              if (current.state === "active" && current.binding.connectionScope === "supervision")
                return { result: false };
              return {
                result: true,
                next: {
                  version: 1,
                  state: "cleared",
                  sessionId: identity.sessionId,
                  ...ownedLease,
                },
              };
            }
            const storedActive = current?.state === "active" ? current : void 0;
            const active = ownsGeneration ? storedActive : void 0;
            const retiredGeneration =
              current?.state === "cleared" && current.retired === true && ownsGeneration;
            const preservesSupervisionOwner =
              mutation.kind === "set" &&
              active?.binding.connectionScope === "supervision" &&
              isSameSupervisionOwner(active.binding, mutation.binding);
            const clearsPendingSupervisionOwner =
              mutation.kind === "clear" &&
              active?.binding.connectionScope === "supervision" &&
              matchesPendingSupervisionClear(
                active.binding,
                mutation.threadId,
                mutation.expectedPendingSupervisionBranch,
              );
            if (
              (mutation.kind === "set" &&
                ((mutation.if?.kind === "absent" && storedActive) ||
                  (current !== void 0 && !ownsGeneration) ||
                  retiredGeneration ||
                  (active?.binding.connectionScope === "supervision" &&
                    !preservesSupervisionOwner))) ||
              (mutation.kind === "patch" && active?.binding.threadId !== mutation.threadId) ||
              ((mutation.kind === "patch-pending-supervision-branch" ||
                mutation.kind === "commit-pending-supervision-branch") &&
                !matchesPendingSupervisionBranch(active?.binding, mutation.expected)) ||
              (mutation.kind === "clear" &&
                ((mutation.threadId !== void 0 && active?.binding.threadId !== mutation.threadId) ||
                  !ownsGeneration ||
                  (active?.binding.connectionScope === "supervision" &&
                    !clearsPendingSupervisionOwner)))
            )
              return { result: false };
            if (mutation.kind === "clear" && retiredGeneration) return { result: true };
            if (mutation.kind === "clear")
              return {
                result: true,
                next: {
                  version: 1,
                  state: "cleared",
                  ...storedSessionGeneration(identity, current),
                  ...ownedLease,
                },
              };
            let binding;
            if (mutation.kind === "set") binding = validateBindingForWrite(mutation.binding);
            else if (mutation.kind === "patch-pending-supervision-branch")
              binding = validateBindingForWrite({
                ...active.binding,
                pendingSupervisionBranch: mutation.pending,
              });
            else if (mutation.kind === "commit-pending-supervision-branch")
              binding = validateBindingForWrite({
                ...active.binding,
                ...mutation.patch,
                threadId: mutation.threadId,
                pendingSupervisionBranch: void 0,
              });
            else
              binding = validateBindingForWrite({
                ...active.binding,
                ...mutation.patch,
                threadId: mutation.threadId,
              });
            return {
              result: true,
              next: {
                version: 1,
                state: "active",
                binding,
                ...storedSessionGeneration(identity, current),
                ...ownedLease,
              },
            };
          },
          mutation.kind === "clear" && !retainLegacyClear && !leaseContext.getStore()?.has(key)
            ? 1
            : void 0,
        );
      });
    },
    async adoptSessionGeneration(identity, expectedPreviousSessionId) {
      return await runBindingMutation(async () => {
        const key = bindingStoreKey(identity);
        const expectedSessionId = expectedPreviousSessionId.trim();
        const targetSessionId = identity.sessionId.trim();
        if (!expectedSessionId)
          throw new Error("Codex session generation adoption requires the previous session id");
        return await transactKey(key, (current) => {
          if (current?.state !== "active") return { result: "absent" };
          if (current.sessionId === targetSessionId) return { result: "current" };
          if (current.sessionId !== expectedSessionId) return { result: "conflict" };
          return {
            result: "adopted",
            next: {
              ...current,
              sessionId: targetSessionId,
            },
          };
        });
      });
    },
    async retireSessionGeneration(identity) {
      return await runBindingMutation(async () => {
        const key = bindingStoreKey(identity);
        return await transactKey(
          key,
          (current, leaseToken) => {
            if (!current) return { result: "absent" };
            if (!ownsStoredSessionGeneration(identity, current)) return { result: "conflict" };
            if (current.state === "cleared" && current.retired === true)
              return { result: "applied" };
            return {
              result: "applied",
              next: {
                version: 1,
                state: "cleared",
                retired: true,
                ...storedSessionGeneration(identity, current),
                ...(current.lease && current.lease.token === leaseToken
                  ? { lease: current.lease }
                  : {}),
              },
            };
          },
          identity.sessionKey?.trim() ? void 0 : PHYSICAL_SESSION_RETIRE_TTL_MS,
        );
      });
    },
    async withThreadArchiveFence(run) {
      pendingArchives += 1;
      const operation = archiveTail.then(async () => {
        await waitForBindingMutations();
        return await archiveContext.run(true, run);
      });
      archiveTail = operation.then(
        () => void 0,
        () => void 0,
      );
      try {
        return await operation;
      } finally {
        pendingArchives -= 1;
      }
    },
    async withLease(identity, run) {
      const key = bindingStoreKey(identity);
      const owned = leaseContext.getStore();
      const existingOwner = owned?.get(key);
      if (existingOwner) {
        const failureBeforeRun = existingOwner.failure;
        if (failureBeforeRun) throw failureBeforeRun;
        const result = await run();
        const failureAfterRun = existingOwner.failure;
        if (failureAfterRun) throw failureAfterRun;
        return result;
      }
      const token = randomUUID();
      if (
        !(await transactKey(key, (current) => {
          if (
            current?.state === "cleared" &&
            current.retired === true &&
            ownsStoredSessionGeneration(identity, current)
          )
            return { result: false };
          const lease = {
            token,
            expiresAt: Date.now() + BINDING_LEASE_STALE_MS,
          };
          if (current?.state === "active")
            return {
              result: true,
              next: {
                ...current,
                ...preservedSessionGeneration(identity, current),
                lease,
              },
            };
          if (current?.state === "cleared" && current.retired === true)
            return {
              result: true,
              next: {
                ...current,
                lease,
              },
            };
          return {
            result: true,
            next: {
              version: 1,
              state: "cleared",
              ...preservedSessionGeneration(identity, current),
              lease,
            },
          };
        }))
      )
        throw new Error(`Codex binding generation was retired: ${key}`);
      const owner = { token };
      const nested = new Map(owned);
      nested.set(key, owner);
      const heartbeat = setInterval(() => renewLease(key, owner), BINDING_LEASE_RENEW_INTERVAL_MS);
      heartbeat.unref();
      try {
        const result = await leaseContext.run(nested, run);
        if (owner.failure) throw owner.failure;
        return result;
      } finally {
        clearInterval(heartbeat);
        try {
          const removeOwnedLease = (raw, matches) => {
            const current = readStoredCodexAppServerBinding(raw);
            if (!current || !matches(current) || current.lease?.token !== token) return;
            const { lease: _lease, ...released } = current;
            return released;
          };
          if (
            !update(key, (raw) => removeOwnedLease(raw, (current) => current.state === "active"))
          ) {
            if (
              !update(
                key,
                (raw) =>
                  removeOwnedLease(
                    raw,
                    (current) => current.state === "cleared" && current.retired === true,
                  ),
                key.startsWith("session:") ? { ttlMs: PHYSICAL_SESSION_RETIRE_TTL_MS } : void 0,
              )
            )
              update(
                key,
                (raw) => removeOwnedLease(raw, (current) => current.state === "cleared"),
                { ttlMs: 1 },
              );
          }
        } catch (error) {
          log.warn("failed to release codex app-server binding lease", {
            key,
            error,
          });
        }
      }
    },
  };
}
function matchesPendingSupervisionBranch(binding, expected) {
  const pending = binding?.pendingSupervisionBranch;
  if (!pending || binding?.threadId !== expected.sourceThreadId) return false;
  if (
    pending.sourceThreadId !== expected.sourceThreadId ||
    pending.connectionFingerprint !== expected.connectionFingerprint ||
    pending.lastTurnId !== expected.lastTurnId
  )
    return false;
  const currentCleanup = pending.cleanupThreadIds ?? [];
  const expectedCleanup = expected.cleanupThreadIds ?? [];
  return (
    currentCleanup.length === expectedCleanup.length &&
    currentCleanup.every((threadId, index) => threadId === expectedCleanup[index])
  );
}
function isSameSupervisionOwner(current, replacement) {
  return (
    replacement.connectionScope === "supervision" &&
    replacement.threadId === current.threadId &&
    replacement.supervisionSourceThreadId === current.supervisionSourceThreadId
  );
}
function matchesPendingSupervisionClear(binding, threadId, expected) {
  if (!expected) return false;
  const sourceThreadId = expected.sourceThreadId;
  return (
    threadId === sourceThreadId &&
    binding.supervisionSourceThreadId === sourceThreadId &&
    matchesPendingSupervisionBranch(binding, expected)
  );
}
/** Stable plugin-state key for one current binding owner. */
function bindingStoreKey(identity) {
  if (identity.kind === "session") {
    const rawAgentId = identity.agentId.trim();
    const sessionId = identity.sessionId.trim();
    if (!rawAgentId) throw new Error("Codex app-server binding requires an agent id");
    if (!sessionId) throw new Error("Codex app-server binding requires a session id");
    const agentId = resolveSessionAgentIds({ agentId: rawAgentId }).sessionAgentId;
    const sessionKey = identity.sessionKey?.trim();
    if (sessionKey)
      return `session-key:${agentId}:${createHash("sha256").update(sessionKey).digest("base64url")}`;
    return `session:${agentId}:${sessionId}`;
  }
  const bindingId = identity.bindingId.trim();
  if (!bindingId) throw new Error("Codex app-server conversation binding requires a binding id");
  return `conversation:${bindingId}`;
}
function readStoredCodexAppServerBinding(value) {
  const result = storedBindingSchema.safeParse(value);
  return result.success ? stripUndefinedValue(result.data) : void 0;
}
function storedSessionGeneration(identity, current) {
  if (identity.kind === "session") return { sessionId: identity.sessionId };
  return current?.sessionId ? { sessionId: current.sessionId } : {};
}
function preservedSessionGeneration(identity, current) {
  if (current?.sessionId) return { sessionId: current.sessionId };
  return storedSessionGeneration(identity, current);
}
function ownsStoredSessionGeneration(identity, current) {
  return (
    identity.kind !== "session" || !current?.sessionId || current.sessionId === identity.sessionId
  );
}
function validateBindingForWrite(binding) {
  const validated = readCodexAppServerThreadBinding(binding);
  if (!validated) throw new Error("Invalid Codex app-server thread binding");
  return stripUndefinedBinding(validated);
}
/** Parses stored or shipped sidecar data into the current domain value. */
function readCodexAppServerThreadBinding(value) {
  const result = threadBindingSchema.safeParse(value);
  if (!result.success) return;
  return result.data;
}
function stripUndefinedBinding(binding) {
  return stripUndefinedValue(binding);
}
function stripUndefinedValue(value) {
  if (Array.isArray(value)) return value.map(stripUndefinedValue);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value)
      .filter(([, entry]) => entry !== void 0)
      .map(([key, entry]) => [key, stripUndefinedValue(entry)]),
  );
}
function asRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
function readTimestamp(value) {
  return optionalTimestampSchema.parse(value);
}
function readPluginAppPolicyContext(value, bindingSchemaVersion) {
  const record = asRecord(value);
  if (!record || typeof record.fingerprint !== "string") return;
  const apps = asRecord(record.apps);
  if (!apps) return;
  const parsedApps = {};
  for (const [appId, rawEntry] of Object.entries(apps)) {
    const entry = asRecord(rawEntry);
    if (!entry) return;
    const destructiveApprovalMode = readDestructiveApprovalMode(
      entry.destructiveApprovalMode,
      bindingSchemaVersion,
    );
    const mcpServerNamesValid =
      Array.isArray(entry.mcpServerNames) &&
      entry.mcpServerNames.every((serverName) => typeof serverName === "string");
    if (entry.source === "account") {
      if (
        "appId" in entry ||
        typeof entry.appName !== "string" ||
        typeof entry.allowDestructiveActions !== "boolean" ||
        destructiveApprovalMode === "invalid" ||
        !mcpServerNamesValid
      )
        return;
      parsedApps[appId] = {
        source: "account",
        appName: entry.appName,
        allowDestructiveActions: entry.allowDestructiveActions,
        ...(destructiveApprovalMode ? { destructiveApprovalMode } : {}),
        mcpServerNames: entry.mcpServerNames,
      };
      continue;
    }
    if (
      "appId" in entry ||
      (entry.source !== void 0 && entry.source !== "plugin") ||
      typeof entry.configKey !== "string" ||
      (entry.marketplaceName !== "openai-curated" &&
        entry.marketplaceName !== "workspace-directory") ||
      typeof entry.pluginName !== "string" ||
      typeof entry.allowDestructiveActions !== "boolean" ||
      destructiveApprovalMode === "invalid" ||
      !mcpServerNamesValid
    )
      return;
    parsedApps[appId] = {
      configKey: entry.configKey,
      marketplaceName: entry.marketplaceName,
      pluginName: entry.pluginName,
      allowDestructiveActions: entry.allowDestructiveActions,
      ...(destructiveApprovalMode ? { destructiveApprovalMode } : {}),
      mcpServerNames: entry.mcpServerNames,
    };
  }
  const parsedPluginAppIds = {};
  if (
    record.pluginAppIds !== void 0 &&
    (!record.pluginAppIds ||
      typeof record.pluginAppIds !== "object" ||
      Array.isArray(record.pluginAppIds))
  )
    return;
  if (record.pluginAppIds && typeof record.pluginAppIds === "object")
    for (const [configKey, appIds] of Object.entries(record.pluginAppIds)) {
      if (!Array.isArray(appIds) || appIds.some((appId) => typeof appId !== "string")) return;
      parsedPluginAppIds[configKey] = appIds;
    }
  return {
    fingerprint: record.fingerprint,
    apps: parsedApps,
    pluginAppIds: parsedPluginAppIds,
  };
}
function readDestructiveApprovalMode(value, bindingSchemaVersion) {
  if (value === void 0) return;
  if (value === "allow" || value === "deny") return value;
  if (value === "auto") return bindingSchemaVersion === 1 ? "allow" : "auto";
  if (value === "ask" && bindingSchemaVersion === 2) return "ask";
  if (value === "on-request" && bindingSchemaVersion === 1) return "auto";
  return "invalid";
}
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
/** Returns true when an auth profile uses native Codex/OpenAI app-server auth. */
function isCodexAppServerNativeAuthProfile(lookup) {
  const authProfileId = lookup.authProfileId?.trim();
  if (!authProfileId) return false;
  try {
    const credential = (
      lookup.authProfileStore ??
      ensureAuthProfileStore(
        lookup.agentDir?.trim() || resolveDefaultAgentDir(lookup.config ?? {}),
        {
          allowKeychainPrompt: false,
          config: lookup.config,
          externalCliProviderIds: [CODEX_APP_SERVER_NATIVE_AUTH_PROVIDER],
          externalCliProfileIds: [authProfileId],
        },
      )
    ).profiles[authProfileId];
    if (!credential || credential.type === "api_key") return false;
    const provider = credential.provider?.trim();
    return Boolean(
      provider &&
      resolveProviderIdForAuth(provider, { config: lookup.config }) ===
        CODEX_APP_SERVER_NATIVE_AUTH_PROVIDER,
    );
  } catch (error) {
    log.debug("failed to resolve codex app-server auth profile provider", {
      authProfileId,
      error,
    });
    return false;
  }
}
/** Hides redundant OpenAI provider attribution for native Codex auth bindings. */
function normalizeCodexAppServerBindingModelProvider(params) {
  const modelProvider = params.modelProvider?.trim();
  if (!modelProvider) return;
  if (
    isCodexAppServerNativeAuthProfile(params) &&
    modelProvider.toLowerCase() === PUBLIC_OPENAI_MODEL_PROVIDER
  )
    return;
  return modelProvider;
}
/** Restores the sole provider intentionally omitted from canonical binding rows. */
function resolveCodexAppServerBindingModelProvider(params) {
  return (
    params.modelProvider?.trim() ||
    (isCodexAppServerNativeAuthProfile(params) ? PUBLIC_OPENAI_MODEL_PROVIDER : void 0)
  );
}
//#endregion
export {
  createCodexAppServerBindingStore as a,
  isCodexAppServerNativeAuthProfile as c,
  readCodexAppServerThreadBinding as d,
  readStoredCodexAppServerBinding as f,
  sessionBindingIdentity as h,
  bindingStoreKey as i,
  normalizeCodexAppServerBindingModelProvider as l,
  resolveCodexAppServerBindingModelProvider as m,
  CodexSupervisionBindingReplacementError as n,
  createStoredCodexAppServerBinding as o,
  reclaimCurrentCodexSessionGeneration as p,
  assertCodexBindingMayBeReplaced as r,
  hashCodexAppServerBindingFingerprint as s,
  CODEX_APP_SERVER_BINDING_GUARDED_REQUEST_TIMEOUT_MS as t,
  normalizeStoredCodexAppServerBindingFingerprints as u,
};
