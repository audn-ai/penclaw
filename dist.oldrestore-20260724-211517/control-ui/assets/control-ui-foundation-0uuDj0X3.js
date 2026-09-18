import {
  $ as t,
  A as n,
  D as r,
  G as i,
  H as a,
  K as o,
  O as s,
  S as c,
  T as l,
  Y as u,
  Z as d,
  at as f,
  ct as p,
  et as m,
  it as h,
  k as g,
  lt as _,
  ot as v,
  rt as y,
  ut as b,
  w as x,
  x as S,
} from "./lit-runtime-DkvDG939.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
var C,
  w = e(() => {
    C = class extends Event {
      constructor(e, t, n, r) {
        (super(`context-request`, { bubbles: !0, composed: !0 }),
          (this.context = e),
          (this.contextTarget = t),
          (this.callback = n),
          (this.subscribe = r ?? !1));
      }
    };
  });
function T(e) {
  return e;
}
var E = e(() => {}),
  ee,
  D = e(() => {
    (w(),
      (ee = class {
        constructor(e, t, n, r) {
          if (
            ((this.subscribe = !1),
            (this.provided = !1),
            (this.value = void 0),
            (this.t = (e, t) => {
              (this.unsubscribe &&
                (this.unsubscribe !== t && ((this.provided = !1), this.unsubscribe()),
                this.subscribe || this.unsubscribe()),
                (this.value = e),
                this.host.requestUpdate(),
                (this.provided && !this.subscribe) ||
                  ((this.provided = !0), this.callback && this.callback(e, t)),
                (this.unsubscribe = t));
            }),
            (this.host = e),
            t.context !== void 0)
          ) {
            let e = t;
            ((this.context = e.context),
              (this.callback = e.callback),
              (this.subscribe = e.subscribe ?? !1));
          } else ((this.context = t), (this.callback = n), (this.subscribe = r ?? !1));
          this.host.addController(this);
        }
        hostConnected() {
          this.dispatchRequest();
        }
        hostDisconnected() {
          this.unsubscribe &&= (this.unsubscribe(), void 0);
        }
        dispatchRequest() {
          this.host.dispatchEvent(new C(this.context, this.host, this.t, this.subscribe));
        }
      }));
  }),
  O,
  k = e(() => {
    O = class {
      get value() {
        return this.o;
      }
      set value(e) {
        this.setValue(e);
      }
      setValue(e, t = !1) {
        let n = t || !Object.is(e, this.o);
        ((this.o = e), n && this.updateObservers());
      }
      constructor(e) {
        ((this.subscriptions = new Map()),
          (this.updateObservers = () => {
            for (let [e, { disposer: t }] of this.subscriptions) e(this.o, t);
          }),
          e !== void 0 && (this.value = e));
      }
      addCallback(e, t, n) {
        if (!n) return void e(this.value);
        this.subscriptions.has(e) ||
          this.subscriptions.set(e, {
            disposer: () => {
              this.subscriptions.delete(e);
            },
            consumerHost: t,
          });
        let { disposer: r } = this.subscriptions.get(e);
        e(this.value, r);
      }
      clearCallbacks() {
        this.subscriptions.clear();
      }
    };
  }),
  A,
  j,
  te = e(() => {
    (w(),
      k(),
      (A = class extends Event {
        constructor(e, t) {
          (super(`context-provider`, { bubbles: !0, composed: !0 }),
            (this.context = e),
            (this.contextTarget = t));
        }
      }),
      (j = class extends O {
        constructor(e, t, n) {
          (super(t.context === void 0 ? n : t.initialValue),
            (this.onContextRequest = (e) => {
              if (e.context !== this.context) return;
              let t = e.contextTarget ?? e.composedPath()[0];
              t !== this.host &&
                (e.stopPropagation(), this.addCallback(e.callback, t, e.subscribe));
            }),
            (this.onProviderRequest = (e) => {
              if (
                e.context !== this.context ||
                (e.contextTarget ?? e.composedPath()[0]) === this.host
              )
                return;
              let t = new Set();
              for (let [e, { consumerHost: n }] of this.subscriptions)
                t.has(e) || (t.add(e), n.dispatchEvent(new C(this.context, n, e, !0)));
              e.stopPropagation();
            }),
            (this.host = e),
            t.context === void 0 ? (this.context = t) : (this.context = t.context),
            this.attachListeners(),
            this.host.addController?.(this));
        }
        attachListeners() {
          (this.host.addEventListener(`context-request`, this.onContextRequest),
            this.host.addEventListener(`context-provider`, this.onProviderRequest));
        }
        hostConnected() {
          this.host.dispatchEvent(new A(this.context, this.host));
        }
      }));
  });
function ne({ context: e, subscribe: t }) {
  return (n, r) => {
    typeof r == `object`
      ? r.addInitializer(function () {
          new ee(this, {
            context: e,
            callback: (e) => {
              n.set.call(this, e);
            },
            subscribe: t,
          });
        })
      : n.constructor.addInitializer((n) => {
          new ee(n, {
            context: e,
            callback: (e) => {
              n[r] = e;
            },
            subscribe: t,
          });
        });
  };
}
var re = e(() => {
    D();
  }),
  ie = e(() => {
    (w(), E(), D(), te(), re());
  }),
  ae,
  oe,
  se,
  ce = e(() => {
    (p(),
      p(),
      v(),
      v(),
      (ae = globalThis),
      (oe = class extends _ {
        constructor() {
          (super(...arguments), (this.renderOptions = { host: this }), (this._$Do = void 0));
        }
        createRenderRoot() {
          let e = super.createRenderRoot();
          return ((this.renderOptions.renderBefore ??= e.firstChild), e);
        }
        update(e) {
          let t = this.render();
          (this.hasUpdated || (this.renderOptions.isConnected = this.isConnected),
            super.update(e),
            (this._$Do = y(t, this.renderRoot, this.renderOptions)));
        }
        connectedCallback() {
          (super.connectedCallback(), this._$Do?.setConnected(!0));
        }
        disconnectedCallback() {
          (super.disconnectedCallback(), this._$Do?.setConnected(!1));
        }
        render() {
          return h;
        }
      }),
      (oe._$litElement$ = !0),
      (oe.finalized = !0),
      ae.litElementHydrateSupport?.({ LitElement: oe }),
      (se = ae.litElementPolyfillSupport),
      se?.({ LitElement: oe }),
      (ae.litElementVersions ??= []).push(`4.2.2`));
  });
function le(e) {
  return (
    typeof e == `object` && !!e && `type` in e && (e.type === `notFound` || e.type === `redirect`)
  );
}
function ue() {
  return Date.now();
}
function de(e, t) {
  let n = new Map(),
    r = new Map(),
    i = new Map(),
    a = (t, n, r) =>
      t.preload || r === `preload`
        ? (n.preloadStaleTime ?? e.preloadStaleTime)
        : (n.staleTime ?? e.staleTime),
    o = (e, t, n) =>
      e.status === `success` && !e.invalid && (!t.loader || ue() - e.updatedAt < a(e, t, n)),
    s = (n, r) => {
      let a = n.preload ? (r.preloadGcTime ?? e.preloadGcTime) : (r.gcTime ?? e.gcTime),
        o = a - (ue() - n.updatedAt);
      if (!t.getCachedMatch(n.id) || o <= 0) {
        o <= 0 && (t.removeCached(n.id), i.delete(n.id));
        return;
      }
      let c = i.get(n.id);
      c && globalThis.clearTimeout(c);
      let l = globalThis.setTimeout(() => {
        let e = t.getCachedMatch(n.id);
        if (!e) {
          i.delete(n.id);
          return;
        }
        if (ue() - e.updatedAt < a) {
          s(e, r);
          return;
        }
        (t.removeCached(n.id), i.delete(n.id));
      }, o);
      (i.set(n.id, l), l.unref?.());
    },
    c = (e, t) => {
      if (t.module !== void 0) return Promise.resolve(t.module);
      let r = n.get(e.id);
      if (r) return r;
      let i = Promise.resolve(e.component());
      return (n.set(e.id, i), i.catch(() => n.delete(e.id)), i);
    },
    l = (e, n, r, i, a) => {
      let c = t.getMatch(e.id) ?? e;
      if (!a && o(c, n, i.cause))
        return (
          t.updateMatch(c.id, (e) => ({ ...e, preload: i.cause === `preload` })),
          s(c, n),
          Promise.resolve({ data: c.data, updatedAt: c.updatedAt })
        );
      let l = n.loader?.(r, { ...i, deps: c.deps });
      return Promise.resolve(l).then((e) => {
        if (le(e)) throw e;
        return { data: e, updatedAt: ue() };
      });
    };
  return {
    loadRoute: async (e, n, i, a, o, u) => {
      let d = r.get(e.id);
      if (d && !o) return d;
      let f = t.getMatch(e.id) ?? e,
        p = f.fetchCount + 1;
      t.updateMatch(e.id, (e) => ({ ...e, isFetching: `loader`, fetchCount: p }));
      let m = l(f, n, i, a, o),
        h = c(n, f).then(
          (e) => (
            t.getMatch(f.id)?.fetchCount === p &&
              !a.signal.aborted &&
              (t.updateMatch(f.id, (t) => ({ ...t, module: e })), u?.(e)),
            e
          ),
        ),
        g = Promise.all([m, h]).then(([e, r]) => {
          if (t.getMatch(f.id)?.fetchCount !== p || a.signal.aborted)
            return { data: e.data, module: r };
          t.updateMatch(f.id, (t) => ({
            ...t,
            data: e.data,
            module: r,
            status: `success`,
            isFetching: !1,
            error: void 0,
            invalid: !1,
            preload: a.cause === `preload`,
            updatedAt: e.updatedAt,
          }));
          let i = t.getMatch(f.id);
          return (i && s(i, n), { data: e.data, module: r });
        });
      r.set(e.id, g);
      try {
        return await g;
      } catch (n) {
        throw (
          t.getMatch(e.id)?.fetchCount === p &&
            !a.signal.aborted &&
            t.updateMatch(e.id, (e) => ({
              ...e,
              status: `error`,
              isFetching: !1,
              error: n,
              updatedAt: ue(),
            })),
          n
        );
      } finally {
        r.get(e.id) === g && r.delete(e.id);
      }
    },
    scheduleGc: s,
    isFresh: o,
    shouldReloadInBackground: (t) => (t.staleReloadMode ?? e.staleReloadMode) === `background`,
    clear() {
      let e = t.getState();
      for (let t of [...e.matches, ...e.pendingMatches, ...e.cachedMatches])
        (t.isFetching || t.status === `pending`) && t.abortController.abort();
      for (let e of i.values()) globalThis.clearTimeout(e);
      (i.clear(), r.clear(), n.clear());
    },
  };
}
function fe(e, t) {
  return `${e}\u0000${t}`;
}
function pe(e, t, n, r, i, a = !1) {
  return {
    id: fe(e, n),
    routeId: e,
    location: t,
    deps: n,
    status: `pending`,
    isFetching: !1,
    updatedAt: 0,
    fetchCount: 0,
    abortController: i,
    cause: r,
    preload: a,
    invalid: !1,
  };
}
function me() {
  let e = new Map(),
    t = new Map(),
    n = new Map(),
    r = new Set(),
    i = new Map(),
    a = xe(`/`),
    o = null,
    s = `idle`,
    c = [],
    l = [],
    u = [],
    d = 0,
    f = !1,
    p = new Set(),
    m = () => ({
      location: a,
      resolvedLocation: o,
      status: s,
      matches: c,
      pendingMatches: l,
      cachedMatches: u,
    }),
    h = () => {
      ((c = [...e.values()]), (l = [...t.values()]), (u = [...n.values()]));
    },
    g = (a) => {
      if (((f = !0), a && p.add(a), d > 0)) return;
      let o = m(),
        s = [...p];
      (p.clear(), (f = !1));
      for (let e of r) e(o);
      for (let r of s) {
        let a = e.get(r) ?? t.get(r) ?? n.get(r);
        for (let e of i.get(r) ?? []) e(a);
      }
    },
    _ = (e) => {
      d += 1;
      try {
        e();
      } finally {
        (--d, d === 0 && f && g());
      }
    },
    v = (r, i) => {
      for (let a of [e, t, n]) a !== i && a.delete(r) && p.add(r);
    },
    y = (e, t) => {
      let n = !1,
        r = new Set(t.map((e) => e.id));
      for (let t of e.keys()) r.has(t) || (e.delete(t), p.add(t), (n = !0));
      for (let r of t) {
        let t = e.get(r.id);
        (v(r.id, e), t !== r && (e.set(r.id, r), p.add(r.id), (n = !0)));
      }
      n && (h(), g());
    };
  return {
    batch: _,
    getState: m,
    getMatch: (r) => e.get(r) ?? t.get(r) ?? n.get(r),
    getCachedMatch: (e) => n.get(e),
    getActiveMatch: () => e.values().next().value,
    setLocation(e, t) {
      (a.pathname === e.pathname &&
        a.search === e.search &&
        a.hash === e.hash &&
        o?.pathname === t?.pathname &&
        o?.search === t?.search &&
        o?.hash === t?.hash) ||
        ((a = e), (o = t), g());
    },
    setStatus(e) {
      s !== e && ((s = e), g());
    },
    setActive(t) {
      _(() => y(e, t));
    },
    setPending(e) {
      _(() => y(t, e));
    },
    setCached(e) {
      _(() => y(n, e));
    },
    removeCached(e) {
      n.delete(e) && (h(), g(e));
    },
    updateMatch(r, i) {
      let a = [e, t, n].find((e) => e.has(r)),
        o = a?.get(r);
      if (!a || !o) return !1;
      let s = i(o);
      return (s !== o && (a.set(r, s), h(), g(r)), !0);
    },
    invalidate(r) {
      _(() => {
        for (let i of [e, t, n])
          for (let [e, t] of i)
            (r === void 0 || t.routeId === r) &&
              (i.set(e, {
                ...t,
                invalid: !0,
                ...(t.status === `error` || t.status === `notFound`
                  ? { status: `pending`, error: void 0 }
                  : {}),
              }),
              g(e));
        h();
      });
    },
    clear() {
      _(() => {
        for (let r of [e, t, n]) {
          for (let e of r.keys()) p.add(e);
          r.clear();
        }
        (h(), (a = xe(`/`)), (o = null), (s = `idle`), g());
      });
    },
    subscribe(e) {
      return (r.add(e), () => r.delete(e));
    },
    subscribeSelector(e, t, n = Object.is) {
      let i = e(m()),
        a = (r) => {
          let a = e(r);
          n(i, a) || ((i = a), t(a));
        };
      return (r.add(a), () => r.delete(a));
    },
    subscribeMatch(e, t) {
      let n = i.get(e) ?? new Set();
      return (n.add(t), i.set(e, n), () => (n.delete(t), n.size === 0 && i.delete(e), !0));
    },
  };
}
function he(e) {
  let t = e.trim();
  if (!t || t === `/`) return ``;
  let n = t.startsWith(`/`) ? t : `/${t}`;
  return n.endsWith(`/`) ? n.slice(0, -1) : n;
}
function ge(e) {
  let t = e.trim();
  if (!t) return `/`;
  let n = t.startsWith(`/`) ? t : `/${t}`;
  return n.length > 1 && n.endsWith(`/`) ? n.slice(0, -1) : n;
}
function _e(e) {
  let t = ge(e).toLowerCase();
  return t.endsWith(`/index.html`) ? ge(t.slice(0, -11)) : t;
}
function ve(e) {
  return { pathname: ge(e.pathname), search: e.search, hash: e.hash };
}
function ye(e, t) {
  let n = he(t),
    r = ge(e);
  return r === n ? `/` : n && r.startsWith(`${n}/`) ? r.slice(n.length) : r;
}
function be(e) {
  let t = new Map(),
    n = new Map();
  for (let r of e) {
    if (t.has(r.id)) throw Error(`Duplicate route id "${r.id}".`);
    let e = { ...r, path: ge(r.path) };
    t.set(r.id, e);
    for (let t of [e.path, ...(r.aliases ?? [])]) {
      let e = _e(t),
        i = n.get(e);
      if (i && i !== r.id) throw Error(`Duplicate route path "${t}".`);
      n.set(e, r.id);
    }
  }
  return {
    byId: t,
    byPath: n,
    pathForRoute(e, n = ``) {
      let r = t.get(e);
      if (!r) throw Error(`Unknown route id "${e}".`);
      let i = he(n);
      return i ? `${i}${r.path}` : r.path;
    },
    routeIdFromPath(e, t = ``) {
      let r = _e(ye(e, t));
      return n.get(r) ?? null;
    },
  };
}
function xe(e) {
  let t = e.indexOf(`#`),
    n = e.indexOf(`?`),
    r = n < 0 ? t : t < 0 ? n : Math.min(n, t),
    i = t < 0 ? e.length : t,
    a = r < 0 ? e.length : r,
    o = t < 0 ? e.length : t;
  return {
    pathname: ge(e.slice(0, a)),
    search: r >= 0 && r < i ? e.slice(r, o) : ``,
    hash: i < e.length ? e.slice(i) : ``,
  };
}
function Se(e, t) {
  return e === t && !t.controller.signal.aborted;
}
function Ce(e) {
  e?.controller.abort();
}
function we(e) {
  return e.status === `success`;
}
function Te(e) {
  return typeof e == `object` && !!e && `type` in e && e.type === `notFound`;
}
function Ee(e) {
  return (
    typeof e == `object` &&
    !!e &&
    `type` in e &&
    e.type === `redirect` &&
    `location` in e &&
    De(e.location)
  );
}
function De(e) {
  return (
    typeof e == `object` &&
    !!e &&
    `pathname` in e &&
    typeof e.pathname == `string` &&
    `search` in e &&
    typeof e.search == `string` &&
    `hash` in e &&
    typeof e.hash == `string`
  );
}
function Oe(e) {
  let t = be(e.routes),
    n = me(),
    r = de(
      {
        staleTime: e.staleTime ?? je,
        staleReloadMode: e.defaultStaleReloadMode ?? Me,
        preloadStaleTime: e.preloadStaleTime ?? Ne,
        preloadGcTime: e.preloadGcTime ?? Pe,
        gcTime: e.gcTime ?? Pe,
      },
      n,
    ),
    i,
    a = ``,
    o,
    s = null,
    c = { hasContext: !1 },
    l = async (e, n, r, i) => {
      !e ||
        !i.shouldRun() ||
        (await t.byId
          .get(e.routeId)
          ?.[n]?.(r, e.data, { ...i, location: e.location, deps: e.deps }));
    },
    u = async (e, o, u = {}, f = xe(t.pathForRoute(e, a))) => {
      let p = t.byId.get(e);
      if (!p) throw Error(`Unknown route id "${e}".`);
      c = { hasContext: !0, value: o };
      let m = ve(f),
        h = n.getActiveMatch(),
        g = p.loaderDeps?.(o, m) ?? ``,
        _ = h?.routeId === e,
        v = fe(e, g),
        y = h?.id === v,
        b = u.revalidate === !0 && h?.routeId === e,
        x = n.getCachedMatch(v),
        S = !y && x?.status === `success` && x.module !== void 0 && !x.invalid,
        C = S && r.isFresh(x, p, `navigation`),
        w =
          y && b && h?.status === `success` && h.module !== void 0
            ? !0
            : S && !C && r.shouldReloadInBackground(p);
      i && u.history && u.history !== `none` && i[u.history](m);
      let T = s;
      if (T?.matchId === v && T.promise && !T.controller.signal.aborted)
        return (
          n.updateMatch(v, (e) => ({ ...e, location: m })),
          n.setLocation(m, n.getState().resolvedLocation),
          (T.location = m),
          T.promise
        );
      if (y && h?.status === `success` && !h.invalid && !b) {
        (n.updateMatch(h.id, (e) => ({ ...e, location: m })),
          n.setLocation(m, m),
          n.setStatus(`success`));
        return;
      }
      Ce(s);
      let E = new AbortController(),
        ee = b ? `revalidate` : `navigation`,
        D =
          y && h
            ? {
                ...h,
                location: m,
                abortController: E,
                cause: ee,
                error: void 0,
                invalid: !0,
                isFetching: `loader`,
                preload: !1,
              }
            : x
              ? {
                  ...x,
                  location: m,
                  abortController: E,
                  cause: ee,
                  error: void 0,
                  invalid: x.invalid,
                  isFetching: !1,
                  preload: !1,
                }
              : { ...pe(e, m, g, ee, E) },
        O = S && (C || w) ? { ...D, isFetching: w ? `loader` : !1, preload: C && !w } : void 0,
        k = !!O,
        A = { controller: E, matchId: v, location: m };
      s = A;
      let j = {
          signal: E.signal,
          shouldRun: () => Se(s, A),
          revalidating: b,
          location: m,
          deps: g,
          cause: ee,
        },
        te = n.getState().resolvedLocation;
      (O
        ? n.batch(() => {
            if (h && we(h)) {
              n.setCached([...n.getState().cachedMatches.filter((e) => e.id !== h.id), h]);
              let e = t.byId.get(h.routeId);
              e && r.scheduleGc(h, e);
            }
            (n.setActive([O]), n.setPending([]), n.setLocation(m, m), n.setStatus(`success`));
          })
        : y
          ? n.updateMatch(D.id, () => D)
          : n.setPending([D]),
        O || (n.setLocation(m, te), n.setStatus(w ? `success` : `loading`)));
      let ne = (async () => {
        let e;
        try {
          e = await r.loadRoute(D, p, o, j, b || !!x?.invalid, (e) => {
            if (!j.shouldRun() || n.getActiveMatch()?.id === D.id) return;
            let i = n.getMatch(D.id);
            i &&
              ((k = !0),
              n.batch(() => {
                if (h && we(h)) {
                  n.setCached([...n.getState().cachedMatches.filter((e) => e.id !== h.id), h]);
                  let e = t.byId.get(h.routeId);
                  e && r.scheduleGc(h, e);
                }
                (n.setActive([{ ...i, module: e }]), n.setPending([]), n.setLocation(m, m));
              }));
          });
        } catch (e) {
          if (!j.shouldRun()) return;
          if (Ee(e)) {
            (n.updateMatch(D.id, (t) => ({
              ...t,
              status: `redirected`,
              isFetching: !1,
              error: e,
              updatedAt: Date.now(),
            })),
              n.setStatus(`redirected`),
              (s = null),
              j.cause !== `preload` && (await d(e.location, o, !1, `replace`)));
            return;
          }
          let i = Te(e) ? `notFound` : `error`,
            a = n.getMatch(D.id);
          if (a) {
            let o = k ? h : n.getActiveMatch();
            n.batch(() => {
              if (!k && !y && o && we(o)) {
                n.setCached([...n.getState().cachedMatches, o]);
                let e = t.byId.get(o.routeId);
                e && r.scheduleGc(o, e);
              }
              (n.updateMatch(D.id, (t) => ({
                ...t,
                status: i,
                isFetching: !1,
                error: e,
                updatedAt: Date.now(),
              })),
                k || n.setActive([n.getMatch(D.id) ?? a]),
                n.setPending([]),
                n.setLocation(m, m),
                n.setStatus(i));
            });
          } else n.setStatus(i);
          throw (Se(s, A) && (s = null), e);
        }
        if (!j.shouldRun()) return;
        let i = {
            ...(n.getMatch(D.id) ?? {
              ...D,
              data: e.data,
              module: e.module,
              status: `success`,
              isFetching: !1,
              error: void 0,
              invalid: !1,
              updatedAt: Date.now(),
            }),
            preload: !1,
          },
          a = k ? h : n.getActiveMatch();
        n.batch(() => {
          if (!k && !y && a && we(a)) {
            n.setCached([...n.getState().cachedMatches, a]);
            let e = t.byId.get(a.routeId);
            e && r.scheduleGc(a, e);
          }
          (n.setActive([i]),
            n.setPending([]),
            n.setLocation(A.location, A.location),
            n.setStatus(`success`));
        });
        let c = [];
        if (!_) {
          try {
            await l(a, `onLeave`, o, { ...j, revalidating: !1 });
          } catch (e) {
            c.push(e);
          }
          try {
            await l(i, `onEnter`, o, j);
          } catch (e) {
            c.push(e);
          }
        }
        if (c.length > 0) {
          let e = c[0];
          throw (
            n.updateMatch(i.id, (t) => ({ ...t, status: `error`, error: e })),
            n.setStatus(`error`),
            Se(s, A) && (s = null),
            e
          );
        }
        Se(s, A) && (s = null);
      })();
      if (((A.promise = ne), w && !b)) {
        ne.catch(() => void 0);
        return;
      }
      await ne;
    },
    d = async (e, r, i = !1, o = `none`) => {
      let c = ve(e),
        l = t.routeIdFromPath(c.pathname, a);
      if (!l) {
        (Ce(s),
          (s = null),
          n.batch(() => {
            (n.setActive([]), n.setPending([]), n.setLocation(c, null), n.setStatus(`notFound`));
          }));
        return;
      }
      await u(l, r, { history: o, revalidate: i }, c);
    },
    f = (e, i, a) => {
      let o = t.byId.get(e);
      if (!o) return Promise.reject(Error(`Unknown route id "${e}".`));
      c = { hasContext: !0, value: i };
      let s = o.loaderDeps?.(i, a) ?? ``,
        l = fe(e, s),
        u = n.getMatch(l),
        d = n.getCachedMatch(l),
        f = n.getActiveMatch();
      if (f?.id === l && f.status === `success` && !f.invalid) return Promise.resolve();
      let p = u ?? pe(e, a, s, `preload`, new AbortController(), !0);
      u || n.setCached([...n.getState().cachedMatches.filter((e) => e.id !== p.id), p]);
      let h = p.abortController,
        g = u && !d ? p.cause : `preload`,
        _ = {
          signal: h.signal,
          shouldRun: () => !h.signal.aborted,
          revalidating: !1,
          location: a,
          deps: s,
          cause: g,
        };
      return r
        .loadRoute(p, o, i, _, !1)
        .then(() => void 0)
        .catch((e) => {
          if (Ee(e)) return (n.removeCached(p.id), m(e.location, i));
          n.removeCached(p.id);
        });
    },
    p = (e, n) => f(e, n, xe(t.pathForRoute(e, a))),
    m = (e, n) => {
      let r = ve(e),
        i = t.routeIdFromPath(r.pathname, a);
      return i ? f(i, n, r) : Promise.resolve();
    };
  return {
    routes: [...t.byId.values()],
    getRoute: (e) => t.byId.get(e) ?? null,
    getMatch: n.getMatch,
    preloadRoute: p,
    preloadLocation: m,
    invalidate(e) {
      n.invalidate(e);
      let t = n.getActiveMatch();
      return !t || (e !== void 0 && t.routeId !== e) || !c.hasContext
        ? Promise.resolve()
        : u(t.routeId, c.value, { history: `none`, revalidate: !0 }, t.location);
    },
    getState: n.getState,
    subscribe: n.subscribe,
    subscribeSelector: n.subscribeSelector,
    subscribeMatch: n.subscribeMatch,
    pathForRoute: t.pathForRoute,
    routeIdFromPath: t.routeIdFromPath,
    start(e, t, n) {
      return (
        (i = e),
        (a = he(t)),
        o?.(),
        (o = i.listen((e) => {
          d(e, n).catch(() => void 0);
        })),
        d(i.location(), n, !0)
      );
    },
    navigate: u,
    navigateLocation(e, r) {
      let i = ve(e),
        o = t.routeIdFromPath(i.pathname, a);
      return o
        ? u(o, r, { history: `none` }, i)
        : (Ce(s),
          (s = null),
          n.batch(() => {
            (n.setActive([]), n.setPending([]), n.setLocation(i, null), n.setStatus(`notFound`));
          }),
          Promise.resolve());
    },
    revalidate(e, r = n.getActiveMatch()?.routeId) {
      return r
        ? u(
            r,
            e,
            { history: `none`, revalidate: !0 },
            n.getActiveMatch()?.routeId === r
              ? n.getActiveMatch()?.location
              : xe(t.pathForRoute(r, a)),
          )
        : Promise.resolve();
    },
    stop() {
      (o?.(),
        (o = void 0),
        Ce(s),
        (s = null),
        (i = void 0),
        (c = { hasContext: !1 }),
        r.clear(),
        n.clear());
    },
  };
}
function ke(e) {
  return { type: `notFound`, data: e };
}
function Ae(e) {
  return e;
}
var je,
  Me,
  Ne,
  Pe,
  Fe = e(() => {
    ((je = 0), (Me = `background`), (Ne = 3e4), (Pe = 30 * 6e4));
  }),
  Ie,
  Le = e(() => {
    Ie = class extends Event {
      constructor(e) {
        (super(`wa-select`, { bubbles: !0, cancelable: !0, composed: !0 }), (this.detail = e));
      }
    };
  });
