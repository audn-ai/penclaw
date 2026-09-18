import {
  S as N,
  X as P,
  Z as F,
  c as I,
  d as L,
  dt as R,
  f as z,
  g as B,
  h as V,
  i as H,
  l as U,
  lt as de,
  n as fe,
  p as pe,
  r as me,
  t as he,
  ut as W,
  x as ge,
} from "./chat-model-controls-K1P_ec3p.js";
import {
  G as oe,
  K as se,
  M as ce,
  P as le,
  W as ue,
  f as T,
  l as E,
  q as D,
} from "./control-ui-core--EZfp09c.js";
import {
  Cn as _,
  Hn as v,
  In as y,
  Rn as b,
  Wa as x,
  _a as S,
  da as C,
  di as ne,
  fi as re,
  ga as w,
  la as ie,
  tn as ae,
} from "./control-ui-core-BcbHa4vB.js";
import {
  at as r,
  et as i,
  it as a,
  nt as o,
  ot as s,
  rt as c,
  tt as ee,
} from "./control-ui-core-CFS5NQSC.js";
import { $ as A, J as j, Q as M } from "./control-ui-core-CQDTaMS5.js";
import { o as O, t as k } from "./control-ui-core-CwQmiouz.js";
import { dt as l, ft as u } from "./control-ui-foundation-0uuDj0X3.js";
import { _ as t, g as n } from "./control-ui-foundation-CCDffryi.js";
import { tt as g } from "./control-ui-foundation-s2wA1PVE.js";
import { G as d, Y as f, Z as te, at as p, et as m, nt as h } from "./lit-runtime-DkvDG939.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
import { t as ve } from "./web-awesome-popover-7IMHqElx.js";
import { t as _e } from "./web-awesome-select-Bk_xnNvy.js";
var ye = e(() => {}),
  G,
  be = e(() => {
    (de(),
      (G = class {
        constructor(e) {
          ((this.notify = e),
            (this.attachments = []),
            (this.pendingReads = 0),
            (this.readController = new AbortController()));
        }
        get readSignal() {
          return this.readController.signal;
        }
        replace(e) {
          ((this.attachments = e), this.notify());
        }
        updatePending(e, t) {
          this.readController.signal === e &&
            ((this.pendingReads = Math.max(0, this.pendingReads + t)), this.notify());
        }
        abortReads() {
          (this.readController.abort(),
            (this.readController = new AbortController()),
            (this.pendingReads = 0),
            this.notify());
        }
        reset(e) {
          (this.abortReads(),
            e.release && W(this.attachments),
            (this.attachments = []),
            this.notify());
        }
        clearAfterSubmit(e) {
          (e && W(this.attachments), (this.attachments = []), this.notify());
        }
      }));
  });
function xe(e, t) {
  t.submitting ||
    e.key !== `Enter` ||
    e.shiftKey ||
    e.isComposing ||
    e.keyCode === 229 ||
    ((!t.requiresModifier || e.metaKey || e.ctrlKey) && (e.preventDefault(), t.onSubmit()));
}
function Se(e) {
  let t = e.submitting ? O(`newSession.starting`) : O(`newSession.start`),
    n = {
      attachments: e.attachments,
      disabled: e.submitting,
      getAttachments: e.getAttachments,
      draft: e.message,
      getDraft: () => e.message,
      onAttachmentsChange: e.onAttachmentsChange,
      onDraftChange: e.onInput,
      onPendingReadsChange: e.onPendingReadsChange,
      readSignal: e.readSignal,
    };
  return p`
    <div class="agent-chat__composer-shell new-session-page__composer">
      <div class="agent-chat__input">
        ${z(n)} ${L(n)}
        <div class="agent-chat__composer-input-row">
          ${pe(n)}
          <div class="agent-chat__composer-combobox">
            <textarea
              class="new-session-page__message"
              rows="3"
              ?disabled=${e.submitting}
              placeholder=${O(`newSession.messagePlaceholder`)}
              .value=${e.message}
              @input=${(t) => e.onInput(t.target.value)}
              @keydown=${(t) => xe(t, e)}
              @paste=${(t) => {
                e.submitting || I(t, n);
              }}
            ></textarea>
          </div>
          <div class="agent-chat__composer-actions">
            <openclaw-tooltip content=${O(`newSession.start`)}>
              <button
                type="button"
                class="chat-send-btn"
                ?disabled=${!e.canSubmit}
                aria-label=${t}
                @click=${e.onSubmit}
              >
                ${e.submitting ? M.loader : M.arrowUp}
              </button>
            </openclaw-tooltip>
          </div>
        </div>
        ${
          e.modelControl && e.modelControl !== h
            ? p`<div class="agent-chat__composer-footer">
              <div class="agent-chat__composer-controls">${e.modelControl}</div>
            </div>`
            : h
        }
        ${
          e.pendingAttachmentReads > 0
            ? p`<span class="agent-chat__sr-only" role="status"
              >${O(`newSession.readingAttachment`)}</span
            >`
            : h
        }
      </div>
    </div>
  `;
}
function Ce(e) {
  let t = e.attachmentDraft.readSignal;
  return Se({
    attachments: e.attachmentDraft.attachments,
    canSubmit: e.canSubmit,
    getAttachments: () => e.attachmentDraft.attachments,
    message: e.message,
    modelControl: e.isCatalogTarget
      ? h
      : e.modelControl.render({
          agentDefaultModel: e.agentDefaultModel,
          agentId: e.agentId,
          context: e.context,
          sending: e.submitting,
        }),
    pendingAttachmentReads: e.attachmentDraft.pendingReads,
    readSignal: t,
    requiresModifier: e.requiresModifier,
    submitting: e.submitting,
    onAttachmentsChange: (t) => {
      e.submitting || e.attachmentDraft.replace(t);
    },
    onPendingReadsChange: (n) => e.attachmentDraft.updatePending(t, n),
    onInput: e.onInput,
    onSubmit: e.onSubmit,
  });
}
var we = e(() => {
  (m(), A(), j(), k(), U());
});
function K(e) {
  let t = e.trim();
  return !t || q.test(t);
}
function Te(e) {
  let t = g(e.cwd),
    n = g(e.workspace),
    r = g(e.execNode),
    i = g(e.catalogId),
    a = g(e.model),
    o = t && t !== n ? t : void 0;
  return {
    agentId: v(e.agentId),
    message: e.message,
    ...(e.attachments?.length ? { attachments: e.attachments } : {}),
    ...(i ? { catalogId: i } : {}),
    ...(!i && a ? { model: a } : {}),
    ...(e.worktree
      ? {
          worktree: !0,
          ...(g(e.baseRef) ? { worktreeBaseRef: g(e.baseRef) } : {}),
          ...(g(e.worktreeName) ? { worktreeName: g(e.worktreeName) } : {}),
          ...(o && !r ? { cwd: o } : {}),
        }
      : {}),
    ...(r ? { execNode: r, ...(t ? { cwd: t } : {}) } : {}),
  };
}
var q,
  J = e(() => {
    (b(), x(), (q = /^[a-z0-9][a-z0-9-]{0,63}$/));
  });
