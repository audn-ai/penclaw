import { n as Ze, t as Qe } from "./agent-scope-control-DLXN7_B3.js";
import {
  J as Ne,
  K as Pe,
  X as Fe,
  dt as Ie,
  nt as Le,
  q as Re,
} from "./control-ui-core--EZfp09c.js";
import {
  Ai as se,
  Bi as ce,
  Ci as p,
  Cn as m,
  Di as le,
  Ei as ue,
  Fi as h,
  Ii as g,
  J as de,
  K as fe,
  Li as pe,
  Mi as me,
  Ni as he,
  Oi as ge,
  Pi as _e,
  Si as ve,
  Ti as _,
  Wa as v,
  Xi as y,
  _i as b,
  aa as ye,
  bi as be,
  da as xe,
  di as Se,
  ea as x,
  fi as Ce,
  gi as we,
  ji as S,
  ki as Te,
  la as Ee,
  oa as De,
  sa as Oe,
  tn as C,
  vi as w,
  wi as ke,
  xi as Ae,
  yi as je,
  zi as Me,
} from "./control-ui-core-BcbHa4vB.js";
import { $ as D, J as ze, Q as Be, X as O, Z as k } from "./control-ui-core-CQDTaMS5.js";
import { o as T, t as E } from "./control-ui-core-CwQmiouz.js";
import { dt as i, ft as a } from "./control-ui-foundation-0uuDj0X3.js";
import { _ as t, g as n, u as r } from "./control-ui-foundation-CCDffryi.js";
import { J as ie, X as ae, Z as oe } from "./control-ui-foundation-s2wA1PVE.js";
import {
  D as o,
  G as s,
  T as c,
  Y as l,
  _ as ee,
  at as u,
  et as d,
  f as te,
  h as ne,
  nt as f,
  p as re,
} from "./lit-runtime-DkvDG939.js";
import { a as Je, n as Ye } from "./markdown-ERFX4kV-.js";
import { a as Xe, n as M, s as N } from "./presenter-CnPyKQkg.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
import { a as A, d as We, o as Ge, s as j, t as Ke, u as qe } from "./settings-ui-T0X7dZpU.js";
import { n as He, t as Ue } from "./settings-workspace-DRQpceJK.js";
import { t as $e } from "./web-awesome-popover-7IMHqElx.js";
import { t as Ve } from "./web-awesome-tabs-B3ooykzD.js";
function P(e) {
  return ae(e.map((e) => e.trim()).filter(Boolean));
}
function et(e) {
  let t = fe(e.runtimeConfig),
    n = e.cron.cronForm.deliveryChannel.trim() || `last`,
    r = P([
      ...(e.agentsList?.agents.map((e) => e.id.trim()) ?? []),
      ...e.cron.cronJobs.map((e) => (typeof e.agentId == `string` ? e.agentId.trim() : ``)),
    ]),
    i = P([
      ...e.modelSuggestions,
      ...se(t),
      ...e.cron.cronJobs.map((e) => {
        let t = je(e);
        return t?.kind === `agentTurn` && typeof t.model == `string` ? t.model.trim() : ``;
      }),
    ]),
    a = e.cron.cronJobs
      .map((e) => (typeof e.delivery?.to == `string` ? e.delivery.to.trim() : ``))
      .filter(Boolean),
    o = (
      n === `last`
        ? Object.values(e.channels.channelsSnapshot?.channelAccounts ?? {}).flat()
        : (e.channels.channelsSnapshot?.channelAccounts?.[n] ?? [])
    )
      .flatMap((e) => [e.accountId, e.name])
      .filter((e) => typeof e == `string`)
      .map((e) => e.trim())
      .filter(Boolean),
    s = P([...a, ...o]);
  return {
    agentSuggestions: r,
    modelSuggestions: i,
    accountTargets: o,
    deliveryToSuggestions:
      e.cron.cronForm.deliveryMode === `webhook` ? s.filter((e) => /^https?:\/\//i.test(e)) : s,
  };
}
var F,
  I,
  tt = e(() => {
    (de(),
      ve(),
      v(),
      (F = [`off`, `minimal`, `low`, `medium`, `high`]),
      (I = [
        `UTC`,
        `America/Los_Angeles`,
        `America/Denver`,
        `America/Chicago`,
        `America/New_York`,
        `Europe/London`,
        `Europe/Berlin`,
        `Asia/Tokyo`,
      ]));
  }),
  nt = e(() => {}),
  rt = e(() => {});
function L(e) {
  let t = e.tabs;
  return t
    ? u`
      <wa-tab-group
        class="settings-segmented cron-tabs"
        activation="manual"
        .active=${e.value}
        aria-label=${o(e.ariaLabel)}
        @wa-tab-show=${(t) => e.onChange(t.detail.name)}
      >
        ${e.options.map(
          (n) => u`
            <wa-tab
              slot="nav"
              id=${`${t.idPrefix}${n.value}`}
              class="settings-segmented__btn cron-tab"
              panel=${n.value}
              .active=${n.value === e.value}
              aria-controls=${t.panelId}
              data-test-id=${o(n.testId)}
            >
              ${n.label}
            </wa-tab>
          `,
        )}
      </wa-tab-group>
    `
    : u`
    <wa-radio-group
      class="settings-segmented"
      size="s"
      orientation="horizontal"
      label=${o(e.ariaLabel)}
      .value=${e.value}
      @change=${(t) => {
        let n = t.currentTarget.value;
        n !== void 0 && e.onChange(n);
      }}
    >
      ${e.options.map(
        (t) => u`
          <wa-radio
            class="settings-segmented__btn"
            appearance="button"
            value=${t.value}
            .checked=${t.value === e.value}
            data-test-id=${o(t.testId)}
          >
            ${t.label}
          </wa-radio>
        `,
      )}
    </wa-radio-group>
  `;
}
var it = e(() => {
  (d(), c(), Ve());
});
function at(e) {
  let t = e.agentScoped
      ? (e.scopedTotal ?? T(`common.na`))
      : (e.status?.jobs ?? Math.max(e.jobsTotal, e.jobs.length)),
    n =
      e.status?.enabled === !1
        ? null
        : e.agentScoped
          ? e.scopedNextWakeAtMs
          : (e.status?.nextWakeAtMs ?? null),
    r = e.failingCount;
  return u`
    <div class="cron-stats">
      <div class="cron-stat">
        <span class="cron-stat__label">${T(`cron.stats.tasks`)}</span>
        <span class="cron-stat__value">${t}</span>
      </div>
      <button
        type="button"
        class="cron-stat cron-stat--action"
        data-test-id="cron-stat-failing"
        title=${T(`cron.list.activityTab`)}
        @click=${() => {
          (e.onListTabChange(`activity`), e.onRunsFiltersChange({ cronRunsStatuses: [`error`] }));
        }}
      >
        <span class="cron-stat__label">${T(`cron.stats.failing`)}</span>
        <span
          class="cron-stat__value ${typeof r == `number` && r > 0 ? `cron-stat__value--danger` : ``}"
        >
          ${r ?? T(`common.na`)}
        </span>
        <span class="cron-stat__go" aria-hidden="true">${k(`chevronRight`)}</span>
      </button>
      <div class="cron-stat">
        <span class="cron-stat__label">${T(`cron.stats.nextWake`)}</span>
        <span class="cron-stat__value cron-stat__value--time">
          ${Xe(n)}
        </span>
      </div>
    </div>
  `;
}
var ot = e(() => {
  (d(), D(), E(), N());
});
function R(e, t, n, r) {
  return {
    id: e,
    emoji: t,
    nameKey: `cron.suggestions.ideas.${e}.name`,
    taglineKey: `cron.suggestions.ideas.${e}.tagline`,
    promptKey: `cron.suggestions.ideas.${e}.prompt`,
    scheduleKey: n,
    schedule: r,
  };
}
function st(e) {
  return {
    name: T(e.nameKey),
    payloadText: T(e.promptKey),
    payloadKind: `agentTurn`,
    sessionTarget: `isolated`,
    deliveryMode: `announce`,
    wakeMode: `now`,
    deleteAfterRun: !1,
    enabled: !0,
    ...e.schedule,
  };
}
var z,
  B,
  V,
  H,
  U,
  ct = e(() => {
    (E(),
      (z = { scheduleKind: `cron`, cronExpr: `0 9 * * 1-5` }),
      (B = { scheduleKind: `cron`, cronExpr: `0 8 * * *` }),
      (V = { scheduleKind: `cron`, cronExpr: `0 9 * * 1` }),
      (H = { scheduleKind: `every`, everyAmount: `1`, everyUnit: `hours` }),
      (U = [
        R(`repoPulse`, `🐙`, `cron.suggestions.schedules.weekdayMornings`, z),
        R(`standupGhostwriter`, `👻`, `cron.suggestions.schedules.weekdayMornings`, z),
        R(`hackerNewsScout`, `🔭`, `cron.suggestions.schedules.everyMorning`, B),
        R(`dependencyRadar`, `🛰️`, `cron.suggestions.schedules.weekly`, V),
        R(`watchdog`, `🦉`, `cron.suggestions.schedules.hourly`, H),
        R(`polyglotMinute`, `🗣️`, `cron.suggestions.schedules.everyMorning`, B),
      ]));
  });
function lt() {
  return [
    { value: `ok`, label: T(`cron.runs.runStatusOk`) },
    { value: `error`, label: T(`cron.runs.runStatusError`) },
    { value: `skipped`, label: T(`cron.runs.runStatusSkipped`) },
  ];
}
function ut() {
  return [
    { value: `delivered`, label: T(`cron.runs.deliveryDelivered`) },
    { value: `not-delivered`, label: T(`cron.runs.deliveryNotDelivered`) },
    { value: `unknown`, label: T(`cron.runs.deliveryUnknown`) },
    { value: `not-requested`, label: T(`cron.runs.deliveryNotRequested`) },
  ];
}
function W(e, t, n) {
  let r = new Set(e);
  return (n ? r.add(t) : r.delete(t), Array.from(r));
}
function G(e, t) {
  return e.length === 0 ? t : e.length <= 2 ? e.join(`, `) : `${e[0]} +${e.length - 1}`;
}
function dt(e) {
  return u`
    <div class="cron-filter-dropdown" data-filter=${e.id}>
      <wa-dropdown
        class="cron-filter-dropdown__details"
        placement="bottom-start"
        @wa-select=${(t) => {
          let n = t.detail.item.value;
          if (n === `${q}clear`) {
            e.onClear();
            return;
          }
          if (n?.startsWith(K)) {
            t.preventDefault();
            let r = n.slice(7);
            e.onToggle(r, !e.selected.includes(r));
          }
        }}
      >
        <button
          slot="trigger"
          type="button"
          class="btn btn--sm cron-filter-dropdown__trigger ${e.selected.length > 0 ? `active` : ``}"
          title=${e.title}
          aria-label=${e.title}
        >
          <span>${e.summary}</span>
          ${k(`chevronDown`)}
        </button>
        ${e.options.map(
          (t) => u`
            <wa-dropdown-item
              class="cron-filter-dropdown__option"
              type="checkbox"
              value=${`${K}${t.value}`}
              .checked=${e.selected.includes(t.value)}
            >
              ${t.label}
            </wa-dropdown-item>
          `,
        )}
        <div class="session-menu__separator" role="separator"></div>
        <wa-dropdown-item value=${`${q}clear`}>
          ${T(`cron.runs.clear`)}
        </wa-dropdown-item>
      </wa-dropdown>
    </div>
  `;
}
function ft(e) {
  let t = e.runs.toSorted((t, n) => (e.runsSortDir === `asc` ? t.ts - n.ts : n.ts - t.ts)),
    n =
      e.runsQuery.trim().length > 0 ||
      e.runsStatuses.length > 0 ||
      e.runsDeliveryStatuses.length > 0,
    r = lt(),
    i = ut(),
    a = r.filter((t) => e.runsStatuses.includes(t.value)).map((e) => e.label),
    o = i.filter((t) => e.runsDeliveryStatuses.includes(t.value)).map((e) => e.label),
    s = G(a, T(`cron.runs.allStatuses`)),
    c = G(o, T(`cron.runs.allDelivery`));
  return u`
    <div class="cron-runs">
      <div class="cron-run-filters">
        <div class="cron-search-box cron-run-filter-search">
          <span class="cron-search-box__icon" aria-hidden="true">${k(`search`)}</span>
          <input
            type="search"
            class="settings-input"
            .value=${e.runsQuery}
            aria-label=${T(`cron.runs.searchRuns`)}
            placeholder=${T(`cron.runs.searchPlaceholder`)}
            @input=${(t) => e.onRunsFiltersChange({ cronRunsQuery: t.target.value })}
          />
        </div>
        ${dt({
          id: `status`,
          title: T(`cron.runs.status`),
          summary: s,
          options: r,
          selected: e.runsStatuses,
          onToggle: (t, n) => {
            let r = W(e.runsStatuses, t, n);
            e.onRunsFiltersChange({ cronRunsStatuses: r });
          },
          onClear: () => {
            e.onRunsFiltersChange({ cronRunsStatuses: [] });
          },
        })}
        ${dt({
          id: `delivery`,
          title: T(`cron.runs.delivery`),
          summary: c,
          options: i,
          selected: e.runsDeliveryStatuses,
          onToggle: (t, n) => {
            let r = W(e.runsDeliveryStatuses, t, n);
            e.onRunsFiltersChange({ cronRunsDeliveryStatuses: r });
          },
          onClear: () => {
            e.onRunsFiltersChange({ cronRunsDeliveryStatuses: [] });
          },
        })}
        <select
          class="cron-run-sort"
          aria-label=${T(`cron.jobs.sort`)}
          title=${T(`cron.jobs.sort`)}
          .value=${e.runsSortDir}
          @change=${(t) => e.onRunsFiltersChange({ cronRunsSortDir: t.target.value })}
        >
          <option value="desc">${T(`cron.runs.newestFirst`)}</option>
          <option value="asc">${T(`cron.runs.oldestFirst`)}</option>
        </select>
      </div>
      ${
        t.length === 0
          ? n
            ? u`<div class="muted cron-runs__empty">${T(`cron.runs.noMatching`)}</div>`
            : u`
              <div class="cron-empty-state">
                <div class="cron-empty-state__title">${T(`cron.runs.emptyTitle`)}</div>
                <div class="cron-empty-state__copy">${T(`cron.runs.emptyHint`)}</div>
              </div>
            `
          : u`
            <div class="cron-runs__list">
              ${t.map((t) => gt(t, e.basePath, e.onNavigateToChat))}
            </div>
          `
      }
      ${
        e.runsHasMore
          ? u`
            <button
              class="btn btn--sm cron-load-more"
              ?disabled=${e.runsLoadingMore}
              @click=${e.onLoadMoreRuns}
            >
              ${e.runsLoadingMore ? T(`cron.list.loading`) : T(`cron.runs.loadMore`)}
            </button>
          `
          : f
      }
    </div>
  `;
}
function pt(e, t = Date.now()) {
  let n = r(e);
  return T(e > t ? `cron.runEntry.next` : `cron.runEntry.due`, { rel: n });
}
function mt(e) {
  switch (e) {
    case `ok`:
      return T(`cron.runs.runStatusOk`);
    case `error`:
      return T(`cron.runs.runStatusError`);
    case `skipped`:
      return T(`cron.runs.runStatusSkipped`);
    default:
      return T(`cron.runs.runStatusUnknown`);
  }
}
function ht(e) {
  switch (e) {
    case `delivered`:
      return T(`cron.runs.deliveryDelivered`);
    case `not-delivered`:
      return T(`cron.runs.deliveryNotDelivered`);
    case `not-requested`:
      return T(`cron.runs.deliveryNotRequested`);
    default:
      return T(`cron.runs.deliveryUnknown`);
  }
}
function gt(e, t, n) {
  let r =
      typeof e.sessionKey == `string` && e.sessionKey.trim().length > 0
        ? `${Fe(`chat`, t)}${m(e.sessionKey)}`
        : null,
    i = mt(e.status ?? `unknown`),
    a = ht(e.deliveryStatus ?? `not-requested`),
    o = e.usage,
    s =
      o && typeof o.total_tokens == `number`
        ? `${o.total_tokens} tokens`
        : o && typeof o.input_tokens == `number` && typeof o.output_tokens == `number`
          ? `${o.input_tokens} in / ${o.output_tokens} out`
          : null,
    c = e.summary || e.error || T(`cron.runEntry.noSummary`),
    l = !!e.error && !!e.summary,
    d = [a, e.model, e.provider, s].filter(Boolean);
  return u`
    <div class="cron-run-entry">
      <div class="cron-run-entry__header">
        <div class="cron-run-entry__main">
          <div class="cron-run-entry__title">
            ${e.jobName ?? e.jobId}
            <span class="muted"> · ${i}</span>
          </div>
          <div class="cron-run-entry__facts muted">${d.join(` · `)}</div>
        </div>
        <div class="cron-run-entry__meta">
          <div>${y(e.ts)}</div>
          ${typeof e.runAtMs == `number` ? u`<div class="muted">${T(`cron.runEntry.runAt`)} ${y(e.runAtMs)}</div>` : f}
          <div class="muted">${e.durationMs ?? 0}ms</div>
          ${typeof e.nextRunAtMs == `number` ? u`<div class="muted">${pt(e.nextRunAtMs)}</div>` : f}
          ${
            r
              ? u`<div>
                <a
                  class="session-link"
                  href=${r}
                  @click=${(t) => {
                    t.defaultPrevented ||
                      t.button !== 0 ||
                      t.metaKey ||
                      t.ctrlKey ||
                      t.shiftKey ||
                      t.altKey ||
                      (n && e.sessionKey && (t.preventDefault(), n(e.sessionKey)));
                  }}
                  >${T(`cron.runEntry.openRunChat`)}</a
                >
              </div>`
              : f
          }
          ${l ? u`<div class="muted">${e.error}</div>` : f}
          ${e.deliveryError ? u`<div class="muted">${e.deliveryError}</div>` : f}
        </div>
      </div>
      <div class="cron-run-entry__body chat-text">
        ${ee(Je(c))}
      </div>
    </div>
  `;
}
var K,
  q,
  _t = e(() => {
    (d(), ne(), Ne(), D(), O(), Ye(), E(), x(), C(), (K = `option:`), (q = `command:`));
  });
function vt(e) {
  let t = [`last`, ...e.channels.filter(Boolean)],
    n = e.form.deliveryChannel?.trim();
  n && !t.includes(n) && t.push(n);
  let r = new Set();
  return t.filter((e) => (r.has(e) ? !1 : (r.add(e), !0)));
}
function yt(e, t) {
  if (t === `last`) return `last`;
  let n = e.channelMeta?.find((e) => e.id === t);
  return n?.label ? n.label : (e.channelLabels?.[t] ?? t);
}
function J(e, t) {
  let n = oe(ie(t));
  return n.length === 0
    ? f
    : u`<datalist id=${e}>
    ${n.map((e) => u`<option value=${e}></option> `)}
  </datalist>`;
}
function Y(e) {
  return `cron-error-${e}`;
}
function bt(e) {
  return e === `name`
    ? `cron-name`
    : e === `scheduleAt`
      ? `cron-schedule-at`
      : e === `everyAmount`
        ? `cron-every-amount`
        : e === `cronExpr`
          ? `cron-cron-expr`
          : e === `staggerAmount`
            ? `cron-stagger-amount`
            : e === `payloadText`
              ? `cron-payload-text`
              : e === `payloadModel`
                ? `cron-payload-model`
                : e === `payloadThinking`
                  ? `cron-payload-thinking`
                  : e === `timeoutSeconds`
                    ? `cron-timeout-seconds`
                    : e === `failureAlertAfter`
                      ? `cron-failure-alert-after`
                      : e === `failureAlertCooldownSeconds`
                        ? `cron-failure-alert-cooldown-seconds`
                        : `cron-delivery-to`;
}
function xt(e, t, n) {
  return e === `payloadText`
    ? t.payloadKind === `systemEvent`
      ? T(`cron.form.mainTimelineMessage`)
      : T(`cron.form.assistantTaskPrompt`)
    : e === `deliveryTo`
      ? T(n === `webhook` ? `cron.form.webhookUrl` : `cron.form.to`)
      : {
          name: T(`cron.form.fieldName`),
          scheduleAt: T(`cron.form.runAt`),
          everyAmount: T(`cron.form.every`),
          cronExpr: T(`cron.form.expression`),
          staggerAmount: T(`cron.form.staggerWindow`),
          payloadText: T(`cron.form.assistantTaskPrompt`),
          payloadModel: T(`cron.form.model`),
          payloadThinking: T(`cron.form.thinking`),
          timeoutSeconds: T(`cron.form.timeoutSeconds`),
          deliveryTo: T(`cron.form.to`),
          failureAlertAfter: T(`cron.form.failureAlertAfter`),
          failureAlertCooldownSeconds: T(`cron.form.failureAlertCooldown`),
        }[e];
}
function St(e, t, n) {
  let r = [
      `name`,
      `scheduleAt`,
      `everyAmount`,
      `cronExpr`,
      `staggerAmount`,
      `payloadText`,
      `payloadModel`,
      `payloadThinking`,
      `timeoutSeconds`,
      `deliveryTo`,
      `failureAlertAfter`,
      `failureAlertCooldownSeconds`,
    ],
    i = [];
  for (let a of r) {
    let r = e[a];
    r && i.push({ key: a, label: xt(a, t, n), message: r, inputId: bt(a) });
  }
  return i;
}
function Ct(e) {
  let t = document.getElementById(e);
  t instanceof HTMLElement &&
    (typeof t.scrollIntoView == `function` &&
      t.scrollIntoView({ block: `center`, behavior: `smooth` }),
    t.focus());
}
function wt(e, t) {
  return e ? u`<div id=${o(t)} class="cron-help cron-error">${T(e)}</div>` : f;
}
function Tt(e) {
  return u`
    ${e}
    <span class="cron-required-marker" aria-hidden="true">*</span>
    <span class="cron-required-sr">${T(`cron.form.requiredSr`)}</span>
  `;
}
function X(e) {
  let t = e.wide ? `cron-control cron-control--wide` : `cron-control`,
    n = e.error
      ? u`<div class=${t}>
        ${e.control}${wt(e.error, e.errorId)}
      </div>`
      : u`<div class=${t}>${e.control}</div>`;
  return u`
    <div class=${e.stacked ? `settings-row settings-row--stacked` : `settings-row`}>
      <label class="settings-row__text" for=${e.controlId}>
        <span class="settings-row__title">
          ${e.required ? Tt(e.label) : e.label}
        </span>
        ${e.help ? u`<span class="settings-row__desc">${e.help}</span>` : f}
      </label>
      <div class="settings-row__control">${n}</div>
    </div>
  `;
}
function Z(e) {
  return We({
    title: e.label,
    description: e.help,
    checked: e.checked,
    disabled: e.disabled,
    onChange: e.onChange,
  });
}
function Et(e) {
  let t = e.editingJobId ? `job` : e.createOpen ? `create` : `overview`;
  return u`
    ${t === `overview` ? Dt(e) : It(e, t)}
    ${J(`cron-agent-suggestions`, e.agentSuggestions)}
    ${J(`cron-model-suggestions`, e.modelSuggestions)}
    ${J(`cron-thinking-suggestions`, e.thinkingSuggestions)}
    ${J(`cron-tz-suggestions`, e.timezoneSuggestions)}
    ${J(`cron-delivery-to-suggestions`, e.deliveryToSuggestions)}
    ${J(`cron-delivery-account-suggestions`, e.accountSuggestions)}
  `;
}
function Dt(e) {
  let t =
      e.jobsScheduleKindFilter !== `all` ||
      e.jobsLastStatusFilter !== `all` ||
      e.jobsSortBy !== `nextRunAtMs` ||
      e.jobsSortDir !== `asc`,
    n = t || e.jobsQuery.trim().length > 0 || e.jobsEnabledFilter !== `all`;
  return u`
    <section class="cron-page" data-panel-mode="overview">
      ${A(
        [
          j({}, at(e)),
          e.status && !e.status.enabled
            ? u`
          <div class="cron-error-banner" data-test-id="cron-scheduler-banner">
            <strong>${T(`cron.list.schedulerOff`)}</strong> ${T(`cron.runNotStarted.stopped`)}
          </div>
        `
            : f,
          e.error ? u`<div class="cron-error-banner">${e.error}</div>` : f,
          kt(e, t),
          u`
      <div
        id="cron-list-panel"
        class="cron-tab-panel"
        role="tabpanel"
        aria-labelledby=${`cron-list-tab-${e.listTab}`}
      >
        ${e.listTab === `activity` ? j({}, u`<div class="cron-activity">${ft(e)}</div>`) : [j({}, jt(e, n)), n ? f : Ft(e)]}
      </div>
    `,
        ],
        { wide: !0 },
      )}
    </section>
  `;
}
function Ot(e) {
  return L({
    value: e.listTab,
    options: [
      { value: `tasks`, label: T(`cron.list.tasksTab`), testId: `cron-list-tab-tasks` },
      { value: `activity`, label: T(`cron.list.activityTab`), testId: `cron-list-tab-activity` },
    ],
    ariaLabel: T(`cron.list.viewLabel`),
    tabs: { idPrefix: `cron-list-tab-`, panelId: `cron-list-panel` },
    onChange: e.onListTabChange,
  });
}
function kt(e, t) {
  return u`
    <div class="cron-toolbar">
      ${Ot(e)}
      ${
        e.listTab === `tasks`
          ? u`
            ${L({ value: e.jobsEnabledFilter, options: Jt.map((e) => ({ value: e.value, label: T(e.labelKey), testId: `cron-tab-${e.value}` })), ariaLabel: T(`cron.tabs.filterLabel`), onChange: (t) => void e.onJobsFiltersChange({ cronJobsEnabledFilter: t }) })}
            <div class="cron-search-box">
              <span class="cron-search-box__icon" aria-hidden="true">${k(`search`)}</span>
              <input
                type="search"
                class="settings-input"
                .value=${e.jobsQuery}
                aria-label=${T(`cron.list.searchPlaceholder`)}
                placeholder=${T(`cron.list.searchPlaceholder`)}
                @input=${(t) => e.onJobsFiltersChange({ cronJobsQuery: t.target.value })}
              />
            </div>
            ${At(e, t)}
          `
          : f
      }
      <div class="cron-toolbar__end">
        <button
          type="button"
          class="btn btn--sm btn--ghost cron-refresh ${e.loading ? `cron-refresh--loading` : ``}"
          ?disabled=${e.loading}
          title=${e.loading ? T(`cron.list.refreshing`) : T(`cron.list.refresh`)}
          aria-label=${T(`cron.list.refresh`)}
          @click=${e.onRefresh}
        >
          ${k(`refresh`)}
        </button>
        <button
          type="button"
          class="btn primary btn--sm cron-new-task"
          data-test-id="cron-new-task"
          @click=${() => e.onOpenCreate()}
        >
          ${k(`plus`)} ${T(`cron.list.newTask`)}
        </button>
      </div>
    </div>
  `;
}
function At(e, t) {
  return u`
    <button
      id="cron-jobs-filter-trigger"
      type="button"
      class="btn btn--sm cron-filter-popover__trigger ${t ? `active` : ``}"
      title=${T(`cron.list.filters`)}
      aria-label=${T(`cron.list.filters`)}
      aria-haspopup="dialog"
      aria-expanded="false"
    >
      ${k(`listFilter`)}
    </button>
    <wa-popover
      class="cron-filter-popover"
      for="cron-jobs-filter-trigger"
      placement="bottom-end"
      without-arrow
      @wa-show=${(e) => {
        e.currentTarget.previousElementSibling?.setAttribute(`aria-expanded`, `true`);
      }}
      @wa-hide=${(e) => {
        e.currentTarget.previousElementSibling?.setAttribute(`aria-expanded`, `false`);
      }}
    >
      <div class="cron-filter-popover__panel">
        <label class="field">
          <span>${T(`cron.jobs.schedule`)}</span>
          <select
            class="settings-select"
            data-test-id="cron-jobs-schedule-filter"
            .value=${e.jobsScheduleKindFilter}
            @change=${(t) => e.onJobsFiltersChange({ cronJobsScheduleKindFilter: t.target.value })}
          >
            <option value="all">${T(`cron.jobs.all`)}</option>
            <option value="at">${T(`cron.form.at`)}</option>
            <option value="every">${T(`cron.form.every`)}</option>
            <option value="cron">${T(`cron.form.cronOption`)}</option>
          </select>
        </label>
        <label class="field">
          <span>${T(`cron.jobs.lastRun`)}</span>
          <select
            class="settings-select"
            data-test-id="cron-jobs-last-status-filter"
            .value=${e.jobsLastStatusFilter}
            @change=${(t) => e.onJobsFiltersChange({ cronJobsLastStatusFilter: t.target.value })}
          >
            <option value="all">${T(`cron.jobs.all`)}</option>
            <option value="ok">${T(`cron.runs.runStatusOk`)}</option>
            <option value="error">${T(`cron.runs.runStatusError`)}</option>
            <option value="skipped">${T(`cron.runs.runStatusSkipped`)}</option>
            <option value="unknown">${T(`cron.runs.runStatusUnknown`)}</option>
          </select>
        </label>
        <label class="field">
          <span>${T(`cron.jobs.sort`)}</span>
          <select
            class="settings-select"
            .value=${e.jobsSortBy}
            @change=${(t) => e.onJobsFiltersChange({ cronJobsSortBy: t.target.value })}
          >
            <option value="nextRunAtMs">${T(`cron.jobs.nextRun`)}</option>
            <option value="updatedAtMs">${T(`cron.jobs.recentlyUpdated`)}</option>
            <option value="name">${T(`cron.jobs.name`)}</option>
          </select>
        </label>
        <label class="field">
          <span>${T(`cron.jobs.direction`)}</span>
          <select
            class="settings-select"
            .value=${e.jobsSortDir}
            @change=${(t) => e.onJobsFiltersChange({ cronJobsSortDir: t.target.value })}
          >
            <option value="asc">${T(`cron.jobs.ascending`)}</option>
            <option value="desc">${T(`cron.jobs.descending`)}</option>
          </select>
        </label>
        <button
          class="btn btn--sm"
          data-test-id="cron-jobs-filters-reset"
          ?disabled=${!t}
          @click=${e.onJobsFiltersReset}
        >
          ${T(`cron.jobs.reset`)}
        </button>
      </div>
    </wa-popover>
  `;
}
function jt(e, t) {
  return u`
    <div class="cron-table">
      <div class="cron-table__head" role="row">
        <span>${T(`cron.jobs.name`)}</span>
        <span>${T(`cron.jobs.schedule`)}</span>
        <span>${T(`cron.jobs.nextRun`)}</span>
        <span>${T(`cron.jobs.lastRun`)}</span>
        <span aria-hidden="true"></span>
      </div>
      ${
        e.jobs.length === 0
          ? u`
            <div class="cron-empty-state">
              <div class="cron-empty-state__title">
                ${T(t ? `cron.list.noMatching` : `cron.list.emptyTitle`)}
              </div>
              ${t ? f : u`<div class="cron-empty-state__copy">${T(`cron.list.emptyHint`)}</div>`}
            </div>
          `
          : re(
              e.jobs,
              (e) => e.id,
              (t) => Mt(t, e),
            )
      }
      <div class="cron-table__footer">
        <span class="muted">
          ${T(`cron.list.shownOf`, { shown: String(e.jobs.length), total: String(Math.max(e.jobsTotal, e.jobs.length)) })}
        </span>
        ${
          e.jobsHasMore
            ? u`
              <button
                class="btn btn--sm cron-load-more"
                ?disabled=${e.loading || e.jobsLoadingMore}
                @click=${e.onLoadMoreJobs}
              >
                ${e.jobsLoadingMore ? T(`cron.list.loading`) : T(`cron.list.loadMore`)}
              </button>
            `
            : f
        }
      </div>
    </div>
  `;
}
function Mt(e, t) {
  let n = e.state?.nextRunAtMs,
    i = typeof n == `number` && Number.isFinite(n),
    a = De(e) ? `cron-table__dot--error` : e.enabled ? `cron-table__dot--active` : ``;
  return u`
    <div
      class="cron-table__row ${e.enabled ? `` : `cron-table__row--paused`}"
      role="button"
      tabindex="0"
      data-test-id=${`cron-row-${e.id}`}
      @click=${() => t.onSelectJob(e)}
      @keydown=${(n) => {
        (n.key === `Enter` || n.key === ` `) && (n.preventDefault(), t.onSelectJob(e));
      }}
    >
      <span class="cron-table__name">
        <span class="cron-table__dot ${a}" aria-hidden="true"></span>
        <span class="cron-table__name-text">${e.name}</span>
        ${e.enabled ? f : u`<span class="muted cron-table__paused-note">${T(`cron.list.paused`)}</span>`}
      </span>
      <span class="cron-table__cell">${M(e)}</span>
      <span class="cron-table__cell">
        ${i ? r(n) : T(`common.na`)}
      </span>
      <span class="cron-table__cell cron-table__last">${Nt(e)}</span>
      <span
        class="cron-table__actions"
        @click=${(e) => e.stopPropagation()}
        @keydown=${(e) => e.stopPropagation()}
      >
        <button
          type="button"
          class="btn btn--sm btn--ghost cron-row-run"
          data-test-id=${`cron-row-run-${e.id}`}
          title=${T(`cron.actions.runNow`)}
          aria-label=${T(`cron.actions.runNow`)}
          ?disabled=${t.busy}
          @click=${() => t.onRun(e, `force`)}
        >
          ${k(`play`)}
        </button>
        ${Rt(t, e, { compact: !0, testId: `cron-row-toggle-${e.id}` })}
        ${Pt(t, e)}
      </span>
    </div>
  `;
}
function Nt(e) {
  let t = Oe(e),
    n = e.state?.lastRunAtMs,
    i = typeof n == `number` && Number.isFinite(n) ? r(n) : null;
  if (t === `unknown` || !i) return u`<span class="muted">${T(`common.na`)}</span>`;
  let a =
      t === `ok`
        ? u`<span class="cron-last-glyph cron-last-glyph--ok">${k(`check`)}</span>`
        : t === `error`
          ? u`<span class="cron-last-glyph cron-last-glyph--error">${k(`x`)}</span>`
          : u`<span class="cron-last-glyph">${k(`cornerDownRight`)}</span>`,
    o = mt(t);
  return u`
    <span class="cron-table__last-run" role="img" aria-label=${o} title=${o}>
      ${a}
      <span class="cron-table__last-time">${i}</span>
    </span>
  `;
}
function Pt(e, t) {
  return u`
    <wa-dropdown
      class="cron-job-menu"
      placement="bottom-end"
      @wa-select=${(n) => {
        switch (n.detail.item.value) {
          case `run-if-due`:
            e.onRun(t, `due`);
            break;
          case `clone`:
            e.onClone(t);
            break;
          case `remove`:
            e.onRemove(t);
            break;
          case void 0:
            break;
        }
      }}
    >
      <button
        slot="trigger"
        type="button"
        class="btn btn--sm btn--ghost cron-job-menu__trigger"
        aria-label=${T(`cron.actions.more`)}
        title=${T(`cron.actions.more`)}
      >
        ${k(`moreHorizontal`)}
      </button>
      ${Q(e, `run-if-due`, T(`cron.actions.runIfDue`))}
      ${Q(e, `clone`, T(`cron.actions.clone`))}
      ${Q(e, `remove`, T(`cron.actions.remove`), { danger: !0 })}
    </wa-dropdown>
  `;
}
function Ft(e) {
  return j(
    { title: T(`cron.suggestions.title`) },
    U.map(
      (t) => u`
        <button
          type="button"
          class="settings-row settings-row--nav cron-suggestion"
          data-suggestion=${t.id}
          @click=${() => e.onOpenCreate(st(t))}
        >
          <div class="settings-row__text">
            <span class="settings-row__title">
              <span aria-hidden="true">${t.emoji}</span> ${T(t.nameKey)}
            </span>
            <span class="settings-row__desc">${T(t.taglineKey)}</span>
          </div>
          <div class="settings-row__control">
            <span class="settings-row__value">${T(t.scheduleKey)}</span>
            <span class="settings-row__chevron">${Be.chevronRight}</span>
          </div>
        </button>
      `,
    ),
  );
}
function It(e, t) {
  let n = t === `job` ? e.jobs.find((t) => t.id === e.editingJobId) : void 0,
    r = t === `job` && !!n,
    i = t === `job` && e.detailTab === `history`;
  return u`
    <section class="cron-page cron-page--detail" data-panel-mode=${t}>
      ${A(
        [
          u`
      <div class="cron-back-row">
        <button
          type="button"
          class="cron-back"
          data-test-id="cron-back"
          ?disabled=${e.busy}
          @click=${e.onClosePanel}
        >
          ${k(`arrowLeft`)} ${T(`cron.detail.back`)}
        </button>
      </div>
    `,
          Lt(e, t, n),
          r ? zt(e) : f,
          e.error ? u`<div class="cron-error-banner">${e.error}</div>` : f,
          u`
      <div
        id="cron-detail-panel"
        class="cron-tab-panel"
        role=${r ? `tabpanel` : f}
        aria-labelledby=${r ? `cron-detail-tab-${e.detailTab}` : f}
      >
        ${i ? j({ title: T(`cron.detail.historyTitle`) }, u`<div class="cron-history">${ft(e)}</div>`) : Bt(e, t)}
      </div>
    `,
        ],
        { wide: !0 },
      )}
    </section>
  `;
}
function Lt(e, t, n) {
  let i = t === `job` ? (n?.name ?? e.form.name) : T(`cron.detail.newTitle`),
    a = n?.state?.nextRunAtMs,
    o = typeof a == `number` && Number.isFinite(a) ? ` · ${T(`cron.jobState.next`)} ${r(a)}` : ``,
    s = t === `job` && n ? `${M(n)}${o}` : T(`cron.detail.newSubtitle`);
  return u`
    <div class="cron-detail-header">
      <div class="cron-detail-header__copy">
        <div class="cron-detail-title">${i}</div>
        <div class="cron-detail-meta">
          ${t === `job` && n ? Rt(e, n) : f}
          <span class="cron-detail-sub">${s}</span>
        </div>
      </div>
      <div class="cron-detail-actions">
        ${
          t === `job` && n
            ? u`
              <button
                type="button"
                class="btn btn--sm"
                data-test-id="cron-run-now"
                ?disabled=${e.busy}
                @click=${() => e.onRun(n, `force`)}
              >
                ${k(`play`)} ${T(`cron.actions.runNow`)}
              </button>
              ${Pt(e, n)}
            `
            : f
        }
      </div>
    </div>
  `;
}
function Rt(e, t, n) {
  let r = t.enabled ? T(`cron.detail.active`) : T(`cron.detail.paused`),
    i = t.enabled ? T(`cron.actions.pause`) : T(`cron.actions.resume`);
  return u`
    <span
      class="cron-enabled-toggle"
      data-test-id=${n?.testId ?? `cron-toggle-enabled`}
      title=${n?.compact ? i : f}
    >
      ${qe({ checked: t.enabled, disabled: e.busy, ariaLabel: n?.compact ? i : r, onChange: (n) => e.onToggle(t, n) })}
      ${n?.compact ? f : u`<span class="cron-detail-sub">${r}</span>`}
    </span>
  `;
}
function zt(e) {
  return L({
    value: e.detailTab,
    options: [
      {
        value: `settings`,
        label: T(`cron.detail.settingsTab`),
        testId: `cron-detail-tab-settings`,
      },
      { value: `history`, label: T(`cron.detail.historyTitle`), testId: `cron-detail-tab-history` },
    ],
    ariaLabel: T(`cron.detail.tabsLabel`),
    tabs: { idPrefix: `cron-detail-tab-`, panelId: `cron-detail-panel` },
    onChange: e.onDetailTabChange,
  });
}
function Bt(e, t) {
  let n = e.form.payloadLocked,
    r = !n && e.form.payloadKind === `agentTurn`,
    i = e.form.sessionTarget !== `main` && (e.form.payloadKind === `agentTurn` || n),
    a = e.form.deliveryMode === `announce` && !i ? `none` : e.form.deliveryMode,
    o = St(e.fieldErrors, e.form, a),
    s = !e.busy && o.length > 0,
    c =
      s && !e.canSubmit
        ? o.length === 1
          ? T(`cron.form.fixFields`, { count: String(o.length) })
          : T(`cron.form.fixFieldsPlural`, { count: String(o.length) })
        : ``;
  return u`
    <fieldset class="cron-editor" ?disabled=${e.busy} aria-busy=${String(e.busy)}>
      ${Vt(e, { payloadLocked: n, isAgentTurn: r })} ${Ht(e)}
      ${Wt(e)}
      ${Gt(e, { supportsAnnounce: i, selectedDeliveryMode: a })}
      ${Kt(e, { mode: t, isAgentTurn: r, selectedDeliveryMode: a })}
      ${
        s
          ? u`
            <div class="cron-form-status" role="status" aria-live="polite">
              <div class="cron-form-status__title">${T(`cron.form.cantAddYet`)}</div>
              <div class="cron-help">${T(`cron.form.fillRequired`)}</div>
              <ul class="cron-form-status__list">
                ${o.map(
                  (e) => u`
                    <li>
                      <button
                        type="button"
                        class="cron-form-status__link"
                        @click=${() => Ct(e.inputId)}
                      >
                        ${e.label}: ${T(e.message)}
                      </button>
                    </li>
                  `,
                )}
              </ul>
            </div>
          `
          : f
      }
      <div class="cron-editor-actions">
        <button
          class="btn primary"
          data-test-id="cron-submit"
          ?disabled=${e.busy || !e.canSubmit}
          @click=${e.onSubmit}
        >
          ${e.busy ? T(`cron.form.saving`) : T(t === `job` ? `cron.form.saveChanges` : `cron.form.createTask`)}
        </button>
        ${
          t === `create`
            ? u`
              <button
                class="btn"
                data-test-id="cron-submit-run"
                ?disabled=${e.busy || !e.canSubmit}
                @click=${e.onSubmitRunNow}
              >
                ${T(`cron.form.createAndRun`)}
              </button>
            `
            : f
        }
        <button class="btn" ?disabled=${e.busy} @click=${e.onClosePanel}>
          ${T(`cron.form.cancel`)}
        </button>
        ${c ? u` <div class="cron-submit-reason" aria-live="polite">${c}</div> ` : f}
      </div>
    </fieldset>
  `;
}
function Q(e, t, n, r) {
  return u`
    <wa-dropdown-item
      class=${r?.danger ? `cron-job-menu__item danger` : `cron-job-menu__item`}
      value=${t}
      variant=${r?.danger ? `danger` : `default`}
      ?disabled=${e.busy}
    >
      ${n}
    </wa-dropdown-item>
  `;
}
function Vt(e, t) {
  return j(
    {},
    u`${X({
      label: t.payloadLocked
        ? T(`cron.form.command`)
        : e.form.payloadKind === `systemEvent`
          ? T(`cron.form.mainTimelineMessage`)
          : T(`cron.form.assistantTaskPrompt`),
      controlId: `cron-payload-text`,
      required: !0,
      help: t.payloadLocked
        ? void 0
        : e.form.payloadKind === `systemEvent`
          ? T(`cron.form.systemEventHelp`)
          : T(`cron.form.agentTurnHelp`),
      stacked: !0,
      wide: !0,
      error: e.fieldErrors.payloadText,
      errorId: Y(`payloadText`),
      control: u`
      <textarea
        id="cron-payload-text"
        class="settings-input"
        rows="6"
        .value=${e.form.payloadText}
        ?readonly=${t.payloadLocked}
        aria-required="true"
        placeholder=${T(`cron.form.promptPlaceholder`)}
        aria-invalid=${e.fieldErrors.payloadText ? `true` : `false`}
        aria-describedby=${o(e.fieldErrors.payloadText ? Y(`payloadText`) : void 0)}
        @input=${(t) => e.onFormChange({ payloadText: t.target.value })}
      ></textarea>
    `,
    })}${X({
      label: T(`cron.form.action`),
      controlId: `cron-payload-kind`,
      control: t.payloadLocked
        ? u`
          <input
            id="cron-payload-kind"
            class="settings-input"
            .value=${T(`cron.form.command`)}
            readonly
          />
        `
        : u`
          <select
            id="cron-payload-kind"
            class="settings-select"
            .value=${e.form.payloadKind}
            @change=${(t) => e.onFormChange({ payloadKind: t.target.value })}
          >
            <option value="systemEvent">${T(`cron.form.systemEvent`)}</option>
            <option value="agentTurn">${T(`cron.form.agentTurn`)}</option>
          </select>
        `,
    })}${
      t.isAgentTurn
        ? u`
        ${X({
          label: T(`cron.form.model`),
          controlId: `cron-payload-model`,
          help: T(`cron.form.modelHelp`),
          error: e.fieldErrors.payloadModel,
          errorId: Y(`payloadModel`),
          control: u`
            <input
              id="cron-payload-model"
              class="settings-input"
              .value=${e.form.payloadModel}
              list="cron-model-suggestions"
              placeholder=${T(`cron.form.modelPlaceholder`)}
              aria-invalid=${e.fieldErrors.payloadModel ? `true` : `false`}
              @input=${(t) => e.onFormChange({ payloadModel: t.target.value })}
            />
          `,
        })}
        ${X({
          label: T(`cron.form.thinking`),
          controlId: `cron-payload-thinking`,
          help: T(`cron.form.thinkingHelp`),
          error: e.fieldErrors.payloadThinking,
          errorId: Y(`payloadThinking`),
          control: u`
            <input
              id="cron-payload-thinking"
              class="settings-input"
              .value=${e.form.payloadThinking}
              list="cron-thinking-suggestions"
              placeholder=${T(`cron.form.thinkingPlaceholder`)}
              aria-invalid=${e.fieldErrors.payloadThinking ? `true` : `false`}
              @input=${(t) => e.onFormChange({ payloadThinking: t.target.value })}
            />
          `,
        })}
      `
        : f
    }`,
  );
}
function Ht(e) {
  let t = e.form.sessionTarget,
    n = t === `main` || t === `isolated`;
  return j(
    { title: T(`cron.detail.generalSection`) },
    u`
      ${X({
        label: T(`cron.form.fieldName`),
        controlId: `cron-name`,
        required: !0,
        error: e.fieldErrors.name,
        errorId: Y(`name`),
        control: u`
          <input
            id="cron-name"
            class="settings-input"
            aria-required="true"
            .value=${e.form.name}
            placeholder=${T(`cron.form.namePlaceholder`)}
            aria-invalid=${e.fieldErrors.name ? `true` : `false`}
            aria-describedby=${o(e.fieldErrors.name ? Y(`name`) : void 0)}
            @input=${(t) => e.onFormChange({ name: t.target.value })}
          />
        `,
      })}
      ${X({
        label: T(`cron.form.agentId`),
        controlId: `cron-agent-id`,
        help: T(`cron.form.agentHelp`),
        control: u`
          <input
            id="cron-agent-id"
            class="settings-input"
            .value=${e.form.agentId}
            list="cron-agent-suggestions"
            ?disabled=${e.form.clearAgent}
            placeholder=${T(`cron.form.agentPlaceholder`)}
            @input=${(t) => e.onFormChange({ agentId: t.target.value })}
          />
        `,
      })}
      ${X({
        label: T(`cron.form.runsIn`),
        controlId: `cron-session-target`,
        help: T(`cron.form.sessionHelp`),
        control: u`
          <select
            id="cron-session-target"
            class="settings-select"
            .value=${t}
            @change=${(t) => e.onFormChange({ sessionTarget: t.target.value })}
          >
            <option value="main">${T(`cron.form.mainSession`)}</option>
            <option value="isolated">${T(`cron.form.isolatedSession`)}</option>
            ${n ? f : u`<option value=${t}>${t}</option>`}
          </select>
        `,
      })}
    `,
  );
}
function Ut(e) {
  if (e.scheduleKind === `every`) {
    let t = e.everyAmount.trim();
    return !t || !Number.isFinite(Number(t)) || Number(t) <= 0
      ? null
      : Number(t) === 1
        ? T(
            e.everyUnit === `minutes`
              ? `cron.form.summaryEveryMinuteOne`
              : e.everyUnit === `hours`
                ? `cron.form.summaryEveryHourOne`
                : `cron.form.summaryEveryDayOne`,
          )
        : T(
            e.everyUnit === `minutes`
              ? `cron.form.summaryEveryMinutes`
              : e.everyUnit === `hours`
                ? `cron.form.summaryEveryHours`
                : `cron.form.summaryEveryDays`,
            { amount: t },
          );
  }
  if (e.scheduleKind === `at`) {
    let t = Date.parse(e.scheduleAt);
    return Number.isFinite(t) ? T(`cron.form.summaryOnce`, { at: y(t) }) : null;
  }
  if (e.scheduleKind === `cron`) {
    let t = e.cronExpr.trim();
    if (!t) return null;
    let n = e.cronTz.trim();
    return n
      ? T(`cron.form.summaryCronTz`, { expr: t, tz: n })
      : T(`cron.form.summaryCron`, { expr: t });
  }
  return e.scheduleKind === `on-exit` ? T(`cron.form.repeatOnExit`) : null;
}
function Wt(e) {
  let t = e.form,
    n = t.scheduleKind === `on-exit`,
    r = [
      ...(n
        ? [
            {
              value: `on-exit`,
              label: T(`cron.form.repeatOnExit`),
              testId: `cron-schedule-kind-on-exit`,
            },
          ]
        : []),
      { value: `every`, label: T(`cron.form.repeatInterval`), testId: `cron-schedule-kind-every` },
      { value: `at`, label: T(`cron.form.repeatOnce`), testId: `cron-schedule-kind-at` },
      { value: `cron`, label: T(`cron.form.cronOption`), testId: `cron-schedule-kind-cron` },
    ],
    i = Ut(t);
  return j(
    { title: T(`cron.detail.scheduleSection`) },
    u`
      ${Ge({ title: T(`cron.form.repeat`), description: n ? T(`cron.form.onExitHelp`) : void 0, stacked: !0, control: L({ value: t.scheduleKind, options: r, ariaLabel: T(`cron.form.repeat`), onChange: (t) => e.onFormChange({ scheduleKind: t }) }) })}
      ${
        t.scheduleKind === `at`
          ? X({
              label: T(`cron.form.runAt`),
              controlId: `cron-schedule-at`,
              required: !0,
              error: e.fieldErrors.scheduleAt,
              errorId: Y(`scheduleAt`),
              control: u`
              <input
                id="cron-schedule-at"
                class="settings-input"
                type="datetime-local"
                aria-required="true"
                .value=${t.scheduleAt}
                aria-invalid=${e.fieldErrors.scheduleAt ? `true` : `false`}
                aria-describedby=${o(e.fieldErrors.scheduleAt ? Y(`scheduleAt`) : void 0)}
                @input=${(t) => e.onFormChange({ scheduleAt: t.target.value })}
              />
            `,
            })
          : f
      }
      ${
        t.scheduleKind === `every`
          ? X({
              label: T(`cron.form.every`),
              controlId: `cron-every-amount`,
              required: !0,
              error: e.fieldErrors.everyAmount,
              errorId: Y(`everyAmount`),
              control: u`
              <div class="cron-inline-controls">
                <input
                  id="cron-every-amount"
                  class="settings-input"
                  aria-required="true"
                  .value=${t.everyAmount}
                  aria-invalid=${e.fieldErrors.everyAmount ? `true` : `false`}
                  aria-describedby=${o(e.fieldErrors.everyAmount ? Y(`everyAmount`) : void 0)}
                  placeholder=${T(`cron.form.everyAmountPlaceholder`)}
                  @input=${(t) => e.onFormChange({ everyAmount: t.target.value })}
                />
                <select
                  class="settings-select"
                  .value=${t.everyUnit}
                  aria-label=${T(`cron.form.unit`)}
                  @change=${(t) => e.onFormChange({ everyUnit: t.target.value })}
                >
                  <option value="minutes">${T(`cron.form.minutes`)}</option>
                  <option value="hours">${T(`cron.form.hours`)}</option>
                  <option value="days">${T(`cron.form.days`)}</option>
                </select>
              </div>
            `,
            })
          : f
      }
      ${
        t.scheduleKind === `cron`
          ? u`
            ${X({
              label: T(`cron.form.expression`),
              controlId: `cron-cron-expr`,
              required: !0,
              error: e.fieldErrors.cronExpr,
              errorId: Y(`cronExpr`),
              control: u`
                <input
                  id="cron-cron-expr"
                  class="settings-input mono"
                  aria-required="true"
                  .value=${t.cronExpr}
                  aria-invalid=${e.fieldErrors.cronExpr ? `true` : `false`}
                  aria-describedby=${o(e.fieldErrors.cronExpr ? Y(`cronExpr`) : void 0)}
                  placeholder=${T(`cron.form.expressionPlaceholder`)}
                  @input=${(t) => e.onFormChange({ cronExpr: t.target.value })}
                />
              `,
            })}
            ${X({
              label: T(`cron.form.timezoneOptional`),
              controlId: `cron-cron-tz`,
              help: T(`cron.form.timezoneHelp`),
              control: u`
                <input
                  id="cron-cron-tz"
                  class="settings-input"
                  .value=${t.cronTz}
                  list="cron-tz-suggestions"
                  placeholder=${T(`cron.form.timezonePlaceholder`)}
                  @input=${(t) => e.onFormChange({ cronTz: t.target.value })}
                />
              `,
            })}
          `
          : f
      }
      ${i ? u` <div class="cron-schedule-summary">${k(`clock`)}<span>${i}</span></div> ` : f}
    `,
  );
}
function Gt(e, t) {
  let n = vt(e);
  return j(
    { title: T(`cron.detail.deliverySection`) },
    u`
      ${X({
        label: T(`cron.form.deliveryModeLabel`),
        controlId: `cron-delivery-mode`,
        help: T(`cron.form.deliveryHelp`),
        control: u`
          <select
            id="cron-delivery-mode"
            class="settings-select"
            .value=${t.selectedDeliveryMode}
            @change=${(t) => e.onFormChange({ deliveryMode: t.target.value })}
          >
            ${t.supportsAnnounce ? u`<option value="announce">${T(`cron.form.announceDefault`)}</option>` : f}
            <option value="webhook">${T(`cron.form.webhookPost`)}</option>
            <option value="none">${T(`cron.form.noneInternal`)}</option>
          </select>
        `,
      })}
      ${
        t.selectedDeliveryMode === `announce`
          ? u`
            ${X({
              label: T(`cron.form.channel`),
              controlId: `cron-delivery-channel`,
              help: T(`cron.form.channelHelp`),
              control: u`
                <select
                  id="cron-delivery-channel"
                  class="settings-select"
                  .value=${e.form.deliveryChannel || `last`}
                  @change=${(t) => e.onFormChange({ deliveryChannel: t.target.value })}
                >
                  ${n.map(
                    (t) => u`<option value=${t}>
                        ${yt(e, t)}
                      </option>`,
                  )}
                </select>
              `,
            })}
            ${X({
              label: T(`cron.form.to`),
              controlId: `cron-delivery-to`,
              help: T(`cron.form.toHelp`),
              control: u`
                <input
                  id="cron-delivery-to"
                  class="settings-input"
                  .value=${e.form.deliveryTo}
                  list="cron-delivery-to-suggestions"
                  placeholder=${T(`cron.form.toPlaceholder`)}
                  @input=${(t) => e.onFormChange({ deliveryTo: t.target.value })}
                />
              `,
            })}
          `
          : f
      }
      ${
        t.selectedDeliveryMode === `webhook`
          ? X({
              label: T(`cron.form.webhookUrl`),
              controlId: `cron-delivery-to`,
              required: !0,
              help: T(`cron.form.webhookHelp`),
              error: e.fieldErrors.deliveryTo,
              errorId: Y(`deliveryTo`),
              control: u`
              <input
                id="cron-delivery-to"
                class="settings-input"
                aria-required="true"
                .value=${e.form.deliveryTo}
                list="cron-delivery-to-suggestions"
                aria-invalid=${e.fieldErrors.deliveryTo ? `true` : `false`}
                aria-describedby=${o(e.fieldErrors.deliveryTo ? Y(`deliveryTo`) : void 0)}
                placeholder=${T(`cron.form.webhookPlaceholder`)}
                @input=${(t) => e.onFormChange({ deliveryTo: t.target.value })}
              />
            `,
            })
          : f
      }
    `,
  );
}
function Kt(e, t) {
  let n = e.form.scheduleKind === `cron`,
    r = vt(e);
  return u`
    <section class="settings-section">
      <details class="cron-advanced">
        <summary class="settings-section__heading cron-advanced__summary">
          ${T(`cron.form.advanced`)}
        </summary>
        <p class="settings-section__desc">${T(`cron.form.advancedHelp`)}</p>
        <div class="settings-group">
          ${X({
            label: T(`cron.form.description`),
            controlId: `cron-description`,
            control: u`
              <input
                id="cron-description"
                class="settings-input"
                .value=${e.form.description}
                placeholder=${T(`cron.form.descriptionPlaceholder`)}
                @input=${(t) => e.onFormChange({ description: t.target.value })}
              />
            `,
          })}
          ${t.mode === `create` ? Z({ label: T(`cron.form.startEnabled`), checked: e.form.enabled, onChange: (t) => e.onFormChange({ enabled: t }) }) : f}
          ${X({
            label: T(`cron.form.wakeMode`),
            controlId: `cron-wake-mode`,
            help: T(`cron.form.wakeModeHelp`),
            control: u`
              <select
                id="cron-wake-mode"
                class="settings-select"
                .value=${e.form.wakeMode}
                @change=${(t) => e.onFormChange({ wakeMode: t.target.value })}
              >
                <option value="now">${T(`cron.form.now`)}</option>
                <option value="next-heartbeat">${T(`cron.form.nextHeartbeat`)}</option>
              </select>
            `,
          })}
          ${
            t.isAgentTurn
              ? X({
                  label: T(`cron.form.timeoutSeconds`),
                  controlId: `cron-timeout-seconds`,
                  help: T(`cron.form.timeoutHelp`),
                  error: e.fieldErrors.timeoutSeconds,
                  errorId: Y(`timeoutSeconds`),
                  control: u`
                  <input
                    id="cron-timeout-seconds"
                    class="settings-input"
                    .value=${e.form.timeoutSeconds}
                    placeholder=${T(`cron.form.timeoutPlaceholder`)}
                    aria-invalid=${e.fieldErrors.timeoutSeconds ? `true` : `false`}
                    aria-describedby=${o(e.fieldErrors.timeoutSeconds ? Y(`timeoutSeconds`) : void 0)}
                    @input=${(t) => e.onFormChange({ timeoutSeconds: t.target.value })}
                  />
                `,
                })
              : f
          }
          ${Z({ label: T(`cron.form.deleteAfterRun`), checked: e.form.deleteAfterRun, help: T(`cron.form.deleteAfterRunHelp`), onChange: (t) => e.onFormChange({ deleteAfterRun: t }) })}
          ${Z({ label: T(`cron.form.clearAgentOverride`), checked: e.form.clearAgent, help: T(`cron.form.clearAgentHelp`), onChange: (t) => e.onFormChange({ clearAgent: t }) })}
          ${X({
            label: T(`cron.form.sessionKey`),
            controlId: `cron-session-key`,
            help: T(`cron.form.sessionKeyHelp`),
            control: u`
              <input
                id="cron-session-key"
                class="settings-input"
                .value=${e.form.sessionKey}
                placeholder="agent:main:main"
                @input=${(t) => e.onFormChange({ sessionKey: t.target.value })}
              />
            `,
          })}
          ${
            n
              ? u`
                ${Z({ label: T(`cron.form.exactTiming`), checked: e.form.scheduleExact, help: T(`cron.form.exactTimingHelp`), onChange: (t) => e.onFormChange({ scheduleExact: t }) })}
                ${X({
                  label: T(`cron.form.staggerWindow`),
                  controlId: `cron-stagger-amount`,
                  error: e.fieldErrors.staggerAmount,
                  errorId: Y(`staggerAmount`),
                  control: u`
                    <div class="cron-inline-controls">
                      <input
                        id="cron-stagger-amount"
                        class="settings-input"
                        .value=${e.form.staggerAmount}
                        ?disabled=${e.form.scheduleExact}
                        aria-invalid=${e.fieldErrors.staggerAmount ? `true` : `false`}
                        aria-describedby=${o(e.fieldErrors.staggerAmount ? Y(`staggerAmount`) : void 0)}
                        placeholder=${T(`cron.form.staggerPlaceholder`)}
                        @input=${(t) => e.onFormChange({ staggerAmount: t.target.value })}
                      />
                      <select
                        class="settings-select"
                        .value=${e.form.staggerUnit}
                        ?disabled=${e.form.scheduleExact}
                        aria-label=${T(`cron.form.staggerUnit`)}
                        @change=${(t) => e.onFormChange({ staggerUnit: t.target.value })}
                      >
                        <option value="seconds">${T(`cron.form.seconds`)}</option>
                        <option value="minutes">${T(`cron.form.minutes`)}</option>
                      </select>
                    </div>
                  `,
                })}
              `
              : f
          }
          ${
            t.isAgentTurn
              ? u`
                ${X({
                  label: T(`cron.form.accountId`),
                  controlId: `cron-delivery-account-id`,
                  help: T(`cron.form.accountIdHelp`),
                  control: u`
                    <input
                      id="cron-delivery-account-id"
                      class="settings-input"
                      .value=${e.form.deliveryAccountId}
                      list="cron-delivery-account-suggestions"
                      ?disabled=${t.selectedDeliveryMode !== `announce`}
                      placeholder="default"
                      @input=${(t) => e.onFormChange({ deliveryAccountId: t.target.value })}
                    />
                  `,
                })}
                ${Z({ label: T(`cron.form.lightContext`), checked: e.form.payloadLightContext, help: T(`cron.form.lightContextHelp`), onChange: (t) => e.onFormChange({ payloadLightContext: t }) })}
                ${qt(e, r)}
              `
              : f
          }
          ${t.selectedDeliveryMode === `none` ? f : Z({ label: T(`cron.form.bestEffortDelivery`), checked: e.form.deliveryBestEffort, help: T(`cron.form.bestEffortHelp`), onChange: (t) => e.onFormChange({ deliveryBestEffort: t }) })}
        </div>
      </details>
    </section>
  `;
}
function qt(e, t) {
  return u`
    ${X({
      label: T(`cron.form.failureAlerts`),
      controlId: `cron-failure-alert-mode`,
      help: T(`cron.form.failureAlertsHelp`),
      control: u`
        <select
          id="cron-failure-alert-mode"
          class="settings-select"
          .value=${e.form.failureAlertMode}
          @change=${(t) => e.onFormChange({ failureAlertMode: t.target.value })}
        >
          <option value="inherit">${T(`cron.form.failureAlertInherit`)}</option>
          <option value="disabled">${T(`cron.form.failureAlertDisabled`)}</option>
          <option value="custom">${T(`cron.form.failureAlertCustom`)}</option>
        </select>
      `,
    })}
    ${
      e.form.failureAlertMode === `custom`
        ? u`
          ${X({
            label: T(`cron.form.failureAlertAfter`),
            controlId: `cron-failure-alert-after`,
            help: T(`cron.form.failureAlertAfterHelp`),
            error: e.fieldErrors.failureAlertAfter,
            errorId: Y(`failureAlertAfter`),
            control: u`
              <input
                id="cron-failure-alert-after"
                class="settings-input"
                .value=${e.form.failureAlertAfter}
                aria-invalid=${e.fieldErrors.failureAlertAfter ? `true` : `false`}
                aria-describedby=${o(e.fieldErrors.failureAlertAfter ? Y(`failureAlertAfter`) : void 0)}
                placeholder="2"
                @input=${(t) => e.onFormChange({ failureAlertAfter: t.target.value })}
              />
            `,
          })}
          ${X({
            label: T(`cron.form.failureAlertCooldown`),
            controlId: `cron-failure-alert-cooldown-seconds`,
            help: T(`cron.form.failureAlertCooldownHelp`),
            error: e.fieldErrors.failureAlertCooldownSeconds,
            errorId: Y(`failureAlertCooldownSeconds`),
            control: u`
              <input
                id="cron-failure-alert-cooldown-seconds"
                class="settings-input"
                .value=${e.form.failureAlertCooldownSeconds}
                aria-invalid=${e.fieldErrors.failureAlertCooldownSeconds ? `true` : `false`}
                aria-describedby=${o(e.fieldErrors.failureAlertCooldownSeconds ? Y(`failureAlertCooldownSeconds`) : void 0)}
                placeholder="3600"
                @input=${(t) => e.onFormChange({ failureAlertCooldownSeconds: t.target.value })}
              />
            `,
          })}
          ${X({
            label: T(`cron.form.failureAlertChannel`),
            controlId: `cron-failure-alert-channel`,
            control: u`
              <select
                id="cron-failure-alert-channel"
                class="settings-select"
                .value=${e.form.failureAlertChannel || `last`}
                @change=${(t) => e.onFormChange({ failureAlertChannel: t.target.value })}
              >
                ${t.map((t) => u`<option value=${t}>${yt(e, t)}</option>`)}
              </select>
            `,
          })}
          ${X({
            label: T(`cron.form.failureAlertTo`),
            controlId: `cron-failure-alert-to`,
            help: T(`cron.form.failureAlertToHelp`),
            control: u`
              <input
                id="cron-failure-alert-to"
                class="settings-input"
                .value=${e.form.failureAlertTo}
                list="cron-delivery-to-suggestions"
                placeholder=${T(`cron.form.failureAlertToPlaceholder`)}
                @input=${(t) => e.onFormChange({ failureAlertTo: t.target.value })}
              />
            `,
          })}
          ${X({
            label: T(`cron.form.failureAlertMode`),
            controlId: `cron-failure-alert-delivery-mode`,
            control: u`
              <select
                id="cron-failure-alert-delivery-mode"
                class="settings-select"
                .value=${e.form.failureAlertDeliveryMode || `announce`}
                @change=${(t) => e.onFormChange({ failureAlertDeliveryMode: t.target.value })}
              >
                <option value="announce">${T(`cron.form.failureAlertAnnounce`)}</option>
                <option value="webhook">${T(`cron.form.failureAlertWebhook`)}</option>
              </select>
            `,
          })}
          ${X({
            label: T(`cron.form.failureAlertAccountId`),
            controlId: `cron-failure-alert-account-id`,
            control: u`
              <input
                id="cron-failure-alert-account-id"
                class="settings-input"
                .value=${e.form.failureAlertAccountId}
                placeholder=${T(`cron.form.failureAlertAccountPlaceholder`)}
                @input=${(t) => e.onFormChange({ failureAlertAccountId: t.target.value })}
              />
            `,
          })}
        `
        : f
    }
  `;
}
var Jt,
  Yt = e(() => {
    (d(),
      c(),
      te(),
      nt(),
      rt(),
      D(),
      Ke(),
      ze(),
      O(),
      $e(),
      E(),
      ye(),
      x(),
      N(),
      v(),
      it(),
      ot(),
      ct(),
      _t(),
      (Jt = [
        { value: `all`, labelKey: `cron.tabs.all` },
        { value: `enabled`, labelKey: `cron.tabs.active` },
        { value: `disabled`, labelKey: `cron.tabs.paused` },
      ]));
  }),
  $;
e(() => {
  (i(),
    d(),
    s(),
    Le(),
    Re(),
    Qe(),
    Ue(),
    ve(),
    C(),
    xe(),
    Ce(),
    tt(),
    Yt(),
    t(),
    ($ = class extends Ee {
      constructor(...e) {
        (super(...e),
          (this.cron = w()),
          (this.agentsList = null),
          (this.cronModelSuggestions = []),
          (this.listTab = `tasks`),
          (this.detailTab = `settings`),
          (this.modelSuggestionsState = null),
          (this.subscriptions = new Se(this)
            .watch(
              () => this.context?.agents,
              (e, t) => e.subscribe(t),
              () => this.syncAgentsState(),
            )
            .watch(
              () => this.context?.channels,
              (e, t) => e.subscribe(t),
            )
            .watch(
              () => this.context?.runtimeConfig,
              (e, t) => e.subscribe(t),
            )
            .effect(
              () => this.context?.agentSelection,
              (e) =>
                e.subscribe((e) => {
                  if (this.cron.cronAgentId === e.scopeId) return;
                  let t = { client: this.cron.client, connected: this.cron.connected };
                  (this.resetGatewayState(t),
                    (this.cron.cronAgentId = e.scopeId),
                    (this.listTab = `tasks`),
                    (this.detailTab = `settings`),
                    this.ensureInitialData(),
                    this.requestUpdate());
                }),
            )
            .effect(
              () => this.context?.gateway,
              (e) => {
                let t = this.gatewaySource !== void 0 && this.gatewaySource !== e;
                return (
                  (this.gatewaySource = e),
                  this.syncGatewayState(e.snapshot, t),
                  this.ensureInitialData(),
                  e.subscribe((t) => {
                    this.gatewaySource === e &&
                      (this.syncGatewayState(t, !1), this.ensureInitialData());
                  })
                );
              },
            )
            .effect(
              () => this.context?.gateway,
              (e) =>
                e.subscribeEvents((t) => {
                  this.gatewaySource === e &&
                    e.snapshot.connected &&
                    e.snapshot.client &&
                    t.event === `cron` &&
                    this.refreshCron({ tableFilters: !0 });
                }),
            )),
          (this.lastPanelKey = null));
      }
      disconnectedCallback() {
        ((this.gatewaySource = void 0),
          this.resetGatewayState(),
          this.subscriptions.clear(),
          super.disconnectedCallback());
      }
      resetGatewayState(e = {}) {
        ((this.cron = w(e)),
          (this.cron.cronAgentId = this.context.agentSelection.state.scopeId),
          (this.agentsList = e.connected ? this.context.agents.state.agentsList : null),
          (this.cronModelSuggestions = []),
          (this.modelSuggestionsState = null));
      }
      syncGatewayState(e, t) {
        (t || this.cron.client !== e.client || this.cron.connected !== e.connected) &&
          this.resetGatewayState(e);
      }
      syncAgentsState() {
        this.agentsList = this.context.agents.state.agentsList;
      }
      ensureInitialData() {
        if (
          !(!this.cron.connected || !this.cron.client) &&
          (!this.agentsList &&
            !this.context.agents.state.agentsLoading &&
            this.context.agents.ensureList(),
          !this.cron.cronStatus && !this.cron.cronLoading
            ? this.refreshCron({ tableFilters: !0 })
            : !this.cron.cronRuns.length &&
              !this.cron.cronRunsLoadingMore &&
              this.loadRuns(this.cron.cronRunsScope === `all` ? null : this.cron.cronRunsJobId),
          this.modelSuggestionsState !== this.cron)
        ) {
          let e = this.cron;
          ((this.modelSuggestionsState = e), this.loadModelSuggestions(e));
        }
      }
      requestCronUpdate(e = this.cron) {
        this.cron === e && this.requestUpdate();
      }
      updated() {
        let e = `${this.cron.cronEditingJobId ? `job` : this.cron.cronCreateOpen ? `create` : `overview`}:${this.cron.cronEditingJobId ?? ``}`;
        if (e !== this.lastPanelKey) {
          ((this.lastPanelKey = e), (this.detailTab = `settings`));
          let t = this.closest(`.content`);
          t instanceof HTMLElement && typeof t.scrollTo == `function` && t.scrollTo({ top: 0 });
        }
      }
      async refreshCron(e) {
        let t = this.cron;
        if (!t.connected || !t.client) return;
        let n = t.cronRunsScope === `job` ? t.cronRunsJobId : null;
        (this.loadRuns(n),
          this.context.channels.refresh(!1),
          await Promise.all([
            this.runCronTask((e) => ue(e)),
            this.runCronTask((e) => Me(e)),
            this.runCronTask((e) => ce(e)),
            this.runCronTask((t) => p(t, { tableFilters: e.tableFilters })),
          ]));
      }
      loadRuns(e) {
        return this.runCronTask((t) => _(t, e));
      }
      async loadModelSuggestions(e) {
        let t = {
          client: e.client,
          connected: e.connected,
          cronModelSuggestions: this.cronModelSuggestions,
        };
        (await ke(t),
          this.isConnected &&
            this.cron === e &&
            this.modelSuggestionsState === e &&
            e.connected &&
            t.client === e.client &&
            (this.cronModelSuggestions = t.cronModelSuggestions));
      }
      async runCronTask(e) {
        let t = this.cron;
        try {
          let n = e(t);
          return (this.requestCronUpdate(t), await n);
        } finally {
          this.requestCronUpdate(t);
        }
      }
      patchForm(e) {
        ((this.cron.cronForm = ge({ ...this.cron.cronForm, ...e })),
          (this.cron.cronFieldErrors = pe(this.cron.cronForm)),
          this.requestCronUpdate());
      }
      selectJob(e) {
        ((this.cron.cronCreateOpen = !1),
          he(this.cron, e),
          this.requestCronUpdate(),
          this.runCronTask(async (t) => {
            (g(t, { cronRunsScope: `job` }), (t.cronRunsJobId = e.id), await _(t, e.id));
          }));
      }
      openCreate(e) {
        if ((b(this.cron), (this.cron.cronCreateOpen = !0), e)) {
          this.patchForm(e);
          return;
        }
        this.requestCronUpdate();
      }
      cloneJob(e) {
        (me(this.cron, e), (this.cron.cronCreateOpen = !0), this.requestCronUpdate());
      }
      closePanel() {
        (b(this.cron),
          (this.cron.cronCreateOpen = !1),
          this.requestCronUpdate(),
          this.runCronTask(async (e) => {
            (g(e, { cronRunsScope: `all` }), (e.cronRunsJobId = null), await _(e, null));
          }));
      }
      submitForm(e = {}) {
        this.runCronTask(async (t) => {
          let n = t.cronEditingJobId,
            r = await we(t);
          if (r.saved) {
            if (n) {
              let e = t.cronJobs.find((e) => e.id === n);
              e && he(t, e);
              return;
            }
            (e.runNow && r.jobId && (await S(t, r.jobId, `force`)),
              (t.cronCreateOpen = !1),
              t.cronRunsScope === `job` &&
                (g(t, { cronRunsScope: `all` }), (t.cronRunsJobId = null), await _(t, null)));
          }
        });
      }
      render() {
        let e = this.context.channels.state,
          t = et({
            channels: e,
            runtimeConfig: this.context.runtimeConfig.state,
            cron: this.cron,
            agentsList: this.agentsList,
            modelSuggestions: this.cronModelSuggestions,
          });
        return u`
      <section class="content-header">
        <div>
          <div class="page-title">${Ie(`cron`)}</div>
        </div>
        ${Ze({ agents: this.agentsList?.agents ?? [], selection: this.context.agentSelection })}
      </section>
      ${He(
        Et({
          basePath: this.context.basePath,
          loading: this.cron.cronLoading,
          status: this.cron.cronStatus,
          failingCount: this.cron.cronFailingCount,
          agentScoped: this.cron.cronAgentId !== null,
          scopedTotal: this.cron.cronScopedTotal,
          scopedNextWakeAtMs: this.cron.cronScopedNextWakeAtMs,
          jobs: be(this.cron),
          jobsLoadingMore: this.cron.cronJobsLoadingMore,
          jobsTotal: this.cron.cronJobsTotal,
          jobsHasMore: this.cron.cronJobsHasMore,
          jobsQuery: this.cron.cronJobsQuery,
          jobsEnabledFilter: this.cron.cronJobsEnabledFilter,
          jobsScheduleKindFilter: this.cron.cronJobsScheduleKindFilter,
          jobsLastStatusFilter: this.cron.cronJobsLastStatusFilter,
          jobsSortBy: this.cron.cronJobsSortBy,
          jobsSortDir: this.cron.cronJobsSortDir,
          editingJobId: this.cron.cronEditingJobId,
          createOpen: this.cron.cronCreateOpen,
          listTab: this.listTab,
          detailTab: this.detailTab,
          error: this.cron.cronError,
          busy: this.cron.cronBusy,
          form: this.cron.cronForm,
          channels: e.channelsSnapshot?.channelMeta?.length
            ? e.channelsSnapshot.channelMeta.map((e) => e.id)
            : (e.channelsSnapshot?.channelOrder ?? []),
          channelLabels: e.channelsSnapshot?.channelLabels ?? {},
          channelMeta: e.channelsSnapshot?.channelMeta ?? [],
          runs: this.cron.cronRuns,
          runsTotal: this.cron.cronRunsTotal,
          runsHasMore: this.cron.cronRunsHasMore,
          runsLoadingMore: this.cron.cronRunsLoadingMore,
          runsStatuses: this.cron.cronRunsStatuses,
          runsDeliveryStatuses: this.cron.cronRunsDeliveryStatuses,
          runsQuery: this.cron.cronRunsQuery,
          runsSortDir: this.cron.cronRunsSortDir,
          fieldErrors: this.cron.cronFieldErrors,
          canSubmit: !Ae(this.cron.cronFieldErrors),
          agentSuggestions: t.agentSuggestions,
          modelSuggestions: t.modelSuggestions,
          thinkingSuggestions: F,
          timezoneSuggestions: I,
          deliveryToSuggestions: t.deliveryToSuggestions,
          accountSuggestions: t.accountTargets,
          onListTabChange: (e) => {
            this.listTab = e;
          },
          onDetailTabChange: (e) => {
            this.detailTab = e;
          },
          onFormChange: (e) => this.patchForm(e),
          onRefresh: () => void this.refreshCron({ tableFilters: !0 }),
          onSubmit: () => this.submitForm(),
          onSubmitRunNow: () => this.submitForm({ runNow: !0 }),
          onSelectJob: (e) => this.selectJob(e),
          onOpenCreate: (e) => this.openCreate(e),
          onClosePanel: () => this.closePanel(),
          onClone: (e) => this.cloneJob(e),
          onToggle: (e, t) =>
            void this.runCronTask(async (n) => {
              (await _e(n, e, t)) &&
                n.cronEditingJobId === e.id &&
                (n.cronForm = { ...n.cronForm, enabled: t });
            }),
          onRun: (e, t) => void this.runCronTask((n) => S(n, e.id, t ?? `force`)),
          onRemove: (e) =>
            void this.runCronTask(async (t) => {
              (await Te(t, e),
                t.cronRunsScope === `job` &&
                  t.cronRunsJobId === null &&
                  (g(t, { cronRunsScope: `all` }), await _(t, null)));
            }),
          onLoadMoreJobs: () =>
            void this.runCronTask((e) => p(e, { append: !0, tableFilters: !0 })),
          onJobsFiltersChange: (e) =>
            void this.runCronTask(async (t) => {
              (h(t, e), await p(t, { append: !1, tableFilters: !0 }));
            }),
          onJobsFiltersReset: () =>
            void this.runCronTask(async (e) => {
              (h(e, {
                cronJobsScheduleKindFilter: `all`,
                cronJobsLastStatusFilter: `all`,
                cronJobsSortBy: `nextRunAtMs`,
                cronJobsSortDir: `asc`,
              }),
                await p(e, { append: !1, tableFilters: !0 }));
            }),
          onLoadMoreRuns: () => void this.runCronTask((e) => le(e)),
          onRunsFiltersChange: (e) =>
            void this.runCronTask(async (t) => {
              (g(t, e), await _(t, t.cronRunsScope === `all` ? null : t.cronRunsJobId));
            }),
          onNavigateToChat: (e) => this.context.navigate(`chat`, { search: m(e) }),
        }),
      )}
    `;
      }
    }),
    n([a({ context: Pe, subscribe: !0 })], $.prototype, `context`, void 0),
    n([l()], $.prototype, `cron`, void 0),
    n([l()], $.prototype, `agentsList`, void 0),
    n([l()], $.prototype, `cronModelSuggestions`, void 0),
    n([l()], $.prototype, `listTab`, void 0),
    n([l()], $.prototype, `detailTab`, void 0),
    customElements.get(`openclaw-cron-page`) || customElements.define(`openclaw-cron-page`, $));
})();
//# sourceMappingURL=cron-page-CI3q1lAz.js.map
