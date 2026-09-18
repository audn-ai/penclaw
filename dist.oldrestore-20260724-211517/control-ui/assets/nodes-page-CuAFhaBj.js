import {
  K as Ee,
  M as De,
  P as Oe,
  dt as ke,
  nt as Ae,
  q as je,
} from "./control-ui-core--EZfp09c.js";
import {
  Aa as ne,
  Ba as re,
  Ca as y,
  Da as b,
  Ea as ie,
  Fa as ae,
  Hi as oe,
  Ia as se,
  J as ce,
  K as le,
  La as ue,
  Ma as de,
  Na as fe,
  Pa as pe,
  Sa as me,
  Ta as x,
  Ui as he,
  Wa as S,
  Wi as C,
  Yi as w,
  da as ge,
  di as _e,
  ea as T,
  fi as ve,
  ja as ye,
  la as be,
  li as xe,
  ui as Se,
  va as Ce,
  xa as we,
  ya as Te,
} from "./control-ui-core-BcbHa4vB.js";
import { $ as O, Q as k, x as Me } from "./control-ui-core-CQDTaMS5.js";
import { o as E, t as D } from "./control-ui-core-CwQmiouz.js";
import { dt as s, ft as c } from "./control-ui-foundation-0uuDj0X3.js";
import {
  T as t,
  _ as n,
  d as r,
  g as i,
  u as a,
  w as o,
} from "./control-ui-foundation-CCDffryi.js";
import {
  Y as h,
  gt as ee,
  mt as g,
  pt as _,
  q as te,
  tt as v,
} from "./control-ui-foundation-s2wA1PVE.js";
import { G as l, Y as u, Z as d, at as f, et as p, nt as m } from "./lit-runtime-DkvDG939.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
import {
  a as Fe,
  c as Ie,
  f as Le,
  l as A,
  n as Re,
  o as j,
  s as M,
  t as N,
  u as ze,
} from "./settings-ui-T0X7dZpU.js";
import { n as Ne, t as Pe } from "./settings-workspace-DRQpceJK.js";
var Be = e(() => {});
function P(e) {
  let t = e?.agents ?? {},
    n = Array.isArray(t.list) ? t.list : [],
    r = [];
  return (
    n.forEach((e, t) => {
      if (!e || typeof e != `object`) return;
      let n = e,
        i = v(n.id) ?? ``;
      if (!i) return;
      let a = v(n.name),
        o = n.default === !0;
      r.push({ id: i, name: a, isDefault: o, index: t, record: n });
    }),
    r
  );
}
function F(e, t) {
  let n = new Set(t),
    r = [];
  for (let t of e) {
    if (!(Array.isArray(t.commands) ? t.commands : []).some((e) => n.has(String(e)))) continue;
    let e = v(t.nodeId) ?? ``;
    if (!e) continue;
    let i = v(t.displayName) ?? e;
    r.push({ id: e, label: i === e ? e : `${i} · ${e}` });
  }
  return (r.sort((e, t) => e.label.localeCompare(t.label)), r);
}
function I(e) {
  let t = e.platform?.trim().toLowerCase() ?? ``,
    n = e.clientId?.trim().toLowerCase() ?? ``,
    r = e.clientMode?.trim().toLowerCase() ?? ``;
  return Ue.test(t) || n === _.WATCHOS_APP
    ? He
    : We.test(t)
      ? Ve
      : Ge.test(t) || R.has(n)
        ? k.smartphone
        : z.has(n) || r === g.WEBCHAT
          ? k.globe
          : B.has(r) || V.has(n)
            ? k.terminal
            : k.monitor;
}
function L(e) {
  return f`
    <div class="nodes-entry__tile" aria-hidden="true">
      <span class="nodes-entry__tile-icon">${e}</span>
    </div>
  `;
}
var Ve,
  He,
  Ue,
  We,
  Ge,
  R,
  z,
  B,
  V,
  H = e(() => {
    (p(),
      ee(),
      O(),
      S(),
      (Ve = f`
  <svg viewBox="0 0 24 24">
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M12 18h.01" />
  </svg>
`),
      (He = f`
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="6" />
    <polyline points="12 10 12 12 13 13" />
    <path d="m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05" />
    <path d="m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05" />
  </svg>
`),
      (Ue = /\bwatchos\b/),
      (We = /\b(ipados|ipad)\b/),
      (Ge = /\b(ios|android|iphone)\b/),
      (R = new Set([_.IOS_APP, _.ANDROID_APP])),
      (z = new Set([_.CONTROL_UI, _.WEBCHAT_UI, _.WEBCHAT])),
      (B = new Set([g.CLI, g.BACKEND, g.PROBE, g.TEST])),
      (V = new Set([_.CLI, _.TUI])));
  });
