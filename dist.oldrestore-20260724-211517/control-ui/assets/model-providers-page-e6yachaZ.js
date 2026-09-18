import {
  K as h,
  M as le,
  P as ue,
  dt as de,
  nt as fe,
  q as pe,
} from "./control-ui-core--EZfp09c.js";
import {
  Ki as ne,
  Qi as re,
  Zi as ie,
  da as ae,
  di as oe,
  ea as se,
  fi as ce,
  la as m,
} from "./control-ui-core-BcbHa4vB.js";
import { o as g, t as _ } from "./control-ui-core-CwQmiouz.js";
import { dt as r, ft as i } from "./control-ui-foundation-0uuDj0X3.js";
import { _ as t, g as n } from "./control-ui-foundation-CCDffryi.js";
import { $ as d, Q as f, z as p } from "./control-ui-foundation-s2wA1PVE.js";
import { n as ee, r as te } from "./gateway-runtime-D6zABMsO.js";
import { G as a, Y as o, Z as s, at as c, et as l, nt as u } from "./lit-runtime-DkvDG939.js";
import {
  EMPTY_MODEL_PROVIDERS_DATA as T,
  loadModelProvidersData as E,
  t as D,
} from "./load-Dcg1fgbv.js";
import { i as ve, n as C, r as w } from "./provider-icon-CsUwkorr.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
import {
  a as v,
  f as ge,
  l as _e,
  n as y,
  r as b,
  s as x,
  t as S,
} from "./settings-ui-T0X7dZpU.js";
import { n as me, t as he } from "./settings-workspace-DRQpceJK.js";
import { n as O, r as k, t as A } from "./usage-DhfDKqcE.js";
function j(e) {
  return d(e);
}
var M = e(() => {
    f();
  }),
  N = e(() => {
    p();
  });
