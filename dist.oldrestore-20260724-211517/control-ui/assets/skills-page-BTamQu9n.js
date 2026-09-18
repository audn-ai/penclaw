import { K as O, dt as k, nt as A, q as j } from "./control-ui-core--EZfp09c.js";
import {
  At as g,
  Ct as ee,
  Dt as _,
  Et as v,
  Jt as te,
  Mt as y,
  Nt as ne,
  Ot as re,
  Pt as ie,
  St as ae,
  Wa as oe,
  Wi as b,
  Xt as se,
  bt as x,
  da as ce,
  di as le,
  ea as ue,
  fi as de,
  jt as fe,
  kt as S,
  la as C,
  vt as w,
  wt as T,
  xt as E,
  yt as D,
} from "./control-ui-core-BcbHa4vB.js";
import { $ as P, Q as F, x as I } from "./control-ui-core-CQDTaMS5.js";
import { o as M, t as N } from "./control-ui-core-CwQmiouz.js";
import { dt as r, ft as i } from "./control-ui-foundation-0uuDj0X3.js";
import { _ as t, g as n } from "./control-ui-foundation-CCDffryi.js";
import { $ as h } from "./control-ui-foundation-s2wA1PVE.js";
import {
  G as a,
  Y as o,
  Z as s,
  _ as c,
  at as l,
  et as u,
  f as d,
  h as f,
  nt as p,
  p as m,
} from "./lit-runtime-DkvDG939.js";
import { a as Se, n as Ce } from "./markdown-ERFX4kV-.js";
import { n as we, r as Te, t as Ee } from "./plugins-ACOlUaqG.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
import {
  a as z,
  c as B,
  f as V,
  l as H,
  n as U,
  s as pe,
  t as me,
  u as W,
} from "./settings-ui-T0X7dZpU.js";
import { n as L, t as R } from "./settings-workspace-DRQpceJK.js";
import {
  a as he,
  c as ge,
  i as G,
  n as _e,
  o as ve,
  r as ye,
  s as be,
  t as xe,
} from "./skills-shared-C-zd7erd.js";
function K(e) {
  return e ? se(e, window.location.href) : null;
}
function De(e, t) {
  switch (t) {
    case `all`:
      return !0;
    case `ready`:
      return !e.disabled && G(e);
    case `needs-setup`:
      return !e.disabled && !G(e);
    case `disabled`:
      return e.disabled;
  }
  throw Error(`Unsupported skills status filter`);
}
function Oe(e) {
  return e.disabled ? `muted` : G(e) ? `ok` : `warn`;
}
function ke(e) {
  return e.disabled
    ? H({ kind: `muted`, label: M(`skillsPage.tabs.disabled`) })
    : G(e)
      ? H({ kind: `ok`, label: M(`skillsPage.tabs.ready`) })
      : H({ kind: `warn`, label: M(`skillsPage.tabs.needsSetup`) });
}
function q(e, t) {
  let n = e.clawhub;
  return !n || n.status !== `linked` || !n.valid
    ? null
    : (t[w({ registry: n.registry, slug: n.slug, version: n.installedVersion })] ?? null);
}
function J(e) {
  if (!e) return M(`skillsPage.verdict.unavailable`);
  let t = e.securityStatus?.trim() || null;
  return e.ok && e.decision === `pass`
    ? t === `clean` || !t
      ? M(`skillsPage.verdict.clean`)
      : t
    : M(
        t === `pending` || t === `not-run`
          ? `skillsPage.verdict.pending`
          : t === `malicious`
            ? `skillsPage.verdict.blocked`
            : t === `suspicious`
              ? `skillsPage.verdict.review`
              : `skillsPage.verdict.unavailable`,
      );
}
function Ae(e) {
  if (!e) return `chip-warn`;
  if (e.ok && e.decision === `pass`) return `chip-ok`;
  let t = e.securityStatus?.trim() || null;
  return t === `pending` || t === `not-run` ? `chip` : `chip-warn`;
}
function je(e) {
  if (!e) return `warn`;
  if (e.ok && e.decision === `pass`) return `ok`;
  let t = e.securityStatus?.trim() || null;
  return t === `pending` || t === `not-run` ? `muted` : `warn`;
}
function Me(e, t) {
  let n = e.identity?.name?.trim() || e.name?.trim() || e.id;
  return e.id === t ? M(`skillsPage.defaultAgent`, { name: n }) : n;
}
function Y(e) {
  return e.loading || e.operation !== null;
}
function Ne(e, t) {
  return e.operation?.kind === `skill` && e.operation.skillKey === t;
}
function X(e, t) {
  return e.operation?.kind === `clawhub` && e.operation.slug === t;
}
function Pe(e) {
  let t = e.report?.skills ?? [],
    n = { all: t.length, ready: 0, "needs-setup": 0, disabled: 0 };
  for (let e of t) e.disabled ? n.disabled++ : G(e) ? n.ready++ : n[`needs-setup`]++;
  let r = e.statusFilter === `all` ? t : t.filter((t) => De(t, e.statusFilter)),
    i = h(e.filter),
    a = i ? r.filter((e) => h([e.name, e.description, e.source].join(` `)).includes(i)) : r,
    o = ve(a),
    s = e.detailKey ? (t.find((t) => t.skillKey === e.detailKey) ?? null) : null;
  return l`
    ${z(
      l`
        ${Ie(e, n, a.length)}
        ${e.error ? l`<div class="callout danger" role="alert">${e.error}</div>` : p}
        ${Le(e)}
        ${a.length === 0 ? U(!e.connected && !e.report ? M(`skillsPage.disconnected`) : M(`skillsPage.empty`)) : o.map((t) => Fe(t, e))}
      `,
      { wide: !0 },
    )}
    ${s ? Be(s, e) : p}
    ${e.clawhubDetailSlug ? ze(e) : p}
  `;
}
function Fe(e, t) {
  return l`
    <details class="settings-section skills-group" open>
      <summary class="settings-section__header skills-group__summary">
        <h2 class="settings-section__heading">
          ${e.label} <span class="settings-count">${e.skills.length}</span>
        </h2>
        <span class="skills-group__chevron" aria-hidden="true">${F.chevronDown}</span>
      </summary>
      <div class="settings-group">
        ${m(
          e.skills,
          (e) => e.skillKey,
          (e) => Z(e, t),
        )}
      </div>
    </details>
  `;
}
function Ie(e, t, n) {
  let r = e.agentsList?.agents ?? [],
    i = e.selectedAgentId ?? e.agentsList?.defaultId ?? r[0]?.id ?? ``;
  return l`
    <div class="plugins-toolbar plugins-toolbar--fields">
      ${B({
        value: e.statusFilter,
        ariaLabel: M(`skillsPage.title`),
        options: Q.map((e) => ({
          value: e.id,
          label: l`${M(e.labelKey)}
            <span class="settings-count">${t[e.id]}</span>`,
        })),
        onChange: (t) => e.onStatusFilterChange(t),
      })}
      ${
        r.length > 0
          ? l`
            <label class="plugins-field skills-toolbar__agent">
              <span>${M(`usage.filters.agent`)}</span>
              <select
                name="skills-agent"
                class="settings-select"
                .value=${i}
                ?disabled=${Y(e) || !e.connected || r.length < 2}
                @change=${(t) => e.onAgentChange(t.target.value)}
              >
                ${r.map(
                  (t) => l`
                    <option value=${t.id} ?selected=${t.id === i}>
                      ${Me(t, e.agentsList?.defaultId)}
                    </option>
                  `,
                )}
              </select>
            </label>
          `
          : p
      }
      <label class="plugins-field skills-toolbar__search">
        <span>${M(`common.search`)}</span>
        <input
          class="settings-input"
          .value=${e.filter}
          @input=${(t) => e.onFilterChange(t.target.value)}
          placeholder=${M(`skillsPage.filterPlaceholder`)}
          autocomplete="off"
          name="skills-filter"
        />
      </label>
      <span class="plugins-toolbar__hint">
        ${M(`skillsPage.shown`, { count: String(n) })}
      </span>
      <button
        type="button"
        class="btn"
        ?disabled=${Y(e) || !e.connected}
        @click=${e.onRefresh}
      >
        ${e.loading ? M(`common.loading`) : M(`common.refresh`)}
      </button>
    </div>
  `;
}
function Le(e) {
  return pe(
    { title: M(`skillsPage.clawHub`), description: M(`skillsPage.clawHubSubtitle`) },
    l`
      <div class="settings-row">
        <input
          class="settings-input plugins-row-input"
          .value=${e.clawhubQuery}
          @input=${(t) => e.onClawHubQueryChange(t.target.value)}
          placeholder=${M(`skillsPage.searchClawHub`)}
          autocomplete="off"
          name="clawhub-search"
        />
        ${e.clawhubSearchLoading ? l`<span class="plugins-toolbar__hint">${M(`skillsPage.searching`)}</span>` : p}
      </div>
      ${e.clawhubSearchError ? l`<div class="callout danger plugins-group-message">${e.clawhubSearchError}</div>` : p}
      ${
        e.clawhubInstallMessage
          ? l`<div
            class="callout ${e.clawhubInstallMessage.kind === `error` ? `danger` : `success`} plugins-group-message"
          >
            <div
              style="max-width: 100%; white-space: pre-wrap; overflow-wrap: anywhere; word-break: break-word;"
            >
              ${e.clawhubInstallMessage.text}
            </div>
            ${
              e.clawhubInstallMessage.acknowledgeSlug
                ? l`<button
                  type="button"
                  class="btn btn--sm"
                  style="margin-top: 10px; white-space: normal;"
                  ?disabled=${Y(e)}
                  @click=${() => e.onClawHubInstall(e.clawhubInstallMessage?.acknowledgeSlug ?? ``, !0, e.clawhubInstallMessage?.acknowledgeVersion)}
                >
                  ${e.clawhubInstallMessage.acknowledgeLabel ?? M(`skillsPage.acknowledgeRisk`)}
                </button>`
                : p
            }
          </div>`
          : p
      }
      ${Re(e)}
    `,
  );
}
function Re(e) {
  let t = e.clawhubResults;
  return t
    ? t.length === 0
      ? U(M(`skillsPage.noClawHubResults`))
      : l`
    ${t.map(
      (t) => l`
        <div class="settings-row plugins-item plugins-item--clickable">
          <button
            type="button"
            class="settings-row__text plugins-item__detail-button"
            aria-label=${M(`skillsPage.openDetails`, { name: t.displayName })}
            @click=${() => e.onClawHubDetailOpen(t.slug)}
          >
            <span class="settings-row__title">${t.displayName}</span>
            <span class="settings-row__desc">
              ${t.summary ? b(t.summary, 120) : t.slug}
            </span>
          </button>
          <div class="settings-row__control">
            ${t.version ? V(`v${t.version}`) : p}
            <button
              class="btn btn--sm"
              ?disabled=${Y(e)}
              @click=${() => e.onClawHubInstall(t.slug)}
            >
              ${X(e, t.slug) ? M(`skillsPage.installing`) : M(`skillsPage.install`)}
            </button>
          </div>
        </div>
      `,
    )}
  `
    : p;
}
function ze(e) {
  let t = e.clawhubDetail;
  return l`
    <openclaw-modal-dialog
      label=${t?.skill?.displayName ?? e.clawhubDetailSlug ?? M(`skillsPage.notFound`)}
      style="--openclaw-modal-width: min(1040px, calc(100vw - 32px));"
      @modal-cancel=${e.onClawHubDetailClose}
    >
      <div class="md-preview-dialog__panel">
        <div class="md-preview-dialog__header">
          <div class="md-preview-dialog__title">
            ${t?.skill?.displayName ?? e.clawhubDetailSlug}
          </div>
          <button class="btn btn--sm" @click=${e.onClawHubDetailClose}>
            ${M(`skillsPage.close`)}
          </button>
        </div>
        <div class="md-preview-dialog__body" style="display: grid; gap: 16px;">
          ${
            e.clawhubDetailLoading
              ? l`<div class="muted">${M(`common.loading`)}</div>`
              : e.clawhubDetailError
                ? l`<div class="callout danger">${e.clawhubDetailError}</div>`
                : t?.skill
                  ? l`
                    <div style="font-size: 14px; line-height: 1.5;">
                      ${t.skill.summary ?? ``}
                    </div>
                    ${
                      t.owner?.displayName
                        ? l`<div class="muted" style="font-size: 13px;">
                          ${M(`skillsPage.by`)}
                          ${t.owner.displayName}${t.owner.handle ? l` (@${t.owner.handle})` : p}
                        </div>`
                        : p
                    }
                    ${
                      t.latestVersion
                        ? l`<div class="muted" style="font-size: 13px;">
                          ${M(`skillsPage.latest`, { version: t.latestVersion.version })}
                        </div>`
                        : p
                    }
                    ${
                      t.latestVersion?.changelog
                        ? l`<div
                          style="font-size: 13px; border-top: 1px solid var(--border); padding-top: 12px; white-space: pre-wrap;"
                        >
                          ${t.latestVersion.changelog}
                        </div>`
                        : p
                    }
                    ${
                      t.metadata?.os
                        ? l`<div class="muted" style="font-size: 12px;">
                          ${M(`skillsPage.platforms`, { platforms: t.metadata.os.join(`, `) })}
                        </div>`
                        : p
                    }
                    <button
                      class="btn primary"
                      ?disabled=${Y(e)}
                      @click=${() => {
                        e.clawhubDetailSlug && e.onClawHubInstall(e.clawhubDetailSlug);
                      }}
                    >
                      ${X(e, e.clawhubDetailSlug ?? ``) ? M(`skillsPage.installing`) : M(`skillsPage.installNamed`, { name: t.skill.displayName })}
                    </button>
                  `
                  : l`<div class="muted">${M(`skillsPage.notFound`)}</div>`
          }
        </div>
      </div>
    </openclaw-modal-dialog>
  `;
}
function Z(e, t) {
  let n = Y(t),
    r = q(e, t.clawhubVerdicts);
  return l`
    <div class="settings-row plugins-item plugins-item--clickable">
      <button
        type="button"
        class="settings-row__text plugins-item__detail-button"
        aria-label=${M(`skillsPage.openDetails`, { name: e.name })}
        @click=${() => t.onDetailOpen(e.skillKey)}
      >
        <span class="settings-row__title">
          ${e.emoji ? l`<span>${e.emoji}</span> ` : p}${e.name}
        </span>
        <span class="settings-row__desc">${b(e.description, 140)}</span>
      </button>
      <div class="settings-row__control">
        ${ke(e)}
        ${e.clawhub?.status === `linked` ? H({ kind: je(r), label: J(r) }) : e.clawhub?.status === `invalid` ? H({ kind: `warn`, label: M(`skillsPage.invalidLink`) }) : p}
        ${W({ checked: !e.disabled, disabled: n, ariaLabel: M(`skillsPage.enabledNamed`, { name: e.name }), onChange: () => t.onToggle(e.skillKey, e.disabled) })}
      </div>
    </div>
  `;
}
function Be(e, t) {
  let n = Y(t),
    r = Ne(t, e.skillKey),
    i = t.edits[e.skillKey] ?? ``,
    a = t.messages[e.skillKey] ?? null,
    o = e.install[0],
    s = o !== void 0 && e.missing.bins.length > 0,
    c = !!(e.bundled && e.source !== `openclaw-bundled`),
    u = xe(e),
    d = _e(e),
    f = q(e, t.clawhubVerdicts),
    m = t.detailTab === `card` && e.skillCard?.present ? `card` : `overview`;
  return l`
    <openclaw-modal-dialog
      label=${e.name}
      style="--openclaw-modal-width: min(1040px, calc(100vw - 32px));"
      @modal-cancel=${t.onDetailClose}
    >
      <div class="md-preview-dialog__panel">
        <div class="md-preview-dialog__header">
          <div
            class="md-preview-dialog__title"
            style="display: flex; align-items: center; gap: 8px;"
          >
            <span class="statusDot ${Oe(e)}"></span>
            ${e.emoji ? l`<span style="font-size: 18px;">${e.emoji}</span>` : p}
            <span>${e.name}</span>
          </div>
          <button class="btn btn--sm" @click=${t.onDetailClose}>
            ${M(`skillsPage.close`)}
          </button>
        </div>
        <div class="md-preview-dialog__body" style="display: grid; gap: 16px;">
          <div>
            <div style="font-size: 14px; line-height: 1.5; color: var(--text);">
              ${e.description}
            </div>
            ${he({ skill: e, showBundledBadge: c })}
          </div>

          ${
            e.clawhub || e.skillCard?.present
              ? l`
                <div class="agent-tabs">
                  <button
                    class="agent-tab ${m === `overview` ? `active` : ``}"
                    @click=${() => t.onDetailTabChange(`overview`)}
                  >
                    ${M(`skillsPage.overview`)}
                  </button>
                  ${
                    e.skillCard?.present
                      ? l`<button
                        class="agent-tab ${m === `card` ? `active` : ``}"
                        @click=${() => t.onDetailTabChange(`card`)}
                      >
                        ${M(`skillsPage.skillCard`)}
                      </button>`
                      : p
                  }
                </div>
              `
              : p
          }
          ${m === `overview` ? Ve(e, t, f) : He(e, t)}
          ${
            u.length > 0
              ? l`
                <div
                  class="callout"
                  style="border-color: var(--warn-subtle); background: var(--warn-subtle); color: var(--warn);"
                >
                  <div style="font-weight: 600; margin-bottom: 4px;">
                    ${M(`skillsPage.missingRequirements`)}
                  </div>
                  <div>${u.join(`, `)}</div>
                </div>
              `
              : p
          }
          ${
            d.length > 0
              ? l`
                <div class="muted" style="font-size: 13px;">
                  ${M(`skillsPage.reason`, { reasons: d.join(`, `) })}
                </div>
              `
              : p
          }

          <div style="display: flex; align-items: center; gap: 12px;">
            ${W({ checked: !e.disabled, disabled: n, ariaLabel: e.name, onChange: () => t.onToggle(e.skillKey, e.disabled) })}
            <span style="font-size: 13px; font-weight: 500;">
              ${e.disabled ? M(`skillsPage.disabled`) : M(`skillsPage.enabled`)}
            </span>
            ${
              s
                ? l`<button
                  class="btn"
                  ?disabled=${n}
                  @click=${() => o && t.onInstall(e.skillKey, e.name, o.id)}
                >
                  ${r ? M(`skillsPage.installing`) : o?.label}
                </button>`
                : p
            }
          </div>

          ${
            a
              ? l`<div class="callout ${a.kind === `error` ? `danger` : `success`}">
                ${a.message}
              </div>`
              : p
          }
          ${
            e.primaryEnv
              ? l`
                <div style="display: grid; gap: 8px;">
                  <div class="field">
                    <span
                      >${M(`skillsPage.apiKey`)}
                      <span class="muted" style="font-weight: normal; font-size: 0.88em;"
                        >(${e.primaryEnv})</span
                      ></span
                    >
                    <input
                      type="password"
                      ?disabled=${n}
                      .value=${i}
                      @input=${(n) => t.onEdit(e.skillKey, n.target.value)}
                    />
                  </div>
                  ${(() => {
                    let t = K(e.homepage);
                    return t
                      ? l`<div class="muted" style="font-size: 13px;">
                          ${M(`skillsPage.getKey`)}
                          <a href="${t}" target="_blank" rel="noopener noreferrer"
                            >${e.homepage}</a
                          >
                        </div>`
                      : p;
                  })()}
                  <button
                    class="btn primary"
                    ?disabled=${n}
                    @click=${() => t.onSaveKey(e.skillKey)}
                  >
                    ${M(`skillsPage.saveKey`)}
                  </button>
                </div>
              `
              : p
          }

          <div
            style="border-top: 1px solid var(--border); padding-top: 12px; display: grid; gap: 6px; font-size: 12px; color: var(--muted);"
          >
            <div>
              <span style="font-weight: 600;">${M(`skillsPage.source`)}</span> ${e.source}
            </div>
            <div style="font-family: var(--mono); word-break: break-all;">${e.filePath}</div>
            ${(() => {
              let t = K(e.homepage);
              return t
                ? l`<div>
                    <a href="${t}" target="_blank" rel="noopener noreferrer"
                      >${e.homepage}</a
                    >
                  </div>`
                : p;
            })()}
          </div>
        </div>
      </div>
    </openclaw-modal-dialog>
  `;
}
function Ve(e, t, n) {
  let r = e.clawhub;
  if (!r) return p;
  if (r.status === `invalid`)
    return l`<div class="callout danger">
      <div style="font-weight: 600; margin-bottom: 4px;">${M(`skillsPage.invalidLink`)}</div>
      <div>${r.reason}</div>
    </div>`;
  let i = K(n?.securityAuditUrl ?? void 0),
    a = n?.reasons?.length ? n.reasons.join(`, `) : null;
  return l`
    <div
      class="callout"
      style="display: grid; gap: 8px; border-color: var(--border); background: var(--panel-2);"
    >
      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
        <span class="chip ${Ae(n)}">${J(n)}</span>
        <span class="muted" style="font-size: 12px;">${r.slug}@${r.installedVersion}</span>
        ${t.clawhubVerdictsLoading ? l`<span class="muted">${M(`skillsPage.refreshing`)}</span>` : p}
      </div>
      ${t.clawhubVerdictsError ? l`<div class="muted" style="font-size: 13px;">${t.clawhubVerdictsError}</div>` : a ? l`<div class="muted" style="font-size: 13px;">${a}</div>` : p}
      ${
        i
          ? l`<div style="font-size: 13px;">
            <a href="${i}" target="_blank" rel="noopener noreferrer"
              >${M(`skillsPage.fullSecurityReport`)}</a
            >
          </div>`
          : p
      }
    </div>
  `;
}
function He(e, t) {
  if (!e.skillCard?.present) return p;
  let n = t.skillCardContents[e.skillKey];
  if (n === void 0) {
    let n = t.skillCardErrors[e.skillKey];
    return n
      ? l`<div class="callout danger">${n}</div>`
      : l`<div class="muted" style="font-size: 13px;">
      ${t.skillCardLoadingKey === e.skillKey ? M(`skillsPage.loadingSkillCard`) : M(`skillsPage.skillCardNotLoaded`)}
    </div>`;
  }
  return l`
    <article class="sidebar-markdown" style="max-width: 100%; overflow-wrap: anywhere;">
      ${c(Se(n))}
    </article>
  `;
}
var Q,
  Ue = e(() => {
    (u(),
      d(),
      f(),
      P(),
      Ce(),
      I(),
      me(),
      N(),
      ue(),
      te(),
      be(),
      Ee(),
      ge(),
      ye(),
      x(),
      oe(),
      (Q = [
        { id: `all`, labelKey: `skillsPage.tabs.all` },
        { id: `ready`, labelKey: `skillsPage.tabs.ready` },
        { id: `needs-setup`, labelKey: `skillsPage.tabs.needsSetup` },
        { id: `disabled`, labelKey: `skillsPage.tabs.disabled` },
      ]));
  }),
  $;