function* Re(e = document.activeElement) {
  e != null &&
    (yield e,
    `shadowRoot` in e &&
      e.shadowRoot &&
      e.shadowRoot.mode !== `closed` &&
      (yield* Re(e.shadowRoot.activeElement)));
}
var ze = e(() => {}),
  Be,
  Ve = e(() => {
    (m(),
      (Be = b`
  :host {
    --show-duration: var(--wa-transition-fast);
    --hide-duration: var(--wa-transition-fast);
    display: contents;
  }

  #menu {
    display: flex;
    flex-direction: column;
    width: max-content;
    margin: 0;
    padding: 0.25em;
    border: var(--wa-border-style) var(--wa-border-width-s) var(--wa-color-surface-border);
    border-radius: var(--wa-border-radius-m);
    background-color: var(--wa-color-surface-raised);
    box-shadow: var(--wa-shadow-m);
    color: var(--wa-color-text-normal);
    text-align: start;
    user-select: none;
    overflow: auto;
    max-width: var(--auto-size-available-width) !important;
    max-height: var(--auto-size-available-height) !important;

    &.show {
      animation: show var(--show-duration) ease;
    }

    &.hide {
      animation: show var(--hide-duration) ease reverse;
    }

    ::slotted(h1),
    ::slotted(h2),
    ::slotted(h3),
    ::slotted(h4),
    ::slotted(h5),
    ::slotted(h6) {
      display: block !important;
      margin: 0.25em 0 !important;
      padding: 0.25em 0.75em !important;
      color: var(--wa-color-text-quiet);
      font-family: var(--wa-font-family-body) !important;
      font-weight: var(--wa-font-weight-semibold) !important;
      font-size: var(--wa-font-size-smaller) !important;
    }

    ::slotted(wa-divider) {
      --spacing: 0.25em; /* Component-specific, left as-is */
    }
  }

  wa-popup[data-current-placement^='top'] #menu {
    transform-origin: bottom;
  }

  wa-popup[data-current-placement^='bottom'] #menu {
    transform-origin: top;
  }

  wa-popup[data-current-placement^='left'] #menu {
    transform-origin: right;
  }

  wa-popup[data-current-placement^='right'] #menu {
    transform-origin: left;
  }

  wa-popup[data-current-placement='left-start'] #menu {
    transform-origin: right top;
  }

  wa-popup[data-current-placement='left-end'] #menu {
    transform-origin: right bottom;
  }

  wa-popup[data-current-placement='right-start'] #menu {
    transform-origin: left top;
  }

  wa-popup[data-current-placement='right-end'] #menu {
    transform-origin: left bottom;
  }

  @keyframes show {
    from {
      scale: 0.9;
      opacity: 0;
    }
    to {
      scale: 1;
      opacity: 1;
    }
  }
`));
  }),
  He,
  Ue = e(() => {
    He = class extends Event {
      constructor() {
        super(`wa-show`, { bubbles: !0, cancelable: !0, composed: !0 });
      }
    };
  }),
  We,
  Ge = e(() => {
    We = class extends Event {
      constructor(e) {
        (super(`wa-hide`, { bubbles: !0, cancelable: !0, composed: !0 }), (this.detail = e));
      }
    };
  }),
  Ke,
  qe = e(() => {
    Ke = class extends Event {
      constructor() {
        super(`wa-after-show`, { bubbles: !0, cancelable: !1, composed: !0 });
      }
    };
  }),
  Je,
  Ye = e(() => {
    Je = class extends Event {
      constructor() {
        super(`wa-after-hide`, { bubbles: !0, cancelable: !1, composed: !0 });
      }
    };
  });
function Xe(e) {
  $e.push(e);
}
function Ze(e) {
  for (let t = $e.length - 1; t >= 0; t--)
    if ($e[t] === e) {
      $e.splice(t, 1);
      break;
    }
}
function Qe(e) {
  return $e.length > 0 && $e[$e.length - 1] === e;
}
var $e,
  et = e(() => {
    $e = [];
  }),
  tt,
  nt = e(() => {
    tt = `useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict`;
  }),
  rt,
  it = e(() => {
    (nt(),
      (rt = (e = 21) => {
        let t = ``,
          n = crypto.getRandomValues(new Uint8Array((e |= 0)));
        for (; e--;) t += tt[n[e] & 63];
        return t;
      }));
  });
function at(e = ``) {
  return `${e}${rt()}`;
}
var ot = e(() => {
  it();
});
function st(e, t) {
  t in ct &&
    !lt.has(`${e}:${t}`) &&
    (lt.add(`${e}:${t}`),
    console.warn(
      `[${e}] size="${t}" is deprecated. Use size="${ct[t]}" instead. The long-form value will be removed in the next major version.`,
    ));
}
var ct,
  lt,
  ut = e(() => {
    ((ct = { small: `s`, medium: `m`, large: `l` }), (lt = new Set()));
  }),
  dt,
  ft = e(() => {
    (m(),
      (dt = b`
  :host([size='xs']) {
    font-size: var(--wa-font-size-xs);
  }

  :host([size='s']),
  :host([size='small']) {
    font-size: var(--wa-font-size-s);
  }

  :host([size='m']),
  :host([size='medium']) {
    font-size: var(--wa-font-size-m);
  }

  :host([size='l']),
  :host([size='large']) {
    font-size: var(--wa-font-size-l);
  }

  :host([size='xl']) {
    font-size: var(--wa-font-size-xl);
  }
`));
  });
function M(e, t) {
  return new Promise((n) => {
    let r = new AbortController(),
      { signal: i } = r;
    if (e.classList.contains(t)) return;
    e.classList.add(t);
    let a = !1,
      o = () => {
        a || ((a = !0), e.classList.remove(t), n(), r.abort());
      };
    (e.addEventListener(`animationend`, o, { once: !0, signal: i }),
      e.addEventListener(`animationcancel`, o, { once: !0, signal: i }),
      requestAnimationFrame(() => {
        !a && e.getAnimations().length === 0 && o();
      }));
  });
}
var pt = e(() => {});
function N(e, t) {
  let n = { waitUntilFirstUpdate: !1, ...t };
  return (t, r) => {
    let { update: i } = t,
      a = Array.isArray(e) ? e : [e];
    t.update = function (e) {
      (a.forEach((t) => {
        let i = t;
        if (e.has(i)) {
          let t = e.get(i),
            a = this[i];
          t !== a && (!n.waitUntilFirstUpdate || this.hasUpdated) && this[r](t, a);
        }
      }),
        i.call(this, e));
    };
  };
}
var mt = e(() => {}),
  ht,
  gt,
  _t,
  P,
  vt,
  yt,
  bt,
  xt,
  F = e(() => {
    ((ht = Object.defineProperty),
      (gt = Object.getOwnPropertyDescriptor),
      (_t = (e) => {
        throw TypeError(e);
      }),
      (P = (e, t, n, r) => {
        for (var i = r > 1 ? void 0 : r ? gt(t, n) : t, a = e.length - 1, o; a >= 0; a--)
          (o = e[a]) && (i = (r ? o(t, n, i) : o(i)) || i);
        return (r && i && ht(t, n, i), i);
      }),
      (vt = (e, t, n) => t.has(e) || _t(`Cannot ` + n)),
      (yt = (e, t, n) => (vt(e, t, `read from private field`), n ? n.call(e) : t.get(e))),
      (bt = (e, t, n) =>
        t.has(e)
          ? _t(`Cannot add the same private member more than once`)
          : t instanceof WeakSet
            ? t.add(e)
            : t.set(e, n)),
      (xt = (e, t, n, r) => (
        vt(e, t, `write to private field`),
        r ? r.call(e, n) : t.set(e, n),
        n
      )));
  });
function St(e) {
  return e.replace(/[A-Z]/g, (e) => `-${e.toLowerCase()}`);
}
function Ct(e) {
  let { property: t, value: n, element: r } = e;
  if (n) {
    let e = r.getAttribute(`style`) || ``;
    e && (e.match(Tt) || (e += `;`), (e += ` `));
    let i = `${t}: ${n}`;
    return e.includes(i) ? void 0 : `${e}${i};`;
  }
  return null;
}
var wt,
  Tt,
  Et,
  I,
  L = e(() => {
    (F(),
      m(),
      i(),
      (wt = b`
  :host {
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  [hidden],
  :host([hidden]) {
    display: none !important;
  }
`),
      (Tt = /;\s+$/),
      (I = class extends oe {
        constructor() {
          (super(),
            bt(this, Et, !1),
            (this.initialReflectedProperties = new Map()),
            (this.didSSR = !!this.shadowRoot),
            (this.customStates = {
              set: (e, t) => {
                if (this.internals?.states)
                  try {
                    t ? this.internals.states.add(e) : this.internals.states.delete(e);
                  } catch (e) {
                    if (String(e).includes(`must start with '--'`))
                      console.error(
                        `Your browser implements an outdated version of CustomStateSet. Consider using a polyfill`,
                      );
                    else throw e;
                  }
              },
              has: (e) => {
                if (!this.internals?.states) return !1;
                try {
                  return this.internals.states.has(e);
                } catch {
                  return !1;
                }
              },
            }));
          try {
            this.internals = this.attachInternals();
          } catch {
            console.error(
              `Element internals are not supported in your browser. Consider using a polyfill`,
            );
          }
          this.customStates.set(`wa-defined`, !0);
          let e = this.constructor;
          for (let [t, n] of e.elementProperties)
            n.default === `inherit` &&
              n.initial !== void 0 &&
              typeof t == `string` &&
              this.customStates.set(`initial-${t}-${n.initial}`, !0);
        }
        static get styles() {
          return [wt, ...(Array.isArray(this.css) ? this.css : this.css ? [this.css] : [])];
        }
        connectedCallback() {
          (super.connectedCallback(),
            this.didSSR ||
              this.shadowRoot?.prepend(
                document.createComment(
                  ` Web Awesome: https://webawesome.com/docs/components/${this.localName.replace(`wa-`, ``)} `,
                ),
              ),
            this.didSSR &&
              this.updateComplete.then(() => {
                this.shadowRoot?.prepend(
                  document.createComment(
                    ` Web Awesome: https://webawesome.com/docs/components/${this.localName.replace(`wa-`, ``)} `,
                  ),
                );
              }));
        }
        attributeChangedCallback(e, t, n) {
          (yt(this, Et) ||
            (this.constructor.elementProperties.forEach((e, t) => {
              e.reflect && this[t] != null && this.initialReflectedProperties.set(t, this[t]);
            }),
            xt(this, Et, !0)),
            super.attributeChangedCallback(e, t, n));
        }
        willUpdate(e) {
          (super.willUpdate(e),
            this.initialReflectedProperties.forEach((t, n) => {
              e.has(n) && this[n] == null && (this[n] = t);
            }));
        }
        firstUpdated(e) {
          (super.firstUpdated(e),
            this.didSSR &&
              this.shadowRoot?.querySelectorAll(`slot`).forEach((e) => {
                e.dispatchEvent(
                  new Event(`slotchange`, { bubbles: !0, composed: !1, cancelable: !1 }),
                );
              }));
        }
        update(e) {
          try {
            super.update(e);
          } catch (e) {
            if (this.didSSR && !this.hasUpdated) {
              let t = new Event(`lit-hydration-error`, {
                bubbles: !0,
                composed: !0,
                cancelable: !1,
              });
              ((t.error = e), this.dispatchEvent(t));
            }
            throw e;
          }
        }
        setStyle(e, t) {
          if (!this.style) {
            let n = Ct({ property: St(e), value: t, element: this });
            n && this.setAttribute(`style`, n);
            return;
          }
          this.style[e] = t;
        }
        setStyleProperty(e, t) {
          if (!this.style) {
            let n = Ct({ property: e, value: t, element: this });
            n && this.setAttribute(`style`, n);
            return;
          }
          this.style.setProperty(e, t);
        }
        relayNativeEvent(e, t) {
          (e.stopImmediatePropagation(),
            this.dispatchEvent(new e.constructor(e.type, { ...e, ...t })));
        }
      }),
      (Et = new WeakMap()),
      P([d()], I.prototype, `dir`, 2),
      P([d()], I.prototype, `lang`, 2),
      P([d({ type: Boolean, reflect: !0, attribute: `did-ssr` })], I.prototype, `didSSR`, 2));
  });
function Dt(...e) {
  (e.map((e) => {
    let t = e.$code.toLowerCase();
    (At.has(t) ? At.set(t, Object.assign(Object.assign({}, At.get(t)), e)) : At.set(t, e),
      (jt ||= e));
  }),
    Ot());
}
function Ot() {
  (Pt &&
    ((Mt = document.documentElement.dir || `ltr`),
    (Nt = document.documentElement.lang || navigator.language)),
    [...kt.keys()].map((e) => {
      typeof e.requestUpdate == `function` && e.requestUpdate();
    }));
}
var kt,
  At,
  jt,
  Mt,
  Nt,
  Pt,
  Ft,
  It = e(() => {
    if (
      ((kt = new Set()),
      (At = new Map()),
      (Mt = `ltr`),
      (Nt = `en`),
      (Pt =
        typeof MutationObserver < `u` &&
        typeof document < `u` &&
        document.documentElement !== void 0),
      Pt)
    ) {
      let e = new MutationObserver(Ot);
      ((Mt = document.documentElement.dir || `ltr`),
        (Nt = document.documentElement.lang || navigator.language),
        e.observe(document.documentElement, { attributes: !0, attributeFilter: [`dir`, `lang`] }));
    }
    Ft = class {
      constructor(e) {
        ((this.host = e), this.host.addController(this));
      }
      hostConnected() {
        kt.add(this.host);
      }
      hostDisconnected() {
        kt.delete(this.host);
      }
      dir() {
        return `${this.host.dir || Mt}`.toLowerCase();
      }
      lang() {
        return `${this.host.lang || Nt}`.toLowerCase();
      }
      getTranslationData(e) {
        let t;
        try {
          t = new Intl.Locale(e.replace(/_/g, `-`));
        } catch {
          return { locale: void 0, language: ``, region: ``, primary: void 0, secondary: void 0 };
        }
        let n = t.language.toLowerCase(),
          r = t.region?.toLowerCase() ?? ``,
          i = At.get(`${n}-${r}`),
          a = At.get(n);
        return { locale: t, language: n, region: r, primary: i, secondary: a };
      }
      exists(e, t) {
        let { primary: n, secondary: r } = this.getTranslationData(t.lang ?? this.lang());
        return (
          (t = Object.assign({ includeFallback: !1 }, t)),
          !!((n && n[e]) || (r && r[e]) || (t.includeFallback && jt && jt[e]))
        );
      }
      term(e, ...t) {
        let { primary: n, secondary: r } = this.getTranslationData(this.lang()),
          i;
        if (n && n[e]) i = n[e];
        else if (r && r[e]) i = r[e];
        else if (jt && jt[e]) i = jt[e];
        else return (console.error(`No translation found for: ${String(e)}`), String(e));
        return typeof i == `function` ? i(...t) : i;
      }
      date(e, t) {
        return ((e = new Date(e)), new Intl.DateTimeFormat(this.lang(), t).format(e));
      }
      number(e, t) {
        return ((e = Number(e)), isNaN(e) ? `` : new Intl.NumberFormat(this.lang(), t).format(e));
      }
      relativeTime(e, t, n) {
        return new Intl.RelativeTimeFormat(this.lang(), n).format(e, t);
      }
    };
  }),
  Lt,
  Rt,
  zt = e(() => {
    (It(),
      (Lt = {
        $code: `en`,
        $name: `English`,
        $dir: `ltr`,
        carousel: `Carousel`,
        captions: `Captions`,
        chooseDate: `Choose date`,
        chooseDecade: `Choose decade`,
        chooseMonth: `Choose month`,
        chooseYear: `Choose year`,
        clearEntry: `Clear entry`,
        close: `Close`,
        closeCalendar: `Close calendar`,
        createOption: (e) => `Create "${e}"`,
        copied: `Copied`,
        copy: `Copy`,
        currentValue: `Current value`,
        date: `Date`,
        datePickerKeyboardHelp: `Use arrow keys to change values; press Alt+Down Arrow to open the calendar.`,
        day: `Day`,
        incompleteDate: `Enter a valid date.`,
        dropFileHere: `Drop file here or click to browse`,
        decrement: `Decrement`,
        dropFilesHere: `Drop files here or click to browse`,
        empty: `Empty`,
        endDate: `End date`,
        error: `Error`,
        enterFullscreen: `Enter fullscreen`,
        exitFullscreen: `Exit fullscreen`,
        goToSlide: (e, t) => `Go to slide ${e} of ${t}`,
        hidePassword: `Hide password`,
        increment: `Increment`,
        loading: `Loading`,
        month: `Month`,
        moreOptions: `More Options`,
        mute: `Mute`,
        nextDecade: `Next decade`,
        nextMonth: `Next month`,
        nextSlide: `Next slide`,
        nextVideo: `Next Video`,
        nextYear: `Next year`,
        numCharacters: (e) => (e === 1 ? `1 character` : `${e} characters`),
        numCharactersRemaining: (e) =>
          e === 1 ? `1 character remaining` : `${e} characters remaining`,
        numOptionsSelected: (e) =>
          e === 0 ? `No options selected` : e === 1 ? `1 option selected` : `${e} options selected`,
        pause: `Pause`,
        pauseAnimation: `Pause animation`,
        pictureInPicture: `Picture in picture`,
        play: `Play`,
        playbackSpeed: `Playback speed`,
        playlist: `Playlist`,
        playAnimation: `Play animation`,
        previousDecade: `Previous decade`,
        previousMonth: `Previous month`,
        previousSlide: `Previous slide`,
        previousVideo: `Previous video`,
        previousYear: `Previous year`,
        progress: `Progress`,
        rangeTooLong: (e) =>
          e === 1
            ? `Select a range no longer than 1 day`
            : `Select a range no longer than ${e} days`,
        rangeTooShort: (e) =>
          e === 1 ? `Select a range at least 1 day long` : `Select a range at least ${e} days long`,
        readonly: `Read-only`,
        selected: `Selected`,
        selectedDateLabel: (e) => `Selected: ${e}`,
        selectedRangeLabel: (e) => `Selected range: ${e}`,
        selectionCleared: `Selection cleared`,
        remove: `Remove`,
        resize: `Resize`,
        scrollableRegion: `Scrollable region`,
        scrollToEnd: `Scroll to end`,
        scrollToStart: `Scroll to start`,
        selectAColorFromTheScreen: `Select a color from the screen`,
        showPassword: `Show password`,
        slideNum: (e) => `Slide ${e}`,
        startDate: `Start date`,
        today: `Today`,
        toggleColorFormat: `Toggle color format`,
        seek: `Seek`,
        seekProgress: (e, t) => `${e} of ${t}`,
        currentlyPlaying: `currently playing`,
        unmute: `Unmute`,
        videoPlayer: `Video player`,
        volume: `Volume`,
        year: `Year`,
        zoomIn: `Zoom in`,
        zoomOut: `Zoom out`,
        am: `AM`,
        chooseTime: `Choose time`,
        closeTimeInput: `Close time picker`,
        dayPeriod: `AM/PM`,
        hour: `Hour`,
        minute: `Minute`,
        now: `Now`,
        pm: `PM`,
        second: `Second`,
        time: `Time`,
        timeInputKeyboardHelp: `Use arrow keys to change values; press Alt+Down Arrow to open the time picker.`,
      }),
      Dt(Lt),
      (Rt = Lt));
  }),
  Bt,
  R = e(() => {
    (zt(),
      It(),
      (Bt = class extends Ft {
        lang() {
          return this.host.didSSR && !this.host.hasUpdated ? this.host.lang || `en` : super.lang();
        }
      }),
      Dt(Rt));
  });
function Vt(e, t, n) {
  return V(e, B(t, n));
}
function Ht(e, t) {
  return typeof e == `function` ? e(t) : e;
}
function Ut(e) {
  return e.split(`-`)[0];
}
function Wt(e) {
  return e.split(`-`)[1];
}
function Gt(e) {
  return e === `x` ? `y` : `x`;
}
function Kt(e) {
  return e === `y` ? `height` : `width`;
}
function z(e) {
  let t = e[0];
  return t === `t` || t === `b` ? `y` : `x`;
}
function qt(e) {
  return Gt(z(e));
}
function Jt(e, t, n) {
  n === void 0 && (n = !1);
  let r = Wt(e),
    i = qt(e),
    a = Kt(i),
    o =
      i === `x`
        ? r === (n ? `end` : `start`)
          ? `right`
          : `left`
        : r === `start`
          ? `bottom`
          : `top`;
  return (t.reference[a] > t.floating[a] && (o = $t(o)), [o, $t(o)]);
}
function Yt(e) {
  let t = $t(e);
  return [Xt(e), t, Xt(t)];
}
function Xt(e) {
  return e.includes(`start`) ? e.replace(`start`, `end`) : e.replace(`end`, `start`);
}
function Zt(e, t, n) {
  switch (e) {
    case `top`:
    case `bottom`:
      return n ? (t ? cn : sn) : t ? sn : cn;
    case `left`:
    case `right`:
      return t ? ln : un;
    default:
      return [];
  }
}
function Qt(e, t, n, r) {
  let i = Wt(e),
    a = Zt(Ut(e), n === `start`, r);
  return (i && ((a = a.map((e) => e + `-` + i)), t && (a = a.concat(a.map(Xt)))), a);
}
function $t(e) {
  let t = Ut(e);
  return on[t] + e.slice(t.length);
}
function en(e) {
  return { top: e.top ?? 0, right: e.right ?? 0, bottom: e.bottom ?? 0, left: e.left ?? 0 };
}
function tn(e) {
  return typeof e == `number` ? { top: e, right: e, bottom: e, left: e } : en(e);
}
function nn(e) {
  let { x: t, y: n, width: r, height: i } = e;
  return { width: r, height: i, top: n, left: t, right: t + r, bottom: n + i, x: t, y: n };
}
var B,
  V,
  rn,
  an,
  H,
  on,
  sn,
  cn,
  ln,
  un,
  dn = e(() => {
    ((B = Math.min),
      (V = Math.max),
      (rn = Math.round),
      (an = Math.floor),
      (H = (e) => ({ x: e, y: e })),
      (on = { left: `right`, right: `left`, bottom: `top`, top: `bottom` }),
      (sn = [`left`, `right`]),
      (cn = [`right`, `left`]),
      (ln = [`top`, `bottom`]),
      (un = [`bottom`, `top`]));
  });
function fn(e, t, n) {
  let { reference: r, floating: i } = e,
    a = z(t),
    o = qt(t),
    s = Kt(o),
    c = Ut(t),
    l = a === `y`,
    u = r.x + r.width / 2 - i.width / 2,
    d = r.y + r.height / 2 - i.height / 2,
    f = r[s] / 2 - i[s] / 2,
    p;
  switch (c) {
    case `top`:
      p = { x: u, y: r.y - i.height };
      break;
    case `bottom`:
      p = { x: u, y: r.y + r.height };
      break;
    case `right`:
      p = { x: r.x + r.width, y: d };
      break;
    case `left`:
      p = { x: r.x - i.width, y: d };
      break;
    default:
      p = { x: r.x, y: r.y };
  }
  let m = Wt(t);
  return (m && (p[o] += f * (m === `end` ? 1 : -1) * (n && l ? -1 : 1)), p);
}
async function pn(e, t) {
  t === void 0 && (t = {});
  let { x: n, y: r, platform: i, rects: a, elements: o, strategy: s } = e,
    {
      boundary: c = `clippingAncestors`,
      rootBoundary: l = `viewport`,
      elementContext: u = `floating`,
      altBoundary: d = !1,
      padding: f = 0,
    } = Ht(t, e),
    p = tn(f),
    m = o[d ? (u === `floating` ? `reference` : `floating`) : u],
    h = nn(
      await i.getClippingRect({
        element:
          ((await (i.isElement == null ? void 0 : i.isElement(m))) ?? !0)
            ? m
            : m.contextElement ||
              (await (i.getDocumentElement == null ? void 0 : i.getDocumentElement(o.floating))),
        boundary: c,
        rootBoundary: l,
        strategy: s,
      }),
    ),
    g =
      u === `floating`
        ? { x: n, y: r, width: a.floating.width, height: a.floating.height }
        : a.reference,
    _ = await (i.getOffsetParent == null ? void 0 : i.getOffsetParent(o.floating)),
    v = ((await (i.isElement == null ? void 0 : i.isElement(_))) &&
      (await (i.getScale == null ? void 0 : i.getScale(_)))) || { x: 1, y: 1 },
    y = nn(
      i.convertOffsetParentRelativeRectToViewportRelativeRect
        ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
            elements: o,
            rect: g,
            offsetParent: _,
            strategy: s,
          })
        : g,
    );
  return {
    top: (h.top - y.top + p.top) / v.y,
    bottom: (y.bottom - h.bottom + p.bottom) / v.y,
    left: (h.left - y.left + p.left) / v.x,
    right: (y.right - h.right + p.right) / v.x,
  };
}
async function mn(e, t) {
  let { placement: n, platform: r, elements: i } = e,
    a = await (r.isRTL == null ? void 0 : r.isRTL(i.floating)),
    o = Ut(n),
    s = Wt(n),
    c = z(n) === `y`,
    l = yn.has(o) ? -1 : 1,
    u = a && c ? -1 : 1,
    d = Ht(t, e),
    {
      mainAxis: f,
      crossAxis: p,
      alignmentAxis: m,
    } = typeof d == `number`
      ? { mainAxis: d, crossAxis: 0, alignmentAxis: null }
      : { mainAxis: d.mainAxis || 0, crossAxis: d.crossAxis || 0, alignmentAxis: d.alignmentAxis };
  return (
    s && typeof m == `number` && (p = s === `end` ? m * -1 : m),
    c ? { x: p * u, y: f * l } : { x: f * l, y: p * u }
  );
}
var hn,
  gn,
  _n,
  vn,
  yn,
  bn,
  xn,
  Sn,
  Cn = e(() => {
    (dn(),
      (hn = 50),
      (gn = async (e, t, n) => {
        let {
            placement: r = `bottom`,
            strategy: i = `absolute`,
            middleware: a = [],
            platform: o,
          } = n,
          s = o.detectOverflow ? o : { ...o, detectOverflow: pn },
          c = await (o.isRTL == null ? void 0 : o.isRTL(t)),
          l = await o.getElementRects({ reference: e, floating: t, strategy: i }),
          { x: u, y: d } = fn(l, r, c),
          f = r,
          p = 0,
          m = {};
        for (let n = 0; n < a.length; n++) {
          let h = a[n];
          if (!h) continue;
          let { name: g, fn: _ } = h,
            {
              x: v,
              y,
              data: b,
              reset: x,
            } = await _({
              x: u,
              y: d,
              initialPlacement: r,
              placement: f,
              strategy: i,
              middlewareData: m,
              rects: l,
              platform: s,
              elements: { reference: e, floating: t },
            });
          ((u = v ?? u),
            (d = y ?? d),
            (m[g] = { ...m[g], ...b }),
            x &&
              p < hn &&
              (p++,
              typeof x == `object` &&
                (x.placement && (f = x.placement),
                x.rects &&
                  (l =
                    x.rects === !0
                      ? await o.getElementRects({ reference: e, floating: t, strategy: i })
                      : x.rects),
                ({ x: u, y: d } = fn(l, f, c))),
              (n = -1)));
        }
        return { x: u, y: d, placement: f, strategy: i, middlewareData: m };
      }),
      (_n = (e) => ({
        name: `arrow`,
        options: e,
        async fn(t) {
          let {
              x: n,
              y: r,
              placement: i,
              rects: a,
              platform: o,
              elements: s,
              middlewareData: c,
            } = t,
            { element: l, padding: u = 0 } = Ht(e, t) || {};
          if (l == null) return {};
          let d = tn(u),
            f = { x: n, y: r },
            p = qt(i),
            m = Kt(p),
            h = await o.getDimensions(l),
            g = p === `y`,
            _ = g ? `top` : `left`,
            v = g ? `bottom` : `right`,
            y = g ? `clientHeight` : `clientWidth`,
            b = a.reference[m] + a.reference[p] - f[p] - a.floating[m],
            x = f[p] - a.reference[p],
            S = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(l)),
            C = S ? S[y] : 0;
          (!C || !(await (o.isElement == null ? void 0 : o.isElement(S)))) &&
            (C = s.floating[y] || a.floating[m]);
          let w = b / 2 - x / 2,
            T = C / 2 - h[m] / 2 - 1,
            E = B(d[_], T),
            ee = B(d[v], T),
            D = C - h[m] - ee,
            O = C / 2 - h[m] / 2 + w,
            k = Vt(E, O, D),
            A =
              !c.arrow &&
              Wt(i) != null &&
              O !== k &&
              a.reference[m] / 2 - (O < E ? E : ee) - h[m] / 2 < 0,
            j = A ? (O < E ? O - E : O - D) : 0;
          return {
            [p]: f[p] + j,
            data: { [p]: k, centerOffset: O - k - j, ...(A && { alignmentOffset: j }) },
            reset: A,
          };
        },
      })),
      (vn = function (e) {
        return (
          e === void 0 && (e = {}),
          {
            name: `flip`,
            options: e,
            async fn(t) {
              var n;
              let {
                  placement: r,
                  middlewareData: i,
                  rects: a,
                  initialPlacement: o,
                  platform: s,
                  elements: c,
                } = t,
                {
                  mainAxis: l = !0,
                  crossAxis: u = !0,
                  fallbackPlacements: d,
                  fallbackStrategy: f = `bestFit`,
                  fallbackAxisSideDirection: p = `none`,
                  flipAlignment: m = !0,
                  ...h
                } = Ht(e, t);
              if ((n = i.arrow) != null && n.alignmentOffset) return {};
              let g = Ut(r),
                _ = z(o),
                v = Ut(o) === o,
                y = await (s.isRTL == null ? void 0 : s.isRTL(c.floating)),
                b = d || (v || !m ? [$t(o)] : Yt(o)),
                x = p !== `none`;
              !d && x && b.push(...Qt(o, m, p, y));
              let S = [o, ...b],
                C = await s.detectOverflow(t, h),
                w = [],
                T = i.flip?.overflows || [];
              if ((l && w.push(C[g]), u)) {
                let e = Jt(r, a, y);
                w.push(C[e[0]], C[e[1]]);
              }
              if (((T = [...T, { placement: r, overflows: w }]), !w.every((e) => e <= 0))) {
                let e = (i.flip?.index || 0) + 1,
                  t = S[e];
                if (
                  t &&
                  (!(u === `alignment` && _ !== z(t)) ||
                    T.every((e) => (z(e.placement) === _ ? e.overflows[0] > 0 : !0)))
                )
                  return { data: { index: e, overflows: T }, reset: { placement: t } };
                let n = T.filter((e) => e.overflows[0] <= 0).sort(
                  (e, t) => e.overflows[1] - t.overflows[1],
                )[0]?.placement;
                if (!n)
                  switch (f) {
                    case `bestFit`: {
                      let e = T.filter((e) => {
                        if (x) {
                          let t = z(e.placement);
                          return t === _ || t === `y`;
                        }
                        return !0;
                      })
                        .map((e) => [
                          e.placement,
                          e.overflows.filter((e) => e > 0).reduce((e, t) => e + t, 0),
                        ])
                        .sort((e, t) => e[1] - t[1])[0]?.[0];
                      e && (n = e);
                      break;
                    }
                    case `initialPlacement`:
                      n = o;
                      break;
                  }
                if (r !== n) return { reset: { placement: n } };
              }
              return {};
            },
          }
        );
      }),
      (yn = new Set([`left`, `top`])),
      (bn = function (e) {
        return (
          e === void 0 && (e = 0),
          {
            name: `offset`,
            options: e,
            async fn(t) {
              var n;
              let { x: r, y: i, placement: a, middlewareData: o } = t,
                s = await mn(t, e);
              return a === o.offset?.placement && (n = o.arrow) != null && n.alignmentOffset
                ? {}
                : { x: r + s.x, y: i + s.y, data: { ...s, placement: a } };
            },
          }
        );
      }),
      (xn = function (e) {
        return (
          e === void 0 && (e = {}),
          {
            name: `shift`,
            options: e,
            async fn(t) {
              let { x: n, y: r, placement: i, platform: a } = t,
                {
                  mainAxis: o = !0,
                  crossAxis: s = !1,
                  limiter: c = {
                    fn: (e) => {
                      let { x: t, y: n } = e;
                      return { x: t, y: n };
                    },
                  },
                  ...l
                } = Ht(e, t),
                u = { x: n, y: r },
                d = await a.detectOverflow(t, l),
                f = z(i),
                p = Gt(f),
                m = u[p],
                h = u[f],
                g = (e, t) =>
                  Vt(t + d[e === `y` ? `top` : `left`], t, t - d[e === `y` ? `bottom` : `right`]);
              (o && (m = g(p, m)), s && (h = g(f, h)));
              let _ = c.fn({ ...t, [p]: m, [f]: h });
              return { ..._, data: { x: _.x - n, y: _.y - r, enabled: { [p]: o, [f]: s } } };
            },
          }
        );
      }),
      (Sn = function (e) {
        return (
          e === void 0 && (e = {}),
          {
            name: `size`,
            options: e,
            async fn(t) {
              let { placement: n, rects: r, platform: i, elements: a } = t,
                { apply: o = () => {}, ...s } = Ht(e, t),
                c = await i.detectOverflow(t, s),
                l = Ut(n),
                u = Wt(n),
                d = z(n) === `y`,
                { width: f, height: p } = r.floating,
                m,
                h;
              l === `top` || l === `bottom`
                ? ((m = l),
                  (h =
                    u ===
                    ((await (i.isRTL == null ? void 0 : i.isRTL(a.floating))) ? `start` : `end`)
                      ? `left`
                      : `right`))
                : ((h = l), (m = u === `end` ? `top` : `bottom`));
              let g = p - c.top - c.bottom,
                _ = f - c.left - c.right,
                v = B(p - c[m], g),
                y = B(f - c[h], _),
                b = t.middlewareData.shift,
                x = !b,
                S = v,
                C = y;
              (b != null && b.enabled.x && (C = _),
                b != null && b.enabled.y && (S = g),
                x &&
                  !u &&
                  (d ? (C = f - 2 * V(c.left, c.right)) : (S = p - 2 * V(c.top, c.bottom))),
                await o({ ...t, availableWidth: C, availableHeight: S }));
              let w = await i.getDimensions(a.floating);
              return f !== w.width || p !== w.height ? { reset: { rects: !0 } } : {};
            },
          }
        );
      }));
  });
