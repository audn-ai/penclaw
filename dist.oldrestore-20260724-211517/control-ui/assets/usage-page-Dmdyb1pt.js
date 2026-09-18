import { n as de, t as fe } from "./agent-scope-control-DLXN7_B3.js";
import { K as F, dt as I, nt as ae, q as L } from "./control-ui-core--EZfp09c.js";
import {
  Gi as x,
  Hi as S,
  Ji as te,
  Ui as C,
  Vi as w,
  Wa as T,
  Xi as E,
  Zi as ne,
  cn as D,
  da as O,
  di as k,
  ea as A,
  fi as j,
  in as M,
  la as N,
  on as re,
  sn as P,
  tn as ie,
} from "./control-ui-core-BcbHa4vB.js";
import { J as z, X as B } from "./control-ui-core-CQDTaMS5.js";
import { o as R, t as oe } from "./control-ui-core-CwQmiouz.js";
import { dt as a, ft as o } from "./control-ui-foundation-0uuDj0X3.js";
import { _ as t, g as n, h as r, p as i } from "./control-ui-foundation-CCDffryi.js";
import {
  $ as m,
  D as h,
  H as g,
  I as _,
  M as v,
  P as y,
  Z as b,
  z as ee,
} from "./control-ui-foundation-s2wA1PVE.js";
import { d as V, f as H } from "./control-ui-shared-CrnVqnQR.js";
import {
  G as s,
  Y as c,
  Z as l,
  at as u,
  et as d,
  nt as f,
  st as p,
} from "./lit-runtime-DkvDG939.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
import { a as le, s as U, t as ue } from "./settings-ui-T0X7dZpU.js";
import { n as se, t as ce } from "./settings-workspace-DRQpceJK.js";
import { n as pe, r as me, t as he } from "./usage-DhfDKqcE.js";
function ge(e, t) {
  if (!e) return t;
  if (!t) return e;
  let n = { fresh: 0, partial: 1, stale: 2, refreshing: 3 };
  return {
    status: n[t.status] > n[e.status] ? t.status : e.status,
    cachedFiles: Math.max(e.cachedFiles, t.cachedFiles),
    pendingFiles: Math.max(e.pendingFiles, t.pendingFiles),
    staleFiles: Math.max(e.staleFiles, t.staleFiles),
    refreshedAt: Math.max(e.refreshedAt ?? 0, t.refreshedAt ?? 0) || void 0,
  };
}
function _e(e) {
  return !e || (e.status !== `refreshing` && e.status !== `stale` && e.status !== `partial`)
    ? null
    : R(`usage.cacheStatus.title`, {
        status: R(`usage.cacheStatus.status.${e.status}`),
        pending: String(e.pendingFiles),
        stale: String(e.staleFiles),
        cached: String(e.cachedFiles),
      });
}
var ve = e(() => {
  oe();
});
function ye() {
  let e = new Date();
  return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, `0`)}-${String(e.getDate()).padStart(2, `0`)}`;
}
function be(e) {
  if (typeof e == `string`) return e;
  if (e instanceof Error && e.message.trim()) return e.message;
  if (e && typeof e == `object`)
    try {
      return JSON.stringify(e) || `request failed`;
    } catch {}
  return `request failed`;
}
function xe(e, t, n, r, i) {
  if (r && e.length > 0)
    for (let r of e.slice(-1)) {
      let i = n.indexOf(r),
        a = n.indexOf(t);
      if (i !== -1 && a !== -1) {
        let [t, r] = i < a ? [i, a] : [a, i];
        return [...new Set([...e, ...n.slice(t, r + 1)])];
      }
    }
  return e.includes(t) ? e.filter((e) => e !== t) : i ? [...e, t] : [t];
}
function Se(e, t, n, r, i) {
  if (i && e.length > 0) {
    let i = [...n]
        .toSorted((e, t) => {
          let n = r ? (e.usage?.totalTokens ?? 0) : (e.usage?.totalCost ?? 0);
          return (r ? (t.usage?.totalTokens ?? 0) : (t.usage?.totalCost ?? 0)) - n;
        })
        .map((e) => e.key),
      a = i.indexOf(e.at(-1) ?? ``),
      o = i.indexOf(t);
    if (a !== -1 && o !== -1) {
      let [t, n] = a < o ? [a, o] : [o, a];
      return [...new Set([...e, ...i.slice(t, n + 1)])];
    }
  }
  return e.length === 1 && e[0] === t ? [] : [t];
}
function Ce(e) {
  let t = e.split(`
`),
    n = new Map(),
    r = [];
  for (let e of t) {
    let t = /^\[Tool:\s*([^\]]+)\]/.exec(e.trim())?.[1];
    if (t) {
      n.set(t, (n.get(t) ?? 0) + 1);
      continue;
    }
    e.trim().startsWith(`[Tool Result]`) || r.push(e);
  }
  let i = Array.from(n.entries()).toSorted((e, t) => t[1] - e[1]),
    a = i.reduce((e, [, t]) => e + t, 0);
  return {
    tools: i,
    summary: i.length > 0 ? `Tools: ${i.map(([e, t]) => `${e}×${t}`).join(`, `)} (${a} calls)` : ``,
    cleanContent: r
      .join(`
