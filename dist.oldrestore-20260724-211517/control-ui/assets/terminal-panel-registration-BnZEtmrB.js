const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "./browser-Bh1my_FA.js",
      "./rolldown-runtime-DaJ6WEGw.js",
      "./control-ui-foundation-CCDffryi.js",
      "./control-ui-foundation-s2wA1PVE.js",
      "./control-ui-foundation-CSxeaoE-.js",
      "./control-ui-foundation-DmtL9jaX.js",
      "./control-ui-foundation-BSyioE0Z.js",
      "./control-ui-foundation-BV4RtoqL.js",
      "./control-ui-foundation-Ce4npCeY.js",
      "./control-ui-foundation-ZzBFjbRr.js",
      "./control-ui-foundation-BWwpVuhO.js",
      "./control-ui-foundation-0uuDj0X3.js",
      "./lit-runtime-DkvDG939.js",
      "./ghostty-web-BEtr8uf-.js",
    ]),
) => i.map((i) => d[i]);
import { da as f, ua as te } from "./control-ui-core-BcbHa4vB.js";
import { H as h, U as g, V as _ } from "./control-ui-core-CQDTaMS5.js";
import { o as p, t as m } from "./control-ui-core-CwQmiouz.js";
import { _ as t, g as n, v as r, y as i } from "./control-ui-foundation-CCDffryi.js";
import { n as v, t as y } from "./dock-panel-layout-BOU_nd2H.js";
import {
  G as a,
  Y as o,
  Z as s,
  at as c,
  et as l,
  nt as u,
  st as d,
  ut as ee,
} from "./lit-runtime-DkvDG939.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
import { t as b } from "./web-awesome-tabs-B3ooykzD.js";
var x,
  S = e(() => {
    x = class {
      constructor(e, t, n = () => 1) {
        ((this.capacity = e),
          (this.overflow = t),
          (this.measure = n),
          (this.values = []),
          (this.size = 0),
          (this.closed = !1));
      }
      push(e) {
        if (this.closed) return !1;
        let t = this.measure(e);
        if (this.size + t <= this.capacity) return (this.values.push(e), (this.size += t), !0);
        if (this.overflow.mode === `latch`) return ((this.closed = !0), !1);
        if (this.overflow.mode === `fail-closed`)
          return (
            (this.values = []), (this.size = 0), (this.closed = !0), this.overflow.onOverflow(), !1
          );
        for (
          this.values.push(e), this.size += t;
          this.size > this.capacity && this.values.length > 1;
        )
          this.size -= this.measure(this.values.shift());
        if (this.size > this.capacity) {
          let t = this.overflow.fit?.(e, this.capacity);
          ((this.values = t === void 0 ? [] : [t]),
            (this.size = t === void 0 ? 0 : this.measure(t)));
        }
        return !0;
      }
      drain() {
        let e = this.values;
        return ((this.values = []), (this.size = 0), e);
      }
    };
  }),
  C,
  w = e(() => {
    (S(),
      (C = class e {
        static {
          this.MAX_PENDING_EVENTS = 512;
        }
        constructor(e) {
          ((this.sinks = new Map()),
            (this.pending = new Map()),
            (this.unsubscribe = null),
            (this.pendingOpenCount = 0),
            (this.client = e));
        }
        ensureSubscribed() {
          this.unsubscribe ||= this.client.addEventListener((e) => {
            if (e.event === `terminal.data`) {
              let t = e.payload;
              if (t?.sessionId && typeof t.data == `string`) {
                let e = this.sinks.get(t.sessionId);
                e
                  ? e.onData(t.data)
                  : this.bufferEarly(t.sessionId, { kind: `data`, data: t.data });
              }
              return;
            }
            if (e.event === `terminal.exit`) {
              let t = e.payload;
              if (t?.sessionId) {
                let e = {
                    exitCode: t.exitCode ?? null,
                    signal: t.signal ?? null,
                    reason: t.reason,
                    error: t.error,
                  },
                  n = this.sinks.get(t.sessionId);
                n
                  ? this.deliverExit(t.sessionId, n, e)
                  : this.bufferEarly(t.sessionId, { kind: `exit`, info: e });
              }
            }
          });
        }
        async open(e, t) {
          let n = await this.requestWhileHoldingStream(() =>
            this.client.request(`terminal.open`, e),
          );
          return (this.adoptSession(n.sessionId, t), n);
        }
        async attach(e, t) {
          let n = await this.requestWhileHoldingStream(() =>
            this.client.request(`terminal.attach`, { sessionId: e }),
          );
          return (this.adoptSession(e, t, n.buffer), n);
        }
        async list() {
          return (await this.client.request(`terminal.list`))?.sessions ?? [];
        }
        async requestWhileHoldingStream(e) {
          (this.ensureSubscribed(), (this.pendingOpenCount += 1));
          try {
            let t = await e();
            return (--this.pendingOpenCount, t);
          } catch (e) {
            throw (--this.pendingOpenCount, this.maybeUnsubscribe(), e);
          }
        }
        adoptSession(e, t, n) {
          (this.sinks.set(e, t), n && t.onData(n));
          let r = this.pending.get(e);
          if (r) {
            this.pending.delete(e);
            for (let n of r.drain())
              n.kind === `data` ? t.onData(n.data) : this.deliverExit(e, t, n.info);
          }
        }
        deliverExit(e, t, n) {
          (t.onExit(n), this.sinks.delete(e), this.pending.delete(e), this.maybeUnsubscribe());
        }
        bufferEarly(t, n) {
          let r = this.pending.get(t) ?? new x(e.MAX_PENDING_EVENTS, { mode: `drop-oldest` });
          (this.pending.set(t, r), r.push(n));
        }
        async input(e, t) {
          await this.client
            .request(`terminal.input`, { sessionId: e, data: t })
            .catch(() => void 0);
        }
        async resize(e, t, n) {
          await this.client
            .request(`terminal.resize`, { sessionId: e, cols: t, rows: n })
            .catch(() => void 0);
        }
        async close(e) {
          (this.sinks.delete(e),
            this.pending.delete(e),
            await this.client.request(`terminal.close`, { sessionId: e }).catch(() => void 0),
            this.pending.delete(e),
            this.maybeUnsubscribe());
        }
        get size() {
          return this.sinks.size;
        }
        dispose() {
          (this.sinks.clear(),
            this.pending.clear(),
            (this.unsubscribe &&= (this.unsubscribe(), null)));
        }
        maybeUnsubscribe() {
          this.sinks.size === 0 &&
            this.pendingOpenCount === 0 &&
            this.unsubscribe &&
            (this.pending.clear(), this.unsubscribe(), (this.unsubscribe = null));
        }
      }));
  });
