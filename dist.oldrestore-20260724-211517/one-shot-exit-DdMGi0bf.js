import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
//#region src/cli/one-shot-exit.ts
let requestedExitCode;
function resolveVitestWorkerMarkers() {
  const processMarkers = process;
  const globalMarkers = globalThis;
  return {
    tinypoolState: processMarkers["__tinypool_state__"],
    vitestWorker: globalMarkers["__vitest_worker__"],
  };
}
function isVitestWorker(env, markers = resolveVitestWorkerMarkers()) {
  return (
    (env.VITEST === "true" ||
      env.VITEST === "1" ||
      env.VITEST_POOL_ID !== void 0 ||
      env.VITEST_WORKER_ID !== void 0) &&
    (markers.tinypoolState !== void 0 || markers.vitestWorker !== void 0)
  );
}
function requestExitAfterOneShotOutput(runtime = defaultRuntime, exitCode = 0) {
  if (runtime !== defaultRuntime) return false;
  requestedExitCode = exitCode;
  return true;
}
function flushExitAfterOneShotOutput(
  runtime = defaultRuntime,
  env = process.env,
  markers = resolveVitestWorkerMarkers(),
) {
  const exitCode = requestedExitCode;
  requestedExitCode = void 0;
  if (exitCode === void 0 || runtime !== defaultRuntime || isVitestWorker(env, markers)) return;
  const exit = () => runtime.exit(exitCode);
  let pendingStreams = 2;
  const drain = (stream) => {
    stream.write("", () => {
      pendingStreams -= 1;
      if (pendingStreams === 0) setImmediate(exit);
    });
  };
  drain(process.stdout);
  drain(process.stderr);
}
//#endregion
export { requestExitAfterOneShotOutput as n, flushExitAfterOneShotOutput as t };