e(() => {
  (r(),
    u(),
    a(),
    A(),
    j(),
    we(),
    R(),
    x(),
    ce(),
    de(),
    Ue(),
    t(),
    ($ = class extends C {
      constructor(...e) {
        (super(...e),
          (this.client = null),
          (this.connected = !1),
          (this.agentsLoading = !1),
          (this.agentsError = null),
          (this.agentsList = null),
          (this.skillsAgentId = null),
          (this.skillsAgentRevision = 0),
          (this.skillsLoading = !1),
          (this.skillsReport = null),
          (this.skillsError = null),
          (this.skillOperation = null),
          (this.skillsFilter = ``),
          (this.skillsStatusFilter = `all`),
          (this.skillEdits = {}),
          (this.skillMessages = {}),
          (this.skillsDetailKey = null),
          (this.skillsDetailTab = `overview`),
          (this.clawhubSearchQuery = ``),
          (this.clawhubSearchResults = null),
          (this.clawhubSearchLoading = !1),
          (this.clawhubSearchError = null),
          (this.clawhubDetail = null),
          (this.clawhubDetailSlug = null),
          (this.clawhubDetailLoading = !1),
          (this.clawhubDetailError = null),
          (this.clawhubInstallMessage = null),
          (this.clawhubVerdicts = {}),
          (this.clawhubVerdictsLoading = !1),
          (this.clawhubVerdictsError = null),
          (this.skillCardContents = {}),
          (this.skillCardContentKeys = {}),
          (this.skillCardLoadingKey = null),
          (this.skillCardErrors = {}),
          (this.clawhubSearchTimer = null),
          (this.routeDataInitialized = !1),
          (this.routeDataEnabled = !0),
          (this.hasBoundGatewaySource = !1),
          (this.sourceGeneration = 0),
          (this.subscriptions = new le(this)
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
              () => this.context?.agents,
              (e) => {
                let t = e.subscribe(() => {
                  (this.syncAgentState(), this.requestUpdate());
                });
                return (this.syncAgentState(), this.ensureInitialData(), t);
              },
            )));
      }
      willUpdate(e) {
        e.has(`routeData`) && (this.applyRouteData(), this.ensureInitialData());
      }
      disconnectedCallback() {
        (this.subscriptions.clear(),
          (this.clawhubSearchTimer &&= (clearTimeout(this.clawhubSearchTimer), null)),
          this.resetLoadedSkillState(),
          super.disconnectedCallback());
      }
      applyGatewaySnapshot(e, t = !1) {
        let n = t || e.client !== this.client,
          r = e.connected !== this.connected;
        ((this.client = e.client),
          (this.connected = e.connected),
          (n || r) && this.resetLoadedSkillState(),
          this.ensureInitialData());
      }
      syncAgentState() {
        let e = this.context.agents.state;
        if (
          ((this.agentsLoading = e.agentsLoading),
          (this.agentsError = e.agentsError),
          (this.agentsList = e.agentsList),
          e.agentsList)
        ) {
          let t = this.skillsAgentId;
          (_(this, e.agentsList),
            t !== this.skillsAgentId &&
              ((this.skillsDetailKey = null), (this.skillsDetailTab = `overview`)));
        }
      }
      resetLoadedSkillState() {
        (this.sourceGeneration++,
          (this.clawhubSearchTimer &&= (clearTimeout(this.clawhubSearchTimer), null)),
          this.routeDataInitialized && (this.routeDataEnabled = !1),
          (this.agentsLoading = !1),
          (this.agentsError = null),
          (this.agentsList = null),
          (this.skillsAgentId = null),
          this.skillsAgentRevision++,
          (this.skillsLoading = !1),
          (this.skillsReport = null),
          (this.skillsError = null),
          (this.skillOperation = null),
          (this.skillEdits = {}),
          (this.skillMessages = {}),
          (this.skillsDetailKey = null),
          (this.skillsDetailTab = `overview`),
          (this.clawhubSearchResults = null),
          (this.clawhubSearchLoading = !1),
          (this.clawhubSearchError = null),
          (this.clawhubDetail = null),
          (this.clawhubDetailSlug = null),
          (this.clawhubDetailLoading = !1),
          (this.clawhubDetailError = null),
          (this.clawhubInstallMessage = null),
          (this.clawhubVerdicts = {}),
          (this.clawhubVerdictsLoading = !1),
          (this.clawhubVerdictsError = null),
          (this.skillCardContents = {}),
          (this.skillCardContentKeys = {}),
          (this.skillCardLoadingKey = null),
          (this.skillCardErrors = {}));
      }
      applyRouteData() {
        let e = this.routeData;
        if (!e) return;
        ((this.routeDataInitialized = !0), (this.routeDataEnabled = !0));
        let t = this.context.gateway,
          n = t.snapshot;
        if (
          ((this.client = n.client),
          (this.connected = n.connected),
          e.gateway !== t || e.gatewaySnapshot !== n || e.agents !== this.context.agents)
        ) {
          this.routeDataEnabled = !1;
          return;
        }
        (this.skillsAgentId && e.selectedAgentId && e.selectedAgentId !== this.skillsAgentId) ||
          ((this.agentsLoading = !1),
          (this.agentsError = null),
          (this.agentsList = e.agentsList ?? this.context.agents.state.agentsList),
          (this.skillsAgentId = e.selectedAgentId ?? this.skillsAgentId),
          (this.skillsLoading = !1),
          (this.skillsReport = e.report),
          (this.skillsError = e.error));
      }
      ensureInitialData() {
        !this.connected ||
          !this.client ||
          (this.routeDataEnabled &&
            (this.routeData?.agentsList || this.routeData?.report || this.routeData?.error)) ||
          (!this.agentsList && !this.agentsLoading && this.loadAgents(),
          !this.skillsReport && !this.skillsLoading && v(this),
          this.clawhubSearchQuery.trim() &&
            !this.clawhubSearchLoading &&
            !this.clawhubSearchResults &&
            !this.clawhubSearchError &&
            g(this, this.clawhubSearchQuery));
      }
      async loadAgents() {
        let e = this.client;
        if (!e || !this.connected || this.agentsLoading) return;
        let t = this.context.gateway,
          n = this.context.agents,
          r = this.sourceGeneration,
          i = () =>
            this.isConnected &&
            this.connected &&
            this.client === e &&
            this.context.gateway === t &&
            this.context.agents === n &&
            this.sourceGeneration === r;
        if (n.state.agentsList) {
          this.syncAgentState();
          return;
        }
        ((this.agentsLoading = !0), (this.agentsError = null));
        try {
          let e = await n.ensureList();
          if (!i()) return;
          this.agentsList = e;
          let t = this.skillsAgentId;
          (_(this, e),
            t !== this.skillsAgentId &&
              ((this.skillsDetailKey = null), (this.skillsDetailTab = `overview`)));
        } catch (e) {
          i() && (this.agentsError = String(e));
        } finally {
          i() && (this.agentsLoading = !1);
        }
      }
      async refreshPage() {
        await re(this, () => this.loadAgents());
      }
      changeAgent(e) {
        if (this.skillOperation || this.skillsLoading) return;
        let t = this.skillsAgentId;
        (y(this, e),
          t !== this.skillsAgentId &&
            ((this.skillsDetailKey = null), (this.skillsDetailTab = `overview`)),
          v(this, { clearMessages: !0 }));
      }
      changeClawHubQuery(e) {
        (fe(this, e),
          this.clawhubSearchTimer && clearTimeout(this.clawhubSearchTimer),
          (this.clawhubSearchTimer = setTimeout(() => void g(this, e), 300)));
      }
      changeDetailTab(e) {
        ((this.skillsDetailTab = e),
          e === `card` && this.skillsDetailKey && T(this, this.skillsDetailKey));
      }
      selectHubTab(e) {
        if (e !== `skills`) {
          if (e === `workshop`) {
            this.context.navigate(`skill-workshop`);
            return;
          }
          this.context.navigate(`plugins`, e === `discover` ? { search: `?tab=discover` } : void 0);
        }
      }
      render() {
        let e = this.skillsError ?? this.agentsError;
        return l`
      <section class="content-header content-header--page plugins-content-header">
        <div>
          <h1 class="page-title">${k(`skills`)}</h1>
        </div>
      </section>
      ${L(l`
        <div class="plugins-hub-tabs-row">
          ${Te({ active: `skills`, onSelect: (e) => this.selectHubTab(e) })}
        </div>
        <wa-tab-panel
          id="plugins-hub-panel"
          name="skills"
          active
          aria-labelledby="plugins-tab-skills"
        >
          ${Pe({
            connected: this.connected,
            loading: this.skillsLoading || this.agentsLoading,
            report: this.skillsReport,
            agentsList: this.agentsList,
            selectedAgentId: this.skillsAgentId ?? this.agentsList?.defaultId ?? null,
            error: e,
            filter: this.skillsFilter,
            statusFilter: this.skillsStatusFilter,
            edits: this.skillEdits,
            messages: this.skillMessages,
            operation: this.skillOperation,
            detailKey: this.skillsDetailKey,
            detailTab: this.skillsDetailTab,
            clawhubVerdicts: this.clawhubVerdicts,
            clawhubVerdictsLoading: this.clawhubVerdictsLoading,
            clawhubVerdictsError: this.clawhubVerdictsError,
            skillCardContents: this.skillCardContents,
            skillCardLoadingKey: this.skillCardLoadingKey,
            skillCardErrors: this.skillCardErrors,
            clawhubQuery: this.clawhubSearchQuery,
            clawhubResults: this.clawhubSearchResults,
            clawhubSearchLoading: this.clawhubSearchLoading,
            clawhubSearchError: this.clawhubSearchError,
            clawhubDetail: this.clawhubDetail,
            clawhubDetailSlug: this.clawhubDetailSlug,
            clawhubDetailLoading: this.clawhubDetailLoading,
            clawhubDetailError: this.clawhubDetailError,
            clawhubInstallMessage: this.clawhubInstallMessage,
            onAgentChange: (e) => this.changeAgent(e),
            onFilterChange: (e) => (this.skillsFilter = e),
            onStatusFilterChange: (e) => (this.skillsStatusFilter = e),
            onRefresh: () => void this.refreshPage(),
            onToggle: (e, t) => void ie(this, e, t),
            onEdit: (e, t) => ne(this, e, t),
            onSaveKey: (e) => void S(this, e),
            onInstall: (e, t, n) => void ae(this, e, t, n),
            onDetailOpen: (e) => {
              ((this.skillsDetailKey = e), (this.skillsDetailTab = `overview`));
            },
            onDetailClose: () => (this.skillsDetailKey = null),
            onDetailTabChange: (e) => this.changeDetailTab(e),
            onClawHubQueryChange: (e) => this.changeClawHubQuery(e),
            onClawHubDetailOpen: (e) => void ee(this, e),
            onClawHubDetailClose: () => D(this),
            onClawHubInstall: (e, t, n) => void E(this, e, t, n),
          })}
        </wa-tab-panel>
      `)}
    `;
      }
    }),
    n([i({ context: O, subscribe: !0 })], $.prototype, `context`, void 0),
    n([s({ attribute: !1 })], $.prototype, `routeData`, void 0),
    n([o()], $.prototype, `client`, void 0),
    n([o()], $.prototype, `connected`, void 0),
    n([o()], $.prototype, `agentsLoading`, void 0),
    n([o()], $.prototype, `agentsError`, void 0),
    n([o()], $.prototype, `agentsList`, void 0),
    n([o()], $.prototype, `skillsAgentId`, void 0),
    n([o()], $.prototype, `skillsAgentRevision`, void 0),
    n([o()], $.prototype, `skillsLoading`, void 0),
    n([o()], $.prototype, `skillsReport`, void 0),
    n([o()], $.prototype, `skillsError`, void 0),
    n([o()], $.prototype, `skillOperation`, void 0),
    n([o()], $.prototype, `skillsFilter`, void 0),
    n([o()], $.prototype, `skillsStatusFilter`, void 0),
    n([o()], $.prototype, `skillEdits`, void 0),
    n([o()], $.prototype, `skillMessages`, void 0),
    n([o()], $.prototype, `skillsDetailKey`, void 0),
    n([o()], $.prototype, `skillsDetailTab`, void 0),
    n([o()], $.prototype, `clawhubSearchQuery`, void 0),
    n([o()], $.prototype, `clawhubSearchResults`, void 0),
    n([o()], $.prototype, `clawhubSearchLoading`, void 0),
    n([o()], $.prototype, `clawhubSearchError`, void 0),
    n([o()], $.prototype, `clawhubDetail`, void 0),
    n([o()], $.prototype, `clawhubDetailSlug`, void 0),
    n([o()], $.prototype, `clawhubDetailLoading`, void 0),
    n([o()], $.prototype, `clawhubDetailError`, void 0),
    n([o()], $.prototype, `clawhubInstallMessage`, void 0),
    n([o()], $.prototype, `clawhubVerdicts`, void 0),
    n([o()], $.prototype, `clawhubVerdictsLoading`, void 0),
    n([o()], $.prototype, `clawhubVerdictsError`, void 0),
    n([o()], $.prototype, `skillCardContents`, void 0),
    n([o()], $.prototype, `skillCardContentKeys`, void 0),
    n([o()], $.prototype, `skillCardLoadingKey`, void 0),
    n([o()], $.prototype, `skillCardErrors`, void 0),
    customElements.get(`openclaw-skills-page`) || customElements.define(`openclaw-skills-page`, $));
})();
//# sourceMappingURL=skills-page-BTamQu9n.js.map