function P(e, t) {
  if (!e) return;
  let n = j(e);
  if (n === `openai` && (t?.credentialType === `oauth` || t?.credentialType === `token`))
    return `openai`;
  if (n !== `openai`)
    return n === `claude-cli`
      ? `anthropic`
      : n === `minimax-portal` || n === `minimax-cn` || n === `minimax-portal-cn`
        ? `minimax`
        : n || void 0;
}
var F = e(() => {
  (M(), N());
});
function I(e) {
  let t = e.trim().toLowerCase();
  return P(t) ?? t;
}
function ye(e) {
  switch (e.status) {
    case `ok`:
    case `expiring`:
    case `expired`:
    case `missing`:
      return e.status;
    default:
      return `api-key`;
  }
}
function be(e, t) {
  if (!e) return t;
  let n = H.indexOf(t.kind) < H.indexOf(e.kind) ? t : e;
  return {
    kind: n.kind,
    profileCount: e.profileCount + t.profileCount,
    ...(n.expiryLabel ? { expiryLabel: n.expiryLabel } : {}),
  };
}
function L(e, t) {
  return e.find((e) => t.some((t) => e.ids.has(t)));
}
function R(e, t, n) {
  let r = L(e, [t]);
  if (r) return r;
  let i = {
    ids: new Set([t]),
    card: {
      id: t,
      displayName: n,
      profiles: [],
      credentialProviderIds: [],
      logoutTargets: [],
      hasConfigApiKey: !1,
      modelCount: 0,
      availableModelCount: 0,
    },
    hasAuthRow: !1,
    hasUsageSnapshot: !1,
  };
  return (e.push(i), i);
}
function z(e, t) {
  let n = j(t);
  n && !e.some((e) => j(e) === n) && e.push(t);
}
function xe(e, t, n) {
  if (n.length === 0) return;
  let r = j(t),
    i = e.find((e) => j(e.provider) === r);
  if (!i) {
    e.push({ provider: t, profileIds: [...new Set(n)] });
    return;
  }
  i.profileIds = [...new Set([...i.profileIds, ...n])];
}
function Se(e) {
  let t = [],
    n = new Map();
  for (let t of e.catalogModels ?? []) {
    let e = I(t.provider);
    !e || t.apiKeySupported === void 0 || n.set(e, n.get(e) === !0 || t.apiKeySupported);
  }
  for (let n of e.configProviderIds ?? []) {
    let e = I(n);
    e && (R(t, e, w(e)).card.configKey ??= n);
  }
  for (let n of e.configApiKeyProviderIds ?? []) {
    let e = I(n);
    if (e) {
      let r = R(t, e, w(e)).card;
      ((r.configKey = n), (r.hasConfigApiKey = !0), z(r.credentialProviderIds, n));
    }
  }
  for (let [n, r] of Object.entries(e.configProviderAuthModes ?? {})) {
    let e = I(n);
    e && (R(t, e, w(e)).card.configAuthMode = r);
  }
  for (let n of e.models ?? []) {
    let e = I(n.provider);
    if (!e) continue;
    let r = R(t, e, w(e));
    ((r.card.modelCount += 1), n.available === !0 && (r.card.availableModelCount += 1));
  }
  for (let n of e.authStatus?.providers ?? []) {
    let e = I(n.provider);
    if (!e) continue;
    let r = n.usage ? I(n.usage.providerId) : e,
      i = [...new Set([e, r])],
      a = L(t, i) ?? R(t, r, w(r));
    for (let e of i) a.ids.add(e);
    ((a.card.displayName = n.displayName || a.card.displayName),
      (a.card.auth = be(a.hasAuthRow ? a.card.auth : void 0, {
        kind: ye(n),
        profileCount: n.profiles.length,
        ...(n.expiry?.label ? { expiryLabel: n.expiry.label } : {}),
      })),
      a.card.profiles.push(...n.profiles),
      (n.apiKey || n.profiles.length > 0) && z(a.card.credentialProviderIds, n.provider),
      xe(
        a.card.logoutTargets,
        n.provider,
        n.profiles.filter((e) => e.logoutSupported === !0).map((e) => e.profileId),
      ),
      (a.card.apiKey ??= n.apiKey),
      (a.hasAuthRow = !0));
    let o = n.usage;
    o &&
      !a.card.usage &&
      (a.card.usage = {
        provider: o.providerId,
        displayName: n.displayName,
        windows: o.windows,
        ...(o.summary ? { summary: o.summary } : {}),
        ...(o.plan ? { plan: o.plan } : {}),
        ...(o.billing?.length ? { billing: o.billing } : {}),
      });
  }
  for (let n of e.providerUsage?.providers ?? []) {
    let e = I(n.provider);
    if (!e) continue;
    let r = L(t, [e]) ?? R(t, e, n.displayName || w(e));
    (r.ids.add(e), (r.card.usage = n), (r.hasUsageSnapshot = !0));
  }
  for (let n of e.costByProvider ?? []) {
    let e = I(n.provider ?? ``);
    if (!e) continue;
    let r = L(t, [e]) ?? R(t, e, w(e)),
      i = {
        totalCost: n.totals.totalCost,
        totalTokens: n.totals.totalTokens,
        sessionCount: n.count,
      },
      a = r.card.localCost;
    r.card.localCost = a
      ? {
          totalCost: a.totalCost + i.totalCost,
          totalTokens: a.totalTokens + i.totalTokens,
          sessionCount: a.sessionCount + i.sessionCount,
        }
      : i;
  }
  return t
    .filter(
      (t) =>
        t.hasAuthRow ||
        (e.configProviderIds ?? []).some((e) => I(e) === t.card.id) ||
        t.hasUsageSnapshot ||
        !!t.card.usage ||
        t.card.modelCount > 0 ||
        (t.card.localCost?.totalTokens ?? 0) > 0,
    )
    .map((e) => {
      let t = n.get(e.card.id);
      return Object.assign({}, e.card, t === void 0 ? {} : { apiKeySupported: t });
    })
    .toSorted((e, t) => e.displayName.localeCompare(t.displayName));
}
function B(e) {
  return e.selectionRef === void 0
    ? e.id.startsWith(`${e.provider}/`)
      ? e.id
      : `${e.provider}/${e.id}`
    : e.selectionRef;
}
function Ce(e, t) {
  let n = new Set(
      [t.primary, ...t.fallbacks, t.utilityModel].filter(
        (e) => typeof e == `string` && e.length > 0,
      ),
    ),
    r = (e ?? []).filter((e) => e.available !== !1 || n.has(B(e))),
    i = new Set(r.map(B));
  for (let t of n) {
    if (i.has(t)) continue;
    let n = t.indexOf(`/`);
    if (n <= 0 || n === t.length - 1) {
      let n = t.trim().toLowerCase(),
        i = (e ?? []).find((e) => e.alias?.trim().toLowerCase() === n || e.id.trim() === t.trim());
      r.push({ ...(i ?? { provider: ``, id: t, name: t, available: !1 }), selectionRef: t });
      continue;
    }
    r.push({ provider: t.slice(0, n), id: t.slice(n + 1), name: t, available: !1 });
  }
  return r;
}
function V(e) {
  return e && typeof e == `object` && !Array.isArray(e) ? e : null;
}
function we(e) {
  let t = V(V(e?.models)?.providers),
    n = V(V(e?.agents)?.defaults),
    r = n?.model,
    i = V(r),
    a = typeof r == `string` ? r : typeof i?.primary == `string` ? i.primary : ``,
    o = Array.isArray(i?.fallbacks) ? i.fallbacks.filter((e) => typeof e == `string`) : [];
  return {
    providerIds: Object.keys(t ?? {}),
    apiKeyProviderIds: Object.entries(t ?? {})
      .filter(([, e]) => {
        let t = V(e);
        return t ? Object.hasOwn(t, `apiKey`) && t.apiKey != null : !1;
      })
      .map(([e]) => e),
    providerAuthModes: Object.fromEntries(
      Object.entries(t ?? {}).flatMap(([e, t]) => {
        let n = V(t)?.auth;
        return typeof n == `string` ? [[e, n]] : [];
      }),
    ),
    defaults: {
      primary: a,
      fallbacks: o,
      utilityModel: typeof n?.utilityModel == `string` ? n.utilityModel : null,
    },
  };
}
function Te(e, t) {
  let n = new Set(Array.from(t, I)),
    r = new Map();
  for (let t of e ?? []) {
    let e = I(t.provider);
    t.apiKeySupported === !0 &&
      e &&
      !n.has(e) &&
      !r.has(e) &&
      r.set(e, { id: e, displayName: w(e) });
  }
  return [...r.values()].toSorted((e, t) => e.displayName.localeCompare(t.displayName));
}
var H,
  U = e(() => {
    (M(), F(), C(), (H = [`expired`, `missing`, `expiring`, `ok`, `api-key`]));
  });
function W(e, t) {
  return { models: { providers: { [e]: { apiKey: t } } } };
}
function Ee(e, t, n) {
  return {
    agents: {
      defaults: { model: t.length > 0 ? { primary: e, fallbacks: [...t] } : e, utilityModel: n },
    },
  };
}
var G,
  De = e(() => {
    G = [`agents.defaults.model.fallbacks`];
  }),
  Oe = e(() => {});
