import { t as AcpSessionManager } from "./manager.core-BeEPUQQp.js";

//#region src/acp/control-plane/manager.d.ts
/** Returns the process-wide ACP session manager singleton. */
declare function getAcpSessionManager(): AcpSessionManager;
declare const testing: {
  resetAcpSessionManagerForTests(): void;
  setAcpSessionManagerForTests(manager: unknown): void;
};
//#endregion
export { testing as n, getAcpSessionManager as t };
