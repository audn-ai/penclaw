import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region extensions/matrix/src/account-selection.d.ts
declare function resolveMatrixChannelConfig(cfg: OpenClawConfig): Record<string, unknown> | null;
declare function findMatrixAccountEntry(
  cfg: OpenClawConfig,
  accountId: string,
): Record<string, unknown> | null;
declare function resolveConfiguredMatrixAccountIds(
  cfg: OpenClawConfig,
  env?: NodeJS.ProcessEnv,
): string[];
declare function resolveMatrixDefaultOrOnlyAccountId(
  cfg: OpenClawConfig,
  env?: NodeJS.ProcessEnv,
): string;
declare function requiresExplicitMatrixDefaultAccount(
  cfg: OpenClawConfig,
  env?: NodeJS.ProcessEnv,
): boolean;
//#endregion
//#region extensions/matrix/src/env-vars.d.ts
declare function resolveMatrixEnvAccountToken(accountId: string): string;
declare function getMatrixScopedEnvVarNames(accountId: string): {
  homeserver: string;
  userId: string;
  accessToken: string;
  password: string;
  deviceId: string;
  deviceName: string;
};
declare function listMatrixEnvAccountIds(env?: NodeJS.ProcessEnv): string[];
//#endregion
//#region extensions/matrix/src/storage-paths.d.ts
declare function sanitizeMatrixPathSegment(value: string): string;
declare function resolveMatrixHomeserverKey(homeserver: string): string;
declare function hashMatrixAccessToken(accessToken: string): string;
declare function resolveMatrixCredentialsFilename(accountId?: string | null): string;
declare function resolveMatrixCredentialsDir(stateDir: string): string;
declare function resolveMatrixCredentialsPath(params: {
  stateDir: string;
  accountId?: string | null;
}): string;
declare function resolveMatrixAccountStorageRoot(params: {
  stateDir: string;
  homeserver: string;
  userId: string;
  accessToken: string;
  accountId?: string | null;
}): {
  rootDir: string;
  accountKey: string;
  tokenHash: string;
};
//#endregion
export {
  resolveMatrixCredentialsPath as a,
  getMatrixScopedEnvVarNames as c,
  findMatrixAccountEntry as d,
  requiresExplicitMatrixDefaultAccount as f,
  resolveMatrixDefaultOrOnlyAccountId as h,
  resolveMatrixCredentialsFilename as i,
  listMatrixEnvAccountIds as l,
  resolveMatrixChannelConfig as m,
  resolveMatrixAccountStorageRoot as n,
  resolveMatrixHomeserverKey as o,
  resolveConfiguredMatrixAccountIds as p,
  resolveMatrixCredentialsDir as r,
  sanitizeMatrixPathSegment as s,
  hashMatrixAccessToken as t,
  resolveMatrixEnvAccountToken as u,
};
