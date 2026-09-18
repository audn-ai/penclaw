//#region src/infra/diagnostic-trace-context.d.ts
type DiagnosticTraceContext = {
  /** W3C trace id, 32 lowercase hex chars. */ readonly traceId: string /** Current span id, 16 lowercase hex chars. */;
  readonly spanId?: string /** Parent span id, 16 lowercase hex chars. */;
  readonly parentSpanId?: string /** W3C trace flags, 2 lowercase hex chars. Defaults to sampled. */;
  readonly traceFlags?: string;
};
type DiagnosticTraceContextInput = Partial<DiagnosticTraceContext> & {
  traceparent?: string;
};
/** Returns whether a value is a non-zero W3C trace id. */
declare function isValidDiagnosticTraceId(value: unknown): value is string;
/** Returns whether a value is a non-zero W3C span id. */
declare function isValidDiagnosticSpanId(value: unknown): value is string;
/** Returns whether a value is a valid W3C trace-flags byte. */
declare function isValidDiagnosticTraceFlags(value: unknown): value is string;
/** Parses a W3C `traceparent` header into a normalized diagnostic trace context. */
declare function parseDiagnosticTraceparent(
  traceparent: string | undefined,
): DiagnosticTraceContext | undefined;
/** Formats a diagnostic trace context as a W3C `traceparent` header. */
declare function formatDiagnosticTraceparent(
  context: DiagnosticTraceContext | undefined,
): string | undefined;
/** Creates a normalized trace context from explicit fields, traceparent, or generated ids. */
declare function createDiagnosticTraceContext(
  input?: DiagnosticTraceContextInput,
): DiagnosticTraceContext;
/** Creates a child context that preserves the parent trace id and records the parent span id. */
declare function createChildDiagnosticTraceContext(
  parent: DiagnosticTraceContext,
  input?: Omit<DiagnosticTraceContextInput, "traceId" | "traceparent">,
): DiagnosticTraceContext;
/** Creates a child of the active trace scope, or a new root context when no scope is active. */
declare function createDiagnosticTraceContextFromActiveScope(
  input?: Omit<DiagnosticTraceContextInput, "traceId" | "traceparent">,
): DiagnosticTraceContext;
/** Returns an immutable defensive copy of a trace context. */
declare function freezeDiagnosticTraceContext(
  context: DiagnosticTraceContext,
): DiagnosticTraceContext;
//#endregion
export {
  formatDiagnosticTraceparent as a,
  isValidDiagnosticTraceFlags as c,
  createDiagnosticTraceContextFromActiveScope as i,
  isValidDiagnosticTraceId as l,
  createChildDiagnosticTraceContext as n,
  freezeDiagnosticTraceContext as o,
  createDiagnosticTraceContext as r,
  isValidDiagnosticSpanId as s,
  DiagnosticTraceContext as t,
  parseDiagnosticTraceparent as u,
};
