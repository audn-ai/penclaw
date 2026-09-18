import { J as fe, X as pe } from "./control-ui-core--EZfp09c.js";
import {
  Cn as m,
  En as h,
  Ji as g,
  Ki as ee,
  Qi as te,
  Tn as ne,
  Ua as re,
  Va as ie,
  Wi as ae,
  Xi as oe,
  _a as se,
  an as ce,
  ea as _,
  ga as le,
  gn as ue,
  in as de,
} from "./control-ui-core-BcbHa4vB.js";
import { It as t, Nt as n } from "./control-ui-core-CFS5NQSC.js";
import { $ as me, Q as b, X as he, x as ge } from "./control-ui-core-CQDTaMS5.js";
import { o as v, t as y } from "./control-ui-core-CwQmiouz.js";
import { at as f, ot as p } from "./control-ui-foundation-s2wA1PVE.js";
import {
  I as r,
  U as i,
  _ as a,
  at as o,
  et as s,
  h as c,
  n as l,
  nt as u,
  t as d,
} from "./lit-runtime-DkvDG939.js";
import { a as ve, n as ye } from "./markdown-ERFX4kV-.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
import { i as be, n as xe } from "./tool-display-DdrJibK-.js";
import { t as _e } from "./web-awesome-tabs-B3ooykzD.js";
function Se(e) {
  if (typeof e != `string`) return null;
  let t = e.trim();
  return t.startsWith(`agent:`) ? t.slice(6) || `agent` : null;
}
var Ce = e(() => {});
function we(e, t) {
  (z.get(e)?.(), z.set(e, t));
}
function Te(e) {
  z.delete(e);
}
function Ee(e) {
  let t = z.get(e);
  t && (z.delete(e), t());
}
function De(e) {
  let t = N.get(e);
  return (
    t ||
      ((t = {
        loading: !1,
        loaded: !1,
        error: null,
        workspace: null,
        activeSlug: null,
        hiddenMenuOpen: !1,
        pendingWidgetIds: new Set(),
        actionError: null,
        requestUpdate: null,
      }),
      N.set(e, t)),
    t
  );
}
function x(e) {
  e.requestUpdate?.();
}
function S(e, t = ``) {
  return typeof e == `string` ? e : t;
}
function C(e, t = 0) {
  return typeof e == `number` && Number.isFinite(e) ? e : t;
}
function Oe(e) {
  let t = p(e) ? e : {},
    n = Math.min(12, Math.max(1, Math.trunc(C(t.w, 4)))),
    r = Math.max(1, Math.trunc(C(t.h, 2)));
  return {
    x: Math.min(12 - n, Math.max(0, Math.trunc(C(t.x, 0)))),
    y: Math.max(0, Math.trunc(C(t.y, 0))),
    w: n,
    h: r,
  };
}
function ke(e) {
  if (!p(e)) return null;
  let t = e.source;
  return t !== `rpc` && t !== `file` && t !== `static`
    ? null
    : {
        source: t,
        ...(typeof e.method == `string` ? { method: e.method } : {}),
        ...(typeof e.path == `string` ? { path: e.path } : {}),
        ...(typeof e.pointer == `string` ? { pointer: e.pointer } : {}),
        ...(p(e.params) ? { params: e.params } : {}),
        ...(`value` in e ? { value: e.value } : {}),
      };
}
function Ae(e) {
  if (!p(e)) return;
  let t = {};
  for (let [n, r] of Object.entries(e)) {
    let e = ke(r);
    e && (t[n] = e);
  }
  return Object.keys(t).length ? t : void 0;
}
function je(e) {
  if (!p(e)) return null;
  let t = S(e.id).trim(),
    n = S(e.kind).trim();
  return !t || !n
    ? null
    : {
        id: t,
        kind: n,
        title: S(e.title),
        grid: Oe(e.grid),
        collapsed: e.collapsed === !0,
        ...(typeof e.createdBy == `string` ? { createdBy: e.createdBy } : {}),
        ...(Ae(e.bindings) ? { bindings: Ae(e.bindings) } : {}),
        ...(p(e.props) ? { props: e.props } : {}),
      };
}
function Me(e) {
  if (!p(e)) return null;
  let t = S(e.slug).trim();
  if (!t) return null;
  let n = Array.isArray(e.widgets)
    ? e.widgets
        .filter((e) => !(p(e) && e.hidden === !0))
        .map(je)
        .filter((e) => e !== null)
    : [];
  return {
    slug: t,
    title: S(e.title, t),
    hidden: e.hidden === !0,
    widgets: n,
    ...(typeof e.icon == `string` ? { icon: e.icon } : {}),
    ...(typeof e.createdBy == `string` ? { createdBy: e.createdBy } : {}),
  };
}
function Ne(e) {
  if (!p(e)) return null;
  let t = e.status;
  return typeof t != `string` || !nt.has(t)
    ? null
    : {
        status: t,
        ...(typeof e.createdBy == `string` ? { createdBy: e.createdBy } : {}),
        ...(typeof e.approvedBy == `string` ? { approvedBy: e.approvedBy } : {}),
        ...(typeof e.approvedAt == `string` ? { approvedAt: e.approvedAt } : {}),
      };
}
function Pe(e) {
  if (!p(e)) return {};
  let t = {};
  for (let [n, r] of Object.entries(e)) {
    let e = Ne(r);
    e && (t[n] = e);
  }
  return t;
}
function Fe(e) {
  let t = p(e) ? e : {},
    n = Array.isArray(t.tabs) ? t.tabs.map(Me).filter((e) => e !== null) : [],
    r = p(t.prefs) ? t.prefs : {},
    i = Array.isArray(r.tabOrder) ? r.tabOrder.filter((e) => typeof e == `string`) : [];
  return {
    schemaVersion: C(t.schemaVersion, 1),
    workspaceVersion: C(t.workspaceVersion, 0),
    tabs: n,
    prefs: { tabOrder: i },
    widgetsRegistry: Pe(t.widgetsRegistry),
  };
}
function w(e) {
  return (e.startsWith(`custom:`) && e.slice(7)) || null;
}
function T(e, t) {
  let n = w(t);
  return n ? (e.widgetsRegistry[n]?.status ?? null) : null;
}
function E(e) {
  let t = new Map(e.tabs.map((e) => [e.slug, e])),
    n = [],
    r = new Set();
  for (let i of e.prefs.tabOrder) {
    let e = t.get(i);
    e && !r.has(i) && (n.push(e), r.add(i));
  }
  for (let t of e.tabs) r.has(t.slug) || (n.push(t), r.add(t.slug));
  return n;
}
function D(e) {
  return E(e).filter((e) => !e.hidden);
}
function Ie(e) {
  return E(e).filter((e) => e.hidden);
}
function Le(e, t) {
  if (t) return e.tabs.find((e) => e.slug === t);
}
function Re(e, t) {
  let n = Le(e, t);
  if (n) return n.slug;
  let r = D(e)[0];
  return r ? r.slug : (E(e)[0]?.slug ?? null);
}
function O(e) {
  return e instanceof Error && e.message.trim()
    ? e.message.trim()
    : typeof e == `string` && e.trim()
      ? e.trim()
      : `Unknown workspace error.`;
}
async function k(e, t, n) {
  if (t) {
    n?.silent || ((e.loading = !0), (e.error = null), x(e));
    try {
      let r = await t.request(`workspaces.get`, {}),
        i = Fe(p(r) && `doc` in r ? r.doc : r);
      ((e.workspace = i),
        (e.activeSlug = Re(i, n?.requestedSlug ?? e.activeSlug)),
        (e.error = null),
        (e.loaded = !0));
    } catch (t) {
      e.error = O(t);
    } finally {
      ((e.loading = !1), x(e));
    }
  }
}
function ze(e, t, n) {
  if (!n) {
    A(e);
    return;
  }
  if (F.get(e) === n) return;
  A(e);
  let r = n.addEventListener((e) => {
    if (e.event !== et) return;
    let r = C((p(e.payload) ? e.payload : void 0)?.workspaceVersion, NaN),
      i = t.workspace?.workspaceVersion ?? -1;
    (Number.isFinite(r) && r <= i) || k(t, n, { silent: !0 });
  });
  (P.set(e, r), F.set(e, n));
}
function A(e) {
  (P.get(e)?.(), P.delete(e), F.delete(e));
}
function Be(e, t, n, r = tt) {
  if (!t) {
    Ve(e);
    return;
  }
  if (L.get(e)) return;
  let i = setInterval(
    () => {
      (typeof document < `u` && document.visibilityState === `hidden`) || n();
    },
    Math.max(1e4, r),
  );
  (I.set(e, i), L.set(e, !0));
}
function Ve(e) {
  let t = I.get(e);
  (t !== void 0 && (clearInterval(t), I.delete(e)), L.delete(e));
}
function He(e) {
  (Ee(e), A(e), Ve(e));
}
function j(e, t, n, r) {
  return {
    ...e,
    tabs: e.tabs.map((e) =>
      e.slug === t ? { ...e, widgets: e.widgets.map((e) => (e.id === n ? r(e) : e)) } : e,
    ),
  };
}
function Ue(e, t, n) {
  return {
    ...e,
    tabs: e.tabs.map((e) =>
      e.slug === t ? { ...e, widgets: e.widgets.filter((e) => e.id !== n) } : e,
    ),
  };
}
async function M(e, t, n) {
  let r = (R.get(e) ?? Promise.resolve())
    .catch(() => void 0)
    .then(async () => {
      await We(e, t, n);
    });
  (R.set(e, r),
    await r.finally(() => {
      R.get(e) === r && R.delete(e);
    }));
}
async function We(e, t, n) {
  if (!t || !e.workspace) return;
  let r = e.workspace,
    i = n.optimistic(r);
  ((e.workspace = i), e.pendingWidgetIds.add(n.widgetId), (e.actionError = null), x(e));
  try {
    await t.request(n.method, n.rpcParams);
  } catch (t) {
    (e.workspace === i && (e.workspace = r), (e.actionError = O(t)));
  } finally {
    (e.pendingWidgetIds.delete(n.widgetId), x(e));
  }
}
function Ge(e, t, n) {
  return M(e, t, {
    widgetId: n.widgetId,
    method: `workspaces.widget.move`,
    rpcParams: { tab: n.slug, id: n.widgetId, grid: n.grid },
    optimistic: (e) => j(e, n.slug, n.widgetId, (e) => ({ ...e, grid: n.grid })),
  });
}
function Ke(e, t, n) {
  return M(e, t, {
    widgetId: n.widgetId,
    method: `workspaces.widget.update`,
    rpcParams: { tab: n.slug, id: n.widgetId, patch: { collapsed: n.collapsed } },
    optimistic: (e) => j(e, n.slug, n.widgetId, (e) => ({ ...e, collapsed: n.collapsed })),
  });
}
function qe(e, t, n) {
  return M(e, t, {
    widgetId: n.widgetId,
    method: `workspaces.widget.update`,
    rpcParams: { tab: n.slug, id: n.widgetId, patch: { title: n.title } },
    optimistic: (e) => j(e, n.slug, n.widgetId, (e) => ({ ...e, title: n.title })),
  });
}
function Je(e, t, n) {
  return M(e, t, {
    widgetId: n.widgetId,
    method: `workspaces.widget.update`,
    rpcParams: { tab: n.slug, id: n.widgetId, patch: { hidden: !0 } },
    optimistic: (e) => Ue(e, n.slug, n.widgetId),
  });
}
function Ye(e, t, n) {
  return M(e, t, {
    widgetId: n.widgetId,
    method: `workspaces.widget.remove`,
    rpcParams: { tab: n.slug, id: n.widgetId },
    optimistic: (e) => Ue(e, n.slug, n.widgetId),
  });
}
function Xe(e, t, n) {
  return M(e, t, {
    widgetId: n.widgetId,
    method: `workspaces.widget.move`,
    rpcParams: { tab: n.fromSlug, id: n.widgetId, toTab: n.toSlug },
    optimistic: (e) => {
      let t = e.tabs.find((e) => e.slug === n.fromSlug)?.widgets.find((e) => e.id === n.widgetId);
      return t
        ? {
            ...e,
            tabs: e.tabs.map((e) =>
              e.slug === n.fromSlug
                ? { ...e, widgets: e.widgets.filter((e) => e.id !== n.widgetId) }
                : e.slug === n.toSlug
                  ? { ...e, widgets: [...e.widgets, t] }
                  : e,
            ),
          }
        : e;
    },
  });
}
async function Ze(e, t, n) {
  if (t) {
    ((e.actionError = null), x(e));
    try {
      await t.request(`workspaces.widget.approve`, { name: n.name, decision: n.decision });
    } catch (t) {
      ((e.actionError = O(t)), x(e));
    }
  }
}
async function Qe(e, t) {
  try {
    if (t.source === `static`) return { value: t.value };
    if (!e) return { error: `Not connected.` };
    if (t.source === `rpc`) {
      if (!t.method) return { error: `Binding is missing an rpc method.` };
      let n =
        t.method === `usage.cost` && t.params?.mode === void 0
          ? { ...t.params, ...de(`local`) }
          : (t.params ?? {});
      return { value: $e(await e.request(t.method, n), t.pointer) };
    }
    let n = await e.request(`workspaces.data.read`, { binding: t });
    return { value: p(n) && `data` in n ? n.data : n };
  } catch (e) {
    return { error: O(e) };
  }
}
function $e(e, t) {
  if (!t) return e;
  let n = t
      .split(`/`)
      .slice(1)
      .map((e) => e.replace(/~1/g, `/`).replace(/~0/g, `~`)),
    r = e;
  for (let e of n)
    if (Array.isArray(r)) {
      let t = Number(e);
      r = Number.isInteger(t) ? r[t] : void 0;
    } else if (p(r)) r = r[e];
    else return;
  return r;
}
var et,
  N,
  P,
  F,
  I,
  L,
  R,
  tt,
  z,
  nt,
  B = e(() => {
    (f(),
      ce(),
      Ce(),
      (et = `plugin.workspaces.changed`),
      (N = new WeakMap()),
      (P = new WeakMap()),
      (F = new WeakMap()),
      (I = new WeakMap()),
      (L = new WeakMap()),
      (R = new WeakMap()),
      (tt = 45e3),
      (z = new WeakMap()),
      (nt = new Set([`pending`, `approved`, `rejected`])));
  });