`)
      .trim(),
  };
}
var we,
  Te,
  Ee,
  De,
  Oe,
  ke,
  Ae,
  je,
  Me,
  Ne,
  Pe,
  Fe,
  Ie,
  Le,
  Re,
  ze = e(() => {
    (T(),
      (we = (e) => m(e)),
      (Te = (e) => {
        let t = e
          .replace(/[.+^${}()|[\]\\]/g, `\\$&`)
          .replace(/\*/g, `.*`)
          .replace(/\?/g, `.`);
        return RegExp(`^${t}$`, `i`);
      }),
      (Ee = (e) => {
        let t = m(e);
        if (!t) return null;
        t.startsWith(`$`) && (t = t.slice(1));
        let n = 1;
        if (
          (t.endsWith(`k`)
            ? ((n = 1e3), (t = t.slice(0, -1)))
            : t.endsWith(`m`) && ((n = 1e6), (t = t.slice(0, -1))),
          !/^\d+(?:\.\d+)?$/.test(t))
        )
          return null;
        let r = Number(t) * n;
        return !Number.isFinite(r) || !Number.isSafeInteger(Math.round(r)) ? null : r;
      }),
      (De = (e) =>
        (e.match(/"[^"]+"|\S+/g) ?? []).map((e) => {
          let t = e.replace(/^"|"$/g, ``),
            n = t.indexOf(`:`);
          return n > 0
            ? { key: t.slice(0, n), value: t.slice(n + 1), raw: t }
            : { value: t, raw: t };
        })),
      (Oe = (e) => [e.label, e.key, e.sessionId].filter((e) => !!e).map((e) => m(e))),
      (ke = (e) => {
        let t = new Set();
        (e.modelProvider && t.add(m(e.modelProvider)),
          e.providerOverride && t.add(m(e.providerOverride)),
          e.origin?.provider && t.add(m(e.origin.provider)));
        for (let n of e.usage?.modelUsage ?? []) n.provider && t.add(m(n.provider));
        return Array.from(t);
      }),
      (Ae = (e) => {
        let t = new Set();
        e.model && t.add(m(e.model));
        for (let n of e.usage?.modelUsage ?? []) n.model && t.add(m(n.model));
        return Array.from(t);
      }),
      (je = (e) => (e.usage?.toolUsage?.tools ?? []).map((e) => m(e.name))),
      (Me = {
        tools: (e) => (e.usage?.toolUsage?.totalCalls ?? 0) > 0,
        errors: (e) => (e.usage?.messageCounts?.errors ?? 0) > 0,
        context: (e) => !!e.contextWeight,
        usage: (e) => !!e.usage,
        model: (e) => Ae(e).length > 0,
        provider: (e) => ke(e).length > 0,
      }),
      (Ne = (e, t) => e >= t),
      (Pe = (e, t) => e <= t),
      (Fe = {
        mintokens: [(e) => e.usage?.totalTokens ?? 0, Ne],
        maxtokens: [(e) => e.usage?.totalTokens ?? 0, Pe],
        mincost: [(e) => e.usage?.totalCost ?? 0, Ne],
        maxcost: [(e) => e.usage?.totalCost ?? 0, Pe],
        minmessages: [(e) => e.usage?.messageCounts?.total ?? 0, Ne],
        maxmessages: [(e) => e.usage?.messageCounts?.total ?? 0, Pe],
      }),
      (Ie = new Set([
        `agent`,
        `channel`,
        `chat`,
        `provider`,
        `model`,
        `tool`,
        `label`,
        `key`,
        `session`,
        `id`,
        `has`,
        ...Object.keys(Fe),
      ])),
      (Le = (e, t) => {
        let n = we(t.value ?? ``);
        if (!n) return !0;
        if (!t.key) return Oe(e).some((e) => e.includes(n));
        let r = we(t.key);
        switch (r) {
          case `agent`:
            return m(e.agentId).includes(n);
          case `channel`:
            return m(e.channel).includes(n);
          case `chat`:
            return m(e.chatType).includes(n);
          case `provider`:
            return ke(e).some((e) => e.includes(n));
          case `model`:
            return Ae(e).some((e) => e.includes(n));
          case `tool`:
            return je(e).some((e) => e.includes(n));
          case `label`:
            return m(e.label).includes(n);
          case `key`:
          case `session`:
          case `id`:
            if (n.includes(`*`) || n.includes(`?`)) {
              let t = Te(n);
              return t.test(e.key) || (e.sessionId ? t.test(e.sessionId) : !1);
            }
            return m(e.key).includes(n) || m(e.sessionId).includes(n);
          case `has`:
            return (Object.hasOwn(Me, n) ? Me[n] : void 0)?.(e) ?? !0;
        }
        let i = Object.hasOwn(Fe, r) ? Fe[r] : void 0;
        if (!i) return !0;
        let a = Ee(n),
          [o, s] = i;
        return a === null || s(o(e), a);
      }),
      (Re = (e, t) => {
        let n = De(t);
        if (n.length === 0) return { sessions: e, warnings: [] };
        let r = [];
        for (let e of n) {
          if (!e.key) continue;
          let t = we(e.key);
          if (!Ie.has(t)) {
            r.push(`Unknown filter: ${e.key}`);
            continue;
          }
          (e.value === `` && r.push(`Missing value for ${e.key}`),
            t === `has` &&
              e.value &&
              !Object.hasOwn(Me, we(e.value)) &&
              r.push(`Unknown has:${e.value}`),
            Object.hasOwn(Fe, t) &&
              e.value &&
              Ee(e.value) === null &&
              r.push(`Invalid number for ${e.key}`));
        }
        return { sessions: e.filter((e) => n.every((t) => Le(e, t))), warnings: r };
      }));
  }),
  Be,
  Ve = e(() => {
    Be = [`channel`, `agent`, `provider`, `model`, `messages`, `tools`, `errors`, `duration`];
  });
function He(e, t) {
  !t ||
    t.count <= 0 ||
    ((e.count += t.count),
    (e.sum += t.avgMs * t.count),
    (e.min = Math.min(e.min, t.minMs)),
    (e.max = Math.max(e.max, t.maxMs)),
    (e.p95Max = Math.max(e.p95Max, t.p95Ms)));
}
function Ue(e, t) {
  for (let n of t ?? []) {
    let t = e.get(n.date) ?? { date: n.date, count: 0, sum: 0, min: 1 / 0, max: 0, p95Max: 0 };
    ((t.count += n.count),
      (t.sum += n.avgMs * n.count),
      (t.min = Math.min(t.min, n.minMs)),
      (t.max = Math.max(t.max, n.maxMs)),
      (t.p95Max = Math.max(t.p95Max, n.p95Ms)),
      e.set(n.date, t));
  }
}
function We(e) {
  return {
    byChannel: Array.from(e.byChannelMap.entries())
      .map(([e, t]) => ({ channel: e, totals: t }))
      .toSorted((e, t) => t.totals.totalCost - e.totals.totalCost),
    latency:
      e.latencyTotals.count > 0
        ? {
            count: e.latencyTotals.count,
            avgMs: e.latencyTotals.sum / e.latencyTotals.count,
            minMs: e.latencyTotals.min === 1 / 0 ? 0 : e.latencyTotals.min,
            maxMs: e.latencyTotals.max,
            p95Ms: e.latencyTotals.p95Max,
          }
        : void 0,
    dailyLatency: Array.from(e.dailyLatencyMap.values())
      .map((e) => ({
        date: e.date,
        count: e.count,
        avgMs: e.count ? e.sum / e.count : 0,
        minMs: e.min === 1 / 0 ? 0 : e.min,
        maxMs: e.max,
        p95Ms: e.p95Max,
      }))
      .toSorted((e, t) => e.date.localeCompare(t.date)),
    modelDaily: Array.from(e.modelDailyMap.values()).toSorted(
      (e, t) => e.date.localeCompare(t.date) || t.cost - e.cost,
    ),
    daily: Array.from(e.dailyMap.values()).toSorted((e, t) => e.date.localeCompare(t.date)),
  };
}
var Ge = e(() => {});
function Ke(e) {
  return Math.round(e / mt);
}
function W(e) {
  return x(e, { thousandsSuffix: `K`, trimTrailingZero: !1 });
}
function qe(e) {
  let t = new Date();
  return (t.setHours(e, 0, 0, 0), t.toLocaleTimeString(void 0, { hour: `numeric` }));
}
function Je(e, t, n) {
  let r = e.usage;
  if (!r) return !1;
  let i = r.firstActivity ?? e.updatedAt,
    a = r.lastActivity ?? e.updatedAt;
  if (!i || !a) return !1;
  let o = Math.min(i, a),
    s = Math.max(i, a),
    c = Math.max(s - o, 1) / 6e4,
    l = o;
  for (; l < s;) {
    let e = new Date(l),
      i = et(e, t),
      a = Math.min(i.getTime(), s),
      o = Math.max((a - l) / 6e4, 0);
    (n({ usage: r, hour: Xe(e, t), weekday: Ze(e, t), share: o / c }), (l = a + 1));
  }
  return !0;
}
function Ye(e, t) {
  let n = Array.from({ length: 24 }, () => 0),
    r = Array.from({ length: 24 }, () => 0);
  for (let i of e) {
    let e = i.usage;
    if (!e?.messageCounts || e.messageCounts.total === 0) continue;
    let a = e.messageCounts;
    if (e.utcQuarterHourMessageCounts && e.utcQuarterHourMessageCounts.length > 0) {
      for (let i of e.utcQuarterHourMessageCounts) {
        let e = $e(i.date, i.quarterIndex, t);
        e && ((n[e.hour] = (n[e.hour] ?? 0) + i.errors), (r[e.hour] = (r[e.hour] ?? 0) + i.total));
      }
      continue;
    }
    Je(i, t, ({ hour: e, share: t }) => {
      ((n[e] = (n[e] ?? 0) + (a.errors ?? 0) * t), (r[e] = (r[e] ?? 0) + a.total * t));
    });
  }
  return r
    .map((e, t) => {
      let r = n[t] ?? 0;
      return { hour: t, rate: e > 0 ? r / e : 0, errors: r, msgs: e };
    })
    .filter((e) => e.msgs > 0 && e.errors > 0)
    .toSorted((e, t) => t.rate - e.rate)
    .slice(0, 5)
    .map((e) => ({
      label: qe(e.hour),
      value: `${(e.rate * 100).toFixed(2)}%`,
      sub: `${Math.round(e.errors)} ${m(R(`usage.overview.errors`))} · ${Math.round(e.msgs)} ${R(`usage.overview.messagesAbbrev`)}`,
    }));
}
function Xe(e, t) {
  return t === `utc` ? e.getUTCHours() : e.getHours();
}
function Ze(e, t) {
  return t === `utc` ? e.getUTCDay() : e.getDay();
}
function Qe(e, t) {
  let n = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e);
  if (!n || !Number.isInteger(t) || t < 0 || t > 95) return null;
  let [, r, i, a] = n,
    o = Number(r),
    s = Number(i),
    c = Number(a),
    l = new Date(Date.UTC(o, s - 1, c, 0, t * 15));
  return Number.isNaN(l.valueOf()) ||
    l.getUTCFullYear() !== o ||
    l.getUTCMonth() !== s - 1 ||
    l.getUTCDate() !== c
    ? null
    : l;
}
function $e(e, t, n) {
  let r = Qe(e, t);
  return r ? { hour: Xe(r, n), weekday: Ze(r, n) } : null;
}
function et(e, t) {
  let n = new Date(e);
  return (t === `utc` ? n.setUTCMinutes(59, 59, 999) : n.setMinutes(59, 59, 999), n);
}
function tt(e, t, n) {
  let r = e.usage?.utcQuarterHourTokenUsage;
  if (!r || r.length === 0) return !1;
  let i = !1;
  for (let e of r) {
    if (e.totalTokens <= 0) continue;
    let r = $e(e.date, e.quarterIndex, t);
    r && ((i = !0), n({ hour: r.hour, weekday: r.weekday, tokens: e.totalTokens }));
  }
  return i;
}
function nt(e, t, n) {
  let r = e.usage,
    i = r?.firstActivity ?? e.updatedAt,
    a = r?.lastActivity ?? e.updatedAt;
  if (!i || !a) return !1;
  let o = Math.min(i, a),
    s = Math.max(i, a),
    c = o;
  for (; c <= s;) {
    let e = new Date(c),
      r = Xe(e, n);
    if (t.includes(r)) return !0;
    let i = et(e, n);
    c = Math.min(i.getTime(), s) + 1;
  }
  return !1;
}
function rt(e, t, n) {
  if (t.length === 0) return !0;
  let r = !1;
  return tt(e, n, ({ hour: e }) => {
    t.includes(e) && (r = !0);
  })
    ? r
    : nt(e, t, n);
}
function it(e, t) {
  let n = Array.from({ length: 24 }, () => 0),
    r = Array.from({ length: 7 }, () => 0),
    i = 0,
    a = !1;
  for (let o of e) {
    let e = o.usage;
    if (!(!e || !e.totalTokens || e.totalTokens <= 0)) {
      if (
        ((i += e.totalTokens),
        tt(o, t, ({ hour: e, weekday: t, tokens: i }) => {
          ((n[e] = (n[e] ?? 0) + i), (r[t] = (r[t] ?? 0) + i));
        }))
      ) {
        a = !0;
        continue;
      }
      Je(o, t, ({ usage: e, hour: t, weekday: i, share: a }) => {
        ((n[t] = (n[t] ?? 0) + e.totalTokens * a), (r[i] = (r[i] ?? 0) + e.totalTokens * a));
      }) && (a = !0);
    }
  }
  let o = [
    R(`usage.mosaic.sun`),
    R(`usage.mosaic.mon`),
    R(`usage.mosaic.tue`),
    R(`usage.mosaic.wed`),
    R(`usage.mosaic.thu`),
    R(`usage.mosaic.fri`),
    R(`usage.mosaic.sat`),
  ].map((e, t) => ({ label: e, tokens: r[t] ?? 0 }));
  return { hasData: a, totalTokens: i, hourTotals: n, weekdayTotals: o };
}
function at(e, t, n, r) {
  let i = it(e, t);
  if (!i.hasData)
    return U(
      {
        title: R(`usage.mosaic.title`),
        description: R(`usage.mosaic.subtitleEmpty`),
        actions: u`
          <div class="usage-mosaic-total">
            ${W(0)} ${m(R(`usage.metrics.tokens`))}
          </div>
        `,
      },
      u`
        <div class="usage-panel usage-mosaic">
          <div class="usage-empty-block usage-empty-block--compact">
            ${R(`usage.mosaic.noTimelineData`)}
          </div>
        </div>
      `,
    );
  let a = Math.max(...i.hourTotals, 1),
    o = Math.max(...i.weekdayTotals.map((e) => e.tokens), 1);
  return U(
    {
      title: R(`usage.mosaic.title`),
      description: R(`usage.mosaic.subtitle`, {
        zone: R(t === `utc` ? `usage.filters.timeZoneUtc` : `usage.filters.timeZoneLocal`),
      }),
      actions: u`
        <div class="usage-mosaic-total">
          ${W(i.totalTokens)}
          ${m(R(`usage.metrics.tokens`))}
        </div>
      `,
    },
    u`
      <div class="usage-panel usage-mosaic">
        <div class="usage-mosaic-grid">
          <div class="usage-mosaic-section">
            <div class="usage-mosaic-section-title">${R(`usage.mosaic.dayOfWeek`)}</div>
            <div class="usage-daypart-grid">
              ${i.weekdayTotals.map((e) => {
                let t = Math.min(e.tokens / o, 1);
                return u`
                  <div class="usage-daypart-cell" style="background: ${e.tokens > 0 ? `color-mix(in srgb, var(--accent) ${(12 + t * 60).toFixed(1)}%, transparent)` : `transparent`};">
                    <div class="usage-daypart-label">${e.label}</div>
                    <div class="usage-daypart-value">${W(e.tokens)}</div>
                  </div>
                `;
              })}
            </div>
          </div>
          <div class="usage-mosaic-section">
            <div class="usage-mosaic-section-title">
              <span>${R(`usage.filters.hours`)}</span>
              <span class="usage-mosaic-sub">0 → 23</span>
            </div>
            <div class="usage-hour-grid">
              ${i.hourTotals.map((e, t) => {
                let i = Math.min(e / a, 1),
                  o =
                    e > 0
                      ? `color-mix(in srgb, var(--accent) ${(8 + i * 70).toFixed(1)}%, transparent)`
                      : `transparent`,
                  s = `${t}:00 · ${W(e)} ${m(R(`usage.metrics.tokens`))}`,
                  c =
                    i > 0.7
                      ? `color-mix(in srgb, var(--accent) 60%, transparent)`
                      : `color-mix(in srgb, var(--accent) 24%, transparent)`;
                return u`
                  <div
                    class="usage-hour-cell ${n.includes(t) ? `selected` : ``}"
                    style="background: ${o}; border-color: ${c};"
                    title="${s}"
                    @click=${(e) => r(t, e.shiftKey)}
                  ></div>
                `;
              })}
            </div>
            <div class="usage-hour-labels">
              <span>${R(`usage.mosaic.midnight`)}</span>
              <span>${R(`usage.mosaic.fourAm`)}</span>
              <span>${R(`usage.mosaic.eightAm`)}</span>
              <span>${R(`usage.mosaic.noon`)}</span>
              <span>${R(`usage.mosaic.fourPm`)}</span>
              <span>${R(`usage.mosaic.eightPm`)}</span>
            </div>
            <div class="usage-hour-legend">
              <span></span>
              ${R(`usage.mosaic.legend`)}
            </div>
          </div>
        </div>
      </div>
    `,
  );
}
function G(e, t = 2) {
  return `$${e.toFixed(t)}`;
}
function ot(e) {
  return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, `0`)}-${String(e.getDate()).padStart(2, `0`)}`;
}
function st(e) {
  let t = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e);
  if (!t) return null;
  let [, n, r, i] = t,
    a = Number(n),
    o = Number(r) - 1,
    s = Number(i),
    c = new Date(a, o, s);
  return Number.isNaN(c.valueOf()) ||
    c.getFullYear() !== a ||
    c.getMonth() !== o ||
    c.getDate() !== s
    ? null
    : c;
}
function ct(e) {
  let t = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e);
  if (!t) return null;
  let n = Number(t[1]),
    r = Number(t[2]),
    i = Number(t[3]),
    a = Date.UTC(n, r - 1, i),
    o = new Date(a);
  return o.getUTCFullYear() !== n || o.getUTCMonth() !== r - 1 || o.getUTCDate() !== i
    ? null
    : a / ht;
}
function lt(e) {
  return new Date(e * ht).toISOString().slice(0, 10);
}
function ut(e) {
  let t = st(e);
  return t ? t.toLocaleDateString(void 0, { month: `short`, day: `numeric` }) : e;
}
function dt(e) {
  let t = st(e);
  return t ? t.toLocaleDateString(void 0, { month: `long`, day: `numeric`, year: `numeric` }) : e;
}
function ft(e, t, n) {
  let r = ct(t),
    i = ct(n);
  if (r === null || i === null || r > i) return null;
  let a = gt();
  for (let t of e) {
    let e = ct(t.date);
    e !== null && e >= r && e <= i && _t(a, t);
  }
  return { days: i - r + 1, startDate: t, endDate: n, totals: a };
}
function pt(e, t, n, r = [1, 7, 30, 90]) {
  let i = ct(t),
    a = ct(n);
  if (i === null || a === null || i > a) return [];
  let o = a - i + 1;
  return Array.from(new Set(r.map((e) => Math.max(1, Math.trunc(e)))))
    .filter((e) => e < o)
    .toSorted((e, t) => e - t)
    .map((t) => ft(e, lt(a - t + 1), n))
    .filter((e) => e !== null);
}
var mt,
  ht,
  gt,
  _t,
  vt,
  yt,
  bt = e(() => {
    (d(),
      Ge(),
      ue(),
      oe(),
      A(),
      T(),
      (mt = 4),
      (ht = 864e5),
      (gt = () => ({
        input: 0,
        output: 0,
        cacheRead: 0,
        cacheWrite: 0,
        totalTokens: 0,
        totalCost: 0,
        inputCost: 0,
        outputCost: 0,
        cacheReadCost: 0,
        cacheWriteCost: 0,
        missingCostEntries: 0,
      })),
      (_t = (e, t) => {
        ((e.input += t.input ?? 0),
          (e.output += t.output ?? 0),
          (e.cacheRead += t.cacheRead ?? 0),
          (e.cacheWrite += t.cacheWrite ?? 0),
          (e.totalTokens += t.totalTokens ?? 0),
          (e.totalCost += t.totalCost ?? 0),
          (e.inputCost += t.inputCost ?? 0),
          (e.outputCost += t.outputCost ?? 0),
          (e.cacheReadCost += t.cacheReadCost ?? 0),
          (e.cacheWriteCost += t.cacheWriteCost ?? 0),
          (e.missingCostEntries += t.missingCostEntries ?? 0));
      }),
      (vt = (e, t) => {
        if (e.length === 0)
          return (
            t ?? {
              messages: {
                total: 0,
                user: 0,
                assistant: 0,
                toolCalls: 0,
                toolResults: 0,
                errors: 0,
              },
              tools: { totalCalls: 0, uniqueTools: 0, tools: [] },
              byModel: [],
              byProvider: [],
              byAgent: [],
              byChannel: [],
              daily: [],
            }
          );
        let n = { total: 0, user: 0, assistant: 0, toolCalls: 0, toolResults: 0, errors: 0 },
          r = new Map(),
          i = new Map(),
          a = new Map(),
          o = new Map(),
          s = new Map(),
          c = new Map(),
          l = new Map(),
          u = new Map(),
          d = { count: 0, sum: 0, min: 1 / 0, max: 0, p95Max: 0 };
        for (let t of e) {
          let e = t.usage;
          if (e) {
            if (
              (e.messageCounts &&
                ((n.total += e.messageCounts.total),
                (n.user += e.messageCounts.user),
                (n.assistant += e.messageCounts.assistant),
                (n.toolCalls += e.messageCounts.toolCalls),
                (n.toolResults += e.messageCounts.toolResults),
                (n.errors += e.messageCounts.errors)),
              e.toolUsage)
            )
              for (let t of e.toolUsage.tools) r.set(t.name, (r.get(t.name) ?? 0) + t.count);
            if (e.modelUsage)
              for (let t of e.modelUsage) {
                let e = `${t.provider ?? `unknown`}::${t.model ?? `unknown`}`,
                  n = i.get(e) ?? { provider: t.provider, model: t.model, count: 0, totals: gt() };
                ((n.count += t.count), _t(n.totals, t.totals), i.set(e, n));
                let r = t.provider ?? `unknown`,
                  o = a.get(r) ?? { provider: t.provider, model: void 0, count: 0, totals: gt() };
                ((o.count += t.count), _t(o.totals, t.totals), a.set(r, o));
              }
            if ((He(d, e.latency), t.agentId)) {
              let n = o.get(t.agentId) ?? gt();
              (_t(n, e), o.set(t.agentId, n));
            }
            if (t.channel) {
              let n = s.get(t.channel) ?? gt();
              (_t(n, e), s.set(t.channel, n));
            }
            for (let t of e.dailyBreakdown ?? []) {
              let e = c.get(t.date) ?? {
                date: t.date,
                tokens: 0,
                cost: 0,
                messages: 0,
                toolCalls: 0,
                errors: 0,
              };
              ((e.tokens += t.tokens), (e.cost += t.cost), c.set(t.date, e));
            }
            for (let t of e.dailyMessageCounts ?? []) {
              let e = c.get(t.date) ?? {
                date: t.date,
                tokens: 0,
                cost: 0,
                messages: 0,
                toolCalls: 0,
                errors: 0,
              };
              ((e.messages += t.total),
                (e.toolCalls += t.toolCalls),
                (e.errors += t.errors),
                c.set(t.date, e));
            }
            Ue(l, e.dailyLatency);
            for (let t of e.dailyModelUsage ?? []) {
              let e = `${t.date}::${t.provider ?? `unknown`}::${t.model ?? `unknown`}`,
                n = u.get(e) ?? {
                  date: t.date,
                  provider: t.provider,
                  model: t.model,
                  tokens: 0,
                  cost: 0,
                  count: 0,
                };
              ((n.tokens += t.tokens), (n.cost += t.cost), (n.count += t.count), u.set(e, n));
            }
          }
        }
        let f = We({
          byChannelMap: s,
          latencyTotals: d,
          dailyLatencyMap: l,
          modelDailyMap: u,
          dailyMap: c,
        });
        return {
          messages: n,
          tools: {
            totalCalls: Array.from(r.values()).reduce((e, t) => e + t, 0),
            uniqueTools: r.size,
            tools: Array.from(r.entries())
              .map(([e, t]) => ({ name: e, count: t }))
              .toSorted((e, t) => t.count - e.count),
          },
          byModel: Array.from(i.values()).toSorted(
            (e, t) => t.totals.totalCost - e.totals.totalCost,
          ),
          byProvider: Array.from(a.values()).toSorted(
            (e, t) => t.totals.totalCost - e.totals.totalCost,
          ),
          byAgent: Array.from(o.entries())
            .map(([e, t]) => ({ agentId: e, totals: t }))
            .toSorted((e, t) => t.totals.totalCost - e.totals.totalCost),
          ...f,
        };
      }),
      (yt = (e, t, n) => {
        let r = 0,
          i = 0;
        for (let t of e) {
          let e = t.usage?.durationMs ?? 0;
          e > 0 && ((r += e), (i += 1));
        }
        let a = i ? r / i : 0,
          o = t && r > 0 ? t.totalTokens / (r / 6e4) : void 0,
          s = t && r > 0 ? t.totalCost / (r / 6e4) : void 0,
          c = n.messages.total ? n.messages.errors / n.messages.total : 0,
          l;
        for (let e of n.daily) {
          if (e.messages <= 0 || e.errors <= 0) continue;
          let t = {
            date: e.date,
            errors: e.errors,
            messages: e.messages,
            rate: e.errors / e.messages,
          };
          (!l || t.rate > l.rate || (t.rate === l.rate && t.errors > l.errors)) && (l = t);
        }
        return {
          durationSumMs: r,
          durationCount: i,
          avgDurationMs: a,
          throughputTokensPerMin: o,
          throughputCostPerMin: s,
          errorRate: c,
          peakErrorDay: l,
        };
      }));
  });
