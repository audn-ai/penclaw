//#region extensions/browser/src/browser/session-tab-registry.d.ts
type SessionBrowserTabIdentityParams = {
  sessionKey?: string;
  targetId?: string;
  baseUrl?: string;
  profile?: string;
};
/** Starts tracking a browser tab for later session cleanup. */
declare function trackSessionBrowserTab(params: SessionBrowserTabIdentityParams): void;
/** Removes a browser tab from session cleanup tracking. */
declare function untrackSessionBrowserTab(params: SessionBrowserTabIdentityParams): void;
/** Closes and untracks tabs for the supplied session keys. */
declare function closeTrackedBrowserTabsForSessions(params: {
  sessionKeys: Array<string | undefined>;
  closeTab?: (tab: { targetId: string; baseUrl?: string; profile?: string }) => Promise<void>;
  onWarn?: (message: string) => void;
}): Promise<number>;
//#endregion
//#region extensions/browser/src/browser/trash.d.ts
/** Moves a path to trash only when it lives under allowed Browser roots. */
declare function movePathToTrash(targetPath: string): Promise<string>;
//#endregion
export {
  untrackSessionBrowserTab as i,
  closeTrackedBrowserTabsForSessions as n,
  trackSessionBrowserTab as r,
  movePathToTrash as t,
};