function Ee(e) {
  return (Array.isArray(e) ? e : [])
    .flatMap((e) => {
      let t = e,
        n = g(t.nodeId),
        r = Array.isArray(t.commands) ? t.commands.filter((e) => typeof e == `string`) : [];
      if (!n) return [];
      let i = t.connected === !0,
        a = i && r.includes(`system.run`);
      return [
        {
          nodeId: n,
          displayName: g(t.displayName) ?? n,
          connected: i,
          canExec: a,
          canBrowse: a && r.includes(`fs.listDir`),
        },
      ];
    })
    .toSorted(
      (e, t) => e.displayName.localeCompare(t.displayName) || e.nodeId.localeCompare(t.nodeId),
    );
}
var De = e(() => {
    x();
  }),
  Y,
  Oe = e(() => {
    (b(),
      he(),
      (Y = class {
        constructor(e) {
          ((this.notify = e),
            (this.requestToken = 0),
            (this.catalog = []),
            (this.loading = !1),
            (this.selected = ``));
        }
        invalidate(e = !1) {
          ((this.requestToken += 1),
            (this.loading = !1),
            (this.catalog = []),
            e && (this.selected = ``));
        }
        reset() {
          (this.invalidate(!0), this.notify());
        }
        load(e, t, n) {
          let r = e?.gateway.snapshot,
            i = r?.client,
            a = v(t),
            o = ++this.requestToken;
          if (((this.catalog = []), !r?.connected || !i || !a || !n)) {
            ((this.loading = !1), this.notify());
            return;
          }
          ((this.loading = !0),
            this.notify(),
            i
              .request(`chat.metadata`, { agentId: a })
              .then((e) => {
                o === this.requestToken && (this.catalog = Array.isArray(e.models) ? e.models : []);
              })
              .catch(() => {
                o === this.requestToken && (this.catalog = []);
              })
              .finally(() => {
                o === this.requestToken && ((this.loading = !1), this.notify());
              }));
        }
        render(e) {
          let t = e.context?.gateway.snapshot,
            n = `new-session:${v(e.agentId)}`;
          return fe({
            activeRunId: null,
            agentDefaultModel: e.agentDefaultModel,
            connected: t?.connected === !0,
            gatewayAvailable: !!t?.client,
            loading: !1,
            modelCatalog: this.catalog,
            modelOverrides: { [n]: this.selected },
            modelSwitching: !1,
            modelsLoading: this.loading,
            mode: `model`,
            sending: e.sending,
            sessionKey: n,
            sessionsResult: e.context?.sessions.state.result ?? null,
            stream: null,
            onModelSelect: (e) => {
              this.selected = e;
            },
            onRequestUpdate: this.notify,
          });
        }
      }));
  });
function X(e) {
  return e.split(/[\\/]/).findLast((e) => e.length > 0) ?? e;
}
function Z(e) {
  return e.startsWith(`/`) || e.startsWith(`\\`) || /^[A-Za-z]:[\\/]/.test(e);
}
var ke = e(() => {});
function Ae(e) {
  let t = e.context.gateway.snapshot,
    n = {
      id: w(),
      text: e.message,
      attachments: e.attachments,
      createdAt: Date.now(),
      kind: `queued`,
      refreshSessions: !0,
      sendAttempts: 1,
      sendError: e.error,
      sendState: `failed`,
      sessionKey: e.sessionKey,
      agentId: v(e.agentId),
    };
  return P(
    {
      settings: T(),
      assistantAgentId: t.assistantAgentId,
      agentsList: e.context.agents.state.agentsList,
      hello: t.hello,
    },
    e.sessionKey,
    n,
  )
    ? !1
    : (B(e.sessionKey, { ...n, sendRunId: w() }), !0);
}
var je = e(() => {
    (E(), b(), S(), F(), V());
  }),
  Q,
  $;
