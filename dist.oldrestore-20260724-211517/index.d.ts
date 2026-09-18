import { t as CliDeps } from "./deps.types-BdV6g6qp.js";
import { n as runExec$2, o as runCommandWithTimeout$2 } from "./exec-D8nvu0GV.js";
import { t as getReplyFromConfig$2 } from "./get-reply-DTjLX1jo.js";
import { d as loadConfig$1 } from "./io-BbgXkYnD.js";
import {
  i as handlePortError$1,
  n as describePortOwner$1,
  r as ensurePortAvailable$1,
  t as PortInUseError$1,
} from "./ports-BOCxg58Q.js";
import { n as RuntimeEnv } from "./runtime-Bxifh4bY.js";
import {
  i as resolveStorePath$1,
  n as resolveSessionKey$1,
  t as deriveSessionKey$1,
} from "./session-key-D5blOtL7.js";
import { r as loadSessionStore$1, t as saveSessionStore$1 } from "./store-DqqHyvXY.js";
import { o as applyTemplate$1 } from "./templating-h3OQefFR.js";
import { c as normalizeE164$1 } from "./utils-fb973z5A.js";
import { t as waitForever$1 } from "./wait-isUfz79Z.js";

//#region src/cli/deps.d.ts
declare function createDefaultDeps$1(): CliDeps;
//#endregion
//#region src/cli/prompt.d.ts
/** Prompts for yes/no input, honoring global `--yes` before opening stdin. */
declare function promptYesNo$2(question: string, defaultYes?: boolean): Promise<boolean>;
//#endregion
//#region src/infra/binaries.d.ts
declare function ensureBinary$2(
  name: string,
  exec?: typeof runExec$2,
  runtime?: RuntimeEnv,
): Promise<void>;
//#endregion
//#region src/plugins/runtime/runtime-web-channel-plugin.d.ts
type WebChannelHeavyRuntimeModule = {
  loginWeb: (
    verbose: boolean,
    waitForConnection?: (sock: unknown) => Promise<void>,
    runtime?: unknown,
    accountId?: string,
  ) => Promise<void>;
  monitorWebChannel: (...args: unknown[]) => Promise<unknown>;
  monitorWebInbox: (...args: unknown[]) => Promise<unknown>;
  startWebLoginWithQr: (...args: unknown[]) => Promise<unknown>;
  waitForWebLogin: (...args: unknown[]) => Promise<unknown>;
  extractMediaPlaceholder: (...args: unknown[]) => unknown;
  extractText: (...args: unknown[]) => unknown;
};
/** Returns the active web channel listener from the light runtime API. */
/** Starts web-channel monitoring through the heavy runtime API. */
declare function monitorWebChannel$2(
  ...args: Parameters<WebChannelHeavyRuntimeModule["monitorWebChannel"]>
): ReturnType<WebChannelHeavyRuntimeModule["monitorWebChannel"]>;
declare namespace library_d_exports {
  export {
    PortInUseError$1 as PortInUseError,
    applyTemplate$1 as applyTemplate,
    createDefaultDeps$1 as createDefaultDeps,
    deriveSessionKey$1 as deriveSessionKey,
    describePortOwner$1 as describePortOwner,
    ensureBinary$1 as ensureBinary,
    ensurePortAvailable$1 as ensurePortAvailable,
    getReplyFromConfig$1 as getReplyFromConfig,
    handlePortError$1 as handlePortError,
    loadConfig$1 as loadConfig,
    loadSessionStore$1 as loadSessionStore,
    monitorWebChannel$1 as monitorWebChannel,
    normalizeE164$1 as normalizeE164,
    promptYesNo$1 as promptYesNo,
    resolveSessionKey$1 as resolveSessionKey,
    resolveStorePath$1 as resolveStorePath,
    runCommandWithTimeout$1 as runCommandWithTimeout,
    runExec$1 as runExec,
    saveSessionStore$1 as saveSessionStore,
    waitForever$1 as waitForever,
  };
}
type GetReplyFromConfig = typeof getReplyFromConfig$2;
type PromptYesNo = typeof promptYesNo$2;
type EnsureBinary = typeof ensureBinary$2;
type RunExec = typeof runExec$2;
type RunCommandWithTimeout = typeof runCommandWithTimeout$2;
type MonitorWebChannel = typeof monitorWebChannel$2;
declare const getReplyFromConfig$1: GetReplyFromConfig;
declare const promptYesNo$1: PromptYesNo;
declare const ensureBinary$1: EnsureBinary;
declare const runExec$1: RunExec;
declare const runCommandWithTimeout$1: RunCommandWithTimeout;
declare const monitorWebChannel$1: MonitorWebChannel;
//#endregion
//#region src/index.d.ts
type LegacyCliDeps = {
  runCli: (argv: string[]) => Promise<void>;
};
type LibraryExports = typeof library_d_exports;
declare let applyTemplate: LibraryExports["applyTemplate"];
declare let createDefaultDeps: LibraryExports["createDefaultDeps"];
declare let deriveSessionKey: LibraryExports["deriveSessionKey"];
declare let describePortOwner: LibraryExports["describePortOwner"];
declare let ensureBinary: LibraryExports["ensureBinary"];
declare let ensurePortAvailable: LibraryExports["ensurePortAvailable"];
declare let getReplyFromConfig: LibraryExports["getReplyFromConfig"];
declare let handlePortError: LibraryExports["handlePortError"];
declare let loadConfig: LibraryExports["loadConfig"];
declare let loadSessionStore: LibraryExports["loadSessionStore"];
declare let monitorWebChannel: LibraryExports["monitorWebChannel"];
declare let normalizeE164: LibraryExports["normalizeE164"];
declare let PortInUseError: LibraryExports["PortInUseError"];
declare let promptYesNo: LibraryExports["promptYesNo"];
declare let resolveSessionKey: LibraryExports["resolveSessionKey"];
declare let resolveStorePath: LibraryExports["resolveStorePath"];
declare let runCommandWithTimeout: LibraryExports["runCommandWithTimeout"];
declare let runExec: LibraryExports["runExec"];
declare let saveSessionStore: LibraryExports["saveSessionStore"];
declare let waitForever: LibraryExports["waitForever"];
declare function runLegacyCliEntry(argv?: string[], deps?: LegacyCliDeps): Promise<void>;
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
  runLegacyCliEntry,
  saveSessionStore,
  waitForever,
};
