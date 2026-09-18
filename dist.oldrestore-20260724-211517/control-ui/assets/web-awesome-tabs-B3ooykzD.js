import {
  A as t,
  F as n,
  I as r,
  M as i,
  N as a,
  O as o,
  P as s,
  S as c,
  a as l,
  f as u,
  i as d,
  j as f,
  k as p,
  l as m,
  n as h,
  p as g,
  r as _,
  s as v,
  x as y,
  z as b,
} from "./control-ui-foundation-0uuDj0X3.js";
import {
  $ as x,
  A as S,
  G as C,
  K as w,
  Y as T,
  Z as E,
  at as D,
  et as O,
  k,
  ut as A,
} from "./lit-runtime-DkvDG939.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
var j,
  M = e(() => {
    j = class extends Event {
      constructor(e) {
        (super(`wa-tab-hide`, { bubbles: !0, cancelable: !1, composed: !0 }), (this.detail = e));
      }
    };
  }),
  N,
  P = e(() => {
    N = class extends Event {
      constructor(e) {
        (super(`wa-tab-show`, { bubbles: !0, cancelable: !1, composed: !0 }), (this.detail = e));
      }
    };
  }),
  F,
  I = e(() => {
    (O(),
      (F = A`
  :host {
    --indicator-color: var(--wa-color-brand-fill-loud);
    --track-color: var(--wa-color-neutral-fill-normal);
    --track-width: 0.125rem;

    /* Private */
    --safe-track-width: max(0.5px, round(var(--track-width), 0.5px));

    display: block;
  }

  .tab-group {
    display: flex;
    border-radius: 0;
  }

  .tabs {
    display: flex;
    position: relative;
  }

  .indicator {
    position: absolute;
  }

  .tab-group-has-scroll-controls .nav-container {
    position: relative;
    padding: 0 1.5em;
  }

  .body {
    display: block;
  }

  .scroll-button {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1.5em;
  }

  .scroll-button-start {
    inset-inline-start: 0;
  }

  .scroll-button-end {
    inset-inline-end: 0;
  }

  /*
    * Top
    */

  .tab-group-top {
    flex-direction: column;
  }

  .tab-group-top .nav-container {
    order: 1;
  }

  .tab-group-top .nav {
    display: flex;
    overflow-x: auto;

    /* Hide scrollbar in Firefox */
    scrollbar-width: none;
  }

  /* Hide scrollbar in Chrome/Safari */
  .tab-group-top .nav::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  .tab-group-top .tabs {
    flex: 1 1 auto;
    position: relative;
    flex-direction: row;
    border-bottom: solid var(--safe-track-width) var(--track-color);
  }

  .tab-group-top .indicator {
    bottom: calc(-1 * var(--safe-track-width));
    border-bottom: solid var(--safe-track-width) var(--indicator-color);
  }

  .tab-group-top .body {
    order: 2;
  }

  .tab-group-top ::slotted(wa-tab[active]) {
    border-block-end: solid var(--safe-track-width) var(--indicator-color);
    margin-block-end: calc(-1 * var(--safe-track-width));
  }

  .tab-group-top .body slot::slotted(wa-tab-panel) {
    --padding: var(--wa-space-xl) 0;
  }

  /*
    * Bottom
    */

  .tab-group-bottom {
    flex-direction: column;
  }

  .tab-group-bottom .nav-container {
    order: 2;
  }

  .tab-group-bottom .nav {
    display: flex;
    overflow-x: auto;

    /* Hide scrollbar in Firefox */
    scrollbar-width: none;
  }

  /* Hide scrollbar in Chrome/Safari */
  .tab-group-bottom .nav::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  .tab-group-bottom .tabs {
    flex: 1 1 auto;
    position: relative;
    flex-direction: row;
    border-top: solid var(--safe-track-width) var(--track-color);
  }

  .tab-group-bottom .indicator {
    top: calc(-1 * var(--safe-track-width));
    border-top: solid var(--safe-track-width) var(--indicator-color);
  }

  .tab-group-bottom .body {
    order: 1;
  }

  .tab-group-bottom ::slotted(wa-tab[active]) {
    border-block-start: solid var(--safe-track-width) var(--indicator-color);
    margin-block-start: calc(-1 * var(--safe-track-width));
  }

  .tab-group-bottom .body slot::slotted(wa-tab-panel) {
    --padding: var(--wa-space-xl) 0;
  }

  /*
    * Start
    */

  .tab-group-start {
    flex-direction: row;
  }

  .tab-group-start .nav-container {
    order: 1;
  }

  .tab-group-start .tabs {
    flex: 0 0 auto;
    flex-direction: column;
    border-inline-end: solid var(--safe-track-width) var(--track-color);
  }

  .tab-group-start .indicator {
    inset-inline-end: calc(-1 * var(--safe-track-width));
    border-right: solid var(--safe-track-width) var(--indicator-color);
  }

  .tab-group-start .body {
    flex: 1 1 auto;
    order: 2;
  }

  .tab-group-start ::slotted(wa-tab[active]) {
    border-inline-end: solid var(--safe-track-width) var(--indicator-color);
    margin-inline-end: calc(-1 * var(--safe-track-width));
  }

  .tab-group-start .body slot::slotted(wa-tab-panel) {
    --padding: 0 var(--wa-space-xl);
  }

  /*
    * End
    */

  .tab-group-end {
    flex-direction: row;
  }

  .tab-group-end .nav-container {
    order: 2;
  }

  .tab-group-end .tabs {
    flex: 0 0 auto;
    flex-direction: column;
    border-left: solid var(--safe-track-width) var(--track-color);
  }

  .tab-group-end .indicator {
    inset-inline-start: calc(-1 * var(--safe-track-width));
    border-inline-start: solid var(--safe-track-width) var(--indicator-color);
  }

  .tab-group-end .body {
    flex: 1 1 auto;
    order: 1;
  }

  .tab-group-end ::slotted(wa-tab[active]) {
    border-inline-start: solid var(--safe-track-width) var(--indicator-color);
    margin-inline-start: calc(-1 * var(--safe-track-width));
  }

  .tab-group-end .body slot::slotted(wa-tab-panel) {
    --padding: 0 var(--wa-space-xl);
  }
`));
  }),
  L,
  R = e(() => {
    (M(),
      P(),
      I(),
      u(),
      n(),
      i(),
      p(),
      s(),
      O(),
      C(),
      k(),
      (L = class extends f {
        constructor() {
          (super(...arguments),
            (this.tabs = []),
            (this.focusableTabs = []),
            (this.panels = []),
            (this.localize = new o(this)),
            (this.hasScrollControls = !1),
            (this.active = ``),
            (this.placement = `top`),
            (this.activation = `auto`),
            (this.withoutScrollControls = !1));
        }
        connectedCallback() {
          (super.connectedCallback(),
            (this.resizeObserver = new ResizeObserver(() => {
              this.updateScrollControls();
            })),
            (this.mutationObserver = new MutationObserver((e) => {
              e.some((e) => ![`aria-labelledby`, `aria-controls`].includes(e.attributeName)) &&
                setTimeout(() => this.setAriaLabels());
              let t = e.filter((e) => e.target.closest(`wa-tab-group`) === this);
              if (t.some((e) => e.attributeName === `disabled`)) this.syncTabsAndPanels();
              else if (t.some((e) => e.attributeName === `active`)) {
                let e = t
                  .filter(
                    (e) =>
                      e.attributeName === `active` && e.target.tagName.toLowerCase() === `wa-tab`,
                  )
                  .map((e) => e.target)
                  .find((e) => e.active);
                e && e.closest(`wa-tab-group`) === this && this.setActiveTab(e);
              }
            })),
            this.updateComplete.then(() => {
              (this.syncTabsAndPanels(),
                this.mutationObserver.observe(this, { attributes: !0, childList: !0, subtree: !0 }),
                this.resizeObserver.observe(this.nav),
                new IntersectionObserver((e, t) => {
                  if (e[0].intersectionRatio > 0) {
                    if ((this.setAriaLabels(), this.active)) {
                      let e = this.tabs.find((e) => e.panel === this.active);
                      e && this.setActiveTab(e);
                    } else
                      this.setActiveTab(this.getActiveTab() ?? this.tabs[0], { emitEvents: !1 });
                    t.unobserve(e[0].target);
                  }
                }).observe(this.tabGroup));
            }));
        }
        disconnectedCallback() {
          (super.disconnectedCallback(),
            this.mutationObserver?.disconnect(),
            this.nav && this.resizeObserver?.unobserve(this.nav));
        }
        getAllTabs() {
          return [...this.shadowRoot.querySelector(`slot[name="nav"]`).assignedElements()].filter(
            (e) => e.tagName.toLowerCase() === `wa-tab`,
          );
        }
        getAllPanels() {
          return [...this.defaultSlot.assignedElements()].filter(
            (e) => e.tagName.toLowerCase() === `wa-tab-panel`,
          );
        }
        getActiveTab() {
          return this.tabs.find((e) => e.active);
        }
        handleClick(e) {
          let t = e.target.closest(`wa-tab`);
          t?.closest(`wa-tab-group`) === this &&
            t !== null &&
            this.setActiveTab(t, { scrollBehavior: `smooth` });
        }
        handleKeyDown(e) {
          let t = e.target.closest(`wa-tab`);
          if (t?.closest(`wa-tab-group`) === this) {
            if ([`Enter`, ` `].includes(e.key)) {
              t !== null &&
                (this.setActiveTab(t, { scrollBehavior: `smooth` }), e.preventDefault());
              return;
            }
            if (
              [`ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`, `Home`, `End`].includes(e.key)
            ) {
              let t = this.tabs.find((e) => e.matches(`:focus`)),
                n = this.localize.dir() === `rtl`,
                r = null;
              if (t?.tagName.toLowerCase() === `wa-tab`) {
                if (e.key === `Home`) r = this.focusableTabs[0];
                else if (e.key === `End`) r = this.focusableTabs[this.focusableTabs.length - 1];
                else if (
                  ([`top`, `bottom`].includes(this.placement) &&
                    e.key === (n ? `ArrowRight` : `ArrowLeft`)) ||
                  ([`start`, `end`].includes(this.placement) && e.key === `ArrowUp`)
                ) {
                  let e = this.tabs.findIndex((e) => e === t);
                  r = this.findNextFocusableTab(e, `backward`);
                } else if (
                  ([`top`, `bottom`].includes(this.placement) &&
                    e.key === (n ? `ArrowLeft` : `ArrowRight`)) ||
                  ([`start`, `end`].includes(this.placement) && e.key === `ArrowDown`)
                ) {
                  let e = this.tabs.findIndex((e) => e === t);
                  r = this.findNextFocusableTab(e, `forward`);
                }
                if (!r) return;
                ((r.tabIndex = 0),
                  r.focus({ preventScroll: !0 }),
                  this.activation === `auto`
                    ? this.setActiveTab(r, { scrollBehavior: `smooth` })
                    : this.tabs.forEach((e) => {
                        e.tabIndex = e === r ? 0 : -1;
                      }),
                  [`top`, `bottom`].includes(this.placement) && g(r, this.nav, `horizontal`),
                  e.preventDefault());
              }
            }
          }
        }
        findNextFocusableTab(e, t) {
          let n = null,
            r = t === `forward` ? 1 : -1,
            i = e + r;
          for (; e < this.tabs.length;) {
            if (((n = this.tabs[i] || null), n === null)) {
              n =
                t === `forward`
                  ? this.focusableTabs[0]
                  : this.focusableTabs[this.focusableTabs.length - 1];
              break;
            }
            if (!n.disabled) break;
            i += r;
          }
          return n;
        }
        handleScrollToStart() {
          this.nav.scroll({
            left:
              this.localize.dir() === `rtl`
                ? this.nav.scrollLeft + this.nav.clientWidth
                : this.nav.scrollLeft - this.nav.clientWidth,
            behavior: `smooth`,
          });
        }
        handleScrollToEnd() {
          this.nav.scroll({
            left:
              this.localize.dir() === `rtl`
                ? this.nav.scrollLeft - this.nav.clientWidth
                : this.nav.scrollLeft + this.nav.clientWidth,
            behavior: `smooth`,
          });
        }
        setActiveTab(e, t) {
          if (
            ((t = { emitEvents: !0, scrollBehavior: `auto`, ...t }),
            e.closest(`wa-tab-group`) === this && e !== this.activeTab && !e.disabled)
          ) {
            let n = this.activeTab;
            ((this.active = e.panel),
              (this.activeTab = e),
              this.tabs.forEach((e) => {
                ((e.active = e === this.activeTab), (e.tabIndex = e === this.activeTab ? 0 : -1));
              }),
              this.panels.forEach((e) => (e.active = e.name === this.activeTab?.panel)),
              [`top`, `bottom`].includes(this.placement) &&
                g(this.activeTab, this.nav, `horizontal`, t.scrollBehavior),
              t.emitEvents &&
                (n && this.dispatchEvent(new j({ name: n.panel })),
                this.dispatchEvent(new N({ name: this.activeTab.panel }))));
          }
        }
        setAriaLabels() {
          this.tabs.forEach((e) => {
            let t = this.panels.find((t) => t.name === e.panel);
            t &&
              (e.setAttribute(`aria-controls`, t.getAttribute(`id`)),
              t.setAttribute(`aria-labelledby`, e.getAttribute(`id`)));
          });
        }
        syncTabsAndPanels() {
          ((this.tabs = this.getAllTabs()),
            (this.focusableTabs = this.tabs.filter((e) => !e.disabled)),
            (this.panels = this.getAllPanels()),
            this.updateComplete.then(() => this.updateScrollControls()));
        }
        updateActiveTab() {
          let e = this.tabs.find((e) => e.panel === this.active);
          e && this.setActiveTab(e, { scrollBehavior: `smooth` });
        }
        updateScrollControls() {
          this.withoutScrollControls
            ? (this.hasScrollControls = !1)
            : (this.hasScrollControls =
                [`top`, `bottom`].includes(this.placement) &&
                this.nav.scrollWidth > this.nav.clientWidth + 1);
        }
        render() {
          let e = this.hasUpdated ? this.localize.dir() === `rtl` : this.dir === `rtl`;
          return D`
      <div
        part="base"
        class=${S({ "tab-group": !0, "tab-group-top": this.placement === `top`, "tab-group-bottom": this.placement === `bottom`, "tab-group-start": this.placement === `start`, "tab-group-end": this.placement === `end`, "tab-group-has-scroll-controls": this.hasScrollControls })}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
      >
        <div class="nav-container" part="nav">
          ${
            this.hasScrollControls
              ? D`
                <wa-button
                  part="scroll-button scroll-button-start"
                  exportparts="base:scroll-button__base"
                  class="scroll-button scroll-button-start"
                  appearance="plain"
                  @click=${this.handleScrollToStart}
                >
                  <wa-icon
                    name=${e ? `chevron-right` : `chevron-left`}
                    library="system"
                    variant="solid"
                    label=${this.localize.term(`scrollToStart`)}
                  ></wa-icon>
                </wa-button>
              `
              : ``
          }

          <!-- We have a focus listener because in Firefox (and soon to be Chrome) overflow containers are focusable. -->
          <div class="nav" @focus=${() => this.activeTab?.focus({ preventScroll: !0 })}>
            <div part="tabs" class="tabs" role="tablist">
              <slot name="nav" @slotchange=${this.syncTabsAndPanels}></slot>
            </div>
          </div>

          ${
            this.hasScrollControls
              ? D`
                <wa-button
                  part="scroll-button scroll-button-end"
                  class="scroll-button scroll-button-end"
                  exportparts="base:scroll-button__base"
                  appearance="plain"
                  @click=${this.handleScrollToEnd}
                >
                  <wa-icon
                    name=${e ? `chevron-left` : `chevron-right`}
                    library="system"
                    variant="solid"
                    label=${this.localize.term(`scrollToEnd`)}
                  ></wa-icon>
                </wa-button>
              `
              : ``
          }
        </div>

        <div part="body" class="body"><slot @slotchange=${this.syncTabsAndPanels}></slot></div>
      </div>
    `;
        }
      }),
      (L.css = F),
      a([w(`.tab-group`)], L.prototype, `tabGroup`, 2),
      a([w(`.body slot`)], L.prototype, `defaultSlot`, 2),
      a([w(`.nav`)], L.prototype, `nav`, 2),
      a([T()], L.prototype, `hasScrollControls`, 2),
      a([E({ reflect: !0 })], L.prototype, `active`, 2),
      a([E()], L.prototype, `placement`, 2),
      a([E()], L.prototype, `activation`, 2),
      a(
        [E({ attribute: `without-scroll-controls`, type: Boolean })],
        L.prototype,
        `withoutScrollControls`,
        2,
      ),
      a([r(`active`)], L.prototype, `updateActiveTab`, 1),
      a(
        [r(`withoutScrollControls`, { waitUntilFirstUpdate: !0 })],
        L.prototype,
        `updateScrollControls`,
        1,
      ),
      (L = a([x(`wa-tab-group`)], L)));
  }),
  z,
  B = e(() => {
    (O(),
      (z = A`
  :host {
    display: inline-block;
    color: var(--wa-color-neutral-on-quiet);
    font-weight: var(--wa-font-weight-action);
  }

  .tab {
    display: inline-flex;
    align-items: center;
    font: inherit;
    padding: 1em 1.5em;
    white-space: nowrap;
    user-select: none;
    -webkit-user-select: none;
    cursor: pointer;
    transition: color var(--wa-transition-fast) var(--wa-transition-easing);

    ::slotted(wa-icon:first-child) {
      margin-inline-end: 0.5em;
    }

    ::slotted(wa-icon:last-child) {
      margin-inline-start: 0.5em;
    }
  }

  @media (hover: hover) {
    :host(:hover:not([disabled])) .tab {
      color: currentColor;
    }
  }

  :host(:focus) {
    outline: transparent;
  }

  :host(:focus-visible) .tab {
    outline: var(--wa-focus-ring);
    outline-offset: calc(-1 * var(--wa-border-width-l) - var(--wa-focus-ring-offset));
  }

  :host([active]:not([disabled])) {
    color: var(--wa-color-brand-on-quiet);
  }

  :host([disabled]) .tab {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (forced-colors: active) {
    :host([active]:not([disabled])) {
      outline: solid 1px transparent;
      outline-offset: -3px;
    }
  }
`));
  }),
  V,
  H,
  U = e(() => {
    (B(),
      n(),
      i(),
      s(),
      O(),
      C(),
      k(),
      (V = 0),
      (H = class extends f {
        constructor() {
          (super(...arguments),
            (this.attrId = ++V),
            (this.componentId = `wa-tab-${this.attrId}`),
            (this.panel = ``),
            (this.active = !1),
            (this.disabled = !1),
            (this.tabIndex = 0),
            (this.slot = `nav`),
            (this.role = `tab`));
        }
        handleActiveChange() {
          this.setAttribute(`aria-selected`, this.active ? `true` : `false`);
        }
        handleDisabledChange() {
          (this.setAttribute(`aria-disabled`, this.disabled ? `true` : `false`),
            this.disabled && !this.active ? (this.tabIndex = -1) : (this.tabIndex = 0));
        }
        render() {
          return (
            (this.id = this.id?.length > 0 ? this.id : this.componentId),
            D`
      <div
        part="base"
        class=${S({ tab: !0, "tab-active": this.active })}
      >
        <slot></slot>
      </div>
    `
          );
        }
      }),
      (H.css = z),
      a([w(`.tab`)], H.prototype, `tab`, 2),
      a([E({ reflect: !0 })], H.prototype, `panel`, 2),
      a([E({ type: Boolean, reflect: !0 })], H.prototype, `active`, 2),
      a([E({ type: Boolean, reflect: !0 })], H.prototype, `disabled`, 2),
      a([E({ type: Number, reflect: !0 })], H.prototype, `tabIndex`, 2),
      a([E({ reflect: !0 })], H.prototype, `slot`, 2),
      a([E({ reflect: !0 })], H.prototype, `role`, 2),
      a([r(`active`)], H.prototype, `handleActiveChange`, 1),
      a([r(`disabled`)], H.prototype, `handleDisabledChange`, 1),
      (H = a([x(`wa-tab`)], H)));
  }),
  W,
  G = e(() => {
    (O(),
      (W = A`
  :host {
    --padding: 0;

    display: none;
  }

  :host([active]) {
    display: block;
  }

  .tab-panel {
    display: block;
    padding: var(--padding);
  }
`));
  }),
  K,
  q,
  J = e(() => {
    (G(),
      n(),
      i(),
      s(),
      O(),
      C(),
      k(),
      (K = 0),
      (q = class extends f {
        constructor() {
          (super(...arguments),
            (this.attrId = ++K),
            (this.componentId = `wa-tab-panel-${this.attrId}`),
            (this.name = ``),
            (this.active = !1),
            (this.role = `tabpanel`));
        }
        connectedCallback() {
          (super.connectedCallback(),
            (this.id = (this.id || ``).length > 0 ? this.id : this.componentId));
        }
        handleActiveChange() {
          this.setAttribute(`aria-hidden`, this.active ? `false` : `true`);
        }
        render() {
          return D`
      <slot
        part="base"
        class=${S({ "tab-panel": !0, "tab-panel-active": this.active })}
      ></slot>
    `;
        }
      }),
      (q.css = W),
      a([E({ reflect: !0 })], q.prototype, `name`, 2),
      a([E({ type: Boolean, reflect: !0 })], q.prototype, `active`, 2),
      a([E({ reflect: !0 })], q.prototype, `role`, 2),
      a([r(`active`)], q.prototype, `handleActiveChange`, 1),
      (q = a([x(`wa-tab-panel`)], q)));
  }),
  Y = e(() => {
    (R(), U(), I(), J(), G(), B(), d(), h(), _(), m(), b(), v(), l(), y(), c(), i(), p(), t());
  }),
  X = e(() => {
    (J(), G(), i());
  }),
  Z = e(() => {
    (U(), B(), i());
  }),
  Q = e(() => {
    (Y(), X(), Z());
  });
export { Q as t };
//# sourceMappingURL=web-awesome-tabs-B3ooykzD.js.map
