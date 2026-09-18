import { t as pruneStaleCommandPolls$1 } from "./command-poll-backoff-Bl8MZxpL.js";
//#region src/agents/command-poll-backoff.runtime.ts
/**
 * Runtime seam for command poll backoff cleanup.
 */
/** Prune stale command polls using the production backoff implementation. */
function pruneStaleCommandPolls(...args) {
  return pruneStaleCommandPolls$1(...args);
}
//#endregion
export { pruneStaleCommandPolls };
