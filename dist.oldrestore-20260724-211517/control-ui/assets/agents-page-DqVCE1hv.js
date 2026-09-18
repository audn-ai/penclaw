const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f || (m.f = ["./preview-DzpTTA8I.js", "./rolldown-runtime-DaJ6WEGw.js"]),
) => i.map((i) => d[i]);
import {
  K as rt,
  dt as it,
  j as at,
  k as ot,
  nt as st,
  q as ct,
} from "./control-ui-core--EZfp09c.js";
import {
  Ar as oe,
  Br as se,
  Ci as ce,
  Ei as le,
  Er as ue,
  Fr as de,
  Gr as fe,
  Hr as pe,
  Ir as me,
  J as T,
  K as E,
  Kr as he,
  Lr as ge,
  Mr as _e,
  Nr as ve,
  Or as ye,
  Pr as be,
  Q as xe,
  Rn as Se,
  Rr as Ce,
  Si as we,
  Tt as Te,
  Ur as Ee,
  Vr as De,
  Wa as Oe,
  Wn as ke,
  Wr as Ae,
  Zi as je,
  at as Me,
  bt as Ne,
  da as Pe,
  di as Fe,
  ea as Ie,
  et as Le,
  fi as Re,
  gt as ze,
  ht as Be,
  ii as Ve,
  it as He,
  ji as Ue,
  jr as We,
  kr as Ge,
  la as Ke,
  lt as qe,
  ni as Je,
  nt as Ye,
  ot as Xe,
  q as Ze,
  rt as Qe,
  st as $e,
  ut as et,
  vi as tt,
  zr as nt,
} from "./control-ui-core-BcbHa4vB.js";
import {
  $ as lt,
  F as ut,
  I as dt,
  J as ft,
  N as pt,
  P as mt,
  Q as k,
  x as ht,
} from "./control-ui-core-CQDTaMS5.js";
import { o as D, t as O } from "./control-ui-core-CwQmiouz.js";
import { b as s, dt as c, ft as l, y as u } from "./control-ui-foundation-0uuDj0X3.js";
import {
  _ as t,
  c as n,
  g as r,
  u as i,
  v as a,
  y as o,
} from "./control-ui-foundation-CCDffryi.js";
import {
  $ as te,
  D as b,
  J as ne,
  M as x,
  T as S,
  at as re,
  nt as C,
  w as ie,
} from "./control-ui-foundation-s2wA1PVE.js";
import { d as gt, f as _t } from "./control-ui-shared-CrnVqnQR.js";
import { n as ae, r as w } from "./gateway-runtime-D6zABMsO.js";
import {
  G as d,
  R as f,
  Y as p,
  Z as m,
  _ as h,
  at as g,
  et as _,
  h as ee,
  nt as v,
  z as y,
} from "./lit-runtime-DkvDG939.js";
import { a as Nt, n as Pt } from "./markdown-ERFX4kV-.js";
import { L as jt, R as Mt } from "./markdown-runtime-BBD8XmVB.js";
import { a as Ft, n as It, r as Lt, s as Rt, t as zt } from "./presenter-CnPyKQkg.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
import {
  f as bt,
  l as xt,
  n as A,
  o as j,
  s as M,
  t as St,
  u as Ct,
} from "./settings-ui-T0X7dZpU.js";
import { n as vt, t as yt } from "./settings-workspace-DRQpceJK.js";
import {
  a as wt,
  c as Tt,
  n as Et,
  o as Dt,
  r as Ot,
  s as kt,
  t as At,
} from "./skills-shared-C-zd7erd.js";
function Bt(e, t) {
  if (!e) return e;
  let n = e.files.some((e) => e.name === t.name)
    ? e.files.map((e) => (e.name === t.name ? t : e))
    : [...e.files, t];
  return { ...e, files: n };
}
async function Vt(e, t, n, r) {
  let i = e.client;
  if (!i || !e.connected || e.agentFilesLoading) return !1;
  if (!r?.force && Object.hasOwn(e.agentFileContents, n)) return !0;
  let a = e.requestGeneration,
    o = () => e.client === i && e.connected && e.requestGeneration === a;
  ((e.agentFilesLoading = !0), (e.agentFilesError = null));
  try {
    let a = await i.request(`agents.files.get`, { agentId: t, name: n });
    if (a?.file && o()) {
      let t = a.file.content ?? ``,
        i = e.agentFileContents[n] ?? ``,
        o = e.agentFileDrafts[n],
        s = r?.preserveDraft ?? !0;
      return (
        (e.agentFilesList = Bt(e.agentFilesList, a.file)),
        (e.agentFileContents = { ...e.agentFileContents, [n]: t }),
        (!s || !Object.hasOwn(e.agentFileDrafts, n) || o === i) &&
          (e.agentFileDrafts = { ...e.agentFileDrafts, [n]: t }),
        !0
      );
    }
  } catch (t) {
    return (o() && (e.agentFilesError = String(t)), !1);
  } finally {
    o() && (e.agentFilesLoading = !1);
  }
  return !1;
}
async function Ht(e, t, n, r) {
  let i = e.client;
  if (!i || !e.connected || e.agentFileSaving) return;
  let a = e.requestGeneration,
    o = () => e.client === i && e.connected && e.requestGeneration === a;
  ((e.agentFileSaving = !0), (e.agentFilesError = null));
  try {
    let a = await i.request(`agents.files.set`, { agentId: t, name: n, content: r });
    a?.file &&
      o() &&
      ((e.agentFilesList = Bt(e.agentFilesList, a.file)),
      (e.agentFileContents = { ...e.agentFileContents, [n]: r }),
      (!Object.hasOwn(e.agentFileDrafts, n) || e.agentFileDrafts[n] === r) &&
        (e.agentFileDrafts = { ...e.agentFileDrafts, [n]: r }));
  } catch (t) {
    o() && (e.agentFilesError = String(t));
  } finally {
    o() && (e.agentFileSaving = !1);
  }
}
var Ut = e(() => {});
function Wt(e) {
  return e && e.length <= Jt ? e : null;
}
function Gt(e) {
  return new Promise((t) => {
    let n = new FileReader();
    (n.addEventListener(`load`, () => t(Wt(typeof n.result == `string` ? n.result : null))),
      n.addEventListener(`error`, () => t(null)),
      n.readAsDataURL(e));
  });
}
async function Kt(e) {
  if (!e.type.startsWith(`image/`) || e.size > 2097152) return null;
  try {
    let t = await createImageBitmap(e),
      n = Math.min(1, qt / Math.max(t.width, t.height)),
      r = Math.max(1, Math.round(t.width * n)),
      i = Math.max(1, Math.round(t.height * n)),
      a = document.createElement(`canvas`);
    ((a.width = r), (a.height = i));
    let o = a.getContext(`2d`);
    if (!o) return Gt(e);
    (o.drawImage(t, 0, 0, r, i), t.close());
    let s = a.toDataURL(`image/webp`, 0.8);
    return Wt(s.startsWith(`data:image/webp`) ? s : a.toDataURL(`image/png`));
  } catch {
    return Gt(e);
  }
}
var qt,
  Jt,
  Yt = e(() => {
    (n(), (qt = 96), (Jt = 16e3));
  });
function Xt(e) {
  let t = (nn.get(e) ?? 0) + 1;
  return (nn.set(e, t), t);
}
function Zt(e) {
  (Xt(e),
    (e.identityDraft = { name: null, emoji: null, avatar: null }),
    (e.identitySaving = !1),
    (e.identityError = null));
}
function Qt(e, t, n) {
  ((e.identityDraft = { ...e.identityDraft, [t]: n }), (e.identityError = null));
}
function $t(e, t) {
  let n = Xt(e);
  Kt(t).then((t) => {
    nn.get(e) === n &&
      (t
        ? ((e.identityDraft = { ...e.identityDraft, avatar: t }), (e.identityError = null))
        : (e.identityError = D(`agents.identity.imageUnusable`)));
  });
}
async function en(e) {
  let { host: t, agentId: n, agents: r, agentIdentity: i } = e,
    a = t.identityDraft,
    o = a.name?.trim(),
    s = a.emoji?.trim(),
    c = a.avatar ?? void 0;
  if (!((a.name !== null && !o) || (a.emoji !== null && !s))) {
    if (!o && !s && !c) {
      Zt(t);
      return;
    }
    ((t.identitySaving = !0), (t.identityError = null));
    try {
      (await Xe(e.client, { agentId: n, name: o, emoji: s, avatar: c }),
        i.invalidate([n]),
        await r.refreshList(),
        await i.ensure([n]),
        e.isCurrent() && (Zt(t), e.onSaved()));
    } catch (n) {
      e.isCurrent() && (t.identityError = String(n));
    } finally {
      e.isCurrent() && (t.identitySaving = !1);
    }
  }
}
function tn(e, t) {
  let n = e.snapshot.pinnedAgentIds,
    r = n.includes(t) ? n.filter((e) => e !== t) : [...n, t];
  e.update({ pinnedAgentIds: r });
}
var nn,
  rn = e(() => {
    (O(), Ye(), Yt(), (nn = new WeakMap()));
  });
function an(e, t) {
  return Ze(E(e.state), t);
}
function on(e, t) {
  let n = E(e.state)?.agents?.list,
    r = Array.isArray(n) ? n[t]?.model : void 0;
  return { path: [`agents`, `list`, t, `model`], existing: r };
}
function sn(e, t, n) {
  let r = n ? e.ensureAgentEntry(t) : an(e, t);
  if (r < 0) return;
  let i = on(e, r);
  if (!n) e.removeFormValue(i.path);
  else if (i.existing && typeof i.existing == `object`) {
    let t = i.existing.fallbacks;
    e.patchForm(i.path, { primary: n, ...(Array.isArray(t) ? { fallbacks: t } : {}) });
  } else e.patchForm(i.path, n);
}
function cn(e, t, n) {
  let r = E(e.state),
    i = ne(n),
    a = ge(r, t),
    o = Ee(a.entry?.model) ?? Ee(a.defaults?.model),
    s = se(a.entry?.model, a.defaults?.model),
    c =
      i.length > 0
        ? o
          ? e.ensureAgentEntry(t)
          : -1
        : (s?.length ?? 0) > 0 || an(e, t) >= 0
          ? e.ensureAgentEntry(t)
          : -1;
  if (c < 0) return;
  let l = on(e, c),
    u =
      typeof l.existing == `string`
        ? l.existing.trim()
        : l.existing && typeof l.existing == `object` && typeof l.existing.primary == `string`
          ? l.existing.primary.trim()
          : ``;
  i.length === 0
    ? u || o
      ? e.patchForm(l.path, u || o)
      : e.removeFormValue(l.path)
    : (u || o) && e.patchForm(l.path, { primary: u || o, fallbacks: i });
}
var ln = e(() => {
  (We(), T(), Oe());
});
async function un(e, t) {
  let n = e.client;
  if (!n || !e.connected || e.agentSkillsLoading) return;
  let r = e.requestGeneration,
    i = () => e.client === n && e.connected && e.requestGeneration === r;
  ((e.agentSkillsLoading = !0), (e.agentSkillsError = null));
  try {
    let r = await Te(n, t);
    r && i() && ((e.agentSkillsReport = r), (e.agentSkillsAgentId = t));
  } catch (t) {
    i() && (e.agentSkillsError = String(t));
  } finally {
    i() && (e.agentSkillsLoading = !1);
  }
}
var dn = e(() => {
    Ne();
  }),
  N,
  fn = e(() => {
    (s(),
      u(),
      _(),
      d(),
      O(),
      We(),
      Je(),
      Pe(),
      lt(),
      t(),
      (N = class extends Ke {
        constructor(...e) {
          (super(...e),
            (this.agents = []),
            (this.selectedId = null),
            (this.defaultId = null),
            (this.identityById = {}),
            (this.authToken = null),
            (this.disabled = !1),
            (this.onSelect = () => {}),
            (this.avatarBlobUrlByRoute = new Map()),
            (this.avatarRoutesPending = new Set()),
            (this.handleSelect = (e) => {
              let t = e.detail.item,
                n = t.value ?? t.getAttribute(`value`);
              if (n) {
                if (n === this.selectedId) {
                  (e.preventDefault(), (t.checked = !0));
                  let n = e.currentTarget;
                  (n.querySelector(`[slot="trigger"]`)?.focus({ preventScroll: !0 }),
                    (n.open = !1));
                  return;
                }
                this.onSelect(n);
              }
            }));
        }
        disconnectedCallback() {
          (this.releaseAvatarBlobUrls(), super.disconnectedCallback());
        }
        willUpdate(e) {
          e.has(`authToken`) && this.releaseAvatarBlobUrls();
        }
        releaseAvatarBlobUrls() {
          for (let e of this.avatarBlobUrlByRoute.values()) e && URL.revokeObjectURL(e);
          (this.avatarBlobUrlByRoute.clear(), this.avatarRoutesPending.clear());
        }
        ensureLocalAvatar(e, t) {
          this.avatarRoutesPending.has(e) ||
            (this.avatarRoutesPending.add(e),
            fetch(e, { headers: { Authorization: `Bearer ${t}` } })
              .then(async (e) => (e.ok ? URL.createObjectURL(await e.blob()) : ``))
              .catch(() => ``)
              .then((n) => {
                if (
                  (this.avatarRoutesPending.delete(e), !this.isConnected || this.authToken !== t)
                ) {
                  n && URL.revokeObjectURL(n);
                  return;
                }
                (this.avatarBlobUrlByRoute.set(e, n), n && this.requestUpdate());
              }));
        }
        renderAvatar(e) {
          let t = this.identityById[e.id] ?? null,
            n = Ve(e, t),
            r = n ? this.resolveRenderableAvatarUrl(n) : null;
          if (r) return g`<img class="agent-select__avatar" src=${r} alt="" loading="lazy" />`;
          let i = nt(e, t),
            a = (be(e)[0] ?? `?`).toUpperCase();
          return g`
      <span class="agent-select__avatar agent-select__avatar--text" aria-hidden="true"
        >${i ?? a}</span
      >
    `;
        }
        resolveRenderableAvatarUrl(e) {
          if (!this.authToken || !e.startsWith(`/`)) return e;
          let t = this.avatarBlobUrlByRoute.get(e);
          return t === void 0 ? (this.ensureLocalAvatar(e, this.authToken), null) : t || null;
        }
        render() {
          let e =
              this.agents.find((e) => e.id === this.selectedId) ??
              this.agents.find((e) => e.id === this.defaultId) ??
              this.agents[0],
            t = e ? ue(e.id, this.defaultId) : null,
            n = this.disabled || this.agents.length === 0;
          return g`
      <wa-dropdown class="agent-select" placement="bottom-start" @wa-select=${this.handleSelect}>
        <button slot="trigger" type="button" class="agent-select__trigger" ?disabled=${n}>
          ${
            e
              ? g`
                ${this.renderAvatar(e)}
                <span class="agent-select__label">${be(e)}</span>
                ${t ? g`<span class="agent-select__badge">${t}</span>` : v}
              `
              : g`<span class="agent-select__label">${D(`agents.noAgents`)}</span>`
          }
          <span class="agent-select__chevron" aria-hidden="true">${k.chevronDown}</span>
        </button>
        ${this.agents.map((e) => {
          let t = ue(e.id, this.defaultId),
            n = e.id === this.selectedId;
          return g`
            <wa-dropdown-item
              class="agent-select__option"
              data-agent-id=${e.id}
              .value=${e.id}
              type="checkbox"
              .checked=${n}
            >
              <span slot="icon">${this.renderAvatar(e)}</span>
              <span class="agent-select__option-label">${be(e)}</span>
              ${t ? g`<span slot="details" class="agent-select__badge">${t}</span>` : v}
            </wa-dropdown-item>
          `;
        })}
      </wa-dropdown>
    `;
        }
      }),
      r([m({ attribute: !1 })], N.prototype, `agents`, void 0),
      r([m({ attribute: !1 })], N.prototype, `selectedId`, void 0),
      r([m({ attribute: !1 })], N.prototype, `defaultId`, void 0),
      r([m({ attribute: !1 })], N.prototype, `identityById`, void 0),
      r([m({ attribute: !1 })], N.prototype, `authToken`, void 0),
      r([m({ attribute: !1 })], N.prototype, `disabled`, void 0),
      r([m({ attribute: !1 })], N.prototype, `onSelect`, void 0));
  }),
  pn = e(() => {
    (fn(),
      customElements.get(`openclaw-agent-select`) ||
        customElements.define(`openclaw-agent-select`, N));
  }),
  mn = e(() => {});
function hn(e = {}) {
  return {
    client: e.client ?? null,
    connected: e.connected ?? !1,
    hello: e.hello ?? null,
    configSnapshot: e.configSnapshot ?? null,
    applySessionKey: e.applySessionKey ?? `main`,
    selectedAgentId: e.selectedAgentId ?? null,
    dreamingStatusLoading: !1,
    dreamingStatusError: null,
    dreamingStatus: null,
    dreamingModeSaving: !1,
    dreamDiaryLoading: !1,
    dreamDiaryActionLoading: !1,
    dreamDiaryActionMessage: null,
    dreamDiaryActionArchivePath: null,
    dreamDiaryError: null,
    dreamDiaryPath: null,
    dreamDiaryContent: null,
    wikiImportInsightsLoading: !1,
    wikiImportInsightsError: null,
    wikiImportInsights: null,
    wikiMemoryPalaceLoading: !1,
    wikiMemoryPalaceError: null,
    wikiMemoryPalace: null,
    lastError: null,
  };
}
function gn(e) {
  return typeof globalThis.confirm == `function` ? globalThis.confirm(e) : !0;
}
function _n(e) {
  return ze(e.configSnapshot, or, { enabledByDefault: !1 });
}
function vn(e, t) {
  let n = w(e, t);
  return n === null ? _n(e) : n;
}
function yn(e, t) {
  switch (e) {
    case `doctor.memory.dedupeDreamDiary`: {
      let e =
          typeof t?.dedupedEntries == `number`
            ? t.dedupedEntries
            : typeof t?.removedEntries == `number`
              ? t.removedEntries
              : 0,
        n = typeof t?.keptEntries == `number` ? t.keptEntries : void 0;
      return n === void 0
        ? `Removed ${e} duplicate dream ${e === 1 ? `entry` : `entries`}.`
        : `Removed ${e} duplicate dream ${e === 1 ? `entry` : `entries`} and kept ${n}.`;
    }
    case `doctor.memory.repairDreamingArtifacts`: {
      let e = [],
        n = P(t?.archiveDir);
      return (
        t?.archivedSessionCorpus === !0 && e.push(`archived session corpus`),
        t?.archivedSessionIngestion === !0 && e.push(`archived ingestion state`),
        t?.archivedDreamsDiary === !0 && e.push(`archived dream diary`),
        e.length === 0
          ? `Dream cache repair finished with no changes.`
          : n
            ? `Dream cache repair complete: ${e.join(`, `)}. Archive: ${n}`
            : `Dream cache repair complete: ${e.join(`, `)}.`
      );
    }
    case `doctor.memory.backfillDreamDiary`:
      return `Backfilled ${typeof t?.written == `number` ? t.written : 0} dream diary entries.`;
    case `doctor.memory.resetDreamDiary`:
      return `Removed ${typeof t?.removedEntries == `number` ? t.removedEntries : 0} backfilled dream diary entries.`;
    case `doctor.memory.resetGroundedShortTerm`:
      return `Cleared ${typeof t?.removedShortTermEntries == `number` ? t.removedShortTermEntries : 0} replayed short-term entries.`;
  }
  return `Dream diary action complete.`;
}
function P(e) {
  if (typeof e != `string`) return;
  let t = e.trim();
  return t.length > 0 ? t : void 0;
}
function F(e) {
  return P(e.selectedAgentId) ?? null;
}
function bn(e) {
  return e ? { agentId: e } : {};
}
function xn(e) {
  return bn(F(e));
}
function Sn(e, t = !1) {
  return typeof e == `boolean` ? e : t;
}
function I(e, t = 0) {
  return typeof e != `number` || !Number.isFinite(e) ? t : Math.max(0, Math.floor(e));
}
function Cn(e, t = 0) {
  return typeof e != `number` || !Number.isFinite(e) ? t : Math.max(0, Math.min(1, e));
}
function wn(e) {
  let t = P(e)?.toLowerCase();
  return t === `inline` || t === `separate` || t === `both` ? t : `inline`;
}
function Tn(e) {
  return typeof e == `number` && Number.isFinite(e) ? e : void 0;
}
function En(e) {
  return {
    enabled: Sn(e?.enabled, !1),
    cron: P(e?.cron) ?? ``,
    managedCronPresent: Sn(e?.managedCronPresent, !1),
    ...(Tn(e?.nextRunAtMs) === void 0 ? {} : { nextRunAtMs: Tn(e?.nextRunAtMs) }),
  };
}
function Dn(e) {
  let t = P(C(C(e?.plugins)?.slots)?.memory);
  return t && t.toLowerCase() !== `none` ? t : ar;
}
function On(e) {
  let t = Dn(e);
  return {
    pluginId: t,
    enabled: Sn(C(C(C(C(C(e?.plugins)?.entries)?.[t])?.config)?.dreaming)?.enabled, !1),
  };
}
function kn(e) {
  let t = C(e),
    n = P(t?.key),
    r = P(t?.path),
    i = P(t?.snippet);
  if (!n || !r || !i) return null;
  let a = P(t?.promotedAt),
    o = P(t?.lastRecalledAt);
  return {
    key: n,
    path: r,
    startLine: Math.max(1, I(t?.startLine, 1)),
    endLine: Math.max(1, I(t?.endLine, 1)),
    snippet: i,
    recallCount: I(t?.recallCount, 0),
    dailyCount: I(t?.dailyCount, 0),
    groundedCount: I(t?.groundedCount, 0),
    totalSignalCount: I(t?.totalSignalCount, 0),
    lightHits: I(t?.lightHits, 0),
    remHits: I(t?.remHits, 0),
    phaseHitCount: I(t?.phaseHitCount, 0),
    ...(a ? { promotedAt: a } : {}),
    ...(o ? { lastRecalledAt: o } : {}),
  };
}
function An(e) {
  return Array.isArray(e) ? e.map((e) => kn(e)).filter((e) => e !== null) : [];
}
function L(e) {
  return Array.isArray(e) ? e.filter((e) => typeof e == `string` && e.trim().length > 0) : [];
}
function jn(e) {
  let t = C(e),
    n = P(t?.pagePath),
    r = P(t?.title),
    i = P(t?.riskLevel),
    a = P(t?.topicKey),
    o = P(t?.topicLabel),
    s = P(t?.digestStatus),
    c = P(t?.summary);
  return !n ||
    !r ||
    !a ||
    !o ||
    !c ||
    (i !== `low` && i !== `medium` && i !== `high` && i !== `unknown`) ||
    (s !== `available` && s !== `withheld`)
    ? null
    : {
        pagePath: n,
        title: r,
        riskLevel: i,
        riskReasons: L(t?.riskReasons),
        labels: L(t?.labels),
        topicKey: a,
        topicLabel: o,
        digestStatus: s,
        activeBranchMessages: I(t?.activeBranchMessages, 0),
        userMessageCount: I(t?.userMessageCount, 0),
        assistantMessageCount: I(t?.assistantMessageCount, 0),
        ...(P(t?.firstUserLine) ? { firstUserLine: P(t?.firstUserLine) } : {}),
        ...(P(t?.lastUserLine) ? { lastUserLine: P(t?.lastUserLine) } : {}),
        ...(P(t?.assistantOpener) ? { assistantOpener: P(t?.assistantOpener) } : {}),
        summary: c,
        candidateSignals: L(t?.candidateSignals),
        correctionSignals: L(t?.correctionSignals),
        preferenceSignals: L(t?.preferenceSignals),
        ...(P(t?.createdAt) ? { createdAt: P(t?.createdAt) } : {}),
        ...(P(t?.updatedAt) ? { updatedAt: P(t?.updatedAt) } : {}),
      };
}
function Mn(e) {
  let t = C(e),
    n = P(t?.key),
    r = P(t?.label);
  if (!n || !r) return null;
  let i = Array.isArray(t?.items) ? t.items.map((e) => jn(e)).filter((e) => e !== null) : [];
  return {
    key: n,
    label: r,
    itemCount: I(t?.itemCount, i.length),
    highRiskCount: I(t?.highRiskCount, i.filter((e) => e.riskLevel === `high`).length),
    withheldCount: I(t?.withheldCount, i.filter((e) => e.digestStatus === `withheld`).length),
    preferenceSignalCount: I(
      t?.preferenceSignalCount,
      i.reduce((e, t) => e + t.preferenceSignals.length, 0),
    ),
    ...(P(t?.updatedAt) ? { updatedAt: P(t?.updatedAt) } : {}),
    items: i,
  };
}
function Nn(e) {
  let t = C(e),
    n = Array.isArray(t?.clusters) ? t.clusters.map((e) => Mn(e)).filter((e) => e !== null) : [];
  return {
    sourceType: (t?.sourceType, `chatgpt`),
    totalItems: I(t?.totalItems, n.reduce((e, t) => e + t.itemCount, 0)),
    totalClusters: I(t?.totalClusters, n.length),
    clusters: n,
  };
}
function Pn(e) {
  return e === `entity` || e === `concept` || e === `source` || e === `synthesis` || e === `report`
    ? e
    : void 0;
}
function Fn() {
  return { synthesis: 0, entity: 0, concept: 0, source: 0, report: 0 };
}
function In(e, t) {
  let n = C(e);
  return {
    synthesis: I(n?.synthesis, t.synthesis),
    entity: I(n?.entity, t.entity),
    concept: I(n?.concept, t.concept),
    source: I(n?.source, t.source),
    report: I(n?.report, t.report),
  };
}
function Ln(e) {
  return e.synthesis + e.entity + e.concept + e.source + e.report;
}
function Rn(e) {
  let t = C(e),
    n = P(t?.pagePath),
    r = P(t?.title),
    i = Pn(t?.kind);
  return !n || !r || !i
    ? null
    : {
        pagePath: n,
        title: r,
        kind: i,
        ...(P(t?.id) ? { id: P(t?.id) } : {}),
        ...(P(t?.updatedAt) ? { updatedAt: P(t?.updatedAt) } : {}),
        ...(P(t?.sourceType) ? { sourceType: P(t?.sourceType) } : {}),
        claimCount: I(t?.claimCount, 0),
        questionCount: I(t?.questionCount, 0),
        contradictionCount: I(t?.contradictionCount, 0),
        claims: L(t?.claims),
        questions: L(t?.questions),
        contradictions: L(t?.contradictions),
        ...(P(t?.snippet) ? { snippet: P(t?.snippet) } : {}),
      };
}
function zn(e) {
  let t = C(e),
    n = Pn(t?.key),
    r = P(t?.label);
  if (!n || !r) return null;
  let i = Array.isArray(t?.items) ? t.items.map((e) => Rn(e)).filter((e) => e !== null) : [];
  return {
    key: n,
    label: r,
    itemCount: I(t?.itemCount, i.length),
    claimCount: I(t?.claimCount, i.reduce((e, t) => e + t.claimCount, 0)),
    questionCount: I(t?.questionCount, i.reduce((e, t) => e + t.questionCount, 0)),
    contradictionCount: I(t?.contradictionCount, i.reduce((e, t) => e + t.contradictionCount, 0)),
    ...(P(t?.updatedAt) ? { updatedAt: P(t?.updatedAt) } : {}),
    items: i,
  };
}
function Bn(e) {
  let t = C(e),
    n = Array.isArray(t?.clusters) ? t.clusters.map((e) => zn(e)).filter((e) => e !== null) : [],
    r = I(t?.totalItems, n.reduce((e, t) => e + t.itemCount, 0)),
    i = Fn();
  for (let e of n) i[e.key] += e.itemCount;
  let a = In(t?.pageCounts, i),
    o = Ln(a) || r;
  return {
    totalItems: r,
    totalPages: I(t?.totalPages, o),
    pageCounts: a,
    totalClaims: I(t?.totalClaims, n.reduce((e, t) => e + t.claimCount, 0)),
    totalQuestions: I(t?.totalQuestions, n.reduce((e, t) => e + t.questionCount, 0)),
    totalContradictions: I(t?.totalContradictions, n.reduce((e, t) => e + t.contradictionCount, 0)),
    clusters: n,
  };
}
function Vn(e) {
  let t = C(e);
  if (!t) return null;
  let n = C(t.phases),
    r = C(n?.light),
    i = C(n?.deep),
    a = C(n?.rem),
    o =
      r && i && a
        ? {
            light: { ...En(r), lookbackDays: I(r.lookbackDays, 0), limit: I(r.limit, 0) },
            deep: {
              ...En(i),
              limit: I(i.limit, 0),
              minScore: Cn(i.minScore, 0),
              minRecallCount: I(i.minRecallCount, 0),
              minUniqueQueries: I(i.minUniqueQueries, 0),
              recencyHalfLifeDays: I(i.recencyHalfLifeDays, 0),
              ...(typeof i.maxAgeDays == `number` && Number.isFinite(i.maxAgeDays)
                ? { maxAgeDays: I(i.maxAgeDays, 0) }
                : {}),
              ...(typeof i.maxPromotedSnippetTokens == `number` &&
              Number.isFinite(i.maxPromotedSnippetTokens)
                ? { maxPromotedSnippetTokens: I(i.maxPromotedSnippetTokens, 0) }
                : {}),
            },
            rem: {
              ...En(a),
              lookbackDays: I(a.lookbackDays, 0),
              limit: I(a.limit, 0),
              minPatternStrength: Cn(a.minPatternStrength, 0),
            },
          }
        : void 0,
    s = P(t.timezone),
    c = P(t.storePath),
    l = P(t.phaseSignalPath),
    u = P(t.storeError),
    d = P(t.phaseSignalError);
  return {
    enabled: Sn(t.enabled, !1),
    ...(s ? { timezone: s } : {}),
    verboseLogging: Sn(t.verboseLogging, !1),
    storageMode: wn(t.storageMode),
    separateReports: Sn(t.separateReports, !1),
    shortTermCount: I(t.shortTermCount, 0),
    recallSignalCount: I(t.recallSignalCount, 0),
    dailySignalCount: I(t.dailySignalCount, 0),
    groundedSignalCount: I(t.groundedSignalCount, 0),
    totalSignalCount: I(t.totalSignalCount, 0),
    phaseSignalCount: I(t.phaseSignalCount, 0),
    lightPhaseHitCount: I(t.lightPhaseHitCount, 0),
    remPhaseHitCount: I(t.remPhaseHitCount, 0),
    promotedTotal: I(t.promotedTotal, 0),
    promotedToday: I(t.promotedToday, 0),
    ...(c ? { storePath: c } : {}),
    ...(l ? { phaseSignalPath: l } : {}),
    ...(u ? { storeError: u } : {}),
    ...(d ? { phaseSignalError: d } : {}),
    shortTermEntries: An(t.shortTermEntries),
    signalEntries: An(t.signalEntries),
    promotedEntries: An(t.promotedEntries),
    ...(o ? { phases: o } : {}),
  };
}
async function Hn(e) {
  if (!e.client || !e.connected) return;
  let t = F(e);
  if (e.dreamingStatusLoading && e.dreamingStatusRequestAgentId === t) return;
  e.dreamingStatusAgentId !== t && (e.dreamingStatus = null);
  let n = (e.dreamingStatusRequestGeneration ?? 0) + 1;
  ((e.dreamingStatusRequestGeneration = n),
    (e.dreamingStatusActiveRequestGeneration = n),
    (e.dreamingStatusRequestAgentId = t),
    (e.dreamingStatusLoading = !0),
    (e.dreamingStatusError = null));
  try {
    let r = await e.client.request(`doctor.memory.status`, bn(t));
    if (
      e.dreamingStatusActiveRequestGeneration !== n ||
      e.dreamingStatusRequestAgentId !== t ||
      F(e) !== t
    )
      return;
    ((e.dreamingStatus = Vn(r?.dreaming)), (e.dreamingStatusAgentId = t));
  } catch (r) {
    e.dreamingStatusActiveRequestGeneration === n &&
      e.dreamingStatusRequestAgentId === t &&
      F(e) === t &&
      (e.dreamingStatusError = String(r));
  } finally {
    e.dreamingStatusActiveRequestGeneration === n &&
      ((e.dreamingStatusLoading = !1),
      (e.dreamingStatusRequestAgentId = null),
      (e.dreamingStatusActiveRequestGeneration = null));
  }
}
async function Un(e) {
  if (!e.client || !e.connected) return;
  let t = F(e);
  if (e.dreamDiaryLoading && e.dreamDiaryRequestAgentId === t) return;
  e.dreamDiaryAgentId !== t && ((e.dreamDiaryPath = null), (e.dreamDiaryContent = null));
  let n = (e.dreamDiaryRequestGeneration ?? 0) + 1;
  ((e.dreamDiaryRequestGeneration = n),
    (e.dreamDiaryActiveRequestGeneration = n),
    (e.dreamDiaryRequestAgentId = t),
    (e.dreamDiaryLoading = !0),
    (e.dreamDiaryError = null));
  try {
    let r = await e.client.request(`doctor.memory.dreamDiary`, bn(t));
    if (e.dreamDiaryActiveRequestGeneration !== n || e.dreamDiaryRequestAgentId !== t || F(e) !== t)
      return;
    let i = P(r?.path) ?? ir;
    (r?.found === !0
      ? ((e.dreamDiaryPath = i),
        (e.dreamDiaryContent = typeof r?.content == `string` ? r.content : ``))
      : ((e.dreamDiaryPath = i), (e.dreamDiaryContent = null)),
      (e.dreamDiaryAgentId = t));
  } catch (r) {
    e.dreamDiaryActiveRequestGeneration === n &&
      e.dreamDiaryRequestAgentId === t &&
      F(e) === t &&
      (e.dreamDiaryError = String(r));
  } finally {
    e.dreamDiaryActiveRequestGeneration === n &&
      ((e.dreamDiaryLoading = !1),
      (e.dreamDiaryRequestAgentId = null),
      (e.dreamDiaryActiveRequestGeneration = null));
  }
}
async function Wn(e) {
  if (!e.client || !e.connected) return;
  let t = F(e);
  if (e.wikiImportInsightsLoading && e.wikiImportInsightsRequestAgentId === t) return;
  if (
    (e.wikiImportInsightsAgentId !== t && (e.wikiImportInsights = null),
    !vn(e, `wiki.importInsights`))
  ) {
    ((e.wikiImportInsightsActiveRequestGeneration = null),
      (e.wikiImportInsightsRequestAgentId = null),
      (e.wikiImportInsightsLoading = !1),
      (e.wikiImportInsights = null),
      (e.wikiImportInsightsError = null));
    return;
  }
  let n = (e.wikiImportInsightsRequestGeneration ?? 0) + 1;
  ((e.wikiImportInsightsRequestGeneration = n),
    (e.wikiImportInsightsActiveRequestGeneration = n),
    (e.wikiImportInsightsRequestAgentId = t),
    (e.wikiImportInsightsLoading = !0),
    (e.wikiImportInsightsError = null));
  try {
    let r = await e.client.request(`wiki.importInsights`, bn(t));
    if (
      e.wikiImportInsightsActiveRequestGeneration !== n ||
      e.wikiImportInsightsRequestAgentId !== t ||
      F(e) !== t
    )
      return;
    ((e.wikiImportInsights = Nn(r)), (e.wikiImportInsightsAgentId = t));
  } catch (r) {
    e.wikiImportInsightsActiveRequestGeneration === n &&
      e.wikiImportInsightsRequestAgentId === t &&
      F(e) === t &&
      (e.wikiImportInsightsError = String(r));
  } finally {
    e.wikiImportInsightsActiveRequestGeneration === n &&
      ((e.wikiImportInsightsLoading = !1),
      (e.wikiImportInsightsRequestAgentId = null),
      (e.wikiImportInsightsActiveRequestGeneration = null));
  }
}
async function Gn(e) {
  if (!e.client || !e.connected) return;
  let t = F(e);
  if (e.wikiMemoryPalaceLoading && e.wikiMemoryPalaceRequestAgentId === t) return;
  if ((e.wikiMemoryPalaceAgentId !== t && (e.wikiMemoryPalace = null), !vn(e, `wiki.palace`))) {
    ((e.wikiMemoryPalaceActiveRequestGeneration = null),
      (e.wikiMemoryPalaceRequestAgentId = null),
      (e.wikiMemoryPalaceLoading = !1),
      (e.wikiMemoryPalace = null),
      (e.wikiMemoryPalaceError = null));
    return;
  }
  let n = (e.wikiMemoryPalaceRequestGeneration ?? 0) + 1;
  ((e.wikiMemoryPalaceRequestGeneration = n),
    (e.wikiMemoryPalaceActiveRequestGeneration = n),
    (e.wikiMemoryPalaceRequestAgentId = t),
    (e.wikiMemoryPalaceLoading = !0),
    (e.wikiMemoryPalaceError = null));
  try {
    let r = await e.client.request(`wiki.palace`, bn(t));
    if (
      e.wikiMemoryPalaceActiveRequestGeneration !== n ||
      e.wikiMemoryPalaceRequestAgentId !== t ||
      F(e) !== t
    )
      return;
    ((e.wikiMemoryPalace = Bn(r)), (e.wikiMemoryPalaceAgentId = t));
  } catch (r) {
    e.wikiMemoryPalaceActiveRequestGeneration === n &&
      e.wikiMemoryPalaceRequestAgentId === t &&
      F(e) === t &&
      (e.wikiMemoryPalaceError = String(r));
  } finally {
    e.wikiMemoryPalaceActiveRequestGeneration === n &&
      ((e.wikiMemoryPalaceLoading = !1),
      (e.wikiMemoryPalaceRequestAgentId = null),
      (e.wikiMemoryPalaceActiveRequestGeneration = null));
  }
}
async function Kn(e, t, n) {
  if (
    !e.client ||
    !e.connected ||
    e.dreamDiaryActionLoading ||
    (t === `doctor.memory.repairDreamingArtifacts` &&
      !gn(
        `Repair Dream Cache? This archives derived dream cache files and rebuilds them from clean inputs. Your dream diary stays untouched.`,
      )) ||
    (t === `doctor.memory.dedupeDreamDiary` &&
      !gn(
        `Dedupe Dream Diary? This rewrites DREAMS.md and removes only exact duplicate diary entries.`,
      ))
  )
    return !1;
  ((e.dreamDiaryActionLoading = !0),
    (e.dreamingStatusError = null),
    (e.dreamDiaryError = null),
    (e.dreamDiaryActionMessage = null),
    (e.dreamDiaryActionArchivePath = null));
  try {
    let r = await e.client.request(t, xn(e));
    return (
      n?.reloadDiary !== !1 && (await Un(e)),
      await Hn(e),
      (e.dreamDiaryActionArchivePath =
        t === `doctor.memory.repairDreamingArtifacts` ? (P(r?.archiveDir) ?? null) : null),
      (e.dreamDiaryActionMessage = { kind: `success`, text: yn(t, r) }),
      !0
    );
  } catch (t) {
    let n = String(t);
    return (
      (e.dreamingStatusError = n),
      (e.lastError = n),
      (e.dreamDiaryActionArchivePath = null),
      (e.dreamDiaryActionMessage = { kind: `error`, text: n }),
      !1
    );
  } finally {
    e.dreamDiaryActionLoading = !1;
  }
}
async function qn(e) {
  return Kn(e, `doctor.memory.backfillDreamDiary`);
}
async function Jn(e) {
  return Kn(e, `doctor.memory.resetDreamDiary`);
}
async function Yn(e) {
  return Kn(e, `doctor.memory.resetGroundedShortTerm`, { reloadDiary: !1 });
}
async function Xn(e) {
  return Kn(e, `doctor.memory.repairDreamingArtifacts`, { reloadDiary: !1 });
}
async function Zn(e) {
  let t = e.dreamDiaryActionArchivePath;
  return t
    ? (await gt(t))
      ? ((e.dreamDiaryActionMessage = { kind: `success`, text: `Archive path copied.` }), !0)
      : ((e.dreamDiaryActionMessage = { kind: `error`, text: `Could not copy archive path.` }), !1)
    : !1;
}
async function Qn(e) {
  return Kn(e, `doctor.memory.dedupeDreamDiary`);
}
async function $n(e, t, n) {
  if (e.dreamingModeSaving) return !1;
  ((e.dreamingModeSaving = !0), (e.dreamingStatusError = null));
  try {
    let r = await t.patch({ raw: n, note: `Dreaming settings updated from the Dreaming tab.` });
    return (
      r ||
        (e.dreamingStatusError =
          t.state.lastError ?? e.lastError ?? `Could not update dreaming settings.`),
      r
    );
  } finally {
    e.dreamingModeSaving = !1;
  }
}
function er(e) {
  let t = C(e),
    n = Array.isArray(t?.children) ? t.children : [];
  for (let e of n) if (P(C(e)?.key) === `dreaming`) return !0;
  return !1;
}
function tr(e) {
  return C(C(e)?.schema)?.additionalProperties === !1;
}
async function nr(e, t, n) {
  if (!t.state.client || !t.state.connected) return !0;
  try {
    let r = await t.lookupSchemaPath(`plugins.entries.${n}.config`);
    if (er(r)) return !0;
    if (tr(r)) {
      let t = `Selected memory plugin "${n}" does not support dreaming settings.`;
      return ((e.dreamingStatusError = t), (e.lastError = t), !1);
    }
  } catch {
    return !0;
  }
  return !0;
}
async function rr(e, t, n) {
  if (e.dreamingModeSaving) return !1;
  if (!t.state.configSnapshot?.hash)
    return ((e.dreamingStatusError = `Config hash missing; refresh and retry.`), !1);
  let { pluginId: r } = On(C(t.state.configSnapshot?.config) ?? null);
  if (!(await nr(e, t, r))) return !1;
  let i = await $n(e, t, {
    plugins: { entries: { [r]: { config: { dreaming: { enabled: n } } } } },
  });
  return (i && e.dreamingStatus && (e.dreamingStatus = { ...e.dreamingStatus, enabled: n }), i);
}
var ir,
  ar,
  or,
  sr = e(() => {
    (re(), _t(), ae(), Be(), (ir = `DREAMS.md`), (ar = `memory-core`), (or = `memory-wiki`));
  });
