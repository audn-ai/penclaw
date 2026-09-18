import { a as g, i as _, n as se, o as ce, r as le } from "./browser-annotation-CXzn-F7a.js";
import { Jt as f, Yt as te, da as ne, ua as re } from "./control-ui-core-BcbHa4vB.js";
import { B as h, H as ie } from "./control-ui-core-CQDTaMS5.js";
import { o as p, t as m } from "./control-ui-core-CwQmiouz.js";
import { _ as t, g as n } from "./control-ui-foundation-CCDffryi.js";
import { at as ee, nt as d } from "./control-ui-foundation-s2wA1PVE.js";
import { n as ae, t as oe } from "./dock-panel-layout-BOU_nd2H.js";
import {
  G as r,
  Y as i,
  Z as a,
  at as o,
  et as s,
  nt as c,
  st as l,
  ut as u,
} from "./lit-runtime-DkvDG939.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
import { t as v } from "./web-awesome-tabs-B3ooykzD.js";
function y(e, t) {
  return e.request(M, t);
}
function b(e) {
  return typeof e == `string` ? e : ``;
}
function x(e) {
  return typeof e == `number` && Number.isFinite(e) ? e : null;
}
function S(e) {
  let t = d(e),
    n = b(t?.targetId);
  return n ? { id: b(t?.tabId) || n, targetId: n, title: b(t?.title), url: b(t?.url) } : null;
}
async function C(e) {
  let t = d(await y(e, { method: `GET`, path: `/tabs` })),
    n = Array.isArray(t?.tabs) ? t.tabs.flatMap((e) => S(e) ?? []) : [];
  return { running: t?.running === !0, tabs: n };
}
async function ue(e) {
  await y(e, { method: `POST`, path: `/start`, body: {} });
}
async function de(e, t) {
  return S(await y(e, { method: `POST`, path: `/tabs/open`, body: { url: t } }));
}
async function fe(e, t) {
  await y(e, { method: `POST`, path: `/tabs/focus`, body: { targetId: t } });
}
async function pe(e, t) {
  await y(e, { method: `DELETE`, path: `/tabs/${encodeURIComponent(t)}` });
}
async function me(e, t) {
  let n = d(await y(e, { method: `POST`, path: `/navigate`, body: t }));
  return { targetId: b(n?.targetId) || t.targetId || ``, url: b(n?.url) || t.url };
}
async function he(e, t) {
  let n = d(
      await y(e, { method: `POST`, path: `/screenshot`, body: { targetId: t, type: `png` } }),
    ),
    r = b(n?.path);
  if (!r) throw Error(`browser screenshot did not return a media path`);
  return { path: r, targetId: b(n?.targetId) || t, url: b(n?.url) };
}
async function ge(e, t) {
  await y(e, {
    method: `POST`,
    path: `/act`,
    body: {
      kind: `clickCoords`,
      targetId: t.targetId,
      x: Math.max(0, Math.round(t.x)),
      y: Math.max(0, Math.round(t.y)),
      ...(t.doubleClick ? { doubleClick: !0 } : {}),
    },
  });
}
async function w(e, t) {
  await y(e, {
    method: `POST`,
    path: `/act`,
    body: { kind: `press`, targetId: t.targetId, key: t.key },
  });
}
async function T(e, t) {
  return (
    d(
      await y(e, {
        method: `POST`,
        path: `/act`,
        body: { kind: `evaluate`, targetId: t.targetId, fn: t.fn },
      }),
    )?.result ?? null
  );
}
function E(e) {
  return e instanceof Error && e.message.includes(`evaluateEnabled=false`);
}
async function D(e, t) {
  let n = Math.round(t.deltaX),
    r = Math.round(t.deltaY);
  await T(e, { targetId: t.targetId, fn: `() => { window.scrollBy(${n}, ${r}); return true; }` });
}
async function O(e, t) {
  await T(e, { targetId: t.targetId, fn: `() => { history.go(${t.delta}); return true; }` });
}
async function k(e, t) {
  let n = d(
      await T(e, {
        targetId: t,
        fn: `() => ({ cssWidth: window.innerWidth, cssHeight: window.innerHeight, title: document.title, url: location.href })`,
      }),
    ),
    r = x(n?.cssWidth),
    i = x(n?.cssHeight);
  return !r || !i || r <= 0 || i <= 0
    ? null
    : { cssWidth: r, cssHeight: i, title: b(n?.title), url: b(n?.url) };
}
async function A(e, t) {
  let n = Math.max(0, Math.round(t.x)),
    r = Math.max(0, Math.round(t.y)),
    i = d(
      await T(e, {
        targetId: t.targetId,
        fn: `() => {
        const el = document.elementFromPoint(${n}, ${r});
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        const label = el.getAttribute("aria-label") || el.getAttribute("alt") || el.getAttribute("title") || "";
        const text = (el.textContent || "").replace(/\\s+/g, " ").trim();
        const nameSource = label || text;
        const nameLimit = 120;
        // This serialized page function cannot call imported helpers; back up only when the cap splits a surrogate pair.
        const nameEnd = (nameSource.codePointAt(nameLimit - 1) || 0) > 0xffff ? nameLimit - 1 : nameLimit;
        return {
          tag: el.tagName.toLowerCase(),
          id: el.id || "",
          classes: Array.from(el.classList).slice(0, 6),
          role: el.getAttribute("role") || "",
          name: nameSource.slice(0, nameEnd),
          rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
          focusable: typeof el.tabIndex === "number" && el.tabIndex >= 0,
        };
      }`,
      }),
    );
  if (!i) return null;
  let a = d(i.rect);
  return {
    tag: b(i.tag),
    id: b(i.id),
    classes: Array.isArray(i.classes) ? i.classes.filter((e) => typeof e == `string`) : [],
    role: b(i.role),
    name: b(i.name),
    rect: { x: x(a?.x) ?? 0, y: x(a?.y) ?? 0, width: x(a?.width) ?? 0, height: x(a?.height) ?? 0 },
    focusable: i.focusable === !0,
  };
}
async function j(e) {
  let t =
      e.basePath && e.basePath !== `/`
        ? e.basePath.endsWith(`/`)
          ? e.basePath.slice(0, -1)
          : e.basePath
        : ``,
    n = new URLSearchParams({ source: e.path }),
    r = new Headers({ Accept: `image/*` });
  e.authToken && r.set(`Authorization`, `Bearer ${e.authToken}`);
  let i = await fetch(`${t}/__openclaw__/assistant-media?${n.toString()}`, {
    method: `GET`,
    headers: r,
    credentials: `same-origin`,
  });
  if (!i.ok) throw Error(`screenshot fetch failed (${i.status})`);
  let a = await i.blob();
  return await new Promise((e, t) => {
    let n = new FileReader();
    (n.addEventListener(`load`, () => {
      typeof n.result == `string` ? e(n.result) : t(Error(`screenshot read failed`));
    }),
      n.addEventListener(`error`, () => t(n.error ?? Error(`screenshot read failed`))),
      n.readAsDataURL(a));
  });
}
var M,
  N = e(() => {
    (ee(), (M = `browser.request`));
  });
