import { n as ke, t as Ae } from "./agent-scope-control-DLXN7_B3.js";
import {
  K as ye,
  M as be,
  N as A,
  P as xe,
  dt as Se,
  nt as Ce,
  q as we,
} from "./control-ui-core--EZfp09c.js";
import {
  A as f,
  B as p,
  Cn as m,
  D as h,
  F as g,
  H as _,
  Ji as v,
  L as y,
  M as b,
  N as x,
  O as S,
  P as C,
  S as w,
  T,
  U as E,
  V as D,
  W as O,
  _ as ee,
  _t as k,
  b as te,
  da as ne,
  di as re,
  ea as ie,
  f as ae,
  fi as oe,
  g as se,
  h as ce,
  ht as le,
  k as ue,
  la as de,
  m as fe,
  p as pe,
  qi as me,
  tn as he,
  u as ge,
  y as _e,
  z as ve,
} from "./control-ui-core-BcbHa4vB.js";
import { $ as Te, J as Ee, Q as N, x as De } from "./control-ui-core-CQDTaMS5.js";
import { o as j, t as M } from "./control-ui-core-CwQmiouz.js";
import { dt as i, ft as a } from "./control-ui-foundation-0uuDj0X3.js";
import { _ as t, g as n, p as r } from "./control-ui-foundation-CCDffryi.js";
import { I as l, P as u, f as d } from "./control-ui-foundation-s2wA1PVE.js";
import { at as o, et as s, nt as c } from "./lit-runtime-DkvDG939.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
import { t as Oe } from "./web-awesome-select-Bk_xnNvy.js";
function P(e, t) {
  return e?.name ?? e?.identity?.name ?? e?.id ?? t;
}
function je(e, t) {
  return e.agentId?.trim() || t?.defaultId || ``;
}
function F(e, t) {
  let n = je(e, t);
  return n ? t?.agents.find((e) => e.id === n) : void 0;
}
function Me(e, t) {
  let n = e.agentId?.trim() || j(`workboard.defaultAgent`);
  return P(F(e, t), n);
}
function Ne(e, t, n) {
  if (n === `all`) return !0;
  let r = e.agentId?.trim();
  return n === "default" ? !r : r === n;
}
function Pe(e, t, n) {
  if (!n) return !0;
  let r = e.agentId?.trim();
  return r === n || (!r && t?.defaultId === n);
}
function I(e) {
  return typeof e == `string` ? e.trim() : ``;
}
function Fe(e) {
  let t = new Set(),
    n = I(e?.defaultId),
    r = [];
  for (let i of e?.agents ?? []) {
    let e = I(i.id);
    !e || t.has(e) || (t.add(e), r.push({ id: e, label: P(i, e), isDefault: !!(n && e === n) }));
  }
  return r;
}
function Ie(e) {
  return e.find((e) => e.isDefault)?.label ?? j(`workboard.defaultAgent`);
}
function Le(e, t) {
  let n = Fe(e),
    r = new Set(n.map((e) => e.id)),
    i = [...new Set(t.map((e) => I(e.agentId)).filter((e) => e && !r.has(e)))].toSorted((e, t) =>
      e.localeCompare(t),
    ),
    a = [
      { id: `all`, label: j(`workboard.allAgents`) },
      {
        id: `default`,
        label: j(`workboard.agentFilterUnassigned`, { agent: Ie(n) }),
        description: j(`workboard.agentFilterUnassignedHelp`),
      },
    ];
  for (let e of n)
    a.push({
      id: e.id,
      label: e.isDefault
        ? j(`workboard.agentFilterConfiguredDefault`, { agent: e.label })
        : e.label,
      ...(e.isDefault ? { description: j(`workboard.agentFilterConfiguredDefaultHelp`) } : {}),
    });
  for (let e of i) a.push({ id: e, label: j(`workboard.agentCurrentUnconfigured`, { agent: e }) });
  return a;
}
function Re(e, t) {
  let n = Fe(e),
    r = I(t),
    i = r ? n.some((e) => e.id === r) : !0;
  return [
    { id: ``, label: j(`workboard.agentFilterUnassigned`, { agent: Ie(n) }) },
    ...n.map((e) => ({
      id: e.id,
      label: e.isDefault
        ? j(`workboard.agentFilterConfiguredDefault`, { agent: e.label })
        : e.label,
    })),
    ...(i ? [] : [{ id: r, label: j(`workboard.agentCurrentUnconfigured`, { agent: r }) }]),
  ];
}
function ze(e, t) {
  return e.some((e) => e.id === t) ? t : `all`;
}
var Be = e(() => {
    M();
  }),
  Ve = e(() => {});
