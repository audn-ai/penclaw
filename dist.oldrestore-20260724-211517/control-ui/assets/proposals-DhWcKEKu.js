import { Hn as r, Rn as i, Wn as a, Xn as o } from "./control-ui-core-BcbHa4vB.js";
import { A as t, D as n } from "./control-ui-foundation-s2wA1PVE.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
function s() {
  return { loading: !1, loaded: !1, running: !1, error: null, result: null };
}
function c(e) {
  return {
    skillWorkshopAgentId: e?.skillWorkshopAgentId ?? null,
    skillWorkshopLoading: e?.skillWorkshopLoading ?? !1,
    skillWorkshopLoaded: e?.skillWorkshopLoaded ?? !1,
    skillWorkshopError: e?.skillWorkshopError ?? null,
    skillWorkshopInspectingKey: e?.skillWorkshopInspectingKey ?? null,
    skillWorkshopProposals: e?.skillWorkshopProposals ?? [],
    skillWorkshopSelectedKey: e?.skillWorkshopSelectedKey ?? null,
    skillWorkshopActionBusy: e?.skillWorkshopActionBusy ?? null,
    skillWorkshopActionNotice: e?.skillWorkshopActionNotice ?? null,
    skillWorkshopActionNoticeTimer: null,
    skillWorkshopRevisionKey: e?.skillWorkshopRevisionKey ?? null,
    skillWorkshopRevisionDraft: e?.skillWorkshopRevisionDraft ?? ``,
    skillWorkshopStatusFilter: `pending`,
    skillWorkshopQuery: ``,
    skillWorkshopFilePreviewKey: null,
    skillWorkshopFilePreviewQuery: ``,
    skillWorkshopQueueWidth: 360,
    skillWorkshopMode: `today`,
    skillWorkshopUseCurrentChatForRevisions: !1,
    skillWorkshopHistoryScan: e?.skillWorkshopHistoryScan ?? s(),
  };
}
function l(e) {
  return {
    skillWorkshopAgentId: e.skillWorkshopAgentId,
    skillWorkshopLoading: e.skillWorkshopLoading,
    skillWorkshopLoaded: e.skillWorkshopLoaded,
    skillWorkshopError: e.skillWorkshopError,
    skillWorkshopInspectingKey: e.skillWorkshopInspectingKey,
    skillWorkshopProposals: e.skillWorkshopProposals,
    skillWorkshopSelectedKey: e.skillWorkshopSelectedKey,
    skillWorkshopActionBusy: e.skillWorkshopActionBusy,
    skillWorkshopActionNotice: e.skillWorkshopActionNotice,
    skillWorkshopRevisionKey: e.skillWorkshopRevisionKey,
    skillWorkshopRevisionDraft: e.skillWorkshopRevisionDraft,
    skillWorkshopHistoryScan: e.skillWorkshopHistoryScan,
  };
}
var u = e(() => {});
function d(e) {
  return e instanceof Error ? e.message : String(e);
}
function f(e) {
  let t = e.gateway.snapshot,
    n = a(t.sessionKey)?.agentId,
    i = e.agentSelection.state.selectedId;
  return { agentId: n ? r(n) : i ? r(i) : o(t) };
}
function p(e) {
  return f(e).agentId;
}
function m(e, t) {
  return { agentId: e.skillWorkshopAgentId ?? f(t).agentId };
}
function h(e, t) {
  ((e.skillWorkshopAgentId = t),
    (e.skillWorkshopLoaded = !1),
    (e.skillWorkshopProposals = []),
    (e.skillWorkshopSelectedKey = null),
    (e.skillWorkshopInspectingKey = null),
    (e.skillWorkshopRevisionKey = null),
    (e.skillWorkshopRevisionDraft = ``),
    (e.skillWorkshopFilePreviewKey = null),
    (e.skillWorkshopFilePreviewQuery = ``),
    (e.skillWorkshopHistoryScan = s()));
}
function g(e) {
  if (!e) return Date.now();
  let t = Date.parse(e);
  return Number.isFinite(t) ? t : Date.now();
}
function _(e) {
  let t = new Date(e);
  return new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime();
}
function v(e) {
  let t = _(Date.now()),
    n = _(e);
  return n === t ? `today` : n === t - 1440 * 60 * 1e3 ? `yesterday` : `earlier`;
}
function y(e) {
  let t = Math.max(0, Date.now() - e),
    n = Math.floor(t / 6e4);
  if (n < 1) return `now`;
  if (n < 60) return `${n}m`;
  let r = Math.floor(n / 60);
  return r < 24 ? `${r}h` : `${Math.floor(r / 24)}d`;
}
function b(e) {
  let t = Number.parseInt((e ?? ``).replace(/^v/i, ``), 10);
  return Number.isFinite(t) && t > 0 ? t : 1;
}
function x(e) {
  return !Number.isFinite(e) || e <= 0
    ? `0 B`
    : t(e, {
        style: `legacy-binary`,
        maxUnit: `kilo`,
        separator: ` `,
        fractionDigits: (e, t) => (t === `byte` ? null : 1),
      });
}
function S(e) {
  return new TextEncoder().encode(e).length;
}
function C(e) {
  return e.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, ``).trim();
}
function w(e) {
  let t = new Map((e.record.supportFiles ?? []).map((e) => [e.path, e.sizeBytes]));
  return (e.supportFiles ?? []).map((e) => ({
    path: e.path,
    size: x(t.get(e.path) ?? S(e.content)),
    contents: e.content,
  }));
}
function T(e, t) {
  let n = g(e.updatedAt),
    r = g(e.createdAt),
    i = t?.updatedAt === n;
  return {
    key: e.id,
    slug: e.skillKey,
    name: e.title || e.skillName,
    oneLine: e.description,
    body: i ? t.body : ``,
    status: e.status,
    ...(i && t.origin ? { origin: t.origin } : {}),
    version: i ? t.version : 1,
    createdAt: r,
    updatedAt: n,
    recencyGroup: v(n || r),
    ageLabel: y(n || r),
    supportFiles: i ? t.supportFiles : [],
    isNew: t?.isNew ?? !1,
  };
}
function E(e, t) {
  let n = e.record,
    r = g(n.updatedAt),
    i = g(n.createdAt);
  return {
    key: n.id,
    slug: n.target.skillKey,
    name: n.title || n.target.skillName,
    oneLine: n.description,
    body: C(e.content),
    status: n.status,
    ...(n.origin ? { origin: n.origin } : {}),
    version: b(n.proposedVersion),
    createdAt: i,
    updatedAt: r,
    recencyGroup: v(r || i),
    ageLabel: y(r || i),
    supportFiles: w(e),
    isNew: t?.isNew ?? !1,
  };
}
function D(e, t) {
  let n = e.skillWorkshopProposals,
    r = n.findIndex((e) => e.key === t.key);
  if (r < 0) {
    e.skillWorkshopProposals = [t, ...n];
    return;
  }
  e.skillWorkshopProposals = [...n.slice(0, r), t, ...n.slice(r + 1)];
}
function O(e) {
  e.skillWorkshopActionNoticeTimer &&=
    (globalThis.clearTimeout(e.skillWorkshopActionNoticeTimer), null);
}
function k(e, t, n) {
  t &&
    (O(e),
    (e.skillWorkshopActionNotice = { key: t.key, label: n, slug: t.slug || t.name }),
    (e.skillWorkshopActionNoticeTimer = globalThis.setTimeout(() => {
      (e.skillWorkshopActionNotice?.key === t.key && (e.skillWorkshopActionNotice = null),
        (e.skillWorkshopActionNoticeTimer = null));
    }, L)));
}
function A(e) {
  return e.reduce((e, t) => ((e.all += 1), (e[t.status] += 1), e), {
    all: 0,
    pending: 0,
    applied: 0,
    rejected: 0,
    quarantined: 0,
    stale: 0,
  });
}
async function j(e, t, n) {
  let r = t.gateway.snapshot,
    i = r.client;
  if (!i || !r.connected) return;
  let a = f(t).agentId;
  if (
    (e.skillWorkshopAgentId !== a && h(e, a),
    !e.skillWorkshopLoading && !(e.skillWorkshopLoaded && !n?.force))
  ) {
    ((e.skillWorkshopLoading = !0), (e.skillWorkshopError = null));
    try {
      let n = await i.request(`skills.proposals.list`, { agentId: a });
      if (f(t).agentId !== a) return;
      let r = new Map(e.skillWorkshopProposals.map((e) => [e.key, e])),
        o = (n.proposals ?? [])
          .toSorted((e, t) => g(t.updatedAt) - g(e.updatedAt))
          .map((e) => T(e, r.get(e.id)));
      ((e.skillWorkshopProposals = o),
        (e.skillWorkshopLoaded = !0),
        o.some((t) => t.key === e.skillWorkshopSelectedKey) ||
          (e.skillWorkshopSelectedKey = o[0]?.key ?? null),
        e.skillWorkshopSelectedKey && (await M(e, t, e.skillWorkshopSelectedKey)));
    } catch (t) {
      e.skillWorkshopError = d(t);
    } finally {
      ((e.skillWorkshopLoading = !1), f(t).agentId !== a && j(e, t, { force: !0 }));
    }
  }
}
async function M(e, t, n, r) {
  let i = t.gateway.snapshot,
    a = i.client;
  if (!a || !i.connected || e.skillWorkshopInspectingKey === n) return !1;
  let o = e.skillWorkshopProposals.find((e) => e.key === n);
  if (o?.body && !r?.force) return !0;
  let s = m(e, t).agentId;
  (e.skillWorkshopAgentId === null && (e.skillWorkshopAgentId = s),
    (e.skillWorkshopInspectingKey = n),
    (e.skillWorkshopError = null));
  try {
    let t = { agentId: s, proposalId: n },
      r = await a.request(`skills.proposals.inspect`, t);
    return e.skillWorkshopAgentId !== s || e.skillWorkshopInspectingKey !== n
      ? !1
      : (D(e, E(r, o)), !0);
  } catch (t) {
    return (e.skillWorkshopAgentId === s && (e.skillWorkshopError = d(t)), !1);
  } finally {
    e.skillWorkshopAgentId === s &&
      e.skillWorkshopInspectingKey === n &&
      (e.skillWorkshopInspectingKey = null);
  }
}
async function N(e, t, n) {
  (!e.skillWorkshopProposals.find((e) => e.key === n)?.body && !(await M(e, t, n))) ||
    (e.skillWorkshopSelectedKey = n);
}
async function P(e, t, n) {
  ((e.skillWorkshopLoaded = !1), await j(e, t, { force: !0 }), await M(e, t, n, { force: !0 }));
}
async function F(e, t, n, r) {
  let i = t.gateway.snapshot,
    a = i.client;
  if (!a || !i.connected || e.skillWorkshopActionBusy) return;
  let o = e.skillWorkshopProposals.find((e) => e.key === r);
  ((e.skillWorkshopActionBusy = { key: r, action: n }),
    (e.skillWorkshopActionNotice = null),
    (e.skillWorkshopError = null));
  try {
    let i = n === `apply` ? `skills.proposals.apply` : `skills.proposals.reject`,
      s = { ...m(e, t), proposalId: r };
    (await a.request(i, s),
      await P(e, t, r),
      k(
        e,
        e.skillWorkshopProposals.find((e) => e.key === r) ?? o,
        n === `apply` ? `Applied` : `Rejected`,
      ));
  } catch (t) {
    e.skillWorkshopError = d(t);
  } finally {
    e.skillWorkshopActionBusy?.key === r &&
      e.skillWorkshopActionBusy.action === n &&
      (e.skillWorkshopActionBusy = null);
  }
}
async function I(e, t, n, r) {
  if (e.skillWorkshopActionBusy) return !1;
  let i = e.skillWorkshopProposals.find((e) => e.key === n),
    a = e.skillWorkshopRevisionDraft.trim();
  if (!i || !a) return !1;
  let o = m(e, t).agentId;
  (e.skillWorkshopAgentId === null && (e.skillWorkshopAgentId = o),
    (e.skillWorkshopActionBusy = { key: n, action: `revise` }),
    (e.skillWorkshopActionNotice = null),
    (e.skillWorkshopError = null));
  try {
    return (
      await M(e, t, n),
      e.skillWorkshopAgentId === o
        ? (await r(a, e.skillWorkshopProposals.find((e) => e.key === n) ?? i, o),
          (e.skillWorkshopRevisionKey = null),
          (e.skillWorkshopRevisionDraft = ``),
          k(e, i, `Revision requested`),
          !0)
        : !1
    );
  } catch (t) {
    return ((e.skillWorkshopError = d(t)), !1);
  } finally {
    e.skillWorkshopActionBusy?.key === n &&
      e.skillWorkshopActionBusy.action === `revise` &&
      (e.skillWorkshopActionBusy = null);
  }
}
var L,
  R = e(() => {
    (n(), i(), u(), (L = 2800));
  });
R();
export {
  A as countSkillWorkshopProposals,
  c as createSkillWorkshopState,
  j as loadSkillWorkshopProposals,
  u as n,
  I as requestSkillWorkshopRevision,
  p as resolveSkillWorkshopAgentId,
  F as runSkillWorkshopLifecycleAction,
  N as selectSkillWorkshopProposal,
  l as skillWorkshopRouteData,
  R as t,
};
//# sourceMappingURL=proposals-DhWcKEKu.js.map
