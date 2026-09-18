import {
  Ft as ye,
  Ht as be,
  It as c,
  Kt as xe,
  Mt as Se,
  Nt as l,
  Pt as u,
  St as d,
  Vt as f,
  Wt as Ce,
  _t as p,
  d as m,
  ht as h,
  vt as we,
} from "./control-ui-foundation-CSxeaoE-.js";
import {
  $ as t,
  B as n,
  F as r,
  G as i,
  H as ee,
  J as te,
  K as ne,
  L as re,
  N as ie,
  Q as ae,
  R as oe,
  V as se,
  W as ce,
  X as le,
  Y as ue,
  Z as de,
  a as fe,
  at as a,
  d as pe,
  et as o,
  l as me,
  q as he,
  rt as s,
  t as ge,
  tt as _e,
  z as ve,
} from "./control-ui-foundation-DmtL9jaX.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
function g(e, t) {
  return u(e) && h(e, `~kind`) && d(e[`~kind`], t);
}
function _(e) {
  return u(e);
}
var v = e(() => {
  m();
});
function y(e, t, n) {
  return a({ "~kind": `Deferred` }, { type: `deferred`, action: e, parameters: t, options: n }, {});
}
function Te(e) {
  return g(e, `Deferred`);
}
var b = e(() => {
  (o(), v());
});
function Ee(e, t) {
  return a({ "~kind": `Array` }, { type: `array`, items: e }, t);
}
function De(e) {
  return g(e, `Array`);
}
function Oe(e) {
  return s(e, [`~kind`, `type`, `items`]);
}
var ke = e(() => {
  (o(), v());
});
function Ae(e, t, n = {}) {
  return a({ "~kind": `Constructor` }, { type: `constructor`, parameters: e, instanceType: t }, n);
}
function je(e) {
  return g(e, `Constructor`);
}
function Me(e) {
  return s(e, [`~kind`, `type`, `parameters`, `instanceType`]);
}
var Ne = e(() => {
  (o(), v());
});
function Pe(e, t, n = {}) {
  return a({ "~kind": `Function` }, { type: `function`, parameters: e, returnType: t }, n);
}
function Fe(e) {
  return g(e, `Function`);
}
function Ie(e) {
  return s(e, [`~kind`, `type`, `parameters`, `returnType`]);
}
var Le = e(() => {
  (o(), v());
});
function Re(e, t) {
  return a({ "~kind": `Ref` }, { $ref: e }, t);
}
function ze(e) {
  return g(e, `Ref`);
}
var Be = e(() => {
  (o(), v());
});
function Ve(e, t) {
  return a({ "~kind": `Generic` }, { type: `generic`, parameters: e, expression: t });
}
function He(e) {
  return g(e, `Generic`);
}
var Ue = e(() => {
  (o(), v());
});
function We(e) {
  return a({ "~kind": `Any` }, {}, e);
}
function Ge(e) {
  return g(e, `Any`);
}
var Ke = e(() => {
  (o(), v());
});
function qe(e) {
  return a({ "~kind": `Never` }, { not: {} }, e);
}
function Je(e) {
  return g(e, `Never`);
}
var Ye,
  Xe = e(() => {
    (o(), v(), (Ye = `(?!)`));
  });
