//#region extensions/browser/src/browser/constants.ts
/**
 * Browser default configuration constants.
 *
 * Shared defaults for config resolution, tool schemas, managed Chrome launch,
 * tab cleanup, screenshots, and AI snapshot sizing.
 */
/** Default enabled state for the browser plugin. */
const DEFAULT_OPENCLAW_BROWSER_ENABLED = true;
/** Default JavaScript evaluation permission for managed browser actions. */
const DEFAULT_BROWSER_EVALUATE_ENABLED = true;
/** Default color for the managed OpenClaw browser profile. */
const DEFAULT_OPENCLAW_BROWSER_COLOR = "#FF4500";
/** Default managed profile name shown to users. */
const DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME = "openclaw";
/** Default browser profile selected when no profile is requested. */
const DEFAULT_BROWSER_DEFAULT_PROFILE_NAME = "openclaw";
/** Default timeout for browser action execution. */
const DEFAULT_BROWSER_ACTION_TIMEOUT_MS = 6e4;
/** Default timeout for browser download capture. */
const DEFAULT_BROWSER_DOWNLOAD_TIMEOUT_MS = 12e4;
/** Default launch readiness window for managed local Chrome. */
const DEFAULT_BROWSER_LOCAL_LAUNCH_TIMEOUT_MS = 15e3;
/** Default CDP readiness window after managed Chrome launch. */
const DEFAULT_BROWSER_LOCAL_CDP_READY_TIMEOUT_MS = 8e3;
/** Default timeout for screenshot capture. */
const DEFAULT_BROWSER_SCREENSHOT_TIMEOUT_MS = 2e4;
/** Default timeout for snapshot capture. */
const DEFAULT_BROWSER_SNAPSHOT_TIMEOUT_MS = 2e4;
/** Default maximum AI snapshot text size. */
const DEFAULT_AI_SNAPSHOT_MAX_CHARS = 4e4;
/** Default maximum AI snapshot text size in efficient mode. */
const DEFAULT_AI_SNAPSHOT_EFFICIENT_MAX_CHARS = 8e3;
//#endregion
export {
  DEFAULT_BROWSER_DOWNLOAD_TIMEOUT_MS as a,
  DEFAULT_BROWSER_LOCAL_LAUNCH_TIMEOUT_MS as c,
  DEFAULT_OPENCLAW_BROWSER_COLOR as d,
  DEFAULT_OPENCLAW_BROWSER_ENABLED as f,
  DEFAULT_BROWSER_DEFAULT_PROFILE_NAME as i,
  DEFAULT_BROWSER_SCREENSHOT_TIMEOUT_MS as l,
  DEFAULT_AI_SNAPSHOT_MAX_CHARS as n,
  DEFAULT_BROWSER_EVALUATE_ENABLED as o,
  DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME as p,
  DEFAULT_BROWSER_ACTION_TIMEOUT_MS as r,
  DEFAULT_BROWSER_LOCAL_CDP_READY_TIMEOUT_MS as s,
  DEFAULT_AI_SNAPSHOT_EFFICIENT_MAX_CHARS as t,
  DEFAULT_BROWSER_SNAPSHOT_TIMEOUT_MS as u,
};
