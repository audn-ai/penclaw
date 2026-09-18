import { t as callGatewayCli } from "./call-BDDQRtqY.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { i as writeRuntimeJson } from "./runtime-Bz6o617W.js";
//#region src/commands/sessions-compact.ts
/**
 * Sessions compact command.
 *
 * Wraps the `sessions.compact` Gateway RPC behind `openclaw sessions compact <key>`
 * so wedged sessions have a documented, first-class recovery path. The command
 * propagates a non-zero exit whenever the gateway reports a failed compaction
 * (transport error or an `ok:false` payload) so automation never mistakes a
 * silent no-op for success.
 */
function describeCompaction(result, fallbackKey) {
  const sessionKey = result.key ?? fallbackKey;
  if (!result.compacted) {
    if (result.result?.details?.pending === true)
      return `Compaction started for session ${sessionKey} (pending; completion is reported asynchronously by the backend).`;
    return `No compaction needed for session ${sessionKey}${result.reason ? ` (${result.reason})` : ""}.`;
  }
  const before = result.result?.tokensBefore;
  const after = result.result?.tokensAfter;
  let detail = "";
  if (typeof before === "number" && typeof after === "number")
    detail = ` (${before} → ${after} tokens)`;
  else if (typeof result.kept === "number") detail = ` (kept ${result.kept} lines)`;
  return `Compacted session ${sessionKey}${detail}.`;
}
/** Run `openclaw sessions compact <key>` against the running gateway. */
async function sessionsCompactCommand(opts, runtime) {
  const rpcOpts = {
    url: opts.url,
    token: opts.token,
    password: opts.password,
    timeout: opts.timeout ?? null,
    json: opts.json,
  };
  const params = {
    key: opts.key,
    ...(opts.agent ? { agentId: opts.agent } : {}),
    ...(opts.maxLines !== void 0 ? { maxLines: opts.maxLines } : {}),
  };
  let result;
  try {
    result = await callGatewayCli("sessions.compact", rpcOpts, params);
  } catch (err) {
    const message = formatErrorMessage(err);
    if (opts.json)
      writeRuntimeJson(runtime, {
        ok: false,
        key: opts.key,
        error: message,
      });
    else runtime.error(`Compaction failed: ${message}`);
    runtime.exit(1);
    return;
  }
  const failed = result?.ok !== true;
  if (opts.json) {
    writeRuntimeJson(runtime, result);
    if (failed) runtime.exit(1);
    return;
  }
  if (failed) {
    const sessionKey = result?.key ?? opts.key;
    const reason = result?.reason ? `: ${result.reason}` : "";
    runtime.error(`Compaction failed for session ${sessionKey}${reason}.`);
    runtime.exit(1);
    return;
  }
  runtime.log(describeCompaction(result ?? {}, opts.key));
  if (result?.archived) runtime.log(`Archived transcript: ${result.archived}`);
}
//#endregion
export { sessionsCompactCommand };