function cr(e) {
  if (!e.open) return v;
  let t = D(`dreaming.restartConfirmation.title`),
    n = D(`dreaming.restartConfirmation.subtitle`);
  return g`
    <openclaw-modal-dialog label=${t} description=${n} @modal-cancel=${() => {
      e.loading || e.onCancel();
    }}>
      <div class="exec-approval-card">
        <div class="exec-approval-header">
          <div>
            <div id=${`dreaming-restart-confirmation-title`} class="exec-approval-title">${t}</div>
            <div id=${`dreaming-restart-confirmation-description`} class="exec-approval-sub">${n}</div>
          </div>
        </div>
        <div class="callout danger" style="margin-top: 12px;">
          ${D(`dreaming.restartConfirmation.warning`)}
        </div>
        ${e.hasError ? g`<div class="exec-approval-error">${D(`dreaming.restartConfirmation.failed`)}</div>` : v}
        <div class="exec-approval-actions">
          <button class="btn danger" ?disabled=${e.loading} @click=${e.onConfirm}>
            ${e.loading ? D(`dreaming.restartConfirmation.restarting`) : D(`dreaming.restartConfirmation.confirm`)}
          </button>
          <button class="btn" ?disabled=${e.loading} @click=${e.onCancel}>
            ${D(`common.cancel`)}
          </button>
        </div>
      </div>
    </openclaw-modal-dialog>
  `;
}
var lr = e(() => {
    (_(), O(), ht());
  }),
  ur = e(() => {});