function L(e) {
  return j(`workboard.status.${e}`);
}
function R(e) {
  return e.charAt(0).toUpperCase() + e.slice(1);
}
function He(e) {
  return e ? me(e, { month: `short`, day: `numeric` }, ``) : ``;
}
function Ue(e) {
  return new Intl.DateTimeFormat(void 0, { hour: `numeric`, minute: `2-digit` }).format(
    new Date(e),
  );
}
function z(e) {
  return e ? v(e, { month: `short`, day: `numeric`, hour: `numeric`, minute: `2-digit` }, ``) : ``;
}
function We(e) {
  return e ? (r(Math.max(0, Date.now() - e), { spaced: !0 }) ?? `0ms`) : ``;
}
function Ge(e, t = 64) {
  let n = e.trim();
  return n.length <= t ? n : `${l(n, Math.max(0, t - 1))}…`;
}
function B(e) {
  return e.canWrite !== !1 && D(y(e.host));
}
function Ke(e) {
  return e.canWrite !== !1;
}
function qe(e) {
  switch (e.kind) {
    case `created`:
      return j(`workboard.eventCreated`);
    case `edited`:
      return j(`workboard.eventEdited`);
    case `moved`:
      return e.toStatus
        ? j(`workboard.eventMovedTo`, { status: L(e.toStatus) })
        : j(`workboard.eventMoved`);
    case `linked`:
      return j(`workboard.eventLinked`);
    case `specified`:
      return j(`workboard.eventSpecified`);
    case `decomposed`:
      return j(`workboard.eventDecomposed`);
    case `claimed`:
      return j(`workboard.eventClaimed`);
    case `heartbeat`:
      return j(`workboard.eventHeartbeat`);
    case `execution_updated`:
      return j(`workboard.eventExecutionUpdated`);
    case `attempt_started`:
      return j(`workboard.eventAttemptStarted`);
    case `attempt_updated`:
      return j(`workboard.eventAttemptUpdated`);
    case `comment_added`:
      return j(`workboard.eventCommentAdded`);
    case `link_added`:
      return j(`workboard.eventLinkAdded`);
    case `proof_added`:
      return j(`workboard.eventProofAdded`);
    case `artifact_added`:
      return j(`workboard.eventArtifactAdded`);
    case `attachment_added`:
      return j(`workboard.eventAttachmentAdded`);
    case `diagnostic`:
      return j(`workboard.eventDiagnostic`);
    case `notification`:
      return j(`workboard.eventNotification`);
    case `dispatch`:
      return j(`workboard.eventDispatch`);
    case `orchestration`:
      return j(`workboard.eventOrchestration`);
    case `protocol_violation`:
      return j(`workboard.eventProtocolViolation`);
    case `archived`:
      return j(`workboard.eventArchived`);
    case `unarchived`:
      return j(`workboard.eventUnarchived`);
    case `stale`:
      return j(`workboard.eventStale`);
  }
  return ``;
}
function Je(e) {
  let t = (e.events ?? []).toReversed().slice(0, 4);
  return t.length === 0
    ? c
    : o`
    <ol class="workboard-events" aria-label=${j(`workboard.eventsLabel`)}>
      ${t.map(
        (e) => o`
          <li>
            <span>${qe(e)}</span>
            <time>${He(e.at)}</time>
          </li>
        `,
      )}
    </ol>
  `;
}
function Ye(e, t) {
  let n = e.metadata,
    r = [],
    i = n?.diagnostics?.toSorted((e, t) => t.lastSeenAt - e.lastSeenAt)[0],
    a =
      e.status === `blocked`
        ? (n?.notifications?.at(-1)?.message ?? n?.workerProtocol?.detail ?? i?.detail)
        : void 0;
  if (
    (n?.templateId && r.push(o`<span>${j(`workboard.template.${n.templateId}`)}</span>`),
    (t ?? e.taskId) && r.push(o`<span>${j(`workboard.badgeTaskLinked`)}</span>`),
    n?.attempts?.length &&
      r.push(o`<span
        >${j(`workboard.badgeAttempts`, { count: String(n.attempts.length) })}</span
      >`),
    n?.failureCount &&
      r.push(o`
      <span class="workboard-card__badge--warning">
        ${N.alertTriangle}${j(`workboard.badgeFailures`, { count: String(n.failureCount) })}
      </span>
    `),
    n?.comments?.length &&
      r.push(o`<span
        >${j(`workboard.badgeComments`, { count: String(n.comments.length) })}</span
      >`),
    n?.proof?.length &&
      r.push(o`<span>${j(`workboard.badgeProof`, { count: String(n.proof.length) })}</span>`),
    n?.claim)
  ) {
    r.push(o`<span>${j(`workboard.badgeClaimed`, { owner: n.claim.ownerId })}</span>`);
    let e = We(n.claim.lastHeartbeatAt);
    e && r.push(o`<span>${j(`workboard.badgeHeartbeat`, { age: e })}</span>`);
  }
  return (
    i &&
      r.push(o`<span class="workboard-card__badge--warning" title=${i.detail}>
        ${N.alertTriangle}${Ge(i.title)}
      </span>`),
    a &&
      r.push(o`<span class="workboard-card__badge--warning" title=${a}>
        ${N.alertTriangle}${Ge(a)}
      </span>`),
    n?.stale &&
      r.push(o`<span class="workboard-card__badge--warning"
        >${N.alertTriangle}${j(`workboard.badgeStale`)}</span
      >`),
    r.length === 0 ? c : o` <div class="workboard-card__badges">${r}</div> `
  );
}
function Xe(e, t) {
  if (t.priority !== `all` && e.priority !== t.priority) return !1;
  let n = t.query.trim().toLowerCase();
  return n
    ? [
        e.title,
        e.notes,
        e.agentId,
        e.sessionKey,
        e.execution?.engine,
        e.execution?.mode,
        e.execution?.model,
        e.execution?.sessionKey,
        e.metadata?.templateId,
        e.metadata?.automation?.tenant,
        e.metadata?.automation?.idempotencyKey,
        e.metadata?.automation?.workspace?.kind,
        e.metadata?.automation?.workspace?.path,
        e.metadata?.automation?.workspace?.branch,
        ...(e.metadata?.automation?.skills ?? []),
        ...(e.metadata?.automation?.createdCardIds ?? []),
        ...(e.metadata?.comments ?? []).map((e) => e.body),
        ...(e.metadata?.links ?? []).flatMap((e) => [e.title, e.url, e.targetCardId]),
        ...(e.metadata?.proof ?? []).flatMap((e) => [e.label, e.command, e.url, e.note]),
        ...(e.metadata?.artifacts ?? []).flatMap((e) => [e.label, e.url, e.path, e.mimeType]),
        ...(e.metadata?.attachments ?? []).flatMap((e) => [e.fileName, e.mimeType, e.note]),
        ...(e.metadata?.workerLogs ?? []).map((e) => e.message),
        e.metadata?.workerProtocol?.state,
        e.metadata?.workerProtocol?.detail,
        e.metadata?.claim?.ownerId,
        ...(e.metadata?.diagnostics ?? []).flatMap((e) => [e.kind, e.severity, e.title, e.detail]),
        ...(e.metadata?.notifications ?? []).map((e) => e.message),
        ...e.labels,
      ]
        .filter((e) => typeof e == `string`)
        .some((e) => e.toLowerCase().includes(n))
    : !0;
}
function Ze(e, t) {
  let n = e.filter((e) => e.status === t).map((e) => e.position);
  return (n.length ? Math.max(...n) : 0) + 1e3;
}
function Qe(e) {
  if (e.archived || e.kind === `global`) return !1;
  let t = [e.key, e.label, e.displayName]
    .filter((e) => typeof e == `string`)
    .join(`:`)
    .toLowerCase();
  return !/(^|:)heartbeat(:|$)/.test(t);
}
function $e(e) {
  return e.target instanceof Element
    ? !!e.target.closest(`button, a, input, select, textarea`)
    : !1;
}
function V(e) {
  let t = o`
    <wa-select
      class="workboard-select ${e.className ?? ``}"
      label=${e.label}
      value=${e.value}
      ?disabled=${e.disabled}
      @change=${(t) => {
        let n = t.currentTarget.value;
        n !== void 0 &&
          e.options.some((e) => e.value === n && !e.disabled) &&
          (e.onChange(n), e.requestUpdate?.());
      }}
    >
      ${e.options.map(
        (t) => o`
          <wa-option
            class="workboard-select__option"
            value=${t.value}
            .label=${t.label}
            ?selected=${t.value === e.value}
            ?disabled=${t.disabled}
          >
            <span class="workboard-select__copy">
              <span class="workboard-select__label">${t.label}</span>
              ${t.description ? o`<span class="workboard-select__description">${t.description}</span>` : c}
            </span>
          </wa-option>
        `,
      )}
    </wa-select>
  `;
  return e.showLabel === !1
    ? t
    : o`
    <div class="workboard-field">
      <span>${e.label}</span>
      ${t}
    </div>
  `;
}
function et(e) {
  return j(e === `codex` ? `workboard.engineOpenAI` : `workboard.engineClaude`);
}
function tt(e, t, n) {
  if (!n) return null;
  let r = F(t, e.agentsList),
    i = r?.agentRuntime?.id?.trim();
  if (!i) return null;
  let a = i.toLowerCase();
  return a === `openclaw` || a === `pi`
    ? null
    : j(`workboard.engineDisabledRuntime`, {
        agent: P(r, t.agentId ?? j(`workboard.defaultAgent`)),
        runtime: i,
      });
}
function nt(e, t) {
  let n = Me(t, e.agentsList);
  return o`<span class="workboard-agent-chip" title=${t.agentId ? j(`workboard.agentLinked`, { agent: n }) : j(`workboard.agentDefaultLinked`, { agent: n })}>${n}</span>`;
}
function rt(e) {
  return o`
    <span class="workboard-engine-mark workboard-engine-mark--${e}" aria-hidden="true">
      ${e === `codex` ? `OpenAI` : `Claude`}
    </span>
  `;
}
function it(e, t, n, r) {
  n === t.status ||
    r.busyCardIds.has(t.id) ||
    r.dispatching ||
    !e.connected ||
    !e.client ||
    _e({
      host: e.host,
      client: e.client,
      cardId: t.id,
      status: n,
      position: Ze(r.cards, n),
      requestUpdate: e.onRequestUpdate,
    });
}
function at(e, t, n, r = {}) {
  let i = y(e.host),
    a = i.statuses.includes(t.status) ? i.statuses : [t.status, ...i.statuses];
  return a.length < 2
    ? c
    : o`
    <label
      class="workboard-card__move ${r.wide ? `workboard-card__move--wide` : ``}"
      title=${j(`workboard.fieldStatus`)}
    >
      <span class="workboard-card__move-icon" aria-hidden="true">${N.cornerDownRight}</span>
      <select
        class="workboard-card__move-select"
        aria-keyshortcuts="ArrowLeft ArrowRight"
        aria-label=${`${j(`workboard.fieldStatus`)}: ${t.title}`}
        .value=${t.status}
        ?disabled=${n || !e.connected || !e.client}
        @change=${(n) => {
          let r = n.currentTarget;
          it(e, t, r.value, i);
        }}
        @keydown=${(n) => {
          if (n.key !== `ArrowLeft` && n.key !== `ArrowRight`) return;
          if (i.busyCardIds.has(t.id) || i.dispatching || !e.connected || !e.client) {
            n.preventDefault();
            return;
          }
          let r = a.indexOf(t.status),
            o = n.key === `ArrowRight` ? 1 : -1,
            s = a[r + o];
          s && (n.preventDefault(), it(e, t, s, i));
        }}
      >
        ${a.map(
          (e) => o`<option value=${e} ?selected=${e === t.status}>
              ${L(e)}
            </option>`,
        )}
      </select>
    </label>
  `;
}
function H(e) {
  return o`
    <span class="workboard-card__action-slot">
      ${e === c ? o`<span class="workboard-card__action-placeholder" aria-hidden="true"></span>` : e}
    </span>
  `;
}
function ot(e, t) {
  let n = y(e.host),
    r = n.tasksByCardId.get(t.id),
    i = C(t, e.sessions),
    a = n.busyCardIds.has(t.id) || n.dispatching,
    o = Ct(t, r, n.missingTaskIds),
    s = B(e);
  return {
    state: n,
    task: r,
    session: i,
    busy: a,
    activeTask: o,
    live:
      o || wt(t) || i?.hasActiveRun === !0 || (i?.hasActiveRun !== !1 && i?.status === `running`),
    linkedSessionKey: t.sessionKey ?? t.execution?.sessionKey,
    writable: s,
    showStartControls: s && Tt(n, e.sessions, t),
    archived: !!t.metadata?.archivedAt,
  };
}
function U(e) {
  let t = o`
    <button
      class=${e.iconOnly ? `btn btn--icon workboard-card__icon ${e.className ?? ``}` : `btn ${e.className ?? ``}`}
      type="button"
      aria-label=${e.label}
      aria-haspopup=${e.ariaHaspopup ?? c}
      ?disabled=${e.disabled}
      @click=${e.onClick}
    >
      ${e.icon}${e.iconOnly ? c : o`<span>${e.label}</span>`}
    </button>
  `;
  return e.iconOnly ? o`<openclaw-tooltip .content=${e.label}>${t}</openclaw-tooltip>` : t;
}
function st(e, t, n = {}) {
  let r = y(e.host);
  return U({
    label: j(`workboard.editCard`),
    icon: N.edit,
    iconOnly: n.iconOnly,
    ariaHaspopup: `dialog`,
    disabled: r.dispatching,
    onClick: () => {
      (gt(r, t), e.onRequestUpdate?.());
    },
  });
}
function ct(e, t, n, r, i = {}) {
  return U({
    label: j(r ? `workboard.unarchiveCard` : `workboard.archiveCard`),
    icon: r ? N.archiveRestore : N.archive,
    iconOnly: i.iconOnly,
    disabled: n,
    onClick: () => {
      ce({
        host: e.host,
        client: e.client,
        cardId: t.id,
        archived: !r,
        requestUpdate: e.onRequestUpdate,
      });
    },
  });
}
function lt(e, t, n = {}) {
  return t
    ? U({
        label: j(`workboard.openSession`),
        icon: N.messageSquare,
        iconOnly: n.iconOnly,
        onClick: () => e.onOpenSession(t),
      })
    : c;
}
function ut(e, t, n, r = {}) {
  return U({
    label: j(`workboard.stopSession`),
    icon: N.stop,
    iconOnly: r.iconOnly,
    disabled: n || !e.connected,
    onClick: () => {
      pe({ host: e.host, client: e.client, card: t, requestUpdate: e.onRequestUpdate });
    },
  });
}
function dt(e, t, n, r = {}) {
  return U({
    label: j(`workboard.deleteCard`),
    icon: N.trash,
    iconOnly: r.iconOnly,
    className: `workboard-card__delete`,
    disabled: n,
    onClick: () => {
      se({ host: e.host, client: e.client, cardId: t.id, requestUpdate: e.onRequestUpdate });
    },
  });
}
function W(e, t) {
  ((e.detailCardId = t.id), (e.detailCommentBody = ``));
}
function ft(e) {
  ((e.detailCardId = null), (e.detailCommentBody = ``));
}
function pt(e) {
  if (!e.detailCardId || e.draftOpen) return null;
  let t = e.cards.find((t) => t.id === e.detailCardId) ?? null;
  return !t || (t.metadata?.archivedAt && !e.showArchived) ? null : t;
}
function mt(e) {
  let t = e.loaded && e.mutationReadiness === `stale_edit_draft`;
  ((e.draftOpen = !1),
    (e.editingCardId = null),
    (e.draftTitle = ``),
    (e.draftNotes = ``),
    (e.draftStatus = `todo`),
    (e.draftPriority = `normal`),
    (e.draftLabels = ``),
    (e.draftAgentId = ``),
    (e.draftSessionKey = ``),
    (e.draftTemplateId = ``),
    (e.draftCommentBody = ``),
    t && (e.mutationReadiness = `ready`));
}
function ht(e) {
  (mt(e), (e.draftOpen = !0));
}
function gt(e, t) {
  ((e.draftOpen = !0),
    (e.editingCardId = t.id),
    (e.draftTitle = t.title),
    (e.draftNotes = t.notes ?? ``),
    (e.draftStatus = t.status),
    (e.draftPriority = t.priority),
    (e.draftLabels = t.labels.join(`, `)),
    (e.draftAgentId = t.agentId ?? ``),
    (e.draftSessionKey = t.sessionKey ?? ``),
    (e.draftTemplateId = t.metadata?.templateId ?? ``),
    (e.draftCommentBody = ``));
}
function _t(e, t) {
  let n = Q.find((e) => e.id === t);
  n &&
    ((e.draftTemplateId = n.id),
    (e.draftTitle = j(n.titleKey)),
    (e.draftNotes = j(n.notesKey)),
    (e.draftLabels = n.labels),
    (e.draftPriority = n.priority));
}
function vt(e) {
  let t = y(e.host),
    n = Re(e.agentsList, t.draftAgentId),
    r = e.sessions.filter(Qe),
    i = t.statuses.map((e) => ({ value: e, label: L(e) })),
    a = d.map((e) => ({ value: e, label: R(e) })),
    s = n.map((e) => ({ value: e.id, label: e.label })),
    l = [
      { value: ``, label: j(`workboard.noLinkedSession`) },
      ...r.map((e) => ({ value: e.key, label: e.displayName ?? e.label ?? e.key })),
    ];
  if (
    (t.draftSessionKey &&
      !l.some((e) => e.value === t.draftSessionKey) &&
      l.push({ value: t.draftSessionKey, label: t.draftSessionKey }),
    !t.draftOpen)
  )
    return c;
  let u = !!t.editingCardId,
    f =
      (t.editingCardId ? (t.cards.find((e) => e.id === t.editingCardId) ?? null) : null)?.metadata
        ?.comments ?? [],
    p = u && t.busyCardIds.has(t.editingCardId ?? ``),
    m = !B(e) || t.loading || t.dispatching || p,
    h = t.draftSaving,
    g = () => (h ? !1 : (mt(t), !0));
  return o`
    <openclaw-modal-dialog
      label=${j(u ? `workboard.editCard` : `workboard.newCard`)}
      description=${j(u ? `workboard.editCardHelp` : `workboard.newCardHelp`)}
      style="--openclaw-modal-width: min(1120px, calc(100vw - 56px)); --openclaw-modal-max-height: calc(100dvh - 56px);"
      @modal-cancel=${(t) => {
        if (!g()) {
          t.preventDefault();
          return;
        }
        e.onRequestUpdate?.();
      }}
    >
      <form
        id=${Y}
        class="workboard-draft"
        aria-busy=${m ? `true` : `false`}
        @submit=${(t) => {
          (t.preventDefault(),
            !m && te({ host: e.host, client: e.client, requestUpdate: e.onRequestUpdate }));
        }}
      >
        <div class="workboard-modal__header">
          <div>
            <h2 id=${Bt}>
              ${j(u ? `workboard.editCard` : `workboard.newCard`)}
            </h2>
            <p id=${Vt}>
              ${j(u ? `workboard.editCardHelp` : `workboard.newCardHelp`)}
            </p>
          </div>
          <openclaw-tooltip .content=${j(`common.cancel`)}>
            <button
              class="btn btn--icon workboard-card__icon"
              type="button"
              aria-label=${j(`common.cancel`)}
              ?disabled=${h}
              @click=${() => {
                g() && e.onRequestUpdate?.();
              }}
            >
              ${N.x}
            </button>
          </openclaw-tooltip>
        </div>
        <div class="workboard-draft__body">
          ${
            u
              ? c
              : o`
                <div class="workboard-template-strip" aria-label=${j(`workboard.templatesLabel`)}>
                  ${Q.map(
                    (n) => o`
                      <button
                        class="btn btn--xs ${t.draftTemplateId === n.id ? `workboard-template-strip__button--active` : ``}"
                        type="button"
                        ?disabled=${m}
                        @click=${() => {
                          (_t(t, n.id), e.onRequestUpdate?.());
                        }}
                      >
                        ${j(`workboard.template.${n.id}`)}
                      </button>
                    `,
                  )}
                </div>
              `
          }
          <div class="workboard-draft__main">
            <label class="workboard-field">
              <span>${j(`workboard.fieldTitle`)}</span>
              <input
                class="input workboard-draft__title"
                autofocus
                placeholder=${j(`workboard.titlePlaceholder`)}
                ?disabled=${m}
                .value=${t.draftTitle}
                @input=${(n) => {
                  ((t.draftTitle = n.currentTarget.value), e.onRequestUpdate?.());
                }}
              />
            </label>
            <label class="workboard-field">
              <span>${j(`workboard.fieldNotes`)}</span>
              <textarea
                class="input workboard-draft__notes"
                placeholder=${j(`workboard.notesPlaceholder`)}
                ?disabled=${m}
                .value=${t.draftNotes}
                @input=${(n) => {
                  ((t.draftNotes = n.currentTarget.value), e.onRequestUpdate?.());
                }}
              ></textarea>
            </label>
          </div>
          <div class="workboard-draft__meta">
            ${V({
              value: t.draftStatus,
              options: i,
              label: j(`workboard.fieldStatus`),
              onChange: (e) => {
                t.draftStatus = e;
              },
              requestUpdate: e.onRequestUpdate,
              disabled: m,
            })}
            ${V({
              value: t.draftPriority,
              options: a,
              label: j(`workboard.fieldPriority`),
              onChange: (e) => {
                t.draftPriority = e;
              },
              requestUpdate: e.onRequestUpdate,
              disabled: m,
            })}
            ${V({
              value: t.draftAgentId,
              options: s,
              label: j(`workboard.fieldAgent`),
              onChange: (e) => {
                t.draftAgentId = e;
              },
              requestUpdate: e.onRequestUpdate,
              disabled: m,
            })}
            ${V({
              value: t.draftSessionKey,
              options: l,
              label: j(`workboard.fieldSession`),
              onChange: (e) => {
                t.draftSessionKey = e;
              },
              requestUpdate: e.onRequestUpdate,
              disabled: m,
            })}
            <label class="workboard-field workboard-field--wide">
              <span>${j(`workboard.fieldLabels`)}</span>
              <input
                class="input"
                placeholder=${j(`workboard.labelsPlaceholder`)}
                ?disabled=${m}
                .value=${t.draftLabels}
                @input=${(n) => {
                  ((t.draftLabels = n.currentTarget.value), e.onRequestUpdate?.());
                }}
              />
            </label>
          </div>
          ${
            u
              ? o`
                <section
                  class="workboard-field workboard-field--wide"
                  aria-labelledby="workboard-card-comments-title"
                >
                  <span id="workboard-card-comments-title">
                    ${j(`workboard.badgeComments`, { count: String(f.length) })}
                  </span>
                  ${
                    f.length
                      ? o`
                        <ol>
                          ${f.map((e) => o`<li>${e.body}</li>`)}
                        </ol>
                      `
                      : c
                  }
                  <textarea
                    class="input workboard-comments__input"
                    aria-labelledby="workboard-card-comments-title"
                    maxlength="2000"
                    ?disabled=${m}
                    .value=${t.draftCommentBody}
                    @input=${(n) => {
                      ((t.draftCommentBody = n.currentTarget.value), e.onRequestUpdate?.());
                    }}
                  ></textarea>
                  <div class="workboard-modal__actions">
                    <button
                      class="btn"
                      type="button"
                      ?disabled=${m || !t.draftCommentBody.trim()}
                      @click=${() => {
                        fe({ host: e.host, client: e.client, requestUpdate: e.onRequestUpdate });
                      }}
                    >
                      ${N.plus} ${j(`common.create`)}
                    </button>
                  </div>
                </section>
              `
              : c
          }
        </div>
        <div class="workboard-modal__actions">
          <button class="btn primary" ?disabled=${m || !t.draftTitle.trim()}>
            ${j(u ? `common.save` : `common.create`)}
          </button>
          <button
            class="btn"
            type="button"
            ?disabled=${h}
            @click=${() => {
              g() && e.onRequestUpdate?.();
            }}
          >
            ${j(`common.cancel`)}
          </button>
        </div>
      </form>
    </openclaw-modal-dialog>
  `;
}
function yt(e) {
  switch (e.state) {
    case `running`:
      return {
        label: j(`workboard.lifecycleRunning`),
        detail: j(`workboard.lifecycleRunningDetail`),
        tone: `live`,
      };
    case `succeeded`:
      return {
        label: j(`workboard.lifecycleDone`),
        detail: j(`workboard.lifecycleDoneDetail`),
        tone: `done`,
      };
    case `failed`:
      return {
        label: j(`workboard.lifecycleNeedsReview`),
        detail: j(`workboard.lifecycleNeedsReviewDetail`),
        tone: `blocked`,
      };
    case `stale`:
      return {
        label: j(`workboard.lifecycleStale`),
        detail: j(`workboard.lifecycleStaleDetail`),
        tone: `blocked`,
      };
    case `idle`:
      return {
        label: j(`workboard.lifecycleLinked`),
        detail: j(`workboard.lifecycleIdleDetail`),
        tone: `idle`,
      };
    case `missing`:
      return {
        label: j(`workboard.lifecycleMissing`),
        detail: j(`workboard.lifecycleMissingDetail`),
        tone: `blocked`,
      };
    case `unlinked`:
      return {
        label: j(`workboard.lifecycleUnlinked`),
        detail: j(`workboard.lifecycleUnlinkedDetail`),
        tone: `idle`,
      };
  }
  throw Error(`Unknown workboard lifecycle state.`);
}
function G(e) {
  return e.status === `queued` || e.status === `running`
    ? (e.progressSummary ?? e.title ?? e.taskId)
    : (e.terminalSummary ?? e.error ?? e.progressSummary ?? e.title ?? e.taskId);
}
function bt(e, t) {
  switch (e.status) {
    case `queued`:
    case `running`:
      return t.state === `running`;
    case `completed`:
      return t.state === `succeeded`;
    case `failed`:
    case `cancelled`:
    case `timed_out`:
      return t.state === `failed`;
  }
  return !1;
}
function xt(e) {
  return e?.status === `queued` || e?.status === `running`;
}
function St(e, t, n) {
  return !!(e.taskId && !t && !n.has(e.taskId));
}
function Ct(e, t, n) {
  return xt(t) || (e.status === `running` && St(e, t, n));
}
function wt(e) {
  let t = e.sessionKey ?? e.execution?.sessionKey,
    n = e.runId ?? e.execution?.runId;
  return e.status === `running` && !!(t && n);
}
function Tt(e, t, n) {
  let r = e.tasksByCardId.get(n.id),
    i = C(n, t),
    a = xt(r) || St(n, r, e.missingTaskIds),
    o = n.sessionKey ?? n.execution?.sessionKey;
  return !a && !wt(n) && (!o || !i);
}
function Et(e) {
  if (e.missing) return j(`workboard.dependencyMissing`, { parent: e.title });
  let t = e.status ? L(e.status) : j(`workboard.unknownStatus`);
  return `${e.title} (${t})`;
}
function Dt(e) {
  return e.blockedParents.length === 0
    ? null
    : j(`workboard.dependenciesBlockedTitle`, { parents: e.blockedParents.map(Et).join(`, `) });
}
function Ot(e) {
  if (e.parents.length === 0) return c;
  let t = e.blockedParents.length;
  return o`
    <div class="workboard-dependencies" title=${Dt(e) ?? j(`workboard.dependenciesReadyTitle`, { count: String(e.parents.length) })}>
      ${
        t > 0
          ? o`
            <span class="workboard-dependency workboard-dependency--blocked">
              ${N.alertTriangle}${j(`workboard.dependenciesBlocked`, { count: String(t) })}
            </span>
          `
          : o`
            <span class="workboard-dependency workboard-dependency--ready">
              ${j(`workboard.dependenciesReady`, { count: String(e.parents.length) })}
            </span>
          `
      }
    </div>
  `;
}
function kt(e) {
  return e.parents.length === 0
    ? c
    : o`
    <section class="workboard-detail__section">
      <h3>${j(`workboard.dependencies`)}</h3>
      <ul class="workboard-detail__list workboard-detail__dependencies">
        ${e.parents.map(
          (e) => o`
            <li class=${e.done ? `is-done` : `is-blocked`}>
              ${e.done ? o`<span class="workboard-detail__dependency-spacer"></span>` : N.alertTriangle}
              <span>${e.title}</span>
              <span>
                ${e.missing ? j(`workboard.dependencyStatusMissing`) : e.status ? L(e.status) : j(`workboard.unknownStatus`)}
              </span>
            </li>
          `,
        )}
      </ul>
    </section>
  `;
}
function At(e, t, n) {
  let r = g(e, t, n),
    i = yt(r),
    a = r.session,
    s = e.execution,
    c = r.state === `stale`,
    l = n ? bt(n, r) : !1,
    u = n && l ? j(`workboard.taskStatus.${n.status}`) : null;
  return o`
    <div class="workboard-card__lifecycle">
      <span class="workboard-lifecycle workboard-lifecycle--${i.tone}">
        ${u ?? (c || !s ? i.label : `${s.engine} ${s.mode}`)}
      </span>
      <span class="workboard-card__lifecycle-detail">
        ${n && l ? G(n) : c ? i.detail : (a?.displayName ?? a?.label ?? i.detail)}
      </span>
    </div>
  `;
}
function K(e, t, n, r, i = {}) {
  let a = y(e.host),
    s = a.busyCardIds.has(t.id) || a.dispatching,
    l = tt(e, t, n),
    u = s || !e.connected || !!l || !!t.metadata?.archivedAt,
    d =
      l ||
      (n
        ? j(r === `autonomous` ? `workboard.runEngine` : `workboard.openEngine`, { engine: et(n) })
        : j(`workboard.runDefaultAgent`)),
    f = o`
    <button
      class="btn btn--xs workboard-card__start workboard-card__start--${r} ${i.iconOnly ? `workboard-card__start--icon` : ``} ${n ? `` : `workboard-card__start--default`}"
      type="button"
      aria-label=${d}
      ?disabled=${u}
      @click=${async () => {
        let i = await ae({
          host: e.host,
          client: e.client,
          card: t,
          ...(n ? { engine: n } : {}),
          mode: r,
          requestUpdate: e.onRequestUpdate,
        });
        i && e.onOpenSession(i);
      }}
    >
      ${
        n
          ? o`${rt(n)}${
              i.iconOnly
                ? c
                : o`<span
                >${j(r === `autonomous` ? `workboard.run` : `workboard.open`)}</span
              >`
            }`
          : o`${r === `autonomous` ? N.play : N.penLine}${i.iconOnly ? c : o`<span>${j(`workboard.start`)}</span>`}`
      }
    </button>
  `;
  return i.iconOnly ? o`<openclaw-tooltip .content=${d}>${f}</openclaw-tooltip>` : f;
}
function jt(e, t) {
  let n = e.canModelOverride !== !1;
  return o`
    <div class="workboard-card__execution-controls">
      ${K(e, t, null, `autonomous`)}
      ${
        n
          ? o`${K(e, t, `codex`, `autonomous`)}
          ${K(e, t, `claude`, `autonomous`)}`
          : c
      }
      ${K(e, t, `codex`, `manual`)}
      ${K(e, t, `claude`, `manual`)}
    </div>
  `;
}
function q(e, t) {
  if (typeof t != `string` && typeof t != `number`) return c;
  let n = String(t).trim();
  return n
    ? o`
    <div class="workboard-detail__row">
      <span>${e}</span>
      <strong>${n}</strong>
    </div>
  `
    : c;
}
function J(e, t, n = c) {
  let r = t
    .map((e) => e.trim())
    .filter(Boolean)
    .slice(-6);
  return r.length === 0
    ? n
    : o`
    <section class="workboard-detail__section">
      <h3>${e}</h3>
      <ol class="workboard-detail__list">
        ${r.map((e) => o`<li>${e}</li>`)}
      </ol>
    </section>
  `;
}
function Mt(e) {
  let t = y(e.host),
    n = pt(t);
  if (!n) return c;
  let {
      task: r,
      busy: i,
      activeTask: a,
      live: s,
      linkedSessionKey: l,
      writable: u,
      showStartControls: d,
      archived: f,
    } = ot(e, n),
    p = g(n, e.sessions, r),
    m = yt(p),
    h = r ? bt(r, p) : !1,
    v = n.metadata?.comments ?? [],
    b = n.metadata?.attempts ?? [],
    x = n.metadata?.links ?? [],
    S = n.metadata?.proof ?? [],
    C = n.metadata?.artifacts ?? [],
    w = n.metadata?.attachments ?? [],
    T = n.metadata?.diagnostics ?? [],
    E = n.metadata?.workerLogs ?? [],
    D = n.metadata?.workerProtocol,
    O = n.metadata?.automation,
    ee = (n.events ?? []).slice(-6).toReversed(),
    k = _(n, t.cards);
  return o`
    <openclaw-modal-dialog
      class="drawer"
      label=${n.title}
      description=${r && h ? G(r) : (p.session?.displayName ?? m.detail)}
      style="--openclaw-modal-width: min(460px, 100vw); --openclaw-modal-max-height: 100dvh;"
      @modal-cancel=${() => {
        (ft(t), e.onRequestUpdate?.());
      }}
    >
      <aside id=${X} class="workboard-detail-drawer">
        <div class="workboard-detail">
          <header class="workboard-detail__header">
            <div>
              <span class="workboard-card__priority">${R(n.priority)}</span>
              <h2 id=${Z}>
                <span class="workboard-sr-only">${j(`workboard.detailTitle`)}: </span>${n.title}
              </h2>
            </div>
            <openclaw-tooltip .content=${j(`common.cancel`)}>
              <button
                class="btn btn--icon workboard-card__icon"
                type="button"
                aria-label=${j(`common.cancel`)}
                @click=${() => {
                  (ft(t), e.onRequestUpdate?.());
                }}
              >
                ${N.x}
              </button>
            </openclaw-tooltip>
          </header>

          <section class="workboard-detail__section">
            <div class="workboard-card__lifecycle">
              <span class="workboard-lifecycle workboard-lifecycle--${m.tone}">
                ${m.label}
              </span>
              <span id=${Ht} class="workboard-card__lifecycle-detail">
                ${r && h ? G(r) : (p.session?.displayName ?? m.detail)}
              </span>
            </div>
            <div class="workboard-detail__grid">
              ${q(j(`workboard.fieldStatus`), L(n.status))}
              ${q(j(`workboard.fieldAgent`), n.agentId ?? j(`workboard.defaultAgent`))}
              ${q(j(`workboard.detailTask`), r?.taskId ?? n.taskId)}
              ${q(j(`workboard.fieldSession`), l)}
              ${q(j(`workboard.detailRun`), n.runId ?? n.execution?.runId)}
              ${q(j(`workboard.detailUpdated`), z(n.updatedAt))}
            </div>
          </section>

          ${
            n.notes
              ? o`
                <section class="workboard-detail__section">
                  <h3>${j(`workboard.fieldNotes`)}</h3>
                  <p>${n.notes}</p>
                </section>
              `
              : c
          }
          ${kt(k)}
          ${J(j(`workboard.fieldLabels`), n.labels)}
          ${J(
            j(`workboard.badgeAttempts`, { count: String(b.length) }),
            b.map((e) => [e.status, e.model, e.sessionKey, e.error].filter(Boolean).join(` - `)),
          )}
          ${J(
            j(`workboard.badgeLinks`, { count: String(x.length) }),
            x.map((e) => [e.type, e.title, e.targetCardId, e.url].filter(Boolean).join(` - `)),
          )}
          ${J(
            j(`workboard.detailProof`),
            S.map((e) => [e.status, e.label, e.command, e.url, e.note].filter(Boolean).join(` - `)),
          )}
          ${J(
            j(`workboard.badgeArtifacts`, { count: String(C.length) }),
            C.map((e) => [e.label, e.url, e.path, e.mimeType].filter(Boolean).join(` - `)),
          )}
          ${J(
            j(`workboard.badgeAttachments`, { count: String(w.length) }),
            w.map((e) => [e.fileName, e.mimeType, e.note].filter(Boolean).join(` - `)),
          )}
          ${J(
            j(`workboard.detailDiagnostics`),
            T.map((e) => `${e.severity}: ${e.title}`),
          )}
          ${J(
            j(`workboard.detailWorkerLogs`),
            E.map((e) => `${e.level}: ${e.message}`),
          )}
          ${D ? J(j(`workboard.detailWorkerProtocol`), [D.state, D.detail ?? ``, D.updatedAt ? j(`workboard.detailUpdatedValue`, { time: z(D.updatedAt) }) : ``]) : c}
          ${O ? J(j(`workboard.detailAutomation`), [O.tenant ? j(`workboard.detailAutomationTenant`, { tenant: O.tenant }) : ``, O.boardId ? j(`workboard.detailAutomationBoard`, { board: O.boardId }) : ``, O.skills?.length ? j(`workboard.detailAutomationSkills`, { skills: O.skills.join(`, `) }) : ``, O.workspace ? j(`workboard.detailAutomationWorkspace`, { workspace: [O.workspace.kind, O.workspace.path, O.workspace.branch].filter(Boolean).join(` `) }) : ``, O.dispatchCount ? j(`workboard.badgeDispatches`, { count: String(O.dispatchCount) }) : ``, O.lastDispatchAt ? j(`workboard.detailUpdatedValue`, { time: z(O.lastDispatchAt) }) : ``, O.summary ? j(`workboard.detailAutomationSummary`, { summary: O.summary }) : ``]) : c}
          ${J(
            j(`workboard.eventsLabel`),
            ee.map((e) => `${qe(e)} ${z(e.at)}`),
          )}

          <section class="workboard-detail__section">
            <h3>${j(`workboard.detailOperatorNotes`)}</h3>
            ${
              v.length
                ? o`
                  <ol class="workboard-detail__list">
                    ${v.slice(-6).map((e) => o`<li>${e.body}</li>`)}
                  </ol>
                `
                : o`<p>${j(`workboard.detailNoNotes`)}</p>`
            }
            ${
              u
                ? o`
                  <textarea
                    class="input workboard-detail__note"
                    maxlength="2000"
                    placeholder=${j(`workboard.detailNotePlaceholder`)}
                    .value=${t.detailCommentBody}
                    @input=${(n) => {
                      ((t.detailCommentBody = n.currentTarget.value), e.onRequestUpdate?.());
                    }}
                  ></textarea>
                  <button
                    class="btn"
                    type="button"
                    ?disabled=${i || !t.detailCommentBody.trim()}
                    @click=${() => fe({ host: e.host, client: e.client, cardId: n.id, body: t.detailCommentBody, requestUpdate: e.onRequestUpdate })}
                  >
                    ${N.plus} ${j(`workboard.detailAddNote`)}
                  </button>
                `
                : c
            }
          </section>

          <div class="workboard-detail__actions">
            ${u && !f ? st(e, n) : c}
            ${u ? ct(e, n, i, f) : c}
            ${u ? at(e, n, i, { wide: !0 }) : c}
            ${u && (l ? s : a) ? ut(e, n, i) : c}
            ${lt(e, l)}
            ${u ? dt(e, n, i) : c}
            ${d ? jt(e, n) : c}
          </div>
        </div>
      </aside>
    </openclaw-modal-dialog>
  `;
}
function Nt(e) {
  let t = e.lastDispatchSummary;
  return t
    ? o`
    <div class="callout">
      ${j(t.started + t.failures + t.promoted + t.blocked + t.reclaimed + t.orchestrated === 0 ? `workboard.dispatchSummaryEmpty` : `workboard.dispatchSummary`, { started: String(t.started), failures: String(t.failures), promoted: String(t.promoted), blocked: String(t.blocked), reclaimed: String(t.reclaimed), orchestrated: String(t.orchestrated) })}
    </div>
  `
    : c;
}
function Pt(e, t, n) {
  let r = [
    [`running`, j(`workboard.healthRunning`), t.running],
    [`blocked`, j(`workboard.healthBlocked`), t.blocked],
    [`stale`, j(`workboard.healthStale`), t.stale],
    [`readyUnassigned`, j(`workboard.healthReadyUnassigned`), t.readyUnassigned],
    [`missingProof`, j(`workboard.healthMissingProof`), t.missingProof],
    [`failedAttempts`, j(`workboard.healthFailedAttempts`), t.failedAttempts],
  ];
  return o`
    <div class="workboard-health" aria-label=${j(`workboard.healthLabel`)}>
      ${r.map(
        ([t, r, i]) => o`
          <button
            class="workboard-health__item workboard-health__item--${t} ${e.activeHealthHighlight === t ? `workboard-health__item--active` : ``} ${i === 0 ? `workboard-health__item--empty` : ``}"
            type="button"
            aria-pressed=${e.activeHealthHighlight === t}
            aria-label=${`${i} ${r}`}
            @click=${() => {
              ((e.activeHealthHighlight = e.activeHealthHighlight === t ? null : t), n?.());
            }}
          >
            <strong>${i}</strong>${r}
          </button>
        `,
      )}
    </div>
  `;
}
function Ft(e) {
  return e.lastRefreshAt
    ? o`<span
      class="workboard-refresh-status ${e.lastRefreshError ? `workboard-refresh-status--error` : ``}"
      title=${e.lastRefreshError ? j(`workboard.refreshError`) : ``}
    >
      ${j(`workboard.lastRefreshed`, { time: Ue(e.lastRefreshAt) })}
    </span>`
    : e.lastRefreshError
      ? o`<span class="workboard-refresh-status workboard-refresh-status--error">
      ${j(`workboard.refreshError`)}
    </span>`
      : c;
}
function It() {
  return o`
    <div class="workboard-empty-state" role="status">
      <strong>${j(`workboard.emptyFilteredTitle`)}</strong>
      <span>${j(`workboard.emptyFilteredHint`)}</span>
    </div>
  `;
}
function Lt(e, t) {
  let {
      state: n,
      task: r,
      busy: i,
      activeTask: a,
      live: s,
      linkedSessionKey: l,
      writable: u,
      showStartControls: d,
      archived: f,
    } = ot(e, t),
    p = n.syncingCardIds.has(t.id),
    m = n.activeHealthHighlight ? x(t, n.activeHealthHighlight, e.sessions, r) : !1,
    h = _(t, n.cards),
    g = d ? K(e, t, null, `autonomous`, { iconOnly: !0 }) : c,
    v = u && !f ? st(e, t, { iconOnly: !0 }) : c,
    y = u ? ct(e, t, i, f, { iconOnly: !0 }) : c,
    b = o`
    <openclaw-tooltip .content=${j(`workboard.viewDetails`)}>
      <button
        class="btn btn--icon workboard-card__icon"
        aria-label=${j(`workboard.viewDetails`)}
        aria-haspopup="dialog"
        aria-expanded=${n.detailCardId === t.id ? `true` : `false`}
        aria-controls=${X}
        @click=${() => {
          (W(n, t), e.onRequestUpdate?.());
        }}
      >
        ${N.panelRightOpen}
      </button>
    </openclaw-tooltip>
  `,
    S = lt(e, l, { iconOnly: !0 }),
    C = u && (l ? s : a) ? ut(e, t, i, { iconOnly: !0 }) : c,
    w = u ? at(e, t, i) : c,
    T = u ? dt(e, t, i, { iconOnly: !0 }) : c;
  return o`
    <article
      class="workboard-card priority-${t.priority} ${i ? `workboard-card--busy` : ``} ${f ? `workboard-card--archived` : ``} ${m ? `workboard-card--health-highlight workboard-card--health-highlight-${n.activeHealthHighlight}` : ``} workboard-card--openable"
      role="button"
      tabindex="0"
      title=${j(`workboard.viewDetails`)}
      aria-haspopup="dialog"
      aria-expanded=${n.detailCardId === t.id ? `true` : `false`}
      aria-controls=${X}
      draggable=${u && !n.dispatching ? `true` : `false`}
      @click=${(r) => {
        $e(r) || (W(n, t), e.onRequestUpdate?.());
      }}
      @keydown=${(r) => {
        $e(r) ||
          (r.key !== `Enter` && r.key !== ` `) ||
          (W(n, t), e.onRequestUpdate?.(), r.preventDefault());
      }}
      @dragstart=${(r) => {
        if (!u || n.dispatching) {
          r.preventDefault();
          return;
        }
        ((n.draggedCardId = t.id),
          r.dataTransfer?.setData(`text/plain`, t.id),
          r.dataTransfer?.setDragImage(r.currentTarget, 16, 16),
          e.onRequestUpdate?.());
      }}
      @dragend=${() => {
        ((n.draggedCardId = null), e.onRequestUpdate?.());
      }}
    >
      <div class="workboard-card__top">
        <div
          class="workboard-card__updated"
          title=${j(`workboard.detailUpdatedValue`, { time: z(t.updatedAt) })}
          aria-label=${j(`workboard.detailUpdatedValue`, { time: z(t.updatedAt) })}
        >
          <span class="workboard-card__updated-icon" aria-hidden="true">${N.clock}</span>
          <span>${z(t.updatedAt)}</span>
        </div>
        <div class="workboard-card__quick-actions">
          ${H(g)} ${H(v)}
          ${H(y)}
        </div>
      </div>
      <div class="workboard-card__chips">
        <span class="workboard-card__priority">${R(t.priority)}</span>
        ${nt(e, t)}
        ${f ? o`<span class="workboard-card__archived">${j(`workboard.archived`)}</span>` : c}
        ${s ? o`<span class="workboard-live">${j(`workboard.live`)}</span>` : c}
        ${p ? o`<span class="workboard-live">${j(`common.saving`)}</span>` : c}
      </div>
      <h3>${t.title}</h3>
      ${t.notes ? o`<p>${t.notes}</p>` : c}
      ${At(t, e.sessions, r)} ${Ot(h)}
      ${
        t.labels.length
          ? o`<div class="workboard-labels">
            ${t.labels.map((e) => o`<span>${e}</span>`)}
          </div>`
          : c
      }
      ${Ye(t, r)}
      <div class="workboard-card__meta">
        <span>${l ?? j(`workboard.noLinkedSession`)}</span>
      </div>
      ${Je(t)}
      <div class="workboard-card__actions">
        ${H(b)}
        <div class="workboard-card__actions-primary">
          ${H(S)} ${H(C)}
          ${H(w)}
        </div>
        ${H(T)}
      </div>
    </article>
  `;
}
function Rt(e, t, n) {
  let r = y(e.host),
    i = B(e);
  return o`
    <section
      class="workboard-column workboard-column--${t} ${r.draggedCardId ? `workboard-column--drop` : ``}"
      @dragover=${(e) => {
        i && r.draggedCardId && e.preventDefault();
      }}
      @drop=${(n) => {
        if ((n.preventDefault(), !i)) return;
        let a = n.dataTransfer?.getData(`text/plain`) || r.draggedCardId;
        a &&
          _e({
            host: e.host,
            client: e.client,
            cardId: a,
            status: t,
            position: Ze(r.cards, t),
            requestUpdate: e.onRequestUpdate,
          });
      }}
    >
      <div class="workboard-column__header">
        <h2>${L(t)}</h2>
        <span>${n.length}</span>
      </div>
      <div class="workboard-column__cards">
        ${n.length ? n.map((t) => Lt(e, t)) : o`<div class="workboard-empty">${j(`workboard.emptyColumn`)}</div>`}
      </div>
    </section>
  `;
}
function zt(e) {
  let t = y(e.host);
  if (e.pluginEnabled === null)
    return e.pluginEnablementError
      ? o`
        <section class="workboard">
          <div class="callout danger" role="alert">${e.pluginEnablementError}</div>
          ${
            e.onReloadConfig
              ? o`<button class="btn" type="button" @click=${e.onReloadConfig}>
                ${j(`lazyView.retry`)}
              </button>`
              : c
          }
        </section>
      `
      : o`
      <section class="card lazy-view-state lazy-view-state--loading">
        <div class="card-title">${j(`lazyView.loadingTitle`)}</div>
        <div class="card-sub">${j(`common.loading`)}</div>
      </section>
    `;
  if (!e.pluginEnabled)
    return o`
      <section class="workboard">
        <div class="callout">
          ${j(`workboard.disabledHelpStart`)}
          <code>${j(`workboard.enableConfigKey`)}</code>${j(`workboard.disabledHelpEnd`)}
        </div>
      </section>
    `;
  let n = Le(e.agentsList, t.cards);
  t.agentFilter = ze(n, t.agentFilter);
  let r = (n) =>
      n
        .filter((e) => t.showArchived || !e.metadata?.archivedAt)
        .filter((t) => Pe(t, e.agentsList, e.scopeAgentId))
        .filter((n) => Ne(n, e.agentsList, t.agentFilter))
        .filter((e) => Xe(e, { query: t.query, priority: t.priorityFilter })),
    i = (n) =>
      r(
        f({
          cards: t.cards,
          preset: n,
          tasksByCardId: t.tasksByCardId,
          sessions: e.sessions,
          defaultAgentId: e.agentsList?.defaultId,
        }),
      ),
    a = i(t.viewPreset),
    s = b({ cards: a, tasksByCardId: t.tasksByCardId, sessions: e.sessions }),
    l = t.error ?? t.lifecycleTaskRefreshError,
    u = B(e),
    m = new Map();
  for (let e of t.statuses) m.set(e, []);
  for (let e of a) m.get(e.status)?.push(e);
  let h =
      t.hideEmptyColumns || t.viewPreset !== `all`
        ? t.statuses.filter((e) => (m.get(e)?.length ?? 0) > 0)
        : t.statuses,
    g = !t.showArchived && t.cards.some((e) => e.metadata?.archivedAt),
    _ =
      t.viewPreset !== `all` ||
      t.query.trim() !== `` ||
      t.priorityFilter !== `all` ||
      t.agentFilter !== `all` ||
      g,
    v = a.length === 0 && _,
    x = t.autoRefreshIntervalMs > 0,
    C = Wt.map((e) => {
      let t = i(e.value).length;
      return {
        value: e.value,
        label: j(e.labelKey),
        description:
          e.value === `all` ? void 0 : j(`workboard.viewPresetCount`, { count: String(t) }),
        disabled: e.value !== `all` && t === 0,
      };
    }),
    w = [
      { value: `all`, label: j(`workboard.allPriorities`) },
      ...d.map((e) => ({ value: e, label: R(e) })),
    ],
    E = n.map((e) => {
      let t = { value: e.id, label: e.label };
      return (e.description && (t.description = e.description), t);
    }),
    D = t.draftOpen || !!pt(t);
  return o`
    <section class="workboard">
      <div class="workboard-main" ?inert=${D} aria-hidden=${D ? `true` : c}>
        <div class="workboard-toolbar">
          <div class="workboard-toolbar__filters">
            <input
              class="input"
              type="search"
              title=${j(`workboard.searchPlaceholder`)}
              placeholder=${j(`workboard.searchPlaceholder`)}
              .value=${t.query}
              @input=${(n) => {
                ((t.query = n.currentTarget.value), e.onRequestUpdate?.());
              }}
            />
            ${V({
              value: t.viewPreset,
              options: C,
              label: j(`workboard.viewPreset`),
              onChange: (e) => {
                t.viewPreset = e;
              },
              requestUpdate: e.onRequestUpdate,
              className: `workboard-select--toolbar`,
              showLabel: !1,
            })}
            ${V({
              value: t.priorityFilter,
              options: w,
              label: j(`workboard.allPriorities`),
              onChange: (e) => {
                t.priorityFilter = e;
              },
              requestUpdate: e.onRequestUpdate,
              className: `workboard-select--toolbar`,
              showLabel: !1,
            })}
            ${
              e.showAgentFilter === !1
                ? c
                : V({
                    value: t.agentFilter,
                    options: E,
                    label: j(`workboard.agentFilter`),
                    onChange: (e) => {
                      t.agentFilter = e;
                    },
                    requestUpdate: e.onRequestUpdate,
                    className: `workboard-select--toolbar workboard-select--toolbar-agent`,
                    showLabel: !1,
                  })
            }
            <button
              class="btn workboard-archive-toggle ${t.showArchived ? `active` : ``}"
              type="button"
              aria-pressed=${t.showArchived}
              @click=${() => {
                ((t.showArchived = !t.showArchived), e.onRequestUpdate?.());
              }}
            >
              ${t.showArchived ? N.eye : N.eyeOff}
              ${t.showArchived ? j(`workboard.hideArchivedShort`) : j(`workboard.showArchivedShort`)}
            </button>
            <div class="workboard-layout-controls">
              <div class="workboard-layout-toggle" role="group" aria-label=${j(`workboard.layout`)}>
                <openclaw-tooltip .content=${j(`workboard.layoutCompact`)}>
                  <button
                    class="btn btn--icon ${t.layout === `compact` ? `active` : ``}"
                    type="button"
                    aria-label=${j(`workboard.layoutCompact`)}
                    aria-pressed=${t.layout === `compact`}
                    @click=${() => {
                      ((t.layout = `compact`), e.onRequestUpdate?.());
                    }}
                  >
                    ${N.layoutCompact}
                  </button>
                </openclaw-tooltip>
                <openclaw-tooltip .content=${j(`workboard.layoutComfortable`)}>
                  <button
                    class="btn btn--icon ${t.layout === `comfortable` ? `active` : ``}"
                    type="button"
                    aria-label=${j(`workboard.layoutComfortable`)}
                    aria-pressed=${t.layout === `comfortable`}
                    @click=${() => {
                      ((t.layout = `comfortable`), e.onRequestUpdate?.());
                    }}
                  >
                    ${N.layoutComfortable}
                  </button>
                </openclaw-tooltip>
              </div>
              ${Ft(t)}
            </div>
            <label class="workboard-toggle">
              <input
                type="checkbox"
                name="workboard-hide-empty-columns"
                .checked=${t.hideEmptyColumns}
                @change=${(n) => {
                  ((t.hideEmptyColumns = n.currentTarget.checked), e.onRequestUpdate?.());
                }}
              />
              <span>${j(`workboard.hideEmptyColumns`)}</span>
            </label>
          </div>
          <div class="workboard-toolbar__actions">
            ${
              x
                ? c
                : o`
                  <button
                    class="btn"
                    type="button"
                    ?disabled=${t.loading || t.dispatching || p(t)}
                    @click=${() => S({ host: e.host, client: e.client, requestUpdate: e.onRequestUpdate, source: `manual`, refreshDiagnostics: Ke(e) })}
                  >
                    ${t.loading ? j(`common.refreshing`) : j(`common.refresh`)}
                  </button>
                `
            }
            <label class="workboard-auto-refresh">
              <span>${j(`workboard.autoRefresh`)}</span>
              <select
                class="input"
                title=${j(`workboard.autoRefresh`)}
                .value=${String(t.autoRefreshIntervalMs)}
                @change=${(n) => {
                  ((t.autoRefreshIntervalMs = Number(n.currentTarget.value)),
                    T({
                      host: e.host,
                      client: e.client,
                      enabled: e.connected && e.pluginEnabled === !0 && t.autoRefreshIntervalMs > 0,
                      requestUpdate: e.onRequestUpdate,
                    }),
                    e.onRequestUpdate?.());
                }}
              >
                ${Ut.map((e) => o`<option value=${String(e.value)}>${j(e.labelKey)}</option>`)}
              </select>
            </label>
            ${
              u
                ? o`
                  <button
                    class="btn"
                    type="button"
                    ?disabled=${t.dispatching || p(t)}
                    @click=${() => ee({ host: e.host, client: e.client, requestUpdate: e.onRequestUpdate })}
                  >
                    ${N.zap} ${j(`workboard.dispatch`)}
                  </button>
                `
                : c
            }
            ${
              u
                ? o`
                  <button
                    class="btn primary"
                    type="button"
                    aria-haspopup="dialog"
                    aria-expanded=${t.draftOpen ? `true` : `false`}
                    aria-controls=${Y}
                    ?disabled=${t.dispatching}
                    @click=${() => {
                      (ht(t), e.onRequestUpdate?.());
                    }}
                  >
                    ${N.plus} ${j(`workboard.newCard`)}
                  </button>
                `
                : c
            }
          </div>
        </div>
        ${Pt(t, s, e.onRequestUpdate)}
        ${l ? o`<div class="callout danger">${l}</div>` : c}
        ${Nt(t)}
        ${
          v || h.length === 0
            ? It()
            : o`
              <div
                class="workboard-board workboard-board--${t.layout} ${h.length === 1 ? `workboard-board--single-column` : ``}"
              >
                ${h.map((t) => Rt(e, t, m.get(t) ?? []))}
              </div>
            `
        }
      </div>
      ${vt(e)} ${Mt(e)}
    </section>
  `;
}
var Bt,
  Vt,
  Y,
  X,
  Z,
  Ht,
  Q,
  Ut,
  Wt,
  Gt = e(() => {
    (u(),
      s(),
      Te(),
      De(),
      Ee(),
      Oe(),
      M(),
      ie(),
      Ve(),
      ge(),
      Be(),
      (Bt = `workboard-card-modal-title`),
      (Vt = `workboard-card-modal-description`),
      (Y = `workboard-card-modal`),
      (X = `workboard-card-detail-drawer`),
      (Z = `workboard-card-detail-title`),
      (Ht = `workboard-card-detail-description`),
      (Q = [
        {
          id: `bugfix`,
          titleKey: `workboard.templateDraft.bugfixTitle`,
          notesKey: `workboard.templateDraft.bugfixNotes`,
          labels: `fix, test`,
          priority: `high`,
        },
        {
          id: `docs`,
          titleKey: `workboard.templateDraft.docsTitle`,
          notesKey: `workboard.templateDraft.docsNotes`,
          labels: `docs`,
          priority: `normal`,
        },
        {
          id: `release`,
          titleKey: `workboard.templateDraft.releaseTitle`,
          notesKey: `workboard.templateDraft.releaseNotes`,
          labels: `release`,
          priority: `urgent`,
        },
        {
          id: `pr_review`,
          titleKey: `workboard.templateDraft.prReviewTitle`,
          notesKey: `workboard.templateDraft.prReviewNotes`,
          labels: `review`,
          priority: `normal`,
        },
        {
          id: `plugin`,
          titleKey: `workboard.templateDraft.pluginTitle`,
          notesKey: `workboard.templateDraft.pluginNotes`,
          labels: `plugin`,
          priority: `normal`,
        },
      ]),
      (Ut = [
        { value: 0, labelKey: `workboard.autoRefreshOff` },
        { value: 5e3, labelKey: `workboard.autoRefresh5s` },
        { value: 15e3, labelKey: `workboard.autoRefresh15s` },
        { value: 3e4, labelKey: `workboard.autoRefresh30s` },
        { value: 6e4, labelKey: `workboard.autoRefresh60s` },
      ]),
      (Wt = [
        { value: `all`, labelKey: `workboard.viewAll` },
        { value: `default_agent`, labelKey: `workboard.viewDefaultAgent` },
        { value: `ready`, labelKey: `workboard.viewReady` },
        { value: `running`, labelKey: `workboard.viewRunning` },
        { value: `blocked`, labelKey: `workboard.viewBlocked` },
        { value: `review`, labelKey: `workboard.viewReview` },
        { value: `stale`, labelKey: `workboard.viewStale` },
        { value: `missing_proof`, labelKey: `workboard.viewMissingProof` },
        { value: `recently_done`, labelKey: `workboard.viewRecentlyDone` },
      ]));
  }),
  $;
