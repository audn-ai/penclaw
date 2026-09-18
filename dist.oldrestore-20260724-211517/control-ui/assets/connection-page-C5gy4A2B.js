import {
  K as g,
  dt as _,
  f as v,
  l as y,
  nt as b,
  q as x,
  u as S,
  v as C,
} from "./control-ui-core--EZfp09c.js";
import { da as d, di as f, ea as p, fi as m, la as h } from "./control-ui-core-BcbHa4vB.js";
import { $ as E, J as D, Q as O } from "./control-ui-core-CQDTaMS5.js";
import { o as w, t as T } from "./control-ui-core-CwQmiouz.js";
import { dt as a, ft as o } from "./control-ui-foundation-0uuDj0X3.js";
import { _ as t, g as n, m as r, u as i } from "./control-ui-foundation-CCDffryi.js";
import { G as s, Y as c, at as l, et as u } from "./lit-runtime-DkvDG939.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
import { a as j, f as M, l as N, o as P, s as F, t as I } from "./settings-ui-T0X7dZpU.js";
import { n as k, t as A } from "./settings-workspace-DRQpceJK.js";
function L(e) {
  return P({
    title: e.label,
    control: l`
      <input
        class="settings-input"
        type=${e.visible ? `text` : `password`}
        autocomplete="off"
        spellcheck="false"
        .value=${e.value}
        @input=${(t) => e.onInput(t.target.value)}
        placeholder=${e.placeholder}
      />
      <openclaw-tooltip .content=${e.visible ? e.hideLabel : e.showLabel}>
        <button
          type="button"
          class="btn btn--icon ${e.visible ? `active` : ``}"
          aria-label=${e.toggleLabel}
          aria-pressed=${e.visible}
          @click=${e.onToggle}
        >
          ${e.visible ? O.eye : O.eyeOff}
        </button>
      </openclaw-tooltip>
    `,
  });
}
function R(e) {
  let t = e.hello?.snapshot,
    n = t?.uptimeMs ? r(t.uptimeMs) : w(`common.na`),
    a = e.hello?.policy?.tickIntervalMs,
    o = a ? `${(a / 1e3).toFixed(a % 1e3 == 0 ? 0 : 1)}s` : w(`common.na`),
    s = t?.authMode === `trusted-proxy`,
    c = l`
    ${P({
      title: w(`connection.access.wsUrl`),
      control: l`
        <input
          class="settings-input"
          .value=${e.settings.gatewayUrl}
          @input=${(t) => {
            let n = e.settings,
              r = t.target.value;
            e.onConnectionChange({ gatewayUrl: r, token: C(n.gatewayUrl, r, n.token) });
          }}
          placeholder="ws://100.x.y.z:18789"
        />
      `,
    })}
    ${
      s
        ? ``
        : l`
          ${L({ label: w(`connection.access.token`), value: e.settings.token, placeholder: `OPENCLAW_GATEWAY_TOKEN`, visible: e.showGatewayToken, showLabel: w(`connection.access.showToken`), hideLabel: w(`connection.access.hideToken`), toggleLabel: w(`connection.access.toggleTokenVisibility`), onInput: (t) => e.onConnectionChange({ token: t }), onToggle: e.onToggleGatewayTokenVisibility })}
          ${L({ label: w(`connection.access.password`), value: e.password, placeholder: w(`connection.access.passwordPlaceholder`), visible: e.showGatewayPassword, showLabel: w(`connection.access.showPassword`), hideLabel: w(`connection.access.hidePassword`), toggleLabel: w(`connection.access.togglePasswordVisibility`), onInput: e.onPasswordChange, onToggle: e.onToggleGatewayPasswordVisibility })}
        `
    }
    ${P({
      title: w(`connection.access.sessionKey`),
      control: l`
        <input
          class="settings-input"
          .value=${e.settings.sessionKey}
          @input=${(t) => e.onSessionKeyChange(t.target.value)}
        />
      `,
    })}
    <div class="settings-row">
      <div class="settings-row__text">
        <span class="settings-row__desc"
          >${w(s ? `connection.access.trustedProxy` : `connection.access.connectHint`)}</span
        >
      </div>
      <div class="settings-row__control">
        <button class="btn" @click=${() => e.onConnect()}>${w(`common.connect`)}</button>
        <button class="btn" @click=${() => e.onRefresh()}>${w(`common.refresh`)}</button>
      </div>
    </div>
  `,
    u = l`
    ${P({ title: w(`connection.snapshot.status`), control: N({ kind: e.connected ? `ok` : `warn`, label: e.connected ? w(`common.ok`) : w(`common.offline`) }) })}
    ${P({ title: w(`connection.snapshot.uptime`), control: M(n) })}
    ${P({ title: w(`connection.snapshot.tickInterval`), control: M(o) })}
    ${P({ title: w(`connection.snapshot.lastChannelsRefresh`), control: M(e.lastChannelsRefresh ? i(e.lastChannelsRefresh) : w(`common.na`)) })}
    ${e.lastError ? P({ title: N({ kind: `danger`, label: w(`connection.snapshot.lastError`) }), description: e.lastError }) : ``}
  `;
  return j([
    F({ title: w(`connection.access.title`), description: w(`connection.access.subtitle`) }, c),
    F({ title: w(`connection.snapshot.title`), description: w(`connection.snapshot.subtitle`) }, u),
  ]);
}
var z = e(() => {
    (u(), y(), D(), E(), I(), T(), p());
  }),
  B;
