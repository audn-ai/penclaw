//#region src/infra/scp-host.d.ts
/** Normalize an optional `[user@]host` SCP target or reject unsafe tokens. */
declare function normalizeScpRemoteHost(value: string | null | undefined): string | undefined;
/** Return true when a value is safe for the SCP host position. */
declare function isSafeScpRemoteHost(value: string | null | undefined): boolean;
/** Normalize an absolute remote path that is safe for SCP command construction. */
declare function normalizeScpRemotePath(value: string | null | undefined): string | undefined;
/** Return true when a value is safe for the SCP remote path position. */
declare function isSafeScpRemotePath(value: string | null | undefined): boolean;
//#endregion
export {
  normalizeScpRemotePath as i,
  isSafeScpRemotePath as n,
  normalizeScpRemoteHost as r,
  isSafeScpRemoteHost as t,
};
