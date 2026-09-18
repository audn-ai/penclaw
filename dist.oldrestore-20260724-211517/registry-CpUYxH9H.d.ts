import { t as AcpRuntime } from "./types-D85xy4rc.js";

//#region src/acp/runtime/registry.d.ts
/** Registered ACP backend with optional health probe used for auto-selection. */
type AcpRuntimeBackend = {
  id: string;
  runtime: AcpRuntime;
  healthy?: () => boolean;
};
/** Registers or replaces an ACP runtime backend by normalized id. */
declare function registerAcpRuntimeBackend(backend: AcpRuntimeBackend): void;
/** Removes a registered ACP runtime backend by id. */
declare function unregisterAcpRuntimeBackend(id: string): void;
/** Resolves a backend by id, or the first healthy backend when no id is supplied. */
declare function getAcpRuntimeBackend(id?: string): AcpRuntimeBackend | null;
/** Resolves a healthy backend or throws a typed ACP runtime error. */
declare function requireAcpRuntimeBackend(id?: string): AcpRuntimeBackend;
//#endregion
export {
  unregisterAcpRuntimeBackend as a,
  requireAcpRuntimeBackend as i,
  getAcpRuntimeBackend as n,
  registerAcpRuntimeBackend as r,
  AcpRuntimeBackend as t,
};