e(() => {
  (l(),
    m(),
    d(),
    D(),
    oe(),
    le(),
    E(),
    A(),
    j(),
    ve(),
    _e(),
    k(),
    ae(),
    b(),
    x(),
    C(),
    re(),
    R(),
    ye(),
    N(),
    me(),
    be(),
    ee(),
    we(),
    J(),
    De(),
    Oe(),
    ke(),
    je(),
    t(),
    (Q = [0, 1e3, 3e3]),
    ($ = class extends ie {
      constructor(...e) {
        (super(...e),
          (this.agentId = ``),
          (this.folder = ``),
          (this.worktree = !1),
          (this.worktreeName = ``),
          (this.baseRef = ``),
          (this.branches = null),
          (this.branchesLoading = !1),
          (this.nodes = []),
          (this.execNode = ``),
          (this.message = ``),
          (this.submitting = !1),
          (this.submissionOutcomeUnknown = !1),
          (this.error = null),
          (this.catalogRetrying = !1),
          (this.browserOpen = !1),
          (this.browserLoading = !1),
          (this.browserError = null),
          (this.browserListing = null),
          (this.browserTarget = null),
          (this.wherePopoverOpen = !1),
          (this.wherePopoverHiding = !1),
          (this.folderPopoverHiding = !1),
          (this.browserPathDraft = ``),
          (this.openedFor = null),
          (this.agentsHydrated = !1),
          (this.nodesHydrated = !1),
          (this.agentSelectedByUser = !1),
          (this.folderSelectedByUser = !1),
          (this.submitRequestToken = 0),
          (this.nodesRequestToken = 0),
          (this.branchesRequestToken = 0),
          (this.baseRefEditGeneration = 0),
          (this.browserRequestToken = 0),
          (this.attachmentDraft = new G(() => this.requestUpdate())),
          (this.modelControl = new Y(() => this.requestUpdate())),
          (this.gatewaySource = null),
          (this.gatewayClient = null),
          (this.gatewayConnected = !1),
          (this.gatewayConnectionEpoch = 0),
          (this.catalogRetryScope = ``),
          (this.catalogRetryAttempt = 0),
          (this.subscriptions = new ne(this)
            .watch(
              () => this.context?.gateway,
              (e, t) => e.subscribe(t),
              (e) => this.synchronizeGateway(e),
            )
            .watch(
              () => this.context?.agents,
              (e, t) => e.subscribe(t),
            )
            .watch(
              () => this.context?.sessions,
              (e, t) => e.subscribe(t),
            )),
          (this.handleCatalogRetry = () => {
            if (this.catalogRetrying || !this.gatewayConnected || !c(this.data) || o(this.data))
              return;
            let e = this.context?.revalidate(`new-session`);
            e &&
              (globalThis.clearTimeout(this.catalogRetryTimer),
              (this.catalogRetryTimer = void 0),
              (this.catalogRetrying = !0),
              e
                .catch(() => void 0)
                .then(() => this.updateComplete)
                .finally(() => {
                  ((this.catalogRetrying = !1), this.retryPendingCatalogTarget());
                }));
          }));
      }
      synchronizeGateway(e) {
        let t = e.snapshot,
          n = this.gatewaySource === null,
          r = !n && (this.gatewaySource !== e || this.gatewayClient !== t.client),
          i = !n && this.gatewayConnected !== t.connected,
          a = t.connected && (r || !this.gatewayConnected);
        ((this.gatewaySource = e),
          (this.gatewayClient = t.client),
          (this.gatewayConnected = t.connected),
          (r || i) && this.invalidateGatewayDiscovery(r),
          a && ((this.gatewayConnectionEpoch += 1), this.retryPendingCatalogTarget()));
      }
      invalidateGatewayDiscovery(e) {
        ((this.nodesRequestToken += 1),
          (this.nodesHydrated = !1),
          (this.branchesRequestToken += 1),
          (this.branchesLoading = !1),
          (this.branches = null),
          (this.baseRef = ``),
          (this.agentsHydrated = !1),
          this.modelControl.invalidate(e),
          this.attachmentDraft.abortReads(),
          this.closeBrowser(),
          this.invalidateSubmission(!0),
          e &&
            ((this.agentId = ``),
            (this.agentSelectedByUser = !1),
            (this.folder = ``),
            (this.folderSelectedByUser = !1),
            (this.worktree = !1),
            (this.worktreeName = ``),
            (this.baseRefEditGeneration += 1),
            (this.nodes = []),
            (this.execNode = ``),
            (this.error = null)));
      }
      retryPendingCatalogTarget() {
        if (this.catalogRetrying) return;
        if (!this.gatewayConnected || !c(this.data) || o(this.data)) {
          (globalThis.clearTimeout(this.catalogRetryTimer),
            (this.catalogRetryTimer = void 0),
            (this.catalogRetryScope = ``),
            (this.catalogRetryAttempt = 0));
          return;
        }
        let e = `${this.gatewayConnectionEpoch}:${s(this.data)}`;
        if (
          (this.catalogRetryScope !== e &&
            (globalThis.clearTimeout(this.catalogRetryTimer),
            (this.catalogRetryTimer = void 0),
            (this.catalogRetryScope = e),
            (this.catalogRetryAttempt = 0)),
          this.catalogRetryTimer || this.catalogRetryAttempt >= Q.length)
        )
          return;
        let t = Q[this.catalogRetryAttempt];
        ((this.catalogRetryAttempt += 1),
          (this.catalogRetryTimer = globalThis.setTimeout(() => {
            if (
              ((this.catalogRetryTimer = void 0),
              this.catalogRetryScope !== e ||
                !this.gatewayConnected ||
                !c(this.data) ||
                o(this.data))
            )
              return;
            let t = this.context?.revalidate(`new-session`);
            t &&
              t
                .catch(() => void 0)
                .then(() => this.updateComplete)
                .then(() => this.retryPendingCatalogTarget());
          }, t)));
      }
      disconnectedCallback() {
        (this.subscriptions.clear(),
          this.invalidateGatewayDiscovery(!0),
          (this.gatewaySource = null),
          (this.gatewayClient = null),
          (this.gatewayConnected = !1),
          (this.gatewayConnectionEpoch = 0),
          (this.catalogRetryScope = ``),
          (this.catalogRetryAttempt = 0),
          globalThis.clearTimeout(this.catalogRetryTimer),
          (this.catalogRetryTimer = void 0),
          this.attachmentDraft.reset({ release: !0 }),
          super.disconnectedCallback());
      }
      updated() {
        this.retryPendingCatalogTarget();
        let e = this.context?.agents.state,
          t = !!(
            this.gatewayConnected &&
            this.gatewayClient &&
            e?.connected &&
            e.client === this.gatewayClient &&
            this.agents().length > 0
          ),
          n = s(this.data);
        if (this.openedFor !== n) {
          ((this.openedFor = n), (this.agentsHydrated = t), this.resetDraft());
          return;
        }
        !this.agentsHydrated &&
          t &&
          ((this.agentsHydrated = !0),
          this.adoptAgentDefaults({ preserveSelectedAgent: !0, preserveSelectedFolder: !0 }));
      }
      agents() {
        return this.context?.agents.state.agentsList?.agents ?? [];
      }
      selectedAgent() {
        let e = v(this.agentId);
        return this.agents().find((t) => v(t.id) === e);
      }
      execNodes() {
        return this.nodes.filter((e) => e.canExec);
      }
      isAdmin() {
        return ce(this.context?.gateway.snapshot.hello?.auth ?? null);
      }
      workspacePath() {
        return g(this.selectedAgent()?.workspace) ?? ``;
      }
      usesCustomFolder() {
        let e = this.folder.trim();
        return !!e && e !== this.workspacePath();
      }
      adoptAgentDefaults(e = {}) {
        let t = this.agents(),
          n = this.context?.agents.state.agentsList?.defaultId ?? t[0]?.id ?? `main`;
        (e.preserveSelectedAgent && this.agentSelectedByUser && this.selectedAgent()) ||
          ((this.agentId = r(this.data, t, n)), (this.agentSelectedByUser = !1));
        let i = e.preserveSelectedFolder && this.folderSelectedByUser;
        (!this.execNode &&
          !i &&
          ((this.folder = this.workspacePath()), (this.folderSelectedByUser = !1)),
          this.loadNodes(),
          this.modelControl.load(this.context, this.agentId, !c(this.data)),
          this.maybeLoadBranches());
      }
      resetDraft() {
        (this.invalidateSubmission(),
          (this.submissionOutcomeUnknown = !1),
          (this.agentSelectedByUser = !1),
          (this.folder = ``),
          (this.folderSelectedByUser = !1),
          (this.worktree = !1),
          (this.worktreeName = ``),
          (this.baseRef = ``),
          (this.branches = null),
          (this.branchesLoading = !1),
          (this.execNode = ``),
          (this.message = ``),
          this.modelControl.reset(),
          this.attachmentDraft.reset({ release: !0 }),
          (this.error = null),
          (this.wherePopoverHiding = !1),
          (this.folderPopoverHiding = !1),
          this.closeWherePopover(),
          this.closeBrowser(),
          this.adoptAgentDefaults(),
          this.updateComplete.then(() => {
            this.querySelector(`.new-session-page__message`)?.focus();
          }));
      }
      invalidateSubmission(e = !1) {
        ((this.submitRequestToken += 1),
          e && this.submitting && (this.submissionOutcomeUnknown = !0),
          (this.submitting = !1));
      }
      async loadNodes() {
        let e = ++this.nodesRequestToken;
        this.nodesHydrated = !1;
        let t = this.context?.gateway.snapshot,
          n = t?.client;
        if (!t?.connected || !n || !this.isAdmin()) {
          ((this.nodes = []), (this.nodesHydrated = !0));
          return;
        }
        try {
          let t = await n.request(`node.list`, {});
          if (e !== this.nodesRequestToken) return;
          let r = Ee(t?.nodes);
          ((this.nodes = r),
            (this.nodesHydrated = !0),
            this.execNode &&
              !r.some((e) => e.nodeId === this.execNode && e.canExec) &&
              ((this.execNode = ``),
              (this.folder = this.workspacePath()),
              (this.folderSelectedByUser = !1),
              (this.worktree = !1),
              (this.worktreeName = ``),
              this.closeBrowser(),
              this.maybeLoadBranches()));
        } catch {
          e === this.nodesRequestToken && ((this.nodes = []), (this.nodesHydrated = !0));
        }
      }
      maybeLoadBranches() {
        let e = ++this.branchesRequestToken,
          t = this.baseRefEditGeneration;
        if (
          ((this.branches = null), (this.branchesLoading = !1), (this.baseRef = ``), this.execNode)
        )
          return;
        let n = this.folder.trim() || this.workspacePath(),
          r = this.selectedAgent(),
          i = n === this.workspacePath();
        if (!n || (i && r?.workspaceGit !== !0)) {
          this.branches = null;
          return;
        }
        let a = this.context?.gateway.snapshot,
          o = a?.client;
        !a?.connected ||
          !o ||
          ((this.branchesLoading = !0),
          o
            .request(`worktrees.branches`, { repoRoot: n })
            .then((r) => {
              e === this.branchesRequestToken &&
                ((this.branches = r ? { ...r, repoRoot: n } : null),
                t === this.baseRefEditGeneration &&
                  (this.baseRef = r?.defaultBranch ?? r?.headBranch ?? ``));
            })
            .catch(() => {
              e === this.branchesRequestToken && (this.branches = null);
            })
            .finally(() => {
              e === this.branchesRequestToken && (this.branchesLoading = !1);
            }));
      }
      worktreeAvailable() {
        return this.execNode
          ? !1
          : this.usesCustomFolder()
            ? this.isAdmin()
            : this.selectedAgent()?.workspaceGit === !0;
      }
      canSubmit() {
        return !(
          this.submitting ||
          this.submissionOutcomeUnknown ||
          this.attachmentDraft.pendingReads > 0 ||
          (!this.message.trim() && this.attachmentDraft.attachments.length === 0) ||
          !this.context?.gateway.snapshot.connected ||
          this.agents().length === 0 ||
          !i(this.data, this.selectedAgent()) ||
          (this.execNode &&
            (!this.nodesHydrated || !this.execNodes().some((e) => e.nodeId === this.execNode))) ||
          (this.usesCustomFolder() && (!this.isAdmin() || (!this.execNode && !this.worktree))) ||
          (this.execNode && this.worktree) ||
          (this.worktree && !this.worktreeAvailable()) ||
          (this.worktree && !K(this.worktreeName))
        );
      }
      async submit() {
        let e = this.context;
        if (!e || !this.canSubmit()) return;
        let t = this.message.trim(),
          n = this.attachmentDraft.attachments,
          r = ++this.submitRequestToken;
        ((this.submitting = !0),
          (this.error = null),
          this.closeWherePopover(),
          this.closeBrowser());
        for (let e of this.querySelectorAll(`wa-dropdown[open]`)) e.open = !1;
        try {
          let i = await e.sessions.createResult(
            Te({
              agentId: this.agentId,
              message: t,
              model: this.modelControl.selected,
              attachments: ge(n),
              worktree: this.worktree,
              baseRef: this.baseRef,
              worktreeName: this.worktreeName,
              cwd: this.folder,
              workspace: this.workspacePath(),
              execNode: this.execNode,
              catalogId: this.data?.catalogId,
            }),
          );
          if (r !== this.submitRequestToken) return;
          if (!i) {
            this.error = e.sessions.state.error ?? O(`newSession.createFailed`);
            return;
          }
          let a =
            i.initialRun.status === `rejected` &&
            Ae({
              agentId: this.agentId,
              attachments: n,
              context: e,
              error: i.initialRun.error,
              message: t,
              sessionKey: i.key,
            });
          (this.attachmentDraft.clearAfterSubmit(!a),
            e.gateway.setSessionKey(i.key),
            e.navigate(`chat`, { search: _(i.key) }));
        } finally {
          r === this.submitRequestToken && (this.submitting = !1);
        }
      }
      selectAgentId(e) {
        this.submitting ||
          c(this.data) ||
          (v(e) !== v(this.agentId) &&
            ((this.agentId = v(e)),
            this.modelControl.reset(),
            (this.agentSelectedByUser = !0),
            (this.folder = this.execNode ? `` : this.workspacePath()),
            (this.folderSelectedByUser = !1),
            (this.worktree = !1),
            (this.worktreeName = ``),
            this.closeBrowser(),
            this.modelControl.load(this.context, this.agentId, !0),
            this.maybeLoadBranches()));
      }
      applyFolder(e, t = this.execNode) {
        this.submitting ||
          ((this.execNode = t),
          (this.folder = e.trim()),
          (this.folderSelectedByUser = !0),
          this.execNode ? (this.worktree = !1) : this.usesCustomFolder() && (this.worktree = !0),
          this.maybeLoadBranches());
      }
      selectExecNode(e) {
        this.submitting ||
          (e !== this.execNode &&
            ((this.execNode = e),
            (this.folder = e ? `` : this.workspacePath()),
            (this.folderSelectedByUser = !1),
            (this.worktree = !1),
            this.closeBrowser(),
            this.maybeLoadBranches()));
      }
      browseAvailable() {
        return this.isAdmin();
      }
      nodeBrowseBlockedReason(e) {
        if (!e.canBrowse)
          return e.connected ? O(`newSession.nodeCannotBrowse`) : O(`newSession.nodeOffline`);
      }
      closeBrowser() {
        ((this.browserRequestToken += 1),
          (this.browserOpen = !1),
          (this.browserLoading = !1),
          (this.browserError = null),
          (this.browserListing = null),
          (this.browserTarget = null),
          (this.browserPathDraft = ``));
        let e = this.querySelector(`.new-session-page__select--folder`);
        e && (e.open = !1);
      }
      closeWherePopover() {
        this.wherePopoverOpen = !1;
        let e = this.querySelector(`.new-session-page__where-popover`);
        e && (e.open = !1);
      }
      guardPopoverTransition(e, t) {
        t && (e.preventDefault(), e.stopImmediatePropagation());
      }
      restorePopoverTrigger(e, t) {
        let n = this.ownerDocument.activeElement,
          r = this.querySelector(t);
        (n && n !== this.ownerDocument.body && !r?.contains(n)) ||
          this.querySelector(`#${e}`)?.focus();
      }
      showBrowserRoot() {
        ((this.browserRequestToken += 1),
          (this.browserLoading = !1),
          (this.browserError = null),
          (this.browserListing = null),
          (this.browserTarget = null),
          (this.browserPathDraft = ``));
      }
      usableBrowserPath() {
        let e = this.browserPathDraft.trim();
        return e.length === 0 ? `` : Z(e) ? e : null;
      }
      selectBrowserTarget(e) {
        let t = this.folder.trim(),
          n = e.nodeId === this.execNode && Z(t) ? t : void 0;
        ((this.browserTarget = e), this.loadBrowser(n));
      }
      loadBrowser(e) {
        let t = this.context?.gateway.snapshot,
          n = t?.client,
          r = this.browserTarget;
        if (!t?.connected || !n || !r) return;
        let i = this.nodes.find((e) => e.nodeId === r.nodeId);
        if (i?.canExec && !i.canBrowse) {
          (this.showBrowserRoot(), (this.browserTarget = r), (this.browserPathDraft = e ?? ``));
          return;
        }
        let a = ++this.browserRequestToken;
        ((this.browserLoading = !0),
          (this.browserError = null),
          (this.browserListing = null),
          (this.browserPathDraft = e ?? ``));
        let o = this.browserPathDraft;
        n.request(`fs.listDir`, {
          ...(e ? { path: e } : {}),
          ...(r.nodeId ? { nodeId: r.nodeId } : {}),
        })
          .then((e) => {
            a === this.browserRequestToken &&
              ((this.browserListing = e ?? null),
              e?.path && this.browserPathDraft === o && (this.browserPathDraft = e.path));
          })
          .catch(() => {
            if (a === this.browserRequestToken) {
              if (e) {
                this.loadBrowser(void 0);
                return;
              }
              this.browserError = O(`newSession.browserLoadFailed`);
            }
          })
          .finally(() => {
            a === this.browserRequestToken && (this.browserLoading = !1);
          });
      }
      renderBrowser() {
        if (!this.browserOpen) return h;
        let e = this.browserListing,
          t = this.browserTarget,
          n = e?.entries ?? [];
        return p`
      <div class="new-session-page__browser">
        <div class="new-session-page__browser-head">
          <button
            type="button"
            class="new-session-page__browser-nav"
            title=${O(`newSession.browserUp`)}
            aria-label=${O(`newSession.browserUp`)}
            ?disabled=${!t || (!e && this.browserLoading)}
            @click=${() => {
              e?.parent ? this.loadBrowser(e.parent) : t && this.showBrowserRoot();
            }}
          >
            ${M.arrowLeft}
          </button>
          ${
            t
              ? p`
                <input
                  class="new-session-page__browser-path"
                  type="text"
                  aria-label=${O(`newSession.folder`)}
                  placeholder=${t.label}
                  .value=${this.browserPathDraft}
                  @input=${(e) => {
                    this.browserPathDraft = e.target.value;
                  }}
                  @keydown=${(e) => {
                    if (e.key === `Enter`) {
                      e.preventDefault();
                      let t = this.browserPathDraft.trim();
                      this.loadBrowser(t || void 0);
                    }
                  }}
                />
              `
              : p`<span class="new-session-page__browser-path">${O(`newSession.where`)}</span>`
          }
          ${this.browserLoading ? p`<span class="new-session-page__browser-loading">${O(`common.loading`)}</span>` : h}
          <button
            type="button"
            class="new-session-page__browser-nav"
            title=${O(`common.close`)}
            aria-label=${O(`common.close`)}
            @click=${() => this.closeBrowser()}
          >
            ${M.x}
          </button>
        </div>
        ${this.browserError ? p`<div class="new-session-page__error">${this.browserError}</div>` : h}
        <div
          class="new-session-page__browser-list"
          role="group"
          aria-label=${O(`newSession.folder`)}
        >
          ${
            t
              ? h
              : p`
                <button
                  type="button"
                  class="new-session-page__browser-entry"
                  @click=${() => this.selectBrowserTarget({ nodeId: ``, label: O(`newSession.gateway`) })}
                >
                  <span class="new-session-page__target-icon" aria-hidden="true"
                    >${M.monitor}</span
                  >
                  <span>${O(`newSession.gateway`)}</span>
                </button>
                ${this.nodes.map(
                  (e) => p`
                    <button
                      type="button"
                      class="new-session-page__browser-entry"
                      ?disabled=${!e.canExec}
                      title=${this.nodeBrowseBlockedReason(e) ?? h}
                      @click=${() => this.selectBrowserTarget({ nodeId: e.nodeId, label: e.displayName })}
                    >
                      <span class="new-session-page__target-icon" aria-hidden="true"
                        >${M.monitor}</span
                      >
                      <span>${e.displayName}</span>
                    </button>
                  `,
                )}
              `
          }
          ${
            e && n.length === 0 && !this.browserLoading
              ? p`<div class="new-session-page__browser-empty">
                ${O(`newSession.browserEmpty`)}
              </div>`
              : h
          }
          ${
            t
              ? n.map(
                  (e) => p`
                  <button
                    type="button"
                    class="new-session-page__browser-entry ${e.hidden ? `new-session-page__browser-entry--hidden` : ``}"
                    title=${e.hidden ? O(`newSession.hiddenFolder`) : h}
                    @click=${() => this.loadBrowser(e.path)}
                  >
                    <span class="new-session-page__target-icon" aria-hidden="true"
                      >${M.folder}</span
                    >
                    <span>${e.name}</span>
                  </button>
                `,
                )
              : h
          }
        </div>
        <div class="new-session-page__browser-actions">
          <button
            type="button"
            class="new-session-page__browser-use"
            ?disabled=${!t || this.usableBrowserPath() === null}
            @click=${() => {
              let e = this.usableBrowserPath();
              t && e !== null && (this.applyFolder(e, t.nodeId), this.closeBrowser());
            }}
          >
            ${O(`newSession.browserUse`)}
          </button>
        </div>
      </div>
    `;
      }
      renderMenuItem(e) {
        return p`
      <button
        type="button"
        class="session-menu__item"
        data-value=${e.value}
        data-popover=${e.keepOpen ? h : `close`}
        aria-pressed=${String(e.checked)}
        title=${e.title ?? h}
        ?disabled=${this.submitting || (e.disabled ?? !1)}
        @click=${e.onSelect}
      >
        <span class="session-menu__check" aria-hidden="true"
          >${e.checked ? M.check : h}</span
        >
        <span class="session-menu__text">${e.label}</span>
      </button>
    `;
      }
      renderAgentSelect(e) {
        return p`
      <wa-select
        class="new-session-page__select new-session-page__agent-select"
        label=${O(`newSession.agent`)}
        .value=${this.agentId}
        ?disabled=${this.submitting}
        @change=${(e) => {
          let t = e.currentTarget.value;
          t && this.selectAgentId(t);
        }}
      >
        <span slot="start" class="new-session-page__target-icon" aria-hidden="true"
          >${M.bot}</span
        >
        ${e.map(
          (e) => p`
            <wa-option
              value=${v(e.id)}
              .label=${e.identity?.name ?? e.name ?? e.id}
            >
              ${e.identity?.name ?? e.name ?? e.id}
            </wa-option>
          `,
        )}
      </wa-select>
    `;
      }
      renderWhereSelect() {
        let e = this.execNodes(),
          t = this.isAdmin() && e.length > 0,
          n = e.find((e) => e.nodeId === this.execNode),
          r = this.execNode ? (n?.displayName ?? this.execNode) : O(`newSession.gateway`),
          i = this.usesCustomFolder(),
          a = this.worktreeAvailable(),
          o = this.branches;
        return p`
      <span class="new-session-page__select">
        <button
          id="new-session-where-trigger"
          type="button"
          class="new-session-page__trigger ${this.wherePopoverHiding ? `new-session-page__trigger--hiding` : ``}"
          title=${O(`newSession.where`)}
          data-worktree=${String(this.worktree)}
          aria-haspopup="dialog"
          aria-expanded=${String(this.wherePopoverOpen)}
          ?disabled=${this.submitting}
          @click=${(e) => this.guardPopoverTransition(e, this.wherePopoverHiding)}
        >
          <span class="new-session-page__target-icon" aria-hidden="true">${M.monitor}</span>
          <span class="new-session-page__trigger-label">${r}</span>
          ${
            this.worktree
              ? p`<span class="new-session-page__target-icon" aria-hidden="true"
                >${M.gitBranch}</span
              >`
              : h
          }
          <span class="new-session-page__trigger-chevron" aria-hidden="true"
            >${M.chevronDown}</span
          >
        </button>
      </span>
      <wa-popover
        class="new-session-page__select new-session-page__where-popover"
        for="new-session-where-trigger"
        placement="bottom-start"
        without-arrow
        @wa-show=${() => {
          this.wherePopoverOpen = !0;
        }}
        @wa-hide=${() => {
          ((this.wherePopoverOpen = !1), (this.wherePopoverHiding = !0));
        }}
        @wa-after-hide=${() => {
          ((this.wherePopoverHiding = !1),
            this.restorePopoverTrigger(
              `new-session-where-trigger`,
              `.new-session-page__where-popover`,
            ));
        }}
      >
        ${
          t
            ? p`
              <div class="new-session-page__menu-title">${O(`newSession.where`)}</div>
              ${this.renderMenuItem({
                value: `gateway`,
                label: O(`newSession.gateway`),
                checked: !this.execNode,
                onSelect: () => {
                  this.selectExecNode(``);
                },
              })}
              ${e.map((e) =>
                this.renderMenuItem({
                  value: `node:${e.nodeId}`,
                  label: e.displayName,
                  checked: this.execNode === e.nodeId,
                  onSelect: () => {
                    this.selectExecNode(e.nodeId);
                  },
                }),
              )}
            `
            : h
        }
        ${
          this.execNode
            ? h
            : p`
              ${t ? p`<div class="session-menu__separator" role="separator"></div>` : h}
              ${this.renderMenuItem({
                value: `worktree`,
                label: O(`newSession.worktree`),
                checked: this.worktree,
                disabled: !a || i,
                title: O(
                  a ? `chat.runControls.newSessionWorktree` : `newSession.worktreeUnavailable`,
                ),
                onSelect: () => {
                  ((this.worktree = !this.worktree), this.worktree && this.maybeLoadBranches());
                },
                keepOpen: !0,
              })}
              ${
                this.worktree
                  ? p`
                    <label class="new-session-page__menu-field">
                      <span>${O(`newSession.baseBranch`)}</span>
                      <input
                        type="text"
                        list="new-session-branches"
                        ?disabled=${this.submitting}
                        placeholder=${this.branchesLoading ? O(`common.loading`) : (o?.defaultBranch ?? O(`newSession.baseBranch`))}
                        .value=${this.baseRef}
                        @input=${(e) => {
                          this.submitting ||
                            ((this.baseRefEditGeneration += 1),
                            (this.baseRef = e.target.value.trim()));
                        }}
                      />
                      <datalist id="new-session-branches">
                        ${(o?.branches ?? []).map((e) => p`<option value=${e.name}></option>`)}
                      </datalist>
                    </label>
                    <label class="new-session-page__menu-field">
                      <span>${O(`newSession.worktreeName`)}</span>
                      <input
                        type="text"
                        ?disabled=${this.submitting}
                        placeholder=${O(`newSession.worktreeNamePlaceholder`)}
                        .value=${this.worktreeName}
                        @input=${(e) => {
                          this.submitting || (this.worktreeName = e.target.value.trim());
                        }}
                      />
                    </label>
                  `
                  : h
              }
            `
        }
      </wa-popover>
    `;
      }
      renderFolderSelect() {
        let e = this.browseAvailable(),
          t = this.folder.trim(),
          n = t
            ? X(t)
            : this.execNode
              ? O(`newSession.folderPlaceholder`)
              : X(this.workspacePath()) || O(`newSession.folderPlaceholder`);
        return p`
      <span class="new-session-page__select">
        <button
          id="new-session-folder-trigger"
          type="button"
          class="new-session-page__trigger ${e ? `` : `new-session-page__trigger--disabled`} ${this.folderPopoverHiding ? `new-session-page__trigger--hiding` : ``}"
          title=${O(e ? `newSession.browse` : `newSession.browseRequiresAdmin`)}
          aria-haspopup="dialog"
          aria-expanded=${String(this.browserOpen)}
          ?disabled=${this.submitting || !e}
          @click=${(e) => this.guardPopoverTransition(e, this.folderPopoverHiding)}
        >
          <span class="new-session-page__target-icon" aria-hidden="true">${M.folder}</span>
          <span class="new-session-page__trigger-label">${n}</span>
          <span class="new-session-page__trigger-chevron" aria-hidden="true"
            >${M.chevronDown}</span
          >
        </button>
      </span>
      <wa-popover
        class="new-session-page__select new-session-page__select--folder"
        for="new-session-folder-trigger"
        placement="bottom-start"
        without-arrow
        @wa-show=${() => {
          ((this.browserOpen = !0), this.showBrowserRoot());
        }}
        @wa-hide=${() => {
          ((this.folderPopoverHiding = !0), this.browserOpen && this.closeBrowser());
        }}
        @wa-after-hide=${() => {
          ((this.folderPopoverHiding = !1),
            this.restorePopoverTrigger(
              `new-session-folder-trigger`,
              `.new-session-page__select--folder`,
            ));
        }}
      >
        <div class="new-session-page__browser-menu">${this.renderBrowser()}</div>
      </wa-popover>
    `;
      }
      renderTargetBar() {
        let e = this.agents();
        return a({
          data: this.data,
          agentSelect: e.length > 1 ? this.renderAgentSelect(e) : h,
          folderSelect: this.renderFolderSelect(),
          whereSelect: this.renderWhereSelect(),
          retrying: this.catalogRetrying,
          onRetry: this.handleCatalogRetry,
        });
      }
      renderDraftBlock() {
        let e = this.worktree && !K(this.worktreeName);
        return p`
      <div class="new-session-page__draft" aria-busy=${String(this.submitting)}>
        ${this.renderTargetBar()}
        ${e ? p`<div class="new-session-page__error">${O(`newSession.worktreeNameInvalid`)}</div>` : h}
        ${this.error ? p`<div class="new-session-page__error">${this.error}</div>` : h}
        ${this.submissionOutcomeUnknown ? p`<div class="new-session-page__error">${O(`newSession.createOutcomeUnknown`)}</div>` : h}
        ${Ce({
          agentDefaultModel: this.selectedAgent()?.model?.primary,
          agentId: this.agentId,
          attachmentDraft: this.attachmentDraft,
          canSubmit: this.canSubmit(),
          context: this.context,
          isCatalogTarget: c(this.data),
          message: this.message,
          modelControl: this.modelControl,
          requiresModifier: T().chatSendShortcut === `modifier-enter`,
          submitting: this.submitting,
          onInput: (e) => {
            this.submitting || (this.message = e);
          },
          onSubmit: () => void this.submit(),
        })}
      </div>
    `;
      }
      renderWelcome() {
        let e = this.selectedAgent(),
          t = e?.identity,
          n = this.context?.gateway.snapshot;
        return H({
          assistantName: t?.name ?? e?.name ?? e?.id ?? ``,
          assistantAvatar: t?.avatar ?? t?.emoji ?? null,
          assistantAvatarUrl: t?.avatarUrl ?? null,
          hint: O(`newSession.hint`),
          composer: this.renderDraftBlock(),
          sessions: this.context?.sessions.state.result,
          sessionKey: y({
            agentId: this.agentId || `main`,
            mainKey: this.context?.agents.state.agentsList?.mainKey,
          }),
          sessionHost: {
            assistantAgentId: n?.assistantAgentId ?? null,
            agentsList: this.context?.agents.state.agentsList ?? null,
            hello: n?.hello ?? null,
          },
          onDraftChange: (e) => {
            this.submitting || (this.message = e);
          },
          onSend: () => void this.submit(),
          onOpenSession: (e) => {
            this.submitting ||
              (this.context?.gateway.setSessionKey(e),
              this.context?.navigate(`chat`, { search: _(e) }));
          },
        });
      }
      render() {
        return p`
      <div class="new-session-page">
        <div
          class="new-session-page__scroll"
          ?inert=${this.submitting}
          aria-busy=${String(this.submitting)}
          @mousedown=${ue}
        >
          ${this.renderWelcome()}
        </div>
      </div>
    `;
      }
    }),
    n([te({ attribute: !1 })], $.prototype, `data`, void 0),
    n([u({ context: se, subscribe: !0 })], $.prototype, `context`, void 0),
    n([f()], $.prototype, `agentId`, void 0),
    n([f()], $.prototype, `folder`, void 0),
    n([f()], $.prototype, `worktree`, void 0),
    n([f()], $.prototype, `worktreeName`, void 0),
    n([f()], $.prototype, `baseRef`, void 0),
    n([f()], $.prototype, `branches`, void 0),
    n([f()], $.prototype, `branchesLoading`, void 0),
    n([f()], $.prototype, `nodes`, void 0),
    n([f()], $.prototype, `execNode`, void 0),
    n([f()], $.prototype, `message`, void 0),
    n([f()], $.prototype, `submitting`, void 0),
    n([f()], $.prototype, `submissionOutcomeUnknown`, void 0),
    n([f()], $.prototype, `error`, void 0),
    n([f()], $.prototype, `catalogRetrying`, void 0),
    n([f()], $.prototype, `browserOpen`, void 0),
    n([f()], $.prototype, `browserLoading`, void 0),
    n([f()], $.prototype, `browserError`, void 0),
    n([f()], $.prototype, `browserListing`, void 0),
    n([f()], $.prototype, `browserTarget`, void 0),
    n([f()], $.prototype, `wherePopoverOpen`, void 0),
    n([f()], $.prototype, `wherePopoverHiding`, void 0),
    n([f()], $.prototype, `folderPopoverHiding`, void 0),
    n([f()], $.prototype, `browserPathDraft`, void 0),
    customElements.get(`openclaw-new-session-page`) ||
      customElements.define(`openclaw-new-session-page`, $));
})();
//# sourceMappingURL=new-session-page-CRNch2du.js.map
