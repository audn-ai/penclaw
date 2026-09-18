import { o as r, t as i } from "./control-ui-core-CwQmiouz.js";
import { at as t, ot as n } from "./control-ui-foundation-s2wA1PVE.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
function a(e) {
  return typeof e == `string` && e.trim() ? e.trim() : void 0;
}
function o(e) {
  return typeof e == `number` && Number.isInteger(e) && e >= 0 ? e : void 0;
}
function s(e) {
  switch (e) {
    case `queued`:
    case `running`:
    case `completed`:
    case `failed`:
    case `cancelled`:
    case `timed_out`:
      return e;
    default:
      return null;
  }
}
function c(e) {
  switch (e) {
    case `subagent`:
    case `cron`:
    case `acp`:
    case `cli`:
      return e;
    default:
      return;
  }
}
function l(e) {
  if (
    (typeof e == `number` && Number.isFinite(e) && e >= 0) ||
    (typeof e == `string` && Number.isFinite(Date.parse(e)))
  )
    return e;
}
function u(e) {
  if (!n(e)) return null;
  let t = a(e.id),
    r = a(e.taskId) ?? t,
    i = s(e.status);
  if (!t || !r || !i) return null;
  let u = c(e.runtime),
    d = a(e.kind),
    f = a(e.title),
    p = a(e.agentId),
    m = a(e.sessionKey),
    h = a(e.childSessionKey),
    g = a(e.ownerKey),
    _ = l(e.createdAt),
    v = l(e.updatedAt),
    y = l(e.startedAt),
    b = l(e.endedAt),
    x = o(e.toolUseCount),
    S = a(e.lastToolName),
    C = a(e.progressSummary),
    w = a(e.terminalSummary),
    T = a(e.error);
  return {
    id: t,
    taskId: r,
    status: i,
    ...(d ? { kind: d } : {}),
    ...(u ? { runtime: u } : {}),
    ...(f ? { title: f } : {}),
    ...(p ? { agentId: p } : {}),
    ...(m ? { sessionKey: m } : {}),
    ...(h ? { childSessionKey: h } : {}),
    ...(g ? { ownerKey: g } : {}),
    ...(_ === void 0 ? {} : { createdAt: _ }),
    ...(v === void 0 ? {} : { updatedAt: v }),
    ...(y === void 0 ? {} : { startedAt: y }),
    ...(b === void 0 ? {} : { endedAt: b }),
    ...(x === void 0 ? {} : { toolUseCount: x }),
    ...(S ? { lastToolName: S } : {}),
    ...(C ? { progressSummary: C } : {}),
    ...(w ? { terminalSummary: w } : {}),
    ...(T ? { error: T } : {}),
  };
}
function d(e) {
  return r(T[e]);
}
function f(e) {
  return E[e];
}
function p(e) {
  switch (e.runtime) {
    case `subagent`:
      return r(`tasksPage.runtime.subagent`);
    case `cron`:
      return r(`tasksPage.runtime.cron`);
    case `acp`:
      return r(`tasksPage.runtime.acp`);
    case `cli`:
      return r(`tasksPage.runtime.cli`);
    default:
      return r(`tasksPage.runtime.unknown`);
  }
}
function m(e) {
  return e.title ?? e.kind ?? (e.runtime ? p(e) : r(`tasksPage.untitled`));
}
function h(e) {
  return e.status === `queued` || e.status === `running`
    ? (e.progressSummary ?? null)
    : e.status === `failed` || e.status === `timed_out`
      ? (e.error ?? e.terminalSummary ?? e.progressSummary ?? null)
      : (e.terminalSummary ?? e.error ?? e.progressSummary ?? null);
}
function g(e) {
  return e.status === `queued` || e.status === `running`;
}
function _(e) {
  if (typeof e == `number`) return e;
  if (typeof e == `string`) {
    let t = Date.parse(e);
    return Number.isFinite(t) ? t : 0;
  }
  return 0;
}
function v(e) {
  return e.toSorted((e, t) => {
    let n = _(t.updatedAt) - _(e.updatedAt);
    return n === 0 ? (e.id < t.id ? -1 : +(e.id > t.id)) : n;
  });
}
function y(e) {
  let t = v(e);
  return {
    active: t.filter((e) => e.status === `queued` || e.status === `running`),
    recent: t.filter((e) => e.status !== `queued` && e.status !== `running`).slice(0, 50),
  };
}
function b(e) {
  return !n(e) || !Array.isArray(e.tasks) ? null : v(e.tasks.map(u).filter((e) => e !== null));
}
function x(...e) {
  let t = new Map();
  for (let n of e) for (let e of n) t.set(e.id, e);
  return v([...t.values()]);
}
function S(e) {
  if (!n(e) || typeof e.cancelled != `boolean`) return null;
  let t = a(e.reason),
    r = u(e.task);
  return {
    found: e.found === !0,
    cancelled: e.cancelled,
    ...(t ? { reason: t } : {}),
    ...(r ? { task: r } : {}),
  };
}
function C(e) {
  if (!n(e)) return null;
  if (e.action === `restored`) return { action: `restored` };
  if (e.action === `deleted`) {
    let t = a(e.taskId);
    return t ? { action: `deleted`, taskId: t } : null;
  }
  if (e.action === `upserted`) {
    let t = u(e.task);
    return t ? { action: `upserted`, task: t } : null;
  }
  return null;
}
function w(e, t) {
  let n = C(t);
  return !n || n.action === `restored`
    ? { tasks: [...e], refetch: !0 }
    : n.action === `deleted`
      ? { tasks: v(e.filter((e) => e.id !== n.taskId)), refetch: !1 }
      : { tasks: v([n.task, ...e.filter((e) => e.id !== n.task.id)]), refetch: !1 };
}
var T,
  E,
  D = e(() => {
    (t(),
      i(),
      (T = {
        queued: `tasksPage.status.queued`,
        running: `tasksPage.status.running`,
        completed: `tasksPage.status.completed`,
        failed: `tasksPage.status.failed`,
        cancelled: `tasksPage.status.cancelled`,
        timed_out: `tasksPage.status.timedOut`,
      }),
      (E = {
        queued: `chip-warn`,
        running: `chip-warn`,
        completed: `chip-ok`,
        failed: `chip-danger`,
        cancelled: ``,
        timed_out: `chip-danger`,
      }));
  });
export {
  C as a,
  y as c,
  p as d,
  f,
  m as h,
  x as i,
  v as l,
  _ as m,
  D as n,
  S as o,
  d as p,
  g as r,
  b as s,
  w as t,
  h as u,
};
//# sourceMappingURL=data-BstlZQi9.js.map