function dr(e) {
  let t = e,
    n = Jr.exec(e),
    r = Yr.exec(e);
  n && r && r.index > n.index && (t = e.slice(n.index + n[0].length, r.index));
  let i = [],
    a = t.split(/\n---\n/).filter((e) => e.trim().length > 0);
  for (let e of a) {
    let t = e.trim().split(`
`),
      n = ``,
      r = [];
    for (let e of t) {
      let t = e.trim();
      if (!n && t.startsWith(`*`) && t.endsWith(`*`) && t.length > 2) {
        n = t.slice(1, -1);
        continue;
      }
      t.startsWith(`#`) || t.startsWith(`<!--`) || (t.length > 0 && r.push(t));
    }
    r.length > 0 &&
      i.push({
        date: n,
        body: r.join(`
`),
      });
  }
  return i;
}
function fr(e) {
  let t = Date.parse(e);
  return Number.isFinite(t) ? t : null;
}
function pr(e) {
  let t = fr(e);
  if (t === null) return e;
  let n = new Date(t);
  return `${n.getMonth() + 1}/${n.getDate()}`;
}
function mr(e) {
  return [...e].toReversed().map((e, t) => Object.assign({}, e, { page: t }));
}
function hr() {
  return {
    dreamIndex: Math.floor(Math.random() * Xr.length),
    dreamLastSwap: 0,
    activeSubTab: `scene`,
    activeDiarySubTab: `dreams`,
    advancedWaitingSort: `recent`,
    expandedInsightCards: new Set(),
    expandedPalaceCards: new Set(),
    diaryPage: 0,
    wikiPreviewRequestId: 0,
    wikiPreviewOpen: !1,
    wikiPreviewLoading: !1,
    wikiPreviewTitle: ``,
    wikiPreviewPath: ``,
    wikiPreviewUpdatedAt: null,
    wikiPreviewContent: ``,
    wikiPreviewTotalLines: null,
    wikiPreviewTruncated: !1,
    wikiPreviewError: null,
  };
}
function gr(e, t, n) {
  e.diaryPage = Math.max(0, Math.min(t, Math.max(0, n - 1)));
}
function _r(e) {
  let t = Date.now();
  return (
    t - e.dreamLastSwap > Qr &&
      ((e.dreamLastSwap = t), (e.dreamIndex = (e.dreamIndex + 1) % Xr.length)),
    D(Xr[e.dreamIndex] ?? Xr[0])
  );
}
function vr(e) {
  let t = pt(ut(e));
  return g`
    <div class="dreams__lobster" style=${`--lob-shell:${t.palette.shell};--lob-claw:${t.palette.claw}`}>${dt(t, { sleeping: !0 })}</div>
  `;
}
function yr(e) {
  let t = e.viewState,
    n = !e.active,
    r = e.dreamingOf ?? _r(t);
  return g`
    <div class="dreams-page">
      <!-- ── Sub-tab bar ── -->
      <div class="dreams__topbar">
        <nav class="dreams__tabs">
          <button
            class="dreams__tab ${t.activeSubTab === `scene` ? `dreams__tab--active` : ``}"
            @click=${() => {
              ((t.activeSubTab = `scene`), e.onViewStateChange());
            }}
          >
            ${D(`dreaming.tabs.scene`)}
          </button>
          <button
            class="dreams__tab ${t.activeSubTab === `diary` ? `dreams__tab--active` : ``}"
            @click=${() => {
              ((t.activeSubTab = `diary`), e.onViewStateChange());
            }}
          >
            ${D(`dreaming.tabs.diary`)}
          </button>
          <button
            class="dreams__tab ${t.activeSubTab === `advanced` ? `dreams__tab--active` : ``}"
            @click=${() => {
              ((t.activeSubTab = `advanced`), e.onViewStateChange());
            }}
          >
            ${D(`dreaming.tabs.advanced`)}
          </button>
        </nav>
      </div>

      ${t.activeSubTab === `scene` ? Sr(e, n, r) : t.activeSubTab === `diary` ? qr(e) : Ur(e)}
    </div>
  `;
}
function br(e) {
  return e
    .split(`
`)
    .map((e) => e.trim())
    .filter(
      (e) =>
        e.length > 0 &&
        e !== `What Happened` &&
        e !== `Reflections` &&
        e !== `Candidates` &&
        e !== `Possible Lasting Updates`,
    )
    .map((e) => e.replace(/\s*\[memory\/[^\]]+\]/g, ``))
    .map((e) =>
      e
        .replace(/^(?:\d+\.\s+|-\s+(?:\[[^\]]+\]\s+)?(?:[a-z_]+:\s+)?)/i, ``)
        .replace(/^(?:likely_durable|likely_situational|unclear):\s+/i, ``)
        .trim(),
    )
    .filter((e) => e.length > 0);
}
function xr(e) {
  return e ? new Date(e).toLocaleTimeString([], { hour: `numeric`, minute: `2-digit` }) : `—`;
}
function Sr(e, t, n) {
  return g`
    <section class="dreams ${t ? `dreams--idle` : ``}">
      ${$r.map(
        (e) => g`
          <div
            class="dreams__star"
            style="
              top: ${e.top}%;
              left: ${e.left}%;
              width: ${e.size}px;
              height: ${e.size}px;
              background: ${e.hue === `accent` ? `var(--accent-muted)` : `var(--text)`};
              animation-delay: ${e.delay}s;
            "
          ></div>
        `,
      )}

      <div class="dreams__moon"></div>

      ${
        e.active
          ? g`
            <div class="dreams__bubble">
              <span class="dreams__bubble-text">${n}</span>
            </div>
            <div
              class="dreams__bubble-dot"
              style="top: calc(50% - 160px); left: calc(50% - 120px); width: 12px; height: 12px; animation-delay: 0.2s;"
            ></div>
            <div
              class="dreams__bubble-dot"
              style="top: calc(50% - 120px); left: calc(50% - 90px); width: 8px; height: 8px; animation-delay: 0.4s;"
            ></div>
          `
          : v
      }

      <div class="dreams__glow"></div>
      ${vr(e.selectedAgentId)}
      <span class="dreams__z">z</span>
      <span class="dreams__z">z</span>
      <span class="dreams__z">Z</span>

      <div class="dreams__status">
        <span class="dreams__status-label"
          >${e.active ? D(`dreaming.status.active`) : D(`dreaming.status.idle`)}</span
        >
        <div class="dreams__status-detail">
          <div class="dreams__status-dot"></div>
          <span>
            ${e.promotedCount} ${D(`dreaming.status.promotedSuffix`)}
            ${e.nextCycle ? g`· ${D(`dreaming.status.nextSweepPrefix`)} ${e.nextCycle}` : v}
            ${e.timezone ? g`· ${e.timezone}` : v}
          </span>
        </div>
      </div>

      <!-- Sleep phases -->
      <div class="dreams__phases">
        ${Object.keys(Zr).map((t) => {
          let n = e.phases?.[t],
            r = n !== void 0,
            i = n?.enabled === !0,
            a = xr(n?.nextRunAtMs),
            o = D(Zr[t]),
            s = r ? (i ? a : D(`dreaming.phase.off`)) : `—`;
          return g`
              <div class="dreams__phase ${r && !i ? `dreams__phase--off` : ``}">
                <div class="dreams__phase-dot ${i ? `dreams__phase-dot--on` : ``}"></div>
                <span class="dreams__phase-name">${o}</span>
                <span class="dreams__phase-next">${s}</span>
              </div>
            `;
        })}
      </div>

      ${e.statusError ? g`<div class="dreams__controls-error">${e.statusError}</div>` : v}
    </section>
  `;
}
function Cr(e, t, n) {
  return t === n ? `${e}:${t}` : `${e}:${t}-${n}`;
}
function wr(e) {
  let t = Date.parse(e);
  return Number.isFinite(t)
    ? new Date(t).toLocaleString([], {
        month: `short`,
        day: `numeric`,
        hour: `numeric`,
        minute: `2-digit`,
      })
    : e;
}
function Tr(e) {
  return e.replace(/\\/g, `/`).split(`/`).findLast(Boolean) ?? e;
}
function Er(e) {
  switch (e) {
    case `entity`:
      return `entity`;
    case `concept`:
      return `concept`;
    case `source`:
      return `source`;
    case `synthesis`:
      return `synthesis`;
    case `report`:
      return `report`;
  }
  return e;
}
function R(e, t, n = `${t}s`) {
  return `${e} ${e === 1 ? t : n}`;
}
function Dr(e) {
  switch (e) {
    case `source`:
      return `Sources`;
    case `synthesis`:
      return `Syntheses`;
    case `report`:
      return `Reports`;
    case `entity`:
      return `Entities`;
    case `concept`:
      return `Concepts`;
  }
  return e;
}
function Or(e) {
  let t = ei
    .map((t) => {
      let n = e[t];
      return n > 0 ? `${Dr(t)} · ${R(n, `page`)}` : null;
    })
    .filter((e) => e !== null);
  return t.length > 0 ? t.join(`; `) : `No pages yet`;
}
function kr(e) {
  let t = [`${e.label}: ${R(e.itemCount, `page`)}`];
  if ((e.claimCount > 0 && t.push(R(e.claimCount, `claim row`)), e.questionCount > 0)) {
    let n = e.items.filter((e) => e.questionCount > 0).length,
      r = n > 0 ? ` on ${R(n, `page`)}` : ``;
    t.push(`${R(e.questionCount, `open question`)}${r}`);
  }
  return (
    e.contradictionCount > 0 && t.push(R(e.contradictionCount, `contradiction`)), t.join(` · `)
  );
}
function Ar(e) {
  if (e.digestStatus === `withheld`) return `needs review`;
  switch (e.riskLevel) {
    case `low`:
      return `low risk`;
    case `medium`:
      return `medium risk`;
    case `high`:
      return `high risk`;
    case `unknown`:
      return `unknown risk`;
  }
  return `unknown risk`;
}
function jr(e, t, n) {
  (e.has(t) ? e.delete(t) : e.add(t), n());
}
async function Mr(e, t) {
  let n = t.viewState,
    r = ++n.wikiPreviewRequestId;
  ((n.wikiPreviewOpen = !0),
    (n.wikiPreviewLoading = !0),
    (n.wikiPreviewTitle = Tr(e)),
    (n.wikiPreviewPath = e),
    (n.wikiPreviewUpdatedAt = null),
    (n.wikiPreviewContent = ``),
    (n.wikiPreviewTotalLines = null),
    (n.wikiPreviewTruncated = !1),
    (n.wikiPreviewError = null),
    t.onViewStateChange());
  try {
    let i = await t.onOpenWikiPage(e);
    if (n.wikiPreviewRequestId !== r || !n.wikiPreviewOpen) return;
    if (!i) {
      n.wikiPreviewError = `No wiki page found for ${e}.`;
      return;
    }
    ((n.wikiPreviewTitle = i.title),
      (n.wikiPreviewPath = i.path),
      (n.wikiPreviewUpdatedAt = i.updatedAt ?? null),
      (n.wikiPreviewContent = i.content),
      (n.wikiPreviewTotalLines = typeof i.totalLines == `number` ? i.totalLines : null),
      (n.wikiPreviewTruncated = i.truncated === !0));
  } catch (e) {
    n.wikiPreviewRequestId === r && n.wikiPreviewOpen && (n.wikiPreviewError = String(e));
  } finally {
    n.wikiPreviewRequestId === r &&
      n.wikiPreviewOpen &&
      ((n.wikiPreviewLoading = !1), t.onViewStateChange());
  }
}
function Nr(e) {
  ((e.wikiPreviewRequestId += 1),
    (e.wikiPreviewOpen = !1),
    (e.wikiPreviewLoading = !1),
    (e.wikiPreviewTitle = ``),
    (e.wikiPreviewPath = ``),
    (e.wikiPreviewUpdatedAt = null),
    (e.wikiPreviewContent = ``),
    (e.wikiPreviewTotalLines = null),
    (e.wikiPreviewTruncated = !1),
    (e.wikiPreviewError = null));
}
function Pr(e) {
  (Nr(e.viewState), e.onViewStateChange());
}
function Fr(e) {
  let t = e.viewState;
  return t.wikiPreviewOpen
    ? g`
    <openclaw-modal-dialog
      .label=${t.wikiPreviewTitle || D(`dreaming.wiki.previewFallbackTitle`)}
      style="--openclaw-modal-width: 1120px"
      @modal-cancel=${() => Pr(e)}
    >
      <div class="dreams-diary__preview-panel">
        <div class="dreams-diary__preview-header">
          <div>
            <div class="dreams-diary__preview-title">
              ${t.wikiPreviewTitle || D(`dreaming.wiki.previewFallbackTitle`)}
            </div>
            <div class="dreams-diary__preview-meta">
              ${t.wikiPreviewPath}
              ${t.wikiPreviewUpdatedAt ? ` · ${t.wikiPreviewUpdatedAt}` : ``}
            </div>
          </div>
          <button
            type="button"
            class="btn btn--subtle btn--sm"
            @click=${() => Pr(e)}
          >
            ${D(`dreaming.wiki.close`)}
          </button>
        </div>
        <div class="dreams-diary__preview-body">
          ${
            t.wikiPreviewLoading
              ? g`<div class="dreams-diary__empty-text">${D(`dreaming.wiki.loadingPage`)}</div>`
              : t.wikiPreviewError
                ? g`<div class="dreams-diary__error">${t.wikiPreviewError}</div>`
                : g`
                  ${
                    t.wikiPreviewTruncated
                      ? g`
                        <div class="dreams-diary__preview-hint">
                          Showing the first chunk of this
                          page${t.wikiPreviewTotalLines === null ? `` : ` (${t.wikiPreviewTotalLines} total lines)`}.
                        </div>
                      `
                      : v
                  }
                  <pre class="dreams-diary__preview-pre">${t.wikiPreviewContent}</pre>
                `
          }
        </div>
      </div>
    </openclaw-modal-dialog>
  `
    : v;
}
function Ir(e) {
  switch (e) {
    case `dreams`:
      return g` <p class="dreams-diary__explainer">${D(`dreaming.wiki.dreamsExplainer`)}</p> `;
    case `insights`:
      return g` <p class="dreams-diary__explainer">${D(`dreaming.wiki.insightsExplainer`)}</p> `;
    case `palace`:
      return g` <p class="dreams-diary__explainer">${D(`dreaming.wiki.palaceExplainer`)}</p> `;
  }
  return v;
}
function Lr(e) {
  if (!e) return -1 / 0;
  let t = Date.parse(e);
  return Number.isFinite(t) ? t : -1 / 0;
}
function Rr(e, t) {
  let n = Lr(e.lastRecalledAt),
    r = Lr(t.lastRecalledAt);
  return r === n
    ? t.totalSignalCount === e.totalSignalCount
      ? e.path.localeCompare(t.path)
      : t.totalSignalCount - e.totalSignalCount
    : r - n;
}
function zr(e, t) {
  return t.totalSignalCount === e.totalSignalCount
    ? t.phaseHitCount === e.phaseHitCount
      ? Rr(e, t)
      : t.phaseHitCount - e.phaseHitCount
    : t.totalSignalCount - e.totalSignalCount;
}
function Br(e, t) {
  return t === `signals` ? e.toSorted(zr) : e.toSorted(Rr);
}
function Vr(e) {
  let t = e.groundedCount > 0,
    n = e.recallCount > 0 || e.dailyCount > 0;
  return D(
    t && n
      ? `dreaming.advanced.originMixed`
      : t
        ? `dreaming.advanced.originDailyLog`
        : `dreaming.advanced.originLive`,
  );
}
function Hr(e) {
  return g`
    <section class="dreams-advanced__section">
      <div class="dreams-advanced__section-header">
        <div class="dreams-advanced__section-copy">
          <span class="dreams-advanced__section-title">${D(e.titleKey)}</span>
          <p class="dreams-advanced__section-description">${D(e.descriptionKey)}</p>
        </div>
        <div class="dreams-advanced__section-toolbar">
          ${e.controls ?? v}
          <span class="dreams-advanced__section-count">${e.entries.length}</span>
        </div>
      </div>
      ${
        e.entries.length === 0
          ? g`<div class="dreams-advanced__empty">${D(e.emptyKey)}</div>`
          : g`
            <div class="dreams-advanced__list">
              ${e.entries.map(
                (t) => g`
                  <article class="dreams-advanced__item" data-entry-key=${t.key}>
                    ${
                      e.badge
                        ? (() => {
                            let n = e.badge?.(t);
                            return n ? g`<span class="dreams-advanced__badge">${n}</span>` : v;
                          })()
                        : v
                    }
                    <div class="dreams-advanced__snippet">${t.snippet}</div>
                    <div class="dreams-advanced__source">
                      ${Cr(t.path, t.startLine, t.endLine)}
                    </div>
                    <div class="dreams-advanced__meta">
                      ${e
                        .meta(t)
                        .filter((e) => e.length > 0)
                        .join(` · `)}
                    </div>
                  </article>
                `,
              )}
            </div>
          `
      }
    </section>
  `;
}
function Ur(e) {
  let t = e.viewState,
    n = e.shortTermEntries.filter((e) => e.groundedCount > 0),
    r = Br(e.shortTermEntries, t.advancedWaitingSort),
    i = D(`dreaming.advanced.description`),
    a = [
      `${n.length} ${D(`dreaming.advanced.summaryFromDailyLog`)}`,
      `${e.shortTermCount} ${D(`dreaming.advanced.summaryWaiting`)}`,
      `${e.promotedCount} ${D(`dreaming.advanced.summaryPromotedToday`)}`,
    ].join(` · `);
  return g`
    <section class="dreams-advanced">
      <div class="dreams-advanced__header">
        <div class="dreams-advanced__intro">
          <span class="dreams-advanced__eyebrow">${D(`dreaming.advanced.eyebrow`)}</span>
          <h2 class="dreams-advanced__title">${D(`dreaming.advanced.title`)}</h2>
          ${i ? g`<p class="dreams-advanced__description">${i}</p>` : v}
          <div class="dreams-advanced__summary">${a}</div>
        </div>
        <div class="dreams-advanced__actions">
          <button
            class="btn btn--subtle btn--sm"
            ?disabled=${e.modeSaving || e.dreamDiaryActionLoading}
            @click=${() => e.onDedupeDreamDiary()}
          >
            ${D(`dreaming.scene.dedupeDiary`)}
          </button>
          <button
            class="btn btn--subtle btn--sm"
            ?disabled=${e.modeSaving || e.dreamDiaryActionLoading}
            @click=${() => e.onRepairDreamingArtifacts()}
          >
            ${D(`dreaming.scene.repairCache`)}
          </button>
          <button
            class="btn btn--subtle btn--sm"
            ?disabled=${e.modeSaving || e.dreamDiaryActionLoading}
            @click=${() => e.onBackfillDiary()}
          >
            ${e.dreamDiaryActionLoading ? D(`dreaming.scene.working`) : D(`dreaming.scene.backfill`)}
          </button>
          <button
            class="btn btn--subtle btn--sm"
            ?disabled=${e.modeSaving || e.dreamDiaryActionLoading}
            @click=${() => e.onResetDiary()}
          >
            ${D(`dreaming.scene.reset`)}
          </button>
          <button
            class="btn btn--subtle btn--sm"
            ?disabled=${e.modeSaving || e.dreamDiaryActionLoading}
            @click=${() => e.onResetGroundedShortTerm()}
          >
            ${D(`dreaming.scene.clearGrounded`)}
          </button>
        </div>
      </div>
      ${
        e.dreamDiaryActionMessage
          ? g`
            <div
              class="callout ${e.dreamDiaryActionMessage.kind === `success` ? `success` : `danger`}"
              role="status"
            >
              <div class="row wrap items-center gap-2">
                <span>${e.dreamDiaryActionMessage.text}</span>
                ${
                  e.dreamDiaryActionArchivePath
                    ? g`
                      <button
                        class="btn btn--subtle btn--sm"
                        ?disabled=${e.dreamDiaryActionLoading}
                        @click=${() => e.onCopyDreamingArchivePath()}
                      >
                        ${D(`dreaming.wiki.copyArchivePath`)}
                      </button>
                    `
                    : v
                }
              </div>
            </div>
          `
          : v
      }

      <div class="dreams-advanced__sections">
        ${Hr({
          titleKey: `dreaming.advanced.stagedTitle`,
          descriptionKey: `dreaming.advanced.stagedDescription`,
          emptyKey: `dreaming.advanced.emptyGrounded`,
          entries: n,
          controls: g`
            <button
              class="btn btn--subtle btn--sm"
              ?disabled=${e.modeSaving || e.dreamDiaryActionLoading}
              @click=${() => e.onResetGroundedShortTerm()}
            >
              ${D(`dreaming.scene.clearGrounded`)}
            </button>
          `,
          badge: () => D(`dreaming.advanced.originDailyLog`),
          meta: (e) => [
            e.groundedCount > 0
              ? `${e.groundedCount} ${D(`dreaming.stats.grounded`).toLowerCase()}`
              : ``,
            e.recallCount > 0 ? `${e.recallCount} recall` : ``,
            e.dailyCount > 0 ? `${e.dailyCount} daily` : ``,
          ],
        })}
        ${Hr({
          titleKey: `dreaming.advanced.shortTermTitle`,
          descriptionKey: `dreaming.advanced.shortTermDescription`,
          emptyKey: `dreaming.advanced.emptyShortTerm`,
          entries: r,
          controls: g`
            <div class="dreams-advanced__sort">
              <button
                class="dreams-advanced__sort-btn ${t.advancedWaitingSort === `recent` ? `dreams-advanced__sort-btn--active` : ``}"
                @click=${() => {
                  ((t.advancedWaitingSort = `recent`), e.onViewStateChange());
                }}
              >
                ${D(`dreaming.advanced.sortRecent`)}
              </button>
              <button
                class="dreams-advanced__sort-btn ${t.advancedWaitingSort === `signals` ? `dreams-advanced__sort-btn--active` : ``}"
                @click=${() => {
                  ((t.advancedWaitingSort = `signals`), e.onViewStateChange());
                }}
              >
                ${D(`dreaming.advanced.sortSignals`)}
              </button>
            </div>
          `,
          badge: (e) => Vr(e),
          meta: (e) => [
            `${e.totalSignalCount} ${D(`dreaming.stats.signals`).toLowerCase()}`,
            e.recallCount > 0 ? `${e.recallCount} recall` : ``,
            e.dailyCount > 0 ? `${e.dailyCount} daily` : ``,
            e.groundedCount > 0
              ? `${e.groundedCount} ${D(`dreaming.stats.grounded`).toLowerCase()}`
              : ``,
            e.phaseHitCount > 0 ? `${e.phaseHitCount} phase hit` : ``,
          ],
        })}
        ${Hr({ titleKey: `dreaming.advanced.promotedTitle`, descriptionKey: `dreaming.advanced.promotedDescription`, emptyKey: `dreaming.advanced.emptyPromoted`, entries: e.promotedEntries, badge: (e) => Vr(e), meta: (e) => [e.promotedAt ? `${D(`dreaming.advanced.updatedPrefix`)} ${wr(e.promotedAt)}` : ``, e.groundedCount > 0 ? `${e.groundedCount} ${D(`dreaming.stats.grounded`).toLowerCase()}` : ``, e.totalSignalCount > 0 ? `${e.totalSignalCount} ${D(`dreaming.stats.signals`).toLowerCase()}` : ``] })}
      </div>

      ${e.statusError ? g`<div class="dreams__controls-error">${e.statusError}</div>` : v}
    </section>
  `;
}
function Wr(e) {
  let t = e.viewState,
    n = e.wikiImportInsights?.clusters ?? [];
  if (e.wikiImportInsightsLoading && n.length === 0)
    return g`
      <div class="dreams-diary__empty">
        <div class="dreams-diary__empty-text">${D(`dreaming.wiki.loadingInsights`)}</div>
      </div>
    `;
  if (n.length === 0)
    return g`
      <div class="dreams-diary__empty">
        <div class="dreams-diary__empty-text">${D(`dreaming.wiki.noInsights`)}</div>
        <div class="dreams-diary__empty-hint">${D(`dreaming.wiki.noInsightsHint`)}</div>
      </div>
    `;
  let r = Math.max(0, Math.min(t.diaryPage, n.length - 1)),
    i = x(n[r], `selected imported insight cluster`);
  return g`
    <div class="dreams-diary__daychips">
      ${n.map(
        (i, a) => g`
          <button
            class="dreams-diary__day-chip ${a === r ? `dreams-diary__day-chip--active` : ``}"
            @click=${() => {
              (gr(t, a, n.length), e.onViewStateChange());
            }}
          >
            ${i.label}
          </button>
        `,
      )}
    </div>

    <article class="dreams-diary__entry" key="imports-${i.key}">
      <div class="dreams-diary__accent"></div>
      <div class="dreams-diary__date">
        ${i.label} · ${i.itemCount} chats
        ${i.highRiskCount > 0 ? g`· ${i.highRiskCount} sensitive` : v}
        ${i.preferenceSignalCount > 0 ? g`· ${i.preferenceSignalCount} signals` : v}
      </div>
      <div class="dreams-diary__prose">
        <p class="dreams-diary__para">
          Imported chats clustered around ${i.label.toLowerCase()}.
          ${i.withheldCount > 0 ? ` ${i.withheldCount} digest${i.withheldCount === 1 ? ` was` : `s were`} withheld pending review.` : ``}
        </p>
      </div>
      <div class="dreams-diary__insights">
        ${i.items.map((n) => {
          let r = t.expandedInsightCards.has(n.pagePath);
          return g`
            <article
              class="dreams-diary__insight-card dreams-diary__insight-card--clickable"
              data-import-page=${n.pagePath}
              @click=${() => jr(t.expandedInsightCards, n.pagePath, e.onViewStateChange)}
            >
              <div class="dreams-diary__insight-topline">
                <div class="dreams-diary__insight-title">${n.title}</div>
                <span
                  class="dreams-diary__insight-badge dreams-diary__insight-badge--${n.riskLevel}"
                >
                  ${Ar(n)}
                </span>
              </div>
              <div class="dreams-diary__insight-meta">
                ${n.updatedAt ? wr(n.updatedAt) : Tr(n.pagePath)}
                ${n.activeBranchMessages > 0 ? ` · ${n.activeBranchMessages} messages` : ``}
              </div>
              <p class="dreams-diary__insight-line">${n.summary}</p>
              ${
                n.candidateSignals.length > 0
                  ? g`
                    <div class="dreams-diary__insight-list">
                      <strong>${D(`dreaming.wiki.candidateSignals`)}</strong>
                      ${n.candidateSignals.map((e) => g`<p class="dreams-diary__insight-line">• ${e}</p>`)}
                    </div>
                  `
                  : v
              }
              ${
                n.correctionSignals.length > 0
                  ? g`
                    <div class="dreams-diary__insight-list">
                      <strong>${D(`dreaming.wiki.corrections`)}</strong>
                      ${n.correctionSignals.map((e) => g`<p class="dreams-diary__insight-line">• ${e}</p>`)}
                    </div>
                  `
                  : v
              }
              ${
                r
                  ? g`
                    <div class="dreams-diary__insight-list">
                      <strong>${D(`dreaming.wiki.importDetails`)}</strong>
                      ${
                        n.firstUserLine
                          ? g`
                            <p class="dreams-diary__insight-line">
                              <strong>${D(`dreaming.wiki.startedWith`)}</strong>
                              ${n.firstUserLine}
                            </p>
                          `
                          : v
                      }
                      ${
                        n.lastUserLine && n.lastUserLine !== n.firstUserLine
                          ? g`
                            <p class="dreams-diary__insight-line">
                              <strong>${D(`dreaming.wiki.endedOn`)}</strong>
                              ${n.lastUserLine}
                            </p>
                          `
                          : v
                      }
                      <p class="dreams-diary__insight-line">
                        <strong>${D(`dreaming.wiki.messages`)}</strong>
                        ${n.userMessageCount} user · ${n.assistantMessageCount} assistant
                      </p>
                      ${
                        n.riskReasons.length > 0
                          ? g`
                            <p class="dreams-diary__insight-line">
                              <strong>${D(`dreaming.wiki.riskReasons`)}</strong>
                              ${n.riskReasons.join(`, `)}
                            </p>
                          `
                          : v
                      }
                      ${
                        n.labels.length > 0
                          ? g`
                            <p class="dreams-diary__insight-line">
                              <strong>${D(`dreaming.wiki.labels`)}</strong>
                              ${n.labels.join(`, `)}
                            </p>
                          `
                          : v
                      }
                    </div>
                  `
                  : v
              }
              ${
                n.preferenceSignals.length > 0
                  ? g`
                    <div class="dreams-diary__insight-signals">
                      ${n.preferenceSignals.map((e) => g`<span class="dreams-diary__insight-signal">${e}</span>`)}
                    </div>
                  `
                  : v
              }
              <div class="dreams-diary__insight-actions">
                <button
                  class="btn btn--subtle btn--sm"
                  @click=${(r) => {
                    (r.stopPropagation(),
                      jr(t.expandedInsightCards, n.pagePath, e.onViewStateChange));
                  }}
                >
                  ${r ? `Hide details` : `Details`}
                </button>
                <button
                  class="btn btn--subtle btn--sm"
                  @click=${(t) => {
                    (t.stopPropagation(), Mr(n.pagePath, e));
                  }}
                >
                  ${D(`dreaming.wiki.openSourcePage`)}
                </button>
              </div>
            </article>
          `;
        })}
      </div>
    </article>
  `;
}
function Gr(e) {
  let t = e.viewState,
    n = e.wikiMemoryPalace,
    r = n?.clusters ?? [];
  if (e.wikiMemoryPalaceLoading && r.length === 0)
    return g`
      <div class="dreams-diary__empty">
        <div class="dreams-diary__empty-text">${D(`dreaming.wiki.loadingPalace`)}</div>
      </div>
    `;
  if (r.length === 0)
    return g`
      <div class="dreams-diary__empty">
        <div class="dreams-diary__empty-text">${D(`dreaming.wiki.emptyPalace`)}</div>
        <div class="dreams-diary__empty-hint">${D(`dreaming.wiki.emptyPalaceHint`)}</div>
      </div>
    `;
  let i = Math.max(0, Math.min(t.diaryPage, r.length - 1)),
    a = x(r[i], `selected memory palace cluster`),
    o = n?.totalPages ?? n?.totalItems ?? 0,
    s = n?.totalClaims ?? 0,
    c = n?.totalQuestions ?? 0,
    l = n?.totalContradictions ?? 0,
    u = n ? Or(n.pageCounts) : `No pages yet`,
    d = kr(a);
  return g`
    <div class="dreams-diary__daychips">
      ${r.map(
        (n, a) => g`
          <button
            class="dreams-diary__day-chip ${a === i ? `dreams-diary__day-chip--active` : ``}"
            @click=${() => {
              (gr(t, a, r.length), e.onViewStateChange());
            }}
          >
            ${n.label}
          </button>
        `,
      )}
    </div>

    <article class="dreams-diary__entry" key="palace-${a.key}">
      <div class="dreams-diary__accent"></div>
      <div class="dreams-diary__date">
        Vault · ${R(o, `page`)}
        ${s > 0 ? g`· ${R(s, `claim row`)}` : v}
        ${c > 0 ? g`· ${R(c, `open question`)}` : v}
        ${l > 0 ? g`· ${R(l, `contradiction`)}` : v}
      </div>
      <div class="dreams-diary__prose">
        <p class="dreams-diary__para">Full vault breakdown: ${u}.</p>
        <p class="dreams-diary__para">
          Selected section: ${d}.
          ${a.updatedAt ? ` Latest update ${wr(a.updatedAt)}.` : ``}
        </p>
      </div>
      <div class="dreams-diary__insights">
        ${a.items.map((n) => {
          let r = t.expandedPalaceCards.has(n.pagePath);
          return g`
            <article
              class="dreams-diary__insight-card dreams-diary__insight-card--clickable"
              data-palace-page=${n.pagePath}
              @click=${() => {
                if (n.kind === `report`) {
                  Mr(n.pagePath, e);
                  return;
                }
                jr(t.expandedPalaceCards, n.pagePath, e.onViewStateChange);
              }}
            >
              <div class="dreams-diary__insight-topline">
                <div class="dreams-diary__insight-title">${n.title}</div>
                <span class="dreams-diary__insight-badge dreams-diary__insight-badge--palace">
                  ${Er(n.kind)}
                </span>
              </div>
              <div class="dreams-diary__insight-meta">
                ${n.updatedAt ? wr(n.updatedAt) : Tr(n.pagePath)}
                · ${n.pagePath}
              </div>
              ${n.snippet ? g`<p class="dreams-diary__insight-line">${n.snippet}</p>` : v}
              ${
                n.claims.length > 0
                  ? g`
                    <div class="dreams-diary__insight-list">
                      <strong>${D(`dreaming.wiki.claims`)}</strong>
                      ${n.claims.map((e) => g`<p class="dreams-diary__insight-line">• ${e}</p>`)}
                    </div>
                  `
                  : v
              }
              ${
                n.questions.length > 0
                  ? g`
                    <div class="dreams-diary__insight-list">
                      <strong>${D(`dreaming.wiki.openQuestions`)}</strong>
                      ${n.questions.map((e) => g`<p class="dreams-diary__insight-line">• ${e}</p>`)}
                    </div>
                  `
                  : v
              }
              ${
                n.contradictions.length > 0
                  ? g`
                    <div class="dreams-diary__insight-list">
                      <strong>${D(`dreaming.wiki.contradictions`)}</strong>
                      ${n.contradictions.map((e) => g`<p class="dreams-diary__insight-line">• ${e}</p>`)}
                    </div>
                  `
                  : v
              }
              ${
                r
                  ? g`
                    <div class="dreams-diary__insight-list">
                      <strong>${D(`dreaming.wiki.pageDetails`)}</strong>
                      <p class="dreams-diary__insight-line">
                        <strong>${D(`dreaming.wiki.wikiPage`)}</strong>
                        ${n.pagePath}
                      </p>
                      ${
                        n.id
                          ? g`
                            <p class="dreams-diary__insight-line">
                              <strong>${D(`dreaming.wiki.id`)}</strong>
                              ${n.id}
                            </p>
                          `
                          : v
                      }
                    </div>
                  `
                  : v
              }
              <div class="dreams-diary__insight-actions">
                <button
                  class="btn btn--subtle btn--sm"
                  @click=${(r) => {
                    (r.stopPropagation(),
                      jr(t.expandedPalaceCards, n.pagePath, e.onViewStateChange));
                  }}
                >
                  ${r ? `Hide details` : `Details`}
                </button>
                <button
                  class="btn btn--subtle btn--sm"
                  @click=${(t) => {
                    (t.stopPropagation(), Mr(n.pagePath, e));
                  }}
                >
                  ${D(`dreaming.wiki.openWikiPage`)}
                </button>
              </div>
            </article>
          `;
        })}
      </div>
    </article>
  `;
}
function Kr(e) {
  let t = e.viewState;
  if (typeof e.dreamDiaryContent != `string`)
    return g`
      <div class="dreams-diary__empty">
        <div class="dreams-diary__empty-moon">
          <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
            <circle cx="16" cy="16" r="14" stroke="currentColor" stroke-width="0.5" opacity="0.2" />
            <path d="M20 8a10 10 0 0 1 0 16 10 10 0 1 0 0-16z" fill="currentColor" opacity="0.08" />
          </svg>
        </div>
        <div class="dreams-diary__empty-text">${D(`dreaming.diary.noDreamsYet`)}</div>
        <div class="dreams-diary__empty-hint">${D(`dreaming.diary.noDreamsHint`)}</div>
      </div>
    `;
  let n = dr(e.dreamDiaryContent);
  if (n.length === 0)
    return g`
      <div class="dreams-diary__empty">
        <div class="dreams-diary__empty-text">${D(`dreaming.diary.waitingTitle`)}</div>
        <div class="dreams-diary__empty-hint">${D(`dreaming.diary.waitingHint`)}</div>
      </div>
    `;
  let r = mr(n),
    i = Math.max(0, Math.min(t.diaryPage, r.length - 1)),
    a = x(r[i], `selected dreaming diary entry`);
  return g`
    <div class="dreams-diary__daychips">
      ${r.map(
        (n) => g`
          <button
            class="dreams-diary__day-chip ${n.page === i ? `dreams-diary__day-chip--active` : ``}"
            @click=${() => {
              (gr(t, n.page, r.length), e.onViewStateChange());
            }}
          >
            ${pr(n.date)}
          </button>
        `,
      )}
    </div>
    <article class="dreams-diary__entry" key="${i}">
      <div class="dreams-diary__accent"></div>
      ${a.date ? g`<time class="dreams-diary__date">${a.date}</time>` : v}
      <div class="dreams-diary__prose">
        ${br(a.body).map(
          (e, t) => g`<p class="dreams-diary__para" style="animation-delay: ${0.3 + t * 0.15}s;">
              ${h(Nt(e))}
            </p>`,
        )}
      </div>
    </article>
  `;
}
function qr(e) {
  let t = e.viewState,
    n = t.activeDiarySubTab,
    r = (n === `insights` || n === `palace`) && !e.memoryWikiEnabled,
    i =
      n === `dreams`
        ? e.dreamDiaryError
        : n === `insights`
          ? e.wikiImportInsightsError
          : e.wikiMemoryPalaceError;
  return i && !r
    ? g`
      <section class="dreams-diary">
        <div class="dreams-diary__error">${i}</div>
      </section>
    `
    : g`
    <section class="dreams-diary">
      <div class="dreams-diary__chrome">
        <div class="dreams-diary__header">
          <span class="dreams-diary__title">${D(`dreaming.diary.title`)}</span>
          <div class="dreams-diary__subtabs">
            <button
              class="dreams-diary__subtab ${n === `dreams` ? `dreams-diary__subtab--active` : ``}"
              @click=${() => {
                (Nr(t), (t.activeDiarySubTab = `dreams`), (t.diaryPage = 0), e.onViewStateChange());
              }}
            >
              ${D(`dreaming.wiki.dreamsTab`)}
            </button>
            <button
              class="dreams-diary__subtab ${n === `insights` ? `dreams-diary__subtab--active` : ``}"
              @click=${() => {
                (Nr(t),
                  (t.activeDiarySubTab = `insights`),
                  (t.diaryPage = 0),
                  e.onViewStateChange());
              }}
            >
              ${D(`dreaming.wiki.insightsTab`)}
            </button>
            <button
              class="dreams-diary__subtab ${n === `palace` ? `dreams-diary__subtab--active` : ``}"
              @click=${() => {
                (Nr(t), (t.activeDiarySubTab = `palace`), (t.diaryPage = 0), e.onViewStateChange());
              }}
            >
              ${D(`dreaming.wiki.palaceTab`)}
            </button>
          </div>
          <button
            class="btn btn--subtle btn--sm"
            ?disabled=${r ? !1 : e.modeSaving || (n === `dreams` ? e.dreamDiaryLoading : n === `insights` ? e.wikiImportInsightsLoading : e.wikiMemoryPalaceLoading)}
            @click=${() => {
              ((t.diaryPage = 0),
                r
                  ? e.onOpenConfig()
                  : n === `dreams`
                    ? e.onRefreshDiary()
                    : n === `insights`
                      ? e.onRefreshImports()
                      : e.onRefreshMemoryPalace());
            }}
          >
            ${r ? D(`dreaming.wiki.howToEnable`) : n === `dreams` ? (e.dreamDiaryLoading ? D(`dreaming.diary.reloading`) : D(`dreaming.diary.reload`)) : n === `insights` ? (e.wikiImportInsightsLoading ? `Reloading…` : `Reload`) : e.wikiMemoryPalaceLoading ? `Reloading…` : `Reload`}
          </button>
        </div>
        ${Ir(n)}
      </div>

      ${
        r
          ? g`
            <div class="dreams-diary__empty">
              <div class="dreams-diary__empty-text">${D(`dreaming.wiki.unavailable`)}</div>
              <div class="dreams-diary__empty-hint">
                ${D(`dreaming.wiki.unavailablePluginPrefix`)}
                <code>memory-wiki</code> ${D(`dreaming.wiki.unavailablePluginSuffix`)}
              </div>
              <div class="dreams-diary__empty-hint">
                ${D(`dreaming.wiki.enablePrefix`)}
                <code>plugins.entries.memory-wiki.enabled = true</code>${D(`dreaming.wiki.enableSuffix`)}
              </div>
              <div class="dreams-diary__empty-actions">
                <button class="btn btn--subtle btn--sm" @click=${() => e.onOpenConfig()}>
                  ${D(`dreaming.wiki.openConfig`)}
                </button>
              </div>
            </div>
          `
          : n === `dreams`
            ? Kr(e)
            : n === `insights`
              ? Wr(e)
              : Gr(e)
      }
      ${Fr(e)}
    </section>
  `;
}
var Jr,
  Yr,
  Xr,
  Zr,
  Qr,
  $r,
  ei,
  ti = e(() => {
    (b(),
      _(),
      ee(),
      mt(),
      ht(),
      Pt(),
      O(),
      ur(),
      (Jr = /<!--\s*openclaw:dreaming:diary:start\s*-->/),
      (Yr = /<!--\s*openclaw:dreaming:diary:end\s*-->/),
      (Xr = [
        `dreaming.phrases.consolidatingMemories`,
        `dreaming.phrases.tidyingKnowledgeGraph`,
        `dreaming.phrases.replayingConversations`,
        `dreaming.phrases.weavingShortTerm`,
        `dreaming.phrases.defragmentingMindPalace`,
        `dreaming.phrases.filingLooseThoughts`,
        `dreaming.phrases.connectingDots`,
        `dreaming.phrases.compostingContext`,
        `dreaming.phrases.alphabetizingSubconscious`,
        `dreaming.phrases.promotingHunches`,
        `dreaming.phrases.forgettingNoise`,
        `dreaming.phrases.dreamingEmbeddings`,
        `dreaming.phrases.reorganizingAttic`,
        `dreaming.phrases.indexingDay`,
        `dreaming.phrases.nurturingInsights`,
        `dreaming.phrases.simmeringIdeas`,
        `dreaming.phrases.whisperingVectorStore`,
      ]),
      (Zr = {
        light: `dreaming.phase.light`,
        deep: `dreaming.phase.deep`,
        rem: `dreaming.phase.rem`,
      }),
      (Qr = 6e3),
      ($r = [
        { top: 8, left: 15, size: 3, delay: 0, hue: `neutral` },
        { top: 12, left: 72, size: 2, delay: 1.4, hue: `neutral` },
        { top: 22, left: 35, size: 3, delay: 0.6, hue: `accent` },
        { top: 18, left: 88, size: 2, delay: 2.1, hue: `neutral` },
        { top: 35, left: 8, size: 2, delay: 0.9, hue: `neutral` },
        { top: 45, left: 92, size: 2, delay: 1.7, hue: `neutral` },
        { top: 55, left: 25, size: 3, delay: 2.5, hue: `accent` },
        { top: 65, left: 78, size: 2, delay: 0.3, hue: `neutral` },
        { top: 75, left: 45, size: 2, delay: 1.1, hue: `neutral` },
        { top: 82, left: 60, size: 3, delay: 1.8, hue: `accent` },
        { top: 30, left: 55, size: 2, delay: 0.4, hue: `neutral` },
        { top: 88, left: 18, size: 2, delay: 2.3, hue: `neutral` },
      ]),
      (ei = [`source`, `synthesis`, `report`, `entity`, `concept`]));
  });
function ni(e) {
  return je(e, { hour: `numeric`, minute: `2-digit` }, ``) || null;
}
function ri(e) {
  let t = Object.values(e?.phases ?? {})
    .filter((e) => e.enabled && typeof e.nextRunAtMs == `number`)
    .map((e) => e.nextRunAtMs)
    .toSorted((e, t) => e - t)[0];
  return t === void 0 ? null : ni(t);
}
function ii(e, t) {
  let n = e && typeof e == `object` ? e : null,
    r = typeof n?.title == `string` && n.title.trim() ? n.title.trim() : t,
    i = typeof n?.path == `string` && n.path.trim() ? n.path.trim() : t,
    a =
      typeof n?.content == `string` && n.content.length > 0
        ? n.content
        : `No wiki content available.`,
    o = typeof n?.updatedAt == `string` && n.updatedAt.trim() ? n.updatedAt.trim() : void 0,
    s =
      typeof n?.totalLines == `number` && Number.isFinite(n.totalLines)
        ? Math.max(0, Math.floor(n.totalLines))
        : void 0;
  return {
    title: r,
    path: i,
    content: a,
    ...(s === void 0 ? {} : { totalLines: s }),
    ...(n?.truncated === !0 ? { truncated: !0 } : {}),
    ...(o ? { updatedAt: o } : {}),
  };
}
var z,
  ai = e(() => {
    (c(),
      _(),
      d(),
      ct(),
      O(),
      T(),
      Ie(),
      Be(),
      Pe(),
      Re(),
      sr(),
      lr(),
      ti(),
      t(),
      (z = class extends Ke {
        constructor(...e) {
          (super(...e),
            (this.agentId = ``),
            (this.dreaming = hn()),
            (this.restartConfirmOpen = !1),
            (this.restartConfirmLoading = !1),
            (this.pendingEnabled = null),
            (this.viewState = hr()),
            (this.gatewaySource = null),
            (this.gatewayBindingEpoch = 0),
            (this.gatewayEpoch = 0),
            (this.hasBoundGatewaySource = !1),
            (this.subscriptions = new Fe(this)
              .effect(
                () => this.context?.gateway,
                (e) => {
                  let t = this.hasBoundGatewaySource;
                  ((this.hasBoundGatewaySource = !0), (this.gatewaySource = e));
                  let n = ++this.gatewayBindingEpoch;
                  this.gatewayEpoch += 1;
                  let r = e.subscribe((t) => {
                    this.isGatewayBindingCurrent(e, n) && this.applyGatewaySnapshot(t);
                  });
                  return (this.applyGatewaySnapshot(e.snapshot, t ? `replacement` : `initial`), r);
                },
              )
              .effect(
                () => this.context?.runtimeConfig,
                (e) => (
                  this.syncConfigSnapshot(),
                  e.subscribe(() => {
                    (this.syncConfigSnapshot(), this.requestUpdate());
                  })
                ),
              )));
        }
        willUpdate(e) {
          e.has(`agentId`) && this.applyAgentId();
        }
        disconnectedCallback() {
          (this.subscriptions.clear(),
            (this.gatewayBindingEpoch += 1),
            (this.gatewayEpoch += 1),
            (this.gatewaySource = null),
            this.resetTransientState(),
            (this.dreaming = hn()),
            super.disconnectedCallback());
        }
        isGatewayBindingCurrent(e, t) {
          return (
            this.isConnected &&
            this.gatewaySource === e &&
            this.gatewayBindingEpoch === t &&
            this.context.gateway === e
          );
        }
        captureTaskScope() {
          let e = this.gatewaySource;
          return e ? { gateway: e, epoch: this.gatewayEpoch, state: this.dreaming } : null;
        }
        isTaskScopeCurrent(e) {
          return (
            this.isConnected &&
            this.gatewaySource === e.gateway &&
            this.gatewayEpoch === e.epoch &&
            this.context.gateway === e.gateway &&
            this.dreaming === e.state
          );
        }
        resetTransientState() {
          (this.resetWikiPreview(),
            (this.restartConfirmOpen = !1),
            (this.restartConfirmLoading = !1),
            (this.pendingEnabled = null));
        }
        resetWikiPreview() {
          ((this.viewState.wikiPreviewRequestId += 1),
            (this.viewState.wikiPreviewOpen = !1),
            (this.viewState.wikiPreviewLoading = !1),
            (this.viewState.wikiPreviewTitle = ``),
            (this.viewState.wikiPreviewPath = ``),
            (this.viewState.wikiPreviewUpdatedAt = null),
            (this.viewState.wikiPreviewContent = ``),
            (this.viewState.wikiPreviewTotalLines = null),
            (this.viewState.wikiPreviewTruncated = !1),
            (this.viewState.wikiPreviewError = null));
        }
        createGatewayState(e = this.context.gateway.snapshot) {
          return hn({
            client: e.client,
            connected: e.connected,
            hello: e.hello,
            configSnapshot: this.context.runtimeConfig.state.configSnapshot,
            applySessionKey: e.sessionKey,
            selectedAgentId: this.agentId.trim() || null,
          });
        }
        applyGatewaySnapshot(e, t) {
          let n = this.dreaming.client !== e.client,
            r = this.dreaming.connected !== e.connected,
            i = e.connected && !this.dreaming.connected,
            a = t === `replacement` || n || r;
          (r && (this.gatewayEpoch += 1),
            a
              ? ((this.dreaming = this.createGatewayState(e)),
                t !== `initial` && this.resetTransientState())
              : ((this.dreaming.connected = e.connected),
                (this.dreaming.hello = e.hello),
                (this.dreaming.applySessionKey = e.sessionKey)),
            e.connected && (a || i) && this.loadAll(),
            this.requestUpdate());
        }
        applyAgentId() {
          let e = this.agentId.trim();
          !e ||
            this.dreaming.selectedAgentId === e ||
            ((this.gatewayEpoch += 1),
            this.resetTransientState(),
            (this.dreaming = this.createGatewayState()),
            this.dreaming.connected && this.loadAll());
        }
        syncConfigSnapshot() {
          this.dreaming.configSnapshot = this.context.runtimeConfig.state.configSnapshot;
        }
        async runDreamingTask(e, t = this.captureTaskScope()) {
          if (!t || !this.isTaskScopeCurrent(t)) return;
          let n = e(t.state);
          this.requestUpdate();
          try {
            let e = await n;
            return this.isTaskScopeCurrent(t) ? e : void 0;
          } finally {
            this.isTaskScopeCurrent(t) && this.requestUpdate();
          }
        }
        async loadAll(e = !1) {
          let t = this.captureTaskScope();
          if (!t || !t.state.client || !t.state.connected) return;
          let n = this.context.runtimeConfig;
          (e ? await n.refresh() : await n.ensureLoaded(),
            !(!this.isTaskScopeCurrent(t) || this.context.runtimeConfig !== n) &&
              (this.syncConfigSnapshot(),
              await Promise.all([
                this.runDreamingTask(Hn, t),
                this.runDreamingTask(Un, t),
                this.runDreamingTask(Wn, t),
                this.runDreamingTask(Gn, t),
              ])));
        }
        setEnabled(e, t) {
          this.dreaming.dreamingModeSaving ||
            this.restartConfirmLoading ||
            this.restartConfirmOpen ||
            t === e ||
            ((this.pendingEnabled = e),
            (this.restartConfirmOpen = !0),
            (this.dreaming.dreamingStatusError = null));
        }
        cancelRestart() {
          this.restartConfirmLoading ||
            ((this.restartConfirmOpen = !1),
            (this.pendingEnabled = null),
            (this.dreaming.dreamingStatusError = null));
        }
        async confirmRestart() {
          let e = this.pendingEnabled;
          if (e == null || this.restartConfirmLoading) return;
          ((this.restartConfirmLoading = !0), (this.dreaming.dreamingStatusError = null));
          let t = this.captureTaskScope(),
            n = this.context.runtimeConfig;
          if (!t) {
            this.restartConfirmLoading = !1;
            return;
          }
          try {
            let r = await this.runDreamingTask((t) => rr(t, n, e), t);
            if (!this.isTaskScopeCurrent(t) || this.context.runtimeConfig !== n) return;
            if (!r) {
              this.dreaming.dreamingStatusError ??= D(`dreaming.restartConfirmation.failed`);
              return;
            }
            if (
              (await n.refresh(),
              !this.isTaskScopeCurrent(t) ||
                this.context.runtimeConfig !== n ||
                (this.syncConfigSnapshot(),
                await this.runDreamingTask(Hn, t),
                !this.isTaskScopeCurrent(t)))
            )
              return;
            ((this.restartConfirmOpen = !1), (this.pendingEnabled = null));
          } finally {
            this.isTaskScopeCurrent(t) && (this.restartConfirmLoading = !1);
          }
        }
        async openWikiPage(e) {
          let t = this.captureTaskScope(),
            n = t?.state.client;
          if (!t || !n || !t.state.connected) return null;
          let r = t.state.selectedAgentId?.trim() || null,
            i = await n.request(`wiki.get`, {
              lookup: e,
              fromLine: 1,
              lineCount: 5e3,
              ...(r ? { agentId: r } : {}),
            });
          return !this.isTaskScopeCurrent(t) || (t.state.selectedAgentId?.trim() || null) !== r
            ? null
            : ii(i, e);
        }
        async refreshWikiData(e) {
          let t = this.captureTaskScope();
          if (!t) return;
          let n = this.context.runtimeConfig;
          (await n.refresh(),
            !(!this.isTaskScopeCurrent(t) || this.context.runtimeConfig !== n) &&
              (this.syncConfigSnapshot(), await this.runDreamingTask(e, t)));
        }
        render() {
          let e = this.dreaming,
            t = this.context.runtimeConfig.state,
            n = e.dreamingStatus?.enabled ?? On(E(t)).enabled,
            r = e.dreamingStatusLoading || e.dreamingModeSaving,
            i = e.dreamingStatusLoading || e.dreamDiaryLoading,
            a = e.selectedAgentId ?? this.agentId;
          return g`
      <section class="content-header content-header--page agent-memory-panel__header">
        <div class="page-meta">
          <div class="dreaming-header-controls">
            <button
              class="btn btn--subtle btn--sm"
              ?disabled=${r || e.dreamDiaryLoading}
              @click=${() => void this.loadAll(!0)}
            >
              ${D(i ? `dreaming.header.refreshing` : `dreaming.header.refresh`)}
            </button>
            <button
              class="dreams__phase-toggle ${n ? `dreams__phase-toggle--on` : ``}"
              ?disabled=${r}
              @click=${() => this.setEnabled(!n, n)}
            >
              <span class="dreams__phase-toggle-dot"></span>
              <span class="dreams__phase-toggle-label">
                ${D(n ? `dreaming.header.on` : `dreaming.header.off`)}
              </span>
            </button>
          </div>
        </div>
      </section>
      ${yr({ viewState: this.viewState, active: n, selectedAgentId: a, shortTermCount: e.dreamingStatus?.shortTermCount ?? 0, groundedSignalCount: e.dreamingStatus?.groundedSignalCount ?? 0, totalSignalCount: e.dreamingStatus?.totalSignalCount ?? 0, promotedCount: e.dreamingStatus?.promotedToday ?? 0, phases: e.dreamingStatus?.phases ?? void 0, shortTermEntries: e.dreamingStatus?.shortTermEntries ?? [], promotedEntries: e.dreamingStatus?.promotedEntries ?? [], dreamingOf: null, nextCycle: ri(e.dreamingStatus), timezone: e.dreamingStatus?.timezone ?? null, statusLoading: e.dreamingStatusLoading, statusError: e.dreamingStatusError, modeSaving: e.dreamingModeSaving, dreamDiaryLoading: e.dreamDiaryLoading, dreamDiaryActionLoading: e.dreamDiaryActionLoading, dreamDiaryActionMessage: e.dreamDiaryActionMessage, dreamDiaryActionArchivePath: e.dreamDiaryActionArchivePath, dreamDiaryError: e.dreamDiaryError, dreamDiaryPath: e.dreamDiaryPath, dreamDiaryContent: e.dreamDiaryContent, memoryWikiEnabled: ze(t.configSnapshot, `memory-wiki`, { enabledByDefault: !1 }), wikiImportInsightsLoading: e.wikiImportInsightsLoading, wikiImportInsightsError: e.wikiImportInsightsError, wikiImportInsights: e.wikiImportInsights, wikiMemoryPalaceLoading: e.wikiMemoryPalaceLoading, wikiMemoryPalaceError: e.wikiMemoryPalaceError, wikiMemoryPalace: e.wikiMemoryPalace, onRefresh: () => void this.loadAll(!0), onRefreshDiary: () => void this.runDreamingTask(Un), onRefreshImports: () => void this.refreshWikiData(Wn), onRefreshMemoryPalace: () => void this.refreshWikiData(Gn), onOpenConfig: () => void this.context.runtimeConfig.openFile(), onOpenWikiPage: (e) => this.openWikiPage(e), onBackfillDiary: () => void this.runDreamingTask(qn), onCopyDreamingArchivePath: () => void this.runDreamingTask(Zn), onDedupeDreamDiary: () => void this.runDreamingTask(Qn), onResetDiary: () => void this.runDreamingTask(Jn), onResetGroundedShortTerm: () => void this.runDreamingTask(Yn), onRepairDreamingArtifacts: () => void this.runDreamingTask(Xn), onViewStateChange: () => this.requestUpdate() })}
      ${cr({ open: this.restartConfirmOpen, loading: this.restartConfirmLoading, onConfirm: () => void this.confirmRestart(), onCancel: () => this.cancelRestart(), hasError: !!e.dreamingStatusError })}
    `;
        }
      }),
      r([l({ context: rt, subscribe: !0 })], z.prototype, `context`, void 0),
      r([m({ attribute: !1 })], z.prototype, `agentId`, void 0),
      r([p()], z.prototype, `dreaming`, void 0),
      r([p()], z.prototype, `restartConfirmOpen`, void 0),
      r([p()], z.prototype, `restartConfirmLoading`, void 0),
      r([p()], z.prototype, `pendingEnabled`, void 0),
      customElements.get(`openclaw-agent-memory-panel`) ||
        customElements.define(`openclaw-agent-memory-panel`, z));
  });
