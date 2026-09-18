import { Static, TSchema, Type } from "typebox";

//#region packages/gateway-protocol/src/validation-errors.d.ts
/** Normalized validation error shape exposed by every protocol validator. */
type ValidationError = {
  /** Failed schema keyword, when the validator can report one. */ keyword?: string /** JSON-pointer path to the failing data location. */;
  instancePath?: string /** JSON-pointer path to the failing schema location. */;
  schemaPath?: string /** Validator-specific keyword parameters for richer diagnostics. */;
  params?: Record<string, unknown> /** Human-readable validation message. */;
  message?: string;
};
/** Convert validator errors into compact operator-facing failure text. */
declare function formatValidationErrors(errors: ValidationError[] | null | undefined): string;
//#endregion
//#region packages/gateway-protocol/src/protocol-validator.d.ts
/** Runtime validator shape shared by gateway clients and server handlers. */
type ProtocolValidator<T = unknown> = ((data: unknown) => data is T) & {
  errors:
    | ValidationError[]
    | null /** Original schema used by the validator, exposed for diagnostics/tests. */;
  schema: unknown;
};
//#endregion
//#region packages/gateway-protocol/src/clawhub-trust-error-details.d.ts
/** Structured ClawHub trust details carried in gateway error payloads. */
declare const ClawHubTrustErrorCodes: {
  readonly SECURITY_UNAVAILABLE: "clawhub_security_unavailable";
  readonly RISK_ACKNOWLEDGEMENT_REQUIRED: "clawhub_risk_acknowledgement_required";
  readonly DOWNLOAD_BLOCKED: "clawhub_download_blocked";
};
type ClawHubTrustErrorCode = (typeof ClawHubTrustErrorCodes)[keyof typeof ClawHubTrustErrorCodes];
type ClawHubTrustErrorDetails = {
  clawhubTrustCode?: ClawHubTrustErrorCode;
  version?: string;
  warning?: string;
};
declare function isClawHubTrustErrorCode(value: unknown): value is ClawHubTrustErrorCode;
declare function buildClawHubTrustErrorDetails(params: {
  code?: ClawHubTrustErrorCode;
  version?: string;
  warning?: string;
}): ClawHubTrustErrorDetails | undefined;
declare function readClawHubTrustErrorDetails(
  details: unknown,
): ClawHubTrustErrorDetails | undefined;
//#endregion
//#region packages/gateway-protocol/src/schema/approval-id.d.ts
/** Whether an approval id is non-empty, path-stable, and contains no unpaired UTF-16 surrogate. */
declare function isWellFormedApprovalId(value: string): boolean;
//#endregion
//#region packages/gateway-protocol/src/schema/approvals.d.ts
/** Approval owner used to select the safe presentation payload. */
declare const ApprovalKindSchema: Type.TUnion<[Type.TLiteral<"exec">, Type.TLiteral<"plugin">]>;
/** Reviewer decisions accepted by the unified approval resolver. */
declare const ApprovalDecisionSchema: Type.TUnion<
  [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
>;
/** Reviewer decisions that permit an operation to proceed. */
declare const ApprovalAllowDecisionSchema: Type.TUnion<
  [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">]
>;
/** Closed reason recorded for a terminal approval transition. */
declare const ApprovalTerminalReasonSchema: Type.TUnion<
  [
    Type.TLiteral<"user">,
    Type.TLiteral<"timeout">,
    Type.TLiteral<"malformed-verdict">,
    Type.TLiteral<"no-route">,
    Type.TLiteral<"run-aborted">,
    Type.TLiteral<"gateway-restart">,
    Type.TLiteral<"storage-corrupt">,
  ]
>;
/** Reviewer-facing severity for plugin-owned approval requests. */
declare const PluginApprovalSeveritySchema: Type.TUnion<
  [Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]
>;
/** Redacted exec details safe to persist and render outside the requesting runtime. */
declare const ExecApprovalPresentationSchema: Type.TObject<{
  kind: Type.TLiteral<"exec">;
  commandText: Type.TString;
  commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  allowedDecisions: Type.TArray<
    Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>
  >;
}>;
/** Plugin-supplied reviewer text safe to persist and render across surfaces. */
declare const PluginApprovalPresentationSchema: Type.TObject<{
  kind: Type.TLiteral<"plugin">;
  title: Type.TString;
  description: Type.TString;
  severity: Type.TUnion<
    [Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]
  >;
  pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  allowedDecisions: Type.TArray<
    Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>
  >;
}>;
/** Reviewer-safe presentation discriminated by the approval owner. */
declare const ApprovalPresentationSchema: Type.TUnion<
  [
    Type.TObject<{
      kind: Type.TLiteral<"exec">;
      commandText: Type.TString;
      commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<
        Type.TUnion<
          [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
        >
      >;
    }>,
    Type.TObject<{
      kind: Type.TLiteral<"plugin">;
      title: Type.TString;
      description: Type.TString;
      severity: Type.TUnion<
        [Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]
      >;
      pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<
        Type.TUnion<
          [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
        >
      >;
    }>,
  ]
>;
/** Approval that has not yet accepted a reviewer decision. */
declare const PendingApprovalSnapshotSchema: Type.TObject<{
  status: Type.TLiteral<"pending">;
  id: Type.TString;
  urlPath: Type.TString;
  createdAtMs: Type.TInteger;
  expiresAtMs: Type.TInteger;
  presentation: Type.TUnion<
    [
      Type.TObject<{
        kind: Type.TLiteral<"exec">;
        commandText: Type.TString;
        commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        allowedDecisions: Type.TArray<
          Type.TUnion<
            [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
          >
        >;
      }>,
      Type.TObject<{
        kind: Type.TLiteral<"plugin">;
        title: Type.TString;
        description: Type.TString;
        severity: Type.TUnion<
          [Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]
        >;
        pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        allowedDecisions: Type.TArray<
          Type.TUnion<
            [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
          >
        >;
      }>,
    ]
  >;
}>;
/** Approval whose first recorded reviewer decision allows the operation. */
declare const AllowedApprovalSnapshotSchema: Type.TObject<{
  status: Type.TLiteral<"allowed">;
  decision: Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">]>;
  reason: Type.TUnion<[Type.TLiteral<"user">]>;
  resolvedAtMs: Type.TInteger;
  id: Type.TString;
  urlPath: Type.TString;
  createdAtMs: Type.TInteger;
  expiresAtMs: Type.TInteger;
  presentation: Type.TUnion<
    [
      Type.TObject<{
        kind: Type.TLiteral<"exec">;
        commandText: Type.TString;
        commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        allowedDecisions: Type.TArray<
          Type.TUnion<
            [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
          >
        >;
      }>,
      Type.TObject<{
        kind: Type.TLiteral<"plugin">;
        title: Type.TString;
        description: Type.TString;
        severity: Type.TUnion<
          [Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]
        >;
        pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        allowedDecisions: Type.TArray<
          Type.TUnion<
            [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
          >
        >;
      }>,
    ]
  >;
}>;
/** Approval whose first recorded reviewer decision denies the operation. */
declare const DeniedApprovalSnapshotSchema: Type.TObject<{
  status: Type.TLiteral<"denied">;
  decision: Type.TLiteral<"deny">;
  reason: Type.TUnion<
    [
      Type.TLiteral<"user">,
      Type.TLiteral<"malformed-verdict">,
      Type.TLiteral<"no-route">,
      Type.TLiteral<"storage-corrupt">,
    ]
  >;
  resolvedAtMs: Type.TInteger;
  id: Type.TString;
  urlPath: Type.TString;
  createdAtMs: Type.TInteger;
  expiresAtMs: Type.TInteger;
  presentation: Type.TUnion<
    [
      Type.TObject<{
        kind: Type.TLiteral<"exec">;
        commandText: Type.TString;
        commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        allowedDecisions: Type.TArray<
          Type.TUnion<
            [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
          >
        >;
      }>,
      Type.TObject<{
        kind: Type.TLiteral<"plugin">;
        title: Type.TString;
        description: Type.TString;
        severity: Type.TUnion<
          [Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]
        >;
        pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        allowedDecisions: Type.TArray<
          Type.TUnion<
            [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
          >
        >;
      }>,
    ]
  >;
}>;
/** Approval that reached its deadline and therefore failed closed. */
declare const ExpiredApprovalSnapshotSchema: Type.TObject<{
  status: Type.TLiteral<"expired">;
  reason: Type.TUnion<[Type.TLiteral<"timeout">]>;
  resolvedAtMs: Type.TInteger;
  id: Type.TString;
  urlPath: Type.TString;
  createdAtMs: Type.TInteger;
  expiresAtMs: Type.TInteger;
  presentation: Type.TUnion<
    [
      Type.TObject<{
        kind: Type.TLiteral<"exec">;
        commandText: Type.TString;
        commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        allowedDecisions: Type.TArray<
          Type.TUnion<
            [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
          >
        >;
      }>,
      Type.TObject<{
        kind: Type.TLiteral<"plugin">;
        title: Type.TString;
        description: Type.TString;
        severity: Type.TUnion<
          [Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]
        >;
        pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        allowedDecisions: Type.TArray<
          Type.TUnion<
            [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
          >
        >;
      }>,
    ]
  >;
}>;
/** Approval cancelled by its runtime owner before a reviewer decision. */
declare const CancelledApprovalSnapshotSchema: Type.TObject<{
  status: Type.TLiteral<"cancelled">;
  reason: Type.TUnion<[Type.TLiteral<"run-aborted">, Type.TLiteral<"gateway-restart">]>;
  resolvedAtMs: Type.TInteger;
  id: Type.TString;
  urlPath: Type.TString;
  createdAtMs: Type.TInteger;
  expiresAtMs: Type.TInteger;
  presentation: Type.TUnion<
    [
      Type.TObject<{
        kind: Type.TLiteral<"exec">;
        commandText: Type.TString;
        commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        allowedDecisions: Type.TArray<
          Type.TUnion<
            [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
          >
        >;
      }>,
      Type.TObject<{
        kind: Type.TLiteral<"plugin">;
        title: Type.TString;
        description: Type.TString;
        severity: Type.TUnion<
          [Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]
        >;
        pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        allowedDecisions: Type.TArray<
          Type.TUnion<
            [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
          >
        >;
      }>,
    ]
  >;
}>;
/** Durable approval projection returned identically to every authorized surface. */
declare const ApprovalSnapshotSchema: Type.TUnion<
  [
    Type.TObject<{
      status: Type.TLiteral<"pending">;
      id: Type.TString;
      urlPath: Type.TString;
      createdAtMs: Type.TInteger;
      expiresAtMs: Type.TInteger;
      presentation: Type.TUnion<
        [
          Type.TObject<{
            kind: Type.TLiteral<"exec">;
            commandText: Type.TString;
            commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            allowedDecisions: Type.TArray<
              Type.TUnion<
                [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
              >
            >;
          }>,
          Type.TObject<{
            kind: Type.TLiteral<"plugin">;
            title: Type.TString;
            description: Type.TString;
            severity: Type.TUnion<
              [Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]
            >;
            pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            allowedDecisions: Type.TArray<
              Type.TUnion<
                [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
              >
            >;
          }>,
        ]
      >;
    }>,
    Type.TObject<{
      status: Type.TLiteral<"allowed">;
      decision: Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">]>;
      reason: Type.TUnion<[Type.TLiteral<"user">]>;
      resolvedAtMs: Type.TInteger;
      id: Type.TString;
      urlPath: Type.TString;
      createdAtMs: Type.TInteger;
      expiresAtMs: Type.TInteger;
      presentation: Type.TUnion<
        [
          Type.TObject<{
            kind: Type.TLiteral<"exec">;
            commandText: Type.TString;
            commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            allowedDecisions: Type.TArray<
              Type.TUnion<
                [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
              >
            >;
          }>,
          Type.TObject<{
            kind: Type.TLiteral<"plugin">;
            title: Type.TString;
            description: Type.TString;
            severity: Type.TUnion<
              [Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]
            >;
            pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            allowedDecisions: Type.TArray<
              Type.TUnion<
                [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
              >
            >;
          }>,
        ]
      >;
    }>,
    Type.TObject<{
      status: Type.TLiteral<"denied">;
      decision: Type.TLiteral<"deny">;
      reason: Type.TUnion<
        [
          Type.TLiteral<"user">,
          Type.TLiteral<"malformed-verdict">,
          Type.TLiteral<"no-route">,
          Type.TLiteral<"storage-corrupt">,
        ]
      >;
      resolvedAtMs: Type.TInteger;
      id: Type.TString;
      urlPath: Type.TString;
      createdAtMs: Type.TInteger;
      expiresAtMs: Type.TInteger;
      presentation: Type.TUnion<
        [
          Type.TObject<{
            kind: Type.TLiteral<"exec">;
            commandText: Type.TString;
            commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            allowedDecisions: Type.TArray<
              Type.TUnion<
                [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
              >
            >;
          }>,
          Type.TObject<{
            kind: Type.TLiteral<"plugin">;
            title: Type.TString;
            description: Type.TString;
            severity: Type.TUnion<
              [Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]
            >;
            pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            allowedDecisions: Type.TArray<
              Type.TUnion<
                [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
              >
            >;
          }>,
        ]
      >;
    }>,
    Type.TObject<{
      status: Type.TLiteral<"expired">;
      reason: Type.TUnion<[Type.TLiteral<"timeout">]>;
      resolvedAtMs: Type.TInteger;
      id: Type.TString;
      urlPath: Type.TString;
      createdAtMs: Type.TInteger;
      expiresAtMs: Type.TInteger;
      presentation: Type.TUnion<
        [
          Type.TObject<{
            kind: Type.TLiteral<"exec">;
            commandText: Type.TString;
            commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            allowedDecisions: Type.TArray<
              Type.TUnion<
                [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
              >
            >;
          }>,
          Type.TObject<{
            kind: Type.TLiteral<"plugin">;
            title: Type.TString;
            description: Type.TString;
            severity: Type.TUnion<
              [Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]
            >;
            pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            allowedDecisions: Type.TArray<
              Type.TUnion<
                [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
              >
            >;
          }>,
        ]
      >;
    }>,
    Type.TObject<{
      status: Type.TLiteral<"cancelled">;
      reason: Type.TUnion<[Type.TLiteral<"run-aborted">, Type.TLiteral<"gateway-restart">]>;
      resolvedAtMs: Type.TInteger;
      id: Type.TString;
      urlPath: Type.TString;
      createdAtMs: Type.TInteger;
      expiresAtMs: Type.TInteger;
      presentation: Type.TUnion<
        [
          Type.TObject<{
            kind: Type.TLiteral<"exec">;
            commandText: Type.TString;
            commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            allowedDecisions: Type.TArray<
              Type.TUnion<
                [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
              >
            >;
          }>,
          Type.TObject<{
            kind: Type.TLiteral<"plugin">;
            title: Type.TString;
            description: Type.TString;
            severity: Type.TUnion<
              [Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]
            >;
            pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            allowedDecisions: Type.TArray<
              Type.TUnion<
                [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
              >
            >;
          }>,
        ]
      >;
    }>,
  ]
>;
/** Durable terminal approval state returned after a resolution attempt. */
declare const TerminalApprovalSnapshotSchema: Type.TUnion<
  [
    Type.TObject<{
      status: Type.TLiteral<"allowed">;
      decision: Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">]>;
      reason: Type.TUnion<[Type.TLiteral<"user">]>;
      resolvedAtMs: Type.TInteger;
      id: Type.TString;
      urlPath: Type.TString;
      createdAtMs: Type.TInteger;
      expiresAtMs: Type.TInteger;
      presentation: Type.TUnion<
        [
          Type.TObject<{
            kind: Type.TLiteral<"exec">;
            commandText: Type.TString;
            commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            allowedDecisions: Type.TArray<
              Type.TUnion<
                [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
              >
            >;
          }>,
          Type.TObject<{
            kind: Type.TLiteral<"plugin">;
            title: Type.TString;
            description: Type.TString;
            severity: Type.TUnion<
              [Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]
            >;
            pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            allowedDecisions: Type.TArray<
              Type.TUnion<
                [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
              >
            >;
          }>,
        ]
      >;
    }>,
    Type.TObject<{
      status: Type.TLiteral<"denied">;
      decision: Type.TLiteral<"deny">;
      reason: Type.TUnion<
        [
          Type.TLiteral<"user">,
          Type.TLiteral<"malformed-verdict">,
          Type.TLiteral<"no-route">,
          Type.TLiteral<"storage-corrupt">,
        ]
      >;
      resolvedAtMs: Type.TInteger;
      id: Type.TString;
      urlPath: Type.TString;
      createdAtMs: Type.TInteger;
      expiresAtMs: Type.TInteger;
      presentation: Type.TUnion<
        [
          Type.TObject<{
            kind: Type.TLiteral<"exec">;
            commandText: Type.TString;
            commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            allowedDecisions: Type.TArray<
              Type.TUnion<
                [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
              >
            >;
          }>,
          Type.TObject<{
            kind: Type.TLiteral<"plugin">;
            title: Type.TString;
            description: Type.TString;
            severity: Type.TUnion<
              [Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]
            >;
            pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            allowedDecisions: Type.TArray<
              Type.TUnion<
                [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
              >
            >;
          }>,
        ]
      >;
    }>,
    Type.TObject<{
      status: Type.TLiteral<"expired">;
      reason: Type.TUnion<[Type.TLiteral<"timeout">]>;
      resolvedAtMs: Type.TInteger;
      id: Type.TString;
      urlPath: Type.TString;
      createdAtMs: Type.TInteger;
      expiresAtMs: Type.TInteger;
      presentation: Type.TUnion<
        [
          Type.TObject<{
            kind: Type.TLiteral<"exec">;
            commandText: Type.TString;
            commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            allowedDecisions: Type.TArray<
              Type.TUnion<
                [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
              >
            >;
          }>,
          Type.TObject<{
            kind: Type.TLiteral<"plugin">;
            title: Type.TString;
            description: Type.TString;
            severity: Type.TUnion<
              [Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]
            >;
            pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            allowedDecisions: Type.TArray<
              Type.TUnion<
                [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
              >
            >;
          }>,
        ]
      >;
    }>,
    Type.TObject<{
      status: Type.TLiteral<"cancelled">;
      reason: Type.TUnion<[Type.TLiteral<"run-aborted">, Type.TLiteral<"gateway-restart">]>;
      resolvedAtMs: Type.TInteger;
      id: Type.TString;
      urlPath: Type.TString;
      createdAtMs: Type.TInteger;
      expiresAtMs: Type.TInteger;
      presentation: Type.TUnion<
        [
          Type.TObject<{
            kind: Type.TLiteral<"exec">;
            commandText: Type.TString;
            commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            allowedDecisions: Type.TArray<
              Type.TUnion<
                [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
              >
            >;
          }>,
          Type.TObject<{
            kind: Type.TLiteral<"plugin">;
            title: Type.TString;
            description: Type.TString;
            severity: Type.TUnion<
              [Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]
            >;
            pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            allowedDecisions: Type.TArray<
              Type.TUnion<
                [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
              >
            >;
          }>,
        ]
      >;
    }>,
  ]
>;
/** Lookup payload for one approval by its exact full id. */
declare const ApprovalGetParamsSchema: Type.TObject<{
  id: Type.TString;
}>;
/** Current durable state for one authorized approval lookup. */
declare const ApprovalGetResultSchema: Type.TObject<{
  approval: Type.TUnion<
    [
      Type.TObject<{
        status: Type.TLiteral<"pending">;
        id: Type.TString;
        urlPath: Type.TString;
        createdAtMs: Type.TInteger;
        expiresAtMs: Type.TInteger;
        presentation: Type.TUnion<
          [
            Type.TObject<{
              kind: Type.TLiteral<"exec">;
              commandText: Type.TString;
              commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              allowedDecisions: Type.TArray<
                Type.TUnion<
                  [
                    Type.TLiteral<"allow-once">,
                    Type.TLiteral<"allow-always">,
                    Type.TLiteral<"deny">,
                  ]
                >
              >;
            }>,
            Type.TObject<{
              kind: Type.TLiteral<"plugin">;
              title: Type.TString;
              description: Type.TString;
              severity: Type.TUnion<
                [Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]
              >;
              pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              allowedDecisions: Type.TArray<
                Type.TUnion<
                  [
                    Type.TLiteral<"allow-once">,
                    Type.TLiteral<"allow-always">,
                    Type.TLiteral<"deny">,
                  ]
                >
              >;
            }>,
          ]
        >;
      }>,
      Type.TObject<{
        status: Type.TLiteral<"allowed">;
        decision: Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">]>;
        reason: Type.TUnion<[Type.TLiteral<"user">]>;
        resolvedAtMs: Type.TInteger;
        id: Type.TString;
        urlPath: Type.TString;
        createdAtMs: Type.TInteger;
        expiresAtMs: Type.TInteger;
        presentation: Type.TUnion<
          [
            Type.TObject<{
              kind: Type.TLiteral<"exec">;
              commandText: Type.TString;
              commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              allowedDecisions: Type.TArray<
                Type.TUnion<
                  [
                    Type.TLiteral<"allow-once">,
                    Type.TLiteral<"allow-always">,
                    Type.TLiteral<"deny">,
                  ]
                >
              >;
            }>,
            Type.TObject<{
              kind: Type.TLiteral<"plugin">;
              title: Type.TString;
              description: Type.TString;
              severity: Type.TUnion<
                [Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]
              >;
              pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              allowedDecisions: Type.TArray<
                Type.TUnion<
                  [
                    Type.TLiteral<"allow-once">,
                    Type.TLiteral<"allow-always">,
                    Type.TLiteral<"deny">,
                  ]
                >
              >;
            }>,
          ]
        >;
      }>,
      Type.TObject<{
        status: Type.TLiteral<"denied">;
        decision: Type.TLiteral<"deny">;
        reason: Type.TUnion<
          [
            Type.TLiteral<"user">,
            Type.TLiteral<"malformed-verdict">,
            Type.TLiteral<"no-route">,
            Type.TLiteral<"storage-corrupt">,
          ]
        >;
        resolvedAtMs: Type.TInteger;
        id: Type.TString;
        urlPath: Type.TString;
        createdAtMs: Type.TInteger;
        expiresAtMs: Type.TInteger;
        presentation: Type.TUnion<
          [
            Type.TObject<{
              kind: Type.TLiteral<"exec">;
              commandText: Type.TString;
              commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              allowedDecisions: Type.TArray<
                Type.TUnion<
                  [
                    Type.TLiteral<"allow-once">,
                    Type.TLiteral<"allow-always">,
                    Type.TLiteral<"deny">,
                  ]
                >
              >;
            }>,
            Type.TObject<{
              kind: Type.TLiteral<"plugin">;
              title: Type.TString;
              description: Type.TString;
              severity: Type.TUnion<
                [Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]
              >;
              pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              allowedDecisions: Type.TArray<
                Type.TUnion<
                  [
                    Type.TLiteral<"allow-once">,
                    Type.TLiteral<"allow-always">,
                    Type.TLiteral<"deny">,
                  ]
                >
              >;
            }>,
          ]
        >;
      }>,
      Type.TObject<{
        status: Type.TLiteral<"expired">;
        reason: Type.TUnion<[Type.TLiteral<"timeout">]>;
        resolvedAtMs: Type.TInteger;
        id: Type.TString;
        urlPath: Type.TString;
        createdAtMs: Type.TInteger;
        expiresAtMs: Type.TInteger;
        presentation: Type.TUnion<
          [
            Type.TObject<{
              kind: Type.TLiteral<"exec">;
              commandText: Type.TString;
              commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              allowedDecisions: Type.TArray<
                Type.TUnion<
                  [
                    Type.TLiteral<"allow-once">,
                    Type.TLiteral<"allow-always">,
                    Type.TLiteral<"deny">,
                  ]
                >
              >;
            }>,
            Type.TObject<{
              kind: Type.TLiteral<"plugin">;
              title: Type.TString;
              description: Type.TString;
              severity: Type.TUnion<
                [Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]
              >;
              pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              allowedDecisions: Type.TArray<
                Type.TUnion<
                  [
                    Type.TLiteral<"allow-once">,
                    Type.TLiteral<"allow-always">,
                    Type.TLiteral<"deny">,
                  ]
                >
              >;
            }>,
          ]
        >;
      }>,
      Type.TObject<{
        status: Type.TLiteral<"cancelled">;
        reason: Type.TUnion<[Type.TLiteral<"run-aborted">, Type.TLiteral<"gateway-restart">]>;
        resolvedAtMs: Type.TInteger;
        id: Type.TString;
        urlPath: Type.TString;
        createdAtMs: Type.TInteger;
        expiresAtMs: Type.TInteger;
        presentation: Type.TUnion<
          [
            Type.TObject<{
              kind: Type.TLiteral<"exec">;
              commandText: Type.TString;
              commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              allowedDecisions: Type.TArray<
                Type.TUnion<
                  [
                    Type.TLiteral<"allow-once">,
                    Type.TLiteral<"allow-always">,
                    Type.TLiteral<"deny">,
                  ]
                >
              >;
            }>,
            Type.TObject<{
              kind: Type.TLiteral<"plugin">;
              title: Type.TString;
              description: Type.TString;
              severity: Type.TUnion<
                [Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]
              >;
              pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              allowedDecisions: Type.TArray<
                Type.TUnion<
                  [
                    Type.TLiteral<"allow-once">,
                    Type.TLiteral<"allow-always">,
                    Type.TLiteral<"deny">,
                  ]
                >
              >;
            }>,
          ]
        >;
      }>,
    ]
  >;
}>;
/** Reviewer decision for one approval identified by its exact full id. */
declare const ApprovalResolveParamsSchema: Type.TObject<{
  id: Type.TString;
  kind: Type.TUnion<[Type.TLiteral<"exec">, Type.TLiteral<"plugin">]>;
  decision: Type.TUnion<
    [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
  >;
}>;
/** First-answer outcome plus the canonical recorded state returned to all contenders. */
declare const ApprovalResolveResultSchema: Type.TObject<{
  applied: Type.TBoolean;
  approval: Type.TUnion<
    [
      Type.TObject<{
        status: Type.TLiteral<"allowed">;
        decision: Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">]>;
        reason: Type.TUnion<[Type.TLiteral<"user">]>;
        resolvedAtMs: Type.TInteger;
        id: Type.TString;
        urlPath: Type.TString;
        createdAtMs: Type.TInteger;
        expiresAtMs: Type.TInteger;
        presentation: Type.TUnion<
          [
            Type.TObject<{
              kind: Type.TLiteral<"exec">;
              commandText: Type.TString;
              commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              allowedDecisions: Type.TArray<
                Type.TUnion<
                  [
                    Type.TLiteral<"allow-once">,
                    Type.TLiteral<"allow-always">,
                    Type.TLiteral<"deny">,
                  ]
                >
              >;
            }>,
            Type.TObject<{
              kind: Type.TLiteral<"plugin">;
              title: Type.TString;
              description: Type.TString;
              severity: Type.TUnion<
                [Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]
              >;
              pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              allowedDecisions: Type.TArray<
                Type.TUnion<
                  [
                    Type.TLiteral<"allow-once">,
                    Type.TLiteral<"allow-always">,
                    Type.TLiteral<"deny">,
                  ]
                >
              >;
            }>,
          ]
        >;
      }>,
      Type.TObject<{
        status: Type.TLiteral<"denied">;
        decision: Type.TLiteral<"deny">;
        reason: Type.TUnion<
          [
            Type.TLiteral<"user">,
            Type.TLiteral<"malformed-verdict">,
            Type.TLiteral<"no-route">,
            Type.TLiteral<"storage-corrupt">,
          ]
        >;
        resolvedAtMs: Type.TInteger;
        id: Type.TString;
        urlPath: Type.TString;
        createdAtMs: Type.TInteger;
        expiresAtMs: Type.TInteger;
        presentation: Type.TUnion<
          [
            Type.TObject<{
              kind: Type.TLiteral<"exec">;
              commandText: Type.TString;
              commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              allowedDecisions: Type.TArray<
                Type.TUnion<
                  [
                    Type.TLiteral<"allow-once">,
                    Type.TLiteral<"allow-always">,
                    Type.TLiteral<"deny">,
                  ]
                >
              >;
            }>,
            Type.TObject<{
              kind: Type.TLiteral<"plugin">;
              title: Type.TString;
              description: Type.TString;
              severity: Type.TUnion<
                [Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]
              >;
              pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              allowedDecisions: Type.TArray<
                Type.TUnion<
                  [
                    Type.TLiteral<"allow-once">,
                    Type.TLiteral<"allow-always">,
                    Type.TLiteral<"deny">,
                  ]
                >
              >;
            }>,
          ]
        >;
      }>,
      Type.TObject<{
        status: Type.TLiteral<"expired">;
        reason: Type.TUnion<[Type.TLiteral<"timeout">]>;
        resolvedAtMs: Type.TInteger;
        id: Type.TString;
        urlPath: Type.TString;
        createdAtMs: Type.TInteger;
        expiresAtMs: Type.TInteger;
        presentation: Type.TUnion<
          [
            Type.TObject<{
              kind: Type.TLiteral<"exec">;
              commandText: Type.TString;
              commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              allowedDecisions: Type.TArray<
                Type.TUnion<
                  [
                    Type.TLiteral<"allow-once">,
                    Type.TLiteral<"allow-always">,
                    Type.TLiteral<"deny">,
                  ]
                >
              >;
            }>,
            Type.TObject<{
              kind: Type.TLiteral<"plugin">;
              title: Type.TString;
              description: Type.TString;
              severity: Type.TUnion<
                [Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]
              >;
              pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              allowedDecisions: Type.TArray<
                Type.TUnion<
                  [
                    Type.TLiteral<"allow-once">,
                    Type.TLiteral<"allow-always">,
                    Type.TLiteral<"deny">,
                  ]
                >
              >;
            }>,
          ]
        >;
      }>,
      Type.TObject<{
        status: Type.TLiteral<"cancelled">;
        reason: Type.TUnion<[Type.TLiteral<"run-aborted">, Type.TLiteral<"gateway-restart">]>;
        resolvedAtMs: Type.TInteger;
        id: Type.TString;
        urlPath: Type.TString;
        createdAtMs: Type.TInteger;
        expiresAtMs: Type.TInteger;
        presentation: Type.TUnion<
          [
            Type.TObject<{
              kind: Type.TLiteral<"exec">;
              commandText: Type.TString;
              commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              allowedDecisions: Type.TArray<
                Type.TUnion<
                  [
                    Type.TLiteral<"allow-once">,
                    Type.TLiteral<"allow-always">,
                    Type.TLiteral<"deny">,
                  ]
                >
              >;
            }>,
            Type.TObject<{
              kind: Type.TLiteral<"plugin">;
              title: Type.TString;
              description: Type.TString;
              severity: Type.TUnion<
                [Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]
              >;
              pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              allowedDecisions: Type.TArray<
                Type.TUnion<
                  [
                    Type.TLiteral<"allow-once">,
                    Type.TLiteral<"allow-always">,
                    Type.TLiteral<"deny">,
                  ]
                >
              >;
            }>,
          ]
        >;
      }>,
    ]
  >;
}>;
/** Sanitized approval transition delivered only to an opted-in session audience. */
declare const SessionApprovalEventSchema: Type.TUnion<
  [
    Type.TObject<{
      phase: Type.TLiteral<"pending">;
      approval: Type.TObject<{
        status: Type.TLiteral<"pending">;
        id: Type.TString;
        urlPath: Type.TString;
        createdAtMs: Type.TInteger;
        expiresAtMs: Type.TInteger;
        presentation: Type.TUnion<
          [
            Type.TObject<{
              kind: Type.TLiteral<"exec">;
              commandText: Type.TString;
              commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              allowedDecisions: Type.TArray<
                Type.TUnion<
                  [
                    Type.TLiteral<"allow-once">,
                    Type.TLiteral<"allow-always">,
                    Type.TLiteral<"deny">,
                  ]
                >
              >;
            }>,
            Type.TObject<{
              kind: Type.TLiteral<"plugin">;
              title: Type.TString;
              description: Type.TString;
              severity: Type.TUnion<
                [Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]
              >;
              pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
              allowedDecisions: Type.TArray<
                Type.TUnion<
                  [
                    Type.TLiteral<"allow-once">,
                    Type.TLiteral<"allow-always">,
                    Type.TLiteral<"deny">,
                  ]
                >
              >;
            }>,
          ]
        >;
      }>;
      sessionKey: Type.TString;
      sourceSessionKey: Type.TOptional<Type.TString>;
      updatedAtMs: Type.TInteger;
    }>,
    Type.TObject<{
      phase: Type.TLiteral<"terminal">;
      approval: Type.TUnion<
        [
          Type.TObject<{
            status: Type.TLiteral<"allowed">;
            decision: Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">]>;
            reason: Type.TUnion<[Type.TLiteral<"user">]>;
            resolvedAtMs: Type.TInteger;
            id: Type.TString;
            urlPath: Type.TString;
            createdAtMs: Type.TInteger;
            expiresAtMs: Type.TInteger;
            presentation: Type.TUnion<
              [
                Type.TObject<{
                  kind: Type.TLiteral<"exec">;
                  commandText: Type.TString;
                  commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
                  warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
                  host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
                  nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
                  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
                  allowedDecisions: Type.TArray<
                    Type.TUnion<
                      [
                        Type.TLiteral<"allow-once">,
                        Type.TLiteral<"allow-always">,
                        Type.TLiteral<"deny">,
                      ]
                    >
                  >;
                }>,
                Type.TObject<{
                  kind: Type.TLiteral<"plugin">;
                  title: Type.TString;
                  description: Type.TString;
                  severity: Type.TUnion<
                    [Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]
                  >;
                  pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
                  toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
                  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
                  allowedDecisions: Type.TArray<
                    Type.TUnion<
                      [
                        Type.TLiteral<"allow-once">,
                        Type.TLiteral<"allow-always">,
                        Type.TLiteral<"deny">,
                      ]
                    >
                  >;
                }>,
              ]
            >;
          }>,
          Type.TObject<{
            status: Type.TLiteral<"denied">;
            decision: Type.TLiteral<"deny">;
            reason: Type.TUnion<
              [
                Type.TLiteral<"user">,
                Type.TLiteral<"malformed-verdict">,
                Type.TLiteral<"no-route">,
                Type.TLiteral<"storage-corrupt">,
              ]
            >;
            resolvedAtMs: Type.TInteger;
            id: Type.TString;
            urlPath: Type.TString;
            createdAtMs: Type.TInteger;
            expiresAtMs: Type.TInteger;
            presentation: Type.TUnion<
              [
                Type.TObject<{
                  kind: Type.TLiteral<"exec">;
                  commandText: Type.TString;
                  commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
                  warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
                  host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
                  nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
                  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
                  allowedDecisions: Type.TArray<
                    Type.TUnion<
                      [
                        Type.TLiteral<"allow-once">,
                        Type.TLiteral<"allow-always">,
                        Type.TLiteral<"deny">,
                      ]
                    >
                  >;
                }>,
                Type.TObject<{
                  kind: Type.TLiteral<"plugin">;
                  title: Type.TString;
                  description: Type.TString;
                  severity: Type.TUnion<
                    [Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]
                  >;
                  pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
                  toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
                  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
                  allowedDecisions: Type.TArray<
                    Type.TUnion<
                      [
                        Type.TLiteral<"allow-once">,
                        Type.TLiteral<"allow-always">,
                        Type.TLiteral<"deny">,
                      ]
                    >
                  >;
                }>,
              ]
            >;
          }>,
          Type.TObject<{
            status: Type.TLiteral<"expired">;
            reason: Type.TUnion<[Type.TLiteral<"timeout">]>;
            resolvedAtMs: Type.TInteger;
            id: Type.TString;
            urlPath: Type.TString;
            createdAtMs: Type.TInteger;
            expiresAtMs: Type.TInteger;
            presentation: Type.TUnion<
              [
                Type.TObject<{
                  kind: Type.TLiteral<"exec">;
                  commandText: Type.TString;
                  commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
                  warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
                  host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
                  nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
                  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
                  allowedDecisions: Type.TArray<
                    Type.TUnion<
                      [
                        Type.TLiteral<"allow-once">,
                        Type.TLiteral<"allow-always">,
                        Type.TLiteral<"deny">,
                      ]
                    >
                  >;
                }>,
                Type.TObject<{
                  kind: Type.TLiteral<"plugin">;
                  title: Type.TString;
                  description: Type.TString;
                  severity: Type.TUnion<
                    [Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]
                  >;
                  pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
                  toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
                  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
                  allowedDecisions: Type.TArray<
                    Type.TUnion<
                      [
                        Type.TLiteral<"allow-once">,
                        Type.TLiteral<"allow-always">,
                        Type.TLiteral<"deny">,
                      ]
                    >
                  >;
                }>,
              ]
            >;
          }>,
          Type.TObject<{
            status: Type.TLiteral<"cancelled">;
            reason: Type.TUnion<[Type.TLiteral<"run-aborted">, Type.TLiteral<"gateway-restart">]>;
            resolvedAtMs: Type.TInteger;
            id: Type.TString;
            urlPath: Type.TString;
            createdAtMs: Type.TInteger;
            expiresAtMs: Type.TInteger;
            presentation: Type.TUnion<
              [
                Type.TObject<{
                  kind: Type.TLiteral<"exec">;
                  commandText: Type.TString;
                  commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
                  warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
                  host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
                  nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
                  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
                  allowedDecisions: Type.TArray<
                    Type.TUnion<
                      [
                        Type.TLiteral<"allow-once">,
                        Type.TLiteral<"allow-always">,
                        Type.TLiteral<"deny">,
                      ]
                    >
                  >;
                }>,
                Type.TObject<{
                  kind: Type.TLiteral<"plugin">;
                  title: Type.TString;
                  description: Type.TString;
                  severity: Type.TUnion<
                    [Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]
                  >;
                  pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
                  toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
                  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
                  allowedDecisions: Type.TArray<
                    Type.TUnion<
                      [
                        Type.TLiteral<"allow-once">,
                        Type.TLiteral<"allow-always">,
                        Type.TLiteral<"deny">,
                      ]
                    >
                  >;
                }>,
              ]
            >;
          }>,
        ]
      >;
      sessionKey: Type.TString;
      sourceSessionKey: Type.TOptional<Type.TString>;
      updatedAtMs: Type.TInteger;
    }>,
  ]
>;
/** Authoritative pending approval set returned when a session stream subscribes. */
declare const SessionApprovalReplaySchema: Type.TObject<{
  sessionKey: Type.TString;
  updatedAtMs: Type.TInteger;
  approvals: Type.TArray<
    Type.TObject<{
      status: Type.TLiteral<"pending">;
      id: Type.TString;
      urlPath: Type.TString;
      createdAtMs: Type.TInteger;
      expiresAtMs: Type.TInteger;
      presentation: Type.TUnion<
        [
          Type.TObject<{
            kind: Type.TLiteral<"exec">;
            commandText: Type.TString;
            commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            allowedDecisions: Type.TArray<
              Type.TUnion<
                [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
              >
            >;
          }>,
          Type.TObject<{
            kind: Type.TLiteral<"plugin">;
            title: Type.TString;
            description: Type.TString;
            severity: Type.TUnion<
              [Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]
            >;
            pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            allowedDecisions: Type.TArray<
              Type.TUnion<
                [Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]
              >
            >;
          }>,
        ]
      >;
    }>
  >;
  truncated: Type.TBoolean;
}>;
type ApprovalKind = Static<typeof ApprovalKindSchema>;
type ApprovalDecision = Static<typeof ApprovalDecisionSchema>;
type ApprovalAllowDecision = Static<typeof ApprovalAllowDecisionSchema>;
type ApprovalTerminalReason = Static<typeof ApprovalTerminalReasonSchema>;
type PluginApprovalSeverity = Static<typeof PluginApprovalSeveritySchema>;
type ExecApprovalPresentation = Static<typeof ExecApprovalPresentationSchema>;
type PluginApprovalPresentation = Static<typeof PluginApprovalPresentationSchema>;
type ApprovalPresentation = Static<typeof ApprovalPresentationSchema>;
type PendingApprovalSnapshot = Static<typeof PendingApprovalSnapshotSchema>;
type ApprovalSnapshot = Static<typeof ApprovalSnapshotSchema>;
type ApprovalGetParams = Static<typeof ApprovalGetParamsSchema>;
type ApprovalGetResult = Static<typeof ApprovalGetResultSchema>;
type ApprovalResolveParams = Static<typeof ApprovalResolveParamsSchema>;
type ApprovalResolveResult = Static<typeof ApprovalResolveResultSchema>;
type AllowedApprovalSnapshot = Static<typeof AllowedApprovalSnapshotSchema>;
type DeniedApprovalSnapshot = Static<typeof DeniedApprovalSnapshotSchema>;
type ExpiredApprovalSnapshot = Static<typeof ExpiredApprovalSnapshotSchema>;
type CancelledApprovalSnapshot = Static<typeof CancelledApprovalSnapshotSchema>;
type TerminalApprovalSnapshot = Static<typeof TerminalApprovalSnapshotSchema>;
type SessionApprovalEvent = Static<typeof SessionApprovalEventSchema>;
type SessionApprovalReplay = Static<typeof SessionApprovalReplaySchema>;
//#endregion
//#region packages/gateway-protocol/src/approval-result-validators.d.ts
declare const validateApprovalGetResult: ProtocolValidator<{
  approval:
    | {
        id: string;
        status: "pending";
        expiresAtMs: number;
        createdAtMs: number;
        urlPath: string;
        presentation:
          | {
              agentId?: string | null | undefined;
              host?: string | null | undefined;
              nodeId?: string | null | undefined;
              commandPreview?: string | null | undefined;
              warningText?: string | null | undefined;
              kind: "exec";
              commandText: string;
              allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
            }
          | {
              agentId?: string | null | undefined;
              toolName?: string | null | undefined;
              pluginId?: string | null | undefined;
              kind: "plugin";
              title: string;
              description: string;
              allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
              severity: "info" | "warning" | "critical";
            };
      }
    | {
        id: string;
        status: "allowed";
        reason: "user";
        expiresAtMs: number;
        createdAtMs: number;
        urlPath: string;
        presentation:
          | {
              agentId?: string | null | undefined;
              host?: string | null | undefined;
              nodeId?: string | null | undefined;
              commandPreview?: string | null | undefined;
              warningText?: string | null | undefined;
              kind: "exec";
              commandText: string;
              allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
            }
          | {
              agentId?: string | null | undefined;
              toolName?: string | null | undefined;
              pluginId?: string | null | undefined;
              kind: "plugin";
              title: string;
              description: string;
              allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
              severity: "info" | "warning" | "critical";
            };
        decision: "allow-once" | "allow-always";
        resolvedAtMs: number;
      }
    | {
        id: string;
        status: "denied";
        reason: "user" | "malformed-verdict" | "no-route" | "storage-corrupt";
        expiresAtMs: number;
        createdAtMs: number;
        urlPath: string;
        presentation:
          | {
              agentId?: string | null | undefined;
              host?: string | null | undefined;
              nodeId?: string | null | undefined;
              commandPreview?: string | null | undefined;
              warningText?: string | null | undefined;
              kind: "exec";
              commandText: string;
              allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
            }
          | {
              agentId?: string | null | undefined;
              toolName?: string | null | undefined;
              pluginId?: string | null | undefined;
              kind: "plugin";
              title: string;
              description: string;
              allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
              severity: "info" | "warning" | "critical";
            };
        decision: "deny";
        resolvedAtMs: number;
      }
    | {
        id: string;
        status: "expired";
        reason: "timeout";
        expiresAtMs: number;
        createdAtMs: number;
        urlPath: string;
        presentation:
          | {
              agentId?: string | null | undefined;
              host?: string | null | undefined;
              nodeId?: string | null | undefined;
              commandPreview?: string | null | undefined;
              warningText?: string | null | undefined;
              kind: "exec";
              commandText: string;
              allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
            }
          | {
              agentId?: string | null | undefined;
              toolName?: string | null | undefined;
              pluginId?: string | null | undefined;
              kind: "plugin";
              title: string;
              description: string;
              allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
              severity: "info" | "warning" | "critical";
            };
        resolvedAtMs: number;
      }
    | {
        id: string;
        status: "cancelled";
        reason: "run-aborted" | "gateway-restart";
        expiresAtMs: number;
        createdAtMs: number;
        urlPath: string;
        presentation:
          | {
              agentId?: string | null | undefined;
              host?: string | null | undefined;
              nodeId?: string | null | undefined;
              commandPreview?: string | null | undefined;
              warningText?: string | null | undefined;
              kind: "exec";
              commandText: string;
              allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
            }
          | {
              agentId?: string | null | undefined;
              toolName?: string | null | undefined;
              pluginId?: string | null | undefined;
              kind: "plugin";
              title: string;
              description: string;
              allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
              severity: "info" | "warning" | "critical";
            };
        resolvedAtMs: number;
      };
}>;
declare const validateApprovalResolveResult: ProtocolValidator<{
  approval:
    | {
        id: string;
        status: "allowed";
        reason: "user";
        expiresAtMs: number;
        createdAtMs: number;
        urlPath: string;
        presentation:
          | {
              agentId?: string | null | undefined;
              host?: string | null | undefined;
              nodeId?: string | null | undefined;
              commandPreview?: string | null | undefined;
              warningText?: string | null | undefined;
              kind: "exec";
              commandText: string;
              allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
            }
          | {
              agentId?: string | null | undefined;
              toolName?: string | null | undefined;
              pluginId?: string | null | undefined;
              kind: "plugin";
              title: string;
              description: string;
              allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
              severity: "info" | "warning" | "critical";
            };
        decision: "allow-once" | "allow-always";
        resolvedAtMs: number;
      }
    | {
        id: string;
        status: "denied";
        reason: "user" | "malformed-verdict" | "no-route" | "storage-corrupt";
        expiresAtMs: number;
        createdAtMs: number;
        urlPath: string;
        presentation:
          | {
              agentId?: string | null | undefined;
              host?: string | null | undefined;
              nodeId?: string | null | undefined;
              commandPreview?: string | null | undefined;
              warningText?: string | null | undefined;
              kind: "exec";
              commandText: string;
              allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
            }
          | {
              agentId?: string | null | undefined;
              toolName?: string | null | undefined;
              pluginId?: string | null | undefined;
              kind: "plugin";
              title: string;
              description: string;
              allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
              severity: "info" | "warning" | "critical";
            };
        decision: "deny";
        resolvedAtMs: number;
      }
    | {
        id: string;
        status: "expired";
        reason: "timeout";
        expiresAtMs: number;
        createdAtMs: number;
        urlPath: string;
        presentation:
          | {
              agentId?: string | null | undefined;
              host?: string | null | undefined;
              nodeId?: string | null | undefined;
              commandPreview?: string | null | undefined;
              warningText?: string | null | undefined;
              kind: "exec";
              commandText: string;
              allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
            }
          | {
              agentId?: string | null | undefined;
              toolName?: string | null | undefined;
              pluginId?: string | null | undefined;
              kind: "plugin";
              title: string;
              description: string;
              allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
              severity: "info" | "warning" | "critical";
            };
        resolvedAtMs: number;
      }
    | {
        id: string;
        status: "cancelled";
        reason: "run-aborted" | "gateway-restart";
        expiresAtMs: number;
        createdAtMs: number;
        urlPath: string;
        presentation:
          | {
              agentId?: string | null | undefined;
              host?: string | null | undefined;
              nodeId?: string | null | undefined;
              commandPreview?: string | null | undefined;
              warningText?: string | null | undefined;
              kind: "exec";
              commandText: string;
              allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
            }
          | {
              agentId?: string | null | undefined;
              toolName?: string | null | undefined;
              pluginId?: string | null | undefined;
              kind: "plugin";
              title: string;
              description: string;
              allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
              severity: "info" | "warning" | "critical";
            };
        resolvedAtMs: number;
      };
  applied: boolean;
}>;
//#endregion
//#region packages/gateway-protocol/src/schema/worker-admission.d.ts
declare const WORKER_RPC_SET_VERSION = 1;
declare const WORKER_HEARTBEAT_INTERVAL_MS = 15000;
declare const WORKER_PROTOCOL_METHODS: readonly [
  "worker.heartbeat",
  "worker.transcript.commit",
  "worker.live-event",
];
declare const WORKER_TRANSCRIPT_COMMIT_PROTOCOL_FEATURE = "worker-transcript-commit-v1";
declare const WORKER_LIVE_EVENT_PROTOCOL_FEATURE = "worker-live-event-v1";
declare const WORKER_PROTOCOL_FEATURES: readonly [
  "worker-heartbeat-v1",
  "worker-transcript-commit-v1",
  "worker-live-event-v1",
  "worker-inference-v1",
];
declare const WORKER_PROTOCOL_MAX_IDENTIFIER_LENGTH = 256;
declare const WORKER_PROTOCOL_MAX_FRAME_ID_LENGTH = 128;
declare const WORKER_PROTOCOL_MAX_METHOD_LENGTH = 64;
declare const WORKER_PROTOCOL_MAX_PAYLOAD_BYTES: number;
declare const WORKER_PROTOCOL_MAX_FEATURES = 64;
declare const WORKER_PROTOCOL_MAX_FEATURE_LENGTH = 128;
declare const WORKER_TRANSCRIPT_MAX_BATCH_MESSAGES = 64;
declare const WORKER_TRANSCRIPT_MAX_CONTENT_PARTS = 128;
declare const WORKER_TRANSCRIPT_MAX_JSON_DEPTH = 32;
declare const WorkerIdentifierSchema: Type.TString;
declare const WorkerFrameIdSchema: Type.TString;
/** Build identity presented by a worker before the gateway admits it. */
declare const WorkerAdmissionHandshakeSchema: Type.TObject<{
  bundleHash: Type.TString;
  openclawVersion: Type.TString;
  protocolFeatures: Type.TArray<Type.TString>;
}>;
/** Dedicated first-frame payload accepted only on the worker ingress. */
declare const WorkerConnectParamsSchema: Type.TObject<{
  minProtocol: Type.TInteger;
  maxProtocol: Type.TInteger;
  client: Type.TObject<{
    id: Type.TLiteral<"openclaw-worker">;
    version: Type.TString;
    platform: Type.TString;
    mode: Type.TLiteral<"worker">;
  }>;
  role: Type.TLiteral<"worker">;
  admission: Type.TUnion<
    [
      Type.TObject<{
        sessionId: Type.TNull;
        runId: Type.TNull;
        environmentId: Type.TString;
        credential: Type.TString;
        ownerEpoch: Type.TInteger;
        rpcSetVersion: Type.TInteger;
        handshake: Type.TObject<{
          bundleHash: Type.TString;
          openclawVersion: Type.TString;
          protocolFeatures: Type.TArray<Type.TString>;
        }>;
      }>,
      Type.TObject<{
        sessionId: Type.TString;
        runId: Type.TString;
        environmentId: Type.TString;
        credential: Type.TString;
        ownerEpoch: Type.TInteger;
        rpcSetVersion: Type.TInteger;
        handshake: Type.TObject<{
          bundleHash: Type.TString;
          openclawVersion: Type.TString;
          protocolFeatures: Type.TArray<Type.TString>;
        }>;
      }>,
    ]
  >;
}>;
declare const WorkerConnectRequestFrameSchema: Type.TObject<{
  type: Type.TLiteral<"req">;
  id: Type.TString;
  method: Type.TLiteral<"connect">;
  params: Type.TObject<{
    minProtocol: Type.TInteger;
    maxProtocol: Type.TInteger;
    client: Type.TObject<{
      id: Type.TLiteral<"openclaw-worker">;
      version: Type.TString;
      platform: Type.TString;
      mode: Type.TLiteral<"worker">;
    }>;
    role: Type.TLiteral<"worker">;
    admission: Type.TUnion<
      [
        Type.TObject<{
          sessionId: Type.TNull;
          runId: Type.TNull;
          environmentId: Type.TString;
          credential: Type.TString;
          ownerEpoch: Type.TInteger;
          rpcSetVersion: Type.TInteger;
          handshake: Type.TObject<{
            bundleHash: Type.TString;
            openclawVersion: Type.TString;
            protocolFeatures: Type.TArray<Type.TString>;
          }>;
        }>,
        Type.TObject<{
          sessionId: Type.TString;
          runId: Type.TString;
          environmentId: Type.TString;
          credential: Type.TString;
          ownerEpoch: Type.TInteger;
          rpcSetVersion: Type.TInteger;
          handshake: Type.TObject<{
            bundleHash: Type.TString;
            openclawVersion: Type.TString;
            protocolFeatures: Type.TArray<Type.TString>;
          }>;
        }>,
      ]
    >;
  }>;
}>;
declare const WorkerAdmissionFailureReasonSchema: Type.TUnion<
  [
    Type.TLiteral<"invalid-credential">,
    Type.TLiteral<"credential-expired">,
    Type.TLiteral<"environment-mismatch">,
    Type.TLiteral<"environment-unavailable">,
    Type.TLiteral<"bundle-mismatch">,
    Type.TLiteral<"version-mismatch">,
    Type.TLiteral<"session-mismatch">,
    Type.TLiteral<"placement-mismatch">,
    Type.TLiteral<"owner-epoch-mismatch">,
    Type.TLiteral<"rpc-set-mismatch">,
    Type.TLiteral<"protocol-features-mismatch">,
  ]
>;
declare const WorkerProtocolCloseReasonSchema: Type.TUnion<
  [
    Type.TUnion<
      [
        Type.TLiteral<"invalid-credential">,
        Type.TLiteral<"credential-expired">,
        Type.TLiteral<"environment-mismatch">,
        Type.TLiteral<"environment-unavailable">,
        Type.TLiteral<"bundle-mismatch">,
        Type.TLiteral<"version-mismatch">,
        Type.TLiteral<"session-mismatch">,
        Type.TLiteral<"placement-mismatch">,
        Type.TLiteral<"owner-epoch-mismatch">,
        Type.TLiteral<"rpc-set-mismatch">,
        Type.TLiteral<"protocol-features-mismatch">,
      ]
    >,
    Type.TLiteral<"invalid-handshake">,
    Type.TLiteral<"protocol-mismatch">,
    Type.TLiteral<"gateway-unavailable">,
    Type.TLiteral<"invalid-frame">,
    Type.TLiteral<"slow-consumer">,
    Type.TLiteral<"method-not-allowed">,
    Type.TLiteral<"invalid-heartbeat">,
    Type.TLiteral<"credential-replaced">,
    Type.TLiteral<"gateway-shutdown">,
  ]
>;
declare const WorkerErrorShapeSchema: Type.TObject<{
  code: Type.TUnion<[Type.TLiteral<"INVALID_REQUEST">, Type.TLiteral<"UNAVAILABLE">]>;
  message: Type.TString;
  details: Type.TObject<{
    reason: Type.TUnion<
      [
        Type.TUnion<
          [
            Type.TLiteral<"invalid-credential">,
            Type.TLiteral<"credential-expired">,
            Type.TLiteral<"environment-mismatch">,
            Type.TLiteral<"environment-unavailable">,
            Type.TLiteral<"bundle-mismatch">,
            Type.TLiteral<"version-mismatch">,
            Type.TLiteral<"session-mismatch">,
            Type.TLiteral<"placement-mismatch">,
            Type.TLiteral<"owner-epoch-mismatch">,
            Type.TLiteral<"rpc-set-mismatch">,
            Type.TLiteral<"protocol-features-mismatch">,
          ]
        >,
        Type.TLiteral<"invalid-handshake">,
        Type.TLiteral<"protocol-mismatch">,
        Type.TLiteral<"gateway-unavailable">,
        Type.TLiteral<"invalid-frame">,
        Type.TLiteral<"slow-consumer">,
        Type.TLiteral<"method-not-allowed">,
        Type.TLiteral<"invalid-heartbeat">,
        Type.TLiteral<"credential-replaced">,
        Type.TLiteral<"gateway-shutdown">,
      ]
    >;
  }>;
  retryable: Type.TOptional<Type.TBoolean>;
  retryAfterMs: Type.TOptional<Type.TInteger>;
}>;
/** Minimal admission response; workers never receive the general gateway snapshot. */
declare const WorkerHelloOkSchema: Type.TObject<{
  type: Type.TLiteral<"worker-hello-ok">;
  environmentId: Type.TString;
  sessionId: Type.TUnion<[Type.TString, Type.TNull]>;
  ownerEpoch: Type.TInteger;
  rpcSetVersion: Type.TInteger;
  protocolFeatures: Type.TArray<Type.TString>;
  credentialExpiresAtMs: Type.TInteger;
  policy: Type.TObject<{
    heartbeatIntervalMs: Type.TInteger;
    maxPayload: Type.TInteger;
  }>;
}>;
declare const WorkerAdmissionResponseFrameSchema: Type.TUnion<
  [
    Type.TObject<{
      type: Type.TLiteral<"res">;
      id: Type.TString;
      ok: Type.TLiteral<true>;
      payload: Type.TObject<{
        type: Type.TLiteral<"worker-hello-ok">;
        environmentId: Type.TString;
        sessionId: Type.TUnion<[Type.TString, Type.TNull]>;
        ownerEpoch: Type.TInteger;
        rpcSetVersion: Type.TInteger;
        protocolFeatures: Type.TArray<Type.TString>;
        credentialExpiresAtMs: Type.TInteger;
        policy: Type.TObject<{
          heartbeatIntervalMs: Type.TInteger;
          maxPayload: Type.TInteger;
        }>;
      }>;
    }>,
    Type.TObject<{
      type: Type.TLiteral<"res">;
      id: Type.TString;
      ok: Type.TLiteral<false>;
      error: Type.TObject<{
        code: Type.TUnion<[Type.TLiteral<"INVALID_REQUEST">, Type.TLiteral<"UNAVAILABLE">]>;
        message: Type.TString;
        details: Type.TObject<{
          reason: Type.TUnion<
            [
              Type.TUnion<
                [
                  Type.TLiteral<"invalid-credential">,
                  Type.TLiteral<"credential-expired">,
                  Type.TLiteral<"environment-mismatch">,
                  Type.TLiteral<"environment-unavailable">,
                  Type.TLiteral<"bundle-mismatch">,
                  Type.TLiteral<"version-mismatch">,
                  Type.TLiteral<"session-mismatch">,
                  Type.TLiteral<"placement-mismatch">,
                  Type.TLiteral<"owner-epoch-mismatch">,
                  Type.TLiteral<"rpc-set-mismatch">,
                  Type.TLiteral<"protocol-features-mismatch">,
                ]
              >,
              Type.TLiteral<"invalid-handshake">,
              Type.TLiteral<"protocol-mismatch">,
              Type.TLiteral<"gateway-unavailable">,
              Type.TLiteral<"invalid-frame">,
              Type.TLiteral<"slow-consumer">,
              Type.TLiteral<"method-not-allowed">,
              Type.TLiteral<"invalid-heartbeat">,
              Type.TLiteral<"credential-replaced">,
              Type.TLiteral<"gateway-shutdown">,
            ]
          >;
        }>;
        retryable: Type.TOptional<Type.TBoolean>;
        retryAfterMs: Type.TOptional<Type.TInteger>;
      }>;
    }>,
  ]
>;
declare const WorkerHeartbeatParamsSchema: Type.TObject<{
  sentAtMs: Type.TInteger;
  status: Type.TUnion<[Type.TLiteral<"ready">, Type.TLiteral<"busy">, Type.TLiteral<"draining">]>;
}>;
declare const WorkerHeartbeatResultSchema: Type.TObject<{
  receivedAtMs: Type.TInteger;
  status: Type.TLiteral<"ok">;
  ownerEpoch: Type.TInteger;
}>;
declare const WorkerHeartbeatRequestFrameSchema: Type.TObject<{
  type: Type.TLiteral<"req">;
  id: Type.TString;
  method: Type.TLiteral<"worker.heartbeat">;
  params: Type.TObject<{
    sentAtMs: Type.TInteger;
    status: Type.TUnion<[Type.TLiteral<"ready">, Type.TLiteral<"busy">, Type.TLiteral<"draining">]>;
  }>;
}>;
declare const WorkerHeartbeatResponseFrameSchema: Type.TUnion<
  [
    Type.TObject<{
      type: Type.TLiteral<"res">;
      id: Type.TString;
      ok: Type.TLiteral<true>;
      payload: Type.TObject<{
        receivedAtMs: Type.TInteger;
        status: Type.TLiteral<"ok">;
        ownerEpoch: Type.TInteger;
      }>;
    }>,
    Type.TObject<{
      type: Type.TLiteral<"res">;
      id: Type.TString;
      ok: Type.TLiteral<false>;
      error: Type.TObject<{
        code: Type.TUnion<[Type.TLiteral<"INVALID_REQUEST">, Type.TLiteral<"UNAVAILABLE">]>;
        message: Type.TString;
        details: Type.TObject<{
          reason: Type.TUnion<
            [
              Type.TUnion<
                [
                  Type.TLiteral<"invalid-credential">,
                  Type.TLiteral<"credential-expired">,
                  Type.TLiteral<"environment-mismatch">,
                  Type.TLiteral<"environment-unavailable">,
                  Type.TLiteral<"bundle-mismatch">,
                  Type.TLiteral<"version-mismatch">,
                  Type.TLiteral<"session-mismatch">,
                  Type.TLiteral<"placement-mismatch">,
                  Type.TLiteral<"owner-epoch-mismatch">,
                  Type.TLiteral<"rpc-set-mismatch">,
                  Type.TLiteral<"protocol-features-mismatch">,
                ]
              >,
              Type.TLiteral<"invalid-handshake">,
              Type.TLiteral<"protocol-mismatch">,
              Type.TLiteral<"gateway-unavailable">,
              Type.TLiteral<"invalid-frame">,
              Type.TLiteral<"slow-consumer">,
              Type.TLiteral<"method-not-allowed">,
              Type.TLiteral<"invalid-heartbeat">,
              Type.TLiteral<"credential-replaced">,
              Type.TLiteral<"gateway-shutdown">,
            ]
          >;
        }>;
        retryable: Type.TOptional<Type.TBoolean>;
        retryAfterMs: Type.TOptional<Type.TInteger>;
      }>;
    }>,
  ]
>;
declare const WorkerTranscriptMessageSchema: Type.TUnion<
  [
    Type.TObject<{
      role: Type.TLiteral<"user">;
      content: Type.TArray<
        Type.TUnion<
          [
            Type.TObject<{
              type: Type.TLiteral<"text">;
              text: Type.TString;
              textSignature: Type.TOptional<Type.TString>;
            }>,
            Type.TObject<{
              type: Type.TLiteral<"image">;
              data: Type.TString;
              mimeType: Type.TString;
            }>,
          ]
        >
      >;
      timestamp: Type.TInteger;
    }>,
    Type.TObject<{
      role: Type.TLiteral<"assistant">;
      content: Type.TArray<
        Type.TUnion<
          [
            Type.TObject<{
              type: Type.TLiteral<"text">;
              text: Type.TString;
              textSignature: Type.TOptional<Type.TString>;
            }>,
            Type.TObject<{
              type: Type.TLiteral<"thinking">;
              thinking: Type.TString;
              thinkingSignature: Type.TOptional<Type.TString>;
              redacted: Type.TOptional<Type.TBoolean>;
            }>,
            Type.TObject<{
              type: Type.TLiteral<"toolCall">;
              id: Type.TString;
              name: Type.TString;
              arguments: Type.TRecord<"^.*$", Type.TUnknown>;
              thoughtSignature: Type.TOptional<Type.TString>;
              executionMode: Type.TOptional<
                Type.TUnion<[Type.TLiteral<"sequential">, Type.TLiteral<"parallel">]>
              >;
            }>,
          ]
        >
      >;
      api: Type.TString;
      provider: Type.TString;
      model: Type.TString;
      responseModel: Type.TOptional<Type.TString>;
      responseId: Type.TOptional<Type.TString>;
      diagnostics: Type.TOptional<
        Type.TArray<
          Type.TObject<{
            type: Type.TString;
            timestamp: Type.TInteger;
            error: Type.TOptional<
              Type.TObject<{
                name: Type.TOptional<Type.TString>;
                message: Type.TString;
                stack: Type.TOptional<Type.TString>;
                code: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
              }>
            >;
            details: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
          }>
        >
      >;
      usage: Type.TObject<{
        input: Type.TNumber;
        output: Type.TNumber;
        cacheRead: Type.TNumber;
        cacheWrite: Type.TNumber;
        contextUsage: Type.TOptional<
          Type.TUnion<
            [
              Type.TObject<{
                state: Type.TLiteral<"available">;
                promptTokens: Type.TNumber;
                totalTokens: Type.TNumber;
              }>,
              Type.TObject<{
                state: Type.TLiteral<"unavailable">;
              }>,
            ]
          >
        >;
        totalTokens: Type.TNumber;
        cost: Type.TObject<{
          input: Type.TNumber;
          output: Type.TNumber;
          cacheRead: Type.TNumber;
          cacheWrite: Type.TNumber;
          total: Type.TNumber;
          totalOrigin: Type.TOptional<Type.TLiteral<"provider-billed">>;
        }>;
      }>;
      stopReason: Type.TUnion<
        [
          Type.TLiteral<"stop">,
          Type.TLiteral<"length">,
          Type.TLiteral<"toolUse">,
          Type.TLiteral<"error">,
          Type.TLiteral<"aborted">,
        ]
      >;
      errorMessage: Type.TOptional<Type.TString>;
      errorCode: Type.TOptional<Type.TString>;
      errorType: Type.TOptional<Type.TString>;
      errorBody: Type.TOptional<Type.TString>;
      timestamp: Type.TInteger;
    }>,
    Type.TObject<{
      role: Type.TLiteral<"toolResult">;
      toolCallId: Type.TString;
      toolName: Type.TString;
      content: Type.TArray<
        Type.TUnion<
          [
            Type.TObject<{
              type: Type.TLiteral<"text">;
              text: Type.TString;
              textSignature: Type.TOptional<Type.TString>;
            }>,
            Type.TObject<{
              type: Type.TLiteral<"image">;
              data: Type.TString;
              mimeType: Type.TString;
            }>,
          ]
        >
      >;
      details: Type.TOptional<Type.TUnknown>;
      isError: Type.TBoolean;
      timestamp: Type.TInteger;
    }>,
  ]
>;
declare const WorkerTranscriptCommitParamsSchema: Type.TObject<{
  runEpoch: Type.TInteger;
  seq: Type.TInteger;
  baseLeafId: Type.TUnion<[Type.TString, Type.TNull]>;
  messages: Type.TArray<
    Type.TUnion<
      [
        Type.TObject<{
          role: Type.TLiteral<"user">;
          content: Type.TArray<
            Type.TUnion<
              [
                Type.TObject<{
                  type: Type.TLiteral<"text">;
                  text: Type.TString;
                  textSignature: Type.TOptional<Type.TString>;
                }>,
                Type.TObject<{
                  type: Type.TLiteral<"image">;
                  data: Type.TString;
                  mimeType: Type.TString;
                }>,
              ]
            >
          >;
          timestamp: Type.TInteger;
        }>,
        Type.TObject<{
          role: Type.TLiteral<"assistant">;
          content: Type.TArray<
            Type.TUnion<
              [
                Type.TObject<{
                  type: Type.TLiteral<"text">;
                  text: Type.TString;
                  textSignature: Type.TOptional<Type.TString>;
                }>,
                Type.TObject<{
                  type: Type.TLiteral<"thinking">;
                  thinking: Type.TString;
                  thinkingSignature: Type.TOptional<Type.TString>;
                  redacted: Type.TOptional<Type.TBoolean>;
                }>,
                Type.TObject<{
                  type: Type.TLiteral<"toolCall">;
                  id: Type.TString;
                  name: Type.TString;
                  arguments: Type.TRecord<"^.*$", Type.TUnknown>;
                  thoughtSignature: Type.TOptional<Type.TString>;
                  executionMode: Type.TOptional<
                    Type.TUnion<[Type.TLiteral<"sequential">, Type.TLiteral<"parallel">]>
                  >;
                }>,
              ]
            >
          >;
          api: Type.TString;
          provider: Type.TString;
          model: Type.TString;
          responseModel: Type.TOptional<Type.TString>;
          responseId: Type.TOptional<Type.TString>;
          diagnostics: Type.TOptional<
            Type.TArray<
              Type.TObject<{
                type: Type.TString;
                timestamp: Type.TInteger;
                error: Type.TOptional<
                  Type.TObject<{
                    name: Type.TOptional<Type.TString>;
                    message: Type.TString;
                    stack: Type.TOptional<Type.TString>;
                    code: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
                  }>
                >;
                details: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
              }>
            >
          >;
          usage: Type.TObject<{
            input: Type.TNumber;
            output: Type.TNumber;
            cacheRead: Type.TNumber;
            cacheWrite: Type.TNumber;
            contextUsage: Type.TOptional<
              Type.TUnion<
                [
                  Type.TObject<{
                    state: Type.TLiteral<"available">;
                    promptTokens: Type.TNumber;
                    totalTokens: Type.TNumber;
                  }>,
                  Type.TObject<{
                    state: Type.TLiteral<"unavailable">;
                  }>,
                ]
              >
            >;
            totalTokens: Type.TNumber;
            cost: Type.TObject<{
              input: Type.TNumber;
              output: Type.TNumber;
              cacheRead: Type.TNumber;
              cacheWrite: Type.TNumber;
              total: Type.TNumber;
              totalOrigin: Type.TOptional<Type.TLiteral<"provider-billed">>;
            }>;
          }>;
          stopReason: Type.TUnion<
            [
              Type.TLiteral<"stop">,
              Type.TLiteral<"length">,
              Type.TLiteral<"toolUse">,
              Type.TLiteral<"error">,
              Type.TLiteral<"aborted">,
            ]
          >;
          errorMessage: Type.TOptional<Type.TString>;
          errorCode: Type.TOptional<Type.TString>;
          errorType: Type.TOptional<Type.TString>;
          errorBody: Type.TOptional<Type.TString>;
          timestamp: Type.TInteger;
        }>,
        Type.TObject<{
          role: Type.TLiteral<"toolResult">;
          toolCallId: Type.TString;
          toolName: Type.TString;
          content: Type.TArray<
            Type.TUnion<
              [
                Type.TObject<{
                  type: Type.TLiteral<"text">;
                  text: Type.TString;
                  textSignature: Type.TOptional<Type.TString>;
                }>,
                Type.TObject<{
                  type: Type.TLiteral<"image">;
                  data: Type.TString;
                  mimeType: Type.TString;
                }>,
              ]
            >
          >;
          details: Type.TOptional<Type.TUnknown>;
          isError: Type.TBoolean;
          timestamp: Type.TInteger;
        }>,
      ]
    >
  >;
}>;
declare const WorkerTranscriptCommitResultSchema: Type.TObject<{
  entryIds: Type.TArray<Type.TString>;
  newLeafId: Type.TString;
}>;
declare const WorkerTranscriptCommitErrorReasonSchema: Type.TUnion<
  [
    Type.TLiteral<"stale-base-leaf">,
    Type.TLiteral<"epoch-mismatch">,
    Type.TLiteral<"invalid-batch">,
    Type.TLiteral<"session-not-attached">,
  ]
>;
declare const WorkerTranscriptCommitErrorShapeSchema: Type.TObject<{
  code: Type.TLiteral<"INVALID_REQUEST">;
  message: Type.TString;
  details: Type.TObject<{
    reason: Type.TUnion<
      [
        Type.TLiteral<"stale-base-leaf">,
        Type.TLiteral<"epoch-mismatch">,
        Type.TLiteral<"invalid-batch">,
        Type.TLiteral<"session-not-attached">,
      ]
    >;
  }>;
}>;
declare const WorkerTranscriptCommitRequestFrameSchema: Type.TObject<{
  type: Type.TLiteral<"req">;
  id: Type.TString;
  method: Type.TLiteral<"worker.transcript.commit">;
  params: Type.TObject<{
    runEpoch: Type.TInteger;
    seq: Type.TInteger;
    baseLeafId: Type.TUnion<[Type.TString, Type.TNull]>;
    messages: Type.TArray<
      Type.TUnion<
        [
          Type.TObject<{
            role: Type.TLiteral<"user">;
            content: Type.TArray<
              Type.TUnion<
                [
                  Type.TObject<{
                    type: Type.TLiteral<"text">;
                    text: Type.TString;
                    textSignature: Type.TOptional<Type.TString>;
                  }>,
                  Type.TObject<{
                    type: Type.TLiteral<"image">;
                    data: Type.TString;
                    mimeType: Type.TString;
                  }>,
                ]
              >
            >;
            timestamp: Type.TInteger;
          }>,
          Type.TObject<{
            role: Type.TLiteral<"assistant">;
            content: Type.TArray<
              Type.TUnion<
                [
                  Type.TObject<{
                    type: Type.TLiteral<"text">;
                    text: Type.TString;
                    textSignature: Type.TOptional<Type.TString>;
                  }>,
                  Type.TObject<{
                    type: Type.TLiteral<"thinking">;
                    thinking: Type.TString;
                    thinkingSignature: Type.TOptional<Type.TString>;
                    redacted: Type.TOptional<Type.TBoolean>;
                  }>,
                  Type.TObject<{
                    type: Type.TLiteral<"toolCall">;
                    id: Type.TString;
                    name: Type.TString;
                    arguments: Type.TRecord<"^.*$", Type.TUnknown>;
                    thoughtSignature: Type.TOptional<Type.TString>;
                    executionMode: Type.TOptional<
                      Type.TUnion<[Type.TLiteral<"sequential">, Type.TLiteral<"parallel">]>
                    >;
                  }>,
                ]
              >
            >;
            api: Type.TString;
            provider: Type.TString;
            model: Type.TString;
            responseModel: Type.TOptional<Type.TString>;
            responseId: Type.TOptional<Type.TString>;
            diagnostics: Type.TOptional<
              Type.TArray<
                Type.TObject<{
                  type: Type.TString;
                  timestamp: Type.TInteger;
                  error: Type.TOptional<
                    Type.TObject<{
                      name: Type.TOptional<Type.TString>;
                      message: Type.TString;
                      stack: Type.TOptional<Type.TString>;
                      code: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
                    }>
                  >;
                  details: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
                }>
              >
            >;
            usage: Type.TObject<{
              input: Type.TNumber;
              output: Type.TNumber;
              cacheRead: Type.TNumber;
              cacheWrite: Type.TNumber;
              contextUsage: Type.TOptional<
                Type.TUnion<
                  [
                    Type.TObject<{
                      state: Type.TLiteral<"available">;
                      promptTokens: Type.TNumber;
                      totalTokens: Type.TNumber;
                    }>,
                    Type.TObject<{
                      state: Type.TLiteral<"unavailable">;
                    }>,
                  ]
                >
              >;
              totalTokens: Type.TNumber;
              cost: Type.TObject<{
                input: Type.TNumber;
                output: Type.TNumber;
                cacheRead: Type.TNumber;
                cacheWrite: Type.TNumber;
                total: Type.TNumber;
                totalOrigin: Type.TOptional<Type.TLiteral<"provider-billed">>;
              }>;
            }>;
            stopReason: Type.TUnion<
              [
                Type.TLiteral<"stop">,
                Type.TLiteral<"length">,
                Type.TLiteral<"toolUse">,
                Type.TLiteral<"error">,
                Type.TLiteral<"aborted">,
              ]
            >;
            errorMessage: Type.TOptional<Type.TString>;
            errorCode: Type.TOptional<Type.TString>;
            errorType: Type.TOptional<Type.TString>;
            errorBody: Type.TOptional<Type.TString>;
            timestamp: Type.TInteger;
          }>,
          Type.TObject<{
            role: Type.TLiteral<"toolResult">;
            toolCallId: Type.TString;
            toolName: Type.TString;
            content: Type.TArray<
              Type.TUnion<
                [
                  Type.TObject<{
                    type: Type.TLiteral<"text">;
                    text: Type.TString;
                    textSignature: Type.TOptional<Type.TString>;
                  }>,
                  Type.TObject<{
                    type: Type.TLiteral<"image">;
                    data: Type.TString;
                    mimeType: Type.TString;
                  }>,
                ]
              >
            >;
            details: Type.TOptional<Type.TUnknown>;
            isError: Type.TBoolean;
            timestamp: Type.TInteger;
          }>,
        ]
      >
    >;
  }>;
}>;
declare const WorkerTranscriptCommitResponseFrameSchema: Type.TUnion<
  [
    Type.TObject<{
      type: Type.TLiteral<"res">;
      id: Type.TString;
      ok: Type.TLiteral<true>;
      payload: Type.TObject<{
        entryIds: Type.TArray<Type.TString>;
        newLeafId: Type.TString;
      }>;
    }>,
    Type.TObject<{
      type: Type.TLiteral<"res">;
      id: Type.TString;
      ok: Type.TLiteral<false>;
      error: Type.TObject<{
        code: Type.TLiteral<"INVALID_REQUEST">;
        message: Type.TString;
        details: Type.TObject<{
          reason: Type.TUnion<
            [
              Type.TLiteral<"stale-base-leaf">,
              Type.TLiteral<"epoch-mismatch">,
              Type.TLiteral<"invalid-batch">,
              Type.TLiteral<"session-not-attached">,
            ]
          >;
        }>;
      }>;
    }>,
    Type.TObject<{
      type: Type.TLiteral<"res">;
      id: Type.TString;
      ok: Type.TLiteral<false>;
      error: Type.TObject<{
        code: Type.TUnion<[Type.TLiteral<"INVALID_REQUEST">, Type.TLiteral<"UNAVAILABLE">]>;
        message: Type.TString;
        details: Type.TObject<{
          reason: Type.TUnion<
            [
              Type.TUnion<
                [
                  Type.TLiteral<"invalid-credential">,
                  Type.TLiteral<"credential-expired">,
                  Type.TLiteral<"environment-mismatch">,
                  Type.TLiteral<"environment-unavailable">,
                  Type.TLiteral<"bundle-mismatch">,
                  Type.TLiteral<"version-mismatch">,
                  Type.TLiteral<"session-mismatch">,
                  Type.TLiteral<"placement-mismatch">,
                  Type.TLiteral<"owner-epoch-mismatch">,
                  Type.TLiteral<"rpc-set-mismatch">,
                  Type.TLiteral<"protocol-features-mismatch">,
                ]
              >,
              Type.TLiteral<"invalid-handshake">,
              Type.TLiteral<"protocol-mismatch">,
              Type.TLiteral<"gateway-unavailable">,
              Type.TLiteral<"invalid-frame">,
              Type.TLiteral<"slow-consumer">,
              Type.TLiteral<"method-not-allowed">,
              Type.TLiteral<"invalid-heartbeat">,
              Type.TLiteral<"credential-replaced">,
              Type.TLiteral<"gateway-shutdown">,
            ]
          >;
        }>;
        retryable: Type.TOptional<Type.TBoolean>;
        retryAfterMs: Type.TOptional<Type.TInteger>;
      }>;
    }>,
  ]
>;
declare const LiveIntegerSchema: Type.TInteger;
declare const LiveSequenceSchema: Type.TInteger;
declare const WorkerLiveEventSchema: Type.TUnion<
  [
    Type.TObject<{
      readonly kind: Type.TLiteral<"assistant">;
      readonly payload: Type.TObject<{
        readonly text: Type.TString;
        readonly delta: Type.TString;
        readonly replace: Type.TOptional<Type.TLiteral<true>>;
        readonly mediaUrls: Type.TOptional<Type.TArray<Type.TString>>;
        readonly phase: Type.TOptional<
          Type.TUnion<[Type.TLiteral<"commentary">, Type.TLiteral<"final_answer">]>
        >;
        readonly itemId: Type.TOptional<Type.TString>;
      }>;
    }>,
    Type.TObject<{
      readonly kind: Type.TLiteral<"thinking">;
      readonly payload: Type.TObject<{
        readonly text: Type.TString;
        readonly delta: Type.TString;
      }>;
    }>,
    Type.TObject<{
      readonly kind: Type.TLiteral<"tool">;
      readonly payload: Type.TUnion<
        [
          Type.TObject<{
            readonly phase: Type.TLiteral<"start">;
            readonly args: Type.TUnknown;
            readonly name: Type.TString;
            readonly toolCallId: Type.TString;
            readonly hideFromChannelProgress: Type.TOptional<Type.TLiteral<true>>;
          }>,
          Type.TObject<{
            readonly phase: Type.TLiteral<"update">;
            readonly partialResult: Type.TUnknown;
            readonly name: Type.TString;
            readonly toolCallId: Type.TString;
            readonly hideFromChannelProgress: Type.TOptional<Type.TLiteral<true>>;
          }>,
          Type.TObject<{
            readonly phase: Type.TLiteral<"result">;
            readonly meta: Type.TOptional<Type.TString>;
            readonly isError: Type.TBoolean;
            readonly result: Type.TUnknown;
            readonly toolErrorSummary: Type.TOptional<Type.TString>;
            readonly name: Type.TString;
            readonly toolCallId: Type.TString;
            readonly hideFromChannelProgress: Type.TOptional<Type.TLiteral<true>>;
          }>,
        ]
      >;
    }>,
    Type.TObject<{
      readonly kind: Type.TLiteral<"approval">;
      readonly payload: Type.TUnion<
        [
          Type.TObject<{
            readonly phase: Type.TLiteral<"requested">;
            readonly status: Type.TUnion<[Type.TLiteral<"pending">, Type.TLiteral<"unavailable">]>;
            readonly kind: Type.TUnion<
              [Type.TLiteral<"exec">, Type.TLiteral<"plugin">, Type.TLiteral<"unknown">]
            >;
            readonly title: Type.TString;
            readonly itemId: Type.TOptional<Type.TString>;
            readonly toolCallId: Type.TOptional<Type.TString>;
            readonly approvalId: Type.TOptional<Type.TString>;
            readonly approvalSlug: Type.TOptional<Type.TString>;
            readonly command: Type.TOptional<Type.TString>;
            readonly host: Type.TOptional<Type.TString>;
            readonly reason: Type.TOptional<Type.TString>;
            readonly scope: Type.TOptional<
              Type.TUnion<[Type.TLiteral<"turn">, Type.TLiteral<"session">]>
            >;
            readonly message: Type.TOptional<Type.TString>;
          }>,
          Type.TObject<{
            readonly phase: Type.TLiteral<"resolved">;
            readonly status: Type.TUnion<
              [Type.TLiteral<"approved">, Type.TLiteral<"denied">, Type.TLiteral<"failed">]
            >;
            readonly kind: Type.TUnion<
              [Type.TLiteral<"exec">, Type.TLiteral<"plugin">, Type.TLiteral<"unknown">]
            >;
            readonly title: Type.TString;
            readonly itemId: Type.TOptional<Type.TString>;
            readonly toolCallId: Type.TOptional<Type.TString>;
            readonly approvalId: Type.TOptional<Type.TString>;
            readonly approvalSlug: Type.TOptional<Type.TString>;
            readonly command: Type.TOptional<Type.TString>;
            readonly host: Type.TOptional<Type.TString>;
            readonly reason: Type.TOptional<Type.TString>;
            readonly scope: Type.TOptional<
              Type.TUnion<[Type.TLiteral<"turn">, Type.TLiteral<"session">]>
            >;
            readonly message: Type.TOptional<Type.TString>;
          }>,
        ]
      >;
    }>,
    Type.TObject<{
      readonly kind: Type.TLiteral<"lifecycle">;
      readonly payload: Type.TUnion<
        [
          Type.TObject<{
            readonly phase: Type.TLiteral<"start">;
            readonly startedAt: Type.TInteger;
          }>,
          Type.TObject<{
            readonly phase: Type.TLiteral<"fallback">;
            readonly reasonSummary: Type.TString;
            readonly attemptSummaries: Type.TArray<Type.TString>;
            readonly attempts: Type.TArray<
              Type.TObject<{
                readonly provider: Type.TString;
                readonly model: Type.TString;
                readonly error: Type.TString;
                readonly reason: Type.TOptional<
                  Type.TUnion<
                    [
                      Type.TLiteral<"auth">,
                      Type.TLiteral<"auth_permanent">,
                      Type.TLiteral<"format">,
                      Type.TLiteral<"rate_limit">,
                      Type.TLiteral<"overloaded">,
                      Type.TLiteral<"billing">,
                      Type.TLiteral<"server_error">,
                      Type.TLiteral<"timeout">,
                      Type.TLiteral<"context_overflow">,
                      Type.TLiteral<"model_not_found">,
                      Type.TLiteral<"session_expired">,
                      Type.TLiteral<"empty_response">,
                      Type.TLiteral<"no_error_details">,
                      Type.TLiteral<"unclassified">,
                      Type.TLiteral<"unknown">,
                    ]
                  >
                >;
                readonly authMode: Type.TOptional<Type.TString>;
                readonly status: Type.TOptional<Type.TInteger>;
                readonly code: Type.TOptional<Type.TString>;
              }>
            >;
            readonly selectedProvider: Type.TString;
            readonly selectedModel: Type.TString;
            readonly activeProvider: Type.TString;
            readonly activeModel: Type.TString;
          }>,
          Type.TObject<{
            readonly phase: Type.TLiteral<"fallback_cleared">;
            readonly previousActiveModel: Type.TOptional<Type.TString>;
            readonly selectedProvider: Type.TString;
            readonly selectedModel: Type.TString;
            readonly activeProvider: Type.TString;
            readonly activeModel: Type.TString;
          }>,
          Type.TObject<{
            readonly phase: Type.TLiteral<"fallback_step">;
            readonly fallbackStepType: Type.TLiteral<"fallback_step">;
            readonly fallbackStepFromModel: Type.TString;
            readonly fallbackStepToModel: Type.TOptional<Type.TString>;
            readonly fallbackStepFromFailureReason: Type.TOptional<
              Type.TUnion<
                [
                  Type.TLiteral<"auth">,
                  Type.TLiteral<"auth_permanent">,
                  Type.TLiteral<"format">,
                  Type.TLiteral<"rate_limit">,
                  Type.TLiteral<"overloaded">,
                  Type.TLiteral<"billing">,
                  Type.TLiteral<"server_error">,
                  Type.TLiteral<"timeout">,
                  Type.TLiteral<"context_overflow">,
                  Type.TLiteral<"model_not_found">,
                  Type.TLiteral<"session_expired">,
                  Type.TLiteral<"empty_response">,
                  Type.TLiteral<"no_error_details">,
                  Type.TLiteral<"unclassified">,
                  Type.TLiteral<"unknown">,
                ]
              >
            >;
            readonly fallbackStepFromFailureDetail: Type.TOptional<Type.TString>;
            readonly fallbackStepChainPosition: Type.TOptional<Type.TInteger>;
            readonly fallbackStepFinalOutcome: Type.TUnion<
              [
                Type.TLiteral<"next_fallback">,
                Type.TLiteral<"succeeded">,
                Type.TLiteral<"chain_exhausted">,
              ]
            >;
          }>,
          Type.TUnion<
            [
              Type.TObject<{
                readonly phase: Type.TLiteral<"finishing">;
                readonly error: Type.TOptional<Type.TString>;
                readonly startedAt: Type.TOptional<Type.TInteger>;
                readonly endedAt: Type.TInteger;
                readonly stopReason: Type.TOptional<Type.TString>;
                readonly yielded: Type.TOptional<Type.TLiteral<true>>;
                readonly timeoutPhase: Type.TOptional<
                  Type.TUnion<
                    [
                      Type.TLiteral<"queue">,
                      Type.TLiteral<"preflight">,
                      Type.TLiteral<"provider">,
                      Type.TLiteral<"post_turn">,
                      Type.TLiteral<"gateway_draining">,
                    ]
                  >
                >;
                readonly providerStarted: Type.TOptional<Type.TBoolean>;
                readonly aborted: Type.TOptional<Type.TBoolean>;
                readonly toolErrorSummary: Type.TOptional<Type.TString>;
                readonly livenessState: Type.TOptional<
                  Type.TUnion<
                    [
                      Type.TLiteral<"working">,
                      Type.TLiteral<"paused">,
                      Type.TLiteral<"blocked">,
                      Type.TLiteral<"abandoned">,
                    ]
                  >
                >;
                readonly replayInvalid: Type.TOptional<Type.TLiteral<true>>;
              }>,
              Type.TObject<{
                readonly phase: Type.TLiteral<"end">;
                readonly startedAt: Type.TOptional<Type.TInteger>;
                readonly endedAt: Type.TInteger;
                readonly stopReason: Type.TOptional<Type.TString>;
                readonly yielded: Type.TOptional<Type.TLiteral<true>>;
                readonly timeoutPhase: Type.TOptional<
                  Type.TUnion<
                    [
                      Type.TLiteral<"queue">,
                      Type.TLiteral<"preflight">,
                      Type.TLiteral<"provider">,
                      Type.TLiteral<"post_turn">,
                      Type.TLiteral<"gateway_draining">,
                    ]
                  >
                >;
                readonly providerStarted: Type.TOptional<Type.TBoolean>;
                readonly aborted: Type.TOptional<Type.TBoolean>;
                readonly toolErrorSummary: Type.TOptional<Type.TString>;
                readonly livenessState: Type.TOptional<
                  Type.TUnion<
                    [
                      Type.TLiteral<"working">,
                      Type.TLiteral<"paused">,
                      Type.TLiteral<"blocked">,
                      Type.TLiteral<"abandoned">,
                    ]
                  >
                >;
                readonly replayInvalid: Type.TOptional<Type.TLiteral<true>>;
              }>,
              Type.TObject<{
                readonly phase: Type.TLiteral<"error">;
                readonly error: Type.TString;
                readonly fallbackExhaustedFailure: Type.TOptional<Type.TLiteral<true>>;
                readonly startedAt: Type.TOptional<Type.TInteger>;
                readonly endedAt: Type.TInteger;
                readonly stopReason: Type.TOptional<Type.TString>;
                readonly yielded: Type.TOptional<Type.TLiteral<true>>;
                readonly timeoutPhase: Type.TOptional<
                  Type.TUnion<
                    [
                      Type.TLiteral<"queue">,
                      Type.TLiteral<"preflight">,
                      Type.TLiteral<"provider">,
                      Type.TLiteral<"post_turn">,
                      Type.TLiteral<"gateway_draining">,
                    ]
                  >
                >;
                readonly providerStarted: Type.TOptional<Type.TBoolean>;
                readonly aborted: Type.TOptional<Type.TBoolean>;
                readonly toolErrorSummary: Type.TOptional<Type.TString>;
                readonly livenessState: Type.TOptional<
                  Type.TUnion<
                    [
                      Type.TLiteral<"working">,
                      Type.TLiteral<"paused">,
                      Type.TLiteral<"blocked">,
                      Type.TLiteral<"abandoned">,
                    ]
                  >
                >;
                readonly replayInvalid: Type.TOptional<Type.TLiteral<true>>;
              }>,
            ]
          >,
        ]
      >;
    }>,
  ]
>;
declare const WorkerLiveEventParamsSchema: Type.TObject<{
  readonly runEpoch: typeof LiveIntegerSchema;
  readonly lastAckedSeq: typeof LiveIntegerSchema;
  readonly seq: typeof LiveSequenceSchema;
  readonly runId: typeof WorkerIdentifierSchema;
  readonly event: typeof WorkerLiveEventSchema;
}>;
declare const WorkerLiveEventResultSchema: Type.TObject<{
  readonly ackedSeq: Type.TInteger;
}>;
declare const WorkerLiveEventErrorDetailsSchema: Type.TUnion<
  [
    Type.TObject<{
      readonly reason: Type.TUnion<
        [
          Type.TLiteral<"epoch-mismatch">,
          Type.TLiteral<"session-not-attached">,
          Type.TLiteral<"invalid-event">,
          Type.TLiteral<"capacity-exceeded">,
        ]
      >;
    }>,
    Type.TObject<{
      readonly reason: Type.TLiteral<"resync-required">;
      readonly ackedSeq: Type.TInteger;
      readonly expectedSeq: Type.TInteger;
    }>,
  ]
>;
declare const WorkerLiveEventErrorShapeSchema: Type.TObject<{
  readonly code: Type.TLiteral<"INVALID_REQUEST">;
  readonly message: Type.TString;
  readonly details: Type.TUnion<
    [
      Type.TObject<{
        readonly reason: Type.TUnion<
          [
            Type.TLiteral<"epoch-mismatch">,
            Type.TLiteral<"session-not-attached">,
            Type.TLiteral<"invalid-event">,
            Type.TLiteral<"capacity-exceeded">,
          ]
        >;
      }>,
      Type.TObject<{
        readonly reason: Type.TLiteral<"resync-required">;
        readonly ackedSeq: Type.TInteger;
        readonly expectedSeq: Type.TInteger;
      }>,
    ]
  >;
}>;
declare const WorkerLiveEventRequestFrameSchema: Type.TObject<{
  readonly type: Type.TLiteral<"req">;
  readonly id: typeof WorkerFrameIdSchema;
  readonly method: Type.TLiteral<(typeof WORKER_PROTOCOL_METHODS)[2]>;
  readonly params: typeof WorkerLiveEventParamsSchema;
}>;
declare const WorkerLiveEventResponseFrameSchema: Type.TUnion<
  [
    Type.TObject<{
      readonly type: Type.TLiteral<"res">;
      readonly id: Type.TString;
      readonly ok: Type.TLiteral<true>;
      readonly payload: Type.TObject<{
        readonly ackedSeq: Type.TInteger;
      }>;
    }>,
    Type.TObject<{
      readonly type: Type.TLiteral<"res">;
      readonly id: Type.TString;
      readonly ok: Type.TLiteral<false>;
      readonly error: Type.TObject<{
        readonly code: Type.TLiteral<"INVALID_REQUEST">;
        readonly message: Type.TString;
        readonly details: Type.TUnion<
          [
            Type.TObject<{
              readonly reason: Type.TUnion<
                [
                  Type.TLiteral<"epoch-mismatch">,
                  Type.TLiteral<"session-not-attached">,
                  Type.TLiteral<"invalid-event">,
                  Type.TLiteral<"capacity-exceeded">,
                ]
              >;
            }>,
            Type.TObject<{
              readonly reason: Type.TLiteral<"resync-required">;
              readonly ackedSeq: Type.TInteger;
              readonly expectedSeq: Type.TInteger;
            }>,
          ]
        >;
      }>;
    }>,
    Type.TObject<{
      type: Type.TLiteral<"res">;
      id: Type.TString;
      ok: Type.TLiteral<false>;
      error: Type.TObject<{
        code: Type.TUnion<[Type.TLiteral<"INVALID_REQUEST">, Type.TLiteral<"UNAVAILABLE">]>;
        message: Type.TString;
        details: Type.TObject<{
          reason: Type.TUnion<
            [
              Type.TUnion<
                [
                  Type.TLiteral<"invalid-credential">,
                  Type.TLiteral<"credential-expired">,
                  Type.TLiteral<"environment-mismatch">,
                  Type.TLiteral<"environment-unavailable">,
                  Type.TLiteral<"bundle-mismatch">,
                  Type.TLiteral<"version-mismatch">,
                  Type.TLiteral<"session-mismatch">,
                  Type.TLiteral<"placement-mismatch">,
                  Type.TLiteral<"owner-epoch-mismatch">,
                  Type.TLiteral<"rpc-set-mismatch">,
                  Type.TLiteral<"protocol-features-mismatch">,
                ]
              >,
              Type.TLiteral<"invalid-handshake">,
              Type.TLiteral<"protocol-mismatch">,
              Type.TLiteral<"gateway-unavailable">,
              Type.TLiteral<"invalid-frame">,
              Type.TLiteral<"slow-consumer">,
              Type.TLiteral<"method-not-allowed">,
              Type.TLiteral<"invalid-heartbeat">,
              Type.TLiteral<"credential-replaced">,
              Type.TLiteral<"gateway-shutdown">,
            ]
          >;
        }>;
        retryable: Type.TOptional<Type.TBoolean>;
        retryAfterMs: Type.TOptional<Type.TInteger>;
      }>;
    }>,
  ]
>;
type WorkerAdmissionHandshake = Static<typeof WorkerAdmissionHandshakeSchema>;
type WorkerConnectParams = Static<typeof WorkerConnectParamsSchema>;
type WorkerConnectRequestFrame = Static<typeof WorkerConnectRequestFrameSchema>;
type WorkerAdmissionFailureReason = Static<typeof WorkerAdmissionFailureReasonSchema>;
type WorkerProtocolCloseReason = Static<typeof WorkerProtocolCloseReasonSchema>;
type WorkerErrorShape = Static<typeof WorkerErrorShapeSchema>;
type WorkerHelloOk = Static<typeof WorkerHelloOkSchema>;
type WorkerAdmissionResponseFrame = Static<typeof WorkerAdmissionResponseFrameSchema>;
type WorkerHeartbeatParams = Static<typeof WorkerHeartbeatParamsSchema>;
type WorkerHeartbeatResult = Static<typeof WorkerHeartbeatResultSchema>;
type WorkerHeartbeatRequestFrame = Static<typeof WorkerHeartbeatRequestFrameSchema>;
type WorkerHeartbeatResponseFrame = Static<typeof WorkerHeartbeatResponseFrameSchema>;
type WorkerTranscriptMessage = Static<typeof WorkerTranscriptMessageSchema>;
type WorkerTranscriptCommitParams = Static<typeof WorkerTranscriptCommitParamsSchema>;
type WorkerTranscriptCommitResult = Static<typeof WorkerTranscriptCommitResultSchema>;
type WorkerTranscriptCommitErrorReason = Static<typeof WorkerTranscriptCommitErrorReasonSchema>;
type WorkerTranscriptCommitErrorShape = Static<typeof WorkerTranscriptCommitErrorShapeSchema>;
type WorkerTranscriptCommitRequestFrame = Static<typeof WorkerTranscriptCommitRequestFrameSchema>;
type WorkerTranscriptCommitResponseFrame = Static<typeof WorkerTranscriptCommitResponseFrameSchema>;
type WorkerLiveEvent = Static<typeof WorkerLiveEventSchema>;
type WorkerLiveEventParams = Static<typeof WorkerLiveEventParamsSchema>;
type WorkerLiveEventResult = Static<typeof WorkerLiveEventResultSchema>;
type WorkerLiveEventErrorDetails = Static<typeof WorkerLiveEventErrorDetailsSchema>;
type WorkerLiveEventErrorShape = Static<typeof WorkerLiveEventErrorShapeSchema>;
type WorkerLiveEventRequestFrame = Static<typeof WorkerLiveEventRequestFrameSchema>;
type WorkerLiveEventResponseFrame = Static<typeof WorkerLiveEventResponseFrameSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/worker-inference.d.ts
declare const WORKER_INFERENCE_PROTOCOL_FEATURE = "worker-inference-v1";
declare const WORKER_INFERENCE_METHODS: readonly [
  "worker.inference.start",
  "worker.inference.cancel",
];
declare const WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES: number;
declare const WORKER_INFERENCE_MAX_CONTEXT_MESSAGES = 1024;
declare const WORKER_INFERENCE_MAX_TOOLS = 256;
declare const WORKER_INFERENCE_MAX_OUTPUT_TOKENS = 1000000;
declare const WorkerInferenceModelRefSchema: TSchema;
declare const WorkerInferenceContextSchema: TSchema;
declare const WorkerInferenceOptionsSchema: TSchema;
declare const WorkerInferenceStartParamsSchema: TSchema;
declare const WorkerInferenceStartResultSchema: TSchema;
declare const WorkerInferenceErrorReasonSchema: TSchema;
declare const WorkerInferenceErrorShapeSchema: TSchema;
declare const WorkerInferenceStartRequestFrameSchema: TSchema;
declare const WorkerInferenceStartResponseFrameSchema: TSchema;
declare const WorkerInferenceCancelParamsSchema: TSchema;
declare const WorkerInferenceCancelResultSchema: TSchema;
declare const WorkerInferenceCancelRequestFrameSchema: TSchema;
declare const WorkerInferenceCancelResponseFrameSchema: TSchema;
declare const WorkerInferenceResolvedModelSchema: TSchema;
declare const WorkerInferenceEventParamsSchema: TSchema;
declare const WorkerInferenceEventFrameSchema: TSchema;
declare const WorkerInferenceTerminalOutcomeSchema: TSchema;
declare const WorkerInferenceTerminalParamsSchema: TSchema;
declare const WorkerInferenceTerminalFrameSchema: TSchema;
type WorkerInferenceUserMessage = Omit<
  Extract<
    WorkerTranscriptMessage,
    {
      role: "user";
    }
  >,
  "content"
> & {
  content:
    | string
    | Extract<
        WorkerTranscriptMessage,
        {
          role: "user";
        }
      >["content"];
  runtimeContextCarrier?: boolean;
};
type WorkerInferenceContextMessage =
  | WorkerInferenceUserMessage
  | Extract<
      WorkerTranscriptMessage,
      {
        role: "assistant" | "toolResult";
      }
    >;
type WorkerInferenceTool = {
  name: string;
  description: string;
  parameters: unknown;
};
type WorkerInferenceIdentity = {
  runEpoch: number;
  sessionId: string;
  runId: string;
  turnId: string;
};
type WorkerInferenceThinkingBudgets = {
  minimal?: number;
  low?: number;
  medium?: number;
  high?: number;
  max?: number;
};
type WorkerInferenceUsage = Extract<
  WorkerTranscriptMessage,
  {
    role: "assistant";
  }
>["usage"];
type WorkerInferenceAssistantMessage = Omit<
  Extract<
    WorkerTranscriptMessage,
    {
      role: "assistant";
    }
  >,
  "diagnostics" | "stopReason" | "errorMessage" | "errorCode" | "errorType" | "errorBody"
> & {
  stopReason: "stop" | "length" | "toolUse";
};
type WorkerInferenceModelRef = {
  provider: string;
  model: string;
};
type WorkerInferenceContext = {
  systemPrompt?: string;
  messages: WorkerInferenceContextMessage[];
  tools?: WorkerInferenceTool[];
};
type WorkerInferenceOptions = {
  temperature?: number;
  maxTokens?: number;
  reasoning?: "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "adaptive" | "max";
  thinkingBudgets?: WorkerInferenceThinkingBudgets;
};
type WorkerInferenceStartParams = WorkerInferenceIdentity & {
  modelRef: WorkerInferenceModelRef;
  context: WorkerInferenceContext;
  options: WorkerInferenceOptions;
};
type WorkerInferenceStartResult = {
  status: "accepted" | "replayed";
};
type WorkerInferenceErrorReason =
  | "model-not-approved"
  | "invalid-context"
  | "epoch-mismatch"
  | "session-not-attached"
  | "provider-error"
  | "cancelled";
type WorkerInferenceErrorShape = {
  code: "INVALID_REQUEST" | "UNAVAILABLE";
  message: string;
  details: {
    reason: WorkerInferenceErrorReason;
  };
};
type WorkerInferenceStartRequestFrame = {
  type: "req";
  id: string;
  method: "worker.inference.start";
  params: WorkerInferenceStartParams;
};
type WorkerInferenceResponseErrorFrame = {
  type: "res";
  id: string;
  ok: false;
  error: WorkerInferenceErrorShape | WorkerErrorShape;
};
type WorkerInferenceStartResponseFrame =
  | {
      type: "res";
      id: string;
      ok: true;
      payload: WorkerInferenceStartResult;
    }
  | WorkerInferenceResponseErrorFrame;
type WorkerInferenceCancelParams = WorkerInferenceIdentity;
type WorkerInferenceCancelResult = {
  status: "cancelled";
};
type WorkerInferenceCancelRequestFrame = {
  type: "req";
  id: string;
  method: "worker.inference.cancel";
  params: WorkerInferenceCancelParams;
};
type WorkerInferenceCancelResponseFrame =
  | {
      type: "res";
      id: string;
      ok: true;
      payload: WorkerInferenceCancelResult;
    }
  | WorkerInferenceResponseErrorFrame;
type WorkerInferenceResolvedModel = {
  api: string;
  provider: string;
  model: string;
};
type WorkerInferenceStreamEvent =
  | {
      type: "start";
      resolvedModel: WorkerInferenceResolvedModel;
      timestamp: number;
    }
  | {
      type: "text_start";
      contentIndex: number;
      contentSignature?: string;
    }
  | {
      type: "text_delta";
      contentIndex: number;
      delta: string;
    }
  | {
      type: "text_end";
      contentIndex: number;
      contentSignature?: string;
    }
  | {
      type: "thinking_start";
      contentIndex: number;
    }
  | {
      type: "thinking_delta";
      contentIndex: number;
      delta: string;
    }
  | {
      type: "thinking_end";
      contentIndex: number;
      contentSignature?: string;
    }
  | {
      type: "toolcall_start";
      contentIndex: number;
      id: string;
      toolName: string;
    }
  | {
      type: "toolcall_delta";
      contentIndex: number;
      delta: string;
    }
  | {
      type: "toolcall_end";
      contentIndex: number;
    };
type WorkerInferenceEventParams = WorkerInferenceIdentity & {
  seq: number;
  event: WorkerInferenceStreamEvent;
};
type WorkerInferenceEventFrame = {
  type: "event";
  event: "worker.inference.event";
  payload: WorkerInferenceEventParams;
};
type WorkerInferenceTerminalOutcome =
  | {
      type: "done";
      message: WorkerInferenceAssistantMessage;
    }
  | {
      type: "error";
      reason: WorkerInferenceErrorReason;
      message: string;
      usage?: WorkerInferenceUsage;
    };
type WorkerInferenceTerminalParams = WorkerInferenceIdentity & {
  seq: number;
  outcome: WorkerInferenceTerminalOutcome;
};
type WorkerInferenceTerminalFrame = {
  type: "event";
  event: "worker.inference.terminal";
  payload: WorkerInferenceTerminalParams;
};
declare function validateWorkerInferenceStartParams(
  data: unknown,
): data is WorkerInferenceStartParams;
declare function validateWorkerInferenceCancelParams(
  data: unknown,
): data is WorkerInferenceCancelParams;
declare function validateWorkerInferenceTerminalOutcome(
  data: unknown,
): data is WorkerInferenceTerminalOutcome;
declare function validateWorkerInferenceEventFrame(
  data: unknown,
): data is WorkerInferenceEventFrame;
declare function validateWorkerInferenceTerminalFrame(
  data: unknown,
): data is WorkerInferenceTerminalFrame;
//#endregion
//#region packages/gateway-protocol/src/schema/skill-history.d.ts
declare const SkillsProposalHistoryStatusParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
}>;
declare const SkillsProposalHistoryScanParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  direction: Type.TOptional<Type.TUnion<[Type.TLiteral<"older">, Type.TLiteral<"newer">]>>;
}>;
declare const SkillsProposalHistoryScanResultSchema: Type.TObject<{
  schema: Type.TLiteral<"openclaw.skill-workshop.history-scan.v1">;
  hasScanned: Type.TBoolean;
  reviewedSessions: Type.TInteger;
  ideasFound: Type.TInteger;
  hasMore: Type.TBoolean;
  lastScanReviewed: Type.TInteger;
  lastScanIdeas: Type.TInteger;
  lastScanAt: Type.TOptional<Type.TString>;
  oldestReviewedAt: Type.TOptional<Type.TString>;
  newestReviewedAt: Type.TOptional<Type.TString>;
}>;
type SkillsProposalHistoryStatusParams = Static<typeof SkillsProposalHistoryStatusParamsSchema>;
type SkillsProposalHistoryScanParams = Static<typeof SkillsProposalHistoryScanParamsSchema>;
type SkillsProposalHistoryScanResult = Static<typeof SkillsProposalHistoryScanResultSchema>;
declare const validateSkillsProposalHistoryStatusParams: ProtocolValidator<{
  agentId?: string | undefined;
}>;
declare const validateSkillsProposalHistoryScanParams: ProtocolValidator<{
  agentId?: string | undefined;
  direction?: "older" | "newer" | undefined;
}>;
//#endregion
//#region packages/gateway-protocol/src/schema/migrations.d.ts
declare const MAX_MEMORY_MIGRATION_ITEMS = 2000;
declare const MemoryMigrationItemStatusSchema: Type.TUnion<
  [
    Type.TLiteral<"planned">,
    Type.TLiteral<"migrated">,
    Type.TLiteral<"skipped">,
    Type.TLiteral<"warning">,
    Type.TLiteral<"conflict">,
    Type.TLiteral<"error">,
  ]
>;
declare const MemoryMigrationItemSchema: Type.TObject<{
  id: Type.TString;
  status: Type.TUnion<
    [
      Type.TLiteral<"planned">,
      Type.TLiteral<"migrated">,
      Type.TLiteral<"skipped">,
      Type.TLiteral<"warning">,
      Type.TLiteral<"conflict">,
      Type.TLiteral<"error">,
    ]
  >;
  source: Type.TOptional<Type.TString>;
  target: Type.TOptional<Type.TString>;
  message: Type.TOptional<Type.TString>;
  reason: Type.TOptional<Type.TString>;
  details: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
}>;
declare const MemoryMigrationSummarySchema: Type.TObject<{
  total: Type.TInteger;
  planned: Type.TInteger;
  migrated: Type.TInteger;
  skipped: Type.TInteger;
  conflicts: Type.TInteger;
  errors: Type.TInteger;
  sensitive: Type.TInteger;
}>;
declare const MemoryMigrationProviderPlanSchema: Type.TObject<{
  providerId: Type.TString;
  label: Type.TString;
  description: Type.TOptional<Type.TString>;
  planFingerprint: Type.TOptional<Type.TString>;
  found: Type.TBoolean;
  source: Type.TOptional<Type.TString>;
  target: Type.TOptional<Type.TString>;
  confidence: Type.TOptional<
    Type.TUnion<[Type.TLiteral<"low">, Type.TLiteral<"medium">, Type.TLiteral<"high">]>
  >;
  message: Type.TOptional<Type.TString>;
  error: Type.TOptional<Type.TString>;
  summary: Type.TObject<{
    total: Type.TInteger;
    planned: Type.TInteger;
    migrated: Type.TInteger;
    skipped: Type.TInteger;
    conflicts: Type.TInteger;
    errors: Type.TInteger;
    sensitive: Type.TInteger;
  }>;
  items: Type.TArray<
    Type.TObject<{
      id: Type.TString;
      status: Type.TUnion<
        [
          Type.TLiteral<"planned">,
          Type.TLiteral<"migrated">,
          Type.TLiteral<"skipped">,
          Type.TLiteral<"warning">,
          Type.TLiteral<"conflict">,
          Type.TLiteral<"error">,
        ]
      >;
      source: Type.TOptional<Type.TString>;
      target: Type.TOptional<Type.TString>;
      message: Type.TOptional<Type.TString>;
      reason: Type.TOptional<Type.TString>;
      details: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
    }>
  >;
  warnings: Type.TOptional<Type.TArray<Type.TString>>;
}>;
declare const MigrationsMemoryPlanParamsSchema: Type.TObject<{
  agentId: Type.TString;
  overwrite: Type.TOptional<Type.TBoolean>;
}>;
declare const MigrationsMemoryPlanResultSchema: Type.TObject<{
  agentId: Type.TString;
  workspace: Type.TString;
  providers: Type.TArray<
    Type.TObject<{
      providerId: Type.TString;
      label: Type.TString;
      description: Type.TOptional<Type.TString>;
      planFingerprint: Type.TOptional<Type.TString>;
      found: Type.TBoolean;
      source: Type.TOptional<Type.TString>;
      target: Type.TOptional<Type.TString>;
      confidence: Type.TOptional<
        Type.TUnion<[Type.TLiteral<"low">, Type.TLiteral<"medium">, Type.TLiteral<"high">]>
      >;
      message: Type.TOptional<Type.TString>;
      error: Type.TOptional<Type.TString>;
      summary: Type.TObject<{
        total: Type.TInteger;
        planned: Type.TInteger;
        migrated: Type.TInteger;
        skipped: Type.TInteger;
        conflicts: Type.TInteger;
        errors: Type.TInteger;
        sensitive: Type.TInteger;
      }>;
      items: Type.TArray<
        Type.TObject<{
          id: Type.TString;
          status: Type.TUnion<
            [
              Type.TLiteral<"planned">,
              Type.TLiteral<"migrated">,
              Type.TLiteral<"skipped">,
              Type.TLiteral<"warning">,
              Type.TLiteral<"conflict">,
              Type.TLiteral<"error">,
            ]
          >;
          source: Type.TOptional<Type.TString>;
          target: Type.TOptional<Type.TString>;
          message: Type.TOptional<Type.TString>;
          reason: Type.TOptional<Type.TString>;
          details: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
        }>
      >;
      warnings: Type.TOptional<Type.TArray<Type.TString>>;
    }>
  >;
}>;
declare const MigrationsMemoryApplyParamsSchema: Type.TObject<{
  idempotencyKey: Type.TString;
  agentId: Type.TString;
  providerId: Type.TString;
  planFingerprint: Type.TString;
  itemIds: Type.TArray<Type.TString>;
  overwrite: Type.TOptional<Type.TBoolean>;
}>;
declare const MigrationsMemoryApplyResultSchema: Type.TObject<{
  providerId: Type.TString;
  source: Type.TString;
  target: Type.TOptional<Type.TString>;
  summary: Type.TObject<{
    total: Type.TInteger;
    planned: Type.TInteger;
    migrated: Type.TInteger;
    skipped: Type.TInteger;
    conflicts: Type.TInteger;
    errors: Type.TInteger;
    sensitive: Type.TInteger;
  }>;
  items: Type.TArray<
    Type.TObject<{
      id: Type.TString;
      status: Type.TUnion<
        [
          Type.TLiteral<"planned">,
          Type.TLiteral<"migrated">,
          Type.TLiteral<"skipped">,
          Type.TLiteral<"warning">,
          Type.TLiteral<"conflict">,
          Type.TLiteral<"error">,
        ]
      >;
      source: Type.TOptional<Type.TString>;
      target: Type.TOptional<Type.TString>;
      message: Type.TOptional<Type.TString>;
      reason: Type.TOptional<Type.TString>;
      details: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
    }>
  >;
  warnings: Type.TOptional<Type.TArray<Type.TString>>;
  backupPath: Type.TOptional<Type.TString>;
  reportDir: Type.TOptional<Type.TString>;
}>;
declare const MigrationProtocolSchemas: {
  readonly MemoryMigrationItemStatus: Type.TUnion<
    [
      Type.TLiteral<"planned">,
      Type.TLiteral<"migrated">,
      Type.TLiteral<"skipped">,
      Type.TLiteral<"warning">,
      Type.TLiteral<"conflict">,
      Type.TLiteral<"error">,
    ]
  >;
  readonly MemoryMigrationItem: Type.TObject<{
    id: Type.TString;
    status: Type.TUnion<
      [
        Type.TLiteral<"planned">,
        Type.TLiteral<"migrated">,
        Type.TLiteral<"skipped">,
        Type.TLiteral<"warning">,
        Type.TLiteral<"conflict">,
        Type.TLiteral<"error">,
      ]
    >;
    source: Type.TOptional<Type.TString>;
    target: Type.TOptional<Type.TString>;
    message: Type.TOptional<Type.TString>;
    reason: Type.TOptional<Type.TString>;
    details: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
  }>;
  readonly MemoryMigrationSummary: Type.TObject<{
    total: Type.TInteger;
    planned: Type.TInteger;
    migrated: Type.TInteger;
    skipped: Type.TInteger;
    conflicts: Type.TInteger;
    errors: Type.TInteger;
    sensitive: Type.TInteger;
  }>;
  readonly MemoryMigrationProviderPlan: Type.TObject<{
    providerId: Type.TString;
    label: Type.TString;
    description: Type.TOptional<Type.TString>;
    planFingerprint: Type.TOptional<Type.TString>;
    found: Type.TBoolean;
    source: Type.TOptional<Type.TString>;
    target: Type.TOptional<Type.TString>;
    confidence: Type.TOptional<
      Type.TUnion<[Type.TLiteral<"low">, Type.TLiteral<"medium">, Type.TLiteral<"high">]>
    >;
    message: Type.TOptional<Type.TString>;
    error: Type.TOptional<Type.TString>;
    summary: Type.TObject<{
      total: Type.TInteger;
      planned: Type.TInteger;
      migrated: Type.TInteger;
      skipped: Type.TInteger;
      conflicts: Type.TInteger;
      errors: Type.TInteger;
      sensitive: Type.TInteger;
    }>;
    items: Type.TArray<
      Type.TObject<{
        id: Type.TString;
        status: Type.TUnion<
          [
            Type.TLiteral<"planned">,
            Type.TLiteral<"migrated">,
            Type.TLiteral<"skipped">,
            Type.TLiteral<"warning">,
            Type.TLiteral<"conflict">,
            Type.TLiteral<"error">,
          ]
        >;
        source: Type.TOptional<Type.TString>;
        target: Type.TOptional<Type.TString>;
        message: Type.TOptional<Type.TString>;
        reason: Type.TOptional<Type.TString>;
        details: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
      }>
    >;
    warnings: Type.TOptional<Type.TArray<Type.TString>>;
  }>;
  readonly MigrationsMemoryPlanParams: Type.TObject<{
    agentId: Type.TString;
    overwrite: Type.TOptional<Type.TBoolean>;
  }>;
  readonly MigrationsMemoryPlanResult: Type.TObject<{
    agentId: Type.TString;
    workspace: Type.TString;
    providers: Type.TArray<
      Type.TObject<{
        providerId: Type.TString;
        label: Type.TString;
        description: Type.TOptional<Type.TString>;
        planFingerprint: Type.TOptional<Type.TString>;
        found: Type.TBoolean;
        source: Type.TOptional<Type.TString>;
        target: Type.TOptional<Type.TString>;
        confidence: Type.TOptional<
          Type.TUnion<[Type.TLiteral<"low">, Type.TLiteral<"medium">, Type.TLiteral<"high">]>
        >;
        message: Type.TOptional<Type.TString>;
        error: Type.TOptional<Type.TString>;
        summary: Type.TObject<{
          total: Type.TInteger;
          planned: Type.TInteger;
          migrated: Type.TInteger;
          skipped: Type.TInteger;
          conflicts: Type.TInteger;
          errors: Type.TInteger;
          sensitive: Type.TInteger;
        }>;
        items: Type.TArray<
          Type.TObject<{
            id: Type.TString;
            status: Type.TUnion<
              [
                Type.TLiteral<"planned">,
                Type.TLiteral<"migrated">,
                Type.TLiteral<"skipped">,
                Type.TLiteral<"warning">,
                Type.TLiteral<"conflict">,
                Type.TLiteral<"error">,
              ]
            >;
            source: Type.TOptional<Type.TString>;
            target: Type.TOptional<Type.TString>;
            message: Type.TOptional<Type.TString>;
            reason: Type.TOptional<Type.TString>;
            details: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
          }>
        >;
        warnings: Type.TOptional<Type.TArray<Type.TString>>;
      }>
    >;
  }>;
  readonly MigrationsMemoryApplyParams: Type.TObject<{
    idempotencyKey: Type.TString;
    agentId: Type.TString;
    providerId: Type.TString;
    planFingerprint: Type.TString;
    itemIds: Type.TArray<Type.TString>;
    overwrite: Type.TOptional<Type.TBoolean>;
  }>;
  readonly MigrationsMemoryApplyResult: Type.TObject<{
    providerId: Type.TString;
    source: Type.TString;
    target: Type.TOptional<Type.TString>;
    summary: Type.TObject<{
      total: Type.TInteger;
      planned: Type.TInteger;
      migrated: Type.TInteger;
      skipped: Type.TInteger;
      conflicts: Type.TInteger;
      errors: Type.TInteger;
      sensitive: Type.TInteger;
    }>;
    items: Type.TArray<
      Type.TObject<{
        id: Type.TString;
        status: Type.TUnion<
          [
            Type.TLiteral<"planned">,
            Type.TLiteral<"migrated">,
            Type.TLiteral<"skipped">,
            Type.TLiteral<"warning">,
            Type.TLiteral<"conflict">,
            Type.TLiteral<"error">,
          ]
        >;
        source: Type.TOptional<Type.TString>;
        target: Type.TOptional<Type.TString>;
        message: Type.TOptional<Type.TString>;
        reason: Type.TOptional<Type.TString>;
        details: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
      }>
    >;
    warnings: Type.TOptional<Type.TArray<Type.TString>>;
    backupPath: Type.TOptional<Type.TString>;
    reportDir: Type.TOptional<Type.TString>;
  }>;
};
type MemoryMigrationItemStatus = Static<typeof MemoryMigrationItemStatusSchema>;
type MemoryMigrationItem = Static<typeof MemoryMigrationItemSchema>;
type MemoryMigrationProviderPlan = Static<typeof MemoryMigrationProviderPlanSchema>;
type MigrationsMemoryPlanParams = Static<typeof MigrationsMemoryPlanParamsSchema>;
type MigrationsMemoryPlanResult = Static<typeof MigrationsMemoryPlanResultSchema>;
type MigrationsMemoryApplyParams = Static<typeof MigrationsMemoryApplyParamsSchema>;
type MigrationsMemoryApplyResult = Static<typeof MigrationsMemoryApplyResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/migration-api.d.ts
declare const validateMigrationsMemoryPlanParams: ProtocolValidator<{
  overwrite?: boolean | undefined;
  agentId: string;
}>;
declare const validateMigrationsMemoryApplyParams: ProtocolValidator<{
  overwrite?: boolean | undefined;
  agentId: string;
  idempotencyKey: string;
  providerId: string;
  planFingerprint: string;
  itemIds: string[];
}>;
//#endregion
//#region packages/gateway-protocol/src/schema/agent.d.ts
/** Stream event emitted by the agent runtime over the gateway protocol. */
declare const AgentEventSchema: Type.TObject<{
  runId: Type.TString;
  seq: Type.TInteger;
  stream: Type.TString;
  ts: Type.TInteger;
  spawnedBy: Type.TOptional<Type.TString>;
  isHeartbeat: Type.TOptional<Type.TBoolean>;
  data: Type.TRecord<"^.*$", Type.TUnknown>;
}>;
/** Request to execute a channel message action through a configured adapter. */
declare const MessageActionParamsSchema: Type.TObject<{
  channel: Type.TString;
  action: Type.TString;
  params: Type.TRecord<"^.*$", Type.TUnknown>;
  accountId: Type.TOptional<Type.TString>;
  requesterAccountId: Type.TOptional<Type.TString>;
  requesterSenderId: Type.TOptional<Type.TString>;
  senderIsOwner: Type.TOptional<Type.TBoolean>;
  sessionKey: Type.TOptional<Type.TString>;
  sessionId: Type.TOptional<Type.TString>;
  inboundTurnKind: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
  toolContext: Type.TOptional<
    Type.TObject<{
      currentChannelId: Type.TOptional<Type.TString>;
      currentMessagingTarget: Type.TOptional<Type.TString>;
      currentGraphChannelId: Type.TOptional<Type.TString>;
      currentChannelProvider: Type.TOptional<Type.TString>;
      currentThreadTs: Type.TOptional<Type.TString>;
      currentMessageId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
      replyToMode: Type.TOptional<
        Type.TUnion<
          [
            Type.TLiteral<"off">,
            Type.TLiteral<"first">,
            Type.TLiteral<"all">,
            Type.TLiteral<"batched">,
          ]
        >
      >;
      hasRepliedRef: Type.TOptional<
        Type.TObject<{
          value: Type.TBoolean;
        }>
      >;
      sameChannelThreadRequired: Type.TOptional<Type.TBoolean>;
      skipCrossContextDecoration: Type.TOptional<Type.TBoolean>;
    }>
  >;
  /**
   * Explicit operation-local marker for an authenticated direct operator.
   * Missing values remain delegated, and agent runtime identity wins server-side.
   */
  conversationReadOrigin: Type.TOptional<Type.TLiteral<"direct-operator">>;
  idempotencyKey: Type.TString;
}>;
/** Outbound send request shared by channel adapters. */
declare const SendParamsSchema: Type.TObject<{
  to: Type.TString;
  message: Type.TOptional<Type.TString>;
  mediaUrl: Type.TOptional<Type.TString>;
  mediaUrls: Type.TOptional<
    Type.TArray<Type.TString>
  > /** Base64 attachment payload for gateway-local media materialization. */;
  buffer: Type.TOptional<Type.TString> /** Optional filename for a base64 attachment payload. */;
  filename: Type.TOptional<Type.TString> /** Optional MIME type for a base64 attachment payload. */;
  contentType: Type.TOptional<Type.TString>;
  asVoice: Type.TOptional<Type.TBoolean>;
  gifPlayback: Type.TOptional<Type.TBoolean>;
  channel: Type.TOptional<Type.TString>;
  accountId: Type.TOptional<Type.TString> /** Optional agent id for per-agent media root resolution on gateway sends. */;
  agentId: Type.TOptional<Type.TString> /** Reply target message id for native quoted/threaded sends where supported. */;
  replyToId: Type.TOptional<Type.TString> /** Thread id (channel-specific meaning, e.g. Telegram forum topic id). */;
  threadId: Type.TOptional<Type.TString> /** Force document-style media sends where supported. */;
  forceDocument: Type.TOptional<Type.TBoolean> /** Send silently (no notification) where supported. */;
  silent: Type.TOptional<Type.TBoolean> /** Channel-specific parse mode for formatted text. */;
  parseMode: Type.TOptional<
    Type.TLiteral<"HTML">
  > /** Optional session key for mirroring delivered output back into the transcript. */;
  sessionKey: Type.TOptional<Type.TString>;
  idempotencyKey: Type.TString;
}>;
/** Poll creation request for adapters that support native polls. */
declare const PollParamsSchema: Type.TObject<{
  to: Type.TString;
  question: Type.TString;
  options: Type.TArray<Type.TString>;
  maxSelections: Type.TOptional<Type.TInteger> /** Poll duration in seconds (channel-specific limits may apply). */;
  durationSeconds: Type.TOptional<Type.TInteger>;
  durationHours: Type.TOptional<Type.TInteger> /** Send silently (no notification) where supported. */;
  silent: Type.TOptional<Type.TBoolean> /** Poll anonymity where supported (e.g. Telegram polls default to anonymous). */;
  isAnonymous: Type.TOptional<Type.TBoolean> /** Thread id (channel-specific meaning, e.g. Telegram forum topic id). */;
  threadId: Type.TOptional<Type.TString>;
  channel: Type.TOptional<Type.TString>;
  accountId: Type.TOptional<Type.TString>;
  idempotencyKey: Type.TString;
}>;
/** Main agent-run request accepted by the gateway. */
declare const AgentParamsSchema: Type.TObject<{
  message: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  provider: Type.TOptional<Type.TString>;
  model: Type.TOptional<Type.TString>;
  to: Type.TOptional<Type.TString>;
  replyTo: Type.TOptional<Type.TString>;
  sessionId: Type.TOptional<Type.TString>;
  sessionKey: Type.TOptional<Type.TString>;
  expectedExistingSessionId: Type.TOptional<Type.TString>;
  thinking: Type.TOptional<Type.TString>;
  deliver: Type.TOptional<Type.TBoolean>;
  attachments: Type.TOptional<Type.TArray<Type.TUnknown>>;
  channel: Type.TOptional<Type.TString>;
  replyChannel: Type.TOptional<Type.TString>;
  accountId: Type.TOptional<Type.TString>;
  replyAccountId: Type.TOptional<Type.TString>;
  threadId: Type.TOptional<Type.TString>;
  groupId: Type.TOptional<Type.TString>;
  groupChannel: Type.TOptional<Type.TString>;
  groupSpace: Type.TOptional<Type.TString>;
  timeout: Type.TOptional<Type.TInteger>;
  bestEffortDeliver: Type.TOptional<Type.TBoolean>;
  lane: Type.TOptional<Type.TString>;
  cwd: Type.TOptional<Type.TString>;
  cleanupBundleMcpOnRunEnd: Type.TOptional<Type.TBoolean>;
  modelRun: Type.TOptional<Type.TBoolean>;
  promptMode: Type.TOptional<
    Type.TUnion<[Type.TLiteral<"full">, Type.TLiteral<"minimal">, Type.TLiteral<"none">]>
  >;
  extraSystemPrompt: Type.TOptional<Type.TString>;
  bootstrapContextMode: Type.TOptional<
    Type.TUnion<[Type.TLiteral<"full">, Type.TLiteral<"lightweight">]>
  >;
  bootstrapContextRunKind: Type.TOptional<
    Type.TUnion<[Type.TLiteral<"default">, Type.TLiteral<"heartbeat">, Type.TLiteral<"cron">]>
  >;
  acpTurnSource: Type.TOptional<Type.TLiteral<"manual_spawn">>;
  internalRuntimeHandoffId: Type.TOptional<Type.TString>;
  execApprovalFollowupExpectedSessionId: Type.TOptional<Type.TString>;
  internalEvents: Type.TOptional<
    Type.TArray<
      Type.TObject<{
        type: Type.TLiteral<"task_completion">;
        source: Type.TString;
        childSessionKey: Type.TString;
        childSessionId: Type.TOptional<Type.TString>;
        announceType: Type.TString;
        taskLabel: Type.TString;
        status: Type.TString;
        statusLabel: Type.TString;
        result: Type.TString;
        attachments: Type.TOptional<
          Type.TArray<
            Type.TObject<{
              type: Type.TOptional<Type.TString>;
              path: Type.TOptional<Type.TString>;
              url: Type.TOptional<Type.TString>;
              mediaUrl: Type.TOptional<Type.TString>;
              filePath: Type.TOptional<Type.TString>;
              mimeType: Type.TOptional<Type.TString>;
              name: Type.TOptional<Type.TString>;
            }>
          >
        >;
        mediaUrls: Type.TOptional<Type.TArray<Type.TString>>;
        statsLine: Type.TOptional<Type.TString>;
        replyInstruction: Type.TString;
      }>
    >
  >;
  inputProvenance: Type.TOptional<
    Type.TObject<{
      kind: Type.TString;
      originSessionId: Type.TOptional<Type.TString>;
      sourceSessionKey: Type.TOptional<Type.TString>;
      sourceChannel: Type.TOptional<Type.TString>;
      sourceTool: Type.TOptional<Type.TString>;
    }>
  >;
  suppressPromptPersistence: Type.TOptional<Type.TBoolean>;
  sessionEffects: Type.TOptional<
    Type.TUnion<[Type.TLiteral<"visible">, Type.TLiteral<"internal">]>
  >;
  sourceReplyDeliveryMode: Type.TOptional<
    Type.TUnion<[Type.TLiteral<"automatic">, Type.TLiteral<"message_tool_only">]>
  >;
  disableMessageTool: Type.TOptional<Type.TBoolean>;
  forceRestartSafeTools: Type.TOptional<Type.TBoolean>;
  voiceWakeTrigger: Type.TOptional<Type.TString>;
  idempotencyKey: Type.TString;
  label: Type.TOptional<Type.TString>;
}>;
/** Identity lookup request for the current or selected agent/session. */
declare const AgentIdentityParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  sessionKey: Type.TOptional<Type.TString>;
}>;
/** Public display identity returned for an agent. */
declare const AgentIdentityResultSchema: Type.TObject<{
  agentId: Type.TString;
  name: Type.TOptional<Type.TString>;
  avatar: Type.TOptional<Type.TString>;
  avatarSource: Type.TOptional<Type.TString>;
  avatarStatus: Type.TOptional<Type.TString>;
  avatarReason: Type.TOptional<Type.TString>;
  emoji: Type.TOptional<Type.TString>;
}>;
/** Waits for a submitted agent run to complete or time out. */
declare const AgentWaitParamsSchema: Type.TObject<{
  runId: Type.TString;
  timeoutMs: Type.TOptional<Type.TInteger>;
}>;
/** Wake request from external schedulers or devices into an agent session. */
declare const WakeParamsSchema: Type.TObject<{
  mode: Type.TUnion<[Type.TLiteral<"now">, Type.TLiteral<"next-heartbeat">]>;
  text: Type.TString;
  sessionKey: Type.TOptional<Type.TString>;
  /**
   * Optional agent id paired with `sessionKey`. Routes multi-agent setups
   * to the agent that owns the targeted session — closes the related half
   * of #46886 ("always routes to default agent").
   */
  agentId: Type.TOptional<Type.TString>;
}>;
type AgentEvent = Static<typeof AgentEventSchema>;
type AgentIdentityParams = Static<typeof AgentIdentityParamsSchema>;
type AgentIdentityResult = Static<typeof AgentIdentityResultSchema>;
type PollParams = Static<typeof PollParamsSchema>;
type AgentWaitParams = Static<typeof AgentWaitParamsSchema>;
type WakeParams = Static<typeof WakeParamsSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/agents-models-skills.d.ts
/** Condensed agent record returned by list APIs. */
declare const AgentSummarySchema: Type.TObject<{
  id: Type.TString;
  name: Type.TOptional<Type.TString>;
  identity: Type.TOptional<
    Type.TObject<{
      name: Type.TOptional<Type.TString>;
      theme: Type.TOptional<Type.TString>;
      emoji: Type.TOptional<Type.TString>;
      avatar: Type.TOptional<Type.TString>;
      avatarUrl: Type.TOptional<Type.TString>;
    }>
  >;
  workspace: Type.TOptional<Type.TString>;
  workspaceGit: Type.TOptional<Type.TBoolean>;
  model: Type.TOptional<
    Type.TObject<{
      primary: Type.TOptional<Type.TString>;
      fallbacks: Type.TOptional<Type.TArray<Type.TString>>;
    }>
  >;
  agentRuntime: Type.TOptional<
    Type.TObject<{
      id: Type.TString;
      fallback: Type.TOptional<Type.TUnion<[Type.TLiteral<"openclaw">, Type.TLiteral<"none">]>>;
      source: Type.TUnion<
        [
          Type.TLiteral<"env">,
          Type.TLiteral<"agent">,
          Type.TLiteral<"defaults">,
          Type.TLiteral<"model">,
          Type.TLiteral<"provider">,
          Type.TLiteral<"implicit">,
        ]
      >;
    }>
  >;
  thinkingLevels: Type.TOptional<
    Type.TArray<
      Type.TObject<{
        id: Type.TString;
        label: Type.TString;
      }>
    >
  >;
  thinkingOptions: Type.TOptional<Type.TArray<Type.TString>>;
  thinkingDefault: Type.TOptional<Type.TString>;
}>;
/** Empty request payload for listing configured agents. */
declare const AgentsListParamsSchema: Type.TObject<{}>;
/** Agent list result including the default agent and session scoping mode. */
declare const AgentsListResultSchema: Type.TObject<{
  defaultId: Type.TString;
  mainKey: Type.TString;
  scope: Type.TUnion<[Type.TLiteral<"per-sender">, Type.TLiteral<"global">]>;
  agents: Type.TArray<
    Type.TObject<{
      id: Type.TString;
      name: Type.TOptional<Type.TString>;
      identity: Type.TOptional<
        Type.TObject<{
          name: Type.TOptional<Type.TString>;
          theme: Type.TOptional<Type.TString>;
          emoji: Type.TOptional<Type.TString>;
          avatar: Type.TOptional<Type.TString>;
          avatarUrl: Type.TOptional<Type.TString>;
        }>
      >;
      workspace: Type.TOptional<Type.TString>;
      workspaceGit: Type.TOptional<Type.TBoolean>;
      model: Type.TOptional<
        Type.TObject<{
          primary: Type.TOptional<Type.TString>;
          fallbacks: Type.TOptional<Type.TArray<Type.TString>>;
        }>
      >;
      agentRuntime: Type.TOptional<
        Type.TObject<{
          id: Type.TString;
          fallback: Type.TOptional<Type.TUnion<[Type.TLiteral<"openclaw">, Type.TLiteral<"none">]>>;
          source: Type.TUnion<
            [
              Type.TLiteral<"env">,
              Type.TLiteral<"agent">,
              Type.TLiteral<"defaults">,
              Type.TLiteral<"model">,
              Type.TLiteral<"provider">,
              Type.TLiteral<"implicit">,
            ]
          >;
        }>
      >;
      thinkingLevels: Type.TOptional<
        Type.TArray<
          Type.TObject<{
            id: Type.TString;
            label: Type.TString;
          }>
        >
      >;
      thinkingOptions: Type.TOptional<Type.TArray<Type.TString>>;
      thinkingDefault: Type.TOptional<Type.TString>;
    }>
  >;
}>;
/** Creates a configured agent with workspace, identity, and optional model. */
declare const AgentsCreateParamsSchema: Type.TObject<{
  name: Type.TString;
  workspace: Type.TString;
  model: Type.TOptional<Type.TString>;
  emoji: Type.TOptional<Type.TString>;
  avatar: Type.TOptional<Type.TString>;
}>;
/** Result returned after creating an agent. */
declare const AgentsCreateResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  agentId: Type.TString;
  name: Type.TString;
  workspace: Type.TString;
  model: Type.TOptional<Type.TString>;
}>;
/** Updates mutable agent identity, workspace, and model fields. */
declare const AgentsUpdateParamsSchema: Type.TObject<{
  agentId: Type.TString;
  name: Type.TOptional<Type.TString>;
  workspace: Type.TOptional<Type.TString>;
  model: Type.TOptional<Type.TString>;
  emoji: Type.TOptional<Type.TString>;
  avatar: Type.TOptional<Type.TString>;
}>;
/** Result returned after updating an agent. */
declare const AgentsUpdateResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  agentId: Type.TString;
}>;
/** Deletes an agent and optionally its workspace/config files. */
declare const AgentsDeleteParamsSchema: Type.TObject<{
  agentId: Type.TString;
  deleteFiles: Type.TOptional<Type.TBoolean>;
}>;
/** Result returned after deleting an agent and unbinding sessions. */
declare const AgentsDeleteResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  agentId: Type.TString;
  removedBindings: Type.TInteger;
}>;
/** File metadata and optional content for agent-local editable files. */
declare const AgentsFileEntrySchema: Type.TObject<{
  name: Type.TString;
  path: Type.TString;
  missing: Type.TBoolean;
  size: Type.TOptional<Type.TInteger>;
  updatedAtMs: Type.TOptional<Type.TInteger>;
  content: Type.TOptional<Type.TString>;
}>;
/** Lists editable files for one agent. */
declare const AgentsFilesListParamsSchema: Type.TObject<{
  agentId: Type.TString;
}>;
/** Editable file list for an agent workspace. */
declare const AgentsFilesListResultSchema: Type.TObject<{
  agentId: Type.TString;
  workspace: Type.TString;
  files: Type.TArray<
    Type.TObject<{
      name: Type.TString;
      path: Type.TString;
      missing: Type.TBoolean;
      size: Type.TOptional<Type.TInteger>;
      updatedAtMs: Type.TOptional<Type.TInteger>;
      content: Type.TOptional<Type.TString>;
    }>
  >;
}>;
/** Reads one editable agent file by name. */
declare const AgentsFilesGetParamsSchema: Type.TObject<{
  agentId: Type.TString;
  name: Type.TString;
}>;
/** Result for reading one editable agent file. */
declare const AgentsFilesGetResultSchema: Type.TObject<{
  agentId: Type.TString;
  workspace: Type.TString;
  file: Type.TObject<{
    name: Type.TString;
    path: Type.TString;
    missing: Type.TBoolean;
    size: Type.TOptional<Type.TInteger>;
    updatedAtMs: Type.TOptional<Type.TInteger>;
    content: Type.TOptional<Type.TString>;
  }>;
}>;
/** Writes one editable agent file. */
declare const AgentsFilesSetParamsSchema: Type.TObject<{
  agentId: Type.TString;
  name: Type.TString;
  content: Type.TString;
}>;
/** Result returned after writing an editable agent file. */
declare const AgentsFilesSetResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  agentId: Type.TString;
  workspace: Type.TString;
  file: Type.TObject<{
    name: Type.TString;
    path: Type.TString;
    missing: Type.TBoolean;
    size: Type.TOptional<Type.TInteger>;
    updatedAtMs: Type.TOptional<Type.TInteger>;
    content: Type.TOptional<Type.TString>;
  }>;
}>;
/** Model catalog request with optional visibility scope. */
declare const ModelsListParamsSchema: Type.TObject<{
  includeProviderCapabilities: Type.TOptional<Type.TBoolean>;
  view: Type.TOptional<
    Type.TUnion<
      [
        Type.TLiteral<"default">,
        Type.TLiteral<"configured">,
        Type.TLiteral<"provider-config">,
        Type.TLiteral<"all">,
      ]
    >
  >;
}>;
/** Runs a bounded live credential probe for one model provider. */
declare const ModelsProbeParamsSchema: Type.TObject<{
  provider: Type.TString;
  profileId: Type.TOptional<Type.TString>;
  timeoutMs: Type.TOptional<Type.TInteger>;
}>;
declare const AuthProbeStatusSchema: Type.TUnion<
  [
    Type.TLiteral<"ok">,
    Type.TLiteral<"auth">,
    Type.TLiteral<"rate_limit">,
    Type.TLiteral<"billing">,
    Type.TLiteral<"timeout">,
    Type.TLiteral<"format">,
    Type.TLiteral<"unknown">,
    Type.TLiteral<"no_model">,
  ]
>;
/** Secret-free result for one provider credential target. */
declare const ModelsProbeTargetResultSchema: Type.TObject<{
  profileId: Type.TOptional<Type.TString>;
  label: Type.TString;
  status: Type.TUnion<
    [
      Type.TLiteral<"ok">,
      Type.TLiteral<"auth">,
      Type.TLiteral<"rate_limit">,
      Type.TLiteral<"billing">,
      Type.TLiteral<"timeout">,
      Type.TLiteral<"format">,
      Type.TLiteral<"unknown">,
      Type.TLiteral<"no_model">,
    ]
  >;
  latencyMs: Type.TOptional<Type.TInteger>;
  error: Type.TOptional<Type.TString>;
}>;
/** Provider-level live probe rollup plus per-credential results. */
declare const ModelsProbeResultSchema: Type.TObject<{
  provider: Type.TString;
  status: Type.TUnion<
    [
      Type.TLiteral<"ok">,
      Type.TLiteral<"auth">,
      Type.TLiteral<"rate_limit">,
      Type.TLiteral<"billing">,
      Type.TLiteral<"timeout">,
      Type.TLiteral<"format">,
      Type.TLiteral<"unknown">,
      Type.TLiteral<"no_model">,
    ]
  >;
  latencyMs: Type.TOptional<Type.TInteger>;
  error: Type.TOptional<Type.TString>;
  results: Type.TArray<
    Type.TObject<{
      profileId: Type.TOptional<Type.TString>;
      label: Type.TString;
      status: Type.TUnion<
        [
          Type.TLiteral<"ok">,
          Type.TLiteral<"auth">,
          Type.TLiteral<"rate_limit">,
          Type.TLiteral<"billing">,
          Type.TLiteral<"timeout">,
          Type.TLiteral<"format">,
          Type.TLiteral<"unknown">,
          Type.TLiteral<"no_model">,
        ]
      >;
      latencyMs: Type.TOptional<Type.TInteger>;
      error: Type.TOptional<Type.TString>;
    }>
  >;
}>;
/** Reads installed skill status, optionally for a selected agent. */
declare const SkillsStatusParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
}>;
/** Empty request payload for listing available skill bins. */
declare const SkillsBinsParamsSchema: Type.TObject<{}>;
/** Skill bin names available to the gateway. */
declare const SkillsBinsResultSchema: Type.TObject<{
  bins: Type.TArray<Type.TString>;
}>;
/** Starts a chunked skill archive upload. */
declare const SkillsUploadBeginParamsSchema: Type.TObject<{
  kind: Type.TLiteral<"skill-archive">;
  slug: Type.TString;
  sizeBytes: Type.TInteger;
  sha256: Type.TOptional<Type.TString>;
  force: Type.TOptional<Type.TBoolean>;
  idempotencyKey: Type.TOptional<Type.TString>;
}>;
/** Uploads one base64-encoded chunk for a skill archive. */
declare const SkillsUploadChunkParamsSchema: Type.TObject<{
  uploadId: Type.TString;
  offset: Type.TInteger;
  dataBase64: Type.TString;
}>;
/** Commits a completed skill archive upload. */
declare const SkillsUploadCommitParamsSchema: Type.TObject<{
  uploadId: Type.TString;
  sha256: Type.TOptional<Type.TString>;
}>;
/** Installs a skill from legacy install id, ClawHub, or uploaded archive. */
declare const SkillsInstallParamsSchema: Type.TUnion<
  [
    Type.TObject<{
      agentId: Type.TOptional<Type.TString>;
      name: Type.TString;
      installId: Type.TString;
      dangerouslyForceUnsafeInstall: Type.TOptional<Type.TBoolean>;
      timeoutMs: Type.TOptional<Type.TInteger>;
    }>,
    Type.TObject<{
      agentId: Type.TOptional<Type.TString>;
      source: Type.TLiteral<"clawhub">;
      slug: Type.TString;
      version: Type.TOptional<Type.TString>;
      force: Type.TOptional<Type.TBoolean>;
      acknowledgeClawHubRisk: Type.TOptional<Type.TBoolean>;
      timeoutMs: Type.TOptional<Type.TInteger>;
    }>,
    Type.TObject<{
      agentId: Type.TOptional<Type.TString>;
      source: Type.TLiteral<"upload">;
      uploadId: Type.TString;
      slug: Type.TString;
      force: Type.TOptional<Type.TBoolean>;
      sha256: Type.TOptional<Type.TString>;
      timeoutMs: Type.TOptional<Type.TInteger>;
    }>,
  ]
>;
/** Updates installed skill settings or refreshes ClawHub-installed skills. */
declare const SkillsUpdateParamsSchema: Type.TUnion<
  [
    Type.TObject<{
      skillKey: Type.TString;
      enabled: Type.TOptional<Type.TBoolean>;
      apiKey: Type.TOptional<Type.TString>;
      env: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
    }>,
    Type.TObject<{
      agentId: Type.TOptional<Type.TString>;
      source: Type.TLiteral<"clawhub">;
      slug: Type.TOptional<Type.TString>;
      all: Type.TOptional<Type.TBoolean>;
      acknowledgeClawHubRisk: Type.TOptional<Type.TBoolean>;
    }>,
  ]
>;
/** Searches the skill registry. */
declare const SkillsSearchParamsSchema: Type.TObject<{
  query: Type.TOptional<Type.TString>;
  limit: Type.TOptional<Type.TInteger>;
}>;
/** Ranked skill registry search results. */
declare const SkillsSearchResultSchema: Type.TObject<{
  results: Type.TArray<
    Type.TObject<{
      score: Type.TNumber;
      slug: Type.TString;
      displayName: Type.TString;
      summary: Type.TOptional<Type.TString>;
      version: Type.TOptional<Type.TString>;
      updatedAt: Type.TOptional<Type.TInteger>;
    }>
  >;
}>;
/** Reads registry detail for one skill slug. */
declare const SkillsDetailParamsSchema: Type.TObject<{
  slug: Type.TString;
}>;
/** Reads current security verdicts for configured skills. */
declare const SkillsSecurityVerdictsParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
}>;
/** Skill registry detail, latest version, metadata, and owner info. */
declare const SkillsDetailResultSchema: Type.TObject<{
  skill: Type.TUnion<
    [
      Type.TObject<{
        slug: Type.TString;
        displayName: Type.TString;
        summary: Type.TOptional<Type.TString>;
        tags: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
        channel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        isOfficial: Type.TOptional<Type.TUnion<[Type.TBoolean, Type.TNull]>>;
        createdAt: Type.TInteger;
        updatedAt: Type.TInteger;
      }>,
      Type.TNull,
    ]
  >;
  latestVersion: Type.TOptional<
    Type.TUnion<
      [
        Type.TObject<{
          version: Type.TString;
          createdAt: Type.TInteger;
          changelog: Type.TOptional<Type.TString>;
        }>,
        Type.TNull,
      ]
    >
  >;
  metadata: Type.TOptional<
    Type.TUnion<
      [
        Type.TObject<{
          os: Type.TOptional<Type.TUnion<[Type.TArray<Type.TString>, Type.TNull]>>;
          systems: Type.TOptional<Type.TUnion<[Type.TArray<Type.TString>, Type.TNull]>>;
        }>,
        Type.TNull,
      ]
    >
  >;
  owner: Type.TOptional<
    Type.TUnion<
      [
        Type.TObject<{
          handle: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
          displayName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
          image: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
          official: Type.TOptional<Type.TUnion<[Type.TBoolean, Type.TNull]>>;
          channel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
          isOfficial: Type.TOptional<Type.TUnion<[Type.TBoolean, Type.TNull]>>;
        }>,
        Type.TNull,
      ]
    >
  >;
}>;
/** Security verdict report for installed/requested skills. */
declare const SkillsSecurityVerdictsResultSchema: Type.TObject<{
  schema: Type.TLiteral<"openclaw.skills.security-verdicts.v1">;
  items: Type.TArray<
    Type.TObject<{
      registry: Type.TString;
      ok: Type.TBoolean;
      decision: Type.TString;
      reasons: Type.TArray<Type.TString>;
      requestedSlug: Type.TString;
      requestedVersion: Type.TString;
      slug: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      version: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      displayName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      publisherHandle: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      publisherDisplayName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      createdAt: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
      checkedAt: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
      skillUrl: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      securityAuditUrl: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      securityStatus: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      securityPassed: Type.TOptional<Type.TUnion<[Type.TBoolean, Type.TNull]>>;
      error: Type.TOptional<
        Type.TObject<{
          code: Type.TOptional<Type.TString>;
          message: Type.TOptional<Type.TString>;
        }>
      >;
    }>
  >;
}>;
/** Reads the rendered skill card for one installed skill. */
declare const SkillsSkillCardParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  skillKey: Type.TString;
}>;
/** Rendered skill card content and file metadata. */
declare const SkillsSkillCardResultSchema: Type.TObject<{
  schema: Type.TLiteral<"openclaw.skills.skill-card.v1">;
  skillKey: Type.TString;
  path: Type.TString;
  sizeBytes: Type.TInteger;
  content: Type.TString;
}>;
/** Lists skill-workshop proposals for the selected agent scope. */
declare const SkillsProposalsListParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
}>;
/** Proposal manifest response for dashboard/workshop list views. */
declare const SkillsProposalsListResultSchema: Type.TObject<{
  schema: Type.TLiteral<"openclaw.skill-workshop.proposals-manifest.v1">;
  updatedAt: Type.TString;
  proposals: Type.TArray<
    Type.TObject<{
      id: Type.TString;
      kind: Type.TUnion<[Type.TLiteral<"create">, Type.TLiteral<"update">]>;
      status: Type.TUnion<
        [
          Type.TLiteral<"pending">,
          Type.TLiteral<"applied">,
          Type.TLiteral<"rejected">,
          Type.TLiteral<"quarantined">,
          Type.TLiteral<"stale">,
        ]
      >;
      title: Type.TString;
      description: Type.TString;
      skillName: Type.TString;
      skillKey: Type.TString;
      createdAt: Type.TString;
      updatedAt: Type.TString;
      scanState: Type.TUnion<
        [
          Type.TLiteral<"pending">,
          Type.TLiteral<"clean">,
          Type.TLiteral<"failed">,
          Type.TLiteral<"quarantined">,
        ]
      >;
    }>
  >;
}>;
/** Reads a proposal record plus editable draft/support content. */
declare const SkillsProposalInspectParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  proposalId: Type.TString;
}>;
/** Full proposal inspection result used before apply/revise decisions. */
declare const SkillsProposalInspectResultSchema: Type.TObject<{
  record: Type.TObject<{
    schema: Type.TLiteral<"openclaw.skill-workshop.proposal.v1">;
    id: Type.TString;
    kind: Type.TUnion<[Type.TLiteral<"create">, Type.TLiteral<"update">]>;
    status: Type.TUnion<
      [
        Type.TLiteral<"pending">,
        Type.TLiteral<"applied">,
        Type.TLiteral<"rejected">,
        Type.TLiteral<"quarantined">,
        Type.TLiteral<"stale">,
      ]
    >;
    title: Type.TString;
    description: Type.TString;
    createdAt: Type.TString;
    updatedAt: Type.TString;
    createdBy: Type.TUnion<
      [Type.TLiteral<"skill-workshop">, Type.TLiteral<"cli">, Type.TLiteral<"gateway">]
    >;
    origin: Type.TOptional<
      Type.TObject<{
        agentId: Type.TOptional<Type.TString>;
        sessionKey: Type.TOptional<Type.TString>;
        runId: Type.TOptional<Type.TString>;
        messageId: Type.TOptional<Type.TString>;
      }>
    >;
    proposedVersion: Type.TString;
    draftFile: Type.TLiteral<"PROPOSAL.md">;
    draftHash: Type.TString;
    supportFiles: Type.TOptional<
      Type.TArray<
        Type.TObject<{
          path: Type.TString;
          sizeBytes: Type.TInteger;
          hash: Type.TString;
          targetExisted: Type.TOptional<Type.TBoolean>;
          targetContentHash: Type.TOptional<Type.TString>;
        }>
      >
    >;
    target: Type.TObject<{
      skillName: Type.TString;
      skillKey: Type.TString;
      skillDir: Type.TString;
      skillFile: Type.TString;
      source: Type.TOptional<Type.TString>;
      currentContentHash: Type.TOptional<Type.TString>;
    }>;
    scan: Type.TObject<{
      state: Type.TUnion<
        [
          Type.TLiteral<"pending">,
          Type.TLiteral<"clean">,
          Type.TLiteral<"failed">,
          Type.TLiteral<"quarantined">,
        ]
      >;
      scannedAt: Type.TString;
      critical: Type.TInteger;
      warn: Type.TInteger;
      info: Type.TInteger;
      findings: Type.TArray<
        Type.TObject<{
          ruleId: Type.TString;
          severity: Type.TUnion<
            [Type.TLiteral<"info">, Type.TLiteral<"warn">, Type.TLiteral<"critical">]
          >;
          file: Type.TString;
          line: Type.TInteger;
          message: Type.TString;
          evidence: Type.TString;
        }>
      >;
    }>;
    goal: Type.TOptional<Type.TString>;
    evidence: Type.TOptional<Type.TString>;
    appliedAt: Type.TOptional<Type.TString>;
    rejectedAt: Type.TOptional<Type.TString>;
    quarantinedAt: Type.TOptional<Type.TString>;
    staleAt: Type.TOptional<Type.TString>;
    statusReason: Type.TOptional<Type.TString>;
  }>;
  content: Type.TString;
  supportFiles: Type.TOptional<
    Type.TArray<
      Type.TObject<{
        path: Type.TString;
        content: Type.TString;
      }>
    >
  >;
}>;
/** Creates a proposal for a new skill. */
declare const SkillsProposalCreateParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  name: Type.TString;
  description: Type.TString;
  content: Type.TString;
  supportFiles: Type.TOptional<
    Type.TArray<
      Type.TObject<{
        path: Type.TString;
        content: Type.TString;
      }>
    >
  >;
  goal: Type.TOptional<Type.TString>;
  evidence: Type.TOptional<Type.TString>;
}>;
/** Creates a proposal to update an existing skill. */
declare const SkillsProposalUpdateParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  skillName: Type.TString;
  description: Type.TOptional<Type.TString>;
  content: Type.TString;
  supportFiles: Type.TOptional<
    Type.TArray<
      Type.TObject<{
        path: Type.TString;
        content: Type.TString;
      }>
    >
  >;
  goal: Type.TOptional<Type.TString>;
  evidence: Type.TOptional<Type.TString>;
}>;
/** Replaces draft content/support files for an existing proposal. */
declare const SkillsProposalReviseParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  proposalId: Type.TString;
  content: Type.TString;
  supportFiles: Type.TOptional<
    Type.TArray<
      Type.TObject<{
        path: Type.TString;
        content: Type.TString;
      }>
    >
  >;
  description: Type.TOptional<Type.TString>;
  goal: Type.TOptional<Type.TString>;
  evidence: Type.TOptional<Type.TString>;
}>;
/** Starts an agent turn that revises a pending proposal from natural-language instructions. */
declare const SkillsProposalRequestRevisionParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  targetAgentId: Type.TOptional<Type.TString>;
  proposalId: Type.TString;
  instructions: Type.TString;
  sessionKey: Type.TString;
  sessionId: Type.TOptional<Type.TString>;
  idempotencyKey: Type.TString;
}>;
/** Chat-run acknowledgement returned after queueing a Skill Workshop revision request. */
declare const SkillsProposalRequestRevisionResultSchema: Type.TObject<{
  runId: Type.TString;
  status: Type.TUnion<
    [
      Type.TLiteral<"started">,
      Type.TLiteral<"in_flight">,
      Type.TLiteral<"ok">,
      Type.TLiteral<"timeout">,
      Type.TLiteral<"error">,
    ]
  >;
}>;
/** Shared approve/reject/quarantine action payload for one proposal. */
declare const SkillsProposalActionParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  proposalId: Type.TString;
  reason: Type.TOptional<Type.TString>;
}>;
/** Result returned after applying a skill proposal to disk. */
declare const SkillsProposalApplyResultSchema: Type.TObject<{
  record: Type.TObject<{
    schema: Type.TLiteral<"openclaw.skill-workshop.proposal.v1">;
    id: Type.TString;
    kind: Type.TUnion<[Type.TLiteral<"create">, Type.TLiteral<"update">]>;
    status: Type.TUnion<
      [
        Type.TLiteral<"pending">,
        Type.TLiteral<"applied">,
        Type.TLiteral<"rejected">,
        Type.TLiteral<"quarantined">,
        Type.TLiteral<"stale">,
      ]
    >;
    title: Type.TString;
    description: Type.TString;
    createdAt: Type.TString;
    updatedAt: Type.TString;
    createdBy: Type.TUnion<
      [Type.TLiteral<"skill-workshop">, Type.TLiteral<"cli">, Type.TLiteral<"gateway">]
    >;
    origin: Type.TOptional<
      Type.TObject<{
        agentId: Type.TOptional<Type.TString>;
        sessionKey: Type.TOptional<Type.TString>;
        runId: Type.TOptional<Type.TString>;
        messageId: Type.TOptional<Type.TString>;
      }>
    >;
    proposedVersion: Type.TString;
    draftFile: Type.TLiteral<"PROPOSAL.md">;
    draftHash: Type.TString;
    supportFiles: Type.TOptional<
      Type.TArray<
        Type.TObject<{
          path: Type.TString;
          sizeBytes: Type.TInteger;
          hash: Type.TString;
          targetExisted: Type.TOptional<Type.TBoolean>;
          targetContentHash: Type.TOptional<Type.TString>;
        }>
      >
    >;
    target: Type.TObject<{
      skillName: Type.TString;
      skillKey: Type.TString;
      skillDir: Type.TString;
      skillFile: Type.TString;
      source: Type.TOptional<Type.TString>;
      currentContentHash: Type.TOptional<Type.TString>;
    }>;
    scan: Type.TObject<{
      state: Type.TUnion<
        [
          Type.TLiteral<"pending">,
          Type.TLiteral<"clean">,
          Type.TLiteral<"failed">,
          Type.TLiteral<"quarantined">,
        ]
      >;
      scannedAt: Type.TString;
      critical: Type.TInteger;
      warn: Type.TInteger;
      info: Type.TInteger;
      findings: Type.TArray<
        Type.TObject<{
          ruleId: Type.TString;
          severity: Type.TUnion<
            [Type.TLiteral<"info">, Type.TLiteral<"warn">, Type.TLiteral<"critical">]
          >;
          file: Type.TString;
          line: Type.TInteger;
          message: Type.TString;
          evidence: Type.TString;
        }>
      >;
    }>;
    goal: Type.TOptional<Type.TString>;
    evidence: Type.TOptional<Type.TString>;
    appliedAt: Type.TOptional<Type.TString>;
    rejectedAt: Type.TOptional<Type.TString>;
    quarantinedAt: Type.TOptional<Type.TString>;
    staleAt: Type.TOptional<Type.TString>;
    statusReason: Type.TOptional<Type.TString>;
  }>;
  targetSkillFile: Type.TString;
}>;
/** Proposal record result returned after non-apply proposal actions. */
declare const SkillsProposalRecordResultSchema: Type.TObject<{
  schema: Type.TLiteral<"openclaw.skill-workshop.proposal.v1">;
  id: Type.TString;
  kind: Type.TUnion<[Type.TLiteral<"create">, Type.TLiteral<"update">]>;
  status: Type.TUnion<
    [
      Type.TLiteral<"pending">,
      Type.TLiteral<"applied">,
      Type.TLiteral<"rejected">,
      Type.TLiteral<"quarantined">,
      Type.TLiteral<"stale">,
    ]
  >;
  title: Type.TString;
  description: Type.TString;
  createdAt: Type.TString;
  updatedAt: Type.TString;
  createdBy: Type.TUnion<
    [Type.TLiteral<"skill-workshop">, Type.TLiteral<"cli">, Type.TLiteral<"gateway">]
  >;
  origin: Type.TOptional<
    Type.TObject<{
      agentId: Type.TOptional<Type.TString>;
      sessionKey: Type.TOptional<Type.TString>;
      runId: Type.TOptional<Type.TString>;
      messageId: Type.TOptional<Type.TString>;
    }>
  >;
  proposedVersion: Type.TString;
  draftFile: Type.TLiteral<"PROPOSAL.md">;
  draftHash: Type.TString;
  supportFiles: Type.TOptional<
    Type.TArray<
      Type.TObject<{
        path: Type.TString;
        sizeBytes: Type.TInteger;
        hash: Type.TString;
        targetExisted: Type.TOptional<Type.TBoolean>;
        targetContentHash: Type.TOptional<Type.TString>;
      }>
    >
  >;
  target: Type.TObject<{
    skillName: Type.TString;
    skillKey: Type.TString;
    skillDir: Type.TString;
    skillFile: Type.TString;
    source: Type.TOptional<Type.TString>;
    currentContentHash: Type.TOptional<Type.TString>;
  }>;
  scan: Type.TObject<{
    state: Type.TUnion<
      [
        Type.TLiteral<"pending">,
        Type.TLiteral<"clean">,
        Type.TLiteral<"failed">,
        Type.TLiteral<"quarantined">,
      ]
    >;
    scannedAt: Type.TString;
    critical: Type.TInteger;
    warn: Type.TInteger;
    info: Type.TInteger;
    findings: Type.TArray<
      Type.TObject<{
        ruleId: Type.TString;
        severity: Type.TUnion<
          [Type.TLiteral<"info">, Type.TLiteral<"warn">, Type.TLiteral<"critical">]
        >;
        file: Type.TString;
        line: Type.TInteger;
        message: Type.TString;
        evidence: Type.TString;
      }>
    >;
  }>;
  goal: Type.TOptional<Type.TString>;
  evidence: Type.TOptional<Type.TString>;
  appliedAt: Type.TOptional<Type.TString>;
  rejectedAt: Type.TOptional<Type.TString>;
  quarantinedAt: Type.TOptional<Type.TString>;
  staleAt: Type.TOptional<Type.TString>;
  statusReason: Type.TOptional<Type.TString>;
}>;
/** Reads persisted skill lifecycle curation state. */
declare const SkillsCuratorStatusParamsSchema: Type.TObject<{}>;
declare const SkillsCuratorStatusResultSchema: Type.TObject<{
  lastAttemptAtMs: Type.TUnion<[Type.TNumber, Type.TNull]>;
  lastSuccessAtMs: Type.TUnion<[Type.TNumber, Type.TNull]>;
  lastError: Type.TUnion<[Type.TString, Type.TNull]>;
  counts: Type.TObject<{
    active: Type.TNumber;
    stale: Type.TNumber;
    archived: Type.TNumber;
  }>;
  skills: Type.TArray<
    Type.TObject<{
      skillFile: Type.TString;
      skillKey: Type.TString;
      skillName: Type.TString;
      state: Type.TUnion<
        [Type.TLiteral<"active">, Type.TLiteral<"stale">, Type.TLiteral<"archived">]
      >;
      pinned: Type.TBoolean;
      createdAtMs: Type.TNumber;
      stateChangedAtMs: Type.TNumber;
      lastUsedAtMs: Type.TUnion<[Type.TNumber, Type.TNull]>;
      useCount: Type.TNumber;
      archivedReason: Type.TUnion<[Type.TString, Type.TNull]>;
    }>
  >;
  overlaps: Type.TArray<
    Type.TObject<{
      left: Type.TString;
      right: Type.TString;
      score: Type.TNumber;
    }>
  >;
}>;
/** Pins, unpins, or explicitly restores one curated skill. */
declare const SkillsCuratorActionParamsSchema: Type.TObject<{
  skill: Type.TString;
}>;
declare const SkillsCuratorActionResultSchema: Type.TObject<{
  skillFile: Type.TString;
  skillKey: Type.TString;
  skillName: Type.TString;
  state: Type.TUnion<[Type.TLiteral<"active">, Type.TLiteral<"stale">, Type.TLiteral<"archived">]>;
  pinned: Type.TBoolean;
  createdAtMs: Type.TNumber;
  stateChangedAtMs: Type.TNumber;
  lastUsedAtMs: Type.TUnion<[Type.TNumber, Type.TNull]>;
  useCount: Type.TNumber;
  archivedReason: Type.TUnion<[Type.TString, Type.TNull]>;
}>;
/** Reads the configured tool catalog for an agent. */
declare const ToolsCatalogParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  includePlugins: Type.TOptional<Type.TBoolean>;
}>;
/** Reads the effective tool set for one session. */
declare const ToolsEffectiveParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  sessionKey: Type.TString;
}>;
/** Invokes one tool through the gateway tool dispatcher. */
declare const ToolsInvokeParamsSchema: Type.TObject<{
  name: Type.TString;
  args: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
  sessionKey: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
  confirm: Type.TOptional<Type.TBoolean>;
  idempotencyKey: Type.TOptional<Type.TString>;
  /**
   * Explicit operation-local marker for an authenticated direct operator.
   * Missing values remain delegated, and agent runtime identity wins server-side.
   */
  conversationReadOrigin: Type.TOptional<Type.TLiteral<"direct-operator">>;
}>;
/** Tool catalog result for agent configuration UI. */
declare const ToolsCatalogResultSchema: Type.TObject<{
  agentId: Type.TString;
  profiles: Type.TArray<
    Type.TObject<{
      id: Type.TUnion<
        [
          Type.TLiteral<"minimal">,
          Type.TLiteral<"coding">,
          Type.TLiteral<"messaging">,
          Type.TLiteral<"full">,
        ]
      >;
      label: Type.TString;
    }>
  >;
  groups: Type.TArray<
    Type.TObject<{
      id: Type.TString;
      label: Type.TString;
      source: Type.TUnion<[Type.TLiteral<"core">, Type.TLiteral<"plugin">]>;
      pluginId: Type.TOptional<Type.TString>;
      tools: Type.TArray<
        Type.TObject<{
          id: Type.TString;
          label: Type.TString;
          description: Type.TString;
          source: Type.TUnion<[Type.TLiteral<"core">, Type.TLiteral<"plugin">]>;
          pluginId: Type.TOptional<Type.TString>;
          optional: Type.TOptional<Type.TBoolean>;
          risk: Type.TOptional<
            Type.TUnion<[Type.TLiteral<"low">, Type.TLiteral<"medium">, Type.TLiteral<"high">]>
          >;
          tags: Type.TOptional<Type.TArray<Type.TString>>;
          defaultProfiles: Type.TArray<
            Type.TUnion<
              [
                Type.TLiteral<"minimal">,
                Type.TLiteral<"coding">,
                Type.TLiteral<"messaging">,
                Type.TLiteral<"full">,
              ]
            >
          >;
        }>
      >;
    }>
  >;
}>;
/** Effective tool set for a session, including profile and filtering notices. */
declare const ToolsEffectiveResultSchema: Type.TObject<{
  agentId: Type.TString;
  profile: Type.TString;
  groups: Type.TArray<
    Type.TObject<{
      id: Type.TUnion<
        [
          Type.TLiteral<"core">,
          Type.TLiteral<"plugin">,
          Type.TLiteral<"channel">,
          Type.TLiteral<"mcp">,
        ]
      >;
      label: Type.TString;
      source: Type.TUnion<
        [
          Type.TLiteral<"core">,
          Type.TLiteral<"plugin">,
          Type.TLiteral<"channel">,
          Type.TLiteral<"mcp">,
        ]
      >;
      tools: Type.TArray<
        Type.TObject<{
          id: Type.TString;
          label: Type.TString;
          description: Type.TString;
          rawDescription: Type.TString;
          source: Type.TUnion<
            [
              Type.TLiteral<"core">,
              Type.TLiteral<"plugin">,
              Type.TLiteral<"channel">,
              Type.TLiteral<"mcp">,
            ]
          >;
          pluginId: Type.TOptional<Type.TString>;
          channelId: Type.TOptional<Type.TString>;
          risk: Type.TOptional<
            Type.TUnion<[Type.TLiteral<"low">, Type.TLiteral<"medium">, Type.TLiteral<"high">]>
          >;
          tags: Type.TOptional<Type.TArray<Type.TString>>;
        }>
      >;
    }>
  >;
  notices: Type.TOptional<
    Type.TArray<
      Type.TObject<{
        id: Type.TString;
        severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">]>;
        message: Type.TString;
      }>
    >
  >;
}>;
/** Tool invocation result, including approval handoff when required. */
declare const ToolsInvokeResultSchema: Type.TObject<{
  ok: Type.TBoolean;
  toolName: Type.TString;
  output: Type.TOptional<Type.TUnknown>;
  requiresApproval: Type.TOptional<Type.TBoolean>;
  approvalId: Type.TOptional<Type.TString>;
  source: Type.TOptional<
    Type.TUnion<
      [
        Type.TLiteral<"core">,
        Type.TLiteral<"plugin">,
        Type.TLiteral<"mcp">,
        Type.TLiteral<"channel">,
        Type.TString,
      ]
    >
  >;
  error: Type.TOptional<
    Type.TObject<{
      code: Type.TString;
      message: Type.TString;
      details: Type.TOptional<Type.TUnknown>;
    }>
  >;
}>;
type AgentSummary = Static<typeof AgentSummarySchema>;
type AgentsFileEntry = Static<typeof AgentsFileEntrySchema>;
type AgentsCreateParams = Static<typeof AgentsCreateParamsSchema>;
type AgentsCreateResult = Static<typeof AgentsCreateResultSchema>;
type AgentsUpdateParams = Static<typeof AgentsUpdateParamsSchema>;
type AgentsUpdateResult = Static<typeof AgentsUpdateResultSchema>;
type AgentsDeleteParams = Static<typeof AgentsDeleteParamsSchema>;
type AgentsDeleteResult = Static<typeof AgentsDeleteResultSchema>;
type AgentsFilesListParams = Static<typeof AgentsFilesListParamsSchema>;
type AgentsFilesListResult = Static<typeof AgentsFilesListResultSchema>;
type AgentsFilesGetParams = Static<typeof AgentsFilesGetParamsSchema>;
type AgentsFilesGetResult = Static<typeof AgentsFilesGetResultSchema>;
type AgentsFilesSetParams = Static<typeof AgentsFilesSetParamsSchema>;
type AgentsFilesSetResult = Static<typeof AgentsFilesSetResultSchema>;
type AgentsListParams = Static<typeof AgentsListParamsSchema>;
type AgentsListResult = Static<typeof AgentsListResultSchema>;
type AuthProbeStatus = Static<typeof AuthProbeStatusSchema>;
type ModelsProbeParams = Static<typeof ModelsProbeParamsSchema>;
type ModelsProbeTargetResult = Static<typeof ModelsProbeTargetResultSchema>;
type ModelsProbeResult = Static<typeof ModelsProbeResultSchema>;
type SkillsStatusParams = Static<typeof SkillsStatusParamsSchema>;
type ToolsCatalogParams = Static<typeof ToolsCatalogParamsSchema>;
type ToolsCatalogResult = Static<typeof ToolsCatalogResultSchema>;
type ToolsEffectiveParams = Static<typeof ToolsEffectiveParamsSchema>;
type ToolsEffectiveResult = Static<typeof ToolsEffectiveResultSchema>;
type ToolsInvokeParams = Static<typeof ToolsInvokeParamsSchema>;
type ToolsInvokeResult = Static<typeof ToolsInvokeResultSchema>;
type SkillsBinsParams = Static<typeof SkillsBinsParamsSchema>;
type SkillsBinsResult = Static<typeof SkillsBinsResultSchema>;
type SkillsSearchParams = Static<typeof SkillsSearchParamsSchema>;
type SkillsSearchResult = Static<typeof SkillsSearchResultSchema>;
type SkillsDetailParams = Static<typeof SkillsDetailParamsSchema>;
type SkillsDetailResult = Static<typeof SkillsDetailResultSchema>;
type SkillsProposalsListParams = Static<typeof SkillsProposalsListParamsSchema>;
type SkillsProposalsListResult = Static<typeof SkillsProposalsListResultSchema>;
type SkillsProposalInspectParams = Static<typeof SkillsProposalInspectParamsSchema>;
type SkillsProposalInspectResult = Static<typeof SkillsProposalInspectResultSchema>;
type SkillsProposalCreateParams = Static<typeof SkillsProposalCreateParamsSchema>;
type SkillsProposalUpdateParams = Static<typeof SkillsProposalUpdateParamsSchema>;
type SkillsProposalReviseParams = Static<typeof SkillsProposalReviseParamsSchema>;
type SkillsProposalRequestRevisionParams = Static<typeof SkillsProposalRequestRevisionParamsSchema>;
type SkillsProposalRequestRevisionResult = Static<typeof SkillsProposalRequestRevisionResultSchema>;
type SkillsProposalActionParams = Static<typeof SkillsProposalActionParamsSchema>;
type SkillsProposalApplyResult = Static<typeof SkillsProposalApplyResultSchema>;
type SkillsProposalRecordResult = Static<typeof SkillsProposalRecordResultSchema>;
type SkillsCuratorStatusParams = Static<typeof SkillsCuratorStatusParamsSchema>;
type SkillsCuratorStatusResult = Static<typeof SkillsCuratorStatusResultSchema>;
type SkillsCuratorActionParams = Static<typeof SkillsCuratorActionParamsSchema>;
type SkillsCuratorActionResult = Static<typeof SkillsCuratorActionResultSchema>;
type SkillsSecurityVerdictsParams = Static<typeof SkillsSecurityVerdictsParamsSchema>;
type SkillsSecurityVerdictsResult = Static<typeof SkillsSecurityVerdictsResultSchema>;
type SkillsSkillCardParams = Static<typeof SkillsSkillCardParamsSchema>;
type SkillsSkillCardResult = Static<typeof SkillsSkillCardResultSchema>;
type SkillsUploadBeginParams = Static<typeof SkillsUploadBeginParamsSchema>;
type SkillsUploadChunkParams = Static<typeof SkillsUploadChunkParamsSchema>;
type SkillsUploadCommitParams = Static<typeof SkillsUploadCommitParamsSchema>;
type SkillsInstallParams = Static<typeof SkillsInstallParamsSchema>;
type SkillsUpdateParams = Static<typeof SkillsUpdateParamsSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/agents-workspace.d.ts
/**
 * Read-only agent workspace browsing schemas.
 *
 * These contracts back the workspace file browser in operator clients
 * (mobile apps, Control UI). The surface is intentionally read-only:
 * write/delete/upload stay out of this namespace until a separately
 * reviewed mutation contract exists.
 */
/** One file or folder in an agent workspace directory listing. */
declare const AgentsWorkspaceEntrySchema: Type.TObject<{
  path: Type.TString;
  name: Type.TString;
  kind: Type.TUnion<[Type.TLiteral<"file">, Type.TLiteral<"directory">]>;
  size: Type.TOptional<Type.TInteger>;
  updatedAtMs: Type.TOptional<Type.TInteger>;
}>;
/** Lists one directory of an agent workspace. */
declare const AgentsWorkspaceListParamsSchema: Type.TObject<{
  agentId: Type.TString;
  path: Type.TOptional<Type.TString>;
  offset: Type.TOptional<Type.TInteger>;
  limit: Type.TOptional<Type.TInteger>;
}>;
/** Paginated directory listing rooted at the agent workspace. */
declare const AgentsWorkspaceListResultSchema: Type.TObject<{
  agentId: Type.TString;
  path: Type.TString;
  parentPath: Type.TOptional<Type.TString>;
  entries: Type.TArray<
    Type.TObject<{
      path: Type.TString;
      name: Type.TString;
      kind: Type.TUnion<[Type.TLiteral<"file">, Type.TLiteral<"directory">]>;
      size: Type.TOptional<Type.TInteger>;
      updatedAtMs: Type.TOptional<Type.TInteger>;
    }>
  >;
  totalEntries: Type.TInteger;
  offset: Type.TInteger;
}>;
/** One workspace file preview payload (UTF-8 text or base64 image). */
declare const AgentsWorkspaceFileSchema: Type.TObject<{
  path: Type.TString;
  name: Type.TString;
  size: Type.TInteger;
  updatedAtMs: Type.TInteger;
  mimeType: Type.TString;
  encoding: Type.TUnion<[Type.TLiteral<"utf8">, Type.TLiteral<"base64">]>;
  content: Type.TString;
}>;
/** Reads one workspace file by workspace-relative path. */
declare const AgentsWorkspaceGetParamsSchema: Type.TObject<{
  agentId: Type.TString;
  path: Type.TString;
}>;
/** Result for reading one workspace file. */
declare const AgentsWorkspaceGetResultSchema: Type.TObject<{
  agentId: Type.TString;
  file: Type.TObject<{
    path: Type.TString;
    name: Type.TString;
    size: Type.TInteger;
    updatedAtMs: Type.TInteger;
    mimeType: Type.TString;
    encoding: Type.TUnion<[Type.TLiteral<"utf8">, Type.TLiteral<"base64">]>;
    content: Type.TString;
  }>;
}>;
type AgentsWorkspaceEntry = Static<typeof AgentsWorkspaceEntrySchema>;
type AgentsWorkspaceFile = Static<typeof AgentsWorkspaceFileSchema>;
type AgentsWorkspaceListParams = Static<typeof AgentsWorkspaceListParamsSchema>;
type AgentsWorkspaceListResult = Static<typeof AgentsWorkspaceListResultSchema>;
type AgentsWorkspaceGetParams = Static<typeof AgentsWorkspaceGetParamsSchema>;
type AgentsWorkspaceGetResult = Static<typeof AgentsWorkspaceGetResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/artifacts.d.ts
/** Public artifact metadata returned before or alongside download data. */
declare const ArtifactSummarySchema: Type.TObject<{
  id: Type.TString;
  type: Type.TString;
  title: Type.TString;
  mimeType: Type.TOptional<Type.TString>;
  sizeBytes: Type.TOptional<Type.TInteger>;
  sessionKey: Type.TOptional<Type.TString>;
  runId: Type.TOptional<Type.TString>;
  taskId: Type.TOptional<Type.TString>;
  messageSeq: Type.TOptional<Type.TInteger>;
  source: Type.TOptional<Type.TString>;
  download: Type.TObject<{
    mode: Type.TUnion<[Type.TLiteral<"bytes">, Type.TLiteral<"url">, Type.TLiteral<"unsupported">]>;
  }>;
}>;
/** List request payload for artifacts visible in the selected scope. */
declare const ArtifactsListParamsSchema: Type.TObject<{
  sessionKey: Type.TOptional<Type.TString>;
  runId: Type.TOptional<Type.TString>;
  taskId: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
}>;
/** List response containing artifact summaries only. */
declare const ArtifactsListResultSchema: Type.TObject<{
  artifacts: Type.TArray<
    Type.TObject<{
      id: Type.TString;
      type: Type.TString;
      title: Type.TString;
      mimeType: Type.TOptional<Type.TString>;
      sizeBytes: Type.TOptional<Type.TInteger>;
      sessionKey: Type.TOptional<Type.TString>;
      runId: Type.TOptional<Type.TString>;
      taskId: Type.TOptional<Type.TString>;
      messageSeq: Type.TOptional<Type.TInteger>;
      source: Type.TOptional<Type.TString>;
      download: Type.TObject<{
        mode: Type.TUnion<
          [Type.TLiteral<"bytes">, Type.TLiteral<"url">, Type.TLiteral<"unsupported">]
        >;
      }>;
    }>
  >;
}>;
/** Get request payload for one artifact summary. */
declare const ArtifactsGetParamsSchema: Type.TObject<{
  artifactId: Type.TString;
  sessionKey: Type.TOptional<Type.TString>;
  runId: Type.TOptional<Type.TString>;
  taskId: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
}>;
/** Get response containing one artifact summary. */
declare const ArtifactsGetResultSchema: Type.TObject<{
  artifact: Type.TObject<{
    id: Type.TString;
    type: Type.TString;
    title: Type.TString;
    mimeType: Type.TOptional<Type.TString>;
    sizeBytes: Type.TOptional<Type.TInteger>;
    sessionKey: Type.TOptional<Type.TString>;
    runId: Type.TOptional<Type.TString>;
    taskId: Type.TOptional<Type.TString>;
    messageSeq: Type.TOptional<Type.TInteger>;
    source: Type.TOptional<Type.TString>;
    download: Type.TObject<{
      mode: Type.TUnion<
        [Type.TLiteral<"bytes">, Type.TLiteral<"url">, Type.TLiteral<"unsupported">]
      >;
    }>;
  }>;
}>;
/** Download request payload for one artifact. */
declare const ArtifactsDownloadParamsSchema: Type.TObject<{
  artifactId: Type.TString;
  sessionKey: Type.TOptional<Type.TString>;
  runId: Type.TOptional<Type.TString>;
  taskId: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
}>;
/** Download response, either inline base64 bytes, URL, or metadata for unsupported modes. */
declare const ArtifactsDownloadResultSchema: Type.TObject<{
  artifact: Type.TObject<{
    id: Type.TString;
    type: Type.TString;
    title: Type.TString;
    mimeType: Type.TOptional<Type.TString>;
    sizeBytes: Type.TOptional<Type.TInteger>;
    sessionKey: Type.TOptional<Type.TString>;
    runId: Type.TOptional<Type.TString>;
    taskId: Type.TOptional<Type.TString>;
    messageSeq: Type.TOptional<Type.TInteger>;
    source: Type.TOptional<Type.TString>;
    download: Type.TObject<{
      mode: Type.TUnion<
        [Type.TLiteral<"bytes">, Type.TLiteral<"url">, Type.TLiteral<"unsupported">]
      >;
    }>;
  }>;
  encoding: Type.TOptional<Type.TLiteral<"base64">>;
  data: Type.TOptional<Type.TString>;
  url: Type.TOptional<Type.TString>;
}>;
type ArtifactSummary = Static<typeof ArtifactSummarySchema>;
type ArtifactsListParams = Static<typeof ArtifactsListParamsSchema>;
type ArtifactsListResult = Static<typeof ArtifactsListResultSchema>;
type ArtifactsGetParams = Static<typeof ArtifactsGetParamsSchema>;
type ArtifactsGetResult = Static<typeof ArtifactsGetResultSchema>;
type ArtifactsDownloadParams = Static<typeof ArtifactsDownloadParamsSchema>;
type ArtifactsDownloadResult = Static<typeof ArtifactsDownloadResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/audit-activity.d.ts
/** V1 agent-run activity record. */
declare const AuditActivityAgentRunV1Schema: TSchema;
/** V1 tool-action activity record. */
declare const AuditActivityToolActionV1Schema: TSchema;
declare const AuditActivityInboundMessageV1Schema: TSchema;
declare const AuditActivityOutboundMessageV1Schema: TSchema;
/** Discriminated V1 activity record union. */
declare const AuditActivityEventV1Schema: TSchema;
/** Bounded newest-first V1 activity query filters. */
declare const AuditActivityListParamsSchema: TSchema;
/** Stable sequence-cursor V1 activity page. */
declare const AuditActivityListResultSchema: TSchema;
/** Metadata-only audit query payloads. */
type AuditActivityRecordBaseV1 = {
  schemaVersion: 1;
  eventId: string;
  sequence: number;
  sourceSequence: number;
  occurredAt: number;
  redaction: "metadata_only";
};
type AuditActivityAgentRecordBaseV1 = AuditActivityRecordBaseV1 & {
  actor: {
    type: "agent" | "system";
    id: string;
  };
  agentId: string;
  sessionKey?: string;
  sessionId?: string;
  runId: string;
};
type AuditActivityAgentRunV1Terminal =
  | {
      action: "agent.run.started";
      status: "started";
      errorCode?: never;
    }
  | {
      action: "agent.run.finished";
      status: "succeeded";
      errorCode?: never;
    }
  | {
      action: "agent.run.finished";
      status: "failed";
      errorCode: "run_failed";
    }
  | {
      action: "agent.run.finished";
      status: "cancelled";
      errorCode: "run_cancelled";
    }
  | {
      action: "agent.run.finished";
      status: "timed_out";
      errorCode: "run_timed_out";
    }
  | {
      action: "agent.run.finished";
      status: "blocked";
      errorCode: "run_blocked";
    };
type AuditActivityAgentRunV1 = AuditActivityAgentRecordBaseV1 & {
  eventType: "agent_run";
  kind: "agent_run";
} & AuditActivityAgentRunV1Terminal;
type AuditActivityToolActionV1Terminal =
  | {
      action: "tool.action.started";
      status: "started";
      errorCode?: never;
    }
  | {
      action: "tool.action.finished";
      status: "succeeded";
      errorCode?: never;
    }
  | {
      action: "tool.action.finished";
      status: "failed";
      errorCode: "tool_failed";
    }
  | {
      action: "tool.action.finished";
      status: "cancelled";
      errorCode: "tool_cancelled";
    }
  | {
      action: "tool.action.finished";
      status: "timed_out";
      errorCode: "tool_timed_out";
    }
  | {
      action: "tool.action.finished";
      status: "blocked";
      errorCode: "tool_blocked";
    }
  | {
      action: "tool.action.finished";
      status: "unknown";
      errorCode: "tool_outcome_unknown";
    };
type AuditActivityToolActionV1 = AuditActivityAgentRecordBaseV1 & {
  eventType: "tool_action";
  kind: "tool_action";
  toolCallId?: string;
  toolName?: string;
} & AuditActivityToolActionV1Terminal;
type AuditActivityMessageRecordBaseV1 = AuditActivityRecordBaseV1 & {
  kind: "message";
  channel: string;
  conversationKind: "direct" | "group" | "channel" | "unknown";
  durationMs?: number;
  resultCount?: number;
  agentId?: string;
  runId?: string;
  accountRef?: string;
  conversationRef?: string;
  messageRef?: string;
  targetRef?: string;
  sessionKey?: never;
  sessionId?: never;
  toolCallId?: never;
  toolName?: never;
};
type AuditActivityInboundMessageV1Terminal =
  | {
      status: "succeeded";
      outcome: "completed";
      errorCode?: never;
      reasonCode?:
        | "fast_abort"
        | "plugin_bound_handled"
        | "plugin_bound_unavailable"
        | "plugin_bound_declined"
        | "before_dispatch_handled"
        | "acp_dispatch_completed"
        | "acp_dispatch_empty";
    }
  | {
      status: "blocked";
      outcome: "skipped";
      errorCode?: never;
      reasonCode?:
        | "duplicate"
        | "reply_operation_active"
        | "reply_operation_aborted"
        | "acp_dispatch_aborted";
    }
  | {
      status: "failed";
      outcome: "failed";
      errorCode: "message_processing_failed";
      reasonCode?: "acp_dispatch_failed" | "plugin_bound_error";
    };
type AuditActivityInboundMessageV1 = AuditActivityMessageRecordBaseV1 & {
  eventType: "inbound_message";
  action: "message.inbound.processed";
  direction: "inbound";
  actor:
    | {
        type: "channel_sender";
        id: string;
      }
    | {
        type: "system";
        id: string;
      };
  deliveryKind?: never;
  failureStage?: never;
} & AuditActivityInboundMessageV1Terminal;
type AuditActivityOutboundMessageV1Terminal =
  | {
      status: "succeeded";
      outcome: "sent";
      errorCode?: never;
      reasonCode?: never;
      failureStage?: never;
      deliveryKind?: "text" | "media" | "other";
    }
  | {
      status: "blocked";
      outcome: "suppressed";
      errorCode?: never;
      reasonCode:
        | "cancelled_by_message_sending_hook"
        | "cancelled_by_reply_payload_sending_hook"
        | "empty_after_message_sending_hook"
        | "empty_after_reply_payload_sending_hook"
        | "no_visible_payload";
      failureStage?: never;
      deliveryKind?: never;
    }
  | {
      status: "failed";
      outcome: "failed";
      errorCode: "message_delivery_failed" | "message_delivery_partial_failure";
      reasonCode?: never;
      failureStage: "platform_send" | "queue" | "unknown";
      deliveryKind?: "text" | "media" | "other";
    }
  | {
      status: "unknown";
      outcome: "unknown";
      errorCode?: never;
      reasonCode?: never;
      failureStage: "platform_send" | "queue" | "unknown";
      deliveryKind?: never;
    };
type AuditActivityOutboundMessageV1 = AuditActivityMessageRecordBaseV1 & {
  eventType: "outbound_message";
  action: "message.outbound.finished";
  direction: "outbound";
  actor: {
    type: "agent" | "system";
    id: string;
  };
} & AuditActivityOutboundMessageV1Terminal;
type AuditActivityEventV1 =
  | AuditActivityAgentRunV1
  | AuditActivityToolActionV1
  | AuditActivityInboundMessageV1
  | AuditActivityOutboundMessageV1;
type AuditActivityListParams = {
  agentId?: string;
  sessionKey?: string;
  runId?: string;
  kind?: "agent_run" | "tool_action" | "message";
  status?: "started" | "succeeded" | "failed" | "cancelled" | "timed_out" | "blocked" | "unknown";
  direction?: "inbound" | "outbound";
  channel?: string;
  after?: number;
  before?: number;
  limit?: number;
  cursor?: string;
};
type AuditActivityListResult = {
  events: AuditActivityEventV1[];
  nextCursor?: string;
};
//#endregion
//#region packages/gateway-protocol/src/schema/audit.d.ts
/** One content-free run/tool audit record. */
declare const AuditEventSchema: Type.TObject<{
  eventId: Type.TString;
  sequence: Type.TInteger;
  sourceSequence: Type.TInteger;
  occurredAt: Type.TInteger;
  kind: Type.TUnion<[Type.TLiteral<"agent_run">, Type.TLiteral<"tool_action">]>;
  action: Type.TUnion<
    [
      Type.TLiteral<"agent.run.started">,
      Type.TLiteral<"agent.run.finished">,
      Type.TLiteral<"tool.action.started">,
      Type.TLiteral<"tool.action.finished">,
    ]
  >;
  status: Type.TUnion<
    [
      Type.TLiteral<"started">,
      Type.TLiteral<"succeeded">,
      Type.TLiteral<"failed">,
      Type.TLiteral<"cancelled">,
      Type.TLiteral<"timed_out">,
      Type.TLiteral<"blocked">,
      Type.TLiteral<"unknown">,
    ]
  >;
  errorCode: Type.TOptional<
    Type.TUnion<
      [
        Type.TLiteral<"run_failed">,
        Type.TLiteral<"run_cancelled">,
        Type.TLiteral<"run_timed_out">,
        Type.TLiteral<"run_blocked">,
        Type.TLiteral<"tool_failed">,
        Type.TLiteral<"tool_cancelled">,
        Type.TLiteral<"tool_timed_out">,
        Type.TLiteral<"tool_blocked">,
        Type.TLiteral<"tool_outcome_unknown">,
      ]
    >
  >;
  actor: Type.TObject<{
    type: Type.TUnion<[Type.TLiteral<"agent">, Type.TLiteral<"system">]>;
    id: Type.TString;
  }>;
  agentId: Type.TString;
  sessionKey: Type.TOptional<Type.TString>;
  sessionId: Type.TOptional<Type.TString>;
  runId: Type.TString;
  toolCallId: Type.TOptional<Type.TString>;
  toolName: Type.TOptional<Type.TString>;
  redaction: Type.TLiteral<"metadata_only">;
}>;
/** Bounded newest-first audit query filters. */
declare const AuditListParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  sessionKey: Type.TOptional<Type.TString>;
  runId: Type.TOptional<Type.TString>;
  kind: Type.TOptional<Type.TUnion<[Type.TLiteral<"agent_run">, Type.TLiteral<"tool_action">]>>;
  status: Type.TOptional<
    Type.TUnion<
      [
        Type.TLiteral<"started">,
        Type.TLiteral<"succeeded">,
        Type.TLiteral<"failed">,
        Type.TLiteral<"cancelled">,
        Type.TLiteral<"timed_out">,
        Type.TLiteral<"blocked">,
        Type.TLiteral<"unknown">,
      ]
    >
  >;
  after: Type.TOptional<Type.TInteger>;
  before: Type.TOptional<Type.TInteger>;
  limit: Type.TOptional<Type.TInteger>;
  cursor: Type.TOptional<Type.TString>;
}>;
/** Stable sequence-cursor page suitable for bounded JSON export. */
declare const AuditListResultSchema: Type.TObject<{
  events: Type.TArray<
    Type.TObject<{
      eventId: Type.TString;
      sequence: Type.TInteger;
      sourceSequence: Type.TInteger;
      occurredAt: Type.TInteger;
      kind: Type.TUnion<[Type.TLiteral<"agent_run">, Type.TLiteral<"tool_action">]>;
      action: Type.TUnion<
        [
          Type.TLiteral<"agent.run.started">,
          Type.TLiteral<"agent.run.finished">,
          Type.TLiteral<"tool.action.started">,
          Type.TLiteral<"tool.action.finished">,
        ]
      >;
      status: Type.TUnion<
        [
          Type.TLiteral<"started">,
          Type.TLiteral<"succeeded">,
          Type.TLiteral<"failed">,
          Type.TLiteral<"cancelled">,
          Type.TLiteral<"timed_out">,
          Type.TLiteral<"blocked">,
          Type.TLiteral<"unknown">,
        ]
      >;
      errorCode: Type.TOptional<
        Type.TUnion<
          [
            Type.TLiteral<"run_failed">,
            Type.TLiteral<"run_cancelled">,
            Type.TLiteral<"run_timed_out">,
            Type.TLiteral<"run_blocked">,
            Type.TLiteral<"tool_failed">,
            Type.TLiteral<"tool_cancelled">,
            Type.TLiteral<"tool_timed_out">,
            Type.TLiteral<"tool_blocked">,
            Type.TLiteral<"tool_outcome_unknown">,
          ]
        >
      >;
      actor: Type.TObject<{
        type: Type.TUnion<[Type.TLiteral<"agent">, Type.TLiteral<"system">]>;
        id: Type.TString;
      }>;
      agentId: Type.TString;
      sessionKey: Type.TOptional<Type.TString>;
      sessionId: Type.TOptional<Type.TString>;
      runId: Type.TString;
      toolCallId: Type.TOptional<Type.TString>;
      toolName: Type.TOptional<Type.TString>;
      redaction: Type.TLiteral<"metadata_only">;
    }>
  >;
  nextCursor: Type.TOptional<Type.TString>;
}>;
type AuditEvent = Static<typeof AuditEventSchema>;
type AuditListParams = Static<typeof AuditListParamsSchema>;
type AuditListResult = Static<typeof AuditListResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/channels.d.ts
/**
 * Channel and Talk protocol schemas.
 *
 * Talk schemas are consumed by browser realtime clients, gateway relay sessions,
 * and channel adapters, so the mode/transport/brain unions below are shared
 * API vocabulary rather than provider-local implementation details.
 */
/** Toggles Talk mode for the gateway, with an optional rollout phase marker. */
declare const TalkModeParamsSchema: Type.TObject<{
  enabled: Type.TBoolean;
  phase: Type.TOptional<Type.TString>;
}>;
/** Reads Talk configuration; secrets are included only for trusted callers. */
declare const TalkConfigParamsSchema: Type.TObject<{
  includeSecrets: Type.TOptional<Type.TBoolean>;
}>;
/** One-shot text-to-speech request with provider-specific voice tuning knobs. */
declare const TalkSpeakParamsSchema: Type.TObject<{
  text: Type.TString;
  voiceId: Type.TOptional<Type.TString>;
  modelId: Type.TOptional<Type.TString>;
  outputFormat: Type.TOptional<Type.TString>;
  speed: Type.TOptional<Type.TNumber>;
  rateWpm: Type.TOptional<Type.TInteger>;
  stability: Type.TOptional<Type.TNumber>;
  similarity: Type.TOptional<Type.TNumber>;
  style: Type.TOptional<Type.TNumber>;
  speakerBoost: Type.TOptional<Type.TBoolean>;
  seed: Type.TOptional<Type.TInteger>;
  normalize: Type.TOptional<Type.TString>;
  language: Type.TOptional<Type.TString>;
  latencyTier: Type.TOptional<Type.TInteger>;
}>;
/**
 * One-shot text-to-speech request rendered with the configured TTS provider
 * chain (unlike `talk.speak`, which pins the Talk-mode provider).
 */
declare const TtsSpeakParamsSchema: Type.TObject<{
  text: Type.TString;
}>;
/** Canonical Talk event envelope emitted to browser, relay, and channel consumers. */
declare const TalkEventSchema: Type.TObject<{
  id: Type.TString;
  type: Type.TUnion<
    [
      Type.TLiteral<"session.started">,
      Type.TLiteral<"session.ready">,
      Type.TLiteral<"session.closed">,
      Type.TLiteral<"session.error">,
      Type.TLiteral<"session.replaced">,
      Type.TLiteral<"turn.started">,
      Type.TLiteral<"turn.ended">,
      Type.TLiteral<"turn.cancelled">,
      Type.TLiteral<"capture.started">,
      Type.TLiteral<"capture.stopped">,
      Type.TLiteral<"capture.cancelled">,
      Type.TLiteral<"capture.once">,
      Type.TLiteral<"input.audio.delta">,
      Type.TLiteral<"input.audio.committed">,
      Type.TLiteral<"transcript.delta">,
      Type.TLiteral<"transcript.done">,
      Type.TLiteral<"output.text.delta">,
      Type.TLiteral<"output.text.done">,
      Type.TLiteral<"output.audio.started">,
      Type.TLiteral<"output.audio.delta">,
      Type.TLiteral<"output.audio.done">,
      Type.TLiteral<"tool.call">,
      Type.TLiteral<"tool.progress">,
      Type.TLiteral<"tool.result">,
      Type.TLiteral<"tool.error">,
      Type.TLiteral<"usage.metrics">,
      Type.TLiteral<"latency.metrics">,
      Type.TLiteral<"health.changed">,
    ]
  >;
  sessionId: Type.TString;
  turnId: Type.TOptional<Type.TString>;
  captureId: Type.TOptional<Type.TString>;
  seq: Type.TInteger;
  timestamp: Type.TString;
  mode: Type.TUnion<
    [Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]
  >;
  transport: Type.TUnion<
    [
      Type.TLiteral<"webrtc">,
      Type.TLiteral<"provider-websocket">,
      Type.TLiteral<"gateway-relay">,
      Type.TLiteral<"managed-room">,
    ]
  >;
  brain: Type.TUnion<
    [Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]
  >;
  provider: Type.TOptional<Type.TString>;
  final: Type.TOptional<Type.TBoolean>;
  callId: Type.TOptional<Type.TString>;
  itemId: Type.TOptional<Type.TString>;
  parentId: Type.TOptional<Type.TString>;
  payload: Type.TUnknown;
}>;
/** Creates a browser-facing Talk client session. */
declare const TalkClientCreateParamsSchema: Type.TObject<{
  sessionKey: Type.TOptional<Type.TString>;
  provider: Type.TOptional<Type.TString>;
  model: Type.TOptional<Type.TString>;
  voice: Type.TOptional<Type.TString>;
  vadThreshold: Type.TOptional<Type.TNumber>;
  silenceDurationMs: Type.TOptional<Type.TInteger>;
  prefixPaddingMs: Type.TOptional<Type.TInteger>;
  reasoningEffort: Type.TOptional<Type.TString>;
  mode: Type.TOptional<
    Type.TUnion<
      [Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]
    >
  >;
  transport: Type.TOptional<
    Type.TUnion<
      [
        Type.TLiteral<"webrtc">,
        Type.TLiteral<"provider-websocket">,
        Type.TLiteral<"gateway-relay">,
        Type.TLiteral<"managed-room">,
      ]
    >
  >;
  brain: Type.TOptional<
    Type.TUnion<
      [Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]
    >
  >;
}>;
/** Tool-call request from a browser/client session back into the agent runtime. */
declare const TalkClientToolCallParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  callId: Type.TString;
  name: Type.TString;
  args: Type.TOptional<Type.TUnknown>;
  relaySessionId: Type.TOptional<Type.TString>;
}>;
/** Agent run identity returned after accepting a Talk client tool call. */
declare const TalkClientToolCallResultSchema: Type.TObject<{
  runId: Type.TString;
  idempotencyKey: Type.TString;
}>;
/** Text steering request for a Talk session bound to an agent turn. */
declare const TalkClientSteerParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  text: Type.TString;
  mode: Type.TOptional<
    Type.TUnion<
      [
        Type.TLiteral<"status">,
        Type.TLiteral<"steer">,
        Type.TLiteral<"cancel">,
        Type.TLiteral<"followup">,
      ]
    >
  >;
}>;
/** Result of applying agent control to an embedded or reply-backed Talk run. */
declare const TalkAgentControlResultSchema: Type.TObject<{
  ok: Type.TBoolean;
  mode: Type.TUnion<
    [
      Type.TLiteral<"status">,
      Type.TLiteral<"steer">,
      Type.TLiteral<"cancel">,
      Type.TLiteral<"followup">,
    ]
  >;
  sessionKey: Type.TString;
  sessionId: Type.TOptional<Type.TString>;
  active: Type.TBoolean;
  queued: Type.TOptional<Type.TBoolean>;
  aborted: Type.TOptional<Type.TBoolean>;
  target: Type.TOptional<Type.TUnion<[Type.TLiteral<"embedded_run">, Type.TLiteral<"reply_run">]>>;
  reason: Type.TOptional<Type.TString>;
  message: Type.TString;
  speak: Type.TBoolean;
  show: Type.TBoolean;
  suppress: Type.TBoolean;
  providerResult: Type.TOptional<
    Type.TObject<{
      status: Type.TLiteral<"cancelled">;
      message: Type.TString;
    }>
  >;
  enqueuedAtMs: Type.TOptional<Type.TNumber>;
  deliveredAtMs: Type.TOptional<Type.TNumber>;
}>;
/** Joins an existing managed-room Talk session. */
declare const TalkSessionJoinParamsSchema: Type.TObject<{
  sessionId: Type.TString;
  token: Type.TString;
}>;
/** Creates a gateway-managed Talk session for realtime, transcription, or relay use. */
declare const TalkSessionCreateParamsSchema: Type.TObject<{
  sessionKey: Type.TOptional<Type.TString>;
  spawnedBy: Type.TOptional<Type.TString>;
  provider: Type.TOptional<Type.TString>;
  model: Type.TOptional<Type.TString>;
  voice: Type.TOptional<Type.TString>;
  vadThreshold: Type.TOptional<Type.TNumber>;
  silenceDurationMs: Type.TOptional<Type.TInteger>;
  prefixPaddingMs: Type.TOptional<Type.TInteger>;
  reasoningEffort: Type.TOptional<Type.TString>;
  mode: Type.TOptional<
    Type.TUnion<
      [Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]
    >
  >;
  transport: Type.TOptional<
    Type.TUnion<
      [
        Type.TLiteral<"webrtc">,
        Type.TLiteral<"provider-websocket">,
        Type.TLiteral<"gateway-relay">,
        Type.TLiteral<"managed-room">,
      ]
    >
  >;
  brain: Type.TOptional<
    Type.TUnion<
      [Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]
    >
  >;
  ttlMs: Type.TOptional<Type.TInteger>;
}>;
/** Appends base64 audio to an active Talk session. */
declare const TalkSessionAppendAudioParamsSchema: Type.TObject<{
  sessionId: Type.TString;
  audioBase64: Type.TString;
  timestamp: Type.TOptional<Type.TNumber>;
}>;
/** Starts or advances a Talk turn within a session. */
declare const TalkSessionTurnParamsSchema: Type.TObject<{
  sessionId: Type.TString;
  turnId: Type.TOptional<Type.TString>;
}>;
/** Cancels the active or named Talk turn. */
declare const TalkSessionCancelTurnParamsSchema: Type.TObject<{
  sessionId: Type.TString;
  turnId: Type.TOptional<Type.TString>;
  reason: Type.TOptional<Type.TString>;
}>;
/** Cancels currently streaming Talk output without necessarily ending the turn. */
declare const TalkSessionCancelOutputParamsSchema: Type.TObject<{
  sessionId: Type.TString;
  turnId: Type.TOptional<Type.TString>;
  reason: Type.TOptional<Type.TString>;
}>;
/** Submits a tool result back to a Talk provider session. */
declare const TalkSessionSubmitToolResultParamsSchema: Type.TObject<{
  sessionId: Type.TString;
  callId: Type.TString;
  result: Type.TUnknown;
  options: Type.TOptional<
    Type.TObject<{
      suppressResponse: Type.TOptional<Type.TBoolean>;
      willContinue: Type.TOptional<Type.TBoolean>;
    }>
  >;
}>;
/** Steers a managed Talk session by session id rather than transcript key. */
declare const TalkSessionSteerParamsSchema: Type.TObject<{
  sessionId: Type.TString;
  sessionKey: Type.TOptional<Type.TString>;
  text: Type.TString;
  mode: Type.TOptional<
    Type.TUnion<
      [
        Type.TLiteral<"status">,
        Type.TLiteral<"steer">,
        Type.TLiteral<"cancel">,
        Type.TLiteral<"followup">,
      ]
    >
  >;
}>;
/** Closes a gateway-managed Talk session. */
declare const TalkSessionCloseParamsSchema: Type.TObject<{
  sessionId: Type.TString;
}>;
/** Empty request payload for reading configured Talk provider capabilities. */
declare const TalkCatalogParamsSchema: Type.TObject<{}>;
/** Provider, mode, transport, and audio-format catalog returned to clients. */
declare const TalkCatalogResultSchema: Type.TObject<{
  modes: Type.TArray<
    Type.TUnion<
      [Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]
    >
  >;
  transports: Type.TArray<
    Type.TUnion<
      [
        Type.TLiteral<"webrtc">,
        Type.TLiteral<"provider-websocket">,
        Type.TLiteral<"gateway-relay">,
        Type.TLiteral<"managed-room">,
      ]
    >
  >;
  brains: Type.TArray<
    Type.TUnion<
      [Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]
    >
  >;
  speech: Type.TObject<{
    ready: Type.TOptional<Type.TBoolean>;
    activeProvider: Type.TOptional<Type.TString>;
    providers: Type.TArray<
      Type.TObject<{
        id: Type.TString;
        label: Type.TString;
        configured: Type.TBoolean;
        aliases: Type.TOptional<Type.TArray<Type.TString>>;
        models: Type.TOptional<Type.TArray<Type.TString>>;
        voices: Type.TOptional<Type.TArray<Type.TString>>;
        defaultModel: Type.TOptional<Type.TString>;
        modes: Type.TOptional<
          Type.TArray<
            Type.TUnion<
              [Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]
            >
          >
        >;
        transports: Type.TOptional<
          Type.TArray<
            Type.TUnion<
              [
                Type.TLiteral<"webrtc">,
                Type.TLiteral<"provider-websocket">,
                Type.TLiteral<"gateway-relay">,
                Type.TLiteral<"managed-room">,
              ]
            >
          >
        >;
        brains: Type.TOptional<
          Type.TArray<
            Type.TUnion<
              [Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]
            >
          >
        >;
        inputAudioFormats: Type.TOptional<
          Type.TArray<
            Type.TObject<{
              encoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
              sampleRateHz: Type.TInteger;
              channels: Type.TInteger;
            }>
          >
        >;
        outputAudioFormats: Type.TOptional<
          Type.TArray<
            Type.TObject<{
              encoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
              sampleRateHz: Type.TInteger;
              channels: Type.TInteger;
            }>
          >
        >;
        supportsBrowserSession: Type.TOptional<Type.TBoolean>;
        supportsBargeIn: Type.TOptional<Type.TBoolean>;
        supportsToolCalls: Type.TOptional<Type.TBoolean>;
        supportsVideoFrames: Type.TOptional<Type.TBoolean>;
        supportsSessionResumption: Type.TOptional<Type.TBoolean>;
      }>
    >;
  }>;
  transcription: Type.TObject<{
    ready: Type.TOptional<Type.TBoolean>;
    activeProvider: Type.TOptional<Type.TString>;
    providers: Type.TArray<
      Type.TObject<{
        id: Type.TString;
        label: Type.TString;
        configured: Type.TBoolean;
        aliases: Type.TOptional<Type.TArray<Type.TString>>;
        models: Type.TOptional<Type.TArray<Type.TString>>;
        voices: Type.TOptional<Type.TArray<Type.TString>>;
        defaultModel: Type.TOptional<Type.TString>;
        modes: Type.TOptional<
          Type.TArray<
            Type.TUnion<
              [Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]
            >
          >
        >;
        transports: Type.TOptional<
          Type.TArray<
            Type.TUnion<
              [
                Type.TLiteral<"webrtc">,
                Type.TLiteral<"provider-websocket">,
                Type.TLiteral<"gateway-relay">,
                Type.TLiteral<"managed-room">,
              ]
            >
          >
        >;
        brains: Type.TOptional<
          Type.TArray<
            Type.TUnion<
              [Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]
            >
          >
        >;
        inputAudioFormats: Type.TOptional<
          Type.TArray<
            Type.TObject<{
              encoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
              sampleRateHz: Type.TInteger;
              channels: Type.TInteger;
            }>
          >
        >;
        outputAudioFormats: Type.TOptional<
          Type.TArray<
            Type.TObject<{
              encoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
              sampleRateHz: Type.TInteger;
              channels: Type.TInteger;
            }>
          >
        >;
        supportsBrowserSession: Type.TOptional<Type.TBoolean>;
        supportsBargeIn: Type.TOptional<Type.TBoolean>;
        supportsToolCalls: Type.TOptional<Type.TBoolean>;
        supportsVideoFrames: Type.TOptional<Type.TBoolean>;
        supportsSessionResumption: Type.TOptional<Type.TBoolean>;
      }>
    >;
  }>;
  realtime: Type.TObject<{
    ready: Type.TOptional<Type.TBoolean>;
    activeProvider: Type.TOptional<Type.TString>;
    providers: Type.TArray<
      Type.TObject<{
        id: Type.TString;
        label: Type.TString;
        configured: Type.TBoolean;
        aliases: Type.TOptional<Type.TArray<Type.TString>>;
        models: Type.TOptional<Type.TArray<Type.TString>>;
        voices: Type.TOptional<Type.TArray<Type.TString>>;
        defaultModel: Type.TOptional<Type.TString>;
        modes: Type.TOptional<
          Type.TArray<
            Type.TUnion<
              [Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]
            >
          >
        >;
        transports: Type.TOptional<
          Type.TArray<
            Type.TUnion<
              [
                Type.TLiteral<"webrtc">,
                Type.TLiteral<"provider-websocket">,
                Type.TLiteral<"gateway-relay">,
                Type.TLiteral<"managed-room">,
              ]
            >
          >
        >;
        brains: Type.TOptional<
          Type.TArray<
            Type.TUnion<
              [Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]
            >
          >
        >;
        inputAudioFormats: Type.TOptional<
          Type.TArray<
            Type.TObject<{
              encoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
              sampleRateHz: Type.TInteger;
              channels: Type.TInteger;
            }>
          >
        >;
        outputAudioFormats: Type.TOptional<
          Type.TArray<
            Type.TObject<{
              encoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
              sampleRateHz: Type.TInteger;
              channels: Type.TInteger;
            }>
          >
        >;
        supportsBrowserSession: Type.TOptional<Type.TBoolean>;
        supportsBargeIn: Type.TOptional<Type.TBoolean>;
        supportsToolCalls: Type.TOptional<Type.TBoolean>;
        supportsVideoFrames: Type.TOptional<Type.TBoolean>;
        supportsSessionResumption: Type.TOptional<Type.TBoolean>;
      }>
    >;
  }>;
}>;
/** Session creation result with transport-specific ids and credentials. */
declare const TalkSessionCreateResultSchema: Type.TObject<{
  sessionId: Type.TString;
  provider: Type.TOptional<Type.TString>;
  mode: Type.TUnion<
    [Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]
  >;
  transport: Type.TUnion<
    [
      Type.TLiteral<"webrtc">,
      Type.TLiteral<"provider-websocket">,
      Type.TLiteral<"gateway-relay">,
      Type.TLiteral<"managed-room">,
    ]
  >;
  brain: Type.TUnion<
    [Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]
  >;
  relaySessionId: Type.TOptional<Type.TString>;
  transcriptionSessionId: Type.TOptional<Type.TString>;
  handoffId: Type.TOptional<Type.TString>;
  roomId: Type.TOptional<Type.TString>;
  roomUrl: Type.TOptional<Type.TString>;
  token: Type.TOptional<Type.TString>;
  audio: Type.TOptional<Type.TUnknown>;
  model: Type.TOptional<Type.TString>;
  voice: Type.TOptional<Type.TString>;
  expiresAt: Type.TOptional<Type.TNumber>;
}>;
/** Result for a Talk turn request, optionally including emitted events. */
declare const TalkSessionTurnResultSchema: Type.TObject<{
  ok: Type.TBoolean;
  turnId: Type.TOptional<Type.TString>;
  events: Type.TOptional<
    Type.TArray<
      Type.TObject<{
        id: Type.TString;
        type: Type.TUnion<
          [
            Type.TLiteral<"session.started">,
            Type.TLiteral<"session.ready">,
            Type.TLiteral<"session.closed">,
            Type.TLiteral<"session.error">,
            Type.TLiteral<"session.replaced">,
            Type.TLiteral<"turn.started">,
            Type.TLiteral<"turn.ended">,
            Type.TLiteral<"turn.cancelled">,
            Type.TLiteral<"capture.started">,
            Type.TLiteral<"capture.stopped">,
            Type.TLiteral<"capture.cancelled">,
            Type.TLiteral<"capture.once">,
            Type.TLiteral<"input.audio.delta">,
            Type.TLiteral<"input.audio.committed">,
            Type.TLiteral<"transcript.delta">,
            Type.TLiteral<"transcript.done">,
            Type.TLiteral<"output.text.delta">,
            Type.TLiteral<"output.text.done">,
            Type.TLiteral<"output.audio.started">,
            Type.TLiteral<"output.audio.delta">,
            Type.TLiteral<"output.audio.done">,
            Type.TLiteral<"tool.call">,
            Type.TLiteral<"tool.progress">,
            Type.TLiteral<"tool.result">,
            Type.TLiteral<"tool.error">,
            Type.TLiteral<"usage.metrics">,
            Type.TLiteral<"latency.metrics">,
            Type.TLiteral<"health.changed">,
          ]
        >;
        sessionId: Type.TString;
        turnId: Type.TOptional<Type.TString>;
        captureId: Type.TOptional<Type.TString>;
        seq: Type.TInteger;
        timestamp: Type.TString;
        mode: Type.TUnion<
          [Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]
        >;
        transport: Type.TUnion<
          [
            Type.TLiteral<"webrtc">,
            Type.TLiteral<"provider-websocket">,
            Type.TLiteral<"gateway-relay">,
            Type.TLiteral<"managed-room">,
          ]
        >;
        brain: Type.TUnion<
          [Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]
        >;
        provider: Type.TOptional<Type.TString>;
        final: Type.TOptional<Type.TBoolean>;
        callId: Type.TOptional<Type.TString>;
        itemId: Type.TOptional<Type.TString>;
        parentId: Type.TOptional<Type.TString>;
        payload: Type.TUnknown;
      }>
    >
  >;
}>;
/** Managed-room record returned to clients after joining an existing Talk session. */
declare const TalkSessionJoinResultSchema: Type.TObject<{
  id: Type.TString;
  roomId: Type.TString;
  roomUrl: Type.TString;
  sessionKey: Type.TString;
  sessionId: Type.TOptional<Type.TString>;
  channel: Type.TOptional<Type.TString>;
  target: Type.TOptional<Type.TString>;
  provider: Type.TOptional<Type.TString>;
  model: Type.TOptional<Type.TString>;
  voice: Type.TOptional<Type.TString>;
  mode: Type.TUnion<
    [Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]
  >;
  transport: Type.TUnion<
    [
      Type.TLiteral<"webrtc">,
      Type.TLiteral<"provider-websocket">,
      Type.TLiteral<"gateway-relay">,
      Type.TLiteral<"managed-room">,
    ]
  >;
  brain: Type.TUnion<
    [Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]
  >;
  createdAt: Type.TNumber;
  expiresAt: Type.TNumber;
  room: Type.TObject<{
    activeClientId: Type.TOptional<Type.TString>;
    activeTurnId: Type.TOptional<Type.TString>;
    recentTalkEvents: Type.TArray<
      Type.TObject<{
        id: Type.TString;
        type: Type.TUnion<
          [
            Type.TLiteral<"session.started">,
            Type.TLiteral<"session.ready">,
            Type.TLiteral<"session.closed">,
            Type.TLiteral<"session.error">,
            Type.TLiteral<"session.replaced">,
            Type.TLiteral<"turn.started">,
            Type.TLiteral<"turn.ended">,
            Type.TLiteral<"turn.cancelled">,
            Type.TLiteral<"capture.started">,
            Type.TLiteral<"capture.stopped">,
            Type.TLiteral<"capture.cancelled">,
            Type.TLiteral<"capture.once">,
            Type.TLiteral<"input.audio.delta">,
            Type.TLiteral<"input.audio.committed">,
            Type.TLiteral<"transcript.delta">,
            Type.TLiteral<"transcript.done">,
            Type.TLiteral<"output.text.delta">,
            Type.TLiteral<"output.text.done">,
            Type.TLiteral<"output.audio.started">,
            Type.TLiteral<"output.audio.delta">,
            Type.TLiteral<"output.audio.done">,
            Type.TLiteral<"tool.call">,
            Type.TLiteral<"tool.progress">,
            Type.TLiteral<"tool.result">,
            Type.TLiteral<"tool.error">,
            Type.TLiteral<"usage.metrics">,
            Type.TLiteral<"latency.metrics">,
            Type.TLiteral<"health.changed">,
          ]
        >;
        sessionId: Type.TString;
        turnId: Type.TOptional<Type.TString>;
        captureId: Type.TOptional<Type.TString>;
        seq: Type.TInteger;
        timestamp: Type.TString;
        mode: Type.TUnion<
          [Type.TLiteral<"realtime">, Type.TLiteral<"stt-tts">, Type.TLiteral<"transcription">]
        >;
        transport: Type.TUnion<
          [
            Type.TLiteral<"webrtc">,
            Type.TLiteral<"provider-websocket">,
            Type.TLiteral<"gateway-relay">,
            Type.TLiteral<"managed-room">,
          ]
        >;
        brain: Type.TUnion<
          [Type.TLiteral<"agent-consult">, Type.TLiteral<"direct-tools">, Type.TLiteral<"none">]
        >;
        provider: Type.TOptional<Type.TString>;
        final: Type.TOptional<Type.TBoolean>;
        callId: Type.TOptional<Type.TString>;
        itemId: Type.TOptional<Type.TString>;
        parentId: Type.TOptional<Type.TString>;
        payload: Type.TUnknown;
      }>
    >;
  }>;
}>;
/** Generic success result for Talk session lifecycle calls. */
declare const TalkSessionOkResultSchema: Type.TObject<{
  ok: Type.TBoolean;
}>;
/** Union of all browser Talk session setup payloads. */
declare const TalkClientCreateResultSchema: Type.TUnion<
  [
    Type.TObject<{
      provider: Type.TString;
      transport: Type.TLiteral<"webrtc">;
      clientSecret: Type.TString;
      offerUrl: Type.TOptional<Type.TString>;
      offerHeaders: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
      model: Type.TOptional<Type.TString>;
      voice: Type.TOptional<Type.TString>;
      expiresAt: Type.TOptional<Type.TNumber>;
    }>,
    Type.TObject<{
      provider: Type.TString;
      transport: Type.TLiteral<"provider-websocket">;
      protocol: Type.TString;
      clientSecret: Type.TString;
      websocketUrl: Type.TString;
      audio: Type.TObject<{
        inputEncoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
        inputSampleRateHz: Type.TInteger;
        outputEncoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
        outputSampleRateHz: Type.TInteger;
      }>;
      initialMessage: Type.TOptional<Type.TUnknown>;
      model: Type.TOptional<Type.TString>;
      voice: Type.TOptional<Type.TString>;
      expiresAt: Type.TOptional<Type.TNumber>;
    }>,
    Type.TObject<{
      provider: Type.TString;
      transport: Type.TLiteral<"gateway-relay">;
      relaySessionId: Type.TString;
      audio: Type.TObject<{
        inputEncoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
        inputSampleRateHz: Type.TInteger;
        outputEncoding: Type.TUnion<[Type.TLiteral<"pcm16">, Type.TLiteral<"g711_ulaw">]>;
        outputSampleRateHz: Type.TInteger;
      }>;
      model: Type.TOptional<Type.TString>;
      voice: Type.TOptional<Type.TString>;
      expiresAt: Type.TOptional<Type.TNumber>;
    }>,
    Type.TObject<{
      provider: Type.TString;
      transport: Type.TLiteral<"managed-room">;
      roomUrl: Type.TString;
      token: Type.TOptional<Type.TString>;
      model: Type.TOptional<Type.TString>;
      voice: Type.TOptional<Type.TString>;
      expiresAt: Type.TOptional<Type.TNumber>;
    }>,
  ]
>;
/** Full Talk config read result, including related session/UI context. */
declare const TalkConfigResultSchema: Type.TObject<{
  config: Type.TObject<{
    talk: Type.TOptional<
      Type.TObject<{
        provider: Type.TOptional<Type.TString>;
        providers: Type.TOptional<
          Type.TRecord<
            "^.*$",
            Type.TObject<{
              apiKey: Type.TOptional<
                Type.TUnion<
                  [
                    Type.TString,
                    Type.TUnion<
                      [
                        Type.TObject<{
                          source: Type.TLiteral<"env">;
                          provider: Type.TString;
                          id: Type.TString;
                        }>,
                        Type.TObject<{
                          source: Type.TLiteral<"file">;
                          provider: Type.TString;
                          id: Type.TUnsafe<string>;
                        }>,
                        Type.TObject<{
                          source: Type.TLiteral<"exec">;
                          provider: Type.TString;
                          id: Type.TString;
                        }>,
                      ]
                    >,
                  ]
                >
              >;
            }>
          >
        >;
        realtime: Type.TOptional<
          Type.TObject<{
            provider: Type.TOptional<Type.TString>;
            providers: Type.TOptional<
              Type.TRecord<
                "^.*$",
                Type.TObject<{
                  apiKey: Type.TOptional<
                    Type.TUnion<
                      [
                        Type.TString,
                        Type.TUnion<
                          [
                            Type.TObject<{
                              source: Type.TLiteral<"env">;
                              provider: Type.TString;
                              id: Type.TString;
                            }>,
                            Type.TObject<{
                              source: Type.TLiteral<"file">;
                              provider: Type.TString;
                              id: Type.TUnsafe<string>;
                            }>,
                            Type.TObject<{
                              source: Type.TLiteral<"exec">;
                              provider: Type.TString;
                              id: Type.TString;
                            }>,
                          ]
                        >,
                      ]
                    >
                  >;
                }>
              >
            >;
            model: Type.TOptional<Type.TString>;
            speakerVoice: Type.TOptional<Type.TString>;
            speakerVoiceId: Type.TOptional<Type.TString>;
            voice: Type.TOptional<Type.TString>;
            instructions: Type.TOptional<Type.TString>;
            mode: Type.TOptional<
              Type.TUnion<
                [
                  Type.TLiteral<"realtime">,
                  Type.TLiteral<"stt-tts">,
                  Type.TLiteral<"transcription">,
                ]
              >
            >;
            transport: Type.TOptional<
              Type.TUnion<
                [
                  Type.TLiteral<"webrtc">,
                  Type.TLiteral<"provider-websocket">,
                  Type.TLiteral<"gateway-relay">,
                  Type.TLiteral<"managed-room">,
                ]
              >
            >;
            vadThreshold: Type.TOptional<Type.TNumber>;
            silenceDurationMs: Type.TOptional<Type.TInteger>;
            prefixPaddingMs: Type.TOptional<Type.TInteger>;
            reasoningEffort: Type.TOptional<Type.TString>;
            brain: Type.TOptional<
              Type.TUnion<
                [
                  Type.TLiteral<"agent-consult">,
                  Type.TLiteral<"direct-tools">,
                  Type.TLiteral<"none">,
                ]
              >
            >;
            consultRouting: Type.TOptional<
              Type.TUnion<[Type.TLiteral<"provider-direct">, Type.TLiteral<"force-agent-consult">]>
            >;
          }>
        >;
        resolved: Type.TOptional<
          Type.TObject<{
            provider: Type.TString;
            config: Type.TObject<{
              apiKey: Type.TOptional<
                Type.TUnion<
                  [
                    Type.TString,
                    Type.TUnion<
                      [
                        Type.TObject<{
                          source: Type.TLiteral<"env">;
                          provider: Type.TString;
                          id: Type.TString;
                        }>,
                        Type.TObject<{
                          source: Type.TLiteral<"file">;
                          provider: Type.TString;
                          id: Type.TUnsafe<string>;
                        }>,
                        Type.TObject<{
                          source: Type.TLiteral<"exec">;
                          provider: Type.TString;
                          id: Type.TString;
                        }>,
                      ]
                    >,
                  ]
                >
              >;
            }>;
          }>
        >;
        consultThinkingLevel: Type.TOptional<Type.TString>;
        consultFastMode: Type.TOptional<Type.TBoolean>;
        speechLocale: Type.TOptional<Type.TString>;
        interruptOnSpeech: Type.TOptional<Type.TBoolean>;
        silenceTimeoutMs: Type.TOptional<Type.TInteger>;
      }>
    >;
    session: Type.TOptional<
      Type.TObject<{
        mainKey: Type.TOptional<Type.TString>;
      }>
    >;
    ui: Type.TOptional<
      Type.TObject<{
        seamColor: Type.TOptional<Type.TString>;
      }>
    >;
  }>;
}>;
/** Text-to-speech result with encoded audio and provider output metadata. */
declare const TalkSpeakResultSchema: Type.TObject<{
  audioBase64: Type.TString;
  provider: Type.TString;
  outputFormat: Type.TOptional<Type.TString>;
  voiceCompatible: Type.TOptional<Type.TBoolean>;
  mimeType: Type.TOptional<Type.TString>;
  fileExtension: Type.TOptional<Type.TString>;
}>;
/** Text-to-speech result for `tts.speak` with encoded audio and provider metadata. */
declare const TtsSpeakResultSchema: Type.TObject<{
  audioBase64: Type.TString;
  provider: Type.TString;
  outputFormat: Type.TOptional<Type.TString>;
  mimeType: Type.TOptional<Type.TString>;
  fileExtension: Type.TOptional<Type.TString>;
}>;
/** Channel status request, optionally probing one channel before returning. */
declare const ChannelsStatusParamsSchema: Type.TObject<{
  probe: Type.TOptional<Type.TBoolean>;
  timeoutMs: Type.TOptional<Type.TInteger>;
  channel: Type.TOptional<Type.TString>;
}>;
/** Full channel status result for dashboard and operator diagnostics. */
declare const ChannelsStatusResultSchema: Type.TObject<{
  ts: Type.TInteger;
  channelOrder: Type.TArray<Type.TString>;
  channelLabels: Type.TRecord<"^.*$", Type.TString>;
  channelDetailLabels: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
  channelSystemImages: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
  channelMeta: Type.TOptional<
    Type.TArray<
      Type.TObject<{
        id: Type.TString;
        label: Type.TString;
        detailLabel: Type.TString;
        systemImage: Type.TOptional<Type.TString>;
      }>
    >
  >;
  channels: Type.TRecord<"^.*$", Type.TUnknown>;
  channelAccounts: Type.TRecord<
    "^.*$",
    Type.TArray<
      Type.TObject<{
        accountId: Type.TString;
        name: Type.TOptional<Type.TString>;
        enabled: Type.TOptional<Type.TBoolean>;
        configured: Type.TOptional<Type.TBoolean>;
        linked: Type.TOptional<Type.TBoolean>;
        running: Type.TOptional<Type.TBoolean>;
        connected: Type.TOptional<Type.TBoolean>;
        reconnectAttempts: Type.TOptional<Type.TInteger>;
        lastConnectedAt: Type.TOptional<Type.TInteger>;
        lastError: Type.TOptional<Type.TString>;
        healthState: Type.TOptional<Type.TString>;
        lastStartAt: Type.TOptional<Type.TInteger>;
        lastStopAt: Type.TOptional<Type.TInteger>;
        lastInboundAt: Type.TOptional<Type.TInteger>;
        lastOutboundAt: Type.TOptional<Type.TInteger>;
        lastTransportActivityAt: Type.TOptional<Type.TInteger>;
        busy: Type.TOptional<Type.TBoolean>;
        activeRuns: Type.TOptional<Type.TInteger>;
        lastRunActivityAt: Type.TOptional<Type.TInteger>;
        lastProbeAt: Type.TOptional<Type.TInteger>;
        mode: Type.TOptional<Type.TString>;
        dmPolicy: Type.TOptional<Type.TString>;
        allowFrom: Type.TOptional<Type.TArray<Type.TString>>;
        tokenSource: Type.TOptional<Type.TString>;
        botTokenSource: Type.TOptional<Type.TString>;
        appTokenSource: Type.TOptional<Type.TString>;
        baseUrl: Type.TOptional<Type.TString>;
        allowUnmentionedGroups: Type.TOptional<Type.TBoolean>;
        cliPath: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        dbPath: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        port: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
        probe: Type.TOptional<Type.TUnknown>;
        audit: Type.TOptional<Type.TUnknown>;
        application: Type.TOptional<Type.TUnknown>;
      }>
    >
  >;
  channelDefaultAccountId: Type.TRecord<"^.*$", Type.TString>;
  eventLoop: Type.TOptional<
    Type.TObject<{
      degraded: Type.TBoolean;
      reasons: Type.TArray<
        Type.TUnion<
          [
            Type.TLiteral<"event_loop_delay">,
            Type.TLiteral<"event_loop_utilization">,
            Type.TLiteral<"cpu">,
          ]
        >
      >;
      intervalMs: Type.TInteger;
      delayP99Ms: Type.TNumber;
      delayMaxMs: Type.TNumber;
      utilization: Type.TNumber;
      cpuCoreRatio: Type.TNumber;
    }>
  >;
  partial: Type.TOptional<Type.TBoolean>;
  warnings: Type.TOptional<Type.TArray<Type.TString>>;
}>;
/** Logs out one channel account. */
declare const ChannelsLogoutParamsSchema: Type.TObject<{
  channel: Type.TString;
  accountId: Type.TOptional<Type.TString>;
}>;
/** Stops one channel account runtime. */
declare const ChannelsStopParamsSchema: Type.TObject<{
  channel: Type.TString;
  accountId: Type.TOptional<Type.TString>;
}>;
/** Starts one channel account runtime. */
declare const ChannelsStartParamsSchema: Type.TObject<{
  channel: Type.TString;
  accountId: Type.TOptional<Type.TString>;
}>;
/** Starts browser/web login for a channel account. */
declare const WebLoginStartParamsSchema: Type.TObject<{
  force: Type.TOptional<Type.TBoolean>;
  timeoutMs: Type.TOptional<Type.TInteger>;
  verbose: Type.TOptional<Type.TBoolean>;
  accountId: Type.TOptional<Type.TString>;
}>;
/** Waits for web login completion or the next QR code. */
declare const WebLoginWaitParamsSchema: Type.TObject<{
  timeoutMs: Type.TOptional<Type.TInteger>;
  accountId: Type.TOptional<Type.TString>;
  currentQrDataUrl: Type.TOptional<Type.TString>;
}>;
type TalkModeParams = Static<typeof TalkModeParamsSchema>;
type TalkCatalogParams = Static<typeof TalkCatalogParamsSchema>;
type TalkCatalogResult = Static<typeof TalkCatalogResultSchema>;
type TalkConfigParams = Static<typeof TalkConfigParamsSchema>;
type TalkConfigResult = Static<typeof TalkConfigResultSchema>;
type TalkClientCreateParams = Static<typeof TalkClientCreateParamsSchema>;
type TalkClientCreateResult = Static<typeof TalkClientCreateResultSchema>;
type TalkClientSteerParams = Static<typeof TalkClientSteerParamsSchema>;
type TalkAgentControlResult = Static<typeof TalkAgentControlResultSchema>;
type TalkClientToolCallParams = Static<typeof TalkClientToolCallParamsSchema>;
type TalkClientToolCallResult = Static<typeof TalkClientToolCallResultSchema>;
type TalkSessionCreateParams = Static<typeof TalkSessionCreateParamsSchema>;
type TalkSessionCreateResult = Static<typeof TalkSessionCreateResultSchema>;
type TalkSessionJoinParams = Static<typeof TalkSessionJoinParamsSchema>;
type TalkSessionJoinResult = Static<typeof TalkSessionJoinResultSchema>;
type TalkSessionAppendAudioParams = Static<typeof TalkSessionAppendAudioParamsSchema>;
type TalkSessionTurnParams = Static<typeof TalkSessionTurnParamsSchema>;
type TalkSessionCancelTurnParams = Static<typeof TalkSessionCancelTurnParamsSchema>;
type TalkSessionCancelOutputParams = Static<typeof TalkSessionCancelOutputParamsSchema>;
type TalkSessionTurnResult = Static<typeof TalkSessionTurnResultSchema>;
type TalkSessionSteerParams = Static<typeof TalkSessionSteerParamsSchema>;
type TalkSessionSubmitToolResultParams = Static<typeof TalkSessionSubmitToolResultParamsSchema>;
type TalkSessionCloseParams = Static<typeof TalkSessionCloseParamsSchema>;
type TalkSessionOkResult = Static<typeof TalkSessionOkResultSchema>;
type TalkSpeakParams = Static<typeof TalkSpeakParamsSchema>;
type TalkSpeakResult = Static<typeof TalkSpeakResultSchema>;
type TtsSpeakParams = Static<typeof TtsSpeakParamsSchema>;
type TtsSpeakResult = Static<typeof TtsSpeakResultSchema>;
type ChannelsStatusParams = Static<typeof ChannelsStatusParamsSchema>;
type ChannelsStatusResult = Static<typeof ChannelsStatusResultSchema>;
type ChannelsStartParams = Static<typeof ChannelsStartParamsSchema>;
type ChannelsStopParams = Static<typeof ChannelsStopParamsSchema>;
type ChannelsLogoutParams = Static<typeof ChannelsLogoutParamsSchema>;
type WebLoginStartParams = Static<typeof WebLoginStartParamsSchema>;
type WebLoginWaitParams = Static<typeof WebLoginWaitParamsSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/talk-marks.d.ts
/** Acknowledges playback through a named realtime provider mark. */
declare const TalkSessionAcknowledgeMarkParamsSchema: import("typebox").TObject<{
  sessionId: import("typebox").TString;
  markName: import("typebox").TString;
}>;
type TalkSessionAcknowledgeMarkParams = Static<typeof TalkSessionAcknowledgeMarkParamsSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/commands.d.ts
/** One command catalog entry visible to clients. */
declare const CommandEntrySchema: Type.TObject<{
  name: Type.TString;
  nativeName: Type.TOptional<Type.TString>;
  textAliases: Type.TOptional<Type.TArray<Type.TString>>;
  description: Type.TString;
  category: Type.TOptional<
    Type.TUnion<
      [
        Type.TLiteral<"session">,
        Type.TLiteral<"options">,
        Type.TLiteral<"status">,
        Type.TLiteral<"management">,
        Type.TLiteral<"media">,
        Type.TLiteral<"tools">,
        Type.TLiteral<"docks">,
      ]
    >
  >;
  source: Type.TUnion<[Type.TLiteral<"native">, Type.TLiteral<"skill">, Type.TLiteral<"plugin">]>;
  scope: Type.TUnion<[Type.TLiteral<"text">, Type.TLiteral<"native">, Type.TLiteral<"both">]>;
  acceptsArgs: Type.TBoolean;
  args: Type.TOptional<
    Type.TArray<
      Type.TObject<{
        name: Type.TString;
        description: Type.TString;
        type: Type.TUnion<
          [Type.TLiteral<"string">, Type.TLiteral<"number">, Type.TLiteral<"boolean">]
        >;
        required: Type.TOptional<Type.TBoolean>;
        choices: Type.TOptional<
          Type.TArray<
            Type.TObject<{
              value: Type.TString;
              label: Type.TString;
            }>
          >
        >;
        dynamic: Type.TOptional<Type.TBoolean>;
      }>
    >
  >;
}>;
/** Command catalog request filters. */
declare const CommandsListParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  provider: Type.TOptional<Type.TString>;
  scope: Type.TOptional<
    Type.TUnion<[Type.TLiteral<"text">, Type.TLiteral<"native">, Type.TLiteral<"both">]>
  >;
  includeArgs: Type.TOptional<Type.TBoolean>;
}>;
/** Bounded command catalog response. */
declare const CommandsListResultSchema: Type.TObject<{
  commands: Type.TArray<
    Type.TObject<{
      name: Type.TString;
      nativeName: Type.TOptional<Type.TString>;
      textAliases: Type.TOptional<Type.TArray<Type.TString>>;
      description: Type.TString;
      category: Type.TOptional<
        Type.TUnion<
          [
            Type.TLiteral<"session">,
            Type.TLiteral<"options">,
            Type.TLiteral<"status">,
            Type.TLiteral<"management">,
            Type.TLiteral<"media">,
            Type.TLiteral<"tools">,
            Type.TLiteral<"docks">,
          ]
        >
      >;
      source: Type.TUnion<
        [Type.TLiteral<"native">, Type.TLiteral<"skill">, Type.TLiteral<"plugin">]
      >;
      scope: Type.TUnion<[Type.TLiteral<"text">, Type.TLiteral<"native">, Type.TLiteral<"both">]>;
      acceptsArgs: Type.TBoolean;
      args: Type.TOptional<
        Type.TArray<
          Type.TObject<{
            name: Type.TString;
            description: Type.TString;
            type: Type.TUnion<
              [Type.TLiteral<"string">, Type.TLiteral<"number">, Type.TLiteral<"boolean">]
            >;
            required: Type.TOptional<Type.TBoolean>;
            choices: Type.TOptional<
              Type.TArray<
                Type.TObject<{
                  value: Type.TString;
                  label: Type.TString;
                }>
              >
            >;
            dynamic: Type.TOptional<Type.TBoolean>;
          }>
        >
      >;
    }>
  >;
}>;
type CommandEntry = Static<typeof CommandEntrySchema>;
type CommandsListParams = Static<typeof CommandsListParamsSchema>;
type CommandsListResult = Static<typeof CommandsListResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/config.d.ts
/** Empty request payload for reading the current raw config. */
declare const ConfigGetParamsSchema: Type.TObject<{}>;
/** Full raw config replacement request with optional base hash guard. */
declare const ConfigSetParamsSchema: Type.TObject<{
  raw: Type.TString;
  baseHash: Type.TOptional<Type.TString>;
}>;
/** Raw config apply request that may schedule a restart. */
declare const ConfigApplyParamsSchema: Type.TObject<{
  readonly raw: Type.TString;
  readonly baseHash: Type.TOptional<Type.TString>;
  readonly sessionKey: Type.TOptional<Type.TString>;
  readonly deliveryContext: Type.TOptional<
    Type.TObject<{
      channel: Type.TOptional<Type.TString>;
      to: Type.TOptional<Type.TString>;
      accountId: Type.TOptional<Type.TString>;
      threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
    }>
  >;
  readonly note: Type.TOptional<Type.TString>;
  readonly restartDelayMs: Type.TOptional<Type.TInteger>;
}>;
/** Raw config patch request that may schedule a restart. */
declare const ConfigPatchParamsSchema: Type.TObject<{
  replacePaths: Type.TOptional<Type.TArray<Type.TString>>;
  raw: Type.TString;
  baseHash: Type.TOptional<Type.TString>;
  sessionKey: Type.TOptional<Type.TString>;
  deliveryContext: Type.TOptional<
    Type.TObject<{
      channel: Type.TOptional<Type.TString>;
      to: Type.TOptional<Type.TString>;
      accountId: Type.TOptional<Type.TString>;
      threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
    }>
  >;
  note: Type.TOptional<Type.TString>;
  restartDelayMs: Type.TOptional<Type.TInteger>;
}>;
/** Empty request payload for fetching the generated config schema. */
declare const ConfigSchemaParamsSchema: Type.TObject<{}>;
/** Schema lookup request for one config path. */
declare const ConfigSchemaLookupParamsSchema: Type.TObject<{
  path: Type.TString;
}>;
/** Empty request payload for checking update/restart status. */
declare const UpdateStatusParamsSchema: Type.TObject<{}>;
/** Request payload for running an update/restart flow with optional channel delivery context. */
declare const UpdateRunParamsSchema: Type.TObject<{
  sessionKey: Type.TOptional<Type.TString>;
  deliveryContext: Type.TOptional<
    Type.TObject<{
      channel: Type.TOptional<Type.TString>;
      to: Type.TOptional<Type.TString>;
      accountId: Type.TOptional<Type.TString>;
      threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
    }>
  >;
  note: Type.TOptional<Type.TString>;
  continuationMessage: Type.TOptional<Type.TString>;
  restartDelayMs: Type.TOptional<Type.TInteger>;
  timeoutMs: Type.TOptional<Type.TInteger>;
}>;
/** Full generated config schema response. */
declare const ConfigSchemaResponseSchema: Type.TObject<{
  schema: Type.TUnknown;
  uiHints: Type.TRecord<
    "^.*$",
    Type.TObject<{
      label: Type.TOptional<Type.TString>;
      help: Type.TOptional<Type.TString>;
      tags: Type.TOptional<Type.TArray<Type.TString>>;
      group: Type.TOptional<Type.TString>;
      order: Type.TOptional<Type.TInteger>;
      advanced: Type.TOptional<Type.TBoolean>;
      sensitive: Type.TOptional<Type.TBoolean>;
      placeholder: Type.TOptional<Type.TString>;
      itemTemplate: Type.TOptional<Type.TUnknown>;
    }>
  >;
  version: Type.TString;
  generatedAt: Type.TString;
}>;
/** Schema lookup response for one config path and its immediate children. */
declare const ConfigSchemaLookupResultSchema: Type.TObject<{
  path: Type.TString;
  schema: Type.TUnknown;
  reloadKind: Type.TOptional<
    Type.TUnion<[Type.TLiteral<"restart">, Type.TLiteral<"hot">, Type.TLiteral<"none">]>
  >;
  hint: Type.TOptional<
    Type.TObject<{
      label: Type.TOptional<Type.TString>;
      help: Type.TOptional<Type.TString>;
      tags: Type.TOptional<Type.TArray<Type.TString>>;
      group: Type.TOptional<Type.TString>;
      order: Type.TOptional<Type.TInteger>;
      advanced: Type.TOptional<Type.TBoolean>;
      sensitive: Type.TOptional<Type.TBoolean>;
      placeholder: Type.TOptional<Type.TString>;
      itemTemplate: Type.TOptional<Type.TUnknown>;
    }>
  >;
  hintPath: Type.TOptional<Type.TString>;
  children: Type.TArray<
    Type.TObject<{
      key: Type.TString;
      path: Type.TString;
      type: Type.TOptional<Type.TUnion<[Type.TString, Type.TArray<Type.TString>]>>;
      required: Type.TBoolean;
      hasChildren: Type.TBoolean;
      reloadKind: Type.TOptional<
        Type.TUnion<[Type.TLiteral<"restart">, Type.TLiteral<"hot">, Type.TLiteral<"none">]>
      >;
      hint: Type.TOptional<
        Type.TObject<{
          label: Type.TOptional<Type.TString>;
          help: Type.TOptional<Type.TString>;
          tags: Type.TOptional<Type.TArray<Type.TString>>;
          group: Type.TOptional<Type.TString>;
          order: Type.TOptional<Type.TInteger>;
          advanced: Type.TOptional<Type.TBoolean>;
          sensitive: Type.TOptional<Type.TBoolean>;
          placeholder: Type.TOptional<Type.TString>;
          itemTemplate: Type.TOptional<Type.TUnknown>;
        }>
      >;
      hintPath: Type.TOptional<Type.TString>;
    }>
  >;
}>;
type ConfigGetParams = Static<typeof ConfigGetParamsSchema>;
type ConfigSetParams = Static<typeof ConfigSetParamsSchema>;
type ConfigApplyParams = Static<typeof ConfigApplyParamsSchema>;
type ConfigPatchParams = Static<typeof ConfigPatchParamsSchema>;
type ConfigSchemaParams = Static<typeof ConfigSchemaParamsSchema>;
type ConfigSchemaResponse = Static<typeof ConfigSchemaResponseSchema>;
type UpdateStatusParams = Static<typeof UpdateStatusParamsSchema>;
type UpdateRunParams = Static<typeof UpdateRunParamsSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/crestodian.d.ts
/**
 * Crestodian chat lets clients (macOS app onboarding, future UIs) hold the
 * setup/repair conversation over the gateway. The gateway live-tests the
 * configured inference route before creating a session. Omitting `message`
 * returns the welcome/greeting for a verified fresh session without input.
 */
declare const CrestodianChatParamsSchema: Type.TObject<{
  sessionId: Type.TString;
  message: Type.TOptional<Type.TString> /** "onboarding" seeds the first-run setup proposal in the greeting. */;
  welcomeVariant: Type.TOptional<
    Type.TUnion<[Type.TLiteral<"onboarding">]>
  > /** Drop any in-flight approval/wizard state and start the session over. */;
  reset: Type.TOptional<Type.TBoolean>;
}>;
/** One Crestodian reply; `action` tells clients about conversation handoffs. */
declare const CrestodianChatResultSchema: Type.TObject<{
  sessionId: Type.TString;
  reply: Type.TString /** The next reply is a hosted-wizard secret and clients must mask its input/echo. */;
  sensitive: Type.TOptional<Type.TBoolean>;
  action: Type.TUnion<[Type.TLiteral<"none">, Type.TLiteral<"open-agent">, Type.TLiteral<"exit">]>;
}>;
/**
 * Structured first-run inference setup for GUI clients: detect reusable AI
 * access (CLI logins, env keys, existing config), then activate one choice.
 * Activation live-tests the candidate and persists it only on success, so a
 * client can walk the ladder candidate-by-candidate without ever leaving a
 * broken default model behind.
 */
declare const CrestodianSetupDetectParamsSchema: Type.TObject<{}>;
declare const CrestodianSetupDetectResultSchema: Type.TObject<{
  candidates: Type.TArray<
    Type.TObject<{
      kind: Type.TUnion<
        [
          Type.TLiteral<"existing-model">,
          Type.TLiteral<"openai-api-key">,
          Type.TLiteral<"anthropic-api-key">,
          Type.TLiteral<"claude-cli">,
          Type.TLiteral<"codex-cli">,
          Type.TLiteral<"gemini-cli">,
        ]
      >;
      label: Type.TString;
      detail: Type.TString;
      modelRef: Type.TString;
      recommended: Type.TBoolean /** true: verified; false: definitively logged out; absent: unknown. */;
      credentials: Type.TOptional<Type.TBoolean>;
    }>
  > /** Text-inference key/token methods exposed by the Gateway provider registry. */;
  manualProviders: Type.TArray<
    Type.TObject<{
      /** Opaque provider-auth choice sent back during activation. */ id: Type.TString;
      label: Type.TString;
      hint: Type.TOptional<Type.TString>;
    }>
  > /** Provider-owned browser and device-code login methods. */;
  authOptions: Type.TOptional<
    Type.TArray<
      Type.TObject<{
        id: Type.TString;
        label: Type.TString;
        hint: Type.TOptional<Type.TString>;
        groupLabel: Type.TOptional<Type.TString>;
        kind: Type.TUnion<[Type.TLiteral<"oauth">, Type.TLiteral<"device-code">]>;
        featured: Type.TBoolean;
      }>
    >
  >;
  workspace: Type.TString;
  codexAppServerDetected: Type.TOptional<Type.TBoolean>;
  configuredModel: Type.TOptional<Type.TString>;
  setupComplete: Type.TBoolean;
}>;
/** Live verification of the Gateway's current default-agent inference route. */
declare const CrestodianSetupVerifyParamsSchema: Type.TObject<{}>;
declare const CrestodianSetupVerifyResultSchema: Type.TUnion<
  [
    Type.TObject<{
      ok: Type.TLiteral<true>;
      modelRef: Type.TString;
      latencyMs: Type.TNumber;
    }>,
    Type.TObject<{
      ok: Type.TLiteral<false>;
      status: Type.TUnion<
        [
          Type.TLiteral<"auth">,
          Type.TLiteral<"rate_limit">,
          Type.TLiteral<"billing">,
          Type.TLiteral<"timeout">,
          Type.TLiteral<"format">,
          Type.TLiteral<"unavailable">,
          Type.TLiteral<"unknown">,
        ]
      >;
      error: Type.TString;
    }>,
  ]
>;
declare const CrestodianSetupActivateParamsSchema: Type.TObject<{
  kind: Type.TUnion<
    [
      Type.TLiteral<"existing-model">,
      Type.TLiteral<"openai-api-key">,
      Type.TLiteral<"anthropic-api-key">,
      Type.TLiteral<"claude-cli">,
      Type.TLiteral<"codex-cli">,
      Type.TLiteral<"gemini-cli">,
      Type.TLiteral<"api-key">,
    ]
  > /** Exact detected model for this route; prevents detect/activate drift. */;
  modelRef: Type.TOptional<Type.TString> /** Manual step only: opaque provider-auth choice returned by detection. */;
  authChoice: Type.TOptional<Type.TString> /** Manual step only: the pasted API key or token; masked by clients, never echoed. */;
  apiKey: Type.TOptional<Type.TString>;
  workspace: Type.TOptional<Type.TString>;
}>;
declare const CrestodianSetupActivateResultSchema: Type.TObject<{
  ok: Type.TBoolean /** Present on success: the model ref that answered the live test. */;
  modelRef: Type.TOptional<Type.TString>;
  latencyMs: Type.TOptional<Type.TNumber> /** Human-readable setup summary lines (workspace, model, gateway). */;
  lines: Type.TOptional<
    Type.TArray<Type.TString>
  > /** Present on failure: coarse bucket for client copy + docs links. */;
  status: Type.TOptional<
    Type.TUnion<
      [
        Type.TLiteral<"ok">,
        Type.TLiteral<"auth">,
        Type.TLiteral<"rate_limit">,
        Type.TLiteral<"billing">,
        Type.TLiteral<"timeout">,
        Type.TLiteral<"format">,
        Type.TLiteral<"unavailable">,
        Type.TLiteral<"unknown">,
      ]
    >
  >;
  error: Type.TOptional<Type.TString>;
}>;
/** Starts one provider-owned interactive login as a gateway wizard session. */
declare const CrestodianSetupAuthStartParamsSchema: Type.TObject<{
  /** Client-generated so cancellation remains possible if the start reply is lost. */ sessionId: Type.TString;
  authChoice: Type.TString;
  workspace: Type.TOptional<Type.TString>;
}>;
declare const CrestodianSetupAuthStartResultSchema: Type.TObject<{
  done: Type.TBoolean;
  step: Type.TOptional<
    Type.TObject<{
      id: Type.TString;
      type: Type.TUnion<
        [
          Type.TLiteral<"note">,
          Type.TLiteral<"select">,
          Type.TLiteral<"text">,
          Type.TLiteral<"confirm">,
          Type.TLiteral<"multiselect">,
          Type.TLiteral<"progress">,
          Type.TLiteral<"action">,
        ]
      >;
      title: Type.TOptional<Type.TString>;
      message: Type.TOptional<Type.TString>;
      format: Type.TOptional<Type.TUnion<[Type.TLiteral<"plain">]>>;
      options: Type.TOptional<
        Type.TArray<
          Type.TObject<{
            value: Type.TUnknown;
            label: Type.TString;
            hint: Type.TOptional<Type.TString>;
          }>
        >
      >;
      initialValue: Type.TOptional<Type.TUnknown>;
      placeholder: Type.TOptional<Type.TString>;
      sensitive: Type.TOptional<Type.TBoolean>;
      executor: Type.TOptional<Type.TUnion<[Type.TLiteral<"gateway">, Type.TLiteral<"client">]>>;
      externalUrl: Type.TOptional<Type.TString>;
      deviceCode: Type.TOptional<
        Type.TObject<{
          code: Type.TString;
          expiresInMinutes: Type.TOptional<Type.TInteger>;
          message: Type.TOptional<Type.TString>;
        }>
      >;
    }>
  >;
  status: Type.TOptional<
    Type.TUnion<
      [
        Type.TLiteral<"running">,
        Type.TLiteral<"done">,
        Type.TLiteral<"cancelled">,
        Type.TLiteral<"error">,
      ]
    >
  >;
  error: Type.TOptional<Type.TString>;
  channels: Type.TOptional<Type.TArray<Type.TString>>;
  accounts: Type.TOptional<
    Type.TArray<
      Type.TObject<{
        channel: Type.TString;
        accountId: Type.TString;
      }>
    >
  >;
  sessionId: Type.TString;
}>;
type CrestodianChatParams = Static<typeof CrestodianChatParamsSchema>;
type CrestodianChatResult = Static<typeof CrestodianChatResultSchema>;
type CrestodianSetupDetectParams = Static<typeof CrestodianSetupDetectParamsSchema>;
type CrestodianSetupDetectResult = Static<typeof CrestodianSetupDetectResultSchema>;
type CrestodianSetupActivateParams = Static<typeof CrestodianSetupActivateParamsSchema>;
type CrestodianSetupActivateResult = Static<typeof CrestodianSetupActivateResultSchema>;
type CrestodianSetupVerifyParams = Static<typeof CrestodianSetupVerifyParamsSchema>;
type CrestodianSetupVerifyResult = Static<typeof CrestodianSetupVerifyResultSchema>;
type CrestodianSetupAuthStartParams = Static<typeof CrestodianSetupAuthStartParamsSchema>;
type CrestodianSetupAuthStartResult = Static<typeof CrestodianSetupAuthStartResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/cron.d.ts
/** Persisted cron job definition returned by scheduler list/get APIs. */
declare const CronJobSchema: Type.TObject<{
  id: Type.TString;
  declarationKey: Type.TOptional<Type.TString>;
  displayName: Type.TOptional<Type.TString>;
  owner: Type.TOptional<
    Type.TObject<{
      agentId: Type.TOptional<Type.TString>;
      sessionKey: Type.TOptional<Type.TString>;
    }>
  >;
  agentId: Type.TOptional<Type.TString>;
  sessionKey: Type.TOptional<Type.TString>;
  name: Type.TString;
  description: Type.TOptional<Type.TString>;
  enabled: Type.TBoolean;
  deleteAfterRun: Type.TOptional<Type.TBoolean>;
  createdAtMs: Type.TInteger;
  updatedAtMs: Type.TInteger /** Opaque Gateway-computed token for the job definition, excluding scheduler state. */;
  configRevision: Type.TOptional<Type.TString>;
  schedule: Type.TUnion<
    [
      Type.TObject<{
        kind: Type.TLiteral<"at">;
        at: Type.TString;
      }>,
      Type.TObject<{
        kind: Type.TLiteral<"every">;
        everyMs: Type.TInteger;
        anchorMs: Type.TOptional<Type.TInteger>;
      }>,
      Type.TObject<{
        kind: Type.TLiteral<"cron">;
        expr: Type.TString;
        tz: Type.TOptional<Type.TString>;
        staggerMs: Type.TOptional<Type.TInteger>;
      }>,
      Type.TObject<{
        kind: Type.TLiteral<"on-exit">;
        command: Type.TString;
        cwd: Type.TOptional<Type.TString>;
      }>,
    ]
  >;
  trigger: Type.TOptional<
    Type.TObject<{
      script: Type.TString;
      once: Type.TOptional<Type.TBoolean>;
    }>
  >;
  sessionTarget: Type.TUnion<
    [Type.TLiteral<"main">, Type.TLiteral<"isolated">, Type.TLiteral<"current">, Type.TString]
  >;
  wakeMode: Type.TUnion<[Type.TLiteral<"next-heartbeat">, Type.TLiteral<"now">]>;
  payload: Type.TUnion<
    [
      Type.TObject<{
        kind: Type.TLiteral<"systemEvent">;
        text: Type.TString;
      }>,
      Type.TObject<{
        kind: Type.TLiteral<"agentTurn">;
        message: Type.TSchema;
        model: Type.TOptional<Type.TSchema>;
        fallbacks: Type.TOptional<Type.TSchema>;
        thinking: Type.TOptional<Type.TSchema>;
        timeoutSeconds: Type.TOptional<Type.TNumber>;
        allowUnsafeExternalContent: Type.TOptional<Type.TBoolean>;
        lightContext: Type.TOptional<Type.TBoolean>;
        toolsAllow: Type.TOptional<Type.TSchema>;
        toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
      }>,
      Type.TObject<{
        kind: Type.TLiteral<"command">;
        argv: Type.TSchema;
        cwd: Type.TOptional<Type.TString>;
        env: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
        input: Type.TOptional<Type.TString>;
        timeoutSeconds: Type.TOptional<Type.TNumber>;
        noOutputTimeoutSeconds: Type.TOptional<Type.TNumber>;
        outputMaxBytes: Type.TOptional<Type.TInteger>;
      }>,
    ]
  >;
  delivery: Type.TOptional<
    Type.TUnion<
      [
        Type.TObject<{
          to: Type.TOptional<Type.TString>;
          channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
          threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
          accountId: Type.TOptional<Type.TString>;
          bestEffort: Type.TOptional<Type.TBoolean>;
          failureDestination: Type.TOptional<
            Type.TObject<{
              channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
              to: Type.TOptional<Type.TString>;
              accountId: Type.TOptional<Type.TString>;
              mode: Type.TOptional<
                Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>
              >;
            }>
          >;
          mode: Type.TLiteral<"none">;
        }>,
        Type.TObject<{
          completionDestination: Type.TOptional<
            Type.TObject<{
              mode: Type.TLiteral<"webhook">;
              to: Type.TString;
            }>
          >;
          to: Type.TOptional<Type.TString>;
          channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
          threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
          accountId: Type.TOptional<Type.TString>;
          bestEffort: Type.TOptional<Type.TBoolean>;
          failureDestination: Type.TOptional<
            Type.TObject<{
              channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
              to: Type.TOptional<Type.TString>;
              accountId: Type.TOptional<Type.TString>;
              mode: Type.TOptional<
                Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>
              >;
            }>
          >;
          mode: Type.TLiteral<"announce">;
        }>,
        Type.TObject<{
          to: Type.TString;
          channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
          threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
          accountId: Type.TOptional<Type.TString>;
          bestEffort: Type.TOptional<Type.TBoolean>;
          failureDestination: Type.TOptional<
            Type.TObject<{
              channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
              to: Type.TOptional<Type.TString>;
              accountId: Type.TOptional<Type.TString>;
              mode: Type.TOptional<
                Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>
              >;
            }>
          >;
          mode: Type.TLiteral<"webhook">;
        }>,
      ]
    >
  >;
  failureAlert: Type.TOptional<
    Type.TUnion<
      [
        Type.TLiteral<false>,
        Type.TObject<{
          after: Type.TOptional<Type.TInteger>;
          channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
          to: Type.TOptional<Type.TString>;
          cooldownMs: Type.TOptional<Type.TInteger>;
          includeSkipped: Type.TOptional<Type.TBoolean>;
          mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
          accountId: Type.TOptional<Type.TString>;
        }>,
      ]
    >
  >;
  state: Type.TObject<{
    nextRunAtMs: Type.TOptional<Type.TInteger>;
    runningAtMs: Type.TOptional<Type.TInteger>;
    lastRunAtMs: Type.TOptional<Type.TInteger>;
    lastRunStatus: Type.TOptional<
      Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>
    >;
    lastStatus: Type.TOptional<
      Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>
    >;
    lastError: Type.TOptional<Type.TString>;
    lastDiagnostics: Type.TOptional<
      Type.TObject<{
        summary: Type.TOptional<Type.TString>;
        entries: Type.TArray<
          Type.TObject<{
            ts: Type.TInteger;
            source: Type.TUnion<
              [
                Type.TLiteral<"cron-preflight">,
                Type.TLiteral<"cron-setup">,
                Type.TLiteral<"model-preflight">,
                Type.TLiteral<"agent-run">,
                Type.TLiteral<"tool">,
                Type.TLiteral<"exec">,
                Type.TLiteral<"delivery">,
              ]
            >;
            severity: Type.TUnion<
              [Type.TLiteral<"info">, Type.TLiteral<"warn">, Type.TLiteral<"error">]
            >;
            message: Type.TString;
            toolName: Type.TOptional<Type.TString>;
            exitCode: Type.TOptional<Type.TUnion<[Type.TNumber, Type.TNull]>>;
            truncated: Type.TOptional<Type.TBoolean>;
          }>
        >;
      }>
    >;
    lastDiagnosticSummary: Type.TOptional<Type.TString>;
    lastErrorReason: Type.TOptional<
      Type.TUnion<
        [
          Type.TLiteral<"auth">,
          Type.TLiteral<"auth_permanent">,
          Type.TLiteral<"format">,
          Type.TLiteral<"rate_limit">,
          Type.TLiteral<"overloaded">,
          Type.TLiteral<"billing">,
          Type.TLiteral<"server_error">,
          Type.TLiteral<"timeout">,
          Type.TLiteral<"context_overflow">,
          Type.TLiteral<"model_not_found">,
          Type.TLiteral<"session_expired">,
          Type.TLiteral<"empty_response">,
          Type.TLiteral<"no_error_details">,
          Type.TLiteral<"unclassified">,
          Type.TLiteral<"unknown">,
        ]
      >
    >;
    lastDurationMs: Type.TOptional<Type.TInteger>;
    consecutiveErrors: Type.TOptional<Type.TInteger>;
    consecutiveSkipped: Type.TOptional<Type.TInteger>;
    lastDelivered: Type.TOptional<Type.TBoolean>;
    lastDeliveryStatus: Type.TOptional<
      Type.TUnion<
        [
          Type.TLiteral<"delivered">,
          Type.TLiteral<"not-delivered">,
          Type.TLiteral<"unknown">,
          Type.TLiteral<"not-requested">,
        ]
      >
    >;
    lastDeliveryError: Type.TOptional<Type.TString>;
    lastFailureNotificationDelivered: Type.TOptional<Type.TBoolean>;
    lastFailureNotificationDeliveryStatus: Type.TOptional<
      Type.TUnion<
        [
          Type.TLiteral<"delivered">,
          Type.TLiteral<"not-delivered">,
          Type.TLiteral<"unknown">,
          Type.TLiteral<"not-requested">,
        ]
      >
    >;
    lastFailureNotificationDeliveryError: Type.TOptional<Type.TString>;
    lastFailureAlertAtMs: Type.TOptional<Type.TInteger>;
    lastTriggerEvalAtMs: Type.TOptional<Type.TInteger>;
    triggerEvalCount: Type.TOptional<Type.TInteger>;
    lastTriggerFireAtMs: Type.TOptional<Type.TInteger>;
    triggerState: Type.TOptional<Type.TUnknown>;
  }>;
  nextRunAtMs: Type.TOptional<Type.TInteger>;
  lastRunAtMs: Type.TOptional<Type.TInteger>;
  lastRunStatus: Type.TOptional<
    Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>
  >;
  lastRunError: Type.TOptional<Type.TString>;
  lastDelivered: Type.TOptional<Type.TBoolean>;
  lastDeliveryStatus: Type.TOptional<
    Type.TUnion<
      [
        Type.TLiteral<"delivered">,
        Type.TLiteral<"not-delivered">,
        Type.TLiteral<"unknown">,
        Type.TLiteral<"not-requested">,
      ]
    >
  >;
  lastDeliveryError: Type.TOptional<Type.TString>;
  lastFailureNotificationDelivered: Type.TOptional<Type.TBoolean>;
  lastFailureNotificationDeliveryStatus: Type.TOptional<
    Type.TUnion<
      [
        Type.TLiteral<"delivered">,
        Type.TLiteral<"not-delivered">,
        Type.TLiteral<"unknown">,
        Type.TLiteral<"not-requested">,
      ]
    >
  >;
  lastFailureNotificationDeliveryError: Type.TOptional<Type.TString>;
}>;
/** Query params for listing cron jobs with filters and pagination. */
declare const CronListParamsSchema: Type.TObject<{
  includeDisabled: Type.TOptional<Type.TBoolean>;
  limit: Type.TOptional<Type.TInteger>;
  offset: Type.TOptional<Type.TInteger>;
  query: Type.TOptional<Type.TString>;
  enabled: Type.TOptional<
    Type.TUnion<[Type.TLiteral<"all">, Type.TLiteral<"enabled">, Type.TLiteral<"disabled">]>
  >;
  scheduleKind: Type.TOptional<
    Type.TUnion<
      [
        Type.TLiteral<"all">,
        Type.TLiteral<"at">,
        Type.TLiteral<"every">,
        Type.TLiteral<"cron">,
        Type.TLiteral<"on-exit">,
      ]
    >
  >;
  lastRunStatus: Type.TOptional<
    Type.TUnion<
      [
        Type.TLiteral<"all">,
        Type.TLiteral<"ok">,
        Type.TLiteral<"error">,
        Type.TLiteral<"skipped">,
        Type.TLiteral<"unknown">,
      ]
    >
  >;
  sortBy: Type.TOptional<
    Type.TUnion<[Type.TLiteral<"nextRunAtMs">, Type.TLiteral<"updatedAtMs">, Type.TLiteral<"name">]>
  >;
  sortDir: Type.TOptional<Type.TUnion<[Type.TLiteral<"asc">, Type.TLiteral<"desc">]>>;
  agentId: Type.TOptional<Type.TString>;
  compact: Type.TOptional<Type.TBoolean>;
}>;
/** Empty request payload for scheduler status. */
declare const CronStatusParamsSchema: Type.TObject<{}>;
/** Looks up a job by stable id or legacy jobId alias. */
declare const CronGetParamsSchema: Type.TUnion<
  [
    Type.TObject<{
      id: Type.TString;
    }>,
    Type.TObject<{
      jobId: Type.TString;
    }>,
  ]
>;
/** Creates a scheduled job with schedule, target, payload, and delivery policy. */
declare const CronAddParamsSchema: Type.TObject<{
  schedule: Type.TUnion<
    [
      Type.TObject<{
        kind: Type.TLiteral<"at">;
        at: Type.TString;
      }>,
      Type.TObject<{
        kind: Type.TLiteral<"every">;
        everyMs: Type.TInteger;
        anchorMs: Type.TOptional<Type.TInteger>;
      }>,
      Type.TObject<{
        kind: Type.TLiteral<"cron">;
        expr: Type.TString;
        tz: Type.TOptional<Type.TString>;
        staggerMs: Type.TOptional<Type.TInteger>;
      }>,
      Type.TObject<{
        kind: Type.TLiteral<"on-exit">;
        command: Type.TString;
        cwd: Type.TOptional<Type.TString>;
      }>,
    ]
  >;
  trigger: Type.TOptional<
    Type.TObject<{
      script: Type.TString;
      once: Type.TOptional<Type.TBoolean>;
    }>
  >;
  sessionTarget: Type.TUnion<
    [Type.TLiteral<"main">, Type.TLiteral<"isolated">, Type.TLiteral<"current">, Type.TString]
  >;
  wakeMode: Type.TUnion<[Type.TLiteral<"next-heartbeat">, Type.TLiteral<"now">]>;
  payload: Type.TUnion<
    [
      Type.TObject<{
        kind: Type.TLiteral<"systemEvent">;
        text: Type.TString;
      }>,
      Type.TObject<{
        kind: Type.TLiteral<"agentTurn">;
        message: Type.TSchema;
        model: Type.TOptional<Type.TSchema>;
        fallbacks: Type.TOptional<Type.TSchema>;
        thinking: Type.TOptional<Type.TSchema>;
        timeoutSeconds: Type.TOptional<Type.TNumber>;
        allowUnsafeExternalContent: Type.TOptional<Type.TBoolean>;
        lightContext: Type.TOptional<Type.TBoolean>;
        toolsAllow: Type.TOptional<Type.TSchema>;
        toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
      }>,
      Type.TObject<{
        kind: Type.TLiteral<"command">;
        argv: Type.TSchema;
        cwd: Type.TOptional<Type.TString>;
        env: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
        input: Type.TOptional<Type.TString>;
        timeoutSeconds: Type.TOptional<Type.TNumber>;
        noOutputTimeoutSeconds: Type.TOptional<Type.TNumber>;
        outputMaxBytes: Type.TOptional<Type.TInteger>;
      }>,
    ]
  >;
  delivery: Type.TOptional<
    Type.TUnion<
      [
        Type.TObject<{
          to: Type.TOptional<Type.TString>;
          channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
          threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
          accountId: Type.TOptional<Type.TString>;
          bestEffort: Type.TOptional<Type.TBoolean>;
          failureDestination: Type.TOptional<
            Type.TObject<{
              channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
              to: Type.TOptional<Type.TString>;
              accountId: Type.TOptional<Type.TString>;
              mode: Type.TOptional<
                Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>
              >;
            }>
          >;
          mode: Type.TLiteral<"none">;
        }>,
        Type.TObject<{
          completionDestination: Type.TOptional<
            Type.TObject<{
              mode: Type.TLiteral<"webhook">;
              to: Type.TString;
            }>
          >;
          to: Type.TOptional<Type.TString>;
          channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
          threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
          accountId: Type.TOptional<Type.TString>;
          bestEffort: Type.TOptional<Type.TBoolean>;
          failureDestination: Type.TOptional<
            Type.TObject<{
              channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
              to: Type.TOptional<Type.TString>;
              accountId: Type.TOptional<Type.TString>;
              mode: Type.TOptional<
                Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>
              >;
            }>
          >;
          mode: Type.TLiteral<"announce">;
        }>,
        Type.TObject<{
          to: Type.TString;
          channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
          threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
          accountId: Type.TOptional<Type.TString>;
          bestEffort: Type.TOptional<Type.TBoolean>;
          failureDestination: Type.TOptional<
            Type.TObject<{
              channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
              to: Type.TOptional<Type.TString>;
              accountId: Type.TOptional<Type.TString>;
              mode: Type.TOptional<
                Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>
              >;
            }>
          >;
          mode: Type.TLiteral<"webhook">;
        }>,
      ]
    >
  >;
  failureAlert: Type.TOptional<
    Type.TUnion<
      [
        Type.TLiteral<false>,
        Type.TObject<{
          after: Type.TOptional<Type.TInteger>;
          channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
          to: Type.TOptional<Type.TString>;
          cooldownMs: Type.TOptional<Type.TInteger>;
          includeSkipped: Type.TOptional<Type.TBoolean>;
          mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
          accountId: Type.TOptional<Type.TString>;
        }>,
      ]
    >
  >;
  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  sessionKey: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  description: Type.TOptional<Type.TString>;
  enabled: Type.TOptional<Type.TBoolean>;
  deleteAfterRun: Type.TOptional<Type.TBoolean>;
  name: Type.TString;
  declarationKey: Type.TOptional<Type.TString>;
  displayName: Type.TOptional<Type.TString>;
  owner: Type.TOptional<
    Type.TObject<{
      agentId: Type.TOptional<Type.TString>;
      sessionKey: Type.TOptional<Type.TString>;
    }>
  >;
}>;
/** Successful declaration-key convergence result. */
declare const CronDeclarativeAddResultSchema: Type.TObject<{
  created: Type.TBoolean;
  updated: Type.TOptional<Type.TBoolean>;
  job: Type.TObject<{
    id: Type.TString;
    declarationKey: Type.TOptional<Type.TString>;
    displayName: Type.TOptional<Type.TString>;
    owner: Type.TOptional<
      Type.TObject<{
        agentId: Type.TOptional<Type.TString>;
        sessionKey: Type.TOptional<Type.TString>;
      }>
    >;
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
    name: Type.TString;
    description: Type.TOptional<Type.TString>;
    enabled: Type.TBoolean;
    deleteAfterRun: Type.TOptional<Type.TBoolean>;
    createdAtMs: Type.TInteger;
    updatedAtMs: Type.TInteger /** Opaque Gateway-computed token for the job definition, excluding scheduler state. */;
    configRevision: Type.TOptional<Type.TString>;
    schedule: Type.TUnion<
      [
        Type.TObject<{
          kind: Type.TLiteral<"at">;
          at: Type.TString;
        }>,
        Type.TObject<{
          kind: Type.TLiteral<"every">;
          everyMs: Type.TInteger;
          anchorMs: Type.TOptional<Type.TInteger>;
        }>,
        Type.TObject<{
          kind: Type.TLiteral<"cron">;
          expr: Type.TString;
          tz: Type.TOptional<Type.TString>;
          staggerMs: Type.TOptional<Type.TInteger>;
        }>,
        Type.TObject<{
          kind: Type.TLiteral<"on-exit">;
          command: Type.TString;
          cwd: Type.TOptional<Type.TString>;
        }>,
      ]
    >;
    trigger: Type.TOptional<
      Type.TObject<{
        script: Type.TString;
        once: Type.TOptional<Type.TBoolean>;
      }>
    >;
    sessionTarget: Type.TUnion<
      [Type.TLiteral<"main">, Type.TLiteral<"isolated">, Type.TLiteral<"current">, Type.TString]
    >;
    wakeMode: Type.TUnion<[Type.TLiteral<"next-heartbeat">, Type.TLiteral<"now">]>;
    payload: Type.TUnion<
      [
        Type.TObject<{
          kind: Type.TLiteral<"systemEvent">;
          text: Type.TString;
        }>,
        Type.TObject<{
          kind: Type.TLiteral<"agentTurn">;
          message: Type.TSchema;
          model: Type.TOptional<Type.TSchema>;
          fallbacks: Type.TOptional<Type.TSchema>;
          thinking: Type.TOptional<Type.TSchema>;
          timeoutSeconds: Type.TOptional<Type.TNumber>;
          allowUnsafeExternalContent: Type.TOptional<Type.TBoolean>;
          lightContext: Type.TOptional<Type.TBoolean>;
          toolsAllow: Type.TOptional<Type.TSchema>;
          toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
        }>,
        Type.TObject<{
          kind: Type.TLiteral<"command">;
          argv: Type.TSchema;
          cwd: Type.TOptional<Type.TString>;
          env: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
          input: Type.TOptional<Type.TString>;
          timeoutSeconds: Type.TOptional<Type.TNumber>;
          noOutputTimeoutSeconds: Type.TOptional<Type.TNumber>;
          outputMaxBytes: Type.TOptional<Type.TInteger>;
        }>,
      ]
    >;
    delivery: Type.TOptional<
      Type.TUnion<
        [
          Type.TObject<{
            to: Type.TOptional<Type.TString>;
            channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
            threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
            accountId: Type.TOptional<Type.TString>;
            bestEffort: Type.TOptional<Type.TBoolean>;
            failureDestination: Type.TOptional<
              Type.TObject<{
                channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
                to: Type.TOptional<Type.TString>;
                accountId: Type.TOptional<Type.TString>;
                mode: Type.TOptional<
                  Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>
                >;
              }>
            >;
            mode: Type.TLiteral<"none">;
          }>,
          Type.TObject<{
            completionDestination: Type.TOptional<
              Type.TObject<{
                mode: Type.TLiteral<"webhook">;
                to: Type.TString;
              }>
            >;
            to: Type.TOptional<Type.TString>;
            channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
            threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
            accountId: Type.TOptional<Type.TString>;
            bestEffort: Type.TOptional<Type.TBoolean>;
            failureDestination: Type.TOptional<
              Type.TObject<{
                channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
                to: Type.TOptional<Type.TString>;
                accountId: Type.TOptional<Type.TString>;
                mode: Type.TOptional<
                  Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>
                >;
              }>
            >;
            mode: Type.TLiteral<"announce">;
          }>,
          Type.TObject<{
            to: Type.TString;
            channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
            threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
            accountId: Type.TOptional<Type.TString>;
            bestEffort: Type.TOptional<Type.TBoolean>;
            failureDestination: Type.TOptional<
              Type.TObject<{
                channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
                to: Type.TOptional<Type.TString>;
                accountId: Type.TOptional<Type.TString>;
                mode: Type.TOptional<
                  Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>
                >;
              }>
            >;
            mode: Type.TLiteral<"webhook">;
          }>,
        ]
      >
    >;
    failureAlert: Type.TOptional<
      Type.TUnion<
        [
          Type.TLiteral<false>,
          Type.TObject<{
            after: Type.TOptional<Type.TInteger>;
            channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
            to: Type.TOptional<Type.TString>;
            cooldownMs: Type.TOptional<Type.TInteger>;
            includeSkipped: Type.TOptional<Type.TBoolean>;
            mode: Type.TOptional<
              Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>
            >;
            accountId: Type.TOptional<Type.TString>;
          }>,
        ]
      >
    >;
    state: Type.TObject<{
      nextRunAtMs: Type.TOptional<Type.TInteger>;
      runningAtMs: Type.TOptional<Type.TInteger>;
      lastRunAtMs: Type.TOptional<Type.TInteger>;
      lastRunStatus: Type.TOptional<
        Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>
      >;
      lastStatus: Type.TOptional<
        Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>
      >;
      lastError: Type.TOptional<Type.TString>;
      lastDiagnostics: Type.TOptional<
        Type.TObject<{
          summary: Type.TOptional<Type.TString>;
          entries: Type.TArray<
            Type.TObject<{
              ts: Type.TInteger;
              source: Type.TUnion<
                [
                  Type.TLiteral<"cron-preflight">,
                  Type.TLiteral<"cron-setup">,
                  Type.TLiteral<"model-preflight">,
                  Type.TLiteral<"agent-run">,
                  Type.TLiteral<"tool">,
                  Type.TLiteral<"exec">,
                  Type.TLiteral<"delivery">,
                ]
              >;
              severity: Type.TUnion<
                [Type.TLiteral<"info">, Type.TLiteral<"warn">, Type.TLiteral<"error">]
              >;
              message: Type.TString;
              toolName: Type.TOptional<Type.TString>;
              exitCode: Type.TOptional<Type.TUnion<[Type.TNumber, Type.TNull]>>;
              truncated: Type.TOptional<Type.TBoolean>;
            }>
          >;
        }>
      >;
      lastDiagnosticSummary: Type.TOptional<Type.TString>;
      lastErrorReason: Type.TOptional<
        Type.TUnion<
          [
            Type.TLiteral<"auth">,
            Type.TLiteral<"auth_permanent">,
            Type.TLiteral<"format">,
            Type.TLiteral<"rate_limit">,
            Type.TLiteral<"overloaded">,
            Type.TLiteral<"billing">,
            Type.TLiteral<"server_error">,
            Type.TLiteral<"timeout">,
            Type.TLiteral<"context_overflow">,
            Type.TLiteral<"model_not_found">,
            Type.TLiteral<"session_expired">,
            Type.TLiteral<"empty_response">,
            Type.TLiteral<"no_error_details">,
            Type.TLiteral<"unclassified">,
            Type.TLiteral<"unknown">,
          ]
        >
      >;
      lastDurationMs: Type.TOptional<Type.TInteger>;
      consecutiveErrors: Type.TOptional<Type.TInteger>;
      consecutiveSkipped: Type.TOptional<Type.TInteger>;
      lastDelivered: Type.TOptional<Type.TBoolean>;
      lastDeliveryStatus: Type.TOptional<
        Type.TUnion<
          [
            Type.TLiteral<"delivered">,
            Type.TLiteral<"not-delivered">,
            Type.TLiteral<"unknown">,
            Type.TLiteral<"not-requested">,
          ]
        >
      >;
      lastDeliveryError: Type.TOptional<Type.TString>;
      lastFailureNotificationDelivered: Type.TOptional<Type.TBoolean>;
      lastFailureNotificationDeliveryStatus: Type.TOptional<
        Type.TUnion<
          [
            Type.TLiteral<"delivered">,
            Type.TLiteral<"not-delivered">,
            Type.TLiteral<"unknown">,
            Type.TLiteral<"not-requested">,
          ]
        >
      >;
      lastFailureNotificationDeliveryError: Type.TOptional<Type.TString>;
      lastFailureAlertAtMs: Type.TOptional<Type.TInteger>;
      lastTriggerEvalAtMs: Type.TOptional<Type.TInteger>;
      triggerEvalCount: Type.TOptional<Type.TInteger>;
      lastTriggerFireAtMs: Type.TOptional<Type.TInteger>;
      triggerState: Type.TOptional<Type.TUnknown>;
    }>;
    nextRunAtMs: Type.TOptional<Type.TInteger>;
    lastRunAtMs: Type.TOptional<Type.TInteger>;
    lastRunStatus: Type.TOptional<
      Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>
    >;
    lastRunError: Type.TOptional<Type.TString>;
    lastDelivered: Type.TOptional<Type.TBoolean>;
    lastDeliveryStatus: Type.TOptional<
      Type.TUnion<
        [
          Type.TLiteral<"delivered">,
          Type.TLiteral<"not-delivered">,
          Type.TLiteral<"unknown">,
          Type.TLiteral<"not-requested">,
        ]
      >
    >;
    lastDeliveryError: Type.TOptional<Type.TString>;
    lastFailureNotificationDelivered: Type.TOptional<Type.TBoolean>;
    lastFailureNotificationDeliveryStatus: Type.TOptional<
      Type.TUnion<
        [
          Type.TLiteral<"delivered">,
          Type.TLiteral<"not-delivered">,
          Type.TLiteral<"unknown">,
          Type.TLiteral<"not-requested">,
        ]
      >
    >;
    lastFailureNotificationDeliveryError: Type.TOptional<Type.TString>;
  }>;
}>;
/** Successful result from imperative create or declaration-key convergence. */
declare const CronAddResultSchema: Type.TUnion<
  [
    Type.TObject<{
      id: Type.TString;
      declarationKey: Type.TOptional<Type.TString>;
      displayName: Type.TOptional<Type.TString>;
      owner: Type.TOptional<
        Type.TObject<{
          agentId: Type.TOptional<Type.TString>;
          sessionKey: Type.TOptional<Type.TString>;
        }>
      >;
      agentId: Type.TOptional<Type.TString>;
      sessionKey: Type.TOptional<Type.TString>;
      name: Type.TString;
      description: Type.TOptional<Type.TString>;
      enabled: Type.TBoolean;
      deleteAfterRun: Type.TOptional<Type.TBoolean>;
      createdAtMs: Type.TInteger;
      updatedAtMs: Type.TInteger /** Opaque Gateway-computed token for the job definition, excluding scheduler state. */;
      configRevision: Type.TOptional<Type.TString>;
      schedule: Type.TUnion<
        [
          Type.TObject<{
            kind: Type.TLiteral<"at">;
            at: Type.TString;
          }>,
          Type.TObject<{
            kind: Type.TLiteral<"every">;
            everyMs: Type.TInteger;
            anchorMs: Type.TOptional<Type.TInteger>;
          }>,
          Type.TObject<{
            kind: Type.TLiteral<"cron">;
            expr: Type.TString;
            tz: Type.TOptional<Type.TString>;
            staggerMs: Type.TOptional<Type.TInteger>;
          }>,
          Type.TObject<{
            kind: Type.TLiteral<"on-exit">;
            command: Type.TString;
            cwd: Type.TOptional<Type.TString>;
          }>,
        ]
      >;
      trigger: Type.TOptional<
        Type.TObject<{
          script: Type.TString;
          once: Type.TOptional<Type.TBoolean>;
        }>
      >;
      sessionTarget: Type.TUnion<
        [Type.TLiteral<"main">, Type.TLiteral<"isolated">, Type.TLiteral<"current">, Type.TString]
      >;
      wakeMode: Type.TUnion<[Type.TLiteral<"next-heartbeat">, Type.TLiteral<"now">]>;
      payload: Type.TUnion<
        [
          Type.TObject<{
            kind: Type.TLiteral<"systemEvent">;
            text: Type.TString;
          }>,
          Type.TObject<{
            kind: Type.TLiteral<"agentTurn">;
            message: Type.TSchema;
            model: Type.TOptional<Type.TSchema>;
            fallbacks: Type.TOptional<Type.TSchema>;
            thinking: Type.TOptional<Type.TSchema>;
            timeoutSeconds: Type.TOptional<Type.TNumber>;
            allowUnsafeExternalContent: Type.TOptional<Type.TBoolean>;
            lightContext: Type.TOptional<Type.TBoolean>;
            toolsAllow: Type.TOptional<Type.TSchema>;
            toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
          }>,
          Type.TObject<{
            kind: Type.TLiteral<"command">;
            argv: Type.TSchema;
            cwd: Type.TOptional<Type.TString>;
            env: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
            input: Type.TOptional<Type.TString>;
            timeoutSeconds: Type.TOptional<Type.TNumber>;
            noOutputTimeoutSeconds: Type.TOptional<Type.TNumber>;
            outputMaxBytes: Type.TOptional<Type.TInteger>;
          }>,
        ]
      >;
      delivery: Type.TOptional<
        Type.TUnion<
          [
            Type.TObject<{
              to: Type.TOptional<Type.TString>;
              channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
              threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
              accountId: Type.TOptional<Type.TString>;
              bestEffort: Type.TOptional<Type.TBoolean>;
              failureDestination: Type.TOptional<
                Type.TObject<{
                  channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
                  to: Type.TOptional<Type.TString>;
                  accountId: Type.TOptional<Type.TString>;
                  mode: Type.TOptional<
                    Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>
                  >;
                }>
              >;
              mode: Type.TLiteral<"none">;
            }>,
            Type.TObject<{
              completionDestination: Type.TOptional<
                Type.TObject<{
                  mode: Type.TLiteral<"webhook">;
                  to: Type.TString;
                }>
              >;
              to: Type.TOptional<Type.TString>;
              channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
              threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
              accountId: Type.TOptional<Type.TString>;
              bestEffort: Type.TOptional<Type.TBoolean>;
              failureDestination: Type.TOptional<
                Type.TObject<{
                  channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
                  to: Type.TOptional<Type.TString>;
                  accountId: Type.TOptional<Type.TString>;
                  mode: Type.TOptional<
                    Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>
                  >;
                }>
              >;
              mode: Type.TLiteral<"announce">;
            }>,
            Type.TObject<{
              to: Type.TString;
              channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
              threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
              accountId: Type.TOptional<Type.TString>;
              bestEffort: Type.TOptional<Type.TBoolean>;
              failureDestination: Type.TOptional<
                Type.TObject<{
                  channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
                  to: Type.TOptional<Type.TString>;
                  accountId: Type.TOptional<Type.TString>;
                  mode: Type.TOptional<
                    Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>
                  >;
                }>
              >;
              mode: Type.TLiteral<"webhook">;
            }>,
          ]
        >
      >;
      failureAlert: Type.TOptional<
        Type.TUnion<
          [
            Type.TLiteral<false>,
            Type.TObject<{
              after: Type.TOptional<Type.TInteger>;
              channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
              to: Type.TOptional<Type.TString>;
              cooldownMs: Type.TOptional<Type.TInteger>;
              includeSkipped: Type.TOptional<Type.TBoolean>;
              mode: Type.TOptional<
                Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>
              >;
              accountId: Type.TOptional<Type.TString>;
            }>,
          ]
        >
      >;
      state: Type.TObject<{
        nextRunAtMs: Type.TOptional<Type.TInteger>;
        runningAtMs: Type.TOptional<Type.TInteger>;
        lastRunAtMs: Type.TOptional<Type.TInteger>;
        lastRunStatus: Type.TOptional<
          Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>
        >;
        lastStatus: Type.TOptional<
          Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>
        >;
        lastError: Type.TOptional<Type.TString>;
        lastDiagnostics: Type.TOptional<
          Type.TObject<{
            summary: Type.TOptional<Type.TString>;
            entries: Type.TArray<
              Type.TObject<{
                ts: Type.TInteger;
                source: Type.TUnion<
                  [
                    Type.TLiteral<"cron-preflight">,
                    Type.TLiteral<"cron-setup">,
                    Type.TLiteral<"model-preflight">,
                    Type.TLiteral<"agent-run">,
                    Type.TLiteral<"tool">,
                    Type.TLiteral<"exec">,
                    Type.TLiteral<"delivery">,
                  ]
                >;
                severity: Type.TUnion<
                  [Type.TLiteral<"info">, Type.TLiteral<"warn">, Type.TLiteral<"error">]
                >;
                message: Type.TString;
                toolName: Type.TOptional<Type.TString>;
                exitCode: Type.TOptional<Type.TUnion<[Type.TNumber, Type.TNull]>>;
                truncated: Type.TOptional<Type.TBoolean>;
              }>
            >;
          }>
        >;
        lastDiagnosticSummary: Type.TOptional<Type.TString>;
        lastErrorReason: Type.TOptional<
          Type.TUnion<
            [
              Type.TLiteral<"auth">,
              Type.TLiteral<"auth_permanent">,
              Type.TLiteral<"format">,
              Type.TLiteral<"rate_limit">,
              Type.TLiteral<"overloaded">,
              Type.TLiteral<"billing">,
              Type.TLiteral<"server_error">,
              Type.TLiteral<"timeout">,
              Type.TLiteral<"context_overflow">,
              Type.TLiteral<"model_not_found">,
              Type.TLiteral<"session_expired">,
              Type.TLiteral<"empty_response">,
              Type.TLiteral<"no_error_details">,
              Type.TLiteral<"unclassified">,
              Type.TLiteral<"unknown">,
            ]
          >
        >;
        lastDurationMs: Type.TOptional<Type.TInteger>;
        consecutiveErrors: Type.TOptional<Type.TInteger>;
        consecutiveSkipped: Type.TOptional<Type.TInteger>;
        lastDelivered: Type.TOptional<Type.TBoolean>;
        lastDeliveryStatus: Type.TOptional<
          Type.TUnion<
            [
              Type.TLiteral<"delivered">,
              Type.TLiteral<"not-delivered">,
              Type.TLiteral<"unknown">,
              Type.TLiteral<"not-requested">,
            ]
          >
        >;
        lastDeliveryError: Type.TOptional<Type.TString>;
        lastFailureNotificationDelivered: Type.TOptional<Type.TBoolean>;
        lastFailureNotificationDeliveryStatus: Type.TOptional<
          Type.TUnion<
            [
              Type.TLiteral<"delivered">,
              Type.TLiteral<"not-delivered">,
              Type.TLiteral<"unknown">,
              Type.TLiteral<"not-requested">,
            ]
          >
        >;
        lastFailureNotificationDeliveryError: Type.TOptional<Type.TString>;
        lastFailureAlertAtMs: Type.TOptional<Type.TInteger>;
        lastTriggerEvalAtMs: Type.TOptional<Type.TInteger>;
        triggerEvalCount: Type.TOptional<Type.TInteger>;
        lastTriggerFireAtMs: Type.TOptional<Type.TInteger>;
        triggerState: Type.TOptional<Type.TUnknown>;
      }>;
      nextRunAtMs: Type.TOptional<Type.TInteger>;
      lastRunAtMs: Type.TOptional<Type.TInteger>;
      lastRunStatus: Type.TOptional<
        Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>
      >;
      lastRunError: Type.TOptional<Type.TString>;
      lastDelivered: Type.TOptional<Type.TBoolean>;
      lastDeliveryStatus: Type.TOptional<
        Type.TUnion<
          [
            Type.TLiteral<"delivered">,
            Type.TLiteral<"not-delivered">,
            Type.TLiteral<"unknown">,
            Type.TLiteral<"not-requested">,
          ]
        >
      >;
      lastDeliveryError: Type.TOptional<Type.TString>;
      lastFailureNotificationDelivered: Type.TOptional<Type.TBoolean>;
      lastFailureNotificationDeliveryStatus: Type.TOptional<
        Type.TUnion<
          [
            Type.TLiteral<"delivered">,
            Type.TLiteral<"not-delivered">,
            Type.TLiteral<"unknown">,
            Type.TLiteral<"not-requested">,
          ]
        >
      >;
      lastFailureNotificationDeliveryError: Type.TOptional<Type.TString>;
    }>,
    Type.TObject<{
      created: Type.TBoolean;
      updated: Type.TOptional<Type.TBoolean>;
      job: Type.TObject<{
        id: Type.TString;
        declarationKey: Type.TOptional<Type.TString>;
        displayName: Type.TOptional<Type.TString>;
        owner: Type.TOptional<
          Type.TObject<{
            agentId: Type.TOptional<Type.TString>;
            sessionKey: Type.TOptional<Type.TString>;
          }>
        >;
        agentId: Type.TOptional<Type.TString>;
        sessionKey: Type.TOptional<Type.TString>;
        name: Type.TString;
        description: Type.TOptional<Type.TString>;
        enabled: Type.TBoolean;
        deleteAfterRun: Type.TOptional<Type.TBoolean>;
        createdAtMs: Type.TInteger;
        updatedAtMs: Type.TInteger /** Opaque Gateway-computed token for the job definition, excluding scheduler state. */;
        configRevision: Type.TOptional<Type.TString>;
        schedule: Type.TUnion<
          [
            Type.TObject<{
              kind: Type.TLiteral<"at">;
              at: Type.TString;
            }>,
            Type.TObject<{
              kind: Type.TLiteral<"every">;
              everyMs: Type.TInteger;
              anchorMs: Type.TOptional<Type.TInteger>;
            }>,
            Type.TObject<{
              kind: Type.TLiteral<"cron">;
              expr: Type.TString;
              tz: Type.TOptional<Type.TString>;
              staggerMs: Type.TOptional<Type.TInteger>;
            }>,
            Type.TObject<{
              kind: Type.TLiteral<"on-exit">;
              command: Type.TString;
              cwd: Type.TOptional<Type.TString>;
            }>,
          ]
        >;
        trigger: Type.TOptional<
          Type.TObject<{
            script: Type.TString;
            once: Type.TOptional<Type.TBoolean>;
          }>
        >;
        sessionTarget: Type.TUnion<
          [Type.TLiteral<"main">, Type.TLiteral<"isolated">, Type.TLiteral<"current">, Type.TString]
        >;
        wakeMode: Type.TUnion<[Type.TLiteral<"next-heartbeat">, Type.TLiteral<"now">]>;
        payload: Type.TUnion<
          [
            Type.TObject<{
              kind: Type.TLiteral<"systemEvent">;
              text: Type.TString;
            }>,
            Type.TObject<{
              kind: Type.TLiteral<"agentTurn">;
              message: Type.TSchema;
              model: Type.TOptional<Type.TSchema>;
              fallbacks: Type.TOptional<Type.TSchema>;
              thinking: Type.TOptional<Type.TSchema>;
              timeoutSeconds: Type.TOptional<Type.TNumber>;
              allowUnsafeExternalContent: Type.TOptional<Type.TBoolean>;
              lightContext: Type.TOptional<Type.TBoolean>;
              toolsAllow: Type.TOptional<Type.TSchema>;
              toolsAllowIsDefault: Type.TOptional<Type.TBoolean>;
            }>,
            Type.TObject<{
              kind: Type.TLiteral<"command">;
              argv: Type.TSchema;
              cwd: Type.TOptional<Type.TString>;
              env: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
              input: Type.TOptional<Type.TString>;
              timeoutSeconds: Type.TOptional<Type.TNumber>;
              noOutputTimeoutSeconds: Type.TOptional<Type.TNumber>;
              outputMaxBytes: Type.TOptional<Type.TInteger>;
            }>,
          ]
        >;
        delivery: Type.TOptional<
          Type.TUnion<
            [
              Type.TObject<{
                to: Type.TOptional<Type.TString>;
                channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
                threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
                accountId: Type.TOptional<Type.TString>;
                bestEffort: Type.TOptional<Type.TBoolean>;
                failureDestination: Type.TOptional<
                  Type.TObject<{
                    channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
                    to: Type.TOptional<Type.TString>;
                    accountId: Type.TOptional<Type.TString>;
                    mode: Type.TOptional<
                      Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>
                    >;
                  }>
                >;
                mode: Type.TLiteral<"none">;
              }>,
              Type.TObject<{
                completionDestination: Type.TOptional<
                  Type.TObject<{
                    mode: Type.TLiteral<"webhook">;
                    to: Type.TString;
                  }>
                >;
                to: Type.TOptional<Type.TString>;
                channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
                threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
                accountId: Type.TOptional<Type.TString>;
                bestEffort: Type.TOptional<Type.TBoolean>;
                failureDestination: Type.TOptional<
                  Type.TObject<{
                    channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
                    to: Type.TOptional<Type.TString>;
                    accountId: Type.TOptional<Type.TString>;
                    mode: Type.TOptional<
                      Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>
                    >;
                  }>
                >;
                mode: Type.TLiteral<"announce">;
              }>,
              Type.TObject<{
                to: Type.TString;
                channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
                threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
                accountId: Type.TOptional<Type.TString>;
                bestEffort: Type.TOptional<Type.TBoolean>;
                failureDestination: Type.TOptional<
                  Type.TObject<{
                    channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
                    to: Type.TOptional<Type.TString>;
                    accountId: Type.TOptional<Type.TString>;
                    mode: Type.TOptional<
                      Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>
                    >;
                  }>
                >;
                mode: Type.TLiteral<"webhook">;
              }>,
            ]
          >
        >;
        failureAlert: Type.TOptional<
          Type.TUnion<
            [
              Type.TLiteral<false>,
              Type.TObject<{
                after: Type.TOptional<Type.TInteger>;
                channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
                to: Type.TOptional<Type.TString>;
                cooldownMs: Type.TOptional<Type.TInteger>;
                includeSkipped: Type.TOptional<Type.TBoolean>;
                mode: Type.TOptional<
                  Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>
                >;
                accountId: Type.TOptional<Type.TString>;
              }>,
            ]
          >
        >;
        state: Type.TObject<{
          nextRunAtMs: Type.TOptional<Type.TInteger>;
          runningAtMs: Type.TOptional<Type.TInteger>;
          lastRunAtMs: Type.TOptional<Type.TInteger>;
          lastRunStatus: Type.TOptional<
            Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>
          >;
          lastStatus: Type.TOptional<
            Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>
          >;
          lastError: Type.TOptional<Type.TString>;
          lastDiagnostics: Type.TOptional<
            Type.TObject<{
              summary: Type.TOptional<Type.TString>;
              entries: Type.TArray<
                Type.TObject<{
                  ts: Type.TInteger;
                  source: Type.TUnion<
                    [
                      Type.TLiteral<"cron-preflight">,
                      Type.TLiteral<"cron-setup">,
                      Type.TLiteral<"model-preflight">,
                      Type.TLiteral<"agent-run">,
                      Type.TLiteral<"tool">,
                      Type.TLiteral<"exec">,
                      Type.TLiteral<"delivery">,
                    ]
                  >;
                  severity: Type.TUnion<
                    [Type.TLiteral<"info">, Type.TLiteral<"warn">, Type.TLiteral<"error">]
                  >;
                  message: Type.TString;
                  toolName: Type.TOptional<Type.TString>;
                  exitCode: Type.TOptional<Type.TUnion<[Type.TNumber, Type.TNull]>>;
                  truncated: Type.TOptional<Type.TBoolean>;
                }>
              >;
            }>
          >;
          lastDiagnosticSummary: Type.TOptional<Type.TString>;
          lastErrorReason: Type.TOptional<
            Type.TUnion<
              [
                Type.TLiteral<"auth">,
                Type.TLiteral<"auth_permanent">,
                Type.TLiteral<"format">,
                Type.TLiteral<"rate_limit">,
                Type.TLiteral<"overloaded">,
                Type.TLiteral<"billing">,
                Type.TLiteral<"server_error">,
                Type.TLiteral<"timeout">,
                Type.TLiteral<"context_overflow">,
                Type.TLiteral<"model_not_found">,
                Type.TLiteral<"session_expired">,
                Type.TLiteral<"empty_response">,
                Type.TLiteral<"no_error_details">,
                Type.TLiteral<"unclassified">,
                Type.TLiteral<"unknown">,
              ]
            >
          >;
          lastDurationMs: Type.TOptional<Type.TInteger>;
          consecutiveErrors: Type.TOptional<Type.TInteger>;
          consecutiveSkipped: Type.TOptional<Type.TInteger>;
          lastDelivered: Type.TOptional<Type.TBoolean>;
          lastDeliveryStatus: Type.TOptional<
            Type.TUnion<
              [
                Type.TLiteral<"delivered">,
                Type.TLiteral<"not-delivered">,
                Type.TLiteral<"unknown">,
                Type.TLiteral<"not-requested">,
              ]
            >
          >;
          lastDeliveryError: Type.TOptional<Type.TString>;
          lastFailureNotificationDelivered: Type.TOptional<Type.TBoolean>;
          lastFailureNotificationDeliveryStatus: Type.TOptional<
            Type.TUnion<
              [
                Type.TLiteral<"delivered">,
                Type.TLiteral<"not-delivered">,
                Type.TLiteral<"unknown">,
                Type.TLiteral<"not-requested">,
              ]
            >
          >;
          lastFailureNotificationDeliveryError: Type.TOptional<Type.TString>;
          lastFailureAlertAtMs: Type.TOptional<Type.TInteger>;
          lastTriggerEvalAtMs: Type.TOptional<Type.TInteger>;
          triggerEvalCount: Type.TOptional<Type.TInteger>;
          lastTriggerFireAtMs: Type.TOptional<Type.TInteger>;
          triggerState: Type.TOptional<Type.TUnknown>;
        }>;
        nextRunAtMs: Type.TOptional<Type.TInteger>;
        lastRunAtMs: Type.TOptional<Type.TInteger>;
        lastRunStatus: Type.TOptional<
          Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>
        >;
        lastRunError: Type.TOptional<Type.TString>;
        lastDelivered: Type.TOptional<Type.TBoolean>;
        lastDeliveryStatus: Type.TOptional<
          Type.TUnion<
            [
              Type.TLiteral<"delivered">,
              Type.TLiteral<"not-delivered">,
              Type.TLiteral<"unknown">,
              Type.TLiteral<"not-requested">,
            ]
          >
        >;
        lastDeliveryError: Type.TOptional<Type.TString>;
        lastFailureNotificationDelivered: Type.TOptional<Type.TBoolean>;
        lastFailureNotificationDeliveryStatus: Type.TOptional<
          Type.TUnion<
            [
              Type.TLiteral<"delivered">,
              Type.TLiteral<"not-delivered">,
              Type.TLiteral<"unknown">,
              Type.TLiteral<"not-requested">,
            ]
          >
        >;
        lastFailureNotificationDeliveryError: Type.TOptional<Type.TString>;
      }>;
    }>,
  ]
>;
/** Updates a cron job by id or legacy jobId alias. */
declare const CronUpdateParamsSchema: Type.TUnion<
  [
    Type.TObject<{
      id: Type.TString;
    }>,
    Type.TObject<{
      jobId: Type.TString;
    }>,
  ]
>;
/** Removes a cron job by id or legacy jobId alias. */
declare const CronRemoveParamsSchema: Type.TUnion<
  [
    Type.TObject<{
      id: Type.TString;
    }>,
    Type.TObject<{
      jobId: Type.TString;
    }>,
  ]
>;
/** Runs a cron job immediately or only if due. */
declare const CronRunParamsSchema: Type.TUnion<
  [
    Type.TObject<{
      id: Type.TString;
    }>,
    Type.TObject<{
      jobId: Type.TString;
    }>,
  ]
>;
/** Query params for cron run history. */
declare const CronRunsParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  scope: Type.TOptional<Type.TUnion<[Type.TLiteral<"job">, Type.TLiteral<"all">]>>;
  id: Type.TOptional<Type.TString>;
  jobId: Type.TOptional<Type.TString>;
  runId: Type.TOptional<Type.TString>;
  limit: Type.TOptional<Type.TInteger>;
  offset: Type.TOptional<Type.TInteger>;
  statuses: Type.TOptional<
    Type.TArray<
      Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>
    >
  >;
  status: Type.TOptional<
    Type.TUnion<
      [Type.TLiteral<"all">, Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]
    >
  >;
  deliveryStatuses: Type.TOptional<
    Type.TArray<
      Type.TUnion<
        [
          Type.TLiteral<"delivered">,
          Type.TLiteral<"not-delivered">,
          Type.TLiteral<"unknown">,
          Type.TLiteral<"not-requested">,
        ]
      >
    >
  >;
  deliveryStatus: Type.TOptional<
    Type.TUnion<
      [
        Type.TLiteral<"delivered">,
        Type.TLiteral<"not-delivered">,
        Type.TLiteral<"unknown">,
        Type.TLiteral<"not-requested">,
      ]
    >
  >;
  query: Type.TOptional<Type.TString>;
  sortDir: Type.TOptional<Type.TUnion<[Type.TLiteral<"asc">, Type.TLiteral<"desc">]>>;
}>;
/** One persisted cron run history entry. */
declare const CronRunLogEntrySchema: Type.TObject<{
  ts: Type.TInteger;
  jobId: Type.TString;
  action: Type.TLiteral<"finished">;
  status: Type.TOptional<
    Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>
  >;
  error: Type.TOptional<Type.TString>;
  errorReason: Type.TOptional<
    Type.TUnion<
      [
        Type.TLiteral<"auth">,
        Type.TLiteral<"auth_permanent">,
        Type.TLiteral<"format">,
        Type.TLiteral<"rate_limit">,
        Type.TLiteral<"overloaded">,
        Type.TLiteral<"billing">,
        Type.TLiteral<"server_error">,
        Type.TLiteral<"timeout">,
        Type.TLiteral<"context_overflow">,
        Type.TLiteral<"model_not_found">,
        Type.TLiteral<"session_expired">,
        Type.TLiteral<"empty_response">,
        Type.TLiteral<"no_error_details">,
        Type.TLiteral<"unclassified">,
        Type.TLiteral<"unknown">,
      ]
    >
  >;
  summary: Type.TOptional<Type.TString>;
  diagnostics: Type.TOptional<
    Type.TObject<{
      summary: Type.TOptional<Type.TString>;
      entries: Type.TArray<
        Type.TObject<{
          ts: Type.TInteger;
          source: Type.TUnion<
            [
              Type.TLiteral<"cron-preflight">,
              Type.TLiteral<"cron-setup">,
              Type.TLiteral<"model-preflight">,
              Type.TLiteral<"agent-run">,
              Type.TLiteral<"tool">,
              Type.TLiteral<"exec">,
              Type.TLiteral<"delivery">,
            ]
          >;
          severity: Type.TUnion<
            [Type.TLiteral<"info">, Type.TLiteral<"warn">, Type.TLiteral<"error">]
          >;
          message: Type.TString;
          toolName: Type.TOptional<Type.TString>;
          exitCode: Type.TOptional<Type.TUnion<[Type.TNumber, Type.TNull]>>;
          truncated: Type.TOptional<Type.TBoolean>;
        }>
      >;
    }>
  >;
  delivered: Type.TOptional<Type.TBoolean>;
  deliveryStatus: Type.TOptional<
    Type.TUnion<
      [
        Type.TLiteral<"delivered">,
        Type.TLiteral<"not-delivered">,
        Type.TLiteral<"unknown">,
        Type.TLiteral<"not-requested">,
      ]
    >
  >;
  deliveryError: Type.TOptional<Type.TString>;
  failureNotificationDelivery: Type.TOptional<
    Type.TObject<{
      delivered: Type.TOptional<Type.TBoolean>;
      status: Type.TUnion<
        [
          Type.TLiteral<"delivered">,
          Type.TLiteral<"not-delivered">,
          Type.TLiteral<"unknown">,
          Type.TLiteral<"not-requested">,
        ]
      >;
      error: Type.TOptional<Type.TString>;
    }>
  >;
  sessionId: Type.TOptional<Type.TString>;
  sessionKey: Type.TOptional<Type.TString>;
  runId: Type.TOptional<Type.TString>;
  runAtMs: Type.TOptional<Type.TInteger>;
  durationMs: Type.TOptional<Type.TInteger>;
  nextRunAtMs: Type.TOptional<Type.TInteger>;
  triggerFired: Type.TOptional<Type.TBoolean>;
  model: Type.TOptional<Type.TString>;
  provider: Type.TOptional<Type.TString>;
  usage: Type.TOptional<
    Type.TObject<{
      input_tokens: Type.TOptional<Type.TNumber>;
      output_tokens: Type.TOptional<Type.TNumber>;
      total_tokens: Type.TOptional<Type.TNumber>;
      cache_read_tokens: Type.TOptional<Type.TNumber>;
      cache_write_tokens: Type.TOptional<Type.TNumber>;
    }>
  >;
  jobName: Type.TOptional<Type.TString>;
}>;
type CronJob = Static<typeof CronJobSchema>;
type CronListParams = Static<typeof CronListParamsSchema>;
type CronStatusParams = Static<typeof CronStatusParamsSchema>;
type CronGetParams = Static<typeof CronGetParamsSchema>;
type CronAddParams = Static<typeof CronAddParamsSchema>;
type CronAddResult = Static<typeof CronAddResultSchema>;
type CronDeclarativeAddResult = Static<typeof CronDeclarativeAddResultSchema>;
type CronUpdateParams = Static<typeof CronUpdateParamsSchema>;
type CronRemoveParams = Static<typeof CronRemoveParamsSchema>;
type CronRunParams = Static<typeof CronRunParamsSchema>;
type CronRunsParams = Static<typeof CronRunsParamsSchema>;
type CronRunLogEntry = Static<typeof CronRunLogEntrySchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/frames.d.ts
declare const GATEWAY_SERVER_CAPS: {
  readonly CHAT_SEND_ROUTING_CONTRACT: "chat-send-routing-contract";
  readonly CRESTODIAN_SETUP_MODEL_REF: "crestodian-setup-model-ref";
};
/**
 * Top-level gateway frame schemas.
 *
 * These are the WebSocket envelope contracts; method/event payload schemas live
 * in feature-specific modules and are referenced by runtime validators.
 */
/** Periodic server heartbeat event payload. */
declare const TickEventSchema: Type.TObject<{
  ts: Type.TInteger;
}>;
/** Server shutdown notice event payload. */
declare const ShutdownEventSchema: Type.TObject<{
  reason: Type.TString;
  restartExpectedMs: Type.TOptional<Type.TInteger>;
}>;
/** Initial client hello/connect payload sent before the gateway accepts frames. */
declare const ConnectParamsSchema: Type.TObject<{
  minProtocol: Type.TInteger;
  maxProtocol: Type.TInteger;
  client: Type.TObject<{
    id: Type.TEnum<
      [
        "webchat-ui",
        "openclaw-control-ui",
        "openclaw-tui",
        "webchat",
        "cli",
        "gateway-client",
        "openclaw-macos",
        "openclaw-ios",
        "openclaw-watchos",
        "openclaw-android",
        "node-host",
        "openclaw-worker",
        "test",
        "fingerprint",
        "openclaw-probe",
      ]
    >;
    displayName: Type.TOptional<Type.TString>;
    version: Type.TString;
    platform: Type.TString;
    deviceFamily: Type.TOptional<Type.TString>;
    modelIdentifier: Type.TOptional<Type.TString>;
    mode: Type.TEnum<["webchat", "cli", "worker", "test", "probe", "ui", "backend", "node"]>;
    instanceId: Type.TOptional<Type.TString>;
  }>;
  caps: Type.TOptional<Type.TArray<Type.TString>>;
  commands: Type.TOptional<Type.TArray<Type.TString>>;
  permissions: Type.TOptional<Type.TRecord<"^.*$", Type.TBoolean>>;
  pathEnv: Type.TOptional<Type.TString>;
  role: Type.TOptional<Type.TString>;
  scopes: Type.TOptional<Type.TArray<Type.TString>>;
  device: Type.TOptional<
    Type.TObject<{
      id: Type.TString;
      publicKey: Type.TString;
      signature: Type.TString;
      signedAt: Type.TInteger;
      nonce: Type.TString;
    }>
  >;
  auth: Type.TOptional<
    Type.TObject<{
      token: Type.TOptional<Type.TString>;
      bootstrapToken: Type.TOptional<Type.TString>;
      deviceToken: Type.TOptional<Type.TString>;
      password: Type.TOptional<Type.TString>;
      approvalRuntimeToken: Type.TOptional<Type.TString>;
      agentRuntimeIdentityToken: Type.TOptional<Type.TString>;
    }>
  >;
  locale: Type.TOptional<Type.TString>;
  userAgent: Type.TOptional<Type.TString>;
}>;
/** Successful gateway hello response with negotiated protocol and initial state. */
declare const HelloOkSchema: Type.TObject<{
  type: Type.TLiteral<"hello-ok">;
  protocol: Type.TInteger;
  server: Type.TObject<{
    version: Type.TString;
    connId: Type.TString;
  }>;
  features: Type.TObject<{
    methods: Type.TArray<Type.TString>;
    events: Type.TArray<Type.TString>;
    capabilities: Type.TOptional<Type.TArray<Type.TString>>;
  }>;
  snapshot: Type.TObject<{
    presence: Type.TArray<
      Type.TObject<{
        host: Type.TOptional<Type.TString>;
        ip: Type.TOptional<Type.TString>;
        version: Type.TOptional<Type.TString>;
        platform: Type.TOptional<Type.TString>;
        deviceFamily: Type.TOptional<Type.TString>;
        modelIdentifier: Type.TOptional<Type.TString>;
        mode: Type.TOptional<Type.TString>;
        lastInputSeconds: Type.TOptional<Type.TInteger>;
        reason: Type.TOptional<Type.TString>;
        tags: Type.TOptional<Type.TArray<Type.TString>>;
        text: Type.TOptional<Type.TString>;
        ts: Type.TInteger;
        deviceId: Type.TOptional<Type.TString>;
        roles: Type.TOptional<Type.TArray<Type.TString>>;
        scopes: Type.TOptional<Type.TArray<Type.TString>>;
        instanceId: Type.TOptional<Type.TString>;
      }>
    >;
    health: Type.TAny;
    stateVersion: Type.TObject<{
      presence: Type.TInteger;
      health: Type.TInteger;
    }>;
    uptimeMs: Type.TInteger;
    configPath: Type.TOptional<Type.TString>;
    stateDir: Type.TOptional<Type.TString>;
    sessionDefaults: Type.TOptional<
      Type.TObject<{
        defaultAgentId: Type.TString;
        mainKey: Type.TString;
        mainSessionKey: Type.TString;
        scope: Type.TOptional<Type.TString>;
      }>
    >;
    authMode: Type.TOptional<
      Type.TUnion<
        [
          Type.TLiteral<"none">,
          Type.TLiteral<"token">,
          Type.TLiteral<"password">,
          Type.TLiteral<"trusted-proxy">,
        ]
      >
    >;
    updateAvailable: Type.TOptional<
      Type.TObject<{
        currentVersion: Type.TString;
        latestVersion: Type.TString;
        channel: Type.TString;
      }>
    >;
  }>;
  controlUiTabs: Type.TOptional<
    Type.TArray<
      Type.TObject<{
        pluginId: Type.TString;
        id: Type.TString;
        label: Type.TString;
        description: Type.TOptional<Type.TString>;
        icon: Type.TOptional<Type.TString>;
        path: Type.TOptional<Type.TString>;
        group: Type.TOptional<Type.TUnion<[Type.TLiteral<"control">, Type.TLiteral<"agent">]>>;
        order: Type.TOptional<Type.TNumber>;
      }>
    >
  >;
  pluginSurfaceUrls: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
  auth: Type.TObject<{
    deviceToken: Type.TOptional<Type.TString>;
    role: Type.TString;
    scopes: Type.TArray<Type.TString>;
    issuedAtMs: Type.TOptional<Type.TInteger>;
    deviceTokens: Type.TOptional<
      Type.TArray<
        Type.TObject<{
          deviceToken: Type.TString;
          role: Type.TString;
          scopes: Type.TArray<Type.TString>;
          issuedAtMs: Type.TInteger;
        }>
      >
    >;
  }>;
  policy: Type.TObject<{
    maxPayload: Type.TInteger;
    maxBufferedBytes: Type.TInteger;
    tickIntervalMs: Type.TInteger;
  }>;
}>;
/** Standard structured error shape used in response frames and connect failures. */
declare const ErrorShapeSchema: Type.TObject<{
  code: Type.TString;
  message: Type.TString;
  details: Type.TOptional<Type.TUnknown>;
  retryable: Type.TOptional<Type.TBoolean>;
  retryAfterMs: Type.TOptional<Type.TInteger>;
}>;
/** Client request frame envelope; `method` selects the payload validator. */
declare const RequestFrameSchema: Type.TObject<{
  type: Type.TLiteral<"req">;
  id: Type.TString;
  method: Type.TString;
  params: Type.TOptional<Type.TUnknown>;
}>;
/** Server response frame envelope paired with a prior request id. */
declare const ResponseFrameSchema: Type.TObject<{
  type: Type.TLiteral<"res">;
  id: Type.TString;
  ok: Type.TBoolean;
  payload: Type.TOptional<Type.TUnknown>;
  error: Type.TOptional<
    Type.TObject<{
      code: Type.TString;
      message: Type.TString;
      details: Type.TOptional<Type.TUnknown>;
      retryable: Type.TOptional<Type.TBoolean>;
      retryAfterMs: Type.TOptional<Type.TInteger>;
    }>
  >;
}>;
/** Server event frame envelope; `event` selects the payload validator. */
declare const EventFrameSchema: Type.TObject<{
  type: Type.TLiteral<"event">;
  event: Type.TString;
  payload: Type.TOptional<Type.TUnknown>;
  seq: Type.TOptional<Type.TInteger>;
  stateVersion: Type.TOptional<
    Type.TObject<{
      presence: Type.TInteger;
      health: Type.TInteger;
    }>
  >;
}>;
declare const GatewayFrameSchema: Type.TUnion<
  [
    Type.TObject<{
      type: Type.TLiteral<"req">;
      id: Type.TString;
      method: Type.TString;
      params: Type.TOptional<Type.TUnknown>;
    }>,
    Type.TObject<{
      type: Type.TLiteral<"res">;
      id: Type.TString;
      ok: Type.TBoolean;
      payload: Type.TOptional<Type.TUnknown>;
      error: Type.TOptional<
        Type.TObject<{
          code: Type.TString;
          message: Type.TString;
          details: Type.TOptional<Type.TUnknown>;
          retryable: Type.TOptional<Type.TBoolean>;
          retryAfterMs: Type.TOptional<Type.TInteger>;
        }>
      >;
    }>,
    Type.TObject<{
      type: Type.TLiteral<"event">;
      event: Type.TString;
      payload: Type.TOptional<Type.TUnknown>;
      seq: Type.TOptional<Type.TInteger>;
      stateVersion: Type.TOptional<
        Type.TObject<{
          presence: Type.TInteger;
          health: Type.TInteger;
        }>
      >;
    }>,
  ]
>;
type ConnectParams = Static<typeof ConnectParamsSchema>;
type HelloOk = Static<typeof HelloOkSchema>;
type ErrorShape = Static<typeof ErrorShapeSchema>;
type RequestFrame = Static<typeof RequestFrameSchema>;
type ResponseFrame = Static<typeof ResponseFrameSchema>;
type EventFrame = Static<typeof EventFrameSchema>;
type GatewayFrame = Static<typeof GatewayFrameSchema>;
type TickEvent = Static<typeof TickEventSchema>;
type ShutdownEvent = Static<typeof ShutdownEventSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/error-codes.d.ts
/** Gateway JSON-RPC style error codes shared by clients and server handlers. */
declare const ErrorCodes: {
  /** Client has not completed account/device linking for this gateway. */ readonly NOT_LINKED: "NOT_LINKED" /** Device exists but still needs an explicit pairing approval. */;
  readonly NOT_PAIRED: "NOT_PAIRED" /** Agent turn exceeded the gateway wait window. */;
  readonly AGENT_TIMEOUT: "AGENT_TIMEOUT" /** Request payload failed protocol validation or method preconditions. */;
  readonly INVALID_REQUEST: "INVALID_REQUEST" /** Approval resolution referenced a missing or expired approval request. */;
  readonly APPROVAL_NOT_FOUND: "APPROVAL_NOT_FOUND" /** Gateway service or required backend is temporarily unavailable. */;
  readonly UNAVAILABLE: "UNAVAILABLE";
};
/** Closed set of canonical gateway error code strings. */
type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
/** Builds the canonical gateway error payload while preserving optional retry metadata. */
declare function errorShape(
  code: ErrorCode,
  message: string,
  opts?: {
    details?: unknown;
    retryable?: boolean;
    retryAfterMs?: number;
  },
): ErrorShape;
//#endregion
//#region packages/gateway-protocol/src/schema/environments.d.ts
/**
 * Environment inventory protocol schemas.
 *
 * Environments are runtime targets such as local hosts, VMs, or remote workers;
 * this schema layer only describes their gateway-visible status summary.
 */
/** Runtime availability state for an environment target. */
declare const EnvironmentStatusSchema: Type.TString;
/** Durable lifecycle states for plugin-provisioned worker environments. */
declare const WorkerEnvironmentStateSchema: Type.TUnion<
  [
    Type.TLiteral<"requested">,
    Type.TLiteral<"provisioning">,
    Type.TLiteral<"bootstrapping">,
    Type.TLiteral<"ready">,
    Type.TLiteral<"attached">,
    Type.TLiteral<"idle">,
    Type.TLiteral<"draining">,
    Type.TLiteral<"destroying">,
    Type.TLiteral<"destroyed">,
    Type.TLiteral<"failed">,
    Type.TLiteral<"orphaned">,
  ]
>;
/** Process-local SSH tunnel connectivity for a worker environment. */
declare const WorkerTunnelStatusSchema: Type.TUnion<
  [
    Type.TLiteral<"stopped">,
    Type.TLiteral<"connecting">,
    Type.TLiteral<"connected">,
    Type.TLiteral<"reconnecting">,
  ]
>;
/** Worker-only lifecycle metadata layered onto the existing environment projection. */
declare const WorkerEnvironmentMetadataSchema: Type.TObject<{
  providerId: Type.TString;
  leaseId: Type.TOptional<Type.TString>;
  state: Type.TUnion<
    [
      Type.TLiteral<"requested">,
      Type.TLiteral<"provisioning">,
      Type.TLiteral<"bootstrapping">,
      Type.TLiteral<"ready">,
      Type.TLiteral<"attached">,
      Type.TLiteral<"idle">,
      Type.TLiteral<"draining">,
      Type.TLiteral<"destroying">,
      Type.TLiteral<"destroyed">,
      Type.TLiteral<"failed">,
      Type.TLiteral<"orphaned">,
    ]
  >;
  ageMs: Type.TInteger;
  idleMs: Type.TOptional<Type.TInteger>;
  attachedSessionIds: Type.TArray<Type.TString>;
  tunnelStatus: Type.TUnion<
    [
      Type.TLiteral<"stopped">,
      Type.TLiteral<"connecting">,
      Type.TLiteral<"connected">,
      Type.TLiteral<"reconnecting">,
    ]
  >;
}>;
/** Public environment summary shown in listings and status responses. */
declare const EnvironmentSummarySchema: Type.TObject<{
  id: Type.TString;
  type: Type.TString;
  label: Type.TOptional<Type.TString>;
  status: Type.TString;
  capabilities: Type.TOptional<Type.TArray<Type.TString>>;
  worker: Type.TOptional<
    Type.TObject<{
      providerId: Type.TString;
      leaseId: Type.TOptional<Type.TString>;
      state: Type.TUnion<
        [
          Type.TLiteral<"requested">,
          Type.TLiteral<"provisioning">,
          Type.TLiteral<"bootstrapping">,
          Type.TLiteral<"ready">,
          Type.TLiteral<"attached">,
          Type.TLiteral<"idle">,
          Type.TLiteral<"draining">,
          Type.TLiteral<"destroying">,
          Type.TLiteral<"destroyed">,
          Type.TLiteral<"failed">,
          Type.TLiteral<"orphaned">,
        ]
      >;
      ageMs: Type.TInteger;
      idleMs: Type.TOptional<Type.TInteger>;
      attachedSessionIds: Type.TArray<Type.TString>;
      tunnelStatus: Type.TUnion<
        [
          Type.TLiteral<"stopped">,
          Type.TLiteral<"connecting">,
          Type.TLiteral<"connected">,
          Type.TLiteral<"reconnecting">,
        ]
      >;
    }>
  >;
}>;
/** Empty request payload for listing known environments. */
declare const EnvironmentsListParamsSchema: Type.TObject<{}>;
/** List response containing all gateway-visible environment summaries. */
declare const EnvironmentsListResultSchema: Type.TObject<{
  environments: Type.TArray<
    Type.TObject<{
      id: Type.TString;
      type: Type.TString;
      label: Type.TOptional<Type.TString>;
      status: Type.TString;
      capabilities: Type.TOptional<Type.TArray<Type.TString>>;
      worker: Type.TOptional<
        Type.TObject<{
          providerId: Type.TString;
          leaseId: Type.TOptional<Type.TString>;
          state: Type.TUnion<
            [
              Type.TLiteral<"requested">,
              Type.TLiteral<"provisioning">,
              Type.TLiteral<"bootstrapping">,
              Type.TLiteral<"ready">,
              Type.TLiteral<"attached">,
              Type.TLiteral<"idle">,
              Type.TLiteral<"draining">,
              Type.TLiteral<"destroying">,
              Type.TLiteral<"destroyed">,
              Type.TLiteral<"failed">,
              Type.TLiteral<"orphaned">,
            ]
          >;
          ageMs: Type.TInteger;
          idleMs: Type.TOptional<Type.TInteger>;
          attachedSessionIds: Type.TArray<Type.TString>;
          tunnelStatus: Type.TUnion<
            [
              Type.TLiteral<"stopped">,
              Type.TLiteral<"connecting">,
              Type.TLiteral<"connected">,
              Type.TLiteral<"reconnecting">,
            ]
          >;
        }>
      >;
    }>
  >;
}>;
/** Status lookup request for one environment id. */
declare const EnvironmentsStatusParamsSchema: Type.TObject<{
  environmentId: Type.TString;
}>;
/** Status lookup result for one environment id. */
declare const EnvironmentsStatusResultSchema: Type.TObject<{
  id: Type.TString;
  type: Type.TString;
  label: Type.TOptional<Type.TString>;
  status: Type.TString;
  capabilities: Type.TOptional<Type.TArray<Type.TString>>;
  worker: Type.TOptional<
    Type.TObject<{
      providerId: Type.TString;
      leaseId: Type.TOptional<Type.TString>;
      state: Type.TUnion<
        [
          Type.TLiteral<"requested">,
          Type.TLiteral<"provisioning">,
          Type.TLiteral<"bootstrapping">,
          Type.TLiteral<"ready">,
          Type.TLiteral<"attached">,
          Type.TLiteral<"idle">,
          Type.TLiteral<"draining">,
          Type.TLiteral<"destroying">,
          Type.TLiteral<"destroyed">,
          Type.TLiteral<"failed">,
          Type.TLiteral<"orphaned">,
        ]
      >;
      ageMs: Type.TInteger;
      idleMs: Type.TOptional<Type.TInteger>;
      attachedSessionIds: Type.TArray<Type.TString>;
      tunnelStatus: Type.TUnion<
        [
          Type.TLiteral<"stopped">,
          Type.TLiteral<"connecting">,
          Type.TLiteral<"connected">,
          Type.TLiteral<"reconnecting">,
        ]
      >;
    }>
  >;
}>;
/** Creates a worker environment from one configured provider profile. */
declare const EnvironmentsCreateParamsSchema: Type.TObject<{
  profileId: Type.TString;
  idempotencyKey: Type.TString;
}>;
/** Create result uses the same public summary shape as list and status. */
declare const EnvironmentsCreateResultSchema: Type.TObject<{
  id: Type.TString;
  type: Type.TString;
  label: Type.TOptional<Type.TString>;
  status: Type.TString;
  capabilities: Type.TOptional<Type.TArray<Type.TString>>;
  worker: Type.TOptional<
    Type.TObject<{
      providerId: Type.TString;
      leaseId: Type.TOptional<Type.TString>;
      state: Type.TUnion<
        [
          Type.TLiteral<"requested">,
          Type.TLiteral<"provisioning">,
          Type.TLiteral<"bootstrapping">,
          Type.TLiteral<"ready">,
          Type.TLiteral<"attached">,
          Type.TLiteral<"idle">,
          Type.TLiteral<"draining">,
          Type.TLiteral<"destroying">,
          Type.TLiteral<"destroyed">,
          Type.TLiteral<"failed">,
          Type.TLiteral<"orphaned">,
        ]
      >;
      ageMs: Type.TInteger;
      idleMs: Type.TOptional<Type.TInteger>;
      attachedSessionIds: Type.TArray<Type.TString>;
      tunnelStatus: Type.TUnion<
        [
          Type.TLiteral<"stopped">,
          Type.TLiteral<"connecting">,
          Type.TLiteral<"connected">,
          Type.TLiteral<"reconnecting">,
        ]
      >;
    }>
  >;
}>;
/** Destroys one durable worker environment by its gateway-owned id. */
declare const EnvironmentsDestroyParamsSchema: Type.TObject<{
  environmentId: Type.TString;
}>;
/** Destroy result exposes the terminal worker lifecycle state. */
declare const EnvironmentsDestroyResultSchema: Type.TObject<{
  id: Type.TString;
  type: Type.TString;
  label: Type.TOptional<Type.TString>;
  status: Type.TString;
  capabilities: Type.TOptional<Type.TArray<Type.TString>>;
  worker: Type.TOptional<
    Type.TObject<{
      providerId: Type.TString;
      leaseId: Type.TOptional<Type.TString>;
      state: Type.TUnion<
        [
          Type.TLiteral<"requested">,
          Type.TLiteral<"provisioning">,
          Type.TLiteral<"bootstrapping">,
          Type.TLiteral<"ready">,
          Type.TLiteral<"attached">,
          Type.TLiteral<"idle">,
          Type.TLiteral<"draining">,
          Type.TLiteral<"destroying">,
          Type.TLiteral<"destroyed">,
          Type.TLiteral<"failed">,
          Type.TLiteral<"orphaned">,
        ]
      >;
      ageMs: Type.TInteger;
      idleMs: Type.TOptional<Type.TInteger>;
      attachedSessionIds: Type.TArray<Type.TString>;
      tunnelStatus: Type.TUnion<
        [
          Type.TLiteral<"stopped">,
          Type.TLiteral<"connecting">,
          Type.TLiteral<"connected">,
          Type.TLiteral<"reconnecting">,
        ]
      >;
    }>
  >;
}>;
type EnvironmentStatus = Static<typeof EnvironmentStatusSchema>;
type WorkerEnvironmentState = Static<typeof WorkerEnvironmentStateSchema>;
type WorkerTunnelStatus = Static<typeof WorkerTunnelStatusSchema>;
type WorkerEnvironmentMetadata = Static<typeof WorkerEnvironmentMetadataSchema>;
type EnvironmentSummary = Static<typeof EnvironmentSummarySchema>;
type EnvironmentsCreateParams = Static<typeof EnvironmentsCreateParamsSchema>;
type EnvironmentsCreateResult = Static<typeof EnvironmentsCreateResultSchema>;
type EnvironmentsDestroyParams = Static<typeof EnvironmentsDestroyParamsSchema>;
type EnvironmentsDestroyResult = Static<typeof EnvironmentsDestroyResultSchema>;
type EnvironmentsListParams = Static<typeof EnvironmentsListParamsSchema>;
type EnvironmentsListResult = Static<typeof EnvironmentsListResultSchema>;
type EnvironmentsStatusParams = Static<typeof EnvironmentsStatusParamsSchema>;
type EnvironmentsStatusResult = Static<typeof EnvironmentsStatusResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/exec-approvals.d.ts
/** File-backed read snapshot with path/hash metadata for optimistic writes. */
declare const ExecApprovalsSnapshotSchema: Type.TObject<{
  path: Type.TString;
  exists: Type.TBoolean;
  hash: Type.TString;
  file: Type.TObject<{
    version: Type.TLiteral<1>;
    socket: Type.TOptional<
      Type.TObject<{
        path: Type.TOptional<Type.TString>;
        token: Type.TOptional<Type.TString>;
      }>
    >;
    defaults: Type.TOptional<
      Type.TObject<{
        security: Type.TOptional<Type.TString>;
        ask: Type.TOptional<Type.TString>;
        askFallback: Type.TOptional<Type.TString>;
        autoAllowSkills: Type.TOptional<Type.TBoolean>;
      }>
    >;
    agents: Type.TOptional<
      Type.TRecord<
        "^.*$",
        Type.TObject<{
          allowlist: Type.TOptional<
            Type.TArray<
              Type.TObject<{
                id: Type.TOptional<Type.TString>;
                pattern: Type.TString;
                source: Type.TOptional<Type.TLiteral<"allow-always">>;
                commandText: Type.TOptional<Type.TString>;
                argPattern: Type.TOptional<Type.TString>;
                lastUsedAt: Type.TOptional<Type.TNumber>;
                lastUsedCommand: Type.TOptional<Type.TString>;
                lastResolvedPath: Type.TOptional<Type.TString>;
              }>
            >
          >;
          security: Type.TOptional<Type.TString>;
          ask: Type.TOptional<Type.TString>;
          askFallback: Type.TOptional<Type.TString>;
          autoAllowSkills: Type.TOptional<Type.TBoolean>;
        }>
      >
    >;
  }>;
}>;
/** Node read snapshot supporting file-backed and host-native approval owners. */
declare const ExecApprovalsNodeSnapshotSchema: Type.TObject<{
  path: Type.TOptional<Type.TString>;
  exists: Type.TOptional<Type.TBoolean>;
  hash: Type.TOptional<Type.TString>;
  file: Type.TOptional<
    Type.TObject<{
      version: Type.TLiteral<1>;
      socket: Type.TOptional<
        Type.TObject<{
          path: Type.TOptional<Type.TString>;
          token: Type.TOptional<Type.TString>;
        }>
      >;
      defaults: Type.TOptional<
        Type.TObject<{
          security: Type.TOptional<Type.TString>;
          ask: Type.TOptional<Type.TString>;
          askFallback: Type.TOptional<Type.TString>;
          autoAllowSkills: Type.TOptional<Type.TBoolean>;
        }>
      >;
      agents: Type.TOptional<
        Type.TRecord<
          "^.*$",
          Type.TObject<{
            allowlist: Type.TOptional<
              Type.TArray<
                Type.TObject<{
                  id: Type.TOptional<Type.TString>;
                  pattern: Type.TString;
                  source: Type.TOptional<Type.TLiteral<"allow-always">>;
                  commandText: Type.TOptional<Type.TString>;
                  argPattern: Type.TOptional<Type.TString>;
                  lastUsedAt: Type.TOptional<Type.TNumber>;
                  lastUsedCommand: Type.TOptional<Type.TString>;
                  lastResolvedPath: Type.TOptional<Type.TString>;
                }>
              >
            >;
            security: Type.TOptional<Type.TString>;
            ask: Type.TOptional<Type.TString>;
            askFallback: Type.TOptional<Type.TString>;
            autoAllowSkills: Type.TOptional<Type.TBoolean>;
          }>
        >
      >;
    }>
  >;
  resolvedDefaults: Type.TOptional<
    Type.TObject<{
      security: Type.TUnion<
        [Type.TLiteral<"deny">, Type.TLiteral<"allowlist">, Type.TLiteral<"full">]
      >;
      ask: Type.TUnion<[Type.TLiteral<"off">, Type.TLiteral<"on-miss">, Type.TLiteral<"always">]>;
      askFallback: Type.TUnion<
        [Type.TLiteral<"deny">, Type.TLiteral<"allowlist">, Type.TLiteral<"full">]
      >;
      autoAllowSkills: Type.TBoolean;
    }>
  >;
  enabled: Type.TOptional<Type.TBoolean>;
  baseHash: Type.TOptional<Type.TString>;
  defaultAction: Type.TOptional<
    Type.TUnion<[Type.TLiteral<"allow">, Type.TLiteral<"deny">, Type.TLiteral<"prompt">]>
  >;
  rules: Type.TOptional<
    Type.TArray<
      Type.TObject<{
        pattern: Type.TString;
        action: Type.TUnion<
          [Type.TLiteral<"allow">, Type.TLiteral<"deny">, Type.TLiteral<"prompt">]
        >;
        shells: Type.TOptional<Type.TArray<Type.TString>>;
        description: Type.TOptional<Type.TString>;
        enabled: Type.TOptional<Type.TBoolean>;
      }>
    >
  >;
  constraints: Type.TOptional<
    Type.TObject<{
      baseHashRequired: Type.TOptional<Type.TBoolean>;
      defaultAllowAllowed: Type.TOptional<Type.TBoolean>;
      broadAllowRulesAllowed: Type.TOptional<Type.TBoolean>;
      dangerousAllowRulesAllowed: Type.TOptional<Type.TBoolean>;
    }>
  >;
  message: Type.TOptional<Type.TString>;
}>;
/** Empty request payload for reading local exec approval policy. */
declare const ExecApprovalsGetParamsSchema: Type.TObject<{}>;
/** Local exec approval policy write request with optional base hash guard. */
declare const ExecApprovalsSetParamsSchema: Type.TObject<{
  file: Type.TObject<{
    version: Type.TLiteral<1>;
    socket: Type.TOptional<
      Type.TObject<{
        path: Type.TOptional<Type.TString>;
        token: Type.TOptional<Type.TString>;
      }>
    >;
    defaults: Type.TOptional<
      Type.TObject<{
        security: Type.TOptional<Type.TString>;
        ask: Type.TOptional<Type.TString>;
        askFallback: Type.TOptional<Type.TString>;
        autoAllowSkills: Type.TOptional<Type.TBoolean>;
      }>
    >;
    agents: Type.TOptional<
      Type.TRecord<
        "^.*$",
        Type.TObject<{
          allowlist: Type.TOptional<
            Type.TArray<
              Type.TObject<{
                id: Type.TOptional<Type.TString>;
                pattern: Type.TString;
                source: Type.TOptional<Type.TLiteral<"allow-always">>;
                commandText: Type.TOptional<Type.TString>;
                argPattern: Type.TOptional<Type.TString>;
                lastUsedAt: Type.TOptional<Type.TNumber>;
                lastUsedCommand: Type.TOptional<Type.TString>;
                lastResolvedPath: Type.TOptional<Type.TString>;
              }>
            >
          >;
          security: Type.TOptional<Type.TString>;
          ask: Type.TOptional<Type.TString>;
          askFallback: Type.TOptional<Type.TString>;
          autoAllowSkills: Type.TOptional<Type.TBoolean>;
        }>
      >
    >;
  }>;
  baseHash: Type.TOptional<Type.TString>;
}>;
/** Lookup request for one pending exec approval by id. */
declare const ExecApprovalGetParamsSchema: Type.TObject<{
  id: Type.TString;
}>;
/** Pending command execution approval request shown to reviewers. */
declare const ExecApprovalRequestParamsSchema: Type.TObject<{
  id: Type.TOptional<Type.TString>;
  command: Type.TOptional<Type.TString>;
  commandArgv: Type.TOptional<Type.TArray<Type.TString>>;
  systemRunPlan: Type.TOptional<
    Type.TObject<{
      argv: Type.TArray<Type.TString>;
      cwd: Type.TUnion<[Type.TString, Type.TNull]>;
      commandText: Type.TString;
      commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TUnion<[Type.TString, Type.TNull]>;
      sessionKey: Type.TUnion<[Type.TString, Type.TNull]>;
      policySnapshot: Type.TOptional<
        Type.TObject<{
          security: Type.TUnion<
            [Type.TLiteral<"deny">, Type.TLiteral<"allowlist">, Type.TLiteral<"full">]
          >;
          ask: Type.TUnion<
            [Type.TLiteral<"off">, Type.TLiteral<"on-miss">, Type.TLiteral<"always">]
          >;
          askFallback: Type.TUnion<
            [Type.TLiteral<"deny">, Type.TLiteral<"allowlist">, Type.TLiteral<"full">]
          >;
          autoAllowSkills: Type.TBoolean;
          allowlistRules: Type.TArray<
            Type.TObject<{
              pattern: Type.TString;
              argPattern: Type.TOptional<Type.TString>;
              source: Type.TOptional<Type.TLiteral<"allow-always">>;
            }>
          >;
        }>
      >;
      mutableFileOperand: Type.TOptional<
        Type.TUnion<
          [
            Type.TObject<{
              argvIndex: Type.TInteger;
              path: Type.TString;
              sha256: Type.TString;
            }>,
            Type.TNull,
          ]
        >
      >;
    }>
  >;
  env: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
  cwd: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  security: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  ask: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  unavailableDecisions: Type.TOptional<Type.TArray<Type.TString>>;
  commandSpans: Type.TOptional<
    Type.TArray<
      Type.TObject<{
        startIndex: Type.TInteger;
        endIndex: Type.TInteger;
      }>
    >
  >;
  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  resolvedPath: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  sessionKey: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  turnSourceChannel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  turnSourceTo: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  turnSourceAccountId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  turnSourceThreadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber, Type.TNull]>>;
  approvalReviewerDeviceIds: Type.TOptional<Type.TArray<Type.TString>>;
  requireDeliveryRoute: Type.TOptional<Type.TBoolean>;
  suppressDelivery: Type.TOptional<Type.TBoolean>;
  timeoutMs: Type.TOptional<Type.TInteger>;
  twoPhase: Type.TOptional<Type.TBoolean>;
}>;
/** Reviewer decision payload for one pending exec approval. */
declare const ExecApprovalResolveParamsSchema: Type.TObject<{
  id: Type.TString;
  decision: Type.TString;
}>;
type ExecApprovalsGetParams = Static<typeof ExecApprovalsGetParamsSchema>;
type ExecApprovalsSetParams = Static<typeof ExecApprovalsSetParamsSchema>;
type ExecApprovalsNodeSnapshot = Static<typeof ExecApprovalsNodeSnapshotSchema>;
type ExecApprovalsSnapshot = Static<typeof ExecApprovalsSnapshotSchema>;
type ExecApprovalGetParams = Static<typeof ExecApprovalGetParamsSchema>;
type ExecApprovalRequestParams = Static<typeof ExecApprovalRequestParamsSchema>;
type ExecApprovalResolveParams = Static<typeof ExecApprovalResolveParamsSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/devices.d.ts
/**
 * Device pairing and token-management protocol schemas.
 *
 * These payloads cross the gateway approval boundary, so request ids and device
 * ids stay explicit and feature handlers own the authorization checks.
 */
/** Lists pending and approved device pairing records. */
declare const DevicePairListParamsSchema: Type.TObject<{}>;
/** Approves a pending pairing request by request id. */
declare const DevicePairApproveParamsSchema: Type.TObject<{
  requestId: Type.TString;
}>;
/** Rejects a pending pairing request by request id. */
declare const DevicePairRejectParamsSchema: Type.TObject<{
  requestId: Type.TString;
}>;
/** Renames a paired device while preserving its stable device id. */
declare const DevicePairRenameParamsSchema: Type.TObject<{
  deviceId: Type.TString;
  label: Type.TString;
}>;
/**
 * Generates a device-pairing setup code (and optional QR) so a mobile/companion
 * client can scan it and connect to this gateway. The embedded setup code mints
 * a short-lived bootstrap token that defaults to full native-mobile operator
 * access, so this method requires operator.admin
 * (enforced by the core method descriptor's method-scope policy, not the handler)
 * and is not advertised. `bootstrapProfile: "limited"` omits operator.admin;
 * `bootstrapProfile: "node"` narrows the handoff to a node role with no operator
 * scopes for companion devices such as watchOS.
 */
declare const DevicePairSetupCodeParamsSchema: Type.TObject<{
  publicUrl: Type.TOptional<Type.TString>;
  preferRemoteUrl: Type.TOptional<Type.TBoolean>;
  includeQr: Type.TOptional<Type.TBoolean>;
  bootstrapProfile: Type.TOptional<Type.TString>;
}>;
/**
 * Setup code plus non-secret connection metadata. `auth` is a label only
 * ("token" | "password"); the gateway credential itself is never returned.
 * `accessDowngraded` reports the plaintext-LAN safety fallback from full to
 * limited access so the presenting client can explain how to upgrade.
 */
declare const DevicePairSetupCodeResultSchema: Type.TObject<{
  setupCode: Type.TString;
  qrDataUrl: Type.TOptional<Type.TString>;
  gatewayUrl: Type.TString;
  gatewayUrls: Type.TOptional<Type.TArray<Type.TString>>;
  auth: Type.TUnion<[Type.TLiteral<"token">, Type.TLiteral<"password">]>;
  urlSource: Type.TString;
  access: Type.TOptional<
    Type.TUnion<[Type.TLiteral<"full">, Type.TLiteral<"limited">, Type.TLiteral<"node">]>
  >;
  accessDowngraded: Type.TOptional<Type.TBoolean>;
}>;
type DevicePairListParams = Static<typeof DevicePairListParamsSchema>;
type DevicePairApproveParams = Static<typeof DevicePairApproveParamsSchema>;
type DevicePairRejectParams = Static<typeof DevicePairRejectParamsSchema>;
type DevicePairSetupCodeParams = Static<typeof DevicePairSetupCodeParamsSchema>;
type DevicePairSetupCodeResult = Static<typeof DevicePairSetupCodeResultSchema>;
type DevicePairRenameParams = Static<typeof DevicePairRenameParamsSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/fs.d.ts
declare const FsListDirParamsSchema: Type.TObject<{
  /** Absolute directory to list; omitted means the selected host's home directory. */ path: Type.TOptional<Type.TString> /** Connected node host to browse; omitted means the Gateway host. */;
  nodeId: Type.TOptional<Type.TString>;
}>;
declare const FsDirEntrySchema: Type.TObject<{
  name: Type.TString;
  path: Type.TString /** Dot-prefixed directories; clients render them dimmed after visible ones. */;
  hidden: Type.TOptional<Type.TBoolean>;
}>;
declare const FsListDirResultSchema: Type.TObject<{
  /** Resolved absolute path that was listed. */ path: Type.TString /** Absent at the filesystem root. */;
  parent: Type.TOptional<Type.TString> /** Selected host's home directory, for the picker's "home" shortcut. */;
  home: Type.TString;
  entries: Type.TArray<
    Type.TObject<{
      name: Type.TString;
      path: Type.TString /** Dot-prefixed directories; clients render them dimmed after visible ones. */;
      hidden: Type.TOptional<Type.TBoolean>;
    }>
  >;
}>;
type FsDirEntry = Static<typeof FsDirEntrySchema>;
type FsListDirParams = Static<typeof FsListDirParamsSchema>;
type FsListDirResult = Static<typeof FsListDirResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/gateway-suspend.d.ts
declare const GatewaySuspendTaskBlockerSchema: Type.TObject<{
  taskId: Type.TString;
  status: Type.TLiteral<"running">;
  runtime: Type.TUnion<
    [Type.TLiteral<"subagent">, Type.TLiteral<"acp">, Type.TLiteral<"cli">, Type.TLiteral<"cron">]
  >;
  runId: Type.TOptional<Type.TString>;
  label: Type.TOptional<Type.TString>;
  title: Type.TOptional<Type.TString>;
}>;
declare const GatewaySuspendBlockerSchema: Type.TObject<{
  kind: Type.TUnion<
    [
      Type.TLiteral<"queue">,
      Type.TLiteral<"reply">,
      Type.TLiteral<"embedded-run">,
      Type.TLiteral<"background-exec">,
      Type.TLiteral<"cron-run">,
      Type.TLiteral<"task">,
      Type.TLiteral<"root-request">,
      Type.TLiteral<"session-admission">,
      Type.TLiteral<"session-mutation">,
      Type.TLiteral<"chat-run">,
      Type.TLiteral<"queued-turn">,
      Type.TLiteral<"terminal-persistence">,
      Type.TLiteral<"terminal-session">,
    ]
  >;
  count: Type.TInteger;
  message: Type.TString;
  task: Type.TOptional<
    Type.TObject<{
      taskId: Type.TString;
      status: Type.TLiteral<"running">;
      runtime: Type.TUnion<
        [
          Type.TLiteral<"subagent">,
          Type.TLiteral<"acp">,
          Type.TLiteral<"cli">,
          Type.TLiteral<"cron">,
        ]
      >;
      runId: Type.TOptional<Type.TString>;
      label: Type.TOptional<Type.TString>;
      title: Type.TOptional<Type.TString>;
    }>
  >;
}>;
declare const GatewaySuspendPrepareParamsSchema: Type.TObject<{
  requestId: Type.TString;
}>;
declare const GatewaySuspendPrepareBusyResultSchema: Type.TObject<{
  status: Type.TLiteral<"busy">;
  reason: Type.TUnion<[Type.TLiteral<"active-work">, Type.TLiteral<"gateway-draining">]>;
  retryAfterMs: Type.TInteger;
  activeCount: Type.TInteger;
  blockers: Type.TArray<
    Type.TObject<{
      kind: Type.TUnion<
        [
          Type.TLiteral<"queue">,
          Type.TLiteral<"reply">,
          Type.TLiteral<"embedded-run">,
          Type.TLiteral<"background-exec">,
          Type.TLiteral<"cron-run">,
          Type.TLiteral<"task">,
          Type.TLiteral<"root-request">,
          Type.TLiteral<"session-admission">,
          Type.TLiteral<"session-mutation">,
          Type.TLiteral<"chat-run">,
          Type.TLiteral<"queued-turn">,
          Type.TLiteral<"terminal-persistence">,
          Type.TLiteral<"terminal-session">,
        ]
      >;
      count: Type.TInteger;
      message: Type.TString;
      task: Type.TOptional<
        Type.TObject<{
          taskId: Type.TString;
          status: Type.TLiteral<"running">;
          runtime: Type.TUnion<
            [
              Type.TLiteral<"subagent">,
              Type.TLiteral<"acp">,
              Type.TLiteral<"cli">,
              Type.TLiteral<"cron">,
            ]
          >;
          runId: Type.TOptional<Type.TString>;
          label: Type.TOptional<Type.TString>;
          title: Type.TOptional<Type.TString>;
        }>
      >;
    }>
  >;
}>;
declare const GatewaySuspendPrepareReadyResultSchema: Type.TObject<{
  status: Type.TLiteral<"ready">;
  suspensionId: Type.TString;
  expiresAtMs: Type.TInteger;
  activeCount: Type.TInteger;
  blockers: Type.TArray<
    Type.TObject<{
      kind: Type.TUnion<
        [
          Type.TLiteral<"queue">,
          Type.TLiteral<"reply">,
          Type.TLiteral<"embedded-run">,
          Type.TLiteral<"background-exec">,
          Type.TLiteral<"cron-run">,
          Type.TLiteral<"task">,
          Type.TLiteral<"root-request">,
          Type.TLiteral<"session-admission">,
          Type.TLiteral<"session-mutation">,
          Type.TLiteral<"chat-run">,
          Type.TLiteral<"queued-turn">,
          Type.TLiteral<"terminal-persistence">,
          Type.TLiteral<"terminal-session">,
        ]
      >;
      count: Type.TInteger;
      message: Type.TString;
      task: Type.TOptional<
        Type.TObject<{
          taskId: Type.TString;
          status: Type.TLiteral<"running">;
          runtime: Type.TUnion<
            [
              Type.TLiteral<"subagent">,
              Type.TLiteral<"acp">,
              Type.TLiteral<"cli">,
              Type.TLiteral<"cron">,
            ]
          >;
          runId: Type.TOptional<Type.TString>;
          label: Type.TOptional<Type.TString>;
          title: Type.TOptional<Type.TString>;
        }>
      >;
    }>
  >;
}>;
declare const GatewaySuspendPrepareResultSchema: Type.TUnion<
  [
    Type.TObject<{
      status: Type.TLiteral<"busy">;
      reason: Type.TUnion<[Type.TLiteral<"active-work">, Type.TLiteral<"gateway-draining">]>;
      retryAfterMs: Type.TInteger;
      activeCount: Type.TInteger;
      blockers: Type.TArray<
        Type.TObject<{
          kind: Type.TUnion<
            [
              Type.TLiteral<"queue">,
              Type.TLiteral<"reply">,
              Type.TLiteral<"embedded-run">,
              Type.TLiteral<"background-exec">,
              Type.TLiteral<"cron-run">,
              Type.TLiteral<"task">,
              Type.TLiteral<"root-request">,
              Type.TLiteral<"session-admission">,
              Type.TLiteral<"session-mutation">,
              Type.TLiteral<"chat-run">,
              Type.TLiteral<"queued-turn">,
              Type.TLiteral<"terminal-persistence">,
              Type.TLiteral<"terminal-session">,
            ]
          >;
          count: Type.TInteger;
          message: Type.TString;
          task: Type.TOptional<
            Type.TObject<{
              taskId: Type.TString;
              status: Type.TLiteral<"running">;
              runtime: Type.TUnion<
                [
                  Type.TLiteral<"subagent">,
                  Type.TLiteral<"acp">,
                  Type.TLiteral<"cli">,
                  Type.TLiteral<"cron">,
                ]
              >;
              runId: Type.TOptional<Type.TString>;
              label: Type.TOptional<Type.TString>;
              title: Type.TOptional<Type.TString>;
            }>
          >;
        }>
      >;
    }>,
    Type.TObject<{
      status: Type.TLiteral<"ready">;
      suspensionId: Type.TString;
      expiresAtMs: Type.TInteger;
      activeCount: Type.TInteger;
      blockers: Type.TArray<
        Type.TObject<{
          kind: Type.TUnion<
            [
              Type.TLiteral<"queue">,
              Type.TLiteral<"reply">,
              Type.TLiteral<"embedded-run">,
              Type.TLiteral<"background-exec">,
              Type.TLiteral<"cron-run">,
              Type.TLiteral<"task">,
              Type.TLiteral<"root-request">,
              Type.TLiteral<"session-admission">,
              Type.TLiteral<"session-mutation">,
              Type.TLiteral<"chat-run">,
              Type.TLiteral<"queued-turn">,
              Type.TLiteral<"terminal-persistence">,
              Type.TLiteral<"terminal-session">,
            ]
          >;
          count: Type.TInteger;
          message: Type.TString;
          task: Type.TOptional<
            Type.TObject<{
              taskId: Type.TString;
              status: Type.TLiteral<"running">;
              runtime: Type.TUnion<
                [
                  Type.TLiteral<"subagent">,
                  Type.TLiteral<"acp">,
                  Type.TLiteral<"cli">,
                  Type.TLiteral<"cron">,
                ]
              >;
              runId: Type.TOptional<Type.TString>;
              label: Type.TOptional<Type.TString>;
              title: Type.TOptional<Type.TString>;
            }>
          >;
        }>
      >;
    }>,
  ]
>;
declare const GatewaySuspendStatusParamsSchema: Type.TObject<{
  suspensionId: Type.TString;
}>;
declare const GatewaySuspendStatusRunningResultSchema: Type.TObject<{
  status: Type.TLiteral<"running">;
}>;
declare const GatewaySuspendStatusReadyResultSchema: Type.TObject<{
  status: Type.TLiteral<"ready">;
  expiresAtMs: Type.TInteger;
}>;
declare const GatewaySuspendStatusResultSchema: Type.TUnion<
  [
    Type.TObject<{
      status: Type.TLiteral<"running">;
    }>,
    Type.TObject<{
      status: Type.TLiteral<"ready">;
      expiresAtMs: Type.TInteger;
    }>,
  ]
>;
declare const GatewaySuspendResumeParamsSchema: Type.TObject<{
  suspensionId: Type.TString;
}>;
declare const GatewaySuspendResumeResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  status: Type.TLiteral<"running">;
  resumed: Type.TBoolean;
}>;
type GatewaySuspendTaskBlocker = Static<typeof GatewaySuspendTaskBlockerSchema>;
type GatewaySuspendBlocker = Static<typeof GatewaySuspendBlockerSchema>;
type GatewaySuspendPrepareParams = Static<typeof GatewaySuspendPrepareParamsSchema>;
type GatewaySuspendPrepareResult = Static<typeof GatewaySuspendPrepareResultSchema>;
type GatewaySuspendStatusParams = Static<typeof GatewaySuspendStatusParamsSchema>;
type GatewaySuspendStatusResult = Static<typeof GatewaySuspendStatusResultSchema>;
type GatewaySuspendResumeParams = Static<typeof GatewaySuspendResumeParamsSchema>;
type GatewaySuspendResumeResult = Static<typeof GatewaySuspendResumeResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/logs-chat.d.ts
/** Cursor-based request for the gateway log tail endpoint. */
declare const LogsTailParamsSchema: Type.TObject<{
  cursor: Type.TOptional<Type.TInteger>;
  limit: Type.TOptional<Type.TInteger>;
  maxBytes: Type.TOptional<Type.TInteger>;
}>;
/** Gateway log tail payload returned to dashboard clients. */
declare const LogsTailResultSchema: Type.TObject<{
  file: Type.TString;
  cursor: Type.TInteger;
  size: Type.TInteger;
  lines: Type.TArray<Type.TString>;
  truncated: Type.TOptional<Type.TBoolean>;
  reset: Type.TOptional<Type.TBoolean>;
}>;
/** Session-scoped history request used by WebChat and native WebSocket clients. */
declare const ChatHistoryParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  limit: Type.TOptional<Type.TInteger>;
  offset: Type.TOptional<Type.TInteger>;
  messageId: Type.TOptional<Type.TString>;
  sessionId: Type.TOptional<Type.TString>;
  maxChars: Type.TOptional<Type.TInteger>;
}>;
/** Lightweight chat metadata request; optional agent scope keeps selector state explicit. */
declare const ChatMetadataParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
}>;
/** Batched purpose-title request for tool calls rendered in the Control UI. */
declare const ChatToolTitlesParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  items: Type.TArray<
    Type.TObject<{
      id: Type.TString;
      name: Type.TString;
      input: Type.TString;
    }>
  >;
}>;
/**
 * Titles keyed by the caller-provided item id; missing ids mean no title.
 * `disabled: true` tells clients the gateway has tool titles switched off so
 * they stop requesting for the rest of the session.
 */
declare const ChatToolTitlesResultSchema: Type.TObject<{
  titles: Type.TRecord<"^.*$", Type.TString>;
  disabled: Type.TOptional<Type.TBoolean>;
}>;
/** Typed result shape for tool-title consumers. */
type ChatToolTitlesResult = Static<typeof ChatToolTitlesResultSchema>;
/** User-to-agent send request; idempotency key lets clients safely retry transport failures. */
declare const ChatSendParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  sessionId: Type.TOptional<Type.TString>;
  message: Type.TString;
  thinking: Type.TOptional<Type.TString>;
  fastMode: Type.TOptional<Type.TUnion<[Type.TBoolean, Type.TLiteral<"auto">]>>;
  fastAutoOnSeconds: Type.TOptional<Type.TInteger>;
  deliver: Type.TOptional<Type.TBoolean>;
  originatingChannel: Type.TOptional<Type.TString>;
  originatingTo: Type.TOptional<Type.TString>;
  originatingAccountId: Type.TOptional<Type.TString>;
  originatingThreadId: Type.TOptional<Type.TString>;
  attachments: Type.TOptional<Type.TArray<Type.TUnknown>>;
  timeoutMs: Type.TOptional<Type.TInteger>;
  systemInputProvenance: Type.TOptional<
    Type.TObject<{
      kind: Type.TString;
      originSessionId: Type.TOptional<Type.TString>;
      sourceSessionKey: Type.TOptional<Type.TString>;
      sourceChannel: Type.TOptional<Type.TString>;
      sourceTool: Type.TOptional<Type.TString>;
    }>
  >;
  systemProvenanceReceipt: Type.TOptional<Type.TString>;
  suppressCommandInterpretation: Type.TOptional<Type.TBoolean>;
  expectedSessionRoutingContract: Type.TOptional<Type.TString>;
  idempotencyKey: Type.TString;
}>;
/** Inserts an operator-visible synthetic message into an existing chat transcript. */
declare const ChatInjectParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  message: Type.TString;
  label: Type.TOptional<Type.TString>;
}>;
/** Public chat stream event union consumed by gateway protocol validators. */
declare const ChatEventSchema: Type.TUnion<
  [
    Type.TObject<{
      state: Type.TLiteral<"delta">;
      message: Type.TOptional<Type.TUnknown>;
      deltaText: Type.TString;
      replace: Type.TOptional<Type.TBoolean>;
      usage: Type.TOptional<Type.TUnknown>;
      runId: Type.TString;
      sessionKey: Type.TString;
      agentId: Type.TOptional<Type.TString>;
      spawnedBy: Type.TOptional<Type.TString>;
      seq: Type.TInteger;
    }>,
    Type.TObject<{
      state: Type.TLiteral<"final">;
      message: Type.TOptional<Type.TUnknown>;
      usage: Type.TOptional<Type.TUnknown>;
      stopReason: Type.TOptional<Type.TString>;
      runId: Type.TString;
      sessionKey: Type.TString;
      agentId: Type.TOptional<Type.TString>;
      spawnedBy: Type.TOptional<Type.TString>;
      seq: Type.TInteger;
    }>,
    Type.TObject<{
      state: Type.TLiteral<"aborted">;
      message: Type.TOptional<Type.TUnknown>;
      errorMessage: Type.TOptional<Type.TString>;
      stopReason: Type.TOptional<Type.TString>;
      runId: Type.TString;
      sessionKey: Type.TString;
      agentId: Type.TOptional<Type.TString>;
      spawnedBy: Type.TOptional<Type.TString>;
      seq: Type.TInteger;
    }>,
    Type.TObject<{
      state: Type.TLiteral<"error">;
      message: Type.TOptional<Type.TUnknown>;
      errorMessage: Type.TOptional<Type.TString>;
      errorKind: Type.TOptional<
        Type.TUnion<
          [
            Type.TLiteral<"refusal">,
            Type.TLiteral<"timeout">,
            Type.TLiteral<"rate_limit">,
            Type.TLiteral<"context_length">,
            Type.TLiteral<"unknown">,
          ]
        >
      >;
      usage: Type.TOptional<Type.TUnknown>;
      stopReason: Type.TOptional<Type.TString>;
      runId: Type.TString;
      sessionKey: Type.TString;
      agentId: Type.TOptional<Type.TString>;
      spawnedBy: Type.TOptional<Type.TString>;
      seq: Type.TInteger;
    }>,
  ]
>;
type ChatMetadataParams = Static<typeof ChatMetadataParamsSchema>;
type ChatToolTitlesParams = Static<typeof ChatToolTitlesParamsSchema>;
type LogsTailParams = Static<typeof LogsTailParamsSchema>;
type LogsTailResult = Static<typeof LogsTailResultSchema>;
type ChatInjectParams = Static<typeof ChatInjectParamsSchema>;
type ChatEvent = Static<typeof ChatEventSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/nodes.d.ts
/** Reasons a node can report itself alive without implying an operator action. */
declare const NodePresenceAliveReasonSchema: Type.TString;
/** Presence heartbeat payload sent by remote nodes to refresh gateway state. */
declare const NodePresenceAlivePayloadSchema: Type.TObject<{
  trigger: Type.TString;
  sentAtMs: Type.TOptional<Type.TInteger>;
  displayName: Type.TOptional<Type.TString>;
  version: Type.TOptional<Type.TString>;
  platform: Type.TOptional<Type.TString>;
  deviceFamily: Type.TOptional<Type.TString>;
  modelIdentifier: Type.TOptional<Type.TString>;
  pushTransport: Type.TOptional<Type.TString>;
}>;
/** Recent operator input activity reported by an interactive node. */
declare const NodePresenceActivityPayloadSchema: Type.TObject<{
  idleSeconds: Type.TInteger;
  saturated: Type.TOptional<Type.TBoolean>;
}>;
/** Normalized result for node-originated events after gateway dispatch. */
declare const NodeEventResultSchema: Type.TObject<{
  ok: Type.TBoolean;
  event: Type.TString;
  handled: Type.TBoolean;
  reason: Type.TOptional<Type.TString>;
}>;
/** Lists pending node-pairing requests. */
declare const NodePairListParamsSchema: Type.TObject<{}>;
/** Approves a pending node-pairing request by request id. */
declare const NodePairApproveParamsSchema: Type.TObject<{
  requestId: Type.TString;
}>;
/** Rejects a pending node-pairing request by request id. */
declare const NodePairRejectParamsSchema: Type.TObject<{
  requestId: Type.TString;
}>;
/** Removes an already paired node from the gateway trust set. */
declare const NodePairRemoveParamsSchema: Type.TObject<{
  nodeId: Type.TString;
}>;
/** Lists paired nodes known to the gateway. */
declare const NodeListParamsSchema: Type.TObject<{}>;
/** Agent-visible tool descriptor advertised by a connected node. */
declare const NodePluginToolDescriptorSchema: Type.TObject<{
  pluginId: Type.TString;
  name: Type.TString;
  description: Type.TString;
  parameters: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
  command: Type.TOptional<Type.TString>;
  mcp: Type.TOptional<
    Type.TObject<{
      server: Type.TString;
      tool: Type.TString;
    }>
  >;
}>;
/** Replaces the connected node's dynamic agent-visible plugin/MCP tool catalog. */
declare const NodePluginToolsUpdateParamsSchema: Type.TObject<{
  tools: Type.TArray<
    Type.TObject<{
      pluginId: Type.TString;
      name: Type.TString;
      description: Type.TString;
      parameters: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
      command: Type.TOptional<Type.TString>;
      mcp: Type.TOptional<
        Type.TObject<{
          server: Type.TString;
          tool: Type.TString;
        }>
      >;
    }>
  >;
}>;
type NodePluginToolDescriptor = Static<typeof NodePluginToolDescriptorSchema>;
type NodePluginToolsUpdateParams = Static<typeof NodePluginToolsUpdateParamsSchema>;
/** Agent-visible skill descriptor advertised by a connected node. */
declare const NodeSkillDescriptorSchema: Type.TObject<{
  name: Type.TString;
  description: Type.TString;
  content: Type.TString;
}>;
/** Replaces the connected node's agent-visible skill catalog. */
declare const NodeSkillsUpdateParamsSchema: Type.TObject<{
  skills: Type.TArray<
    Type.TObject<{
      name: Type.TString;
      description: Type.TString;
      content: Type.TString;
    }>
  >;
}>;
type NodeSkillDescriptor = Static<typeof NodeSkillDescriptorSchema>;
type NodeSkillsUpdateParams = Static<typeof NodeSkillsUpdateParamsSchema>;
/** Acknowledges queued node work that the node has consumed. */
declare const NodePendingAckParamsSchema: Type.TObject<{
  ids: Type.TArray<Type.TString>;
}>;
/** Invokes a command on a paired node; idempotency allows safe retries. */
declare const NodeInvokeParamsSchema: Type.TObject<{
  nodeId: Type.TString;
  command: Type.TString;
  params: Type.TOptional<Type.TUnknown>;
  timeoutMs: Type.TOptional<Type.TInteger>;
  idempotencyKey: Type.TString;
  turnSourceChannel: Type.TOptional<Type.TString>;
  turnSourceTo: Type.TOptional<Type.TString>;
  turnSourceAccountId: Type.TOptional<Type.TString>;
  turnSourceThreadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
}>;
/** Result callback payload for a node command invocation. */
declare const NodeInvokeResultParamsSchema: Type.TObject<{
  id: Type.TString;
  nodeId: Type.TString;
  ok: Type.TBoolean;
  payload: Type.TOptional<Type.TUnknown>;
  payloadJSON: Type.TOptional<Type.TString>;
  error: Type.TOptional<
    Type.TObject<{
      code: Type.TOptional<Type.TString>;
      message: Type.TOptional<Type.TString>;
    }>
  >;
}>;
/** Ordered UTF-8 output emitted while a node command invocation is running. */
declare const NodeInvokeProgressParamsSchema: Type.TObject<{
  invokeId: Type.TString;
  nodeId: Type.TString;
  seq: Type.TInteger;
  chunk: Type.TString;
}>;
/** Generic node event envelope accepted by the gateway. */
declare const NodeEventParamsSchema: Type.TObject<{
  event: Type.TString;
  payload: Type.TOptional<Type.TUnknown>;
  payloadJSON: Type.TOptional<Type.TString>;
}>;
/** Request for a bounded batch of queued work assigned to the calling node. */
declare const NodePendingDrainParamsSchema: Type.TObject<{
  maxItems: Type.TOptional<Type.TInteger>;
}>;
/** Drain response with a revision marker for node queue state. */
declare const NodePendingDrainResultSchema: Type.TObject<{
  nodeId: Type.TString;
  revision: Type.TInteger;
  items: Type.TArray<
    Type.TObject<{
      id: Type.TString;
      type: Type.TString;
      priority: Type.TString;
      createdAtMs: Type.TInteger;
      expiresAtMs: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
      payload: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
    }>
  >;
  hasMore: Type.TBoolean;
}>;
/** Enqueues gateway-initiated work for a paired node. */
declare const NodePendingEnqueueParamsSchema: Type.TObject<{
  nodeId: Type.TString;
  type: Type.TString;
  priority: Type.TOptional<Type.TString>;
  expiresInMs: Type.TOptional<Type.TInteger>;
  wake: Type.TOptional<Type.TBoolean>;
}>;
/** Enqueue result echoes queue revision and whether wake delivery was attempted. */
declare const NodePendingEnqueueResultSchema: Type.TObject<{
  nodeId: Type.TString;
  revision: Type.TInteger;
  queued: Type.TObject<{
    id: Type.TString;
    type: Type.TString;
    priority: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
    payload: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
  }>;
  wakeTriggered: Type.TBoolean;
}>;
/** Ordered input frame sent by the gateway to one long-lived node invoke. */
declare const NodeInvokeInputEventSchema: Type.TObject<{
  id: Type.TString;
  nodeId: Type.TString;
  seq: Type.TInteger;
  payloadJSON: Type.TString;
}>;
type NodePairListParams = Static<typeof NodePairListParamsSchema>;
type NodePairApproveParams = Static<typeof NodePairApproveParamsSchema>;
type NodePairRejectParams = Static<typeof NodePairRejectParamsSchema>;
type NodePairRemoveParams = Static<typeof NodePairRemoveParamsSchema>;
type NodeListParams = Static<typeof NodeListParamsSchema>;
type NodeInvokeParams = Static<typeof NodeInvokeParamsSchema>;
type NodeInvokeResultParams = Static<typeof NodeInvokeResultParamsSchema>;
type NodeInvokeProgressParams = Static<typeof NodeInvokeProgressParamsSchema>;
type NodeInvokeInputEvent = Static<typeof NodeInvokeInputEventSchema>;
type NodeEventParams = Static<typeof NodeEventParamsSchema>;
type NodeEventResult = Static<typeof NodeEventResultSchema>;
type NodePresenceAlivePayload = Static<typeof NodePresenceAlivePayloadSchema>;
type NodePresenceAliveReason = Static<typeof NodePresenceAliveReasonSchema>;
type NodePresenceActivityPayload = Static<typeof NodePresenceActivityPayloadSchema>;
type NodePendingDrainParams = Static<typeof NodePendingDrainParamsSchema>;
type NodePendingDrainResult = Static<typeof NodePendingDrainResultSchema>;
type NodePendingEnqueueParams = Static<typeof NodePendingEnqueueParamsSchema>;
type NodePendingEnqueueResult = Static<typeof NodePendingEnqueueResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/version.d.ts
/** Current gateway protocol version emitted by modern clients and servers. */
declare const PROTOCOL_VERSION: 4;
/** Lowest general client protocol version accepted by the gateway. */
declare const MIN_CLIENT_PROTOCOL_VERSION: 4;
/** Lowest authenticated node protocol version accepted by the gateway. */
declare const MIN_NODE_PROTOCOL_VERSION: 3;
/** Lowest lightweight probe protocol version accepted by the gateway. */
declare const MIN_PROBE_PROTOCOL_VERSION: 3;
//#endregion
//#region packages/gateway-protocol/src/schema/push.d.ts
/** Request payload for sending a test APNS notification to one node. */
declare const PushTestParamsSchema: Type.TObject<{
  nodeId: Type.TString;
  title: Type.TOptional<Type.TString>;
  body: Type.TOptional<Type.TString>;
  environment: Type.TOptional<Type.TString>;
}>;
/** Result payload from an APNS push test, including provider status and transport. */
declare const PushTestResultSchema: Type.TObject<{
  ok: Type.TBoolean;
  status: Type.TInteger;
  apnsId: Type.TOptional<Type.TString>;
  reason: Type.TOptional<Type.TString>;
  tokenSuffix: Type.TString;
  topic: Type.TString;
  environment: Type.TString;
  transport: Type.TString;
}>;
/** Empty request payload for fetching the Web Push VAPID public key. */
declare const WebPushVapidPublicKeyParamsSchema: Type.TObject<{}>;
/** Browser Web Push subscription payload registered with the gateway. */
declare const WebPushSubscribeParamsSchema: Type.TObject<{
  endpoint: Type.TString;
  keys: Type.TObject<{
    p256dh: Type.TString;
    auth: Type.TString;
  }>;
}>;
/** Browser Web Push endpoint removal payload. */
declare const WebPushUnsubscribeParamsSchema: Type.TObject<{
  endpoint: Type.TString;
}>;
/** Request payload for sending a test Web Push notification to current subscriptions. */
declare const WebPushTestParamsSchema: Type.TObject<{
  title: Type.TOptional<Type.TString>;
  body: Type.TOptional<Type.TString>;
}>;
/** Empty request type for fetching the Web Push VAPID public key. */
type WebPushVapidPublicKeyParams = Record<string, never>;
/** Browser PushSubscription subset persisted by the gateway. */
type WebPushSubscribeParams = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
};
/** Browser PushSubscription endpoint removal request. */
type WebPushUnsubscribeParams = {
  endpoint: string;
};
/** Optional title/body overrides for a Web Push test notification. */
type WebPushTestParams = {
  title?: string;
  body?: string;
};
//#endregion
//#region packages/gateway-protocol/src/schema/session-placement.d.ts
/** Durable gateway ownership states for one session execution placement. */
declare const SessionPlacementStateSchema: Type.TUnion<
  [
    Type.TLiteral<"local">,
    Type.TLiteral<"requested">,
    Type.TLiteral<"provisioning">,
    Type.TLiteral<"syncing">,
    Type.TLiteral<"starting">,
    Type.TLiteral<"active">,
    Type.TLiteral<"draining">,
    Type.TLiteral<"reconciling">,
    Type.TLiteral<"reclaimed">,
    Type.TLiteral<"failed">,
  ]
>;
/** Gateway-visible placement projection; `state` remains the closed discriminator. */
declare const SessionPlacementSchema: Type.TUnion<
  [
    Type.TObject<{
      generation: Type.TInteger;
      createdAtMs: Type.TInteger;
      updatedAtMs: Type.TInteger;
      stateChangedAtMs: Type.TInteger;
      state: Type.TLiteral<"local">;
    }>,
    Type.TObject<{
      generation: Type.TInteger;
      createdAtMs: Type.TInteger;
      updatedAtMs: Type.TInteger;
      stateChangedAtMs: Type.TInteger;
      state: Type.TLiteral<"requested">;
    }>,
    Type.TObject<{
      environmentId: Type.TOptional<Type.TString>;
      generation: Type.TInteger;
      createdAtMs: Type.TInteger;
      updatedAtMs: Type.TInteger;
      stateChangedAtMs: Type.TInteger;
      state: Type.TLiteral<"provisioning">;
    }>,
    Type.TObject<{
      environmentId: Type.TString;
      workerBundleHash: Type.TString;
      generation: Type.TInteger;
      createdAtMs: Type.TInteger;
      updatedAtMs: Type.TInteger;
      stateChangedAtMs: Type.TInteger;
      state: Type.TLiteral<"syncing">;
    }>,
    Type.TObject<{
      workspaceBaseManifestRef: Type.TString;
      remoteWorkspaceDir: Type.TString;
      environmentId: Type.TString;
      workerBundleHash: Type.TString;
      generation: Type.TInteger;
      createdAtMs: Type.TInteger;
      updatedAtMs: Type.TInteger;
      stateChangedAtMs: Type.TInteger;
      state: Type.TLiteral<"starting">;
    }>,
    Type.TObject<{
      lastTranscriptAckCursor: Type.TOptional<Type.TInteger>;
      lastLiveEventAckCursor: Type.TOptional<Type.TInteger>;
      workspaceBaseManifestRef: Type.TString;
      remoteWorkspaceDir: Type.TString;
      environmentId: Type.TString;
      activeOwnerEpoch: Type.TInteger;
      workerBundleHash: Type.TString;
      generation: Type.TInteger;
      createdAtMs: Type.TInteger;
      updatedAtMs: Type.TInteger;
      stateChangedAtMs: Type.TInteger;
      state: Type.TLiteral<"active">;
    }>,
    Type.TObject<{
      lastTranscriptAckCursor: Type.TOptional<Type.TInteger>;
      lastLiveEventAckCursor: Type.TOptional<Type.TInteger>;
      workspaceBaseManifestRef: Type.TString;
      remoteWorkspaceDir: Type.TString;
      environmentId: Type.TString;
      activeOwnerEpoch: Type.TInteger;
      workerBundleHash: Type.TString;
      generation: Type.TInteger;
      createdAtMs: Type.TInteger;
      updatedAtMs: Type.TInteger;
      stateChangedAtMs: Type.TInteger;
      state: Type.TLiteral<"draining">;
    }>,
    Type.TObject<{
      lastTranscriptAckCursor: Type.TOptional<Type.TInteger>;
      lastLiveEventAckCursor: Type.TOptional<Type.TInteger>;
      workspaceBaseManifestRef: Type.TString;
      remoteWorkspaceDir: Type.TString;
      environmentId: Type.TString;
      activeOwnerEpoch: Type.TInteger;
      workerBundleHash: Type.TString;
      generation: Type.TInteger;
      createdAtMs: Type.TInteger;
      updatedAtMs: Type.TInteger;
      stateChangedAtMs: Type.TInteger;
      state: Type.TLiteral<"reconciling">;
    }>,
    Type.TObject<{
      lastTranscriptAckCursor: Type.TOptional<Type.TInteger>;
      lastLiveEventAckCursor: Type.TOptional<Type.TInteger>;
      environmentId: Type.TOptional<Type.TString>;
      activeOwnerEpoch: Type.TOptional<Type.TInteger>;
      workspaceBaseManifestRef: Type.TOptional<Type.TString>;
      remoteWorkspaceDir: Type.TOptional<Type.TString>;
      workerBundleHash: Type.TOptional<Type.TString>;
      generation: Type.TInteger;
      createdAtMs: Type.TInteger;
      updatedAtMs: Type.TInteger;
      stateChangedAtMs: Type.TInteger;
      state: Type.TLiteral<"reclaimed">;
    }>,
    Type.TObject<{
      recoveryError: Type.TString;
      lastTranscriptAckCursor: Type.TOptional<Type.TInteger>;
      lastLiveEventAckCursor: Type.TOptional<Type.TInteger>;
      environmentId: Type.TOptional<Type.TString>;
      activeOwnerEpoch: Type.TOptional<Type.TInteger>;
      workspaceBaseManifestRef: Type.TOptional<Type.TString>;
      remoteWorkspaceDir: Type.TOptional<Type.TString>;
      workerBundleHash: Type.TOptional<Type.TString>;
      generation: Type.TInteger;
      createdAtMs: Type.TInteger;
      updatedAtMs: Type.TInteger;
      stateChangedAtMs: Type.TInteger;
      state: Type.TLiteral<"failed">;
    }>,
  ]
>;
/** Requests one-way dispatch of an existing local session to a configured worker profile. */
declare const SessionsDispatchParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  profileId: Type.TString;
}>;
/** Result returned once session dispatch reaches durable worker ownership. */
declare const SessionsDispatchResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  key: Type.TString;
  sessionId: Type.TString;
  placement: Type.TObject<{
    lastTranscriptAckCursor: Type.TOptional<Type.TInteger>;
    lastLiveEventAckCursor: Type.TOptional<Type.TInteger>;
    workspaceBaseManifestRef: Type.TString;
    remoteWorkspaceDir: Type.TString;
    environmentId: Type.TString;
    activeOwnerEpoch: Type.TInteger;
    workerBundleHash: Type.TString;
    generation: Type.TInteger;
    createdAtMs: Type.TInteger;
    updatedAtMs: Type.TInteger;
    stateChangedAtMs: Type.TInteger;
    state: Type.TLiteral<"active">;
  }>;
}>;
type SessionPlacementState = Static<typeof SessionPlacementStateSchema>;
type SessionPlacement = Static<typeof SessionPlacementSchema>;
type SessionsDispatchParams = Static<typeof SessionsDispatchParamsSchema>;
type SessionsDispatchResult = Static<typeof SessionsDispatchResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/snapshot.d.ts
/**
 * Gateway state snapshot schemas.
 *
 * Snapshots are sent during hello and later event streams; they summarize node
 * presence, health, session defaults, and version counters for clients.
 */
/** One gateway-visible presence record for a node/client/runtime. */
declare const PresenceEntrySchema: Type.TObject<{
  host: Type.TOptional<Type.TString>;
  ip: Type.TOptional<Type.TString>;
  version: Type.TOptional<Type.TString>;
  platform: Type.TOptional<Type.TString>;
  deviceFamily: Type.TOptional<Type.TString>;
  modelIdentifier: Type.TOptional<Type.TString>;
  mode: Type.TOptional<Type.TString>;
  lastInputSeconds: Type.TOptional<Type.TInteger>;
  reason: Type.TOptional<Type.TString>;
  tags: Type.TOptional<Type.TArray<Type.TString>>;
  text: Type.TOptional<Type.TString>;
  ts: Type.TInteger;
  deviceId: Type.TOptional<Type.TString>;
  roles: Type.TOptional<Type.TArray<Type.TString>>;
  scopes: Type.TOptional<Type.TArray<Type.TString>>;
  instanceId: Type.TOptional<Type.TString>;
}>;
/** Monotonic version counters for snapshot subtrees. */
declare const StateVersionSchema: Type.TObject<{
  presence: Type.TInteger;
  health: Type.TInteger;
}>;
/** Initial and incremental gateway state snapshot payload. */
declare const SnapshotSchema: Type.TObject<{
  presence: Type.TArray<
    Type.TObject<{
      host: Type.TOptional<Type.TString>;
      ip: Type.TOptional<Type.TString>;
      version: Type.TOptional<Type.TString>;
      platform: Type.TOptional<Type.TString>;
      deviceFamily: Type.TOptional<Type.TString>;
      modelIdentifier: Type.TOptional<Type.TString>;
      mode: Type.TOptional<Type.TString>;
      lastInputSeconds: Type.TOptional<Type.TInteger>;
      reason: Type.TOptional<Type.TString>;
      tags: Type.TOptional<Type.TArray<Type.TString>>;
      text: Type.TOptional<Type.TString>;
      ts: Type.TInteger;
      deviceId: Type.TOptional<Type.TString>;
      roles: Type.TOptional<Type.TArray<Type.TString>>;
      scopes: Type.TOptional<Type.TArray<Type.TString>>;
      instanceId: Type.TOptional<Type.TString>;
    }>
  >;
  health: Type.TAny;
  stateVersion: Type.TObject<{
    presence: Type.TInteger;
    health: Type.TInteger;
  }>;
  uptimeMs: Type.TInteger;
  configPath: Type.TOptional<Type.TString>;
  stateDir: Type.TOptional<Type.TString>;
  sessionDefaults: Type.TOptional<
    Type.TObject<{
      defaultAgentId: Type.TString;
      mainKey: Type.TString;
      mainSessionKey: Type.TString;
      scope: Type.TOptional<Type.TString>;
    }>
  >;
  authMode: Type.TOptional<
    Type.TUnion<
      [
        Type.TLiteral<"none">,
        Type.TLiteral<"token">,
        Type.TLiteral<"password">,
        Type.TLiteral<"trusted-proxy">,
      ]
    >
  >;
  updateAvailable: Type.TOptional<
    Type.TObject<{
      currentVersion: Type.TString;
      latestVersion: Type.TString;
      channel: Type.TString;
    }>
  >;
}>;
type Snapshot = Static<typeof SnapshotSchema>;
type PresenceEntry = Static<typeof PresenceEntrySchema>;
type StateVersion = Static<typeof StateVersionSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/system-info.d.ts
/** Empty request payload for Gateway host system information. */
declare const SystemInfoParamsSchema: Type.TObject<{}>;
/** Gateway host identity and resource snapshot. */
declare const SystemInfoResultSchema: Type.TObject<{
  machineName: Type.TString;
  hostname: Type.TString;
  platform: Type.TString;
  release: Type.TString;
  arch: Type.TString;
  osLabel: Type.TString;
  lanAddress: Type.TOptional<Type.TString>;
  port: Type.TOptional<Type.TInteger>;
  nodeVersion: Type.TString;
  pid: Type.TInteger /** Process-start identity for invalidating work that cannot survive a Gateway restart. */;
  processInstanceId: Type.TOptional<Type.TString>;
  uptimeMs: Type.TInteger;
  cpuCount: Type.TInteger;
  cpuModel: Type.TOptional<Type.TString>;
  loadAverage: Type.TOptional<Type.TTuple<[Type.TNumber, Type.TNumber, Type.TNumber]>>;
  memoryTotalBytes: Type.TInteger;
  memoryFreeBytes: Type.TInteger;
  diskTotalBytes: Type.TOptional<Type.TInteger>;
  diskAvailableBytes: Type.TOptional<Type.TInteger>;
  diskPath: Type.TOptional<Type.TString>;
}>;
type SystemInfoParams = Static<typeof SystemInfoParamsSchema>;
type SystemInfoResult = Static<typeof SystemInfoResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/task-suggestions.d.ts
/** One model-proposed follow-up task waiting for operator action. */
declare const TaskSuggestionSchema: Type.TObject<{
  id: Type.TString;
  title: Type.TString;
  prompt: Type.TString;
  tldr: Type.TString;
  cwd: Type.TString;
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  createdAt: Type.TInteger;
}>;
/** Lists pending suggestions, optionally narrowed to one source session. */
declare const TaskSuggestionsListParamsSchema: Type.TObject<{
  sessionKey: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
}>;
declare const TaskSuggestionsListResultSchema: Type.TObject<{
  suggestions: Type.TArray<
    Type.TObject<{
      id: Type.TString;
      title: Type.TString;
      prompt: Type.TString;
      tldr: Type.TString;
      cwd: Type.TString;
      sessionKey: Type.TString;
      agentId: Type.TOptional<Type.TString>;
      createdAt: Type.TInteger;
    }>
  >;
}>;
/** Creates a pending suggestion without starting any work. */
declare const TaskSuggestionsCreateParamsSchema: Type.TObject<{
  title: Type.TString;
  prompt: Type.TString;
  tldr: Type.TString;
  cwd: Type.TString;
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
}>;
declare const TaskSuggestionsCreateResultSchema: Type.TObject<{
  taskId: Type.TString;
  suggestion: Type.TObject<{
    id: Type.TString;
    title: Type.TString;
    prompt: Type.TString;
    tldr: Type.TString;
    cwd: Type.TString;
    sessionKey: Type.TString;
    agentId: Type.TOptional<Type.TString>;
    createdAt: Type.TInteger;
  }>;
}>;
declare const TaskSuggestionResolutionSchema: Type.TUnion<
  [Type.TLiteral<"dismissed">, Type.TLiteral<"accepted">, Type.TLiteral<"expired">]
>;
/** Atomically claims a pending suggestion and starts its server-owned worktree session. */
declare const TaskSuggestionsAcceptParamsSchema: Type.TObject<{
  taskId: Type.TString;
}>;
declare const TaskSuggestionsAcceptResultSchema: Type.TObject<{
  taskId: Type.TString;
  key: Type.TString;
}>;
/** Removes a pending suggestion without starting work. */
declare const TaskSuggestionsDismissParamsSchema: Type.TObject<{
  taskId: Type.TString;
  reason: Type.TOptional<Type.TString>;
}>;
declare const TaskSuggestionsDismissResultSchema: Type.TObject<{
  taskId: Type.TString;
  dismissed: Type.TBoolean;
}>;
/** Live update emitted when a pending suggestion is created or resolved. */
declare const TaskSuggestionEventSchema: Type.TUnion<
  [
    Type.TObject<{
      action: Type.TLiteral<"created">;
      suggestion: Type.TObject<{
        id: Type.TString;
        title: Type.TString;
        prompt: Type.TString;
        tldr: Type.TString;
        cwd: Type.TString;
        sessionKey: Type.TString;
        agentId: Type.TOptional<Type.TString>;
        createdAt: Type.TInteger;
      }>;
    }>,
    Type.TObject<{
      action: Type.TLiteral<"resolved">;
      taskId: Type.TString;
      resolution: Type.TUnion<
        [Type.TLiteral<"dismissed">, Type.TLiteral<"accepted">, Type.TLiteral<"expired">]
      >;
    }>,
  ]
>;
type TaskSuggestion = Static<typeof TaskSuggestionSchema>;
type TaskSuggestionEvent = Static<typeof TaskSuggestionEventSchema>;
type TaskSuggestionResolution = Static<typeof TaskSuggestionResolutionSchema>;
type TaskSuggestionsAcceptParams = Static<typeof TaskSuggestionsAcceptParamsSchema>;
type TaskSuggestionsAcceptResult = Static<typeof TaskSuggestionsAcceptResultSchema>;
type TaskSuggestionsCreateParams = Static<typeof TaskSuggestionsCreateParamsSchema>;
type TaskSuggestionsCreateResult = Static<typeof TaskSuggestionsCreateResultSchema>;
type TaskSuggestionsDismissParams = Static<typeof TaskSuggestionsDismissParamsSchema>;
type TaskSuggestionsDismissResult = Static<typeof TaskSuggestionsDismissResultSchema>;
type TaskSuggestionsListParams = Static<typeof TaskSuggestionsListParamsSchema>;
type TaskSuggestionsListResult = Static<typeof TaskSuggestionsListResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/tasks.d.ts
/** Public task summary returned by task list/get/cancel responses. */
declare const TaskSummarySchema: Type.TObject<{
  id: Type.TString;
  kind: Type.TOptional<Type.TString>;
  runtime: Type.TOptional<Type.TString>;
  status: Type.TUnion<
    [
      Type.TLiteral<"queued">,
      Type.TLiteral<"running">,
      Type.TLiteral<"completed">,
      Type.TLiteral<"failed">,
      Type.TLiteral<"cancelled">,
      Type.TLiteral<"timed_out">,
    ]
  >;
  title: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
  sessionKey: Type.TOptional<Type.TString>;
  childSessionKey: Type.TOptional<Type.TString>;
  ownerKey: Type.TOptional<Type.TString>;
  runId: Type.TOptional<Type.TString>;
  taskId: Type.TOptional<Type.TString>;
  flowId: Type.TOptional<Type.TString>;
  parentTaskId: Type.TOptional<Type.TString>;
  sourceId: Type.TOptional<Type.TString>;
  createdAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
  updatedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
  startedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
  endedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
  toolUseCount: Type.TOptional<Type.TInteger>;
  lastToolName: Type.TOptional<Type.TString>;
  progressSummary: Type.TOptional<Type.TString>;
  terminalSummary: Type.TOptional<Type.TString>;
  error: Type.TOptional<Type.TString>;
}>;
/** Task list filters with bounded pagination. */
declare const TasksListParamsSchema: Type.TObject<{
  status: Type.TOptional<
    Type.TUnion<
      [
        Type.TUnion<
          [
            Type.TLiteral<"queued">,
            Type.TLiteral<"running">,
            Type.TLiteral<"completed">,
            Type.TLiteral<"failed">,
            Type.TLiteral<"cancelled">,
            Type.TLiteral<"timed_out">,
          ]
        >,
        Type.TArray<
          Type.TUnion<
            [
              Type.TLiteral<"queued">,
              Type.TLiteral<"running">,
              Type.TLiteral<"completed">,
              Type.TLiteral<"failed">,
              Type.TLiteral<"cancelled">,
              Type.TLiteral<"timed_out">,
            ]
          >
        >,
      ]
    >
  >;
  agentId: Type.TOptional<Type.TString>;
  sessionKey: Type.TOptional<Type.TString>;
  limit: Type.TOptional<Type.TInteger>;
  cursor: Type.TOptional<Type.TString>;
}>;
/** Task list page response. */
declare const TasksListResultSchema: Type.TObject<{
  tasks: Type.TArray<
    Type.TObject<{
      id: Type.TString;
      kind: Type.TOptional<Type.TString>;
      runtime: Type.TOptional<Type.TString>;
      status: Type.TUnion<
        [
          Type.TLiteral<"queued">,
          Type.TLiteral<"running">,
          Type.TLiteral<"completed">,
          Type.TLiteral<"failed">,
          Type.TLiteral<"cancelled">,
          Type.TLiteral<"timed_out">,
        ]
      >;
      title: Type.TOptional<Type.TString>;
      agentId: Type.TOptional<Type.TString>;
      sessionKey: Type.TOptional<Type.TString>;
      childSessionKey: Type.TOptional<Type.TString>;
      ownerKey: Type.TOptional<Type.TString>;
      runId: Type.TOptional<Type.TString>;
      taskId: Type.TOptional<Type.TString>;
      flowId: Type.TOptional<Type.TString>;
      parentTaskId: Type.TOptional<Type.TString>;
      sourceId: Type.TOptional<Type.TString>;
      createdAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
      updatedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
      startedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
      endedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
      toolUseCount: Type.TOptional<Type.TInteger>;
      lastToolName: Type.TOptional<Type.TString>;
      progressSummary: Type.TOptional<Type.TString>;
      terminalSummary: Type.TOptional<Type.TString>;
      error: Type.TOptional<Type.TString>;
    }>
  >;
  nextCursor: Type.TOptional<Type.TString>;
}>;
/** Lookup request for one task id. */
declare const TasksGetParamsSchema: Type.TObject<{
  taskId: Type.TString;
}>;
/** Lookup result for one task summary. */
declare const TasksGetResultSchema: Type.TObject<{
  task: Type.TObject<{
    id: Type.TString;
    kind: Type.TOptional<Type.TString>;
    runtime: Type.TOptional<Type.TString>;
    status: Type.TUnion<
      [
        Type.TLiteral<"queued">,
        Type.TLiteral<"running">,
        Type.TLiteral<"completed">,
        Type.TLiteral<"failed">,
        Type.TLiteral<"cancelled">,
        Type.TLiteral<"timed_out">,
      ]
    >;
    title: Type.TOptional<Type.TString>;
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
    childSessionKey: Type.TOptional<Type.TString>;
    ownerKey: Type.TOptional<Type.TString>;
    runId: Type.TOptional<Type.TString>;
    taskId: Type.TOptional<Type.TString>;
    flowId: Type.TOptional<Type.TString>;
    parentTaskId: Type.TOptional<Type.TString>;
    sourceId: Type.TOptional<Type.TString>;
    createdAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
    updatedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
    startedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
    endedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
    toolUseCount: Type.TOptional<Type.TInteger>;
    lastToolName: Type.TOptional<Type.TString>;
    progressSummary: Type.TOptional<Type.TString>;
    terminalSummary: Type.TOptional<Type.TString>;
    error: Type.TOptional<Type.TString>;
  }>;
}>;
/** Cancel request for one task id with optional operator reason. */
declare const TasksCancelParamsSchema: Type.TObject<{
  taskId: Type.TString;
  reason: Type.TOptional<Type.TString>;
}>;
/** Cancel result, including the task snapshot when it was found. */
declare const TasksCancelResultSchema: Type.TObject<{
  found: Type.TBoolean;
  cancelled: Type.TBoolean;
  reason: Type.TOptional<Type.TString>;
  task: Type.TOptional<
    Type.TObject<{
      id: Type.TString;
      kind: Type.TOptional<Type.TString>;
      runtime: Type.TOptional<Type.TString>;
      status: Type.TUnion<
        [
          Type.TLiteral<"queued">,
          Type.TLiteral<"running">,
          Type.TLiteral<"completed">,
          Type.TLiteral<"failed">,
          Type.TLiteral<"cancelled">,
          Type.TLiteral<"timed_out">,
        ]
      >;
      title: Type.TOptional<Type.TString>;
      agentId: Type.TOptional<Type.TString>;
      sessionKey: Type.TOptional<Type.TString>;
      childSessionKey: Type.TOptional<Type.TString>;
      ownerKey: Type.TOptional<Type.TString>;
      runId: Type.TOptional<Type.TString>;
      taskId: Type.TOptional<Type.TString>;
      flowId: Type.TOptional<Type.TString>;
      parentTaskId: Type.TOptional<Type.TString>;
      sourceId: Type.TOptional<Type.TString>;
      createdAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
      updatedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
      startedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
      endedAt: Type.TOptional<Type.TUnion<[Type.TString, Type.TInteger]>>;
      toolUseCount: Type.TOptional<Type.TInteger>;
      lastToolName: Type.TOptional<Type.TString>;
      progressSummary: Type.TOptional<Type.TString>;
      terminalSummary: Type.TOptional<Type.TString>;
      error: Type.TOptional<Type.TString>;
    }>
  >;
}>;
type TaskSummary = Static<typeof TaskSummarySchema>;
type TasksListParams = Static<typeof TasksListParamsSchema>;
type TasksListResult = Static<typeof TasksListResultSchema>;
type TasksGetParams = Static<typeof TasksGetParamsSchema>;
type TasksGetResult = Static<typeof TasksGetResultSchema>;
type TasksCancelParams = Static<typeof TasksCancelParamsSchema>;
type TasksCancelResult = Static<typeof TasksCancelResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/terminal.d.ts
/** Opens a shell session; the server picks the shell, cwd, and confinement. */
declare const TerminalOpenParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  catalog: Type.TOptional<
    Type.TObject<{
      catalogId: Type.TString;
      hostId: Type.TString;
      threadId: Type.TString;
    }>
  >;
  cols: Type.TInteger;
  rows: Type.TInteger;
}>;
type TerminalOpenParams = Static<typeof TerminalOpenParamsSchema>;
/** Result of a successful open; carries the facts the UI header renders. */
declare const TerminalOpenResultSchema: Type.TObject<{
  sessionId: Type.TString;
  agentId: Type.TString;
  shell: Type.TString;
  cwd: Type.TString;
  confined: Type.TBoolean;
  title: Type.TOptional<Type.TString>;
}>;
type TerminalOpenResult = Static<typeof TerminalOpenResultSchema>;
/** Writes client keystrokes to the session stdin. */
declare const TerminalInputParamsSchema: Type.TObject<{
  sessionId: Type.TString;
  data: Type.TString;
}>;
type TerminalInputParams = Static<typeof TerminalInputParamsSchema>;
/** Resizes the PTY grid after the client viewport changes. */
declare const TerminalResizeParamsSchema: Type.TObject<{
  sessionId: Type.TString;
  cols: Type.TInteger;
  rows: Type.TInteger;
}>;
type TerminalResizeParams = Static<typeof TerminalResizeParamsSchema>;
/** Closes a session and kills its process tree. */
declare const TerminalCloseParamsSchema: Type.TObject<{
  sessionId: Type.TString;
}>;
type TerminalCloseParams = Static<typeof TerminalCloseParamsSchema>;
/**
 * Rebinds a live-or-detached session to the calling admin connection.
 * Attach is take-over (tmux-like): the previous owner, if still connected,
 * receives `terminal.exit` with reason "detached".
 */
declare const TerminalAttachParamsSchema: Type.TObject<{
  sessionId: Type.TString;
}>;
type TerminalAttachParams = Static<typeof TerminalAttachParamsSchema>;
/** Result of a successful attach; mirrors open plus the replay buffer. */
declare const TerminalAttachResultSchema: Type.TObject<{
  sessionId: Type.TString;
  agentId: Type.TString;
  shell: Type.TString;
  cwd: Type.TString;
  confined: Type.TBoolean;
  buffer: Type.TString;
}>;
type TerminalAttachResult = Static<typeof TerminalAttachResultSchema>;
/** One attachable session, as reported by terminal.list. */
declare const TerminalSessionInfoSchema: Type.TObject<{
  sessionId: Type.TString;
  agentId: Type.TString;
  shell: Type.TString;
  cwd: Type.TString;
  confined: Type.TBoolean /** False while the session is detached (no connection owns its stream). */;
  attached: Type.TBoolean;
  createdAtMs: Type.TInteger;
}>;
type TerminalSessionInfo = Static<typeof TerminalSessionInfoSchema>;
/**
 * Sessions a reconnecting admin client can attach. All admin connections see
 * the same list: the terminal surface is already operator.admin (full host
 * access), so cross-connection visibility adds no privilege.
 */
declare const TerminalListResultSchema: Type.TObject<{
  sessions: Type.TArray<
    Type.TObject<{
      sessionId: Type.TString;
      agentId: Type.TString;
      shell: Type.TString;
      cwd: Type.TString;
      confined: Type.TBoolean /** False while the session is detached (no connection owns its stream). */;
      attached: Type.TBoolean;
      createdAtMs: Type.TInteger;
    }>
  >;
}>;
type TerminalListResult = Static<typeof TerminalListResultSchema>;
/** Reads the current output buffer as plain text without attaching. */
declare const TerminalTextParamsSchema: Type.TObject<{
  sessionId: Type.TString;
}>;
type TerminalTextParams = Static<typeof TerminalTextParamsSchema>;
/** Plain-text buffer contents (ANSI stripped); an agent/LLM affordance. */
declare const TerminalTextResultSchema: Type.TObject<{
  text: Type.TString;
}>;
type TerminalTextResult = Static<typeof TerminalTextResultSchema>;
/** Shared ok/void result for input, resize, and close. */
declare const TerminalAckResultSchema: Type.TObject<{
  ok: Type.TBoolean;
}>;
type TerminalAckResult = Static<typeof TerminalAckResultSchema>;
/** Streamed output chunk; seq is a per-session monotonic counter for diagnostics and tests. */
declare const TerminalDataEventSchema: Type.TObject<{
  sessionId: Type.TString;
  seq: Type.TInteger;
  data: Type.TString;
}>;
type TerminalDataEvent = Static<typeof TerminalDataEventSchema>;
/** Terminal end-of-life notice; the session id is invalid after this event. */
declare const TerminalExitEventSchema: Type.TObject<{
  sessionId: Type.TString;
  exitCode: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
  signal: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
  reason: Type.TOptional<
    Type.TUnion<
      [
        Type.TLiteral<"process_exit">,
        Type.TLiteral<"closed">,
        Type.TLiteral<"disconnected">,
        Type.TLiteral<"detached">,
        Type.TLiteral<"error">,
      ]
    >
  >;
  error: Type.TOptional<Type.TString>;
}>;
type TerminalExitEvent = Static<typeof TerminalExitEventSchema>;
/** Union of every event a terminal session can emit. */
declare const TerminalEventSchema: Type.TUnion<
  [
    Type.TObject<{
      sessionId: Type.TString;
      seq: Type.TInteger;
      data: Type.TString;
    }>,
    Type.TObject<{
      sessionId: Type.TString;
      exitCode: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
      signal: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
      reason: Type.TOptional<
        Type.TUnion<
          [
            Type.TLiteral<"process_exit">,
            Type.TLiteral<"closed">,
            Type.TLiteral<"disconnected">,
            Type.TLiteral<"detached">,
            Type.TLiteral<"error">,
          ]
        >
      >;
      error: Type.TOptional<Type.TString>;
    }>,
  ]
>;
type TerminalEvent = Static<typeof TerminalEventSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/plugins.d.ts
/** Empty request payload for listing plugin UI descriptors. */
declare const PluginsUiDescriptorsParamsSchema: Type.TObject<{}>;
/** Response payload containing all plugin UI descriptors visible to the client. */
declare const PluginsUiDescriptorsResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  descriptors: Type.TArray<
    Type.TObject<{
      id: Type.TString;
      pluginId: Type.TString;
      pluginName: Type.TOptional<Type.TString>;
      surface: Type.TUnion<
        [
          Type.TLiteral<"session">,
          Type.TLiteral<"tool">,
          Type.TLiteral<"run">,
          Type.TLiteral<"settings">,
        ]
      >;
      label: Type.TString;
      description: Type.TOptional<Type.TString>;
      placement: Type.TOptional<Type.TString>;
      schema: Type.TOptional<Type.TUnknown>;
      requiredScopes: Type.TOptional<Type.TArray<Type.TString>>;
    }>
  >;
}>;
/** Request payload for invoking one plugin-owned session action. */
declare const PluginsSessionActionParamsSchema: Type.TObject<{
  pluginId: Type.TString;
  actionId: Type.TString;
  sessionKey: Type.TOptional<Type.TString>;
  payload: Type.TOptional<Type.TUnknown>;
}>;
/** Discriminated plugin action result returned to gateway clients. */
declare const PluginsSessionActionResultSchema: Type.TUnion<
  [
    Type.TObject<{
      ok: Type.TLiteral<true>;
      result: Type.TOptional<Type.TUnknown>;
      continueAgent: Type.TOptional<Type.TBoolean>;
      reply: Type.TOptional<Type.TUnknown>;
    }>,
    Type.TObject<{
      ok: Type.TLiteral<false>;
      error: Type.TString;
      code: Type.TOptional<Type.TString>;
      details: Type.TOptional<Type.TUnknown>;
    }>,
  ]
>;
declare const PluginCatalogInstallActionSchema: Type.TUnion<
  [
    Type.TObject<{
      source: Type.TLiteral<"clawhub">;
      packageName: Type.TString;
    }>,
    Type.TObject<{
      source: Type.TLiteral<"official">;
      pluginId: Type.TString;
    }>,
  ]
>;
/** Cold control-plane representation of an installed or available plugin. */
declare const PluginCatalogEntrySchema: Type.TObject<{
  id: Type.TString;
  name: Type.TString;
  packageName: Type.TOptional<Type.TString>;
  description: Type.TOptional<Type.TString>;
  version: Type.TOptional<Type.TString>;
  kind: Type.TOptional<Type.TArray<Type.TString>>;
  origin: Type.TOptional<Type.TString>;
  installed: Type.TBoolean;
  enabled: Type.TBoolean;
  state: Type.TUnion<
    [
      Type.TLiteral<"enabled">,
      Type.TLiteral<"disabled">,
      Type.TLiteral<"not-installed">,
      Type.TLiteral<"error">,
    ]
  >;
  featured: Type.TOptional<Type.TBoolean>;
  order: Type.TOptional<Type.TNumber>;
  install: Type.TOptional<
    Type.TUnion<
      [
        Type.TObject<{
          source: Type.TLiteral<"clawhub">;
          packageName: Type.TString;
        }>,
        Type.TObject<{
          source: Type.TLiteral<"official">;
          pluginId: Type.TString;
        }>,
      ]
    >
  >;
  error: Type.TOptional<Type.TString> /** Coarse manifest-derived grouping (channel, provider, memory, ...) for catalog UIs. */;
  category: Type.TOptional<Type.TString> /** True when the plugin has an install record and can be removed via plugins.uninstall. */;
  removable: Type.TOptional<Type.TBoolean>;
}>;
/** Empty request payload for the cold plugin catalog. */
declare const PluginsListParamsSchema: Type.TObject<{}>;
/** Installed and curated plugin catalog visible to the current gateway client. */
declare const PluginsListResultSchema: Type.TObject<{
  plugins: Type.TArray<
    Type.TObject<{
      id: Type.TString;
      name: Type.TString;
      packageName: Type.TOptional<Type.TString>;
      description: Type.TOptional<Type.TString>;
      version: Type.TOptional<Type.TString>;
      kind: Type.TOptional<Type.TArray<Type.TString>>;
      origin: Type.TOptional<Type.TString>;
      installed: Type.TBoolean;
      enabled: Type.TBoolean;
      state: Type.TUnion<
        [
          Type.TLiteral<"enabled">,
          Type.TLiteral<"disabled">,
          Type.TLiteral<"not-installed">,
          Type.TLiteral<"error">,
        ]
      >;
      featured: Type.TOptional<Type.TBoolean>;
      order: Type.TOptional<Type.TNumber>;
      install: Type.TOptional<
        Type.TUnion<
          [
            Type.TObject<{
              source: Type.TLiteral<"clawhub">;
              packageName: Type.TString;
            }>,
            Type.TObject<{
              source: Type.TLiteral<"official">;
              pluginId: Type.TString;
            }>,
          ]
        >
      >;
      error: Type.TOptional<Type.TString> /** Coarse manifest-derived grouping (channel, provider, memory, ...) for catalog UIs. */;
      category: Type.TOptional<Type.TString> /** True when the plugin has an install record and can be removed via plugins.uninstall. */;
      removable: Type.TOptional<Type.TBoolean>;
    }>
  >;
  diagnostics: Type.TArray<Type.TUnknown>;
  mutationAllowed: Type.TBoolean;
}>;
/** Request payload for searching installable ClawHub plugin families. */
declare const PluginsSearchParamsSchema: Type.TObject<{
  query: Type.TString;
  limit: Type.TOptional<Type.TInteger>;
}>;
/** ClawHub package fields exposed by plugin search. */
declare const PluginSearchPackageSchema: Type.TObject<{
  name: Type.TString;
  displayName: Type.TString;
  family: Type.TUnion<[Type.TLiteral<"code-plugin">, Type.TLiteral<"bundle-plugin">]>;
  channel: Type.TUnion<
    [Type.TLiteral<"official">, Type.TLiteral<"community">, Type.TLiteral<"private">]
  >;
  isOfficial: Type.TBoolean;
  summary: Type.TOptional<Type.TString>;
  latestVersion: Type.TOptional<Type.TString>;
  runtimeId: Type.TOptional<Type.TString>;
  downloads: Type.TOptional<Type.TNumber>;
  verificationTier: Type.TOptional<Type.TString>;
}>;
/** Ranked ClawHub plugin search hit. */
declare const PluginSearchResultEntrySchema: Type.TObject<{
  score: Type.TNumber;
  package: Type.TObject<{
    name: Type.TString;
    displayName: Type.TString;
    family: Type.TUnion<[Type.TLiteral<"code-plugin">, Type.TLiteral<"bundle-plugin">]>;
    channel: Type.TUnion<
      [Type.TLiteral<"official">, Type.TLiteral<"community">, Type.TLiteral<"private">]
    >;
    isOfficial: Type.TBoolean;
    summary: Type.TOptional<Type.TString>;
    latestVersion: Type.TOptional<Type.TString>;
    runtimeId: Type.TOptional<Type.TString>;
    downloads: Type.TOptional<Type.TNumber>;
    verificationTier: Type.TOptional<Type.TString>;
  }>;
}>;
/** Ranked installable plugin packages matching the query. */
declare const PluginsSearchResultSchema: Type.TObject<{
  results: Type.TArray<
    Type.TObject<{
      score: Type.TNumber;
      package: Type.TObject<{
        name: Type.TString;
        displayName: Type.TString;
        family: Type.TUnion<[Type.TLiteral<"code-plugin">, Type.TLiteral<"bundle-plugin">]>;
        channel: Type.TUnion<
          [Type.TLiteral<"official">, Type.TLiteral<"community">, Type.TLiteral<"private">]
        >;
        isOfficial: Type.TBoolean;
        summary: Type.TOptional<Type.TString>;
        latestVersion: Type.TOptional<Type.TString>;
        runtimeId: Type.TOptional<Type.TString>;
        downloads: Type.TOptional<Type.TNumber>;
        verificationTier: Type.TOptional<Type.TString>;
      }>;
    }>
  >;
}>;
/** Trusted official-catalog or acknowledged ClawHub install request. */
declare const PluginsInstallParamsSchema: Type.TUnion<
  [
    Type.TObject<{
      source: Type.TLiteral<"clawhub">;
      packageName: Type.TString;
      version: Type.TOptional<Type.TString>;
      acknowledgeClawHubRisk: Type.TOptional<Type.TBoolean>;
    }>,
    Type.TObject<{
      source: Type.TLiteral<"official">;
      pluginId: Type.TString;
    }>,
  ]
>;
/** Successful plugin installation result. */
declare const PluginsInstallResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  plugin: Type.TObject<{
    id: Type.TString;
    name: Type.TString;
    packageName: Type.TOptional<Type.TString>;
    description: Type.TOptional<Type.TString>;
    version: Type.TOptional<Type.TString>;
    kind: Type.TOptional<Type.TArray<Type.TString>>;
    origin: Type.TOptional<Type.TString>;
    installed: Type.TBoolean;
    enabled: Type.TBoolean;
    state: Type.TUnion<
      [
        Type.TLiteral<"enabled">,
        Type.TLiteral<"disabled">,
        Type.TLiteral<"not-installed">,
        Type.TLiteral<"error">,
      ]
    >;
    featured: Type.TOptional<Type.TBoolean>;
    order: Type.TOptional<Type.TNumber>;
    install: Type.TOptional<
      Type.TUnion<
        [
          Type.TObject<{
            source: Type.TLiteral<"clawhub">;
            packageName: Type.TString;
          }>,
          Type.TObject<{
            source: Type.TLiteral<"official">;
            pluginId: Type.TString;
          }>,
        ]
      >
    >;
    error: Type.TOptional<Type.TString> /** Coarse manifest-derived grouping (channel, provider, memory, ...) for catalog UIs. */;
    category: Type.TOptional<Type.TString> /** True when the plugin has an install record and can be removed via plugins.uninstall. */;
    removable: Type.TOptional<Type.TBoolean>;
  }>;
  restartRequired: Type.TLiteral<true>;
  warnings: Type.TOptional<Type.TArray<Type.TString>>;
}>;
/** Request payload for removing one installed plugin and its managed files. */
declare const PluginsUninstallParamsSchema: Type.TObject<{
  pluginId: Type.TString;
}>;
/** Successful plugin removal result listing the cleanup actions that ran. */
declare const PluginsUninstallResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  pluginId: Type.TString;
  restartRequired: Type.TLiteral<true>;
  removed: Type.TArray<Type.TString>;
  warnings: Type.TOptional<Type.TArray<Type.TString>>;
}>;
/** Request payload for changing one installed plugin's policy state. */
declare const PluginsSetEnabledParamsSchema: Type.TObject<{
  pluginId: Type.TString;
  enabled: Type.TBoolean;
}>;
/** Successful plugin enablement policy update. */
declare const PluginsSetEnabledResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  plugin: Type.TObject<{
    id: Type.TString;
    name: Type.TString;
    packageName: Type.TOptional<Type.TString>;
    description: Type.TOptional<Type.TString>;
    version: Type.TOptional<Type.TString>;
    kind: Type.TOptional<Type.TArray<Type.TString>>;
    origin: Type.TOptional<Type.TString>;
    installed: Type.TBoolean;
    enabled: Type.TBoolean;
    state: Type.TUnion<
      [
        Type.TLiteral<"enabled">,
        Type.TLiteral<"disabled">,
        Type.TLiteral<"not-installed">,
        Type.TLiteral<"error">,
      ]
    >;
    featured: Type.TOptional<Type.TBoolean>;
    order: Type.TOptional<Type.TNumber>;
    install: Type.TOptional<
      Type.TUnion<
        [
          Type.TObject<{
            source: Type.TLiteral<"clawhub">;
            packageName: Type.TString;
          }>,
          Type.TObject<{
            source: Type.TLiteral<"official">;
            pluginId: Type.TString;
          }>,
        ]
      >
    >;
    error: Type.TOptional<Type.TString> /** Coarse manifest-derived grouping (channel, provider, memory, ...) for catalog UIs. */;
    category: Type.TOptional<Type.TString> /** True when the plugin has an install record and can be removed via plugins.uninstall. */;
    removable: Type.TOptional<Type.TBoolean>;
  }>;
  restartRequired: Type.TBoolean;
  warnings: Type.TOptional<Type.TArray<Type.TString>>;
}>;
type PluginCatalogEntry = Static<typeof PluginCatalogEntrySchema>;
type PluginsListParams = Static<typeof PluginsListParamsSchema>;
type PluginsListResult = Static<typeof PluginsListResultSchema>;
type PluginsSearchParams = Static<typeof PluginsSearchParamsSchema>;
type PluginsSearchResult = Static<typeof PluginsSearchResultSchema>;
type PluginsInstallParams = Static<typeof PluginsInstallParamsSchema>;
type PluginsInstallResult = Static<typeof PluginsInstallResultSchema>;
type PluginsUninstallParams = Static<typeof PluginsUninstallParamsSchema>;
type PluginsUninstallResult = Static<typeof PluginsUninstallResultSchema>;
type PluginsSetEnabledParams = Static<typeof PluginsSetEnabledParamsSchema>;
type PluginsSetEnabledResult = Static<typeof PluginsSetEnabledResultSchema>;
type PluginsSessionActionParams = Static<typeof PluginsSessionActionParamsSchema>;
type PluginsSessionActionResult = Static<typeof PluginsSessionActionResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/wizard.d.ts
/** Starts a setup wizard, optionally scoped to a local or remote workspace. */
declare const WizardStartParamsSchema: Type.TObject<{
  mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"local">, Type.TLiteral<"remote">]>>;
  workspace: Type.TOptional<Type.TString>;
  flow: Type.TOptional<Type.TUnion<[Type.TLiteral<"setup">, Type.TLiteral<"channels">]>>;
  channel: Type.TOptional<Type.TString>;
}>;
/** Advances a wizard session, with an answer when the previous step requested input. */
declare const WizardNextParamsSchema: Type.TObject<{
  sessionId: Type.TString;
  answer: Type.TOptional<
    Type.TObject<{
      stepId: Type.TString;
      value: Type.TOptional<Type.TUnknown>;
    }>
  >;
}>;
/** Cancels an active wizard session. */
declare const WizardCancelParamsSchema: Type.TObject<{
  sessionId: Type.TString;
}>;
/** Reads status for an active or recently completed wizard session. */
declare const WizardStatusParamsSchema: Type.TObject<{
  sessionId: Type.TString;
}>;
/** UI contract for one wizard step rendered by gateway clients. */
declare const WizardStepSchema: Type.TObject<{
  id: Type.TString;
  type: Type.TUnion<
    [
      Type.TLiteral<"note">,
      Type.TLiteral<"select">,
      Type.TLiteral<"text">,
      Type.TLiteral<"confirm">,
      Type.TLiteral<"multiselect">,
      Type.TLiteral<"progress">,
      Type.TLiteral<"action">,
    ]
  >;
  title: Type.TOptional<Type.TString>;
  message: Type.TOptional<Type.TString>;
  format: Type.TOptional<Type.TUnion<[Type.TLiteral<"plain">]>>;
  options: Type.TOptional<
    Type.TArray<
      Type.TObject<{
        value: Type.TUnknown;
        label: Type.TString;
        hint: Type.TOptional<Type.TString>;
      }>
    >
  >;
  initialValue: Type.TOptional<Type.TUnknown>;
  placeholder: Type.TOptional<Type.TString>;
  sensitive: Type.TOptional<Type.TBoolean>;
  executor: Type.TOptional<Type.TUnion<[Type.TLiteral<"gateway">, Type.TLiteral<"client">]>>;
  externalUrl: Type.TOptional<Type.TString>;
  deviceCode: Type.TOptional<
    Type.TObject<{
      code: Type.TString;
      expiresInMinutes: Type.TOptional<Type.TInteger>;
      message: Type.TOptional<Type.TString>;
    }>
  >;
}>;
/** Result after advancing a wizard session. */
declare const WizardNextResultSchema: Type.TObject<{
  done: Type.TBoolean;
  step: Type.TOptional<
    Type.TObject<{
      id: Type.TString;
      type: Type.TUnion<
        [
          Type.TLiteral<"note">,
          Type.TLiteral<"select">,
          Type.TLiteral<"text">,
          Type.TLiteral<"confirm">,
          Type.TLiteral<"multiselect">,
          Type.TLiteral<"progress">,
          Type.TLiteral<"action">,
        ]
      >;
      title: Type.TOptional<Type.TString>;
      message: Type.TOptional<Type.TString>;
      format: Type.TOptional<Type.TUnion<[Type.TLiteral<"plain">]>>;
      options: Type.TOptional<
        Type.TArray<
          Type.TObject<{
            value: Type.TUnknown;
            label: Type.TString;
            hint: Type.TOptional<Type.TString>;
          }>
        >
      >;
      initialValue: Type.TOptional<Type.TUnknown>;
      placeholder: Type.TOptional<Type.TString>;
      sensitive: Type.TOptional<Type.TBoolean>;
      executor: Type.TOptional<Type.TUnion<[Type.TLiteral<"gateway">, Type.TLiteral<"client">]>>;
      externalUrl: Type.TOptional<Type.TString>;
      deviceCode: Type.TOptional<
        Type.TObject<{
          code: Type.TString;
          expiresInMinutes: Type.TOptional<Type.TInteger>;
          message: Type.TOptional<Type.TString>;
        }>
      >;
    }>
  >;
  status: Type.TOptional<
    Type.TUnion<
      [
        Type.TLiteral<"running">,
        Type.TLiteral<"done">,
        Type.TLiteral<"cancelled">,
        Type.TLiteral<"error">,
      ]
    >
  >;
  error: Type.TOptional<Type.TString>;
  channels: Type.TOptional<Type.TArray<Type.TString>>;
  accounts: Type.TOptional<
    Type.TArray<
      Type.TObject<{
        channel: Type.TString;
        accountId: Type.TString;
      }>
    >
  >;
}>;
/** Result returned when a wizard session is created. */
declare const WizardStartResultSchema: Type.TObject<{
  done: Type.TBoolean;
  step: Type.TOptional<
    Type.TObject<{
      id: Type.TString;
      type: Type.TUnion<
        [
          Type.TLiteral<"note">,
          Type.TLiteral<"select">,
          Type.TLiteral<"text">,
          Type.TLiteral<"confirm">,
          Type.TLiteral<"multiselect">,
          Type.TLiteral<"progress">,
          Type.TLiteral<"action">,
        ]
      >;
      title: Type.TOptional<Type.TString>;
      message: Type.TOptional<Type.TString>;
      format: Type.TOptional<Type.TUnion<[Type.TLiteral<"plain">]>>;
      options: Type.TOptional<
        Type.TArray<
          Type.TObject<{
            value: Type.TUnknown;
            label: Type.TString;
            hint: Type.TOptional<Type.TString>;
          }>
        >
      >;
      initialValue: Type.TOptional<Type.TUnknown>;
      placeholder: Type.TOptional<Type.TString>;
      sensitive: Type.TOptional<Type.TBoolean>;
      executor: Type.TOptional<Type.TUnion<[Type.TLiteral<"gateway">, Type.TLiteral<"client">]>>;
      externalUrl: Type.TOptional<Type.TString>;
      deviceCode: Type.TOptional<
        Type.TObject<{
          code: Type.TString;
          expiresInMinutes: Type.TOptional<Type.TInteger>;
          message: Type.TOptional<Type.TString>;
        }>
      >;
    }>
  >;
  status: Type.TOptional<
    Type.TUnion<
      [
        Type.TLiteral<"running">,
        Type.TLiteral<"done">,
        Type.TLiteral<"cancelled">,
        Type.TLiteral<"error">,
      ]
    >
  >;
  error: Type.TOptional<Type.TString>;
  channels: Type.TOptional<Type.TArray<Type.TString>>;
  accounts: Type.TOptional<
    Type.TArray<
      Type.TObject<{
        channel: Type.TString;
        accountId: Type.TString;
      }>
    >
  >;
  sessionId: Type.TString;
}>;
/** Minimal status poll result used when the client does not need the next step. */
declare const WizardStatusResultSchema: Type.TObject<{
  status: Type.TUnion<
    [
      Type.TLiteral<"running">,
      Type.TLiteral<"done">,
      Type.TLiteral<"cancelled">,
      Type.TLiteral<"error">,
    ]
  >;
  error: Type.TOptional<Type.TString>;
}>;
type WizardStartParams = Static<typeof WizardStartParamsSchema>;
type WizardNextParams = Static<typeof WizardNextParamsSchema>;
type WizardCancelParams = Static<typeof WizardCancelParamsSchema>;
type WizardStatusParams = Static<typeof WizardStatusParamsSchema>;
type WizardStep = Static<typeof WizardStepSchema>;
type WizardNextResult = Static<typeof WizardNextResultSchema>;
type WizardStartResult = Static<typeof WizardStartResultSchema>;
type WizardStatusResult = Static<typeof WizardStatusResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/worktrees.d.ts
declare const WorktreeRecordSchema: Type.TObject<{
  id: Type.TString;
  name: Type.TString;
  repoFingerprint: Type.TString;
  repoRoot: Type.TString;
  path: Type.TString;
  branch: Type.TString;
  baseRef: Type.TString;
  ownerKind: Type.TString;
  ownerId: Type.TOptional<Type.TString>;
  snapshotRef: Type.TOptional<Type.TString>;
  createdAt: Type.TInteger;
  lastActiveAt: Type.TInteger;
  removedAt: Type.TOptional<Type.TInteger>;
}>;
declare const WorktreesListParamsSchema: Type.TObject<{}>;
declare const WorktreesListResultSchema: Type.TObject<{
  worktrees: Type.TArray<
    Type.TObject<{
      id: Type.TString;
      name: Type.TString;
      repoFingerprint: Type.TString;
      repoRoot: Type.TString;
      path: Type.TString;
      branch: Type.TString;
      baseRef: Type.TString;
      ownerKind: Type.TString;
      ownerId: Type.TOptional<Type.TString>;
      snapshotRef: Type.TOptional<Type.TString>;
      createdAt: Type.TInteger;
      lastActiveAt: Type.TInteger;
      removedAt: Type.TOptional<Type.TInteger>;
    }>
  >;
}>;
declare const WorktreesCreateParamsSchema: Type.TObject<{
  repoRoot: Type.TString;
  name: Type.TOptional<Type.TString>;
  baseRef: Type.TOptional<Type.TString>;
}>;
declare const WorktreesRemoveParamsSchema: Type.TObject<{
  id: Type.TString;
  force: Type.TOptional<Type.TBoolean>;
}>;
declare const WorktreesRemoveResultSchema: Type.TObject<{
  removed: Type.TBoolean;
  snapshotRef: Type.TOptional<Type.TString> /** Why the pre-removal snapshot failed; present only on forced removals that continued without one. */;
  snapshotError: Type.TOptional<Type.TString>;
}>;
declare const WorktreesBranchesParamsSchema: Type.TObject<{
  repoRoot: Type.TString;
}>;
declare const WorktreeBranchSchema: Type.TObject<{
  name: Type.TString;
  kind: Type.TUnion<[Type.TLiteral<"local">, Type.TLiteral<"remote">]>;
}>;
declare const WorktreesBranchesResultSchema: Type.TObject<{
  branches: Type.TArray<
    Type.TObject<{
      name: Type.TString;
      kind: Type.TUnion<[Type.TLiteral<"local">, Type.TLiteral<"remote">]>;
    }>
  >;
  defaultBranch: Type.TOptional<Type.TString>;
  headBranch: Type.TOptional<Type.TString>;
}>;
declare const WorktreesRestoreParamsSchema: Type.TObject<{
  id: Type.TString;
}>;
declare const WorktreesGcParamsSchema: Type.TObject<{}>;
declare const WorktreesGcResultSchema: Type.TObject<{
  removed: Type.TArray<Type.TString>;
  orphansDeleted: Type.TInteger;
  snapshotsPruned: Type.TInteger;
}>;
type WorktreeRecord = Static<typeof WorktreeRecordSchema>;
type WorktreesListParams = Static<typeof WorktreesListParamsSchema>;
type WorktreesListResult = Static<typeof WorktreesListResultSchema>;
type WorktreesCreateParams = Static<typeof WorktreesCreateParamsSchema>;
type WorktreesRemoveParams = Static<typeof WorktreesRemoveParamsSchema>;
type WorktreesRemoveResult = Static<typeof WorktreesRemoveResultSchema>;
type WorktreesRestoreParams = Static<typeof WorktreesRestoreParamsSchema>;
type WorktreesGcParams = Static<typeof WorktreesGcParamsSchema>;
type WorktreesGcResult = Static<typeof WorktreesGcResultSchema>;
type WorktreeBranch = Static<typeof WorktreeBranchSchema>;
type WorktreesBranchesParams = Static<typeof WorktreesBranchesParamsSchema>;
type WorktreesBranchesResult = Static<typeof WorktreesBranchesResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/index.d.ts
declare const validateCommandsListParams: ProtocolValidator<{
  agentId?: string | undefined;
  provider?: string | undefined;
  scope?: "text" | "native" | "both" | undefined;
  includeArgs?: boolean | undefined;
}>;
declare const validateConnectParams: ProtocolValidator<{
  caps?: string[] | undefined;
  commands?: string[] | undefined;
  permissions?: Record<string, boolean> | undefined;
  pathEnv?: string | undefined;
  role?: string | undefined;
  scopes?: string[] | undefined;
  device?:
    | {
        id: string;
        publicKey: string;
        signature: string;
        signedAt: number;
        nonce: string;
      }
    | undefined;
  auth?:
    | {
        token?: string | undefined;
        bootstrapToken?: string | undefined;
        deviceToken?: string | undefined;
        password?: string | undefined;
        approvalRuntimeToken?: string | undefined;
        agentRuntimeIdentityToken?: string | undefined;
      }
    | undefined;
  locale?: string | undefined;
  userAgent?: string | undefined;
  minProtocol: number;
  maxProtocol: number;
  client: {
    displayName?: string | undefined;
    deviceFamily?: string | undefined;
    modelIdentifier?: string | undefined;
    instanceId?: string | undefined;
    id:
      | "webchat-ui"
      | "openclaw-control-ui"
      | "openclaw-tui"
      | "webchat"
      | "cli"
      | "gateway-client"
      | "openclaw-macos"
      | "openclaw-ios"
      | "openclaw-watchos"
      | "openclaw-android"
      | "node-host"
      | "openclaw-worker"
      | "test"
      | "fingerprint"
      | "openclaw-probe";
    version: string;
    platform: string;
    mode: "webchat" | "cli" | "test" | "ui" | "backend" | "node" | "worker" | "probe";
  };
}>;
declare const validateWorkerAdmissionHandshake: ProtocolValidator<{
  bundleHash: string;
  openclawVersion: string;
  protocolFeatures: string[];
}>;
declare const validateWorkerConnectRequestFrame: ProtocolValidator<{
  type: "req";
  id: string;
  method: "connect";
  params: {
    minProtocol: number;
    maxProtocol: number;
    client: {
      id: "openclaw-worker";
      version: string;
      platform: string;
      mode: "worker";
    };
    role: "worker";
    admission:
      | {
          sessionId: null;
          runId: null;
          environmentId: string;
          credential: string;
          ownerEpoch: number;
          rpcSetVersion: number;
          handshake: {
            bundleHash: string;
            openclawVersion: string;
            protocolFeatures: string[];
          };
        }
      | {
          sessionId: string;
          runId: string;
          environmentId: string;
          credential: string;
          ownerEpoch: number;
          rpcSetVersion: number;
          handshake: {
            bundleHash: string;
            openclawVersion: string;
            protocolFeatures: string[];
          };
        };
  };
}>;
declare const validateWorkerHeartbeatParams: ProtocolValidator<{
  sentAtMs: number;
  status: "ready" | "busy" | "draining";
}>;
declare const validateWorkerTranscriptCommitParams: ProtocolValidator<{
  runEpoch: number;
  seq: number;
  baseLeafId: string | null;
  messages: (
    | {
        role: "user";
        content: (
          | {
              textSignature?: string | undefined;
              type: "text";
              text: string;
            }
          | {
              type: "image";
              data: string;
              mimeType: string;
            }
        )[];
        timestamp: number;
      }
    | {
        responseModel?: string | undefined;
        responseId?: string | undefined;
        diagnostics?:
          | {
              error?:
                | {
                    name?: string | undefined;
                    stack?: string | undefined;
                    code?: string | number | undefined;
                    message: string;
                  }
                | undefined;
              details?: Record<string, unknown> | undefined;
              type: string;
              timestamp: number;
            }[]
          | undefined;
        errorMessage?: string | undefined;
        errorCode?: string | undefined;
        errorType?: string | undefined;
        errorBody?: string | undefined;
        provider: string;
        role: "assistant";
        content: (
          | {
              textSignature?: string | undefined;
              type: "text";
              text: string;
            }
          | {
              thinkingSignature?: string | undefined;
              redacted?: boolean | undefined;
              type: "thinking";
              thinking: string;
            }
          | {
              thoughtSignature?: string | undefined;
              executionMode?: "sequential" | "parallel" | undefined;
              type: "toolCall";
              id: string;
              name: string;
              arguments: Record<string, unknown>;
            }
        )[];
        timestamp: number;
        api: string;
        model: string;
        usage: {
          contextUsage?:
            | {
                state: "available";
                promptTokens: number;
                totalTokens: number;
              }
            | {
                state: "unavailable";
              }
            | undefined;
          input: number;
          output: number;
          cacheRead: number;
          cacheWrite: number;
          totalTokens: number;
          cost: {
            totalOrigin?: "provider-billed" | undefined;
            input: number;
            output: number;
            cacheRead: number;
            cacheWrite: number;
            total: number;
          };
        };
        stopReason: "error" | "stop" | "length" | "toolUse" | "aborted";
      }
    | {
        details?: unknown;
        role: "toolResult";
        content: (
          | {
              textSignature?: string | undefined;
              type: "text";
              text: string;
            }
          | {
              type: "image";
              data: string;
              mimeType: string;
            }
        )[];
        timestamp: number;
        toolCallId: string;
        toolName: string;
        isError: boolean;
      }
  )[];
}>;
declare const validateWorkerLiveEventParams: ProtocolValidator<{
  readonly runId: string;
  readonly runEpoch: number;
  readonly seq: number;
  readonly lastAckedSeq: number;
  readonly event:
    | {
        readonly kind: "assistant";
        readonly payload: {
          readonly replace?: true | undefined;
          readonly mediaUrls?: string[] | undefined;
          readonly phase?: "commentary" | "final_answer" | undefined;
          readonly itemId?: string | undefined;
          readonly text: string;
          readonly delta: string;
        };
      }
    | {
        readonly kind: "thinking";
        readonly payload: {
          readonly text: string;
          readonly delta: string;
        };
      }
    | {
        readonly kind: "tool";
        readonly payload:
          | {
              readonly hideFromChannelProgress?: true | undefined;
              readonly name: string;
              readonly toolCallId: string;
              readonly phase: "start";
              readonly args: unknown;
            }
          | {
              readonly hideFromChannelProgress?: true | undefined;
              readonly name: string;
              readonly toolCallId: string;
              readonly phase: "update";
              readonly partialResult: unknown;
            }
          | {
              readonly hideFromChannelProgress?: true | undefined;
              readonly meta?: string | undefined;
              readonly toolErrorSummary?: string | undefined;
              readonly name: string;
              readonly toolCallId: string;
              readonly isError: boolean;
              readonly phase: "result";
              readonly result: unknown;
            };
      }
    | {
        readonly kind: "approval";
        readonly payload:
          | {
              readonly scope?: "turn" | "session" | undefined;
              readonly message?: string | undefined;
              readonly toolCallId?: string | undefined;
              readonly itemId?: string | undefined;
              readonly approvalId?: string | undefined;
              readonly approvalSlug?: string | undefined;
              readonly command?: string | undefined;
              readonly host?: string | undefined;
              readonly reason?: string | undefined;
              readonly status: "unavailable" | "pending";
              readonly kind: "exec" | "plugin" | "unknown";
              readonly phase: "requested";
              readonly title: string;
            }
          | {
              readonly scope?: "turn" | "session" | undefined;
              readonly message?: string | undefined;
              readonly toolCallId?: string | undefined;
              readonly itemId?: string | undefined;
              readonly approvalId?: string | undefined;
              readonly approvalSlug?: string | undefined;
              readonly command?: string | undefined;
              readonly host?: string | undefined;
              readonly reason?: string | undefined;
              readonly status: "approved" | "denied" | "failed";
              readonly kind: "exec" | "plugin" | "unknown";
              readonly phase: "resolved";
              readonly title: string;
            };
      }
    | {
        readonly kind: "lifecycle";
        readonly payload:
          | {
              readonly phase: "start";
              readonly startedAt: number;
            }
          | {
              readonly phase: "fallback";
              readonly attemptSummaries: string[];
              readonly attempts: {
                readonly status?: number | undefined;
                readonly code?: string | undefined;
                readonly reason?:
                  | "auth"
                  | "unknown"
                  | "auth_permanent"
                  | "format"
                  | "rate_limit"
                  | "overloaded"
                  | "billing"
                  | "server_error"
                  | "timeout"
                  | "context_overflow"
                  | "model_not_found"
                  | "session_expired"
                  | "empty_response"
                  | "no_error_details"
                  | "unclassified"
                  | undefined;
                readonly authMode?: string | undefined;
                readonly provider: string;
                readonly model: string;
                readonly error: string;
              }[];
              readonly reasonSummary: string;
              readonly selectedProvider: string;
              readonly selectedModel: string;
              readonly activeProvider: string;
              readonly activeModel: string;
            }
          | {
              readonly previousActiveModel?: string | undefined;
              readonly phase: "fallback_cleared";
              readonly selectedProvider: string;
              readonly selectedModel: string;
              readonly activeProvider: string;
              readonly activeModel: string;
            }
          | {
              readonly fallbackStepToModel?: string | undefined;
              readonly fallbackStepFromFailureReason?:
                | "auth"
                | "unknown"
                | "auth_permanent"
                | "format"
                | "rate_limit"
                | "overloaded"
                | "billing"
                | "server_error"
                | "timeout"
                | "context_overflow"
                | "model_not_found"
                | "session_expired"
                | "empty_response"
                | "no_error_details"
                | "unclassified"
                | undefined;
              readonly fallbackStepFromFailureDetail?: string | undefined;
              readonly fallbackStepChainPosition?: number | undefined;
              readonly phase: "fallback_step";
              readonly fallbackStepType: "fallback_step";
              readonly fallbackStepFinalOutcome: "next_fallback" | "succeeded" | "chain_exhausted";
              readonly fallbackStepFromModel: string;
            }
          | {
              readonly error?: string | undefined;
              readonly stopReason?: string | undefined;
              readonly aborted?: boolean | undefined;
              readonly toolErrorSummary?: string | undefined;
              readonly startedAt?: number | undefined;
              readonly yielded?: true | undefined;
              readonly timeoutPhase?:
                | "provider"
                | "queue"
                | "preflight"
                | "post_turn"
                | "gateway_draining"
                | undefined;
              readonly providerStarted?: boolean | undefined;
              readonly livenessState?: "working" | "paused" | "blocked" | "abandoned" | undefined;
              readonly replayInvalid?: true | undefined;
              readonly phase: "finishing";
              readonly endedAt: number;
            }
          | {
              readonly stopReason?: string | undefined;
              readonly aborted?: boolean | undefined;
              readonly toolErrorSummary?: string | undefined;
              readonly startedAt?: number | undefined;
              readonly yielded?: true | undefined;
              readonly timeoutPhase?:
                | "provider"
                | "queue"
                | "preflight"
                | "post_turn"
                | "gateway_draining"
                | undefined;
              readonly providerStarted?: boolean | undefined;
              readonly livenessState?: "working" | "paused" | "blocked" | "abandoned" | undefined;
              readonly replayInvalid?: true | undefined;
              readonly phase: "end";
              readonly endedAt: number;
            }
          | {
              readonly stopReason?: string | undefined;
              readonly aborted?: boolean | undefined;
              readonly toolErrorSummary?: string | undefined;
              readonly startedAt?: number | undefined;
              readonly yielded?: true | undefined;
              readonly timeoutPhase?:
                | "provider"
                | "queue"
                | "preflight"
                | "post_turn"
                | "gateway_draining"
                | undefined;
              readonly providerStarted?: boolean | undefined;
              readonly livenessState?: "working" | "paused" | "blocked" | "abandoned" | undefined;
              readonly replayInvalid?: true | undefined;
              readonly fallbackExhaustedFailure?: true | undefined;
              readonly error: string;
              readonly phase: "error";
              readonly endedAt: number;
            };
      };
}>;
declare const validateGatewaySuspendPrepareParams: ProtocolValidator<{
  requestId: string;
}>;
declare const validateGatewaySuspendPrepareResult: ProtocolValidator<
  | {
      status: "busy";
      reason: "active-work" | "gateway-draining";
      retryAfterMs: number;
      activeCount: number;
      blockers: {
        task?:
          | {
              runId?: string | undefined;
              title?: string | undefined;
              label?: string | undefined;
              status: "running";
              taskId: string;
              runtime: "cli" | "subagent" | "acp" | "cron";
            }
          | undefined;
        message: string;
        kind:
          | "queue"
          | "reply"
          | "embedded-run"
          | "background-exec"
          | "cron-run"
          | "task"
          | "root-request"
          | "session-admission"
          | "session-mutation"
          | "chat-run"
          | "queued-turn"
          | "terminal-persistence"
          | "terminal-session";
        count: number;
      }[];
    }
  | {
      status: "ready";
      activeCount: number;
      blockers: {
        task?:
          | {
              runId?: string | undefined;
              title?: string | undefined;
              label?: string | undefined;
              status: "running";
              taskId: string;
              runtime: "cli" | "subagent" | "acp" | "cron";
            }
          | undefined;
        message: string;
        kind:
          | "queue"
          | "reply"
          | "embedded-run"
          | "background-exec"
          | "cron-run"
          | "task"
          | "root-request"
          | "session-admission"
          | "session-mutation"
          | "chat-run"
          | "queued-turn"
          | "terminal-persistence"
          | "terminal-session";
        count: number;
      }[];
      suspensionId: string;
      expiresAtMs: number;
    }
>;
declare const validateGatewaySuspendStatusParams: ProtocolValidator<{
  suspensionId: string;
}>;
declare const validateGatewaySuspendStatusResult: ProtocolValidator<
  | {
      status: "running";
    }
  | {
      status: "ready";
      expiresAtMs: number;
    }
>;
declare const validateGatewaySuspendResumeParams: ProtocolValidator<{
  suspensionId: string;
}>;
declare const validateGatewaySuspendResumeResult: ProtocolValidator<{
  status: "running";
  ok: true;
  resumed: boolean;
}>;
declare const validateRequestFrame: ProtocolValidator<{
  params?: unknown;
  type: "req";
  id: string;
  method: string;
}>;
declare const validateResponseFrame: ProtocolValidator<{
  error?:
    | {
        details?: unknown;
        retryAfterMs?: number | undefined;
        retryable?: boolean | undefined;
        message: string;
        code: string;
      }
    | undefined;
  payload?: unknown;
  type: "res";
  id: string;
  ok: boolean;
}>;
declare const validateEventFrame: ProtocolValidator<{
  seq?: number | undefined;
  payload?: unknown;
  stateVersion?:
    | {
        presence: number;
        health: number;
      }
    | undefined;
  type: "event";
  event: string;
}>;
declare const validateMessageActionParams: ProtocolValidator<{
  agentId?: string | undefined;
  sessionId?: string | undefined;
  accountId?: string | undefined;
  requesterAccountId?: string | undefined;
  requesterSenderId?: string | undefined;
  senderIsOwner?: boolean | undefined;
  sessionKey?: string | undefined;
  inboundTurnKind?: string | undefined;
  toolContext?:
    | {
        currentChannelId?: string | undefined;
        currentMessagingTarget?: string | undefined;
        currentGraphChannelId?: string | undefined;
        currentChannelProvider?: string | undefined;
        currentThreadTs?: string | undefined;
        currentMessageId?: string | number | undefined;
        replyToMode?: "off" | "first" | "all" | "batched" | undefined;
        hasRepliedRef?:
          | {
              value: boolean;
            }
          | undefined;
        sameChannelThreadRequired?: boolean | undefined;
        skipCrossContextDecoration?: boolean | undefined;
      }
    | undefined;
  conversationReadOrigin?: "direct-operator" | undefined;
  params: Record<string, unknown>;
  channel: string;
  action: string;
  idempotencyKey: string;
}>;
declare const validateSendParams: ProtocolValidator<{
  agentId?: string | undefined;
  message?: string | undefined;
  mediaUrls?: string[] | undefined;
  channel?: string | undefined;
  accountId?: string | undefined;
  sessionKey?: string | undefined;
  mediaUrl?: string | undefined;
  buffer?: string | undefined;
  filename?: string | undefined;
  contentType?: string | undefined;
  asVoice?: boolean | undefined;
  gifPlayback?: boolean | undefined;
  replyToId?: string | undefined;
  threadId?: string | undefined;
  forceDocument?: boolean | undefined;
  silent?: boolean | undefined;
  parseMode?: "HTML" | undefined;
  idempotencyKey: string;
  to: string;
}>;
declare const validatePollParams: ProtocolValidator<{
  channel?: string | undefined;
  accountId?: string | undefined;
  threadId?: string | undefined;
  silent?: boolean | undefined;
  maxSelections?: number | undefined;
  durationSeconds?: number | undefined;
  durationHours?: number | undefined;
  isAnonymous?: boolean | undefined;
  idempotencyKey: string;
  to: string;
  question: string;
  options: string[];
}>;
declare const validateAgentParams: ProtocolValidator<{
  agentId?: string | undefined;
  provider?: string | undefined;
  sessionId?: string | undefined;
  thinking?: string | undefined;
  model?: string | undefined;
  timeout?: number | undefined;
  label?: string | undefined;
  channel?: string | undefined;
  accountId?: string | undefined;
  sessionKey?: string | undefined;
  to?: string | undefined;
  threadId?: string | undefined;
  replyTo?: string | undefined;
  expectedExistingSessionId?: string | undefined;
  deliver?: boolean | undefined;
  attachments?: unknown[] | undefined;
  replyChannel?: string | undefined;
  replyAccountId?: string | undefined;
  groupId?: string | undefined;
  groupChannel?: string | undefined;
  groupSpace?: string | undefined;
  bestEffortDeliver?: boolean | undefined;
  lane?: string | undefined;
  cwd?: string | undefined;
  cleanupBundleMcpOnRunEnd?: boolean | undefined;
  modelRun?: boolean | undefined;
  promptMode?: "full" | "minimal" | "none" | undefined;
  extraSystemPrompt?: string | undefined;
  bootstrapContextMode?: "full" | "lightweight" | undefined;
  bootstrapContextRunKind?: "default" | "cron" | "heartbeat" | undefined;
  acpTurnSource?: "manual_spawn" | undefined;
  internalRuntimeHandoffId?: string | undefined;
  execApprovalFollowupExpectedSessionId?: string | undefined;
  internalEvents?:
    | {
        mediaUrls?: string[] | undefined;
        attachments?:
          | {
              type?: string | undefined;
              mimeType?: string | undefined;
              name?: string | undefined;
              mediaUrl?: string | undefined;
              path?: string | undefined;
              url?: string | undefined;
              filePath?: string | undefined;
            }[]
          | undefined;
        childSessionId?: string | undefined;
        statsLine?: string | undefined;
        type: "task_completion";
        status: string;
        result: string;
        source: string;
        childSessionKey: string;
        announceType: string;
        taskLabel: string;
        statusLabel: string;
        replyInstruction: string;
      }[]
    | undefined;
  inputProvenance?:
    | {
        originSessionId?: string | undefined;
        sourceSessionKey?: string | undefined;
        sourceChannel?: string | undefined;
        sourceTool?: string | undefined;
        kind: string;
      }
    | undefined;
  suppressPromptPersistence?: boolean | undefined;
  sessionEffects?: "visible" | "internal" | undefined;
  sourceReplyDeliveryMode?: "automatic" | "message_tool_only" | undefined;
  disableMessageTool?: boolean | undefined;
  forceRestartSafeTools?: boolean | undefined;
  voiceWakeTrigger?: string | undefined;
  message: string;
  idempotencyKey: string;
}>;
declare const validateAuditActivityListParams: ProtocolValidator<AuditActivityListParams>;
declare const validateAuditListParams: ProtocolValidator<{
  agentId?: string | undefined;
  runId?: string | undefined;
  status?:
    | "unknown"
    | "failed"
    | "succeeded"
    | "blocked"
    | "started"
    | "cancelled"
    | "timed_out"
    | undefined;
  kind?: "agent_run" | "tool_action" | undefined;
  sessionKey?: string | undefined;
  after?: number | undefined;
  before?: number | undefined;
  limit?: number | undefined;
  cursor?: string | undefined;
}>;
declare const validateAgentIdentityParams: ProtocolValidator<{
  agentId?: string | undefined;
  sessionKey?: string | undefined;
}>;
declare const validateAgentWaitParams: ProtocolValidator<{
  timeoutMs?: number | undefined;
  runId: string;
}>;
declare const validateWakeParams: ProtocolValidator<{
  agentId?: string | undefined;
  sessionKey?: string | undefined;
  text: string;
  mode: "now" | "next-heartbeat";
}>;
declare const validateAgentsListParams: ProtocolValidator<object>;
declare const validateWorktreesListParams: ProtocolValidator<object>;
declare const validateWorktreesCreateParams: ProtocolValidator<{
  name?: string | undefined;
  baseRef?: string | undefined;
  repoRoot: string;
}>;
declare const validateWorktreesRemoveParams: ProtocolValidator<{
  force?: boolean | undefined;
  id: string;
}>;
declare const validateWorktreesRestoreParams: ProtocolValidator<{
  id: string;
}>;
declare const validateWorktreesGcParams: ProtocolValidator<object>;
declare const validateWorktreesBranchesParams: ProtocolValidator<{
  repoRoot: string;
}>;
declare const validateFsListDirParams: ProtocolValidator<{
  path?: string | undefined;
  nodeId?: string | undefined;
}>;
declare const validateFsListDirResult: ProtocolValidator<{
  parent?: string | undefined;
  path: string;
  home: string;
  entries: {
    hidden?: boolean | undefined;
    name: string;
    path: string;
  }[];
}>;
declare const validateAgentsCreateParams: ProtocolValidator<{
  model?: string | undefined;
  emoji?: string | undefined;
  avatar?: string | undefined;
  name: string;
  workspace: string;
}>;
declare const validateAgentsUpdateParams: ProtocolValidator<{
  name?: string | undefined;
  model?: string | undefined;
  workspace?: string | undefined;
  emoji?: string | undefined;
  avatar?: string | undefined;
  agentId: string;
}>;
declare const validateAgentsDeleteParams: ProtocolValidator<{
  deleteFiles?: boolean | undefined;
  agentId: string;
}>;
declare const validateAgentsFilesListParams: ProtocolValidator<{
  agentId: string;
}>;
declare const validateAgentsFilesGetParams: ProtocolValidator<{
  agentId: string;
  name: string;
}>;
declare const validateAgentsFilesSetParams: ProtocolValidator<{
  agentId: string;
  content: string;
  name: string;
}>;
declare const validateAgentsWorkspaceListParams: ProtocolValidator<{
  path?: string | undefined;
  limit?: number | undefined;
  offset?: number | undefined;
  agentId: string;
}>;
declare const validateAgentsWorkspaceGetParams: ProtocolValidator<{
  agentId: string;
  path: string;
}>;
declare const validateArtifactsListParams: ProtocolValidator<{
  agentId?: string | undefined;
  runId?: string | undefined;
  taskId?: string | undefined;
  sessionKey?: string | undefined;
}>;
declare const validateArtifactsGetParams: ProtocolValidator<{
  agentId?: string | undefined;
  runId?: string | undefined;
  taskId?: string | undefined;
  sessionKey?: string | undefined;
  artifactId: string;
}>;
declare const validateArtifactsDownloadParams: ProtocolValidator<{
  agentId?: string | undefined;
  runId?: string | undefined;
  taskId?: string | undefined;
  sessionKey?: string | undefined;
  artifactId: string;
}>;
declare const validateNodePairListParams: ProtocolValidator<object>;
declare const validateNodePairApproveParams: ProtocolValidator<{
  requestId: string;
}>;
declare const validateNodePairRejectParams: ProtocolValidator<{
  requestId: string;
}>;
declare const validateNodePairRemoveParams: ProtocolValidator<{
  nodeId: string;
}>;
declare const validateNodeRenameParams: ProtocolValidator<{
  displayName: string;
  nodeId: string;
}>;
declare const validateNodeListParams: ProtocolValidator<object>;
declare const validateNodePluginToolsUpdateParams: ProtocolValidator<{
  tools: {
    command?: string | undefined;
    parameters?: Record<string, unknown> | undefined;
    mcp?:
      | {
          tool: string;
          server: string;
        }
      | undefined;
    name: string;
    pluginId: string;
    description: string;
  }[];
}>;
declare const validateNodeSkillsUpdateParams: ProtocolValidator<{
  skills: {
    content: string;
    name: string;
    description: string;
  }[];
}>;
declare const validateEnvironmentsCreateParams: ProtocolValidator<{
  idempotencyKey: string;
  profileId: string;
}>;
declare const validateEnvironmentsDestroyParams: ProtocolValidator<{
  environmentId: string;
}>;
declare const validateEnvironmentsListParams: ProtocolValidator<object>;
declare const validateEnvironmentsStatusParams: ProtocolValidator<{
  environmentId: string;
}>;
declare const validateSystemInfoParams: ProtocolValidator<object>;
declare const validateSystemInfoResult: ProtocolValidator<{
  lanAddress?: string | undefined;
  port?: number | undefined;
  processInstanceId?: string | undefined;
  cpuModel?: string | undefined;
  loadAverage?: [number, number, number] | undefined;
  diskTotalBytes?: number | undefined;
  diskAvailableBytes?: number | undefined;
  diskPath?: string | undefined;
  platform: string;
  machineName: string;
  hostname: string;
  release: string;
  arch: string;
  osLabel: string;
  nodeVersion: string;
  pid: number;
  uptimeMs: number;
  cpuCount: number;
  memoryTotalBytes: number;
  memoryFreeBytes: number;
}>;
declare const validateNodePendingAckParams: ProtocolValidator<{
  ids: string[];
}>;
declare const validateNodeDescribeParams: ProtocolValidator<{
  nodeId: string;
}>;
declare const validateNodeInvokeParams: ProtocolValidator<{
  params?: unknown;
  timeoutMs?: number | undefined;
  turnSourceChannel?: string | undefined;
  turnSourceTo?: string | undefined;
  turnSourceAccountId?: string | undefined;
  turnSourceThreadId?: string | number | undefined;
  command: string;
  idempotencyKey: string;
  nodeId: string;
}>;
declare const validateNodeInvokeInputEvent: ProtocolValidator<{
  id: string;
  seq: number;
  nodeId: string;
  payloadJSON: string;
}>;
declare const validateNodeInvokeResultParams: ProtocolValidator<{
  error?:
    | {
        message?: string | undefined;
        code?: string | undefined;
      }
    | undefined;
  payload?: unknown;
  payloadJSON?: string | undefined;
  id: string;
  ok: boolean;
  nodeId: string;
}>;
declare const validateNodeInvokeProgressParams: ProtocolValidator<{
  seq: number;
  nodeId: string;
  invokeId: string;
  chunk: string;
}>;
declare const validateNodeEventParams: ProtocolValidator<{
  payload?: unknown;
  payloadJSON?: string | undefined;
  event: string;
}>;
declare const validateNodeEventResult: ProtocolValidator<{
  reason?: string | undefined;
  event: string;
  ok: boolean;
  handled: boolean;
}>;
declare const validateNodePresenceAlivePayload: ProtocolValidator<{
  displayName?: string | undefined;
  version?: string | undefined;
  platform?: string | undefined;
  deviceFamily?: string | undefined;
  modelIdentifier?: string | undefined;
  sentAtMs?: number | undefined;
  pushTransport?: string | undefined;
  trigger: string;
}>;
declare const validateNodePresenceActivityPayload: ProtocolValidator<{
  saturated?: boolean | undefined;
  idleSeconds: number;
}>;
declare const validateNodePendingDrainParams: ProtocolValidator<{
  maxItems?: number | undefined;
}>;
declare const validateNodePendingEnqueueParams: ProtocolValidator<{
  priority?: string | undefined;
  expiresInMs?: number | undefined;
  wake?: boolean | undefined;
  type: string;
  nodeId: string;
}>;
declare const validatePushTestParams: ProtocolValidator<{
  title?: string | undefined;
  body?: string | undefined;
  environment?: string | undefined;
  nodeId: string;
}>;
declare const validateWebPushVapidPublicKeyParams: ProtocolValidator<WebPushVapidPublicKeyParams>;
declare const validateWebPushSubscribeParams: ProtocolValidator<WebPushSubscribeParams>;
declare const validateWebPushUnsubscribeParams: ProtocolValidator<WebPushUnsubscribeParams>;
declare const validateWebPushTestParams: ProtocolValidator<WebPushTestParams>;
declare const validateSecretsResolveParams: ProtocolValidator<{
  allowedPaths?: string[] | undefined;
  forcedActivePaths?: string[] | undefined;
  optionalActivePaths?: string[] | undefined;
  providerOverrides?:
    | {
        webSearch?: string | undefined;
        webFetch?: string | undefined;
      }
    | undefined;
  commandName: string;
  targetIds: string[];
}>;
declare const validateSecretsResolveResult: ProtocolValidator<{
  diagnostics?: string[] | undefined;
  ok?: boolean | undefined;
  assignments?:
    | {
        path?: string | undefined;
        value: unknown;
        pathSegments: string[];
      }[]
    | undefined;
  inactiveRefPaths?: string[] | undefined;
}>;
declare const validateSessionsListParams: ProtocolValidator<{
  agentId?: string | undefined;
  label?: string | undefined;
  limit?: number | undefined;
  offset?: number | undefined;
  activeMinutes?: number | undefined;
  includeGlobal?: boolean | undefined;
  includeUnknown?: boolean | undefined;
  configuredAgentsOnly?: boolean | undefined;
  includeDerivedTitles?: boolean | undefined;
  includeLastMessage?: boolean | undefined;
  spawnedBy?: string | undefined;
  search?: string | undefined;
  archived?: boolean | undefined;
}>;
declare const validateSessionsCatalogListParams: ProtocolValidator<
  | {
      agentId?: string | undefined;
      search?: string | undefined;
      catalogId?: string | undefined;
      limitPerHost?: number | undefined;
      hostIds?: string[] | undefined;
    }
  | {
      agentId?: string | undefined;
      search?: string | undefined;
      limitPerHost?: number | undefined;
      hostIds?: string[] | undefined;
      catalogId: string;
      cursors: Record<string, string>;
    }
>;
declare const validateSessionsCatalogReadParams: ProtocolValidator<{
  limit?: number | undefined;
  cursor?: string | undefined;
  threadId: string;
  catalogId: string;
  hostId: string;
}>;
declare const validateSessionsCatalogContinueParams: ProtocolValidator<{
  threadId: string;
  catalogId: string;
  hostId: string;
}>;
declare const validateSessionsCatalogArchiveParams: ProtocolValidator<{
  threadId: string;
  catalogId: string;
  hostId: string;
  confirmNoOtherRunner: true;
}>;
declare const validateSessionsSearchParams: ProtocolValidator<{
  agentId?: string | undefined;
  limit?: number | undefined;
  sessionKeys?: string[] | undefined;
  query: string;
}>;
declare const validateSessionsSearchResult: ProtocolValidator<{
  indexing?: boolean | undefined;
  truncated?: boolean | undefined;
  results: {
    role: "user" | "assistant";
    sessionId: string;
    timestamp: number;
    sessionKey: string;
    messageId: string;
    snippet: string;
    score: number;
  }[];
}>;
declare const validateSessionsCleanupParams: ProtocolValidator<{
  agent?: string | undefined;
  allAgents?: boolean | undefined;
  enforce?: boolean | undefined;
  activeKey?: string | undefined;
  fixMissing?: boolean | undefined;
  fixDmScope?: boolean | undefined;
}>;
declare const validateSessionsPreviewParams: ProtocolValidator<{
  limit?: number | undefined;
  maxChars?: number | undefined;
  keys: string[];
}>;
declare const validateSessionsDescribeParams: ProtocolValidator<{
  includeDerivedTitles?: boolean | undefined;
  includeLastMessage?: boolean | undefined;
  key: string;
}>;
declare const validateSessionsResolveParams: ProtocolValidator<{
  agentId?: string | undefined;
  sessionId?: string | undefined;
  label?: string | undefined;
  includeGlobal?: boolean | undefined;
  includeUnknown?: boolean | undefined;
  spawnedBy?: string | undefined;
  key?: string | undefined;
  allowMissing?: boolean | undefined;
}>;
declare const validateSessionsFilesListParams: ProtocolValidator<{
  agentId?: string | undefined;
  path?: string | undefined;
  search?: string | undefined;
  sessionKey: string;
}>;
declare const validateSessionsFilesGetParams: ProtocolValidator<{
  agentId?: string | undefined;
  sessionKey: string;
  path: string;
}>;
declare const validateSessionsFilesSetParams: ProtocolValidator<{
  agentId?: string | undefined;
  content: string;
  sessionKey: string;
  path: string;
  expectedHash: string;
}>;
declare const validateSessionsDiffParams: ProtocolValidator<{
  agentId?: string | undefined;
  sessionKey: string;
}>;
declare const validateSessionsCreateParams: ProtocolValidator<{
  agentId?: string | undefined;
  model?: string | undefined;
  message?: string | undefined;
  task?: string | undefined;
  label?: string | undefined;
  attachments?: unknown[] | undefined;
  cwd?: string | undefined;
  catalogId?: string | undefined;
  key?: string | undefined;
  parentSessionKey?: string | undefined;
  fork?: boolean | undefined;
  emitCommandHooks?: boolean | undefined;
  worktree?: boolean | undefined;
  worktreeBaseRef?: string | undefined;
  worktreeName?: string | undefined;
  execNode?: string | undefined;
}>;
declare const validateSessionsSendParams: ProtocolValidator<{
  agentId?: string | undefined;
  thinking?: string | undefined;
  idempotencyKey?: string | undefined;
  attachments?: unknown[] | undefined;
  timeoutMs?: number | undefined;
  message: string;
  key: string;
}>;
declare const validateSessionsDispatchParams: ProtocolValidator<{
  agentId?: string | undefined;
  profileId: string;
  key: string;
}>;
declare const validateSessionsDispatchResult: ProtocolValidator<{
  sessionId: string;
  ok: true;
  key: string;
  placement: {
    lastTranscriptAckCursor?: number | undefined;
    lastLiveEventAckCursor?: number | undefined;
    environmentId: string;
    state: "active";
    activeOwnerEpoch: number;
    workerBundleHash: string;
    workspaceBaseManifestRef: string;
    remoteWorkspaceDir: string;
    generation: number;
    createdAtMs: number;
    updatedAtMs: number;
    stateChangedAtMs: number;
  };
}>;
declare const validateSessionsMessagesSubscribeParams: ProtocolValidator<{
  agentId?: string | undefined;
  includeApprovals?: true | undefined;
  key: string;
}>;
declare const validateSessionsMessagesUnsubscribeParams: ProtocolValidator<{
  agentId?: string | undefined;
  key: string;
}>;
declare const validateSessionsAbortParams: ProtocolValidator<{
  agentId?: string | undefined;
  runId?: string | undefined;
  key?: string | undefined;
}>;
declare const validateSessionsPatchParams: ProtocolValidator<{
  agentId?: string | undefined;
  model?: string | null | undefined;
  label?: string | null | undefined;
  spawnedBy?: string | null | undefined;
  archived?: boolean | undefined;
  execNode?: string | null | undefined;
  category?: string | null | undefined;
  pinned?: boolean | undefined;
  unread?: boolean | undefined;
  thinkingLevel?: string | null | undefined;
  fastMode?: boolean | "auto" | null | undefined;
  verboseLevel?: string | null | undefined;
  traceLevel?: string | null | undefined;
  reasoningLevel?: string | null | undefined;
  responseUsage?: "off" | "full" | "tokens" | "on" | null | undefined;
  elevatedLevel?: string | null | undefined;
  execHost?: string | null | undefined;
  execSecurity?: string | null | undefined;
  execAsk?: string | null | undefined;
  spawnedWorkspaceDir?: string | null | undefined;
  spawnedCwd?: string | null | undefined;
  spawnDepth?: number | null | undefined;
  subagentRole?: "orchestrator" | "leaf" | null | undefined;
  subagentControlScope?: "none" | "children" | null | undefined;
  inheritedToolAllow?: string[] | null | undefined;
  inheritedToolDeny?: string[] | null | undefined;
  sendPolicy?: "allow" | "deny" | null | undefined;
  groupActivation?: "mention" | "always" | null | undefined;
  key: string;
}>;
declare const validateSessionsPluginPatchParams: ProtocolValidator<{
  value?: unknown;
  unset?: boolean | undefined;
  pluginId: string;
  key: string;
  namespace: string;
}>;
declare const validateSessionsResetParams: ProtocolValidator<{
  agentId?: string | undefined;
  reason?: "new" | "reset" | undefined;
  key: string;
}>;
declare const validateSessionsDeleteParams: ProtocolValidator<{
  agentId?: string | undefined;
  deleteTranscript?: boolean | undefined;
  expectedSessionId?: string | undefined;
  expectedLifecycleRevision?: string | undefined;
  expectedSessionUpdatedAt?: number | undefined;
  emitLifecycleHooks?: boolean | undefined;
  archivedOnly?: boolean | undefined;
  key: string;
}>;
declare const validateSessionsGroupsListParams: ProtocolValidator<object>;
declare const validateSessionsGroupsPutParams: ProtocolValidator<{
  names: string[];
}>;
declare const validateSessionsGroupsRenameParams: ProtocolValidator<{
  name: string;
  to: string;
}>;
declare const validateSessionsGroupsDeleteParams: ProtocolValidator<{
  name: string;
}>;
declare const validateSessionsCompactParams: ProtocolValidator<{
  agentId?: string | undefined;
  maxLines?: number | undefined;
  key: string;
}>;
declare const validateSessionsCompactionListParams: ProtocolValidator<{
  agentId?: string | undefined;
  key: string;
}>;
declare const validateSessionsCompactionGetParams: ProtocolValidator<{
  agentId?: string | undefined;
  key: string;
  checkpointId: string;
}>;
declare const validateSessionsCompactionBranchParams: ProtocolValidator<{
  agentId?: string | undefined;
  key: string;
  checkpointId: string;
}>;
declare const validateSessionsCompactionRestoreParams: ProtocolValidator<{
  agentId?: string | undefined;
  key: string;
  checkpointId: string;
}>;
declare const validateSessionsUsageParams: ProtocolValidator<{
  agentId?: string | undefined;
  mode?: "utc" | "gateway" | "specific" | undefined;
  limit?: number | undefined;
  key?: string | undefined;
  agentScope?: "all" | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
  range?: "all" | "7d" | "30d" | "90d" | "1y" | undefined;
  groupBy?: "instance" | "family" | undefined;
  includeHistorical?: boolean | undefined;
  utcOffset?: string | undefined;
  timeZone?: string | undefined;
  includeContextWeight?: boolean | undefined;
}>;
declare const validateTaskSuggestionsListParams: ProtocolValidator<{
  agentId?: string | undefined;
  sessionKey?: string | undefined;
}>;
declare const validateTaskSuggestionsCreateParams: ProtocolValidator<{
  agentId?: string | undefined;
  title: string;
  sessionKey: string;
  cwd: string;
  prompt: string;
  tldr: string;
}>;
declare const validateTaskSuggestionsAcceptParams: ProtocolValidator<{
  taskId: string;
}>;
declare const validateTaskSuggestionsDismissParams: ProtocolValidator<{
  reason?: string | undefined;
  taskId: string;
}>;
declare const validateTasksListParams: ProtocolValidator<{
  agentId?: string | undefined;
  status?:
    | "failed"
    | "running"
    | "cancelled"
    | "timed_out"
    | "queued"
    | "completed"
    | ("failed" | "running" | "cancelled" | "timed_out" | "queued" | "completed")[]
    | undefined;
  sessionKey?: string | undefined;
  limit?: number | undefined;
  cursor?: string | undefined;
}>;
declare const validateTasksGetParams: ProtocolValidator<{
  taskId: string;
}>;
declare const validateTasksCancelParams: ProtocolValidator<{
  reason?: string | undefined;
  taskId: string;
}>;
declare const validateConfigGetParams: ProtocolValidator<object>;
declare const validateConfigSetParams: ProtocolValidator<{
  baseHash?: string | undefined;
  raw: string;
}>;
declare const validateConfigApplyParams: ProtocolValidator<{
  readonly sessionKey?: string | undefined;
  readonly baseHash?: string | undefined;
  readonly deliveryContext?:
    | {
        channel?: string | undefined;
        accountId?: string | undefined;
        to?: string | undefined;
        threadId?: string | number | undefined;
      }
    | undefined;
  readonly note?: string | undefined;
  readonly restartDelayMs?: number | undefined;
  readonly raw: string;
}>;
declare const validateConfigPatchParams: ProtocolValidator<{
  sessionKey?: string | undefined;
  baseHash?: string | undefined;
  deliveryContext?:
    | {
        channel?: string | undefined;
        accountId?: string | undefined;
        to?: string | undefined;
        threadId?: string | number | undefined;
      }
    | undefined;
  note?: string | undefined;
  restartDelayMs?: number | undefined;
  replacePaths?: string[] | undefined;
  raw: string;
}>;
declare const validateConfigSchemaParams: ProtocolValidator<object>;
declare const validateConfigSchemaLookupParams: ProtocolValidator<{
  path: string;
}>;
declare const validateConfigSchemaLookupResult: ProtocolValidator<{
  reloadKind?: "none" | "restart" | "hot" | undefined;
  hint?:
    | {
        label?: string | undefined;
        help?: string | undefined;
        tags?: string[] | undefined;
        group?: string | undefined;
        order?: number | undefined;
        advanced?: boolean | undefined;
        sensitive?: boolean | undefined;
        placeholder?: string | undefined;
        itemTemplate?: unknown;
      }
    | undefined;
  hintPath?: string | undefined;
  path: string;
  children: {
    type?: string | string[] | undefined;
    reloadKind?: "none" | "restart" | "hot" | undefined;
    hint?:
      | {
          label?: string | undefined;
          help?: string | undefined;
          tags?: string[] | undefined;
          group?: string | undefined;
          order?: number | undefined;
          advanced?: boolean | undefined;
          sensitive?: boolean | undefined;
          placeholder?: string | undefined;
          itemTemplate?: unknown;
        }
      | undefined;
    hintPath?: string | undefined;
    required: boolean;
    path: string;
    key: string;
    hasChildren: boolean;
  }[];
  schema: unknown;
}>;
declare const validateCrestodianChatParams: ProtocolValidator<{
  message?: string | undefined;
  reset?: boolean | undefined;
  welcomeVariant?: "onboarding" | undefined;
  sessionId: string;
}>;
declare const validateCrestodianSetupDetectParams: ProtocolValidator<object>;
declare const validateCrestodianSetupVerifyParams: ProtocolValidator<object>;
declare const validateCrestodianSetupActivateParams: ProtocolValidator<{
  workspace?: string | undefined;
  modelRef?: string | undefined;
  authChoice?: string | undefined;
  apiKey?: string | undefined;
  kind:
    | "existing-model"
    | "openai-api-key"
    | "anthropic-api-key"
    | "claude-cli"
    | "codex-cli"
    | "gemini-cli"
    | "api-key";
}>;
declare const validateCrestodianSetupAuthStartParams: ProtocolValidator<{
  workspace?: string | undefined;
  sessionId: string;
  authChoice: string;
}>;
declare const validateWizardStartParams: ProtocolValidator<{
  mode?: "local" | "remote" | undefined;
  channel?: string | undefined;
  workspace?: string | undefined;
  flow?: "setup" | "channels" | undefined;
}>;
declare const validateWizardNextParams: ProtocolValidator<{
  answer?:
    | {
        value?: unknown;
        stepId: string;
      }
    | undefined;
  sessionId: string;
}>;
declare const validateWizardCancelParams: ProtocolValidator<{
  sessionId: string;
}>;
declare const validateWizardStatusParams: ProtocolValidator<{
  sessionId: string;
}>;
declare const validateTalkModeParams: ProtocolValidator<{
  phase?: string | undefined;
  enabled: boolean;
}>;
declare const validateTalkEvent: ProtocolValidator<{
  provider?: string | undefined;
  itemId?: string | undefined;
  turnId?: string | undefined;
  captureId?: string | undefined;
  final?: boolean | undefined;
  callId?: string | undefined;
  parentId?: string | undefined;
  type:
    | "session.started"
    | "session.ready"
    | "session.closed"
    | "session.error"
    | "session.replaced"
    | "turn.started"
    | "turn.ended"
    | "turn.cancelled"
    | "capture.started"
    | "capture.stopped"
    | "capture.cancelled"
    | "capture.once"
    | "input.audio.delta"
    | "input.audio.committed"
    | "transcript.delta"
    | "transcript.done"
    | "output.text.delta"
    | "output.text.done"
    | "output.audio.started"
    | "output.audio.delta"
    | "output.audio.done"
    | "tool.call"
    | "tool.progress"
    | "tool.result"
    | "tool.error"
    | "usage.metrics"
    | "latency.metrics"
    | "health.changed";
  id: string;
  mode: "realtime" | "stt-tts" | "transcription";
  sessionId: string;
  seq: number;
  timestamp: string;
  payload: unknown;
  transport: "webrtc" | "provider-websocket" | "gateway-relay" | "managed-room";
  brain: "none" | "agent-consult" | "direct-tools";
}>;
declare const validateTalkCatalogParams: ProtocolValidator<object>;
declare const validateTalkCatalogResult: ProtocolValidator<{
  realtime: {
    ready?: boolean | undefined;
    activeProvider?: string | undefined;
    providers: {
      modes?: ("realtime" | "stt-tts" | "transcription")[] | undefined;
      transports?:
        | ("webrtc" | "provider-websocket" | "gateway-relay" | "managed-room")[]
        | undefined;
      brains?: ("none" | "agent-consult" | "direct-tools")[] | undefined;
      aliases?: string[] | undefined;
      models?: string[] | undefined;
      voices?: string[] | undefined;
      defaultModel?: string | undefined;
      inputAudioFormats?:
        | {
            channels: number;
            encoding: "pcm16" | "g711_ulaw";
            sampleRateHz: number;
          }[]
        | undefined;
      outputAudioFormats?:
        | {
            channels: number;
            encoding: "pcm16" | "g711_ulaw";
            sampleRateHz: number;
          }[]
        | undefined;
      supportsBrowserSession?: boolean | undefined;
      supportsBargeIn?: boolean | undefined;
      supportsToolCalls?: boolean | undefined;
      supportsVideoFrames?: boolean | undefined;
      supportsSessionResumption?: boolean | undefined;
      id: string;
      label: string;
      configured: boolean;
    }[];
  };
  transcription: {
    ready?: boolean | undefined;
    activeProvider?: string | undefined;
    providers: {
      modes?: ("realtime" | "stt-tts" | "transcription")[] | undefined;
      transports?:
        | ("webrtc" | "provider-websocket" | "gateway-relay" | "managed-room")[]
        | undefined;
      brains?: ("none" | "agent-consult" | "direct-tools")[] | undefined;
      aliases?: string[] | undefined;
      models?: string[] | undefined;
      voices?: string[] | undefined;
      defaultModel?: string | undefined;
      inputAudioFormats?:
        | {
            channels: number;
            encoding: "pcm16" | "g711_ulaw";
            sampleRateHz: number;
          }[]
        | undefined;
      outputAudioFormats?:
        | {
            channels: number;
            encoding: "pcm16" | "g711_ulaw";
            sampleRateHz: number;
          }[]
        | undefined;
      supportsBrowserSession?: boolean | undefined;
      supportsBargeIn?: boolean | undefined;
      supportsToolCalls?: boolean | undefined;
      supportsVideoFrames?: boolean | undefined;
      supportsSessionResumption?: boolean | undefined;
      id: string;
      label: string;
      configured: boolean;
    }[];
  };
  modes: ("realtime" | "stt-tts" | "transcription")[];
  transports: ("webrtc" | "provider-websocket" | "gateway-relay" | "managed-room")[];
  brains: ("none" | "agent-consult" | "direct-tools")[];
  speech: {
    ready?: boolean | undefined;
    activeProvider?: string | undefined;
    providers: {
      modes?: ("realtime" | "stt-tts" | "transcription")[] | undefined;
      transports?:
        | ("webrtc" | "provider-websocket" | "gateway-relay" | "managed-room")[]
        | undefined;
      brains?: ("none" | "agent-consult" | "direct-tools")[] | undefined;
      aliases?: string[] | undefined;
      models?: string[] | undefined;
      voices?: string[] | undefined;
      defaultModel?: string | undefined;
      inputAudioFormats?:
        | {
            channels: number;
            encoding: "pcm16" | "g711_ulaw";
            sampleRateHz: number;
          }[]
        | undefined;
      outputAudioFormats?:
        | {
            channels: number;
            encoding: "pcm16" | "g711_ulaw";
            sampleRateHz: number;
          }[]
        | undefined;
      supportsBrowserSession?: boolean | undefined;
      supportsBargeIn?: boolean | undefined;
      supportsToolCalls?: boolean | undefined;
      supportsVideoFrames?: boolean | undefined;
      supportsSessionResumption?: boolean | undefined;
      id: string;
      label: string;
      configured: boolean;
    }[];
  };
}>;
declare const validateTalkConfigParams: ProtocolValidator<{
  includeSecrets?: boolean | undefined;
}>;
declare const validateTalkConfigResult: ProtocolValidator<{
  config: {
    ui?:
      | {
          seamColor?: string | undefined;
        }
      | undefined;
    session?:
      | {
          mainKey?: string | undefined;
        }
      | undefined;
    talk?:
      | {
          provider?: string | undefined;
          resolved?:
            | {
                provider: string;
                config: {
                  apiKey?:
                    | string
                    | {
                        provider: string;
                        id: string;
                        source: "env";
                      }
                    | {
                        provider: string;
                        id: string;
                        source: "file";
                      }
                    | {
                        provider: string;
                        id: string;
                        source: "exec";
                      }
                    | undefined;
                };
              }
            | undefined;
          realtime?:
            | {
                provider?: string | undefined;
                mode?: "realtime" | "stt-tts" | "transcription" | undefined;
                model?: string | undefined;
                transport?:
                  | "webrtc"
                  | "provider-websocket"
                  | "gateway-relay"
                  | "managed-room"
                  | undefined;
                brain?: "none" | "agent-consult" | "direct-tools" | undefined;
                providers?:
                  | Record<
                      string,
                      {
                        apiKey?:
                          | string
                          | {
                              provider: string;
                              id: string;
                              source: "env";
                            }
                          | {
                              provider: string;
                              id: string;
                              source: "file";
                            }
                          | {
                              provider: string;
                              id: string;
                              source: "exec";
                            }
                          | undefined;
                      }
                    >
                  | undefined;
                speakerVoice?: string | undefined;
                speakerVoiceId?: string | undefined;
                voice?: string | undefined;
                instructions?: string | undefined;
                vadThreshold?: number | undefined;
                silenceDurationMs?: number | undefined;
                prefixPaddingMs?: number | undefined;
                reasoningEffort?: string | undefined;
                consultRouting?: "provider-direct" | "force-agent-consult" | undefined;
              }
            | undefined;
          providers?:
            | Record<
                string,
                {
                  apiKey?:
                    | string
                    | {
                        provider: string;
                        id: string;
                        source: "env";
                      }
                    | {
                        provider: string;
                        id: string;
                        source: "file";
                      }
                    | {
                        provider: string;
                        id: string;
                        source: "exec";
                      }
                    | undefined;
                }
              >
            | undefined;
          consultThinkingLevel?: string | undefined;
          consultFastMode?: boolean | undefined;
          speechLocale?: string | undefined;
          interruptOnSpeech?: boolean | undefined;
          silenceTimeoutMs?: number | undefined;
        }
      | undefined;
  };
}>;
declare const validateTalkClientCreateParams: ProtocolValidator<{
  provider?: string | undefined;
  mode?: "realtime" | "stt-tts" | "transcription" | undefined;
  model?: string | undefined;
  sessionKey?: string | undefined;
  transport?: "webrtc" | "provider-websocket" | "gateway-relay" | "managed-room" | undefined;
  brain?: "none" | "agent-consult" | "direct-tools" | undefined;
  voice?: string | undefined;
  vadThreshold?: number | undefined;
  silenceDurationMs?: number | undefined;
  prefixPaddingMs?: number | undefined;
  reasoningEffort?: string | undefined;
}>;
declare const validateTalkClientCreateResult: ProtocolValidator<
  | {
      model?: string | undefined;
      voice?: string | undefined;
      offerUrl?: string | undefined;
      offerHeaders?: Record<string, string> | undefined;
      expiresAt?: number | undefined;
      provider: string;
      transport: "webrtc";
      clientSecret: string;
    }
  | {
      model?: string | undefined;
      voice?: string | undefined;
      expiresAt?: number | undefined;
      initialMessage?: unknown;
      provider: string;
      audio: {
        inputEncoding: "pcm16" | "g711_ulaw";
        inputSampleRateHz: number;
        outputEncoding: "pcm16" | "g711_ulaw";
        outputSampleRateHz: number;
      };
      transport: "provider-websocket";
      clientSecret: string;
      protocol: string;
      websocketUrl: string;
    }
  | {
      model?: string | undefined;
      voice?: string | undefined;
      expiresAt?: number | undefined;
      provider: string;
      audio: {
        inputEncoding: "pcm16" | "g711_ulaw";
        inputSampleRateHz: number;
        outputEncoding: "pcm16" | "g711_ulaw";
        outputSampleRateHz: number;
      };
      transport: "gateway-relay";
      relaySessionId: string;
    }
  | {
      token?: string | undefined;
      model?: string | undefined;
      voice?: string | undefined;
      expiresAt?: number | undefined;
      provider: string;
      transport: "managed-room";
      roomUrl: string;
    }
>;
declare const validateTalkClientToolCallParams: ProtocolValidator<{
  args?: unknown;
  relaySessionId?: string | undefined;
  name: string;
  sessionKey: string;
  callId: string;
}>;
declare const validateTalkClientToolCallResult: ProtocolValidator<{
  runId: string;
  idempotencyKey: string;
}>;
declare const validateTalkClientSteerParams: ProtocolValidator<{
  mode?: "status" | "steer" | "cancel" | "followup" | undefined;
  text: string;
  sessionKey: string;
}>;
declare const validateTalkAgentControlResult: ProtocolValidator<{
  sessionId?: string | undefined;
  aborted?: boolean | undefined;
  reason?: string | undefined;
  queued?: boolean | undefined;
  target?: "embedded_run" | "reply_run" | undefined;
  providerResult?:
    | {
        status: "cancelled";
        message: string;
      }
    | undefined;
  enqueuedAtMs?: number | undefined;
  deliveredAtMs?: number | undefined;
  mode: "status" | "steer" | "cancel" | "followup";
  message: string;
  ok: boolean;
  sessionKey: string;
  active: boolean;
  speak: boolean;
  show: boolean;
  suppress: boolean;
}>;
declare const validateTalkSessionCreateParams: ProtocolValidator<{
  provider?: string | undefined;
  mode?: "realtime" | "stt-tts" | "transcription" | undefined;
  model?: string | undefined;
  sessionKey?: string | undefined;
  spawnedBy?: string | undefined;
  transport?: "webrtc" | "provider-websocket" | "gateway-relay" | "managed-room" | undefined;
  brain?: "none" | "agent-consult" | "direct-tools" | undefined;
  voice?: string | undefined;
  vadThreshold?: number | undefined;
  silenceDurationMs?: number | undefined;
  prefixPaddingMs?: number | undefined;
  reasoningEffort?: string | undefined;
  ttlMs?: number | undefined;
}>;
declare const validateTalkSessionCreateResult: ProtocolValidator<{
  provider?: string | undefined;
  token?: string | undefined;
  model?: string | undefined;
  audio?: unknown;
  voice?: string | undefined;
  expiresAt?: number | undefined;
  relaySessionId?: string | undefined;
  roomUrl?: string | undefined;
  transcriptionSessionId?: string | undefined;
  handoffId?: string | undefined;
  roomId?: string | undefined;
  mode: "realtime" | "stt-tts" | "transcription";
  sessionId: string;
  transport: "webrtc" | "provider-websocket" | "gateway-relay" | "managed-room";
  brain: "none" | "agent-consult" | "direct-tools";
}>;
declare const validateTalkSessionJoinParams: ProtocolValidator<{
  token: string;
  sessionId: string;
}>;
declare const validateTalkSessionJoinResult: ProtocolValidator<{
  provider?: string | undefined;
  sessionId?: string | undefined;
  model?: string | undefined;
  channel?: string | undefined;
  voice?: string | undefined;
  target?: string | undefined;
  id: string;
  mode: "realtime" | "stt-tts" | "transcription";
  sessionKey: string;
  transport: "webrtc" | "provider-websocket" | "gateway-relay" | "managed-room";
  brain: "none" | "agent-consult" | "direct-tools";
  expiresAt: number;
  roomUrl: string;
  roomId: string;
  createdAt: number;
  room: {
    activeClientId?: string | undefined;
    activeTurnId?: string | undefined;
    recentTalkEvents: {
      provider?: string | undefined;
      itemId?: string | undefined;
      turnId?: string | undefined;
      captureId?: string | undefined;
      final?: boolean | undefined;
      callId?: string | undefined;
      parentId?: string | undefined;
      type:
        | "session.started"
        | "session.ready"
        | "session.closed"
        | "session.error"
        | "session.replaced"
        | "turn.started"
        | "turn.ended"
        | "turn.cancelled"
        | "capture.started"
        | "capture.stopped"
        | "capture.cancelled"
        | "capture.once"
        | "input.audio.delta"
        | "input.audio.committed"
        | "transcript.delta"
        | "transcript.done"
        | "output.text.delta"
        | "output.text.done"
        | "output.audio.started"
        | "output.audio.delta"
        | "output.audio.done"
        | "tool.call"
        | "tool.progress"
        | "tool.result"
        | "tool.error"
        | "usage.metrics"
        | "latency.metrics"
        | "health.changed";
      id: string;
      mode: "realtime" | "stt-tts" | "transcription";
      sessionId: string;
      seq: number;
      timestamp: string;
      payload: unknown;
      transport: "webrtc" | "provider-websocket" | "gateway-relay" | "managed-room";
      brain: "none" | "agent-consult" | "direct-tools";
    }[];
  };
}>;
declare const validateTalkSessionAppendAudioParams: ProtocolValidator<{
  timestamp?: number | undefined;
  sessionId: string;
  audioBase64: string;
}>;
declare const validateTalkSessionAcknowledgeMarkParams: ProtocolValidator<{
  sessionId: string;
  markName: string;
}>;
declare const validateTalkSessionTurnParams: ProtocolValidator<{
  turnId?: string | undefined;
  sessionId: string;
}>;
declare const validateTalkSessionCancelTurnParams: ProtocolValidator<{
  reason?: string | undefined;
  turnId?: string | undefined;
  sessionId: string;
}>;
declare const validateTalkSessionCancelOutputParams: ProtocolValidator<{
  reason?: string | undefined;
  turnId?: string | undefined;
  sessionId: string;
}>;
declare const validateTalkSessionTurnResult: ProtocolValidator<{
  turnId?: string | undefined;
  events?:
    | {
        provider?: string | undefined;
        itemId?: string | undefined;
        turnId?: string | undefined;
        captureId?: string | undefined;
        final?: boolean | undefined;
        callId?: string | undefined;
        parentId?: string | undefined;
        type:
          | "session.started"
          | "session.ready"
          | "session.closed"
          | "session.error"
          | "session.replaced"
          | "turn.started"
          | "turn.ended"
          | "turn.cancelled"
          | "capture.started"
          | "capture.stopped"
          | "capture.cancelled"
          | "capture.once"
          | "input.audio.delta"
          | "input.audio.committed"
          | "transcript.delta"
          | "transcript.done"
          | "output.text.delta"
          | "output.text.done"
          | "output.audio.started"
          | "output.audio.delta"
          | "output.audio.done"
          | "tool.call"
          | "tool.progress"
          | "tool.result"
          | "tool.error"
          | "usage.metrics"
          | "latency.metrics"
          | "health.changed";
        id: string;
        mode: "realtime" | "stt-tts" | "transcription";
        sessionId: string;
        seq: number;
        timestamp: string;
        payload: unknown;
        transport: "webrtc" | "provider-websocket" | "gateway-relay" | "managed-room";
        brain: "none" | "agent-consult" | "direct-tools";
      }[]
    | undefined;
  ok: boolean;
}>;
declare const validateTalkSessionSteerParams: ProtocolValidator<{
  mode?: "status" | "steer" | "cancel" | "followup" | undefined;
  sessionKey?: string | undefined;
  text: string;
  sessionId: string;
}>;
declare const validateTalkSessionSubmitToolResultParams: ProtocolValidator<{
  options?:
    | {
        suppressResponse?: boolean | undefined;
        willContinue?: boolean | undefined;
      }
    | undefined;
  sessionId: string;
  result: unknown;
  callId: string;
}>;
declare const validateTalkSessionCloseParams: ProtocolValidator<{
  sessionId: string;
}>;
declare const validateTalkSessionOkResult: ProtocolValidator<{
  ok: boolean;
}>;
declare const validateTalkSpeakParams: ProtocolValidator<{
  voiceId?: string | undefined;
  modelId?: string | undefined;
  outputFormat?: string | undefined;
  speed?: number | undefined;
  rateWpm?: number | undefined;
  stability?: number | undefined;
  similarity?: number | undefined;
  style?: number | undefined;
  speakerBoost?: boolean | undefined;
  seed?: number | undefined;
  normalize?: string | undefined;
  language?: string | undefined;
  latencyTier?: number | undefined;
  text: string;
}>;
declare const validateTalkSpeakResult: ProtocolValidator<{
  mimeType?: string | undefined;
  outputFormat?: string | undefined;
  voiceCompatible?: boolean | undefined;
  fileExtension?: string | undefined;
  provider: string;
  audioBase64: string;
}>;
declare const validateTtsSpeakParams: ProtocolValidator<{
  text: string;
}>;
declare const validateTtsSpeakResult: ProtocolValidator<{
  mimeType?: string | undefined;
  outputFormat?: string | undefined;
  fileExtension?: string | undefined;
  provider: string;
  audioBase64: string;
}>;
declare const validateChannelsStatusParams: ProtocolValidator<{
  probe?: boolean | undefined;
  channel?: string | undefined;
  timeoutMs?: number | undefined;
}>;
declare const validateChannelsStartParams: ProtocolValidator<{
  accountId?: string | undefined;
  channel: string;
}>;
declare const validateChannelsStopParams: ProtocolValidator<{
  accountId?: string | undefined;
  channel: string;
}>;
declare const validateChannelsLogoutParams: ProtocolValidator<{
  accountId?: string | undefined;
  channel: string;
}>;
declare const validateModelsListParams: ProtocolValidator<{
  includeProviderCapabilities?: boolean | undefined;
  view?: "default" | "all" | "configured" | "provider-config" | undefined;
}>;
declare const validateSkillsStatusParams: ProtocolValidator<{
  agentId?: string | undefined;
}>;
declare const validateToolsCatalogParams: ProtocolValidator<{
  agentId?: string | undefined;
  includePlugins?: boolean | undefined;
}>;
declare const validateToolsEffectiveParams: ProtocolValidator<{
  agentId?: string | undefined;
  sessionKey: string;
}>;
declare const validateToolsInvokeParams: ProtocolValidator<{
  agentId?: string | undefined;
  args?: Record<string, unknown> | undefined;
  sessionKey?: string | undefined;
  conversationReadOrigin?: "direct-operator" | undefined;
  idempotencyKey?: string | undefined;
  confirm?: boolean | undefined;
  name: string;
}>;
declare const validateSkillsBinsParams: ProtocolValidator<object>;
declare const validateSkillsInstallParams: ProtocolValidator<
  | {
      agentId?: string | undefined;
      timeoutMs?: number | undefined;
      dangerouslyForceUnsafeInstall?: boolean | undefined;
      name: string;
      installId: string;
    }
  | {
      agentId?: string | undefined;
      version?: string | undefined;
      timeoutMs?: number | undefined;
      force?: boolean | undefined;
      acknowledgeClawHubRisk?: boolean | undefined;
      source: "clawhub";
      slug: string;
    }
  | {
      agentId?: string | undefined;
      timeoutMs?: number | undefined;
      force?: boolean | undefined;
      sha256?: string | undefined;
      source: "upload";
      slug: string;
      uploadId: string;
    }
>;
declare const validateSkillsUploadBeginParams: ProtocolValidator<{
  idempotencyKey?: string | undefined;
  force?: boolean | undefined;
  sha256?: string | undefined;
  kind: "skill-archive";
  slug: string;
  sizeBytes: number;
}>;
declare const validateSkillsUploadChunkParams: ProtocolValidator<{
  offset: number;
  uploadId: string;
  dataBase64: string;
}>;
declare const validateSkillsUploadCommitParams: ProtocolValidator<{
  sha256?: string | undefined;
  uploadId: string;
}>;
declare const validateSkillsUpdateParams: ProtocolValidator<
  | {
      apiKey?: string | undefined;
      enabled?: boolean | undefined;
      env?: Record<string, string> | undefined;
      skillKey: string;
    }
  | {
      agentId?: string | undefined;
      all?: boolean | undefined;
      slug?: string | undefined;
      acknowledgeClawHubRisk?: boolean | undefined;
      source: "clawhub";
    }
>;
declare const validateSkillsSearchParams: ProtocolValidator<{
  limit?: number | undefined;
  query?: string | undefined;
}>;
declare const validateSkillsDetailParams: ProtocolValidator<{
  slug: string;
}>;
declare const validateSkillsCuratorStatusParams: ProtocolValidator<object>;
declare const validateSkillsCuratorActionParams: ProtocolValidator<{
  skill: string;
}>;
declare const validateSkillsProposalsListParams: ProtocolValidator<{
  agentId?: string | undefined;
}>;
declare const validateSkillsProposalInspectParams: ProtocolValidator<{
  agentId?: string | undefined;
  proposalId: string;
}>;
declare const validateSkillsProposalCreateParams: ProtocolValidator<{
  agentId?: string | undefined;
  supportFiles?:
    | {
        content: string;
        path: string;
      }[]
    | undefined;
  goal?: string | undefined;
  evidence?: string | undefined;
  content: string;
  name: string;
  description: string;
}>;
declare const validateSkillsProposalUpdateParams: ProtocolValidator<{
  agentId?: string | undefined;
  description?: string | undefined;
  supportFiles?:
    | {
        content: string;
        path: string;
      }[]
    | undefined;
  goal?: string | undefined;
  evidence?: string | undefined;
  content: string;
  skillName: string;
}>;
declare const validateSkillsProposalReviseParams: ProtocolValidator<{
  agentId?: string | undefined;
  description?: string | undefined;
  supportFiles?:
    | {
        content: string;
        path: string;
      }[]
    | undefined;
  goal?: string | undefined;
  evidence?: string | undefined;
  content: string;
  proposalId: string;
}>;
declare const validateSkillsProposalRequestRevisionParams: ProtocolValidator<{
  agentId?: string | undefined;
  sessionId?: string | undefined;
  targetAgentId?: string | undefined;
  sessionKey: string;
  idempotencyKey: string;
  instructions: string;
  proposalId: string;
}>;
declare const validateSkillsProposalActionParams: ProtocolValidator<{
  agentId?: string | undefined;
  reason?: string | undefined;
  proposalId: string;
}>;
declare const validateSkillsSecurityVerdictsParams: ProtocolValidator<{
  agentId?: string | undefined;
}>;
declare const validateSkillsSkillCardParams: ProtocolValidator<{
  agentId?: string | undefined;
  skillKey: string;
}>;
declare const validateCronListParams: ProtocolValidator<{
  agentId?: string | undefined;
  limit?: number | undefined;
  offset?: number | undefined;
  query?: string | undefined;
  enabled?: "all" | "enabled" | "disabled" | undefined;
  includeDisabled?: boolean | undefined;
  scheduleKind?: "cron" | "all" | "at" | "every" | "on-exit" | undefined;
  lastRunStatus?: "error" | "unknown" | "ok" | "all" | "skipped" | undefined;
  sortBy?: "name" | "updatedAtMs" | "nextRunAtMs" | undefined;
  sortDir?: "asc" | "desc" | undefined;
  compact?: boolean | undefined;
}>;
declare const validateCronStatusParams: ProtocolValidator<object>;
declare const validateCronGetParams: ProtocolValidator<
  | {
      id: string;
    }
  | {
      jobId: string;
    }
>;
declare const validateCronAddParams: ProtocolValidator<{
  agentId?: string | null | undefined;
  displayName?: string | undefined;
  sessionKey?: string | null | undefined;
  description?: string | undefined;
  trigger?:
    | {
        once?: boolean | undefined;
        script: string;
      }
    | undefined;
  enabled?: boolean | undefined;
  declarationKey?: string | undefined;
  owner?:
    | {
        agentId?: string | undefined;
        sessionKey?: string | undefined;
      }
    | undefined;
  delivery?:
    | {
        channel?: string | undefined;
        accountId?: string | undefined;
        to?: string | undefined;
        threadId?: string | number | undefined;
        bestEffort?: boolean | undefined;
        failureDestination?:
          | {
              mode?: "announce" | "webhook" | undefined;
              channel?: string | undefined;
              accountId?: string | undefined;
              to?: string | undefined;
            }
          | undefined;
        mode: "none";
      }
    | {
        channel?: string | undefined;
        accountId?: string | undefined;
        to?: string | undefined;
        threadId?: string | number | undefined;
        bestEffort?: boolean | undefined;
        failureDestination?:
          | {
              mode?: "announce" | "webhook" | undefined;
              channel?: string | undefined;
              accountId?: string | undefined;
              to?: string | undefined;
            }
          | undefined;
        completionDestination?:
          | {
              mode: "webhook";
              to: string;
            }
          | undefined;
        mode: "announce";
      }
    | {
        channel?: string | undefined;
        accountId?: string | undefined;
        threadId?: string | number | undefined;
        bestEffort?: boolean | undefined;
        failureDestination?:
          | {
              mode?: "announce" | "webhook" | undefined;
              channel?: string | undefined;
              accountId?: string | undefined;
              to?: string | undefined;
            }
          | undefined;
        mode: "webhook";
        to: string;
      }
    | undefined;
  failureAlert?:
    | false
    | {
        mode?: "announce" | "webhook" | undefined;
        channel?: string | undefined;
        accountId?: string | undefined;
        to?: string | undefined;
        after?: number | undefined;
        cooldownMs?: number | undefined;
        includeSkipped?: boolean | undefined;
      }
    | undefined;
  deleteAfterRun?: boolean | undefined;
  name: string;
  payload:
    | {
        text: string;
        kind: "systemEvent";
      }
    | {
        thinking?: unknown;
        model?: unknown;
        fallbacks?: unknown;
        timeoutSeconds?: number | undefined;
        allowUnsafeExternalContent?: boolean | undefined;
        lightContext?: boolean | undefined;
        toolsAllow?: unknown;
        toolsAllowIsDefault?: boolean | undefined;
        message: unknown;
        kind: "agentTurn";
      }
    | {
        input?: string | undefined;
        cwd?: string | undefined;
        env?: Record<string, string> | undefined;
        timeoutSeconds?: number | undefined;
        noOutputTimeoutSeconds?: number | undefined;
        outputMaxBytes?: number | undefined;
        kind: "command";
        argv: unknown;
      };
  schedule:
    | {
        kind: "at";
        at: string;
      }
    | {
        anchorMs?: number | undefined;
        kind: "every";
        everyMs: number;
      }
    | {
        tz?: string | undefined;
        staggerMs?: number | undefined;
        kind: "cron";
        expr: string;
      }
    | {
        cwd?: string | undefined;
        kind: "on-exit";
        command: string;
      };
  sessionTarget: string;
  wakeMode: "now" | "next-heartbeat";
}>;
declare const validateCronUpdateParams: ProtocolValidator<
  | {
      id: string;
    }
  | {
      jobId: string;
    }
>;
declare const validateCronRemoveParams: ProtocolValidator<
  | {
      id: string;
    }
  | {
      jobId: string;
    }
>;
declare const validateCronRunParams: ProtocolValidator<
  | {
      id: string;
    }
  | {
      jobId: string;
    }
>;
declare const validateCronRunsParams: ProtocolValidator<{
  agentId?: string | undefined;
  scope?: "all" | "job" | undefined;
  id?: string | undefined;
  runId?: string | undefined;
  status?: "error" | "ok" | "all" | "skipped" | undefined;
  limit?: number | undefined;
  offset?: number | undefined;
  query?: string | undefined;
  sortDir?: "asc" | "desc" | undefined;
  jobId?: string | undefined;
  statuses?: ("error" | "ok" | "skipped")[] | undefined;
  deliveryStatuses?: ("unknown" | "delivered" | "not-delivered" | "not-requested")[] | undefined;
  deliveryStatus?: "unknown" | "delivered" | "not-delivered" | "not-requested" | undefined;
}>;
declare const validateDevicePairListParams: ProtocolValidator<object>;
declare const validateDevicePairApproveParams: ProtocolValidator<{
  requestId: string;
}>;
declare const validateDevicePairRejectParams: ProtocolValidator<{
  requestId: string;
}>;
declare const validateDevicePairRemoveParams: ProtocolValidator<{
  deviceId: string;
}>;
declare const validateDevicePairSetupCodeParams: ProtocolValidator<{
  publicUrl?: string | undefined;
  preferRemoteUrl?: boolean | undefined;
  includeQr?: boolean | undefined;
  bootstrapProfile?: string | undefined;
}>;
declare const validateDevicePairRenameParams: ProtocolValidator<{
  label: string;
  deviceId: string;
}>;
declare const validateDeviceTokenRotateParams: ProtocolValidator<{
  scopes?: string[] | undefined;
  role: string;
  deviceId: string;
}>;
declare const validateDeviceTokenRevokeParams: ProtocolValidator<{
  role: string;
  deviceId: string;
}>;
declare const validateApprovalKind: ProtocolValidator<"exec" | "plugin">;
declare const validateApprovalDecision: ProtocolValidator<"deny" | "allow-once" | "allow-always">;
declare const validateApprovalAllowDecision: ProtocolValidator<"allow-once" | "allow-always">;
declare const validateApprovalTerminalReason: ProtocolValidator<
  | "user"
  | "timeout"
  | "malformed-verdict"
  | "no-route"
  | "run-aborted"
  | "gateway-restart"
  | "storage-corrupt"
>;
declare const validatePluginApprovalSeverity: ProtocolValidator<"info" | "warning" | "critical">;
declare const validateExecApprovalPresentation: ProtocolValidator<{
  agentId?: string | null | undefined;
  host?: string | null | undefined;
  nodeId?: string | null | undefined;
  commandPreview?: string | null | undefined;
  warningText?: string | null | undefined;
  kind: "exec";
  commandText: string;
  allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
}>;
declare const validatePluginApprovalPresentation: ProtocolValidator<{
  agentId?: string | null | undefined;
  toolName?: string | null | undefined;
  pluginId?: string | null | undefined;
  kind: "plugin";
  title: string;
  description: string;
  allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
  severity: "info" | "warning" | "critical";
}>;
declare const validateApprovalPresentation: ProtocolValidator<
  | {
      agentId?: string | null | undefined;
      host?: string | null | undefined;
      nodeId?: string | null | undefined;
      commandPreview?: string | null | undefined;
      warningText?: string | null | undefined;
      kind: "exec";
      commandText: string;
      allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
    }
  | {
      agentId?: string | null | undefined;
      toolName?: string | null | undefined;
      pluginId?: string | null | undefined;
      kind: "plugin";
      title: string;
      description: string;
      allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
      severity: "info" | "warning" | "critical";
    }
>;
declare const validatePendingApprovalSnapshot: ProtocolValidator<{
  id: string;
  status: "pending";
  expiresAtMs: number;
  createdAtMs: number;
  urlPath: string;
  presentation:
    | {
        agentId?: string | null | undefined;
        host?: string | null | undefined;
        nodeId?: string | null | undefined;
        commandPreview?: string | null | undefined;
        warningText?: string | null | undefined;
        kind: "exec";
        commandText: string;
        allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
      }
    | {
        agentId?: string | null | undefined;
        toolName?: string | null | undefined;
        pluginId?: string | null | undefined;
        kind: "plugin";
        title: string;
        description: string;
        allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
        severity: "info" | "warning" | "critical";
      };
}>;
declare const validateAllowedApprovalSnapshot: ProtocolValidator<{
  id: string;
  status: "allowed";
  reason: "user";
  expiresAtMs: number;
  createdAtMs: number;
  urlPath: string;
  presentation:
    | {
        agentId?: string | null | undefined;
        host?: string | null | undefined;
        nodeId?: string | null | undefined;
        commandPreview?: string | null | undefined;
        warningText?: string | null | undefined;
        kind: "exec";
        commandText: string;
        allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
      }
    | {
        agentId?: string | null | undefined;
        toolName?: string | null | undefined;
        pluginId?: string | null | undefined;
        kind: "plugin";
        title: string;
        description: string;
        allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
        severity: "info" | "warning" | "critical";
      };
  decision: "allow-once" | "allow-always";
  resolvedAtMs: number;
}>;
declare const validateDeniedApprovalSnapshot: ProtocolValidator<{
  id: string;
  status: "denied";
  reason: "user" | "malformed-verdict" | "no-route" | "storage-corrupt";
  expiresAtMs: number;
  createdAtMs: number;
  urlPath: string;
  presentation:
    | {
        agentId?: string | null | undefined;
        host?: string | null | undefined;
        nodeId?: string | null | undefined;
        commandPreview?: string | null | undefined;
        warningText?: string | null | undefined;
        kind: "exec";
        commandText: string;
        allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
      }
    | {
        agentId?: string | null | undefined;
        toolName?: string | null | undefined;
        pluginId?: string | null | undefined;
        kind: "plugin";
        title: string;
        description: string;
        allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
        severity: "info" | "warning" | "critical";
      };
  decision: "deny";
  resolvedAtMs: number;
}>;
declare const validateExpiredApprovalSnapshot: ProtocolValidator<{
  id: string;
  status: "expired";
  reason: "timeout";
  expiresAtMs: number;
  createdAtMs: number;
  urlPath: string;
  presentation:
    | {
        agentId?: string | null | undefined;
        host?: string | null | undefined;
        nodeId?: string | null | undefined;
        commandPreview?: string | null | undefined;
        warningText?: string | null | undefined;
        kind: "exec";
        commandText: string;
        allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
      }
    | {
        agentId?: string | null | undefined;
        toolName?: string | null | undefined;
        pluginId?: string | null | undefined;
        kind: "plugin";
        title: string;
        description: string;
        allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
        severity: "info" | "warning" | "critical";
      };
  resolvedAtMs: number;
}>;
declare const validateCancelledApprovalSnapshot: ProtocolValidator<{
  id: string;
  status: "cancelled";
  reason: "run-aborted" | "gateway-restart";
  expiresAtMs: number;
  createdAtMs: number;
  urlPath: string;
  presentation:
    | {
        agentId?: string | null | undefined;
        host?: string | null | undefined;
        nodeId?: string | null | undefined;
        commandPreview?: string | null | undefined;
        warningText?: string | null | undefined;
        kind: "exec";
        commandText: string;
        allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
      }
    | {
        agentId?: string | null | undefined;
        toolName?: string | null | undefined;
        pluginId?: string | null | undefined;
        kind: "plugin";
        title: string;
        description: string;
        allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
        severity: "info" | "warning" | "critical";
      };
  resolvedAtMs: number;
}>;
declare const validateApprovalSnapshot: ProtocolValidator<
  | {
      id: string;
      status: "pending";
      expiresAtMs: number;
      createdAtMs: number;
      urlPath: string;
      presentation:
        | {
            agentId?: string | null | undefined;
            host?: string | null | undefined;
            nodeId?: string | null | undefined;
            commandPreview?: string | null | undefined;
            warningText?: string | null | undefined;
            kind: "exec";
            commandText: string;
            allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
          }
        | {
            agentId?: string | null | undefined;
            toolName?: string | null | undefined;
            pluginId?: string | null | undefined;
            kind: "plugin";
            title: string;
            description: string;
            allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
            severity: "info" | "warning" | "critical";
          };
    }
  | {
      id: string;
      status: "allowed";
      reason: "user";
      expiresAtMs: number;
      createdAtMs: number;
      urlPath: string;
      presentation:
        | {
            agentId?: string | null | undefined;
            host?: string | null | undefined;
            nodeId?: string | null | undefined;
            commandPreview?: string | null | undefined;
            warningText?: string | null | undefined;
            kind: "exec";
            commandText: string;
            allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
          }
        | {
            agentId?: string | null | undefined;
            toolName?: string | null | undefined;
            pluginId?: string | null | undefined;
            kind: "plugin";
            title: string;
            description: string;
            allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
            severity: "info" | "warning" | "critical";
          };
      decision: "allow-once" | "allow-always";
      resolvedAtMs: number;
    }
  | {
      id: string;
      status: "denied";
      reason: "user" | "malformed-verdict" | "no-route" | "storage-corrupt";
      expiresAtMs: number;
      createdAtMs: number;
      urlPath: string;
      presentation:
        | {
            agentId?: string | null | undefined;
            host?: string | null | undefined;
            nodeId?: string | null | undefined;
            commandPreview?: string | null | undefined;
            warningText?: string | null | undefined;
            kind: "exec";
            commandText: string;
            allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
          }
        | {
            agentId?: string | null | undefined;
            toolName?: string | null | undefined;
            pluginId?: string | null | undefined;
            kind: "plugin";
            title: string;
            description: string;
            allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
            severity: "info" | "warning" | "critical";
          };
      decision: "deny";
      resolvedAtMs: number;
    }
  | {
      id: string;
      status: "expired";
      reason: "timeout";
      expiresAtMs: number;
      createdAtMs: number;
      urlPath: string;
      presentation:
        | {
            agentId?: string | null | undefined;
            host?: string | null | undefined;
            nodeId?: string | null | undefined;
            commandPreview?: string | null | undefined;
            warningText?: string | null | undefined;
            kind: "exec";
            commandText: string;
            allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
          }
        | {
            agentId?: string | null | undefined;
            toolName?: string | null | undefined;
            pluginId?: string | null | undefined;
            kind: "plugin";
            title: string;
            description: string;
            allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
            severity: "info" | "warning" | "critical";
          };
      resolvedAtMs: number;
    }
  | {
      id: string;
      status: "cancelled";
      reason: "run-aborted" | "gateway-restart";
      expiresAtMs: number;
      createdAtMs: number;
      urlPath: string;
      presentation:
        | {
            agentId?: string | null | undefined;
            host?: string | null | undefined;
            nodeId?: string | null | undefined;
            commandPreview?: string | null | undefined;
            warningText?: string | null | undefined;
            kind: "exec";
            commandText: string;
            allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
          }
        | {
            agentId?: string | null | undefined;
            toolName?: string | null | undefined;
            pluginId?: string | null | undefined;
            kind: "plugin";
            title: string;
            description: string;
            allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
            severity: "info" | "warning" | "critical";
          };
      resolvedAtMs: number;
    }
>;
declare const validateTerminalApprovalSnapshot: ProtocolValidator<
  | {
      id: string;
      status: "allowed";
      reason: "user";
      expiresAtMs: number;
      createdAtMs: number;
      urlPath: string;
      presentation:
        | {
            agentId?: string | null | undefined;
            host?: string | null | undefined;
            nodeId?: string | null | undefined;
            commandPreview?: string | null | undefined;
            warningText?: string | null | undefined;
            kind: "exec";
            commandText: string;
            allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
          }
        | {
            agentId?: string | null | undefined;
            toolName?: string | null | undefined;
            pluginId?: string | null | undefined;
            kind: "plugin";
            title: string;
            description: string;
            allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
            severity: "info" | "warning" | "critical";
          };
      decision: "allow-once" | "allow-always";
      resolvedAtMs: number;
    }
  | {
      id: string;
      status: "denied";
      reason: "user" | "malformed-verdict" | "no-route" | "storage-corrupt";
      expiresAtMs: number;
      createdAtMs: number;
      urlPath: string;
      presentation:
        | {
            agentId?: string | null | undefined;
            host?: string | null | undefined;
            nodeId?: string | null | undefined;
            commandPreview?: string | null | undefined;
            warningText?: string | null | undefined;
            kind: "exec";
            commandText: string;
            allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
          }
        | {
            agentId?: string | null | undefined;
            toolName?: string | null | undefined;
            pluginId?: string | null | undefined;
            kind: "plugin";
            title: string;
            description: string;
            allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
            severity: "info" | "warning" | "critical";
          };
      decision: "deny";
      resolvedAtMs: number;
    }
  | {
      id: string;
      status: "expired";
      reason: "timeout";
      expiresAtMs: number;
      createdAtMs: number;
      urlPath: string;
      presentation:
        | {
            agentId?: string | null | undefined;
            host?: string | null | undefined;
            nodeId?: string | null | undefined;
            commandPreview?: string | null | undefined;
            warningText?: string | null | undefined;
            kind: "exec";
            commandText: string;
            allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
          }
        | {
            agentId?: string | null | undefined;
            toolName?: string | null | undefined;
            pluginId?: string | null | undefined;
            kind: "plugin";
            title: string;
            description: string;
            allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
            severity: "info" | "warning" | "critical";
          };
      resolvedAtMs: number;
    }
  | {
      id: string;
      status: "cancelled";
      reason: "run-aborted" | "gateway-restart";
      expiresAtMs: number;
      createdAtMs: number;
      urlPath: string;
      presentation:
        | {
            agentId?: string | null | undefined;
            host?: string | null | undefined;
            nodeId?: string | null | undefined;
            commandPreview?: string | null | undefined;
            warningText?: string | null | undefined;
            kind: "exec";
            commandText: string;
            allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
          }
        | {
            agentId?: string | null | undefined;
            toolName?: string | null | undefined;
            pluginId?: string | null | undefined;
            kind: "plugin";
            title: string;
            description: string;
            allowedDecisions: ("deny" | "allow-once" | "allow-always")[];
            severity: "info" | "warning" | "critical";
          };
      resolvedAtMs: number;
    }
>;
declare const validateApprovalGetParams: ProtocolValidator<{
  id: string;
}>;
declare const validateApprovalResolveParams: ProtocolValidator<{
  id: string;
  kind: "exec" | "plugin";
  decision: "deny" | "allow-once" | "allow-always";
}>;
declare const validateExecApprovalsGetParams: ProtocolValidator<object>;
declare const validateExecApprovalsSetParams: ProtocolValidator<{
  baseHash?: string | undefined;
  file: {
    socket?:
      | {
          token?: string | undefined;
          path?: string | undefined;
        }
      | undefined;
    defaults?:
      | {
          security?: string | undefined;
          ask?: string | undefined;
          askFallback?: string | undefined;
          autoAllowSkills?: boolean | undefined;
        }
      | undefined;
    agents?:
      | Record<
          string,
          {
            security?: string | undefined;
            ask?: string | undefined;
            askFallback?: string | undefined;
            autoAllowSkills?: boolean | undefined;
            allowlist?:
              | {
                  id?: string | undefined;
                  source?: "allow-always" | undefined;
                  commandText?: string | undefined;
                  argPattern?: string | undefined;
                  lastUsedAt?: number | undefined;
                  lastUsedCommand?: string | undefined;
                  lastResolvedPath?: string | undefined;
                  pattern: string;
                }[]
              | undefined;
          }
        >
      | undefined;
    version: 1;
  };
}>;
declare const validateExecApprovalGetParams: ProtocolValidator<{
  id: string;
}>;
declare const validateExecApprovalRequestParams: ProtocolValidator<{
  agentId?: string | null | undefined;
  id?: string | undefined;
  command?: string | undefined;
  host?: string | null | undefined;
  sessionKey?: string | null | undefined;
  cwd?: string | null | undefined;
  timeoutMs?: number | undefined;
  nodeId?: string | null | undefined;
  turnSourceChannel?: string | null | undefined;
  turnSourceTo?: string | null | undefined;
  turnSourceAccountId?: string | null | undefined;
  turnSourceThreadId?: string | number | null | undefined;
  env?: Record<string, string> | undefined;
  warningText?: string | null | undefined;
  security?: string | null | undefined;
  ask?: string | null | undefined;
  commandArgv?: string[] | undefined;
  systemRunPlan?:
    | {
        commandPreview?: string | null | undefined;
        policySnapshot?:
          | {
              security: "full" | "deny" | "allowlist";
              ask: "off" | "always" | "on-miss";
              askFallback: "full" | "deny" | "allowlist";
              autoAllowSkills: boolean;
              allowlistRules: {
                source?: "allow-always" | undefined;
                argPattern?: string | undefined;
                pattern: string;
              }[];
            }
          | undefined;
        mutableFileOperand?:
          | {
              path: string;
              sha256: string;
              argvIndex: number;
            }
          | null
          | undefined;
        agentId: string | null;
        sessionKey: string | null;
        cwd: string | null;
        argv: string[];
        commandText: string;
      }
    | undefined;
  unavailableDecisions?: string[] | undefined;
  commandSpans?:
    | {
        startIndex: number;
        endIndex: number;
      }[]
    | undefined;
  resolvedPath?: string | null | undefined;
  approvalReviewerDeviceIds?: string[] | undefined;
  requireDeliveryRoute?: boolean | undefined;
  suppressDelivery?: boolean | undefined;
  twoPhase?: boolean | undefined;
}>;
declare const validateExecApprovalResolveParams: ProtocolValidator<{
  id: string;
  decision: string;
}>;
declare const validatePluginApprovalRequestParams: ProtocolValidator<{
  agentId?: string | undefined;
  toolCallId?: string | undefined;
  toolName?: string | undefined;
  sessionKey?: string | undefined;
  timeoutMs?: number | undefined;
  pluginId?: string | undefined;
  turnSourceChannel?: string | undefined;
  turnSourceTo?: string | undefined;
  turnSourceAccountId?: string | undefined;
  turnSourceThreadId?: string | number | undefined;
  allowedDecisions?: string[] | undefined;
  severity?: string | undefined;
  approvalReviewerDeviceIds?: string[] | undefined;
  twoPhase?: boolean | undefined;
  title: string;
  description: string;
}>;
declare const validatePluginApprovalResolveParams: ProtocolValidator<{
  id: string;
  decision: string;
}>;
declare const validatePluginsListParams: ProtocolValidator<object>;
declare const validatePluginsListResult: ProtocolValidator<{
  diagnostics: unknown[];
  plugins: {
    version?: string | undefined;
    error?: string | undefined;
    kind?: string[] | undefined;
    description?: string | undefined;
    category?: string | undefined;
    order?: number | undefined;
    packageName?: string | undefined;
    origin?: string | undefined;
    featured?: boolean | undefined;
    install?:
      | {
          source: "clawhub";
          packageName: string;
        }
      | {
          source: "official";
          pluginId: string;
        }
      | undefined;
    removable?: boolean | undefined;
    id: string;
    name: string;
    state: "error" | "enabled" | "disabled" | "not-installed";
    enabled: boolean;
    installed: boolean;
  }[];
  mutationAllowed: boolean;
}>;
declare const validatePluginsSearchParams: ProtocolValidator<{
  limit?: number | undefined;
  query: string;
}>;
declare const validatePluginsSearchResult: ProtocolValidator<{
  results: {
    score: number;
    package: {
      summary?: string | undefined;
      latestVersion?: string | undefined;
      runtimeId?: string | undefined;
      downloads?: number | undefined;
      verificationTier?: string | undefined;
      displayName: string;
      name: string;
      channel: "official" | "community" | "private";
      family: "code-plugin" | "bundle-plugin";
      isOfficial: boolean;
    };
  }[];
}>;
declare const validatePluginsInstallParams: ProtocolValidator<
  | {
      version?: string | undefined;
      acknowledgeClawHubRisk?: boolean | undefined;
      source: "clawhub";
      packageName: string;
    }
  | {
      source: "official";
      pluginId: string;
    }
>;
declare const validatePluginsInstallResult: ProtocolValidator<{
  warnings?: string[] | undefined;
  plugin: {
    version?: string | undefined;
    error?: string | undefined;
    kind?: string[] | undefined;
    description?: string | undefined;
    category?: string | undefined;
    order?: number | undefined;
    packageName?: string | undefined;
    origin?: string | undefined;
    featured?: boolean | undefined;
    install?:
      | {
          source: "clawhub";
          packageName: string;
        }
      | {
          source: "official";
          pluginId: string;
        }
      | undefined;
    removable?: boolean | undefined;
    id: string;
    name: string;
    state: "error" | "enabled" | "disabled" | "not-installed";
    enabled: boolean;
    installed: boolean;
  };
  ok: true;
  restartRequired: true;
}>;
declare const validatePluginsSetEnabledParams: ProtocolValidator<{
  pluginId: string;
  enabled: boolean;
}>;
declare const validatePluginsSetEnabledResult: ProtocolValidator<{
  warnings?: string[] | undefined;
  plugin: {
    version?: string | undefined;
    error?: string | undefined;
    kind?: string[] | undefined;
    description?: string | undefined;
    category?: string | undefined;
    order?: number | undefined;
    packageName?: string | undefined;
    origin?: string | undefined;
    featured?: boolean | undefined;
    install?:
      | {
          source: "clawhub";
          packageName: string;
        }
      | {
          source: "official";
          pluginId: string;
        }
      | undefined;
    removable?: boolean | undefined;
    id: string;
    name: string;
    state: "error" | "enabled" | "disabled" | "not-installed";
    enabled: boolean;
    installed: boolean;
  };
  ok: true;
  restartRequired: boolean;
}>;
declare const validatePluginsUninstallParams: ProtocolValidator<{
  pluginId: string;
}>;
declare const validatePluginsUninstallResult: ProtocolValidator<{
  warnings?: string[] | undefined;
  ok: true;
  pluginId: string;
  restartRequired: true;
  removed: string[];
}>;
declare const validatePluginsUiDescriptorsParams: ProtocolValidator<object>;
declare const validatePluginsUiDescriptorsResult: ProtocolValidator<{
  ok: true;
  descriptors: {
    description?: string | undefined;
    placement?: string | undefined;
    schema?: unknown;
    pluginName?: string | undefined;
    requiredScopes?: string[] | undefined;
    id: string;
    label: string;
    pluginId: string;
    surface: "tool" | "session" | "run" | "settings";
  }[];
}>;
declare const validatePluginsSessionActionParams: ProtocolValidator<{
  payload?: unknown;
  sessionKey?: string | undefined;
  pluginId: string;
  actionId: string;
}>;
declare const validatePluginsSessionActionResult: ProtocolValidator<
  | {
      result?: unknown;
      reply?: unknown;
      continueAgent?: boolean | undefined;
      ok: true;
    }
  | {
      code?: string | undefined;
      details?: unknown;
      error: string;
      ok: false;
    }
>;
declare const validateExecApprovalsNodeGetParams: ProtocolValidator<{
  nodeId: string;
}>;
declare const validateExecApprovalsNodeSetParams: ProtocolValidator<{
  native?:
    | {
        defaultAction?: "allow" | "deny" | "prompt" | undefined;
        rules: {
          description?: string | undefined;
          enabled?: boolean | undefined;
          shells?: string[] | undefined;
          action: "allow" | "deny" | "prompt";
          pattern: string;
        }[];
      }
    | undefined;
  file?:
    | {
        socket?:
          | {
              token?: string | undefined;
              path?: string | undefined;
            }
          | undefined;
        defaults?:
          | {
              security?: string | undefined;
              ask?: string | undefined;
              askFallback?: string | undefined;
              autoAllowSkills?: boolean | undefined;
            }
          | undefined;
        agents?:
          | Record<
              string,
              {
                security?: string | undefined;
                ask?: string | undefined;
                askFallback?: string | undefined;
                autoAllowSkills?: boolean | undefined;
                allowlist?:
                  | {
                      id?: string | undefined;
                      source?: "allow-always" | undefined;
                      commandText?: string | undefined;
                      argPattern?: string | undefined;
                      lastUsedAt?: number | undefined;
                      lastUsedCommand?: string | undefined;
                      lastResolvedPath?: string | undefined;
                      pattern: string;
                    }[]
                  | undefined;
              }
            >
          | undefined;
        version: 1;
      }
    | undefined;
  baseHash?: string | undefined;
  nodeId: string;
}>;
declare const validateExecApprovalsNodeSnapshot: ProtocolValidator<{
  message?: string | undefined;
  file?:
    | {
        socket?:
          | {
              token?: string | undefined;
              path?: string | undefined;
            }
          | undefined;
        defaults?:
          | {
              security?: string | undefined;
              ask?: string | undefined;
              askFallback?: string | undefined;
              autoAllowSkills?: boolean | undefined;
            }
          | undefined;
        agents?:
          | Record<
              string,
              {
                security?: string | undefined;
                ask?: string | undefined;
                askFallback?: string | undefined;
                autoAllowSkills?: boolean | undefined;
                allowlist?:
                  | {
                      id?: string | undefined;
                      source?: "allow-always" | undefined;
                      commandText?: string | undefined;
                      argPattern?: string | undefined;
                      lastUsedAt?: number | undefined;
                      lastUsedCommand?: string | undefined;
                      lastResolvedPath?: string | undefined;
                      pattern: string;
                    }[]
                  | undefined;
              }
            >
          | undefined;
        version: 1;
      }
    | undefined;
  path?: string | undefined;
  baseHash?: string | undefined;
  enabled?: boolean | undefined;
  defaultAction?: "allow" | "deny" | "prompt" | undefined;
  rules?:
    | {
        description?: string | undefined;
        enabled?: boolean | undefined;
        shells?: string[] | undefined;
        action: "allow" | "deny" | "prompt";
        pattern: string;
      }[]
    | undefined;
  exists?: boolean | undefined;
  hash?: string | undefined;
  resolvedDefaults?:
    | {
        security: "full" | "deny" | "allowlist";
        ask: "off" | "always" | "on-miss";
        askFallback: "full" | "deny" | "allowlist";
        autoAllowSkills: boolean;
      }
    | undefined;
  constraints?:
    | {
        baseHashRequired?: boolean | undefined;
        defaultAllowAllowed?: boolean | undefined;
        broadAllowRulesAllowed?: boolean | undefined;
        dangerousAllowRulesAllowed?: boolean | undefined;
      }
    | undefined;
}>;
declare const validateLogsTailParams: ProtocolValidator<{
  limit?: number | undefined;
  cursor?: number | undefined;
  maxBytes?: number | undefined;
}>;
declare const validateTerminalOpenParams: ProtocolValidator<{
  agentId?: string | undefined;
  catalog?:
    | {
        threadId: string;
        catalogId: string;
        hostId: string;
      }
    | undefined;
  cols: number;
  rows: number;
}>;
declare const validateTerminalInputParams: ProtocolValidator<{
  sessionId: string;
  data: string;
}>;
declare const validateTerminalResizeParams: ProtocolValidator<{
  sessionId: string;
  cols: number;
  rows: number;
}>;
declare const validateTerminalCloseParams: ProtocolValidator<{
  sessionId: string;
}>;
declare const validateTerminalAttachParams: ProtocolValidator<{
  sessionId: string;
}>;
declare const validateTerminalTextParams: ProtocolValidator<{
  sessionId: string;
}>;
declare const validateTerminalEvent: ProtocolValidator<
  | {
      sessionId: string;
      seq: number;
      data: string;
    }
  | {
      error?: string | undefined;
      reason?: "error" | "process_exit" | "closed" | "disconnected" | "detached" | undefined;
      exitCode?: number | null | undefined;
      signal?: number | null | undefined;
      sessionId: string;
    }
>;
declare const validateModelsProbeParams: ProtocolValidator<{
  timeoutMs?: number | undefined;
  profileId?: string | undefined;
  provider: string;
}>;
declare const validateChatHistoryParams: ProtocolValidator<{
  agentId?: string | undefined;
  sessionId?: string | undefined;
  limit?: number | undefined;
  offset?: number | undefined;
  messageId?: string | undefined;
  maxChars?: number | undefined;
  sessionKey: string;
}>;
declare const validateChatMetadataParams: ProtocolValidator<{
  agentId?: string | undefined;
}>;
declare const validateChatMessageGetParams: ProtocolValidator<{
  agentId?: string | undefined;
  maxChars?: number | undefined;
  sessionKey: string;
  messageId: string;
}>;
declare const validateChatToolTitlesParams: ProtocolValidator<{
  agentId?: string | undefined;
  items: {
    id: string;
    name: string;
    input: string;
  }[];
  sessionKey: string;
}>;
declare const validateChatSendParams: ProtocolValidator<{
  agentId?: string | undefined;
  sessionId?: string | undefined;
  thinking?: string | undefined;
  deliver?: boolean | undefined;
  attachments?: unknown[] | undefined;
  timeoutMs?: number | undefined;
  fastMode?: boolean | "auto" | undefined;
  fastAutoOnSeconds?: number | undefined;
  originatingChannel?: string | undefined;
  originatingTo?: string | undefined;
  originatingAccountId?: string | undefined;
  originatingThreadId?: string | undefined;
  systemInputProvenance?:
    | {
        originSessionId?: string | undefined;
        sourceSessionKey?: string | undefined;
        sourceChannel?: string | undefined;
        sourceTool?: string | undefined;
        kind: string;
      }
    | undefined;
  systemProvenanceReceipt?: string | undefined;
  suppressCommandInterpretation?: boolean | undefined;
  expectedSessionRoutingContract?: string | undefined;
  message: string;
  sessionKey: string;
  idempotencyKey: string;
}>;
declare const validateChatAbortParams: ProtocolValidator<{
  agentId?: string | undefined;
  runId?: string | undefined;
  preserveSideRuns?: boolean | undefined;
  sessionKey: string;
}>;
declare const validateChatInjectParams: ProtocolValidator<{
  agentId?: string | undefined;
  label?: string | undefined;
  message: string;
  sessionKey: string;
}>;
declare const validateChatEvent: ProtocolValidator<
  | {
      agentId?: string | undefined;
      message?: unknown;
      usage?: unknown;
      replace?: boolean | undefined;
      spawnedBy?: string | undefined;
      runId: string;
      seq: number;
      state: "delta";
      sessionKey: string;
      deltaText: string;
    }
  | {
      agentId?: string | undefined;
      message?: unknown;
      usage?: unknown;
      stopReason?: string | undefined;
      spawnedBy?: string | undefined;
      runId: string;
      seq: number;
      state: "final";
      sessionKey: string;
    }
  | {
      agentId?: string | undefined;
      message?: unknown;
      stopReason?: string | undefined;
      errorMessage?: string | undefined;
      spawnedBy?: string | undefined;
      runId: string;
      seq: number;
      state: "aborted";
      sessionKey: string;
    }
  | {
      agentId?: string | undefined;
      message?: unknown;
      usage?: unknown;
      stopReason?: string | undefined;
      errorMessage?: string | undefined;
      spawnedBy?: string | undefined;
      errorKind?: "unknown" | "rate_limit" | "timeout" | "refusal" | "context_length" | undefined;
      runId: string;
      seq: number;
      state: "error";
      sessionKey: string;
    }
>;
declare const validateChatMessageGetResult: ProtocolValidator<{
  message?: unknown;
  unavailableReason?: "not_found" | "oversized" | "not_visible" | undefined;
  ok: boolean;
}>;
declare const validateUpdateStatusParams: ProtocolValidator<object>;
declare const validateUpdateRunParams: ProtocolValidator<{
  sessionKey?: string | undefined;
  timeoutMs?: number | undefined;
  deliveryContext?:
    | {
        channel?: string | undefined;
        accountId?: string | undefined;
        to?: string | undefined;
        threadId?: string | number | undefined;
      }
    | undefined;
  note?: string | undefined;
  restartDelayMs?: number | undefined;
  continuationMessage?: string | undefined;
}>;
declare const validateWebLoginStartParams: ProtocolValidator<{
  accountId?: string | undefined;
  timeoutMs?: number | undefined;
  force?: boolean | undefined;
  verbose?: boolean | undefined;
}>;
declare const validateWebLoginWaitParams: ProtocolValidator<{
  accountId?: string | undefined;
  timeoutMs?: number | undefined;
  currentQrDataUrl?: string | undefined;
}>;
type SessionsPatchResult = {
  ok: true;
  path: string;
  key: string;
  entry: Record<string, unknown>;
  resolved?: {
    modelProvider?: string;
    model?: string;
    agentRuntime?: GatewayAgentRuntime;
    thinkingLevel?: string;
    thinkingLevels?: Array<{
      id: string;
      label: string;
    }>;
  };
};
type GatewayAgentRuntime = {
  id: string;
  fallback?: "openclaw" | "none";
  source:
    | "env"
    | "agent"
    | "defaults"
    | "model"
    | "provider"
    | "implicit"
    | "session"
    | "session-key";
};
//#endregion
export {
  validateCrestodianSetupAuthStartParams as $,
  WorkerInferenceTerminalParams as $_,
  PluginsInstallResult as $a,
  NodeSkillDescriptorSchema as $c,
  ConfigSchemaParamsSchema as $d,
  TalkSessionCloseParams as $f,
  MigrationsMemoryPlanParams as $g,
  SkillsSecurityVerdictsResult as $h,
  validateWorkerTranscriptCommitParams as $i,
  ExecApprovalRequestParamsSchema as $l,
  AuthProbeStatusSchema as $m,
  validateSessionsDispatchParams as $n,
  TaskSummary as $o,
  ArtifactsDownloadParams as $p,
  validateTalkModeParams as $r,
  PushTestParamsSchema as $s,
  validateNodeListParams as $t,
  TickEvent as $u,
  WorkerProtocolCloseReason as $v,
  SessionApprovalEvent as $y,
  validateChannelsStartParams as A,
  WorkerInferenceErrorShapeSchema as A_,
  WizardCancelParams as Aa,
  NodePairRejectParamsSchema as Ac,
  CrestodianSetupActivateResult as Ad,
  TalkCatalogResultSchema as Af,
  AgentParamsSchema as Ag,
  SkillsProposalInspectParamsSchema as Ah,
  validateTerminalTextParams as Ai,
  GatewaySuspendStatusParams as Al,
  AgentsFileEntry as Am,
  validatePluginsUninstallResult as An,
  TerminalCloseParamsSchema as Ao,
  WebLoginWaitParamsSchema as Ap,
  validateSkillsProposalUpdateParams as Ar,
  TaskSuggestionsDismissResultSchema as As,
  validateExecApprovalsNodeSetParams as At,
  WorkerEnvironmentState as Au,
  WorkerErrorShape as Av,
  ApprovalPresentationSchema as Ay,
  validateChatSendParams as B,
  WorkerInferenceResolvedModelSchema as B_,
  WizardStatusParams as Ba,
  NodePendingEnqueueResult as Bc,
  CrestodianSetupVerifyParams as Bd,
  TalkClientToolCallResultSchema as Bf,
  MAX_MEMORY_MIGRATION_ITEMS as Bg,
  SkillsProposalReviseParamsSchema as Bh,
  validateWebLoginWaitParams as Bi,
  FsListDirParams as Bl,
  AgentsFilesSetParams as Bm,
  validateSessionsCatalogContinueParams as Bn,
  TerminalListResultSchema as Bo,
  AuditActivityEventV1Schema as Bp,
  validateSystemInfoParams as Br,
  PresenceEntrySchema as Bs,
  validateGatewaySuspendStatusParams as Bt,
  EventFrame as Bu,
  WorkerLiveEventErrorDetails as Bv,
  CancelledApprovalSnapshotSchema as By,
  validateArtifactsDownloadParams as C,
  WorkerInferenceCancelResult as C_,
  WorktreesListResultSchema as Ca,
  NodeListParams as Cc,
  CronUpdateParamsSchema as Cd,
  ChannelsStopParams as Cf,
  ToolsInvokeResult as Cg,
  SkillsProposalActionParams as Ch,
  validateTerminalApprovalSnapshot as Ci,
  GatewaySuspendPrepareReadyResultSchema as Cl,
  AgentsCreateParamsSchema as Cm,
  validatePluginsSessionActionParams as Cn,
  TerminalAckResult as Co,
  TtsSpeakParams as Cp,
  validateSkillsDetailParams as Cr,
  TaskSuggestionsCreateParams as Cs,
  validateEventFrame as Ct,
  EnvironmentsListResultSchema as Cu,
  WorkerAdmissionHandshake as Cv,
  ApprovalGetParams as Cy,
  validateAuditListParams as D,
  WorkerInferenceErrorReason as D_,
  WorktreesRemoveResultSchema as Da,
  NodePairListParams as Dc,
  CrestodianChatResultSchema as Dd,
  TalkCatalogParams as Df,
  AgentIdentityParamsSchema as Dg,
  SkillsProposalCreateParams as Dh,
  validateTerminalInputParams as Di,
  GatewaySuspendResumeParamsSchema as Dl,
  AgentsDeleteParamsSchema as Dm,
  validatePluginsUiDescriptorsParams as Dn,
  TerminalAttachResult as Do,
  WebLoginStartParams as Dp,
  validateSkillsProposalInspectParams as Dr,
  TaskSuggestionsDismissParams as Ds,
  validateExecApprovalResolveParams as Dt,
  EnvironmentsStatusResultSchema as Du,
  WorkerConnectParams as Dv,
  ApprovalKind as Dy,
  validateAuditActivityListParams as E,
  WorkerInferenceContextSchema as E_,
  WorktreesRemoveResult as Ea,
  NodePairApproveParamsSchema as Ec,
  CrestodianChatResult as Ed,
  TalkAgentControlResultSchema as Ef,
  AgentIdentityParams as Eg,
  SkillsProposalApplyResultSchema as Eh,
  validateTerminalEvent as Ei,
  GatewaySuspendResumeParams as El,
  AgentsDeleteParams as Em,
  validatePluginsSetEnabledResult as En,
  TerminalAttachParamsSchema as Eo,
  TtsSpeakResultSchema as Ep,
  validateSkillsProposalCreateParams as Er,
  TaskSuggestionsCreateResultSchema as Es,
  validateExecApprovalRequestParams as Et,
  EnvironmentsStatusResult as Eu,
  WorkerAdmissionResponseFrameSchema as Ev,
  ApprovalGetResultSchema as Ey,
  validateChatHistoryParams as F,
  WorkerInferenceModelRef as F_,
  WizardNextResultSchema as Fa,
  NodePendingDrainParamsSchema as Fc,
  CrestodianSetupAuthStartResultSchema as Fd,
  TalkClientSteerParams as Ff,
  SendParamsSchema as Fg,
  SkillsProposalRequestRevisionParams as Fh,
  validateTtsSpeakResult as Fi,
  GatewaySuspendStatusRunningResultSchema as Fl,
  AgentsFilesGetResultSchema as Fm,
  validateSecretsResolveParams as Fn,
  TerminalExitEvent as Fo,
  AuditListResult as Fp,
  validateSkillsStatusParams as Fr,
  SystemInfoParams as Fs,
  validateFsListDirResult as Ft,
  errorShape as Fu,
  WorkerHeartbeatResponseFrame as Fv,
  ApprovalSnapshot as Fy,
  validateConfigPatchParams as G,
  WorkerInferenceStartResponseFrame as G_,
  WizardStepSchema as Ga,
  NodePluginToolsUpdateParamsSchema as Gc,
  ConfigApplyParamsSchema as Gd,
  TalkEventSchema as Gf,
  MemoryMigrationProviderPlan as Gg,
  SkillsProposalsListResult as Gh,
  validateWizardCancelParams as Gi,
  DevicePairListParams as Gl,
  AgentsListParamsSchema as Gm,
  validateSessionsCompactionBranchParams as Gn,
  TerminalResizeParams as Go,
  AuditActivityListResult as Gp,
  validateTalkClientCreateParams as Gr,
  SessionPlacement as Gs,
  validateModelsProbeParams as Gt,
  HelloOk as Gu,
  WorkerLiveEventParamsSchema as Gv,
  ExpiredApprovalSnapshot as Gy,
  validateCommandsListParams as H,
  WorkerInferenceStartParamsSchema as H_,
  WizardStatusResult as Ha,
  NodePluginToolDescriptor as Hc,
  CrestodianSetupVerifyResult as Hd,
  TalkConfigParamsSchema as Hf,
  MemoryMigrationItemSchema as Hg,
  SkillsProposalUpdateParamsSchema as Hh,
  validateWebPushTestParams as Hi,
  FsListDirResult as Hl,
  AgentsFilesSetResult as Hm,
  validateSessionsCatalogReadParams as Hn,
  TerminalOpenParamsSchema as Ho,
  AuditActivityInboundMessageV1Schema as Hp,
  validateTalkAgentControlResult as Hr,
  SnapshotSchema as Hs,
  validateLogsTailParams as Ht,
  GATEWAY_SERVER_CAPS as Hu,
  WorkerLiveEventErrorShape as Hv,
  DeniedApprovalSnapshotSchema as Hy,
  validateChatInjectParams as I,
  WorkerInferenceModelRefSchema as I_,
  WizardStartParams as Ia,
  NodePendingDrainResult as Ic,
  CrestodianSetupDetectParams as Id,
  TalkClientSteerParamsSchema as If,
  WakeParams as Ig,
  SkillsProposalRequestRevisionParamsSchema as Ih,
  validateUpdateRunParams as Ii,
  GatewaySuspendTaskBlocker as Il,
  AgentsFilesListParams as Im,
  validateSecretsResolveResult as In,
  TerminalExitEventSchema as Io,
  AuditListResultSchema as Ip,
  validateSkillsUpdateParams as Ir,
  SystemInfoParamsSchema as Is,
  validateGatewaySuspendPrepareParams as It,
  ConnectParams as Iu,
  WorkerHeartbeatResponseFrameSchema as Iv,
  ApprovalSnapshotSchema as Iy,
  validateConfigSchemaParams as J,
  WorkerInferenceStartResultSchema as J_,
  PluginCatalogInstallActionSchema as Ja,
  NodePresenceAlivePayload as Jc,
  ConfigPatchParams as Jd,
  TalkSessionAppendAudioParamsSchema as Jf,
  MigrationProtocolSchemas as Jg,
  SkillsSearchParamsSchema as Jh,
  validateWizardStatusParams as Ji,
  DevicePairSetupCodeParams as Jl,
  AgentsUpdateParams as Jm,
  validateSessionsCompactionRestoreParams as Jn,
  TerminalSessionInfoSchema as Jo,
  AuditActivityOutboundMessageV1Schema as Jp,
  validateTalkClientToolCallParams as Jr,
  SessionPlacementStateSchema as Js,
  validateNodeEventResult as Jt,
  RequestFrameSchema as Ju,
  WorkerLiveEventResponseFrame as Jv,
  PendingApprovalSnapshotSchema as Jy,
  validateConfigSchemaLookupParams as K,
  WorkerInferenceStartResponseFrameSchema as K_,
  PluginCatalogEntry as Ka,
  NodePresenceActivityPayload as Kc,
  ConfigGetParams as Kd,
  TalkModeParams as Kf,
  MemoryMigrationProviderPlanSchema as Kg,
  SkillsProposalsListResultSchema as Kh,
  validateWizardNextParams as Ki,
  DevicePairRejectParams as Kl,
  AgentsListResult as Km,
  validateSessionsCompactionGetParams as Kn,
  TerminalResizeParamsSchema as Ko,
  AuditActivityListResultSchema as Kp,
  validateTalkClientCreateResult as Kr,
  SessionPlacementSchema as Ks,
  validateNodeDescribeParams as Kt,
  HelloOkSchema as Ku,
  WorkerLiveEventRequestFrame as Kv,
  ExpiredApprovalSnapshotSchema as Ky,
  validateChatMessageGetParams as L,
  WorkerInferenceOptions as L_,
  WizardStartParamsSchema as La,
  NodePendingDrainResultSchema as Lc,
  CrestodianSetupDetectParamsSchema as Ld,
  TalkClientToolCallParams as Lf,
  WakeParamsSchema as Lg,
  SkillsProposalRequestRevisionResult as Lh,
  validateUpdateStatusParams as Li,
  GatewaySuspendTaskBlockerSchema as Ll,
  AgentsFilesListParamsSchema as Lm,
  validateSendParams as Ln,
  TerminalInputParams as Lo,
  AuditActivityAgentRunV1 as Lp,
  validateSkillsUploadBeginParams as Lr,
  SystemInfoResult as Ls,
  validateGatewaySuspendPrepareResult as Lt,
  ConnectParamsSchema as Lu,
  WorkerHeartbeatResult as Lv,
  ApprovalTerminalReason as Ly,
  validateChannelsStopParams as M,
  WorkerInferenceEventFrameSchema as M_,
  WizardNextParams as Ma,
  NodePairRemoveParamsSchema as Mc,
  CrestodianSetupAuthStartParams as Md,
  TalkClientCreateParamsSchema as Mf,
  MessageActionParamsSchema as Mg,
  SkillsProposalInspectResultSchema as Mh,
  validateToolsEffectiveParams as Mi,
  GatewaySuspendStatusReadyResultSchema as Ml,
  AgentsFilesGetParams as Mm,
  validatePushTestParams as Mn,
  TerminalDataEventSchema as Mo,
  AuditEventSchema as Mp,
  validateSkillsSearchParams as Mr,
  TaskSuggestionsListParamsSchema as Ms,
  validateExecApprovalsSetParams as Mt,
  WorkerTunnelStatus as Mu,
  WorkerHeartbeatParamsSchema as Mv,
  ApprovalResolveParamsSchema as My,
  validateChatAbortParams as N,
  WorkerInferenceEventParams as N_,
  WizardNextParamsSchema as Na,
  NodePendingAckParamsSchema as Nc,
  CrestodianSetupAuthStartParamsSchema as Nd,
  TalkClientCreateResult as Nf,
  PollParams as Ng,
  SkillsProposalRecordResult as Nh,
  validateToolsInvokeParams as Ni,
  GatewaySuspendStatusResult as Nl,
  AgentsFilesGetParamsSchema as Nm,
  validateRequestFrame as Nn,
  TerminalEvent as No,
  AuditListParams as Np,
  validateSkillsSecurityVerdictsParams as Nr,
  TaskSuggestionsListResult as Ns,
  validateExpiredApprovalSnapshot as Nt,
  WorkerTunnelStatusSchema as Nu,
  WorkerHeartbeatRequestFrame as Nv,
  ApprovalResolveResult as Ny,
  validateCancelledApprovalSnapshot as O,
  WorkerInferenceErrorReasonSchema as O_,
  WorktreesRestoreParams as Oa,
  NodePairListParamsSchema as Oc,
  CrestodianSetupActivateParams as Od,
  TalkCatalogParamsSchema as Of,
  AgentIdentityResult as Og,
  SkillsProposalCreateParamsSchema as Oh,
  validateTerminalOpenParams as Oi,
  GatewaySuspendResumeResult as Ol,
  AgentsDeleteResult as Om,
  validatePluginsUiDescriptorsResult as On,
  TerminalAttachResultSchema as Oo,
  WebLoginStartParamsSchema as Op,
  validateSkillsProposalRequestRevisionParams as Or,
  TaskSuggestionsDismissParamsSchema as Os,
  validateExecApprovalsGetParams as Ot,
  WorkerEnvironmentMetadata as Ou,
  WorkerConnectRequestFrame as Ov,
  ApprovalKindSchema as Oy,
  validateChatEvent as P,
  WorkerInferenceEventParamsSchema as P_,
  WizardNextResult as Pa,
  NodePendingDrainParams as Pc,
  CrestodianSetupAuthStartResult as Pd,
  TalkClientCreateResultSchema as Pf,
  PollParamsSchema as Pg,
  SkillsProposalRecordResultSchema as Ph,
  validateTtsSpeakParams as Pi,
  GatewaySuspendStatusResultSchema as Pl,
  AgentsFilesGetResult as Pm,
  validateResponseFrame as Pn,
  TerminalEventSchema as Po,
  AuditListParamsSchema as Pp,
  validateSkillsSkillCardParams as Pr,
  TaskSuggestionsListResultSchema as Ps,
  validateFsListDirParams as Pt,
  ErrorCodes as Pu,
  WorkerHeartbeatRequestFrameSchema as Pv,
  ApprovalResolveResultSchema as Py,
  validateCrestodianSetupActivateParams as Q,
  WorkerInferenceTerminalOutcomeSchema as Q_,
  PluginsInstallParamsSchema as Qa,
  NodeSkillDescriptor as Qc,
  ConfigSchemaParams as Qd,
  TalkSessionCancelTurnParamsSchema as Qf,
  MigrationsMemoryApplyResultSchema as Qg,
  SkillsSecurityVerdictsParamsSchema as Qh,
  validateWorkerLiveEventParams as Qi,
  ExecApprovalRequestParams as Ql,
  AuthProbeStatus as Qm,
  validateSessionsDiffParams as Qn,
  TerminalTextResultSchema as Qo,
  ArtifactSummarySchema as Qp,
  validateTalkEvent as Qr,
  SessionsDispatchResultSchema as Qs,
  validateNodeInvokeResultParams as Qt,
  ShutdownEventSchema as Qu,
  WorkerLiveEventSchema as Qv,
  PluginApprovalSeveritySchema as Qy,
  validateChatMessageGetResult as R,
  WorkerInferenceOptionsSchema as R_,
  WizardStartResult as Ra,
  NodePendingEnqueueParams as Rc,
  CrestodianSetupDetectResult as Rd,
  TalkClientToolCallParamsSchema as Rf,
  validateMigrationsMemoryApplyParams as Rg,
  SkillsProposalRequestRevisionResultSchema as Rh,
  validateWakeParams as Ri,
  FsDirEntry as Rl,
  AgentsFilesListResult as Rm,
  validateSessionsAbortParams as Rn,
  TerminalInputParamsSchema as Ro,
  AuditActivityAgentRunV1Schema as Rp,
  validateSkillsUploadChunkParams as Rr,
  SystemInfoResultSchema as Rs,
  validateGatewaySuspendResumeParams as Rt,
  ErrorShape as Ru,
  WorkerHelloOk as Rv,
  ApprovalTerminalReasonSchema as Ry,
  validateApprovalTerminalReason as S,
  WorkerInferenceCancelResponseFrameSchema as S_,
  WorktreesListResult as Sa,
  NodeInvokeResultParams as Sc,
  CronUpdateParams as Sd,
  ChannelsStatusResultSchema as Sf,
  ToolsInvokeParamsSchema as Sg,
  SkillsInstallParamsSchema as Sh,
  validateTasksListParams as Si,
  GatewaySuspendPrepareParamsSchema as Sl,
  AgentsCreateParams as Sm,
  validatePluginsSearchResult as Sn,
  PluginsUninstallResultSchema as So,
  TalkSpeakResultSchema as Sp,
  validateSkillsCuratorStatusParams as Sr,
  TaskSuggestionsAcceptResultSchema as Ss,
  validateEnvironmentsStatusParams as St,
  EnvironmentsListResult as Su,
  WorkerAdmissionFailureReasonSchema as Sv,
  ApprovalDecisionSchema as Sy,
  validateArtifactsListParams as T,
  WorkerInferenceContext as T_,
  WorktreesRemoveParamsSchema as Ta,
  NodePairApproveParams as Tc,
  CrestodianChatParamsSchema as Td,
  TalkAgentControlResult as Tf,
  AgentEventSchema as Tg,
  SkillsProposalApplyResult as Th,
  validateTerminalCloseParams as Ti,
  GatewaySuspendPrepareResultSchema as Tl,
  AgentsCreateResultSchema as Tm,
  validatePluginsSetEnabledParams as Tn,
  TerminalAttachParams as To,
  TtsSpeakResult as Tp,
  validateSkillsProposalActionParams as Tr,
  TaskSuggestionsCreateResult as Ts,
  validateExecApprovalPresentation as Tt,
  EnvironmentsStatusParamsSchema as Tu,
  WorkerAdmissionResponseFrame as Tv,
  ApprovalGetResult as Ty,
  validateConfigApplyParams as U,
  WorkerInferenceStartRequestFrame as U_,
  WizardStatusResultSchema as Ua,
  NodePluginToolDescriptorSchema as Uc,
  CrestodianSetupVerifyResultSchema as Ud,
  TalkConfigResult as Uf,
  MemoryMigrationItemStatus as Ug,
  SkillsProposalsListParams as Uh,
  validateWebPushUnsubscribeParams as Ui,
  FsListDirResultSchema as Ul,
  AgentsFilesSetResultSchema as Um,
  validateSessionsCleanupParams as Un,
  TerminalOpenResult as Uo,
  AuditActivityListParams as Up,
  validateTalkCatalogParams as Ur,
  StateVersion as Us,
  validateMessageActionParams as Ut,
  GatewayFrame as Uu,
  WorkerLiveEventErrorShapeSchema as Uv,
  ExecApprovalPresentation as Uy,
  validateChatToolTitlesParams as V,
  WorkerInferenceStartParams as V_,
  WizardStatusParamsSchema as Va,
  NodePendingEnqueueResultSchema as Vc,
  CrestodianSetupVerifyParamsSchema as Vd,
  TalkConfigParams as Vf,
  MemoryMigrationItem as Vg,
  SkillsProposalUpdateParams as Vh,
  validateWebPushSubscribeParams as Vi,
  FsListDirParamsSchema as Vl,
  AgentsFilesSetParamsSchema as Vm,
  validateSessionsCatalogListParams as Vn,
  TerminalOpenParams as Vo,
  AuditActivityInboundMessageV1 as Vp,
  validateSystemInfoResult as Vr,
  Snapshot as Vs,
  validateGatewaySuspendStatusResult as Vt,
  EventFrameSchema as Vu,
  WorkerLiveEventErrorDetailsSchema as Vv,
  DeniedApprovalSnapshot as Vy,
  validateConfigGetParams as W,
  WorkerInferenceStartRequestFrameSchema as W_,
  WizardStep as Wa,
  NodePluginToolsUpdateParams as Wc,
  ConfigApplyParams as Wd,
  TalkConfigResultSchema as Wf,
  MemoryMigrationItemStatusSchema as Wg,
  SkillsProposalsListParamsSchema as Wh,
  validateWebPushVapidPublicKeyParams as Wi,
  DevicePairApproveParams as Wl,
  AgentsListParams as Wm,
  validateSessionsCompactParams as Wn,
  TerminalOpenResultSchema as Wo,
  AuditActivityListParamsSchema as Wp,
  validateTalkCatalogResult as Wr,
  StateVersionSchema as Ws,
  validateModelsListParams as Wt,
  GatewayFrameSchema as Wu,
  WorkerLiveEventParams as Wv,
  ExecApprovalPresentationSchema as Wy,
  validateConnectParams as X,
  WorkerInferenceTerminalFrameSchema as X_,
  PluginSearchResultEntrySchema as Xa,
  NodePresenceAliveReason as Xc,
  ConfigSchemaLookupParamsSchema as Xd,
  TalkSessionCancelOutputParamsSchema as Xf,
  MigrationsMemoryApplyParamsSchema as Xg,
  SkillsSearchResultSchema as Xh,
  validateWorkerConnectRequestFrame as Xi,
  ExecApprovalGetParams as Xl,
  AgentsUpdateResult as Xm,
  validateSessionsDeleteParams as Xn,
  TerminalTextParamsSchema as Xo,
  AuditActivityToolActionV1Schema as Xp,
  validateTalkConfigParams as Xr,
  SessionsDispatchParamsSchema as Xs,
  validateNodeInvokeParams as Xt,
  ResponseFrameSchema as Xu,
  WorkerLiveEventResult as Xv,
  PluginApprovalPresentationSchema as Xy,
  validateConfigSetParams as Y,
  WorkerInferenceTerminalFrame as Y_,
  PluginSearchPackageSchema as Ya,
  NodePresenceAlivePayloadSchema as Yc,
  ConfigPatchParamsSchema as Yd,
  TalkSessionCancelOutputParams as Yf,
  MigrationsMemoryApplyParams as Yg,
  SkillsSearchResult as Yh,
  validateWorkerAdmissionHandshake as Yi,
  DevicePairSetupCodeResult as Yl,
  AgentsUpdateParamsSchema as Ym,
  validateSessionsCreateParams as Yn,
  TerminalTextParams as Yo,
  AuditActivityToolActionV1 as Yp,
  validateTalkClientToolCallResult as Yr,
  SessionsDispatchParams as Ys,
  validateNodeInvokeInputEvent as Yt,
  ResponseFrame as Yu,
  WorkerLiveEventResponseFrameSchema as Yv,
  PluginApprovalPresentation as Yy,
  validateCrestodianChatParams as Z,
  WorkerInferenceTerminalOutcome as Z_,
  PluginsInstallParams as Za,
  NodePresenceAliveReasonSchema as Zc,
  ConfigSchemaLookupResultSchema as Zd,
  TalkSessionCancelTurnParams as Zf,
  MigrationsMemoryApplyResult as Zg,
  SkillsSecurityVerdictsParams as Zh,
  validateWorkerHeartbeatParams as Zi,
  ExecApprovalGetParamsSchema as Zl,
  AgentsUpdateResultSchema as Zm,
  validateSessionsDescribeParams as Zn,
  TerminalTextResult as Zo,
  ArtifactSummary as Zp,
  validateTalkConfigResult as Zr,
  SessionsDispatchResult as Zs,
  validateNodeInvokeProgressParams as Zt,
  ShutdownEvent as Zu,
  WorkerLiveEventResultSchema as Zv,
  PluginApprovalSeverity as Zy,
  validateApprovalGetParams as _,
  WorkerInferenceCancelParams as __,
  WorktreesGcParamsSchema as _a,
  NodeInvokeInputEventSchema as _c,
  CronRunParamsSchema as _d,
  ChannelsStartParams as _f,
  ToolsCatalogResult as _g,
  SkillsDetailParams as _h,
  validateTaskSuggestionsCreateParams as _i,
  LogsTailResultSchema as _l,
  AgentsWorkspaceListParamsSchema as _m,
  validatePluginsInstallParams as _n,
  PluginsUiDescriptorsParamsSchema as _o,
  TalkSessionTurnResult as _p,
  validateSessionsSearchResult as _r,
  TaskSuggestionResolutionSchema as _s,
  validateDeviceTokenRevokeParams as _t,
  EnvironmentsDestroyParamsSchema as _u,
  WORKER_TRANSCRIPT_COMMIT_PROTOCOL_FEATURE as _v,
  AllowedApprovalSnapshot as _y,
  validateAgentsCreateParams as a,
  SkillsProposalHistoryScanResult as a_,
  validateWorktreesRestoreParams as aa,
  isWellFormedApprovalId as ab,
  WebPushUnsubscribeParams as ac,
  CronDeclarativeAddResult as ad,
  UpdateRunParamsSchema as af,
  SkillsStatusParams as ag,
  ModelsProbeTargetResult as ah,
  validateTalkSessionCreateParams as ai,
  ChatInjectParams as al,
  ArtifactsListParams as am,
  validateNodePendingDrainParams as an,
  PluginsSearchParams as ao,
  TalkSessionJoinParams as ap,
  validateSessionsGroupsListParams as ar,
  TasksGetParams as as,
  validateCronRemoveParams as at,
  ExecApprovalsSetParams as au,
  validateWorkerInferenceTerminalOutcome as av,
  WorkerTranscriptCommitParams as ay,
  validateApprovalResolveParams as b,
  WorkerInferenceCancelRequestFrameSchema as b_,
  WorktreesListParams as ba,
  NodeInvokeProgressParams as bc,
  CronStatusParams as bd,
  ChannelsStatusParamsSchema as bf,
  ToolsEffectiveResult as bg,
  SkillsDetailResultSchema as bh,
  validateTasksCancelParams as bi,
  GatewaySuspendPrepareBusyResultSchema as bl,
  AgentSummary as bm,
  validatePluginsListResult as bn,
  PluginsUninstallParamsSchema as bo,
  TalkSpeakParamsSchema as bp,
  validateSkillsBinsParams as br,
  TaskSuggestionsAcceptParamsSchema as bs,
  validateEnvironmentsDestroyParams as bt,
  EnvironmentsListParams as bu,
  WORKER_TRANSCRIPT_MAX_JSON_DEPTH as bv,
  ApprovalAllowDecisionSchema as by,
  validateAgentsFilesListParams as c,
  SkillsProposalHistoryStatusParamsSchema as c_,
  WorktreeRecord as ca,
  ClawHubTrustErrorDetails as cb,
  WebPushVapidPublicKeyParamsSchema as cc,
  CronGetParamsSchema as cd,
  CommandEntry as cf,
  SkillsUpdateParamsSchema as cg,
  SkillsBinsResult as ch,
  validateTalkSessionJoinResult as ci,
  ChatMetadataParamsSchema as cl,
  AgentsWorkspaceEntry as cm,
  validateNodePresenceActivityPayload as cn,
  PluginsSearchResultSchema as co,
  TalkSessionJoinResultSchema as cp,
  validateSessionsListParams as cr,
  TasksGetResultSchema as cs,
  validateCronStatusParams as ct,
  EnvironmentStatus as cu,
  WORKER_PROTOCOL_FEATURES as cv,
  WorkerTranscriptCommitRequestFrameSchema as cy,
  validateAgentsUpdateParams as d,
  WORKER_INFERENCE_MAX_CONTEXT_MESSAGES as d_,
  WorktreesBranchesParamsSchema as da,
  readClawHubTrustErrorDetails as db,
  MIN_PROBE_PROTOCOL_VERSION as dc,
  CronListParams as dd,
  CommandsListResult as df,
  SkillsUploadChunkParams as dg,
  SkillsCuratorActionResult as dh,
  validateTalkSessionSubmitToolResultParams as di,
  ChatToolTitlesParamsSchema as dl,
  AgentsWorkspaceFileSchema as dm,
  validateNodeSkillsUpdateParams as dn,
  PluginsSessionActionResult as do,
  TalkSessionSteerParams as dp,
  validateSessionsPatchParams as dr,
  TasksListResult as ds,
  validateDevicePairApproveParams as dt,
  EnvironmentSummarySchema as du,
  WORKER_PROTOCOL_MAX_FRAME_ID_LENGTH as dv,
  WorkerTranscriptCommitResult as dy,
  MigrationsMemoryPlanParamsSchema as e_,
  validateWorktreesBranchesParams as ea,
  SessionApprovalEventSchema as eb,
  PushTestResultSchema as ec,
  TickEventSchema as ed,
  ConfigSchemaResponse as ef,
  SkillsSecurityVerdictsResultSchema as eg,
  ModelsListParamsSchema as eh,
  validateTalkSessionAcknowledgeMarkParams as ei,
  NodeSkillsUpdateParams as el,
  ArtifactsDownloadParamsSchema as em,
  validateNodePairApproveParams as en,
  PluginsInstallResultSchema as eo,
  TalkSessionCloseParamsSchema as ep,
  validateSessionsDispatchResult as er,
  TaskSummarySchema as es,
  validateCrestodianSetupDetectParams as et,
  ExecApprovalResolveParams as eu,
  WorkerInferenceTerminalParamsSchema as ev,
  WorkerProtocolCloseReasonSchema as ey,
  validateAgentsWorkspaceGetParams as f,
  WORKER_INFERENCE_MAX_OUTPUT_TOKENS as f_,
  WorktreesBranchesResult as fa,
  ProtocolValidator as fb,
  PROTOCOL_VERSION as fc,
  CronListParamsSchema as fd,
  CommandsListResultSchema as ff,
  SkillsUploadChunkParamsSchema as fg,
  SkillsCuratorActionResultSchema as fh,
  validateTalkSessionTurnParams as fi,
  ChatToolTitlesResult as fl,
  AgentsWorkspaceGetParams as fm,
  validatePendingApprovalSnapshot as fn,
  PluginsSessionActionResultSchema as fo,
  TalkSessionSteerParamsSchema as fp,
  validateSessionsPluginPatchParams as fr,
  TasksListResultSchema as fs,
  validateDevicePairListParams as ft,
  EnvironmentsCreateParams as fu,
  WORKER_PROTOCOL_MAX_IDENTIFIER_LENGTH as fv,
  WorkerTranscriptCommitResultSchema as fy,
  validateApprovalDecision as g,
  WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES as g_,
  WorktreesGcParams as ga,
  NodeInvokeInputEvent as gc,
  CronRunParams as gd,
  ChannelsLogoutParamsSchema as gf,
  ToolsCatalogParamsSchema as gg,
  SkillsCuratorStatusResultSchema as gh,
  validateTaskSuggestionsAcceptParams as gi,
  LogsTailResult as gl,
  AgentsWorkspaceListParams as gm,
  validatePluginApprovalSeverity as gn,
  PluginsSetEnabledResultSchema as go,
  TalkSessionTurnParamsSchema as gp,
  validateSessionsSearchParams as gr,
  TaskSuggestionResolution as gs,
  validateDevicePairSetupCodeParams as gt,
  EnvironmentsDestroyParams as gu,
  WORKER_RPC_SET_VERSION as gv,
  validateApprovalResolveResult as gy,
  validateApprovalAllowDecision as h,
  WORKER_INFERENCE_PROTOCOL_FEATURE as h_,
  WorktreesCreateParamsSchema as ha,
  NodeEventResultSchema as hc,
  CronRunLogEntry as hd,
  ChannelsLogoutParams as hf,
  ToolsCatalogParams as hg,
  SkillsCuratorStatusResult as hh,
  validateTalkSpeakResult as hi,
  LogsTailParamsSchema as hl,
  AgentsWorkspaceGetResultSchema as hm,
  validatePluginApprovalResolveParams as hn,
  PluginsSetEnabledResult as ho,
  TalkSessionTurnParams as hp,
  validateSessionsResolveParams as hr,
  TaskSuggestionEventSchema as hs,
  validateDevicePairRenameParams as ht,
  EnvironmentsCreateResultSchema as hu,
  WORKER_PROTOCOL_METHODS as hv,
  validateApprovalGetResult as hy,
  validateAgentWaitParams as i,
  SkillsProposalHistoryScanParamsSchema as i_,
  validateWorktreesRemoveParams as ia,
  TerminalApprovalSnapshotSchema as ib,
  WebPushTestParamsSchema as ic,
  CronAddResultSchema as id,
  UpdateRunParams as if,
  SkillsSkillCardResultSchema as ig,
  ModelsProbeResultSchema as ih,
  validateTalkSessionCloseParams as ii,
  ChatHistoryParamsSchema as il,
  ArtifactsGetResult as im,
  validateNodePendingAckParams as in,
  PluginsListResultSchema as io,
  TalkSessionCreateResultSchema as ip,
  validateSessionsGroupsDeleteParams as ir,
  TasksCancelResultSchema as is,
  validateCronListParams as it,
  ExecApprovalsNodeSnapshot as iu,
  validateWorkerInferenceTerminalFrame as iv,
  WorkerTranscriptCommitErrorShapeSchema as iy,
  validateChannelsStatusParams as j,
  WorkerInferenceEventFrame as j_,
  WizardCancelParamsSchema as ja,
  NodePairRemoveParams as jc,
  CrestodianSetupActivateResultSchema as jd,
  TalkClientCreateParams as jf,
  AgentWaitParams as jg,
  SkillsProposalInspectResult as jh,
  validateToolsCatalogParams as ji,
  GatewaySuspendStatusParamsSchema as jl,
  AgentsFileEntrySchema as jm,
  validatePollParams as jn,
  TerminalDataEvent as jo,
  AuditEvent as jp,
  validateSkillsProposalsListParams as jr,
  TaskSuggestionsListParams as js,
  validateExecApprovalsNodeSnapshot as jt,
  WorkerEnvironmentStateSchema as ju,
  WorkerHeartbeatParams as jv,
  ApprovalResolveParams as jy,
  validateChannelsLogoutParams as k,
  WorkerInferenceErrorShape as k_,
  WorktreesRestoreParamsSchema as ka,
  NodePairRejectParams as kc,
  CrestodianSetupActivateParamsSchema as kd,
  TalkCatalogResult as kf,
  AgentIdentityResultSchema as kg,
  SkillsProposalInspectParams as kh,
  validateTerminalResizeParams as ki,
  GatewaySuspendResumeResultSchema as kl,
  AgentsDeleteResultSchema as km,
  validatePluginsUninstallParams as kn,
  TerminalCloseParams as ko,
  WebLoginWaitParams as kp,
  validateSkillsProposalReviseParams as kr,
  TaskSuggestionsDismissResult as ks,
  validateExecApprovalsNodeGetParams as kt,
  WorkerEnvironmentMetadataSchema as ku,
  WorkerConnectRequestFrameSchema as kv,
  ApprovalPresentation as ky,
  validateAgentsFilesSetParams as l,
  validateSkillsProposalHistoryScanParams as l_,
  WorktreeRecordSchema as la,
  buildClawHubTrustErrorDetails as lb,
  MIN_CLIENT_PROTOCOL_VERSION as lc,
  CronJob as ld,
  CommandsListParams as lf,
  SkillsUploadBeginParams as lg,
  SkillsCuratorActionParams as lh,
  validateTalkSessionOkResult as li,
  ChatSendParamsSchema as ll,
  AgentsWorkspaceEntrySchema as lm,
  validateNodePresenceAlivePayload as ln,
  PluginsSessionActionParams as lo,
  TalkSessionOkResult as lp,
  validateSessionsMessagesSubscribeParams as lr,
  TasksListParams as ls,
  validateCronUpdateParams as lt,
  EnvironmentStatusSchema as lu,
  WORKER_PROTOCOL_MAX_FEATURES as lv,
  WorkerTranscriptCommitResponseFrame as ly,
  validateAllowedApprovalSnapshot as m,
  WORKER_INFERENCE_METHODS as m_,
  WorktreesCreateParams as ma,
  formatValidationErrors as mb,
  NodeEventResult as mc,
  CronRemoveParamsSchema as md,
  TalkSessionAcknowledgeMarkParamsSchema as mf,
  SkillsUploadCommitParamsSchema as mg,
  SkillsCuratorStatusParamsSchema as mh,
  validateTalkSpeakParams as mi,
  LogsTailParams as ml,
  AgentsWorkspaceGetResult as mm,
  validatePluginApprovalRequestParams as mn,
  PluginsSetEnabledParamsSchema as mo,
  TalkSessionSubmitToolResultParamsSchema as mp,
  validateSessionsResetParams as mr,
  TaskSuggestionEvent as ms,
  validateDevicePairRemoveParams as mt,
  EnvironmentsCreateResult as mu,
  WORKER_PROTOCOL_MAX_PAYLOAD_BYTES as mv,
  WorkerTranscriptMessageSchema as my,
  validateAgentIdentityParams as n,
  MigrationsMemoryPlanResultSchema as n_,
  validateWorktreesGcParams as na,
  SessionApprovalReplaySchema as nb,
  WebPushSubscribeParamsSchema as nc,
  CronAddParamsSchema as nd,
  ConfigSetParams as nf,
  SkillsSkillCardParamsSchema as ng,
  ModelsProbeParamsSchema as nh,
  validateTalkSessionCancelOutputParams as ni,
  ChatEvent as nl,
  ArtifactsGetParams as nm,
  validateNodePairRejectParams as nn,
  PluginsListParamsSchema as no,
  TalkSessionCreateParamsSchema as np,
  validateSessionsFilesListParams as nr,
  TasksCancelParamsSchema as ns,
  validateCronAddParams as nt,
  ExecApprovalsGetParams as nu,
  validateWorkerInferenceEventFrame as nv,
  WorkerTranscriptCommitErrorReasonSchema as ny,
  validateAgentsDeleteParams as o,
  SkillsProposalHistoryScanResultSchema as o_,
  WorktreeBranch as oa,
  ClawHubTrustErrorCode as ob,
  WebPushUnsubscribeParamsSchema as oc,
  CronDeclarativeAddResultSchema as od,
  UpdateStatusParams as of,
  SkillsStatusParamsSchema as og,
  ModelsProbeTargetResultSchema as oh,
  validateTalkSessionCreateResult as oi,
  ChatInjectParamsSchema as ol,
  ArtifactsListParamsSchema as om,
  validateNodePendingEnqueueParams as on,
  PluginsSearchParamsSchema as oo,
  TalkSessionJoinParamsSchema as op,
  validateSessionsGroupsPutParams as or,
  TasksGetParamsSchema as os,
  validateCronRunParams as ot,
  ExecApprovalsSetParamsSchema as ou,
  WORKER_HEARTBEAT_INTERVAL_MS as ov,
  WorkerTranscriptCommitParamsSchema as oy,
  validateAgentsWorkspaceListParams as p,
  WORKER_INFERENCE_MAX_TOOLS as p_,
  WorktreesBranchesResultSchema as pa,
  ValidationError as pb,
  NodeEventParams as pc,
  CronRemoveParams as pd,
  TalkSessionAcknowledgeMarkParams as pf,
  SkillsUploadCommitParams as pg,
  SkillsCuratorStatusParams as ph,
  validateTalkSessionTurnResult as pi,
  ChatToolTitlesResultSchema as pl,
  AgentsWorkspaceGetParamsSchema as pm,
  validatePluginApprovalPresentation as pn,
  PluginsSetEnabledParams as po,
  TalkSessionSubmitToolResultParams as pp,
  validateSessionsPreviewParams as pr,
  TaskSuggestion as ps,
  validateDevicePairRejectParams as pt,
  EnvironmentsCreateParamsSchema as pu,
  WORKER_PROTOCOL_MAX_METHOD_LENGTH as pv,
  WorkerTranscriptMessage as py,
  validateConfigSchemaLookupResult as q,
  WorkerInferenceStartResult as q_,
  PluginCatalogEntrySchema as qa,
  NodePresenceActivityPayloadSchema as qc,
  ConfigGetParamsSchema as qd,
  TalkSessionAppendAudioParams as qf,
  MemoryMigrationSummarySchema as qg,
  SkillsSearchParams as qh,
  validateWizardStartParams as qi,
  DevicePairRenameParams as ql,
  AgentsListResultSchema as qm,
  validateSessionsCompactionListParams as qn,
  TerminalSessionInfo as qo,
  AuditActivityOutboundMessageV1 as qp,
  validateTalkClientSteerParams as qr,
  SessionPlacementState as qs,
  validateNodeEventParams as qt,
  RequestFrame as qu,
  WorkerLiveEventRequestFrameSchema as qv,
  PendingApprovalSnapshot as qy,
  validateAgentParams as r,
  SkillsProposalHistoryScanParams as r_,
  validateWorktreesListParams as ra,
  TerminalApprovalSnapshot as rb,
  WebPushTestParams as rc,
  CronAddResult as rd,
  ConfigSetParamsSchema as rf,
  SkillsSkillCardResult as rg,
  ModelsProbeResult as rh,
  validateTalkSessionCancelTurnParams as ri,
  ChatEventSchema as rl,
  ArtifactsGetParamsSchema as rm,
  validateNodePairRemoveParams as rn,
  PluginsListResult as ro,
  TalkSessionCreateResult as rp,
  validateSessionsFilesSetParams as rr,
  TasksCancelResult as rs,
  validateCronGetParams as rt,
  ExecApprovalsGetParamsSchema as ru,
  validateWorkerInferenceStartParams as rv,
  WorkerTranscriptCommitErrorShape as ry,
  validateAgentsFilesGetParams as s,
  SkillsProposalHistoryStatusParams as s_,
  WorktreeBranchSchema as sa,
  ClawHubTrustErrorCodes as sb,
  WebPushVapidPublicKeyParams as sc,
  CronGetParams as sd,
  UpdateStatusParamsSchema as sf,
  SkillsUpdateParams as sg,
  SkillsBinsParams as sh,
  validateTalkSessionJoinParams as si,
  ChatMetadataParams as sl,
  ArtifactsListResult as sm,
  validateNodePluginToolsUpdateParams as sn,
  PluginsSearchResult as so,
  TalkSessionJoinResult as sp,
  validateSessionsGroupsRenameParams as sr,
  TasksGetResult as ss,
  validateCronRunsParams as st,
  ExecApprovalsSnapshot as su,
  WORKER_LIVE_EVENT_PROTOCOL_FEATURE as sv,
  WorkerTranscriptCommitRequestFrame as sy,
  SessionsPatchResult as t,
  MigrationsMemoryPlanResult as t_,
  validateWorktreesCreateParams as ta,
  SessionApprovalReplay as tb,
  WebPushSubscribeParams as tc,
  CronAddParams as td,
  ConfigSchemaResponseSchema as tf,
  SkillsSkillCardParams as tg,
  ModelsProbeParams as th,
  validateTalkSessionAppendAudioParams as ti,
  NodeSkillsUpdateParamsSchema as tl,
  ArtifactsDownloadResult as tm,
  validateNodePairListParams as tn,
  PluginsListParams as to,
  TalkSessionCreateParams as tp,
  validateSessionsFilesGetParams as tr,
  TasksCancelParams as ts,
  validateCrestodianSetupVerifyParams as tt,
  ExecApprovalResolveParamsSchema as tu,
  validateWorkerInferenceCancelParams as tv,
  WorkerTranscriptCommitErrorReason as ty,
  validateAgentsListParams as u,
  validateSkillsProposalHistoryStatusParams as u_,
  WorktreesBranchesParams as ua,
  isClawHubTrustErrorCode as ub,
  MIN_NODE_PROTOCOL_VERSION as uc,
  CronJobSchema as ud,
  CommandsListParamsSchema as uf,
  SkillsUploadBeginParamsSchema as ug,
  SkillsCuratorActionParamsSchema as uh,
  validateTalkSessionSteerParams as ui,
  ChatToolTitlesParams as ul,
  AgentsWorkspaceFile as um,
  validateNodeRenameParams as un,
  PluginsSessionActionParamsSchema as uo,
  TalkSessionOkResultSchema as up,
  validateSessionsMessagesUnsubscribeParams as ur,
  TasksListParamsSchema as us,
  validateDeniedApprovalSnapshot as ut,
  EnvironmentSummary as uu,
  WORKER_PROTOCOL_MAX_FEATURE_LENGTH as uv,
  WorkerTranscriptCommitResponseFrameSchema as uy,
  validateApprovalKind as v,
  WorkerInferenceCancelParamsSchema as v_,
  WorktreesGcResult as va,
  NodeInvokeParams as vc,
  CronRunsParams as vd,
  ChannelsStartParamsSchema as vf,
  ToolsEffectiveParams as vg,
  SkillsDetailParamsSchema as vh,
  validateTaskSuggestionsDismissParams as vi,
  GatewaySuspendBlocker as vl,
  AgentsWorkspaceListResult as vm,
  validatePluginsInstallResult as vn,
  PluginsUiDescriptorsResultSchema as vo,
  TalkSessionTurnResultSchema as vp,
  validateSessionsSendParams as vr,
  TaskSuggestionSchema as vs,
  validateDeviceTokenRotateParams as vt,
  EnvironmentsDestroyResult as vu,
  WORKER_TRANSCRIPT_MAX_BATCH_MESSAGES as vv,
  AllowedApprovalSnapshotSchema as vy,
  validateArtifactsGetParams as w,
  WorkerInferenceCancelResultSchema as w_,
  WorktreesRemoveParams as wa,
  NodeListParamsSchema as wc,
  CrestodianChatParams as wd,
  ChannelsStopParamsSchema as wf,
  AgentEvent as wg,
  SkillsProposalActionParamsSchema as wh,
  validateTerminalAttachParams as wi,
  GatewaySuspendPrepareResult as wl,
  AgentsCreateResult as wm,
  validatePluginsSessionActionResult as wn,
  TerminalAckResultSchema as wo,
  TtsSpeakParamsSchema as wp,
  validateSkillsInstallParams as wr,
  TaskSuggestionsCreateParamsSchema as ws,
  validateExecApprovalGetParams as wt,
  EnvironmentsStatusParams as wu,
  WorkerAdmissionHandshakeSchema as wv,
  ApprovalGetParamsSchema as wy,
  validateApprovalSnapshot as x,
  WorkerInferenceCancelResponseFrame as x_,
  WorktreesListParamsSchema as xa,
  NodeInvokeProgressParamsSchema as xc,
  CronStatusParamsSchema as xd,
  ChannelsStatusResult as xf,
  ToolsInvokeParams as xg,
  SkillsInstallParams as xh,
  validateTasksGetParams as xi,
  GatewaySuspendPrepareParams as xl,
  AgentSummarySchema as xm,
  validatePluginsSearchParams as xn,
  PluginsUninstallResult as xo,
  TalkSpeakResult as xp,
  validateSkillsCuratorActionParams as xr,
  TaskSuggestionsAcceptResult as xs,
  validateEnvironmentsListParams as xt,
  EnvironmentsListParamsSchema as xu,
  WorkerAdmissionFailureReason as xv,
  ApprovalDecision as xy,
  validateApprovalPresentation as y,
  WorkerInferenceCancelRequestFrame as y_,
  WorktreesGcResultSchema as ya,
  NodeInvokeParamsSchema as yc,
  CronRunsParamsSchema as yd,
  ChannelsStatusParams as yf,
  ToolsEffectiveParamsSchema as yg,
  SkillsDetailResult as yh,
  validateTaskSuggestionsListParams as yi,
  GatewaySuspendBlockerSchema as yl,
  AgentsWorkspaceListResultSchema as ym,
  validatePluginsListParams as yn,
  PluginsUninstallParams as yo,
  TalkSpeakParams as yp,
  validateSessionsUsageParams as yr,
  TaskSuggestionsAcceptParams as ys,
  validateEnvironmentsCreateParams as yt,
  EnvironmentsDestroyResultSchema as yu,
  WORKER_TRANSCRIPT_MAX_CONTENT_PARTS as yv,
  ApprovalAllowDecision as yy,
  validateChatMetadataParams as z,
  WorkerInferenceResolvedModel as z_,
  WizardStartResultSchema as za,
  NodePendingEnqueueParamsSchema as zc,
  CrestodianSetupDetectResultSchema as zd,
  TalkClientToolCallResult as zf,
  validateMigrationsMemoryPlanParams as zg,
  SkillsProposalReviseParams as zh,
  validateWebLoginStartParams as zi,
  FsDirEntrySchema as zl,
  AgentsFilesListResultSchema as zm,
  validateSessionsCatalogArchiveParams as zn,
  TerminalListResult as zo,
  AuditActivityEventV1 as zp,
  validateSkillsUploadCommitParams as zr,
  PresenceEntry as zs,
  validateGatewaySuspendResumeResult as zt,
  ErrorShapeSchema as zu,
  WorkerLiveEvent as zv,
  CancelledApprovalSnapshot as zy,
};
