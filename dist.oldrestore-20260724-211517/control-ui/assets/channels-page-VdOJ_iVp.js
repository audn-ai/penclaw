import { n as _e, s as ve, t as ye } from "./config-form-B_wZl7UD.js";
import {
  A as b,
  K as ee,
  dt as te,
  k as ne,
  nt as re,
  q as ie,
} from "./control-ui-core--EZfp09c.js";
import {
  $ as f,
  Q as p,
  Z as m,
  da as h,
  di as g,
  ea as _,
  fi as v,
  la as y,
} from "./control-ui-core-BcbHa4vB.js";
import { $ as ae, Q as C, x as w } from "./control-ui-core-CQDTaMS5.js";
import { o as x, t as S } from "./control-ui-core-CwQmiouz.js";
import { dt as a, ft as o } from "./control-ui-foundation-0uuDj0X3.js";
import { _ as t, g as n, m as r, u as i } from "./control-ui-foundation-CCDffryi.js";
import { u as oe } from "./control-ui-shared-CrnVqnQR.js";
import { G as s, Y as c, at as l, et as u, nt as d } from "./lit-runtime-DkvDG939.js";
import { a as pe, c as me, i as he, s as ge } from "./presentation-Dx9lM6Rf.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
import {
  a as le,
  l as T,
  m as ue,
  n as de,
  p as fe,
  s as E,
  t as D,
} from "./settings-ui-T0X7dZpU.js";
import { n as se, t as ce } from "./settings-workspace-DRQpceJK.js";
function be(e) {
  if (!Array.isArray(e)) return {};
  let t = {};
  for (let n of e) {
    if (typeof n != `string`) continue;
    let [e, ...r] = n.split(`:`);
    if (!e || r.length === 0) continue;
    let i = e.trim(),
      a = r.join(`:`).trim();
    i && a && (t[i] = a);
  }
  return t;
}
function O(e, t = ``) {
  return `/api/channels/nostr/${encodeURIComponent(e)}/profile${t}`;
}
async function xe(e) {
  let t = await fetch(O(e.accountId), {
    method: `PUT`,
    headers: { "Content-Type": `application/json`, ...e.headers },
    body: JSON.stringify(e.values),
  });
  return { data: await t.json().catch(() => null), response: t };
}
async function Se(e) {
  let t = await fetch(O(e.accountId, `/import`), {
    method: `POST`,
    headers: { "Content-Type": `application/json`, ...e.headers },
    body: JSON.stringify({ autoMerge: !0 }),
  });
  return { data: await t.json().catch(() => null), response: t };
}
var Ce = e(() => {});
function we(e) {
  let { values: t, original: n } = e;
  return (
    t.name !== n.name ||
    t.displayName !== n.displayName ||
    t.about !== n.about ||
    t.picture !== n.picture ||
    t.banner !== n.banner ||
    t.website !== n.website ||
    t.nip05 !== n.nip05 ||
    t.lud16 !== n.lud16
  );
}
function Te(e) {
  let { state: t, callbacks: n, accountId: r } = e,
    i = we(t),
    a = (e, r, i = {}) => {
      let { type: a = `text`, placeholder: o, maxLength: s, help: c } = i,
        u = t.values[e] ?? ``,
        f = t.fieldErrors[e],
        p = `nostr-profile-${e}`,
        m =
          a === `textarea`
            ? l`
            <textarea
              id="${p}"
              class="settings-input"
              .value=${u}
              placeholder=${o ?? ``}
              maxlength=${s ?? 2e3}
              rows="3"
              @input=${(t) => {
                let r = t.target;
                n.onFieldChange(e, r.value);
              }}
              ?disabled=${t.saving}
            ></textarea>
          `
            : l`
            <input
              id="${p}"
              class="settings-input"
              type=${a}
              .value=${u}
              placeholder=${o ?? ``}
              maxlength=${s ?? 256}
              @input=${(t) => {
                let r = t.target;
                n.onFieldChange(e, r.value);
              }}
              ?disabled=${t.saving}
            />
          `;
      return l`
      <div class="settings-row settings-row--stacked">
        <div class="settings-row__text">
          <label class="settings-row__title" for="${p}">${r}</label>
          ${c ? l`<span class="settings-row__desc">${c}</span>` : d}
          ${f ? l`<span class="settings-row__desc" style="color: var(--danger);">${f}</span>` : d}
        </div>
        <div class="settings-row__control">${m}</div>
      </div>
    `;
    };
  return l`
    <div class="settings-row">
      <div class="settings-row__text">
        <span class="settings-row__title">${x(`channels.nostr.editProfile`)}</span>
        <span class="settings-row__desc">${x(`channels.nostr.account`)}: ${r}</span>
      </div>
    </div>

    ${
      t.error
        ? l`
          <div class="settings-row">
            <div class="settings-row__text">
              <span class="settings-row__title"
                >${T({ kind: `danger`, label: x(`channels.lastError`) })}</span
              >
              <span class="settings-row__desc">${t.error}</span>
            </div>
          </div>
        `
        : d
    }
    ${
      t.success
        ? l`
          <div class="settings-row">
            <div class="settings-row__text">
              <span class="settings-row__desc">${t.success}</span>
            </div>
          </div>
        `
        : d
    }
    ${(() => {
      let e = t.values.picture;
      return e
        ? l`
      <div class="settings-row">
        <div class="settings-row__text">
          <span class="settings-row__title">${x(`channels.nostr.profilePicturePreview`)}</span>
        </div>
        <div class="settings-row__control">
          <img
            src=${e}
            alt=${x(`channels.nostr.profilePicturePreview`)}
            style="max-width: 80px; max-height: 80px; border-radius: 50%; object-fit: cover;"
            @error=${(e) => {
              let t = e.target;
              t.style.display = `none`;
            }}
            @load=${(e) => {
              let t = e.target;
              t.style.display = `block`;
            }}
          />
        </div>
      </div>
    `
        : d;
    })()}
    ${a(`name`, x(`channels.nostr.username`), { placeholder: x(`channels.nostr.placeholders.username`), maxLength: 256, help: x(`channels.nostr.usernameHelp`) })}
    ${a(`displayName`, x(`channels.nostr.displayName`), { placeholder: x(`channels.nostr.placeholders.displayName`), maxLength: 256, help: x(`channels.nostr.displayNameHelp`) })}
    ${a(`about`, x(`channels.nostr.bio`), { type: `textarea`, placeholder: x(`channels.nostr.bioPlaceholder`), maxLength: 2e3, help: x(`channels.nostr.bioHelp`) })}
    ${a(`picture`, x(`channels.nostr.avatarUrl`), { type: `url`, placeholder: x(`channels.nostr.placeholders.avatarUrl`), help: x(`channels.nostr.avatarHelp`) })}
    ${
      t.showAdvanced
        ? l`
          <div class="settings-row">
            <div class="settings-row__text">
              <span class="settings-row__title">${x(`channels.nostr.advanced`)}</span>
            </div>
          </div>

          ${a(`banner`, x(`channels.nostr.bannerUrl`), { type: `url`, placeholder: x(`channels.nostr.placeholders.bannerUrl`), help: x(`channels.nostr.bannerHelp`) })}
          ${a(`website`, x(`channels.nostr.website`), { type: `url`, placeholder: x(`channels.nostr.placeholders.website`), help: x(`channels.nostr.websiteHelp`) })}
          ${a(`nip05`, x(`channels.nostr.nip05Identifier`), { placeholder: x(`channels.nostr.placeholders.nip05`), help: x(`channels.nostr.nip05Help`) })}
          ${a(`lud16`, x(`channels.nostr.lightningAddress`), { placeholder: x(`channels.nostr.placeholders.lightningAddress`), help: x(`channels.nostr.lightningHelp`) })}
        `
        : d
    }

    <div class="settings-row">
      <div class="settings-row__text">
        ${i ? l`<span class="settings-row__desc">${x(`common.unsavedChanges`)}</span>` : d}
      </div>
      <div class="settings-row__control">
        <button
          class="btn primary"
          @click=${n.onSave}
          ?disabled=${t.saving || !i}
        >
          ${t.saving ? x(`common.saving`) : x(`common.saveAndPublish`)}
        </button>

        <button
          class="btn"
          @click=${n.onImport}
          ?disabled=${t.importing || t.saving}
        >
          ${t.importing ? x(`common.importing`) : x(`common.importFromRelays`)}
        </button>

        <button class="btn" @click=${n.onToggleAdvanced}>
          ${t.showAdvanced ? x(`common.hideAdvanced`) : x(`common.showAdvanced`)}
        </button>

        <button class="btn" @click=${n.onCancel} ?disabled=${t.saving}>
          ${x(`common.cancel`)}
        </button>
      </div>
    </div>
  `;
}
function Ee(e) {
  let t = {
    name: e?.name ?? ``,
    displayName: e?.displayName ?? ``,
    about: e?.about ?? ``,
    picture: e?.picture ?? ``,
    banner: e?.banner ?? ``,
    website: e?.website ?? ``,
    nip05: e?.nip05 ?? ``,
    lud16: e?.lud16 ?? ``,
  };
  return {
    values: t,
    original: { ...t },
    saving: !1,
    importing: !1,
    error: null,
    success: null,
    fieldErrors: {},
    showAdvanced: !!(e?.banner || e?.website || e?.nip05 || e?.lud16),
  };
}
var k = e(() => {
    (u(), D(), S());
  }),
  De = e(() => {});
