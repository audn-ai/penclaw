import { n as Je, t as Ye } from "./agent-scope-control-DLXN7_B3.js";
import {
  J as xe,
  K as Se,
  N as Ce,
  P as we,
  X as Te,
  dt as Ee,
  nt as De,
  q as Oe,
} from "./control-ui-core--EZfp09c.js";
import {
  An as y,
  C as b,
  Cn as x,
  Dn as S,
  En as C,
  Fn as w,
  In as T,
  Kn as E,
  Ln as D,
  On as O,
  Qi as k,
  Rn as A,
  Rr as ee,
  Sn as te,
  Tn as ne,
  Ua as re,
  Va as ie,
  Wa as ae,
  Wn as j,
  Xi as oe,
  _t as se,
  da as ce,
  di as le,
  ea as ue,
  er as M,
  fi as de,
  ha as fe,
  ht as pe,
  jn as me,
  jr as he,
  la as ge,
  ma as _e,
  pn as ve,
  ta as N,
  tn as P,
  tr as ye,
  u as be,
} from "./control-ui-core-BcbHa4vB.js";
import { $ as Ae, A as je, J as Me, Q as I, Y as Ne, k as Pe } from "./control-ui-core-CQDTaMS5.js";
import { o as F, t as ke } from "./control-ui-core-CwQmiouz.js";
import { dt as a, ft as o } from "./control-ui-foundation-0uuDj0X3.js";
import { _ as t, g as n, p as r, u as i } from "./control-ui-foundation-CCDffryi.js";
import { $ as p, V as m, tt as h, z as g } from "./control-ui-foundation-s2wA1PVE.js";
import { n as _, r as v } from "./gateway-runtime-D6zABMsO.js";
import { G as s, Y as c, Z as l, at as u, et as d, nt as f } from "./lit-runtime-DkvDG939.js";
import { o as Be, s as Ve } from "./presenter-CnPyKQkg.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
import { i as z, s as qe, t as B } from "./session-goal-BCKLIdYx.js";
import { a as Le, l as Re, s as L, t as ze } from "./settings-ui-T0X7dZpU.js";
import { n as Fe, t as Ie } from "./settings-workspace-DRQpceJK.js";
import { d as He, f as Ue, i as We, r as Ge, s as R, t as Ke } from "./thinking-K1jeBK5_.js";
function V(e) {
  return [...new Set((e?.sessions ?? []).map((e) => j(e.key)?.agentId).filter((e) => !!e))];
}
function Xe(e, t) {
  return Object.fromEntries(
    V(e)
      .map((e) => [e, t(e)])
      .filter((e) => !!e[1]),
  );
}
async function Ze(e) {
  let t = [...(e.result?.sessions ?? [])],
    n =
      e.result?.hasMore === !0
        ? (e.result.nextOffset ?? (e.result.offset ?? 0) + e.result.sessions.length)
        : null;
  for (; n != null;) {
    let r = await e.listSessions({ ...e.listOptions, limit: 200, offset: n });
    if (!r) break;
    t.push(...r.sessions);
    let i = r.hasMore === !0 ? (r.nextOffset ?? (r.offset ?? n) + r.sessions.length) : null;
    if (i == null || i <= n) break;
    n = i;
  }
  let r = new Map();
  for (let n of t) {
    let t = e.resolveAgentId(n.key);
    if (!t) continue;
    let i = r.get(t) ?? [];
    (i.push(n.key), r.set(t, i));
  }
  let i = [];
  for (let [t, n] of r)
    for (let r = 0; r < n.length; r += 200)
      i.push(
        e.client.request(`sessions.search`, {
          agentId: t,
          sessionKeys: n.slice(r, r + 200),
          query: e.query,
          limit: 25,
        }),
      );
  let a = await Promise.all(i),
    o = a
      .flatMap((e) => e.results)
      .toSorted((e, t) => t.score - e.score || t.timestamp - e.timestamp)
      .slice(0, 25);
  return {
    results: o,
    indexing: a.some((e) => e.indexing === !0),
    truncated:
      a.some((e) => e.truncated === !0) || a.reduce((e, t) => e + t.results.length, 0) > o.length,
  };
}
var Qe = e(() => {
  A();
});
function $e(e, t) {
  let n = (e?.sessions ?? []).map((e) => e.category?.trim()).filter((e) => !!e);
  return [...new Set([...t, ...n.toSorted((e, t) => e.localeCompare(t))])];
}
async function et(e) {
  if (!(!e.sessions || e.knownCategories.includes(e.name)))
    try {
      await e.sessions.groupsPut([...(e.sessions.state.groups ?? []), e.name]);
    } catch (t) {
      e.isCurrent() && e.onError(String(t));
    }
}
var tt = e(() => {});
function nt() {
  return me(ie()?.getItem(U));
}
function rt(e) {
  try {
    ie()?.setItem(U, e);
  } catch {}
}
function H(e) {
  return m(e);
}
var U,
  W = e(() => {
    (g(), y(), re(), (U = `openclaw:sessions:group-by`));
  }),
  it = e(() => {});
