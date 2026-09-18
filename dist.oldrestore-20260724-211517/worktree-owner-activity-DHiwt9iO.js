import { u as loadSessionEntry } from "./session-utils-DjTWBI0J.js";
import "./service-Dhl824Yp.js";
//#region src/gateway/worktree-owner-activity.ts
function isManagedWorktreeOwnerActive(ownerKind, ownerId) {
  if (ownerKind !== "session") return false;
  try {
    const entry = loadSessionEntry(ownerId, { clone: false }).entry;
    const activityAt = Math.max(entry?.lastInteractionAt ?? 0, entry?.updatedAt ?? 0);
    return activityAt > 0 && Date.now() - activityAt <= 6048e5;
  } catch {
    return false;
  }
}
//#endregion
export { isManagedWorktreeOwnerActive as t };