function U(e) {
  return e === `allowlist` || e === `full` || e === `deny` ? e : `deny`;
}
function Ke(e) {
  return e === `always` || e === `off` || e === `on-miss` ? e : `on-miss`;
}
function qe(e) {
  let t = e?.defaults ?? {};
  return {
    security: U(t.security),
    ask: Ke(t.ask),
    askFallback: U(t.askFallback ?? `deny`),
    autoAllowSkills: t.autoAllowSkills ?? !1,
  };
}
function Je(e) {
  return P(e).map((e) => ({ id: e.id, name: e.name, isDefault: e.isDefault }));
}
function Ye(e, t) {
  let n = Je(e),
    r = Object.keys(t?.agents ?? {}),
    i = new Map();
  (n.forEach((e) => i.set(e.id, e)),
    r.forEach((e) => {
      i.has(e) || i.set(e, { id: e });
    }));
  let a = Array.from(i.values());
  return (
    a.length === 0 && a.push({ id: `main`, isDefault: !0 }),
    a.sort((e, t) => {
      if (e.isDefault && !t.isDefault) return -1;
      if (!e.isDefault && t.isDefault) return 1;
      let n = e.name?.trim() ? e.name : e.id,
        r = t.name?.trim() ? t.name : t.id;
      return n.localeCompare(r);
    }),
    a
  );
}
function Xe(e, t) {
  return e === G ? G : e && t.some((t) => t.id === e) ? e : G;
}
function Ze(e) {
  let t = e.execApprovalsSnapshot,
    n = y(t) ? t : null,
    r = t && !y(t) ? t : null,
    i = n ? null : (e.execApprovalsForm ?? r?.file ?? null),
    a = !!(i || n),
    o = qe(i),
    s = Ye(e.configForm, i),
    c = at(e.nodes),
    l = e.execApprovalsTarget,
    u = l === `node` && e.execApprovalsTargetNodeId ? e.execApprovalsTargetNodeId : null;
  l === `node` && u && !c.some((e) => e.id === u) && (u = null);
  let d = Xe(e.execApprovalsSelectedAgent, s),
    f = d === G ? null : ((i?.agents ?? {})[d] ?? null),
    p = Array.isArray(f?.allowlist) ? (f.allowlist ?? []) : [];
  return {
    ready: a,
    disabled: e.execApprovalsSaving || e.execApprovalsLoading,
    dirty: e.execApprovalsDirty,
    loading: e.execApprovalsLoading,
    saving: e.execApprovalsSaving,
    form: i,
    nativePolicy: n,
    defaults: o,
    selectedScope: d,
    selectedAgent: f,
    agents: s,
    allowlist: p,
    target: l,
    targetNodeId: u,
    targetNodes: c,
    onSelectScope: e.onExecApprovalsSelectAgent,
    onSelectTarget: e.onExecApprovalsTargetChange,
    onPatch: e.onExecApprovalsPatch,
    onRemove: e.onExecApprovalsRemove,
    onLoad: e.onLoadExecApprovals,
    onSave: e.onSaveExecApprovals,
  };
}
function Qe(e) {
  let t = e.ready,
    n = e.target !== `node` || !!e.targetNodeId,
    r = f`
    <button
      class="btn"
      ?disabled=${e.disabled || !e.dirty || !n || !!e.nativePolicy}
      @click=${e.onSave}
    >
      ${e.saving ? E(`common.saving`) : E(`common.save`)}
    </button>
  `,
    i = f`
    ${et(e)}
    ${
      t
        ? e.nativePolicy
          ? $e(e.nativePolicy)
          : f`${tt(e)} ${nt(e)}`
        : j({
            title: E(`nodes.execApprovals.loadHint`),
            control: f`
            <button class="btn" ?disabled=${e.loading || !n} @click=${e.onLoad}>
              ${e.loading ? E(`common.loading`) : E(`common.loadApprovals`)}
            </button>
          `,
          })
    }
  `;
  return f`
    ${M(
      {
        title: E(`nodes.execApprovals.title`),
        description: f`
          ${E(`nodes.execApprovals.subtitlePrefix`)}
          <span class="mono">exec host=gateway/node</span>.
        `,
        actions: r,
      },
      i,
    )}
    ${t && !e.nativePolicy && e.selectedScope !== G ? rt(e) : m}
  `;
}
function $e(e) {
  let t = e.enabled && Array.isArray(e.rules) ? e.rules : [],
    n = e.enabled ? e.defaultAction : (e.message ?? `unavailable`);
  return f`
    ${j({ title: E(`nodes.execApprovals.hostNativePolicy`), description: E(`nodes.execApprovals.hostNativeHint`), control: Le(E(`nodes.execApprovals.native`)) })}
    ${j({ title: E(`nodes.execApprovals.defaultAction`), description: n, control: Le(E(t.length === 1 ? `nodes.execApprovals.rule` : `nodes.execApprovals.rules`, { count: String(t.length) })) })}
    ${t.map((e) =>
      j({
        title: e.pattern,
        description: f`
          ${e.action} · ${e.shells?.join(`, `) || E(`nodes.execApprovals.allShells`)} ·
          ${e.enabled === !1 ? E(`nodes.execApprovals.off`) : E(`nodes.execApprovals.on`)}
          ${e.description ? f`<br />${C(e.description, 120)}` : m}
        `,
      }),
    )}
  `;
}
function et(e) {
  let t = e.targetNodes.length > 0,
    n = e.targetNodeId ?? ``;
  return f`
    ${j({
      title: E(`nodes.execApprovals.target`),
      description: E(`nodes.execApprovals.targetHint`),
      control: f`
        <select
          class="settings-select"
          aria-label=${E(`nodes.execApprovals.host`)}
          ?disabled=${e.disabled}
          @change=${(t) => {
            if (t.target.value === `node`) {
              let t = e.targetNodes[0]?.id ?? null;
              e.onSelectTarget(`node`, n || t);
            } else e.onSelectTarget(`gateway`, null);
          }}
        >
          <option value="gateway" ?selected=${e.target === `gateway`}>
            ${E(`nodes.execApprovals.gateway`)}
          </option>
          <option value="node" ?selected=${e.target === `node`}>
            ${E(`nodes.execApprovals.node`)}
          </option>
        </select>
      `,
    })}
    ${
      e.target === `node`
        ? j({
            title: E(`nodes.execApprovals.node`),
            description: t ? void 0 : E(`nodes.execApprovals.noNodes`),
            control: f`
            <select
              class="settings-select"
              aria-label=${E(`nodes.execApprovals.node`)}
              ?disabled=${e.disabled || !t}
              @change=${(t) => {
                let n = t.target.value.trim();
                e.onSelectTarget(`node`, n || null);
              }}
            >
              <option value="" ?selected=${n === ``}>
                ${E(`nodes.execApprovals.selectNode`)}
              </option>
              ${e.targetNodes.map(
                (e) => f`<option value=${e.id} ?selected=${n === e.id}>
                    ${e.label}
                  </option>`,
              )}
            </select>
          `,
          })
        : m
    }
  `;
}
function tt(e) {
  let t = [
    { value: G, label: E(`nodes.execApprovals.defaults`) },
    ...e.agents.map((e) => ({ value: e.id, label: e.name?.trim() ? `${e.name} (${e.id})` : e.id })),
  ];
  return j({
    title: E(`nodes.execApprovals.scope`),
    stacked: !0,
    control: Ie({ value: e.selectedScope, options: t, onChange: (t) => e.onSelectScope(t) }),
  });
}
function W(e, t) {
  return f`
    <select
      class="settings-select"
      aria-label=${t.ariaLabel}
      ?disabled=${e.disabled}
      @change=${(n) => {
        let r = n.target.value;
        !t.isDefaults && r === `__default__`
          ? e.onRemove([...t.basePath, t.key])
          : e.onPatch([...t.basePath, t.key], r);
      }}
    >
      ${
        t.isDefaults
          ? m
          : f`<option value="__default__" ?selected=${t.currentValue === `__default__`}>
            ${E(`nodes.execApprovals.useDefaultValue`, { value: t.defaultValue })}
          </option>`
      }
      ${t.values.map(
        (e) => f`<option value=${e.value} ?selected=${t.currentValue === e.value}>
            ${E(e.labelKey)}
          </option>`,
      )}
    </select>
  `;
}
function nt(e) {
  let t = e.selectedScope === G,
    n = e.defaults,
    r = e.selectedAgent ?? {},
    i = t ? [`defaults`] : [`agents`, e.selectedScope],
    a = typeof r.security == `string` ? r.security : void 0,
    o = typeof r.ask == `string` ? r.ask : void 0,
    s = typeof r.askFallback == `string` ? r.askFallback : void 0,
    c = t ? n.security : (a ?? `__default__`),
    l = t ? n.ask : (o ?? `__default__`),
    u = t ? n.askFallback : (s ?? `__default__`),
    d = typeof r.autoAllowSkills == `boolean` ? r.autoAllowSkills : void 0,
    p = d ?? n.autoAllowSkills,
    h = d == null;
  return f`
    ${j({ title: E(`nodes.execApprovals.security`), description: t ? E(`nodes.execApprovals.defaultSecurity`) : E(`nodes.execApprovals.defaultValue`, { value: n.security }), control: W(e, { key: `security`, ariaLabel: E(`nodes.execApprovals.mode`), values: K, currentValue: c, defaultValue: n.security, isDefaults: t, basePath: i }) })}
    ${j({ title: E(`nodes.execApprovals.ask`), description: t ? E(`nodes.execApprovals.defaultPrompt`) : E(`nodes.execApprovals.defaultValue`, { value: n.ask }), control: W(e, { key: `ask`, ariaLabel: E(`nodes.execApprovals.mode`), values: ot, currentValue: l, defaultValue: n.ask, isDefaults: t, basePath: i }) })}
    ${j({ title: E(`nodes.execApprovals.askFallback`), description: t ? E(`nodes.execApprovals.promptUnavailable`) : E(`nodes.execApprovals.defaultValue`, { value: n.askFallback }), control: W(e, { key: `askFallback`, ariaLabel: E(`nodes.execApprovals.fallback`), values: K, currentValue: u, defaultValue: n.askFallback, isDefaults: t, basePath: i }) })}
    ${j({
      title: E(`nodes.execApprovals.autoAllowSkills`),
      description: t
        ? E(`nodes.execApprovals.autoAllowSkillsHint`)
        : h
          ? E(`nodes.execApprovals.usingDefault`, {
              value: n.autoAllowSkills ? E(`nodes.execApprovals.on`) : E(`nodes.execApprovals.off`),
            })
          : E(`nodes.execApprovals.override`, {
              value: E(p ? `nodes.execApprovals.on` : `nodes.execApprovals.off`),
            }),
      control: f`
        ${
          !t && !h
            ? f`<button
              class="btn btn--sm"
              ?disabled=${e.disabled}
              @click=${() => e.onRemove([...i, `autoAllowSkills`])}
            >
              ${E(`nodes.execApprovals.useDefault`)}
            </button>`
            : m
        }
        ${ze({ checked: p, disabled: e.disabled, ariaLabel: E(`nodes.execApprovals.autoAllowSkills`), onChange: (t) => e.onPatch([...i, `autoAllowSkills`], t) })}
      `,
    })}
  `;
}
function rt(e) {
  let t = [`agents`, e.selectedScope, `allowlist`],
    n = e.allowlist;
  return M(
    {
      title: E(`nodes.execApprovals.allowlist`),
      description: E(`nodes.execApprovals.allowlistHint`),
      actions: f`
        <button
          class="btn btn--sm"
          ?disabled=${e.disabled}
          @click=${() => {
            let r = [...n, { pattern: `` }];
            e.onPatch(t, r);
          }}
        >
          ${E(`nodes.execApprovals.addPattern`)}
        </button>
      `,
    },
    n.length === 0 ? Re(E(`nodes.execApprovals.emptyAllowlist`)) : n.map((t, n) => it(e, t, n)),
  );
}
function it(e, t, n) {
  let r = t.lastUsedAt ? a(t.lastUsedAt) : E(`common.never`),
    i = t.lastUsedCommand ? C(t.lastUsedCommand, 120) : null,
    o = t.lastResolvedPath ? C(t.lastResolvedPath, 120) : null;
  return j({
    title: t.pattern?.trim() ? t.pattern : E(`nodes.execApprovals.newPattern`),
    description: f`
      ${E(`nodes.execApprovals.lastUsed`, { time: r })}
      ${i ? f`<br /><span class="mono">${i}</span>` : m}
      ${o ? f`<br /><span class="mono">${o}</span>` : m}
    `,
    control: f`
      <input
        class="settings-input"
        type="text"
        aria-label=${E(`nodes.execApprovals.pattern`)}
        .value=${t.pattern ?? ``}
        ?disabled=${e.disabled}
        @input=${(t) => {
          let r = t.target;
          e.onPatch([`agents`, e.selectedScope, `allowlist`, n, `pattern`], r.value);
        }}
      />
      <button
        class="btn btn--sm danger"
        ?disabled=${e.disabled}
        @click=${() => {
          if (e.allowlist.length <= 1) {
            e.onRemove([`agents`, e.selectedScope, `allowlist`]);
            return;
          }
          e.onRemove([`agents`, e.selectedScope, `allowlist`, n]);
        }}
      >
        ${E(`nodes.execApprovals.remove`)}
      </button>
    `,
  });
}
function at(e) {
  return F(e, [`system.execApprovals.get`, `system.execApprovals.set`]);
}
var G,
  K,
  ot,
  st = e(() => {
    (p(),
      N(),
      D(),
      T(),
      me(),
      H(),
      (G = `__defaults__`),
      (K = [
        { value: `deny`, labelKey: `nodes.execApprovals.options.deny` },
        { value: `allowlist`, labelKey: `nodes.execApprovals.options.allowlist` },
        { value: `full`, labelKey: `nodes.execApprovals.options.full` },
      ]),
      (ot = [
        { value: `off`, labelKey: `nodes.execApprovals.options.off` },
        { value: `on-miss`, labelKey: `nodes.execApprovals.options.onMiss` },
        { value: `always`, labelKey: `nodes.execApprovals.options.always` },
      ]));
  });
