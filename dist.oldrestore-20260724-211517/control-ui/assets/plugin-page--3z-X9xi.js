const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "./workspace-view-DfedHez4.js",
      "./rolldown-runtime-DaJ6WEGw.js",
      "./control-ui-core-CFS5NQSC.js",
      "./control-ui-foundation-CCDffryi.js",
      "./control-ui-foundation-s2wA1PVE.js",
      "./control-ui-foundation-CSxeaoE-.js",
      "./control-ui-foundation-DmtL9jaX.js",
      "./control-ui-foundation-BSyioE0Z.js",
      "./control-ui-foundation-BV4RtoqL.js",
      "./control-ui-foundation-Ce4npCeY.js",
      "./control-ui-foundation-ZzBFjbRr.js",
      "./control-ui-foundation-BWwpVuhO.js",
      "./control-ui-foundation-0uuDj0X3.js",
      "./lit-runtime-DkvDG939.js",
      "./control-ui-core-BcbHa4vB.js",
      "./gateway-runtime-D6zABMsO.js",
      "./control-ui-core--EZfp09c.js",
      "./config-runtime-BxOat2Bj.js",
      "./control-ui-core-CwQmiouz.js",
      "./control-ui-core-CQDTaMS5.js",
      "./control-ui-shared-CrnVqnQR.js",
      "./control-ui-core-BA6QIQgk.css",
      "./web-awesome-tabs-B3ooykzD.js",
      "./markdown-ERFX4kV-.js",
      "./markdown-runtime-BBD8XmVB.js",
      "./tool-display-DdrJibK-.js",
      "./workspace-view-DDCwhOJx.css",
      "./workspace-controller-3s5Py32B.js",
      "./logbook-view-C079aMHL.js",
      "./logbook-controller-Ct3F3xtd.js",
      "./logbook-view-BG9QHuAs.css",
    ]),
) => i.map((i) => d[i]);
import { K as y, q as b } from "./control-ui-core--EZfp09c.js";
import { ca as h, da as g, di as _, fi as v } from "./control-ui-core-BcbHa4vB.js";
import { Ft as a, Nt as o } from "./control-ui-core-CFS5NQSC.js";
import { o as x, t as S } from "./control-ui-core-CwQmiouz.js";
import { dt as s, ft as c } from "./control-ui-foundation-0uuDj0X3.js";
import { _ as t, g as n, v as r, y as i } from "./control-ui-foundation-CCDffryi.js";
import { G as l, Y as u, Z as d, at as f, et as p, nt as m } from "./lit-runtime-DkvDG939.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
import { i as C, n as w } from "./tool-display-DdrJibK-.js";
var T, E;
e(() => {
  (s(),
    p(),
    l(),
    b(),
    S(),
    w(),
    g(),
    v(),
    o(),
    t(),
    i(),
    (T = {
      "workspaces/workspaces": async () => {
        let [{ renderWorkspace: e }, { stopWorkspace: t }] = await Promise.all([
          r(
            () => import(`./workspace-view-DfedHez4.js`),
            __vite__mapDeps([
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
              24, 25, 26,
            ]),
            import.meta.url,
          ),
          r(
            () => import(`./workspace-controller-3s5Py32B.js`),
            __vite__mapDeps([
              27, 1, 0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
              23, 24, 25, 26,
            ]),
            import.meta.url,
          ),
        ]);
        return { render: e, stop: t };
      },
      "logbook/logbook": async () => {
        let [{ renderLogbook: e }, { stopLogbookPolling: t }] = await Promise.all([
          r(
            () => import(`./logbook-view-C079aMHL.js`),
            __vite__mapDeps([
              28, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 2, 18, 19, 20, 21, 17, 23, 24,
              29, 30,
            ]),
            import.meta.url,
          ),
          r(
            () => import(`./logbook-controller-Ct3F3xtd.js`),
            __vite__mapDeps([29, 1]),
            import.meta.url,
          ),
        ]);
        return { render: e, stop: t };
      },
    }),
    (E = class extends h {
      constructor(...e) {
        (super(...e),
          (this.pluginId = ``),
          (this.tabId = ``),
          (this.bundledView = null),
          (this.bundledViewId = null),
          (this.bundledViewLoadToken = null),
          (this.bundledViewHost = {}),
          (this.gatewayClient = null),
          (this.gatewayConnected = !1),
          (this.subscriptions = new _(this).watch(
            () => this.context?.gateway,
            (e, t) => e.subscribe(t),
            (e) => this.updateGatewaySource(e),
          )));
      }
      disconnectedCallback() {
        (this.subscriptions.clear(), this.stopBundledView(), super.disconnectedCallback());
      }
      tabKey() {
        return a({ pluginId: this.pluginId, id: this.tabId });
      }
      loadBundledView(e) {
        let t = T[e];
        return t ? t() : Promise.reject(Error(`Unknown bundled plugin tab: ${e}`));
      }
      willUpdate() {
        if (!this.isConnected) return;
        let e = this.tabKey(),
          t = this.tabInfo() !== void 0 && e in T;
        if (
          (this.bundledViewId !== null &&
            (this.bundledViewId !== e || !t) &&
            this.stopBundledView(),
          this.bundledViewId === null && t)
        ) {
          let t = {};
          ((this.bundledViewId = e),
            (this.bundledViewLoadToken = t),
            this.loadBundledView(e).then((n) => {
              this.bundledViewLoadToken === t &&
                this.bundledViewId === e &&
                this.tabKey() === e &&
                (this.bundledView = n);
            }));
        }
      }
      stopBundledView() {
        (this.replaceBundledViewHost(),
          (this.bundledView = null),
          (this.bundledViewId = null),
          (this.bundledViewLoadToken = null));
      }
      replaceBundledViewHost() {
        (this.bundledView?.stop(this.bundledViewHost), (this.bundledViewHost = {}));
      }
      updateGatewaySource(e) {
        let { client: t, connected: n } = e.snapshot;
        (this.gatewaySource === e && this.gatewayClient === t && this.gatewayConnected === n) ||
          (this.replaceBundledViewHost(),
          (this.gatewaySource = e),
          (this.gatewayClient = t),
          (this.gatewayConnected = n));
      }
      tabInfo() {
        return (this.context?.gateway.snapshot.hello?.controlUiTabs ?? []).find(
          (e) => e.pluginId === this.pluginId && e.id === this.tabId,
        );
      }
      render() {
        let e = this.context;
        if (!e) return m;
        let t = this.tabInfo();
        if (t && this.tabKey() in T) {
          if (!this.bundledView) return m;
          let t = e.gateway.snapshot,
            n = e.config?.current;
          return this.bundledView.render({
            host: this.bundledViewHost,
            client: t.client,
            connected: t.connected,
            embed: n
              ? {
                  embedSandboxMode: n.embedSandboxMode,
                  allowExternalEmbedUrls: n.allowExternalEmbedUrls,
                }
              : void 0,
            onRequestUpdate: () => this.requestUpdate(),
            basePath: e.basePath,
            sessionKey: t.sessionKey,
          });
        }
        return t?.path
          ? f`
        <section class="plugin-tab-embed">
          <iframe
            class="plugin-tab-embed__frame"
            src=${t.path}
            title=${t.label}
            sandbox=${C(e.config.current.embedSandboxMode)}
          ></iframe>
        </section>
      `
          : f`
      <section class="card lazy-view-state" role="status">
        <div class="card-title">${x(`pluginTabs.unavailableTitle`)}</div>
        <div class="card-sub">${x(`pluginTabs.unavailableSubtitle`)}</div>
      </section>
    `;
      }
    }),
    n([d({ attribute: !1 })], E.prototype, `pluginId`, void 0),
    n([d({ attribute: !1 })], E.prototype, `tabId`, void 0),
    n([c({ context: y, subscribe: !0 })], E.prototype, `context`, void 0),
    n([u()], E.prototype, `bundledView`, void 0),
    customElements.get(`openclaw-plugin-page`) || customElements.define(`openclaw-plugin-page`, E));
})();
//# sourceMappingURL=plugin-page--3z-X9xi.js.map
