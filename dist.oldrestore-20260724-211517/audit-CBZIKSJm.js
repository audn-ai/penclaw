import { t as listAuditEvents } from "./audit-event-store-DW206N_K.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import {
  E as validateAuditListParams,
  T as validateAuditActivityListParams,
} from "./src-CIJf1lT0.js";
import { t as formatValidationErrors } from "./validation-errors-B9K6VbD7.js";
//#region src/gateway/server-methods/audit.ts
const DEFAULT_AUDIT_LIST_LIMIT = 100;
const MAX_AUDIT_LIST_LIMIT = 500;
function parseAuditCursor(cursor) {
  if (cursor === void 0) return;
  if (!/^\d+$/.test(cursor)) return null;
  const parsed = Number(cursor);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}
/** Preserve the shipped audit.list result shape for run/tool-only clients. */
function mapLegacyAuditEvent(event) {
  const { schemaVersion: _schemaVersion, actorType, actorId, ...legacyEvent } = event;
  return {
    ...legacyEvent,
    actor: {
      type: actorType,
      id: actorId,
    },
  };
}
function mapAuditActivityEvent(event) {
  if (event.kind === "agent_run") {
    const { actorType, actorId, ...activity } = event;
    return {
      ...activity,
      eventType: "agent_run",
      actor: {
        type: actorType,
        id: actorId,
      },
    };
  }
  if (event.kind === "tool_action") {
    const { actorType, actorId, ...activity } = event;
    return {
      ...activity,
      eventType: "tool_action",
      actor: {
        type: actorType,
        id: actorId,
      },
    };
  }
  if (event.direction === "inbound") {
    const { actorType, actorId, ...activity } = event;
    const actor =
      actorType === "channel_sender"
        ? {
            type: "channel_sender",
            id: actorId,
          }
        : {
            type: "system",
            id: actorId,
          };
    return {
      ...activity,
      eventType: "inbound_message",
      actor,
    };
  }
  const { actorType, actorId, ...activity } = event;
  return {
    ...activity,
    eventType: "outbound_message",
    actor: {
      type: actorType,
      id: actorId,
    },
  };
}
function invalidRangeOrCursor(params) {
  const cursor = parseAuditCursor(params.cursor);
  return {
    ...(cursor !== void 0 && cursor !== null ? { cursor } : {}),
    invalid:
      cursor === null ||
      (params.after !== void 0 && params.before !== void 0 && params.after > params.before),
  };
}
const auditHandlers = {
  "audit.list": ({ params, respond }) => {
    if (!validateAuditListParams(params)) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid audit.list params: ${formatValidationErrors(validateAuditListParams.errors)}`,
        ),
      );
      return;
    }
    const parsed = invalidRangeOrCursor(params);
    if (parsed.invalid) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "invalid audit.list range or cursor"),
      );
      return;
    }
    const page = listAuditEvents({
      limit: Math.min(params.limit ?? DEFAULT_AUDIT_LIST_LIMIT, MAX_AUDIT_LIST_LIMIT),
      ...(parsed.cursor !== void 0 ? { cursor: parsed.cursor } : {}),
      filters: {
        ...(params.agentId ? { agentId: params.agentId } : {}),
        ...(params.sessionKey ? { sessionKey: params.sessionKey } : {}),
        ...(params.runId ? { runId: params.runId } : {}),
        ...(params.kind ? { kind: params.kind } : {}),
        ...(params.status ? { status: params.status } : {}),
        ...(params.after !== void 0 ? { after: params.after } : {}),
        ...(params.before !== void 0 ? { before: params.before } : {}),
      },
    });
    respond(true, {
      events: page.events.map((event) => {
        if (event.kind === "message")
          throw new Error("legacy audit.list cannot project message records");
        return mapLegacyAuditEvent(event);
      }),
      ...(page.nextCursor !== void 0 ? { nextCursor: String(page.nextCursor) } : {}),
    });
  },
  "audit.activity.list": ({ params, respond }) => {
    if (!validateAuditActivityListParams(params)) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid audit.activity.list params: ${formatValidationErrors(validateAuditActivityListParams.errors)}`,
        ),
      );
      return;
    }
    const parsed = invalidRangeOrCursor(params);
    if (parsed.invalid) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "invalid audit.activity.list range or cursor"),
      );
      return;
    }
    const page = listAuditEvents({
      limit: Math.min(params.limit ?? DEFAULT_AUDIT_LIST_LIMIT, MAX_AUDIT_LIST_LIMIT),
      ...(parsed.cursor !== void 0 ? { cursor: parsed.cursor } : {}),
      filters: {
        includeMessages: true,
        ...(params.agentId ? { agentId: params.agentId } : {}),
        ...(params.sessionKey ? { sessionKey: params.sessionKey } : {}),
        ...(params.runId ? { runId: params.runId } : {}),
        ...(params.kind ? { kind: params.kind } : {}),
        ...(params.status ? { status: params.status } : {}),
        ...(params.direction ? { direction: params.direction } : {}),
        ...(params.channel ? { channel: params.channel } : {}),
        ...(params.after !== void 0 ? { after: params.after } : {}),
        ...(params.before !== void 0 ? { before: params.before } : {}),
      },
    });
    respond(true, {
      events: page.events.map(mapAuditActivityEvent),
      ...(page.nextCursor !== void 0 ? { nextCursor: String(page.nextCursor) } : {}),
    });
  },
};
const testApi = {
  mapAuditActivityEvent,
  mapLegacyAuditEvent,
  parseAuditCursor,
};
//#endregion
export { auditHandlers, testApi };