function G(e, t) {
  return Object.hasOwn(e, t) ? (e[t] ?? null) : null;
}
function at(e, t) {
  let n = Ue(e, t),
    r = Ke(e.thinkingDefault ?? (n ? t?.thinkingDefault : void 0)),
    i = e.thinkingLevels?.length
      ? e.thinkingLevels
      : n && t?.thinkingLevels?.length
        ? t.thinkingLevels
        : (e.thinkingOptions?.length
            ? e.thinkingOptions
            : n && t?.thinkingOptions?.length
              ? t.thinkingOptions
              : Vt
          ).map((e) => ({ id: R(e), label: e }));
  return [{ value: ``, label: r }, ...i.map((e) => ({ value: R(e.id), label: Ge(e.id, e.label) }))];
}
function ot(e, t) {
  return !t || e.includes(t) ? [...e] : [...e, t];
}
function K(e, t) {
  return !t || e.some((e) => e.value === t) ? [...e] : [...e, { value: t, label: Ge(t) }];
}
function st() {
  return Ht.map((e) => ({
    value: e,
    label: F(
      e === ``
        ? `sessionsView.inherit`
        : e === `off`
          ? `sessionsView.offExplicit`
          : `sessionsView.${e}`,
    ),
  }));
}
function ct() {
  return Ut.map((e) => ({
    value: e,
    label: F(e === `` ? `sessionsView.inherit` : `sessionsView.${e}`),
  }));
}
function lt(e) {
  switch (e) {
    case `running`:
      return F(`sessionsView.statusRunning`);
    case `done`:
      return F(`sessionsView.statusDone`);
    case `failed`:
      return F(`sessionsView.statusFailed`);
    case `killed`:
      return F(`sessionsView.statusKilled`);
    case `timeout`:
      return F(`sessionsView.statusTimeout`);
    default:
      return F(`sessionsView.statusUnknown`);
  }
}
function ut(e) {
  if (C(e)) return { label: F(`sessionsView.statusLive`), tone: `live` };
  if (e.status === `running` && e.hasActiveRun === !1)
    return { label: F(`sessionsView.statusIdle`), tone: `idle` };
  if (e.status) {
    let t = e.status === `done` ? `done` : `failed`;
    return { label: lt(e.status), tone: t };
  }
  return e.hasActiveRun === !1
    ? { label: F(`sessionsView.statusIdle`), tone: `idle` }
    : { label: F(`sessionsView.statusUnknown`), tone: `muted` };
}
function dt(e) {
  let t = ut(e);
  return u`
    <openclaw-tooltip .content=${`${F(`sessionsView.status`)}: ${t.label}`}>
      ${Re({ kind: Kt[t.tone], label: t.label })}
    </openclaw-tooltip>
  `;
}
function ft(e) {
  return u`
    <span class="session-avatar session-avatar--${e.kind}" aria-hidden="true">
      ${Z[e.kind] ?? I.circle}
      ${C(e) ? u`<span class="session-avatar__status"></span>` : f}
    </span>
  `;
}
function pt(e) {
  return typeof e.totalTokens == `number` && Number.isFinite(e.totalTokens);
}
function mt(e) {
  let t = e.totalTokens;
  if (typeof t != `number` || !Number.isFinite(t))
    return u`<span class="muted">${F(`common.na`)}</span>`;
  let n = e.totalTokensFresh !== !1,
    r = `${n ? `` : `~`}${k(t)}`,
    i = typeof e.contextTokens == `number` && e.contextTokens > 0 ? e.contextTokens : null;
  if (!i) return u`<span class="session-tokens__value">${r}</span>`;
  let a = Math.min(100, Math.round((t / i) * 100)),
    o = n ? (a >= Jt ? `danger` : a >= qt ? `warn` : `ok`) : `stale`,
    s = F(n ? `sessionsView.contextUsage` : `sessionsView.contextUsageApprox`, {
      percent: String(a),
      used: t.toLocaleString(),
      context: i.toLocaleString(),
    });
  return u`
    <openclaw-tooltip .content=${s}>
      <div class="session-tokens">
        <span class="session-tokens__value">${r} / ${k(i)}</span>
        <span
          class="session-context-meter session-context-meter--${o}"
          role="img"
          aria-label=${s}
        >
          <span class="session-context-meter__fill" style=${`width: ${a}%`}></span>
        </span>
      </div>
    </openclaw-tooltip>
  `;
}
function ht(e, t) {
  let n = e.filter((e) => e.unread === !0).length,
    r = e.filter(pt),
    i = r.reduce((e, t) => e + (t.totalTokens ?? 0), 0),
    a = r.length < e.length || r.some((e) => e.totalTokensFresh === !1),
    o = r.length === 0 ? F(`common.na`) : `${a ? `~` : ``}${k(i)}`;
  return u`
    <div class="sessions-overview">
      ${[
        {
          id: `sessions`,
          icon: I.messageSquare,
          label: F(`sessionsView.title`),
          value: String(e.length),
          active: !1,
        },
        {
          id: `live`,
          icon: I.zap,
          label: F(`sessionsView.statusLive`),
          value: String(t),
          active: t > 0,
        },
        {
          id: `unread`,
          icon: I.eye,
          label: F(`sessionsView.unread`),
          value: String(n),
          active: n > 0,
        },
        { id: `tokens`, icon: I.barChart, label: F(`sessionsView.tokens`), value: o, active: !1 },
      ].map(
        (e) => u`
          <div class=${[`sessions-overview__tile`, `sessions-overview__tile--${e.id}`, e.active ? `sessions-overview__tile--active` : ``].filter(Boolean).join(` `)}>
            <span class="sessions-overview__icon" aria-hidden="true">${e.icon}</span>
            <span class="sessions-overview__meta">
              <span class="sessions-overview__value">${e.value}</span>
              <span class="sessions-overview__label">${e.label}</span>
            </span>
          </div>
        `,
      )}
    </div>
  `;
}
function gt(e, t) {
  let n = t.find((t) => t.key === e.sessionKey);
  return h(n?.label) ?? h(n?.displayName) ?? e.sessionKey;
}
function _t(e, t) {
  let n = e.transcriptSearchQuery.trim().length > 0,
    r = e.transcriptSearch,
    a = r.status === `results` ? r.results : [],
    o = r.status === `loading`;
  return u`
    <section
      class="sessions-transcript-search"
      aria-label=${F(`sessionsView.transcriptSearchTitle`)}
    >
      <form
        class="sessions-transcript-search__form"
        role="search"
        aria-label=${F(`sessionsView.transcriptSearchTitle`)}
        @submit=${(t) => {
          (t.preventDefault(), e.transcriptSearchAvailable && n && !o && e.onTranscriptSearch());
        }}
      >
        <div class="data-table-search sessions-transcript-search__input">
          <input
            type="search"
            maxlength="4096"
            aria-label=${F(`sessionsView.transcriptSearchInputLabel`)}
            placeholder=${F(`sessionsView.transcriptSearchPlaceholder`)}
            .value=${e.transcriptSearchQuery}
            ?disabled=${!e.transcriptSearchAvailable}
            @input=${(t) => e.onTranscriptSearchChange(t.target.value)}
          />
        </div>
        <button
          class="btn primary"
          type="submit"
          ?disabled=${!e.transcriptSearchAvailable || !n || o}
        >
          ${F(o ? `sessionsView.transcriptSearchSearching` : `sessionsView.transcriptSearchAction`)}
        </button>
        ${
          n
            ? u`
              <button class="btn" type="button" @click=${e.onClearTranscriptSearch}>
                ${F(`sessionsView.transcriptSearchClear`)}
              </button>
            `
            : f
        }
      </form>
      ${
        e.transcriptSearchAvailable
          ? f
          : u`
            <div class="muted" role="status">${F(`sessionsView.transcriptSearchUnavailable`)}</div>
          `
      }
      <div
        class="sessions-transcript-search__status"
        aria-live="polite"
        aria-busy=${o ? `true` : `false`}
      >
        ${o ? u`<span class="muted">${F(`sessionsView.transcriptSearchSearching`)}</span>` : f}
        ${
          r.status === `error`
            ? u`
              <div
                class="sessions-transcript-search__notice sessions-transcript-search__notice--danger"
              >
                <span>${F(`sessionsView.transcriptSearchError`)}: ${r.message}</span>
                <button class="btn btn--sm" type="button" @click=${e.onTranscriptSearch}>
                  ${F(`sessionsView.transcriptSearchRetry`)}
                </button>
              </div>
            `
            : f
        }
        ${
          r.status === `results` && r.indexing
            ? u`
              <div class="sessions-transcript-search__notice">
                <span>${F(`sessionsView.transcriptSearchIndexing`)}</span>
                <button
                  class="btn btn--sm"
                  type="button"
                  ?disabled=${o}
                  @click=${e.onTranscriptSearch}
                >
                  ${F(`sessionsView.transcriptSearchRetry`)}
                </button>
              </div>
            `
            : f
        }
        ${
          r.status === `results` && a.length === 0 && !r.indexing
            ? u`
              <div class="sessions-transcript-search__empty" role="status">
                ${F(`sessionsView.transcriptSearchEmpty`)}
              </div>
            `
            : f
        }
        ${
          a.length > 0
            ? u`
              <div class="sessions-transcript-search__results">
                <div class="sessions-transcript-search__summary">
                  <strong
                    >${F(`sessionsView.transcriptSearchMatches`, { count: String(a.length) })}</strong
                  >
                  ${
                    r.status === `results` && r.truncated
                      ? u`<span class="muted"
                        >${F(`sessionsView.transcriptSearchTruncated`)}</span
                      >`
                      : f
                  }
                </div>
                <div class="sessions-transcript-search__list">
                  ${a.map((n) => {
                    let r = n.timestamp > 0 ? i(n.timestamp) : F(`common.na`),
                      a = n.timestamp > 0 ? oe(n.timestamp) : r;
                    return u`
                      <button
                        class="sessions-transcript-search__result"
                        type="button"
                        @click=${() => e.onNavigateToChat?.(n.sessionKey)}
                      >
                        <span class="sessions-transcript-search__result-header">
                          <strong>${gt(n, t)}</strong>
                          <span class="muted" title=${a}>
                            ${F(`sessionsView.${n.role}`)} · ${r}
                          </span>
                        </span>
                        <span class="sessions-transcript-search__snippet">${n.snippet}</span>
                        <span class="sessions-transcript-search__key">${n.sessionKey}</span>
                      </button>
                    `;
                  })}
                </div>
              </div>
            `
            : f
        }
      </div>
    </section>
  `;
}
function vt(e) {
  return Array.from(
    { length: Yt },
    (t, n) => u`
      <tr class="session-skeleton-row" aria-hidden="true">
        ${Array.from({ length: e }, (e, t) =>
          t === 0
            ? u`<td class="data-table-checkbox-col"></td>`
            : u`<td>
                <span
                  class="session-skeleton ${t === 1 ? `session-skeleton--key` : ``}"
                  style=${`animation-delay: ${n * 120}ms`}
                ></span>
              </td>`,
        )}
      </tr>
    `,
  );
}
function yt(e) {
  return e || null;
}
function bt(e, t, n) {
  let r = p(t);
  return r
    ? e.filter((e) => {
        let t = p(e.key),
          i = p(e.label),
          a = p(e.category),
          o = p(e.kind),
          s = p(e.displayName),
          c = p(ee(e.agentRuntime)),
          l = p(e.status),
          u = e.goal
            ? p(`${e.goal.objective} ${e.goal.status} ${z(e.goal)} ${e.goal.lastStatusNote ?? ``}`)
            : ``,
          d = C(e) ? `live running` : e.hasActiveRun === !1 ? `idle` : ``;
        if (
          t.includes(r) ||
          i.includes(r) ||
          a.includes(r) ||
          o.includes(r) ||
          s.includes(r) ||
          c.includes(r) ||
          l.includes(r) ||
          u.includes(r) ||
          d.includes(r)
        )
          return !0;
        let f = N(e.key);
        return (f ? p(G(n, f.agentId)?.name) : ``).includes(r);
      })
    : e;
}
function xt(e, t, n) {
  let r = n === `asc` ? 1 : -1;
  return [...e].toSorted((e, n) => {
    let i = (n.pinnedAt ?? 0) - (e.pinnedAt ?? 0);
    if (i !== 0) return i;
    let a = 0;
    switch (t) {
      case `key`:
        a = (e.key ?? ``).localeCompare(n.key ?? ``);
        break;
      case `kind`:
        a = (e.kind ?? ``).localeCompare(n.kind ?? ``);
        break;
      case `updated`:
        a = (e.updatedAt ?? 0) - (n.updatedAt ?? 0);
        break;
      case `tokens`:
        a =
          (e.totalTokens ?? e.inputTokens ?? e.outputTokens ?? 0) -
          (n.totalTokens ?? n.inputTokens ?? n.outputTokens ?? 0);
        break;
    }
    return a * r;
  });
}
function St(e, t, n) {
  let r = t * n;
  return e.slice(r, r + n);
}
function Ct(e) {
  return H(e) !== void 0;
}
function wt(e) {
  return (
    p(e.searchQuery).length > 0 ||
    Ct(e.activeMinutes) ||
    Ct(e.limit) ||
    !e.includeGlobal ||
    !e.includeUnknown ||
    !e.showArchived
  );
}
function Tt(e) {
  switch (e) {
    case `manual`:
      return F(`sessionsView.manual`);
    case `auto-threshold`:
      return F(`sessionsView.autoThreshold`);
    case `overflow-retry`:
      return F(`sessionsView.overflowRetry`);
    case `timeout-retry`:
      return F(`sessionsView.timeoutRetry`);
    default:
      return e;
  }
}
function Et(e) {
  return F(e === 1 ? `sessionsView.checkpoint` : `sessionsView.checkpoints`, { count: String(e) });
}
function Dt(e) {
  return typeof e.tokensBefore == `number` &&
    typeof e.tokensAfter == `number` &&
    Number.isFinite(e.tokensBefore) &&
    Number.isFinite(e.tokensAfter)
    ? F(`sessionsView.tokenRange`, {
        before: e.tokensBefore.toLocaleString(),
        after: e.tokensAfter.toLocaleString(),
      })
    : typeof e.tokensBefore == `number` && Number.isFinite(e.tokensBefore)
      ? F(`sessionsView.tokensBefore`, { count: e.tokensBefore.toLocaleString() })
      : F(`sessionsView.tokenDeltaUnavailable`);
}
function Ot(e) {
  return typeof e != `number` || !Number.isFinite(e) || e < 0
    ? null
    : (r(e, { spaced: !0 }) ?? `0ms`);
}
function kt(e) {
  if (!e) return f;
  let t =
      e.status === `active`
        ? `accent`
        : e.status === `complete`
          ? `ok`
          : e.status === `blocked` || e.status === `budget_limited` || e.status === `usage_limited`
            ? `warn`
            : `muted`,
    n = B(e);
  return u`
    <openclaw-tooltip .content=${n}>
      <span tabindex="0" aria-label=${n}>
        ${Re({ kind: t, label: z(e) })}
      </span>
    </openclaw-tooltip>
  `;
}
function At(e) {
  let { row: t, updated: n, checkpointCount: r } = e,
    i = [
      { label: F(`sessionsView.key`), value: t.key },
      { label: F(`sessionsView.kind`), value: t.kind },
      { label: F(`sessionsView.updated`), value: n },
      { label: F(`sessionsView.tokens`), value: Be(t) },
      { label: F(`sessionsView.compaction`), value: Et(r) },
    ],
    a = (e, t) => {
      let n = h(t);
      n && i.push({ label: e, value: n });
    };
  return (
    a(F(`sessionsView.group`), t.category),
    a(F(`sessionsView.status`), t.status),
    t.goal && i.push({ label: F(`sessionsView.goal`), value: B(t.goal) }),
    a(F(`sessionsView.goalNote`), t.goal?.lastStatusNote),
    a(F(`sessionsView.model`), t.model),
    a(F(`sessionsView.provider`), t.modelProvider),
    a(F(`sessionsView.runtime`), ee(t.agentRuntime)),
    a(F(`sessionsView.runDuration`), Ot(t.runtimeMs)),
    a(F(`sessionsView.surface`), t.surface),
    a(F(`sessionsView.subject`), t.subject),
    a(F(`sessionsView.room`), t.room),
    a(F(`sessionsView.space`), t.space),
    a(F(`sessionsView.sessionId`), t.sessionId),
    typeof t.hasActiveRun == `boolean` &&
      i.push({
        label: F(`sessionsView.activeRun`),
        value: t.hasActiveRun ? F(`common.yes`) : F(`common.no`),
      }),
    typeof t.archived == `boolean` &&
      i.push({
        label: F(`sessionsView.archived`),
        value: t.archived ? F(`common.yes`) : F(`common.no`),
      }),
    typeof t.pinned == `boolean` &&
      i.push({
        label: F(`sessionsView.pinned`),
        value: t.pinned ? F(`common.yes`) : F(`common.no`),
      }),
    i
  );
}
function q(e) {
  return e.groupBy === `category` ? 8 : 7;
}
function jt(e) {
  switch (e) {
    case `category`:
      return F(`sessionsView.groupByCategory`);
    case `channel`:
      return F(`sessionsView.groupByChannel`);
    case `kind`:
      return F(`sessionsView.groupByKind`);
    case `agent`:
      return F(`sessionsView.groupByAgent`);
    case `date`:
      return F(`sessionsView.groupByDate`);
    default:
      return F(`sessionsView.groupByNone`);
  }
}
function Mt(e, t) {
  if (t.groupBy === `date`)
    switch (e) {
      case `today`:
        return F(`sessionsView.dateToday`);
      case `yesterday`:
        return F(`sessionsView.dateYesterday`);
      case `week`:
        return F(`sessionsView.dateThisWeek`);
      case `older`:
        return F(`sessionsView.dateOlder`);
      default:
        return F(`sessionsView.dateNoActivity`);
    }
  if (e === ``) return F(`sessionsView.ungrouped`);
  if (t.groupBy === `agent`) {
    let n = G(t.agentIdentityById, e),
      r = h(n?.name);
    if (r) {
      let e = h(n?.emoji);
      return e ? `${e} ${r}` : r;
    }
  }
  return e;
}
function J(e, t) {
  e.currentTarget?.classList.toggle(`session-drop-target--active`, t);
}
function Nt(e, t) {
  if (e.groupBy !== `category`) return { dragover: f, dragleave: f, drop: f };
  let n = (e) => e.dataTransfer?.types.includes(M) === !0;
  return {
    dragover: (e) => {
      n(e) &&
        (e.preventDefault(), e.dataTransfer && (e.dataTransfer.dropEffect = `move`), J(e, !0));
    },
    dragleave: (e) => J(e, !1),
    drop: (r) => {
      if (!n(r)) return;
      (r.preventDefault(), J(r, !1));
      let i = r.dataTransfer?.getData(M);
      i && e.onAssignCategory(i, t);
    },
  };
}
function Pt(e, t) {
  let n = Mt(e.id, t),
    r =
      e.rows.length === 1
        ? F(`sessionsView.groupRowCountOne`, { count: `1` })
        : F(`sessionsView.groupRowCount`, { count: String(e.rows.length) }),
    i = Nt(t, e.id === `` ? null : e.id);
  return u`
    <tr
      class="session-group-row"
      @dragover=${i.dragover}
      @dragleave=${i.dragleave}
      @drop=${i.drop}
    >
      <td colspan=${q(t)}>
        <div class="session-group-row__header">
          <span class="session-group-row__icon" aria-hidden="true">${I.folder}</span>
          <span class="session-group-row__label">${n}</span>
          <span class="session-group-row__count">${r}</span>
        </div>
      </td>
    </tr>
  `;
}
function Ft(e, t) {
  let n = h(e.category) ?? ``,
    r = [...t.knownCategories];
  return (
    n && !r.includes(n) && r.push(n),
    u`
    <td>
      <select
        ?disabled=${t.loading}
        aria-label=${F(`sessionsView.moveToGroup`)}
        class="session-group-select"
        @change=${(r) => {
          let i = r.target;
          if (i.value === Q) {
            ((i.value = n), t.onRequestNewCategory(e.key));
            return;
          }
          t.onAssignCategory(e.key, i.value || null);
        }}
      >
        <option value="" ?selected=${!n}>${F(`sessionsView.ungrouped`)}</option>
        ${r.map((e) => u`<option value=${e} ?selected=${n === e}>${e}</option>`)}
        <option value=${Q}>${F(`sessionsView.newGroup`)}</option>
      </select>
    </td>
  `
  );
}
function It(e) {
  return e instanceof Element && !!e.closest(`a, button, input, label, select, textarea`);
}
function Y(e) {
  let t = [
    `session-filter-check`,
    `session-filter-toggle`,
    e.extraClass ?? ``,
    e.checked ? `session-filter-check--active` : ``,
  ]
    .filter(Boolean)
    .join(` `);
  return u`
    <openclaw-tooltip .content=${e.title}>
      <label class=${t}>
        <input
          name=${e.name}
          class="session-filter-check__input"
          type="checkbox"
          .checked=${e.checked}
          @change=${(t) => e.onChange(t.target.checked)}
        />
        <span class="session-filter-check__mark" aria-hidden="true">${I.check}</span>
        <span class="session-filter-check__label">${e.label}</span>
      </label>
    </openclaw-tooltip>
  `;
}
function X(e) {
  return u`
    <label class="session-override-field">
      <span class="session-override-field__label">${e.label}</span>
      <select
        class="settings-select"
        ?disabled=${e.disabled}
        @change=${(t) => e.onChange(t.target.value)}
      >
        ${e.options.map(
          (t) => u`<option value=${t.value} ?selected=${e.current === t.value}>
              ${t.label}
            </option>`,
        )}
      </select>
    </label>
  `;
}
function Lt(e) {
  let t = e.result?.sessions ?? [],
    n = bt(t, e.searchQuery, e.agentIdentityById),
    r = xt(n, e.sortColumn, e.sortDir),
    i = r.length,
    a = Math.max(1, Math.ceil(i / e.pageSize)),
    o = Math.min(e.page, a - 1),
    s = e.groupBy !== `none`,
    c = s ? O({ rows: r, mode: e.groupBy, knownCategories: e.knownCategories }) : null,
    l = s ? r : St(r, o, e.pageSize),
    d = t.length === 0 ? wt(e) : n.length === 0,
    p = t.filter((e) => C(e)).length,
    m = (t, n, r = ``) => {
      let i = e.sortColumn === t,
        a = i && e.sortDir === `asc` ? `desc` : `asc`;
      return u`
      <th
        class=${r}
        data-sortable
        data-sort-dir=${i ? e.sortDir : ``}
        @click=${() => e.onSortChange(t, i ? a : `desc`)}
      >
        ${n}
        <span class="data-table-sort-icon">${I.arrowUpDown}</span>
      </th>
    `;
    },
    h = u`
    ${F(`sessionsView.title`)}
    ${
      e.result
        ? u`
          <openclaw-tooltip .content=${F(`sessionsView.store`, { path: e.result.path })}>
            <span class="settings-count">${t.length}</span>
          </openclaw-tooltip>
        `
        : f
    }
  `,
    g = u`
    <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
      ${e.loading ? F(`common.loading`) : F(`common.refresh`)}
    </button>
  `;
  return Le(
    [
      e.error ? u`<div class="sessions-error">${e.error}</div>` : f,
      e.result ? L({}, ht(t, p)) : f,
      L(
        {
          title: F(`sessionsView.transcriptSearchTitle`),
          description: F(`sessionsView.transcriptSearchDescription`),
        },
        _t(e, t),
      ),
      L(
        { title: h, description: F(`sessionsView.subtitle`), actions: g },
        Rt(e, {
          paginated: l,
          groups: c,
          groupingActive: s,
          emptyBecauseFiltered: d,
          totalRows: i,
          totalPages: a,
          page: o,
          sortHeader: m,
        }),
      ),
    ],
    { wide: !0 },
  );
}
function Rt(e, t) {
  let {
      paginated: n,
      groups: r,
      groupingActive: i,
      emptyBecauseFiltered: a,
      totalRows: o,
      totalPages: s,
      page: c,
    } = t,
    l = t.sortHeader,
    d = F(`sessionsView.activeTooltip`, { count: e.activeMinutes.trim() }),
    p = F(`sessionsView.limitTooltip`),
    m = F(`sessionsView.globalTooltip`),
    h = F(`sessionsView.unknownTooltip`),
    g = F(`sessionsView.archivedOnlyTooltip`);
  return u`
    <div
      class="sessions-toolbar sessions-filter-bar"
      aria-label=${F(`sessionsView.filterControls`)}
    >
      <div class="data-table-search sessions-toolbar__search">
        ${I.search}
        <input
          type="text"
          placeholder=${F(`sessionsView.searchPlaceholder`)}
          .value=${e.searchQuery}
          @input=${(t) => e.onSearchChange(t.target.value)}
        />
      </div>
      <div class="session-filter-primary-row">
        <openclaw-tooltip .content=${d}>
          <label class="session-filter-field">
            <span class="session-filter-label">${F(`sessionsView.active`)}</span>
            <input
              class="session-filter-input session-filter-input--minutes"
              placeholder=${F(`sessionsView.minutesPlaceholder`)}
              .value=${e.activeMinutes}
              ?disabled=${e.showArchived}
              @input=${(t) => e.onFiltersChange({ activeMinutes: t.target.value, limit: e.limit, includeGlobal: e.includeGlobal, includeUnknown: e.includeUnknown, showArchived: e.showArchived })}
            />
          </label>
        </openclaw-tooltip>
        <openclaw-tooltip .content=${p}>
          <label class="session-filter-field">
            <span class="session-filter-label">${F(`sessionsView.limit`)}</span>
            <input
              class="session-filter-input session-filter-input--limit"
              .value=${e.limit}
              @input=${(t) => e.onFiltersChange({ activeMinutes: e.activeMinutes, limit: t.target.value, includeGlobal: e.includeGlobal, includeUnknown: e.includeUnknown, showArchived: e.showArchived })}
            />
          </label>
        </openclaw-tooltip>
      </div>
      <div
        class="session-filter-toggle-group"
        role="group"
        aria-label=${F(`sessionsView.sourceFilters`)}
      >
        ${Y({ name: `includeGlobal`, checked: e.includeGlobal, label: F(`sessionsView.global`), title: m, onChange: (t) => e.onFiltersChange({ activeMinutes: e.activeMinutes, limit: e.limit, includeGlobal: t, includeUnknown: e.includeUnknown, showArchived: e.showArchived }) })}
        ${Y({ name: `includeUnknown`, checked: e.includeUnknown, label: F(`sessionsView.unknown`), title: h, onChange: (t) => e.onFiltersChange({ activeMinutes: e.activeMinutes, limit: e.limit, includeGlobal: e.includeGlobal, includeUnknown: t, showArchived: e.showArchived }) })}
        ${Y({ name: `showArchived`, checked: e.showArchived, label: F(`sessionsView.archivedOnly`), title: g, extraClass: `session-archive-toggle`, onChange: (t) => e.onFiltersChange({ activeMinutes: e.activeMinutes, limit: e.limit, includeGlobal: e.includeGlobal, includeUnknown: e.includeUnknown, showArchived: t }) })}
      </div>
      <span class="sessions-toolbar__divider" aria-hidden="true"></span>
      <label class="session-groupby">
        <span class="session-groupby__label">${F(`sessionsView.groupBy`)}</span>
        <select
          class="session-groupby__select"
          @change=${(t) => e.onGroupByChange(t.target.value)}
        >
          ${S.map(
            (t) => u`<option value=${t} ?selected=${e.groupBy === t}>
                ${jt(t)}
              </option>`,
          )}
        </select>
      </label>
      ${
        e.groupBy === `category`
          ? u`
            <button class="btn btn--sm" @click=${() => e.onRequestNewCategory()}>
              ${I.plus} ${F(`sessionsView.newGroup`)}
            </button>
          `
          : f
      }
    </div>

    ${
      e.selectedKeys.size > 0
        ? u`
          <div class="data-table-bulk-bar">
            <span>${F(`sessionsView.selected`, { count: String(e.selectedKeys.size) })}</span>
            <button class="btn btn--sm" @click=${e.onDeselectAll}>
              ${F(`common.unselect`)}
            </button>
            <button
              class="btn btn--sm danger"
              ?disabled=${e.loading}
              @click=${e.onDeleteSelected}
            >
              ${I.trash} ${F(`sessionsView.deleteSelected`)}
            </button>
          </div>
        `
        : f
    }

    <div class="data-table-container">
      <table class="data-table sessions-table">
        <thead>
          <tr>
            <th class="data-table-checkbox-col">
              ${
                n.length > 0
                  ? u`<input
                    type="checkbox"
                    .checked=${n.length > 0 && n.every((t) => e.selectedKeys.has(t.key))}
                    .indeterminate=${n.some((t) => e.selectedKeys.has(t.key)) && !n.every((t) => e.selectedKeys.has(t.key))}
                    @change=${() => {
                      n.every((t) => e.selectedKeys.has(t.key))
                        ? e.onDeselectPage(n.map((e) => e.key))
                        : e.onSelectPage(n.map((e) => e.key));
                    }}
                    aria-label=${F(`sessionsView.selectAllOnPage`)}
                  />`
                  : f
              }
            </th>
            ${l(`key`, F(`sessionsView.key`), `data-table-key-col`)}
            ${e.groupBy === `category` ? u`<th>${F(`sessionsView.group`)}</th>` : f}
            ${l(`kind`, F(`sessionsView.kind`))}
            <th class="session-status-col">${F(`sessionsView.status`)}</th>
            ${l(`updated`, F(`sessionsView.updated`))}
            ${l(`tokens`, F(`sessionsView.tokens`))}
            <th class="session-actions-col">
              <span class="sessions-sr-only">${F(`sessionsView.actions`)}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          ${
            e.loading && !e.result
              ? vt(q(e))
              : n.length === 0
                ? u`
                  <tr>
                    <td colspan=${q(e)} class="data-table-empty-cell">
                      ${
                        a
                          ? u`
                            <div class="data-table-empty-state" role="status" aria-live="polite">
                              <div class="data-table-empty-state__message">
                                ${I.search}
                                <span>${F(`sessionsView.noSessionsMatchFilters`)}</span>
                              </div>
                              <button class="btn btn--sm" @click=${e.onClearFilters}>
                                ${F(`sessionsView.showAll`)}
                              </button>
                            </div>
                          `
                          : u`
                            <div class="data-table-empty-state" role="status" aria-live="polite">
                              <div class="data-table-empty-state__message">
                                ${I.messageSquare}
                                <span>${F(`sessionsView.noSessions`)}</span>
                              </div>
                            </div>
                          `
                      }
                    </td>
                  </tr>
                `
                : r
                  ? r.flatMap((t) => {
                      let n = t.rows.flatMap((t) => zt(t, e));
                      return (n.unshift(Pt(t, e)), n);
                    })
                  : n.flatMap((t) => zt(t, e))
          }
        </tbody>
      </table>
    </div>

    ${
      o > 0 && !i
        ? u`
          <div class="data-table-pagination">
            <div class="data-table-pagination__info">
              ${F(`sessionsView.pagination`, { start: String(c * e.pageSize + 1), end: String(Math.min((c + 1) * e.pageSize, o)), total: String(o) })}
            </div>
            <div class="data-table-pagination__controls">
              <select
                class="data-table-pagination__size"
                .value=${String(e.pageSize)}
                @change=${(t) => e.onPageSizeChange(Number(t.target.value))}
              >
                ${Gt.map(
                  (e) => u`<option value=${e}>
                      ${F(`sessionsView.rowsPerPage`, { count: String(e) })}
                    </option>`,
                )}
              </select>
              <button ?disabled=${c <= 0} @click=${() => e.onPageChange(c - 1)}>
                ${F(`common.previous`)}
              </button>
              <button
                ?disabled=${c >= s - 1}
                @click=${() => e.onPageChange(c + 1)}
              >
                ${F(`common.next`)}
              </button>
            </div>
          </div>
        `
        : f
    }
  `;
}
function zt(e, t) {
  let n = e.updatedAt ? i(e.updatedAt) : F(`common.na`),
    r = e.latestCompactionCheckpoint,
    a = e.compactionCheckpointCount ?? 0,
    o = Math.max(a, +!!r),
    s = a > 0 || !!r,
    c = t.expandedSessionKey === e.key,
    l = `session-details-${encodeURIComponent(e.key)}`,
    d = h(e.displayName) ?? null,
    p = h(e.label) ?? ``,
    m = !!(d && d !== e.key && d !== p),
    g = N(e.key),
    _ = g ? G(t.agentIdentityById, g.agentId) : null,
    v = h(_?.emoji) ?? ``,
    y = h(_?.name) ?? ``,
    b = y && g ? `${v ? `${v} ` : ``}${y} (${g.channel})` : null,
    S = b ?? e.key,
    C = e.kind !== `global`,
    w = C ? `${Te(`chat`, t.basePath)}${x(e.key)}` : null,
    T = `session-kind session-kind--${e.kind}`,
    E = [
      `session-data-row`,
      `session-data-row--expandable`,
      c ? `session-data-row--expanded` : ``,
      t.sessionMenu?.key === e.key ? `session-data-row--menu-open` : ``,
    ]
      .filter(Boolean)
      .join(` `),
    D = F(c ? `sessionsView.hideSessionDetails` : `sessionsView.showSessionDetails`, { count: S }),
    O = t.groupBy === `category`,
    k = Nt(t, h(e.category) ?? null);
  return [
    u`<tr
      class=${E}
      tabindex="0"
      aria-expanded=${String(c)}
      aria-controls=${l}
      draggable=${O ? `true` : f}
      aria-description=${O ? F(`sessionsView.dragSessionHint`) : f}
      @dragstart=${
        O
          ? (t) => {
              (t.dataTransfer?.setData(M, e.key),
                t.dataTransfer && (t.dataTransfer.effectAllowed = `move`));
            }
          : f
      }
      @dragover=${k.dragover}
      @dragleave=${k.dragleave}
      @drop=${k.drop}
      @contextmenu=${(n) => {
        (n.preventDefault(), t.onOpenSessionMenu(e, { x: n.clientX, y: n.clientY }, null));
      }}
      @click=${(n) => {
        It(n.target) || t.onToggleDetails(e.key);
      }}
      @keydown=${(n) => {
        It(n.target) ||
          ((n.key === `Enter` || n.key === ` `) && (n.preventDefault(), t.onToggleDetails(e.key)));
      }}
    >
      <td class="data-table-checkbox-col">
        <input
          type="checkbox"
          .checked=${t.selectedKeys.has(e.key)}
          @change=${() => t.onToggleSelect(e.key)}
          aria-label=${F(`sessionsView.selectSession`)}
        />
      </td>
      <td class="data-table-key-col">
        <openclaw-tooltip .content=${S}>
          <div class=${b ? `session-key-cell` : `mono session-key-cell`}>
            ${ft(e)}
            <div class="session-key-cell__text">
              <span class="session-key-cell__primary">
                ${
                  e.unread === !0
                    ? u`<span
                      class="session-unread-dot"
                      role="img"
                      aria-label=${F(`sessionsView.unread`)}
                    ></span>`
                    : f
                }
                ${
                  C
                    ? u`<a
                      href=${w}
                      class="session-link"
                      @click=${(n) => {
                        n.defaultPrevented ||
                          n.button !== 0 ||
                          n.metaKey ||
                          n.ctrlKey ||
                          n.shiftKey ||
                          n.altKey ||
                          (t.onNavigateToChat && (n.preventDefault(), t.onNavigateToChat(e.key)));
                      }}
                      >${b ?? e.key}</a
                    >`
                    : u`<span>${b ?? e.key}</span>`
                }
                ${
                  p
                    ? u`<span class="session-label-chip" title=${p}
                      >${p}</span
                    >`
                    : f
                }
              </span>
              ${m ? u`<span class="muted session-key-display-name">${d}</span>` : f}
            </div>
          </div>
        </openclaw-tooltip>
      </td>
      ${O ? Ft(e, t) : f}
      <td>
        <span class=${T}>${e.kind}</span>
      </td>
      <td class="session-status-col">
        <div class="session-status-stack">
          ${dt(e)} ${kt(e.goal)}
        </div>
      </td>
      <td>${n}</td>
      <td class="session-token-cell">${mt(e)}</td>
      <td class="session-actions-cell">
        <div class="session-actions">
          <button
            class="session-details-toggle"
            type="button"
            aria-expanded=${String(c)}
            aria-controls=${l}
            aria-label=${D}
            @click=${(n) => {
              (n.stopPropagation(), t.onToggleDetails(e.key));
            }}
          >
            ${
              o > 0
                ? u`<span class="settings-count session-compaction-count"
                  >${o}</span
                >`
                : f
            }
            ${I.chevronDown}
          </button>
          <button
            class="icon-btn"
            type="button"
            title=${F(`chat.sidebar.openSessionMenu`)}
            aria-label=${F(`chat.sidebar.openSessionMenu`)}
            aria-haspopup="menu"
            aria-expanded=${String(t.sessionMenu?.key === e.key)}
            @click=${(n) => {
              n.stopPropagation();
              let r = n.currentTarget,
                i = r.getBoundingClientRect();
              t.onOpenSessionMenu(e, { x: i.right, y: i.bottom + 4 }, r);
            }}
          >
            ${I.moreHorizontal}
          </button>
        </div>
      </td>
    </tr>`,
    ...(c
      ? [
          Bt({
            row: e,
            props: t,
            detailsId: l,
            friendlyKeyLabel: b,
            keyCellTitle: S,
            displayName: d,
            showDisplayName: m,
            kindClass: T,
            updated: n,
            visibleCheckpointCount: o,
            hasCheckpoints: s,
          }),
        ]
      : []),
  ];
}
function Bt(e) {
  let {
      row: t,
      props: n,
      detailsId: r,
      friendlyKeyLabel: a,
      displayName: o,
      showDisplayName: s,
      kindClass: c,
      updated: l,
      visibleCheckpointCount: d,
      hasCheckpoints: p,
    } = e,
    m = t.thinkingLevel ?? ``,
    g = m ? R(m) : ``,
    _ = K(at(t, n.result?.defaults), g),
    v = t.fastMode === `auto` ? `auto` : t.fastMode === !0 ? `on` : t.fastMode === !1 ? `off` : ``,
    y = K(ct(), v),
    b = t.verboseLevel ?? ``,
    x = K(st(), b),
    S = t.reasoningLevel ?? ``,
    C = ot(Wt, S),
    w = n.checkpointItemsByKey[t.key] ?? [],
    T = n.checkpointErrorByKey[t.key],
    E = Et(d),
    D = At({ row: t, updated: l, checkpointCount: d });
  return u`<tr id=${r} class="session-details-row">
    <td colspan=${q(n)}>
      <div class="session-details-panel">
        <div class="session-details-panel__hero">
          <div>
            <div class="session-details-panel__eyebrow">${F(`sessionsView.sessionDetails`)}</div>
            <div class="session-details-panel__title">${a ?? t.key}</div>
            ${s ? u`<div class="muted session-details-panel__subtitle">${o}</div>` : f}
          </div>
          <div class="session-details-panel__badges">
            ${dt(t)} ${kt(t.goal)}
            <span class=${c}>${t.kind}</span>
          </div>
        </div>

        <div class="session-details-section">
          <div class="session-details-panel__eyebrow">${F(`sessionsView.overrides`)}</div>
          <div class="session-overrides-grid">
            <label class="session-override-field">
              <span class="session-override-field__label">${F(`sessionsView.label`)}</span>
              <input
                class="settings-input"
                .value=${t.label ?? ``}
                ?disabled=${n.loading}
                placeholder=${F(`sessionsView.optionalPlaceholder`)}
                @change=${(e) => {
                  let r = h(e.target.value) ?? null;
                  n.onPatch(t.key, { label: r });
                }}
              />
            </label>
            ${X({ label: F(`sessionsView.thinking`), disabled: n.loading, options: _, current: g, onChange: (e) => n.onPatch(t.key, { thinkingLevel: yt(e) }) })}
            ${X({ label: F(`sessionsView.fast`), disabled: n.loading, options: y, current: v, onChange: (e) => n.onPatch(t.key, { fastMode: e === `` ? null : e === `auto` ? `auto` : e === `on` }) })}
            ${X({ label: F(`sessionsView.verbose`), disabled: n.loading, options: x, current: b, onChange: (e) => n.onPatch(t.key, { verboseLevel: e || null }) })}
            ${X({ label: F(`sessionsView.reasoning`), disabled: n.loading, options: C.map((e) => ({ value: e, label: e || F(`sessionsView.inherit`) })), current: S, onChange: (e) => n.onPatch(t.key, { reasoningLevel: e || null }) })}
          </div>
        </div>

        <div class="session-details-grid">
          ${D.map(
            (e) => u`
              <div class="session-detail-stat">
                <div class="session-detail-stat__label">${e.label}</div>
                <openclaw-tooltip .content=${e.value}>
                  <div class="session-detail-stat__value">${e.value}</div>
                </openclaw-tooltip>
              </div>
            `,
          )}
        </div>

        <div class="session-details-section">
          <div class="session-details-section__header">
            <div>
              <div class="session-details-panel__eyebrow">
                ${F(`sessionsView.compactionHistory`)}
              </div>
              <div class="session-details-section__title">${E}</div>
            </div>
          </div>
          ${
            n.checkpointLoadingKey === t.key
              ? u`<div class="muted session-details-empty">
                ${F(`sessionsView.loadingCheckpoints`)}
              </div>`
              : T
                ? u`<div class="callout danger">${T}</div>`
                : !p || w.length === 0
                  ? u`<div class="muted session-details-empty">
                    ${F(`sessionsView.noCheckpoints`)}
                  </div>`
                  : u`
                    <div class="session-checkpoint-list">
                      ${w.map(
                        (e) => u`
                          <div class="session-checkpoint-card">
                            <div class="session-checkpoint-card__header">
                              <strong>
                                ${Tt(e.reason)} ·
                                ${i(e.createdAt)}
                              </strong>
                              <span class="muted session-checkpoint-card__delta">
                                ${Dt(e)}
                              </span>
                            </div>
                            ${
                              e.summary
                                ? u`<div class="session-checkpoint-card__summary">
                                  ${e.summary}
                                </div>`
                                : u`<div class="muted">${F(`sessionsView.noSummary`)}</div>`
                            }
                            <div class="session-checkpoint-card__actions">
                              <button
                                class="btn btn--sm"
                                ?disabled=${n.checkpointBusyKey === e.checkpointId}
                                @click=${() => n.onBranchFromCheckpoint(t.key, e.checkpointId)}
                              >
                                ${F(`sessionsView.branchFromCheckpoint`)}
                              </button>
                              <button
                                class="btn btn--sm"
                                ?disabled=${n.checkpointBusyKey === e.checkpointId}
                                @click=${() => n.onRestoreCheckpoint(t.key, e.checkpointId)}
                              >
                                ${F(`sessionsView.restoreCheckpoint`)}
                              </button>
                            </div>
                          </div>
                        `,
                      )}
                    </div>
                  `
          }
        </div>
      </div>
    </td>
  </tr>`;
}
var Vt,
  Ht,
  Ut,
  Wt,
  Gt,
  Kt,
  Z,
  qt,
  Jt,
  Yt,
  Q,
  Xt = e(() => {
    (d(),
      it(),
      xe(),
      Ae(),
      ze(),
      Me(),
      ke(),
      he(),
      We(),
      ue(),
      Ve(),
      qe(),
      He(),
      ne(),
      ye(),
      y(),
      P(),
      ae(),
      W(),
      (Vt = [`off`, `minimal`, `low`, `medium`, `high`]),
      (Ht = [``, `off`, `on`, `full`]),
      (Ut = [``, `auto`, `on`, `off`]),
      (Wt = [``, `off`, `on`, `stream`]),
      (Gt = [10, 25, 50, 100]),
      (Kt = { live: `ok`, idle: `muted`, done: `ok`, failed: `danger`, muted: `muted` }),
      (Z = {
        cron: I.clock,
        direct: I.messageSquare,
        group: I.users,
        global: I.globe,
        unknown: I.circle,
      }),
      (qt = 65),
      (Jt = 85),
      (Yt = 4),
      (Q = `__new-group__`));
  }),
  $;