function q(e) {
  return typeof e == `number` && Number.isFinite(e) ? e : void 0;
}
function J(e) {
  return Array.isArray(e) ? e.map((e) => v(e)).filter((e) => e !== void 0) : [];
}
function ct(e) {
  let t = v(e.nodeId);
  if (!t) return null;
  let n = v(e.approvalState);
  return {
    nodeId: t,
    displayName: v(e.displayName),
    platform: v(e.platform),
    version: v(e.version),
    coreVersion: v(e.coreVersion),
    uiVersion: v(e.uiVersion),
    modelIdentifier: v(e.modelIdentifier),
    clientId: v(e.clientId),
    clientMode: v(e.clientMode),
    remoteIp: v(e.remoteIp),
    caps: J(e.caps),
    commands: J(e.commands),
    approvalState: n && bt.has(n) ? n : void 0,
    pendingRequestId: v(e.pendingRequestId),
    connected: e.connected === !0,
    paired: e.paired === !0,
    connectedAtMs: q(e.connectedAtMs),
    lastSeenAtMs: q(e.lastSeenAtMs),
    approvedAtMs: q(e.approvedAtMs),
  };
}
function lt(e) {
  let t = new Set();
  for (let n of [...(e.roles ?? []), e.role]) {
    let e = v(n);
    e && t.add(e);
  }
  return [...t];
}
function ut(...e) {
  let t;
  for (let n of e) n !== void 0 && (t === void 0 || n > t) && (t = n);
  return t;
}
function dt(e, t, n, r) {
  let i = t ? lt(t) : [];
  n?.paired && !i.includes(`node`) && i.push(`node`);
  let a = v(t?.operatorLabel),
    o = v(t?.displayName) ?? v(n?.displayName),
    s = v(t?.clientId) ?? n?.clientId;
  return {
    id: e,
    name: a ?? o ?? s ?? e,
    displayName: o,
    clientId: s,
    clientMode: v(t?.clientMode) ?? n?.clientMode,
    platform: v(r?.platform) ?? v(t?.platform) ?? n?.platform,
    version: v(r?.version) ?? n?.version,
    modelIdentifier: v(r?.modelIdentifier) ?? n?.modelIdentifier,
    remoteIp: v(t?.remoteIp) ?? n?.remoteIp,
    roles: i,
    scopes: J(t?.scopes),
    connected: n?.connected === !0 || t?.connected === !0,
    autoApproved:
      t?.approvedVia === `silent` ||
      t?.approvedVia === `trusted-cidr` ||
      t?.approvedVia === `ssh-verified`,
    lastSeenAtMs: ut(t?.lastSeenAtMs, n?.lastSeenAtMs, n?.connectedAtMs, q(r?.ts)),
    approvedAtMs: ut(t?.approvedAtMs, n?.approvedAtMs),
    presence: r,
    device: t,
    node: n,
  };
}
function ft(e) {
  let t = e.displayName?.trim().toLowerCase();
  if (t) return `name:${t}`;
  let n = e.clientId?.trim().toLowerCase(),
    r = e.clientMode?.trim().toLowerCase();
  return n || r ? `client:${n ?? ``}:${r ?? ``}` : `id:${e.id}`;
}
function Y(e) {
  return e.lastSeenAtMs ?? e.approvedAtMs ?? 0;
}
function pt(e, t) {
  if (e.connected !== t.connected) return e.connected ? -1 : 1;
  let n = Y(t) - Y(e);
  return n === 0 ? e.id.localeCompare(t.id) : n;
}
function mt(e, t) {
  let n = pt(e.primary, t.primary);
  return n === 0 ? e.name.localeCompare(t.name) : n;
}
function ht(e) {
  let t = new Map();
  for (let n of e.nodes) {
    let e = ct(n);
    e && t.set(e.nodeId, e);
  }
  let n = new Map();
  for (let t of e.presence ?? [])
    for (let e of [t.deviceId, t.instanceId]) {
      let r = v(e)?.toLowerCase();
      r && n.set(r, t);
    }
  let r = [],
    i = new Set();
  for (let a of e.paired) {
    let e = v(a.deviceId);
    !e || i.has(e) || (i.add(e), r.push(dt(e, a, t.get(e), n.get(e.toLowerCase()))));
  }
  for (let [e, a] of t) i.has(e) || r.push(dt(e, void 0, a, n.get(e.toLowerCase())));
  let a = new Map();
  for (let e of r) {
    let t = ft(e),
      n = a.get(t);
    n ? n.push(e) : a.set(t, [e]);
  }
  let o = [];
  for (let [e, t] of a) {
    let n = t.toSorted(pt),
      r = n[0];
    r && o.push({ key: e, name: r.name, primary: r, duplicates: n.slice(1) });
  }
  return o.toSorted(mt);
}
function gt(e) {
  return e.flatMap((e) =>
    e.duplicates.filter(
      (e) =>
        !e.connected &&
        (e.autoApproved || (e.device !== void 0 && e.device.approvedVia === void 0)),
    ),
  );
}
function _t(e) {
  return e.find((e) => v(e.mode)?.toLowerCase() === `gateway`);
}
function vt(e, t) {
  let n = new Set();
  for (let e of t) for (let t of [e.primary, ...e.duplicates]) n.add(t.id.toLowerCase());
  return e.filter((e) => {
    if (v(e.mode)?.toLowerCase() === `gateway` || v(e.reason)?.toLowerCase() === `disconnect`)
      return !1;
    let t = [e.deviceId, e.instanceId].map((e) => v(e)?.toLowerCase()).filter((e) => e !== void 0);
    return t.length === 0 && !v(e.host) && !v(e.mode) ? !1 : !t.some((e) => n.has(e));
  });
}
function yt(e) {
  let t = e.roles.includes(`node`),
    n = e.roles.filter((e) => e !== `node`);
  return {
    removeNode: t || e.node?.paired === !0,
    removeDevice: !!e.device && (n.length > 0 || e.roles.length === 0),
  };
}
var bt,
  xt = e(() => {
    (S(), (bt = new Set([`approved`, `pending-approval`, `pending-reapproval`, `unapproved`])));
  });
