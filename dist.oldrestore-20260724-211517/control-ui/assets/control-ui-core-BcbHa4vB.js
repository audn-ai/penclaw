import { A as Ve, j as He } from "./config-runtime-BxOat2Bj.js";
import {
  B as Me,
  M as Ne,
  P as Pe,
  R as Fe,
  ft as Ie,
  gt as Le,
  ht as Re,
  mt as ze,
  pt as Be,
} from "./control-ui-core--EZfp09c.js";
import { H as Ke, V as qe } from "./control-ui-core-CQDTaMS5.js";
import { n as Ue, o as E, r as We, t as Ge } from "./control-ui-core-CwQmiouz.js";
import { lt as l } from "./control-ui-foundation-0uuDj0X3.js";
import {
  C as t,
  S as n,
  b as r,
  c as i,
  f as a,
  h as o,
  l as s,
  x as c,
} from "./control-ui-foundation-CCDffryi.js";
import {
  $ as p,
  A as m,
  C as h,
  D as g,
  Dt as _,
  E as ee,
  I as te,
  L as v,
  Nt as ne,
  P as y,
  Q as re,
  S as ie,
  T as ae,
  X as b,
  a as x,
  at as S,
  b as C,
  c as oe,
  d as se,
  et as ce,
  f as le,
  g as ue,
  h as de,
  i as fe,
  jt as pe,
  l as me,
  m as w,
  nt as he,
  o as ge,
  ot as _e,
  p as ve,
  q as ye,
  r as be,
  s as xe,
  tt as T,
  u as Se,
  w as Ce,
  x as we,
  z as Te,
} from "./control-ui-foundation-s2wA1PVE.js";
import { d as Je, f as Ye, s as Xe, u as Ze } from "./control-ui-shared-CrnVqnQR.js";
import {
  a as Ee,
  i as De,
  n as Oe,
  o as ke,
  r as Ae,
  s as je,
} from "./gateway-runtime-D6zABMsO.js";
import { at as u, et as d, nt as f } from "./lit-runtime-DkvDG939.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
var D = e(() => {
  (re(), ye());
});
function Qe(e) {
  return !!e && typeof e.getItem == `function` && typeof e.setItem == `function`;
}
function $e(e) {
  let t = Object.getOwnPropertyDescriptor(globalThis, e);
  if (typeof process < `u` && {}.VITEST) return t && !t.get && Qe(t.value) ? t.value : null;
  if (typeof window < `u` && typeof document < `u`)
    try {
      let t = window[e];
      return Qe(t) ? t : null;
    } catch {
      return null;
    }
  return t && !t.get && Qe(t.value) ? t.value : null;
}
function et() {
  return $e(`localStorage`);
}
function tt() {
  return $e(`sessionStorage`);
}
var nt = e(() => {});
function rt(e) {
  return structuredClone(e);
}
function it(e) {
  return `${JSON.stringify(e, null, 2).trimEnd()}\n`;
}
function at(e) {
  return { omitted: !1, value: e };
}
function ot(e, t) {
  return e != null && Object.hasOwn(e, t);
}
function st(e) {
  if (e.value === pt)
    return e.originalFormValue !== pt || e.originalRawPathExists
      ? at(e.value)
      : e.canOmit
        ? mt
        : at(e.value);
  if (Array.isArray(e.value)) {
    let t = Array.isArray(e.originalFormValue) ? e.originalFormValue : [],
      n = Array.isArray(e.originalRawValue) ? e.originalRawValue : [];
    return at(
      e.value.map((e, r) => {
        let i = st({
          value: e,
          originalFormValue: t[r],
          originalRawValue: n[r],
          originalRawPathExists: r in n,
          canOmit: !1,
        });
        return i.omitted ? e : i.value;
      }),
    );
  }
  if (!_e(e.value)) return at(e.value);
  let t = _e(e.originalFormValue) ? e.originalFormValue : null,
    n = _e(e.originalRawValue) ? e.originalRawValue : null,
    r = {};
  for (let [i, a] of Object.entries(e.value)) {
    let e = t != null && Object.hasOwn(t, i) ? t[i] : void 0,
      o = ot(n, i),
      s = st({
        value: a,
        originalFormValue: e,
        originalRawValue: o ? n?.[i] : void 0,
        originalRawPathExists: o,
        canOmit: !0,
      });
    s.omitted || (r[i] = s.value);
  }
  return e.canOmit && Object.keys(r).length === 0 && !e.originalRawPathExists ? mt : at(r);
}
function ct(e, t, n) {
  if (!t || !n) return e;
  let r;
  try {
    r = He.parse(n);
  } catch {
    return e;
  }
  if (!_e(r)) return e;
  let i = st({
    value: e,
    originalFormValue: t,
    originalRawValue: r,
    originalRawPathExists: !0,
    canOmit: !1,
  });
  return !i.omitted && _e(i.value) ? i.value : e;
}
function lt(e) {
  return typeof e == `string` && ht.has(e);
}
function ut(e, t, n) {
  if (t.length === 0 || t.some(lt)) return null;
  let r = e;
  for (let e = 0; e < t.length - 1; e += 1) {
    let i = t[e],
      a = t[e + 1];
    if (i === void 0) return null;
    if (typeof i == `number`) {
      if (!Array.isArray(r)) return null;
      if (r[i] == null) {
        if (!n) return null;
        r[i] = typeof a == `number` ? [] : {};
      }
      r = r[i];
      continue;
    }
    if (typeof r != `object` || !r) return null;
    let o = r;
    if (o[i] == null) {
      if (!n) return null;
      o[i] = typeof a == `number` ? [] : {};
    }
    r = o[i];
  }
  let i = t.at(-1);
  return i === void 0 ? null : { current: r, lastKey: i };
}
function dt(e, t, n) {
  let r = ut(e, t, !0);
  if (r) {
    if (typeof r.lastKey == `number`) {
      Array.isArray(r.current) && (r.current[r.lastKey] = n);
      return;
    }
    typeof r.current == `object` && r.current != null && (r.current[r.lastKey] = n);
  }
}
function ft(e, t) {
  let n = ut(e, t, !1);
  if (n) {
    if (typeof n.lastKey == `number`) {
      Array.isArray(n.current) && n.current.splice(n.lastKey, 1);
      return;
    }
    typeof n.current == `object` && n.current != null && delete n.current[n.lastKey];
  }
}
var pt,
  mt,
  ht,
  gt = e(() => {
    (S(),
      Ve(),
      (pt = `__OPENCLAW_REDACTED__`),
      (mt = { omitted: !0 }),
      (ht = new Set([`__proto__`, `prototype`, `constructor`])));
  });
function _t(e = {}) {
  return {
    client: e.client ?? null,
    connected: e.connected ?? !1,
    requestGeneration: 0,
    nodesLoading: !1,
    nodes: [],
    lastError: null,
    devicesLoading: !1,
    devicesError: null,
    devicesList: null,
    execApprovalsLoading: !1,
    execApprovalsSaving: !1,
    execApprovalsDirty: !1,
    execApprovalsSnapshot: null,
    execApprovalsForm: null,
    execApprovalsSelectedAgent: null,
  };
}
function O(e, t, n) {
  return e.connected && e.client === t && e.requestGeneration === n;
}
async function vt(e, t) {
  let n = e.client;
  if (!n || !e.connected || e.nodesLoading) return;
  ((e.nodesLoading = !0), t?.quiet || ((e.lastError = null), (e.chatError = null)));
  let r = e.requestGeneration;
  try {
    let t = await n.request(`node.list`, {});
    O(e, n, r) && (e.nodes = Array.isArray(t.nodes) ? t.nodes : []);
  } catch (i) {
    !t?.quiet && O(e, n, r) && (e.lastError = String(i));
  } finally {
    O(e, n, r) && (e.nodesLoading = !1);
  }
}
async function yt(e, t) {
  let n = e.client;
  if (!n || !e.connected || e.devicesLoading) return;
  ((e.devicesLoading = !0), t?.quiet || (e.devicesError = null));
  let r = e.requestGeneration;
  try {
    let t = await n.request(`device.pair.list`, {});
    O(e, n, r) &&
      (e.devicesList = {
        pending: Array.isArray(t?.pending) ? t.pending : [],
        paired: Array.isArray(t?.paired) ? t.paired : [],
      });
  } catch (i) {
    !t?.quiet && O(e, n, r) && (e.devicesError = String(i));
  } finally {
    O(e, n, r) && (e.devicesLoading = !1);
  }
}
async function bt(e, t) {
  let n = e.client;
  if (!n || !e.connected) return;
  let r = e.requestGeneration;
  try {
    (await n.request(`device.pair.approve`, { requestId: t }), O(e, n, r) && (await yt(e)));
  } catch (t) {
    O(e, n, r) && (e.devicesError = String(t));
  }
}
async function xt(e, t) {
  let n = e.client;
  if (!n || !e.connected || !window.confirm(`Reject this device pairing request?`)) return;
  let r = e.requestGeneration;
  try {
    (await n.request(`device.pair.reject`, { requestId: t }), O(e, n, r) && (await yt(e)));
  } catch (t) {
    O(e, n, r) && (e.devicesError = String(t));
  }
}
async function St(e, t) {
  (t.removeNode && (await e.request(`node.pair.remove`, { nodeId: t.id })),
    t.removeDevice && (await e.request(`device.pair.remove`, { deviceId: t.id })));
}
async function Ct(e, t) {
  let n = t?.error !== void 0;
  (await Promise.all([yt(e, { quiet: n }), vt(e, { quiet: n })]),
    t?.error !== void 0 && (e.devicesError = t.error));
}
async function wt(e, t) {
  let n = e.client;
  if (!(!n || !e.connected))
    try {
      (await St(n, t), await Ct(e));
    } catch (t) {
      await Ct(e, { error: String(t) });
    }
}
async function Tt(e, t) {
  let n = e.client;
  if (!n || !e.connected || t.length === 0) return;
  let r = [];
  for (let e of t)
    try {
      await St(n, e);
    } catch (t) {
      r.push(`${e.name}: ${String(t)}`);
    }
  await Ct(
    e,
    r.length > 0
      ? { error: `Failed to remove ${r.length} entr${r.length === 1 ? `y` : `ies`}: ${r[0]}` }
      : void 0,
  );
}
async function Et(e, t) {
  if (!(!e.client || !e.connected))
    try {
      (await e.client.request(`node.pair.approve`, { requestId: t }), await Ct(e));
    } catch (t) {
      await Ct(e, { error: String(t) });
    }
}
async function Dt(e, t) {
  if (!(!e.client || !e.connected) && window.confirm(`Reject this node pairing request?`))
    try {
      (await e.client.request(`node.pair.reject`, { requestId: t }), await Ct(e));
    } catch (t) {
      await Ct(e, { error: String(t) });
    }
}
async function Ot(e, t) {
  let n = e.client;
  if (!n || !e.connected) return;
  let r = e.requestGeneration;
  try {
    let { gatewayUrl: i, ...a } = t,
      o = await n.request(`device.token.rotate`, a);
    if (!O(e, n, r)) return;
    if (o?.token) {
      let a = await Qt();
      if (!O(e, n, r)) return;
      let s = o.role ?? t.role;
      ((o.deviceId === a.deviceId || t.deviceId === a.deviceId) &&
        Wt({
          deviceId: a.deviceId,
          gatewayUrl: i,
          role: s,
          token: o.token,
          scopes: o.scopes ?? t.scopes ?? [],
        }),
        window.prompt(`New device token (copy and store securely):`, o.token));
    }
    O(e, n, r) && (await yt(e));
  } catch (t) {
    O(e, n, r) && (e.devicesError = String(t));
  }
}
async function kt(e, t) {
  let n = e.client;
  if (!n || !e.connected || !window.confirm(`Revoke token for ${t.deviceId} (${t.role})?`)) return;
  let r = e.requestGeneration;
  try {
    let { gatewayUrl: i, ...a } = t;
    if ((await n.request(`device.token.revoke`, a), !O(e, n, r))) return;
    let o = await Qt();
    if (!O(e, n, r)) return;
    (t.deviceId === o.deviceId && Gt({ deviceId: o.deviceId, gatewayUrl: i, role: t.role }),
      O(e, n, r) && (await yt(e)));
  } catch (t) {
    O(e, n, r) && (e.devicesError = String(t));
  }
}
function At(e) {
  if (!e || e.kind === `gateway`) return { method: `exec.approvals.get`, params: {} };
  let t = e.nodeId.trim();
  return t ? { method: `exec.approvals.node.get`, params: { nodeId: t } } : null;
}
function jt(e, t) {
  if (!e || e.kind === `gateway`) return { method: `exec.approvals.set`, params: t };
  let n = e.nodeId.trim();
  return n ? { method: `exec.approvals.node.set`, params: { ...t, nodeId: n } } : null;
}
async function Mt(e, t) {
  let n = e.client;
  if (!n || !e.connected || e.execApprovalsLoading) return;
  ((e.execApprovalsLoading = !0), (e.lastError = null), (e.chatError = null));
  let r = e.requestGeneration;
  try {
    let i = At(t);
    if (!i) {
      e.lastError = `Select a node before loading exec approvals.`;
      return;
    }
    let a = await n.request(i.method, i.params);
    O(e, n, r) && Nt(e, a);
  } catch (t) {
    O(e, n, r) && (e.lastError = String(t));
  } finally {
    O(e, n, r) && (e.execApprovalsLoading = !1);
  }
}
function Nt(e, t) {
  if (((e.execApprovalsSnapshot = t), Pt(t))) {
    ((e.execApprovalsForm = null), (e.execApprovalsDirty = !1));
    return;
  }
  e.execApprovalsDirty || (e.execApprovalsForm = rt(t.file));
}
function Pt(e) {
  return !!(e && `enabled` in e);
}
async function Ft(e, t) {
  let n = e.client;
  if (!n || !e.connected) return;
  ((e.execApprovalsSaving = !0), (e.lastError = null), (e.chatError = null));
  let r = e.requestGeneration;
  try {
    if (Pt(e.execApprovalsSnapshot)) {
      e.lastError = `Host-native node approvals are read-only here; use the companion app or approvals set --node.`;
      return;
    }
    let i = e.execApprovalsSnapshot?.hash;
    if (!i) {
      e.lastError = `Exec approvals hash missing; reload and retry.`;
      return;
    }
    let a = jt(t, {
      file: e.execApprovalsForm ?? e.execApprovalsSnapshot?.file ?? {},
      baseHash: i,
    });
    if (!a) {
      e.lastError = `Select a node before saving exec approvals.`;
      return;
    }
    if ((await n.request(a.method, a.params), !O(e, n, r))) return;
    ((e.execApprovalsDirty = !1), await Mt(e, t));
  } catch (t) {
    O(e, n, r) && (e.lastError = String(t));
  } finally {
    O(e, n, r) && (e.execApprovalsSaving = !1);
  }
}
function It(e, t, n) {
  if (Pt(e.execApprovalsSnapshot)) {
    e.lastError = `Host-native node approvals are read-only here.`;
    return;
  }
  let r = rt(e.execApprovalsForm ?? e.execApprovalsSnapshot?.file ?? {});
  (dt(r, t, n), (e.execApprovalsForm = r), (e.execApprovalsDirty = !0));
}
function Lt(e, t) {
  if (Pt(e.execApprovalsSnapshot)) {
    e.lastError = `Host-native node approvals are read-only here.`;
    return;
  }
  let n = rt(e.execApprovalsForm ?? e.execApprovalsSnapshot?.file ?? {});
  (ft(n, t), (e.execApprovalsForm = n), (e.execApprovalsDirty = !0));
}
function Rt(e) {
  return `${tn}${Le(e)}`;
}
function zt(e) {
  try {
    e?.removeItem(en);
  } catch {}
}
function Bt(e) {
  if (!e) return null;
  try {
    let t = JSON.parse(e);
    return !t ||
      t.version !== 1 ||
      !t.deviceId ||
      typeof t.deviceId != `string` ||
      !t.tokens ||
      typeof t.tokens != `object`
      ? null
      : t;
  } catch {
    return null;
  }
}
function Vt(e) {
  try {
    let t = et(),
      n = Rt(e),
      r = Bt(t?.getItem(n) ?? null);
    if (r) return (zt(t), r);
    let i = Bt(t?.getItem(en) ?? null);
    if (!i) return null;
    try {
      (t?.setItem(n, JSON.stringify(i)), zt(t));
    } catch {}
    return i;
  } catch {
    return null;
  }
}
function Ht(e, t) {
  try {
    let n = et();
    (n?.setItem(Rt(e), JSON.stringify(t)), zt(n));
  } catch {}
}
function Ut(e) {
  return n({
    adapter: { readStore: () => Vt(e.gatewayUrl), writeStore: (t) => Ht(e.gatewayUrl, t) },
    deviceId: e.deviceId,
    role: e.role,
  });
}
function Wt(e) {
  return t({
    adapter: { readStore: () => Vt(e.gatewayUrl), writeStore: (t) => Ht(e.gatewayUrl, t) },
    deviceId: e.deviceId,
    role: e.role,
    token: e.token,
    scopes: e.scopes,
  });
}
function Gt(e) {
  r({
    adapter: { readStore: () => Vt(e.gatewayUrl), writeStore: (t) => Ht(e.gatewayUrl, t) },
    deviceId: e.deviceId,
    role: e.role,
  });
}
function Kt(e) {
  let t = ``;
  for (let n of e) t += String.fromCharCode(n);
  return btoa(t).replaceAll(`+`, `-`).replaceAll(`/`, `_`).replace(/=+$/g, ``);
}
function qt(e) {
  let t = e.replaceAll(`-`, `+`).replaceAll(`_`, `/`),
    n = t + `=`.repeat((4 - (t.length % 4)) % 4),
    r = atob(n),
    i = new Uint8Array(r.length);
  for (let e = 0; e < r.length; e += 1) i[e] = r.charCodeAt(e);
  return i;
}
function Jt(e) {
  return Array.from(e)
    .map((e) => e.toString(16).padStart(2, `0`))
    .join(``);
}
async function Yt(e) {
  let t = await crypto.subtle.digest(`SHA-256`, e.slice().buffer);
  return Jt(new Uint8Array(t));
}
async function Xt() {
  let e = je.randomSecretKey(),
    t = await De(e);
  return { deviceId: await Yt(t), publicKey: Kt(t), privateKey: Kt(e) };
}
function Zt() {
  try {
    let e = et()?.getItem(nn);
    if (!e) return null;
    let t = JSON.parse(e);
    return t?.version === 1 && typeof t.deviceId == `string` && t.deviceId ? t.deviceId : null;
  } catch {
    return null;
  }
}
async function Qt() {
  let e = et();
  try {
    let t = e?.getItem(nn);
    if (t) {
      let n = JSON.parse(t);
      if (
        n?.version === 1 &&
        typeof n.deviceId == `string` &&
        typeof n.publicKey == `string` &&
        typeof n.privateKey == `string`
      ) {
        let t = await Yt(qt(n.publicKey));
        if (t !== n.deviceId) {
          let r = { ...n, deviceId: t };
          return (
            e?.setItem(nn, JSON.stringify(r)),
            { deviceId: t, publicKey: n.publicKey, privateKey: n.privateKey }
          );
        }
        return { deviceId: n.deviceId, publicKey: n.publicKey, privateKey: n.privateKey };
      }
    }
  } catch {}
  let t = await Xt(),
    n = {
      version: 1,
      deviceId: t.deviceId,
      publicKey: t.publicKey,
      privateKey: t.privateKey,
      createdAtMs: Date.now(),
    };
  return (e?.setItem(nn, JSON.stringify(n)), t);
}
async function $t(e, t) {
  let n = qt(e);
  return Kt(await ke(new TextEncoder().encode(t), n));
}
var en,
  tn,
  nn,
  rn = e(() => {
    (Ee(),
      c(),
      Re(),
      nt(),
      gt(),
      (en = `openclaw.device.auth.v1`),
      (tn = `${en}:`),
      (nn = `openclaw-device-identity-v1`));
  });
function an(e) {
  let t = e[6],
    n = e[8];
  if (t === void 0 || n === void 0) throw Error(`UUID byte buffer is shorter than 9 bytes`);
  ((e[6] = (t & 15) | 64), (e[8] = (n & 63) | 128));
  let r = ``;
  for (let t of e) r += t.toString(16).padStart(2, `0`);
  return `${r.slice(0, 8)}-${r.slice(8, 12)}-${r.slice(12, 16)}-${r.slice(16, 20)}-${r.slice(20)}`;
}
function on() {
  cn || ((cn = !0), console.warn(`[uuid] crypto API missing; refusing insecure UUID generation`));
}
function sn(e = globalThis.crypto) {
  if (e && typeof e.randomUUID == `function`) return e.randomUUID();
  if (e && typeof e.getRandomValues == `function`) {
    let t = new Uint8Array(16);
    return (e.getRandomValues(t), an(t));
  }
  throw (on(), Error(`Web Crypto is required for UUID generation`));
}
var cn,
  ln = e(() => {
    cn = !1;
  });
function un(e, t, n) {
  let r = t.replaceAll(`\\`, `/`);
  return `${e}://file${(r.startsWith(`/`) ? r : `/${r}`)
    .split(`/`)
    .map((e, t) => (t === 1 && /^[a-z]:$/i.test(e) ? e : encodeURIComponent(e)))
    .join(`/`)}${n ? `:${n}` : ``}`;
}
var dn,
  fn,
  pn = e(() => {
    ((dn = [`cursor`, `vscode`, `windsurf`, `zed`]),
      (fn = { cursor: `Cursor`, vscode: `VS Code`, windsurf: `Windsurf`, zed: `Zed` }));
  }),
  mn,
  hn,
  gn,
  _n = e(() => {
    (d(),
      We(),
      (mn = class extends l {
        constructor(...e) {
          (super(...e), (this.i18nController = new Ue(this)));
        }
      }),
      (hn = class extends mn {
        createRenderRoot() {
          return this;
        }
      }),
      (gn = class extends hn {
        connectedCallback() {
          (super.connectedCallback(), (this.style.display = `contents`));
        }
      }));
  });
function vn(e) {
  return e.state?.lastRunStatus ?? e.state?.lastStatus ?? `unknown`;
}
function yn(e) {
  return e.enabled && vn(e) === `error`;
}
var bn = e(() => {});
function xn(e, t = {}) {
  let n = t.fallback ?? ``;
  if (e == null) return n;
  if (typeof e == `string`) return e;
  if (typeof e == `number` || typeof e == `boolean` || typeof e == `bigint`) return String(e);
  if (typeof e == `symbol`) return e.description ? `Symbol(${e.description})` : `Symbol()`;
  try {
    let n = JSON.stringify(e, null, t.pretty ? 2 : void 0);
    if (n !== void 0) return n;
  } catch {}
  return e instanceof Error ? e.message || e.name : Object.prototype.toString.call(e);
}
function Sn(e) {
  Fn = e === `12` || e === `24` ? e : `auto`;
}
function Cn() {
  return Fn === `12` ? { hour12: !0 } : Fn === `24` ? { hour12: !1 } : {};
}
function wn(e) {
  let t = v(e);
  return t === void 0 ? E(`common.na`) : new Date(t).toLocaleString([], Cn());
}
function Tn(e, t, n = E(`common.na`)) {
  let r = v(e);
  return r === void 0 ? n : new Date(r).toLocaleDateString([], t);
}
function En(e, t, n = E(`common.na`)) {
  let r = v(e);
  return r === void 0 ? n : new Date(r).toLocaleTimeString([], { ...Cn(), ...t });
}
function Dn(e, t, n = E(`common.na`)) {
  let r = v(e);
  return r === void 0 ? n : new Date(r).toLocaleString([], { ...Cn(), ...t });
}
function On(e) {
  return !e || e.length === 0 ? `none` : e.filter((e) => !!(e && e.trim())).join(`, `);
}
function kn(e, t = 120) {
  return e.length <= t ? e : `${te(e, Math.max(0, t - 1))}…`;
}
function An(e, t) {
  return e.length <= t
    ? { text: e, truncated: !1, total: e.length }
    : { text: te(e, Math.max(0, t)), truncated: !0, total: e.length };
}
function k(e, t) {
  let n = Number(e);
  return Number.isFinite(n) ? n : t;
}
function jn(e, t = `$0.00`) {
  return e == null || !Number.isFinite(e)
    ? t
    : e === 0
      ? `$0.00`
      : e < 0.01
        ? `$${e.toFixed(4)}`
        : e < 1
          ? `$${e.toFixed(3)}`
          : `$${e.toFixed(2)}`;
}
function Mn(e, t = `0`) {
  if (e == null || !Number.isFinite(e)) return t;
  if (e < 1e3) return String(Math.round(e));
  if (e < 1e6) {
    let t = e / 1e3;
    if (t < 10) return `${t.toFixed(1)}k`;
    let n = Math.round(t);
    if (n < 1e3) return `${n}k`;
  }
  let n = e / 1e6;
  return n < 10 ? `${n.toFixed(1)}M` : `${Math.round(n)}M`;
}
function Nn(e, t = {}) {
  let n = t.thousandsSuffix ?? `k`,
    r = t.millionsSuffix ?? `M`,
    i = t.trimTrailingZero ?? !0,
    a = (e) => (i ? e.replace(/\.0$/, ``) : e);
  if (e >= 1e6) return `${a((e / 1e6).toFixed(1))}${r}`;
  if (e >= 1e3) {
    let t = (e / 1e3).toFixed(1);
    return Number(t) >= 1e3 ? `${a((e / 1e6).toFixed(1))}${r}` : `${a(t)}${n}`;
  }
  return String(e);
}
function Pn(e) {
  if (!e.startsWith(`agent:`)) return null;
  let t = e.slice(6),
    n = t.indexOf(`:`);
  if (n < 1) return null;
  let r = t.slice(0, n),
    i = t.slice(n + 1),
    a = i.indexOf(`:`);
  if (a < 1) return null;
  let o = i.slice(0, a),
    s = i.slice(a + 1);
  return s ? { agentId: r, channel: o, accountId: s } : null;
}
var Fn,
  In = e(() => {
    (Te(), y(), o(), a(), Ge(), g(), (Fn = `auto`));
  });
