import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { n as appendMemoryHostEvent } from "./events-B-Dr_eF7.js";
import "./memory-host-events-1465bDCf.js";
import "./dreaming-shared-BS6J1klu.js";
import { n as resolveMemoryCoreTimestamp, t as resolveMemoryCoreNowMs } from "./time-ngD8glCa.js";
//#region extensions/memory-core/src/dreaming-events.ts
async function appendFailedDreamingEvent(params) {
  try {
    await appendMemoryHostEvent(params.workspaceDir, {
      type: "memory.dream.completed",
      timestamp: resolveMemoryCoreTimestamp(resolveMemoryCoreNowMs(params.nowMs)),
      phase: params.phase,
      outcome: "failed",
      error: params.error,
      lineCount: 0,
      storageMode: params.storageMode,
    });
  } catch (err) {
    params.logger.warn(
      `memory-core: failed to write ${params.phase} dreaming outcome event for workspace ${params.workspaceDir}: ${formatErrorMessage(err)}`,
    );
  }
}
//#endregion
export { appendFailedDreamingEvent as t };