function X(...e) {
  let t = new Set();
  for (let n of e) for (let e of h(n)) t.add(e);
  return [...t].toSorted();
}
function St(e, t) {
  let n = new Set(e);
  return t.every((e) => n.has(e));
}
function Ct(e) {
  return { roles: X(e.roles, e.role), scopes: t(e.scopes) };
}
function wt(e) {
  let n = X(e.roles, e.role),
    r = Array.isArray(e.tokens) ? e.tokens : e.tokens ? Object.values(e.tokens) : void 0;
  return {
    roles:
      r === void 0
        ? n
        : X(r.filter((e) => !e.revokedAtMs).flatMap((e) => e.role ?? [])).filter((e) =>
            n.includes(e),
          ),
    scopes: t(e.scopes),
  };
}
function Tt(e, t) {
  let n = Ct(e),
    r = t ? wt(t) : null;
  return r
    ? St(r.roles, n.roles)
      ? St(r.scopes, n.scopes)
        ? { kind: `re-approval`, requested: n, approved: r }
        : { kind: `scope-upgrade`, requested: n, approved: r }
      : { kind: `role-upgrade`, requested: n, approved: r }
    : { kind: `new-pairing`, requested: n, approved: null };
}
var Et = e(() => {
  (te(), o());
});
function Dt(e, t, n) {
  let r = new Map(t.map((e) => [v(e.deviceId), e]).filter((e) => !!e[0]));
  return e.map((e) => jt(e, n, Ot(r, e)));
}
function Ot(e, t) {
  let n = v(t.deviceId);
  if (!n) return;
  let r = e.get(n);
  if (!r) return;
  let i = v(t.publicKey),
    a = v(r.publicKey);
  if (!(i && a && i !== a)) return r;
}
function kt(e) {
  return e
    ? E(`nodes.inventory.rolesAndScopes`, { roles: w(e.roles), scopes: w(e.scopes) })
    : E(`nodes.inventory.none`);
}
function At(e) {
  switch (e) {
    case `scope-upgrade`:
      return E(`nodes.inventory.scopeUpgrade`);
    case `role-upgrade`:
      return E(`nodes.inventory.roleUpgrade`);
    case `re-approval`:
      return E(`nodes.inventory.reapproval`);
    case `new-pairing`:
      return E(`nodes.inventory.newPairing`);
  }
  throw Error(`unsupported pending approval kind`);
}
function jt(e, t, n) {
  let r = v(e.displayName) || e.deviceId,
    i = typeof e.ts == `number` ? a(e.ts) : E(`common.na`),
    o = Tt(e, n),
    s = e.isRepair ? ` · ${E(`nodes.inventory.repair`)}` : ``,
    c = e.remoteIp ? ` · ${e.remoteIp}` : ``;
  return f`
    <div class="settings-row nodes-entry">
      ${L(k.monitorSmartphone)}
      <div class="settings-row__text">
        <span class="settings-row__title">${r}</span>
        <span class="settings-row__desc">${e.deviceId}${c}</span>
        <span class="settings-row__desc">
          ${E(`nodes.inventory.requestedAt`, { note: At(o.kind), time: i })}${s}
        </span>
        <span class="settings-row__desc">
          ${E(`nodes.inventory.requestedAccess`, { access: kt(o.requested) })}
        </span>
        ${
          o.approved
            ? f`
              <span class="settings-row__desc">
                ${E(`nodes.inventory.approvedAccess`, { access: kt(o.approved) })}
              </span>
            `
            : m
        }
      </div>
      <div class="settings-row__control">
        <button class="btn btn--sm" @click=${() => t.onDeviceApprove(e.requestId)}>
          ${E(`nodes.inventory.approve`)}
        </button>
        <button class="btn btn--sm" @click=${() => t.onDeviceReject(e.requestId)}>
          ${E(`nodes.inventory.reject`)}
        </button>
      </div>
    </div>
  `;
}
var Mt = e(() => {
  (p(), Et(), O(), D(), T(), S(), H());
});
function Nt(e) {
  let t = yt(e);
  return { id: e.id, name: e.name, ...t };
}
function Pt(e, t, n) {
  if (n && e.length === 0) return E(`common.loading`);
  let r = e.filter((e) => e.primary.connected).length,
    i = [E(`nodes.inventory.summaryConnected`, { connected: String(r), total: String(e.length) })];
  return (
    t > 0 && i.push(E(`nodes.inventory.summaryPending`, { count: String(t) })), i.join(` · `)
  );
}
function Ft(e) {
  let t = e.devicesList ?? { pending: [], paired: [] },
    n = Array.isArray(t.pending) ? t.pending : [],
    r = Array.isArray(t.paired) ? t.paired : [],
    i = ht({ paired: r, nodes: e.nodes, presence: e.presence }),
    a = _t(e.presence),
    o = vt(e.presence, i),
    s = gt(i),
    c = e.loading || e.devicesLoading,
    l = f`
    ${
      s.length > 0
        ? f`
          <button
            class="btn btn--sm danger"
            @click=${() => e.onInventoryCleanup(s.map(Nt))}
          >
            ${k.trash} ${E(`nodes.inventory.cleanupStale`, { count: String(s.length) })}
          </button>
        `
        : m
    }
    <button
      class="btn"
      title=${e.canPairDevice ? `` : E(`nodes.pairing.adminRequired`)}
      ?disabled=${!e.canPairDevice}
      @click=${e.onDevicePairSetupOpen}
    >
      ${k.plus} ${E(`nodes.pairing.button`)}
    </button>
  `,
    u = i.length === 0 && !a,
    d = f`
    ${a ? Jt(a) : m}
    ${u ? Re(E(c ? `common.loading` : `nodes.inventory.empty`)) : i.map((t) => Lt(t, e))}
  `;
  return f`
    ${e.devicesError ? f`<div class="callout danger">${e.devicesError}</div>` : m}
    ${e.lastError ? f`<div class="callout danger">${e.lastError}</div>` : m}
    ${n.length > 0 ? M({ title: E(`nodes.inventory.pendingApproval`), count: n.length }, Dt(n, r, e)) : m}
    ${M({ title: E(`nodes.inventory.title`), description: Pt(i, n.length, c), actions: l }, d)}
    ${
      o.length > 0
        ? M(
            { title: E(`nodes.inventory.connectedWithoutPairing`) },
            o.map((e) => Yt(e)),
          )
        : m
    }
    ${It(e)}
  `;
}
function It(e) {
  let t = e.inventoryRemovalPrompt;
  if (!t) return m;
  let n =
      t.kind === `entry`
        ? E(`nodes.inventory.removePromptTitle`, { name: t.entry.name })
        : E(
            t.entries.length === 1
              ? `nodes.inventory.removeStalePromptTitleOne`
              : `nodes.inventory.removeStalePromptTitle`,
            { count: String(t.entries.length) },
          ),
    r =
      t.kind === `entry`
        ? E(`nodes.inventory.removePromptBody`)
        : E(`nodes.inventory.removeStalePromptBody`);
  return f`
    <openclaw-modal-dialog
      label=${n}
      description=${r}
      @modal-cancel=${e.onInventoryRemovalCancel}
    >
      <div class="exec-approval-card">
        <div class="exec-approval-header">
          <div>
            <div class="exec-approval-title">${n}</div>
            <div class="exec-approval-sub">${r}</div>
          </div>
        </div>
        ${
          t.kind === `entry`
            ? f`<div class="exec-approval-command mono">
              ${E(`nodes.inventory.deviceId`, { id: t.entry.id })}
            </div>`
            : m
        }
        <div class="exec-approval-actions">
          <button class="btn danger" @click=${e.onInventoryRemovalConfirm}>
            ${E(`nodes.inventory.remove`)}
          </button>
          <button class="btn" autofocus @click=${e.onInventoryRemovalCancel}>
            ${E(`common.cancel`)}
          </button>
        </div>
      </div>
    </openclaw-modal-dialog>
  `;
}
function Lt(e, t) {
  return e.duplicates.length === 0
    ? Z(e.primary, t)
    : f`
    ${Z(e.primary, t)}
    <details class="nodes-group__dups">
      <summary>
        ${E(e.duplicates.length === 1 ? `nodes.inventory.olderPairing` : `nodes.inventory.olderPairings`, { count: String(e.duplicates.length), name: e.name })}
      </summary>
      ${e.duplicates.map((e) => Z(e, t))}
    </details>
  `;
}
function Rt(e) {
  let t = v(e)?.toLowerCase();
  return t === `win32` || t === `windows` || t?.startsWith(`windows `) === !0;
}
function zt(e) {
  let t = e.node;
  return t?.paired ? t.approvalState === void 0 || t.approvalState === `approved` : !1;
}
function Bt(e) {
  let t = v(e.node?.coreVersion);
  if (t) return t;
  if (v(e.node?.uiVersion)) return;
  let n = v(e.node?.platform)?.toLowerCase();
  return n === `darwin` || n === `linux` || n === `win32` || n === `windows`
    ? v(e.node?.version)
    : void 0;
}
function Vt(e, t) {
  let n = [],
    r = zt(e),
    i = Bt(e),
    a = v(t);
  if (r && i && a && i !== a) {
    let e = E(`nodes.inventory.versionDriftTitle`, { nodeVersion: i, gatewayVersion: a });
    n.push(f`<span title=${e}>
        ${A({ kind: `warn`, label: E(`nodes.inventory.versionDrift`) })}
      </span>`);
  }
  r &&
    !e.connected &&
    Rt(e.platform) &&
    n.push(f`<span title=${E(`nodes.inventory.manualWakeTitle`)}>
        ${A({ kind: `warn`, label: E(`nodes.inventory.manualWake`) })}
      </span>`);
  let o = e.node?.approvalState;
  return (
    (o === `pending-approval` || o === `pending-reapproval`) &&
      n.push(A({ kind: `warn`, label: E(`nodes.inventory.approvalNeeded`) })),
    n
  );
}
function Ht(e) {
  let [t = ``, ...n] = e.trim().split(/\s+/u),
    r = t === t.toLowerCase() ? `${t.charAt(0).toUpperCase()}${t.slice(1)}` : t;
  return [Zt[t.toLowerCase()] ?? r, ...n].join(` `);
}
function Ut(e) {
  return E(`nodes.inventory.inputAgo`, { time: r(e * 1e3, { suffix: !1 }) });
}
function Wt(e) {
  let t = [];
  (e.platform && t.push(Ht(e.platform)),
    e.modelIdentifier && t.push(e.modelIdentifier),
    e.version && t.push(e.version),
    e.connected && e.presence?.lastInputSeconds != null
      ? t.push(Ut(e.presence.lastInputSeconds))
      : !e.connected && e.lastSeenAtMs
        ? t.push(E(`nodes.inventory.seen`, { time: a(e.lastSeenAtMs) }))
        : !e.connected &&
          e.approvedAtMs &&
          t.push(E(`nodes.inventory.approved`, { time: a(e.approvedAtMs) })));
  for (let n of e.roles) t.push(n);
  return (e.autoApproved && t.push(E(`nodes.inventory.autoPaired`)), t.join(` · `));
}
function Gt(e, t) {
  if (t.length === 0) return m;
  let n = t.slice(0, Qt),
    r = t.length - n.length,
    i = r > 0 ? ` +${r}` : ``;
  return f`<div class="muted">${e}: ${w(n)}${i}</div>`;
}
function Kt(e, t) {
  let n = e.device?.tokens ?? [],
    r = e.node?.caps ?? [],
    i = e.node?.commands ?? [],
    a = e.scopes;
  return f`
    <details class="nodes-entry__details">
      <summary>${E(`nodes.inventory.details`)}</summary>
      <div class="muted">${E(`nodes.inventory.deviceId`, { id: e.id })}</div>
      ${e.remoteIp ? f`<div class="muted">${E(`nodes.inventory.remoteIp`, { ip: e.remoteIp })}</div>` : m}
      ${
        a.length > 0
          ? f`<div class="muted">
            ${E(`nodes.inventory.scopes`, { scopes: w(a) })}
          </div>`
          : m
      }
      ${
        n.length > 0
          ? f`
            <div class="muted">${E(`nodes.inventory.tokens`)}</div>
            ${n.map((n) => Xt(e.id, n, t))}
          `
          : m
      }
      ${Gt(E(`nodes.inventory.capabilities`), r)}
      ${Gt(E(`nodes.inventory.commands`), i)}
    </details>
  `;
}
function Z(e, t) {
  let n =
      e.node?.approvalState === `pending-approval` || e.node?.approvalState === `pending-reapproval`
        ? e.node.pendingRequestId
        : void 0,
    r = e.connected
      ? A({ kind: `ok`, label: E(`nodes.inventory.connected`) })
      : A({ kind: `muted`, label: E(`nodes.inventory.offline`) });
  return f`
    <div class="settings-row nodes-entry">
      ${L(I(e))}
      <div class="settings-row__text">
        <span class="settings-row__title">${e.name}</span>
        <span class="settings-row__desc">${Wt(e)}</span>
        ${Kt(e, t)}
      </div>
      <div class="settings-row__control">
        ${r} ${Vt(e, t.gatewayVersion)}
        ${
          n
            ? f`
              <button class="btn btn--sm" @click=${() => t.onNodeApprove(n)}>
                ${E(`nodes.inventory.approve`)}
              </button>
              <button class="btn btn--sm" @click=${() => t.onNodeReject(n)}>
                ${E(`nodes.inventory.reject`)}
              </button>
            `
            : m
        }
        <button
          class="btn btn--sm danger"
          aria-label=${E(`nodes.inventory.removeName`, { name: e.name })}
          title=${E(`nodes.inventory.remove`)}
          @click=${() => t.onInventoryRemove(Nt(e))}
        >
          ${k.x}
        </button>
      </div>
    </div>
  `;
}
function qt(e) {
  let t = [];
  return (
    e.platform && t.push(Ht(e.platform)),
    e.modelIdentifier && t.push(e.modelIdentifier),
    e.version && t.push(e.version),
    e.lastInputSeconds != null && t.push(Ut(e.lastInputSeconds)),
    t
  );
}
function Jt(e) {
  let t = qt(e);
  return f`
    <div class="settings-row nodes-entry">
      ${L(k.server)}
      <div class="settings-row__text">
        <span class="settings-row__title">${e.host ?? E(`nodes.execApprovals.gateway`)}</span>
        ${t.length > 0 ? f`<span class="settings-row__desc">${t.join(` · `)}</span>` : m}
      </div>
      <div class="settings-row__control">
        ${A({ kind: `ok`, label: E(`nodes.inventory.connected`) })}
        ${A({ kind: `accent`, label: E(`nodes.inventory.gateway`) })}
      </div>
    </div>
  `;
}
function Yt(e) {
  let t = Array.isArray(e.roles) ? e.roles.filter(Boolean) : [],
    n = [...qt(e), ...t];
  return f`
    <div class="settings-row nodes-entry">
      ${L(I({ clientMode: e.mode ?? void 0, platform: e.platform ?? void 0 }))}
      <div class="settings-row__text">
        <span class="settings-row__title">
          ${e.host ?? e.mode ?? E(`nodes.inventory.unknownClient`)}
        </span>
        ${n.length > 0 ? f`<span class="settings-row__desc">${n.join(` · `)}</span>` : m}
      </div>
      <div class="settings-row__control">
        ${A({ kind: `ok`, label: E(`nodes.inventory.connected`) })}
        ${A({ kind: `muted`, label: E(`nodes.inventory.unpaired`) })}
      </div>
    </div>
  `;
}
function Xt(e, t, n) {
  let r = t.revokedAtMs ? E(`nodes.inventory.revoked`) : E(`nodes.inventory.active`),
    i = E(`nodes.inventory.scopes`, { scopes: w(t.scopes) }),
    o = a(t.rotatedAtMs ?? t.createdAtMs ?? t.lastUsedAtMs ?? null);
  return f`
    <div class="nodes-entry__token">
      <span class="muted">${t.role} · ${r} · ${i} · ${o}</span>
      <span class="nodes-entry__token-actions">
        <button
          class="btn btn--sm"
          @click=${() => n.onDeviceRotate(e, t.role, t.scopes)}
        >
          ${E(`nodes.inventory.rotate`)}
        </button>
        ${
          t.revokedAtMs
            ? m
            : f`
              <button
                class="btn btn--sm danger"
                @click=${() => n.onDeviceRevoke(e, t.role)}
              >
                ${E(`nodes.inventory.revoke`)}
              </button>
            `
        }
      </span>
    </div>
  `;
}
var Zt,
  Qt,
  $t = e(() => {
    (p(),
      Me(),
      O(),
      N(),
      D(),
      T(),
      xt(),
      S(),
      Mt(),
      H(),
      (Zt = {
        macos: `macOS`,
        darwin: `macOS`,
        win32: `Windows`,
        windows: `Windows`,
        linux: `Linux`,
        ios: `iOS`,
        ipados: `iPadOS`,
        watchos: `watchOS`,
        android: `Android`,
        web: `Web`,
      }),
      (Qt = 16));
  });
