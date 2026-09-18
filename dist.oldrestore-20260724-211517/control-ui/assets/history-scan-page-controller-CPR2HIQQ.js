import { o as i, t as a } from "./control-ui-core-CwQmiouz.js";
import { at as t, et as n, nt as r } from "./lit-runtime-DkvDG939.js";
import {
  loadSkillWorkshopProposals as o,
  resolveSkillWorkshopAgentId as s,
  t as c,
} from "./proposals-DhWcKEKu.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
function l(e) {
  return e instanceof Error ? e.message : String(e);
}
async function u(e) {
  let t = e.gateway.snapshot.client,
    n = h.get(e.state);
  if (n) {
    (e.force && (n.pending = e), await n.promise);
    return;
  }
  if (!t || !e.gateway.snapshot.connected || e.state.running || (e.state.loaded && !e.force))
    return;
  e.state.loading = !0;
  let r = { pending: null, promise: Promise.resolve() };
  ((r.promise = Promise.resolve().then(async () => {
    try {
      let t = e;
      for (; t;) {
        let e = t,
          n = r.pending;
        r.pending = null;
        let i = e.gateway.snapshot.client;
        if (i && e.gateway.snapshot.connected && !e.state.running) {
          e.state.error = null;
          try {
            ((e.state.result = await i.request(`skills.proposals.historyStatus`, {
              agentId: e.agentId,
            })),
              (e.state.loaded = !0));
          } catch (t) {
            ((e.state.error = l(t)), (e.state.loaded = !0));
          }
        }
        let a = r.pending;
        ((r.pending = null), (t = a ?? n));
      }
    } finally {
      ((e.state.loading = !1), h.delete(e.state));
    }
  })),
    h.set(e.state, r),
    await r.promise);
}
async function d(e) {
  let t = e.gateway.snapshot.client;
  if (
    !t ||
    !e.gateway.snapshot.connected ||
    e.state.running ||
    e.state.loading ||
    (!e.state.result &&
      (await u({ ...e, force: !0 }),
      !e.state.result || ((t = e.gateway.snapshot.client), !t || !e.gateway.snapshot.connected)))
  )
    return !1;
  let n = e.state.result.hasScanned ? (e.state.result.hasMore ? `older` : `newer`) : `older`;
  ((e.state.running = !0), (e.state.error = null));
  try {
    return (
      (e.state.result = await t.request(`skills.proposals.historyScan`, {
        agentId: e.agentId,
        direction: n,
      })),
      (e.state.loaded = !0),
      !0
    );
  } catch (n) {
    let r = l(n);
    try {
      ((e.state.result = await t.request(`skills.proposals.historyStatus`, { agentId: e.agentId })),
        (e.state.loaded = !0));
    } catch {}
    return ((e.state.error = r), !1);
  } finally {
    e.state.running = !1;
  }
}
function f(e) {
  if (!e.oldestReviewedAt || !e.newestReviewedAt) return null;
  let t = new Date(e.oldestReviewedAt),
    n = new Date(e.newestReviewedAt);
  if (!Number.isFinite(t.getTime()) || !Number.isFinite(n.getTime())) return null;
  let r = new Intl.DateTimeFormat(void 0, { month: `short`, day: `numeric` }),
    a = n.toDateString() === new Date().toDateString();
  return `${r.format(t)}–${a ? i(`skillWorkshop.history.today`) : r.format(n)}`;
}
function p(e) {
  return e.running
    ? i(`skillWorkshop.history.scanning`)
    : e.result?.hasScanned
      ? e.result.hasMore
        ? i(`skillWorkshop.history.scanEarlier`)
        : i(`skillWorkshop.history.scanNew`)
      : i(`skillWorkshop.history.findIdeas`);
}
function m(e) {
  let n = e.state.result,
    a = n ? f(n) : null;
  return t`
    <section class="sw-history ${n?.hasScanned ? `is-compact` : ``}">
      <div class="sw-history__signal" aria-hidden="true">
        <span></span><span></span><span></span><span></span>
      </div>
      <div class="sw-history__copy">
        <div class="sw-history__eyebrow">${i(`skillWorkshop.history.eyebrow`)}</div>
        <h2>${i(`skillWorkshop.history.title`)}</h2>
        <p>${i(`skillWorkshop.history.body`)}</p>
        ${
          n?.hasScanned
            ? t`
              <div class="sw-history__stats" role="status">
                <span
                  >${i(`skillWorkshop.history.reviewed`, { count: String(n.reviewedSessions) })}</span
                >
                ${a ? t`<span>${a}</span>` : r}
                <span
                  >${i(`skillWorkshop.history.found`, { count: String(n.ideasFound) })}</span
                >
              </div>
              ${
                n.lastScanReviewed === 0
                  ? t`<div class="sw-history__empty-window">
                    ${i(`skillWorkshop.history.noSessions`)}
                  </div>`
                  : r
              }
            `
            : r
        }
        ${e.state.error ? t`<div class="sw-history__error" role="alert">${e.state.error}</div>` : r}
      </div>
      <div class="sw-history__action">
        <button
          class="sw-btn sw-btn--primary"
          ?disabled=${e.state.running || e.state.loading}
          @click=${e.onScan}
        >
          ${e.state.loading ? i(`skillWorkshop.history.loading`) : p(e.state)}
        </button>
        <span>${i(`skillWorkshop.history.pendingOnly`)}</span>
      </div>
    </section>
  `;
}
var h,
  g = e(() => {
    (n(), a(), (h = new WeakMap()));
  });
function _(e) {
  let t = s(e.context);
  return Promise.all([
    o(e.state, e.context, { force: e.force }),
    u({
      agentId: t,
      gateway: e.context.gateway,
      state: e.state.skillWorkshopHistoryScan,
      force: e.force,
    }),
  ]).then(() => void 0);
}
async function v(e) {
  let t = s(e.context),
    n = e.state.skillWorkshopHistoryScan;
  await d({ agentId: t, gateway: e.context.gateway, state: n });
  let r = e.current();
  if (!r || s(r.context) !== t) return;
  let i = [o(r.state, r.context, { force: !0 })];
  (r.state.skillWorkshopHistoryScan !== n &&
    i.push(
      u({
        agentId: t,
        gateway: r.context.gateway,
        state: r.state.skillWorkshopHistoryScan,
        force: !0,
      }),
    ),
    await Promise.all(i));
}
var y = e(() => {
  (g(), c());
});
y();
export {
  _ as loadSkillWorkshopPageData,
  g as n,
  m as r,
  v as runSkillWorkshopPageHistoryScan,
  y as t,
};
//# sourceMappingURL=history-scan-page-controller-CPR2HIQQ.js.map