function oi(e) {
  let {
      agent: t,
      configForm: n,
      agentFilesList: r,
      configLoading: i,
      configSaving: a,
      configDirty: o,
      onConfigReload: s,
      onConfigSave: c,
      onModelChange: l,
      onModelFallbacksChange: u,
      onSelectPanel: d,
    } = e,
    f = !!(e.defaultId && t.id === e.defaultId),
    p = ge(n, t.id),
    m = t.model,
    h =
      (r && r.agentId === t.id ? r.workspace : null) ||
      p.entry?.workspace ||
      p.defaults?.workspace ||
      t.workspace ||
      `default`,
    _ = p.entry?.model ? pe(p.entry?.model) : p.defaults?.model ? pe(p.defaults?.model) : pe(m),
    ee = Ce(t.agentRuntime),
    y = pe(p.defaults?.model ?? m),
    te = Ee(p.entry?.model),
    b = Ee(p.defaults?.model) || (y === `-` ? null : de(y)) || (n ? null : Ee(m)),
    ne = te ?? b ?? null,
    x = f ? ne : te,
    S = De(p.entry?.model) ?? De(p.defaults?.model) ?? (n ? null : De(m)) ?? [],
    re = Array.isArray(p.entry?.skills) ? p.entry?.skills : null,
    C = re?.length ?? null,
    ie = !n || i || a,
    ae = t.thinkingDefault ?? `-`,
    w = e.identityDraft,
    oe = w.name ?? e.agentIdentity?.name ?? t.identity?.name ?? t.name ?? ``,
    se = w.emoji ?? e.agentIdentity?.emoji ?? t.identity?.emoji ?? ``,
    ce = w.avatar ?? Ve(t, e.agentIdentity),
    le = nt(t) ?? (oe || t.id).slice(0, 1).toUpperCase(),
    ue = w.name !== null || w.emoji !== null || w.avatar !== null,
    fe = (w.name !== null && !w.name.trim()) || (w.emoji !== null && !w.emoji.trim()),
    T = e.identitySaving,
    E = (t) => {
      let n = t.target,
        r = n.files?.[0];
      ((n.value = ``), r && e.onIdentityAvatarSelect(r));
    },
    he = (e) => {
      let n = S.filter((t, n) => n !== e);
      u(t.id, n);
    };
  return g`
    ${M(
      { title: D(`agents.identity.title`), description: D(`agents.identity.subtitle`) },
      g`
        <div class="settings-row settings-row--stacked">
          <div class="agent-identity-editor">
            <span class="agent-identity-editor__avatar" aria-hidden="true">
              ${
                ce
                  ? g`<img src=${ce} alt="" decoding="async" />`
                  : g`<span class="agent-identity-editor__avatar-text"
                    >${le}</span
                  >`
              }
            </span>
            <div class="agent-identity-editor__fields">
              <label class="field">
                <span>${D(`agents.identity.name`)}</span>
                <input
                  type="text"
                  maxlength="64"
                  .value=${oe}
                  placeholder=${D(`agents.identity.namePlaceholder`)}
                  ?disabled=${T}
                  @input=${(t) => e.onIdentityFieldChange(`name`, t.target.value)}
                />
              </label>
              <label class="field agent-identity-editor__emoji">
                <span>${D(`agents.identity.emoji`)}</span>
                <input
                  type="text"
                  maxlength="8"
                  .value=${se}
                  placeholder="🦞"
                  ?disabled=${T}
                  @input=${(t) => e.onIdentityFieldChange(`emoji`, t.target.value)}
                />
              </label>
            </div>
          </div>
          ${
            e.identityError
              ? g`<div class="settings-row__desc" role="alert" style="color: var(--danger);">
                ${e.identityError}
              </div>`
              : v
          }
          <div class="agent-identity-editor__actions">
            <label class="btn btn--sm">
              ${D(ce ? `agents.identity.replaceImage` : `agents.identity.chooseImage`)}
              <input
                type="file"
                accept="image/*"
                hidden
                ?disabled=${T}
                @change=${E}
              />
            </label>
            <button
              type="button"
              class="btn btn--sm primary"
              ?disabled=${T || !ue || fe}
              @click=${() => e.onIdentitySave()}
            >
              ${D(T ? `common.saving` : `common.save`)}
            </button>
          </div>
          <div class="settings-row__desc agent-identity-editor__hint">
            ${D(`agents.identity.fileHint`)}
          </div>
        </div>
      `,
    )}
    ${M(
      { title: D(`agents.overview.title`), description: D(`agents.overview.subtitle`) },
      g`
        <dl class="settings-kv">
          <dt>${D(`agents.context.workspace`)}</dt>
          <dd>
            <openclaw-tooltip .content=${D(`agents.context.openFilesTab`)}>
              <button
                type="button"
                class="workspace-link mono"
                @click=${() => d(`files`)}
                aria-label=${D(`agents.context.openFilesTab`)}
              >
                ${h}
              </button>
            </openclaw-tooltip>
          </dd>
          <dt>${D(`agents.context.primaryModel`)}</dt>
          <dd><code>${_}</code></dd>
          <dt>${D(`agents.context.runtime`)}</dt>
          <dd><code>${ee}</code></dd>
          <dt>${D(`agents.context.thinkingDefault`)}</dt>
          <dd><code>${ae}</code></dd>
          <dt>${D(`agents.context.skillsFilter`)}</dt>
          <dd>
            ${re ? D(`agents.overview.selectedSkills`, { count: String(C) }) : D(`agents.overview.allSkills`)}
          </dd>
        </dl>
      `,
    )}
    ${o ? g`<div class="callout warn">${D(`agents.overview.unsavedConfig`)}</div>` : v}
    ${M(
      {
        title: D(`agents.overview.modelSelection`),
        actions: g`
          <button
            type="button"
            class="btn btn--sm"
            ?disabled=${i}
            @click=${s}
          >
            ${D(`common.reloadConfig`)}
          </button>
          <button
            type="button"
            class="btn btn--sm primary"
            ?disabled=${a || !o}
            @click=${c}
          >
            ${D(a ? `common.saving` : `common.save`)}
          </button>
        `,
      },
      g`
        ${j({
          title: D(f ? `agents.overview.primaryModelDefault` : `agents.overview.primaryModel`),
          control: g`
            <select
              class="settings-select"
              .value=${x ?? ``}
              ?disabled=${ie}
              @change=${(e) => l(t.id, e.target.value || null)}
            >
              ${
                f
                  ? g`
                    <option value="" ?selected=${!x}>
                      ${D(`agents.overview.notSet`)}
                    </option>
                  `
                  : g`
                    <option value="" ?selected=${!x}>
                      ${b ? D(`agents.overview.inheritDefaultModel`, { model: b }) : D(`agents.overview.inheritDefault`)}
                    </option>
                  `
              }
              ${Ge(n, ne ?? void 0, e.modelCatalog, x)}
            </select>
          `,
        })}
        ${j({
          title: D(`agents.overview.fallbacks`),
          stacked: !0,
          control: g`
            <div
              class="agent-chip-input"
              @click=${(e) => {
                let t = e.currentTarget.querySelector(`input`);
                t && t.focus();
              }}
            >
              ${S.map(
                (e, t) => g`
                  <span class="chip">
                    ${e}
                    <button
                      type="button"
                      class="chip-remove"
                      ?disabled=${ie}
                      @click=${() => he(t)}
                    >
                      &times;
                    </button>
                  </span>
                `,
              )}
              <input
                ?disabled=${ie}
                placeholder=${S.length === 0 ? `provider/model` : ``}
                @keydown=${(e) => {
                  let n = e.target;
                  if (e.key === `Enter` || e.key === `,`) {
                    e.preventDefault();
                    let r = me(n.value);
                    r.length > 0 && (u(t.id, [...S, ...r]), (n.value = ``));
                  }
                }}
                @blur=${(e) => {
                  let n = e.target,
                    r = me(n.value);
                  r.length > 0 && (u(t.id, [...S, ...r]), (n.value = ``));
                }}
              />
            </div>
          `,
        })}
      `,
    )}
  `;
}
var si = e(() => {
  (_(), St(), ft(), O(), We(), Je());
});
function ci(e) {
  return { ...ki, ...e, plugins: e?.plugins ?? [], customRenderers: e?.customRenderers ?? {} };
}
function li(e, t) {
  return typeof t == `function` ? t(e) : e;
}
function ui(e, t) {
  let n = ci(t),
    r = n.classPrefix,
    i = e;
  for (let e of n.plugins) e.transformBlock && (i = i.map(e.transformBlock));
  let a = `<div class="${r}preview">${i.map((e) => {
    for (let t of n.plugins)
      if (t.renderBlock) {
        let r = t.renderBlock(e, () => fi(e, n));
        if (r !== null) return r;
      }
    let t = n.customRenderers[e.type];
    return t ? t(e) : fi(e, n);
  }).join(`
`)}</div>`;
  return ((a = li(a, n.sanitize)), a);
}
async function di(e, t) {
  let n = ci(t);
  for (let e of n.plugins) e.init && (await e.init());
  let r = ui(e, t);
  for (let e of n.plugins) e.postProcess && (r = await e.postProcess(r));
  return r;
}
function fi(e, t) {
  let n = t.classPrefix;
  switch (e.type) {
    case `paragraph`:
      return `<p class="${n}paragraph">${B(e.content, t)}</p>`;
    case `heading`:
      return pi(e, t);
    case `bulletList`:
      return mi(e, t);
    case `numberedList`:
      return hi(e, t);
    case `checkList`:
      return gi(e, t);
    case `codeBlock`:
      return _i(e, t);
    case `blockquote`:
      return `<blockquote class="${n}blockquote">${B(e.content, t)}</blockquote>`;
    case `table`:
      return vi(e, t);
    case `image`:
      return yi(e, t);
    case `divider`:
      return `<hr class="${n}divider" />`;
    case `callout`:
      return bi(e, t);
    default:
      return `<div class="${n}unknown">${B(e.content, t)}</div>`;
  }
}
function pi(e, t) {
  let n = t.classPrefix,
    r = e.props.level,
    i = `h${r}`;
  return `<${i} class="${n}heading ${n}h${r}">${B(e.content, t)}</${i}>`;
}
function mi(e, t) {
  return `<ul class="${t.classPrefix}bullet-list">
${e.children.map((e) => `<li>${B(e.content, t)}</li>`).join(`
`)}
</ul>`;
}
function hi(e, t) {
  return `<ol class="${t.classPrefix}numbered-list">
${e.children.map((e) => `<li>${B(e.content, t)}</li>`).join(`
`)}
</ol>`;
}
function gi(e, t) {
  let n = t.classPrefix,
    r = e.props.checked;
  return `
<div class="${n}checklist-item">
  <input type="checkbox" ${r ? `checked disabled` : `disabled`} />
  <span class="${r ? `${n}checked` : ``}">${B(e.content, t)}</span>
</div>`.trim();
}
function _i(e, t) {
  let n = t.classPrefix,
    r = e.content.map((e) => e.text).join(``),
    i = e.props.language || ``,
    a = V(r),
    o = i ? ` language-${i}` : ``;
  return `<pre class="${n}code-block"${i ? ` data-language="${i}"` : ``}><code class="${n}code${o}">${a}</code></pre>`;
}
function vi(e, t) {
  let n = t.classPrefix,
    { headers: r, rows: i, alignments: a } = e.props,
    o = (e) => {
      let t = a?.[e];
      return t ? ` style="text-align: ${t}"` : ``;
    };
  return `<table class="${n}table">
${r.length > 0 ? `<thead><tr>${r.map((e, t) => `<th${o(t)}>${V(e)}</th>`).join(``)}</tr></thead>` : ``}
<tbody>
${i.map((e) => `<tr>${e.map((e, t) => `<td${o(t)}>${V(e)}</td>`).join(``)}</tr>`).join(`
`)}
</tbody>
</table>`;
}
function yi(e, t) {
  let n = t.classPrefix,
    { url: r, alt: i, title: a, width: o, height: s } = e.props,
    c = i ? ` alt="${V(i)}"` : ` alt=""`,
    l = a ? ` title="${V(a)}"` : ``,
    u = o ? ` width="${o}"` : ``,
    d = s ? ` height="${s}"` : ``;
  return `<figure class="${n}image">${`<img src="${V(r)}"${c}${l}${u}${d} />`}${i ? `<figcaption>${V(i)}</figcaption>` : ``}</figure>`;
}
function bi(e, t) {
  let n = t.classPrefix,
    r = e.props.type;
  return `
<div class="${n}callout ${n}callout-${r}" role="alert">
  <strong class="${n}callout-title">${r}</strong>
  <div class="${n}callout-content">${B(e.content, t)}</div>
</div>`.trim();
}
function B(e, t) {
  return e.map((e) => xi(e, t)).join(``);
}
function xi(e, t) {
  let n = V(e.text),
    r = e.styles;
  if (
    (r.code && (n = `<code>${n}</code>`),
    r.highlight && (n = `<mark>${n}</mark>`),
    r.strikethrough && (n = `<del>${n}</del>`),
    r.underline && (n = `<u>${n}</u>`),
    r.italic && (n = `<em>${n}</em>`),
    r.bold && (n = `<strong>${n}</strong>`),
    r.link)
  ) {
    let e = t.linkTarget === `_blank` ? ` target="_blank" rel="noopener noreferrer"` : ``,
      i = r.link.title ? ` title="${V(r.link.title)}"` : ``;
    n = `<a href="${V(r.link.url)}"${i}${e}>${n}</a>`;
  }
  return n;
}
function V(e) {
  return e
    .replace(/&/g, `&amp;`)
    .replace(/</g, `&lt;`)
    .replace(/>/g, `&gt;`)
    .replace(/"/g, `&quot;`)
    .replace(/'/g, `&#039;`);
}
function Si(e) {
  return [
    ...[1, 2, 3, 4, 5, 6].map((t) => ({ tag: `h${t}`, classes: [`${e}heading`, `${e}h${t}`] })),
    { tag: `p`, classes: [`${e}paragraph`] },
    { tag: `ul`, classes: [`${e}bullet-list`] },
    { tag: `ol`, classes: [`${e}numbered-list`] },
    { tag: `pre`, classes: [`${e}code-block`] },
    { tag: `blockquote`, classes: [`${e}blockquote`] },
    { tag: `hr`, classes: [`${e}divider`] },
    { tag: `table`, classes: [`${e}table`] },
    { tag: `figure`, classes: [`${e}image`] },
  ];
}
function Ci(e, t) {
  let n = t.join(` `),
    r = /\bclass\s*=\s*"([^"]*)"/i,
    i = e.match(r);
  return i
    ? e.replace(r, `class="${n} ${i[1]}"`)
    : e.endsWith(`/>`)
      ? e.slice(0, -2) + ` class="${n}" />`
      : e.slice(0, -1) + ` class="${n}">`;
}
function wi(e, t) {
  return e.replace(
    /(?<!<figure[^>]*>\s*)(<img\s[^>]*\/?>)(?!\s*<\/figure>)/gi,
    `<figure class="${t}image">$1</figure>`,
  );
}
function Ti(e, t) {
  let n = t?.classPrefix ?? `cm-`,
    r = t?.wrapperClass ?? `${n}preview`,
    i = Si(n),
    a = e;
  for (let { tag: e, classes: t } of i) {
    let n = RegExp(`<${e}(\\s[^>]*)?>|<${e}\\s*\\/?>`, `gi`);
    a = a.replace(n, (e) => Ci(e, t));
  }
  return (
    (a = wi(a, n)),
    (a = `<div class="${r}">${a}</div>`),
    typeof t?.sanitize == `function` && (a = t.sanitize(a)),
    a
  );
}
async function Ei(e) {
  try {
    return (
      await a(() => import(`./preview-DzpTTA8I.js`), __vite__mapDeps([0, 1]), import.meta.url)
    ).parse(e);
  } catch {
    throw Error(
      `@create-markdown/core is required to parse markdown in <markdown-preview>. Install it, or provide pre-parsed blocks via the blocks attribute / setBlocks().`,
    );
  }
}
var Di,
  Oi,
  H,
  ki,
  Ai,
  ji = e(() => {
    (o(),
      (Di = Object.defineProperty),
      (Oi = (e, t, n) =>
        t in e
          ? Di(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
          : (e[t] = n)),
      (H = (e, t, n) => Oi(e, typeof t == `symbol` ? t : t + ``, n)),
      (ki = {
        classPrefix: `cm-`,
        theme: `github`,
        linkTarget: `_blank`,
        sanitize: !1,
        plugins: [],
        customRenderers: {},
      }),
      (Ai = class extends HTMLElement {
        constructor() {
          (super(),
            H(this, `_shadow`, null),
            H(this, `plugins`, []),
            H(this, `defaultTheme`, `github`),
            H(this, `styleElement`),
            H(this, `contentElement`));
          let e = this.constructor._shadowMode;
          (e !== `none` && (this._shadow = this.attachShadow({ mode: e })),
            (this.styleElement = document.createElement(`style`)),
            this.renderRoot.appendChild(this.styleElement),
            (this.contentElement = document.createElement(`div`)),
            (this.contentElement.className = `markdown-preview-content`),
            this.renderRoot.appendChild(this.contentElement),
            this.updateStyles());
        }
        static get observedAttributes() {
          return [`theme`, `link-target`, `async`];
        }
        get renderRoot() {
          return this._shadow ?? this;
        }
        connectedCallback() {
          this.render();
        }
        attributeChangedCallback(e, t, n) {
          this.render();
        }
        setPlugins(e) {
          ((this.plugins = e), this.render());
        }
        setDefaultTheme(e) {
          ((this.defaultTheme = e), this.render());
        }
        getMarkdown() {
          let e = this.getAttribute(`blocks`);
          if (e)
            try {
              return JSON.parse(e).map((e) => e.content.map((e) => e.text).join(``)).join(`

`);
            } catch {
              return ``;
            }
          return this.textContent || ``;
        }
        setMarkdown(e) {
          ((this.textContent = e), this.render());
        }
        setBlocks(e) {
          (this.setAttribute(`blocks`, JSON.stringify(e)), this.render());
        }
        getOptions() {
          return {
            theme: this.getAttribute(`theme`) || this.defaultTheme,
            linkTarget: this.getAttribute(`link-target`) || `_blank`,
            plugins: this.plugins,
          };
        }
        async getBlocks() {
          let e = this.getAttribute(`blocks`);
          if (e)
            try {
              return JSON.parse(e);
            } catch {
              return (console.warn(`Invalid blocks JSON in markdown-preview element`), []);
            }
          return Ei(this.textContent || ``);
        }
        async render() {
          let e = await this.getBlocks(),
            t = this.getOptions(),
            n = this.hasAttribute(`async`) || this.plugins.length > 0;
          try {
            let r;
            ((r = n ? await di(e, t) : ui(e, t)), (this.contentElement.innerHTML = r));
          } catch (e) {
            (console.error(`Error rendering markdown preview:`, e),
              (this.contentElement.innerHTML = `<div class="error">Error rendering content</div>`));
          }
        }
        updateStyles() {
          let e = this.plugins.filter((e) => e.getCSS).map((e) => e.getCSS()).join(`

`),
            t = this._shadow ? `:host { display: block; }` : `markdown-preview { display: block; }`;
          this.styleElement.textContent = `
${t}

.markdown-preview-content {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.6;
}

.error {
  color: #cf222e;
  padding: 1rem;
  background: #ffebe9;
  border-radius: 6px;
}

${e}
    `.trim();
        }
      }),
      H(Ai, `_shadowMode`, `open`));
  });
function Mi() {
  return {
    async: !1,
    breaks: !1,
    extensions: null,
    gfm: !0,
    hooks: null,
    pedantic: !1,
    renderer: null,
    silent: !1,
    tokenizer: null,
    walkTokens: null,
  };
}
function Ni(e) {
  q = e;
}
function Pi(e) {
  let t = [];
  return (n) => {
    let r = Math.max(0, Math.min(3, n - 1)),
      i = t[r];
    return (i || ((i = e(r)), (t[r] = i)), i);
  };
}
function U(e, t = ``) {
  let n = typeof e == `string` ? e : e.source,
    r = {
      replace: (e, t) => {
        let i = typeof t == `string` ? t : t.source;
        return ((i = i.replace(Y.caret, `$1`)), (n = n.replace(e, i)), r);
      },
      getRegex: () => new RegExp(n, t),
    };
  return r;
}
function W(e, t) {
  if (t) {
    if (Y.escapeTest.test(e)) return e.replace(Y.escapeReplace, Ya);
  } else if (Y.escapeTestNoEncode.test(e)) return e.replace(Y.escapeReplaceNoEncode, Ya);
  return e;
}
function Fi(e) {
  try {
    e = encodeURI(e).replace(Y.percentDecode, `%`);
  } catch {
    return null;
  }
  return e;
}
function Ii(e, t) {
  let n = e
      .replace(Y.findPipe, (e, t, n) => {
        let r = !1,
          i = t;
        for (; --i >= 0 && n[i] === `\\`;) r = !r;
        return r ? `|` : ` |`;
      })
      .split(Y.splitPipe),
    r = 0;
  if ((n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), t))
    if (n.length > t) n.splice(t);
    else for (; n.length < t;) n.push(``);
  for (; r < n.length; r++) n[r] = n[r].trim().replace(Y.slashPipe, `|`);
  return n;
}
function G(e, t, n) {
  let r = e.length;
  if (r === 0) return ``;
  let i = 0;
  for (; i < r;) {
    let a = e.charAt(r - i - 1);
    if (a === t && !n) i++;
    else if (a !== t && n) i++;
    else break;
  }
  return e.slice(0, r - i);
}
function Li(e) {
  let t = e.split(`
`),
    n = t.length - 1;
  for (; n >= 0 && Y.blankLine.test(t[n]);) n--;
  return t.length - n <= 2
    ? e
    : t.slice(0, n + 1).join(`
`);
}
function Ri(e, t) {
  if (e.indexOf(t[1]) === -1) return -1;
  let n = 0;
  for (let r = 0; r < e.length; r++)
    if (e[r] === `\\`) r++;
    else if (e[r] === t[0]) n++;
    else if (e[r] === t[1] && (n--, n < 0)) return r;
  return n > 0 ? -2 : -1;
}
function zi(e, t = 0) {
  let n = t,
    r = ``;
  for (let t of e)
    if (t === `	`) {
      let e = 4 - (n % 4);
      ((r += ` `.repeat(e)), (n += e));
    } else ((r += t), n++);
  return r;
}
function Bi(e, t, n, r, i) {
  let a = t.href,
    o = t.title || null,
    s = e[1].replace(i.other.outputLinkReplace, `$1`);
  r.state.inLink = !0;
  let c = {
    type: e[0].charAt(0) === `!` ? `image` : `link`,
    raw: n,
    href: a,
    title: o,
    text: s,
    tokens: r.inlineTokens(s),
  };
  return ((r.state.inLink = !1), c);
}
function Vi(e, t, n) {
  let r = e.match(n.other.indentCodeCompensation);
  if (r === null) return t;
  let i = r[1];
  return t
    .split(`
`)
    .map((e) => {
      let t = e.match(n.other.beginningSpace);
      if (t === null) return e;
      let [r] = t;
      return r.length >= i.length ? e.slice(i.length) : e;
    }).join(`
`);
}
function K(e, t) {
  return Q.parse(e, t);
}
var q,
  J,
  Hi,
  Y,
  Ui,
  Wi,
  Gi,
  Ki,
  qi,
  Ji,
  Yi,
  Xi,
  Zi,
  Qi,
  $i,
  ea,
  ta,
  na,
  ra,
  ia,
  aa,
  oa,
  sa,
  ca,
  la,
  ua,
  da,
  fa,
  pa,
  ma,
  ha,
  ga,
  _a,
  va,
  ya,
  ba,
  xa,
  Sa,
  Ca,
  wa,
  Ta,
  Ea,
  Da,
  Oa,
  ka,
  Aa,
  ja,
  Ma,
  Na,
  Pa,
  Fa,
  Ia,
  La,
  Ra,
  za,
  Ba,
  Va,
  Ha,
  Ua,
  Wa,
  Ga,
  Ka,
  qa,
  Ja,
  Ya,
  Xa,
  X,
  Za,
  Qa,
  Z,
  $a,
  eo,
  Q,
  to = e(() => {
    ((q = Mi()),
      (J = { exec: () => null }),
      (Hi = ((e = ``) => {
        try {
          return !!RegExp(`(?<=1)(?<!1)` + e);
        } catch {
          return !1;
        }
      })()),
      (Y = {
        codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
        outputLinkReplace: /\\([\[\]])/g,
        indentCodeCompensation: /^(\s+)(?:```)/,
        beginningSpace: /^\s+/,
        endingHash: /#$/,
        startingSpaceChar: /^ /,
        endingSpaceChar: / $/,
        nonSpaceChar: /[^ ]/,
        newLineCharGlobal: /\n/g,
        tabCharGlobal: /\t/g,
        multipleSpaceGlobal: /\s+/g,
        blankLine: /^[ \t]*$/,
        doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
        blockquoteStart: /^ {0,3}>/,
        blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
        blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
        listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
        listIsTask: /^\[[ xX]\] +\S/,
        listReplaceTask: /^\[[ xX]\] +/,
        listTaskCheckbox: /\[[ xX]\]/,
        anyLine: /\n.*\n/,
        hrefBrackets: /^<(.*)>$/,
        tableDelimiter: /[:|]/,
        tableAlignChars: /^\||\| *$/g,
        tableRowBlankLine: /\n[ \t]*$/,
        tableAlignRight: /^ *-+: *$/,
        tableAlignCenter: /^ *:-+: *$/,
        tableAlignLeft: /^ *:-+ *$/,
        startATag: /^<a /i,
        endATag: /^<\/a>/i,
        startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
        endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
        startAngleBracket: /^</,
        endAngleBracket: />$/,
        pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
        unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
        escapeTest: /[&<>"']/,
        escapeReplace: /[&<>"']/g,
        escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
        escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
        caret: /(^|[^\[])\^/g,
        percentDecode: /%25/g,
        findPipe: /\|/g,
        splitPipe: / \|/,
        slashPipe: /\\\|/g,
        carriageReturn: /\r\n|\r/g,
        spaceLine: /^ +$/gm,
        notSpaceStart: /^\S*/,
        endingNewline: /\n$/,
        listItemRegex: (e) => RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),
        nextBulletRegex: Pi((e) =>
          RegExp(`^ {0,${e}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),
        ),
        hrRegex: Pi((e) => RegExp(`^ {0,${e}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`)),
        fencesBeginRegex: Pi((e) => RegExp(`^ {0,${e}}(?:\`\`\`|~~~)`)),
        headingBeginRegex: Pi((e) => RegExp(`^ {0,${e}}#`)),
        htmlBeginRegex: Pi((e) => RegExp(`^ {0,${e}}<(?:[a-z].*>|!--)`, `i`)),
        blockquoteBeginRegex: Pi((e) => RegExp(`^ {0,${e}}>`)),
      }),
      (Ui = /^(?:[ \t]*(?:\n|$))+/),
      (Wi = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/),
      (Gi =
        /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/),
      (Ki = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/),
      (qi = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/),
      (Ji = / {0,3}(?:[*+-]|\d{1,9}[.)])/),
      (Yi =
        /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/),
      (Xi = U(Yi)
        .replace(/bull/g, Ji)
        .replace(/blockCode/g, /(?: {4}| {0,3}\t)/)
        .replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/)
        .replace(/blockquote/g, / {0,3}>/)
        .replace(/heading/g, / {0,3}#{1,6}/)
        .replace(/html/g, / {0,3}<[^\n>]+>\n/)
        .replace(/\|table/g, ``)
        .getRegex()),
      (Zi = U(Yi)
        .replace(/bull/g, Ji)
        .replace(/blockCode/g, /(?: {4}| {0,3}\t)/)
        .replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/)
        .replace(/blockquote/g, / {0,3}>/)
        .replace(/heading/g, / {0,3}#{1,6}/)
        .replace(/html/g, / {0,3}<[^\n>]+>\n/)
        .replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/)
        .getRegex()),
      (Qi = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/),
      ($i = /^[^\n]+/),
      (ea = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/),
      (ta = U(
        /^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/,
      )
        .replace(`label`, ea)
        .replace(`title`, /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/)
        .getRegex()),
      (na = U(/^(bull)([ \t][^\n]*?)?(?:\n|$)/)
        .replace(/bull/g, Ji)
        .getRegex()),
      (ra = `address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul`),
      (ia = /<!--(?:-?>|[\s\S]*?(?:-->|$))/),
      (aa = U(
        `^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))`,
        `i`,
      )
        .replace(`comment`, ia)
        .replace(`tag`, ra)
        .replace(
          `attribute`,
          / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/,
        )
        .getRegex()),
      (oa = U(Qi)
        .replace(`hr`, Ki)
        .replace(`heading`, ` {0,3}#{1,6}(?:\\s|$)`)
        .replace(`|lheading`, ``)
        .replace(`|table`, ``)
        .replace(`blockquote`, ` {0,3}>`)
        .replace(`fences`, " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n")
        .replace(`list`, ` {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]`)
        .replace(`html`, `</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)`)
        .replace(`tag`, ra)
        .getRegex()),
      (sa = {
        blockquote: U(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/)
          .replace(`paragraph`, oa)
          .getRegex(),
        code: Wi,
        def: ta,
        fences: Gi,
        heading: qi,
        hr: Ki,
        html: aa,
        lheading: Xi,
        list: na,
        newline: Ui,
        paragraph: oa,
        table: J,
        text: $i,
      }),
      (ca = U(
        `^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)`,
      )
        .replace(`hr`, Ki)
        .replace(`heading`, ` {0,3}#{1,6}(?:\\s|$)`)
        .replace(`blockquote`, ` {0,3}>`)
        .replace(`code`, `(?: {4}| {0,3}	)[^\\n]`)
        .replace(`fences`, " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n")
        .replace(`list`, ` {0,3}(?:[*+-]|1[.)])[ \\t]`)
        .replace(`html`, `</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)`)
        .replace(`tag`, ra)
        .getRegex()),
      (la = {
        ...sa,
        lheading: Zi,
        table: ca,
        paragraph: U(Qi)
          .replace(`hr`, Ki)
          .replace(`heading`, ` {0,3}#{1,6}(?:\\s|$)`)
          .replace(`|lheading`, ``)
          .replace(`table`, ca)
          .replace(`blockquote`, ` {0,3}>`)
          .replace(`fences`, " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n")
          .replace(`list`, ` {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]`)
          .replace(`html`, `</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)`)
          .replace(`tag`, ra)
          .getRegex(),
      }),
      (ua = {
        ...sa,
        html: U(
          `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`,
        )
          .replace(`comment`, ia)
          .replace(
            /tag/g,
            `(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b`,
          )
          .getRegex(),
        def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
        heading: /^(#{1,6})(.*)(?:\n+|$)/,
        fences: J,
        lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
        paragraph: U(Qi)
          .replace(`hr`, Ki)
          .replace(
            `heading`,
            ` *#{1,6} *[^
]`,
          )
          .replace(`lheading`, Xi)
          .replace(`|table`, ``)
          .replace(`blockquote`, ` {0,3}>`)
          .replace(`|fences`, ``)
          .replace(`|list`, ``)
          .replace(`|html`, ``)
          .replace(`|tag`, ``)
          .getRegex(),
      }),
      (da = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/),
      (fa = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/),
      (pa = /^( {2,}|\\)\n(?!\s*$)/),
      (ma = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/),
      (ha = /[\p{P}\p{S}]/u),
      (ga = /[\s\p{P}\p{S}]/u),
      (_a = /[^\s\p{P}\p{S}]/u),
      (va = U(/^((?![*_])punctSpace)/, `u`)
        .replace(/punctSpace/g, ga)
        .getRegex()),
      (ya = /(?!~)[\p{P}\p{S}]/u),
      (ba = /(?!~)[\s\p{P}\p{S}]/u),
      (xa = /(?:[^\s\p{P}\p{S}]|~)/u),
      (Sa = U(/link|precode-code|html/, `g`)
        .replace(
          `link`,
          /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/,
        )
        .replace(`precode-`, Hi ? "(?<!`)()" : "(^^|[^`])")
        .replace(`code`, /(?<b>`+)[^`]+\k<b>(?!`)/)
        .replace(`html`, /<(?! )[^<>]*?>/)
        .getRegex()),
      (Ca = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/),
      (wa = U(Ca, `u`).replace(/punct/g, ha).getRegex()),
      (Ta = U(Ca, `u`).replace(/punct/g, ya).getRegex()),
      (Ea = `^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)`),
      (Da = U(Ea, `gu`)
        .replace(/notPunctSpace/g, _a)
        .replace(/punctSpace/g, ga)
        .replace(/punct/g, ha)
        .getRegex()),
      (Oa = U(Ea, `gu`)
        .replace(/notPunctSpace/g, xa)
        .replace(/punctSpace/g, ba)
        .replace(/punct/g, ya)
        .getRegex()),
      (ka = U(
        `^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)`,
        `gu`,
      )
        .replace(/notPunctSpace/g, _a)
        .replace(/punctSpace/g, ga)
        .replace(/punct/g, ha)
        .getRegex()),
      (Aa = U(/^~~?(?:((?!~)punct)|[^\s~])/, `u`)
        .replace(/punct/g, ha)
        .getRegex()),
      (ja = U(
        `^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)`,
        `gu`,
      )
        .replace(/notPunctSpace/g, _a)
        .replace(/punctSpace/g, ga)
        .replace(/punct/g, ha)
        .getRegex()),
      (Ma = U(/\\(punct)/, `gu`)
        .replace(/punct/g, ha)
        .getRegex()),
      (Na = U(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/)
        .replace(`scheme`, /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/)
        .replace(
          `email`,
          /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/,
        )
        .getRegex()),
      (Pa = U(ia).replace(`(?:-->|$)`, `-->`).getRegex()),
      (Fa = U(
        `^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>`,
      )
        .replace(`comment`, Pa)
        .replace(
          `attribute`,
          /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/,
        )
        .getRegex()),
      (Ia = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/),
      (La = U(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/)
        .replace(`label`, Ia)
        .replace(`href`, /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/)
        .replace(`title`, /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/)
        .getRegex()),
      (Ra = U(/^!?\[(label)\]\[(ref)\]/)
        .replace(`label`, Ia)
        .replace(`ref`, ea)
        .getRegex()),
      (za = U(/^!?\[(ref)\](?:\[\])?/)
        .replace(`ref`, ea)
        .getRegex()),
      (Ba = U(`reflink|nolink(?!\\()`, `g`)
        .replace(`reflink`, Ra)
        .replace(`nolink`, za)
        .getRegex()),
      (Va = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/),
      (Ha = {
        _backpedal: J,
        anyPunctuation: Ma,
        autolink: Na,
        blockSkip: Sa,
        br: pa,
        code: fa,
        del: J,
        delLDelim: J,
        delRDelim: J,
        emStrongLDelim: wa,
        emStrongRDelimAst: Da,
        emStrongRDelimUnd: ka,
        escape: da,
        link: La,
        nolink: za,
        punctuation: va,
        reflink: Ra,
        reflinkSearch: Ba,
        tag: Fa,
        text: ma,
        url: J,
      }),
      (Ua = {
        ...Ha,
        link: U(/^!?\[(label)\]\((.*?)\)/)
          .replace(`label`, Ia)
          .getRegex(),
        reflink: U(/^!?\[(label)\]\s*\[([^\]]*)\]/)
          .replace(`label`, Ia)
          .getRegex(),
      }),
      (Wa = {
        ...Ha,
        emStrongRDelimAst: Oa,
        emStrongLDelim: Ta,
        delLDelim: Aa,
        delRDelim: ja,
        url: U(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/)
          .replace(`protocol`, Va)
          .replace(
            `email`,
            /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
          )
          .getRegex(),
        _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
        del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,
        text: U(
          /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/,
        )
          .replace(`protocol`, Va)
          .getRegex(),
      }),
      (Ga = {
        ...Wa,
        br: U(pa).replace(`{2,}`, `*`).getRegex(),
        text: U(Wa.text)
          .replace(`\\b_`, `\\b_| {2,}\\n`)
          .replace(/\{2,\}/g, `*`)
          .getRegex(),
      }),
      (Ka = { normal: sa, gfm: la, pedantic: ua }),
      (qa = { normal: Ha, gfm: Wa, breaks: Ga, pedantic: Ua }),
      (Ja = { "&": `&amp;`, "<": `&lt;`, ">": `&gt;`, '"': `&quot;`, "'": `&#39;` }),
      (Ya = (e) => Ja[e]),
      (Xa = class {
        options;
        rules;
        lexer;
        constructor(e) {
          this.options = e || q;
        }
        space(e) {
          let t = this.rules.block.newline.exec(e);
          if (t && t[0].length > 0) return { type: `space`, raw: t[0] };
        }
        code(e) {
          let t = this.rules.block.code.exec(e);
          if (t) {
            let e = this.options.pedantic ? t[0] : Li(t[0]);
            return {
              type: `code`,
              raw: e,
              codeBlockStyle: `indented`,
              text: e.replace(this.rules.other.codeRemoveIndent, ``),
            };
          }
        }
        fences(e) {
          let t = this.rules.block.fences.exec(e);
          if (t) {
            let e = t[0],
              n = Vi(e, t[3] || ``, this.rules);
            return {
              type: `code`,
              raw: e,
              lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, `$1`) : t[2],
              text: n,
            };
          }
        }
        heading(e) {
          let t = this.rules.block.heading.exec(e);
          if (t) {
            let e = t[2].trim();
            if (this.rules.other.endingHash.test(e)) {
              let t = G(e, `#`);
              (this.options.pedantic || !t || this.rules.other.endingSpaceChar.test(t)) &&
                (e = t.trim());
            }
            return {
              type: `heading`,
              raw: G(
                t[0],
                `
`,
              ),
              depth: t[1].length,
              text: e,
              tokens: this.lexer.inline(e),
            };
          }
        }
        hr(e) {
          let t = this.rules.block.hr.exec(e);
          if (t)
            return {
              type: `hr`,
              raw: G(
                t[0],
                `
`,
              ),
            };
        }
        blockquote(e) {
          let t = this.rules.block.blockquote.exec(e);
          if (t) {
            let e = G(
                t[0],
                `
`,
              ).split(`
`),
              n = ``,
              r = ``,
              i = [];
            for (; e.length > 0;) {
              let t = !1,
                a = [],
                o;
              for (o = 0; o < e.length; o++)
                if (this.rules.other.blockquoteStart.test(e[o])) (a.push(e[o]), (t = !0));
                else if (!t) a.push(e[o]);
                else break;
              e = e.slice(o);
              let s = a.join(`
`),
                c = s
                  .replace(
                    this.rules.other.blockquoteSetextReplace,
                    `
    $1`,
                  )
                  .replace(this.rules.other.blockquoteSetextReplace2, ``);
              ((n = n
                ? `${n}
${s}`
                : s),
                (r = r
                  ? `${r}
${c}`
                  : c));
              let l = this.lexer.state.top;
              if (
                ((this.lexer.state.top = !0),
                this.lexer.blockTokens(c, i, !0),
                (this.lexer.state.top = l),
                e.length === 0)
              )
                break;
              let u = i.at(-1);
              if (u?.type === `code`) break;
              if (u?.type === `blockquote`) {
                let t = u,
                  a =
                    t.raw +
                    `
` +
                    e.join(`
`),
                  o = this.blockquote(a);
                ((i[i.length - 1] = o),
                  (n = n.substring(0, n.length - t.raw.length) + o.raw),
                  (r = r.substring(0, r.length - t.text.length) + o.text));
                break;
              } else if (u?.type === `list`) {
                let t = u,
                  a =
                    t.raw +
                    `
` +
                    e.join(`
`),
                  o = this.list(a);
                ((i[i.length - 1] = o),
                  (n = n.substring(0, n.length - u.raw.length) + o.raw),
                  (r = r.substring(0, r.length - t.raw.length) + o.raw),
                  (e = a.substring(i.at(-1).raw.length).split(`
`)));
                continue;
              }
            }
            return { type: `blockquote`, raw: n, tokens: i, text: r };
          }
        }
        list(e) {
          let t = this.rules.block.list.exec(e);
          if (t) {
            let n = t[1].trim(),
              r = n.length > 1,
              i = {
                type: `list`,
                raw: ``,
                ordered: r,
                start: r ? +n.slice(0, -1) : ``,
                loose: !1,
                items: [],
              };
            ((n = r ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`),
              this.options.pedantic && (n = r ? n : `[*+-]`));
            let a = this.rules.other.listItemRegex(n),
              o = !1;
            for (; e;) {
              let n = !1,
                r = ``,
                s = ``;
              if (!(t = a.exec(e)) || this.rules.block.hr.test(e)) break;
              ((r = t[0]), (e = e.substring(r.length)));
              let c = zi(
                  t[2].split(
                    `
`,
                    1,
                  )[0],
                  t[1].length,
                ),
                l = e.split(
                  `
`,
                  1,
                )[0],
                u = !c.trim(),
                d = 0;
              if (
                (this.options.pedantic
                  ? ((d = 2), (s = c.trimStart()))
                  : u
                    ? (d = t[1].length + 1)
                    : ((d = c.search(this.rules.other.nonSpaceChar)),
                      (d = d > 4 ? 1 : d),
                      (s = c.slice(d)),
                      (d += t[1].length)),
                u &&
                  this.rules.other.blankLine.test(l) &&
                  ((r +=
                    l +
                    `
`),
                  (e = e.substring(l.length + 1)),
                  (n = !0)),
                !n)
              ) {
                let t = this.rules.other.nextBulletRegex(d),
                  n = this.rules.other.hrRegex(d),
                  i = this.rules.other.fencesBeginRegex(d),
                  a = this.rules.other.headingBeginRegex(d),
                  o = this.rules.other.htmlBeginRegex(d),
                  f = this.rules.other.blockquoteBeginRegex(d);
                for (; e;) {
                  let p = e.split(
                      `
`,
                      1,
                    )[0],
                    m;
                  if (
                    ((l = p),
                    this.options.pedantic
                      ? ((l = l.replace(this.rules.other.listReplaceNesting, `  `)), (m = l))
                      : (m = l.replace(this.rules.other.tabCharGlobal, `    `)),
                    i.test(l) || a.test(l) || o.test(l) || f.test(l) || t.test(l) || n.test(l))
                  )
                    break;
                  if (m.search(this.rules.other.nonSpaceChar) >= d || !l.trim())
                    s +=
                      `
` + m.slice(d);
                  else {
                    if (
                      u ||
                      c
                        .replace(this.rules.other.tabCharGlobal, `    `)
                        .search(this.rules.other.nonSpaceChar) >= 4 ||
                      i.test(c) ||
                      a.test(c) ||
                      n.test(c)
                    )
                      break;
                    s +=
                      `
` + l;
                  }
                  ((u = !l.trim()),
                    (r +=
                      p +
                      `
`),
                    (e = e.substring(p.length + 1)),
                    (c = m.slice(d)));
                }
              }
              (i.loose ||
                (o ? (i.loose = !0) : this.rules.other.doubleBlankLine.test(r) && (o = !0)),
                i.items.push({
                  type: `list_item`,
                  raw: r,
                  task: !!this.options.gfm && this.rules.other.listIsTask.test(s),
                  loose: !1,
                  text: s,
                  tokens: [],
                }),
                (i.raw += r));
            }
            let s = i.items.at(-1);
            if (s) ((s.raw = s.raw.trimEnd()), (s.text = s.text.trimEnd()));
            else return;
            i.raw = i.raw.trimEnd();
            for (let e of i.items) {
              ((this.lexer.state.top = !1), (e.tokens = this.lexer.blockTokens(e.text, [])));
              let t = e.tokens[0];
              if (e.task && (t?.type === `text` || t?.type === `paragraph`)) {
                ((e.text = e.text.replace(this.rules.other.listReplaceTask, ``)),
                  (t.raw = t.raw.replace(this.rules.other.listReplaceTask, ``)),
                  (t.text = t.text.replace(this.rules.other.listReplaceTask, ``)));
                for (let e = this.lexer.inlineQueue.length - 1; e >= 0; e--)
                  if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[e].src)) {
                    this.lexer.inlineQueue[e].src = this.lexer.inlineQueue[e].src.replace(
                      this.rules.other.listReplaceTask,
                      ``,
                    );
                    break;
                  }
                let n = this.rules.other.listTaskCheckbox.exec(e.raw);
                if (n) {
                  let t = { type: `checkbox`, raw: n[0] + ` `, checked: n[0] !== `[ ]` };
                  ((e.checked = t.checked),
                    i.loose
                      ? e.tokens[0] &&
                        [`paragraph`, `text`].includes(e.tokens[0].type) &&
                        `tokens` in e.tokens[0] &&
                        e.tokens[0].tokens
                        ? ((e.tokens[0].raw = t.raw + e.tokens[0].raw),
                          (e.tokens[0].text = t.raw + e.tokens[0].text),
                          e.tokens[0].tokens.unshift(t))
                        : e.tokens.unshift({
                            type: `paragraph`,
                            raw: t.raw,
                            text: t.raw,
                            tokens: [t],
                          })
                      : e.tokens.unshift(t));
                }
              } else e.task &&= !1;
              if (!i.loose) {
                let t = e.tokens.filter((e) => e.type === `space`);
                i.loose = t.length > 0 && t.some((e) => this.rules.other.anyLine.test(e.raw));
              }
            }
            if (i.loose)
              for (let e of i.items) {
                e.loose = !0;
                for (let t of e.tokens) t.type === `text` && (t.type = `paragraph`);
              }
            return i;
          }
        }
        html(e) {
          let t = this.rules.block.html.exec(e);
          if (t) {
            let e = Li(t[0]);
            return {
              type: `html`,
              block: !0,
              raw: e,
              pre: t[1] === `pre` || t[1] === `script` || t[1] === `style`,
              text: e,
            };
          }
        }
        def(e) {
          let t = this.rules.block.def.exec(e);
          if (t) {
            let e = t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, ` `),
              n = t[2]
                ? t[2]
                    .replace(this.rules.other.hrefBrackets, `$1`)
                    .replace(this.rules.inline.anyPunctuation, `$1`)
                : ``,
              r = t[3]
                ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, `$1`)
                : t[3];
            return {
              type: `def`,
              tag: e,
              raw: G(
                t[0],
                `
`,
              ),
              href: n,
              title: r,
            };
          }
        }
        table(e) {
          let t = this.rules.block.table.exec(e);
          if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
          let n = Ii(t[1]),
            r = t[2].replace(this.rules.other.tableAlignChars, ``).split(`|`),
            i = t[3]?.trim()
              ? t[3].replace(this.rules.other.tableRowBlankLine, ``).split(`
`)
              : [],
            a = {
              type: `table`,
              raw: G(
                t[0],
                `
`,
              ),
              header: [],
              align: [],
              rows: [],
            };
          if (n.length === r.length) {
            for (let e of r)
              this.rules.other.tableAlignRight.test(e)
                ? a.align.push(`right`)
                : this.rules.other.tableAlignCenter.test(e)
                  ? a.align.push(`center`)
                  : this.rules.other.tableAlignLeft.test(e)
                    ? a.align.push(`left`)
                    : a.align.push(null);
            for (let e = 0; e < n.length; e++)
              a.header.push({
                text: n[e],
                tokens: this.lexer.inline(n[e]),
                header: !0,
                align: a.align[e],
              });
            for (let e of i)
              a.rows.push(
                Ii(e, a.header.length).map((e, t) => ({
                  text: e,
                  tokens: this.lexer.inline(e),
                  header: !1,
                  align: a.align[t],
                })),
              );
            return a;
          }
        }
        lheading(e) {
          let t = this.rules.block.lheading.exec(e);
          if (t) {
            let e = t[1].trim();
            return {
              type: `heading`,
              raw: G(
                t[0],
                `
`,
              ),
              depth: t[2].charAt(0) === `=` ? 1 : 2,
              text: e,
              tokens: this.lexer.inline(e),
            };
          }
        }
        paragraph(e) {
          let t = this.rules.block.paragraph.exec(e);
          if (t) {
            let e =
              t[1].charAt(t[1].length - 1) ===
              `
`
                ? t[1].slice(0, -1)
                : t[1];
            return { type: `paragraph`, raw: t[0], text: e, tokens: this.lexer.inline(e) };
          }
        }
        text(e) {
          let t = this.rules.block.text.exec(e);
          if (t) return { type: `text`, raw: t[0], text: t[0], tokens: this.lexer.inline(t[0]) };
        }
        escape(e) {
          let t = this.rules.inline.escape.exec(e);
          if (t) return { type: `escape`, raw: t[0], text: t[1] };
        }
        tag(e) {
          let t = this.rules.inline.tag.exec(e);
          if (t)
            return (
              !this.lexer.state.inLink && this.rules.other.startATag.test(t[0])
                ? (this.lexer.state.inLink = !0)
                : this.lexer.state.inLink &&
                  this.rules.other.endATag.test(t[0]) &&
                  (this.lexer.state.inLink = !1),
              !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0])
                ? (this.lexer.state.inRawBlock = !0)
                : this.lexer.state.inRawBlock &&
                  this.rules.other.endPreScriptTag.test(t[0]) &&
                  (this.lexer.state.inRawBlock = !1),
              {
                type: `html`,
                raw: t[0],
                inLink: this.lexer.state.inLink,
                inRawBlock: this.lexer.state.inRawBlock,
                block: !1,
                text: t[0],
              }
            );
        }
        link(e) {
          let t = this.rules.inline.link.exec(e);
          if (t) {
            let e = t[2].trim();
            if (!this.options.pedantic && this.rules.other.startAngleBracket.test(e)) {
              if (!this.rules.other.endAngleBracket.test(e)) return;
              let t = G(e.slice(0, -1), `\\`);
              if ((e.length - t.length) % 2 == 0) return;
            } else {
              let e = Ri(t[2], `()`);
              if (e === -2) return;
              if (e > -1) {
                let n = (t[0].indexOf(`!`) === 0 ? 5 : 4) + t[1].length + e;
                ((t[2] = t[2].substring(0, e)), (t[0] = t[0].substring(0, n).trim()), (t[3] = ``));
              }
            }
            let n = t[2],
              r = ``;
            if (this.options.pedantic) {
              let e = this.rules.other.pedanticHrefTitle.exec(n);
              e && ((n = e[1]), (r = e[3]));
            } else r = t[3] ? t[3].slice(1, -1) : ``;
            return (
              (n = n.trim()),
              this.rules.other.startAngleBracket.test(n) &&
                (n =
                  this.options.pedantic && !this.rules.other.endAngleBracket.test(e)
                    ? n.slice(1)
                    : n.slice(1, -1)),
              Bi(
                t,
                {
                  href: n && n.replace(this.rules.inline.anyPunctuation, `$1`),
                  title: r && r.replace(this.rules.inline.anyPunctuation, `$1`),
                },
                t[0],
                this.lexer,
                this.rules,
              )
            );
          }
        }
        reflink(e, t) {
          let n;
          if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
            let e =
              t[(n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, ` `).toLowerCase()];
            if (!e) {
              let e = n[0].charAt(0);
              return { type: `text`, raw: e, text: e };
            }
            return Bi(n, e, n[0], this.lexer, this.rules);
          }
        }
        emStrong(e, t, n = ``) {
          let r = this.rules.inline.emStrongLDelim.exec(e);
          if (
            !(
              !r ||
              (!r[1] && !r[2] && !r[3] && !r[4]) ||
              (r[4] && n.match(this.rules.other.unicodeAlphaNumeric))
            ) &&
            (!(r[1] || r[3]) || !n || this.rules.inline.punctuation.exec(n))
          ) {
            let n = [...r[0]].length - 1,
              i,
              a,
              o = n,
              s = 0,
              c =
                r[0][0] === `*`
                  ? this.rules.inline.emStrongRDelimAst
                  : this.rules.inline.emStrongRDelimUnd;
            for (c.lastIndex = 0, t = t.slice(-1 * e.length + n); (r = c.exec(t)) !== null;) {
              if (((i = r[1] || r[2] || r[3] || r[4] || r[5] || r[6]), !i)) continue;
              if (((a = [...i].length), r[3] || r[4])) {
                o += a;
                continue;
              } else if ((r[5] || r[6]) && n % 3 && !((n + a) % 3)) {
                s += a;
                continue;
              }
              if (((o -= a), o > 0)) continue;
              a = Math.min(a, a + o + s);
              let t = [...r[0]][0].length,
                c = e.slice(0, n + r.index + t + a);
              if (Math.min(n, a) % 2) {
                let e = c.slice(1, -1);
                return { type: `em`, raw: c, text: e, tokens: this.lexer.inlineTokens(e) };
              }
              let l = c.slice(2, -2);
              return { type: `strong`, raw: c, text: l, tokens: this.lexer.inlineTokens(l) };
            }
          }
        }
        codespan(e) {
          let t = this.rules.inline.code.exec(e);
          if (t) {
            let e = t[2].replace(this.rules.other.newLineCharGlobal, ` `),
              n = this.rules.other.nonSpaceChar.test(e),
              r =
                this.rules.other.startingSpaceChar.test(e) &&
                this.rules.other.endingSpaceChar.test(e);
            return (
              n && r && (e = e.substring(1, e.length - 1)), { type: `codespan`, raw: t[0], text: e }
            );
          }
        }
        br(e) {
          let t = this.rules.inline.br.exec(e);
          if (t) return { type: `br`, raw: t[0] };
        }
        del(e, t, n = ``) {
          let r = this.rules.inline.delLDelim.exec(e);
          if (r && (!r[1] || !n || this.rules.inline.punctuation.exec(n))) {
            let n = [...r[0]].length - 1,
              i,
              a,
              o = n,
              s = this.rules.inline.delRDelim;
            for (s.lastIndex = 0, t = t.slice(-1 * e.length + n); (r = s.exec(t)) !== null;) {
              if (
                ((i = r[1] || r[2] || r[3] || r[4] || r[5] || r[6]),
                !i || ((a = [...i].length), a !== n))
              )
                continue;
              if (r[3] || r[4]) {
                o += a;
                continue;
              }
              if (((o -= a), o > 0)) continue;
              a = Math.min(a, a + o);
              let t = [...r[0]][0].length,
                s = e.slice(0, n + r.index + t + a),
                c = s.slice(n, -n);
              return { type: `del`, raw: s, text: c, tokens: this.lexer.inlineTokens(c) };
            }
          }
        }
        autolink(e) {
          let t = this.rules.inline.autolink.exec(e);
          if (t) {
            let e, n;
            return (
              t[2] === `@` ? ((e = t[1]), (n = `mailto:` + e)) : ((e = t[1]), (n = e)),
              {
                type: `link`,
                raw: t[0],
                text: e,
                href: n,
                tokens: [{ type: `text`, raw: e, text: e }],
              }
            );
          }
        }
        url(e) {
          let t;
          if ((t = this.rules.inline.url.exec(e))) {
            let e, n;
            if (t[2] === `@`) ((e = t[0]), (n = `mailto:` + e));
            else {
              let r;
              do ((r = t[0]), (t[0] = this.rules.inline._backpedal.exec(t[0])?.[0] ?? ``));
              while (r !== t[0]);
              ((e = t[0]), (n = t[1] === `www.` ? `http://` + t[0] : t[0]));
            }
            return {
              type: `link`,
              raw: t[0],
              text: e,
              href: n,
              tokens: [{ type: `text`, raw: e, text: e }],
            };
          }
        }
        inlineText(e) {
          let t = this.rules.inline.text.exec(e);
          if (t) {
            let e = this.lexer.state.inRawBlock;
            return { type: `text`, raw: t[0], text: t[0], escaped: e };
          }
        }
      }),
      (X = class e {
        tokens;
        options;
        state;
        inlineQueue;
        tokenizer;
        constructor(e) {
          ((this.tokens = []),
            (this.tokens.links = Object.create(null)),
            (this.options = e || q),
            (this.options.tokenizer = this.options.tokenizer || new Xa()),
            (this.tokenizer = this.options.tokenizer),
            (this.tokenizer.options = this.options),
            (this.tokenizer.lexer = this),
            (this.inlineQueue = []),
            (this.state = { inLink: !1, inRawBlock: !1, top: !0 }));
          let t = { other: Y, block: Ka.normal, inline: qa.normal };
          (this.options.pedantic
            ? ((t.block = Ka.pedantic), (t.inline = qa.pedantic))
            : this.options.gfm &&
              ((t.block = Ka.gfm),
              this.options.breaks ? (t.inline = qa.breaks) : (t.inline = qa.gfm)),
            (this.tokenizer.rules = t));
        }
        static get rules() {
          return { block: Ka, inline: qa };
        }
        static lex(t, n) {
          return new e(n).lex(t);
        }
        static lexInline(t, n) {
          return new e(n).inlineTokens(t);
        }
        lex(e) {
          ((e = e.replace(
            Y.carriageReturn,
            `
`,
          )),
            this.blockTokens(e, this.tokens));
          for (let e = 0; e < this.inlineQueue.length; e++) {
            let t = this.inlineQueue[e];
            this.inlineTokens(t.src, t.tokens);
          }
          return ((this.inlineQueue = []), this.tokens);
        }
        blockTokens(e, t = [], n = !1) {
          ((this.tokenizer.lexer = this),
            this.options.pedantic &&
              (e = e.replace(Y.tabCharGlobal, `    `).replace(Y.spaceLine, ``)));
          let r = 1 / 0;
          for (; e;) {
            if (e.length < r) r = e.length;
            else {
              this.infiniteLoopError(e.charCodeAt(0));
              break;
            }
            let i;
            if (
              this.options.extensions?.block?.some((n) =>
                (i = n.call({ lexer: this }, e, t))
                  ? ((e = e.substring(i.raw.length)), t.push(i), !0)
                  : !1,
              )
            )
              continue;
            if ((i = this.tokenizer.space(e))) {
              e = e.substring(i.raw.length);
              let n = t.at(-1);
              i.raw.length === 1 && n !== void 0
                ? (n.raw += `
`)
                : t.push(i);
              continue;
            }
            if ((i = this.tokenizer.code(e))) {
              e = e.substring(i.raw.length);
              let n = t.at(-1);
              n?.type === `paragraph` || n?.type === `text`
                ? ((n.raw +=
                    (n.raw.endsWith(`
`)
                      ? ``
                      : `
`) + i.raw),
                  (n.text +=
                    `
` + i.text),
                  (this.inlineQueue.at(-1).src = n.text))
                : t.push(i);
              continue;
            }
            if ((i = this.tokenizer.fences(e))) {
              ((e = e.substring(i.raw.length)), t.push(i));
              continue;
            }
            if ((i = this.tokenizer.heading(e))) {
              ((e = e.substring(i.raw.length)), t.push(i));
              continue;
            }
            if ((i = this.tokenizer.hr(e))) {
              ((e = e.substring(i.raw.length)), t.push(i));
              continue;
            }
            if ((i = this.tokenizer.blockquote(e))) {
              ((e = e.substring(i.raw.length)), t.push(i));
              continue;
            }
            if ((i = this.tokenizer.list(e))) {
              ((e = e.substring(i.raw.length)), t.push(i));
              continue;
            }
            if ((i = this.tokenizer.html(e))) {
              ((e = e.substring(i.raw.length)), t.push(i));
              continue;
            }
            if ((i = this.tokenizer.def(e))) {
              e = e.substring(i.raw.length);
              let n = t.at(-1);
              n?.type === `paragraph` || n?.type === `text`
                ? ((n.raw +=
                    (n.raw.endsWith(`
`)
                      ? ``
                      : `
`) + i.raw),
                  (n.text +=
                    `
` + i.raw),
                  (this.inlineQueue.at(-1).src = n.text))
                : this.tokens.links[i.tag] ||
                  ((this.tokens.links[i.tag] = { href: i.href, title: i.title }), t.push(i));
              continue;
            }
            if ((i = this.tokenizer.table(e))) {
              ((e = e.substring(i.raw.length)), t.push(i));
              continue;
            }
            if ((i = this.tokenizer.lheading(e))) {
              ((e = e.substring(i.raw.length)), t.push(i));
              continue;
            }
            let a = e;
            if (this.options.extensions?.startBlock) {
              let t = 1 / 0,
                n = e.slice(1),
                r;
              (this.options.extensions.startBlock.forEach((e) => {
                ((r = e.call({ lexer: this }, n)),
                  typeof r == `number` && r >= 0 && (t = Math.min(t, r)));
              }),
                t < 1 / 0 && t >= 0 && (a = e.substring(0, t + 1)));
            }
            if (this.state.top && (i = this.tokenizer.paragraph(a))) {
              let r = t.at(-1);
              (n && r?.type === `paragraph`
                ? ((r.raw +=
                    (r.raw.endsWith(`
`)
                      ? ``
                      : `
`) + i.raw),
                  (r.text +=
                    `
` + i.text),
                  this.inlineQueue.pop(),
                  (this.inlineQueue.at(-1).src = r.text))
                : t.push(i),
                (n = a.length !== e.length),
                (e = e.substring(i.raw.length)));
              continue;
            }
            if ((i = this.tokenizer.text(e))) {
              e = e.substring(i.raw.length);
              let n = t.at(-1);
              n?.type === `text`
                ? ((n.raw +=
                    (n.raw.endsWith(`
`)
                      ? ``
                      : `
`) + i.raw),
                  (n.text +=
                    `
` + i.text),
                  this.inlineQueue.pop(),
                  (this.inlineQueue.at(-1).src = n.text))
                : t.push(i);
              continue;
            }
            if (e) {
              this.infiniteLoopError(e.charCodeAt(0));
              break;
            }
          }
          return ((this.state.top = !0), t);
        }
        inline(e, t = []) {
          return (this.inlineQueue.push({ src: e, tokens: t }), t);
        }
        inlineTokens(e, t = []) {
          this.tokenizer.lexer = this;
          let n = e,
            r = null;
          if (this.tokens.links) {
            let e = Object.keys(this.tokens.links);
            if (e.length > 0)
              for (; (r = this.tokenizer.rules.inline.reflinkSearch.exec(n)) !== null;)
                e.includes(r[0].slice(r[0].lastIndexOf(`[`) + 1, -1)) &&
                  (n =
                    n.slice(0, r.index) +
                    `[` +
                    `a`.repeat(r[0].length - 2) +
                    `]` +
                    n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
          }
          for (; (r = this.tokenizer.rules.inline.anyPunctuation.exec(n)) !== null;)
            n =
              n.slice(0, r.index) +
              `++` +
              n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
          let i;
          for (; (r = this.tokenizer.rules.inline.blockSkip.exec(n)) !== null;)
            ((i = r[2] ? r[2].length : 0),
              (n =
                n.slice(0, r.index + i) +
                `[` +
                `a`.repeat(r[0].length - i - 2) +
                `]` +
                n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex)));
          n = this.options.hooks?.emStrongMask?.call({ lexer: this }, n) ?? n;
          let a = !1,
            o = ``,
            s = 1 / 0;
          for (; e;) {
            if (e.length < s) s = e.length;
            else {
              this.infiniteLoopError(e.charCodeAt(0));
              break;
            }
            (a || (o = ``), (a = !1));
            let r;
            if (
              this.options.extensions?.inline?.some((n) =>
                (r = n.call({ lexer: this }, e, t))
                  ? ((e = e.substring(r.raw.length)), t.push(r), !0)
                  : !1,
              )
            )
              continue;
            if ((r = this.tokenizer.escape(e))) {
              ((e = e.substring(r.raw.length)), t.push(r));
              continue;
            }
            if ((r = this.tokenizer.tag(e))) {
              ((e = e.substring(r.raw.length)), t.push(r));
              continue;
            }
            if ((r = this.tokenizer.link(e))) {
              ((e = e.substring(r.raw.length)), t.push(r));
              continue;
            }
            if ((r = this.tokenizer.reflink(e, this.tokens.links))) {
              e = e.substring(r.raw.length);
              let n = t.at(-1);
              r.type === `text` && n?.type === `text`
                ? ((n.raw += r.raw), (n.text += r.text))
                : t.push(r);
              continue;
            }
            if ((r = this.tokenizer.emStrong(e, n, o))) {
              ((e = e.substring(r.raw.length)), t.push(r));
              continue;
            }
            if ((r = this.tokenizer.codespan(e))) {
              ((e = e.substring(r.raw.length)), t.push(r));
              continue;
            }
            if ((r = this.tokenizer.br(e))) {
              ((e = e.substring(r.raw.length)), t.push(r));
              continue;
            }
            if ((r = this.tokenizer.del(e, n, o))) {
              ((e = e.substring(r.raw.length)), t.push(r));
              continue;
            }
            if ((r = this.tokenizer.autolink(e))) {
              ((e = e.substring(r.raw.length)), t.push(r));
              continue;
            }
            if (!this.state.inLink && (r = this.tokenizer.url(e))) {
              ((e = e.substring(r.raw.length)), t.push(r));
              continue;
            }
            let i = e;
            if (this.options.extensions?.startInline) {
              let t = 1 / 0,
                n = e.slice(1),
                r;
              (this.options.extensions.startInline.forEach((e) => {
                ((r = e.call({ lexer: this }, n)),
                  typeof r == `number` && r >= 0 && (t = Math.min(t, r)));
              }),
                t < 1 / 0 && t >= 0 && (i = e.substring(0, t + 1)));
            }
            if ((r = this.tokenizer.inlineText(i))) {
              ((e = e.substring(r.raw.length)),
                r.raw.slice(-1) !== `_` && (o = r.raw.slice(-1)),
                (a = !0));
              let n = t.at(-1);
              n?.type === `text` ? ((n.raw += r.raw), (n.text += r.text)) : t.push(r);
              continue;
            }
            if (e) {
              this.infiniteLoopError(e.charCodeAt(0));
              break;
            }
          }
          return t;
        }
        infiniteLoopError(e) {
          let t = `Infinite loop on byte: ` + e;
          if (this.options.silent) console.error(t);
          else throw Error(t);
        }
      }),
      (Za = class {
        options;
        parser;
        constructor(e) {
          this.options = e || q;
        }
        space(e) {
          return ``;
        }
        code({ text: e, lang: t, escaped: n }) {
          let r = (t || ``).match(Y.notSpaceStart)?.[0],
            i =
              e.replace(Y.endingNewline, ``) +
              `
`;
          return r
            ? `<pre><code class="language-` +
                W(r) +
                `">` +
                (n ? i : W(i, !0)) +
                `</code></pre>
`
            : `<pre><code>` +
                (n ? i : W(i, !0)) +
                `</code></pre>
`;
        }
        blockquote({ tokens: e }) {
          return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
        }
        html({ text: e }) {
          return e;
        }
        def(e) {
          return ``;
        }
        heading({ tokens: e, depth: t }) {
          return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
        }
        hr(e) {
          return `<hr>
`;
        }
        list(e) {
          let t = e.ordered,
            n = e.start,
            r = ``;
          for (let t = 0; t < e.items.length; t++) {
            let n = e.items[t];
            r += this.listitem(n);
          }
          let i = t ? `ol` : `ul`,
            a = t && n !== 1 ? ` start="` + n + `"` : ``;
          return (
            `<` +
            i +
            a +
            `>
` +
            r +
            `</` +
            i +
            `>
`
          );
        }
        listitem(e) {
          return `<li>${this.parser.parse(e.tokens)}</li>
`;
        }
        checkbox({ checked: e }) {
          return `<input ` + (e ? `checked="" ` : ``) + `disabled="" type="checkbox"> `;
        }
        paragraph({ tokens: e }) {
          return `<p>${this.parser.parseInline(e)}</p>
`;
        }
        table(e) {
          let t = ``,
            n = ``;
          for (let t = 0; t < e.header.length; t++) n += this.tablecell(e.header[t]);
          t += this.tablerow({ text: n });
          let r = ``;
          for (let t = 0; t < e.rows.length; t++) {
            let i = e.rows[t];
            n = ``;
            for (let e = 0; e < i.length; e++) n += this.tablecell(i[e]);
            r += this.tablerow({ text: n });
          }
          return (
            (r &&= `<tbody>${r}</tbody>`),
            `<table>
<thead>
` +
              t +
              `</thead>
` +
              r +
              `</table>
`
          );
        }
        tablerow({ text: e }) {
          return `<tr>
${e}</tr>
`;
        }
        tablecell(e) {
          let t = this.parser.parseInline(e.tokens),
            n = e.header ? `th` : `td`;
          return (
            (e.align ? `<${n} align="${e.align}">` : `<${n}>`) +
            t +
            `</${n}>
`
          );
        }
        strong({ tokens: e }) {
          return `<strong>${this.parser.parseInline(e)}</strong>`;
        }
        em({ tokens: e }) {
          return `<em>${this.parser.parseInline(e)}</em>`;
        }
        codespan({ text: e }) {
          return `<code>${W(e, !0)}</code>`;
        }
        br(e) {
          return `<br>`;
        }
        del({ tokens: e }) {
          return `<del>${this.parser.parseInline(e)}</del>`;
        }
        link({ href: e, title: t, tokens: n }) {
          let r = this.parser.parseInline(n),
            i = Fi(e);
          if (i === null) return r;
          e = i;
          let a = `<a href="` + e + `"`;
          return (t && (a += ` title="` + W(t) + `"`), (a += `>` + r + `</a>`), a);
        }
        image({ href: e, title: t, text: n, tokens: r }) {
          r && (n = this.parser.parseInline(r, this.parser.textRenderer));
          let i = Fi(e);
          if (i === null) return W(n);
          e = i;
          let a = `<img src="${e}" alt="${W(n)}"`;
          return (t && (a += ` title="${W(t)}"`), (a += `>`), a);
        }
        text(e) {
          return `tokens` in e && e.tokens
            ? this.parser.parseInline(e.tokens)
            : `escaped` in e && e.escaped
              ? e.text
              : W(e.text);
        }
      }),
      (Qa = class {
        strong({ text: e }) {
          return e;
        }
        em({ text: e }) {
          return e;
        }
        codespan({ text: e }) {
          return e;
        }
        del({ text: e }) {
          return e;
        }
        html({ text: e }) {
          return e;
        }
        text({ text: e }) {
          return e;
        }
        link({ text: e }) {
          return `` + e;
        }
        image({ text: e }) {
          return `` + e;
        }
        br() {
          return ``;
        }
        checkbox({ raw: e }) {
          return e;
        }
      }),
      (Z = class e {
        options;
        renderer;
        textRenderer;
        constructor(e) {
          ((this.options = e || q),
            (this.options.renderer = this.options.renderer || new Za()),
            (this.renderer = this.options.renderer),
            (this.renderer.options = this.options),
            (this.renderer.parser = this),
            (this.textRenderer = new Qa()));
        }
        static parse(t, n) {
          return new e(n).parse(t);
        }
        static parseInline(t, n) {
          return new e(n).parseInline(t);
        }
        parse(e) {
          this.renderer.parser = this;
          let t = ``;
          for (let n = 0; n < e.length; n++) {
            let r = e[n];
            if (this.options.extensions?.renderers?.[r.type]) {
              let e = r,
                n = this.options.extensions.renderers[e.type].call({ parser: this }, e);
              if (
                n !== !1 ||
                ![
                  `space`,
                  `hr`,
                  `heading`,
                  `code`,
                  `table`,
                  `blockquote`,
                  `list`,
                  `html`,
                  `def`,
                  `paragraph`,
                  `text`,
                ].includes(e.type)
              ) {
                t += n || ``;
                continue;
              }
            }
            let i = r;
            switch (i.type) {
              case `space`:
                t += this.renderer.space(i);
                break;
              case `hr`:
                t += this.renderer.hr(i);
                break;
              case `heading`:
                t += this.renderer.heading(i);
                break;
              case `code`:
                t += this.renderer.code(i);
                break;
              case `table`:
                t += this.renderer.table(i);
                break;
              case `blockquote`:
                t += this.renderer.blockquote(i);
                break;
              case `list`:
                t += this.renderer.list(i);
                break;
              case `checkbox`:
                t += this.renderer.checkbox(i);
                break;
              case `html`:
                t += this.renderer.html(i);
                break;
              case `def`:
                t += this.renderer.def(i);
                break;
              case `paragraph`:
                t += this.renderer.paragraph(i);
                break;
              case `text`:
                t += this.renderer.text(i);
                break;
              default: {
                let e = `Token with "` + i.type + `" type was not found.`;
                if (this.options.silent) return (console.error(e), ``);
                throw Error(e);
              }
            }
          }
          return t;
        }
        parseInline(e, t = this.renderer) {
          this.renderer.parser = this;
          let n = ``;
          for (let r = 0; r < e.length; r++) {
            let i = e[r];
            if (this.options.extensions?.renderers?.[i.type]) {
              let e = this.options.extensions.renderers[i.type].call({ parser: this }, i);
              if (
                e !== !1 ||
                ![
                  `escape`,
                  `html`,
                  `link`,
                  `image`,
                  `strong`,
                  `em`,
                  `codespan`,
                  `br`,
                  `del`,
                  `text`,
                ].includes(i.type)
              ) {
                n += e || ``;
                continue;
              }
            }
            let a = i;
            switch (a.type) {
              case `escape`:
                n += t.text(a);
                break;
              case `html`:
                n += t.html(a);
                break;
              case `link`:
                n += t.link(a);
                break;
              case `image`:
                n += t.image(a);
                break;
              case `checkbox`:
                n += t.checkbox(a);
                break;
              case `strong`:
                n += t.strong(a);
                break;
              case `em`:
                n += t.em(a);
                break;
              case `codespan`:
                n += t.codespan(a);
                break;
              case `br`:
                n += t.br(a);
                break;
              case `del`:
                n += t.del(a);
                break;
              case `text`:
                n += t.text(a);
                break;
              default: {
                let e = `Token with "` + a.type + `" type was not found.`;
                if (this.options.silent) return (console.error(e), ``);
                throw Error(e);
              }
            }
          }
          return n;
        }
      }),
      ($a = class {
        options;
        block;
        constructor(e) {
          this.options = e || q;
        }
        static passThroughHooks = new Set([
          `preprocess`,
          `postprocess`,
          `processAllTokens`,
          `emStrongMask`,
        ]);
        static passThroughHooksRespectAsync = new Set([
          `preprocess`,
          `postprocess`,
          `processAllTokens`,
        ]);
        preprocess(e) {
          return e;
        }
        postprocess(e) {
          return e;
        }
        processAllTokens(e) {
          return e;
        }
        emStrongMask(e) {
          return e;
        }
        provideLexer(e = this.block) {
          return e ? X.lex : X.lexInline;
        }
        provideParser(e = this.block) {
          return e ? Z.parse : Z.parseInline;
        }
      }),
      (eo = class {
        defaults = Mi();
        options = this.setOptions;
        parse = this.parseMarkdown(!0);
        parseInline = this.parseMarkdown(!1);
        Parser = Z;
        Renderer = Za;
        TextRenderer = Qa;
        Lexer = X;
        Tokenizer = Xa;
        Hooks = $a;
        constructor(...e) {
          this.use(...e);
        }
        walkTokens(e, t) {
          let n = [];
          for (let r of e)
            switch (((n = n.concat(t.call(this, r))), r.type)) {
              case `table`: {
                let e = r;
                for (let r of e.header) n = n.concat(this.walkTokens(r.tokens, t));
                for (let r of e.rows) for (let e of r) n = n.concat(this.walkTokens(e.tokens, t));
                break;
              }
              case `list`: {
                let e = r;
                n = n.concat(this.walkTokens(e.items, t));
                break;
              }
              default: {
                let e = r;
                this.defaults.extensions?.childTokens?.[e.type]
                  ? this.defaults.extensions.childTokens[e.type].forEach((r) => {
                      let i = e[r].flat(1 / 0);
                      n = n.concat(this.walkTokens(i, t));
                    })
                  : e.tokens && (n = n.concat(this.walkTokens(e.tokens, t)));
              }
            }
          return n;
        }
        use(...e) {
          let t = this.defaults.extensions || { renderers: {}, childTokens: {} };
          return (
            e.forEach((e) => {
              let n = { ...e };
              if (
                ((n.async = this.defaults.async || n.async || !1),
                e.extensions &&
                  (e.extensions.forEach((e) => {
                    if (!e.name) throw Error(`extension name required`);
                    if (`renderer` in e) {
                      let n = t.renderers[e.name];
                      n
                        ? (t.renderers[e.name] = function (...t) {
                            let r = e.renderer.apply(this, t);
                            return (r === !1 && (r = n.apply(this, t)), r);
                          })
                        : (t.renderers[e.name] = e.renderer);
                    }
                    if (`tokenizer` in e) {
                      if (!e.level || (e.level !== `block` && e.level !== `inline`))
                        throw Error(`extension level must be 'block' or 'inline'`);
                      let n = t[e.level];
                      (n ? n.unshift(e.tokenizer) : (t[e.level] = [e.tokenizer]),
                        e.start &&
                          (e.level === `block`
                            ? t.startBlock
                              ? t.startBlock.push(e.start)
                              : (t.startBlock = [e.start])
                            : e.level === `inline` &&
                              (t.startInline
                                ? t.startInline.push(e.start)
                                : (t.startInline = [e.start]))));
                    }
                    `childTokens` in e && e.childTokens && (t.childTokens[e.name] = e.childTokens);
                  }),
                  (n.extensions = t)),
                e.renderer)
              ) {
                let t = this.defaults.renderer || new Za(this.defaults);
                for (let n in e.renderer) {
                  if (!(n in t)) throw Error(`renderer '${n}' does not exist`);
                  if ([`options`, `parser`].includes(n)) continue;
                  let r = n,
                    i = e.renderer[r],
                    a = t[r];
                  t[r] = (...e) => {
                    let n = i.apply(t, e);
                    return (n === !1 && (n = a.apply(t, e)), n || ``);
                  };
                }
                n.renderer = t;
              }
              if (e.tokenizer) {
                let t = this.defaults.tokenizer || new Xa(this.defaults);
                for (let n in e.tokenizer) {
                  if (!(n in t)) throw Error(`tokenizer '${n}' does not exist`);
                  if ([`options`, `rules`, `lexer`].includes(n)) continue;
                  let r = n,
                    i = e.tokenizer[r],
                    a = t[r];
                  t[r] = (...e) => {
                    let n = i.apply(t, e);
                    return (n === !1 && (n = a.apply(t, e)), n);
                  };
                }
                n.tokenizer = t;
              }
              if (e.hooks) {
                let t = this.defaults.hooks || new $a();
                for (let n in e.hooks) {
                  if (!(n in t)) throw Error(`hook '${n}' does not exist`);
                  if ([`options`, `block`].includes(n)) continue;
                  let r = n,
                    i = e.hooks[r],
                    a = t[r];
                  $a.passThroughHooks.has(n)
                    ? (t[r] = (e) => {
                        if (this.defaults.async && $a.passThroughHooksRespectAsync.has(n))
                          return (async () => {
                            let n = await i.call(t, e);
                            return a.call(t, n);
                          })();
                        let r = i.call(t, e);
                        return a.call(t, r);
                      })
                    : (t[r] = (...e) => {
                        if (this.defaults.async)
                          return (async () => {
                            let n = await i.apply(t, e);
                            return (n === !1 && (n = await a.apply(t, e)), n);
                          })();
                        let n = i.apply(t, e);
                        return (n === !1 && (n = a.apply(t, e)), n);
                      });
                }
                n.hooks = t;
              }
              if (e.walkTokens) {
                let t = this.defaults.walkTokens,
                  r = e.walkTokens;
                n.walkTokens = function (e) {
                  let n = [];
                  return (n.push(r.call(this, e)), t && (n = n.concat(t.call(this, e))), n);
                };
              }
              this.defaults = { ...this.defaults, ...n };
            }),
            this
          );
        }
        setOptions(e) {
          return ((this.defaults = { ...this.defaults, ...e }), this);
        }
        lexer(e, t) {
          return X.lex(e, t ?? this.defaults);
        }
        parser(e, t) {
          return Z.parse(e, t ?? this.defaults);
        }
        parseMarkdown(e) {
          return (t, n) => {
            let r = { ...n },
              i = { ...this.defaults, ...r },
              a = this.onError(!!i.silent, !!i.async);
            if (this.defaults.async === !0 && r.async === !1)
              return a(
                Error(
                  `marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise.`,
                ),
              );
            if (typeof t > `u` || t === null)
              return a(Error(`marked(): input parameter is undefined or null`));
            if (typeof t != `string`)
              return a(
                Error(
                  `marked(): input parameter is of type ` +
                    Object.prototype.toString.call(t) +
                    `, string expected`,
                ),
              );
            if ((i.hooks && ((i.hooks.options = i), (i.hooks.block = e)), i.async))
              return (async () => {
                let n = i.hooks ? await i.hooks.preprocess(t) : t,
                  r = await (i.hooks ? await i.hooks.provideLexer(e) : e ? X.lex : X.lexInline)(
                    n,
                    i,
                  ),
                  a = i.hooks ? await i.hooks.processAllTokens(r) : r;
                i.walkTokens && (await Promise.all(this.walkTokens(a, i.walkTokens)));
                let o = await (
                  i.hooks ? await i.hooks.provideParser(e) : e ? Z.parse : Z.parseInline
                )(a, i);
                return i.hooks ? await i.hooks.postprocess(o) : o;
              })().catch(a);
            try {
              i.hooks && (t = i.hooks.preprocess(t));
              let n = (i.hooks ? i.hooks.provideLexer(e) : e ? X.lex : X.lexInline)(t, i);
              (i.hooks && (n = i.hooks.processAllTokens(n)),
                i.walkTokens && this.walkTokens(n, i.walkTokens));
              let r = (i.hooks ? i.hooks.provideParser(e) : e ? Z.parse : Z.parseInline)(n, i);
              return (i.hooks && (r = i.hooks.postprocess(r)), r);
            } catch (e) {
              return a(e);
            }
          };
        }
        onError(e, t) {
          return (n) => {
            if (
              ((n.message += `
Please report this to https://github.com/markedjs/marked.`),
              e)
            ) {
              let e = `<p>An error occurred:</p><pre>` + W(n.message + ``, !0) + `</pre>`;
              return t ? Promise.resolve(e) : e;
            }
            if (t) return Promise.reject(n);
            throw n;
          };
        }
      }),
      (Q = new eo()),
      (K.options = K.setOptions =
        function (e) {
          return (Q.setOptions(e), (K.defaults = Q.defaults), Ni(K.defaults), K);
        }),
      (K.getDefaults = Mi),
      (K.defaults = q),
      (K.use = function (...e) {
        return (Q.use(...e), (K.defaults = Q.defaults), Ni(K.defaults), K);
      }),
      (K.walkTokens = function (e, t) {
        return Q.walkTokens(e, t);
      }),
      (K.parseInline = Q.parseInline),
      (K.Parser = Z),
      (K.parser = Z.parse),
      (K.Renderer = Za),
      (K.TextRenderer = Qa),
      (K.Lexer = X),
      (K.lexer = X.lex),
      (K.Tokenizer = Xa),
      (K.Hooks = $a),
      (K.parse = K),
      K.options,
      K.setOptions,
      K.use,
      K.walkTokens,
      K.parseInline,
      Z.parse,
      X.lex);
  });