function Oe(e) {
  switch (e) {
    case `telegram`:
      return {
        setupLinks: [
          { label: `@BotFather`, url: `https://t.me/BotFather` },
          { label: `web.telegram.org`, url: `https://web.telegram.org` },
        ],
      };
    case `discord`:
      return {
        setupLinks: [
          { label: `Developer Portal`, url: `https://discord.com/developers/applications` },
        ],
      };
    case `slack`:
      return { setupLinks: [{ label: `api.slack.com/apps`, url: `https://api.slack.com/apps` }] };
    case `signal`:
      return { setupLinks: [{ label: `signal-cli`, url: `https://github.com/AsamK/signal-cli` }] };
    default:
      return {};
  }
}
function ke(e) {
  return `https://docs.openclaw.ai/channels/${encodeURIComponent(e)}`;
}
function A(e, t, n) {
  let r = pe(e);
  if (r)
    return l`<span class="channels-${n}">
      <img src=${r} alt="" loading="lazy" decoding="async" />
    </span>`;
  let [i, a] = ge(e),
    o = me(t);
  return l`<span
    class="channels-${n} channels-${n}--fallback"
    style=${`--channels-art-a:${i};--channels-art-b:${a}`}
    aria-hidden="true"
  >
    <span>${o}</span>
  </span>`;
}
var j = e(() => {
  (u(), he());
});
function Ae(e, t) {
  let n = e;
  for (let e of t) {
    if (!n) return null;
    let t = oe(n);
    if (t === `object`) {
      let t = n.properties ?? {};
      if (typeof e == `string` && t[e]) {
        n = t[e];
        continue;
      }
      let r = n.additionalProperties;
      if (typeof e == `string` && r && typeof r == `object`) {
        n = r;
        continue;
      }
      return null;
    }
    if (t === `array`) {
      if (typeof e != `number`) return null;
      n = (Array.isArray(n.items) ? n.items[0] : n.items) ?? null;
      continue;
    }
    return null;
  }
  return n;
}
function je(e, t) {
  return f(e, t) ?? {};
}
function Me(e) {
  let t = N.flatMap((t) => (t in e ? [[t, e[t]]] : []));
  return t.length === 0
    ? null
    : l`
    <div>
      ${t.map(
        ([e, t]) => l`
          <div class="settings-row__desc">${e}: ${m(t)}</div>
        `,
      )}
    </div>
  `;
}
function Ne(e) {
  let t = _e(e.schema),
    n = t.schema;
  if (!n) return l`<div class="settings-row__desc">${x(`channels.config.schemaUnavailable`)}</div>`;
  let r = Ae(n, [`channels`, e.channelId]);
  if (!r)
    return l`
      <div class="settings-row__desc">${x(`channels.config.channelSchemaUnavailable`)}</div>
    `;
  let i = je(e.configValue ?? {}, e.channelId);
  return l`
    <div class="config-form">
      ${ve({ schema: r, value: i, path: [`channels`, e.channelId], hints: e.uiHints, unsupported: new Set(t.unsupportedPaths), disabled: e.disabled, showLabel: !1, onPatch: e.onPatch })}
    </div>
    ${Me(i)}
  `;
}
function M(e) {
  let { channelId: t, props: n } = e,
    r = n.configSaving || n.configSchemaLoading;
  return l`
    <div class="settings-row settings-row--stacked">
      ${n.configSchemaLoading ? l`<div class="settings-row__desc">${x(`channels.config.loadingSchema`)}</div>` : Ne({ channelId: t, configValue: n.configForm, schema: n.configSchema, uiHints: n.configUiHints, disabled: r, onPatch: n.onConfigPatch })}
      <div class="settings-row__control">
        <button
          class="btn primary"
          ?disabled=${r || !n.configFormDirty}
          @click=${() => n.onConfigSave()}
        >
          ${n.configSaving ? x(`common.saving`) : x(`common.save`)}
        </button>
        <button class="btn" ?disabled=${r} @click=${() => n.onConfigReload()}>
          ${x(`common.reload`)}
        </button>
      </div>
    </div>
  `;
}
var N,
  P = e(() => {
    (u(), ye(), S(), p(), (N = [`groupPolicy`, `streamMode`, `dmPolicy`]));
  });
