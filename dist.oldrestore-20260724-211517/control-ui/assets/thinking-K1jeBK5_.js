import { Wa as n } from "./control-ui-core-BcbHa4vB.js";
import { $ as t } from "./control-ui-foundation-s2wA1PVE.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
function r(e, n, r, i) {
  let a = r.trim();
  if (!a) return;
  let o = t(a);
  n.has(o) || (n.add(o), e.push({ value: a, label: i(a) }));
}
var i = e(() => {
  n();
});
function a(e, t) {
  let n = e?.agentRuntime?.id?.trim(),
    r = t?.agentRuntime?.id?.trim();
  return (
    (!e?.modelProvider || e.modelProvider === t?.modelProvider) &&
    (!e?.model || e.model === t?.model) &&
    (!n || !r || n === r)
  );
}
var o = e(() => {});
function s(e) {
  if (!e) return;
  let n = t(e),
    r = n.replace(/[\s_-]+/g, ``);
  if (r === `adaptive` || r === `auto`) return `adaptive`;
  if (r === `max`) return `max`;
  if (r === `ultra`) return `ultra`;
  if (r === `xhigh` || r === `extrahigh`) return `xhigh`;
  if (n === `off` || n === `none`) return `off`;
  if ([`on`, `enable`, `enabled`].includes(n)) return `low`;
  if ([`min`, `minimal`].includes(n)) return `minimal`;
  if ([`low`, `thinkhard`, `think-hard`, `think_hard`].includes(n)) return `low`;
  if ([`mid`, `med`, `medium`, `thinkharder`, `think-harder`, `harder`].includes(n))
    return `medium`;
  if ([`high`, `ultrathink`, `think-hard`, `thinkhardest`, `highest`].includes(n)) return `high`;
  if (n === `think`) return `minimal`;
}
function c(e, t) {
  return T;
}
function l(e) {
  return e.catalog?.find((t) => t.provider === e.provider && t.id === e.model)?.reasoning
    ? `low`
    : `off`;
}
function u(e, t) {
  let { provider: n, model: r } = v({ defaults: t, session: e });
  return y({ catalog: [], defaults: t, model: r, provider: n, session: e });
}
function d(e, t) {
  let n = u(e, t)
    .map((e) => e.label)
    .join(`, `);
  return n.split(`, `).includes(`default`) ? n : `default, ${n}`;
}
function f(e, n, r) {
  let i = s(e);
  if (i) return i;
  let a = t(e);
  return u(n, r)
    .map((e) => ({ id: s(e.id) ?? t(e.id), label: t(e.label) }))
    .find((e) => e.id === a || e.label === a)?.id;
}
function p(e, n, r) {
  return u(e, n).some((e) => (s(e.id) ?? t(e.id)) === r || s(e.label) === r);
}
function m(e, t, n) {
  let r = s(e?.thinkingLevel);
  if (r) return u(e, t).find((e) => s(e.id) === r)?.label ?? r;
  if (e?.thinkingDefault) return e.thinkingDefault;
  if ((!e || a(e, t)) && t?.thinkingDefault) return t.thinkingDefault;
  let i = e?.modelProvider ?? t?.modelProvider,
    o = e?.model ?? t?.model;
  return !i || !o ? `off` : l({ provider: i, model: o, catalog: n });
}
function h(e) {
  let t = new Set(),
    n = [],
    i = (e, i) => {
      let a = x(e);
      r(n, t, a, () => C(a, i));
    };
  for (let t of e) i(t.id, t.label);
  return n;
}
function g(e) {
  return x(e ?? ``) === `off`;
}
function _(e) {
  return e.every((e) => g(e.id || e.label));
}
function v(e) {
  return {
    provider: e.session?.modelProvider ?? e.defaults?.modelProvider ?? null,
    model: e.session?.model ?? e.defaults?.model ?? null,
  };
}
function y(e) {
  let n = a(e.session, e.defaults),
    r =
      e.provider && e.model
        ? e.catalog.find((t) => t.provider === e.provider && t.id === e.model)
        : void 0,
    i =
      (e.session?.thinkingLevels?.length ? e.session.thinkingLevels : null) ??
      (n && e.defaults?.thinkingLevels?.length ? e.defaults.thinkingLevels : null);
  if (i) return e.hideUnsupportedOffOnly && r?.reasoning === !1 && _(i) ? [] : i;
  let o =
    (e.session?.thinkingOptions?.length ? e.session.thinkingOptions : null) ??
    (n && e.defaults?.thinkingOptions?.length ? e.defaults.thinkingOptions : null);
  return e.hideUnsupportedOffOnly && r?.reasoning === !1 && (!o || o.every(g))
    ? []
    : (o ?? (e.provider && e.model ? c(e.provider, e.model) : c())).map((e) => ({
        id: s(e) ?? t(e),
        label: e,
      }));
}
function b(e) {
  let t = e.sessionsResult?.sessions?.find((t) => t.key === e.sessionKey),
    n = t?.thinkingLevel,
    r = typeof n == `string` && n.trim() ? (s(n) ?? n.trim()) : ``,
    i = e.sessionsResult?.defaults,
    { provider: o, model: c } = v({ defaults: i, session: t }),
    u = y({
      catalog: e.catalog,
      defaults: i,
      hideUnsupportedOffOnly: !0,
      model: c,
      provider: o,
      session: t,
    }),
    d = (!t || a(t, i)) && i?.thinkingDefault ? i.thinkingDefault : void 0,
    f =
      t?.thinkingDefault ??
      d ??
      (o && c ? l({ provider: o, model: c, catalog: e.catalog }) : `off`);
  return {
    currentOverride: u.length === 0 && r === `off` ? `` : r,
    defaultLabel: S(f),
    defaultValue: x(f),
    options: h(u),
  };
}
function x(e) {
  return s(e) ?? t(e);
}
function S(e) {
  return `Inherited: ${w(e ? x(e) : `off`)}`;
}
function C(e, t) {
  let n = x(e);
  return !n || n === `off` ? `Off` : w(t?.trim() || n);
}
function w(e) {
  let n = t(e);
  if ([`on`, `enable`, `enabled`].includes(n)) return `On`;
  switch (x(e)) {
    case `adaptive`:
      return `Adaptive`;
    case `minimal`:
      return `Minimal`;
    case `low`:
      return `Low`;
    case `medium`:
      return `Medium`;
    case `high`:
      return `High`;
    case `xhigh`:
      return `Extra high`;
    case `max`:
      return `Maximum`;
    case `ultra`:
      return `Ultra`;
    default:
      return e.charAt(0).toUpperCase() + e.slice(1);
  }
}
var T,
  E = e(() => {
    (i(), o(), n(), (T = [`off`, `minimal`, `low`, `medium`, `high`]));
  });
export {
  p as a,
  b as c,
  o as d,
  a as f,
  E as i,
  m as l,
  r as m,
  d as n,
  s as o,
  i as p,
  C as r,
  x as s,
  S as t,
  f as u,
};
//# sourceMappingURL=thinking-K1jeBK5_.js.map