function Ln(e) {
  return e instanceof Ie
    ? ze(e) === _.AUTH_UNAUTHORIZED || e.message.includes(`missing scope: operator.read`)
    : !1;
}
function Rn(e) {
  return `This connection is missing operator.read, so ${e} cannot be loaded yet.`;
}
var zn = e(() => {
  (pe(), Be());
});
async function Bn(e) {
  if (!(!e.client || !e.connected))
    try {
      let t = await e.client.request(`cron.list`, {
        ...(e.cronAgentId ? { agentId: e.cronAgentId } : {}),
        enabled: `enabled`,
        lastRunStatus: `error`,
        limit: 1,
        offset: 0,
      });
      e.cronFailingCount = typeof t?.total == `number` ? t.total : null;
    } catch {
      e.cronFailingCount = null;
    }
}
async function Vn(e) {
  if (!e.client || !e.connected || !e.cronAgentId) {
    ((e.cronScopedTotal = null), (e.cronScopedNextWakeAtMs = null));
    return;
  }
  try {
    let [t, n] = await Promise.all([
      e.client.request(`cron.list`, {
        agentId: e.cronAgentId,
        includeDisabled: !0,
        limit: 1,
        offset: 0,
      }),
      e.client.request(`cron.list`, {
        agentId: e.cronAgentId,
        enabled: `enabled`,
        limit: 1,
        offset: 0,
        sortBy: `nextRunAtMs`,
        sortDir: `asc`,
      }),
    ]);
    e.cronScopedTotal = typeof t.total == `number` ? t.total : null;
    let r = n.jobs[0]?.state?.nextRunAtMs;
    e.cronScopedNextWakeAtMs = typeof r == `number` && Number.isFinite(r) ? r : null;
  } catch {
    ((e.cronScopedTotal = null), (e.cronScopedNextWakeAtMs = null));
  }
}
var Hn = e(() => {});
function Un(e) {
  return !!(e && typeof e == `object`);
}
function Wn(e) {
  return Un(e)
    ? e.kind === `systemEvent`
      ? typeof e.text == `string`
      : e.kind === `agentTurn`
        ? typeof e.message == `string`
        : e.kind === `command`
          ? Array.isArray(e.argv) && e.argv.every((e) => typeof e == `string`)
          : !1
    : !1;
}
function Gn(e) {
  let t = e.payload;
  return Wn(t) ? t : null;
}
function Kn(e) {
  return Gn(e) !== null;
}
function qn(e = {}) {
  return {
    client: e.client ?? null,
    connected: e.connected ?? !1,
    cronLoading: !1,
    cronJobsLoadingMore: !1,
    cronJobsReloadPending: !1,
    cronJobsReloadPendingTableFilters: !1,
    cronJobs: [],
    cronJobsTotal: 0,
    cronJobsHasMore: !1,
    cronJobsNextOffset: null,
    cronJobsLimit: 50,
    cronJobsQuery: ``,
    cronJobsEnabledFilter: `all`,
    cronJobsScheduleKindFilter: `all`,
    cronJobsLastStatusFilter: `all`,
    cronJobsSortBy: `nextRunAtMs`,
    cronJobsSortDir: `asc`,
    cronAgentId: null,
    cronStatus: null,
    cronScopedTotal: null,
    cronScopedNextWakeAtMs: null,
    cronFailingCount: null,
    cronError: null,
    cronForm: { ...Ir },
    cronCreateOpen: !1,
    cronFieldErrors: {},
    cronEditingJobId: null,
    cronRunsJobId: null,
    cronRunsLoadingMore: !1,
    cronRuns: [],
    cronRunsTotal: 0,
    cronRunsHasMore: !1,
    cronRunsNextOffset: null,
    cronRunsLimit: 50,
    cronRunsScope: `all`,
    cronRunsStatuses: [],
    cronRunsDeliveryStatuses: [],
    cronRunsStatusFilter: `all`,
    cronRunsQuery: ``,
    cronRunsSortDir: `desc`,
    cronBusy: !1,
  };
}
function Jn(e) {
  return e.sessionTarget !== `main` && (e.payloadKind === `agentTurn` || e.payloadLocked);
}
function Yn(e) {
  return e.deliveryMode !== `announce` || Jn(e) ? e : { ...e, deliveryMode: `none` };
}
function Xn(e) {
  let t = {};
  if ((e.name.trim() || (t.name = `cron.errors.nameRequired`), e.scheduleKind === `at`)) {
    let n = Date.parse(e.scheduleAt);
    Number.isFinite(n) || (t.scheduleAt = `cron.errors.scheduleAtInvalid`);
  } else if (e.scheduleKind === `every`)
    k(e.everyAmount, 0) <= 0 && (t.everyAmount = `cron.errors.everyAmountInvalid`);
  else if (
    e.scheduleKind === `cron` &&
    (e.cronExpr.trim() || (t.cronExpr = `cron.errors.cronExprRequired`), !e.scheduleExact)
  ) {
    let n = e.staggerAmount.trim();
    n && k(n, 0) <= 0 && (t.staggerAmount = `cron.errors.staggerAmountInvalid`);
  }
  if (
    (!e.payloadLocked &&
      !e.payloadText.trim() &&
      (t.payloadText =
        e.payloadKind === `systemEvent`
          ? `cron.errors.systemTextRequired`
          : `cron.errors.agentMessageRequired`),
    !e.payloadLocked && e.payloadKind === `agentTurn`)
  ) {
    let n = e.timeoutSeconds.trim();
    n && k(n, 0) <= 0 && (t.timeoutSeconds = `cron.errors.timeoutInvalid`);
  }
  if (e.deliveryMode === `webhook`) {
    let n = e.deliveryTo.trim();
    n
      ? /^https?:\/\//i.test(n) || (t.deliveryTo = `cron.errors.webhookUrlInvalid`)
      : (t.deliveryTo = `cron.errors.webhookUrlRequired`);
  }
  if (e.failureAlertMode === `custom`) {
    let n = e.failureAlertAfter.trim();
    if (n) {
      let e = k(n, 0);
      (!Number.isFinite(e) || e <= 0) &&
        (t.failureAlertAfter = `Failure alert threshold must be greater than 0.`);
    }
    let r = e.failureAlertCooldownSeconds.trim();
    if (r) {
      let e = k(r, -1);
      (!Number.isFinite(e) || e < 0) &&
        (t.failureAlertCooldownSeconds = `Cooldown must be 0 or greater.`);
    }
  }
  return t;
}
function Zn(e) {
  return Object.keys(e).length > 0;
}
async function Qn(e) {
  if (!(!e.client || !e.connected))
    try {
      e.cronStatus = await e.client.request(`cron.status`, {});
    } catch (t) {
      Ln(t)
        ? ((e.cronStatus = null), (e.cronError = Rn(`cron status`)))
        : (e.cronError = String(t));
    }
}
async function $n(e) {
  if (!(!e.client || !e.connected))
    try {
      let t = (await e.client.request(`models.list`, { view: `configured` }))?.models;
      if (!Array.isArray(t)) {
        e.cronModelSuggestions = [];
        return;
      }
      e.cronModelSuggestions = b(
        t
          .map((e) => {
            if (!e || typeof e != `object`) return ``;
            let t = e.id;
            return typeof t == `string` ? t.trim() : ``;
          })
          .filter(Boolean),
      );
    } catch {
      e.cronModelSuggestions = [];
    }
}
function er(e, t) {
  if (typeof t != `string`) return;
  let n = t.trim();
  n && e.add(n);
}
function tr(e, t) {
  if (!t) return;
  if (typeof t == `string`) {
    er(e, t);
    return;
  }
  if (typeof t != `object`) return;
  let n = t;
  (er(e, n.primary), er(e, n.model), er(e, n.id), er(e, n.value));
  let r = Array.isArray(n.fallbacks) ? n.fallbacks : Array.isArray(n.fallback) ? n.fallback : [];
  for (let t of r) er(e, t);
}
function nr(e) {
  if (!e || typeof e != `object`) return [];
  let t = e.agents;
  if (!t || typeof t != `object`) return [];
  let n = new Set(),
    r = t.defaults;
  if (r && typeof r == `object`) {
    let e = r;
    tr(n, e.model);
    let t = e.models;
    if (t && typeof t == `object`) for (let e of Object.keys(t)) er(n, e);
  }
  let i = t.list;
  if (i && typeof i == `object`)
    for (let e of Object.values(i)) e && typeof e == `object` && tr(n, e.model);
  return b([...n]);
}
async function rr(e, t) {
  let n = e.client;
  if (!(!n || !e.connected || e.cronBusy)) {
    ((e.cronBusy = !0), (e.cronError = null));
    try {
      await t(n);
    } catch (t) {
      e.cronError = String(t);
    } finally {
      e.cronBusy = !1;
    }
  }
}
function ir(e) {
  let t =
      typeof e.totalRaw == `number` && Number.isFinite(e.totalRaw)
        ? Math.max(0, Math.floor(e.totalRaw))
        : e.pageCount,
    n =
      typeof e.offsetRaw == `number` && Number.isFinite(e.offsetRaw)
        ? Math.max(0, Math.floor(e.offsetRaw))
        : 0,
    r =
      typeof e.hasMoreRaw == `boolean`
        ? e.hasMoreRaw
        : n + e.pageCount < Math.max(t, n + e.pageCount);
  return {
    total: t,
    hasMore: r,
    nextOffset:
      typeof e.nextOffsetRaw == `number` && Number.isFinite(e.nextOffsetRaw)
        ? Math.max(0, Math.floor(e.nextOffsetRaw))
        : r
          ? n + e.pageCount
          : null,
  };
}
async function ar(e) {
  if (!e.cronJobsReloadPending) return;
  let t = e.cronJobsReloadPendingTableFilters;
  ((e.cronJobsReloadPending = !1),
    (e.cronJobsReloadPendingTableFilters = !1),
    await or(e, { tableFilters: t }));
}
async function or(e, t) {
  if (!e.client || !e.connected) return;
  let n = t?.append === !0;
  if (e.cronLoading || e.cronJobsLoadingMore) {
    n ||
      ((e.cronJobsReloadPending = !0),
      (e.cronJobsReloadPendingTableFilters = t?.tableFilters === !0));
    return;
  }
  if (!(n && !e.cronJobsHasMore)) {
    (n ? (e.cronJobsLoadingMore = !0) : (e.cronLoading = !0), (e.cronError = null));
    try {
      let r = n ? Math.max(0, e.cronJobsNextOffset ?? e.cronJobs.length) : 0,
        i = await e.client.request(`cron.list`, {
          ...(e.cronAgentId ? { agentId: e.cronAgentId } : {}),
          includeDisabled: e.cronJobsEnabledFilter === `all`,
          limit: e.cronJobsLimit,
          offset: r,
          query: e.cronJobsQuery.trim() || void 0,
          enabled: e.cronJobsEnabledFilter,
          ...(t?.tableFilters
            ? {
                scheduleKind: e.cronJobsScheduleKindFilter,
                lastRunStatus: e.cronJobsLastStatusFilter,
              }
            : {}),
          sortBy: e.cronJobsSortBy,
          sortDir: e.cronJobsSortDir,
        }),
        a = Array.isArray(i.jobs) ? i.jobs : [],
        o = a.filter(Kn);
      e.cronJobs = n ? [...e.cronJobs, ...o] : o;
      let s = ir({
        totalRaw: i.total,
        offsetRaw: i.offset,
        nextOffsetRaw: i.nextOffset,
        hasMoreRaw: i.hasMore,
        pageCount: a.length,
      });
      ((e.cronJobsTotal = Math.max(s.total, e.cronJobs.length)),
        (e.cronJobsHasMore = s.hasMore),
        (e.cronJobsNextOffset = s.nextOffset),
        e.cronEditingJobId && !e.cronJobs.some((t) => t.id === e.cronEditingJobId) && ur(e));
    } catch (t) {
      e.cronError = String(t);
    } finally {
      (n ? (e.cronJobsLoadingMore = !1) : (e.cronLoading = !1), await ar(e));
    }
  }
}
function sr(e, t) {
  (typeof t.cronJobsQuery == `string` && (e.cronJobsQuery = t.cronJobsQuery),
    (e.cronJobsEnabledFilter = t.cronJobsEnabledFilter ?? e.cronJobsEnabledFilter),
    (e.cronJobsScheduleKindFilter = t.cronJobsScheduleKindFilter ?? e.cronJobsScheduleKindFilter),
    (e.cronJobsLastStatusFilter = t.cronJobsLastStatusFilter ?? e.cronJobsLastStatusFilter),
    (e.cronJobsSortBy = t.cronJobsSortBy ?? e.cronJobsSortBy),
    (e.cronJobsSortDir = t.cronJobsSortDir ?? e.cronJobsSortDir));
}
function cr(e) {
  return e.cronJobs.filter((t) => {
    let n = lr(t);
    return !(
      !n ||
      (e.cronJobsScheduleKindFilter !== `all` && n !== e.cronJobsScheduleKindFilter) ||
      (e.cronJobsLastStatusFilter !== `all` && vn(t) !== e.cronJobsLastStatusFilter)
    );
  });
}
function lr(e) {
  let t = e.schedule?.kind;
  return t === `at` || t === `every` || t === `cron` || t === `on-exit` ? t : null;
}
function ur(e) {
  e.cronEditingJobId = null;
}
function dr(e) {
  ((e.cronRuns = []),
    (e.cronRunsTotal = 0),
    (e.cronRunsHasMore = !1),
    (e.cronRunsNextOffset = null));
}
function fr(e) {
  ((e.cronForm = { ...Ir }), (e.cronFieldErrors = {}));
}
function pr(e) {
  let t = Date.parse(e);
  if (!Number.isFinite(t)) return ``;
  let n = new Date(t);
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, `0`)}-${String(n.getDate()).padStart(2, `0`)}T${String(n.getHours()).padStart(2, `0`)}:${String(n.getMinutes()).padStart(2, `0`)}`;
}
function mr(e) {
  if (e % 864e5 == 0) return { everyAmount: String(Math.max(1, e / 864e5)), everyUnit: `days` };
  if (e % 36e5 == 0) return { everyAmount: String(Math.max(1, e / 36e5)), everyUnit: `hours` };
  let t = Math.max(1, Math.ceil(e / 6e4));
  return { everyAmount: String(t), everyUnit: `minutes` };
}
function hr(e) {
  return e === 0
    ? { scheduleExact: !0, staggerAmount: ``, staggerUnit: `seconds` }
    : typeof e != `number` || !Number.isFinite(e) || e < 0
      ? { scheduleExact: !1, staggerAmount: ``, staggerUnit: `seconds` }
      : e % 6e4 == 0
        ? { scheduleExact: !1, staggerAmount: String(Math.max(1, e / 6e4)), staggerUnit: `minutes` }
        : {
            scheduleExact: !1,
            staggerAmount: String(Math.max(1, Math.ceil(e / 1e3))),
            staggerUnit: `seconds`,
          };
}
function gr(e, t) {
  let n = e.failureAlert,
    r = Gn(e),
    i = r?.kind === `command`,
    a = {
      ...t,
      name: e.name,
      description: e.description ?? ``,
      agentId: e.agentId ?? ``,
      sessionKey: e.sessionKey ?? ``,
      clearAgent: !1,
      enabled: e.enabled,
      deleteAfterRun: e.deleteAfterRun ?? !1,
      scheduleKind: e.schedule.kind,
      scheduleAt: ``,
      everyAmount: t.everyAmount,
      everyUnit: t.everyUnit,
      cronExpr: t.cronExpr,
      cronTz: ``,
      scheduleExact: !1,
      staggerAmount: ``,
      staggerUnit: `seconds`,
      sessionTarget: e.sessionTarget,
      wakeMode: e.wakeMode,
      payloadKind: r?.kind === `systemEvent` || r?.kind === `agentTurn` ? r.kind : Ir.payloadKind,
      payloadLocked: i,
      payloadText:
        r?.kind === `systemEvent`
          ? r.text
          : r?.kind === `agentTurn`
            ? r.message
            : r?.kind === `command`
              ? r.argv.join(` `)
              : ``,
      payloadModel: r?.kind === `agentTurn` ? (r.model ?? ``) : ``,
      payloadThinking: r?.kind === `agentTurn` ? (r.thinking ?? ``) : ``,
      payloadLightContext: r?.kind === `agentTurn` ? r.lightContext === !0 : !1,
      deliveryMode: e.delivery?.mode ?? `none`,
      deliveryChannel: e.delivery?.channel ?? Fr,
      deliveryTo: e.delivery?.to ?? ``,
      deliveryAccountId: e.delivery?.accountId ?? ``,
      deliveryBestEffort: e.delivery?.bestEffort ?? !1,
      failureAlertMode: n === !1 ? `disabled` : n && typeof n == `object` ? `custom` : `inherit`,
      failureAlertAfter:
        n && typeof n == `object` && typeof n.after == `number`
          ? String(n.after)
          : Ir.failureAlertAfter,
      failureAlertCooldownSeconds:
        n && typeof n == `object` && typeof n.cooldownMs == `number`
          ? String(Math.floor(n.cooldownMs / 1e3))
          : Ir.failureAlertCooldownSeconds,
      failureAlertChannel: n && typeof n == `object` ? (n.channel ?? Fr) : Fr,
      failureAlertTo: n && typeof n == `object` ? (n.to ?? ``) : ``,
      failureAlertDeliveryMode: n && typeof n == `object` ? (n.mode ?? `announce`) : `announce`,
      failureAlertAccountId: n && typeof n == `object` ? (n.accountId ?? ``) : ``,
      timeoutSeconds:
        r?.kind === `agentTurn` && typeof r.timeoutSeconds == `number`
          ? String(r.timeoutSeconds)
          : ``,
    };
  if (e.schedule.kind === `at`) a.scheduleAt = pr(e.schedule.at);
  else if (e.schedule.kind === `every`) {
    let t = mr(e.schedule.everyMs);
    ((a.everyAmount = t.everyAmount), (a.everyUnit = t.everyUnit));
  } else if (e.schedule.kind === `cron`) {
    ((a.cronExpr = e.schedule.expr), (a.cronTz = e.schedule.tz ?? ``));
    let t = hr(e.schedule.staggerMs);
    ((a.scheduleExact = t.scheduleExact),
      (a.staggerAmount = t.staggerAmount),
      (a.staggerUnit = t.staggerUnit));
  }
  return Yn(a);
}
function _r(e) {
  if (e.scheduleKind === `at`) {
    let t = Date.parse(e.scheduleAt);
    if (!Number.isFinite(t)) throw Error(E(`cron.errors.invalidRunTime`));
    return { kind: `at`, at: new Date(t).toISOString() };
  }
  if (e.scheduleKind === `every`) {
    let t = k(e.everyAmount, 0);
    if (t <= 0) throw Error(E(`cron.errors.invalidIntervalAmount`));
    let n = e.everyUnit;
    return { kind: `every`, everyMs: t * (n === `minutes` ? 6e4 : n === `hours` ? 36e5 : 864e5) };
  }
  let t = e.cronExpr.trim();
  if (!t) throw Error(E(`cron.errors.cronExprRequiredShort`));
  if (e.scheduleExact)
    return { kind: `cron`, expr: t, tz: e.cronTz.trim() || void 0, staggerMs: 0 };
  let n = e.staggerAmount.trim();
  if (!n) return { kind: `cron`, expr: t, tz: e.cronTz.trim() || void 0 };
  let r = k(n, 0);
  if (r <= 0) throw Error(E(`cron.errors.invalidStaggerAmount`));
  let i = e.staggerUnit === `minutes` ? r * 6e4 : r * 1e3;
  return { kind: `cron`, expr: t, tz: e.cronTz.trim() || void 0, staggerMs: i };
}
function vr(e) {
  if (e.payloadKind === `systemEvent`) {
    let t = e.payloadText.trim();
    if (!t) throw Error(E(`cron.errors.systemEventTextRequired`));
    return { kind: `systemEvent`, text: t };
  }
  let t = e.payloadText.trim();
  if (!t) throw Error(E(`cron.errors.agentMessageRequiredShort`));
  let n = { kind: `agentTurn`, message: t },
    r = e.payloadModel.trim();
  r && (n.model = r);
  let i = e.payloadThinking.trim();
  i && (n.thinking = i);
  let a = k(e.timeoutSeconds, 0);
  return (a > 0 && (n.timeoutSeconds = a), e.payloadLightContext && (n.lightContext = !0), n);
}
function yr(e, t = {}) {
  let n = e.trim();
  if (n) return n === Fr ? (t.preserveLastOnUpdate ? Fr : void 0) : n;
}
function br(e, t) {
  if (e.failureAlertMode === `disabled`) return !1;
  if (e.failureAlertMode !== `custom`) return;
  let n = k(e.failureAlertAfter.trim(), 0),
    r = e.failureAlertCooldownSeconds.trim(),
    i = r.length > 0 ? k(r, 0) : void 0,
    a = i !== void 0 && Number.isFinite(i) && i >= 0 ? Math.floor(i * 1e3) : void 0,
    o = e.failureAlertDeliveryMode,
    s = e.failureAlertAccountId.trim(),
    c = {
      after: n > 0 ? Math.floor(n) : void 0,
      channel: yr(e.failureAlertChannel, { preserveLastOnUpdate: !!t }),
      to: e.failureAlertTo.trim() || void 0,
      ...(a === void 0 ? {} : { cooldownMs: a }),
    };
  return (o && (c.mode = o), (c.accountId = s || void 0), c);
}
function xr(e) {
  if (!e || typeof e != `object`) return null;
  let t = `job` in e ? e.job : e;
  if (!t || typeof t != `object`) return null;
  let n = t.id;
  return typeof n == `string` && n.length > 0 ? n : null;
}
async function Sr(e) {
  let t = { saved: !1 };
  return (
    await rr(e, async (n) => {
      let r = Yn(e.cronForm);
      r !== e.cronForm && (e.cronForm = r);
      let i = Xn(r);
      if (((e.cronFieldErrors = i), Zn(i))) return;
      let a = e.cronEditingJobId ? e.cronJobs.find((t) => t.id === e.cronEditingJobId) : void 0,
        o = a ? Gn(a) : null,
        s =
          e.cronEditingJobId && a?.schedule?.kind === `on-exit` && r.scheduleKind === `on-exit`
            ? void 0
            : _r(r),
        c = e.cronEditingJobId && r.payloadLocked && o?.kind === `command` ? void 0 : vr(r);
      c?.kind === `agentTurn` &&
        e.cronEditingJobId &&
        o?.kind === `agentTurn` &&
        (!r.payloadModel.trim() && o.model !== void 0 && (c.model = null),
        !r.payloadThinking.trim() && o.thinking !== void 0 && (c.thinking = null),
        !r.payloadLightContext && o.lightContext !== void 0 && (c.lightContext = !1));
      let l = r.deliveryMode,
        u = r.deliveryAccountId.trim(),
        d = l === `announce` ? u || (a?.delivery?.accountId ? null : void 0) : void 0,
        f =
          l && l !== `none`
            ? {
                mode: l,
                channel:
                  l === `announce`
                    ? yr(r.deliveryChannel, { preserveLastOnUpdate: !!a?.delivery?.channel })
                    : void 0,
                to: r.deliveryTo.trim() || void 0,
                accountId: d,
                bestEffort: r.deliveryBestEffort,
              }
            : l === `none`
              ? { mode: `none` }
              : void 0,
        p = br(
          r,
          a?.failureAlert && typeof a.failureAlert == `object` ? a.failureAlert.channel : void 0,
        ),
        m = r.clearAgent ? null : r.agentId.trim(),
        h = r.sessionKey.trim() || (a?.sessionKey ? null : void 0),
        g = {
          name: r.name.trim(),
          description: r.description.trim(),
          agentId: m === null ? null : m || void 0,
          sessionKey: h,
          enabled: r.enabled,
          deleteAfterRun: r.deleteAfterRun,
          sessionTarget: r.sessionTarget,
          wakeMode: r.wakeMode,
          delivery: f,
          failureAlert: p,
        };
      if ((s && (g.schedule = s), c && (g.payload = c), !g.name))
        throw Error(E(`cron.errors.nameRequiredShort`));
      if (e.cronEditingJobId) {
        let r = e.cronEditingJobId;
        (await n.request(`cron.update`, { id: r, patch: g }), ur(e), (t = { saved: !0, jobId: r }));
      } else {
        let r = await n.request(`cron.add`, g);
        (fr(e), (t = { saved: !0, jobId: xr(r) }));
      }
      await Cr(e);
    }),
    t
  );
}
async function Cr(e) {
  (await or(e, { tableFilters: !0 }), await Qn(e), await Bn(e));
}
async function wr(e, t, n) {
  let r = !1;
  return (
    await rr(e, async (i) => {
      (await i.request(`cron.update`, { id: t.id, patch: { enabled: n } }), (r = !0), await Cr(e));
    }),
    r
  );
}
function Tr(e) {
  if (!(`reason` in e)) return E(`cron.runNotStarted.unknown`);
  switch (e.reason) {
    case `not-due`:
      return E(`cron.runNotStarted.notDue`);
    case `already-running`:
      return E(`cron.runNotStarted.alreadyRunning`);
    case `restart-recovery-pending`:
      return E(`cron.runNotStarted.recoveryPending`);
    case `invalid-spec`:
      return E(`cron.runNotStarted.invalidSpec`);
    case `stopped`:
      return E(`cron.runNotStarted.stopped`);
  }
  return E(`cron.runNotStarted.unknown`);
}
async function Er(e, t, n = `force`) {
  await rr(e, async (r) => {
    let i = await r.request(`cron.run`, { id: t, mode: n });
    if (!i.ok || (`ran` in i && !i.ran)) {
      ((e.cronError = Tr(i)),
        `reason` in i &&
          i.reason === `invalid-spec` &&
          (await Or(e, e.cronRunsScope === `all` ? null : t)));
      return;
    }
    await Or(e, e.cronRunsScope === `all` ? null : t);
  });
}
async function Dr(e, t) {
  await rr(e, async (n) => {
    (await n.request(`cron.remove`, { id: t.id }),
      e.cronEditingJobId === t.id && ur(e),
      e.cronRunsJobId === t.id && ((e.cronRunsJobId = null), dr(e)),
      await Cr(e));
  });
}
async function Or(e, t, n) {
  if (!e.client || !e.connected) return `skipped`;
  let r = e.cronRunsScope,
    i = t ?? e.cronRunsJobId;
  if (r === `job` && !i) return (dr(e), `skipped`);
  let a = n?.append === !0;
  if (a && !e.cronRunsHasMore) return `skipped`;
  try {
    a && (e.cronRunsLoadingMore = !0);
    let t = a ? Math.max(0, e.cronRunsNextOffset ?? e.cronRuns.length) : 0,
      n = await e.client.request(`cron.runs`, {
        ...(e.cronAgentId ? { agentId: e.cronAgentId } : {}),
        scope: r,
        id: r === `job` ? (i ?? void 0) : void 0,
        limit: e.cronRunsLimit,
        offset: t,
        statuses: e.cronRunsStatuses.length > 0 ? e.cronRunsStatuses : void 0,
        status: e.cronRunsStatusFilter,
        deliveryStatuses:
          e.cronRunsDeliveryStatuses.length > 0 ? e.cronRunsDeliveryStatuses : void 0,
        query: e.cronRunsQuery.trim() || void 0,
        sortDir: e.cronRunsSortDir,
      });
    if (r === `job` && (e.cronRunsScope !== `job` || e.cronRunsJobId !== i)) return `skipped`;
    let o = Array.isArray(n.entries) ? n.entries : [];
    e.cronRuns = a && (r === `all` || e.cronRunsJobId === i) ? [...e.cronRuns, ...o] : o;
    let s = ir({
      totalRaw: n.total,
      offsetRaw: n.offset,
      nextOffsetRaw: n.nextOffset,
      hasMoreRaw: n.hasMore,
      pageCount: o.length,
    });
    return (
      (e.cronRunsTotal = Math.max(s.total, e.cronRuns.length)),
      (e.cronRunsHasMore = s.hasMore),
      (e.cronRunsNextOffset = s.nextOffset),
      `ok`
    );
  } catch (t) {
    return ((e.cronError = String(t)), `error`);
  } finally {
    a && (e.cronRunsLoadingMore = !1);
  }
}
async function kr(e) {
  (e.cronRunsScope === `job` && !e.cronRunsJobId) || (await Or(e, e.cronRunsJobId, { append: !0 }));
}
function Ar(e, t) {
  ((e.cronRunsScope = t.cronRunsScope ?? e.cronRunsScope),
    Array.isArray(t.cronRunsStatuses) &&
      ((e.cronRunsStatuses = t.cronRunsStatuses),
      (e.cronRunsStatusFilter = t.cronRunsStatuses[0] ?? `all`)),
    Array.isArray(t.cronRunsDeliveryStatuses) &&
      (e.cronRunsDeliveryStatuses = t.cronRunsDeliveryStatuses),
    t.cronRunsStatusFilter &&
      ((e.cronRunsStatusFilter = t.cronRunsStatusFilter),
      (e.cronRunsStatuses = t.cronRunsStatusFilter === `all` ? [] : [t.cronRunsStatusFilter])),
    typeof t.cronRunsQuery == `string` && (e.cronRunsQuery = t.cronRunsQuery),
    (e.cronRunsSortDir = t.cronRunsSortDir ?? e.cronRunsSortDir));
}
function jr(e, t) {
  ((e.cronEditingJobId = t.id),
    (e.cronRunsJobId = t.id),
    (e.cronForm = gr(t, e.cronForm)),
    (e.cronFieldErrors = Xn(e.cronForm)));
}
function Mr(e, t) {
  let n = e.trim() || `Job`,
    r = `${n} copy`;
  if (!t.has(p(r))) return r;
  let i = 2;
  for (; i < 1e3;) {
    let e = `${n} copy ${i}`;
    if (!t.has(p(e))) return e;
    i += 1;
  }
  return `${n} copy ${Date.now()}`;
}
function Nr(e, t) {
  (ur(e), (e.cronRunsJobId = t.id));
  let n = new Set(e.cronJobs.map((e) => p(e.name))),
    r = gr(t, e.cronForm);
  ((r.name = Mr(t.name, n)),
    r.payloadLocked &&
      ((r.payloadLocked = !1), (r.payloadKind = Ir.payloadKind), (r.payloadText = ``)),
    (e.cronForm = r),
    (e.cronFieldErrors = Xn(e.cronForm)));
}
function Pr(e) {
  (ur(e), fr(e));
}
var Fr,
  Ir,
  Lr = e(() => {
    (Ge(),
      bn(),
      In(),
      zn(),
      D(),
      Hn(),
      (Fr = `last`),
      (Ir = {
        name: ``,
        description: ``,
        agentId: ``,
        sessionKey: ``,
        clearAgent: !1,
        enabled: !0,
        deleteAfterRun: !0,
        scheduleKind: `every`,
        scheduleAt: ``,
        everyAmount: `30`,
        everyUnit: `minutes`,
        cronExpr: `0 7 * * *`,
        cronTz: ``,
        scheduleExact: !1,
        staggerAmount: ``,
        staggerUnit: `seconds`,
        sessionTarget: `isolated`,
        wakeMode: `now`,
        payloadKind: `agentTurn`,
        payloadLocked: !1,
        payloadText: ``,
        payloadModel: ``,
        payloadThinking: ``,
        payloadLightContext: !1,
        deliveryMode: `announce`,
        deliveryChannel: `last`,
        deliveryTo: ``,
        deliveryAccountId: ``,
        deliveryBestEffort: !1,
        failureAlertMode: `inherit`,
        failureAlertAfter: `2`,
        failureAlertCooldownSeconds: `3600`,
        failureAlertChannel: `last`,
        failureAlertTo: ``,
        failureAlertDeliveryMode: `announce`,
        failureAlertAccountId: ``,
        timeoutSeconds: ``,
      }));
  });
function Rr(e) {
  return e.status === `missing`
    ? !0
    : Array.isArray(e.profiles)
      ? e.profiles.some((e) => e.type === `oauth` || e.type === `token`)
      : !1;
}
async function zr(e, t) {
  let n = t?.refresh ? { refresh: !0 } : {};
  return (await e.request(`models.authStatus`, n)) ?? Br;
}
var Br,
  Vr = e(() => {
    Br = { ts: 0, providers: [] };
  }),
  Hr,
  Ur = e(() => {
    Hr = class {
      constructor(e) {
        ((this.host = e), (this.entries = []), (this.connected = !1), e.addController(this));
      }
      watch(e, t, n) {
        return this.addEntry(
          e,
          (e, r) => {
            let i = r.generation,
              a = t(e, () => {
                !this.connected ||
                  r.generation !== i ||
                  !Object.is(r.source, e) ||
                  (n?.(e), this.host.requestUpdate());
              });
            return ((r.cleanup = a), n?.(e), a);
          },
          !0,
        );
      }
      effect(e, t) {
        return this.addEntry(e, (e) => t(e), !1);
      }
      hostConnected() {
        ((this.connected = !0), this.refresh(!0));
      }
      hostUpdate() {
        this.connected && this.refresh(!1);
      }
      clear() {
        for (let e of this.entries) this.disconnectEntry(e);
      }
      hostDisconnected() {
        ((this.connected = !1), this.clear());
      }
      addEntry(e, t, n) {
        let r = {
          getSource: e,
          connect: (e) => t(e, r),
          invalidateOnConnect: n,
          source: void 0,
          cleanup: void 0,
          generation: 0,
        };
        return (this.entries.push(r), this.connected && this.refreshEntry(r, n), this);
      }
      refresh(e) {
        for (let t of this.entries) this.refreshEntry(t, e && t.invalidateOnConnect);
      }
      refreshEntry(e, t) {
        let n = e.getSource() ?? void 0;
        if (!Object.is(e.source, n) && (this.disconnectEntry(e), n !== void 0)) {
          ((e.source = n), (e.generation += 1));
          try {
            e.cleanup = e.connect(n);
          } catch (t) {
            throw (this.disconnectEntry(e), t);
          }
          t && this.host.requestUpdate();
        }
      }
      disconnectEntry(e) {
        ((e.generation += 1), (e.source = void 0));
        let t = e.cleanup;
        if (((e.cleanup = void 0), t))
          try {
            t();
          } catch (e) {
            console.error(`[openclaw] subscription cleanup failed`, e);
          }
      }
    };
  }),
  Wr,
  Gr = e(() => {
    Wr = class {
      constructor(e, t, n, r = !0) {
        ((this.intervalMs = t),
          (this.tick = n),
          (this.autoStart = r),
          (this.timer = null),
          e.addController(this));
      }
      hostConnected() {
        this.autoStart && this.start();
      }
      hostDisconnected() {
        this.stop();
      }
      start() {
        return this.timer === null
          ? ((this.timer = globalThis.setInterval(() => {
              this.tick();
            }, this.intervalMs)),
            !0)
          : !1;
      }
      stop() {
        this.timer !== null && (globalThis.clearInterval(this.timer), (this.timer = null));
      }
    };
  });
function Kr(e, t) {
  let n = T(t);
  return n ? te(n, Xr[e]) : void 0;
}
function qr(e) {
  let t = T(e);
  return t
    ? s(t) || Zr.test(t)
      ? t
      : Qr.test(t) || /[\r\n]/.test(t)
        ? null
        : t.length <= Yr
          ? t
          : null
    : null;
}
function Jr(e) {
  let t = Kr(`name`, e?.name) ?? $r,
    n = qr(e?.avatar),
    r = Kr(`avatarSource`, e?.avatarSource) ?? null,
    i =
      e?.avatarStatus === `none` ||
      e?.avatarStatus === `local` ||
      e?.avatarStatus === `remote` ||
      e?.avatarStatus === `data`
        ? e.avatarStatus
        : null,
    a = Kr(`avatarReason`, e?.avatarReason) ?? null;
  return {
    agentId: typeof e?.agentId == `string` && e.agentId.trim() ? e.agentId.trim() : null,
    name: t,
    avatar: n,
    avatarSource: r,
    avatarStatus: i,
    avatarReason: a,
  };
}
var Yr,
  Xr,
  Zr,
  Qr,
  $r,
  ei = e(() => {
    (y(),
      i(),
      D(),
      (Yr = 64),
      (Xr = { name: 50, avatarSource: 500, avatarReason: 200 }),
      (Zr = /^\/(?!\/)/),
      (Qr = /^[a-z][a-z0-9+.-]*:/i),
      ($r = `Assistant`));
  });
function ti(e) {
  return s(e) || ai.test(e);
}
function ni(e, t) {
  let n = [T(t?.avatar), T(e.identity?.avatarUrl), T(e.identity?.avatar)];
  for (let e of n) if (e && ti(e)) return e;
  return null;
}
function ri(e, t, n) {
  let r = T(e);
  return r?.startsWith(`blob:`) ? r : ni(t, n);
}
function ii(e) {
  let t = e?.trim();
  return !t ||
    t === `A` ||
    t.startsWith(`blob:`) ||
    ti(t) ||
    t.length > 8 ||
    /\s/.test(t) ||
    /[\\/.:]/.test(t) ||
    oi.test(t)
    ? null
    : t;
}
var ai,
  oi,
  si = e(() => {
    (i(), ei(), D(), (ai = /^\/(?!\/)/), (oi = /[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/u));
  });
function ci(e) {
  let t = e.trim().toLowerCase();
  return Ti.has(t) ? `openai` : t;
}
function li(e, t) {
  let n = e.trim();
  if (!n) return ``;
  let r = t?.trim();
  if (!r) return n;
  let i = `${r.toLowerCase()}/`;
  return n.toLowerCase().startsWith(i) ? n : `${r}/${n}`;
}
function ui(e) {
  let t = e.trim();
  return t ? (t.includes(`/`) ? { kind: `qualified`, value: t } : { kind: `raw`, value: t }) : null;
}
function di(e, t) {
  if (!e) return ``;
  let n = e?.value.trim();
  return n ? (e.kind === `qualified` ? n : mi(n, t) || n) : ``;
}
function fi(e, t) {
  if (typeof e != `string`) return ``;
  let n = e.trim();
  if (!n) return ``;
  let r = t?.trim();
  if (!r) return n;
  let i = `${r.toLowerCase()}/`;
  return n.toLowerCase().startsWith(i) || n.includes(`/`) ? n : li(n, r);
}
function pi(e, t) {
  let n = t.trim().toLowerCase();
  return n ? e.some((e) => yi(e) === n) : !1;
}
function mi(e, t) {
  let n = e.trim().toLowerCase();
  if (!n) return ``;
  let r = ``;
  for (let e of t) {
    if (e.id.trim().toLowerCase() !== n) continue;
    let t = li(e.id, e.provider);
    if (!r) {
      r = t;
      continue;
    }
    if (r.toLowerCase() !== t.toLowerCase()) return ``;
  }
  return r;
}
function hi(e, t, n) {
  if (typeof e != `string`) return ``;
  let r = e.trim();
  if (!r) return ``;
  let i = t?.trim();
  if (!i) return di(ui(r), n);
  if (!r.includes(`/`)) {
    let e = di(ui(r), n);
    return e === r ? fi(r, i) : e;
  }
  let a = li(r, i),
    o = r.toLowerCase(),
    s = ci(i);
  return n.some((e) => e.id.trim().toLowerCase() === o && ci(e.provider) === s) && pi(n, a)
    ? a
    : pi(n, r)
      ? r
      : pi(n, a)
        ? a
        : mi(r, n) || fi(r, i);
}
function gi(e) {
  let t = e.trim();
  if (!t) return ``;
  let n = t.indexOf(`/`);
  return n <= 0 ? t : `${t.slice(n + 1)} · ${t.slice(0, n)}`;
}
function _i(e) {
  let t = e.provider?.trim();
  return t ? `${e.id} · ${t}` : e.id;
}
function vi(e) {
  return e.alias?.trim() || e.name.trim();
}
function yi(e) {
  return li(e.id, e.provider).trim().toLowerCase();
}
function bi(e, t) {
  return `${e.toLowerCase()}\u0000${t?.trim().toLowerCase() ?? ``}`;
}
function xi(e) {
  let t = new Map(),
    n = new Map();
  for (let r of e) {
    let e = vi(r);
    if (!e) continue;
    let i = yi(r),
      a = e.toLowerCase(),
      o = bi(e, r.provider),
      s = t.get(a) ?? new Set();
    (s.add(i), t.set(a, s));
    let c = n.get(o) ?? new Set();
    (c.add(i), n.set(o, c));
  }
  let r = new Map();
  for (let i of e) {
    let e = yi(i),
      a = vi(i);
    if (!a) {
      r.set(e, _i(i));
      continue;
    }
    let o = a.toLowerCase();
    if ((t.get(o)?.size ?? 0) <= 1) {
      r.set(e, a);
      continue;
    }
    let s = i.provider?.trim();
    if ((n.get(bi(a, s))?.size ?? 0) <= 1) {
      r.set(e, s ? `${a} · ${s}` : `${a} · ${i.id}`);
      continue;
    }
    r.set(e, `${a} · ${_i(i)}`);
  }
  return r;
}
function Si(e, t) {
  return t.get(yi(e)) ?? _i(e);
}
function Ci(e, t) {
  let n = e.trim();
  return n ? (t.get(n.toLowerCase()) ?? gi(n)) : ``;
}
function wi(e, t) {
  let n = e.provider?.trim();
  return { value: li(e.id, n), label: Si(e, t) };
}
var Ti,
  Ei = e(() => {
    Ti = new Set([`codex`, `openai-codex`]);
  });
function Di(e) {
  return e?.groups?.length
    ? e.groups.map((e) => ({
        id: e.id,
        label: e.label,
        source: e.source,
        pluginId: e.pluginId,
        tools: e.tools.map((e) => ({
          id: e.id,
          label: e.label,
          description: e.description,
          source: e.source,
          pluginId: e.pluginId,
          optional: e.optional,
          defaultProfiles: [...e.defaultProfiles],
        })),
      }))
    : Zi.map((e) => ({
        id: e.id,
        label: E(e.labelKey),
        tools: e.tools.map((e) => ({ id: e.id, label: e.label, description: E(e.descriptionKey) })),
      }));
}
function Oi(e) {
  return e?.profiles?.length ? e.profiles : Qi.map((e) => ({ id: e.id, label: E(e.labelKey) }));
}
function ki(e) {
  return T(e.name) ?? T(e.identity?.name) ?? e.id;
}
function Ai(e) {
  return Fe(`apple-touch-icon.png`, e);
}
function ji(e, t) {
  let n = [T(e.identity?.emoji), T(e.identity?.avatar), T(t?.emoji), T(t?.avatar)];
  for (let e of n) {
    let t = ii(e);
    if (t) return t;
  }
  return null;
}
function Mi(e, t) {
  return t && e === t ? `default` : null;
}
function Ni(e) {
  return e == null || !Number.isFinite(e)
    ? `-`
    : m(e, {
        style: `legacy-binary`,
        maxUnit: `tera`,
        separator: ` `,
        fractionDigits: (e, t) => (t === `byte` ? null : +(e < 10)),
      });
}
function Pi(e, t) {
  let n = e;
  return {
    entry: (n?.agents?.list ?? []).find((e) => e?.id === t),
    defaults: n?.agents?.defaults,
    globalTools: n?.tools,
  };
}
function Fi(e, t, n, r, i) {
  let a = Pi(t, e.id),
    o =
      (n && n.agentId === e.id ? n.workspace : null) ||
      a.entry?.workspace ||
      a.defaults?.workspace ||
      e.workspace ||
      `default`,
    s = a.entry?.model
      ? Li(a.entry?.model)
      : a.defaults?.model
        ? Li(a.defaults?.model)
        : Li(e.model),
    c = Ii(e.agentRuntime),
    l = T(e.identity?.name) || T(e.name) || T(i?.name) || a.entry?.name || e.id,
    u = ni(e, i) ? `custom` : (ji(e, i) ?? `—`),
    d = Array.isArray(a.entry?.skills) ? a.entry?.skills : null,
    f = d?.length ?? null;
  return {
    workspace: o,
    model: s,
    runtime: c,
    identityName: l,
    identityAvatar: u,
    skillsLabel: d
      ? E(`agents.overview.selectedSkills`, { count: String(f) })
      : E(`agents.overview.allSkills`),
    isDefault: !!(r && e.id === r),
  };
}
function Ii(e) {
  let t = T(e?.id) ?? `pi`,
    n = T(e?.fallback);
  return n ? `${t} (fallback ${n})` : t;
}
function Li(e) {
  if (!e) return `-`;
  if (typeof e == `string`) return T(e) || `-`;
  if (typeof e == `object` && e) {
    let t = e,
      n = T(t.primary);
    if (n) {
      let e = Array.isArray(t.fallbacks) ? t.fallbacks.length : 0;
      return e > 0 ? `${n} (+${e} fallback)` : n;
    }
  }
  return `-`;
}
function Ri(e) {
  return e.match(/^(.+) \(\+\d+ fallback\)$/)?.[1] ?? e;
}
function zi(e) {
  if (!e) return null;
  if (typeof e == `string`) return T(e) || null;
  if (typeof e == `object` && e) {
    let t = e;
    return (
      T(
        typeof t.primary == `string`
          ? t.primary
          : typeof t.model == `string`
            ? t.model
            : typeof t.id == `string`
              ? t.id
              : typeof t.value == `string`
                ? t.value
                : null,
      ) || null
    );
  }
  return null;
}
function Bi(e) {
  if (!e || typeof e == `string`) return null;
  if (typeof e == `object` && e) {
    let t = e,
      n = Array.isArray(t.fallbacks) ? t.fallbacks : Array.isArray(t.fallback) ? t.fallback : null;
    return n ? n.filter((e) => typeof e == `string`) : null;
  }
  return null;
}
function Vi(e, t) {
  return Bi(e) ?? Bi(t);
}
function Hi(e) {
  return e
    .split(`,`)
    .map((e) => e.trim())
    .filter(Boolean);
}
function Ui(e) {
  let t = e?.agents?.defaults?.models;
  if (!t || typeof t != `object`) return [];
  let n = [];
  for (let [e, r] of Object.entries(t)) {
    let t = e.trim();
    if (!t) continue;
    let i =
        r && typeof r == `object` && `alias` in r && typeof r.alias == `string`
          ? r.alias?.trim()
          : void 0,
      a = i && i !== t ? `${i} (${t})` : t;
    n.push({ value: t, label: a });
  }
  return n;
}
function Wi(e, t, n, r) {
  let i = new Set(),
    a = [],
    o = r ? p(r) : null,
    s = (e, t) => {
      let n = p(e);
      i.has(n) || (i.add(n), a.push({ value: e, label: t }));
    };
  for (let t of Ui(e)) s(t.value, t.label);
  if (n)
    for (let e of n) {
      let t = e.provider?.trim();
      s(li(e.id, t), t ? `${e.id} · ${t}` : e.id);
    }
  return (
    t && !i.has(p(t)) && a.unshift({ value: t, label: `Current (${t})` }),
    a.length === 0
      ? f
      : a.map(
          (e) => u`
      <option
        value=${e.value}
        ?selected=${o === p(e.value)}
      >
        ${e.label}
      </option>
    `,
        )
  );
}
function Gi(e) {
  let t = ae(e);
  if (!t) return { kind: `exact`, value: `` };
  if (t === `*`) return { kind: `all` };
  if (!t.includes(`*`)) return { kind: `exact`, value: t };
  let n = t.replace(/[.*+?^${}()|[\\]\\]/g, `\\$&`);
  return { kind: `regex`, value: RegExp(`^${n.replaceAll(`\\*`, `.*`)}$`) };
}
function Ki(e) {
  return Array.isArray(e)
    ? h(e)
        .map(Gi)
        .filter((e) => e.kind !== `exact` || e.value.length > 0)
    : [];
}
function qi(e, t) {
  for (let n of t)
    if (
      n.kind === `all` ||
      (n.kind === `exact` && e === n.value) ||
      (n.kind === `regex` && n.value.test(e))
    )
      return !0;
  return !1;
}
function Ji(e, t) {
  if (!t) return !0;
  let n = ae(e);
  if (qi(n, Ki(t.deny))) return !1;
  let r = Ki(t.allow);
  return !!(r.length === 0 || qi(n, r) || (n === `apply_patch` && qi(`exec`, r)));
}
function Yi(e, t) {
  if (!Array.isArray(t) || t.length === 0) return !1;
  let n = ae(e),
    r = Ki(t);
  return !!(qi(n, r) || (n === `apply_patch` && qi(`exec`, r)));
}
function Xi(e) {
  return ee(e) ?? void 0;
}
var Zi,
  Qi,
  $i = e(() => {
    (g(),
      d(),
      Ce(),
      Me(),
      Ge(),
      si(),
      Ei(),
      D(),
      (Zi = [
        {
          id: `fs`,
          labelKey: `agents.toolCatalog.groups.files`,
          tools: [
            { id: `read`, label: `read`, descriptionKey: `agents.toolCatalog.descriptions.read` },
            {
              id: `write`,
              label: `write`,
              descriptionKey: `agents.toolCatalog.descriptions.write`,
            },
            { id: `edit`, label: `edit`, descriptionKey: `agents.toolCatalog.descriptions.edit` },
            {
              id: `apply_patch`,
              label: `apply_patch`,
              descriptionKey: `agents.toolCatalog.descriptions.applyPatch`,
            },
          ],
        },
        {
          id: `runtime`,
          labelKey: `agents.toolCatalog.groups.runtime`,
          tools: [
            { id: `exec`, label: `exec`, descriptionKey: `agents.toolCatalog.descriptions.exec` },
            {
              id: `process`,
              label: `process`,
              descriptionKey: `agents.toolCatalog.descriptions.process`,
            },
          ],
        },
        {
          id: `web`,
          labelKey: `agents.toolCatalog.groups.web`,
          tools: [
            {
              id: `web_search`,
              label: `web_search`,
              descriptionKey: `agents.toolCatalog.descriptions.webSearch`,
            },
            {
              id: `web_fetch`,
              label: `web_fetch`,
              descriptionKey: `agents.toolCatalog.descriptions.webFetch`,
            },
          ],
        },
        {
          id: `memory`,
          labelKey: `agents.toolCatalog.groups.memory`,
          tools: [
            {
              id: `memory_search`,
              label: `memory_search`,
              descriptionKey: `agents.toolCatalog.descriptions.memorySearch`,
            },
            {
              id: `memory_get`,
              label: `memory_get`,
              descriptionKey: `agents.toolCatalog.descriptions.memoryGet`,
            },
          ],
        },
        {
          id: `sessions`,
          labelKey: `agents.toolCatalog.groups.sessions`,
          tools: [
            {
              id: `sessions_list`,
              label: `sessions_list`,
              descriptionKey: `agents.toolCatalog.descriptions.sessionsList`,
            },
            {
              id: `sessions_history`,
              label: `sessions_history`,
              descriptionKey: `agents.toolCatalog.descriptions.sessionsHistory`,
            },
            {
              id: `sessions_send`,
              label: `sessions_send`,
              descriptionKey: `agents.toolCatalog.descriptions.sessionsSend`,
            },
            {
              id: `sessions_spawn`,
              label: `sessions_spawn`,
              descriptionKey: `agents.toolCatalog.descriptions.sessionsSpawn`,
            },
            {
              id: `session_status`,
              label: `session_status`,
              descriptionKey: `agents.toolCatalog.descriptions.sessionStatus`,
            },
          ],
        },
        {
          id: `ui`,
          labelKey: `agents.toolCatalog.groups.ui`,
          tools: [
            {
              id: `browser`,
              label: `browser`,
              descriptionKey: `agents.toolCatalog.descriptions.browser`,
            },
            {
              id: `canvas`,
              label: `canvas`,
              descriptionKey: `agents.toolCatalog.descriptions.canvas`,
            },
          ],
        },
        {
          id: `messaging`,
          labelKey: `agents.toolCatalog.groups.messaging`,
          tools: [
            {
              id: `message`,
              label: `message`,
              descriptionKey: `agents.toolCatalog.descriptions.message`,
            },
          ],
        },
        {
          id: `automation`,
          labelKey: `agents.toolCatalog.groups.automation`,
          tools: [
            { id: `cron`, label: `cron`, descriptionKey: `agents.toolCatalog.descriptions.cron` },
            {
              id: `gateway`,
              label: `gateway`,
              descriptionKey: `agents.toolCatalog.descriptions.gateway`,
            },
          ],
        },
        {
          id: `nodes`,
          labelKey: `agents.toolCatalog.groups.nodes`,
          tools: [
            {
              id: `nodes`,
              label: `nodes`,
              descriptionKey: `agents.toolCatalog.descriptions.nodes`,
            },
          ],
        },
        {
          id: `agents`,
          labelKey: `agents.toolCatalog.groups.agents`,
          tools: [
            {
              id: `agents_list`,
              label: `agents_list`,
              descriptionKey: `agents.toolCatalog.descriptions.agentsList`,
            },
          ],
        },
        {
          id: `media`,
          labelKey: `agents.toolCatalog.groups.media`,
          tools: [
            {
              id: `image`,
              label: `image`,
              descriptionKey: `agents.toolCatalog.descriptions.image`,
            },
          ],
        },
      ]),
      (Qi = [
        { id: `minimal`, labelKey: `agents.toolCatalog.profiles.minimal` },
        { id: `coding`, labelKey: `agents.toolCatalog.profiles.coding` },
        { id: `messaging`, labelKey: `agents.toolCatalog.profiles.messaging` },
        { id: `full`, labelKey: `agents.toolCatalog.profiles.full` },
      ]));
  });
function ea(e) {
  return e.classList.contains(`hover-marquee`) ? e : e.querySelector(`.hover-marquee`);
}
function ta(e) {
  let t = sa.get(e);
  t !== void 0 && (window.clearTimeout(t), sa.delete(e));
}
function na(e) {
  let t = ea(e);
  if (!t || t.classList.contains(`hover-marquee--scrolling`)) return;
  ta(t);
  let n = Number.parseFloat(getComputedStyle(t).textIndent) || 0,
    r = t.scrollWidth - n - t.clientWidth;
  if (r <= 1) return;
  let i = Math.max(aa, Math.round((r / ia) * 1e3));
  (t.style.setProperty(`--hover-marquee-shift`, `${-r}px`),
    t.style.setProperty(`--hover-marquee-duration`, `${i}ms`),
    sa.set(
      t,
      window.setTimeout(() => {
        (sa.delete(t), t.classList.add(`hover-marquee--scrolling`));
      }, oa),
    ));
}
function ra(e) {
  let t = ea(e);
  t && (ta(t), t.classList.remove(`hover-marquee--scrolling`));
}
var ia,
  aa,
  oa,
  sa,
  ca = e(() => {
    ((ia = 80), (aa = 300), (oa = 500), (sa = new WeakMap()));
  });
function la(e) {
  let t = p(e);
  return va[t] ?? ma(t || e);
}
function ua(e) {
  let t = e.trim();
  return t.length <= 10 ? t : `…${t.slice(-6)}`;
}
function da(e) {
  return e.replace(ba, (e) => `…${e.slice(-4)}`);
}
function fa(e, t) {
  if (!Ca.test(e)) return { channelSession: !1 };
  let n = e.match(Sa)?.[1],
    r = T(n && n !== `direct` ? n : void 0) ?? T(t);
  return { channel: r, channelSession: !!r };
}
function pa(e) {
  let t = T(e.worktree?.repoRoot),
    n = T(e.worktree?.branch),
    r = T(e.execNode),
    i = r ? da(r) : void 0,
    a = t ? (t.split(/[\\/]/).findLast(Boolean) ?? t) : void 0,
    o = n?.startsWith(xa) ? n.slice(9) : n,
    s = a ? (o ? `${a} ⎇ ${o}` : a) : void 0;
  return s && i ? `${s} · ${i}` : (s ?? i);
}
function ma(e) {
  return e.charAt(0).toUpperCase() + e.slice(1);
}
function ha(e) {
  let t = p(e);
  if (e === `main` || e === `agent:main:main`) return { prefix: ``, fallbackName: `Main Session` };
  if (e.includes(`:subagent:`)) return { prefix: `Subagent:`, fallbackName: `Subagent:` };
  if (t.startsWith(`cron:`) || e.includes(`:cron:`))
    return { prefix: `Cron:`, fallbackName: `Cron Job:` };
  let n = e.match(/^agent:[^:]+:([^:]+):direct:(.+)$/);
  if (n) {
    let t = n[1],
      r = n[2];
    return !t || !r
      ? { prefix: ``, fallbackName: e }
      : { prefix: ``, fallbackName: `${va[t] ?? ma(t)} · ${ua(r)}` };
  }
  let r = e.match(/^agent:[^:]+:([^:]+):group:(.+)$/);
  if (r) {
    let t = r[1];
    return t
      ? { prefix: ``, fallbackName: `${va[t] ?? ma(t)} Group` }
      : { prefix: ``, fallbackName: e };
  }
  for (let t of ya)
    if (e === t || e.startsWith(`${t}:`)) return { prefix: ``, fallbackName: `${va[t]} Session` };
  if (/^agent:[^:]+:dashboard:/.test(e)) return { prefix: ``, fallbackName: `New session` };
  let i = e.match(/^agent:[^:]+:(?:explicit:)?(.+)$/)?.[1];
  return i ? { prefix: ``, fallbackName: da(i) } : { prefix: ``, fallbackName: e };
}
function ga(e, t) {
  let n = T(t?.label) ?? ``,
    r = T(t?.displayName) ?? ``,
    { prefix: i, fallbackName: a } = ha(e),
    o = (e) =>
      i
        ? RegExp(`^${i.replace(/[.*+?^${}()|[\\]\\]/g, `\\$&`)}\\s*`, `i`).test(e)
          ? e
          : `${i} ${e}`
        : e;
  if (n && n !== e) return o(n);
  if (r && r !== e) return o(r);
  let s = t ? pa(t) : void 0;
  return s && t?.worktree ? o(s) : a;
}
function _a(e) {
  let t = p(e);
  if (!t) return !1;
  if (t.startsWith(`cron:`)) return !0;
  if (!t.startsWith(`agent:`)) return !1;
  let n = t.split(`:`).filter(Boolean);
  return n.length < 3 ? !1 : n.slice(2).join(`:`).startsWith(`cron:`);
}
var va,
  ya,
  ba,
  xa,
  Sa,
  Ca,
  wa = e(() => {
    (D(),
      (va = {
        imessage: `iMessage`,
        telegram: `Telegram`,
        discord: `Discord`,
        signal: `Signal`,
        slack: `Slack`,
        whatsapp: `WhatsApp`,
        matrix: `Matrix`,
        email: `Email`,
        sms: `SMS`,
      }),
      (ya = Object.keys(va)),
      (ba = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[0-9a-f]{10,}/gi),
      (xa = `openclaw/`),
      (Sa = /^agent:[^:]+:([^:]+)(?::[^:]+)?:(?:direct|group|channel|thread):/),
      (Ca = /:(?:direct|group|channel|thread):/));
  });
function Ta(e) {
  document.dispatchEvent(new CustomEvent(ka, { detail: e }));
}
async function Ea(e) {
  let { client: t, key: n } = e,
    r,
    i = new Set(),
    a = null;
  for (let o = 0; o < ja; o += 1) {
    let o = await t.request(`sessions.catalog.list`, {
      catalogId: n.catalogId,
      hostIds: [n.hostId],
      limitPerHost: Aa,
      ...(r ? { cursors: { [n.hostId]: r } } : {}),
    });
    if (!e.isCurrent()) return null;
    a =
      o.catalogs.find((e) => e.id === n.catalogId)?.hosts.find((e) => e.hostId === n.hostId) ??
      null;
    let s = a?.sessions.find((e) => e.threadId === n.threadId) ?? null;
    if (s) return { host: a, session: s };
    let c = a?.nextCursor;
    if (!c || i.has(c)) break;
    (i.add(c), (r = c));
  }
  return { host: a, session: null };
}
function Da(e) {
  return `catalog:${encodeURIComponent(e.catalogId)}:${encodeURIComponent(e.hostId)}:${encodeURIComponent(e.threadId)}`;
}
function Oa(e) {
  if (!e?.startsWith(`catalog:`)) return null;
  let t = e.slice(8).split(`:`);
  if (t.length !== 3 || t.some((e) => !e)) return null;
  try {
    let [e, n, r] = t.map((e) => decodeURIComponent(e));
    return e && n && r ? { catalogId: e, hostId: n, threadId: r } : null;
  } catch {
    return null;
  }
}
var ka,
  Aa,
  ja,
  Ma = e(() => {
    ((ka = `openclaw-session-catalog-continued`), (Aa = 100), (ja = 100));
  });
function Na(e) {
  window.dispatchEvent(new CustomEvent(qe, { detail: { open: !0, catalog: e } }));
}
var Pa = e(() => {
  Ke();
});
function Fa(e) {
  let t = e?.groups;
  return Array.isArray(t)
    ? t.flatMap((e) => (typeof e?.name == `string` && e.name.trim() ? [e.name.trim()] : []))
    : [];
}
function Ia(e, t, n, r = `before`) {
  let i = [...new Set(e.map((e) => e.trim()).filter(Boolean))],
    a = i.indexOf(t),
    o = i.indexOf(n);
  if (a < 0 || o < 0 || a === o) return i;
  let [s] = i.splice(a, 1);
  if (!s) return i;
  let c = i.indexOf(n) + +(r === `after`);
  return (i.splice(c, 0, s), i);
}
var La = e(() => {});
function Ra(e, t) {
  (e.setData(Wa, t), e.setData(`text/plain`, t), (e.effectAllowed = `copyMove`));
}
function za(e) {
  return e?.getData(`application/x-openclaw-session-key`).trim() || null;
}
function Ba(e) {
  return Array.from(e?.types ?? []).includes(Wa);
}
function Va(e, t) {
  (e.setData(Ga, t), (e.effectAllowed = `move`));
}
function Ha(e) {
  return e?.getData(Ga).trim() || null;
}
function Ua(e) {
  return Array.from(e?.types ?? []).includes(Ga);
}
var Wa,
  Ga,
  Ka = e(() => {
    ((Wa = `application/x-openclaw-session-key`), (Ga = `application/x-openclaw-session-group`));
  });
function A(e) {
  let t = p(e);
  if (!t) return null;
  let n = t.split(`:`).filter(Boolean);
  if (n.length < 3 || n[0] !== `agent`) return null;
  let r = T(n[1]),
    i = n.slice(2).join(`:`);
  return !r || !i ? null : { agentId: r, rest: i };
}
function qa(e) {
  return ce(e) ?? `main`;
}
function Ja(e) {
  let t = T(e);
  if (!t) return ``;
  let n = t.split(`:`),
    r = 0;
  for (; n.length - r >= 3 && n[r]?.toLowerCase() === `agent`;)
    ((n[r] = `agent`), (n[r + 1] = n[r + 1]?.toLowerCase() ?? ``), (r += 2));
  for (; r < n.length && !n[r]?.trim();) r += 1;
  let i = n[r]?.toLowerCase(),
    a = n[r + 1]?.toLowerCase(),
    o = i === `matrix` && (a === `channel` || a === `group`);
  if (!o && !(i === `signal` && a === `group`)) return t.toLowerCase();
  if (((n[r] = i), (n[r + 1] = a), o)) {
    for (let e = n.length - 2; e >= r + 2; --e)
      if (n[e]?.toLowerCase() === `thread`) {
        n[e] = `thread`;
        break;
      }
  } else {
    n[r + 2] = n[r + 2]?.trim() ?? ``;
    for (let e = r + 3; e < n.length; e += 1) n[e] = n[e]?.toLowerCase() ?? ``;
  }
  return n.join(`:`);
}
function Ya(e) {
  let t = e.hello?.snapshot;
  if (!t || typeof t != `object` || !(`sessionDefaults` in t)) return;
  let n = t.sessionDefaults;
  return n && typeof n == `object` ? n : void 0;
}
function Xa(e) {
  return qa(e.agentsList?.mainKey ?? Ya(e)?.mainKey);
}
function Za(e) {
  return M(e.agentsList?.defaultId ?? Ya(e)?.defaultAgentId ?? `main`);
}
function Qa(e) {
  let t = e.assistantAgentId ?? e.agentsList?.defaultId ?? Ya(e)?.defaultAgentId;
  return t ? M(t) : void 0;
}
function $a(e) {
  return Qa(e) ?? `main`;
}
function eo(e, t, n) {
  let r = A(t);
  if (!r) return null;
  let i = p(r.rest);
  return i === `global`
    ? M(r.agentId)
    : (i !== `main` && i !== Xa(e)) || (n?.requireGlobalRowForMainAlias && n.rowKind !== `global`)
      ? null
      : M(r.agentId);
}
function j(e) {
  return p(e) === `global`;
}
function to(e, t) {
  let n = A(t);
  if (!n) return null;
  let r = p(n.rest),
    i = Xa(e);
  return r === `main` || r === i ? M(n.agentId) : null;
}
function no(e) {
  let t = ce(e.agentsList?.scope);
  return t ? t === `global` : j(ro(e));
}
function ro(e) {
  return T(Ya(e)?.mainSessionKey) ?? lo({ agentId: Za(e), mainKey: Xa(e) });
}
function io(e, t) {
  let n = T(t);
  if (!n) return null;
  let r = Xa(e),
    i = Za(e),
    a = ro(e),
    o = new Set(
      [vo, r, a, lo({ agentId: i, mainKey: vo }), lo({ agentId: i, mainKey: r })]
        .filter((e) => !!e)
        .map(p),
    ),
    s = p(n);
  return o.has(s) ? p(a) : s;
}
function ao(e, t, n) {
  let r = T(t);
  if (!r) return !0;
  let i = io(e, r) === io(e, e.sessionKey),
    a = to(e, e.sessionKey),
    o = a !== null && j(r) && a === M(n ?? Za(e));
  if (!i && !o) return !1;
  if (!j(e.sessionKey) || !j(r)) return !0;
  let s = $a(e),
    c = T(n);
  return c ? M(c) === s : s === Za(e);
}
function oo(e) {
  return j(e) ? !0 : p(A(e)?.rest) === vo;
}
function so(e, t = e.sessionKey) {
  let n = A(t);
  return n?.agentId ? M(n.agentId) : Qa(e);
}
function co(e, t, n) {
  return fo(t, n) ? !0 : !!(j(t) && eo(e, n));
}
function M(e) {
  let t = T(e) ?? ``;
  return t
    ? yo.test(t)
      ? p(t)
      : p(t).replace(bo, `-`).replace(xo, ``).replace(So, ``).slice(0, 64) || `main`
    : _o;
}
function lo(e) {
  return `agent:${M(e.agentId)}:${qa(e.mainKey)}`;
}
function uo(e) {
  let t = Ja(e);
  return t === `main` ? lo({ agentId: _o, mainKey: vo }) : t;
}
function fo(e, t) {
  let n = uo(e),
    r = uo(t);
  return !!(n && r && n === r);
}
function po(e) {
  return M(A(e)?.agentId ?? `main`);
}
function mo(e, t) {
  return e.hasActiveRun === !0 || e.kind === `global` || e.kind === `unknown`
    ? !1
    : !(e.key === `main` || p(A(e.key)?.rest) === qa(t));
}
function ho(e, t, n = _o) {
  let r = M(t),
    i = A(e);
  return i ? M(i.agentId) === r : r === M(n);
}
function go(e) {
  let t = T(e) ?? ``;
  return t ? (p(t).startsWith(`subagent:`) ? !0 : p(A(t)?.rest).startsWith(`subagent:`)) : !1;
}
var _o,
  vo,
  yo,
  bo,
  xo,
  So,
  Co = e(() => {
    (D(),
      (_o = `main`),
      (vo = `main`),
      (yo = /^[a-z0-9][a-z0-9_-]{0,63}$/i),
      (bo = /[^a-z0-9_-]+/g),
      (xo = /^-+/),
      (So = /-+$/));
  });
function wo(e) {
  return Mo.includes(e) ? e : `none`;
}
function To(e, t) {
  if (typeof e != `number` || !Number.isFinite(e) || e <= 0) return ``;
  let n = new Date(t);
  n.setHours(0, 0, 0, 0);
  let r = 1440 * 60 * 1e3;
  return e >= n.getTime()
    ? `today`
    : e >= n.getTime() - r
      ? `yesterday`
      : e >= n.getTime() - 6 * r
        ? `week`
        : `older`;
}
function Eo(e) {
  return e.channel ?? Pn(e.key)?.channel ?? ``;
}
function Do(e, t, n) {
  switch (t) {
    case `category`:
      return e.category?.trim() ?? ``;
    case `channel`:
      return Eo(e);
    case `kind`:
      return e.kind;
    case `agent`:
      return A(e.key)?.agentId ?? ``;
    case `date`:
      return To(e.updatedAt, n);
    default:
      return ``;
  }
}
function Oo(e) {
  let t = e.now ?? Date.now(),
    n = new Map();
  for (let r of e.rows) {
    let i = Do(r, e.mode, t),
      a = n.get(i);
    a ? a.push(r) : n.set(i, [r]);
  }
  return jo(e.mode, n, e.knownCategories ?? []).map((e) => ({ id: e, rows: n.get(e) ?? [] }));
}
function ko(e) {
  return e === `none` ? `none` : `category`;
}
function Ao(e, t = {}) {
  let n = t.grouping ?? `category`,
    r = [],
    i = [],
    a = new Map(),
    o = [],
    s = new Map();
  if (n === `category`)
    for (let e of t.knownGroups ?? []) {
      let t = e.trim();
      t && !s.has(t) && s.set(t, []);
    }
  for (let t of e) {
    if (t.pinned === !0) {
      r.push(t);
      continue;
    }
    if (n !== `category`) {
      i.push(t);
      continue;
    }
    let e = t.category?.trim();
    if (e) {
      let n = s.get(e);
      n ? n.push(t) : s.set(e, [t]);
      continue;
    }
    let c = t.channelSession === !0 ? (t.channel?.trim() ?? ``) : ``;
    if (c) {
      let e = a.get(c);
      e ? e.push(t) : a.set(c, [t]);
      continue;
    }
    if (t.workSession === !0) {
      o.push(t);
      continue;
    }
    i.push(t);
  }
  let c = [];
  r.length > 0 && c.push({ id: `pinned`, rows: r });
  for (let e of [...a.keys()].toSorted((e, t) => e.localeCompare(t)))
    c.push({ id: `channel:${e}`, channel: e, rows: a.get(e) ?? [] });
  o.length > 0 && c.push({ id: `work`, work: !0, rows: o });
  let l = [...new Set((t.knownGroups ?? []).map((e) => e.trim()).filter(Boolean))],
    u = [
      ...l.filter((e) => s.has(e)),
      ...[...s.keys()].filter((e) => !l.includes(e)).toSorted((e, t) => e.localeCompare(t)),
    ];
  for (let e of u) c.push({ id: `category:${e}`, category: e, rows: s.get(e) ?? [] });
  return (c.push({ id: `ungrouped`, rows: i }), c);
}
function jo(e, t, n) {
  if (e === `date`) return No.filter((e) => t.has(e));
  if (e === `category`) {
    let e = [...new Set(n.map((e) => e.trim()).filter(Boolean))],
      r = [...t.keys()]
        .filter((t) => t !== `` && !e.includes(t))
        .toSorted((e, t) => e.localeCompare(t));
    return [...e, ...r, ``];
  }
  let r = [...t.keys()].filter((e) => e !== ``);
  return (r.sort((e, t) => e.localeCompare(t)), t.has(``) && r.push(``), r);
}
var Mo,
  No,
  Po = e(() => {
    (In(),
      Co(),
      (Mo = [`none`, `category`, `channel`, `kind`, `agent`, `date`]),
      (No = [`today`, `yesterday`, `week`, `older`, ``]));
  });
function Fo(e) {
  return e.status && e.status !== `running`
    ? !1
    : typeof e.hasActiveRun == `boolean`
      ? e.hasActiveRun
      : e.status === `running`;
}
var Io = e(() => {});
function Lo(e = ``, t) {
  let n = e.trim(),
    r = n && n.toLowerCase() !== `unknown` ? n : void 0;
  return {
    ...(t?.trim() ? { agentId: t.trim() } : {}),
    ...(r ? { parentSessionKey: r, emitCommandHooks: !0 } : {}),
  };
}
async function Ro(e, t = {}) {
  let n = await e.request(`sessions.create`, t),
    r = typeof n?.key == `string` ? n.key.trim() : ``;
  if (!r) throw Error(`sessions.create returned no key`);
  return n.runStarted === !0
    ? { key: r, initialRun: { status: `started` } }
    : n.runError === void 0
      ? { key: r, initialRun: { status: `idle` } }
      : {
          key: r,
          initialRun: {
            status: `rejected`,
            error:
              (typeof n.runError?.message == `string` ? n.runError.message.trim() : ``) ||
              `The session was created, but its first message could not be sent.`,
          },
        };
}
var zo = e(() => {});
function Bo(e) {
  let t = e.hello?.snapshot;
  if (!t || typeof t != `object` || !(`sessionDefaults` in t)) return;
  let n = t.sessionDefaults;
  return n && typeof n == `object` ? n : void 0;
}
function Vo(e, t) {
  let n = T(e) ?? ``,
    r = Bo({ hello: t }),
    i = T(r?.mainSessionKey);
  if (!i) return n;
  if (!n) return i;
  let a = ce(r?.mainKey) ?? `main`,
    o = T(r?.defaultAgentId);
  return n === `main` || n === a || (o && (n === `agent:${o}:main` || n === `agent:${o}:${a}`))
    ? i
    : n;
}
function Ho(e, t) {
  return j(t) ? Qa(e) : (eo(e, t) ?? void 0);
}
function Uo(e, t) {
  let n = j(t) ? Qa(e) : eo(e, t);
  return n ? { agentId: M(n) } : {};
}
function Wo(e, t) {
  let n = A(t),
    r = p(t),
    i = n?.agentId ?? (r === `global` ? Qa(e) : r === `unknown` ? void 0 : Za(e));
  return i ? { agentId: M(i) } : {};
}
function Go(e, t) {
  let n = T(t.agentId) ?? Wo(e, t.sessionKey).agentId;
  return n ? { agentId: n } : {};
}
function Ko(e, t, n) {
  let r = j(e.sessionKey) ? Qa(e) : void 0,
    i = qo(e, e.sessionKey, r),
    a = qo(e, t, n);
  return (
    i !== null &&
    a !== null &&
    i.conversationKey === a.conversationKey &&
    i.ownerAgentId === a.ownerAgentId
  );
}
function qo(e, t, n) {
  let r = p(t);
  if (!r) return null;
  let i = A(t),
    a = eo(e, t),
    o = j(t),
    s = !i && (r === `main` || r === Xa(e)),
    c = o || s || a !== null,
    l = T(n),
    u = l ? M(l) : void 0,
    d = i ? M(i.agentId) : o ? (u ?? Za(e)) : Za(e);
  return !o && u && u !== d ? null : { conversationKey: c ? `global` : Ja(t), ownerAgentId: d };
}
function Jo(e, t) {
  let n = e.sessions.filter((e) => e.key && (e.archived === !0) === t.showArchived);
  return { ...e, count: n.length, sessions: n };
}
function Yo(e, t) {
  return e.filter((e) =>
    e.key === t.currentSessionKey
      ? !0
      : !e.archived &&
        e.kind !== `global` &&
        e.kind !== `unknown` &&
        (t.showCron === !0 || (e.kind !== `cron` && !_a(e.key))) &&
        !go(e.key) &&
        !e.spawnedBy &&
        (!t.filterByAgent || ho(e.key, t.agentId, t.defaultAgentId)),
  );
}
function Xo(e, t) {
  return Yo(e?.sessions ?? [], t);
}
function Zo(e, t) {
  let n = Number(t.pinned === !0) - Number(e.pinned === !0);
  if (n !== 0) return n;
  let r = (t.pinnedAt ?? 0) - (e.pinnedAt ?? 0);
  return r === 0 ? (t.updatedAt ?? 0) - (e.updatedAt ?? 0) : r;
}
function Qo(e) {
  let t = Vo(e.sessionKey, e.hello),
    n = $a({ assistantAgentId: e.assistantAgentId, hello: e.hello }),
    r = A(t)?.agentId ?? n,
    i = t.toLowerCase() !== `unknown`,
    a = T(e.resultAgentId) !== void 0 && M(e.resultAgentId) === M(r),
    o = (n) => fo(n.key, t) || (a && co(e, n.key, t)),
    s = e.result?.sessions.find(o),
    c =
      t && t.toLowerCase() !== `unknown` && !Oa(t)
        ? { ...(s ?? { kind: `direct`, updatedAt: null }), key: t }
        : void 0,
    l = Xo(e.result, {
      currentSessionKey: t || void 0,
      agentId: r,
      defaultAgentId: n,
      filterByAgent: i,
      showCron: e.showCron,
    }).toSorted(e.compareSessions ?? Zo),
    u = l,
    d = u.find(o);
  return (
    !d && c && ((d = l.find(o) ?? c), (u = [d, ...u.filter((e) => e !== d)])),
    {
      currentSessionKey: t,
      selectedAgentId: r,
      defaultAgentId: n,
      selectedSession: c,
      visibleSessions: u,
      activeRowKey: d?.key ?? null,
    }
  );
}
function $o(e) {
  return `?session=${encodeURIComponent(e)}`;
}
var es = e(() => {
  (wa(), D(), Ma(), Co());
});
function ts(e) {
  let t = {};
  for (let [n, r] of Object.entries(e))
    r !== void 0 &&
      ((n === `totalTokensFresh` && r === !1 && e.totalTokens === void 0) || (t[n] = r));
  return t;
}
function ns(e) {
  return !!(
    (typeof e.sessionId == `string` && e.sessionId.trim()) ||
    typeof e.updatedAt == `number`
  );
}
function rs(e, t) {
  let n = e.agentRuntime?.id?.trim(),
    r = t.agentRuntime?.id?.trim();
  return !(
    (e.modelProvider && t.modelProvider && e.modelProvider !== t.modelProvider) ||
    (e.model && t.model && e.model !== t.model) ||
    (n && r && n !== r)
  );
}
function is(e, t) {
  if (t && !rs(e, t)) return e;
  let n = t?.thinkingLevels;
  return !n?.length || (e.thinkingLevels?.length ?? 0) >= n.length
    ? e
    : {
        ...e,
        thinkingLevels: n,
        ...(t?.thinkingOptions ? { thinkingOptions: t.thinkingOptions } : {}),
        ...(e.thinkingDefault === void 0 && t?.thinkingDefault !== void 0
          ? { thinkingDefault: t.thinkingDefault }
          : {}),
      };
}
function as(e) {
  let t = { ...e };
  return (delete t.thinkingLevels, delete t.thinkingOptions, delete t.thinkingDefault, t);
}
function os(e, t) {
  return (
    typeof e.updatedAt == `number` && typeof t?.updatedAt == `number` && e.updatedAt < t.updatedAt
  );
}
function ss(e, t) {
  if (!t || !Fo(t) || Fo(e)) return !1;
  let n = e.updatedAt ?? 0;
  return (t.updatedAt ?? 0) >= n || (typeof t.startedAt == `number` && t.startedAt >= n);
}
function cs(e, t, n) {
  if (fo(e.key, t.key)) return !0;
  if (!j(t.key) || e.kind !== `global`) return !1;
  let r = A(e.key);
  return r?.agentId !== void 0 && M(r.agentId) === M(n ?? ``);
}
function ls(e, t) {
  let n = A(e.key);
  return n?.agentId ? M(n.agentId) : e.kind === `global` && t?.trim() ? M(t) : null;
}
function N(e, t) {
  return Object.hasOwn(e, t) ? e[t] : void 0;
}
function P(e) {
  return typeof e == `string` && e.trim() ? e.trim() : void 0;
}
function us(e) {
  return e === `running` || e === `done` || e === `failed` || e === `killed` || e === `timeout`
    ? e
    : null;
}
function ds(e) {
  let t = he(e);
  if (!t) return null;
  let n = he(t.session) ?? t,
    r = P(N(n, `key`)) ?? P(N(t, `sessionKey`));
  if (!r) return null;
  let i = P(N(t, `reason`)) ?? P(N(n, `reason`)) ?? null,
    a = P(N(t, `phase`)) ?? P(N(n, `phase`)),
    o =
      typeof N(n, `hasActiveRun`) == `boolean`
        ? N(n, `hasActiveRun`)
        : typeof N(t, `hasActiveRun`) == `boolean`
          ? N(t, `hasActiveRun`)
          : null;
  return {
    event: t,
    source: n,
    key: r,
    reason: i,
    agentId: P(N(t, `agentId`)) ?? null,
    runId: P(N(t, `runId`)) ?? P(N(n, `runId`)) ?? null,
    clientRunId: P(N(t, `clientRunId`)) ?? P(N(n, `clientRunId`)) ?? null,
    hasActiveRun: o,
    status: us(N(n, `status`)) ?? us(N(t, `status`)),
    archived: typeof N(n, `archived`) == `boolean` ? N(n, `archived`) : null,
    isChatTurn:
      a === `start` ||
      a === `message` ||
      a === `end` ||
      a === `error` ||
      i === `send` ||
      i === `steer`,
  };
}
function fs(e) {
  let t = ds(e);
  return t
    ? {
        key: t.key,
        agentId: t.agentId,
        runId: t.runId,
        clientRunId: t.clientRunId,
        hasActiveRun: t.hasActiveRun,
        status: t.status,
        archived: t.archived,
        isChatTurn: t.isChatTurn,
      }
    : null;
}
function ps(e, t, n = {}) {
  let r = ds(t);
  if (!r) return { applied: !1, result: e };
  let { event: i, source: a, key: o, reason: s } = r;
  if (s === `delete` && !e)
    return { applied: !0, key: o, agentId: r.agentId, deletedKey: o, result: e };
  if (!e) return { applied: !1, result: e };
  let c = r.agentId ?? n.selectedGlobalAgentId ?? null,
    l = e.sessions.find((e) => cs(e, { key: o, kind: `global`, updatedAt: null }, c));
  if (s === `delete`) {
    if (!l) return { applied: !0, result: e, key: o, agentId: r.agentId, deletedKey: o };
    let t = e.sessions.filter((e) => e !== l);
    return {
      applied: !0,
      key: o,
      agentId: r.agentId,
      result: { ...e, count: t.length, sessions: t },
      deletedKey: l.key,
    };
  }
  let {
      agentId: u,
      clientRunId: d,
      compacted: f,
      key: p,
      phase: m,
      reason: h,
      runId: g,
      session: _,
      sessionKey: ee,
      ts: te,
      ...v
    } = a,
    ne =
      v.kind === `cron` ||
      v.kind === `direct` ||
      v.kind === `group` ||
      v.kind === `global` ||
      v.kind === `unknown`
        ? v.kind
        : l?.kind,
    y = typeof v.updatedAt == `number` ? v.updatedAt : l?.updatedAt,
    re = P(v.sessionId) ?? l?.sessionId;
  if (!ne || (!l && re === void 0 && typeof y != `number`)) return { applied: !1, result: e };
  let ie = he(v.agentRuntime),
    ae = {
      modelProvider: P(v.modelProvider),
      model: P(v.model),
      ...(ie ? { agentRuntime: { id: P(ie.id) ?? `` } } : {}),
    },
    b = {
      ...(l && !rs(ae, l) ? as(l) : l),
      ...v,
      key: l?.key ?? o,
      kind: ne,
      updatedAt: y ?? null,
      ...(re ? { sessionId: re } : {}),
    };
  (v.archivedAt === null && delete b.archivedAt,
    v.pinnedAt === null && delete b.pinnedAt,
    v.label === null && delete b.label,
    v.category === null && delete b.category,
    v.displayName === null && delete b.displayName,
    v.thinkingLevel === null && delete b.thinkingLevel);
  let x = ms(e, b, void 0, { ...n, selectedGlobalAgentId: c });
  if (!x) return { applied: !1, result: e };
  let S = typeof i.ts == `number` && Number.isFinite(i.ts) ? i.ts : null,
    C = S === null ? x : { ...x, ts: Math.max(x.ts, S) },
    oe = C.sessions.find((e) => cs(e, { key: o, kind: `global`, updatedAt: null }, c));
  return {
    applied: !0,
    key: o,
    agentId: r.agentId,
    runId: r.runId,
    clientRunId: r.clientRunId,
    hasActiveRun: r.hasActiveRun,
    status: r.status,
    isChatTurn: r.isChatTurn,
    row: oe,
    result: C,
  };
}
function ms(e, t, n, r = {}) {
  if (!t?.key) return e;
  let i = ts(t),
    a = r.showArchived === !0,
    o = r.selectedGlobalAgentId ?? null,
    s = r.resultAgentId?.trim() ? M(r.resultAgentId) : null,
    c = ls(i, o),
    l = s !== null && c !== null && c !== s;
  if (!e) {
    if ((!ns(i) || l) && !n) return null;
    let e = ns(i) && !l && (i.archived === !0) === a ? [i] : [];
    return {
      ts: Date.now(),
      path: ``,
      count: e.length,
      defaults: n ?? { modelProvider: null, model: null, contextTokens: null },
      sessions: e,
    };
  }
  let u = e.sessions.find((e) => cs(e, i, o));
  if (os(i, u)) return e;
  let d = n ? is(n, e.defaults) : e.defaults;
  if (l || (!u && !ns(i))) return n ? { ...e, defaults: d } : e;
  let f = u?.key ?? i.key,
    p = is(f === i.key ? i : { ...i, key: f }, u);
  if (ss(p, u)) return { ...e, defaults: d };
  let m =
    (p.archived === !0) === a
      ? [...e.sessions.filter((e) => e.key !== f), p].toSorted(Zo)
      : e.sessions.filter((e) => e.key !== f);
  return { ...e, defaults: d, count: m.length, sessions: m };
}
var hs = e(() => {
  (S(), Io(), es(), Co());
});
function gs(e) {
  let t = -e,
    n = t >= 0 ? `+` : `-`,
    r = Math.abs(t),
    i = Math.floor(r / 60),
    a = r % 60;
  return a === 0 ? `UTC${n}${i}` : `UTC${n}${i}:${a.toString().padStart(2, `0`)}`;
}
function _s(e) {
  return e === `utc`
    ? { mode: `utc` }
    : {
        mode: `specific`,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        utcOffset: gs(new Date().getTimezoneOffset()),
      };
}
function vs(e) {
  return {
    startDate: e.startDate,
    endDate: e.endDate,
    ...(e.agentId ? { agentId: e.agentId } : { agentScope: `all` }),
    ..._s(e.timeZone),
    groupBy: e.scope,
    includeHistorical: e.scope === `family`,
    limit: 1e3,
    includeContextWeight: !0,
  };
}
function ys(e, t) {
  return (
    typeof t.timeZone == `string` &&
    typeof t.utcOffset == `string` &&
    e instanceof Ie &&
    e.gatewayCode === `INVALID_REQUEST` &&
    e.message.includes(`invalid sessions.usage params:`) &&
    e.message.includes(`unexpected property 'timeZone'`)
  );
}
async function bs(e, t) {
  try {
    return await e.request(`sessions.usage`, t);
  } catch (n) {
    if (!ys(n, t)) throw n;
    let r = { ...t };
    return (delete r.timeZone, await e.request(`sessions.usage`, r));
  }
}
function xs(e, t) {
  return bs(e, vs(t));
}
function Ss(e, t) {
  return e.request(`sessions.usage.timeseries`, { key: t }).then((e) => e ?? null);
}
function Cs(e, t) {
  return e.request(`sessions.usage.logs`, { key: t, limit: 1e3 });
}
var ws = e(() => {
  Be();
});
function F(e, t) {
  let n = e.trim(),
    r = t?.trim();
  return { key: n, ...(r ? { agentId: r } : {}) };
}
function Ts(e = {}) {
  let t = { ...Ks };
  (e.limit === void 0 ? (t.limit = 50) : e.limit > 0 && (t.limit = Math.floor(e.limit)),
    e.includeGlobal !== void 0 && (t.includeGlobal = e.includeGlobal),
    e.includeUnknown !== void 0 && (t.includeUnknown = e.includeUnknown),
    e.configuredAgentsOnly !== void 0 && (t.configuredAgentsOnly = e.configuredAgentsOnly),
    e.showArchived === !0 && (t.archived = !0));
  let n =
    e.showArchived === !0
      ? 0
      : typeof e.activeMinutes == `number` && e.activeMinutes > 0
        ? Math.floor(e.activeMinutes)
        : 0;
  n > 0 && (t.activeMinutes = n);
  let r = e.agentId?.trim(),
    i = e.search?.trim();
  return (
    r && (t.agentId = r),
    i && (t.search = i),
    typeof e.offset == `number` && e.offset > 0 && (t.offset = Math.floor(e.offset)),
    t
  );
}
async function Es(e, t = {}) {
  return (await e.request(`sessions.list`, Ts(t))) ?? null;
}
function Ds(e, t, n, r = {}) {
  return e.request(`sessions.patch`, { ...F(t, r.agentId), ...n });
}
function Os(e, t, n = {}) {
  return e.request(`sessions.delete`, {
    ...F(t, n.agentId),
    deleteTranscript: n.deleteTranscript ?? !0,
  });
}
function ks(e) {
  return e.deleted;
}
function As(e, t, n = {}) {
  return e.request(`sessions.reset`, { ...F(t, n.agentId) }).then(() => void 0);
}
function js(e, t, n = {}) {
  return e.request(`sessions.compact`, { ...F(t, n.agentId) });
}
function Ms(e, t, n, r = {}) {
  return e.request(`sessions.steer`, { ...F(t, r.agentId), message: n });
}
function Ns(e, t, n = {}) {
  return e.request(`sessions.files.list`, {
    sessionKey: t,
    path: n.path ?? ``,
    search: n.search ?? ``,
    ...(n.agentId?.trim() ? { agentId: n.agentId.trim() } : {}),
  });
}
function Ps(e, t, n, r = {}) {
  return e.request(`sessions.files.get`, {
    sessionKey: t,
    path: n,
    ...(r.agentId?.trim() ? { agentId: r.agentId.trim() } : {}),
  });
}
function Fs(e, t, n, r, i) {
  return e.request(`sessions.files.set`, {
    sessionKey: t,
    path: n,
    content: r,
    expectedHash: i.expectedHash,
    ...(i.agentId?.trim() ? { agentId: i.agentId.trim() } : {}),
  });
}
function Is(e) {
  return e.request(`sessions.subscribe`, {}).then(() => void 0);
}
async function Ls(e, t, n = {}) {
  let r = await e.request(`sessions.messages.subscribe`, { ...F(t, n.agentId) });
  return {
    key: (r && typeof r == `object` && typeof r.key == `string` ? r.key.trim() : ``) || t.trim(),
    agentId: n.agentId?.trim() || null,
  };
}
function Rs(e, t) {
  return e.request(`sessions.messages.unsubscribe`, F(t.key, t.agentId)).then(() => void 0);
}
async function zs(e, t, n = {}) {
  return e.request(`sessions.compaction.list`, F(t, n.agentId));
}
function Bs(e, t, n, r = {}) {
  return e.request(`sessions.compaction.branch`, { ...F(t, r.agentId), checkpointId: n });
}
function Vs(e, t, n, r = {}) {
  return e.request(`sessions.compaction.restore`, { ...F(t, r.agentId), checkpointId: n });
}
function Hs(e, t) {
  let n = new Set(),
    r = [...e.sessions, ...t.sessions].filter((e) =>
      !e.key || n.has(e.key) ? !1 : (n.add(e.key), !0),
    ),
    i = t.totalCount ?? e.totalCount,
    a = t.hasMore ?? (typeof i == `number` && Number.isFinite(i) ? r.length < i : !1);
  return {
    ...t,
    count: r.length,
    totalCount: i,
    hasMore: a,
    nextOffset: t.nextOffset ?? (a ? r.length : null),
    sessions: r,
  };
}
function Us(e) {
  return e.event === `sessions.changed` || e.event === `session.message`;
}
function Ws(e, t) {
  let n = t.sessionKeys.map((e) => e.trim()).filter(Boolean);
  if (!e || n.length === 0) return e;
  let r = t.runId?.trim() || null,
    i = !1,
    a = e.sessions.map((e) => {
      if (
        !n.some((t) => fo(e.key, t)) ||
        ((e.hasActiveRun === !0 || Fo(e)) && (!r || !e.activeRunIds?.includes(r)))
      )
        return e;
      let a = r ? e.activeRunIds?.filter((e) => e !== r) : [];
      if (a?.length)
        return ((i = !0), { ...e, activeRunIds: a, hasActiveRun: !0, status: `running` });
      let o = e.endedAt ?? t.endedAt,
        s = typeof e.startedAt == `number` ? Math.max(0, o - e.startedAt) : e.runtimeMs,
        c = e.activeRunIds?.length ? [] : e.activeRunIds,
        l = t.status === `killed` ? !0 : e.abortedLastRun;
      return e.hasActiveRun === !1 &&
        e.status === t.status &&
        e.endedAt === o &&
        e.runtimeMs === s &&
        e.activeRunIds === c &&
        e.abortedLastRun === l
        ? e
        : ((i = !0),
          {
            ...e,
            activeRunIds: c,
            hasActiveRun: !1,
            status: t.status,
            endedAt: o,
            runtimeMs: s,
            abortedLastRun: l,
          });
    });
  return i ? { ...e, sessions: a } : e;
}
function Gs(e) {
  let t = {
      result: null,
      agentId: null,
      modelOverrides: {},
      loading: !1,
      error: null,
      deletedSessions: [],
      groups: [],
    },
    n = null,
    r = null,
    i = 0,
    a = !1,
    o = 0,
    s = e.snapshot.client,
    c = e.snapshot.connected,
    l = new Map(),
    u = null,
    d = {},
    f = new Set(),
    p = new Set(),
    m = () => {
      let t = e.snapshot;
      return !a && t.connected && t.client ? { client: t.client, epoch: o } : null;
    },
    h = (t) => {
      let n = e.snapshot;
      return !a && o === t.epoch && n.connected && n.client === t.client;
    },
    g = async (e = {}) => {
      let t = m();
      if (!t) return null;
      let n = await Es(t.client, e);
      return h(t) ? (n ?? null) : null;
    },
    _ = (e) => {
      t = e;
      for (let e of f) e(t);
    },
    ee = (e, n) => {
      let r = e.trim();
      if (!r) return;
      let i = { ...t.modelOverrides };
      if (n === void 0) {
        if (!Object.hasOwn(t.modelOverrides, r)) return;
        delete i[r];
      } else {
        let e = n === null ? null : n.trim();
        if (i[r] === e && Object.hasOwn(i, r)) return;
        i[r] = e;
      }
      _({ ...t, modelOverrides: i });
    },
    te = () => {
      let e = [...l];
      l.clear();
      for (let [t, n] of e) ee(t, n.previous);
    },
    v = async (n) => {
      let r = m();
      if (!r) return;
      let { append: a = !1, force: o, backgroundHydrate: s = !1, ...c } = n;
      ((d = c), s || _({ ...t, loading: !0, error: null, deletedSessions: [] }));
      try {
        let n = await Es(r.client, c);
        if (!h(r)) return;
        let o = n && a && c.offset && t.result ? Hs(t.result, n) : n;
        if (s && o) {
          let n = e.snapshot.sessionKey?.trim();
          if (n) {
            let r = M(A(n)?.agentId ?? $a(e.snapshot)),
              i =
                t.result?.sessions.find((e) => fo(e.key, n)) ??
                (t.agentId === r
                  ? t.result?.sessions.find((t) => co(e.snapshot, t.key, n))
                  : void 0);
            if (i && !o.sessions.some((t) => co(e.snapshot, t.key, n))) {
              let e = [...o.sessions, i];
              o = { ...o, count: e.length, sessions: e };
            }
          }
        }
        ((i += 1),
          _({
            result: o,
            agentId: c.agentId?.trim() ? M(c.agentId) : null,
            modelOverrides: t.modelOverrides,
            loading: s ? t.loading : !1,
            error: null,
            deletedSessions: [],
            groups: t.groups,
          }));
      } catch (e) {
        h(r) && _({ ...t, loading: s ? t.loading : !1, error: String(e), deletedSessions: [] });
      }
    },
    ne = async (e) => {
      let t = o,
        n = e;
      for (; n;) {
        if ((await v(n), a || o !== t)) return;
        ((n = r), (r = null));
      }
    },
    y = (i = {}) => {
      if (!e.snapshot.connected || !e.snapshot.client || a) return Promise.resolve();
      if (n) return ((r = i), n);
      let o = Object.entries(i).some(
        ([e, t]) => e !== `force` && e !== `backgroundHydrate` && t !== void 0,
      );
      if (t.result && !i.force && !o) return Promise.resolve();
      let s = ne(i).finally(() => {
        n === s && (n = null);
      });
      return ((n = s), s);
    },
    re = async (e = {}) => {
      let n = m();
      if (!n) return null;
      try {
        let { currentSessionKey: t, ...r } = e,
          i = await Ro(n.client, { ...r, ...Lo(t, e.agentId) });
        if (!h(n) || (await y({ agentId: e.agentId, force: !0 }), !h(n))) return null;
        for (let e of p) e(i.key);
        return i;
      } catch (e) {
        return (h(n) && _({ ...t, error: String(e) }), null);
      }
    },
    ie = async (e = {}) => (await re(e))?.key ?? null,
    ae = `openclaw:sessions:custom-groups`,
    b = `sessions.groups.list`,
    x = -1,
    S = 0,
    C = null,
    oe = () => {
      C !== null && (globalThis.clearTimeout(C), (C = null));
    },
    se = () => {
      ((x = -1), (S += 1), oe());
    },
    ce = (e) => {
      if (!(e instanceof Ie) || !e.retryable) return null;
      let t =
        typeof e.retryAfterMs == `number` && Number.isFinite(e.retryAfterMs) ? e.retryAfterMs : 500;
      return Math.min(Math.max(t, 100), 3e4);
    },
    le = (e) => {
      (e.length === t.groups.length && e.every((e, n) => e === t.groups[n])) ||
        _({ ...t, groups: [...e] });
    },
    ue = (e, n) => {
      if (!e) return `stale`;
      throw (_({ ...t, error: String(n) }), n);
    },
    de = () => {
      try {
        let e = et()?.getItem(ae),
          t = e ? JSON.parse(e) : [];
        return Array.isArray(t)
          ? [
              ...new Set(
                t.flatMap((e) => {
                  let t = typeof e == `string` ? e.trim() : ``;
                  return t ? [t] : [];
                }),
              ),
            ]
          : [];
      } catch {
        return [];
      }
    },
    fe = async (e, t, n) => {
      try {
        let n = await e.client.request(b, {});
        if (!h(e) || t !== S) return;
        let r = Fa(n),
          i = de();
        if (r.length === 0 && i.length > 0) {
          let n = await e.client.request(`sessions.groups.put`, { names: i });
          if (!h(e) || t !== S) return;
          r = Fa(n);
        }
        if (i.length > 0)
          try {
            et()?.removeItem(ae);
          } catch {}
        le(r);
      } catch (r) {
        if (!h(e) || t !== S || n !== !0) return;
        x = -1;
        let i = ce(r);
        if (i === null) return;
        C = globalThis.setTimeout(() => {
          ((C = null), h(e) && t === S && pe());
        }, i);
      }
    },
    pe = async () => {
      let t = m();
      if (!t || x === t.epoch) return;
      let n = Ae(e.snapshot, b);
      oe();
      let r = ++S;
      if (((x = t.epoch), n === !1)) {
        le([]);
        return;
      }
      await fe(t, r, n);
    },
    me = async (e) => {
      let t = m();
      if (!t) return `stale`;
      try {
        let n = await t.client.request(`sessions.groups.put`, { names: [...e] });
        return h(t) ? (le(Fa(n)), `completed`) : `stale`;
      } catch (e) {
        return ue(h(t), e);
      }
    },
    w = async (e, t) => {
      let n = m();
      if (!n) return `stale`;
      try {
        let r = await n.client.request(`sessions.groups.rename`, { name: e, to: t });
        return h(n) ? (le(Fa(r)), y({ ...d, force: !0 }), `completed`) : `stale`;
      } catch (e) {
        return ue(h(n), e);
      }
    },
    he = async (e) => {
      let t = m();
      if (!t) return `stale`;
      try {
        let n = await t.client.request(`sessions.groups.delete`, { name: e });
        return h(t) ? (le(Fa(n)), y({ ...d, force: !0 }), `completed`) : `stale`;
      } catch (e) {
        return ue(h(t), e);
      }
    },
    ge = async (e, n, r = {}) => {
      let i = m();
      if (!i) return null;
      let a = Object.hasOwn(n, `model`),
        o = e.trim(),
        s = l.get(o),
        c = s ? s.previous : t.modelOverrides[o],
        u = Symbol();
      a && (l.set(o, { token: u, previous: c }), ee(e, n.model));
      let d = () => {
        l.get(o)?.token === u && (l.delete(o), ee(e, c));
      };
      try {
        if (r.waitFor && (await r.waitFor, !h(i))) return (d(), null);
        let t = await Ds(i.client, e, n, r);
        return !h(i) || (await y({ agentId: r.agentId, force: !0 }), !h(i))
          ? (d(), null)
          : (l.get(o)?.token === u && (l.delete(o), ee(e, n.model)), t);
      } catch (e) {
        if ((d(), !h(i))) return null;
        throw (_({ ...t, error: String(e) }), e);
      }
    },
    _e = (e, n, r) => {
      let i = ms(t.result, e, n, r);
      return i === t.result
        ? !1
        : (_({
            ...t,
            result: i,
            agentId: r?.resultAgentId?.trim() ? M(r.resultAgentId) : t.agentId,
          }),
          !0);
    },
    ve = (e, n) => {
      let r = ps(t.result, e, n);
      return (
        r.applied &&
          (r.result !== t.result || r.deletedKey) &&
          _({
            ...t,
            result: r.result,
            agentId: n?.resultAgentId?.trim() ? M(n.resultAgentId) : t.agentId,
            error: null,
            deletedSessions: r.deletedKey
              ? [{ key: r.deletedKey, agentId: r.agentId ?? void 0 }]
              : [],
          }),
        r
      );
    },
    ye = (e) => {
      let n = Ws(t.result, e);
      return n === t.result ? !1 : (_({ ...t, result: n, error: null }), !0);
    },
    be = async (e, n = {}) => {
      let r = m();
      if (!r) return { deleted: !1 };
      try {
        let i = await Os(r.client, e, n);
        return !h(r) || !ks(i)
          ? { deleted: !1 }
          : (_({ ...t, deletedSessions: [{ key: e, agentId: n.agentId }] }),
            ee(e, void 0),
            await y({ agentId: n.agentId, force: !0 }),
            {
              deleted: h(r),
              ...(i.worktreePreserved ? { worktreePreserved: i.worktreePreserved } : {}),
            });
      } catch (e) {
        if (!h(r)) return { deleted: !1 };
        throw (_({ ...t, error: String(e) }), e);
      }
    },
    xe = async (e) => {
      let n = m();
      if (!n || e.length === 0) return { deleted: [], errors: [], preservedWorktrees: [] };
      let r = [],
        i = [],
        a = [];
      for (let t of e) {
        if (!h(n)) break;
        try {
          let e = await Os(n.client, t.key, t);
          if (!h(n)) break;
          if (!ks(e)) continue;
          (r.push(t.key), e.worktreePreserved && a.push(e.worktreePreserved));
        } catch (e) {
          i.push(String(e));
        }
      }
      if (r.length > 0 && h(n)) {
        _({ ...t, deletedSessions: e.filter((e) => r.includes(e.key)) });
        for (let e of r) ee(e, void 0);
        await y({ force: !0 });
      }
      return h(n)
        ? { deleted: r, errors: i, preservedWorktrees: a }
        : { deleted: [], errors: [], preservedWorktrees: [] };
    },
    T = async (e, n = {}) => {
      let r = m();
      if (!r) return `not-started`;
      try {
        return (await As(r.client, e, n), h(r) ? `completed` : `uncertain`);
      } catch (e) {
        return (h(r) && _({ ...t, error: String(e) }), `uncertain`);
      }
    },
    Se = async (e, t = {}) => {
      let n = m();
      if (!n) throw Error(`Session compaction requires an active Gateway connection`);
      let r = await js(n.client, e, t);
      if (!h(n)) throw Error(`Session compaction completed on a replaced Gateway connection`);
      return r;
    },
    Ce = async (e, t, n = {}) => {
      let r = m();
      if (!r) throw Error(`Session steering requires an active Gateway connection`);
      let i = await Ms(r.client, e, t, n);
      if (!h(r)) throw Error(`Session steering completed on a replaced Gateway connection`);
      return i;
    },
    we = async (e, t = {}) => {
      let n = m();
      if (!n) return null;
      let r = await Ns(n.client, e, t);
      return h(n) ? r : null;
    },
    Te = async (e, t, n = {}) => {
      let r = m();
      if (!r) return null;
      let i = await Ps(r.client, e, t, n);
      return h(r) ? i : null;
    },
    Ee = async (e, t, n, r) => {
      let i = m();
      if (!i) return null;
      let a = await Fs(i.client, e, t, n, r);
      return h(i) ? a : null;
    },
    De = async (e, t = {}) => {
      let n = m();
      if (!n) throw Error(`Session message subscription requires an active Gateway connection`);
      let r = await Ls(n.client, e, t);
      if (!h(n))
        throw Error(`Session message subscription completed on a replaced Gateway connection`);
      return r;
    },
    Oe = async (e) => {
      let t = m();
      t && (await Rs(t.client, e));
    },
    ke = async (e, t = {}) => {
      let n = m();
      if (!n) return [];
      let r = await zs(n.client, e, t);
      return h(n) ? (r.checkpoints ?? []) : [];
    },
    je = async (e, n, r = {}) => {
      let i = m();
      if (!i) throw Error(`Session checkpoint operation requires an active Gateway connection`);
      let a = await Bs(i.client, e, n, r);
      if (!h(i) || (await y({ agentId: r.agentId ?? t.agentId ?? void 0, force: !0 }), !h(i)))
        throw Error(`Session checkpoint operation completed on a replaced Gateway connection`);
      return a;
    },
    Me = async (e, n, r = {}) => {
      let i = m();
      if (!i) throw Error(`Session checkpoint operation requires an active Gateway connection`);
      let a = await Vs(i.client, e, n, r);
      if (!h(i) || (await y({ agentId: r.agentId ?? t.agentId ?? void 0, force: !0 }), !h(i)))
        throw Error(`Session checkpoint operation completed on a replaced Gateway connection`);
      return a;
    },
    Ne = e.subscribe((i) => {
      let a = i.client !== s || i.connected !== c;
      if (
        ((s = i.client),
        (c = i.connected),
        a && ((o += 1), se(), (n = null), (r = null), te()),
        !i.connected || !i.client)
      ) {
        ((u = null),
          _({
            result: null,
            agentId: null,
            modelOverrides: t.modelOverrides,
            loading: !1,
            error: null,
            deletedSessions: [],
            groups: t.groups,
          }));
        return;
      }
      if (u !== i.client) {
        let n = m();
        if (!n) return;
        ((u = n.client),
          (async () => {
            try {
              await Is(n.client);
            } catch (e) {
              h(n) && _({ ...t, error: String(e) });
            } finally {
              if (h(n)) {
                let t = e.snapshot.sessionKey?.trim();
                await y({ ...(t ? Wo(e.snapshot, t) : {}), backgroundHydrate: !0, force: !0 });
              }
            }
          })());
        return;
      }
      y();
    }),
    Pe = e.subscribeEvents((e) => {
      if (Us(e)) {
        let n = ps(t.result, e.payload, { resultAgentId: t.agentId, showArchived: d.showArchived }),
          r = fs(e.payload);
        e.payload?.reason === `groups` && (se(), pe());
        let i = n.hasActiveRun ?? r?.hasActiveRun,
          a = n.status ?? r?.status,
          o = i === !1 || (a != null && a !== `running`);
        if (e.event === `session.message` && !o) return;
        (n.deletedKey &&
          _({ ...t, deletedSessions: [{ key: n.deletedKey, agentId: n.agentId ?? void 0 }] }),
          y({ ...d, force: !0 }));
      }
    });
  return {
    get state() {
      return t;
    },
    get canonicalListRevision() {
      return i;
    },
    list: g,
    reconcile: _e,
    reconcileChanged: ve,
    reconcileRunTerminal: ye,
    refresh: y,
    createResult: re,
    create: ie,
    patch: ge,
    setModelOverride: ee,
    delete: be,
    deleteMany: xe,
    reset: T,
    compact: Se,
    steer: Ce,
    listFiles: we,
    getFile: Te,
    setFile: Ee,
    subscribeMessages: De,
    unsubscribeMessages: Oe,
    listCheckpoints: ke,
    branchCheckpoint: je,
    restoreCheckpoint: Me,
    groupsLoad: pe,
    groupsPut: me,
    groupsRename: w,
    groupsDelete: he,
    subscribeCreated(e) {
      return (p.add(e), () => p.delete(e));
    },
    subscribe(e) {
      return (f.add(e), () => f.delete(e));
    },
    dispose() {
      ((a = !0),
        (o += 1),
        se(),
        (c = !1),
        (n = null),
        (r = null),
        (u = null),
        l.clear(),
        Ne(),
        Pe(),
        p.clear(),
        f.clear());
    },
  };
}
var Ks,
  qs = e(() => {
    (Be(),
      nt(),
      Oe(),
      Io(),
      zo(),
      La(),
      es(),
      hs(),
      Co(),
      ws(),
      (Ks = { includeGlobal: !0, includeUnknown: !0, configuredAgentsOnly: !0 }));
  });
function Js(e) {
  let t = [],
    n = new Set(Ys);
  for (let r of (e ?? ``).split(/\s+/)) {
    let e = ce(r);
    !e || n.has(e) || (n.add(e), t.push(e));
  }
  return [...Ys, ...t].join(` `);
}
var Ys,
  Xs,
  Zs = e(() => {
    (D(), (Ys = [`noopener`, `noreferrer`]), (Xs = `_blank`));
  });
function Qs(e) {
  if (!p(e).startsWith(tc)) return !1;
  let t = e.indexOf(`,`);
  if (t < 5) return !1;
  let n = p(e.slice(5, t).split(`;`)[0]);
  return n.startsWith(`image/`) ? !rc.has(n) : !1;
}
function $s(e, t, n = {}) {
  let r = e.trim();
  if (!r) return null;
  if (n.allowDataImage === !0 && Qs(r)) return r;
  if (p(r).startsWith(tc)) return null;
  try {
    let e = new URL(r, t);
    return nc.has(p(e.protocol)) ? e.toString() : null;
  } catch {
    return null;
  }
}
function ec(e, t = {}) {
  let n = $s(e, t.baseHref ?? window.location.href, t);
  if (!n) return null;
  let r = window.open(n, `_blank`, `noopener,noreferrer`);
  return (r && (r.opener = null), r);
}
var tc,
  nc,
  rc,
  ic = e(() => {
    (D(),
      (tc = `data:`),
      (nc = new Set([`http:`, `https:`, `blob:`])),
      (rc = new Set([`image/svg+xml`])));
  });
function ac(e, t, n) {
  if (e || !t) return null;
  let r = ne(t);
  return r
    ? {
        kind:
          r.reason === `scope-upgrade`
            ? `scope-upgrade-pending`
            : r.reason === `role-upgrade`
              ? `role-upgrade-pending`
              : r.reason === `metadata-upgrade`
                ? `metadata-upgrade-pending`
                : `pairing-required`,
        requestId: r.requestId ?? null,
      }
    : n === _.PAIRING_REQUIRED
      ? { kind: `pairing-required`, requestId: null }
      : null;
}
function oc(e) {
  return e.connected || !e.lastError
    ? null
    : e.lastErrorCode
      ? lc.has(e.lastErrorCode)
        ? cc.has(e.lastErrorCode)
          ? `required`
          : `failed`
        : null
      : p(e.lastError).includes(`unauthorized`)
        ? !e.hasToken && !e.hasPassword
          ? `required`
          : `failed`
        : null;
}
function sc(e, t, n) {
  if (e || !t) return !1;
  if (n) return uc.has(n);
  let r = p(t);
  return r.includes(`secure context`) || r.includes(`device identity required`);
}
var cc,
  lc,
  uc,
  dc = e(() => {
    (pe(),
      D(),
      (cc = new Set([
        _.AUTH_REQUIRED,
        _.AUTH_TOKEN_MISSING,
        _.AUTH_PASSWORD_MISSING,
        _.AUTH_TOKEN_NOT_CONFIGURED,
        _.AUTH_PASSWORD_NOT_CONFIGURED,
      ])),
      (lc = new Set([
        ...cc,
        _.AUTH_UNAUTHORIZED,
        _.AUTH_TOKEN_MISMATCH,
        _.AUTH_PASSWORD_MISMATCH,
        _.AUTH_DEVICE_TOKEN_MISMATCH,
        _.AUTH_RATE_LIMITED,
        _.AUTH_TAILSCALE_IDENTITY_MISSING,
        _.AUTH_TAILSCALE_PROXY_MISSING,
        _.AUTH_TAILSCALE_WHOIS_FAILED,
        _.AUTH_TAILSCALE_IDENTITY_MISMATCH,
      ])),
      (uc = new Set([
        `BROWSER_WEBSOCKET_SECURITY_ERROR`,
        _.CONTROL_UI_DEVICE_IDENTITY_REQUIRED,
        _.DEVICE_IDENTITY_REQUIRED,
      ])));
  });
function fc(e) {
  return e.request(`plugins.list`, {});
}
function pc(e, t) {
  return e.request(`plugins.search`, { query: t, limit: 20 });
}
function mc(e, t) {
  return e.request(`plugins.install`, t);
}
function hc(e, t) {
  return e.request(`plugins.uninstall`, { pluginId: t });
}
function gc(e, t, n) {
  return e.request(`plugins.setEnabled`, { pluginId: t, enabled: n });
}
function _c(e) {
  if (e instanceof Ie) return ie(e.details);
}
function vc(e) {
  return _c(e)?.clawhubTrustCode === C.RISK_ACKNOWLEDGEMENT_REQUIRED;
}
var yc,
  bc = e(() => {
    (we(), Be(), (yc = `https://clawhub.ai/plugins`));
  });
