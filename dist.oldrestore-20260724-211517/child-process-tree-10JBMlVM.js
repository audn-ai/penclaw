import { n as signalProcessTree } from "./kill-tree-Cr15jS_s.js";
//#region src/process/child-process-tree.ts
function shouldDetachChildForProcessTree() {
  return process.platform !== "win32";
}
function signalChildProcessTree(child, signal) {
  if (typeof child.pid === "number" && child.pid > 0) {
    signalProcessTree(child.pid, signal, { detached: shouldDetachChildForProcessTree() });
    return;
  }
  child.kill(signal);
}
function forceKillChildProcessTree(child) {
  signalChildProcessTree(child, "SIGKILL");
}
//#endregion
export {
  shouldDetachChildForProcessTree as n,
  signalChildProcessTree as r,
  forceKillChildProcessTree as t,
};
