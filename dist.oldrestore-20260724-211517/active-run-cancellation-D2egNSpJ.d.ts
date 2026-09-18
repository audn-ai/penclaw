//#region src/cron/service/active-run-cancellation.d.ts
declare function abortActiveCronTaskRuns(reason?: string): number;
/** Retires restart-drain bookkeeping without hiding still-running cores from suspension. */
declare function retireActiveCronTaskRunTracking(): void;
declare function waitForActiveCronTaskRuns(timeoutMs: number): Promise<{
  drained: boolean;
  active: number;
}>;
declare function cancelActiveCronTaskRun(params: {
  runId: string | undefined;
  reason?: string;
}): boolean;
//#endregion
export {
  waitForActiveCronTaskRuns as i,
  cancelActiveCronTaskRun as n,
  retireActiveCronTaskRunTracking as r,
  abortActiveCronTaskRuns as t,
};