function ke(e) {
  let t = new Map(),
    n = new Set();
  for (let r of e) {
    let e = B(r);
    if (n.has(e)) continue;
    n.add(e);
    let i = r.provider || `saved-selection`,
      a = t.get(i) ?? {
        provider: i,
        label: r.provider ? w(r.provider) : g(`modelProviders.defaults.savedSelection`),
        models: [],
      };
    (a.models.push({ ref: e, label: r.name || e }), t.set(i, a));
  }
  let r = [...t.values()];
  for (let e of r) e.models = e.models.toSorted((e, t) => e.label.localeCompare(t.label));
  return r.toSorted((e, t) => e.label.localeCompare(t.label));
}
function K(e, t = ``) {
  return ke(e).map(
    (e) => c`
      <optgroup label=${e.label}>
        ${e.models.map(
          (e) => c`<option value=${e.ref} ?selected=${e.ref === t}>
              ${e.label}
            </option>`,
        )}
      </optgroup>
    `,
  );
}
function Ae(e) {
  let t = !e.canMutate || e.models.length === 0,
    n = !!e.busy.defaults,
    r = e.mutationBlockedReason ?? ``,
    i = c`
    <div class="settings-row settings-row--stacked model-providers__defaults">
      ${e.models.length === 0 ? c`<div class="callout warning">${g(`modelProviders.defaults.noModels`)}</div>` : u}
      <div class="model-providers__default-grid">
        <label class="field">
          <span>${g(`modelProviders.defaults.primary`)}</span>
          <select
            class="settings-select"
            .value=${e.selection.primary}
            ?disabled=${t || n}
            title=${r}
            @change=${(t) => e.onPrimaryChange(t.target.value)}
          >
            <option value="" ?disabled=${!!e.selection.primary}>
              ${g(`modelProviders.defaults.selectModel`)}
            </option>
            ${K(e.models, e.selection.primary)}
          </select>
        </label>
        <label class="field">
          <span>${g(`modelProviders.defaults.utility`)}</span>
          <select
            class="settings-select"
            .value=${e.selection.utilityModel ?? q}
            ?disabled=${t || n}
            title=${r}
            @change=${(t) => {
              let n = t.target.value;
              e.onUtilityChange(n === q ? null : n);
            }}
          >
            <option value=${q}>
              ${g(`modelProviders.defaults.automatic`)}
            </option>
            <option value="">${g(`modelProviders.defaults.disabled`)}</option>
            ${K(e.models, e.selection.utilityModel ?? ``)}
          </select>
        </label>
      </div>
      <div class="model-providers__fallbacks">
        <div class="model-providers__fallback-heading">
          <span>${g(`modelProviders.defaults.fallbacks`)}</span>
          ${n ? c`<span class="muted">${g(`modelProviders.saving`)}</span>` : u}
        </div>
        ${
          e.selection.fallbacks.length === 0
            ? c`<div class="card-sub">${g(`modelProviders.defaults.noFallbacks`)}</div>`
            : e.selection.fallbacks.map(
                (i, a) => c`
                <div class="model-providers__fallback-row">
                  <code>${i}</code>
                  <button
                    class="btn btn--sm"
                    ?disabled=${t || n}
                    title=${r}
                    @click=${() => e.onFallbackRemove(a)}
                  >
                    ${g(`common.remove`)}
                  </button>
                </div>
              `,
              )
        }
        <label class="field model-providers__fallback-add">
          <span>${g(`modelProviders.defaults.addFallback`)}</span>
          <select
            class="settings-select"
            .value=${``}
            ?disabled=${t || n || !e.selection.primary}
            title=${r}
            @change=${(t) => {
              let n = t.target;
              n.value &&= (e.onFallbackAdd(n.value), ``);
            }}
          >
            <option value="">${g(`modelProviders.defaults.selectFallback`)}</option>
            ${K(
              e.models.filter((t) => {
                let n = B(t);
                return n !== e.selection.primary && !e.selection.fallbacks.includes(n);
              }),
            )}
          </select>
        </label>
      </div>
      ${e.message ? c`<div class="callout ${e.message.kind}" role="status">${e.message.text}</div>` : u}
    </div>
  `;
  return x(
    {
      title: g(`modelProviders.defaults.title`),
      description: g(`modelProviders.defaults.subtitle`),
      actions: c`
        <div class="model-providers__form-actions">
          ${e.dirty ? c`<span class="muted">${g(`modelProviders.defaults.unsaved`)}</span>` : u}
          <button class="btn btn--sm" ?disabled=${n || !e.dirty} @click=${e.onReset}>
            ${g(`common.cancel`)}
          </button>
          <button
            class="btn primary btn--sm"
            ?disabled=${t || n || !e.dirty || !e.selection.primary}
            title=${r}
            @click=${e.onSave}
          >
            ${g(n ? `modelProviders.saving` : `common.save`)}
          </button>
        </div>
      `,
    },
    i,
  );
}
var q,
  je = e(() => {
    (l(), C(), S(), _(), U(), (q = `__openclaw_automatic_utility__`));
  });