function P(e) {
  if (e.title.trim()) return e.title.trim();
  try {
    return new URL(e.url).host || p(`browser.untitledTab`);
  } catch {
    return e.url || p(`browser.untitledTab`);
  }
}
function F(e) {
  return o`
    <wa-tab-group
      class="bp-tabs"
      .active=${e.activeTargetId ?? ``}
      activation="auto"
      without-scroll-controls
      @wa-tab-show=${(t) => e.onSelect(t.detail.name)}
    >
      ${e.tabs.map(
        (t) => o`
          <wa-tab
            id=${`browser-tab-${t.id}`}
            class="bp-tab"
            panel=${t.id}
            aria-controls="browser-tab-panel"
            title=${t.url}
            @auxclick=${(n) => {
              n.button === 1 && (n.preventDefault(), e.onClose(t.id));
            }}
          >
            <span class="bp-tab__label">${P(t)}</span>
          </wa-tab>
          <button
            slot="nav"
            class="bp-tab__close"
            type="button"
            title=${p(`browser.closeTab`)}
            aria-label=${`${p(`browser.closeTab`)}: ${P(t)}`}
            @click=${() => e.onClose(t.id)}
          >
            ${I}
          </button>
        `,
      )}
      <button
        slot="nav"
        class="bp-new"
        type="button"
        title=${p(`browser.newTab`)}
        aria-label=${p(`browser.newTab`)}
        @click=${e.onNew}
      >
        ${L}
      </button>
    </wa-tab-group>
  `;
}
var I,
  L,
  _e = e(() => {
    (s(),
      m(),
      v(),
      (I = l`<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8" /></svg>`),
      (L = l`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M8 3v10M3 8h10" /></svg>`));
  }),
  R,
  ve = e(() => {
    (s(),
      (R = u`
  :host {
    position: fixed;
    z-index: 60;
    color: var(--text, #d7dae0);
    font-family: var(--font-sans, system-ui, sans-serif);
  }
  .bp {
    position: fixed;
    display: flex;
    flex-direction: column;
    background: var(--bg, #0e1015);
    overflow: hidden;
  }
  /* Docked panels get a single hairline separator on the inner edge so they
     read as layout, not as a floating card. The browser dock yields to the
     terminal dock's reserved edges so the two panels tile instead of
     overlapping when both are open. */
  .bp--bottom {
    left: var(--shell-nav-width, 0);
    right: var(--oc-terminal-reserve-right, 0px);
    bottom: var(--oc-terminal-reserve-bottom, 0px);
    border-top: 1px solid var(--border, #262b34);
  }
  .bp--right {
    top: var(--shell-topbar-height, 0);
    right: var(--oc-terminal-reserve-right, 0px);
    bottom: var(--oc-terminal-reserve-bottom, 0px);
    border-left: 1px solid var(--border, #262b34);
  }
  .bp-resizer {
    position: absolute;
    z-index: 2;
    background: transparent;
  }
  .bp-resizer:hover {
    background: var(--accent, #ff5c5c);
    opacity: 0.5;
  }
  .bp-resizer--bottom {
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    cursor: ns-resize;
  }
  .bp-resizer--right {
    top: 0;
    bottom: 0;
    left: 0;
    width: 5px;
    cursor: ew-resize;
  }
  .bp-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 0 6px 0 4px;
    border-bottom: 1px solid var(--border, #262b34);
    min-height: 36px;
  }
  .bp-tabs {
    --track-width: 0;
    display: block;
    overflow-x: auto;
    scrollbar-width: none;
    min-width: 0;
  }
  .bp-tabs::part(nav) {
    display: flex;
    align-items: stretch;
    gap: 1px;
  }
  .bp-tabs::part(body) {
    display: none;
  }
  .bp-tabs::-webkit-scrollbar {
    display: none;
  }
  .bp-tab::part(base) {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 0 10px;
    height: 36px;
    max-width: 220px;
    color: var(--muted, #8a919e);
    white-space: nowrap;
    font-size: 12.5px;
    border-bottom: 2px solid transparent;
    cursor: default;
    transition:
      color 0.12s ease,
      background 0.12s ease;
  }
  .bp-tab:hover::part(base) {
    color: var(--text, #d7dae0);
    background: color-mix(in srgb, var(--text, #d7dae0) 6%, transparent);
  }
  .bp-tab[active]::part(base) {
    color: var(--text, #d7dae0);
    border-bottom-color: var(--accent, #ff5c5c);
  }
  .bp-tab__label {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .bp-tab__close {
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
  .bp-tab:hover + .bp-tab__close,
  .bp-tab[active] + .bp-tab__close,
  .bp-tab__close:hover,
  .bp-tab__close:focus-visible {
    opacity: 0.7;
  }
  .bp-new,
  .bp-icon {
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
  .bp-new {
    align-self: center;
    flex: none;
  }
  .bp-tab__close:hover,
  .bp-new:hover,
  .bp-icon:hover {
    background: color-mix(in srgb, var(--text, #d7dae0) 12%, transparent);
    color: var(--text, #d7dae0);
  }
  .bp-icon.is-active {
    color: var(--accent, #ff5c5c);
    background: color-mix(in srgb, var(--accent, #ff5c5c) 14%, transparent);
  }
  .bp-icon:disabled {
    opacity: 0.4;
  }
  .bp-actions {
    display: flex;
    align-items: center;
    gap: 2px;
    padding-left: 6px;
    flex: none;
  }
  .bp-toolbar {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 5px 8px;
    border-bottom: 1px solid var(--border, #262b34);
  }
  .bp-url {
    flex: 1;
    min-width: 0;
    height: 28px;
    padding: 0 12px;
    border: 1px solid transparent;
    border-radius: 14px;
    background: color-mix(in srgb, var(--text, #d7dae0) 8%, transparent);
    color: var(--text, #d7dae0);
    font-size: 12.5px;
    font-family: inherit;
    outline: none;
    text-overflow: ellipsis;
  }
  .bp-url:focus {
    border-color: var(--accent, #ff5c5c);
    background: var(--bg, #0e1015);
  }
  .bp-annotatebar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 10px;
    font-size: 12px;
    color: var(--muted, #8a919e);
    border-bottom: 1px solid var(--border, #262b34);
    background: color-mix(in srgb, var(--accent, #ff5c5c) 7%, transparent);
  }
  .bp-annotatebar__hint {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .bp-btn {
    border: 1px solid var(--border, #262b34);
    background: transparent;
    color: var(--text, #d7dae0);
    font-size: 12px;
    font-family: inherit;
    border-radius: 6px;
    padding: 3px 10px;
  }
  .bp-btn:hover {
    background: color-mix(in srgb, var(--text, #d7dae0) 10%, transparent);
  }
  .bp-btn--primary {
    border-color: var(--accent, #ff5c5c);
    color: var(--accent, #ff5c5c);
  }
  .bp-viewport {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow: auto;
    background: var(--bg, #0e1015);
    outline: none;
  }
  .bp-stage {
    position: relative;
    width: 100%;
  }
  .bp-shot {
    display: block;
    width: 100%;
    height: auto;
    user-select: none;
    -webkit-user-drag: none;
  }
  .bp-overlay {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    touch-action: none;
  }
  .bp-overlay--annotate {
    cursor: crosshair;
  }
  .bp-overlay--inspect {
    cursor: default;
  }
  .bp-tooltip {
    position: absolute;
    z-index: 3;
    max-width: 320px;
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid var(--border, #262b34);
    background: var(--bg, #0e1015);
    box-shadow: var(--shadow-md, 0 4px 16px rgba(0, 0, 0, 0.3));
    font-size: 12px;
    pointer-events: none;
  }
  .bp-tooltip__title {
    display: flex;
    align-items: baseline;
    gap: 8px;
    justify-content: space-between;
  }
  .bp-tooltip__selector {
    color: var(--accent, #6ea8fe);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    word-break: break-all;
  }
  .bp-tooltip__size {
    color: var(--muted, #8a919e);
    white-space: nowrap;
  }
  .bp-tooltip__row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-top: 4px;
    color: var(--muted, #8a919e);
  }
  .bp-tooltip__row span:last-child {
    color: var(--text, #d7dae0);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .bp-status {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    height: 100%;
    padding: 20px;
    font-size: 12.5px;
    color: var(--muted, #8a919e);
    text-align: center;
  }
  .bp-note {
    padding: 6px 12px;
    font-size: 12px;
    color: var(--muted, #8a919e);
    border-bottom: 1px solid var(--border, #262b34);
  }
  .bp-note--error {
    color: var(--danger, #ff6b6b);
  }
  .bp-loading {
    position: absolute;
    top: 8px;
    right: 12px;
    z-index: 3;
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 999px;
    color: var(--muted, #8a919e);
    background: color-mix(in srgb, var(--bg, #0e1015) 80%, transparent);
    border: 1px solid var(--border, #262b34);
  }
`));
  });
