import { ut as t } from "./control-ui-foundation-0uuDj0X3.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
var n,
  r,
  i,
  a,
  o,
  s,
  c,
  l,
  u,
  d = e(() => {
    ((n = globalThis),
      (r =
        n.ShadowRoot &&
        (n.ShadyCSS === void 0 || n.ShadyCSS.nativeShadow) &&
        `adoptedStyleSheets` in Document.prototype &&
        `replace` in CSSStyleSheet.prototype),
      (i = Symbol()),
      (a = new WeakMap()),
      (o = class {
        constructor(e, t, n) {
          if (((this._$cssResult$ = !0), n !== i))
            throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
          ((this.cssText = e), (this.t = t));
        }
        get styleSheet() {
          let e = this.o,
            t = this.t;
          if (r && e === void 0) {
            let n = t !== void 0 && t.length === 1;
            (n && (e = a.get(t)),
              e === void 0 &&
                ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && a.set(t, e)));
          }
          return e;
        }
        toString() {
          return this.cssText;
        }
      }),
      (s = (e) => new o(typeof e == `string` ? e : e + ``, void 0, i)),
      (c = (e, ...t) => {
        let n =
          e.length === 1
            ? e[0]
            : t.reduce(
                (t, n, r) =>
                  t +
                  ((e) => {
                    if (!0 === e._$cssResult$) return e.cssText;
                    if (typeof e == `number`) return e;
                    throw Error(
                      `Value passed to 'css' function must be a 'css' function result: ` +
                        e +
                        `. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`,
                    );
                  })(n) +
                  e[r + 1],
                e[0],
              );
        return new o(n, e, i);
      }),
      (l = (e, t) => {
        if (r) e.adoptedStyleSheets = t.map((e) => (e instanceof CSSStyleSheet ? e : e.styleSheet));
        else
          for (let r of t) {
            let t = document.createElement(`style`),
              i = n.litNonce;
            (i !== void 0 && t.setAttribute(`nonce`, i),
              (t.textContent = r.cssText),
              e.appendChild(t));
          }
      }),
      (u = r
        ? (e) => e
        : (e) =>
            e instanceof CSSStyleSheet
              ? ((e) => {
                  let t = ``;
                  for (let n of e.cssRules) t += n.cssText;
                  return s(t);
                })(e)
              : e));
  }),
  f,
  p,
  m,
  ee,
  te,
  ne,
  h,
  re,
  ie,
  ae,
  g,
  _,
  v,
  oe,
  y,
  se = e(() => {
    (d(),
      ({
        is: f,
        defineProperty: p,
        getOwnPropertyDescriptor: m,
        getOwnPropertyNames: ee,
        getOwnPropertySymbols: te,
        getPrototypeOf: ne,
      } = Object),
      (h = globalThis),
      (re = h.trustedTypes),
      (ie = re ? re.emptyScript : ``),
      (ae = h.reactiveElementPolyfillSupport),
      (g = (e, t) => e),
      (_ = {
        toAttribute(e, t) {
          switch (t) {
            case Boolean:
              e = e ? ie : null;
              break;
            case Object:
            case Array:
              e = e == null ? e : JSON.stringify(e);
          }
          return e;
        },
        fromAttribute(e, t) {
          let n = e;
          switch (t) {
            case Boolean:
              n = e !== null;
              break;
            case Number:
              n = e === null ? null : Number(e);
              break;
            case Object:
            case Array:
              try {
                n = JSON.parse(e);
              } catch {
                n = null;
              }
          }
          return n;
        },
      }),
      (v = (e, t) => !f(e, t)),
      (oe = {
        attribute: !0,
        type: String,
        converter: _,
        reflect: !1,
        useDefault: !1,
        hasChanged: v,
      }),
      (Symbol.metadata ??= Symbol(`metadata`)),
      (h.litPropertyMetadata ??= new WeakMap()),
      (y = class extends HTMLElement {
        static addInitializer(e) {
          (this._$Ei(), (this.l ??= []).push(e));
        }
        static get observedAttributes() {
          return (this.finalize(), this._$Eh && [...this._$Eh.keys()]);
        }
        static createProperty(e, t = oe) {
          if (
            (t.state && (t.attribute = !1),
            this._$Ei(),
            this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0),
            this.elementProperties.set(e, t),
            !t.noAccessor)
          ) {
            let n = Symbol(),
              r = this.getPropertyDescriptor(e, n, t);
            r !== void 0 && p(this.prototype, e, r);
          }
        }
        static getPropertyDescriptor(e, t, n) {
          let { get: r, set: i } = m(this.prototype, e) ?? {
            get() {
              return this[t];
            },
            set(e) {
              this[t] = e;
            },
          };
          return {
            get: r,
            set(t) {
              let a = r?.call(this);
              (i?.call(this, t), this.requestUpdate(e, a, n));
            },
            configurable: !0,
            enumerable: !0,
          };
        }
        static getPropertyOptions(e) {
          return this.elementProperties.get(e) ?? oe;
        }
        static _$Ei() {
          if (this.hasOwnProperty(g(`elementProperties`))) return;
          let e = ne(this);
          (e.finalize(),
            e.l !== void 0 && (this.l = [...e.l]),
            (this.elementProperties = new Map(e.elementProperties)));
        }
        static finalize() {
          if (this.hasOwnProperty(g(`finalized`))) return;
          if (((this.finalized = !0), this._$Ei(), this.hasOwnProperty(g(`properties`)))) {
            let e = this.properties,
              t = [...ee(e), ...te(e)];
            for (let n of t) this.createProperty(n, e[n]);
          }
          let e = this[Symbol.metadata];
          if (e !== null) {
            let t = litPropertyMetadata.get(e);
            if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
          }
          this._$Eh = new Map();
          for (let [e, t] of this.elementProperties) {
            let n = this._$Eu(e, t);
            n !== void 0 && this._$Eh.set(n, e);
          }
          this.elementStyles = this.finalizeStyles(this.styles);
        }
        static finalizeStyles(e) {
          let t = [];
          if (Array.isArray(e)) {
            let n = new Set(e.flat(1 / 0).reverse());
            for (let e of n) t.unshift(u(e));
          } else e !== void 0 && t.push(u(e));
          return t;
        }
        static _$Eu(e, t) {
          let n = t.attribute;
          return !1 === n
            ? void 0
            : typeof n == `string`
              ? n
              : typeof e == `string`
                ? e.toLowerCase()
                : void 0;
        }
        constructor() {
          (super(),
            (this._$Ep = void 0),
            (this.isUpdatePending = !1),
            (this.hasUpdated = !1),
            (this._$Em = null),
            this._$Ev());
        }
        _$Ev() {
          ((this._$ES = new Promise((e) => (this.enableUpdating = e))),
            (this._$AL = new Map()),
            this._$E_(),
            this.requestUpdate(),
            this.constructor.l?.forEach((e) => e(this)));
        }
        addController(e) {
          ((this._$EO ??= new Set()).add(e),
            this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.());
        }
        removeController(e) {
          this._$EO?.delete(e);
        }
        _$E_() {
          let e = new Map(),
            t = this.constructor.elementProperties;
          for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
          e.size > 0 && (this._$Ep = e);
        }
        createRenderRoot() {
          let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
          return (l(e, this.constructor.elementStyles), e);
        }
        connectedCallback() {
          ((this.renderRoot ??= this.createRenderRoot()),
            this.enableUpdating(!0),
            this._$EO?.forEach((e) => e.hostConnected?.()));
        }
        enableUpdating(e) {}
        disconnectedCallback() {
          this._$EO?.forEach((e) => e.hostDisconnected?.());
        }
        attributeChangedCallback(e, t, n) {
          this._$AK(e, n);
        }
        _$ET(e, t) {
          let n = this.constructor.elementProperties.get(e),
            r = this.constructor._$Eu(e, n);
          if (r !== void 0 && !0 === n.reflect) {
            let i = (n.converter?.toAttribute === void 0 ? _ : n.converter).toAttribute(t, n.type);
            ((this._$Em = e),
              i == null ? this.removeAttribute(r) : this.setAttribute(r, i),
              (this._$Em = null));
          }
        }
        _$AK(e, t) {
          let n = this.constructor,
            r = n._$Eh.get(e);
          if (r !== void 0 && this._$Em !== r) {
            let e = n.getPropertyOptions(r),
              i =
                typeof e.converter == `function`
                  ? { fromAttribute: e.converter }
                  : e.converter?.fromAttribute === void 0
                    ? _
                    : e.converter;
            this._$Em = r;
            let a = i.fromAttribute(t, e.type);
            ((this[r] = a ?? this._$Ej?.get(r) ?? a), (this._$Em = null));
          }
        }
        requestUpdate(e, t, n, r = !1, i) {
          if (e !== void 0) {
            let a = this.constructor;
            if (
              (!1 === r && (i = this[e]),
              (n ??= a.getPropertyOptions(e)),
              !(
                (n.hasChanged ?? v)(i, t) ||
                (n.useDefault &&
                  n.reflect &&
                  i === this._$Ej?.get(e) &&
                  !this.hasAttribute(a._$Eu(e, n)))
              ))
            )
              return;
            this.C(e, t, n);
          }
          !1 === this.isUpdatePending && (this._$ES = this._$EP());
        }
        C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
          (n &&
            !(this._$Ej ??= new Map()).has(e) &&
            (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0)) ||
            (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)),
            !0 === r && this._$Em !== e && (this._$Eq ??= new Set()).add(e));
        }
        async _$EP() {
          this.isUpdatePending = !0;
          try {
            await this._$ES;
          } catch (e) {
            Promise.reject(e);
          }
          let e = this.scheduleUpdate();
          return (e != null && (await e), !this.isUpdatePending);
        }
        scheduleUpdate() {
          return this.performUpdate();
        }
        performUpdate() {
          if (!this.isUpdatePending) return;
          if (!this.hasUpdated) {
            if (((this.renderRoot ??= this.createRenderRoot()), this._$Ep)) {
              for (let [e, t] of this._$Ep) this[e] = t;
              this._$Ep = void 0;
            }
            let e = this.constructor.elementProperties;
            if (e.size > 0)
              for (let [t, n] of e) {
                let { wrapped: e } = n,
                  r = this[t];
                !0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
              }
          }
          let e = !1,
            t = this._$AL;
          try {
            ((e = this.shouldUpdate(t)),
              e
                ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t))
                : this._$EM());
          } catch (t) {
            throw ((e = !1), this._$EM(), t);
          }
          e && this._$AE(t);
        }
        willUpdate(e) {}
        _$AE(e) {
          (this._$EO?.forEach((e) => e.hostUpdated?.()),
            this.hasUpdated || ((this.hasUpdated = !0), this.firstUpdated(e)),
            this.updated(e));
        }
        _$EM() {
          ((this._$AL = new Map()), (this.isUpdatePending = !1));
        }
        get updateComplete() {
          return this.getUpdateComplete();
        }
        getUpdateComplete() {
          return this._$ES;
        }
        shouldUpdate(e) {
          return !0;
        }
        update(e) {
          ((this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM());
        }
        updated(e) {}
        firstUpdated(e) {}
      }),
      (y.elementStyles = []),
      (y.shadowRootOptions = { mode: `open` }),
      (y[g(`elementProperties`)] = new Map()),
      (y[g(`finalized`)] = new Map()),
      ae?.({ ReactiveElement: y }),
      (h.reactiveElementVersions ??= []).push(`2.1.2`));
  });