function Ze(e) {
  return le(e);
}
function Qe(e) {
  return _(e) && h(e, `~optional`);
}
var x = e(() => {
  (m(), v(), de());
});
function $e(e) {
  return f(e).filter((t) => !Qe(e[t]));
}
function et(e) {
  return f(e);
}
function tt(e) {
  return Ce(e);
}
var S = e(() => {
  (m(), x());
});
function nt(e, t = {}) {
  let n = $e(e);
  return a(
    { "~kind": `Object` },
    { type: `object`, ...(n.length > 0 ? { required: n } : {}), properties: e },
    t,
  );
}
function rt(e) {
  return g(e, `Object`);
}
function it(e) {
  return s(e, [`~kind`, `type`, `properties`, `required`]);
}
var at = e(() => {
  (o(), v(), S());
});
function ot(e) {
  return a({ "~kind": `Unknown` }, {}, e);
}
function st(e) {
  return g(e, `Unknown`);
}
var C = e(() => {
  (o(), v());
});
function ct(e, t, n) {
  return a(
    { "~kind": `Cyclic` },
    { $defs: f(e).reduce((t, n) => ({ ...t, [n]: _e(e[n], {}, { $id: n }) }), {}), $ref: t },
    n,
  );
}
function lt(e) {
  return g(e, `Cyclic`);
}
var ut = e(() => {
  (m(), o(), v());
});
function dt(e) {
  return _e(e, { "~unsafe": null }, {});
}
function ft(e) {
  return ye(e) && h(e, `~unsafe`) && Se(e[`~unsafe`]);
}
var pt = e(() => {
  (m(), o());
});
function mt(e) {
  return g(e, `Infer`);
}
var ht = e(() => {
  (o(), v(), C());
});
function gt(e, t, n, r = {}) {
  return a({ "~kind": `Dependent` }, { if: e, then: t, else: n }, r);
}
function _t(e) {
  return g(e, `Dependent`);
}
function vt(e) {
  return s(e, [`~kind`, `if`, `then`, `else`]);
}
var yt = e(() => {
  (o(), v());
});
function bt(e, t) {
  return a({ "~kind": `Enum` }, { enum: he(e) ? te(e) : e }, t);
}
function xt(e) {
  return g(e, `Enum`);
}
var St = e(() => {
  (o(), v(), ue());
});
function Ct(e, t = {}) {
  return a({ "~kind": `Intersect` }, { allOf: e }, t);
}
function wt(e) {
  return g(e, `Intersect`);
}
function Tt(e) {
  return s(e, [`~kind`, `allOf`]);
}
var Et = e(() => {
  (o(), v());
});
function Dt(e) {
  return (
    _(e) && h(e, `~codec`) && u(e[`~codec`]) && h(e[`~codec`], `encode`) && h(e[`~codec`], `decode`)
  );
}
var Ot = e(() => {
  (ae(), m(), v());
});
function kt(e) {
  return _(e) && h(e, `~immutable`);
}
var At = e(() => {
  (m(), v(), me());
});
function jt(e) {
  return _(e) && h(e, `~readonly`);
}
var Mt = e(() => {
    (m(), v(), ne());
  }),
  Nt = e(() => {
    o();
  });
function Pt(e) {
  return a({ "~kind": `BigInt` }, { type: `bigint` }, e);
}
function Ft(e) {
  return g(e, `BigInt`);
}
var It,
  Lt = e(() => {
    (o(), v(), (It = `-?(?:0|[1-9][0-9]*)n`));
  });
function Rt(e) {
  return a({ "~kind": `Boolean` }, { type: `boolean` }, e);
}
function zt(e) {
  return g(e, `Boolean`);
}
var Bt = e(() => {
    (o(), v());
  }),
  Vt = e(() => {
    o();
  });
function w(e) {
  return a({ "~kind": `Integer` }, { type: `integer` }, e);
}
function Ht(e) {
  return g(e, `Integer`);
}
var T,
  Ut = e(() => {
    (o(), v(), (T = `-?(?:0|[1-9][0-9]*)`));
  });
function Wt(e) {
  return p(e)
    ? `bigint`
    : we(e)
      ? `boolean`
      : l(e)
        ? `number`
        : c(e)
          ? `string`
          : (() => {
              throw new Zt(e);
            })();
}
function Gt(e, t) {
  return a({ "~kind": `Literal` }, { type: Wt(e), const: e }, t);
}
function Kt(e) {
  return p(e) || we(e) || l(e) || c(e);
}
function qt(e) {
  return E(e) && p(e.const);
}
function Jt(e) {
  return E(e) && we(e.const);
}
function Yt(e) {
  return E(e) && l(e.const);
}
function Xt(e) {
  return E(e) && c(e.const);
}
function E(e) {
  return g(e, `Literal`);
}
var Zt,
  Qt = e(() => {
    (o(),
      m(),
      v(),
      (Zt = class extends Error {
        constructor(e) {
          (super(`Invalid Literal value`),
            Object.defineProperty(this, "cause", {
              value: { value: e },
              writable: !1,
              configurable: !1,
              enumerable: !1,
            }));
        }
      }));
  });