function I(e, t, n) {
  return e.connected && e.client === t && e.skillOperation === n;
}
function xc(e, t) {
  e.skillOperation === t && (e.skillOperation = null);
}
function Sc(e, t, n) {
  t.trim() && (e.skillMessages = { ...e.skillMessages, [t]: n });
}
function Cc(e) {
  if (!(!e || typeof e != `object` || !(`details` in e))) return ie(e.details);
}
function wc(e, t) {
  return t ? `${e}\n\n${t}` : e;
}
function Tc(e) {
  return wc(`Review the ClawHub warning before installing this skill.`, e);
}
function Ec(e) {
  return `${e.registry}\0${e.slug}\0${e.version}`;
}
function Dc(e) {
  return !!(e && e.status === `linked` && e.valid);
}
function Oc(e) {
  return e.skills.some((e) => Dc(e.clawhub));
}
function kc(e) {
  if (!e.skillCard?.present) return;
  let t = e.clawhub?.status === `linked` && e.clawhub.valid ? e.clawhub.installedVersion : ``;
  return `${e.skillCard.path}\0${e.skillCard.sizeBytes}\0${t}`;
}
function Ac(e, t) {
  let n = e.skillsReport?.skills.find((e) => e.skillKey === t);
  return n ? kc(n) : void 0;
}
function jc(e) {
  let t = e?.trim();
  return t ? { agentId: t } : {};
}
function Mc(e) {
  let t = e.skillsAgentId?.trim();
  return t ? { agentId: t } : {};
}
async function Nc(e, t) {
  return e.request(`skills.status`, jc(t));
}
function Pc(e) {
  return { agentId: e.skillsAgentId, revision: e.skillsAgentRevision };
}
function L(e, t) {
  return e.skillsAgentId === t.agentId && e.skillsAgentRevision === t.revision;
}
async function Fc(e, t, n, r, i) {
  try {
    let r = await t();
    if (!e()) return;
    n(r);
  } catch (t) {
    if (!e()) return;
    r(t);
  }
  i();
}
function Ic(e, t) {
  ((e.clawhubSearchQuery = t),
    (e.clawhubInstallMessage = null),
    (e.clawhubSearchResults = null),
    (e.clawhubSearchError = null),
    (e.clawhubSearchLoading = !1));
}
function Lc(e, t) {
  let n = t?.trim() || null;
  e.skillsAgentId !== n &&
    ((e.skillsAgentId = n),
    e.skillsAgentRevision++,
    (e.skillsLoading = !1),
    (e.skillsReport = null),
    (e.skillsError = null),
    (e.skillEdits = {}),
    (e.skillMessages = {}),
    (e.clawhubInstallMessage = null),
    (e.clawhubVerdicts = {}),
    (e.clawhubVerdictsLoading = !1),
    (e.clawhubVerdictsError = null),
    (e.skillCardContents = {}),
    (e.skillCardContentKeys = {}),
    (e.skillCardLoadingKey = null),
    (e.skillCardErrors = {}));
}
function Rc(e, t) {
  t && e.skillsAgentId && !t.agents.some((t) => t.id === e.skillsAgentId) && Lc(e, null);
}
async function zc(e, t) {
  let n = e.client;
  if (
    !n ||
    !e.connected ||
    e.skillsLoading ||
    (e.skillOperation && e.skillOperation !== t?.operation)
  )
    return;
  t?.clearMessages && Object.keys(e.skillMessages).length > 0 && (e.skillMessages = {});
  let r = Pc(e),
    i = () => e.client === n && L(e, r) && (!t?.operation || e.skillOperation === t.operation),
    a = () => e.connected && i();
  ((e.skillsLoading = !0), (e.skillsError = null));
  try {
    let t = await Nc(n, e.skillsAgentId);
    if (!a()) return;
    t && Array.isArray(t.skills) && ((e.skillsReport = t), Hc(e, t), Wc(e, t));
  } catch (t) {
    if (!a()) return;
    e.skillsError = el(t);
  } finally {
    i() && (e.skillsLoading = !1);
  }
}
async function Bc(e, t, n, r = !1) {
  let i = r;
  for (; I(e, t, n);) {
    let r = Pc(e);
    if ((await zc(e, { clearMessages: i, operation: n }), (i = !1), !I(e, t, n) || L(e, r))) return;
  }
}
async function Vc(e, t) {
  let n = e.client;
  if (!n || !e.connected || e.skillsLoading || e.skillOperation) return;
  let r = { kind: `refresh` };
  e.skillOperation = r;
  try {
    if ((await t(), !I(e, n, r))) return;
    await Bc(e, n, r, !0);
  } finally {
    xc(e, r);
  }
}
function Hc(e, t) {
  let n = new Map(t.skills.map((e) => [e.skillKey, kc(e)]).filter((e) => e[1] !== void 0));
  ((e.skillCardContents = Object.fromEntries(
    Object.entries(e.skillCardContents).filter(([t]) => e.skillCardContentKeys[t] === n.get(t)),
  )),
    (e.skillCardContentKeys = Object.fromEntries(
      Object.entries(e.skillCardContentKeys).filter(([e, t]) => t === n.get(e)),
    )),
    (e.skillCardErrors = Object.fromEntries(
      Object.entries(e.skillCardErrors).filter(([e]) => n.has(e)),
    )),
    e.skillCardLoadingKey && !n.has(e.skillCardLoadingKey) && (e.skillCardLoadingKey = null));
}
async function Uc(e, t) {
  if (
    !e.client ||
    !e.connected ||
    e.skillCardLoadingKey === t ||
    (e.skillCardContents[t] !== void 0 && e.skillCardContentKeys[t] === Ac(e, t))
  )
    return;
  let n = Ac(e, t);
  if (!n) return;
  let r = Pc(e),
    i = { ...Mc(e), skillKey: t };
  e.skillCardLoadingKey = t;
  let { [t]: a, ...o } = e.skillCardErrors;
  e.skillCardErrors = o;
  try {
    let a = await e.client.request(`skills.skillCard`, i);
    L(e, r) &&
      a?.skillKey === t &&
      typeof a.content == `string` &&
      Ac(e, t) === n &&
      ((e.skillCardContents = { ...e.skillCardContents, [t]: a.content }),
      (e.skillCardContentKeys = { ...e.skillCardContentKeys, [t]: n }));
  } catch (n) {
    L(e, r) && (e.skillCardErrors = { ...e.skillCardErrors, [t]: el(n) });
  } finally {
    L(e, r) && e.skillCardLoadingKey === t && (e.skillCardLoadingKey = null);
  }
}
async function Wc(e, t) {
  let n = e.client,
    r = Pc(e);
  if (!n || !e.connected || !Oc(t)) {
    ((e.clawhubVerdicts = {}), (e.clawhubVerdictsLoading = !1), (e.clawhubVerdictsError = null));
    return;
  }
  ((e.clawhubVerdictsLoading = !0), (e.clawhubVerdictsError = null));
  try {
    let t = await n.request(`skills.securityVerdicts`, Mc(e));
    if (!L(e, r)) return;
    e.clawhubVerdicts = Object.fromEntries(
      (t?.items ?? []).map((e) => [
        Ec({ registry: e.registry, slug: e.requestedSlug, version: e.requestedVersion }),
        e,
      ]),
    );
  } catch (t) {
    if (!L(e, r)) return;
    ((e.clawhubVerdicts = {}), (e.clawhubVerdictsError = el(t)));
  } finally {
    L(e, r) && (e.clawhubVerdictsLoading = !1);
  }
}
function Gc(e, t, n) {
  e.skillOperation || e.skillsLoading || (e.skillEdits = { ...e.skillEdits, [t]: n });
}
async function Kc(e, t, n) {
  let r = e.client;
  if (!r || !e.connected || e.skillsLoading || e.skillOperation) return;
  let i = Pc(e),
    a = { kind: `skill`, skillKey: t };
  ((e.skillOperation = a), (e.skillsError = null));
  try {
    let o = await n(r);
    if (!I(e, r, a) || !L(e, i) || (await zc(e, { operation: a }), !I(e, r, a) || !L(e, i))) return;
    Sc(e, t, o);
  } catch (n) {
    if (!I(e, r, a) || !L(e, i)) return;
    let o = el(n);
    ((e.skillsError = o), Sc(e, t, { kind: `error`, message: o }));
  } finally {
    (I(e, r, a) && !L(e, i) && (await Bc(e, r, a)), xc(e, a));
  }
}
async function qc(e, t, n) {
  await Kc(
    e,
    t,
    async (e) => (
      await e.request(`skills.update`, { skillKey: t, enabled: n }),
      { kind: `success`, message: n ? `Skill enabled` : `Skill disabled` }
    ),
  );
}
async function Jc(e, t) {
  await Kc(e, t, async (n) => {
    let r = e.skillEdits[t] ?? ``;
    return (
      await n.request(`skills.update`, { skillKey: t, apiKey: r }),
      { kind: `success`, message: `API key saved — stored in openclaw.json (skills.entries.${t})` }
    );
  });
}
async function Yc(e, t, n, r, i = !1) {
  await Kc(e, t, async (t) => ({
    kind: `success`,
    message:
      (
        await t.request(`skills.install`, {
          ...Mc(e),
          name: n,
          installId: r,
          dangerouslyForceUnsafeInstall: i,
          timeoutMs: 12e4,
        })
      )?.message ?? `Installed`,
  }));
}
async function Xc(e, t) {
  if (!e.client || !e.connected) return;
  if (!t.trim()) {
    ((e.clawhubSearchResults = null), (e.clawhubSearchError = null), (e.clawhubSearchLoading = !1));
    return;
  }
  let n = e.client,
    r = Pc(e);
  ((e.clawhubSearchResults = null),
    (e.clawhubSearchLoading = !0),
    (e.clawhubSearchError = null),
    await Fc(
      () => e.connected && e.client === n && t === e.clawhubSearchQuery && L(e, r),
      () => n.request(`skills.search`, { query: t, limit: 20 }),
      (t) => {
        e.clawhubSearchResults = t?.results ?? [];
      },
      (t) => {
        e.clawhubSearchError = el(t);
      },
      () => {
        e.clawhubSearchLoading = !1;
      },
    ));
}
async function Zc(e, t) {
  if (!e.client || !e.connected) return;
  let n = e.client,
    r = Pc(e);
  ((e.clawhubDetailSlug = t),
    (e.clawhubDetailLoading = !0),
    (e.clawhubDetailError = null),
    (e.clawhubDetail = null),
    await Fc(
      () => e.connected && e.client === n && t === e.clawhubDetailSlug && L(e, r),
      () => n.request(`skills.detail`, { slug: t }),
      (t) => {
        e.clawhubDetail = t ?? null;
      },
      (t) => {
        e.clawhubDetailError = el(t);
      },
      () => {
        e.clawhubDetailLoading = !1;
      },
    ));
}
function Qc(e) {
  ((e.clawhubDetailSlug = null),
    (e.clawhubDetail = null),
    (e.clawhubDetailError = null),
    (e.clawhubDetailLoading = !1));
}
async function $c(e, t, n = !1, r) {
  let i = e.client;
  if (!i || !e.connected || e.skillsLoading || e.skillOperation) return;
  let a = Pc(e),
    o = { kind: `clawhub`, slug: t };
  ((e.skillOperation = o), (e.clawhubInstallMessage = null));
  try {
    let s = await i.request(`skills.install`, {
      ...Mc(e),
      source: `clawhub`,
      slug: t,
      ...(r ? { version: r } : {}),
      ...(n ? { acknowledgeClawHubRisk: !0 } : {}),
    });
    if (!I(e, i, o) || !L(e, a) || (await zc(e, { operation: o }), !I(e, i, o) || !L(e, a))) return;
    e.clawhubInstallMessage = {
      kind: `success`,
      text: wc(s?.message ?? `Installed ${t}`, s?.warning),
    };
  } catch (n) {
    if (I(e, i, o) && L(e, a)) {
      let r = Cc(n),
        i = r?.clawhubTrustCode === C.RISK_ACKNOWLEDGEMENT_REQUIRED;
      e.clawhubInstallMessage = {
        kind: `error`,
        text: i ? Tc(r?.warning) : wc(el(n), r?.warning),
        ...(i ? { acknowledgeSlug: t } : {}),
        ...(i && r?.version ? { acknowledgeVersion: r.version } : {}),
        ...(i ? { acknowledgeLabel: `Acknowledge risk and install` } : {}),
      };
    }
  } finally {
    (I(e, i, o) && !L(e, a) && (await Bc(e, i, o)), xc(e, o));
  }
}
var el,
  tl = e(() => {
    (we(), (el = (e) => (e instanceof Error ? e.message : String(e))));
  });
