import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
function t(e = new Date()) {
  let t = String(e.getMonth() + 1).padStart(2, `0`),
    n = String(e.getDate()).padStart(2, `0`);
  return `${e.getFullYear()}-${t}-${n}`;
}
function n(e, n) {
  let r = new Date(`${e}T12:00:00`);
  return (r.setDate(r.getDate() + n), t(r));
}
function r(e) {
  let n = g.get(e);
  return (
    n ||
      ((n = {
        day: t(),
        dayPinned: !1,
        status: null,
        days: [],
        timeline: null,
        loading: !1,
        error: null,
        expandedCardIds: new Set(),
        framePreviews: new Map(),
        frameLoads: new Set(),
        framePreviewFailed: new Set(),
        standup: null,
        standupLoading: !1,
        askQuestion: ``,
        askAnswer: null,
        askLoading: !1,
        actionPending: !1,
        pollTimer: null,
        pollClient: null,
        requestUpdate: null,
      }),
      g.set(e, n)),
    n
  );
}
function i(e) {
  e.requestUpdate?.();
}
function a(e, t) {
  ((e.day = t),
    (e.timeline = null),
    (e.standup = null),
    (e.askAnswer = null),
    (e.expandedCardIds = new Set()));
}
async function o(e, t, n) {
  if (t) {
    (n?.day ? ((e.dayPinned = !0), n.day !== e.day && a(e, n.day)) : n?.today && (e.dayPinned = !1),
      n?.silent || ((e.loading = !0), (e.error = null), i(e)));
    try {
      let [n, r, i] = await Promise.all([
        t.request(`logbook.status`, {}),
        t.request(`logbook.days`, {}),
        t.request(`logbook.timeline`, { day: e.day }),
      ]);
      ((e.status = n),
        (e.days = r.days),
        !e.dayPinned && n.today !== e.day
          ? (a(e, n.today), (e.timeline = await t.request(`logbook.timeline`, { day: n.today })))
          : (e.timeline = i),
        (e.error = null));
    } catch (t) {
      e.error = t instanceof Error ? t.message : String(t);
    } finally {
      ((e.loading = !1), i(e));
    }
  }
}
function s(e) {
  let t = g.get(e);
  (t?.pollTimer && (clearInterval(t.pollTimer), (t.pollTimer = null)), t && (t.pollClient = null));
}
function c(e, t, n) {
  if (!n || !t) {
    ((e.pollTimer &&= (clearInterval(e.pollTimer), null)), (e.pollClient = null));
    return;
  }
  (e.pollTimer && e.pollClient === t) ||
    (e.pollTimer && clearInterval(e.pollTimer),
    (e.pollClient = t),
    (e.pollTimer = setInterval(() => {
      o(e, t, { silent: !0 });
    }, h)));
}
async function l(e, t, n) {
  if (!(!t || e.framePreviews.has(n) || e.frameLoads.has(n) || e.framePreviewFailed.has(n))) {
    e.frameLoads.add(n);
    try {
      let r = await t.request(`logbook.frame`, { frameId: n });
      if (e.framePreviews.size >= m) {
        let t = e.framePreviews.keys().next().value;
        t !== void 0 && e.framePreviews.delete(t);
      }
      e.framePreviews.set(n, `data:image/${r.format};base64,${r.base64}`);
    } catch {
      e.framePreviewFailed.add(n);
    } finally {
      (e.frameLoads.delete(n), i(e));
    }
  }
}
async function u(e, t, n) {
  if (!(!t || e.actionPending)) {
    ((e.actionPending = !0), i(e));
    try {
      e.status = await t.request(`logbook.capture.set`, { paused: n });
    } catch (t) {
      e.error = t instanceof Error ? t.message : String(t);
    } finally {
      ((e.actionPending = !1), i(e));
    }
  }
}
async function d(e, t) {
  if (!(!t || e.actionPending)) {
    ((e.actionPending = !0), i(e));
    try {
      let n = await t.request(`logbook.analyze.now`, {});
      !n.started && n.reason && (e.error = n.reason);
    } catch (t) {
      e.error = t instanceof Error ? t.message : String(t);
    } finally {
      ((e.actionPending = !1), i(e), o(e, t, { silent: !0 }));
    }
  }
}
async function f(e, t, n) {
  if (!t || e.standupLoading) return;
  ((e.standupLoading = !0), i(e));
  let r = e.day;
  try {
    let i = await t.request(`logbook.standup`, { day: r, refresh: n });
    e.day === r && (e.standup = i);
  } catch (t) {
    e.error = t instanceof Error ? t.message : String(t);
  } finally {
    ((e.standupLoading = !1), i(e));
  }
}
async function p(e, t) {
  let n = e.askQuestion.trim();
  if (!t || e.askLoading || n.length === 0) return;
  ((e.askLoading = !0), (e.askAnswer = null), i(e));
  let r = e.day;
  try {
    let i = await t.request(`logbook.ask`, { day: r, question: n });
    e.day === r && (e.askAnswer = i.answer);
  } catch (t) {
    e.error = t instanceof Error ? t.message : String(t);
  } finally {
    ((e.askLoading = !1), i(e));
  }
}
var m,
  h,
  g,
  _ = e(() => {
    ((m = 48), (h = 3e4), (g = new WeakMap()));
  });
_();
export {
  p as askLogbook,
  c as configureLogbookPolling,
  r as getLogbookState,
  o as loadLogbook,
  l as loadLogbookFramePreview,
  f as loadLogbookStandup,
  t as localDayKey,
  d as runLogbookAnalysisNow,
  u as setLogbookCapturePaused,
  n as shiftDay,
  s as stopLogbookPolling,
  _ as t,
};
//# sourceMappingURL=logbook-controller-Ct3F3xtd.js.map
