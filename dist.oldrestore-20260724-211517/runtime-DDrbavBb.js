//#region extensions/reef/src/runtime.ts
let runtime;
let active;
function setReefRuntime(value) {
  runtime = value;
}
function getReefRuntime() {
  if (!runtime) throw new Error("Reef runtime unavailable");
  return runtime;
}
function setActiveReef(value) {
  active = value;
}
function getActiveReef() {
  if (!active) throw new Error("Reef channel is not running");
  return active;
}
//#endregion
export { setReefRuntime as i, getReefRuntime as n, setActiveReef as r, getActiveReef as t };