function nl(e, t, n) {
  let r = n?.enabledByDefault ?? !0,
    i = e?.config;
  if (!i || typeof i != `object` || Array.isArray(i)) return r;
  let a = `plugins` in i && i.plugins && typeof i.plugins == `object` ? i.plugins : null;
  if (
    a?.enabled === !1 ||
    (Array.isArray(a?.deny) && a.deny.every((e) => typeof e == `string`) ? a.deny : []).includes(t)
  )
    return !1;
  let o = Array.isArray(a?.allow) && a.allow.every((e) => typeof e == `string`) ? a.allow : [];
  if (o.length > 0 && !o.includes(t)) return !1;
  let s = (a && `entries` in a && a.entries && typeof a.entries == `object` ? a.entries : null)?.[
    t
  ];
  if (!s || typeof s != `object` || Array.isArray(s)) return r;
  let c = s.enabled;
  return typeof c == `boolean` ? c : r;
}
function rl(e) {
  return nl(e, `workboard`, { enabledByDefault: !1 });
}
var il = e(() => {});
function al(e, t) {
  return (e.connected ?? !1) && t && Ne(e.hello?.auth ?? null) && (Ae(e, `terminal.open`) ?? !1);
}
var ol = e(() => {
  (Pe(), Oe());
});
function sl(e) {
  let t = e.snapshot.client,
    n = e.snapshot.connected,
    r = 0,
    i = new Map(),
    a = new Map(),
    o = new Map(),
    s = new Set(),
    c = () => {
      for (let e of s) e();
    },
    l = (e) => {
      if (e.client === t && e.connected === n) return;
      let s = i.size > 0;
      ((t = e.client), (n = e.connected), (r += 1), i.clear(), a.clear(), o.clear(), s && c());
    };
  e.subscribe(l);
  let u = (e) => [...new Set(e.map((e) => e?.trim()).filter((e) => !!e))],
    d = (e, t) => {
      let n = a.get(t);
      if (n) return n;
      let r = e
        .request(`agent.identity.get`, { agentId: t })
        .catch(() => null)
        .finally(() => {
          a.get(t) === r && a.delete(t);
        });
      return (a.set(t, r), r);
    };
  return {
    get(e) {
      let t = e?.trim();
      return t ? (i.get(t) ?? null) : null;
    },
    entries() {
      return [...i.values()];
    },
    async ensure(t) {
      let n = e.snapshot;
      l(n);
      let a = n.client;
      if (!a || !n.connected) return;
      let s = r,
        f = u(t).filter((e) => !i.has(e));
      if (f.length === 0) return;
      let p = await Promise.all(f.map(async (e) => [e, o.get(e) ?? 0, await d(a, e)]));
      if (r !== s || e.snapshot.client !== a || !e.snapshot.connected) return;
      let m = !1;
      for (let [e, t, n] of p) n && t === (o.get(e) ?? 0) && (i.set(e, n), (m = !0));
      m && c();
    },
    invalidate(e) {
      let t = !1;
      for (let n of u(e)) (o.set(n, (o.get(n) ?? 0) + 1), i.delete(n) && (t = !0), a.delete(n));
      t && c();
    },
    subscribe(e) {
      return (s.add(e), () => s.delete(e));
    },
  };
}
var cl = e(() => {});
function ll(e, t) {
  let n = t.agentId.trim(),
    r = t.sessionKey.trim();
  return `${n}:${r}:model=${pl(e, r) || `(default)`}`;
}
async function ul(e, t, n = {}) {
  let r = t.agentId.trim(),
    i = t.sessionKey.trim(),
    a = ll(e, { agentId: r, sessionKey: i });
  if (
    !e.client ||
    !e.connected ||
    !r ||
    !i ||
    (e.toolsEffectiveLoading && e.toolsEffectiveLoadingKey === a)
  )
    return;
  let o = () => n.isCurrent?.() ?? !0,
    s = () => !o() || (n.ignoreResponse?.(r, a) ?? !1);
  ((e.toolsEffectiveLoading = !0),
    (e.toolsEffectiveLoadingKey = a),
    (e.toolsEffectiveResultKey = null),
    (e.toolsEffectiveError = null),
    (e.toolsEffectiveResult = null));
  try {
    let t = await e.client.request(`tools.effective`, { agentId: r, sessionKey: i });
    if (s()) return;
    ((e.toolsEffectiveResultKey = a), (e.toolsEffectiveResult = t));
  } catch (t) {
    if (s()) return;
    e.toolsEffectiveError = n.onError?.(t) ?? String(t);
  } finally {
    o() &&
      e.toolsEffectiveLoadingKey === a &&
      ((e.toolsEffectiveLoadingKey = null), (e.toolsEffectiveLoading = !1));
  }
}
function dl(e) {
  ((e.toolsEffectiveResult = null),
    (e.toolsEffectiveResultKey = null),
    (e.toolsEffectiveError = null),
    (e.toolsEffectiveLoading = !1),
    (e.toolsEffectiveLoadingKey = null));
}
function fl(e) {
  let t = e.sessionKey?.trim();
  if (!t || e.agentsPanel !== `tools` || !e.agentsSelectedId) return;
  let n = po(t);
  if (!(!n || e.agentsSelectedId !== n)) return ul(e, { agentId: n, sessionKey: t });
}
function pl(e, t) {
  let n = t.trim();
  if (!n) return ``;
  let r = e.chatModelCatalog ?? [],
    i = e.sessions.state.modelOverrides[n],
    a = e.sessionsResult?.defaults,
    o = hi(a?.model, a?.modelProvider, r);
  if (i === null) return o;
  if (i) return di(ui(i), r);
  let s = e.sessionsResult?.sessions?.find((e) => e.key === n);
  return s?.model ? hi(s.model, s.modelProvider, r) : o;
}
var ml = e(() => {
  (Ei(), Co());
});
async function hl(e) {
  return e.request(`agents.list`, {});
}
async function gl(e, t) {
  return e.request(`agents.files.list`, { agentId: t });
}
function _l(e, t) {
  return !!(e.agentsSelectedId && e.agentsSelectedId !== t);
}
function vl(e, t) {
  return Ln(e) ? Rn(t) : String(e);
}
async function yl(e, t) {
  let n = t.trim(),
    r = e.client;
  if (!r || !e.connected || !n || (e.toolsCatalogLoading && e.toolsCatalogLoadingAgentId === n))
    return;
  let i = e.requestGeneration,
    a = () =>
      e.client !== r || e.requestGeneration !== i || e.toolsCatalogLoadingAgentId !== n || _l(e, n);
  ((e.toolsCatalogLoading = !0),
    (e.toolsCatalogLoadingAgentId = n),
    (e.toolsCatalogError = null),
    (e.toolsCatalogResult = null));
  try {
    let t = await r.request(`tools.catalog`, { agentId: n, includePlugins: !0 });
    if (a()) return;
    e.toolsCatalogResult = t;
  } catch (t) {
    if (a()) return;
    e.toolsCatalogError = vl(t, `tools catalog`);
  } finally {
    e.client === r &&
      e.requestGeneration === i &&
      e.toolsCatalogLoadingAgentId === n &&
      ((e.toolsCatalogLoadingAgentId = null), (e.toolsCatalogLoading = !1));
  }
}
async function bl(e, t) {
  let n = e.client,
    r = e.requestGeneration;
  await ul(e, t, {
    isCurrent: () => e.client === n && e.connected && e.requestGeneration === r,
    ignoreResponse: (t, n) => e.toolsEffectiveLoadingKey !== n || _l(e, t),
    onError: (e) => vl(e, `effective tools`),
  });
}
async function xl(e, t, n) {
  let r = e.state.configFormDirty;
  e.stageDefaultAgent(t) && !r && e.state.configFormDirty && (await e.save()) && (await n());
}
async function Sl(e, t) {
  await e.request(`agents.update`, {
    agentId: t.agentId,
    ...(t.name ? { name: t.name } : {}),
    ...(t.emoji ? { emoji: t.emoji } : {}),
    ...(t.avatar ? { avatar: t.avatar } : {}),
  });
}
function Cl() {
  return { list: null, loading: !1, error: null };
}
function wl(e) {
  return e?.trim() || null;
}
function Tl(e) {
  let t = {
      client: e.snapshot.client,
      connected: e.snapshot.connected,
      agentsLoading: !1,
      agentsError: null,
      agentsList: null,
    },
    n = new Map(),
    r = new Map(),
    i = new Map(),
    a = new Set(),
    o = !1,
    s = 0,
    c = null,
    l = null,
    u = () => {
      if (!o) for (let e of a) e(t);
    },
    d = (e, n) => !o && t.connected && t.client === e && s === n,
    f = (e) => {
      let t = n.get(e);
      if (t) return t;
      let r = Cl();
      return (n.set(e, r), r);
    },
    p = async (e) => {
      let n = t.client;
      if (!n || !t.connected) return t.agentsList;
      if (c && !e) return c;
      ((t.agentsLoading = !0), (t.agentsError = null), u());
      let r = s,
        i = Symbol();
      l = i;
      let a = hl(n)
        .then((e) => {
          let a = d(n, r) && l === i;
          return (a && ((t.agentsList = e), (t.agentsError = null)), a ? e : null);
        })
        .catch(
          (e) => (
            d(n, r) && l === i && (t.agentsError = Ln(e) ? Rn(`agent list`) : String(e)),
            null
          ),
        )
        .finally(() => {
          let e = l === i;
          (e && ((c = null), (l = null)), e && d(n, r) && ((t.agentsLoading = !1), u()));
        });
      return ((c = a), a);
    },
    m = async (e, a) => {
      let o = wl(e),
        c = t.client;
      if (!o || !c || !t.connected) return o ? (n.get(o)?.list ?? null) : null;
      let l = f(o);
      if (l.list && !a) return l.list;
      let p = r.get(o);
      if (p && !a) return p;
      ((l.loading = !0), (l.error = null), u());
      let m = s,
        h = Symbol();
      i.set(o, h);
      let g = gl(c, o)
        .then((e) => {
          let t = d(c, m) && i.get(o) === h;
          return (t && e && ((l.list = e), (l.error = null)), t ? l.list : null);
        })
        .catch((e) => (d(c, m) && i.get(o) === h && (l.error = String(e)), null))
        .finally(() => {
          let e = i.get(o) === h;
          (e && (r.delete(o), i.delete(o)), e && d(c, m) && ((l.loading = !1), u()));
        });
      return (r.set(o, g), g);
    },
    h = e.subscribe((e) => {
      let a = t.client !== e.client;
      if (
        ((t.client = e.client),
        (t.connected = e.connected),
        (a || !e.connected) && ((s += 1), (c = null), (l = null), r.clear(), i.clear()),
        (a || !e.connected) && (n.clear(), (t.agentsList = null), (t.agentsError = null)),
        a || !e.connected)
      ) {
        t.agentsLoading = !1;
        for (let e of n.values()) e.loading = !1;
      }
      u();
    });
  return {
    get state() {
      return t;
    },
    adoptList(e, n) {
      t.client !== n || !t.connected || ((t.agentsList = e), (t.agentsError = null), u());
    },
    ensureList: () => p(!1),
    refreshList: () => p(!0),
    files(e) {
      let t = wl(e);
      return t ? (n.get(t) ?? Cl()) : Cl();
    },
    ensureFiles: (e) => m(e, !1),
    refreshFiles: (e) => m(e, !0),
    subscribe(e) {
      return (a.add(e), () => a.delete(e));
    },
    dispose() {
      ((o = !0),
        (s += 1),
        h(),
        a.clear(),
        r.clear(),
        i.clear(),
        n.clear(),
        (c = null),
        (l = null),
        (t.agentsLoading = !1));
    },
  };
}
var El = e(() => {
  (zn(), ml());
});
function Dl(e = {}) {
  return {
    client: e.client ?? null,
    connected: e.connected ?? !1,
    channelsLoading: !1,
    channelsLoadingProbe: null,
    channelsRefreshSeq: 0,
    channelsSnapshot: null,
    channelsError: null,
    channelsLastSuccess: null,
    whatsappLoginMessage: null,
    whatsappLoginQrDataUrl: null,
    whatsappLoginConnected: null,
    whatsappBusy: !1,
  };
}
function Ol(e) {
  return new Promise((t) => {
    setTimeout(() => t(`timeout`), e);
  });
}
function kl(e, t, n) {
  return e.client === t && e.channelsRefreshSeq === n;
}
async function Al(e, t, n = {}) {
  let r = e.client;
  if (!r || !e.connected || (e.channelsLoading && (!e.channelsLoadingProbe || t))) return;
  let i = (e.channelsRefreshSeq ?? 0) + 1;
  ((e.channelsRefreshSeq = i),
    (e.channelsLoading = !0),
    (e.channelsLoadingProbe = t),
    (e.channelsError = null));
  let a = (async () => {
      try {
        let n = await r.request(`channels.status`, { probe: t, timeoutMs: 8e3 });
        if (!kl(e, r, i)) return;
        ((e.channelsSnapshot = n), (e.channelsLastSuccess = Date.now()));
      } catch (t) {
        if (!kl(e, r, i)) return;
        Ln(t)
          ? ((e.channelsSnapshot = null), (e.channelsError = Rn(`channel status`)))
          : (e.channelsError = String(t));
      } finally {
        kl(e, r, i) && ((e.channelsLoading = !1), (e.channelsLoadingProbe = null));
      }
    })(),
    o = n.softTimeoutMs;
  if (typeof o == `number` && o > 0)
    return (await Promise.race([a.then(() => `done`), Ol(o)]), void 0);
  await a;
}
function jl(e) {
  let t = Bl.get(e);
  if (t) return t;
  let n = { gatewayEpoch: 0, whatsappOperationSeq: 0 };
  return (Bl.set(e, n), n);
}
function Ml(e) {
  let t = e.client;
  if (!t || !e.connected || e.whatsappBusy) return null;
  let n = jl(e),
    r = n.whatsappOperationSeq + 1;
  return (
    (n.whatsappOperationSeq = r),
    (e.whatsappBusy = !0),
    { client: t, gatewayEpoch: n.gatewayEpoch, operationSeq: r }
  );
}
function R(e, t) {
  let n = jl(e);
  return (
    e.connected &&
    e.client === t.client &&
    n.gatewayEpoch === t.gatewayEpoch &&
    n.whatsappOperationSeq === t.operationSeq
  );
}
async function Nl(e, t, n) {
  let r = Ml(e);
  if (!r) return !1;
  try {
    let i = await r.client.request(`web.login.start`, {
      force: t,
      timeoutMs: 3e4,
      ...(n ? { accountId: n } : {}),
    });
    if (!R(e, r)) return !1;
    ((e.whatsappLoginMessage = i.message ?? null),
      (e.whatsappLoginQrDataUrl = i.qrDataUrl ?? null),
      (e.whatsappLoginConnected = typeof i.connected == `boolean` ? i.connected : null));
  } catch (t) {
    if (!R(e, r)) return !1;
    ((e.whatsappLoginMessage = String(t)),
      (e.whatsappLoginQrDataUrl = null),
      (e.whatsappLoginConnected = null));
  } finally {
    R(e, r) && (e.whatsappBusy = !1);
  }
  return !0;
}
async function Pl(e, t) {
  let n = Ml(e);
  if (!n) return !1;
  let r = e.whatsappLoginQrDataUrl ?? void 0;
  try {
    let i = await n.client.request(`web.login.wait`, {
      timeoutMs: 12e4,
      currentQrDataUrl: r,
      ...(t ? { accountId: t } : {}),
    });
    if (!R(e, n)) return !1;
    ((e.whatsappLoginMessage = i.message ?? null),
      (e.whatsappLoginConnected = i.connected ?? null),
      i.qrDataUrl
        ? (e.whatsappLoginQrDataUrl = i.qrDataUrl)
        : i.connected && (e.whatsappLoginQrDataUrl = null));
  } catch (t) {
    if (!R(e, n)) return !1;
    ((e.whatsappLoginMessage = String(t)), (e.whatsappLoginConnected = null));
  } finally {
    R(e, n) && (e.whatsappBusy = !1);
  }
  return !0;
}
async function Fl(e) {
  let t = Ml(e);
  if (!t) return !1;
  try {
    if ((await t.client.request(`channels.logout`, { channel: `whatsapp` }), !R(e, t))) return !1;
    ((e.whatsappLoginMessage = `Logged out.`),
      (e.whatsappLoginQrDataUrl = null),
      (e.whatsappLoginConnected = null));
  } catch (n) {
    if (!R(e, t)) return !1;
    e.whatsappLoginMessage = String(n);
  } finally {
    R(e, t) && (e.whatsappBusy = !1);
  }
  return !0;
}
function Il(e, t) {
  if (!e) return null;
  let n = (e.channels ?? {})[t];
  if (n && typeof n == `object`) return n;
  let r = e[t];
  return r && typeof r == `object` ? r : null;
}
function Ll(e) {
  if (e == null) return E(`common.na`);
  if (typeof e == `string` || typeof e == `number` || typeof e == `boolean`) return String(e);
  try {
    return JSON.stringify(e);
  } catch {
    return E(`common.na`);
  }
}
function Rl(e) {
  let t = Il(e.configForm, e.channelId);
  return t ? e.fields.flatMap((e) => (e in t ? [{ label: e, value: Ll(t[e]) }] : [])) : [];
}
function zl(e) {
  let t = Dl(e.snapshot),
    n = new Set(),
    r = !1,
    i = () => {
      if (!r) for (let e of n) e(t);
    },
    a = async (e) => {
      if (r) return;
      let t = e();
      i();
      try {
        await t;
      } finally {
        i();
      }
    },
    o = e.subscribe((e) => {
      let n = t.client !== e.client,
        r = t.connected !== e.connected;
      if (((t.client = e.client), (t.connected = e.connected), n || r)) {
        let e = jl(t);
        ((e.gatewayEpoch += 1),
          (e.whatsappOperationSeq += 1),
          (t.channelsLoading = !1),
          (t.channelsLoadingProbe = null),
          (t.whatsappBusy = !1),
          (t.channelsRefreshSeq = (t.channelsRefreshSeq ?? 0) + 1));
      }
      i();
    });
  return {
    get state() {
      return t;
    },
    refresh: (e, n) => a(() => Al(t, e ?? !1, n)),
    startWhatsApp: (e, n) =>
      a(async () => {
        (await Nl(t, e, n)) && (await Al(t, !0));
      }),
    waitWhatsApp: (e) =>
      a(async () => {
        (await Pl(t, e)) && (await Al(t, !0));
      }),
    logoutWhatsApp: () =>
      a(async () => {
        (await Fl(t)) && (await Al(t, !0));
      }),
    subscribe(e) {
      return (n.add(e), () => n.delete(e));
    },
    dispose() {
      if (r) return;
      r = !0;
      let e = jl(t);
      ((e.gatewayEpoch += 1), (e.whatsappOperationSeq += 1), (t.whatsappBusy = !1), o(), n.clear());
    },
  };
}
var Bl,
  Vl = e(() => {
    (Ge(), zn(), (Bl = new WeakMap()));
  });