function rt(e) {
  let t = V.get(e);
  return (t || ((t = { timestamps: [], inFlight: !1 }), V.set(e, t)), t);
}
function it(e) {
  return p(e) && e.v === ot && typeof e.type == `string` && ut.has(e.type);
}
function at(e) {
  let t = e.now ?? (() => Date.now()),
    n = e.getDataTimeoutMs ?? st,
    r = new Set(Object.keys(e.manifest.bindings)),
    i = new Set(e.manifest.capabilities),
    a = 0,
    o = !1,
    s = rt(e.manifest.name),
    c = new Set();
  function l(t, n, r) {
    e.post({
      v: 1,
      type: `workspace:error`,
      ...(r === void 0 ? {} : { requestId: r }),
      code: t,
      message: n,
    });
  }
  async function u(t, a) {
    if (!i.has(`data:read`)) {
      l(`capability_denied`, `widget lacks the data:read capability`, t);
      return;
    }
    if (!r.has(a)) {
      l(`binding_denied`, `binding not declared in manifest: ${a}`, t);
      return;
    }
    let s = e.assertBindingAllowed?.(a);
    if (s) {
      l(s, `binding not allowed: ${a}`, t);
      return;
    }
    let u = !1,
      d = setTimeout(() => {
        u || o || ((u = !0), c.delete(d), l(`timeout`, `binding resolution timed out`, t));
      }, n);
    c.add(d);
    try {
      let n = await e.resolveBinding(a);
      if (u || o) return;
      ((u = !0),
        clearTimeout(d),
        c.delete(d),
        e.post({ v: 1, type: `workspace:data`, requestId: t, bindingId: a, data: n }));
    } catch (e) {
      if (u || o) return;
      ((u = !0),
        clearTimeout(d),
        c.delete(d),
        l(`resolve_failed`, e instanceof Error ? e.message : String(e), t));
    }
  }
  function d(t) {
    e.post({ v: 1, type: `workspace:theme`, requestId: t, tokens: e.resolveTheme() });
  }
  async function f(n, r) {
    if (!i.has(`prompt:send`)) {
      l(`capability_denied`, `widget lacks the prompt:send capability`, n);
      return;
    }
    let a = t() - ct;
    if (
      ((s.timestamps = s.timestamps.filter((e) => e > a)), s.inFlight || s.timestamps.length >= lt)
    ) {
      l(`rate_limited`, `prompt send rate limit exceeded`, n);
      return;
    }
    s.inFlight = !0;
    try {
      let i = await e.confirmPrompt(r);
      if (o) return;
      if (!i) {
        l(`prompt_declined`, `operator declined the prompt`, n);
        return;
      }
      (s.timestamps.push(t()), await e.sendPrompt(r));
    } catch (e) {
      o || l(`resolve_failed`, e instanceof Error ? e.message : String(e), n);
    } finally {
      s.inFlight = !1;
    }
  }
  function p(e) {
    if (o) return !1;
    if (!it(e)) return ((a += 1), !1);
    switch (e.type) {
      case `workspace:ready`:
        return !0;
      case `workspace:getData`: {
        let t = typeof e.requestId == `string` ? e.requestId : null,
          n = typeof e.bindingId == `string` ? e.bindingId : null;
        return t === null || n === null ? ((a += 1), !1) : (u(t, n), !0);
      }
      case `workspace:getTheme`: {
        let t = typeof e.requestId == `string` ? e.requestId : null;
        return t === null ? ((a += 1), !1) : (d(t), !0);
      }
      case `workspace:sendPrompt`: {
        let t = typeof e.requestId == `string` ? e.requestId : null,
          n = typeof e.text == `string` ? e.text : null;
        return t === null || n === null || !n.trim() ? ((a += 1), !1) : (f(t, n), !0);
      }
      default:
        return ((a += 1), !1);
    }
  }
  async function m(t) {
    if (!(o || !i.has(`data:read`) || !r.has(t) || e.assertBindingAllowed?.(t)))
      try {
        let n = await e.resolveBinding(t);
        o || e.post({ v: 1, type: `workspace:push`, bindingId: t, data: n });
      } catch {}
  }
  return {
    handleMessage: p,
    push: m,
    get droppedCount() {
      return a;
    },
    dispose() {
      o = !0;
      for (let e of c) clearTimeout(e);
      (c.clear(), (s.inFlight = !1));
    },
  };
}
var ot,
  st,
  ct,
  lt,
  V,
  ut,
  dt = e(() => {
    (f(),
      (ot = 1),
      (st = 1e4),
      (ct = 6e4),
      (lt = 10),
      (V = new Map()),
      (ut = new Set([
        `workspace:ready`,
        `workspace:getData`,
        `workspace:getTheme`,
        `workspace:sendPrompt`,
      ])));
  });
