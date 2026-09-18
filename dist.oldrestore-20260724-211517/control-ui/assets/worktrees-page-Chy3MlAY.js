import { J as b, K as x, X as S, dt as C, nt as w, q as T } from "./control-ui-core--EZfp09c.js";
import {
  Cn as d,
  J as f,
  Y as p,
  da as m,
  di as h,
  ea as g,
  fi as _,
  la as v,
  tn as y,
} from "./control-ui-core-BcbHa4vB.js";
import { o as E, t as D } from "./control-ui-core-CwQmiouz.js";
import { dt as i, ft as a } from "./control-ui-foundation-0uuDj0X3.js";
import { _ as t, g as n, u as r } from "./control-ui-foundation-CCDffryi.js";
import { G as o, Y as s, at as c, et as l, nt as u } from "./lit-runtime-DkvDG939.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
import { a as A, l as j, n as M, o as N, s as P, t as F } from "./settings-ui-T0X7dZpU.js";
import { n as O, t as k } from "./settings-workspace-DRQpceJK.js";
function I(e) {
  return e.split(/[\\/]/).findLast(Boolean) ?? e;
}
function L(e, t) {
  return !Number.isFinite(t) || t <= 0 ? 0 : e === `maxCount` ? Math.floor(t) : t;
}
function R(e, t) {
  let n = e?.worktrees,
    r = n && typeof n == `object` ? n.cleanup : void 0,
    i = r && typeof r == `object` ? r[t] : void 0;
  return typeof i == `number` ? L(t, i) : 0;
}
var z, B;
e(() => {
  (i(),
    l(),
    o(),
    w(),
    b(),
    T(),
    F(),
    k(),
    D(),
    f(),
    g(),
    y(),
    m(),
    _(),
    t(),
    (z = 2e3),
    (B = class extends v {
      constructor(...e) {
        (super(...e),
          (this.loading = !1),
          (this.records = []),
          (this.error = null),
          (this.busyId = null),
          (this.createOpen = !1),
          (this.createRepoRoot = ``),
          (this.createName = ``),
          (this.createBaseRef = ``),
          (this.createBranches = []),
          (this.creating = !1),
          (this.cleanupLoaded = !1),
          (this.cleanupMaxCount = 0),
          (this.cleanupMaxSizeGb = 0),
          (this.cleanupCommitTimer = null),
          (this.pendingCleanupPatch = {}),
          (this.pendingCleanupSource = null),
          (this.cleanupCommitInFlight = null),
          (this.client = null),
          (this.gatewayConnected = !1),
          (this.hasBoundGateway = !1),
          (this.loadGeneration = 0),
          (this.branchesGeneration = 0),
          (this.operationEpoch = 0),
          (this.subscriptions = new h(this)
            .effect(
              () => this.context?.gateway,
              (e) => {
                let t = this.hasBoundGateway && this.gatewaySource !== e;
                return (
                  (this.gatewaySource = e),
                  (this.hasBoundGateway = !0),
                  this.applyGatewaySnapshot(e.snapshot, t),
                  e.subscribe((t) => {
                    this.gatewaySource === e &&
                      this.context.gateway === e &&
                      this.applyGatewaySnapshot(t);
                  })
                );
              },
            )
            .effect(
              () => this.context?.runtimeConfig,
              (e) => (
                this.resetCleanupDraft(),
                e.ensureLoaded(),
                this.syncCleanupFromConfig(),
                e.subscribe(() => this.syncCleanupFromConfig())
              ),
            )));
      }
      resetCleanupDraft() {
        ((this.cleanupCommitTimer &&= (clearTimeout(this.cleanupCommitTimer), null)),
          (this.pendingCleanupPatch = {}),
          (this.pendingCleanupSource = null),
          (this.cleanupLoaded = !1));
      }
      disconnectedCallback() {
        (this.subscriptions.clear(),
          this.invalidateLoad(),
          this.invalidateOperations(),
          this.flushCleanupEdits(),
          (this.gatewaySource = void 0),
          (this.client = null),
          (this.gatewayConnected = !1),
          super.disconnectedCallback());
      }
      syncCleanupFromConfig() {
        if (this.cleanupCommitTimer || Object.keys(this.pendingCleanupPatch).length > 0) return;
        let e = this.context?.runtimeConfig;
        if (!e) return;
        let t = p(e.state.configSnapshot);
        t &&
          ((this.cleanupLoaded = !0),
          (this.cleanupMaxCount = R(t, `maxCount`)),
          (this.cleanupMaxSizeGb = R(t, `maxTotalSizeGb`)));
      }
      setCleanupLimit(e, t) {
        let n = L(e, t);
        (e === `maxCount` ? (this.cleanupMaxCount = n) : (this.cleanupMaxSizeGb = n),
          (this.pendingCleanupPatch[e] = n),
          (this.pendingCleanupSource = this.context?.runtimeConfig ?? null),
          this.cleanupCommitTimer && clearTimeout(this.cleanupCommitTimer),
          (this.cleanupCommitTimer = setTimeout(() => {
            ((this.cleanupCommitTimer = null), this.commitCleanupLimits());
          }, z)));
      }
      async flushCleanupEdits() {
        return (
          (this.cleanupCommitTimer &&= (clearTimeout(this.cleanupCommitTimer), null)),
          await this.commitCleanupLimits()
        );
      }
      async commitCleanupLimits() {
        for (; this.cleanupCommitInFlight;) await this.cleanupCommitInFlight;
        let e = this.pendingCleanupPatch;
        if (Object.keys(e).length === 0) return !0;
        let t = this.pendingCleanupSource;
        ((this.pendingCleanupPatch = {}), (this.pendingCleanupSource = null));
        let n = this.context?.runtimeConfig;
        if (!n || (t !== null && t !== n)) return !1;
        let r = () => {
            this.context?.runtimeConfig === n &&
              ((this.pendingCleanupPatch = { ...e, ...this.pendingCleanupPatch }),
              (this.pendingCleanupSource = this.pendingCleanupSource ?? t));
          },
          i = (async () => {
            try {
              return (
                await n.ensureLoaded(),
                (await n.patch({
                  raw: { worktrees: { cleanup: e } },
                  note: `worktrees: update cleanup limits`,
                }))
                  ? (await n.refresh(), this.syncCleanupFromConfig(), !0)
                  : ((this.error = n.state.lastError ?? E(`worktrees.cleanupSaveFailed`)), r(), !1)
              );
            } catch (e) {
              return ((this.error = String(e)), r(), !1);
            }
          })();
        this.cleanupCommitInFlight = i;
        try {
          return await i;
        } finally {
          this.cleanupCommitInFlight === i && (this.cleanupCommitInFlight = null);
        }
      }
      applyGatewaySnapshot(e, t = !1) {
        let n = e.client !== this.client,
          r = e.connected !== this.gatewayConnected,
          i = t || n;
        ((this.client = e.client),
          (this.gatewayConnected = e.connected),
          (i || r) && (this.invalidateLoad(), this.invalidateOperations()),
          i && ((this.records = []), (this.error = null)),
          e.connected && e.client && this.load());
      }
      invalidateLoad() {
        ((this.loadGeneration += 1), (this.loading = !1));
      }
      invalidateOperations() {
        ((this.operationEpoch += 1), (this.busyId = null), (this.creating = !1));
      }
      captureOperationScope() {
        let e = this.gatewaySource,
          t = this.client;
        return !e || !t || !this.gatewayConnected || !this.isConnected || this.context.gateway !== e
          ? null
          : { gateway: e, client: t, epoch: this.operationEpoch };
      }
      isOperationScopeCurrent(e) {
        return (
          this.isConnected &&
          this.gatewayConnected &&
          this.gatewaySource === e.gateway &&
          this.context.gateway === e.gateway &&
          this.client === e.client &&
          this.operationEpoch === e.epoch
        );
      }
      get operationPending() {
        return this.loading || this.busyId !== null || this.creating;
      }
      async load(e = {}) {
        let t = this.client;
        if (!t || !this.gatewayConnected || this.operationPending) return;
        let n = ++this.loadGeneration;
        ((this.loading = !0), e.preserveError || (this.error = null));
        try {
          let e = await t.request(`worktrees.list`, {});
          n === this.loadGeneration &&
            t === this.client &&
            (this.records = e.worktrees.toSorted((e, t) => t.lastActiveAt - e.lastActiveAt));
        } catch (e) {
          n === this.loadGeneration && t === this.client && (this.error = String(e));
        } finally {
          n === this.loadGeneration && t === this.client && (this.loading = !1);
        }
      }
      async removeWorktree(e) {
        let t = this.captureOperationScope();
        if (
          !(
            !t ||
            this.operationPending ||
            !window.confirm(E(`worktrees.confirmDelete`, { name: e.name }))
          )
        ) {
          ((this.busyId = e.id), (this.error = null));
          try {
            let n = await t.client.request(`worktrees.remove`, { id: e.id });
            if (!this.isOperationScopeCurrent(t) || n.removed) return;
            let r = n.snapshotError ?? ``;
            if (!window.confirm(E(`worktrees.confirmForceDelete`, { error: r }))) {
              this.error = r || null;
              return;
            }
            if (!this.isOperationScopeCurrent(t)) return;
            try {
              await t.client.request(`worktrees.remove`, { id: e.id, force: !0 });
            } catch (e) {
              this.isOperationScopeCurrent(t) && (this.error = String(e));
            }
          } catch (e) {
            this.isOperationScopeCurrent(t) && (this.error = String(e));
          } finally {
            this.isOperationScopeCurrent(t) &&
              ((this.busyId = null), await this.load({ preserveError: !0 }));
          }
        }
      }
      async restore(e) {
        let t = this.captureOperationScope();
        if (!(!t || this.operationPending)) {
          ((this.busyId = e.id), (this.error = null));
          try {
            await t.client.request(`worktrees.restore`, { id: e.id });
          } catch (e) {
            this.isOperationScopeCurrent(t) && (this.error = String(e));
          } finally {
            this.isOperationScopeCurrent(t) &&
              ((this.busyId = null), await this.load({ preserveError: !0 }));
          }
        }
      }
      async gc() {
        let e = this.captureOperationScope();
        if (!e || this.operationPending) return;
        ((this.loading = !0), (this.error = null));
        let t = await this.flushCleanupEdits();
        if (this.isOperationScopeCurrent(e)) {
          if (!t) {
            this.loading = !1;
            return;
          }
          try {
            await e.client.request(`worktrees.gc`, {});
          } catch (t) {
            this.isOperationScopeCurrent(e) && (this.error = String(t));
          } finally {
            this.isOperationScopeCurrent(e) &&
              ((this.loading = !1), await this.load({ preserveError: !0 }));
          }
        }
      }
      toggleCreate() {
        if (
          !this.creating &&
          ((this.createOpen = !this.createOpen), this.createOpen && !this.createRepoRoot)
        ) {
          let e = this.context.agents.state.agentsList,
            t = e?.agents.find((t) => t.id === e.defaultId);
          ((this.createRepoRoot = t?.workspace ?? ``), this.loadCreateBranches());
        }
      }
      loadCreateBranches() {
        let e = ++this.branchesGeneration,
          t = this.captureOperationScope(),
          n = this.createRepoRoot.trim();
        if (!t || !n) {
          this.createBranches = [];
          return;
        }
        t.client
          .request(`worktrees.branches`, { repoRoot: n })
          .then((n) => {
            e === this.branchesGeneration &&
              this.isOperationScopeCurrent(t) &&
              ((this.createBranches = n.branches.map((e) => e.name)),
              (this.createBaseRef ||= n.defaultBranch ?? n.headBranch ?? ``));
          })
          .catch(() => {
            e === this.branchesGeneration &&
              this.isOperationScopeCurrent(t) &&
              (this.createBranches = []);
          });
      }
      async createWorktree() {
        let e = this.captureOperationScope(),
          t = this.createRepoRoot.trim();
        if (!(!e || !t || this.operationPending)) {
          ((this.creating = !0), (this.error = null));
          try {
            (await e.client.request(`worktrees.create`, {
              repoRoot: t,
              ...(this.createName.trim() ? { name: this.createName.trim() } : {}),
              ...(this.createBaseRef.trim() ? { baseRef: this.createBaseRef.trim() } : {}),
            }),
              this.isOperationScopeCurrent(e) && ((this.createOpen = !1), (this.createName = ``)));
          } catch (t) {
            this.isOperationScopeCurrent(e) && (this.error = String(t));
          } finally {
            this.isOperationScopeCurrent(e) &&
              ((this.creating = !1), await this.load({ preserveError: !0 }));
          }
        }
      }
      renderOwner(e) {
        return e.ownerKind === `session` && e.ownerId
          ? c`<a href=${`${S(`chat`, this.context.basePath)}${d(e.ownerId)}`} title=${e.ownerId}>${E(`worktrees.ownerSession`)}</a>`
          : e.ownerKind === `workboard`
            ? c`<span title=${e.ownerId ?? ``}>${E(`worktrees.ownerWorkboard`)}</span>`
            : c`<span>${E(`worktrees.ownerManual`)}</span>`;
      }
      renderCreateRows() {
        return this.createOpen
          ? c`
      ${N({
        title: E(`worktrees.repo`),
        control: c`
          <input
            class="settings-input"
            type="text"
            aria-label=${E(`worktrees.repo`)}
            ?disabled=${this.creating}
            .value=${this.createRepoRoot}
            @change=${(e) => {
              ((this.createRepoRoot = e.target.value),
                (this.createBaseRef = ``),
                this.loadCreateBranches());
            }}
          />
        `,
      })}
      ${N({
        title: E(`worktrees.name`),
        control: c`
          <input
            class="settings-input"
            type="text"
            aria-label=${E(`worktrees.name`)}
            ?disabled=${this.creating}
            placeholder=${E(`newSession.worktreeNamePlaceholder`)}
            .value=${this.createName}
            @input=${(e) => {
              this.createName = e.target.value;
            }}
          />
        `,
      })}
      ${N({
        title: E(`newSession.baseBranch`),
        control: c`
          <input
            class="settings-input"
            type="text"
            aria-label=${E(`newSession.baseBranch`)}
            ?disabled=${this.creating}
            list="worktrees-create-branches"
            .value=${this.createBaseRef}
            @input=${(e) => {
              this.createBaseRef = e.target.value;
            }}
          />
          <datalist id="worktrees-create-branches">
            ${this.createBranches.map((e) => c`<option value=${e}></option>`)}
          </datalist>
        `,
      })}
      ${N({
        title: E(`worktrees.newWorktree`),
        control: c`
          <button
            class="btn btn--sm"
            ?disabled=${this.operationPending || !this.createRepoRoot.trim()}
            @click=${() => void this.createWorktree()}
          >
            ${this.creating ? E(`common.loading`) : E(`common.create`)}
          </button>
        `,
      })}
    `
          : u;
      }
      renderCleanupRow(e, t, n, r) {
        let i = !this.cleanupLoaded || !this.gatewayConnected;
        return N({
          title: t,
          description: n,
          control: c`
        <input
          class="settings-input"
          type="number"
          min="0"
          step=${e === `maxCount` ? `1` : `any`}
          aria-label=${t}
          .value=${String(r)}
          ?disabled=${i}
          @change=${(t) => {
            this.setCleanupLimit(e, Number(t.target.value));
          }}
        />
      `,
        });
      }
      renderRecordRow(e) {
        return N({
          title: e.name,
          description: c`
        <span title=${e.repoRoot}>${I(e.repoRoot)}</span> · ${e.branch} ·
        ${this.renderOwner(e)} · ${r(e.lastActiveAt)}
      `,
          control: c`
        ${e.removedAt ? j({ kind: `muted`, label: E(`worktrees.restorable`) }) : j({ kind: `ok`, label: E(`common.active`) })}
        <button
          class=${e.removedAt ? `btn btn--sm` : `btn btn--sm danger`}
          ?disabled=${this.operationPending}
          @click=${() => void (e.removedAt ? this.restore(e) : this.removeWorktree(e))}
        >
          ${e.removedAt ? E(`worktrees.restore`) : E(`common.delete`)}
        </button>
      `,
        });
      }
      render() {
        let e = c`
      <button class="btn" ?disabled=${this.creating} @click=${() => this.toggleCreate()}>
        ${E(`worktrees.newWorktree`)}
      </button>
      <button class="btn" ?disabled=${this.operationPending} @click=${() => void this.gc()}>
        ${this.loading ? E(`common.loading`) : E(`worktrees.cleanNow`)}
      </button>
    `,
          t = c`
      ${this.renderCreateRows()}
      ${this.records.length === 0 ? M(E(`worktrees.empty`)) : this.records.map((e) => this.renderRecordRow(e))}
    `,
          n = A(
            c`
        ${this.error ? c`<div class="callout danger">${this.error}</div>` : u}
        ${P({ title: E(`worktrees.title`), description: E(`worktrees.subtitle`), actions: e }, t)}
        ${P(
          { title: E(`worktrees.cleanupTitle`), description: E(`worktrees.cleanupSubtitle`) },
          c`
            ${this.renderCleanupRow(`maxCount`, E(`worktrees.cleanupMaxCount`), E(`worktrees.cleanupMaxCountHelp`), this.cleanupMaxCount)}
            ${this.renderCleanupRow(`maxTotalSizeGb`, E(`worktrees.cleanupMaxSize`), E(`worktrees.cleanupMaxSizeHelp`), this.cleanupMaxSizeGb)}
          `,
        )}
      `,
            { wide: !0 },
          );
        return c`
      <section class="content-header">
        <div>
          <div class="page-title">${C(`worktrees`)}</div>
        </div>
      </section>
      ${O(n)}
    `;
      }
    }),
    n([a({ context: x, subscribe: !0 })], B.prototype, `context`, void 0),
    n([s()], B.prototype, `loading`, void 0),
    n([s()], B.prototype, `records`, void 0),
    n([s()], B.prototype, `error`, void 0),
    n([s()], B.prototype, `busyId`, void 0),
    n([s()], B.prototype, `createOpen`, void 0),
    n([s()], B.prototype, `createRepoRoot`, void 0),
    n([s()], B.prototype, `createName`, void 0),
    n([s()], B.prototype, `createBaseRef`, void 0),
    n([s()], B.prototype, `createBranches`, void 0),
    n([s()], B.prototype, `creating`, void 0),
    n([s()], B.prototype, `cleanupLoaded`, void 0),
    n([s()], B.prototype, `cleanupMaxCount`, void 0),
    n([s()], B.prototype, `cleanupMaxSizeGb`, void 0),
    customElements.define(`openclaw-worktrees-page`, B));
})();
//# sourceMappingURL=worktrees-page-Chy3MlAY.js.map
