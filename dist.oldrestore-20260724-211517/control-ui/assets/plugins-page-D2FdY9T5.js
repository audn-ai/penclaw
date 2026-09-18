import {
  J as ye,
  K as be,
  M as xe,
  P as Se,
  X as Ce,
  dt as we,
  nt as Te,
  q as Ee,
} from "./control-ui-core--EZfp09c.js";
import {
  $t as ae,
  Bt as oe,
  Ft as se,
  Ht as f,
  It as p,
  J as ce,
  Lt as le,
  Qt as ue,
  Rt as m,
  Ut as de,
  Vt as fe,
  Y as h,
  Zt as pe,
  da as me,
  di as he,
  fi as ge,
  la as _e,
  zt as ve,
} from "./control-ui-core-BcbHa4vB.js";
import { $ as De, Q as v, x as Oe } from "./control-ui-core-CQDTaMS5.js";
import { o as g, t as _ } from "./control-ui-core-CwQmiouz.js";
import { dt as r, ft as i } from "./control-ui-foundation-0uuDj0X3.js";
import { _ as t, g as n } from "./control-ui-foundation-CCDffryi.js";
import { at as ie, nt as d } from "./control-ui-foundation-s2wA1PVE.js";
import {
  G as a,
  Y as o,
  Z as ee,
  at as s,
  b as te,
  et as c,
  f as ne,
  nt as l,
  p as u,
  v as re,
} from "./lit-runtime-DkvDG939.js";
import { n as ze, r as Be, t as Ve } from "./plugins-ACOlUaqG.js";
import {
  a as S,
  c as C,
  i as Pe,
  n as Fe,
  o as w,
  r as T,
  s as E,
  t as Ie,
} from "./presentation-Dx9lM6Rf.js";
import { n as Le, t as Re } from "./redact-sensitive-url-DaWVLiYm.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
import { a as je, c as Me, l as y, n as b, s as x, t as Ne } from "./settings-ui-T0X7dZpU.js";
import { n as ke, t as Ae } from "./settings-workspace-DRQpceJK.js";
function He(e) {
  switch (e) {
    case `all`:
      return g(`pluginsPage.filterAll`);
    case `enabled`:
      return g(`pluginsPage.enabled`);
    case `disabled`:
      return g(`pluginsPage.disabled`);
    case `issues`:
      return g(`pluginsPage.filterIssues`);
    default:
      return e;
  }
}
function Ue(e) {
  switch (e) {
    case `work`:
      return g(`pluginsPage.connectorGroupWork`);
    case `dev`:
      return g(`pluginsPage.connectorGroupDev`);
    case `home`:
      return g(`pluginsPage.connectorGroupHome`);
    case `life`:
      return g(`pluginsPage.connectorGroupLife`);
    default:
      return e;
  }
}
function D(e) {
  return `plugin:${e}`;
}
function We(e) {
  return `clawhub:${e}`;
}
function O(e) {
  return `connector:${e}`;
}
function k(e) {
  return e.trim().toLocaleLowerCase();
}
function A(e, t) {
  let n = k(t);
  return n
    ? [e.name, e.id, e.description, e.origin, e.category, ...(e.kind ?? [])].some((e) =>
        e?.toLocaleLowerCase().includes(n),
      )
    : !0;
}
function Ge(e, t) {
  let n = k(t);
  return n
    ? [e.id, e.name, g(e.descriptionKey)].some((e) => e.toLocaleLowerCase().includes(n))
    : !0;
}
function j(e) {
  return e.toSorted(
    (e, t) => (e.order ?? 2 ** 53 - 1) - (t.order ?? 2 ** 53 - 1) || e.name.localeCompare(t.name),
  );
}
function Ke(e, t = ``, n = `all`) {
  return j(
    e.filter((e) => {
      if (!e.installed || !A(e, t)) return !1;
      switch (n) {
        case `enabled`:
          return e.enabled && e.state !== `error`;
        case `disabled`:
          return !e.enabled && e.state !== `error`;
        case `issues`:
          return e.state === `error`;
        default:
          return !0;
      }
    }),
  );
}
function qe(e) {
  let t = new Map();
  for (let n of e) {
    let e = n.category ?? `other`,
      r = t.get(e) ?? [];
    (r.push(n), t.set(e, r));
  }
  let n = (e) => {
    let t = T.indexOf(e);
    return t === -1 ? T.length : t;
  };
  return [...t.entries()]
    .map(([e, t]) => ({ category: e, label: w(e), plugins: t }))
    .toSorted((e, t) => n(e.category) - n(t.category));
}
function Je(e, t = ``) {
  let n = j(e.filter((e) => e.featured && A(e, t))),
    r = new Set(n.map((e) => e.id));
  return {
    featured: n,
    official: j(
      e.filter((e) => !r.has(e.id) && e.origin === `official` && !e.installed && A(e, t)),
    ),
    connectors: Fe.filter((e) => Ge(e, t)),
  };
}
function M(e, t) {
  let n = S(e);
  if (n)
    return s`<span class="plugins-tile">
      <img src=${n} alt="" loading="lazy" decoding="async" />
    </span>`;
  let [r, i] = E(e),
    a = C(t);
  return s`<span
    class="plugins-tile plugins-tile--fallback"
    style=${`--plugins-art-a:${r};--plugins-art-b:${i}`}
    aria-hidden="true"
  >
    ${a ? s`<span>${a}</span>` : v.puzzle}
  </span>`;
}
function Ye(e) {
  switch (e.state) {
    case `enabled`:
      return g(`pluginsPage.enabled`);
    case `disabled`:
      return g(`pluginsPage.disabled`);
    case `error`:
      return g(`pluginsPage.needsAttention`);
    case `not-installed`:
      return g(`pluginsPage.available`);
    default:
      return e.state;
  }
}
function N(e) {
  return y({
    kind: e.state === `enabled` ? `ok` : e.state === `error` ? `danger` : `muted`,
    label: Ye(e),
  });
}
function P(e) {
  switch (e) {
    case `bundled`:
      return g(`pluginsPage.included`);
    case `global`:
      return g(`pluginsPage.global`);
    case `workspace`:
      return g(`pluginsPage.workspace`);
    case `config`:
      return g(`pluginsPage.config`);
    case `official`:
      return g(`pluginsPage.official`);
    default:
      return e;
  }
}
function F(e) {
  let t = e.filter((e) => e !== l && e !== ``);
  return t.length === 0
    ? l
    : s`<span class="settings-row__desc plugins-meta">
    ${t.map((e, t) => s`${t > 0 ? s`<span aria-hidden="true"> · </span>` : l}${e}`)}
  </span>`;
}
function I(e, t, n, r) {
  if (!t) return l;
  let i = t.kind === `error` ? `alert` : `status`;
  return s`
    <div class="plugins-row-message plugins-row-message--${t.kind}" role=${i}>
      <span>${t.text}</span>
      ${
        t.acknowledge
          ? s`
            <button
              type="button"
              class="btn btn--sm"
              title=${r.mutationBlockedReason ?? ``}
              ?disabled=${n || !r.canMutate}
              @click=${() => r.onInstall(e, { source: `clawhub`, packageName: t.acknowledge?.packageName ?? ``, ...(t.acknowledge?.version ? { version: t.acknowledge.version } : {}), acknowledgeClawHubRisk: !0 })}
            >
              ${g(n ? `pluginsPage.installing` : `pluginsPage.acknowledgeRisk`)}
            </button>
          `
          : l
      }
    </div>
  `;
}
function L(e) {
  return !!e.target?.closest(`button, a, input, label, form, [role='menu']`);
}
function R(e, t, n) {
  let r = !n.enabled;
  return s`
    <button
      type="button"
      class="btn btn--sm"
      title=${e.mutationBlockedReason ?? ``}
      ?disabled=${!e.canMutate || t}
      @click=${(e) => {
        (e.stopPropagation(), n.onToggle(r));
      }}
    >
      ${g(t ? `pluginsPage.working` : r ? `pluginsPage.enableAction` : `pluginsPage.disableAction`)}
    </button>
  `;
}
function z(e, t, n, r) {
  return s`
    <button
      type="button"
      class="btn btn--sm btn--icon plugins-remove"
      aria-label=${g(`pluginsPage.removeNamed`, { name: n })}
      title=${e.mutationBlockedReason ?? g(`pluginsPage.removeNamed`, { name: n })}
      ?disabled=${!e.canMutate || t}
      @click=${(e) => {
        (e.stopPropagation(), r());
      }}
    >
      ${v.trash}
    </button>
  `;
}
function B(e, t, n, r, i) {
  return s`
    <button
      type="button"
      class="btn btn--sm plugins-install"
      title=${e.mutationBlockedReason ?? ``}
      aria-label=${g(`pluginsPage.installNamed`, { name: r })}
      ?disabled=${!e.canMutate || t}
      @click=${(t) => {
        (t.stopPropagation(), e.onInstall(n, i));
      }}
    >
      ${g(t ? `pluginsPage.installing` : `pluginsPage.install`)}
    </button>
  `;
}
function V(e, t, n, r) {
  return s`
    <span
      class="plugins-remove-confirm"
      role="alertdialog"
      aria-label=${g(`pluginsPage.removeNamed`, { name: e.name })}
    >
      <span>${g(`pluginsPage.removeConfirm`)}</span>
      <button
        type="button"
        class="btn btn--sm danger"
        ?disabled=${n || !t.canMutate}
        @click=${(n) => {
          (n.stopPropagation(), t.onUninstall(e.id, r));
        }}
      >
        ${g(n ? `pluginsPage.removing` : `pluginsPage.remove`)}
      </button>
      <button
        type="button"
        class="btn btn--sm"
        ?disabled=${n}
        @click=${(e) => {
          (e.stopPropagation(), t.onCancelUninstall(r));
        }}
      >
        ${g(`pluginsPage.cancel`)}
      </button>
    </span>
  `;
}
function H(e, t, n, r) {
  if (t.pendingRemoval[r]) return V(e, t, n, r);
  if (!e.installed) {
    let i = e.install;
    return i
      ? B(t, n, r, e.name, i)
      : s`<span class="plugins-action-note">${g(`pluginsPage.unavailable`)}</span>`;
  }
  return s`
    ${R(t, n, { enabled: e.enabled, onToggle: (n) => t.onSetEnabled(e.id, n, r) })}
    ${e.removable ? z(t, n, e.name, () => t.onRequestUninstall(r)) : l}
  `;
}
function Xe(e) {
  let t = (e.result?.plugins ?? []).filter((e) => e.installed),
    n = t.filter((e) => e.state === `error`).length,
    r = t.filter((e) => e.enabled && e.state !== `error`).length,
    i = { all: t.length, enabled: r, disabled: t.length - r - n, issues: n };
  return Me({
    value: e.installedFilter,
    ariaLabel: g(`pluginsPage.filterLabel`),
    options: J.map((e) => ({
      value: e,
      label: s`${He(e)} <span class="settings-count">${i[e]}</span>`,
    })),
    onChange: (t) => e.onFilterChange(t),
  });
}
function Ze(e, t) {
  let n = D(e.id),
    r = t.busy[n] ?? !1;
  return s`
    <article
      class="settings-row plugins-item plugins-item--clickable"
      data-plugin-id=${e.id}
      data-plugin-source=${e.origin ?? `unknown`}
      data-plugin-status=${e.state}
      aria-busy=${r ? `true` : `false`}
      @click=${(n) => {
        L(n) || t.onShowDetails(e.id);
      }}
    >
      ${M(e.id, e.name)}
      <div class="settings-row__text">
        <h3 class="settings-row__title">
          ${e.name}
          ${e.version ? s`<span class="plugins-version">v${e.version}</span>` : l}
        </h3>
        <span class="settings-row__desc">
          ${e.description || g(`pluginsPage.optionalCapability`)}
        </span>
        ${F([e.origin ? P(e.origin) : l, e.packageName ? s`<span class="plugins-meta__mono">${e.packageName}</span>` : l])}
      </div>
      <div class="settings-row__control">
        ${N(e)} ${H(e, t, r, n)}
      </div>
      ${
        e.error
          ? s`<div class="plugins-row-message plugins-row-message--error" role="alert">
            ${e.error}
          </div>`
          : l
      }
      ${I(n, t.messages[n], r, t)}
    </article>
  `;
}
function Qe(e) {
  let t = k(e.query),
    n = e.mcpServers?.filter(
      (e) =>
        !t || e.name.toLocaleLowerCase().includes(t) || e.target.toLocaleLowerCase().includes(t),
    );
  if (t && n && n.length === 0) return l;
  let r = n
    ? n.length === 0
      ? b(g(`pluginsPage.mcpEmpty`))
      : u(
          n,
          (e) => e.name,
          (t) => $e(t, e),
        )
    : s`<div class="plugins-search-state" role="status">${g(`pluginsPage.loading`)}</div>`;
  return x(
    {
      title: g(`pluginsPage.mcpServersGroup`),
      ...(n ? { count: n.length } : {}),
      description: g(`pluginsPage.mcpHint`),
      actions: s`
        <a class="plugins-group__link" href=${e.mcpSettingsHref}
          >${g(`pluginsPage.mcpSettingsLink`)}</a
        >
        <button
          type="button"
          class="btn btn--sm"
          title=${e.mutationBlockedReason ?? ``}
          ?disabled=${!e.canMutate || e.mcpBusy}
          @click=${() => e.onMcpFormToggle(!e.mcpFormOpen)}
        >
          <span aria-hidden="true">${v.plus}</span>
          ${g(`pluginsPage.mcpAdd`)}
        </button>
      `,
    },
    s`
      ${e.mcpFormOpen ? et(e) : l}
      ${
        e.mcpMessage
          ? s`<div
            class="plugins-row-message plugins-row-message--${e.mcpMessage.kind} plugins-group-message"
            role=${e.mcpMessage.kind === `error` ? `alert` : `status`}
          >
            <span>${e.mcpMessage.text}</span>
          </div>`
          : l
      }
      ${r}
    `,
  );
}
function $e(e, t) {
  return s`
    <article class="settings-row plugins-item" data-mcp-name=${e.name}>
      ${M(e.name, e.name)}
      <div class="settings-row__text">
        <h3 class="settings-row__title">${e.name}</h3>
        <span class="settings-row__desc plugins-meta__mono">${e.target}</span>
        ${F([g(`pluginsPage.mcp`), e.transport, e.auth === `oauth` ? g(`pluginsPage.oauth`) : l])}
      </div>
      <div class="settings-row__control">
        ${y({ kind: e.enabled ? `ok` : `muted`, label: e.enabled ? g(`pluginsPage.enabled`) : g(`pluginsPage.disabled`) })}
        ${R(t, t.mcpBusy, { enabled: e.enabled, onToggle: (n) => t.onMcpToggle(e.name, n) })}
        ${z(t, t.mcpBusy, e.name, () => t.onMcpRemove(e.name))}
      </div>
    </article>
  `;
}
function et(e) {
  return s`
    <form class="plugins-mcp-form" @submit=${(t) => {
      t.preventDefault();
      let n = t.currentTarget,
        r = new FormData(n),
        i = r.get(`mcp-name`),
        a = r.get(`mcp-target`);
      e.onMcpAdd({
        name: typeof i == `string` ? i.trim() : ``,
        target: typeof a == `string` ? a.trim() : ``,
      });
    }}>
      <label>
        <span>${g(`pluginsPage.mcpNameLabel`)}</span>
        <input
          name="mcp-name"
          class="settings-input"
          type="text"
          required
          placeholder="context7"
          autocomplete="off"
        />
      </label>
      <label class="plugins-mcp-form__target">
        <span>${g(`pluginsPage.mcpTargetLabel`)}</span>
        <input
          name="mcp-target"
          class="settings-input"
          type="text"
          required
          placeholder="https://mcp.example.com/mcp  ·  npx some-mcp-server"
          autocomplete="off"
        />
      </label>
      <div class="plugins-mcp-form__actions">
        <button type="submit" class="btn btn--sm" ?disabled=${e.mcpBusy}>
          ${e.mcpBusy ? g(`pluginsPage.mcpAdding`) : g(`pluginsPage.mcpAdd`)}
        </button>
        <button type="button" class="btn btn--sm" @click=${() => e.onMcpFormToggle(!1)}>
          ${g(`pluginsPage.cancel`)}
        </button>
      </div>
    </form>
  `;
}
function tt(e) {
  let t = qe(Ke(e.result?.plugins ?? [], e.query, e.installedFilter));
  return s`
    ${Xe(e)}
    ${
      t.length === 0
        ? q(
            e.query || e.installedFilter !== `all`
              ? g(`pluginsPage.noInstalledMatchTitle`)
              : g(`pluginsPage.noInstalledTitle`),
            e.query || e.installedFilter !== `all`
              ? g(`pluginsPage.noMatchBody`)
              : g(`pluginsPage.noInstalledBody`),
          )
        : t.map((t) =>
            x(
              { title: t.label, count: t.plugins.length },
              u(
                t.plugins,
                (e) => e.id,
                (t) => Ze(t, e),
              ),
            ),
          )
    }
    ${Qe(e)}
  `;
}
function U(e, t) {
  let n = D(e.id),
    r = t.busy[n] ?? !1;
  return s`
    <article
      class="settings-row plugins-item plugins-item--clickable"
      data-plugin-id=${e.id}
      data-plugin-source=${e.origin ?? `unknown`}
      data-plugin-status=${e.state}
      aria-busy=${r ? `true` : `false`}
      @click=${(n) => {
        L(n) || t.onShowDetails(e.id);
      }}
    >
      ${M(e.id, e.name)}
      <div class="settings-row__text">
        <h3 class="settings-row__title">
          ${e.name}
          ${e.version ? s`<span class="plugins-version">v${e.version}</span>` : l}
        </h3>
        <span class="settings-row__desc">
          ${e.description || g(`pluginsPage.optionalCapability`)}
        </span>
        ${F([e.origin ? P(e.origin) : l])}
      </div>
      <div class="settings-row__control">
        ${e.installed ? N(e) : l}
        ${H(e, t, r, n)}
      </div>
      ${
        e.error
          ? s`<div class="plugins-row-message plugins-row-message--error" role="alert">
            ${e.error}
          </div>`
          : l
      }
      ${I(n, t.messages[n], r, t)}
    </article>
  `;
}
function nt(e, t) {
  let n = O(e.id),
    r = t.busy[n] ?? !1,
    i = e.action.kind === `mcp`,
    a =
      i &&
      !!t.mcpServers?.some((t) => e.action.kind === `mcp` && t.name === e.action.mcp.serverName);
  return s`
    <article
      class="settings-row plugins-item"
      data-connector-id=${e.id}
      aria-busy=${r ? `true` : `false`}
    >
      ${M(e.id, e.name)}
      <div class="settings-row__text">
        <h3 class="settings-row__title">${e.name}</h3>
        <span class="settings-row__desc">${g(e.descriptionKey)}</span>
        ${F(i ? [g(`pluginsPage.mcp`), g(`pluginsPage.connectorMcpNote`)] : [g(`pluginsPage.connectorClawHubNote`)])}
      </div>
      <div class="settings-row__control">
        ${
          i
            ? a
              ? y({ kind: `ok`, label: g(`pluginsPage.connectorAdded`) })
              : s`
                <button
                  type="button"
                  class="btn btn--sm"
                  title=${t.mutationBlockedReason ?? ``}
                  ?disabled=${!t.canMutate || r}
                  @click=${() => t.onAddConnector(e)}
                >
                  ${g(r ? `pluginsPage.mcpAdding` : `pluginsPage.connectorAdd`)}
                </button>
              `
            : s`
              <button
                type="button"
                class="btn btn--sm"
                @click=${() => e.action.kind === `clawhub` && t.onSearchClawHub(e.action.query)}
              >
                <span aria-hidden="true">${v.search}</span>
                ${g(`pluginsPage.connectorSearch`)}
              </button>
            `
        }
      </div>
      ${I(n, t.messages[n], r, t)}
    </article>
  `;
}
function W(e, t) {
  return t.length === 0 ? l : x({ title: e, count: t.length }, t);
}
function rt(e, t) {
  return t.find(
    (t) =>
      t.installed &&
      (t.id === e.package.runtimeId ||
        t.packageName === e.package.name ||
        (t.install?.source === `clawhub` && t.install.packageName === e.package.name)),
  );
}
function it(e) {
  return e === `source-linked` ? g(`pluginsPage.verifiedSource`) : e;
}
function at(e, t) {
  let n = e.package,
    r = rt(e, t.result?.plugins ?? []),
    i = We(n.name),
    a = t.busy[i] ?? !1,
    o = n.runtimeId ?? n.name;
  return s`
    <article
      class="settings-row plugins-item ${r ? `plugins-item--clickable` : ``}"
      data-package-name=${n.name}
      data-plugin-source="clawhub"
      data-plugin-status=${r?.state ?? `not-installed`}
      aria-busy=${a ? `true` : `false`}
      @click=${(e) => {
        r && !L(e) && t.onShowDetails(r.id);
      }}
    >
      ${M(o, n.displayName)}
      <div class="settings-row__text">
        <h3 class="settings-row__title">
          ${n.displayName}
          ${n.latestVersion ? s`<span class="plugins-version">v${n.latestVersion}</span>` : l}
        </h3>
        <span class="settings-row__desc">${n.summary || n.name}</span>
        ${F([
          n.isOfficial ? g(`pluginsPage.official`) : l,
          n.verificationTier ? it(n.verificationTier) : l,
          typeof n.downloads == `number`
            ? s`<span class="plugins-downloads">
                <span aria-hidden="true">${v.download}</span>
                ${Y.format(n.downloads)}
              </span>`
            : l,
          n.family === `bundle-plugin`
            ? g(`pluginsPage.bundlePlugin`)
            : g(`pluginsPage.codePlugin`),
        ])}
      </div>
      <div class="settings-row__control">
        ${r ? s`${N(r)}${H(r, t, a, i)}` : B(t, a, i, n.displayName, { source: `clawhub`, packageName: n.name })}
      </div>
      ${I(i, t.messages[i], a, t)}
    </article>
  `;
}
function ot(e) {
  let t = e.query.trim();
  if (t.length < 2) return l;
  let n;
  return (
    (n =
      e.searchLoading || (!e.searchResults && !e.searchError)
        ? s`<div class="plugins-search-state" role="status">
      ${g(`pluginsPage.searching`)}
    </div>`
        : e.searchError
          ? s`<div class="plugins-search-state plugins-search-state--error" role="alert">
      ${e.searchError}
    </div>`
          : e.searchResults && e.searchResults.length === 0
            ? s`${b(g(`pluginsPage.noClawHubResultsBody`, { query: t }))}`
            : s`
      ${u(
        e.searchResults ?? [],
        (e) => e.package.name,
        (t) => at(t, e),
      )}
    `),
    x(
      {
        title: g(`pluginsPage.fromClawHub`),
        ...(e.searchResults ? { count: e.searchResults.length } : {}),
        actions: s`
        <a
          class="plugins-group__link"
          href=${se}
          target=${pe}
          rel=${ue()}
        >
          ${g(`pluginsPage.browseClawHub`)}
          <span class="plugins-group__link-icon" aria-hidden="true">${v.externalLink}</span>
        </a>
      `,
      },
      n,
    )
  );
}
function st(e) {
  let t = Je(e.result?.plugins ?? [], e.query),
    n = t.featured.map((t) => U(t, e)),
    r = t.official.map((t) => U(t, e)),
    i = ot(e);
  return !n.length && !r.length && !t.connectors.length
    ? s`
      ${i === l ? q(g(`pluginsPage.noDiscoverMatchTitle`), g(`pluginsPage.noMatchBody`)) : l}
      ${i}
    `
    : s`
    ${W(g(`pluginsPage.featuredGroup`), n)}
    ${W(g(`pluginsPage.officialGroup`), r)}
    ${ct(t.connectors, e)} ${i}
  `;
}
function ct(e, t) {
  if (e.length === 0) return l;
  let n = Ie.map((t) => ({ group: t, entries: e.filter((e) => e.group === t) })).filter(
    (e) => e.entries.length > 0,
  );
  return x(
    {
      title: g(`pluginsPage.connectorsGroup`),
      count: e.length,
      description: g(`pluginsPage.connectorsHint`),
    },
    n.map(
      (e) => s`
        <h3 class="plugins-subheader" data-connector-group=${e.group}>
          ${Ue(e.group)}
        </h3>
        ${e.entries.map((e) => nt(e, t))}
      `,
    ),
  );
}
function G(e, t) {
  return s`
    <div class="plugins-detail__meta-row">
      <span class="plugins-detail__meta-label">${e}</span>
      <span class="plugins-detail__meta-value">${t}</span>
    </div>
  `;
}
function K(e) {
  let t = e.detailPluginId ? e.result?.plugins.find((t) => t.id === e.detailPluginId) : void 0;
  if (!t) return l;
  let n = D(t.id),
    r = e.busy[n] ?? !1;
  return s`
    <openclaw-modal-dialog
      label=${t.name}
      style="--openclaw-modal-width: min(580px, calc(100vw - 32px));"
      @modal-cancel=${() => e.onShowDetails(null)}
    >
      <section class="plugins-detail" data-detail-plugin-id=${t.id}>
        <button
          type="button"
          class="btn btn--sm btn--icon plugins-detail__close"
          aria-label=${g(`pluginsPage.detailClose`)}
          @click=${() => e.onShowDetails(null)}
        >
          ${v.x}
        </button>
        ${lt(t.id, t.name)}
        <div class="plugins-detail__body">
          <div class="plugins-detail__title">
            <h2>${t.name}</h2>
            ${t.version ? s`<span class="plugins-version">v${t.version}</span>` : l}
            ${N(t)}
          </div>
          <p class="plugins-detail__description">
            ${t.description || g(`pluginsPage.optionalCapability`)}
          </p>
          <div class="plugins-detail__actions">
            ${
              e.pendingRemoval[n]
                ? V(t, e, r, n)
                : s`
                  ${
                    t.installed
                      ? s`
                        <button
                          type="button"
                          class="btn ${t.enabled ? `` : `primary`}"
                          title=${e.mutationBlockedReason ?? ``}
                          ?disabled=${!e.canMutate || r}
                          @click=${() => e.onSetEnabled(t.id, !t.enabled, n)}
                        >
                          ${r ? g(`pluginsPage.working`) : t.enabled ? g(`pluginsPage.disableAction`) : g(`pluginsPage.enableAction`)}
                        </button>
                      `
                      : t.install
                        ? B(e, r, n, t.name, t.install)
                        : l
                  }
                  ${
                    t.removable
                      ? s`
                        <button
                          type="button"
                          class="btn plugins-detail__remove"
                          title=${e.mutationBlockedReason ?? ``}
                          ?disabled=${!e.canMutate || r}
                          @click=${() => e.onRequestUninstall(n)}
                        >
                          <span aria-hidden="true">${v.trash}</span>
                          ${g(`pluginsPage.remove`)}
                        </button>
                      `
                      : l
                  }
                `
            }
          </div>
          ${
            t.error
              ? s`<div class="plugins-row-message plugins-row-message--error" role="alert">
                ${t.error}
              </div>`
              : l
          }
          ${I(n, e.messages[n], r, e)}
          <div class="plugins-detail__meta">
            ${t.origin ? G(g(`pluginsPage.detailOrigin`), P(t.origin)) : l}
            ${t.category ? G(g(`pluginsPage.detailCategory`), w(t.category)) : l}
            ${t.packageName ? G(g(`pluginsPage.detailPackage`), s`<code>${t.packageName}</code>`) : l}
            ${G(g(`pluginsPage.detailPluginId`), s`<code>${t.id}</code>`)}
          </div>
        </div>
      </section>
    </openclaw-modal-dialog>
  `;
}
function lt(e, t) {
  let n = S(e);
  if (n)
    return s`<span class="plugins-cover">
      <img src=${n} alt="" loading="lazy" decoding="async" />
    </span>`;
  let [r, i] = E(e),
    a = C(t);
  return s`<span
    class="plugins-cover plugins-cover--fallback"
    style=${`--plugins-art-a:${r};--plugins-art-b:${i}`}
    aria-hidden="true"
  >
    ${a ? s`<span>${a}</span>` : v.puzzle}
  </span>`;
}
function q(e, t) {
  return s`
    <div class="plugins-empty">
      <span class="plugins-empty__icon" aria-hidden="true">${v.puzzle}</span>
      <h2>${e}</h2>
      <p>${t}</p>
    </div>
  `;
}
function ut(e) {
  switch (e.activeTab) {
    case `installed`:
      return tt(e);
    case `discover`:
      return st(e);
    default:
      return e.activeTab;
  }
}
function dt(e) {
  let t = !!e.result;
  return je(
    s`
      <div class="plugins-toolbar">
        <input
          id="plugins-global-search"
          class="settings-input plugins-toolbar__search"
          name="plugins-search"
          type="search"
          autocomplete="off"
          aria-label=${g(`pluginsPage.searchLabel`)}
          .value=${te(e.query)}
          placeholder=${g(`pluginsPage.searchPlaceholder`)}
          @input=${(t) => e.onQueryChange(t.currentTarget.value)}
        />
        <button
          type="button"
          class="btn btn--sm btn--icon plugins-refresh"
          aria-label=${g(`pluginsPage.refresh`)}
          title=${g(`pluginsPage.refresh`)}
          ?disabled=${e.loading || !e.connected}
          @click=${e.onRefresh}
        >
          <span aria-hidden="true">${v.refresh}</span>
        </button>
      </div>

      ${
        e.mutationBlockedReason
          ? s`<div class="plugins-readonly" role="note">
            <span aria-hidden="true">${v.alertTriangle}</span>
            <span>${e.mutationBlockedReason}</span>
          </div>`
          : l
      }
      ${
        e.error
          ? s`<div class="plugins-page-error" role="alert">
            <span>${e.error}</span>
            <button type="button" class="btn btn--sm" @click=${e.onRefresh}>
              ${g(`pluginsPage.tryAgain`)}
            </button>
          </div>`
          : l
      }
      ${
        e.pageNotice
          ? s`<div
            class="plugins-row-message plugins-row-message--${e.pageNotice.kind} plugins-page-notice"
            role=${e.pageNotice.kind === `error` ? `alert` : `status`}
          >
            <span>${e.pageNotice.text}</span>
          </div>`
          : l
      }

      <wa-tab-panel
        id="plugins-hub-panel"
        class="plugins-panel"
        name=${e.activeTab}
        active
        aria-labelledby=${`plugins-tab-${e.activeTab}`}
      >
        ${e.loading && !t ? s`<div class="plugins-search-state" role="status">${g(`pluginsPage.loading`)}</div>` : e.error && !t ? l : !e.connected && !t ? q(g(`pluginsPage.offlineTitle`), g(`pluginsPage.offlineBody`)) : ut(e)}
      </wa-tab-panel>
      ${K(e)}
    `,
    { wide: !0 },
  );
}
var J,
  Y,
  ft = e(() => {
    (c(),
      re(),
      ne(),
      De(),
      Oe(),
      Ne(),
      _(),
      ae(),
      Ve(),
      p(),
      Pe(),
      (J = [`all`, `enabled`, `disabled`, `issues`]),
      (Y = new Intl.NumberFormat(void 0, { notation: `compact`, maximumFractionDigits: 1 })));
  });
