import { K as se, dt as ce, nt as le, q as ue } from "./control-ui-core--EZfp09c.js";
import {
  Hi as f,
  Ki as ee,
  Ui as p,
  Vi as te,
  ai as m,
  da as ne,
  ea as h,
  ii as g,
  in as _,
  la as re,
  ln as ie,
  ni as ae,
  tn as oe,
} from "./control-ui-core-BcbHa4vB.js";
import { $ as de, Q as b } from "./control-ui-core-CQDTaMS5.js";
import { o as v, t as y } from "./control-ui-core-CwQmiouz.js";
import { dt as i, ft as a } from "./control-ui-foundation-0uuDj0X3.js";
import { _ as t, g as n, p as r } from "./control-ui-foundation-CCDffryi.js";
import { G as o, Y as s, at as c, et as l, nt as u, st as d } from "./lit-runtime-DkvDG939.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
import { a as S, n as C, r as w, s as T, t as pe } from "./settings-ui-T0X7dZpU.js";
import { n as x, t as fe } from "./settings-workspace-DRQpceJK.js";
var me = e(() => {});
function E(e) {
  return new Date(`${e}T12:00:00Z`).getTime();
}
function D(e) {
  return new Date(e).toISOString().slice(0, 10);
}
function O(e = new Date()) {
  let t = String(e.getMonth() + 1).padStart(2, `0`),
    n = String(e.getDate()).padStart(2, `0`);
  return `${e.getFullYear()}-${t}-${n}`;
}
function k(e) {
  if (e == null || !Number.isFinite(e) || e <= 0) return `0`;
  for (let t of [
    { threshold: 0xe8d4a51000, suffix: `T` },
    { threshold: 1e9, suffix: `B` },
    { threshold: 1e6, suffix: `M` },
    { threshold: 1e3, suffix: `k` },
  ]) {
    if (e < t.threshold) continue;
    let n = e / t.threshold;
    return `${n < 100 ? n.toFixed(1).replace(/\.0$/, ``) : String(Math.round(n))}${t.suffix}`;
  }
  return String(Math.round(e));
}
function A(e) {
  return r(e, { spaced: !0 }) ?? `0s`;
}
function j(e) {
  return e
    .filter((e) => e.totalTokens > 0)
    .map((e) => e.date)
    .toSorted();
}
function M(e, t) {
  let n = j(e);
  if (n.length === 0) return { current: 0, longest: 0 };
  let r = 1,
    i = 1;
  for (let e = 1; e < n.length; e += 1) {
    let t = n[e],
      a = n[e - 1];
    !t || !a || ((i = Math.round((E(t) - E(a)) / z) === 1 ? i + 1 : 1), (r = Math.max(r, i)));
  }
  let a = n.at(-1) ?? t;
  return { current: Math.round((E(t) - E(a)) / z) <= 1 ? i : 0, longest: r };
}
function N(e) {
  let t = e.toSorted((e, t) => e - t),
    n = (e) => t[Math.min(t.length - 1, Math.floor(t.length * e))] ?? 0;
  return [n(0.25), n(0.5), n(0.75)];
}
function P(e, t) {
  return e <= 0 ? 0 : e < t[0] ? 1 : e < t[1] ? 2 : e < t[2] ? 3 : 4;
}
function F(e, t, n) {
  let r = E(t),
    i = r - (B * 7 - 1) * z,
    a = new Map(e.map((e) => [e.date, e.totalTokens])),
    o = e.filter((e) => e.totalTokens > 0 && E(e.date) >= i).map((e) => e.totalTokens),
    s = o.length > 0 ? N(o) : [0, 0, 0],
    c = i - new Date(i).getUTCDay() * z,
    l = new Intl.DateTimeFormat(n, { month: `short`, timeZone: `UTC` }),
    u = [],
    d = [],
    f = -1;
  for (let e = c; e <= r; e += 7 * z) {
    let t = [];
    for (let n = 0; n < 7; n += 1) {
      let o = e + n * z;
      if (o < i || o > r) {
        t.push(null);
        continue;
      }
      let c = D(o),
        l = a.get(c) ?? 0;
      t.push({ date: c, tokens: l, level: P(l, s) });
    }
    u.push({ days: t });
    let n = new Date(e).getUTCMonth();
    (d.push(n === f ? `` : l.format(new Date(e))), (f = n));
  }
  return { weeks: u, monthLabels: d };
}
function I(e) {
  let t = null;
  for (let n of e) n.totalTokens > 0 && n.totalTokens > (t?.totalTokens ?? 0) && (t = n);
  return t;
}
function L(e) {
  return j(e)[0] ?? null;
}
function R(e) {
  let t = e.aggregates,
    n = t.byModel
      .filter((e) => e.model)
      .toSorted((e, t) => t.totals.totalTokens - e.totals.totalTokens)[0],
    r = t.tools.tools
      .toSorted((e, t) => t.count - e.count)
      .slice(0, 5)
      .map((e) => ({ name: e.name, count: e.count })),
    i = t.byChannel
      .toSorted((e, t) => t.totals.totalTokens - e.totals.totalTokens)
      .slice(0, 3)
      .map((e) => ({ channel: V(e.channel), tokens: e.totals.totalTokens })),
    a = t.longestSessionDurationMs ?? null;
  if (a == null)
    for (let t of e.sessions) {
      let e = t.usage?.durationMs;
      e != null && e > (a ?? 0) && (a = e);
    }
  return {
    topModel: n?.model ?? null,
    messages: t.messages.total,
    toolCalls: t.tools.totalCalls,
    uniqueTools: t.tools.uniqueTools,
    agents: t.byAgent.length,
    sessions: t.sessionCount ?? e.sessions.length,
    sessionsCapped: t.sessionCount == null && e.sessions.length >= 1e3,
    topTools: r,
    topChannels: i,
    longestSessionMs: a,
  };
}
var z,
  B,
  V,
  he = e(() => {
    (h(), (z = 1440 * 60 * 1e3), (B = 52), (V = (e) => e.charAt(0).toUpperCase() + e.slice(1)));
  });
