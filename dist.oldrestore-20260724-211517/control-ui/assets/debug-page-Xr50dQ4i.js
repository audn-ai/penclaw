import { K as v, dt as y, nt as b, q as x } from "./control-ui-core--EZfp09c.js";
import {
  Zi as u,
  da as d,
  di as f,
  ea as p,
  fi as m,
  la as h,
  li as g,
  ui as _,
} from "./control-ui-core-BcbHa4vB.js";
import { o as S, t as C } from "./control-ui-core-CwQmiouz.js";
import { dt as r, ft as i } from "./control-ui-foundation-0uuDj0X3.js";
import { _ as t, g as n } from "./control-ui-foundation-CCDffryi.js";
import { G as a, Y as o, at as s, et as c, nt as l } from "./lit-runtime-DkvDG939.js";
import { i as M, s as N } from "./presenter-CnPyKQkg.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
import { a as E, l as D, n as O, o as k, s as A, t as j } from "./settings-ui-T0X7dZpU.js";
import { n as w, t as T } from "./settings-workspace-DRQpceJK.js";
async function P(e) {
  let [t, n, r, i] = await Promise.all([
      e.request(`status`, {}),
      e.request(`health`, {}),
      e.request(`models.list`, {}),
      e.request(`last-heartbeat`, {}),
    ]),
    a = r;
  return { status: t, health: n, models: Array.isArray(a?.models) ? a.models : [], heartbeat: i };
}
var F = e(() => {});
function I(e, t) {
  return k({
    title: e,
    stacked: !0,
    control: s`<pre class="code-block">${JSON.stringify(t ?? {}, null, 2)}</pre>`,
  });
}
function L(e) {
  let t =
    (e.status && typeof e.status == `object` ? e.status.securityAudit : null)?.summary ?? null;
  if (!t) return l;
  let n = t.critical ?? 0,
    r = t.warn ?? 0,
    i = t.info ?? 0,
    a = n > 0 ? `danger` : r > 0 ? `warn` : `ok`,
    o =
      n > 0
        ? S(`debug.security.critical`, { count: String(n) })
        : r > 0
          ? S(`debug.security.warnings`, { count: String(r) })
          : S(`debug.security.noCriticalIssues`),
    c = i > 0 ? ` · ${S(`debug.security.info`, { count: String(i) })}` : ``;
  return k({
    title: S(`debug.security.audit`),
    description: s`
      ${S(`debug.security.runPrefix`)}
      <span class="mono">openclaw security audit --deep</span>
      ${S(`debug.security.runSuffix`)}
    `,
    control: D({ kind: a, label: `${o}${c}` }),
  });
}
function R(e) {
  return k({
    title: e.event,
    description: u(e.ts, void 0, ``),
    stacked: !0,
    control: s`<pre class="code-block">${M(e.payload)}</pre>`,
  });
}
function z(e) {
  return E(
    s`${A(
      {
        title: S(`debug.snapshotsTitle`),
        description: S(`debug.snapshotsSubtitle`),
        actions: s`
        <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
          ${e.loading ? S(`common.refreshing`) : S(`common.refresh`)}
        </button>
      `,
      },
      s`
      ${L(e)} ${I(S(`debug.status`), e.status)}
      ${I(S(`debug.health`), e.health)}
      ${I(S(`debug.lastHeartbeat`), e.heartbeat)}
    `,
    )} ${A(
      { title: S(`debug.manualRpcTitle`), description: S(`debug.manualRpcSubtitle`) },
      s`
      ${k({
        title: S(`debug.method`),
        control: s`
          <select
            class="settings-select"
            aria-label=${S(`debug.method`)}
            .value=${e.callMethod}
            @change=${(t) => e.onCallMethodChange(t.target.value)}
          >
            ${e.callMethod ? l : s` <option value="" disabled>${S(`debug.selectMethod`)}</option> `}
            ${e.methods.map((e) => s`<option value=${e}>${e}</option>`)}
          </select>
        `,
      })}
      ${k({
        title: S(`debug.paramsJson`),
        stacked: !0,
        control: s`
          <textarea
            class="settings-input"
            aria-label=${S(`debug.paramsJson`)}
            .value=${e.callParams}
            @input=${(t) => e.onCallParamsChange(t.target.value)}
            rows="6"
          ></textarea>
        `,
      })}
      ${k({
        title: S(`common.call`),
        control: s`
          <button class="btn primary" @click=${e.onCall}>${S(`common.call`)}</button>
        `,
      })}
      ${
        e.callError
          ? s`
            <div class="settings-row settings-row--stacked">
              ${D({ kind: `danger`, label: S(`debug.callFailed`) })}
              <pre class="code-block">${e.callError}</pre>
            </div>
          `
          : l
      }
      ${
        e.callResult
          ? s`
            <div class="settings-row settings-row--stacked">
              ${D({ kind: `ok`, label: S(`common.ok`) })}
              <pre class="code-block">${e.callResult}</pre>
            </div>
          `
          : l
      }
    `,
    )} ${A(
      { title: S(`debug.modelsTitle`), description: S(`debug.modelsSubtitle`) },
      s`
      <div class="settings-row settings-row--stacked">
        <pre class="code-block">${JSON.stringify(e.models ?? [], null, 2)}</pre>
      </div>
    `,
    )} ${A({ title: S(`debug.eventLogTitle`), description: S(`debug.eventLogSubtitle`) }, e.eventLog.length === 0 ? O(S(`debug.noEvents`)) : e.eventLog.map((e) => R(e)))}`,
    { wide: !0 },
  );
}
var B = e(() => {
    (c(), j(), C(), p(), N());
  }),
  V,
  H;
