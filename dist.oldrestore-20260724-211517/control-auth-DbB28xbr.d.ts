import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region extensions/browser/src/browser/control-auth.d.ts
/** Auth material accepted by browser-control HTTP middleware and clients. */
type BrowserControlAuth = {
  token?: string;
  password?: string;
};
/** Resolve browser-control auth material from config and environment. */
declare function resolveBrowserControlAuth(
  cfg?: OpenClawConfig,
  env?: NodeJS.ProcessEnv,
): BrowserControlAuth;
/** Return true when startup may auto-generate browser-control auth. */
declare function shouldAutoGenerateBrowserAuth(env: NodeJS.ProcessEnv): boolean;
/** Ensure browser-control auth exists, generating and persisting it when allowed. */
declare function ensureBrowserControlAuth(params: {
  cfg: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
}): Promise<{
  auth: BrowserControlAuth;
  generatedToken?: string;
}>;
//#endregion
export {
  shouldAutoGenerateBrowserAuth as i,
  ensureBrowserControlAuth as n,
  resolveBrowserControlAuth as r,
  BrowserControlAuth as t,
};