function ce(e, t) {
  if (!k(e) || !e.hasOwnProperty(`raw`)) throw Error(`invalid template strings array`);
  return ue === void 0 ? t : ue.createHTML(t);
}
function b(e, t, n = e, r) {
  if (t === P) return t;
  let i = r === void 0 ? n._$Cl : n._$Co?.[r],
    a = O(t) ? void 0 : t._$litDirective$;
  return (
    i?.constructor !== a &&
      (i?._$AO?.(!1),
      a === void 0 ? (i = void 0) : ((i = new a(e)), i._$AT(e, n, r)),
      r === void 0 ? (n._$Cl = i) : ((n._$Co ??= [])[r] = i)),
    i !== void 0 && (t = b(e, i._$AS(e, t.values), i, r)),
    t
  );
}
var x,
  le,
  S,
  ue,
  C,
  w,
  T,
  de,
  E,
  D,
  O,
  k,
  fe,
  A,
  j,
  pe,
  me,
  M,
  he,
  ge,
  _e,
  N,
  ve,
  ye,
  be,
  P,
  F,
  xe,
  I,
  Se,
  L,
  Ce,
  R,
  z,
  we,
  Te,
  Ee,
  De,
  Oe,
  ke,
  Ae,
  B = e(() => {
    ((x = globalThis),
      (le = (e) => e),
      (S = x.trustedTypes),
      (ue = S ? S.createPolicy(`lit-html`, { createHTML: (e) => e }) : void 0),
      (C = `$lit$`),
      (w = `lit$${Math.random().toFixed(9).slice(2)}$`),
      (T = `?` + w),
      (de = `<${T}>`),
      (E = document),
      (D = () => E.createComment(``)),
      (O = (e) => e === null || (typeof e != `object` && typeof e != `function`)),
      (k = Array.isArray),
      (fe = (e) => k(e) || typeof e?.[Symbol.iterator] == `function`),
      (A = `[ 	
\f\r]`),
      (j = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g),
      (pe = /-->/g),
      (me = />/g),
      (M = RegExp(`>|${A}(?:([^\\s"'>=/]+)(${A}*=${A}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, `g`)),
      (he = /'/g),
      (ge = /"/g),
      (_e = /^(?:script|style|textarea|title)$/i),
      (N =
        (e) =>
        (t, ...n) => ({ _$litType$: e, strings: t, values: n })),
      (ve = N(1)),
      (ye = N(2)),
      (be = N(3)),
      (P = Symbol.for(`lit-noChange`)),
      (F = Symbol.for(`lit-nothing`)),
      (xe = new WeakMap()),
      (I = E.createTreeWalker(E, 129)),
      (Se = (e, t) => {
        let n = e.length - 1,
          r = [],
          i,
          a = t === 2 ? `<svg>` : t === 3 ? `<math>` : ``,
          o = j;
        for (let t = 0; t < n; t++) {
          let n = e[t],
            s,
            c,
            l = -1,
            u = 0;
          for (; u < n.length && ((o.lastIndex = u), (c = o.exec(n)), c !== null);)
            ((u = o.lastIndex),
              o === j
                ? c[1] === `!--`
                  ? (o = pe)
                  : c[1] === void 0
                    ? c[2] === void 0
                      ? c[3] !== void 0 && (o = M)
                      : (_e.test(c[2]) && (i = RegExp(`</` + c[2], `g`)), (o = M))
                    : (o = me)
                : o === M
                  ? c[0] === `>`
                    ? ((o = i ?? j), (l = -1))
                    : c[1] === void 0
                      ? (l = -2)
                      : ((l = o.lastIndex - c[2].length),
                        (s = c[1]),
                        (o = c[3] === void 0 ? M : c[3] === `"` ? ge : he))
                  : o === ge || o === he
                    ? (o = M)
                    : o === pe || o === me
                      ? (o = j)
                      : ((o = M), (i = void 0)));
          let d = o === M && e[t + 1].startsWith(`/>`) ? ` ` : ``;
          a +=
            o === j
              ? n + de
              : l >= 0
                ? (r.push(s), n.slice(0, l) + C + n.slice(l) + w + d)
                : n + w + (l === -2 ? t : d);
        }
        return [ce(e, a + (e[n] || `<?>`) + (t === 2 ? `</svg>` : t === 3 ? `</math>` : ``)), r];
      }),
      (L = class e {
        constructor({ strings: t, _$litType$: n }, r) {
          let i;
          this.parts = [];
          let a = 0,
            o = 0,
            s = t.length - 1,
            c = this.parts,
            [l, u] = Se(t, n);
          if (
            ((this.el = e.createElement(l, r)),
            (I.currentNode = this.el.content),
            n === 2 || n === 3)
          ) {
            let e = this.el.content.firstChild;
            e.replaceWith(...e.childNodes);
          }
          for (; (i = I.nextNode()) !== null && c.length < s;) {
            if (i.nodeType === 1) {
              if (i.hasAttributes())
                for (let e of i.getAttributeNames())
                  if (e.endsWith(C)) {
                    let t = u[o++],
                      n = i.getAttribute(e).split(w),
                      r = /([.?@])?(.*)/.exec(t);
                    (c.push({
                      type: 1,
                      index: a,
                      name: r[2],
                      strings: n,
                      ctor: r[1] === `.` ? we : r[1] === `?` ? Te : r[1] === `@` ? Ee : z,
                    }),
                      i.removeAttribute(e));
                  } else e.startsWith(w) && (c.push({ type: 6, index: a }), i.removeAttribute(e));
              if (_e.test(i.tagName)) {
                let e = i.textContent.split(w),
                  t = e.length - 1;
                if (t > 0) {
                  i.textContent = S ? S.emptyScript : ``;
                  for (let n = 0; n < t; n++)
                    (i.append(e[n], D()), I.nextNode(), c.push({ type: 2, index: ++a }));
                  i.append(e[t], D());
                }
              }
            } else if (i.nodeType === 8)
              if (i.data === T) c.push({ type: 2, index: a });
              else {
                let e = -1;
                for (; (e = i.data.indexOf(w, e + 1)) !== -1;)
                  (c.push({ type: 7, index: a }), (e += w.length - 1));
              }
            a++;
          }
        }
        static createElement(e, t) {
          let n = E.createElement(`template`);
          return ((n.innerHTML = e), n);
        }
      }),
      (Ce = class {
        constructor(e, t) {
          ((this._$AV = []), (this._$AN = void 0), (this._$AD = e), (this._$AM = t));
        }
        get parentNode() {
          return this._$AM.parentNode;
        }
        get _$AU() {
          return this._$AM._$AU;
        }
        u(e) {
          let {
              el: { content: t },
              parts: n,
            } = this._$AD,
            r = (e?.creationScope ?? E).importNode(t, !0);
          I.currentNode = r;
          let i = I.nextNode(),
            a = 0,
            o = 0,
            s = n[0];
          for (; s !== void 0;) {
            if (a === s.index) {
              let t;
              (s.type === 2
                ? (t = new R(i, i.nextSibling, this, e))
                : s.type === 1
                  ? (t = new s.ctor(i, s.name, s.strings, this, e))
                  : s.type === 6 && (t = new De(i, this, e)),
                this._$AV.push(t),
                (s = n[++o]));
            }
            a !== s?.index && ((i = I.nextNode()), a++);
          }
          return ((I.currentNode = E), r);
        }
        p(e) {
          let t = 0;
          for (let n of this._$AV)
            (n !== void 0 &&
              (n.strings === void 0
                ? n._$AI(e[t])
                : (n._$AI(e, n, t), (t += n.strings.length - 2))),
              t++);
        }
      }),
      (R = class e {
        get _$AU() {
          return this._$AM?._$AU ?? this._$Cv;
        }
        constructor(e, t, n, r) {
          ((this.type = 2),
            (this._$AH = F),
            (this._$AN = void 0),
            (this._$AA = e),
            (this._$AB = t),
            (this._$AM = n),
            (this.options = r),
            (this._$Cv = r?.isConnected ?? !0));
        }
        get parentNode() {
          let e = this._$AA.parentNode,
            t = this._$AM;
          return (t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e);
        }
        get startNode() {
          return this._$AA;
        }
        get endNode() {
          return this._$AB;
        }
        _$AI(e, t = this) {
          ((e = b(this, e, t)),
            O(e)
              ? e === F || e == null || e === ``
                ? (this._$AH !== F && this._$AR(), (this._$AH = F))
                : e !== this._$AH && e !== P && this._(e)
              : e._$litType$ === void 0
                ? e.nodeType === void 0
                  ? fe(e)
                    ? this.k(e)
                    : this._(e)
                  : this.T(e)
                : this.$(e));
        }
        O(e) {
          return this._$AA.parentNode.insertBefore(e, this._$AB);
        }
        T(e) {
          this._$AH !== e && (this._$AR(), (this._$AH = this.O(e)));
        }
        _(e) {
          (this._$AH !== F && O(this._$AH)
            ? (this._$AA.nextSibling.data = e)
            : this.T(E.createTextNode(e)),
            (this._$AH = e));
        }
        $(e) {
          let { values: t, _$litType$: n } = e,
            r =
              typeof n == `number`
                ? this._$AC(e)
                : (n.el === void 0 && (n.el = L.createElement(ce(n.h, n.h[0]), this.options)), n);
          if (this._$AH?._$AD === r) this._$AH.p(t);
          else {
            let e = new Ce(r, this),
              n = e.u(this.options);
            (e.p(t), this.T(n), (this._$AH = e));
          }
        }
        _$AC(e) {
          let t = xe.get(e.strings);
          return (t === void 0 && xe.set(e.strings, (t = new L(e))), t);
        }
        k(t) {
          k(this._$AH) || ((this._$AH = []), this._$AR());
          let n = this._$AH,
            r,
            i = 0;
          for (let a of t)
            (i === n.length
              ? n.push((r = new e(this.O(D()), this.O(D()), this, this.options)))
              : (r = n[i]),
              r._$AI(a),
              i++);
          i < n.length && (this._$AR(r && r._$AB.nextSibling, i), (n.length = i));
        }
        _$AR(e = this._$AA.nextSibling, t) {
          for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
            let t = le(e).nextSibling;
            (le(e).remove(), (e = t));
          }
        }
        setConnected(e) {
          this._$AM === void 0 && ((this._$Cv = e), this._$AP?.(e));
        }
      }),
      (z = class {
        get tagName() {
          return this.element.tagName;
        }
        get _$AU() {
          return this._$AM._$AU;
        }
        constructor(e, t, n, r, i) {
          ((this.type = 1),
            (this._$AH = F),
            (this._$AN = void 0),
            (this.element = e),
            (this.name = t),
            (this._$AM = r),
            (this.options = i),
            n.length > 2 || n[0] !== `` || n[1] !== ``
              ? ((this._$AH = Array(n.length - 1).fill(new String())), (this.strings = n))
              : (this._$AH = F));
        }
        _$AI(e, t = this, n, r) {
          let i = this.strings,
            a = !1;
          if (i === void 0)
            ((e = b(this, e, t, 0)),
              (a = !O(e) || (e !== this._$AH && e !== P)),
              a && (this._$AH = e));
          else {
            let r = e,
              o,
              s;
            for (e = i[0], o = 0; o < i.length - 1; o++)
              ((s = b(this, r[n + o], t, o)),
                s === P && (s = this._$AH[o]),
                (a ||= !O(s) || s !== this._$AH[o]),
                s === F ? (e = F) : e !== F && (e += (s ?? ``) + i[o + 1]),
                (this._$AH[o] = s));
          }
          a && !r && this.j(e);
        }
        j(e) {
          e === F
            ? this.element.removeAttribute(this.name)
            : this.element.setAttribute(this.name, e ?? ``);
        }
      }),
      (we = class extends z {
        constructor() {
          (super(...arguments), (this.type = 3));
        }
        j(e) {
          this.element[this.name] = e === F ? void 0 : e;
        }
      }),
      (Te = class extends z {
        constructor() {
          (super(...arguments), (this.type = 4));
        }
        j(e) {
          this.element.toggleAttribute(this.name, !!e && e !== F);
        }
      }),
      (Ee = class extends z {
        constructor(e, t, n, r, i) {
          (super(e, t, n, r, i), (this.type = 5));
        }
        _$AI(e, t = this) {
          if ((e = b(this, e, t, 0) ?? F) === P) return;
          let n = this._$AH,
            r =
              (e === F && n !== F) ||
              e.capture !== n.capture ||
              e.once !== n.once ||
              e.passive !== n.passive,
            i = e !== F && (n === F || r);
          (r && this.element.removeEventListener(this.name, this, n),
            i && this.element.addEventListener(this.name, this, e),
            (this._$AH = e));
        }
        handleEvent(e) {
          typeof this._$AH == `function`
            ? this._$AH.call(this.options?.host ?? this.element, e)
            : this._$AH.handleEvent(e);
        }
      }),
      (De = class {
        constructor(e, t, n) {
          ((this.element = e),
            (this.type = 6),
            (this._$AN = void 0),
            (this._$AM = t),
            (this.options = n));
        }
        get _$AU() {
          return this._$AM._$AU;
        }
        _$AI(e) {
          b(this, e);
        }
      }),
      (Oe = {
        M: C,
        P: w,
        A: T,
        C: 1,
        L: Se,
        R: Ce,
        D: fe,
        V: b,
        I: R,
        H: z,
        N: Te,
        U: Ee,
        B: we,
        F: De,
      }),
      (ke = x.litHtmlPolyfillSupport),
      ke?.(L, R),
      (x.litHtmlVersions ??= []).push(`3.3.3`),
      (Ae = (e, t, n) => {
        let r = n?.renderBefore ?? t,
          i = r._$litPart$;
        if (i === void 0) {
          let e = n?.renderBefore ?? null;
          r._$litPart$ = i = new R(t.insertBefore(D(), e), e, void 0, n ?? {});
        }
        return (i._$AI(e), i);
      }));
  }),
  je = e(() => {}),
  Me = e(() => {
    (se(), B(), t(), je());
  }),
  Ne,
  Pe = e(() => {
    Ne = (e) => (t, n) => {
      n === void 0
        ? customElements.define(e, t)
        : n.addInitializer(() => {
            customElements.define(e, t);
          });
    };
  });
