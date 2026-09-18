import { et as t, ut as n } from "./lit-runtime-DkvDG939.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
var r,
  i = e(() => {
    (t(),
      (r = n`
  :host {
    display: flex;
    flex-direction: column;
  }

  /* Treat wrapped labels, inputs, and hints as direct children of the host element */
  [part~='form-control'] {
    display: contents;
  }

  /* Label */
  :is([part~='form-control-label'], [part~='label']):has(*:not(:empty)),
  :is([part~='form-control-label'], [part~='label']).has-label {
    display: inline-flex;
    color: var(--wa-form-control-label-color);
    font-weight: var(--wa-form-control-label-font-weight);
    line-height: var(--wa-form-control-label-line-height);
    margin-block-end: 0.5em;
  }

  :host([required]) :is([part~='form-control-label'], [part~='label'])::after {
    content: var(--wa-form-control-required-content);
    margin-inline-start: var(--wa-form-control-required-content-offset);
    color: var(--wa-form-control-required-content-color);
  }

  /* Help text */
  [part~='hint'] {
    display: block;
    color: var(--wa-form-control-hint-color);
    font-weight: var(--wa-form-control-hint-font-weight);
    line-height: var(--wa-form-control-hint-line-height);
    margin-block-start: 0.5em;
    font-size: var(--wa-font-size-smaller);

    &:not(.has-slotted, .has-hint) {
      display: none;
    }
  }
`));
  }),
  a,
  o = e(() => {
    a = (e = {}) => {
      let { validationElement: t, validationProperty: n } = e;
      (t ||
        (typeof document < `u` &&
          `createElement` in document &&
          (t = Object.assign(document.createElement(`input`), { required: !0 }))),
        (n ||= `value`));
      let r = {
        observedAttributes: [`required`],
        message: t?.validationMessage,
        checkValidity(e) {
          let t = { message: ``, isValid: !0, invalidKeys: [] };
          return (
            (e.required ?? e.hasAttribute(`required`)) &&
              (e[n] ||
                ((t.message = typeof r.message == `function` ? r.message(e) : r.message || ``),
                (t.isValid = !1),
                t.invalidKeys.push(`valueMissing`))),
            t
          );
        },
      };
      return r;
    };
  });
export { i, o as n, r, a as t };
//# sourceMappingURL=chunk.GWSUX3V5-C1Y3GfAe.js.map
