import {
  $r as d,
  Bn as f,
  Fn as p,
  Ha as m,
  Hn as h,
  Jn as g,
  Jr as _,
  Kn as ee,
  Pn as v,
  Qr as te,
  Rn as y,
  Sr as ne,
  Ua as re,
  Wn as ie,
  Xn as b,
  Xr as ae,
  Yn as x,
  Yr as oe,
  Zr as S,
  _a as se,
  ai as ce,
  br as le,
  ea as ue,
  ei as C,
  ga as de,
  gn as fe,
  hn as pe,
  ni as me,
  oi as he,
  qn as ge,
  qr as _e,
  ti as ve,
  tn as ye,
  wn as w,
  xr as T,
  yn as be,
  yr as xe,
} from "./control-ui-core-BcbHa4vB.js";
import {
  $ as D,
  I as Ce,
  J as O,
  M as we,
  P as Te,
  Q as k,
  X as Ee,
  j as De,
} from "./control-ui-core-CQDTaMS5.js";
import { o as E, t as Se } from "./control-ui-core-CwQmiouz.js";
import { u as t } from "./control-ui-foundation-CCDffryi.js";
import { D as s, I as c, M as l, P as u } from "./control-ui-foundation-s2wA1PVE.js";
import { a as Oe, r as ke } from "./fast-mode-Ce32fhza.js";
import { at as n, et as r, f as i, nt as a, p as o } from "./lit-runtime-DkvDG939.js";
import { i as Fe, n as Ie, r as Le, t as Re } from "./provider-icon-CsUwkorr.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
import { c as Ae, i as je, m as Me, p as Ne, r as Pe } from "./thinking-K1jeBK5_.js";
var ze = e(() => {});
function Be(e) {
  if (!(typeof URL > `u` || typeof URL.createObjectURL != `function`))
    return URL.createObjectURL(e);
}
function Ve(e) {
  !e || typeof URL > `u` || typeof URL.revokeObjectURL != `function` || URL.revokeObjectURL(e);
}
function He(e) {
  Ve(j.get(e.attachment.id)?.previewUrl);
  let t = Be(e.file) ?? e.attachment.previewUrl;
  return (
    j.set(e.attachment.id, { dataUrl: e.dataUrl, ...(t ? { previewUrl: t } : {}) }),
    { ...e.attachment, ...(t ? { previewUrl: t } : {}) }
  );
}
function Ue(e) {
  return e.dataUrl ?? j.get(e.id)?.dataUrl ?? null;
}
function We(e) {
  return e.previewUrl ?? j.get(e.id)?.previewUrl ?? e.dataUrl ?? null;
}
function Ge(e) {
  let { dataUrl: t, ...n } = e;
  return n;
}
function Ke(e) {
  return e.map(Ge);
}
function qe(e) {
  let t = j.get(e);
  t && (Ve(t.previewUrl), j.delete(e));
}
function A(e = []) {
  for (let t of e) qe(t.id);
}
function Je(e) {
  let t = j.get(e);
  if (t) {
    if (t.previewUrl) {
      j.set(e, { previewUrl: t.previewUrl });
      return;
    }
    j.delete(e);
  }
}
function Ye(e = []) {
  for (let t of e) Je(t.id);
}
var j,
  M = e(() => {
    j = new Map();
  });