function Fe(e) {
  return (t, n) =>
    typeof n == `object`
      ? Le(e, t, n)
      : ((e, t, n) => {
          let r = t.hasOwnProperty(n);
          return (
            t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0
          );
        })(e, t, n);
}
var Ie,
  Le,
  Re = e(() => {
    (se(),
      (Ie = { attribute: !0, type: String, converter: _, reflect: !1, hasChanged: v }),
      (Le = (e = Ie, t, n) => {
        let { kind: r, metadata: i } = n,
          a = globalThis.litPropertyMetadata.get(i);
        if (
          (a === void 0 && globalThis.litPropertyMetadata.set(i, (a = new Map())),
          r === `setter` && ((e = Object.create(e)).wrapped = !0),
          a.set(n.name, e),
          r === `accessor`)
        ) {
          let { name: r } = n;
          return {
            set(n) {
              let i = t.get.call(this);
              (t.set.call(this, n), this.requestUpdate(r, i, e, !0, n));
            },
            init(t) {
              return (t !== void 0 && this.C(r, void 0, e, t), t);
            },
          };
        }
        if (r === `setter`) {
          let { name: r } = n;
          return function (n) {
            let i = this[r];
            (t.call(this, n), this.requestUpdate(r, i, e, !0, n));
          };
        }
        throw Error(`Unsupported decorator location: ` + r);
      }));
  });