function $t(e) {
  return a({ "~kind": `Null` }, { type: `null` }, e);
}
function en(e) {
  return g(e, `Null`);
}
var tn = e(() => {
  (o(), v());
});
function D(e) {
  return a({ "~kind": `Number` }, { type: `number` }, e);
}
function nn(e) {
  return g(e, `Number`);
}
var O,
  k = e(() => {
    (o(), v(), (O = `-?(?:0|[1-9][0-9]*)(?:\\.[0-9]+)?`));
  });
function rn(e) {
  return a({ "~kind": `Symbol` }, { type: `symbol` }, e);
}
function an(e) {
  return g(e, `Symbol`);
}
var A = e(() => {
    (o(), v());
  }),
  on = e(() => {
    (o(), C());
  });
function j(e) {
  return a({ "~kind": `String` }, { type: `string` }, e);
}
function sn(e) {
  return g(e, `String`);
}
var M = e(() => {
  (o(), v());
});
function cn(e, t = {}) {
  return a({ "~kind": `Union` }, { anyOf: e }, t);
}
function ln(e) {
  return g(e, `Union`);
}
function un(e) {
  return s(e, [`~kind`, `anyOf`]);
}
var dn = e(() => {
  (o(), v());
});
function fn(e, t = {}) {
  let [n, r, i] = [e, e.length, !1];
  return a({ "~kind": `Tuple` }, { type: `array`, additionalItems: i, items: n, minItems: r }, t);
}
function pn(e) {
  return g(e, `Tuple`);
}
function mn(e) {
  return s(e, [`~kind`, `type`, `items`, `minItems`, `additionalItems`]);
}
var hn = e(() => {
  (o(), v());
});
function gn(e, t, n = {}) {
  return y(`Record`, [e, t], n);
}
function _n(e, t, n = {}) {
  return ve(e, t, n);
}
function vn(e, t) {
  return se(e, t);
}
function yn(e) {
  return d(e, I) ? j() : d(e, P) ? w() : d(e, F) ? D() : ce(e);
}
function N(e) {
  return f(e.patternProperties)[0];
}
function bn(e) {
  return yn(N(e));
}
function xn(e) {
  return e.patternProperties[N(e)];
}
function Sn(e) {
  return g(e, `Record`);
}
var P,
  F,
  I,
  Cn = e(() => {
    (o(),
      m(),
      v(),
      Ut(),
      k(),
      M(),
      b(),
      i(),
      ee(),
      n(),
      (P = `^${T}$`),
      (F = `^${O}$`),
      (I = `^.*$`));
  });
function wn(e) {
  return a({ "~kind": `Rest` }, { type: `rest`, items: e }, {});
}
function Tn(e) {
  return g(e, `Rest`);
}
var En = e(() => {
    (o(), v());
  }),
  Dn = e(() => {});
function On(e) {
  return g(e, `This`);
}
var kn = e(() => {
  (o(), v());
});
function An(e) {
  return a({ "~kind": `Undefined` }, { type: `undefined` }, e);
}
function jn(e) {
  return g(e, `Undefined`);
}
var Mn = e(() => {
  (o(), v());
});
function Nn(e) {
  return g(e, `Void`);
}
var Pn = e(() => {
    (o(), v());
  }),
  L = e(() => {
    (Ot(),
      At(),
      x(),
      Mt(),
      Nt(),
      Ke(),
      ke(),
      Lt(),
      Bt(),
      zr(),
      Ne(),
      ut(),
      b(),
      St(),
      Le(),
      Ue(),
      Vt(),
      yt(),
      ht(),
      Ut(),
      Et(),
      Qt(),
      Xe(),
      tn(),
      k(),
      C(),
      A(),
      at(),
      on(),
      S(),
      Cn(),
      Be(),
      En(),
      v(),
      Dn(),
      M(),
      A(),
      Ir(),
      kn(),
      hn(),
      Mn(),
      dn(),
      C(),
      pt(),
      Pn());
  });
