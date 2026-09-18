import { n as r, t as i } from "./control-ui-foundation-BWwpVuhO.js";
import { at as t, ot as n } from "./control-ui-foundation-s2wA1PVE.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
var a = e(() => {
  (function () {
    let e = document.createElement(`link`).relList;
    if (e && e.supports && e.supports(`modulepreload`)) return;
    for (let e of document.querySelectorAll(`link[rel="modulepreload"]`)) n(e);
    new MutationObserver((e) => {
      for (let t of e)
        if (t.type === `childList`)
          for (let e of t.addedNodes) e.tagName === `LINK` && e.rel === `modulepreload` && n(e);
    }).observe(document, { childList: !0, subtree: !0 });
    function t(e) {
      let t = {};
      return (
        e.integrity && (t.integrity = e.integrity),
        e.referrerPolicy && (t.referrerPolicy = e.referrerPolicy),
        e.crossOrigin === `use-credentials`
          ? (t.credentials = `include`)
          : e.crossOrigin === `anonymous`
            ? (t.credentials = `omit`)
            : (t.credentials = `same-origin`),
        t
      );
    }
    function n(e) {
      if (e.ep) return;
      e.ep = !0;
      let n = t(e);
      fetch(e.href, n);
    }
  })();
});
function o(e) {
  return e.trim();
}
function s(e) {
  if (!Array.isArray(e)) return [];
  let t = new Set();
  for (let n of e) {
    if (typeof n != `string`) continue;
    let e = n.trim();
    e && t.add(e);
  }
  return (
    t.has(`operator.admin`)
      ? (t.add(`operator.read`), t.add(`operator.write`))
      : t.has(`operator.write`) && t.add(`operator.read`),
    [...t].toSorted()
  );
}
var c = e(() => {});
function l(e, t) {
  if (!n(t) || typeof t.token != `string`) return null;
  let r = typeof t.updatedAtMs == `number` && Number.isFinite(t.updatedAtMs) ? t.updatedAtMs : 0;
  return {
    token: t.token,
    role: e,
    scopes: s(Array.isArray(t.scopes) ? t.scopes : void 0),
    updatedAtMs: r,
  };
}
function u(e) {
  let t = {};
  for (let [n, r] of Object.entries(e)) {
    let e = o(n);
    if (!e) continue;
    let i = l(e, r);
    i && (t[e] = i);
  }
  return t;
}
function d(e) {
  let t = e.adapter.readStore();
  if (!t || t.deviceId !== e.deviceId) return null;
  let n = o(e.role);
  return l(n, t.tokens[n]);
}
function f(e) {
  let t = o(e.role),
    n = e.adapter.readStore(),
    r = {
      version: 1,
      deviceId: e.deviceId,
      tokens: n && n.deviceId === e.deviceId && n.tokens ? u(n.tokens) : {},
    },
    i = { token: e.token, role: t, scopes: s(e.scopes), updatedAtMs: Date.now() };
  return ((r.tokens[t] = i), e.adapter.writeStore(r), i);
}
function p(e) {
  let t = e.adapter.readStore();
  if (!t || t.deviceId !== e.deviceId) return;
  let n = o(e.role);
  if (!t.tokens[n]) return;
  let r = { version: 1, deviceId: t.deviceId, tokens: u(t.tokens) };
  (delete r.tokens[n], e.adapter.writeStore(r));
}
var m = e(() => {
    (t(), c());
  }),
  h,
  g,
  _,
  v,
  y = e(() => {
    ((h = `modulepreload`),
      (g = function (e, t) {
        return new URL(e, t).href;
      }),
      (_ = {}),
      (v = function (e, t, n) {
        let r = Promise.resolve();
        if (t && t.length > 0) {
          let e = document.getElementsByTagName(`link`),
            i = document.querySelector(`meta[property=csp-nonce]`),
            a = i?.nonce || i?.getAttribute(`nonce`);
          function o(e) {
            return Promise.all(
              e.map((e) =>
                Promise.resolve(e).then(
                  (e) => ({ status: `fulfilled`, value: e }),
                  (e) => ({ status: `rejected`, reason: e }),
                ),
              ),
            );
          }
          function s(e) {
            return import.meta.resolve
              ? import.meta.resolve(e)
              : new URL(
                  e,
                  new URL(`../../../src/node/plugins/importAnalysisBuild.ts`, import.meta.url),
                ).href;
          }
          r = o(
            t.map((t) => {
              if (((t = g(t, n)), (t = s(t)), t in _)) return;
              _[t] = !0;
              let r = t.endsWith(`.css`);
              for (let n = e.length - 1; n >= 0; n--) {
                let i = e[n];
                if (i.href === t && (!r || i.rel === `stylesheet`)) return;
              }
              let i = document.createElement(`link`);
              if (
                ((i.rel = r ? `stylesheet` : h),
                r || (i.as = `script`),
                (i.crossOrigin = ``),
                (i.href = t),
                a && i.setAttribute(`nonce`, a),
                document.head.appendChild(i),
                r)
              )
                return new Promise((e, n) => {
                  (i.addEventListener(`load`, e),
                    i.addEventListener(`error`, () => n(Error(`Unable to preload CSS for ${t}`))));
                });
            }),
          );
        }
        function i(e) {
          let t = new Event(`vite:preloadError`, { cancelable: !0 });
          if (((t.payload = e), window.dispatchEvent(t), !t.defaultPrevented)) throw e;
        }
        return r.then((t) => {
          for (let e of t || []) e.status === `rejected` && i(e.reason);
          return e().catch(i);
        });
      }));
  });