function Hl(e) {
  return {
    client: e?.client ?? null,
    connected: e?.connected ?? !1,
    applySessionKey: e?.sessionKey ?? `main`,
    configLoading: !1,
    configRaw: `{
}
`,
    configRawOriginal: ``,
    configValid: null,
    configIssues: [],
    configSaving: !1,
    configApplying: !1,
    configSnapshot: null,
    configDraftBaseHash: null,
    configSchema: null,
    configSchemaVersion: null,
    configSchemaLoading: !1,
    configUiHints: {},
    configForm: null,
    configFormOriginal: null,
    configFormDirty: !1,
    configFormMode: `form`,
    configSearchQuery: ``,
    configActiveSection: null,
    configActiveSubsection: null,
    lastError: null,
  };
}
function Ul(e, t) {
  let n = Tu.get(e) ?? { config: 0, schema: 0 },
    r = { ...n, [t]: n[t] + 1 };
  return (Tu.set(e, r), r[t]);
}
function Wl(e) {
  return Eu.get(e) ?? 0;
}
function Gl(e) {
  Eu.set(e, Wl(e) + 1);
}
function Kl(e, t, n) {
  return e.connected && e.client === t && Wl(e) === n;
}
function ql(e, t, n, r, i) {
  return Kl(e, r, i) && Tu.get(e)?.[t] === n;
}
async function Jl(e, t = {}) {
  let n = e.client;
  if (!n || !e.connected) return;
  let r = Wl(e),
    i = Ul(e, `config`);
  ((e.configLoading = !0), (e.lastError = null), (e.chatError = null));
  try {
    let a = await n.request(`config.get`, {});
    if (!ql(e, `config`, i, n, r)) return;
    eu(e, a, t);
  } catch (t) {
    ql(e, `config`, i, n, r) && (e.lastError = String(t));
  } finally {
    ql(e, `config`, i, n, r) && (e.configLoading = !1);
  }
}
async function Yl(e) {
  let t = e.client;
  if (!t || !e.connected || e.configSchemaLoading) return;
  let n = Wl(e),
    r = Ul(e, `schema`);
  e.configSchemaLoading = !0;
  try {
    let i = await t.request(`config.schema`, {});
    if (!ql(e, `schema`, r, t, n)) return;
    Xl(e, i);
  } catch (i) {
    ql(e, `schema`, r, t, n) && (e.lastError = String(i));
  } finally {
    ql(e, `schema`, r, t, n) && (e.configSchemaLoading = !1);
  }
}
function Xl(e, t) {
  ((e.configSchema = t.schema ?? null),
    (e.configUiHints = t.uiHints ?? {}),
    (e.configSchemaVersion = t.version ?? null));
}
function Zl(e) {
  return !e || typeof e != `object` || Array.isArray(e) ? null : e;
}
function Ql(e) {
  return Zl(e?.sourceConfig) ?? Zl(e?.resolved) ?? Zl(e?.config);
}
function $l(e) {
  return e.configForm ?? Ql(e.configSnapshot);
}
function eu(e, t, n = {}) {
  let r = e.configFormDirty && n.discardPendingChanges !== !0,
    i = e.configDraftBaseHash ?? e.configSnapshot?.hash ?? null;
  e.configSnapshot = t;
  let a = Ql(t);
  !(typeof t.raw == `string` || a || e.configForm) &&
    e.configFormMode === `raw` &&
    (e.configFormMode = `form`);
  let o = typeof t.raw == `string` ? t.raw : a ? it(a) : e.configRaw;
  (r
    ? e.configFormMode !== `raw` && e.configForm
      ? (e.configRaw = it(e.configForm))
      : e.configFormMode !== `raw` && (e.configRaw = o)
    : (e.configRaw = o),
    (e.configValid = typeof t.valid == `boolean` ? t.valid : null),
    (e.configIssues = Array.isArray(t.issues) ? t.issues : []),
    r
      ? (e.configDraftBaseHash = i)
      : ((e.configForm = rt(a ?? {})),
        (e.configFormOriginal = rt(a ?? {})),
        (e.configRawOriginal = o),
        (e.configFormDirty = !1),
        (e.configDraftBaseHash = t.hash ?? null),
        z.delete(e)));
}
function tu(e) {
  return !e || typeof e != `object` || Array.isArray(e) ? null : e;
}
function nu(e, t) {
  let n = e.trim();
  if (n === ``) return;
  let r = Number(n);
  return !Number.isFinite(r) || (t && !Number.isInteger(r)) ? e : r;
}
function ru(e) {
  let t = e.trim();
  return t === `true` ? !0 : t === `false` ? !1 : e;
}
function iu(e, t) {
  if (e == null) return e;
  if (t.allOf && t.allOf.length > 0) {
    let n = e;
    for (let e of t.allOf) n = iu(n, e);
    return n;
  }
  let n = Ze(t);
  if (t.anyOf || t.oneOf) {
    let n = (t.anyOf ?? t.oneOf ?? []).filter(
      (e) => !(e.type === `null` || (Array.isArray(e.type) && e.type.includes(`null`))),
    );
    if (n.length === 1) {
      let t = n[0];
      return t ? iu(e, t) : e;
    }
    if (typeof e == `string`)
      for (let t of n) {
        let n = Ze(t);
        if (n === `number` || n === `integer`) {
          let t = nu(e, n === `integer`);
          if (t === void 0 || typeof t == `number`) return t;
        }
        if (n === `boolean`) {
          let t = ru(e);
          if (typeof t == `boolean`) return t;
        }
      }
    for (let t of n) {
      let n = Ze(t);
      if (
        (n === `object` && typeof e == `object` && !Array.isArray(e)) ||
        (n === `array` && Array.isArray(e))
      )
        return iu(e, t);
    }
    return e;
  }
  if (n === `number` || n === `integer`) {
    if (typeof e == `string`) {
      let t = nu(e, n === `integer`);
      if (t === void 0 || typeof t == `number`) return t;
    }
    return e;
  }
  if (n === `boolean`) {
    if (typeof e == `string`) {
      let t = ru(e);
      if (typeof t == `boolean`) return t;
    }
    return e;
  }
  if (n === `string`) return typeof e == `string` && e.length === 0 && t.minLength ? void 0 : e;
  if (n === `object`) {
    if (typeof e != `object` || Array.isArray(e)) return e;
    let n = t.properties ?? {},
      r =
        t.additionalProperties && typeof t.additionalProperties == `object`
          ? t.additionalProperties
          : null,
      i = {};
    for (let [t, a] of Object.entries(e)) {
      let e = n[t] ?? r,
        o = e ? iu(a, e) : a;
      o !== void 0 && (i[t] = o);
    }
    return i;
  }
  if (n === `array`) {
    if (!Array.isArray(e)) return e;
    let n = t.items;
    return Array.isArray(n)
      ? e.map((e, t) => {
          let r = t < n.length ? n[t] : void 0;
          return r ? iu(e, r) : e;
        })
      : n
        ? e.map((e) => iu(e, n)).filter((e) => e !== void 0)
        : e;
  }
  return e;
}
function au(e) {
  if (e.configFormMode !== `form` || !e.configForm) return e.configRaw;
  let t = tu(e.configSchema);
  return it(ct(t ? iu(e.configForm, t) : e.configForm, e.configFormOriginal, e.configRawOriginal));
}
async function ou(e, t, n, r = {}) {
  let i = e.client;
  if (!i || !e.connected) return !1;
  let a = Wl(e),
    o = () => Kl(e, i, a);
  ((e[n] = !0), (e.lastError = null), (e.chatError = null));
  try {
    let n = au(e),
      a = e.configDraftBaseHash ?? e.configSnapshot?.hash;
    return a
      ? (await i.request(t, { raw: n, baseHash: a, ...r }),
        o()
          ? ((e.configFormDirty = !1),
            (e.configDraftBaseHash = null),
            z.delete(e),
            await Jl(e),
            o())
          : !1)
      : ((e.lastError = `Config hash missing; reload and retry.`), !1);
  } catch (t) {
    return (o() && (e.lastError = String(t)), !1);
  } finally {
    o() && (e[n] = !1);
  }
}
function su(e, t) {
  let n = rt(e.configFormOriginal ?? Ql(e.configSnapshot) ?? {}),
    r = it(t),
    i = it(n);
  ((e.configForm = t), (e.configRaw = r), (e.configFormDirty = r !== i));
}
async function cu(e) {
  return ou(e, `config.set`, `configSaving`);
}
async function lu(e) {
  return ou(e, `config.apply`, `configApplying`, { sessionKey: e.applySessionKey });
}
async function uu(e, t) {
  let n = e.client;
  if (!n || !e.connected) return !1;
  let r = Wl(e),
    i = e.configSnapshot?.hash;
  if (!i) return ((e.lastError = `Config hash missing; refresh and retry.`), !1);
  ((e.lastError = null), (e.chatError = null));
  try {
    return (
      await n.request(`config.patch`, {
        baseHash: i,
        raw: typeof t.raw == `string` ? t.raw : JSON.stringify(t.raw),
        sessionKey: e.applySessionKey,
        note: t.note,
        ...(t.replacePaths?.length ? { replacePaths: t.replacePaths } : {}),
      }),
      Kl(e, n, r)
    );
  } catch (t) {
    return (Kl(e, n, r) && (e.lastError = String(t)), !1);
  }
}
async function du(e, t) {
  let n = e.client;
  if (!n || !e.connected) return null;
  let r = Wl(e);
  try {
    let i = await n.request(`config.schema.lookup`, { path: t });
    return Kl(e, n, r) ? i : null;
  } catch (t) {
    if (!Kl(e, n, r)) return null;
    throw t;
  }
}
function fu(e, t) {
  let n = rt(e.configForm ?? Ql(e.configSnapshot) ?? {});
  (t(n), su(e, n));
}
function pu(e, t) {
  let n = z.get(e);
  n ? n.add(t) : z.set(e, new Set([t]));
}
function mu(e, t) {
  let n = z.get(e);
  n && (n.delete(t), n.size === 0 && z.delete(e));
}
function hu(e, t, n, r) {
  if (
    n.length !== 4 ||
    n[0] !== `plugins` ||
    n[1] !== `entries` ||
    typeof n[2] != `string` ||
    n[3] !== `enabled`
  )
    return;
  let i = n[2],
    a = t.plugins && typeof t.plugins == `object` && !Array.isArray(t.plugins) ? t.plugins : null,
    o = Array.isArray(a?.allow) ? a.allow : null;
  if (!o) {
    mu(e, i);
    return;
  }
  if (r === !0) {
    if (o.includes(i)) return;
    if (o.length === 0) {
      mu(e, i);
      return;
    }
    (dt(t, [`plugins`, `allow`], [...o, i]), pu(e, i));
    return;
  }
  z.get(e)?.has(i) &&
    (dt(
      t,
      [`plugins`, `allow`],
      o.filter((e) => e !== i),
    ),
    mu(e, i));
}
function gu(e, t, n) {
  fu(e, (r) => {
    if ((dt(r, t, n), t[0] === `plugins` && t[1] === `allow`)) {
      z.delete(e);
      return;
    }
    hu(e, r, t, n);
  });
}
function _u(e, t) {
  ((e.configRaw = t),
    (e.configFormDirty = t !== e.configRawOriginal),
    e.configFormDirty
      ? (e.configDraftBaseHash = e.configDraftBaseHash ?? e.configSnapshot?.hash ?? null)
      : (e.configDraftBaseHash = e.configSnapshot?.hash ?? null));
}
function vu(e) {
  let t = Ql(e.configSnapshot);
  ((e.configForm = rt(e.configFormOriginal ?? t ?? {})),
    (e.configRaw = e.configRawOriginal ?? it(e.configFormOriginal ?? t ?? {})),
    (e.configFormDirty = !1),
    (e.configDraftBaseHash = e.configSnapshot?.hash ?? null),
    z.delete(e));
}
function yu(e, t) {
  fu(e, (e) => ft(e, t));
}
function bu(e, t) {
  let n = t.trim();
  if (!n) return -1;
  let r = e?.agents?.list;
  return Array.isArray(r)
    ? r.findIndex((e) => e && typeof e == `object` && `id` in e && e.id === n)
    : -1;
}
function xu(e, t) {
  let n = t.trim();
  if (!n) return -1;
  let r = e.configForm ?? Ql(e.configSnapshot),
    i = bu(r, n);
  if (i >= 0) return i;
  let a = r?.agents?.list,
    o = Array.isArray(a) ? a.length : 0;
  return (gu(e, [`agents`, `list`, o, `id`], n), o);
}
function Su(e, t) {
  let n = t.trim();
  if (!n) return !1;
  let r = bu(e.configForm ?? Ql(e.configSnapshot), n);
  return r < 0
    ? !1
    : (fu(e, (e) => {
        let t = e?.agents?.list;
        if (Array.isArray(t))
          for (let e = 0; e < t.length; e++) {
            let n = t[e];
            if (!n || typeof n != `object` || Array.isArray(n)) continue;
            let i = n;
            e === r ? (i.default = !0) : delete i.default;
          }
      }),
      !0);
}
async function Cu(e) {
  let t = e.client;
  if (!t || !e.connected) return;
  let n = Wl(e),
    r = () => Kl(e, t, n);
  ((e.lastError = null), (e.chatError = null));
  try {
    let n = await t.request(`config.openFile`, {});
    if (!r()) return;
    if (!n.ok) {
      let t = n.error || `Failed to open config file`,
        i = n.path || e.configSnapshot?.path;
      (i &&
        ((await Je(i))
          ? (t += `\n\nFile path copied to clipboard: ${i}`)
          : (t += `\n\nFile path: ${i}`)),
        r() && (e.lastError = t));
    }
  } catch (t) {
    if (!r()) return;
    let n = String(t),
      i = e.configSnapshot?.path;
    (i && (await Je(i)), r() && (e.lastError = n));
  }
}
function wu(e) {
  let t = Hl(e.snapshot),
    n = new Set(),
    r = null,
    i = null,
    a = !1,
    o = () => {
      if (!a) for (let e of n) e(t);
    },
    s = async (e) => {
      try {
        let t = e();
        return (o(), await t);
      } finally {
        o();
      }
    },
    c = (e) => {
      (e(), o());
    },
    l = (e, t) => {
      let n = t.finally(() => {
        e === `config` && r === n ? (r = null) : e === `schema` && i === n && (i = null);
      });
      return (e === `config` ? (r = n) : (i = n), n);
    },
    u = (e, t) => (e === `config` ? r : i) ?? l(e, s(t)),
    d = () => (t.configSnapshot ? Promise.resolve() : u(`config`, () => Jl(t))),
    f = () => (t.configSchema ? Promise.resolve() : u(`schema`, () => Yl(t))),
    p = e.subscribe((e) => {
      let n = t.client !== e.client,
        a = t.connected !== e.connected;
      ((t.client = e.client),
        (t.connected = e.connected),
        (t.applySessionKey = e.sessionKey),
        (n || a) &&
          ((r = null),
          (i = null),
          Gl(t),
          (t.configLoading = !1),
          (t.configSchemaLoading = !1),
          (t.configSaving = !1),
          (t.configApplying = !1)),
        o());
    });
  return {
    get state() {
      return t;
    },
    ensureLoaded: d,
    ensureSchemaLoaded: f,
    refresh: (e) =>
      l(
        `config`,
        s(() => Jl(t, e)),
      ),
    refreshSchema: () =>
      l(
        `schema`,
        s(() => Yl(t)),
      ),
    patchForm: (e, n) => c(() => gu(t, e, n)),
    removeFormValue: (e) => c(() => yu(t, e)),
    setRaw: (e) => c(() => _u(t, e)),
    resetDraft: () => c(() => vu(t)),
    save: () => s(() => cu(t)),
    apply: () => s(() => lu(t)),
    openFile: () => s(() => Cu(t)),
    ensureAgentEntry: (e) => {
      let n = xu(t, e);
      return (o(), n);
    },
    stageDefaultAgent: (e) => {
      let n = Su(t, e);
      return (o(), n);
    },
    patch: (e) => s(() => uu(t, e)),
    lookupSchemaPath: (e) => s(() => du(t, e)),
    subscribe(e) {
      return (n.add(e), () => n.delete(e));
    },
    dispose() {
      ((a = !0),
        Gl(t),
        (t.connected = !1),
        (t.configLoading = !1),
        (t.configSchemaLoading = !1),
        (t.configSaving = !1),
        (t.configApplying = !1),
        p(),
        n.clear(),
        Tu.delete(t),
        z.delete(t));
    },
  };
}
var z,
  Tu,
  Eu,
  Du = e(() => {
    (Xe(), Ye(), gt(), (z = new WeakMap()), (Tu = new WeakMap()), (Eu = new WeakMap()));
  }),
  Ou = e(() => {
    ue();
  });