e(() => {
  (a(),
    d(),
    s(),
    De(),
    Oe(),
    we(),
    Ye(),
    je(),
    Ne(),
    Ie(),
    ke(),
    fe(),
    _(),
    pe(),
    P(),
    A(),
    ae(),
    be(),
    ce(),
    de(),
    Qe(),
    tt(),
    W(),
    Xt(),
    t(),
    ($ = class extends ge {
      constructor(...e) {
        (super(...e),
          (this.result = null),
          (this.loading = !1),
          (this.error = null),
          (this.activeMinutes = `60`),
          (this.limit = `50`),
          (this.includeGlobal = !0),
          (this.includeUnknown = !1),
          (this.showArchived = !1),
          (this.searchQuery = ``),
          (this.transcriptSearchQuery = ``),
          (this.transcriptSearch = { status: `idle` }),
          (this.sortColumn = `updated`),
          (this.sortDir = `desc`),
          (this.groupBy = nt()),
          (this.page = 0),
          (this.pageSize = 25),
          (this.selectedKeys = new Set()),
          (this.sessionMenu = null),
          (this.sessionMenuWork = null),
          (this.expandedSessionKey = null),
          (this.deepLinkSessionKey = null),
          (this.checkpointItemsByKey = {}),
          (this.checkpointLoadingKey = null),
          (this.checkpointBusyKey = null),
          (this.checkpointErrorByKey = {}),
          (this.sessionRequestId = 0),
          (this.transcriptSearchRequestId = 0),
          (this.checkpointRequestId = 0),
          (this.pageEpoch = 0),
          (this.routeDataInitialized = !1),
          (this.routeDataEnabled = !0),
          (this.ignorePendingSharedRefresh = !1),
          (this.sessionMutationPending = !1),
          (this.sessionReloadQueued = !1),
          (this.sharedSessionsResult = null),
          (this.sharedSessionsLoading = !1),
          (this.gatewayClient = null),
          (this.gatewayConnected = !1),
          (this.sessionMenuTrigger = null),
          (this.sessionMenuWorkVersion = 0),
          (this.hasBoundGatewaySource = !1),
          (this.hasBoundSessionsSource = !1),
          (this.subscriptions = new le(this)
            .effect(
              () => this.context?.sessions,
              (e) => {
                let t = this.hasBoundSessionsSource && !Object.is(this.sessionsSource, e);
                ((this.hasBoundSessionsSource = !0),
                  (this.sessionsSource = e),
                  t && (this.invalidatePageWork(), this.resetProviderState()),
                  (this.sharedSessionsResult = e.state.result),
                  (this.sharedSessionsLoading = e.state.loading));
                let n = e.subscribe((t) => {
                  if (!Object.is(this.context?.sessions, e)) return;
                  let n = t.result !== this.sharedSessionsResult,
                    r = this.sharedSessionsLoading && !t.loading;
                  if (
                    ((this.sharedSessionsResult = t.result),
                    (this.sharedSessionsLoading = t.loading),
                    !(t.loading || !this.routeDataInitialized || this.sessionMutationPending))
                  ) {
                    if (this.ignorePendingSharedRefresh && r) {
                      this.ignorePendingSharedRefresh = !1;
                      return;
                    }
                    n && this.scheduleSessionReload();
                  }
                });
                return (t && this.routeDataInitialized && this.scheduleSessionReload(), n);
              },
            )
            .watch(
              () => this.context?.agentIdentity,
              (e, t) => e.subscribe(t),
            )
            .effect(
              () => this.context?.agentSelection,
              (e) => {
                let t = () => {
                  let t = e.state.scopeId;
                  this.observedAgentScopeId !== t &&
                    ((this.observedAgentScopeId = t),
                    this.resetTranscriptSearchState(this.transcriptSearchQuery),
                    this.routeDataInitialized &&
                      !this.deepLinkSessionKey &&
                      ((this.page = 0), (this.selectedKeys = new Set()), this.loadSessions()),
                    this.requestUpdate());
                };
                return (t(), e.subscribe(t));
              },
            )
            .effect(
              () => this.context?.gateway,
              (e) => {
                let t = this.hasBoundGatewaySource;
                this.hasBoundGatewaySource = !0;
                let n = e.subscribe((t) => {
                  Object.is(this.context?.gateway, e) && this.applyGatewaySnapshot(t);
                });
                return (this.applyGatewaySnapshot(e.snapshot, t), n);
              },
            )
            .watch(
              () => this.context?.runtimeConfig,
              (e, t) => e.subscribe(t),
            )
            .watch(
              () => this.context?.workboard,
              (e, t) => e.subscribe(t),
            )));
      }
      willUpdate(e) {
        (e.has(`routeData`) || e.has(`context`)) && this.applyRouteData();
      }
      disconnectedCallback() {
        (this.subscriptions.clear(),
          this.invalidatePageWork(),
          (this.gatewayClient = null),
          (this.gatewayConnected = !1),
          super.disconnectedCallback());
      }
      applyGatewaySnapshot(e, t = !1) {
        let n = t || e.client !== this.gatewayClient,
          r = e.connected !== this.gatewayConnected,
          i = e.connected && !this.gatewayConnected;
        if (
          ((this.gatewayClient = e.client),
          (this.gatewayConnected = e.connected),
          (n || r) && (this.invalidatePageWork(), (this.ignorePendingSharedRefresh = !1)),
          n && this.resetProviderState(),
          !e.connected || !e.client)
        ) {
          this.requestUpdate();
          return;
        }
        (this.routeDataInitialized &&
          (n || i) &&
          ((this.ignorePendingSharedRefresh = !0), this.loadSessions()),
          this.requestUpdate());
      }
      invalidatePageWork() {
        ((this.pageEpoch += 1),
          (this.sessionRequestId += 1),
          (this.transcriptSearchRequestId += 1),
          (this.checkpointRequestId += 1),
          (this.sessionReloadQueued = !1),
          (this.loading = !1),
          this.transcriptSearch.status === `loading` &&
            (this.transcriptSearch = { status: `idle` }),
          (this.checkpointLoadingKey = null),
          (this.checkpointBusyKey = null),
          (this.sessionMutationPending = !1),
          this.closeSessionMenu());
      }
      resetProviderState() {
        ((this.result = null),
          (this.error = null),
          (this.loading = !1),
          this.resetTranscriptSearchState(``),
          (this.selectedKeys = new Set()),
          (this.expandedSessionKey = null),
          (this.deepLinkSessionKey = null),
          (this.checkpointItemsByKey = {}),
          (this.checkpointLoadingKey = null),
          (this.checkpointBusyKey = null),
          (this.checkpointErrorByKey = {}));
      }
      captureRequestScope() {
        let e = this.context;
        if (!this.isConnected || !e) return null;
        let t = e.gateway,
          n = t.snapshot.client;
        return !t.snapshot.connected || !n
          ? null
          : {
              epoch: this.pageEpoch,
              context: e,
              gateway: t,
              sessions: e.sessions,
              workboard: e.workboard,
              client: n,
            };
      }
      isRequestScopeCurrent(e) {
        let t = this.context,
          n = t?.gateway;
        return (
          this.isConnected &&
          this.pageEpoch === e.epoch &&
          t === e.context &&
          n === e.gateway &&
          t.sessions === e.sessions &&
          t.workboard === e.workboard &&
          n.snapshot.connected &&
          n.snapshot.client === e.client
        );
      }
      applyRouteData() {
        let e = this.routeData,
          t = this.context;
        if (
          !e ||
          !t ||
          (e !== this.appliedRouteData &&
            ((this.appliedRouteData = e), (this.routeDataEnabled = !0)),
          (this.routeDataInitialized = !0),
          !this.routeDataEnabled)
        )
          return;
        ((this.showArchived = e.showArchived),
          e.expandedSessionKey
            ? ((this.activeMinutes = ``),
              (this.limit = ``),
              (this.includeGlobal = !0),
              (this.includeUnknown = !0),
              (this.searchQuery = ``),
              (this.page = 0),
              (this.selectedKeys = new Set()))
            : ((this.activeMinutes = `60`),
              (this.limit = `50`),
              (this.includeGlobal = !0),
              (this.includeUnknown = !1)),
          (this.expandedSessionKey = e.expandedSessionKey),
          (this.deepLinkSessionKey = e.expandedSessionKey));
        let n = t.gateway,
          r = n.snapshot;
        if (
          ((this.gatewayClient = r.client),
          (this.gatewayConnected = r.connected),
          e.gateway !== n || e.gatewaySnapshot !== r)
        ) {
          ((this.routeDataEnabled = !1),
            this.loadSessions(),
            e.expandedSessionKey && this.loadCheckpoint(e.expandedSessionKey));
          return;
        }
        ((this.result = e.result ? ve(e.result, { showArchived: e.showArchived }) : null),
          (this.error = e.error),
          (this.loading = !1));
        let i = t.sessions.state;
        ((this.ignorePendingSharedRefresh = i.loading),
          this.ensureAgentIdentities(this.result),
          e.expandedSessionKey && this.loadCheckpoint(e.expandedSessionKey));
      }
      scheduleSessionReload() {
        if (this.sessionReloadQueued) return;
        this.sessionReloadQueued = !0;
        let e = this.pageEpoch;
        queueMicrotask(() => {
          if (e !== this.pageEpoch) return;
          this.sessionReloadQueued = !1;
          let t = this.context,
            n = t?.gateway.snapshot;
          this.isConnected &&
            t &&
            n?.connected &&
            n.client &&
            !t.sessions.state.loading &&
            this.loadSessions();
        });
      }
      sessionAgentId(e, t = this.context) {
        if (!t) return;
        let { agentId: n } = te(
          { assistantAgentId: t.agentSelection.state.selectedId, hello: t.gateway.snapshot.hello },
          e,
        );
        return n;
      }
      sessionListOptions() {
        let e = this.deepLinkSessionKey,
          t = this.context?.agentSelection.state.scopeId ?? void 0;
        return {
          activeMinutes: e || this.showArchived ? 0 : H(this.activeMinutes),
          limit: e ? 50 : H(this.limit),
          search: e ?? void 0,
          includeGlobal: e ? !0 : this.includeGlobal,
          includeUnknown: e ? !0 : this.includeUnknown,
          showArchived: this.showArchived,
          ...(e ? { agentId: this.sessionAgentId(e) } : t ? { agentId: t } : {}),
        };
      }
      async loadSessions() {
        let e = this.captureRequestScope();
        if (!e) return;
        let t = ++this.sessionRequestId,
          n = this.result;
        ((this.routeDataEnabled = !1), (this.loading = !0), (this.error = null));
        try {
          let r = await e.sessions.list(this.sessionListOptions());
          if (t !== this.sessionRequestId || !this.isRequestScopeCurrent(e)) return;
          ((this.result = r ? ve(r, { showArchived: this.showArchived }) : null),
            this.ensureAgentIdentities(this.result));
          let i = this.reconcileCheckpointCache(n, this.result);
          i && this.loadCheckpoint(i);
        } catch (n) {
          t === this.sessionRequestId && this.isRequestScopeCurrent(e) && (this.error = String(n));
        } finally {
          t === this.sessionRequestId && this.isRequestScopeCurrent(e) && (this.loading = !1);
        }
      }
      resetTranscriptSearchState(e) {
        ((this.transcriptSearchRequestId += 1),
          (this.transcriptSearchQuery = e),
          (this.transcriptSearch = { status: `idle` }));
      }
      updateTranscriptSearchQuery(e) {
        e !== this.transcriptSearchQuery && this.resetTranscriptSearchState(e);
      }
      clearTranscriptSearch() {
        this.resetTranscriptSearchState(``);
      }
      async runTranscriptSearch() {
        let e = this.transcriptSearchQuery.trim();
        if (!e) {
          this.clearTranscriptSearch();
          return;
        }
        let t = this.captureRequestScope();
        if (!t || v(t.gateway.snapshot, `sessions.search`) !== !0) return;
        this.resetTranscriptSearchState(e);
        let n = this.transcriptSearchRequestId;
        this.transcriptSearch = { status: `loading` };
        try {
          let r = await Ze({
            client: t.client,
            query: e,
            result: this.result,
            listSessions: t.sessions.list,
            listOptions: this.sessionListOptions(),
            resolveAgentId: (e) => j(e)?.agentId ?? this.sessionAgentId(e, t.context),
          });
          if (n !== this.transcriptSearchRequestId || !this.isRequestScopeCurrent(t)) return;
          this.transcriptSearch = {
            status: `results`,
            results: r.results,
            indexing: r.indexing === !0,
            truncated: r.truncated === !0,
          };
        } catch (e) {
          n === this.transcriptSearchRequestId &&
            this.isRequestScopeCurrent(t) &&
            (this.transcriptSearch = { status: `error`, message: String(e) });
        }
      }
      ensureAgentIdentities(e) {
        let t = this.context;
        if (!t || !e) return;
        let n = V(e).filter((e) => !t.agentIdentity.get(e));
        n.length !== 0 && t.agentIdentity.ensure(n);
      }
      reconcileCheckpointCache(e, t) {
        let n = new Map((t?.sessions ?? []).map((e) => [e.key, e])),
          r = new Map((e?.sessions ?? []).map((e) => [e.key, e])),
          i = { ...this.checkpointItemsByKey },
          a = { ...this.checkpointErrorByKey },
          o = null;
        for (let e of Object.keys(i)) {
          let t = n.get(e),
            s = r.get(e);
          (!t ||
            !s ||
            s.compactionCheckpointCount !== t.compactionCheckpointCount ||
            s.latestCompactionCheckpoint?.checkpointId !==
              t.latestCompactionCheckpoint?.checkpointId) &&
            (delete i[e], delete a[e], this.expandedSessionKey === e && (o = e));
        }
        return ((this.checkpointItemsByKey = i), (this.checkpointErrorByKey = a), o);
      }
      updateFilters(e) {
        ((this.activeMinutes = e.activeMinutes),
          (this.limit = e.limit),
          (this.includeGlobal = e.includeGlobal),
          (this.includeUnknown = e.includeUnknown),
          (this.showArchived = e.showArchived),
          (this.page = 0),
          (this.selectedKeys = new Set()),
          (this.deepLinkSessionKey = null),
          this.loadSessions());
      }
      async deleteSelected() {
        let e = [...this.selectedKeys];
        e.length === 0 ||
          this.loading ||
          this.sessionMutationPending ||
          (window.confirm(
            `Delete ${e.length} ${e.length === 1 ? `session` : `sessions`}?\n\nThis will delete the session entries and archive their transcripts.`,
          ) &&
            (await this.deleteSessions(e)));
      }
      async deleteSessions(e) {
        if (e.length === 0 || this.loading || this.sessionMutationPending) return;
        let t = this.captureRequestScope();
        if (t) {
          this.sessionMutationPending = !0;
          try {
            let n = await t.sessions.deleteMany(
              e.map((e) => ({ key: e, agentId: this.sessionAgentId(e, t.context) })),
            );
            if (!this.isRequestScopeCurrent(t)) return;
            if (
              (n.preservedWorktrees.length > 0 &&
                window.alert(
                  F(`sessionsView.deletePreservedWorktrees`, {
                    count: String(n.preservedWorktrees.length),
                    branches: n.preservedWorktrees.map((e) => e.branch).join(`, `),
                  }),
                ),
              n.deleted.length > 0)
            ) {
              let e = new Set(n.deleted),
                r = new Set(this.selectedKeys);
              for (let e of n.deleted) r.delete(e);
              if (((this.selectedKeys = r), this.result)) {
                let t = this.result.sessions.filter((t) => !e.has(t.key));
                this.result = {
                  ...this.result,
                  count: Math.max(0, this.result.count - (this.result.sessions.length - t.length)),
                  sessions: t,
                };
              }
              (this.expandedSessionKey &&
                e.has(this.expandedSessionKey) &&
                (this.expandedSessionKey = null),
                this.deepLinkSessionKey &&
                  e.has(this.deepLinkSessionKey) &&
                  (this.deepLinkSessionKey = null));
              let i = n.deleted.find((e) => w(e, t.gateway.snapshot.sessionKey));
              i &&
                t.gateway.setSessionKey(
                  T({
                    agentId: j(i)?.agentId ?? t.context.agentSelection.state.selectedId ?? `main`,
                    mainKey: E({
                      agentsList: t.context.agents.state.agentsList,
                      hello: t.gateway.snapshot.hello,
                    }),
                  }),
                );
            }
            n.errors.length > 0 && (this.error = n.errors.join(`; `));
          } catch (e) {
            this.isRequestScopeCurrent(t) && (this.error = String(e));
          } finally {
            this.isRequestScopeCurrent(t) && (this.sessionMutationPending = !1);
          }
        }
      }
      async deleteSessionFromMenu(e) {
        let t = h(e.label) ?? e.key;
        window.confirm(F(`sessionsView.deleteSessionConfirm`, { session: t })) &&
          (await this.deleteSessions([e.key]));
      }
      knownCategories() {
        return $e(this.result, this.context?.sessions.state.groups ?? []);
      }
      setGroupBy(e) {
        ((this.groupBy = e), rt(e));
      }
      async rememberCustomGroup(e) {
        let t = this.captureRequestScope();
        await et({
          name: e,
          knownCategories: this.knownCategories(),
          sessions: t?.sessions,
          isCurrent: () => !!(t && this.isRequestScopeCurrent(t)),
          onError: (e) => {
            this.error = e;
          },
        });
      }
      assignCategory(e, t) {
        let n = this.result?.sessions.find((t) => t.key === e);
        n &&
          (n.category?.trim() || null) !== t &&
          (t && this.rememberCustomGroup(t), this.patchSession(e, { category: t }));
      }
      requestNewCategory(e) {
        let t = window.prompt(F(`sessionsView.newGroupPrompt`))?.trim();
        t && (this.rememberCustomGroup(t), e && this.patchSession(e, { category: t }));
      }
      renameSession(e) {
        let t = window.prompt(F(`sessionsView.renameSessionPrompt`), h(e.label) ?? ``);
        t !== null && this.patchSession(e.key, { label: h(t) ?? null });
      }
      async patchSession(e, t) {
        let n = this.captureRequestScope();
        if (n)
          try {
            let r = await n.sessions.patch(e, t, { agentId: this.sessionAgentId(e, n.context) });
            if (!this.isRequestScopeCurrent(n)) return;
            if (!r) {
              this.error = n.sessions.state.error;
              return;
            }
            let i = new Set(this.selectedKeys);
            (i.delete(e),
              (this.selectedKeys = i),
              t.archived === !0 &&
                w(e, n.gateway.snapshot.sessionKey) &&
                n.gateway.setSessionKey(
                  T({
                    agentId: j(e)?.agentId ?? n.context.agentSelection.state.selectedId ?? `main`,
                    mainKey: E({
                      agentsList: n.context.agents.state.agentsList,
                      hello: n.gateway.snapshot.hello,
                    }),
                  }),
                ));
          } catch (e) {
            this.isRequestScopeCurrent(n) && (this.error = String(e));
          }
      }
      async forkSession(e) {
        let t = this.captureRequestScope();
        if (!t) return;
        let n = this.sessionAgentId(e, t.context);
        try {
          let r = await t.sessions.create({
            parentSessionKey: e,
            fork: !0,
            ...(n ? { agentId: n } : {}),
          });
          if (!this.isRequestScopeCurrent(t)) return;
          r
            ? t.context.navigate(`chat`, { search: x(r), hash: `` })
            : t.sessions.state.error && (this.error = t.sessions.state.error);
        } catch (e) {
          this.isRequestScopeCurrent(t) && (this.error = String(e));
        }
      }
      async toggleSessionDetails(e) {
        if (!this.context) return;
        if (((this.deepLinkSessionKey = null), this.expandedSessionKey === e)) {
          ((this.checkpointRequestId += 1), (this.expandedSessionKey = null));
          return;
        }
        this.expandedSessionKey = e;
        let t = this.result?.sessions.find((t) => t.key === e);
        if (!((t?.compactionCheckpointCount ?? 0) > 0 || t?.latestCompactionCheckpoint)) {
          this.checkpointItemsByKey[e] ||
            (this.checkpointItemsByKey = { ...this.checkpointItemsByKey, [e]: [] });
          return;
        }
        this.checkpointItemsByKey[e] || (await this.loadCheckpoint(e));
      }
      async loadCheckpoint(e) {
        let t = this.captureRequestScope();
        if (!t) return;
        let n = ++this.checkpointRequestId;
        ((this.checkpointLoadingKey = e),
          (this.checkpointErrorByKey = { ...this.checkpointErrorByKey, [e]: `` }));
        try {
          let r = await t.sessions.listCheckpoints(e, {
            agentId: this.sessionAgentId(e, t.context),
          });
          if (n !== this.checkpointRequestId || !this.isRequestScopeCurrent(t)) return;
          this.checkpointItemsByKey = { ...this.checkpointItemsByKey, [e]: r };
        } catch (r) {
          if (n !== this.checkpointRequestId || !this.isRequestScopeCurrent(t)) return;
          this.checkpointErrorByKey = { ...this.checkpointErrorByKey, [e]: String(r) };
        } finally {
          n === this.checkpointRequestId &&
            this.isRequestScopeCurrent(t) &&
            this.checkpointLoadingKey === e &&
            (this.checkpointLoadingKey = null);
        }
      }
      async branchCheckpoint(e, t) {
        if (!window.confirm(`Create a new child session from this compacted checkpoint?`)) return;
        let n = this.captureRequestScope();
        if (n) {
          this.checkpointBusyKey = t;
          try {
            let r = await n.sessions.branchCheckpoint(e, t, {
              agentId: this.sessionAgentId(e, n.context),
            });
            this.isRequestScopeCurrent(n) &&
              n.context.navigate(`chat`, { search: x(r.key), hash: `` });
          } catch (e) {
            this.isRequestScopeCurrent(n) && (this.error = String(e));
          } finally {
            this.isRequestScopeCurrent(n) &&
              this.checkpointBusyKey === t &&
              (this.checkpointBusyKey = null);
          }
        }
      }
      async restoreCheckpoint(e, t) {
        if (
          !window.confirm(`Restore this session to the selected compacted checkpoint?

This replaces the current active transcript for the session key.`)
        )
          return;
        let n = this.captureRequestScope();
        if (n) {
          this.checkpointBusyKey = t;
          try {
            await n.sessions.restoreCheckpoint(e, t, {
              agentId: this.sessionAgentId(e, n.context),
            });
          } catch (e) {
            this.isRequestScopeCurrent(n) && (this.error = String(e));
          } finally {
            this.isRequestScopeCurrent(n) &&
              this.checkpointBusyKey === t &&
              (this.checkpointBusyKey = null);
          }
        }
      }
      openSessionMenu(e, t, n) {
        if (this.sessionMenu?.key === e.key && n) {
          this.closeSessionMenu();
          return;
        }
        ((this.sessionMenu = { key: e.key, ...t }),
          (this.sessionMenuTrigger = n),
          this.loadSessionMenuWork(e));
      }
      closeSessionMenu() {
        ((this.sessionMenu = null),
          (this.sessionMenuTrigger = null),
          (this.sessionMenuWorkVersion += 1),
          (this.sessionMenuWork = null));
      }
      loadSessionMenuWork(e) {
        let t = ++this.sessionMenuWorkVersion;
        if (!e.worktree) {
          this.sessionMenuWork = null;
          return;
        }
        this.sessionMenuWork = { loading: !0, pullRequestUrl: null, worktreePath: null };
        let n = this.captureRequestScope();
        if (!n) {
          this.sessionMenuWork = { loading: !1, pullRequestUrl: null, worktreePath: null };
          return;
        }
        Pe({
          client: n.client,
          pullRequestsAvailable:
            v(n.context.gateway.snapshot, `controlUi.sessionPullRequests`) === !0,
          sessionKey: e.key,
          agentId: this.sessionAgentId(e.key, n.context),
          worktreeId: e.worktree.id,
        }).then((e) => {
          t === this.sessionMenuWorkVersion && (this.sessionMenuWork = { loading: !1, ...e });
        });
      }
      renderSessionMenu() {
        let e = this.sessionMenu,
          t = this.context,
          n = e ? this.result?.sessions.find((t) => t.key === e.key) : null;
        if (!e || !t || !n) return f;
        let r = t.gateway.snapshot,
          i = se(t.runtimeConfig.state.configSnapshot) && Ce(r.hello?.auth ?? null),
          a = t.workboard.state,
          o = new Set(
            a.cards
              .flatMap((e) => [e.sessionKey, e.execution?.sessionKey])
              .filter((e) => typeof e == `string` && e.length > 0),
          ),
          s = D(n, E({ agentsList: t.agents.state.agentsList, hello: r.hello }));
        return u`
      <openclaw-session-menu
        .session=${{ label: h(n.label) ?? n.key, pinned: n.pinned === !0, unread: n.unread === !0, archived: n.archived === !0, category: h(n.category) ?? null }}
        .anchor=${e}
        .trigger=${this.sessionMenuTrigger}
        .disabled=${this.loading}
        .forkDisabled=${n.modelSelectionLocked === !0}
        .archiveAllowed=${s}
        .groups=${this.knownCategories()}
        .canOpenChat=${n.kind !== `global`}
        .work=${this.sessionMenuWork}
        .workboard=${i && n.kind !== `global` ? { captured: o.has(n.key), busy: [...a.capturingSessionKeys][0] === n.key } : null}
        .onClose=${() => this.closeSessionMenu()}
        .onAction=${(e) => {
          switch (e.kind) {
            case `open-chat`:
              t.navigate(`chat`, { search: x(n.key), hash: `` });
              break;
            case `open-pr`:
              window.open(e.url, `_blank`, `noopener`);
              break;
            case `open-in`:
              window.open(_e(e.editor, e.path));
              break;
            case `toggle-pin`:
              this.patchSession(n.key, { pinned: n.pinned !== !0 });
              break;
            case `toggle-unread`:
              this.patchSession(n.key, { unread: n.unread !== !0 });
              break;
            case `rename`:
              this.renameSession(n);
              break;
            case `fork`:
              this.forkSession(n.key);
              break;
            case `workboard`:
              this.addToWorkboard(n);
              break;
            case `move-to-group`:
              this.assignCategory(n.key, e.category);
              break;
            case `new-group`:
              this.requestNewCategory(n.key);
              break;
            case `toggle-archived`:
              this.patchSession(n.key, { archived: n.archived !== !0 });
              break;
            case `delete`:
              this.deleteSessionFromMenu(n);
              break;
          }
        }}
      ></openclaw-session-menu>
    `;
      }
      render() {
        let e = this.context;
        return e
          ? u`
      <section class="content-header content-header--page">
        <div>
          <div class="page-title">${Ee(`sessions`)}</div>
        </div>
        ${Je({ agents: e.agents.state.agentsList?.agents ?? [], selection: e.agentSelection })}
      </section>
      ${Fe(
        Lt({
          loading: this.loading,
          result: this.result,
          error: this.error,
          activeMinutes: this.activeMinutes,
          limit: this.limit,
          includeGlobal: this.includeGlobal,
          includeUnknown: this.includeUnknown,
          showArchived: this.showArchived,
          basePath: e.basePath,
          searchQuery: this.searchQuery,
          transcriptSearchAvailable: v(e.gateway.snapshot, `sessions.search`) === !0,
          transcriptSearchQuery: this.transcriptSearchQuery,
          transcriptSearch: this.transcriptSearch,
          agentIdentityById: Xe(this.result, (t) => e.agentIdentity.get(t) ?? void 0),
          sortColumn: this.sortColumn,
          sortDir: this.sortDir,
          groupBy: this.groupBy,
          knownCategories: this.knownCategories(),
          page: this.page,
          pageSize: this.pageSize,
          selectedKeys: this.selectedKeys,
          sessionMenu: this.sessionMenu,
          expandedSessionKey: this.expandedSessionKey,
          checkpointItemsByKey: this.checkpointItemsByKey,
          checkpointLoadingKey: this.checkpointLoadingKey,
          checkpointBusyKey: this.checkpointBusyKey,
          checkpointErrorByKey: this.checkpointErrorByKey,
          onFiltersChange: (e) => this.updateFilters(e),
          onClearFilters: () => {
            ((this.activeMinutes = ``),
              (this.limit = ``),
              (this.includeGlobal = !0),
              (this.includeUnknown = !0),
              (this.showArchived = !1),
              (this.searchQuery = ``),
              (this.page = 0),
              (this.selectedKeys = new Set()),
              (this.deepLinkSessionKey = null),
              this.loadSessions());
          },
          onSearchChange: (e) => {
            ((this.searchQuery = e), (this.page = 0));
          },
          onTranscriptSearchChange: (e) => this.updateTranscriptSearchQuery(e),
          onTranscriptSearch: () => void this.runTranscriptSearch(),
          onClearTranscriptSearch: () => this.clearTranscriptSearch(),
          onSortChange: (e, t) => {
            ((this.sortColumn = e), (this.sortDir = t), (this.page = 0));
          },
          onGroupByChange: (e) => this.setGroupBy(e),
          onAssignCategory: (e, t) => this.assignCategory(e, t),
          onRequestNewCategory: (e) => this.requestNewCategory(e),
          onPageChange: (e) => {
            this.page = e;
          },
          onPageSizeChange: (e) => {
            ((this.pageSize = e), (this.page = 0));
          },
          onRefresh: () => void this.loadSessions(),
          onPatch: (e, t) => void this.patchSession(e, t),
          onToggleSelect: (e) => {
            let t = new Set(this.selectedKeys);
            (t.has(e) ? t.delete(e) : t.add(e), (this.selectedKeys = t));
          },
          onSelectPage: (e) => {
            this.selectedKeys = new Set([...this.selectedKeys, ...e]);
          },
          onDeselectPage: (e) => {
            let t = new Set(this.selectedKeys);
            for (let n of e) t.delete(n);
            this.selectedKeys = t;
          },
          onDeselectAll: () => {
            this.selectedKeys = new Set();
          },
          onDeleteSelected: () => void this.deleteSelected(),
          onNavigateToChat: (t) => e.navigate(`chat`, { search: x(t), hash: `` }),
          onOpenSessionMenu: (e, t, n) => this.openSessionMenu(e, t, n),
          onToggleDetails: (e) => void this.toggleSessionDetails(e),
          onBranchFromCheckpoint: (e, t) => void this.branchCheckpoint(e, t),
          onRestoreCheckpoint: (e, t) => void this.restoreCheckpoint(e, t),
        }),
      )}
      ${this.renderSessionMenu()}
    `
          : u``;
      }
      async addToWorkboard(e) {
        let t = this.captureRequestScope();
        if (t)
          try {
            (await b({
              host: t.workboard,
              client: t.client,
              session: e,
              requestUpdate: () => {
                this.isRequestScopeCurrent(t) && t.workboard.notify();
              },
            }),
              this.isRequestScopeCurrent(t) && t.context.navigate(`workboard`));
          } catch (e) {
            this.isRequestScopeCurrent(t) && (this.error = String(e));
          }
      }
    }),
    n([o({ context: Se, subscribe: !0 })], $.prototype, `context`, void 0),
    n([l({ attribute: !1 })], $.prototype, `routeData`, void 0),
    n([c()], $.prototype, `result`, void 0),
    n([c()], $.prototype, `loading`, void 0),
    n([c()], $.prototype, `error`, void 0),
    n([c()], $.prototype, `activeMinutes`, void 0),
    n([c()], $.prototype, `limit`, void 0),
    n([c()], $.prototype, `includeGlobal`, void 0),
    n([c()], $.prototype, `includeUnknown`, void 0),
    n([c()], $.prototype, `showArchived`, void 0),
    n([c()], $.prototype, `searchQuery`, void 0),
    n([c()], $.prototype, `transcriptSearchQuery`, void 0),
    n([c()], $.prototype, `transcriptSearch`, void 0),
    n([c()], $.prototype, `sortColumn`, void 0),
    n([c()], $.prototype, `sortDir`, void 0),
    n([c()], $.prototype, `groupBy`, void 0),
    n([c()], $.prototype, `page`, void 0),
    n([c()], $.prototype, `pageSize`, void 0),
    n([c()], $.prototype, `selectedKeys`, void 0),
    n([c()], $.prototype, `sessionMenu`, void 0),
    n([c()], $.prototype, `sessionMenuWork`, void 0),
    n([c()], $.prototype, `expandedSessionKey`, void 0),
    n([c()], $.prototype, `checkpointItemsByKey`, void 0),
    n([c()], $.prototype, `checkpointLoadingKey`, void 0),
    n([c()], $.prototype, `checkpointBusyKey`, void 0),
    n([c()], $.prototype, `checkpointErrorByKey`, void 0),
    customElements.get(`openclaw-sessions-page`) ||
      customElements.define(`openclaw-sessions-page`, $));
})();
//# sourceMappingURL=sessions-page-Cz1oTL4K.js.map