function Pe(e, t) {
  return t.snapshot?.channels?.[e];
}
function Fe(e, t) {
  let n = t.snapshot?.channelAccounts?.[e] ?? [],
    r = t.snapshot?.channelDefaultAccountId?.[e];
  return (r ? n.find((e) => e.accountId === r) : void 0) ?? n[0] ?? null;
}
function F(e, t) {
  let n = Pe(e, t),
    r = t.snapshot?.channelAccounts?.[e] ?? [],
    i = Fe(e, t);
  return {
    configured:
      typeof n?.configured == `boolean`
        ? n.configured
        : typeof i?.configured == `boolean`
          ? i.configured
          : null,
    running: typeof n?.running == `boolean` ? n.running : null,
    connected: typeof n?.connected == `boolean` ? n.connected : null,
    defaultAccount: i,
    hasAnyActiveAccount: r.some((e) => e.configured || e.running || e.connected),
    status: n,
  };
}
function I(e, t) {
  if (!t.snapshot) return !1;
  let n = F(e, t);
  return n.configured === !0 || n.running === !0 || n.connected === !0 || n.hasAnyActiveAccount;
}
function L(e, t) {
  return F(e, t).configured;
}
function R(e) {
  return x(e == null ? `common.na` : e ? `common.yes` : `common.no`);
}
function z(e) {
  return e === !0 ? `ok` : `muted`;
}
function B(e) {
  return l`
    <dl class="settings-kv">
      ${e.map(
        (e) => l`
          <dt>${e.label}</dt>
          <dd>
            ${e.kind === void 0 ? e.value : T({ kind: e.kind, label: e.value })}
          </dd>
        `,
      )}
    </dl>
  `;
}
function V(e) {
  return l`
    <div class="settings-row">
      <div class="settings-row__text">
        <span class="settings-row__title"
          >${T({ kind: `danger`, label: x(`channels.lastError`) })}</span
        >
        <span class="settings-row__desc">${e}</span>
      </div>
    </div>
  `;
}
function H(e) {
  let t = [e.status ?? ``, e.error ?? ``].filter(Boolean).join(` `);
  return l`
    <div class="settings-row">
      <div class="settings-row__text">
        <span class="settings-row__title"
          >${T({ kind: e.ok ? `ok` : `danger`, label: e.ok ? x(`common.probeOk`) : x(`common.probeFailed`) })}</span
        >
        ${t ? l`<span class="settings-row__desc">${t}</span>` : d}
      </div>
    </div>
  `;
}
function U(e) {
  return l`
    <div class="settings-row">
      <div class="settings-row__text"></div>
      <div class="settings-row__control">${e}</div>
    </div>
  `;
}
function W(e) {
  let t = [e.accountId, ...(e.facts ?? [])].join(` · `);
  return l`
    <div class="settings-row">
      <div class="settings-row__text">
        <span class="settings-row__title">${e.title}</span>
        <span class="settings-row__desc">${t}</span>
        ${e.lastError ? l`<span class="settings-row__desc">${e.lastError}</span>` : d}
      </div>
      <div class="settings-row__control">
        ${T(e.status)}
        <span class="settings-row__value"
          >${e.lastInboundAt ? i(e.lastInboundAt) : x(`common.na`)}</span
        >
      </div>
    </div>
  `;
}
function G(e) {
  return E(
    {
      title: e.title,
      description: e.subtitle,
      ...(e.accountCount === void 0 ? {} : { count: e.accountCount }),
    },
    l`
      ${B(e.statusRows)}
      ${e.lastError ? V(e.lastError) : d}
      ${e.secondaryCallout ?? d} ${e.extraContent ?? d}
      ${e.configSection} ${e.footer ? U(e.footer) : d}
    `,
  );
}
function Ie(e, t) {
  return t?.[e]?.length ?? 0;
}
function K(e, t) {
  let n = Ie(e, t);
  return n >= 2 ? n : void 0;
}
var q = e(() => {
  (u(), D(), S(), _());
});
function Le(e) {
  let { props: t, discord: n, accountCount: r } = e,
    a = L(`discord`, t);
  return G({
    title: x(`channels.discord.title`),
    subtitle: x(`channels.discord.subtitle`),
    accountCount: r,
    statusRows: [
      { label: x(`common.configured`), value: R(a), kind: z(a) },
      {
        label: x(`common.running`),
        value: n?.running ? x(`common.yes`) : x(`common.no`),
        kind: z(n?.running),
      },
      { label: x(`common.lastStart`), value: n?.lastStartAt ? i(n.lastStartAt) : x(`common.na`) },
      { label: x(`common.lastProbe`), value: n?.lastProbeAt ? i(n.lastProbeAt) : x(`common.na`) },
    ],
    lastError: n?.lastError,
    secondaryCallout: n?.probe ? H(n.probe) : d,
    configSection: M({ channelId: `discord`, props: t }),
    footer: l`<button class="btn" @click=${() => t.onRefresh(!0)}>
      ${x(`common.probe`)}
    </button>`,
  });
}
var Re = e(() => {
  (u(), S(), _(), P(), q());
});
function ze(e) {
  let { props: t, googleChat: n, accountCount: r } = e,
    a = L(`googlechat`, t);
  return G({
    title: x(`channels.googleChat.title`),
    subtitle: x(`channels.googleChat.subtitle`),
    accountCount: r,
    statusRows: [
      { label: x(`common.configured`), value: R(a), kind: z(a) },
      {
        label: x(`common.running`),
        value: n ? (n.running ? x(`common.yes`) : x(`common.no`)) : x(`common.na`),
        kind: z(n?.running),
      },
      { label: x(`common.credential`), value: n?.credentialSource ?? x(`common.na`) },
      {
        label: x(`common.audience`),
        value: n?.audienceType
          ? `${n.audienceType}${n.audience ? ` · ${n.audience}` : ``}`
          : x(`common.na`),
      },
      { label: x(`common.lastStart`), value: n?.lastStartAt ? i(n.lastStartAt) : x(`common.na`) },
      { label: x(`common.lastProbe`), value: n?.lastProbeAt ? i(n.lastProbeAt) : x(`common.na`) },
    ],
    lastError: n?.lastError,
    secondaryCallout: n?.probe ? H(n.probe) : d,
    configSection: M({ channelId: `googlechat`, props: t }),
    footer: l`<button class="btn" @click=${() => t.onRefresh(!0)}>
      ${x(`common.probe`)}
    </button>`,
  });
}
var Be = e(() => {
  (u(), S(), _(), P(), q());
});
function Ve(e) {
  let { props: t, imessage: n, accountCount: r } = e,
    a = L(`imessage`, t);
  return G({
    title: x(`channels.imessage.title`),
    subtitle: x(`channels.imessage.subtitle`),
    accountCount: r,
    statusRows: [
      { label: x(`common.configured`), value: R(a), kind: z(a) },
      {
        label: x(`common.running`),
        value: n?.running ? x(`common.yes`) : x(`common.no`),
        kind: z(n?.running),
      },
      { label: x(`common.lastStart`), value: n?.lastStartAt ? i(n.lastStartAt) : x(`common.na`) },
      { label: x(`common.lastProbe`), value: n?.lastProbeAt ? i(n.lastProbeAt) : x(`common.na`) },
    ],
    lastError: n?.lastError,
    secondaryCallout: n?.probe ? H(n.probe) : d,
    configSection: M({ channelId: `imessage`, props: t }),
    footer: l`<button class="btn" @click=${() => t.onRefresh(!0)}>
      ${x(`common.probe`)}
    </button>`,
  });
}
var He = e(() => {
  (u(), S(), _(), P(), q());
});
function J(e) {
  return e ? (e.length <= 20 ? e : `${e.slice(0, 8)}...${e.slice(-8)}`) : x(`common.na`);
}
function Ue(e) {
  let {
      props: t,
      nostr: n,
      nostrAccounts: r,
      accountCount: a,
      profileFormState: o,
      profileFormCallbacks: s,
      onEditProfile: c,
    } = e,
    u = r[0],
    f = n?.configured ?? u?.configured ?? !1,
    p = n?.running ?? u?.running ?? !1,
    m = n?.publicKey ?? u?.publicKey,
    h = n?.lastStartAt ?? u?.lastStartAt ?? null,
    g = n?.lastError ?? u?.lastError ?? null,
    _ = r.length > 1,
    v = o != null,
    y = (e) => {
      let t = e.publicKey,
        n = e.profile;
      return W({
        title: n?.displayName ?? n?.name ?? e.name ?? e.accountId,
        accountId: e.accountId,
        facts: [
          `${x(`common.configured`)}: ${e.configured ? x(`common.yes`) : x(`common.no`)}`,
          `${x(`common.publicKey`)}: ${J(t)}`,
        ],
        status: { kind: z(e.running), label: e.running ? x(`common.running`) : x(`common.no`) },
        lastInboundAt: e.lastInboundAt,
        lastError: e.lastError,
      });
    },
    b = () => {
      if (v && s) return Te({ state: o, callbacks: s, accountId: r[0]?.accountId ?? `default` });
      let {
          name: e,
          displayName: t,
          about: i,
          picture: a,
          nip05: p,
        } = u?.profile ?? n?.profile ?? {},
        m = e || t || i || a || p;
      return l`
      <div class="settings-row">
        <div class="settings-row__text">
          <span class="settings-row__title">${x(`channels.nostr.profile`)}</span>
          ${
            m
              ? d
              : l`<span class="settings-row__desc"
                >${x(`channels.nostr.noProfile`)} ${x(`channels.nostr.noProfileHint`)}</span
              >`
          }
        </div>
        ${
          f
            ? l`
              <div class="settings-row__control">
                <button class="btn btn--sm" @click=${c}>
                  ${x(`channels.nostr.editProfile`)}
                </button>
              </div>
            `
            : d
        }
      </div>
      ${
        m
          ? l`
            <dl class="settings-kv">
              ${
                a
                  ? l`
                    <dt>${x(`channels.nostr.profilePicture`)}</dt>
                    <dd>
                      <img
                        style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;"
                        src=${a}
                        alt=${x(`channels.nostr.profilePicture`)}
                        @error=${(e) => {
                          e.target.style.display = `none`;
                        }}
                      />
                    </dd>
                  `
                  : d
              }
              ${
                e
                  ? l`<dt>${x(`channels.nostr.name`)}</dt>
                    <dd>${e}</dd>`
                  : d
              }
              ${
                t
                  ? l`<dt>${x(`channels.nostr.displayName`)}</dt>
                    <dd>${t}</dd>`
                  : d
              }
              ${
                i
                  ? l`<dt>${x(`channels.nostr.about`)}</dt>
                    <dd>${i}</dd>`
                  : d
              }
              ${
                p
                  ? l`<dt>NIP-05</dt>
                    <dd>${p}</dd>`
                  : d
              }
            </dl>
          `
          : d
      }
    `;
    };
  return E(
    {
      title: x(`channels.nostr.title`),
      description: x(`channels.nostr.subtitle`),
      ...(a === void 0 ? {} : { count: a }),
    },
    l`
      ${
        _
          ? r.map((e) => y(e))
          : B([
              {
                label: x(`common.configured`),
                value: x(f ? `common.yes` : `common.no`),
                kind: z(f),
              },
              { label: x(`common.running`), value: x(p ? `common.yes` : `common.no`), kind: z(p) },
              {
                label: x(`common.publicKey`),
                value: l`<code title="${m ?? ``}"
                >${J(m)}</code
              >`,
              },
              { label: x(`common.lastStart`), value: h ? i(h) : x(`common.na`) },
            ])
      }
      ${g ? V(g) : d}
      ${b()} ${M({ channelId: `nostr`, props: t })}
      ${U(l`<button class="btn" @click=${() => t.onRefresh(!1)}>
          ${x(`common.refresh`)}
        </button>`)}
    `,
  );
}
var We = e(() => {
  (u(), D(), S(), _(), P(), k(), q());
});
function Ge(e) {
  let { props: t, signal: n, accountCount: r } = e,
    a = L(`signal`, t);
  return G({
    title: x(`channels.signal.title`),
    subtitle: x(`channels.signal.subtitle`),
    accountCount: r,
    statusRows: [
      { label: x(`common.configured`), value: R(a), kind: z(a) },
      {
        label: x(`common.running`),
        value: n?.running ? x(`common.yes`) : x(`common.no`),
        kind: z(n?.running),
      },
      { label: x(`common.baseUrl`), value: n?.baseUrl ?? x(`common.na`) },
      { label: x(`common.lastStart`), value: n?.lastStartAt ? i(n.lastStartAt) : x(`common.na`) },
      { label: x(`common.lastProbe`), value: n?.lastProbeAt ? i(n.lastProbeAt) : x(`common.na`) },
    ],
    lastError: n?.lastError,
    secondaryCallout: n?.probe ? H(n.probe) : d,
    configSection: M({ channelId: `signal`, props: t }),
    footer: l`<button class="btn" @click=${() => t.onRefresh(!0)}>
      ${x(`common.probe`)}
    </button>`,
  });
}
var Ke = e(() => {
  (u(), S(), _(), P(), q());
});
function qe(e) {
  let { props: t, slack: n, accountCount: r } = e,
    a = L(`slack`, t);
  return G({
    title: x(`channels.slack.title`),
    subtitle: x(`channels.slack.subtitle`),
    accountCount: r,
    statusRows: [
      { label: x(`common.configured`), value: R(a), kind: z(a) },
      {
        label: x(`common.running`),
        value: n?.running ? x(`common.yes`) : x(`common.no`),
        kind: z(n?.running),
      },
      { label: x(`common.lastStart`), value: n?.lastStartAt ? i(n.lastStartAt) : x(`common.na`) },
      { label: x(`common.lastProbe`), value: n?.lastProbeAt ? i(n.lastProbeAt) : x(`common.na`) },
    ],
    lastError: n?.lastError,
    secondaryCallout: n?.probe ? H(n.probe) : d,
    configSection: M({ channelId: `slack`, props: t }),
    footer: l`<button class="btn" @click=${() => t.onRefresh(!0)}>
      ${x(`common.probe`)}
    </button>`,
  });
}
var Je = e(() => {
  (u(), S(), _(), P(), q());
});
function Ye(e) {
  let { props: t, telegram: n, telegramAccounts: r, accountCount: a } = e,
    o = r.length > 1,
    s = L(`telegram`, t),
    c = (e) => {
      let t = e.probe?.bot?.username,
        n = e.name || e.accountId;
      return W({
        title: t ? `@${t}` : n,
        accountId: e.accountId,
        facts: [`${x(`common.configured`)}: ${e.configured ? x(`common.yes`) : x(`common.no`)}`],
        status: { kind: z(e.running), label: e.running ? x(`common.running`) : x(`common.no`) },
        lastInboundAt: e.lastInboundAt,
        lastError: e.lastError,
      });
    };
  return o
    ? E(
        {
          title: x(`channels.telegram.title`),
          description: x(`channels.telegram.subtitle`),
          ...(a === void 0 ? {} : { count: a }),
        },
        l`
        ${r.map((e) => c(e))}
        ${n?.lastError ? V(n.lastError) : d}
        ${n?.probe ? H(n.probe) : d}
        ${M({ channelId: `telegram`, props: t })}
        ${U(l`<button class="btn" @click=${() => t.onRefresh(!0)}>
            ${x(`common.probe`)}
          </button>`)}
      `,
      )
    : G({
        title: x(`channels.telegram.title`),
        subtitle: x(`channels.telegram.subtitle`),
        accountCount: a,
        statusRows: [
          { label: x(`common.configured`), value: R(s), kind: z(s) },
          {
            label: x(`common.running`),
            value: n?.running ? x(`common.yes`) : x(`common.no`),
            kind: z(n?.running),
          },
          { label: x(`common.mode`), value: n?.mode ?? x(`common.na`) },
          {
            label: x(`common.lastStart`),
            value: n?.lastStartAt ? i(n.lastStartAt) : x(`common.na`),
          },
          {
            label: x(`common.lastProbe`),
            value: n?.lastProbeAt ? i(n.lastProbeAt) : x(`common.na`),
          },
        ],
        lastError: n?.lastError,
        secondaryCallout: n?.probe ? H(n.probe) : d,
        configSection: M({ channelId: `telegram`, props: t }),
        footer: l`<button class="btn" @click=${() => t.onRefresh(!0)}>
      ${x(`common.probe`)}
    </button>`,
      });
}
var Xe = e(() => {
  (u(), D(), S(), _(), P(), q());
});
function Ze(e) {
  let { props: t, whatsapp: n, accountCount: a } = e,
    o = L(`whatsapp`, t),
    s = n?.linked === !0,
    c = t.whatsappQrDataUrl != null;
  return G({
    title: x(`channels.whatsapp.title`),
    subtitle: x(`channels.whatsapp.subtitle`),
    accountCount: a,
    statusRows: [
      { label: x(`common.configured`), value: R(o), kind: z(o) },
      {
        label: x(`common.linked`),
        value: n?.linked ? x(`common.yes`) : x(`common.no`),
        kind: z(n?.linked),
      },
      {
        label: x(`common.running`),
        value: n?.running ? x(`common.yes`) : x(`common.no`),
        kind: z(n?.running),
      },
      {
        label: x(`common.connected`),
        value: n?.connected ? x(`common.yes`) : x(`common.no`),
        kind: z(n?.connected),
      },
      {
        label: x(`common.lastConnect`),
        value: n?.lastConnectedAt ? i(n.lastConnectedAt) : x(`common.na`),
      },
      {
        label: x(`common.lastMessage`),
        value: n?.lastMessageAt ? i(n.lastMessageAt) : x(`common.na`),
      },
      { label: x(`common.authAge`), value: n?.authAgeMs == null ? x(`common.na`) : r(n.authAgeMs) },
    ],
    lastError: n?.lastError,
    extraContent: l`
      ${
        t.whatsappMessage
          ? l`
            <div class="settings-row">
              <div class="settings-row__text">
                <span class="settings-row__desc">${t.whatsappMessage}</span>
              </div>
            </div>
          `
          : d
      }
      ${
        t.whatsappQrDataUrl
          ? l`
            <div class="settings-row settings-row--stacked">
              <div class="qr-wrap">
                <img src=${t.whatsappQrDataUrl} alt="WhatsApp QR" />
              </div>
            </div>
          `
          : d
      }
    `,
    configSection: M({ channelId: `whatsapp`, props: t }),
    footer: l`
      ${
        s
          ? l`<button
            class="btn"
            ?disabled=${t.whatsappBusy}
            @click=${() => t.onWhatsAppStart(!0)}
          >
            ${x(`common.relink`)}
          </button>`
          : l`<button
            class="btn primary"
            ?disabled=${t.whatsappBusy}
            @click=${() => t.onWhatsAppStart(!1)}
          >
            ${t.whatsappBusy ? x(`common.working`) : x(`common.showQr`)}
          </button>`
      }
      ${
        c
          ? l`<button
            class="btn"
            ?disabled=${t.whatsappBusy}
            @click=${() => t.onWhatsAppWait()}
          >
            ${x(`common.waitForScan`)}
          </button>`
          : d
      }
      <button
        class="btn danger"
        ?disabled=${t.whatsappBusy}
        @click=${() => t.onWhatsAppLogout()}
      >
        ${x(`common.logout`)}
      </button>
      <button class="btn" @click=${() => t.onRefresh(!0)}>${x(`common.refresh`)}</button>
    `,
  });
}
var Qe = e(() => {
  (u(), S(), _(), P(), q());
});
function $e(e, t, n) {
  let r = K(e, n.channelAccounts);
  switch (e) {
    case `whatsapp`:
      return Ze({ props: t, whatsapp: n.whatsapp, accountCount: r });
    case `telegram`:
      return Ye({
        props: t,
        telegram: n.telegram,
        telegramAccounts: n.channelAccounts?.telegram ?? [],
        accountCount: r,
      });
    case `discord`:
      return Le({ props: t, discord: n.discord, accountCount: r });
    case `googlechat`:
      return ze({ props: t, googleChat: n.googlechat, accountCount: r });
    case `slack`:
      return qe({ props: t, slack: n.slack, accountCount: r });
    case `signal`:
      return Ge({ props: t, signal: n.signal, accountCount: r });
    case `imessage`:
      return Ve({ props: t, imessage: n.imessage, accountCount: r });
    case `nostr`: {
      let e = n.channelAccounts?.nostr ?? [],
        i = e[0],
        a = i?.accountId ?? `default`,
        o = i?.profile ?? null,
        s = t.nostrProfileAccountId === a ? t.nostrProfileFormState : null,
        c = s
          ? {
              onFieldChange: t.onNostrProfileFieldChange,
              onSave: t.onNostrProfileSave,
              onImport: t.onNostrProfileImport,
              onCancel: t.onNostrProfileCancel,
              onToggleAdvanced: t.onNostrProfileToggleAdvanced,
            }
          : null;
      return Ue({
        props: t,
        nostr: n.nostr,
        nostrAccounts: e,
        accountCount: r,
        profileFormState: s,
        profileFormCallbacks: c,
        onEditProfile: () => t.onNostrProfileEdit(a, o),
      });
    }
    default:
      return et(e, t, n.channelAccounts ?? {});
  }
}
function et(e, t, n) {
  let r = t.snapshot?.channelLabels?.[e] ?? e,
    i = F(e, t),
    a = typeof i.status?.lastError == `string` ? i.status.lastError : void 0,
    o = n[e] ?? [],
    s = K(e, n);
  return E(
    {
      title: r,
      description: x(`channels.generic.subtitle`),
      ...(s === void 0 ? {} : { count: s }),
    },
    l`
      ${
        o.length > 0
          ? o.map((e) =>
              W({
                title: e.name || e.accountId,
                accountId: e.accountId,
                status: {
                  kind: z(e.running ?? e.configured),
                  label: e.running
                    ? x(`common.running`)
                    : e.configured
                      ? x(`common.configured`)
                      : x(`common.no`),
                },
                lastInboundAt: e.lastInboundAt,
                lastError: e.lastError,
              }),
            )
          : B([
              { label: x(`common.configured`), value: R(i.configured), kind: z(i.configured) },
              { label: x(`common.running`), value: R(i.running), kind: z(i.running) },
              { label: x(`common.connected`), value: R(i.connected), kind: z(i.connected) },
            ])
      }
      ${a ? V(a) : d}
      ${M({ channelId: e, props: t })}
    `,
  );
}
function tt(e) {
  let t = $e(e.channelId, e.props, e.data);
  return l`
    <openclaw-modal-dialog label=${e.label} @modal-cancel=${() => e.onClose()}>
      <div class="channels-detail">
        <div class="channels-detail__header">
          ${A(e.channelId, e.label, `cover`)}
          <div class="channels-detail__header-actions">
            <button type="button" class="btn btn--sm" @click=${() => e.onSetup()}>
              ${x(`channels.hub.runSetup`)}
            </button>
            <button
              type="button"
              class="btn channels-detail__close"
              aria-label=${x(`common.close`)}
              @click=${() => e.onClose()}
            >
              ✕
            </button>
          </div>
        </div>
        <div class="channels-detail__body">
          ${e.props.setupBlockedByDirtyConfig && e.props.configFormDirty ? l`<div class="callout warn">${x(`channels.hub.saveBeforeSetup`)}</div>` : d}
          ${t}
        </div>
      </div>
    </openclaw-modal-dialog>
  `;
}
var nt = e(() => {
  (u(), D(), S(), w(), j(), P(), Re(), Be(), He(), We(), q(), Ke(), Je(), Xe(), Qe());
});
function rt(e) {
  return typeof e.initialValue == `string` ? e.initialValue : ``;
}
function it(e, t) {
  let n = e.message?.trim() ?? ``,
    r = n.includes(`{`) || n.includes(`  `);
  return l`
    ${e.title ? l`<div class="channels-wizard__message">${e.title}</div>` : d}
    ${
      n
        ? l`<div
          class="channels-wizard__note ${r ? `channels-wizard__note--code` : ``}"
        >
          ${n}
        </div>`
        : d
    }
    ${
      n
        ? l`
          <div class="channels-wizard__links">
            <button
              type="button"
              class="btn btn--sm"
              @click=${() => void navigator.clipboard?.writeText(n)}
            >
              ${x(`channels.setup.copyText`)}
            </button>
          </div>
        `
        : d
    }
    <div class="channels-wizard__footer">
      <button type="button" class="btn primary" @click=${() => t.onAnswer(null)}>
        ${x(`channels.setup.continue`)}
      </button>
    </div>
  `;
}
function at(e, t) {
  let n = e.options ?? [],
    r = n.findIndex((t) => t.value === e.initialValue);
  return l`
    <wa-radio-group
      class="channels-wizard__options"
      label=${e.message ?? ``}
      orientation="vertical"
      .value=${r >= 0 ? String(r) : null}
      @change=${(e) => {
        let r = e.currentTarget.value,
          i = n[Number(r)];
        i && t.onAnswer(i.value);
      }}
    >
      ${n.map(
        (e, t) => l`
          <wa-radio
            class="channels-wizard__option"
            appearance="button"
            value=${String(t)}
            .checked=${t === r}
          >
            <span class="channels-wizard__option-label">${e.label}</span>
            ${e.hint ? l`<span class="channels-wizard__option-hint">${e.hint}</span>` : d}
          </wa-radio>
        `,
      )}
    </wa-radio-group>
  `;
}
function ot(e, t) {
  let n = e.options ?? [],
    r = new Set(t.multiselectValues);
  return l`
    <div class="channels-wizard__message">${e.message ?? ``}</div>
    <div class="channels-wizard__options">
      ${n.map(
        (e) => l`
          <button
            type="button"
            class="channels-wizard__option"
            aria-pressed=${r.has(e.value) ? `true` : `false`}
            @click=${() => t.onToggleMultiselect(e.value)}
          >
            <span class="channels-wizard__option-label">
              ${r.has(e.value) ? `☑` : `☐`} ${e.label}
            </span>
            ${e.hint ? l`<span class="channels-wizard__option-hint">${e.hint}</span>` : d}
          </button>
        `,
      )}
    </div>
    <div class="channels-wizard__footer">
      <button
        type="button"
        class="btn primary"
        @click=${() => t.onAnswer([...t.multiselectValues])}
      >
        ${x(`channels.setup.continue`)}
      </button>
    </div>
  `;
}
function st(e, t) {
  return l`
    <form @submit=${(e) => {
      e.preventDefault();
      let n = e.currentTarget.elements.namedItem(`wizard-text`);
      t.onAnswer(n?.value ?? ``);
    }}>
      <div class="channels-wizard__message">${e.message ?? ``}</div>
      <input
        class="input"
        style="margin-top: 10px; width: 100%;"
        name="wizard-text"
        type=${e.sensitive ? `password` : `text`}
        autocomplete=${e.sensitive ? `off` : `on`}
        placeholder=${e.placeholder ?? ``}
        .value=${rt(e)}
      />
      <div class="channels-wizard__footer" style="margin-top: 12px;">
        <button type="submit" class="btn primary">${x(`channels.setup.continue`)}</button>
      </div>
    </form>
  `;
}
function ct(e, t) {
  return l`
    <div class="channels-wizard__message">${e.message ?? ``}</div>
    <div class="channels-wizard__footer">
      <button type="button" class="btn" @click=${() => t.onAnswer(!1)}>
        ${x(`common.no`)}
      </button>
      <button type="button" class="btn primary" @click=${() => t.onAnswer(!0)}>
        ${x(`common.yes`)}
      </button>
    </div>
  `;
}
function lt(e, t) {
  switch (e.type) {
    case `select`:
      return at(e, t);
    case `multiselect`:
      return ot(e, t);
    case `text`:
      return st(e, t);
    case `confirm`:
      return ct(e, t);
    default:
      return it(e, t);
  }
}
function ut(e) {
  let t = e.whatsappConnected === !0;
  return l`
    <div class="channels-wizard__message">
      ${x(t ? `channels.setup.whatsappLinked` : `channels.setup.whatsappScanTitle`)}
    </div>
    ${e.whatsappMessage ? l`<div class="channels-wizard__note">${e.whatsappMessage}</div>` : d}
    ${
      t
        ? d
        : l`
          <div class="channels-wizard__qr">
            ${
              e.whatsappQrDataUrl
                ? l`<img src=${e.whatsappQrDataUrl} alt="WhatsApp pairing QR code" />`
                : l`<div class="channels-wizard__spinner">
                  ${e.whatsappBusy ? x(`channels.setup.whatsappQrLoading`) : x(`channels.setup.whatsappQrHint`)}
                </div>`
            }
          </div>
          <div class="channels-wizard__note">${x(`channels.setup.whatsappScanHelp`)}</div>
        `
    }
    <div class="channels-wizard__footer">
      ${
        t
          ? l`
            <button type="button" class="btn primary" @click=${() => e.onClose()}>
              ${x(`channels.setup.finish`)}
            </button>
          `
          : l`
            <button
              type="button"
              class="btn"
              ?disabled=${e.whatsappBusy}
              @click=${() => e.onWhatsAppStart(!0)}
            >
              ${e.whatsappQrDataUrl ? x(`channels.setup.regenerateQr`) : x(`common.showQr`)}
            </button>
            ${
              e.whatsappQrDataUrl
                ? l`
                  <button
                    type="button"
                    class="btn primary"
                    ?disabled=${e.whatsappBusy}
                    @click=${() => e.onWhatsAppWait()}
                  >
                    ${x(`common.waitForScan`)}
                  </button>
                `
                : d
            }
            <button type="button" class="btn" @click=${() => e.onClose()}>
              ${x(`channels.setup.linkLater`)}
            </button>
          `
      }
    </div>
  `;
}
function dt(e, t) {
  return e.includes(`whatsapp`)
    ? ut(t)
    : e.length === 0
      ? l`
      <div class="channels-wizard__message">${x(`channels.setup.doneNoChangesTitle`)}</div>
      <div class="channels-wizard__note">${x(`channels.setup.doneNoChangesBody`)}</div>
      <div class="channels-wizard__footer">
        <button type="button" class="btn primary" @click=${() => t.onClose()}>
          ${x(`common.close`)}
        </button>
      </div>
    `
      : l`
    <div class="channels-wizard__message">${x(`channels.setup.doneTitle`)}</div>
    <div class="channels-wizard__note">${x(`channels.setup.doneBody`)}</div>
    <div class="channels-wizard__footer">
      <button type="button" class="btn primary" @click=${() => t.onClose()}>
        ${x(`channels.setup.finish`)}
      </button>
    </div>
  `;
}
function ft(e, t) {
  let n = [...(e ? (Oe(e).setupLinks ?? []) : [])];
  return (
    t?.externalUrl && n.unshift({ label: x(`channels.setup.openLink`), url: t.externalUrl }),
    e && n.push({ label: x(`channels.setup.docs`), url: ke(e) }),
    n.length === 0
      ? d
      : l`
    <div class="channels-wizard__links">
      ${n.map(
        (e) => l`
          <a class="btn btn--sm" href=${e.url} target="_blank" rel="noreferrer noopener">
            ${e.label} ↗
          </a>
        `,
      )}
    </div>
  `
  );
}
function pt(e) {
  let t = e.wizard;
  if (t.phase === `idle`) return d;
  let n = t.channel,
    r = n ? e.channelLabel(n) : x(`channels.setup.genericTitle`),
    i = t.phase === `step` ? t.step : null,
    a;
  return (
    t.phase === `starting`
      ? (a = l`<div class="channels-wizard__spinner">${x(`channels.setup.starting`)}</div>`)
      : t.phase === `error`
        ? (a = l`
      <div class="channels-wizard__error">${t.message}</div>
      <div class="channels-wizard__footer">
        <button type="button" class="btn" @click=${() => e.onClose()}>
          ${x(`common.close`)}
        </button>
      </div>
    `)
        : t.phase === `done`
          ? (a = dt(t.channels, e))
          : i &&
            (a = l`
      ${t.phase === `step` && t.validationError ? l`<div class="channels-wizard__error">${t.validationError}</div>` : d}
      ${lt(i, e)}
      ${t.phase === `step` && t.busy ? l`<div class="channels-wizard__spinner">${x(`channels.setup.working`)}</div>` : d}
    `),
    l`
    <openclaw-modal-dialog
      label=${x(`channels.setup.dialogLabel`, { channel: r })}
      @modal-cancel=${() => e.onClose()}
    >
      <div class="channels-wizard">
        <div class="channels-wizard__header">
          ${n ? A(n, r, `tile`) : d}
          <div class="channels-wizard__heading">
            <h2>${x(`channels.setup.title`, { channel: r })}</h2>
            <div class="muted">${x(`channels.setup.subtitle`)}</div>
          </div>
        </div>
        <div class="channels-wizard__body">${ft(n, i)} ${a}</div>
      </div>
    </openclaw-modal-dialog>
  `
  );
}
var mt = e(() => {
  (ue(), fe(), u(), S(), w(), j());
});
function ht(e) {
  let t = _t(e.snapshot),
    n = t.filter((t) => I(t, e)),
    r = t.filter((t) => !I(t, e)),
    a = !!(e.loading && e.snapshot && e.lastSuccessAt),
    o = e.snapshot?.warnings?.filter((e) => e.trim()) ?? [],
    s = gt(e),
    c = e.selectedChannel;
  return l`
    ${le(l`
      ${a ? l`<div class="callout info">${x(`channels.refreshingStaleSnapshot`)}</div>` : d}
      ${
        e.snapshot?.partial
          ? l`
            <div class="callout warn">
              ${x(`channels.hub.partialSnapshot`)}
              ${o.length > 0 ? o.slice(0, 3).join(`; `) : ``}
            </div>
          `
          : d
      }
      ${e.lastError ? l`<div class="callout danger">${e.lastError}</div>` : d}
      ${e.setupBlockedByDirtyConfig && e.configFormDirty ? l`<div class="callout warn">${x(`channels.hub.saveBeforeSetup`)}</div>` : d}
      ${E(
        {
          title: x(`channels.hub.connectedTitle`),
          ...(n.length > 0 ? { count: n.length } : {}),
          actions: l`
            <span class="settings-row__value">
              ${e.lastSuccessAt ? x(`channels.hub.updatedAgo`, { ago: i(e.lastSuccessAt) }) : x(`common.na`)}
            </span>
            <button
              type="button"
              class="btn btn--sm"
              ?disabled=${e.loading}
              @click=${() => e.onRefresh(!0)}
            >
              ${x(`common.refresh`)}
            </button>
          `,
        },
        n.length === 0 ? de(x(`channels.hub.noneConnected`)) : n.map((t) => xt(t, e)),
      )}
      ${E(
        { title: x(`channels.hub.addTitle`), description: x(`channels.hub.addSubtitle`) },
        l`
          ${r.map((t) => St(t, e))} ${Ct(e)}
        `,
      )}
      ${E(
        { title: x(`channels.health.title`), description: x(`channels.health.subtitle`) },
        l`
          <div class="settings-row settings-row--stacked">
            <pre class="code-block">
${e.snapshot ? JSON.stringify(e.snapshot, null, 2) : x(`channels.health.noSnapshotYet`)}
            </pre>
          </div>
        `,
      )}
    `)}
    ${c ? tt({ channelId: c, label: X(e.snapshot, c), props: e, data: s, onClose: () => e.onCloseDetail(), onSetup: () => e.onStartSetup(c) }) : d}
    ${pt({ wizard: e.wizard, channelLabel: (t) => X(e.snapshot, t), multiselectValues: e.wizardMultiselect, onToggleMultiselect: e.onWizardToggleMultiselect, onAnswer: e.onWizardAnswer, onClose: e.onWizardClose, whatsappQrDataUrl: e.whatsappQrDataUrl, whatsappMessage: e.whatsappMessage, whatsappConnected: e.whatsappConnected, whatsappBusy: e.whatsappBusy, onWhatsAppStart: e.onWhatsAppStart, onWhatsAppWait: e.onWhatsAppWait })}
  `;
}
function gt(e) {
  let t = e.snapshot?.channels;
  return {
    whatsapp: t?.whatsapp ?? void 0,
    telegram: t?.telegram ?? void 0,
    discord: t?.discord ?? null,
    googlechat: t?.googlechat ?? null,
    slack: t?.slack ?? null,
    signal: t?.signal ?? null,
    imessage: t?.imessage ?? null,
    nostr: t?.nostr ?? null,
    channelAccounts: e.snapshot?.channelAccounts ?? null,
  };
}
function _t(e) {
  return e?.channelMeta?.length
    ? e.channelMeta.map((e) => e.id)
    : e?.channelOrder?.length
      ? e.channelOrder
      : [`whatsapp`, `telegram`, `discord`, `googlechat`, `slack`, `signal`, `imessage`, `nostr`];
}
function Y(e) {
  return e?.channelMeta?.length ? Object.fromEntries(e.channelMeta.map((e) => [e.id, e])) : {};
}
function X(e, t) {
  return Y(e)[t]?.label ?? e?.channelLabels?.[t] ?? t;
}
function Z(e, t) {
  let n = Y(e)[t]?.detailLabel ?? e?.channelDetailLabels?.[t] ?? null;
  return n && n !== X(e, t) ? n : null;
}
function vt(e, t) {
  let n = F(e, t);
  return (
    typeof n.status?.lastError == `string` && n.status.lastError.trim()
      ? n.status.lastError
      : (t.snapshot?.channelAccounts?.[e] ?? []).find((e) => e.lastError)?.lastError
  )
    ? `attention`
    : n.running === !0 || n.connected === !0
      ? `running`
      : `configured`;
}
function yt(e) {
  switch (e) {
    case `running`:
      return T({ kind: `ok`, label: x(`channels.hub.stateRunning`) });
    case `configured`:
      return T({ kind: `muted`, label: x(`channels.hub.stateConfigured`) });
    case `attention`:
      return T({ kind: `danger`, label: x(`channels.hub.stateAttention`) });
    default:
      return e;
  }
}
function bt(e, t) {
  let n = (t.snapshot?.channelAccounts?.[e] ?? [])
    .map((e) => e.lastInboundAt ?? 0)
    .reduce((e, t) => Math.max(e, t), 0);
  return n ? x(`channels.hub.lastMessageAgo`, { ago: i(n) }) : null;
}
function xt(e, t) {
  let n = X(t.snapshot, e),
    r = bt(e, t) ?? Z(t.snapshot, e) ?? x(`channels.hub.openDetails`);
  return l`
    <button
      type="button"
      class="settings-row settings-row--nav channels-item"
      @click=${() => t.onShowDetail(e)}
    >
      ${A(e, n, `tile`)}
      <div class="settings-row__text">
        <span class="settings-row__title">${n}</span>
        <span class="settings-row__desc">${r}</span>
      </div>
      <div class="settings-row__control">
        ${yt(vt(e, t))}
        <span class="settings-row__chevron">${C.chevronRight}</span>
      </div>
    </button>
  `;
}
function St(e, t) {
  let n = X(t.snapshot, e),
    r = Z(t.snapshot, e) ?? x(`channels.hub.guidedSetup`);
  return l`
    <div class="settings-row channels-item">
      <button
        type="button"
        class="channels-item__detail"
        title=${x(`channels.hub.openDetails`)}
        @click=${() => t.onShowDetail(e)}
      >
        ${A(e, n, `tile`)}
        <span class="settings-row__text">
          <span class="settings-row__title">${n}</span>
          <span class="settings-row__desc">${r}</span>
        </span>
      </button>
      <div class="settings-row__control">
        <button type="button" class="btn btn--sm" @click=${() => t.onStartSetup(e)}>
          ${x(`channels.hub.setUp`)}
        </button>
      </div>
    </div>
  `;
}
function Ct(e) {
  return l`
    <button
      type="button"
      class="settings-row settings-row--nav channels-item"
      @click=${() => e.onStartSetup(null)}
    >
      <span
        class="channels-tile channels-tile--fallback"
        style="--channels-art-a:#64748b;--channels-art-b:#1e293b"
        aria-hidden="true"
      >
        <span>+</span>
      </span>
      <div class="settings-row__text">
        <span class="settings-row__title">${x(`channels.hub.browseAllTitle`)}</span>
        <span class="settings-row__desc">${x(`channels.hub.browseAllSubtitle`)}</span>
      </div>
      <div class="settings-row__control">
        <span class="settings-row__chevron">${C.chevronRight}</span>
      </div>
    </button>
  `;
}
var wt = e(() => {
  (u(), De(), ae(), D(), S(), _(), j(), nt(), q(), mt());
});
async function Tt(e, t, n) {
  let r;
  try {
    return await Promise.race([
      e.request(t, n),
      new Promise((e, n) => {
        r = setTimeout(() => n(Error(`wizard request timed out: ${t}`)), Et);
      }),
    ]);
  } finally {
    clearTimeout(r);
  }
}
var Et,
  Dt,
  Ot = e(() => {
    ((Et = 12e4),
      (Dt = class {
        constructor(e, t, n = () => !1) {
          ((this.getClient = e),
            (this.onChange = t),
            (this.isKnownChannel = n),
            (this.currentState = { phase: `idle` }),
            (this.sessionId = null),
            (this.channel = null),
            (this.stepIndex = 0),
            (this.generation = 0));
        }
        get state() {
          return this.currentState;
        }
        async start(e) {
          let t = this.getClient();
          if (!t) return;
          let n = ++this.generation;
          ((this.sessionId = null),
            (this.channel = e),
            (this.stepIndex = 0),
            this.setState({ phase: `starting`, channel: e }));
          try {
            let r = await Tt(t, `wizard.start`, { flow: `channels`, ...(e ? { channel: e } : {}) });
            if (this.generation !== n) {
              r.sessionId &&
                !r.done &&
                t.request(`wizard.cancel`, { sessionId: r.sessionId }).catch(() => {});
              return;
            }
            ((this.sessionId = r.sessionId ?? null), this.applyResult(r));
          } catch (t) {
            if (this.generation !== n) return;
            this.setState({ phase: `error`, channel: e, message: String(t) });
          }
        }
        async answer(e) {
          let t = this.getClient(),
            n = this.currentState;
          if (!t || !this.sessionId || n.phase !== `step` || n.busy) return;
          let r = this.generation;
          (n.step.type === `select` &&
            typeof e == `string` &&
            this.isKnownChannel(e) &&
            (this.channel ??= e),
            this.setState({ ...n, busy: !0, validationError: null }));
          try {
            let i = await Tt(t, `wizard.next`, {
              sessionId: this.sessionId,
              answer: { stepId: n.step.id, value: e },
            });
            if (this.generation !== r) return;
            this.applyResult(i);
          } catch (e) {
            if (this.generation !== r) return;
            this.setState({ phase: `error`, channel: this.channel, message: String(e) });
          }
        }
        async cancel() {
          let e = this.getClient(),
            t = this.sessionId;
          if (
            ((this.generation += 1),
            (this.sessionId = null),
            (this.channel = null),
            this.setState({ phase: `idle` }),
            e && t)
          )
            try {
              await e.request(`wizard.cancel`, { sessionId: t });
            } catch {}
        }
        applyResult(e) {
          if (!e.done && e.step) {
            ((this.stepIndex += 1),
              this.setState({
                phase: `step`,
                channel: this.channel,
                step: e.step,
                stepIndex: this.stepIndex,
                busy: !1,
                validationError: e.error ?? null,
              }));
            return;
          }
          if (e.status === `done`) {
            this.sessionId = null;
            let t = e.channels ?? [];
            this.setState({
              phase: `done`,
              channel: this.channel ?? t[0] ?? null,
              channels: t,
              accounts: e.accounts ?? [],
            });
            return;
          }
          if (e.status === `cancelled`) {
            ((this.sessionId = null), (this.channel = null), this.setState({ phase: `idle` }));
            return;
          }
          ((this.sessionId = null),
            this.setState({
              phase: `error`,
              channel: this.channel,
              message: e.error ?? `Wizard failed.`,
            }));
        }
        setState(e) {
          ((this.currentState = e), this.onChange());
        }
      }));
  }),
  Q,
  kt = e(() => {
    (Ot(),
      (Q = class {
        constructor(e) {
          ((this.deps = e),
            (this.multiselect = []),
            (this.blockedByDirtyConfig = !1),
            (this.multiselectStepId = null),
            (this.lastPhase = `idle`),
            (this.controller = new Dt(
              () => e.getContext()?.gateway.snapshot.client ?? null,
              () => this.handleControllerChange(),
              (t) =>
                e
                  .getContext()
                  ?.channels.state.channelsSnapshot?.channelMeta?.some((e) => e.id === t) ?? !1,
            )));
        }
        get state() {
          return this.controller.state;
        }
        startSetup(e) {
          if (this.deps.getContext()?.runtimeConfig.state.configFormDirty) {
            ((this.blockedByDirtyConfig = !0), this.deps.requestUpdate());
            return;
          }
          ((this.blockedByDirtyConfig = !1),
            (this.whatsappAccountId = void 0),
            this.deps.clearSelection(),
            this.controller.start(e));
        }
        close() {
          let e = this.controller.state.phase !== `idle`;
          (this.controller.cancel(), e && this.deps.getContext()?.channels.refresh(!0));
        }
        cancelOnDisconnect() {
          this.controller.cancel();
        }
        answer(e) {
          this.controller.answer(e);
        }
        toggleMultiselect(e) {
          ((this.multiselect = this.multiselect.includes(e)
            ? this.multiselect.filter((t) => t !== e)
            : [...this.multiselect, e]),
            this.deps.requestUpdate());
        }
        handleControllerChange() {
          let e = this.controller.state,
            t = e.phase === `step` ? e.step.id : null;
          (t !== this.multiselectStepId &&
            ((this.multiselectStepId = t),
            (this.multiselect =
              e.phase === `step` && Array.isArray(e.step.initialValue)
                ? [...e.step.initialValue]
                : [])),
            e.phase === `done` && this.lastPhase !== `done` && this.handleCompleted(e.accounts),
            (this.lastPhase = e.phase),
            this.deps.requestUpdate());
        }
        async handleCompleted(e) {
          let t = this.deps.getContext();
          if (!t) return;
          (await t.runtimeConfig.refresh({ discardPendingChanges: !0 }),
            await t.channels.refresh(!0));
          let n = e.find((e) => e.channel === `whatsapp`);
          n &&
            ((this.whatsappAccountId = n.accountId),
            await t.channels.startWhatsApp(!1, n.accountId));
        }
      }));
  }),
  $;