function B(e, t) {
  let n = e.cards.filter((e) => e.id !== t.id);
  (n.push(t), (e.cards = n.toSorted((e, t) => e.position - t.position)));
}
function ku(e) {
  let t = [];
  for (let n of e.metadata?.links ?? []) {
    let e = n.type === `parent` ? n.targetCardId?.trim() : ``;
    e && !t.includes(e) && t.push(e);
  }
  return t;
}
function Au(e, t) {
  let n = new Map(t.map((e) => [e.id, e])),
    r = ku(e).map((e) => {
      let t = n.get(e);
      return {
        id: e,
        title: t?.title ?? e,
        status: t?.status,
        done: t?.status === `done`,
        missing: !t,
      };
    });
  return { parents: r, blockedParents: r.filter((e) => !e.done) };
}
function ju(e, t) {
  let n = [];
  for (let r of e) {
    if (r.id === t) continue;
    let e = r.metadata?.links;
    if (!e?.some((e) => e.targetCardId === t)) {
      n.push(r);
      continue;
    }
    let i = e.filter((e) => e.targetCardId !== t),
      a = { ...r.metadata, links: i };
    (i.length === 0 && delete a.links,
      n.push(Object.keys(a).length ? { ...r, metadata: a } : { ...r, metadata: void 0 }));
  }
  return n;
}
function Mu(e) {
  let t = e.loaded && e.mutationReadiness === `stale_edit_draft`;
  ((e.draftOpen = !1),
    (e.editingCardId = null),
    (e.draftTitle = ``),
    (e.draftNotes = ``),
    (e.draftStatus = `todo`),
    (e.draftPriority = `normal`),
    (e.draftLabels = ``),
    (e.draftAgentId = ``),
    (e.draftSessionKey = ``),
    (e.draftTemplateId = ``),
    (e.draftCommentBody = ``),
    t && (e.mutationReadiness = `ready`));
}
function Nu(e) {
  let t = [];
  for (let n of e.split(`,`)) {
    let e = n.trim();
    if ((e && !t.includes(e) && t.push(e), t.length >= 12)) break;
  }
  return t;
}
function Pu(e) {
  return {
    title: e.draftTitle,
    notes: e.draftNotes,
    status: e.draftStatus,
    priority: e.draftPriority,
    labels: Nu(e.draftLabels),
    agentId: e.draftAgentId,
    sessionKey: e.draftSessionKey,
    ...(e.draftTemplateId ? { templateId: e.draftTemplateId } : {}),
  };
}
function Fu(e) {
  return e === `failed` || e === `killed` || e === `timeout`;
}
function Iu(e) {
  if (
    e.status === `running` &&
    e.hasActiveRun === !1 &&
    !(typeof e.updatedAt != `number` || Date.now() - e.updatedAt < Ru)
  )
    return {
      detectedAt: Date.now(),
      lastSessionUpdatedAt: e.updatedAt,
      reason: `Linked session has not reported recent activity.`,
    };
}
function V(e) {
  return e.sessionKey ?? e.execution?.sessionKey;
}
function Lu(e) {
  return e.runId ?? e.execution?.runId;
}
function H(e) {
  return typeof e == `string` && e.trim() ? e.trim() : null;
}
var Ru,
  U = e(() => {
    Ru = 1800 * 1e3;
  });
function W(e) {
  return e instanceof Error && e.message.trim()
    ? e.message
    : typeof e == `string` && e.trim()
      ? e.trim()
      : G(e) && typeof e.message == `string` && e.message.trim()
        ? e.message.trim()
        : `Unknown workboard error.`;
}
function G(e) {
  return !!(e && typeof e == `object` && !Array.isArray(e));
}
var K = e(() => {});
function zu(e) {
  let t = X(e),
    n = (t.loadGeneration ?? 0) + 1;
  return ((t.loadGeneration = n), n);
}
function q(e, t) {
  return X(e).loadGeneration === t;
}
function Bu(e) {
  let t = X(e),
    n = (t.pollingGeneration ?? 0) + 1;
  return ((t.pollingGeneration = n), n);
}
function Vu(e) {
  return X(e).pollingGeneration ?? 0;
}
function Hu(e, t) {
  return Vu(e) === t;
}
function Uu(e) {
  let t = X(e),
    n = (t.lifecycleReconciliationEpoch ?? 0) + 1;
  return ((t.lifecycleReconciliationEpoch = n), n);
}
function Wu(e) {
  return X(e).lifecycleReconciliationEpoch ?? 0;
}
function Gu(e, t) {
  return Wu(e) === t;
}
function J(e) {
  let t = X(e),
    n = t.state;
  (n &&
    ($u(n, !1, { host: e }),
    Y(n, { host: e }),
    t.loadPromise && (n.draftSaving || (n.loading = !1), n.loaded || (n.loadAttempted = !1))),
    zu(e),
    delete t.loadPromise,
    delete t.loadToken,
    Uu(e));
}
function Ku(e) {
  let t = X(e),
    n = t.lifecycleTaskPreparedTimer;
  n && (clearTimeout(n), delete t.lifecycleTaskPreparedTimer);
}
function qu(e) {
  let t = X(e),
    n = t.lifecycleTaskRetryTimer;
  n && (clearTimeout(n), delete t.lifecycleTaskRetryTimer);
}
function Ju(e) {
  let t = X(e),
    n = t.lifecycleTaskContinuationTimer;
  n && (clearTimeout(n), delete t.lifecycleTaskContinuationTimer);
}
function Yu(e, t) {
  X(e).lifecycleWrites.add(t);
}
function Xu(e, t) {
  X(e).lifecycleWrites.delete(t);
}
async function Zu(e) {
  for (;;) {
    let t = X(e).lifecycleWrites;
    if (!t.size) return;
    await Promise.allSettled(t);
  }
}
function Y(e, t = {}) {
  ((e.lifecycleConfirmedTaskIds = new Set()),
    (e.lifecycleTaskConfirmationStartedAt = null),
    nd(e, !1, t));
}
function Qu(e) {
  let t = X(e);
  (Ku(e), qu(e), Ju(e), delete t.lifecycleTaskRefreshPromise);
  let n = t.state;
  (n &&
    ($u(n, !1),
    td(n, !1),
    (n.lifecycleTaskRefreshError = null),
    Y(n, { host: e }),
    n.draftSaving || (n.loading = !1),
    (n.mutationReadiness = `canonical_reload_required`),
    (n.loaded = !1),
    (n.loadAttempted = !1)),
    zu(e),
    delete t.loadPromise,
    delete t.loadToken,
    Uu(e));
}
function $u(e, t, n = {}) {
  let r = n.preparedAt ?? Date.now();
  ((e.lifecycleTasksPrepared = t), (e.lifecycleTasksPreparedAt = t ? r : null));
  let i = n.host;
  if (!i || (Ku(i), !t || !n.requestUpdate || e.autoRefreshIntervalMs === 0 || !ud(e))) return;
  let a = setTimeout(
    () => {
      (delete X(i).lifecycleTaskPreparedTimer, n.requestUpdate?.());
    },
    Math.max(0, r + e.autoRefreshIntervalMs - Date.now()),
  );
  X(i).lifecycleTaskPreparedTimer = a;
}
function ed(e, t = Date.now()) {
  return !e.lifecycleTasksPrepared ||
    e.lifecycleTasksPreparedAt === null ||
    (e.autoRefreshIntervalMs > 0 && t - e.lifecycleTasksPreparedAt >= e.autoRefreshIntervalMs)
    ? null
    : e.lifecycleTasksPreparedAt;
}
function td(e, t, n = {}) {
  let r = n.retryDelayMs ?? md;
  ((e.lifecycleTaskRefreshFailed = t), (e.lifecycleTaskRefreshRetryAt = t ? Date.now() + r : null));
  let i = n.host;
  if (!i || (qu(i), !t || !n.requestUpdate || e.autoRefreshIntervalMs === 0)) return;
  let a = setTimeout(() => {
    (delete X(i).lifecycleTaskRetryTimer, n.requestUpdate?.());
  }, r);
  X(i).lifecycleTaskRetryTimer = a;
}
function nd(e, t, n = {}) {
  e.lifecycleTaskRefreshContinueAt = t ? Date.now() + hd : null;
  let r = n.host;
  if (!r || (Ju(r), !t || !n.requestUpdate)) return;
  let i = setTimeout(() => {
    (delete X(r).lifecycleTaskContinuationTimer, n.requestUpdate?.());
  }, hd);
  X(r).lifecycleTaskContinuationTimer = i;
}
function rd(e, t = Date.now()) {
  return (
    e.lifecycleTaskRefreshFailed &&
    e.lifecycleTaskRefreshRetryAt !== null &&
    t < e.lifecycleTaskRefreshRetryAt
  );
}
function id(e, t = Date.now()) {
  return e.lifecycleTaskRefreshContinueAt !== null && t < e.lifecycleTaskRefreshContinueAt;
}
function ad() {
  return {
    loading: !1,
    loaded: !1,
    loadAttempted: !1,
    mutationReadiness: `ready`,
    error: null,
    cards: [],
    statuses: w,
    tasksByCardId: new Map(),
    missingTaskIds: new Set(),
    lastDispatchSummary: null,
    dispatching: !1,
    query: ``,
    priorityFilter: `all`,
    agentFilter: `all`,
    viewPreset: `all`,
    activeHealthHighlight: null,
    showArchived: !1,
    layout: `compact`,
    hideEmptyColumns: !1,
    autoRefreshIntervalMs: 0,
    lastRefreshAt: null,
    lastRefreshStartedAt: null,
    lastRefreshError: null,
    lastRefreshSource: null,
    pollRefreshInProgress: !1,
    lifecycleTasksPrepared: !1,
    lifecycleTasksPreparedAt: null,
    lifecycleTaskRefreshFailed: !1,
    lifecycleTaskRefreshRetryAt: null,
    lifecycleTaskRefreshContinueAt: null,
    lifecycleTaskRefreshError: null,
    lifecycleConfirmedTaskIds: new Set(),
    lifecycleTaskConfirmationStartedAt: null,
    draftOpen: !1,
    draftSaving: !1,
    editingCardId: null,
    draftTitle: ``,
    draftNotes: ``,
    draftStatus: `todo`,
    draftPriority: `normal`,
    draftLabels: ``,
    draftAgentId: ``,
    draftSessionKey: ``,
    draftTemplateId: ``,
    draftCommentBody: ``,
    detailCardId: null,
    detailCommentBody: ``,
    busyCardIds: new Set(),
    draggedCardId: null,
    syncingCardIds: new Set(),
    capturingSessionKeys: new Set(),
  };
}
function X(e) {
  let t = fd.get(e);
  return (
    t ||
      ((t = {
        lifecycleWrites: new Set(),
        pendingStatusTransitions: new Set(),
        lifecycleSyncKeys: new Map(),
      }),
      fd.set(e, t)),
    t
  );
}
function Z(e) {
  let t = X(e);
  return ((t.state ??= ad()), t.state);
}
function Q(e) {
  return e.mutationReadiness === `ready`;
}
function od(e) {
  return !!(
    e.draftSaving ||
    e.busyCardIds.size ||
    e.syncingCardIds.size ||
    e.capturingSessionKeys.size
  );
}
function sd(e) {
  return !!X(e).loadPromise;
}
function cd(e, t) {
  return !!(t.draftOpen || t.editingCardId || t.draggedCardId || t.dispatching || od(t) || sd(e));
}
function ld(e) {
  return (
    e.tasksByCardId.size > 0 ||
    e.cards.some((t) => {
      let n = H(t.taskId);
      return !!(n && !e.missingTaskIds.has(n));
    })
  );
}
function ud(e) {
  return ld(e) || e.cards.some((e) => e.status === `running` && !!V(e));
}
function dd(e, t = {}) {
  return e.cards.every((n) => {
    let r = H(n.taskId);
    return r
      ? e.missingTaskIds.has(r) || e.tasksByCardId.has(n.id)
      : !t.requireRunningTaskDiscovery ||
          n.status !== `running` ||
          !V(n) ||
          e.tasksByCardId.has(n.id);
  });
}
var fd,
  pd,
  md,
  hd,
  gd = e(() => {
    (U(),
      Ou(),
      (fd = new WeakMap()),
      (pd = `Task confirmation exceeded its freshness window.`),
      (md = 5e3),
      (hd = 100));
  });
