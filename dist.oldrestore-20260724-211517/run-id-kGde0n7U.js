//#region src/cron/run-id.ts
/** Builds the stable diagnostic/session execution id for a single cron run. */
function createCronExecutionId(jobId, startedAt) {
  return `cron:${jobId}:${startedAt}`;
}
//#endregion
export { createCronExecutionId as t };
