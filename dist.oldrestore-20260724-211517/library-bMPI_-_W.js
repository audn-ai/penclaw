import { t as createDefaultDeps } from "./deps-BDX9tA_j.js";
import { a as loadConfig } from "./io-B3ne6NxF.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import "./config-BDv-QbJ6.js";
import { l as resolveStorePath } from "./paths-TfuVT-K8.js";
import {
  i as handlePortError,
  n as describePortOwner,
  r as ensurePortAvailable,
  t as PortInUseError,
} from "./ports-miNUZKci.js";
import { n as resolveSessionKey, t as deriveSessionKey } from "./session-key-Beu1vXbM.js";
import { i as saveSessionStore, u as loadSessionStore } from "./store-CzZJhTF6.js";
import { t as applyTemplate } from "./templating-CLmjS51i.js";
import { c as normalizeE164 } from "./utils-DtcDeqWS.js";
import { t as waitForever } from "./wait-DkbQDWtA.js";
//#region src/library.ts
const loadReplyRuntime = createLazyRuntimeModule(() => import("./reply.runtime.js"));
const loadPromptRuntime = createLazyRuntimeModule(() => import("./prompt-C8Tlccyz.js"));
const loadBinariesRuntime = createLazyRuntimeModule(() => import("./binaries-CzhUY3FD.js"));
const loadExecRuntime = createLazyRuntimeModule(() => import("./exec-BQen4BoJ.js"));
const loadWebChannelRuntime = createLazyRuntimeModule(
  () => import("./runtime-web-channel-plugin-mL_WKQvm.js"),
);
const getReplyFromConfig = async (...args) =>
  (await loadReplyRuntime()).getReplyFromConfig(...args);
const promptYesNo = async (...args) => (await loadPromptRuntime()).promptYesNo(...args);
const ensureBinary = async (...args) => (await loadBinariesRuntime()).ensureBinary(...args);
const runExec = async (...args) => (await loadExecRuntime()).runExec(...args);
const runCommandWithTimeout = async (...args) =>
  (await loadExecRuntime()).runCommandWithTimeout(...args);
const monitorWebChannel = async (...args) =>
  (await loadWebChannelRuntime()).monitorWebChannel(...args);
//#endregion
export {
  PortInUseError,
  applyTemplate,
  createDefaultDeps,
  deriveSessionKey,
  describePortOwner,
  ensureBinary,
  ensurePortAvailable,
  getReplyFromConfig,
  handlePortError,
  loadConfig,
  loadSessionStore,
  monitorWebChannel,
  normalizeE164,
  promptYesNo,
  resolveSessionKey,
  resolveStorePath,
  runCommandWithTimeout,
  runExec,
  saveSessionStore,
  waitForever,
};