function X(e) {
  return e instanceof Error ? e.message : String(e);
}
function pt(e, t) {
  if (!e) return e;
  let n = e.plugins.findIndex((e) => e.id === t.id),
    r = [...e.plugins];
  return (n >= 0 ? (r[n] = t) : r.push(t), { ...e, plugins: r });
}
function Z(e, t) {
  let n = t.restartRequired ? `pluginsPage.${e}Restart` : `pluginsPage.${e}Success`,
    r = `warnings` in t ? (t.warnings ?? []) : [];
  return [g(n, { name: t.plugin.name }), ...r].filter(Boolean).join(`
`);
}
function mt(e) {
  if (!e) return null;
  let t = d(d(e.mcp)?.servers) ?? {};
  return Object.entries(t)
    .map(([e, t]) => {
      let n = d(t) ?? {},
        r = typeof n.url == `string` ? n.url : ``,
        i = typeof n.command == `string` ? n.command : ``,
        a = r || i || `missing transport`;
      return {
        name: e,
        enabled: n.enabled !== !1,
        transport: r ? `http` : i ? `stdio` : `invalid`,
        target: r ? Le(a) : a,
        auth: typeof n.auth == `string` ? n.auth : null,
      };
    })
    .toSorted((e, t) => e.name.localeCompare(t.name));
}
function ht(e) {
  if (/^https?:\/\//i.test(e))
    return {
      url: e,
      transport: /\/sse\/?$/i.test(e.split(`?`)[0] ?? e) ? `sse` : `streamable-http`,
    };
  let [t, ...n] = e.trim().split(/\s+/u);
  return t ? (n.length > 0 ? { command: t, args: n } : { command: t }) : null;
}
var Q, $;
e(() => {
  (r(),
    Re(),
    ie(),
    c(),
    a(),
    Te(),
    ye(),
    Ee(),
    Se(),
    ze(),
    Ae(),
    _(),
    ce(),
    p(),
    me(),
    ge(),
    ft(),
    t(),
    (Q = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/),
    ($ = class extends _e {
      constructor(...e) {
        (super(...e),
          (this.client = null),
          (this.connected = !1),
          (this.loading = !1),
          (this.result = null),
          (this.error = null),
          (this.configRefreshError = null),
          (this.activeTab = `installed`),
          (this.query = ``),
          (this.installedFilter = `all`),
          (this.searchResults = null),
          (this.searchLoading = !1),
          (this.searchError = null),
          (this.busy = {}),
          (this.messages = {}),
          (this.pendingRemoval = {}),
          (this.detailPluginId = null),
          (this.pageNotice = null),
          (this.mcpServers = null),
          (this.mcpMessage = null),
          (this.mcpBusy = !1),
          (this.mcpFormOpen = !1),
          (this.sourceGeneration = 0),
          (this.catalogRequestGeneration = 0),
          (this.configRequestGeneration = 0),
          (this.searchRequestGeneration = 0),
          (this.routeDataConsumed = !1),
          (this.searchTimer = null),
          (this.mutationToken = 0),
          (this.mutationTokens = new Map()),
          (this.subscriptions = new he(this)
            .effect(
              () => this.context?.gateway,
              (e) => {
                let t = this.gatewaySource !== void 0 && this.gatewaySource !== e;
                return (
                  (this.gatewaySource = e),
                  this.applyGatewaySnapshot(e.snapshot, t),
                  e.subscribe((t) => {
                    this.gatewaySource === e && this.applyGatewaySnapshot(t, !1);
                  })
                );
              },
            )
            .effect(
              () => this.context?.runtimeConfig,
              (e) => (this.syncMcpServers(), e.subscribe(() => this.syncMcpServers())),
            )),
          (this.handleDocumentKeydown = (e) => {
            e.key === `Escape` &&
              this.detailPluginId &&
              ((this.detailPluginId = null), e.stopPropagation());
          }));
      }
      willUpdate(e) {
        e.has(`routeData`) && this.applyRouteData();
      }
      connectedCallback() {
        (super.connectedCallback(),
          document.addEventListener(`keydown`, this.handleDocumentKeydown, !0));
      }
      disconnectedCallback() {
        (document.removeEventListener(`keydown`, this.handleDocumentKeydown, !0),
          this.subscriptions.clear(),
          this.clearSearchTimer(),
          this.invalidateRequests(),
          super.disconnectedCallback());
      }
      applyGatewaySnapshot(e, t) {
        let n = e.connected !== this.connected,
          r = e.client !== this.client,
          i = (t || n || r) && e.connected && this.routeDataConsumed;
        ((t || n || r) &&
          (this.invalidateRequests(),
          (this.client = e.client),
          (this.connected = e.connected),
          (this.loading = !1),
          (this.searchLoading = !1),
          (this.busy = {}),
          (this.mcpBusy = !1),
          (this.configRefreshError = null),
          (this.searchResults = null),
          (this.searchError = null),
          (t || r) &&
            ((this.result = null),
            (this.error = null),
            (this.messages = {}),
            (this.pendingRemoval = {}),
            (this.detailPluginId = null),
            (this.pageNotice = null),
            (this.mcpMessage = null))),
          i ? this.refreshPage() : this.ensureInitialData(),
          e.connected &&
            this.context?.runtimeConfig.ensureLoaded().then(() => this.syncMcpServers()),
          (t || n || r) && e.connected && this.activeTab === `discover` && this.scheduleSearch());
      }
      applyRouteData() {
        let e = this.routeData;
        if (((this.routeDataConsumed = !0), !e)) {
          this.ensureInitialData();
          return;
        }
        let t = e.initialTab ?? `installed`;
        t !== this.activeTab && this.changeTab(t);
        let n = this.context.gateway.snapshot;
        if (e.gateway !== this.context.gateway || e.gatewaySnapshot !== n) {
          this.ensureInitialData();
          return;
        }
        ((this.client = n.client),
          (this.connected = n.connected),
          (this.loading = !1),
          (this.result = e.result),
          (this.error = e.error),
          this.ensureInitialData());
      }
      invalidateRequests() {
        ((this.sourceGeneration += 1),
          (this.catalogRequestGeneration += 1),
          (this.configRequestGeneration += 1),
          (this.searchRequestGeneration += 1),
          this.clearSearchTimer(),
          this.mutationTokens.clear());
      }
      clearSearchTimer() {
        this.searchTimer &&= (clearTimeout(this.searchTimer), null);
      }
      isCurrentSource(e, t) {
        return (
          this.isConnected && this.connected && this.client === e && this.sourceGeneration === t
        );
      }
      ensureInitialData() {
        !this.connected ||
          !this.client ||
          this.loading ||
          this.result ||
          this.error ||
          (this.routeData && !this.routeDataConsumed) ||
          this.refreshCatalog();
      }
      async refreshCatalog() {
        let e = this.client;
        if (!e || !this.connected) return;
        let t = this.sourceGeneration,
          n = ++this.catalogRequestGeneration,
          r = () => this.isCurrentSource(e, t) && n === this.catalogRequestGeneration;
        ((this.loading = !0), (this.error = null));
        try {
          let t = await m(e);
          r() && (this.result = t);
        } catch (e) {
          r() && (this.error = X(e));
        } finally {
          r() && (this.loading = !1);
        }
      }
      async refreshRuntimeConfig() {
        let e = this.client;
        if (!e || !this.connected) return;
        let t = this.context.runtimeConfig,
          n = this.sourceGeneration,
          r = ++this.configRequestGeneration,
          i = () => this.isCurrentSource(e, n) && r === this.configRequestGeneration;
        this.configRefreshError = null;
        let a = null;
        try {
          await t.refresh();
        } catch (e) {
          a = X(e);
        }
        if (!i()) return;
        this.syncMcpServers();
        let o = a ?? t.state.lastError;
        this.configRefreshError = o ? g(`pluginsPage.configRefreshFailed`, { error: o }) : null;
      }
      async refreshPage() {
        await Promise.all([this.refreshCatalog(), this.refreshRuntimeConfig()]);
      }
      syncMcpServers() {
        let e = this.context?.runtimeConfig.state.configSnapshot;
        this.mcpServers = mt(h(e));
      }
      selectHubTab(e) {
        if (e === `installed` || e === `discover`) {
          (this.changeTab(e),
            this.context.navigate(
              `plugins`,
              e === `discover` ? { search: `?tab=discover` } : void 0,
            ));
          return;
        }
        this.context.navigate(e === `skills` ? `skills` : `skill-workshop`);
      }
      changeTab(e) {
        ((this.activeTab = e),
          this.clearSearchTimer(),
          (this.searchRequestGeneration += 1),
          (this.searchLoading = !1),
          (this.searchResults = null),
          (this.searchError = null),
          e === `discover` && this.scheduleSearch());
      }
      changeQuery(e) {
        ((this.query = e),
          this.clearSearchTimer(),
          (this.searchRequestGeneration += 1),
          (this.searchLoading = !1),
          (this.searchResults = null),
          (this.searchError = null),
          this.activeTab === `discover` && this.scheduleSearch());
      }
      openClawHubSearch(e) {
        ((this.query = e), this.changeTab(`discover`));
      }
      scheduleSearch() {
        let e = this.query.trim();
        e.length < 2 ||
          !this.connected ||
          !this.client ||
          (this.searchTimer = setTimeout(() => {
            ((this.searchTimer = null), this.searchClawHub(e));
          }, 300));
      }
      async searchClawHub(e) {
        let t = this.client;
        if (!t || !this.connected || e.length < 2) return;
        let n = this.sourceGeneration,
          r = ++this.searchRequestGeneration,
          i = () =>
            this.isCurrentSource(t, n) &&
            r === this.searchRequestGeneration &&
            this.activeTab === `discover` &&
            this.query.trim() === e;
        ((this.searchLoading = !0), (this.searchError = null), (this.searchResults = null));
        try {
          let n = await fe(t, e);
          i() && (this.searchResults = n.results);
        } catch (e) {
          i() && (this.searchError = X(e));
        } finally {
          i() && (this.searchLoading = !1);
        }
      }
      mutationBlockedReason() {
        return this.connected
          ? xe(this.context.gateway.snapshot.hello?.auth ?? null)
            ? this.result && !this.result.mutationAllowed
              ? g(`pluginsPage.changesDisabled`)
              : null
            : g(`pluginsPage.adminRequired`)
          : g(`pluginsPage.connectToChange`);
      }
      canMutate() {
        return !!this.result?.mutationAllowed && this.mutationBlockedReason() === null;
      }
      setBusy(e, t) {
        let n = { ...this.busy };
        (t ? (n[e] = !0) : delete n[e], (this.busy = n));
      }
      setMessage(e, t) {
        let n = { ...this.messages };
        (t ? (n[e] = t) : delete n[e], (this.messages = n));
      }
      setPendingRemoval(e, t) {
        let n = { ...this.pendingRemoval };
        (t ? (n[e] = !0) : delete n[e], (this.pendingRemoval = n));
      }
      applyMutationResult(e) {
        this.result = pt(this.result, e.plugin);
      }
      async refreshAfterMutation(e, t) {
        let n = ++this.catalogRequestGeneration;
        ((this.loading = !1), (this.error = null));
        let [r] = await Promise.allSettled([m(e), this.refreshRuntimeConfig()]);
        !this.isCurrentSource(e, t) ||
          n !== this.catalogRequestGeneration ||
          (r.status === `fulfilled` ? (this.result = r.value) : (this.error = X(r.reason)));
      }
      pageError() {
        let e = [this.error, this.configRefreshError].filter((e) => !!e);
        return e.length > 0 ? e.join(` `) : null;
      }
      async install(e, t) {
        let n = this.client;
        if (!n || !this.canMutate() || this.busy[e]) return;
        let r = this.sourceGeneration,
          i = ++this.mutationToken;
        this.mutationTokens.set(e, i);
        let a = () => this.isCurrentSource(n, r) && this.mutationTokens.get(e) === i;
        (this.setBusy(e, !0), this.setMessage(e, null));
        try {
          let i = await le(n, t);
          if (!a()) return;
          (this.applyMutationResult(i),
            this.setMessage(e, { kind: `success`, text: Z(`installed`, i) }),
            await this.refreshAfterMutation(n, r));
        } catch (n) {
          if (!a()) return;
          let r = oe(n),
            i = t.source === `clawhub` ? t.packageName : null;
          i && ve(n)
            ? this.setMessage(e, {
                kind: `error`,
                text: r?.warning ?? g(`pluginsPage.defaultRiskWarning`),
                acknowledge: { packageName: i, ...(r?.version ? { version: r.version } : {}) },
              })
            : this.setMessage(e, { kind: `error`, text: X(n) });
        } finally {
          this.mutationTokens.get(e) === i && (this.mutationTokens.delete(e), this.setBusy(e, !1));
        }
      }
      async updateEnabled(e, t, n = D(e)) {
        let r = this.client;
        if (!r || !this.canMutate() || this.busy[n]) return;
        let i = this.sourceGeneration,
          a = ++this.mutationToken;
        this.mutationTokens.set(n, a);
        let o = () => this.isCurrentSource(r, i) && this.mutationTokens.get(n) === a;
        (this.setBusy(n, !0), this.setMessage(n, null));
        try {
          let a = await f(r, e, t);
          if (!o()) return;
          (this.applyMutationResult(a),
            this.setMessage(n, { kind: `success`, text: Z(t ? `enabled` : `disabled`, a) }),
            await this.refreshAfterMutation(r, i));
        } catch (e) {
          o() && this.setMessage(n, { kind: `error`, text: X(e) });
        } finally {
          this.mutationTokens.get(n) === a && (this.mutationTokens.delete(n), this.setBusy(n, !1));
        }
      }
      async uninstall(e, t) {
        let n = this.client;
        if (!n || !this.canMutate() || this.busy[t]) return;
        let r = this.sourceGeneration,
          i = ++this.mutationToken;
        this.mutationTokens.set(t, i);
        let a = () => this.isCurrentSource(n, r) && this.mutationTokens.get(t) === i;
        (this.setBusy(t, !0), this.setMessage(t, null));
        try {
          let i = await de(n, e);
          if (!a()) return;
          (this.setPendingRemoval(t, !1),
            (this.pageNotice = {
              kind: `success`,
              text: [
                g(`pluginsPage.removedRestart`, { name: i.pluginId }),
                ...(i.warnings ?? []),
              ].filter(Boolean).join(`
`),
            }),
            await this.refreshAfterMutation(n, r));
        } catch (e) {
          a() && this.setMessage(t, { kind: `error`, text: X(e) });
        } finally {
          this.mutationTokens.get(t) === i && (this.mutationTokens.delete(t), this.setBusy(t, !1));
        }
      }
      async mutateMcpServers(e) {
        if (!this.canMutate() || this.mcpBusy) return !1;
        let t = this.context.runtimeConfig;
        ((this.mcpBusy = !0),
          e.busyKey && (this.setBusy(e.busyKey, !0), this.setMessage(e.busyKey, null)),
          (this.mcpMessage = null));
        let n = (t) => (
          e.busyKey
            ? this.setMessage(e.busyKey, { kind: `error`, text: t })
            : (this.mcpMessage = { kind: `error`, text: t }),
          !1
        );
        try {
          await t.ensureLoaded();
          let r = h(t.state.configSnapshot);
          if (!r) return n(g(`pluginsPage.mcpConfigUnavailable`));
          let i = d(d(r.mcp)?.servers) ?? {},
            a = e.buildPatch(i);
          return `error` in a
            ? n(a.error)
            : (await t.patch({ raw: { mcp: { servers: a.patch } }, note: e.note }))
              ? (await t.refresh(),
                this.syncMcpServers(),
                (this.mcpMessage = { kind: `success`, text: e.successText }),
                !0)
              : n(t.state.lastError ?? g(`pluginsPage.mcpConfigUnavailable`));
        } catch (e) {
          return n(X(e));
        } finally {
          ((this.mcpBusy = !1), e.busyKey && this.setBusy(e.busyKey, !1));
        }
      }
      async addMcpServer(e) {
        let t = e.name.trim();
        if (!Q.test(t)) {
          this.mcpMessage = { kind: `error`, text: g(`pluginsPage.mcpNameInvalid`) };
          return;
        }
        let n = ht(e.target);
        if (!n) {
          this.mcpMessage = { kind: `error`, text: g(`pluginsPage.mcpTargetInvalid`) };
          return;
        }
        (await this.mutateMcpServers({
          buildPatch: (e) =>
            e[t] ? { error: g(`pluginsPage.mcpNameTaken`, { name: t }) } : { patch: { [t]: n } },
          note: `plugins: add MCP server ${t}`,
          successText: g(`pluginsPage.mcpAddedSuccess`, { name: t }),
        })) && (this.mcpFormOpen = !1);
      }
      async toggleMcpServer(e, t) {
        await this.mutateMcpServers({
          buildPatch: (n) =>
            n[e]
              ? { patch: { [e]: { enabled: t ? null : !1 } } }
              : { error: g(`pluginsPage.mcpMissing`, { name: e }) },
          note: `plugins: ${t ? `enable` : `disable`} MCP server ${e}`,
          successText: g(t ? `pluginsPage.enabledSuccess` : `pluginsPage.disabledSuccess`, {
            name: e,
          }),
        });
      }
      async removeMcpServer(e) {
        await this.mutateMcpServers({
          buildPatch: (t) =>
            t[e] ? { patch: { [e]: null } } : { error: g(`pluginsPage.mcpMissing`, { name: e }) },
          note: `plugins: remove MCP server ${e}`,
          successText: g(`pluginsPage.mcpRemovedSuccess`, { name: e }),
        });
      }
      async addConnector(e) {
        if (e.action.kind !== `mcp`) return;
        let t = e.action.mcp,
          n = O(e.id),
          r =
            t.followUp === `oauth`
              ? g(`pluginsPage.connectorAddedOauth`, {
                  name: e.name,
                  command: `openclaw mcp login ${t.serverName}`,
                })
              : t.followUp === `endpoint`
                ? g(`pluginsPage.connectorAddedEndpoint`, { name: e.name })
                : g(`pluginsPage.connectorAddedReady`, { name: e.name });
        (await this.mutateMcpServers({
          buildPatch: (e) =>
            e[t.serverName]
              ? { error: g(`pluginsPage.mcpNameTaken`, { name: t.serverName }) }
              : { patch: { [t.serverName]: structuredClone(t.config) } },
          note: `plugins: add MCP connector ${t.serverName}`,
          successText: r,
          busyKey: n,
        })) && (this.setMessage(n, { kind: `success`, text: r }), (this.mcpMessage = null));
      }
      render() {
        let e = this.mutationBlockedReason();
        return s`
      <section class="content-header content-header--page plugins-content-header">
        <div>
          <h1 class="page-title">${we(`plugins`)}</h1>
        </div>
      </section>
      ${ke(s`
        <div class="plugins-hub-tabs-row">
          ${Be({ active: this.activeTab, installedCount: this.result?.plugins.filter((e) => e.installed).length ?? 0, onSelect: (e) => this.selectHubTab(e) })}
        </div>
        ${dt({
          connected: this.connected,
          loading: this.loading,
          result: this.result,
          error: this.pageError(),
          activeTab: this.activeTab,
          query: this.query,
          installedFilter: this.installedFilter,
          searchResults: this.searchResults,
          searchLoading: this.searchLoading,
          searchError: this.searchError,
          busy: this.busy,
          messages: this.messages,
          pendingRemoval: this.pendingRemoval,
          detailPluginId: this.detailPluginId,
          canMutate: this.canMutate(),
          mutationBlockedReason: e,
          pageNotice: this.pageNotice,
          mcpSettingsHref: Ce(`mcp`, this.context?.basePath ?? ``),
          mcpServers: this.mcpServers,
          mcpMessage: this.mcpMessage,
          mcpBusy: this.mcpBusy,
          mcpFormOpen: this.mcpFormOpen,
          onQueryChange: (e) => this.changeQuery(e),
          onFilterChange: (e) => {
            this.installedFilter = e;
          },
          onRefresh: () => void this.refreshPage(),
          onShowDetails: (e) => {
            this.detailPluginId = e;
          },
          onSetEnabled: (e, t, n) => void this.updateEnabled(e, t, n),
          onInstall: (e, t) => void this.install(e, t),
          onRequestUninstall: (e) => this.setPendingRemoval(e, !0),
          onCancelUninstall: (e) => this.setPendingRemoval(e, !1),
          onUninstall: (e, t) => void this.uninstall(e, t),
          onAddConnector: (e) => void this.addConnector(e),
          onSearchClawHub: (e) => this.openClawHubSearch(e),
          onMcpToggle: (e, t) => void this.toggleMcpServer(e, t),
          onMcpRemove: (e) => void this.removeMcpServer(e),
          onMcpFormToggle: (e) => {
            ((this.mcpFormOpen = e), e && (this.mcpMessage = null));
          },
          onMcpAdd: (e) => void this.addMcpServer(e),
        })}
      `)}
    `;
      }
    }),
    n([i({ context: be, subscribe: !0 })], $.prototype, `context`, void 0),
    n([ee({ attribute: !1 })], $.prototype, `routeData`, void 0),
    n([o()], $.prototype, `client`, void 0),
    n([o()], $.prototype, `connected`, void 0),
    n([o()], $.prototype, `loading`, void 0),
    n([o()], $.prototype, `result`, void 0),
    n([o()], $.prototype, `error`, void 0),
    n([o()], $.prototype, `configRefreshError`, void 0),
    n([o()], $.prototype, `activeTab`, void 0),
    n([o()], $.prototype, `query`, void 0),
    n([o()], $.prototype, `installedFilter`, void 0),
    n([o()], $.prototype, `searchResults`, void 0),
    n([o()], $.prototype, `searchLoading`, void 0),
    n([o()], $.prototype, `searchError`, void 0),
    n([o()], $.prototype, `busy`, void 0),
    n([o()], $.prototype, `messages`, void 0),
    n([o()], $.prototype, `pendingRemoval`, void 0),
    n([o()], $.prototype, `detailPluginId`, void 0),
    n([o()], $.prototype, `pageNotice`, void 0),
    n([o()], $.prototype, `mcpServers`, void 0),
    n([o()], $.prototype, `mcpMessage`, void 0),
    n([o()], $.prototype, `mcpBusy`, void 0),
    n([o()], $.prototype, `mcpFormOpen`, void 0),
    customElements.get(`openclaw-plugins-page`) ||
      customElements.define(`openclaw-plugins-page`, $));
})();
//# sourceMappingURL=plugins-page-D2FdY9T5.js.map