function en(e) {
  let t = tn(e),
    n = Ze(e);
  return Fe(
    f`
      ${Ft(e)} ${Qe(n)}
      ${nn(t)}
    `,
    { wide: !0 },
  );
}
function tn(e) {
  let t = e.configForm,
    n = an(e.nodes),
    { defaultBinding: r, agents: i } = on(t);
  return {
    ready: !!t,
    disabled: e.configSaving || e.configFormMode === `raw`,
    configDirty: e.configDirty,
    configLoading: e.configLoading,
    configSaving: e.configSaving,
    defaultBinding: r,
    agents: i,
    nodes: n,
    onBindDefault: e.onBindDefault,
    onBindAgent: e.onBindAgent,
    onSave: e.onSaveBindings,
    onLoadConfig: e.onLoadConfig,
    formMode: e.configFormMode,
  };
}
function nn(e) {
  let t = e.nodes.length > 0,
    n = e.defaultBinding ?? ``,
    r = f`
    <button class="btn" ?disabled=${e.disabled || !e.configDirty} @click=${e.onSave}>
      ${e.configSaving ? E(`common.saving`) : E(`common.save`)}
    </button>
  `,
    i = f`
    ${e.formMode === `raw` ? j({ title: E(`nodes.binding.formModeHint`) }) : m}
    ${
      e.ready
        ? f`
          ${j({
            title: E(`nodes.binding.defaultBinding`),
            description: t
              ? E(`nodes.binding.defaultBindingHint`)
              : f`${E(`nodes.binding.defaultBindingHint`)} ${E(`nodes.binding.noNodes`)}`,
            control: f`
              <select
                class="settings-select"
                aria-label=${E(`nodes.binding.node`)}
                ?disabled=${e.disabled || !t}
                @change=${(t) => {
                  let n = t.target.value.trim();
                  e.onBindDefault(n || null);
                }}
              >
                <option value="" ?selected=${n === ``}>
                  ${E(`nodes.binding.anyNode`)}
                </option>
                ${e.nodes.map(
                  (e) => f`<option value=${e.id} ?selected=${n === e.id}>
                      ${e.label}
                    </option>`,
                )}
              </select>
            `,
          })}
          ${e.agents.length === 0 ? j({ title: E(`nodes.binding.noAgents`) }) : e.agents.map((t) => rn(t, e))}
        `
        : j({
            title: E(`nodes.binding.loadConfigHint`),
            control: f`
            <button class="btn" ?disabled=${e.configLoading} @click=${e.onLoadConfig}>
              ${e.configLoading ? E(`common.loading`) : E(`common.loadConfig`)}
            </button>
          `,
          })
    }
  `;
  return M(
    {
      title: E(`nodes.binding.execNodeBinding`),
      description: E(`nodes.binding.execNodeBindingSubtitle`),
      actions: r,
    },
    i,
  );
}
function rn(e, t) {
  let n = e.binding ?? `__default__`,
    r = e.name?.trim() ? `${e.name} (${e.id})` : e.id,
    i = t.nodes.length > 0;
  return j({
    title: r,
    description: f`
      ${e.isDefault ? E(`nodes.binding.defaultAgent`) : E(`nodes.binding.agent`)} ·
      ${n === `__default__` ? E(`nodes.binding.usesDefault`, { node: t.defaultBinding ?? E(`nodes.binding.any`) }) : E(`nodes.binding.override`, { node: e.binding ?? `` })}
    `,
    control: f`
      <select
        class="settings-select"
        aria-label=${E(`nodes.binding.binding`)}
        ?disabled=${t.disabled || !i}
        @change=${(n) => {
          let r = n.target.value.trim();
          t.onBindAgent(e.index, r === `__default__` ? null : r);
        }}
      >
        <option value="__default__" ?selected=${n === `__default__`}>
          ${E(`nodes.binding.useDefault`)}
        </option>
        ${t.nodes.map(
          (e) => f`<option value=${e.id} ?selected=${n === e.id}>
              ${e.label}
            </option>`,
        )}
      </select>
    `,
  });
}
function an(e) {
  return F(e, [`system.run`]);
}
function on(e) {
  let t = { id: `main`, name: void 0, index: 0, isDefault: !0, binding: null };
  if (!e || typeof e != `object`) return { defaultBinding: null, agents: [t] };
  let n = (e.tools ?? {}).exec ?? {},
    r = typeof n.node == `string` && n.node.trim() ? n.node.trim() : null,
    i = e.agents ?? {};
  if (!Array.isArray(i.list) || i.list.length === 0) return { defaultBinding: r, agents: [t] };
  let a = P(e).map((e) => {
    let t = (e.record.tools ?? {}).exec ?? {},
      n = typeof t.node == `string` && t.node.trim() ? t.node.trim() : null;
    return { id: e.id, name: e.name, index: e.index, isDefault: e.isDefault, binding: n };
  });
  return (a.length === 0 && a.push(t), { defaultBinding: r, agents: a });
}
var sn = e(() => {
  (p(), N(), D(), Be(), st(), $t(), H());
});
function Q(e) {
  let t = e && typeof e == `object` ? e.presence : null;
  return Array.isArray(t) ? t : null;
}
function cn(e) {
  let t = new Map();
  for (let n of e) {
    let e = (n.deviceId ?? n.instanceId)?.trim().toLowerCase();
    !e ||
      n.mode?.trim().toLowerCase() === `gateway` ||
      t.set(e, n.reason?.trim().toLowerCase() === `disconnect` ? `offline` : `connected`);
  }
  return JSON.stringify([...t].toSorted(([e], [t]) => e.localeCompare(t)));
}
var ln, $;
e(() => {
  (s(),
    p(),
    l(),
    Ae(),
    je(),
    Oe(),
    Pe(),
    ce(),
    oe(),
    me(),
    ge(),
    Se(),
    ve(),
    sn(),
    n(),
    (ln = 3e4),
    ($ = class extends be {
      constructor(...e) {
        (super(...e),
          (this.client = null),
          (this.connected = !1),
          (this.requestGeneration = 0),
          (this.nodesLoading = !1),
          (this.nodes = []),
          (this.presence = []),
          (this.lastError = null),
          (this.chatError = null),
          (this.devicesLoading = !1),
          (this.devicesError = null),
          (this.devicesList = null),
          (this.canPairDevice = !1),
          (this.execApprovalsLoading = !1),
          (this.execApprovalsSaving = !1),
          (this.execApprovalsDirty = !1),
          (this.execApprovalsSnapshot = null),
          (this.execApprovalsForm = null),
          (this.execApprovalsSelectedAgent = null),
          (this.execApprovalsTarget = `gateway`),
          (this.execApprovalsTargetNodeId = null),
          (this.inventoryRemovalPrompt = null),
          (this.routeDataInitialized = !1),
          (this.hasBoundGateway = !1),
          (this.presenceRequestId = 0),
          (this.gatewaySource = null),
          (this.polling = new xe(
            this,
            ln,
            () => {
              (b(this, { quiet: !0 }), x(this, { quiet: !0 }));
            },
            !1,
          )),
          (this.subscriptions = new _e(this)
            .watch(
              () => this.context?.runtimeConfig,
              (e, t) => e.subscribe(t),
            )
            .effect(
              () => this.context?.gateway,
              (e) => {
                let t = !this.hasBoundGateway;
                ((this.hasBoundGateway = !0),
                  (this.gatewaySource = e),
                  this.applyGatewaySnapshot(e.snapshot, !t, t));
                let n = e.subscribe((t) => {
                  this.gatewaySource === e && this.applyGatewaySnapshot(t, !1);
                });
                return () => {
                  (n(), this.gatewaySource === e && (this.gatewaySource = null));
                };
              },
            )
            .effect(
              () => this.context?.gateway,
              (e) =>
                e.subscribeEvents((t) => {
                  if (this.gatewaySource !== e) return;
                  let n = t.event === `presence` ? Q(t.payload) : null;
                  if (n) {
                    let e = cn(n) !== cn(this.presence);
                    ((this.presenceRequestId += 1),
                      (this.presence = n),
                      e && (x(this, { quiet: !0 }), b(this, { quiet: !0 })));
                  }
                  ((t.event === `device.pair.requested` || t.event === `device.pair.resolved`) &&
                    x(this, { quiet: !0 }),
                    (t.event === `node.pair.requested` || t.event === `node.pair.resolved`) &&
                      b(this, { quiet: !0 }));
                }),
            )));
      }
      willUpdate(e) {
        e.has(`routeData`) && this.applyRouteData();
      }
      updated(e) {
        e.has(`routeData`) && this.ensureInitialData();
      }
      disconnectedCallback() {
        (this.subscriptions.clear(),
          (this.requestGeneration += 1),
          (this.presenceRequestId += 1),
          (this.client = null),
          (this.connected = !1),
          (this.presence = []),
          (this.canPairDevice = !1),
          (this.inventoryRemovalPrompt = null),
          super.disconnectedCallback());
      }
      applyGatewaySnapshot(e, t, n = !1) {
        let r = this.client !== e.client,
          i = this.connected !== e.connected;
        if (
          ((t || r || i || !e.connected) && (this.requestGeneration += 1),
          this.syncGatewayState(e),
          (t || (!n && (r || !e.connected))) && this.resetServerState(e),
          this.routeDataInitialized && e.connected && e.client && (t || r || i))
        ) {
          let t = Q(e.hello?.snapshot);
          ((this.presence = t ?? []), this.loadPresence());
        }
        (this.syncPolling(), this.ensureInitialData());
      }
      syncGatewayState(e) {
        ((this.client = e.client),
          (this.connected = e.connected),
          (this.canPairDevice = e.connected && De(e.hello?.auth ?? null)));
      }
      applyRouteData() {
        let e = this.routeData;
        if (!e) return;
        this.routeDataInitialized = !0;
        let t = this.context.gateway,
          n = t.snapshot;
        if (e.gateway !== t || e.gatewaySnapshot !== n) {
          (this.resetServerState(n),
            (this.presence = Q(n.hello?.snapshot) ?? []),
            this.loadPresence(),
            this.ensureInitialData());
          return;
        }
        ((this.client = n.client),
          (this.connected = n.connected),
          (this.nodesLoading = e.nodes.nodesLoading),
          (this.nodes = e.nodes.nodes),
          (this.lastError = e.nodes.lastError),
          (this.chatError = e.nodes.chatError ?? null),
          (this.devicesLoading = e.nodes.devicesLoading),
          (this.devicesError = e.nodes.devicesError),
          (this.devicesList = e.nodes.devicesList),
          (this.execApprovalsLoading = e.nodes.execApprovalsLoading),
          (this.execApprovalsSaving = e.nodes.execApprovalsSaving),
          (this.execApprovalsDirty = e.nodes.execApprovalsDirty),
          (this.execApprovalsSnapshot = e.nodes.execApprovalsSnapshot),
          (this.execApprovalsForm = e.nodes.execApprovalsForm),
          (this.execApprovalsSelectedAgent = e.nodes.execApprovalsSelectedAgent));
        let r = Q(n.hello?.snapshot);
        (r && (this.presence = r), this.loadPresence());
      }
      resetServerState(e) {
        this.inventoryRemovalPrompt = null;
        let t = we(e);
        ((this.nodesLoading = t.nodesLoading),
          (this.nodes = t.nodes),
          (this.presenceRequestId += 1),
          (this.presence = []),
          (this.lastError = t.lastError),
          (this.chatError = t.chatError ?? null),
          (this.devicesLoading = t.devicesLoading),
          (this.devicesError = t.devicesError),
          (this.devicesList = t.devicesList),
          (this.execApprovalsLoading = t.execApprovalsLoading),
          (this.execApprovalsSaving = t.execApprovalsSaving),
          (this.execApprovalsDirty = t.execApprovalsDirty),
          (this.execApprovalsSnapshot = t.execApprovalsSnapshot),
          (this.execApprovalsForm = t.execApprovalsForm),
          (this.execApprovalsSelectedAgent = t.execApprovalsSelectedAgent));
      }
      ensureInitialData() {
        if (!this.connected || !this.client || !this.routeDataInitialized) return;
        (!this.nodes.length && !this.nodesLoading && b(this),
          !this.devicesList && !this.devicesLoading && x(this));
        let e = this.context.runtimeConfig.state;
        (!e.configSnapshot && !e.configLoading && this.context.runtimeConfig.refresh(),
          !this.execApprovalsSnapshot &&
            !this.execApprovalsLoading &&
            ie(this, this.resolveExecApprovalsTarget()));
      }
      syncPolling() {
        if (this.connected && this.client) {
          this.polling.start();
          return;
        }
        this.polling.stop();
      }
      async loadPresence() {
        let e = this.context.gateway.snapshot,
          t = e.client;
        if (!e.connected || !t) return;
        let n = this.requestGeneration,
          r = ++this.presenceRequestId;
        try {
          let e = await t.request(`system-presence`, {});
          this.isCurrentPresenceRequest(t, n, r) && Array.isArray(e) && (this.presence = e);
        } catch (e) {
          this.isCurrentPresenceRequest(t, n, r) && he(e) && (this.presence = []);
        }
      }
      isCurrentPresenceRequest(e, t, n) {
        let r = this.context.gateway.snapshot;
        return (
          r.connected &&
          r.client === e &&
          this.requestGeneration === t &&
          this.presenceRequestId === n
        );
      }
      confirmInventoryRemoval() {
        let e = this.inventoryRemovalPrompt;
        if (((this.inventoryRemovalPrompt = null), e)) {
          if (e.kind === `entry`) {
            fe(this, e.entry);
            return;
          }
          pe(this, e.entries);
        }
      }
      resolveExecApprovalsTarget() {
        return this.execApprovalsTarget === `node` && this.execApprovalsTargetNodeId
          ? { kind: `node`, nodeId: this.execApprovalsTargetNodeId }
          : { kind: `gateway` };
      }
      render() {
        let e = this.context.runtimeConfig.state,
          t = this.context.gateway.snapshot,
          n = (t.connected && t.hello?.server?.version?.trim()) || null;
        return f`
      <section class="content-header">
        <div>
          <div class="page-title">${ke(`nodes`)}</div>
        </div>
      </section>
      ${Ne(
        en({
          loading: this.nodesLoading,
          nodes: this.nodes,
          presence: this.presence,
          gatewayVersion: n,
          lastError: this.lastError,
          devicesLoading: this.devicesLoading,
          devicesError: this.devicesError,
          devicesList: this.devicesList,
          canPairDevice: this.canPairDevice,
          configForm: le(e),
          configLoading: e.configLoading,
          configSaving: e.configSaving,
          configDirty: e.configFormDirty,
          configFormMode: e.configFormMode,
          execApprovalsLoading: this.execApprovalsLoading,
          execApprovalsSaving: this.execApprovalsSaving,
          execApprovalsDirty: this.execApprovalsDirty,
          execApprovalsSnapshot: this.execApprovalsSnapshot,
          execApprovalsForm: this.execApprovalsForm,
          execApprovalsSelectedAgent: this.execApprovalsSelectedAgent,
          execApprovalsTarget: this.execApprovalsTarget,
          execApprovalsTargetNodeId: this.execApprovalsTargetNodeId,
          onDevicePairSetupOpen: () => void this.context.overlays.openDevicePairSetup(),
          onDeviceApprove: (e) => void Ce(this, e),
          onDeviceReject: (e) => void ne(this, e),
          onNodeApprove: (e) => void Te(this, e),
          onNodeReject: (e) => void ye(this, e),
          inventoryRemovalPrompt: this.inventoryRemovalPrompt,
          onInventoryRemove: (e) => {
            this.inventoryRemovalPrompt = { kind: `entry`, entry: e };
          },
          onInventoryCleanup: (e) => {
            e.length > 0 && (this.inventoryRemovalPrompt = { kind: `stale`, entries: e });
          },
          onInventoryRemovalConfirm: () => this.confirmInventoryRemoval(),
          onInventoryRemovalCancel: () => {
            this.inventoryRemovalPrompt = null;
          },
          onDeviceRotate: (e, t, n) =>
            void se(this, {
              deviceId: e,
              gatewayUrl: this.context.gateway.connection.gatewayUrl,
              role: t,
              scopes: n,
            }),
          onDeviceRevoke: (e, t) =>
            void ae(this, {
              deviceId: e,
              gatewayUrl: this.context.gateway.connection.gatewayUrl,
              role: t,
            }),
          onLoadConfig: () =>
            void this.context.runtimeConfig.refresh({ discardPendingChanges: !0 }),
          onLoadExecApprovals: () => void ie(this, this.resolveExecApprovalsTarget()),
          onBindDefault: (e) => {
            e
              ? this.context.runtimeConfig.patchForm([`tools`, `exec`, `node`], e)
              : this.context.runtimeConfig.removeFormValue([`tools`, `exec`, `node`]);
          },
          onBindAgent: (e, t) => {
            let n = [`agents`, `list`, e, `tools`, `exec`, `node`];
            t
              ? this.context.runtimeConfig.patchForm(n, t)
              : this.context.runtimeConfig.removeFormValue(n);
          },
          onSaveBindings: () => void this.context.runtimeConfig.save(),
          onExecApprovalsTargetChange: (e, t) => {
            ((this.execApprovalsTarget = e),
              (this.execApprovalsTargetNodeId = t),
              (this.execApprovalsSnapshot = null),
              (this.execApprovalsForm = null),
              (this.execApprovalsDirty = !1),
              (this.execApprovalsSelectedAgent = null));
          },
          onExecApprovalsSelectAgent: (e) => {
            this.execApprovalsSelectedAgent = e;
          },
          onExecApprovalsPatch: (e, t) => re(this, e, t),
          onExecApprovalsRemove: (e) => de(this, e),
          onSaveExecApprovals: () => void ue(this, this.resolveExecApprovalsTarget()),
        }),
      )}
    `;
      }
    }),
    i([c({ context: Ee, subscribe: !0 })], $.prototype, `context`, void 0),
    i([d({ attribute: !1 })], $.prototype, `routeData`, void 0),
    i([u()], $.prototype, `client`, void 0),
    i([u()], $.prototype, `connected`, void 0),
    i([u()], $.prototype, `nodesLoading`, void 0),
    i([u()], $.prototype, `nodes`, void 0),
    i([u()], $.prototype, `presence`, void 0),
    i([u()], $.prototype, `lastError`, void 0),
    i([u()], $.prototype, `chatError`, void 0),
    i([u()], $.prototype, `devicesLoading`, void 0),
    i([u()], $.prototype, `devicesError`, void 0),
    i([u()], $.prototype, `devicesList`, void 0),
    i([u()], $.prototype, `canPairDevice`, void 0),
    i([u()], $.prototype, `execApprovalsLoading`, void 0),
    i([u()], $.prototype, `execApprovalsSaving`, void 0),
    i([u()], $.prototype, `execApprovalsDirty`, void 0),
    i([u()], $.prototype, `execApprovalsSnapshot`, void 0),
    i([u()], $.prototype, `execApprovalsForm`, void 0),
    i([u()], $.prototype, `execApprovalsSelectedAgent`, void 0),
    i([u()], $.prototype, `execApprovalsTarget`, void 0),
    i([u()], $.prototype, `execApprovalsTargetNodeId`, void 0),
    i([u()], $.prototype, `inventoryRemovalPrompt`, void 0),
    customElements.get(`openclaw-nodes-page`) || customElements.define(`openclaw-nodes-page`, $));
})();
//# sourceMappingURL=nodes-page-CuAFhaBj.js.map