function ft(e, t, n, r) {
  return `${e.replace(/\/+$/, ``)}/plugins/workspaces/widgets/${encodeURIComponent(t)}/${encodeURIComponent(n)}/${r
    .split(`/`)
    .map((e) => encodeURIComponent(e))
    .join(`/`)}`;
}
function pt() {
  let e = {};
  if (typeof document > `u` || typeof getComputedStyle != `function`) return e;
  let t = getComputedStyle(document.documentElement);
  for (let n of bt) {
    let r = t.getPropertyValue(n).trim();
    r && (e[n] = r);
  }
  return e;
}
function mt(e, t) {
  return e.bindings?.[t] ?? null;
}
function ht(e) {
  if (typeof e != `object` || !e || Array.isArray(e)) return null;
  let t = e,
    n = t.id;
  return typeof n != `string` || n === `__proto__` || !/^[A-Za-z0-9._-]{1,64}$/.test(n)
    ? null
    : t.source === `static` && Object.hasOwn(t, `value`)
      ? { id: n, binding: { source: `static`, value: t.value } }
      : null;
}
function gt(e, t) {
  return e.source === `static` && t.source === `static`;
}
async function _t(e, t) {
  if (!e) return null;
  try {
    let n = await e.request(`workspaces.widget.frame`, { name: t });
    if (typeof n != `object` || !n) return null;
    let r = n,
      i = r.frameToken,
      a = r.frameExpiresAt,
      o = r.manifest;
    if (
      typeof i != `string` ||
      typeof a != `number` ||
      !Number.isFinite(a) ||
      a <= Date.now() ||
      typeof o != `object` ||
      !o
    )
      return null;
    let s = o,
      c = Array.isArray(s.bindings) ? s.bindings : [],
      l = Object.create(null);
    for (let e of c) {
      let t = ht(e);
      if (!t || Object.hasOwn(l, t.id)) return null;
      l[t.id] = t.binding;
    }
    let u = (Array.isArray(s.capabilities) ? s.capabilities : []).filter(
        (e) => e === `data:read` || e === `prompt:send`,
      ),
      d = typeof s.entrypoint == `string` ? s.entrypoint : ``;
    return d
      ? { name: t, frameToken: i, frameExpiresAt: a, entrypoint: d, bindings: l, capabilities: u }
      : null;
  } catch {
    return null;
  }
}
function vt(e) {
  let { iframe: t, widget: n, manifest: r, context: i, bridgeToken: a } = e,
    o = null,
    s = null,
    c = !1,
    l = (e) =>
      at({
        manifest: r,
        post: (t) => e.postMessage(t, []),
        assertBindingAllowed: (e) => {
          let t = mt(n, e),
            i = r.bindings[e];
          return !t || !i || !gt(t, i) ? `binding_denied` : null;
        },
        resolveBinding: async (e) => {
          let t = mt(n, e);
          if (!t) throw Error(`binding not configured: ${e}`);
          if (t.source !== `static`) throw Error(`binding not allowed: ${e}`);
          return t.value;
        },
        resolveTheme: i.readThemeTokens ?? pt,
        confirmPrompt: async (e) =>
          i.confirmPrompt ? await i.confirmPrompt(e) : typeof window < `u` ? window.confirm(e) : !1,
        sendPrompt: async (e) => {
          if (!i.client) throw Error(`Not connected.`);
          await i.client.request(`chat.send`, {
            sessionKey: i.sessionKey,
            message: e,
            deliver: !1,
            idempotencyKey: le(),
          });
        },
      }),
    u = (e) => {
      c ||
        o ||
        e.source !== t.contentWindow ||
        e.ports.length !== 1 ||
        typeof e.data != `object` ||
        e.data === null ||
        e.data.v !== 1 ||
        e.data.type !== `workspace:bridge:init` ||
        e.data.token !== a ||
        (window.removeEventListener(`message`, u),
        (s = e.ports[0] ?? null),
        s &&
          ((o = l(s)), s.addEventListener(`message`, (e) => o?.handleMessage(e.data)), s.start()));
    };
  return (
    window.addEventListener(`message`, u),
    () => {
      c ||
        ((c = !0),
        window.removeEventListener(`message`, u),
        s?.close(),
        o?.dispose(),
        (s = null),
        (o = null));
    }
  );
}
function yt(e) {
  return o`<div class="workspace-widget__custom" data-test-id="workspace-custom-widget">
    ${St(e)}
  </div>`;
}
var bt,
  xt,
  St,
  Ct = e(() => {
    (s(),
      l(),
      d(),
      se(),
      dt(),
      (bt = [
        `--bg`,
        `--card`,
        `--card-foreground`,
        `--text`,
        `--muted`,
        `--border`,
        `--accent`,
        `--accent-foreground`,
        `--radius`,
        `--radius-sm`,
        `--font-sans`,
        `--font-mono`,
      ]),
      (xt = class extends r {
        constructor(...e) {
          (super(...e), (this.iframe = null), (this.detach = null), (this.key = ``));
        }
        render(e) {
          let t = e.widget.kind.slice(7),
            n = ft(e.context.basePath, e.manifest.frameToken, t, e.manifest.entrypoint),
            r = `${e.widget.id}::${n}`;
          if (this.iframe && this.key === r) return this.iframe;
          this.detach?.();
          try {
            let t = document.createElement(`iframe`);
            (t.setAttribute(`sandbox`, `allow-scripts`),
              t.setAttribute(`referrerpolicy`, `no-referrer`),
              t.setAttribute(`loading`, `lazy`),
              (t.className = `workspace-widget__frame`),
              (t.title = e.widget.title));
            let i = e.manifest.frameToken;
            return (
              (t.src = n),
              t.setAttribute(`data-test-id`, `workspace-custom-widget-frame`),
              (this.detach = vt({
                iframe: t,
                widget: e.widget,
                manifest: e.manifest,
                context: e.context,
                bridgeToken: i,
              })),
              (this.iframe = t),
              (this.key = r),
              t
            );
          } catch (e) {
            ((this.detach = null), (this.iframe = null), (this.key = ``));
            let t = document.createElement(`div`);
            return (
              (t.className = `workspace-widget__error`),
              t.setAttribute(`role`, `alert`),
              t.setAttribute(`data-test-id`, `workspace-custom-widget-error`),
              (t.textContent = e instanceof Error ? e.message : String(e)),
              t
            );
          }
        }
        disconnected() {
          (this.detach?.(), (this.detach = null), (this.iframe = null), (this.key = ``));
        }
      }),
      (St = i(xt)));
  });
function wt(e) {
  return Math.max(1, (e.width - 132) / 12);
}
function H(e, t, n) {
  return Math.min(n, Math.max(t, e));
}
function Tt(e, t) {
  return t <= 0 ? 0 : Math.round(e / (t + 12));
}
function U(e) {
  let t = H(e.w, 1, 12),
    n = H(e.h, 1, Ft);
  return { x: H(e.x, 0, 12 - t), y: H(e.y, 0, G), w: t, h: n };
}
function Et(e, t) {
  return e.x < t.x + t.w && t.x < e.x + e.w && e.y < t.y + t.h && t.y < e.y + e.h;
}
function Dt(e, t) {
  return e.filter((e) => e.id !== t).map((e) => e.grid);
}
function W(e, t, n) {
  return Dt(t, n).some((t) => Et(e, t));
}
function Ot(e) {
  return {
    widgetId: e.widget.id,
    mode: e.mode,
    originRect: { ...e.widget.grid },
    originClientX: e.clientX,
    originClientY: e.clientY,
    ghostRect: { ...e.widget.grid },
    columnWidth: wt(e.metrics),
  };
}
function kt(e, t, n) {
  let r = Tt(t - e.originClientX, e.columnWidth),
    i = Tt(n - e.originClientY, 56),
    a = U(
      e.mode === `move`
        ? { x: e.originRect.x + r, y: e.originRect.y + i, w: e.originRect.w, h: e.originRect.h }
        : { x: e.originRect.x, y: e.originRect.y, w: e.originRect.w + r, h: e.originRect.h + i },
    );
  return ((e.ghostRect = a), a);
}
function At(e) {
  let t = U(e.requested);
  return W(t, e.widgets, e.widgetId) ? jt(t, e.widgets, e.widgetId) : t;
}
function jt(e, t, n) {
  let r = H(e.w, 1, 12),
    i = Math.max(1, e.h),
    a = 12 - r,
    o = Dt(t, n).reduce((e, t) => Math.max(e, t.y + t.h), 0),
    s = Math.min(Math.max(e.y, o) + i, G - i + 1),
    c = null;
  for (let o = 0; o <= s && !(c && o >= e.y && o - e.y >= c.distance); o += 1)
    for (let s = 0; s <= a; s += 1) {
      let a = { x: s, y: o, w: r, h: i };
      if (W(a, t, n)) continue;
      let l = Math.abs(s - e.x) + Math.abs(o - e.y);
      (!c || l < c.distance) && (c = { rect: a, distance: l });
    }
  return c?.rect ?? null;
}
function Mt(e) {
  return [`grid-column: ${e.x + 1} / span ${e.w}`, `grid-row: ${e.y + 1} / span ${e.h}`].join(`; `);
}
function Nt(e) {
  return e.reduce((e, t) => Math.max(e, t.grid.y + t.grid.h), 0);
}
function Pt(e, t, n) {
  let r = It;
  if (t === `move`) {
    let t = n === `left` ? -1 : n === `right` ? r : 0,
      i = n === `up` ? -1 : n === `down` ? r : 0;
    return U({ ...e, x: e.x + t, y: e.y + i });
  }
  let i = n === `left` ? -1 : n === `right` ? r : 0,
    a = n === `up` ? -1 : n === `down` ? r : 0;
  return U({ ...e, w: e.w + i, h: e.h + a });
}
var G,
  Ft,
  It,
  Lt = e(() => {
    (Ce(), (G = 499), (Ft = 20), (It = 1));
  });