function N(e) {
  let t = e?.trim() || `default`,
    n = encodeURIComponent(t);
  return {
    key: `${kt}${n}`,
    legacyKey: `${Ot}${n.slice(0, 240)}`,
    gatewayOwner: t,
    legacyOwnerIsUnambiguous: n.length < 240,
  };
}
function Xe(e, t) {
  let n = t.trim().toLowerCase();
  return n === `main` || n === ee(e);
}
function Ze(e) {
  if (e.agentsList !== null && e.agentsList !== void 0) return !0;
  let t = e.hello?.snapshot;
  return !t || typeof t != `object` || !(`sessionDefaults` in t)
    ? !1
    : !!(t.sessionDefaults && typeof t.sessionDefaults == `object`);
}
function Qe(e, t) {
  if (!Ze(t)) return !1;
  let n = ee(t);
  if (n === `main`) return e.mainAlias ? (delete e.mainAlias, !0) : !1;
  let r = { key: n, agentId: ge(t) };
  return e.mainAlias?.key === r.key && e.mainAlias.agentId === r.agentId
    ? !1
    : ((e.mainAlias = r), !0);
}
function P(e, t, n) {
  let r = zt.get(e);
  (r || ((r = new Map()), zt.set(e, r)), r.set(t, n ?? null));
}
function $e(e, t) {
  return zt.get(e)?.get(t) ?? void 0;
}
function et(e, t) {
  return f(t) || Xe(e, t) || g(e, t) !== null;
}
function F(e, t, n, r) {
  let i = ie(t),
    a = t.trim().toLowerCase(),
    o = Ze(e),
    s = i?.rest ?? a,
    c = !o && r?.key === s,
    l = !o && !i && r && (a === `main` || c) ? r.agentId : void 0,
    u = !o && !i && a === `main`,
    d = et(e, t) || c,
    f = i?.agentId ?? n?.trim(),
    p = x(e),
    m = o && !i && Xe(e, t) ? ge(e) : void 0,
    g = d
      ? f
        ? h(f)
        : m
          ? h(m)
          : l
            ? h(l)
            : u
              ? void 0
              : p
                ? h(p)
                : c
                  ? h(r.agentId)
                  : void 0
      : i?.agentId
        ? h(i.agentId)
        : void 0;
  return {
    conversationKey: u && !g ? v : d ? `global` : t,
    agentScope: g ?? (d ? G : `main`),
    ...(g ? { routingAgentId: g } : {}),
    isGlobal: d,
  };
}
function tt(e, t) {
  return `${e}\u0000agent:${t}`;
}
function I(e, t, n) {
  let r = m(),
    i = N(e.settings?.gatewayUrl),
    a = F(e, t, n, r ? $e(r, i.key) : void 0);
  return {
    sessionKey: a.conversationKey,
    ...(a.routingAgentId ? { agentId: a.routingAgentId } : {}),
  };
}
function L(e) {
  let t = e.sessionKey.trim().toLowerCase(),
    n = e.agentId ?? (t === `global` || t === `main` ? G : `main`);
  return tt(e.sessionKey, n);
}
function nt(e = 0) {
  let t = Math.max(Date.now(), Pt + 1, e + 1);
  return ((Pt = t), t);
}
function rt(e, t, n, r) {
  if (r === void 0) return;
  let i = Ft.get(e);
  i || ((i = new Map()), Ft.set(e, i));
  let a = i.get(t);
  (a || ((a = new Map()), i.set(t, a)), a.set(n, Math.max(a.get(n) ?? 0, r)));
}
function it(e, t, n, r) {
  let i = It.get(e);
  i || ((i = new Map()), It.set(e, i));
  let a = i.get(t);
  (a || ((a = new Map()), i.set(t, a)), a.set(n, Math.max(a.get(n) ?? 0, r)));
}
function at(e, t, n) {
  return Ft.get(e)?.get(t)?.get(n) ?? 0;
}
function ot(e, t, n) {
  return It.get(e)?.get(t)?.get(n) ?? 0;
}
function st(e, t) {
  if (!e) return t;
  let n = e.updatedAt > t.updatedAt ? e : t,
    r = n === e ? t : e,
    i = e.draftRevision,
    a = t.draftRevision,
    o = i === void 0 ? (a === void 0 ? null : t) : a === void 0 || i > a ? e : t,
    s = new Map([...(r.queue ?? []), ...(n.queue ?? [])].map((e) => [e.id, e])),
    c = Array.from(s.values())
      .toSorted((e, t) => e.createdAt - t.createdAt)
      .slice(0, Mt);
  return {
    ...(o?.draft ? { draft: o.draft } : {}),
    ...(o?.draftRevision === void 0 ? {} : { draftRevision: o.draftRevision }),
    ...(c.length ? { queue: c } : {}),
    updatedAt: Math.max(e.updatedAt, t.updatedAt),
  };
}
function R(e, t, n, r) {
  let i = Qe(e, t),
    a = F(t, n, r, e.mainAlias),
    o = tt(a.conversationKey, a.agentScope),
    s = ee(t),
    c = Ze(t) ? ge(t) : void 0;
  if (c) {
    let t = tt(`global`, c),
      n = H(e.sessions[t]),
      r = new Set([v, s]);
    for (let a of Object.keys(e.sessions)) {
      if (a === t) continue;
      let o = a.lastIndexOf(`\0agent:`);
      if (o < 0) continue;
      let s = a.slice(0, o).trim().toLowerCase();
      if (!r.has(s)) continue;
      let l = H(e.sessions[a]);
      if (!l) continue;
      let u = l.queue?.map((e) => ({ ...e, agentId: c, sessionKey: `global` }));
      ((n = st(n, { ...l, ...(u ? { queue: u } : {}) })),
        (e.sessions[t] = n),
        delete e.sessions[a],
        (i = !0));
    }
  }
  let l = H(e.sessions[o]);
  if (!a.isGlobal && !ie(n)) {
    let t = `${a.conversationKey}\u0000agent:`;
    for (let n of Object.keys(e.sessions)) {
      if (n === o || !n.startsWith(t)) continue;
      let r = H(e.sessions[n]);
      if (!r) continue;
      let s = r.queue?.map(({ agentId: e, ...t }) => ({ ...t, sessionKey: a.conversationKey }));
      ((l = st(l, { ...r, ...(s ? { queue: s } : {}) })),
        (e.sessions[o] = l),
        delete e.sessions[n],
        (i = !0));
    }
  }
  let u = `\u0000agent:${a.agentScope}`;
  for (let n of Object.keys(e.sessions)) {
    if (
      n === o ||
      !n.endsWith(u) ||
      F(t, n.slice(0, -u.length), a.agentScope === G ? void 0 : a.agentScope, e.mainAlias)
        .conversationKey !== a.conversationKey
    )
      continue;
    let r = H(e.sessions[n]);
    if (r) {
      let t = r.queue?.map(({ agentId: e, ...t }) => ({
        ...t,
        sessionKey: a.conversationKey,
        ...(a.routingAgentId ? { agentId: a.routingAgentId } : {}),
      }));
      ((l = st(l, { ...r, ...(t ? { queue: t } : {}) })),
        (e.sessions[o] = l),
        delete e.sessions[n],
        (i = !0));
    }
  }
  if (!a.isGlobal) return { session: l, storeSessionKey: o, migrated: i };
  let d = x(t);
  if (!d || a.agentScope !== d) return { session: l, storeSessionKey: o, migrated: i };
  let f = tt(a.conversationKey, G);
  if (o === f) return { session: l, storeSessionKey: o, migrated: i };
  let p = H(e.sessions[f]);
  if (!p) return { session: l, storeSessionKey: o, migrated: i };
  let m = p.queue?.map((e) => (e.agentId ? e : { ...e, agentId: a.agentScope })),
    h = st(l, { ...p, ...(m ? { queue: m } : {}) });
  return (
    (e.sessions[o] = h), delete e.sessions[f], { session: h, storeSessionKey: o, migrated: !0 }
  );
}
function ct(e, t, n, r) {
  try {
    let i = JSON.parse(n);
    if (
      !i ||
      i.version !== r ||
      (r === 2 && i.gatewayOwner !== t.gatewayOwner) ||
      !i.sessions ||
      typeof i.sessions != `object`
    )
      return null;
    let a = {};
    for (let [n, r] of Object.entries(i.sessions)) {
      let i = H(r);
      i &&
        ((a[n] = i), (Pt = Math.max(Pt, i.draftRevision ?? 0)), rt(e, t.key, n, i.draftRevision));
    }
    let o = i.mainAlias,
      s =
        o &&
        typeof o == `object` &&
        `key` in o &&
        typeof o.key == `string` &&
        o.key.trim() &&
        `agentId` in o &&
        typeof o.agentId == `string` &&
        o.agentId.trim()
          ? { key: o.key.trim().toLowerCase(), agentId: h(o.agentId) }
          : void 0;
    return (
      P(e, t.key, s),
      { version: 2, gatewayOwner: t.gatewayOwner, sessions: a, ...(s ? { mainAlias: s } : {}) }
    );
  } catch {
    return null;
  }
}
function z(e, t) {
  let n = e.getItem(t.key);
  if (n)
    return (
      ct(e, t, n, 2) ||
      (P(e, t.key, void 0), { version: 2, gatewayOwner: t.gatewayOwner, sessions: {} })
    );
  if (t.legacyOwnerIsUnambiguous) {
    let n = e.getItem(t.legacyKey);
    if (n) {
      let r = ct(e, t, n, 1);
      if (r) {
        try {
          (B(e, t, r), e.removeItem(t.legacyKey));
        } catch {}
        return r;
      }
    }
  }
  return (P(e, t.key, void 0), { version: 2, gatewayOwner: t.gatewayOwner, sessions: {} });
}
function B(e, t, n) {
  let r = Object.entries(n.sessions),
    i = r.filter(([, e]) => e.queue?.length);
  if (i.length > At) throw Error(`Chat outbox session limit reached`);
  let a = r.filter(([, e]) => !e.queue?.length),
    o = tt(`global`, G),
    s = a.find(([e]) => e === o),
    c = (e, t) =>
      t[1].updatedAt - e[1].updatedAt ||
      (t[1].draftRevision ?? 0) - (e[1].draftRevision ?? 0) ||
      e[0].localeCompare(t[0]),
    l = a.filter(([e, t]) => e !== o && !t.draft && t.draftRevision !== void 0).toSorted(c),
    u = [...(s ? [s] : []), ...l].slice(0, At),
    d = a.filter(([e, t]) => e !== o && !!t.draft),
    f = [...[...i.toSorted(c), ...d.toSorted(c)].slice(0, At), ...u];
  if (f.length === 0 && !n.mainAlias) {
    (e.removeItem(t.key), P(e, t.key, void 0));
    return;
  }
  (e.setItem(
    t.key,
    JSON.stringify({
      version: 2,
      gatewayOwner: t.gatewayOwner,
      sessions: Object.fromEntries(f),
      ...(n.mainAlias ? { mainAlias: n.mainAlias } : {}),
    }),
  ),
    P(e, t.key, n.mainAlias));
}
function V(e) {
  return typeof e == `string` && e.trim() ? e : void 0;
}
function lt(e) {
  return typeof e == `boolean` ? e : void 0;
}
function ut(e) {
  if (!e || typeof e != `object` || Array.isArray(e)) return null;
  let t = e,
    n = V(t.id),
    r = V(t.mimeType);
  if (!n || !r) return null;
  let i = { id: n, mimeType: r },
    a = V(t.fileName);
  (a && (i.fileName = a),
    typeof t.sizeBytes == `number` && Number.isFinite(t.sizeBytes) && (i.sizeBytes = t.sizeBytes));
  let o = V(t.dataUrl);
  return (o && (i.dataUrl = o), i);
}
function dt(e) {
  let t = Ue(e);
  return t
    ? {
        id: e.id,
        mimeType: e.mimeType,
        ...(e.fileName ? { fileName: e.fileName } : {}),
        ...(typeof e.sizeBytes == `number` ? { sizeBytes: e.sizeBytes } : {}),
        dataUrl: t,
      }
    : null;
}
function ft(e) {
  if (!e || typeof e != `object` || Array.isArray(e)) return;
  let t = e,
    n = V(t.proposalId);
  if (!n) return;
  let r = V(t.agentId);
  return { proposalId: n, ...(r ? { agentId: h(r) } : {}) };
}
function pt(e) {
  let t = V(e.id),
    n = typeof e.text == `string` ? e.text : ``;
  if (
    !t ||
    (!n.trim() && !e.attachments?.length) ||
    e.pendingRunId ||
    (e.sendState === `sending` && !e.sendRunId)
  )
    return null;
  let r = e.attachments?.map(dt) ?? [];
  if (e.attachments?.length && r.some((e) => e === null)) return null;
  let i =
      e.sendState === `sending`
        ? `waiting-reconnect`
        : e.sendState === `executing-command` || e.sendState === `steering`
          ? `unconfirmed`
          : e.sendState === `waiting-model`
            ? `failed`
            : e.sendState === `failed` ||
                e.sendState === `unconfirmed` ||
                e.sendState === `waiting-idle` ||
                e.sendState === `waiting-reconnect`
              ? e.sendState
              : void 0,
    a = e.sendState === `waiting-model` ? Lt : e.sendError,
    o = ft(e.skillWorkshopRevision);
  return {
    id: t,
    text: n,
    createdAt:
      typeof e.createdAt == `number` && Number.isFinite(e.createdAt) ? e.createdAt : Date.now(),
    ...(e.kind === `queued` || e.kind === `steered` ? { kind: e.kind } : {}),
    ...(r.length ? { attachments: r } : {}),
    ...(typeof e.refreshSessions == `boolean` ? { refreshSessions: e.refreshSessions } : {}),
    ...(e.localCommandArgs ? { localCommandArgs: e.localCommandArgs } : {}),
    ...(e.localCommandName ? { localCommandName: e.localCommandName } : {}),
    ...(e.sessionKey ? { sessionKey: e.sessionKey } : {}),
    ...(e.agentId ? { agentId: e.agentId } : {}),
    ...(o ? { skillWorkshopRevision: o } : {}),
    ...(i ? { sendState: i } : {}),
    ...(a ? { sendError: a } : {}),
    ...(e.sendRunId ? { sendRunId: e.sendRunId } : {}),
    ...(typeof e.sendAttempts == `number` && Number.isFinite(e.sendAttempts)
      ? { sendAttempts: e.sendAttempts }
      : {}),
  };
}
function mt(e) {
  if (!e || typeof e != `object` || Array.isArray(e)) return null;
  let t = e,
    n = V(t.id),
    r = typeof t.text == `string` ? t.text : ``,
    i = typeof t.createdAt == `number` && Number.isFinite(t.createdAt) ? t.createdAt : Date.now();
  if (!n || (!r.trim() && !Array.isArray(t.attachments))) return null;
  let a = Array.isArray(t.attachments) ? t.attachments.map(ut).filter((e) => e !== null) : [],
    o = { id: n, text: r, createdAt: i };
  ((t.kind === `queued` || t.kind === `steered`) && (o.kind = t.kind),
    a.length && (o.attachments = a));
  let s = lt(t.refreshSessions);
  (s !== void 0 && (o.refreshSessions = s),
    t.sendState === `failed` ||
    t.sendState === `unconfirmed` ||
    t.sendState === `waiting-idle` ||
    t.sendState === `waiting-reconnect`
      ? (o.sendState = t.sendState)
      : t.sendState === `waiting-model` && ((o.sendState = `failed`), (o.sendError = Lt)));
  let c = V(t.sendError);
  c && (o.sendError = c);
  let l = V(t.sendRunId);
  (l && (o.sendRunId = l),
    typeof t.sendAttempts == `number` &&
      Number.isFinite(t.sendAttempts) &&
      (o.sendAttempts = t.sendAttempts));
  let u = V(t.localCommandArgs);
  u && (o.localCommandArgs = u);
  let d = V(t.localCommandName);
  d && (o.localCommandName = d);
  let f = V(t.sessionKey);
  f && (o.sessionKey = f);
  let p = V(t.agentId);
  p && (o.agentId = h(p));
  let m = ft(t.skillWorkshopRevision);
  return (m && (o.skillWorkshopRevision = m), o);
}
function H(e) {
  if (!e || typeof e != `object` || Array.isArray(e)) return null;
  let t = e,
    n = typeof t.draft == `string` ? t.draft : void 0,
    r = Array.isArray(t.queue)
      ? t.queue
          .slice(0, Mt)
          .map(mt)
          .filter((e) => e !== null)
      : void 0,
    i = Array.isArray(t.removedQueueItemIds)
      ? t.removedQueueItemIds.map(V).filter((e) => e !== void 0)
      : void 0,
    a = new Set(i ?? []),
    o = r?.filter((e) => !a.has(e.id)),
    s = typeof t.updatedAt == `number` && Number.isFinite(t.updatedAt) ? t.updatedAt : Date.now(),
    c =
      (typeof t.draftRevision == `number` && Number.isSafeInteger(t.draftRevision)
        ? t.draftRevision
        : void 0) ?? (n ? s : void 0);
  return !n && c === void 0 && (!o || o.length === 0)
    ? null
    : {
        ...(n ? { draft: n } : {}),
        ...(c === void 0 ? {} : { draftRevision: c }),
        ...(o && o.length > 0 ? { queue: o } : {}),
        updatedAt: s,
      };
}
function U(e, t) {
  let n = pt(e);
  if (!n) return null;
  let { agentId: r, ...i } = n;
  return {
    ...i,
    sessionKey: t.conversationKey,
    ...(t.routingAgentId ? { agentId: t.routingAgentId } : {}),
  };
}
function ht(e, t, n) {
  let r = U(t, n);
  return !!(
    r &&
    e.id === r.id &&
    e.sendRunId === r.sendRunId &&
    e.sendAttempts === r.sendAttempts &&
    e.sendState === r.sendState &&
    e.agentId === r.agentId &&
    e.sessionKey === r.sessionKey
  );
}
function gt(e, t, n) {
  let r = U(e, n),
    i = U(t, n);
  return !!(r && i && JSON.stringify(r) === JSON.stringify(i));
}
function _t(e, t, n, r) {
  if (!n?.draft && n?.draftRevision === void 0 && r.length === 0) {
    delete e.sessions[t];
    return;
  }
  e.sessions[t] = {
    ...(n?.draft ? { draft: n.draft } : {}),
    ...(n?.draftRevision === void 0 ? {} : { draftRevision: n.draftRevision }),
    ...(r.length ? { queue: r } : {}),
    updatedAt: Date.now(),
  };
}
function vt(e, t, n) {
  let r = m();
  if (!r) return { committed: 0, latestAttempt: 0 };
  try {
    let i = N(e.settings?.gatewayUrl),
      a = z(r, i),
      o = R(a, e, t, n);
    if (o.migrated)
      try {
        B(r, i, a);
      } catch {}
    let s = o.session?.draftRevision;
    rt(r, i.key, o.storeSessionKey, s);
    let c = Math.max(s ?? 0, at(r, i.key, o.storeSessionKey));
    return { committed: c, latestAttempt: Math.max(c, ot(r, i.key, o.storeSessionKey)) };
  } catch {
    return { committed: 0, latestAttempt: 0 };
  }
}
function yt(e, t, n) {
  return vt(e, t, n).latestAttempt;
}
function bt(e, t, n) {
  return vt(e, t, n).committed;
}
function xt(e, t, n) {
  let r = m();
  if (!r) return null;
  try {
    let i = N(e.settings?.gatewayUrl),
      a = z(r, i),
      o = F(e, t, n, a.mainAlias),
      s = R(a, e, t, n);
    if (!s.session && o.isGlobal && o.agentScope === G) {
      let n = new Set();
      for (let [t, r] of Object.entries(a.sessions)) {
        let i = t.lastIndexOf(`\0agent:`);
        if (i < 0) continue;
        let o = t.slice(0, i),
          s = t.slice(i + 7),
          c = H(r),
          l = F(e, o, s, a.mainAlias);
        s !== G && l.isGlobal && c !== null && n.add(s);
      }
      if (n.size === 1) {
        let r = n.values().next().value;
        typeof r == `string` && ((o = F(e, t, r, a.mainAlias)), (s = R(a, e, t, r)));
      }
    }
    if (s.migrated)
      try {
        B(r, i, a);
      } catch {}
    let c = s.session;
    return !c || (!c.draft && !c.queue?.length)
      ? null
      : {
          draft: c.draft ?? ``,
          queue: (c.queue ?? [])
            .map((e) => U(e, o))
            .filter((e) => e !== null)
            .map((e) => Object.assign(e, { sessionKey: t })),
        };
  } catch {
    return null;
  }
}
function St(e, t = e.sessionKey, n = {}) {
  let r = m();
  if (!r || !t.trim()) return `storage-failed`;
  try {
    let i = N(e.settings?.gatewayUrl),
      a = z(r, i),
      { session: o, storeSessionKey: s } = R(a, e, t, n.agentId),
      c = Object.hasOwn(n, `draft`) ? (n.draft ?? ``) : e.chatMessage,
      l = o?.draftRevision;
    rt(r, i.key, s, l);
    let u = Math.max(l ?? 0, at(r, i.key, s)),
      d = Math.max(u, ot(r, i.key, s)),
      f = n.draftRevision ?? nt(d);
    if (!Number.isSafeInteger(f) || f <= 0) return `conflict`;
    let p = o?.draft ?? ``,
      m = n.expectedDraftRevision;
    if (!(m === void 0 || u === m || (l === f && p === c)) || f < d || (l === f && p !== c))
      return `conflict`;
    (it(r, i.key, s, f),
      (a.sessions[s] = {
        ...(c ? { draft: c } : {}),
        draftRevision: f,
        ...(o?.queue?.length ? { queue: o.queue } : {}),
        updatedAt: Date.now(),
      }),
      B(r, i, a));
    let h = R(z(r, i), e, t, n.agentId).session;
    return h?.draftRevision === f && (h.draft ?? ``) === c
      ? `persisted`
      : (h?.draftRevision ?? 0) >= f
        ? `conflict`
        : `storage-failed`;
  } catch {
    return `storage-failed`;
  }
}
function Ct(e, t = e.sessionKey, n = {}) {
  return St(e, t, n) === `persisted`;
}
function wt(e, t, n, r) {
  let i = m();
  if (!i || !t.trim()) return !1;
  try {
    let a = N(e.settings?.gatewayUrl),
      o = z(i, a),
      s = F(e, t, r ?? n.agentId, o.mainAlias),
      c = U(n, s);
    if (!c) return !1;
    let {
        session: l,
        storeSessionKey: u,
        migrated: d,
      } = R(o, e, t, s.agentScope === G ? void 0 : s.agentScope),
      f = l?.queue ?? [],
      p = f.find((e) => e.id === c.id);
    if (p) return gt(p, c, s) ? (d && B(i, a, o), !0) : !1;
    if (f.length >= jt) return !1;
    (_t(o, u, l, [...f, c]), B(i, a, o));
    let m = R(z(i, a), e, t, s.agentScope === G ? void 0 : s.agentScope).session?.queue?.find(
      (e) => e.id === c.id,
    );
    return !!(m && gt(m, c, s));
  } catch {
    return !1;
  }
}
function Tt(e, t, n, r, i) {
  let a = m();
  if (!a || !t.trim() || n.id !== r.id) return !1;
  try {
    let o = N(e.settings?.gatewayUrl),
      s = z(a, o),
      c = F(e, t, i ?? n.agentId ?? r.agentId, s.mainAlias),
      l = U(r, c);
    if (!l) return !1;
    let { session: u, storeSessionKey: d } = R(s, e, t, c.agentScope === G ? void 0 : c.agentScope),
      f = u?.queue ?? [],
      p = f.findIndex((e) => e.id === n.id),
      m = f[p];
    if (!m || !ht(m, n, c)) return !1;
    let h = f.slice();
    ((h[p] = l), _t(s, d, u, h), B(a, o, s));
    let g = R(z(a, o), e, t, c.agentScope === G ? void 0 : c.agentScope).session?.queue?.find(
      (e) => e.id === l.id,
    );
    return !!(g && gt(g, l, c));
  } catch {
    return !1;
  }
}
function Et(e, t, n, r, i) {
  let a = m();
  if (!a || !t.trim() || !n.trim()) return !1;
  try {
    let o = N(e.settings?.gatewayUrl),
      s = z(a, o),
      c = F(e, t, i ?? r?.agentId, s.mainAlias),
      { session: l, storeSessionKey: u } = R(s, e, t, c.agentScope === G ? void 0 : c.agentScope),
      d = l?.queue ?? [],
      f = d.findIndex((e) => e.id === n);
    if (f < 0) return !0;
    let p = d[f];
    return !p || (r && !ht(p, r, c))
      ? !1
      : (_t(
          s,
          u,
          l,
          d.filter((e, t) => t !== f),
        ),
        B(a, o, s),
        !R(z(a, o), e, t, c.agentScope === G ? void 0 : c.agentScope).session?.queue?.some(
          (e) => e.id === n,
        ));
  } catch {
    return !1;
  }
}
function W(e) {
  let t = m();
  if (!t) return [];
  try {
    let n = N(e.settings?.gatewayUrl),
      r = z(t, n),
      i = `\0agent:`,
      a = !1,
      o = x(e),
      s = Ze(e) ? ge(e) : void 0;
    (s && (a = R(r, e, `global`, s).migrated), o && (a = R(r, e, `global`, o).migrated || a));
    for (let t of Object.keys(r.sessions)) {
      let n = t.lastIndexOf(i);
      if (n < 0) continue;
      let o = t.slice(0, n),
        s = t.slice(n + 7);
      a = R(r, e, o, s === G ? void 0 : s).migrated || a;
    }
    if (a)
      try {
        B(t, n, r);
      } catch {}
    let c = [];
    for (let [t, n] of Object.entries(r.sessions)) {
      let a = t.lastIndexOf(i);
      if (a < 0) continue;
      let o = t.slice(0, a),
        s = t.slice(a + 7),
        l = H(n);
      if (!l?.queue?.length) continue;
      let u = F(e, o, s === G ? void 0 : s, r.mainAlias),
        d = l.queue.map((e) => U(e, u)).filter((e) => e !== null);
      d.length &&
        c.push({
          sessionKey: u.conversationKey,
          ...(u.routingAgentId ? { agentId: u.routingAgentId } : {}),
          queue: d,
        });
    }
    return c.toSorted(
      (e, t) =>
        (e.queue[0]?.createdAt ?? 2 ** 53 - 1) - (t.queue[0]?.createdAt ?? 2 ** 53 - 1) ||
        e.sessionKey.localeCompare(t.sessionKey),
    );
  } catch {
    return [];
  }
}
function Dt(e, t = {}) {
  let n = xt(e, t.sessionKey ?? e.sessionKey);
  return n
    ? ((!t.preserveCurrent || !e.chatMessage) && (e.chatMessage = n.draft),
      ((!t.preserveCurrent && n.queue.length > 0) || e.chatQueue.length === 0) &&
        (e.chatQueue = n.queue),
      !0)
    : !1;
}
var Ot,
  kt,
  At,
  jt,
  Mt,
  Nt,
  G,
  Pt,
  Ft,
  It,
  Lt,
  Rt,
  zt,
  Bt,
  Vt = e(() => {
    (y(),
      re(),
      M(),
      (Ot = `openclaw.control.chatComposer.v1:`),
      (kt = `openclaw.control.chatComposer.v2:`),
      (At = 20),
      (jt = 50),
      (Mt = At * jt),
      (Nt = 200),
      (G = `@unresolved`),
      (Pt = 0),
      (Ft = new WeakMap()),
      (It = new WeakMap()),
      (Lt = `Chat settings update was interrupted. Review and retry when ready.`),
      (Rt = `Could not store the previous draft in browser storage. It remains available in this tab.`),
      (zt = new WeakMap()),
      (Bt = class {
        constructor(e) {
          ((this.getState = e),
            (this.timer = null),
            (this.ready = !1),
            (this.pending = null),
            (this.lastPersisted = null),
            (this.committedDraftRevision = 0),
            (this.latestDraftRevision = 0));
        }
        start() {
          let e = this.getState();
          if (!e) return;
          ((this.ready = !0), (this.pending = null));
          let t = this.readDraftRevisions(e);
          ((this.committedDraftRevision = t.committed),
            (this.latestDraftRevision = t.latestAttempt),
            (this.lastPersisted = this.snapshot(e, t.committed, t.committed)));
        }
        stop() {
          (this.persistNow(), (this.ready = !1), (this.pending = null), this.clearTimer());
        }
        restore(e = {}) {
          let t = this.getState();
          if (!t) return !1;
          let n = Dt(t, e);
          ((this.pending = null), this.clearTimer());
          let r = this.readDraftRevisions(t);
          return (
            (this.committedDraftRevision = r.committed),
            (this.latestDraftRevision = r.latestAttempt),
            (this.lastPersisted = this.snapshot(t, r.committed, r.committed)),
            n
          );
        }
        schedule() {
          let e = this.getState();
          if (!this.ready || !e) return;
          let t = this.snapshot(e);
          if (this.isUnchanged(t)) {
            if (!this.pending) {
              this.clearTimer();
              return;
            }
            if (this.pending.chatMessage === t.chatMessage) {
              (this.clearTimer(),
                (this.timer = globalThis.setTimeout(() => this.persistNow(), Nt)));
              return;
            }
          }
          let n = nt(Math.max(this.latestDraftRevision, this.pending?.draftRevision ?? 0));
          ((this.latestDraftRevision = n),
            (this.pending = this.snapshot(e, n, this.committedDraftRevision)),
            this.clearTimer(),
            (this.timer = globalThis.setTimeout(() => this.persistNow(), Nt)));
        }
        persistNow() {
          let e = this.getState();
          if (!this.ready || !e) return;
          let t = this.pending;
          if (!t) {
            let n = this.snapshot(e);
            if (this.isUnchanged(n)) return;
            ((t = this.snapshot(e, nt(this.latestDraftRevision), this.committedDraftRevision)),
              (this.latestDraftRevision = t.draftRevision));
          }
          (this.clearTimer(),
            (this.pending = this.persistSnapshot(e, t).status === `persisted` ? null : t));
        }
        persistChangedState() {
          this.persistNow();
        }
        scopeForRouteSwitch() {
          let e = this.getState();
          if (!e) return null;
          let t = this.snapshot(e),
            n = this.pending ?? (this.isUnchanged(t) ? (this.lastPersisted ?? t) : t);
          return I(e, n.sessionKey, n.agentId);
        }
        persistForRouteSwitch() {
          return this.persistForRouteSwitchResult().status === `persisted`;
        }
        persistForRouteSwitchResult() {
          let e = this.getState();
          if (!e) return { status: `persisted` };
          let t = this.pending,
            n = !1,
            r = this.snapshot(e);
          if (!t && this.ready && this.isUnchanged(r)) {
            let i = this.lastPersisted ?? r;
            if (!i.chatMessage)
              return ((this.pending = null), this.clearTimer(), { status: `persisted` });
            let a = this.readDraftRevisions(e, i.sessionKey, i.agentId),
              o = a.committed,
              s = xt(e, i.sessionKey, i.agentId);
            if (o === i.draftRevision && s?.draft === i.chatMessage)
              return ((this.pending = null), this.clearTimer(), { status: `persisted` });
            if (o !== i.draftRevision || s?.draft || a.latestAttempt > i.draftRevision)
              return { status: `conflict` };
            ((t = {
              ...i,
              expectedDraftRevision: o,
              draftRevision: nt(Math.max(o, a.latestAttempt, this.latestDraftRevision)),
            }),
              (this.latestDraftRevision = t.draftRevision),
              (n = !0));
          } else if (!t && !this.ready && !r.chatMessage)
            return ((this.pending = null), this.clearTimer(), { status: `persisted` });
          ((t ??= this.snapshot(e, nt(this.latestDraftRevision), this.committedDraftRevision)),
            (this.latestDraftRevision = Math.max(this.latestDraftRevision, t.draftRevision)),
            this.clearTimer());
          let i = this.persistSnapshot(e, t, n);
          return ((this.pending = i.status === `persisted` ? null : t), i);
        }
        adoptCurrentRoute() {
          let e = this.getState();
          if (!e) return;
          ((this.pending = null), this.clearTimer());
          let t = this.readDraftRevisions(e);
          ((this.committedDraftRevision = t.committed),
            (this.latestDraftRevision = t.latestAttempt),
            (this.lastPersisted = this.snapshot(e, t.committed, t.committed)));
        }
        persistSnapshot(e, t, n = !1) {
          let r = St(e, t.sessionKey, {
            agentId: t.agentId,
            draft: t.chatMessage,
            draftRevision: t.draftRevision,
            ...(n ? { expectedDraftRevision: t.expectedDraftRevision } : {}),
          });
          return r === `persisted`
            ? ((this.committedDraftRevision = t.draftRevision),
              (this.latestDraftRevision = Math.max(this.latestDraftRevision, t.draftRevision)),
              (this.lastPersisted = t),
              { status: r })
            : r === `storage-failed`
              ? {
                  status: r,
                  expectedDraftRevision: t.expectedDraftRevision,
                  draftRevision: t.draftRevision,
                }
              : { status: r };
        }
        clearTimer() {
          this.timer !== null && (globalThis.clearTimeout(this.timer), (this.timer = null));
        }
        isUnchanged(e) {
          let t = this.lastPersisted;
          return !!(t && t.sessionKey === e.sessionKey && t.chatMessage === e.chatMessage);
        }
        snapshot(e, t = this.latestDraftRevision, n = this.committedDraftRevision) {
          let r = I(e, e.sessionKey);
          return {
            sessionKey: e.sessionKey,
            chatMessage: e.chatMessage,
            ...(r.agentId ? { agentId: r.agentId } : {}),
            expectedDraftRevision: n,
            draftRevision: t,
          };
        }
        readDraftRevisions(e, t = e.sessionKey, n) {
          return vt(e, t, n);
        }
      }));
  });