function Fn(e) {
  return Pt();
}
function In(e) {
  return j();
}
function Ln(e) {
  return D();
}
function Rn(e) {
  return w();
}
function zn(e) {
  return qe();
}
function Bn(e) {
  return Gt(e);
}
function Vn(e) {
  return e;
}
function Hn(e) {
  return cn(e[1]);
}
function Un(e) {
  return e.length === 3 ? [...e[0], ...e[2]] : e.length === 1 ? [...e[0]] : [];
}
function Wn(e) {
  return [e[0], ...e[1]];
}
function Gn(e) {
  return e;
}
function Kn(e) {
  return e[1];
}
var qn = e(() => {
    (o(), L(), fe());
  }),
  R = e(() => {
    xe();
  });
function Jn(e) {
  return d(e.length, 2);
}
function Yn(e, t, n) {
  return Jn(e) ? t(e[0], e[1]) : n();
}
var z = e(() => {
  R();
});
function Xn(e, t) {
  return d(t.indexOf(e), 0) ? [e, t.slice(e.length)] : [];
}
function Zn(e, t) {
  for (let n = 0; n < e.length; n++) {
    let r = Xn(e[n], t);
    if (Jn(r)) return r;
  }
  return [];
}
var Qn = e(() => {
  (z(), R());
});
function B(e, t) {
  return Array.from({ length: t - e + 1 }, (t, n) => String.fromCharCode(e + n));
}
var $n,
  er,
  V,
  H = e(() => {
    (($n = [...B(97, 122), ...B(65, 90)]), (er = B(49, 57)), (V = [`0`, ...er]));
  });
function tr(e) {
  let t = e.indexOf(ir);
  return d(t, -1) ? `` : e.slice(t + 2);
}
function nr(e) {
  let t = e.indexOf(`
`);
  return d(t, -1) ? `` : e.slice(t);
}
function rr(e) {
  return e.replace(/^[ \t\r\f\v]+/, ``);
}
function U(e) {
  let t = rr(e);
  return t.startsWith(K) ? U(tr(t.slice(2))) : t.startsWith(G) ? U(nr(t.slice(2))) : t;
}
function W(e) {
  let t = e.trimStart();
  return t.startsWith(K) ? W(tr(t.slice(2))) : t.startsWith(G) ? W(nr(t.slice(2))) : t;
}
var G,
  K,
  ir,
  q = e(() => {
    (R(), H(), (G = `//`), (K = `/*`), (ir = `*/`));
  }),
  J = e(() => {
    (q(), H(), [...V]);
  }),
  ar = e(() => {
    (q(), H(), J());
  }),
  or = e(() => {
    ar();
  });
function Y(e, t) {
  return Zn([e], t);
}
function X(e, t) {
  return d(e, ``)
    ? [``, t]
    : e.startsWith(`
`)
      ? Y(e, U(t))
      : e.startsWith(` `)
        ? Y(e, t)
        : Y(e, W(t));
}
var sr = e(() => {
    (R(), q(), Qn(), H());
  }),
  cr,
  lr = e(() => {
    (q(), H(), (cr = [...$n, `_`, `$`]), [...cr, ...V]);
  }),
  ur = e(() => {
    (q(), H(), J(), [...V]);
  }),
  dr = e(() => {
    (q(), H(), ur());
  }),
  fr = e(() => {});
function pr(e) {
  return d(e, ``) ? [] : [e.slice(0, 1), e.slice(1)];
}
function mr(e, t) {
  return be(
    e,
    (e, n) => (t.startsWith(e) ? !0 : mr(n, t)),
    () => !1,
  );
}
function hr(e, t, n = ``) {
  return Yn(
    pr(t),
    (r, i) => (mr(e, t) ? [n, t] : hr(e, i, `${n}${r}`)),
    () => [],
  );
}
var gr = e(() => {
    (z(), R());
  }),
  _r = e(() => {
    (q(), H());
  }),
  vr = e(() => {
    (q(), _r());
  });