function no(e, t) {
  if (!(e instanceof HTMLElement)) return;
  let n = D(t ? `agents.files.collapsePreview` : `agents.files.expandPreview`);
  (e.classList.toggle(`is-fullscreen`, t),
    e.setAttribute(`aria-pressed`, String(t)),
    e.setAttribute(`aria-label`, n),
    e.setAttribute(`title`, n));
}
function ro(e) {
  (e.querySelector(`.md-preview-dialog__panel`)?.classList.remove(`fullscreen`),
    no(e.querySelector(`.md-preview-expand-btn`), !1),
    e.classList.remove(`fullscreen`));
}
var io = e(() => {
  O();
});
function ao(e) {
  let t = e.trim();
  return t ? t.split(/\s+/).length : 0;
}
function oo(e) {
  return e.length === 0 ? 0 : e.split(/\r?\n/).length;
}
function so(e) {
  return e <= 0
    ? D(`agents.files.emptyDraft`)
    : D(`agents.files.minRead`, { count: String(Math.max(1, Math.round(e / 220))) });
}
function co(e) {
  let t = e.split(`.`).pop()?.trim().toLowerCase();
  return t === `md` || t === `markdown`
    ? D(`agents.files.markdownPreview`)
    : t
      ? D(`agents.files.extensionPreview`, { ext: t.toUpperCase() })
      : D(`agents.files.preview`);
}
function lo(e, t) {
  let n = e.trim(),
    r = t?.trim();
  if (!n) return ``;
  if (r && n === r) return `.`;
  if (r && n.startsWith(`${r}/`)) return n.slice(r.length + 1) || `.`;
  let i = n.split(/[\\/]+/);
  for (let e = i.length - 1; e >= 0; --e) {
    let t = i[e];
    if (t) return t;
  }
  return n;
}
function uo(e) {
  return (
    e
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, `-`)
      .replace(/^-+|-+$/g, ``) || `preview`
  );
}
function fo(e, t, n) {
  return M(
    { title: D(`agents.context.title`), description: t },
    g`
      <dl class="settings-kv">
        <dt>${D(`agents.context.workspace`)}</dt>
        <dd>
          <button type="button" class="workspace-link mono" @click=${() => n(`files`)}>
            ${e.workspace}
          </button>
        </dd>
        <dt>${D(`agents.context.primaryModel`)}</dt>
        <dd><code>${e.model}</code></dd>
        <dt>${D(`agents.context.runtime`)}</dt>
        <dd><code>${e.runtime}</code></dd>
        <dt>${D(`agents.context.identityName`)}</dt>
        <dd>${e.identityName}</dd>
        <dt>${D(`agents.context.identityAvatar`)}</dt>
        <dd>${e.identityAvatar}</dd>
        <dt>${D(`agents.context.skillsFilter`)}</dt>
        <dd>${e.skillsLabel}</dd>
        <dt>${D(`agents.context.default`)}</dt>
        <dd>${e.isDefault ? D(`common.yes`) : D(`common.no`)}</dd>
      </dl>
    `,
  );
}
function po(e, t) {
  let n = e.channelMeta?.find((e) => e.id === t);
  return n?.label ? n.label : (e.channelLabels?.[t] ?? t);
}
function mo(e) {
  if (!e) return [];
  let t = new Set();
  for (let n of e.channelOrder ?? []) t.add(n);
  for (let n of e.channelMeta ?? []) t.add(n.id);
  for (let n of Object.keys(e.channelAccounts ?? {})) t.add(n);
  let n = [],
    r = e.channelOrder?.length ? e.channelOrder : Array.from(t);
  for (let e of r) t.has(e) && (n.push(e), t.delete(e));
  for (let e of t) n.push(e);
  return n.map((t) => ({ id: t, label: po(e, t), accounts: e.channelAccounts?.[t] ?? [] }));
}
function ho(e) {
  let t = 0,
    n = 0,
    r = 0;
  for (let i of e) {
    let e = i.probe && typeof i.probe == `object` && `ok` in i.probe ? !!i.probe.ok : !1;
    ((i.connected === !0 || i.running === !0 || e) && (t += 1),
      i.configured && (n += 1),
      i.enabled && (r += 1));
  }
  return { total: e.length, connected: t, configured: n, enabled: r };
}
function go(e) {
  let t = mo(e.snapshot),
    n = e.lastSuccess ? i(e.lastSuccess) : D(`common.never`);
  return g`
    ${fo(e.context, D(`agents.context.configurationSubtitle`), e.onSelectPanel)}
    ${e.error ? g`<div class="callout danger">${e.error}</div>` : v}
    ${e.snapshot ? v : g`<div class="callout info">${D(`agents.channels.loadHint`)}</div>`}
    ${M(
      {
        title: D(`agents.channels.title`),
        description: g`${D(`agents.channels.subtitle`)}
        ${D(`agents.channels.lastRefresh`, { time: n })}`,
        actions: g`
          <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading ? D(`common.refreshing`) : D(`common.refresh`)}
          </button>
        `,
      },
      t.length === 0
        ? A(D(`agents.channels.empty`))
        : t.map((t) => {
            let n = ho(t.accounts),
              r = n.total
                ? D(`agents.channels.connectedCount`, {
                    connected: String(n.connected),
                    total: String(n.total),
                  })
                : D(`agents.channels.noAccounts`),
              i = n.configured
                ? D(`agents.channels.configuredCount`, { count: String(n.configured) })
                : D(`agents.channels.notConfigured`),
              a = n.total
                ? D(`agents.channels.enabledCount`, { count: String(n.enabled) })
                : D(`common.disabled`),
              o = Le({ configForm: e.configForm, channelId: t.id, fields: yo }),
              s = [t.id, i, a, ...o.map((e) => `${e.label}: ${e.value}`)];
            return j({
              title: t.label,
              description: s.join(` · `),
              control: g`
                ${
                  n.configured === 0
                    ? g`
                      <a
                        class="settings-row__value"
                        href="https://docs.openclaw.ai/channels"
                        target="_blank"
                        rel="noopener"
                        >${D(`agents.channels.setupGuide`)}</a
                      >
                    `
                    : v
                }
                ${xt({ kind: n.connected > 0 ? `ok` : n.total ? `warn` : `muted`, label: r })}
              `,
            });
          }),
    )}
  `;
}
function _o(e) {
  let t = e.jobs.filter((t) => t.agentId === e.agentId);
  return g`
    ${fo(e.context, D(`agents.context.schedulingSubtitle`), e.onSelectPanel)}
    ${e.error ? g`<div class="callout danger">${e.error}</div>` : v}
    ${M(
      {
        title: D(`agents.cronPanel.schedulerTitle`),
        description: D(`agents.cronPanel.schedulerSubtitle`),
        actions: g`
          <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading ? D(`common.refreshing`) : D(`common.refresh`)}
          </button>
        `,
      },
      g`
        ${j({ title: D(`common.enabled`), control: bt(e.status ? (e.status.enabled ? D(`common.yes`) : D(`common.no`)) : D(`common.na`)) })}
        ${j({ title: D(`agents.cronPanel.jobs`), control: bt(e.status?.jobs ?? D(`common.na`)) })}
        ${j({ title: D(`agents.cronPanel.nextWake`), control: bt(Ft(e.status?.nextWakeAtMs ?? null)) })}
      `,
    )}
    ${M(
      {
        title: D(`agents.cronPanel.agentJobsTitle`),
        description: D(`agents.cronPanel.agentJobsSubtitle`),
      },
      t.length === 0
        ? A(D(`agents.cronPanel.noJobs`))
        : t.map((t) => {
            let n = [t.description, It(t), t.sessionTarget, Lt(t), zt(t)].filter(Boolean);
            return j({
              title: t.name,
              description: n.join(` · `),
              control: g`
                ${xt({ kind: t.enabled ? `ok` : `warn`, label: t.enabled ? D(`common.enabled`) : D(`common.disabled`) })}
                <button
                  class="btn btn--sm"
                  ?disabled=${!t.enabled}
                  @click=${() => e.onRunNow(t.id)}
                >
                  ${D(`agents.cronPanel.runNow`)}
                </button>
              `,
            });
          }),
    )}
  `;
}
function vo(e) {
  let t = e.agentFilesList?.agentId === e.agentId ? e.agentFilesList : null,
    n = t?.files ?? [],
    r = e.agentFileActive ?? null,
    a = r ? (n.find((e) => e.name === r) ?? null) : null,
    o = r ? (e.agentFileContents[r] ?? ``) : ``,
    s = r ? (e.agentFileDrafts[r] ?? o) : ``,
    c = r ? s !== o : !1,
    l = a ? Ti(K.parse(s, { gfm: !0, breaks: !0 }), { sanitize: (e) => Mt.sanitize(e) }) : ``,
    u = oe(new TextEncoder().encode(s).length),
    d = ao(s),
    f = oo(s),
    p = a ? lo(a.path, t?.workspace) : ``,
    m = a ? `agent-file-preview-title-${uo(a.name)}` : ``,
    _ = a?.missing
      ? D(`agents.files.willCreateOnSave`)
      : D(c ? `agents.files.liveDraftPreview` : `agents.files.savedPreview`),
    ee = a?.missing ? `is-missing` : c ? `is-dirty` : `is-synced`,
    y = a?.updatedAtMs
      ? D(`agents.files.updated`, { time: i(a.updatedAtMs) })
      : a?.missing
        ? D(`agents.files.notCreatedYet`)
        : D(`agents.files.updatedUnknown`);
  return g`
    ${e.agentFilesError ? g`<div class="callout danger">${e.agentFilesError}</div>` : v}
    ${M(
      {
        title: D(`agents.files.coreFilesTitle`),
        description: t
          ? g`${D(`agents.files.coreFilesSubtitle`)} ${D(`agents.files.workspace`)}:
              <code>${t.workspace}</code>`
          : D(`agents.files.coreFilesSubtitle`),
        actions: g`
          <button
            class="btn btn--sm"
            ?disabled=${e.agentFilesLoading}
            @click=${() => e.onLoadFiles(e.agentId)}
          >
            ${e.agentFilesLoading ? D(`common.loading`) : D(`common.refresh`)}
          </button>
        `,
      },
      t
        ? n.length === 0
          ? A(D(`agents.files.empty`))
          : g`
              <div class="agents-panel-body">
                <div class="agent-tabs">
                  ${n.map((t) => {
                    let n = r === t.name,
                      i = t.name.replace(/\.md$/i, ``);
                    return g`
                      <button
                        class="agent-tab ${n ? `active` : ``} ${t.missing ? `agent-tab--missing` : ``}"
                        ?disabled=${e.agentFilesLoading}
                        @click=${() => e.onSelectFile(t.name)}
                      >
                        ${i}${
                          t.missing
                            ? g`
                              <span class="agent-tab-badge">${D(`agents.files.missing`)}</span>
                            `
                            : v
                        }
                      </button>
                    `;
                  })}
                </div>
                ${
                  a
                    ? g`
                      <div class="agent-file-header">
                        <div>
                          <div class="agent-file-sub mono">${a.path}</div>
                        </div>
                        <div class="agent-file-actions">
                          <button
                            class="btn btn--sm"
                            @click=${(e) => {
                              e.currentTarget
                                .closest(`.settings-group`)
                                ?.querySelector(`openclaw-modal-dialog`)
                                ?.show();
                            }}
                          >
                            ${k.eye} ${D(`agents.files.preview`)}
                          </button>
                          <button
                            class="btn btn--sm"
                            ?disabled=${!c}
                            @click=${() => e.onFileReset(a.name)}
                          >
                            ${D(`common.reset`)}
                          </button>
                          <button
                            class="btn btn--sm primary"
                            ?disabled=${e.agentFileSaving || !c}
                            @click=${() => e.onFileSave(a.name)}
                          >
                            ${e.agentFileSaving ? D(`common.saving`) : D(`common.save`)}
                          </button>
                        </div>
                      </div>
                      ${a.missing ? g`<div class="callout info">${D(`agents.files.missingHint`)}</div>` : v}
                      <label class="field agent-file-field">
                        <span>${D(`agents.files.content`)}</span>
                        <textarea
                          class="agent-file-textarea"
                          .value=${s}
                          @input=${(t) => e.onFileDraftChange(a.name, t.target.value)}
                        ></textarea>
                      </label>
                      <openclaw-modal-dialog
                        manual
                        label=${a.name}
                        style="--openclaw-modal-width: min(1040px, calc(100vw - 32px));"
                        @modal-cancel=${(e) => {
                          ro(e.currentTarget);
                        }}
                      >
                        <div class="md-preview-dialog__panel">
                          <div class="md-preview-dialog__header">
                            <div class="md-preview-dialog__header-main">
                              <div class="md-preview-dialog__eyebrow">
                                ${k.scrollText}
                                <span>${co(a.name)}</span>
                              </div>
                              <div class="md-preview-dialog__title-wrap">
                                <div
                                  id=${m}
                                  class="md-preview-dialog__title"
                                  translate="no"
                                >
                                  ${a.name}
                                </div>
                                <div class="md-preview-dialog__path mono" translate="no">
                                  ${p}
                                </div>
                              </div>
                            </div>
                            <div class="md-preview-dialog__actions">
                              <openclaw-tooltip .content=${D(`agents.files.expandPreview`)}>
                                <button
                                  type="button"
                                  class="btn btn--sm md-preview-icon-btn md-preview-expand-btn"
                                  aria-label=${D(`agents.files.expandPreview`)}
                                  aria-pressed="false"
                                  @click=${(e) => {
                                    let t = e.currentTarget,
                                      n = t.closest(`.md-preview-dialog__panel`);
                                    if (!n) return;
                                    let r = n.classList.toggle(`fullscreen`);
                                    (t
                                      .closest(`openclaw-modal-dialog`)
                                      ?.classList.toggle(`fullscreen`, r),
                                      no(t, r));
                                  }}
                                >
                                  <span class="when-normal" aria-hidden="true"
                                    >${k.maximize}</span
                                  ><span class="when-fullscreen" aria-hidden="true"
                                    >${k.minimize}</span
                                  >
                                </button>
                              </openclaw-tooltip>
                              <openclaw-tooltip .content=${D(`agents.files.editFile`)}>
                                <button
                                  type="button"
                                  class="btn btn--sm md-preview-icon-btn"
                                  aria-label=${D(`agents.files.editFile`)}
                                  @click=${(e) => {
                                    let t = e.currentTarget.closest(`openclaw-modal-dialog`);
                                    (t?.hide(),
                                      t && ro(t),
                                      document.querySelector(`.agent-file-textarea`)?.focus());
                                  }}
                                >
                                  <span aria-hidden="true">${k.edit}</span>
                                </button>
                              </openclaw-tooltip>
                              <openclaw-tooltip .content=${D(`agents.files.closePreview`)}>
                                <button
                                  type="button"
                                  class="btn btn--sm md-preview-icon-btn"
                                  aria-label=${D(`agents.files.closePreview`)}
                                  @click=${(e) => {
                                    let t = e.currentTarget.closest(`openclaw-modal-dialog`);
                                    (t?.hide(), t && ro(t));
                                  }}
                                >
                                  <span aria-hidden="true">${k.x}</span>
                                </button>
                              </openclaw-tooltip>
                            </div>
                          </div>
                          <div class="md-preview-dialog__meta">
                            <div class="md-preview-dialog__chip ${ee}">
                              <strong>${_}</strong>
                            </div>
                            <div class="md-preview-dialog__chip">
                              <strong>${so(d)}</strong>
                              <span
                                >${D(`agents.files.words`, { count: String(d) })}</span
                              >
                            </div>
                            <div class="md-preview-dialog__chip">
                              <strong>${f}</strong>
                              <span>${D(`agents.files.lines`)}</span>
                            </div>
                            <div class="md-preview-dialog__chip">
                              <strong>${u}</strong>
                              <span>${y}</span>
                            </div>
                          </div>
                          <div class="md-preview-dialog__body">
                            <article class="md-preview-dialog__reader sidebar-markdown">
                              ${h(l)}
                            </article>
                          </div>
                        </div>
                      </openclaw-modal-dialog>
                    `
                    : g`<div class="muted">${D(`agents.files.selectFile`)}</div>`
                }
              </div>
            `
        : A(D(`agents.files.loadHint`)),
    )}
  `;
}
var yo,
  bo = e(() => {
    (ji(),
      jt(),
      _(),
      ee(),
      to(),
      lt(),
      ht(),
      ft(),
      St(),
      O(),
      We(),
      xe(),
      Ie(),
      Rt(),
      io(),
      (yo = [`groupPolicy`, `streamMode`, `dmPolicy`]));
  });