function wn() {
  return typeof window < `u`;
}
function Tn(e) {
  return Dn(e) ? (e.nodeName || ``).toLowerCase() : `#document`;
}
function U(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function En(e) {
  return ((Dn(e) ? e.ownerDocument : e.document) || window.document)?.documentElement;
}
function Dn(e) {
  return wn() ? e instanceof Node || e instanceof U(e).Node : !1;
}
function W(e) {
  return wn() ? e instanceof Element || e instanceof U(e).Element : !1;
}
function On(e) {
  return wn() ? e instanceof HTMLElement || e instanceof U(e).HTMLElement : !1;
}
function kn(e) {
  return !wn() || typeof ShadowRoot > `u`
    ? !1
    : e instanceof ShadowRoot || e instanceof U(e).ShadowRoot;
}
function An(e) {
  let { overflow: t, overflowX: n, overflowY: r, display: i } = G(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && i !== `inline` && i !== `contents`;
}
function jn(e) {
  return /^(table|td|th)$/.test(Tn(e));
}
function Mn(e) {
  try {
    if (e.matches(`:popover-open`)) return !0;
  } catch {}
  try {
    return e.matches(`:modal`);
  } catch {
    return !1;
  }
}
function Nn(e) {
  let t = W(e) ? G(e) : e;
  return (
    Wn(t.transform) ||
    Wn(t.translate) ||
    Wn(t.scale) ||
    Wn(t.rotate) ||
    Wn(t.perspective) ||
    (!Fn() && (Wn(t.backdropFilter) || Wn(t.filter))) ||
    Hn.test(t.willChange || ``) ||
    Un.test(t.contain || ``)
  );
}
function Pn(e) {
  let t = Rn(e);
  for (; On(t) && !In(t);) {
    if (Nn(t)) return t;
    if (Mn(t)) return null;
    t = Rn(t);
  }
  return null;
}
function Fn() {
  return (
    (Gn ??= typeof CSS < `u` && CSS.supports && CSS.supports(`-webkit-backdrop-filter`, `none`)), Gn
  );
}
function In(e) {
  return /^(html|body|#document)$/.test(Tn(e));
}
function G(e) {
  return U(e).getComputedStyle(e);
}
function Ln(e) {
  return W(e)
    ? { scrollLeft: e.scrollLeft, scrollTop: e.scrollTop }
    : { scrollLeft: e.scrollX, scrollTop: e.scrollY };
}
function Rn(e) {
  if (Tn(e) === `html`) return e;
  let t = e.assignedSlot || e.parentNode || (kn(e) && e.host) || En(e);
  return kn(t) ? t.host : t;
}
function zn(e) {
  let t = Rn(e);
  return In(t) ? (e.ownerDocument || e).body : On(t) && An(t) ? t : zn(t);
}
function Bn(e, t, n) {
  (t === void 0 && (t = []), n === void 0 && (n = !0));
  let r = zn(e),
    i = r === e.ownerDocument?.body,
    a = U(r);
  if (i) {
    let e = Vn(a);
    return t.concat(a, a.visualViewport || [], An(r) ? r : [], e && n ? Bn(e) : []);
  } else return t.concat(r, Bn(r, [], n));
}
function Vn(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
var Hn,
  Un,
  Wn,
  Gn,
  Kn = e(() => {
    ((Hn = /transform|translate|scale|rotate|perspective|filter/),
      (Un = /paint|layout|strict|content/),
      (Wn = (e) => !!e && e !== `none`));
  });
function qn(e) {
  let t = G(e),
    n = parseFloat(t.width) || 0,
    r = parseFloat(t.height) || 0,
    i = On(e),
    a = i ? e.offsetWidth : n,
    o = i ? e.offsetHeight : r,
    s = rn(n) !== a || rn(r) !== o;
  return (s && ((n = a), (r = o)), { width: n, height: r, $: s });
}
function Jn(e) {
  return W(e) ? e : e.contextElement;
}
function Yn(e) {
  let t = Jn(e);
  if (!On(t)) return H(1);
  let n = t.getBoundingClientRect(),
    { width: r, height: i, $: a } = qn(t),
    o = (a ? rn(n.width) : n.width) / r,
    s = (a ? rn(n.height) : n.height) / i;
  return (
    (!o || !Number.isFinite(o)) && (o = 1), (!s || !Number.isFinite(s)) && (s = 1), { x: o, y: s }
  );
}
function Xn(e) {
  let t = U(e);
  return !Fn() || !t.visualViewport
    ? vr
    : { x: t.visualViewport.offsetLeft, y: t.visualViewport.offsetTop };
}
function Zn(e, t, n) {
  return (t === void 0 && (t = !1), !!n && t && n === U(e));
}
function Qn(e, t, n, r) {
  (t === void 0 && (t = !1), n === void 0 && (n = !1));
  let i = e.getBoundingClientRect(),
    a = Jn(e),
    o = H(1);
  t && (r ? W(r) && (o = Yn(r)) : (o = Yn(e)));
  let s = Zn(a, n, r) ? Xn(a) : H(0),
    c = (i.left + s.x) / o.x,
    l = (i.top + s.y) / o.y,
    u = i.width / o.x,
    d = i.height / o.y;
  if (a && r) {
    let e = U(a),
      t = W(r) ? U(r) : r,
      n = e,
      i = Vn(n);
    for (; i && t !== n;) {
      let e = Yn(i),
        t = i.getBoundingClientRect(),
        r = G(i),
        a = t.left + (i.clientLeft + parseFloat(r.paddingLeft)) * e.x,
        o = t.top + (i.clientTop + parseFloat(r.paddingTop)) * e.y;
      ((c *= e.x), (l *= e.y), (u *= e.x), (d *= e.y), (c += a), (l += o), (n = U(i)), (i = Vn(n)));
    }
  }
  return nn({ width: u, height: d, x: c, y: l });
}
function $n(e, t) {
  let n = Ln(e).scrollLeft;
  return t ? t.left + n : Qn(En(e)).left + n;
}
function er(e, t) {
  let n = e.getBoundingClientRect();
  return { x: n.left + t.scrollLeft - $n(e, n), y: n.top + t.scrollTop };
}
function tr(e) {
  let { elements: t, rect: n, offsetParent: r, strategy: i } = e,
    a = i === `fixed`,
    o = En(r),
    s = t ? Mn(t.floating) : !1;
  if (r === o || (s && a)) return n;
  let c = { scrollLeft: 0, scrollTop: 0 },
    l = H(1),
    u = H(0),
    d = On(r);
  if ((d || !a) && ((Tn(r) !== `body` || An(o)) && (c = Ln(r)), d)) {
    let e = Qn(r);
    ((l = Yn(r)), (u.x = e.x + r.clientLeft), (u.y = e.y + r.clientTop));
  }
  let f = o && !d && !a ? er(o, c) : H(0);
  return {
    width: n.width * l.x,
    height: n.height * l.y,
    x: n.x * l.x - c.scrollLeft * l.x + u.x + f.x,
    y: n.y * l.y - c.scrollTop * l.y + u.y + f.y,
  };
}
function nr(e) {
  return e.getClientRects ? Array.from(e.getClientRects()) : [];
}
function rr(e) {
  let t = Ln(e),
    n = e.ownerDocument.body,
    r = V(e.scrollWidth, e.clientWidth, n.scrollWidth, n.clientWidth),
    i = V(e.scrollHeight, e.clientHeight, n.scrollHeight, n.clientHeight),
    a = -t.scrollLeft + $n(e),
    o = -t.scrollTop;
  return (
    G(n).direction === `rtl` && (a += V(e.clientWidth, n.clientWidth) - r),
    { width: r, height: i, x: a, y: o }
  );
}
function ir(e, t, n) {
  n === void 0 && (n = `viewport`);
  let r = n === `layoutViewport`,
    i = U(e),
    a = En(e),
    o = i.visualViewport,
    s = a.clientWidth,
    c = a.clientHeight,
    l = 0,
    u = 0;
  if (o) {
    let e = !Fn() || t === `fixed`;
    r
      ? e || ((l = -o.offsetLeft), (u = -o.offsetTop))
      : ((s = o.width), (c = o.height), e && ((l = o.offsetLeft), (u = o.offsetTop)));
  }
  if ($n(a) <= 0) {
    let e = a.ownerDocument,
      t = e.body,
      n = getComputedStyle(t),
      r =
        (e.compatMode === `CSS1Compat` && parseFloat(n.marginLeft) + parseFloat(n.marginRight)) ||
        0,
      i = Math.abs(a.clientWidth - t.clientWidth - r),
      o = getComputedStyle(a).scrollbarGutter === `stable both-edges` ? i / 2 : i;
    o <= yr && (s -= o);
  }
  return { width: s, height: c, x: l, y: u };
}
function ar(e, t) {
  let n = Qn(e, !0, t === `fixed`),
    r = n.top + e.clientTop,
    i = n.left + e.clientLeft,
    a = Yn(e);
  return { width: e.clientWidth * a.x, height: e.clientHeight * a.y, x: i * a.x, y: r * a.y };
}
function or(e, t, n) {
  let r;
  if (t === `viewport` || t === `layoutViewport`) r = ir(e, n, t);
  else if (t === `document`) r = rr(En(e));
  else if (W(t)) r = ar(t, n);
  else {
    let n = Xn(e);
    r = { x: t.x - n.x, y: t.y - n.y, width: t.width, height: t.height };
  }
  return nn(r);
}
function sr(e, t) {
  let n = t.get(e);
  if (n) return n;
  let r = Bn(e, [], !1).filter((e) => W(e) && Tn(e) !== `body`),
    i = null,
    a = G(e).position === `fixed`,
    o = a ? Rn(e) : e;
  for (; W(o) && !In(o);) {
    let e = G(o),
      t = Nn(o),
      n = i ? i.position : a ? `fixed` : ``;
    (!t && (n === `fixed` || (n === `absolute` && e.position === `static`))
      ? (r = r.filter((e) => e !== o))
      : (i = e),
      (o = Rn(o)));
  }
  return (t.set(e, r), r);
}
function cr(e) {
  let { element: t, boundary: n, rootBoundary: r, strategy: i } = e,
    a = [...(n === `clippingAncestors` ? (Mn(t) ? [] : sr(t, this._c)) : [].concat(n)), r],
    o = or(t, a[0], i),
    s = o.top,
    c = o.right,
    l = o.bottom,
    u = o.left;
  for (let e = 1; e < a.length; e++) {
    let n = or(t, a[e], i);
    ((s = V(n.top, s)), (c = B(n.right, c)), (l = B(n.bottom, l)), (u = V(n.left, u)));
  }
  return { width: c - u, height: l - s, x: u, y: s };
}
function lr(e) {
  let { width: t, height: n } = qn(e);
  return { width: t, height: n };
}
function ur(e, t, n) {
  let r = On(t),
    i = En(t),
    a = n === `fixed`,
    o = Qn(e, !0, a, t),
    s = { scrollLeft: 0, scrollTop: 0 },
    c = H(0);
  if ((r || !a) && ((Tn(t) !== `body` || An(i)) && (s = Ln(t)), r)) {
    let e = Qn(t, !0, a, t);
    ((c.x = e.x + t.clientLeft), (c.y = e.y + t.clientTop));
  }
  !r && i && (c.x = $n(i));
  let l = i && !r && !a ? er(i, s) : H(0);
  return {
    x: o.left + s.scrollLeft - c.x - l.x,
    y: o.top + s.scrollTop - c.y - l.y,
    width: o.width,
    height: o.height,
  };
}
function dr(e) {
  return G(e).position === `static`;
}
function fr(e, t) {
  if (!On(e) || G(e).position === `fixed`) return null;
  if (t) return t(e);
  let n = e.offsetParent;
  return (En(e) === n && (n = n.ownerDocument.body), n);
}
function pr(e, t) {
  let n = U(e);
  if (Mn(e)) return n;
  if (!On(e)) {
    let t = Rn(e);
    for (; t && !In(t);) {
      if (W(t) && !dr(t)) return t;
      t = Rn(t);
    }
    return n;
  }
  let r = fr(e, t);
  for (; r && jn(r) && dr(r);) r = fr(r, t);
  return r && In(r) && dr(r) && !Nn(r) ? n : r || Pn(e) || n;
}
function mr(e) {
  return G(e).direction === `rtl`;
}
function hr(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function gr(e, t, n) {
  let r = null,
    i,
    a = En(e);
  function o() {
    var e;
    (clearTimeout(i), (e = r) == null || e.disconnect(), (r = null));
  }
  function s(n, c) {
    (n === void 0 && (n = !1), c === void 0 && (c = 1), o());
    let l = e.getBoundingClientRect(),
      { left: u, top: d, width: f, height: p } = l;
    if ((n || t(), !f || !p)) return;
    let m = an(d),
      h = an(a.clientWidth - (u + f)),
      g = an(a.clientHeight - (d + p)),
      _ = an(u),
      v = {
        rootMargin: -m + `px ` + -h + `px ` + -g + `px ` + -_ + `px`,
        threshold: V(0, B(1, c)) || 1,
      },
      y = !0;
    function b(t) {
      let n = t[0].intersectionRatio;
      if (!hr(l, e.getBoundingClientRect())) return s();
      if (n !== c) {
        if (!y) return s();
        n
          ? s(!1, n)
          : (i = setTimeout(() => {
              s(!1, 1e-7);
            }, 1e3));
      }
      y = !1;
    }
    try {
      r = new IntersectionObserver(b, { ...v, root: a.ownerDocument });
    } catch {
      r = new IntersectionObserver(b, v);
    }
    r.observe(e);
  }
  let c = U(e),
    l = () => s(n);
  return (
    c.addEventListener(`resize`, l),
    s(!0),
    () => {
      (c.removeEventListener(`resize`, l), o());
    }
  );
}
function _r(e, t, n, r) {
  r === void 0 && (r = {});
  let {
      ancestorScroll: i = !0,
      ancestorResize: a = !0,
      elementResize: o = typeof ResizeObserver == `function`,
      layoutShift: s = typeof IntersectionObserver == `function`,
      animationFrame: c = !1,
    } = r,
    l = Jn(e),
    u = i || a ? [...(l ? Bn(l) : []), ...(t ? Bn(t) : [])] : [];
  u.forEach((e) => {
    (i && e.addEventListener(`scroll`, n), a && e.addEventListener(`resize`, n));
  });
  let d = l && s ? gr(l, n, a) : null,
    f = -1,
    p = null;
  o &&
    ((p = new ResizeObserver((e) => {
      let [r] = e;
      (r &&
        r.target === l &&
        p &&
        t &&
        (p.unobserve(t),
        cancelAnimationFrame(f),
        (f = requestAnimationFrame(() => {
          var e;
          (e = p) == null || e.observe(t);
        }))),
        n());
    })),
    l && !c && p.observe(l),
    t && p.observe(t));
  let m,
    h = c ? Qn(e) : null;
  c && g();
  function g() {
    let t = Qn(e);
    (h && !hr(h, t) && n(), (h = t), (m = requestAnimationFrame(g)));
  }
  return (
    n(),
    () => {
      var e;
      (u.forEach((e) => {
        (i && e.removeEventListener(`scroll`, n), a && e.removeEventListener(`resize`, n));
      }),
        d?.(),
        (e = p) == null || e.disconnect(),
        (p = null),
        c && cancelAnimationFrame(m));
    }
  );
}
var vr,
  yr,
  br,
  xr,
  Sr,
  Cr,
  wr,
  Tr,
  Er,
  Dr,
  Or = e(() => {
    (Cn(),
      dn(),
      Kn(),
      (vr = H(0)),
      (yr = 25),
      (br = async function (e) {
        let t = this.getOffsetParent || pr,
          n = this.getDimensions,
          r = await n(e.floating);
        return {
          reference: ur(e.reference, await t(e.floating), e.strategy),
          floating: { x: 0, y: 0, width: r.width, height: r.height },
        };
      }),
      (xr = {
        convertOffsetParentRelativeRectToViewportRelativeRect: tr,
        getDocumentElement: En,
        getClippingRect: cr,
        getOffsetParent: pr,
        getElementRects: br,
        getClientRects: nr,
        getDimensions: lr,
        getScale: Yn,
        isElement: W,
        isRTL: mr,
      }),
      (Sr = bn),
      (Cr = xn),
      (wr = vn),
      (Tr = Sn),
      (Er = _n),
      (Dr = (e, t, n) => {
        let r = new Map(),
          i = n ?? {},
          a = { ...xr, ...i.platform, _c: r };
        return gn(e, t, { ...i, platform: a });
      }));
  }),
  kr,
  K,
  Ar = e(() => {
    (Le(),
      ze(),
      Ve(),
      Ue(),
      Ge(),
      qe(),
      Ye(),
      et(),
      ot(),
      ut(),
      ft(),
      pt(),
      mt(),
      L(),
      R(),
      F(),
      Or(),
      m(),
      i(),
      (kr = new Set()),
      (K = class extends I {
        constructor() {
          (super(...arguments),
            (this.submenuCleanups = new Map()),
            (this.localize = new Bt(this)),
            (this.userTypedQuery = ``),
            (this.openSubmenuStack = []),
            (this.open = !1),
            (this.size = `m`),
            (this.placement = `bottom-start`),
            (this.distance = 0),
            (this.skidding = 0),
            (this.handleDocumentKeyDown = async (e) => {
              let t = this.localize.dir() === `rtl`;
              if (e.key === `Escape` && this.open && Qe(this)) {
                let t = this.getTrigger();
                (e.preventDefault(),
                  e.stopPropagation(),
                  (this.open = !1),
                  t?.focus({ preventScroll: !0 }));
                return;
              }
              let n = [...Re()].find((e) => e.localName === `wa-dropdown-item`),
                r = n?.localName === `wa-dropdown-item`,
                i = this.getCurrentSubmenuItem(),
                a = !!i,
                o,
                s,
                c;
              a
                ? ((o = this.getSubmenuItems(i)),
                  (s = o.find((e) => e.active || e === n)),
                  (c = s ? o.indexOf(s) : -1))
                : ((o = this.getItems()),
                  (s = o.find((e) => e.active || e === n)),
                  (c = s ? o.indexOf(s) : -1));
              let l;
              if (
                (e.key === `ArrowUp` &&
                  (e.preventDefault(),
                  e.stopPropagation(),
                  (l = c > 0 ? o[c - 1] : o[o.length - 1])),
                e.key === `ArrowDown` &&
                  (e.preventDefault(),
                  e.stopPropagation(),
                  (l = c !== -1 && c < o.length - 1 ? o[c + 1] : o[0])),
                e.key === (t ? `ArrowLeft` : `ArrowRight`) && r && s && s.hasSubmenu)
              ) {
                (e.preventDefault(),
                  e.stopPropagation(),
                  (s.submenuOpen = !0),
                  this.addToSubmenuStack(s),
                  setTimeout(() => {
                    let e = this.getSubmenuItems(s);
                    e.length > 0 &&
                      (e.forEach((e, t) => (e.active = t === 0)),
                      e[0].focus({ preventScroll: !0 }));
                  }, 0));
                return;
              }
              if (e.key === (t ? `ArrowRight` : `ArrowLeft`) && a) {
                (e.preventDefault(), e.stopPropagation());
                let t = this.removeFromSubmenuStack();
                t &&
                  ((t.submenuOpen = !1),
                  setTimeout(() => {
                    (t.focus({ preventScroll: !0 }),
                      (t.active = !0),
                      (t.slot === `submenu`
                        ? this.getSubmenuItems(t.parentElement)
                        : this.getItems()
                      ).forEach((e) => {
                        e !== t && (e.active = !1);
                      }));
                  }, 0));
                return;
              }
              if (
                ((e.key === `Home` || e.key === `End`) &&
                  (e.preventDefault(),
                  e.stopPropagation(),
                  (l = e.key === `Home` ? o[0] : o[o.length - 1])),
                e.key === `Tab` && (await this.hideMenu()),
                e.key.length === 1 &&
                  !(e.metaKey || e.ctrlKey || e.altKey) &&
                  !(e.key === ` ` && this.userTypedQuery === ``) &&
                  (clearTimeout(this.userTypedTimeout),
                  (this.userTypedTimeout = setTimeout(() => {
                    this.userTypedQuery = ``;
                  }, 1e3)),
                  (this.userTypedQuery += e.key),
                  o.some((e) => {
                    let t = (e.textContent || ``).trim().toLowerCase(),
                      n = this.userTypedQuery.trim().toLowerCase();
                    return t.startsWith(n) ? ((l = e), !0) : !1;
                  })),
                l)
              ) {
                (e.preventDefault(),
                  e.stopPropagation(),
                  o.forEach((e) => (e.active = e === l)),
                  l.focus({ preventScroll: !0 }),
                  l.scrollIntoView({ block: `nearest` }));
                return;
              }
              (e.key === `Enter` || (e.key === ` ` && this.userTypedQuery === ``)) &&
                r &&
                s &&
                (e.preventDefault(),
                e.stopPropagation(),
                s.hasSubmenu
                  ? ((s.submenuOpen = !0),
                    this.addToSubmenuStack(s),
                    setTimeout(() => {
                      let e = this.getSubmenuItems(s);
                      e.length > 0 &&
                        (e.forEach((e, t) => (e.active = t === 0)),
                        e[0].focus({ preventScroll: !0 }));
                    }, 0))
                  : this.makeSelection(s));
            }),
            (this.handleDocumentPointerDown = (e) => {
              e
                .composedPath()
                .some((e) =>
                  e instanceof HTMLElement
                    ? e === this || e.closest(`wa-dropdown, [part="submenu"]`)
                    : !1,
                ) || (this.open = !1);
            }),
            (this.handleGlobalMouseMove = (e) => {
              let t = this.getCurrentSubmenuItem();
              if (!t?.submenuOpen || !t.submenuElement) return;
              let n = t.submenuElement.getBoundingClientRect(),
                r = this.localize.dir() === `rtl`,
                i = r ? n.right : n.left,
                a = r ? Math.max(e.clientX, i) : Math.min(e.clientX, i),
                o = Math.max(n.top, Math.min(e.clientY, n.bottom));
              (t.submenuElement.style.setProperty(`--safe-triangle-cursor-x`, `${a}px`),
                t.submenuElement.style.setProperty(`--safe-triangle-cursor-y`, `${o}px`));
              let s = e.composedPath(),
                c = t.matches(`:hover`),
                l = !!t.submenuElement?.matches(`:hover`),
                u = c || !!s.find((e) => e === t),
                d =
                  l ||
                  !!s.find(
                    (e) =>
                      e instanceof HTMLElement &&
                      e.closest(`[part="submenu"]`) === t.submenuElement,
                  );
              !u &&
                !d &&
                setTimeout(() => {
                  !c && !l && (t.submenuOpen = !1);
                }, 100);
            }));
        }
        handleSizeChange() {
          st(this.localName, this.size);
        }
        disconnectedCallback() {
          (super.disconnectedCallback(),
            clearInterval(this.userTypedTimeout),
            this.closeAllSubmenus(),
            this.submenuCleanups.forEach((e) => e()),
            this.submenuCleanups.clear(),
            document.removeEventListener(`mousemove`, this.handleGlobalMouseMove),
            document.removeEventListener(`keydown`, this.handleDocumentKeyDown),
            document.removeEventListener(`pointerdown`, this.handleDocumentPointerDown),
            Ze(this));
        }
        firstUpdated() {
          this.syncAriaAttributes();
        }
        async updated(e) {
          if (e.has(`open`)) {
            let t = e.get(`open`);
            if (t === this.open || (t === void 0 && this.open === !1)) return;
            (this.customStates.set(`open`, this.open),
              this.open ? await this.showMenu() : (this.closeAllSubmenus(), await this.hideMenu()));
          }
          e.has(`size`) && this.syncItemSizes();
        }
        getItems(e = !1) {
          let t = (this.defaultSlot?.assignedElements({ flatten: !0 }) ?? []).filter(
            (e) => e.localName === `wa-dropdown-item`,
          );
          return e ? t : t.filter((e) => !e.disabled);
        }
        getSubmenuItems(e, t = !1) {
          let n =
            e.shadowRoot?.querySelector(`slot[name="submenu"]`) ||
            e.querySelector(`slot[name="submenu"]`);
          if (!n) return [];
          let r = n
            .assignedElements({ flatten: !0 })
            .filter((e) => e.localName === `wa-dropdown-item`);
          return t ? r : r.filter((e) => !e.disabled);
        }
        syncItemSizes() {
          (this.defaultSlot?.assignedElements({ flatten: !0 }) ?? [])
            .filter((e) => e.localName === `wa-dropdown-item`)
            .forEach((e) => (e.size = this.size));
        }
        addToSubmenuStack(e) {
          let t = this.openSubmenuStack.indexOf(e);
          t === -1
            ? this.openSubmenuStack.push(e)
            : (this.openSubmenuStack = this.openSubmenuStack.slice(0, t + 1));
        }
        removeFromSubmenuStack() {
          return this.openSubmenuStack.pop();
        }
        getCurrentSubmenuItem() {
          return this.openSubmenuStack.length > 0
            ? this.openSubmenuStack[this.openSubmenuStack.length - 1]
            : void 0;
        }
        closeAllSubmenus() {
          (this.getItems(!0).forEach((e) => {
            e.submenuOpen = !1;
          }),
            (this.openSubmenuStack = []));
        }
        closeSiblingSubmenus(e) {
          let t = e.closest(`wa-dropdown-item:not([slot="submenu"])`),
            n;
          ((n = t ? this.getSubmenuItems(t, !0) : this.getItems(!0)),
            n.forEach((t) => {
              t !== e && t.submenuOpen && (t.submenuOpen = !1);
            }),
            this.openSubmenuStack.includes(e) || this.openSubmenuStack.push(e));
        }
        getTrigger() {
          return this.querySelector(`[slot="trigger"]`);
        }
        async showMenu() {
          if (!this.getTrigger() || !this.popup || !this.menu) return;
          let e = new He();
          if ((this.dispatchEvent(e), e.defaultPrevented)) {
            this.open = !1;
            return;
          }
          if (this.popup.active) return;
          (kr.forEach((e) => (e.open = !1)),
            (this.popup.active = !0),
            (this.open = !0),
            kr.add(this),
            Xe(this),
            this.syncAriaAttributes(),
            document.addEventListener(`keydown`, this.handleDocumentKeyDown),
            document.addEventListener(`pointerdown`, this.handleDocumentPointerDown),
            document.addEventListener(`mousemove`, this.handleGlobalMouseMove),
            this.menu.classList.remove(`hide`),
            await M(this.menu, `show`));
          let t = this.getItems();
          (t.length > 0 &&
            (t.forEach((e, t) => (e.active = t === 0)), t[0].focus({ preventScroll: !0 })),
            this.dispatchEvent(new Ke()));
        }
        async hideMenu() {
          if (!this.popup || !this.menu) return;
          let e = new We({ source: this });
          if ((this.dispatchEvent(e), e.defaultPrevented)) {
            this.open = !0;
            return;
          }
          ((this.open = !1),
            kr.delete(this),
            Ze(this),
            this.syncAriaAttributes(),
            document.removeEventListener(`keydown`, this.handleDocumentKeyDown),
            document.removeEventListener(`pointerdown`, this.handleDocumentPointerDown),
            document.removeEventListener(`mousemove`, this.handleGlobalMouseMove),
            this.menu.classList.remove(`show`),
            await M(this.menu, `hide`),
            (this.popup.active = this.open),
            this.dispatchEvent(new Je()));
        }
        handleMenuClick(e) {
          let t = e.target.closest(`wa-dropdown-item`);
          if (!(!t || t.disabled)) {
            if (t.hasSubmenu) {
              ((t.submenuOpen ||= (this.closeSiblingSubmenus(t), this.addToSubmenuStack(t), !0)),
                e.stopPropagation());
              return;
            }
            this.makeSelection(t);
          }
        }
        async handleMenuSlotChange() {
          let e = this.getItems(!0);
          (await Promise.all(e.map((e) => e.updateComplete)), this.syncItemSizes());
          let t = e.some((e) => e.type === `checkbox`),
            n = e.some((e) => e.hasSubmenu);
          e.forEach((e, r) => {
            ((e.active = r === 0), (e.checkboxAdjacent = t), (e.submenuAdjacent = n));
          });
        }
        handleTriggerClick() {
          this.open = !this.open;
        }
        handleSubmenuOpening(e) {
          let t = e.detail.item;
          (this.closeSiblingSubmenus(t),
            this.addToSubmenuStack(t),
            this.setupSubmenuPosition(t),
            this.processSubmenuItems(t));
        }
        setupSubmenuPosition(e) {
          if (!e.submenuElement) return;
          this.cleanupSubmenuPosition(e);
          let t = _r(e, e.submenuElement, () => {
            (this.positionSubmenu(e), this.updateSafeTriangleCoordinates(e));
          });
          this.submenuCleanups.set(e, t);
          let n = e.submenuElement.querySelector(`slot[name="submenu"]`);
          n &&
            (n.removeEventListener(`slotchange`, K.handleSubmenuSlotChange),
            n.addEventListener(`slotchange`, K.handleSubmenuSlotChange),
            K.handleSubmenuSlotChange({ target: n }));
        }
        static handleSubmenuSlotChange(e) {
          let t = e.target;
          if (!t) return;
          let n = t.assignedElements().filter((e) => e.localName === `wa-dropdown-item`);
          if (n.length === 0) return;
          let r = n.some((e) => e.hasSubmenu),
            i = n.some((e) => e.type === `checkbox`);
          n.forEach((e) => {
            ((e.submenuAdjacent = r), (e.checkboxAdjacent = i));
          });
        }
        processSubmenuItems(e) {
          if (!e.submenuElement) return;
          let t = this.getSubmenuItems(e, !0),
            n = t.some((e) => e.hasSubmenu);
          t.forEach((e) => {
            e.submenuAdjacent = n;
          });
        }
        cleanupSubmenuPosition(e) {
          let t = this.submenuCleanups.get(e);
          t && (t(), this.submenuCleanups.delete(e));
        }
        positionSubmenu(e) {
          if (!e.submenuElement) return;
          let t = this.localize.dir() === `rtl` ? `left-start` : `right-start`;
          Dr(e, e.submenuElement, {
            placement: t,
            middleware: [
              Sr({ mainAxis: 0, crossAxis: -5 }),
              wr({ fallbackStrategy: `bestFit` }),
              Cr({ padding: 8 }),
            ],
          }).then(({ x: t, y: n, placement: r }) => {
            (e.submenuElement.setAttribute(`data-placement`, r),
              Object.assign(e.submenuElement.style, { left: `${t}px`, top: `${n}px` }));
          });
        }
        updateSafeTriangleCoordinates(e) {
          if (!e.submenuElement || !e.submenuOpen) return;
          if (document.activeElement?.matches(`:focus-visible`)) {
            e.submenuElement.style.setProperty(`--safe-triangle-visible`, `none`);
            return;
          }
          e.submenuElement.style.setProperty(`--safe-triangle-visible`, `block`);
          let t = e.submenuElement.getBoundingClientRect(),
            n = this.localize.dir() === `rtl`;
          (e.submenuElement.style.setProperty(
            `--safe-triangle-submenu-start-x`,
            `${n ? t.right : t.left}px`,
          ),
            e.submenuElement.style.setProperty(`--safe-triangle-submenu-start-y`, `${t.top}px`),
            e.submenuElement.style.setProperty(
              `--safe-triangle-submenu-end-x`,
              `${n ? t.right : t.left}px`,
            ),
            e.submenuElement.style.setProperty(`--safe-triangle-submenu-end-y`, `${t.bottom}px`));
        }
        makeSelection(e) {
          let t = this.getTrigger();
          if (e.disabled) return;
          e.type === `checkbox` && (e.checked = !e.checked);
          let n = new Ie({ item: e });
          (this.dispatchEvent(n),
            n.defaultPrevented || ((this.open = !1), t?.focus({ preventScroll: !0 })));
        }
        async syncAriaAttributes() {
          let e = this.getTrigger(),
            t;
          e &&
            (e.localName === `wa-button`
              ? (await customElements.whenDefined(`wa-button`),
                await e.updateComplete,
                (t = e.shadowRoot.querySelector(`[part="base"]`)))
              : (t = e),
            t.hasAttribute(`id`) || t.setAttribute(`id`, at(`wa-dropdown-trigger-`)),
            t.setAttribute(`aria-haspopup`, `menu`),
            t.setAttribute(`aria-expanded`, this.open ? `true` : `false`),
            this.menu?.setAttribute(`aria-expanded`, `false`));
        }
        render() {
          let e = this.didSSR && !this.hasUpdated ? this.open : this.popup?.active;
          return f`
      <wa-popup
        placement=${this.placement}
        distance=${this.distance}
        skidding=${this.skidding}
        ?active=${e}
        flip
        flip-fallback-strategy="best-fit"
        shift
        shift-padding="10"
        auto-size="vertical"
        auto-size-padding="10"
      >
        <slot
          name="trigger"
          slot="anchor"
          @click=${this.handleTriggerClick}
          @slotchange=${this.syncAriaAttributes}
        ></slot>
        <div
          id="menu"
          part="menu"
          role="menu"
          tabindex="-1"
          aria-orientation="vertical"
          @click=${this.handleMenuClick}
          @submenu-opening=${this.handleSubmenuOpening}
        >
          <slot @slotchange=${this.handleMenuSlotChange}></slot>
        </div>
      </wa-popup>
    `;
        }
      }),
      (K.css = [dt, Be]),
      P([o(`slot:not([name])`)], K.prototype, `defaultSlot`, 2),
      P([o(`#menu`)], K.prototype, `menu`, 2),
      P([o(`wa-popup`)], K.prototype, `popup`, 2),
      P([d({ type: Boolean, reflect: !0 })], K.prototype, `open`, 2),
      P([d({ reflect: !0 })], K.prototype, `size`, 2),
      P([N(`size`)], K.prototype, `handleSizeChange`, 1),
      P([d({ reflect: !0 })], K.prototype, `placement`, 2),
      P([d({ type: Number })], K.prototype, `distance`, 2),
      P([d({ type: Number })], K.prototype, `skidding`, 2),
      (K = P([t(`wa-dropdown`)], K)));
  }),
  jr,
  Mr = e(() => {
    (m(),
      (jr = b`
  :host {
    display: flex;
    position: relative;
    align-items: center;
    padding: 0.5em 1em;
    border-radius: var(--wa-border-radius-s);
    isolation: isolate;
    color: var(--wa-color-text-normal);
    line-height: var(--wa-line-height-condensed);
    cursor: pointer;
    transition:
      var(--wa-transition-fast) background-color var(--wa-transition-easing),
      var(--wa-transition-fast) color var(--wa-transition-easing);
  }

  @media (hover: hover) {
    :host(:hover:not(:state(disabled))) {
      background-color: var(--wa-color-neutral-fill-normal);
    }
  }

  :host(:state(submenu-open)) {
    background-color: var(--wa-color-neutral-fill-normal);
  }

  :host(:focus-visible) {
    z-index: 1;
    outline: var(--wa-focus-ring);
    background-color: var(--wa-color-neutral-fill-normal);
  }

  :host(:state(disabled)),
  :host([disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Danger variant */
  :host([variant='danger']),
  :host([variant='danger']) #details {
    color: var(--wa-color-danger-on-quiet);
  }

  @media (hover: hover) {
    :host([variant='danger']:hover) {
      background-color: var(--wa-color-danger-fill-normal);
      color: var(--wa-color-danger-on-normal);
    }
  }

  :host([variant='danger']:state(submenu-open)),
  :host([variant='danger']:focus-visible) {
    background-color: var(--wa-color-danger-fill-normal);
    color: var(--wa-color-danger-on-normal);
  }

  :host([checkbox-adjacent]) {
    padding-inline-start: 2em;
  }

  /* Only add padding when item actually has a submenu */
  :host([submenu-adjacent]:not(:state(has-submenu))) #details {
    padding-inline-end: 0;
  }

  :host(:state(has-submenu)[submenu-adjacent]) #details {
    padding-inline-end: 1.75em;
  }

  #check {
    visibility: hidden;
    margin-inline-start: -1.5em;
    margin-inline-end: 0.5em;
    font-size: var(--wa-font-size-smaller);
  }

  :host(:state(checked)) #check {
    visibility: visible;
  }

  #icon ::slotted(*) {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    margin-inline-end: 0.75em !important;
    font-size: var(--wa-font-size-smaller);
  }

  #label {
    flex: 1 1 auto;
    min-width: 0;
  }

  #details {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: end;
    color: var(--wa-color-text-quiet);
    font-size: var(--wa-font-size-smaller) !important;
  }

  #details ::slotted(*) {
    margin-inline-start: 2em !important;
  }

  /* Submenu indicator icon */
  #submenu-indicator {
    position: absolute;
    inset-inline-end: 1em;
    color: var(--wa-color-neutral-on-quiet);
    font-size: var(--wa-font-size-smaller);
  }

  /* Flip chevron icon when RTL */
  :host(:dir(rtl)) #submenu-indicator {
    transform: scaleX(-1);
  }

  /* Submenu styles */
  #submenu {
    display: flex;
    z-index: 10;
    position: absolute;
    top: 0;
    left: 0;
    flex-direction: column;
    width: max-content;
    margin: 0;
    padding: 0.25em;
    border: var(--wa-border-style) var(--wa-border-width-s) var(--wa-color-surface-border);
    border-radius: var(--wa-border-radius-m);
    background-color: var(--wa-color-surface-raised);
    box-shadow: var(--wa-shadow-m);
    color: var(--wa-color-text-normal);
    text-align: start;
    user-select: none;

    /* Override default popover styles */
    &[popover] {
      margin: 0;
      inset: auto;
      padding: 0.25em;
      overflow: visible;
      border-radius: var(--wa-border-radius-m);
    }

    &.show {
      animation: submenu-show var(--show-duration, var(--wa-transition-fast)) ease;
    }

    &.hide {
      animation: submenu-show var(--show-duration, var(--wa-transition-fast)) ease reverse;
    }

    /* Submenu placement transform origins */
    &[data-placement^='top'] {
      transform-origin: bottom;
    }

    &[data-placement^='bottom'] {
      transform-origin: top;
    }

    &[data-placement^='left'] {
      transform-origin: right;
    }

    &[data-placement^='right'] {
      transform-origin: left;
    }

    &[data-placement='left-start'] {
      transform-origin: right top;
    }

    &[data-placement='left-end'] {
      transform-origin: right bottom;
    }

    &[data-placement='right-start'] {
      transform-origin: left top;
    }

    &[data-placement='right-end'] {
      transform-origin: left bottom;
    }

    /* Safe triangle styling */
    &::before {
      display: none;
      z-index: 9;
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: transparent;
      content: '';
      clip-path: polygon(
        var(--safe-triangle-cursor-x, 0) var(--safe-triangle-cursor-y, 0),
        var(--safe-triangle-submenu-start-x, 0) var(--safe-triangle-submenu-start-y, 0),
        var(--safe-triangle-submenu-end-x, 0) var(--safe-triangle-submenu-end-y, 0)
      );
      pointer-events: auto; /* Enable mouse events on the triangle */
    }

    &[data-visible]::before {
      display: block;
    }
  }

  ::slotted(wa-dropdown-item) {
    font-size: inherit;
  }

  ::slotted(wa-divider) {
    --spacing: 0.25em;
  }

  @keyframes submenu-show {
    from {
      scale: 0.9;
      opacity: 0;
    }
    to {
      scale: 1;
      opacity: 1;
    }
  }
`));
  }),
  Nr,
  Pr = e(() => {
    Nr = class {
      constructor(e, ...t) {
        ((this.slotNames = []),
          (this.handleSlotChange = (e) => {
            let t = e.target;
            ((this.slotNames.includes(`[default]`) && !t.name) ||
              (t.name && this.slotNames.includes(t.name))) &&
              this.host.requestUpdate();
          }),
          (this.host = e).addController(this),
          (this.slotNames = t));
      }
      hasDefaultSlot() {
        return this.host.childNodes
          ? [...this.host.childNodes].some((e) => {
              if (e.nodeType === Node.TEXT_NODE && e.textContent.trim() !== ``) return !0;
              if (e.nodeType === Node.ELEMENT_NODE) {
                let t = e;
                if (t.tagName.toLowerCase() === `wa-visually-hidden`) return !1;
                if (!t.hasAttribute(`slot`)) return !0;
              }
              return !1;
            })
          : !1;
      }
      hasNamedSlot(e) {
        return this.host.querySelector?.(`:scope > [slot="${e}"]`) !== null;
      }
      test(e, t) {
        return t && this.host.didSSR && !this.host.hasUpdated
          ? !!this.host[t]
          : e === `[default]`
            ? this.hasDefaultSlot()
            : this.hasNamedSlot(e);
      }
      hostConnected() {
        let e = this.host.shadowRoot;
        e && `addEventListener` in e && e.addEventListener(`slotchange`, this.handleSlotChange);
      }
      hostDisconnected() {
        let e = this.host.shadowRoot;
        e &&
          `removeEventListener` in e &&
          e.removeEventListener(`slotchange`, this.handleSlotChange);
      }
    };
  }),
  q,
  Fr = e(() => {
    (Mr(),
      ut(),
      Pr(),
      pt(),
      mt(),
      L(),
      F(),
      m(),
      i(),
      (q = class extends I {
        constructor() {
          (super(...arguments),
            (this.hasSlotController = new Nr(this, `[default]`, `start`, `end`)),
            (this.active = !1),
            (this.variant = `default`),
            (this.size = `m`),
            (this.checkboxAdjacent = !1),
            (this.submenuAdjacent = !1),
            (this.type = `normal`),
            (this.checked = !1),
            (this.disabled = !1),
            (this.submenuOpen = !1),
            (this.hasSubmenu = !1),
            (this.handleSlotChange = () => {
              ((this.hasSubmenu = this.hasSlotController.test(`submenu`)),
                this.updateHasSubmenuState(),
                this.hasSubmenu
                  ? (this.setAttribute(`aria-haspopup`, `menu`),
                    this.setAttribute(`aria-expanded`, this.submenuOpen ? `true` : `false`))
                  : (this.removeAttribute(`aria-haspopup`), this.removeAttribute(`aria-expanded`)));
            }),
            (this.handleHostClick = (e) => {
              this.disabled && (e.preventDefault(), e.stopImmediatePropagation());
            }),
            (this.handleClick = (e) => {
              this.disabled && (e.preventDefault(), e.stopImmediatePropagation());
            }));
        }
        handleSizeChange() {
          st(this.localName, this.size);
        }
        connectedCallback() {
          (super.connectedCallback(),
            this.addEventListener?.(`click`, this.handleHostClick),
            this.addEventListener?.(`mouseenter`, this.handleMouseEnter.bind(this)),
            this.shadowRoot?.addEventListener?.(`click`, this.handleClick, { capture: !0 }),
            this.shadowRoot?.addEventListener?.(`slotchange`, this.handleSlotChange));
        }
        disconnectedCallback() {
          (super.disconnectedCallback(),
            this.closeSubmenu(),
            this.removeEventListener?.(`click`, this.handleHostClick),
            this.removeEventListener?.(`mouseenter`, this.handleMouseEnter),
            this.shadowRoot?.removeEventListener?.(`click`, this.handleClick, { capture: !0 }),
            this.shadowRoot?.removeEventListener?.(`slotchange`, this.handleSlotChange));
        }
        firstUpdated() {
          (this.setAttribute(`tabindex`, `-1`),
            (this.hasSubmenu = this.hasSlotController.test(`submenu`)),
            this.updateHasSubmenuState());
        }
        updated(e) {
          (e.has(`active`) &&
            (this.setAttribute(`tabindex`, this.active ? `0` : `-1`),
            this.customStates.set(`active`, this.active)),
            e.has(`checked`) &&
              (this.type === `checkbox`
                ? this.setAttribute(`aria-checked`, this.checked ? `true` : `false`)
                : this.removeAttribute(`aria-checked`),
              this.customStates.set(`checked`, this.checked)),
            e.has(`disabled`) &&
              (this.setAttribute(`aria-disabled`, this.disabled ? `true` : `false`),
              this.customStates.set(`disabled`, this.disabled)),
            e.has(`type`) &&
              (this.type === `checkbox`
                ? (this.setAttribute(`role`, `menuitemcheckbox`),
                  this.setAttribute(`aria-checked`, this.checked ? `true` : `false`))
                : (this.setAttribute(`role`, `menuitem`), this.removeAttribute(`aria-checked`))),
            e.has(`submenuOpen`) &&
              (this.customStates.set(`submenu-open`, this.submenuOpen),
              this.submenuOpen ? this.openSubmenu() : this.closeSubmenu()));
        }
        updateHasSubmenuState() {
          this.customStates.set(`has-submenu`, this.hasSubmenu);
        }
        async openSubmenu() {
          let e = this.submenuElement;
          !this.hasSubmenu ||
            !e ||
            !this.isConnected ||
            (this.notifyParentOfOpening(),
            e.showPopover?.(),
            (e.hidden = !1),
            e.setAttribute(`data-visible`, ``),
            (this.submenuOpen = !0),
            this.setAttribute(`aria-expanded`, `true`),
            await M(e, `show`),
            setTimeout(() => {
              let e = this.getSubmenuItems();
              e.length > 0 &&
                (e.forEach((e, t) => (e.active = t === 0)), e[0].focus({ preventScroll: !0 }));
            }, 0));
        }
        notifyParentOfOpening() {
          let e = new CustomEvent(`submenu-opening`, {
            bubbles: !0,
            composed: !0,
            detail: { item: this },
          });
          this.dispatchEvent(e);
          let t = this.parentElement;
          t &&
            [...t.children]
              .filter(
                (e) =>
                  e !== this &&
                  e.localName === `wa-dropdown-item` &&
                  e.getAttribute(`slot`) === this.getAttribute(`slot`) &&
                  e.submenuOpen,
              )
              .forEach((e) => {
                e.submenuOpen = !1;
              });
        }
        async closeSubmenu() {
          let e = this.submenuElement;
          !this.hasSubmenu ||
            !e ||
            ((this.submenuOpen = !1),
            this.setAttribute(`aria-expanded`, `false`),
            e.hidden ||
              (await M(e, `hide`),
              e?.isConnected &&
                ((e.hidden = !0), e.removeAttribute(`data-visible`), e.hidePopover?.())));
        }
        getSubmenuItems() {
          return [...this.children].filter(
            (e) =>
              e.localName === `wa-dropdown-item` &&
              e.getAttribute(`slot`) === `submenu` &&
              !e.hasAttribute(`disabled`),
          );
        }
        handleMouseEnter() {
          this.hasSubmenu &&
            !this.disabled &&
            (this.notifyParentOfOpening(), (this.submenuOpen = !0));
        }
        render() {
          return f`
      ${
        this.type === `checkbox`
          ? f`
            <wa-icon
              id="check"
              part="checkmark"
              exportparts="svg:checkmark__svg"
              library="system"
              name="check"
            ></wa-icon>
          `
          : ``
      }

      <span id="icon" part="icon">
        <slot name="icon"></slot>
      </span>

      <span id="label" part="label">
        <slot></slot>
      </span>

      <span id="details" part="details">
        <slot name="details"></slot>
      </span>

      ${
        this.hasSubmenu
          ? f`
            <wa-icon
              id="submenu-indicator"
              part="submenu-icon"
              exportparts="svg:submenu-icon__svg"
              library="system"
              name="chevron-right"
            ></wa-icon>
          `
          : ``
      }
      ${
        this.hasSubmenu
          ? f`
            <div
              id="submenu"
              part="submenu"
              popover="manual"
              role="menu"
              tabindex="-1"
              aria-orientation="vertical"
              hidden
            >
              <slot name="submenu"></slot>
            </div>
          `
          : ``
      }
    `;
        }
      }),
      (q.css = jr),
      P([o(`#submenu`)], q.prototype, `submenuElement`, 2),
      P([d({ type: Boolean })], q.prototype, `active`, 2),
      P([d({ reflect: !0 })], q.prototype, `variant`, 2),
      P([d({ reflect: !0 })], q.prototype, `size`, 2),
      P([N(`size`)], q.prototype, `handleSizeChange`, 1),
      P(
        [d({ attribute: `checkbox-adjacent`, type: Boolean, reflect: !0 })],
        q.prototype,
        `checkboxAdjacent`,
        2,
      ),
      P(
        [d({ attribute: `submenu-adjacent`, type: Boolean, reflect: !0 })],
        q.prototype,
        `submenuAdjacent`,
        2,
      ),
      P([d()], q.prototype, `value`, 2),
      P([d({ reflect: !0 })], q.prototype, `type`, 2),
      P([d({ type: Boolean })], q.prototype, `checked`, 2),
      P([d({ type: Boolean, reflect: !0 })], q.prototype, `disabled`, 2),
      P([d({ type: Boolean, reflect: !0 })], q.prototype, `submenuOpen`, 2),
      P([u()], q.prototype, `hasSubmenu`, 2),
      (q = P([t(`wa-dropdown-item`)], q)));
  }),
  Ir,
  Lr = e(() => {
    Ir = class extends Event {
      constructor() {
        super(`wa-reposition`, { bubbles: !0, cancelable: !1, composed: !0 });
      }
    };
  }),
  Rr,
  zr = e(() => {
    (m(),
      (Rr = b`
  :host {
    --arrow-color: black;
    --arrow-size: var(--wa-tooltip-arrow-size);
    --popup-border-width: 0px;
    --show-duration: var(--wa-transition-fast);
    --hide-duration: var(--wa-transition-fast);

    /*
     * These properties are computed to account for the arrow's dimensions after being rotated 45º. The constant
     * 0.7071 is derived from sin(45) to calculate the length of the arrow after rotation.
     *
     * The diamond will be translated inward by --arrow-base-offset, the border thickness, to centralise it on
     * the inner edge of the popup border. This also means we need to increase the size of the arrow by the
     * same amount to compensate.
     *
     * A diamond shaped clipping mask is used to avoid overlap of popup content. This extends slightly inward so
     * the popup border is covered with no sub-pixel rounding artifacts. The diamond corners are mitred at 22.5º
     * to properly merge any arrow border with the popup border. The constant 1.4142 is derived from 1 + tan(22.5).
     *
     */
    --arrow-base-offset: var(--popup-border-width);
    --arrow-size-diagonal: calc((var(--arrow-size) + var(--arrow-base-offset)) * 0.7071);
    --arrow-padding-offset: calc(var(--arrow-size-diagonal) - var(--arrow-size));
    --arrow-size-div: calc(var(--arrow-size-diagonal) * 2);
    --arrow-clipping-corner: calc(var(--arrow-base-offset) * 1.4142);

    display: contents;
  }

  .popup {
    position: absolute;
    isolation: isolate;
    max-width: var(--auto-size-available-width, none);
    max-height: var(--auto-size-available-height, none);

    /* Clear UA styles for [popover] */
    :where(&) {
      inset: unset;
      padding: unset;
      margin: unset;
      width: unset;
      height: unset;
      color: unset;
      background: unset;
      border: unset;
      overflow: unset;
    }
  }

  .popup-fixed {
    position: fixed;
  }

  .popup:not(.popup-active) {
    display: none;
  }

  .arrow {
    position: absolute;
    width: var(--arrow-size-div);
    height: var(--arrow-size-div);
    background: var(--arrow-color);
    z-index: 3;
    clip-path: polygon(
      var(--arrow-clipping-corner) 100%,
      var(--arrow-base-offset) calc(100% - var(--arrow-base-offset)),
      calc(var(--arrow-base-offset) - 2px) calc(100% - var(--arrow-base-offset)),
      calc(100% - var(--arrow-base-offset)) calc(var(--arrow-base-offset) - 2px),
      calc(100% - var(--arrow-base-offset)) var(--arrow-base-offset),
      100% var(--arrow-clipping-corner),
      100% 100%
    );
    rotate: 45deg;
  }

  :host([data-current-placement|='left']) .arrow {
    rotate: -45deg;
  }

  :host([data-current-placement|='right']) .arrow {
    rotate: 135deg;
  }

  :host([data-current-placement|='bottom']) .arrow {
    rotate: 225deg;
  }

  /* Hover bridge */
  .popup-hover-bridge:not(.popup-hover-bridge-visible) {
    display: none;
  }

  .popup-hover-bridge {
    position: fixed;
    z-index: 899;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    clip-path: polygon(
      var(--hover-bridge-top-left-x, 0) var(--hover-bridge-top-left-y, 0),
      var(--hover-bridge-top-right-x, 0) var(--hover-bridge-top-right-y, 0),
      var(--hover-bridge-bottom-right-x, 0) var(--hover-bridge-bottom-right-y, 0),
      var(--hover-bridge-bottom-left-x, 0) var(--hover-bridge-bottom-left-y, 0)
    );
  }

  /* Built-in animations */
  .show {
    animation: show var(--show-duration) ease;
  }

  .hide {
    animation: show var(--hide-duration) ease reverse;
  }

  @keyframes show {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .show-with-scale {
    animation: show-with-scale var(--show-duration) ease;
  }

  .hide-with-scale {
    animation: show-with-scale var(--hide-duration) ease reverse;
  }

  @keyframes show-with-scale {
    from {
      opacity: 0;
      scale: 0.8;
    }
    to {
      opacity: 1;
      scale: 1;
    }
  }
`));
  });
function Br(e) {
  return Hr(e);
}
function Vr(e) {
  return e.assignedSlot
    ? e.assignedSlot
    : e.parentNode instanceof ShadowRoot
      ? e.parentNode.host
      : e.parentNode;
}
function Hr(e) {
  for (let t = e; t; t = Vr(t))
    if (t instanceof Element && getComputedStyle(t).display === `none`) return null;
  for (let t = Vr(e); t; t = Vr(t)) {
    if (!(t instanceof Element)) continue;
    let e = getComputedStyle(t);
    if (e.display !== `contents` && (e.position !== `static` || Nn(e) || t.tagName === `BODY`))
      return t;
  }
  return null;
}
var Ur = e(() => {
  Kn();
});
function Wr(e) {
  return (
    typeof e == `object` &&
    !!e &&
    `getBoundingClientRect` in e &&
    (`contextElement` in e ? e instanceof Element : !0)
  );
}
var Gr,
  J,
  Kr = e(() => {
    (Lr(),
      zr(),
      L(),
      R(),
      F(),
      Or(),
      Ur(),
      m(),
      i(),
      g(),
      (Gr = !!globalThis?.HTMLElement?.prototype.hasOwnProperty(`popover`)),
      (J = class extends I {
        constructor() {
          (super(...arguments),
            (this.localize = new Bt(this)),
            (this.SUPPORTS_POPOVER = !1),
            (this.active = !1),
            (this.placement = `top`),
            (this.boundary = `viewport`),
            (this.distance = 0),
            (this.skidding = 0),
            (this.arrow = !1),
            (this.arrowPlacement = `anchor`),
            (this.arrowPadding = 10),
            (this.flip = !1),
            (this.flipFallbackPlacements = ``),
            (this.flipFallbackStrategy = `best-fit`),
            (this.flipPadding = 0),
            (this.shift = !1),
            (this.shiftPadding = 0),
            (this.autoSizePadding = 0),
            (this.hoverBridge = !1),
            (this.updateHoverBridge = () => {
              if (this.hoverBridge && this.anchorEl && this.popup) {
                let e = this.anchorEl.getBoundingClientRect(),
                  t = this.popup.getBoundingClientRect(),
                  n = this.placement.includes(`top`) || this.placement.includes(`bottom`),
                  r = 0,
                  i = 0,
                  a = 0,
                  o = 0,
                  s = 0,
                  c = 0,
                  l = 0,
                  u = 0;
                (n
                  ? e.top < t.top
                    ? ((r = e.left),
                      (i = e.bottom),
                      (a = e.right),
                      (o = e.bottom),
                      (s = t.left),
                      (c = t.top),
                      (l = t.right),
                      (u = t.top))
                    : ((r = t.left),
                      (i = t.bottom),
                      (a = t.right),
                      (o = t.bottom),
                      (s = e.left),
                      (c = e.top),
                      (l = e.right),
                      (u = e.top))
                  : e.left < t.left
                    ? ((r = e.right),
                      (i = e.top),
                      (a = t.left),
                      (o = t.top),
                      (s = e.right),
                      (c = e.bottom),
                      (l = t.left),
                      (u = t.bottom))
                    : ((r = t.right),
                      (i = t.top),
                      (a = e.left),
                      (o = e.top),
                      (s = t.right),
                      (c = t.bottom),
                      (l = e.left),
                      (u = e.bottom)),
                  this.style.setProperty(`--hover-bridge-top-left-x`, `${r}px`),
                  this.style.setProperty(`--hover-bridge-top-left-y`, `${i}px`),
                  this.style.setProperty(`--hover-bridge-top-right-x`, `${a}px`),
                  this.style.setProperty(`--hover-bridge-top-right-y`, `${o}px`),
                  this.style.setProperty(`--hover-bridge-bottom-left-x`, `${s}px`),
                  this.style.setProperty(`--hover-bridge-bottom-left-y`, `${c}px`),
                  this.style.setProperty(`--hover-bridge-bottom-right-x`, `${l}px`),
                  this.style.setProperty(`--hover-bridge-bottom-right-y`, `${u}px`));
              }
            }));
        }
        async connectedCallback() {
          (super.connectedCallback(),
            await this.updateComplete,
            (this.SUPPORTS_POPOVER = Gr),
            this.start());
        }
        disconnectedCallback() {
          (super.disconnectedCallback(), this.stop());
        }
        async updated(e) {
          (super.updated(e),
            e.has(`active`) && (this.active ? this.start() : this.stop()),
            e.has(`anchor`) && this.handleAnchorChange(),
            this.active && (await this.updateComplete, this.reposition()));
        }
        async handleAnchorChange() {
          if ((await this.stop(), this.anchor && typeof this.anchor == `string`)) {
            let e = this.getRootNode();
            this.anchorEl = e.getElementById(this.anchor);
          } else
            this.anchor instanceof Element || Wr(this.anchor)
              ? (this.anchorEl = this.anchor)
              : (this.anchorEl = this.querySelector(`[slot="anchor"]`));
          (this.anchorEl instanceof HTMLSlotElement &&
            (this.anchorEl = this.anchorEl.assignedElements({ flatten: !0 })[0]),
            this.anchorEl && this.start());
        }
        start() {
          !this.anchorEl ||
            !this.active ||
            !this.isConnected ||
            (this.popup?.showPopover?.(),
            (this.cleanup = _r(this.anchorEl, this.popup, () => {
              this.reposition();
            })));
        }
        async stop() {
          return new Promise((e) => {
            (this.popup?.hidePopover?.(),
              this.cleanup
                ? (this.cleanup(),
                  (this.cleanup = void 0),
                  this.removeAttribute(`data-current-placement`),
                  this.style.removeProperty(`--auto-size-available-width`),
                  this.style.removeProperty(`--auto-size-available-height`),
                  requestAnimationFrame(() => e()))
                : e());
          });
        }
        reposition() {
          if (!this.active || !this.anchorEl || !this.popup) return;
          let e = [Sr({ mainAxis: this.distance, crossAxis: this.skidding })];
          this.sync
            ? e.push(
                Tr({
                  apply: ({ rects: e }) => {
                    let t = this.sync === `width` || this.sync === `both`,
                      n = this.sync === `height` || this.sync === `both`;
                    ((this.popup.style.width = t ? `${e.reference.width}px` : ``),
                      (this.popup.style.height = n ? `${e.reference.height}px` : ``));
                  },
                }),
              )
            : ((this.popup.style.width = ``), (this.popup.style.height = ``));
          let t;
          (this.SUPPORTS_POPOVER &&
            !Wr(this.anchor) &&
            this.boundary === `scroll` &&
            (t = Bn(this.anchorEl).filter((e) => e instanceof Element)),
            this.flip &&
              e.push(
                wr({
                  boundary: this.flipBoundary || t,
                  fallbackPlacements: this.flipFallbackPlacements,
                  fallbackStrategy:
                    this.flipFallbackStrategy === `best-fit` ? `bestFit` : `initialPlacement`,
                  padding: this.flipPadding,
                }),
              ),
            this.shift &&
              e.push(Cr({ boundary: this.shiftBoundary || t, padding: this.shiftPadding })),
            this.autoSize
              ? e.push(
                  Tr({
                    boundary: this.autoSizeBoundary || t,
                    padding: this.autoSizePadding,
                    apply: ({ availableWidth: e, availableHeight: t }) => {
                      (this.autoSize === `vertical` || this.autoSize === `both`
                        ? this.style.setProperty(`--auto-size-available-height`, `${t}px`)
                        : this.style.removeProperty(`--auto-size-available-height`),
                        this.autoSize === `horizontal` || this.autoSize === `both`
                          ? this.style.setProperty(`--auto-size-available-width`, `${e}px`)
                          : this.style.removeProperty(`--auto-size-available-width`));
                    },
                  }),
                )
              : (this.style.removeProperty(`--auto-size-available-width`),
                this.style.removeProperty(`--auto-size-available-height`)),
            this.arrow && e.push(Er({ element: this.arrowEl, padding: this.arrowPadding })));
          let n = this.SUPPORTS_POPOVER ? (e) => xr.getOffsetParent(e, Br) : xr.getOffsetParent;
          (Dr(this.anchorEl, this.popup, {
            placement: this.placement,
            middleware: e,
            strategy: this.SUPPORTS_POPOVER ? `absolute` : `fixed`,
            platform: { ...xr, getOffsetParent: n },
          }).then(({ x: e, y: t, middlewareData: n, placement: r }) => {
            let i = this.localize.dir() === `rtl`,
              a = { top: `bottom`, right: `left`, bottom: `top`, left: `right` }[r.split(`-`)[0]];
            if (
              (this.setAttribute(`data-current-placement`, r),
              Object.assign(this.popup.style, { left: `${e}px`, top: `${t}px` }),
              this.arrow)
            ) {
              let e = n.arrow.x,
                t = n.arrow.y,
                r = ``,
                o = ``,
                s = ``,
                c = ``;
              if (this.arrowPlacement === `start`) {
                let n =
                  typeof e == `number`
                    ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))`
                    : ``;
                ((r =
                  typeof t == `number`
                    ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))`
                    : ``),
                  (o = i ? n : ``),
                  (c = i ? `` : n));
              } else if (this.arrowPlacement === `end`) {
                let n =
                  typeof e == `number`
                    ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))`
                    : ``;
                ((o = i ? `` : n),
                  (c = i ? n : ``),
                  (s =
                    typeof t == `number`
                      ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))`
                      : ``));
              } else
                this.arrowPlacement === `center`
                  ? ((c = typeof e == `number` ? `calc(50% - var(--arrow-size-diagonal))` : ``),
                    (r = typeof t == `number` ? `calc(50% - var(--arrow-size-diagonal))` : ``))
                  : ((c = typeof e == `number` ? `${e}px` : ``),
                    (r = typeof t == `number` ? `${t}px` : ``));
              Object.assign(this.arrowEl.style, {
                top: r,
                right: o,
                bottom: s,
                left: c,
                [a]: `calc(var(--arrow-base-offset) - var(--arrow-size-diagonal))`,
              });
            }
          }),
            requestAnimationFrame(() => this.updateHoverBridge()),
            this.dispatchEvent(new Ir()));
        }
        render() {
          return f`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${n({ "popup-hover-bridge": !0, "popup-hover-bridge-visible": this.hoverBridge && this.active })}
      ></span>

      <div
        popover="manual"
        part="popup"
        class=${n({ popup: !0, "popup-active": this.active, "popup-fixed": !this.SUPPORTS_POPOVER, "popup-has-arrow": this.arrow })}
      >
        <slot></slot>
        ${this.arrow ? f`<div part="arrow" class="arrow" role="presentation"></div>` : ``}
      </div>
    `;
        }
      }),
      (J.css = Rr),
      P([o(`.popup`)], J.prototype, `popup`, 2),
      P([o(`.arrow`)], J.prototype, `arrowEl`, 2),
      P([d({ attribute: !1, type: Boolean })], J.prototype, `SUPPORTS_POPOVER`, 2),
      P([d()], J.prototype, `anchor`, 2),
      P([d({ type: Boolean, reflect: !0 })], J.prototype, `active`, 2),
      P([d({ reflect: !0 })], J.prototype, `placement`, 2),
      P([d()], J.prototype, `boundary`, 2),
      P([d({ type: Number })], J.prototype, `distance`, 2),
      P([d({ type: Number })], J.prototype, `skidding`, 2),
      P([d({ type: Boolean })], J.prototype, `arrow`, 2),
      P([d({ attribute: `arrow-placement` })], J.prototype, `arrowPlacement`, 2),
      P([d({ attribute: `arrow-padding`, type: Number })], J.prototype, `arrowPadding`, 2),
      P([d({ type: Boolean })], J.prototype, `flip`, 2),
      P(
        [
          d({
            attribute: `flip-fallback-placements`,
            converter: {
              fromAttribute: (e) =>
                e
                  .split(` `)
                  .map((e) => e.trim())
                  .filter((e) => e !== ``),
              toAttribute: (e) => e.join(` `),
            },
          }),
        ],
        J.prototype,
        `flipFallbackPlacements`,
        2,
      ),
      P([d({ attribute: `flip-fallback-strategy` })], J.prototype, `flipFallbackStrategy`, 2),
      P([d({ type: Object })], J.prototype, `flipBoundary`, 2),
      P([d({ attribute: `flip-padding`, type: Number })], J.prototype, `flipPadding`, 2),
      P([d({ type: Boolean })], J.prototype, `shift`, 2),
      P([d({ type: Object })], J.prototype, `shiftBoundary`, 2),
      P([d({ attribute: `shift-padding`, type: Number })], J.prototype, `shiftPadding`, 2),
      P([d({ attribute: `auto-size` })], J.prototype, `autoSize`, 2),
      P([d()], J.prototype, `sync`, 2),
      P([d({ type: Object })], J.prototype, `autoSizeBoundary`, 2),
      P([d({ attribute: `auto-size-padding`, type: Number })], J.prototype, `autoSizePadding`, 2),
      P([d({ attribute: `hover-bridge`, type: Boolean })], J.prototype, `hoverBridge`, 2),
      (J = P([t(`wa-popup`)], J)));
  }),
  qr,
  Jr = e(() => {
    qr = class extends Event {
      constructor() {
        super(`wa-error`, { bubbles: !0, cancelable: !1, composed: !0 });
      }
    };
  }),
  Yr,
  Xr = e(() => {
    Yr = class extends Event {
      constructor() {
        super(`wa-load`, { bubbles: !0, cancelable: !1, composed: !0 });
      }
    };
  }),
  Zr,
  Qr = e(() => {
    (m(),
      (Zr = b`
  :host {
    --primary-color: currentColor;
    --primary-opacity: 1;
    --secondary-color: currentColor;
    --secondary-opacity: 0.4;
    --rotate-angle: 0deg;

    box-sizing: content-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: -0.125em;
  }

  /* #region Canvas — the box the icon is centered within (mirrors Font Awesome's icon canvas). Orthogonal to font-size. */

  /* Fixed width (default): 1.25em × 1em (20 × 16px) */
  :host(:not([canvas])),
  :host([canvas='fixed']) {
    width: 1.25em;
    height: 1em;
    min-width: 1.25em; /* <-- this is what Safari respects for intrinsic */
    min-height: 1em;
  }

  /* Auto: hug the icon's width. \`auto-width\` is the deprecated alias for canvas="auto". */
  :host([canvas='auto']),
  :host([auto-width]:not([canvas])) {
    width: auto;
    height: 1em;
  }

  /* Square: 1.25em × 1.25em (20 × 20px) */
  :host([canvas='square']) {
    width: 1.25em;
    height: 1.25em;
    min-width: 1.25em;
    min-height: 1.25em;
  }

  /* Roomy: 1.5em × 1.5em (24 × 24px) */
  :host([canvas='roomy']) {
    width: 1.5em;
    height: 1.5em;
    min-width: 1.5em;
    min-height: 1.5em;
  }

  /* #endregion */

  svg {
    fill: currentColor;
    height: 1em;
    overflow: visible;
    width: auto;

    /* Duotone colors with path-specific opacity fallback */
    path[data-duotone-primary] {
      color: var(--primary-color);
      opacity: var(--path-opacity, var(--primary-opacity));
    }

    path[data-duotone-secondary] {
      color: var(--secondary-color);
      opacity: var(--path-opacity, var(--secondary-opacity));
    }
  }

  /* Rotation */
  :host([rotate]) {
    transform: rotate(var(--rotate-angle, 0deg));
  }

  /* Flipping */
  :host([flip='x']) {
    transform: scaleX(-1);
  }
  :host([flip='y']) {
    transform: scaleY(-1);
  }
  :host([flip='both']) {
    transform: scale(-1, -1);
  }

  /* Rotation and Flipping combined */
  :host([rotate][flip='x']) {
    transform: rotate(var(--rotate-angle, 0deg)) scaleX(-1);
  }
  :host([rotate][flip='y']) {
    transform: rotate(var(--rotate-angle, 0deg)) scaleY(-1);
  }
  :host([rotate][flip='both']) {
    transform: rotate(var(--rotate-angle, 0deg)) scale(-1, -1);
  }

  /* #region Animations — ported from Font Awesome 7.3 (--fa-* props mapped to wa-icon's --* names) */

  :host([animation='beat']) {
    animation-name: beat;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='bounce']) {
    animation-name: bounce;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
  }

  :host([animation='fade']) {
    animation-name: fade;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='beat-fade']) {
    animation-name: beat-fade;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='flip']) {
    animation-name: flip;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1.5s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='flip-360']) {
    animation-name: flip-360;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='shake']) {
    animation-name: shake;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 0.75s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='spin']) {
    animation-name: spin;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 2s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='spin-pulse']) {
    animation-name: spin;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, steps(8));
  }

  /* spin-reverse is FA's reverse modifier expressed as a standalone value; reverse any spin via --animation-direction: reverse */
  :host([animation='spin-reverse']) {
    animation-name: spin;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, reverse);
    animation-duration: var(--animation-duration, 2s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='spin-snap']) {
    animation-name: spin-snap;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 3s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='spin-snap-4']) {
    animation-name: spin-snap-4;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 2.4s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='spin-snap-8']) {
    animation-name: spin-snap-8;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 4s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='buzz']) {
    animation-name: buzz;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 0.6s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='wag']) {
    animation-name: wag;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 0.9s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-out);
    transform-origin: bottom center;
  }

  :host([animation='float']) {
    animation-name: float;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 3s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
    will-change: transform;
  }

  :host([animation='swing']) {
    animation-name: swing;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1.2s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-out);
    transform-origin: top center;
  }

  :host([animation='jello']) {
    animation-name: jello;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 0.9s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-out);
  }

  @media (prefers-reduced-motion: reduce) {
    :host([animation='beat']),
    :host([animation='bounce']),
    :host([animation='fade']),
    :host([animation='beat-fade']),
    :host([animation='flip']),
    :host([animation='flip-360']),
    :host([animation='shake']),
    :host([animation='spin']),
    :host([animation='spin-pulse']),
    :host([animation='spin-reverse']),
    :host([animation='spin-snap']),
    :host([animation='spin-snap-4']),
    :host([animation='spin-snap-8']),
    :host([animation='buzz']),
    :host([animation='wag']),
    :host([animation='float']),
    :host([animation='swing']),
    :host([animation='jello']) {
      animation: none !important;
      transition: none !important;
    }
  }

  /* #endregion */

  /* #region Keyframes — ported verbatim from Font Awesome 7.3 */

  @keyframes beat {
    0% {
      transform: scale(1);
    }
    25% {
      transform: scale(calc(1.25 * var(--beat-scale, 1.25)));
    }
    45% {
      transform: scale(calc(1.22 * var(--beat-scale, 1.22)));
    }
    65% {
      transform: scale(calc(1.25 * var(--beat-scale, 1.25)));
    }
    90% {
      transform: scale(1);
    }
  }

  @keyframes bounce {
    0% {
      transform: scale(1, 1) translateY(0);
      /* No fallback by design (ported from FA 7.3): the first segment uses the user's --animation-timing or the CSS
         initial ease, while the explicit cubic-beziers on later stops drive the bounce physics. */
      animation-timing-function: var(--animation-timing);
    }
    14% {
      transform: scale(var(--bounce-start-scale-x, 1.06), var(--bounce-start-scale-y, 0.94))
        translateY(var(--bounce-anticipation, 3px));
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
    }
    32% {
      transform: scale(var(--bounce-jump-scale-x, 0.94), var(--bounce-jump-scale-y, 1.12))
        translateY(calc(-1 * var(--bounce-height, 0.5em)));
      animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
    }
    52% {
      transform: scale(1, 1) translateY(calc(-1 * var(--bounce-height, 0.5em) * 1.1));
      animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
    }
    70% {
      transform: scale(var(--bounce-land-scale-x, 1.06), var(--bounce-land-scale-y, 0.92)) translateY(0);
      animation-timing-function: cubic-bezier(0.33, 0.33, 0.66, 1);
    }
    85% {
      transform: scale(0.98, 1.04) translateY(calc(-2px * var(--bounce-rebound, 1)));
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
    }
    100% {
      transform: scale(1, 1) translateY(0);
    }
  }

  @keyframes fade {
    0% {
      opacity: 1;
      transform: scale(1);
      animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
    }
    40% {
      opacity: var(--fade-opacity, 0.4);
      transform: scale(0.98);
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes beat-fade {
    0% {
      opacity: var(--beat-fade-opacity, 0.4);
      transform: scale(1);
      animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
    }
    25% {
      opacity: calc(var(--beat-fade-opacity, 0.4) + 0.4);
      transform: scale(var(--beat-fade-scale, 1.28));
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    45% {
      opacity: 1;
      transform: scale(var(--beat-fade-scale, 1.25));
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    65% {
      opacity: calc(var(--beat-fade-opacity, 0.4) + 0.4);
      transform: scale(var(--beat-fade-scale, 1.28));
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    100% {
      opacity: var(--beat-fade-opacity, 0.4);
      transform: scale(1);
    }
  }

  @keyframes flip {
    0% {
      transform: perspective(2em) scale(1) rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), 0deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
    }
    8% {
      transform: perspective(2em) scale(var(--flip-anticipation-scale, 0.95))
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), 0deg);
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
    }
    35% {
      transform: perspective(2em) scale(1)
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), calc(var(--flip-angle, -360deg) * 0.6));
      animation-timing-function: linear;
    }
    65% {
      transform: perspective(2em) scale(1)
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), calc(var(--flip-angle, -360deg) * 0.5));
      animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
    }
    92% {
      transform: perspective(2em) scale(1)
        rotate3d(
          var(--flip-x, 0),
          var(--flip-y, 1),
          var(--flip-z, 0),
          calc(var(--flip-angle, -360deg) * var(--flip-overshoot, 1.04))
        );
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
    }
    100% {
      transform: perspective(2em) scale(1)
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), var(--flip-angle, -360deg));
    }
  }

  @keyframes flip-360 {
    0% {
      transform: perspective(2em) scale(1) rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), 0deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
    }
    8% {
      transform: perspective(2em) scale(var(--flip-anticipation-scale, 0.95))
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), 0deg);
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
    }
    50% {
      transform: perspective(2em) scale(1)
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), calc(var(--flip-angle, -360deg) * 0.6));
      animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
    }
    80% {
      transform: perspective(2em) scale(1)
        rotate3d(
          var(--flip-x, 0),
          var(--flip-y, 1),
          var(--flip-z, 0),
          calc(var(--flip-angle, -360deg) * var(--flip-overshoot, 1.04))
        );
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
    }
    100% {
      transform: perspective(2em) scale(1)
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), var(--flip-angle, -360deg));
    }
  }

  @keyframes shake {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);
    }
    8% {
      transform: rotate(35deg) translateX(1px);
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    20% {
      transform: rotate(-22deg) translateX(-1px);
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    35% {
      transform: rotate(15deg) translateX(1px);
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    50% {
      transform: rotate(-9deg);
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    65% {
      transform: rotate(5deg);
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    78% {
      transform: rotate(-3deg);
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    90% {
      transform: rotate(1deg);
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes spin-snap {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    12% {
      transform: rotate(60deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    16.67% {
      transform: rotate(60deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    28.67% {
      transform: rotate(120deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    33.33% {
      transform: rotate(120deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    45.33% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    62% {
      transform: rotate(240deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    66.67% {
      transform: rotate(240deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    78.67% {
      transform: rotate(300deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    83.33% {
      transform: rotate(300deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    95.33% {
      transform: rotate(360deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes spin-snap-4 {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    15% {
      transform: rotate(90deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    25% {
      transform: rotate(90deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    40% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    65% {
      transform: rotate(270deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    75% {
      transform: rotate(270deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    90% {
      transform: rotate(360deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes spin-snap-8 {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    9% {
      transform: rotate(45deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    12.5% {
      transform: rotate(45deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    21.5% {
      transform: rotate(90deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    25% {
      transform: rotate(90deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    34% {
      transform: rotate(135deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    37.5% {
      transform: rotate(135deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    46.5% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    59% {
      transform: rotate(225deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    62.5% {
      transform: rotate(225deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    71.5% {
      transform: rotate(270deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    75% {
      transform: rotate(270deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    84% {
      transform: rotate(315deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    87.5% {
      transform: rotate(315deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    96.5% {
      transform: rotate(360deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes buzz {
    0% {
      transform: translateX(0) rotate(0deg);
      animation-timing-function: cubic-bezier(0.1, 0, 0.9, 1);
    }
    5% {
      transform: translateX(var(--buzz-distance, 4px)) rotate(0.5deg);
    }
    10% {
      transform: translateX(calc(-1 * var(--buzz-distance, 4px))) rotate(-0.5deg);
    }
    15% {
      transform: translateX(var(--buzz-distance, 4px)) rotate(0.3deg);
    }
    20% {
      transform: translateX(calc(-1 * var(--buzz-distance, 4px))) rotate(-0.3deg);
    }
    25% {
      transform: translateX(calc(var(--buzz-distance, 4px) * 0.7)) rotate(0.2deg);
    }
    30% {
      transform: translateX(calc(-1 * var(--buzz-distance, 4px) * 0.7)) rotate(-0.2deg);
    }
    35% {
      transform: translateX(calc(var(--buzz-distance, 4px) * 0.4)) rotate(0.1deg);
    }
    40% {
      transform: translateX(0) rotate(0deg);
    }
    100% {
      transform: translateX(0) rotate(0deg);
    }
  }

  @keyframes wag {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1);
    }
    12% {
      transform: rotate(var(--wag-angle, 12deg));
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    24% {
      transform: rotate(2deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1);
    }
    36% {
      transform: rotate(calc(var(--wag-angle, 12deg) * 0.85));
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    48% {
      transform: rotate(1deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1);
    }
    58% {
      transform: rotate(calc(var(--wag-angle, 12deg) * 0.6));
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    68% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  @keyframes float {
    0% {
      transform: translateY(0) translateX(0) rotate(0deg)
        scale(var(--float-squash-x, 1.02), var(--float-squash-y, 0.98));
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
    }
    15% {
      transform: translateY(calc(-0.4 * var(--float-height, 6px))) translateX(var(--float-drift, 1px))
        rotate(var(--float-tilt, 1deg)) scale(1, 1);
      animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
    }
    35% {
      transform: translateY(calc(-1 * var(--float-height, 6px))) translateX(0) rotate(0deg)
        scale(var(--float-stretch-x, 0.98), var(--float-stretch-y, 1.03));
      animation-timing-function: cubic-bezier(0.5, 0, 0.5, 0);
    }
    50% {
      transform: translateY(calc(-0.92 * var(--float-height, 6px))) translateX(calc(-0.5 * var(--float-drift, 1px)))
        rotate(calc(-0.5 * var(--float-tilt, 1deg))) scale(0.995, 1.01);
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
    }
    70% {
      transform: translateY(calc(-0.3 * var(--float-height, 6px))) translateX(calc(-1 * var(--float-drift, 1px)))
        rotate(calc(-1 * var(--float-tilt, 1deg))) scale(1, 1);
      animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
    }
    90% {
      transform: translateY(calc(0.05 * var(--float-height, 6px))) translateX(0) rotate(0deg)
        scale(var(--float-squash-x, 1.02), var(--float-squash-y, 0.98));
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
    }
    100% {
      transform: translateY(0) translateX(0) rotate(0deg)
        scale(var(--float-squash-x, 1.02), var(--float-squash-y, 0.98));
    }
  }

  @keyframes swing {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);
    }
    8% {
      transform: rotate(var(--swing-angle, 22deg));
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    18% {
      transform: rotate(calc(-1 * var(--swing-angle, 22deg) * 0.85));
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    28% {
      transform: rotate(calc(var(--swing-angle, 22deg) * 0.65));
      animation-timing-function: cubic-bezier(0.35, 0, 0.65, 1);
    }
    38% {
      transform: rotate(calc(-1 * var(--swing-angle, 22deg) * 0.45));
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    48% {
      transform: rotate(calc(var(--swing-angle, 22deg) * 0.25));
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    56% {
      transform: rotate(calc(-1 * var(--swing-angle, 22deg) * 0.1));
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    64% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  @keyframes jello {
    0% {
      transform: scale(1, 1);
      animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);
    }
    12% {
      transform: scale(var(--jello-scale-x, 1.15), calc(2 - var(--jello-scale-x, 1.15)));
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    24% {
      transform: scale(calc(2 - var(--jello-scale-y, 1.12)), var(--jello-scale-y, 1.12));
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    36% {
      transform: scale(
        calc(1 + (var(--jello-scale-x, 1.15) - 1) * 0.5),
        calc(2 - (1 + (var(--jello-scale-x, 1.15) - 1) * 0.5))
      );
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    48% {
      transform: scale(
        calc(2 - (1 + (var(--jello-scale-y, 1.12) - 1) * 0.3)),
        calc(1 + (var(--jello-scale-y, 1.12) - 1) * 0.3)
      );
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    58% {
      transform: scale(1.02, 0.98);
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    68% {
      transform: scale(1, 1);
    }
    100% {
      transform: scale(1, 1);
    }
  }

  /* #endregion */
`));
  });