function H() {
  return new Intl.NumberFormat(void 0, { maximumFractionDigits: 0 });
}
function ge(e) {
  return new Intl.DateTimeFormat(void 0, {
    month: `short`,
    year: `numeric`,
    timeZone: `UTC`,
  }).format(new Date(`${e}T12:00:00Z`));
}
function U(e) {
  return new Intl.DateTimeFormat(void 0, { dateStyle: `medium`, timeZone: `UTC` }).format(
    new Date(`${e}T12:00:00Z`),
  );
}
function W(e) {
  return v(e === 1 ? `profilePage.streakDay` : `profilePage.streakDays`, { count: H().format(e) });
}
function _e(e) {
  return p(e)
    ? te(`usage`)
    : e instanceof Error && e.message.trim()
      ? e.message
      : typeof e == `string`
        ? e
        : `request failed`;
}
var G, K, q, J, Y, X, Z, Q, $;
e(() => {
  (i(),
    l(),
    o(),
    le(),
    ue(),
    de(),
    pe(),
    fe(),
    y(),
    ae(),
    h(),
    f(),
    oe(),
    ne(),
    me(),
    he(),
    t(),
    (G = 11),
    (K = 14),
    (q = 30),
    (J = 18),
    (Y = 5e3),
    (X = 6e4),
    (Z = 24),
    (Q = [
      { row: 1, utcDay: Date.UTC(2024, 0, 1) },
      { row: 3, utcDay: Date.UTC(2024, 0, 3) },
      { row: 5, utcDay: Date.UTC(2024, 0, 5) },
    ]),
    ($ = class extends re {
      constructor(...e) {
        (super(...e),
          (this.loading = !0),
          (this.error = null),
          (this.costSummary = null),
          (this.sessionsResult = null),
          (this.client = null),
          (this.connected = !1),
          (this.requestId = 0),
          (this.refreshTimer = null),
          (this.refreshAttempts = 0),
          (this.subscriptions = []));
      }
      connectedCallback() {
        (super.connectedCallback(),
          (this.subscriptions = [
            this.context.gateway.subscribe((e) => this.applyGatewaySnapshot(e)),
            this.context.agents.subscribe(() => this.requestUpdate()),
            this.context.agentIdentity.subscribe(() => this.requestUpdate()),
          ]),
          this.applyGatewaySnapshot(this.context.gateway.snapshot));
      }
      disconnectedCallback() {
        for (let e of this.subscriptions) e();
        ((this.subscriptions = []),
          (this.requestId += 1),
          this.clearRefreshTimer(),
          (this.refreshAttempts = 0),
          (this.client = null),
          (this.connected = !1),
          super.disconnectedCallback());
      }
      applyGatewaySnapshot(e) {
        let t = e.client !== this.client,
          n = e.connected && !this.connected;
        if (
          ((this.client = e.client),
          (this.connected = e.connected),
          t &&
            (this.clearRefreshTimer(),
            (this.refreshAttempts = 0),
            (this.costSummary = null),
            (this.sessionsResult = null),
            (this.error = null)),
          !e.connected || !e.client)
        ) {
          ((this.requestId += 1), this.clearRefreshTimer(), (this.loading = !1));
          return;
        }
        (this.context.agents.ensureList().then((e) => {
          e && this.context.agentIdentity.ensure([e.defaultId]);
        }),
          (t || n || (!this.costSummary && !this.loading && !this.error)) && this.loadProfile());
      }
      async loadProfile() {
        let e = this.client;
        if (!e || !this.connected) return;
        let t = ++this.requestId;
        ((this.loading = !0), (this.error = null));
        let n = _(`local`);
        try {
          let [r, i] = await Promise.all([
            e.request(`usage.cost`, { range: `all`, agentScope: `all`, ...n }),
            ie(e, { range: `all`, agentScope: `all`, groupBy: `instance`, limit: 1e3, ...n }).catch(
              () => null,
            ),
          ]);
          if (t !== this.requestId) return;
          ((this.costSummary = r), (this.sessionsResult = i), this.scheduleCacheSettleRefresh());
        } catch (e) {
          if (t !== this.requestId) return;
          this.error = _e(e);
        } finally {
          t === this.requestId && (this.loading = !1);
        }
      }
      isCacheSettling() {
        return [
          this.costSummary?.cacheStatus?.status,
          this.sessionsResult?.cacheStatus?.status,
        ].some((e) => e === `refreshing` || e === `partial`);
      }
      scheduleCacheSettleRefresh() {
        if ((this.clearRefreshTimer(), !this.isCacheSettling())) {
          this.refreshAttempts = 0;
          return;
        }
        let e = this.refreshAttempts < Z ? Y : X;
        ((this.refreshAttempts += 1),
          (this.refreshTimer = window.setTimeout(() => {
            ((this.refreshTimer = null), this.loadProfile());
          }, e)));
      }
      clearRefreshTimer() {
        this.refreshTimer !== null &&
          (window.clearTimeout(this.refreshTimer), (this.refreshTimer = null));
      }
      featuredAgent() {
        let e = this.context.agents.state.agentsList,
          t = e?.defaultId ?? `main`,
          n = e?.agents.find((e) => e.id === t) ?? { id: t },
          r = this.context.agentIdentity.get(t),
          i = g(n, r),
          a = m(r?.avatar) ?? m(n.identity?.emoji) ?? m(n.identity?.avatar);
        return {
          agentId: t,
          name: r?.name?.trim() || n.identity?.name?.trim() || n.name?.trim() || t,
          avatarUrl: i,
          textAvatar: a,
        };
      }
      renderAvatar(e, t, n) {
        return e
          ? c`<img class="profile-hero__avatar-image" src=${e} alt=${n} />`
          : t
            ? c`<span class="profile-hero__avatar-text">${t}</span>`
            : c`<span class="profile-hero__avatar-mascot" aria-hidden="true"
      >${b.lobster}</span
    >`;
      }
      renderHero(e) {
        let { agentId: t, name: n, avatarUrl: r, textAvatar: i } = this.featuredAgent(),
          a = this.costSummary ? L(this.costSummary.daily) : null,
          o = e?.topChannels ?? [];
        return w(c`
      <section class="profile-hero">
        <div class="profile-hero__avatar">${this.renderAvatar(r, i, n)}</div>
        <div class="profile-hero__name">${n}</div>
        <div class="profile-hero__handle">
          <span>@${t}</span>
          <span class="profile-hero__badge">OpenClaw</span>
        </div>
        <div class="profile-hero__chips">
          ${
            a
              ? c`<span class="profile-hero__chip">
                ${v(`profilePage.sinceChip`, { date: ge(a) })}
              </span>`
              : u
          }
          ${o.map(
            (e) => c`
              <span
                class="profile-hero__chip profile-hero__chip--channel"
                title=${v(`profilePage.channelChipTitle`, { tokens: k(e.tokens) })}
              >
                ${e.channel}
              </span>
            `,
          )}
        </div>
      </section>
    `);
      }
      renderStats(e) {
        let t = this.costSummary;
        if (!t) return u;
        let n = O(),
          r = M(t.daily, n),
          i = I(t.daily);
        return w(c`
      <section class="profile-stats">
        ${[
          {
            label: v(`profilePage.statLifetimeTokens`),
            value: k(t.totals.totalTokens),
            sub: t.totals.totalCost > 0 ? `≈ ${ee(t.totals.totalCost)}` : void 0,
          },
          {
            label: v(`profilePage.statPeakDay`),
            value: k(i?.totalTokens ?? 0),
            sub: i ? U(i.date) : void 0,
          },
          {
            label: v(`profilePage.statLongestSession`),
            value: e?.longestSessionMs == null ? `—` : A(e.longestSessionMs),
          },
          { label: v(`profilePage.statCurrentStreak`), value: W(r.current) },
          { label: v(`profilePage.statLongestStreak`), value: W(r.longest) },
        ].map(
          (e) => c`
            <div class="profile-stats__cell">
              <div class="profile-stats__value">${e.value}</div>
              <div class="profile-stats__label">${e.label}</div>
              ${e.sub ? c`<div class="profile-stats__sub">${e.sub}</div>` : u}
            </div>
          `,
        )}
      </section>
    `);
      }
      renderHeatmapSvg(e) {
        let t = e.weeks.length,
          n = q + t * K,
          r = H(),
          i = new Intl.DateTimeFormat(void 0, { weekday: `short`, timeZone: `UTC` });
        return c`
      <div class="profile-heatmap__scroll">
        <svg
          class="profile-heatmap__svg"
          width=${n}
          height=${116}
          viewBox="0 0 ${n} ${116}"
          role="img"
          aria-label=${v(`profilePage.heatmapTitle`)}
        >
          ${e.monthLabels.map((e, t) => (e ? d`<text class="profile-heatmap__month" x=${q + t * K} y="10">${e}</text>` : u))}
          ${Q.map(({ row: e, utcDay: t }) => d`<text class="profile-heatmap__weekday" x=${q - 6} y=${J + e * K + G - 2}>${i.format(new Date(t))}</text>`)}
          ${e.weeks.map((e, t) =>
            e.days.map((e, n) => {
              if (!e) return u;
              let i = `${U(e.date)} · ${v(`profilePage.heatmapCellTokens`, { tokens: r.format(e.tokens) })}`;
              return d`
                <rect
                  class="profile-heatmap__cell profile-heatmap__cell--l${e.level}"
                  x=${q + t * K}
                  y=${J + n * K}
                  width=${G}
                  height=${G}
                  rx="2.5"
                ><title>${i}</title></rect>
              `;
            }),
          )}
        </svg>
      </div>
    `;
      }
      renderHeatmap() {
        let e = this.costSummary;
        if (!e) return u;
        let t = F(e.daily, O()),
          n = c`
      <div class="profile-heatmap__legend" aria-hidden="true">
        <span>${v(`profilePage.legendLess`)}</span>
        ${[0, 1, 2, 3, 4].map((e) => c`<span class="profile-heatmap__swatch profile-heatmap__cell--l${e}"></span>`)}
        <span>${v(`profilePage.legendMore`)}</span>
      </div>
    `;
        return T(
          {
            title: v(`profilePage.heatmapTitle`),
            description: v(`profilePage.heatmapSub`),
            actions: n,
          },
          c`<div class="profile-heatmap">${this.renderHeatmapSvg(t)}</div>`,
        );
      }
      renderInsights(e) {
        if (!e) return u;
        let t = H(),
          n = [
            { label: v(`profilePage.insightModel`), value: e.topModel ?? `—` },
            { label: v(`profilePage.insightMessages`), value: t.format(e.messages) },
            { label: v(`profilePage.insightToolCalls`), value: t.format(e.toolCalls) },
            { label: v(`profilePage.insightUniqueTools`), value: t.format(e.uniqueTools) },
            { label: v(`profilePage.insightAgents`), value: t.format(e.agents) },
            {
              label: v(`profilePage.insightSessions`),
              value: e.sessionsCapped
                ? v(`profilePage.sessionsCapped`, { count: t.format(e.sessions) })
                : t.format(e.sessions),
            },
          ],
          r = e.topTools[0]?.count ?? 0;
        return c`${T(
          { title: v(`profilePage.insightsTitle`) },
          c`
        <dl class="settings-kv">
          ${n.map(
            (e) => c`
              <dt>${e.label}</dt>
              <dd>${e.value}</dd>
            `,
          )}
        </dl>
      `,
        )} ${T(
          { title: v(`profilePage.toolsTitle`) },
          e.topTools.length === 0
            ? C(v(`profilePage.toolsEmpty`))
            : c`
            <div class="profile-tools">
              ${e.topTools.map(
                (e) => c`
                  <div class="profile-tools__row">
                    <span class="profile-tools__name">${e.name}</span>
                    <span class="profile-tools__bar" aria-hidden="true">
                      <span
                        class="profile-tools__bar-fill"
                        style="width: ${r > 0 ? Math.max(4, Math.round((e.count / r) * 100)) : 0}%"
                      ></span>
                    </span>
                    <span class="profile-tools__count">
                      ${v(e.count === 1 ? `profilePage.toolRun` : `profilePage.toolRuns`, { count: H().format(e.count) })}
                    </span>
                  </div>
                `,
              )}
            </div>
          `,
        )}`;
      }
      renderBody() {
        if (!this.connected || !this.client) return S(w(C(v(`profilePage.offline`))));
        if (this.loading && !this.costSummary) return S(w(C(v(`profilePage.loading`))));
        if (this.error && !this.costSummary) return S(w(C(this.error), { danger: !0 }));
        let e = this.sessionsResult ? R(this.sessionsResult) : null,
          t = (this.costSummary?.totals.totalTokens ?? 0) > 0,
          n = this.isCacheSettling()
            ? w(C(v(`profilePage.loading`)))
            : w(
                C(
                  c`<strong>${v(`profilePage.emptyTitle`)}</strong><br />${v(`profilePage.emptyBody`)}`,
                ),
              );
        return S(
          t
            ? c`${this.renderHero(e)} ${this.renderStats(e)} ${this.renderHeatmap()}
          ${this.renderInsights(e)}`
            : c`${this.renderHero(e)} ${n}`,
        );
      }
      render() {
        return c`
      <section class="content-header">
        <div>
          <div class="page-title">${ce(`profile`)}</div>
        </div>
      </section>
      ${x(this.renderBody())}
    `;
      }
    }),
    n([a({ context: se, subscribe: !1 })], $.prototype, `context`, void 0),
    n([s()], $.prototype, `loading`, void 0),
    n([s()], $.prototype, `error`, void 0),
    n([s()], $.prototype, `costSummary`, void 0),
    n([s()], $.prototype, `sessionsResult`, void 0),
    customElements.get(`openclaw-profile-page`) ||
      customElements.define(`openclaw-profile-page`, $));
})();
//# sourceMappingURL=profile-page-BzkKAsRj.js.map