e(() => {
  (r(),
    c(),
    a(),
    b(),
    x(),
    T(),
    F(),
    d(),
    _(),
    m(),
    B(),
    t(),
    (V = 3e3),
    (H = class extends h {
      constructor(...e) {
        (super(...e),
          (this.client = null),
          (this.connected = !1),
          (this.debugLoading = !1),
          (this.debugStatus = null),
          (this.debugHealth = null),
          (this.debugModels = []),
          (this.debugHeartbeat = null),
          (this.debugCallMethod = ``),
          (this.debugCallParams = `{}`),
          (this.debugCallResult = null),
          (this.debugCallError = null),
          (this.eventLog = []),
          (this.polling = new g(
            this,
            V,
            () => {
              this.loadDiagnostics();
            },
            !1,
          )),
          (this.hasBoundGatewaySource = !1),
          (this.gatewaySource = null),
          (this.requestGeneration = 0),
          (this.subscriptions = new f(this)
            .effect(
              () => this.context?.gateway,
              (e) => {
                let t = this.hasBoundGatewaySource;
                ((this.hasBoundGatewaySource = !0),
                  (this.gatewaySource = e),
                  (this.requestGeneration += 1));
                let n = e.subscribe((t) => {
                  this.gatewaySource === e &&
                    this.context.gateway === e &&
                    this.applyGatewaySnapshot(t);
                });
                return (this.applyGatewaySnapshot(e.snapshot, t), n);
              },
            )
            .watch(
              () => this.context?.gateway,
              (e, t) => e.subscribeEventLog(t),
              (e) => {
                this.eventLog = e.eventLog;
              },
            )));
      }
      disconnectedCallback() {
        (this.subscriptions.clear(),
          (this.requestGeneration += 1),
          (this.gatewaySource = null),
          (this.debugLoading = !1),
          super.disconnectedCallback());
      }
      applyGatewaySnapshot(e, t = !1) {
        let n = e.connected !== this.connected,
          r = t || e.client !== this.client;
        ((r || n) && (this.requestGeneration += 1),
          (this.client = e.client),
          (this.connected = e.connected),
          r ? this.resetServerState() : n && (this.debugLoading = !1),
          this.syncPolling(),
          this.ensureInitialDebug());
      }
      resetServerState() {
        ((this.debugLoading = !1),
          (this.debugStatus = null),
          (this.debugHealth = null),
          (this.debugModels = []),
          (this.debugHeartbeat = null),
          (this.debugCallResult = null),
          (this.debugCallError = null));
      }
      syncPolling() {
        if (!this.connected || !this.client) {
          this.polling.stop();
          return;
        }
        this.polling.start();
      }
      ensureInitialDebug() {
        !this.connected ||
          !this.client ||
          this.debugStatus ||
          this.debugLoading ||
          this.loadDiagnostics();
      }
      captureRequestScope() {
        let e = this.gatewaySource,
          t = this.client;
        return !e || !t || !this.connected || !this.isConnected || this.context.gateway !== e
          ? null
          : { gateway: e, client: t, generation: this.requestGeneration };
      }
      isRequestScopeCurrent(e) {
        return (
          this.isConnected &&
          this.gatewaySource === e.gateway &&
          this.context.gateway === e.gateway &&
          this.requestGeneration === e.generation &&
          this.client === e.client &&
          this.connected
        );
      }
      async loadDiagnostics() {
        let e = this.captureRequestScope();
        if (!(!e || this.debugLoading)) {
          this.debugLoading = !0;
          try {
            let t = await P(e.client);
            if (!this.isRequestScopeCurrent(e)) return;
            ((this.debugStatus = t.status),
              (this.debugHealth = t.health),
              (this.debugModels = t.models),
              (this.debugHeartbeat = t.heartbeat));
          } catch (t) {
            this.isRequestScopeCurrent(e) && (this.debugCallError = String(t));
          } finally {
            this.isRequestScopeCurrent(e) && (this.debugLoading = !1);
          }
        }
      }
      async callDebugMethod() {
        let e = this.captureRequestScope();
        if (e) {
          ((this.debugCallError = null), (this.debugCallResult = null));
          try {
            let t = this.debugCallParams.trim() ? JSON.parse(this.debugCallParams) : {},
              n = await e.client.request(this.debugCallMethod.trim(), t);
            this.isRequestScopeCurrent(e) && (this.debugCallResult = JSON.stringify(n, null, 2));
          } catch (t) {
            this.isRequestScopeCurrent(e) && (this.debugCallError = String(t));
          }
        }
      }
      render() {
        let e = z({
          loading: this.debugLoading,
          status: this.debugStatus,
          health: this.debugHealth,
          models: this.debugModels,
          heartbeat: this.debugHeartbeat,
          eventLog: this.eventLog,
          methods: (this.context.gateway.snapshot.hello?.features?.methods ?? []).toSorted(),
          callMethod: this.debugCallMethod,
          callParams: this.debugCallParams,
          callResult: this.debugCallResult,
          callError: this.debugCallError,
          onCallMethodChange: (e) => (this.debugCallMethod = e),
          onCallParamsChange: (e) => (this.debugCallParams = e),
          onRefresh: () => void this.loadDiagnostics(),
          onCall: () => void this.callDebugMethod(),
        });
        return s`
      <section class="content-header">
        <div>
          <div class="page-title">${y(`debug`)}</div>
        </div>
      </section>
      ${w(e)}
    `;
      }
    }),
    n([i({ context: v, subscribe: !0 })], H.prototype, `context`, void 0),
    n([o()], H.prototype, `client`, void 0),
    n([o()], H.prototype, `connected`, void 0),
    n([o()], H.prototype, `debugLoading`, void 0),
    n([o()], H.prototype, `debugStatus`, void 0),
    n([o()], H.prototype, `debugHealth`, void 0),
    n([o()], H.prototype, `debugModels`, void 0),
    n([o()], H.prototype, `debugHeartbeat`, void 0),
    n([o()], H.prototype, `debugCallMethod`, void 0),
    n([o()], H.prototype, `debugCallParams`, void 0),
    n([o()], H.prototype, `debugCallResult`, void 0),
    n([o()], H.prototype, `debugCallError`, void 0),
    n([o()], H.prototype, `eventLog`, void 0),
    customElements.define(`openclaw-debug-page`, H));
})();
//# sourceMappingURL=debug-page-Xr50dQ4i.js.map
