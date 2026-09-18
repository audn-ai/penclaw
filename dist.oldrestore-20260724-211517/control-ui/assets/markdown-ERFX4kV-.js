import { H as o, J as s, V as c, Z as l } from "./control-ui-core--EZfp09c.js";
import { Wa as r, ea as i, ia as a } from "./control-ui-core-BcbHa4vB.js";
import { i as u, o as d, t as ee } from "./control-ui-core-CwQmiouz.js";
import { $ as n } from "./control-ui-foundation-s2wA1PVE.js";
import { d as te, f as ne } from "./control-ui-shared-CrnVqnQR.js";
import {
  A as re,
  C as ie,
  D as ae,
  E as oe,
  F as f,
  I as se,
  L as ce,
  M as le,
  N as ue,
  O as de,
  P as fe,
  R as p,
  S as pe,
  T as me,
  _ as he,
  a as ge,
  b as _e,
  c as ve,
  d as ye,
  f as be,
  g as xe,
  h as Se,
  j as Ce,
  k as we,
  l as Te,
  m as Ee,
  n as De,
  o as Oe,
  p as ke,
  r as Ae,
  s as je,
  t as Me,
  u as Ne,
  v as Pe,
  w as Fe,
  x as Ie,
  y as Le,
} from "./markdown-runtime-BBD8XmVB.js";
import { a as e, n as t } from "./rolldown-runtime-DaJ6WEGw.js";
var Re,
  ze,
  Be,
  m,
  Ve,
  He,
  h,
  g,
  _,
  v,
  Ue,
  We,
  y,
  Ge,
  Ke,
  qe,
  Je,
  Ye,
  Xe,
  Ze,
  Qe,
  $e,
  b,
  et,
  tt,
  nt,
  rt,
  it,
  at,
  ot,
  x,
  st,
  S,
  C,
  ct,
  w,
  lt,
  T,
  ut,
  E,
  dt,
  ft,
  pt,
  D,
  O,
  mt,
  ht,
  gt,
  _t,
  vt,
  yt,
  bt,
  xt,
  St,
  Ct,
  wt,
  Tt,
  Et,
  Dt,
  Ot,
  kt,
  At,
  jt,
  Mt,
  Nt,
  Pt,
  Ft,
  It,
  Lt,
  Rt,
  zt,
  Bt,
  Vt,
  Ht,
  Ut,
  Wt,
  Gt,
  Kt,
  qt,
  Jt,
  Yt,
  k,
  Xt,
  A,
  Zt,
  Qt,
  $t,
  en,
  tn = t(() => {
    ((Re = Object.defineProperty),
      (ze = Object.defineProperties),
      (Be = Object.getOwnPropertyDescriptors),
      (m = Object.getOwnPropertySymbols),
      (Ve = Object.prototype.hasOwnProperty),
      (He = Object.prototype.propertyIsEnumerable),
      (h = (e, t, n) =>
        t in e
          ? Re(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
          : (e[t] = n)),
      (g = (e, t) => {
        for (var n in (t ||= {})) Ve.call(t, n) && h(e, n, t[n]);
        if (m) for (var n of m(t)) He.call(t, n) && h(e, n, t[n]);
        return e;
      }),
      (_ = (e, t) => ze(e, Be(t))),
      (v = (e, t) => {
        let n = !1,
          r = !1;
        for (let i = 0; i < t; i += 1) {
          if (e[i] === `\\` && i + 1 < e.length && e[i + 1] === "`") {
            i += 1;
            continue;
          }
          if (e.substring(i, i + 3) === "```") {
            ((r = !r), (i += 2));
            continue;
          }
          !r && e[i] === "`" && (n = !n);
        }
        return n || r;
      }),
      (Ue = (e, t) => {
        let n = e.substring(t, t + 3) === "```",
          r = t > 0 && e.substring(t - 1, t + 2) === "```",
          i = t > 1 && e.substring(t - 2, t + 1) === "```";
        return n || r || i;
      }),
      (We = (e) => {
        let t = 0;
        for (let n = 0; n < e.length; n += 1) {
          if (e[n] === `\\` && n + 1 < e.length && e[n + 1] === "`") {
            n += 1;
            continue;
          }
          e[n] === "`" && !Ue(e, n) && (t += 1);
        }
        return t;
      }),
      (y = (e, t) => {
        let n = !1,
          r = !1,
          i = -1;
        for (let a = 0; a < e.length; a += 1) {
          if (e[a] === `\\` && a + 1 < e.length && e[a + 1] === "`") {
            a += 1;
            continue;
          }
          if (e.substring(a, a + 3) === "```") {
            ((r = !r), (a += 2));
            continue;
          }
          if (!r && e[a] === "`")
            if (n) {
              if (i < t && t < a) return !0;
              ((n = !1), (i = -1));
            } else ((n = !0), (i = a));
        }
        return !1;
      }),
      (Ge = /^(\s*(?:[-*+]|\d+[.)]) +)>(=?\s*[$]?\d)/gm),
      (Ke = (e) =>
        !e || typeof e != `string` || !e.includes(`>`)
          ? e
          : e.replace(Ge, (t, n, r, i) => (v(e, i) ? t : `${n}\\>${r}`))),
      (qe = /(\*\*)([^*]*\*?)$/),
      (Je = /(__)([^_]*?)$/),
      (Ye = /(\*\*\*)([^*]*?)$/),
      (Xe = /(\*)([^*]*?)$/),
      (Ze = /(_)([^_]*?)$/),
      (Qe = /(`)([^`]*?)$/),
      ($e = /(~~)([^~]*?)$/),
      (b = /^[\s_~*`]*$/),
      (et = /^[\s]*[-*+][\s]+$/),
      (tt = /[\p{L}\p{N}_]/u),
      (nt = /^```[^`\n]*```?$/),
      (rt = /^\*{4,}$/),
      (it = /(__)([^_]+)_$/),
      (at = /(~~)([^~]+)~$/),
      (ot = /~~/g),
      (x = (e) => {
        if (!e) return !1;
        let t = e.charCodeAt(0);
        return (t >= 48 && t <= 57) || (t >= 65 && t <= 90) || (t >= 97 && t <= 122) || t === 95
          ? !0
          : tt.test(e);
      }),
      (st = (e, t) => {
        let n = 1;
        for (let r = t - 1; r >= 0; --r)
          if (e[r] === `]`) n += 1;
          else if (e[r] === `[` && (--n, n === 0)) return r;
        return -1;
      }),
      (S = (e, t) => {
        let n = 1;
        for (let r = t + 1; r < e.length; r += 1)
          if (e[r] === `[`) n += 1;
          else if (e[r] === `]` && (--n, n === 0)) return r;
        return -1;
      }),
      (C = (e, t) => {
        let n = !1,
          r = !1;
        for (let i = 0; i < e.length && i < t; i += 1) {
          if (e[i] === `\\` && e[i + 1] === `$`) {
            i += 1;
            continue;
          }
          e[i] === `$` && (e[i + 1] === `$` ? ((r = !r), (i += 1), (n = !1)) : r || (n = !n));
        }
        return n || r;
      }),
      (ct = (e, t) => {
        for (let n = t; n < e.length; n += 1) {
          if (e[n] === `)`) return !0;
          if (
            e[n] ===
            `
`
          )
            return !1;
        }
        return !1;
      }),
      (w = (e, t) => {
        for (let n = t - 1; n >= 0; --n) {
          if (e[n] === `)`) return !1;
          if (e[n] === `(`) return n > 0 && e[n - 1] === `]` ? ct(e, t) : !1;
          if (
            e[n] ===
            `
`
          )
            return !1;
        }
        return !1;
      }),
      (lt = (e, t) => {
        for (let n = t - 1; n >= 0; --n) {
          if (e[n] === `>`) return !1;
          if (e[n] === `<`) {
            let t = n + 1 < e.length ? e[n + 1] : ``;
            return (t >= `a` && t <= `z`) || (t >= `A` && t <= `Z`) || t === `/`;
          }
          if (
            e[n] ===
            `
`
          )
            return !1;
        }
        return !1;
      }),
      (T = (e, t, n) => {
        let r = 0;
        for (let n = t - 1; n >= 0; --n)
          if (
            e[n] ===
            `
`
          ) {
            r = n + 1;
            break;
          }
        let i = e.length;
        for (let n = t; n < e.length; n += 1)
          if (
            e[n] ===
            `
`
          ) {
            i = n;
            break;
          }
        let a = e.substring(r, i),
          o = 0,
          s = !1;
        for (let e of a)
          if (e === n) o += 1;
          else if (e !== ` ` && e !== `	`) {
            s = !0;
            break;
          }
        return o >= 3 && !s;
      }),
      (ut = (e, t, n, r) =>
        n === `\\` || (e.includes(`$`) && C(e, t))
          ? !0
          : n !== `*` && r === `*`
            ? (t < e.length - 2 ? e[t + 2] : ``) !== `*`
            : !!(
                n === `*` ||
                (n && r && x(n) && x(r)) ||
                ((!n ||
                  n === ` ` ||
                  n === `	` ||
                  n ===
                    `
`) &&
                  (!r ||
                    r === ` ` ||
                    r === `	` ||
                    r ===
                      `
`))
              )),
      (E = (e) => {
        let t = 0,
          n = !1,
          r = e.length;
        for (let i = 0; i < r; i += 1) {
          if (e[i] === "`" && i + 2 < r && e[i + 1] === "`" && e[i + 2] === "`") {
            ((n = !n), (i += 2));
            continue;
          }
          if (n || e[i] !== `*`) continue;
          let a = i > 0 ? e[i - 1] : ``,
            o = i < r - 1 ? e[i + 1] : ``;
          ut(e, i, a, o) || (t += 1);
        }
        return t;
      }),
      (dt = (e, t, n, r) =>
        !!(
          n === `\\` ||
          (e.includes(`$`) && C(e, t)) ||
          w(e, t) ||
          lt(e, t) ||
          n === `_` ||
          r === `_` ||
          (n && r && x(n) && x(r))
        )),
      (ft = (e) => {
        let t = 0,
          n = !1,
          r = e.length;
        for (let i = 0; i < r; i += 1) {
          if (e[i] === "`" && i + 2 < r && e[i + 1] === "`" && e[i + 2] === "`") {
            ((n = !n), (i += 2));
            continue;
          }
          if (n || e[i] !== `_`) continue;
          let a = i > 0 ? e[i - 1] : ``,
            o = i < r - 1 ? e[i + 1] : ``;
          dt(e, i, a, o) || (t += 1);
        }
        return t;
      }),
      (pt = (e) => {
        let t = 0,
          n = 0,
          r = !1;
        for (let i = 0; i < e.length; i += 1) {
          if (e[i] === "`" && i + 2 < e.length && e[i + 1] === "`" && e[i + 2] === "`") {
            (n >= 3 && (t += Math.floor(n / 3)), (n = 0), (r = !r), (i += 2));
            continue;
          }
          r || (e[i] === `*` ? (n += 1) : (n >= 3 && (t += Math.floor(n / 3)), (n = 0)));
        }
        return (n >= 3 && (t += Math.floor(n / 3)), t);
      }),
      (D = (e) => {
        let t = 0,
          n = !1;
        for (let r = 0; r < e.length; r += 1) {
          if (e[r] === "`" && r + 2 < e.length && e[r + 1] === "`" && e[r + 2] === "`") {
            ((n = !n), (r += 2));
            continue;
          }
          n || (e[r] === `*` && r + 1 < e.length && e[r + 1] === `*` && ((t += 1), (r += 1)));
        }
        return t;
      }),
      (O = (e) => {
        let t = 0,
          n = !1;
        for (let r = 0; r < e.length; r += 1) {
          if (e[r] === "`" && r + 2 < e.length && e[r + 1] === "`" && e[r + 2] === "`") {
            ((n = !n), (r += 2));
            continue;
          }
          n || (e[r] === `_` && r + 1 < e.length && e[r + 1] === `_` && ((t += 1), (r += 1)));
        }
        return t;
      }),
      (mt = (e, t, n) => {
        if (!t || b.test(t)) return !0;
        let r = e.substring(0, n).lastIndexOf(`
`),
          i = r === -1 ? 0 : r + 1,
          a = e.substring(i, n);
        return et.test(a) &&
          t.includes(`
`)
          ? !0
          : T(e, n, `*`);
      }),
      (ht = (e) => {
        let t = e.match(qe);
        if (!t) return e;
        let n = t[2],
          r = e.lastIndexOf(t[1]);
        return v(e, r) || y(e, r) || mt(e, n, r)
          ? e
          : D(e) % 2 == 1
            ? n.endsWith(`*`)
              ? `${e}*`
              : `${e}**`
            : e;
      }),
      (gt = (e, t, n) => {
        if (!t || b.test(t)) return !0;
        let r = e.substring(0, n).lastIndexOf(`
`),
          i = r === -1 ? 0 : r + 1,
          a = e.substring(i, n);
        return et.test(a) &&
          t.includes(`
`)
          ? !0
          : T(e, n, `_`);
      }),
      (_t = (e) => {
        let t = e.match(Je);
        if (!t) {
          let t = e.match(it);
          if (t) {
            let n = e.lastIndexOf(t[1]);
            if (!(v(e, n) || y(e, n)) && O(e) % 2 == 1) return `${e}_`;
          }
          return e;
        }
        let n = t[2],
          r = e.lastIndexOf(t[1]);
        return v(e, r) || y(e, r) || gt(e, n, r) ? e : O(e) % 2 == 1 ? `${e}__` : e;
      }),
      (vt = (e) => {
        let t = !1;
        for (let n = 0; n < e.length; n += 1) {
          if (e[n] === "`" && n + 2 < e.length && e[n + 1] === "`" && e[n + 2] === "`") {
            ((t = !t), (n += 2));
            continue;
          }
          if (
            !t &&
            e[n] === `*` &&
            e[n - 1] !== `*` &&
            e[n + 1] !== `*` &&
            e[n - 1] !== `\\` &&
            !C(e, n)
          ) {
            let t = n > 0 ? e[n - 1] : ``,
              r = n < e.length - 1 ? e[n + 1] : ``;
            if (
              ((!t ||
                t === ` ` ||
                t === `	` ||
                t ===
                  `
`) &&
                (!r ||
                  r === ` ` ||
                  r === `	` ||
                  r ===
                    `
`)) ||
              (t && r && x(t) && x(r))
            )
              continue;
            return n;
          }
        }
        return -1;
      }),
      (yt = (e) => {
        if (!e.match(Xe)) return e;
        let t = vt(e);
        if (t === -1 || v(e, t) || y(e, t)) return e;
        let n = e.substring(t + 1);
        return !n || b.test(n) ? e : E(e) % 2 == 1 ? `${e}*` : e;
      }),
      (bt = (e) => {
        let t = !1;
        for (let n = 0; n < e.length; n += 1) {
          if (e[n] === "`" && n + 2 < e.length && e[n + 1] === "`" && e[n + 2] === "`") {
            ((t = !t), (n += 2));
            continue;
          }
          if (
            !t &&
            e[n] === `_` &&
            e[n - 1] !== `_` &&
            e[n + 1] !== `_` &&
            e[n - 1] !== `\\` &&
            !C(e, n) &&
            !w(e, n)
          ) {
            let t = n > 0 ? e[n - 1] : ``,
              r = n < e.length - 1 ? e[n + 1] : ``;
            if (t && r && x(t) && x(r)) continue;
            return n;
          }
        }
        return -1;
      }),
      (xt = (e) => {
        let t = e.length;
        for (
          ;
          t > 0 &&
          e[t - 1] ===
            `
`;
        )
          --t;
        return t < e.length ? `${e.slice(0, t)}_${e.slice(t)}` : `${e}_`;
      }),
      (St = (e) => {
        if (!e.endsWith(`**`)) return null;
        let t = e.slice(0, -2);
        if (D(t) % 2 != 1) return null;
        let n = t.indexOf(`**`),
          r = bt(t);
        return n !== -1 && r !== -1 && n < r ? `${t}_**` : null;
      }),
      (Ct = (e) => {
        if (!e.match(Ze)) return e;
        let t = bt(e);
        if (t === -1) return e;
        let n = e.substring(t + 1);
        if (!n || b.test(n) || v(e, t) || y(e, t)) return e;
        if (ft(e) % 2 == 1) {
          let t = St(e);
          return t === null ? xt(e) : t;
        }
        return e;
      }),
      (wt = (e) => {
        let t = D(e),
          n = E(e);
        return t % 2 == 0 && n % 2 == 0;
      }),
      (Tt = (e, t, n) => (!t || b.test(t) || v(e, n) || y(e, n) ? !0 : T(e, n, `*`))),
      (Et = (e) => {
        if (rt.test(e)) return e;
        let t = e.match(Ye);
        if (!t) return e;
        let n = t[2];
        return Tt(e, n, e.lastIndexOf(t[1])) ? e : pt(e) % 2 == 1 ? (wt(e) ? e : `${e}***`) : e;
      }),
      (Dt = /<[a-zA-Z/][^>]*$/),
      (Ot = (e) => {
        let t = e.match(Dt);
        return !t || t.index === void 0 || v(e, t.index) ? e : e.substring(0, t.index).trimEnd();
      }),
      (kt = (e) =>
        !e.match(nt) ||
        e.includes(`
`)
          ? null
          : e.endsWith("``") && !e.endsWith("```")
            ? `${e}\``
            : e),
      (At = (e) => (e.match(/```/g) || []).length % 2 == 1),
      (jt = (e) => {
        let t = kt(e);
        if (t !== null) return t;
        let n = e.match(Qe);
        if (n && !At(e)) {
          let t = n[2];
          if (!t || b.test(t)) return e;
          if (We(e) % 2 == 1) return `${e}\``;
        }
        return e;
      }),
      (Mt = (e, t) =>
        (t >= 2 && e.substring(t - 2, t + 1) === "```") ||
        (t >= 1 && e.substring(t - 1, t + 2) === "```") ||
        (t <= e.length - 3 && e.substring(t, t + 3) === "```")),
      (Nt = (e) => {
        let t = 0,
          n = !1;
        for (let r = 0; r < e.length - 1; r += 1)
          (e[r] === "`" && !Mt(e, r) && (n = !n),
            !n && e[r] === `$` && e[r + 1] === `$` && ((t += 1), (r += 1)));
        return t;
      }),
      (Pt = (e) => {
        let t = 0,
          n = !1;
        for (let r = 0; r < e.length; r += 1) {
          if (e[r] === `\\`) {
            r += 1;
            continue;
          }
          if (e[r] === "`" && !Mt(e, r)) {
            n = !n;
            continue;
          }
          !n && e[r] === `$` && (r + 1 < e.length && e[r + 1] === `$` ? (r += 1) : (t += 1));
        }
        return t;
      }),
      (Ft = (e) => {
        if (e.endsWith(`$`) && !e.endsWith(`$$`)) return `${e}$`;
        let t = e.indexOf(`$$`);
        return t !== -1 &&
          e.indexOf(
            `
`,
            t,
          ) !== -1 &&
          !e.endsWith(`
`)
          ? `${e}
$$`
          : `${e}$$`;
      }),
      (It = (e) => (Nt(e) % 2 == 0 ? e : Ft(e))),
      (Lt = (e) => (Pt(e) % 2 == 1 ? `${e}$` : e)),
      (Rt = (e, t, n) => {
        if (e.substring(t + 2).includes(`)`)) return null;
        let r = st(e, t);
        if (r === -1 || v(e, r)) return null;
        let i = r > 0 && e[r - 1] === `!`,
          a = i ? r - 1 : r,
          o = e.substring(0, a);
        if (i) return o;
        let s = e.substring(r + 1, t);
        return n === `text-only` ? `${o}${s}` : `${o}[${s}](streamdown:incomplete-link)`;
      }),
      (zt = (e, t) => {
        for (let n = 0; n < t; n++)
          if (e[n] === `[` && !v(e, n)) {
            if (n > 0 && e[n - 1] === `!`) continue;
            let t = S(e, n);
            if (t === -1) return n;
            if (t + 1 < e.length && e[t + 1] === `(`) {
              let r = e.indexOf(`)`, t + 2);
              r !== -1 && (n = r);
            }
          }
        return t;
      }),
      (Bt = (e, t, n) => {
        let r = t > 0 && e[t - 1] === `!`,
          i = r ? t - 1 : t;
        if (!e.substring(t + 1).includes(`]`)) {
          let a = e.substring(0, i);
          if (r) return a;
          if (n === `text-only`) {
            let n = zt(e, t);
            return e.substring(0, n) + e.substring(n + 1);
          }
          return `${e}](streamdown:incomplete-link)`;
        }
        if (S(e, t) === -1) {
          let a = e.substring(0, i);
          if (r) return a;
          if (n === `text-only`) {
            let n = zt(e, t);
            return e.substring(0, n) + e.substring(n + 1);
          }
          return `${e}](streamdown:incomplete-link)`;
        }
        return null;
      }),
      (Vt = (e, t = `protocol`) => {
        let n = e.lastIndexOf(`](`);
        if (n !== -1 && !v(e, n)) {
          let r = Rt(e, n, t);
          if (r !== null) return r;
        }
        for (let n = e.length - 1; n >= 0; --n)
          if (e[n] === `[` && !v(e, n)) {
            let r = Bt(e, n, t);
            if (r !== null) return r;
          }
        return e;
      }),
      (Ht = /^-{1,2}$/),
      (Ut = /^[\s]*-{1,2}[\s]+$/),
      (Wt = /^={1,2}$/),
      (Gt = /^[\s]*={1,2}[\s]+$/),
      (Kt = (e) => {
        if (!e || typeof e != `string`) return e;
        let t = e.lastIndexOf(`
`);
        if (t === -1) return e;
        let n = e.substring(t + 1),
          r = e.substring(0, t),
          i = n.trim();
        if (Ht.test(i) && !n.match(Ut)) {
          let t = r
            .split(`
`)
            .at(-1);
          if (t && t.trim().length > 0) return `${e}\u200B`;
        }
        if (Wt.test(i) && !n.match(Gt)) {
          let t = r
            .split(`
`)
            .at(-1);
          if (t && t.trim().length > 0) return `${e}\u200B`;
        }
        return e;
      }),
      (qt = RegExp(`(?<=[\\p{L}\\p{N}_])~(?!~)(?=[\\p{L}\\p{N}_])`, `gu`)),
      (Jt = (e) =>
        !e || typeof e != `string` || !e.includes(`~`)
          ? e
          : e.replace(qt, (t, n) => (v(e, n) ? t : `\\~`))),
      (Yt = (e) => {
        let t = e.match($e);
        if (t) {
          let n = t[2];
          if (!n || b.test(n)) return e;
          let r = e.lastIndexOf(t[1]);
          if (v(e, r) || y(e, r)) return e;
          if (e.match(ot)?.length % 2 == 1) return `${e}~~`;
        } else {
          let t = e.match(at);
          if (t) {
            let n = e.lastIndexOf(t[0].slice(0, 2));
            if (v(e, n) || y(e, n)) return e;
            if (e.match(ot)?.length % 2 == 1) return `${e}~`;
          }
        }
        return e;
      }),
      (k = (e) => e !== !1),
      (Xt = (e) => e === !0),
      (A = {
        SINGLE_TILDE: 0,
        COMPARISON_OPERATORS: 5,
        HTML_TAGS: 10,
        SETEXT_HEADINGS: 15,
        LINKS: 20,
        BOLD_ITALIC: 30,
        BOLD: 35,
        ITALIC_DOUBLE_UNDERSCORE: 40,
        ITALIC_SINGLE_ASTERISK: 41,
        ITALIC_SINGLE_UNDERSCORE: 42,
        INLINE_CODE: 50,
        STRIKETHROUGH: 60,
        KATEX: 70,
        INLINE_KATEX: 75,
        DEFAULT: 100,
      }),
      (Zt = [
        {
          handler: { name: `singleTilde`, handle: Jt, priority: A.SINGLE_TILDE },
          optionKey: `singleTilde`,
        },
        {
          handler: { name: `comparisonOperators`, handle: Ke, priority: A.COMPARISON_OPERATORS },
          optionKey: `comparisonOperators`,
        },
        { handler: { name: `htmlTags`, handle: Ot, priority: A.HTML_TAGS }, optionKey: `htmlTags` },
        {
          handler: { name: `setextHeadings`, handle: Kt, priority: A.SETEXT_HEADINGS },
          optionKey: `setextHeadings`,
        },
        {
          handler: { name: `links`, handle: Vt, priority: A.LINKS },
          optionKey: `links`,
          earlyReturn: (e) => e.endsWith(`](streamdown:incomplete-link)`),
        },
        {
          handler: { name: `boldItalic`, handle: Et, priority: A.BOLD_ITALIC },
          optionKey: `boldItalic`,
        },
        { handler: { name: `bold`, handle: ht, priority: A.BOLD }, optionKey: `bold` },
        {
          handler: {
            name: `italicDoubleUnderscore`,
            handle: _t,
            priority: A.ITALIC_DOUBLE_UNDERSCORE,
          },
          optionKey: `italic`,
        },
        {
          handler: { name: `italicSingleAsterisk`, handle: yt, priority: A.ITALIC_SINGLE_ASTERISK },
          optionKey: `italic`,
        },
        {
          handler: {
            name: `italicSingleUnderscore`,
            handle: Ct,
            priority: A.ITALIC_SINGLE_UNDERSCORE,
          },
          optionKey: `italic`,
        },
        {
          handler: { name: `inlineCode`, handle: jt, priority: A.INLINE_CODE },
          optionKey: `inlineCode`,
        },
        {
          handler: { name: `strikethrough`, handle: Yt, priority: A.STRIKETHROUGH },
          optionKey: `strikethrough`,
        },
        { handler: { name: `katex`, handle: It, priority: A.KATEX }, optionKey: `katex` },
        {
          handler: { name: `inlineKatex`, handle: Lt, priority: A.INLINE_KATEX },
          optionKey: `inlineKatex`,
        },
      ]),
      (Qt = (e) => {
        let t = e?.linkMode ?? `protocol`;
        return Zt.filter(({ handler: t, optionKey: n }) =>
          t.name === `links`
            ? k(e?.links) || k(e?.images)
            : t.name === `inlineKatex`
              ? Xt(e?.inlineKatex)
              : k(e?.[n]),
        ).map(({ handler: e, earlyReturn: n }) =>
          e.name === `links`
            ? {
                handler: _(g({}, e), { handle: (e) => Vt(e, t) }),
                earlyReturn: t === `protocol` ? n : void 0,
              }
            : { handler: e, earlyReturn: n },
        );
      }),
      ($t = (e, t) => {
        if (!e || typeof e != `string`) return e;
        let n = e.endsWith(` `) && !e.endsWith(`  `) ? e.slice(0, -1) : e,
          r = Qt(t),
          i = (t?.handlers ?? []).map((e) => ({
            handler: _(g({}, e), { priority: e.priority ?? A.DEFAULT }),
            earlyReturn: void 0,
          })),
          a = [...r, ...i].sort((e, t) => (e.handler.priority ?? 0) - (t.handler.priority ?? 0));
        for (let { handler: e, earlyReturn: t } of a)
          if (((n = e.handle(n)), t != null && t(n))) return n;
        return n;
      }),
      (en = $t));
  });
function nn(e) {
  return e.replace(an, ``).replace(rn, ``);
}
var rn,
  an,
  on = t(() => {
    ((rn = /cite(?:[^]*)?/g), (an = /[ \t]*cite(?:[^]*)?(?=\r?\n|$)/g));
  });
function j(e) {
  return e === ` ` || e === `	`;
}
function sn(e) {
  return j(e) || e === `\r`;
}
function M(e, t, n) {
  let r = t;
  for (; r < n && j(e[r]);) r += 1;
  return r;
}
function N(e, t, n) {
  for (let r of mn) {
    let i = t + r.length;
    if (i <= n && e.slice(t, i).toLowerCase() === r) return { role: r, end: i };
  }
  return null;
}
function P(e) {
  let t = Math.min(e.lineEnd, e.contentStart + e.maxContentLength + 1),
    n = -1;
  for (let r = e.contentStart; r < t; r += 1) {
    let t = e.text[r];
    if (t === "`") return null;
    if (t === e.close) {
      n = r;
      break;
    }
  }
  if (n === -1) return null;
  let r = n - e.contentStart;
  return r < e.minContentLength || r > e.maxContentLength ? null : n + 1;
}
function cn(e) {
  return e === void 0 || sn(e) || e === `:` || e === `：`;
}
function ln(e, t, n) {
  let r = N(e, t, n);
  if (!r) return null;
  let i = M(e, r.end, n);
  if (e[i] !== `[`) return null;
  let a = P({
    text: e,
    contentStart: i + 1,
    lineEnd: n,
    close: `]`,
    minContentLength: 1,
    maxContentLength: 160,
  });
  return !a || !cn(e[a])
    ? null
    : { start: t, end: a, kind: `role_timestamp_bracket`, role: r.role };
}
function un(e, t, n) {
  if (e[t] !== `[`) return null;
  let r = P({
    text: e,
    contentStart: t + 1,
    lineEnd: n,
    close: `]`,
    minContentLength: 4,
    maxContentLength: 160,
  });
  if (!r) return null;
  let i = N(e, M(e, r, n), n);
  if (!i) return null;
  let a = M(e, i.end, n);
  return e[a] !== `:` && e[a] !== `：`
    ? null
    : { start: t, end: a + 1, kind: `timestamp_role_colon`, role: i.role };
}
function dn(e, t, n) {
  if (e[t] !== `<`) return null;
  let r = N(e, M(e, t + 1, n), n),
    i = r ? e[r.end] : void 0;
  if (!r || (i !== `>` && !j(i))) return null;
  let a = P({
    text: e,
    contentStart: r.end,
    lineEnd: n,
    close: `>`,
    minContentLength: 0,
    maxContentLength: 160,
  });
  return !a || !cn(e[a]) ? null : { start: t, end: a, kind: `angle_role_header`, role: r.role };
}
function fn(e, t) {
  return e.start < t.end && e.end > t.start;
}
function pn(e, t = []) {
  let n = [],
    r = [...t].toSorted((e, t) => e.start - t.start || e.end - t.end),
    i = 0,
    a = 0;
  for (; a < e.length;) {
    let t = e.indexOf(
        `
`,
        a,
      ),
      o = t === -1 ? e.length : t,
      s = M(e, a, o),
      c = un(e, s, o) ?? dn(e, s, o) ?? ln(e, s, o);
    if (c) {
      for (;;) {
        let e = r[i];
        if (!e || e.end > c.start) break;
        i += 1;
      }
      let e = r[i];
      (!e || !fn(c, e)) && n.push(c);
    }
    if (t === -1) break;
    a = t + 1;
  }
  return n;
}
var mn,
  hn = t(() => {
    mn = [`assistant`, `developer`, `system`, `user`];
  });
function gn(e, t) {
  let n = t ? 2 : 1;
  for (; n < e.length;) {
    let t = e.charCodeAt(n);
    if (!((t >= 65 && t <= 90) || (t >= 97 && t <= 122)) && !(t >= 48 && t <= 57) && t !== 45)
      break;
    n += 1;
  }
  return e.slice(t ? 2 : 1, n).toLowerCase();
}
function* _n(e) {
  let t = 0;
  for (; t < e.length;) {
    let n = e.indexOf(`<`, t);
    if (n < 0) return;
    let r = ge.exec(e.slice(n));
    if (!r) {
      t = n + 1;
      continue;
    }
    let i = r[0],
      a = i.startsWith(`</`),
      o = n + i.length,
      s = gn(i, a);
    if (!s) {
      t = o;
      continue;
    }
    (yield {
      raw: i,
      start: n,
      end: o,
      name: s,
      closing: a,
      selfClosing: !a && i.trimEnd().endsWith(`/>`),
    },
      (t = o));
  }
}
var vn = t(() => {
  Oe();
});
function yn(e) {
  let t = [],
    n = [],
    r = -1;
  for (let i of _n(e))
    if (On.has(i.name))
      if (i.closing) {
        let e = n.lastIndexOf(i.name);
        e !== -1 &&
          (n.splice(e), n.length === 0 && r !== -1 && (t.push({ start: r, end: i.end }), (r = -1)));
      } else i.selfClosing || (n.length === 0 && (r = i.start), n.push(i.name));
  return (n.length > 0 && r !== -1 && t.push({ start: r, end: e.length }), t);
}
function bn(e, t) {
  return e.type === `softbreak` || e.type === `hardbreak`
    ? {
        text: `
`,
        excludedRanges: [],
      }
    : e.type === `html_inline` && t.isStructuralHtmlInline?.(e) === !0
      ? null
      : e.type === `text` || e.type === `html_inline`
        ? { text: e.content, excludedRanges: [] }
        : e.type === `code_inline`
          ? { text: e.content, excludedRanges: [{ start: 0, end: e.content.length }] }
          : e.type === `image`
            ? e.children && e.children.length > 0
              ? xn(e.children, t)
              : { text: e.content, excludedRanges: [] }
            : null;
}
function xn(e, t) {
  let n = ``,
    r = [];
  for (let i of e) {
    let e = bn(i, t);
    if (!e) continue;
    let a = n.length;
    n += e.text;
    for (let t of e.excludedRanges) r.push({ start: a + t.start, end: a + t.end });
  }
  return (r.push(...yn(n)), { text: n, excludedRanges: r });
}
function F(e, t, n, r = t.type) {
  let i = new e(r, r === `assistant_transcript_role_text` ? `` : t.tag, 0);
  return (Object.assign(i, t), (i.type = r), (i.content = n), (i.children = null), i);
}
function Sn(e, t, n, r) {
  let i = F(e, t, n, I);
  return (
    (i.meta = {
      ...(t.meta && typeof t.meta == `object` ? t.meta : {}),
      assistantTranscriptRoleHeader: { kind: r.kind, role: r.role },
    }),
    i
  );
}
function Cn(e) {
  let { token: t, visibleStart: n } = e,
    r = n + t.content.length,
    i = e.spans[e.spanStartIndex];
  if (!i || i.start >= r) return [t];
  let a = [],
    o = 0;
  for (let i = e.spanStartIndex; i < e.spans.length; i += 1) {
    let s = e.spans[i];
    if (!s || s.start >= r) break;
    if (s.end <= n) continue;
    let c = Math.max(s.start, n) - n,
      l = Math.min(s.end, r) - n;
    (c > o && a.push(F(e.TokenType, t, t.content.slice(o, c))),
      l > c && a.push(Sn(e.TokenType, t, t.content.slice(c, l), s)),
      (o = l));
  }
  return (o < t.content.length && a.push(F(e.TokenType, t, t.content.slice(o))), a);
}
function wn(e, t, n, r) {
  let i = xn(t, r),
    a = pn(i.text, i.excludedRanges);
  if (a.length === 0) return t;
  let o = [],
    s = 0,
    c = 0;
  for (let n of t) {
    let t = bn(n, r);
    if (!t) {
      o.push(n);
      continue;
    }
    let i = t.text;
    for (;;) {
      let e = a[c];
      if (!e || e.end > s) break;
      c += 1;
    }
    if (n.type === `text` || n.type === `html_inline`)
      o.push(...Cn({ TokenType: e, token: n, visibleStart: s, spanStartIndex: c, spans: a }));
    else if (n.type === `image`) {
      let e = s + i.length,
        t = [];
      for (let n = c; n < a.length; n += 1) {
        let r = a[n];
        if (!r || r.start >= e) break;
        r.end <= s ||
          t.push({ ...r, start: Math.max(r.start, s) - s, end: Math.min(r.end, e) - s });
      }
      (t.length > 0 &&
        (n.meta = {
          ...(n.meta && typeof n.meta == `object` ? n.meta : {}),
          assistantTranscriptRoleImage: { text: i, spans: t },
        }),
        o.push(n));
    } else o.push(n);
    s += i.length;
  }
  return n ? o : Tn(o);
}
function Tn(e) {
  let t = [],
    n = new Set();
  for (let r of e) {
    if (r.type === `link_open`) {
      t.push({ token: r, containsRole: !1 });
      continue;
    }
    let e = r.meta?.assistantTranscriptRoleImage;
    if (r.type === `assistant_transcript_role_text` || e?.spans.length) {
      for (let e of t) e.containsRole = !0;
      continue;
    }
    if (r.type !== `link_close`) continue;
    let i = t.pop();
    i?.containsRole && (n.add(i.token), n.add(r));
  }
  let r = [];
  for (let t of e) {
    if (n.has(t)) continue;
    let e = r.at(-1);
    if (
      e?.type === `assistant_transcript_role_text` &&
      t.type === `assistant_transcript_role_text`
    ) {
      e.content += t.content;
      continue;
    }
    r.push(t);
  }
  return r;
}
function En(e, t) {
  let n = pn(t.content, yn(t.content));
  return n.length === 0
    ? [t]
    : Cn({ TokenType: e, token: t, visibleStart: 0, spanStartIndex: 0, spans: n });
}
function Dn(e, t = {}) {
  e.core.ruler.after(`text_join`, `assistant_transcript_roles`, (e) => {
    if (e.env?.assistantTranscriptRoleHeaders !== !0) return;
    let n = [],
      r = e.env?.assistantTranscriptRolePreserveLinks === !0;
    for (let i of e.tokens) {
      if (i.type === `inline` && i.children) {
        ((i.children = wn(e.Token, i.children, r, t)), n.push(i));
        continue;
      }
      if (i.type === `html_block`) {
        n.push(...En(e.Token, i));
        continue;
      }
      n.push(i);
    }
    e.tokens = n;
  });
}
var I,
  On,
  kn = t(() => {
    (hn(),
      vn(),
      (I = `assistant_transcript_role_text`),
      (On = new Set([`code`, `pre`, `script`, `style`, `textarea`])));
  });
function L(e, t) {
  return `${Pn}${t(e)}${Fn}`;
}
function An(e, t, n) {
  let r = ``,
    i = 0;
  for (let a of t) {
    let t = Math.max(i, Math.min(a.start, e.length)),
      o = Math.max(t, Math.min(a.end, e.length));
    ((r += n(e.slice(i, t))), o > t && (r += L(e.slice(t, o), n)), (i = o));
  }
  return r + n(e.slice(i));
}
function jn(e, t) {
  (e.use(Dn, { isStructuralHtmlInline: (e) => e.meta?.taskListPlugin === !0 }),
    (e.renderer.rules[I] = (e, n) => {
      let r = e[n];
      return r ? L(r.content, t) : ``;
    }));
}
function Mn(e, t) {
  e.renderer.rules.image = (e, n) => {
    let r = e[n];
    if (!r) return ``;
    let i = r.attrGet(`src`)?.trim() ?? ``,
      a = t.normalizeLabel(r.content),
      o = r.meta?.assistantTranscriptRoleImage;
    if (!t.isInlineDataImage(i)) return o ? An(o.text, o.spans, t.escapeHtml) : t.escapeHtml(a);
    let s = `<img class="markdown-inline-image" src="${t.escapeHtml(i)}" alt="${t.escapeHtml(a)}">`;
    return o ? `${L(`${t.assistantLabel()}:`, t.escapeHtml)} ${s}` : s;
  };
}
function Nn(e, t, n, r) {
  let i = r(e);
  return t
    ? `<div class="markdown-plain-text-fallback">${L(`${n()}:`, r)}\n<span class="markdown-plain-text-source">${i}</span></div>`
    : `<div class="markdown-plain-text-fallback">${i}</div>`;
}
var Pn,
  Fn,
  In = t(() => {
    (kn(), (Pn = `<code class="assistant-transcript-role">`), (Fn = `</code>`));
  });
function Ln(e = {}) {
  return {
    assistantTranscriptRoleHeaders: e.assistantTranscriptRoleHeaders ?? !1,
    codeBlockChrome: e.codeBlockChrome ?? `copy`,
    fileLinks: e.fileLinks ?? !1,
  };
}
var Rn = t(() => {});
function zn(e) {
  let t = Q.get(e);
  return t === void 0 ? null : (Q.delete(e), Q.set(e, t), t);
}
function Bn(e, t) {
  if ((Q.set(e, t), Q.size <= Cr)) return;
  let n = Q.keys().next().value;
  n && Q.delete(n);
}
function Vn(e) {
  return e?.codeBlockChrome !== `none`;
}
function Hn(e) {
  return `${Or}${JSON.stringify(e)}`;
}
function Un(e, t) {
  if (t !== kr || !e.startsWith(Or)) return e;
  try {
    let t = JSON.parse(e.slice(24));
    return typeof t == `string` ? t : e;
  } catch {
    return e;
  }
}
function Wn(e) {
  let t = e.target;
  if (!(t instanceof Element)) return;
  let n = t.closest(`.code-block-copy`);
  n &&
    te(Un(n.dataset.code ?? ``, n.dataset.codeEncoding)).then((e) => {
      e && (n.classList.add(`copied`), setTimeout(() => n.classList.remove(`copied`), 1500));
    });
}
function Gn(e) {
  let t = e.target;
  if (!(t instanceof Element)) return null;
  let n = t.closest(`a[data-file-path]`),
    r = n?.dataset.filePath;
  if (!r) return null;
  let i = n.dataset.fileLine;
  return { path: r, line: i ? Number.parseInt(i, 10) : null };
}
function Kn(e) {
  let t = zr.exec(e),
    n = t?.[1];
  return t && n
    ? { path: e.slice(0, t.index), line: Number.parseInt(n, 10) }
    : { path: e, line: null };
}
function qn(e) {
  if (e.includes(`/`) || e.includes(`\\`)) return !1;
  let t = Rr.exec(e);
  return !!(t?.[1] && Br.has(t[1].toLowerCase()));
}
function R(e) {
  let t = e.trim();
  return !Ir.test(t) && !Lr.test(t) && !qn(t) ? null : Kn(t);
}
function Jn(e) {
  return Ar.test(e.trim());
}
function Yn(e) {
  if (l(e) !== null) return !0;
  let t = Xn();
  return !t || (e !== t && !e.startsWith(`${t}/`)) ? !1 : l(e, t) !== null;
}
function Xn() {
  return typeof window > `u` ? `` : o(window.location.pathname);
}
function z(e) {
  return e.split(`/`).filter(Boolean);
}
function Zn(e) {
  let t = z(e),
    n = z(Xn());
  return n.length === 0 || n.some((e, n) => t[n] !== e) ? t : t.slice(n.length);
}
function Qn(e, t) {
  return t.every((t, n) => e[n] === t);
}
function $n(e) {
  if (e.includes(`__openclaw__`) || e.includes(`__openclaw`)) return !0;
  let t = e[0];
  return !t || Wr.has(t) ? !0 : Gr.some((t) => Qn(e, t));
}
function er(e, t) {
  if (Ur.has(e)) return !0;
  let n = t[0];
  return n ? Hr.has(n) : !1;
}
function tr(e) {
  let t = e.trim();
  if (!t.startsWith(`/`) || t.startsWith(`//`)) return e;
  try {
    let n = new URL(t, Vr);
    if (n.origin !== Vr) return e;
    let r = n.pathname.replace(/\/+$/, ``) || `/`;
    if (Yn(r)) return e;
    let i = z(r);
    return $n(Zn(r)) ? e : er(r, i) ? n.href : e;
  } catch {
    return e;
  }
}
function nr() {
  K ||
    ((K = !0),
    p.addHook(`afterSanitizeAttributes`, (e) => {
      if (!(e instanceof HTMLAnchorElement)) return;
      let t = e.getAttribute(`href`);
      if (!t) return;
      if (Jn(t)) {
        e.removeAttribute(`href`);
        return;
      }
      let r = tr(t);
      r !== t && e.setAttribute(`href`, r);
      try {
        let t = new URL(r, window.location.href);
        if (t.protocol !== `http:` && t.protocol !== `https:` && t.protocol !== `mailto:`) {
          e.removeAttribute(`href`);
          return;
        }
      } catch {}
      (e.setAttribute(`rel`, `noreferrer noopener`),
        e.setAttribute(`target`, `_blank`),
        n(t).includes(`tail`) && e.classList.add(Kr));
    }));
}
function B(e) {
  return e
    .replace(/&/g, `&amp;`)
    .replace(/</g, `&lt;`)
    .replace(/>/g, `&gt;`)
    .replace(/"/g, `&quot;`)
    .replace(/'/g, `&#39;`);
}
function rr(e) {
  return e?.trim() || `image`;
}
function V(e) {
  return e.replace(
    /\r\n?|[\u2028\u2029]/g,
    `
`,
  );
}
function ir(e) {
  return ar(a(e, q));
}
function ar(e) {
  let t = e.truncated ? `\n\n… truncated (${e.total} chars, showing first ${e.text.length}).` : ``;
  return `${e.text}${t}`;
}
function H(e) {
  let t = V(e)
    .split(`
`)
    .filter((e) => e.trim().length > 0);
  if (t.length < 2) return !1;
  let n = 0;
  for (let e of t) {
    if (!Er.test(e) || !Dr.test(e)) return !1;
    n += Array.from(e).filter((e) => Dr.test(e)).length;
  }
  return n >= 8;
}
function or(e) {
  let t = qr.exec(sr(e));
  if (!t) return null;
  let n = t[1];
  return n ? { marker: n.charAt(0), length: n.length } : null;
}
function sr(e) {
  let t = e;
  for (let e = 0; e < 8; e += 1) {
    let e = t.replace(Jr, ``);
    if (e === t) return t;
    t = e;
  }
  return t;
}
function cr(e, t) {
  let n = sr(e).trimEnd(),
    r = qr.exec(n);
  if (!r) return !1;
  let i = r[1];
  return !i || i.charAt(0) !== t.marker || i.length < t.length
    ? !1
    : n.slice(r[0].length).trim() === ``;
}
function lr(e) {
  let t = 0,
    n = 0,
    r = null;
  for (; n < e.length;) {
    let i = e.indexOf(
        `
`,
        n,
      ),
      a = i === -1 ? e.length : i + 1,
      o = e.slice(n, i === -1 ? a : i);
    if (r) {
      (cr(o, r) && ((r = null), (t = a)), (n = a));
      continue;
    }
    let s = or(o);
    if (s) {
      ((r = s), (n = a));
      continue;
    }
    (o.trim() === `` && (t = a), (n = a));
  }
  return { boundary: t, tailHasOpenFence: r !== null };
}
function ur(e) {
  let t = e.trim().toLowerCase();
  return t
    ? ({
        "c++": `cpp`,
        cxx: `cpp`,
        js: `javascript`,
        jsx: `javascript`,
        md: `markdown`,
        sh: `bash`,
        shell: `bash`,
        ts: `typescript`,
        tsx: `typescript`,
      }[t] ?? t)
    : ``;
}
function dr(e, t) {
  let n = ur(t);
  try {
    if (n && f.getLanguage(n)) return f.highlight(e, { language: n, ignoreIllegals: !0 }).value;
    if (!n && e.trim()) {
      let t = f.highlightAuto(e, Xr);
      if (t.relevance >= 2) return t.value;
    }
  } catch {}
  return B(e);
}
function fr(e, t) {
  let n = [t.includes(`hljs-`) ? `hljs` : ``, e ? `language-${e}` : ``].filter(Boolean);
  return n.length > 0 ? ` class="${B(n.join(` `))}"` : ``;
}
function pr(e, t, n = {}) {
  if (n.blockArt || H(e)) return `<pre><code class="markdown-block-art">${B(e)}</code></pre>`;
  let r = dr(e, t);
  return `<pre><code${fr(t, r)}>${r}</code></pre>`;
}
function U(e, t, n, r = {}) {
  let i = r.blockArt || H(e),
    a = pr(e, t, { blockArt: i });
  if (!Vn(n)) return a;
  let o = t ? `<span class="code-block-lang">${B(t)}</span>` : ``,
    s = r.copyText ?? e,
    c = `<div class="code-block-header">${o}${`<button type="button" class="code-block-copy" data-code="${B(i ? Hn(s) : s)}"${i ? ` data-code-encoding="${kr}"` : ``} aria-label="${B(d(`common.copyCode`))}"><span class="code-block-copy__idle">${B(d(`common.copy`))}</span><span class="code-block-copy__done">${B(d(`common.copied`))}</span></button>`}</div>`,
    l = e.trim();
  if (
    t === `json` ||
    (!t && ((l.startsWith(`{`) && l.endsWith(`}`)) || (l.startsWith(`[`) && l.endsWith(`]`))))
  ) {
    let t = e.split(`
`).length;
    return `<details class="json-collapse"><summary>${t > 1 ? `JSON &middot; ${t} lines` : `JSON`}</summary><div class="code-block-wrapper">${c}${a}</div></details>`;
  }
  return `<div class="code-block-wrapper">${c}${a}</div>`;
}
function mr(e) {
  return e.endsWith(`
`)
    ? e.slice(0, -1)
    : e;
}
function hr(e, t) {
  let n = e[t - 1];
  return n === void 0 || /\s/.test(n) || `([{<"'\``.includes(n);
}
function gr(e, t) {
  let n = e[t];
  return n === void 0 || /\s/.test(n) || `.,;:!?)]}>"'`.includes(n);
}
function W(e, t) {
  nr();
  let n = a(e, q),
    r = ar(n);
  if (H(n.text)) return p.sanitize(U(r, ``, t, { blockArt: !0 }), G);
  if (n.text.length > Sr) return p.sanitize(vr(r, t), G);
  let i;
  try {
    i = $.render(r, t);
  } catch (e) {
    (console.warn(`[markdown] md.render failed, falling back to plain text:`, e), (i = vr(r, t)));
  }
  return p.sanitize(i, G);
}
function _r(e, t = {}) {
  let n = Ln(t),
    r = V(nn(e)),
    i = r.trim();
  if (!i) return ``;
  let a = H(r) ? r : i,
    o = i.length <= wr,
    s = `${u.getLocale()}\0${n.assistantTranscriptRoleHeaders}\0${n.codeBlockChrome}\0${n.fileLinks}\0${a}`;
  if (o) {
    let e = zn(s);
    if (e !== null) return e;
  }
  let c = W(a, n);
  return (o && Bn(s, c), c);
}
function vr(e, t) {
  return Nn(V(e), t.assistantTranscriptRoleHeaders, () => d(`sessionsView.assistant`), B);
}
function yr(e, t) {
  return W(en(e, Qr), t);
}
function br(e, t = {}) {
  let n = Ln(t),
    r = V(nn(e));
  if (H(r)) return W(r, n);
  let i = r.trim();
  if (!i) return ``;
  let a = ir(i),
    { boundary: o, tailHasOpenFence: s } = lr(a),
    c = a.slice(0, o),
    l = a.slice(o),
    u = o > 0 ? _r(c, t) : ``;
  return l.trim() ? `${u}${s ? W(l, n) : yr(l, n)}` : u;
}
var xr,
  G,
  K,
  q,
  Sr,
  Cr,
  wr,
  Tr,
  Er,
  Dr,
  Or,
  kr,
  Ar,
  J,
  Y,
  jr,
  X,
  Mr,
  Nr,
  Pr,
  Fr,
  Ir,
  Lr,
  Rr,
  Z,
  zr,
  Br,
  Vr,
  Hr,
  Ur,
  Wr,
  Gr,
  Q,
  Kr,
  qr,
  Jr,
  Yr,
  Xr,
  $,
  Zr,
  Qr,
  $r = t(() => {
    (ce(),
      se(),
      fe(),
      le(),
      re(),
      de(),
      oe(),
      ie(),
      Ie(),
      Le(),
      he(),
      Se(),
      ke(),
      ye(),
      Te(),
      je(),
      De(),
      (xr = e(Me(), 1)),
      tn(),
      on(),
      s(),
      c(),
      ee(),
      ne(),
      i(),
      r(),
      In(),
      Rn(),
      (G = {
        ALLOWED_TAGS:
          `a.b.blockquote.br.button.code.del.details.div.em.h1.h2.h3.h4.hr.i.input.li.ol.p.pre.s.span.strong.summary.table.tbody.td.th.thead.tr.ul.img`.split(
            `.`,
          ),
        ALLOWED_ATTR: [
          `checked`,
          `class`,
          `disabled`,
          `href`,
          `rel`,
          `target`,
          `title`,
          `start`,
          `src`,
          `alt`,
          `data-code`,
          `data-code-encoding`,
          `data-file-line`,
          `data-file-path`,
          `type`,
          `aria-label`,
        ],
        ADD_DATA_URI_TAGS: [`img`],
      }),
      (K = !1),
      (q = 14e4),
      (Sr = 4e4),
      (Cr = 200),
      (wr = 5e4),
      (Tr = /^data:image\/[a-z0-9.+-]+;base64,/i),
      (Er = /^[\t \u00a0▀▄█]+$/u),
      (Dr = /[▀▄█]/u),
      (Or = `openclaw:block-art-code:`),
      (kr = `block-art-json`),
      (Ar =
        /^(?:~\/|\/(?:Users|home|tmp|private\/tmp|var\/folders|private\/var\/folders)\/|\/[A-Za-z]:\/|[A-Za-z]:[\\/])/),
      (J = `[A-Za-z0-9_.@#+-]+`),
      (Y = `[A-Za-z0-9]{1,8}`),
      (jr = `:\\d{1,6}(?::\\d{1,6})?`),
      (X = `${J}\\.${Y}`),
      (Mr = `(?:~\\/|\\.\\.\\/|\\.\\/|\\/)(?:${J}\\/)*${X}`),
      (Nr = `${J}(?:\\/${J})*\\/${X}`),
      (Pr = `(?:${Mr}|${`[A-Za-z]:[\\\\/](?:${J}[\\\\/])*${X}`}|${Nr})(?:${jr})?`),
      (Fr = `${J}\\.${Y}${jr}`),
      (Ir = RegExp(`^${Pr}$`)),
      (Lr = RegExp(`^${Fr}$`)),
      (Rr = RegExp(`^${J}\\.(${Y})$`, `i`)),
      (Z = RegExp(`${Pr}|${Fr}`, `g`)),
      (zr = /:(\d{1,6})(?::\d{1,6})?$/),
      (Br = new Set(
        `astro.bash.c.cc.cfg.cjs.conf.cpp.cs.css.diff.fish.go.h.hpp.htm.html.ini.java.js.json.jsonc.jsx.kt.kts.less.lock.log.markdown.md.mdx.mjs.patch.plist.proto.py.rb.rs.scss.sh.sql.svelte.svg.swift.toml.ts.tsx.txt.vue.xml.yaml.yml.zsh`.split(
          `.`,
        ),
      )),
      (Vr = `https://docs.openclaw.ai`),
      (Hr = new Set(
        `agent-runtime-architecture.announcements.auth-credential-semantics.automation.brave-search.channels.ci.clawhub.cli.concepts.date-time.debug.diagnostics.gateway.help.index.install.logging.maturity-scorecard.network.nodes.openclaw-agent-runtime.perplexity.plan.platforms.plugins.prose.providers.refactor.reference.security.specs.start.tools.tts.vps.web`.split(
          `.`,
        ),
      )),
      (Ur = new Set(
        `/AGENTS.default,/RELEASING,/agent,/agent-loop,/agent-send,/agent-workspace,/android,/anthropic,/architecture,/audio,/auth-monitoring,/azure,/background-process,/bash,/bonjour,/browser,/browser-linux-troubleshooting,/bun,/camera,/clawd,/clawdhub,/compaction,/configuration,/context,/context-engine,/control-ui,/cron,/cron-jobs,/cron-vs-heartbeat,/dashboard,/device-models,/discord,/discovery,/docker,/doctor,/duckduckgo-search,/elevated,/exa-search,/experiments/plans/cron-add-hardening,/experiments/plans/group-policy-hardening,/faq,/gateway-lock,/gcp,/gemini-search,/getting-started,/glm,/gmail-pubsub,/grammy,/grok-search,/group-messages,/groups,/health,/heartbeat,/hubs,/images,/imessage,/ios,/kimi-search,/line,/linux,/location,/location-command,/lore,/mac/bun,/mac/canvas,/mac/child-process,/mac/dev-setup,/mac/health,/mac/icon,/mac/logging,/mac/menu-bar,/mac/peekaboo,/mac/permissions,/mac/release,/mac/remote,/mac/signing,/mac/skills,/mac/voice-overlay,/mac/voicewake,/mac/webchat,/mac/xpc,/macos,/mattermost,/mcp,/message,/messages,/minimax,/mistral,/model,/model-failover,/models,/moonshot,/multi-agent,/nix,/northflank,/oauth,/onboarding,/openai,/opencode,/opencode-go,/openrouter,/pairing,/pi,/pi-dev,/plugin,/podman,/poll,/presence,/provider-routing,/qianfan,/queue,/quickstart,/railway,/remote,/remote-gateway-readme,/render,/rpc,/sandbox,/sandboxing,/session,/session-tool,/sessions,/setup,/showcase,/signal,/skill-workshop,/skills,/skills-config,/slack,/slash-commands,/subagents,/tailscale,/talk,/telegram,/templates/AGENTS,/templates/BOOT,/templates/BOOTSTRAP,/templates/HEARTBEAT,/templates/IDENTITY,/templates/SOUL,/templates/TOOLS,/templates/USER,/test,/thinking,/timezone,/troubleshooting,/tui,/typebox,/updating,/voicewake,/web-fetch,/webchat,/webhook,/whatsapp,/windows,/wizard,/xiaomi,/zai`.split(
          `,`,
        ),
      )),
      (Wr = new Set([
        `__openclaw`,
        `__openclaw__`,
        `_next`,
        `api`,
        `apple-touch-icon.png`,
        `assets`,
        `avatar`,
        `favicon-32.png`,
        `favicon.ico`,
        `favicon.svg`,
        `manifest.json`,
        `manifest.webmanifest`,
        `media`,
        `res`,
        `socket.io`,
        `sw.js`,
        `static`,
        `ws`,
      ])),
      (Gr = [
        [`plugins`, `diffs`],
        [`plugins`, `diffs-language-pack`],
      ]),
      (Q = new Map()),
      (Kr = `chat-link-tail-blur`),
      (qr = /^[ \t]{0,3}(`{3,}|~{3,})/),
      (Jr = /^[ \t]{0,3}(?:(?:>\s?)|(?:(?:[-+*]|\d{1,9}[.)])[ \t]+))/),
      (Yr = RegExp(
        `[\\u2E80-\\u2FFF\\u3000-\\u303F\\u3040-\\u309F\\u30A0-\\u30FF\\u3400-\\u4DBF\\u4E00-\\u9FFF\\uAC00-\\uD7AF\\uF900-\\uFAFF\\uFF01-\\uFF60]`,
      )));
    for (let [e, t, n] of [
      [`bash`, ue, [`sh`, `shell`]],
      [`cpp`, Ce, [`c++`, `cxx`]],
      [`css`, we, []],
      [`diff`, ae, [`patch`]],
      [`go`, me, [`golang`]],
      [`java`, Fe, []],
      [`javascript`, pe, [`js`, `jsx`]],
      [`json`, _e, []],
      [`markdown`, Pe, [`md`]],
      [`python`, xe, [`py`]],
      [`rust`, Ee, [`rs`]],
      [`typescript`, be, [`ts`, `tsx`]],
      [`xml`, Ne, [`html`, `svg`]],
      [`yaml`, ve, [`yml`]],
    ])
      (f.registerLanguage(e, t), n.length > 0 && f.registerAliases([...n], { languageName: e }));
    ((Xr = [
      `bash`,
      `cpp`,
      `css`,
      `diff`,
      `go`,
      `java`,
      `javascript`,
      `json`,
      `markdown`,
      `python`,
      `rust`,
      `typescript`,
      `xml`,
      `yaml`,
    ]),
      ($ = new Ae({ html: !0, breaks: !0, linkify: !0 })),
      (Zr = $.renderer.rules.code_inline),
      $.enable(`strikethrough`),
      jn($, B),
      $.linkify.set({ fuzzyLink: !1 }),
      $.linkify.add(`www`, {
        validate(e, t) {
          let n = e.slice(t),
            r = n.match(
              /^\.(?:[a-zA-Z0-9-]+\.?)+[^\s<\u2E80-\u2FFF\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uAC00-\uD7AF\uF900-\uFAFF\uFF01-\uFF60]*/,
            );
          if (!r) return 0;
          let i = r[0].length,
            a = { ")": `(`, "]": `[`, "}": `{`, '"': `"`, "'": `'` },
            o = {};
          for (let [e, t] of Object.entries(a)) {
            o[e] = 0;
            for (let r = 0; r < i; r++) {
              let i = n.charAt(r);
              t === e
                ? i === t && (o[e] = +(o[e] === 0))
                : i === t
                  ? (o[e] = (o[e] ?? 0) + 1)
                  : i === e && (o[e] = (o[e] ?? 0) - 1);
            }
          }
          for (; i > 0;) {
            let e = n.charAt(i - 1);
            if (/[?!.,:*_~]/.test(e)) {
              i--;
              continue;
            }
            if (e === `;`) {
              let e = i - 2;
              for (; e >= 0 && /[a-zA-Z0-9]/.test(n.charAt(e));) e--;
              if (e >= 0 && n.charAt(e) === `&` && e < i - 2) {
                i = e;
                continue;
              }
              break;
            }
            let t = a[e];
            if (t !== void 0) {
              if (t === e) {
                if ((o[e] ?? 0) !== 0) {
                  ((o[e] = 0), i--);
                  continue;
                }
              } else if ((o[e] ?? 0) < 0) {
                ((o[e] = (o[e] ?? 0) + 1), i--);
                continue;
              }
            }
            break;
          }
          return i;
        },
        normalize(e) {
          e.url = `http://` + e.url;
        },
      }),
      ($.validateLink = () => !0),
      $.core.ruler.after(`linkify`, `linkify-cjk-trim`, (e) => {
        for (let t of e.tokens) {
          if (t.type !== `inline` || !t.children) continue;
          let n = t.children;
          for (let t = n.length - 1; t >= 0; t--) {
            let r = n[t];
            if (!r || r.type !== `link_open` || r.markup !== `linkify`) continue;
            let i = n[t + 1];
            if (!i || i.type !== `text`) continue;
            let a = i.content,
              o = a.length;
            for (; o > 0 && Yr.test(a.charAt(o - 1));) o--;
            if (o <= 0 || o === a.length) continue;
            let s = a.slice(0, o),
              c = a.slice(o),
              l = r.attrGet(`href`) ?? ``,
              u = l.indexOf(a),
              d = u > 0 ? l.slice(0, u) : ``;
            (r.attrSet(`href`, d + s), (i.content = s));
            for (let r = t + 1; r < n.length; r++)
              if (n[r]?.type === `link_close`) {
                let t = new e.Token(`text`, ``, 0);
                ((t.content = c), n.splice(r + 1, 0, t));
                break;
              }
          }
        }
      }),
      $.core.ruler.after(`linkify`, `file-links`, (e) => {
        if (e.env?.fileLinks === !0)
          for (let t of e.tokens) {
            if (t.type !== `inline` || !t.children) continue;
            let n = t.children,
              r = 0;
            for (let t = 0; t < n.length; t += 1) {
              let i = n[t];
              if (!i) continue;
              if (i.type === `link_open`) {
                let e = i.attrGet(`href`);
                if (e) {
                  let t = e;
                  try {
                    t = decodeURIComponent(e);
                  } catch {}
                  if (!t.includes(`://`)) {
                    let e = R(t) ?? (Jn(t) ? Kn(t.trim()) : null);
                    e &&
                      ((i.attrs = i.attrs?.filter(([e]) => e !== `href`) ?? null),
                      i.attrJoin(`class`, `markdown-file-link`),
                      i.attrSet(`data-file-path`, e.path),
                      e.line !== null && i.attrSet(`data-file-line`, String(e.line)));
                  }
                }
                r += 1;
                continue;
              }
              if (i.type === `link_close`) {
                r = Math.max(0, r - 1);
                continue;
              }
              if (r > 0 || i.type !== `text`) continue;
              let a = [],
                o = 0;
              Z.lastIndex = 0;
              for (let t of i.content.matchAll(Z)) {
                let n = t.index,
                  r = t[0],
                  s = n + r.length;
                if (!hr(i.content, n) || !gr(i.content, s)) continue;
                let c = R(r);
                if (!c) continue;
                if (n > o) {
                  let t = new e.Token(`text`, ``, 0);
                  ((t.content = i.content.slice(o, n)), a.push(t));
                }
                let l = new e.Token(`link_open`, `a`, 1);
                ((l.markup = `file-link`),
                  l.attrSet(`class`, `markdown-file-link`),
                  l.attrSet(`data-file-path`, c.path),
                  c.line !== null && l.attrSet(`data-file-line`, String(c.line)));
                let u = new e.Token(`text`, ``, 0);
                u.content = r;
                let d = new e.Token(`link_close`, `a`, -1);
                ((d.markup = `file-link`), a.push(l, u, d), (o = s));
              }
              if (a.length !== 0) {
                if (o < i.content.length) {
                  let t = new e.Token(`text`, ``, 0);
                  ((t.content = i.content.slice(o)), a.push(t));
                }
                (n.splice(t, 1, ...a), (t += a.length - 1));
              }
            }
          }
      }),
      $.use(xr.default, { enabled: !1, label: !1 }),
      $.core.ruler.after(`github-task-lists`, `task-list-allowlist`, (e) => {
        for (let [t, n] of e.tokens.entries()) {
          if (n.type !== `list_item_open` || n.attrGet(`class`) !== `task-list-item`) continue;
          let r = e.tokens[t + 2]?.children?.[0];
          r?.type === `html_inline` && (r.meta = { taskListPlugin: !0 });
        }
      }),
      ($.renderer.rules.html_block = (e, t) => {
        let n = e[t];
        return n
          ? B(n.content) +
              `
`
          : ``;
      }),
      ($.renderer.rules.html_inline = (e, t) => {
        let n = e[t];
        return n?.meta?.taskListPlugin === !0 ? n.content : B(n?.content ?? ``);
      }),
      ($.renderer.rules.code_inline = (e, t, n, r, i) => {
        let a = Zr(e, t, n, r, i),
          o = r,
          s = e[t],
          c = s && o?.fileLinks === !0 ? R(s.content) : null;
        if (!c) return a;
        let l = c.line === null ? `` : ` data-file-line="${B(String(c.line))}"`;
        return `<a class="markdown-file-link" data-file-path="${B(c.path)}"${l}>${a}</a>`;
      }),
      Mn($, {
        escapeHtml: B,
        isInlineDataImage: (e) => Tr.test(e),
        normalizeLabel: rr,
        assistantLabel: () => d(`sessionsView.assistant`),
      }),
      ($.renderer.rules.fence = (e, t, n, r) => {
        let i = e[t];
        if (!i) return ``;
        let a = i.info.trim().split(/\s+/)[0] || ``;
        return U(i.content, a, r, { copyText: mr(i.content) });
      }),
      ($.renderer.rules.code_block = (e, t, n, r) => {
        let i = e[t]?.content;
        return i === void 0 ? `` : U(i, ``, r, { copyText: mr(i) });
      }),
      (Qr = { katex: !1, linkMode: `text-only` }));
  });
export { _r as a, Gn as i, $r as n, br as o, H as r, Wn as t };
//# sourceMappingURL=markdown-ERFX4kV-.js.map