function Me(e) {
  let t = e.auth;
  if (!t) return u;
  let n = g(Y[t.kind]);
  return c`
    <span title=${(t.expiryLabel ? g(`modelProviders.expiresIn`, { time: t.expiryLabel }) : void 0) ?? n}>
      ${_e({ kind: X[t.kind], label: n })}
    </span>
  `;
}
function Ne(e) {
  return e.modelCount === 0
    ? null
    : e.availableModelCount < e.modelCount
      ? g(`modelProviders.modelsAvailable`, {
          available: String(e.availableModelCount),
          count: String(e.modelCount),
        })
      : e.modelCount === 1
        ? g(`modelProviders.modelOne`)
        : g(`modelProviders.models`, { count: String(e.modelCount) });
}
function Pe(e) {
  if (e >= 1e9) {
    let t = e / 1e9;
    return t < 10 ? `${t.toFixed(1)}B` : `${Math.round(t)}B`;
  }
  return re(e);
}
function Fe(e, t) {
  let n = e.localCost;
  return !n || (n.totalTokens === 0 && n.totalCost === 0)
    ? u
    : c`
    <div class="model-providers__local-cost">
      <div class="provider-usage-billing-row">
        <span>${g(`modelProviders.localCost`, { days: String(t) })}</span>
        <strong>${ne(n.totalCost)}</strong>
      </div>
      <div class="model-providers__local-cost-detail">
        ${g(`modelProviders.localCostDetail`, { tokens: Pe(n.totalTokens), sessions: String(n.sessionCount) })}
      </div>
    </div>
  `;
}
function Ie(e) {
  let t = e.profiles.filter((e) => e.type === `oauth`).length,
    n = e.profiles.filter((e) => e.type === `token`).length,
    r = e.profiles.filter((e) => e.type === `api_key`).length,
    i = [];
  return (
    t > 0 && i.push(g(`modelProviders.credentials.oauth`, { count: String(t) })),
    n > 0 && i.push(g(`modelProviders.credentials.tokenProfiles`, { count: String(n) })),
    e.apiKey?.source === `config` || (!e.apiKey && e.hasConfigApiKey)
      ? i.push(g(`modelProviders.credentials.configKey`))
      : e.apiKey?.source === `env`
        ? i.push(
            e.apiKey.envVar
              ? g(`modelProviders.credentials.envKeyNamed`, { name: e.apiKey.envVar })
              : g(`modelProviders.credentials.envKey`),
          )
        : r > 0 && i.push(g(`modelProviders.credentials.profileKey`, { count: String(r) })),
    c`
    <div class="model-providers__credentials">
      <span>${g(`modelProviders.credentials.label`)}</span>
      <strong
        >${i.length > 0 ? i.join(` · `) : g(`modelProviders.credentials.none`)}</strong
      >
    </div>
  `
  );
}
function Le(e) {
  return e
    ? c`
    <div
      class="model-providers__probe model-providers__probe--${e.status === `ok` ? `success` : `error`}"
      role="status"
    >
      <div class="model-providers__probe-summary">
        <strong>${g(`modelProviders.probe.status.${e.status}`)}</strong>
        ${
          e.latencyMs === void 0
            ? u
            : c`<span
              >${g(`modelProviders.probe.latency`, { ms: String(e.latencyMs) })}</span
            >`
        }
      </div>
      ${e.error ? c`<div>${e.error}</div>` : u}
      ${e.results.map(
        (e) => c`
          <div class="model-providers__probe-target">
            <span>${e.label}</span>
            <span>
              ${g(`modelProviders.probe.status.${e.status}`)}${e.latencyMs === void 0 ? `` : ` · ${g(`modelProviders.probe.latency`, { ms: String(e.latencyMs) })}`}
            </span>
            ${e.error ? c`<small>${e.error}</small>` : u}
          </div>
        `,
      )}
    </div>
  `
    : u;
}
function Re(e, t) {
  if (t.keyEditorProvider !== e.id) return u;
  let n = !!t.busy[`key:${e.id}`],
    r = e.apiKeySupported === !1 || !!(e.configAuthMode && e.configAuthMode !== `api-key`);
  return c`
    <div class="model-providers__inline-form">
      <label class="field">
        <span>${g(`modelProviders.apiKey.label`)}</span>
        <input
          type="password"
          autocomplete="off"
          placeholder=${e.apiKey?.source === `config` ? g(`modelProviders.apiKey.replacePlaceholder`) : g(`modelProviders.apiKey.placeholder`)}
          .value=${t.keyDraft}
          ?disabled=${n || !t.canMutate || r}
          @input=${(e) => t.onKeyDraftChange(e.target.value)}
        />
      </label>
      <div class="model-providers__form-actions">
        <button
          class="btn primary btn--sm"
          ?disabled=${n || !t.canMutate || r || !t.keyDraft.trim()}
          @click=${() => t.onSaveKey(e.id, e.configKey ?? e.id)}
        >
          ${g(n ? `modelProviders.saving` : `common.save`)}
        </button>
        <button class="btn btn--sm" ?disabled=${n} @click=${() => t.onCloseKeyEditor()}>
          ${g(`common.cancel`)}
        </button>
      </div>
    </div>
  `;
}
function ze(e, t) {
  let n = e.credentialProviderIds.length ? e.credentialProviderIds : [e.id],
    r = e.hasConfigApiKey || !!e.apiKey || e.profiles.length > 0,
    i = e.logoutTargets.length > 0,
    a = !!t.busy[`probe:${e.id}`],
    o = !!t.busy[`key:${e.id}`],
    s = !!t.busy[`logout:${e.id}`],
    l = t.mutationBlockedReason ?? ``,
    d = !!(e.configAuthMode && e.configAuthMode !== `api-key`),
    f = e.apiKeySupported === !1,
    p = d ? g(`modelProviders.apiKey.authModeBlocked`, { mode: e.configAuthMode ?? `` }) : l;
  return c`
    <div class="model-providers__card-actions">
      ${
        r
          ? c`
            <button
              class="btn btn--sm"
              ?disabled=${a || !t.canMutate || !t.probeAvailable}
              title=${t.probeAvailable ? l : g(`modelProviders.probe.unavailable`)}
              @click=${() => t.onProbe(e.id, n)}
            >
              ${g(a ? `modelProviders.probe.testing` : `modelProviders.probe.test`)}
            </button>
          `
          : u
      }
      ${
        f
          ? u
          : c`
            <button
              class="btn btn--sm"
              ?disabled=${o || !t.canMutate || d}
              title=${p}
              @click=${() => t.onOpenKeyEditor(e.id)}
            >
              ${e.hasConfigApiKey ? g(`modelProviders.apiKey.replace`) : g(`modelProviders.apiKey.set`)}
            </button>
          `
      }
      ${
        e.hasConfigApiKey
          ? c`
            <button
              class="btn btn--sm danger"
              ?disabled=${o || !t.canMutate || d}
              title=${p}
              @click=${() => t.onRemoveKey(e.id, e.configKey ?? e.id)}
            >
              ${g(`modelProviders.apiKey.remove`)}
            </button>
          `
          : u
      }
      ${
        i
          ? c`
            <button
              class="btn btn--sm"
              ?disabled=${s || !t.canMutate}
              title=${l}
              @click=${() => t.onRequestLogout(e.id)}
            >
              ${g(`modelProviders.logout.action`)}
            </button>
          `
          : u
      }
    </div>
    ${
      t.pendingLogoutProvider === e.id
        ? c`
          <div class="model-providers__confirm" role="alert">
            <span>${g(`modelProviders.logout.confirm`, { provider: e.displayName })}</span>
            <div class="model-providers__form-actions">
              <button
                class="btn danger btn--sm"
                ?disabled=${s}
                @click=${() => t.onLogout(e.id, e.logoutTargets)}
              >
                ${g(s ? `modelProviders.logout.loggingOut` : `modelProviders.logout.action`)}
              </button>
              <button class="btn btn--sm" ?disabled=${s} @click=${t.onCancelLogout}>
                ${g(`common.cancel`)}
              </button>
            </div>
          </div>
        `
        : u
    }
  `;
}
function J(e, t) {
  let n = Ne(e),
    r = t.messages[`key:${e.id}`] ?? t.messages[e.id];
  return c`
    <div
      class="settings-row settings-row--stacked model-providers__row"
      data-provider-id=${e.id}
    >
      <div class="model-providers__head">
        <div class="model-providers__identity">
          ${ve(e.id, { className: `model-providers__icon` })}
          <div class="settings-row__text">
            <span class="settings-row__title">${e.displayName}</span>
            <span class="settings-row__desc"
              >${e.id}${n ? c` · ${n}` : u}</span
            >
          </div>
        </div>
        <div class="settings-row__control">
          ${e.usage?.plan ? ge(e.usage.plan) : u}
          ${Me(e)}
        </div>
      </div>
      ${Ie(e)}
      ${e.usage ? k(e.usage) : c`<div class="model-providers__no-stats">${g(`modelProviders.noStats`)}</div>`}
      ${Fe(e, t.costDays)} ${ze(e, t)}
      ${Re(e, t)} ${Le(t.probeResults[e.id])}
      ${r ? c`<div class="callout ${r.kind}" role="status">${r.text}</div>` : u}
    </div>
  `;
}
function Be(e) {
  let t = c`
    ${e.unconfiguredProviders.length === 0 ? y(g(`modelProviders.add.none`)) : u}
    ${
      e.addProviderOpen
        ? c`
          <div class="settings-row settings-row--stacked">
            <div class="model-providers__add-form">
              <label class="field">
                <span>${g(`modelProviders.add.provider`)}</span>
                <select
                  class="settings-select"
                  .value=${e.addProviderId}
                  @change=${(t) => e.onAddProviderIdChange(t.target.value)}
                >
                  <option value="">${g(`modelProviders.add.selectProvider`)}</option>
                  ${e.unconfiguredProviders.map((e) => c`<option value=${e.id}>${e.displayName}</option>`)}
                </select>
              </label>
              <label class="field">
                <span>${g(`modelProviders.apiKey.label`)}</span>
                <input
                  type="password"
                  autocomplete="off"
                  placeholder=${g(`modelProviders.apiKey.placeholder`)}
                  .value=${e.addProviderKey}
                  @input=${(t) => e.onAddProviderKeyChange(t.target.value)}
                />
              </label>
              <button
                class="btn primary"
                ?disabled=${!!e.busy.add || !e.addProviderId || !e.addProviderKey.trim()}
                @click=${e.onAddProvider}
              >
                ${e.busy.add ? g(`modelProviders.saving`) : g(`modelProviders.add.save`)}
              </button>
            </div>
            ${
              e.messages.add
                ? c`<div class="callout ${e.messages.add.kind}" role="status">
                  ${e.messages.add.text}
                </div>`
                : u
            }
          </div>
        `
        : u
    }
  `;
  return x(
    {
      title: g(`modelProviders.add.title`),
      description: g(`modelProviders.add.subtitle`),
      actions: c`
        <button
          class="btn btn--sm"
          ?disabled=${!e.canMutate || e.unconfiguredProviders.length === 0}
          title=${e.mutationBlockedReason ?? ``}
          @click=${e.onAddProviderToggle}
        >
          ${e.addProviderOpen ? g(`common.cancel`) : g(`modelProviders.add.action`)}
        </button>
      `,
    },
    t,
  );
}
function Ve(e) {
  if (!e.connected) return v(b(y(g(`modelProviders.disconnected`))));
  if (e.loading)
    return v(c`<div aria-busy="true">
        ${b(y(g(`common.loading`)))}
      </div>`);
  let t = c`
    ${
      e.error
        ? c`
          <div class="settings-row">
            <div class="settings-row__text">
              <span class="settings-row__desc provider-usage-error">${e.error}</span>
            </div>
          </div>
        `
        : u
    }
    ${e.cards.length === 0 ? y(c`<strong>${g(`modelProviders.emptyTitle`)}</strong><br />${g(`modelProviders.emptySubtitle`)}`) : e.cards.map((t) => J(t, e))}
  `;
  return v(c`
    ${Ae({ models: e.configuredModels, selection: e.defaultModels, dirty: e.defaultModelsDirty, canMutate: e.canMutate, mutationBlockedReason: e.mutationBlockedReason, busy: e.busy, message: e.messages.defaults, onPrimaryChange: e.onPrimaryChange, onFallbackAdd: e.onFallbackAdd, onFallbackRemove: e.onFallbackRemove, onUtilityChange: e.onUtilityChange, onSave: e.onDefaultModelsSave, onReset: e.onDefaultModelsReset })}
    ${x(
      {
        title: g(`modelProviders.title`),
        description: e.updatedAt
          ? g(`modelProviders.updated`, { time: ie(e.updatedAt) })
          : g(`modelProviders.subtitle`),
        count: e.cards.length,
        actions: c`
          <button
            class="btn btn--sm"
            ?disabled=${e.refreshing}
            @click=${() => e.onRefresh()}
          >
            ${e.refreshing ? g(`modelProviders.refreshing`) : g(`common.refresh`)}
          </button>
        `,
      },
      t,
    )}
    ${Be(e)}
    ${e.mutationBlockedReason ? c`<div class="callout warning">${e.mutationBlockedReason}</div>` : u}
  `);
}
var Y,
  X,
  He = e(() => {
    (l(),
      C(),
      O(),
      S(),
      _(),
      se(),
      Oe(),
      A(),
      je(),
      (Y = {
        ok: `modelProviders.status.ok`,
        expiring: `modelProviders.status.expiring`,
        expired: `modelProviders.status.expired`,
        missing: `modelProviders.status.missing`,
        "api-key": `modelProviders.status.apiKey`,
      }),
      (X = {
        ok: `ok`,
        expiring: `warn`,
        expired: `danger`,
        missing: `danger`,
        "api-key": `muted`,
      }));
  });
