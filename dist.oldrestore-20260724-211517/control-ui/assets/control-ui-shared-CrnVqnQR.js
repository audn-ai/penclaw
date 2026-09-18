import { Wa as n } from "./control-ui-core-BcbHa4vB.js";
import { $ as t } from "./control-ui-foundation-s2wA1PVE.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
async function r(e) {
  if (!e) return !1;
  if (navigator.clipboard?.writeText)
    try {
      return (await navigator.clipboard.writeText(e), !0);
    } catch {}
  return i(e);
}
function i(e) {
  let t = document.createElement(`textarea`),
    n = document.activeElement instanceof HTMLElement ? document.activeElement : void 0;
  ((t.value = e),
    (t.style.position = `fixed`),
    (t.style.opacity = `0`),
    document.body.appendChild(t),
    t.select());
  try {
    return document.execCommand(`copy`);
  } catch {
    return !1;
  } finally {
    (document.body.removeChild(t),
      n?.isConnected &&
        window.setTimeout(() => {
          let e = document.activeElement;
          n.isConnected && (!e || e === document.body) && n.focus({ preventScroll: !0 });
        }, 0));
  }
}
var a = e(() => {});
function o(e) {
  if (e) return Array.isArray(e.type) ? (e.type.find((e) => e !== `null`) ?? e.type[0]) : e.type;
}
function s(e) {
  if (!e) return ``;
  if (e.default !== void 0) return e.default;
  switch (o(e)) {
    case `object`:
      return {};
    case `array`:
      return [];
    case `boolean`:
      return !1;
    case `number`:
    case `integer`:
      return 0;
    case `string`:
      return ``;
    default:
      return ``;
  }
}
function c(e) {
  return e.filter((e) => typeof e == `string`).join(`.`);
}
function l(e, t) {
  let n = t[c(e)];
  if (n) return n;
  let r = e.map(String);
  for (let [e, n] of Object.entries(t)) {
    if (!e.includes(`*`)) continue;
    let t = e.split(`.`);
    if (t.length !== r.length) continue;
    let i = !0;
    for (let e = 0; e < r.length; e += 1)
      if (t[e] !== `*` && t[e] !== r[e]) {
        i = !1;
        break;
      }
    if (i) return n;
  }
}
function u(e) {
  return e
    .replace(/_/g, ` `)
    .replace(/([a-z0-9])([A-Z])/g, `$1 $2`)
    .replace(/\s+/g, ` `)
    .replace(/^./, (e) => e.toUpperCase());
}
function d() {
  return { visited: 0 };
}
function f(e, t) {
  return !(t > T || ((e.visited += 1), e.visited > E));
}
function p(e) {
  return C.test(e.trim());
}
function m(e) {
  let n = t(e);
  return !x.some((e) => n.endsWith(e)) && S.some((t) => t.test(e));
}
function h(e) {
  return typeof e == `string` ? e.trim().length > 0 && !p(e) : e != null;
}
function g(e) {
  return e?.sensitive ?? !1;
}
function _(e, t, n) {
  return v(e, t, n, d(), 0);
}
function v(e, t, n, r, i) {
  if (!f(r, i)) return !0;
  let a = c(t);
  return (g(l(t, n)) || m(a)) && h(e)
    ? !0
    : Array.isArray(e)
      ? e.some((e, a) => v(e, [...t, a], n, r, i + 1))
      : e && typeof e == `object`
        ? Object.entries(e).some(([e, a]) => v(a, [...t, e], n, r, i + 1))
        : !1;
}
function y(e, t, n) {
  return b(e, t, n, d(), 0);
}
function b(e, t, n, r, i) {
  if (!f(r, i)) return 1;
  if (e == null) return 0;
  let a = c(t);
  return (g(l(t, n)) || m(a)) && h(e)
    ? 1
    : Array.isArray(e)
      ? e.reduce((e, a, o) => e + b(a, [...t, o], n, r, i + 1), 0)
      : e && typeof e == `object`
        ? Object.entries(e).reduce((e, [a, o]) => e + b(o, [...t, a], n, r, i + 1), 0)
        : 0;
}
var x,
  S,
  C,
  w,
  T,
  E,
  D = e(() => {
    (n(),
      (x = [
        `maxtokens`,
        `maxoutputtokens`,
        `maxinputtokens`,
        `maxcompletiontokens`,
        `contexttokens`,
        `totaltokens`,
        `tokencount`,
        `tokenlimit`,
        `tokenbudget`,
        `passwordfile`,
      ]),
      (S = [/token$/i, /password/i, /secret/i, /api.?key/i, /serviceaccount(?:ref)?$/i]),
      (C = /^\$\{[^}]*\}$/),
      (w = `[redacted - click reveal to view]`),
      (T = 64),
      (E = 2e4));
  });
export {
  l as a,
  m as c,
  r as d,
  a as f,
  _ as i,
  c as l,
  y as n,
  u as o,
  s as r,
  D as s,
  w as t,
  o as u,
};
//# sourceMappingURL=control-ui-shared-CrnVqnQR.js.map
