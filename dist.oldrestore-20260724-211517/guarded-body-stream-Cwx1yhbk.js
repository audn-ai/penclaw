//#region src/infra/net/guarded-body-stream.ts
/**
 * Shared body-stream cleanup for guarded fetch consumers (`fetchWithSsrFGuard`
 * callers that re-wrap streaming responses).
 */
const guardedBodyCleanupRegistry = new FinalizationRegistry((held) => {
  held.finalize();
});
/**
 * Wraps a guarded response body so caller cleanup runs exactly once when the
 * stream completes, errors, is cancelled, or is garbage-collected unconsumed.
 * Cleanup failures are swallowed: releasing guard resources must never break
 * response consumption.
 */
function wrapGuardedBodyStream(params) {
  let reader;
  let finalized = false;
  const cleanupRegistrationToken = {};
  const finalize = async () => {
    if (finalized) return;
    finalized = true;
    guardedBodyCleanupRegistry.unregister(cleanupRegistrationToken);
    await reader?.cancel().catch(() => void 0);
    try {
      await params.cleanup();
    } catch {}
  };
  const wrappedBody = new ReadableStream({
    start() {
      reader = params.body.getReader();
    },
    async pull(controller) {
      try {
        const chunk = await reader?.read();
        if (!chunk || chunk.done) {
          controller.close();
          await finalize();
          return;
        }
        params.refreshTimeout?.();
        controller.enqueue(chunk.value);
      } catch (error) {
        controller.error(error);
        await finalize();
      }
    },
    async cancel(reason) {
      try {
        await reader?.cancel(reason);
      } finally {
        await finalize();
      }
    },
  });
  guardedBodyCleanupRegistry.register(wrappedBody, { finalize }, cleanupRegistrationToken);
  return wrappedBody;
}
//#endregion
export { wrapGuardedBodyStream as t };