function $r() {
  return ni.replace(/\/$/, ``);
}
function ei(e) {
  ri = e;
}
function ti() {
  if (!ri) {
    let e = document.querySelector(`[data-fa-kit-code]`);
    e && ei(e.getAttribute(`data-fa-kit-code`) || ``);
  }
  return ri;
}
var ni,
  ri,
  ii = e(() => {
    ((ni = ``), (ri = ``));
  });
function ai(e, t, n) {
  let r = `solid`;
  return (
    t === `chisel` && (r = `chisel-regular`),
    t === `etch` && (r = `etch-solid`),
    t === `graphite` && (r = `graphite-thin`),
    t === `jelly` &&
      ((r = `jelly-regular`),
      n === `duo-regular` && (r = `jelly-duo-regular`),
      n === `fill-regular` && (r = `jelly-fill-regular`)),
    t === `jelly-duo` && (r = `jelly-duo-regular`),
    t === `jelly-fill` && (r = `jelly-fill-regular`),
    t === `notdog` &&
      (n === `solid` && (r = `notdog-solid`), n === `duo-solid` && (r = `notdog-duo-solid`)),
    t === `notdog-duo` && (r = `notdog-duo-solid`),
    t === `slab` &&
      ((n === `solid` || n === `regular`) && (r = `slab-regular`),
      n === `press-regular` && (r = `slab-press-regular`)),
    t === `slab-press` && (r = `slab-press-regular`),
    t === `slab-duo` && (r = `slab-duo-regular`),
    t === `slab-press-duo` && (r = `slab-press-duo-regular`),
    t === `thumbprint` && (r = `thumbprint-light`),
    t === `utility` && (r = `utility-semibold`),
    t === `utility-duo` && (r = `utility-duo-semibold`),
    t === `utility-fill` && (r = `utility-fill-semibold`),
    t === `whiteboard` && (r = `whiteboard-semibold`),
    t === `mosaic` && (r = `mosaic-solid`),
    t === `pixel` && (r = `pixel-regular`),
    t === `vellum` && (r = `vellum-solid`),
    t === `classic` &&
      (n === `thin` && (r = `thin`),
      n === `light` && (r = `light`),
      n === `regular` && (r = `regular`),
      n === `solid` && (r = `solid`)),
    t === `duotone` &&
      (n === `thin` && (r = `duotone-thin`),
      n === `light` && (r = `duotone-light`),
      n === `regular` && (r = `duotone-regular`),
      n === `solid` && (r = `duotone`)),
    t === `sharp` &&
      (n === `thin` && (r = `sharp-thin`),
      n === `light` && (r = `sharp-light`),
      n === `regular` && (r = `sharp-regular`),
      n === `solid` && (r = `sharp-solid`)),
    t === `sharp-duotone` &&
      (n === `thin` && (r = `sharp-duotone-thin`),
      n === `light` && (r = `sharp-duotone-light`),
      n === `regular` && (r = `sharp-duotone-regular`),
      n === `solid` && (r = `sharp-duotone-solid`)),
    t === `brands` && (r = `brands`),
    r
  );
}
function oi(e, t, n) {
  let r = ai(e, t, n),
    i = $r();
  if (i) return `${i}/${r}/${e}.svg`;
  let a = ti();
  return a.length > 0
    ? `https://ka-p.fontawesome.com/releases/v${si}/svgs/${r}/${e}.svg?token=${encodeURIComponent(a)}`
    : `https://ka-f.fontawesome.com/releases/v${si}/svgs/${r}/${e}.svg`;
}
var si,
  ci,
  li = e(() => {
    (ii(),
      (si = `7.3.0`),
      (ci = {
        name: `default`,
        resolver: (e, t = `classic`, n = `solid`) => oi(e, t, n),
        mutator: (e, t) => {
          if (t?.family && !e.hasAttribute(`data-duotone-initialized`)) {
            let { family: n, variant: r } = t;
            if (
              n === `duotone` ||
              n === `sharp-duotone` ||
              n === `notdog-duo` ||
              (n === `notdog` && r === `duo-solid`) ||
              n === `jelly-duo` ||
              (n === `jelly` && r === `duo-regular`) ||
              n === `utility-duo` ||
              n === `slab-duo` ||
              n === `slab-press-duo` ||
              n === `thumbprint`
            ) {
              let n = [...e.querySelectorAll(`path`)],
                r = n.find((e) => !e.hasAttribute(`opacity`)),
                i = n.find((e) => e.hasAttribute(`opacity`));
              if (!r || !i) return;
              if (
                (r.setAttribute(`data-duotone-primary`, ``),
                i.setAttribute(`data-duotone-secondary`, ``),
                t.swapOpacity && r && i)
              ) {
                let e = i.getAttribute(`opacity`) || `0.4`;
                (r.style.setProperty(`--path-opacity`, e),
                  i.style.setProperty(`--path-opacity`, `1`));
              }
              e.setAttribute(`data-duotone-initialized`, ``);
            }
          }
        },
      }));
  });
