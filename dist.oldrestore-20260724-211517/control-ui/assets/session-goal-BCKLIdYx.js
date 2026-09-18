import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
function t(e) {
  if (!Number.isFinite(e) || e <= 0) return `0`;
  if (e < 1e3) return String(Math.round(e));
  if (e < 1e6) {
    let t = e >= 1e4 ? Math.round(e / 1e3) : Math.round(e / 100) / 10;
    return t >= 1e3 ? `1m` : `${t}k`;
  }
  return `${e >= 1e7 ? Math.round(e / 1e6) : Math.round(e / 1e5) / 10}m`;
}
function n(e) {
  return typeof e.tokenBudget == `number` && Number.isFinite(e.tokenBudget)
    ? `${t(e.tokensUsed)}/${t(e.tokenBudget)}`
    : e.tokensUsed > 0
      ? `${t(e.tokensUsed)} used`
      : null;
}
function r(e) {
  switch (e) {
    case `active`:
      return `Pursuing goal`;
    case `paused`:
      return `Goal paused`;
    case `blocked`:
      return `Goal blocked`;
    case `usage_limited`:
      return `Goal hit usage limits`;
    case `budget_limited`:
      return `Goal unmet`;
    case `complete`:
      return `Goal achieved`;
  }
  return e;
}
function i(e) {
  let t = n(e),
    i = r(e.status);
  return t ? `${i} (${t})` : i;
}
function a(e, t) {
  let n = (() => {
    switch (e.status) {
      case `active`:
        return t;
      case `paused`:
        return e.pausedAt ?? e.updatedAt;
      case `blocked`:
        return e.blockedAt ?? e.updatedAt;
      case `usage_limited`:
        return e.usageLimitedAt ?? e.updatedAt;
      case `budget_limited`:
        return e.budgetLimitedAt ?? e.updatedAt;
      case `complete`:
        return e.completedAt ?? e.updatedAt;
    }
    return e.status;
  })();
  return Math.max(0, n - e.createdAt);
}
function o(e) {
  let t = Math.max(0, Math.floor(e / 1e3));
  if (t < 60) return `${t}s`;
  let n = Math.floor(t / 60);
  if (n < 60) return `${n}m`;
  let r = Math.floor(n / 60),
    i = n % 60;
  return i > 0 ? `${r}h ${i}m` : `${r}h`;
}
function s(e) {
  let t = e.lastStatusNote ? ` - ${e.lastStatusNote}` : ``;
  return `${i(e)}: ${e.objective}${t}`;
}
var c = e(() => {});
export { n as a, i, o as n, a as o, r, c as s, s as t };
//# sourceMappingURL=session-goal-BCKLIdYx.js.map
