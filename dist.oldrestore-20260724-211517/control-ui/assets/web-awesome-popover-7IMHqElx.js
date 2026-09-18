import {
  $ as t,
  A as n,
  C as r,
  F as i,
  G as a,
  I as o,
  J as s,
  K as c,
  L as l,
  M as u,
  N as d,
  P as f,
  Q as p,
  R as m,
  T as h,
  U as g,
  W as _,
  X as v,
  Y as y,
  Z as b,
  _ as x,
  et as S,
  j as C,
  k as w,
  nt as T,
  q as E,
  tt as D,
  v as O,
  w as k,
} from "./control-ui-foundation-0uuDj0X3.js";
import {
  $ as A,
  A as j,
  G as M,
  K as N,
  Y as P,
  Z as F,
  at as I,
  et as L,
  k as R,
  ut as z,
} from "./lit-runtime-DkvDG939.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
var B,
  V = e(() => {
    (L(),
      (B = z`
  :host {
    --arrow-size: 0.375rem;
    --max-width: 25rem;
    --show-duration: var(--wa-transition-fast);
    --hide-duration: var(--wa-transition-fast);

    display: contents;

    /** Defaults for inherited CSS properties */
    font-size: var(--wa-font-size-m);
    line-height: var(--wa-line-height-normal);
    text-align: start;
    white-space: normal;
  }

  /* The native dialog element */
  .dialog {
    display: none;
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
    overflow: visible;
    pointer-events: none;

    &:focus {
      outline: none;
    }

    &[open] {
      display: block;
    }
  }

  /* The <wa-popup> element */
  .popover {
    --arrow-size: inherit;
    --popup-border-width: var(--wa-panel-border-width);
    --show-duration: inherit;
    --hide-duration: inherit;

    pointer-events: auto;

    &::part(arrow) {
      background-color: var(--wa-color-surface-default);
      border-top: none;
      border-left: none;
      border-bottom: solid var(--wa-panel-border-width) var(--wa-color-surface-border);
      border-right: solid var(--wa-panel-border-width) var(--wa-color-surface-border);
      box-shadow: none;
    }
  }

  .popover[placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .popover[placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  .popover[placement^='left']::part(popup) {
    transform-origin: right;
  }

  .popover[placement^='right']::part(popup) {
    transform-origin: left;
  }

  /* Body */
  .body {
    display: flex;
    flex-direction: column;
    width: auto;
    max-width: min(var(--max-width), 100vw);
    padding: var(--wa-space-l);
    background-color: var(--wa-color-surface-default);
    border: var(--wa-panel-border-width) solid var(--wa-color-surface-border);
    border-radius: var(--wa-panel-border-radius);
    border-style: var(--wa-panel-border-style);
    box-shadow: var(--wa-shadow-l);
    color: var(--wa-color-text-normal);
    user-select: none;
    -webkit-user-select: none;
  }
`));
  }),
  H,
  U,
  W = e(() => {
    (V(),
      T(),
      S(),
      p(),
      v(),
      k(),
      a(),
      g(),
      x(),
      m(),
      i(),
      u(),
      f(),
      L(),
      M(),
      R(),
      (H = new Set()),
      (U = class extends C {
        constructor() {
          (super(...arguments),
            (this.anchor = null),
            (this.placement = `top`),
            (this.open = !1),
            (this.distance = 8),
            (this.skidding = 0),
            (this.for = null),
            (this.withoutArrow = !1),
            (this.eventController = new AbortController()),
            (this.handleAnchorClick = () => {
              this.open = !this.open;
            }),
            (this.handleBodyClick = (e) => {
              e.target.closest(`[data-popover="close"]`) && (e.stopPropagation(), (this.open = !1));
            }),
            (this.handleDocumentKeyDown = (e) => {
              e.key === `Escape` &&
                this.open &&
                c(this) &&
                (e.preventDefault(),
                e.stopPropagation(),
                (this.open = !1),
                this.anchor && typeof this.anchor.focus == `function` && this.anchor.focus());
            }),
            (this.handleDocumentClick = (e) => {
              (this.anchor && e.composedPath().includes(this.anchor)) ||
                e.composedPath().includes(this) ||
                (this.open = !1);
            }));
        }
        connectedCallback() {
          (super.connectedCallback(),
            (this.id ||= _(`wa-popover-`)),
            this.eventController.signal.aborted && (this.eventController = new AbortController()),
            this.for && this.anchor && ((this.anchor = null), this.handleForChange()));
        }
        disconnectedCallback() {
          (super.disconnectedCallback(),
            document.removeEventListener(`keydown`, this.handleDocumentKeyDown),
            s(this),
            this.eventController.abort());
        }
        firstUpdated() {
          this.open && (this.dialog.show(), (this.popup.active = !0), this.popup.reposition());
        }
        updated(e) {
          e.has(`open`) && this.customStates.set(`open`, this.open);
        }
        async handleOpenChange() {
          if (this.open) {
            let e = new D();
            if ((this.dispatchEvent(e), e.defaultPrevented)) {
              this.open = !1;
              return;
            }
            (H.forEach((e) => (e.open = !1)),
              document.addEventListener(`keydown`, this.handleDocumentKeyDown, {
                signal: this.eventController.signal,
              }),
              document.addEventListener(`click`, this.handleDocumentClick, {
                signal: this.eventController.signal,
              }),
              this.dialog.show(),
              (this.popup.active = !0),
              H.add(this),
              E(this),
              requestAnimationFrame(() => {
                let e = this.querySelector(`[autofocus]`);
                e && typeof e.focus == `function` ? e.focus() : this.dialog.focus();
              }),
              await l(this.popup.popup, `show-with-scale`),
              this.popup.reposition(),
              this.dispatchEvent(new b()));
          } else {
            let e = new t();
            if ((this.dispatchEvent(e), e.defaultPrevented)) {
              this.open = !0;
              return;
            }
            (document.removeEventListener(`keydown`, this.handleDocumentKeyDown),
              document.removeEventListener(`click`, this.handleDocumentClick),
              H.delete(this),
              s(this),
              await l(this.popup.popup, `hide-with-scale`),
              (this.popup.active = !1),
              this.dialog.close(),
              this.dispatchEvent(new y()));
          }
        }
        handleForChange() {
          let e = this.getRootNode();
          if (!e) return;
          let t = this.for ? e.getElementById(this.for) : null,
            n = this.anchor;
          if (t === n) return;
          let { signal: r } = this.eventController;
          (t && t.addEventListener(`click`, this.handleAnchorClick, { signal: r }),
            n && n.removeEventListener(`click`, this.handleAnchorClick),
            (this.anchor = t),
            this.for &&
              !t &&
              console.warn(
                `A popover was assigned to an element with an ID of "${this.for}" but the element could not be found.`,
                this,
              ));
        }
        async handleOptionsChange() {
          this.hasUpdated && (await this.updateComplete, this.popup.reposition());
        }
        async show() {
          if (!this.open) return ((this.open = !0), O(this, `wa-after-show`));
        }
        async hide() {
          if (this.open) return ((this.open = !1), O(this, `wa-after-hide`));
        }
        render() {
          return I`
      <dialog part="dialog" class="dialog">
        <wa-popup
          part="popup"
          exportparts="
            popup:popup__popup,
            arrow:popup__arrow
          "
          class=${j({ popover: !0, "popover-open": this.open })}
          placement=${this.placement}
          distance=${this.distance}
          skidding=${this.skidding}
          flip
          shift
          shift-padding="8"
          ?arrow=${!this.withoutArrow}
          .anchor=${this.anchor}
        >
          <div part="body" class="body" @click=${this.handleBodyClick}>
            <slot></slot>
          </div>
        </wa-popup>
      </dialog>
    `;
        }
      }),
      (U.css = B),
      (U.dependencies = { "wa-popup": r }),
      d([N(`dialog`)], U.prototype, `dialog`, 2),
      d([N(`.body`)], U.prototype, `body`, 2),
      d([N(`wa-popup`)], U.prototype, `popup`, 2),
      d([P()], U.prototype, `anchor`, 2),
      d([F()], U.prototype, `placement`, 2),
      d([F({ type: Boolean, reflect: !0 })], U.prototype, `open`, 2),
      d([F({ type: Number })], U.prototype, `distance`, 2),
      d([F({ type: Number })], U.prototype, `skidding`, 2),
      d([F()], U.prototype, `for`, 2),
      d(
        [F({ attribute: `without-arrow`, type: Boolean, reflect: !0 })],
        U.prototype,
        `withoutArrow`,
        2,
      ),
      d([o(`open`, { waitUntilFirstUpdate: !0 })], U.prototype, `handleOpenChange`, 1),
      d([o(`for`)], U.prototype, `handleForChange`, 1),
      d([o([`distance`, `placement`, `skidding`])], U.prototype, `handleOptionsChange`, 1),
      (U = d([A(`wa-popover`)], U)));
  }),
  G = e(() => {
    (W(), V(), k(), h(), u(), w(), n());
  }),
  K = e(() => {
    G();
  });
export { K as t };
//# sourceMappingURL=web-awesome-popover-7IMHqElx.js.map
