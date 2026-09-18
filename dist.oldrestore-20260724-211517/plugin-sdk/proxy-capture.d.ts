import { Agent } from "node:http";
import { DatabaseSync } from "node:sqlite";

//#region src/proxy-capture/env.d.ts
type DebugProxySettings = {
  enabled: boolean;
  required: boolean;
  proxyUrl?: string /** @deprecated Capture storage now lives in the shared state database. */;
  dbPath: string /** @deprecated Capture payloads now live in the shared state database. */;
  blobDir: string;
  certDir: string;
  sessionId: string;
  sourceProcess: string;
};
declare function resolveDebugProxySettings(env?: NodeJS.ProcessEnv): DebugProxySettings;
declare function createDebugProxyWebSocketAgent(settings: DebugProxySettings): Agent | undefined;
declare function resolveEffectiveDebugProxyUrl(configuredProxyUrl?: string): string | undefined;
//#endregion
//#region src/proxy-capture/types.d.ts
type CaptureProtocol = "http" | "https" | "sse" | "ws" | "wss" | "connect";
type CaptureDirection = "outbound" | "inbound" | "local";
type CaptureEventKind =
  | "connect"
  | "tls-handshake"
  | "request"
  | "response"
  | "ws-open"
  | "ws-frame"
  | "ws-close"
  | "error"
  | "retry-link";
type CaptureSessionRecord = {
  id: string;
  startedAt: number;
  endedAt?: number;
  mode: string;
  sourceScope: "openclaw";
  sourceProcess: string;
  proxyUrl?: string /** @deprecated Capture storage now lives in the shared state database. */;
  dbPath?: string /** @deprecated Capture payloads now live in the shared state database. */;
  blobDir?: string;
};
type CaptureBlobRecord = {
  blobId: string;
  path: string;
  encoding: "gzip";
  sizeBytes: number;
  sha256: string;
  contentType?: string;
};
type SharedCaptureBlobRecord = Omit<CaptureBlobRecord, "path"> & {
  path?: never;
};
type CaptureEventRecord = {
  sessionId: string;
  ts: number;
  sourceScope: "openclaw";
  sourceProcess: string;
  protocol: CaptureProtocol;
  direction: CaptureDirection;
  kind: CaptureEventKind;
  flowId: string;
  method?: string;
  host?: string;
  path?: string;
  status?: number;
  closeCode?: number;
  contentType?: string;
  headersJson?: string;
  dataText?: string;
  dataBlobId?: string;
  dataSha256?: string;
  errorText?: string;
  metaJson?: string;
};
type CaptureQueryPreset =
  | "double-sends"
  | "retry-storms"
  | "cache-busting"
  | "ws-duplicate-frames"
  | "missing-ack"
  | "error-bursts";