function ui(e) {
  return `data:image/svg+xml,${encodeURIComponent(e)}`;
}
var di,
  fi,
  pi = e(() => {
    ((di = {
      solid: {
        backward: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M236.3 107.1C247.9 96 265 92.9 279.7 99.2C294.4 105.5 304 120 304 136L304 272.3L476.3 107.2C487.9 96 505 92.9 519.7 99.2C534.4 105.5 544 120 544 136L544 504C544 520 534.4 534.5 519.7 540.8C505 547.1 487.9 544 476.3 532.9L304 367.7L304 504C304 520 294.4 534.5 279.7 540.8C265 547.1 247.9 544 236.3 532.9L44.3 348.9C36.5 341.3 32 330.9 32 320C32 309.1 36.5 298.7 44.3 291.1L236.3 107.1z"/></svg>`,
        "backward-step": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M491 100.8C478.1 93.8 462.3 94.5 450 102.6L192 272.1L192 128C192 110.3 177.7 96 160 96C142.3 96 128 110.3 128 128L128 512C128 529.7 142.3 544 160 544C177.7 544 192 529.7 192 512L192 367.9L450 537.5C462.3 545.6 478 546.3 491 539.3C504 532.3 512 518.8 512 504.1L512 136.1C512 121.4 503.9 107.9 491 100.9z"/></svg>`,
        check: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M434.8 70.1c14.3 10.4 17.5 30.4 7.1 44.7l-256 352c-5.5 7.6-14 12.3-23.4 13.1s-18.5-2.7-25.1-9.3l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l101.5 101.5 234-321.7c10.4-14.3 30.4-17.5 44.7-7.1z"/></svg>`,
        "chevron-down": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>`,
        "chevron-left": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>`,
        "chevron-right": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M311.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L243.2 256 73.9 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>`,
        circle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0z"/></svg>`,
        "closed-captioning": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M64 192C64 156.7 92.7 128 128 128L512 128C547.3 128 576 156.7 576 192L576 448C576 483.3 547.3 512 512 512L128 512C92.7 512 64 483.3 64 448L64 192zM216 272L248 272C252.4 272 256 275.6 256 280C256 293.3 266.7 304 280 304C293.3 304 304 293.3 304 280C304 249.1 278.9 224 248 224L216 224C185.1 224 160 249.1 160 280L160 360C160 390.9 185.1 416 216 416L248 416C278.9 416 304 390.9 304 360C304 346.7 293.3 336 280 336C266.7 336 256 346.7 256 360C256 364.4 252.4 368 248 368L216 368C211.6 368 208 364.4 208 360L208 280C208 275.6 211.6 272 216 272zM384 280C384 275.6 387.6 272 392 272L424 272C428.4 272 432 275.6 432 280C432 293.3 442.7 304 456 304C469.3 304 480 293.3 480 280C480 249.1 454.9 224 424 224L392 224C361.1 224 336 249.1 336 280L336 360C336 390.9 361.1 416 392 416L424 416C454.9 416 480 390.9 480 360C480 346.7 469.3 336 456 336C442.7 336 432 346.7 432 360C432 364.4 428.4 368 424 368L392 368C387.6 368 384 364.4 384 360L384 280z"/></svg>`,
        "closed-captioning-slash": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M39 39.1C48.4 29.7 63.6 29.7 72.9 39.1L161.8 128L512 128C547.3 128 576 156.7 576 192L576 448C576 473.5 561.1 495.4 539.6 505.8L601 567.1C610.4 576.5 610.4 591.7 601 601C591.6 610.3 576.4 610.4 567.1 601L39 73.1C29.7 63.7 29.7 48.5 39 39.1zM384 350.1L384 279.9C384 275.5 387.6 271.9 392 271.9L424 271.9C428.4 271.9 432 275.5 432 279.9C432 293.2 442.7 303.9 456 303.9C469.3 303.9 480 293.2 480 279.9C480 249 454.9 223.9 424 223.9L392 223.9C361.1 223.9 336 249 336 279.9L336 302.1L384 350.1zM445.5 411.6C465.7 403.2 480 383.2 480 359.9C480 346.6 469.3 335.9 456 335.9C442.7 335.9 432 346.6 432 359.9C432 364.3 428.4 367.9 424 367.9L401.8 367.9L445.5 411.6zM162.3 264.1C160.8 269.1 160 274.5 160 280L160 360C160 390.9 185.1 416 216 416L248 416C266.1 416 282.1 407.5 292.4 394.2L410.2 512L128 512C92.7 512 64 483.3 64 448L64 192C64 184.2 65.4 176.7 68 169.8L162.3 264.1zM256.1 357.9C256 358.6 256 359.3 256 360C256 364.4 252.4 368 248 368L216 368C211.6 368 208 364.4 208 360L208 309.8L256.1 357.9z"/></svg>`,
        compress: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M160 64c0-17.7-14.3-32-32-32S96 46.3 96 64l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96zM32 320c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM352 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 320c-17.7 0-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0z"/></svg>`,
        "ellipsis-vertical": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M320 208C289.1 208 264 182.9 264 152C264 121.1 289.1 96 320 96C350.9 96 376 121.1 376 152C376 182.9 350.9 208 320 208zM320 432C350.9 432 376 457.1 376 488C376 518.9 350.9 544 320 544C289.1 544 264 518.9 264 488C264 457.1 289.1 432 320 432zM376 320C376 350.9 350.9 376 320 376C289.1 376 264 350.9 264 320C264 289.1 289.1 264 320 264C350.9 264 376 289.1 376 320z"/></svg>`,
        expand: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M128 96C110.3 96 96 110.3 96 128L96 224C96 241.7 110.3 256 128 256C145.7 256 160 241.7 160 224L160 160L224 160C241.7 160 256 145.7 256 128C256 110.3 241.7 96 224 96L128 96zM160 416C160 398.3 145.7 384 128 384C110.3 384 96 398.3 96 416L96 512C96 529.7 110.3 544 128 544L224 544C241.7 544 256 529.7 256 512C256 494.3 241.7 480 224 480L160 480L160 416zM416 96C398.3 96 384 110.3 384 128C384 145.7 398.3 160 416 160L480 160L480 224C480 241.7 494.3 256 512 256C529.7 256 544 241.7 544 224L544 128C544 110.3 529.7 96 512 96L416 96zM544 416C544 398.3 529.7 384 512 384C494.3 384 480 398.3 480 416L480 480L416 480C398.3 480 384 494.3 384 512C384 529.7 398.3 544 416 544L512 544C529.7 544 544 529.7 544 512L544 416z"/></svg>`,
        eyedropper: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M341.6 29.2l-101.6 101.6-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4 101.6-101.6c39-39 39-102.2 0-141.1s-102.2-39-141.1 0zM55.4 323.3c-15 15-23.4 35.4-23.4 56.6l0 42.4-26.6 39.9c-8.5 12.7-6.8 29.6 4 40.4s27.7 12.5 40.4 4l39.9-26.6 42.4 0c21.2 0 41.6-8.4 56.6-23.4l109.4-109.4-45.3-45.3-109.4 109.4c-3 3-7.1 4.7-11.3 4.7l-36.1 0 0-36.1c0-4.2 1.7-8.3 4.7-11.3l109.4-109.4-45.3-45.3-109.4 109.4z"/></svg>`,
        forward: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M403.7 107.1C392.1 96 375 92.9 360.3 99.2C345.6 105.5 336 120 336 136L336 272.3L163.7 107.2C152.1 96 135 92.9 120.3 99.2C105.6 105.5 96 120 96 136L96 504C96 520 105.6 534.5 120.3 540.8C135 547.1 152.1 544 163.7 532.9L336 367.7L336 504C336 520 345.6 534.5 360.3 540.8C375 547.1 392.1 544 403.7 532.9L595.7 348.9C603.6 341.4 608 330.9 608 320C608 309.1 603.5 298.7 595.7 291.1L403.7 107.1z"/></svg>`,
        file: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M192 64C156.7 64 128 92.7 128 128L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 234.5C512 217.5 505.3 201.2 493.3 189.2L386.7 82.7C374.7 70.7 358.5 64 341.5 64L192 64zM453.5 240L360 240C346.7 240 336 229.3 336 216L336 122.5L453.5 240z"/></svg>`,
        "file-audio": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM389.8 307.7C380.7 301.4 368.3 303.6 362 312.7C355.7 321.8 357.9 334.2 367 340.5C390.9 357.2 406.4 384.8 406.4 416C406.4 447.2 390.8 474.9 367 491.5C357.9 497.8 355.7 510.3 362 519.3C368.3 528.3 380.8 530.6 389.8 524.3C423.9 500.5 446.4 460.8 446.4 416C446.4 371.2 424 331.5 389.8 307.7zM208 376C199.2 376 192 383.2 192 392L192 440C192 448.8 199.2 456 208 456L232 456L259.2 490C262.2 493.8 266.8 496 271.7 496L272 496C280.8 496 288 488.8 288 480L288 352C288 343.2 280.8 336 272 336L271.7 336C266.8 336 262.2 338.2 259.2 342L232 376L208 376zM336 448.2C336 458.9 346.5 466.4 354.9 459.8C367.8 449.5 376 433.7 376 416C376 398.3 367.8 382.5 354.9 372.2C346.5 365.5 336 373.1 336 383.8L336 448.3z"/></svg>`,
        "file-code": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM282.2 359.6C290.8 349.5 289.7 334.4 279.6 325.8C269.5 317.2 254.4 318.3 245.8 328.4L197.8 384.4C190.1 393.4 190.1 406.6 197.8 415.6L245.8 471.6C254.4 481.7 269.6 482.8 279.6 474.2C289.6 465.6 290.8 450.4 282.2 440.4L247.6 400L282.2 359.6zM394.2 328.4C385.6 318.3 370.4 317.2 360.4 325.8C350.4 334.4 349.2 349.6 357.8 359.6L392.4 400L357.8 440.4C349.2 450.5 350.3 465.6 360.4 474.2C370.5 482.8 385.6 481.7 394.2 471.6L442.2 415.6C449.9 406.6 449.9 393.4 442.2 384.4L394.2 328.4z"/></svg>`,
        "file-excel": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM292 330.7C284.6 319.7 269.7 316.7 258.7 324C247.7 331.3 244.7 346.3 252 357.3L291.2 416L252 474.7C244.6 485.7 247.6 500.6 258.7 508C269.8 515.4 284.6 512.4 292 501.3L320 459.3L348 501.3C355.4 512.3 370.3 515.3 381.3 508C392.3 500.7 395.3 485.7 388 474.7L348.8 416L388 357.3C395.4 346.3 392.4 331.4 381.3 324C370.2 316.6 355.4 319.6 348 330.7L320 372.7L292 330.7z"/></svg>`,
        "file-image": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM256 320C256 302.3 241.7 288 224 288C206.3 288 192 302.3 192 320C192 337.7 206.3 352 224 352C241.7 352 256 337.7 256 320zM220.6 512L419.4 512C435.2 512 448 499.2 448 483.4C448 476.1 445.2 469 440.1 463.7L343.3 361.9C337.3 355.6 328.9 352 320.1 352L319.8 352C311 352 302.7 355.6 296.6 361.9L199.9 463.7C194.8 469 192 476.1 192 483.4C192 499.2 204.8 512 220.6 512z"/></svg>`,
        "file-pdf": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M128 64C92.7 64 64 92.7 64 128L64 512C64 547.3 92.7 576 128 576L208 576L208 464C208 428.7 236.7 400 272 400L448 400L448 234.5C448 217.5 441.3 201.2 429.3 189.2L322.7 82.7C310.7 70.7 294.5 64 277.5 64L128 64zM389.5 240L296 240C282.7 240 272 229.3 272 216L272 122.5L389.5 240zM272 444C261 444 252 453 252 464L252 592C252 603 261 612 272 612C283 612 292 603 292 592L292 564L304 564C337.1 564 364 537.1 364 504C364 470.9 337.1 444 304 444L272 444zM304 524L292 524L292 484L304 484C315 484 324 493 324 504C324 515 315 524 304 524zM400 444C389 444 380 453 380 464L380 592C380 603 389 612 400 612L432 612C460.7 612 484 588.7 484 560L484 496C484 467.3 460.7 444 432 444L400 444zM420 572L420 484L432 484C438.6 484 444 489.4 444 496L444 560C444 566.6 438.6 572 432 572L420 572zM508 464L508 592C508 603 517 612 528 612C539 612 548 603 548 592L548 548L576 548C587 548 596 539 596 528C596 517 587 508 576 508L548 508L548 484L576 484C587 484 596 475 596 464C596 453 587 444 576 444L528 444C517 444 508 453 508 464z"/></svg>`,
        "file-powerpoint": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM280 320C266.7 320 256 330.7 256 344L256 488C256 501.3 266.7 512 280 512C293.3 512 304 501.3 304 488L304 464L328 464C367.8 464 400 431.8 400 392C400 352.2 367.8 320 328 320L280 320zM328 416L304 416L304 368L328 368C341.3 368 352 378.7 352 392C352 405.3 341.3 416 328 416z"/></svg>`,
        "file-video": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM208 368L208 464C208 481.7 222.3 496 240 496L336 496C353.7 496 368 481.7 368 464L368 440L403 475C406.2 478.2 410.5 480 415 480C424.4 480 432 472.4 432 463L432 368.9C432 359.5 424.4 351.9 415 351.9C410.5 351.9 406.2 353.7 403 356.9L368 391.9L368 367.9C368 350.2 353.7 335.9 336 335.9L240 335.9C222.3 335.9 208 350.2 208 367.9z"/></svg>`,
        "file-word": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM263.4 338.8C260.5 325.9 247.7 317.7 234.8 320.6C221.9 323.5 213.7 336.3 216.6 349.2L248.6 493.2C250.9 503.7 260 511.4 270.8 512C281.6 512.6 291.4 505.9 294.8 495.6L320 419.9L345.2 495.6C348.6 505.8 358.4 512.5 369.2 512C380 511.5 389.1 503.8 391.4 493.2L423.4 349.2C426.3 336.3 418.1 323.4 405.2 320.6C392.3 317.8 379.4 325.9 376.6 338.8L363.4 398.2L342.8 336.4C339.5 326.6 330.4 320 320 320C309.6 320 300.5 326.6 297.2 336.4L276.6 398.2L263.4 338.8z"/></svg>`,
        "file-zipper": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM192 136C192 149.3 202.7 160 216 160L264 160C277.3 160 288 149.3 288 136C288 122.7 277.3 112 264 112L216 112C202.7 112 192 122.7 192 136zM192 232C192 245.3 202.7 256 216 256L264 256C277.3 256 288 245.3 288 232C288 218.7 277.3 208 264 208L216 208C202.7 208 192 218.7 192 232zM256 304L224 304C206.3 304 192 318.3 192 336L192 384C192 410.5 213.5 432 240 432C266.5 432 288 410.5 288 384L288 336C288 318.3 273.7 304 256 304zM240 368C248.8 368 256 375.2 256 384C256 392.8 248.8 400 240 400C231.2 400 224 392.8 224 384C224 375.2 231.2 368 240 368z"/></svg>`,
        "forward-step": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M21 36.8c12.9-7 28.7-6.3 41 1.8L320 208.1 320 64c0-17.7 14.3-32 32-32s32 14.3 32 32l0 384c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-144.1-258 169.6c-12.3 8.1-28 8.8-41 1.8S0 454.7 0 440L0 72C0 57.3 8.1 43.8 21 36.8z"/></svg>`,
        gauge: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zm320 96c0-26.9-16.5-49.9-40-59.3L280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 172.7c-23.5 9.5-40 32.5-40 59.3 0 35.3 28.7 64 64 64s64-28.7 64-64zM144 176a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm-16 80a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM400 144a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>`,
        gear: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M259.1 73.5C262.1 58.7 275.2 48 290.4 48L350.2 48C365.4 48 378.5 58.7 381.5 73.5L396 143.5C410.1 149.5 423.3 157.2 435.3 166.3L503.1 143.8C517.5 139 533.3 145 540.9 158.2L570.8 210C578.4 223.2 575.7 239.8 564.3 249.9L511 297.3C511.9 304.7 512.3 312.3 512.3 320C512.3 327.7 511.8 335.3 511 342.7L564.4 390.2C575.8 400.3 578.4 417 570.9 430.1L541 481.9C533.4 495 517.6 501.1 503.2 496.3L435.4 473.8C423.3 482.9 410.1 490.5 396.1 496.6L381.7 566.5C378.6 581.4 365.5 592 350.4 592L290.6 592C275.4 592 262.3 581.3 259.3 566.5L244.9 496.6C230.8 490.6 217.7 482.9 205.6 473.8L137.5 496.3C123.1 501.1 107.3 495.1 99.7 481.9L69.8 430.1C62.2 416.9 64.9 400.3 76.3 390.2L129.7 342.7C128.8 335.3 128.4 327.7 128.4 320C128.4 312.3 128.9 304.7 129.7 297.3L76.3 249.8C64.9 239.7 62.3 223 69.8 209.9L99.7 158.1C107.3 144.9 123.1 138.9 137.5 143.7L205.3 166.2C217.4 157.1 230.6 149.5 244.6 143.4L259.1 73.5zM320.3 400C364.5 399.8 400.2 363.9 400 319.7C399.8 275.5 363.9 239.8 319.7 240C275.5 240.2 239.8 276.1 240 320.3C240.2 364.5 276.1 400.2 320.3 400z"/></svg>`,
        "grip-vertical": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M128 40c0-22.1-17.9-40-40-40L40 0C17.9 0 0 17.9 0 40L0 88c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48zm0 192c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48zM0 424l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40zM320 40c0-22.1-17.9-40-40-40L232 0c-22.1 0-40 17.9-40 40l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48zM192 232l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40zM320 424c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48z"/></svg>`,
        indeterminate: `<svg part="indeterminate-icon" class="icon" viewBox="0 0 16 16"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round"><g stroke="currentColor" stroke-width="2"><g transform="translate(2.285714 6.857143)"><path d="M10.2857143,1.14285714 L1.14285714,1.14285714"/></g></g></g></svg>`,
        minus: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32z"/></svg>`,
        pause: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M48 32C21.5 32 0 53.5 0 80L0 432c0 26.5 21.5 48 48 48l64 0c26.5 0 48-21.5 48-48l0-352c0-26.5-21.5-48-48-48L48 32zm224 0c-26.5 0-48 21.5-48 48l0 352c0 26.5 21.5 48 48 48l64 0c26.5 0 48-21.5 48-48l0-352c0-26.5-21.5-48-48-48l-64 0z"/></svg>`,
        "picture-in-picture": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M448 32c35.3 0 64 28.7 64 64l0 112-64 0 0-112-384 0 0 320 144 0 0 64-144 0-6.5-.3c-30.1-3.1-54.1-27-57.1-57.1L0 416 0 96C0 62.9 25.2 35.6 57.5 32.3L64 32 448 32zm16 224c26.5 0 48 21.5 48 48l0 128c0 26.5-21.5 48-48 48l-160 0c-26.5 0-48-21.5-48-48l0-128c0-26.5 21.5-48 48-48l160 0z"/></svg>`,
        play: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M91.2 36.9c-12.4-6.8-27.4-6.5-39.6 .7S32 57.9 32 72l0 368c0 14.1 7.5 27.2 19.6 34.4s27.2 7.5 39.6 .7l336-184c12.8-7 20.8-20.5 20.8-35.1s-8-28.1-20.8-35.1l-336-184z"/></svg>`,
        "play-circle": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9l0 176c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z"/></svg>`,
        plus: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z"/></svg>`,
        star: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M309.5-18.9c-4.1-8-12.4-13.1-21.4-13.1s-17.3 5.1-21.4 13.1L193.1 125.3 33.2 150.7c-8.9 1.4-16.3 7.7-19.1 16.3s-.5 18 5.8 24.4l114.4 114.5-25.2 159.9c-1.4 8.9 2.3 17.9 9.6 23.2s16.9 6.1 25 2L288.1 417.6 432.4 491c8 4.1 17.7 3.3 25-2s11-14.2 9.6-23.2L441.7 305.9 556.1 191.4c6.4-6.4 8.6-15.8 5.8-24.4s-10.1-14.9-19.1-16.3L383 125.3 309.5-18.9z"/></svg>`,
        upload: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M352 173.3L352 384C352 401.7 337.7 416 320 416C302.3 416 288 401.7 288 384L288 173.3L246.6 214.7C234.1 227.2 213.8 227.2 201.3 214.7C188.8 202.2 188.8 181.9 201.3 169.4L297.3 73.4C309.8 60.9 330.1 60.9 342.6 73.4L438.6 169.4C451.1 181.9 451.1 202.2 438.6 214.7C426.1 227.2 405.8 227.2 393.3 214.7L352 173.3zM320 464C364.2 464 400 428.2 400 384L480 384C515.3 384 544 412.7 544 448L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 448C96 412.7 124.7 384 160 384L240 384C240 428.2 275.8 464 320 464zM464 488C477.3 488 488 477.3 488 464C488 450.7 477.3 440 464 440C450.7 440 440 450.7 440 464C440 477.3 450.7 488 464 488z"/></svg>`,
        user: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M224 248a120 120 0 1 0 0-240 120 120 0 1 0 0 240zm-29.7 56C95.8 304 16 383.8 16 482.3 16 498.7 29.3 512 45.7 512l356.6 0c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3l-59.4 0z"/></svg>`,
        volume: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M48 352l48 0 134.1 119.2c6.4 5.7 14.6 8.8 23.1 8.8 19.2 0 34.8-15.6 34.8-34.8l0-378.4c0-19.2-15.6-34.8-34.8-34.8-8.5 0-16.7 3.1-23.1 8.8L96 160 48 160c-26.5 0-48 21.5-48 48l0 96c0 26.5 21.5 48 48 48zM441.1 107c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C443.3 170.7 464 210.9 464 256s-20.7 85.3-53.2 111.8c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5c43.2-35.2 70.9-88.9 70.9-149s-27.7-113.8-70.9-149zm-60.5 74.5c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C361.1 227.6 368 241 368 256s-6.9 28.4-17.7 37.3c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5C402.1 312.9 416 286.1 416 256s-13.9-56.9-35.5-74.5z"/></svg>`,
        "volume-low": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M48 352l48 0 134.1 119.2c6.4 5.7 14.6 8.8 23.1 8.8 19.2 0 34.8-15.6 34.8-34.8l0-378.4c0-19.2-15.6-34.8-34.8-34.8-8.5 0-16.7 3.1-23.1 8.8L96 160 48 160c-26.5 0-48 21.5-48 48l0 96c0 26.5 21.5 48 48 48zM380.6 181.5c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C361.1 227.6 368 241 368 256s-6.9 28.4-17.7 37.3c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5C402.1 312.9 416 286.1 416 256s-13.9-56.9-35.5-74.5z"/></svg>`,
        "volume-xmark": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M48 352l48 0 134.1 119.2c6.4 5.7 14.6 8.8 23.1 8.8 19.2 0 34.8-15.6 34.8-34.8l0-378.4c0-19.2-15.6-34.8-34.8-34.8-8.5 0-16.7 3.1-23.1 8.8L96 160 48 160c-26.5 0-48 21.5-48 48l0 96c0 26.5 21.5 48 48 48zM367 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/></svg>`,
        xmark: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"/></svg>`,
      },
      regular: {
        calendar: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M216 64C229.3 64 240 74.7 240 88L240 128L400 128L400 88C400 74.7 410.7 64 424 64C437.3 64 448 74.7 448 88L448 128L480 128C515.3 128 544 156.7 544 192L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 192C96 156.7 124.7 128 160 128L192 128L192 88C192 74.7 202.7 64 216 64zM216 176L160 176C151.2 176 144 183.2 144 192L144 240L496 240L496 192C496 183.2 488.8 176 480 176L216 176zM144 288L144 480C144 488.8 151.2 496 160 496L480 496C488.8 496 496 488.8 496 480L496 288L144 288z"/></svg>`,
        "circle-question": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M464 256a208 208 0 1 0 -416 0 208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zm256-80c-17.7 0-32 14.3-32 32 0 13.3-10.7 24-24 24s-24-10.7-24-24c0-44.2 35.8-80 80-80s80 35.8 80 80c0 47.2-36 67.2-56 74.5l0 3.8c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-8.1c0-20.5 14.8-35.2 30.1-40.2 6.4-2.1 13.2-5.5 18.2-10.3 4.3-4.2 7.7-10 7.7-19.6 0-17.7-14.3-32-32-32zM224 368a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>`,
        "circle-xmark": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM167 167c-9.4 9.4-9.4 24.6 0 33.9l55 55-55 55c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l55-55 55 55c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-55-55 55-55c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-55 55-55-55c-9.4-9.4-24.6-9.4-33.9 0z"/></svg>`,
        clock: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112C434.9 112 528 205.1 528 320zM64 320C64 461.4 178.6 576 320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320zM296 184L296 320C296 328 300 335.5 306.7 340L402.7 404C413.7 411.4 428.6 408.4 436 397.3C443.4 386.2 440.4 371.4 429.3 364L344 307.2L344 184C344 170.7 333.3 160 320 160C306.7 160 296 170.7 296 184z"/></svg>`,
        copy: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M384 336l-192 0c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l133.5 0c4.2 0 8.3 1.7 11.3 4.7l58.5 58.5c3 3 4.7 7.1 4.7 11.3L400 320c0 8.8-7.2 16-16 16zM192 384l192 0c35.3 0 64-28.7 64-64l0-197.5c0-17-6.7-33.3-18.7-45.3L370.7 18.7C358.7 6.7 342.5 0 325.5 0L192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-16-48 0 0 16c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l16 0 0-48-16 0z"/></svg>`,
        eye: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M288 80C222.8 80 169.2 109.6 128.1 147.7 89.6 183.5 63 226 49.4 256 63 286 89.6 328.5 128.1 364.3 169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256 513 226 486.4 183.5 447.9 147.7 406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1 3.3 7.9 3.3 16.7 0 24.6-14.9 35.7-46.2 87.7-93 131.1-47.1 43.7-111.8 80.6-192.6 80.6S142.5 443.2 95.4 399.4c-46.8-43.5-78.1-95.4-93-131.1-3.3-7.9-3.3-16.7 0-24.6 14.9-35.7 46.2-87.7 93-131.1zM288 336c44.2 0 80-35.8 80-80 0-29.6-16.1-55.5-40-69.3-1.4 59.7-49.6 107.9-109.3 109.3 13.8 23.9 39.7 40 69.3 40zm-79.6-88.4c2.5 .3 5 .4 7.6 .4 35.3 0 64-28.7 64-64 0-2.6-.2-5.1-.4-7.6-37.4 3.9-67.2 33.7-71.1 71.1zm45.6-115c10.8-3 22.2-4.5 33.9-4.5 8.8 0 17.5 .9 25.8 2.6 .3 .1 .5 .1 .8 .2 57.9 12.2 101.4 63.7 101.4 125.2 0 70.7-57.3 128-128 128-61.6 0-113-43.5-125.2-101.4-1.8-8.6-2.8-17.5-2.8-26.6 0-11 1.4-21.8 4-32 .2-.7 .3-1.3 .5-1.9 11.9-43.4 46.1-77.6 89.5-89.5z"/></svg>`,
        "eye-slash": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M41-24.9c-9.4-9.4-24.6-9.4-33.9 0S-2.3-.3 7 9.1l528 528c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-96.4-96.4c2.7-2.4 5.4-4.8 8-7.2 46.8-43.5 78.1-95.4 93-131.1 3.3-7.9 3.3-16.7 0-24.6-14.9-35.7-46.2-87.7-93-131.1-47.1-43.7-111.8-80.6-192.6-80.6-56.8 0-105.6 18.2-146 44.2L41-24.9zM176.9 111.1c32.1-18.9 69.2-31.1 111.1-31.1 65.2 0 118.8 29.6 159.9 67.7 38.5 35.7 65.1 78.3 78.6 108.3-13.6 30-40.2 72.5-78.6 108.3-3.1 2.8-6.2 5.6-9.4 8.4L393.8 328c14-20.5 22.2-45.3 22.2-72 0-70.7-57.3-128-128-128-26.7 0-51.5 8.2-72 22.2l-39.1-39.1zm182 182l-108-108c11.1-5.8 23.7-9.1 37.1-9.1 44.2 0 80 35.8 80 80 0 13.4-3.3 26-9.1 37.1zM103.4 173.2l-34-34c-32.6 36.8-55 75.8-66.9 104.5-3.3 7.9-3.3 16.7 0 24.6 14.9 35.7 46.2 87.7 93 131.1 47.1 43.7 111.8 80.6 192.6 80.6 37.3 0 71.2-7.9 101.5-20.6L352.2 422c-20 6.4-41.4 10-64.2 10-65.2 0-118.8-29.6-159.9-67.7-38.5-35.7-65.1-78.3-78.6-108.3 10.4-23.1 28.6-53.6 54-82.8z"/></svg>`,
        star: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M288.1-32c9 0 17.3 5.1 21.4 13.1L383 125.3 542.9 150.7c8.9 1.4 16.3 7.7 19.1 16.3s.5 18-5.8 24.4L441.7 305.9 467 465.8c1.4 8.9-2.3 17.9-9.6 23.2s-17 6.1-25 2L288.1 417.6 143.8 491c-8 4.1-17.7 3.3-25-2s-11-14.2-9.6-23.2L134.4 305.9 20 191.4c-6.4-6.4-8.6-15.8-5.8-24.4s10.1-14.9 19.1-16.3l159.9-25.4 73.6-144.2c4.1-8 12.4-13.1 21.4-13.1zm0 76.8L230.3 158c-3.5 6.8-10 11.6-17.6 12.8l-125.5 20 89.8 89.9c5.4 5.4 7.9 13.1 6.7 20.7l-19.8 125.5 113.3-57.6c6.8-3.5 14.9-3.5 21.8 0l113.3 57.6-19.8-125.5c-1.2-7.6 1.3-15.3 6.7-20.7l89.8-89.9-125.5-20c-7.6-1.2-14.1-6-17.6-12.8L288.1 44.8z"/></svg>`,
      },
    }),
      (fi = {
        name: `system`,
        resolver: (e, t = `classic`, n = `solid`) => {
          let r = di[n][e] ?? di.regular[e] ?? di.regular[`circle-question`];
          return r ? ui(r) : ``;
        },
      }));
  });