e(() => {
  (i(),
    s(),
    Ce(),
    we(),
    xe(),
    Ae(),
    le(),
    he(),
    E(),
    ge(),
    ne(),
    oe(),
    Be(),
    Gt(),
    t(),
    ($ = class extends de {
      constructor(...e) {
        (super(...e),
          (this.requestPageUpdate = () => this.context?.workboard.notify()),
          (this.subscriptions = new re(this)
            .watch(
              () => this.context?.agents,
              (e, t) => e.subscribe(t),
            )
            .effect(
              () => this.context?.agentSelection,
              (e) => {
                let t = () => this.syncWorkboardAgentScope();
                return (t(), e.subscribe(t));
              },
            )
            .effect(
              () => this.context?.runtimeConfig,
              (e) => {
                let t = () => {
                  (this.requestUpdate(), this.ensureInitialData());
                };
                return (t(), e.subscribe(t));
              },
            )
            .watch(
              () => this.context?.sessions,
              (e, t) => e.subscribe(t),
            )
            .effect(
              () => this.context?.workboard,
              (e) => {
                this.syncWorkboardAgentScope();
                let t = e.subscribe(() => this.requestUpdate());
                return () => {
                  (t(), ue(e), ve(e));
                };
              },
            )
            .effect(
              () => this.context?.gateway,
              (e) => {
                let t = (e) => {
                  (e.connected && e.client && this.ensureInitialData(), this.requestUpdate());
                };
                return (t(e.snapshot), e.subscribe(t));
              },
            )));
      }
      connectedCallback() {
        (super.connectedCallback(), this.ensureInitialData(), this.syncWorkboardRuntime());
      }
      updated() {
        this.syncWorkboardRuntime();
      }
      disconnectedCallback() {
        (this.subscriptions.clear(), super.disconnectedCallback());
      }
      ensureInitialData() {
        let e = this.context,
          t = e?.gateway.snapshot;
        !e ||
          !t?.connected ||
          !t.client ||
          (!e.runtimeConfig.state.configSnapshot &&
            !e.runtimeConfig.state.configLoading &&
            e.runtimeConfig.ensureLoaded(),
          !e.agents.state.agentsList && !e.agents.state.agentsLoading && e.agents.ensureList(),
          !e.sessions.state.result && !e.sessions.state.loading && e.sessions.refresh());
      }
      pluginEnabled() {
        let e = this.context?.runtimeConfig.state.configSnapshot;
        return e ? k(e) : null;
      }
      syncWorkboardRuntime() {
        let e = this.context,
          t = e?.gateway.snapshot,
          n = this.pluginEnabled();
        if (!e || !t?.connected || !t.client || n !== !0) {
          e && (ue(e.workboard), ve(e.workboard));
          return;
        }
        let r = e.workboard.state;
        (T({
          host: e.workboard,
          client: t.client,
          enabled: r.autoRefreshIntervalMs > 0,
          requestUpdate: this.requestPageUpdate,
        }),
          h({
            host: e.workboard,
            client: t.client,
            requestUpdate: this.requestPageUpdate,
            refreshDiagnostics: A(t.hello?.auth ?? null),
          }),
          !r.pollRefreshInProgress &&
            !r.dispatching &&
            w({
              host: e.workboard,
              client: t.client,
              sessions: e.sessions.state.result?.sessions ?? [],
              canWrite: A(t.hello?.auth ?? null),
              requestUpdate: this.requestPageUpdate,
            }));
      }
      reloadConfig() {
        let e = this.context;
        e && e.runtimeConfig.refresh({ discardPendingChanges: !0 });
      }
      syncWorkboardAgentScope() {
        let e = this.context;
        if (!e) return;
        let t = e.agentSelection.state.scopeId;
        if (this.observedAgentScopeId !== t) {
          this.observedAgentScopeId = t;
          let n = e.workboard.state,
            r = e.agents.state.agentsList,
            i = (e) => {
              let i = n.cards.find((t) => t.id === e);
              return !!(i && Pe(i, r, t));
            };
          ((n.agentFilter = `all`),
            n.detailCardId &&
              !i(n.detailCardId) &&
              ((n.detailCardId = null), (n.detailCommentBody = ``)),
            n.editingCardId && !i(n.editingCardId) && O(n),
            e.workboard.notify());
        }
      }
      render() {
        let e = this.context;
        if (!e) return c;
        let t = e.gateway.snapshot,
          n = e.runtimeConfig.state,
          r = t.hello?.auth ?? null,
          i = this.pluginEnabled();
        return o`
      <section class="content-header content-header--page">
        <div>
          <div class="page-title">${Se(`workboard`)}</div>
        </div>
        ${ke({ agents: e.agents.state.agentsList?.agents ?? [], selection: e.agentSelection })}
      </section>
      ${zt({
        host: e.workboard,
        client: t.client,
        connected: t.connected,
        canWrite: A(r),
        canModelOverride: be(r),
        pluginEnabled: i,
        pluginEnablementError: !n.configSnapshot && !n.configLoading ? n.lastError : null,
        agentsList: e.agents.state.agentsList,
        sessions: e.sessions.state.result?.sessions ?? [],
        scopeAgentId: e.agentSelection.state.scopeId,
        showAgentFilter: e.agentSelection.state.scopeId === null,
        onOpenSession: (t) => {
          e.navigate(`chat`, { search: m(t), hash: `` });
        },
        onReloadConfig: () => this.reloadConfig(),
        onRequestUpdate: this.requestPageUpdate,
      })}
    `;
      }
    }),
    n([a({ context: ye, subscribe: !0 })], $.prototype, `context`, void 0),
    customElements.get(`openclaw-workboard-page`) ||
      customElements.define(`openclaw-workboard-page`, $));
})();
//# sourceMappingURL=workboard-page-c0wNoflK.js.map
