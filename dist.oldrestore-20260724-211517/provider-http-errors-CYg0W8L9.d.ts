//#region src/agents/provider-http-errors.d.ts
/** Returns a plain object view for provider JSON payloads when one exists. */
declare function asObject(value: unknown): Record<string, unknown> | undefined;
/** Trims provider error details to a log- and prompt-safe preview length. */
declare function truncateErrorDetail(detail: string, limit?: number): string;
/** Reads at most `limitBytes` from a response body without buffering provider-sized failures. */
declare function readResponseTextLimited(response: Response, limitBytes?: number): Promise<string>;
/** Reads a successful provider text response under a byte cap. */
declare function readProviderTextResponse(
  response: Response,
  label: string,
  opts?: {
    maxBytes?: number;
  },
): Promise<string>;
/** Formats common provider JSON error payload shapes into one readable detail string. */
declare function formatProviderErrorPayload(payload: unknown): string | undefined;
/** Returns only the normalized provider detail string for callers that do not need metadata. */
declare function extractProviderErrorDetail(response: Response): Promise<string | undefined>;
/** Reads the provider request id header variants used across model and media APIs. */
declare function extractProviderRequestId(response: Response): string | undefined;
/** Builds the human-facing provider HTTP error message from normalized metadata. */
declare function formatProviderHttpErrorMessage(params: {
  label: string;
  status: number;
  detail?: string;
  requestId?: string;
  statusPrefix?: string;
}): string;
/** Creates a normalized provider HTTP error from a failed response. */
declare function createProviderHttpError(
  response: Response,
  label: string,
  options?: {
    statusPrefix?: string;
  },
): Promise<Error>;
/** Throws a normalized provider error when a fetch response is not OK. */
declare function assertOkOrThrowProviderError(response: Response, label: string): Promise<void>;
/** Throws a normalized generic HTTP error when a fetch response is not OK. */
declare function assertOkOrThrowHttpError(response: Response, label: string): Promise<void>;
/**
 * Parses a provider JSON response under a byte cap and wraps malformed JSON with the caller's label.
 *
 * The body is read through the same bounded reader as binary responses so a provider that streams an
 * unbounded JSON body cannot force the runtime to buffer the whole payload before parsing.
 */
declare function readProviderJsonResponse<T>(
  response: Response,
  label: string,
  opts?: {
    maxBytes?: number;
  },
): Promise<T>;
/** Parses a provider JSON response that must be a top-level object. */
declare function readProviderJsonObjectResponse(
  response: Response,
  label: string,
): Promise<Record<string, unknown>>;
/** Parses a provider JSON object response and returns an array field. */
declare function readProviderJsonArrayFieldResponse(
  response: Response,
  label: string,
  field: string,
): Promise<unknown[]>;
/** Rejects text or JSON responses on provider endpoints that should return binary bytes. */
declare function assertProviderBinaryResponseContent(
  response: Response,
  label: string,
  kind?: string,
): void;
/** Reads a bounded non-empty binary provider response after content-type validation. */
declare function readProviderBinaryResponse(
  response: Response,
  label: string,
  kind?: string,
  opts?: {
    maxBytes?: number;
  },
): Promise<Uint8Array>;
//#endregion
export {
  createProviderHttpError as a,
  formatProviderErrorPayload as c,
  readProviderJsonArrayFieldResponse as d,
  readProviderJsonObjectResponse as f,
  truncateErrorDetail as g,
  readResponseTextLimited as h,
  assertProviderBinaryResponseContent as i,
  formatProviderHttpErrorMessage as l,
  readProviderTextResponse as m,
  assertOkOrThrowHttpError as n,
  extractProviderErrorDetail as o,
  readProviderJsonResponse as p,
  assertOkOrThrowProviderError as r,
  extractProviderRequestId as s,
  asObject as t,
  readProviderBinaryResponse as u,
};
