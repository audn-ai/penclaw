import { IncomingMessage, ServerResponse } from "node:http";

//#region src/infra/http-body.d.ts
declare const DEFAULT_WEBHOOK_MAX_BODY_BYTES: number;
declare const DEFAULT_WEBHOOK_BODY_TIMEOUT_MS = 30000;
type RequestBodyLimitErrorCode = "PAYLOAD_TOO_LARGE" | "REQUEST_BODY_TIMEOUT" | "CONNECTION_CLOSED";
type RequestBodyLimitErrorInit = {
  code: RequestBodyLimitErrorCode;
  message?: string;
};
declare class RequestBodyLimitError extends Error {
  readonly code: RequestBodyLimitErrorCode;
  readonly statusCode: number;
  constructor(init: RequestBodyLimitErrorInit);
}
declare function isRequestBodyLimitError(
  error: unknown,
  code?: RequestBodyLimitErrorCode,
): error is RequestBodyLimitError;
declare function requestBodyErrorToText(code: RequestBodyLimitErrorCode): string;
type ReadRequestBodyOptions = {
  maxBytes: number;
  timeoutMs?: number;
  encoding?: BufferEncoding;
};
type RequestBodyLimitValues = {
  maxBytes: number;
  timeoutMs: number;
};
declare function resolveRequestBodyLimitValues(options: {
  maxBytes: number;
  timeoutMs?: number;
}): RequestBodyLimitValues;
declare const testApi: {
  resolveRequestBodyLimitValues: typeof resolveRequestBodyLimitValues;
};
/** Reads one chunk, rejecting and cancelling the reader after an idle timeout. */
declare function readChunkWithIdleTimeout(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  chunkTimeoutMs: number,
  onIdleTimeout?: (params: { chunkTimeoutMs: number }) => Error,
): Promise<Awaited<ReturnType<typeof reader.read>>>;
type ReadResponseTextPrefixOptions = {
  chunkTimeoutMs?: number;
  onIdleTimeout?: (params: { chunkTimeoutMs: number }) => Error;
};
type ReadResponseTextPrefixResult = {
  text: string;
  size: number;
  truncated: boolean;
};
/** Reads and decodes a bounded text prefix while cancelling unread overflow. */
declare function readResponseTextPrefix(
  response: Response,
  maxBytes: number,
  options?: ReadResponseTextPrefixOptions,
): Promise<ReadResponseTextPrefixResult>;
/** Reads a response body under a byte cap, cancelling the stream on overflow or idle timeout. */
declare function readResponseWithLimit(
  response: Response,
  maxBytes: number,
  options?: {
    onOverflow?: (params: { size: number; maxBytes: number; res: Response }) => Error;
    chunkTimeoutMs?: number;
    onIdleTimeout?: (params: { chunkTimeoutMs: number }) => Error;
  },
): Promise<Buffer>;
/** Reads a small collapsed text prefix from a response body for diagnostics/errors. */
declare function readResponseTextSnippet(
  response: Response,
  options?: {
    maxBytes?: number;
    maxChars?: number;
    chunkTimeoutMs?: number;
    onIdleTimeout?: (params: { chunkTimeoutMs: number }) => Error;
  },
): Promise<string | undefined>;
declare function readRequestBodyWithLimit(
  req: IncomingMessage,
  options: ReadRequestBodyOptions,
): Promise<string>;
type ReadJsonBodyResult =
  | {
      ok: true;
      value: unknown;
    }
  | {
      ok: false;
      error: string;
      code: RequestBodyLimitErrorCode | "INVALID_JSON";
    };
type ReadJsonBodyOptions = ReadRequestBodyOptions & {
  emptyObjectOnEmpty?: boolean;
};
declare function readJsonBodyWithLimit(
  req: IncomingMessage,
  options: ReadJsonBodyOptions,
): Promise<ReadJsonBodyResult>;
type RequestBodyLimitGuard = {
  dispose: () => void;
  isTripped: () => boolean;
  code: () => RequestBodyLimitErrorCode | null;
};
type RequestBodyLimitGuardOptions = {
  maxBytes: number;
  timeoutMs?: number;
  responseFormat?: "json" | "text";
  responseText?: Partial<Record<RequestBodyLimitErrorCode, string>>;
};
declare function installRequestBodyLimitGuard(
  req: IncomingMessage,
  res: ServerResponse,
  options: RequestBodyLimitGuardOptions,
): RequestBodyLimitGuard;
//#endregion
export {
  readResponseTextPrefix as _,
  ReadRequestBodyOptions as a,
  requestBodyErrorToText as b,
  RequestBodyLimitError as c,
  RequestBodyLimitGuardOptions as d,
  installRequestBodyLimitGuard as f,
  readRequestBodyWithLimit as g,
  readJsonBodyWithLimit as h,
  ReadJsonBodyResult as i,
  RequestBodyLimitErrorCode as l,
  readChunkWithIdleTimeout as m,
  DEFAULT_WEBHOOK_MAX_BODY_BYTES as n,
  ReadResponseTextPrefixOptions as o,
  isRequestBodyLimitError as p,
  ReadJsonBodyOptions as r,
  ReadResponseTextPrefixResult as s,
  DEFAULT_WEBHOOK_BODY_TIMEOUT_MS as t,
  RequestBodyLimitGuard as u,
  readResponseTextSnippet as v,
  testApi as x,
  readResponseWithLimit as y,
};