function yr(e, t) {
  return Yn(
    hr(e, t),
    (e, t) => (d(e, ``) ? [] : [e, t]),
    () => [],
  );
}
var br = e(() => {
    (R(), z(), gr());
  }),
  xr = e(() => {
    (or(), sr(), lr(), ar(), dr(), fr(), _r(), vr(), J(), ur(), br(), gr());
  }),
  Z,
  Sr,
  Cr,
  wr,
  Tr,
  Er,
  Dr,
  Or,
  kr,
  Ar,
  Q,
  $,
  jr,
  Mr = e(() => {
    (qn(),
      xr(),
      (Z = (e, t, n = () => []) => (e.length === 2 ? t(e) : n())),
      (Sr = (e) => Z(X(`-?(?:0|[1-9][0-9]*)n`, e), ([e, t]) => [Fn(e), t])),
      (Cr = (e) => Z(X(`.*`, e), ([e, t]) => [In(e), t])),
      (wr = (e) => Z(X(`-?(?:0|[1-9][0-9]*)(?:\\.[0-9]+)?`, e), ([e, t]) => [Ln(e), t])),
      (Tr = (e) => Z(X(`-?(?:0|[1-9][0-9]*)`, e), ([e, t]) => [Rn(e), t])),
      (Er = (e) => Z(X(`(?!)`, e), ([e, t]) => [zn(e), t])),
      (Dr = (e) =>
        Z(
          yr(
            [
              `-?(?:0|[1-9][0-9]*)n`,
              `.*`,
              `-?(?:0|[1-9][0-9]*)(?:\\.[0-9]+)?`,
              `-?(?:0|[1-9][0-9]*)`,
              `(?!)`,
              `(`,
              `)`,
              `$`,
              `|`,
            ],
            e,
          ),
          ([e, t]) => [Bn(e), t],
        )),
      (Or = (e) =>
        Z(
          Z(
            Sr(e),
            ([e, t]) => [e, t],
            () =>
              Z(
                Cr(e),
                ([e, t]) => [e, t],
                () =>
                  Z(
                    wr(e),
                    ([e, t]) => [e, t],
                    () =>
                      Z(
                        Tr(e),
                        ([e, t]) => [e, t],
                        () =>
                          Z(
                            Er(e),
                            ([e, t]) => [e, t],
                            () =>
                              Z(
                                kr(e),
                                ([e, t]) => [e, t],
                                () =>
                                  Z(
                                    Dr(e),
                                    ([e, t]) => [e, t],
                                    () => [],
                                  ),
                              ),
                          ),
                      ),
                  ),
              ),
          ),
          ([e, t]) => [Vn(e), t],
        )),
      (kr = (e) =>
        Z(
          Z(X(`(`, e), ([e, t]) => Z($(t), ([t, n]) => Z(X(`)`, n), ([n, r]) => [[e, t, n], r]))),
          ([e, t]) => [Hn(e), t],
        )),
      (Ar = (e) =>
        Z(
          Z(
            Z(Q(e), ([e, t]) => Z(X(`|`, t), ([t, n]) => Z(Ar(n), ([n, r]) => [[e, t, n], r]))),
            ([e, t]) => [e, t],
            () =>
              Z(
                Z(Q(e), ([e, t]) => [[e], t]),
                ([e, t]) => [e, t],
                () =>
                  Z(
                    [[], e],
                    ([e, t]) => [e, t],
                    () => [],
                  ),
              ),
          ),
          ([e, t]) => [Un(e), t],
        )),
      (Q = (e) =>
        Z(
          Z(Or(e), ([e, t]) => Z($(t), ([t, n]) => [[e, t], n])),
          ([e, t]) => [Wn(e), t],
        )),
      ($ = (e) =>
        Z(
          Z(
            Ar(e),
            ([e, t]) => [e, t],
            () =>
              Z(
                Q(e),
                ([e, t]) => [e, t],
                () => [],
              ),
          ),
          ([e, t]) => [Gn(e), t],
        )),
      (jr = (e) =>
        Z(
          Z(X(`^`, e), ([e, t]) => Z($(t), ([t, n]) => Z(X(`$`, n), ([n, r]) => [[e, t, n], r]))),
          ([e, t]) => [Kn(e), t],
        )));
  });