function ze(e) {
  return Fe({ ...e, state: !0, attribute: !1 });
}
var Be = e(() => {
    Re();
  }),
  Ve = e(() => {}),
  He,
  Ue = e(() => {
    He = (e, t, n) => (
      (n.configurable = !0),
      (n.enumerable = !0),
      Reflect.decorate && typeof t != `object` && Object.defineProperty(e, t, n),
      n
    );
  });
function We(e, t) {
  return (n, r, i) => {
    let a = (t) => t.renderRoot?.querySelector(e) ?? null;
    if (t) {
      let { get: e, set: t } =
        typeof r == `object`
          ? n
          : (i ??
            (() => {
              let e = Symbol();
              return {
                get() {
                  return this[e];
                },
                set(t) {
                  this[e] = t;
                },
              };
            })());
      return He(n, r, {
        get() {
          let n = e.call(this);
          return (
            n === void 0 && ((n = a(this)), (n !== null || this.hasUpdated) && t.call(this, n)), n
          );
        },
      });
    }
    return He(n, r, {
      get() {
        return a(this);
      },
    });
  };
}
var Ge = e(() => {
    Ue();
  }),
  Ke = e(() => {}),
  qe = e(() => {}),
  Je = e(() => {}),
  Ye = e(() => {}),
  Xe = e(() => {
    (Pe(), Re(), Be(), Ve(), Ge(), Ke(), qe(), Je(), Ye());
  }),
  V,
  H,
  U,
  W = e(() => {
    ((V = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 }),
      (H =
        (e) =>
        (...t) => ({ _$litDirective$: e, values: t })),
      (U = class {
        constructor(e) {}
        get _$AU() {
          return this._$AM._$AU;
        }
        _$AT(e, t, n) {
          ((this._$Ct = e), (this._$AM = t), (this._$Ci = n));
        }
        _$AS(e, t) {
          return this.update(e, t);
        }
        update(e, t) {
          return this.render(...t);
        }
      }));
  }),
  Ze,
  Qe,
  $e,
  et,
  tt,
  nt,
  G,
  K,
  rt,
  q,
  it,
  J,
  Y = e(() => {
    (B(),
      ({ I: Ze } = Oe),
      (Qe = (e) => e),
      ($e = (e) => e === null || (typeof e != `object` && typeof e != `function`)),
      (et = (e, t) => (t === void 0 ? e?._$litType$ !== void 0 : e?._$litType$ === t)),
      (tt = (e) => e.strings === void 0),
      (nt = () => document.createComment(``)),
      (G = (e, t, n) => {
        let r = e._$AA.parentNode,
          i = t === void 0 ? e._$AB : t._$AA;
        if (n === void 0) {
          let t = r.insertBefore(nt(), i),
            a = r.insertBefore(nt(), i);
          n = new Ze(t, a, e, e.options);
        } else {
          let t = n._$AB.nextSibling,
            a = n._$AM,
            o = a !== e;
          if (o) {
            let t;
            (n._$AQ?.(e), (n._$AM = e), n._$AP !== void 0 && (t = e._$AU) !== a._$AU && n._$AP(t));
          }
          if (t !== i || o) {
            let e = n._$AA;
            for (; e !== t;) {
              let t = Qe(e).nextSibling;
              (Qe(r).insertBefore(e, i), (e = t));
            }
          }
        }
        return n;
      }),
      (K = (e, t, n = e) => (e._$AI(t, n), e)),
      (rt = {}),
      (q = (e, t = rt) => (e._$AH = t)),
      (it = (e) => e._$AH),
      (J = (e) => {
        (e._$AR(), e._$AA.remove());
      }));
  }),
  at,
  ot = e(() => {
    (B(),
      W(),
      Y(),
      (at = H(
        class extends U {
          constructor() {
            (super(...arguments), (this.key = F));
          }
          render(e, t) {
            return ((this.key = e), t);
          }
          update(e, [t, n]) {
            return (t !== this.key && (q(e), (this.key = t)), n);
          }
        },
      )));
  }),
  st = e(() => {
    ot();
  });