function T(e) {
  return e.shellName ?? p(`terminal.tabLabel`, { n: String(e.sequence) });
}
function E(e) {
  return e.agentId === null || e.cwd === null
    ? null
    : p(`terminal.tabHint`, { agent: e.agentId, cwd: e.cwd });
}
function D(e) {
  return e.status === `exited`
    ? e.exitReason === `detached`
      ? p(`terminal.detached`)
      : e.exitReason === `process_exit` && typeof e.exitCode == `number`
        ? p(`terminal.exitedCode`, { code: String(e.exitCode) })
        : p(`terminal.exited`)
    : null;
}
function O(e) {
  return c`
    <wa-tab-group
      class="tp-tabs"
      .active=${e.activeId ?? ``}
      activation="auto"
      without-scroll-controls
      @wa-tab-show=${(t) => e.onSelect(t.detail.name)}
    >
      ${e.tabs.map((t) => {
        let n = D(t);
        return c`
          <wa-tab
            id=${`terminal-tab-${t.id}`}
            class="tp-tab ${t.status === `exited` ? `is-exited` : ``}"
            panel=${t.id}
            aria-controls="terminal-tab-panel"
            title=${E(t) || u}
          >
            <span class="tp-tab__icon" aria-hidden="true">${k}</span>
            <span class="tp-tab__label">${T(t)}</span>
            ${n ? c`<span class="tp-tab__status">${n}</span>` : u}
          </wa-tab>
          <button
            slot="nav"
            class="tp-tab__close"
            type="button"
            title=${p(`terminal.closeSession`)}
            aria-label=${`${p(`terminal.closeSession`)}: ${T(t)}`}
            @click=${() => e.onClose(t.id)}
          >
            ${A}
          </button>
        `;
      })}
      <button
        slot="nav"
        class="tp-new"
        type="button"
        ?disabled=${e.booting}
        title=${p(`terminal.newSession`)}
        aria-label=${p(`terminal.newSession`)}
        @click=${e.onNew}
      >
        ${j}
      </button>
    </wa-tab-group>
  `;
}
var k,
  A,
  j,
  ne = e(() => {
    (l(),
      m(),
      b(),
      (k = d`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4l3 3-3 3M8 11h5" /></svg>`),
      (A = d`<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8" /></svg>`),
      (j = d`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M8 3v10M3 8h10" /></svg>`));
  });
