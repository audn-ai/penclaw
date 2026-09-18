import { IncomingMessage, ServerResponse } from "node:http";

//#region src/plugin-sdk/webhook-memory-guards.d.ts
/** In-memory fixed-window limiter used by webhook ingress handlers. */
type FixedWindowRateLimiter = {
  /** Return true once the key exceeds its allowed request count in the current window. */ isRateLimited: (
    key: string,
    nowMs?: number,
  ) => boolean /** Number of tracked keys currently retained in memory. */;
  size: () => number /** Drop all tracked keys and reset pruning state. */;
  clear: () => void;
};
/** Bounded keyed counter for sampled webhook anomaly tracking. */
type BoundedCounter = {
  /** Increment one key and return its current count, or zero for empty keys. */ increment: (
    key: string,
    nowMs?: number,
  ) => number /** Number of tracked keys currently retained in memory. */;
  size: () => number /** Drop all tracked keys and reset pruning state. */;
  clear: () => void;
};
/** Default webhook ingress rate-limit settings for plugin monitors. */
declare const WEBHOOK_RATE_LIMIT_DEFAULTS: Readonly<{
  windowMs: 60000;
  maxRequests: 120;
  maxTrackedKeys: 4096;
}>;
/** Default cardinality and sampling settings for webhook anomaly counters. */
declare const WEBHOOK_ANOMALY_COUNTER_DEFAULTS: Readonly<{
  maxTrackedKeys: 4096;
  ttlMs: number;
  logEvery: 25;
}>;
/** HTTP status codes counted as anomalous webhook request outcomes. */
declare const WEBHOOK_ANOMALY_STATUS_CODES: readonly number[];
/** Records repeated webhook failures and exposes bounded in-memory state controls. */
type WebhookAnomalyTracker = {
  /** Count one tracked status for a key; returns zero when the status/key is ignored. */ record: (params: {
    /** Stable anomaly key, typically route plus sender or remote identity. */ key: string /** HTTP status to count when it is in the tracked status-code set. */;
    statusCode: number /** Build the sampled log message from the current key count. */;
    message: (
      count: number,
    ) => string /** Optional log sink invoked for the first hit and every sampled repeat. */;
    log?: (message: string) => void /** Clock override for deterministic tests. */;
    nowMs?: number;
  }) => number /** Number of tracked anomaly keys currently retained in memory. */;
  size: () => number /** Drop all tracked anomaly keys and reset pruning state. */;
  clear: () => void;
};
/** Create a simple fixed-window rate limiter for in-memory webhook protection. */
declare function createFixedWindowRateLimiter(options: {
  /** Duration of one fixed window in milliseconds. */ windowMs: number /** Maximum accepted requests per key during one window. */;
  maxRequests: number /** Maximum number of keys retained before oldest entries are pruned. */;
  maxTrackedKeys: number /** Optional interval for expired-window pruning. Defaults to `windowMs`. */;
  pruneIntervalMs?: number;
}): FixedWindowRateLimiter;
/** Count keyed events in memory with optional TTL pruning and bounded cardinality. */
declare function createBoundedCounter(options: {
  /** Maximum number of keys retained before oldest entries are pruned. */ maxTrackedKeys: number /** Optional key TTL in milliseconds; zero disables TTL expiry. */;
  ttlMs?: number /** Optional interval for TTL pruning. */;
  pruneIntervalMs?: number;
}): BoundedCounter;
/** Track repeated webhook failures and emit sampled logs for suspicious request patterns. */
declare function createWebhookAnomalyTracker(options?: {
  /** Maximum number of anomaly keys retained before oldest entries are pruned. */ maxTrackedKeys?: number /** Key TTL in milliseconds; zero disables TTL expiry. */;
  ttlMs?: number /** Log every Nth repeat after the first hit. */;
  logEvery?: number /** HTTP status codes that should be counted as anomalies. */;
  trackedStatusCodes?: readonly number[];
}): WebhookAnomalyTracker;
//#endregion
//#region src/plugin-sdk/webhook-request-guards.d.ts
/** Body-read profile for webhook payload limits before or after authentication. */
type WebhookBodyReadProfile = "pre-auth" | "post-auth";
/** Default webhook body size/time limits for pre-auth and post-auth reads. */
declare const WEBHOOK_BODY_READ_DEFAULTS: Readonly<{
  preAuth: {
    maxBytes: number;
    timeoutMs: number;
  };
  postAuth: {
    maxBytes: number;
    timeoutMs: number;
  };
}>;
/** Default in-flight concurrency limits for webhook request pipelines. */
declare const WEBHOOK_IN_FLIGHT_DEFAULTS: Readonly<{
  maxInFlightPerKey: 8;
  maxTrackedKeys: 4096;
}>;
/** Per-key in-flight limiter used to bound concurrent webhook handlers. */
type WebhookInFlightLimiter = {
  /** Acquire one in-flight slot for a key, returning false when the key is at capacity. */ tryAcquire: (
    key: string,
  ) => boolean /** Release one slot for a key after the handler completes. */;
  release: (key: string) => void /** Number of keys with retained in-flight state. */;
  size: () => number /** Drop all retained in-flight state. */;
  clear: () => void;
};
/** Create an in-memory limiter that caps concurrent webhook handlers per key. */
declare function createWebhookInFlightLimiter(options?: {
  /** Maximum concurrent handlers allowed for one key. */ maxInFlightPerKey?: number /** Maximum number of keys retained before oldest entries are pruned. */;
  maxTrackedKeys?: number;
}): WebhookInFlightLimiter;
/** Detect JSON content types, including structured syntax suffixes like `application/ld+json`. */
declare function isJsonContentType(value: string | string[] | undefined): boolean;
/** Apply method, rate-limit, and content-type guards before a webhook handler reads the body. */
declare function applyBasicWebhookRequestGuards(params: {
  /** Incoming request to validate before body reads or handler dispatch. */ req: IncomingMessage /** Response used for method, rate-limit, or content-type rejections. */;
  res: ServerResponse /** Allowed HTTP methods; empty or omitted disables the method guard. */;
  allowMethods?: readonly string[] /** Optional fixed-window limiter for pre-body request throttling. */;
  rateLimiter?: FixedWindowRateLimiter /** Key passed to the rate limiter when throttling is enabled. */;
  rateLimitKey?: string /** Clock override for deterministic limiter tests. */;
  nowMs?: number /** Require JSON content type for POST requests. */;
  requireJsonContentType?: boolean;
}): boolean;
/** Start the shared webhook request lifecycle and return a release hook for in-flight tracking. */
declare function beginWebhookRequestPipelineOrReject(params: {
  /** Incoming request to validate before acquiring in-flight capacity. */ req: IncomingMessage /** Response used for guard or capacity rejections. */;
  res: ServerResponse /** Allowed HTTP methods; empty or omitted disables the method guard. */;
  allowMethods?: readonly string[] /** Optional fixed-window limiter for pre-body request throttling. */;
  rateLimiter?: FixedWindowRateLimiter /** Key passed to the rate limiter when throttling is enabled. */;
  rateLimitKey?: string /** Clock override for deterministic limiter tests. */;
  nowMs?: number /** Require JSON content type for POST requests. */;
  requireJsonContentType?: boolean /** Optional per-key concurrency limiter acquired after basic guards pass. */;
  inFlightLimiter?: WebhookInFlightLimiter /** Key used for in-flight concurrency tracking. */;
  inFlightKey?: string /** Status code returned when the in-flight guard rejects. */;
  inFlightLimitStatusCode?: number /** Response body returned when the in-flight guard rejects. */;
  inFlightLimitMessage?: string;
}):
  | {
      ok: true;
      release: () => void;
    }
  | {
      ok: false;
    };