function b(e, t, n, r) {
  var i = arguments.length,
    a = i < 3 ? t : r === null ? (r = Object.getOwnPropertyDescriptor(t, n)) : r,
    o;
  if (typeof Reflect == `object` && typeof Reflect.decorate == `function`)
    a = Reflect.decorate(e, t, n, r);
  else
    for (var s = e.length - 1; s >= 0; s--)
      (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
  return (i > 3 && a && Object.defineProperty(t, n, a), a);
}
var x = e(() => {});
function S(e) {
  let t = Math.round(e);
  if (t < 1e3) return t;
  let n = Math.round(e / 1e3);
  if (n < 60) return n * 1e3;
  let r = Math.round(e / 6e4);
  if (r < 60) return r * 6e4;
  let i = Math.round(e / 36e5);
  return i < 24 ? i * 36e5 : Math.round(e / 864e5) * 864e5;
}
function C(e, t = !1) {
  return r(S(e), { hideYear: !0, unitCount: 1, verbose: t });
}
var w = e(() => {
  i();
});
function T(e, t) {
  if (e == null || !Number.isFinite(e) || e <= 0) return;
  let n = Math.round(e);
  if (n < 1e3) return r(n);
  let i = r(Math.round(e / 1e3) * 1e3, { hideYear: !0, unitCount: 2 });
  return t?.spaced ? i : i.replaceAll(` `, ``);
}
function E(e, t = `n/a`) {
  return e == null || !Number.isFinite(e) || e < 0 ? t : C(e);
}
var D = e(() => {
  (i(), w());
});
function O(e, t) {
  let n = t?.suffix !== !1,
    r = t?.fallback ?? `unknown`;
  if (e == null || !Number.isFinite(e) || e < 0) return r;
  let i = Math.round(e / 1e3),
    a = Math.round(i / 60);
  if (a < 1) return n ? `just now` : `${i}s`;
  if (a < 60) return n ? `${a}m ago` : `${a}m`;
  let o = Math.round(a / 60);
  if (o < 48) return n ? `${o}h ago` : `${o}h`;
  let s = Math.round(o / 24);
  return n ? `${s}d ago` : `${s}d`;
}
function k(e, t) {
  let n = t?.fallback ?? `n/a`;
  if (e == null || !Number.isFinite(e)) return n;
  let r = Date.now() - e,
    i = Math.abs(r),
    a = r >= 0,
    o = Math.round(i / 1e3);
  if (o < 60) return a ? `just now` : `in <1m`;
  let s = Math.round(o / 60);
  if (s < 60) return a ? `${s}m ago` : `in ${s}m`;
  let c = Math.round(s / 60);
  if (c < 48) return a ? `${c}h ago` : `in ${c}h`;
  let l = Math.round(c / 24);
  if (!t?.dateFallback || l <= 7) return a ? `${l}d ago` : `in ${l}d`;
  try {
    return new Intl.DateTimeFormat(`en-US`, {
      month: `short`,
      day: `numeric`,
      ...(t.timezone ? { timeZone: t.timezone } : {}),
    }).format(new Date(e));
  } catch {
    return `${l}d ago`;
  }
}
var A = e(() => {});
function j(e) {
  return e.length <= P && F.test(e);
}
var M,
  N,
  P,
  F,
  I = e(() => {
    ((M = 2 * 1024 * 1024), (N = 26), (P = Math.ceil(M / 3) * 4 + N), (F = /^data:image\//i));
  });
function L(e) {
  let t = `${e.getFullYear()}-${e.getMonth() + 1}-${e.getDate()}`,
    n = 2166136261;
  for (let e = 0; e < t.length; e++) ((n ^= t.charCodeAt(e)), (n = Math.imul(n, 16777619)));
  return n >>> 0;
}
function R(e) {
  return L(e) % 16 == 3;
}
var z = e(() => {});
function B(e) {
  let t = e.trim();
  if (!t || U(t)) return t;
  let n = t.match(/^\/(?:home|Users)\/([^/]+)(.*)$/);
  if (n && H(n[1])) return V(n[2] ?? ``);
  let r = t.match(/^[A-Za-z]:[\\/]Users[\\/]([^\\/]+)(.*)$/i);
  return r && H(r[1]) ? V(r[2] ?? ``) : t;
}
function V(e) {
  return `~${e.replace(/\\/g, `/`)}`;
}
function H(e) {
  return e !== void 0 && e !== `.` && e !== `..`;
}
function U(e) {
  return /(^|[\\/])\.{1,2}(?=[\\/]|$)/.test(e);
}
var W = e(() => {});
function G(e) {
  let t = new Set();
  for (let n of e) {
    let e = n.trim();
    e && t.add(e);
  }
  return [...t];
}
function K(e, t) {
  return e.startsWith(Q)
    ? t.has(Y)
      ? !0
      : e === X
        ? t.has(X) || t.has(Z)
        : e === Z
          ? t.has(Z)
          : t.has(e)
    : !1;
}
function q(e) {
  let t = G(e.requestedScopes);
  if (t.length === 0) return !0;
  let n = G(e.allowedScopes);
  if (n.length === 0) return !1;
  let r = new Set(n);
  if (e.role.trim() !== J) {
    let n = `${e.role.trim()}.`;
    return t.every((e) => e.startsWith(n) && r.has(e));
  }
  return t.every((e) => K(e, r));
}
var J,
  Y,
  X,
  Z,
  Q,
  $ = e(() => {
    ((J = `operator`),
      (Y = `operator.admin`),
      (X = `operator.read`),
      (Z = `operator.write`),
      (Q = `operator.`));
  });
export {
  f as C,
  a as E,
  d as S,
  s as T,
  x as _,
  z as a,
  p as b,
  I as c,
  O as d,
  A as f,
  b as g,
  D as h,
  W as i,
  j as l,
  E as m,
  q as n,
  R as o,
  T as p,
  B as r,
  M as s,
  $ as t,
  k as u,
  v,
  c as w,
  m as x,
  y,
};
//# sourceMappingURL=control-ui-foundation-CCDffryi.js.map