function z(e) {
  let t = e.trim();
  if (!t) return null;
  let n = /^[a-z][a-z0-9+.-]*:(?![0-9])/i.test(t);
  if (n && !/^https?:\/\//i.test(t)) return null;
  let r = n ? t : `https://${t}`;
  try {
    let e = new URL(r);
    return e.protocol === `http:` || e.protocol === `https:` ? e.toString() : null;
  } catch {
    return null;
  }
}
var ye = e(() => {});
function be(e) {
  return new Promise((t, n) => {
    let r = new Image();
    (r.addEventListener(`load`, () => t(r)),
      r.addEventListener(`error`, () => n(Error(`screenshot decode failed`))),
      (r.src = e));
  });
}
var B, V, H, U, W, G, K, q, J, Y, X, Z, Q, $;
e(() => {
  (s(),
    r(),
    m(),
    f(),
    ne(),
    ae(),
    ie(),
    g(),
    N(),
    _e(),
    ve(),
    ye(),
    t(),
    (B = l`<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8" /></svg>`),
    (V = l`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="2" y="2.5" width="12" height="11" rx="1.5" /><path d="M2 10h12" /></svg>`),
    (H = l`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="2" y="2.5" width="12" height="11" rx="1.5" /><path d="M10 2.5v11" /></svg>`),
    (U = l`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3L5 8l5 5" /></svg>`),
    (W = l`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3l5 5-5 5" /></svg>`),
    (G = l`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M13 8a5 5 0 1 1-1.5-3.6M13 2.5V5h-2.5" /></svg>`),
    (K = l`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 3.5H3.5v9h9V9.5M9.5 3h3.5v3.5M12.8 3.2L7.5 8.5" /></svg>`),
    (q = l`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M11.3 2.7l2 2L5 13H3v-2z" /></svg>`),
    (J = l`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l5.5 10 1.2-4.3L14 7.5z" /></svg>`),
    (Y = oe({
      storageKey: `openclaw.browser.panel.v1`,
      minHeight: 240,
      minWidth: 380,
      defaultDock: `right`,
      defaultHeight: 420,
      defaultWidth: 560,
    })),
    (X = 120),
    (Z = 350),
    (Q = new Set([
      `Enter`,
      `Backspace`,
      `Delete`,
      `Tab`,
      `Escape`,
      `ArrowLeft`,
      `ArrowRight`,
      `ArrowUp`,
      `ArrowDown`,
      `Home`,
      `End`,
      `PageUp`,
      `PageDown`,
    ])),
    ($ = class extends re {
      constructor(...e) {
        (super(...e),
          (this.client = null),
          (this.available = !1),
          (this.basePath = ``),
          (this.authToken = null),
          (this.open = !1),
          (this.dock = Y.defaults.dock),
          (this.height = Y.defaults.height),
          (this.width = Y.defaults.width),
          (this.running = null),
          (this.tabs = []),
          (this.activeTargetId = null),
          (this.view = null),
          (this.loading = !1),
          (this.errorText = null),
          (this.noticeText = null),
          (this.mode = `interact`),
          (this.strokes = []),
          (this.inspected = null),
          (this.inspectPointer = null),
          (this.evaluateUnavailable = !1),
          (this.urlDraft = ``),
          (this.pendingNewTab = !1),
          (this.viewEpoch = 0),
          (this.refreshTimer = null),
          (this.activeClient = null),
          (this.drawingStroke = null),
          (this.suppressStageClick = !1),
          (this.urlDraftEditing = !1),
          (this.wheelDeltaX = 0),
          (this.wheelDeltaY = 0),
          (this.wheelTimer = null),
          (this.lastInspectAt = 0),
          (this.inspectTimer = null),
          (this.resizeCleanup = null),
          (this.onToggleRequest = (e) => this.handleToggleRequest(e)),
          (this.onViewportResize = () => {
            let e = Math.min(this.height, Y.maxHeight()),
              t = Math.min(this.width, Y.maxWidth());
            (e !== this.height || t !== this.width) &&
              ((this.height = e), (this.width = t), this.syncLayoutReservation());
          }));
      }
      static {
        this.styles = R;
      }
      connectedCallback() {
        super.connectedCallback();
        let e = Y.load();
        ((this.dock = e.dock),
          (this.height = e.height),
          (this.width = e.width),
          (this.open = e.open && this.available),
          window.addEventListener(h, this.onToggleRequest),
          window.addEventListener(`resize`, this.onViewportResize),
          this.open && this.refreshAll());
      }
      disconnectedCallback() {
        (super.disconnectedCallback(),
          window.removeEventListener(h, this.onToggleRequest),
          window.removeEventListener(`resize`, this.onViewportResize),
          this.clearTimers(),
          this.resizeCleanup?.(),
          document.documentElement.style.setProperty(`--oc-browser-reserve-bottom`, `0px`),
          document.documentElement.style.setProperty(`--oc-browser-reserve-right`, `0px`));
      }
      updated(e) {
        ((e.has(`client`) || e.has(`available`)) &&
          (this.client !== this.activeClient &&
            ((this.activeClient = this.client),
            this.resetBrowserState(),
            this.open && this.available && this.client && this.refreshAll()),
          !this.available && this.open
            ? ((this.open = !1), this.resetBrowserState())
            : this.available &&
              !this.open &&
              Y.load().open &&
              ((this.open = !0), this.refreshAll())),
          this.syncLayoutReservation(),
          this.paintOverlay());
      }
      clearTimers() {
        (this.refreshTimer !== null &&
          (clearTimeout(this.refreshTimer), (this.refreshTimer = null)),
          this.wheelTimer !== null && (clearTimeout(this.wheelTimer), (this.wheelTimer = null)),
          this.inspectTimer !== null &&
            (clearTimeout(this.inspectTimer), (this.inspectTimer = null)));
      }
      resetBrowserState() {
        ((this.viewEpoch += 1),
          this.clearTimers(),
          (this.running = null),
          (this.tabs = []),
          (this.activeTargetId = null),
          (this.view = null),
          (this.loading = !1),
          (this.errorText = null),
          (this.noticeText = null),
          (this.mode = `interact`),
          (this.strokes = []),
          (this.drawingStroke = null),
          (this.inspected = null),
          (this.inspectPointer = null),
          (this.pendingNewTab = !1),
          (this.evaluateUnavailable = !1));
      }
      syncLayoutReservation() {
        let e = document.documentElement.style,
          t = this.available && this.open;
        (e.setProperty(
          `--oc-browser-reserve-bottom`,
          t && this.dock === `bottom` ? `${this.height}px` : `0px`,
        ),
          e.setProperty(
            `--oc-browser-reserve-right`,
            t && this.dock === `right` ? `${this.width}px` : `0px`,
          ));
      }
      toggle() {
        this.available &&
          (this.open
            ? this.closePanel()
            : ((this.open = !0),
              this.syncLayoutReservation(),
              this.persistLayout(),
              this.refreshAll()));
      }
      handleToggleRequest(e) {
        let t =
          e instanceof CustomEvent && typeof e.detail == `object` && e.detail !== null
            ? e.detail
            : null;
        (t?.dock === `right` || t?.dock === `bottom`) && (this.dock = t.dock);
        let n = typeof t?.url == `string` ? z(t.url) : null;
        if (n || t?.open === !0) {
          if (!this.available) return;
          let e = this.open;
          ((this.open = !0),
            this.syncLayoutReservation(),
            this.persistLayout(),
            n ? this.openUrl(n, { newTab: !0 }) : e || this.refreshAll());
          return;
        }
        this.toggle();
      }
      closePanel() {
        ((this.open = !1), this.syncLayoutReservation(), this.persistLayout());
      }
      persistLayout() {
        Y.save({ open: this.open, dock: this.dock, height: this.height, width: this.width });
      }
      setDock(e) {
        ((this.dock = e), this.syncLayoutReservation(), this.persistLayout());
      }
      currentEpoch() {
        return this.viewEpoch;
      }
      isCurrent(e) {
        return this.isConnected && this.open && this.viewEpoch === e;
      }
      captureClient() {
        return this.available && this.client ? this.client : null;
      }
      reportError(e) {
        this.errorText = e instanceof Error ? e.message : String(e);
      }
      async refreshAll() {
        let e = this.captureClient();
        if (!e) return;
        let t = this.currentEpoch();
        ((this.errorText = null), (this.loading = !0));
        try {
          let n = await C(e);
          if (!this.isCurrent(t)) return;
          ((this.running = n.running), (this.tabs = n.tabs), n.running || (this.view = null));
          let r = n.tabs.find((e) => e.id === this.activeTargetId) ?? n.tabs[0];
          ((this.activeTargetId = r?.id ?? null),
            this.urlDraftEditing || (this.urlDraft = r?.url ?? ``),
            r ? await this.refreshView(r.id, t) : (this.view = null));
        } catch (e) {
          this.isCurrent(t) && this.reportError(e);
        } finally {
          this.isCurrent(t) && (this.loading = !1);
        }
      }
      async refreshView(e, t = this.currentEpoch()) {
        let n = this.captureClient();
        if (!n) return;
        let r = () => this.isCurrent(t) && this.activeTargetId === e;
        this.loading = !0;
        try {
          let t = await he(n, e);
          if (!r()) return;
          let i = await j({ basePath: this.basePath, authToken: this.authToken, path: t.path }),
            a = await be(i),
            o = await this.readMetrics(n, e);
          if (!r()) return;
          ((this.view = { targetId: e, dataUrl: i, image: a, url: t.url, metrics: o }),
            !this.urlDraftEditing && t.url && (this.urlDraft = t.url));
        } catch (e) {
          r() && this.reportError(e);
        } finally {
          this.isCurrent(t) && (this.loading = !1);
        }
      }
      async readMetrics(e, t) {
        if (this.evaluateUnavailable) return null;
        try {
          return await k(e, t);
        } catch (e) {
          return (E(e) && (this.evaluateUnavailable = !0), null);
        }
      }
      scheduleViewRefresh(e = Z) {
        this.refreshTimer !== null && clearTimeout(this.refreshTimer);
        let t = this.currentEpoch();
        this.refreshTimer = window.setTimeout(() => {
          ((this.refreshTimer = null),
            this.isCurrent(t) && this.activeTargetId && this.refreshView(this.activeTargetId, t));
        }, e);
      }
      async runAction(e) {
        let t = this.captureClient();
        if (t)
          try {
            ((this.errorText = null), await e(t), this.scheduleViewRefresh());
          } catch (e) {
            (E(e) && (this.evaluateUnavailable = !0), this.reportError(e));
          }
      }
      async startBrowserNow() {
        let e = this.captureClient();
        if (!e) return;
        let t = this.currentEpoch();
        ((this.loading = !0), (this.errorText = null));
        try {
          (await ue(e), this.isCurrent(t) && (await this.refreshAll()));
        } catch (e) {
          this.isCurrent(t) && (this.reportError(e), (this.loading = !1));
        }
      }
      async openUrl(e, t) {
        let n = this.captureClient();
        if (!n) return;
        let r = this.currentEpoch();
        ((this.loading = !0), (this.errorText = null), (this.pendingNewTab = !1));
        try {
          if (t.newTab || !this.activeTargetId) {
            let t = await de(n, e);
            if (!this.isCurrent(r)) return;
            this.activeTargetId = t?.id ?? this.activeTargetId;
          } else if ((await me(n, { url: e, targetId: this.activeTargetId }), !this.isCurrent(r)))
            return;
          (await this.refreshTabsOnly(n, r),
            this.activeTargetId && (await this.refreshView(this.activeTargetId, r)));
        } catch (e) {
          this.isCurrent(r) && this.reportError(e);
        } finally {
          this.isCurrent(r) && (this.loading = !1);
        }
      }
      async refreshTabsOnly(e, t) {
        try {
          let n = await C(e);
          this.isCurrent(t) && ((this.running = n.running), (this.tabs = n.tabs));
        } catch {}
      }
      async selectTab(e) {
        e !== this.activeTargetId &&
          ((this.activeTargetId = e),
          (this.view = null),
          this.exitCaptureModes(),
          await this.runActionImmediate(async (t) => {
            (await fe(t, e), await this.refreshView(e));
          }));
      }
      async closeTab(e) {
        await this.runActionImmediate(async (t) => {
          await pe(t, e);
          let n = this.currentEpoch();
          if ((await this.refreshTabsOnly(t, n), this.activeTargetId === e)) {
            let e = this.tabs[0] ?? null;
            ((this.activeTargetId = e?.id ?? null),
              (this.view = null),
              e && (await this.refreshView(e.id, n)));
          }
        });
      }
      async runActionImmediate(e) {
        let t = this.captureClient();
        if (t)
          try {
            ((this.errorText = null), await e(t));
          } catch (e) {
            this.reportError(e);
          }
      }
      reloadPage() {
        let e = z(this.view?.metrics?.url || this.view?.url || this.urlDraft);
        if (this.activeTargetId) {
          if (!e) {
            this.refreshView(this.activeTargetId);
            return;
          }
          this.openUrl(e, { newTab: !1 });
        }
      }
      goHistory(e) {
        let t = this.activeTargetId;
        t && this.runAction((n) => O(n, { targetId: t, delta: e }));
      }
      commitUrlDraft() {
        let e = z(this.urlDraft);
        e && this.openUrl(e, { newTab: this.pendingNewTab || this.tabs.length === 0 });
      }
      exitCaptureModes() {
        ((this.mode = `interact`),
          (this.strokes = []),
          (this.drawingStroke = null),
          (this.inspected = null),
          (this.inspectPointer = null));
      }
      setMode(e) {
        if (this.mode === e) {
          this.exitCaptureModes();
          return;
        }
        (this.exitCaptureModes(),
          (this.mode = e),
          (this.noticeText = null),
          e === `inspect` &&
            this.evaluateUnavailable &&
            ((this.errorText = p(`browser.inspectUnavailable`)), (this.mode = `interact`)));
      }
      stageElement() {
        return this.renderRoot.querySelector(`.bp-stage`);
      }
      overlayCanvas() {
        return this.renderRoot.querySelector(`.bp-overlay`);
      }
      normalizedPoint(e) {
        let t = this.stageElement();
        if (!t) return null;
        let n = t.getBoundingClientRect();
        return n.width <= 0 || n.height <= 0
          ? null
          : { x: (e.clientX - n.left) / n.width, y: (e.clientY - n.top) / n.height };
      }
      remotePoint(e) {
        let t = this.normalizedPoint(e),
          n = this.view;
        if (!t || !n) return null;
        let r = n.metrics?.cssWidth ?? n.image.naturalWidth,
          i = n.metrics?.cssHeight ?? n.image.naturalHeight;
        return { x: t.x * r, y: t.y * i };
      }
      inspectHighlightRegion() {
        let e = this.view,
          t = this.inspected;
        if (!e || !t) return null;
        let n = e.metrics?.cssWidth ?? e.image.naturalWidth,
          r = e.metrics?.cssHeight ?? e.image.naturalHeight;
        return n <= 0 || r <= 0
          ? null
          : {
              x: t.rect.x / n,
              y: t.rect.y / r,
              width: t.rect.width / n,
              height: t.rect.height / r,
            };
      }
      handleStageClick(e) {
        if (this.suppressStageClick) {
          this.suppressStageClick = !1;
          return;
        }
        if (this.mode !== `interact`) return;
        this.renderRoot.querySelector(`.bp-viewport`)?.focus({ preventScroll: !0 });
        let t = this.remotePoint(e),
          n = this.activeTargetId;
        !t || !n || this.runAction((e) => ge(e, { targetId: n, x: t.x, y: t.y }));
      }
      handleWheel(e) {
        this.mode !== `interact` ||
          !this.view ||
          (e.preventDefault(),
          (this.wheelDeltaX += e.deltaX),
          (this.wheelDeltaY += e.deltaY),
          this.wheelTimer === null &&
            (this.wheelTimer = window.setTimeout(() => {
              this.wheelTimer = null;
              let e = this.wheelDeltaX,
                t = this.wheelDeltaY;
              ((this.wheelDeltaX = 0), (this.wheelDeltaY = 0));
              let n = this.activeTargetId;
              !n ||
                (e === 0 && t === 0) ||
                this.runAction(async (r) => {
                  if (this.evaluateUnavailable) {
                    await w(r, { targetId: n, key: t >= 0 ? `PageDown` : `PageUp` });
                    return;
                  }
                  await D(r, { targetId: n, deltaX: e, deltaY: t });
                });
            }, 150)));
      }
      handleViewportKeydown(e) {
        if (this.mode !== `interact` || !this.view || e.metaKey || e.ctrlKey || e.altKey) return;
        let t = e.key,
          n = Q.has(t) || t.length === 1,
          r = this.activeTargetId;
        !n || !r || (e.preventDefault(), this.runAction((e) => w(e, { targetId: r, key: t })));
      }
      handleOverlayPointerDown(e) {
        if (this.mode === `inspect`) {
          ((this.suppressStageClick = !0), this.sendAnnotation({ element: this.inspected }));
          return;
        }
        if (this.mode !== `annotate`) return;
        let t = this.normalizedPoint(e);
        t &&
          (e.target.setPointerCapture?.(e.pointerId),
          (this.drawingStroke = { points: [t] }),
          (this.strokes = [...this.strokes, this.drawingStroke]),
          this.paintOverlay());
      }
      handleOverlayPointerMove(e) {
        if (this.mode === `annotate`) {
          if (!this.drawingStroke) return;
          let t = this.normalizedPoint(e);
          t && (this.drawingStroke.points.push(t), this.paintOverlay());
          return;
        }
        this.mode === `inspect` && this.queueInspect(e);
      }
      handleOverlayPointerUp() {
        this.drawingStroke = null;
      }
      queueInspect(e) {
        let t = this.captureClient(),
          n = this.remotePoint(e),
          r = this.normalizedPoint(e),
          i = this.activeTargetId;
        if (!t || !n || !r || !i || this.evaluateUnavailable) return;
        this.inspectPointer = r;
        let a = Date.now(),
          o = () => {
            this.lastInspectAt = Date.now();
            let e = this.currentEpoch();
            A(t, { targetId: i, x: n.x, y: n.y })
              .then((t) => {
                this.isCurrent(e) &&
                  this.mode === `inspect` &&
                  ((this.inspected = t), this.paintOverlay());
              })
              .catch((e) => {
                E(e) &&
                  ((this.evaluateUnavailable = !0),
                  (this.errorText = p(`browser.inspectUnavailable`)),
                  (this.mode = `interact`));
              });
          };
        if (a - this.lastInspectAt >= X) {
          o();
          return;
        }
        (this.inspectTimer !== null && clearTimeout(this.inspectTimer),
          (this.inspectTimer = window.setTimeout(() => {
            ((this.inspectTimer = null), this.mode === `inspect` && this.captureClient() && o());
          }, X)));
      }
      undoStroke() {
        ((this.strokes = this.strokes.slice(0, -1)),
          (this.drawingStroke = null),
          this.paintOverlay());
      }
      clearStrokes() {
        ((this.strokes = []), (this.drawingStroke = null), this.paintOverlay());
      }
      async sendAnnotation(e) {
        let t = this.view,
          n = this.tabs.find((e) => e.id === this.activeTargetId);
        if (!t || (this.strokes.length === 0 && !e.element)) return;
        let r = se({
            url: t.metrics?.url || t.url || n?.url || ``,
            title: t.metrics?.title || n?.title || ``,
            strokes: this.strokes,
            element: e.element ?? null,
          }),
          i = e.element ? this.inspectHighlightRegion() : null,
          a;
        try {
          a = le({
            image: t.image,
            width: t.image.naturalWidth,
            height: t.image.naturalHeight,
            strokes: this.strokes,
            highlight: i,
          });
        } catch (e) {
          this.reportError(e);
          return;
        }
        if (!_({ text: r, dataUrl: a, fileName: `annotated-page.png` })) {
          this.errorText = p(`browser.noChatTarget`);
          return;
        }
        ((this.noticeText = p(`browser.annotationSent`)), this.exitCaptureModes());
      }
      paintOverlay() {
        let e = this.overlayCanvas(),
          t = this.stageElement();
        if (!e || !t) return;
        let n = Math.max(1, Math.round(t.clientWidth)),
          r = Math.max(1, Math.round(t.clientHeight));
        (e.width !== n || e.height !== r) && ((e.width = n), (e.height = r));
        let i = e.getContext(`2d`);
        i &&
          (i.clearRect(0, 0, n, r),
          ce(i, {
            width: n,
            height: r,
            strokes: this.strokes,
            highlight: this.mode === `inspect` ? this.inspectHighlightRegion() : null,
          }));
      }
      startResize(e) {
        (e.preventDefault(), this.resizeCleanup?.());
        let t = e.clientX,
          n = e.clientY,
          r = this.height,
          i = this.width,
          a = (e) => {
            if (this.dock === `bottom`) {
              let t = Math.max(Y.minHeight, r + (n - e.clientY));
              this.height = Math.min(t, Y.maxHeight());
            } else {
              let n = Math.max(Y.minWidth, i + (t - e.clientX));
              this.width = Math.min(n, Y.maxWidth());
            }
            this.syncLayoutReservation();
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
      renderTabStrip() {
        return F({
          tabs: this.tabs,
          activeTargetId: this.activeTargetId,
          onSelect: (e) => void this.selectTab(e),
          onClose: (e) => void this.closeTab(e),
          onNew: () => {
            ((this.pendingNewTab = !0),
              (this.urlDraft = ``),
              this.updateComplete.then(() => this.renderRoot.querySelector(`.bp-url`)?.focus()));
          },
        });
      }
      renderHeaderActions() {
        let e = this.view?.metrics?.url || this.view?.url || this.urlDraft;
        return o`
      <div class="bp-actions">
        <button
          class="bp-icon ${this.dock === `bottom` ? `is-active` : ``}"
          type="button"
          title=${p(`browser.dockBottom`)}
          aria-label=${p(`browser.dockBottom`)}
          @click=${() => this.setDock(`bottom`)}
        >
          ${V}
        </button>
        <button
          class="bp-icon ${this.dock === `right` ? `is-active` : ``}"
          type="button"
          title=${p(`browser.dockRight`)}
          aria-label=${p(`browser.dockRight`)}
          @click=${() => this.setDock(`right`)}
        >
          ${H}
        </button>
        <button
          class="bp-icon"
          type="button"
          title=${p(`browser.openExternal`)}
          aria-label=${p(`browser.openExternal`)}
          ?disabled=${!e}
          @click=${() => {
            e && te(e);
          }}
        >
          ${K}
        </button>
        <button
          class="bp-icon"
          type="button"
          title=${p(`browser.hide`)}
          aria-label=${p(`browser.hide`)}
          @click=${() => this.closePanel()}
        >
          ${B}
        </button>
      </div>
    `;
      }
      renderToolbar() {
        let e = !!this.view;
        return o`
      <div class="bp-toolbar">
        <button
          class="bp-icon"
          type="button"
          title=${p(`browser.back`)}
          aria-label=${p(`browser.back`)}
          ?disabled=${!e || this.evaluateUnavailable}
          @click=${() => this.goHistory(-1)}
        >
          ${U}
        </button>
        <button
          class="bp-icon"
          type="button"
          title=${p(`browser.forward`)}
          aria-label=${p(`browser.forward`)}
          ?disabled=${!e || this.evaluateUnavailable}
          @click=${() => this.goHistory(1)}
        >
          ${W}
        </button>
        <button
          class="bp-icon"
          type="button"
          title=${p(`browser.reload`)}
          aria-label=${p(`browser.reload`)}
          ?disabled=${!this.activeTargetId}
          @click=${() => this.reloadPage()}
        >
          ${G}
        </button>
        <input
          class="bp-url"
          type="text"
          spellcheck="false"
          autocomplete="off"
          placeholder=${p(`browser.urlPlaceholder`)}
          .value=${this.urlDraft}
          @focus=${(e) => {
            ((this.urlDraftEditing = !0), e.target.select());
          }}
          @blur=${() => {
            this.urlDraftEditing = !1;
          }}
          @input=${(e) => {
            this.urlDraft = e.target.value;
          }}
          @keydown=${(e) => {
            e.key === `Enter`
              ? (e.preventDefault(), this.commitUrlDraft(), e.target.blur())
              : e.key === `Escape` &&
                ((this.urlDraft = this.view?.metrics?.url || this.view?.url || ``),
                e.target.blur());
          }}
        />
        <button
          class="bp-icon ${this.mode === `annotate` ? `is-active` : ``}"
          type="button"
          title=${p(`browser.annotate`)}
          aria-label=${p(`browser.annotate`)}
          ?disabled=${!e}
          @click=${() => this.setMode(`annotate`)}
        >
          ${q}
        </button>
        <button
          class="bp-icon ${this.mode === `inspect` ? `is-active` : ``}"
          type="button"
          title=${this.evaluateUnavailable ? p(`browser.inspectUnavailable`) : p(`browser.inspect`)}
          aria-label=${p(`browser.inspect`)}
          ?disabled=${!e || this.evaluateUnavailable}
          @click=${() => this.setMode(`inspect`)}
        >
          ${J}
        </button>
      </div>
    `;
      }
      renderAnnotateBar() {
        return this.mode === `annotate`
          ? o`
      <div class="bp-annotatebar">
        <span class="bp-annotatebar__hint">${p(`browser.annotateHint`)}</span>
        <button
          class="bp-btn"
          type="button"
          ?disabled=${this.strokes.length === 0}
          @click=${() => this.undoStroke()}
        >
          ${p(`browser.annotateUndo`)}
        </button>
        <button
          class="bp-btn"
          type="button"
          ?disabled=${this.strokes.length === 0}
          @click=${() => this.clearStrokes()}
        >
          ${p(`browser.annotateClear`)}
        </button>
        <button
          class="bp-btn"
          type="button"
          title=${p(`browser.annotateDone`)}
          @click=${() => this.exitCaptureModes()}
        >
          ${B}
        </button>
        <button
          class="bp-btn bp-btn--primary"
          type="button"
          ?disabled=${this.strokes.length === 0}
          @click=${() => void this.sendAnnotation({})}
        >
          ${p(`browser.annotateSend`)}
        </button>
      </div>
    `
          : c;
      }
      renderInspectTooltip() {
        let e = this.inspected,
          t = this.inspectPointer;
        if (this.mode !== `inspect` || !e || !t) return c;
        let n = `${Math.min(92, Math.max(0, t.x * 100))}%`,
          r = `${Math.min(92, Math.max(0, t.y * 100 + 2))}%`,
          i = e.classes.map((e) => `.${e}`).join(``);
        return o`
      <div class="bp-tooltip" style="left:${n};top:${r}">
        <div class="bp-tooltip__title">
          <span class="bp-tooltip__selector"
            >${e.tag}${e.id ? `#${e.id}` : ``}${i}</span
          >
          <span class="bp-tooltip__size"
            >${Math.round(e.rect.width)} × ${Math.round(e.rect.height)}</span
          >
        </div>
        ${
          e.name
            ? o`<div class="bp-tooltip__row">
              <span>${p(`browser.inspectName`)}</span><span>${e.name}</span>
            </div>`
            : c
        }
        ${
          e.role
            ? o`<div class="bp-tooltip__row">
              <span>${p(`browser.inspectRole`)}</span><span>${e.role}</span>
            </div>`
            : c
        }
        <div class="bp-tooltip__row">
          <span>${p(`browser.inspectFocusable`)}</span><span>${e.focusable ? `✓` : `–`}</span>
        </div>
      </div>
    `;
      }
      renderViewport() {
        if (this.running === !1)
          return o`
        <div class="bp-status">
          <span>${p(`browser.notRunning`)}</span>
          <button
            class="bp-btn bp-btn--primary"
            type="button"
            @click=${() => void this.startBrowserNow()}
          >
            ${p(`browser.start`)}
          </button>
        </div>
      `;
        if (!this.view)
          return o`
        <div class="bp-status">
          <span>${this.loading ? p(`browser.loading`) : p(`browser.empty`)}</span>
        </div>
      `;
        let e =
          this.mode === `annotate`
            ? `bp-overlay--annotate`
            : this.mode === `inspect`
              ? `bp-overlay--inspect`
              : ``;
        return o`
      <div class="bp-stage">
        <img class="bp-shot" src=${this.view.dataUrl} alt=${this.view.metrics?.title || ``} />
        <canvas
          class="bp-overlay ${e}"
          @click=${(e) => this.handleStageClick(e)}
          @pointerdown=${(e) => this.handleOverlayPointerDown(e)}
          @pointermove=${(e) => this.handleOverlayPointerMove(e)}
          @pointerup=${() => this.handleOverlayPointerUp()}
          @pointercancel=${() => this.handleOverlayPointerUp()}
        ></canvas>
        ${this.renderInspectTooltip()}
      </div>
    `;
      }
      render() {
        if (!this.available || !this.open) return c;
        let e = this.dock === `bottom` ? `height:${this.height}px` : `width:${this.width}px`;
        return o`
      <section class="bp bp--${this.dock}" style=${e} aria-label=${p(`browser.title`)}>
        <div
          class="bp-resizer bp-resizer--${this.dock}"
          @pointerdown=${(e) => this.startResize(e)}
          role="separator"
          aria-label=${p(`browser.resize`)}
        ></div>
        <header class="bp-header">${this.renderTabStrip()} ${this.renderHeaderActions()}</header>
        ${this.renderToolbar()} ${this.renderAnnotateBar()}
        ${this.errorText ? o`<div class="bp-note bp-note--error" role="alert">${this.errorText}</div>` : this.noticeText ? o`<div class="bp-note" role="status">${this.noticeText}</div>` : c}
        <wa-tab-panel
          id="browser-tab-panel"
          class="bp-viewport"
          name=${this.activeTargetId ?? `browser`}
          active
          aria-labelledby=${this.activeTargetId ? `browser-tab-${this.activeTargetId}` : c}
          tabindex="0"
          @wheel=${(e) => this.handleWheel(e)}
          @keydown=${(e) => this.handleViewportKeydown(e)}
        >
          ${this.loading && this.view ? o`<span class="bp-loading">${p(`browser.loading`)}</span>` : c}
          ${this.renderViewport()}
        </wa-tab-panel>
      </section>
    `;
      }
    }),
    n([a({ attribute: !1 })], $.prototype, `client`, void 0),
    n([a({ type: Boolean })], $.prototype, `available`, void 0),
    n([a({ attribute: !1 })], $.prototype, `basePath`, void 0),
    n([a({ attribute: !1 })], $.prototype, `authToken`, void 0),
    n([i()], $.prototype, `open`, void 0),
    n([i()], $.prototype, `dock`, void 0),
    n([i()], $.prototype, `height`, void 0),
    n([i()], $.prototype, `width`, void 0),
    n([i()], $.prototype, `running`, void 0),
    n([i()], $.prototype, `tabs`, void 0),
    n([i()], $.prototype, `activeTargetId`, void 0),
    n([i()], $.prototype, `view`, void 0),
    n([i()], $.prototype, `loading`, void 0),
    n([i()], $.prototype, `errorText`, void 0),
    n([i()], $.prototype, `noticeText`, void 0),
    n([i()], $.prototype, `mode`, void 0),
    n([i()], $.prototype, `strokes`, void 0),
    n([i()], $.prototype, `inspected`, void 0),
    n([i()], $.prototype, `inspectPointer`, void 0),
    n([i()], $.prototype, `evaluateUnavailable`, void 0),
    n([i()], $.prototype, `urlDraft`, void 0),
    n([i()], $.prototype, `pendingNewTab`, void 0),
    customElements.get(`openclaw-browser-panel`) ||
      customElements.define(`openclaw-browser-panel`, $));
})();
//# sourceMappingURL=browser-panel-Cgq_gTcv.js.map