function mi(e) {
  bi.add(e);
}
function hi(e) {
  bi.delete(e);
}
function gi(e) {
  return yi.find((t) => t.name === e);
}
function _i() {
  return vi;
}
var vi,
  yi,
  bi,
  xi = e(() => {
    (li(), pi(), (vi = `classic`), (yi = [ci, fi]), (bi = new Set()));
  }),
  Si,
  Ci,
  wi,
  Ti,
  Y,
  Ei = e(() => {
    (Jr(),
      Xr(),
      Qr(),
      mt(),
      L(),
      xi(),
      F(),
      m(),
      i(),
      s(),
      (Si = Symbol()),
      (Ci = Symbol()),
      (Ti = new Map()),
      (Y = class extends I {
        constructor() {
          (super(...arguments),
            (this.svg = null),
            (this.autoWidth = !1),
            (this.swapOpacity = !1),
            (this.label = ``),
            (this.library = `default`),
            (this.rotate = 0),
            (this.resolveIcon = async (e, t) => {
              let n;
              if (t?.spriteSheet) {
                (this.hasUpdated || (await this.updateComplete),
                  (this.svg = f`<svg part="svg">
        <use part="use" href="${e}"></use>
      </svg>`),
                  await this.updateComplete);
                let n = this.shadowRoot.querySelector(`[part='svg']`);
                return (typeof t.mutator == `function` && t.mutator(n, this), this.svg);
              }
              try {
                if (((n = await fetch(e, { mode: `cors` })), !n.ok))
                  return n.status === 410 ? Si : Ci;
              } catch {
                return Ci;
              }
              try {
                let e = document.createElement(`div`);
                e.innerHTML = await n.text();
                let t = e.firstElementChild;
                if (t?.tagName?.toLowerCase() !== `svg`) return Si;
                wi ||= new DOMParser();
                let r = wi.parseFromString(t.outerHTML, `text/html`).body.querySelector(`svg`);
                return r ? (r.part.add(`svg`), document.adoptNode(r)) : Si;
              } catch {
                return Si;
              }
            }));
        }
        connectedCallback() {
          (super.connectedCallback(), mi(this));
        }
        firstUpdated(e) {
          (super.firstUpdated(e),
            this.hasAttribute(`rotate`) &&
              this.style.setProperty(`--rotate-angle`, `${this.rotate}deg`),
            this.setIcon());
        }
        disconnectedCallback() {
          (super.disconnectedCallback(), hi(this));
        }
        async getIconSource() {
          let e = gi(this.library),
            t = this.family || _i();
          if (this.name && e) {
            let n = this.canvas === `auto` || this.autoWidth,
              r;
            try {
              r = await e.resolver(this.name, t, this.variant, n);
            } catch {
              r = void 0;
            }
            return { url: r, fromLibrary: !0 };
          }
          return { url: this.src, fromLibrary: !1 };
        }
        handleLabelChange() {
          typeof this.label == `string` && this.label.length > 0
            ? (this.setAttribute(`role`, `img`),
              this.setAttribute(`aria-label`, this.label),
              this.removeAttribute(`aria-hidden`))
            : (this.removeAttribute(`role`),
              this.removeAttribute(`aria-label`),
              this.setAttribute(`aria-hidden`, `true`));
        }
        async setIcon() {
          let { url: e, fromLibrary: t } = await this.getIconSource(),
            n = t ? gi(this.library) : void 0;
          if (!e) {
            this.svg = null;
            return;
          }
          let r = Ti.get(e);
          r || ((r = this.resolveIcon(e, n)), Ti.set(e, r));
          let i = await r;
          if ((i === Ci && Ti.delete(e), e === (await this.getIconSource()).url)) {
            if (a(i)) {
              this.svg = i;
              return;
            }
            switch (i) {
              case Ci:
              case Si:
                ((this.svg = null), this.dispatchEvent(new qr()));
                break;
              default:
                ((this.svg = i.cloneNode(!0)),
                  n?.mutator?.(this.svg, this),
                  this.dispatchEvent(new Yr()));
            }
          }
        }
        willUpdate(e) {
          return (
            this.style || this.setStyleProperty(`--rotate-angle`, `${this.rotate}deg`),
            super.willUpdate(e)
          );
        }
        updated(e) {
          super.updated(e);
          let t = gi(this.library);
          this.hasAttribute(`rotate`) &&
            this.style.setProperty(`--rotate-angle`, `${this.rotate}deg`);
          let n = this.shadowRoot?.querySelector(`svg`);
          n && t?.mutator?.(n, this);
        }
        render() {
          return this.hasUpdated
            ? this.svg
            : f`<svg part="svg" width="16" height="16" viewBox="0 0 16 16"></svg>`;
        }
      }),
      (Y.css = Zr),
      P([u()], Y.prototype, `svg`, 2),
      P([d({ reflect: !0 })], Y.prototype, `name`, 2),
      P([d({ reflect: !0 })], Y.prototype, `family`, 2),
      P([d({ reflect: !0 })], Y.prototype, `variant`, 2),
      P([d({ reflect: !0 })], Y.prototype, `canvas`, 2),
      P([d({ attribute: `auto-width`, type: Boolean, reflect: !0 })], Y.prototype, `autoWidth`, 2),
      P(
        [d({ attribute: `swap-opacity`, type: Boolean, reflect: !0 })],
        Y.prototype,
        `swapOpacity`,
        2,
      ),
      P([d()], Y.prototype, `src`, 2),
      P([d()], Y.prototype, `label`, 2),
      P([d({ reflect: !0 })], Y.prototype, `library`, 2),
      P([d({ type: Number, reflect: !0 })], Y.prototype, `rotate`, 2),
      P([d({ type: String, reflect: !0 })], Y.prototype, `flip`, 2),
      P([d({ type: String, reflect: !0 })], Y.prototype, `animation`, 2),
      P([N(`label`)], Y.prototype, `handleLabelChange`, 1),
      P(
        [
          N([`family`, `name`, `library`, `variant`, `src`, `autoWidth`, `canvas`, `swapOpacity`], {
            waitUntilFirstUpdate: !0,
          }),
        ],
        Y.prototype,
        `setIcon`,
        1,
      ),
      (Y = P([t(`wa-icon`)], Y)));
  }),
  Di = e(() => {
    (Ar(), Ve(), Fr(), Mr(), Kr(), zr(), ft(), Ei(), Qr(), L(), R(), zt());
  }),
  Oi = e(() => {
    (Fr(), Mr(), Ei(), Qr(), L());
  }),
  ki,
  Ai = e(() => {
    (m(),
      (ki = b`
  :host {
    --max-width: 30ch;

    /** These styles are added so we don't interfere in the DOM. */
    display: inline-block;
    position: absolute;

    /** Defaults for inherited CSS properties */
    color: var(--wa-tooltip-content-color);
    font-size: var(--wa-tooltip-font-size);
    line-height: var(--wa-tooltip-line-height);
    text-align: start;
    white-space: normal;
  }

  .tooltip {
    --arrow-size: var(--wa-tooltip-arrow-size);
    --arrow-color: var(--wa-tooltip-background-color);
  }

  .tooltip::part(popup) {
    z-index: 1000;
  }

  .tooltip[placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .tooltip[placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  .tooltip[placement^='left']::part(popup) {
    transform-origin: right;
  }

  .tooltip[placement^='right']::part(popup) {
    transform-origin: left;
  }

  .body {
    display: block;
    width: max-content;
    max-width: var(--max-width);
    border-radius: var(--wa-tooltip-border-radius);
    background-color: var(--wa-tooltip-background-color);
    border: var(--wa-tooltip-border-width) var(--wa-tooltip-border-style) var(--wa-tooltip-border-color);
    padding: 0.25em 0.5em;
    user-select: none;
    -webkit-user-select: none;
  }

  .tooltip {
    --popup-border-width: var(--wa-tooltip-border-width);

    &::part(arrow) {
      border-bottom: var(--wa-tooltip-border-width) var(--wa-tooltip-border-style) var(--wa-tooltip-border-color);
      border-right: var(--wa-tooltip-border-width) var(--wa-tooltip-border-style) var(--wa-tooltip-border-color);
    }
  }
`));
  });
