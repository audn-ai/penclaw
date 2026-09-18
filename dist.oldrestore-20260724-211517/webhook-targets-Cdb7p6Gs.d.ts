import { IncomingMessage, ServerResponse } from "node:http";
import { n as registerPluginHttpRoute } from "./http-registry-Bu61EERF.js";
import {
  f as FixedWindowRateLimiter,
  i as WebhookInFlightLimiter,
} from "./webhook-request-guards-DAKACTVp.js";

//#region src/plugin-sdk/webhook-targets.d.ts
/** Registration handle returned for one live webhook target. */
type RegisteredWebhookTarget<T> = {
  /** Normalized target stored in the caller-owned path registry. */ target: T /** Idempotently remove this target and run path teardown when it was the last target. */;
  unregister: () => void;
};
/** Lifecycle hooks for path-level webhook target registration. */
type RegisterWebhookTargetOptions<
  T extends {
    path: string;
  },
> = {
  /** Called before the first target for a normalized path is stored; may return path teardown. */ onFirstPathTarget?: (params: {
    path: string;
    target: T;
  }) =>
    | void
    | (() => void) /** Called after the last target for a normalized path has been removed. */;
  onLastPathTargetRemoved?: (params: { path: string }) => void;
};
type RegisterPluginHttpRouteParams = Parameters<typeof registerPluginHttpRoute>[0];
/** Plugin HTTP route options supplied when webhook paths are registered lazily. */
type RegisterWebhookPluginRouteOptions = Omit<
  RegisterPluginHttpRouteParams,
  "path" | "fallbackPath"
>;
/** Register a webhook target and lazily install the matching plugin HTTP route on first use. */
declare function registerWebhookTargetWithPluginRoute<
  T extends {
    path: string;
  },
>(params: {
  /** Caller-owned normalized path registry shared by all targets for this plugin/runtime. */ targetsByPath: Map<
    string,
    T[]
  > /** Target to normalize, store, and later return from the registration handle. */;
  target: T /** Plugin HTTP route configuration used when the first target for a path is registered. */;
  route: RegisterWebhookPluginRouteOptions /** Optional last-target hook forwarded to `registerWebhookTarget`. */;
  onLastPathTargetRemoved?: RegisterWebhookTargetOptions<T>["onLastPathTargetRemoved"];
}): RegisteredWebhookTarget<T>;
/** Add a normalized target to a path bucket and clean up route state when the last target leaves. */
declare function registerWebhookTarget<
  T extends {
    path: string;
  },
>(
  targetsByPath: Map<string, T[]>,
  target: T,
  opts?: RegisterWebhookTargetOptions<T>,
): RegisteredWebhookTarget<T>;
/** Resolve all registered webhook targets for the incoming request path. */
declare function resolveWebhookTargets<T>(
  req: IncomingMessage,
  targetsByPath: Map<string, T[]>,
): {
  path: string;
  targets: T[];
} | null;
/** Run common webhook guards, then dispatch only when the request path resolves to live targets. */
declare function withResolvedWebhookRequestPipeline<T>(params: {
  /** Incoming HTTP request whose pathname selects the target bucket. */ req: IncomingMessage /** HTTP response used by guard failures before handler dispatch. */;
  res: ServerResponse /** Caller-owned target registry keyed by normalized webhook path. */;
  targetsByPath: Map<string, T[]> /** Allowed methods for the common request guard. */;
  allowMethods?: readonly string[] /** Optional per-key fixed-window limiter shared across requests. */;
  rateLimiter?: FixedWindowRateLimiter /** Explicit rate-limit key; defaults are owned by the request guard. */;
  rateLimitKey?: string /** Clock override for deterministic limiter tests. */;
  nowMs?: number /** Require JSON content type before dispatching to the webhook handler. */;
  requireJsonContentType?: boolean /** Optional in-flight limiter to cap concurrent handling for a key. */;
  inFlightLimiter?: WebhookInFlightLimiter /** Explicit or derived key for concurrent request limiting. */;
  inFlightKey?:
    | string
    | ((args: {
        req: IncomingMessage;
        path: string;
        targets: T[];
      }) => string) /** Status code returned when the in-flight guard rejects. */;
  inFlightLimitStatusCode?: number /** Response body returned when the in-flight guard rejects. */;
  inFlightLimitMessage?: string /** Handler invoked only after target resolution and common guards succeed. */;
  handle: (args: { path: string; targets: T[] }) => Promise<boolean | void> | boolean | void;
}): Promise<boolean>;
/** Result of matching a request against zero, one, or multiple webhook targets. */
type WebhookTargetMatchResult<T> =
  | {
      kind: "none";
    }
  | {
      kind: "single";
      target: T;
    }
  | {
      kind: "ambiguous";
    };
