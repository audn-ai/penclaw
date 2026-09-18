import {
  $i as r,
  Xi as i,
  aa as a,
  ea as o,
  qi as s,
  sa as c,
} from "./control-ui-core-BcbHa4vB.js";
import { o as l, t as u } from "./control-ui-core-CwQmiouz.js";
import { m as t, u as n } from "./control-ui-foundation-CCDffryi.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
function d(e) {
  if (!e) return l(`common.na`);
  let t = s(e, { weekday: `short` });
  return t === l(`common.na`) ? t : `${t}, ${i(e)} (${n(e)})`;
}
function f(e) {
  if (e.totalTokens == null) return l(`common.na`);
  let t = e.totalTokens ?? 0,
    n = e.contextTokens ?? 0;
  return n ? `${t} / ${n}` : String(t);
}
function p(e) {
  if (e == null) return ``;
  try {
    return JSON.stringify(e, null, 2);
  } catch {
    return r(e);
  }
}
function m(e) {
  let t = e.state ?? {},
    n = t.nextRunAtMs ? i(t.nextRunAtMs) : l(`common.na`),
    r = t.lastRunAtMs ? i(t.lastRunAtMs) : l(`common.na`);
  return `${c(e)} · next ${n} · last ${r}`;
}
function h(e) {
  let n = e.schedule;
  if (n.kind === `at`) {
    let e = Date.parse(n.at);
    return Number.isFinite(e) ? `At ${i(e)}` : `At ${n.at}`;
  }
  return n.kind === `every`
    ? `Every ${t(n.everyMs)}`
    : n.kind === `on-exit`
      ? `On exit: ${n.command}${n.cwd ? ` (cwd: ${n.cwd})` : ``}`
      : `Cron ${n.expr}${n.tz ? ` (${n.tz})` : ``}`;
}
function g(e) {
  let t = e.payload;
  if (t.kind === `systemEvent`) return `System: ${t.text}`;
  if (t.kind === `command`) return `Command: ${t.argv.join(` `)}`;
  let n = `Agent: ${t.message}`,
    r = e.delivery;
  if (r && r.mode !== `none`) {
    let e =
      r.mode === `webhook`
        ? r.to
          ? ` (${r.to})`
          : ``
        : r.channel || r.to
          ? ` (${r.channel ?? `last`}${r.to ? ` -> ${r.to}` : ``})`
          : ``;
    return `${n} · ${r.mode}${e}`;
  }
  return n;
}
var _ = e(() => {
  (u(), a(), o());
});
export { d as a, p as i, h as n, f as o, m as r, _ as s, g as t };
//# sourceMappingURL=presenter-CnPyKQkg.js.map