function Ht(e, t) {
  let n = Y.get(e) ?? new Set();
  (n.add(t), Y.set(e, n));
}
function Ut(e, t) {
  let n = Y.get(e);
  (n?.delete(t), n?.size === 0 && Y.delete(e));
}
function Wt(e, t) {
  return X.get(e)?.has(t) === !0;
}
function Gt(e, t) {
  let n = X.get(e) ?? new Set();
  (n.add(t), X.set(e, n));
}
function Kt(e, t) {
  let n = X.get(e);
  (n?.delete(t), n?.size === 0 && X.delete(e));
}
function qt(e) {
  return e.settings?.gatewayUrl?.trim() || `default`;
}
function Jt(e, t, n) {
  return `${qt(e)}\u0000${L(t)}\u0000${n}`;
}
function Yt(e, t, n) {
  return J.get(Jt(e, t, n));
}
function Xt(e) {
  return e.sendState === `sending` || e.sendState === `executing-command`;
}
function Zt(e, t, n) {
  let r = Jt(e, t, n.id);
  Xt(n) ? J.set(r, n) : J.delete(r);
}
function Qt(e, t) {
  return W(e).find((e) => e.queue.some((e) => e.id === t));
}
function $t(e, t) {
  return e.sessionKey === t.sessionKey && e.agentId === t.agentId;
}
function en(e, t) {
  return (
    W(e).find((e) => $t(e, t)) ?? {
      sessionKey: t.sessionKey,
      ...(t.agentId ? { agentId: t.agentId } : {}),
      queue: [],
    }
  );
}
function K(e, t, n = {}) {
  let r = w(e, t.sessionKey, t.agentId),
    i = L(t),
    a = r ? e.chatQueue : (e.chatQueueByScope?.[i] ?? []),
    o = a.filter((e) => e.pendingRunId),
    s = new Map(o.map((e) => [e.id, e])),
    c = new Set(t.queue.map((e) => e.id)),
    l = a.filter((t) => !t.pendingRunId && !c.has(t.id) && Y.get(e)?.has(t.id)),
    u = t.queue.map((n) => {
      let r = s.get(n.id);
      if (r) return r;
      let o = Yt(e, t, n.id);
      if (o) return o;
      let c = a.find((e) => e.id === n.id && e.sendRunId === n.sendRunId),
        l =
          n.sendState === `waiting-reconnect` &&
          c?.sendState === `sending` &&
          c.sendAttempts === n.sendAttempts &&
          ((e.chatSending === !0 && e.chatSendingScopeKey === i) || e.chatRunId === n.sendRunId),
        u =
          n.sendState === `unconfirmed` &&
          c?.sendState === `executing-command` &&
          c.localCommandName === n.localCommandName &&
          c.localCommandArgs === n.localCommandArgs;
      return {
        ...n,
        ...(l ? { sendState: `sending` } : u ? { sendState: `executing-command` } : {}),
        ...(typeof c?.sendSubmittedAtMs == `number`
          ? { sendSubmittedAtMs: c.sendSubmittedAtMs }
          : {}),
        ...(typeof c?.sendRequestStartedAtMs == `number`
          ? { sendRequestStartedAtMs: c.sendRequestStartedAtMs }
          : {}),
      };
    }),
    d = o.filter((e) => !c.has(e.id)),
    f = [...u, ...l, ...d].toSorted((e, t) => e.createdAt - t.createdAt);
  if (r) e.chatQueue = f;
  else {
    let t = { ...e.chatQueueByScope };
    (f.length ? (t[i] = f) : delete t[i], (e.chatQueueByScope = t));
  }
  n.requestUpdate !== !1 && e.requestUpdate?.();
}
function tn(e, t = {}) {
  let n = W(e).find((t) => w(e, t.sessionKey, t.agentId));
  n && K(e, n, t);
}
function q(e, t) {
  for (let n of Dn) {
    let r =
        (n.settings?.gatewayUrl?.trim() || `default`) ===
        (e.settings?.gatewayUrl?.trim() || `default`),
      i = w(n, t.sessionKey, t.agentId),
      a = Object.hasOwn(n.chatQueueByScope ?? {}, L(t));
    n === e || !r || (!i && !a) || K(n, t);
  }
}
function nn(e, t) {
  return W(e).find((e) => $t(e, t)) ?? { ...t, queue: [] };
}
function rn(e, t, n, r) {
  let i = I(e, t, r),
    a = nn(e, i);
  return a.queue.some((e) => e.id === n.id) ? (J.set(Jt(e, i, n.id), n), K(e, a), q(e, a), !0) : !1;
}
function an(e, t, n, r) {
  let i = I(e, t, r);
  J.delete(Jt(e, i, n));
  let a = nn(e, i);
  (K(e, a), q(e, a));
}
function on(e) {
  Dn.add(e);
  for (let t of W(e)) {
    let n = w(e, t.sessionKey, t.agentId),
      r = Object.hasOwn(e.chatQueueByScope ?? {}, L(t));
    (n || r) && K(e, t);
  }
  return () => Dn.delete(e);
}
function sn(e, t, n, r, i) {
  let a = t.trim(),
    o = !!(n && n.length > 0);
  if (!a && !o) return null;
  let s = {
    id: de(),
    text: a,
    createdAt: Date.now(),
    attachments: o ? Ke(n ?? []) : void 0,
    refreshSessions: r,
    localCommandArgs: i?.args,
    localCommandName: i?.name,
    sessionKey: e.sessionKey,
    agentId: be(e, e.sessionKey),
  };
  return ((e.chatQueue = [...e.chatQueue, s]), s);
}
function cn(e, t, n, r) {
  let i = t.trim(),
    a = !!(r && r.length > 0);
  (!i && !a) ||
    (e.chatQueue = [
      ...e.chatQueue,
      {
        id: de(),
        text: i,
        createdAt: Date.now(),
        kind: `steered`,
        attachments: a ? Ke(r ?? []) : void 0,
        pendingRunId: n,
      },
    ]);
}
function ln(e, t, n) {
  let r = I(e, t, n);
  return w(e, r.sessionKey, r.agentId) ? e.chatQueue : (e.chatQueueByScope?.[L(r)] ?? []);
}
function un(e, t, n, r, i, a) {
  let o = ln(e, t, a);
  return o.some((e) => e.id === n && e.pendingRunId === r)
    ? (dn(
        e,
        t,
        o.map((e) => (e.id === n && e.pendingRunId === r ? i : e)),
        a,
      ),
      !0)
    : !1;
}
function dn(e, t, n, r) {
  let i = I(e, t, r);
  if (w(e, i.sessionKey, i.agentId)) {
    e.chatQueue = n;
    return;
  }
  let a = L(i),
    o = { ...e.chatQueueByScope };
  (n.length > 0 ? (o[a] = n) : delete o[a], (e.chatQueueByScope = o), e.requestUpdate?.());
}
function fn(e, t) {
  if (e.chatQueue.some((e) => e.id === t)) return { active: !0, queue: e.chatQueue };
  for (let [n, r] of Object.entries(e.chatQueueByScope ?? {}))
    if (r.some((e) => e.id === t)) return { active: !1, queue: r, scopeKey: n };
  return null;
}
function pn(e, t, n) {
  if (t.active) {
    e.chatQueue = n;
    return;
  }
  if (!t.scopeKey) return;
  let r = { ...e.chatQueueByScope };
  (n.length ? (r[t.scopeKey] = n) : delete r[t.scopeKey],
    (e.chatQueueByScope = r),
    e.requestUpdate?.());
}
function mn(e, t) {
  return fn(e, t)?.queue.find((e) => e.id === t) ?? Qt(e, t)?.queue.find((e) => e.id === t) ?? null;
}
function hn(e, t, n) {
  return _n(e, e.sessionKey, t, n);
}
function gn(e, t, n) {
  let r = fn(e, t),
    i = r?.queue.find((e) => e.id === t);
  if (!r || !i) return null;
  (Ht(e, t), Gt(e, t));
  let a = n(i);
  return (
    pn(
      e,
      r,
      r.queue.map((e) => (e.id === t ? a : e)),
    ),
    a
  );
}
function _n(e, t, n, r, i) {
  let a = fn(e, n),
    o = Qt(e, n),
    s = o ?? I(e, t, i),
    c = a?.queue ?? ln(e, s.sessionKey, s.agentId),
    l = o?.queue.find((e) => e.id === n),
    u = c.find((e) => e.id === n) ?? l;
  if (!u) return null;
  let d = c.length || !o ? c : o.queue,
    f = r(u);
  if (o && !Tt(e, o.sessionKey, u, f, o.agentId ?? u.agentId ?? f.agentId)) {
    Xt(f) || Zt(e, s, f);
    let t = en(e, o);
    return (K(e, t), q(e, t), null);
  }
  Zt(e, s, f);
  let p = d.map((e) => (e.id === n ? f : e));
  if ((a ? pn(e, a, p) : dn(e, s.sessionKey, p, s.agentId), o)) {
    let t = en(e, o);
    q(e, { ...t, queue: t.queue.map((e) => (e.id === n ? f : e)) });
  }
  return f;
}
function vn(e, t, n) {
  if (!wt(e, t, n, n.agentId)) return (n.sendState === `failed` && Ht(e, n.id), !1);
  (Ut(e, n.id), Kt(e, n.id));
  let r = Qt(e, n.id);
  return r ? (q(e, r), !0) : !1;
}
function yn(e, t, n = e.sessionKey, r) {
  let i = fn(e, t),
    a = Qt(e, t),
    o = a ?? I(e, n, r),
    s = i?.queue ?? ln(e, o.sessionKey, o.agentId),
    c = a?.queue.find((e) => e.id === t) ?? null,
    l = s.find((e) => e.id === t) ?? c,
    u = s.length || !a ? s : a.queue;
  if (l && a && !Et(e, a.sessionKey, t, l, a.agentId ?? l.agentId)) {
    let t = en(e, a);
    return (K(e, t), q(e, t), null);
  }
  l && J.delete(Jt(e, o, l.id));
  let d = u.filter((e) => e.id !== t);
  return (
    i ? pn(e, i, d) : dn(e, o.sessionKey, d, o.agentId),
    a && q(e, en(e, a)),
    l && (Ut(e, t), Kt(e, t)),
    l
  );
}
function bn(e, t, n) {
  return yn(e, t) ?? (n ? yn(e, t, n) : null);
}
function xn(e, t) {
  if (!t?.length) return t ? [] : void 0;
  let n = new Set((e.chatAttachments ?? []).map((e) => e.id));
  return t.filter((e) => !n.has(e.id));
}
function Sn(e, t) {
  let n = yn(e, t);
  n && A(xn(e, n.attachments));
}
function Cn(e, t) {
  let n = wn(e, t);
  if (!n) return null;
  let r = yn(e, n.item.id, n.outbox.sessionKey, n.outbox.agentId);
  return r ? (A(xn(e, r.attachments)), r) : null;
}
function wn(e, t) {
  return t
    ? (W(e)
        .flatMap((e) => e.queue.map((t) => ({ item: t, outbox: e })))
        .find(({ item: e }) => e.sendRunId === t) ?? null)
    : null;
}
function Tn(e, t) {
  if (!t) return;
  let n = e.chatQueue.filter((e) => e.pendingRunId === t);
  e.chatQueue = e.chatQueue.filter((e) => e.pendingRunId !== t);
  for (let t of n) A(xn(e, t.attachments));
}
function En(e) {
  let t = [...e.chatQueue, ...Object.values(e.chatQueueByScope ?? {}).flat()];
  for (let n of t)
    if (!(!n.sendRunId || (n.sendState !== `sending` && n.sendState !== `waiting-idle`))) {
      if (Wt(e, n.id)) {
        gn(e, n.id, (e) => ({ ...e, sendState: `unconfirmed` }));
        continue;
      }
      _n(
        e,
        n.sessionKey ?? e.sessionKey,
        n.id,
        (e) => ({ ...e, sendState: `waiting-reconnect` }),
        n.agentId,
      );
    }
}
var Dn,
  J,
  Y,
  X,
  On = e(() => {
    (ye(),
      se(),
      M(),
      Vt(),
      (Dn = new Set()),
      (J = new Map()),
      (Y = new WeakMap()),
      (X = new WeakMap()));
  });
