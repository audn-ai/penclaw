import { Type } from "typebox";
import { t as APPROVAL_ID_WELL_FORMED_UNICODE_PATTERN } from "./approval-id-BTRnO3t1.js";
import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-Br1guPTt.js";
import { t as closedObject } from "./closed-object-DY9fiMP-.js";
//#region packages/gateway-protocol/src/secret-ref-contract.ts
/** Canonical id for file secret providers that expose exactly one value. */
const SINGLE_VALUE_FILE_REF_ID = "value";
/** Shared alias grammar for env/file/exec secret provider names. */
const SECRET_PROVIDER_ALIAS_PATTERN = /^[a-z][a-z0-9_-]{0,63}$/;
/** JSON-schema fragment that rejects invalid JSON-pointer escape sequences. */
const FILE_SECRET_REF_ID_INVALID_ESCAPE_JSON_SCHEMA_PATTERN = "~(?:[^01]|$)";
/** JSON-schema pattern for exec secret ref ids, excluding dot-path traversal. */
const EXEC_SECRET_REF_ID_JSON_SCHEMA_PATTERN =
  "^(?!.*(?:^|/)\\.{1,2}(?:/|$))[A-Za-z0-9][A-Za-z0-9._:/#-]{0,255}$";
//#endregion
//#region packages/gateway-protocol/src/schema/primitives.ts
/**
 * Shared schema primitives reused by gateway protocol request/result schemas.
 *
 * Keep these schemas small and transport-oriented; feature-specific validation
 * belongs in the owning schema module or runtime handler.
 */
