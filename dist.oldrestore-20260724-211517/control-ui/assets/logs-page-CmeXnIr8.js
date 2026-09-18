import { K as x, dt as ee, nt as te, q as ne } from "./control-ui-core--EZfp09c.js";
import {
  Hi as d,
  Ui as f,
  Vi as p,
  Wa as m,
  da as h,
  di as g,
  fi as _,
  la as v,
  li as y,
  ui as b,
} from "./control-ui-core-BcbHa4vB.js";
import { o as S, t as C } from "./control-ui-core-CwQmiouz.js";
import { dt as r, ft as i } from "./control-ui-foundation-0uuDj0X3.js";
import { _ as t, g as n } from "./control-ui-foundation-CCDffryi.js";
import { $ as u } from "./control-ui-foundation-s2wA1PVE.js";
import { G as a, Y as o, at as s, et as c, nt as l } from "./lit-runtime-DkvDG939.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
import { l as E, n as D, o as O, t as k, u as A } from "./settings-ui-T0X7dZpU.js";
import { n as w, t as T } from "./settings-workspace-DRQpceJK.js";
function j(e, t) {
  return ((I.lastIndex = t), I.exec(e)?.[0]);
}
function M(e, t) {
  let n = e.charCodeAt(t);
  return n === 155 ? 1 : n === 27 && e.charCodeAt(t + 1) === 91 ? 2 : 0;
}
function N(e, t) {
  let n = M(e, t);
  if (n === 0) return;
  let r = t + n,
    i = [],
    a = !1;
  for (; r < e.length;) {
    let t = e.charCodeAt(r);
    if (t === 24 || t === 26) {
      ((r += 1), (a = !0));
      break;
    }
    if (t === 27 || t === 155) {
      a = !0;
      break;
    }
    if (t <= 31 || t === 127) {
      (i.push(e.charAt(r)), (r += 1));
      continue;
    }
    if (t >= 32 && t <= 63) {
      r += 1;
      continue;
    }
    (t >= 64 && t <= 126 && (r += 1), (a = !0));
    break;
  }
  return { controls: i, ended: a, value: e.slice(t, r) };
}
var P,
  F,
  I,
  L = e(() => {
    ((P = `(?:\\x1b\\]|\\x9d)`),
      (F = `(?:\\x1b\\\\|\\x07|\\x9c)`),
      (I = RegExp(`${P}[^\\x07\\x1b\\x9c]*${F}`, `y`)));
  });
function re(e) {
  return e.includes(`\x1B`) || e.includes(``) || e.includes(``);
}
function R(e, t) {
  let n = [],
    r = 0,
    i = 0;
  for (; i < e.length;) {
    let a = e.charCodeAt(i);
    if (a !== 27 && a !== 155 && a !== 157) {
      i += 1;
      continue;
    }
    let o = j(e, i);
    if (o) {
      (n.push(e.slice(r, i)), (i += o.length), (r = i));
      continue;
    }
    let s = N(e, i);
    if (!s) {
      V.lastIndex = i;
      let a = t.compatibilityGrammar ? V.exec(e) : null;
      if (a) {
        (n.push(e.slice(r, i)), (i += a[0].length), (r = i));
        continue;
      }
      i += 1;
      continue;
    }
    V.lastIndex = i;
    let c = t.compatibilityGrammar ? V.exec(e) : null;
    if (!s.ended && t.preserveIncompleteCsi) break;
    let l = i + s.value.length,
      u = s.value.length;
    (s.controls.length === 0 && c && c[0].length > u && (l = i + c[0].length),
      n.push(e.slice(r, i), ...s.controls),
      (i = l),
      (r = l));
  }
  return (n.push(e.slice(r)), n.join(``));
}
function z(e) {
  return re(e) ? R(e, { compatibilityGrammar: !1 }) : e;
}
var B,
  V,
  H = e(() => {
    (L(),
      (B = `${P}[\\s\\S]*?${F}`),
      (V = RegExp(
        `${B}|[\\u001B\\u009B][[\\]()#;?]*(?:\\d{1,4}(?:[;:]\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]`,
        `y`,
      )),
      typeof Intl < `u` &&
        `Segmenter` in Intl &&
        new Intl.Segmenter(void 0, { granularity: `grapheme` }));
  });
