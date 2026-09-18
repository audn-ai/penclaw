import { $ as t, Q as n } from "./control-ui-foundation-s2wA1PVE.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
function r(e, n) {
  let r = e?.trim() ?? ``,
    i = n?.trim() ?? ``;
  return r ? (i ? (t(i).startsWith(`${t(r)}/`) ? i : `${r}/${i}`) : r) : i;
}
function i(e, n) {
  let i = r(e, n);
  if (t(e?.trim() ?? ``) !== `openai-codex`) return [i];
  let a = r(`openai`, n);
  return a === i ? [i] : [i, a];
}
function a(e) {
  let t = e.cfg?.agents?.defaults?.models;
  if (t)
    for (let n of i(e.provider, e.model)) {
      let e = t[n];
      if (e?.params) return e.params;
    }
}
function o(e) {
  return typeof e == `number` && Number.isInteger(e) && e > 0 ? e : void 0;
}
function s(e) {
  let t = a(e);
  return (
    o(t?.fastAutoOnSeconds) ??
    o(t?.fast_auto_on_seconds) ??
    o(t?.fastSeconds) ??
    o(t?.fast_seconds) ??
    60
  );
}
function c(e) {
  return e === `auto` ? `auto` : e === !0 ? `on` : `off`;
}
function l(e) {
  return `auto (${o(e?.fastAutoOnSeconds) ?? 60} sec)`;
}
function u(e) {
  return e.mode === `auto` ? l({ fastAutoOnSeconds: e.fastAutoOnSeconds }) : c(e.mode);
}
function d(e) {
  return `on, off, ${l({ fastAutoOnSeconds: e?.fastAutoOnSeconds })}, default, status`;
}
function f(e) {
  switch (e) {
    case `session`:
      return ` (session)`;
    case `agent`:
      return ` (default: agent)`;
    case `config`:
      return ` (default: model)`;
    case `default`:
      return ` (default)`;
    default:
      return ``;
  }
}
function p(e) {
  return `${e.label ?? `Current fast mode`}: ${u({ mode: e.mode, fastAutoOnSeconds: e.fastAutoOnSeconds })}${f(e.source)}.`;
}
var m = e(() => {
  n();
});
export { m as a, c as i, d as n, s as o, p as r, l as t };
//# sourceMappingURL=fast-mode-Ce32fhza.js.map