function ji(e, t) {
  return new Promise((n) => {
    function r(i) {
      i.target === e && (e.removeEventListener(t, r), n());
    }
    e.addEventListener(t, r);
  });
}
var Mi = e(() => {}),
  X,
  Ni = e(() => {
    (Ai(),
      Ue(),
      Ge(),
      qe(),
      Ye(),
      Kr(),
      et(),
      ot(),
      Mi(),
      pt(),
      mt(),
      L(),
      F(),
      m(),
      i(),
      g(),
      (X = class extends I {
        constructor() {
          (super(...arguments),
            (this.placement = `top`),
            (this.disabled = !1),
            (this.distance = 8),
            (this.open = !1),
            (this.skidding = 0),
            (this.showDelay = 150),
            (this.hideDelay = 0),
            (this.trigger = `hover focus`),
            (this.withoutArrow = !1),
            (this.for = null),
            (this.anchor = null),
            (this.eventController = new AbortController()),
            (this.handleBlur = () => {
              this.hasTrigger(`focus`) && this.hide();
            }),
            (this.handleClick = () => {
              this.hasTrigger(`click`) && (this.open ? this.hide() : this.show());
            }),
            (this.handleFocus = () => {
              this.hasTrigger(`focus`) && this.show();
            }),
            (this.handleDocumentKeyDown = (e) => {
              e.key === `Escape` &&
                this.open &&
                Qe(this) &&
                (e.preventDefault(), e.stopPropagation(), this.hide());
            }),
            (this.handleMouseOver = () => {
              this.hasTrigger(`hover`) &&
                (clearTimeout(this.hoverTimeout),
                (this.hoverTimeout = window.setTimeout(() => this.show(), this.showDelay)));
            }),
            (this.handleMouseOut = (e) => {
              if (this.hasTrigger(`hover`)) {
                let t = e.relatedTarget,
                  n = !!(t && this.anchor?.contains(t)),
                  r = !!(t && this.contains(t));
                if (n || r) return;
                (clearTimeout(this.hoverTimeout),
                  (this.hoverTimeout = window.setTimeout(() => {
                    this.hide();
                  }, this.hideDelay)));
              }
            }));
        }
        connectedCallback() {
          (super.connectedCallback(),
            typeof document < `u` &&
              (this.eventController.signal.aborted &&
                (this.eventController = new AbortController()),
              this.addEventListener(`mouseout`, this.handleMouseOut),
              this.open &&
                ((this.open = !1),
                this.updateComplete.then(() => {
                  this.open = !0;
                })),
              (this.id ||= at(`wa-tooltip-`)),
              this.for && this.anchor
                ? ((this.anchor = null), this.handleForChange())
                : this.for && this.handleForChange()));
        }
        disconnectedCallback() {
          (super.disconnectedCallback(),
            document.removeEventListener(`keydown`, this.handleDocumentKeyDown),
            Ze(this),
            this.eventController.abort(),
            this.anchor && this.removeFromAriaLabelledBy(this.anchor, this.id));
        }
        firstUpdated() {
          ((this.body.hidden = !this.open),
            this.open && ((this.popup.active = !0), this.popup.reposition()));
        }
        hasTrigger(e) {
          return this.trigger.split(` `).includes(e);
        }
        addToAriaLabelledBy(e, t) {
          let n = (e.getAttribute(`aria-labelledby`) || ``).split(/\s+/).filter(Boolean);
          n.includes(t) || (n.push(t), e.setAttribute(`aria-labelledby`, n.join(` `)));
        }
        removeFromAriaLabelledBy(e, t) {
          let n = (e.getAttribute(`aria-labelledby`) || ``)
            .split(/\s+/)
            .filter(Boolean)
            .filter((e) => e !== t);
          n.length > 0
            ? e.setAttribute(`aria-labelledby`, n.join(` `))
            : e.removeAttribute(`aria-labelledby`);
        }
        async handleOpenChange() {
          if (this.open) {
            if (this.disabled) return;
            let e = new He();
            if ((this.dispatchEvent(e), e.defaultPrevented)) {
              this.open = !1;
              return;
            }
            (document.addEventListener(`keydown`, this.handleDocumentKeyDown, {
              signal: this.eventController.signal,
            }),
              Xe(this),
              (this.body.hidden = !1),
              (this.popup.active = !0),
              await M(this.popup.popup, `show-with-scale`),
              this.popup.reposition(),
              this.dispatchEvent(new Ke()));
          } else {
            let e = new We();
            if ((this.dispatchEvent(e), e.defaultPrevented)) {
              this.open = !1;
              return;
            }
            (document.removeEventListener(`keydown`, this.handleDocumentKeyDown),
              Ze(this),
              await M(this.popup.popup, `hide-with-scale`),
              (this.popup.active = !1),
              (this.body.hidden = !0),
              this.dispatchEvent(new Je()));
          }
        }
        handleForChange() {
          let e = this.getRootNode?.();
          if (!e) return;
          let t = this.for ? e.getElementById?.(this.for) : null,
            n = this.anchor;
          if (t === n) return;
          let { signal: r } = this.eventController;
          (t &&
            (this.addToAriaLabelledBy(t, this.id),
            t.addEventListener(`blur`, this.handleBlur, { capture: !0, signal: r }),
            t.addEventListener(`focus`, this.handleFocus, { capture: !0, signal: r }),
            t.addEventListener(`click`, this.handleClick, { signal: r }),
            t.addEventListener(`mouseover`, this.handleMouseOver, { signal: r }),
            t.addEventListener(`mouseout`, this.handleMouseOut, { signal: r })),
            n &&
              (this.removeFromAriaLabelledBy(n, this.id),
              n.removeEventListener(`blur`, this.handleBlur, { capture: !0 }),
              n.removeEventListener(`focus`, this.handleFocus, { capture: !0 }),
              n.removeEventListener(`click`, this.handleClick),
              n.removeEventListener(`mouseover`, this.handleMouseOver),
              n.removeEventListener(`mouseout`, this.handleMouseOut)),
            (this.anchor = t));
        }
        async handleOptionsChange() {
          this.hasUpdated && (await this.updateComplete, this.popup.reposition());
        }
        handleDisabledChange() {
          this.disabled && this.open && this.hide();
        }
        async show() {
          if (!this.open) return ((this.open = !0), ji(this, `wa-after-show`));
        }
        async hide() {
          if (this.open) return ((this.open = !1), ji(this, `wa-after-hide`));
        }
        render() {
          return f`
      <wa-popup
        part="base"
        exportparts="
          popup:base__popup,
          arrow:base__arrow
        "
        class=${n({ tooltip: !0, "tooltip-open": this.open })}
        placement=${this.placement}
        distance=${this.distance}
        skidding=${this.skidding}
        flip
        shift
        ?arrow=${!this.withoutArrow}
        hover-bridge
        .anchor=${this.anchor}
      >
        <div part="body" class="body">
          <slot></slot>
        </div>
      </wa-popup>
    `;
        }
      }),
      (X.css = ki),
      (X.dependencies = { "wa-popup": J }),
      P([o(`slot:not([name])`)], X.prototype, `defaultSlot`, 2),
      P([o(`.body`)], X.prototype, `body`, 2),
      P([o(`wa-popup`)], X.prototype, `popup`, 2),
      P([d()], X.prototype, `placement`, 2),
      P([d({ type: Boolean, reflect: !0 })], X.prototype, `disabled`, 2),
      P([d({ type: Number })], X.prototype, `distance`, 2),
      P([d({ type: Boolean, reflect: !0 })], X.prototype, `open`, 2),
      P([d({ type: Number })], X.prototype, `skidding`, 2),
      P([d({ attribute: `show-delay`, type: Number })], X.prototype, `showDelay`, 2),
      P([d({ attribute: `hide-delay`, type: Number })], X.prototype, `hideDelay`, 2),
      P([d()], X.prototype, `trigger`, 2),
      P(
        [d({ attribute: `without-arrow`, type: Boolean, reflect: !0 })],
        X.prototype,
        `withoutArrow`,
        2,
      ),
      P([d()], X.prototype, `for`, 2),
      P([u()], X.prototype, `anchor`, 2),
      P([N(`open`, { waitUntilFirstUpdate: !0 })], X.prototype, `handleOpenChange`, 1),
      P([N(`for`)], X.prototype, `handleForChange`, 1),
      P([N([`distance`, `placement`, `skidding`])], X.prototype, `handleOptionsChange`, 1),
      P([N(`disabled`)], X.prototype, `handleDisabledChange`, 1),
      (X = P([t(`wa-tooltip`)], X)));
  }),
  Pi = e(() => {
    (Ni(), Ai(), Kr(), zr(), L(), R(), zt());
  });
function Fi(e) {
  return {
    days: Math.trunc(e / 864e5),
    hours: Math.trunc((e / 36e5) % 24),
    minutes: Math.trunc((e / 6e4) % 60),
    seconds: Math.trunc((e / 1e3) % 60),
    milliseconds: Math.trunc(e % 1e3),
    microseconds: Math.trunc(Ri(e * 1e3) % 1e3),
    nanoseconds: Math.trunc(Ri(e * 1e6) % 1e3),
  };
}
function Ii(e) {
  return {
    days: e / 86400000n,
    hours: (e / 3600000n) % 24n,
    minutes: (e / 60000n) % 60n,
    seconds: (e / 1000n) % 60n,
    milliseconds: e % 1000n,
    microseconds: 0n,
    nanoseconds: 0n,
  };
}
function Li(e) {
  switch (typeof e) {
    case `number`:
      if (Number.isFinite(e)) return Fi(e);
      break;
    case `bigint`:
      return Ii(e);
  }
  throw TypeError(`Expected a finite number or bigint`);
}
var Ri,
  zi = e(() => {
    Ri = (e) => (Number.isFinite(e) ? e : 0);
  });
function Bi(e, t) {
  return {
    top: Math.round(e.getBoundingClientRect().top - t.getBoundingClientRect().top),
    left: Math.round(e.getBoundingClientRect().left - t.getBoundingClientRect().left),
  };
}
function Vi() {
  let e = document.documentElement.clientWidth;
  return Math.abs(window.innerWidth - e);
}
function Hi() {
  let e = Number(getComputedStyle(document.body).paddingRight.replace(/px/, ``));
  return isNaN(e) || !e ? 0 : e;
}
function Ui(e) {
  if ((Ki.add(e), !document.documentElement.classList.contains(`wa-scroll-lock`))) {
    let e = Vi() + Hi(),
      t = getComputedStyle(document.documentElement).scrollbarGutter;
    ((!t || t === `auto`) && (t = `stable`),
      e < 2 && (t = ``),
      document.documentElement.style.setProperty(`--wa-scroll-lock-gutter`, t),
      document.documentElement.classList.add(`wa-scroll-lock`),
      document.documentElement.style.setProperty(`--wa-scroll-lock-size`, `${e}px`));
  }
}
function Wi(e) {
  (Ki.delete(e),
    Ki.size === 0 &&
      (document.documentElement.classList.remove(`wa-scroll-lock`),
      document.documentElement.style.removeProperty(`--wa-scroll-lock-size`)));
}
function Gi(e, t, n = `vertical`, r = `smooth`) {
  let i = Bi(e, t),
    a = i.top + t.scrollTop,
    o = i.left + t.scrollLeft,
    s = t.scrollLeft,
    c = t.scrollLeft + t.offsetWidth,
    l = t.scrollTop,
    u = t.scrollTop + t.offsetHeight;
  ((n === `horizontal` || n === `both`) &&
    (o < s
      ? t.scrollTo({ left: o, behavior: r })
      : o + e.clientWidth > c &&
        t.scrollTo({ left: o - t.offsetWidth + e.clientWidth, behavior: r })),
    (n === `vertical` || n === `both`) &&
      (a < l
        ? t.scrollTo({ top: a, behavior: r })
        : a + e.clientHeight > u &&
          t.scrollTo({ top: a - t.offsetHeight + e.clientHeight, behavior: r })));
}
var Ki,
  qi = e(() => {
    Ki = new Set();
  });