/** Read a webhook request body with bounded size/time limits and translate failures into responses. */
declare function readWebhookBodyOrReject(params: {
  /** Incoming request body stream to read. */ req: IncomingMessage /** Response used for body size, timeout, close, or parse failures. */;
  res: ServerResponse /** Optional maximum body size override in bytes. */;
  maxBytes?: number /** Optional body read timeout override in milliseconds. */;
  timeoutMs?: number /** Default limit profile to use when explicit limits are omitted. */;
  profile?: WebhookBodyReadProfile /** Response body for invalid request bodies. */;
  invalidBodyMessage?: string;
}): Promise<
  | {
      ok: true;
      value: string;
    }
  | {
      ok: false;
    }
>;
/** Read and parse a JSON webhook body, rejecting malformed or oversized payloads consistently. */
declare function readJsonWebhookBodyOrReject(params: {
  /** Incoming request body stream to read and parse as JSON. */ req: IncomingMessage /** Response used for JSON parse, body size, timeout, or close failures. */;
  res: ServerResponse /** Optional maximum body size override in bytes. */;
  maxBytes?: number /** Optional body read timeout override in milliseconds. */;
  timeoutMs?: number /** Default limit profile to use when explicit limits are omitted. */;
  profile?: WebhookBodyReadProfile /** Treat an empty body as `{}` instead of rejecting it as invalid JSON. */;
  emptyObjectOnEmpty?: boolean /** Response body for malformed JSON. */;
  invalidJsonMessage?: string;
}): Promise<
  | {
      ok: true;
      value: unknown;
    }
  | {
      ok: false;
    }
>;
//#endregion
export {
  createBoundedCounter as _,
  applyBasicWebhookRequestGuards as a,
  isJsonContentType as c,
  BoundedCounter as d,
  FixedWindowRateLimiter as f,
  WebhookAnomalyTracker as g,
  WEBHOOK_RATE_LIMIT_DEFAULTS as h,
  WebhookInFlightLimiter as i,
  readJsonWebhookBodyOrReject as l,
  WEBHOOK_ANOMALY_STATUS_CODES as m,
  WEBHOOK_IN_FLIGHT_DEFAULTS as n,
  beginWebhookRequestPipelineOrReject as o,
  WEBHOOK_ANOMALY_COUNTER_DEFAULTS as p,
  WebhookBodyReadProfile as r,
  createWebhookInFlightLimiter as s,
  WEBHOOK_BODY_READ_DEFAULTS as t,
  readWebhookBodyOrReject as u,
  createFixedWindowRateLimiter as v,
  createWebhookAnomalyTracker as y,
};