function U(e) {
  if (typeof e != `string`) return null;
  let t = e.trim();
  if (!t.startsWith(`{`) || !t.endsWith(`}`)) return null;
  try {
    let e = JSON.parse(t);
    return e && typeof e == `object` ? e : null;
  } catch {
    return null;
  }
}
function W(e) {
  if (typeof e != `string`) return null;
  let t = u(e);
  return q.has(t) ? t : null;
}
function G(e) {
  if (!e.trim()) return { raw: e, message: e };
  try {
    let t = JSON.parse(e),
      n = t && typeof t._meta == `object` && t._meta !== null ? t._meta : null,
      r = typeof t.time == `string` ? t.time : typeof n?.date == `string` ? n.date : null,
      i = W(n?.logLevelName ?? n?.level),
      a = typeof t[0] == `string` ? t[0] : typeof n?.name == `string` ? n.name : null,
      o = U(a),
      s =
        typeof o?.subsystem == `string`
          ? o.subsystem
          : typeof o?.module == `string`
            ? o.module
            : null;
    !s && a && a.length < 120 && (s = a);
    let c =
      typeof t[1] == `string`
        ? t[1]
        : typeof t[2] == `string`
          ? t[2]
          : !o && typeof t[0] == `string`
            ? t[0]
            : typeof t.message == `string`
              ? t.message
              : e;
    return { raw: e, time: r, level: i, subsystem: s && z(s), message: z(c), meta: n ?? void 0 };
  } catch {
    return { raw: e, message: z(e) };
  }
}
var K,
  q,
  J = e(() => {
    (H(),
      m(),
      (K = { trace: !0, debug: !0, info: !0, warn: !0, error: !0, fatal: !0 }),
      (q = new Set([`trace`, `debug`, `info`, `warn`, `error`, `fatal`])));
  });
function Y(e) {
  if (!e) return ``;
  let t = new Date(e);
  return Number.isNaN(t.getTime()) ? e : t.toLocaleTimeString();
}
function X(e, t) {
  return t ? u([e.message, e.subsystem, e.raw].filter(Boolean).join(` `)).includes(t) : !0;
}
function ie(e) {
  let t = u(e.filterText),
    n = Z.some((t) => !e.levelFilters[t]),
    r = e.entries.filter((n) => (n.level && !e.levelFilters[n.level] ? !1 : X(n, t))),
    i = t || n ? `filtered` : `visible`,
    a = S(`logsView.exportLabels.${i}`);
  return s`
    <div class="settings-section__header">
      <h2 class="settings-section__heading">${S(`logsView.title`)}</h2>
      <div class="settings-section__actions">
        <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
          ${e.loading ? S(`common.loading`) : S(`common.refresh`)}
        </button>
        <button
          class="btn"
          ?disabled=${r.length === 0}
          @click=${() =>
            e.onExport(
              r.map((e) => e.raw),
              i,
            )}
        >
          ${S(`logsView.exportButton`, { label: a })}
        </button>
      </div>
    </div>
    <p class="settings-section__desc">${S(`logsView.subtitle`)}</p>
    ${e.error ? s`<div class="callout danger">${e.error}</div>` : l}
    <div class="settings-group logs-card">
      ${O({
        title: S(`logsView.filter`),
        description: e.file ? S(`logsView.file`, { file: e.file }) : void 0,
        control: s`
          <input
            class="settings-input"
            aria-label=${S(`logsView.filter`)}
            .value=${e.filterText}
            @input=${(t) => e.onFilterTextChange(t.target.value)}
            placeholder=${S(`logsView.searchPlaceholder`)}
          />
        `,
      })}
      <div class="settings-row">
        <div class="chip-row">
          ${Z.map(
            (t) => s`
              <label class="chip log-chip ${t}">
                <input
                  type="checkbox"
                  .checked=${e.levelFilters[t]}
                  @change=${(n) => e.onLevelToggle(t, n.target.checked)}
                />
                <span>${t}</span>
              </label>
            `,
          )}
        </div>
        <div class="settings-row__control">
          ${A({ checked: e.autoFollow, ariaLabel: S(`logsView.autoFollow`), onChange: (t) => e.onToggleAutoFollow(t) })}
          <span class="settings-row__value">${S(`logsView.autoFollow`)}</span>
        </div>
      </div>
      ${
        e.truncated
          ? s`
            <div class="settings-row">
              ${E({ kind: `warn`, label: S(`logsView.truncated`) })}
            </div>
          `
          : l
      }
      <div class="log-stream" @scroll=${e.onScroll}>
        ${
          r.length === 0
            ? D(S(`logsView.empty`))
            : r.map(
                (e) => s`
                <div class="log-row">
                  <div class="log-time mono">${Y(e.time)}</div>
                  <div class="log-level ${e.level ?? ``}">${e.level ?? ``}</div>
                  <div class="log-subsystem mono">${e.subsystem ?? ``}</div>
                  <div class="log-message mono">${e.message ?? e.raw}</div>
                </div>
              `,
              )
        }
      </div>
    </div>
  `;
}
var Z,
  ae = e(() => {
    (c(), k(), C(), m(), (Z = [`trace`, `debug`, `info`, `warn`, `error`, `fatal`]));
  }),
  Q,
  $;