function K(e) {
  return e.props ?? {};
}
function q(e) {
  return typeof e == `object` && !!e && !Array.isArray(e);
}
function J(e) {
  if (typeof e == `number`) return Number.isFinite(e) ? e : void 0;
  if (typeof e == `string` && e.trim()) {
    let t = Number(e);
    return Number.isFinite(t) ? t : void 0;
  }
}
var Y = e(() => {});
function Rt(e) {
  let t = e.jobName ?? e.jobId ?? e.action;
  return typeof t == `string` && t.trim() ? t : `run`;
}
function zt(e, t) {
  let n = q(t) && Array.isArray(t.entries) ? t.entries : [],
    r = J(K(e).limit),
    i = r && r > 0 ? Math.trunc(r) : Ht,
    a = n.filter(q);
  return {
    entries: a
      .map((e) => ({
        ts: J(e.ts) ?? null,
        title: Rt(e),
        detail:
          typeof e.summary == `string` && e.summary.trim()
            ? ae(e.summary, 120)
            : typeof e.error == `string` && e.error.trim()
              ? ae(e.error, 120)
              : null,
        status: typeof e.status == `string` ? e.status : null,
      }))
      .slice(0, i),
    total: a.length,
  };
}
function Bt(e) {
  return e === `ok`
    ? `workspace-badge--ok`
    : e === `error`
      ? `workspace-badge--error`
      : `workspace-badge--muted`;
}
function Vt(e, t) {
  let n = zt(e, t);
  return n.entries.length === 0
    ? o`<div class="workspace-widget__placeholder">
      ${v(`workspaces.widget.activity.empty`)}
    </div>`
    : o`
    <ul class="workspace-feed" data-test-id="workspace-activity">
      ${n.entries.map(
        (e) => o`
          <li class="workspace-feed__row">
            <div class="workspace-feed__head">
              <span class="workspace-feed__title">${e.title}</span>
              ${
                e.status
                  ? o`<span class="workspace-badge ${Bt(e.status)}"
                    >${e.status}</span
                  >`
                  : u
              }
              ${e.ts === null ? u : o`<span class="workspace-feed__time">${g(e.ts)}</span>`}
            </div>
            ${e.detail ? o`<div class="workspace-feed__detail">${e.detail}</div>` : u}
          </li>
        `,
      )}
    </ul>
  `;
}
var Ht,
  Ut = e(() => {
    (s(), y(), _(), Y(), (Ht = 20));
  });
function Wt(e) {
  if (!e) return null;
  let t = e.lastRunStatus ?? e.lastStatus;
  return typeof t == `string` ? t : null;
}
function Gt(e, t) {
  let n = q(t) && Array.isArray(t.jobs) ? t.jobs : [],
    r = J(K(e).limit),
    i = r && r > 0 ? Math.trunc(r) : Jt,
    a = n.filter(q);
  return {
    jobs: a
      .map((e) => {
        let t = q(e.state) ? e.state : void 0;
        return {
          id: typeof e.id == `string` ? e.id : ``,
          name: typeof e.name == `string` && e.name.trim() ? e.name : e.id || ``,
          enabled: e.enabled !== !1,
          nextRunAtMs: t ? (J(t.nextRunAtMs) ?? null) : null,
          lastStatus: Wt(t),
        };
      })
      .filter((e) => e.id)
      .slice(0, i),
    total: a.length,
  };
}
function Kt(e) {
  return e === `ok`
    ? `workspace-badge--ok`
    : e === `error`
      ? `workspace-badge--error`
      : `workspace-badge--muted`;
}
function qt(e, t) {
  let n = Gt(e, t);
  return n.jobs.length === 0
    ? o`<div class="workspace-widget__placeholder">
      ${v(`workspaces.widget.cron.empty`)}
    </div>`
    : o`
    <ul class="workspace-list workspace-cron" data-test-id="workspace-cron">
      ${n.jobs.map(
        (e) => o`
          <li class="workspace-list__row ${e.enabled ? `` : `workspace-list__row--disabled`}">
            <span class="workspace-list__label">${e.name}</span>
            <span class="workspace-list__meta">
              ${e.nextRunAtMs === null ? v(`workspaces.widget.cron.noNext`) : v(`workspaces.widget.cron.next`, { time: g(e.nextRunAtMs) })}
            </span>
            ${
              e.lastStatus
                ? o`<span class="workspace-badge ${Kt(e.lastStatus)}"
                  >${e.lastStatus}</span
                >`
                : u
            }
          </li>
        `,
      )}
    </ul>
  `;
}
var Jt,
  Yt = e(() => {
    (s(), y(), _(), Y(), (Jt = 8));
  });
function Xt(e, t, n) {
  if (typeof e != `string` || !e.trim()) return { status: `missing` };
  let r = e.trim(),
    i = n ?? (typeof window < `u` ? window.location.origin : void 0),
    a;
  try {
    a = i ? new URL(r, i) : new URL(r);
  } catch {
    return { status: `ok`, url: r, external: !1 };
  }
  if (a.protocol !== `http:` && a.protocol !== `https:`)
    return { status: `blocked`, reason: `scheme`, url: r };
  let o = i ? a.origin !== new URL(i).origin : !0;
  return o && !t.allowExternalEmbedUrls
    ? { status: `blocked`, reason: `external`, url: r }
    : { status: `ok`, url: r, external: o };
}
function Zt(e, t, n) {
  let r = Xt(K(e).url, { allowExternalEmbedUrls: n.embed.allowExternalEmbedUrls });
  return r.status === `missing`
    ? o`<div class="workspace-widget__placeholder">
      ${v(`workspaces.widget.embed.missing`)}
    </div>`
    : r.status === `blocked`
      ? o`<div class="workspace-widget__placeholder" data-test-id="workspace-embed-blocked">
      ${r.reason === `external` ? v(`workspaces.widget.embed.blockedExternal`) : v(`workspaces.widget.embed.blockedScheme`)}
    </div>`
      : o`<iframe
    class="workspace-embed__frame"
    data-test-id="workspace-embed-frame"
    src=${r.url}
    title=${e.title}
    sandbox=${be(n.embed.embedSandboxMode, Qt)}
    referrerpolicy="no-referrer"
    loading="lazy"
  ></iframe>`;
}
var Qt,
  $t = e(() => {
    (s(), y(), xe(), Y(), (Qt = `scripts`));
  });
function en(e) {
  let t = e.instanceId ?? e.host ?? e.ip ?? e.deviceFamily;
  return typeof t == `string` && t.trim() ? t : ``;
}
function tn(e) {
  let t = [e.mode, e.platform, e.version].filter(
    (e) => typeof e == `string` && e.trim().length > 0,
  );
  return t.length > 0 ? t.join(` · `) : null;
}
function nn(e, t) {
  let n = Array.isArray(t)
      ? t
      : q(t) && Array.isArray(t.presence)
        ? t.presence
        : q(t) && Array.isArray(t.nodes)
          ? t.nodes
          : [],
    r = J(K(e).limit),
    i = r && r > 0 ? Math.trunc(r) : an,
    a = n.filter(q);
  return {
    instances: a
      .map((e) => {
        let t = J(e.lastInputSeconds);
        return {
          id: en(e),
          detail: tn(e),
          healthy: t === void 0 || t <= on,
          lastInputMs: t === void 0 ? null : t * 1e3,
        };
      })
      .filter((e) => e.id)
      .slice(0, i),
    total: a.length,
  };
}
function rn(e, t) {
  let n = nn(e, t);
  return n.instances.length === 0
    ? o`<div class="workspace-widget__placeholder">
      ${v(`workspaces.widget.instances.empty`)}
    </div>`
    : o`
    <ul class="workspace-list workspace-instances" data-test-id="workspace-instances">
      ${n.instances.map(
        (e) => o`
          <li class="workspace-list__row">
            <span
              class="workspace-dot ${e.healthy ? `workspace-dot--ok` : `workspace-dot--warn`}"
              aria-hidden="true"
            ></span>
            <span class="workspace-list__label">${e.id}</span>
            ${e.detail ? o`<span class="workspace-list__meta">${e.detail}</span>` : u}
            ${
              e.lastInputMs === null
                ? u
                : o`<span class="workspace-list__meta"
                  >${v(`workspaces.widget.instances.idle`, { duration: oe(e.lastInputMs) })}</span
                >`
            }
          </li>
        `,
      )}
    </ul>
  `;
}
var an,
  on,
  sn = e(() => {
    (s(), y(), _(), Y(), (an = 8), (on = 120));
  });
