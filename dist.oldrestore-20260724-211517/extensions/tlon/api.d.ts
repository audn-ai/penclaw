import { t as tlonPlugin } from "../../channel-CiorFb4V.js";
import { r as createDedupeCache } from "../../dedupe-DlnrYV_t.js";
import { a as fetchWithSsrFGuard } from "../../fetch-guard-BKvfwdRa.js";
import { r as ReplyPayload } from "../../reply-payload-D9hNZyN3.js";
import { n as RuntimeEnv } from "../../runtime-Bxifh4bY.js";
import { t as createLoggerBackedRuntime } from "../../runtime-logger-DNnQ2PUM.js";
import {
  d as ssrfPolicyFromDangerouslyAllowPrivateNetwork,
  u as ssrfPolicyFromAllowPrivateNetwork,
} from "../../ssrf-policy-DRCuJf07.js";
import {
  a as SsrFBlockedError,
  o as SsrFPolicy,
  p as isBlockedHostnameOrIp,
  t as LookupFn,
} from "../../ssrf-skjEI_i5.js";
import { cr as PluginRuntime } from "../../types-Ga3mNO_F.js";
import { i as OpenClawConfig } from "../../types.openclaw-DDo8sH3F.js";

//#region extensions/tlon/src/runtime.d.ts
declare const setTlonRuntime: (next: PluginRuntime) => void, getTlonRuntime: () => PluginRuntime;
//#endregion
export {
  type LookupFn,
  type OpenClawConfig,
  type ReplyPayload,
  type RuntimeEnv,
  SsrFBlockedError,
  type SsrFPolicy,
  createDedupeCache,
  createLoggerBackedRuntime,
  fetchWithSsrFGuard,
  isBlockedHostnameOrIp,
  setTlonRuntime,
  ssrfPolicyFromAllowPrivateNetwork,
  ssrfPolicyFromDangerouslyAllowPrivateNetwork,
  tlonPlugin,
};