e(() => {
  (a(),
    u(),
    s(),
    re(),
    ie(),
    ne(),
    ce(),
    h(),
    v(),
    Ce(),
    k(),
    wt(),
    kt(),
    t(),
    ($ = class extends y {
      constructor(...e) {
        (super(...e),
          (this.nostrProfileFormState = null),
          (this.nostrProfileAccountId = null),
          (this.selectedChannel = null),
          (this.wizardHost = new Q({
            getContext: () => this.context,
            requestUpdate: () => this.requestUpdate(),
            clearSelection: () => {
              this.selectedChannel = null;
            },
          })),
          (this.schemaLoadStarted = !1),
          (this.gatewayClient = null),
          (this.gatewayConnected = !1),
          (this.hasGatewaySnapshot = !1),
          (this.nostrOperationGeneration = 0),
          (this.subscriptions = new g(this)
            .effect(
              () => this.context?.channels,
              (e) => {
                let t = this.channelsSource !== void 0 && this.channelsSource !== e;
                ((this.channelsSource = e), t && this.invalidateNostrForm());
                let n = () => {
                  this.channelsSource === e && this.requestUpdate();
                };
                return (n(), e.subscribe(n));
              },
            )
            .effect(
              () => this.context?.runtimeConfig,
              (e) => {
                this.schemaLoadStarted = !1;
                let t = () => {
                  this.context.runtimeConfig === e &&
                    (this.requestUpdate(), this.ensureInitialData());
                };
                t();
                let n = e.subscribe(t);
                return () => {
                  (n(), (this.schemaLoadStarted = !1));
                };
              },
            )
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
            )));
      }
      applyGatewaySnapshot(e, t) {
        let n = this.hasGatewaySnapshot && this.gatewayClient !== e.client,
          r = this.hasGatewaySnapshot && this.gatewayConnected !== e.connected;
        ((!this.hasGatewaySnapshot || t || n || r) && (this.nostrOperationGeneration += 1),
          (t || n || !e.connected) && this.clearNostrForm(),
          (this.hasGatewaySnapshot = !0),
          (this.gatewayClient = e.client),
          (this.gatewayConnected = e.connected),
          e.connected && e.client ? this.ensureInitialData() : (this.schemaLoadStarted = !1));
      }
      ensureInitialData() {
        let e = this.context,
          t = e.gateway.snapshot,
          n = t.client;
        if (!t.connected || !n) return;
        let r = e.channels.state,
          i = e.runtimeConfig.state;
        (!r.channelsSnapshot && !r.channelsLoading && e.channels.refresh(!1),
          !i.configSnapshot && !i.configLoading && e.runtimeConfig.ensureLoaded(),
          !i.configSchema &&
            !i.configSchemaLoading &&
            !this.schemaLoadStarted &&
            ((this.schemaLoadStarted = !0), e.runtimeConfig.ensureSchemaLoaded()));
      }
      disconnectedCallback() {
        (this.wizardHost.cancelOnDisconnect(),
          (this.selectedChannel = null),
          (this.gatewaySource = void 0),
          (this.channelsSource = void 0),
          (this.gatewayClient = null),
          (this.gatewayConnected = !1),
          (this.hasGatewaySnapshot = !1),
          this.invalidateNostrForm(),
          this.subscriptions.clear(),
          (this.schemaLoadStarted = !1),
          super.disconnectedCallback());
      }
      async saveChannelConfig() {
        let e = this.context;
        if (!e) return;
        let t = await e.runtimeConfig.save(),
          n = e.runtimeConfig.state.lastError;
        if (!t) {
          (await e.runtimeConfig.refresh(),
            n && !e.runtimeConfig.state.lastError && (e.runtimeConfig.state.lastError = n),
            this.requestUpdate());
          return;
        }
        await e.channels.refresh(!0);
      }
      async reloadChannelConfig() {
        let e = this.context;
        e &&
          (await e.runtimeConfig.refresh({ discardPendingChanges: !0 }),
          await e.channels.refresh(!0));
      }
      resolveNostrAccountId() {
        let e = this.context?.channels.state.channelsSnapshot?.channelAccounts?.nostr ?? [];
        return this.nostrProfileAccountId ?? e[0]?.accountId ?? `default`;
      }
      buildGatewayHttpHeaders(e) {
        let t = b({
          hello: e.snapshot.hello,
          settings: { token: e.connection.token },
          password: e.connection.password,
        });
        return t ? { Authorization: t } : {};
      }
      clearNostrForm() {
        ((this.nostrProfileFormState = null), (this.nostrProfileAccountId = null));
      }
      invalidateNostrForm() {
        ((this.nostrOperationGeneration += 1), this.clearNostrForm());
      }
      beginNostrOperation() {
        let e = this.context.gateway,
          t = this.context.channels,
          n = e.snapshot.client;
        if (
          !this.isConnected ||
          this.gatewaySource !== e ||
          this.channelsSource !== t ||
          !e.snapshot.connected ||
          !n
        )
          return null;
        let r = this.nostrOperationGeneration + 1;
        return (
          (this.nostrOperationGeneration = r),
          {
            generation: r,
            gateway: e,
            channels: t,
            client: n,
            formAccountId: this.nostrProfileAccountId,
            accountId: this.resolveNostrAccountId(),
            headers: this.buildGatewayHttpHeaders(e),
          }
        );
      }
      currentNostrForm(e) {
        let t = this.nostrProfileFormState;
        return !t ||
          !this.isConnected ||
          this.nostrOperationGeneration !== e.generation ||
          this.nostrProfileAccountId !== e.formAccountId ||
          this.context.gateway !== e.gateway ||
          this.context.channels !== e.channels ||
          e.gateway.snapshot.client !== e.client ||
          !e.gateway.snapshot.connected
          ? null
          : t;
      }
      editNostrProfile(e, t) {
        ((this.nostrOperationGeneration += 1),
          (this.nostrProfileAccountId = e),
          (this.nostrProfileFormState = Ee(t ?? void 0)));
      }
      cancelNostrProfile() {
        this.invalidateNostrForm();
      }
      changeNostrProfileField(e, t) {
        let n = this.nostrProfileFormState;
        n &&
          (this.nostrProfileFormState = {
            ...n,
            values: { ...n.values, [e]: t },
            fieldErrors: { ...n.fieldErrors, [e]: `` },
          });
      }
      toggleNostrProfileAdvanced() {
        let e = this.nostrProfileFormState;
        e && (this.nostrProfileFormState = { ...e, showAdvanced: !e.showAdvanced });
      }
      async saveNostrProfile() {
        let e = this.nostrProfileFormState;
        if (!e || e.saving || e.importing) return;
        let t = this.beginNostrOperation();
        if (!t) return;
        let n = { ...e, saving: !0, error: null, success: null, fieldErrors: {} };
        this.nostrProfileFormState = n;
        try {
          let { data: n, response: r } = await xe({
              accountId: t.accountId,
              headers: t.headers,
              values: e.values,
            }),
            i = this.currentNostrForm(t);
          if (!i) return;
          if (!r.ok || n?.ok === !1 || !n) {
            this.nostrProfileFormState = {
              ...i,
              saving: !1,
              error: n?.error ?? `Profile update failed (${r.status})`,
              success: null,
              fieldErrors: be(n?.details),
            };
            return;
          }
          if (!n.persisted) {
            this.nostrProfileFormState = {
              ...i,
              saving: !1,
              error: `Profile publish failed on all relays.`,
              success: null,
            };
            return;
          }
          ((this.nostrProfileFormState = {
            ...i,
            saving: !1,
            error: null,
            success: `Profile published to relays.`,
            fieldErrors: {},
            original: { ...e.values },
          }),
            await t.channels.refresh(!0));
        } catch (e) {
          let n = this.currentNostrForm(t);
          if (!n) return;
          this.nostrProfileFormState = {
            ...n,
            saving: !1,
            error: `Profile update failed: ${String(e)}`,
            success: null,
          };
        }
      }
      async importNostrProfile() {
        let e = this.nostrProfileFormState;
        if (!e || e.importing || e.saving) return;
        let t = this.beginNostrOperation();
        if (t) {
          this.nostrProfileFormState = { ...e, importing: !0, error: null, success: null };
          try {
            let { data: e, response: n } = await Se({ accountId: t.accountId, headers: t.headers }),
              r = this.currentNostrForm(t);
            if (!r) return;
            if (!n.ok || e?.ok === !1 || !e) {
              this.nostrProfileFormState = {
                ...r,
                importing: !1,
                error: e?.error ?? `Profile import failed (${n.status})`,
                success: null,
              };
              return;
            }
            let i = e.merged ?? e.imported ?? null,
              a = i ? { ...r.values, ...i } : r.values;
            ((this.nostrProfileFormState = {
              ...r,
              importing: !1,
              values: a,
              error: null,
              success: e.saved
                ? `Profile imported from relays. Review and publish.`
                : `Profile imported. Review and publish.`,
              showAdvanced: !!(a.banner || a.website || a.nip05 || a.lud16),
            }),
              e.saved && (await t.channels.refresh(!0)));
          } catch (e) {
            let n = this.currentNostrForm(t);
            if (!n) return;
            this.nostrProfileFormState = {
              ...n,
              importing: !1,
              error: `Profile import failed: ${String(e)}`,
              success: null,
            };
          }
        }
      }
      render() {
        let e = this.context,
          t = e.channels.state,
          n = e.runtimeConfig.state;
        return l`
      <section class="content-header">
        <div>
          <div class="page-title">${te(`channels`)}</div>
        </div>
      </section>
      ${se(
        ht({
          connected: t.connected,
          loading: t.channelsLoading,
          snapshot: t.channelsSnapshot,
          lastError: t.channelsError,
          lastSuccessAt: t.channelsLastSuccess,
          whatsappMessage: t.whatsappLoginMessage,
          whatsappQrDataUrl: t.whatsappLoginQrDataUrl,
          whatsappConnected: t.whatsappLoginConnected,
          whatsappBusy: t.whatsappBusy,
          configSchema: n.configSchema,
          configSchemaLoading: n.configSchemaLoading,
          configForm: n.configForm,
          configUiHints: n.configUiHints,
          configSaving: n.configSaving,
          configFormDirty: n.configFormDirty,
          nostrProfileFormState: this.nostrProfileFormState,
          nostrProfileAccountId: this.nostrProfileAccountId,
          selectedChannel: this.selectedChannel,
          wizard: this.wizardHost.state,
          wizardMultiselect: this.wizardHost.multiselect,
          setupBlockedByDirtyConfig: this.wizardHost.blockedByDirtyConfig,
          onShowDetail: (e) => {
            this.selectedChannel = e;
          },
          onCloseDetail: () => {
            this.selectedChannel = null;
          },
          onStartSetup: (e) => this.wizardHost.startSetup(e),
          onWizardAnswer: (e) => this.wizardHost.answer(e),
          onWizardToggleMultiselect: (e) => this.wizardHost.toggleMultiselect(e),
          onWizardClose: () => this.wizardHost.close(),
          onRefresh: (t) => void e.channels.refresh(t),
          onWhatsAppStart: (t) =>
            void e.channels.startWhatsApp(t, this.wizardHost.whatsappAccountId),
          onWhatsAppWait: () => void e.channels.waitWhatsApp(this.wizardHost.whatsappAccountId),
          onWhatsAppLogout: () => void e.channels.logoutWhatsApp(),
          onConfigPatch: (t, n) => e.runtimeConfig.patchForm(t, n),
          onConfigSave: () => void this.saveChannelConfig(),
          onConfigReload: () => void this.reloadChannelConfig(),
          onNostrProfileEdit: (e, t) => this.editNostrProfile(e, t),
          onNostrProfileCancel: () => this.cancelNostrProfile(),
          onNostrProfileFieldChange: (e, t) => this.changeNostrProfileField(e, t),
          onNostrProfileSave: () => void this.saveNostrProfile(),
          onNostrProfileImport: () => void this.importNostrProfile(),
          onNostrProfileToggleAdvanced: () => this.toggleNostrProfileAdvanced(),
        }),
      )}
    `;
      }
    }),
    n([o({ context: ee, subscribe: !0 })], $.prototype, `context`, void 0),
    n([c()], $.prototype, `nostrProfileFormState`, void 0),
    n([c()], $.prototype, `nostrProfileAccountId`, void 0),
    n([c()], $.prototype, `selectedChannel`, void 0),
    customElements.get(`openclaw-channels-page`) ||
      customElements.define(`openclaw-channels-page`, $));
})();
//# sourceMappingURL=channels-page-VdOJ_iVp.js.map