function Z(e) {
  return e instanceof Error && e.message.trim()
    ? e.message
    : typeof e == `string` && e.trim()
      ? e
      : g(`modelProviders.requestFailed`);
}
function Ue(e) {
  return /method (?:not found|not supported)|unknown method/iu.test(Z(e));
}
function We(e, t) {
  if (t.length === 1) return t[0];
  let n = t.some((e) => e.status === `ok`)
      ? `ok`
      : (Q.find((e) => t.some((t) => t.status === e)) ?? `unknown`),
    r = t.find((e) => e.status === n)?.error;
  return {
    provider: e,
    status: n,
    ...(r ? { error: r } : {}),
    results: t.flatMap((e) => e.results.map((t) => ({ ...t, label: `${e.provider}: ${t.label}` }))),
  };
}
var Q, $;
e(() => {
  (r(),
    l(),
    a(),
    fe(),
    pe(),
    ue(),
    he(),
    _(),
    ee(),
    ae(),
    ce(),
    U(),
    D(),
    De(),
    He(),
    t(),
    (Q = [`auth`, `billing`, `rate_limit`, `timeout`, `format`, `no_model`, `unknown`]),
    ($ = class extends m {
      constructor(...e) {
        (super(...e),
          (this.data = null),
          (this.refreshing = !1),
          (this.busy = {}),
          (this.messages = {}),
          (this.probeResults = {}),
          (this.probeUnsupported = !1),
          (this.keyEditorProvider = null),
          (this.keyDraft = ``),
          (this.pendingLogoutProvider = null),
          (this.addProviderOpen = !1),
          (this.addProviderId = ``),
          (this.addProviderKey = ``),
          (this.defaultsDraft = null),
          (this.dataClient = null),
          (this.observedClient = null),
          (this.clientEpoch = 0),
          (this.refreshEpoch = 0),
          (this.refreshQueue = Promise.resolve()),
          (this.probeEpochs = new Map()),
          (this.subscriptions = new oe(this).watch(
            () => this.context?.gateway,
            (e, t) => e.subscribe(t),
          )));
      }
      disconnectedCallback() {
        ((this.refreshEpoch += 1), this.subscriptions.clear(), super.disconnectedCallback());
      }
      willUpdate(e) {
        e.has(`routeData`) &&
          this.routeData &&
          ((this.data = this.routeData.data), (this.dataClient = this.routeData.client));
      }
      updated() {
        let e = this.context.gateway.snapshot;
        (e.client !== this.observedClient && this.resetClientState(e.client),
          !(!e.connected || !e.client || this.refreshing) &&
            (this.data === null || this.data.updatedAt === null || e.client !== this.dataClient) &&
            this.refresh({ force: !1 }));
      }
      resetClientState(e) {
        ((this.observedClient = e),
          (this.clientEpoch += 1),
          (this.refreshEpoch += 1),
          (this.refreshing = !1),
          (this.busy = {}),
          (this.messages = {}),
          (this.probeResults = {}),
          (this.probeEpochs = new Map()),
          (this.probeUnsupported = !1),
          (this.keyEditorProvider = null),
          (this.keyDraft = ``),
          (this.pendingLogoutProvider = null),
          (this.addProviderOpen = !1),
          (this.addProviderId = ``),
          (this.addProviderKey = ``),
          (this.defaultsDraft = null),
          e !== this.dataClient && (this.data = null));
      }
      isCurrentClient(e, t) {
        return (
          this.clientEpoch === t &&
          this.observedClient === e &&
          this.context.gateway.snapshot.client === e
        );
      }
      refresh(e) {
        let t = this.refreshQueue.then(() => this.performRefresh(e));
        return ((this.refreshQueue = t.catch(() => void 0)), t);
      }
      async performRefresh(e) {
        let t = this.context.gateway.snapshot.client;
        if (!t) return;
        let n = ++this.refreshEpoch;
        this.refreshing = !0;
        try {
          let r = await E(t, e.force ? { refresh: !0 } : void 0);
          n === this.refreshEpoch &&
            this.context.gateway.snapshot.client === t &&
            ((this.data = r), (this.dataClient = t));
        } finally {
          n === this.refreshEpoch &&
            this.context.gateway.snapshot.client === t &&
            (this.refreshing = !1);
        }
      }
      mutationBlockedReason() {
        let e = this.context.gateway.snapshot;
        return e.connected
          ? le(e.hello?.auth ?? null)
            ? !e.client || !this.data?.config
              ? g(`modelProviders.configUnavailable`)
              : null
            : g(`modelProviders.readOnly.adminRequired`)
          : g(`modelProviders.readOnly.disconnected`);
      }
      canMutate() {
        return this.mutationBlockedReason() === null;
      }
      setBusy(e, t) {
        let n = { ...this.busy };
        (t ? (n[e] = !0) : delete n[e], (this.busy = n));
      }
      setMessage(e, t) {
        let n = { ...this.messages };
        (t ? (n[e] = t) : delete n[e], (this.messages = n));
      }
      clearProbe(e) {
        (this.probeEpochs.set(e, (this.probeEpochs.get(e) ?? 0) + 1),
          this.setBusy(`probe:${e}`, !1));
        let t = { ...this.probeResults };
        (delete t[e], (this.probeResults = t));
      }
      async patchConfig(e) {
        if (!this.canMutate() || this.busy[e.key]) return !1;
        let t = this.context.gateway.snapshot.client;
        if (!t) return !1;
        let n = this.clientEpoch,
          r = this.context.runtimeConfig;
        (this.setBusy(e.key, !0), this.setMessage(e.key, null));
        try {
          if ((await r.ensureLoaded(), !this.isCurrentClient(t, n))) return !1;
          let i = await r.patch({
            raw: e.raw,
            note: e.note,
            ...(e.replacePaths ? { replacePaths: e.replacePaths } : {}),
          });
          return this.isCurrentClient(t, n)
            ? i
              ? (await r.refresh(),
                !this.isCurrentClient(t, n) ||
                (await this.refresh({ force: !0 }), !this.isCurrentClient(t, n))
                  ? !1
                  : (this.setMessage(e.key, { kind: `success`, text: e.success }), !0))
              : (this.setMessage(e.key, {
                  kind: `error`,
                  text: r.state.lastError ?? g(`modelProviders.configUnavailable`),
                }),
                !1)
            : !1;
        } catch (r) {
          return (
            this.isCurrentClient(t, n) && this.setMessage(e.key, { kind: `error`, text: Z(r) }), !1
          );
        } finally {
          this.isCurrentClient(t, n) && this.setBusy(e.key, !1);
        }
      }
      openKeyEditor(e) {
        ((this.keyEditorProvider = e), (this.keyDraft = ``), this.setMessage(e, null));
      }
      closeKeyEditor() {
        ((this.keyEditorProvider = null), (this.keyDraft = ``));
      }
      async saveKey(e, t) {
        let n = this.keyDraft.trim();
        n &&
          (this.clearProbe(e),
          this.setMessage(e, null),
          this.setMessage(`key:${e}`, null),
          (await this.patchConfig({
            key: `key:${e}`,
            raw: W(t, n),
            note: g(`modelProviders.notes.saveKey`, { provider: e }),
            success: g(`modelProviders.apiKey.saved`),
          })) &&
            (this.setMessage(`key:${e}`, null),
            this.closeKeyEditor(),
            this.setMessage(e, { kind: `success`, text: g(`modelProviders.apiKey.saved`) })));
      }
      async removeKey(e, t) {
        (this.clearProbe(e),
          this.setMessage(e, null),
          this.setMessage(`key:${e}`, null),
          (await this.patchConfig({
            key: `key:${e}`,
            raw: W(t, null),
            note: g(`modelProviders.notes.removeKey`, { provider: e }),
            success: g(`modelProviders.apiKey.removed`),
          })) &&
            (this.setMessage(`key:${e}`, null),
            this.closeKeyEditor(),
            this.setMessage(e, { kind: `success`, text: g(`modelProviders.apiKey.removed`) })));
      }
      async probe(e, t) {
        let n = this.context.gateway.snapshot.client,
          r = `probe:${e}`;
        if (!n || !this.canMutate() || this.busy[r] || this.probeUnsupported) return;
        let i = this.clientEpoch,
          a = (this.probeEpochs.get(e) ?? 0) + 1;
        (this.probeEpochs.set(e, a), this.setBusy(r, !0), this.setMessage(e, null));
        try {
          let r = [];
          for (let e of t) r.push(await n.request(`models.probe`, { provider: e }));
          this.isCurrentClient(n, i) &&
            this.probeEpochs.get(e) === a &&
            (this.probeResults = { ...this.probeResults, [e]: We(e, r) });
        } catch (t) {
          if (!this.isCurrentClient(n, i) || this.probeEpochs.get(e) !== a) return;
          Ue(t)
            ? ((this.probeUnsupported = !0),
              this.setMessage(e, { kind: `error`, text: g(`modelProviders.probe.unavailable`) }))
            : this.setMessage(e, { kind: `error`, text: Z(t) });
        } finally {
          this.isCurrentClient(n, i) && this.probeEpochs.get(e) === a && this.setBusy(r, !1);
        }
      }
      async logout(e, t) {
        let n = this.context.gateway.snapshot.client,
          r = `logout:${e}`;
        if (!n || !this.canMutate() || this.busy[r]) return;
        let i = this.clientEpoch;
        (this.clearProbe(e), this.setBusy(r, !0), this.setMessage(e, null));
        try {
          let r;
          for (let e of t)
            try {
              await n.request(`models.authLogout`, e);
            } catch (e) {
              r ??= e;
            }
          if (
            !this.isCurrentClient(n, i) ||
            (await this.refresh({ force: !0 }), !this.isCurrentClient(n, i))
          )
            return;
          if (r) {
            this.setMessage(e, { kind: `error`, text: Z(r) });
            return;
          }
          ((this.pendingLogoutProvider = null),
            this.setMessage(e, { kind: `success`, text: g(`modelProviders.logout.done`) }));
        } catch (t) {
          this.isCurrentClient(n, i) && this.setMessage(e, { kind: `error`, text: Z(t) });
        } finally {
          this.isCurrentClient(n, i) && this.setBusy(r, !1);
        }
      }
      async addProvider() {
        let e = this.addProviderId,
          t = this.addProviderKey.trim();
        !e ||
          !t ||
          ((await this.patchConfig({
            key: `add`,
            raw: W(e, t),
            note: g(`modelProviders.notes.addProvider`, { provider: e }),
            success: g(`modelProviders.add.saved`, { provider: e }),
          })) &&
            ((this.addProviderOpen = !1),
            (this.addProviderId = ``),
            (this.addProviderKey = ``),
            this.setMessage(e, {
              kind: `success`,
              text: g(`modelProviders.add.saved`, { provider: e }),
            })));
      }
      async saveDefaultModels() {
        let e = this.defaultsDraft;
        e?.primary &&
          (await this.patchConfig({
            key: `defaults`,
            raw: Ee(e.primary, e.fallbacks, e.utilityModel),
            note: g(`modelProviders.notes.defaultModel`),
            success: g(`modelProviders.defaults.saved`),
            replacePaths: G,
          })) &&
          (this.defaultsDraft = null);
      }
      render() {
        let e = this.context.gateway.snapshot,
          t = this.data ?? T,
          n = we(t.config),
          r = this.defaultsDraft ?? n.defaults,
          i = Se({
            ...t,
            configProviderIds: n.providerIds,
            configApiKeyProviderIds: n.apiKeyProviderIds,
            configProviderAuthModes: n.providerAuthModes,
          }),
          a = new Set([
            ...n.providerIds,
            ...(t.authStatus?.providers
              .filter((e) => !!e.apiKey || e.profiles.length > 0)
              .map((e) => e.provider) ?? []),
          ]),
          o = te(e, `models.probe`),
          s = this.mutationBlockedReason(),
          l = Ve({
            connected: e.connected,
            loading: e.connected && this.data === null,
            refreshing: this.refreshing,
            error: t.error,
            updatedAt: t.updatedAt,
            costDays: 30,
            cards: i,
            configuredModels: Ce(t.models, r),
            defaultModels: r,
            defaultModelsDirty: this.defaultsDraft !== null,
            unconfiguredProviders: Te(t.catalogModels, a),
            canMutate: this.canMutate(),
            mutationBlockedReason: s,
            probeAvailable: !this.probeUnsupported && o !== !1,
            busy: this.busy,
            messages: this.messages,
            probeResults: this.probeResults,
            keyEditorProvider: this.keyEditorProvider,
            keyDraft: this.keyDraft,
            pendingLogoutProvider: this.pendingLogoutProvider,
            addProviderOpen: this.addProviderOpen,
            addProviderId: this.addProviderId,
            addProviderKey: this.addProviderKey,
            onRefresh: () => void this.refresh({ force: !0 }),
            onOpenKeyEditor: (e) => this.openKeyEditor(e),
            onCloseKeyEditor: () => this.closeKeyEditor(),
            onKeyDraftChange: (e) => (this.keyDraft = e),
            onSaveKey: (e, t) => void this.saveKey(e, t),
            onRemoveKey: (e, t) => void this.removeKey(e, t),
            onProbe: (e, t) => void this.probe(e, t),
            onRequestLogout: (e) => (this.pendingLogoutProvider = e),
            onCancelLogout: () => (this.pendingLogoutProvider = null),
            onLogout: (e, t) => void this.logout(e, t),
            onAddProviderToggle: () => {
              ((this.addProviderOpen = !this.addProviderOpen),
                (this.addProviderKey = ``),
                this.setMessage(`add`, null));
            },
            onAddProviderIdChange: (e) => (this.addProviderId = e),
            onAddProviderKeyChange: (e) => (this.addProviderKey = e),
            onAddProvider: () => void this.addProvider(),
            onPrimaryChange: (e) => {
              ((this.defaultsDraft = {
                ...r,
                primary: e,
                fallbacks: r.fallbacks.filter((t) => t !== e),
              }),
                this.setMessage(`defaults`, null));
            },
            onFallbackAdd: (e) => {
              ((this.defaultsDraft = { ...r, fallbacks: [...r.fallbacks, e] }),
                this.setMessage(`defaults`, null));
            },
            onFallbackRemove: (e) => {
              ((this.defaultsDraft = { ...r, fallbacks: r.fallbacks.filter((t, n) => n !== e) }),
                this.setMessage(`defaults`, null));
            },
            onUtilityChange: (e) => {
              ((this.defaultsDraft = { ...r, utilityModel: e }), this.setMessage(`defaults`, null));
            },
            onDefaultModelsSave: () => void this.saveDefaultModels(),
            onDefaultModelsReset: () => {
              ((this.defaultsDraft = null), this.setMessage(`defaults`, null));
            },
          });
        return c`
      <section class="content-header">
        <div>
          <div class="page-title">${de(`model-providers`)}</div>
        </div>
      </section>
      ${me(l)}
    `;
      }
    }),
    n([i({ context: h, subscribe: !0 })], $.prototype, `context`, void 0),
    n([s({ attribute: !1 })], $.prototype, `routeData`, void 0),
    n([o()], $.prototype, `data`, void 0),
    n([o()], $.prototype, `refreshing`, void 0),
    n([o()], $.prototype, `busy`, void 0),
    n([o()], $.prototype, `messages`, void 0),
    n([o()], $.prototype, `probeResults`, void 0),
    n([o()], $.prototype, `probeUnsupported`, void 0),
    n([o()], $.prototype, `keyEditorProvider`, void 0),
    n([o()], $.prototype, `keyDraft`, void 0),
    n([o()], $.prototype, `pendingLogoutProvider`, void 0),
    n([o()], $.prototype, `addProviderOpen`, void 0),
    n([o()], $.prototype, `addProviderId`, void 0),
    n([o()], $.prototype, `addProviderKey`, void 0),
    n([o()], $.prototype, `defaultsDraft`, void 0),
    customElements.define(`openclaw-model-providers-page`, $));
})();
//# sourceMappingURL=model-providers-page-e6yachaZ.js.map
