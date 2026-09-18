import { K as m, dt as h, nt as g, q as _ } from "./control-ui-core--EZfp09c.js";
import { da as u, di as d, fi as f, la as p } from "./control-ui-core-BcbHa4vB.js";
import { $ as b, Q as x, x as S } from "./control-ui-core-CQDTaMS5.js";
import { o as v, t as y } from "./control-ui-core-CwQmiouz.js";
import { dt as r, ft as i } from "./control-ui-foundation-0uuDj0X3.js";
import { _ as t, g as n } from "./control-ui-foundation-CCDffryi.js";
import { G as a, Y as o, at as s, et as c, nt as l } from "./lit-runtime-DkvDG939.js";
import { i as T, n as E } from "./provider-icon-CsUwkorr.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
import { n as C, t as w } from "./settings-workspace-DRQpceJK.js";
var D = e(() => {});
function O(e, t) {
  let n = e.details?.[t];
  return typeof n == `string` && n.trim() ? n : void 0;
}
function k(e) {
  let t = new Map();
  for (let n of e) {
    let e = O(n, `collectionId`) ?? n.id,
      r = O(n, `collectionLabel`) ?? O(n, `sourceLabel`) ?? v(`memoryImport.unknownCollection`),
      i = t.get(e) ?? { id: e, label: r, items: [] };
    (i.items.push(n), t.set(e, i));
  }
  return [...t.values()].toSorted((e, t) => e.label.localeCompare(t.label));
}
function A(e) {
  return e.providerId === `claude` ? v(`memoryImport.claudeCode`) : e.label;
}
function j(e) {
  return e.providerId === `codex`
    ? v(`memoryImport.codexDescription`)
    : e.providerId === `claude`
      ? v(`memoryImport.claudeDescription`)
      : v(`memoryImport.providerFallback`);
}
function M(e) {
  return v(e === 1 ? `memoryImport.fileCountOne` : `memoryImport.fileCount`, { count: String(e) });
}
function N(e) {
  let t = O(e, `relativePath`);
  if (t) return t;
  let n = e.target ?? e.source ?? e.id;
  return n.split(/[\\/]/u).at(-1) ?? n;
}
function P(e, t, n, r, i) {
  let a = t.items.filter((e) => e.status === `planned`).map((e) => e.id),
    o = a.length > 0 && a.every((e) => n.has(e)),
    c = t.items.filter((e) => e.status === `conflict`).length;
  return s`
    <div class="memory-import__collection">
      <div class="memory-import__collection-header">
        <label class="memory-import__collection-choice">
          <input
            type="checkbox"
            .checked=${o}
            ?disabled=${a.length === 0 || i}
            @change=${(t) => r(e.providerId, a, t.currentTarget.checked)}
          />
          <span>
            <strong>${t.label}</strong>
            <small>${M(t.items.length)}</small>
          </span>
        </label>
        ${
          c > 0
            ? s`<span class="memory-import__badge memory-import__badge--conflict">
              ${v(`memoryImport.alreadyImported`, { count: String(c) })}
            </span>`
            : l
        }
      </div>
      <details ?open=${t.items.length <= 4}>
        <summary>${v(`memoryImport.reviewFiles`)}</summary>
        <ul class="memory-import__files">
          ${t.items.map(
            (e) => s`
              <li>
                <span class="memory-import__file-icon" aria-hidden="true">${x.fileText}</span>
                <code title=${e.source ?? N(e)}>${N(e)}</code>
                <span class="memory-import__file-status memory-import__file-status--${e.status}">
                  ${e.status === `planned` ? v(`memoryImport.ready`) : e.status === `conflict` ? v(`memoryImport.existing`) : e.status}
                </span>
              </li>
            `,
          )}
        </ul>
      </details>
    </div>
  `;
}
function F(e) {
  if (!e) return l;
  let t = e.summary.errors > 0 || e.summary.conflicts > 0,
    n = e.items.filter(
      (e) =>
        e.status === `error` || e.status === `conflict` || O(e, `recoveryRecordPath`) !== void 0,
    );
  return s`
    <div
      class="memory-import__result ${t ? `memory-import__result--incomplete` : ``}"
      role=${t ? `alert` : `status`}
    >
      <span aria-hidden="true">${t ? x.alertTriangle : x.check}</span>
      <div>
        <strong>
          ${v(t ? `memoryImport.importIncomplete` : `memoryImport.importComplete`)}
        </strong>
        <span>
          ${t ? v(`memoryImport.importedWithIssues`, { conflicts: String(e.summary.conflicts), errors: String(e.summary.errors), migrated: String(e.summary.migrated) }) : v(`memoryImport.importedCount`, { count: String(e.summary.migrated) })}
        </span>
        ${
          e.reportDir
            ? s`<span class="memory-import__result-path">
              ${v(`memoryImport.reportSaved`)}:
              <code title=${e.reportDir}>${e.reportDir}</code>
            </span>`
            : l
        }
        ${
          n.length > 0
            ? s`<ul class="memory-import__result-issues">
              ${n.map((e) => {
                let t = [
                  { label: v(`memoryImport.recoveryFile`), path: O(e, `recoveryPath`) },
                  { label: v(`memoryImport.recoveryJournal`), path: O(e, `recoveryRecordPath`) },
                  { label: v(`memoryImport.itemBackup`), path: O(e, `backupPath`) },
                ].filter((e) => !!e.path);
                return s`<li>
                  <strong>${N(e)}</strong>
                  <span>${e.reason ?? e.message ?? e.status}</span>
                  ${t.map(
                    (e) => s`<span class="memory-import__result-artifact">
                      <span>${e.label}</span>
                      <code title=${e.path}>${e.path}</code>
                    </span>`,
                  )}
                </li>`;
              })}
            </ul>`
            : l
        }
      </div>
    </div>
  `;
}
function I(e, t) {
  let n = new Set(e.selectedByProvider[t.providerId] ?? []),
    r = k(t.items),
    i = e.applyingProviderId === t.providerId;
  return s`
    <article class="card memory-import__provider" data-provider-id=${t.providerId}>
      <div class="memory-import__provider-header">
        <div class="memory-import__provider-identity">
          ${T(t.providerId, { className: `memory-import__provider-icon` })}
          <div>
            <h3>${A(t)}</h3>
            <p>${j(t)}</p>
          </div>
        </div>
        <span
          class="memory-import__badge ${t.found ? `memory-import__badge--ready` : `memory-import__badge--muted`}"
        >
          ${t.found ? M(t.items.length) : v(`memoryImport.notFound`)}
        </span>
      </div>

      ${
        t.error
          ? s`<div class="callout danger" role="alert">${t.error}</div>`
          : t.found
            ? s`
              <dl class="memory-import__paths">
                ${
                  t.source
                    ? s`<div>
                      <dt>${v(`memoryImport.source`)}</dt>
                      <dd><code title=${t.source}>${t.source}</code></dd>
                    </div>`
                    : l
                }
                ${
                  t.target
                    ? s`<div>
                      <dt>${v(`memoryImport.destination`)}</dt>
                      <dd>
                        <code title=${t.target}>${t.target}/memory/imports/</code>
                      </dd>
                    </div>`
                    : l
                }
              </dl>
              <div class="memory-import__collections">
                ${r.map((r) => P(t, r, n, e.onToggleCollection, e.loading || e.applyingProviderId !== null || e.error !== null))}
              </div>
              <div class="memory-import__provider-actions">
                <span>
                  ${n.size > 0 ? v(`memoryImport.selectedCount`, { count: String(n.size) }) : v(`memoryImport.selectAtLeastOne`)}
                </span>
                <button
                  class="btn primary"
                  data-test-id="memory-import-provider-button"
                  ?disabled=${n.size === 0 || e.applyingProviderId !== null || e.loading || e.error !== null}
                  @click=${() => e.onRequestImport(t.providerId)}
                >
                  ${v(i ? `common.importing` : `memoryImport.importSelected`)}
                </button>
              </div>
            `
            : s`<div class="memory-import__empty">
              ${t.message ?? v(`memoryImport.noMemoryFound`)}
            </div>`
      }
      ${F(e.lastResults[t.providerId])}
    </article>
  `;
}
function L(e) {
  let t = e.plan?.providers.find((t) => t.providerId === e.pendingProviderId);
  if (!t) return l;
  let n = e.selectedByProvider[t.providerId]?.length ?? 0,
    r = v(`memoryImport.confirmTitle`, { provider: A(t) }),
    i = v(`memoryImport.confirmDescription`, { count: String(n) });
  return s`
    <openclaw-modal-dialog
      label=${r}
      description=${i}
      @modal-cancel=${() => {
        e.applyingProviderId === null && e.onCancelImport();
      }}
    >
      <div class="exec-approval-card memory-import__confirm">
        <div class="exec-approval-header">
          <div>
            <div class="exec-approval-title">${r}</div>
            <div class="exec-approval-sub">${i}</div>
          </div>
        </div>
        <div class="callout ${e.replaceExisting ? `warn` : ``}">
          ${e.replaceExisting ? v(`memoryImport.confirmReplace`) : v(`memoryImport.confirmBackup`)}
        </div>
        <div class="exec-approval-actions">
          <button
            class="btn primary"
            data-test-id="memory-import-confirm"
            ?disabled=${e.applyingProviderId !== null}
            @click=${e.onConfirmImport}
          >
            ${v(`memoryImport.confirmImport`)}
          </button>
          <button
            class="btn"
            ?disabled=${e.applyingProviderId !== null}
            @click=${e.onCancelImport}
          >
            ${v(`common.cancel`)}
          </button>
        </div>
      </div>
    </openclaw-modal-dialog>
  `;
}
function R(e) {
  return e.connected
    ? s`
    <div class="memory-import" data-test-id="memory-import-page">
      <section class="card memory-import__intro">
        <div>
          <div class="card-title">${v(`memoryImport.title`)}</div>
          <div class="card-sub">${v(`memoryImport.subtitle`)}</div>
        </div>
        <div class="memory-import__controls">
          <label>
            <span>${v(`memoryImport.agent`)}</span>
            <select
              name="memory-import-agent"
              .value=${e.selectedAgentId ?? ``}
              ?disabled=${e.loading || e.applyingProviderId !== null}
              @change=${(t) => e.onSelectAgent(t.currentTarget.value)}
            >
              ${e.agents.map(
                (t) => s`
                  <option value=${t.id} ?selected=${t.id === e.selectedAgentId}>
                    ${t.identity?.name ?? t.name ?? t.id}
                  </option>
                `,
              )}
            </select>
          </label>
          <label class="memory-import__replace">
            <input
              type="checkbox"
              name="memory-import-replace"
              .checked=${e.replaceExisting}
              ?disabled=${e.loading || e.applyingProviderId !== null}
              @change=${(t) => e.onReplaceExisting(t.currentTarget.checked)}
            />
            <span>
              <strong>${v(`memoryImport.replaceExisting`)}</strong>
              <small>${v(`memoryImport.replaceHint`)}</small>
            </span>
          </label>
          <button
            class="btn btn--sm"
            ?disabled=${e.loading || e.applyingProviderId !== null}
            @click=${e.onRefresh}
          >
            ${e.loading ? v(`common.refreshing`) : v(`common.refresh`)}
          </button>
        </div>
      </section>

      ${e.error ? s`<div class="callout danger" role="alert">${e.error}</div>` : l}
      ${e.applyError ? s`<div class="callout danger" role="alert">${e.applyError}</div>` : l}
      ${
        e.loading && !e.plan
          ? s`<section class="card memory-import__loading" aria-busy="true">
            <div class="memory-import__skeleton"></div>
            <div class="memory-import__skeleton"></div>
          </section>`
          : s`<div class="memory-import__grid">
            ${(e.plan?.providers ?? []).map((t) => I(e, t))}
          </div>`
      }
      ${L(e)}
    </div>
  `
    : s`<section class="card">
      <div class="card-sub">${v(`memoryImport.disconnected`)}</div>
    </section>`;
}
var z = e(() => {
  (c(), S(), b(), E(), y(), D());
});
function B(e) {
  return e instanceof Error && e.message.trim()
    ? e.message
    : typeof e == `string`
      ? e
      : `request failed`;
}
function V() {
  return typeof globalThis.crypto.randomUUID == `function`
    ? globalThis.crypto.randomUUID()
    : [...globalThis.crypto.getRandomValues(new Uint32Array(4))]
        .map((e) => e.toString(16).padStart(8, `0`))
        .join(``);
}
var H;
e(() => {
  (r(),
    c(),
    a(),
    g(),
    _(),
    w(),
    u(),
    f(),
    z(),
    t(),
    (H = class extends p {
      constructor(...e) {
        (super(...e),
          (this.plan = null),
          (this.loading = !1),
          (this.error = null),
          (this.replaceExisting = !1),
          (this.selectedByProvider = {}),
          (this.applyingProviderId = null),
          (this.pendingImport = null),
          (this.applyError = null),
          (this.lastResults = {}),
          (this.loadedKey = null),
          (this.requestedKey = null),
          (this.loadedClient = null),
          (this.requestedClient = null),
          (this.refreshEpoch = 0),
          (this.applyEpoch = 0),
          (this.gatewayUnavailable = !1),
          (this.subscriptions = new d(this)
            .watch(
              () => this.context?.gateway,
              (e, t) => e.subscribe(t),
            )
            .watch(
              () => this.context?.agents,
              (e, t) => e.subscribe(t),
            )
            .watch(
              () => this.context?.agentSelection,
              (e, t) => e.subscribe(t),
            )));
      }
      disconnectedCallback() {
        ((this.refreshEpoch += 1),
          (this.applyEpoch += 1),
          this.subscriptions.clear(),
          super.disconnectedCallback());
      }
      updated() {
        let e = this.context.gateway.snapshot;
        if (!e.connected || !e.client) {
          this.gatewayUnavailable ||
            ((this.gatewayUnavailable = !0), this.resetPlanState({ preserveAttemptedImport: !0 }));
          return;
        }
        if (((this.gatewayUnavailable = !1), !this.context.agents.state.agentsList)) {
          this.context.agents.ensureList();
          return;
        }
        let t = this.currentAgentId();
        if (!t) return;
        let n = this.planKey(t),
          r = this.requestedClient ?? this.loadedClient,
          i = this.requestedKey ?? this.loadedKey;
        (((r !== null && r !== e.client) || (i !== null && i !== n)) &&
          this.resetPlanState({ preserveAttemptedImport: r !== null && r !== e.client }),
          !this.loading &&
            (this.loadedClient !== e.client || this.loadedKey !== n) &&
            (this.requestedClient !== e.client || this.requestedKey !== n) &&
            this.refresh());
      }
      currentAgentId() {
        let e = this.context.agents.state.agentsList;
        if (!e) return null;
        let t = this.context.agentSelection.state.selectedId;
        return t && e.agents.some((e) => e.id === t) ? t : (e.defaultId ?? e.agents[0]?.id ?? null);
      }
      planKey(e) {
        return `${e}:${this.replaceExisting ? `replace` : `safe`}`;
      }
      resetPlanState(e = {}) {
        let t =
          e.preserveAttemptedImport && this.pendingImport?.attempted ? this.pendingImport : null;
        ((this.refreshEpoch += 1),
          (this.applyEpoch += 1),
          (this.plan = null),
          (this.loading = !1),
          (this.error = null),
          (this.selectedByProvider = {}),
          (this.applyingProviderId = null),
          (this.pendingImport = t),
          (this.applyError = null),
          (this.lastResults = {}),
          (this.loadedKey = null),
          (this.requestedKey = null),
          (this.loadedClient = null),
          (this.requestedClient = null));
      }
      async refresh(e = !1) {
        let t = this.context.gateway.snapshot,
          n = this.currentAgentId();
        if (!t.connected || !t.client || !n || this.loading) return;
        let r = t.client,
          i = this.planKey(n);
        if (!e && this.loadedClient === r && this.loadedKey === i) return;
        let a = ++this.refreshEpoch;
        ((this.requestedKey = i),
          (this.requestedClient = r),
          (this.loading = !0),
          (this.error = null));
        try {
          let e = await r.request(`migrations.memory.plan`, {
            agentId: n,
            overwrite: this.replaceExisting,
          });
          if (a !== this.refreshEpoch) return;
          ((this.plan = e),
            (this.loadedKey = i),
            (this.loadedClient = r),
            (this.selectedByProvider = Object.fromEntries(
              e.providers.map((e) => [
                e.providerId,
                e.items.filter((e) => e.status === `planned`).map((e) => e.id),
              ]),
            )));
        } catch (e) {
          a === this.refreshEpoch &&
            ((this.error = B(e)), (this.loadedKey = i), (this.loadedClient = r));
        } finally {
          a === this.refreshEpoch &&
            ((this.loading = !1), (this.requestedKey = null), (this.requestedClient = null));
        }
      }
      selectAgent(e) {
        (this.context.agentSelection.set(e), this.resetPlanState());
      }
      setReplaceExisting(e) {
        ((this.replaceExisting = e), this.resetPlanState());
      }
      toggleCollection(e, t, n) {
        let r = new Set(this.selectedByProvider[e] ?? []);
        for (let e of t) n ? r.add(e) : r.delete(e);
        this.selectedByProvider = { ...this.selectedByProvider, [e]: [...r] };
      }
      requestImport(e) {
        let t = this.currentAgentId(),
          n = this.plan?.providers.find((t) => t.providerId === e)?.planFingerprint,
          r = this.selectedByProvider[e] ?? [];
        this.loading ||
          this.error !== null ||
          this.applyingProviderId !== null ||
          !t ||
          this.plan?.agentId !== t ||
          !n ||
          r.length === 0 ||
          ((this.applyError = null),
          (this.pendingImport = {
            providerId: e,
            agentId: t,
            planFingerprint: n,
            itemIds: [...r],
            overwrite: this.replaceExisting,
            idempotencyKey: V(),
            attempted: !1,
          }));
      }
      async confirmImport() {
        if (this.applyingProviderId !== null) return;
        let e = this.pendingImport,
          t = this.context.gateway.snapshot;
        if (
          !e ||
          !t.client ||
          this.currentAgentId() !== e.agentId ||
          this.plan?.agentId !== e.agentId
        )
          return;
        let n = { ...e, attempted: !0 };
        this.pendingImport = n;
        let r = ++this.applyEpoch;
        ((this.applyingProviderId = n.providerId), (this.applyError = null));
        try {
          let e = await t.client.request(`migrations.memory.apply`, {
            idempotencyKey: n.idempotencyKey,
            agentId: n.agentId,
            providerId: n.providerId,
            planFingerprint: n.planFingerprint,
            itemIds: n.itemIds,
            overwrite: n.overwrite,
          });
          if (r !== this.applyEpoch) return;
          ((this.lastResults = { ...this.lastResults, [n.providerId]: e }),
            (this.pendingImport = null),
            (this.loadedKey = null),
            (this.requestedKey = null),
            (this.loadedClient = null),
            (this.requestedClient = null),
            await this.refresh(!0));
        } catch (e) {
          r === this.applyEpoch && (this.applyError = B(e));
        } finally {
          r === this.applyEpoch && (this.applyingProviderId = null);
        }
      }
      render() {
        let e = this.context.gateway.snapshot,
          t = this.context.agents.state.agentsList,
          n = this.currentAgentId(),
          r = R({
            connected: e.connected,
            agents: t?.agents ?? [],
            selectedAgentId: n,
            plan: this.plan,
            loading: this.loading,
            error: this.error,
            applyError: this.applyError,
            replaceExisting: this.replaceExisting,
            selectedByProvider: this.selectedByProvider,
            applyingProviderId: this.applyingProviderId,
            pendingProviderId:
              this.pendingImport?.agentId === n ? this.pendingImport.providerId : null,
            lastResults: this.lastResults,
            onSelectAgent: (e) => this.selectAgent(e),
            onReplaceExisting: (e) => this.setReplaceExisting(e),
            onRefresh: () => void this.refresh(!0),
            onToggleCollection: (e, t, n) => this.toggleCollection(e, t, n),
            onRequestImport: (e) => this.requestImport(e),
            onConfirmImport: () => void this.confirmImport(),
            onCancelImport: () => {
              this.applyingProviderId === null &&
                ((this.pendingImport = null), (this.applyError = null));
            },
          });
        return s`
      <section class="content-header">
        <div>
          <div class="page-title">${h(`memory-import`)}</div>
        </div>
      </section>
      ${C(r)}
    `;
      }
    }),
    n([i({ context: m, subscribe: !0 })], H.prototype, `context`, void 0),
    n([o()], H.prototype, `plan`, void 0),
    n([o()], H.prototype, `loading`, void 0),
    n([o()], H.prototype, `error`, void 0),
    n([o()], H.prototype, `replaceExisting`, void 0),
    n([o()], H.prototype, `selectedByProvider`, void 0),
    n([o()], H.prototype, `applyingProviderId`, void 0),
    n([o()], H.prototype, `pendingImport`, void 0),
    n([o()], H.prototype, `applyError`, void 0),
    n([o()], H.prototype, `lastResults`, void 0),
    customElements.define(`openclaw-memory-import-page`, H));
})();
//# sourceMappingURL=memory-import-page-DzeENh7x.js.map