function xt(e, t, n = `text/plain`) {
  let r = new Blob([t], { type: `${n};charset=utf-8` }),
    i = URL.createObjectURL(r),
    a = document.createElement(`a`);
  ((a.href = i), (a.download = e), a.click(), URL.revokeObjectURL(i));
}
function St(e) {
  return /[",\n]/.test(e) ? `"${e.replaceAll(`"`, `""`)}"` : e;
}
function Ct(e) {
  return e.map((e) => (e == null ? `` : St(String(e)))).join(`,`);
}
var wt,
  Tt,
  Et,
  Dt,
  K,
  Ot,
  kt,
  At,
  jt = e(() => {
    (ee(),
      T(),
      ze(),
      (wt = (e) => {
        let t = [
          Ct([
            `key`,
            `label`,
            `agentId`,
            `channel`,
            `provider`,
            `model`,
            `updatedAt`,
            `durationMs`,
            `messages`,
            `errors`,
            `toolCalls`,
            `inputTokens`,
            `outputTokens`,
            `cacheReadTokens`,
            `cacheWriteTokens`,
            `totalTokens`,
            `totalCost`,
          ]),
        ];
        for (let n of e) {
          let e = n.usage;
          t.push(
            Ct([
              n.key,
              n.label ?? ``,
              n.agentId ?? ``,
              n.channel ?? ``,
              n.modelProvider ?? n.providerOverride ?? ``,
              n.model ?? n.modelOverride ?? ``,
              g(n.updatedAt) ?? ``,
              e?.durationMs ?? ``,
              e?.messageCounts?.total ?? ``,
              e?.messageCounts?.errors ?? ``,
              e?.messageCounts?.toolCalls ?? ``,
              e?.input ?? ``,
              e?.output ?? ``,
              e?.cacheRead ?? ``,
              e?.cacheWrite ?? ``,
              e?.totalTokens ?? ``,
              e?.totalCost ?? ``,
            ]),
          );
        }
        return t.join(`
`);
      }),
      (Tt = (e) => {
        let t = [
          Ct([
            `date`,
            `inputTokens`,
            `outputTokens`,
            `cacheReadTokens`,
            `cacheWriteTokens`,
            `totalTokens`,
            `inputCost`,
            `outputCost`,
            `cacheReadCost`,
            `cacheWriteCost`,
            `totalCost`,
          ]),
        ];
        for (let n of e)
          t.push(
            Ct([
              n.date,
              n.input,
              n.output,
              n.cacheRead,
              n.cacheWrite,
              n.totalTokens,
              n.inputCost ?? ``,
              n.outputCost ?? ``,
              n.cacheReadCost ?? ``,
              n.cacheWriteCost ?? ``,
              n.totalCost,
            ]),
          );
        return t.join(`
`);
      }),
      (Et = (e, t, n) => {
        let r = e.trim();
        if (!r) return [];
        let i = (r.length ? r.split(/\s+/) : []).at(-1) ?? ``,
          [a, o] = i.includes(`:`)
            ? [i.slice(0, i.indexOf(`:`)), i.slice(i.indexOf(`:`) + 1)]
            : [``, ``],
          s = m(a),
          c = m(o),
          l = (e) => b(e.filter((e) => !!e)),
          u = l(t.map((e) => e.agentId)).slice(0, 6),
          d = l(t.map((e) => e.channel)).slice(0, 6),
          f = l([
            ...t.map((e) => e.modelProvider),
            ...t.map((e) => e.providerOverride),
            ...(n?.byProvider.map((e) => e.provider) ?? []),
          ]).slice(0, 6),
          p = l([...t.map((e) => e.model), ...(n?.byModel.map((e) => e.model) ?? [])]).slice(0, 6),
          h = l(n?.tools.tools.map((e) => e.name) ?? []).slice(0, 6);
        if (!s)
          return [
            { label: `agent:`, value: `agent:` },
            { label: `channel:`, value: `channel:` },
            { label: `provider:`, value: `provider:` },
            { label: `model:`, value: `model:` },
            { label: `tool:`, value: `tool:` },
            { label: `has:errors`, value: `has:errors` },
            { label: `has:tools`, value: `has:tools` },
            { label: `minTokens:`, value: `minTokens:` },
            { label: `maxCost:`, value: `maxCost:` },
          ];
        let g = [],
          _ = (e, t) => {
            for (let n of t)
              (!c || m(n).includes(c)) && g.push({ label: `${e}:${n}`, value: `${e}:${n}` });
          };
        switch (s) {
          case `agent`:
            _(`agent`, u);
            break;
          case `channel`:
            _(`channel`, d);
            break;
          case `provider`:
            _(`provider`, f);
            break;
          case `model`:
            _(`model`, p);
            break;
          case `tool`:
            _(`tool`, h);
            break;
          case `has`:
            [`errors`, `tools`, `context`, `usage`, `model`, `provider`].forEach((e) => {
              (!c || e.includes(c)) && g.push({ label: `has:${e}`, value: `has:${e}` });
            });
            break;
          default:
            break;
        }
        return g;
      }),
      (Dt = (e, t) => {
        let n = e.trim();
        if (!n) return `${t} `;
        let r = n.split(/\s+/);
        return ((r[r.length - 1] = t), `${r.join(` `)} `);
      }),
      (K = (e) => m(e)),
      (Ot = (e, t) => {
        let n = e.trim();
        if (!n) return `${t} `;
        let r = n.split(/\s+/),
          i = r[r.length - 1] ?? ``,
          a = t.includes(`:`) ? t.split(`:`)[0] : null,
          o = i.includes(`:`) ? i.split(`:`)[0] : null;
        return i.endsWith(`:`) && a && o === a
          ? ((r[r.length - 1] = t), `${r.join(` `)} `)
          : r.includes(t)
            ? `${r.join(` `)} `
            : `${r.join(` `)} ${t} `;
      }),
      (kt = (e, t) => {
        let n = e
          .trim()
          .split(/\s+/)
          .filter(Boolean)
          .filter((e) => e !== t);
        return n.length ? `${n.join(` `)} ` : ``;
      }),
      (At = (e, t, n) => {
        let r = K(t),
          i = [
            ...De(e)
              .filter((e) => K(e.key ?? ``) !== r)
              .map((e) => e.raw),
            ...n.map((e) => `${t}:${e}`),
          ];
        return i.length ? `${i.join(` `)} ` : ``;
      }));
  });
function q(e, t) {
  return t === 0 ? 0 : (e / t) * 100;
}
function J(e) {
  let t = Math.abs(e);
  return G(e, t === 0 || t >= 0.01 ? 2 : t >= 1e-4 ? 4 : 6);
}
function Mt(e, t, n) {
  (e.key !== `Enter` && e.key !== ` `) || (e.preventDefault(), n(t, e.shiftKey));
}
function Nt(e) {
  let t = e.totalCost || 0;
  return {
    input: { tokens: e.input, cost: e.inputCost || 0, pct: q(e.inputCost || 0, t) },
    output: { tokens: e.output, cost: e.outputCost || 0, pct: q(e.outputCost || 0, t) },
    cacheRead: { tokens: e.cacheRead, cost: e.cacheReadCost || 0, pct: q(e.cacheReadCost || 0, t) },
    cacheWrite: {
      tokens: e.cacheWrite,
      cost: e.cacheWriteCost || 0,
      pct: q(e.cacheWriteCost || 0, t),
    },
    totalCost: t,
  };
}
function Pt(e, t, n, r, i, a, o, s) {
  if (!(e.length > 0 || t.length > 0 || n.length > 0)) return f;
  let c = n.at(0) ?? ``,
    l = n.length === 1 ? r.find((e) => e.key === c) : null,
    d = l
      ? _(l.label || l.key, 20) + ((l.label || l.key).length > 20 ? `…` : ``)
      : n.length === 1
        ? c.slice(0, 8) + `…`
        : R(`usage.filters.sessionsCount`, { count: String(n.length) }),
    p = l ? l.label || l.key : n.length === 1 ? c : n.join(`, `),
    m = e.length === 1 ? e[0] : R(`usage.filters.daysCount`, { count: String(e.length) }),
    h = t.length === 1 ? `${t[0]}:00` : R(`usage.filters.hoursCount`, { count: String(t.length) });
  return u`
    <div class="active-filters">
      ${
        e.length > 0
          ? u`
            <div class="filter-chip">
              <span class="filter-chip-label">${R(`usage.filters.days`)}: ${m}</span>
              <openclaw-tooltip .content=${R(`usage.filters.remove`)}>
                <button
                  class="filter-chip-remove"
                  @click=${i}
                  aria-label=${R(`usage.filters.removeDays`)}
                >
                  ×
                </button>
              </openclaw-tooltip>
            </div>
          `
          : f
      }
      ${
        t.length > 0
          ? u`
            <div class="filter-chip">
              <span class="filter-chip-label">${R(`usage.filters.hours`)}: ${h}</span>
              <openclaw-tooltip .content=${R(`usage.filters.remove`)}>
                <button
                  class="filter-chip-remove"
                  @click=${a}
                  aria-label=${R(`usage.filters.removeHours`)}
                >
                  ×
                </button>
              </openclaw-tooltip>
            </div>
          `
          : f
      }
      ${
        n.length > 0
          ? u`
            <div class="filter-chip" title="${p}">
              <span class="filter-chip-label">${R(`usage.filters.session`)}: ${d}</span>
              <openclaw-tooltip .content=${R(`usage.filters.remove`)}>
                <button
                  class="filter-chip-remove"
                  @click=${o}
                  aria-label=${R(`usage.filters.removeSession`)}
                >
                  ×
                </button>
              </openclaw-tooltip>
            </div>
          `
          : f
      }
      ${
        (e.length > 0 || t.length > 0) && n.length > 0
          ? u`
            <button class="btn btn--sm" @click=${s}>
              ${R(`usage.filters.clearAll`)}
            </button>
          `
          : f
      }
    </div>
  `;
}
function Ft(e, t, n) {
  let r = ft(e, t, n);
  if (!r || e.length === 0) return f;
  let i = pt(e, t, n),
    a = ot(new Date()),
    o = (e, t) =>
      e === 1
        ? t === a
          ? R(`usage.presets.today`)
          : ut(t)
        : R(`usage.costWindows.lastDays`, { count: String(e) }),
    s = [
      { label: R(`usage.costWindows.selectedRange`), summary: r, range: !0 },
      ...i.map((e) => ({ label: o(e.days, e.endDate), summary: e, range: !1 })),
    ];
  return u`
    <section class="cost-window-analysis">
      <div class="cost-window-header">
        <div>
          <div class="card-title usage-section-title">${R(`usage.costWindows.title`)}</div>
          <div class="card-sub">
            ${R(`usage.costWindows.subtitle`, { date: dt(n) })}
          </div>
        </div>
        <div class="cost-window-range-label">
          ${ut(t)} – ${ut(n)}
        </div>
      </div>
      <div class="cost-window-grid">
        ${s.map(({ label: e, summary: t, range: n }) => {
          let r = t.totals.totalCost / t.days;
          return u`
            <div class="cost-window-card ${n ? `cost-window-card--range` : ``}">
              <div class="cost-window-card__label">${e}</div>
              <div class="cost-window-card__value">
                ${J(t.totals.totalCost)}
              </div>
              <div class="cost-window-card__meta">
                ${W(t.totals.totalTokens)} ${R(`usage.metrics.tokens`)} ·
                ${J(r)} ${R(`usage.costWindows.perDay`)}
              </div>
            </div>
          `;
        })}
      </div>
    </section>
  `;
}
function It(e, t, n, r, i, a) {
  if (!e.length)
    return u`
      <div class="daily-chart-compact">
        <div class="card-title usage-section-title">${R(`usage.daily.title`)}</div>
        <div class="usage-empty-block">${R(`usage.empty.noData`)}</div>
      </div>
    `;
  let o = n === `tokens`,
    s = e.map((e) => (o ? e.totalTokens : e.totalCost)),
    c = Math.max(...s, 0),
    l = c > 0 ? c : o ? 1 : 1e-4,
    d = s.filter((e) => e > 0),
    p = l / (d.length > 0 ? Math.min(...d) : l) > 50,
    h = s.map((e) => {
      if (e <= 0) return 0;
      let t = p ? Math.sqrt(e / l) : e / l;
      return Math.max(6, t * 200);
    }),
    g = e.length > 30 ? 12 : e.length > 20 ? 18 : e.length > 14 ? 24 : 32,
    _ = e.length <= 14,
    y = new Set(t);
  return u`
    <div class="daily-chart-compact">
      <div class="daily-chart-header">
        <div class="chart-toggle small sessions-toggle">
          <button
            class="btn btn--sm toggle-btn ${r === `total` ? `active` : ``}"
            @click=${() => i(`total`)}
          >
            ${R(`usage.daily.total`)}
          </button>
          <button
            class="btn btn--sm toggle-btn ${r === `by-type` ? `active` : ``}"
            @click=${() => i(`by-type`)}
          >
            ${R(`usage.daily.byType`)}
          </button>
        </div>
        <div class="card-title">
          ${R(o ? `usage.daily.tokensTitle` : `usage.daily.costTitle`)}
          ${
            p
              ? u`<span
                class="daily-chart-scale-badge"
                title=${R(`usage.daily.compressedScaleHint`)}
                aria-label=${R(`usage.daily.compressedScaleHint`)}
                >√</span
              >`
              : f
          }
        </div>
      </div>
      <div class="daily-chart">
        <div class="daily-chart-plot">
          <div class="daily-chart-scale" aria-hidden="true">
            ${
              c > 0
                ? u`
                  <span
                    >${o ? W(c) : J(c)}</span
                  >
                  <span
                    >${o ? W(p ? c / 4 : c / 2) : J(p ? c / 4 : c / 2)}</span
                  >
                  <span>${o ? W(0) : G(0)}</span>
                `
                : u`<span>${o ? W(0) : G(0)}</span>`
            }
          </div>
          <div class="daily-chart-bars" style="--bar-max-width: ${g}px">
            ${e.map((t, n) => {
              let i = v(h[n], `daily usage bar height`),
                s = y.has(t.date),
                c = ut(t.date),
                l = e.length > 20 ? String(Number.parseInt(t.date.slice(8), 10)) : c,
                d = e.length > 20 ? `daily-bar-label daily-bar-label--compact` : `daily-bar-label`,
                f =
                  r === `by-type`
                    ? o
                      ? [
                          { value: t.output, class: `output` },
                          { value: t.input, class: `input` },
                          { value: t.cacheWrite, class: `cache-write` },
                          { value: t.cacheRead, class: `cache-read` },
                        ]
                      : [
                          { value: t.outputCost ?? 0, class: `output` },
                          { value: t.inputCost ?? 0, class: `input` },
                          { value: t.cacheWriteCost ?? 0, class: `cache-write` },
                          { value: t.cacheReadCost ?? 0, class: `cache-read` },
                        ]
                    : [],
                p =
                  r === `by-type`
                    ? o
                      ? [
                          `${R(`usage.breakdown.output`)} ${W(t.output)}`,
                          `${R(`usage.breakdown.input`)} ${W(t.input)}`,
                          `${R(`usage.breakdown.cacheWrite`)} ${W(t.cacheWrite)}`,
                          `${R(`usage.breakdown.cacheRead`)} ${W(t.cacheRead)}`,
                        ]
                      : [
                          `${R(`usage.breakdown.output`)} ${J(t.outputCost ?? 0)}`,
                          `${R(`usage.breakdown.input`)} ${J(t.inputCost ?? 0)}`,
                          `${R(`usage.breakdown.cacheWrite`)} ${J(t.cacheWriteCost ?? 0)}`,
                          `${R(`usage.breakdown.cacheRead`)} ${J(t.cacheReadCost ?? 0)}`,
                        ]
                    : [],
                g = o ? W(t.totalTokens) : J(t.totalCost),
                b = {
                  dateLabel: dt(t.date),
                  tokensLabel: `${W(t.totalTokens)} ${m(R(`usage.metrics.tokens`))}`.trim(),
                  costLabel: J(t.totalCost),
                  breakdownLines: p,
                };
              return u`
                <openclaw-tooltip
                  .content=${[b.dateLabel, b.tokensLabel, b.costLabel, ...b.breakdownLines].join(`
`)}
                >
                  <div
                    class="daily-bar-wrapper ${s ? `selected` : ``}"
                    role="button"
                    tabindex="0"
                    aria-pressed=${s ? `true` : `false`}
                    aria-label=${`${b.dateLabel}: ${b.tokensLabel}, ${b.costLabel}`}
                    @keydown=${(e) => Mt(e, t.date, a)}
                    @click=${(e) => a(t.date, e.shiftKey)}
                  >
                    ${
                      r === `by-type`
                        ? u`
                          <div
                            class="daily-bar daily-bar--stacked"
                            style="height: ${i.toFixed(0)}px;"
                          >
                            ${(() => {
                              let e = f.reduce((e, t) => e + t.value, 0) || 1;
                              return f.map(
                                (t) => u`
                                  <div
                                    class="cost-segment ${t.class}"
                                    style="height: ${(t.value / e) * 100}%"
                                  ></div>
                                `,
                              );
                            })()}
                          </div>
                        `
                        : u`
                          <div class="daily-bar" style="height: ${i.toFixed(0)}px"></div>
                        `
                    }
                    ${
                      _
                        ? u`<div class="daily-bar-total">${g}</div>`
                        : u`<div
                          class="daily-bar-total daily-bar-total--placeholder"
                          aria-hidden="true"
                        ></div>`
                    }
                    <div class="${d}">${l}</div>
                  </div>
                </openclaw-tooltip>
              `;
            })}
          </div>
        </div>
      </div>
    </div>
  `;
}
function Lt(e, t) {
  let n = Nt(e),
    r = t === `tokens`,
    i = e.totalTokens || 1,
    a = {
      output: q(e.output, i),
      input: q(e.input, i),
      cacheWrite: q(e.cacheWrite, i),
      cacheRead: q(e.cacheRead, i),
    };
  return u`
    <div class="cost-breakdown cost-breakdown-compact">
      <div class="cost-breakdown-header">
        ${R(r ? `usage.breakdown.tokensByType` : `usage.breakdown.costByType`)}
      </div>
      <div class="cost-breakdown-bar">
        <div
          class="cost-segment output"
          style="width: ${(r ? a.output : n.output.pct).toFixed(1)}%"
          title="${R(`usage.breakdown.output`)}: ${r ? W(e.output) : J(n.output.cost)}"
        ></div>
        <div
          class="cost-segment input"
          style="width: ${(r ? a.input : n.input.pct).toFixed(1)}%"
          title="${R(`usage.breakdown.input`)}: ${r ? W(e.input) : J(n.input.cost)}"
        ></div>
        <div
          class="cost-segment cache-write"
          style="width: ${(r ? a.cacheWrite : n.cacheWrite.pct).toFixed(1)}%"
          title="${R(`usage.breakdown.cacheWrite`)}: ${r ? W(e.cacheWrite) : J(n.cacheWrite.cost)}"
        ></div>
        <div
          class="cost-segment cache-read"
          style="width: ${(r ? a.cacheRead : n.cacheRead.pct).toFixed(1)}%"
          title="${R(`usage.breakdown.cacheRead`)}: ${r ? W(e.cacheRead) : J(n.cacheRead.cost)}"
        ></div>
      </div>
      <div class="cost-breakdown-legend">
        <span class="legend-item"
          ><span class="legend-dot output"></span>${R(`usage.breakdown.output`)}
          ${r ? W(e.output) : J(n.output.cost)}</span
        >
        <span class="legend-item"
          ><span class="legend-dot input"></span>${R(`usage.breakdown.input`)}
          ${r ? W(e.input) : J(n.input.cost)}</span
        >
        <span class="legend-item"
          ><span class="legend-dot cache-write"></span>${R(`usage.breakdown.cacheWrite`)}
          ${r ? W(e.cacheWrite) : J(n.cacheWrite.cost)}</span
        >
        <span class="legend-item"
          ><span class="legend-dot cache-read"></span>${R(`usage.breakdown.cacheRead`)}
          ${r ? W(e.cacheRead) : J(n.cacheRead.cost)}</span
        >
      </div>
      <div class="cost-breakdown-total">
        ${R(`usage.breakdown.total`)}:
        ${r ? W(e.totalTokens) : J(e.totalCost)}
      </div>
    </div>
  `;
}
function Rt(e, t, n) {
  return u`
    <div class="usage-insight-card">
      <div class="usage-insight-title">${e}</div>
      ${
        t.length === 0
          ? u`<div class="muted">${n}</div>`
          : u`
            <div class="usage-list">
              ${t.map(
                (e) => u`
                  <div class="usage-list-item">
                    <span>${e.label}</span>
                    <span class="usage-list-value">
                      <span>${e.value}</span>
                      ${e.sub ? u`<span class="usage-list-sub">${e.sub}</span>` : f}
                    </span>
                  </div>
                `,
              )}
            </div>
          `
      }
    </div>
  `;
}
function zt(e, t, n, r) {
  let i = [`usage-insight-card`, r?.className].filter(Boolean).join(` `),
    a = [`usage-error-list`, r?.listClassName].filter(Boolean).join(` `);
  return u`
    <div class=${i}>
      <div class="usage-insight-title">${e}</div>
      ${
        t.length === 0
          ? u`<div class="muted">${n}</div>`
          : u`
            <div class=${a}>
              ${t.map(
                (e) => u`
                  <div class="usage-error-row">
                    <div class="usage-error-date">${e.label}</div>
                    <div class="usage-error-rate">${e.value}</div>
                    ${e.sub ? u`<div class="usage-error-sub">${e.sub}</div>` : f}
                  </div>
                `,
              )}
            </div>
          `
      }
    </div>
  `;
}
function Y(e) {
  let t = [`stat`, `usage-summary-card`, e.className, e.tone ? `usage-summary-card--${e.tone}` : ``]
      .filter(Boolean)
      .join(` `),
    n = [
      `stat-value`,
      `usage-summary-value`,
      e.tone ?? ``,
      e.compactValue ? `usage-summary-value--compact` : ``,
    ]
      .filter(Boolean)
      .join(` `);
  return u`
    <div class=${t}>
      <div class="usage-summary-title">
        ${e.title}
        <span class="usage-summary-hint" title=${e.hint}>?</span>
      </div>
      <div class=${n}>${e.value}</div>
      <div class="usage-summary-sub">${e.sub}</div>
    </div>
  `;
}
function Bt(e, t, n, r, a, o, s, c) {
  if (!e) return f;
  let l = t.messages.total ? Math.round(e.totalTokens / t.messages.total) : 0,
    d = t.messages.total ? e.totalCost / t.messages.total : 0,
    p = e.input + e.cacheRead + e.cacheWrite,
    h = p > 0 ? e.cacheRead / p : 0,
    g = p > 0 ? `${(h * 100).toFixed(1)}%` : R(`usage.common.emptyValue`),
    _ = n.errorRate * 100,
    v =
      n.throughputTokensPerMin === void 0
        ? R(`usage.common.emptyValue`)
        : `${W(Math.round(n.throughputTokensPerMin))} ${R(`usage.overview.tokensPerMinute`)}`,
    y =
      n.throughputCostPerMin === void 0
        ? R(`usage.common.emptyValue`)
        : `${J(n.throughputCostPerMin)} ${R(`usage.overview.perMinute`)}`,
    b =
      n.durationCount > 0
        ? (i(n.avgDurationMs, { spaced: !0 }) ?? R(`usage.common.emptyValue`))
        : R(`usage.common.emptyValue`),
    ee = R(`usage.overview.cacheHint`),
    x = R(`usage.overview.errorHint`),
    S = R(`usage.overview.throughputHint`),
    te = R(`usage.overview.avgTokensHint`),
    C = R(r ? `usage.overview.avgCostHintMissing` : `usage.overview.avgCostHint`),
    w = t.daily
      .filter((e) => e.messages > 0 && e.errors > 0)
      .map((e) => {
        let t = e.errors / e.messages;
        return {
          label: ut(e.date),
          value: `${(t * 100).toFixed(2)}%`,
          sub: `${e.errors} ${m(R(`usage.overview.errors`))} · ${e.messages} ${R(`usage.overview.messagesAbbrev`)} · ${W(e.tokens)}`,
          rate: t,
        };
      })
      .toSorted((e, t) => t.rate - e.rate)
      .slice(0, 5)
      .map(({ rate: e, ...t }) => t),
    T = (t) =>
      a && e.totalCost > 0
        ? R(`usage.overview.costShare`, { percent: ((t / e.totalCost) * 100).toFixed(1) })
        : null,
    E = (e, t, n) =>
      [T(e), W(t), n === void 0 ? null : `${n} ${R(`usage.overview.messagesAbbrev`)}`]
        .filter((e) => e !== null)
        .join(` · `),
    ne = t.byModel
      .slice(0, 5)
      .map((e) => ({
        label: e.model ?? R(`usage.common.unknown`),
        value: J(e.totals.totalCost),
        sub: E(e.totals.totalCost, e.totals.totalTokens, e.count),
      })),
    D = t.byProvider
      .slice(0, 5)
      .map((e) => ({
        label: e.provider ?? R(`usage.common.unknown`),
        value: J(e.totals.totalCost),
        sub: E(e.totals.totalCost, e.totals.totalTokens, e.count),
      })),
    O = t.tools.tools
      .slice(0, 6)
      .map((e) => ({ label: e.name, value: `${e.count}`, sub: R(`usage.overview.calls`) })),
    k = t.byAgent
      .slice(0, 5)
      .map((e) => ({
        label: e.agentId,
        value: J(e.totals.totalCost),
        sub: E(e.totals.totalCost, e.totals.totalTokens),
      })),
    A = t.byChannel
      .slice(0, 5)
      .map((e) => ({
        label: e.channel,
        value: J(e.totals.totalCost),
        sub: E(e.totals.totalCost, e.totals.totalTokens),
      }));
  return U(
    { title: R(`usage.overview.title`) },
    u`
      <section class="usage-panel usage-overview-card">
        <div class="usage-overview-layout">
          <div class="usage-summary-grid">
            ${Y({ title: R(`usage.overview.messages`), hint: R(`usage.overview.messagesHint`), value: t.messages.total, sub: `${t.messages.user} ${m(R(`usage.overview.user`))} · ${t.messages.assistant} ${m(R(`usage.overview.assistant`))}`, className: `usage-summary-card--hero` })}
            ${Y({ title: R(`usage.overview.throughput`), hint: S, value: v, sub: y, className: `usage-summary-card--hero usage-summary-card--throughput`, compactValue: !0 })}
            ${Y({ title: R(`usage.overview.toolCalls`), hint: R(`usage.overview.toolCallsHint`), value: t.tools.totalCalls, sub: `${t.tools.uniqueTools} ${R(`usage.overview.toolsUsed`)}`, className: `usage-summary-card--half` })}
            ${Y({ title: R(`usage.overview.avgTokens`), hint: te, value: W(l), sub: R(`usage.overview.acrossMessages`, { count: String(t.messages.total || 0) }), className: `usage-summary-card--half` })}
            ${Y({ title: R(`usage.overview.cacheHitRate`), hint: ee, value: g, sub: `${W(e.cacheRead)} ${R(`usage.overview.cached`)} · ${W(p)} ${R(`usage.overview.prompt`)}`, tone: h > 0.6 ? `good` : h > 0.3 ? `warn` : `bad`, className: `usage-summary-card--medium` })}
            ${Y({ title: R(`usage.overview.errorRate`), hint: x, value: `${_.toFixed(2)}%`, sub: `${t.messages.errors} ${m(R(`usage.overview.errors`))} · ${b} ${R(`usage.overview.avgSession`)}`, tone: _ > 5 ? `bad` : _ > 1 ? `warn` : `good`, className: `usage-summary-card--medium` })}
            ${Y({ title: R(`usage.overview.avgCost`), hint: C, value: J(d), sub: `${J(e.totalCost)} ${m(R(`usage.breakdown.total`))}`, className: `usage-summary-card--compact` })}
            ${Y({ title: R(`usage.overview.sessions`), hint: R(`usage.overview.sessionsHint`), value: s, sub: R(`usage.overview.sessionsInRange`, { count: String(c) }), className: `usage-summary-card--compact` })}
            ${Y({ title: R(`usage.overview.errors`), hint: R(`usage.overview.errorsHint`), value: t.messages.errors, sub: `${t.messages.toolResults} ${R(`usage.overview.toolResults`)}`, className: `usage-summary-card--compact` })}
          </div>
          <div class="usage-insights-grid">
            ${Rt(R(`usage.overview.topModels`), ne, R(`usage.overview.noModelData`))}
            ${Rt(R(`usage.overview.topProviders`), D, R(`usage.overview.noProviderData`))}
            ${Rt(R(`usage.overview.topTools`), O, R(`usage.overview.noToolCalls`))}
            ${Rt(R(`usage.overview.topAgents`), k, R(`usage.overview.noAgentData`))}
            ${Rt(R(`usage.overview.topChannels`), A, R(`usage.overview.noChannelData`))}
            ${zt(R(`usage.overview.peakErrorDays`), w, R(`usage.overview.noErrorData`))}
            ${zt(R(`usage.overview.peakErrorHours`), o, R(`usage.overview.noErrorData`), { className: `usage-insight-card--wide`, listClassName: `usage-error-list--hours` })}
          </div>
        </div>
      </section>
    `,
  );
}
function Vt(e, t, n, r, a, o, s, c, l, d, p, h, g, _, v) {
  let y = (e) => g.includes(e),
    b = (e) => {
      let t = e.label || e.key;
      return t.startsWith(`agent:`) && t.includes(`?token=`) ? t.slice(0, t.indexOf(`?token=`)) : t;
    },
    ee = async (e) => {
      await V(b(e));
    },
    x = (e) => {
      let t = [];
      return (
        y(`channel`) && e.channel && t.push(`channel:${e.channel}`),
        y(`agent`) && e.agentId && t.push(`agent:${e.agentId}`),
        y(`provider`) &&
          (e.modelProvider || e.providerOverride) &&
          t.push(`provider:${e.modelProvider ?? e.providerOverride}`),
        y(`model`) && e.model && t.push(`model:${e.model}`),
        y(`messages`) && e.usage?.messageCounts && t.push(`msgs:${e.usage.messageCounts.total}`),
        y(`tools`) && e.usage?.toolUsage && t.push(`tools:${e.usage.toolUsage.totalCalls}`),
        y(`errors`) && e.usage?.messageCounts && t.push(`errors:${e.usage.messageCounts.errors}`),
        y(`duration`) &&
          e.usage?.durationMs &&
          t.push(`dur:${i(e.usage.durationMs, { spaced: !0 }) ?? `—`}`),
        t
      );
    },
    S = new Set(n),
    te = (e, t) => {
      let n = e.usage;
      return n
        ? S.size > 0 && n.dailyBreakdown && n.dailyBreakdown.length > 0
          ? n.dailyBreakdown.reduce(
              (e, n) => (S.has(n.date) ? e + (t === `tokens` ? n.tokens : n.cost) : e),
              0,
            )
          : t === `tokens`
            ? (n.totalTokens ?? 0)
            : (n.totalCost ?? 0)
        : 0;
    },
    C = (e) => te(e, r ? `tokens` : `cost`),
    w = (e) => {
      switch (a) {
        case `recent`:
          return e.updatedAt ?? 0;
        case `messages`:
          return e.usage?.messageCounts?.total ?? 0;
        case `errors`:
          return e.usage?.messageCounts?.errors ?? 0;
        case `cost`:
          return te(e, `cost`);
        case `tokens`:
          return te(e, `tokens`);
      }
      return a;
    },
    T = [...e].toSorted((e, t) => {
      let n = w(t) - w(e);
      if (n !== 0) return n;
      let r = (t.updatedAt ?? 0) - (e.updatedAt ?? 0);
      return r === 0 ? b(e).localeCompare(b(t)) : r;
    }),
    E = o === `asc` ? T.toReversed() : T,
    ne = E.reduce((e, t) => e + C(t), 0),
    D = E.length ? ne / E.length : 0,
    O = E.reduce((e, t) => e + (t.usage?.messageCounts?.errors ?? 0), 0),
    k = (e, t) => {
      let n = C(e),
        i = b(e),
        a = x(e);
      return u`
      <div
        class="session-bar-row ${t ? `selected` : ``}"
        @click=${(t) => l(e.key, t.shiftKey)}
        title="${e.key}"
      >
        <div class="session-bar-label">
          <div class="session-bar-title">${i}</div>
          ${a.length > 0 ? u`<div class="session-bar-meta">${a.join(` · `)}</div>` : f}
        </div>
        <div class="session-bar-actions">
          <button
            class="btn btn--sm btn--ghost"
            @click=${(t) => {
              (t.stopPropagation(), ee(e));
            }}
          >
            ${R(`usage.sessions.copy`)}
          </button>
          <div class="session-bar-value">
            ${r ? W(n) : J(n)}
          </div>
        </div>
      </div>
    `;
    },
    A = new Set(t),
    j = E.filter((e) => A.has(e.key)),
    M = j.length,
    N = new Map(E.map((e) => [e.key, e])),
    re = s.map((e) => N.get(e)).filter((e) => !!e);
  return U(
    { title: R(`usage.sessions.title`) },
    u`
      <div class="usage-panel sessions-card">
        <div class="sessions-card-header">
          <div class="sessions-card-count">
            ${R(`usage.sessions.shown`, { count: String(e.length) })}
            ${_ === e.length ? `` : ` · ${R(`usage.sessions.total`, { count: String(_) })}`}
          </div>
        </div>
        <div class="sessions-card-meta">
          <div class="sessions-card-stats">
            <span>
              ${r ? W(D) : J(D)}
              ${R(`usage.sessions.avg`)}
            </span>
            <span
              >${O} ${m(R(`usage.overview.errors`))}</span
            >
          </div>
          <div class="chart-toggle small">
            <button
              class="btn btn--sm toggle-btn ${c === `all` ? `active` : ``}"
              @click=${() => h(`all`)}
            >
              ${R(`usage.sessions.all`)}
            </button>
            <button
              class="btn btn--sm toggle-btn ${c === `recent` ? `active` : ``}"
              @click=${() => h(`recent`)}
            >
              ${R(`usage.sessions.recent`)}
            </button>
          </div>
          <label class="sessions-sort">
            <span>${R(`usage.sessions.sort`)}</span>
            <select
              class="settings-select"
              @change=${(e) => d(e.target.value)}
            >
              <option value="cost" ?selected=${a === `cost`}>
                ${R(`usage.metrics.cost`)}
              </option>
              <option value="errors" ?selected=${a === `errors`}>
                ${R(`usage.overview.errors`)}
              </option>
              <option value="messages" ?selected=${a === `messages`}>
                ${R(`usage.overview.messages`)}
              </option>
              <option value="recent" ?selected=${a === `recent`}>
                ${R(`usage.sessions.recentShort`)}
              </option>
              <option value="tokens" ?selected=${a === `tokens`}>
                ${R(`usage.metrics.tokens`)}
              </option>
            </select>
          </label>
          <openclaw-tooltip
            .content=${R(o === `desc` ? `usage.sessions.descending` : `usage.sessions.ascending`)}
          >
            <button
              class="btn btn--sm"
              aria-label=${R(o === `desc` ? `usage.sessions.descending` : `usage.sessions.ascending`)}
              @click=${() => p(o === `desc` ? `asc` : `desc`)}
            >
              ${o === `desc` ? `↓` : `↑`}
            </button>
          </openclaw-tooltip>
          ${
            M > 0
              ? u`
                <button class="btn btn--sm" @click=${v}>
                  ${R(`usage.sessions.clearSelection`)}
                </button>
              `
              : f
          }
        </div>
        ${
          c === `recent`
            ? re.length === 0
              ? u` <div class="usage-empty-block">${R(`usage.sessions.noRecent`)}</div> `
              : u`
                <div class="session-bars session-bars--recent">
                  ${re.map((e) => k(e, A.has(e.key)))}
                </div>
              `
            : e.length === 0
              ? u` <div class="usage-empty-block">${R(`usage.sessions.noneInRange`)}</div> `
              : u`
                <div class="session-bars">
                  ${E.slice(0, 50).map((e) => k(e, A.has(e.key)))}
                  ${
                    e.length > 50
                      ? u`
                        <div class="usage-more-sessions">
                          ${R(`usage.sessions.more`, { count: String(e.length - 50) })}
                        </div>
                      `
                      : f
                  }
                </div>
              `
        }
        ${
          M > 1
            ? u`
              <div class="sessions-selected-group">
                <div class="sessions-card-count">
                  ${R(`usage.sessions.selected`, { count: String(M) })}
                </div>
                <div class="session-bars session-bars--selected">
                  ${j.map((e) => k(e, !0))}
                </div>
              </div>
            `
            : f
        }
      </div>
    `,
  );
}
var Ht = e(() => {
  (h(), y(), d(), r(), ue(), oe(), z(), H(), T(), bt());
});
function X(e, t) {
  return !t || t <= 0 ? 0 : (e / t) * 100;
}
function Ut(e) {
  return e < 0xe8d4a51000 ? e * 1e3 : e;
}
function Wt(e, t, n) {
  let r = Math.min(t, n),
    i = Math.max(t, n);
  return e.filter((e) => {
    if (e.timestamp <= 0) return !0;
    let t = Ut(e.timestamp);
    return t >= r && t <= i;
  });
}
function Gt(e, t, n) {
  let r = t || e.usage;
  if (!r) return u` <div class="usage-empty-block">${R(`usage.details.noUsageData`)}</div> `;
  let a = (e) => (e ? E(e) : R(`usage.common.emptyValue`)),
    o = [];
  (e.channel && o.push(`channel:${e.channel}`),
    e.agentId && o.push(`agent:${e.agentId}`),
    (e.modelProvider || e.providerOverride) &&
      o.push(`provider:${e.modelProvider ?? e.providerOverride}`),
    e.model && o.push(`model:${e.model}`));
  let s = r.toolUsage?.tools.slice(0, 6) ?? [],
    c,
    l,
    d;
  if (n) {
    let e = new Map();
    for (let t of n) {
      let { tools: n } = Ce(t.content);
      for (let [t] of n) e.set(t, (e.get(t) || 0) + 1);
    }
    ((d = s.map((t) => ({
      label: t.name,
      value: `${e.get(t.name) ?? 0}`,
      sub: R(`usage.overview.calls`),
    }))),
      (c = [...e.values()].reduce((e, t) => e + t, 0)),
      (l = e.size));
  } else
    ((d = s.map((e) => ({ label: e.name, value: `${e.count}`, sub: R(`usage.overview.calls`) }))),
      (c = r.toolUsage?.totalCalls ?? 0),
      (l = r.toolUsage?.uniqueTools ?? 0));
  let p =
    r.modelUsage
      ?.slice(0, 6)
      .map((e) => ({
        label: e.model ?? R(`usage.common.unknown`),
        value: G(e.totals.totalCost),
        sub: W(e.totals.totalTokens),
      })) ?? [];
  return u`
    ${
      o.length > 0
        ? u`<div class="usage-badges">
          ${o.map((e) => u`<span class="settings-row__value">${e}</span>`)}
        </div>`
        : f
    }
    <div class="session-summary-grid">
      <div class="stat session-summary-card">
        <div class="session-summary-title">${R(`usage.overview.messages`)}</div>
        <div class="stat-value session-summary-value">${r.messageCounts?.total ?? 0}</div>
        <div class="session-summary-meta">
          ${r.messageCounts?.user ?? 0}
          ${m(R(`usage.overview.user`))} ·
          ${r.messageCounts?.assistant ?? 0}
          ${m(R(`usage.overview.assistant`))}
        </div>
      </div>
      <div class="stat session-summary-card">
        <div class="session-summary-title">${R(`usage.overview.toolCalls`)}</div>
        <div class="stat-value session-summary-value">${c}</div>
        <div class="session-summary-meta">${l} ${R(`usage.overview.toolsUsed`)}</div>
      </div>
      <div class="stat session-summary-card">
        <div class="session-summary-title">${R(`usage.overview.errors`)}</div>
        <div class="stat-value session-summary-value">${r.messageCounts?.errors ?? 0}</div>
        <div class="session-summary-meta">
          ${r.messageCounts?.toolResults ?? 0} ${R(`usage.overview.toolResults`)}
        </div>
      </div>
      <div class="stat session-summary-card">
        <div class="session-summary-title">${R(`usage.details.duration`)}</div>
        <div class="stat-value session-summary-value">
          ${i(r.durationMs, { spaced: !0 }) ?? R(`usage.common.emptyValue`)}
        </div>
        <div class="session-summary-meta">
          ${a(r.firstActivity)} → ${a(r.lastActivity)}
        </div>
      </div>
    </div>
    <div class="usage-insights-grid usage-insights-grid--tight">
      ${Rt(R(`usage.overview.topTools`), d, R(`usage.overview.noToolCalls`))}
      ${Rt(R(`usage.details.modelMix`), p, R(`usage.overview.noModelData`))}
    </div>
  `;
}
function Kt(e, t, n, r) {
  let i = Math.min(n, r),
    a = Math.max(n, r),
    o = t.filter((e) => e.timestamp >= i && e.timestamp <= a);
  if (o.length === 0) return;
  let s = 0,
    c = 0,
    l = 0,
    u = 0,
    d = 0,
    f = 0,
    p = 0,
    m = 0;
  for (let e of o)
    ((s += e.totalTokens || 0),
      (c += e.cost || 0),
      (d += e.input || 0),
      (f += e.output || 0),
      (p += e.cacheRead || 0),
      (m += e.cacheWrite || 0),
      e.output > 0 && u++,
      e.input > 0 && l++);
  let h = v(o[0], `filtered usage first point`),
    g = v(o.at(-1), `filtered usage last point`);
  return {
    ...e,
    totalTokens: s,
    totalCost: c,
    input: d,
    output: f,
    cacheRead: p,
    cacheWrite: m,
    durationMs: g.timestamp - h.timestamp,
    firstActivity: h.timestamp,
    lastActivity: g.timestamp,
    messageCounts: {
      total: o.length,
      user: l,
      assistant: u,
      toolCalls: 0,
      toolResults: 0,
      errors: 0,
    },
  };
}
function qt(e, t, n, r, i, a, o, s, c, l, d, p, h, g, v, y, b, ee, x, S, te, C, w, T, E, ne) {
  let D = e.label || e.key,
    O = D.length > 50 ? _(D, 50) + `…` : D,
    k = e.usage,
    A = s !== null && c !== null,
    j = s !== null && c !== null && t?.points && k ? Kt(k, t.points, s, c) : void 0,
    M = j
      ? { totalTokens: j.totalTokens, totalCost: j.totalCost }
      : { totalTokens: k?.totalTokens ?? 0, totalCost: k?.totalCost ?? 0 },
    N = j ? R(`usage.details.filtered`) : ``;
  return u`
    <div class="settings-group usage-panel session-detail-panel">
      <div class="session-detail-header">
        <div class="session-detail-header-left">
          <div class="session-detail-title">
            ${O}
            ${N ? u`<span class="session-detail-indicator">${N}</span>` : f}
          </div>
        </div>
        <div class="session-detail-stats">
          ${
            k
              ? u`
                <span
                  ><strong>${W(M.totalTokens)}</strong>
                  ${m(R(`usage.metrics.tokens`))}${N}</span
                >
                <span><strong>${G(M.totalCost)}</strong>${N}</span>
              `
              : f
          }
        </div>
        <openclaw-tooltip .content=${R(`usage.details.close`)}>
          <button
            class="btn btn--sm btn--ghost"
            @click=${ne}
            aria-label=${R(`usage.details.close`)}
          >
            ×
          </button>
        </openclaw-tooltip>
      </div>
      ${
        e.scope === `family` && e.includedSessionIds?.length
          ? u`
            <div class="usage-lineage-note">
              ${R(`usage.scope.familyIncluded`, { count: String(e.includedSessionIds.length) })}
            </div>
          `
          : f
      }
      <div class="session-detail-content">
        ${Gt(e, j, s != null && c != null && g ? Wt(g, s, c) : void 0)}
        <div class="session-detail-row">
          ${Jt(t, n, r, i, a, o, d, p, h, s, c, l)}
        </div>
        <div class="session-detail-bottom">
          ${Xt(g, v, y, b, ee, x, S, te, C, w, A ? s : null, A ? c : null)}
          ${Yt(e.contextWeight, k, T, E)}
        </div>
      </div>
    </div>
  `;
}
function Jt(e, t, n, r, i, a, o, s, c, l, d, h) {
  if (t)
    return u`
      <div class="session-timeseries-compact">
        <div class="usage-empty-block">${R(`usage.loading.badge`)}</div>
      </div>
    `;
  if (!e || e.points.length < 2)
    return u`
      <div class="session-timeseries-compact">
        <div class="usage-empty-block">${R(`usage.details.noTimeline`)}</div>
      </div>
    `;
  let g = e.points;
  if (o || s || (c && c.length > 0)) {
    let t = o ? new Date(o + `T00:00:00`).getTime() : 0,
      n = s ? new Date(s + `T23:59:59`).getTime() : 1 / 0,
      r = c?.length ? new Set(c) : void 0;
    g = e.points.filter((e) => {
      if (e.timestamp < t || e.timestamp > n) return !1;
      if (r) {
        let t = new Date(e.timestamp),
          n = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, `0`)}-${String(t.getDate()).padStart(2, `0`)}`;
        return r.has(n);
      }
      return !0;
    });
  }
  if (g.length < 2)
    return u`
      <div class="session-timeseries-compact">
        <div class="usage-empty-block">${R(`usage.details.noDataInRange`)}</div>
      </div>
    `;
  let _ = 0,
    y = 0,
    b = 0,
    ee = 0,
    x = 0,
    S = 0;
  g = g.map(
    (e) => (
      (_ += e.totalTokens),
      (y += e.cost),
      (b += e.output),
      (ee += e.input),
      (x += e.cacheRead),
      (S += e.cacheWrite),
      { ...e, cumulativeTokens: _, cumulativeCost: y }
    ),
  );
  let C = l != null && d != null,
    w = C ? Math.min(l, d) : 0,
    T = C ? Math.max(l, d) : 1 / 0,
    E = 0,
    D = g.length;
  if (C) {
    ((E = g.findIndex((e) => e.timestamp >= w)), E === -1 && (E = g.length));
    let e = g.findIndex((e) => e.timestamp > T);
    D = e === -1 ? g.length : e;
  }
  let O = C ? g.slice(E, D) : g,
    k = 0,
    A = 0,
    j = 0,
    M = 0;
  for (let e of O) ((k += e.output), (A += e.input), (j += e.cacheRead), (M += e.cacheWrite));
  let N = { top: 8, right: 4, bottom: 14, left: 30 },
    re = 400 - N.left - N.right,
    P = 100 - N.top - N.bottom,
    ie = n === `cumulative`,
    F = n === `per-turn` && i === `by-type`,
    I = k + A + j + M,
    ae = g.map((e) =>
      ie ? e.cumulativeTokens : F ? e.input + e.output + e.cacheRead + e.cacheWrite : e.totalTokens,
    ),
    L = Math.max(...ae, 1),
    oe = re / g.length,
    z = Math.min(Qt, Math.max(1, oe * Zt)),
    B = oe - z,
    V = N.left + E * (z + B),
    H = D >= g.length ? N.left + (g.length - 1) * (z + B) + z : N.left + (D - 1) * (z + B) + z;
  return u`
    <div class="session-timeseries-compact">
      <div class="timeseries-header-row">
        <div class="card-title usage-section-title">${R(`usage.details.usageOverTime`)}</div>
        <div class="timeseries-controls">
          ${
            C
              ? u`
                <div class="chart-toggle small">
                  <button
                    class="btn btn--sm toggle-btn active"
                    @click=${() => h?.(null, null)}
                  >
                    ${R(`usage.details.reset`)}
                  </button>
                </div>
              `
              : f
          }
          <div class="chart-toggle small">
            <button
              class="btn btn--sm toggle-btn ${ie ? `` : `active`}"
              @click=${() => r(`per-turn`)}
            >
              ${R(`usage.details.perTurn`)}
            </button>
            <button
              class="btn btn--sm toggle-btn ${ie ? `active` : ``}"
              @click=${() => r(`cumulative`)}
            >
              ${R(`usage.details.cumulative`)}
            </button>
          </div>
          ${
            ie
              ? f
              : u`
                <div class="chart-toggle small">
                  <button
                    class="btn btn--sm toggle-btn ${i === `total` ? `active` : ``}"
                    @click=${() => a(`total`)}
                  >
                    ${R(`usage.daily.total`)}
                  </button>
                  <button
                    class="btn btn--sm toggle-btn ${i === `by-type` ? `active` : ``}"
                    @click=${() => a(`by-type`)}
                  >
                    ${R(`usage.daily.byType`)}
                  </button>
                </div>
              `
          }
        </div>
      </div>
      <div class="timeseries-chart-wrapper">
        <svg viewBox="0 0 ${400} ${118}" class="timeseries-svg">
          <!-- Y axis -->
          <line
            x1="${N.left}"
            y1="${N.top}"
            x2="${N.left}"
            y2="${N.top + P}"
            stroke="var(--border)"
          />
          <!-- X axis -->
          <line
            x1="${N.left}"
            y1="${N.top + P}"
            x2="${400 - N.right}"
            y2="${N.top + P}"
            stroke="var(--border)"
          />
          <!-- Y axis labels -->
          <text
            x="${N.left - 4}"
            y="${N.top + 5}"
            text-anchor="end"
            class="ts-axis-label"
          >
            ${W(L)}
          </text>
          <text
            x="${N.left - 4}"
            y="${N.top + P}"
            text-anchor="end"
            class="ts-axis-label"
          >
            0
          </text>
          <!-- X axis labels (first and last) -->
          ${
            g.length > 0
              ? p`
            <text x="${N.left}" y="${N.top + P + 10}" text-anchor="start" class="ts-axis-label">${ne(v(g[0], `time series first point`).timestamp, { hour: `2-digit`, minute: `2-digit` }, ``)}</text>
            <text x="${400 - N.right}" y="${N.top + P + 10}" text-anchor="end" class="ts-axis-label">${ne(v(g.at(-1), `time series last point`).timestamp, { hour: `2-digit`, minute: `2-digit` }, ``)}</text>
          `
              : f
          }
          <!-- Bars -->
          ${g.map((e, t) => {
            let n = v(ae[t], `time series bar total`),
              r = N.left + t * (z + B),
              i = (n / L) * P,
              a = N.top + P - i,
              o = [
                te(
                  e.timestamp,
                  { month: `short`, day: `numeric`, hour: `2-digit`, minute: `2-digit` },
                  ``,
                ),
                `${W(n)} ${m(R(`usage.metrics.tokens`))}`,
              ];
            F &&
              (o.push(`Out ${W(e.output)}`),
              o.push(`In ${W(e.input)}`),
              o.push(`CW ${W(e.cacheWrite)}`),
              o.push(`CR ${W(e.cacheRead)}`));
            let s = o.join(` · `),
              c = C && (t < E || t >= D);
            if (!F)
              return p`<rect x="${r}" y="${a}" width="${z}" height="${i}" class="ts-bar${c ? ` dimmed` : ``}" rx="1"><title>${s}</title></rect>`;
            let l = [
                { value: e.output, cls: `output` },
                { value: e.input, cls: `input` },
                { value: e.cacheWrite, cls: `cache-write` },
                { value: e.cacheRead, cls: `cache-read` },
              ],
              u = N.top + P,
              d = c ? ` dimmed` : ``;
            return p`
              ${l.map((e) => {
                if (e.value <= 0 || n <= 0) return f;
                let t = i * (e.value / n);
                return (
                  (u -= t),
                  p`<rect x="${r}" y="${u}" width="${z}" height="${t}" class="ts-bar ${e.cls}${d}" rx="1"><title>${s}</title></rect>`
                );
              })}
            `;
          })}
          <!-- Selection highlight overlay (always visible between handles) -->
          ${p`
            <rect 
              x="${V}" 
              y="${N.top}" 
              width="${Math.max(1, H - V)}" 
              height="${P}" 
              fill="var(--accent)" 
              opacity="${$t}" 
              pointer-events="none"
            />
          `}
          <!-- Left cursor line + handle -->
          ${p`
            <line x1="${V}" y1="${N.top}" x2="${V}" y2="${N.top + P}" stroke="var(--accent)" stroke-width="0.8" opacity="0.7" />
            <rect x="${V - en / 2}" y="${N.top + P / 2 - Z / 2}" width="${en}" height="${Z}" rx="1.5" fill="var(--accent)" class="cursor-handle" />
            <line x1="${V - Q}" y1="${N.top + P / 2 - Z / 5}" x2="${V - Q}" y2="${N.top + P / 2 + Z / 5}" stroke="var(--bg)" stroke-width="0.4" pointer-events="none" />
            <line x1="${V + Q}" y1="${N.top + P / 2 - Z / 5}" x2="${V + Q}" y2="${N.top + P / 2 + Z / 5}" stroke="var(--bg)" stroke-width="0.4" pointer-events="none" />
          `}
          <!-- Right cursor line + handle -->
          ${p`
            <line x1="${H}" y1="${N.top}" x2="${H}" y2="${N.top + P}" stroke="var(--accent)" stroke-width="0.8" opacity="0.7" />
            <rect x="${H - en / 2}" y="${N.top + P / 2 - Z / 2}" width="${en}" height="${Z}" rx="1.5" fill="var(--accent)" class="cursor-handle" />
            <line x1="${H - Q}" y1="${N.top + P / 2 - Z / 5}" x2="${H - Q}" y2="${N.top + P / 2 + Z / 5}" stroke="var(--bg)" stroke-width="0.4" pointer-events="none" />
            <line x1="${H + Q}" y1="${N.top + P / 2 - Z / 5}" x2="${H + Q}" y2="${N.top + P / 2 + Z / 5}" stroke="var(--bg)" stroke-width="0.4" pointer-events="none" />
          `}
        </svg>
        <!-- Handle drag zones (only on handles, not full chart) -->
        ${(() => {
          let e = `${((V / 400) * 100).toFixed(1)}%`,
            t = `${((H / 400) * 100).toFixed(1)}%`,
            n = (e) => (t) => {
              if (!h) return;
              (t.preventDefault(), t.stopPropagation());
              let n = t.currentTarget.closest(`.timeseries-chart-wrapper`)?.querySelector(`svg`);
              if (!n) return;
              let r = n.getBoundingClientRect(),
                i = r.width,
                a = (N.left / 400) * i,
                o = ((400 - N.right) / 400) * i - a,
                s = (e) => {
                  let t = Math.max(0, Math.min(1, (e - r.left - a) / o));
                  return Math.min(Math.floor(t * g.length), g.length - 1);
                },
                c = e === `left` ? V : H,
                u = r.left + (c / 400) * i,
                f = t.clientX - u;
              document.body.style.cursor = `col-resize`;
              let p = (t) => {
                  let n = t.clientX - f,
                    r = s(n),
                    i = g[r];
                  if (i)
                    if (e === `left`) {
                      let e = d ?? v(g.at(-1), `time series right cursor point`).timestamp;
                      h(Math.min(i.timestamp, e), e);
                    } else {
                      let e = l ?? v(g[0], `time series left cursor point`).timestamp;
                      h(e, Math.max(i.timestamp, e));
                    }
                },
                m = () => {
                  ((document.body.style.cursor = ``),
                    document.removeEventListener(`mousemove`, p),
                    document.removeEventListener(`mouseup`, m));
                };
              (document.addEventListener(`mousemove`, p), document.addEventListener(`mouseup`, m));
            };
          return u`
            <div
              class="chart-handle-zone chart-handle-left"
              style="left: ${e};"
              @mousedown=${n(`left`)}
            ></div>
            <div
              class="chart-handle-zone chart-handle-right"
              style="left: ${t};"
              @mousedown=${n(`right`)}
            ></div>
          `;
        })()}
      </div>
      <div class="timeseries-summary">
        ${
          C
            ? u`
              <span class="timeseries-summary__range">
                ${R(`usage.details.turnRange`, { start: String(E + 1), end: String(D), total: String(g.length) })}
              </span>
              ·
              ${ne(w, { hour: `2-digit`, minute: `2-digit` }, ``)}–${ne(T, { hour: `2-digit`, minute: `2-digit` }, ``)}
              ·
              ${W(k + A + j + M)}
              · ${G(O.reduce((e, t) => e + (t.cost || 0), 0))}
            `
            : u`${g.length} ${R(`usage.overview.messagesAbbrev`)} · ${W(_)}
            · ${G(y)}`
        }
      </div>
      ${
        F
          ? u`
            <div class="timeseries-breakdown">
              <div class="card-title usage-section-title">${R(`usage.breakdown.tokensByType`)}</div>
              <div class="cost-breakdown-bar cost-breakdown-bar--compact">
                <div
                  class="cost-segment output"
                  style="width: ${X(k, I).toFixed(1)}%"
                ></div>
                <div
                  class="cost-segment input"
                  style="width: ${X(A, I).toFixed(1)}%"
                ></div>
                <div
                  class="cost-segment cache-write"
                  style="width: ${X(M, I).toFixed(1)}%"
                ></div>
                <div
                  class="cost-segment cache-read"
                  style="width: ${X(j, I).toFixed(1)}%"
                ></div>
              </div>
              <div class="cost-breakdown-legend">
                <div class="legend-item" title=${R(`usage.details.assistantOutputTokens`)}>
                  <span class="legend-dot output"></span>${R(`usage.breakdown.output`)}
                  ${W(k)}
                </div>
                <div class="legend-item" title=${R(`usage.details.userToolInputTokens`)}>
                  <span class="legend-dot input"></span>${R(`usage.breakdown.input`)}
                  ${W(A)}
                </div>
                <div class="legend-item" title=${R(`usage.details.tokensWrittenToCache`)}>
                  <span class="legend-dot cache-write"></span>${R(`usage.breakdown.cacheWrite`)}
                  ${W(M)}
                </div>
                <div class="legend-item" title=${R(`usage.details.tokensReadFromCache`)}>
                  <span class="legend-dot cache-read"></span>${R(`usage.breakdown.cacheRead`)}
                  ${W(j)}
                </div>
              </div>
              <div class="cost-breakdown-total">
                ${R(`usage.breakdown.total`)}: ${W(I)}
              </div>
            </div>
          `
          : f
      }
    </div>
  `;
}
function Yt(e, t, n, r) {
  if (!e)
    return u`
      <div class="context-details-panel">
        <div class="usage-empty-block">${R(`usage.details.noContextData`)}</div>
      </div>
    `;
  let i = Ke(e.systemPrompt.chars),
    a = Ke(e.skills.promptChars),
    o = Ke(e.tools.listChars + e.tools.schemaChars),
    s = Ke(e.injectedWorkspaceFiles.reduce((e, t) => e + t.injectedChars, 0)),
    c = i + a + o + s,
    l = ``;
  if (t && t.totalTokens > 0) {
    let e = t.input + t.cacheRead;
    e > 0 && (l = `~${Math.min((c / e) * 100, 100).toFixed(0)}% ${R(`usage.details.ofInput`)}`);
  }
  let d = e.skills.entries.toSorted((e, t) => t.blockChars - e.blockChars),
    p = e.tools.entries.toSorted(
      (e, t) => t.summaryChars + t.schemaChars - (e.summaryChars + e.schemaChars),
    ),
    m = e.injectedWorkspaceFiles.toSorted((e, t) => t.injectedChars - e.injectedChars),
    h = n,
    g = h ? d : d.slice(0, 4),
    _ = h ? p : p.slice(0, 4),
    v = h ? m : m.slice(0, 4),
    y = d.length > 4 || p.length > 4 || m.length > 4;
  return u`
    <div class="context-details-panel">
      <div class="context-breakdown-header">
        <div class="card-title usage-section-title">
          ${R(`usage.details.systemPromptBreakdown`)}
        </div>
        ${
          y
            ? u`<button class="btn btn--sm" @click=${r}>
              ${R(h ? `usage.details.collapse` : `usage.details.expandAll`)}
            </button>`
            : f
        }
      </div>
      <p class="context-weight-desc">${l || R(`usage.details.baseContextPerMessage`)}</p>
      <div class="context-stacked-bar">
        <div
          class="context-segment system"
          style="width: ${X(i, c).toFixed(1)}%"
          title="${R(`usage.details.system`)}: ~${W(i)}"
        ></div>
        <div
          class="context-segment skills"
          style="width: ${X(a, c).toFixed(1)}%"
          title="${R(`usage.details.skills`)}: ~${W(a)}"
        ></div>
        <div
          class="context-segment tools"
          style="width: ${X(o, c).toFixed(1)}%"
          title="${R(`usage.details.tools`)}: ~${W(o)}"
        ></div>
        <div
          class="context-segment files"
          style="width: ${X(s, c).toFixed(1)}%"
          title="${R(`usage.details.files`)}: ~${W(s)}"
        ></div>
      </div>
      <div class="context-legend">
        <span class="legend-item"
          ><span class="legend-dot system"></span>${R(`usage.details.systemShort`)}
          ~${W(i)}</span
        >
        <span class="legend-item"
          ><span class="legend-dot skills"></span>${R(`usage.details.skills`)}
          ~${W(a)}</span
        >
        <span class="legend-item"
          ><span class="legend-dot tools"></span>${R(`usage.details.tools`)}
          ~${W(o)}</span
        >
        <span class="legend-item"
          ><span class="legend-dot files"></span>${R(`usage.details.files`)}
          ~${W(s)}</span
        >
      </div>
      <div class="context-total">
        ${R(`usage.breakdown.total`)}: ~${W(c)}
      </div>
      <div class="context-breakdown-grid">
        ${
          d.length > 0
            ? (() => {
                let e = d.length - g.length;
                return u`
                <div class="context-breakdown-card">
                  <div class="context-breakdown-title">
                    ${R(`usage.details.skills`)} (${d.length})
                  </div>
                  <div class="context-breakdown-list">
                    ${g.map(
                      (e) => u`
                        <div class="context-breakdown-item">
                          <span class="mono" title=${e.name}>${e.name}</span>
                          <span class="muted">~${W(Ke(e.blockChars))}</span>
                        </div>
                      `,
                    )}
                  </div>
                  ${
                    e > 0
                      ? u`
                        <div class="context-breakdown-more">
                          ${R(`usage.sessions.more`, { count: String(e) })}
                        </div>
                      `
                      : f
                  }
                </div>
              `;
              })()
            : f
        }
        ${
          p.length > 0
            ? (() => {
                let e = p.length - _.length;
                return u`
                <div class="context-breakdown-card">
                  <div class="context-breakdown-title">
                    ${R(`usage.details.tools`)} (${p.length})
                  </div>
                  <div class="context-breakdown-list">
                    ${_.map(
                      (e) => u`
                        <div class="context-breakdown-item">
                          <span class="mono" title=${e.name}>${e.name}</span>
                          <span class="muted"
                            >~${W(Ke(e.summaryChars + e.schemaChars))}</span
                          >
                        </div>
                      `,
                    )}
                  </div>
                  ${
                    e > 0
                      ? u`
                        <div class="context-breakdown-more">
                          ${R(`usage.sessions.more`, { count: String(e) })}
                        </div>
                      `
                      : f
                  }
                </div>
              `;
              })()
            : f
        }
        ${
          m.length > 0
            ? (() => {
                let e = m.length - v.length;
                return u`
                <div class="context-breakdown-card">
                  <div class="context-breakdown-title">
                    ${R(`usage.details.files`)} (${m.length})
                  </div>
                  <div class="context-breakdown-list">
                    ${v.map(
                      (e) => u`
                        <div class="context-breakdown-item">
                          <span class="mono" title=${e.name}>${e.name}</span>
                          <span class="muted"
                            >~${W(Ke(e.injectedChars))}</span
                          >
                        </div>
                      `,
                    )}
                  </div>
                  ${
                    e > 0
                      ? u`
                        <div class="context-breakdown-more">
                          ${R(`usage.sessions.more`, { count: String(e) })}
                        </div>
                      `
                      : f
                  }
                </div>
              `;
              })()
            : f
        }
      </div>
    </div>
  `;
}
function Xt(e, t, n, r, i, a, o, s, c, l, d, p) {
  if (t)
    return u`
      <div class="session-logs-compact">
        <div class="session-logs-header">${R(`usage.details.conversation`)}</div>
        <div class="usage-empty-block">${R(`usage.loading.badge`)}</div>
      </div>
    `;
  if (!e || e.length === 0)
    return u`
      <div class="session-logs-compact">
        <div class="session-logs-header">${R(`usage.details.conversation`)}</div>
        <div class="usage-empty-block">${R(`usage.details.noMessages`)}</div>
      </div>
    `;
  let h = m(i.query),
    g = e.map((e) => {
      let t = Ce(e.content);
      return { log: e, toolInfo: t, cleanContent: t.cleanContent || e.content };
    }),
    _ = Array.from(new Set(g.flatMap((e) => e.toolInfo.tools.map(([e]) => e)))).toSorted((e, t) =>
      e.localeCompare(t),
    ),
    v = g.filter((e) => {
      if (d != null && p != null) {
        let t = e.log.timestamp;
        if (t > 0) {
          let e = Math.min(d, p),
            n = Math.max(d, p),
            r = Ut(t);
          if (r < e || r > n) return !1;
        }
      }
      return !(
        (i.roles.length > 0 && !i.roles.includes(e.log.role)) ||
        (i.hasTools && e.toolInfo.tools.length === 0) ||
        (i.tools.length > 0 && !e.toolInfo.tools.some(([e]) => i.tools.includes(e))) ||
        (h && !m(e.cleanContent).includes(h))
      );
    }),
    y = i.roles.length > 0 || i.tools.length > 0 || i.hasTools || h,
    b = d != null && p != null,
    ee =
      y || b
        ? `${v.length} ${R(`usage.details.of`)} ${e.length}${b ? ` (${R(`usage.details.timelineFiltered`)})` : ``}`
        : `${e.length}`,
    x = new Set(i.roles),
    S = new Set(i.tools);
  return u`
    <div class="session-logs-compact">
      <div class="session-logs-header">
        <span>
          ${R(`usage.details.conversation`)}
          <span class="session-logs-header-count">
            (${ee} ${m(R(`usage.overview.messages`))})
          </span>
        </span>
        <button class="btn btn--sm" @click=${r}>
          ${R(n ? `usage.details.collapseAll` : `usage.details.expandAll`)}
        </button>
      </div>
      <div class="usage-filters-inline session-log-filters">
        <select
          multiple
          size="4"
          aria-label=${R(`usage.details.filterByRole`)}
          @change=${(e) => a(Array.from(e.target.selectedOptions).map((e) => e.value))}
        >
          <option value="user" ?selected=${x.has(`user`)}>
            ${R(`usage.overview.user`)}
          </option>
          <option value="assistant" ?selected=${x.has(`assistant`)}>
            ${R(`usage.overview.assistant`)}
          </option>
          <option value="tool" ?selected=${x.has(`tool`)}>
            ${R(`usage.details.tool`)}
          </option>
          <option value="toolResult" ?selected=${x.has(`toolResult`)}>
            ${R(`usage.details.toolResult`)}
          </option>
        </select>
        <select
          multiple
          size="4"
          aria-label=${R(`usage.details.filterByTool`)}
          @change=${(e) => o(Array.from(e.target.selectedOptions).map((e) => e.value))}
        >
          ${_.map((e) => u`<option value=${e} ?selected=${S.has(e)}>${e}</option>`)}
        </select>
        <label class="usage-filters-inline session-log-has-tools">
          <input
            type="checkbox"
            .checked=${i.hasTools}
            @change=${(e) => s(e.target.checked)}
          />
          ${R(`usage.details.hasTools`)}
        </label>
        <input
          type="text"
          placeholder=${R(`usage.details.searchConversation`)}
          aria-label=${R(`usage.details.searchConversation`)}
          .value=${i.query}
          @input=${(e) => c(e.target.value)}
        />
        <button class="btn btn--sm" @click=${l}>${R(`usage.filters.clear`)}</button>
      </div>
      <div class="session-logs-list">
        ${v.map((e) => {
          let { log: t, toolInfo: r, cleanContent: i } = e;
          return u`
            <div class="session-log-entry ${t.role === `user` ? `user` : `assistant`}">
              <div class="session-log-meta">
                <span class="session-log-role">${t.role === `user` ? R(`usage.details.you`) : t.role === `assistant` ? R(`usage.overview.assistant`) : R(`usage.details.tool`)}</span>
                <span>${E(t.timestamp)}</span>
                ${t.tokens ? u`<span>${W(t.tokens)}</span>` : f}
              </div>
              <div class="session-log-content">${i}</div>
              ${
                r.tools.length > 0
                  ? u`
                    <details class="session-log-tools" ?open=${n}>
                      <summary>${r.summary}</summary>
                      <div class="session-log-tools-list">
                        ${r.tools.map(
                          ([e, t]) => u`
                            <span class="session-log-tools-pill">${e} × ${t}</span>
                          `,
                        )}
                      </div>
                    </details>
                  `
                  : f
              }
            </div>
          `;
        })}
        ${
          v.length === 0
            ? u`
              <div class="usage-empty-block usage-empty-block--compact">
                ${R(`usage.details.noMessagesMatch`)}
              </div>
            `
            : f
        }
      </div>
    </div>
  `;
}
var Zt,
  Qt,
  $t,
  en,
  Z,
  Q,
  tn = e(() => {
    (h(),
      y(),
      d(),
      r(),
      oe(),
      z(),
      A(),
      T(),
      ze(),
      bt(),
      Ht(),
      (Zt = 0.75),
      (Qt = 8),
      ($t = 0.06),
      (en = 5),
      (Z = 12),
      (Q = 0.7));
  });
function nn() {
  return {
    input: 0,
    output: 0,
    cacheRead: 0,
    cacheWrite: 0,
    totalTokens: 0,
    totalCost: 0,
    inputCost: 0,
    outputCost: 0,
    cacheReadCost: 0,
    cacheWriteCost: 0,
    missingCostEntries: 0,
  };
}
function rn(e, t) {
  return (
    (e.input += t.input),
    (e.output += t.output),
    (e.cacheRead += t.cacheRead),
    (e.cacheWrite += t.cacheWrite),
    (e.totalTokens += t.totalTokens),
    (e.totalCost += t.totalCost),
    (e.inputCost += t.inputCost ?? 0),
    (e.outputCost += t.outputCost ?? 0),
    (e.cacheReadCost += t.cacheReadCost ?? 0),
    (e.cacheWriteCost += t.cacheWriteCost ?? 0),
    (e.missingCostEntries += t.missingCostEntries ?? 0),
    e
  );
}
function an(e, t) {
  return u`
    <span class="settings-status settings-status--accent" title=${t ?? f}>
      <span class="usage-loading-spinner" aria-hidden="true"></span>
      ${e}
    </span>
  `;
}
function on(e) {
  return U(
    { title: R(`usage.loading.title`), actions: an(R(`usage.loading.badge`)) },
    u`
      <div class="usage-panel usage-loading-card">
        <div class="usage-loading-header">
          <div class="usage-loading-controls">
            <div class="usage-date-range usage-date-range--loading">
              <input class="usage-date-input" type="date" .value=${e.startDate} disabled />
              <span class="usage-separator">${R(`usage.filters.to`)}</span>
              <input class="usage-date-input" type="date" .value=${e.endDate} disabled />
            </div>
          </div>
        </div>
        <div class="usage-loading-grid">
          <div class="usage-skeleton-block usage-skeleton-block--tall"></div>
          <div class="usage-skeleton-block"></div>
          <div class="usage-skeleton-block"></div>
        </div>
      </div>
    `,
  );
}
function sn(e) {
  return u`
    <section class="settings-group usage-panel usage-empty-state">
      <div class="usage-empty-state__title">${R(`usage.empty.title`)}</div>
      <div class="card-sub usage-empty-state__subtitle">${R(`usage.empty.subtitle`)}</div>
      <div class="usage-empty-state__features">
        <span class="usage-empty-state__feature">${R(`usage.empty.featureOverview`)}</span>
        <span class="usage-empty-state__feature">${R(`usage.empty.featureSessions`)}</span>
        <span class="usage-empty-state__feature">${R(`usage.empty.featureTimeline`)}</span>
      </div>
      <div class="usage-empty-state__actions">
        <button class="btn primary" @click=${e}>${R(`common.refresh`)}</button>
      </div>
    </section>
  `;
}
function cn(e) {
  return e.length === 0
    ? f
    : U(
        {
          title: R(`usage.providerUsage.title`),
          count: e.length,
          description: R(`usage.providerUsage.subtitle`),
        },
        u`
      <div class="usage-panel provider-usage-section">
        <div class="provider-usage-grid">
          ${e.map(
            (e) => u`
              <article class="provider-usage-card">
                <div class="provider-usage-card__header">
                  <div>
                    <div class="provider-usage-card__name">${e.displayName}</div>
                    <div class="provider-usage-card__id">${e.provider}</div>
                  </div>
                  ${e.plan ? u`<span class="provider-usage-plan">${e.plan}</span>` : f}
                </div>
                ${me(e)}
              </article>
            `,
          )}
        </div>
      </div>
    `,
      );
}
function ln(e) {
  let { data: t, filters: n, display: r, detail: i, callbacks: a } = e,
    o = a.filters,
    s = a.display,
    c = a.details;
  if (t.loading && !t.totals) return le(u`<div class="usage-page">${on(n)}</div>`, { wide: !0 });
  let l = r.chartMode === `tokens`,
    d = n.query.trim().length > 0,
    p = n.queryDraft.trim().length > 0,
    m = new Set(n.selectedDays),
    h = new Set(n.selectedSessions),
    g = [...t.sessions].toSorted((e, t) => {
      let n = l ? (e.usage?.totalTokens ?? 0) : (e.usage?.totalCost ?? 0);
      return (l ? (t.usage?.totalTokens ?? 0) : (t.usage?.totalCost ?? 0)) - n;
    }),
    _ = n.agentId ? g.filter((e) => K(e.agentId ?? ``) === K(n.agentId ?? ``)) : g,
    v =
      m.size > 0
        ? _.filter((e) => {
            if (e.usage?.activityDates?.length) return e.usage.activityDates.some((e) => m.has(e));
            if (!e.updatedAt) return !1;
            let t = new Date(e.updatedAt),
              n = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, `0`)}-${String(t.getDate()).padStart(2, `0`)}`;
            return m.has(n);
          })
        : _,
    y = Re(
      n.selectedHours.length > 0 ? v.filter((e) => rt(e, n.selectedHours, n.timeZone)) : v,
      n.query,
    ),
    b = y.sessions,
    ee = y.warnings,
    x = Et(n.queryDraft, _, t.aggregates),
    S = De(n.query),
    te = (e) => {
      let t = K(e);
      return S.filter((e) => K(e.key ?? ``) === t)
        .map((e) => e.value)
        .filter(Boolean);
    },
    C = (e) => {
      let t = new Set();
      for (let n of e) n && t.add(n);
      return Array.from(t);
    },
    w = C(_.map((e) => e.channel)).slice(0, 12),
    T = C([
      ..._.map((e) => e.modelProvider),
      ..._.map((e) => e.providerOverride),
      ...(t.aggregates?.byProvider.map((e) => e.provider) ?? []),
    ]).slice(0, 12),
    E = C([..._.map((e) => e.model), ...(t.aggregates?.byModel.map((e) => e.model) ?? [])]).slice(
      0,
      12,
    ),
    ne = C(t.aggregates?.tools.tools.map((e) => e.name) ?? []).slice(0, 12),
    D =
      n.selectedSessions.length === 1
        ? (t.sessions.find((e) => e.key === n.selectedSessions[0]) ??
          b.find((e) => e.key === n.selectedSessions[0]))
        : null,
    O = (e) => e.reduce((e, t) => (t.usage ? rn(e, t.usage) : e), nn()),
    k = (e) => t.costDaily.filter((t) => e.has(t.date)).reduce((e, t) => rn(e, t), nn()),
    A,
    j,
    M = _.length;
  if (n.selectedSessions.length > 0) {
    let e = b.filter((e) => h.has(e.key));
    ((A = O(e)), (j = e.length));
  } else
    n.selectedDays.length > 0 && n.selectedHours.length === 0
      ? ((A = k(m)), (j = b.length))
      : n.selectedHours.length > 0 || d
        ? ((A = O(b)), (j = b.length))
        : n.agentId
          ? ((A = O(_)), (j = M))
          : ((A = t.totals), (j = M));
  let N =
      n.selectedSessions.length > 0
        ? b.filter((e) => h.has(e.key))
        : d || n.selectedHours.length > 0
          ? b
          : n.selectedDays.length > 0
            ? v
            : _,
    re =
      n.selectedSessions.length > 0 ||
      d ||
      n.selectedHours.length > 0 ||
      n.selectedDays.length > 0 ||
      !!n.agentId,
    P = re ? vt(N) : vt([], t.aggregates),
    ie = t.sessionsLimitReached && !re,
    F = ie ? O(N) : A,
    I = ie ? vt(N) : P,
    ae = re ? f : Ft(t.costDaily, n.startDate, n.endDate),
    L =
      n.selectedSessions.length > 0
        ? (() => {
            let e = b.filter((e) => h.has(e.key)),
              n = new Set();
            for (let t of e) for (let e of t.usage?.activityDates ?? []) n.add(e);
            return n.size > 0 ? t.costDaily.filter((e) => n.has(e.date)) : t.costDaily;
          })()
        : t.costDaily,
    oe = yt(N, F, I),
    z = !t.loading && !t.totals && t.sessions.length === 0,
    B = _e(t.cacheStatus),
    V =
      (F?.missingCostEntries ?? 0) > 0 ||
      (F
        ? F.totalTokens > 0 &&
          F.totalCost === 0 &&
          F.input + F.output + F.cacheRead + F.cacheWrite > 0
        : !1),
    H = [
      { label: R(`usage.presets.today`), days: 1 },
      { label: R(`usage.presets.last7d`), days: 7 },
      { label: R(`usage.presets.last30d`), days: 30 },
      { label: R(`usage.presets.last90d`), days: 90 },
      { label: R(`usage.presets.last1y`), days: 365 },
    ],
    se = (e) => {
      let t = new Date(),
        n = new Date();
      (n.setDate(n.getDate() - (e - 1)), o.onStartDateChange(ot(n)), o.onEndDateChange(ot(t)));
    },
    ce = () => {
      (o.onStartDateChange(`1970-01-01`), o.onEndDateChange(ot(new Date())));
    },
    U = (e, t, r) => {
      if (r.length === 0) return f;
      let i = te(e),
        a = new Set(i.map((e) => K(e))),
        s = r.length > 0 && r.every((e) => a.has(K(e))),
        c = i.length;
      return u`
      <wa-dropdown
        class="usage-filter-select"
        placement="bottom-start"
        @wa-select=${(t) => {
          t.preventDefault();
          let i = t.detail.item.value;
          if (i === `command:select-all`) {
            o.onQueryDraftChange(At(n.queryDraft, e, r));
            return;
          }
          if (i === `command:clear`) {
            o.onQueryDraftChange(At(n.queryDraft, e, []));
            return;
          }
          if (i?.startsWith(`option:`)) {
            let t = decodeURIComponent(i.slice(7)),
              r = `${e}:${t}`,
              s = a.has(K(t));
            o.onQueryDraftChange(s ? kt(n.queryDraft, r) : Ot(n.queryDraft, r));
          }
        }}
      >
        <button slot="trigger" type="button" class="usage-filter-trigger">
          <span>${t}</span>
          ${c > 0 ? u`<span class="settings-count">${c}</span>` : u` <span class="settings-count">${R(`usage.filters.all`)}</span> `}
        </button>
        <wa-dropdown-item value="command:select-all" ?disabled=${s}>
          ${R(`usage.filters.selectAll`)}
        </wa-dropdown-item>
        <wa-dropdown-item value="command:clear" ?disabled=${c === 0}>
          ${R(`usage.filters.clear`)}
        </wa-dropdown-item>
        <div class="session-menu__separator" role="separator"></div>
        ${r.map((e) => {
          let t = a.has(K(e));
          return u`
            <wa-dropdown-item
              class="usage-filter-option"
              type="checkbox"
              value=${`option:${encodeURIComponent(e)}`}
              .checked=${t}
            >
              ${e}
            </wa-dropdown-item>
          `;
        })}
      </wa-dropdown>
    `;
    },
    ue = ot(new Date());
  return le(
    u`
      <div class="usage-page">
        <section class="settings-section">
          <div class="settings-section__header">
            <h2 class="settings-section__heading">${R(`usage.filters.title`)}</h2>
            <div class="settings-section__actions">
              ${t.loading || B ? an(R(`usage.loading.badge`), B ?? ``) : f}
              ${z ? u`<span class="usage-query-hint">${R(`usage.empty.hint`)}</span>` : f}
            </div>
          </div>
          <div
            class="settings-group usage-panel usage-header ${r.headerPinned ? `pinned` : ``}"
          >
            <div class="usage-header-row">
              <div class="usage-header-metrics">
                ${
                  A
                    ? u`
                      <span class="usage-metric-badge">
                        <strong>${W(A.totalTokens)}</strong>
                        ${R(`usage.metrics.tokens`)}
                      </span>
                      <span class="usage-metric-badge">
                        <strong>${G(A.totalCost)}</strong>
                        ${R(`usage.metrics.cost`)}
                      </span>
                      <span class="usage-metric-badge">
                        <strong>${j}</strong>
                        ${R(j === 1 ? `usage.metrics.session` : `usage.metrics.sessions`)}
                      </span>
                    `
                    : f
                }
                <button
                  class="btn btn--sm usage-pin-btn ${r.headerPinned ? `active` : ``}"
                  @click=${o.onToggleHeaderPinned}
                >
                  ${r.headerPinned ? R(`usage.filters.pinned`) : R(`usage.filters.pin`)}
                </button>
                <wa-dropdown
                  class="usage-export-menu"
                  placement="bottom-end"
                  @wa-select=${(e) => {
                    switch (e.detail.item.value) {
                      case `sessions-csv`:
                        xt(`openclaw-usage-sessions-${ue}.csv`, wt(b), `text/csv`);
                        break;
                      case `daily-csv`:
                        xt(`openclaw-usage-daily-${ue}.csv`, Tt(L), `text/csv`);
                        break;
                      case `json`:
                        xt(
                          `openclaw-usage-${ue}.json`,
                          JSON.stringify(
                            { totals: A, sessions: b, daily: L, aggregates: P },
                            null,
                            2,
                          ),
                          `application/json`,
                        );
                        break;
                      case void 0:
                        break;
                    }
                  }}
                >
                  <button slot="trigger" type="button" class="btn btn--sm">
                    ${R(`usage.export.label`)} ▾
                  </button>
                  <wa-dropdown-item value="sessions-csv" ?disabled=${b.length === 0}>
                    ${R(`usage.export.sessionsCsv`)}
                  </wa-dropdown-item>
                  <wa-dropdown-item value="daily-csv" ?disabled=${L.length === 0}>
                    ${R(`usage.export.dailyCsv`)}
                  </wa-dropdown-item>
                  <wa-dropdown-item
                    value="json"
                    ?disabled=${b.length === 0 && L.length === 0}
                  >
                    ${R(`usage.export.json`)}
                  </wa-dropdown-item>
                </wa-dropdown>
              </div>
            </div>

            <div class="usage-header-row">
              <div class="usage-controls">
                ${Pt(n.selectedDays, n.selectedHours, n.selectedSessions, t.sessions, o.onClearDays, o.onClearHours, o.onClearSessions, o.onClearFilters)}
                <div class="usage-presets">
                  ${H.map(
                    (e) => u`
                      <button class="btn btn--sm" @click=${() => se(e.days)}>
                        ${e.label}
                      </button>
                    `,
                  )}
                  <button class="btn btn--sm" @click=${ce}>
                    ${R(`usage.presets.all`)}
                  </button>
                </div>
                <div class="usage-date-range">
                  <input
                    class="usage-date-input"
                    type="date"
                    .value=${n.startDate}
                    title=${R(`usage.filters.startDate`)}
                    aria-label=${R(`usage.filters.startDate`)}
                    @change=${(e) => o.onStartDateChange(e.target.value)}
                  />
                  <span class="usage-separator">${R(`usage.filters.to`)}</span>
                  <input
                    class="usage-date-input"
                    type="date"
                    .value=${n.endDate}
                    title=${R(`usage.filters.endDate`)}
                    aria-label=${R(`usage.filters.endDate`)}
                    @change=${(e) => o.onEndDateChange(e.target.value)}
                  />
                </div>
                <select
                  class="usage-select"
                  title=${R(`usage.filters.timeZone`)}
                  aria-label=${R(`usage.filters.timeZone`)}
                  .value=${n.timeZone}
                  @change=${(e) => o.onTimeZoneChange(e.target.value)}
                >
                  <option value="local">${R(`usage.filters.timeZoneLocal`)}</option>
                  <option value="utc">${R(`usage.filters.timeZoneUtc`)}</option>
                </select>
                <div class="chart-toggle">
                  <button
                    class="btn btn--sm toggle-btn ${n.scope === `instance` ? `active` : ``}"
                    title=${R(`usage.scope.instanceHint`)}
                    @click=${() => o.onScopeChange(`instance`)}
                  >
                    ${R(`usage.scope.instance`)}
                  </button>
                  <button
                    class="btn btn--sm toggle-btn ${n.scope === `family` ? `active` : ``}"
                    title=${R(`usage.scope.familyHint`)}
                    @click=${() => o.onScopeChange(`family`)}
                  >
                    ${R(`usage.scope.family`)}
                  </button>
                </div>
                <div class="chart-toggle">
                  <button
                    class="btn btn--sm toggle-btn ${l ? `active` : ``}"
                    @click=${() => s.onChartModeChange(`tokens`)}
                  >
                    ${R(`usage.metrics.tokens`)}
                  </button>
                  <button
                    class="btn btn--sm toggle-btn ${l ? `` : `active`}"
                    @click=${() => s.onChartModeChange(`cost`)}
                  >
                    ${R(`usage.metrics.cost`)}
                  </button>
                </div>
                <button
                  class="btn btn--sm primary"
                  @click=${o.onRefresh}
                  ?disabled=${t.loading}
                >
                  ${R(`common.refresh`)}
                </button>
              </div>
            </div>

            <div class="usage-query-section">
              <div class="usage-query-bar">
                <input
                  class="usage-query-input"
                  type="text"
                  .value=${n.queryDraft}
                  placeholder=${R(`usage.query.placeholder`)}
                  @input=${(e) => o.onQueryDraftChange(e.target.value)}
                  @keydown=${(e) => {
                    e.key === `Enter` && (e.preventDefault(), o.onApplyQuery());
                  }}
                />
                <div class="usage-query-actions">
                  <button
                    class="btn btn--sm"
                    @click=${o.onApplyQuery}
                    ?disabled=${t.loading || (!p && !d)}
                  >
                    ${R(`usage.query.apply`)}
                  </button>
                  ${
                    p || d
                      ? u`
                        <button class="btn btn--sm" @click=${o.onClearQuery}>
                          ${R(`usage.filters.clear`)}
                        </button>
                      `
                      : f
                  }
                  <span class="usage-query-hint">
                    ${d ? R(`usage.query.matching`, { shown: String(b.length), total: String(M) }) : R(`usage.query.inRange`, { total: String(M) })}
                  </span>
                </div>
              </div>
              <div class="usage-filter-row">
                ${U(`channel`, R(`usage.filters.channel`), w)}
                ${U(`provider`, R(`usage.filters.provider`), T)}
                ${U(`model`, R(`usage.filters.model`), E)}
                ${U(`tool`, R(`usage.filters.tool`), ne)}
                <span class="usage-query-hint">${R(`usage.query.tip`)}</span>
              </div>
              ${
                S.length > 0
                  ? u`
                    <div class="usage-query-chips">
                      ${S.map((e) => {
                        let t = e.raw;
                        return u`
                          <span class="usage-query-chip">
                            ${t}
                            <openclaw-tooltip .content=${R(`usage.filters.remove`)}>
                              <button
                                aria-label=${R(`usage.filters.remove`)}
                                @click=${() => o.onQueryDraftChange(kt(n.queryDraft, t))}
                              >
                                ×
                              </button>
                            </openclaw-tooltip>
                          </span>
                        `;
                      })}
                    </div>
                  `
                  : f
              }
              ${
                x.length > 0
                  ? u`
                    <div class="usage-query-suggestions">
                      ${x.map(
                        (e) => u`
                          <button
                            class="usage-query-suggestion"
                            @click=${() => o.onQueryDraftChange(Dt(n.queryDraft, e.value))}
                          >
                            ${e.label}
                          </button>
                        `,
                      )}
                    </div>
                  `
                  : f
              }
              ${
                ee.length > 0
                  ? u`
                    <div class="callout warning usage-callout usage-callout--tight">
                      ${ee.join(` · `)}
                    </div>
                  `
                  : f
              }
            </div>

            ${t.error ? u`<div class="callout danger usage-callout">${t.error}</div>` : f}
            ${
              B
                ? u`
                  <div class="callout warning usage-callout usage-cache-warning">
                    ${R(`usage.cacheStatus.warning`)} ${B}
                  </div>
                `
                : f
            }
            ${
              t.sessionsLimitReached
                ? u`
                  <div class="callout warning usage-callout">
                    ${R(`usage.sessions.limitReached`)}
                  </div>
                `
                : f
            }
          </div>
        </section>

        ${cn(t.providerUsage)}
        ${
          z
            ? sn(o.onRefresh)
            : u`
              ${Bt(F, I, oe, V, n.selectedDays.length === 0, Ye(N, n.timeZone), j, M)}
              ${at(N, n.timeZone, n.selectedHours, o.onSelectHour)}

              <div class="usage-grid">
                <div class="usage-grid-column">
                  <div class="settings-group usage-panel usage-left-card">
                    ${ae}
                    ${It(L, n.selectedDays, r.chartMode, r.dailyChartMode, s.onDailyChartModeChange, o.onSelectDay)}
                    ${A ? Lt(A, r.chartMode) : f}
                  </div>
                  ${Vt(b, n.selectedSessions, n.selectedDays, l, r.sessionSort, r.sessionSortDir, r.recentSessions, r.sessionsTab, c.onSelectSession, s.onSessionSortChange, s.onSessionSortDirChange, s.onSessionsTabChange, r.visibleColumns, M, o.onClearSessions)}
                </div>
                ${
                  D
                    ? u`<div class="usage-grid-column">
                      ${qt(D, i.timeSeries, i.timeSeriesLoading, i.timeSeriesMode, c.onTimeSeriesModeChange, i.timeSeriesBreakdownMode, c.onTimeSeriesBreakdownChange, i.timeSeriesCursorStart, i.timeSeriesCursorEnd, c.onTimeSeriesCursorRangeChange, n.startDate, n.endDate, n.selectedDays, i.sessionLogs, i.sessionLogsLoading, i.sessionLogsExpanded, c.onToggleSessionLogsExpanded, i.logFilters, c.onLogFilterRolesChange, c.onLogFilterToolsChange, c.onLogFilterHasToolsChange, c.onLogFilterQueryChange, c.onLogFilterClear, r.contextExpanded, c.onToggleContextExpanded, o.onClearSessions)}
                    </div>`
                    : f
                }
              </div>
            `
        }
      </div>
    `,
    { wide: !0 },
  );
}
var un = e(() => {
    (d(), pe(), ue(), z(), B(), oe(), he(), ve(), ze(), bt(), jt(), tn(), Ht());
  }),
  $;
e(() => {
  (a(),
    d(),
    s(),
    ae(),
    L(),
    fe(),
    ce(),
    S(),
    ie(),
    T(),
    O(),
    j(),
    ve(),
    ze(),
    Ve(),
    un(),
    t(),
    ($ = class extends N {
      constructor(...e) {
        (super(...e),
          (this.usageLoading = !0),
          (this.usageResult = null),
          (this.usageCostSummary = null),
          (this.providerUsageSummary = null),
          (this.usageError = null),
          (this.usageStartDate = ye()),
          (this.usageEndDate = ye()),
          (this.usageScope = `family`),
          (this.usageAgentId = null),
          (this.usageSelectedSessions = []),
          (this.usageSelectedDays = []),
          (this.usageSelectedHours = []),
          (this.usageChartMode = `tokens`),
          (this.usageDailyChartMode = `by-type`),
          (this.usageTimeSeriesMode = `per-turn`),
          (this.usageTimeSeriesBreakdownMode = `by-type`),
          (this.usageTimeSeries = null),
          (this.usageTimeSeriesLoading = !1),
          (this.usageTimeSeriesCursorStart = null),
          (this.usageTimeSeriesCursorEnd = null),
          (this.usageSessionLogs = null),
          (this.usageSessionLogsLoading = !1),
          (this.usageSessionLogsExpanded = !1),
          (this.usageQuery = ``),
          (this.usageQueryDraft = ``),
          (this.usageSessionSort = `recent`),
          (this.usageSessionSortDir = `desc`),
          (this.usageRecentSessions = []),
          (this.usageTimeZone = `local`),
          (this.usageContextExpanded = !1),
          (this.usageHeaderPinned = !1),
          (this.usageSessionsTab = `all`),
          (this.usageVisibleColumns = [...Be]),
          (this.usageLogFilterRoles = []),
          (this.usageLogFilterTools = []),
          (this.usageLogFilterHasTools = !1),
          (this.usageLogFilterQuery = ``),
          (this.client = null),
          (this.connected = !1),
          (this.usageRequestId = 0),
          (this.timeSeriesRequestId = 0),
          (this.logsRequestId = 0),
          (this.dateDebounceTimer = null),
          (this.queryDebounceTimer = null),
          (this.routeDataInitialized = !1),
          (this.routeDataEnabled = !0),
          (this.hasBoundGatewaySource = !1),
          (this.subscriptions = new k(this)
            .effect(
              () => this.context?.gateway,
              (e) => {
                let t = this.hasBoundGatewaySource;
                this.hasBoundGatewaySource = !0;
                let n = e.subscribe((e) => this.applyGatewaySnapshot(e));
                return (this.applyGatewaySnapshot(e.snapshot, t), n);
              },
            )
            .effect(
              () => this.context?.agentSelection,
              (e) => {
                let t = () => {
                  let t = e.state.scopeId,
                    n = this.observedAgentScopeId !== t;
                  ((this.observedAgentScopeId = t),
                    n &&
                      this.routeDataInitialized &&
                      this.usageAgentId !== t &&
                      ((this.usageAgentId = t),
                      this.clearSelectionsAndDetails(),
                      this.reloadUsage()),
                    this.requestUpdate());
                };
                return (t(), e.subscribe(t));
              },
            )
            .watch(
              () => this.context?.agents,
              (e, t) => e.subscribe(t),
            )));
      }
      willUpdate(e) {
        e.has(`routeData`) && (this.applyRouteData(), this.ensureInitialData());
      }
      disconnectedCallback() {
        (this.subscriptions.clear(),
          this.clearDateDebounce(),
          this.clearQueryDebounce(),
          this.invalidateRequests(),
          (this.client = null),
          (this.connected = !1),
          super.disconnectedCallback());
      }
      applyGatewaySnapshot(e, t = !1) {
        let n = t || e.client !== this.client,
          r = e.connected && !this.connected;
        if (
          ((this.client = e.client),
          (this.connected = e.connected),
          n && this.resetForClientChange(),
          !e.connected || !e.client)
        ) {
          this.invalidateRequests();
          return;
        }
        (this.context.agents.ensureList(),
          this.routeDataInitialized && (n || r) && this.loadUsage());
      }
      applyRouteData() {
        let e = this.routeData;
        if (!e || ((this.routeDataInitialized = !0), !this.routeDataEnabled)) return;
        let t = this.context.gateway,
          n = t.snapshot;
        if (
          ((this.client = n.client),
          (this.connected = n.connected),
          e.gateway !== t || e.gatewaySnapshot !== n)
        ) {
          ((this.routeDataEnabled = !1), (this.usageLoading = !1));
          return;
        }
        let r = this.context.agentSelection.state.scopeId;
        if (e.query.agentId !== r) {
          ((this.usageAgentId = r), this.clearSelectionsAndDetails(), this.reloadUsage());
          return;
        }
        ((this.usageStartDate = e.query.startDate),
          (this.usageEndDate = e.query.endDate),
          (this.usageScope = e.query.scope),
          (this.usageTimeZone = e.query.timeZone),
          (this.usageAgentId = e.query.agentId),
          (this.usageResult = e.result),
          (this.usageCostSummary = e.costSummary),
          (this.providerUsageSummary = e.providerUsageSummary),
          (this.usageError = e.error),
          (this.usageLoading = !1));
      }
      ensureInitialData() {
        this.routeDataEnabled ||
          !this.routeDataInitialized ||
          !this.client ||
          !this.connected ||
          this.usageLoading ||
          this.loadUsage();
      }
      resetForClientChange() {
        (this.clearDateDebounce(),
          this.invalidateRequests(),
          this.routeDataInitialized && (this.routeDataEnabled = !1),
          (this.usageResult = null),
          (this.usageCostSummary = null),
          (this.providerUsageSummary = null),
          (this.usageError = null),
          (this.usageAgentId = this.context.agentSelection.state.scopeId),
          this.clearSelectionsAndDetails());
      }
      invalidateRequests() {
        ((this.usageRequestId += 1),
          (this.timeSeriesRequestId += 1),
          (this.logsRequestId += 1),
          (this.usageLoading = !1),
          (this.usageTimeSeriesLoading = !1),
          (this.usageSessionLogsLoading = !1));
      }
      invalidateUsageRequest() {
        ((this.usageRequestId += 1), (this.routeDataEnabled = !1), (this.usageLoading = !1));
      }
      invalidateDetailRequests() {
        ((this.timeSeriesRequestId += 1),
          (this.logsRequestId += 1),
          (this.usageTimeSeriesLoading = !1),
          (this.usageSessionLogsLoading = !1));
      }
      isCurrentRequest(e, t) {
        let n = this.context.gateway.snapshot;
        return this.isConnected && e === this.usageRequestId && n.client === t;
      }
      isCurrentDetailRequest(e, t, n, r) {
        let i = this.context.gateway.snapshot;
        return (
          this.isConnected &&
          e === t &&
          i.client === n &&
          this.usageSelectedSessions.length === 1 &&
          this.usageSelectedSessions[0] === r
        );
      }
      async loadUsage() {
        let e = this.client;
        if (!e || !this.connected || this.usageLoading) return;
        this.routeDataEnabled = !1;
        let t = ++this.usageRequestId,
          n = this.usageStartDate,
          r = this.usageEndDate,
          i = this.usageScope,
          a = this.usageTimeZone,
          o = m(this.usageAgentId ?? ``) || void 0;
        ((this.usageLoading = !0), (this.usageError = null));
        try {
          let s = o ? { agentId: o } : { agentScope: `all` },
            [c, l, u] = await Promise.all([
              re(e, { startDate: n, endDate: r, agentId: o, scope: i, timeZone: a }),
              e.request(`usage.cost`, { startDate: n, endDate: r, ...s, ...M(a) }),
              e.request(`usage.status`).catch(() => null),
            ]);
          if (!this.isCurrentRequest(t, e)) return;
          ((this.usageResult = c), (this.usageCostSummary = l), (this.providerUsageSummary = u));
        } catch (n) {
          if (!this.isCurrentRequest(t, e)) return;
          C(n)
            ? ((this.usageResult = null),
              (this.usageCostSummary = null),
              (this.usageError = w(`usage`)))
            : (this.usageError = be(n));
        } finally {
          this.isCurrentRequest(t, e) && (this.usageLoading = !1);
        }
      }
      async loadSessionTimeSeries(e) {
        let t = this.client;
        if (!t || !this.connected) return;
        let n = ++this.timeSeriesRequestId;
        this.usageTimeSeriesLoading = !0;
        try {
          let r = await D(t, e);
          this.isCurrentDetailRequest(n, this.timeSeriesRequestId, t, e) &&
            (this.usageTimeSeries = r);
        } catch {
        } finally {
          this.isCurrentDetailRequest(n, this.timeSeriesRequestId, t, e) &&
            (this.usageTimeSeriesLoading = !1);
        }
      }
      async loadSessionLogs(e) {
        let t = this.client;
        if (!t || !this.connected) return;
        let n = ++this.logsRequestId;
        this.usageSessionLogsLoading = !0;
        try {
          let r = await P(t, e);
          if (!this.isCurrentDetailRequest(n, this.logsRequestId, t, e)) return;
          this.usageSessionLogs = Array.isArray(r.logs) ? r.logs : null;
        } catch {
        } finally {
          this.isCurrentDetailRequest(n, this.logsRequestId, t, e) &&
            (this.usageSessionLogsLoading = !1);
        }
      }
      clearSelections() {
        ((this.usageSelectedDays = []),
          (this.usageSelectedHours = []),
          (this.usageSelectedSessions = []));
      }
      clearDetails() {
        (this.invalidateDetailRequests(),
          (this.usageTimeSeries = null),
          (this.usageSessionLogs = null),
          (this.usageTimeSeriesCursorStart = null),
          (this.usageTimeSeriesCursorEnd = null));
      }
      clearSelectionsAndDetails() {
        (this.clearSelections(), this.clearDetails());
      }
      clearDateDebounce() {
        this.dateDebounceTimer !== null &&
          (window.clearTimeout(this.dateDebounceTimer), (this.dateDebounceTimer = null));
      }
      scheduleUsageLoad() {
        (this.clearDateDebounce(),
          this.invalidateUsageRequest(),
          (this.dateDebounceTimer = window.setTimeout(() => {
            ((this.dateDebounceTimer = null), this.loadUsage());
          }, 400)));
      }
      reloadUsage() {
        (this.clearDateDebounce(), this.invalidateUsageRequest(), this.loadUsage());
      }
      clearQueryDebounce() {
        this.queryDebounceTimer !== null &&
          (window.clearTimeout(this.queryDebounceTimer), (this.queryDebounceTimer = null));
      }
      selectSession(e, t) {
        if (
          (this.clearDetails(),
          (this.usageRecentSessions = [e, ...this.usageRecentSessions.filter((t) => t !== e)].slice(
            0,
            8,
          )),
          (this.usageSelectedSessions = Se(
            this.usageSelectedSessions,
            e,
            this.usageResult?.sessions ?? [],
            this.usageChartMode === `tokens`,
            t,
          )),
          this.usageSelectedSessions.length === 1)
        ) {
          let e = this.usageSelectedSessions[0];
          e && (this.loadSessionTimeSeries(e), this.loadSessionLogs(e));
        }
      }
      render() {
        let e = {
          data: {
            loading: this.usageLoading,
            error: this.usageError,
            sessions: this.usageResult?.sessions ?? [],
            agents:
              this.context.agents.state.agentsList?.agents.map((e) => e.id).filter(Boolean) ?? [],
            sessionsLimitReached: (this.usageResult?.sessions.length ?? 0) >= 1e3,
            totals: this.usageResult?.totals ?? null,
            aggregates: this.usageResult?.aggregates ?? null,
            costDaily: this.usageCostSummary?.daily ?? [],
            cacheStatus: ge(this.usageResult?.cacheStatus, this.usageCostSummary?.cacheStatus),
            providerUsage: this.providerUsageSummary?.providers ?? [],
          },
          filters: {
            startDate: this.usageStartDate,
            endDate: this.usageEndDate,
            scope: this.usageScope,
            selectedSessions: this.usageSelectedSessions,
            selectedDays: this.usageSelectedDays,
            selectedHours: this.usageSelectedHours,
            agentId: this.usageAgentId,
            query: this.usageQuery,
            queryDraft: this.usageQueryDraft,
            timeZone: this.usageTimeZone,
          },
          display: {
            chartMode: this.usageChartMode,
            dailyChartMode: this.usageDailyChartMode,
            sessionSort: this.usageSessionSort,
            sessionSortDir: this.usageSessionSortDir,
            recentSessions: this.usageRecentSessions,
            sessionsTab: this.usageSessionsTab,
            visibleColumns: this.usageVisibleColumns,
            contextExpanded: this.usageContextExpanded,
            headerPinned: this.usageHeaderPinned,
          },
          detail: {
            timeSeriesMode: this.usageTimeSeriesMode,
            timeSeriesBreakdownMode: this.usageTimeSeriesBreakdownMode,
            timeSeries: this.usageTimeSeries,
            timeSeriesLoading: this.usageTimeSeriesLoading,
            timeSeriesCursorStart: this.usageTimeSeriesCursorStart,
            timeSeriesCursorEnd: this.usageTimeSeriesCursorEnd,
            sessionLogs: this.usageSessionLogs,
            sessionLogsLoading: this.usageSessionLogsLoading,
            sessionLogsExpanded: this.usageSessionLogsExpanded,
            logFilters: {
              roles: this.usageLogFilterRoles,
              tools: this.usageLogFilterTools,
              hasTools: this.usageLogFilterHasTools,
              query: this.usageLogFilterQuery,
            },
          },
          callbacks: {
            filters: {
              onStartDateChange: (e) => {
                ((this.usageStartDate = e),
                  this.clearSelectionsAndDetails(),
                  this.scheduleUsageLoad());
              },
              onEndDateChange: (e) => {
                ((this.usageEndDate = e),
                  this.clearSelectionsAndDetails(),
                  this.scheduleUsageLoad());
              },
              onScopeChange: (e) => {
                ((this.usageScope = e), this.clearSelectionsAndDetails(), this.reloadUsage());
              },
              onAgentChange: (e) => {
                this.context.agentSelection.setScope(e);
              },
              onRefresh: () => this.reloadUsage(),
              onTimeZoneChange: (e) => {
                ((this.usageTimeZone = e), this.clearSelectionsAndDetails(), this.reloadUsage());
              },
              onToggleHeaderPinned: () => {
                this.usageHeaderPinned = !this.usageHeaderPinned;
              },
              onSelectHour: (e, t) => {
                this.usageSelectedHours = xe(
                  this.usageSelectedHours,
                  e,
                  Array.from({ length: 24 }, (e, t) => t),
                  t,
                  !0,
                );
              },
              onQueryDraftChange: (e) => {
                ((this.usageQueryDraft = e),
                  this.clearQueryDebounce(),
                  (this.queryDebounceTimer = window.setTimeout(() => {
                    ((this.usageQuery = this.usageQueryDraft), (this.queryDebounceTimer = null));
                  }, 250)));
              },
              onApplyQuery: () => {
                (this.clearQueryDebounce(), (this.usageQuery = this.usageQueryDraft));
              },
              onClearQuery: () => {
                (this.clearQueryDebounce(), (this.usageQueryDraft = ``), (this.usageQuery = ``));
              },
              onSelectDay: (e, t) => {
                this.usageSelectedDays = xe(
                  this.usageSelectedDays,
                  e,
                  (this.usageCostSummary?.daily ?? []).map((e) => e.date),
                  t,
                  !1,
                );
              },
              onClearDays: () => {
                this.usageSelectedDays = [];
              },
              onClearHours: () => {
                this.usageSelectedHours = [];
              },
              onClearSessions: () => {
                ((this.usageSelectedSessions = []), this.clearDetails());
              },
              onClearFilters: () => this.clearSelectionsAndDetails(),
            },
            display: {
              onChartModeChange: (e) => {
                this.usageChartMode = e;
              },
              onDailyChartModeChange: (e) => {
                this.usageDailyChartMode = e;
              },
              onSessionSortChange: (e) => {
                this.usageSessionSort = e;
              },
              onSessionSortDirChange: (e) => {
                this.usageSessionSortDir = e;
              },
              onSessionsTabChange: (e) => {
                this.usageSessionsTab = e;
              },
              onToggleColumn: (e) => {
                this.usageVisibleColumns = this.usageVisibleColumns.includes(e)
                  ? this.usageVisibleColumns.filter((t) => t !== e)
                  : [...this.usageVisibleColumns, e];
              },
            },
            details: {
              onToggleContextExpanded: () => {
                this.usageContextExpanded = !this.usageContextExpanded;
              },
              onToggleSessionLogsExpanded: () => {
                this.usageSessionLogsExpanded = !this.usageSessionLogsExpanded;
              },
              onLogFilterRolesChange: (e) => {
                this.usageLogFilterRoles = e;
              },
              onLogFilterToolsChange: (e) => {
                this.usageLogFilterTools = e;
              },
              onLogFilterHasToolsChange: (e) => {
                this.usageLogFilterHasTools = e;
              },
              onLogFilterQueryChange: (e) => {
                this.usageLogFilterQuery = e;
              },
              onLogFilterClear: () => {
                ((this.usageLogFilterRoles = []),
                  (this.usageLogFilterTools = []),
                  (this.usageLogFilterHasTools = !1),
                  (this.usageLogFilterQuery = ``));
              },
              onSelectSession: (e, t) => this.selectSession(e, t),
              onTimeSeriesModeChange: (e) => {
                this.usageTimeSeriesMode = e;
              },
              onTimeSeriesBreakdownChange: (e) => {
                this.usageTimeSeriesBreakdownMode = e;
              },
              onTimeSeriesCursorRangeChange: (e, t) => {
                ((this.usageTimeSeriesCursorStart = e), (this.usageTimeSeriesCursorEnd = t));
              },
            },
          },
        };
        return u`
      <section class="content-header content-header--page">
        <div>
          <div class="page-title">${I(`usage`)}</div>
        </div>
        ${de({ agents: this.context.agents.state.agentsList?.agents ?? [], additionalAgentIds: this.usageResult?.sessions.map((e) => e.agentId).filter((e) => !!e?.trim()) ?? [], selection: this.context.agentSelection })}
      </section>
      ${se(ln(e))}
    `;
      }
    }),
    n([o({ context: F, subscribe: !0 })], $.prototype, `context`, void 0),
    n([l({ attribute: !1 })], $.prototype, `routeData`, void 0),
    n([c()], $.prototype, `usageLoading`, void 0),
    n([c()], $.prototype, `usageResult`, void 0),
    n([c()], $.prototype, `usageCostSummary`, void 0),
    n([c()], $.prototype, `providerUsageSummary`, void 0),
    n([c()], $.prototype, `usageError`, void 0),
    n([c()], $.prototype, `usageStartDate`, void 0),
    n([c()], $.prototype, `usageEndDate`, void 0),
    n([c()], $.prototype, `usageScope`, void 0),
    n([c()], $.prototype, `usageAgentId`, void 0),
    n([c()], $.prototype, `usageSelectedSessions`, void 0),
    n([c()], $.prototype, `usageSelectedDays`, void 0),
    n([c()], $.prototype, `usageSelectedHours`, void 0),
    n([c()], $.prototype, `usageChartMode`, void 0),
    n([c()], $.prototype, `usageDailyChartMode`, void 0),
    n([c()], $.prototype, `usageTimeSeriesMode`, void 0),
    n([c()], $.prototype, `usageTimeSeriesBreakdownMode`, void 0),
    n([c()], $.prototype, `usageTimeSeries`, void 0),
    n([c()], $.prototype, `usageTimeSeriesLoading`, void 0),
    n([c()], $.prototype, `usageTimeSeriesCursorStart`, void 0),
    n([c()], $.prototype, `usageTimeSeriesCursorEnd`, void 0),
    n([c()], $.prototype, `usageSessionLogs`, void 0),
    n([c()], $.prototype, `usageSessionLogsLoading`, void 0),
    n([c()], $.prototype, `usageSessionLogsExpanded`, void 0),
    n([c()], $.prototype, `usageQuery`, void 0),
    n([c()], $.prototype, `usageQueryDraft`, void 0),
    n([c()], $.prototype, `usageSessionSort`, void 0),
    n([c()], $.prototype, `usageSessionSortDir`, void 0),
    n([c()], $.prototype, `usageRecentSessions`, void 0),
    n([c()], $.prototype, `usageTimeZone`, void 0),
    n([c()], $.prototype, `usageContextExpanded`, void 0),
    n([c()], $.prototype, `usageHeaderPinned`, void 0),
    n([c()], $.prototype, `usageSessionsTab`, void 0),
    n([c()], $.prototype, `usageVisibleColumns`, void 0),
    n([c()], $.prototype, `usageLogFilterRoles`, void 0),
    n([c()], $.prototype, `usageLogFilterTools`, void 0),
    n([c()], $.prototype, `usageLogFilterHasTools`, void 0),
    n([c()], $.prototype, `usageLogFilterQuery`, void 0),
    customElements.define(`openclaw-usage-page`, $));
})();
//# sourceMappingURL=usage-page-Dmdyb1pt.js.map