function kn(e) {
  let t = /^data:([^;]+);base64,(.+)$/.exec(e);
  if (!t) return null;
  let n = t[1],
    r = t[2];
  return n && r ? { mimeType: n, content: r } : null;
}
function An(e) {
  return e?.length
    ? e
        .map((e) => {
          let t = Ue(e),
            n = t ? kn(t) : null;
          return n
            ? {
                type: n.mimeType.startsWith(`image/`) ? `image` : `file`,
                mimeType: n.mimeType,
                fileName: e.fileName,
                content: n.content,
              }
            : null;
        })
        .filter((e) => e !== null)
    : void 0;
}
var jn = e(() => {
  M();
});
function Mn(e) {
  return e.sessionsResult?.sessions?.find((t) => t.key === e.sessionKey);
}
function Nn(e) {
  let t = e.chatModelCatalog ?? [],
    n = e.modelOverrides;
  if (Object.hasOwn(n, e.sessionKey)) {
    let r = n[e.sessionKey];
    return r == null ? `` : d(ae(r), t);
  }
  let r = Mn(e);
  return ve(r?.model, r?.modelProvider, t);
}
function Pn(e) {
  return (
    ve(e.agentDefaultModel, void 0, e.chatModelCatalog ?? []) ||
    ve(
      e.sessionsResult?.defaults?.model,
      e.sessionsResult?.defaults?.modelProvider,
      e.chatModelCatalog ?? [],
    )
  );
}
function Z(e) {
  let t = e.trim().toLowerCase(),
    n = t.indexOf(`/`);
  return n <= 0 ? t : `${C(t.slice(0, n))}/${t.slice(n + 1)}`;
}
function Fn(e, t) {
  let n = new Set(e.filter((e) => e.available !== !1).map((e) => Z(_(e, t).value)));
  return new Set(
    e
      .filter((e) => e.available === !1)
      .map((e) => Z(_(e, t).value))
      .filter((e) => !n.has(e)),
  );
}
function In(e, t, n) {
  let r = e.trim().toLowerCase();
  if (!r) return e;
  for (let e of t) {
    if (e.available === !1) continue;
    let t = _(e, n);
    if (t.value.trim().toLowerCase() === r) return t.value;
  }
  let i = Z(e);
  for (let e of t) {
    if (e.available === !1) continue;
    let t = _(e, n);
    if (Z(t.value) === i) return t.value;
  }
  return e;
}
function Ln(e, t, n, r) {
  let i = new Set(),
    a = [],
    o = Fn(e, t),
    s = (e, t) => {
      Me(a, i, e, (e) => t ?? e);
    },
    c = (e, t) => {
      o.has(Z(e)) || s(e, t);
    };
  for (let n of e) {
    if (n.available === !1) continue;
    let e = _(n, t);
    s(e.value, e.label);
  }
  return (n && c(n, S(n, t)), r && c(r, S(r, t)), a);
}
function Rn(e) {
  let t = e.chatModelCatalog ?? [],
    n = _e(t.filter((e) => e.available !== !1)),
    r = In(Nn(e), t, n),
    i = In(Pn(e), t, n),
    a = S(i, n),
    o = Fn(t, n);
  return {
    currentOverride: r,
    defaultSelectable: !i || !o.has(Z(i)),
    defaultModel: i,
    defaultDisplay: a,
    defaultLabel: i ? `Default (${a})` : `Default model`,
    options: Ln(t, n, r, i),
  };
}
function zn(e) {
  if (e === `auto`) return `auto`;
  if (e === `on`) return !0;
  if (e === `off`) return !1;
}
function Bn(e) {
  return ke({
    mode: e?.effectiveFastMode ?? e?.fastMode,
    source: e?.effectiveFastModeSource,
    fastAutoOnSeconds: e?.fastAutoOnSeconds,
  });
}
function Vn(e, t, n) {
  let r = e.trim();
  if (!r) return null;
  let i = r.toLowerCase(),
    a = new Set(
      t
        .filter((e) => e.id.trim().toLowerCase() === i)
        .map((e) => C(e.provider))
        .filter(Boolean),
    ),
    o = new Set(
      t
        .filter((e) => oe(e.id, e.provider).trim().toLowerCase() === i)
        .map((e) => C(e.provider))
        .filter(Boolean),
    );
  return o.size === 1
    ? ([...o][0] ?? null)
    : n && a.has(n) && !o.has(n)
      ? n
      : a.size === 1
        ? ([...a][0] ?? null)
        : null;
}
function Hn(e, t) {
  let n = e.trim().toLowerCase();
  return n
    ? t.some((e) => {
        let t = e.id.trim().toLowerCase(),
          r = oe(e.id, e.provider).trim().toLowerCase();
        return t === n || r === n;
      })
    : !1;
}
function Un(e) {
  let t = e.sessionsResult?.sessions?.find((t) => t.key === e.sessionKey),
    n = C(t?.modelProvider ?? ``) || null,
    r = C(e.sessionsResult?.defaults?.modelProvider ?? ``) || null,
    i = Hn(e.currentModelOverride, e.catalog),
    a = !e.currentModelOverride || !i ? (n ?? r) : null,
    o = Vn(e.currentModelOverride, e.catalog, n) ?? a ?? null,
    s =
      t?.fastMode === `auto` ? `auto` : t?.fastMode === !0 ? `on` : t?.fastMode === !1 ? `off` : ``,
    c = o === `openai`,
    l = t?.effectiveFastMode ?? t?.fastMode,
    u = c ? (l === !0 ? `on` : l === `auto` ? `auto` : `off`) : s,
    d = !!(o && Wn.has(o)),
    f = d || !!s,
    p = l === !0 || l === `auto`,
    m = l === `auto` ? `Auto` : p ? `Fast` : c || u === `off` ? `Standard` : `Default`,
    h = d ? (p ? `off` : `on`) : ``;
  return {
    active: p,
    currentOverride: u,
    disabled:
      !f ||
      !e.connected ||
      e.loading ||
      e.sending ||
      !!e.activeRunId ||
      e.stream !== null ||
      !e.gatewayAvailable,
    label: m,
    nextValue: h,
    supported: f,
  };
}
var Wn,
  Gn = e(() => {
    (Oe(), Ne(), te(), (Wn = new Set([`anthropic`, `minimax`, `minimax-portal`, `openai`, `xai`])));
  });
