import { a as ht, n as gt, t as _t } from "./config-form-B_wZl7UD.js";
import { A as Be, j as Ve } from "./config-runtime-BxOat2Bj.js";
import {
  B as ge,
  C as _e,
  D as ve,
  E as A,
  J as ye,
  K as be,
  M as xe,
  O as Se,
  P as Ce,
  R as we,
  S as Te,
  T as Ee,
  X as De,
  _ as Oe,
  b as ke,
  c as Ae,
  f as j,
  ft as je,
  g as M,
  l as Me,
  m as Ne,
  o as Pe,
  p as Fe,
  pt as Ie,
  q as Le,
  s as Re,
  x as ze,
} from "./control-ui-core--EZfp09c.js";
import {
  Ar as T,
  Hi as E,
  Ui as D,
  Wa as oe,
  ai as O,
  da as se,
  di as ce,
  ea as k,
  fi as le,
  jr as ue,
  la as de,
  li as fe,
  ni as pe,
  oi as me,
  ui as he,
} from "./control-ui-core-BcbHa4vB.js";
import {
  C as i,
  D as a,
  E as o,
  O as s,
  S as c,
  St as l,
  T as u,
  b as d,
  k as f,
  w as p,
  x as m,
  xt as h,
  y as g,
} from "./control-ui-core-CFS5NQSC.js";
import {
  $ as Ge,
  I as Ke,
  J as qe,
  L as Je,
  M as Ye,
  P as Xe,
  Q as F,
  R as Ze,
  j as I,
  z as Qe,
} from "./control-ui-core-CQDTaMS5.js";
import { i as He, l as Ue, o as N, s as We, t as P } from "./control-ui-core-CwQmiouz.js";
import { dt as ee, ft as te } from "./control-ui-foundation-0uuDj0X3.js";
import { _ as t, g as n, m as r } from "./control-ui-foundation-CCDffryi.js";
import {
  F as S,
  I as re,
  P as ie,
  at as ae,
  nt as C,
  tt as w,
} from "./control-ui-foundation-s2wA1PVE.js";
import {
  a as $e,
  c as et,
  l as tt,
  n as nt,
  s as rt,
  t as it,
  u as at,
} from "./control-ui-shared-CrnVqnQR.js";
import { a as bt, i as xt } from "./fast-mode-Ce32fhza.js";
import { G as ne, Y as _, Z as v, at as y, et as b, nt as x } from "./lit-runtime-DkvDG939.js";
import { n as vt, t as yt } from "./realtime-talk-input-D36gjeMT.js";
import { n as St, t as Ct } from "./redact-sensitive-url-DaWVLiYm.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
import {
  a as lt,
  c as L,
  d as ut,
  f as R,
  i as dt,
  l as z,
  n as ft,
  o as B,
  r as pt,
  s as mt,
  t as V,
} from "./settings-ui-T0X7dZpU.js";
import { n as st, t as ct } from "./settings-workspace-DRQpceJK.js";
import { t as wt } from "./web-awesome-select-Bk_xnNvy.js";
import { t as ot } from "./web-awesome-tabs-B3ooykzD.js";
function Tt(e) {
  return C(C(e.mcp)?.servers) ?? {};
}
function Et(e, t) {
  let n = C(t) ?? {},
    r = typeof n.url == `string` ? n.url : ``,
    i = typeof n.command == `string` ? n.command : ``,
    a = r ? `http` : i ? `stdio` : `invalid`,
    o = typeof n.auth == `string` ? n.auth : null,
    s = r || i || N(`mcpPage.missingTransport`),
    c =
      n.sslVerify === !1
        ? N(`mcpPage.tlsVerifyOff`)
        : n.clientCert || n.clientKey
          ? N(`mcpPage.mtls`)
          : null;
  return {
    name: e,
    enabled: n.enabled !== !1,
    transport: a,
    auth: o,
    launch: r ? St(s) : s,
    toolFilter: !!n.toolFilter,
    parallel: n.supportsParallelToolCalls === !0,
    tls: c,
  };
}
function Dt(e) {
  return /^[A-Za-z0-9._:/-]+$/.test(e) ? e : `'${e.replaceAll(`'`, `'\\''`)}'`;
}
function Ot(e) {
  let t = Dt(e.name),
    n = `openclaw mcp probe ${t}`,
    r = `openclaw mcp login ${t}`,
    i = [
      e.transport,
      e.auth,
      e.toolFilter ? N(`mcpPage.toolFilter`) : null,
      e.parallel ? N(`mcpPage.parallel`) : null,
      e.tls,
    ].filter((e) => !!e);
  return y`
    <div class="settings-row mcp-server-row">
      <div class="settings-row__text">
        <span class="settings-row__title">${e.name}</span>
        <span class="settings-row__desc mcp-server-row__launch">${e.launch}</span>
        <span class="settings-row__desc">${i.join(` · `)}</span>
      </div>
      <div class="settings-row__control">
        ${z({ kind: e.enabled ? `ok` : `muted`, label: e.enabled ? N(`common.enabled`) : N(`common.disabled`) })}
        <code>${e.auth === `oauth` ? r : n}</code>
      </div>
    </div>
  `;
}
function kt(e) {
  let t = Object.entries(Tt(e.configObject))
      .map(([e, t]) => Et(e, t))
      .toSorted((e, t) => e.name.localeCompare(t.name)),
    n = t.filter((e) => e.enabled).length,
    r = t.filter((e) => e.auth === `oauth`).length,
    i = t.filter((e) => e.toolFilter).length,
    a = !e.configDirty || !e.connected || e.configApplying || e.configSaving;
  return y`
    <section class="mcp-page">
      <div class="settings-page">
        <section class="settings-section mcp-page__summary">
          <div class="settings-section__header">
            <h2 class="settings-section__heading">${N(`mcpPage.servers`)}</h2>
          </div>
          <div class="settings-group">
            ${B({ title: N(`mcpPage.servers`), control: R(t.length) })}
            ${B({ title: N(`common.enabled`), control: R(n) })}
            ${B({ title: N(`mcpPage.oauth`), control: R(r) })}
            ${B({ title: N(`mcpPage.filtered`), control: R(i) })}
          </div>
        </section>

        <section class="settings-section">
          <div class="settings-section__header">
            <h2 class="settings-section__heading">${N(`mcpPage.operatorCommands`)}</h2>
          </div>
          <p class="settings-section__desc">${N(`mcpPage.operatorCommandsHint`)}</p>
          <div class="settings-group">
            <div class="settings-row settings-row--stacked">
              <div class="mcp-command-card__grid">
                <code>openclaw mcp status --verbose</code>
                <code>openclaw mcp doctor --probe</code>
                <code>openclaw mcp login &lt;name&gt;</code>
                <code>openclaw mcp reload</code>
              </div>
            </div>
          </div>
        </section>

        <section class="settings-section mcp-server-list">
          <div class="settings-section__header">
            <h2 class="settings-section__heading">${N(`mcpPage.configuredServers`)}</h2>
            <div class="settings-section__actions">
              <button class="btn btn--sm" ?disabled=${a} @click=${e.onSaveConfig}>
                ${N(`common.save`)}
              </button>
              <button
                class="btn btn--sm primary"
                ?disabled=${!e.configDirty || !e.connected || e.configApplying || e.configSaving}
                @click=${e.onApplyConfig}
              >
                ${e.configApplying ? N(`mcpPage.publishing`) : N(`common.saveAndPublish`)}
              </button>
            </div>
          </div>
          <p class="settings-section__desc">
            ${N(`mcpPage.runtimeHint`)}
            <a href=${e.pluginsHref}>${N(`mcpPage.manageServersLink`)}</a>
          </p>
          <div class="settings-group">
            ${t.length ? t.map((e) => Ot(e)) : ft(N(`mcpPage.noServers`))}
          </div>
        </section>
      </div>

      ${e.editor}
    </section>
  `;
}
var At = e(() => {
  (Ct(), ae(), b(), V(), P());
});
function jt(e, t) {
  return y`
    <wa-select
      class="settings-select"
      value=${e}
      @change=${(e) => t(e.currentTarget.value)}
    >
      <span slot="label" class="settings-control__sr-label">${N(`quickSettings.language`)}</span>
      ${We.map((t) => {
        let n = N(`languages.${t.replace(/-([a-zA-Z])/g, (e, t) => t.toUpperCase())}`);
        return y`
          <wa-option value=${t} .label=${n} .selected=${t === e}>
            ${n}
          </wa-option>
        `;
      })}
    </wa-select>
  `;
}
var Mt = e(() => {
  (b(), wt(), P());
});
function H(e, t, n) {
  return y`<div id=${e}>${mt(t, n)}</div>`;
}
function Nt() {
  return y`
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 1 0-16 0" />
    </svg>
  `;
}
function Pt(e) {
  let t = ze({ name: null, avatar: e }),
    n = _e(t),
    r = Te(t),
    i = N(`quickSettings.personal.you`);
  return n
    ? y`<img class="config-identity__avatar" src=${n} alt=${i} />`
    : r
      ? y`<div
      class="config-identity__avatar config-identity__avatar--text"
      aria-label=${i}
    >
      ${r}
    </div>`
      : y`
    <div class="config-identity__avatar config-identity__avatar--default" aria-label=${i}>
      ${Nt()}
    </div>
  `;
}
function Ft(e) {
  let t = w(e.assistantAvatarOverride);
  return t
    ? me(t, { identity: { avatar: t, avatarUrl: t } })
    : e.assistantAvatarStatus === `none` && e.assistantAvatarReason === `missing`
      ? null
      : me(e.assistantAvatarUrl, {
          identity: {
            avatar: e.assistantAvatar ?? void 0,
            avatarUrl: e.assistantAvatarUrl ?? void 0,
          },
        });
}
function It(e) {
  let t = w(e);
  if (!t) return null;
  if (/^data:image\//i.test(t)) {
    let e = t.indexOf(`,`);
    return `${S(t, 0, e > 0 ? e : 32)},...`;
  }
  return t.length > 72 ? `${S(t, 0, 34)}...${S(t, -24)}` : t;
}
function Lt(e, t, n, r = !1) {
  return r
    ? null
    : e === `remote`
      ? N(`quickSettings.personal.avatarIssues.remoteBlocked`)
      : t === `missing`
        ? N(`quickSettings.personal.avatarIssues.missing`)
        : t === `unsupported_extension`
          ? N(`quickSettings.personal.avatarIssues.unsupported`)
          : t === `outside_workspace`
            ? N(`quickSettings.personal.avatarIssues.outsideWorkspace`)
            : t === `too_large`
              ? N(`quickSettings.personal.avatarIssues.tooLarge`)
              : t
                ? N(`quickSettings.personal.avatarIssues.cannotRender`)
                : null;
}
function Rt(e) {
  let t = w(e.assistantName) ?? N(`quickSettings.personal.assistant`),
    n = w(e.assistantAvatarOverride),
    r = Ft(e);
  if (r)
    return y`<img
      class="config-identity__avatar"
      src=${r}
      alt=${t}
    />`;
  let i = O(n ?? e.assistantAvatar);
  return i
    ? y`<div
      class="config-identity__avatar config-identity__avatar--text"
      aria-label=${t}
    >
      ${i}
    </div>`
    : y`
    <img
      class="config-identity__avatar config-identity__avatar--fallback"
      src=${we(`apple-touch-icon.png`, e.basePath ?? ``)}
      alt=${t}
    />
  `;
}
function zt(e, t) {
  let n = e.target,
    r = n.files?.[0],
    i = t.onUserAvatarChange;
  if (!r || !i) {
    n.value = ``;
    return;
  }
  if (!r.type.startsWith(`image/`)) {
    n.value = ``;
    return;
  }
  if (r.size > G) {
    n.value = ``;
    return;
  }
  let a = new FileReader();
  (a.addEventListener(`load`, () => {
    i(typeof a.result == `string` ? a.result : null);
  }),
    a.readAsDataURL(r),
    (n.value = ``));
}
function Bt(e, t) {
  let n = e.target,
    r = n.files?.[0],
    i = t.onAssistantAvatarOverrideChange;
  if (!r || !i) {
    n.value = ``;
    return;
  }
  if (r.size > un) {
    n.value = ``;
    return;
  }
  let a = new FileReader();
  (a.addEventListener(`load`, () => {
    let e = typeof a.result == `string` ? a.result : ``;
    e && i(e);
  }),
    a.readAsDataURL(r),
    (n.value = ``));
}
function Vt(e) {
  return e === `auto` ? `auto` : e === `on`;
}
function U(e) {
  return (
    e.configLoading === !0 ||
    e.configSaving === !0 ||
    e.configApplying === !0 ||
    e.configUpdating === !0
  );
}
function Ht(e) {
  return mt({ title: N(`nav.settingsGeneral`) }, [
    B({ title: N(`quickSettings.language`), control: jt(e.locale, e.onLocaleChange) }),
  ]);
}
function Ut(e) {
  let t = xt(e.fastMode),
    n = U(e);
  return H(m.model, { title: N(`quickSettings.model.title`) }, [
    dt({
      title: N(`quickSettings.model.model`),
      control: R(e.currentModel || `default`, { mono: !0 }),
      onClick: () => e.onModelChange?.(),
    }),
    B({
      title: N(`quickSettings.model.thinking`),
      control: L({
        value: e.thinkingLevel,
        options: ln.map((e) => ({ value: e, label: N(`quickSettings.model.thinkingLevels.${e}`) })),
        disabled: n,
        onChange: (t) => e.onThinkingChange?.(t),
      }),
    }),
    B({
      title: N(`quickSettings.model.fastMode`),
      control: L({
        value: t,
        options: [
          { value: `auto`, label: N(`quickSettings.model.fastModes.auto`) },
          { value: `on`, label: N(`quickSettings.model.fastModes.fast`) },
          { value: `off`, label: N(`quickSettings.model.fastModes.standard`) },
        ],
        disabled: n,
        onChange: (n) => {
          n !== t && e.onFastModeChange?.(Vt(n));
        },
      }),
    }),
  ]);
}
function Wt(e) {
  let t =
    e.channels.length === 0
      ? ft(N(`quickSettings.channels.empty`))
      : e.channels.map((t) =>
          B({
            title: t.label,
            control: t.connected
              ? z({ kind: `ok`, label: t.detail ?? N(`common.connected`) })
              : y`
                  <button class="btn" @click=${() => e.onChannelConfigure?.(t.id)}>
                    ${N(`quickSettings.channels.connect`)}
                  </button>
                `,
          }),
        );
  return H(m.channels, { title: N(`quickSettings.channels.title`) }, t);
}
function Gt(e) {
  let { cronJobCount: t, skillCount: n, mcpServerCount: r } = e.automation,
    i = (e, t, n) => B({ title: e, control: y`<button class="btn" @click=${n}>${t}</button>` });
  return H(m.automations, { title: N(`quickSettings.automation.title`) }, [
    i(
      N(
        t === 1
          ? `quickSettings.automation.scheduledTask`
          : `quickSettings.automation.scheduledTasks`,
        { count: String(t) },
      ),
      N(`quickSettings.automation.manage`),
      e.onManageCron,
    ),
    i(
      N(
        n === 1
          ? `quickSettings.automation.installedSkill`
          : `quickSettings.automation.installedSkills`,
        { count: String(n) },
      ),
      N(`quickSettings.automation.browse`),
      e.onBrowseSkills,
    ),
    i(
      N(r === 1 ? `quickSettings.automation.mcpServer` : `quickSettings.automation.mcpServers`, {
        count: String(r),
      }),
      N(`quickSettings.automation.configure`),
      e.onConfigureMcp,
    ),
  ]);
}
function Kt(e) {
  let {
      gatewayAuth: t,
      execPolicy: n,
      deviceAuth: r,
      browserEnabled: i,
      toolProfile: a,
    } = e.security,
    o = a.trim() || `full`,
    s = W.includes(o) ? W : [...W, o],
    c = U(e);
  return H(
    m.security,
    {
      title: N(`quickSettings.security.title`),
      actions: y`
        <button class="btn" @click=${e.onSecurityConfigure}>
          ${N(`quickSettings.security.configure`)}
        </button>
      `,
    },
    [
      B({
        title: N(`quickSettings.security.gatewayAuth`),
        control: z({ kind: t === `none` ? `warn` : `ok`, label: t }),
      }),
      B({ title: N(`quickSettings.security.execPolicy`), control: R(n) }),
      ut({
        title: N(`quickSettings.security.browserEnabled`),
        checked: i,
        disabled: c,
        onChange: (t) => e.onBrowserEnabledToggle?.(t),
      }),
      B({
        title: N(`quickSettings.security.toolProfile`),
        stacked: !0,
        control: L({
          value: o,
          options: s.map((e) => ({ value: e, label: e })),
          disabled: c,
          onChange: (t) => e.onToolProfileChange?.(t),
        }),
      }),
      B({
        title: N(`quickSettings.security.deviceAuth`),
        control: z({ kind: r ? `ok` : `warn`, label: N(r ? `common.enabled` : `common.disabled`) }),
      }),
      B({
        title: N(`nodes.pairing.title`),
        control: y`
          <button
            class="btn"
            title=${e.canPairDevice ? `` : N(`nodes.pairing.adminRequired`)}
            ?disabled=${!e.canPairDevice}
            @click=${e.onPairMobile}
          >
            ${F.smartphone} ${N(`nodes.pairing.button`)}
          </button>
        `,
      }),
    ],
  );
}
function qt(e) {
  return e >= 0.92 ? `critical` : e >= 0.75 ? `warn` : `ok`;
}
function Jt(e, t) {
  let n = Math.min(Math.max(t, 0), 1),
    r = Math.round(n * 100);
  return y`
    <div
      class="config-host__meter"
      role="meter"
      aria-label=${N(`quickSettings.system.usage`, { label: e })}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow=${r}
    >
      <div
        class="config-host__meter-fill config-host__meter-fill--${qt(n)}"
        style="--config-host-meter-fill: ${r}%"
      ></div>
    </div>
  `;
}
function Yt(e) {
  return y`
    <div class="config-host__stat" title=${e.title ?? ``}>
      <div class="config-host__stat-label">${e.label}</div>
      <div class="config-host__stat-value">
        ${e.value}${e.unit ? y` <span class="config-host__stat-unit">${e.unit}</span>` : x}
      </div>
      ${e.usedFraction == null ? x : Jt(e.label, e.usedFraction)}
      ${e.detail ? y`<div class="config-host__stat-detail">${e.detail}</div>` : x}
    </div>
  `;
}
function Xt(e, t) {
  if (!(e == null || t == null || e <= 0)) return (e - t) / e;
}
function Zt(e) {
  return `${Math.round(Math.min(Math.max(e, 0), 1) * 100)}%`;
}
function Qt(e) {
  let t = e.loadAverage?.[0],
    n = e.loadAverage
      ? N(`quickSettings.system.loadAverage`, {
          values: e.loadAverage.map((e) => e.toFixed(1)).join(` · `),
        })
      : void 0,
    r = [e.cpuModel, n].filter(Boolean).join(` · `) || void 0,
    i = N(e.cpuCount === 1 ? `quickSettings.system.core` : `quickSettings.system.cores`, {
      count: String(e.cpuCount),
    }),
    a =
      t == null
        ? { label: N(`quickSettings.system.cpu`), value: i, detail: e.cpuModel, title: r }
        : {
            label: N(`quickSettings.system.cpu`),
            value: t.toFixed(1),
            unit: N(`quickSettings.system.load`),
            detail: i,
            usedFraction: e.cpuCount > 0 ? t / e.cpuCount : void 0,
            title: r,
          },
    o = Xt(e.memoryTotalBytes, e.memoryFreeBytes),
    s = [
      a,
      {
        label: N(`quickSettings.system.memory`),
        value: o == null ? `—` : Zt(o),
        unit: o == null ? void 0 : N(`quickSettings.system.used`),
        detail: N(`quickSettings.system.freeOf`, {
          free: T(e.memoryFreeBytes),
          total: T(e.memoryTotalBytes),
        }),
        usedFraction: o,
      },
    ],
    c = Xt(e.diskTotalBytes, e.diskAvailableBytes);
  return (
    c != null &&
      s.push({
        label: N(`quickSettings.system.disk`),
        value: Zt(c),
        unit: N(`quickSettings.system.used`),
        detail: N(`quickSettings.system.freeOf`, {
          free: T(e.diskAvailableBytes),
          total: T(e.diskTotalBytes),
        }),
        usedFraction: c,
        title: e.diskPath,
      }),
    s
  );
}
function $t() {
  return [
    { label: N(`quickSettings.system.cpu`), value: `—` },
    { label: N(`quickSettings.system.memory`), value: `—` },
    { label: N(`quickSettings.system.disk`), value: `—` },
  ];
}
function en(e) {
  if (e.systemInfoUnavailable) return x;
  let t = e.systemInfo,
    n = t && t.hostname !== t.machineName ? t.hostname : void 0,
    i = t?.lanAddress ? `${t.lanAddress}${t.port == null ? `` : `:${t.port}`}` : void 0,
    a = t ? Qt(t) : $t();
  return H(
    m.system,
    {
      title: N(`quickSettings.system.gatewayHost`),
      actions: t
        ? z({ kind: `ok`, label: N(`quickSettings.system.up`, { duration: r(t.uptimeMs) }) })
        : void 0,
    },
    y`
      <div class="config-host">
        <div class="config-host__identity">
          <div class="config-host__name" title=${n ?? ``}>
            ${t?.machineName ?? `—`}
          </div>
          <div class="config-host__meta">
            ${t ? `${t.osLabel} · ${t.arch}` : `—`}
          </div>
          <div class="config-host__meta">
            ${t ? N(`quickSettings.system.runtime`, { version: t.nodeVersion, pid: String(t.pid) }) : `—`}
          </div>
          ${i ? y`<code class="config-host__address">${i}</code>` : x}
        </div>
        <div class="config-host__stats">${a.map(Yt)}</div>
      </div>
    `,
  );
}
function tn(e) {
  let t = e.hasCustomTheme
      ? (e.customThemeLabel ?? N(`quickSettings.appearance.importedTheme`))
      : N(`quickSettings.appearance.import`),
    n = [
      ...sn.map((e) => ({ value: e.id, label: N(e.labelKey) })),
      ...(e.hasCustomTheme ? [{ value: `custom`, label: t }] : []),
    ];
  return H(m.appearance, { title: N(`quickSettings.appearance.title`) }, [
    B({
      title: N(`quickSettings.appearance.theme`),
      stacked: !0,
      control: y`
          ${L({
            value: e.theme,
            options: n,
            onChange: (t, n) => {
              t !== e.theme && e.setTheme(t, { element: n });
            },
          })}
          ${
            e.hasCustomTheme
              ? x
              : y`<button
                type="button"
                class="btn btn--sm"
                @click=${() => e.onOpenCustomThemeImport?.()}
              >
                ${t}
              </button>`
          }
        `,
    }),
    B({
      title: N(`common.mode`),
      control: L({
        value: e.themeMode,
        options: [`light`, `dark`, `system`].map((e) => ({ value: e, label: N(`common.${e}`) })),
        onChange: (t, n) => {
          t !== e.themeMode && e.setThemeMode(t, { element: n });
        },
      }),
    }),
    B({
      title: N(`quickSettings.appearance.textSize`),
      control: L({
        value: String(e.textScale),
        options: cn.map((e) => ({
          value: String(e.value),
          label: N(e.labelKey),
          title: `${e.value}%`,
        })),
        onChange: (t) => e.setTextScale(Number(t)),
      }),
    }),
    ut({
      title: N(`quickSettings.appearance.lobsterVisits`),
      description: e.lobsterPetVisits
        ? N(`quickSettings.appearance.lobsterVisitsOn`)
        : N(`quickSettings.appearance.lobsterVisitsOff`),
      checked: e.lobsterPetVisits,
      onChange: (t) => e.setLobsterPetVisits(t),
    }),
    ut({
      title: N(`quickSettings.appearance.lobsterSounds`),
      description: e.lobsterPetSounds
        ? N(`quickSettings.appearance.lobsterSoundsOn`)
        : N(`quickSettings.appearance.lobsterSoundsOff`),
      checked: e.lobsterPetSounds,
      onChange: (t) => e.setLobsterPetSounds(t),
    }),
    B({
      title: N(`quickSettings.appearance.lobsterdex`),
      description: N(`quickSettings.appearance.lobsterdexSeen`, {
        seen: String(I.filter((e) => Je().has(e.id)).length),
        total: String(I.length),
      }),
      stacked: !0,
      control: y`
          <div class="lobsterdex">
            ${I.map((e) => {
              let t = Ze().get(e.id),
                n = t !== void 0,
                r = n
                  ? t.firstSeenAt === null
                    ? (t.name ?? e.id)
                    : N(`quickSettings.appearance.lobsterdexFirstVisited`, {
                        name: t.name ?? e.id,
                        date: new Date(t.firstSeenAt).toLocaleDateString(),
                      })
                  : `?`;
              return y`
                <span
                  class="lobsterdex__mini lobster-pet--palette-${e.id} ${n ? `` : `lobsterdex__mini--unseen`}"
                  style="--lob-shell:${e.shell};--lob-claw:${e.claw}"
                  title=${r}
                >
                  ${Ke(Ye(e), { standalone: !0 })}
                </span>
              `;
            })}
          </div>
        `,
    }),
  ]);
}
function nn(e) {
  let t = ze({ name: null, avatar: e.userAvatar ?? null }),
    n = Te(t) ?? ``,
    r = w(e.assistantName) ?? N(`quickSettings.personal.assistant`),
    i = !!(Ft(e) || O(e.assistantAvatarOverride ?? e.assistantAvatar)),
    a = w(e.assistantAvatarOverride),
    o = It(a ?? e.assistantAvatarSource),
    s = Lt(e.assistantAvatarStatus ?? null, e.assistantAvatarReason, i, !!a),
    c = N(a ? `quickSettings.personal.uiOverride` : `quickSettings.personal.configuredAvatar`),
    l = !!e.onAssistantAvatarOverrideChange,
    u = N(
      a
        ? `quickSettings.personal.overrideFromSettings`
        : s
          ? `quickSettings.personal.fallbackAvatar`
          : i
            ? `quickSettings.personal.configuredAvatar`
            : `quickSettings.personal.fallbackLogo`,
    );
  return H(
    m.personal,
    { title: N(`quickSettings.personal.title`) },
    y`
      <section class="config-identity" aria-label=${N(`quickSettings.personal.localIdentity`)}>
        ${Pt(e.userAvatar)}
        <div class="config-identity__copy">
          <div class="config-identity__eyebrow">${N(`quickSettings.personal.user`)}</div>
          <div class="config-identity__title">${N(`quickSettings.personal.you`)}</div>
          <div class="config-identity__repair">
            <label class="config-identity__field">
              <span class="config-identity__field-label">
                ${N(`quickSettings.personal.avatarText`)}
              </span>
              <input
                class="settings-input"
                type="text"
                maxlength="16"
                .value=${n}
                placeholder=${N(`quickSettings.personal.avatarPlaceholder`)}
                @input=${(t) => {
                  let n = t.target.value;
                  e.onUserAvatarChange?.(n.trim() ? n : null);
                }}
              />
            </label>
            <div class="config-identity__actions">
              <label class="btn btn--sm">
                ${N(`quickSettings.personal.chooseImage`)}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  @change=${(t) => zt(t, e)}
                />
              </label>
              <button
                type="button"
                class="btn btn--sm btn--ghost"
                ?disabled=${!t.avatar}
                @click=${() => {
                  e.onUserAvatarChange?.(null);
                }}
              >
                ${N(`quickSettings.personal.clearAvatar`)}
              </button>
            </div>
            <div class="config-identity__hint muted">
              ${N(`quickSettings.personal.browserOnly`)}
            </div>
          </div>
        </div>
      </section>
      <section
        class="config-identity config-identity--assistant"
        aria-label=${N(`quickSettings.personal.assistantIdentity`)}
      >
        ${Rt(e)}
        <div class="config-identity__copy">
          <div class="config-identity__eyebrow">${N(`quickSettings.personal.assistant`)}</div>
          <div class="config-identity__title">${r}</div>
          <div class="config-identity__sub">${u}</div>
          ${
            o
              ? y`
                <div class="config-identity__source" title=${e.assistantAvatarSource ?? ``}>
                  <span>${c}</span>
                  <code>${o}</code>
                </div>
              `
              : x
          }
          ${
            s
              ? y`<div class="config-identity__issue">
                ${z({ kind: `warn`, label: s })}
              </div>`
              : x
          }
          ${
            l
              ? y`
                <div class="config-identity__repair">
                  <div class="config-identity__actions">
                    <label class="btn btn--sm">
                      ${e.assistantAvatarUploadBusy ? N(`common.saving`) : N(a ? `quickSettings.personal.replaceImage` : `quickSettings.personal.chooseImage`)}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        ?disabled=${e.assistantAvatarUploadBusy === !0}
                        @change=${(t) => Bt(t, e)}
                      />
                    </label>
                    ${
                      a
                        ? y`
                          <button
                            type="button"
                            class="btn btn--sm btn--ghost"
                            ?disabled=${e.assistantAvatarUploadBusy === !0}
                            @click=${() => {
                              e.onAssistantAvatarClearOverride?.();
                            }}
                          >
                            ${N(`quickSettings.personal.clearOverride`)}
                          </button>
                        `
                        : x
                    }
                  </div>
                  <div class="config-identity__hint muted">
                    ${N(`quickSettings.personal.overrideHint`)}
                  </div>
                </div>
              `
              : x
          }
          ${e.assistantAvatarUploadError ? y`<div class="config-identity__error">${e.assistantAvatarUploadError}</div>` : x}
        </div>
      </section>
    `,
  );
}
function rn(e) {
  if (e.configDirty !== !0) return x;
  let t = U(e),
    n = e.connected && e.configReady === !0 && !t;
  return y`
    <div class="settings-group" aria-live="polite">
      ${B({
        title: N(`quickSettings.pending.title`),
        description: N(`quickSettings.pending.hint`),
        control: y`
          <button class="btn btn--sm" ?disabled=${t} @click=${e.onResetConfig}>
            ${N(`quickSettings.pending.discard`)}
          </button>
          <button class="btn btn--sm primary" ?disabled=${!n} @click=${e.onSaveConfig}>
            ${e.configSaving === !0 ? N(`common.saving`) : N(`common.save`)}
          </button>
          <button class="btn btn--sm" ?disabled=${!n} @click=${e.onApplyConfig}>
            ${e.configApplying === !0 ? N(`quickSettings.pending.applying`) : N(`quickSettings.pending.applyNow`)}
          </button>
        `,
      })}
    </div>
  `;
}
function an(e) {
  let t = [e.assistantName, e.version ? `v${e.version}` : ``].filter(Boolean).join(` · `);
  return pt(
    B({
      title: z({
        kind: e.connected ? `ok` : `muted`,
        label: e.connected ? N(`common.connected`) : N(`common.offline`),
      }),
      control: t ? R(t) : x,
    }),
  );
}
function on(e) {
  return lt(y`
    ${Ut(e)} ${Wt(e)} ${Kt(e)}
    ${Gt(e)} ${Ht(e)}
    ${tn(e)} ${nn(e)} ${en(e)}
    ${rn(e)} ${an(e)}
  `);
}
var sn,
  cn,
  ln,
  W,
  G,
  un,
  dn = e(() => {
    (ie(),
      b(),
      bt(),
      ge(),
      ke(),
      Ge(),
      Qe(),
      Xe(),
      V(),
      P(),
      ue(),
      pe(),
      k(),
      oe(),
      Mt(),
      c(),
      (sn = [
        { id: `claw`, labelKey: `quickSettings.appearance.themes.claw` },
        { id: `knot`, labelKey: `quickSettings.appearance.themes.knot` },
        { id: `dash`, labelKey: `quickSettings.appearance.themes.dash` },
      ]),
      (cn = [
        { value: 90, labelKey: `quickSettings.appearance.textSizes.small` },
        { value: 100, labelKey: `quickSettings.appearance.textSizes.medium` },
        { value: 110, labelKey: `quickSettings.appearance.textSizes.large` },
        { value: 125, labelKey: `quickSettings.appearance.textSizes.xl` },
        { value: 140, labelKey: `quickSettings.appearance.textSizes.xxl` },
      ]),
      (ln = [`off`, `low`, `medium`, `high`]),
      (W = [`minimal`, `coding`, `messaging`, `full`]),
      (G = 15e5),
      (un = G));
  });