function _d(e) {
  return Array.isArray(e) ? e.filter((e) => typeof e == `string` && e.trim() !== ``) : [];
}
function vd(e) {
  if (!(!G(e) || typeof e.unrestricted != `boolean`)) {
    if (e.unrestricted) return { unrestricted: !0 };
    if (!(!Array.isArray(e.roots) || typeof e.writable != `boolean`))
      return {
        unrestricted: !1,
        roots: e.roots.filter((e) => typeof e == `string`),
        writable: e.writable,
      };
  }
}
function yd(e) {
  if (!G(e)) return;
  let t = G(e.workspace)
      ? {
          kind:
            e.workspace.kind === `scratch` ||
            e.workspace.kind === `dir` ||
            e.workspace.kind === `worktree`
              ? e.workspace.kind
              : void 0,
          ...(typeof e.workspace.path == `string` ? { path: e.workspace.path } : {}),
          ...(typeof e.workspace.branch == `string` ? { branch: e.workspace.branch } : {}),
          ...(typeof e.workspace.sourcePath == `string`
            ? { sourcePath: e.workspace.sourcePath }
            : {}),
          ...(typeof e.workspace.sourceBranch == `string`
            ? { sourceBranch: e.workspace.sourceBranch }
            : {}),
        }
      : void 0,
    n = vd(e.workspaceAccess),
    r = _d(e.skills),
    i = _d(e.createdCardIds),
    a = {
      ...(typeof e.tenant == `string` ? { tenant: e.tenant } : {}),
      ...(typeof e.boardId == `string` ? { boardId: e.boardId } : {}),
      ...(typeof e.createdByCardId == `string` ? { createdByCardId: e.createdByCardId } : {}),
      ...(typeof e.idempotencyKey == `string` ? { idempotencyKey: e.idempotencyKey } : {}),
      ...(r.length ? { skills: r } : {}),
      ...(t?.kind ? { workspace: t } : {}),
      ...(n ? { workspaceAccess: n } : {}),
      ...(typeof e.maxRuntimeSeconds == `number` ? { maxRuntimeSeconds: e.maxRuntimeSeconds } : {}),
      ...(typeof e.maxRetries == `number` ? { maxRetries: e.maxRetries } : {}),
      ...(typeof e.scheduledAt == `number` ? { scheduledAt: e.scheduledAt } : {}),
      ...(typeof e.summary == `string` ? { summary: e.summary } : {}),
      ...(i.length ? { createdCardIds: i } : {}),
      ...(typeof e.dispatchCount == `number` ? { dispatchCount: e.dispatchCount } : {}),
      ...(typeof e.lastDispatchAt == `number` ? { lastDispatchAt: e.lastDispatchAt } : {}),
    };
  return Object.keys(a).length ? a : void 0;
}
function bd(e) {
  return !G(e) ||
    (e.kind !== `claim` &&
      e.kind !== `unblock` &&
      e.kind !== `promote` &&
      e.kind !== `reclaim` &&
      e.kind !== `reassign` &&
      e.kind !== `add_proof` &&
      e.kind !== `open_session`) ||
    typeof e.label != `string`
    ? null
    : { kind: e.kind, label: e.label };
}
var xd = e(() => {
  K();
});
function Sd(e) {
  if (!G(e)) return;
  let t = typeof e.id == `string` && e.id.trim() ? e.id.trim() : ``,
    n = xe.includes(e.engine) ? e.engine : null,
    r = oe.includes(e.mode) ? e.mode : null,
    i = me.includes(e.status) ? e.status : `idle`,
    a = typeof e.model == `string` && e.model.trim() ? e.model.trim() : ``,
    o = typeof e.startedAt == `number` ? e.startedAt : 0,
    s = typeof e.updatedAt == `number` ? e.updatedAt : o;
  if (!(!t || !n || !r || !a || !o))
    return {
      id: t,
      kind: `agent-session`,
      engine: n,
      mode: r,
      status: i,
      model: a,
      startedAt: o,
      updatedAt: s,
      ...(typeof e.sessionKey == `string` ? { sessionKey: e.sessionKey } : {}),
      ...(typeof e.runId == `string` ? { runId: e.runId } : {}),
    };
}
function Cd(e) {
  if (!G(e)) return null;
  let t = typeof e.id == `string` && e.id.trim() ? e.id.trim() : ``,
    n = ge.includes(e.kind) ? e.kind : null,
    r = typeof e.at == `number` && Number.isFinite(e.at) ? e.at : 0;
  if (!t || !n || !r) return null;
  let i = w.includes(e.fromStatus) ? e.fromStatus : void 0,
    a = w.includes(e.toStatus) ? e.toStatus : void 0;
  return {
    id: t,
    kind: n,
    at: r,
    ...(i ? { fromStatus: i } : {}),
    ...(a ? { toStatus: a } : {}),
    ...(typeof e.sessionKey == `string` ? { sessionKey: e.sessionKey } : {}),
    ...(typeof e.runId == `string` ? { runId: e.runId } : {}),
  };
}
function wd(e) {
  return Array.isArray(e) ? e.map(Cd).filter((e) => e !== null) : [];
}
function Td(e) {
  return e === `idle` || e === `running` || e === `completed` || e === `blocked` || e === `violated`
    ? e
    : void 0;
}
function Ed(e) {
  if (!G(e)) return;
  let t = Array.isArray(e.attempts)
      ? e.attempts.flatMap((e) => {
          if (!G(e) || typeof e.id != `string` || typeof e.startedAt != `number`) return [];
          let t = be.includes(e.status) ? e.status : `running`;
          return [
            {
              id: e.id,
              status: t,
              startedAt: e.startedAt,
              ...(typeof e.endedAt == `number` ? { endedAt: e.endedAt } : {}),
              ...(xe.includes(e.engine) ? { engine: e.engine } : {}),
              ...(oe.includes(e.mode) ? { mode: e.mode } : {}),
              ...(typeof e.model == `string` ? { model: e.model } : {}),
              ...(typeof e.sessionKey == `string` ? { sessionKey: e.sessionKey } : {}),
              ...(typeof e.runId == `string` ? { runId: e.runId } : {}),
              ...(typeof e.error == `string` ? { error: e.error } : {}),
            },
          ];
        })
      : [],
    n = Array.isArray(e.comments)
      ? e.comments.flatMap((e) =>
          !G(e) ||
          typeof e.id != `string` ||
          typeof e.body != `string` ||
          typeof e.createdAt != `number`
            ? []
            : [
                {
                  id: e.id,
                  body: e.body,
                  createdAt: e.createdAt,
                  ...(typeof e.updatedAt == `number` ? { updatedAt: e.updatedAt } : {}),
                },
              ],
        )
      : [],
    r = Array.isArray(e.links)
      ? e.links.flatMap((e) =>
          !G(e) || typeof e.id != `string` || typeof e.createdAt != `number`
            ? []
            : [
                {
                  id: e.id,
                  type: Se.includes(e.type) ? e.type : `relates_to`,
                  createdAt: e.createdAt,
                  ...(typeof e.targetCardId == `string` ? { targetCardId: e.targetCardId } : {}),
                  ...(typeof e.title == `string` ? { title: e.title } : {}),
                  ...(typeof e.url == `string` ? { url: e.url } : {}),
                },
              ],
        )
      : [],
    i = Array.isArray(e.proof)
      ? e.proof.flatMap((e) =>
          !G(e) || typeof e.id != `string` || typeof e.createdAt != `number`
            ? []
            : [
                {
                  id: e.id,
                  status: ve.includes(e.status) ? e.status : `unknown`,
                  createdAt: e.createdAt,
                  ...(typeof e.label == `string` ? { label: e.label } : {}),
                  ...(typeof e.command == `string` ? { command: e.command } : {}),
                  ...(typeof e.url == `string` ? { url: e.url } : {}),
                  ...(typeof e.note == `string` ? { note: e.note } : {}),
                },
              ],
        )
      : [],
    a = Array.isArray(e.artifacts)
      ? e.artifacts.flatMap((e) =>
          !G(e) || typeof e.id != `string` || typeof e.createdAt != `number`
            ? []
            : [
                {
                  id: e.id,
                  createdAt: e.createdAt,
                  ...(typeof e.label == `string` ? { label: e.label } : {}),
                  ...(typeof e.url == `string` ? { url: e.url } : {}),
                  ...(typeof e.path == `string` ? { path: e.path } : {}),
                  ...(typeof e.mimeType == `string` ? { mimeType: e.mimeType } : {}),
                },
              ],
        )
      : [],
    o = Array.isArray(e.attachments)
      ? e.attachments.flatMap((e) =>
          !G(e) ||
          typeof e.id != `string` ||
          typeof e.cardId != `string` ||
          typeof e.fileName != `string` ||
          typeof e.byteSize != `number` ||
          typeof e.createdAt != `number`
            ? []
            : [
                {
                  id: e.id,
                  cardId: e.cardId,
                  fileName: e.fileName,
                  byteSize: e.byteSize,
                  createdAt: e.createdAt,
                  ...(typeof e.mimeType == `string` ? { mimeType: e.mimeType } : {}),
                  ...(typeof e.note == `string` ? { note: e.note } : {}),
                },
              ],
        )
      : [],
    s = Array.isArray(e.workerLogs)
      ? e.workerLogs.flatMap((e) =>
          !G(e) ||
          typeof e.id != `string` ||
          typeof e.message != `string` ||
          typeof e.createdAt != `number`
            ? []
            : [
                {
                  id: e.id,
                  level:
                    e.level === `warning` || e.level === `error` || e.level === `info`
                      ? e.level
                      : `info`,
                  message: e.message,
                  createdAt: e.createdAt,
                  ...(typeof e.sessionKey == `string` ? { sessionKey: e.sessionKey } : {}),
                  ...(typeof e.runId == `string` ? { runId: e.runId } : {}),
                },
              ],
        )
      : [],
    c = G(e.workerProtocol) ? e.workerProtocol : null,
    l = Td(c?.state),
    u = l
      ? {
          state: l,
          updatedAt: typeof c?.updatedAt == `number` ? c.updatedAt : Date.now(),
          ...(typeof c?.detail == `string` ? { detail: c.detail } : {}),
        }
      : void 0,
    d =
      G(e.claim) &&
      typeof e.claim.ownerId == `string` &&
      typeof e.claim.token == `string` &&
      typeof e.claim.claimedAt == `number` &&
      typeof e.claim.lastHeartbeatAt == `number`
        ? {
            ownerId: e.claim.ownerId,
            token: e.claim.token,
            claimedAt: e.claim.claimedAt,
            lastHeartbeatAt: e.claim.lastHeartbeatAt,
            ...(typeof e.claim.expiresAt == `number` ? { expiresAt: e.claim.expiresAt } : {}),
          }
        : void 0,
    f = Array.isArray(e.diagnostics)
      ? e.diagnostics.flatMap((e) =>
          !G(e) || !fe.includes(e.kind) || !x.includes(e.severity) || typeof e.title != `string`
            ? []
            : [
                {
                  kind: e.kind,
                  severity: e.severity,
                  title: e.title,
                  detail: typeof e.detail == `string` ? e.detail : e.title,
                  firstSeenAt: typeof e.firstSeenAt == `number` ? e.firstSeenAt : Date.now(),
                  lastSeenAt: typeof e.lastSeenAt == `number` ? e.lastSeenAt : Date.now(),
                  count: typeof e.count == `number` ? e.count : 1,
                  actions: Array.isArray(e.actions)
                    ? e.actions.map(bd).filter((e) => e !== null)
                    : [],
                },
              ],
        )
      : [],
    p = Array.isArray(e.notifications)
      ? e.notifications.flatMap((e) =>
          !G(e) ||
          typeof e.id != `string` ||
          !se.includes(e.kind) ||
          typeof e.message != `string` ||
          typeof e.createdAt != `number`
            ? []
            : [
                {
                  id: e.id,
                  kind: e.kind,
                  message: e.message,
                  createdAt: e.createdAt,
                  ...(typeof e.sequence == `number` ? { sequence: e.sequence } : {}),
                  ...(typeof e.sessionKey == `string` ? { sessionKey: e.sessionKey } : {}),
                  ...(typeof e.runId == `string` ? { runId: e.runId } : {}),
                },
              ],
        )
      : [],
    m = G(e.stale)
      ? {
          detectedAt: typeof e.stale.detectedAt == `number` ? e.stale.detectedAt : Date.now(),
          ...(typeof e.stale.lastSessionUpdatedAt == `number`
            ? { lastSessionUpdatedAt: e.stale.lastSessionUpdatedAt }
            : {}),
          reason:
            typeof e.stale.reason == `string`
              ? e.stale.reason
              : `Session has not reported recent activity.`,
        }
      : void 0,
    h = yd(e.automation),
    g =
      typeof e.lifecycleStatusSourceUpdatedAt == `number` &&
      Number.isFinite(e.lifecycleStatusSourceUpdatedAt)
        ? Math.max(0, Math.trunc(e.lifecycleStatusSourceUpdatedAt))
        : void 0,
    _ = {
      ...(t.length ? { attempts: t } : {}),
      ...(n.length ? { comments: n } : {}),
      ...(r.length ? { links: r } : {}),
      ...(i.length ? { proof: i } : {}),
      ...(a.length ? { artifacts: a } : {}),
      ...(o.length ? { attachments: o } : {}),
      ...(s.length ? { workerLogs: s } : {}),
      ...(u ? { workerProtocol: u } : {}),
      ...(h ? { automation: h } : {}),
      ...(d ? { claim: d } : {}),
      ...(f.length ? { diagnostics: f } : {}),
      ...(p.length ? { notifications: p } : {}),
      ...(de.includes(e.templateId) ? { templateId: e.templateId } : {}),
      ...(typeof e.archivedAt == `number` ? { archivedAt: e.archivedAt } : {}),
      ...(m ? { stale: m } : {}),
      ...(g === void 0 ? {} : { lifecycleStatusSourceUpdatedAt: g }),
      ...(typeof e.failureCount == `number` ? { failureCount: e.failureCount } : {}),
    };
  return Object.keys(_).length ? _ : void 0;
}
var Dd = e(() => {
  (xd(), K(), Ou());
});
function Od(e) {
  if (!G(e)) return null;
  let t = typeof e.id == `string` ? e.id : ``,
    n = typeof e.title == `string` ? e.title : ``,
    r = w.includes(e.status) ? e.status : `todo`,
    i = le.includes(e.priority) ? e.priority : `normal`;
  if (!t || !n) return null;
  let a = Sd(e.execution),
    o = wd(e.events),
    s = Ed(e.metadata);
  return {
    id: t,
    title: n,
    status: r,
    priority: i,
    labels: Array.isArray(e.labels) ? e.labels.filter((e) => typeof e == `string`) : [],
    position: typeof e.position == `number` ? e.position : 0,
    createdAt: typeof e.createdAt == `number` ? e.createdAt : 0,
    updatedAt: typeof e.updatedAt == `number` ? e.updatedAt : 0,
    ...(typeof e.notes == `string` ? { notes: e.notes } : {}),
    ...(typeof e.agentId == `string` ? { agentId: e.agentId } : {}),
    ...(typeof e.sessionKey == `string` ? { sessionKey: e.sessionKey } : {}),
    ...(typeof e.runId == `string` ? { runId: e.runId } : {}),
    ...(typeof e.taskId == `string` ? { taskId: e.taskId } : {}),
    ...(typeof e.sourceUrl == `string` ? { sourceUrl: e.sourceUrl } : {}),
    ...(a ? { execution: a } : {}),
    ...(typeof e.startedAt == `number` ? { startedAt: e.startedAt } : {}),
    ...(typeof e.completedAt == `number` ? { completedAt: e.completedAt } : {}),
    ...(o.length ? { events: o } : {}),
    ...(s ? { metadata: s } : {}),
  };
}
function kd(e) {
  if (!G(e)) return { cards: [], statuses: w };
  let t = Array.isArray(e.cards) ? e.cards.map(Od).filter((e) => e !== null) : [],
    n = Array.isArray(e.statuses) ? e.statuses.filter((e) => w.includes(e)) : w;
  return { cards: t, statuses: n.length ? n : w };
}
function $(e) {
  let t = G(e) ? Od(e.card) : null;
  if (!t) throw Error(`workboard response did not include a card`);
  return t;
}
function Ad(e) {
  switch (e) {
    case `queued`:
    case `running`:
    case `completed`:
    case `failed`:
    case `cancelled`:
    case `timed_out`:
      return e;
    default:
      return null;
  }
}
function jd(e) {
  if (!G(e)) return null;
  let t = typeof e.id == `string` && e.id.trim() ? e.id.trim() : null,
    n = typeof e.taskId == `string` && e.taskId.trim() ? e.taskId.trim() : t,
    r = Ad(e.status);
  return !t || !n || !r
    ? null
    : {
        id: t,
        taskId: n,
        status: r,
        ...(typeof e.title == `string` ? { title: e.title } : {}),
        ...(typeof e.agentId == `string` ? { agentId: e.agentId } : {}),
        ...(typeof e.sessionKey == `string` ? { sessionKey: e.sessionKey } : {}),
        ...(typeof e.childSessionKey == `string` ? { childSessionKey: e.childSessionKey } : {}),
        ...(typeof e.ownerKey == `string` ? { ownerKey: e.ownerKey } : {}),
        ...(typeof e.runId == `string` ? { runId: e.runId } : {}),
        ...(typeof e.sourceId == `string` ? { sourceId: e.sourceId } : {}),
        ...(typeof e.updatedAt == `number` || typeof e.updatedAt == `string`
          ? { updatedAt: e.updatedAt }
          : {}),
        ...(typeof e.progressSummary == `string` ? { progressSummary: e.progressSummary } : {}),
        ...(typeof e.terminalSummary == `string` ? { terminalSummary: e.terminalSummary } : {}),
        ...(typeof e.error == `string` ? { error: e.error } : {}),
      };
}
function Md(e) {
  return !G(e) || !Array.isArray(e.tasks)
    ? { tasks: [], nextCursor: null }
    : {
        tasks: e.tasks.map(jd).filter((e) => e !== null),
        nextCursor:
          typeof e.nextCursor == `string` && e.nextCursor.trim() ? e.nextCursor.trim() : null,
      };
}
var Nd = e(() => {
  (Dd(), K(), Ou());
});
async function Pd(e) {
  let t = [],
    n = new Set(),
    r = null;
  for (;;) {
    let i = Md(await e.request(`tasks.list`, { limit: Qd, ...(r ? { cursor: r } : {}) }));
    if ((t.push(...i.tasks), !i.nextCursor || n.has(i.nextCursor))) return t;
    (n.add(i.nextCursor), (r = i.nextCursor));
  }
}
function Fd(e) {
  if (typeof e.updatedAt == `number`) return e.updatedAt;
  if (typeof e.updatedAt == `string`) {
    let t = Date.parse(e.updatedAt);
    return Number.isFinite(t) ? t : 0;
  }
  return 0;
}
function Id(e) {
  let t = Fd(e);
  return t > 0 ? t : void 0;
}
function Ld(e) {
  return typeof e.updatedAt == `number` && Number.isFinite(e.updatedAt) ? e.updatedAt : void 0;
}
function Rd(e, t) {
  return e ? (e === t ? !0 : t.startsWith(`subagent:workboard-`) && e.endsWith(`:${t}`)) : !1;
}
function zd(e, t) {
  let n = H(t.taskId);
  if (n && (e.taskId === n || e.id === n)) return !0;
  let r = V(t),
    i = r ? [e.sessionKey, e.childSessionKey, e.ownerKey].some((e) => Rd(e, r)) : !1,
    a = Lu(t);
  return a && e.runId === a ? (r ? i : !0) : i;
}
function Bd(e, t) {
  let n = H(t.taskId);
  if (n) return e.taskId === n || e.id === n;
  let r = Lu(t);
  return r && e.runId !== r ? !1 : zd(e, t);
}
function Vd(e, t, n) {
  let r = H(t.taskId);
  return r && n.has(r) ? zd(e, t) : Bd(e, t);
}
function Hd(e, t, n, r) {
  let i = X(e);
  if (t.length <= n) return ((i[r] = 0), [...t]);
  let a = (i[r] ?? 0) % t.length,
    o = Array.from({ length: n }, (e, n) => t[(a + n) % t.length]).filter((e) => e !== void 0);
  return ((i[r] = (a + o.length) % t.length), o);
}
function Ud(e, t, n, r) {
  let i = [],
    a = new Set();
  for (let e of t) {
    let t = n.get(e.id),
      o = t ? Vd(t, e, r) : !1,
      s;
    (o && t ? (s = t.taskId) : o || (s = H(e.taskId) ?? void 0),
      !(s && r.has(s)) && s && !a.has(s) && (a.add(s), i.push(s)));
  }
  return Hd(e, i, $d, `taskPollOffset`);
}
function Wd(e, t, n, r) {
  let i = [],
    a = new Set(),
    o = !1;
  for (let s of t) {
    let t = n.get(s.id),
      c = H(s.taskId),
      l = !!(c && !r.has(c)) || (t ? Vd(t, s, r) : !1),
      u = V(s);
    if (!(s.status !== `running` || l || !u))
      if (u.startsWith(`subagent:workboard-`)) {
        if (!o) {
          o = !0;
          let t = X(e).defaultTaskDiscoveryCursor;
          i.push(t ? { cursor: t } : {});
        }
      } else a.has(u) || (a.add(u), i.push({ sessionKey: u }));
  }
  return Hd(e, i, ef, `taskDiscoveryOffset`);
}
function Gd(e, t) {
  return (
    e instanceof Ie && e.gatewayCode === `INVALID_REQUEST` && e.message === `task not found: ${t}`
  );
}
async function Kd(e, t, n) {
  let r = await Promise.allSettled([
      ...t.map(async (t) => {
        try {
          let n = await e.request(`tasks.get`, { taskId: t }),
            r = G(n) ? jd(n.task) : null;
          return { tasks: r ? [r] : [] };
        } catch (e) {
          if (Gd(e, t)) return { tasks: [], missingTaskId: t };
          throw e;
        }
      }),
      ...n.map(async (t) => {
        let n = Md(await e.request(`tasks.list`, { ...t, limit: Qd }));
        return {
          tasks: n.tasks,
          ...(t.sessionKey ? {} : { nextUnfilteredCursor: n.nextCursor ?? null }),
        };
      }),
    ]),
    i = [],
    a = new Set(),
    o,
    s = null;
  for (let e of r)
    e.status === `fulfilled`
      ? (i.push(...e.value.tasks),
        `missingTaskId` in e.value && e.value.missingTaskId && a.add(e.value.missingTaskId),
        `nextUnfilteredCursor` in e.value && (o = e.value.nextUnfilteredCursor))
      : (s ??= W(e.reason));
  return { tasks: i, missingTaskIds: a, nextUnfilteredCursor: o, error: s };
}
function qd(e, t, n) {
  if (!t) return;
  let r = e.get(t) ?? [];
  (r.push(n), e.set(t, r));
}
function Jd(e) {
  let t = { byId: new Map(), byRunId: new Map(), bySessionKey: new Map() };
  for (let n of e) {
    (qd(t.byId, n.id, n), qd(t.byId, n.taskId, n), qd(t.byRunId, n.runId, n));
    for (let e of [n.sessionKey, n.childSessionKey, n.ownerKey]) {
      qd(t.bySessionKey, e, n);
      let r = e?.lastIndexOf(`:subagent:workboard-`) ?? -1;
      r >= 0 && qd(t.bySessionKey, e?.slice(r + 1), n);
    }
  }
  return t;
}
function Yd(e, t, n) {
  let r = H(t.taskId);
  if (r) {
    let i = null;
    for (let n of e.byId.get(r) ?? []) Bd(n, t) && (!i || Fd(n) > Fd(i)) && (i = n);
    if (i || !n?.has(r)) return i;
  }
  let i = new Set(),
    a = (e) => {
      for (let t of e ?? []) i.add(t);
    };
  (a(e.byRunId.get(Lu(t) ?? ``)), a(e.bySessionKey.get(V(t) ?? ``)));
  let o = null;
  for (let e of i) zd(e, t) && (!o || Fd(e) > Fd(o)) && (o = e);
  return o;
}
function Xd(e, t, n, r, i = new Map(), a = new Set(), o = $d) {
  let s = Jd(n),
    c = [],
    l = new Set();
  for (let e of t) {
    let t = i.get(e.id),
      n = t && Vd(t, e, r) && t ? t.taskId : H(e.taskId);
    !n || l.has(n) || r.has(n) || a.has(n) || Yd(s, e, r) || (l.add(n), c.push(n));
  }
  return Number.isFinite(o) ? Hd(e, c, o, `taskPollOffset`) : c;
}
function Zd(e, t, n = {}) {
  let r = new Map(),
    i = Jd(t),
    a = new Set([...e.missingTaskIds, ...(n.missingTaskIds ?? [])]),
    o = e.cards.map((e) => {
      let t = H(e.taskId),
        n = Yd(i, e, a);
      if (!n) return e;
      r.set(e.id, n);
      let o = !!(t && a.has(t)) && n.taskId !== t && n.id !== t;
      return (
        t && !o && a.delete(t),
        a.delete(n.taskId),
        e.taskId === n.taskId || o ? e : { ...e, taskId: n.taskId }
      );
    }),
    s = new Set(o.map((e) => H(e.taskId)).filter((e) => !!e));
  ((e.cards = o),
    (e.tasksByCardId = r),
    (e.missingTaskIds = new Set([...a].filter((e) => s.has(e)))));
}
var Qd,
  $d,
  ef,
  tf,
  nf = e(() => {
    (Be(), U(), K(), Nd(), gd(), (Qd = 500), ($d = 32), (ef = 4), (tf = [100, 250, 500]));
  });
function rf(e, t) {
  let n = V(e);
  return n ? (t.find((e) => e.key === n) ?? null) : null;
}
function af(e, t, n) {
  let r = rf(e, t);
  if (n)
    switch (n.status) {
      case `queued`:
      case `running`:
        if (r && (r.abortedLastRun || r.status === `done` || Fu(r.status))) break;
        return { session: r, state: `running`, targetStatus: `running`, sourceUpdatedAt: Id(n) };
      case `completed`:
        return { session: r, state: `succeeded`, targetStatus: `review`, sourceUpdatedAt: Id(n) };
      case `failed`:
      case `cancelled`:
      case `timed_out`:
        return { session: r, state: `failed`, targetStatus: `blocked`, sourceUpdatedAt: Id(n) };
    }
  return V(e)
    ? r
      ? Iu(r)
        ? { session: r, state: `stale`, targetStatus: `running`, sourceUpdatedAt: Ld(r) }
        : r.hasActiveRun === !0 || r.status === `running`
          ? { session: r, state: `running`, targetStatus: `running`, sourceUpdatedAt: Ld(r) }
          : r.abortedLastRun || Fu(r.status)
            ? { session: r, state: `failed`, targetStatus: `blocked`, sourceUpdatedAt: Ld(r) }
            : r.status === `done`
              ? { session: r, state: `succeeded`, targetStatus: `review`, sourceUpdatedAt: Ld(r) }
              : { session: r, state: `idle` }
      : { session: null, state: `missing` }
    : { session: null, state: `unlinked` };
}
function of(e, t) {
  return !t || e.status === t
    ? !1
    : t === `running`
      ? e.status === `backlog` || e.status === `todo` || e.status === `ready`
      : t === `blocked` || t === `review`
        ? e.status === `running` || e.status === `todo` || e.status === `ready`
        : !1;
}
function sf(e) {
  return X(e).pendingStatusTransitions;
}
function cf(e, t, n) {
  return !t || t.status === n ? !1 : (sf(e).add(t.id), !0);
}
function lf(e, t, n) {
  n && X(e).pendingStatusTransitions.delete(t);
}
function uf(e, t) {
  return X(e).pendingStatusTransitions.has(t);
}
function df(e, t) {
  if (t.sourceUpdatedAt === void 0) return !1;
  let n = e.metadata?.lifecycleStatusSourceUpdatedAt;
  if (n !== void 0) return t.sourceUpdatedAt < n;
  let r = pf(e);
  return r !== void 0 && t.sourceUpdatedAt < r;
}
function ff(e, t, n) {
  return uf(e, t.id) || df(t, n);
}
function pf(e) {
  for (let t = (e.events?.length ?? 0) - 1; t >= 0; --t) {
    let n = e.events?.[t];
    if (
      (n?.kind === `moved` || n?.kind === `created`) &&
      ((n.kind === `created` && e.status !== `todo`) ||
        (n.kind === `moved` && n.fromStatus !== n.toStatus)) &&
      n.toStatus === e.status &&
      typeof n.at == `number` &&
      Number.isFinite(n.at)
    )
      return n.at;
  }
}
function mf(e) {
  switch (e.state) {
    case `running`:
    case `stale`:
      return `running`;
    case `succeeded`:
      return `review`;
    case `failed`:
      return `blocked`;
    case `missing`:
      return;
    case `idle`:
      return `idle`;
    case `unlinked`:
      return;
  }
}
function hf(e, t) {
  return !!(e.execution && t && e.execution.status !== t);
}
function gf(e, t) {
  let n = t.session;
  return [
    e.id,
    e.status,
    e.updatedAt,
    t.targetStatus ?? ``,
    t.state,
    n?.status ?? ``,
    n?.hasActiveRun === !0 ? `active` : `idle`,
    n?.updatedAt ?? ``,
    t.sourceUpdatedAt ?? ``,
    e.execution?.status ?? ``,
    e.execution?.updatedAt ?? ``,
  ].join(`:`);
}
function _f(e) {
  return X(e).lifecycleSyncKeys;
}
function vf(e, t) {
  e.metadata = { ...(G(e.metadata) ? e.metadata : {}), ...t };
}
var yf = e(() => {
  (U(), K(), gd(), nf());
});
function bf(e) {
  return !!(
    e.metadata?.proof?.length ||
    e.metadata?.artifacts?.length ||
    e.metadata?.attachments?.length
  );
}
function xf(e) {
  return e?.status === `failed` || e?.status === `cancelled` || e?.status === `timed_out`;
}
function Sf(e, t) {
  if (!t || !xf(t)) return !1;
  let n = [t.sessionKey, t.childSessionKey, t.ownerKey];
  return !!e.metadata?.attempts?.some((e) =>
    e.status !== `failed` && e.status !== `blocked` && e.status !== `stopped`
      ? !1
      : t.runId && e.runId
        ? e.runId === t.runId
        : !!(e.sessionKey && n.some((t) => Rd(t, e.sessionKey ?? ``))),
  );
}
function Cf(e) {
  return e.metadata?.failureCount === void 0
    ? (e.metadata?.attempts?.filter(
        (e) => e.status === `failed` || e.status === `blocked` || e.status === `stopped`,
      ).length ?? 0)
    : e.metadata.failureCount;
}
function wf(e) {
  if (e.status !== `done`) return !1;
  let t = e.completedAt ?? e.updatedAt;
  return Date.now() - t <= Of;
}
function Tf(e) {
  let t = {
    running: 0,
    blocked: 0,
    stale: 0,
    readyUnassigned: 0,
    missingProof: 0,
    failedAttempts: 0,
  };
  for (let n of e.cards) {
    let r = e.tasksByCardId.get(n.id);
    (Ef(n, `running`, e.sessions, r) && (t.running += 1),
      Ef(n, `blocked`, e.sessions, r) && (t.blocked += 1),
      Ef(n, `stale`, e.sessions, r) && (t.stale += 1),
      Ef(n, `readyUnassigned`, e.sessions, r) && (t.readyUnassigned += 1),
      Ef(n, `missingProof`, e.sessions, r) && (t.missingProof += 1),
      (t.failedAttempts += Cf(n)),
      xf(r) && !Sf(n, r) && (t.failedAttempts += 1));
  }
  return t;
}
function Ef(e, t, n, r) {
  let i = af(e, n, r);
  switch (t) {
    case `running`:
      return e.status === `running` || i.state === `running`;
    case `blocked`:
      return e.status === `blocked`;
    case `stale`:
      return !!(e.metadata?.stale || i.state === `stale`);
    case `readyUnassigned`:
      return e.status === `ready` && !e.agentId?.trim() && !e.metadata?.claim;
    case `missingProof`:
      return e.status === `done` && !bf(e);
    case `failedAttempts`:
      return Cf(e) > 0 || xf(r);
  }
  return !1;
}
function Df(e) {
  let t = e.defaultAgentId?.trim();
  return e.cards.filter((n) => {
    let r = e.tasksByCardId.get(n.id),
      i = af(n, e.sessions, r);
    switch (e.preset) {
      case `all`:
        return !0;
      case `default_agent`:
        return t ? n.agentId === t || !n.agentId?.trim() : !n.agentId;
      case `ready`:
        return n.status === `ready`;
      case `running`:
        return n.status === `running` || i.state === `running`;
      case `blocked`:
        return n.status === `blocked`;
      case `review`:
        return n.status === `review`;
      case `stale`:
        return !!n.metadata?.stale || i.state === `stale`;
      case `missing_proof`:
        return n.status === `done` && !bf(n);
      case `recently_done`:
        return wf(n);
    }
    return !1;
  });
}
var Of,
  kf = e(() => {
    (yf(), nf(), (Of = 10080 * 60 * 1e3));
  });
async function Af(e) {
  return await jf(e);
}
async function jf(e, t) {
  let n = X(e.host),
    r = Z(e.host);
  if (!e.client || r.dispatching || od(r) || (!e.force && (r.loaded || r.loadAttempted))) return !1;
  let i = e.client,
    a = n.loadPromise;
  if (a) {
    let t = n.loadGeneration,
      i = await a,
      o = t !== void 0 && q(e.host, t),
      s = n.loadToken,
      c = t !== void 0 && s?.queuedAfterGeneration === t && !!n.loadPromise;
    return e.force && (o || c) && !r.dispatching && !od(r) ? await jf(e, t) : i;
  }
  let o = zu(e.host),
    s = { queuedAfterGeneration: t };
  n.loadToken = s;
  let c = r.lastRefreshError;
  ((r.loadAttempted = !0),
    (r.loading = !0),
    e.preserveError || (delete n.loadError, (r.error = null)),
    (e.taskRefresh !== `linked` || !r.lifecycleTaskRefreshFailed) && (r.lastRefreshError = null),
    e.requestUpdate?.());
  let l = (async () => {
    try {
      if (e.refreshDiagnostics)
        try {
          await i.request(`workboard.cards.diagnostics.refresh`, {});
        } catch (t) {
          q(e.host, o) && (r.lastRefreshError = W(t));
        }
      let t = kd(await i.request(`workboard.cards.list`, {}));
      if (!q(e.host, o)) return !1;
      let a = r.tasksByCardId,
        s = { cards: t.cards, tasksByCardId: new Map(), missingTaskIds: new Set(r.missingTaskIds) },
        l = r.lifecycleTaskRefreshFailed,
        u = !1,
        d = null,
        f;
      if (s.cards.length > 0) {
        let t = s.cards.flatMap((e) => {
          let t = a.get(e.id);
          return t && Vd(t, e, s.missingTaskIds) ? [t] : [];
        });
        try {
          let n =
              e.taskRefresh === `linked`
                ? await Kd(
                    i,
                    Ud(e.host, s.cards, a, s.missingTaskIds),
                    Wd(e.host, s.cards, a, s.missingTaskIds),
                  )
                : null,
            o,
            c,
            p;
          if (n)
            ((o = [...n.tasks, ...t.filter((e) => !n.missingTaskIds.has(e.taskId))]),
              (c = n.missingTaskIds),
              (p = n.error));
          else {
            let n = await Pd(i),
              r = await Kd(i, Xd(e.host, s.cards, n, s.missingTaskIds, a), []),
              l = r.error ? t.filter((e) => !r.missingTaskIds.has(e.taskId)) : [];
            ((o = [...n, ...r.tasks, ...l]), (c = r.missingTaskIds), (p = r.error));
          }
          ((f = n?.nextUnfilteredCursor),
            Zd(s, o, { missingTaskIds: c }),
            (u = e.taskRefresh === `linked` && r.lifecycleTaskRefreshFailed && !p && ud(s)),
            (l = !!p || u),
            p && (d = p));
        } catch (e) {
          (Zd(s, t), (l = !0), (d = W(e)));
        }
      } else l = !1;
      if (!q(e.host, o) || (e.taskRefresh === `linked` && Pf(r))) return !1;
      (f !== void 0 &&
        (f ? (n.defaultTaskDiscoveryCursor = f) : delete n.defaultTaskDiscoveryCursor),
        (r.cards = s.cards),
        (r.statuses = t.statuses),
        (r.tasksByCardId = s.tasksByCardId),
        (r.missingTaskIds = s.missingTaskIds),
        Y(r, { host: e.host }));
      let p = r.lifecycleTaskRefreshFailed && !l;
      (u || td(r, l, { host: e.host, requestUpdate: e.requestUpdate }),
        l ||
          ((r.lifecycleTaskRefreshError = null),
          p && r.lastRefreshError === c && (r.lastRefreshError = null)),
        d && ((r.lifecycleTaskRefreshError = d), (r.lastRefreshError = d)),
        $u(r, !l && dd(s, { requireRunningTaskDiscovery: e.taskRefresh === `linked` }), {
          host: e.host,
          requestUpdate: e.requestUpdate,
        }));
      let m = n.loadError;
      return (
        m !== void 0 && r.error === m && (r.error = null),
        delete n.loadError,
        (r.mutationReadiness = r.editingCardId ? `stale_edit_draft` : `ready`),
        (r.loaded = !0),
        !0
      );
    } catch (t) {
      if (q(e.host, o)) {
        let i = W(t);
        e.preserveError ? (r.lastRefreshError = i) : ((n.loadError = i), (r.error = i));
      }
      return !1;
    } finally {
      let t = q(e.host, o),
        i = n.loadToken === s;
      (!t && !r.loaded && (r.loadAttempted = !1),
        (t || (i && !r.draftSaving)) && (r.loading = !1),
        i && (delete n.loadPromise, delete n.loadToken),
        e.requestUpdate?.());
    }
  })();
  return ((n.loadPromise = l), await l);
}
async function Mf(e) {
  let t = Z(e.host),
    n = e.source === `poll` ? (e.pollGeneration ?? Vu(e.host)) : null;
  if (!(n !== null && !Hu(e.host, n)) && !(t.dispatching || od(t))) {
    if (
      ((t.lastRefreshStartedAt = Date.now()),
      (t.lastRefreshSource = e.source),
      (e.source !== `poll` || !t.lifecycleTaskRefreshFailed) && (t.lastRefreshError = null),
      e.source === `poll` && (t.pollRefreshInProgress = !0),
      e.requestUpdate?.(),
      !e.client)
    ) {
      ((t.lastRefreshError = `Gateway client unavailable`),
        n !== null && Hu(e.host, n) && (t.pollRefreshInProgress = !1),
        e.requestUpdate?.());
      return;
    }
    try {
      let n = await Af({
        host: e.host,
        client: e.client,
        requestUpdate: e.requestUpdate,
        force: !0,
        refreshDiagnostics: e.refreshDiagnostics,
        taskRefresh: e.source === `poll` ? `linked` : `all`,
        preserveError: e.source === `poll`,
      });
      ((t.lastRefreshSource = e.source),
        e.source !== `poll` && t.error
          ? (t.lastRefreshError = t.error)
          : n && (t.lastRefreshAt = Date.now()));
    } finally {
      (n !== null && Hu(e.host, n) && (t.pollRefreshInProgress = !1), e.requestUpdate?.());
    }
  }
}
function Nf() {
  return typeof document < `u` && document.visibilityState === `hidden`;
}
function Pf(e) {
  return !!(
    e.draftOpen ||
    e.editingCardId ||
    od(e) ||
    e.draggedCardId ||
    e.dispatching ||
    e.detailCommentBody.trim() ||
    e.draftCommentBody.trim()
  );
}
function Ff(e) {
  let t = X(e),
    n = t.pollingTimer;
  n && (clearTimeout(n), delete t.pollingTimer);
}
function If(e) {
  Ff(e);
  let t = X(e),
    n = t.pollingEntry;
  if (!n?.enabled || !n.client || n.intervalMs <= 0) return;
  let r = Vu(e);
  t.pollingTimer = setTimeout(() => {
    if ((delete t.pollingTimer, !Hu(e, r))) return;
    let n = t.pollingEntry,
      i = Z(e);
    !n?.enabled ||
      !n.client ||
      n.intervalMs <= 0 ||
      (async () => {
        !Nf() &&
          !Pf(i) &&
          (await Mf({
            host: e,
            client: n.client,
            requestUpdate: n.requestUpdate,
            source: `poll`,
            pollGeneration: r,
          }));
      })().finally(() => {
        Hu(e, r) && If(e);
      });
  }, n.intervalMs);
}
function Lf(e) {
  let t = X(e.host),
    n = Z(e.host),
    r = n.autoRefreshIntervalMs,
    i = t.pollingEntry,
    a = e.enabled && r > 0;
  if (
    ((t.pollingEntry = {
      client: e.client,
      enabled: a,
      intervalMs: r,
      requestUpdate: e.requestUpdate,
    }),
    !a)
  ) {
    (Ff(e.host), Ku(e.host), qu(e.host));
    return;
  }
  let o = !i || i.enabled !== a || i.intervalMs !== r || i.client !== e.client;
  !n.pollRefreshInProgress && (o || !t.pollingTimer) && If(e.host);
}
function Rf(e) {
  let t = X(e);
  (Bu(e), Ff(e), delete t.pollingEntry);
  let n = t.state;
  n?.pollRefreshInProgress &&
    ((n.pollRefreshInProgress = !1),
    (n.loading = !1),
    n.loaded || (n.loadAttempted = !1),
    zu(e),
    delete t.loadPromise,
    delete t.loadToken);
}
var zf = e(() => {
  (K(), Nd(), gd(), nf());
});
function Bf(e) {
  return typeof e == `string`
    ? e
    : Array.isArray(e)
      ? e
          .map((e) =>
            G(e)
              ? typeof e.text == `string`
                ? e.text
                : typeof e.content == `string`
                  ? e.content
                  : ``
              : ``,
          )
          .filter(Boolean)
          .join(`
`)
          .trim()
      : ``;
}
function Vf(e, t, n) {
  let r = n === `first` ? e : e.toReversed();
  for (let e of r) {
    if (!G(e) || e.role !== t) continue;
    let n = Bf(e.content).trim();
    if (n) return n;
  }
  return null;
}
function Hf(e) {
  let t = e.replace(/\s+/g, ` `).trim();
  return t.length <= Zf ? t : `${te(t, Zf - 3).trimEnd()}...`;
}
function Uf(e) {
  let t = e.replace(/\s+/g, ` `).trim();
  return t.length <= Qf ? t : `${te(t, Qf - 3).trimEnd()}...`;
}
function Wf(e, t) {
  return Uf(H(e.label) ?? H(e.displayName) ?? t ?? e.key);
}
function Gf(e) {
  return e.hasActiveRun === !0 || e.status === `running`
    ? `running`
    : e.abortedLastRun || Fu(e.status)
      ? `blocked`
      : e.status === `done`
        ? `review`
        : `todo`;
}
async function Kf(e) {
  try {
    let t = await e.client.request(`chat.history`, {
      sessionKey: e.sessionKey,
      limit: Yf,
      maxChars: Xf,
    });
    return G(t) && Array.isArray(t.messages) ? t.messages : [];
  } catch {
    return [];
  }
}
function qf(e) {
  let t = [`Session: ${e.session.key}`];
  return (
    e.recentUserText && t.push(``, `Recent user prompt: ${Hf(e.recentUserText)}`),
    e.lastAssistantText && t.push(``, `Latest assistant note: ${Hf(e.lastAssistantText)}`),
    t.join(`
`)
  );
}
async function Jf(e) {
  let t = Z(e.host);
  if (!e.client || e.session.kind === `global` || t.dispatching) return null;
  if (t.capturingSessionKeys.has(e.session.key))
    return t.cards.find((t) => V(t) === e.session.key) ?? null;
  t.error = null;
  let n = !1;
  try {
    if (
      (t.loaded ||
        (await Zu(e.host),
        await Af({ host: e.host, client: e.client, requestUpdate: e.requestUpdate, force: !0 })),
      !t.loaded || t.dispatching)
    )
      return null;
    if (t.capturingSessionKeys.has(e.session.key))
      return t.cards.find((t) => V(t) === e.session.key) ?? null;
    (t.capturingSessionKeys.add(e.session.key), (n = !0), e.requestUpdate?.());
    let r = t.cards.find((t) => V(t) === e.session.key);
    if (r) {
      if (r.metadata?.archivedAt) {
        J(e.host);
        let n = $(await e.client.request(`workboard.cards.archive`, { id: r.id, archived: !1 }));
        return (B(t, n), n);
      }
      return r;
    }
    let i = await Kf({ client: e.client, sessionKey: e.session.key }),
      a = Vf(i, `user`, `last`),
      o = Vf(i, `assistant`, `last`);
    J(e.host);
    let s = $(
      await e.client.request(`workboard.cards.create`, {
        title: Wf(e.session, a),
        notes: qf({ session: e.session, recentUserText: a, lastAssistantText: o }),
        status: Gf(e.session),
        priority: `normal`,
        agentId: ``,
        sessionKey: e.session.key,
      }),
    );
    return (B(t, s), s);
  } catch (e) {
    return ((t.error = W(e)), null);
  } finally {
    n && (t.capturingSessionKeys.delete(e.session.key), e.requestUpdate?.());
  }
}
var Yf,
  Xf,
  Zf,
  Qf,
  $f = e(() => {
    (y(), U(), zf(), K(), Nd(), gd(), (Yf = 40), (Xf = 6e3), (Zf = 700), (Qf = 180));
  });