function cn(e, t) {
  let n = K(e);
  return typeof t == `string`
    ? t
    : typeof n.markdown == `string`
      ? n.markdown
      : typeof n.text == `string`
        ? n.text
        : ``;
}
function ln(e, t) {
  let n = cn(e, t);
  return n.trim()
    ? o`<div class="workspace-markdown markdown-body">
    ${a(ve(n))}
  </div>`
    : o`<div class="workspace-widget__placeholder">
      ${v(`workspaces.widget.markdownEmpty`)}
    </div>`;
}
var un = e(() => {
  (s(), c(), ye(), y(), Y());
});
function dn(e, t) {
  let n = e.displayName ?? e.label ?? e.subject ?? e.channel;
  return typeof n == `string` && n.trim() ? n : t;
}
function fn(e, t) {
  let n = Array.isArray(t) ? t : q(t) && Array.isArray(t.sessions) ? t.sessions : [],
    r = J(K(e).limit),
    i = r && r > 0 ? Math.trunc(r) : mn,
    a = n.filter(q);
  return {
    rows: a
      .map((e) => {
        let t = typeof e.key == `string` ? e.key : ``;
        return {
          key: t,
          label: dn(e, t),
          active: h({
            hasActiveRun: typeof e.hasActiveRun == `boolean` ? e.hasActiveRun : void 0,
            status: typeof e.status == `string` ? e.status : void 0,
          }),
          updatedAt: J(e.updatedAt) ?? null,
        };
      })
      .filter((e) => e.key)
      .slice(0, i),
    total: a.length,
  };
}
function pn(e, t, n = ``) {
  let r = fn(e, t);
  if (r.rows.length === 0)
    return o`<div class="workspace-widget__placeholder">
      ${v(`workspaces.widget.sessions.empty`)}
    </div>`;
  let i = pe(`chat`, n);
  return o`
    <ul class="workspace-list workspace-sessions" data-test-id="workspace-sessions">
      ${r.rows.map(
        (e) => o`
          <li class="workspace-list__row">
            <a class="workspace-list__link" href=${`${i}${m(e.key)}`}>
              <span
                class="workspace-dot ${e.active ? `workspace-dot--live` : ``}"
                aria-hidden="true"
              ></span>
              <span class="workspace-list__label">${e.label}</span>
              ${e.updatedAt === null ? u : o`<span class="workspace-list__meta">${g(e.updatedAt)}</span>`}
            </a>
          </li>
        `,
      )}
    </ul>
  `;
}
var mn,
  hn = e(() => {
    (s(), fe(), y(), _(), ne(), ue(), Y(), (mn = 6));
  });
function gn(e, t) {
  if (!q(e)) return;
  let n = q(e.totals) ? e.totals : void 0;
  switch (t) {
    case `todayCost`:
      return n?.totalCost ?? e.totalCost;
    case `todayTokens`:
      return n?.totalTokens ?? e.totalTokens;
    default:
      return e[t];
  }
}
function _n(e, t) {
  if (e == null) return null;
  let n = J(e);
  return t === `usd` && n !== void 0
    ? new Intl.NumberFormat(void 0, { style: `currency`, currency: `USD` }).format(n)
    : t === `percent` && n !== void 0
      ? new Intl.NumberFormat(void 0, { style: `percent`, maximumFractionDigits: 1 }).format(n)
      : (t === `int` || t === `integer`) && n !== void 0
        ? new Intl.NumberFormat(void 0, { maximumFractionDigits: 0 }).format(n)
        : typeof e == `string`
          ? e
          : n === void 0
            ? JSON.stringify(e)
            : new Intl.NumberFormat(void 0).format(n);
}
function vn(e, t) {
  let n = K(e),
    r = typeof n.metric == `string` ? n.metric : null,
    i = r ? gn(t, r) : t,
    a = i === void 0 ? n.value : i,
    o = typeof n.label == `string` ? n.label : e.title,
    s = o && o !== e.title ? o : null;
  return { display: _n(a, n.format), label: s };
}
function yn(e, t) {
  let n = vn(e, t);
  return o`
    <div class="workspace-stat">
      <div class="workspace-stat__value">${n.display ?? v(`workspaces.widget.stat.empty`)}</div>
      ${n.label ? o`<div class="workspace-stat__label">${n.label}</div>` : u}
    </div>
  `;
}
var bn = e(() => {
  (s(), y(), Y());
});
function xn(e, t) {
  return (
    Array.isArray(t)
      ? t
      : q(t) && Array.isArray(t.rows)
        ? t.rows
        : Array.isArray(K(e).rows)
          ? K(e).rows
          : []
  ).filter(q);
}
function Sn(e, t) {
  let n = K(e).columns;
  if (Array.isArray(n)) {
    let e = n.filter((e) => typeof e == `string`);
    if (e.length > 0) return e;
  }
  let r = t[0];
  return r ? Object.keys(r) : [];
}
function Cn(e) {
  let t = K(e).limit;
  return typeof t == `number` && Number.isFinite(t) && t > 0 ? Math.min(Math.trunc(t), 100) : Dn;
}
function wn(e, t) {
  let n = xn(e, t),
    r = Cn(e),
    i = n.slice(0, r);
  return { columns: Sn(e, i), rows: i, shown: i.length, total: n.length };
}
function Tn(e) {
  return e == null
    ? ``
    : typeof e == `string`
      ? e
      : typeof e == `number` || typeof e == `boolean`
        ? String(e)
        : JSON.stringify(e);
}
function En(e, t) {
  let n = wn(e, t);
  if (n.total === 0 || n.columns.length === 0)
    return o`<div class="workspace-widget__placeholder">
      ${v(`workspaces.widget.table.empty`)}
    </div>`;
  let r = n.total - n.shown;
  return o`
    <div class="workspace-table">
      <table class="workspace-table__grid">
        <thead>
          <tr>
            ${n.columns.map((e) => o`<th scope="col">${e}</th>`)}
          </tr>
        </thead>
        <tbody>
          ${n.rows.map(
            (e) => o`
              <tr>
                ${n.columns.map((t) => o`<td>${Tn(e[t])}</td>`)}
              </tr>
            `,
          )}
        </tbody>
      </table>
      ${
        r > 0
          ? o`<div class="workspace-table__footer">
            ${v(`workspaces.widget.table.more`, { count: String(r) })}
          </div>`
          : u
      }
    </div>
  `;
}
var Dn,
  On = e(() => {
    (s(), y(), Y(), (Dn = 8));
  });
function kn(e, t) {
  let n = q(t) && q(t.totals) ? t.totals : {};
  return { cost: J(n.totalCost) ?? 0, tokens: J(n.totalTokens) ?? 0 };
}
function An(e, t) {
  let n = kn(e, t);
  return o`
    <div class="workspace-usage" data-test-id="workspace-usage">
      <div class="workspace-usage__metric">
        <div class="workspace-usage__value">${ee(n.cost)}</div>
        <div class="workspace-usage__label">${v(`workspaces.widget.usage.cost`)}</div>
      </div>
      <div class="workspace-usage__metric">
        <div class="workspace-usage__value">${te(n.tokens)}</div>
        <div class="workspace-usage__label">${v(`workspaces.widget.usage.tokens`)}</div>
      </div>
    </div>
  `;
}
var jn = e(() => {
  (s(), y(), _(), Y());
});
function Mn(e) {
  let t = e.startsWith(`builtin:`) ? e.slice(8) : e;
  return Nn[t];
}
var Nn,
  Pn = e(() => {
    (Ut(),
      Yt(),
      $t(),
      sn(),
      un(),
      hn(),
      bn(),
      On(),
      jn(),
      (Nn = {
        "stat-card": (e, t) => yn(e, t),
        markdown: (e, t) => ln(e, t),
        table: (e, t) => En(e, t),
        "iframe-embed": Zt,
        sessions: (e, t, n) => pn(e, t, n.basePath),
        usage: (e, t) => An(e, t),
        cron: (e, t) => qt(e, t),
        instances: (e, t) => rn(e, t),
        activity: (e, t) => Vt(e, t),
      }));
  });
