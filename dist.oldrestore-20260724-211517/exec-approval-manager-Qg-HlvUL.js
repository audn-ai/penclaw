import { randomUUID } from "node:crypto";
import { t as buildApprovalResolutionRef } from "./approval-resolution-ref-BMBlVd2b.js";
import "./src-Bl7G9qvi.js";
import {
  i as sanitizeExecApprovalWarningText,
  n as sanitizeExecApprovalDisplayText,
  t as resolveExecApprovalCommandDisplay,
} from "./exec-approval-command-display-SUzu7-Pq.js";
import "./number-coercion-EqFmHmOw.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import "./plugin-approvals-D2muXfhg.js";
import {
  C as resolveExpiresAtMsFromDurationMs,
  j as resolveTimerTimeoutMs,
} from "./number-coercion-CJQ8TR--.js";
import {
  i as forceDenyOperatorApproval,
  n as consumeOperatorApprovalAllowOnce,
  s as insertOperatorApproval,
  u as resolveOperatorApproval,
} from "./operator-approval-store-huri_FO0.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
//#region src/infra/approval-presentation.ts
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function normalizeDecisionList(decisions) {
  const result = [];
  for (const decision of decisions) if (!result.includes(decision)) result.push(decision);
  if (!result.includes("deny")) result.push("deny");
  return result;
}
function isWithinCodePointLimit(value, maxLength) {
  return Array.from(value).length <= maxLength;
}
function sanitizeOptionalSingleLine(value) {
  const normalized = normalizeOptionalString(value);
  return normalized ? sanitizeExecApprovalDisplayText(normalized) : null;
}
function buildExecApprovalPresentation(params) {
  if (!isRecord(params.request)) return null;
  const request = params.request;
  const { commandText, commandPreview } = resolveExecApprovalCommandDisplay(request);
  if (!commandText.trim()) return null;
  return {
    kind: "exec",
    commandText,
    commandPreview,
    warningText:
      typeof request.warningText === "string" && request.warningText.trim()
        ? sanitizeExecApprovalWarningText(request.warningText)
        : null,
    host: sanitizeOptionalSingleLine(request.host),
    nodeId: sanitizeOptionalSingleLine(request.nodeId),
    agentId: sanitizeOptionalSingleLine(request.agentId),
    allowedDecisions: normalizeDecisionList(params.allowedDecisions),
  };
}
function buildPluginApprovalPresentation(params) {
  if (!isRecord(params.request)) return null;
  const request = params.request;
  const rawTitle = normalizeOptionalString(request.title);
  const rawDescription = normalizeOptionalString(request.description);
  if (!rawTitle || !rawDescription) return null;
  const title = sanitizeExecApprovalDisplayText(rawTitle);
  const description = sanitizeExecApprovalWarningText(rawDescription);
  if (!isWithinCodePointLimit(title, 80) || !isWithinCodePointLimit(description, 512)) return null;
  return {
    kind: "plugin",
    title,
    description,
    severity:
      request.severity === "info" ||
      request.severity === "warning" ||
      request.severity === "critical"
        ? request.severity
        : "warning",
    pluginId: sanitizeOptionalSingleLine(request.pluginId),
    toolName: sanitizeOptionalSingleLine(request.toolName),
    agentId: sanitizeOptionalSingleLine(request.agentId),
    allowedDecisions: normalizeDecisionList(params.allowedDecisions),
  };
}
/** Returns the safe cross-surface presentation, or null when no prompt can be rendered. */
function buildApprovalPresentation(params) {
  return params.kind === "exec"
    ? buildExecApprovalPresentation(params)
    : buildPluginApprovalPresentation(params);
}
//#endregion
//#region src/gateway/exec-approval-manager.ts
const EXEC_APPROVAL_RESOLVED_ENTRY_GRACE_MS = 15e3;
function unrefTimer(timer) {
  const unref = timer.unref;
  if (typeof unref === "function") unref.call(timer);
}
function scheduleResolvedEntryCleanup(cleanup) {
  const timer = setTimeout(cleanup, EXEC_APPROVAL_RESOLVED_ENTRY_GRACE_MS);
  unrefTimer(timer);
  return timer;
}
function resolveApprovalTimeoutMs(timeoutMs) {
  return resolveTimerTimeoutMs(timeoutMs, 1);
}
function readRequestString(request, key) {
  if (typeof request !== "object" || request === null) return null;
  const value = request[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
function resolveApprovalSource(request) {
  return {
    agentId: readRequestString(request, "agentId"),
    sessionKey: readRequestString(request, "sessionKey"),
    sessionId: readRequestString(request, "sessionId"),
    runId: readRequestString(request, "runId"),
    toolCallId: readRequestString(request, "toolCallId"),
    toolName: readRequestString(request, "toolName"),
  };
}
function normalizeAllowedDecisions(decisions) {
  const normalized = [];
  for (const decision of decisions ?? ["allow-once", "allow-always", "deny"])
    if (
      (decision === "allow-once" || decision === "allow-always" || decision === "deny") &&
      !normalized.includes(decision)
    )
      normalized.push(decision);
  if (!normalized.includes("deny")) normalized.push("deny");
  return normalized;
}
function attachLiveRecord(result, liveRecord) {
  if (!("record" in result) || !liveRecord) return result;
  return {
    ...result,
    liveRecord,
  };
}
var ExecApprovalManager = class {
  constructor(options = {}) {
    this.options = options;
    this.pending = /* @__PURE__ */ new Map();
  }
  get approvalKind() {
    return this.options.approvalKind ?? "exec";
  }
  get runtimeEpoch() {
    return this.options.persistence?.runtimeEpoch ?? null;
  }
  create(request, timeoutMs, id) {
    const now = Date.now();
    const expiresAtMs = resolveExpiresAtMsFromDurationMs(resolveApprovalTimeoutMs(timeoutMs), {
      nowMs: now,
    });
    if (expiresAtMs === void 0) throw new Error("approval expiry is unavailable");
    return {
      id: id === null || id === void 0 || id.length === 0 ? randomUUID() : id,
      request,
      createdAtMs: now,
      expiresAtMs,
    };
  }
  /**
   * Register an approval record and return a promise that resolves when the decision is made.
   * This separates registration (synchronous) from waiting (async), allowing callers to
   * confirm registration before the decision is made.
   */
  register(record, _timeoutMs) {
    const persistence = this.options.persistence;
    const allowedDecisions = persistence
      ? normalizeAllowedDecisions(this.options.resolveAllowedDecisions?.(record.request))
      : null;
    const presentation = persistence
      ? buildApprovalPresentation({
          kind: this.approvalKind,
          request: record.request,
          allowedDecisions: allowedDecisions ?? [],
        })
      : null;
    if (persistence && !presentation)
      throw new Error("approval cannot be persisted without a valid reviewer presentation");
    const existing = this.pending.get(record.id);
    if (existing) {
      if (existing.record.resolvedAtMs === void 0) return existing.promise;
      throw new Error(`approval id '${record.id}' already resolved`);
    }
    let insertedRecord = null;
    if (persistence) {
      const source = resolveApprovalSource(record.request);
      let audienceSessionKeys = [];
      if (source.sessionKey)
        audienceSessionKeys = this.options.resolveAudienceSessionKeys?.(
          source.sessionKey,
          source.agentId,
        ) ?? [source.sessionKey];
      const inserted = insertOperatorApproval({
        approval: {
          id: record.id,
          kind: this.approvalKind,
          presentation,
          requester: {
            deviceId: record.requestedByDeviceId,
            clientId: record.requestedByClientId,
            deviceTokenAuth: record.requestedByDeviceTokenAuth === true,
          },
          reviewerDeviceIds: record.approvalReviewerDeviceIds,
          source,
          audienceSessionKeys,
          runtimeEpoch: persistence.runtimeEpoch,
          createdAtMs: record.createdAtMs,
          expiresAtMs: record.expiresAtMs,
        },
        databaseOptions: persistence.databaseOptions,
      });
      if (inserted.outcome === "conflict")
        throw new Error(`approval id '${record.id}' conflicts with persisted state`);
      if (inserted.outcome === "inserted") insertedRecord = inserted.record;
    }
    let resolvePromise;
    let rejectPromise;
    const promise = new Promise((resolve, reject) => {
      resolvePromise = resolve;
      rejectPromise = reject;
    });
    const entry = {
      record,
      resolve: resolvePromise,
      reject: rejectPromise,
      timer: null,
      cleanupTimer: null,
      handoffRetainCount: 0,
      handoffReleasedAtMs: null,
      retainForManagerLifetime: false,
      promise,
    };
    this.pending.set(record.id, entry);
    this.scheduleExpiryTimer(entry);
    if (insertedRecord)
      this.emitLifecycle({
        phase: "pending",
        record: insertedRecord,
      });
    return promise;
  }
  emitLifecycle(event) {
    try {
      this.options.onLifecycle?.(event);
    } catch {}
  }
  projectLocalRecord(record) {
    const presentation = buildApprovalPresentation({
      kind: this.approvalKind,
      request: record.request,
      allowedDecisions: normalizeAllowedDecisions(
        this.options.resolveAllowedDecisions?.(record.request),
      ),
    });
    if (!presentation) return null;
    const status = record.status ?? (record.resolvedAtMs === void 0 ? "pending" : "denied");
    const source = resolveApprovalSource(record.request);
    return {
      id: record.id,
      resolutionRef: buildApprovalResolutionRef({
        approvalId: record.id,
        approvalKind: this.approvalKind,
      }),
      kind: this.approvalKind,
      status,
      presentation,
      requester: {
        deviceId: record.requestedByDeviceId ?? null,
        clientId: record.requestedByClientId ?? null,
        deviceTokenAuth: record.requestedByDeviceTokenAuth === true,
      },
      reviewerDeviceIds: record.approvalReviewerDeviceIds ?? [],
      source,
      audienceSessionKeys: source.sessionKey ? [source.sessionKey] : [],
      runtimeEpoch: this.runtimeEpoch ?? "process-local",
      createdAtMs: record.createdAtMs,
      expiresAtMs: record.expiresAtMs,
      updatedAtMs: record.resolvedAtMs ?? record.createdAtMs,
      decision: status === "pending" ? null : (record.decision ?? "deny"),
      terminalReason: status === "pending" ? null : (record.terminalReason ?? "user"),
      resolvedAtMs: record.resolvedAtMs ?? null,
      resolver:
        record.resolvedAtMs === void 0
          ? null
          : {
              kind: record.resolverKind ?? "runtime",
              id: record.resolvedBy ?? null,
            },
      consumedAtMs: record.consumedAtMs ?? null,
      consumedBy: record.consumedBy ?? null,
    };
  }
  /** Persist the first verdict, then release the process-local waiter. */
  resolveDetailed(
    recordId,
    decision,
    resolver,
    localResolvedBy = null,
    localResolutionSource = "operator",
  ) {
    const persistence = this.options.persistence;
    const localEntry = this.pending.get(recordId);
    if (localEntry?.record.terminalReason === "storage-corrupt") {
      const repaired = this.persistStorageCorruptDeny(recordId);
      if (repaired.outcome === "expired") return repaired;
      if (repaired.outcome === "not-found" || repaired.outcome === "corrupt") return repaired;
      if (repaired.outcome === "denied" && decision === "deny")
        return attachLiveRecord(
          {
            outcome: "resolved",
            record: repaired.record,
          },
          repaired.liveRecord,
        );
      return {
        outcome: "already-resolved",
        retry: repaired.record.decision === decision ? "same" : "conflict",
        record: repaired.record,
        ...(repaired.liveRecord ? { liveRecord: repaired.liveRecord } : {}),
      };
    }
    if (!persistence) {
      if (!localEntry) return { outcome: "not-found" };
      const previousDecision = localEntry.record.decision ?? localEntry.record.consumedDecision;
      if (localEntry.record.resolvedAtMs !== void 0) {
        const record = this.projectLocalRecord(localEntry.record);
        return record
          ? {
              outcome: "already-resolved",
              retry: previousDecision === decision ? "same" : "conflict",
              record,
              liveRecord: localEntry.record,
            }
          : { outcome: "corrupt" };
      }
      if (
        !normalizeAllowedDecisions(
          this.options.resolveAllowedDecisions?.(localEntry.record.request),
        ).includes(decision)
      ) {
        const record = this.projectLocalRecord(localEntry.record);
        return record
          ? {
              outcome: "decision-not-allowed",
              record,
              liveRecord: localEntry.record,
            }
          : { outcome: "corrupt" };
      }
      this.resolveLocal(recordId, decision, localResolvedBy);
      const record = this.projectLocalRecord(localEntry.record);
      return record
        ? {
            outcome: "resolved",
            record,
            liveRecord: localEntry.record,
          }
        : { outcome: "corrupt" };
    }
    if (decision !== "deny" && !localEntry) return { outcome: "not-found" };
    let result;
    try {
      result = resolveOperatorApproval({
        id: recordId,
        decision,
        resolver,
        expectedKind: this.approvalKind,
        runtimeEpoch: persistence.runtimeEpoch,
        databaseOptions: persistence.databaseOptions,
      });
    } catch (error) {
      this.settleLocalStorageFailure(recordId);
      throw error;
    }
    if (
      result.outcome === "resolved" ||
      result.outcome === "expired" ||
      result.outcome === "already-resolved"
    )
      this.settleLocalFromStore(
        result.record,
        void 0,
        localResolvedBy,
        result.outcome === "resolved" ? localResolutionSource : "operator",
      );
    else if (result.outcome === "not-found" || result.outcome === "corrupt")
      this.settleLocalStorageFailure(recordId);
    return attachLiveRecord(result, localEntry?.record);
  }
  /** Persist a fail-closed terminal state, then release the local waiter. */
  forceDenyDetailed(
    recordId,
    reason,
    resolver,
    status = "denied",
    localDecision,
    requireDue = false,
    localResolvedBy = null,
  ) {
    const persistence = this.options.persistence;
    const localRecord = this.pending.get(recordId)?.record;
    if (localRecord?.terminalReason === "storage-corrupt")
      return this.persistStorageCorruptDeny(recordId);
    if (!persistence) {
      const entry = this.pending.get(recordId);
      if (!entry) return { outcome: "not-found" };
      if (entry.record.resolvedAtMs !== void 0) {
        const record = this.projectLocalRecord(entry.record);
        return record
          ? {
              outcome: "already-terminal",
              record,
              liveRecord: entry.record,
            }
          : { outcome: "corrupt" };
      }
      this.settleLocalEntry({
        recordId,
        decision: localDecision === void 0 ? (status === "denied" ? "deny" : null) : localDecision,
        resolvedAtMs: Date.now(),
        resolvedBy: localResolvedBy,
        resolverKind: resolver.kind,
        status,
        terminalReason: reason,
      });
      const record = this.projectLocalRecord(entry.record);
      return record
        ? {
            outcome: "denied",
            record,
            liveRecord: entry.record,
          }
        : { outcome: "corrupt" };
    }
    let result;
    try {
      result = forceDenyOperatorApproval({
        id: recordId,
        status,
        requireDue,
        reason,
        resolver,
        expectedKind: this.approvalKind,
        runtimeEpoch: persistence.runtimeEpoch,
        databaseOptions: persistence.databaseOptions,
      });
    } catch (error) {
      this.settleLocalStorageFailure(recordId);
      throw error;
    }
    if (result.outcome === "denied")
      this.settleLocalFromStore(result.record, localDecision, localResolvedBy);
    else if (result.outcome === "expired" || result.outcome === "already-terminal")
      this.settleLocalFromStore(result.record, void 0, localResolvedBy);
    else if (result.outcome === "not-found" || result.outcome === "corrupt")
      this.settleLocalStorageFailure(recordId);
    return attachLiveRecord(result, localRecord);
  }
  settleLocalFromStore(
    record,
    localDecision,
    localResolvedBy = null,
    localResolutionSource = "operator",
  ) {
    const persistence = this.options.persistence;
    if (
      record.kind !== this.approvalKind ||
      (persistence && record.runtimeEpoch !== persistence.runtimeEpoch) ||
      record.status === "pending" ||
      record.resolvedAtMs === null
    )
      return false;
    const decision =
      localDecision === void 0
        ? record.status === "allowed" || record.status === "denied"
          ? record.decision
          : null
        : localDecision;
    const settled = this.settleLocalEntry({
      recordId: record.id,
      decision,
      resolvedAtMs: record.resolvedAtMs,
      resolvedBy: localResolvedBy,
      resolverKind: record.resolver?.kind ?? null,
      status: record.status,
      terminalReason: record.terminalReason,
      consumedAtMs: record.consumedAtMs,
      consumedBy: record.consumedBy,
      resolutionSource: localResolutionSource,
    });
    if (settled)
      this.emitLifecycle({
        phase: "terminal",
        record,
      });
    return settled;
  }
  /** Settle one durable terminal transition and report whether this manager published it. */
  reconcileDurableTerminal(record) {
    return this.settleLocalFromStore(record);
  }
  /** Reconciles durable truth with an existing waiter without rehydrating its request. */
  reconcileDurableLookup(lookup, localResolvedBy = null) {
    const recordId = lookup.outcome === "found" ? lookup.record.id : lookup.id;
    const entry = this.pending.get(recordId);
    if (lookup.outcome !== "found") {
      if (entry) this.settleLocalStorageFailure(recordId);
      return null;
    }
    const persistence = this.options.persistence;
    if (
      !entry ||
      !persistence ||
      lookup.record.kind !== this.approvalKind ||
      lookup.record.runtimeEpoch !== persistence.runtimeEpoch
    )
      return lookup.record;
    if (lookup.record.status === "pending" && entry.record.terminalReason === "storage-corrupt") {
      const repaired = this.persistStorageCorruptDeny(recordId);
      return "record" in repaired ? repaired.record : null;
    }
    if (lookup.record.status !== "pending")
      this.settleLocalFromStore(lookup.record, void 0, localResolvedBy);
    return lookup.record;
  }
  settleLocalStorageFailure(recordId) {
    this.settleLocalEntry({
      recordId,
      decision: "deny",
      resolvedAtMs: Date.now(),
      resolvedBy: "storage-error",
      resolverKind: "system",
      status: "denied",
      terminalReason: "storage-corrupt",
      retainForManagerLifetime: true,
    });
  }
  persistStorageCorruptDeny(recordId) {
    const localEntry = this.pending.get(recordId);
    const persistence = this.options.persistence;
    if (!localEntry) return { outcome: "not-found" };
    if (!persistence) return { outcome: "not-found" };
    const result = forceDenyOperatorApproval({
      id: recordId,
      status: "denied",
      reason: "storage-corrupt",
      resolver: {
        kind: "system",
        id: "storage-error",
      },
      expectedKind: this.approvalKind,
      runtimeEpoch: persistence.runtimeEpoch,
      databaseOptions: persistence.databaseOptions,
    });
    if (result.outcome === "denied" || result.outcome === "expired")
      this.emitLifecycle({
        phase: "terminal",
        record: result.record,
      });
    return attachLiveRecord(result, localEntry.record);
  }
  settleLocalEntry(params) {
    const pending = this.pending.get(params.recordId);
    if (!pending || pending.record.resolvedAtMs !== void 0) return false;
    clearTimeout(pending.timer);
    pending.record.resolvedAtMs = params.resolvedAtMs;
    if (params.decision === null) delete pending.record.decision;
    else {
      pending.record.decision = params.decision;
      pending.record.resolutionSource = params.resolutionSource ?? "operator";
    }
    pending.record.resolvedBy = params.resolvedBy;
    pending.record.resolverKind = params.resolverKind;
    pending.record.status = params.status;
    pending.record.terminalReason = params.terminalReason;
    pending.record.runtimeEpoch = this.runtimeEpoch ?? void 0;
    pending.record.consumedAtMs = params.consumedAtMs ?? null;
    pending.record.consumedBy = params.consumedBy ?? null;
    pending.retainForManagerLifetime ||= params.retainForManagerLifetime === true;
    pending.resolve(params.decision);
    if (!pending.retainForManagerLifetime && pending.handoffRetainCount === 0)
      this.scheduleResolvedCleanup(pending);
    return true;
  }
  scheduleResolvedCleanup(entry) {
    if (
      entry.cleanupTimer ||
      entry.record.resolvedAtMs === void 0 ||
      entry.retainForManagerLifetime ||
      entry.handoffRetainCount > 0
    )
      return;
    const cleanupTimer = scheduleResolvedEntryCleanup(() => {
      if (entry.cleanupTimer !== cleanupTimer) return;
      entry.cleanupTimer = null;
      if (
        this.pending.get(entry.record.id) === entry &&
        entry.handoffRetainCount === 0 &&
        !entry.retainForManagerLifetime
      )
        this.pending.delete(entry.record.id);
    });
    entry.cleanupTimer = cleanupTimer;
  }
  resolvedGraceAnchorMs(entry, nowMs) {
    if (entry.record.resolvedAtMs === void 0) return null;
    if (entry.handoffRetainCount > 0) return nowMs;
    return entry.handoffReleasedAtMs ?? entry.record.resolvedAtMs;
  }
  /** Retains an existing local binding across async delivery; final release starts a fresh grace. */
  retainForHandoff(recordId) {
    const entry = this.pending.get(recordId);
    if (!entry) return null;
    const nowMs = Date.now();
    const graceAnchorMs = this.resolvedGraceAnchorMs(entry, nowMs);
    if (
      !entry.retainForManagerLifetime &&
      graceAnchorMs !== null &&
      entry.handoffRetainCount === 0 &&
      nowMs - graceAnchorMs >= 15e3
    ) {
      this.pending.delete(recordId);
      return null;
    }
    if (entry.cleanupTimer) {
      clearTimeout(entry.cleanupTimer);
      entry.cleanupTimer = null;
    }
    entry.handoffRetainCount += 1;
    let released = false;
    return () => {
      if (released) return;
      released = true;
      if (this.pending.get(recordId) !== entry) return;
      entry.handoffRetainCount = Math.max(0, entry.handoffRetainCount - 1);
      if (entry.handoffRetainCount > 0 || entry.record.resolvedAtMs === void 0) return;
      entry.handoffReleasedAtMs = Date.now();
      this.scheduleResolvedCleanup(entry);
    };
  }
  reportError(error, context) {
    const onError = this.options.onError;
    if (!onError) return;
    try {
      onError(error instanceof Error ? error : new Error(String(error)), {
        ...context,
        approvalKind: this.approvalKind,
      });
    } catch {}
  }
  scheduleExpiryTimer(entry) {
    const timerDelayMs = resolveApprovalTimeoutMs(entry.record.expiresAtMs - Date.now());
    entry.timer = setTimeout(() => {
      try {
        this.expireDue(entry.record.id);
      } catch (error) {
        this.reportError(error, {
          approvalId: entry.record.id,
          operation: "expire",
        });
      }
    }, timerDelayMs);
  }
  expireDue(recordId) {
    const entry = this.pending.get(recordId);
    if (!entry || entry.record.resolvedAtMs !== void 0) return false;
    if (!this.options.persistence) {
      if (entry.record.expiresAtMs > Date.now()) {
        this.scheduleExpiryTimer(entry);
        return false;
      }
      return this.expireLocal(recordId, null);
    }
    const result = this.forceDenyDetailed(
      recordId,
      "timeout",
      {
        kind: "system",
        id: null,
      },
      "expired",
      void 0,
      true,
    );
    if (result.outcome === "not-due") {
      this.scheduleExpiryTimer(entry);
      return false;
    }
    return result.outcome === "denied" || result.outcome === "expired";
  }
  resolveLocal(recordId, decision, resolvedBy, resolutionSource = "operator") {
    const entry = this.pending.get(recordId);
    if (!entry || entry.record.resolvedAtMs !== void 0) return false;
    if (
      !normalizeAllowedDecisions(
        this.options.resolveAllowedDecisions?.(entry.record.request),
      ).includes(decision)
    )
      return false;
    return this.settleLocalEntry({
      recordId,
      decision,
      resolvedAtMs: Date.now(),
      resolvedBy,
      resolverKind: "runtime",
      status: decision === "deny" ? "denied" : "allowed",
      terminalReason: "user",
      resolutionSource,
    });
  }
  expireLocal(recordId, resolvedBy) {
    const entry = this.pending.get(recordId);
    if (!entry || entry.record.resolvedAtMs !== void 0) return false;
    const noRoute = resolvedBy === "no-approval-route";
    return this.settleLocalEntry({
      recordId,
      decision: null,
      resolvedAtMs: Date.now(),
      resolvedBy,
      resolverKind: "system",
      status: noRoute ? "denied" : "expired",
      terminalReason: noRoute ? "no-route" : "timeout",
    });
  }
  resolve(recordId, decision, resolvedBy) {
    if (!this.options.persistence) return this.resolveLocal(recordId, decision, resolvedBy ?? null);
    return (
      this.resolveDetailed(
        recordId,
        decision,
        {
          kind: "runtime",
          id: resolvedBy ?? null,
        },
        resolvedBy ?? null,
      ).outcome === "resolved"
    );
  }
  /**
   * Trusted auto-review resolution (identity-matched approval runtime).
   * Always allow-once; system.run replay validation treats the resulting
   * record more strictly than an operator decision (see #103515).
   */
  resolveAutoReview(recordId, resolvedBy) {
    if (!this.options.persistence)
      return this.resolveLocal(recordId, "allow-once", resolvedBy ?? null, "auto-review");
    return (
      this.resolveDetailed(
        recordId,
        "allow-once",
        {
          kind: "runtime",
          id: resolvedBy ?? null,
        },
        resolvedBy ?? null,
        "auto-review",
      ).outcome === "resolved"
    );
  }
  /**
   * One-shot ask-fallback re-admission for a timed-out approval. This is
   * pre-gate policy on the process-local record only: the durable row stays
   * `expired` and no execution authority is minted here. The strict exec
   * timeout cutover is deferred (docs/refactor/operator-approvals.md); until
   * then system.run replay uses this flag to keep re-admission single-use.
   */
  consumeAskFallback(recordId) {
    const entry = this.pending.get(recordId);
    if (!entry) return false;
    const record = entry.record;
    if (
      record.resolvedAtMs === void 0 ||
      record.decision !== void 0 ||
      record.consumedDecision !== void 0 ||
      record.askFallbackConsumed === true
    )
      return false;
    record.askFallbackConsumed = true;
    return true;
  }
  expire(recordId, resolvedBy) {
    if (!this.options.persistence) return this.expireLocal(recordId, resolvedBy ?? null);
    const noRoute = resolvedBy === "no-approval-route";
    return (
      this.forceDenyDetailed(
        recordId,
        noRoute ? "no-route" : "timeout",
        {
          kind: "system",
          id: resolvedBy ?? null,
        },
        noRoute ? "denied" : "expired",
        noRoute ? null : void 0,
        false,
        resolvedBy ?? null,
      ).outcome === "denied"
    );
  }
  getSnapshot(recordId) {
    const entry = this.pending.get(recordId);
    if (!entry) return null;
    const nowMs = Date.now();
    const graceAnchorMs = this.resolvedGraceAnchorMs(entry, nowMs);
    if (
      entry.record.terminalReason !== "storage-corrupt" &&
      graceAnchorMs !== null &&
      nowMs - graceAnchorMs >= 15e3
    ) {
      this.pending.delete(recordId);
      return null;
    }
    if (entry.record.resolvedAtMs === void 0 && entry.record.expiresAtMs <= nowMs)
      this.expireDue(recordId);
    return entry.record;
  }
  /** Returns an exact live request snapshot without reading durable state or mutating expiry. */
  getLiveSnapshot(recordId) {
    const entry = this.pending.get(recordId);
    if (!entry) return null;
    const nowMs = Date.now();
    if (entry.record.resolvedAtMs === void 0)
      return entry.record.expiresAtMs > nowMs ? entry.record : null;
    const graceAnchorMs = this.resolvedGraceAnchorMs(entry, nowMs);
    if (graceAnchorMs === null || nowMs - graceAnchorMs >= 15e3) return null;
    return entry.record;
  }
  listPendingRecords() {
    const nowMs = Date.now();
    for (const entry of this.pending.values())
      if (entry.record.resolvedAtMs === void 0 && entry.record.expiresAtMs <= nowMs)
        this.expireDue(entry.record.id);
    return Array.from(this.pending.values())
      .map((entry) => entry.record)
      .filter((record) => record.resolvedAtMs === void 0);
  }
  consumeAllowOnce(recordId, consumerId = recordId) {
    const entry = this.pending.get(recordId);
    if (!entry) return false;
    const nowMs = Date.now();
    const resolvedAtMs = entry.record.resolvedAtMs;
    const graceAnchorMs = this.resolvedGraceAnchorMs(entry, nowMs);
    if (
      resolvedAtMs === void 0 ||
      graceAnchorMs === null ||
      nowMs - graceAnchorMs >= 15e3 ||
      entry.record.decision !== "allow-once" ||
      entry.record.consumedDecision
    )
      return false;
    const persistence = this.options.persistence;
    if (persistence) {
      const result = consumeOperatorApprovalAllowOnce({
        id: recordId,
        consumerId,
        expectedKind: this.approvalKind,
        runtimeEpoch: persistence.runtimeEpoch,
        redemptionWindowMs:
          EXEC_APPROVAL_RESOLVED_ENTRY_GRACE_MS + Math.max(0, graceAnchorMs - resolvedAtMs),
        databaseOptions: persistence.databaseOptions,
      });
      if (result.outcome !== "consumed") return false;
      entry.record.consumedDecision = "allow-once";
      entry.record.consumedAtMs = result.record.consumedAtMs;
      entry.record.consumedBy = result.record.consumedBy;
      return true;
    }
    entry.record.consumedDecision = "allow-once";
    return true;
  }
  /**
   * Wait for decision on an already-registered approval.
   * Returns the decision promise if the ID is pending, null otherwise.
   */
  awaitDecision(recordId) {
    if (!this.getSnapshot(recordId)) return null;
    return this.pending.get(recordId)?.promise ?? null;
  }
  lookupApprovalId(input, opts = {}) {
    const rawExact = this.getSnapshot(input);
    if (rawExact)
      return (opts.includeResolved || rawExact.resolvedAtMs === void 0) &&
        (opts.filter?.(rawExact) ?? true)
        ? {
            kind: "exact",
            id: input,
          }
        : { kind: "none" };
    const normalized = input.trim();
    if (!normalized) return { kind: "none" };
    const exact = this.getSnapshot(normalized);
    if (exact)
      return (opts.includeResolved || exact.resolvedAtMs === void 0) &&
        (opts.filter?.(exact) ?? true)
        ? {
            kind: "exact",
            id: normalized,
          }
        : { kind: "none" };
    const lowerPrefix = normalizeLowercaseStringOrEmpty(normalized);
    const matches = [];
    const candidates = /* @__PURE__ */ new Map();
    for (const entry of this.pending.values()) candidates.set(entry.record.id, entry.record);
    for (const record of this.listPendingRecords()) candidates.set(record.id, record);
    for (const [id, record] of candidates) {
      if (!opts.includeResolved && record.resolvedAtMs !== void 0) continue;
      if (opts.filter && !opts.filter(record)) continue;
      if (normalizeLowercaseStringOrEmpty(id).startsWith(lowerPrefix)) matches.push(id);
    }
    if (matches.length === 1)
      return {
        kind: "prefix",
        id: expectDefined(matches[0], "matches capture group 0"),
      };
    if (matches.length > 1)
      return {
        kind: "ambiguous",
        ids: matches,
      };
    return { kind: "none" };
  }
  lookupPendingId(input) {
    return this.lookupApprovalId(input);
  }
};
//#endregion
export { ExecApprovalManager as n, EXEC_APPROVAL_RESOLVED_ENTRY_GRACE_MS as t };