async function re(e) {
  let [{ createGhosttyTerminal: t, loadGhosttyRuntime: n }, i] = await Promise.all([
      r(
        () => import(`./browser-Bh1my_FA.js`),
        __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
        import.meta.url,
      ),
      r(
        () => import(`./ghostty-web-BEtr8uf-.js`),
        __vite__mapDeps([13, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
        import.meta.url,
      ),
    ]),
    a = await n({ module: i });
  return t({ ...e, runtime: a });
}
var ie = e(() => {
  i();
});
function M() {
  try {
    let e = globalThis.sessionStorage?.getItem(P);
    if (!e) return [];
    let t = JSON.parse(e);
    return Array.isArray(t) ? t.filter((e) => typeof e == `string` && e.length > 0) : [];
  } catch {
    return [];
  }
}
function N(e) {
  try {
    globalThis.sessionStorage?.setItem(P, JSON.stringify(e));
  } catch {}
}
var P,
  F = e(() => {
    P = `openclaw.terminal.sessions.v1`;
  });
function I(e, t) {
  let n = new x(L, { mode: `latch` }, (e) => e.length);
  return {
    buffer: n,
    onData: (r) => {
      let i = R.decode(r),
        a = t();
      a ? e.input(a, i) : n.push(i);
    },
    onResize: ({ columns: n, rows: r }) => {
      let i = t();
      i && e.resize(i, n, r);
    },
  };
}
var L,
  R,
  z = e(() => {
    (S(), (L = 8 * 1024), (R = new TextDecoder()));
  });
async function B(e, t) {
  for (let n of t) if ((await n(), !e())) return;
}
var V,
  H = e(() => {
    V = class {
      constructor() {
        ((this.tail = Promise.resolve()), (this.generation = 0));
      }
      enqueue(e) {
        let t = this.generation,
          n = () => t === this.generation,
          r = () => (n() ? e(n) : Promise.resolve()),
          i = this.tail.then(r, r);
        return ((this.tail = i.catch(() => {})), i);
      }
      enqueueSteps(...e) {
        return this.enqueue((t) => B(t, e));
      }
      reset() {
        this.generation += 1;
      }
    };
  });
function U(e) {
  return e === `light`
    ? {
        ...W,
        background: `#f7f8fa`,
        foreground: `#1b1e26`,
        cursor: `#1b1e26`,
        cursorAccent: `#f7f8fa`,
        selectionBackground: `rgba(90, 162, 255, 0.30)`,
        black: `#3a3f4b`,
        white: `#1b1e26`,
      }
    : {
        ...W,
        background: `#0e1015`,
        foreground: `#d7dae0`,
        cursor: `#ff5c5c`,
        cursorAccent: `#0e1015`,
        selectionBackground: `rgba(90, 162, 255, 0.32)`,
      };
}
var W,
  G = e(() => {
    W = {
      black: `#1b1e26`,
      red: `#ff6b6b`,
      green: `#4ec9a8`,
      yellow: `#e5c07b`,
      blue: `#5aa2ff`,
      magenta: `#c586c0`,
      cyan: `#56b6c2`,
      white: `#d7dae0`,
      brightBlack: `#5c6370`,
      brightRed: `#ff8787`,
      brightGreen: `#6fd7bd`,
      brightYellow: `#f0d197`,
      brightBlue: `#7cb7ff`,
      brightMagenta: `#d7a3d4`,
      brightCyan: `#7bd3dd`,
      brightWhite: `#ffffff`,
    };
  });
function K(e) {
  let t = e.split(/[\\/]/).pop()?.trim();
  return t && t.length > 0 ? t : `shell`;
}
var q,
  J,
  Y,
  X,
  Z,
  Q,
  $,
  ae = e(() => {
    (l(),
      a(),
      m(),
      f(),
      v(),
      h(),
      w(),
      ne(),
      ie(),
      F(),
      z(),
      H(),
      G(),
      t(),
      (q = d`<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8" /></svg>`),
      (J = d`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="2" y="2.5" width="12" height="11" rx="1.5" /><path d="M2 10h12" /></svg>`),
      (Y = d`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="2" y="2.5" width="12" height="11" rx="1.5" /><path d="M10 2.5v11" /></svg>`),
      (X = y({
        storageKey: `openclaw.terminal.panel.v1`,
        minHeight: 140,
        minWidth: 320,
        defaultDock: `bottom`,
        defaultHeight: 320,
        defaultWidth: 520,
      })),
      (Z = `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Symbols Nerd Font Mono", "MesloLGLDZ Nerd Font Mono", "JetBrainsMono Nerd Font Mono", "Liberation Mono", monospace`),
      (Q = new TextEncoder()),
      ($ = class extends te {
        constructor(...e) {
          (super(...e),
            (this.client = null),
            (this.agentId = null),
            (this.available = !1),
            (this.themeMode = `dark`),
            (this.fullscreen = !1),
            (this.open = !1),
            (this.dock = `bottom`),
            (this.height = X.defaults.height),
            (this.width = X.defaults.width),
            (this.tabs = []),
            (this.activeId = null),
            (this.booting = !1),
            (this.errorText = null),
            (this.connection = null),
            (this.activeClient = null),
            (this.activeAvailable = !1),
            (this.lifecycleGeneration = 0),
            (this.lifecycleAbortController = new AbortController()),
            (this.lifecycleSyncToken = 0),
            (this.resizeCleanup = null),
            (this.tabSeq = 0),
            (this.bootQueue = new V()),
            (this.createTerminal = re),
            (this.onGlobalKeyDown = (e) => this.handleGlobalKey(e)),
            (this.onToggleRequest = (e) => this.handleToggleRequest(e)),
            (this.onViewportResize = () => {
              let e = Math.min(this.height, X.maxHeight()),
                t = Math.min(this.width, X.maxWidth());
              (e === this.height && t === this.width) ||
                ((this.height = e),
                (this.width = t),
                this.syncLayoutReservation(),
                this.tabs.find((e) => e.id === this.activeId)?.controller.fit());
            }));
        }
        connectedCallback() {
          if (
            (super.connectedCallback(),
            (this.activeClient = this.client),
            (this.activeAvailable = this.available),
            this.fullscreen)
          )
            this.open = this.available;
          else {
            let e = X.load();
            ((this.dock = e.dock),
              (this.height = e.height),
              (this.width = e.width),
              (this.open = e.open && this.available),
              window.addEventListener(`keydown`, this.onGlobalKeyDown),
              window.addEventListener(_, this.onToggleRequest),
              window.addEventListener(`resize`, this.onViewportResize));
          }
          this.open && this.restoreSessions();
        }
        disconnectedCallback() {
          (super.disconnectedCallback(),
            window.removeEventListener(`keydown`, this.onGlobalKeyDown),
            window.removeEventListener(_, this.onToggleRequest),
            window.removeEventListener(`resize`, this.onViewportResize),
            document.documentElement.style.setProperty(`--oc-terminal-reserve-bottom`, `0px`),
            document.documentElement.style.setProperty(`--oc-terminal-reserve-right`, `0px`),
            this.disposeAllTabs(),
            (this.activeClient = null),
            (this.activeAvailable = !1));
        }
        updated(e) {
          if (
            ((e.has(`client`) || e.has(`available`)) && this.scheduleLifecycleSync(),
            e.has(`themeMode`))
          ) {
            let e = U(this.themeMode);
            for (let t of this.tabs) {
              let n = t.controller.terminal;
              n.renderer &&
                n.wasmTerm &&
                (n.renderer.setTheme(e), n.renderer.render(n.wasmTerm, !0, n.viewportY, n));
            }
          }
          if (this.open) {
            let e = this.renderRoot.querySelector(`.tp-viewport`);
            if (e) {
              for (let t of this.tabs) t.host.parentElement !== e && e.append(t.host);
              this.tabs.find((e) => e.id === this.activeId)?.controller.fit();
            }
          }
          this.syncLayoutReservation();
        }
        scheduleLifecycleSync() {
          let e = ++this.lifecycleSyncToken,
            t = this.lifecycleGeneration;
          queueMicrotask(() => {
            e !== this.lifecycleSyncToken ||
              t !== this.lifecycleGeneration ||
              !this.isConnected ||
              this.synchronizeLifecycle();
          });
        }
        synchronizeLifecycle() {
          let e = this.client !== this.activeClient,
            t = this.available !== this.activeAvailable;
          if (!e && !t) return;
          (e && (this.activeClient = this.client), (this.activeAvailable = this.available));
          let n = t && !this.available;
          (e || n) && this.disposeAllTabs();
          let r = e && this.available && this.open;
          (t &&
            (this.available
              ? !this.open && (this.fullscreen || X.load().open) && ((this.open = !0), (r = !0))
              : (this.open = !1)),
            r && this.restoreSessions());
        }
        syncLayoutReservation() {
          if (this.fullscreen) return;
          let e = document.documentElement.style,
            t = this.available && this.open && this.dock === `bottom` ? `${this.height}px` : `0px`,
            n = this.available && this.open && this.dock === `right` ? `${this.width}px` : `0px`;
          (e.setProperty(`--oc-terminal-reserve-bottom`, t),
            e.setProperty(`--oc-terminal-reserve-right`, n));
        }
        toggle() {
          this.available &&
            (this.open
              ? this.closePanel()
              : ((this.open = !0),
                this.syncLayoutReservation(),
                this.persistLayout(),
                this.restoreSessions()));
        }
        handleToggleRequest(e) {
          let t =
              e instanceof CustomEvent && typeof e.detail == `object` && e.detail !== null
                ? e.detail
                : null,
            n = t?.dock === `right` || t?.dock === `bottom` ? t.dock : null;
          if ((n && (this.dock = n), t?.catalog || t?.open === !0)) {
            if (!this.available) return;
            ((this.open = !0),
              this.syncLayoutReservation(),
              this.persistLayout(),
              t.catalog ? this.openCatalogSession(t.catalog) : this.restoreSessions());
            return;
          }
          this.toggle();
        }
        closePanel() {
          ((this.open = !1), this.syncLayoutReservation(), this.persistLayout());
        }
        handleGlobalKey(e) {
          g(e) && (e.preventDefault(), this.toggle());
        }
        async restoreSessions() {
          await this.bootQueue.enqueueSteps(
            () => this.reattachPersistedSessions(),
            () => this.ensureInitialSession(),
          );
        }
        async openCatalogSession(e) {
          await this.bootQueue.enqueueSteps(
            () => this.reattachPersistedSessions(),
            () => this.openSessionNow(e),
          );
        }
        async reattachPersistedSessions() {
          let e = this.captureTerminalOperation();
          if (!e || this.tabs.length > 0) return;
          let t = M();
          if (t.length > 0) {
            this.booting = !0;
            try {
              let n = await this.connectionFor(e).list();
              if (!this.isTerminalOperationCurrent(e)) return;
              let r = new Set(n.map((e) => e.sessionId));
              for (let n of t.filter((e) => r.has(e)))
                if ((await this.attachSession(n, e), !this.isTerminalOperationCurrent(e))) return;
            } catch {
              if (!this.isTerminalOperationCurrent(e)) return;
            } finally {
              this.isTerminalOperationCurrent(e) && (this.booting = !1);
            }
            if (!this.isTerminalOperationCurrent(e)) return;
            this.persistLiveSessions();
          }
        }
        async ensureInitialSession() {
          this.tabs.length === 0 && !this.booting && (await this.openSessionNow());
        }
        async bootTab(e) {
          let t = this.connectionFor(e),
            n = document.createElement(`div`);
          n.className = `tp-host`;
          let r = `tab-${++this.tabSeq}`;
          if ((await this.updateComplete, !this.isTerminalOperationCurrent(e)))
            throw Error(`terminal operation cancelled`);
          let i = this.renderRoot.querySelector(`.tp-viewport`);
          if (!i) throw Error(`terminal viewport unavailable`);
          i.append(n);
          let a = { current: void 0 },
            o = I(t, () => a.current?.gatewaySessionId),
            s;
          try {
            s = await this.createTerminal({
              parent: n,
              readOnly: !1,
              terminalOptions: {
                fontSize: 13,
                fontFamily: Z,
                cursorBlink: !0,
                theme: U(this.themeMode),
                scrollback: 5e3,
              },
              signal: e.signal,
              onData: o.onData,
              onResize: o.onResize,
            });
          } catch (e) {
            throw (n.remove(), e);
          }
          if (!this.isTerminalOperationCurrent(e)) {
            try {
              s.dispose();
            } finally {
              n.remove();
            }
            throw Error(`terminal operation cancelled`);
          }
          let c = {
            id: r,
            sequence: this.tabSeq,
            gatewaySessionId: ``,
            pendingInput: o.buffer,
            shellName: null,
            agentId: null,
            cwd: null,
            controller: s,
            host: n,
            status: `live`,
          };
          ((a.current = c), (this.tabs = [...this.tabs, c]), (this.activeId = r));
          let { terminal: l } = s;
          return { tab: c, connection: t, cols: l.cols || 80, rows: l.rows || 24 };
        }
        tabSink(e) {
          return {
            onData: (t) => {
              e.cancelled || e.controller.write(Q.encode(t));
            },
            onExit: (t) => this.handleExit(e.id, t),
          };
        }
        adoptSession(e, t) {
          ((e.gatewaySessionId = t.sessionId),
            (e.shellName = t.title ?? K(t.shell)),
            (e.agentId = t.agentId),
            (e.cwd = t.cwd));
          let { cols: n, rows: r } = e.controller.terminal;
          this.connection?.resize(t.sessionId, n || 80, r || 24);
          for (let n of e.pendingInput.drain()) this.connection?.input(t.sessionId, n);
          ((this.tabs = [...this.tabs]), this.persistLiveSessions());
        }
        dropFailedTab(e) {
          (this.disposeTab(e),
            (this.tabs = this.tabs.filter((t) => t.id !== e.id)),
            this.activeId === e.id && (this.activeId = this.tabs.at(-1)?.id ?? null));
        }
        async openSession(e) {
          await this.bootQueue.enqueue(() => this.openSessionNow(e));
        }
        async openSessionNow(e) {
          let t = this.captureTerminalOperation();
          if (!t) return;
          ((this.booting = !0), (this.errorText = null));
          let n = this.agentId?.trim() || void 0,
            r;
          try {
            let i = await this.bootTab(t);
            r = i.tab;
            let a = await i.connection.open(
              { agentId: n, cols: i.cols, rows: i.rows, ...(e ? { catalog: e } : {}) },
              this.tabSink(i.tab),
            );
            if (!this.isTerminalOperationCurrent(t) || i.tab.cancelled) {
              (i.connection.close(a.sessionId),
                this.tabs.includes(i.tab) &&
                  ((i.tab.cancelled = `lifecycle`), this.dropFailedTab(i.tab)));
              return;
            }
            (this.adoptSession(i.tab, a), i.tab.controller.terminal.focus());
          } catch (e) {
            if (
              (r && !r.gatewaySessionId && this.tabs.includes(r) && this.dropFailedTab(r),
              !this.isTerminalOperationCurrent(t))
            )
              return;
            this.errorText = e instanceof Error ? e.message : String(e);
          } finally {
            this.isTerminalOperationCurrent(t) && (this.booting = !1);
          }
        }
        async attachSession(e, t) {
          let n;
          try {
            let r = await this.bootTab(t);
            n = r.tab;
            let i = await r.connection.attach(e, this.tabSink(r.tab));
            return !this.isTerminalOperationCurrent(t) || r.tab.cancelled
              ? (r.tab.cancelled === `close` && r.connection.close(i.sessionId),
                this.tabs.includes(r.tab) &&
                  ((r.tab.cancelled = `lifecycle`), this.dropFailedTab(r.tab)),
                !1)
              : (this.adoptSession(r.tab, i), !0);
          } catch {
            return (n && !n.gatewaySessionId && this.tabs.includes(n) && this.dropFailedTab(n), !1);
          }
        }
        handleExit(e, t) {
          let n = this.tabs.find((t) => t.id === e);
          n &&
            ((n.status = `exited`),
            (n.exitReason = t.reason),
            (n.exitCode = t.exitCode),
            (this.tabs = [...this.tabs]),
            this.persistLiveSessions());
        }
        closeTab(e) {
          let t = this.tabs.find((t) => t.id === e);
          t &&
            (t.gatewaySessionId && t.status === `live`
              ? this.connection?.close(t.gatewaySessionId)
              : !t.gatewaySessionId && t.status === `live` && (t.cancelled = `close`),
            this.disposeTab(t),
            (this.tabs = this.tabs.filter((t) => t.id !== e)),
            this.activeId === e && (this.activeId = this.tabs.at(-1)?.id ?? null),
            this.persistLiveSessions(),
            this.tabs.length === 0 && !this.fullscreen && this.closePanel());
        }
        switchTo(e) {
          this.activeId = e;
          let t = this.tabs.find((t) => t.id === e);
          this.updateComplete.then(() => {
            (t?.controller.fit(), t?.controller.terminal.focus());
          });
        }
        captureTerminalOperation() {
          let e = this.client;
          return !e || e !== this.activeClient || !this.available || !this.isConnected
            ? null
            : {
                generation: this.lifecycleGeneration,
                client: e,
                signal: this.lifecycleAbortController.signal,
              };
        }
        isTerminalOperationCurrent(e) {
          return (
            this.isConnected &&
            this.available &&
            this.client === e.client &&
            this.activeClient === e.client &&
            this.lifecycleGeneration === e.generation &&
            !e.signal.aborted
          );
        }
        connectionFor(e) {
          if (!this.isTerminalOperationCurrent(e)) throw Error(`terminal operation cancelled`);
          return ((this.connection ??= new C(e.client)), this.connection);
        }
        disposeTab(e) {
          try {
            e.controller.dispose();
          } catch {
          } finally {
            e.host.remove();
          }
        }
        disposeAllTabs() {
          ((this.lifecycleGeneration += 1),
            this.lifecycleAbortController.abort(),
            (this.lifecycleAbortController = new AbortController()),
            this.bootQueue.reset(),
            (this.booting = !1),
            this.clearResizeListeners());
          for (let e of this.tabs) ((e.cancelled = `lifecycle`), this.disposeTab(e));
          ((this.tabs = []),
            (this.activeId = null),
            this.connection?.dispose(),
            (this.connection = null));
        }
        setDock(e) {
          ((this.dock = e),
            this.syncLayoutReservation(),
            this.persistLayout(),
            this.updateComplete.then(() => {
              for (let e of this.tabs) e.controller.fit();
            }));
        }
        persistLiveSessions() {
          N(
            this.tabs
              .filter((e) => e.status === `live` && e.gatewaySessionId)
              .map((e) => e.gatewaySessionId),
          );
        }
        persistLayout() {
          X.save({ open: this.open, dock: this.dock, height: this.height, width: this.width });
        }
        startResize(e) {
          (e.preventDefault(), this.clearResizeListeners());
          let t = e.clientX,
            n = e.clientY,
            r = this.height,
            i = this.width,
            a = (e) => {
              if (this.dock === `bottom`) {
                let t = Math.max(X.minHeight, r + (n - e.clientY));
                this.height = Math.min(t, X.maxHeight());
              } else {
                let n = Math.max(X.minWidth, i + (t - e.clientX));
                this.width = Math.min(n, X.maxWidth());
              }
              (this.syncLayoutReservation(),
                this.tabs.find((e) => e.id === this.activeId)?.controller.fit());
            },
            o = () => {
              (window.removeEventListener(`pointermove`, a),
                window.removeEventListener(`pointerup`, s),
                window.removeEventListener(`pointercancel`, s),
                window.removeEventListener(`blur`, s),
                this.resizeCleanup === o && (this.resizeCleanup = null));
            },
            s = () => {
              (o(), this.isConnected && this.persistLayout());
            };
          ((this.resizeCleanup = o),
            window.addEventListener(`pointermove`, a),
            window.addEventListener(`pointerup`, s),
            window.addEventListener(`pointercancel`, s),
            window.addEventListener(`blur`, s));
        }
        clearResizeListeners() {
          (this.resizeCleanup?.(), (this.resizeCleanup = null));
        }
        render() {
          return !this.available || !this.open
            ? u
            : c`
      <section class="tp tp--${this.fullscreen ? `fullscreen` : this.dock}" style=${this.fullscreen ? u : this.dock === `bottom` ? `height:${this.height}px` : `width:${this.width}px`} aria-label=${p(`terminal.title`)}>
        ${
          this.fullscreen
            ? u
            : c`<div
              class="tp-resizer tp-resizer--${this.dock}"
              @pointerdown=${(e) => this.startResize(e)}
              role="separator"
              aria-label=${p(`terminal.resize`)}
            ></div>`
        }
        <header class="tp-header">
          ${O({ tabs: this.tabs, activeId: this.activeId, booting: this.booting, onSelect: (e) => this.switchTo(e), onClose: (e) => this.closeTab(e), onNew: () => void this.openSession() })}
          ${
            this.fullscreen
              ? u
              : c`<div class="tp-actions">
                <button
                  class="tp-icon ${this.dock === `bottom` ? `is-active` : ``}"
                  type="button"
                  title=${p(`terminal.dockBottom`)}
                  aria-label=${p(`terminal.dockBottom`)}
                  @click=${() => this.setDock(`bottom`)}
                >
                  ${J}
                </button>
                <button
                  class="tp-icon ${this.dock === `right` ? `is-active` : ``}"
                  type="button"
                  title=${p(`terminal.dockRight`)}
                  aria-label=${p(`terminal.dockRight`)}
                  @click=${() => this.setDock(`right`)}
                >
                  ${Y}
                </button>
                <button
                  class="tp-icon"
                  type="button"
                  title=${p(`terminal.hide`)}
                  aria-label=${p(`terminal.hide`)}
                  @click=${() => this.closePanel()}
                >
                  ${q}
                </button>
              </div>`
          }
        </header>
        ${this.errorText ? c`<div class="tp-error" role="alert">${this.errorText}</div>` : u}
        <wa-tab-panel
          id="terminal-tab-panel"
          class="tp-viewport"
          name=${this.activeId ?? `terminal`}
          active
          aria-labelledby=${this.activeId ? `terminal-tab-${this.activeId}` : u}
        >
          ${this.booting && this.tabs.length === 0 ? c`<div class="tp-empty">${p(`terminal.starting`)}</div>` : u}
        </wa-tab-panel>
      </section>
    `;
        }
        willUpdate() {
          for (let e of this.tabs) e.host.style.display = e.id === this.activeId ? `block` : `none`;
        }
        static {
          this.styles = ee`
    :host {
      position: fixed;
      z-index: 60;
      color: var(--text, #d7dae0);
      font-family: var(--font-sans, system-ui, sans-serif);
    }
    .tp {
      position: fixed;
      display: flex;
      flex-direction: column;
      background: var(--bg, #0e1015);
      overflow: hidden;
    }
    /* A docked panel needs only a single hairline separator on its inner edge —
       no shadow, so it reads as part of the layout rather than a floating card. */
    .tp--bottom {
      left: var(--shell-nav-width, 0);
      right: 0;
      bottom: 0;
      border-top: 1px solid var(--border, #262b34);
    }
    .tp--right {
      top: var(--shell-topbar-height, 0);
      right: 0;
      bottom: 0;
      border-left: 1px solid var(--border, #262b34);
    }
    /* Terminal-only document (mobile WebViews): fill the viewport, no seams. */
    .tp--fullscreen {
      inset: 0;
    }
    .tp-resizer {
      position: absolute;
      z-index: 2;
      background: transparent;
    }
    .tp-resizer:hover {
      background: var(--accent, #ff5c5c);
      opacity: 0.5;
    }
    .tp-resizer--bottom {
      top: 0;
      left: 0;
      right: 0;
      height: 5px;
      cursor: ns-resize;
    }
    .tp-resizer--right {
      top: 0;
      bottom: 0;
      left: 0;
      width: 5px;
      cursor: ew-resize;
    }
    .tp-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 0 6px 0 4px;
      border-bottom: 1px solid var(--border, #262b34);
      background: var(--bg, #0e1015);
      min-height: 36px;
    }
    .tp-tabs {
      --track-width: 0;
      display: block;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .tp-tabs::part(nav) {
      display: flex;
      align-items: stretch;
      gap: 1px;
    }
    .tp-tabs::part(body) {
      display: none;
    }
    .tp-tabs::-webkit-scrollbar {
      display: none;
    }
    .tp-tab::part(base) {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 0 10px;
      height: 36px;
      color: var(--muted, #8a919e);
      white-space: nowrap;
      font-size: 12.5px;
      /* Reserve the active underline height so tabs don't shift on selection. */
      border-bottom: 2px solid transparent;
      transition:
        color 0.12s ease,
        background 0.12s ease;
    }
    .tp-tab:hover::part(base) {
      color: var(--text, #d7dae0);
      background: color-mix(in srgb, var(--text, #d7dae0) 6%, transparent);
    }
    .tp-tab[active]::part(base) {
      color: var(--text, #d7dae0);
      border-bottom-color: var(--accent, #ff5c5c);
    }
    .tp-tab.is-exited::part(base) {
      opacity: 0.55;
    }
    .tp-tab__icon {
      display: inline-flex;
      color: var(--accent, #4ec9a8);
    }
    .tp-tab.is-exited .tp-tab__icon {
      color: var(--muted, #8a919e);
    }
    .tp-tab__label {
      font-variant-numeric: tabular-nums;
    }
    .tp-tab__status {
      font-size: 11px;
      color: var(--muted, #8a919e);
    }
    .tp-tab__close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      opacity: 0;
      border: none;
      background: transparent;
      color: inherit;
      border-radius: 4px;
      padding: 0;
    }
    .tp-tab:hover + .tp-tab__close,
    .tp-tab[active] + .tp-tab__close,
    .tp-tab__close:hover,
    .tp-tab__close:focus-visible {
      opacity: 0.7;
    }
    .tp-new,
    .tp-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      border: none;
      background: transparent;
      color: var(--muted, #8a919e);
      border-radius: 6px;
      padding: 0;
    }
    .tp-new {
      align-self: center;
    }
    .tp-tab__close:hover,
    .tp-new:hover,
    .tp-icon:hover {
      background: color-mix(in srgb, var(--text, #d7dae0) 12%, transparent);
      color: var(--text, #d7dae0);
    }
    .tp-icon.is-active {
      color: var(--text, #d7dae0);
      background: color-mix(in srgb, var(--text, #d7dae0) 10%, transparent);
    }
    .tp-actions {
      display: flex;
      align-items: center;
      gap: 2px;
      padding-left: 6px;
    }
    .tp-viewport {
      position: relative;
      flex: 1;
      min-height: 0;
      background: var(--bg, #0e1015);
    }
    .tp-host {
      position: absolute;
      inset: 0;
      padding: 6px 8px;
      /* ghostty-web focuses this contenteditable host while drawing its own
         cursor on canvas; hide the otherwise duplicated browser caret. */
      caret-color: transparent;
    }
    .tp-empty,
    .tp-error {
      padding: 10px 12px;
      font-size: 12px;
      color: var(--muted, #8a919e);
    }
    .tp-error {
      color: var(--danger, #ff6b6b);
    }
  `;
        }
      }),
      n([s({ attribute: !1 })], $.prototype, `client`, void 0),
      n([s({ attribute: !1 })], $.prototype, `agentId`, void 0),
      n([s({ type: Boolean })], $.prototype, `available`, void 0),
      n([s({ attribute: !1 })], $.prototype, `themeMode`, void 0),
      n([s({ type: Boolean })], $.prototype, `fullscreen`, void 0),
      n([o()], $.prototype, `open`, void 0),
      n([o()], $.prototype, `dock`, void 0),
      n([o()], $.prototype, `height`, void 0),
      n([o()], $.prototype, `width`, void 0),
      n([o()], $.prototype, `tabs`, void 0),
      n([o()], $.prototype, `activeId`, void 0),
      n([o()], $.prototype, `booting`, void 0),
      n([o()], $.prototype, `errorText`, void 0));
  });
e(() => {
  (ae(),
    customElements.get(`openclaw-terminal-panel`) ||
      customElements.define(`openclaw-terminal-panel`, $));
})();
//# sourceMappingURL=terminal-panel-registration-BnZEtmrB.js.map