function Fn(e) {
  return e.replace(/\s*\(custom\)\s*$/iu, ``).trim() || e;
}
function In(e) {
  let t = Se(e.createdBy);
  return t
    ? o`<span
    class="workspace-widget__provenance"
    title=${v(`workspaces.widget.provenanceTooltip`, { agent: t })}
    >${v(`workspaces.widget.provenanceChip`)}</span
  >`
    : u;
}
function Ln() {
  return o`
    <wa-dropdown-item class="workspace-widget__menu-item" value="edit-title">
      ${v(`workspaces.widget.menu.editTitle`)}
    </wa-dropdown-item>
    <wa-dropdown-item class="workspace-widget__menu-item" value="move-to-tab">
      ${v(`workspaces.widget.menu.moveToTab`)}
    </wa-dropdown-item>
    <wa-dropdown-item class="workspace-widget__menu-item" value="hide">
      ${v(`workspaces.widget.menu.hide`)}
    </wa-dropdown-item>
    <wa-dropdown-item
      class="workspace-widget__menu-item workspace-widget__menu-item--danger"
      value="remove"
      variant="danger"
    >
      ${v(`workspaces.widget.menu.remove`)}
    </wa-dropdown-item>
  `;
}
function Rn(e, t, n) {
  if (t && `error` in t) throw Error(t.error);
  let r = t && `value` in t ? t.value : void 0,
    i = Mn(e.kind);
  return i
    ? i(e, r, n)
    : e.kind.startsWith(`custom:`)
      ? o`<div class="workspace-widget__placeholder">
      ${v(`workspaces.widget.customPlaceholder`)}
    </div>`
      : o`<div class="workspace-widget__placeholder">
    ${v(`workspaces.widget.unknownKind`, { kind: e.kind })}
  </div>`;
}
function zn(e, t) {
  if (t.status === `approved`)
    return t.manifest
      ? yt({ widget: e, manifest: t.manifest, context: t.host })
      : o`<div
        class="workspace-widget__placeholder"
        data-test-id="workspace-custom-loading"
      >
        ${v(`workspaces.widget.customLoading`)}
      </div>`;
  if (t.status === `pending`) {
    let n = Se(t.createdBy);
    return o`
      <div
        class="workspace-widget__approval"
        role="group"
        data-test-id="workspace-custom-pending"
        aria-label=${v(`workspaces.widget.approval.title`)}
      >
        <div class="workspace-widget__approval-title">${v(`workspaces.widget.approval.title`)}</div>
        <div class="workspace-widget__approval-sub">
          ${n ? v(`workspaces.widget.approval.byAgent`, { agent: n }) : v(`workspaces.widget.approval.byUnknown`)}
        </div>
        <div class="workspace-widget__approval-actions">
          <button
            class="btn btn--small btn--primary"
            type="button"
            data-test-id="workspace-custom-approve"
            @click=${() => t.onApprove(e)}
          >
            ${v(`workspaces.widget.approval.approve`)}
          </button>
          <button
            class="btn btn--small"
            type="button"
            data-test-id="workspace-custom-reject"
            @click=${() => t.onReject(e)}
          >
            ${v(`workspaces.widget.approval.reject`)}
          </button>
        </div>
      </div>
    `;
  }
  return o`<div class="workspace-widget__placeholder" data-test-id="workspace-custom-rejected">
    ${v(`workspaces.widget.approval.unavailable`)}
  </div>`;
}
function Bn(e, t, n, r, i) {
  try {
    return e.kind.startsWith(`custom:`) && i ? zn(e, i) : Rn(e, t, n);
  } catch (t) {
    let n = t instanceof Error ? t.message : String(t);
    return o`
      <div class="workspace-widget__error" role="alert" data-test-id="workspace-widget-error">
        <div class="workspace-widget__error-title">${v(`workspaces.widget.errorTitle`)}</div>
        <div class="workspace-widget__error-humane">${v(`workspaces.widget.errorHumane`)}</div>
        <details class="workspace-widget__error-detail">
          <summary>${v(`workspaces.widget.errorDetailSummary`)}</summary>
          <div class="workspace-widget__error-message">${n}</div>
        </details>
        <button class="btn btn--small" type="button" @click=${() => r.onRemove(e)}>
          ${v(`workspaces.widget.menu.remove`)}
        </button>
      </div>
    `;
  }
}
function Vn(e) {
  let { widget: t, callbacks: n } = e;
  return o`
    <section
      class=${[`workspace-widget`, t.collapsed ? `workspace-widget--collapsed` : ``, e.pending ? `workspace-widget--pending` : ``, e.dragging ? `workspace-widget--dragging` : ``].filter(Boolean).join(` `)}
      style=${Mt(t.grid)}
      data-widget-id=${t.id}
      data-test-id="workspace-widget"
    >
      <header
        class="workspace-widget__bar"
        @pointerdown=${(e) => n.onMovePointerDown(t, e)}
      >
        <button
          class="workspace-widget__collapse"
          type="button"
          aria-expanded=${t.collapsed ? `false` : `true`}
          aria-label=${t.collapsed ? v(`workspaces.widget.expand`) : v(`workspaces.widget.collapse`)}
          @pointerdown=${(e) => e.stopPropagation()}
          @click=${() => n.onToggleCollapse(t)}
        >
          ${t.collapsed ? b.chevronRight : b.chevronDown}
        </button>
        <span class="workspace-widget__title" title=${t.title}
          >${Fn(t.title)}</span
        >
        ${In(t)}
        <span
          class="workspace-widget__handle"
          role="button"
          tabindex="0"
          aria-label=${v(`workspaces.widget.moveHandle`)}
          @keydown=${(e) => Hn(e, t, `move`, n)}
          >${b.arrowUpDown}</span
        >
        <wa-dropdown
          class="workspace-widget__menu"
          placement="bottom-end"
          .open=${e.menuOpen}
          @pointerdown=${(e) => e.stopPropagation()}
          @wa-select=${(e) => {
            switch (e.detail.item.value) {
              case `edit-title`:
                n.onEditTitle(t);
                break;
              case `move-to-tab`:
                n.onMoveToTab(t);
                break;
              case `hide`:
                n.onHide(t);
                break;
              case `remove`:
                n.onRemove(t);
                break;
              case void 0:
                break;
            }
          }}
          @wa-show=${() => {
            e.menuOpen || n.onToggleMenu(t);
          }}
          @wa-hide=${() => {
            e.menuOpen && n.onCloseMenu(t);
          }}
        >
          <button
            slot="trigger"
            class="workspace-widget__menu-toggle"
            type="button"
            aria-label=${v(`workspaces.widget.menuLabel`)}
          >
            ${b.moreHorizontal}
          </button>
          ${Ln()}
        </wa-dropdown>
      </header>
      ${
        t.collapsed
          ? u
          : o`
            <div class="workspace-widget__body">
              ${Bn(t, e.binding, e.builtinContext, n, e.custom)}
            </div>
            <span
              class="workspace-widget__resize"
              role="button"
              tabindex="0"
              aria-label=${v(`workspaces.widget.resizeHandle`)}
              @pointerdown=${(e) => n.onResizePointerDown(t, e)}
              @keydown=${(e) => Hn(e, t, `resize`, n)}
            ></span>
          `
      }
    </section>
  `;
}
function Hn(e, t, n, r) {
  let i =
    e.key === `ArrowLeft`
      ? `left`
      : e.key === `ArrowRight`
        ? `right`
        : e.key === `ArrowUp`
          ? `up`
          : e.key === `ArrowDown`
            ? `down`
            : null;
  i && (e.preventDefault(), r.onKeyboardNudge(t, n, i));
}
var Un = e(() => {
    (s(), y(), Lt(), B(), Pn(), me(), Ct(), he());
  }),
  Wn = e(() => {});