function fn(e) {
  return B({
    title: e.title,
    control: y`
      <select
        class="settings-select"
        ?data-settings-send-shortcut=${e.setting === `send-shortcut`}
        ?data-settings-catalog-open-target=${e.setting === `catalog-open-target`}
        aria-label=${e.title}
        .value=${e.value}
        @change=${(t) => e.onChange(t.currentTarget.value)}
      >
        ${e.options.map(
          (t) => y`
            <option value=${t.value} ?selected=${e.value === t.value}>
              ${t.label}
            </option>
          `,
        )}
      </select>
    `,
  });
}
var pn = e(() => {
  (b(), V());
});
function mn(e) {
  return `config-section-tab-${encodeURIComponent(e ?? `root`).replaceAll(`%`, `-`)}`;
}
function hn() {
  return {
    rawRevealed: !1,
    rawDiffOpen: !1,
    envRevealed: !1,
    validityDismissed: !1,
    revealedSensitivePaths: new Set(),
    lastCustomThemeImportFocusToken: null,
    lastConfigContextKey: null,
    lastFormModeForScroll: null,
  };
}
function gn(e) {
  return J[e] ?? J.default;
}
function _n(e, t) {
  if (!e || at(e) !== `object` || !e.properties) return e;
  let n = t.include,
    r = t.exclude,
    i = {};
  for (let t of Object.keys(e.properties)) {
    if ((n && n.size > 0 && !n.has(t)) || (r && r.size > 0 && r.has(t))) continue;
    let a = e.properties[t];
    a && (i[t] = a);
  }
  return { ...e, properties: i };
}
function vn(e) {
  return !e || typeof e != `object` || Array.isArray(e) ? null : e;
}
function yn(e) {
  return e?.length ? e.join(``) : ``;
}
function bn(e, t, n, r, i, a) {
  let o = yn(n),
    s = yn(r),
    c = e.schemaAnalysisCache;
  if (c && c.schema === t && c.includeKey === o && c.excludeKey === s) return c.analysis;
  let l = gt(_n(t, { include: i, exclude: a }));
  return ((e.schemaAnalysisCache = { schema: t, includeKey: o, excludeKey: s, analysis: l }), l);
}
function K(e) {
  return e.length > 0 ? e.join(`.`) : N(`configView.root`);
}
function xn(e, t) {
  if (!e || !t) return [];
  let n = [],
    r = 0;
  function i(e, t, r) {
    n.length < Z && n.push({ path: e, from: t, to: r });
  }
  function a(e, t, n) {
    if (e.length !== t.length || e.length > Hn) return !0;
    for (let r = 0; r < e.length; r += 1) if (s(e[r], t[r], n + 1)) return !0;
    return !1;
  }
  function o(e, t, n) {
    let r = Object.keys(e),
      i = Object.keys(t);
    if (r.length !== i.length) return !0;
    for (let i of r) if (!Object.hasOwn(t, i) || s(e[i], t[i], n + 1)) return !0;
    return !1;
  }
  function s(e, t, n) {
    return (
      (r += 1),
      r > Vn || n > X
        ? !0
        : e === t
          ? !1
          : typeof e == typeof t
            ? typeof e != `object` || !e || t === null
              ? e !== t
              : Array.isArray(e) || Array.isArray(t)
                ? Array.isArray(e) && Array.isArray(t)
                  ? a(e, t, n + 1)
                  : !0
                : o(e, t, n + 1)
            : !0
    );
  }
  function c(e, t, o, s) {
    if (((r += 1), r > Vn || s > X || n.length >= Z || e === t)) return;
    if (typeof e != typeof t) {
      i(o, e, t);
      return;
    }
    if (typeof e != `object` || !e || t === null) {
      e !== t && i(o, e, t);
      return;
    }
    if (Array.isArray(e) || Array.isArray(t)) {
      ((Array.isArray(e) && Array.isArray(t) && a(e, t, s + 1)) ||
        !Array.isArray(e) ||
        !Array.isArray(t)) &&
        i(o, e, t);
      return;
    }
    let l = e,
      u = t,
      d = new Set([...Object.keys(l), ...Object.keys(u)]);
    for (let e of d) c(l[e], u[e], [...o, e], s + 1);
  }
  return (c(e, t, [], 0), n);
}
function Sn(e, t, n) {
  if (e.rawDiffCache?.original === t && e.rawDiffCache.current === n) return e.rawDiffCache.diff;
  if (t.length > Un || n.length > Un)
    return ((e.rawDiffCache = { original: t, current: n, diff: [] }), e.rawDiffCache.diff);
  try {
    let r = Ve.parse(t),
      i = Ve.parse(n);
    if (
      !r ||
      !i ||
      typeof r != `object` ||
      typeof i != `object` ||
      Array.isArray(r) ||
      Array.isArray(i)
    )
      return ((e.rawDiffCache = { original: t, current: n, diff: [] }), []);
    let a = xn(r, i);
    return ((e.rawDiffCache = { original: t, current: n, diff: a }), a);
  } catch {
    return ((e.rawDiffCache = { original: t, current: n, diff: [] }), []);
  }
}
function q(e, t = 40) {
  if (Array.isArray(e))
    return N(e.length === 1 ? `configView.itemCount` : `configView.itemCountPlural`, {
      count: String(e.length),
    });
  let n;
  try {
    n = JSON.stringify(e) ?? String(e);
  } catch {
    n = String(e);
  }
  return n.length <= t ? n : re(n, t - 3) + `...`;
}
function Cn(e, t, n) {
  return et(K(e)) && t != null && q(t).trim() !== `` ? it : q(t);
}
function wn(e, t) {
  let n = e.split(`.`);
  return n.length === t.length ? n.every((e, n) => e === `*` || e === t[n]) : !1;
}
function Tn(e, t) {
  return Object.entries(t).some(([t, n]) => !!n.sensitive && wn(t, e));
}
function En(e, t) {
  for (let n = 1; n <= e.length; n += 1) {
    let r = e.slice(0, n),
      i = K(r);
    if (($e(r, t)?.sensitive ?? !1) || Tn(r, t) || et(i)) return !0;
  }
  return !1;
}
function Dn(e, t, n, r) {
  let i = nt(t, e, n) > 0;
  return !r && t != null && (En(e, n) || i) ? it : q(t);
}
function On(e) {
  return e.hasCustomTheme && e.customThemeLabel
    ? e.customThemeLabel
    : N(`configView.appearance.importedTheme`);
}
function kn() {
  (typeof requestAnimationFrame == `function`
    ? requestAnimationFrame
    : (e) => window.setTimeout(() => e(0), 0))(() => {
    let e = globalThis.document?.querySelector(`[data-custom-theme-import-input]`);
    e &&
      (typeof e.scrollIntoView == `function` &&
        e.scrollIntoView({ block: `center`, behavior: `smooth` }),
      e.focus(),
      e.select());
  });
}
function An(e) {
  let t = e.webPush;
  if (!t)
    return y`
      <div class="settings-page">
        <section class="settings-section" id=${d.notifications}>
          <div class="settings-section__header">
            <h2 class="settings-section__heading">${N(`configView.notifications.title`)}</h2>
            <div class="settings-section__actions">
              ${z({ kind: `muted`, label: N(`configView.notifications.unavailable`) })}
            </div>
          </div>
          <div class="settings-group">
            <div class="settings-row">
              <div class="settings-row__text">
                <span class="settings-row__desc">
                  ${N(`configView.notifications.unavailableHint`)}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
  let n =
      t.permission === `granted`
        ? N(`configView.notifications.granted`)
        : t.permission === `denied`
          ? N(`configView.notifications.denied`)
          : t.permission === "default"
            ? N(`configView.notifications.notRequested`)
            : N(`configView.notifications.unsupported`),
    r = t.subscribed
      ? N(`configView.notifications.subscribed`)
      : N(`configView.notifications.notSubscribed`),
    i = t.supported
      ? t.permission === `denied`
        ? N(`configView.notifications.blocked`)
        : t.subscribed
          ? N(`configView.notifications.subscribed`)
          : N(`configView.notifications.ready`)
      : N(`configView.notifications.unsupported`),
    a = t.supported
      ? t.permission === `denied`
        ? `danger`
        : t.subscribed
          ? `ok`
          : `accent`
      : `muted`,
    o =
      t.supported && t.permission !== `denied`
        ? t.subscribed
          ? y`
            <button
              class="btn"
              ?disabled=${t.loading || !e.connected}
              @click=${() => e.onWebPushUnsubscribe?.()}
            >
              ${F.x} ${N(`configView.notifications.unsubscribe`)}
            </button>
            <button
              class="btn primary"
              ?disabled=${t.loading || !e.connected}
              @click=${() => e.onWebPushTest?.()}
            >
              ${F.send} ${N(`configView.notifications.sendTest`)}
            </button>
          `
          : y`
            <button
              class="btn primary"
              ?disabled=${t.loading || !e.connected}
              @click=${() => e.onWebPushSubscribe?.()}
            >
              ${t.loading ? F.loader : x}
              ${t.loading ? N(`configView.notifications.subscribing`) : N(`configView.notifications.enable`)}
            </button>
          `
        : x;
  return y`
    <div class="settings-page">
      <section class="settings-section" id=${d.notifications}>
        <div class="settings-section__header">
          <h2 class="settings-section__heading">${N(`configView.notifications.title`)}</h2>
          <div class="settings-section__actions">
            ${z({ kind: a, label: i })}
          </div>
        </div>
        <p class="settings-section__desc">${N(`configView.notifications.hint`)}</p>
        <div class="settings-group">
          ${B({ title: N(`configView.notifications.browserSupport`), control: R(t.supported ? N(`configView.notifications.available`) : N(`configView.notifications.notSupported`)) })}
          ${B({ title: N(`configView.notifications.permission`), control: R(n) })}
          ${B({ title: N(`configView.notifications.status`), control: z({ kind: t.subscribed ? `ok` : `muted`, label: r }) })}
          ${
            o === x
              ? x
              : y`
                <div class="settings-row">
                  <div class="settings-row__control">${o}</div>
                </div>
              `
          }
          ${t.permission === `denied` ? B({ title: N(`configView.notifications.blocked`), description: N(`configView.notifications.blockedHint`), control: z({ kind: `danger`, label: N(`configView.notifications.denied`) }) }) : x}
          ${
            t.error
              ? y`
                <div class="settings-row">
                  <div class="settings-row__text">
                    <span class="cfg-field__error">${t.error}</span>
                  </div>
                </div>
              `
              : x
          }
        </div>
      </section>
    </div>
  `;
}
function jn(e) {
  let t = e.microphone;
  if (!t || !e.onMicrophoneSelect) return x;
  let n = t.selectedDeviceId.trim(),
    r = t.devices.some((e) => e.deviceId === n),
    i = [
      { label: N(`chat.composer.systemDefaultMicrophone`), value: `` },
      ...t.devices.map((e) => ({ label: e.label, value: e.deviceId })),
      ...(n && !r
        ? [
            {
              label: N(`chat.composer.microphoneFallback`, {
                number: String(t.devices.length + 1),
              }),
              value: n,
            },
          ]
        : []),
    ],
    a = `${N(`common.refresh`)}: ${N(`chat.composer.microphoneInput`)}`,
    o = t.error
      ? y`<span role="alert">${t.error}</span>`
      : !t.loading && t.devices.length === 0
        ? N(`chat.composer.noMicrophones`)
        : void 0;
  return B({
    title: N(`chat.composer.microphoneInput`),
    description: o,
    control: y`
      <select
        class="settings-select"
        data-settings-microphone
        aria-label=${N(`chat.composer.microphoneInput`)}
        .value=${n}
        @change=${(t) => e.onMicrophoneSelect?.(t.currentTarget.value)}
      >
        ${i.map(
          (e) => y`
            <option value=${e.value} ?selected=${e.value === n}>
              ${e.label}
            </option>
          `,
        )}
      </select>
      <button
        type="button"
        class="btn btn--sm btn--icon"
        aria-label=${a}
        ?disabled=${t.loading}
        @click=${() => e.onMicrophoneRefresh?.()}
      >
        ${t.loading ? F.loader : F.refresh}
      </button>
    `,
  });
}
function Mn(e) {
  return y`
    <section id=${g.chat} class="settings-section">
      <div class="settings-section__header">
        <h2 class="settings-section__heading">${N(`configView.chatPrefs.title`)}</h2>
      </div>
      <p class="settings-section__desc">${N(`configView.chatPrefs.hint`)}</p>
      <div class="settings-group">
        ${fn({
          title: N(`chat.sendShortcut`),
          value: e.chatSendShortcut,
          setting: `send-shortcut`,
          options: [
            { value: `enter`, label: N(`chat.sendShortcutEnter`) },
            { value: `modifier-enter`, label: N(`chat.sendShortcutModifierEnter`) },
          ],
          onChange: (t) => e.setChatSendShortcut(Ne(t)),
        })}
        ${fn({
          title: N(`chat.catalogOpenTarget`),
          value: e.catalogOpenTarget,
          setting: `catalog-open-target`,
          options: [
            { value: `viewer`, label: N(`chat.catalogOpenTargetViewer`) },
            { value: `terminal`, label: N(`chat.catalogOpenTargetTerminal`) },
          ],
          onChange: (t) => e.setCatalogOpenTarget(Fe(t)),
        })}
        ${jn(e)}
      </div>
    </section>
  `;
}
function Nn(e) {
  let t = e.viewState,
    n = e.hasCustomTheme || e.customThemeImportExpanded === !0;
  n &&
    e.customThemeImportFocusToken != null &&
    e.customThemeImportFocusToken !== t.lastCustomThemeImportFocusToken &&
    ((t.lastCustomThemeImportFocusToken = e.customThemeImportFocusToken), kn());
  let r = On(e),
    i = [
      ...Wn.map((e) => ({
        id: e.id,
        label: N(e.labelKey),
        description: N(e.descriptionKey),
        icon: e.icon,
      })),
      {
        id: `custom`,
        label: e.hasCustomTheme ? r : N(`configView.appearance.import`),
        description: e.hasCustomTheme
          ? N(`configView.appearance.importedFrom`, { name: r })
          : N(`configView.appearance.importHint`),
        icon: F.spark,
      },
    ];
  return y`
    <div class="settings-page">
      <section id=${g.theme} class="settings-section">
        <div class="settings-section__header">
          <h2 class="settings-section__heading">${N(`configView.appearance.theme`)}</h2>
        </div>
        <p class="settings-section__desc">${N(`configView.appearance.chooseTheme`)}</p>
        <div class="settings-group">
          <div class="settings-row settings-row--stacked">
            <div class="settings-theme-grid">
              ${i.map(
                (t) => y`
                  <button
                    class="settings-theme-card ${t.id === e.theme ? `settings-theme-card--active` : ``}"
                    title=${t.description}
                    @click=${(n) => {
                      if (t.id === `custom` && !e.hasCustomTheme) {
                        e.onOpenCustomThemeImport?.();
                        return;
                      }
                      if (t.id !== e.theme) {
                        let r = { element: n.currentTarget ?? void 0 };
                        e.setTheme(t.id, r);
                      }
                    }}
                  >
                    <span class="settings-theme-card__icon" aria-hidden="true">${t.icon}</span>
                    <span class="settings-theme-card__label">${t.label}</span>
                    ${
                      t.id === e.theme
                        ? y`<span class="settings-theme-card__check" aria-hidden="true"
                          >${F.check}</span
                        >`
                        : x
                    }
                  </button>
                `,
              )}
            </div>
          </div>
          <div class="settings-row settings-row--stacked">
            ${
              n
                ? y`
                  <div class="settings-theme-import">
                    <div class="settings-theme-import__copy">
                      <div class="settings-theme-import__title">
                        ${N(`configView.appearance.importFromTweakcn`)}
                      </div>
                      <p class="settings-theme-import__hint">
                        ${N(`configView.appearance.tweakcnInstructions`)}
                      </p>
                    </div>
                    <a
                      class="settings-theme-import__external"
                      href="https://tweakcn.com/editor/theme"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      ${N(`configView.appearance.browseTweakcn`)} ${F.externalLink}
                    </a>
                    <label class="settings-theme-import__field">
                      <span class="settings-theme-import__label"
                        >${N(`configView.appearance.themeLink`)}</span
                      >
                      <input
                        class="settings-theme-import__input"
                        data-custom-theme-import-input
                        type="text"
                        spellcheck="false"
                        placeholder="https://tweakcn.com/editor/theme?theme=... or amethyst-haze"
                        .value=${e.customThemeImportUrl}
                        @input=${(t) => e.onCustomThemeImportUrlChange(t.currentTarget.value)}
                      />
                    </label>
                    <div class="settings-theme-import__actions">
                      <button
                        class="btn btn--sm primary"
                        ?disabled=${e.customThemeImportBusy || e.customThemeImportUrl.trim().length === 0}
                        @click=${e.onImportCustomTheme}
                      >
                        ${e.customThemeImportBusy ? N(`common.importing`) : e.hasCustomTheme ? N(`configView.appearance.replace`, { name: r }) : N(`configView.appearance.importTheme`)}
                      </button>
                      ${
                        e.hasCustomTheme
                          ? y`
                            <button class="btn btn--sm danger" @click=${e.onClearCustomTheme}>
                              ${N(`configView.appearance.clear`, { name: r })}
                            </button>
                          `
                          : x
                      }
                    </div>
                    ${
                      e.hasCustomTheme
                        ? y`
                          <div class="settings-theme-import__meta">
                            <span class="settings-theme-import__meta-label"
                              >${N(`configView.appearance.loaded`)}</span
                            >
                            <span class="settings-theme-import__meta-value"
                              >${r} · ${e.customThemeSourceUrl ?? `tweakcn`}</span
                            >
                          </div>
                        `
                        : x
                    }
                    ${
                      e.customThemeImportMessage
                        ? y`
                          <div
                            class="settings-theme-import__message settings-theme-import__message--${e.customThemeImportMessage.kind}"
                          >
                            ${e.customThemeImportMessage.text}
                          </div>
                        `
                        : x
                    }
                  </div>
                `
                : y`
                  <p class="settings-theme-import__inline-hint">
                    ${N(`configView.appearance.inlineHintBefore`)}
                    <strong>${N(`configView.appearance.import`)}</strong>
                    ${N(`configView.appearance.inlineHintAfter`)}
                  </p>
                `
            }
          </div>
        </div>
      </section>

      <section id=${g.textSize} class="settings-section">
        <div class="settings-section__header">
          <h2 class="settings-section__heading">${N(`configView.appearance.textSize`)}</h2>
        </div>
        <div class="settings-group">
          <div class="settings-row settings-row--stacked">
            <div class="settings-text-scale">
              <div class="settings-text-scale__options">
                ${Ae.map(
                  (t) => y`
                    <button
                      type="button"
                      class="settings-text-scale__btn ${t === e.textScale ? `active` : ``}"
                      @click=${() => e.setTextScale(t)}
                    >
                      <span class="settings-text-scale__sample">${N(zn[t])}</span>
                      <span class="settings-text-scale__label">${t}%</span>
                    </button>
                  `,
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      ${Mn(e)}

      <section id=${g.connection} class="settings-section">
        <div class="settings-section__header">
          <h2 class="settings-section__heading">${N(`configView.connection.title`)}</h2>
        </div>
        <div class="settings-group">
          ${B({ title: N(`configView.connection.gateway`), control: R(e.gatewayUrl || `-`, { mono: !0 }) })}
          ${B({ title: N(`configView.connection.status`), control: z({ kind: e.connected ? `ok` : `muted`, label: e.connected ? N(`common.connected`) : N(`common.offline`) }) })}
          ${e.assistantName ? B({ title: N(`configView.connection.assistant`), control: R(e.assistantName) }) : x}
        </div>
      </section>
    </div>
  `;
}
function Pn(e) {
  ((e.rawRevealed = !1),
    (e.rawDiffOpen = !1),
    (e.envRevealed = !1),
    (e.validityDismissed = !1),
    e.revealedSensitivePaths.clear(),
    (e.lastCustomThemeImportFocusToken = null),
    (e.rawDiffCache = void 0));
}
function Fn(e) {
  let t = e.includeSections?.join(``) ?? ``,
    n = e.excludeSections?.join(``) ?? ``;
  return [e.configPath ?? ``, e.gatewayUrl, e.navRootLabel ?? ``, t, n].join(``);
}
function In(e, t) {
  let n = tt(t);
  return n ? e.revealedSensitivePaths.has(n) : !1;
}
function Ln(e, t) {
  let n = tt(t);
  n &&
    (e.revealedSensitivePaths.has(n)
      ? e.revealedSensitivePaths.delete(n)
      : e.revealedSensitivePaths.add(n));
}
function Rn(e) {
  let t = e.viewState,
    n = e.showModeToggle ?? !1,
    r = e.showRootTab ?? !0,
    i = e.valid == null ? `unknown` : e.valid ? `valid` : `invalid`,
    a = e.includeVirtualSections ?? !0,
    o = e.includeSections?.length ? new Set(e.includeSections) : null,
    s = e.excludeSections?.length ? new Set(e.excludeSections) : null,
    c = bn(t, vn(e.schema), e.includeSections, e.excludeSections, o, s),
    l = c.schema ? c.unsupportedPaths.length > 0 : !1,
    u = e.rawAvailable ?? !0,
    d = n && u ? e.formMode : `form`,
    f = e.onViewStateChange,
    p = (e) => {
      queueMicrotask(() => {
        let t =
          (e instanceof Element ? e : null)
            ?.closest(`.config-main`)
            ?.querySelector(`.config-content`) ??
          globalThis.document?.querySelector(`.config-content`);
        if (t) {
          if (typeof t.scrollTo == `function`) {
            t.scrollTo({ top: 0, left: 0, behavior: `auto` });
            return;
          }
          ((t.scrollTop = 0), (t.scrollLeft = 0));
        }
      });
    };
  (t.lastFormModeForScroll !== null && t.lastFormModeForScroll !== d && p(null),
    (t.lastFormModeForScroll = d));
  let m = Fn(e);
  t.lastConfigContextKey !== m && (Pn(t), (t.lastConfigContextKey = m));
  let h = t.envRevealed,
    g = c.schema?.properties ?? {},
    ee = new Set([`__appearance__`, `__notifications__`]),
    te = (e) => a && ee.has(e) && (e === `__appearance__` || o?.has(e) === !0),
    ne = (e) =>
      N(
        `configView.sections.${e === `__appearance__` ? `theme` : e === `__notifications__` ? `notifications` : e}`,
      ),
    _ = Y.map((e) => ({
      id: e.id,
      label: N(`configView.categories.${e.id}`),
      sections: e.sections
        .filter((e) => (te(e) || e in g) && (!o || o.has(e)) && (!s || !s.has(e)))
        .map((e) => ({ key: e, label: ne(e) })),
    })).filter((e) => e.sections.length > 0),
    v = Object.keys(g)
      .filter((e) => !Bn.has(e))
      .map((e) => ({ key: e, label: e.charAt(0).toUpperCase() + e.slice(1) })),
    b = v.length > 0 ? { id: `other`, label: N(`configView.categories.other`), sections: v } : null,
    S = [
      ...(r ? [{ key: null, label: e.navRootLabel ?? N(`nav.settings`) }] : []),
      ...[..._, ...(b ? [b] : [])].flatMap((e) =>
        e.sections.map((e) => ({ key: e.key, label: e.label })),
      ),
    ],
    re = e.settingsLayout ?? `tabs`,
    ie = [..._, ...(b ? [b] : [])];
  function ae() {
    return y`
      <div class="config-accordion-nav">
        ${ie.map(
          (t) => y`
            <div class="config-accordion-group">
              <button
                class="config-accordion-group__header ${e.activeSection != null && t.sections.some((t) => t.key === e.activeSection) ? `config-accordion-group__header--active` : ``}"
                @click=${(n) => {
                  let r = t.sections[0]?.key ?? null,
                    i = t.sections.some((t) => t.key === e.activeSection);
                  (e.onSectionChange(i ? null : r), p(n.currentTarget));
                }}
              >
                <span class="config-accordion-group__icon">
                  ${gn(t.sections[0]?.key ?? `default`)}
                </span>
                <span>${t.label}</span>
                <svg
                  class="config-accordion-group__chevron ${t.sections.some((t) => t.key === e.activeSection) ? `config-accordion-group__chevron--open` : ``}"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  width="14"
                  height="14"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              ${
                t.sections.some((t) => t.key === e.activeSection)
                  ? y`
                    <div class="config-accordion-group__items">
                      ${t.sections.map(
                        (t) => y`
                          <button
                            class="config-accordion-group__item ${e.activeSection === t.key ? `config-accordion-group__item--active` : ``}"
                            @click=${(n) => {
                              (e.onSectionChange(t.key), p(n.currentTarget));
                            }}
                          >
                            <span class="config-accordion-group__item-icon">
                              ${gn(t.key)}
                            </span>
                            ${t.label}
                          </button>
                        `,
                      )}
                    </div>
                  `
                  : x
              }
            </div>
          `,
        )}
      </div>
    `;
  }
  let C = d === `form` ? xn(e.originalValue, e.formValue) : [],
    w = d === `raw` && e.raw !== e.originalRaw;
  ((!w || d !== `raw`) && t.rawDiffOpen && (t.rawDiffOpen = !1),
    (!w || d !== `raw` || !t.rawDiffOpen) && (t.rawDiffCache = void 0));
  let T = d === `raw` && w && t.rawDiffOpen ? Sn(t, e.originalRaw, e.raw) : [],
    E = d === `form` ? C.length > 0 : w,
    D = e.loading || e.saving || e.applying || e.updating,
    oe = !!e.formValue && !e.loading && !!c.schema,
    O = e.connected && !D && E && (d === `raw` ? !0 : oe),
    se = e.connected && !D && E && (d === `raw` ? !0 : oe),
    ce = e.connected && !D,
    k = (e, t, n) =>
      e
        ? y`<span class="config-action-spinner" aria-hidden="true">${F.loader}</span
          >${n}`
        : t,
    le = a && d === `form` && e.activeSection === null && !!o?.has(`__appearance__`);
  return y`
    <div class="config-layout">
      <main class="config-main">
        <div class="config-actions">
          <div class="config-actions__left">
            ${
              n
                ? y`
                  <div class="config-mode-toggle">
                    <button
                      class="config-mode-toggle__btn ${d === `form` ? `active` : ``}"
                      ?disabled=${e.schemaLoading || !e.schema}
                      title=${l ? N(`configView.formUnsafeTitle`) : ``}
                      @click=${() => e.onFormModeChange(`form`)}
                    >
                      ${N(`configView.form`)}
                    </button>
                    <button
                      class="config-mode-toggle__btn ${d === `raw` ? `active` : ``}"
                      ?disabled=${!u}
                      title=${N(u ? `configView.rawTitle` : `configView.rawUnavailableTitle`)}
                      @click=${() => e.onFormModeChange(`raw`)}
                    >
                      ${N(`configView.raw`)}
                    </button>
                  </div>
                `
                : x
            }
            ${
              E
                ? y`
                  <span class="config-changes-badge"
                    >${d === `raw` ? N(`common.unsavedChanges`) : N(C.length === 1 ? `configView.unsavedChange` : `configView.unsavedChanges`, { count: String(C.length) })}</span
                  >
                `
                : y` <span class="config-status muted">${N(`configView.noChanges`)}</span> `
            }
          </div>
          <div class="config-actions__right">
            ${
              u
                ? x
                : y`
                  <span class="config-status muted config-actions__notice"
                    >${N(`configView.rawDisabled`)}</span
                  >
                `
            }
            <div class="config-actions__buttons">
              ${
                e.onOpenFile
                  ? y`
                    <button class="btn btn--sm" @click=${e.onOpenFile}>
                      ${F.fileText} ${N(`configView.open`)}
                    </button>
                  `
                  : x
              }
              <button class="btn btn--sm" ?disabled=${D} @click=${e.onReload}>
                ${e.loading ? N(`common.loading`) : N(`common.reload`)}
              </button>
              <button
                class="btn btn--sm"
                ?disabled=${D || !E}
                @click=${e.onReset}
              >
                ${N(`configView.clear`)}
              </button>
              <button
                class="btn btn--sm primary"
                ?disabled=${!O}
                aria-busy=${e.saving ? `true` : `false`}
                @click=${e.onSave}
              >
                ${k(e.saving, N(`common.save`), N(`common.saving`))}
              </button>
              <button
                class="btn btn--sm"
                ?disabled=${!se}
                aria-busy=${e.applying ? `true` : `false`}
                @click=${e.onApply}
              >
                ${k(e.applying, N(`configView.apply`), N(`configView.applying`))}
              </button>
              <button
                class="btn btn--sm"
                ?disabled=${!ce}
                aria-busy=${e.updating ? `true` : `false`}
                @click=${e.onUpdate}
              >
                ${k(e.updating, N(`configView.update`), N(`configView.updating`))}
              </button>
            </div>
          </div>
        </div>

        ${
          re === `accordion`
            ? ae()
            : y`
              <div class="config-top-tabs">
                ${
                  d === `form`
                    ? y`
                      <div class="config-search config-search--top">
                        <div class="config-search__input-row">
                          <svg
                            class="config-search__icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="M21 21l-4.35-4.35"></path>
                          </svg>
                          <input
                            type="text"
                            class="config-search__input"
                            placeholder=${N(`configView.searchPlaceholder`)}
                            aria-label=${N(`configView.search`)}
                            .value=${e.searchQuery}
                            @input=${(t) => e.onSearchChange(t.target.value)}
                          />
                          ${
                            e.searchQuery
                              ? y`
                                <button
                                  class="config-search__clear"
                                  aria-label=${N(`configView.clearSearch`)}
                                  @click=${() => e.onSearchChange(``)}
                                >
                                  ×
                                </button>
                              `
                              : x
                          }
                        </div>
                      </div>
                    `
                    : x
                }

                <wa-tab-group
                  class="config-top-tabs__scroller"
                  activation="manual"
                  .active=${e.activeSection ?? `root`}
                  aria-label="${N(`common.settingsSections`)}"
                  @wa-tab-show=${(t) => {
                    let n = t.detail.name === `root` ? null : t.detail.name;
                    (e.onSectionChange(n), p(t.currentTarget));
                  }}
                >
                  ${S.map(
                    (t) => y`
                      <wa-tab
                        slot="nav"
                        id=${mn(t.key)}
                        class="config-top-tabs__tab"
                        panel=${t.key ?? `root`}
                        ?active=${(e.activeSection ?? `root`) === (t.key ?? `root`)}
                        aria-controls="config-section-panel"
                        title=${t.label}
                      >
                        ${t.label}
                      </wa-tab>
                    `,
                  )}
                </wa-tab-group>
              </div>
            `
        }
        ${
          i === `invalid` && !t.validityDismissed
            ? y`
              <div class="config-validity-warning">
                <svg
                  class="config-validity-warning__icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  width="16"
                  height="16"
                >
                  <path
                    d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                  ></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <span class="config-validity-warning__text">${N(`configView.invalidConfig`)}</span>
                <button
                  class="btn btn--sm"
                  @click=${() => {
                    ((t.validityDismissed = !0), f());
                  }}
                >
                  ${N(`configView.dismissWarning`)}
                </button>
              </div>
            `
            : x
        }

        <!-- Diff panel -->
        ${
          E && d === `form`
            ? y`
              <details class="config-diff">
                <summary class="config-diff__summary">
                  <span
                    >${N(C.length === 1 ? `configView.viewPendingChange` : `configView.viewPendingChanges`, { count: String(C.length) })}</span
                  >
                  <svg
                    class="config-diff__chevron"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </summary>
                <div class="config-diff__content">
                  ${C.map(
                    (t) => y`
                      <div class="config-diff__item">
                        <div class="config-diff__path">${K(t.path)}</div>
                        <div class="config-diff__values">
                          <span class="config-diff__from"
                            >${Cn(t.path, t.from, e.uiHints)}</span
                          >
                          <span class="config-diff__arrow">→</span>
                          <span class="config-diff__to"
                            >${Cn(t.path, t.to, e.uiHints)}</span
                          >
                        </div>
                      </div>
                    `,
                  )}
                </div>
              </details>
            `
            : x
        }
        ${
          w && d === `raw`
            ? y`
              <details
                class="config-diff"
                ?open=${t.rawDiffOpen}
                @toggle=${(e) => {
                  let n = e.target;
                  t.rawDiffOpen !== n.open &&
                    ((t.rawDiffOpen = n.open), n.open || (t.rawDiffCache = void 0), f());
                }}
              >
                <summary class="config-diff__summary">
                  <span>${N(`configView.viewPendingChangesRaw`)}</span>
                  <svg
                    class="config-diff__chevron"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </summary>
                <div class="config-diff__content">
                  ${
                    T.length > 0
                      ? T.map(
                          (n) => y`
                          <div class="config-diff__item">
                            <div class="config-diff__path">
                              ${K(n.path)}
                            </div>
                            <div class="config-diff__values">
                              <span class="config-diff__from"
                                >${Dn(n.path, n.from, e.uiHints, t.rawRevealed)}</span
                              >
                              <span class="config-diff__arrow">→</span>
                              <span class="config-diff__to"
                                >${Dn(n.path, n.to, e.uiHints, t.rawRevealed)}</span
                              >
                            </div>
                          </div>
                        `,
                        )
                      : y`
                        <div class="config-diff__item">${N(`configView.rawDiffUnavailable`)}</div>
                      `
                  }
                </div>
              </details>
            `
            : x
        }
        <!-- Form content -->
        <wa-tab-panel
          id="config-section-panel"
          class="config-content"
          name=${e.activeSection}
          active
          aria-labelledby=${mn(e.activeSection)}
        >
          ${
            e.activeSection === `__appearance__`
              ? a
                ? Nn(e)
                : x
              : e.activeSection === `__notifications__`
                ? a
                  ? An(e)
                  : x
                : d === `form`
                  ? y`
                    ${
                      l && n && u
                        ? y`
                          <div class="callout info" style="margin-bottom: 12px">
                            ${N(`configView.formUnsafe`)}
                          </div>
                        `
                        : x
                    }
                    ${le ? Nn(e) : x}
                    ${
                      e.schemaLoading
                        ? y`
                          <div class="config-loading">
                            <div class="config-loading__spinner"></div>
                            <span>${N(`configView.loadingSchema`)}</span>
                          </div>
                        `
                        : ht({
                            schema: c.schema,
                            uiHints: e.uiHints,
                            value: e.formValue,
                            rawAvailable: u,
                            disabled: D || !e.formValue,
                            unsupportedPaths: c.unsupportedPaths,
                            onPatch: e.onFormPatch,
                            searchQuery: e.searchQuery,
                            activeSection: e.activeSection,
                            activeSubsection: null,
                            sectionActions:
                              e.activeSection === `env`
                                ? y`
                                  <button
                                    class="btn btn--sm ${h ? `active` : ``}"
                                    aria-pressed=${h ? `true` : `false`}
                                    title=${N(h ? `configView.hideEnvValues` : `configView.revealEnvValues`)}
                                    @click=${() => {
                                      ((t.envRevealed = !t.envRevealed), f());
                                    }}
                                  >
                                    ${h ? F.eyeOff : F.eye}
                                    ${N(`configView.peek`)}
                                  </button>
                                `
                                : void 0,
                            revealSensitive: e.activeSection === `env` ? h : !1,
                            isSensitivePathRevealed: (e) => In(t, e),
                            onToggleSensitivePath: (e) => {
                              (Ln(t, e), f());
                            },
                          })
                    }
                  `
                  : (() => {
                      let n = nt(e.formValue, [], e.uiHints),
                        r = n > 0 && !t.rawRevealed;
                      return y`
                      <div class="field config-raw-field">
                        <span style="display:flex;align-items:center;gap:8px;">
                          ${N(`configView.rawConfig`)}
                          ${
                            n > 0
                              ? y`
                                <span class="settings-count"
                                  >${N(n === 1 ? `configView.secretCount` : `configView.secretCountPlural`, { count: String(n) })}
                                  ${N(r ? `configView.redacted` : `configView.visible`)}</span
                                >
                                <openclaw-tooltip
                                  .content=${N(r ? `configView.revealSensitive` : `configView.hideSensitive`)}
                                >
                                  <button
                                    class="btn btn--icon config-raw-toggle ${r ? `` : `active`}"
                                    aria-label=${N(`configView.toggleRawRedaction`)}
                                    aria-pressed=${!r}
                                    @click=${() => {
                                      ((t.rawRevealed = !t.rawRevealed), f());
                                    }}
                                  >
                                    ${r ? F.eyeOff : F.eye}
                                  </button>
                                </openclaw-tooltip>
                              `
                              : x
                          }
                        </span>
                        ${
                          r
                            ? y`
                              <div class="callout info" style="margin-top: 12px">
                                ${N(n === 1 ? `configView.sensitiveHidden` : `configView.sensitiveHiddenPlural`, { count: String(n) })}
                              </div>
                            `
                            : y`
                              <textarea
                                placeholder=${N(`configView.rawConfig`)}
                                .value=${e.raw}
                                ?disabled=${D}
                                @input=${(t) => {
                                  e.onRawChange(t.target.value);
                                }}
                              ></textarea>
                            `
                        }
                      </div>
                    `;
                    })()
          }
        </wa-tab-panel>

        ${
          e.issues.length > 0
            ? y`<div class="callout danger" style="margin-top: 12px;">
              <pre class="code-block">${JSON.stringify(e.issues, null, 2)}</pre>
            </div>`
            : x
        }
      </main>
    </div>
  `;
}
var zn,
  J,
  Y,
  Bn,
  X,
  Vn,
  Z,
  Hn,
  Un,
  Wn,
  Gn = e(() => {
    (ie(),
      Be(),
      b(),
      Me(),
      rt(),
      qe(),
      _t(),
      Ge(),
      ot(),
      V(),
      P(),
      pn(),
      c(),
      (zn = {
        90: `configView.textSizes.small`,
        100: `configView.textSizes.default`,
        110: `configView.textSizes.large`,
        125: `configView.textSizes.xl`,
        140: `configView.textSizes.xxl`,
      }),
      (J = {
        all: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  `,
        env: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="3"></circle>
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      ></path>
    </svg>
  `,
        update: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  `,
        agents: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"
      ></path>
      <circle cx="8" cy="14" r="1"></circle>
      <circle cx="16" cy="14" r="1"></circle>
    </svg>
  `,
        auth: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  `,
        channels: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `,
        messages: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  `,
        commands: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  `,
        hooks: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  `,
        skills: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      ></polygon>
    </svg>
  `,
        tools: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      ></path>
    </svg>
  `,
        gateway: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,
        wizard: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M15 4V2"></path>
      <path d="M15 16v-2"></path>
      <path d="M8 9h2"></path>
      <path d="M20 9h2"></path>
      <path d="M17.8 11.8 19 13"></path>
      <path d="M15 9h0"></path>
      <path d="M17.8 6.2 19 5"></path>
      <path d="m3 21 9-9"></path>
      <path d="M12.2 6.2 11 5"></path>
    </svg>
  `,
        meta: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
    </svg>
  `,
        logging: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  `,
        browser: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="4"></circle>
      <line x1="21.17" y1="8" x2="12" y2="8"></line>
      <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
      <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
    </svg>
  `,
        ui: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="9" y1="21" x2="9" y2="9"></line>
    </svg>
  `,
        models: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
      ></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  `,
        bindings: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
      <line x1="6" y1="6" x2="6.01" y2="6"></line>
      <line x1="6" y1="18" x2="6.01" y2="18"></line>
    </svg>
  `,
        broadcast: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
      <circle cx="12" cy="12" r="2"></circle>
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
    </svg>
  `,
        audio: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
  `,
        session: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  `,
        cron: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  `,
        web: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,
        discovery: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  `,
        canvasHost: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  `,
        talk: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="23"></line>
      <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
  `,
        plugins: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2v6"></path>
      <path d="m4.93 10.93 4.24 4.24"></path>
      <path d="M2 12h6"></path>
      <path d="m4.93 13.07 4.24-4.24"></path>
      <path d="M12 22v-6"></path>
      <path d="m19.07 13.07-4.24-4.24"></path>
      <path d="M22 12h-6"></path>
      <path d="m19.07 10.93-4.24 4.24"></path>
    </svg>
  `,
        diagnostics: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  `,
        cli: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  `,
        secrets: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"
      ></path>
    </svg>
  `,
        acp: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  `,
        mcp: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
      <line x1="6" y1="6" x2="6.01" y2="6"></line>
      <line x1="6" y1="18" x2="6.01" y2="18"></line>
    </svg>
  `,
        __appearance__: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  `,
        __notifications__: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
  `,
        default: y`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>
  `,
      }),
      (Y = [
        {
          id: `core`,
          sections: [`env`, `auth`, `update`, `meta`, `logging`, `diagnostics`, `cli`, `secrets`],
        },
        { id: `ai`, sections: [`agents`, `models`, `skills`, `tools`, `memory`, `session`] },
        {
          id: `communication`,
          sections: [`channels`, `messages`, `broadcast`, `__notifications__`, `talk`, `audio`],
        },
        {
          id: `automation`,
          sections: [`commands`, `hooks`, `bindings`, `cron`, `approvals`, `plugins`],
        },
        {
          id: `infrastructure`,
          sections: [
            `gateway`,
            `web`,
            `browser`,
            `nodeHost`,
            `canvasHost`,
            `discovery`,
            `media`,
            `acp`,
            `mcp`,
          ],
        },
        { id: `appearance`, sections: [`__appearance__`, `ui`, `wizard`] },
      ]),
      (Bn = new Set(Y.flatMap((e) => e.sections))),
      (X = 64),
      (Vn = 2e4),
      (Z = 1e3),
      (Hn = 2e3),
      (Un = 2e5),
      (Wn = [
        {
          id: `claw`,
          labelKey: `configView.themes.claw.label`,
          descriptionKey: `configView.themes.claw.description`,
          icon: F.zap,
        },
        {
          id: `knot`,
          labelKey: `configView.themes.knot.label`,
          descriptionKey: `configView.themes.knot.description`,
          icon: F.link,
        },
        {
          id: `dash`,
          labelKey: `configView.themes.dash.label`,
          descriptionKey: `configView.themes.dash.description`,
          icon: F.barChart,
        },
      ]));
  });