e(() => {
  (r(),
    c(),
    a(),
    te(),
    ne(),
    T(),
    d(),
    h(),
    b(),
    _(),
    J(),
    ae(),
    t(),
    (Q = 2e3),
    ($ = class extends v {
      constructor(...e) {
        (super(...e),
          (this.client = null),
          (this.connected = !1),
          (this.logsLoading = !1),
          (this.logsError = null),
          (this.logsFile = null),
          (this.logsEntries = []),
          (this.logsFilterText = ``),
          (this.logsLevelFilters = { ...K }),
          (this.logsAutoFollow = !0),
          (this.logsTruncated = !1),
          (this.logsAtBottom = !0),
          (this.logsCursor = null),
          (this.logsLimit = 500),
          (this.logsMaxBytes = 25e4),
          (this.polling = new y(
            this,
            Q,
            () => {
              this.loadLogs({ quiet: !0 });
            },
            !1,
          )),
          (this.logsScrollFrame = null),
          (this.contentScrollFrame = null),
          (this.hasBoundGatewaySource = !1),
          (this.gatewaySource = null),
          (this.requestGeneration = 0),
          (this.activeRequest = null),
          (this.subscriptions = new g(this).effect(
            () => this.context?.gateway,
            (e) => {
              let t = this.hasBoundGatewaySource;
              ((this.hasBoundGatewaySource = !0),
                (this.gatewaySource = e),
                (this.requestGeneration += 1));
              let n = e.subscribe((t) => {
                this.gatewaySource === e &&
                  this.context.gateway === e &&
                  this.applyGatewaySnapshot(t);
              });
              return (this.applyGatewaySnapshot(e.snapshot, t), (this.logsAtBottom = !0), n);
            },
          )));
      }
      firstUpdated() {
        (this.resetContentScroll(),
          (this.contentScrollFrame = requestAnimationFrame(() => {
            ((this.contentScrollFrame = null), this.resetContentScroll());
          })));
      }
      updated(e) {
        let t = this.logsAutoFollow && e.has(`logsAutoFollow`);
        (t || (this.logsAutoFollow && this.logsAtBottom && e.has(`logsEntries`))) &&
          this.scheduleScroll(t);
      }
      disconnectedCallback() {
        (this.subscriptions.clear(),
          (this.requestGeneration += 1),
          (this.activeRequest = null),
          (this.gatewaySource = null),
          (this.logsLoading = !1),
          this.logsScrollFrame !== null &&
            (cancelAnimationFrame(this.logsScrollFrame), (this.logsScrollFrame = null)),
          this.contentScrollFrame !== null &&
            (cancelAnimationFrame(this.contentScrollFrame), (this.contentScrollFrame = null)),
          super.disconnectedCallback());
      }
      resetContentScroll() {
        let e = this.closest(`.content`);
        e && ((e.scrollTop = 0), (e.scrollLeft = 0));
      }
      applyGatewaySnapshot(e, t = !1) {
        let n = e.connected !== this.connected,
          r = t || e.client !== this.client;
        ((r || n) && ((this.requestGeneration += 1), (this.activeRequest = null)),
          (this.client = e.client),
          (this.connected = e.connected),
          r ? this.resetServerState() : n && (this.logsLoading = !1),
          this.syncPolling(),
          this.ensureInitialLogs());
      }
      resetServerState() {
        ((this.logsLoading = !1),
          (this.logsError = null),
          (this.logsFile = null),
          (this.logsEntries = []),
          (this.logsTruncated = !1),
          (this.logsCursor = null),
          (this.logsAtBottom = !0));
      }
      syncPolling() {
        if (!this.connected || !this.client) {
          this.polling.stop();
          return;
        }
        this.polling.start();
      }
      ensureInitialLogs() {
        !this.connected ||
          !this.client ||
          this.logsEntries.length > 0 ||
          this.logsLoading ||
          this.loadLogs({ reset: !0 }).then((e) => {
            e && this.scheduleScroll(!0);
          });
      }
      captureRequestScope() {
        let e = this.gatewaySource,
          t = this.client;
        return !e || !t || !this.connected || !this.isConnected || this.context.gateway !== e
          ? null
          : { gateway: e, client: t, generation: this.requestGeneration };
      }
      isRequestScopeCurrent(e) {
        return (
          this.isConnected &&
          this.gatewaySource === e.gateway &&
          this.context.gateway === e.gateway &&
          this.requestGeneration === e.generation &&
          this.client === e.client &&
          this.connected
        );
      }
      async loadLogs(e) {
        let t = this.captureRequestScope(),
          n = e?.quiet === !0;
        if (!t || (this.activeRequest && this.isRequestScopeCurrent(this.activeRequest))) return !1;
        this.activeRequest = t;
        let r = () => this.activeRequest === t && this.isRequestScopeCurrent(t);
        (n || (this.logsLoading = !0), (this.logsError = null));
        try {
          let n = await t.client.request(`logs.tail`, {
            cursor: e?.reset ? void 0 : (this.logsCursor ?? void 0),
            limit: this.logsLimit,
            maxBytes: this.logsMaxBytes,
          });
          if (!r()) return !1;
          let i = n,
            a = (Array.isArray(i.lines) ? i.lines.filter((e) => typeof e == `string`) : []).map(G),
            o = e?.reset || i.reset || this.logsCursor == null;
          return (
            (this.logsEntries = o ? a : [...this.logsEntries, ...a].slice(-2e3)),
            (this.logsCursor = typeof i.cursor == `number` ? i.cursor : this.logsCursor),
            (this.logsFile = typeof i.file == `string` ? i.file : this.logsFile),
            (this.logsTruncated = !!i.truncated),
            !0
          );
        } catch (e) {
          return r()
            ? (f(e)
                ? ((this.logsEntries = []), (this.logsError = p(`logs`)))
                : (this.logsError = String(e)),
              !0)
            : !1;
        } finally {
          this.activeRequest === t &&
            ((this.activeRequest = null),
            this.isRequestScopeCurrent(t) && !n && (this.logsLoading = !1));
        }
      }
      scheduleScroll(e = !1) {
        this.logsScrollFrame !== null && cancelAnimationFrame(this.logsScrollFrame);
        let t = this.gatewaySource,
          n = this.requestGeneration,
          r = () =>
            this.isConnected &&
            this.connected &&
            t !== null &&
            this.gatewaySource === t &&
            this.context.gateway === t &&
            this.requestGeneration === n;
        this.updateComplete.then(() => {
          r() &&
            (this.logsScrollFrame = requestAnimationFrame(() => {
              if (((this.logsScrollFrame = null), !r())) return;
              let t = this.querySelector(`.log-stream`);
              if (!t) return;
              let n = t.scrollHeight - t.scrollTop - t.clientHeight;
              (e || n < 80) && (t.scrollTop = t.scrollHeight);
            }));
        });
      }
      handleScroll(e) {
        let t = e.currentTarget;
        if (!t) return;
        let n = t.scrollHeight - t.scrollTop - t.clientHeight;
        this.logsAtBottom = n < 80;
      }
      exportLogs(e, t) {
        if (e.length === 0) return;
        let n = new Blob(
            [
              `${e.join(`
`)}\n`,
            ],
            { type: `text/plain` },
          ),
          r = URL.createObjectURL(n),
          i = document.createElement(`a`),
          a = new Date().toISOString().slice(0, 19).replace(/[:T]/g, `-`);
        ((i.href = r),
          (i.download = `openclaw-logs-${t}-${a}.log`),
          i.click(),
          URL.revokeObjectURL(r));
      }
      render() {
        let e = ie({
          loading: this.logsLoading,
          error: this.logsError,
          file: this.logsFile,
          entries: this.logsEntries,
          filterText: this.logsFilterText,
          levelFilters: this.logsLevelFilters,
          autoFollow: this.logsAutoFollow,
          truncated: this.logsTruncated,
          onFilterTextChange: (e) => (this.logsFilterText = e),
          onLevelToggle: (e, t) => {
            this.logsLevelFilters = { ...this.logsLevelFilters, [e]: t };
          },
          onToggleAutoFollow: (e) => (this.logsAutoFollow = e),
          onRefresh: () =>
            void this.loadLogs({ reset: !0 }).then((e) => {
              e && this.scheduleScroll(!0);
            }),
          onExport: (e, t) => this.exportLogs(e, t),
          onScroll: (e) => this.handleScroll(e),
        });
        return s`
      <section class="content-header">
        <div>
          <div class="page-title">${ee(`logs`)}</div>
        </div>
      </section>
      ${w(e, { fillHeight: !0 })}
    `;
      }
    }),
    n([i({ context: x, subscribe: !0 })], $.prototype, `context`, void 0),
    n([o()], $.prototype, `client`, void 0),
    n([o()], $.prototype, `connected`, void 0),
    n([o()], $.prototype, `logsLoading`, void 0),
    n([o()], $.prototype, `logsError`, void 0),
    n([o()], $.prototype, `logsFile`, void 0),
    n([o()], $.prototype, `logsEntries`, void 0),
    n([o()], $.prototype, `logsFilterText`, void 0),
    n([o()], $.prototype, `logsLevelFilters`, void 0),
    n([o()], $.prototype, `logsAutoFollow`, void 0),
    n([o()], $.prototype, `logsTruncated`, void 0),
    n([o()], $.prototype, `logsAtBottom`, void 0),
    customElements.get(`openclaw-logs-page`) || customElements.define(`openclaw-logs-page`, $));
})();
//# sourceMappingURL=logs-page-CmeXnIr8.js.map
