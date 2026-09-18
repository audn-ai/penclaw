import { n as isTruthyEnvValue } from "./env-Di-LcxqW.js";
import { t as startGmailWatcher } from "./gmail-watcher-CDn5WV9H.js";
//#region src/hooks/gmail-watcher-lifecycle.ts
/** Start the Gmail watcher with startup logs and env-based skip handling. */
async function startGmailWatcherWithLogs(params) {
  if (isTruthyEnvValue(process.env.OPENCLAW_SKIP_GMAIL_WATCHER)) {
    params.onSkipped?.();
    return;
  }
  try {
    const gmailResult = await startGmailWatcher(params.cfg, {
      isCancelled: params.isCancelled,
      signal: params.signal,
    });
    if (gmailResult.started) {
      params.log.info("gmail watcher started");
      return;
    }
    if (
      gmailResult.reason &&
      gmailResult.reason !== "hooks not enabled" &&
      gmailResult.reason !== "no gmail account configured"
    )
      params.log.warn(`gmail watcher not started: ${gmailResult.reason}`);
  } catch (err) {
    params.log.error(`gmail watcher failed to start: ${String(err)}`);
  }
}
//#endregion
export { startGmailWatcherWithLogs };
