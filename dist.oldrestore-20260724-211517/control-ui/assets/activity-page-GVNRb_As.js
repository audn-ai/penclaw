import {
  K as oe,
  dt as se,
  f as ce,
  l as le,
  nt as ue,
  q as b,
} from "./control-ui-core--EZfp09c.js";
import {
  $i as p,
  Qn as ee,
  Rn as m,
  Wa as h,
  Zi as g,
  _n as _,
  da as v,
  di as te,
  ea as y,
  fi as ne,
  ia as re,
  la as ie,
  tn as ae,
} from "./control-ui-core-BcbHa4vB.js";
import { $ as C, Q as w } from "./control-ui-core-CQDTaMS5.js";
import { o as x, t as S } from "./control-ui-core-CwQmiouz.js";
import { dt as i, ft as a } from "./control-ui-foundation-0uuDj0X3.js";
import { _ as t, g as n, p as r } from "./control-ui-foundation-CCDffryi.js";
import { $ as d, X as f } from "./control-ui-foundation-s2wA1PVE.js";
import { G as o, Y as s, at as c, et as l, nt as u } from "./lit-runtime-DkvDG939.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
import { l as D, o as O, t as k, u as A } from "./settings-ui-T0X7dZpU.js";
import { n as T, t as E } from "./settings-workspace-DRQpceJK.js";
function j(e) {
  return (typeof e == `string` && e.trim()) || null;
}
function M(e) {
  return e && typeof e == `object` ? e : null;
}
function N(e, t = Date.now()) {
  let n = M(e),
    r = j(n?.runId),
    i = M(n?.data);
  if (!n || n.stream !== `tool` || !r || !i) return null;
  let a = j(n.sessionKey),
    o = j(n.agentId);
  return {
    runId: r,
    ts: typeof n.ts == `number` ? n.ts : t,
    receivedAt: t,
    ...(a ? { sessionKey: a } : {}),
    ...(o ? { agentId: o } : {}),
    data: i,
  };
}
function P(e) {
  if (typeof e == `string`) return e;
  if (typeof e == `number` || typeof e == `boolean`) return String(e);
  let t = M(e);
  if (!t) return null;
  if (typeof t.text == `string`) return t.text;
  let n = t.content;
  if (!Array.isArray(n)) return null;
  let r = n
    .map((e) => {
      let t = M(e);
      return t?.type === `text` && typeof t.text == `string` ? t.text : null;
    })
    .filter((e) => !!e);
  return r.length > 0
    ? r.join(`
`)
    : null;
}
function F(e) {
  let t = P(e);
  if (t !== null) return t;
  if (e == null) return null;
  try {
    return JSON.stringify(e, null, 2);
  } catch {
    return p(e);
  }
}
function I(e) {
  return G.reduce((e, [t, n]) => e.replace(t, n), e);
}
function L(e) {
  let t = F(e);
  if (!t) return { truncated: !1 };
  let n = re(I(t), U);
  return { text: n.text, truncated: n.truncated };
}
function R(e) {
  if (e == null) return 0;
  if (Array.isArray(e)) return e.length;
  let t = M(e);
  return t ? Object.keys(t).length : 1;
}
function z(e) {
  return e?.isError === !0 || e?.is_error === !0;
}
function de(e) {
  if (j(e.phase) !== `result`) return `running`;
  let t = M(e.result);
  if (z(e) || z(t)) return `error`;
  let n = j(e.status) ?? j(t?.status);
  if (n && /error|fail|failed|failure/i.test(n)) return `error`;
  let r = Number(t?.exitCode ?? e.exitCode);
  return Number.isFinite(r) && r !== 0 ? `error` : `done`;
}
function B(e) {
  return W[e];
}
function V(e, t, n) {
  let r = `${n} argument${n === 1 ? `` : `s`} hidden`;
  return `${e} ${B(t)}; ${r}`;
}
function H(e, t) {
  let n = t.data ?? {},
    r = j(n.toolCallId);
  if (!r) return e;
  let i = j(n.name) ?? `tool`,
    a = `${t.runId}:${r}`,
    o = t.receivedAt,
    s = typeof t.ts == `number` ? t.ts : o,
    c = de(n),
    l = L(n.phase === `update` ? n.partialResult : n.phase === `result` ? n.result : null),
    u = e.find((e) => e.id === a),
    d = n.args === void 0 ? (u?.hiddenArgumentCount ?? 0) : R(n.args),
    f = l.text ?? u?.outputPreview,
    p = {
      id: a,
      toolCallId: r,
      runId: t.runId,
      ...(t.sessionKey ? { sessionKey: t.sessionKey } : {}),
      toolName: i,
      status: c,
      startedAt: u?.startedAt ?? s,
      updatedAt: o,
      durationMs: Math.max(0, o - (u?.startedAt ?? s)),
      outputTruncated: l.truncated || u?.outputTruncated === !0,
      summary: V(i, c, d),
      hiddenArgumentCount: d,
      ...(f ? { outputPreview: f } : {}),
    };
  return (u ? e.map((e) => (e.id === a ? p : e)) : [...e, p]).slice(-100);
}
var U,
  W,
  G,
  fe = e(() => {
    (y(),
      (U = 2e3),
      (W = { running: `running`, done: `completed`, error: `failed` }),
      (G = [
        [/\b(Authorization|Cookie|Set-Cookie)\s*:\s*[^\n\r]+/gi, `$1: [redacted]`],
        [/\b(Bearer\s+)[A-Za-z0-9._~+/=-]{12,}/gi, `$1[redacted]`],
        [
          /\b(api[_.-]?key|token|secret|password|passwd|authorization)\b(["'])(\s*:\s*)"(?:\\.|[^"\\\r\n])*"/gi,
          `$1$2$3"[redacted]"`,
        ],
        [
          /\b(api[_.-]?key|token|secret|password|passwd|authorization)\b(["'])(\s*:\s*)'(?:\\.|[^'\\\r\n])*'/gi,
          `$1$2$3'[redacted]'`,
        ],
        [
          /\b(api[_.-]?key|token|secret|password|passwd|authorization)\b(\s*[:=]\s*)["']?[^"',\s}]+/gi,
          `$1$2[redacted]`,
        ],
        [
          /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g,
          `[redacted private key]`,
        ],
        [
          /(^|[\s"'`=])(?:\/Users\/|\/home\/|\/var\/folders\/|[A-Za-z]:\\)[^\s"'`,;]+/g,
          `$1[redacted path]`,
        ],
      ]));
  }),
  pe = e(() => {});
function me(e) {
  return g(e, { hour: `numeric`, minute: `2-digit`, second: `2-digit` }, ``);
}
function he(e) {
  return !Number.isFinite(e) || e < 0 ? x(`common.na`) : (r(e, { spaced: !0 }) ?? `0ms`);
}
function K(e) {
  return x(`activity.status.${e}`);
}
function q(e) {
  return e === 1
    ? x(`activity.argumentHiddenOne`)
    : x(`activity.argumentsHidden`, { count: String(e) });
}
function J(e) {
  return x(`activity.entrySummary`, {
    argumentSummary: q(e.hiddenArgumentCount),
    status: K(e.status),
    tool: e.toolName,
  });
}
function ge(e, t) {
  return t
    ? d(
        [
          e.toolName,
          e.status,
          e.summary,
          J(e),
          e.outputPreview,
          e.runId,
          e.toolCallId,
          e.sessionKey,
        ]
          .filter(Boolean)
          .join(` `),
      ).includes(t)
    : !0;
}
function _e(e) {
  return f(e.map((e) => e.toolName));
}
function ve(e) {
  let t = d(e.filterText);
  return e.entries.filter((n) =>
    !e.statusFilters[n.status] || (e.toolFilter && n.toolName !== e.toolFilter) ? !1 : ge(n, t),
  );
}
function ye(e, t) {
  return c`
    <label class="activity-status-filter">
      <input
        type="checkbox"
        .checked=${e.statusFilters[t]}
        @change=${(n) => e.onStatusToggle(t, n.target.checked)}
      />
      <span>${K(t)}</span>
    </label>
  `;
}
function be(e) {
  return Z[e];
}
function Y(e, t) {
  let n = e.expandedIds.has(t.id);
  return c`
    <details
      class="activity-entry activity-entry--${t.status}"
      role="listitem"
      .open=${n}
      @toggle=${(n) => e.onEntryToggle(t.id, n.currentTarget.open)}
    >
      <summary class="activity-entry__summary">
        <span class="activity-entry__chevron" aria-hidden="true">${w.chevronRight}</span>
        <span class="activity-entry__main">
          <span class="activity-entry__title">
            ${D({ kind: be(t.status), label: K(t.status) })}
            <span class="activity-entry__tool mono">${t.toolName}</span>
          </span>
          <span class="activity-entry__text">${J(t)}</span>
        </span>
        <span class="activity-entry__meta">
          <span>${me(t.updatedAt)}</span>
          <span>${he(t.durationMs)}</span>
        </span>
      </summary>
      <div class="activity-entry__body">
        <div class="activity-entry__facts">
          <span>${q(t.hiddenArgumentCount)}</span>
          <span class="mono">${x(`activity.toolCallId`)}: ${t.toolCallId}</span>
          <span class="mono">${x(`activity.runId`)}: ${t.runId}</span>
          ${t.sessionKey ? c`<span class="mono">${x(`activity.session`)}: ${t.sessionKey}</span>` : u}
        </div>
        ${
          t.outputPreview
            ? c`
              <pre class="activity-entry__preview">${t.outputPreview}</pre>
              ${t.outputTruncated ? c`<div class="activity-entry__note">${x(`activity.outputTruncated`)}</div>` : u}
            `
            : c`<div class="activity-entry__note">${x(`activity.noOutputPreview`)}</div>`
        }
      </div>
    </details>
  `;
}
function xe(e) {
  let t = _e(e.entries),
    n = ve(e),
    r = e.filterText.trim() || e.toolFilter || X.some((t) => !e.statusFilters[t]);
  return c`
    <section class="activity-page" aria-label=${x(`activity.title`)}>
      <div class="settings-section__header">
        <h2 class="settings-section__heading">${x(`activity.title`)}</h2>
        <div class="settings-section__actions">
          <span class="activity-count" aria-live="polite">
            ${x(`activity.visibleCount`, { visible: String(n.length), total: String(e.entries.length) })}
          </span>
          <button
            type="button"
            class="btn btn--sm"
            ?disabled=${n.length === 0}
            @click=${e.onExpandAll}
          >
            ${x(`activity.expandAll`)}
          </button>
          <button
            type="button"
            class="btn btn--sm"
            ?disabled=${e.expandedIds.size === 0}
            @click=${e.onCollapseAll}
          >
            ${x(`activity.collapseAll`)}
          </button>
          <button
            type="button"
            class="btn btn--sm danger"
            ?disabled=${e.entries.length === 0}
            @click=${e.onClear}
          >
            ${x(`activity.clear`)}
          </button>
        </div>
      </div>
      <div class="settings-group activity-group">
        ${O({
          title: x(`activity.search`),
          control: c`
            <input
              class="settings-input"
              type="search"
              aria-label=${x(`activity.search`)}
              .value=${e.filterText}
              placeholder=${x(`activity.searchPlaceholder`)}
              @input=${(t) => e.onFilterTextChange(t.target.value)}
            />
          `,
        })}
        ${O({
          title: x(`activity.toolFilter`),
          control: c`
            <select
              class="settings-select"
              aria-label=${x(`activity.toolFilter`)}
              .value=${e.toolFilter}
              @change=${(t) => e.onToolFilterChange(t.target.value)}
            >
              <option value="">${x(`activity.allTools`)}</option>
              ${t.map((e) => c`<option value=${e}>${e}</option>`)}
            </select>
          `,
        })}
        ${O({
          title: x(`activity.statusFilters`),
          control: c`
            <span
              role="group"
              aria-label=${x(`activity.statusFilters`)}
              class="activity-status-filters"
            >
              ${X.map((t) => ye(e, t))}
            </span>
          `,
        })}
        ${O({ title: x(`activity.autoFollow`), control: A({ checked: e.autoFollow, ariaLabel: x(`activity.autoFollow`), onChange: (t) => e.onToggleAutoFollow(t) }) })}
        <div
          class="activity-stream"
          role="list"
          aria-label=${x(`activity.streamLabel`)}
          @scroll=${e.onScroll}
        >
          ${
            n.length === 0
              ? c`
                <div class="activity-empty">
                  ${e.entries.length === 0 || !r ? x(`activity.empty`) : x(`activity.emptyFiltered`)}
                </div>
              `
              : n.map((t) => Y(e, t))
          }
        </div>
      </div>
    </section>
  `;
}
var X,
  Z,
  Se = e(() => {
    (l(),
      C(),
      k(),
      S(),
      y(),
      h(),
      pe(),
      (X = [`running`, `done`, `error`]),
      (Z = { running: `warn`, done: `ok`, error: `danger` }));
  }),
  Q,
  $;
e(() => {
  (i(),
    l(),
    o(),
    ue(),
    b(),
    le(),
    E(),
    ae(),
    m(),
    v(),
    ne(),
    fe(),
    Se(),
    t(),
    ($ = class extends ie {
      constructor(...e) {
        (super(...e),
          (this.entries = []),
          (this.filterText = ``),
          (this.statusFilters = { running: !0, done: !0, error: !0 }),
          (this.toolFilter = ``),
          (this.expandedIds = new Set()),
          (this.autoFollow = !0),
          (this.atBottom = !0),
          (this.sessionKey = ``),
          (this.scrollFrame = null),
          (this.subscriptions = new te(this).effect(
            () => this.context?.gateway,
            (e) => {
              this.applyGatewaySnapshot(e, e.snapshot, !0);
              let t = e.subscribeEvents((t) => {
                  this.applyGatewayEvent(e, t, Date.now());
                }),
                n = e.subscribe((t) => this.applyGatewaySnapshot(e, t, !1));
              return () => {
                (n(), t());
              };
            },
          )));
      }
      updated(e) {
        this.autoFollow &&
          this.atBottom &&
          (e.has(`entries`) || e.has(`autoFollow`)) &&
          this.scheduleScroll(e.has(`autoFollow`));
      }
      disconnectedCallback() {
        (this.subscriptions.clear(),
          this.scrollFrame !== null &&
            (cancelAnimationFrame(this.scrollFrame), (this.scrollFrame = null)),
          super.disconnectedCallback());
      }
      applyGatewaySnapshot(e, t, n) {
        let r = this.sessionKey;
        ((this.sessionKey = _(ce().sessionKey, t.hello)),
          (n || this.sessionKey !== r) && this.rebuildEntries(e, t));
      }
      rebuildEntries(e, t) {
        let n = [],
          r = e.eventLog,
          i = Q ? r.indexOf(Q) : -1,
          a = i < 0 ? r : r.slice(0, i);
        for (let e of a.toReversed()) n = this.reduceGatewayEvent(n, t, e.event, e.payload, e.ts);
        ((n.length > 0 || this.entries.length > 0) && (this.entries = n),
          this.expandedIds.size > 0 && (this.expandedIds = new Set()),
          (this.atBottom = !0));
      }
      applyGatewayEvent(e, t, n) {
        if (this.context.gateway !== e) return;
        let r = this.reduceGatewayEvent(this.entries, e.snapshot, t.event, t.payload, n);
        r !== this.entries && (this.entries = r);
      }
      reduceGatewayEvent(e, t, n, r, i) {
        if (n !== `agent` && n !== `session.tool`) return e;
        let a = N(r, i);
        return !a ||
          !ee(
            { sessionKey: this.sessionKey, assistantAgentId: t.assistantAgentId, hello: t.hello },
            a.sessionKey,
            a.agentId,
          )
          ? e
          : H(e, a);
      }
      scheduleScroll(e = !1) {
        (this.scrollFrame !== null && cancelAnimationFrame(this.scrollFrame),
          this.updateComplete.then(() => {
            this.isConnected &&
              (this.scrollFrame = requestAnimationFrame(() => {
                this.scrollFrame = null;
                let t = this.querySelector(`.activity-stream`);
                if (!t) return;
                let n = t.scrollHeight - t.scrollTop - t.clientHeight;
                (!e && (!this.autoFollow || (!this.atBottom && n >= 120))) ||
                  ((t.scrollTop = t.scrollHeight), (this.atBottom = !0));
              }));
          }));
      }
      handleScroll(e) {
        let t = e.currentTarget;
        if (!t) return;
        let n = t.scrollHeight - t.scrollTop - t.clientHeight;
        this.atBottom = n < 120;
      }
      clearEntries() {
        ((Q = this.context.gateway.eventLog[0]),
          (this.entries = []),
          (this.expandedIds = new Set()),
          (this.atBottom = !0));
      }
      render() {
        let e = xe({
          entries: this.entries,
          filterText: this.filterText,
          statusFilters: this.statusFilters,
          toolFilter: this.toolFilter,
          expandedIds: this.expandedIds,
          autoFollow: this.autoFollow,
          onFilterTextChange: (e) => (this.filterText = e),
          onToolFilterChange: (e) => (this.toolFilter = e),
          onStatusToggle: (e, t) => {
            this.statusFilters = { ...this.statusFilters, [e]: t };
          },
          onToggleAutoFollow: (e) => {
            ((this.autoFollow = e), e && this.scheduleScroll(!0));
          },
          onClear: () => this.clearEntries(),
          onExpandAll: () => {
            this.expandedIds = new Set(this.entries.map((e) => e.id));
          },
          onCollapseAll: () => {
            this.expandedIds = new Set();
          },
          onEntryToggle: (e, t) => {
            let n = new Set(this.expandedIds);
            (t ? n.add(e) : n.delete(e), (this.expandedIds = n));
          },
          onScroll: (e) => this.handleScroll(e),
        });
        return c`
      <section class="content-header">
        <div>
          <div class="page-title">${se(`activity`)}</div>
        </div>
      </section>
      ${T(e, { fillHeight: !0 })}
    `;
      }
    }),
    n([a({ context: oe, subscribe: !0 })], $.prototype, `context`, void 0),
    n([s()], $.prototype, `entries`, void 0),
    n([s()], $.prototype, `filterText`, void 0),
    n([s()], $.prototype, `statusFilters`, void 0),
    n([s()], $.prototype, `toolFilter`, void 0),
    n([s()], $.prototype, `expandedIds`, void 0),
    n([s()], $.prototype, `autoFollow`, void 0),
    n([s()], $.prototype, `atBottom`, void 0),
    customElements.define(`openclaw-activity-page`, $));
})();
//# sourceMappingURL=activity-page-GVNRb_As.js.map