function xo(e) {
  return e.length === 0
    ? v
    : g`
    <div class="agent-tool-badges">
      ${e.map((e) => g`<span class="settings-row__value">${e}</span>`)}
    </div>
  `;
}
function So(e, t) {
  let n = t.source ?? e.source,
    r = t.pluginId ?? e.pluginId,
    i = [];
  return (
    n === `plugin` && r
      ? i.push(D(`agentTools.plugin`, { id: r }))
      : n === `core` && i.push(D(`agentTools.builtIn`)),
    t.optional && i.push(D(`agentTools.optional`)),
    i
  );
}
function Co(e) {
  let t = So(e.section, e.tool);
  return (e.activeEntry && t.unshift(D(`agentTools.liveNow`)), t);
}
function wo(e) {
  return e.denied
    ? D(`agentTools.disabledByOverride`)
    : e.allowed && e.baseAllowed
      ? D(`agentTools.enabledByProfile`)
      : e.allowed
        ? D(`agentTools.enabledByOverride`)
        : D(`agentTools.notIncluded`);
}
function To(e, t) {
  let n = t.source ?? e.source,
    r = t.pluginId ?? e.pluginId;
  return n === `plugin` && r ? D(`agentTools.plugin`, { id: r }) : D(`agentTools.builtIn`);
}
function Eo(e) {
  return e.denied
    ? D(`agentTools.overrideOff`)
    : e.allowed && e.baseAllowed
      ? D(`agentTools.enabled`)
      : e.allowed
        ? D(`agentTools.overrideOn`)
        : D(`agentTools.profileOff`);
}
function Do(e) {
  return e.activeEntry
    ? D(`agentTools.liveNow`)
    : e.runtimeSessionMatchesSelectedAgent
      ? D(`agentTools.notLive`)
      : D(`agentTools.otherAgent`);
}
function Oo(e) {
  return `agent-tool-${S(e).replace(/[^a-z0-9_-]+/g, `-`)}`;
}
function ko(e) {
  return (e ?? []).flatMap((e) => e.tools);
}
function Ao(e) {
  let t = e.currentTarget;
  if (!(!(t instanceof HTMLDetailsElement) || t.open))
    for (let e of t.querySelectorAll(`.agent-tool-card[open]`)) e.open = !1;
}
function jo(e, t) {
  let n = document.getElementById(t);
  if (!(n instanceof HTMLDetailsElement)) return;
  e.preventDefault();
  let r = n.closest(`.agent-tools-group`);
  (r && (r.open = !0), (n.open = !0));
  let i = new URL(window.location.href);
  ((i.hash = t),
    window.history.replaceState(null, ``, i),
    requestAnimationFrame(() => {
      let e =
        typeof window.matchMedia == `function` &&
        window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
      (n.scrollIntoView?.({ block: `center`, behavior: e ? `auto` : `smooth` }),
        n.querySelector(`summary`)?.focus());
    }));
}
function Mo(e) {
  let t = e?.notices ?? [];
  return t.length === 0
    ? v
    : g`
    <div class="agent-tools-notices">
      ${t.map(
        (e) => g`
          <div
            class="callout ${e.severity === `warning` ? `warning` : `info`}"
            style="margin-top: 12px"
          >
            ${e.message}
          </div>
        `,
      )}
    </div>
  `;
}
function No(e) {
  return e.source === `plugin`
    ? e.pluginId
      ? D(`agentTools.connectedSource`, { id: e.pluginId })
      : D(`agentTools.connected`)
    : e.source === `channel`
      ? e.channelId
        ? D(`agentTools.channelSource`, { id: e.channelId })
        : D(`agentTools.channel`)
      : e.source === `mcp`
        ? `MCP`
        : D(`agentTools.builtIn`);
}
function Po(e) {
  let t = ge(e.configForm, e.agentId),
    n = t.entry?.tools ?? {},
    r = t.globalTools ?? {},
    i = n.profile ?? r.profile ?? `full`,
    a = fe(e.toolsCatalogResult),
    o = he(e.toolsCatalogResult),
    s = n.profile
      ? D(`agentTools.profileSourceAgent`)
      : r.profile
        ? D(`agentTools.profileSourceGlobal`)
        : D(`agentTools.profileSourceDefault`),
    c = Array.isArray(n.allow) && n.allow.length > 0,
    l = Array.isArray(r.allow) && r.allow.length > 0,
    u =
      !!e.configForm &&
      !e.configLoading &&
      !e.configSaving &&
      !c &&
      !(e.toolsCatalogLoading && !e.toolsCatalogResult && !e.toolsCatalogError),
    d = c ? [] : Array.isArray(n.alsoAllow) ? n.alsoAllow : [],
    f = c ? [] : Array.isArray(n.deny) ? n.deny : [],
    p = c ? { allow: n.allow ?? [], deny: n.deny ?? [] } : (Ae(i) ?? void 0),
    m = o.flatMap((e) => e.tools.map((e) => e.id)),
    h = (e) => {
      let t = _e(e, p),
        n = ve(e, d),
        r = ve(e, f);
      return { allowed: (t || n) && !r, baseAllowed: t, denied: r };
    },
    _ = m.filter((e) => h(e).allowed).length,
    ee =
      e.runtimeSessionMatchesSelectedAgent && !e.toolsEffectiveError
        ? ko(e.toolsEffectiveResult?.groups)
        : [],
    y = Array.from(new Map(ee.map((e) => [S(e.id), e])).values()),
    te = y.slice(0, Ro),
    b = Math.max(0, y.length - te.length),
    ne = y.length,
    x = new Map(ee.map((e) => [S(e.id), e])),
    re = new Set(x.keys()),
    C = (e) =>
      e.toSorted((e, t) => {
        let n = S(e.id),
          r = S(t.id),
          i = +!!re.has(n),
          a = +!!re.has(r);
        if (i !== a) return a - i;
        let o = +!!h(e.id).allowed,
          s = +!!h(t.id).allowed;
        return o === s ? e.label.localeCompare(t.label) : s - o;
      }),
    ie = (t, n) => {
      let r = new Set(d.map((e) => S(e)).filter((e) => e.length > 0)),
        i = new Set(f.map((e) => S(e)).filter((e) => e.length > 0)),
        a = h(t).baseAllowed,
        o = S(t);
      (n ? (i.delete(o), a || r.add(o)) : (r.delete(o), i.add(o)),
        e.onOverridesChange(e.agentId, [...r], [...i]));
    },
    ae = (t) => {
      let n = new Set(d.map((e) => S(e)).filter((e) => e.length > 0)),
        r = new Set(f.map((e) => S(e)).filter((e) => e.length > 0));
      for (let e of m) {
        let i = h(e).baseAllowed,
          a = S(e);
        t ? (r.delete(a), i || n.add(a)) : (n.delete(a), r.add(a));
      }
      e.onOverridesChange(e.agentId, [...n], [...r]);
    },
    w = e.runtimeSessionMatchesSelectedAgent
      ? e.toolsEffectiveLoading && !e.toolsEffectiveResult && !e.toolsEffectiveError
        ? A(D(`agentTools.loadingAvailable`))
        : e.toolsEffectiveError
          ? A(D(`agentTools.availableError`))
          : (e.toolsEffectiveResult?.groups?.length ?? 0) === 0
            ? A(D(`agentTools.noAvailable`))
            : g`
              <div class="agents-panel-body">
                <div class="agent-tools-runtime">
                  ${te.map((e) => {
                    let t = Oo(e.id);
                    return g`
                      <a
                        class="agent-tools-runtime-chip"
                        href="#${t}"
                        @click=${(e) => jo(e, t)}
                      >
                        <span class="mono" translate="no">${e.label}</span>
                        <span class="agent-tools-runtime-chip__meta"
                          >${No(e)}</span
                        >
                      </a>
                    `;
                  })}
                  ${
                    b > 0
                      ? g`
                        <span
                          class="agent-tools-runtime-chip agent-tools-runtime-chip--more"
                          title=${D(`agentTools.moreLiveTitle`, { count: String(b) })}
                        >
                          ${D(`agentTools.moreLive`, { count: String(b) })}
                        </span>
                      `
                      : v
                  }
                </div>
              </div>
            `
      : A(D(`agentTools.switchAgent`));
  return g`
    ${e.configForm ? v : g`<div class="callout info">${D(`agentTools.loadConfig`)}</div>`}
    ${c ? g`<div class="callout info">${D(`agentTools.explicitAllowlist`)}</div>` : v}
    ${l ? g`<div class="callout info">${D(`agentTools.globalAllowlist`)}</div>` : v}
    ${e.toolsCatalogLoading && !e.toolsCatalogResult && !e.toolsCatalogError ? g`<div class="callout info">${D(`agentTools.loadingCatalog`)}</div>` : v}
    ${e.toolsCatalogError ? g`<div class="callout info">${D(`agentTools.catalogFallback`)}</div>` : v}
    ${M(
      {
        title: D(`agentTools.title`),
        description: g`${D(`agentTools.subtitle`)}
          <span class="mono"
            >${D(`agentTools.enabledSummary`, { enabled: String(_), total: String(m.length) })}</span
          >`,
        actions: g`
          <button class="btn btn--sm" ?disabled=${!u} @click=${() => ae(!0)}>
            ${D(`agentTools.enableAll`)}
          </button>
          <button class="btn btn--sm" ?disabled=${!u} @click=${() => ae(!1)}>
            ${D(`agentTools.disableAll`)}
          </button>
          <button
            class="btn btn--sm"
            ?disabled=${e.configLoading}
            @click=${e.onConfigReload}
          >
            ${D(`common.reloadConfig`)}
          </button>
          <button
            class="btn btn--sm primary"
            ?disabled=${e.configSaving || !e.configDirty}
            @click=${e.onConfigSave}
          >
            ${e.configSaving ? D(`common.saving`) : D(`common.save`)}
          </button>
        `,
      },
      g`
        <dl class="settings-kv">
          <dt>${D(`agentTools.profile`)}</dt>
          <dd><code>${i}</code></dd>
          <dt>${D(`agentTools.source`)}</dt>
          <dd>${s}</dd>
          <dt>${D(`agentTools.enabled`)}</dt>
          <dd><code>${_}/${m.length}</code></dd>
          <dt>${D(`agentTools.live`)}</dt>
          <dd><code>${ne}</code></dd>
          <dt>${D(`agentTools.status`)}</dt>
          <dd>
            ${e.configSaving ? D(`agentTools.statusSaving`) : e.configDirty ? D(`agentTools.statusUnsaved`) : D(`agentTools.statusSaved`)}
          </dd>
        </dl>
        ${j({
          title: D(`agentTools.quickPresets`),
          stacked: !0,
          control: g`
            <div class="agent-tools-buttons">
              ${a.map(
                (t) => g`
                  <button
                    class="btn btn--sm ${i === t.id ? `active` : ``}"
                    ?disabled=${!u}
                    @click=${() => e.onProfileChange(e.agentId, t.id, !0)}
                  >
                    ${t.label}
                  </button>
                `,
              )}
              <button
                class="btn btn--sm"
                ?disabled=${!u}
                @click=${() => e.onProfileChange(e.agentId, null, !1)}
              >
                ${D(`agentTools.inherit`)}
              </button>
            </div>
          `,
        })}
      `,
    )}
    ${M(
      {
        title: D(`agentTools.availableNow`),
        description: g`${D(`agentTools.availableNowSubtitle`)}
          <span class="mono">${e.runtimeSessionKey || D(`agentTools.noSession`)}</span>`,
      },
      g`${Mo(e.toolsEffectiveResult)}${w}`,
    )}
    ${M(
      { title: D(`agentTools.catalogTitle`) },
      g`
        <div class="agents-panel-body agent-tools-grid">
          ${o.map((t) => {
            let n = C(t.tools),
              r = t.tools.filter((e) => h(e.id).allowed).length,
              i = t.tools.filter((e) => re.has(S(e.id))).length,
              a = n.slice(0, 4),
              o = Math.max(0, n.length - a.length);
            return g`
              <details class="agent-tools-group" @toggle=${Ao}>
                <summary class="agent-tools-group__summary">
                  <span class="agent-tools-group__summary-main">
                    <span class="agent-tools-group__title">
                      ${t.label}
                      ${
                        t.source === `plugin` && t.pluginId
                          ? g`<span class="settings-row__value"
                            >${D(`agentTools.plugin`, { id: t.pluginId })}</span
                          >`
                          : v
                      }
                    </span>
                    <span
                      class="agent-tools-group__preview"
                      aria-label=${D(`agentTools.toolPreview`)}
                    >
                      ${a.map(
                        (e) => g`<span class="mono" translate="no" title=${e.label}
                            >${e.label}</span
                          >`,
                      )}
                      ${
                        o > 0
                          ? g`<span
                            >${D(`agentTools.more`, { count: String(o) })}</span
                          >`
                          : v
                      }
                    </span>
                  </span>
                  <span class="agent-tools-group__counts">
                    <span
                      >${D(t.tools.length === 1 ? `agentTools.toolsOne` : `agentTools.tools`, { count: String(t.tools.length) })}</span
                    >
                    <span
                      >${D(r === 1 ? `agentTools.enabledToolsOne` : `agentTools.enabledTools`, { count: String(r) })}</span
                    >
                    ${
                      i > 0
                        ? g`<span
                          >${D(i === 1 ? `agentTools.liveToolsOne` : `agentTools.liveTools`, { count: String(i) })}</span
                        >`
                        : v
                    }
                  </span>
                </summary>
                <div class="agent-tools-list agent-tools-list--stacked">
                  ${n.map((n) => {
                    let r = Oo(n.id),
                      i = h(n.id),
                      a = x.get(S(n.id)) ?? null,
                      o = n.defaultProfiles ?? [],
                      s = Co({ section: t, tool: n, activeEntry: a }),
                      c = Eo(i),
                      l = Do({
                        activeEntry: a,
                        runtimeSessionMatchesSelectedAgent: e.runtimeSessionMatchesSelectedAgent,
                      });
                    return g`
                      <details class="agent-tool-card" id=${r}>
                        <summary class="agent-tool-summary">
                          <div class="agent-tool-summary__main">
                            <div class="agent-tool-summary__title-row">
                              <span class="agent-tool-title mono" translate="no"
                                >${n.label}</span
                              >
                            </div>
                            <div class="agent-tool-sub">${n.description}</div>
                          </div>
                          <dl class="agent-tool-summary__facts">
                            <div class="agent-tool-summary__fact">
                              <dt class="label">${D(`agentTools.access`)}</dt>
                              <dd>${c}</dd>
                            </div>
                            <div class="agent-tool-summary__fact">
                              <dt class="label">${D(`agentTools.session`)}</dt>
                              <dd>${l}</dd>
                            </div>
                          </dl>
                          <div class="agent-tool-summary__badges">
                            ${xo(s)}
                          </div>
                          <span
                            class="agent-tool-toggle"
                            @click=${(e) => e.stopPropagation()}
                            @keydown=${(e) => e.stopPropagation()}
                          >
                            ${Ct({ checked: i.allowed, disabled: !u, ariaLabel: D(i.allowed ? `agentTools.disableNamed` : `agentTools.enableNamed`, { name: n.label }), onChange: (e) => ie(n.id, e) })}
                          </span>
                        </summary>
                        <div class="agent-tool-details">
                          <div class="agent-tool-details-strip">
                            <div class="agent-tool-detail agent-tool-detail--inline">
                              <div class="label">${D(`agentTools.access`)}</div>
                              <div>${wo(i)}</div>
                            </div>
                            <div class="agent-tool-detail agent-tool-detail--inline">
                              <div class="label">${D(`agentTools.source`)}</div>
                              <div>${To(t, n)}</div>
                            </div>
                            ${
                              o.length > 0
                                ? g`
                                  <div class="agent-tool-detail agent-tool-detail--inline">
                                    <div class="label">${D(`agentTools.defaultPresets`)}</div>
                                    <div class="agent-tool-badges">
                                      ${o.map(
                                        (e) => g`<span class="settings-row__value"
                                            >${e}</span
                                          >`,
                                      )}
                                    </div>
                                  </div>
                                `
                                : v
                            }
                            <div class="agent-tool-detail agent-tool-detail--inline">
                              <div class="label">${D(`agentTools.session`)}</div>
                              <div>
                                ${a ? D(`agentTools.availableVia`, { source: No(a) }) : e.runtimeSessionMatchesSelectedAgent ? D(`agentTools.unavailableSession`) : D(`agentTools.inspectAgent`)}
                              </div>
                            </div>
                            <a class="agent-tool-jump" href="#${r}">
                              ${D(`agentTools.linkTool`)}
                            </a>
                          </div>
                        </div>
                      </details>
                    `;
                  })}
                </div>
              </details>
            `;
          })}
        </div>
      `,
    )}
  `;
}
function Fo(e) {
  let t = !!e.configForm && !e.configLoading && !e.configSaving,
    n = ge(e.configForm, e.agentId),
    r = Array.isArray(n.entry?.skills) ? n.entry?.skills : void 0,
    i = new Set(ne(r ?? [])),
    a = r !== void 0,
    o = !!(e.report && e.activeAgentId === e.agentId),
    s = o ? (e.report?.skills ?? []) : [],
    c = te(e.filter),
    l = c ? s.filter((e) => te([e.name, e.description, e.source].join(` `)).includes(c)) : s,
    u = Dt(l),
    d = a ? s.filter((e) => i.has(e.name)).length : s.length,
    f = s.length;
  return g`
    ${e.configForm ? v : g`<div class="callout info">${D(`agents.skillsPanel.loadConfig`)}</div>`}
    ${a ? g`<div class="callout info">${D(`agents.skillsPanel.customAllowlist`)}</div>` : g`<div class="callout info">${D(`agents.skillsPanel.allEnabled`)}</div>`}
    ${!o && !e.loading ? g`<div class="callout info">${D(`agents.skillsPanel.loadAgent`)}</div>` : v}
    ${e.error ? g`<div class="callout danger">${e.error}</div>` : v}
    ${M(
      {
        title: D(`agents.skillsPanel.title`),
        description: g`${D(`agents.skillsPanel.subtitle`)}
        ${f > 0 ? g`<span class="mono">${d}/${f}</span>` : v}`,
        actions: g`
          <button
            class="btn btn--sm"
            ?disabled=${!t}
            @click=${() => e.onClear(e.agentId)}
          >
            ${D(`agentTools.enableAll`)}
          </button>
          <button
            class="btn btn--sm"
            ?disabled=${!t}
            @click=${() => e.onDisableAll(e.agentId)}
          >
            ${D(`agentTools.disableAll`)}
          </button>
          <button
            class="btn btn--sm"
            ?disabled=${!t || !a}
            @click=${() => e.onClear(e.agentId)}
          >
            ${D(`common.reset`)}
          </button>
          <button
            class="btn btn--sm"
            ?disabled=${e.configLoading}
            @click=${e.onConfigReload}
          >
            ${D(`common.reloadConfig`)}
          </button>
          <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading ? D(`common.loading`) : D(`common.refresh`)}
          </button>
          <button
            class="btn btn--sm primary"
            ?disabled=${e.configSaving || !e.configDirty}
            @click=${e.onConfigSave}
          >
            ${e.configSaving ? D(`common.saving`) : D(`common.save`)}
          </button>
        `,
      },
      g`
        ${j({
          title: D(`agents.skillsPanel.filter`),
          description: D(`agents.skillsPanel.shown`, { count: String(l.length) }),
          control: g`
            <input
              class="settings-input"
              .value=${e.filter}
              @input=${(t) => e.onFilterChange(t.target.value)}
              placeholder=${D(`agents.skillsPanel.searchPlaceholder`)}
              autocomplete="off"
              name="agent-skills-filter"
            />
          `,
        })}
        ${
          l.length === 0
            ? A(D(`agents.skillsPanel.empty`))
            : g`
              <div class="agents-panel-body agent-skills-groups">
                ${u.map((n) => Io(n, { agentId: e.agentId, allowSet: i, usingAllowlist: a, editable: t, onToggle: e.onToggle }))}
              </div>
            `
        }
      `,
    )}
  `;
}
function Io(e, t) {
  return g`
    <details class="agent-skills-group" ?open=${!(e.id === `workspace` || e.id === `built-in`)}>
      <summary class="agent-skills-header">
        <span>${e.label}</span>
        <span class="muted">${e.skills.length}</span>
      </summary>
      <div class="list skills-grid">
        ${e.skills.map((e) => Lo(e, { agentId: t.agentId, allowSet: t.allowSet, usingAllowlist: t.usingAllowlist, editable: t.editable, onToggle: t.onToggle }))}
      </div>
    </details>
  `;
}
function Lo(e, t) {
  let n = t.usingAllowlist ? t.allowSet.has(e.name) : !0,
    r = At(e),
    i = Et(e);
  return g`
    <div class="settings-row agent-skill-row">
      <div class="settings-row__text">
        <span class="settings-row__title"
          >${e.emoji ? `${e.emoji} ` : ``}${e.name}</span
        >
        <span class="settings-row__desc">${e.description}</span>
        ${wt({ skill: e })}
        ${
          r.length > 0
            ? g`<span class="settings-row__desc">
              ${D(`agents.skillsPanel.missing`, { items: r.join(`, `) })}
            </span>`
            : v
        }
        ${
          i.length > 0
            ? g`<span class="settings-row__desc">
              ${D(`agents.skillsPanel.reason`, { items: i.join(`, `) })}
            </span>`
            : v
        }
      </div>
      <div class="settings-row__control">
        ${Ct({ checked: n, disabled: !t.editable, ariaLabel: e.name, onChange: (n) => t.onToggle(t.agentId, e.name, n) })}
      </div>
    </div>
  `;
}
var Ro,
  zo = e(() => {
    (_(), ie(), St(), O(), We(), kt(), Ot(), Oe(), (Ro = 12));
  });