/** Match exactly one synchronous target or report whether resolution was empty or ambiguous. */
declare function resolveSingleWebhookTarget<T>(
  targets: readonly T[],
  isMatch: (target: T) => boolean,
): WebhookTargetMatchResult<T>;
/** Async variant of single-target resolution for auth checks that need I/O. */
declare function resolveSingleWebhookTargetAsync<T>(
  targets: readonly T[],
  isMatch: (target: T) => Promise<boolean>,
): Promise<WebhookTargetMatchResult<T>>;
/** Resolve an authorized target and send the standard unauthorized or ambiguous response on failure. */
declare function resolveWebhookTargetWithAuthOrReject<T>(params: {
  /** Candidate targets for the already-resolved webhook path. */ targets: readonly T[] /** HTTP response used to send unauthorized or ambiguous failures. */;
  res: ServerResponse /** Auth or routing predicate; exactly one target must match. */;
  isMatch: (
    target: T,
  ) => boolean | Promise<boolean> /** Status code for no matching target. Defaults to 401. */;
  unauthorizedStatusCode?: number /** Response body for no matching target. */;
  unauthorizedMessage?: string /** Status code for multiple matching targets. Defaults to 401. */;
  ambiguousStatusCode?: number /** Response body for multiple matching targets. */;
  ambiguousMessage?: string;
}): Promise<T | null>;
/** Synchronous variant of webhook auth resolution for cheap in-memory match checks. */
declare function resolveWebhookTargetWithAuthOrRejectSync<T>(params: {
  /** Candidate targets for the already-resolved webhook path. */ targets: readonly T[] /** HTTP response used to send unauthorized or ambiguous failures. */;
  res: ServerResponse /** Synchronous auth or routing predicate; exactly one target must match. */;
  isMatch: (target: T) => boolean /** Status code for no matching target. Defaults to 401. */;
  unauthorizedStatusCode?: number /** Response body for no matching target. */;
  unauthorizedMessage?: string /** Status code for multiple matching targets. Defaults to 401. */;
  ambiguousStatusCode?: number /** Response body for multiple matching targets. */;
  ambiguousMessage?: string;
}): T | null;
/** Reject non-POST webhook requests with the conventional Allow header. */
declare function rejectNonPostWebhookRequest(req: IncomingMessage, res: ServerResponse): boolean;
//#endregion
export {
  registerWebhookTarget as a,
  resolveSingleWebhookTarget as c,
  resolveWebhookTargetWithAuthOrRejectSync as d,
  resolveWebhookTargets as f,
  WebhookTargetMatchResult as i,
  resolveSingleWebhookTargetAsync as l,
  RegisterWebhookTargetOptions as n,
  registerWebhookTargetWithPluginRoute as o,
  withResolvedWebhookRequestPipeline as p,
  RegisteredWebhookTarget as r,
  rejectNonPostWebhookRequest as s,
  RegisterWebhookPluginRouteOptions as t,
  resolveWebhookTargetWithAuthOrReject as u,
};