function Kn(e) {
  Q &&= (globalThis.clearTimeout(Q.timer), e && A(Q.item.attachments ?? []), null);
}
function qn(e, t) {
  (Kn(!0), (Q = { item: t, sessionKey: e, timer: globalThis.setTimeout(() => Kn(!0), Xn) }));
}
function Jn(e) {
  if (!Q || !p(Q.sessionKey, e)) return null;
  let t = Q.item;
  return (Kn(!1), t);
}
function Yn(e, t) {
  let n = Jn(t);
  if (!n) return !1;
  let r = ln(e, t, n.agentId);
  return (
    r.some((e) => e.id === n.id) || dn(e, t, [...r, n], n.agentId), Ht(e, n.id), Gt(e, n.id), !0
  );
}
var Xn,
  Q,
  Zn = e(() => {
    (y(), M(), On(), (Xn = 6e4), (Q = null));
  });
function $(e) {
  return e.getAttachments?.() ?? e.attachments ?? [];
}
function Qn(e) {
  return e.type.startsWith(`video/`) ? !1 : !/\.(?:avi|m4v|mov|mp4|mpeg|mpg|webm)$/i.test(e.name);
}
function $n(e, t) {
  (e.closest(`details`)?.removeAttribute(`open`),
    e
      .closest(`.agent-chat__composer-shell, .new-session-page__composer`)
      ?.querySelector(t)
      ?.click());
}
function er() {
  return `att-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
function tr(e, t) {
  return He({
    attachment: {
      id: er(),
      mimeType: e.type || `application/octet-stream`,
      fileName: e.name || void 0,
      sizeBytes: e.size,
    },
    dataUrl: t,
    file: e,
  });
}
function nr(e) {
  return Er.has(e);
}
function rr(e) {
  let t = new TextEncoder().encode(e),
    n = [],
    r = 32768;
  for (let e = 0; e < t.length; e += r) n.push(String.fromCharCode(...t.subarray(e, e + r)));
  return `data:${Cr};base64,${btoa(n.join(``))}`;
}
function ir(e) {
  let t = tr(new File([e], `${wr}${Date.now()}.txt`, { type: Cr }), rr(e));
  Er.add(t);
  let n = or(e);
  return (n && Dr.set(t, n), t);
}
function ar(e) {
  let t = /^data:([^,]*),(.*)$/s.exec(e);
  if (!t) return null;
  let n = t[1],
    r = t[2];
  if (n === void 0 || r === void 0) return null;
  if (n.toLowerCase().includes(`;base64`))
    try {
      let e = atob(r),
        t = Uint8Array.from(e, (e) => e.charCodeAt(0));
      return new TextDecoder().decode(t);
    } catch {
      return null;
    }
  try {
    return decodeURIComponent(r.replace(/\+/g, `%20`));
  } catch {
    return null;
  }
}
function or(e) {
  let t = e.replace(/\s+/gu, ` `).trim();
  return t ? (t.length <= Tr ? t : `${c(t, Tr).trimEnd()}...`) : null;
}
function sr(e) {
  return Dr.get(e) ?? e.fileName ?? `Attached file`;
}
function cr(e, t) {
  return e.trim() ? `${e.replace(/\s+$/u, ``)}\n\n${t}` : t;
}
function lr(e, t) {
  if (!t.onAttachmentsChange) return !1;
  let n = e.clipboardData?.getData(`text/plain`);
  if (!n || n.length <= Sr) return !1;
  e.preventDefault();
  let r = ir(n);
  return (t.onAttachmentsChange([...$(t), r]), !0);
}
function ur(e, t = `pasted-image`) {
  let n = /^\s*data:(image\/[a-z0-9.+-]+);base64,([a-z0-9+/=\s]+)\s*$/i.exec(e);
  if (!n) return null;
  let r = n[1]?.toLowerCase(),
    i = n[2];
  if (!r || !i || !Qn({ name: t, type: r })) return null;
  let a = i.replace(/\s+/g, ``);
  try {
    let e = atob(a),
      n = new Uint8Array(e.length);
    for (let t = 0; t < e.length; t++) n[t] = e.charCodeAt(t);
    let i = r.split(`/`)[1]?.replace(/[^a-z0-9.+-]/gi, ``) || `png`;
    return { file: new File([n], `${t}.${i}`, { type: r }), dataUrl: `data:${r};base64,${a}` };
  } catch {
    return null;
  }
}
function dr(e, t) {
  let n = ur(e, t.replace(/\.[a-z0-9]+$/i, ``) || `image`);
  return n ? tr(n.file, n.dataUrl) : null;
}
function fr(e, t) {
  return t.readSignal?.aborted
    ? Promise.resolve(null)
    : (t.onPendingReadsChange?.(1),
      new Promise((n) => {
        let r = new FileReader(),
          i = !1,
          a = (e) => {
            i ||
              ((i = !0),
              t.readSignal?.removeEventListener(`abort`, o),
              t.onPendingReadsChange?.(-1),
              n(e));
          },
          o = () => {
            (r.abort(), a(null));
          };
        (t.readSignal?.addEventListener(`abort`, o, { once: !0 }),
          r.addEventListener(`error`, () => a(null), { once: !0 }),
          r.addEventListener(`abort`, () => a(null), { once: !0 }),
          r.addEventListener(
            `load`,
            () => {
              let n = typeof r.result == `string` ? r.result : null;
              a(n && !t.readSignal?.aborted ? tr(e, n) : null);
            },
            { once: !0 },
          ),
          r.readAsDataURL(e));
      }));
}
async function pr(e, t) {
  let n = e.filter(Qn);
  if (!t.onAttachmentsChange || n.length === 0) return;
  let r = (await Promise.all(n.map((e) => fr(e, t)))).filter((e) => e !== null);
  if (t.readSignal?.aborted) {
    for (let e of r) qe(e.id);
    return;
  }
  r.length !== 0 && t.onAttachmentsChange([...$(t), ...r]);
}
function mr(e, t) {
  let n = e.clipboardData?.items;
  if (!n || !t.onAttachmentsChange) return;
  let r = Array.from(n)
    .filter((e) => e.type.startsWith(`image/`))
    .map((e) => e.getAsFile())
    .filter((e) => e !== null);
  if (r.length === 0) {
    let n = e.clipboardData?.getData(`text/plain`),
      r = n ? ur(n) : null;
    if (!r) {
      lr(e, t);
      return;
    }
    (e.preventDefault(), t.onAttachmentsChange([...$(t), tr(r.file, r.dataUrl)]));
    return;
  }
  (e.preventDefault(), pr(r, t));
}
function hr(e, t) {
  let n = Ue(e),
    r = n ? ar(n) : null;
  if (!r || !t.onDraftChange) return;
  let i = $(t).filter((t) => t.id !== e.id);
  (qe(e.id),
    t.onAttachmentsChange?.(i),
    t.onDraftChange(cr(t.getDraft?.() ?? t.draft ?? ``, r)),
    t.onRequestUpdate?.());
}
function gr(e, t) {
  let n = e.target,
    r = [...(n.files ?? [])];
  ((n.value = ``), pr(r, t));
}
function _r(e, t) {
  (e.preventDefault(), pr([...(e.dataTransfer?.files ?? [])], t));
}
function vr(e) {
  return n`
    <input
      type="file"
      accept=${xr}
      multiple
      class="agent-chat__file-input"
      ?disabled=${e.disabled}
      @change=${(t) => {
        e.disabled || gr(t, e);
      }}
    />
    <input
      type="file"
      accept="image/*"
      multiple
      class="agent-chat__photo-input"
      ?disabled=${e.disabled}
      @change=${(t) => {
        e.disabled || gr(t, e);
      }}
    />
    <input
      type="file"
      accept="image/*"
      capture="environment"
      class="agent-chat__camera-input"
      ?disabled=${e.disabled}
      @change=${(t) => {
        e.disabled || gr(t, e);
      }}
    />
  `;
}
function yr(e) {
  return n`
    <wa-dropdown
      class="agent-chat__attach-menu"
      placement="top-start"
      aria-label=${E(`chat.composer.addAttachment`)}
      @wa-select=${(e) => {
        let t = e.currentTarget,
          n =
            e.detail.item.value === `camera`
              ? `.agent-chat__camera-input`
              : e.detail.item.value === `photo`
                ? `.agent-chat__photo-input`
                : e.detail.item.value === `file`
                  ? `.agent-chat__file-input`
                  : null;
        n && $n(t, n);
      }}
    >
      <button
        slot="trigger"
        type="button"
        class="agent-chat__input-btn agent-chat__input-btn--attach"
        aria-label=${E(`chat.composer.addAttachment`)}
        ?disabled=${e.disabled}
        title=${E(`chat.composer.addAttachment`)}
        @pointerdown=${(e) => {
          let t = e.currentTarget.closest(`.agent-chat__composer-shell`)?.querySelector(`textarea`);
          document.activeElement === t && e.preventDefault();
        }}
      >
        ${k.plus}
      </button>
      <wa-dropdown-item class="agent-chat__attach-menu-option" value="camera">
        <span slot="icon" aria-hidden="true">${k.camera}</span>
        <span>${E(`chat.composer.takePhoto`)}</span>
      </wa-dropdown-item>
      <wa-dropdown-item class="agent-chat__attach-menu-option" value="photo">
        <span slot="icon" aria-hidden="true">${k.image}</span>
        <span>${E(`chat.composer.attachPhoto`)}</span>
      </wa-dropdown-item>
      <wa-dropdown-item class="agent-chat__attach-menu-option" value="file">
        <span slot="icon" aria-hidden="true">${k.folder}</span>
        <span>${E(`chat.composer.attachFileOption`)}</span>
      </wa-dropdown-item>
    </wa-dropdown>
  `;
}
function br(e) {
  let t = e.attachments ?? [];
  return t.length === 0
    ? a
    : n`
    <div class="chat-attachments-preview">
      ${t.map(
        (t) => n`
          <div
            class=${[`chat-attachment-thumb`, t.mimeType.startsWith(`image/`) ? `` : `chat-attachment-thumb--file`, nr(t) ? `chat-attachment-thumb--pasted-text` : ``].filter(Boolean).join(` `)}
          >
            ${
              t.mimeType.startsWith(`image/`) && We(t)
                ? n`<img src=${We(t)} alt="Attachment preview" />`
                : nr(t)
                  ? n`
                    <div class="chat-attachment-file chat-attachment-file--pasted-text">
                      <span class="chat-attachment-file__icon">${k.fileText}</span>
                      <span class="chat-attachment-file__body">
                        <span class="chat-attachment-file__name">${sr(t)}</span>
                        <button
                          class="chat-attachment-text-action"
                          type="button"
                          aria-label=${E(`worktrees.restore`)}
                          ?disabled=${e.disabled}
                          @click=${() => hr(t, e)}
                        >
                          ${E(`worktrees.restore`)}
                          <span aria-hidden="true">${k.chevronRight}</span>
                        </button>
                      </span>
                    </div>
                  `
                  : n`
                    <openclaw-tooltip .content=${t.fileName ?? `Attached file`}>
                      <div class="chat-attachment-file">
                        <span class="chat-attachment-file__icon">${k.paperclip}</span>
                        <span class="chat-attachment-file__name"
                          >${t.fileName ?? `Attached file`}</span
                        >
                      </div>
                    </openclaw-tooltip>
                  `
            }
            <openclaw-tooltip .content=${E(`chat.composer.removeAttachment`)}>
              <button
                class="chat-attachment-remove"
                type="button"
                aria-label=${E(`chat.composer.removeAttachment`)}
                ?disabled=${e.disabled}
                @click=${() => {
                  let n = $(e).filter((e) => e.id !== t.id);
                  (qe(t.id), e.onAttachmentsChange?.(n));
                }}
              >
                ${k.x}
              </button>
            </openclaw-tooltip>
          </div>
        `,
      )}
    </div>
  `;
}
var xr,
  Sr,
  Cr,
  wr,
  Tr,
  Er,
  Dr,
  Or = e(() => {
    (u(),
      r(),
      D(),
      O(),
      Ee(),
      Se(),
      M(),
      (xr = `image/*,audio/*,application/pdf,text/*,.csv,.json,.md,.txt,.zip,.doc,.docx,.xls,.xlsx,.ppt,.pptx`),
      (Sr = 1e3),
      (Cr = `text/plain`),
      (wr = `pasted-text-`),
      (Tr = 20),
      (Er = new WeakSet()),
      (Dr = new WeakMap()));
  });
function kr(e) {
  return he(e.assistantAvatarUrl, {
    identity: { avatar: e.assistantAvatar ?? void 0, avatarUrl: e.assistantAvatarUrl ?? void 0 },
  });
}
function Ar(e) {
  return kr(e) ?? ce(e.assistantAvatar);
}
function jr(e) {
  if (!e.sessions) return [];
  let t = b(e.sessionHost ?? {}),
    n = ie(e.sessionKey)?.agentId ?? t;
  return pe(e.sessions, { agentId: n, defaultAgentId: t, filterByAgent: !0 })
    .filter((t) => !p(t.key, e.sessionKey) && !le(t.key, t.channel).channelSession)
    .toSorted((e, t) => (t.updatedAt ?? 0) - (e.updatedAt ?? 0) || e.key.localeCompare(t.key))
    .slice(0, Rr);
}
function Mr() {
  let e = we(De.find((e) => e.id === `crimson`) ?? l(De[0], `welcome lobster palette`));
  return n`
    <div
      class="agent-chat__welcome-clawd"
      style=${`--lob-shell:${e.palette.shell};--lob-claw:${e.palette.claw}`}
      aria-hidden="true"
    >
      ${Ce(e)}
    </div>
  `;
}
function Nr(e, r) {
  return n`
    <div class="agent-chat__recents">
      <div class="agent-chat__recents-title">${E(`chat.welcome.recentSessions`)}</div>
      ${e.map((e) => {
        let i = ne(e);
        return n`
          <button type="button" class="agent-chat__recent" @click=${() => r?.(e.key)}>
            <span class="agent-chat__recent-name">${T(e.key, e)}</span>
            ${i ? n`<span class="agent-chat__recent-sub">${i}</span>` : a}
            <span class="agent-chat__recent-time">
              ${t(e.updatedAt, { fallback: `` })}
            </span>
          </button>
        `;
      })}
    </div>
  `;
}
function Pr(e) {
  return n`
    <div class="agent-chat__suggestions">
      ${Lr.map((t) => {
        let r = E(t);
        return n`
          <button
            type="button"
            class="agent-chat__suggestion"
            @click=${() => {
              (e.onDraftChange(r), e.onSend());
            }}
          >
            ${r}
          </button>
        `;
      })}
    </div>
  `;
}
function Fr(e) {
  let t = e.assistantName || `Assistant`,
    r = kr(e),
    i = r ? null : ce(e.assistantAvatar);
  return n`
    ${
      r
        ? n`<img class="agent-chat__welcome-avatar" src=${r} alt=${t} />`
        : i
          ? n`<div class="agent-chat__avatar agent-chat__avatar--text" aria-label=${t}>
            ${i}
          </div>`
          : Mr()
    }
    <h2>${t}</h2>
    <p class="agent-chat__hint">${e.hint}</p>
  `;
}
function Ir(e) {
  let t = jr(e);
  return n`
    <div class="agent-chat__welcome" style="--agent-color: var(--accent)">
      ${Fr({ assistantName: e.assistantName, assistantAvatar: e.assistantAvatar, assistantAvatarUrl: e.assistantAvatarUrl, hint: e.hint ?? n`${E(`chat.welcome.hintBeforeShortcut`)} <kbd>/</kbd> ${E(`chat.welcome.hintAfterShortcut`)}` })}
      ${e.composer ?? a}
      ${t.length > 0 ? Nr(t, e.onOpenSession) : Pr(e)}
    </div>
  `;
}
var Lr,
  Rr,
  zr = e(() => {
    (s(),
      r(),
      Te(),
      Se(),
      me(),
      ue(),
      xe(),
      fe(),
      y(),
      (Lr = [
        `chat.welcome.suggestions.whatCanYouDo`,
        `chat.welcome.suggestions.summarizeRecentSessions`,
        `chat.welcome.suggestions.configureChannel`,
        `chat.welcome.suggestions.checkSystemHealth`,
      ]),
      (Rr = 5));
  });
function Br(e, t) {
  (e.preventDefault(), e.stopPropagation());
  let n = e.currentTarget.closest(`.chat-controls__inline-select-menu--combined`);
  n instanceof HTMLElement &&
    (n.querySelectorAll(`[data-chat-model-provider]`).forEach((e) => {
      e.setAttribute(`aria-pressed`, e.dataset.chatModelProvider === t ? `true` : `false`);
    }),
    n.querySelectorAll(`[data-chat-model-provider-group]`).forEach((e) => {
      e.hidden = e.dataset.chatModelProviderGroup !== t;
    }));
}
var Vr = e(() => {});
function Hr(e) {
  let t = C(e);
  return Zr[t] ?? t;
}
function Ur(e) {
  return Fe(C(e), { className: `chat-controls__provider-icon` });
}
function Wr(e, t, n = ``, r = ``) {
  let i = (e || n).trim(),
    a = i.toLowerCase(),
    o = t.find((e) => {
      let t = e.id.trim().toLowerCase();
      return `${C(e.provider)}/${t}` === a;
    });
  if (o) return Hr(o.provider);
  let s = t.filter((e) => e.id.trim().toLowerCase() === a),
    c = C(r),
    l = s.some((e) => C(e.provider) === c);
  if (c && (s.length === 0 || l)) return Hr(c);
  if (s.length === 1) return Hr(s[0]?.provider ?? ``);
  let u = i.indexOf(`/`);
  return u > 0 ? Hr(i.slice(0, u)) : `other`;
}
function Gr(e, t, n) {
  let r = e.trim().toLowerCase(),
    i = r.indexOf(`/`),
    a = i > 0 ? `${C(r.slice(0, i))}/${r.slice(i + 1)}` : r;
  if (!a) return t;
  let o = n.filter((e) => `${C(e.provider)}/${e.id.trim().toLowerCase()}` === a),
    s = o.find((e) => e.provider.trim().toLowerCase() === `openai`) ?? o[0];
  return (s && C(s.provider) === `openai` && s.name.trim()) || t;
}
function Kr(e) {
  let {
      currentOverride: t,
      defaultSelectable: n,
      defaultModel: r,
      defaultLabel: i,
      options: a,
    } = Rn({
      agentDefaultModel: e.agentDefaultModel,
      chatModelCatalog: e.modelCatalog,
      modelOverrides: e.modelOverrides ?? {},
      sessionKey: e.sessionKey,
      sessionsResult: e.sessionsResult,
    }),
    o = Ae({ catalog: e.modelCatalog, sessionKey: e.sessionKey, sessionsResult: e.sessionsResult }),
    s = Un({
      activeRunId: e.activeRunId,
      catalog: e.modelCatalog,
      connected: e.connected,
      currentModelOverride: t,
      gatewayAvailable: e.gatewayAvailable,
      loading: e.loading,
      sending: e.sending,
      sessionKey: e.sessionKey,
      sessionsResult: e.sessionsResult,
      stream: e.stream,
    }),
    c = e.modelSwitching ? { ...s, disabled: !0 } : s,
    l = e.sessionsResult?.sessions.find((t) => p(t.key, e.sessionKey))?.modelProvider ?? ``,
    u = e.sessionsResult?.defaults?.modelProvider ?? ``,
    d = Gr(r, i, e.modelCatalog),
    f = r && d !== i ? `Default (${d})` : i,
    m = r.trim().toLowerCase(),
    h = a.map((r) => {
      let i = n && r.value.trim().toLowerCase() === m;
      return {
        commitValue: i ? `` : r.value,
        isDefault: i,
        value: r.value,
        label: Gr(r.value, r.label, e.modelCatalog),
        provider: Wr(r.value, e.modelCatalog, ``, i ? u : r.value === t ? l : ``),
      };
    }),
    g =
      e.modelSelectionRuntimeId?.trim().toLowerCase() === `codex`
        ? E(`chat.selectors.nativeCodexModel`)
        : E(`chat.selectors.lockedSessionModel`),
    _ =
      e.modelSelectionLocked === !0
        ? g
        : (h.find((e) => e.value === t)?.label ?? Gr(t, t || f, e.modelCatalog)),
    ee =
      o.currentOverride === ``
        ? o.defaultLabel
        : (o.options.find((e) => e.value === o.currentOverride)?.label ?? o.currentOverride),
    v = e.loading || e.sending || !!e.activeRunId || e.stream !== null,
    te =
      !e.connected ||
      v ||
      e.modelSwitching ||
      (e.modelsLoading && a.length === 0) ||
      !e.gatewayAvailable,
    y =
      !e.connected ||
      v ||
      e.modelSwitching ||
      !e.gatewayAvailable ||
      (o.options.length === 0 && o.currentOverride === ``);
  return Xr({
    disabled: te,
    fastMode: c,
    modelSelectionLocked: e.modelSelectionLocked === !0,
    modelOnly: e.mode === `model`,
    modelOptions: h,
    onRequestUpdate: e.onRequestUpdate,
    selectedModelValue: t,
    selectedThinkingValue: o.currentOverride,
    sessionKey: e.sessionKey,
    thinkingDefaultValue: o.defaultValue,
    thinkingDisabled: y,
    thinkingOptions: [{ value: ``, label: o.defaultLabel }, ...o.options],
    triggerModelLabel: _,
    triggerThinkingLabel: ee,
    onFastModeSelect: async (t, n) => e.onFastModeSelect?.(t, n),
    onModelSelect: async (t, n) => e.onModelSelect?.(t, n),
    onThinkingSelect: async (t, n) => e.onThinkingSelect?.(t, n),
  });
}
function qr(e) {
  return /^Default \((.+)\)$/u.exec(e)?.[1] ?? e;
}
function Jr(e) {
  let t = e.label,
    n = [Re(e.provider), Le(e.provider)].toSorted((e, t) => t.length - e.length);
  for (let e of n)
    if (t.toLowerCase().startsWith(`${e.toLowerCase()} `)) return t.slice(e.length + 1);
  return t;
}
function Yr(e) {
  return e.replace(/^Inherited:\s*/u, ``);
}
function Xr(e) {
  let {
      disabled: t,
      fastMode: r,
      modelSelectionLocked: i,
      modelOnly: s,
      modelOptions: c,
      selectedModelValue: l,
      selectedThinkingValue: u,
      sessionKey: d,
      thinkingDefaultValue: f,
      thinkingDisabled: p,
      thinkingOptions: m,
      triggerModelLabel: h,
      triggerThinkingLabel: g,
      onFastModeSelect: _,
      onModelSelect: ee,
      onRequestUpdate: v,
      onThinkingSelect: te,
    } = e,
    y = qr(h),
    ne = Yr(g),
    re = s ? y : `${y} · ${ne}`,
    ie = re,
    b = m.filter((e) => e.value !== ``),
    ae = b.findIndex((e) => e.value === f),
    x = u !== ``,
    oe = b.findIndex((e) => e.value === u),
    S = Math.max(x ? oe : ae, 0),
    se = !x && ae < 0,
    ce = (e) => (b.length > 1 ? (e / (b.length - 1)) * 100 : 0),
    le = Pe(f),
    ue = m.find((e) => e.value === u),
    C = x ? Yr(ue?.label ?? Pe(u)) : le,
    de = x ? C : `Default (${le})`,
    fe = (e) => {
      i || (ee(e, d).finally(() => v?.()), v?.());
    },
    pe = (e) => {
      (te(e, d).finally(() => v?.()), v?.());
    },
    me = (e) => {
      (_(e, d).finally(() => v?.()), v?.());
    },
    he = r.supported
      ? `Fast responses finish sooner and can use more of your usage limits.`
      : `Speed control is not supported for this model.`,
    ge = (e) => {
      let t = e.currentTarget,
        n = b[Number(t.value)];
      n &&
        (t.style.setProperty(`--reasoning-fill`, `${ce(Number(t.value))}%`),
        t.setAttribute(`aria-valuetext`, Yr(n.label)));
    },
    _e = (e) => {
      if (p) return;
      let t = e.currentTarget,
        n = b[Number(t.value)];
      !n || n.value === u || pe(n.value);
    },
    ve = (e) => {
      let t = e.currentTarget;
      !se || Number(t.value) !== S || _e(e);
    },
    ye = (e) => {
      !se || ![`Home`, `ArrowLeft`, `ArrowDown`, `PageDown`].includes(e.key) || _e(e);
    },
    w = b.length > 0,
    T = b.length === 1 ? b[0] : void 0,
    be = u || f,
    xe = T?.value === be,
    Se = !s,
    D = new Map();
  for (let e of c) {
    let t = D.get(e.provider);
    t ? t.push(e) : D.set(e.provider, [e]);
  }
  let Ce = c.find((e) => e.isDefault),
    O = [...D],
    we = O.findIndex(([e]) => e === Ce?.provider);
  if (we > 0) {
    let [e] = O.splice(we, 1);
    e && O.unshift(e);
  }
  let Te =
      ((l === `` ? Ce : c.find((e) => e.value === l)) ?? c[0])?.provider ?? O[0]?.[0] ?? `other`,
    Ee = (e) => {
      let r = e.value === l || (e.isDefault && l === ``),
        o = Jr(e);
      return n`
      <div class="chat-controls__combined-model">
        <openclaw-tooltip .content=${e.label}>
          <button
            class="chat-controls__inline-select-option chat-controls__combined-model-option ${r ? `chat-controls__inline-select-option--selected` : ``}"
            data-chat-model-option=${e.value}
            data-chat-model-default=${e.isDefault ? `true` : a}
            role="option"
            aria-selected=${r ? `true` : `false`}
            type="button"
            ?disabled=${t || i}
            @click=${(n) => {
              if ((n.stopPropagation(), t || i || e.commitValue === l)) {
                n.preventDefault();
                return;
              }
              fe(e.commitValue);
            }}
          >
            <span class="chat-controls__model-option-copy">
              <span class="chat-controls__model-option-title">
                <span class="chat-controls__model-option-name">${o}</span>
                ${
                  e.isDefault
                    ? n`<span class="chat-controls__model-default-label"
                      >${E(`chat.modelControls.default`)}</span
                    >`
                    : ``
                }
              </span>
              <span class="chat-controls__model-option-provider">
                ${Le(e.provider)}
              </span>
            </span>
            ${
              r
                ? n`
                  <span class="chat-controls__inline-select-check" aria-hidden="true">
                    ${k.check}
                  </span>
                `
                : ``
            }
          </button>
        </openclaw-tooltip>
      </div>
    `;
    };
  return n`
    <details class="chat-controls__session chat-controls__inline-select chat-controls__model">
      <summary
        class="chat-controls__inline-select-trigger ${t ? `chat-controls__inline-select-trigger--disabled` : ``}"
        data-chat-model-select="true"
        data-chat-model-locked=${i ? `true` : `false`}
        data-chat-thinking-select=${s ? a : `true`}
        data-chat-select-value=${l}
        data-chat-thinking-value=${u}
        data-chat-thinking-disabled=${p ? `true` : `false`}
        aria-label=${s ? `${E(`chat.selectors.model`)}: ${re}` : `${E(`chat.selectors.model`)}, ${E(`chat.selectors.thinkingLevel`)}: ${re}`}
        aria-disabled=${t ? `true` : `false`}
        @click=${(e) => {
          t && e.preventDefault();
        }}
      >
        <span class="chat-controls__inline-select-label">${ie}</span>
        <span class="chat-controls__inline-select-icon" aria-hidden="true">
          ${k.chevronDown}
        </span>
      </summary>
      <div
        class="chat-controls__inline-select-menu chat-controls__inline-select-menu--combined"
        aria-label=${E(`chat.selectors.model`)}
      >
        ${
          i
            ? n`
              <div
                class="chat-controls__locked-model"
                aria-label=${E(`chat.selectors.modelLockedLabel`)}
              >
                <span class="chat-controls__inline-select-section-label">
                  ${E(`chat.selectors.modelSection`)}
                </span>
                <span class="chat-controls__locked-model-value">${y}</span>
                <span class="chat-controls__locked-model-badge">
                  ${E(`chat.selectors.modelLocked`)}
                </span>
              </div>
            `
            : n`
              <div class="chat-controls__model-browser">
                <div class="chat-controls__provider-list" aria-label=${E(`sessionsView.provider`)}>
                  <div class="chat-controls__inline-select-section-label">
                    ${E(`sessionsView.provider`)}
                  </div>
                  ${o(
                    O,
                    ([e]) => e,
                    ([e]) => n`
                        <button
                          class="chat-controls__provider-option"
                          data-chat-model-provider=${e}
                          type="button"
                          aria-pressed=${e === Te ? `true` : `false`}
                          @click=${(t) => Br(t, e)}
                        >
                          ${Ur(e)}
                          <span>${Le(e)}</span>
                        </button>
                      `,
                  )}
                </div>
                <div
                  class="chat-controls__provider-models"
                  role="listbox"
                  aria-label=${E(`chat.selectors.model`)}
                >
                  ${o(
                    O,
                    ([e]) => e,
                    ([e, t]) => n`
                      <div
                        class="chat-controls__provider-model-group"
                        data-chat-model-provider-group=${e}
                        aria-label=${`${Le(e)} models`}
                        ?hidden=${e !== Te}
                      >
                        ${o(
                          t,
                          (e) => e.value,
                          (e) => Ee(e),
                        )}
                      </div>
                    `,
                  )}
                </div>
              </div>
            `
        }
        ${
          Se
            ? n`
              <div class="chat-controls__reasoning-panel">
                ${
                  w
                    ? n`
                      <div class="chat-controls__reasoning-head">
                        <span class="chat-controls__inline-select-section-label"
                          >${E(`chat.modelControls.reasoning`)}</span
                        >
                        <span class="chat-controls__reasoning-state">
                          <span
                            class="chat-controls__reasoning-value ${x ? `` : `chat-controls__reasoning-value--inherit`}"
                          >
                            ${C}
                          </span>
                          ${
                            x
                              ? n`
                                <openclaw-tooltip
                                  .content=${`Reset to default (${le})`}
                                >
                                  <button
                                    class="chat-controls__reasoning-reset"
                                    data-chat-thinking-option=""
                                    type="button"
                                    aria-label=${`Use default reasoning (${le})`}
                                    ?disabled=${p}
                                    @click=${(e) => {
                                      if ((e.stopPropagation(), p)) {
                                        e.preventDefault();
                                        return;
                                      }
                                      pe(``);
                                    }}
                                  >
                                    ${k.x}
                                  </button>
                                </openclaw-tooltip>
                              `
                              : ``
                          }
                        </span>
                      </div>
                      ${
                        b.length > 1
                          ? n`
                            <div class="chat-controls__reasoning-slider">
                              <div class="chat-controls__reasoning-dots" aria-hidden="true">
                                ${b.map(
                                  (e, t) => n`<span
                                      class="chat-controls__reasoning-dot ${t === ae ? `chat-controls__reasoning-dot--default` : ``}"
                                      data-stop=${e.value}
                                    ></span>`,
                                )}
                              </div>
                              <input
                                class="chat-controls__reasoning-range ${x ? `` : `chat-controls__reasoning-range--inherit`} ${se ? `chat-controls__reasoning-range--unanchored` : ``}"
                                type="range"
                                min="0"
                                max=${b.length - 1}
                                step="1"
                                .value=${String(S)}
                                style=${`--reasoning-fill: ${ce(S)}%`}
                                data-chat-thinking-slider="true"
                                data-chat-thinking-values=${b.map((e) => e.value).join(`,`)}
                                aria-label=${E(`chat.selectors.thinkingLevel`)}
                                aria-valuetext=${de}
                                ?disabled=${p}
                                @input=${ge}
                                @change=${_e}
                                @click=${ve}
                                @keydown=${ye}
                              />
                            </div>
                          `
                          : T
                            ? n`
                              <button
                                class="chat-controls__reasoning-option ${xe ? `chat-controls__reasoning-option--selected` : ``}"
                                data-chat-thinking-option=${T.value}
                                type="button"
                                aria-pressed=${xe ? `true` : `false`}
                                ?disabled=${p}
                                @click=${(e) => {
                                  if ((e.stopPropagation(), p || xe)) {
                                    e.preventDefault();
                                    return;
                                  }
                                  pe(T.value);
                                }}
                              >
                                <span>${T.label}</span>
                                ${
                                  xe
                                    ? n`
                                      <span
                                        class="chat-controls__inline-select-check"
                                        aria-hidden="true"
                                      >
                                        ${k.check}
                                      </span>
                                    `
                                    : ``
                                }
                              </button>
                            `
                            : ``
                      }
                    `
                    : ``
                }
                <div class="chat-controls__speed-row">
                  <span class="chat-controls__inline-select-section-label"
                    >${E(`chat.modelControls.speed`)}</span
                  >
                  <openclaw-tooltip .content=${he}>
                    <button
                      class="chat-controls__speed-toggle ${r.active ? `chat-controls__speed-toggle--active` : ``}"
                      data-chat-speed-toggle=${r.nextValue}
                      type="button"
                      role="switch"
                      aria-checked=${r.active ? `true` : `false`}
                      aria-label=${`Fast responses: ${r.label}`}
                      ?disabled=${r.disabled}
                      @click=${(e) => {
                        if ((e.stopPropagation(), r.disabled)) {
                          e.preventDefault();
                          return;
                        }
                        me(r.nextValue);
                      }}
                    >
                      <span class="chat-controls__speed-toggle-icon" aria-hidden="true">
                        ${k.zap}
                      </span>
                      <span>${r.label}</span>
                    </button>
                  </openclaw-tooltip>
                </div>
              </div>
            `
            : ``
        }
      </div>
    </details>
  `;
}
var Zr,
  Qr = e(() => {
    (r(),
      i(),
      D(),
      O(),
      Ie(),
      Se(),
      te(),
      Gn(),
      je(),
      y(),
      Vr(),
      (Zr = {
        "google-gemini-cli": `google`,
        "opencode-go": `opencode`,
        "opencode-zen": `opencode`,
      }));
  });
export {
  bt as $,
  Wt as A,
  rn as B,
  vn as C,
  cn as D,
  sn as E,
  Cn as F,
  _n as G,
  K as H,
  Sn as I,
  Bt as J,
  gn as K,
  yn as L,
  ln as M,
  wn as N,
  xn as O,
  mn as P,
  W as Q,
  bn as R,
  jn as S,
  an as T,
  tn as U,
  on as V,
  hn as W,
  wt as X,
  Lt as Y,
  Vt as Z,
  Gn as _,
  Ar as a,
  L as at,
  Nn as b,
  mr as c,
  We as ct,
  br as d,
  ze as dt,
  yt as et,
  vr as f,
  qn as g,
  Zn as h,
  Ir as i,
  Dt as it,
  En as j,
  On as k,
  Or as l,
  M as lt,
  Yn as m,
  Kr as n,
  Ct as nt,
  dr as o,
  Ye as ot,
  yr as p,
  Rt as q,
  zr as r,
  I as rt,
  _r as s,
  Ue as st,
  Qr as t,
  xt as tt,
  nr as u,
  A as ut,
  zn as v,
  Tn as w,
  An as x,
  Bn as y,
  un as z,
};
//# sourceMappingURL=chat-model-controls-K1P_ec3p.js.map