function Bo(e) {
  let t = e.agentsList?.agents ?? [],
    n = e.agentsList?.defaultId ?? null,
    r = e.selectedAgentId ?? n ?? t[0]?.id ?? null,
    i = r ? (t.find((e) => e.id === r) ?? null) : null,
    a = r && e.agentSkills.agentId === r ? (e.agentSkills.report?.skills?.length ?? null) : null,
    o = e.channels.snapshot ? Object.keys(e.channels.snapshot.channelAccounts ?? {}).length : null,
    s = r ? e.cron.jobs.filter((e) => e.agentId === r).length : null,
    c = {
      files: e.agentFiles.list?.files?.length ?? null,
      skills: a,
      channels: o,
      cron: s || null,
    };
  return g`
    <div class="agents-layout">
      <section class="agents-toolbar">
        <div class="agents-toolbar-row">
          <div class="agents-control-select">
            <openclaw-agent-select
              .agents=${t}
              .selectedId=${r}
              .defaultId=${n}
              .identityById=${e.agentIdentityById}
              .authToken=${e.authToken}
              .disabled=${e.loading}
              .onSelect=${e.onSelectAgent}
            ></openclaw-agent-select>
          </div>
          <div class="agents-toolbar-actions">
            ${
              i
                ? g`
                  <button
                    type="button"
                    class="btn btn--sm btn--ghost"
                    @click=${() => void gt(i.id)}
                  >
                    ${D(`agents.copyId`)}
                  </button>
                  <button
                    type="button"
                    class="btn btn--sm btn--ghost"
                    ?disabled=${!!(n && i.id === n)}
                    @click=${() => e.onSetDefault(i.id)}
                  >
                    ${n && i.id === n ? D(`agents.default`) : D(`agents.setDefault`)}
                  </button>
                  <button
                    type="button"
                    class="btn btn--sm btn--ghost"
                    @click=${() => e.onTogglePinnedAgent(i.id)}
                  >
                    ${e.pinnedAgentIds.includes(i.id) ? D(`agents.unpinFromSwitcher`) : D(`agents.pinToSwitcher`)}
                  </button>
                `
                : v
            }
            <button
              class="btn btn--sm agents-refresh-btn"
              ?disabled=${e.loading}
              @click=${e.onRefresh}
            >
              ${e.loading ? D(`common.loading`) : D(`common.refresh`)}
            </button>
          </div>
        </div>
        ${e.error ? g`<div class="callout danger" style="margin-top: 8px;">${e.error}</div>` : v}
      </section>
      <section class="agents-main">
        ${
          i
            ? g`
              ${Vo(e.activePanel, (t) => e.onSelectPanel(t), c)}
              ${e.activePanel === `overview` ? y(i.id, oi({ agent: i, basePath: e.basePath, defaultId: n, configForm: e.config.form, agentFilesList: e.agentFiles.list, agentIdentity: e.agentIdentityById[i.id] ?? null, agentIdentityError: e.agentIdentityError, agentIdentityLoading: e.agentIdentityLoading, identityDraft: e.identityDraft, identitySaving: e.identitySaving, identityError: e.identityError, configLoading: e.config.loading, configSaving: e.config.saving, configDirty: e.config.dirty, modelCatalog: e.modelCatalog, onConfigReload: e.onConfigReload, onConfigSave: e.onConfigSave, onIdentityFieldChange: e.onIdentityFieldChange, onIdentityAvatarSelect: e.onIdentityAvatarSelect, onIdentitySave: e.onIdentitySave, onModelChange: e.onModelChange, onModelFallbacksChange: e.onModelFallbacksChange, onSelectPanel: e.onSelectPanel })) : v}
              ${e.activePanel === `files` ? vo({ agentId: i.id, agentFilesList: e.agentFiles.list, agentFilesLoading: e.agentFiles.loading, agentFilesError: e.agentFiles.error, agentFileActive: e.agentFiles.active, agentFileContents: e.agentFiles.contents, agentFileDrafts: e.agentFiles.drafts, agentFileSaving: e.agentFiles.saving, onLoadFiles: e.onLoadFiles, onSelectFile: e.onSelectFile, onFileDraftChange: e.onFileDraftChange, onFileReset: e.onFileReset, onFileSave: e.onFileSave }) : v}
              ${e.activePanel === `tools` ? Po({ agentId: i.id, configForm: e.config.form, configLoading: e.config.loading, configSaving: e.config.saving, configDirty: e.config.dirty, toolsCatalogLoading: e.toolsCatalog.loading, toolsCatalogError: e.toolsCatalog.error, toolsCatalogResult: e.toolsCatalog.result, toolsEffectiveLoading: e.toolsEffective.loading, toolsEffectiveError: e.toolsEffective.error, toolsEffectiveResult: e.toolsEffective.result, runtimeSessionKey: e.runtimeSessionKey, runtimeSessionMatchesSelectedAgent: e.runtimeSessionMatchesSelectedAgent, onProfileChange: e.onToolsProfileChange, onOverridesChange: e.onToolsOverridesChange, onConfigReload: e.onConfigReload, onConfigSave: e.onConfigSave }) : v}
              ${e.activePanel === `skills` ? Fo({ agentId: i.id, report: e.agentSkills.report, loading: e.agentSkills.loading, error: e.agentSkills.error, activeAgentId: e.agentSkills.agentId, configForm: e.config.form, configLoading: e.config.loading, configSaving: e.config.saving, configDirty: e.config.dirty, filter: e.agentSkills.filter, onFilterChange: e.onSkillsFilterChange, onRefresh: e.onSkillsRefresh, onToggle: e.onAgentSkillToggle, onClear: e.onAgentSkillsClear, onDisableAll: e.onAgentSkillsDisableAll, onConfigReload: e.onConfigReload, onConfigSave: e.onConfigSave }) : v}
              ${e.activePanel === `channels` ? go({ context: ye(i, e.config.form, e.agentFiles.list, n, e.agentIdentityById[i.id] ?? null), configForm: e.config.form, snapshot: e.channels.snapshot, loading: e.channels.loading, error: e.channels.error, lastSuccess: e.channels.lastSuccess, onRefresh: e.onChannelsRefresh, onSelectPanel: e.onSelectPanel }) : v}
              ${e.activePanel === `cron` ? _o({ context: ye(i, e.config.form, e.agentFiles.list, n, e.agentIdentityById[i.id] ?? null), agentId: i.id, jobs: e.cron.jobs, status: e.cron.status, loading: e.cron.loading, error: e.cron.error, onRefresh: e.onCronRefresh, onRunNow: e.onCronRunNow, onSelectPanel: e.onSelectPanel }) : v}
              ${
                e.activePanel === `memory`
                  ? g`<openclaw-agent-memory-panel
                    .agentId=${i.id}
                  ></openclaw-agent-memory-panel>`
                  : v
              }
            `
            : M({ title: D(`agents.selectTitle`) }, A(D(`agents.selectSubtitle`)))
        }
      </section>
    </div>
  `;
}
function Vo(e, t, n) {
  return g`
    <div class="agent-tabs">
      ${[
        { id: `overview`, label: D(`agents.tabs.overview`) },
        { id: `files`, label: D(`agents.tabs.files`) },
        { id: `tools`, label: D(`agents.tabs.tools`) },
        { id: `skills`, label: D(`agents.tabs.skills`) },
        { id: `channels`, label: D(`agents.tabs.channels`) },
        { id: `cron`, label: D(`agents.tabs.cronJobs`) },
        { id: `memory`, label: D(`agents.tabs.memory`) },
      ].map(
        (r) => g`
          <button
            class="agent-tab ${e === r.id ? `active` : ``}"
            type="button"
            @click=${() => t(r.id)}
          >
            ${r.label}${n[r.id] == null ? v : g`<span class="agent-tab-count">${n[r.id]}</span>`}
          </button>
        `,
      )}
    </div>
  `;
}
var Ho = e(() => {
    (_(), f(), pn(), St(), O(), We(), _t(), mn(), Tt(), ai(), si(), bo(), zo());
  }),
  $;