function ct(e) {
  this._$AN === void 0 ? (this._$AM = e) : (Z(this), (this._$AM = e), ut(this));
}
function lt(e, t = !1, n = 0) {
  let r = this._$AH,
    i = this._$AN;
  if (i !== void 0 && i.size !== 0)
    if (t)
      if (Array.isArray(r)) for (let e = n; e < r.length; e++) (X(r[e], !1), Z(r[e]));
      else r != null && (X(r, !1), Z(r));
    else X(this, e);
}
var X,
  Z,
  ut,
  dt,
  Q,
  $ = e(() => {
    (Y(),
      W(),
      (X = (e, t) => {
        let n = e._$AN;
        if (n === void 0) return !1;
        for (let e of n) (e._$AO?.(t, !1), X(e, t));
        return !0;
      }),
      (Z = (e) => {
        let t, n;
        do {
          if ((t = e._$AM) === void 0) break;
          ((n = t._$AN), n.delete(e), (e = t));
        } while (n?.size === 0);
      }),
      (ut = (e) => {
        for (let t; (t = e._$AM); e = t) {
          let n = t._$AN;
          if (n === void 0) t._$AN = n = new Set();
          else if (n.has(e)) break;
          (n.add(e), dt(t));
        }
      }),
      (dt = (e) => {
        e.type == V.CHILD && ((e._$AP ??= lt), (e._$AQ ??= ct));
      }),
      (Q = class extends U {
        constructor() {
          (super(...arguments), (this._$AN = void 0));
        }
        _$AT(e, t, n) {
          (super._$AT(e, t, n), ut(this), (this.isConnected = e._$AU));
        }
        _$AO(e, t = !0) {
          (e !== this.isConnected &&
            ((this.isConnected = e), e ? this.reconnected?.() : this.disconnected?.()),
            t && (X(this, e), Z(this)));
        }
        setValue(e) {
          if (tt(this._$Ct)) this._$Ct._$AI(e, this);
          else {
            let t = [...this._$Ct._$AH];
            ((t[this._$Ci] = e), this._$Ct._$AI(t, this, 0));
          }
        }
        disconnected() {}
        reconnected() {}
      }));
  }),
  ft,
  pt,
  mt,
  ht,
  gt = e(() => {
    (B(),
      $(),
      W(),
      (ft = () => new pt()),
      (pt = class {}),
      (mt = new WeakMap()),
      (ht = H(
        class extends Q {
          render(e) {
            return F;
          }
          update(e, [t]) {
            let n = t !== this.G;
            return (
              n && this.rt(void 0),
              (n || this.lt !== this.ct) &&
                ((this.G = t), (this.ht = e.options?.host), this.rt((this.ct = e.element))),
              F
            );
          }
          rt(e) {
            if (this.G !== void 0)
              if ((this.isConnected || (e = void 0), typeof this.G == `function`)) {
                let t = this.ht ?? globalThis,
                  n = mt.get(t);
                (n === void 0 && ((n = new WeakMap()), mt.set(t, n)),
                  n.get(this.G) !== void 0 && this.G.call(this.ht, void 0),
                  n.set(this.G, e),
                  e !== void 0 && this.G.call(this.ht, e));
              } else this.G.value = e;
          }
          get lt() {
            return typeof this.G == `function`
              ? mt.get(this.ht ?? globalThis)?.get(this.G)
              : this.G?.value;
          }
          disconnected() {
            this.lt === this.ct && this.rt(void 0);
          }
          reconnected() {
            this.rt(this.ct);
          }
        },
      )));
  }),
  _t = e(() => {
    gt();
  }),
  vt,
  yt = e(() => {
    (B(),
      W(),
      (vt = H(
        class extends U {
          constructor(e) {
            if ((super(e), e.type !== V.ATTRIBUTE || e.name !== `class` || e.strings?.length > 2))
              throw Error(
                "`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.",
              );
          }
          render(e) {
            return (
              ` ` +
              Object.keys(e)
                .filter((t) => e[t])
                .join(` `) +
              ` `
            );
          }
          update(e, [t]) {
            if (this.st === void 0) {
              ((this.st = new Set()),
                e.strings !== void 0 &&
                  (this.nt = new Set(
                    e.strings
                      .join(` `)
                      .split(/\s/)
                      .filter((e) => e !== ``),
                  )));
              for (let e in t) t[e] && !this.nt?.has(e) && this.st.add(e);
              return this.render(t);
            }
            let n = e.element.classList;
            for (let e of this.st) e in t || (n.remove(e), this.st.delete(e));
            for (let e in t) {
              let r = !!t[e];
              r === this.st.has(e) ||
                this.nt?.has(e) ||
                (r ? (n.add(e), this.st.add(e)) : (n.remove(e), this.st.delete(e)));
            }
            return P;
          }
        },
      )));
  }),
  bt = e(() => {
    yt();
  }),
  xt = e(() => {
    Y();
  }),
  St,
  Ct = e(() => {
    (B(), (St = (e) => e ?? F));
  }),
  wt = e(() => {
    Ct();
  }),
  Tt,
  Et,
  Dt,
  Ot,
  kt,
  At,
  jt = e(() => {
    (B(),
      (Tt = Symbol.for(``)),
      (Et = (e) => {
        if (e?.r === Tt) return e?._$litStatic$;
      }),
      (Dt = (e, ...t) => ({
        _$litStatic$: t.reduce(
          (t, n, r) =>
            t +
            ((e) => {
              if (e._$litStatic$ !== void 0) return e._$litStatic$;
              throw Error(
                `Value passed to 'literal' function must be a 'literal' result: ${e}. Use 'unsafeStatic' to pass non-literal values, but\n            take care to ensure page security.`,
              );
            })(n) +
            e[r + 1],
          e[0],
        ),
        r: Tt,
      })),
      (Ot = new Map()),
      (kt =
        (e) =>
        (t, ...n) => {
          let r = n.length,
            i,
            a,
            o = [],
            s = [],
            c,
            l = 0,
            u = !1;
          for (; l < r;) {
            for (c = t[l]; l < r && ((a = n[l]), (i = Et(a))) !== void 0;)
              ((c += i + t[++l]), (u = !0));
            (l !== r && s.push(a), o.push(c), l++);
          }
          if ((l === r && o.push(t[r]), u)) {
            let e = o.join(`$$lit$$`);
            ((t = Ot.get(e)) === void 0 && ((o.raw = o), Ot.set(e, (t = o))), (n = s));
          }
          return e(t, ...n);
        }),
      (At = kt(ve)),
      kt(ye),
      kt(be));
  }),
  Mt = e(() => {
    jt();
  }),
  Nt,
  Pt = e(() => {
    (B(),
      W(),
      Y(),
      (Nt = H(
        class extends U {
          constructor(e) {
            if (
              (super(e),
              e.type !== V.PROPERTY && e.type !== V.ATTRIBUTE && e.type !== V.BOOLEAN_ATTRIBUTE)
            )
              throw Error("The `live` directive is not allowed on child or event bindings");
            if (!tt(e)) throw Error("`live` bindings can only contain a single expression");
          }
          render(e) {
            return e;
          }
          update(e, [t]) {
            if (t === P || t === F) return t;
            let n = e.element,
              r = e.name;
            if (e.type === V.PROPERTY) {
              if (t === n[r]) return P;
            } else if (e.type === V.BOOLEAN_ATTRIBUTE) {
              if (!!t === n.hasAttribute(r)) return P;
            } else if (e.type === V.ATTRIBUTE && n.getAttribute(r) === t + ``) return P;
            return (q(e), t);
          }
        },
      )));
  }),
  Ft = e(() => {
    Pt();
  }),
  It,
  Lt,
  Rt = e(() => {
    (B(),
      W(),
      (It = class extends U {
        constructor(e) {
          if ((super(e), (this.it = F), e.type !== V.CHILD))
            throw Error(this.constructor.directiveName + `() can only be used in child bindings`);
        }
        render(e) {
          if (e === F || e == null) return ((this._t = void 0), (this.it = e));
          if (e === P) return e;
          if (typeof e != `string`)
            throw Error(this.constructor.directiveName + `() called with a non-string value`);
          if (e === this.it) return this._t;
          this.it = e;
          let t = [e];
          return (
            (t.raw = t),
            (this._t = { _$litType$: this.constructor.resultType, strings: t, values: [] })
          );
        }
      }),
      (It.directiveName = `unsafeHTML`),
      (It.resultType = 1),
      (Lt = H(It)));
  }),
  zt = e(() => {
    Rt();
  }),
  Bt,
  Vt,
  Ht = e(() => {
    (B(),
      W(),
      Y(),
      (Bt = (e, t, n) => {
        let r = new Map();
        for (let i = t; i <= n; i++) r.set(e[i], i);
        return r;
      }),
      (Vt = H(
        class extends U {
          constructor(e) {
            if ((super(e), e.type !== V.CHILD))
              throw Error(`repeat() can only be used in text expressions`);
          }
          dt(e, t, n) {
            let r;
            n === void 0 ? (n = t) : t !== void 0 && (r = t);
            let i = [],
              a = [],
              o = 0;
            for (let t of e) ((i[o] = r ? r(t, o) : o), (a[o] = n(t, o)), o++);
            return { values: a, keys: i };
          }
          render(e, t, n) {
            return this.dt(e, t, n).values;
          }
          update(e, [t, n, r]) {
            let i = it(e),
              { values: a, keys: o } = this.dt(t, n, r);
            if (!Array.isArray(i)) return ((this.ut = o), a);
            let s = (this.ut ??= []),
              c = [],
              l,
              u,
              d = 0,
              f = i.length - 1,
              p = 0,
              m = a.length - 1;
            for (; d <= f && p <= m;)
              if (i[d] === null) d++;
              else if (i[f] === null) f--;
              else if (s[d] === o[p]) ((c[p] = K(i[d], a[p])), d++, p++);
              else if (s[f] === o[m]) ((c[m] = K(i[f], a[m])), f--, m--);
              else if (s[d] === o[m]) ((c[m] = K(i[d], a[m])), G(e, c[m + 1], i[d]), d++, m--);
              else if (s[f] === o[p]) ((c[p] = K(i[f], a[p])), G(e, i[d], i[f]), f--, p++);
              else if ((l === void 0 && ((l = Bt(o, p, m)), (u = Bt(s, d, f))), l.has(s[d])))
                if (l.has(s[f])) {
                  let t = u.get(o[p]),
                    n = t === void 0 ? null : i[t];
                  if (n === null) {
                    let t = G(e, i[d]);
                    (K(t, a[p]), (c[p] = t));
                  } else ((c[p] = K(n, a[p])), G(e, i[d], n), (i[t] = null));
                  p++;
                } else (J(i[f]), f--);
              else (J(i[d]), d++);
            for (; p <= m;) {
              let t = G(e, c[m + 1]);
              (K(t, a[p]), (c[p++] = t));
            }
            for (; d <= f;) {
              let e = i[d++];
              e !== null && J(e);
            }
            return ((this.ut = o), q(e, c), P);
          }
        },
      )));
  }),
  Ut = e(() => {
    Ht();
  }),
  Wt,
  Gt,
  Kt,
  qt = e(() => {
    (B(),
      W(),
      (Wt = `important`),
      (Gt = ` !important`),
      (Kt = H(
        class extends U {
          constructor(e) {
            if ((super(e), e.type !== V.ATTRIBUTE || e.name !== `style` || e.strings?.length > 2))
              throw Error(
                "The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.",
              );
          }
          render(e) {
            return Object.keys(e).reduce((t, n) => {
              let r = e[n];
              return r == null
                ? t
                : t +
                    `${(n = n.includes(`-`) ? n : n.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, `-$&`).toLowerCase())}:${r};`;
            }, ``);
          }
          update(e, [t]) {
            let { style: n } = e.element;
            if (this.ft === void 0) return ((this.ft = new Set(Object.keys(t))), this.render(t));
            for (let e of this.ft)
              t[e] ?? (this.ft.delete(e), e.includes(`-`) ? n.removeProperty(e) : (n[e] = null));
            for (let e in t) {
              let r = t[e];
              if (r != null) {
                this.ft.add(e);
                let t = typeof r == `string` && r.endsWith(Gt);
                e.includes(`-`) || t
                  ? n.setProperty(e, t ? r.slice(0, -11) : r, t ? Wt : ``)
                  : (n[e] = r);
              }
            }
            return P;
          }
        },
      )));
  }),
  Jt = e(() => {
    qt();
  }),
  Yt,
  Xt,
  Zt = e(() => {
    (B(),
      W(),
      (Yt = {}),
      (Xt = H(
        class extends U {
          constructor() {
            (super(...arguments), (this.ot = Yt));
          }
          render(e, t) {
            return t();
          }
          update(e, [t, n]) {
            if (Array.isArray(t)) {
              if (
                Array.isArray(this.ot) &&
                this.ot.length === t.length &&
                t.every((e, t) => e === this.ot[t])
              )
                return P;
            } else if (this.ot === t) return P;
            return ((this.ot = Array.isArray(t) ? Array.from(t) : t), this.render(t, n));
          }
        },
      )));
  }),
  Qt = e(() => {
    Zt();
  }),
  $t,
  en,
  tn = e(() => {
    (($t = class {
      constructor(e) {
        this.G = e;
      }
      disconnect() {
        this.G = void 0;
      }
      reconnect(e) {
        this.G = e;
      }
      deref() {
        return this.G;
      }
    }),
      (en = class {
        constructor() {
          ((this.Y = void 0), (this.Z = void 0));
        }
        get() {
          return this.Y;
        }
        pause() {
          this.Y ??= new Promise((e) => (this.Z = e));
        }
        resume() {
          (this.Z?.(), (this.Y = this.Z = void 0));
        }
      }));
  }),
  nn,
  rn,
  an,
  on,
  sn = e(() => {
    (B(),
      Y(),
      $(),
      tn(),
      W(),
      (nn = (e) => !$e(e) && typeof e.then == `function`),
      (rn = 1073741823),
      (an = class extends Q {
        constructor() {
          (super(...arguments),
            (this._$Cwt = rn),
            (this._$Cbt = []),
            (this._$CK = new $t(this)),
            (this._$CX = new en()));
        }
        render(...e) {
          return e.find((e) => !nn(e)) ?? P;
        }
        update(e, t) {
          let n = this._$Cbt,
            r = n.length;
          this._$Cbt = t;
          let i = this._$CK,
            a = this._$CX;
          this.isConnected || this.disconnected();
          for (let e = 0; e < t.length && !(e > this._$Cwt); e++) {
            let o = t[e];
            if (!nn(o)) return ((this._$Cwt = e), o);
            (e < r && o === n[e]) ||
              ((this._$Cwt = rn),
              (r = 0),
              Promise.resolve(o).then(async (e) => {
                for (; a.get();) await a.get();
                let t = i.deref();
                if (t !== void 0) {
                  let n = t._$Cbt.indexOf(o);
                  n > -1 && n < t._$Cwt && ((t._$Cwt = n), t.setValue(e));
                }
              }));
          }
          return P;
        }
        disconnected() {
          (this._$CK.disconnect(), this._$CX.pause());
        }
        reconnected() {
          (this._$CK.reconnect(this), this._$CX.resume());
        }
      }),
      (on = H(an)));
  }),
  cn = e(() => {
    sn();
  }),
  ln = e(() => {
    $();
  }),
  un = e(() => {
    W();
  });
export {
  Ne as $,
  vt as A,
  ot as B,
  jt as C,
  St as D,
  Ct as E,
  ht as F,
  Xe as G,
  et as H,
  Q as I,
  Be as J,
  We as K,
  $ as L,
  _t as M,
  ft as N,
  xt as O,
  gt as P,
  Pe as Q,
  st as R,
  Dt as S,
  wt as T,
  H as U,
  Y as V,
  W,
  Re as X,
  ze as Y,
  Fe as Z,
  Lt as _,
  on as a,
  ve as at,
  Nt as b,
  Zt as c,
  se as ct,
  Kt as d,
  d as dt,
  Me as et,
  Ut as f,
  Rt as g,
  zt as h,
  sn as i,
  P as it,
  yt as j,
  bt as k,
  Jt as l,
  y as lt,
  Ht as m,
  ln as n,
  F as nt,
  Qt as o,
  B as ot,
  Vt as p,
  Ge as q,
  cn as r,
  Ae as rt,
  Xt as s,
  ye as st,
  un as t,
  je as tt,
  qt as u,
  c as ut,
  Ft as v,
  At as w,
  Mt as x,
  Pt as y,
  at as z,
};
//# sourceMappingURL=lit-runtime-DkvDG939.js.map