function Gn() {
  try {
    return ie()?.getItem(Z) === `1`;
  } catch {
    return !1;
  }
}
function Kn() {
  try {
    ie()?.setItem(Z, `1`);
  } catch {}
}
function X(e) {
  let t = $.get(e);
  t &&
    (document.removeEventListener(`pointerdown`, t.onPointerDown, !0),
    document.removeEventListener(`keydown`, t.onKeyDown, !0),
    $.delete(e));
}
function qn(e, t, n) {
  let r = t.openMenuWidgetId !== null;
  if (r === $.has(e)) return;
  if (!r) {
    X(e);
    return;
  }
  let i = () => {
      t.openMenuWidgetId !== null && ((t.openMenuWidgetId = null), X(e), n());
    },
    a = (e) => {
      let t = e.target;
      (t instanceof Element &&
        t.closest(`.workspace-widget__menu, .workspace-widget__menu-toggle`)) ||
        i();
    },
    o = (e) => {
      e.key === `Escape` && (e.preventDefault(), i());
    };
  (document.addEventListener(`pointerdown`, a, !0),
    document.addEventListener(`keydown`, o, !0),
    $.set(e, { onPointerDown: a, onKeyDown: o }));
}
function Jn(e) {
  X(e);
}
function Yn(e) {
  let t = Q.get(e);
  return (
    t ||
      ((t = {
        openMenuWidgetId: null,
        drag: null,
        bindingResults: new Map(),
        bindingLoads: new Set(),
        bindingVersion: -1,
        manifestCache: new Map(),
        manifestLoads: new Set(),
        manifestVersion: -1,
        manifestConnected: !1,
        manifestEpoch: 0,
        dataVersion: 0,
        dialog: null,
        onboardingDismissed: Gn(),
      }),
      Q.set(e, t)),
    t
  );
}
function Xn(e) {
  Yn(e).dataVersion += 1;
}
function Zn(e) {
  return new URLSearchParams(e).get(`ws`)?.trim() || null;
}
function Qn(e) {
  let n = new URL(window.location.href),
    r = t(n.search);
  (n.searchParams.set(`plugin`, r.pluginId),
    n.searchParams.set(`id`, r.id),
    n.searchParams.set(`ws`, e),
    window.history.pushState({}, ``, `${n.pathname}${n.search}${n.hash}`),
    window.dispatchEvent(new PopStateEvent(`popstate`)));
}
function $n(e) {
  let t = e.bindings;
  return t ? (Object.values(t)[0] ?? null) : null;
}
function er(e, t) {
  return e.workspaceVersion * 1000003 + t.dataVersion;
}
function tr(e, t, n, r, i) {
  let a = er(n, e);
  e.bindingVersion !== a &&
    (e.bindingResults.clear(), e.bindingLoads.clear(), (e.bindingVersion = a));
  for (let n of r.widgets) {
    let r = $n(n);
    !r ||
      e.bindingResults.has(n.id) ||
      e.bindingLoads.has(n.id) ||
      (e.bindingLoads.add(n.id),
      Qe(t, r).then((t) => {
        e.bindingVersion === a &&
          (e.bindingResults.set(n.id, t), e.bindingLoads.delete(n.id), i?.());
      }));
  }
}
function nr(e) {
  return {
    width: (e instanceof HTMLElement ? e.querySelector(`.workspace-grid`) : null)?.clientWidth ?? 0,
  };
}
function rr(e, t) {
  return e.onboardingDismissed
    ? u
    : o`
    <div class="workspace-onboarding" role="note" data-test-id="workspace-onboarding">
      <span class="workspace-onboarding__icon" aria-hidden="true">${b.spark}</span>
      <div class="workspace-onboarding__body">
        <div class="workspace-onboarding__title">${v(`workspaces.onboarding.title`)}</div>
        <div class="workspace-onboarding__sub">${v(`workspaces.onboarding.primary`)}</div>
        <div class="workspace-onboarding__sub">
          ${v(`workspaces.onboarding.secondary`)}
          <code class="workspace-onboarding__cmd">${v(`workspaces.empty.onboardingCommand`)}</code>
        </div>
      </div>
      <button
        class="workspace-onboarding__dismiss"
        type="button"
        data-test-id="workspace-onboarding-dismiss"
        aria-label=${v(`common.dismiss`)}
        @click=${() => {
          ((e.onboardingDismissed = !0), Kn(), t());
        }}
      >
        ${b.x}
      </button>
    </div>
  `;
}
function ir(e, t) {
  let n = D(t),
    r = Ie(t);
  return o`
    <wa-tab-group
      class="workspace-tabs"
      aria-label=${v(`workspaces.tabs.label`)}
      .active=${e.activeSlug}
      activation="auto"
      without-scroll-controls
      @wa-tab-show=${(e) => Qn(e.detail.name)}
    >
      ${n.map(
        (e) => o`
          <wa-tab
            id=${`workspace-tab-${e.slug}`}
            class="workspace-tab"
            panel=${e.slug}
            aria-controls="workspace-tab-panel"
            data-test-id="workspace-tab"
            data-ws=${e.slug}
          >
            ${
              e.icon && Object.hasOwn(b, e.icon)
                ? o`<span class="workspace-tab__icon" aria-hidden="true"
                  >${b[e.icon]}</span
                >`
                : u
            }
            <span class="workspace-tab__label">${e.title}</span>
          </wa-tab>
        `,
      )}
      ${
        r.length > 0
          ? o`
            <wa-dropdown
              slot="nav"
              class="workspace-tabs__hidden"
              placement="bottom-end"
              @wa-select=${(e) => {
                let t = e.detail.item.value;
                t && Qn(t);
              }}
            >
              <button slot="trigger" class="workspace-tab workspace-tab--overflow" type="button">
                <span class="workspace-tab__icon" aria-hidden="true">${b.eyeOff}</span>
                <span class="workspace-tab__label"
                  >${v(`workspaces.tabs.hidden`, { count: String(r.length) })}</span
                >
              </button>
              ${r.map(
                (e) => o`
                  <wa-dropdown-item class="workspace-tabs__hidden-item" .value=${e.slug}>
                    ${e.title}
                  </wa-dropdown-item>
                `,
              )}
            </wa-dropdown>
          `
          : u
      }
    </wa-tab-group>
  `;
}
function ar(e, t, n, r) {
  if (!t.connected || !t.client) return;
  e.manifestVersion !== n.workspaceVersion &&
    (e.manifestCache.clear(), e.manifestLoads.clear(), (e.manifestVersion = n.workspaceVersion));
  let i = e.manifestVersion,
    a = e.manifestEpoch;
  for (let o of r.widgets) {
    let r = w(o.kind),
      s = r ? e.manifestCache.get(r) : void 0;
    (r && s?.frameExpiresAt && s.frameExpiresAt <= Date.now() + 6e4 && e.manifestCache.delete(r),
      !(!r || T(n, o.kind) !== `approved` || e.manifestCache.has(r) || e.manifestLoads.has(r)) &&
        (e.manifestLoads.add(r),
        _t(t.client, r).then((n) => {
          e.manifestVersion !== i ||
            e.manifestEpoch !== a ||
            (e.manifestLoads.delete(r), n && (e.manifestCache.set(r, n), t.onRequestUpdate?.()));
        })));
  }
}
function or(e, t, n, r, i) {
  let a = w(i.kind);
  if (!a) return null;
  let o = { client: e.client, basePath: e.basePath ?? ``, sessionKey: e.sessionKey ?? `main` },
    s = r.widgetsRegistry[a]?.createdBy;
  return {
    status: T(r, i.kind),
    ...(s ? { createdBy: s } : {}),
    manifest: n.manifestCache.get(a) ?? null,
    host: o,
    onApprove: () => void Ze(t, e.client, { name: a, decision: `approved` }),
    onReject: () => void Ze(t, e.client, { name: a, decision: `rejected` }),
  };
}
function sr(e, t, n, r, i) {
  if ((tr(n, e.client, r, i, e.onRequestUpdate ?? null), ar(n, e, r, i), i.widgets.length === 0))
    return o`
      <div class="workspace-empty workspace-empty--tab" data-test-id="workspace-empty-tab">
        <span class="workspace-empty__icon" aria-hidden="true">${b.plus}</span>
        <div class="workspace-empty__title">${v(`workspaces.empty.tabTitle`)}</div>
        <div class="workspace-empty__sub">${v(`workspaces.empty.tabSubtitle`)}</div>
      </div>
    `;
  let a = lr(e, t, n, i),
    s = { basePath: e.basePath ?? ``, embed: e.embed ?? mr },
    c = Nt(i.widgets);
  return o`
    <div class="workspace-grid" style="min-height: ${c * 56 + Math.max(0, c - 1) * 12}px" data-test-id="workspace-grid">
      ${i.widgets.map((i) => {
        let o = or(e, t, n, r, i);
        return Vn({
          widget: i,
          binding: n.bindingResults.get(i.id) ?? null,
          menuOpen: n.openMenuWidgetId === i.id,
          pending: t.pendingWidgetIds.has(i.id),
          dragging: n.drag?.widgetId === i.id,
          builtinContext: s,
          callbacks: a,
          ...(o ? { custom: o } : {}),
        });
      })}
      ${cr(n, i)}
    </div>
  `;
}
function cr(e, t) {
  let n = e.drag;
  return n
    ? o`
    <div
      class="workspace-ghost ${W(n.ghostRect, t.widgets, n.widgetId) ? `workspace-ghost--invalid` : ``}"
      style=${Mt(n.ghostRect)}
      aria-hidden="true"
      data-test-id="workspace-drag-ghost"
    ></div>
  `
    : u;
}
function lr(e, t, n, r) {
  let i = () => e.onRequestUpdate?.(),
    a = (a, o, s) => {
      let c = nr(e.host);
      if (c.width <= 0) return;
      let l = Ot({ widget: a, mode: s, clientX: o.clientX, clientY: o.clientY, metrics: c });
      n.drag = l;
      let u = o.target;
      u.setPointerCapture && u.setPointerCapture(o.pointerId);
      let d = !1,
        f = () => {
          (window.removeEventListener(`pointermove`, m),
            window.removeEventListener(`pointerup`, h));
        },
        p = () => {
          d || ((d = !0), f(), (n.drag = null), i());
        },
        m = (e) => {
          (kt(l, e.clientX, e.clientY), i());
        },
        h = () => {
          if (d) return;
          ((d = !0), f(), Te(e.host));
          let o = At({ requested: l.ghostRect, widgets: r.widgets, widgetId: a.id });
          ((n.drag = null),
            i(),
            o &&
              (o.x !== a.grid.x || o.y !== a.grid.y || o.w !== a.grid.w || o.h !== a.grid.h) &&
              Ge(t, e.client, { slug: r.slug, widgetId: a.id, grid: o }));
        };
      (window.addEventListener(`pointermove`, m),
        window.addEventListener(`pointerup`, h),
        we(e.host, p));
    };
  return {
    onToggleCollapse: (n) =>
      void Ke(t, e.client, { slug: r.slug, widgetId: n.id, collapsed: !n.collapsed }),
    onToggleMenu: (e) => {
      ((n.openMenuWidgetId = n.openMenuWidgetId === e.id ? null : e.id), i());
    },
    onCloseMenu: () => {
      ((n.openMenuWidgetId = null), i());
    },
    onHide: (i) => {
      ((n.openMenuWidgetId = null), Je(t, e.client, { slug: r.slug, widgetId: i.id }));
    },
    onRemove: (i) => {
      ((n.openMenuWidgetId = null), Ye(t, e.client, { slug: r.slug, widgetId: i.id }));
    },
    onEditTitle: (e) => {
      ((n.openMenuWidgetId = null),
        (n.dialog = { kind: `editTitle`, slug: r.slug, widgetId: e.id, title: e.title }),
        i());
    },
    onMoveToTab: (e) => {
      ((n.openMenuWidgetId = null),
        (n.dialog = { kind: `moveToTab`, slug: r.slug, widgetId: e.id }),
        i());
    },
    onMovePointerDown: (e, t) => {
      t.button === 0 && (t.preventDefault(), a(e, t, `move`));
    },
    onResizePointerDown: (e, t) => {
      t.button === 0 && (t.preventDefault(), t.stopPropagation(), a(e, t, `resize`));
    },
    onKeyboardNudge: (n, i, a) => {
      let o = At({ requested: Pt(n.grid, i, a), widgets: r.widgets, widgetId: n.id });
      o && Ge(t, e.client, { slug: r.slug, widgetId: n.id, grid: o });
    },
  };
}
function ur(e, t, n) {
  let r = n.dialog;
  if (!r) return u;
  let i = () => e.onRequestUpdate?.(),
    a = () => {
      ((n.dialog = null), i());
    };
  if (r.kind === `editTitle`) {
    let n = v(`workspaces.widget.editTitleTitle`);
    return o`
      <openclaw-modal-dialog label=${n} @modal-cancel=${a}>
        <form class="exec-approval-card" @submit=${(n) => {
          n.preventDefault();
          let i =
            n.currentTarget.querySelector(`input[name='workspace-widget-title']`)?.value.trim() ??
            ``;
          (i && i !== r.title && qe(t, e.client, { slug: r.slug, widgetId: r.widgetId, title: i }),
            a());
        }}>
          <div class="exec-approval-header">
            <div class="exec-approval-title">${n}</div>
          </div>
          <input
            class="workspace-dialog__input"
            type="text"
            name="workspace-widget-title"
            data-test-id="workspace-edit-title-input"
            .value=${r.title}
            aria-label=${v(`workspaces.widget.editTitleLabel`)}
            style="margin-top: 12px; width: 100%;"
          />
          <div class="exec-approval-actions">
            <button class="btn btn--primary" type="submit">${v(`common.save`)}</button>
            <button class="btn" type="button" @click=${a}>${v(`common.cancel`)}</button>
          </div>
        </form>
      </openclaw-modal-dialog>
    `;
  }
  let s = v(`workspaces.widget.moveToTabTitle`),
    c = t.workspace ? E(t.workspace).filter((e) => e.slug !== r.slug) : [];
  return o`
    <openclaw-modal-dialog label=${s} @modal-cancel=${a}>
      <form class="exec-approval-card" @submit=${(n) => {
        n.preventDefault();
        let i = n.currentTarget.querySelector(`select[name='workspace-move-target']`)?.value ?? ``;
        (i &&
          i !== r.slug &&
          Xe(t, e.client, { fromSlug: r.slug, toSlug: i, widgetId: r.widgetId }),
          a());
      }}>
        <div class="exec-approval-header">
          <div class="exec-approval-title">${s}</div>
        </div>
        ${
          c.length === 0
            ? o`<div class="exec-approval-sub" style="margin-top: 12px;">
              ${v(`workspaces.widget.moveToTabEmpty`)}
            </div>`
            : o`<select
              class="workspace-dialog__input"
              name="workspace-move-target"
              data-test-id="workspace-move-target"
              aria-label=${s}
              style="margin-top: 12px; width: 100%;"
            >
              ${c.map((e) => o`<option value=${e.slug}>${e.title}</option>`)}
            </select>`
        }
        <div class="exec-approval-actions">
          <button class="btn btn--primary" type="submit" ?disabled=${c.length === 0}>
            ${v(`workspaces.widget.menu.moveToTab`)}
          </button>
          <button class="btn" type="button" @click=${a}>${v(`common.cancel`)}</button>
        </div>
      </form>
    </openclaw-modal-dialog>
  `;
}
function dr(e) {
  let t = De(e.host),
    n = Yn(e.host);
  ((t.requestUpdate = e.onRequestUpdate ?? null), qn(e.host, n, () => e.onRequestUpdate?.()));
  let r = Zn(window.location.search),
    i = e.connected;
  return (
    n.manifestConnected !== i &&
      ((n.manifestConnected = i),
      (n.manifestEpoch += 1),
      n.manifestCache.clear(),
      n.manifestLoads.clear(),
      (n.manifestVersion = -1)),
    ze(e.host, t, i ? e.client : null),
    Be(e.host, i ? e.client : null, () => {
      (Xn(e.host), e.onRequestUpdate?.());
    }),
    i && !t.loaded && !t.loading && !t.error && k(t, e.client, { requestedSlug: r }),
    t.workspace && r && r !== t.activeSlug && (t.activeSlug = Re(t.workspace, r)),
    o`
    <section class="workspace" data-test-id="workspace">
      ${t.actionError ? o`<div class="callout danger workspace__toast" role="alert">${t.actionError}</div>` : u}
      ${fr(e, t, n)} ${ur(e, t, n)}
    </section>
  `
  );
}
function fr(e, t, n) {
  if (t.error)
    return o`
      <div class="card lazy-view-state" role="alert">
        <div class="card-title">${v(`workspaces.error.title`)}</div>
        <div class="card-sub">${v(`workspaces.error.subtitle`)}</div>
        <details class="workspace-error-detail">
          <summary>${v(`workspaces.error.detailSummary`)}</summary>
          <div class="workspace-error-detail__text">${t.error}</div>
        </details>
        <button
          class="btn btn--small"
          type="button"
          @click=${() => void k(t, e.client)}
        >
          ${v(`common.reload`)}
        </button>
      </div>
    `;
  let r = t.workspace;
  if (!r)
    return o`
      <div class="workspace-skeleton" role="status" aria-label=${v(`common.loading`)}>
        ${[0, 1, 2, 3, 4, 5].map(() => o`<div class="workspace-skeleton__card"></div>`)}
      </div>
    `;
  if (r.tabs.length === 0)
    return o`
      <div class="workspace-empty workspace-empty--onboarding" data-test-id="workspace-empty">
        <div class="workspace-empty__title">${v(`workspaces.empty.onboardingTitle`)}</div>
        <div class="workspace-empty__sub">${v(`workspaces.empty.onboardingSubtitle`)}</div>
        <code class="workspace-empty__cmd">${v(`workspaces.empty.onboardingCommand`)}</code>
      </div>
    `;
  let i = Le(r, t.activeSlug) ?? D(r)[0];
  return i
    ? o`
    ${pr(i)}
    ${rr(n, () => e.onRequestUpdate?.())}
    ${ir(t, r)}
    <wa-tab-panel
      id="workspace-tab-panel"
      name=${i.slug}
      active
      aria-labelledby=${`workspace-tab-${i.slug}`}
    >
      ${sr(e, t, n, r, i)}
    </wa-tab-panel>
  `
    : o`<div class="card lazy-view-state" role="status">
      <div class="card-sub">${v(`workspaces.empty.noVisibleTabs`)}</div>
    </div>`;
}
function pr(e) {
  return o`
    <div class="workspace-page-header" data-test-id="workspace-page-header">
      <div class="page-title">${e.title}</div>
    </div>
  `;
}
var mr,
  Z,
  Q,
  $,
  hr = e(() => {
    (s(),
      ge(),
      me(),
      he(),
      _e(),
      Ct(),
      Un(),
      y(),
      Lt(),
      B(),
      re(),
      Wn(),
      n(),
      (mr = { embedSandboxMode: `strict`, allowExternalEmbedUrls: !1 }),
      (Z = `openclaw:control-ui:workspace-onboarding-dismissed:v1`),
      (Q = new WeakMap()),
      ($ = new WeakMap()));
  });
hr();
export { B as n, He as r, dr as renderWorkspace, Jn as stopWorkspaceView, hr as t };
//# sourceMappingURL=workspace-view-DfedHez4.js.map