function Ji(e) {
  return e
    .split(` `)
    .map((e) => e.trim())
    .filter((e) => e !== ``);
}
var Yi = e(() => {}),
  Xi,
  Zi = e(() => {
    (m(),
      (Xi = b`
  :host {
    --width: 31rem;
    --spacing: var(--wa-space-l);
    --backdrop-filter: none;
    --show-duration: var(--wa-transition-normal);
    --hide-duration: var(--wa-transition-normal);

    display: none;
  }

  :host([open]) {
    display: block;
  }

  .dialog {
    display: flex;
    flex-direction: column;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: var(--width);
    max-width: calc(100% - var(--wa-space-2xl));
    max-height: calc(100% - var(--wa-space-2xl));
    color: inherit;
    background-color: var(--wa-color-surface-raised);
    border-radius: var(--wa-panel-border-radius);
    border: none;
    box-shadow: var(--wa-shadow-l);
    padding: 0;
    margin: auto;

    &.show {
      animation: show-dialog var(--show-duration) ease;

      &::backdrop {
        animation: show-backdrop var(--show-duration, 200ms) ease;
      }
    }

    &.hide {
      animation: show-dialog var(--hide-duration) ease reverse;

      &::backdrop {
        animation: show-backdrop var(--hide-duration, 200ms) ease reverse;
      }
    }

    &.pulse {
      animation: pulse 250ms ease;
    }
  }

  .dialog:focus {
    outline: none;
  }

  /* Ensure there's enough vertical padding for phones that don't update vh when chrome appears (e.g. iPhone) */
  @media screen and (max-width: 420px) {
    .dialog {
      max-height: 80vh;
    }
  }

  .open {
    display: flex;
    opacity: 1;
  }

  .header {
    flex: 0 0 auto;
    display: flex;
    flex-wrap: nowrap;

    padding-inline-start: var(--spacing);
    padding-block-end: 0;

    /* Subtract the close button's padding so that the X is visually aligned with the edges of the dialog content */
    padding-inline-end: calc(var(--spacing) - var(--wa-form-control-padding-block));
    padding-block-start: calc(var(--spacing) - var(--wa-form-control-padding-block));
  }

  .title {
    align-self: center;
    flex: 1 1 auto;
    font-family: inherit;
    font-size: var(--wa-font-size-l);
    font-weight: var(--wa-font-weight-heading);
    line-height: var(--wa-line-height-condensed);
    margin: 0;
  }

  .header-actions {
    align-self: start;
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    justify-content: end;
    gap: var(--wa-space-2xs);
    padding-inline-start: var(--spacing);
  }

  .header-actions wa-button,
  .header-actions ::slotted(wa-button) {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .body {
    flex: 1 1 auto;
    display: block;
    padding: var(--spacing);
    overflow: auto;
    -webkit-overflow-scrolling: touch;

    &:focus {
      outline: none;
    }

    &:focus-visible {
      outline: var(--wa-focus-ring);
      outline-offset: var(--wa-focus-ring-offset);
    }
  }

  .footer {
    flex: 0 0 auto;
    display: flex;
    flex-wrap: wrap;
    gap: var(--wa-space-xs);
    justify-content: end;
    padding: var(--spacing);
    padding-block-start: 0;
  }

  .footer ::slotted(wa-button:not(:first-of-type)) {
    margin-inline-start: var(--wa-spacing-xs);
  }

  .dialog::backdrop {
    /*
      NOTE: the ::backdrop element doesn't inherit properly in Safari yet, but it will in 17.4! At that time, we can
      remove the fallback values here.
    */
    background-color: var(--wa-color-overlay-modal, rgb(0 0 0 / 0.25));
    backdrop-filter: var(--backdrop-filter);
  }

  @keyframes pulse {
    0% {
      scale: 1;
    }
    50% {
      scale: 1.02;
    }
    100% {
      scale: 1;
    }
  }

  @keyframes show-dialog {
    from {
      opacity: 0;
      scale: 0.8;
    }
    to {
      opacity: 1;
      scale: 1;
    }
  }

  @keyframes show-backdrop {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (forced-colors: active) {
    .dialog {
      border: solid 1px white;
    }
  }
`));
  }),
  Z,
  Qi = e(() => {
    (qi(),
      Yi(),
      Ue(),
      Ge(),
      qe(),
      Ye(),
      Zi(),
      et(),
      Pr(),
      pt(),
      mt(),
      L(),
      R(),
      F(),
      m(),
      i(),
      g(),
      (Z = class extends I {
        constructor() {
          (super(...arguments),
            (this.localize = new Bt(this)),
            (this.hasSlotController = new Nr(this, `footer`, `header-actions`, `label`)),
            (this.open = !1),
            (this.label = ``),
            (this.withoutHeader = !1),
            (this.lightDismiss = !1),
            (this.withFooter = !1),
            (this.handleDocumentKeyDown = (e) => {
              e.key === `Escape` &&
                this.open &&
                Qe(this) &&
                (e.preventDefault(), e.stopPropagation(), this.requestClose(this.dialog));
            }));
        }
        firstUpdated() {
          this.open && (this.addOpenListeners(), this.dialog.showModal(), Ui(this));
        }
        disconnectedCallback() {
          (super.disconnectedCallback(), Wi(this), this.removeOpenListeners());
        }
        async requestClose(e) {
          let t = new We({ source: e });
          if ((this.dispatchEvent(t), t.defaultPrevented)) {
            ((this.open = !0), M(this.dialog, `pulse`));
            return;
          }
          (this.removeOpenListeners(),
            await M(this.dialog, `hide`),
            (this.open = !1),
            this.dialog.close(),
            Wi(this));
          let n = this.originalTrigger;
          (typeof n?.focus == `function` && setTimeout(() => n.focus()),
            this.dispatchEvent(new Je()));
        }
        addOpenListeners() {
          (document.addEventListener(`keydown`, this.handleDocumentKeyDown), Xe(this));
        }
        removeOpenListeners() {
          (document.removeEventListener(`keydown`, this.handleDocumentKeyDown), Ze(this));
        }
        handleDialogCancel(e) {
          (e.preventDefault(),
            !this.dialog.classList.contains(`hide`) &&
              e.target === this.dialog &&
              Qe(this) &&
              this.requestClose(this.dialog));
        }
        handleDialogClick(e) {
          let t = e.target.closest(`[data-dialog="close"]`);
          t && (e.stopPropagation(), this.requestClose(t));
        }
        async handleDialogPointerDown(e) {
          e.target === this.dialog &&
            (this.lightDismiss ? this.requestClose(this.dialog) : await M(this.dialog, `pulse`));
        }
        handleOpenChange() {
          this.open && !this.dialog.open
            ? this.show()
            : !this.open && this.dialog.open && ((this.open = !0), this.requestClose(this.dialog));
        }
        async show() {
          let e = new He();
          if ((this.dispatchEvent(e), e.defaultPrevented)) {
            this.open = !1;
            return;
          }
          (this.addOpenListeners(),
            (this.originalTrigger = document.activeElement),
            (this.open = !0),
            this.dialog.showModal(),
            Ui(this),
            requestAnimationFrame(() => {
              let e = this.querySelector(`[autofocus]`);
              e && typeof e.focus == `function` ? e.focus() : this.dialog.focus();
            }),
            await M(this.dialog, `show`),
            this.dispatchEvent(new Ke()));
        }
        render() {
          let e = !this.withoutHeader,
            t = this.hasSlotController.test(`footer`, `withFooter`);
          return f`
      <dialog
        part="dialog"
        class=${n({ dialog: !0, open: this.open })}
        @cancel=${this.handleDialogCancel}
        @click=${this.handleDialogClick}
        @pointerdown=${this.handleDialogPointerDown}
      >
        ${
          e
            ? f`
              <header part="header" class="header">
                <h2 part="title" class="title" id="title">
                  <!-- If there's no label, use an invisible character to prevent the header from collapsing -->
                  <slot name="label"> ${this.label.length > 0 ? this.label : `​`} </slot>
                </h2>
                <div part="header-actions" class="header-actions">
                  <slot name="header-actions"></slot>
                  <wa-button
                    part="close-button"
                    exportparts="base:close-button__base"
                    class="close"
                    appearance="plain"
                    @click="${(e) => this.requestClose(e.target)}"
                  >
                    <wa-icon
                      name="xmark"
                      label=${this.localize.term(`close`)}
                      library="system"
                      variant="solid"
                    ></wa-icon>
                  </wa-button>
                </div>
              </header>
            `
            : ``
        }

        <div part="body" class="body"><slot></slot></div>

        <!-- Use a hidden element so we still get "slotchange" events. -->
        <footer part="footer" class="footer" ?hidden=${!t}>
          <slot name="footer"></slot>
        </footer>
      </dialog>
    `;
        }
      }),
      (Z.css = Xi),
      P([o(`.dialog`)], Z.prototype, `dialog`, 2),
      P([d({ type: Boolean, reflect: !0 })], Z.prototype, `open`, 2),
      P([d({ reflect: !0 })], Z.prototype, `label`, 2),
      P(
        [d({ attribute: `without-header`, type: Boolean, reflect: !0 })],
        Z.prototype,
        `withoutHeader`,
        2,
      ),
      P([d({ attribute: `light-dismiss`, type: Boolean })], Z.prototype, `lightDismiss`, 2),
      P([d({ attribute: `with-footer`, type: Boolean })], Z.prototype, `withFooter`, 2),
      P([N(`open`, { waitUntilFirstUpdate: !0 })], Z.prototype, `handleOpenChange`, 1),
      (Z = P([t(`wa-dialog`)], Z)),
      document.addEventListener(`click`, (e) => {
        let t = e.target.closest(`[data-dialog]`);
        if (t instanceof Element) {
          let [e, n] = Ji(t.getAttribute(`data-dialog`) || ``);
          if (e === `open` && n?.length) {
            let e = t.getRootNode().getElementById(n);
            e?.localName === `wa-dialog`
              ? (e.open = !0)
              : console.warn(`A dialog with an ID of "${n}" could not be found in this document.`);
          }
        }
      }),
      document.addEventListener(`pointerdown`, () => {}));
  }),
  $i,
  ea = e(() => {
    $i = () => ({
      checkValidity(e) {
        let t = e.input,
          n = { message: ``, isValid: !0, invalidKeys: [] };
        if (!t) return n;
        let r = !0;
        if ((`checkValidity` in t && (r = t.checkValidity()), r)) return n;
        if (
          ((n.isValid = !1),
          `validationMessage` in t && (n.message = t.validationMessage),
          !(`validity` in t))
        )
          return (n.invalidKeys.push(`customError`), n);
        for (let e in t.validity) {
          if (e === `valid`) continue;
          let r = e;
          t.validity[r] && n.invalidKeys.push(r);
        }
        return n;
      },
    });
  }),
  ta,
  na = e(() => {
    ta = class extends Event {
      constructor() {
        super(`wa-invalid`, { bubbles: !0, cancelable: !1, composed: !0 });
      }
    };
  }),
  ra,
  Q,
  ia = e(() => {
    (na(),
      L(),
      F(),
      m(),
      i(),
      (ra = () => ({
        observedAttributes: [`custom-error`],
        checkValidity(e) {
          let t = { message: ``, isValid: !0, invalidKeys: [] };
          return (
            e.customError &&
              ((t.message = e.customError), (t.isValid = !1), (t.invalidKeys = [`customError`])),
            t
          );
        },
      })),
      (Q = class extends I {
        constructor() {
          (super(),
            (this.name = null),
            (this.disabled = !1),
            (this.required = !1),
            (this.assumeInteractionOn = [`input`]),
            (this.validators = []),
            (this.valueHasChanged = !1),
            (this.hasInteracted = !1),
            (this.customError = null),
            (this.emittedEvents = []),
            (this.emitInvalid = (e) => {
              e.target === this && ((this.hasInteracted = !0), this.dispatchEvent(new ta()));
            }),
            (this.handleInteraction = (e) => {
              let t = this.emittedEvents;
              (t.includes(e.type) || t.push(e.type),
                t.length === this.assumeInteractionOn?.length && (this.hasInteracted = !0));
            }),
            `addEventListener` in this && this.addEventListener(`invalid`, this.emitInvalid));
        }
        static get validators() {
          return [ra()];
        }
        static get observedAttributes() {
          let e = new Set(super.observedAttributes || []);
          for (let t of this.validators)
            if (t.observedAttributes) for (let n of t.observedAttributes) e.add(n);
          return [...e];
        }
        connectedCallback() {
          (super.connectedCallback(),
            this.didSSR && !this.hasUpdated
              ? this.updateComplete.then(() => {
                  this.updateValidity();
                })
              : this.updateValidity(),
            this.assumeInteractionOn.forEach((e) => {
              this.addEventListener?.(e, this.handleInteraction);
            }));
        }
        firstUpdated(...e) {
          (super.firstUpdated(...e), this.updateValidity());
        }
        willUpdate(e) {
          if (
            (e.has(`customError`) &&
              ((this.customError ||= null), this.setCustomValidity(this.customError || ``)),
            e.has(`value`) || e.has(`disabled`) || e.has(`defaultValue`))
          ) {
            let e = this.value;
            this.updateFormValue(e);
          }
          (e.has(`disabled`) &&
            (this.customStates.set(`disabled`, this.disabled),
            (this.hasAttribute(`disabled`) || !this.matches(`:disabled`)) &&
              this.toggleAttribute(`disabled`, this.disabled)),
            super.willUpdate(e),
            this.didSSR && !this.hasUpdated
              ? this.updateComplete.then(() => this.updateValidity())
              : this.updateValidity());
        }
        updateFormValue(e) {
          if (Array.isArray(e)) {
            if (this.name) {
              let t = new FormData();
              for (let n of e) t.append(this.name, n);
              this.setValue(t, t);
            }
          } else this.setValue(e, e);
        }
        get labels() {
          return this.internals.labels;
        }
        getForm() {
          return this.internals.form;
        }
        set form(e) {
          e ? this.setAttribute(`form`, e) : this.removeAttribute(`form`);
        }
        get form() {
          return this.internals.form;
        }
        get validity() {
          return this.internals.validity;
        }
        get willValidate() {
          return this.internals.willValidate;
        }
        get validationMessage() {
          return this.internals.validationMessage;
        }
        checkValidity() {
          return (this.updateValidity(), this.internals.checkValidity());
        }
        reportValidity() {
          return (
            this.updateValidity(), (this.hasInteracted = !0), this.internals.reportValidity()
          );
        }
        get validationTarget() {
          return this.input || void 0;
        }
        setValidity(...e) {
          let t = e[0],
            n = e[1],
            r = e[2];
          ((r ||= this.validationTarget),
            this.internals.setValidity(t, n, r || void 0),
            this.requestUpdate(`validity`),
            this.setCustomStates());
        }
        setCustomStates() {
          let e = !!this.required,
            t = this.internals.validity.valid,
            n = this.hasInteracted;
          (this.customStates.set(`required`, e),
            this.customStates.set(`optional`, !e),
            this.customStates.set(`invalid`, !t),
            this.customStates.set(`valid`, t),
            this.customStates.set(`user-invalid`, !t && n),
            this.customStates.set(`user-valid`, t && n));
        }
        setCustomValidity(e) {
          if (!e) {
            ((this.customError = null), this.setValidity({}));
            return;
          }
          ((this.customError = e), this.setValidity({ customError: !0 }, e, this.validationTarget));
        }
        formResetCallback() {
          (this.resetValidity(),
            (this.hasInteracted = !1),
            (this.valueHasChanged = !1),
            (this.emittedEvents = []),
            this.updateValidity());
        }
        formDisabledCallback(e) {
          ((this.disabled = e), this.updateValidity());
        }
        formStateRestoreCallback(e, t) {
          this.didSSR && !this.hasUpdated
            ? this.updateComplete.then(() => {
                ((this.value = e), t === `restore` && this.resetValidity(), this.updateValidity());
              })
            : ((this.value = e), t === `restore` && this.resetValidity(), this.updateValidity());
        }
        setValue(...e) {
          let [t, n] = e;
          this.internals.setFormValue(t, n);
        }
        get allValidators() {
          let e = this.constructor.validators || [],
            t = this.validators || [];
          return [...e, ...t];
        }
        resetValidity() {
          (this.setCustomValidity(``), this.setValidity({}));
        }
        updateValidity() {
          if (this.disabled || this.hasAttribute(`disabled`) || !this.willValidate) {
            this.resetValidity();
            return;
          }
          let e = this.allValidators;
          if (!e?.length) return;
          let t = { customError: !!this.customError },
            n = this.validationTarget || this.input || void 0,
            r = ``;
          for (let n of e) {
            let { isValid: e, message: i, invalidKeys: a } = n.checkValidity(this);
            e || ((r ||= i), a?.length >= 0 && a.forEach((e) => (t[e] = !0)));
          }
          ((r ||= this.validationMessage), this.setValidity(t, r, n));
        }
      }),
      (Q.formAssociated = !0),
      P([d({ reflect: !0 })], Q.prototype, `name`, 2),
      P([d({ type: Boolean })], Q.prototype, `disabled`, 2),
      P([d({ state: !0, attribute: !1 })], Q.prototype, `valueHasChanged`, 2),
      P([d({ state: !0, attribute: !1 })], Q.prototype, `hasInteracted`, 2),
      P([d({ attribute: `custom-error`, reflect: !0 })], Q.prototype, `customError`, 2),
      P([d({ attribute: !1, state: !0, type: Object })], Q.prototype, `validity`, 1));
  }),
  aa,
  oa = e(() => {
    (m(),
      (aa = b`
  @layer wa-component {
    :host {
      display: inline-block;

      /* Workaround because Chrome doesn't like :host(:has()) below
       * https://issues.chromium.org/issues/40062355
       * Firefox doesn't like this nested rule, so both are needed */
      &:has(wa-badge) {
        position: relative;
      }
    }

    /* Apply relative positioning only when needed to position wa-badge
     * This avoids creating a new stacking context for every button */
    :host(:has(wa-badge)) {
      position: relative;
    }
  }

  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    white-space: nowrap;
    vertical-align: middle;
    transition-property: background, border, box-shadow, color, opacity, transform;
    transition-duration: var(--wa-transition-fast);
    transition-timing-function: var(--wa-transition-easing);
    transform-origin: center;
    cursor: pointer;
    padding: 0 var(--wa-form-control-padding-inline);
    font-family: inherit;
    font-size: inherit;
    font-weight: var(--wa-font-weight-action);
    height: var(--wa-form-control-height);
    width: 100%;

    background-color: var(--wa-color-fill-loud, var(--wa-color-neutral-fill-loud));

    border-color: transparent;
    color: var(--wa-color-on-loud, var(--wa-color-neutral-on-loud));
    border-start-start-radius: var(--_button-start-start-radius, var(--wa-form-control-border-radius));
    border-start-end-radius: var(--_button-start-end-radius, var(--wa-form-control-border-radius));
    border-end-start-radius: var(--_button-end-start-radius, var(--wa-form-control-border-radius));
    border-end-end-radius: var(--_button-end-end-radius, var(--wa-form-control-border-radius));
    border-style: var(--wa-form-control-border-style);
    border-width: var(--wa-form-control-border-width);
  }

  /* Hover and active transforms */
  .button:not(.disabled):not(.loading) {
    @media (hover: hover) {
      &:hover {
        transform: var(--wa-button-transform-hover);
      }
    }
    &:active {
      transform: var(--wa-button-transform-active);
    }

    @media (prefers-reduced-motion: reduce) {
      &:hover,
      &:active {
        transform: none;
      }
    }
  }

  /* Appearance modifiers */
  :host([appearance='plain']) {
    /* Indentation overrides for grouping */
    margin-inline-start: var(--_button-horizontal-indent);
    margin-block-start: var(--_button-vertical-indent);

    .button {
      color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
      background-color: transparent;
      border-color: transparent;
    }
    @media (hover: hover) {
      .button:not(.disabled):not(.loading):hover {
        color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
        background-color: var(--wa-color-fill-quiet, var(--wa-color-neutral-fill-quiet));
      }
    }
    .button:not(.disabled):not(.loading):active {
      color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
      background-color: color-mix(
        in oklab,
        var(--wa-color-fill-quiet, var(--wa-color-neutral-fill-quiet)),
        var(--wa-color-mix-active)
      );
    }
  }

  :host([appearance='outlined']) {
    /* Indentation overrides for grouping outlined */
    margin-inline-start: var(--_button-horizontal-indent-outlined);
    margin-block-start: var(--_button-vertical-indent-outlined);

    .button {
      color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
      background-color: transparent;
      border-color: var(--wa-color-border-loud, var(--wa-color-neutral-border-loud));
    }
    @media (hover: hover) {
      .button:not(.disabled):not(.loading):hover {
        color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
        background-color: var(--wa-color-fill-quiet, var(--wa-color-neutral-fill-quiet));
      }
    }
    .button:not(.disabled):not(.loading):active {
      color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
      background-color: color-mix(
        in oklab,
        var(--wa-color-fill-quiet, var(--wa-color-neutral-fill-quiet)),
        var(--wa-color-mix-active)
      );
    }
  }

  :host([appearance='filled']) {
    /* Indentation overrides for grouping */
    margin-inline-start: var(--_button-horizontal-indent);
    margin-block-start: var(--_button-vertical-indent);

    .button {
      color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
      background-color: var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal));
      border-color: transparent;
    }
    @media (hover: hover) {
      .button:not(.disabled):not(.loading):hover {
        color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
        background-color: color-mix(
          in oklab,
          var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal)),
          var(--wa-color-mix-hover)
        );
      }
    }
    .button:not(.disabled):not(.loading):active {
      color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
      background-color: color-mix(
        in oklab,
        var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal)),
        var(--wa-color-mix-active)
      );
    }
  }

  :host([appearance='filled-outlined']) {
    /* Indentation overrides for grouping outlined */
    margin-inline-start: var(--_button-horizontal-indent-outlined);
    margin-block-start: var(--_button-vertical-indent-outlined);

    .button {
      color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
      background-color: var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal));
      border-color: var(--wa-color-border-normal, var(--wa-color-neutral-border-normal));
    }
    @media (hover: hover) {
      .button:not(.disabled):not(.loading):hover {
        color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
        background-color: color-mix(
          in oklab,
          var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal)),
          var(--wa-color-mix-hover)
        );
      }
    }
    .button:not(.disabled):not(.loading):active {
      color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
      background-color: color-mix(
        in oklab,
        var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal)),
        var(--wa-color-mix-active)
      );
    }
  }

  :host([appearance='accent']) {
    /* Indentation overrides for grouping */
    margin-inline-start: var(--_button-horizontal-indent);
    margin-block-start: var(--_button-vertical-indent);

    .button {
      color: var(--wa-color-on-loud, var(--wa-color-neutral-on-loud));
      background-color: var(--wa-color-fill-loud, var(--wa-color-neutral-fill-loud));
      border-color: transparent;
    }
    @media (hover: hover) {
      .button:not(.disabled):not(.loading):hover {
        background-color: color-mix(
          in oklab,
          var(--wa-color-fill-loud, var(--wa-color-neutral-fill-loud)),
          var(--wa-color-mix-hover)
        );
      }
    }
    .button:not(.disabled):not(.loading):active {
      background-color: color-mix(
        in oklab,
        var(--wa-color-fill-loud, var(--wa-color-neutral-fill-loud)),
        var(--wa-color-mix-active)
      );
    }
  }

  /* Focus states */
  .button:focus {
    outline: none;
  }

  .button:focus-visible {
    outline: var(--wa-focus-ring);
    outline-offset: var(--wa-focus-ring-offset);
  }

  /* Disabled state */
  :host([disabled]) {
    opacity: 0.5;
    cursor: not-allowed;

    /* When disabled, prevent mouse events from bubbling up from children */
    .button {
      pointer-events: none;
    }
  }

  /* Keep it last so Safari doesn't stop parsing this block */
  .button::-moz-focus-inner {
    border: 0;
  }

  /* Icon buttons */
  .button.is-icon-button {
    outline-offset: 2px;
    width: var(--wa-form-control-height);
    aspect-ratio: 1;
  }

  /* Icon buttons with a caret need to grow to fit both the icon and the caret */
  .button.is-icon-button.caret {
    width: auto;
    aspect-ratio: auto;
    min-width: var(--wa-form-control-height);
  }

  /* Pill modifier */
  :host([pill]) .button {
    border-start-start-radius: var(--_button-start-start-radius, var(--wa-border-radius-pill));
    border-start-end-radius: var(--_button-start-end-radius, var(--wa-border-radius-pill));
    border-end-start-radius: var(--_button-end-start-radius, var(--wa-border-radius-pill));
    border-end-end-radius: var(--_button-end-end-radius, var(--wa-border-radius-pill));
  }

  /*
   * Label
   */

  .start,
  .end {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    pointer-events: none;
  }

  .label {
    display: inline-block;
  }

  .is-icon-button .label {
    display: flex;
    justify-content: center;
  }

  .label::slotted(wa-icon) {
    align-self: center;
  }

  /*
   * Caret modifier
   */

  wa-icon[part='caret'] {
    display: flex;
    align-self: center;
    align-items: center;

    &::part(svg) {
      width: 0.875em;
      height: 0.875em;
    }

    .button:has(&) .end {
      display: none;
    }
  }

  /*
   * Loading modifier
   */

  .loading {
    position: relative;
    cursor: wait;

    .start,
    .label,
    .end,
    .caret {
      visibility: hidden;
    }

    wa-spinner {
      --indicator-color: currentColor;
      --track-color: color-mix(in oklab, currentColor, transparent 90%);

      position: absolute;
      font-size: 1em;
      height: 1em;
      width: 1em;
      top: calc(50% - 0.5em);
      left: calc(50% - 0.5em);
    }
  }

  /*
   * Badges
   */

  .button ::slotted(wa-badge) {
    border-color: var(--wa-color-surface-default);
    position: absolute;
    inset-block-start: 0;
    inset-inline-end: 0;
    translate: 50% -50%;
    pointer-events: none;
  }

  :host(:dir(rtl)) ::slotted(wa-badge) {
    translate: -50% -50%;
  }

  /*
  * Button spacing
  */

  slot[name='start']::slotted(*) {
    margin-inline-end: 0.75em;
  }

  slot[name='end']::slotted(*),
  .button:not(.visually-hidden-label) [part='caret'] {
    margin-inline-start: 0.75em;
  }
`));
  }),
  sa,
  ca = e(() => {
    (m(),
      (sa = b`
  :where(:root),
  .wa-neutral,
  :host([variant='neutral']) {
    --wa-color-fill-loud: var(--wa-color-neutral-fill-loud);
    --wa-color-fill-normal: var(--wa-color-neutral-fill-normal);
    --wa-color-fill-quiet: var(--wa-color-neutral-fill-quiet);
    --wa-color-border-loud: var(--wa-color-neutral-border-loud);
    --wa-color-border-normal: var(--wa-color-neutral-border-normal);
    --wa-color-border-quiet: var(--wa-color-neutral-border-quiet);
    --wa-color-on-loud: var(--wa-color-neutral-on-loud);
    --wa-color-on-normal: var(--wa-color-neutral-on-normal);
    --wa-color-on-quiet: var(--wa-color-neutral-on-quiet);
  }

  .wa-brand,
  :host([variant='brand']) {
    --wa-color-fill-loud: var(--wa-color-brand-fill-loud);
    --wa-color-fill-normal: var(--wa-color-brand-fill-normal);
    --wa-color-fill-quiet: var(--wa-color-brand-fill-quiet);
    --wa-color-border-loud: var(--wa-color-brand-border-loud);
    --wa-color-border-normal: var(--wa-color-brand-border-normal);
    --wa-color-border-quiet: var(--wa-color-brand-border-quiet);
    --wa-color-on-loud: var(--wa-color-brand-on-loud);
    --wa-color-on-normal: var(--wa-color-brand-on-normal);
    --wa-color-on-quiet: var(--wa-color-brand-on-quiet);
  }

  .wa-success,
  :host([variant='success']) {
    --wa-color-fill-loud: var(--wa-color-success-fill-loud);
    --wa-color-fill-normal: var(--wa-color-success-fill-normal);
    --wa-color-fill-quiet: var(--wa-color-success-fill-quiet);
    --wa-color-border-loud: var(--wa-color-success-border-loud);
    --wa-color-border-normal: var(--wa-color-success-border-normal);
    --wa-color-border-quiet: var(--wa-color-success-border-quiet);
    --wa-color-on-loud: var(--wa-color-success-on-loud);
    --wa-color-on-normal: var(--wa-color-success-on-normal);
    --wa-color-on-quiet: var(--wa-color-success-on-quiet);
  }

  .wa-warning,
  :host([variant='warning']) {
    --wa-color-fill-loud: var(--wa-color-warning-fill-loud);
    --wa-color-fill-normal: var(--wa-color-warning-fill-normal);
    --wa-color-fill-quiet: var(--wa-color-warning-fill-quiet);
    --wa-color-border-loud: var(--wa-color-warning-border-loud);
    --wa-color-border-normal: var(--wa-color-warning-border-normal);
    --wa-color-border-quiet: var(--wa-color-warning-border-quiet);
    --wa-color-on-loud: var(--wa-color-warning-on-loud);
    --wa-color-on-normal: var(--wa-color-warning-on-normal);
    --wa-color-on-quiet: var(--wa-color-warning-on-quiet);
  }

  .wa-danger,
  :host([variant='danger']) {
    --wa-color-fill-loud: var(--wa-color-danger-fill-loud);
    --wa-color-fill-normal: var(--wa-color-danger-fill-normal);
    --wa-color-fill-quiet: var(--wa-color-danger-fill-quiet);
    --wa-color-border-loud: var(--wa-color-danger-border-loud);
    --wa-color-border-normal: var(--wa-color-danger-border-normal);
    --wa-color-border-quiet: var(--wa-color-danger-border-quiet);
    --wa-color-on-loud: var(--wa-color-danger-on-loud);
    --wa-color-on-normal: var(--wa-color-danger-on-normal);
    --wa-color-on-quiet: var(--wa-color-danger-on-quiet);
  }
`));
  }),
  $,
  la = e(() => {
    (ea(),
      ia(),
      na(),
      ut(),
      Pr(),
      ft(),
      oa(),
      ca(),
      mt(),
      R(),
      F(),
      i(),
      g(),
      l(),
      S(),
      ($ = class extends Q {
        constructor() {
          (super(...arguments),
            (this.assumeInteractionOn = [`click`]),
            (this.hasSlotController = new Nr(this, `[default]`, `start`, `end`)),
            (this.localize = new Bt(this)),
            (this.invalid = !1),
            (this.isIconButton = !1),
            (this.title = ``),
            (this.variant = `neutral`),
            (this.appearance = `accent`),
            (this.size = `m`),
            (this.withCaret = !1),
            (this.withStart = !1),
            (this.withEnd = !1),
            (this.disabled = !1),
            (this.loading = !1),
            (this.pill = !1),
            (this.type = `button`));
        }
        static get validators() {
          return [...super.validators, $i()];
        }
        handleSizeChange() {
          st(this.localName, this.size);
        }
        constructLightDOMButton() {
          let e = document.createElement(`button`);
          for (let t of this.attributes) t.name !== `style` && e.setAttribute(t.name, t.value);
          return (
            (e.type = this.type),
            (e.style.position = `absolute !important`),
            (e.style.width = `0 !important`),
            (e.style.height = `0 !important`),
            (e.style.clipPath = `inset(50%) !important`),
            (e.style.overflow = `hidden !important`),
            (e.style.whiteSpace = `nowrap !important`),
            this.name && (e.name = this.name),
            (e.value = this.value || ``),
            e
          );
        }
        handleClick(e) {
          if (this.disabled || this.loading) {
            (e.preventDefault(), e.stopImmediatePropagation());
            return;
          }
          if ((this.type !== `submit` && this.type !== `reset`) || !this.getForm()) return;
          let t = this.constructLightDOMButton();
          (this.parentElement?.append(t), t.click(), t.remove());
        }
        handleInvalid() {
          this.dispatchEvent(new ta());
        }
        handleLabelSlotChange() {
          let e = this.labelSlot.assignedNodes({ flatten: !0 }),
            t = !1,
            n = !1,
            r = !1,
            i = !1;
          ([...e].forEach((e) => {
            if (e.nodeType === Node.ELEMENT_NODE) {
              let r = e;
              r.localName === `wa-icon` ? ((n = !0), (t ||= r.label !== void 0)) : (i = !0);
            } else
              e.nodeType === Node.TEXT_NODE && (e.textContent?.trim() || ``).length > 0 && (r = !0);
          }),
            (this.isIconButton = n && !r && !i),
            this.customStates.set(`icon-button`, this.isIconButton),
            this.isIconButton &&
              !t &&
              console.warn(
                `Icon buttons must have a label for screen readers. Add <wa-icon label="..."> to remove this warning.`,
                this,
              ));
        }
        isButton() {
          return !this.href;
        }
        isLink() {
          return !!this.href;
        }
        handleDisabledChange() {
          (this.customStates.set(`disabled`, this.disabled), this.updateValidity());
        }
        handleHrefChange() {
          this.customStates.set(`link`, this.isLink());
        }
        handleLoadingChange() {
          this.customStates.set(`loading`, this.loading);
        }
        setValue(...e) {}
        click() {
          this.button.click();
        }
        focus(e) {
          this.button.focus(e);
        }
        blur() {
          this.button.blur();
        }
        render() {
          let e = this.isLink(),
            t = e ? c`a` : c`button`;
          return x`
      <${t}
        part="base"
        class=${n({ button: !0, caret: this.withCaret, disabled: this.disabled, loading: this.loading, rtl: this.localize.dir() === `rtl`, "has-label": this.hasSlotController.test(`[default]`), "has-start": this.hasSlotController.test(`start`, `withStart`), "has-end": this.hasSlotController.test(`end`, `withEnd`), "is-icon-button": this.isIconButton })}
        ?disabled=${r(e ? void 0 : this.disabled)}
        type=${r(e ? void 0 : this.type)}
        title=${this.title}
        name=${r(e ? void 0 : this.name)}
        value=${r(e ? void 0 : this.value)}
        href=${r(e ? this.href : void 0)}
        target=${r(e ? this.target : void 0)}
        download=${r(e ? this.download : void 0)}
        rel=${r(e && this.rel ? this.rel : void 0)}
        role=${r(e ? void 0 : `button`)}
        aria-disabled=${r(e && this.disabled ? `true` : void 0)}
        tabindex=${this.disabled ? `-1` : `0`}
        @invalid=${this.isButton() ? this.handleInvalid : null}
        @click=${this.handleClick}
      >
        <slot name="start" part="start" class="start"></slot>
        <slot part="label" class="label" @slotchange=${this.handleLabelSlotChange}></slot>
        <slot name="end" part="end" class="end"></slot>
        ${
          this.withCaret
            ? x`
                <wa-icon part="caret" class="caret" library="system" name="chevron-down" variant="solid"></wa-icon>
              `
            : ``
        }
        ${this.loading ? x`<wa-spinner part="spinner"></wa-spinner>` : ``}
      </${t}>
    `;
        }
      }),
      ($.shadowRootOptions = { ...Q.shadowRootOptions, delegatesFocus: !0 }),
      ($.css = [aa, sa, dt]),
      P([o(`.button`)], $.prototype, `button`, 2),
      P([o(`slot:not([name])`)], $.prototype, `labelSlot`, 2),
      P([u()], $.prototype, `invalid`, 2),
      P([u()], $.prototype, `isIconButton`, 2),
      P([d()], $.prototype, `title`, 2),
      P([d({ reflect: !0 })], $.prototype, `variant`, 2),
      P([d({ reflect: !0 })], $.prototype, `appearance`, 2),
      P([d({ reflect: !0 })], $.prototype, `size`, 2),
      P([N(`size`)], $.prototype, `handleSizeChange`, 1),
      P([d({ attribute: `with-caret`, type: Boolean, reflect: !0 })], $.prototype, `withCaret`, 2),
      P([d({ attribute: `with-start`, type: Boolean })], $.prototype, `withStart`, 2),
      P([d({ attribute: `with-end`, type: Boolean })], $.prototype, `withEnd`, 2),
      P([d({ type: Boolean })], $.prototype, `disabled`, 2),
      P([d({ type: Boolean, reflect: !0 })], $.prototype, `loading`, 2),
      P([d({ type: Boolean, reflect: !0 })], $.prototype, `pill`, 2),
      P([d()], $.prototype, `type`, 2),
      P([d({ reflect: !0 })], $.prototype, `name`, 2),
      P([d({ reflect: !0 })], $.prototype, `value`, 2),
      P([d({ reflect: !0 })], $.prototype, `href`, 2),
      P([d()], $.prototype, `target`, 2),
      P([d()], $.prototype, `rel`, 2),
      P([d()], $.prototype, `download`, 2),
      P([d({ attribute: `formaction` })], $.prototype, `formAction`, 2),
      P([d({ attribute: `formenctype` })], $.prototype, `formEnctype`, 2),
      P([d({ attribute: `formmethod` })], $.prototype, `formMethod`, 2),
      P([d({ attribute: `formnovalidate`, type: Boolean })], $.prototype, `formNoValidate`, 2),
      P([d({ attribute: `formtarget` })], $.prototype, `formTarget`, 2),
      P([N(`disabled`, { waitUntilFirstUpdate: !0 })], $.prototype, `handleDisabledChange`, 1),
      P([N(`href`)], $.prototype, `handleHrefChange`, 1),
      P([N(`loading`, { waitUntilFirstUpdate: !0 })], $.prototype, `handleLoadingChange`, 1),
      ($ = P([t(`wa-button`)], $)),
      $.disableWarning?.(`change-in-update`));
  }),
  ua,
  da = e(() => {
    (m(),
      (ua = b`
  :host {
    --track-width: 2px;
    --track-color: var(--wa-color-neutral-fill-normal);
    --indicator-color: var(--wa-color-brand-fill-loud);
    --speed: 2s;
    --size: 1em;

    /*
      Resizing a spinner element using anything but font-size will break the animation because the animation uses em
      units. Therefore, if a spinner is used in a flex container without \`flex: none\` applied, the spinner can
      grow/shrink and break the animation. The use of \`flex: none\` on the host element prevents this by always having
      the spinner sized according to its actual dimensions.
    */
    flex: none;
    display: inline-flex;
    width: var(--size);
    height: var(--size);
  }

  svg {
    width: 100%;
    height: 100%;
    aspect-ratio: 1;
    animation: spin var(--speed) linear infinite;
  }

  .track,
  .indicator {
    --radius: calc(var(--size) / 2 - var(--track-width) / 2);
    --circumference: calc(var(--radius) * 2 * 3.141592654);

    cx: calc(var(--size) / 2);
    cy: calc(var(--size) / 2);
    r: var(--radius);
    fill: none;
    stroke-width: var(--track-width);
  }

  .track {
    stroke: var(--track-color);
  }

  .indicator {
    stroke: var(--indicator-color);
    stroke-linecap: round;
    stroke-dasharray: calc(0.597 * var(--circumference)), calc(0.796 * var(--circumference));
    stroke-dashoffset: calc(-0.04 * var(--circumference));
    animation: dash 1.5s ease-in-out infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: calc(0.008 * var(--circumference)), calc(1.194 * var(--circumference));
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: calc(0.716 * var(--circumference)), calc(1.194 * var(--circumference));
      stroke-dashoffset: calc(-0.278 * var(--circumference));
    }
    100% {
      stroke-dasharray: calc(0.716 * var(--circumference)), calc(1.194 * var(--circumference));
      stroke-dashoffset: calc(-0.987 * var(--circumference));
    }
  }
`));
  }),
  fa,
  pa = e(() => {
    (da(),
      L(),
      R(),
      F(),
      m(),
      i(),
      (fa = class extends I {
        constructor() {
          (super(...arguments), (this.localize = new Bt(this)));
        }
        render() {
          return f`
      <svg
        part="base"
        role="progressbar"
        aria-label=${this.localize.term(`loading`)}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle class="track" />
        <circle class="indicator" />
      </svg>
    `;
        }
      }),
      (fa.css = ua),
      (fa = P([t(`wa-spinner`)], fa)));
  }),
  ma = e(() => {
    (Qi(), Zi(), la(), pa(), da(), ia(), ft(), oa(), ca(), Ei(), Qr(), L(), R(), zt());
  });
export {
  We as $,
  zt as A,
  dt as B,
  J as C,
  Pr as D,
  Nr as E,
  mt as F,
  et as G,
  st as H,
  N as I,
  Ze as J,
  Qe as K,
  M as L,
  L as M,
  P as N,
  Bt as O,
  F as P,
  qe as Q,
  pt as R,
  Qr as S,
  zr as T,
  ot as U,
  ut as V,
  at as W,
  Ye as X,
  Je as Y,
  Ke as Z,
  Mi as _,
  T as _t,
  ca as a,
  Fe as at,
  Di as b,
  Q as c,
  ke as ct,
  ea as d,
  ie as dt,
  Ge as et,
  qi as f,
  ne as ft,
  Pi as g,
  E as gt,
  Li as h,
  te as ht,
  la as i,
  Ae as it,
  I as j,
  R as k,
  ia as l,
  oe as lt,
  zi as m,
  j as mt,
  pa as n,
  Ue as nt,
  sa as o,
  he as ot,
  Gi as p,
  re as pt,
  Xe as q,
  da as r,
  Oe as rt,
  oa as s,
  ge as st,
  ma as t,
  He as tt,
  $i as u,
  ce as ut,
  ji as v,
  Kr as w,
  Ei as x,
  Oi as y,
  ft as z,
};
//# sourceMappingURL=control-ui-foundation-0uuDj0X3.js.map
