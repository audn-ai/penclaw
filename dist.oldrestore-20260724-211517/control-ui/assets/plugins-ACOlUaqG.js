import { o, t as s } from "./control-ui-core-CwQmiouz.js";
import { F as t, M as n, at as r, et as i, nt as a } from "./lit-runtime-DkvDG939.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
import { t as c } from "./web-awesome-tabs-B3ooykzD.js";
function l(e) {
  switch (e) {
    case `installed`:
      return o(`pluginsPage.installedTab`);
    case `discover`:
      return o(`pluginsPage.discoverTab`);
    case `skills`:
      return o(`tabs.skills`);
    case `workshop`:
      return o(`pluginsPage.workshopTab`);
    default:
      return e;
  }
}
function u(e, t) {
  (!g && e !== t.active && (h = { tab: e, at: Date.now() }), (g = !1), t.onSelect(e));
}
function d(e, t) {
  if (!t || h?.tab !== e) return;
  let n = h;
  ((h = null),
    !(Date.now() - n.at > m) &&
      window.setTimeout(() => {
        t.isConnected && t.focus();
      }, 0));
}
function f(e) {
  return r`
    <wa-tab-group
      class="settings-segmented plugins-hub-tabs plugins-tabs"
      aria-label=${o(`pluginsPage.hubTablistLabel`)}
      .active=${e.active}
      activation="manual"
      without-scroll-controls
      @wa-tab-show=${(t) => u(t.detail.name, e)}
    >
      ${p.map((n) => {
        let i = e.active === n,
          o = n === `installed` ? (e.installedCount ?? null) : null;
        return r`
          <wa-tab
            id=${`plugins-tab-${n}`}
            panel=${n}
            aria-controls="plugins-hub-panel"
            class="settings-segmented__btn ${i ? `settings-segmented__btn--active` : ``}"
            ?active=${i}
            @click=${(e) => {
              g = e.detail > 0;
            }}
            @keydown=${() => {
              g = !1;
            }}
            ${i ? t((e) => d(n, e)) : a}
          >
            ${l(n)}
            ${o === null ? a : r`<span class="settings-count">${o}</span>`}
          </wa-tab>
        `;
      })}
    </wa-tab-group>
  `;
}
var p,
  m,
  h,
  g,
  _ = e(() => {
    (i(),
      n(),
      s(),
      c(),
      (p = [`installed`, `discover`, `skills`, `workshop`]),
      (m = 2e3),
      (h = null),
      (g = !1));
  }),
  v = e(() => {});
export { _ as n, f as r, v as t };
//# sourceMappingURL=plugins-ACOlUaqG.js.map