const ENV_SECRET_REF_ID_RE = /^[A-Z][A-Z0-9_]{0,127}$/;
const INPUT_PROVENANCE_KIND_VALUES = ["external_user", "inter_session", "internal_system"];
const SESSION_LABEL_MAX_LENGTH = 512;
/** Non-empty string primitive for protocol fields that reject blank values. */
const NonEmptyString = Type.String({ minLength: 1 });
/** Chat-send session key string primitive with bounded length. */
const ChatSendSessionKeyString = Type.String({
  minLength: 1,
  maxLength: 512,
});
/** Human-readable session label primitive with bounded display length. */
const SessionLabelString = Type.String({
  minLength: 1,
  maxLength: SESSION_LABEL_MAX_LENGTH,
});
/** Provenance marker for content copied from another user/session/system source. */
const InputProvenanceSchema = closedObject({
  kind: Type.String({ enum: [...INPUT_PROVENANCE_KIND_VALUES] }),
  originSessionId: Type.Optional(Type.String()),
  sourceSessionKey: Type.Optional(Type.String()),
  sourceChannel: Type.Optional(Type.String()),
  sourceTool: Type.Optional(Type.String()),
});
/** Closed gateway client id schema aligned with `GATEWAY_CLIENT_IDS`. */
const GatewayClientIdSchema = Type.Enum(GATEWAY_CLIENT_IDS);
/** Closed gateway client mode schema aligned with `GATEWAY_CLIENT_MODES`. */
const GatewayClientModeSchema = Type.Enum(GATEWAY_CLIENT_MODES);
Type.Union([Type.Literal("env"), Type.Literal("file"), Type.Literal("exec")]);
const SecretProviderAliasString = Type.String({ pattern: SECRET_PROVIDER_ALIAS_PATTERN.source });
const EnvSecretRefSchema = closedObject({
  source: Type.Literal("env"),
  provider: SecretProviderAliasString,
  id: Type.String({ pattern: ENV_SECRET_REF_ID_RE.source }),
});
const FileSecretRefIdSchema = Type.Unsafe({
  type: "string",
  anyOf: [
    { const: SINGLE_VALUE_FILE_REF_ID },
    {
      allOf: [
        { pattern: "^/" },
        { not: { pattern: FILE_SECRET_REF_ID_INVALID_ESCAPE_JSON_SCHEMA_PATTERN } },
      ],
    },
  ],
});
const FileSecretRefSchema = closedObject({
  source: Type.Literal("file"),
  provider: SecretProviderAliasString,
  id: FileSecretRefIdSchema,
});
const ExecSecretRefSchema = closedObject({
  source: Type.Literal("exec"),
  provider: SecretProviderAliasString,
  id: Type.String({ pattern: EXEC_SECRET_REF_ID_JSON_SCHEMA_PATTERN }),
});
/** Structured secret reference accepted by config and channel protocol payloads. */
const SecretRefSchema = Type.Union([EnvSecretRefSchema, FileSecretRefSchema, ExecSecretRefSchema]);
/** Secret input value: either an inline string or a structured SecretRef. */
const SecretInputSchema = Type.Union([Type.String(), SecretRefSchema]);
//#endregion
//#region packages/gateway-protocol/src/schema/approvals.ts
const ApprovalIdSchema = Type.String({
  minLength: 1,
  pattern: APPROVAL_ID_WELL_FORMED_UNICODE_PATTERN,
  description: "Exact full approval id encoded safely in deep-link paths.",
});
/** Approval owner used to select the safe presentation payload. */
const ApprovalKindSchema = Type.Union([Type.Literal("exec"), Type.Literal("plugin")]);
/** Reviewer decisions accepted by the unified approval resolver. */
const ApprovalDecisionSchema = Type.Union([
  Type.Literal("allow-once"),
  Type.Literal("allow-always"),
  Type.Literal("deny"),
]);
/** Reviewer decisions that permit an operation to proceed. */
const ApprovalAllowDecisionSchema = Type.Union([
  Type.Literal("allow-once"),
  Type.Literal("allow-always"),
]);
/** Closed reason recorded for a terminal approval transition. */
const ApprovalTerminalReasonSchema = Type.Union([
  Type.Literal("user"),
  Type.Literal("timeout"),
  Type.Literal("malformed-verdict"),
  Type.Literal("no-route"),
  Type.Literal("run-aborted"),
  Type.Literal("gateway-restart"),
  Type.Literal("storage-corrupt"),
]);
/** Terminal reason accepted for an allowed approval. */
const ApprovalAllowedReasonSchema = Type.Union([Type.Literal("user")]);
/** Terminal reasons accepted for a denied approval. */
const ApprovalDeniedReasonSchema = Type.Union([
  Type.Literal("user"),
  Type.Literal("malformed-verdict"),
  Type.Literal("no-route"),
  Type.Literal("storage-corrupt"),
]);
/** Terminal reason accepted for an expired approval. */
const ApprovalExpiredReasonSchema = Type.Union([Type.Literal("timeout")]);
/** Terminal reasons accepted for a cancelled approval. */
const ApprovalCancelledReasonSchema = Type.Union([
  Type.Literal("run-aborted"),
  Type.Literal("gateway-restart"),
]);
/** Reviewer-facing severity for plugin-owned approval requests. */
const PluginApprovalSeveritySchema = Type.Union([
  Type.Literal("info"),
  Type.Literal("warning"),
  Type.Literal("critical"),
]);
const ApprovalAllowedDecisionsSchema = Type.Array(ApprovalDecisionSchema, {
  minItems: 1,
  maxItems: 3,
  uniqueItems: true,
  contains: Type.Literal("deny"),
  description:
    "Available reviewer decisions. Deny is always available so malformed or unsafe input can fail closed.",
});
/** Redacted exec details safe to persist and render outside the requesting runtime. */
const ExecApprovalPresentationSchema = Type.Object(
  {
    kind: Type.Literal("exec"),
    commandText: NonEmptyString,
    commandPreview: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    warningText: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    host: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    nodeId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
    agentId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
    allowedDecisions: ApprovalAllowedDecisionsSchema,
  },
  {
    additionalProperties: false,
    description:
      "Reviewer-safe exec presentation. Runtime cwd, environment, system-run binding, and execution plan are intentionally excluded.",
  },
);
/** Plugin-supplied reviewer text safe to persist and render across surfaces. */
const PluginApprovalPresentationSchema = closedObject({
  kind: Type.Literal("plugin"),
  title: Type.String({
    minLength: 1,
    maxLength: 80,
  }),
  description: Type.String({
    minLength: 1,
    maxLength: 512,
  }),
  severity: PluginApprovalSeveritySchema,
  pluginId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
  toolName: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
  agentId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
  allowedDecisions: ApprovalAllowedDecisionsSchema,
});
/** Reviewer-safe presentation discriminated by the approval owner. */
const ApprovalPresentationSchema = Type.Union([
  ExecApprovalPresentationSchema,
  PluginApprovalPresentationSchema,
]);
const ApprovalRecordCommonFields = {
  id: ApprovalIdSchema,
  urlPath: NonEmptyString,
  createdAtMs: Type.Integer({ minimum: 0 }),
  expiresAtMs: Type.Integer({ minimum: 0 }),
  presentation: ApprovalPresentationSchema,
};
const ApprovalResolutionFields = { resolvedAtMs: Type.Integer({ minimum: 0 }) };
/** Approval that has not yet accepted a reviewer decision. */
const PendingApprovalSnapshotSchema = closedObject({
  ...ApprovalRecordCommonFields,
  status: Type.Literal("pending"),
});
/** Approval whose first recorded reviewer decision allows the operation. */
const AllowedApprovalSnapshotSchema = closedObject({
  ...ApprovalRecordCommonFields,
  ...ApprovalResolutionFields,
  status: Type.Literal("allowed"),
  decision: ApprovalAllowDecisionSchema,
  reason: ApprovalAllowedReasonSchema,
});
/** Approval whose first recorded reviewer decision denies the operation. */
const DeniedApprovalSnapshotSchema = closedObject({
  ...ApprovalRecordCommonFields,
  ...ApprovalResolutionFields,
  status: Type.Literal("denied"),
  decision: Type.Literal("deny"),
  reason: ApprovalDeniedReasonSchema,
});
/** Approval that reached its deadline and therefore failed closed. */
const ExpiredApprovalSnapshotSchema = closedObject({
  ...ApprovalRecordCommonFields,
  ...ApprovalResolutionFields,
  status: Type.Literal("expired"),
  reason: ApprovalExpiredReasonSchema,
});
/** Approval cancelled by its runtime owner before a reviewer decision. */
const CancelledApprovalSnapshotSchema = closedObject({
  ...ApprovalRecordCommonFields,
  ...ApprovalResolutionFields,
  status: Type.Literal("cancelled"),
  reason: ApprovalCancelledReasonSchema,
});
/** Durable approval projection returned identically to every authorized surface. */
const ApprovalSnapshotSchema = Type.Union([
  PendingApprovalSnapshotSchema,
  AllowedApprovalSnapshotSchema,
  DeniedApprovalSnapshotSchema,
  ExpiredApprovalSnapshotSchema,
  CancelledApprovalSnapshotSchema,
]);
/** Durable terminal approval state returned after a resolution attempt. */
const TerminalApprovalSnapshotSchema = Type.Union([
  AllowedApprovalSnapshotSchema,
  DeniedApprovalSnapshotSchema,
  ExpiredApprovalSnapshotSchema,
  CancelledApprovalSnapshotSchema,
]);
/** Lookup payload for one approval by its exact full id. */
const ApprovalGetParamsSchema = closedObject({ id: ApprovalRecordCommonFields.id });
/** Current durable state for one authorized approval lookup. */
const ApprovalGetResultSchema = closedObject({ approval: ApprovalSnapshotSchema });
/** Reviewer decision for one approval identified by its exact full id. */
const ApprovalResolveParamsSchema = closedObject({
  id: ApprovalRecordCommonFields.id,
  kind: ApprovalKindSchema,
  decision: ApprovalDecisionSchema,
});
/** First-answer outcome plus the canonical recorded state returned to all contenders. */
const ApprovalResolveResultSchema = closedObject({
  applied: Type.Boolean(),
  approval: TerminalApprovalSnapshotSchema,
});
const SessionApprovalEventCommonFields = {
  sessionKey: NonEmptyString,
  sourceSessionKey: Type.Optional(NonEmptyString),
  updatedAtMs: Type.Integer({ minimum: 0 }),
};
/** Sanitized pending transition delivered only to an opted-in session audience. */
const PendingSessionApprovalEventSchema = closedObject({
  ...SessionApprovalEventCommonFields,
  phase: Type.Literal("pending"),
  approval: PendingApprovalSnapshotSchema,
});
/** Sanitized terminal transition delivered only to an opted-in session audience. */
const TerminalSessionApprovalEventSchema = closedObject({
  ...SessionApprovalEventCommonFields,
  phase: Type.Literal("terminal"),
  approval: TerminalApprovalSnapshotSchema,
});
/** Sanitized approval transition delivered only to an opted-in session audience. */
const SessionApprovalEventSchema = Type.Union([
  PendingSessionApprovalEventSchema,
  TerminalSessionApprovalEventSchema,
]);
/** Authoritative pending approval set returned when a session stream subscribes. */
const SessionApprovalReplaySchema = closedObject({
  sessionKey: NonEmptyString,
  updatedAtMs: Type.Integer({ minimum: 0 }),
  approvals: Type.Array(PendingApprovalSnapshotSchema),
  truncated: Type.Boolean(),
});
//#endregion
export {
  GatewayClientModeSchema as A,
  PluginApprovalSeveritySchema as C,
  TerminalSessionApprovalEventSchema as D,
  TerminalApprovalSnapshotSchema as E,
  NonEmptyString as M,
  SecretInputSchema as N,
  ChatSendSessionKeyString as O,
  SessionLabelString as P,
  PluginApprovalPresentationSchema as S,
  SessionApprovalReplaySchema as T,
  DeniedApprovalSnapshotSchema as _,
  ApprovalDecisionSchema as a,
  PendingApprovalSnapshotSchema as b,
  ApprovalGetParamsSchema as c,
  ApprovalPresentationSchema as d,
  ApprovalResolveParamsSchema as f,
  CancelledApprovalSnapshotSchema as g,
  ApprovalTerminalReasonSchema as h,
  ApprovalCancelledReasonSchema as i,
  InputProvenanceSchema as j,
  GatewayClientIdSchema as k,
  ApprovalGetResultSchema as l,
  ApprovalSnapshotSchema as m,
  ApprovalAllowDecisionSchema as n,
  ApprovalDeniedReasonSchema as o,
  ApprovalResolveResultSchema as p,
  ApprovalAllowedReasonSchema as r,
  ApprovalExpiredReasonSchema as s,
  AllowedApprovalSnapshotSchema as t,
  ApprovalKindSchema as u,
  ExecApprovalPresentationSchema as v,
  SessionApprovalEventSchema as w,
  PendingSessionApprovalEventSchema as x,
  ExpiredApprovalSnapshotSchema as y,
};