e(() => {
  (c(),
    _(),
    d(),
    st(),
    ct(),
    ot(),
    yt(),
    Ye(),
    T(),
    we(),
    Se(),
    Oe(),
    Pe(),
    Re(),
    Ut(),
    rn(),
    ln(),
    dn(),
    Ho(),
    t(),
    ($ = class extends Ke {
      constructor(...e) {
        (super(...e),
          (this.client = null),
          (this.connected = !1),
          (this.agentsLoading = !1),
          (this.agentsError = null),
          (this.agentsList = null),
          (this.agentsSelectedId = null),
          (this.agentsPanel = `files`),
          (this.toolsCatalogLoading = !1),
          (this.toolsCatalogLoadingAgentId = null),
          (this.toolsCatalogError = null),
          (this.toolsCatalogResult = null),
          (this.toolsEffectiveLoading = !1),
          (this.toolsEffectiveLoadingKey = null),
          (this.toolsEffectiveResultKey = null),
          (this.toolsEffectiveError = null),
          (this.toolsEffectiveResult = null),
          (this.chatModelCatalog = []),
          (this.agentFilesLoading = !1),
          (this.agentFilesError = null),
          (this.agentFilesList = null),
          (this.agentFileContents = {}),
          (this.agentFileDrafts = {}),
          (this.agentFileActive = null),
          (this.agentFileSaving = !1),
          (this.agentIdentityLoading = !1),
          (this.agentIdentityError = null),
          (this.identityDraft = { name: null, emoji: null, avatar: null }),
          (this.identitySaving = !1),
          (this.identityError = null),
          (this.agentSkillsLoading = !1),
          (this.agentSkillsError = null),
          (this.agentSkillsReport = null),
          (this.agentSkillsAgentId = null),
          (this.skillsFilter = ``),
          (this.cron = tt()),
          (this.requestGeneration = 0),
          (this.routeDataInitialized = !1),
          (this.hasBoundGateway = !1),
          (this.gatewaySource = null),
          (this.hasBoundAgents = !1),
          (this.agentsSource = null),
          (this.hasBoundAgentIdentity = !1),
          (this.agentIdentitySource = null),
          (this.hasBoundSessions = !1),
          (this.sessionsSource = null),
          (this.subscriptions = new Fe(this)
            .effect(
              () => this.context?.agents,
              (e) => {
                let t = this.hasBoundAgents;
                ((this.hasBoundAgents = !0),
                  (this.agentsSource = e),
                  t && this.resetForAgentsSourceChange(),
                  this.syncAgentState(e),
                  this.ensureInitialData());
                let n = e.subscribe(() => {
                  this.agentsSource !== e ||
                    this.context.agents !== e ||
                    (this.syncAgentState(e),
                    this.ensureAgentIdentities(),
                    this.loadActivePanelData(),
                    this.requestUpdate());
                });
                return () => {
                  (n(), this.agentsSource === e && (this.agentsSource = null));
                };
              },
            )
            .effect(
              () => this.context?.agentIdentity,
              (e) => {
                let t = this.hasBoundAgentIdentity;
                ((this.hasBoundAgentIdentity = !0),
                  (this.agentIdentitySource = e),
                  t && (this.invalidateTransientRequests(), (this.agentIdentityError = null)),
                  this.ensureAgentIdentities(),
                  this.ensureInitialData());
                let n = e.subscribe(() => {
                  this.agentIdentitySource === e &&
                    this.context.agentIdentity === e &&
                    this.requestUpdate();
                });
                return () => {
                  (n(), this.agentIdentitySource === e && (this.agentIdentitySource = null));
                };
              },
            )
            .watch(
              () => this.context?.channels,
              (e, t) => e.subscribe(t),
            )
            .watch(
              () => this.context?.navigation,
              (e, t) => e.subscribe(t),
            )
            .watch(
              () => this.context?.runtimeConfig,
              (e, t) => e.subscribe(t),
            )
            .effect(
              () => this.context?.sessions,
              (e) => {
                let t = this.hasBoundSessions;
                ((this.hasBoundSessions = !0),
                  (this.sessionsSource = e),
                  t && (this.invalidateTransientRequests(), et(this), this.loadActivePanelData()));
                let n = e.subscribe(() => {
                  this.sessionsSource !== e ||
                    this.context.sessions !== e ||
                    (qe(this), this.requestUpdate());
                });
                return () => {
                  (n(), this.sessionsSource === e && (this.sessionsSource = null));
                };
              },
            )
            .effect(
              () => this.context?.gateway,
              (e) => {
                let t = !this.hasBoundGateway;
                ((this.hasBoundGateway = !0),
                  (this.gatewaySource = e),
                  this.applyGatewaySnapshot(e.snapshot, !t, t));
                let n = e.subscribe((t) => {
                  this.gatewaySource === e &&
                    this.context.gateway === e &&
                    this.applyGatewaySnapshot(t, !1);
                });
                return () => {
                  (n(), this.gatewaySource === e && (this.gatewaySource = null));
                };
              },
            )));
      }
      get sessions() {
        return this.context.sessions;
      }
      get sessionsResult() {
        return this.context.sessions.state.result;
      }
      get sessionKey() {
        return this.context.gateway.snapshot.sessionKey;
      }
      disconnectedCallback() {
        (this.subscriptions.clear(),
          (this.requestGeneration += 1),
          (this.client = null),
          (this.connected = !1),
          super.disconnectedCallback());
      }
      willUpdate(e) {
        e.has(`routeData`) && (this.applyRouteData(), this.ensureInitialData());
      }
      applyGatewaySnapshot(e, t, n = !1) {
        let r = this.connected !== e.connected,
          i = this.client !== e.client;
        (this.syncGatewayState(e),
          t || (!n && i)
            ? this.resetForClientChange()
            : !n && r && this.invalidateTransientRequests(),
          this.ensureInitialData());
      }
      syncGatewayState(e) {
        ((this.client = e.client),
          (this.connected = e.connected),
          (this.cron = { ...this.cron, client: e.client, connected: e.connected }));
      }
      syncAgentState(e = this.context.agents) {
        let t = e.state;
        ((this.agentsLoading = t.agentsLoading),
          (this.agentsError = t.agentsError),
          (this.agentsList = t.agentsList),
          t.agentsList && this.ensureSelectedAgentInList(t.agentsList),
          this.syncCurrentAgentFiles(e));
      }
      ensureSelectedAgentInList(e) {
        let t = this.agentsSelectedId;
        (!t || !e.agents.some((e) => e.id === t)) &&
          (this.agentsSelectedId = e.defaultId ?? e.agents[0]?.id ?? null);
      }
      syncCurrentAgentFiles(e = this.context.agents) {
        let t = this.resolveSelectedAgentId();
        if (!t || this.agentsPanel !== `files`) return;
        let n = e.files(t);
        n.list &&
          ((this.agentFilesList = n.list),
          (this.agentFilesError = n.error),
          this.agentFileActive &&
            !n.list.files.some((e) => e.name === this.agentFileActive) &&
            (this.agentFileActive = null));
      }
      resetForClientChange() {
        ((this.agentsLoading = !1),
          (this.agentsError = null),
          (this.agentsList = null),
          (this.agentsSelectedId = null),
          this.resetSelectionState(),
          (this.cron = tt({ client: this.client, connected: this.connected })));
      }
      resetForAgentsSourceChange() {
        ((this.agentsLoading = !1),
          (this.agentsError = null),
          (this.agentsList = null),
          (this.agentsSelectedId = null),
          this.resetSelectionState());
      }
      invalidateTransientRequests() {
        ((this.requestGeneration += 1),
          (this.agentsLoading = !1),
          (this.agentFilesLoading = !1),
          (this.agentFileSaving = !1),
          (this.agentIdentityLoading = !1),
          (this.agentSkillsLoading = !1),
          (this.toolsCatalogLoading = !1),
          (this.toolsCatalogLoadingAgentId = null),
          (this.toolsEffectiveLoading = !1),
          (this.toolsEffectiveLoadingKey = null),
          (this.cron = {
            ...this.cron,
            cronLoading: !1,
            cronJobsLoadingMore: !1,
            cronJobsReloadPending: !1,
            cronJobsReloadPendingTableFilters: !1,
            cronRunsLoadingMore: !1,
            cronBusy: !1,
          }));
      }
      applyRouteData() {
        let e = this.routeData;
        if (!e) return;
        this.routeDataInitialized = !0;
        let t = this.context.gateway;
        if (
          !(e.gateway !== t || e.gatewaySnapshot !== t.snapshot) &&
          ((this.agentsLoading = !1), (this.agentsError = e.error), e.agentsList)
        ) {
          this.agentsList = e.agentsList;
          let t = e.selectedAgentId ?? this.resolveSelectedAgentId();
          t !== this.agentsSelectedId && ((this.agentsSelectedId = t), this.resetSelectionState());
        }
      }
      resolveSelectedAgentId() {
        return (
          this.agentsSelectedId ??
          this.agentsList?.defaultId ??
          this.agentsList?.agents?.[0]?.id ??
          null
        );
      }
      chatAgentId() {
        return (
          ke(this.sessionKey)?.agentId ??
          this.context.gateway.snapshot.assistantAgentId ??
          this.agentsList?.defaultId ??
          `main`
        );
      }
      agentIdentityById() {
        return Object.fromEntries(this.context.agentIdentity.entries().map((e) => [e.agentId, e]));
      }
      controlUiAuthToken() {
        let { snapshot: e, connection: t } = this.context.gateway;
        return at({ hello: e.hello, settings: t, password: t.password });
      }
      ensureInitialData() {
        if (!(!this.connected || !this.client || !this.routeDataInitialized)) {
          if (
            (!this.context.runtimeConfig.state.configSnapshot &&
              !this.context.runtimeConfig.state.configLoading &&
              this.context.runtimeConfig.ensureLoaded(),
            !this.agentsList && !this.agentsLoading)
          ) {
            this.loadAgentsAndCommit();
            return;
          }
          (this.ensureAgentIdentities(), this.loadActivePanelData());
        }
      }
      isCurrentRequest(e, t, n, r = {}) {
        return (
          this.client === e &&
          this.connected &&
          this.requestGeneration === t &&
          (!r.agents || this.context.agents === r.agents) &&
          (!r.agentIdentity || this.context.agentIdentity === r.agentIdentity) &&
          (!r.sessions || this.context.sessions === r.sessions) &&
          (!n || this.resolveSelectedAgentId() === n)
        );
      }
      ensureAgentIdentities() {
        let e = this.client,
          t = this.context.agentIdentity,
          n = this.agentsList?.agents.map((e) => e.id).filter((e) => !t.get(e)) ?? [];
        if (!e || !this.connected || n.length === 0 || this.agentIdentityLoading) return;
        let r = this.requestGeneration;
        ((this.agentIdentityLoading = !0),
          (this.agentIdentityError = null),
          t
            .ensure(n)
            .catch((n) => {
              this.isCurrentRequest(e, r, void 0, { agentIdentity: t }) &&
                (this.agentIdentityError = String(n));
            })
            .finally(() => {
              this.isCurrentRequest(e, r, void 0, { agentIdentity: t }) &&
                (this.agentIdentityLoading = !1);
            }));
      }
      loadActivePanelData() {
        let e = this.resolveSelectedAgentId();
        if (e) {
          if (this.agentsPanel === `files` && this.agentFilesList?.agentId !== e) {
            this.loadAgentFiles(e);
            return;
          }
          if (this.agentsPanel === `skills` && this.agentSkillsAgentId !== e) {
            un(this, e);
            return;
          }
          if (this.agentsPanel === `tools`) {
            (this.toolsCatalogResult?.agentId !== e && !this.toolsCatalogLoading && Qe(this, e),
              this.loadEffectiveToolsForAgent(e));
            return;
          }
          if (this.agentsPanel === `channels` && !this.context.channels.state.channelsSnapshot) {
            this.context.channels.refresh(!1);
            return;
          }
          this.agentsPanel === `cron` &&
            !this.cron.cronLoading &&
            !this.cron.cronStatus &&
            this.refreshCron();
        }
      }
      async loadAgentsAndCommit() {
        let e = this.client,
          t = this.requestGeneration,
          n = this.context.agents;
        e &&
          (await n.ensureList(),
          this.isCurrentRequest(e, t, void 0, { agents: n }) &&
            (this.syncAgentState(n), this.ensureAgentIdentities(), this.loadActivePanelData()));
      }
      async loadAgentFiles(e, t = !1) {
        let n = this.client,
          r = this.context.agents;
        if (!n || !this.connected || this.agentFilesLoading) return;
        if (r.files(e).list && !t) {
          this.syncCurrentAgentFiles(r);
          return;
        }
        let i = this.requestGeneration;
        ((this.agentFilesLoading = !0), (this.agentFilesError = null));
        try {
          let a = t ? await r.refreshFiles(e) : await r.ensureFiles(e);
          if (!this.isCurrentRequest(n, i, e, { agents: r })) return;
          ((this.agentFilesList = a ?? r.files(e).list),
            (this.agentFilesError = r.files(e).error),
            this.agentFileActive &&
              !this.agentFilesList?.files.some((e) => e.name === this.agentFileActive) &&
              (this.agentFileActive = null));
        } finally {
          this.isCurrentRequest(n, i, e, { agents: r }) && (this.agentFilesLoading = !1);
        }
      }
      async refreshCron() {
        let e = this.cron;
        !e.connected ||
          !e.client ||
          (await Promise.all([le(e), ce(e, { tableFilters: !0 })]),
          this.cron === e && (this.cron = { ...e, cronJobs: [...e.cronJobs] }));
      }
      saveIdentityDraft() {
        let e = this.client,
          t = this.resolveSelectedAgentId();
        if (!e || !t || this.identitySaving) return;
        let n = this.requestGeneration,
          r = this.context.agents,
          i = this.context.agentIdentity;
        en({
          host: this,
          client: e,
          agentId: t,
          agents: r,
          agentIdentity: i,
          isCurrent: () => this.isCurrentRequest(e, n, t, { agents: r, agentIdentity: i }),
          onSaved: () => this.syncAgentState(r),
        });
      }
      resetSelectionState() {
        ((this.requestGeneration += 1),
          (this.agentFilesList = null),
          (this.agentFilesError = null),
          (this.agentFileActive = null),
          (this.agentFileContents = {}),
          (this.agentFileDrafts = {}),
          (this.agentFilesLoading = !1),
          (this.agentFileSaving = !1),
          (this.agentSkillsReport = null),
          (this.agentSkillsLoading = !1),
          (this.agentSkillsError = null),
          (this.agentSkillsAgentId = null),
          (this.agentIdentityLoading = !1),
          (this.agentIdentityError = null),
          Zt(this),
          (this.toolsCatalogResult = null),
          (this.toolsCatalogError = null),
          (this.toolsCatalogLoading = !1),
          (this.toolsCatalogLoadingAgentId = null),
          et(this));
      }
      findAgentIndex(e) {
        return Ze(E(this.context.runtimeConfig.state), e);
      }
      ensureAgentIndex(e) {
        return this.context.runtimeConfig.ensureAgentEntry(e);
      }
      toolsPath(e, t) {
        let n = t ? this.ensureAgentIndex(e) : this.findAgentIndex(e);
        return n >= 0 ? [`agents`, `list`, n, `tools`] : null;
      }
      loadEffectiveToolsForAgent(e) {
        if (e !== this.chatAgentId()) {
          et(this);
          return;
        }
        let t = $e(this, { agentId: e, sessionKey: this.sessionKey });
        (this.toolsEffectiveResultKey === t && !this.toolsEffectiveError) ||
          He(this, { agentId: e, sessionKey: this.sessionKey });
      }
      selectAgent(e) {
        this.agentsSelectedId !== e &&
          ((this.agentsSelectedId = e),
          this.resetSelectionState(),
          this.context.agentIdentity.ensure([e]),
          this.loadActivePanelData());
      }
      selectPanel(e) {
        ((this.agentsPanel = e), this.loadActivePanelData());
      }
      refreshAgents() {
        let e = this.client,
          t = this.requestGeneration,
          n = this.context.agents;
        e &&
          (async () => {
            (await n.refreshList(),
              this.isCurrentRequest(e, t, void 0, { agents: n }) &&
                (this.syncAgentState(n), this.loadActivePanelData()));
          })();
      }
      saveAgentConfig() {
        let e = this.client,
          t = this.requestGeneration,
          n = this.context.agents;
        if (!e) return;
        let r = this.agentsSelectedId;
        (async () => {
          (await this.context.runtimeConfig.save(),
            await n.refreshList(),
            this.isCurrentRequest(e, t, void 0, { agents: n }) &&
              (this.syncAgentState(n),
              r && this.agentsList?.agents.some((e) => e.id === r) && (this.agentsSelectedId = r),
              this.ensureAgentIdentities(),
              this.loadActivePanelData()));
        })();
      }
      saveSelectedAgentFile(e, t, n) {
        let r = this.client,
          i = this.requestGeneration,
          a = this.context.agents;
        r &&
          Ht(this, e, t, n).then(() => {
            this.isCurrentRequest(r, i, e, { agents: a }) && this.loadAgentFiles(e, !0);
          });
      }
      reloadConfig() {
        this.context.runtimeConfig.refresh({ discardPendingChanges: !0 });
      }
      runCronJobNow(e) {
        this.cron.cronJobs.some((t) => t.id === e) &&
          Ue(this.cron, e, `force`).finally(() => {
            this.cron = { ...this.cron, cronJobs: [...this.cron.cronJobs] };
          });
      }
      render() {
        let e = this.context.runtimeConfig.state,
          t = this.resolveSelectedAgentId(),
          n = E(e);
        return g`
      <section class="content-header">
        <div>
          <div class="page-title">${it(`agents`)}</div>
        </div>
      </section>
      ${vt(
        Bo({
          basePath: this.context.basePath,
          authToken: this.controlUiAuthToken(),
          loading: this.agentsLoading,
          error: this.agentsError,
          agentsList: this.agentsList,
          selectedAgentId: t,
          activePanel: this.agentsPanel,
          config: {
            form: n,
            loading: e.configLoading,
            saving: e.configSaving,
            dirty: e.configFormDirty,
          },
          channels: {
            snapshot: this.context.channels.state.channelsSnapshot,
            loading: this.context.channels.state.channelsLoading,
            error: this.context.channels.state.channelsError,
            lastSuccess: this.context.channels.state.channelsLastSuccess,
          },
          cron: {
            status: this.cron.cronStatus,
            jobs: this.cron.cronJobs,
            loading: this.cron.cronLoading,
            error: this.cron.cronError,
          },
          agentFiles: {
            list: this.agentFilesList,
            loading: this.agentFilesLoading,
            error: this.agentFilesError,
            active: this.agentFileActive,
            contents: this.agentFileContents,
            drafts: this.agentFileDrafts,
            saving: this.agentFileSaving,
          },
          agentIdentityLoading: this.agentIdentityLoading,
          agentIdentityError: this.agentIdentityError,
          agentIdentityById: this.agentIdentityById(),
          identityDraft: this.identityDraft,
          identitySaving: this.identitySaving,
          identityError: this.identityError,
          agentSkills: {
            report: this.agentSkillsReport,
            loading: this.agentSkillsLoading,
            error: this.agentSkillsError,
            agentId: this.agentSkillsAgentId,
            filter: this.skillsFilter,
          },
          toolsCatalog: {
            loading: this.toolsCatalogLoading,
            error: this.toolsCatalogError,
            result: this.toolsCatalogResult,
          },
          toolsEffective: {
            loading: this.toolsEffectiveLoading,
            error: this.toolsEffectiveError,
            result: this.toolsEffectiveResult,
          },
          runtimeSessionKey: this.sessionKey,
          runtimeSessionMatchesSelectedAgent: t === this.chatAgentId(),
          modelCatalog: this.chatModelCatalog,
          pinnedAgentIds: this.context.navigation.snapshot.pinnedAgentIds,
          onTogglePinnedAgent: (e) => tn(this.context.navigation, e),
          onRefresh: () => this.refreshAgents(),
          onSelectAgent: (e) => this.selectAgent(e),
          onSelectPanel: (e) => this.selectPanel(e),
          onLoadFiles: (e) => void this.loadAgentFiles(e, !0),
          onSelectFile: (e) => {
            ((this.agentFileActive = e), t && Vt(this, t, e));
          },
          onFileDraftChange: (e, t) => {
            this.agentFileDrafts = { ...this.agentFileDrafts, [e]: t };
          },
          onFileReset: (e) => {
            this.agentFileDrafts = {
              ...this.agentFileDrafts,
              [e]: this.agentFileContents[e] ?? ``,
            };
          },
          onFileSave: (e) => {
            t &&
              this.saveSelectedAgentFile(
                t,
                e,
                this.agentFileDrafts[e] ?? this.agentFileContents[e] ?? ``,
              );
          },
          onToolsProfileChange: (e, t, n) => {
            let r = this.toolsPath(e, !!(t || n));
            r &&
              (t
                ? this.context.runtimeConfig.patchForm([...r, `profile`], t)
                : this.context.runtimeConfig.removeFormValue([...r, `profile`]),
              n && this.context.runtimeConfig.removeFormValue([...r, `allow`]));
          },
          onToolsOverridesChange: (e, t, n) => {
            let r = this.toolsPath(e, t.length > 0 || n.length > 0);
            r &&
              (t.length
                ? this.context.runtimeConfig.patchForm([...r, `alsoAllow`], t)
                : this.context.runtimeConfig.removeFormValue([...r, `alsoAllow`]),
              n.length
                ? this.context.runtimeConfig.patchForm([...r, `deny`], n)
                : this.context.runtimeConfig.removeFormValue([...r, `deny`]));
          },
          onConfigReload: () => this.reloadConfig(),
          onConfigSave: () => this.saveAgentConfig(),
          onIdentityFieldChange: (e, t) => Qt(this, e, t),
          onIdentityAvatarSelect: (e) => $t(this, e),
          onIdentitySave: () => this.saveIdentityDraft(),
          onChannelsRefresh: () => void this.context.channels.refresh(!1),
          onCronRefresh: () => void this.refreshCron(),
          onCronRunNow: (e) => this.runCronJobNow(e),
          onSkillsFilterChange: (e) => (this.skillsFilter = e),
          onSkillsRefresh: () => {
            t && un(this, t);
          },
          onAgentSkillToggle: (t, n, r) => {
            let i = this.ensureAgentIndex(t);
            if (i < 0 || !n.trim()) return;
            let a = E(e)?.agents?.list,
              o = Array.isArray(a) ? a[i] : void 0,
              s = Array.isArray(o?.skills)
                ? ne(o.skills)
                : (this.agentSkillsReport?.skills?.map((e) => e.name).filter(Boolean) ?? []),
              c = new Set(s);
            (r ? c.add(n.trim()) : c.delete(n.trim()),
              this.context.runtimeConfig.patchForm([`agents`, `list`, i, `skills`], [...c]));
          },
          onAgentSkillsClear: (e) => {
            let t = this.findAgentIndex(e);
            t >= 0 && this.context.runtimeConfig.removeFormValue([`agents`, `list`, t, `skills`]);
          },
          onAgentSkillsDisableAll: (e) => {
            let t = this.ensureAgentIndex(e);
            t >= 0 && this.context.runtimeConfig.patchForm([`agents`, `list`, t, `skills`], []);
          },
          onModelChange: (e, t) => {
            (sn(this.context.runtimeConfig, e, t), qe(this));
          },
          onModelFallbacksChange: (e, t) => cn(this.context.runtimeConfig, e, t),
          onSetDefault: (e) => {
            (async () => {
              (await this.context.runtimeConfig.ensureLoaded(),
                await Me(this.context.runtimeConfig, e, () => this.context.agents.refreshList()));
            })();
          },
        }),
      )}
    `;
      }
    }),
    r([l({ context: rt, subscribe: !0 })], $.prototype, `context`, void 0),
    r([m({ attribute: !1 })], $.prototype, `routeData`, void 0),
    r([p()], $.prototype, `client`, void 0),
    r([p()], $.prototype, `connected`, void 0),
    r([p()], $.prototype, `agentsLoading`, void 0),
    r([p()], $.prototype, `agentsError`, void 0),
    r([p()], $.prototype, `agentsList`, void 0),
    r([p()], $.prototype, `agentsSelectedId`, void 0),
    r([p()], $.prototype, `agentsPanel`, void 0),
    r([p()], $.prototype, `toolsCatalogLoading`, void 0),
    r([p()], $.prototype, `toolsCatalogLoadingAgentId`, void 0),
    r([p()], $.prototype, `toolsCatalogError`, void 0),
    r([p()], $.prototype, `toolsCatalogResult`, void 0),
    r([p()], $.prototype, `toolsEffectiveLoading`, void 0),
    r([p()], $.prototype, `toolsEffectiveLoadingKey`, void 0),
    r([p()], $.prototype, `toolsEffectiveResultKey`, void 0),
    r([p()], $.prototype, `toolsEffectiveError`, void 0),
    r([p()], $.prototype, `toolsEffectiveResult`, void 0),
    r([p()], $.prototype, `chatModelCatalog`, void 0),
    r([p()], $.prototype, `agentFilesLoading`, void 0),
    r([p()], $.prototype, `agentFilesError`, void 0),
    r([p()], $.prototype, `agentFilesList`, void 0),
    r([p()], $.prototype, `agentFileContents`, void 0),
    r([p()], $.prototype, `agentFileDrafts`, void 0),
    r([p()], $.prototype, `agentFileActive`, void 0),
    r([p()], $.prototype, `agentFileSaving`, void 0),
    r([p()], $.prototype, `agentIdentityLoading`, void 0),
    r([p()], $.prototype, `agentIdentityError`, void 0),
    r([p()], $.prototype, `identityDraft`, void 0),
    r([p()], $.prototype, `identitySaving`, void 0),
    r([p()], $.prototype, `identityError`, void 0),
    r([p()], $.prototype, `agentSkillsLoading`, void 0),
    r([p()], $.prototype, `agentSkillsError`, void 0),
    r([p()], $.prototype, `agentSkillsReport`, void 0),
    r([p()], $.prototype, `agentSkillsAgentId`, void 0),
    r([p()], $.prototype, `skillsFilter`, void 0),
    r([p()], $.prototype, `cron`, void 0),
    customElements.get(`openclaw-agents-page`) || customElements.define(`openclaw-agents-page`, $));
})();
//# sourceMappingURL=agents-page-DqVCE1hv.js.map