e(() => {
  (a(),
    u(),
    s(),
    b(),
    x(),
    y(),
    A(),
    d(),
    m(),
    z(),
    t(),
    (B = class extends h {
      constructor(...e) {
        (super(...e),
          (this.settings = v()),
          (this.password = ``),
          (this.gatewayTokenVisible = !1),
          (this.gatewayPasswordVisible = !1),
          (this.sessionKeyDirty = !1),
          (this.gatewayClient = null),
          (this.subscriptions = new f(this)
            .effect(
              () => this.context?.gateway,
              (e) => (
                this.resetDraft(e),
                e.subscribe((t) => {
                  (t.client === this.gatewayClient
                    ? t.connected || this.resetSensitiveUi()
                    : this.resetDraft(e),
                    this.requestUpdate());
                })
              ),
            )
            .watch(
              () => this.context?.channels,
              (e, t) => e.subscribe(t),
            )));
      }
      disconnectedCallback() {
        (this.subscriptions.clear(), this.resetSensitiveUi(), super.disconnectedCallback());
      }
      resetSensitiveUi() {
        ((this.gatewayTokenVisible = !1), (this.gatewayPasswordVisible = !1));
      }
      resetDraft(e) {
        let t = e.snapshot.sessionKey,
          { gatewayUrl: n, token: r, password: i } = e.connection;
        ((this.gatewayClient = e.snapshot.client),
          (this.settings = {
            ...v(),
            gatewayUrl: n,
            token: r,
            sessionKey: t,
            lastActiveSessionKey: t,
          }),
          (this.password = i),
          (this.sessionKeyDirty = !1),
          this.resetSensitiveUi());
      }
      connect() {
        let e = this.sessionKeyDirty
          ? { sessionKey: this.settings.sessionKey, lastActiveSessionKey: this.settings.sessionKey }
          : S(this.settings.gatewayUrl);
        ((this.settings = { ...this.settings, ...e }),
          (this.sessionKeyDirty = !1),
          this.context.gateway.connect({
            gatewayUrl: this.settings.gatewayUrl,
            token: this.settings.token,
            password: this.password,
            sessionKey: e.sessionKey,
          }));
      }
      render() {
        let e = this.context.gateway.snapshot,
          t = R({
            connected: e.connected,
            hello: e.hello,
            settings: this.settings,
            password: this.password,
            lastError: e.lastError,
            lastChannelsRefresh: this.context.channels.state.channelsLastSuccess,
            showGatewayToken: this.gatewayTokenVisible,
            showGatewayPassword: this.gatewayPasswordVisible,
            onConnectionChange: (e) => {
              this.settings = { ...this.settings, ...e };
            },
            onPasswordChange: (e) => (this.password = e),
            onSessionKeyChange: (e) => {
              ((this.sessionKeyDirty = !0),
                (this.settings = { ...this.settings, sessionKey: e, lastActiveSessionKey: e }));
            },
            onToggleGatewayTokenVisibility: () => {
              this.gatewayTokenVisible = !this.gatewayTokenVisible;
            },
            onToggleGatewayPasswordVisibility: () => {
              this.gatewayPasswordVisible = !this.gatewayPasswordVisible;
            },
            onConnect: () => this.connect(),
            onRefresh: () => void this.context.channels.refresh(!1),
          });
        return l`
      <section class="content-header">
        <div>
          <div class="page-title">${_(`connection`)}</div>
        </div>
      </section>
      ${k(t)}
    `;
      }
    }),
    n([o({ context: g, subscribe: !0 })], B.prototype, `context`, void 0),
    n([c()], B.prototype, `settings`, void 0),
    n([c()], B.prototype, `password`, void 0),
    n([c()], B.prototype, `gatewayTokenVisible`, void 0),
    n([c()], B.prototype, `gatewayPasswordVisible`, void 0),
    customElements.get(`openclaw-connection-page`) ||
      customElements.define(`openclaw-connection-page`, B));
})();
//# sourceMappingURL=connection-page-C5gy4A2B.js.map