function Kn(e) {
  return (
    e instanceof je &&
    e.gatewayCode === `INVALID_REQUEST` &&
    e.message.includes(`unknown method: system.info`)
  );
}
function qn(e) {
  return e?.features?.methods?.includes(`system.info`) === !0;
}
function Q(e) {
  switch (e) {
    case `communications`:
      return { activeSection: `messages`, activeSubsection: null };
    case `appearance`:
      return { activeSection: `__appearance__`, activeSubsection: null };
    case `automation`:
      return { activeSection: `commands`, activeSubsection: null };
    case `mcp`:
      return { activeSection: `mcp`, activeSubsection: null };
    case `infrastructure`:
      return { activeSection: `gateway`, activeSubsection: null };
    case `ai-agents`:
      return { activeSection: `agents`, activeSubsection: null };
    case `config`:
      return { activeSection: null, activeSubsection: null };
  }
  throw Error(`Unknown config page`);
}
function Jn(e, t, n) {
  let r = s(e) ?? null;
  return e === `config` && t && a.has(t)
    ? { activeSection: null, activeSubsection: null }
    : r && (!t || !r.includes(t))
      ? Q(e)
      : { activeSection: t, activeSubsection: n };
}
function Yn(e, t) {
  let n = new URLSearchParams(t).get(`section`);
  return n ? Jn(e, n, null) : Q(e);
}
function Xn(e) {
  return N(e === `config` ? `nav.settingsGeneral` : `tabs.${tr[e]}`);
}
function Zn(e) {
  let t = C(C(e)?.mcp)?.servers;
  return t && typeof t == `object` && !Array.isArray(t) ? Object.keys(t).length : 0;
}
function Qn(e) {
  let t = C(C(e)?.channels) ?? {},
    n = Object.keys(t).filter((e) => e.trim().length > 0),
    r = n.length > 0 ? n.toSorted((e, t) => e.localeCompare(t)) : nr.map(({ id: e }) => e),
    i = new Map(nr.map(({ id: e, labelKey: t }) => [e, N(t)]));
  return r.map((e) => {
    let n = t[e],
      r = !!(n && typeof n == `object` && Object.keys(n).length);
    return {
      id: e,
      label: i.get(e) ?? e.replace(/[-_]+/g, ` `).replace(/\b\w/g, (e) => e.toUpperCase()),
      connected: r,
      detail: r ? N(`common.configured`) : void 0,
    };
  });
}
function $n(e) {
  let t = C(e?.configForm) ?? C(e);
  if (!t)
    return {
      gatewayAuth: `unknown`,
      execPolicy: `unknown`,
      deviceAuth: !1,
      browserEnabled: !0,
      toolProfile: `full`,
    };
  let n = C(t.gateway),
    r = C(n?.auth),
    i = C(t.tools) ?? {},
    a = C(i.exec) ?? {},
    o = C(t.browser),
    s = C(n?.controlUi),
    c = `unknown`;
  r &&
    (c =
      (typeof r.mode == `string` ? r.mode.trim() : ``) ||
      (r.password ? `password` : r.token ? `token` : r.trustedProxy ? `trusted-proxy` : `none`));
  let l = i.profile,
    u = a.security;
  return {
    gatewayAuth: c,
    execPolicy: typeof u == `string` && u.trim() ? u.trim() : `allowlist`,
    deviceAuth: s?.dangerouslyDisableDeviceAuth !== !0,
    browserEnabled: o?.enabled !== !1,
    toolProfile: typeof l == `string` && l.trim() ? l.trim() : `full`,
  };
}
function er(e) {
  typeof document > `u` ||
    document.documentElement.style.setProperty(`--control-ui-text-scale`, (M(e) / 100).toFixed(2));
}
var tr, nr, rr, $;
e(() => {
  (ee(),
    ae(),
    b(),
    ne(),
    Ie(),
    ye(),
    Le(),
    Se(),
    Ce(),
    Me(),
    Pe(),
    Ee(),
    V(),
    ct(),
    P(),
    E(),
    se(),
    he(),
    le(),
    vt(),
    f(),
    At(),
    dn(),
    l(),
    Gn(),
    t(),
    (tr = {
      config: `config`,
      communications: `communications`,
      appearance: `appearance`,
      automation: `automation`,
      mcp: `mcp`,
      infrastructure: `infrastructure`,
      "ai-agents": `aiAgents`,
    }),
    (nr = [
      { id: `telegram`, labelKey: `configPage.channels.telegram` },
      { id: `discord`, labelKey: `configPage.channels.discord` },
      { id: `slack`, labelKey: `configPage.channels.slack` },
      { id: `whatsapp`, labelKey: `configPage.channels.whatsapp` },
      { id: `signal`, labelKey: `configPage.channels.signal` },
      { id: `imessage`, labelKey: `configPage.channels.imessage` },
    ]),
    (rr = 1e4),
    ($ = class extends de {
      constructor(...e) {
        (super(...e),
          (this.pageId = `config`),
          (this.routeData = null),
          (this.settings = j()),
          (this.settingsMode = `quick`),
          (this.systemInfo = null),
          (this.systemInfoUnavailable = !1),
          (this.microphoneDevices = []),
          (this.microphoneLoading = !1),
          (this.microphoneError = null),
          (this.microphoneLoaded = !1),
          (this.formModes = {
            config: `form`,
            communications: `form`,
            appearance: `form`,
            automation: `form`,
            mcp: `form`,
            infrastructure: `form`,
            "ai-agents": `form`,
          }),
          (this.searchQueries = {
            config: ``,
            communications: ``,
            appearance: ``,
            automation: ``,
            mcp: ``,
            infrastructure: ``,
            "ai-agents": ``,
          }),
          (this.selections = {
            config: Q(`config`),
            communications: Q(`communications`),
            appearance: Q(`appearance`),
            automation: Q(`automation`),
            mcp: Q(`mcp`),
            infrastructure: Q(`infrastructure`),
            "ai-agents": Q(`ai-agents`),
          }),
          (this.customThemeImportUrl = ``),
          (this.customThemeImportBusy = !1),
          (this.customThemeImportMessage = null),
          (this.customThemeImportExpanded = !1),
          (this.customThemeImportFocusToken = 0),
          (this.customThemeImportSelectOnSuccess = !1),
          (this.configViewState = hn()),
          (this.runtimeConfigSource = null),
          (this.systemInfoGatewaySource = null),
          (this.systemInfoClient = null),
          (this.systemInfoLoading = !1),
          (this.systemInfoRequestId = 0),
          (this.systemInfoPolling = new fe(
            this,
            rr,
            () => {
              this.loadSystemInfo();
            },
            !1,
          )),
          (this.pendingRouteTargetId = null),
          (this.subscriptions = new ce(this)
            .watch(
              () => this.context?.runtimeConfig,
              (e, t) => e.subscribe(t),
              (e) => this.synchronizeRuntimeConfig(e),
            )
            .watch(
              () => this.context?.overlays,
              (e, t) => e.subscribe(t),
            )
            .watch(
              () => this.context?.config,
              (e, t) => e.subscribe(t),
            )
            .watch(
              () => this.context?.gateway,
              (e, t) => e.subscribe(t),
              (e) => this.synchronizeSystemInfoGateway(e),
            )
            .watch(
              () => this.context?.webPush,
              (e, t) => e.subscribe(t),
            )
            .watch(
              () => this.context?.theme,
              (e, t) => e.subscribe(t),
              () => {
                this.settings = j();
              },
            )));
      }
      connectedCallback() {
        (super.connectedCallback(), (this.settings = j()), this.syncRouteData());
      }
      disconnectedCallback() {
        (this.systemInfoPolling.stop(),
          this.invalidateSystemInfoRequest(),
          (this.runtimeConfigSource = null),
          this.resetConfigViewState(),
          (this.systemInfoGatewaySource = null),
          (this.systemInfoClient = null),
          this.subscriptions.clear(),
          super.disconnectedCallback());
      }
      willUpdate(e) {
        (e.has(`pageId`) || e.has(`routeData`)) && this.syncRouteData();
      }
      updated(e) {
        let t = e.has(`pageId`) && e.get(`pageId`) !== void 0,
          n = e.has(`settingsMode`) && e.get(`settingsMode`) !== void 0;
        ((t || n) && this.invalidateSystemInfoRequest(),
          this.syncSystemInfoPolling(),
          this.scrollToPendingRouteTarget(),
          this.pageId === `appearance` &&
            !this.microphoneLoaded &&
            ((this.microphoneLoaded = !0), this.refreshMicrophones(!1)));
      }
      async refreshMicrophones(e) {
        ((this.microphoneLoading = !0), (this.microphoneError = null));
        try {
          let t = await yt(e);
          ((this.microphoneDevices = t.devices), (this.microphoneError = t.warning));
        } catch (e) {
          this.microphoneError = e instanceof Error ? e.message : String(e);
        } finally {
          this.microphoneLoading = !1;
        }
      }
      syncRouteData() {
        let e = this.routeData
          ? Jn(this.pageId, this.routeData.section, null)
          : Yn(this.pageId, globalThis.location?.search ?? ``);
        this.selections = { ...this.selections, [this.pageId]: e };
        let t = this.routeData?.targetBlockId ?? h(globalThis.location?.hash ?? ``);
        ((this.pendingRouteTargetId = t),
          this.pageId === `config` &&
            (this.routeData?.section
              ? (this.settingsMode = `advanced`)
              : t?.startsWith(`settings-general-`) && (this.settingsMode = `quick`)));
      }
      scrollToPendingRouteTarget() {
        let e = this.pendingRouteTargetId;
        if (!e) return;
        let t = [...this.renderRoot.querySelectorAll(`[id]`)].find((t) => t.id === e);
        t &&
          (t.scrollIntoView?.({ behavior: `smooth`, block: `start` }),
          (this.pendingRouteTargetId = null));
      }
      isSystemInfoVisible() {
        return this.pageId === `config` && this.settingsMode === `quick`;
      }
      synchronizeRuntimeConfig(e) {
        e !== this.runtimeConfigSource &&
          ((this.runtimeConfigSource = e), this.resetConfigViewState());
        let t = e.state;
        if (!t.configSnapshot && !t.configLoading) {
          e.ensureLoaded()
            .then(() => (this.runtimeConfigSource === e ? e.ensureSchemaLoaded() : void 0))
            .catch(() => void 0);
          return;
        }
        !t.configSchema && !t.configSchemaLoading && e.ensureSchemaLoaded().catch(() => void 0);
      }
      synchronizeSystemInfoGateway(e) {
        (e !== this.systemInfoGatewaySource &&
          (this.systemInfoPolling.stop(),
          this.invalidateSystemInfoRequest(),
          (this.systemInfoGatewaySource = e),
          this.resetConfigViewState(),
          (this.systemInfoClient = null),
          (this.systemInfo = null),
          (this.systemInfoUnavailable = !1)),
          this.handleSystemInfoGatewaySnapshot(e.snapshot));
      }
      resetConfigViewState() {
        this.configViewState = hn();
      }
      handleSystemInfoGatewaySnapshot(e) {
        let t = e.client !== this.systemInfoClient,
          n = qn(e.hello);
        ((this.systemInfoClient = e.client),
          t
            ? (this.invalidateSystemInfoRequest(),
              (this.systemInfo = null),
              (this.systemInfoUnavailable = !1))
            : e.connected || (this.invalidateSystemInfoRequest(), (this.systemInfo = null)),
          e.connected &&
            e.hello &&
            ((this.systemInfoUnavailable = !n),
            n || (this.invalidateSystemInfoRequest(), (this.systemInfo = null))),
          this.syncSystemInfoPolling());
      }
      syncSystemInfoPolling() {
        let e = this.context.gateway.snapshot;
        if (
          !(
            this.isConnected &&
            this.isSystemInfoVisible() &&
            !this.systemInfoUnavailable &&
            e.connected &&
            qn(e.hello) &&
            e.client != null
          )
        ) {
          this.systemInfoPolling.stop();
          return;
        }
        this.systemInfoPolling.start() && this.loadSystemInfo();
      }
      invalidateSystemInfoRequest() {
        ((this.systemInfoRequestId += 1), (this.systemInfoLoading = !1));
      }
      isCurrentSystemInfoRequest(e, t, n) {
        let r = n.snapshot;
        return (
          this.isConnected &&
          this.isSystemInfoVisible() &&
          e === this.systemInfoRequestId &&
          this.systemInfoGatewaySource === n &&
          this.context.gateway === n &&
          r.connected &&
          r.client === t
        );
      }
      async loadSystemInfo() {
        let e = this.systemInfoGatewaySource;
        if (!e || e !== this.context.gateway) return;
        let t = e.snapshot,
          n = t.client;
        if (
          !t.connected ||
          !n ||
          !this.isSystemInfoVisible() ||
          this.systemInfoUnavailable ||
          this.systemInfoLoading
        )
          return;
        let r = ++this.systemInfoRequestId;
        this.systemInfoLoading = !0;
        try {
          let t = await n.request(`system.info`, {});
          if (!this.isCurrentSystemInfoRequest(r, n, e)) return;
          this.systemInfo = t;
        } catch (t) {
          if (!this.isCurrentSystemInfoRequest(r, n, e)) return;
          (D(t) || Kn(t)) &&
            ((this.systemInfo = null),
            (this.systemInfoUnavailable = !0),
            this.systemInfoPolling.stop());
        } finally {
          this.isCurrentSystemInfoRequest(r, n, e) && (this.systemInfoLoading = !1);
        }
      }
      navigate(e) {
        this.context.navigate(e);
      }
      setFormMode(e) {
        this.formModes = { ...this.formModes, [this.pageId]: e };
      }
      setSearchQuery(e) {
        this.searchQueries = { ...this.searchQueries, [this.pageId]: e };
      }
      setActiveSection(e) {
        this.selections = {
          ...this.selections,
          [this.pageId]: { activeSection: e, activeSubsection: null },
        };
      }
      setActiveSubsection(e) {
        this.selections = {
          ...this.selections,
          [this.pageId]: { ...this.selections[this.pageId], activeSubsection: e },
        };
      }
      applySettings(e) {
        ((this.settings = Oe({
          theme: e.theme,
          themeMode: e.themeMode,
          customTheme: e.customTheme,
          textScale: e.textScale,
          chatSendShortcut: e.chatSendShortcut,
          catalogOpenTarget: e.catalogOpenTarget,
          realtimeTalkInputDeviceId: e.realtimeTalkInputDeviceId,
          lobsterPetVisits: e.lobsterPetVisits,
          lobsterPetSounds: e.lobsterPetSounds,
        })),
          er(this.settings.textScale),
          this.context.theme.refresh());
      }
      setLocale(e) {
        ((this.settings = Oe({ locale: e })), He.setLocale(e));
      }
      setTheme(e, t) {
        let n = A(this.settings.theme, this.settings.themeMode),
          r = { ...this.settings, theme: e };
        Re({
          currentTheme: n,
          nextTheme: A(r.theme, r.themeMode),
          context: t,
          applyTheme: () => this.applySettings(r),
        });
      }
      setThemeMode(e, t) {
        let n = A(this.settings.theme, this.settings.themeMode),
          r = { ...this.settings, themeMode: e };
        Re({
          currentTheme: n,
          nextTheme: A(r.theme, r.themeMode),
          context: t,
          applyTheme: () => this.applySettings(r),
        });
      }
      setSetting(e, t) {
        this.applySettings({ ...this.settings, [e]: t });
      }
      selectMicrophone(e) {
        this.applySettings({ ...this.settings, realtimeTalkInputDeviceId: e.trim() || void 0 });
      }
      openCustomThemeImport() {
        ((this.customThemeImportExpanded = !0),
          (this.customThemeImportFocusToken += 1),
          this.settings.customTheme || (this.customThemeImportSelectOnSuccess = !0));
      }
      async importCustomTheme() {
        if (!this.customThemeImportBusy) {
          ((this.customThemeImportExpanded = !0),
            (this.customThemeImportBusy = !0),
            (this.customThemeImportMessage = null));
          try {
            let e = await ve(this.customThemeImportUrl),
              t = !this.settings.customTheme || this.customThemeImportSelectOnSuccess;
            (this.applySettings({
              ...this.settings,
              customTheme: e,
              theme: t ? `custom` : this.settings.theme,
            }),
              (this.customThemeImportUrl = ``),
              (this.customThemeImportSelectOnSuccess = !1),
              (this.customThemeImportMessage = {
                kind: `success`,
                text: N(`configPage.themeImported`, { name: e.label }),
              }));
          } catch (e) {
            this.customThemeImportMessage = {
              kind: `error`,
              text: e instanceof Error ? e.message : String(e),
            };
          } finally {
            this.customThemeImportBusy = !1;
          }
        }
      }
      clearCustomTheme() {
        ((this.customThemeImportExpanded = !0),
          (this.customThemeImportSelectOnSuccess = !1),
          this.applySettings({
            ...this.settings,
            theme: this.settings.theme === `custom` ? `claw` : this.settings.theme,
            customTheme: void 0,
          }),
          (this.customThemeImportMessage = {
            kind: `success`,
            text: N(`configPage.themeRemoved`),
          }));
      }
      includeSections() {
        return s(this.pageId);
      }
      isUpdateBusy() {
        let e = this.context.overlays.snapshot;
        return e.updateRunning || e.updateReconciliationPending;
      }
      renderAdvancedConfig(e) {
        let t = this.context.runtimeConfig,
          n = t.state,
          r = this.includeSections(),
          a = this.pageId === `config` ? [...u, ...p, ...o, ...i, `ui`, `wizard`] : void 0,
          s = Jn(
            this.pageId,
            this.selections[this.pageId].activeSection,
            this.selections[this.pageId].activeSubsection,
          ),
          c = this.pageId === `mcp` ? `mcp` : s.activeSection,
          l = this.pageId === `mcp` ? null : s.activeSubsection,
          d = {
            raw: n.configRaw,
            originalRaw: n.configRawOriginal,
            valid: n.configValid,
            issues: n.configIssues,
            loading: n.configLoading,
            saving: n.configSaving,
            applying: n.configApplying,
            updating: this.isUpdateBusy(),
            connected: n.connected,
            schema: n.configSchema,
            schemaLoading: n.configSchemaLoading,
            uiHints: n.configUiHints,
            formMode: this.formModes[this.pageId],
            viewState: this.configViewState,
            rawAvailable: !!(n.configSnapshot?.config || n.configForm || n.configRaw),
            showModeToggle: this.pageId === `config`,
            formValue: n.configForm,
            originalValue: n.configFormOriginal,
            searchQuery: this.searchQueries[this.pageId],
            activeSection: c,
            activeSubsection: l,
            onRawChange: (e) => t.setRaw(e),
            onFormModeChange: (e) => this.setFormMode(e),
            onViewStateChange: () => this.requestUpdate(),
            onFormPatch: (e, n) => t.patchForm(e, n),
            onSearchChange: (e) => this.setSearchQuery(e),
            onSectionChange: (e) => this.setActiveSection(e),
            onSubsectionChange: (e) => this.setActiveSubsection(e),
            onReload: () => void t.refresh({ discardPendingChanges: !0 }),
            onReset: () => t.resetDraft(),
            onSave: () => void t.save(),
            onApply: () => void t.apply(),
            onUpdate: () => void this.context.overlays.runUpdate(),
            onOpenFile: () => void t.openFile(),
            version:
              this.context.config.current.serverVersion ??
              this.context.gateway.snapshot.hello?.server?.version ??
              ``,
            theme: this.settings.theme,
            themeMode: this.settings.themeMode,
            setTheme: (e, t) => this.setTheme(e, t),
            setThemeMode: (e, t) => this.setThemeMode(e, t),
            hasCustomTheme: !!this.settings.customTheme,
            customThemeLabel: this.settings.customTheme?.label ?? null,
            customThemeSourceUrl: this.settings.customTheme?.sourceUrl ?? null,
            customThemeImportUrl: this.customThemeImportUrl,
            customThemeImportBusy: this.customThemeImportBusy,
            customThemeImportMessage: this.customThemeImportMessage,
            customThemeImportExpanded: this.customThemeImportExpanded,
            customThemeImportFocusToken: this.customThemeImportFocusToken,
            onCustomThemeImportUrlChange: (e) => {
              ((this.customThemeImportUrl = e),
                this.customThemeImportMessage?.kind === `error` &&
                  (this.customThemeImportMessage = null));
            },
            onImportCustomTheme: () => void this.importCustomTheme(),
            onClearCustomTheme: () => this.clearCustomTheme(),
            onOpenCustomThemeImport: () => this.openCustomThemeImport(),
            textScale: this.settings.textScale ?? 100,
            setTextScale: (e) => this.setSetting(`textScale`, M(e)),
            chatSendShortcut: Ne(this.settings.chatSendShortcut),
            setChatSendShortcut: (e) => this.setSetting(`chatSendShortcut`, e),
            catalogOpenTarget: Fe(this.settings.catalogOpenTarget),
            setCatalogOpenTarget: (e) => this.setSetting(`catalogOpenTarget`, e),
            microphone: {
              devices: this.microphoneDevices,
              selectedDeviceId: this.settings.realtimeTalkInputDeviceId ?? ``,
              loading: this.microphoneLoading,
              error: this.microphoneError,
            },
            onMicrophoneRefresh: () => void this.refreshMicrophones(!0),
            onMicrophoneSelect: (e) => this.selectMicrophone(e),
            gatewayUrl: this.context.gateway.connection.gatewayUrl,
            assistantName: this.context.config.current.assistantIdentity.name,
            configPath: n.configSnapshot?.path ?? null,
            navRootLabel: this.pageId === `config` ? void 0 : Xn(this.pageId),
            showRootTab: !r?.length,
            includeSections: r ? [...r] : void 0,
            excludeSections: a,
            includeVirtualSections:
              this.pageId === `communications` || this.pageId === `appearance`,
            settingsLayout: this.pageId === `config` ? `accordion` : void 0,
            webPush: this.context.webPush.snapshot,
            onWebPushSubscribe: () => void this.context.webPush.enable(),
            onWebPushUnsubscribe: () => void this.context.webPush.disable(),
            onWebPushTest: () => void this.context.webPush.sendTest(),
          };
        return this.pageId === `mcp`
          ? kt({
              configObject: e,
              configDirty: n.configFormDirty,
              configSaving: n.configSaving,
              configApplying: n.configApplying,
              connected: n.connected,
              pluginsHref: De(`plugins`, this.context.basePath),
              onSaveConfig: () => void t.save(),
              onApplyConfig: () => void t.apply(),
              editor: Rn({
                ...d,
                activeSection: `mcp`,
                activeSubsection: null,
                showModeToggle: !1,
                includeSections: [`mcp`],
                navRootLabel: `MCP`,
              }),
            })
          : Rn(d);
      }
      renderQuickConfig(e) {
        let t = this.context.runtimeConfig,
          n = C(C(e.agents)?.defaults),
          r = typeof n?.model == `string` ? n.model : `default`,
          i = typeof n?.thinkingDefault == `string` ? n.thinkingDefault : `off`,
          a = n?.fastMode,
          o = this.context.config.current;
        return on({
          locale: Ue(this.settings.locale) ? this.settings.locale : He.getLocale(),
          onLocaleChange: (e) => this.setLocale(e),
          currentModel: r,
          thinkingLevel: i,
          fastMode: a === `auto` || typeof a == `boolean` ? a : !1,
          channels: Qn(e),
          automation: { cronJobCount: 0, skillCount: 0, mcpServerCount: Zn(e) },
          security: $n(e),
          systemInfo: this.systemInfo,
          systemInfoUnavailable: this.systemInfoUnavailable,
          theme: this.settings.theme,
          themeMode: this.settings.themeMode,
          hasCustomTheme: !!this.settings.customTheme,
          customThemeLabel: this.settings.customTheme?.label,
          textScale: this.settings.textScale ?? 100,
          setTheme: (e, t) => this.setTheme(e, t),
          setThemeMode: (e, t) => this.setThemeMode(e, t),
          onModelChange: () => {
            ((this.settingsMode = `advanced`),
              (this.selections = {
                ...this.selections,
                "ai-agents": { activeSection: `models`, activeSubsection: null },
              }),
              this.navigate(`ai-agents`));
          },
          setTextScale: (e) => this.setSetting(`textScale`, M(e)),
          lobsterPetVisits: this.settings.lobsterPetVisits !== !1,
          setLobsterPetVisits: (e) => this.applySettings({ ...this.settings, lobsterPetVisits: e }),
          lobsterPetSounds: this.settings.lobsterPetSounds === !0,
          setLobsterPetSounds: (e) => this.applySettings({ ...this.settings, lobsterPetSounds: e }),
          onOpenCustomThemeImport: () => {
            ((this.pageId = `appearance`),
              this.setFormMode(`form`),
              this.setSearchQuery(``),
              (this.selections = {
                ...this.selections,
                appearance: { activeSection: `__appearance__`, activeSubsection: null },
              }),
              this.openCustomThemeImport());
          },
          connected: t.state.connected,
          gatewayUrl: this.context.gateway.connection.gatewayUrl,
          assistantName: o.assistantIdentity.name,
          version: o.serverVersion ?? this.context.gateway.snapshot.hello?.server?.version ?? ``,
          configDirty: t.state.configFormDirty,
          configLoading: t.state.configLoading,
          configSaving: t.state.configSaving,
          configApplying: t.state.configApplying,
          configUpdating: this.isUpdateBusy(),
          configReady: !!t.state.configSnapshot?.hash,
          onResetConfig: () => t.resetDraft(),
          onSaveConfig: () => void t.save(),
          onApplyConfig: () => void t.apply(),
          onThinkingChange: (e) => t.patchForm([`agents`, `defaults`, `thinkingDefault`], e),
          onFastModeChange: (e) => t.patchForm([`agents`, `defaults`, `fastMode`], e),
          onChannelConfigure: () => this.navigate(`communications`),
          onManageCron: () => this.navigate(`cron`),
          onBrowseSkills: () => this.navigate(`skills`),
          onConfigureMcp: () => this.navigate(`mcp`),
          onSecurityConfigure: () => {
            ((this.settingsMode = `advanced`),
              (this.selections = {
                ...this.selections,
                config: { activeSection: `auth`, activeSubsection: null },
              }));
          },
          canPairDevice: t.state.connected && xe(this.context.gateway.snapshot.hello?.auth ?? null),
          onPairMobile: () => void this.context.overlays.openDevicePairSetup(),
          onBrowserEnabledToggle: (e) => t.patchForm([`browser`, `enabled`], e),
          onToolProfileChange: (e) => t.patchForm([`tools`, `profile`], e),
          assistantAvatar: o.assistantIdentity.avatar,
          assistantAvatarUrl: o.assistantIdentity.avatar,
          assistantAvatarSource: o.assistantIdentity.avatarSource,
          assistantAvatarStatus: o.assistantIdentity.avatarStatus,
          assistantAvatarReason: o.assistantIdentity.avatarReason,
          assistantAvatarOverride: null,
          basePath: this.context.basePath,
        });
      }
      renderSettingsModeToggle() {
        return this.pageId === `config`
          ? y`
      <div class="config-view-toggle">
        ${L({
          value: this.settingsMode,
          options: [
            { value: `quick`, label: N(`configPage.simple`) },
            { value: `advanced`, label: N(`configPage.advanced`) },
          ],
          ariaLabel: N(`configPage.settingsView`),
          onChange: (e) => {
            this.settingsMode = e;
          },
        })}
      </div>
    `
          : x;
      }
      render() {
        let e = this.context.runtimeConfig.state,
          t = C(e.configForm ?? e.configSnapshot?.config) ?? {},
          n =
            this.pageId === `config` && this.settingsMode === `quick`
              ? this.renderQuickConfig(t)
              : this.renderAdvancedConfig(t);
        return y`
      <section class="content-header">
        <div>
          <div class="page-title">${Xn(this.pageId)}</div>
        </div>
        ${this.renderSettingsModeToggle()}
      </section>
      ${this.pageId === `config` ? y`<div class="config-view-toggle-row">${this.renderSettingsModeToggle()}</div>` : x}
      ${st(n, this.pageId === `config` ? { id: `config-settings-panel`, ariaLabel: N(`configPage.content`) } : {})}
    `;
      }
    }),
    n([te({ context: be, subscribe: !0 })], $.prototype, `context`, void 0),
    n([v({ attribute: `page-id` })], $.prototype, `pageId`, void 0),
    n([v({ attribute: !1 })], $.prototype, `routeData`, void 0),
    n([_()], $.prototype, `settings`, void 0),
    n([_()], $.prototype, `settingsMode`, void 0),
    n([_()], $.prototype, `systemInfo`, void 0),
    n([_()], $.prototype, `systemInfoUnavailable`, void 0),
    n([_()], $.prototype, `microphoneDevices`, void 0),
    n([_()], $.prototype, `microphoneLoading`, void 0),
    n([_()], $.prototype, `microphoneError`, void 0),
    n([_()], $.prototype, `formModes`, void 0),
    n([_()], $.prototype, `searchQueries`, void 0),
    n([_()], $.prototype, `selections`, void 0),
    n([_()], $.prototype, `customThemeImportUrl`, void 0),
    n([_()], $.prototype, `customThemeImportBusy`, void 0),
    n([_()], $.prototype, `customThemeImportMessage`, void 0),
    n([_()], $.prototype, `customThemeImportExpanded`, void 0),
    n([_()], $.prototype, `customThemeImportFocusToken`, void 0),
    customElements.define(`openclaw-config-page`, $));
})();
//# sourceMappingURL=config-page-Dqk-1zkj.js.map
