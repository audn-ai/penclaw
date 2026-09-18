import { Dispatcher } from "undici";

//#region src/infra/net/undici-runtime.d.ts
/** Runtime-loaded undici constructors/functions used where static imports would affect globals. */
type UndiciRuntimeDeps = {
  Agent: typeof import("undici").Agent;
  EnvHttpProxyAgent: typeof import("undici").EnvHttpProxyAgent;
  FormData?: typeof import("undici").FormData;
  ProxyAgent: typeof import("undici").ProxyAgent;
  fetch: typeof import("undici").fetch;
};
type UndiciEnvHttpProxyAgentOptions = ConstructorParameters<
  UndiciRuntimeDeps["EnvHttpProxyAgent"]
>[0];
type UndiciProxyAgentOptions = ConstructorParameters<UndiciRuntimeDeps["ProxyAgent"]>[0];
/** Loads undici lazily, allowing tests to inject constructors without global side effects. */
/**
 * Creates an EnvHttpProxyAgent with OpenClaw proxy TLS, IP-safe proxy pools,
 * timeout propagation, and HTTP/1-only dispatch.
 */
declare function createHttp1EnvHttpProxyAgent(
  options?: UndiciEnvHttpProxyAgentOptions,
  timeoutMs?: number,
): import("undici").EnvHttpProxyAgent;
/**
 * Creates a fixed ProxyAgent with the same HTTP/1, managed TLS, timeout, and
 * IP-safe proxy connection policy used by env proxy dispatchers.
 */
declare function createHttp1ProxyAgent(
  options: UndiciProxyAgentOptions,
  timeoutMs?: number,
): import("undici").ProxyAgent;
//#endregion
//#region src/infra/net/runtime-fetch.d.ts
type DispatcherAwareRequestInit = RequestInit & {
  dispatcher?: Dispatcher;
};
type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
/** Returns true for Vitest-style mocked fetch functions that should stay injectable. */
declare function isMockedFetch(fetchImpl: FetchLike | undefined): boolean;
/** Uses the undici runtime fetch so callers can pass dispatcher-aware options. */
declare function fetchWithRuntimeDispatcher(
  input: RequestInfo | URL,
  init?: DispatcherAwareRequestInit,
): Promise<Response>;
/**
 * Uses test-injected global fetch when present, otherwise preserves dispatcher
 * support by routing through the undici runtime fetch.
 */
declare function fetchWithRuntimeDispatcherOrMockedGlobal(
  input: RequestInfo | URL,
  init?: DispatcherAwareRequestInit,
): Promise<Response>;
//#endregion
export {
  createHttp1EnvHttpProxyAgent as a,
  isMockedFetch as i,
  fetchWithRuntimeDispatcher as n,
  createHttp1ProxyAgent as o,
  fetchWithRuntimeDispatcherOrMockedGlobal as r,
  DispatcherAwareRequestInit as t,
};