function Nr(e, t = {}) {
  return y(`TemplateLiteral`, [e], t);
}
function Pr(e) {
  return _(e) && h(e, `action`) && d(e.action, `TemplateLiteral`);
}
function Fr(e) {
  return g(e, `TemplateLiteral`);
}
var Ir = e(() => {
  (t(), m(), v(), b(), oe(), re());
});
function Lr(e, t) {
  return a({ "~kind": `Call` }, { type: `call`, target: e, arguments: t }, {});
}
function Rr(e) {
  return g(e, `Call`);
}
var zr = e(() => {
    (o(), v(), ie(), pe());
  }),
  Br = e(() => {
    (o(), L(), pe(), Mr());
  }),
  Vr = e(() => {
    Br();
  }),
  Hr = e(() => {
    (fe(), ge(), r(), Vr(), L());
  });
export {
  k as $,
  nt as $t,
  N as A,
  Ee as An,
  Tt as At,
  cn as B,
  mt as Bt,
  P as C,
  Le as Cn,
  jt as Ct,
  gn as D,
  Ne as Dn,
  Dt,
  _n as E,
  je as En,
  At as Et,
  pn as F,
  _ as Fn,
  St as Ft,
  M as G,
  ct as Gt,
  dn as H,
  ft as Ht,
  fn as I,
  v as In,
  gt as It,
  rn as J,
  st as Jt,
  on as K,
  lt as Kt,
  mn as L,
  vt as Lt,
  xn as M,
  y as Mn,
  Et as Mt,
  I as N,
  Te as Nn,
  bt as Nt,
  vn as O,
  Oe as On,
  Ot,
  Cn as P,
  b as Pn,
  xt as Pt,
  O as Q,
  it as Qt,
  hn as R,
  _t as Rt,
  En as S,
  Pe as Sn,
  Nt as St,
  F as T,
  Me as Tn,
  kt as Tt,
  sn as U,
  dt as Ut,
  un as V,
  ht as Vt,
  j as W,
  pt as Wt,
  nn as X,
  C as Xt,
  A as Y,
  ot as Yt,
  D as Z,
  rt as Zt,
  Mn as _,
  ze as _n,
  zt as _t,
  zr as a,
  Ze as an,
  Jt as at,
  Tn as b,
  Ie as bn,
  Ft as bt,
  Nr as c,
  qe as cn,
  Kt as ct,
  Mr as d,
  We as dn,
  w as dt,
  at as en,
  en as et,
  L as f,
  Ge as fn,
  T as ft,
  An as g,
  Ue as gn,
  Rt as gt,
  jn as h,
  He as hn,
  Vt as ht,
  Rr as i,
  Qe as in,
  qt as it,
  yn as j,
  ke as jn,
  wt as jt,
  bn as k,
  De as kn,
  Ct as kt,
  Ir as l,
  Ye as ln,
  Gt as lt,
  Pn as m,
  Ve as mn,
  Ut as mt,
  Vr as n,
  tt as nn,
  tn as nt,
  Fr as o,
  x as on,
  Yt as ot,
  Nn as p,
  Ke as pn,
  Ht as pt,
  an as q,
  ut as qt,
  Lr as r,
  S as rn,
  E as rt,
  Pr as s,
  Je as sn,
  Xt as st,
  Hr as t,
  et as tn,
  $t as tt,
  jr as u,
  Xe as un,
  Qt as ut,
  On as v,
  Re as vn,
  Bt as vt,
  Sn as w,
  Ae as wn,
  Mt as wt,
  wn as x,
  Fe as xn,
  Lt as xt,
  kn as y,
  Be as yn,
  It as yt,
  ln as z,
  yt as zt,
};
//# sourceMappingURL=control-ui-foundation-BSyioE0Z.js.map
