import { Qi as i, ea as a } from "./control-ui-core-BcbHa4vB.js";
import { o, t as s } from "./control-ui-core-CwQmiouz.js";
import { at as t, et as n, nt as r } from "./lit-runtime-DkvDG939.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
function c(e, t) {
  let n = t.trim().toUpperCase();
  return [`USD`, `EUR`, `GBP`, `CNY`, `JPY`].includes(n)
    ? new Intl.NumberFormat(void 0, {
        style: `currency`,
        currency: n,
        maximumFractionDigits: n === `JPY` ? 0 : 2,
      }).format(e)
    : `${new Intl.NumberFormat(void 0, { maximumFractionDigits: 2 }).format(e)} ${t}`;
}
function l(e) {
  return !e || !Number.isFinite(e)
    ? null
    : new Intl.DateTimeFormat(void 0, {
        month: `short`,
        day: `numeric`,
        hour: `numeric`,
        minute: `2-digit`,
      }).format(new Date(e));
}
function u(e) {
  return (e.billing ?? []).map(
    (e) => t`
      <div class="provider-usage-billing-row">
        <span>${e.label ?? (e.type === `balance` ? o(`usage.providerUsage.balance`) : e.type === `spend` ? o(`usage.providerUsage.spend`) : o(`usage.providerUsage.budget`))}</span>
        <strong>${e.type === `budget` ? `${c(e.used, e.unit)} / ${c(e.limit, e.unit)}` : c(e.amount, e.unit)}</strong>
      </div>
    `,
  );
}
function d(e, t) {
  let n = e.costHistory;
  if (!n) return 0;
  let r = new Date(),
    i = Date.UTC(r.getUTCFullYear(), r.getUTCMonth(), r.getUTCDate()),
    a = i - (Math.max(1, t) - 1) * 864e5;
  return n.daily.reduce((e, t) => {
    let n = Date.parse(`${t.date}T00:00:00Z`);
    return Number.isFinite(n) && n >= a && n <= i ? e + t.amount : e;
  }, 0);
}
function f(e) {
  let n = e.costHistory;
  if (!n || n.daily.length === 0) return r;
  let a = Math.max(...n.daily.map((e) => e.amount), 0),
    s = n.daily.reduce(
      (e, t) => ({
        requests: e.requests + (t.requests ?? 0),
        input: e.input + t.inputTokens,
        cache: e.cache + t.cacheReadTokens + t.cacheWriteTokens,
        output: e.output + t.outputTokens,
      }),
      { requests: 0, input: 0, cache: 0, output: 0 },
    );
  return t`
    <div class="provider-cost-history">
      <div class="provider-cost-windows">
        ${[
          [o(`usage.providerUsage.today`), d(e, 1)],
          [o(`usage.providerUsage.last7Days`), d(e, 7)],
          [
            o(`usage.providerUsage.lastDays`, { count: String(n.periodDays) }),
            n.daily.reduce((e, t) => e + t.amount, 0),
          ],
        ].map(
          ([e, r]) => t`
            <div class="provider-cost-window">
              <span>${e}</span>
              <strong>${c(r, n.unit)}</strong>
            </div>
          `,
        )}
      </div>
      <div class="provider-cost-chart" aria-label=${o(`usage.providerUsage.dailyCost`)}>
        ${n.daily.map(
          (e) => t`<span
            style=${`height: ${e.amount > 0 && a > 0 ? Math.max(3, (e.amount / a) * 100) : 0}%`}
            title=${`${e.date}: ${c(e.amount, n.unit)}`}
            aria-label=${`${e.date}: ${c(e.amount, n.unit)}`}
          ></span>`,
        )}
      </div>
      <div class="provider-cost-tokens">
        ${
          s.requests > 0
            ? t`<span
              >${o(`usage.providerUsage.requests`, { count: new Intl.NumberFormat().format(s.requests) })}</span
            >`
            : r
        }
        <span>${o(`usage.providerUsage.inputTokens`, { count: i(s.input) })}</span>
        <span>${o(`usage.providerUsage.cacheTokens`, { count: i(s.cache) })}</span>
        <span
          >${o(`usage.providerUsage.outputTokens`, { count: i(s.output) })}</span
        >
      </div>
      ${
        n.models.length > 0 || n.categories.length > 0
          ? t`
            <div class="provider-cost-breakdowns">
              ${
                n.models.length > 0
                  ? t`
                    <div class="provider-cost-breakdown">
                      <span class="provider-cost-breakdown__title"
                        >${o(`usage.providerUsage.topModels`)}</span
                      >
                      ${n.models.slice(0, 3).map(
                        (e) => t`
                            <div>
                              <span>${e.name}</span
                              ><strong>${i(e.totalTokens)}</strong>
                            </div>
                          `,
                      )}
                    </div>
                  `
                  : r
              }
              ${
                n.categories.length > 0
                  ? t`
                    <div class="provider-cost-breakdown">
                      <span class="provider-cost-breakdown__title"
                        >${o(`usage.providerUsage.costCategories`)}</span
                      >
                      ${n.categories.slice(0, 3).map(
                        (e) => t`
                          <div>
                            <span>${e.name}</span>
                            <strong>${c(e.amount, n.unit)}</strong>
                          </div>
                        `,
                      )}
                    </div>
                  `
                  : r
              }
            </div>
          `
          : r
      }
    </div>
  `;
}
function p(e) {
  return e.error
    ? t`<div class="provider-usage-error">${e.error}</div>`
    : t`
    ${
      e.windows.length > 0
        ? t`
          <div class="provider-usage-windows">
            ${e.windows.map((e) => {
              let n = Math.max(0, Math.min(100, e.usedPercent)),
                i = Math.max(0, 100 - n),
                a = l(e.resetAt);
              return t`
                <div class="provider-usage-window">
                  <div class="provider-usage-window__meta">
                    <span>${e.label}</span>
                    <strong
                      >${o(`usage.providerUsage.remaining`, { percent: i.toFixed(0) })}</strong
                    >
                  </div>
                  <div
                    class="provider-usage-progress"
                    role="progressbar"
                    aria-label=${e.label}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow=${n.toFixed(0)}
                  >
                    <span style=${`width: ${n}%`}></span>
                  </div>
                  ${
                    a
                      ? t`<div class="provider-usage-reset">
                        ${o(`usage.providerUsage.resets`, { date: a })}
                      </div>`
                      : r
                  }
                </div>
              `;
            })}
          </div>
        `
        : r
    }
    ${e.billing && e.billing.length > 0 ? t`<div class="provider-usage-billing">${u(e)}</div>` : r}
    ${f(e)}
    ${e.summary ? t`<div class="provider-usage-summary">${e.summary}</div>` : r}
  `;
}
var m = e(() => {
    (n(), s(), a());
  }),
  h = e(() => {});
export { m as n, p as r, h as t };
//# sourceMappingURL=usage-DhfDKqcE.js.map