type CaptureQueryRow = Record<string, string | number | null>;
type CaptureSessionSummary = {
  id: string;
  startedAt: number;
  endedAt?: number;
  mode: string;
  sourceProcess: string;
  proxyUrl?: string;
  eventCount: number;
};
type CaptureObservedDimension = {
  value: string;
  count: number;
};
type CaptureSessionCoverageSummary = {
  sessionId: string;
  totalEvents: number;
  unlabeledEventCount: number;
  providers: CaptureObservedDimension[];
  apis: CaptureObservedDimension[];
  models: CaptureObservedDimension[];
  hosts: CaptureObservedDimension[];
  localPeers: CaptureObservedDimension[];
};
//#endregion
//#region src/proxy-capture/store.sqlite.d.ts
type DebugProxyCaptureStoreOptions = {
  env?: NodeJS.ProcessEnv;
};
declare class DebugProxyCaptureStoreImpl {
  readonly db: DatabaseSync;
  readonly dbPath: string;
  readonly blobDir: string;
  private readonly pathBased?;
  private closed;
  constructor(optionsOrDbPath?: DebugProxyCaptureStoreOptions | string, legacyBlobDir?: string);
  close(): void;
  get isClosed(): boolean;
  upsertSession(session: CaptureSessionRecord): void;
  endSession(sessionId: string, endedAt?: number): void;
  persistPayload(data: Buffer, contentType?: string): CaptureBlobRecord | SharedCaptureBlobRecord;
  recordEvent(event: CaptureEventRecord): void;
  private insertEvent;
  listSessions(limit?: number): CaptureSessionSummary[];
  getSessionEvents(sessionId: string, limit?: number): Array<Record<string, unknown>>;
  summarizeSessionCoverage(sessionId: string): CaptureSessionCoverageSummary;
  readBlob(blobId: string): string | null;
  queryPreset(preset: CaptureQueryPreset, sessionId?: string): CaptureQueryRow[];
  purgeAll(): {
    sessions: number;
    events: number;
    blobs: number;
  };
  deleteSessions(sessionIds: string[]): {
    sessions: number;
    events: number;
    blobs: number;
  };
  private deletePathBasedSessions;
}
type DebugProxyCaptureStore = Omit<DebugProxyCaptureStoreImpl, "persistPayload"> & {
  persistPayload(data: Buffer, contentType?: string): CaptureBlobRecord | SharedCaptureBlobRecord;
};
type LegacyDebugProxyCaptureStore = Omit<DebugProxyCaptureStoreImpl, "persistPayload"> & {
  persistPayload(data: Buffer, contentType?: string): CaptureBlobRecord;
};
type SharedDebugProxyCaptureStore = Omit<DebugProxyCaptureStoreImpl, "persistPayload"> & {
  persistPayload(data: Buffer, contentType?: string): SharedCaptureBlobRecord;
};
type DebugProxyCaptureStoreConstructor = {
  new (dbPath: string, blobDir: string): LegacyDebugProxyCaptureStore;
  new (options?: DebugProxyCaptureStoreOptions): SharedDebugProxyCaptureStore;
};
declare const DebugProxyCaptureStore: DebugProxyCaptureStoreConstructor;
declare function getDebugProxyCaptureStore(
  dbPath: string,
  blobDir: string,
): LegacyDebugProxyCaptureStore;
declare function getDebugProxyCaptureStore(
  options?: DebugProxyCaptureStoreOptions,
): SharedDebugProxyCaptureStore;
declare function closeDebugProxyCaptureStore(): void;
declare function acquireDebugProxyCaptureStore(
  dbPath: string,
  blobDir: string,
): {
  store: LegacyDebugProxyCaptureStore;
  release: () => void;
};
declare function acquireDebugProxyCaptureStore(options?: DebugProxyCaptureStoreOptions): {
  store: SharedDebugProxyCaptureStore;
  release: () => void;
};
declare function persistEventPayload(
  store: {
    persistPayload(data: Buffer, contentType?: string): CaptureBlobRecord | SharedCaptureBlobRecord;
  },
  params: {
    data?: Buffer | string | null;
    contentType?: string;
    previewLimit?: number;
  },
): {
  dataText?: string;
  dataBlobId?: string;
  dataSha256?: string;
};
declare function safeJsonString(value: unknown): string | undefined;
//#endregion
//#region src/proxy-capture/runtime.d.ts
type DebugProxyCaptureStoreLike = Pick<
  ReturnType<typeof getDebugProxyCaptureStore>,
  "upsertSession" | "endSession" | "recordEvent"
>;
type DebugProxyCaptureRuntimeDeps = {
  getStore?: () => DebugProxyCaptureStoreLike;
  closeStore?: typeof closeDebugProxyCaptureStore;
  persistEventPayload?: (
    store: DebugProxyCaptureStoreLike,
    payload: Parameters<typeof persistEventPayload>[1],
  ) => ReturnType<typeof persistEventPayload>;
  safeJsonString?: typeof safeJsonString;
  fetchTarget?: typeof globalThis;
};
declare function isDebugProxyGlobalFetchPatchInstalled(): boolean;
declare function initializeDebugProxyCapture(
  mode: string,
  resolved?: DebugProxySettings,
  deps?: DebugProxyCaptureRuntimeDeps,
): void;
declare function finalizeDebugProxyCapture(
  resolved?: DebugProxySettings,
  deps?: DebugProxyCaptureRuntimeDeps,
): void;
declare function captureHttpExchange(
  params: {
    url: string;
    method: string;
    requestHeaders?: Headers | Record<string, string> | undefined;
    requestBody?: BodyInit | Buffer | string | null;
    response: Response;
    transport?: "http" | "sse";
    flowId?: string;
    meta?: Record<string, unknown>;
  },
  resolved?: DebugProxySettings,
  deps?: DebugProxyCaptureRuntimeDeps,
): void;
declare function captureWsEvent(
  params: {
    url: string;
    direction: "outbound" | "inbound" | "local";
    kind: "ws-open" | "ws-frame" | "ws-close" | "error";
    flowId: string;
    payload?: string | Buffer;
    closeCode?: number;
    errorText?: string;
    meta?: Record<string, unknown>;
  },
  resolved?: DebugProxySettings,
  deps?: DebugProxyCaptureRuntimeDeps,
): void;
//#endregion
export {
  type CaptureEventRecord,
  type CaptureQueryPreset,
  type CaptureQueryRow,
  type CaptureSessionSummary,
  DebugProxyCaptureStore,
  acquireDebugProxyCaptureStore,
  captureHttpExchange,
  captureWsEvent,
  closeDebugProxyCaptureStore,
  createDebugProxyWebSocketAgent,
  finalizeDebugProxyCapture,
  getDebugProxyCaptureStore,
  initializeDebugProxyCapture,
  isDebugProxyGlobalFetchPatchInstalled,
  resolveDebugProxySettings,
  resolveEffectiveDebugProxyUrl,
};