async function ep(e, t) {
  let n = X(e.host),
    r = n.lifecycleTaskRefreshPromise;
  if (r) return await r;
  let i = (async () => {
    let n = zu(e.host);
    try {
      let r = t.tasksByCardId,
        i = Date.now(),
        a =
          t.lifecycleTaskConfirmationStartedAt !== null &&
          i - t.lifecycleTaskConfirmationStartedAt >= 5e3;
      if (t.lifecycleTaskRefreshContinueAt !== null && a)
        return (
          Y(t, { host: e.host }),
          td(t, !0, { host: e.host, requestUpdate: e.requestUpdate }),
          (t.lifecycleTaskRefreshError = pd),
          e.requestUpdate?.(),
          null
        );
      (t.lifecycleTaskConfirmationStartedAt === null || a) &&
        (Y(t), (t.lifecycleTaskConfirmationStartedAt = i));
      let o = [...r.values()].filter((e) => t.lifecycleConfirmedTaskIds.has(e.taskId)),
        s = { cards: t.cards, tasksByCardId: new Map(), missingTaskIds: new Set(t.missingTaskIds) },
        c = await Pd(e.client),
        l = await Kd(
          e.client,
          Xd(e.host, s.cards, c, s.missingTaskIds, r, t.lifecycleConfirmedTaskIds),
          [],
        ),
        u = l.error
          ? s.cards.flatMap((e) => {
              let t = r.get(e.id);
              return t && !l.missingTaskIds.has(t.taskId) && Vd(t, e, s.missingTaskIds) ? [t] : [];
            })
          : [];
      if (
        (Zd(s, [...c, ...o, ...l.tasks, ...u], { missingTaskIds: l.missingTaskIds }),
        !q(e.host, n) || cd(e.host, t))
      )
        return null;
      ((t.cards = s.cards),
        (t.tasksByCardId = s.tasksByCardId),
        (t.missingTaskIds = s.missingTaskIds));
      for (let e of l.tasks) t.lifecycleConfirmedTaskIds.add(e.taskId);
      for (let e of l.missingTaskIds) t.lifecycleConfirmedTaskIds.add(e);
      if (l.error)
        return (
          Y(t, { host: e.host }),
          td(t, !0, { host: e.host, requestUpdate: e.requestUpdate }),
          (t.lifecycleTaskRefreshError = l.error),
          e.requestUpdate?.(),
          null
        );
      if (!dd(s)) return (nd(t, !0, { host: e.host, requestUpdate: e.requestUpdate }), null);
      Y(t, { host: e.host });
      let d = t.lifecycleTaskRefreshError;
      return (
        td(t, !1, { host: e.host }),
        (t.lifecycleTaskRefreshError = null),
        d !== null && t.lastRefreshError === d && (t.lastRefreshError = null),
        e.requestUpdate?.(),
        Date.now()
      );
    } catch (r) {
      return !q(e.host, n) || cd(e.host, t)
        ? null
        : (Y(t, { host: e.host }),
          td(t, !0, { host: e.host, requestUpdate: e.requestUpdate }),
          (t.lifecycleTaskRefreshError = W(r)),
          e.requestUpdate?.(),
          null);
    }
  })();
  n.lifecycleTaskRefreshPromise = i;
  try {
    return await i;
  } finally {
    n.lifecycleTaskRefreshPromise === i && delete n.lifecycleTaskRefreshPromise;
  }
}
async function tp(e) {
  let t = Z(e.host),
    n = rd(t),
    r = id(t);
  if (!e.client || !t.loaded || ((n || r) && ld(t)) || cd(e.host, t)) return;
  let i = Wu(e.host),
    a = ed(t),
    o = a !== null;
  if (
    ($u(t, !1, { host: e.host }),
    !o &&
      !n &&
      !r &&
      ud(t) &&
      ((a = await ep({ host: e.host, client: e.client, requestUpdate: e.requestUpdate }, t)),
      a === null && ld(t)))
  ) {
    !t.lifecycleTaskRefreshFailed && Gu(e.host, i) && !cd(e.host, t) && e.requestUpdate?.();
    return;
  }
  if (!Gu(e.host, i) || cd(e.host, t)) return;
  if (e.canWrite === !1) {
    $u(t, !0, { host: e.host, preparedAt: a ?? Date.now(), requestUpdate: e.requestUpdate });
    return;
  }
  let s = _f(e.host),
    c = !1;
  for (let n of t.cards) {
    if (!Gu(e.host, i) || cd(e.host, t)) return;
    let r = af(n, e.sessions, t.tasksByCardId.get(n.id)),
      o = mf(r),
      l = {};
    (r.sourceUpdatedAt !== void 0 &&
      !ff(e.host, n, r) &&
      of(n, r.targetStatus) &&
      ((l.status = r.targetStatus), vf(l, { lifecycleStatusSourceUpdatedAt: r.sourceUpdatedAt })),
      hf(n, o) && (l.execution = { ...n.execution, status: o, updatedAt: Date.now() }));
    let u = r.session ? Iu(r.session) : void 0,
      d = n.metadata?.stale;
    if (
      (u
        ? (!d || d.lastSessionUpdatedAt !== u.lastSessionUpdatedAt || d.reason !== u.reason) &&
          vf(l, { stale: { ...u, detectedAt: d?.detectedAt ?? u.detectedAt } })
        : d && vf(l, { stale: null }),
      Object.keys(l).length === 0)
    )
      continue;
    let f = gf(n, r);
    if (s.get(n.id) === f || t.syncingCardIds.has(n.id)) continue;
    let p = zu(e.host);
    ((c = !0), t.syncingCardIds.add(n.id), e.requestUpdate?.());
    let m = null;
    try {
      ((m = e.client.request(`workboard.cards.update`, { id: n.id, patch: l })), Yu(e.host, m));
      let a = await m,
        o = t.cards.find((e) => e.id === n.id),
        c = $(a);
      if (
        !o ||
        !q(e.host, p) ||
        !Gu(e.host, i) ||
        uf(e.host, o.id) ||
        (o.status !== n.status && c.status !== o.status) ||
        (df(o, r) && c.status !== o.status)
      )
        continue;
      (B(t, c), s.set(n.id, f));
    } catch (r) {
      Gu(e.host, i) && ((t.error = W(r)), s.set(n.id, f));
    } finally {
      (m && Xu(e.host, m),
        t.syncingCardIds.delete(n.id),
        q(e.host, p) &&
          Gu(e.host, i) &&
          $u(t, !0, { host: e.host, preparedAt: a ?? Date.now(), requestUpdate: e.requestUpdate }),
        e.requestUpdate?.());
    }
  }
  !c &&
    Gu(e.host, i) &&
    $u(t, !0, { host: e.host, preparedAt: a ?? Date.now(), requestUpdate: e.requestUpdate });
}
var np = e(() => {
  (U(), yf(), K(), Nd(), gd(), nf());
});
function rp(e) {
  let t = (t) => (G(e) && Array.isArray(e[t]) ? e[t].length : 0);
  return {
    started: t(`started`),
    failures: t(`startFailures`),
    promoted: t(`promoted`),
    blocked: t(`blocked`),
    reclaimed: t(`reclaimed`),
    orchestrated: t(`orchestrated`),
  };
}
async function ip(e) {
  let t = Z(e.host);
  if (!(!e.client || !Q(t) || !t.draftTitle.trim() || t.dispatching || t.draftSaving)) {
    (J(e.host), (t.draftSaving = !0), (t.loading = !0), (t.error = null), e.requestUpdate?.());
    try {
      (B(t, $(await e.client.request(`workboard.cards.create`, Pu(t)))), Mu(t));
    } catch (e) {
      t.error = W(e);
    } finally {
      ((t.draftSaving = !1), (t.loading = !1), e.requestUpdate?.());
    }
  }
}
async function ap(e) {
  let t = Z(e.host);
  if (!t.editingCardId) {
    await ip(e);
    return;
  }
  if (
    !e.client ||
    !Q(t) ||
    !t.draftTitle.trim() ||
    t.dispatching ||
    t.draftSaving ||
    t.busyCardIds.has(t.editingCardId)
  )
    return;
  (J(e.host), (t.draftSaving = !0), (t.loading = !0), (t.error = null));
  let n = t.editingCardId,
    r = cf(
      e.host,
      t.cards.find((e) => e.id === n),
      t.draftStatus,
    );
  e.requestUpdate?.();
  try {
    (B(t, $(await e.client.request(`workboard.cards.update`, { id: n, patch: Pu(t) }))), Mu(t));
  } catch (e) {
    t.error = W(e);
  } finally {
    (lf(e.host, n, r), (t.draftSaving = !1), (t.loading = !1), e.requestUpdate?.());
  }
}
async function op(e) {
  let t = Z(e.host),
    n = e.cardId ?? t.editingCardId,
    r = (e.body ?? t.draftCommentBody).trim();
  if (!(!n || !e.client || !Q(t) || !r || t.dispatching || t.draftSaving || t.busyCardIds.has(n))) {
    (J(e.host), t.busyCardIds.add(n), (t.error = null), e.requestUpdate?.());
    try {
      (B(t, $(await e.client.request(`workboard.cards.comment`, { id: n, body: r }))),
        e.body === void 0
          ? (t.draftCommentBody = ``)
          : t.detailCardId === n && (t.detailCommentBody = ``));
    } catch (e) {
      t.error = W(e);
    } finally {
      (t.busyCardIds.delete(n), e.requestUpdate?.());
    }
  }
}
async function sp(e) {
  let t = Z(e.host);
  if (!e.client || !Q(t) || t.dispatching || t.busyCardIds.has(e.cardId)) return;
  (J(e.host), t.busyCardIds.add(e.cardId), (t.error = null));
  let n = cf(
    e.host,
    t.cards.find((t) => t.id === e.cardId),
    e.status,
  );
  e.requestUpdate?.();
  try {
    B(
      t,
      $(
        await e.client.request(`workboard.cards.move`, {
          id: e.cardId,
          status: e.status,
          position: e.position,
        }),
      ),
    );
  } catch (e) {
    t.error = W(e);
  } finally {
    (lf(e.host, e.cardId, n),
      t.busyCardIds.delete(e.cardId),
      t.draggedCardId === e.cardId && (t.draggedCardId = null),
      e.requestUpdate?.());
  }
}
async function cp(e) {
  let t = Z(e.host);
  if (!(!e.client || !Q(t) || t.dispatching || t.busyCardIds.has(e.cardId))) {
    (J(e.host), t.busyCardIds.add(e.cardId), (t.error = null), e.requestUpdate?.());
    try {
      (await e.client.request(`workboard.cards.delete`, { id: e.cardId }),
        (t.cards = ju(t.cards, e.cardId)));
    } catch (e) {
      t.error = W(e);
    } finally {
      (t.busyCardIds.delete(e.cardId), e.requestUpdate?.());
    }
  }
}
async function lp(e) {
  let t = Z(e.host);
  if (!(!e.client || !Q(t) || t.dispatching || t.busyCardIds.has(e.cardId))) {
    (J(e.host), t.busyCardIds.add(e.cardId), (t.error = null), e.requestUpdate?.());
    try {
      B(
        t,
        $(
          await e.client.request(`workboard.cards.archive`, {
            id: e.cardId,
            archived: e.archived ?? !0,
          }),
        ),
      );
    } catch (e) {
      t.error = W(e);
    } finally {
      (t.busyCardIds.delete(e.cardId), e.requestUpdate?.());
    }
  }
}
async function up(e) {
  let t = Z(e.host);
  if (!(!e.client || !Q(t) || t.dispatching || od(t))) {
    (J(e.host),
      (t.dispatching = !0),
      (t.error = null),
      (t.lastDispatchSummary = null),
      e.requestUpdate?.());
    try {
      let n = await e.client.request(`workboard.cards.dispatch`, {}),
        r = kd(await e.client.request(`workboard.cards.list`, {}));
      ((t.cards = r.cards),
        (t.statuses = r.statuses),
        (t.lastDispatchSummary = rp(n)),
        (t.tasksByCardId = new Map()),
        Y(t, { host: e.host }));
      try {
        (Zd(t, await Pd(e.client)),
          td(t, !1, { host: e.host }),
          (t.lifecycleTaskRefreshError = null),
          (t.lastRefreshError = null));
      } catch (n) {
        (td(t, !0, { host: e.host, requestUpdate: e.requestUpdate }), (t.lastRefreshError = W(n)));
      }
      t.loaded = Q(t);
    } catch (e) {
      t.error = W(e);
    } finally {
      ((t.dispatching = !1), e.requestUpdate?.());
    }
  }
}
var dp = e(() => {
  (U(), yf(), K(), Nd(), gd(), nf());
});
function fp(e) {
  let t = [`Work on this OpenClaw Workboard card: ${e.title}`];
  (e.notes?.trim() && t.push(``, e.notes.trim()),
    e.labels.length > 0 && t.push(``, `Labels: ${e.labels.join(`, `)}`));
  let n = e.metadata?.links
    ?.filter((e) => e.type === `parent` && e.targetCardId)
    .map((e) => e.targetCardId);
  if (
    (n?.length && t.push(``, `Parents: ${n.join(`, `)}`),
    e.metadata?.automation?.skills?.length &&
      t.push(``, `Suggested skills: ${e.metadata.automation.skills.join(`, `)}`),
    e.metadata?.automation?.workspace)
  ) {
    let n = e.metadata.automation.workspace;
    t.push(``, `Workspace: ${n.kind}${n.path ? ` ${n.path}` : ``}`);
  }
  return (
    t.push(``, `When done, summarize what changed and what remains.`),
    t.join(`
`)
  );
}
function pp(e) {
  let t = e.id.trim().slice(0, 8) || `card`,
    n = e.title.trim() || `Workboard card`,
    r = ` (${t})`;
  return n.length + r.length <= Ep ? `${n}${r}` : `${te(n, Ep - r.length - 3).trimEnd()}...${r}`;
}
function mp(e, t) {
  return (
    (e ?? t)
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, `-`)
      .replace(/-+/g, `-`)
      .replace(/^-|-$/g, ``) || t
  ).slice(0, 96);
}
function hp(e) {
  let t = `subagent:workboard-${mp(e.metadata?.automation?.boardId, `default`)}-${mp(e.id, `card`)}`,
    n = e.agentId ? `agent:${mp(e.agentId, `agent`)}:${t}` : t,
    r = V(e)?.trim();
  return r === n ? r : n;
}
function gp(e) {
  return `workboard:${mp(e.metadata?.automation?.boardId, `default`)}:${mp(e.id, `card`)}:${e.updatedAt}`;
}
function _p(e, t = Date.now()) {
  let n = e.metadata?.automation?.scheduledAt;
  return typeof n == `number` ? n > t : e.status === `scheduled`;
}
function vp(e) {
  let t = Date.now();
  return {
    id: e.card.execution?.id ?? `${e.card.id}:${e.engine}`,
    kind: `agent-session`,
    engine: e.engine,
    mode: e.mode,
    status: e.status,
    model: Tp[e.engine],
    startedAt: t,
    updatedAt: t,
    ...(e.sessionKey ? { sessionKey: e.sessionKey } : {}),
    ...(e.runId ? { runId: e.runId } : {}),
  };
}
async function yp(e) {
  let t = {
    ...e.card,
    taskId: void 0,
    sessionKey: e.sessionKey,
    ...(e.runId ? { runId: e.runId } : {}),
  };
  for (let n of [0, ...tf]) {
    n > 0 &&
      (await new Promise((e) => {
        setTimeout(e, n);
      }));
    let r = null;
    try {
      r = (await Pd(e.client)).filter((e) => zd(e, t)).toSorted((e, t) => Fd(t) - Fd(e))[0] ?? null;
    } catch {}
    if (r) return r;
  }
  return null;
}
async function bp(e) {
  let t = await e.client.request(`chat.abort`, {
      sessionKey: e.sessionKey,
      ...(e.runId ? { runId: e.runId } : {}),
    }),
    n = G(t) && (t.aborted === !0 || (Array.isArray(t.runIds) && t.runIds.length > 0));
  return (
    !n &&
      e.runId &&
      ((t = await e.client.request(`chat.abort`, { sessionKey: e.sessionKey })),
      (n = G(t) && (t.aborted === !0 || (Array.isArray(t.runIds) && t.runIds.length > 0)))),
    n
  );
}
function xp(e) {
  return e?.status === `queued` || e?.status === `running`;
}
async function Sp(e) {
  let t = await e.client.request(`tasks.cancel`, {
    taskId: e.taskId,
    reason: `Stopped from Workboard.`,
  });
  return {
    cancelled: G(t) && t.cancelled === !0,
    missing: G(t) && t.found === !1,
    task: G(t) ? jd(t.task) : null,
  };
}
async function Cp(e) {
  let t = Z(e.host);
  if (!e.client || !Q(t) || t.dispatching || t.busyCardIds.has(e.card.id)) return null;
  let n = e.engine,
    r = e.mode ?? `autonomous`;
  if (((t.error = null), r === `autonomous` && _p(e.card)))
    return (
      (t.error = `Scheduled cards cannot start before their scheduled time.`),
      e.requestUpdate?.(),
      null
    );
  (J(e.host), t.busyCardIds.add(e.card.id), e.requestUpdate?.());
  let i = null,
    a = null,
    o;
  try {
    let s = r === `manual` && e.card.metadata?.automation?.scheduledAt !== void 0,
      c = r === `manual` && e.card.status === `scheduled`,
      l = r === `autonomous` ? `running` : c ? `todo` : e.card.status,
      u = r === `autonomous` ? `running` : `idle`,
      d = e.card;
    r === `autonomous` &&
      ((i = $(
        await e.client.request(`workboard.cards.update`, { id: e.card.id, patch: { status: l } }),
      )),
      i && (B(t, i), (d = i)));
    let f =
        r === `autonomous`
          ? await e.client.request(`agent`, {
              sessionKey: hp(d),
              ...(d.agentId ? { agentId: d.agentId } : {}),
              label: pp(d),
              ...(n ? { model: Tp[n] } : {}),
              message: fp(d),
              deliver: !1,
              bootstrapContextMode: `lightweight`,
              idempotencyKey: gp(d),
            })
          : await Ro(e.client, {
              ...(d.agentId ? { agentId: d.agentId } : {}),
              label: pp(d),
              ...(n ? { model: Tp[n] } : {}),
            }),
      p =
        G(f) && typeof f.sessionKey == `string` && f.sessionKey.trim()
          ? f.sessionKey.trim()
          : G(f) && typeof f.key == `string` && f.key.trim()
            ? f.key.trim()
            : r === `autonomous`
              ? hp(d)
              : null,
      m = G(f) && typeof f.runId == `string` && f.runId.trim() ? f.runId.trim() : void 0;
    if (r === `autonomous` && !m) throw Error(`Gateway agent method returned an invalid runId.`);
    ((a = p), (o = m));
    let h =
      r === `autonomous` && p
        ? await yp({ client: e.client, card: d, sessionKey: p, runId: m })
        : null;
    return (
      B(
        t,
        $(
          await e.client.request(`workboard.cards.update`, {
            id: e.card.id,
            patch: {
              status: l,
              ...(s ? { scheduledAt: null } : {}),
              ...(p ? { sessionKey: p } : {}),
              runId: m ?? null,
              taskId: h?.taskId ?? null,
              ...(n
                ? {
                    execution: vp({
                      card: d,
                      engine: n,
                      mode: r,
                      sessionKey: p,
                      runId: m,
                      status: u,
                    }),
                  }
                : { execution: null }),
            },
          }),
        ),
      ),
      h ? t.tasksByCardId.set(e.card.id, h) : t.tasksByCardId.delete(e.card.id),
      p
    );
  } catch (n) {
    if (r === `autonomous` && a)
      try {
        await bp({ client: e.client, sessionKey: a, runId: o });
      } catch {}
    if (i)
      try {
        B(
          t,
          $(
            await e.client.request(`workboard.cards.update`, {
              id: e.card.id,
              patch: {
                status: e.card.status,
                startedAt: e.card.startedAt ?? null,
                completedAt: e.card.completedAt ?? null,
                ...(e.card.execution === void 0 ? {} : { execution: e.card.execution }),
              },
            }),
          ) ?? e.card,
        );
      } catch {
        B(t, e.card);
      }
    return ((t.error = W(n)), null);
  } finally {
    (t.busyCardIds.delete(e.card.id), e.requestUpdate?.());
  }
}
async function wp(e) {
  let t = Z(e.host),
    n = V(e.card),
    r = t.tasksByCardId.get(e.card.id),
    i = H(e.card.taskId),
    a = i && !t.missingTaskIds.has(i) ? i : r?.taskId;
  if (!(!e.client || !Q(t) || t.dispatching || t.busyCardIds.has(e.card.id) || (!n && !a))) {
    (J(e.host), t.busyCardIds.add(e.card.id), (t.error = null), e.requestUpdate?.());
    try {
      let i = !1;
      if (a && (!r || xp(r)))
        try {
          let o = await Sp({ client: e.client, taskId: a });
          o.missing
            ? (t.missingTaskIds.add(a),
              (r?.taskId === a || r?.id === a) && t.tasksByCardId.delete(e.card.id),
              (i = !n))
            : o.cancelled &&
              ((i = !0),
              t.tasksByCardId.set(
                e.card.id,
                o.task ?? {
                  ...(r ?? { id: a, taskId: a }),
                  status: `cancelled`,
                  updatedAt: Date.now(),
                },
              ));
        } catch (o) {
          if (!Gd(o, a)) throw o;
          (t.missingTaskIds.add(a),
            (r?.taskId === a || r?.id === a) && t.tasksByCardId.delete(e.card.id),
            (i = !n));
        }
      let o = !1;
      if (n)
        try {
          o = await bp({ client: e.client, sessionKey: n, runId: Lu(e.card) });
        } catch (e) {
          if (!i) throw e;
        }
      if (!i && !o) return;
      B(
        t,
        $(
          await e.client.request(`workboard.cards.update`, {
            id: e.card.id,
            patch: {
              status: `blocked`,
              ...(e.card.execution
                ? { execution: { ...e.card.execution, status: `blocked`, updatedAt: Date.now() } }
                : {}),
            },
          }),
        ),
      );
    } catch (e) {
      t.error = W(e);
    } finally {
      (t.busyCardIds.delete(e.card.id), e.requestUpdate?.());
    }
  }
}
var Tp,
  Ep,
  Dp = e(() => {
    (y(),
      qs(),
      U(),
      K(),
      Nd(),
      gd(),
      nf(),
      (Tp = { codex: `openai/gpt-5.6-sol`, claude: `anthropic/claude-sonnet-4-6` }),
      (Ep = 512));
  }),
  Op = e(() => {
    (Ou(), kf(), $f(), U(), zf(), yf(), np(), dp(), Dp(), gd());
  });
function kp() {
  let e = new Set(),
    t = !1,
    n = {
      get state() {
        return Z(n);
      },
      notify() {
        if (!t) for (let t of e) t();
      },
      subscribe(t) {
        return (e.add(t), () => e.delete(t));
      },
      dispose() {
        ((t = !0), Rf(n), Qu(n), e.clear());
      },
    };
  return n;
}
var Ap = e(() => {
  Op();
});
function jp(e) {
  return {
    ...e,
    devicePairSetupOpen: !1,
    devicePairSetupLoading: !1,
    devicePairSetupError: null,
    devicePairSetup: null,
    devicePairSetupAccess: `full`,
    pendingCount: 0,
  };
}
function Mp(e) {
  return {
    devicePairSetupOpen: e.devicePairSetupOpen,
    devicePairSetupLoading: e.devicePairSetupLoading,
    devicePairSetupError: e.devicePairSetupError,
    devicePairSetup: e.devicePairSetup,
    devicePairSetupAccess: e.devicePairSetupAccess,
    devicePairPendingCount: e.pendingCount,
  };
}
async function Np(e) {
  e.devicePairSetupOpen = !0;
}
async function Pp(e) {
  let t = e.client;
  if (!t || !e.connected || e.devicePairSetupLoading) return;
  let n = {};
  (Lp.set(e, n), (e.devicePairSetupLoading = !0), (e.devicePairSetupError = null));
  try {
    let r = await t.request(
      `device.pair.setupCode`,
      e.devicePairSetupAccess === `limited` ? { bootstrapProfile: `limited` } : {},
    );
    if (Lp.get(e) !== n || e.client !== t || !e.connected || !e.devicePairSetupOpen) return;
    ((r.access === `full` || r.access === `limited`) && (e.devicePairSetupAccess = r.access),
      (e.devicePairSetup = r));
  } catch (r) {
    Lp.get(e) === n &&
      e.client === t &&
      e.devicePairSetupOpen &&
      (e.devicePairSetupError = String(r));
  } finally {
    Lp.get(e) === n && (Lp.delete(e), (e.devicePairSetupLoading = !1));
  }
}
async function Fp(e, t) {
  e.devicePairSetupAccess === t ||
    e.devicePairSetupLoading ||
    e.devicePairSetup !== null ||
    ((e.devicePairSetupAccess = t), (e.devicePairSetupError = null));
}
function Ip(e) {
  (Lp.delete(e),
    (e.devicePairSetupOpen = !1),
    (e.devicePairSetupLoading = !1),
    (e.devicePairSetupError = null),
    (e.devicePairSetup = null),
    (e.devicePairSetupAccess = `full`));
}
var Lp,
  Rp = e(() => {
    Lp = new WeakMap();
  });
export {
  Il as $,
  xn as $i,
  co as $n,
  di as $r,
  Zs as $t,
  Df as A,
  xt as Aa,
  nr as Ai,
  Po as An,
  Ni as Ar,
  Xc as At,
  od as B,
  It as Ba,
  Vn as Bi,
  j as Bn,
  Vi as Br,
  _c as Bt,
  Jf as C,
  Pt as Ca,
  or as Ci,
  $o as Cn,
  ca as Cr,
  Zc as Ct,
  Af as D,
  vt as Da,
  kr as Di,
  Mo as Dn,
  Ai as Dr,
  Rc as Dt,
  zf as E,
  Mt as Ea,
  Qn as Ei,
  Fo as En,
  Mi as Er,
  zc as Et,
  af as F,
  kt as Fa,
  sr as Fi,
  fo as Fn,
  Ri as Fr,
  yc as Ft,
  wu as G,
  Nn as Gi,
  po as Gn,
  Oi as Gr,
  oc as Gt,
  Au as H,
  tt as Ha,
  zn as Hi,
  M as Hn,
  Li as Hr,
  gc as Ht,
  yf as I,
  Ot as Ia,
  Ar as Ii,
  lo as In,
  Hi as Ir,
  bc as It,
  Du as J,
  Dn as Ji,
  eo as Jn,
  wi as Jr,
  ic as Jt,
  $l as K,
  jn as Ki,
  Xa as Kn,
  Di as Kr,
  ac as Kt,
  Z as L,
  Ft as La,
  Xn as Li,
  mo as Ln,
  Pi as Lr,
  mc as Lt,
  Tf as M,
  Lt as Ma,
  Nr as Mi,
  ko as Mn,
  Ji as Mr,
  Lc as Mt,
  Ef as N,
  wt as Na,
  jr as Ni,
  _o as Nn,
  Yi as Nr,
  Gc as Nt,
  Mf as O,
  Qt as Oa,
  Yn as Oi,
  Oo as On,
  Fi as Or,
  Vc as Ot,
  rf as P,
  Tt as Pa,
  wr as Pi,
  vo as Pn,
  ki as Pr,
  qc as Pt,
  Vl as Q,
  Mn as Qi,
  ao as Qn,
  Ei as Qr,
  Js as Qt,
  gd as R,
  $t as Ra,
  Hn as Ri,
  Co as Rn,
  Ii as Rr,
  fc as Rt,
  tp as S,
  rn as Sa,
  Lr as Si,
  Uo as Sn,
  pa as Sr,
  Yc as St,
  Lf as T,
  yt as Ta,
  Or as Ti,
  Io as Tn,
  ra as Tr,
  Nc as Tt,
  U,
  nt as Ua,
  Ln as Ui,
  Ja as Un,
  zi as Ur,
  hc as Ut,
  Q as V,
  et as Va,
  Rn as Vi,
  oo as Vn,
  Bi as Vr,
  pc as Vt,
  Mu as W,
  D as Wa,
  kn as Wi,
  A as Wn,
  Xi as Wr,
  dc as Wt,
  zl as X,
  wn as Xi,
  $a as Xn,
  ui as Xr,
  $s as Xt,
  Ql as Y,
  On as Yi,
  Qa as Yn,
  li as Yr,
  ec as Yt,
  Ll as Z,
  En as Zi,
  so as Zn,
  Ci as Zr,
  Xs as Zt,
  up as _,
  ln as _a,
  Pr as _i,
  Vo as _n,
  Oa as _r,
  rl as _t,
  Mp as a,
  bn as aa,
  ii as ai,
  ws as an,
  Ua as ar,
  xl as at,
  ap as b,
  Gt as ba,
  cr as bi,
  Go as bn,
  fa as br,
  tl as bt,
  kp as c,
  gn as ca,
  Jr as ci,
  Ss as cn,
  La as cr,
  ml as ct,
  Dp as d,
  _n as da,
  Hr as di,
  fs as dn,
  Na as dr,
  sl as dt,
  In as ea,
  ci as ei,
  Gs as en,
  Wa as er,
  Rl as et,
  Cp as f,
  dn as fa,
  Ur as fi,
  Zo as fn,
  ka as fr,
  cl as ft,
  cp as g,
  sn as ga,
  Sr as gi,
  es as gn,
  Ea as gr,
  nl as gt,
  lp as h,
  pn as ha,
  zr as hi,
  Xo as hn,
  Ma as hr,
  il as ht,
  Np as i,
  An as ia,
  ni as ii,
  _s as in,
  Ba as ir,
  bl as it,
  kf as j,
  Dt as ja,
  Er as ji,
  wo as jn,
  $i as jr,
  Ic as jt,
  Rf as k,
  Zt as ka,
  Dr as ki,
  Ao as kn,
  Wi as kr,
  Jc as kt,
  Ap as l,
  hn as la,
  Wr as li,
  bs as ln,
  Ia as lr,
  fl as lt,
  op as m,
  un as ma,
  Rr as mi,
  Yo as mn,
  Da as mr,
  al as mt,
  jp as n,
  Cn as na,
  si as ni,
  Ws as nn,
  za as nr,
  El as nt,
  Pp as o,
  yn as oa,
  ri as oi,
  xs as on,
  Ra as or,
  Sl as ot,
  wp as p,
  fn as pa,
  Vr as pi,
  Jo as pn,
  Ta as pr,
  ol as pt,
  bu as q,
  Tn as qi,
  Za as qn,
  xi as qr,
  sc as qt,
  Rp as r,
  Sn as ra,
  ti as ri,
  Rs as rn,
  Ha as rr,
  yl as rt,
  Fp as s,
  vn as sa,
  ei as si,
  Cs as sn,
  Va as sr,
  ll as st,
  Ip as t,
  Pn as ta,
  hi as ti,
  qs as tn,
  Ka as tr,
  Tl as tt,
  Op as u,
  mn as ua,
  Gr as ui,
  hs as un,
  Pa as ur,
  dl as ut,
  dp as v,
  bt as va,
  qn as vi,
  Qo as vn,
  la as vr,
  Ec as vt,
  $f as w,
  Ut as wa,
  $n as wi,
  Ko as wn,
  na as wr,
  Uc as wt,
  np as x,
  _t as xa,
  Zn as xi,
  Wo as xn,
  ga as xr,
  $c as xt,
  sp as y,
  Et as ya,
  Gn as yi,
  Ho as yn,
  wa as yr,
  Qc as yt,
  Qu as z,
  Wt as za,
  Bn as zi,
  no as zn,
  ji as zr,
  vc as zt,
};
//# sourceMappingURL=control-ui-core-BcbHa4vB.js.map
