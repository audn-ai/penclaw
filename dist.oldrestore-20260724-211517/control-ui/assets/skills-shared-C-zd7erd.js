import { o as i, t as a } from "./control-ui-core-CwQmiouz.js";
import { at as t, et as n, nt as r } from "./lit-runtime-DkvDG939.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
var o = e(() => {});
function s(e) {
  let t = new Map();
  for (let e of c) t.set(e.id, { id: e.id, label: i(e.labelKey), skills: [] });
  let n = c.find((e) => e.id === `built-in`),
    r = { id: `other`, label: i(`skillGroups.other`), skills: [] };
  for (let i of e) {
    let e = i.bundled ? n : c.find((e) => e.sources.includes(i.source));
    e ? t.get(e.id)?.skills.push(i) : r.skills.push(i);
  }
  let a = c.map((e) => t.get(e.id)).filter((e) => !!(e && e.skills.length > 0));
  return (r.skills.length > 0 && a.push(r), a);
}
var c,
  l = e(() => {
    (a(),
      (c = [
        { id: `workspace`, labelKey: `skillGroups.workspace`, sources: [`openclaw-workspace`] },
        { id: `built-in`, labelKey: `skillGroups.builtIn`, sources: [`openclaw-bundled`] },
        { id: `installed`, labelKey: `skillGroups.installed`, sources: [`openclaw-managed`] },
        { id: `extra`, labelKey: `skillGroups.extra`, sources: [`openclaw-extra`] },
      ]));
  });
function u(e) {
  return [
    ...e.missing.bins.map((e) => `bin:${e}`),
    ...e.missing.env.map((e) => `env:${e}`),
    ...e.missing.config.map((e) => `config:${e}`),
    ...e.missing.os.map((e) => `os:${e}`),
  ];
}
function d(e) {
  let t = [];
  return (
    e.disabled && t.push(i(`skillStatus.disabled`)),
    e.blockedByAllowlist && t.push(i(`skillStatus.blockedAllowlist`)),
    e.blockedByAgentFilter && t.push(i(`skillStatus.blockedAgentFilter`)),
    t
  );
}
function f(e) {
  return e.eligible && !e.blockedByAgentFilter;
}
function p(e) {
  let n = e.skill,
    a = f(n),
    o = !!e.showBundledBadge;
  return t`
    <div class="chip-row" style="margin-top: 6px;">
      <span class="chip">${n.source}</span>
      ${o ? t` <span class="chip">${i(`skillStatus.bundled`)}</span> ` : r}
      <span class="chip ${a ? `chip-ok` : `chip-warn`}">
        ${i(a ? `skillStatus.eligible` : `skillStatus.blocked`)}
      </span>
      ${n.disabled ? t` <span class="chip chip-warn">${i(`skillStatus.disabled`)}</span> ` : r}
    </div>
  `;
}
var m = e(() => {
  (n(), a());
});
export { p as a, o as c, f as i, d as n, s as o, m as r, l as s, u as t };
//# sourceMappingURL=skills-shared-C-zd7erd.js.map
