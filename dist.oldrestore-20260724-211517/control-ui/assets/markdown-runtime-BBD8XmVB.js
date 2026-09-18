import { a as e, n as t, r as n, t as r } from "./rolldown-runtime-DaJ6WEGw.js";
function i(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function a(e) {
  if (Array.isArray(e)) return e;
}
function o(e, t) {
  var n = e == null ? null : (typeof Symbol < `u` && e[Symbol.iterator]) || e[`@@iterator`];
  if (n != null) {
    var r,
      i,
      a,
      o,
      s = [],
      c = !0,
      l = !1;
    try {
      if (((a = (n = n.call(e)).next), t !== 0))
        for (; !(c = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); c = !0);
    } catch (e) {
      ((l = !0), (i = e));
    } finally {
      try {
        if (!c && n.return != null && ((o = n.return()), Object(o) !== o)) return;
      } finally {
        if (l) throw i;
      }
    }
    return s;
  }
}
function s() {
  throw TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function c(e, t) {
  return a(e) || o(e, t) || l(e, t) || s();
}
function l(e, t) {
  if (e) {
    if (typeof e == `string`) return i(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return (
      n === `Object` && e.constructor && (n = e.constructor.name),
      n === `Map` || n === `Set`
        ? Array.from(e)
        : n === `Arguments` || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
          ? i(e, t)
          : void 0
    );
  }
}
function u(e) {
  return function (t) {
    t instanceof RegExp && (t.lastIndex = 0);
    var n = [...arguments].slice(1);
    return O(e, t, n);
  };
}
function d(e) {
  return function () {
    return k(e, [...arguments]);
  };
}
function f(e, t) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : F;
  if ((b && b(e, null), !P(t))) return e;
  let r = t.length;
  for (; r--;) {
    let i = t[r];
    if (typeof i == `string`) {
      let e = n(i);
      e !== i && (x(t) || (t[r] = e), (i = e));
    }
    e[i] = !0;
  }
  return e;
}
function p(e) {
  for (let t = 0; t < e.length; t++) L(e, t) || (e[t] = null);
  return e;
}
function m(e) {
  let t = E(null);
  for (let r of y(e)) {
    var n = c(r, 2);
    let i = n[0],
      a = n[1];
    L(e, i) &&
      (P(a)
        ? (t[i] = p(a))
        : a && typeof a == `object` && a.constructor === Object
          ? (t[i] = m(a))
          : (t[i] = a));
  }
  return t;
}
function h(e) {
  switch (typeof e) {
    case `string`:
      return e;
    case `number`:
      return oe(e);
    case `boolean`:
      return I(e);
    case `bigint`:
      return se ? se(e) : `0`;
    case `symbol`:
      return ce ? ce(e) : `Symbol()`;
    case `undefined`:
      return le(e);
    case `function`:
    case `object`: {
      if (e === null) return le(e);
      let t = e,
        n = g(t, `toString`);
      if (typeof n == `function`) {
        let e = n(t);
        return typeof e == `string` ? e : le(e);
      }
      return le(e);
    }
    default:
      return le(e);
  }
}
function g(e, t) {
  for (; e !== null;) {
    let n = C(e, t);
    if (n) {
      if (n.get) return u(n.get);
      if (typeof n.value == `function`) return u(n.value);
    }
    e = S(e);
  }
  function n() {
    return null;
  }
  return n;
}
function _(e) {
  try {
    return (R(e, ``), !0);
  } catch {
    return !1;
  }
}
function v() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Le(),
    t = (e) => v(e);
  if (
    ((t.version = `3.4.11`),
    (t.removed = []),
    !e || !e.document || e.document.nodeType !== Ie.document || !e.Element)
  )
    return ((t.isSupported = !1), t);
  let n = e.document,
    r = n,
    i = r.currentScript;
  e.DocumentFragment;
  let a = e.HTMLTemplateElement,
    o = e.Node,
    s = e.Element,
    c = e.NodeFilter;
  (e.NamedNodeMap === void 0 && (e.NamedNodeMap || e.MozNamedAttrMap), e.HTMLFormElement);
  let l = e.DOMParser,
    u = e.trustedTypes,
    d = s.prototype,
    p = g(d, `cloneNode`),
    b = g(d, `remove`),
    x = g(d, `nextSibling`),
    S = g(d, `childNodes`),
    C = g(d, `parentNode`),
    D = g(d, `shadowRoot`),
    O = g(d, `attributes`),
    k = o && o.prototype ? g(o.prototype, `nodeType`) : null,
    oe = o && o.prototype ? g(o.prototype, `nodeName`) : null;
  if (typeof a == `function`) {
    let e = n.createElement(`template`);
    e.content && e.content.ownerDocument && (n = e.content.ownerDocument);
  }
  let I,
    se = ``,
    ce,
    le = !1,
    Ve = 0,
    He = function () {
      if (Ve > 0)
        throw ue(
          `A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.`,
        );
    },
    Ue = function (e) {
      (He(), Ve++);
      try {
        return I.createHTML(e);
      } finally {
        Ve--;
      }
    },
    We = function (e) {
      (He(), Ve++);
      try {
        return I.createScriptURL(e);
      } finally {
        Ve--;
      }
    },
    Ge = function () {
      return ((le ||= ((ce = Re(u, i)), !0)), ce);
    },
    Ke = n,
    qe = Ke.implementation,
    Je = Ke.createNodeIterator,
    Ye = Ke.createDocumentFragment,
    Xe = Ke.getElementsByTagName,
    Ze = r.importNode,
    z = ze();
  t.isSupported =
    typeof y == `function` && typeof C == `function` && qe && qe.createHTMLDocument !== void 0;
  let Qe = Se,
    $e = Ce,
    et = we,
    tt = Te,
    nt = Ee,
    rt = Oe,
    it = ke,
    at = je,
    ot = De,
    B = null,
    st = f({}, [...de, ...fe, ...pe, ...he, ..._e]),
    V = null,
    ct = f({}, [...ve, ...ye, ...be, ...xe]),
    H = Object.seal(
      E(null, {
        tagNameCheck: { writable: !0, configurable: !1, enumerable: !0, value: null },
        attributeNameCheck: { writable: !0, configurable: !1, enumerable: !0, value: null },
        allowCustomizedBuiltInElements: {
          writable: !0,
          configurable: !1,
          enumerable: !0,
          value: !1,
        },
      }),
    ),
    U = null,
    lt = null,
    W = Object.seal(
      E(null, {
        tagCheck: { writable: !0, configurable: !1, enumerable: !0, value: null },
        attributeCheck: { writable: !0, configurable: !1, enumerable: !0, value: null },
      }),
    ),
    ut = !0,
    dt = !0,
    ft = !1,
    pt = !0,
    mt = !1,
    ht = !0,
    gt = !1,
    _t = !1,
    vt = null,
    yt = null,
    bt = !1,
    xt = !1,
    St = !1,
    Ct = !1,
    wt = !0,
    Tt = !1,
    Et = `user-content-`,
    Dt = !0,
    Ot = !1,
    kt = {},
    At = null,
    jt = f(
      {},
      `annotation-xml.audio.colgroup.desc.foreignobject.head.iframe.math.mi.mn.mo.ms.mtext.noembed.noframes.noscript.plaintext.script.selectedcontent.style.svg.template.thead.title.video.xmp`.split(
        `.`,
      ),
    ),
    Mt = null,
    Nt = f({}, [`audio`, `video`, `img`, `source`, `image`, `track`]),
    Pt = null,
    Ft = f({}, [
      `alt`,
      `class`,
      `for`,
      `id`,
      `label`,
      `name`,
      `pattern`,
      `placeholder`,
      `role`,
      `summary`,
      `title`,
      `value`,
      `style`,
      `xmlns`,
    ]),
    It = `http://www.w3.org/1998/Math/MathML`,
    Lt = `http://www.w3.org/2000/svg`,
    G = `http://www.w3.org/1999/xhtml`,
    Rt = G,
    zt = !1,
    Bt = null,
    Vt = f({}, [It, Lt, G], te),
    Ht = w([`mi`, `mo`, `mn`, `ms`, `mtext`]),
    Ut = f({}, Ht),
    Wt = w([`annotation-xml`]),
    Gt = f({}, Wt),
    Kt = f({}, [`title`, `style`, `font`, `a`, `script`]),
    qt = null,
    Jt = [`application/xhtml+xml`, `text/html`],
    K = null,
    Yt = null,
    Xt = n.createElement(`form`),
    Zt = function (e) {
      return e instanceof RegExp || e instanceof Function;
    },
    Qt = function () {
      let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      if (Yt && Yt === e) return;
      ((!e || typeof e != `object`) && (e = {}),
        (e = m(e)),
        (qt = Jt.indexOf(e.PARSER_MEDIA_TYPE) === -1 ? `text/html` : e.PARSER_MEDIA_TYPE),
        (K = qt === `application/xhtml+xml` ? te : F),
        (B = Be(e, `ALLOWED_TAGS`, st, { transform: K })),
        (V = Be(e, `ALLOWED_ATTR`, ct, { transform: K })),
        (Bt = Be(e, `ALLOWED_NAMESPACES`, Vt, { transform: te })),
        (Pt = Be(e, `ADD_URI_SAFE_ATTR`, Ft, { transform: K, base: Ft })),
        (Mt = Be(e, `ADD_DATA_URI_TAGS`, Nt, { transform: K, base: Nt })),
        (At = Be(e, `FORBID_CONTENTS`, jt, { transform: K })),
        (U = Be(e, `FORBID_TAGS`, m({}), { transform: K })),
        (lt = Be(e, `FORBID_ATTR`, m({}), { transform: K })),
        (kt = L(e, `USE_PROFILES`)
          ? e.USE_PROFILES && typeof e.USE_PROFILES == `object`
            ? m(e.USE_PROFILES)
            : e.USE_PROFILES
          : !1),
        (ut = e.ALLOW_ARIA_ATTR !== !1),
        (dt = e.ALLOW_DATA_ATTR !== !1),
        (ft = e.ALLOW_UNKNOWN_PROTOCOLS || !1),
        (pt = e.ALLOW_SELF_CLOSE_IN_ATTR !== !1),
        (mt = e.SAFE_FOR_TEMPLATES || !1),
        (ht = e.SAFE_FOR_XML !== !1),
        (gt = e.WHOLE_DOCUMENT || !1),
        (xt = e.RETURN_DOM || !1),
        (St = e.RETURN_DOM_FRAGMENT || !1),
        (Ct = e.RETURN_TRUSTED_TYPE || !1),
        (bt = e.FORCE_BODY || !1),
        (wt = e.SANITIZE_DOM !== !1),
        (Tt = e.SANITIZE_NAMED_PROPS || !1),
        (Dt = e.KEEP_CONTENT !== !1),
        (Ot = e.IN_PLACE || !1),
        (ot = _(e.ALLOWED_URI_REGEXP) ? e.ALLOWED_URI_REGEXP : De),
        (Rt = typeof e.NAMESPACE == `string` ? e.NAMESPACE : G),
        (Ut =
          L(e, `MATHML_TEXT_INTEGRATION_POINTS`) &&
          e.MATHML_TEXT_INTEGRATION_POINTS &&
          typeof e.MATHML_TEXT_INTEGRATION_POINTS == `object`
            ? m(e.MATHML_TEXT_INTEGRATION_POINTS)
            : f({}, Ht)),
        (Gt =
          L(e, `HTML_INTEGRATION_POINTS`) &&
          e.HTML_INTEGRATION_POINTS &&
          typeof e.HTML_INTEGRATION_POINTS == `object`
            ? m(e.HTML_INTEGRATION_POINTS)
            : f({}, Wt)));
      let t =
        L(e, `CUSTOM_ELEMENT_HANDLING`) &&
        e.CUSTOM_ELEMENT_HANDLING &&
        typeof e.CUSTOM_ELEMENT_HANDLING == `object`
          ? m(e.CUSTOM_ELEMENT_HANDLING)
          : E(null);
      if (
        ((H = E(null)),
        L(t, `tagNameCheck`) && Zt(t.tagNameCheck) && (H.tagNameCheck = t.tagNameCheck),
        L(t, `attributeNameCheck`) &&
          Zt(t.attributeNameCheck) &&
          (H.attributeNameCheck = t.attributeNameCheck),
        L(t, `allowCustomizedBuiltInElements`) &&
          typeof t.allowCustomizedBuiltInElements == `boolean` &&
          (H.allowCustomizedBuiltInElements = t.allowCustomizedBuiltInElements),
        T(H),
        mt && (dt = !1),
        St && (xt = !0),
        kt &&
          ((B = f({}, _e)),
          (V = E(null)),
          kt.html === !0 && (f(B, de), f(V, ve)),
          kt.svg === !0 && (f(B, fe), f(V, ye), f(V, xe)),
          kt.svgFilters === !0 && (f(B, pe), f(V, ye), f(V, xe)),
          kt.mathMl === !0 && (f(B, he), f(V, be), f(V, xe))),
        (W.tagCheck = null),
        (W.attributeCheck = null),
        L(e, `ADD_TAGS`) &&
          (typeof e.ADD_TAGS == `function`
            ? (W.tagCheck = e.ADD_TAGS)
            : P(e.ADD_TAGS) && (B === st && (B = m(B)), f(B, e.ADD_TAGS, K))),
        L(e, `ADD_ATTR`) &&
          (typeof e.ADD_ATTR == `function`
            ? (W.attributeCheck = e.ADD_ATTR)
            : P(e.ADD_ATTR) && (V === ct && (V = m(V)), f(V, e.ADD_ATTR, K))),
        L(e, `ADD_URI_SAFE_ATTR`) && P(e.ADD_URI_SAFE_ATTR) && f(Pt, e.ADD_URI_SAFE_ATTR, K),
        L(e, `FORBID_CONTENTS`) &&
          P(e.FORBID_CONTENTS) &&
          (At === jt && (At = m(At)), f(At, e.FORBID_CONTENTS, K)),
        L(e, `ADD_FORBID_CONTENTS`) &&
          P(e.ADD_FORBID_CONTENTS) &&
          (At === jt && (At = m(At)), f(At, e.ADD_FORBID_CONTENTS, K)),
        Dt && (B[`#text`] = !0),
        gt && f(B, [`html`, `head`, `body`]),
        B.table && (f(B, [`tbody`]), delete U.tbody),
        e.TRUSTED_TYPES_POLICY)
      ) {
        if (typeof e.TRUSTED_TYPES_POLICY.createHTML != `function`)
          throw ue(`TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.`);
        if (typeof e.TRUSTED_TYPES_POLICY.createScriptURL != `function`)
          throw ue(
            `TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.`,
          );
        let t = I;
        I = e.TRUSTED_TYPES_POLICY;
        try {
          se = Ue(``);
        } catch (e) {
          throw ((I = t), e);
        }
      } else
        e.TRUSTED_TYPES_POLICY === null
          ? ((I = void 0), (se = ``))
          : (I === void 0 && (I = Ge()), I && typeof se == `string` && (se = Ue(``)));
      (w && w(e), (Yt = e));
    },
    $t = f({}, [...fe, ...pe, ...me]),
    en = f({}, [...he, ...ge]),
    tn = function (e, t, n) {
      return t.namespaceURI === G
        ? e === `svg`
        : t.namespaceURI === It
          ? e === `svg` && (n === `annotation-xml` || Ut[n])
          : !!$t[e];
    },
    nn = function (e, t, n) {
      return t.namespaceURI === G
        ? e === `math`
        : t.namespaceURI === Lt
          ? e === `math` && Gt[n]
          : !!en[e];
    },
    rn = function (e, t, n) {
      return (t.namespaceURI === Lt && !Gt[n]) || (t.namespaceURI === It && !Ut[n])
        ? !1
        : !en[e] && (Kt[e] || !$t[e]);
    },
    an = function (e) {
      let t = C(e);
      (!t || !t.tagName) && (t = { namespaceURI: Rt, tagName: `template` });
      let n = F(e.tagName),
        r = F(t.tagName);
      return Bt[e.namespaceURI]
        ? e.namespaceURI === Lt
          ? tn(n, t, r)
          : e.namespaceURI === It
            ? nn(n, t, r)
            : e.namespaceURI === G
              ? rn(n, t, r)
              : !!(qt === `application/xhtml+xml` && Bt[e.namespaceURI])
        : !1;
    },
    on = function (e) {
      M(t.removed, { element: e });
      try {
        C(e).removeChild(e);
      } catch {
        if ((b(e), !C(e)))
          throw ue(
            `a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place`,
          );
      }
    },
    sn = function (e) {
      let t = S(e);
      if (t) {
        let e = [];
        (A(t, (t) => {
          M(e, t);
        }),
          A(e, (e) => {
            try {
              b(e);
            } catch {}
          }));
      }
      let n = O(e);
      if (n)
        for (let t = n.length - 1; t >= 0; --t) {
          let r = n[t],
            i = r && r.name;
          if (typeof i == `string`)
            try {
              e.removeAttribute(i);
            } catch {}
        }
    },
    cn = function (e, n) {
      try {
        M(t.removed, { attribute: n.getAttributeNode(e), from: n });
      } catch {
        M(t.removed, { attribute: null, from: n });
      }
      if ((n.removeAttribute(e), e === `is`))
        if (xt || St)
          try {
            on(n);
          } catch {}
        else
          try {
            n.setAttribute(e, ``);
          } catch {}
    },
    ln = function (e) {
      let t = O(e);
      if (t)
        for (let n = t.length - 1; n >= 0; --n) {
          let r = t[n],
            i = r && r.name;
          if (!(typeof i != `string` || V[K(i)]))
            try {
              e.removeAttribute(i);
            } catch {}
        }
    },
    un = function (e) {
      let t = [e];
      for (; t.length > 0;) {
        let e = t.pop();
        (k ? k(e) : e.nodeType) === Ie.element && ln(e);
        let n = S(e);
        if (n) for (let e = n.length - 1; e >= 0; --e) t.push(n[e]);
      }
    },
    dn = function (e) {
      let t = null,
        r = null;
      if (bt) e = `<remove></remove>` + e;
      else {
        let t = ne(e, /^[\r\n\t ]+/);
        r = t && t[0];
      }
      qt === `application/xhtml+xml` &&
        Rt === G &&
        (e =
          `<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>` + e + `</body></html>`);
      let i = I ? Ue(e) : e;
      if (Rt === G)
        try {
          t = new l().parseFromString(i, qt);
        } catch {}
      if (!t || !t.documentElement) {
        t = qe.createDocument(Rt, `template`, null);
        try {
          t.documentElement.innerHTML = zt ? se : i;
        } catch {}
      }
      let a = t.body || t.documentElement;
      return (
        e && r && a.insertBefore(n.createTextNode(r), a.childNodes[0] || null),
        Rt === G ? Xe.call(t, gt ? `html` : `body`)[0] : gt ? t.documentElement : a
      );
    },
    fn = function (e) {
      return Je.call(
        e.ownerDocument || e,
        e,
        c.SHOW_ELEMENT |
          c.SHOW_COMMENT |
          c.SHOW_TEXT |
          c.SHOW_PROCESSING_INSTRUCTION |
          c.SHOW_CDATA_SECTION,
        null,
      );
    },
    pn = function (e) {
      return ((e = re(e, Qe, ` `)), (e = re(e, $e, ` `)), (e = re(e, et, ` `)), e);
    },
    mn = function (e) {
      e.normalize();
      let t = Je.call(
          e.ownerDocument || e,
          e,
          c.SHOW_TEXT | c.SHOW_COMMENT | c.SHOW_CDATA_SECTION | c.SHOW_PROCESSING_INSTRUCTION,
          null,
        ),
        n = t.nextNode();
      for (; n;) ((n.data = pn(n.data)), (n = t.nextNode()));
      let r = e.querySelectorAll?.call(e, `template`);
      r &&
        A(r, (e) => {
          gn(e.content) && mn(e.content);
        });
    },
    hn = function (e) {
      let t = oe ? oe(e) : null;
      return typeof t != `string` || K(t) !== `form`
        ? !1
        : typeof e.nodeName != `string` ||
            typeof e.textContent != `string` ||
            typeof e.removeChild != `function` ||
            e.attributes !== O(e) ||
            typeof e.removeAttribute != `function` ||
            typeof e.setAttribute != `function` ||
            typeof e.namespaceURI != `string` ||
            typeof e.insertBefore != `function` ||
            typeof e.hasChildNodes != `function` ||
            e.nodeType !== k(e) ||
            e.childNodes !== S(e);
    },
    gn = function (e) {
      if (!k || typeof e != `object` || !e) return !1;
      try {
        return k(e) === Ie.documentFragment;
      } catch {
        return !1;
      }
    },
    _n = function (e) {
      if (!k || typeof e != `object` || !e) return !1;
      try {
        return typeof k(e) == `number`;
      } catch {
        return !1;
      }
    };
  function vn(e, n, r) {
    e.length !== 0 &&
      A(e, (e) => {
        e.call(t, n, r, Yt);
      });
  }
  let yn = function (e, t) {
      return !!(
        (ht &&
          e.hasChildNodes() &&
          !_n(e.firstElementChild) &&
          R(Me, e.textContent) &&
          R(Me, e.innerHTML)) ||
        (ht && e.namespaceURI === G && t === `style` && _n(e.firstElementChild)) ||
        e.nodeType === Ie.processingInstruction ||
        (ht && e.nodeType === Ie.comment && R(Ne, e.data))
      );
    },
    bn = function (e, t) {
      if (
        !U[t] &&
        wn(t) &&
        ((H.tagNameCheck instanceof RegExp && R(H.tagNameCheck, t)) ||
          (H.tagNameCheck instanceof Function && H.tagNameCheck(t)))
      )
        return !1;
      if (Dt && !At[t]) {
        let t = C(e),
          n = S(e);
        if (n && t) {
          let r = n.length;
          for (let i = r - 1; i >= 0; --i) {
            let r = Ot ? n[i] : p(n[i], !0);
            t.insertBefore(r, x(e));
          }
        }
      }
      return (on(e), !0);
    },
    xn = function (e) {
      if ((vn(z.beforeSanitizeElements, e, null), hn(e))) return (on(e), !0);
      let n = K(oe ? oe(e) : e.nodeName);
      if ((vn(z.uponSanitizeElement, e, { tagName: n, allowedTags: B }), yn(e, n)))
        return (on(e), !0);
      if (U[n] || (!(W.tagCheck instanceof Function && W.tagCheck(n)) && !B[n])) return bn(e, n);
      if (
        ((k ? k(e) : e.nodeType) === Ie.element && !an(e)) ||
        ((n === `noscript` || n === `noembed` || n === `noframes`) && R(Pe, e.innerHTML))
      )
        return (on(e), !0);
      if (mt && e.nodeType === Ie.text) {
        let n = pn(e.textContent);
        e.textContent !== n && (M(t.removed, { element: e.cloneNode() }), (e.textContent = n));
      }
      return (vn(z.afterSanitizeElements, e, null), !1);
    },
    Sn = function (e, t, r) {
      if (lt[t] || (wt && (t === `id` || t === `name`) && (r in n || r in Xt))) return !1;
      let i = V[t] || (W.attributeCheck instanceof Function && W.attributeCheck(t, e));
      if (!(dt && R(tt, t)) && !(ut && R(nt, t))) {
        if (!i) {
          if (
            !(
              (wn(e) &&
                ((H.tagNameCheck instanceof RegExp && R(H.tagNameCheck, e)) ||
                  (H.tagNameCheck instanceof Function && H.tagNameCheck(e))) &&
                ((H.attributeNameCheck instanceof RegExp && R(H.attributeNameCheck, t)) ||
                  (H.attributeNameCheck instanceof Function && H.attributeNameCheck(t, e)))) ||
              (t === `is` &&
                H.allowCustomizedBuiltInElements &&
                ((H.tagNameCheck instanceof RegExp && R(H.tagNameCheck, r)) ||
                  (H.tagNameCheck instanceof Function && H.tagNameCheck(r))))
            )
          )
            return !1;
        } else if (
          !Pt[t] &&
          !R(ot, re(r, it, ``)) &&
          !(
            (t === `src` || t === `xlink:href` || t === `href`) &&
            e !== `script` &&
            ie(r, `data:`) === 0 &&
            Mt[e]
          ) &&
          !(ft && !R(rt, re(r, it, ``))) &&
          r
        )
          return !1;
      }
      return !0;
    },
    Cn = f({}, [
      `annotation-xml`,
      `color-profile`,
      `font-face`,
      `font-face-format`,
      `font-face-name`,
      `font-face-src`,
      `font-face-uri`,
      `missing-glyph`,
    ]),
    wn = function (e) {
      return !Cn[F(e)] && R(at, e);
    },
    Tn = function (e, t, n, r) {
      if (I && typeof u == `object` && typeof u.getAttributeType == `function` && !n)
        switch (u.getAttributeType(e, t)) {
          case `TrustedHTML`:
            return Ue(r);
          case `TrustedScriptURL`:
            return We(r);
        }
      return r;
    },
    En = function (e, n, r, i) {
      try {
        (r ? e.setAttributeNS(r, n, i) : e.setAttribute(n, i), hn(e) ? on(e) : j(t.removed));
      } catch {
        cn(n, e);
      }
    },
    Dn = function (e) {
      vn(z.beforeSanitizeAttributes, e, null);
      let t = e.attributes;
      if (!t || hn(e)) return;
      let n = {
          attrName: ``,
          attrValue: ``,
          keepAttr: !0,
          allowedAttributes: V,
          forceKeepAttr: void 0,
        },
        r = t.length,
        i = K(e.nodeName);
      for (; r--;) {
        let a = t[r],
          o = a.name,
          s = a.namespaceURI,
          c = a.value,
          l = K(o),
          u = c,
          d = o === `value` ? u : ae(u);
        if (
          ((n.attrName = l),
          (n.attrValue = d),
          (n.keepAttr = !0),
          (n.forceKeepAttr = void 0),
          vn(z.uponSanitizeAttribute, e, n),
          (d = n.attrValue),
          Tt && (l === `id` || l === `name`) && ie(d, Et) !== 0 && (cn(o, e), (d = Et + d)),
          ht &&
            R(
              /((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i,
              d,
            ))
        ) {
          cn(o, e);
          continue;
        }
        if (l === `attributename` && ne(d, `href`)) {
          cn(o, e);
          continue;
        }
        if (!n.forceKeepAttr) {
          if (!n.keepAttr) {
            cn(o, e);
            continue;
          }
          if (!pt && R(Fe, d)) {
            cn(o, e);
            continue;
          }
          if ((mt && (d = pn(d)), !Sn(i, l, d))) {
            cn(o, e);
            continue;
          }
          ((d = Tn(i, l, s, d)), d !== u && En(e, o, s, d));
        }
      }
      vn(z.afterSanitizeAttributes, e, null);
    },
    On = function (e) {
      let t = null,
        n = fn(e);
      for (vn(z.beforeSanitizeShadowDOM, e, null); (t = n.nextNode());)
        if (
          (vn(z.uponSanitizeShadowNode, t, null),
          xn(t),
          Dn(t),
          gn(t.content) && On(t.content),
          (k ? k(t) : t.nodeType) === Ie.element)
        ) {
          let e = D(t);
          gn(e) && (kn(e), On(e));
        }
      vn(z.afterSanitizeShadowDOM, e, null);
    },
    kn = function (e) {
      let t = [{ node: e, shadow: null }];
      for (; t.length > 0;) {
        let e = t.pop();
        if (e.shadow) {
          On(e.shadow);
          continue;
        }
        let n = e.node,
          r = (k ? k(n) : n.nodeType) === Ie.element,
          i = S(n);
        if (i) for (let e = i.length - 1; e >= 0; --e) t.push({ node: i[e], shadow: null });
        if (r) {
          let e = oe ? oe(n) : null;
          if (typeof e == `string` && K(e) === `template`) {
            let e = n.content;
            gn(e) && t.push({ node: e, shadow: null });
          }
        }
        if (r) {
          let e = D(n);
          gn(e) && t.push({ node: null, shadow: e }, { node: e, shadow: null });
        }
      }
    };
  return (
    (t.sanitize = function (e) {
      let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
        i = null,
        a = null,
        o = null,
        s = null;
      if (
        ((zt = !e),
        zt && (e = `<!-->`),
        typeof e != `string` && !_n(e) && ((e = h(e)), typeof e != `string`))
      )
        throw ue(`dirty is not a string, aborting`);
      if (!t.isSupported) return e;
      (_t ? ((B = vt), (V = yt)) : Qt(n),
        (z.uponSanitizeElement.length > 0 || z.uponSanitizeAttribute.length > 0) && (B = m(B)),
        z.uponSanitizeAttribute.length > 0 && (V = m(V)),
        (t.removed = []));
      let c = Ot && typeof e != `string` && _n(e);
      if (c) {
        let t = oe ? oe(e) : e.nodeName;
        if (typeof t == `string`) {
          let e = K(t);
          if (!B[e] || U[e]) throw ue(`root node is forbidden and cannot be sanitized in-place`);
        }
        if (hn(e)) throw ue(`root node is clobbered and cannot be sanitized in-place`);
        try {
          kn(e);
        } catch (t) {
          throw (sn(e), t);
        }
      } else if (_n(e))
        ((i = dn(`<!---->`)),
          (a = i.ownerDocument.importNode(e, !0)),
          (a.nodeType === Ie.element && a.nodeName === `BODY`) || a.nodeName === `HTML`
            ? (i = a)
            : i.appendChild(a),
          kn(a));
      else {
        if (!xt && !mt && !gt && e.indexOf(`<`) === -1) return I && Ct ? Ue(e) : e;
        if (((i = dn(e)), !i)) return xt ? null : Ct ? se : ``;
      }
      i && bt && on(i.firstChild);
      let l = fn(c ? e : i);
      try {
        for (; (o = l.nextNode());) (xn(o), Dn(o), gn(o.content) && On(o.content));
      } catch (t) {
        throw (c && sn(e), t);
      }
      if (c)
        return (
          A(t.removed, (e) => {
            e.element && un(e.element);
          }),
          mt && mn(e),
          e
        );
      if (xt) {
        if ((mt && mn(i), St))
          for (s = Ye.call(i.ownerDocument); i.firstChild;) s.appendChild(i.firstChild);
        else s = i;
        return ((V.shadowroot || V.shadowrootmode) && (s = Ze.call(r, s, !0)), s);
      }
      let u = gt ? i.outerHTML : i.innerHTML;
      return (
        gt &&
          B[`!doctype`] &&
          i.ownerDocument &&
          i.ownerDocument.doctype &&
          i.ownerDocument.doctype.name &&
          R(Ae, i.ownerDocument.doctype.name) &&
          (u =
            `<!DOCTYPE ` +
            i.ownerDocument.doctype.name +
            `>
` +
            u),
        mt && (u = pn(u)),
        I && Ct ? Ue(u) : u
      );
    }),
    (t.setConfig = function () {
      let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      (Qt(e), (_t = !0), (vt = B), (yt = V));
    }),
    (t.clearConfig = function () {
      ((Yt = null), (_t = !1), (vt = null), (yt = null), (I = ce), (se = ``));
    }),
    (t.isValidAttribute = function (e, t, n) {
      Yt || Qt({});
      let r = K(e),
        i = K(t);
      return Sn(r, i, n);
    }),
    (t.addHook = function (e, t) {
      typeof t == `function` && L(z, e) && M(z[e], t);
    }),
    (t.removeHook = function (e, t) {
      if (L(z, e)) {
        if (t !== void 0) {
          let n = ee(z[e], t);
          return n === -1 ? void 0 : N(z[e], n, 1)[0];
        }
        return j(z[e]);
      }
    }),
    (t.removeHooks = function (e) {
      L(z, e) && (z[e] = []);
    }),
    (t.removeAllHooks = function () {
      z = ze();
    }),
    t
  );
}
var y,
  b,
  x,
  S,
  C,
  w,
  T,
  E,
  D,
  O,
  k,
  A,
  ee,
  j,
  M,
  N,
  P,
  F,
  te,
  ne,
  re,
  ie,
  ae,
  oe,
  I,
  se,
  ce,
  L,
  le,
  R,
  ue,
  de,
  fe,
  pe,
  me,
  he,
  ge,
  _e,
  ve,
  ye,
  be,
  xe,
  Se,
  Ce,
  we,
  Te,
  Ee,
  De,
  Oe,
  ke,
  Ae,
  je,
  Me,
  Ne,
  Pe,
  Fe,
  Ie,
  Le,
  Re,
  ze,
  Be,
  Ve,
  He = t(() => {
    ((y = Object.entries),
      (b = Object.setPrototypeOf),
      (x = Object.isFrozen),
      (S = Object.getPrototypeOf),
      (C = Object.getOwnPropertyDescriptor),
      (w = Object.freeze),
      (T = Object.seal),
      (E = Object.create),
      (D = typeof Reflect < `u` && Reflect),
      (O = D.apply),
      (k = D.construct),
      (w ||= function (e) {
        return e;
      }),
      (T ||= function (e) {
        return e;
      }),
      (O ||= function (e, t) {
        var n = [...arguments].slice(2);
        return e.apply(t, n);
      }),
      (k ||= function (e) {
        return new e(...[...arguments].slice(1));
      }),
      (A = u(Array.prototype.forEach)),
      (ee = u(Array.prototype.lastIndexOf)),
      (j = u(Array.prototype.pop)),
      (M = u(Array.prototype.push)),
      (N = u(Array.prototype.splice)),
      (P = Array.isArray),
      (F = u(String.prototype.toLowerCase)),
      (te = u(String.prototype.toString)),
      (ne = u(String.prototype.match)),
      (re = u(String.prototype.replace)),
      (ie = u(String.prototype.indexOf)),
      (ae = u(String.prototype.trim)),
      (oe = u(Number.prototype.toString)),
      (I = u(Boolean.prototype.toString)),
      (se = typeof BigInt > `u` ? null : u(BigInt.prototype.toString)),
      (ce = typeof Symbol > `u` ? null : u(Symbol.prototype.toString)),
      (L = u(Object.prototype.hasOwnProperty)),
      (le = u(Object.prototype.toString)),
      (R = u(RegExp.prototype.test)),
      (ue = d(TypeError)),
      (de = w(
        `a.abbr.acronym.address.area.article.aside.audio.b.bdi.bdo.big.blink.blockquote.body.br.button.canvas.caption.center.cite.code.col.colgroup.content.data.datalist.dd.decorator.del.details.dfn.dialog.dir.div.dl.dt.element.em.fieldset.figcaption.figure.font.footer.form.h1.h2.h3.h4.h5.h6.head.header.hgroup.hr.html.i.img.input.ins.kbd.label.legend.li.main.map.mark.marquee.menu.menuitem.meter.nav.nobr.ol.optgroup.option.output.p.picture.pre.progress.q.rp.rt.ruby.s.samp.search.section.select.shadow.slot.small.source.spacer.span.strike.strong.style.sub.summary.sup.table.tbody.td.template.textarea.tfoot.th.thead.time.tr.track.tt.u.ul.var.video.wbr`.split(
          `.`,
        ),
      )),
      (fe = w(
        `svg.a.altglyph.altglyphdef.altglyphitem.animatecolor.animatemotion.animatetransform.circle.clippath.defs.desc.ellipse.enterkeyhint.exportparts.filter.font.g.glyph.glyphref.hkern.image.inputmode.line.lineargradient.marker.mask.metadata.mpath.part.path.pattern.polygon.polyline.radialgradient.rect.stop.style.switch.symbol.text.textpath.title.tref.tspan.view.vkern`.split(
          `.`,
        ),
      )),
      (pe = w([
        `feBlend`,
        `feColorMatrix`,
        `feComponentTransfer`,
        `feComposite`,
        `feConvolveMatrix`,
        `feDiffuseLighting`,
        `feDisplacementMap`,
        `feDistantLight`,
        `feDropShadow`,
        `feFlood`,
        `feFuncA`,
        `feFuncB`,
        `feFuncG`,
        `feFuncR`,
        `feGaussianBlur`,
        `feImage`,
        `feMerge`,
        `feMergeNode`,
        `feMorphology`,
        `feOffset`,
        `fePointLight`,
        `feSpecularLighting`,
        `feSpotLight`,
        `feTile`,
        `feTurbulence`,
      ])),
      (me = w([
        `animate`,
        `color-profile`,
        `cursor`,
        `discard`,
        `font-face`,
        `font-face-format`,
        `font-face-name`,
        `font-face-src`,
        `font-face-uri`,
        `foreignobject`,
        `hatch`,
        `hatchpath`,
        `mesh`,
        `meshgradient`,
        `meshpatch`,
        `meshrow`,
        `missing-glyph`,
        `script`,
        `set`,
        `solidcolor`,
        `unknown`,
        `use`,
      ])),
      (he = w(
        `math.menclose.merror.mfenced.mfrac.mglyph.mi.mlabeledtr.mmultiscripts.mn.mo.mover.mpadded.mphantom.mroot.mrow.ms.mspace.msqrt.mstyle.msub.msup.msubsup.mtable.mtd.mtext.mtr.munder.munderover.mprescripts`.split(
          `.`,
        ),
      )),
      (ge = w([
        `maction`,
        `maligngroup`,
        `malignmark`,
        `mlongdiv`,
        `mscarries`,
        `mscarry`,
        `msgroup`,
        `mstack`,
        `msline`,
        `msrow`,
        `semantics`,
        `annotation`,
        `annotation-xml`,
        `mprescripts`,
        `none`,
      ])),
      (_e = w([`#text`])),
      (ve = w(
        `accept.action.align.alt.autocapitalize.autocomplete.autopictureinpicture.autoplay.background.bgcolor.border.capture.cellpadding.cellspacing.checked.cite.class.clear.color.cols.colspan.command.commandfor.controls.controlslist.coords.crossorigin.datetime.decoding.default.dir.disabled.disablepictureinpicture.disableremoteplayback.download.draggable.enctype.enterkeyhint.exportparts.face.for.headers.height.hidden.high.href.hreflang.id.inert.inputmode.integrity.ismap.kind.label.lang.list.loading.loop.low.max.maxlength.media.method.min.minlength.multiple.muted.name.nonce.noshade.novalidate.nowrap.open.optimum.part.pattern.placeholder.playsinline.popover.popovertarget.popovertargetaction.poster.preload.pubdate.radiogroup.readonly.rel.required.rev.reversed.role.rows.rowspan.spellcheck.scope.selected.shape.size.sizes.slot.span.srclang.start.src.srcset.step.style.summary.tabindex.title.translate.type.usemap.valign.value.width.wrap.xmlns`.split(
          `.`,
        ),
      )),
      (ye = w(
        `accent-height.accumulate.additive.alignment-baseline.amplitude.ascent.attributename.attributetype.azimuth.basefrequency.baseline-shift.begin.bias.by.class.clip.clippathunits.clip-path.clip-rule.color.color-interpolation.color-interpolation-filters.color-profile.color-rendering.cx.cy.d.dx.dy.diffuseconstant.direction.display.divisor.dur.edgemode.elevation.end.exponent.fill.fill-opacity.fill-rule.filter.filterunits.flood-color.flood-opacity.font-family.font-size.font-size-adjust.font-stretch.font-style.font-variant.font-weight.fx.fy.g1.g2.glyph-name.glyphref.gradientunits.gradienttransform.height.href.id.image-rendering.in.in2.intercept.k.k1.k2.k3.k4.kerning.keypoints.keysplines.keytimes.lang.lengthadjust.letter-spacing.kernelmatrix.kernelunitlength.lighting-color.local.marker-end.marker-mid.marker-start.markerheight.markerunits.markerwidth.maskcontentunits.maskunits.max.mask.mask-type.media.method.mode.min.name.numoctaves.offset.operator.opacity.order.orient.orientation.origin.overflow.paint-order.path.pathlength.patterncontentunits.patterntransform.patternunits.points.preservealpha.preserveaspectratio.primitiveunits.r.rx.ry.radius.refx.refy.repeatcount.repeatdur.restart.result.rotate.scale.seed.shape-rendering.slope.specularconstant.specularexponent.spreadmethod.startoffset.stddeviation.stitchtiles.stop-color.stop-opacity.stroke-dasharray.stroke-dashoffset.stroke-linecap.stroke-linejoin.stroke-miterlimit.stroke-opacity.stroke.stroke-width.style.surfacescale.systemlanguage.tabindex.tablevalues.targetx.targety.transform.transform-origin.text-anchor.text-decoration.text-rendering.textlength.type.u1.u2.unicode.values.viewbox.visibility.version.vert-adv-y.vert-origin-x.vert-origin-y.width.word-spacing.wrap.writing-mode.xchannelselector.ychannelselector.x.x1.x2.xmlns.y.y1.y2.z.zoomandpan`.split(
          `.`,
        ),
      )),
      (be = w(
        `accent.accentunder.align.bevelled.close.columnalign.columnlines.columnspacing.columnspan.denomalign.depth.dir.display.displaystyle.encoding.fence.frame.height.href.id.largeop.length.linethickness.lquote.lspace.mathbackground.mathcolor.mathsize.mathvariant.maxsize.minsize.movablelimits.notation.numalign.open.rowalign.rowlines.rowspacing.rowspan.rspace.rquote.scriptlevel.scriptminsize.scriptsizemultiplier.selection.separator.separators.stretchy.subscriptshift.supscriptshift.symmetric.voffset.width.xmlns`.split(
          `.`,
        ),
      )),
      (xe = w([`xlink:href`, `xml:id`, `xlink:title`, `xml:space`, `xmlns:xlink`])),
      (Se = T(/{{[\w\W]*|^[\w\W]*}}/g)),
      (Ce = T(/<%[\w\W]*|^[\w\W]*%>/g)),
      (we = T(/\${[\w\W]*/g)),
      (Te = T(/^data-[\-\w.\u00B7-\uFFFF]+$/)),
      (Ee = T(/^aria-[\-\w]+$/)),
      (De = T(
        /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
      )),
      (Oe = T(/^(?:\w+script|data):/i)),
      (ke = T(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g)),
      (Ae = T(/^html$/i)),
      (je = T(/^[a-z][.\w]*(-[.\w]+)+$/i)),
      (Me = T(/<[/\w!]/g)),
      (Ne = T(/<[/\w]/g)),
      (Pe = T(/<\/no(script|embed|frames)/i)),
      (Fe = T(/\/>/i)),
      (Ie = {
        element: 1,
        attribute: 2,
        text: 3,
        cdataSection: 4,
        entityReference: 5,
        entityNode: 6,
        processingInstruction: 7,
        comment: 8,
        document: 9,
        documentType: 10,
        documentFragment: 11,
        notation: 12,
      }),
      (Le = function () {
        return typeof window > `u` ? null : window;
      }),
      (Re = function (e, t) {
        if (typeof e != `object` || typeof e.createPolicy != `function`) return null;
        let n = null,
          r = `data-tt-policy-suffix`;
        t && t.hasAttribute(r) && (n = t.getAttribute(r));
        let i = `dompurify` + (n ? `#` + n : ``);
        try {
          return e.createPolicy(i, {
            createHTML(e) {
              return e;
            },
            createScriptURL(e) {
              return e;
            },
          });
        } catch {
          return (console.warn(`TrustedTypes policy ` + i + ` could not be created.`), null);
        }
      }),
      (ze = function () {
        return {
          afterSanitizeAttributes: [],
          afterSanitizeElements: [],
          afterSanitizeShadowDOM: [],
          beforeSanitizeAttributes: [],
          beforeSanitizeElements: [],
          beforeSanitizeShadowDOM: [],
          uponSanitizeAttribute: [],
          uponSanitizeElement: [],
          uponSanitizeShadowNode: [],
        };
      }),
      (Be = function (e, t, n, r) {
        return L(e, t) && P(e[t]) ? f(r.base ? m(r.base) : {}, e[t], r.transform) : n;
      }),
      (Ve = v()));
  }),
  Ue = r((e, t) => {
    function n(e) {
      return (
        e instanceof Map
          ? (e.clear =
              e.delete =
              e.set =
                function () {
                  throw Error(`map is read-only`);
                })
          : e instanceof Set &&
            (e.add =
              e.clear =
              e.delete =
                function () {
                  throw Error(`set is read-only`);
                }),
        Object.freeze(e),
        Object.getOwnPropertyNames(e).forEach((t) => {
          let r = e[t],
            i = typeof r;
          (i === `object` || i === `function`) && !Object.isFrozen(r) && n(r);
        }),
        e
      );
    }
    var r = class {
      constructor(e) {
        (e.data === void 0 && (e.data = {}), (this.data = e.data), (this.isMatchIgnored = !1));
      }
      ignoreMatch() {
        this.isMatchIgnored = !0;
      }
    };
    function i(e) {
      return e
        .replace(/&/g, `&amp;`)
        .replace(/</g, `&lt;`)
        .replace(/>/g, `&gt;`)
        .replace(/"/g, `&quot;`)
        .replace(/'/g, `&#x27;`);
    }
    function a(e, ...t) {
      let n = Object.create(null);
      for (let t in e) n[t] = e[t];
      return (
        t.forEach(function (e) {
          for (let t in e) n[t] = e[t];
        }),
        n
      );
    }
    var o = `</span>`,
      s = (e) => !!e.scope,
      c = (e, { prefix: t }) => {
        if (e.startsWith(`language:`)) return e.replace(`language:`, `language-`);
        if (e.includes(`.`)) {
          let n = e.split(`.`);
          return [`${t}${n.shift()}`, ...n.map((e, t) => `${e}${`_`.repeat(t + 1)}`)].join(` `);
        }
        return `${t}${e}`;
      },
      l = class {
        constructor(e, t) {
          ((this.buffer = ``), (this.classPrefix = t.classPrefix), e.walk(this));
        }
        addText(e) {
          this.buffer += i(e);
        }
        openNode(e) {
          if (!s(e)) return;
          let t = c(e.scope, { prefix: this.classPrefix });
          this.span(t);
        }
        closeNode(e) {
          s(e) && (this.buffer += o);
        }
        value() {
          return this.buffer;
        }
        span(e) {
          this.buffer += `<span class="${e}">`;
        }
      },
      u = (e = {}) => {
        let t = { children: [] };
        return (Object.assign(t, e), t);
      },
      d = class e {
        constructor() {
          ((this.rootNode = u()), (this.stack = [this.rootNode]));
        }
        get top() {
          return this.stack[this.stack.length - 1];
        }
        get root() {
          return this.rootNode;
        }
        add(e) {
          this.top.children.push(e);
        }
        openNode(e) {
          let t = u({ scope: e });
          (this.add(t), this.stack.push(t));
        }
        closeNode() {
          if (this.stack.length > 1) return this.stack.pop();
        }
        closeAllNodes() {
          for (; this.closeNode(););
        }
        toJSON() {
          return JSON.stringify(this.rootNode, null, 4);
        }
        walk(e) {
          return this.constructor._walk(e, this.rootNode);
        }
        static _walk(e, t) {
          return (
            typeof t == `string`
              ? e.addText(t)
              : t.children &&
                (e.openNode(t), t.children.forEach((t) => this._walk(e, t)), e.closeNode(t)),
            e
          );
        }
        static _collapse(t) {
          typeof t != `string` &&
            t.children &&
            (t.children.every((e) => typeof e == `string`)
              ? (t.children = [t.children.join(``)])
              : t.children.forEach((t) => {
                  e._collapse(t);
                }));
        }
      },
      f = class extends d {
        constructor(e) {
          (super(), (this.options = e));
        }
        addText(e) {
          e !== `` && this.add(e);
        }
        startScope(e) {
          this.openNode(e);
        }
        endScope() {
          this.closeNode();
        }
        __addSublanguage(e, t) {
          let n = e.root;
          (t && (n.scope = `language:${t}`), this.add(n));
        }
        toHTML() {
          return new l(this, this.options).value();
        }
        finalize() {
          return (this.closeAllNodes(), !0);
        }
      };
    function p(e) {
      return e ? (typeof e == `string` ? e : e.source) : null;
    }
    function m(e) {
      return _(`(?=`, e, `)`);
    }
    function h(e) {
      return _(`(?:`, e, `)*`);
    }
    function g(e) {
      return _(`(?:`, e, `)?`);
    }
    function _(...e) {
      return e.map((e) => p(e)).join(``);
    }
    function v(e) {
      let t = e[e.length - 1];
      return typeof t == `object` && t.constructor === Object ? (e.splice(e.length - 1, 1), t) : {};
    }
    function y(...e) {
      return `(` + (v(e).capture ? `` : `?:`) + e.map((e) => p(e)).join(`|`) + `)`;
    }
    function b(e) {
      return RegExp(e.toString() + `|`).exec(``).length - 1;
    }
    function x(e, t) {
      let n = e && e.exec(t);
      return n && n.index === 0;
    }
    var S = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
    function C(e, { joinWith: t }) {
      let n = 0;
      return e
        .map((e) => {
          n += 1;
          let t = n,
            r = p(e),
            i = ``;
          for (; r.length > 0;) {
            let e = S.exec(r);
            if (!e) {
              i += r;
              break;
            }
            ((i += r.substring(0, e.index)),
              (r = r.substring(e.index + e[0].length)),
              e[0][0] === `\\` && e[1]
                ? (i += `\\` + String(Number(e[1]) + t))
                : ((i += e[0]), e[0] === `(` && n++));
          }
          return i;
        })
        .map((e) => `(${e})`)
        .join(t);
    }
    var w = /\b\B/,
      T = `[a-zA-Z]\\w*`,
      E = `[a-zA-Z_]\\w*`,
      D = `\\b\\d+(\\.\\d+)?`,
      O = `(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)`,
      k = `\\b(0b[01]+)`,
      A = `!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~`,
      ee = (e = {}) => {
        let t = /^#![ ]*\//;
        return (
          e.binary && (e.begin = _(t, /.*\b/, e.binary, /\b.*/)),
          a(
            {
              scope: `meta`,
              begin: t,
              end: /$/,
              relevance: 0,
              "on:begin": (e, t) => {
                e.index !== 0 && t.ignoreMatch();
              },
            },
            e,
          )
        );
      },
      j = { begin: `\\\\[\\s\\S]`, relevance: 0 },
      M = { scope: `string`, begin: `'`, end: `'`, illegal: `\\n`, contains: [j] },
      N = { scope: `string`, begin: `"`, end: `"`, illegal: `\\n`, contains: [j] },
      P = {
        begin:
          /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/,
      },
      F = function (e, t, n = {}) {
        let r = a({ scope: `comment`, begin: e, end: t, contains: [] }, n);
        r.contains.push({
          scope: `doctag`,
          begin: `[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)`,
          end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
          excludeBegin: !0,
          relevance: 0,
        });
        let i = y(
          `I`,
          `a`,
          `is`,
          `so`,
          `us`,
          `to`,
          `at`,
          `if`,
          `in`,
          `it`,
          `on`,
          /[A-Za-z]+['](d|ve|re|ll|t|s|n)/,
          /[A-Za-z]+[-][a-z]+/,
          /[A-Za-z][a-z]{2,}/,
        );
        return (r.contains.push({ begin: _(/[ ]+/, `(`, i, /[.]?[:]?([.][ ]|[ ])/, `){3}`) }), r);
      },
      te = F(`//`, `$`),
      ne = F(`/\\*`, `\\*/`),
      re = F(`#`, `$`),
      ie = Object.freeze({
        __proto__: null,
        APOS_STRING_MODE: M,
        BACKSLASH_ESCAPE: j,
        BINARY_NUMBER_MODE: { scope: `number`, begin: k, relevance: 0 },
        BINARY_NUMBER_RE: k,
        COMMENT: F,
        C_BLOCK_COMMENT_MODE: ne,
        C_LINE_COMMENT_MODE: te,
        C_NUMBER_MODE: { scope: `number`, begin: O, relevance: 0 },
        C_NUMBER_RE: O,
        END_SAME_AS_BEGIN: function (e) {
          return Object.assign(e, {
            "on:begin": (e, t) => {
              t.data._beginMatch = e[1];
            },
            "on:end": (e, t) => {
              t.data._beginMatch !== e[1] && t.ignoreMatch();
            },
          });
        },
        HASH_COMMENT_MODE: re,
        IDENT_RE: T,
        MATCH_NOTHING_RE: w,
        METHOD_GUARD: { begin: `\\.\\s*[a-zA-Z_]\\w*`, relevance: 0 },
        NUMBER_MODE: { scope: `number`, begin: D, relevance: 0 },
        NUMBER_RE: D,
        PHRASAL_WORDS_MODE: P,
        QUOTE_STRING_MODE: N,
        REGEXP_MODE: {
          scope: `regexp`,
          begin: /\/(?=[^/\n]*\/)/,
          end: /\/[gimuy]*/,
          contains: [j, { begin: /\[/, end: /\]/, relevance: 0, contains: [j] }],
        },
        RE_STARTERS_RE: A,
        SHEBANG: ee,
        TITLE_MODE: { scope: `title`, begin: T, relevance: 0 },
        UNDERSCORE_IDENT_RE: E,
        UNDERSCORE_TITLE_MODE: { scope: `title`, begin: E, relevance: 0 },
      });
    function ae(e, t) {
      e.input[e.index - 1] === `.` && t.ignoreMatch();
    }
    function oe(e, t) {
      e.className !== void 0 && ((e.scope = e.className), delete e.className);
    }
    function I(e, t) {
      t &&
        e.beginKeywords &&
        ((e.begin = `\\b(` + e.beginKeywords.split(` `).join(`|`) + `)(?!\\.)(?=\\b|\\s)`),
        (e.__beforeBegin = ae),
        (e.keywords = e.keywords || e.beginKeywords),
        delete e.beginKeywords,
        e.relevance === void 0 && (e.relevance = 0));
    }
    function se(e, t) {
      Array.isArray(e.illegal) && (e.illegal = y(...e.illegal));
    }
    function ce(e, t) {
      if (e.match) {
        if (e.begin || e.end) throw Error(`begin & end are not supported with match`);
        ((e.begin = e.match), delete e.match);
      }
    }
    function L(e, t) {
      e.relevance === void 0 && (e.relevance = 1);
    }
    var le = (e, t) => {
        if (!e.beforeMatch) return;
        if (e.starts) throw Error(`beforeMatch cannot be used with starts`);
        let n = Object.assign({}, e);
        (Object.keys(e).forEach((t) => {
          delete e[t];
        }),
          (e.keywords = n.keywords),
          (e.begin = _(n.beforeMatch, m(n.begin))),
          (e.starts = { relevance: 0, contains: [Object.assign(n, { endsParent: !0 })] }),
          (e.relevance = 0),
          delete n.beforeMatch);
      },
      R = [`of`, `and`, `for`, `in`, `not`, `or`, `if`, `then`, `parent`, `list`, `value`],
      ue = `keyword`;
    function de(e, t, n = ue) {
      let r = Object.create(null);
      return (
        typeof e == `string`
          ? i(n, e.split(` `))
          : Array.isArray(e)
            ? i(n, e)
            : Object.keys(e).forEach(function (n) {
                Object.assign(r, de(e[n], t, n));
              }),
        r
      );
      function i(e, n) {
        (t && (n = n.map((e) => e.toLowerCase())),
          n.forEach(function (t) {
            let n = t.split(`|`);
            r[n[0]] = [e, fe(n[0], n[1])];
          }));
      }
    }
    function fe(e, t) {
      return t ? Number(t) : +!pe(e);
    }
    function pe(e) {
      return R.includes(e.toLowerCase());
    }
    var me = {},
      he = (e) => {
        console.error(e);
      },
      ge = (e, ...t) => {
        console.log(`WARN: ${e}`, ...t);
      },
      _e = (e, t) => {
        me[`${e}/${t}`] || (console.log(`Deprecated as of ${e}. ${t}`), (me[`${e}/${t}`] = !0));
      },
      ve = Error();
    function ye(e, t, { key: n }) {
      let r = 0,
        i = e[n],
        a = {},
        o = {};
      for (let e = 1; e <= t.length; e++) ((o[e + r] = i[e]), (a[e + r] = !0), (r += b(t[e - 1])));
      ((e[n] = o), (e[n]._emit = a), (e[n]._multi = !0));
    }
    function be(e) {
      if (Array.isArray(e.begin)) {
        if (e.skip || e.excludeBegin || e.returnBegin)
          throw (he(`skip, excludeBegin, returnBegin not compatible with beginScope: {}`), ve);
        if (typeof e.beginScope != `object` || e.beginScope === null)
          throw (he(`beginScope must be object`), ve);
        (ye(e, e.begin, { key: `beginScope` }), (e.begin = C(e.begin, { joinWith: `` })));
      }
    }
    function xe(e) {
      if (Array.isArray(e.end)) {
        if (e.skip || e.excludeEnd || e.returnEnd)
          throw (he(`skip, excludeEnd, returnEnd not compatible with endScope: {}`), ve);
        if (typeof e.endScope != `object` || e.endScope === null)
          throw (he(`endScope must be object`), ve);
        (ye(e, e.end, { key: `endScope` }), (e.end = C(e.end, { joinWith: `` })));
      }
    }
    function Se(e) {
      e.scope &&
        typeof e.scope == `object` &&
        e.scope !== null &&
        ((e.beginScope = e.scope), delete e.scope);
    }
    function Ce(e) {
      (Se(e),
        typeof e.beginScope == `string` && (e.beginScope = { _wrap: e.beginScope }),
        typeof e.endScope == `string` && (e.endScope = { _wrap: e.endScope }),
        be(e),
        xe(e));
    }
    function we(e) {
      function t(t, n) {
        return new RegExp(
          p(t),
          `m` + (e.case_insensitive ? `i` : ``) + (e.unicodeRegex ? `u` : ``) + (n ? `g` : ``),
        );
      }
      class n {
        constructor() {
          ((this.matchIndexes = {}), (this.regexes = []), (this.matchAt = 1), (this.position = 0));
        }
        addRule(e, t) {
          ((t.position = this.position++),
            (this.matchIndexes[this.matchAt] = t),
            this.regexes.push([t, e]),
            (this.matchAt += b(e) + 1));
        }
        compile() {
          this.regexes.length === 0 && (this.exec = () => null);
          let e = this.regexes.map((e) => e[1]);
          ((this.matcherRe = t(C(e, { joinWith: `|` }), !0)), (this.lastIndex = 0));
        }
        exec(e) {
          this.matcherRe.lastIndex = this.lastIndex;
          let t = this.matcherRe.exec(e);
          if (!t) return null;
          let n = t.findIndex((e, t) => t > 0 && e !== void 0),
            r = this.matchIndexes[n];
          return (t.splice(0, n), Object.assign(t, r));
        }
      }
      class r {
        constructor() {
          ((this.rules = []),
            (this.multiRegexes = []),
            (this.count = 0),
            (this.lastIndex = 0),
            (this.regexIndex = 0));
        }
        getMatcher(e) {
          if (this.multiRegexes[e]) return this.multiRegexes[e];
          let t = new n();
          return (
            this.rules.slice(e).forEach(([e, n]) => t.addRule(e, n)),
            t.compile(),
            (this.multiRegexes[e] = t),
            t
          );
        }
        resumingScanAtSamePosition() {
          return this.regexIndex !== 0;
        }
        considerAll() {
          this.regexIndex = 0;
        }
        addRule(e, t) {
          (this.rules.push([e, t]), t.type === `begin` && this.count++);
        }
        exec(e) {
          let t = this.getMatcher(this.regexIndex);
          t.lastIndex = this.lastIndex;
          let n = t.exec(e);
          if (this.resumingScanAtSamePosition() && !(n && n.index === this.lastIndex)) {
            let t = this.getMatcher(0);
            ((t.lastIndex = this.lastIndex + 1), (n = t.exec(e)));
          }
          return (
            n &&
              ((this.regexIndex += n.position + 1),
              this.regexIndex === this.count && this.considerAll()),
            n
          );
        }
      }
      function i(e) {
        let t = new r();
        return (
          e.contains.forEach((e) => t.addRule(e.begin, { rule: e, type: `begin` })),
          e.terminatorEnd && t.addRule(e.terminatorEnd, { type: `end` }),
          e.illegal && t.addRule(e.illegal, { type: `illegal` }),
          t
        );
      }
      function o(n, r) {
        let a = n;
        if (n.isCompiled) return a;
        ([oe, ce, Ce, le].forEach((e) => e(n, r)),
          e.compilerExtensions.forEach((e) => e(n, r)),
          (n.__beforeBegin = null),
          [I, se, L].forEach((e) => e(n, r)),
          (n.isCompiled = !0));
        let s = null;
        return (
          typeof n.keywords == `object` &&
            n.keywords.$pattern &&
            ((n.keywords = Object.assign({}, n.keywords)),
            (s = n.keywords.$pattern),
            delete n.keywords.$pattern),
          (s ||= /\w+/),
          (n.keywords &&= de(n.keywords, e.case_insensitive)),
          (a.keywordPatternRe = t(s, !0)),
          r &&
            ((n.begin ||= /\B|\b/),
            (a.beginRe = t(a.begin)),
            !n.end && !n.endsWithParent && (n.end = /\B|\b/),
            n.end && (a.endRe = t(a.end)),
            (a.terminatorEnd = p(a.end) || ``),
            n.endsWithParent &&
              r.terminatorEnd &&
              (a.terminatorEnd += (n.end ? `|` : ``) + r.terminatorEnd)),
          n.illegal && (a.illegalRe = t(n.illegal)),
          (n.contains ||= []),
          (n.contains = [].concat(
            ...n.contains.map(function (e) {
              return Ee(e === `self` ? n : e);
            }),
          )),
          n.contains.forEach(function (e) {
            o(e, a);
          }),
          n.starts && o(n.starts, r),
          (a.matcher = i(a)),
          a
        );
      }
      if (((e.compilerExtensions ||= []), e.contains && e.contains.includes(`self`)))
        throw Error(
          "ERR: contains `self` is not supported at the top-level of a language.  See documentation.",
        );
      return ((e.classNameAliases = a(e.classNameAliases || {})), o(e));
    }
    function Te(e) {
      return e ? e.endsWithParent || Te(e.starts) : !1;
    }
    function Ee(e) {
      return (
        e.variants &&
          !e.cachedVariants &&
          (e.cachedVariants = e.variants.map(function (t) {
            return a(e, { variants: null }, t);
          })),
        e.cachedVariants
          ? e.cachedVariants
          : Te(e)
            ? a(e, { starts: e.starts ? a(e.starts) : null })
            : Object.isFrozen(e)
              ? a(e)
              : e
      );
    }
    var De = `11.11.1`,
      Oe = class extends Error {
        constructor(e, t) {
          (super(e), (this.name = `HTMLInjectionError`), (this.html = t));
        }
      },
      ke = i,
      Ae = a,
      je = Symbol(`nomatch`),
      Me = 7,
      Ne = function (e) {
        let t = Object.create(null),
          i = Object.create(null),
          a = [],
          o = !0,
          s = `Could not find the language '{}', did you forget to load/include a language module?`,
          c = { disableAutodetect: !0, name: `Plain text`, contains: [] },
          l = {
            ignoreUnescapedHTML: !1,
            throwUnescapedHTML: !1,
            noHighlightRe: /^(no-?highlight)$/i,
            languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
            classPrefix: `hljs-`,
            cssSelector: `pre code`,
            languages: null,
            __emitter: f,
          };
        function u(e) {
          return l.noHighlightRe.test(e);
        }
        function d(e) {
          let t = e.className + ` `;
          t += e.parentNode ? e.parentNode.className : ``;
          let n = l.languageDetectRe.exec(t);
          if (n) {
            let t = M(n[1]);
            return (
              t ||
                (ge(s.replace(`{}`, n[1])),
                ge(`Falling back to no-highlight mode for this block.`, e)),
              t ? n[1] : `no-highlight`
            );
          }
          return t.split(/\s+/).find((e) => u(e) || M(e));
        }
        function p(e, t, n) {
          let r = ``,
            i = ``;
          (typeof t == `object`
            ? ((r = e), (n = t.ignoreIllegals), (i = t.language))
            : (_e(`10.7.0`, `highlight(lang, code, ...args) has been deprecated.`),
              _e(
                `10.7.0`,
                `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`,
              ),
              (i = e),
              (r = t)),
            n === void 0 && (n = !0));
          let a = { code: r, language: i };
          re(`before:highlight`, a);
          let o = a.result ? a.result : v(a.language, a.code, n);
          return ((o.code = a.code), re(`after:highlight`, o), o);
        }
        function v(e, n, i, a) {
          let c = Object.create(null);
          function u(e, t) {
            return e.keywords[t];
          }
          function d() {
            if (!A.keywords) {
              j.addText(N);
              return;
            }
            let e = 0;
            A.keywordPatternRe.lastIndex = 0;
            let t = A.keywordPatternRe.exec(N),
              n = ``;
            for (; t;) {
              n += N.substring(e, t.index);
              let r = D.case_insensitive ? t[0].toLowerCase() : t[0],
                i = u(A, r);
              if (i) {
                let [e, a] = i;
                if (
                  (j.addText(n),
                  (n = ``),
                  (c[r] = (c[r] || 0) + 1),
                  c[r] <= Me && (P += a),
                  e.startsWith(`_`))
                )
                  n += t[0];
                else {
                  let n = D.classNameAliases[e] || e;
                  m(t[0], n);
                }
              } else n += t[0];
              ((e = A.keywordPatternRe.lastIndex), (t = A.keywordPatternRe.exec(N)));
            }
            ((n += N.substring(e)), j.addText(n));
          }
          function f() {
            if (N === ``) return;
            let e = null;
            if (typeof A.subLanguage == `string`) {
              if (!t[A.subLanguage]) {
                j.addText(N);
                return;
              }
              ((e = v(A.subLanguage, N, !0, ee[A.subLanguage])), (ee[A.subLanguage] = e._top));
            } else e = S(N, A.subLanguage.length ? A.subLanguage : null);
            (A.relevance > 0 && (P += e.relevance), j.__addSublanguage(e._emitter, e.language));
          }
          function p() {
            (A.subLanguage == null ? d() : f(), (N = ``));
          }
          function m(e, t) {
            e !== `` && (j.startScope(t), j.addText(e), j.endScope());
          }
          function h(e, t) {
            let n = 1,
              r = t.length - 1;
            for (; n <= r;) {
              if (!e._emit[n]) {
                n++;
                continue;
              }
              let r = D.classNameAliases[e[n]] || e[n],
                i = t[n];
              (r ? m(i, r) : ((N = i), d(), (N = ``)), n++);
            }
          }
          function g(e, t) {
            return (
              e.scope &&
                typeof e.scope == `string` &&
                j.openNode(D.classNameAliases[e.scope] || e.scope),
              e.beginScope &&
                (e.beginScope._wrap
                  ? (m(N, D.classNameAliases[e.beginScope._wrap] || e.beginScope._wrap), (N = ``))
                  : e.beginScope._multi && (h(e.beginScope, t), (N = ``))),
              (A = Object.create(e, { parent: { value: A } })),
              A
            );
          }
          function _(e, t, n) {
            let i = x(e.endRe, n);
            if (i) {
              if (e[`on:end`]) {
                let n = new r(e);
                (e[`on:end`](t, n), n.isMatchIgnored && (i = !1));
              }
              if (i) {
                for (; e.endsParent && e.parent;) e = e.parent;
                return e;
              }
            }
            if (e.endsWithParent) return _(e.parent, t, n);
          }
          function y(e) {
            return A.matcher.regexIndex === 0 ? ((N += e[0]), 1) : ((ne = !0), 0);
          }
          function b(e) {
            let t = e[0],
              n = e.rule,
              i = new r(n),
              a = [n.__beforeBegin, n[`on:begin`]];
            for (let n of a) if (n && (n(e, i), i.isMatchIgnored)) return y(t);
            return (
              n.skip
                ? (N += t)
                : (n.excludeBegin && (N += t), p(), !n.returnBegin && !n.excludeBegin && (N = t)),
              g(n, e),
              n.returnBegin ? 0 : t.length
            );
          }
          function C(e) {
            let t = e[0],
              r = n.substring(e.index),
              i = _(A, e, r);
            if (!i) return je;
            let a = A;
            A.endScope && A.endScope._wrap
              ? (p(), m(t, A.endScope._wrap))
              : A.endScope && A.endScope._multi
                ? (p(), h(A.endScope, e))
                : a.skip
                  ? (N += t)
                  : (a.returnEnd || a.excludeEnd || (N += t), p(), a.excludeEnd && (N = t));
            do
              (A.scope && j.closeNode(),
                !A.skip && !A.subLanguage && (P += A.relevance),
                (A = A.parent));
            while (A !== i.parent);
            return (i.starts && g(i.starts, e), a.returnEnd ? 0 : t.length);
          }
          function w() {
            let e = [];
            for (let t = A; t !== D; t = t.parent) t.scope && e.unshift(t.scope);
            e.forEach((e) => j.openNode(e));
          }
          let T = {};
          function E(t, r) {
            let a = r && r[0];
            if (((N += t), a == null)) return (p(), 0);
            if (T.type === `begin` && r.type === `end` && T.index === r.index && a === ``) {
              if (((N += n.slice(r.index, r.index + 1)), !o)) {
                let t = Error(`0 width match regex (${e})`);
                throw ((t.languageName = e), (t.badRule = T.rule), t);
              }
              return 1;
            }
            if (((T = r), r.type === `begin`)) return b(r);
            if (r.type === `illegal` && !i) {
              let e = Error(
                `Illegal lexeme "` + a + `" for mode "` + (A.scope || `<unnamed>`) + `"`,
              );
              throw ((e.mode = A), e);
            } else if (r.type === `end`) {
              let e = C(r);
              if (e !== je) return e;
            }
            if (r.type === `illegal` && a === ``)
              return (
                (N += `
`),
                1
              );
            if (te > 1e5 && te > r.index * 3)
              throw Error(`potential infinite loop, way more iterations than matches`);
            return ((N += a), a.length);
          }
          let D = M(e);
          if (!D) throw (he(s.replace(`{}`, e)), Error(`Unknown language: "` + e + `"`));
          let O = we(D),
            k = ``,
            A = a || O,
            ee = {},
            j = new l.__emitter(l);
          w();
          let N = ``,
            P = 0,
            F = 0,
            te = 0,
            ne = !1;
          try {
            if (D.__emitTokens) D.__emitTokens(n, j);
            else {
              for (A.matcher.considerAll(); ;) {
                (te++, ne ? (ne = !1) : A.matcher.considerAll(), (A.matcher.lastIndex = F));
                let e = A.matcher.exec(n);
                if (!e) break;
                let t = E(n.substring(F, e.index), e);
                F = e.index + t;
              }
              E(n.substring(F));
            }
            return (
              j.finalize(),
              (k = j.toHTML()),
              { language: e, value: k, relevance: P, illegal: !1, _emitter: j, _top: A }
            );
          } catch (t) {
            if (t.message && t.message.includes(`Illegal`))
              return {
                language: e,
                value: ke(n),
                illegal: !0,
                relevance: 0,
                _illegalBy: {
                  message: t.message,
                  index: F,
                  context: n.slice(F - 100, F + 100),
                  mode: t.mode,
                  resultSoFar: k,
                },
                _emitter: j,
              };
            if (o)
              return {
                language: e,
                value: ke(n),
                illegal: !1,
                relevance: 0,
                errorRaised: t,
                _emitter: j,
                _top: A,
              };
            throw t;
          }
        }
        function b(e) {
          let t = {
            value: ke(e),
            illegal: !1,
            relevance: 0,
            _top: c,
            _emitter: new l.__emitter(l),
          };
          return (t._emitter.addText(e), t);
        }
        function S(e, n) {
          n = n || l.languages || Object.keys(t);
          let r = b(e),
            i = n
              .filter(M)
              .filter(P)
              .map((t) => v(t, e, !1));
          i.unshift(r);
          let [a, o] = i.sort((e, t) => {
              if (e.relevance !== t.relevance) return t.relevance - e.relevance;
              if (e.language && t.language) {
                if (M(e.language).supersetOf === t.language) return 1;
                if (M(t.language).supersetOf === e.language) return -1;
              }
              return 0;
            }),
            s = a;
          return ((s.secondBest = o), s);
        }
        function C(e, t, n) {
          let r = (t && i[t]) || n;
          (e.classList.add(`hljs`), e.classList.add(`language-${r}`));
        }
        function w(e) {
          let t = null,
            n = d(e);
          if (u(n)) return;
          if ((re(`before:highlightElement`, { el: e, language: n }), e.dataset.highlighted)) {
            console.log(
              "Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",
              e,
            );
            return;
          }
          if (
            e.children.length > 0 &&
            (l.ignoreUnescapedHTML ||
              (console.warn(
                `One of your code blocks includes unescaped HTML. This is a potentially serious security risk.`,
              ),
              console.warn(`https://github.com/highlightjs/highlight.js/wiki/security`),
              console.warn(`The element with unescaped HTML:`),
              console.warn(e)),
            l.throwUnescapedHTML)
          )
            throw new Oe(`One of your code blocks includes unescaped HTML.`, e.innerHTML);
          t = e;
          let r = t.textContent,
            i = n ? p(r, { language: n, ignoreIllegals: !0 }) : S(r);
          ((e.innerHTML = i.value),
            (e.dataset.highlighted = `yes`),
            C(e, n, i.language),
            (e.result = { language: i.language, re: i.relevance, relevance: i.relevance }),
            i.secondBest &&
              (e.secondBest = {
                language: i.secondBest.language,
                relevance: i.secondBest.relevance,
              }),
            re(`after:highlightElement`, { el: e, result: i, text: r }));
        }
        function T(e) {
          l = Ae(l, e);
        }
        let E = () => {
          (k(), _e(`10.6.0`, `initHighlighting() deprecated.  Use highlightAll() now.`));
        };
        function D() {
          (k(), _e(`10.6.0`, `initHighlightingOnLoad() deprecated.  Use highlightAll() now.`));
        }
        let O = !1;
        function k() {
          function e() {
            k();
          }
          if (document.readyState === `loading`) {
            (O || window.addEventListener(`DOMContentLoaded`, e, !1), (O = !0));
            return;
          }
          document.querySelectorAll(l.cssSelector).forEach(w);
        }
        function A(n, r) {
          let i = null;
          try {
            i = r(e);
          } catch (e) {
            if ((he(`Language definition for '{}' could not be registered.`.replace(`{}`, n)), o))
              he(e);
            else throw e;
            i = c;
          }
          ((i.name ||= n),
            (t[n] = i),
            (i.rawDefinition = r.bind(null, e)),
            i.aliases && N(i.aliases, { languageName: n }));
        }
        function ee(e) {
          delete t[e];
          for (let t of Object.keys(i)) i[t] === e && delete i[t];
        }
        function j() {
          return Object.keys(t);
        }
        function M(e) {
          return ((e = (e || ``).toLowerCase()), t[e] || t[i[e]]);
        }
        function N(e, { languageName: t }) {
          (typeof e == `string` && (e = [e]),
            e.forEach((e) => {
              i[e.toLowerCase()] = t;
            }));
        }
        function P(e) {
          let t = M(e);
          return t && !t.disableAutodetect;
        }
        function F(e) {
          (e[`before:highlightBlock`] &&
            !e[`before:highlightElement`] &&
            (e[`before:highlightElement`] = (t) => {
              e[`before:highlightBlock`](Object.assign({ block: t.el }, t));
            }),
            e[`after:highlightBlock`] &&
              !e[`after:highlightElement`] &&
              (e[`after:highlightElement`] = (t) => {
                e[`after:highlightBlock`](Object.assign({ block: t.el }, t));
              }));
        }
        function te(e) {
          (F(e), a.push(e));
        }
        function ne(e) {
          let t = a.indexOf(e);
          t !== -1 && a.splice(t, 1);
        }
        function re(e, t) {
          let n = e;
          a.forEach(function (e) {
            e[n] && e[n](t);
          });
        }
        function ae(e) {
          return (
            _e(`10.7.0`, `highlightBlock will be removed entirely in v12.0`),
            _e(`10.7.0`, `Please use highlightElement now.`),
            w(e)
          );
        }
        (Object.assign(e, {
          highlight: p,
          highlightAuto: S,
          highlightAll: k,
          highlightElement: w,
          highlightBlock: ae,
          configure: T,
          initHighlighting: E,
          initHighlightingOnLoad: D,
          registerLanguage: A,
          unregisterLanguage: ee,
          listLanguages: j,
          getLanguage: M,
          registerAliases: N,
          autoDetection: P,
          inherit: Ae,
          addPlugin: te,
          removePlugin: ne,
        }),
          (e.debugMode = function () {
            o = !1;
          }),
          (e.safeMode = function () {
            o = !0;
          }),
          (e.versionString = De),
          (e.regex = { concat: _, lookahead: m, either: y, optional: g, anyNumberOfTimes: h }));
        for (let e in ie) typeof ie[e] == `object` && n(ie[e]);
        return (Object.assign(e, ie), e);
      },
      Pe = Ne({});
    ((Pe.newInstance = () => Ne({})), (t.exports = Pe), (Pe.HighlightJS = Pe), (Pe.default = Pe));
  }),
  We,
  Ge,
  Ke = t(() => {
    ((We = e(Ue())), (Ge = We.default));
  });
function qe(e) {
  let t = e.regex,
    n = {},
    r = { begin: /\$\{/, end: /\}/, contains: [`self`, { begin: /:-/, contains: [n] }] };
  Object.assign(n, {
    className: `variable`,
    variants: [{ begin: t.concat(/\$[\w\d#@][\w\d_]*/, `(?![\\w\\d])(?![$])`) }, r],
  });
  let i = { className: `subst`, begin: /\$\(/, end: /\)/, contains: [e.BACKSLASH_ESCAPE] },
    a = e.inherit(e.COMMENT(), { match: [/(^|\s)/, /#.*$/], scope: { 2: `comment` } }),
    o = {
      begin: /<<-?\s*(?=\w+)/,
      starts: {
        contains: [e.END_SAME_AS_BEGIN({ begin: /(\w+)/, end: /(\w+)/, className: `string` })],
      },
    },
    s = { className: `string`, begin: /"/, end: /"/, contains: [e.BACKSLASH_ESCAPE, n, i] };
  i.contains.push(s);
  let c = { match: /\\"/ },
    l = { className: `string`, begin: /'/, end: /'/ },
    u = { match: /\\'/ },
    d = {
      begin: /\$?\(\(/,
      end: /\)\)/,
      contains: [{ begin: /\d+#[0-9a-f]+/, className: `number` }, e.NUMBER_MODE, n],
    },
    f = e.SHEBANG({
      binary: `(${[`fish`, `bash`, `zsh`, `sh`, `csh`, `ksh`, `tcsh`, `dash`, `scsh`].join(`|`)})`,
      relevance: 10,
    }),
    p = {
      className: `function`,
      begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
      returnBegin: !0,
      contains: [e.inherit(e.TITLE_MODE, { begin: /\w[\w\d_]*/ })],
      relevance: 0,
    },
    m = [
      `if`,
      `then`,
      `else`,
      `elif`,
      `fi`,
      `time`,
      `for`,
      `while`,
      `until`,
      `in`,
      `do`,
      `done`,
      `case`,
      `esac`,
      `coproc`,
      `function`,
      `select`,
    ],
    h = [`true`, `false`],
    g = { match: /(\/[a-z._-]+)+/ },
    _ = [
      `break`,
      `cd`,
      `continue`,
      `eval`,
      `exec`,
      `exit`,
      `export`,
      `getopts`,
      `hash`,
      `pwd`,
      `readonly`,
      `return`,
      `shift`,
      `test`,
      `times`,
      `trap`,
      `umask`,
      `unset`,
    ],
    v = [
      `alias`,
      `bind`,
      `builtin`,
      `caller`,
      `command`,
      `declare`,
      `echo`,
      `enable`,
      `help`,
      `let`,
      `local`,
      `logout`,
      `mapfile`,
      `printf`,
      `read`,
      `readarray`,
      `source`,
      `sudo`,
      `type`,
      `typeset`,
      `ulimit`,
      `unalias`,
    ],
    y =
      `autoload.bg.bindkey.bye.cap.chdir.clone.comparguments.compcall.compctl.compdescribe.compfiles.compgroups.compquote.comptags.comptry.compvalues.dirs.disable.disown.echotc.echoti.emulate.fc.fg.float.functions.getcap.getln.history.integer.jobs.kill.limit.log.noglob.popd.print.pushd.pushln.rehash.sched.setcap.setopt.stat.suspend.ttyctl.unfunction.unhash.unlimit.unsetopt.vared.wait.whence.where.which.zcompile.zformat.zftp.zle.zmodload.zparseopts.zprof.zpty.zregexparse.zsocket.zstyle.ztcp`.split(
        `.`,
      ),
    b =
      `chcon.chgrp.chown.chmod.cp.dd.df.dir.dircolors.ln.ls.mkdir.mkfifo.mknod.mktemp.mv.realpath.rm.rmdir.shred.sync.touch.truncate.vdir.b2sum.base32.base64.cat.cksum.comm.csplit.cut.expand.fmt.fold.head.join.md5sum.nl.numfmt.od.paste.ptx.pr.sha1sum.sha224sum.sha256sum.sha384sum.sha512sum.shuf.sort.split.sum.tac.tail.tr.tsort.unexpand.uniq.wc.arch.basename.chroot.date.dirname.du.echo.env.expr.factor.groups.hostid.id.link.logname.nice.nohup.nproc.pathchk.pinky.printenv.printf.pwd.readlink.runcon.seq.sleep.stat.stdbuf.stty.tee.test.timeout.tty.uname.unlink.uptime.users.who.whoami.yes`.split(
        `.`,
      );
  return {
    name: `Bash`,
    aliases: [`sh`, `zsh`],
    keywords: {
      $pattern: /\b[a-z][a-z0-9._-]+\b/,
      keyword: m,
      literal: h,
      built_in: [..._, ...v, `set`, `shopt`, ...y, ...b],
    },
    contains: [f, e.SHEBANG(), p, d, a, o, g, s, c, l, u, n],
  };
}
var Je = t(() => {});
function Ye(e) {
  let t = e.regex,
    n = e.COMMENT(`//`, `$`, { contains: [{ begin: /\\\n/ }] }),
    r = `[a-zA-Z_]\\w*::`,
    i =
      `(?!struct)(decltype\\(auto\\)|` +
      t.optional(r) +
      `[a-zA-Z_]\\w*` +
      t.optional(`<[^<>]+>`) +
      `)`,
    a = { className: `type`, begin: `\\b[a-z\\d_]*_t\\b` },
    o = {
      className: `string`,
      variants: [
        { begin: `(u8?|U|L)?"`, end: `"`, illegal: `\\n`, contains: [e.BACKSLASH_ESCAPE] },
        {
          begin: `(u8?|U|L)?'(\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)|.)`,
          end: `'`,
          illegal: `.`,
        },
        e.END_SAME_AS_BEGIN({
          begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,
          end: /\)([^()\\ ]{0,16})"/,
        }),
      ],
    },
    s = {
      className: `number`,
      variants: [
        {
          begin: `[+-]?(?:(?:[0-9](?:'?[0-9])*\\.(?:[0-9](?:'?[0-9])*)?|\\.[0-9](?:'?[0-9])*)(?:[Ee][+-]?[0-9](?:'?[0-9])*)?|[0-9](?:'?[0-9])*[Ee][+-]?[0-9](?:'?[0-9])*|0[Xx](?:[0-9A-Fa-f](?:'?[0-9A-Fa-f])*(?:\\.(?:[0-9A-Fa-f](?:'?[0-9A-Fa-f])*)?)?|\\.[0-9A-Fa-f](?:'?[0-9A-Fa-f])*)[Pp][+-]?[0-9](?:'?[0-9])*)(?:[Ff](?:16|32|64|128)?|(BF|bf)16|[Ll]|)`,
        },
        {
          begin: `[+-]?\\b(?:0[Bb][01](?:'?[01])*|0[Xx][0-9A-Fa-f](?:'?[0-9A-Fa-f])*|0(?:'?[0-7])*|[1-9](?:'?[0-9])*)(?:[Uu](?:LL?|ll?)|[Uu][Zz]?|(?:LL?|ll?)[Uu]?|[Zz][Uu]|)`,
        },
      ],
      relevance: 0,
    },
    c = {
      className: `meta`,
      begin: /#\s*[a-z]+\b/,
      end: /$/,
      keywords: {
        keyword: `if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include`,
      },
      contains: [
        { begin: /\\\n/, relevance: 0 },
        e.inherit(o, { className: `string` }),
        { className: `string`, begin: /<.*?>/ },
        n,
        e.C_BLOCK_COMMENT_MODE,
      ],
    },
    l = { className: `title`, begin: t.optional(r) + e.IDENT_RE, relevance: 0 },
    u = t.optional(r) + e.IDENT_RE + `\\s*\\(`,
    d =
      `alignas.alignof.and.and_eq.asm.atomic_cancel.atomic_commit.atomic_noexcept.auto.bitand.bitor.break.case.catch.class.co_await.co_return.co_yield.compl.concept.const_cast|10.consteval.constexpr.constinit.continue.decltype.default.delete.do.dynamic_cast|10.else.enum.explicit.export.extern.false.final.for.friend.goto.if.import.inline.module.mutable.namespace.new.noexcept.not.not_eq.nullptr.operator.or.or_eq.override.private.protected.public.reflexpr.register.reinterpret_cast|10.requires.return.sizeof.static_assert.static_cast|10.struct.switch.synchronized.template.this.thread_local.throw.transaction_safe.transaction_safe_dynamic.true.try.typedef.typeid.typename.union.using.virtual.volatile.while.xor.xor_eq`.split(
        `.`,
      ),
    f = [
      `bool`,
      `char`,
      `char16_t`,
      `char32_t`,
      `char8_t`,
      `double`,
      `float`,
      `int`,
      `long`,
      `short`,
      `void`,
      `wchar_t`,
      `unsigned`,
      `signed`,
      `const`,
      `static`,
    ],
    p =
      `any.auto_ptr.barrier.binary_semaphore.bitset.complex.condition_variable.condition_variable_any.counting_semaphore.deque.false_type.flat_map.flat_set.future.imaginary.initializer_list.istringstream.jthread.latch.lock_guard.multimap.multiset.mutex.optional.ostringstream.packaged_task.pair.promise.priority_queue.queue.recursive_mutex.recursive_timed_mutex.scoped_lock.set.shared_future.shared_lock.shared_mutex.shared_timed_mutex.shared_ptr.stack.string_view.stringstream.timed_mutex.thread.true_type.tuple.unique_lock.unique_ptr.unordered_map.unordered_multimap.unordered_multiset.unordered_set.variant.vector.weak_ptr.wstring.wstring_view`.split(
        `.`,
      ),
    m =
      `abort.abs.acos.apply.as_const.asin.atan.atan2.calloc.ceil.cerr.cin.clog.cos.cosh.cout.declval.endl.exchange.exit.exp.fabs.floor.fmod.forward.fprintf.fputs.free.frexp.fscanf.future.invoke.isalnum.isalpha.iscntrl.isdigit.isgraph.islower.isprint.ispunct.isspace.isupper.isxdigit.labs.launder.ldexp.log.log10.make_pair.make_shared.make_shared_for_overwrite.make_tuple.make_unique.malloc.memchr.memcmp.memcpy.memset.modf.move.pow.printf.putchar.puts.realloc.scanf.sin.sinh.snprintf.sprintf.sqrt.sscanf.std.stderr.stdin.stdout.strcat.strchr.strcmp.strcpy.strcspn.strlen.strncat.strncmp.strncpy.strpbrk.strrchr.strspn.strstr.swap.tan.tanh.terminate.to_underlying.tolower.toupper.vfprintf.visit.vprintf.vsprintf`.split(
        `.`,
      ),
    h = {
      type: f,
      keyword: d,
      literal: [`NULL`, `false`, `nullopt`, `nullptr`, `true`],
      built_in: [`_Pragma`],
      _type_hints: p,
    },
    g = {
      className: `function.dispatch`,
      relevance: 0,
      keywords: { _hint: m },
      begin: t.concat(
        /\b/,
        /(?!decltype)/,
        /(?!if)/,
        /(?!for)/,
        /(?!switch)/,
        /(?!while)/,
        e.IDENT_RE,
        t.lookahead(/(<[^<>]+>|)\s*\(/),
      ),
    },
    _ = [g, c, a, n, e.C_BLOCK_COMMENT_MODE, s, o],
    v = {
      variants: [
        { begin: /=/, end: /;/ },
        { begin: /\(/, end: /\)/ },
        { beginKeywords: `new throw return else`, end: /;/ },
      ],
      keywords: h,
      contains: _.concat([
        { begin: /\(/, end: /\)/, keywords: h, contains: _.concat([`self`]), relevance: 0 },
      ]),
      relevance: 0,
    },
    y = {
      className: `function`,
      begin: `(` + i + `[\\*&\\s]+)+` + u,
      returnBegin: !0,
      end: /[{;=]/,
      excludeEnd: !0,
      keywords: h,
      illegal: /[^\w\s\*&:<>.]/,
      contains: [
        { begin: `decltype\\(auto\\)`, keywords: h, relevance: 0 },
        { begin: u, returnBegin: !0, contains: [l], relevance: 0 },
        { begin: /::/, relevance: 0 },
        { begin: /:/, endsWithParent: !0, contains: [o, s] },
        { relevance: 0, match: /,/ },
        {
          className: `params`,
          begin: /\(/,
          end: /\)/,
          keywords: h,
          relevance: 0,
          contains: [
            n,
            e.C_BLOCK_COMMENT_MODE,
            o,
            s,
            a,
            {
              begin: /\(/,
              end: /\)/,
              keywords: h,
              relevance: 0,
              contains: [`self`, n, e.C_BLOCK_COMMENT_MODE, o, s, a],
            },
          ],
        },
        a,
        n,
        e.C_BLOCK_COMMENT_MODE,
        c,
      ],
    };
  return {
    name: `C++`,
    aliases: [`cc`, `c++`, `h++`, `hpp`, `hh`, `hxx`, `cxx`],
    keywords: h,
    illegal: `</`,
    classNameAliases: { "function.dispatch": `built_in` },
    contains: [].concat(v, y, g, _, [
      c,
      {
        begin: `\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array|tuple|optional|variant|function|flat_map|flat_set)\\s*<(?!<)`,
        end: `>`,
        keywords: h,
        contains: [`self`, a],
      },
      { begin: e.IDENT_RE + `::`, keywords: h },
      {
        match: [/\b(?:enum(?:\s+(?:class|struct))?|class|struct|union)/, /\s+/, /\w+/],
        className: { 1: `keyword`, 3: `title.class` },
      },
    ]),
  };
}
var Xe = t(() => {});
function Ze(e) {
  let t = e.regex,
    n = z(e),
    r = { begin: /-(webkit|moz|ms|o)-(?=[a-z])/ },
    i = /@-?\w[\w]*(-\w+)*/,
    a = [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE];
  return {
    name: `CSS`,
    case_insensitive: !0,
    illegal: /[=|'\$]/,
    keywords: { keyframePosition: `from to` },
    classNameAliases: { keyframePosition: `selector-tag` },
    contains: [
      n.BLOCK_COMMENT,
      r,
      n.CSS_NUMBER_MODE,
      { className: `selector-id`, begin: /#[A-Za-z0-9_-]+/, relevance: 0 },
      { className: `selector-class`, begin: `\\.[a-zA-Z-][a-zA-Z0-9_-]*`, relevance: 0 },
      n.ATTRIBUTE_SELECTOR_MODE,
      {
        className: `selector-pseudo`,
        variants: [{ begin: `:(` + nt.join(`|`) + `)` }, { begin: `:(:)?(` + rt.join(`|`) + `)` }],
      },
      n.CSS_VARIABLE,
      { className: `attribute`, begin: `\\b(` + it.join(`|`) + `)\\b` },
      {
        begin: /:/,
        end: /[;}{]/,
        contains: [
          n.BLOCK_COMMENT,
          n.HEXCOLOR,
          n.IMPORTANT,
          n.CSS_NUMBER_MODE,
          ...a,
          {
            begin: /(url|data-uri)\(/,
            end: /\)/,
            relevance: 0,
            keywords: { built_in: `url data-uri` },
            contains: [
              ...a,
              { className: `string`, begin: /[^)]/, endsWithParent: !0, excludeEnd: !0 },
            ],
          },
          n.FUNCTION_DISPATCH,
        ],
      },
      {
        begin: t.lookahead(/@/),
        end: `[{;]`,
        relevance: 0,
        illegal: /:/,
        contains: [
          { className: `keyword`, begin: i },
          {
            begin: /\s/,
            endsWithParent: !0,
            excludeEnd: !0,
            relevance: 0,
            keywords: { $pattern: /[a-z-]+/, keyword: `and or not only`, attribute: tt.join(` `) },
            contains: [{ begin: /[a-z-]+(?=:)/, className: `attribute` }, ...a, n.CSS_NUMBER_MODE],
          },
        ],
      },
      { className: `selector-tag`, begin: `\\b(` + et.join(`|`) + `)\\b` },
    ],
  };
}
var z,
  Qe,
  $e,
  et,
  tt,
  nt,
  rt,
  it,
  at = t(() => {
    ((z = (e) => ({
      IMPORTANT: { scope: `meta`, begin: `!important` },
      BLOCK_COMMENT: e.C_BLOCK_COMMENT_MODE,
      HEXCOLOR: { scope: `number`, begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/ },
      FUNCTION_DISPATCH: { className: `built_in`, begin: /[\w-]+(?=\()/ },
      ATTRIBUTE_SELECTOR_MODE: {
        scope: `selector-attr`,
        begin: /\[/,
        end: /\]/,
        illegal: `$`,
        contains: [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE],
      },
      CSS_NUMBER_MODE: {
        scope: `number`,
        begin:
          e.NUMBER_RE +
          `(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?`,
        relevance: 0,
      },
      CSS_VARIABLE: { className: `attr`, begin: /--[A-Za-z_][A-Za-z0-9_-]*/ },
    })),
      (Qe =
        `a.abbr.address.article.aside.audio.b.blockquote.body.button.canvas.caption.cite.code.dd.del.details.dfn.div.dl.dt.em.fieldset.figcaption.figure.footer.form.h1.h2.h3.h4.h5.h6.header.hgroup.html.i.iframe.img.input.ins.kbd.label.legend.li.main.mark.menu.nav.object.ol.optgroup.option.p.picture.q.quote.samp.section.select.source.span.strong.summary.sup.table.tbody.td.textarea.tfoot.th.thead.time.tr.ul.var.video`.split(
          `.`,
        )),
      ($e =
        `defs.g.marker.mask.pattern.svg.switch.symbol.feBlend.feColorMatrix.feComponentTransfer.feComposite.feConvolveMatrix.feDiffuseLighting.feDisplacementMap.feFlood.feGaussianBlur.feImage.feMerge.feMorphology.feOffset.feSpecularLighting.feTile.feTurbulence.linearGradient.radialGradient.stop.circle.ellipse.image.line.path.polygon.polyline.rect.text.use.textPath.tspan.foreignObject.clipPath`.split(
          `.`,
        )),
      (et = [...Qe, ...$e]),
      (tt =
        `any-hover.any-pointer.aspect-ratio.color.color-gamut.color-index.device-aspect-ratio.device-height.device-width.display-mode.forced-colors.grid.height.hover.inverted-colors.monochrome.orientation.overflow-block.overflow-inline.pointer.prefers-color-scheme.prefers-contrast.prefers-reduced-motion.prefers-reduced-transparency.resolution.scan.scripting.update.width.min-width.max-width.min-height.max-height`
          .split(`.`)
          .sort()
          .reverse()),
      (nt =
        `active.any-link.blank.checked.current.default.defined.dir.disabled.drop.empty.enabled.first.first-child.first-of-type.fullscreen.future.focus.focus-visible.focus-within.has.host.host-context.hover.indeterminate.in-range.invalid.is.lang.last-child.last-of-type.left.link.local-link.not.nth-child.nth-col.nth-last-child.nth-last-col.nth-last-of-type.nth-of-type.only-child.only-of-type.optional.out-of-range.past.placeholder-shown.read-only.read-write.required.right.root.scope.target.target-within.user-invalid.valid.visited.where`
          .split(`.`)
          .sort()
          .reverse()),
      (rt = [
        `after`,
        `backdrop`,
        `before`,
        `cue`,
        `cue-region`,
        `first-letter`,
        `first-line`,
        `grammar-error`,
        `marker`,
        `part`,
        `placeholder`,
        `selection`,
        `slotted`,
        `spelling-error`,
      ]
        .sort()
        .reverse()),
      (it =
        `accent-color.align-content.align-items.align-self.alignment-baseline.all.anchor-name.animation.animation-composition.animation-delay.animation-direction.animation-duration.animation-fill-mode.animation-iteration-count.animation-name.animation-play-state.animation-range.animation-range-end.animation-range-start.animation-timeline.animation-timing-function.appearance.aspect-ratio.backdrop-filter.backface-visibility.background.background-attachment.background-blend-mode.background-clip.background-color.background-image.background-origin.background-position.background-position-x.background-position-y.background-repeat.background-size.baseline-shift.block-size.border.border-block.border-block-color.border-block-end.border-block-end-color.border-block-end-style.border-block-end-width.border-block-start.border-block-start-color.border-block-start-style.border-block-start-width.border-block-style.border-block-width.border-bottom.border-bottom-color.border-bottom-left-radius.border-bottom-right-radius.border-bottom-style.border-bottom-width.border-collapse.border-color.border-end-end-radius.border-end-start-radius.border-image.border-image-outset.border-image-repeat.border-image-slice.border-image-source.border-image-width.border-inline.border-inline-color.border-inline-end.border-inline-end-color.border-inline-end-style.border-inline-end-width.border-inline-start.border-inline-start-color.border-inline-start-style.border-inline-start-width.border-inline-style.border-inline-width.border-left.border-left-color.border-left-style.border-left-width.border-radius.border-right.border-right-color.border-right-style.border-right-width.border-spacing.border-start-end-radius.border-start-start-radius.border-style.border-top.border-top-color.border-top-left-radius.border-top-right-radius.border-top-style.border-top-width.border-width.bottom.box-align.box-decoration-break.box-direction.box-flex.box-flex-group.box-lines.box-ordinal-group.box-orient.box-pack.box-shadow.box-sizing.break-after.break-before.break-inside.caption-side.caret-color.clear.clip.clip-path.clip-rule.color.color-interpolation.color-interpolation-filters.color-profile.color-rendering.color-scheme.column-count.column-fill.column-gap.column-rule.column-rule-color.column-rule-style.column-rule-width.column-span.column-width.columns.contain.contain-intrinsic-block-size.contain-intrinsic-height.contain-intrinsic-inline-size.contain-intrinsic-size.contain-intrinsic-width.container.container-name.container-type.content.content-visibility.counter-increment.counter-reset.counter-set.cue.cue-after.cue-before.cursor.cx.cy.direction.display.dominant-baseline.empty-cells.enable-background.field-sizing.fill.fill-opacity.fill-rule.filter.flex.flex-basis.flex-direction.flex-flow.flex-grow.flex-shrink.flex-wrap.float.flood-color.flood-opacity.flow.font.font-display.font-family.font-feature-settings.font-kerning.font-language-override.font-optical-sizing.font-palette.font-size.font-size-adjust.font-smooth.font-smoothing.font-stretch.font-style.font-synthesis.font-synthesis-position.font-synthesis-small-caps.font-synthesis-style.font-synthesis-weight.font-variant.font-variant-alternates.font-variant-caps.font-variant-east-asian.font-variant-emoji.font-variant-ligatures.font-variant-numeric.font-variant-position.font-variation-settings.font-weight.forced-color-adjust.gap.glyph-orientation-horizontal.glyph-orientation-vertical.grid.grid-area.grid-auto-columns.grid-auto-flow.grid-auto-rows.grid-column.grid-column-end.grid-column-start.grid-gap.grid-row.grid-row-end.grid-row-start.grid-template.grid-template-areas.grid-template-columns.grid-template-rows.hanging-punctuation.height.hyphenate-character.hyphenate-limit-chars.hyphens.icon.image-orientation.image-rendering.image-resolution.ime-mode.initial-letter.initial-letter-align.inline-size.inset.inset-area.inset-block.inset-block-end.inset-block-start.inset-inline.inset-inline-end.inset-inline-start.isolation.justify-content.justify-items.justify-self.kerning.left.letter-spacing.lighting-color.line-break.line-height.line-height-step.list-style.list-style-image.list-style-position.list-style-type.margin.margin-block.margin-block-end.margin-block-start.margin-bottom.margin-inline.margin-inline-end.margin-inline-start.margin-left.margin-right.margin-top.margin-trim.marker.marker-end.marker-mid.marker-start.marks.mask.mask-border.mask-border-mode.mask-border-outset.mask-border-repeat.mask-border-slice.mask-border-source.mask-border-width.mask-clip.mask-composite.mask-image.mask-mode.mask-origin.mask-position.mask-repeat.mask-size.mask-type.masonry-auto-flow.math-depth.math-shift.math-style.max-block-size.max-height.max-inline-size.max-width.min-block-size.min-height.min-inline-size.min-width.mix-blend-mode.nav-down.nav-index.nav-left.nav-right.nav-up.none.normal.object-fit.object-position.offset.offset-anchor.offset-distance.offset-path.offset-position.offset-rotate.opacity.order.orphans.outline.outline-color.outline-offset.outline-style.outline-width.overflow.overflow-anchor.overflow-block.overflow-clip-margin.overflow-inline.overflow-wrap.overflow-x.overflow-y.overlay.overscroll-behavior.overscroll-behavior-block.overscroll-behavior-inline.overscroll-behavior-x.overscroll-behavior-y.padding.padding-block.padding-block-end.padding-block-start.padding-bottom.padding-inline.padding-inline-end.padding-inline-start.padding-left.padding-right.padding-top.page.page-break-after.page-break-before.page-break-inside.paint-order.pause.pause-after.pause-before.perspective.perspective-origin.place-content.place-items.place-self.pointer-events.position.position-anchor.position-visibility.print-color-adjust.quotes.r.resize.rest.rest-after.rest-before.right.rotate.row-gap.ruby-align.ruby-position.scale.scroll-behavior.scroll-margin.scroll-margin-block.scroll-margin-block-end.scroll-margin-block-start.scroll-margin-bottom.scroll-margin-inline.scroll-margin-inline-end.scroll-margin-inline-start.scroll-margin-left.scroll-margin-right.scroll-margin-top.scroll-padding.scroll-padding-block.scroll-padding-block-end.scroll-padding-block-start.scroll-padding-bottom.scroll-padding-inline.scroll-padding-inline-end.scroll-padding-inline-start.scroll-padding-left.scroll-padding-right.scroll-padding-top.scroll-snap-align.scroll-snap-stop.scroll-snap-type.scroll-timeline.scroll-timeline-axis.scroll-timeline-name.scrollbar-color.scrollbar-gutter.scrollbar-width.shape-image-threshold.shape-margin.shape-outside.shape-rendering.speak.speak-as.src.stop-color.stop-opacity.stroke.stroke-dasharray.stroke-dashoffset.stroke-linecap.stroke-linejoin.stroke-miterlimit.stroke-opacity.stroke-width.tab-size.table-layout.text-align.text-align-all.text-align-last.text-anchor.text-combine-upright.text-decoration.text-decoration-color.text-decoration-line.text-decoration-skip.text-decoration-skip-ink.text-decoration-style.text-decoration-thickness.text-emphasis.text-emphasis-color.text-emphasis-position.text-emphasis-style.text-indent.text-justify.text-orientation.text-overflow.text-rendering.text-shadow.text-size-adjust.text-transform.text-underline-offset.text-underline-position.text-wrap.text-wrap-mode.text-wrap-style.timeline-scope.top.touch-action.transform.transform-box.transform-origin.transform-style.transition.transition-behavior.transition-delay.transition-duration.transition-property.transition-timing-function.translate.unicode-bidi.user-modify.user-select.vector-effect.vertical-align.view-timeline.view-timeline-axis.view-timeline-inset.view-timeline-name.view-transition-name.visibility.voice-balance.voice-duration.voice-family.voice-pitch.voice-range.voice-rate.voice-stress.voice-volume.white-space.white-space-collapse.widows.width.will-change.word-break.word-spacing.word-wrap.writing-mode.x.y.z-index.zoom`
          .split(`.`)
          .sort()
          .reverse()));
  });
function ot(e) {
  let t = e.regex;
  return {
    name: `Diff`,
    aliases: [`patch`],
    contains: [
      {
        className: `meta`,
        relevance: 10,
        match: t.either(
          /^@@ +-\d+,\d+ +\+\d+,\d+ +@@/,
          /^\*\*\* +\d+,\d+ +\*\*\*\*$/,
          /^--- +\d+,\d+ +----$/,
        ),
      },
      {
        className: `comment`,
        variants: [
          {
            begin: t.either(
              /Index: /,
              /^index/,
              /={3,}/,
              /^-{3}/,
              /^\*{3} /,
              /^\+{3}/,
              /^diff --git/,
            ),
            end: /$/,
          },
          { match: /^\*{15}$/ },
        ],
      },
      { className: `addition`, begin: /^\+/, end: /$/ },
      { className: `deletion`, begin: /^-/, end: /$/ },
      { className: `addition`, begin: /^!/, end: /$/ },
    ],
  };
}
var B = t(() => {});
function st(e) {
  let t = {
    keyword: [
      `break`,
      `case`,
      `chan`,
      `const`,
      `continue`,
      `default`,
      `defer`,
      `else`,
      `fallthrough`,
      `for`,
      `func`,
      `go`,
      `goto`,
      `if`,
      `import`,
      `interface`,
      `map`,
      `package`,
      `range`,
      `return`,
      `select`,
      `struct`,
      `switch`,
      `type`,
      `var`,
    ],
    type: [
      `bool`,
      `byte`,
      `complex64`,
      `complex128`,
      `error`,
      `float32`,
      `float64`,
      `int8`,
      `int16`,
      `int32`,
      `int64`,
      `string`,
      `uint8`,
      `uint16`,
      `uint32`,
      `uint64`,
      `int`,
      `uint`,
      `uintptr`,
      `rune`,
    ],
    literal: [`true`, `false`, `iota`, `nil`],
    built_in: [
      `append`,
      `cap`,
      `close`,
      `complex`,
      `copy`,
      `imag`,
      `len`,
      `make`,
      `new`,
      `panic`,
      `print`,
      `println`,
      `real`,
      `recover`,
      `delete`,
    ],
  };
  return {
    name: `Go`,
    aliases: [`golang`],
    keywords: t,
    illegal: `</`,
    contains: [
      e.C_LINE_COMMENT_MODE,
      e.C_BLOCK_COMMENT_MODE,
      {
        className: `string`,
        variants: [e.QUOTE_STRING_MODE, e.APOS_STRING_MODE, { begin: "`", end: "`" }],
      },
      {
        className: `number`,
        variants: [
          { match: /-?\b0[xX]\.[a-fA-F0-9](_?[a-fA-F0-9])*[pP][+-]?\d(_?\d)*i?/, relevance: 0 },
          {
            match:
              /-?\b0[xX](_?[a-fA-F0-9])+((\.([a-fA-F0-9](_?[a-fA-F0-9])*)?)?[pP][+-]?\d(_?\d)*)?i?/,
            relevance: 0,
          },
          { match: /-?\b0[oO](_?[0-7])*i?/, relevance: 0 },
          { match: /-?\.\d(_?\d)*([eE][+-]?\d(_?\d)*)?i?/, relevance: 0 },
          { match: /-?\b\d(_?\d)*(\.(\d(_?\d)*)?)?([eE][+-]?\d(_?\d)*)?i?/, relevance: 0 },
        ],
      },
      { begin: /:=/ },
      {
        className: `function`,
        beginKeywords: `func`,
        end: `\\s*(\\{|$)`,
        excludeEnd: !0,
        contains: [
          e.TITLE_MODE,
          {
            className: `params`,
            begin: /\(/,
            end: /\)/,
            endsParent: !0,
            keywords: t,
            illegal: /["']/,
          },
        ],
      },
    ],
  };
}
var V = t(() => {});
function ct(e, t, n) {
  return n === -1 ? `` : e.replace(t, (r) => ct(e, t, n - 1));
}
function H(e) {
  let t = e.regex,
    n = `[À-ʸa-zA-Z_$][À-ʸa-zA-Z_$0-9]*`,
    r =
      n +
      ct(
        `(?:<[À-ʸa-zA-Z_$][À-ʸa-zA-Z_$0-9]*~~~(?:\\s*,\\s*[À-ʸa-zA-Z_$][À-ʸa-zA-Z_$0-9]*~~~)*>)?`,
        /~~~/g,
        2,
      ),
    i = {
      keyword:
        `synchronized.abstract.private.var.static.if.const .for.while.strictfp.finally.protected.import.native.final.void.enum.else.break.transient.catch.instanceof.volatile.case.assert.package.default.public.try.switch.continue.throws.protected.public.private.module.requires.exports.do.sealed.yield.permits.goto.when`.split(
          `.`,
        ),
      literal: [`false`, `true`, `null`],
      type: [`char`, `boolean`, `long`, `float`, `int`, `byte`, `short`, `double`],
      built_in: [`super`, `this`],
    },
    a = {
      className: `meta`,
      begin: `@[À-ʸa-zA-Z_$][À-ʸa-zA-Z_$0-9]*`,
      contains: [{ begin: /\(/, end: /\)/, contains: [`self`] }],
    },
    o = {
      className: `params`,
      begin: /\(/,
      end: /\)/,
      keywords: i,
      relevance: 0,
      contains: [e.C_BLOCK_COMMENT_MODE],
      endsParent: !0,
    };
  return {
    name: `Java`,
    aliases: [`jsp`],
    keywords: i,
    illegal: /<\/|#/,
    contains: [
      e.COMMENT(`/\\*\\*`, `\\*/`, {
        relevance: 0,
        contains: [
          { begin: /\w+@/, relevance: 0 },
          { className: `doctag`, begin: `@[A-Za-z]+` },
        ],
      }),
      { begin: /import java\.[a-z]+\./, keywords: `import`, relevance: 2 },
      e.C_LINE_COMMENT_MODE,
      e.C_BLOCK_COMMENT_MODE,
      { begin: /"""/, end: /"""/, className: `string`, contains: [e.BACKSLASH_ESCAPE] },
      e.APOS_STRING_MODE,
      e.QUOTE_STRING_MODE,
      {
        match: [/\b(?:class|interface|enum|extends|implements|new)/, /\s+/, n],
        className: { 1: `keyword`, 3: `title.class` },
      },
      { match: /non-sealed/, scope: `keyword` },
      {
        begin: [t.concat(/(?!else)/, n), /\s+/, n, /\s+/, /=(?!=)/],
        className: { 1: `type`, 3: `variable`, 5: `operator` },
      },
      {
        begin: [/record/, /\s+/, n],
        className: { 1: `keyword`, 3: `title.class` },
        contains: [o, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE],
      },
      { beginKeywords: `new throw return else`, relevance: 0 },
      {
        begin: [`(?:` + r + `\\s+)`, e.UNDERSCORE_IDENT_RE, /\s*(?=\()/],
        className: { 2: `title.function` },
        keywords: i,
        contains: [
          {
            className: `params`,
            begin: /\(/,
            end: /\)/,
            keywords: i,
            relevance: 0,
            contains: [a, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, ut, e.C_BLOCK_COMMENT_MODE],
          },
          e.C_LINE_COMMENT_MODE,
          e.C_BLOCK_COMMENT_MODE,
        ],
      },
      ut,
      a,
    ],
  };
}
var U,
  lt,
  W,
  ut,
  dt = t(() => {
    ((U = `[0-9](_*[0-9])*`),
      (lt = `\\.(${U})`),
      (W = `[0-9a-fA-F](_*[0-9a-fA-F])*`),
      (ut = {
        className: `number`,
        variants: [
          { begin: `(\\b(${U})((${lt})|\\.)?|(${lt}))[eE][+-]?(${U})[fFdD]?\\b` },
          { begin: `\\b(${U})((${lt})[fFdD]?\\b|\\.([fFdD]\\b)?)` },
          { begin: `(${lt})[fFdD]?\\b` },
          { begin: `\\b(${U})[fFdD]\\b` },
          { begin: `\\b0[xX]((${W})\\.?|(${W})?\\.(${W}))[pP][+-]?(${U})[fFdD]?\\b` },
          { begin: `\\b(0|[1-9](_*[0-9])*)[lL]?\\b` },
          { begin: `\\b0[xX](${W})[lL]?\\b` },
          { begin: `\\b0(_*[0-7])*[lL]?\\b` },
          { begin: `\\b0[bB][01](_*[01])*[lL]?\\b` },
        ],
        relevance: 0,
      }));
  });
function ft(e) {
  let t = e.regex,
    n = (e, { after: t }) => {
      let n = `</` + e[0].slice(1);
      return e.input.indexOf(n, t) !== -1;
    },
    r = pt,
    i = { begin: `<>`, end: `</>` },
    a = /<[A-Za-z0-9\\._:-]+\s*\/>/,
    o = {
      begin: /<[A-Za-z0-9\\._:-]+/,
      end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
      isTrulyOpeningTag: (e, t) => {
        let r = e[0].length + e.index,
          i = e.input[r];
        if (i === `<` || i === `,`) {
          t.ignoreMatch();
          return;
        }
        i === `>` && (n(e, { after: r }) || t.ignoreMatch());
        let a,
          o = e.input.substring(r);
        if ((a = o.match(/^\s*=/))) {
          t.ignoreMatch();
          return;
        }
        if ((a = o.match(/^\s+extends\s+/)) && a.index === 0) {
          t.ignoreMatch();
          return;
        }
      },
    },
    s = { $pattern: pt, keyword: mt, literal: ht, built_in: bt, "variable.language": yt },
    c = `[0-9](_?[0-9])*`,
    l = `\\.(${c})`,
    u = `0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*`,
    d = {
      className: `number`,
      variants: [
        { begin: `(\\b(${u})((${l})|\\.)?|(${l}))[eE][+-]?(${c})\\b` },
        { begin: `\\b(${u})\\b((${l})\\b|\\.)?|(${l})\\b` },
        { begin: `\\b(0|[1-9](_?[0-9])*)n\\b` },
        { begin: `\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b` },
        { begin: `\\b0[bB][0-1](_?[0-1])*n?\\b` },
        { begin: `\\b0[oO][0-7](_?[0-7])*n?\\b` },
        { begin: `\\b0[0-7]+n?\\b` },
      ],
      relevance: 0,
    },
    f = { className: `subst`, begin: `\\$\\{`, end: `\\}`, keywords: s, contains: [] },
    p = {
      begin: ".?html`",
      end: ``,
      starts: { end: "`", returnEnd: !1, contains: [e.BACKSLASH_ESCAPE, f], subLanguage: `xml` },
    },
    m = {
      begin: ".?css`",
      end: ``,
      starts: { end: "`", returnEnd: !1, contains: [e.BACKSLASH_ESCAPE, f], subLanguage: `css` },
    },
    h = {
      begin: ".?gql`",
      end: ``,
      starts: {
        end: "`",
        returnEnd: !1,
        contains: [e.BACKSLASH_ESCAPE, f],
        subLanguage: `graphql`,
      },
    },
    g = { className: `string`, begin: "`", end: "`", contains: [e.BACKSLASH_ESCAPE, f] },
    _ = {
      className: `comment`,
      variants: [
        e.COMMENT(/\/\*\*(?!\/)/, `\\*/`, {
          relevance: 0,
          contains: [
            {
              begin: `(?=@[A-Za-z]+)`,
              relevance: 0,
              contains: [
                { className: `doctag`, begin: `@[A-Za-z]+` },
                {
                  className: `type`,
                  begin: `\\{`,
                  end: `\\}`,
                  excludeEnd: !0,
                  excludeBegin: !0,
                  relevance: 0,
                },
                {
                  className: `variable`,
                  begin: `[A-Za-z$_][0-9A-Za-z$_]*(?=\\s*(-)|$)`,
                  endsParent: !0,
                  relevance: 0,
                },
                { begin: /(?=[^\n])\s/, relevance: 0 },
              ],
            },
          ],
        }),
        e.C_BLOCK_COMMENT_MODE,
        e.C_LINE_COMMENT_MODE,
      ],
    },
    v = [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, p, m, h, g, { match: /\$\d+/ }, d];
  f.contains = v.concat({ begin: /\{/, end: /\}/, keywords: s, contains: [`self`].concat(v) });
  let y = [].concat(_, f.contains),
    b = y.concat([{ begin: /(\s*)\(/, end: /\)/, keywords: s, contains: [`self`].concat(y) }]),
    x = {
      className: `params`,
      begin: /(\s*)\(/,
      end: /\)/,
      excludeBegin: !0,
      excludeEnd: !0,
      keywords: s,
      contains: b,
    },
    S = {
      variants: [
        {
          match: [
            /class/,
            /\s+/,
            r,
            /\s+/,
            /extends/,
            /\s+/,
            t.concat(r, `(`, t.concat(/\./, r), `)*`),
          ],
          scope: { 1: `keyword`, 3: `title.class`, 5: `keyword`, 7: `title.class.inherited` },
        },
        { match: [/class/, /\s+/, r], scope: { 1: `keyword`, 3: `title.class` } },
      ],
    },
    C = {
      relevance: 0,
      match: t.either(
        /\bJSON/,
        /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
        /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
        /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/,
      ),
      className: `title.class`,
      keywords: { _: [...gt, ..._t] },
    },
    w = {
      label: `use_strict`,
      className: `meta`,
      relevance: 10,
      begin: /^\s*['"]use (strict|asm)['"]/,
    },
    T = {
      variants: [
        { match: [/function/, /\s+/, r, /(?=\s*\()/] },
        { match: [/function/, /\s*(?=\()/] },
      ],
      className: { 1: `keyword`, 3: `title.function` },
      label: `func.def`,
      contains: [x],
      illegal: /%/,
    },
    E = { relevance: 0, match: /\b[A-Z][A-Z_0-9]+\b/, className: `variable.constant` };
  function D(e) {
    return t.concat(`(?!`, e.join(`|`), `)`);
  }
  let O = {
      match: t.concat(
        /\b/,
        D([...vt, `super`, `import`].map((e) => `${e}\\s*\\(`)),
        r,
        t.lookahead(/\s*\(/),
      ),
      className: `title.function`,
      relevance: 0,
    },
    k = {
      begin: t.concat(/\./, t.lookahead(t.concat(r, /(?![0-9A-Za-z$_(])/))),
      end: r,
      excludeBegin: !0,
      keywords: `prototype`,
      className: `property`,
      relevance: 0,
    },
    A = {
      match: [/get|set/, /\s+/, r, /(?=\()/],
      className: { 1: `keyword`, 3: `title.function` },
      contains: [{ begin: /\(\)/ }, x],
    },
    ee =
      `(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|` +
      e.UNDERSCORE_IDENT_RE +
      `)\\s*=>`,
    j = {
      match: [/const|var|let/, /\s+/, r, /\s*/, /=\s*/, /(async\s*)?/, t.lookahead(ee)],
      keywords: `async`,
      className: { 1: `keyword`, 3: `title.function` },
      contains: [x],
    };
  return {
    name: `JavaScript`,
    aliases: [`js`, `jsx`, `mjs`, `cjs`],
    keywords: s,
    exports: { PARAMS_CONTAINS: b, CLASS_REFERENCE: C },
    illegal: /#(?![$_A-z])/,
    contains: [
      e.SHEBANG({ label: `shebang`, binary: `node`, relevance: 5 }),
      w,
      e.APOS_STRING_MODE,
      e.QUOTE_STRING_MODE,
      p,
      m,
      h,
      g,
      _,
      { match: /\$\d+/ },
      d,
      C,
      { scope: `attr`, match: r + t.lookahead(`:`), relevance: 0 },
      j,
      {
        begin: `(` + e.RE_STARTERS_RE + `|\\b(case|return|throw)\\b)\\s*`,
        keywords: `return throw case`,
        relevance: 0,
        contains: [
          _,
          e.REGEXP_MODE,
          {
            className: `function`,
            begin: ee,
            returnBegin: !0,
            end: `\\s*=>`,
            contains: [
              {
                className: `params`,
                variants: [
                  { begin: e.UNDERSCORE_IDENT_RE, relevance: 0 },
                  { className: null, begin: /\(\s*\)/, skip: !0 },
                  {
                    begin: /(\s*)\(/,
                    end: /\)/,
                    excludeBegin: !0,
                    excludeEnd: !0,
                    keywords: s,
                    contains: b,
                  },
                ],
              },
            ],
          },
          { begin: /,/, relevance: 0 },
          { match: /\s+/, relevance: 0 },
          {
            variants: [
              { begin: i.begin, end: i.end },
              { match: a },
              { begin: o.begin, "on:begin": o.isTrulyOpeningTag, end: o.end },
            ],
            subLanguage: `xml`,
            contains: [{ begin: o.begin, end: o.end, skip: !0, contains: [`self`] }],
          },
        ],
      },
      T,
      { beginKeywords: `while if switch catch for` },
      {
        begin:
          `\\b(?!function)` +
          e.UNDERSCORE_IDENT_RE +
          `\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{`,
        returnBegin: !0,
        label: `func.def`,
        contains: [x, e.inherit(e.TITLE_MODE, { begin: r, className: `title.function` })],
      },
      { match: /\.\.\./, relevance: 0 },
      k,
      { match: `\\$[A-Za-z$_][0-9A-Za-z$_]*`, relevance: 0 },
      { match: [/\bconstructor(?=\s*\()/], className: { 1: `title.function` }, contains: [x] },
      O,
      E,
      S,
      A,
      { match: /\$[(.]/ },
    ],
  };
}
var pt,
  mt,
  ht,
  gt,
  _t,
  vt,
  yt,
  bt,
  xt = t(() => {
    ((pt = `[A-Za-z$_][0-9A-Za-z$_]*`),
      (mt =
        `as.in.of.if.for.while.finally.var.new.function.do.return.void.else.break.catch.instanceof.with.throw.case.default.try.switch.continue.typeof.delete.let.yield.const.class.debugger.async.await.static.import.from.export.extends.using`.split(
          `.`,
        )),
      (ht = [`true`, `false`, `null`, `undefined`, `NaN`, `Infinity`]),
      (gt =
        `Object.Function.Boolean.Symbol.Math.Date.Number.BigInt.String.RegExp.Array.Float32Array.Float64Array.Int8Array.Uint8Array.Uint8ClampedArray.Int16Array.Int32Array.Uint16Array.Uint32Array.BigInt64Array.BigUint64Array.Set.Map.WeakSet.WeakMap.ArrayBuffer.SharedArrayBuffer.Atomics.DataView.JSON.Promise.Generator.GeneratorFunction.AsyncFunction.Reflect.Proxy.Intl.WebAssembly`.split(
          `.`,
        )),
      (_t = [
        `Error`,
        `EvalError`,
        `InternalError`,
        `RangeError`,
        `ReferenceError`,
        `SyntaxError`,
        `TypeError`,
        `URIError`,
      ]),
      (vt = [
        `setInterval`,
        `setTimeout`,
        `clearInterval`,
        `clearTimeout`,
        `require`,
        `exports`,
        `eval`,
        `isFinite`,
        `isNaN`,
        `parseFloat`,
        `parseInt`,
        `decodeURI`,
        `decodeURIComponent`,
        `encodeURI`,
        `encodeURIComponent`,
        `escape`,
        `unescape`,
      ]),
      (yt = [
        `arguments`,
        `this`,
        `super`,
        `console`,
        `window`,
        `document`,
        `localStorage`,
        `sessionStorage`,
        `module`,
        `global`,
      ]),
      (bt = [].concat(vt, gt, _t)));
  });
function St(e) {
  let t = { className: `attr`, begin: /"(\\.|[^\\"\r\n])*"(?=\s*:)/, relevance: 1.01 },
    n = { match: /[{}[\],:]/, className: `punctuation`, relevance: 0 },
    r = [`true`, `false`, `null`],
    i = { scope: `literal`, beginKeywords: r.join(` `) };
  return {
    name: `JSON`,
    aliases: [`jsonc`],
    keywords: { literal: r },
    contains: [
      t,
      n,
      e.QUOTE_STRING_MODE,
      i,
      e.C_NUMBER_MODE,
      e.C_LINE_COMMENT_MODE,
      e.C_BLOCK_COMMENT_MODE,
    ],
    illegal: `\\S`,
  };
}
var Ct = t(() => {});
function wt(e) {
  let t = e.regex,
    n = { begin: /<\/?[A-Za-z_]/, end: `>`, subLanguage: `xml`, relevance: 0 },
    r = { begin: `^[-\\*]{3,}`, end: `$` },
    i = {
      className: `code`,
      variants: [
        { begin: "(`{3,})[^`](.|\\n)*?\\1`*[ ]*" },
        { begin: `(~{3,})[^~](.|\\n)*?\\1~*[ ]*` },
        { begin: "```", end: "```+[ ]*$" },
        { begin: `~~~`, end: `~~~+[ ]*$` },
        { begin: "`.+?`" },
        {
          begin: `(?=^( {4}|\\t))`,
          contains: [{ begin: `^( {4}|\\t)`, end: `(\\n)$` }],
          relevance: 0,
        },
      ],
    },
    a = {
      className: `bullet`,
      begin: `^[ 	]*([*+-]|(\\d+\\.))(?=\\s+)`,
      end: `\\s+`,
      excludeEnd: !0,
    },
    o = {
      begin: /^\[[^\n]+\]:/,
      returnBegin: !0,
      contains: [
        { className: `symbol`, begin: /\[/, end: /\]/, excludeBegin: !0, excludeEnd: !0 },
        { className: `link`, begin: /:\s*/, end: /$/, excludeBegin: !0 },
      ],
    },
    s = {
      variants: [
        { begin: /\[.+?\]\[.*?\]/, relevance: 0 },
        { begin: /\[.+?\]\(((data|javascript|mailto):|(?:http|ftp)s?:\/\/).*?\)/, relevance: 2 },
        { begin: t.concat(/\[.+?\]\(/, /[A-Za-z][A-Za-z0-9+.-]*/, /:\/\/.*?\)/), relevance: 2 },
        { begin: /\[.+?\]\([./?&#].*?\)/, relevance: 1 },
        { begin: /\[.*?\]\(.*?\)/, relevance: 0 },
      ],
      returnBegin: !0,
      contains: [
        { match: /\[(?=\])/ },
        {
          className: `string`,
          relevance: 0,
          begin: `\\[`,
          end: `\\]`,
          excludeBegin: !0,
          returnEnd: !0,
        },
        {
          className: `link`,
          relevance: 0,
          begin: `\\]\\(`,
          end: `\\)`,
          excludeBegin: !0,
          excludeEnd: !0,
        },
        {
          className: `symbol`,
          relevance: 0,
          begin: `\\]\\[`,
          end: `\\]`,
          excludeBegin: !0,
          excludeEnd: !0,
        },
      ],
    },
    c = {
      className: `strong`,
      contains: [],
      variants: [
        { begin: /_{2}(?!\s)/, end: /_{2}/ },
        { begin: /\*{2}(?!\s)/, end: /\*{2}/ },
      ],
    },
    l = {
      className: `emphasis`,
      contains: [],
      variants: [
        { begin: /\*(?![*\s])/, end: /\*/ },
        { begin: /_(?![_\s])/, end: /_/, relevance: 0 },
      ],
    },
    u = e.inherit(c, { contains: [] }),
    d = e.inherit(l, { contains: [] });
  (c.contains.push(d), l.contains.push(u));
  let f = [n, s];
  return (
    [c, l, u, d].forEach((e) => {
      e.contains = e.contains.concat(f);
    }),
    (f = f.concat(c, l)),
    {
      name: `Markdown`,
      aliases: [`md`, `mkdown`, `mkd`],
      contains: [
        {
          className: `section`,
          variants: [
            { begin: `^#{1,6}`, end: `$`, contains: f },
            {
              begin: `(?=^.+?\\n[=-]{2,}$)`,
              contains: [{ begin: `^[=-]*$` }, { begin: `^`, end: `\\n`, contains: f }],
            },
          ],
        },
        n,
        a,
        c,
        l,
        { className: `quote`, begin: `^>\\s+`, contains: f, end: `$` },
        i,
        r,
        s,
        o,
        { scope: `literal`, match: /&([a-zA-Z0-9]+|#[0-9]{1,7}|#[Xx][0-9a-fA-F]{1,6});/ },
      ],
    }
  );
}
var Tt = t(() => {});
function Et(e) {
  let t = e.regex,
    n = /[\p{XID_Start}_]\p{XID_Continue}*/u,
    r =
      `and.as.assert.async.await.break.case.class.continue.def.del.elif.else.except.finally.for.from.global.if.import.in.is.lambda.match.nonlocal|10.not.or.pass.raise.return.try.while.with.yield`.split(
        `.`,
      ),
    i = {
      $pattern: /[A-Za-z]\w+|__\w+__/,
      keyword: r,
      built_in:
        `__import__.abs.all.any.ascii.bin.bool.breakpoint.bytearray.bytes.callable.chr.classmethod.compile.complex.delattr.dict.dir.divmod.enumerate.eval.exec.filter.float.format.frozenset.getattr.globals.hasattr.hash.help.hex.id.input.int.isinstance.issubclass.iter.len.list.locals.map.max.memoryview.min.next.object.oct.open.ord.pow.print.property.range.repr.reversed.round.set.setattr.slice.sorted.staticmethod.str.sum.super.tuple.type.vars.zip`.split(
          `.`,
        ),
      literal: [`__debug__`, `Ellipsis`, `False`, `None`, `NotImplemented`, `True`],
      type: [
        `Any`,
        `Callable`,
        `Coroutine`,
        `Dict`,
        `List`,
        `Literal`,
        `Generic`,
        `Optional`,
        `Sequence`,
        `Set`,
        `Tuple`,
        `Type`,
        `Union`,
      ],
    },
    a = { className: `meta`, begin: /^(>>>|\.\.\.) / },
    o = { className: `subst`, begin: /\{/, end: /\}/, keywords: i, illegal: /#/ },
    s = { begin: /\{\{/, relevance: 0 },
    c = {
      className: `string`,
      contains: [e.BACKSLASH_ESCAPE],
      variants: [
        {
          begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,
          end: /'''/,
          contains: [e.BACKSLASH_ESCAPE, a],
          relevance: 10,
        },
        {
          begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,
          end: /"""/,
          contains: [e.BACKSLASH_ESCAPE, a],
          relevance: 10,
        },
        {
          begin: /([fF][rR]|[rR][fF]|[fF])'''/,
          end: /'''/,
          contains: [e.BACKSLASH_ESCAPE, a, s, o],
        },
        {
          begin: /([fF][rR]|[rR][fF]|[fF])"""/,
          end: /"""/,
          contains: [e.BACKSLASH_ESCAPE, a, s, o],
        },
        { begin: /([uU]|[rR])'/, end: /'/, relevance: 10 },
        { begin: /([uU]|[rR])"/, end: /"/, relevance: 10 },
        { begin: /([bB]|[bB][rR]|[rR][bB])'/, end: /'/ },
        { begin: /([bB]|[bB][rR]|[rR][bB])"/, end: /"/ },
        { begin: /([fF][rR]|[rR][fF]|[fF])'/, end: /'/, contains: [e.BACKSLASH_ESCAPE, s, o] },
        { begin: /([fF][rR]|[rR][fF]|[fF])"/, end: /"/, contains: [e.BACKSLASH_ESCAPE, s, o] },
        e.APOS_STRING_MODE,
        e.QUOTE_STRING_MODE,
      ],
    },
    l = `[0-9](_?[0-9])*`,
    u = `(\\b(${l}))?\\.(${l})|\\b(${l})\\.`,
    d = `\\b|${r.join(`|`)}`,
    f = {
      className: `number`,
      relevance: 0,
      variants: [
        { begin: `(\\b(${l})|(${u}))[eE][+-]?(${l})[jJ]?(?=${d})` },
        { begin: `(${u})[jJ]?` },
        { begin: `\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?(?=${d})` },
        { begin: `\\b0[bB](_?[01])+[lL]?(?=${d})` },
        { begin: `\\b0[oO](_?[0-7])+[lL]?(?=${d})` },
        { begin: `\\b0[xX](_?[0-9a-fA-F])+[lL]?(?=${d})` },
        { begin: `\\b(${l})[jJ](?=${d})` },
      ],
    },
    p = {
      className: `comment`,
      begin: t.lookahead(/# type:/),
      end: /$/,
      keywords: i,
      contains: [{ begin: /# type:/ }, { begin: /#/, end: /\b\B/, endsWithParent: !0 }],
    },
    m = {
      className: `params`,
      variants: [
        { className: ``, begin: /\(\s*\)/, skip: !0 },
        {
          begin: /\(/,
          end: /\)/,
          excludeBegin: !0,
          excludeEnd: !0,
          keywords: i,
          contains: [`self`, a, f, c, e.HASH_COMMENT_MODE],
        },
      ],
    };
  return (
    (o.contains = [c, f, a]),
    {
      name: `Python`,
      aliases: [`py`, `gyp`, `ipython`],
      unicodeRegex: !0,
      keywords: i,
      illegal: /(<\/|\?)|=>/,
      contains: [
        a,
        f,
        { scope: `variable.language`, match: /\bself\b/ },
        { beginKeywords: `if`, relevance: 0 },
        { match: /\bor\b/, scope: `keyword` },
        c,
        p,
        e.HASH_COMMENT_MODE,
        { match: [/\bdef/, /\s+/, n], scope: { 1: `keyword`, 3: `title.function` }, contains: [m] },
        {
          variants: [
            { match: [/\bclass/, /\s+/, n, /\s*/, /\(\s*/, n, /\s*\)/] },
            { match: [/\bclass/, /\s+/, n] },
          ],
          scope: { 1: `keyword`, 3: `title.class`, 6: `title.class.inherited` },
        },
        { className: `meta`, begin: /^[\t ]*@/, end: /(?=#)|$/, contains: [f, m, c] },
      ],
    }
  );
}
var Dt = t(() => {});
function Ot(e) {
  let t = e.regex,
    n = /(r#)?/,
    r = t.concat(n, e.UNDERSCORE_IDENT_RE),
    i = t.concat(n, e.IDENT_RE),
    a = {
      className: `title.function.invoke`,
      relevance: 0,
      begin: t.concat(/\b/, /(?!let|for|while|if|else|match\b)/, i, t.lookahead(/\s*\(/)),
    },
    o =
      `abstract.as.async.await.become.box.break.const.continue.crate.do.dyn.else.enum.extern.false.final.fn.for.if.impl.in.let.loop.macro.match.mod.move.mut.override.priv.pub.ref.return.self.Self.static.struct.super.trait.true.try.type.typeof.union.unsafe.unsized.use.virtual.where.while.yield`.split(
        `.`,
      ),
    s = [`true`, `false`, `Some`, `None`, `Ok`, `Err`],
    c =
      `drop .Copy.Send.Sized.Sync.Drop.Fn.FnMut.FnOnce.ToOwned.Clone.Debug.PartialEq.PartialOrd.Eq.Ord.AsRef.AsMut.Into.From.Default.Iterator.Extend.IntoIterator.DoubleEndedIterator.ExactSizeIterator.SliceConcatExt.ToString.assert!.assert_eq!.bitflags!.bytes!.cfg!.col!.concat!.concat_idents!.debug_assert!.debug_assert_eq!.env!.eprintln!.panic!.file!.format!.format_args!.include_bytes!.include_str!.line!.local_data_key!.module_path!.option_env!.print!.println!.select!.stringify!.try!.unimplemented!.unreachable!.vec!.write!.writeln!.macro_rules!.assert_ne!.debug_assert_ne!`.split(
        `.`,
      ),
    l = [
      `i8`,
      `i16`,
      `i32`,
      `i64`,
      `i128`,
      `isize`,
      `u8`,
      `u16`,
      `u32`,
      `u64`,
      `u128`,
      `usize`,
      `f32`,
      `f64`,
      `str`,
      `char`,
      `bool`,
      `Box`,
      `Option`,
      `Result`,
      `String`,
      `Vec`,
    ];
  return {
    name: `Rust`,
    aliases: [`rs`],
    keywords: { $pattern: e.IDENT_RE + `!?`, type: l, keyword: o, literal: s, built_in: c },
    illegal: `</`,
    contains: [
      e.C_LINE_COMMENT_MODE,
      e.COMMENT(`/\\*`, `\\*/`, { contains: [`self`] }),
      e.inherit(e.QUOTE_STRING_MODE, { begin: /b?"/, illegal: null }),
      { className: `symbol`, begin: /'[a-zA-Z_][a-zA-Z0-9_]*(?!')/ },
      {
        scope: `string`,
        variants: [
          { begin: /b?r(#*)"(.|\n)*?"\1(?!#)/ },
          {
            begin: /b?'/,
            end: /'/,
            contains: [{ scope: `char.escape`, match: /\\('|\w|x\w{2}|u\w{4}|U\w{8})/ }],
          },
        ],
      },
      {
        className: `number`,
        variants: [
          { begin: `\\b0b([01_]+)([ui](8|16|32|64|128|size)|f(32|64))?` },
          { begin: `\\b0o([0-7_]+)([ui](8|16|32|64|128|size)|f(32|64))?` },
          { begin: `\\b0x([A-Fa-f0-9_]+)([ui](8|16|32|64|128|size)|f(32|64))?` },
          {
            begin: `\\b(\\d[\\d_]*(\\.[0-9_]+)?([eE][+-]?[0-9_]+)?)([ui](8|16|32|64|128|size)|f(32|64))?`,
          },
        ],
        relevance: 0,
      },
      { begin: [/fn/, /\s+/, r], className: { 1: `keyword`, 3: `title.function` } },
      {
        className: `meta`,
        begin: `#!?\\[`,
        end: `\\]`,
        contains: [{ className: `string`, begin: /"/, end: /"/, contains: [e.BACKSLASH_ESCAPE] }],
      },
      {
        begin: [/let/, /\s+/, /(?:mut\s+)?/, r],
        className: { 1: `keyword`, 3: `keyword`, 4: `variable` },
      },
      {
        begin: [/for/, /\s+/, r, /\s+/, /in/],
        className: { 1: `keyword`, 3: `variable`, 5: `keyword` },
      },
      { begin: [/type/, /\s+/, r], className: { 1: `keyword`, 3: `title.class` } },
      {
        begin: [/(?:trait|enum|struct|union|impl|for)/, /\s+/, r],
        className: { 1: `keyword`, 3: `title.class` },
      },
      { begin: e.IDENT_RE + `::`, keywords: { keyword: `Self`, built_in: c, type: l } },
      { className: `punctuation`, begin: `->` },
      a,
    ],
  };
}
var kt = t(() => {});
function At(e) {
  let t = e.regex,
    n = (e, { after: t }) => {
      let n = `</` + e[0].slice(1);
      return e.input.indexOf(n, t) !== -1;
    },
    r = Mt,
    i = { begin: `<>`, end: `</>` },
    a = /<[A-Za-z0-9\\._:-]+\s*\/>/,
    o = {
      begin: /<[A-Za-z0-9\\._:-]+/,
      end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
      isTrulyOpeningTag: (e, t) => {
        let r = e[0].length + e.index,
          i = e.input[r];
        if (i === `<` || i === `,`) {
          t.ignoreMatch();
          return;
        }
        i === `>` && (n(e, { after: r }) || t.ignoreMatch());
        let a,
          o = e.input.substring(r);
        if ((a = o.match(/^\s*=/))) {
          t.ignoreMatch();
          return;
        }
        if ((a = o.match(/^\s+extends\s+/)) && a.index === 0) {
          t.ignoreMatch();
          return;
        }
      },
    },
    s = { $pattern: Mt, keyword: Nt, literal: Pt, built_in: Rt, "variable.language": G },
    c = `[0-9](_?[0-9])*`,
    l = `\\.(${c})`,
    u = `0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*`,
    d = {
      className: `number`,
      variants: [
        { begin: `(\\b(${u})((${l})|\\.)?|(${l}))[eE][+-]?(${c})\\b` },
        { begin: `\\b(${u})\\b((${l})\\b|\\.)?|(${l})\\b` },
        { begin: `\\b(0|[1-9](_?[0-9])*)n\\b` },
        { begin: `\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b` },
        { begin: `\\b0[bB][0-1](_?[0-1])*n?\\b` },
        { begin: `\\b0[oO][0-7](_?[0-7])*n?\\b` },
        { begin: `\\b0[0-7]+n?\\b` },
      ],
      relevance: 0,
    },
    f = { className: `subst`, begin: `\\$\\{`, end: `\\}`, keywords: s, contains: [] },
    p = {
      begin: ".?html`",
      end: ``,
      starts: { end: "`", returnEnd: !1, contains: [e.BACKSLASH_ESCAPE, f], subLanguage: `xml` },
    },
    m = {
      begin: ".?css`",
      end: ``,
      starts: { end: "`", returnEnd: !1, contains: [e.BACKSLASH_ESCAPE, f], subLanguage: `css` },
    },
    h = {
      begin: ".?gql`",
      end: ``,
      starts: {
        end: "`",
        returnEnd: !1,
        contains: [e.BACKSLASH_ESCAPE, f],
        subLanguage: `graphql`,
      },
    },
    g = { className: `string`, begin: "`", end: "`", contains: [e.BACKSLASH_ESCAPE, f] },
    _ = {
      className: `comment`,
      variants: [
        e.COMMENT(/\/\*\*(?!\/)/, `\\*/`, {
          relevance: 0,
          contains: [
            {
              begin: `(?=@[A-Za-z]+)`,
              relevance: 0,
              contains: [
                { className: `doctag`, begin: `@[A-Za-z]+` },
                {
                  className: `type`,
                  begin: `\\{`,
                  end: `\\}`,
                  excludeEnd: !0,
                  excludeBegin: !0,
                  relevance: 0,
                },
                {
                  className: `variable`,
                  begin: `[A-Za-z$_][0-9A-Za-z$_]*(?=\\s*(-)|$)`,
                  endsParent: !0,
                  relevance: 0,
                },
                { begin: /(?=[^\n])\s/, relevance: 0 },
              ],
            },
          ],
        }),
        e.C_BLOCK_COMMENT_MODE,
        e.C_LINE_COMMENT_MODE,
      ],
    },
    v = [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, p, m, h, g, { match: /\$\d+/ }, d];
  f.contains = v.concat({ begin: /\{/, end: /\}/, keywords: s, contains: [`self`].concat(v) });
  let y = [].concat(_, f.contains),
    b = y.concat([{ begin: /(\s*)\(/, end: /\)/, keywords: s, contains: [`self`].concat(y) }]),
    x = {
      className: `params`,
      begin: /(\s*)\(/,
      end: /\)/,
      excludeBegin: !0,
      excludeEnd: !0,
      keywords: s,
      contains: b,
    },
    S = {
      variants: [
        {
          match: [
            /class/,
            /\s+/,
            r,
            /\s+/,
            /extends/,
            /\s+/,
            t.concat(r, `(`, t.concat(/\./, r), `)*`),
          ],
          scope: { 1: `keyword`, 3: `title.class`, 5: `keyword`, 7: `title.class.inherited` },
        },
        { match: [/class/, /\s+/, r], scope: { 1: `keyword`, 3: `title.class` } },
      ],
    },
    C = {
      relevance: 0,
      match: t.either(
        /\bJSON/,
        /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
        /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
        /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/,
      ),
      className: `title.class`,
      keywords: { _: [...Ft, ...It] },
    },
    w = {
      label: `use_strict`,
      className: `meta`,
      relevance: 10,
      begin: /^\s*['"]use (strict|asm)['"]/,
    },
    T = {
      variants: [
        { match: [/function/, /\s+/, r, /(?=\s*\()/] },
        { match: [/function/, /\s*(?=\()/] },
      ],
      className: { 1: `keyword`, 3: `title.function` },
      label: `func.def`,
      contains: [x],
      illegal: /%/,
    },
    E = { relevance: 0, match: /\b[A-Z][A-Z_0-9]+\b/, className: `variable.constant` };
  function D(e) {
    return t.concat(`(?!`, e.join(`|`), `)`);
  }
  let O = {
      match: t.concat(
        /\b/,
        D([...Lt, `super`, `import`].map((e) => `${e}\\s*\\(`)),
        r,
        t.lookahead(/\s*\(/),
      ),
      className: `title.function`,
      relevance: 0,
    },
    k = {
      begin: t.concat(/\./, t.lookahead(t.concat(r, /(?![0-9A-Za-z$_(])/))),
      end: r,
      excludeBegin: !0,
      keywords: `prototype`,
      className: `property`,
      relevance: 0,
    },
    A = {
      match: [/get|set/, /\s+/, r, /(?=\()/],
      className: { 1: `keyword`, 3: `title.function` },
      contains: [{ begin: /\(\)/ }, x],
    },
    ee =
      `(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|` +
      e.UNDERSCORE_IDENT_RE +
      `)\\s*=>`,
    j = {
      match: [/const|var|let/, /\s+/, r, /\s*/, /=\s*/, /(async\s*)?/, t.lookahead(ee)],
      keywords: `async`,
      className: { 1: `keyword`, 3: `title.function` },
      contains: [x],
    };
  return {
    name: `JavaScript`,
    aliases: [`js`, `jsx`, `mjs`, `cjs`],
    keywords: s,
    exports: { PARAMS_CONTAINS: b, CLASS_REFERENCE: C },
    illegal: /#(?![$_A-z])/,
    contains: [
      e.SHEBANG({ label: `shebang`, binary: `node`, relevance: 5 }),
      w,
      e.APOS_STRING_MODE,
      e.QUOTE_STRING_MODE,
      p,
      m,
      h,
      g,
      _,
      { match: /\$\d+/ },
      d,
      C,
      { scope: `attr`, match: r + t.lookahead(`:`), relevance: 0 },
      j,
      {
        begin: `(` + e.RE_STARTERS_RE + `|\\b(case|return|throw)\\b)\\s*`,
        keywords: `return throw case`,
        relevance: 0,
        contains: [
          _,
          e.REGEXP_MODE,
          {
            className: `function`,
            begin: ee,
            returnBegin: !0,
            end: `\\s*=>`,
            contains: [
              {
                className: `params`,
                variants: [
                  { begin: e.UNDERSCORE_IDENT_RE, relevance: 0 },
                  { className: null, begin: /\(\s*\)/, skip: !0 },
                  {
                    begin: /(\s*)\(/,
                    end: /\)/,
                    excludeBegin: !0,
                    excludeEnd: !0,
                    keywords: s,
                    contains: b,
                  },
                ],
              },
            ],
          },
          { begin: /,/, relevance: 0 },
          { match: /\s+/, relevance: 0 },
          {
            variants: [
              { begin: i.begin, end: i.end },
              { match: a },
              { begin: o.begin, "on:begin": o.isTrulyOpeningTag, end: o.end },
            ],
            subLanguage: `xml`,
            contains: [{ begin: o.begin, end: o.end, skip: !0, contains: [`self`] }],
          },
        ],
      },
      T,
      { beginKeywords: `while if switch catch for` },
      {
        begin:
          `\\b(?!function)` +
          e.UNDERSCORE_IDENT_RE +
          `\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{`,
        returnBegin: !0,
        label: `func.def`,
        contains: [x, e.inherit(e.TITLE_MODE, { begin: r, className: `title.function` })],
      },
      { match: /\.\.\./, relevance: 0 },
      k,
      { match: `\\$[A-Za-z$_][0-9A-Za-z$_]*`, relevance: 0 },
      { match: [/\bconstructor(?=\s*\()/], className: { 1: `title.function` }, contains: [x] },
      O,
      E,
      S,
      A,
      { match: /\$[(.]/ },
    ],
  };
}
function jt(e) {
  let t = e.regex,
    n = At(e),
    r = Mt,
    i = [
      `any`,
      `void`,
      `number`,
      `boolean`,
      `string`,
      `object`,
      `never`,
      `symbol`,
      `bigint`,
      `unknown`,
    ],
    a = { begin: [/namespace/, /\s+/, e.IDENT_RE], beginScope: { 1: `keyword`, 3: `title.class` } },
    o = {
      beginKeywords: `interface`,
      end: /\{/,
      excludeEnd: !0,
      keywords: { keyword: `interface extends`, built_in: i },
      contains: [n.exports.CLASS_REFERENCE],
    },
    s = { className: `meta`, relevance: 10, begin: /^\s*['"]use strict['"]/ },
    c = {
      $pattern: Mt,
      keyword: Nt.concat([
        `type`,
        `interface`,
        `public`,
        `private`,
        `protected`,
        `implements`,
        `declare`,
        `abstract`,
        `readonly`,
        `enum`,
        `override`,
        `satisfies`,
      ]),
      literal: Pt,
      built_in: Rt.concat(i),
      "variable.language": G,
    },
    l = { className: `meta`, begin: `@[A-Za-z$_][0-9A-Za-z$_]*` },
    u = (e, t, n) => {
      let r = e.contains.findIndex((e) => e.label === t);
      if (r === -1) throw Error(`can not find mode to replace`);
      e.contains.splice(r, 1, n);
    };
  (Object.assign(n.keywords, c), n.exports.PARAMS_CONTAINS.push(l));
  let d = n.contains.find((e) => e.scope === `attr`),
    f = Object.assign({}, d, { match: t.concat(r, t.lookahead(/\s*\?:/)) });
  (n.exports.PARAMS_CONTAINS.push([n.exports.CLASS_REFERENCE, d, f]),
    (n.contains = n.contains.concat([l, a, o, f])),
    u(n, `shebang`, e.SHEBANG()),
    u(n, `use_strict`, s));
  let p = n.contains.find((e) => e.label === `func.def`);
  return (
    (p.relevance = 0),
    Object.assign(n, { name: `TypeScript`, aliases: [`ts`, `tsx`, `mts`, `cts`] }),
    n
  );
}
var Mt,
  Nt,
  Pt,
  Ft,
  It,
  Lt,
  G,
  Rt,
  zt = t(() => {
    ((Mt = `[A-Za-z$_][0-9A-Za-z$_]*`),
      (Nt =
        `as.in.of.if.for.while.finally.var.new.function.do.return.void.else.break.catch.instanceof.with.throw.case.default.try.switch.continue.typeof.delete.let.yield.const.class.debugger.async.await.static.import.from.export.extends.using`.split(
          `.`,
        )),
      (Pt = [`true`, `false`, `null`, `undefined`, `NaN`, `Infinity`]),
      (Ft =
        `Object.Function.Boolean.Symbol.Math.Date.Number.BigInt.String.RegExp.Array.Float32Array.Float64Array.Int8Array.Uint8Array.Uint8ClampedArray.Int16Array.Int32Array.Uint16Array.Uint32Array.BigInt64Array.BigUint64Array.Set.Map.WeakSet.WeakMap.ArrayBuffer.SharedArrayBuffer.Atomics.DataView.JSON.Promise.Generator.GeneratorFunction.AsyncFunction.Reflect.Proxy.Intl.WebAssembly`.split(
          `.`,
        )),
      (It = [
        `Error`,
        `EvalError`,
        `InternalError`,
        `RangeError`,
        `ReferenceError`,
        `SyntaxError`,
        `TypeError`,
        `URIError`,
      ]),
      (Lt = [
        `setInterval`,
        `setTimeout`,
        `clearInterval`,
        `clearTimeout`,
        `require`,
        `exports`,
        `eval`,
        `isFinite`,
        `isNaN`,
        `parseFloat`,
        `parseInt`,
        `decodeURI`,
        `decodeURIComponent`,
        `encodeURI`,
        `encodeURIComponent`,
        `escape`,
        `unescape`,
      ]),
      (G = [
        `arguments`,
        `this`,
        `super`,
        `console`,
        `window`,
        `document`,
        `localStorage`,
        `sessionStorage`,
        `module`,
        `global`,
      ]),
      (Rt = [].concat(Lt, Ft, It)));
  });
function Bt(e) {
  let t = e.regex,
    n = t.concat(/[\p{L}_]/u, t.optional(/[\p{L}0-9_.-]*:/u), /[\p{L}0-9_.-]*/u),
    r = /[\p{L}0-9._:-]+/u,
    i = { className: `symbol`, begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/ },
    a = {
      begin: /\s/,
      contains: [{ className: `keyword`, begin: /#?[a-z_][a-z1-9_-]+/, illegal: /\n/ }],
    },
    o = e.inherit(a, { begin: /\(/, end: /\)/ }),
    s = e.inherit(e.APOS_STRING_MODE, { className: `string` }),
    c = e.inherit(e.QUOTE_STRING_MODE, { className: `string` }),
    l = {
      endsWithParent: !0,
      illegal: /</,
      relevance: 0,
      contains: [
        { className: `attr`, begin: r, relevance: 0 },
        {
          begin: /=\s*/,
          relevance: 0,
          contains: [
            {
              className: `string`,
              endsParent: !0,
              variants: [
                { begin: /"/, end: /"/, contains: [i] },
                { begin: /'/, end: /'/, contains: [i] },
                { begin: /[^\s"'=<>`]+/ },
              ],
            },
          ],
        },
      ],
    };
  return {
    name: `HTML, XML`,
    aliases: [`html`, `xhtml`, `rss`, `atom`, `xjb`, `xsd`, `xsl`, `plist`, `wsf`, `svg`],
    case_insensitive: !0,
    unicodeRegex: !0,
    contains: [
      {
        className: `meta`,
        begin: /<![a-z]/,
        end: />/,
        relevance: 10,
        contains: [
          a,
          c,
          s,
          o,
          {
            begin: /\[/,
            end: /\]/,
            contains: [{ className: `meta`, begin: /<![a-z]/, end: />/, contains: [a, o, c, s] }],
          },
        ],
      },
      e.COMMENT(/<!--/, /-->/, { relevance: 10 }),
      { begin: /<!\[CDATA\[/, end: /\]\]>/, relevance: 10 },
      i,
      {
        className: `meta`,
        end: /\?>/,
        variants: [
          { begin: /<\?xml/, relevance: 10, contains: [c] },
          { begin: /<\?[a-z][a-z0-9]+/ },
        ],
      },
      {
        className: `tag`,
        begin: /<style(?=\s|>)/,
        end: />/,
        keywords: { name: `style` },
        contains: [l],
        starts: { end: /<\/style>/, returnEnd: !0, subLanguage: [`css`, `xml`] },
      },
      {
        className: `tag`,
        begin: /<script(?=\s|>)/,
        end: />/,
        keywords: { name: `script` },
        contains: [l],
        starts: {
          end: /<\/script>/,
          returnEnd: !0,
          subLanguage: [`javascript`, `handlebars`, `xml`],
        },
      },
      { className: `tag`, begin: /<>|<\/>/ },
      {
        className: `tag`,
        begin: t.concat(/</, t.lookahead(t.concat(n, t.either(/\/>/, />/, /\s/)))),
        end: /\/?>/,
        contains: [{ className: `name`, begin: n, relevance: 0, starts: l }],
      },
      {
        className: `tag`,
        begin: t.concat(/<\//, t.lookahead(t.concat(n, />/))),
        contains: [
          { className: `name`, begin: n, relevance: 0 },
          { begin: />/, relevance: 0, endsParent: !0 },
        ],
      },
    ],
  };
}
var Vt = t(() => {});
function Ht(e) {
  let t = `true false yes no null`,
    n = {
      className: `attr`,
      variants: [
        { begin: /[\w*@][\w*@ :()\./-]*:(?=[ \t]|$)/ },
        { begin: /"[\w*@][\w*@ :()\./-]*":(?=[ \t]|$)/ },
        { begin: /'[\w*@][\w*@ :()\./-]*':(?=[ \t]|$)/ },
      ],
    },
    r = {
      className: `template-variable`,
      variants: [
        { begin: /\{\{/, end: /\}\}/ },
        { begin: /%\{/, end: /\}/ },
      ],
    },
    i = {
      className: `string`,
      relevance: 0,
      begin: /'/,
      end: /'/,
      contains: [{ match: /''/, scope: `char.escape`, relevance: 0 }],
    },
    a = {
      className: `string`,
      relevance: 0,
      variants: [{ begin: /"/, end: /"/ }, { begin: /\S+/ }],
      contains: [e.BACKSLASH_ESCAPE, r],
    },
    o = e.inherit(a, {
      variants: [
        { begin: /'/, end: /'/, contains: [{ begin: /''/, relevance: 0 }] },
        { begin: /"/, end: /"/ },
        { begin: /[^\s,{}[\]]+/ },
      ],
    }),
    s = {
      className: `number`,
      begin: `\\b[0-9]{4}(-[0-9][0-9]){0,2}([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?(\\.[0-9]*)?([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?\\b`,
    },
    c = { end: `,`, endsWithParent: !0, excludeEnd: !0, keywords: t, relevance: 0 },
    l = { begin: /\{/, end: /\}/, contains: [c], illegal: `\\n`, relevance: 0 },
    u = { begin: `\\[`, end: `\\]`, contains: [c], illegal: `\\n`, relevance: 0 },
    d = [
      n,
      { className: `meta`, begin: `^---\\s*$`, relevance: 10 },
      {
        className: `string`,
        begin: `[\\|>]([1-9]?[+-])?[ ]*\\n( +)[^ ][^\\n]*\\n(\\2[^\\n]+\\n?)*`,
      },
      {
        begin: `<%[%=-]?`,
        end: `[%-]?%>`,
        subLanguage: `ruby`,
        excludeBegin: !0,
        excludeEnd: !0,
        relevance: 0,
      },
      { className: `type`, begin: `!\\w+![\\w#;/?:@&=+$,.~*'()[\\]]+` },
      { className: `type`, begin: `!<[\\w#;/?:@&=+$,.~*'()[\\]]+>` },
      { className: `type`, begin: `![\\w#;/?:@&=+$,.~*'()[\\]]+` },
      { className: `type`, begin: `!![\\w#;/?:@&=+$,.~*'()[\\]]+` },
      { className: `meta`, begin: `&` + e.UNDERSCORE_IDENT_RE + `$` },
      { className: `meta`, begin: `\\*` + e.UNDERSCORE_IDENT_RE + `$` },
      { className: `bullet`, begin: `-(?=[ ]|$)`, relevance: 0 },
      e.HASH_COMMENT_MODE,
      { beginKeywords: t, keywords: { literal: t } },
      s,
      { className: `number`, begin: e.C_NUMBER_RE + `\\b`, relevance: 0 },
      l,
      u,
      i,
      a,
    ],
    f = [...d];
  return (
    f.pop(),
    f.push(o),
    (c.contains = f),
    { name: `YAML`, case_insensitive: !0, aliases: [`yml`], contains: d }
  );
}
var Ut = t(() => {});
function Wt(e) {
  let t = Kt[e];
  if (t) return t;
  t = Kt[e] = [];
  for (let e = 0; e < 128; e++) {
    let n = String.fromCharCode(e);
    t.push(n);
  }
  for (let n = 0; n < e.length; n++) {
    let r = e.charCodeAt(n);
    t[r] = `%` + (`0` + r.toString(16).toUpperCase()).slice(-2);
  }
  return t;
}
function Gt(e, t) {
  typeof t != `string` && (t = Gt.defaultChars);
  let n = Wt(t);
  return e.replace(/(%[a-f0-9]{2})+/gi, function (e) {
    let t = ``;
    for (let r = 0, i = e.length; r < i; r += 3) {
      let a = parseInt(e.slice(r + 1, r + 3), 16);
      if (a < 128) {
        t += n[a];
        continue;
      }
      if ((a & 224) == 192 && r + 3 < i) {
        let n = parseInt(e.slice(r + 4, r + 6), 16);
        if ((n & 192) == 128) {
          let e = ((a << 6) & 1984) | (n & 63);
          (e < 128 ? (t += `��`) : (t += String.fromCharCode(e)), (r += 3));
          continue;
        }
      }
      if ((a & 240) == 224 && r + 6 < i) {
        let n = parseInt(e.slice(r + 4, r + 6), 16),
          i = parseInt(e.slice(r + 7, r + 9), 16);
        if ((n & 192) == 128 && (i & 192) == 128) {
          let e = ((a << 12) & 61440) | ((n << 6) & 4032) | (i & 63);
          (e < 2048 || (e >= 55296 && e <= 57343) ? (t += `���`) : (t += String.fromCharCode(e)),
            (r += 6));
          continue;
        }
      }
      if ((a & 248) == 240 && r + 9 < i) {
        let n = parseInt(e.slice(r + 4, r + 6), 16),
          i = parseInt(e.slice(r + 7, r + 9), 16),
          o = parseInt(e.slice(r + 10, r + 12), 16);
        if ((n & 192) == 128 && (i & 192) == 128 && (o & 192) == 128) {
          let e = ((a << 18) & 1835008) | ((n << 12) & 258048) | ((i << 6) & 4032) | (o & 63);
          (e < 65536 || e > 1114111
            ? (t += `����`)
            : ((e -= 65536), (t += String.fromCharCode(55296 + (e >> 10), 56320 + (e & 1023)))),
            (r += 9));
          continue;
        }
      }
      t += `�`;
    }
    return t;
  });
}
var Kt,
  qt = t(() => {
    ((Kt = {}), (Gt.defaultChars = `;/?:@&=+$,#`), (Gt.componentChars = ``));
  });
function Jt(e) {
  let t = Yt[e];
  if (t) return t;
  t = Yt[e] = [];
  for (let e = 0; e < 128; e++) {
    let n = String.fromCharCode(e);
    /^[0-9a-z]$/i.test(n)
      ? t.push(n)
      : t.push(`%` + (`0` + e.toString(16).toUpperCase()).slice(-2));
  }
  for (let n = 0; n < e.length; n++) t[e.charCodeAt(n)] = e[n];
  return t;
}
function K(e, t, n) {
  (typeof t != `string` && ((n = t), (t = K.defaultChars)), n === void 0 && (n = !0));
  let r = Jt(t),
    i = ``;
  for (let t = 0, a = e.length; t < a; t++) {
    let o = e.charCodeAt(t);
    if (n && o === 37 && t + 2 < a && /^[0-9a-f]{2}$/i.test(e.slice(t + 1, t + 3))) {
      ((i += e.slice(t, t + 3)), (t += 2));
      continue;
    }
    if (o < 128) {
      i += r[o];
      continue;
    }
    if (o >= 55296 && o <= 57343) {
      if (o >= 55296 && o <= 56319 && t + 1 < a) {
        let n = e.charCodeAt(t + 1);
        if (n >= 56320 && n <= 57343) {
          ((i += encodeURIComponent(e[t] + e[t + 1])), t++);
          continue;
        }
      }
      i += `%EF%BF%BD`;
      continue;
    }
    i += encodeURIComponent(e[t]);
  }
  return i;
}
var Yt,
  Xt = t(() => {
    ((Yt = {}), (K.defaultChars = `;/?:@&=+$,-_.!~*'()#`), (K.componentChars = `-_.!~*'()`));
  });
function Zt(e) {
  let t = ``;
  return (
    (t += e.protocol || ``),
    (t += e.slashes ? `//` : ``),
    (t += e.auth ? e.auth + `@` : ``),
    e.hostname && e.hostname.indexOf(`:`) !== -1
      ? (t += `[` + e.hostname + `]`)
      : (t += e.hostname || ``),
    (t += e.port ? `:` + e.port : ``),
    (t += e.pathname || ``),
    (t += e.search || ``),
    (t += e.hash || ``),
    t
  );
}
var Qt = t(() => {});
function $t() {
  ((this.protocol = null),
    (this.slashes = null),
    (this.auth = null),
    (this.port = null),
    (this.hostname = null),
    (this.hash = null),
    (this.search = null),
    (this.pathname = null));
}
function en(e, t) {
  if (e && e instanceof $t) return e;
  let n = new $t();
  return (n.parse(e, t), n);
}
var tn,
  nn,
  rn,
  an,
  on,
  sn,
  cn,
  ln,
  un,
  dn,
  fn,
  pn,
  mn = t(() => {
    ((tn = /^([a-z0-9.+-]+:)/i),
      (nn = /:[0-9]*$/),
      (rn = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/),
      (an = [
        `{`,
        `}`,
        `|`,
        `\\`,
        `^`,
        "`",
        `<`,
        `>`,
        `"`,
        "`",
        ` `,
        `\r`,
        `
`,
        `	`,
      ]),
      (on = [`'`].concat(an)),
      (sn = [`%`, `/`, `?`, `;`, `#`].concat(on)),
      (cn = [`/`, `?`, `#`]),
      (ln = 255),
      (un = /^[+a-z0-9A-Z_-]{0,63}$/),
      (dn = /^([+a-z0-9A-Z_-]{0,63})(.*)$/),
      (fn = { javascript: !0, "javascript:": !0 }),
      (pn = {
        http: !0,
        https: !0,
        ftp: !0,
        gopher: !0,
        file: !0,
        "http:": !0,
        "https:": !0,
        "ftp:": !0,
        "gopher:": !0,
        "file:": !0,
      }),
      ($t.prototype.parse = function (e, t) {
        let n,
          r,
          i,
          a = e;
        if (((a = a.trim()), !t && e.split(`#`).length === 1)) {
          let e = rn.exec(a);
          if (e) return ((this.pathname = e[1]), e[2] && (this.search = e[2]), this);
        }
        let o = tn.exec(a);
        if (
          (o && ((o = o[0]), (n = o.toLowerCase()), (this.protocol = o), (a = a.substr(o.length))),
          (t || o || a.match(/^\/\/[^@\/]+@[^@\/]+/)) &&
            ((i = a.substr(0, 2) === `//`),
            i && !(o && fn[o]) && ((a = a.substr(2)), (this.slashes = !0))),
          !fn[o] && (i || (o && !pn[o])))
        ) {
          let e = -1;
          for (let t = 0; t < cn.length; t++)
            ((r = a.indexOf(cn[t])), r !== -1 && (e === -1 || r < e) && (e = r));
          let t, n;
          ((n = e === -1 ? a.lastIndexOf(`@`) : a.lastIndexOf(`@`, e)),
            n !== -1 && ((t = a.slice(0, n)), (a = a.slice(n + 1)), (this.auth = t)),
            (e = -1));
          for (let t = 0; t < sn.length; t++)
            ((r = a.indexOf(sn[t])), r !== -1 && (e === -1 || r < e) && (e = r));
          (e === -1 && (e = a.length), a[e - 1] === `:` && e--);
          let i = a.slice(0, e);
          ((a = a.slice(e)), this.parseHost(i), (this.hostname = this.hostname || ``));
          let o = this.hostname[0] === `[` && this.hostname[this.hostname.length - 1] === `]`;
          if (!o) {
            let e = this.hostname.split(/\./);
            for (let t = 0, n = e.length; t < n; t++) {
              let n = e[t];
              if (n && !n.match(un)) {
                let r = ``;
                for (let e = 0, t = n.length; e < t; e++)
                  n.charCodeAt(e) > 127 ? (r += `x`) : (r += n[e]);
                if (!r.match(un)) {
                  let r = e.slice(0, t),
                    i = e.slice(t + 1),
                    o = n.match(dn);
                  (o && (r.push(o[1]), i.unshift(o[2])),
                    i.length && (a = i.join(`.`) + a),
                    (this.hostname = r.join(`.`)));
                  break;
                }
              }
            }
          }
          (this.hostname.length > ln && (this.hostname = ``),
            o && (this.hostname = this.hostname.substr(1, this.hostname.length - 2)));
        }
        let s = a.indexOf(`#`);
        s !== -1 && ((this.hash = a.substr(s)), (a = a.slice(0, s)));
        let c = a.indexOf(`?`);
        return (
          c !== -1 && ((this.search = a.substr(c)), (a = a.slice(0, c))),
          a && (this.pathname = a),
          pn[n] && this.hostname && !this.pathname && (this.pathname = ``),
          this
        );
      }),
      ($t.prototype.parseHost = function (e) {
        let t = nn.exec(e);
        (t &&
          ((t = t[0]),
          t !== `:` && (this.port = t.substr(1)),
          (e = e.substr(0, e.length - t.length))),
          e && (this.hostname = e));
      }));
  }),
  hn = n({ decode: () => Gt, encode: () => K, format: () => Zt, parse: () => en }),
  gn = t(() => {
    (qt(), Xt(), Qt(), mn());
  }),
  _n,
  vn = t(() => {
    _n =
      /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
  }),
  yn,
  bn = t(() => {
    yn = /[\0-\x1F\x7F-\x9F]/;
  }),
  xn,
  Sn = t(() => {
    xn =
      /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u0890\u0891\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC3F]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/;
  }),
  Cn,
  wn = t(() => {
    Cn =
      /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1B7D\u1B7E\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDEAD\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/;
  }),
  Tn,
  En = t(() => {
    Tn =
      /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u0888\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20C0\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBC2\uFD40-\uFD4F\uFDCF\uFDFC-\uFDFF\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD833[\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED7\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF76\uDF7B-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDE53\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE88\uDE90-\uDEBD\uDEBF-\uDEC5\uDECE-\uDEDB\uDEE0-\uDEE8\uDEF0-\uDEF8\uDF00-\uDF92\uDF94-\uDFCA]/;
  }),
  Dn,
  On = t(() => {
    Dn = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/;
  }),
  kn = n({ Any: () => _n, Cc: () => yn, Cf: () => xn, P: () => Cn, S: () => Tn, Z: () => Dn }),
  An = t(() => {
    (vn(), bn(), Sn(), wn(), En(), On());
  }),
  jn,
  Mn = t(() => {
    jn = new Uint16Array(
      `ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻\xA0ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌`
        .split(``)
        .map((e) => e.charCodeAt(0)),
    );
  }),
  Nn,
  Pn = t(() => {
    Nn = new Uint16Array(
      `Ȁaglq	\x1Bɭ\0\0p;䀦os;䀧t;䀾t;䀼uot;䀢`.split(``).map((e) => e.charCodeAt(0)),
    );
  });
function Fn(e) {
  return (e >= 55296 && e <= 57343) || e > 1114111 ? 65533 : (In.get(e) ?? e);
}
var In,
  Ln,
  Rn = t(() => {
    ((In = new Map([
      [0, 65533],
      [128, 8364],
      [130, 8218],
      [131, 402],
      [132, 8222],
      [133, 8230],
      [134, 8224],
      [135, 8225],
      [136, 710],
      [137, 8240],
      [138, 352],
      [139, 8249],
      [140, 338],
      [142, 381],
      [145, 8216],
      [146, 8217],
      [147, 8220],
      [148, 8221],
      [149, 8226],
      [150, 8211],
      [151, 8212],
      [152, 732],
      [153, 8482],
      [154, 353],
      [155, 8250],
      [156, 339],
      [158, 382],
      [159, 376],
    ])),
      (Ln =
        String.fromCodePoint ??
        function (e) {
          let t = ``;
          return (
            e > 65535 &&
              ((e -= 65536),
              (t += String.fromCharCode(((e >>> 10) & 1023) | 55296)),
              (e = 56320 | (e & 1023))),
            (t += String.fromCharCode(e)),
            t
          );
        }));
  });
function zn(e) {
  return e >= q.ZERO && e <= q.NINE;
}
function Bn(e) {
  return (e >= q.UPPER_A && e <= q.UPPER_F) || (e >= q.LOWER_A && e <= q.LOWER_F);
}
function Vn(e) {
  return (e >= q.UPPER_A && e <= q.UPPER_Z) || (e >= q.LOWER_A && e <= q.LOWER_Z) || zn(e);
}
function Hn(e) {
  return e === q.EQUALS || Vn(e);
}
function Un(e) {
  let t = ``,
    n = new Xn(e, (e) => (t += Ln(e)));
  return function (e, r) {
    let i = 0,
      a = 0;
    for (; (a = e.indexOf(`&`, a)) >= 0;) {
      ((t += e.slice(i, a)), n.startEntity(r));
      let o = n.write(e, a + 1);
      if (o < 0) {
        i = a + n.end();
        break;
      }
      ((i = a + o), (a = o === 0 ? i + 1 : i));
    }
    let o = t + e.slice(i);
    return ((t = ``), o);
  };
}
function Wn(e, t, n, r) {
  let i = (t & Jn.BRANCH_LENGTH) >> 7,
    a = t & Jn.JUMP_TABLE;
  if (i === 0) return a !== 0 && r === a ? n : -1;
  if (a) {
    let t = r - a;
    return t < 0 || t >= i ? -1 : e[n + t] - 1;
  }
  let o = n,
    s = o + i - 1;
  for (; o <= s;) {
    let t = (o + s) >>> 1,
      n = e[t];
    if (n < r) o = t + 1;
    else if (n > r) s = t - 1;
    else return e[t + i];
  }
  return -1;
}
function Gn(e, t = Yn.Legacy) {
  return Zn(e, t);
}
function Kn(e) {
  return Zn(e, Yn.Strict);
}
var q,
  qn,
  Jn,
  J,
  Yn,
  Xn,
  Zn,
  Qn = t(() => {
    (Mn(),
      Pn(),
      Rn(),
      (function (e) {
        ((e[(e.NUM = 35)] = `NUM`),
          (e[(e.SEMI = 59)] = `SEMI`),
          (e[(e.EQUALS = 61)] = `EQUALS`),
          (e[(e.ZERO = 48)] = `ZERO`),
          (e[(e.NINE = 57)] = `NINE`),
          (e[(e.LOWER_A = 97)] = `LOWER_A`),
          (e[(e.LOWER_F = 102)] = `LOWER_F`),
          (e[(e.LOWER_X = 120)] = `LOWER_X`),
          (e[(e.LOWER_Z = 122)] = `LOWER_Z`),
          (e[(e.UPPER_A = 65)] = `UPPER_A`),
          (e[(e.UPPER_F = 70)] = `UPPER_F`),
          (e[(e.UPPER_Z = 90)] = `UPPER_Z`));
      })((q ||= {})),
      (qn = 32),
      (function (e) {
        ((e[(e.VALUE_LENGTH = 49152)] = `VALUE_LENGTH`),
          (e[(e.BRANCH_LENGTH = 16256)] = `BRANCH_LENGTH`),
          (e[(e.JUMP_TABLE = 127)] = `JUMP_TABLE`));
      })((Jn ||= {})),
      (function (e) {
        ((e[(e.EntityStart = 0)] = `EntityStart`),
          (e[(e.NumericStart = 1)] = `NumericStart`),
          (e[(e.NumericDecimal = 2)] = `NumericDecimal`),
          (e[(e.NumericHex = 3)] = `NumericHex`),
          (e[(e.NamedEntity = 4)] = `NamedEntity`));
      })((J ||= {})),
      (function (e) {
        ((e[(e.Legacy = 0)] = `Legacy`),
          (e[(e.Strict = 1)] = `Strict`),
          (e[(e.Attribute = 2)] = `Attribute`));
      })((Yn ||= {})),
      (Xn = class {
        constructor(e, t, n) {
          ((this.decodeTree = e),
            (this.emitCodePoint = t),
            (this.errors = n),
            (this.state = J.EntityStart),
            (this.consumed = 1),
            (this.result = 0),
            (this.treeIndex = 0),
            (this.excess = 1),
            (this.decodeMode = Yn.Strict));
        }
        startEntity(e) {
          ((this.decodeMode = e),
            (this.state = J.EntityStart),
            (this.result = 0),
            (this.treeIndex = 0),
            (this.excess = 1),
            (this.consumed = 1));
        }
        write(e, t) {
          switch (this.state) {
            case J.EntityStart:
              return e.charCodeAt(t) === q.NUM
                ? ((this.state = J.NumericStart),
                  (this.consumed += 1),
                  this.stateNumericStart(e, t + 1))
                : ((this.state = J.NamedEntity), this.stateNamedEntity(e, t));
            case J.NumericStart:
              return this.stateNumericStart(e, t);
            case J.NumericDecimal:
              return this.stateNumericDecimal(e, t);
            case J.NumericHex:
              return this.stateNumericHex(e, t);
            case J.NamedEntity:
              return this.stateNamedEntity(e, t);
          }
        }
        stateNumericStart(e, t) {
          return t >= e.length
            ? -1
            : (e.charCodeAt(t) | qn) === q.LOWER_X
              ? ((this.state = J.NumericHex), (this.consumed += 1), this.stateNumericHex(e, t + 1))
              : ((this.state = J.NumericDecimal), this.stateNumericDecimal(e, t));
        }
        addToNumericResult(e, t, n, r) {
          if (t !== n) {
            let i = n - t;
            ((this.result = this.result * r ** +i + parseInt(e.substr(t, i), r)),
              (this.consumed += i));
          }
        }
        stateNumericHex(e, t) {
          let n = t;
          for (; t < e.length;) {
            let r = e.charCodeAt(t);
            if (zn(r) || Bn(r)) t += 1;
            else return (this.addToNumericResult(e, n, t, 16), this.emitNumericEntity(r, 3));
          }
          return (this.addToNumericResult(e, n, t, 16), -1);
        }
        stateNumericDecimal(e, t) {
          let n = t;
          for (; t < e.length;) {
            let r = e.charCodeAt(t);
            if (zn(r)) t += 1;
            else return (this.addToNumericResult(e, n, t, 10), this.emitNumericEntity(r, 2));
          }
          return (this.addToNumericResult(e, n, t, 10), -1);
        }
        emitNumericEntity(e, t) {
          var n;
          if (this.consumed <= t)
            return (
              (n = this.errors) == null ||
                n.absenceOfDigitsInNumericCharacterReference(this.consumed),
              0
            );
          if (e === q.SEMI) this.consumed += 1;
          else if (this.decodeMode === Yn.Strict) return 0;
          return (
            this.emitCodePoint(Fn(this.result), this.consumed),
            this.errors &&
              (e !== q.SEMI && this.errors.missingSemicolonAfterCharacterReference(),
              this.errors.validateNumericCharacterReference(this.result)),
            this.consumed
          );
        }
        stateNamedEntity(e, t) {
          let { decodeTree: n } = this,
            r = n[this.treeIndex],
            i = (r & Jn.VALUE_LENGTH) >> 14;
          for (; t < e.length; t++, this.excess++) {
            let a = e.charCodeAt(t);
            if (
              ((this.treeIndex = Wn(n, r, this.treeIndex + Math.max(1, i), a)), this.treeIndex < 0)
            )
              return this.result === 0 || (this.decodeMode === Yn.Attribute && (i === 0 || Hn(a)))
                ? 0
                : this.emitNotTerminatedNamedEntity();
            if (((r = n[this.treeIndex]), (i = (r & Jn.VALUE_LENGTH) >> 14), i !== 0)) {
              if (a === q.SEMI)
                return this.emitNamedEntityData(this.treeIndex, i, this.consumed + this.excess);
              this.decodeMode !== Yn.Strict &&
                ((this.result = this.treeIndex), (this.consumed += this.excess), (this.excess = 0));
            }
          }
          return -1;
        }
        emitNotTerminatedNamedEntity() {
          var e;
          let { result: t, decodeTree: n } = this,
            r = (n[t] & Jn.VALUE_LENGTH) >> 14;
          return (
            this.emitNamedEntityData(t, r, this.consumed),
            (e = this.errors) == null || e.missingSemicolonAfterCharacterReference(),
            this.consumed
          );
        }
        emitNamedEntityData(e, t, n) {
          let { decodeTree: r } = this;
          return (
            this.emitCodePoint(t === 1 ? r[e] & ~Jn.VALUE_LENGTH : r[e + 1], n),
            t === 3 && this.emitCodePoint(r[e + 2], n),
            n
          );
        }
        end() {
          var e;
          switch (this.state) {
            case J.NamedEntity:
              return this.result !== 0 &&
                (this.decodeMode !== Yn.Attribute || this.result === this.treeIndex)
                ? this.emitNotTerminatedNamedEntity()
                : 0;
            case J.NumericDecimal:
              return this.emitNumericEntity(0, 2);
            case J.NumericHex:
              return this.emitNumericEntity(0, 3);
            case J.NumericStart:
              return (
                (e = this.errors) == null ||
                  e.absenceOfDigitsInNumericCharacterReference(this.consumed),
                0
              );
            case J.EntityStart:
              return 0;
          }
        }
      }),
      (Zn = Un(jn)),
      Un(Nn));
  }),
  $n,
  er,
  tr = t(() => {
    (Qn(),
      (function (e) {
        ((e[(e.XML = 0)] = `XML`), (e[(e.HTML = 1)] = `HTML`));
      })(($n ||= {})),
      (function (e) {
        ((e[(e.UTF8 = 0)] = `UTF8`),
          (e[(e.ASCII = 1)] = `ASCII`),
          (e[(e.Extensive = 2)] = `Extensive`),
          (e[(e.Attribute = 3)] = `Attribute`),
          (e[(e.Text = 4)] = `Text`));
      })((er ||= {})));
  }),
  nr = n({
    arrayReplaceAt: () => sr,
    asciiTrim: () => Sr,
    assign: () => or,
    escapeHtml: () => mr,
    escapeRE: () => hr,
    fromCodePoint: () => lr,
    has: () => ar,
    isMdAsciiPunct: () => yr,
    isPunctChar: () => _r,
    isPunctCharCode: () => vr,
    isSpace: () => Y,
    isString: () => ir,
    isValidEntityCode: () => cr,
    isWhiteSpace: () => gr,
    lib: () => jr,
    normalizeReference: () => br,
    unescapeAll: () => fr,
    unescapeMd: () => dr,
  });
function rr(e) {
  return Object.prototype.toString.call(e);
}
function ir(e) {
  return rr(e) === `[object String]`;
}
function ar(e, t) {
  return Cr.call(e, t);
}
function or(e) {
  return (
    Array.prototype.slice.call(arguments, 1).forEach(function (t) {
      if (t) {
        if (typeof t != `object`) throw TypeError(t + `must be object`);
        Object.keys(t).forEach(function (n) {
          e[n] = t[n];
        });
      }
    }),
    e
  );
}
function sr(e, t, n) {
  return [].concat(e.slice(0, t), n, e.slice(t + 1));
}
function cr(e) {
  return !(
    (e >= 55296 && e <= 57343) ||
    (e >= 64976 && e <= 65007) ||
    (e & 65535) == 65535 ||
    (e & 65535) == 65534 ||
    (e >= 0 && e <= 8) ||
    e === 11 ||
    (e >= 14 && e <= 31) ||
    (e >= 127 && e <= 159) ||
    e > 1114111
  );
}
function lr(e) {
  if (e > 65535) {
    e -= 65536;
    let t = 55296 + (e >> 10),
      n = 56320 + (e & 1023);
    return String.fromCharCode(t, n);
  }
  return String.fromCharCode(e);
}
function ur(e, t) {
  if (t.charCodeAt(0) === 35 && Er.test(t)) {
    let n = t[1].toLowerCase() === `x` ? parseInt(t.slice(2), 16) : parseInt(t.slice(1), 10);
    return cr(n) ? lr(n) : e;
  }
  let n = Gn(e);
  return n === e ? e : n;
}
function dr(e) {
  return e.indexOf(`\\`) < 0 ? e : e.replace(wr, `$1`);
}
function fr(e) {
  return e.indexOf(`\\`) < 0 && e.indexOf(`&`) < 0
    ? e
    : e.replace(Tr, function (e, t, n) {
        return t || ur(e, n);
      });
}
function pr(e) {
  return kr[e];
}
function mr(e) {
  return Dr.test(e) ? e.replace(Or, pr) : e;
}
function hr(e) {
  return e.replace(Ar, `\\$&`);
}
function Y(e) {
  switch (e) {
    case 9:
    case 32:
      return !0;
  }
  return !1;
}
function gr(e) {
  if (e >= 8192 && e <= 8202) return !0;
  switch (e) {
    case 9:
    case 10:
    case 11:
    case 12:
    case 13:
    case 32:
    case 160:
    case 5760:
    case 8239:
    case 8287:
    case 12288:
      return !0;
  }
  return !1;
}
function _r(e) {
  return Cn.test(e) || Tn.test(e);
}
function vr(e) {
  return _r(lr(e));
}
function yr(e) {
  switch (e) {
    case 33:
    case 34:
    case 35:
    case 36:
    case 37:
    case 38:
    case 39:
    case 40:
    case 41:
    case 42:
    case 43:
    case 44:
    case 45:
    case 46:
    case 47:
    case 58:
    case 59:
    case 60:
    case 61:
    case 62:
    case 63:
    case 64:
    case 91:
    case 92:
    case 93:
    case 94:
    case 95:
    case 96:
    case 123:
    case 124:
    case 125:
    case 126:
      return !0;
    default:
      return !1;
  }
}
function br(e) {
  return ((e = e.trim().replace(/\s+/g, ` `)), e.toLowerCase().toUpperCase());
}
function xr(e) {
  return e === 32 || e === 9 || e === 10 || e === 13;
}
function Sr(e) {
  let t = 0;
  for (; t < e.length && xr(e.charCodeAt(t)); t++);
  let n = e.length - 1;
  for (; n >= t && xr(e.charCodeAt(n)); n--);
  return e.slice(t, n + 1);
}
var Cr,
  wr,
  Tr,
  Er,
  Dr,
  Or,
  kr,
  Ar,
  jr,
  X = t(() => {
    (gn(),
      An(),
      tr(),
      (Cr = Object.prototype.hasOwnProperty),
      (wr = /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g),
      (Tr = RegExp(wr.source + `|&([a-z#][a-z0-9]{1,31});`, `gi`)),
      (Er = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i),
      (Dr = /[&<>"]/),
      (Or = /[&<>"]/g),
      (kr = { "&": `&amp;`, "<": `&lt;`, ">": `&gt;`, '"': `&quot;` }),
      (Ar = /[.?*+^$[\]\\(){}|-]/g),
      (jr = { mdurl: hn, ucmicro: kn }));
  });
function Mr(e, t, n) {
  let r,
    i,
    a,
    o,
    s = e.posMax,
    c = e.pos;
  for (e.pos = t + 1, r = 1; e.pos < s;) {
    if (((a = e.src.charCodeAt(e.pos)), a === 93 && (r--, r === 0))) {
      i = !0;
      break;
    }
    if (((o = e.pos), e.md.inline.skipToken(e), a === 91)) {
      if (o === e.pos - 1) r++;
      else if (n) return ((e.pos = c), -1);
    }
  }
  let l = -1;
  return (i && (l = e.pos), (e.pos = c), l);
}
var Nr = t(() => {});
function Pr(e, t, n) {
  let r,
    i = t,
    a = { ok: !1, pos: 0, str: `` };
  if (e.charCodeAt(i) === 60) {
    for (i++; i < n;) {
      if (((r = e.charCodeAt(i)), r === 10 || r === 60)) return a;
      if (r === 62) return ((a.pos = i + 1), (a.str = fr(e.slice(t + 1, i))), (a.ok = !0), a);
      if (r === 92 && i + 1 < n) {
        i += 2;
        continue;
      }
      i++;
    }
    return a;
  }
  let o = 0;
  for (; i < n && ((r = e.charCodeAt(i)), !(r === 32 || r < 32 || r === 127));) {
    if (r === 92 && i + 1 < n) {
      if (e.charCodeAt(i + 1) === 32) break;
      i += 2;
      continue;
    }
    if (r === 40 && (o++, o > 32)) return a;
    if (r === 41) {
      if (o === 0) break;
      o--;
    }
    i++;
  }
  return t === i || o !== 0 ? a : ((a.str = fr(e.slice(t, i))), (a.pos = i), (a.ok = !0), a);
}
var Fr = t(() => {
  X();
});
function Ir(e, t, n, r) {
  let i,
    a = t,
    o = { ok: !1, can_continue: !1, pos: 0, str: ``, marker: 0 };
  if (r) ((o.str = r.str), (o.marker = r.marker));
  else {
    if (a >= n) return o;
    let r = e.charCodeAt(a);
    if (r !== 34 && r !== 39 && r !== 40) return o;
    (t++, a++, r === 40 && (r = 41), (o.marker = r));
  }
  for (; a < n;) {
    if (((i = e.charCodeAt(a)), i === o.marker))
      return ((o.pos = a + 1), (o.str += fr(e.slice(t, a))), (o.ok = !0), o);
    if (i === 40 && o.marker === 41) return o;
    (i === 92 && a + 1 < n && a++, a++);
  }
  return ((o.can_continue = !0), (o.str += fr(e.slice(t, a))), o);
}
var Lr = t(() => {
    X();
  }),
  Rr = n({ parseLinkDestination: () => Pr, parseLinkLabel: () => Mr, parseLinkTitle: () => Ir }),
  zr = t(() => {
    (Nr(), Fr(), Lr());
  });
function Br() {
  this.rules = or({}, Vr);
}
var Vr,
  Hr = t(() => {
    (X(),
      (Vr = {}),
      (Vr.code_inline = function (e, t, n, r, i) {
        let a = e[t];
        return `<code` + i.renderAttrs(a) + `>` + mr(a.content) + `</code>`;
      }),
      (Vr.code_block = function (e, t, n, r, i) {
        let a = e[t];
        return (
          `<pre` +
          i.renderAttrs(a) +
          `><code>` +
          mr(e[t].content) +
          `</code></pre>
`
        );
      }),
      (Vr.fence = function (e, t, n, r, i) {
        let a = e[t],
          o = a.info ? fr(a.info).trim() : ``,
          s = ``,
          c = ``;
        if (o) {
          let e = o.split(/(\s+)/g);
          ((s = e[0]), (c = e.slice(2).join(``)));
        }
        let l;
        if (
          ((l = (n.highlight && n.highlight(a.content, s, c)) || mr(a.content)),
          l.indexOf(`<pre`) === 0)
        )
          return (
            l +
            `
`
          );
        if (o) {
          let e = a.attrIndex(`class`),
            t = a.attrs ? a.attrs.slice() : [];
          e < 0
            ? t.push([`class`, n.langPrefix + s])
            : ((t[e] = t[e].slice()), (t[e][1] += ` ` + n.langPrefix + s));
          let r = { attrs: t };
          return `<pre><code${i.renderAttrs(r)}>${l}</code></pre>\n`;
        }
        return `<pre><code${i.renderAttrs(a)}>${l}</code></pre>\n`;
      }),
      (Vr.image = function (e, t, n, r, i) {
        let a = e[t];
        return (
          (a.attrs[a.attrIndex(`alt`)][1] = i.renderInlineAsText(a.children, n, r)),
          i.renderToken(e, t, n)
        );
      }),
      (Vr.hardbreak = function (e, t, n) {
        return n.xhtmlOut
          ? `<br />
`
          : `<br>
`;
      }),
      (Vr.softbreak = function (e, t, n) {
        return n.breaks
          ? n.xhtmlOut
            ? `<br />
`
            : `<br>
`
          : `
`;
      }),
      (Vr.text = function (e, t) {
        return mr(e[t].content);
      }),
      (Vr.html_block = function (e, t) {
        return e[t].content;
      }),
      (Vr.html_inline = function (e, t) {
        return e[t].content;
      }),
      (Br.prototype.renderAttrs = function (e) {
        let t, n, r;
        if (!e.attrs) return ``;
        for (r = ``, t = 0, n = e.attrs.length; t < n; t++)
          r += ` ` + mr(e.attrs[t][0]) + `="` + mr(e.attrs[t][1]) + `"`;
        return r;
      }),
      (Br.prototype.renderToken = function (e, t, n) {
        let r = e[t],
          i = ``;
        if (r.hidden) return ``;
        (r.block &&
          r.nesting !== -1 &&
          t &&
          e[t - 1].hidden &&
          (i += `
`),
          (i += (r.nesting === -1 ? `</` : `<`) + r.tag),
          (i += this.renderAttrs(r)),
          r.nesting === 0 && n.xhtmlOut && (i += ` /`));
        let a = !1;
        if (r.block && ((a = !0), r.nesting === 1 && t + 1 < e.length)) {
          let n = e[t + 1];
          (n.type === `inline` || n.hidden || (n.nesting === -1 && n.tag === r.tag)) && (a = !1);
        }
        return (
          (i += a
            ? `>
`
            : `>`),
          i
        );
      }),
      (Br.prototype.renderInline = function (e, t, n) {
        let r = ``,
          i = this.rules;
        for (let a = 0, o = e.length; a < o; a++) {
          let o = e[a].type;
          i[o] === void 0 ? (r += this.renderToken(e, a, t)) : (r += i[o](e, a, t, n, this));
        }
        return r;
      }),
      (Br.prototype.renderInlineAsText = function (e, t, n) {
        let r = ``;
        for (let i = 0, a = e.length; i < a; i++)
          switch (e[i].type) {
            case `text`:
              r += e[i].content;
              break;
            case `image`:
              r += this.renderInlineAsText(e[i].children, t, n);
              break;
            case `html_inline`:
            case `html_block`:
              r += e[i].content;
              break;
            case `softbreak`:
            case `hardbreak`:
              r += `
`;
              break;
            default:
          }
        return r;
      }),
      (Br.prototype.render = function (e, t, n) {
        let r = ``,
          i = this.rules;
        for (let a = 0, o = e.length; a < o; a++) {
          let o = e[a].type;
          o === `inline`
            ? (r += this.renderInline(e[a].children, t, n))
            : i[o] === void 0
              ? (r += this.renderToken(e, a, t, n))
              : (r += i[o](e, a, t, n, this));
        }
        return r;
      }));
  });
function Z() {
  ((this.__rules__ = []), (this.__cache__ = null));
}
var Ur = t(() => {
  ((Z.prototype.__find__ = function (e) {
    for (let t = 0; t < this.__rules__.length; t++) if (this.__rules__[t].name === e) return t;
    return -1;
  }),
    (Z.prototype.__compile__ = function () {
      let e = this,
        t = [``];
      (e.__rules__.forEach(function (e) {
        e.enabled &&
          e.alt.forEach(function (e) {
            t.indexOf(e) < 0 && t.push(e);
          });
      }),
        (e.__cache__ = {}),
        t.forEach(function (t) {
          ((e.__cache__[t] = []),
            e.__rules__.forEach(function (n) {
              n.enabled && ((t && n.alt.indexOf(t) < 0) || e.__cache__[t].push(n.fn));
            }));
        }));
    }),
    (Z.prototype.at = function (e, t, n) {
      let r = this.__find__(e),
        i = n || {};
      if (r === -1) throw Error(`Parser rule not found: ` + e);
      ((this.__rules__[r].fn = t), (this.__rules__[r].alt = i.alt || []), (this.__cache__ = null));
    }),
    (Z.prototype.before = function (e, t, n, r) {
      let i = this.__find__(e),
        a = r || {};
      if (i === -1) throw Error(`Parser rule not found: ` + e);
      (this.__rules__.splice(i, 0, { name: t, enabled: !0, fn: n, alt: a.alt || [] }),
        (this.__cache__ = null));
    }),
    (Z.prototype.after = function (e, t, n, r) {
      let i = this.__find__(e),
        a = r || {};
      if (i === -1) throw Error(`Parser rule not found: ` + e);
      (this.__rules__.splice(i + 1, 0, { name: t, enabled: !0, fn: n, alt: a.alt || [] }),
        (this.__cache__ = null));
    }),
    (Z.prototype.push = function (e, t, n) {
      let r = n || {};
      (this.__rules__.push({ name: e, enabled: !0, fn: t, alt: r.alt || [] }),
        (this.__cache__ = null));
    }),
    (Z.prototype.enable = function (e, t) {
      Array.isArray(e) || (e = [e]);
      let n = [];
      return (
        e.forEach(function (e) {
          let r = this.__find__(e);
          if (r < 0) {
            if (t) return;
            throw Error(`Rules manager: invalid rule name ` + e);
          }
          ((this.__rules__[r].enabled = !0), n.push(e));
        }, this),
        (this.__cache__ = null),
        n
      );
    }),
    (Z.prototype.enableOnly = function (e, t) {
      (Array.isArray(e) || (e = [e]),
        this.__rules__.forEach(function (e) {
          e.enabled = !1;
        }),
        this.enable(e, t));
    }),
    (Z.prototype.disable = function (e, t) {
      Array.isArray(e) || (e = [e]);
      let n = [];
      return (
        e.forEach(function (e) {
          let r = this.__find__(e);
          if (r < 0) {
            if (t) return;
            throw Error(`Rules manager: invalid rule name ` + e);
          }
          ((this.__rules__[r].enabled = !1), n.push(e));
        }, this),
        (this.__cache__ = null),
        n
      );
    }),
    (Z.prototype.getRules = function (e) {
      return (this.__cache__ === null && this.__compile__(), this.__cache__[e] || []);
    }));
});
function Wr(e, t, n) {
  ((this.type = e),
    (this.tag = t),
    (this.attrs = null),
    (this.map = null),
    (this.nesting = n),
    (this.level = 0),
    (this.children = null),
    (this.content = ``),
    (this.markup = ``),
    (this.info = ``),
    (this.meta = null),
    (this.block = !1),
    (this.hidden = !1));
}
var Gr = t(() => {
  ((Wr.prototype.attrIndex = function (e) {
    if (!this.attrs) return -1;
    let t = this.attrs;
    for (let n = 0, r = t.length; n < r; n++) if (t[n][0] === e) return n;
    return -1;
  }),
    (Wr.prototype.attrPush = function (e) {
      this.attrs ? this.attrs.push(e) : (this.attrs = [e]);
    }),
    (Wr.prototype.attrSet = function (e, t) {
      let n = this.attrIndex(e),
        r = [e, t];
      n < 0 ? this.attrPush(r) : (this.attrs[n] = r);
    }),
    (Wr.prototype.attrGet = function (e) {
      let t = this.attrIndex(e),
        n = null;
      return (t >= 0 && (n = this.attrs[t][1]), n);
    }),
    (Wr.prototype.attrJoin = function (e, t) {
      let n = this.attrIndex(e);
      n < 0 ? this.attrPush([e, t]) : (this.attrs[n][1] = this.attrs[n][1] + ` ` + t);
    }));
});
function Kr(e, t, n) {
  ((this.src = e), (this.env = n), (this.tokens = []), (this.inlineMode = !1), (this.md = t));
}
var qr = t(() => {
  (Gr(), (Kr.prototype.Token = Wr));
});
function Jr(e) {
  let t;
  ((t = e.src.replace(
    Yr,
    `
`,
  )),
    (t = t.replace(Xr, `�`)),
    (e.src = t));
}
var Yr,
  Xr,
  Zr = t(() => {
    ((Yr = /\r\n?|\n/g), (Xr = /\0/g));
  });
function Qr(e) {
  let t;
  e.inlineMode
    ? ((t = new e.Token(`inline`, ``, 0)),
      (t.content = e.src),
      (t.map = [0, 1]),
      (t.children = []),
      e.tokens.push(t))
    : e.md.block.parse(e.src, e.md, e.env, e.tokens);
}
var $r = t(() => {});
function ei(e) {
  let t = e.tokens;
  for (let n = 0, r = t.length; n < r; n++) {
    let r = t[n];
    r.type === `inline` && e.md.inline.parse(r.content, e.md, e.env, r.children);
  }
}
var ti = t(() => {});
function ni(e) {
  return /^<a[>\s]/i.test(e);
}
function ri(e) {
  return /^<\/a\s*>/i.test(e);
}
function ii(e) {
  let t = e.tokens;
  if (e.md.options.linkify)
    for (let n = 0, r = t.length; n < r; n++) {
      if (t[n].type !== `inline` || !e.md.linkify.pretest(t[n].content)) continue;
      let r = t[n].children,
        i = 0;
      for (let a = r.length - 1; a >= 0; a--) {
        let o = r[a];
        if (o.type === `link_close`) {
          for (a--; r[a].level !== o.level && r[a].type !== `link_open`;) a--;
          continue;
        }
        if (
          (o.type === `html_inline` && (ni(o.content) && i > 0 && i--, ri(o.content) && i++),
          !(i > 0) && o.type === `text` && e.md.linkify.test(o.content))
        ) {
          let i = o.content,
            s = e.md.linkify.match(i),
            c = [],
            l = o.level,
            u = 0;
          s.length > 0 &&
            s[0].index === 0 &&
            a > 0 &&
            r[a - 1].type === `text_special` &&
            (s = s.slice(1));
          for (let t = 0; t < s.length; t++) {
            let n = s[t].url,
              r = e.md.normalizeLink(n);
            if (!e.md.validateLink(r)) continue;
            let a = s[t].text;
            a = s[t].schema
              ? s[t].schema === `mailto:` && !/^mailto:/i.test(a)
                ? e.md.normalizeLinkText(`mailto:` + a).replace(/^mailto:/, ``)
                : e.md.normalizeLinkText(a)
              : e.md.normalizeLinkText(`http://` + a).replace(/^http:\/\//, ``);
            let o = s[t].index;
            if (o > u) {
              let t = new e.Token(`text`, ``, 0);
              ((t.content = i.slice(u, o)), (t.level = l), c.push(t));
            }
            let d = new e.Token(`link_open`, `a`, 1);
            ((d.attrs = [[`href`, r]]),
              (d.level = l++),
              (d.markup = `linkify`),
              (d.info = `auto`),
              c.push(d));
            let f = new e.Token(`text`, ``, 0);
            ((f.content = a), (f.level = l), c.push(f));
            let p = new e.Token(`link_close`, `a`, -1);
            ((p.level = --l),
              (p.markup = `linkify`),
              (p.info = `auto`),
              c.push(p),
              (u = s[t].lastIndex));
          }
          if (u < i.length) {
            let t = new e.Token(`text`, ``, 0);
            ((t.content = i.slice(u)), (t.level = l), c.push(t));
          }
          t[n].children = r = sr(r, a, c);
        }
      }
    }
}
var ai = t(() => {
  X();
});
function oi(e, t) {
  return pi[t.toLowerCase()];
}
function si(e) {
  let t = 0;
  for (let n = e.length - 1; n >= 0; n--) {
    let r = e[n];
    (r.type === `text` && !t && (r.content = r.content.replace(fi, oi)),
      r.type === `link_open` && r.info === `auto` && t--,
      r.type === `link_close` && r.info === `auto` && t++);
  }
}
function ci(e) {
  let t = 0;
  for (let n = e.length - 1; n >= 0; n--) {
    let r = e[n];
    (r.type === `text` &&
      !t &&
      ui.test(r.content) &&
      (r.content = r.content
        .replace(/\+-/g, `±`)
        .replace(/\.{2,}/g, `…`)
        .replace(/([?!])…/g, `$1..`)
        .replace(/([?!]){4,}/g, `$1$1$1`)
        .replace(/,{2,}/g, `,`)
        .replace(/(^|[^-])---(?=[^-]|$)/gm, `$1—`)
        .replace(/(^|\s)--(?=\s|$)/gm, `$1–`)
        .replace(/(^|[^-\s])--(?=[^-\s]|$)/gm, `$1–`)),
      r.type === `link_open` && r.info === `auto` && t--,
      r.type === `link_close` && r.info === `auto` && t++);
  }
}
function li(e) {
  let t;
  if (e.md.options.typographer)
    for (t = e.tokens.length - 1; t >= 0; t--)
      e.tokens[t].type === `inline` &&
        (di.test(e.tokens[t].content) && si(e.tokens[t].children),
        ui.test(e.tokens[t].content) && ci(e.tokens[t].children));
}
var ui,
  di,
  fi,
  pi,
  mi = t(() => {
    ((ui = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/),
      (di = /\((c|tm|r)\)/i),
      (fi = /\((c|tm|r)\)/gi),
      (pi = { c: `©`, r: `®`, tm: `™` }));
  });
function hi(e, t, n, r) {
  (e[t] || (e[t] = []), e[t].push({ pos: n, ch: r }));
}
function gi(e, t) {
  let n = ``,
    r = 0;
  t.sort((e, t) => e.pos - t.pos);
  for (let i = 0; i < t.length; i++) {
    let a = t[i];
    ((n += e.slice(r, a.pos) + a.ch), (r = a.pos + 1));
  }
  return n + e.slice(r);
}
function _i(e, t) {
  let n,
    r = [],
    i = {};
  for (let a = 0; a < e.length; a++) {
    let o = e[a],
      s = e[a].level;
    for (n = r.length - 1; n >= 0 && !(r[n].level <= s); n--);
    if (((r.length = n + 1), o.type !== `text`)) continue;
    let c = o.content,
      l = 0,
      u = c.length;
    OUTER: for (; l < u;) {
      bi.lastIndex = l;
      let o = bi.exec(c);
      if (!o) break;
      let d = !0,
        f = !0;
      l = o.index + 1;
      let p = o[0] === `'`,
        m = 32;
      if (o.index - 1 >= 0) m = c.charCodeAt(o.index - 1);
      else
        for (n = a - 1; n >= 0 && !(e[n].type === `softbreak` || e[n].type === `hardbreak`); n--)
          if (e[n].content) {
            m = e[n].content.charCodeAt(e[n].content.length - 1);
            break;
          }
      let h = 32;
      if (l < u) h = c.charCodeAt(l);
      else
        for (
          n = a + 1;
          n < e.length && !(e[n].type === `softbreak` || e[n].type === `hardbreak`);
          n++
        )
          if (e[n].content) {
            h = e[n].content.charCodeAt(0);
            break;
          }
      let g = yr(m) || vr(m),
        _ = yr(h) || vr(h),
        v = gr(m),
        y = gr(h);
      if (
        (y ? (d = !1) : _ && (v || g || (d = !1)),
        v ? (f = !1) : g && (y || _ || (f = !1)),
        h === 34 && o[0] === `"` && m >= 48 && m <= 57 && (f = d = !1),
        d && f && ((d = g), (f = _)),
        !d && !f)
      ) {
        p && hi(i, a, o.index, xi);
        continue;
      }
      if (f)
        for (n = r.length - 1; n >= 0; n--) {
          let e = r[n];
          if (r[n].level < s) break;
          if (e.single === p && r[n].level === s) {
            e = r[n];
            let s, c;
            (p
              ? ((s = t.md.options.quotes[2]), (c = t.md.options.quotes[3]))
              : ((s = t.md.options.quotes[0]), (c = t.md.options.quotes[1])),
              hi(i, a, o.index, c),
              hi(i, e.token, e.pos, s),
              (r.length = n));
            continue OUTER;
          }
        }
      d ? r.push({ token: a, pos: o.index, single: p, level: s }) : f && p && hi(i, a, o.index, xi);
    }
  }
  Object.keys(i).forEach(function (t) {
    e[t].content = gi(e[t].content, i[t]);
  });
}
function vi(e) {
  if (e.md.options.typographer)
    for (let t = e.tokens.length - 1; t >= 0; t--)
      e.tokens[t].type !== `inline` || !yi.test(e.tokens[t].content) || _i(e.tokens[t].children, e);
}
var yi,
  bi,
  xi,
  Si = t(() => {
    (X(), (yi = /['"]/), (bi = /['"]/g), (xi = `’`));
  });
function Ci(e) {
  let t,
    n,
    r = e.tokens,
    i = r.length;
  for (let e = 0; e < i; e++) {
    if (r[e].type !== `inline`) continue;
    let i = r[e].children,
      a = i.length;
    for (t = 0; t < a; t++) i[t].type === `text_special` && (i[t].type = `text`);
    for (t = n = 0; t < a; t++)
      i[t].type === `text` && t + 1 < a && i[t + 1].type === `text`
        ? (i[t + 1].content = i[t].content + i[t + 1].content)
        : (t !== n && (i[n] = i[t]), n++);
    t !== n && (i.length = n);
  }
}
var wi = t(() => {});
function Ti() {
  this.ruler = new Z();
  for (let e = 0; e < Ei.length; e++) this.ruler.push(Ei[e][0], Ei[e][1]);
}
var Ei,
  Di = t(() => {
    (Ur(),
      qr(),
      Zr(),
      $r(),
      ti(),
      ai(),
      mi(),
      Si(),
      wi(),
      (Ei = [
        [`normalize`, Jr],
        [`block`, Qr],
        [`inline`, ei],
        [`linkify`, ii],
        [`replacements`, li],
        [`smartquotes`, vi],
        [`text_join`, Ci],
      ]),
      (Ti.prototype.process = function (e) {
        let t = this.ruler.getRules(``);
        for (let n = 0, r = t.length; n < r; n++) t[n](e);
      }),
      (Ti.prototype.State = Kr));
  });
function Oi(e, t, n, r) {
  ((this.src = e),
    (this.md = t),
    (this.env = n),
    (this.tokens = r),
    (this.bMarks = []),
    (this.eMarks = []),
    (this.tShift = []),
    (this.sCount = []),
    (this.bsCount = []),
    (this.blkIndent = 0),
    (this.line = 0),
    (this.lineMax = 0),
    (this.tight = !1),
    (this.ddIndent = -1),
    (this.listIndent = -1),
    (this.parentType = `root`),
    (this.level = 0));
  let i = this.src;
  for (let e = 0, t = 0, n = 0, r = 0, a = i.length, o = !1; t < a; t++) {
    let s = i.charCodeAt(t);
    if (!o)
      if (Y(s)) {
        (n++, s === 9 ? (r += 4 - (r % 4)) : r++);
        continue;
      } else o = !0;
    (s === 10 || t === a - 1) &&
      (s !== 10 && t++,
      this.bMarks.push(e),
      this.eMarks.push(t),
      this.tShift.push(n),
      this.sCount.push(r),
      this.bsCount.push(0),
      (o = !1),
      (n = 0),
      (r = 0),
      (e = t + 1));
  }
  (this.bMarks.push(i.length),
    this.eMarks.push(i.length),
    this.tShift.push(0),
    this.sCount.push(0),
    this.bsCount.push(0),
    (this.lineMax = this.bMarks.length - 1));
}
var ki = t(() => {
  (Gr(),
    X(),
    (Oi.prototype.push = function (e, t, n) {
      let r = new Wr(e, t, n);
      return (
        (r.block = !0),
        n < 0 && this.level--,
        (r.level = this.level),
        n > 0 && this.level++,
        this.tokens.push(r),
        r
      );
    }),
    (Oi.prototype.isEmpty = function (e) {
      return this.bMarks[e] + this.tShift[e] >= this.eMarks[e];
    }),
    (Oi.prototype.skipEmptyLines = function (e) {
      for (let t = this.lineMax; e < t && !(this.bMarks[e] + this.tShift[e] < this.eMarks[e]); e++);
      return e;
    }),
    (Oi.prototype.skipSpaces = function (e) {
      for (let t = this.src.length; e < t && Y(this.src.charCodeAt(e)); e++);
      return e;
    }),
    (Oi.prototype.skipSpacesBack = function (e, t) {
      if (e <= t) return e;
      for (; e > t;) if (!Y(this.src.charCodeAt(--e))) return e + 1;
      return e;
    }),
    (Oi.prototype.skipChars = function (e, t) {
      for (let n = this.src.length; e < n && this.src.charCodeAt(e) === t; e++);
      return e;
    }),
    (Oi.prototype.skipCharsBack = function (e, t, n) {
      if (e <= n) return e;
      for (; e > n;) if (t !== this.src.charCodeAt(--e)) return e + 1;
      return e;
    }),
    (Oi.prototype.getLines = function (e, t, n, r) {
      if (e >= t) return ``;
      let i = Array(t - e);
      for (let a = 0, o = e; o < t; o++, a++) {
        let e = 0,
          s = this.bMarks[o],
          c = s,
          l;
        for (l = o + 1 < t || r ? this.eMarks[o] + 1 : this.eMarks[o]; c < l && e < n;) {
          let t = this.src.charCodeAt(c);
          if (Y(t)) t === 9 ? (e += 4 - ((e + this.bsCount[o]) % 4)) : e++;
          else if (c - s < this.tShift[o]) e++;
          else break;
          c++;
        }
        e > n
          ? (i[a] = Array(e - n + 1).join(` `) + this.src.slice(c, l))
          : (i[a] = this.src.slice(c, l));
      }
      return i.join(``);
    }),
    (Oi.prototype.Token = Wr));
});
function Ai(e, t) {
  let n = e.bMarks[t] + e.tShift[t],
    r = e.eMarks[t];
  return e.src.slice(n, r);
}
function ji(e) {
  let t = [],
    n = e.length,
    r = 0,
    i = e.charCodeAt(r),
    a = !1,
    o = 0,
    s = ``;
  for (; r < n;)
    (i === 124 &&
      (a
        ? ((s += e.substring(o, r - 1)), (o = r))
        : (t.push(s + e.substring(o, r)), (s = ``), (o = r + 1))),
      (a = i === 92),
      r++,
      (i = e.charCodeAt(r)));
  return (t.push(s + e.substring(o)), t);
}
function Mi(e, t, n, r) {
  if (t + 2 > n) return !1;
  let i = t + 1;
  if (e.sCount[i] < e.blkIndent || e.sCount[i] - e.blkIndent >= 4) return !1;
  let a = e.bMarks[i] + e.tShift[i];
  if (a >= e.eMarks[i]) return !1;
  let o = e.src.charCodeAt(a++);
  if ((o !== 124 && o !== 45 && o !== 58) || a >= e.eMarks[i]) return !1;
  let s = e.src.charCodeAt(a++);
  if ((s !== 124 && s !== 45 && s !== 58 && !Y(s)) || (o === 45 && Y(s))) return !1;
  for (; a < e.eMarks[i];) {
    let t = e.src.charCodeAt(a);
    if (t !== 124 && t !== 45 && t !== 58 && !Y(t)) return !1;
    a++;
  }
  let c = Ai(e, t + 1),
    l = c.split(`|`),
    u = [];
  for (let e = 0; e < l.length; e++) {
    let t = l[e].trim();
    if (!t) {
      if (e === 0 || e === l.length - 1) continue;
      return !1;
    }
    if (!/^:?-+:?$/.test(t)) return !1;
    t.charCodeAt(t.length - 1) === 58
      ? u.push(t.charCodeAt(0) === 58 ? `center` : `right`)
      : t.charCodeAt(0) === 58
        ? u.push(`left`)
        : u.push(``);
  }
  if (((c = Ai(e, t).trim()), c.indexOf(`|`) === -1 || e.sCount[t] - e.blkIndent >= 4)) return !1;
  ((l = ji(c)),
    l.length && l[0] === `` && l.shift(),
    l.length && l[l.length - 1] === `` && l.pop());
  let d = l.length;
  if (d === 0 || d !== u.length) return !1;
  if (r) return !0;
  let f = e.parentType;
  e.parentType = `table`;
  let p = e.md.block.ruler.getRules(`blockquote`),
    m = e.push(`table_open`, `table`, 1),
    h = [t, 0];
  m.map = h;
  let g = e.push(`thead_open`, `thead`, 1);
  g.map = [t, t + 1];
  let _ = e.push(`tr_open`, `tr`, 1);
  _.map = [t, t + 1];
  for (let t = 0; t < l.length; t++) {
    let n = e.push(`th_open`, `th`, 1);
    u[t] && (n.attrs = [[`style`, `text-align:` + u[t]]]);
    let r = e.push(`inline`, ``, 0);
    ((r.content = l[t].trim()), (r.children = []), e.push(`th_close`, `th`, -1));
  }
  (e.push(`tr_close`, `tr`, -1), e.push(`thead_close`, `thead`, -1));
  let v,
    y = 0;
  for (i = t + 2; i < n && !(e.sCount[i] < e.blkIndent); i++) {
    let r = !1;
    for (let t = 0, a = p.length; t < a; t++)
      if (p[t](e, i, n, !0)) {
        r = !0;
        break;
      }
    if (
      r ||
      ((c = Ai(e, i).trim()), !c) ||
      e.sCount[i] - e.blkIndent >= 4 ||
      ((l = ji(c)),
      l.length && l[0] === `` && l.shift(),
      l.length && l[l.length - 1] === `` && l.pop(),
      (y += d - l.length),
      y > Ni)
    )
      break;
    if (i === t + 2) {
      let n = e.push(`tbody_open`, `tbody`, 1);
      n.map = v = [t + 2, 0];
    }
    let a = e.push(`tr_open`, `tr`, 1);
    a.map = [i, i + 1];
    for (let t = 0; t < d; t++) {
      let n = e.push(`td_open`, `td`, 1);
      u[t] && (n.attrs = [[`style`, `text-align:` + u[t]]]);
      let r = e.push(`inline`, ``, 0);
      ((r.content = l[t] ? l[t].trim() : ``), (r.children = []), e.push(`td_close`, `td`, -1));
    }
    e.push(`tr_close`, `tr`, -1);
  }
  return (
    v && (e.push(`tbody_close`, `tbody`, -1), (v[1] = i)),
    e.push(`table_close`, `table`, -1),
    (h[1] = i),
    (e.parentType = f),
    (e.line = i),
    !0
  );
}
var Ni,
  Pi = t(() => {
    (X(), (Ni = 65536));
  });
function Fi(e, t, n) {
  if (e.sCount[t] - e.blkIndent < 4) return !1;
  let r = t + 1,
    i = r;
  for (; r < n;) {
    if (e.isEmpty(r)) {
      r++;
      continue;
    }
    if (e.sCount[r] - e.blkIndent >= 4) {
      (r++, (i = r));
      continue;
    }
    break;
  }
  e.line = i;
  let a = e.push(`code_block`, `code`, 0);
  return (
    (a.content =
      e.getLines(t, i, 4 + e.blkIndent, !1) +
      `
`),
    (a.map = [t, e.line]),
    !0
  );
}
var Ii = t(() => {});
function Li(e, t, n, r) {
  let i = e.bMarks[t] + e.tShift[t],
    a = e.eMarks[t];
  if (e.sCount[t] - e.blkIndent >= 4 || i + 3 > a) return !1;
  let o = e.src.charCodeAt(i);
  if (o !== 126 && o !== 96) return !1;
  let s = i;
  i = e.skipChars(i, o);
  let c = i - s;
  if (c < 3) return !1;
  let l = e.src.slice(s, i),
    u = e.src.slice(i, a);
  if (o === 96 && u.indexOf(String.fromCharCode(o)) >= 0) return !1;
  if (r) return !0;
  let d = t,
    f = !1;
  for (
    ;
    d++,
      !(
        d >= n ||
        ((i = s = e.bMarks[d] + e.tShift[d]), (a = e.eMarks[d]), i < a && e.sCount[d] < e.blkIndent)
      );
  )
    if (
      e.src.charCodeAt(i) === o &&
      !(e.sCount[d] - e.blkIndent >= 4) &&
      ((i = e.skipChars(i, o)), !(i - s < c) && ((i = e.skipSpaces(i)), !(i < a)))
    ) {
      f = !0;
      break;
    }
  ((c = e.sCount[t]), (e.line = d + +!!f));
  let p = e.push(`fence`, `code`, 0);
  return (
    (p.info = u),
    (p.content = e.getLines(t + 1, d, c, !0)),
    (p.markup = l),
    (p.map = [t, e.line]),
    !0
  );
}
var Ri = t(() => {});
function zi(e, t, n, r) {
  let i = e.bMarks[t] + e.tShift[t],
    a = e.eMarks[t],
    o = e.lineMax;
  if (e.sCount[t] - e.blkIndent >= 4 || e.src.charCodeAt(i) !== 62) return !1;
  if (r) return !0;
  let s = [],
    c = [],
    l = [],
    u = [],
    d = e.md.block.ruler.getRules(`blockquote`),
    f = e.parentType;
  e.parentType = `blockquote`;
  let p = !1,
    m;
  for (m = t; m < n; m++) {
    let t = e.sCount[m] < e.blkIndent;
    if (((i = e.bMarks[m] + e.tShift[m]), (a = e.eMarks[m]), i >= a)) break;
    if (e.src.charCodeAt(i++) === 62 && !t) {
      let t = e.sCount[m] + 1,
        n,
        r;
      e.src.charCodeAt(i) === 32
        ? (i++, t++, (r = !1), (n = !0))
        : e.src.charCodeAt(i) === 9
          ? ((n = !0), (e.bsCount[m] + t) % 4 == 3 ? (i++, t++, (r = !1)) : (r = !0))
          : (n = !1);
      let o = t;
      for (s.push(e.bMarks[m]), e.bMarks[m] = i; i < a;) {
        let t = e.src.charCodeAt(i);
        if (Y(t)) t === 9 ? (o += 4 - ((o + e.bsCount[m] + +!!r) % 4)) : o++;
        else break;
        i++;
      }
      ((p = i >= a),
        c.push(e.bsCount[m]),
        (e.bsCount[m] = e.sCount[m] + 1 + +!!n),
        l.push(e.sCount[m]),
        (e.sCount[m] = o - t),
        u.push(e.tShift[m]),
        (e.tShift[m] = i - e.bMarks[m]));
      continue;
    }
    if (p) break;
    let r = !1;
    for (let t = 0, i = d.length; t < i; t++)
      if (d[t](e, m, n, !0)) {
        r = !0;
        break;
      }
    if (r) {
      ((e.lineMax = m),
        e.blkIndent !== 0 &&
          (s.push(e.bMarks[m]),
          c.push(e.bsCount[m]),
          u.push(e.tShift[m]),
          l.push(e.sCount[m]),
          (e.sCount[m] -= e.blkIndent)));
      break;
    }
    (s.push(e.bMarks[m]),
      c.push(e.bsCount[m]),
      u.push(e.tShift[m]),
      l.push(e.sCount[m]),
      (e.sCount[m] = -1));
  }
  let h = e.blkIndent;
  e.blkIndent = 0;
  let g = e.push(`blockquote_open`, `blockquote`, 1);
  g.markup = `>`;
  let _ = [t, 0];
  ((g.map = _), e.md.block.tokenize(e, t, m));
  let v = e.push(`blockquote_close`, `blockquote`, -1);
  ((v.markup = `>`), (e.lineMax = o), (e.parentType = f), (_[1] = e.line));
  for (let n = 0; n < u.length; n++)
    ((e.bMarks[n + t] = s[n]),
      (e.tShift[n + t] = u[n]),
      (e.sCount[n + t] = l[n]),
      (e.bsCount[n + t] = c[n]));
  return ((e.blkIndent = h), !0);
}
var Bi = t(() => {
  X();
});
function Vi(e, t, n, r) {
  let i = e.eMarks[t];
  if (e.sCount[t] - e.blkIndent >= 4) return !1;
  let a = e.bMarks[t] + e.tShift[t],
    o = e.src.charCodeAt(a++);
  if (o !== 42 && o !== 45 && o !== 95) return !1;
  let s = 1;
  for (; a < i;) {
    let t = e.src.charCodeAt(a++);
    if (t !== o && !Y(t)) return !1;
    t === o && s++;
  }
  if (s < 3) return !1;
  if (r) return !0;
  e.line = t + 1;
  let c = e.push(`hr`, `hr`, 0);
  return ((c.map = [t, e.line]), (c.markup = Array(s + 1).join(String.fromCharCode(o))), !0);
}
var Hi = t(() => {
  X();
});
function Ui(e, t) {
  let n = e.eMarks[t],
    r = e.bMarks[t] + e.tShift[t],
    i = e.src.charCodeAt(r++);
  return (i !== 42 && i !== 45 && i !== 43) || (r < n && !Y(e.src.charCodeAt(r))) ? -1 : r;
}
function Wi(e, t) {
  let n = e.bMarks[t] + e.tShift[t],
    r = e.eMarks[t],
    i = n;
  if (i + 1 >= r) return -1;
  let a = e.src.charCodeAt(i++);
  if (a < 48 || a > 57) return -1;
  for (;;) {
    if (i >= r) return -1;
    if (((a = e.src.charCodeAt(i++)), a >= 48 && a <= 57)) {
      if (i - n >= 10) return -1;
      continue;
    }
    if (a === 41 || a === 46) break;
    return -1;
  }
  return i < r && ((a = e.src.charCodeAt(i)), !Y(a)) ? -1 : i;
}
function Gi(e, t) {
  let n = e.level + 2;
  for (let r = t + 2, i = e.tokens.length - 2; r < i; r++)
    e.tokens[r].level === n &&
      e.tokens[r].type === `paragraph_open` &&
      ((e.tokens[r + 2].hidden = !0), (e.tokens[r].hidden = !0), (r += 2));
}
function Ki(e, t, n, r) {
  let i,
    a,
    o,
    s,
    c = t,
    l = !0;
  if (
    e.sCount[c] - e.blkIndent >= 4 ||
    (e.listIndent >= 0 && e.sCount[c] - e.listIndent >= 4 && e.sCount[c] < e.blkIndent)
  )
    return !1;
  let u = !1;
  r && e.parentType === `paragraph` && e.sCount[c] >= e.blkIndent && (u = !0);
  let d, f, p;
  if ((p = Wi(e, c)) >= 0) {
    if (
      ((d = !0), (o = e.bMarks[c] + e.tShift[c]), (f = Number(e.src.slice(o, p - 1))), u && f !== 1)
    )
      return !1;
  } else if ((p = Ui(e, c)) >= 0) d = !1;
  else return !1;
  if (u && e.skipSpaces(p) >= e.eMarks[c]) return !1;
  if (r) return !0;
  let m = e.src.charCodeAt(p - 1),
    h = e.tokens.length;
  d
    ? ((s = e.push(`ordered_list_open`, `ol`, 1)), f !== 1 && (s.attrs = [[`start`, f]]))
    : (s = e.push(`bullet_list_open`, `ul`, 1));
  let g = [c, 0];
  ((s.map = g), (s.markup = String.fromCharCode(m)));
  let _ = !1,
    v = e.md.block.ruler.getRules(`list`),
    y = e.parentType;
  for (e.parentType = `list`; c < n;) {
    ((a = p), (i = e.eMarks[c]));
    let t = e.sCount[c] + p - (e.bMarks[c] + e.tShift[c]),
      r = t;
    for (; a < i;) {
      let t = e.src.charCodeAt(a);
      if (t === 9) r += 4 - ((r + e.bsCount[c]) % 4);
      else if (t === 32) r++;
      else break;
      a++;
    }
    let u = a,
      f;
    ((f = u >= i ? 1 : r - t), f > 4 && (f = 1));
    let h = t + f;
    ((s = e.push(`list_item_open`, `li`, 1)), (s.markup = String.fromCharCode(m)));
    let g = [c, 0];
    ((s.map = g), d && (s.info = e.src.slice(o, p - 1)));
    let y = e.tight,
      b = e.tShift[c],
      x = e.sCount[c],
      S = e.listIndent;
    if (
      ((e.listIndent = e.blkIndent),
      (e.blkIndent = h),
      (e.tight = !0),
      (e.tShift[c] = u - e.bMarks[c]),
      (e.sCount[c] = r),
      u >= i && e.isEmpty(c + 1)
        ? (e.line = Math.min(e.line + 2, n))
        : e.md.block.tokenize(e, c, n, !0),
      (!e.tight || _) && (l = !1),
      (_ = e.line - c > 1 && e.isEmpty(e.line - 1)),
      (e.blkIndent = e.listIndent),
      (e.listIndent = S),
      (e.tShift[c] = b),
      (e.sCount[c] = x),
      (e.tight = y),
      (s = e.push(`list_item_close`, `li`, -1)),
      (s.markup = String.fromCharCode(m)),
      (c = e.line),
      (g[1] = c),
      c >= n || e.sCount[c] < e.blkIndent || e.sCount[c] - e.blkIndent >= 4)
    )
      break;
    let C = !1;
    for (let t = 0, r = v.length; t < r; t++)
      if (v[t](e, c, n, !0)) {
        C = !0;
        break;
      }
    if (C) break;
    if (d) {
      if (((p = Wi(e, c)), p < 0)) break;
      o = e.bMarks[c] + e.tShift[c];
    } else if (((p = Ui(e, c)), p < 0)) break;
    if (m !== e.src.charCodeAt(p - 1)) break;
  }
  return (
    (s = d ? e.push(`ordered_list_close`, `ol`, -1) : e.push(`bullet_list_close`, `ul`, -1)),
    (s.markup = String.fromCharCode(m)),
    (g[1] = c),
    (e.line = c),
    (e.parentType = y),
    l && Gi(e, h),
    !0
  );
}
var qi = t(() => {
  X();
});
function Ji(e, t, n, r) {
  let i = e.bMarks[t] + e.tShift[t],
    a = e.eMarks[t],
    o = t + 1;
  if (e.sCount[t] - e.blkIndent >= 4 || e.src.charCodeAt(i) !== 91) return !1;
  function s(t) {
    let n = e.lineMax;
    if (t >= n || e.isEmpty(t)) return null;
    let r = !1;
    if ((e.sCount[t] - e.blkIndent > 3 && (r = !0), e.sCount[t] < 0 && (r = !0), !r)) {
      let r = e.md.block.ruler.getRules(`reference`),
        i = e.parentType;
      e.parentType = `reference`;
      let a = !1;
      for (let i = 0, o = r.length; i < o; i++)
        if (r[i](e, t, n, !0)) {
          a = !0;
          break;
        }
      if (((e.parentType = i), a)) return null;
    }
    let i = e.bMarks[t] + e.tShift[t],
      a = e.eMarks[t];
    return e.src.slice(i, a + 1);
  }
  let c = e.src.slice(i, a + 1);
  a = c.length;
  let l = -1;
  for (i = 1; i < a; i++) {
    let e = c.charCodeAt(i);
    if (e === 91) return !1;
    if (e === 93) {
      l = i;
      break;
    } else if (e === 10) {
      let e = s(o);
      e !== null && ((c += e), (a = c.length), o++);
    } else if (e === 92 && (i++, i < a && c.charCodeAt(i) === 10)) {
      let e = s(o);
      e !== null && ((c += e), (a = c.length), o++);
    }
  }
  if (l < 0 || c.charCodeAt(l + 1) !== 58) return !1;
  for (i = l + 2; i < a; i++) {
    let e = c.charCodeAt(i);
    if (e === 10) {
      let e = s(o);
      e !== null && ((c += e), (a = c.length), o++);
    } else if (!Y(e)) break;
  }
  let u = e.md.helpers.parseLinkDestination(c, i, a);
  if (!u.ok) return !1;
  let d = e.md.normalizeLink(u.str);
  if (!e.md.validateLink(d)) return !1;
  i = u.pos;
  let f = i,
    p = o,
    m = i;
  for (; i < a; i++) {
    let e = c.charCodeAt(i);
    if (e === 10) {
      let e = s(o);
      e !== null && ((c += e), (a = c.length), o++);
    } else if (!Y(e)) break;
  }
  let h = e.md.helpers.parseLinkTitle(c, i, a);
  for (; h.can_continue;) {
    let t = s(o);
    if (t === null) break;
    ((c += t), (i = a), (a = c.length), o++, (h = e.md.helpers.parseLinkTitle(c, i, a, h)));
  }
  let g;
  for (
    i < a && m !== i && h.ok ? ((g = h.str), (i = h.pos)) : ((g = ``), (i = f), (o = p));
    i < a && Y(c.charCodeAt(i));
  )
    i++;
  if (i < a && c.charCodeAt(i) !== 10 && g)
    for (g = ``, i = f, o = p; i < a && Y(c.charCodeAt(i));) i++;
  if (i < a && c.charCodeAt(i) !== 10) return !1;
  let _ = br(c.slice(1, l));
  return _
    ? r
      ? !0
      : (e.env.references === void 0 && (e.env.references = {}),
        e.env.references[_] === void 0 && (e.env.references[_] = { title: g, href: d }),
        (e.line = o),
        !0)
    : !1;
}
var Yi = t(() => {
    X();
  }),
  Xi,
  Zi = t(() => {
    Xi =
      `address.article.aside.base.basefont.blockquote.body.caption.center.col.colgroup.dd.details.dialog.dir.div.dl.dt.fieldset.figcaption.figure.footer.form.frame.frameset.h1.h2.h3.h4.h5.h6.head.header.hr.html.iframe.legend.li.link.main.menu.menuitem.nav.noframes.ol.optgroup.option.p.param.search.section.summary.table.tbody.td.tfoot.th.thead.title.tr.track.ul`.split(
        `.`,
      );
  }),
  Qi,
  $i,
  ea = t(() => {
    ((Qi = RegExp(
      `^(?:<[A-Za-z][A-Za-z0-9\\-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^"'=<>\`\\x00-\\x20]+|'[^']*'|"[^"]*"))?)*\\s*\\/?>|<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>|<!---?>|<!--(?:[^-]|-[^-]|--[^>])*-->|<[?][\\s\\S]*?[?]>|<![A-Za-z][^>]*>|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>)`,
    )),
      ($i = RegExp(
        `^(?:<[A-Za-z][A-Za-z0-9\\-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^"'=<>\`\\x00-\\x20]+|'[^']*'|"[^"]*"))?)*\\s*\\/?>|<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>)`,
      )));
  });
function ta(e, t, n, r) {
  let i = e.bMarks[t] + e.tShift[t],
    a = e.eMarks[t];
  if (e.sCount[t] - e.blkIndent >= 4 || !e.md.options.html || e.src.charCodeAt(i) !== 60) return !1;
  let o = e.src.slice(i, a),
    s = 0;
  for (; s < na.length && !na[s][0].test(o); s++);
  if (s === na.length) return !1;
  if (r) return na[s][2];
  let c = t + 1,
    l = na[s][1].test(``);
  if (!na[s][1].test(o)) {
    for (; c < n && !(e.sCount[c] < e.blkIndent && (l || !e.isEmpty(c))); c++)
      if (
        ((i = e.bMarks[c] + e.tShift[c]),
        (a = e.eMarks[c]),
        (o = e.src.slice(i, a)),
        na[s][1].test(o))
      ) {
        o.length !== 0 && c++;
        break;
      }
  }
  e.line = c;
  let u = e.push(`html_block`, ``, 0);
  return ((u.map = [t, c]), (u.content = e.getLines(t, c, e.blkIndent, !0)), !0);
}
var na,
  ra = t(() => {
    (Zi(),
      ea(),
      (na = [
        [/^<(script|pre|style|textarea)(?=(\s|>|$))/i, /<\/(script|pre|style|textarea)>/i, !0],
        [/^<!--/, /-->/, !0],
        [/^<\?/, /\?>/, !0],
        [/^<![A-Z]/, />/, !0],
        [/^<!\[CDATA\[/, /\]\]>/, !0],
        [RegExp(`^</?(` + Xi.join(`|`) + `)(?=(\\s|/?>|$))`, `i`), /^$/, !0],
        [RegExp($i.source + `\\s*$`), /^$/, !1],
      ]));
  });
function ia(e, t, n, r) {
  let i = e.bMarks[t] + e.tShift[t],
    a = e.eMarks[t];
  if (e.sCount[t] - e.blkIndent >= 4) return !1;
  let o = e.src.charCodeAt(i);
  if (o !== 35 || i >= a) return !1;
  let s = 1;
  for (o = e.src.charCodeAt(++i); o === 35 && i < a && s <= 6;) (s++, (o = e.src.charCodeAt(++i)));
  if (s > 6 || (i < a && !Y(o))) return !1;
  if (r) return !0;
  a = e.skipSpacesBack(a, i);
  let c = e.skipCharsBack(a, 35, i);
  (c > i && Y(e.src.charCodeAt(c - 1)) && (a = c), (e.line = t + 1));
  let l = e.push(`heading_open`, `h` + String(s), 1);
  ((l.markup = `########`.slice(0, s)), (l.map = [t, e.line]));
  let u = e.push(`inline`, ``, 0);
  ((u.content = Sr(e.src.slice(i, a))), (u.map = [t, e.line]), (u.children = []));
  let d = e.push(`heading_close`, `h` + String(s), -1);
  return ((d.markup = `########`.slice(0, s)), !0);
}
var aa = t(() => {
  X();
});
function oa(e, t, n) {
  let r = e.md.block.ruler.getRules(`paragraph`);
  if (e.sCount[t] - e.blkIndent >= 4) return !1;
  let i = e.parentType;
  e.parentType = `paragraph`;
  let a = 0,
    o,
    s = t + 1;
  for (; s < n && !e.isEmpty(s); s++) {
    if (e.sCount[s] - e.blkIndent > 3) continue;
    if (e.sCount[s] >= e.blkIndent) {
      let t = e.bMarks[s] + e.tShift[s],
        n = e.eMarks[s];
      if (
        t < n &&
        ((o = e.src.charCodeAt(t)),
        (o === 45 || o === 61) && ((t = e.skipChars(t, o)), (t = e.skipSpaces(t)), t >= n))
      ) {
        a = o === 61 ? 1 : 2;
        break;
      }
    }
    if (e.sCount[s] < 0) continue;
    let t = !1;
    for (let i = 0, a = r.length; i < a; i++)
      if (r[i](e, s, n, !0)) {
        t = !0;
        break;
      }
    if (t) break;
  }
  if (!a) return ((e.parentType = i), !1);
  let c = Sr(e.getLines(t, s, e.blkIndent, !1));
  e.line = s + 1;
  let l = e.push(`heading_open`, `h` + String(a), 1);
  ((l.markup = String.fromCharCode(o)), (l.map = [t, e.line]));
  let u = e.push(`inline`, ``, 0);
  ((u.content = c), (u.map = [t, e.line - 1]), (u.children = []));
  let d = e.push(`heading_close`, `h` + String(a), -1);
  return ((d.markup = String.fromCharCode(o)), (e.parentType = i), !0);
}
var sa = t(() => {
  X();
});
function ca(e, t, n) {
  let r = e.md.block.ruler.getRules(`paragraph`),
    i = e.parentType,
    a = t + 1;
  for (e.parentType = `paragraph`; a < n && !e.isEmpty(a); a++) {
    if (e.sCount[a] - e.blkIndent > 3 || e.sCount[a] < 0) continue;
    let t = !1;
    for (let i = 0, o = r.length; i < o; i++)
      if (r[i](e, a, n, !0)) {
        t = !0;
        break;
      }
    if (t) break;
  }
  let o = Sr(e.getLines(t, a, e.blkIndent, !1));
  e.line = a;
  let s = e.push(`paragraph_open`, `p`, 1);
  s.map = [t, e.line];
  let c = e.push(`inline`, ``, 0);
  return (
    (c.content = o),
    (c.map = [t, e.line]),
    (c.children = []),
    e.push(`paragraph_close`, `p`, -1),
    (e.parentType = i),
    !0
  );
}
var la = t(() => {
  X();
});
function ua() {
  this.ruler = new Z();
  for (let e = 0; e < da.length; e++)
    this.ruler.push(da[e][0], da[e][1], { alt: (da[e][2] || []).slice() });
}
var da,
  fa = t(() => {
    (Ur(),
      ki(),
      Pi(),
      Ii(),
      Ri(),
      Bi(),
      Hi(),
      qi(),
      Yi(),
      ra(),
      aa(),
      sa(),
      la(),
      (da = [
        [`table`, Mi, [`paragraph`, `reference`]],
        [`code`, Fi],
        [`fence`, Li, [`paragraph`, `reference`, `blockquote`, `list`]],
        [`blockquote`, zi, [`paragraph`, `reference`, `blockquote`, `list`]],
        [`hr`, Vi, [`paragraph`, `reference`, `blockquote`, `list`]],
        [`list`, Ki, [`paragraph`, `reference`, `blockquote`]],
        [`reference`, Ji],
        [`html_block`, ta, [`paragraph`, `reference`, `blockquote`]],
        [`heading`, ia, [`paragraph`, `reference`, `blockquote`]],
        [`lheading`, oa],
        [`paragraph`, ca],
      ]),
      (ua.prototype.tokenize = function (e, t, n) {
        let r = this.ruler.getRules(``),
          i = r.length,
          a = e.md.options.maxNesting,
          o = t,
          s = !1;
        for (
          ;
          o < n && ((e.line = o = e.skipEmptyLines(o)), !(o >= n || e.sCount[o] < e.blkIndent));
        ) {
          if (e.level >= a) {
            e.line = n;
            break;
          }
          let t = e.line,
            c = !1;
          for (let a = 0; a < i; a++)
            if (((c = r[a](e, o, n, !1)), c)) {
              if (t >= e.line) throw Error(`block rule didn't increment state.line`);
              break;
            }
          if (!c) throw Error(`none of the block rules matched`);
          ((e.tight = !s),
            e.isEmpty(e.line - 1) && (s = !0),
            (o = e.line),
            o < n && e.isEmpty(o) && ((s = !0), o++, (e.line = o)));
        }
      }),
      (ua.prototype.parse = function (e, t, n, r) {
        if (!e) return;
        let i = new this.State(e, t, n, r);
        this.tokenize(i, i.line, i.lineMax);
      }),
      (ua.prototype.State = Oi));
  });
function pa(e, t, n, r) {
  ((this.src = e),
    (this.env = n),
    (this.md = t),
    (this.tokens = r),
    (this.tokens_meta = Array(r.length)),
    (this.pos = 0),
    (this.posMax = this.src.length),
    (this.level = 0),
    (this.pending = ``),
    (this.pendingLevel = 0),
    (this.cache = {}),
    (this.delimiters = []),
    (this._prev_delimiters = []),
    (this.backticks = {}),
    (this.backticksScanned = !1),
    (this.linkLevel = 0));
}
var ma = t(() => {
  (Gr(),
    X(),
    (pa.prototype.pushPending = function () {
      let e = new Wr(`text`, ``, 0);
      return (
        (e.content = this.pending),
        (e.level = this.pendingLevel),
        this.tokens.push(e),
        (this.pending = ``),
        e
      );
    }),
    (pa.prototype.push = function (e, t, n) {
      this.pending && this.pushPending();
      let r = new Wr(e, t, n),
        i = null;
      return (
        n < 0 && (this.level--, (this.delimiters = this._prev_delimiters.pop())),
        (r.level = this.level),
        n > 0 &&
          (this.level++,
          this._prev_delimiters.push(this.delimiters),
          (this.delimiters = []),
          (i = { delimiters: this.delimiters })),
        (this.pendingLevel = this.level),
        this.tokens.push(r),
        this.tokens_meta.push(i),
        r
      );
    }),
    (pa.prototype.scanDelims = function (e, t) {
      let n = this.posMax,
        r = this.src.charCodeAt(e),
        i;
      if (e === 0) i = 32;
      else if (e === 1) ((i = this.src.charCodeAt(0)), (i & 63488) == 55296 && (i = 65533));
      else if (((i = this.src.charCodeAt(e - 1)), (i & 64512) == 56320)) {
        let t = this.src.charCodeAt(e - 2);
        i = (t & 64512) == 55296 ? 65536 + ((t - 55296) << 10) + (i - 56320) : 65533;
      } else (i & 64512) == 55296 && (i = 65533);
      let a = e;
      for (; a < n && this.src.charCodeAt(a) === r;) a++;
      let o = a - e,
        s = a < n ? this.src.charCodeAt(a) : 32;
      if ((s & 64512) == 55296) {
        let e = this.src.charCodeAt(a + 1);
        s = (e & 64512) == 56320 ? 65536 + ((s - 55296) << 10) + (e - 56320) : 65533;
      } else (s & 64512) == 56320 && (s = 65533);
      let c = yr(i) || vr(i),
        l = yr(s) || vr(s),
        u = gr(i),
        d = gr(s),
        f = !d && (!l || u || c),
        p = !u && (!c || d || l);
      return { can_open: f && (t || !p || c), can_close: p && (t || !f || l), length: o };
    }),
    (pa.prototype.Token = Wr));
});
function ha(e) {
  switch (e) {
    case 10:
    case 33:
    case 35:
    case 36:
    case 37:
    case 38:
    case 42:
    case 43:
    case 45:
    case 58:
    case 60:
    case 61:
    case 62:
    case 64:
    case 91:
    case 92:
    case 93:
    case 94:
    case 95:
    case 96:
    case 123:
    case 125:
    case 126:
      return !0;
    default:
      return !1;
  }
}
function ga(e, t) {
  let n = e.pos;
  for (; n < e.posMax && !ha(e.src.charCodeAt(n));) n++;
  return n === e.pos ? !1 : (t || (e.pending += e.src.slice(e.pos, n)), (e.pos = n), !0);
}
var _a = t(() => {});
function va(e, t) {
  if (!e.md.options.linkify || e.linkLevel > 0) return !1;
  let n = e.pos,
    r = e.posMax;
  if (
    n + 3 > r ||
    e.src.charCodeAt(n) !== 58 ||
    e.src.charCodeAt(n + 1) !== 47 ||
    e.src.charCodeAt(n + 2) !== 47
  )
    return !1;
  let i = e.pending.match(ya);
  if (!i) return !1;
  let a = i[1],
    o = e.md.linkify.matchAtStart(e.src.slice(n - a.length));
  if (!o) return !1;
  let s = o.url;
  if (s.length <= a.length) return !1;
  let c = s.length;
  for (; c > 0 && s.charCodeAt(c - 1) === 42;) c--;
  c !== s.length && (s = s.slice(0, c));
  let l = e.md.normalizeLink(s);
  if (!e.md.validateLink(l)) return !1;
  if (!t) {
    e.pending = e.pending.slice(0, -a.length);
    let t = e.push(`link_open`, `a`, 1);
    ((t.attrs = [[`href`, l]]), (t.markup = `linkify`), (t.info = `auto`));
    let n = e.push(`text`, ``, 0);
    n.content = e.md.normalizeLinkText(s);
    let r = e.push(`link_close`, `a`, -1);
    ((r.markup = `linkify`), (r.info = `auto`));
  }
  return ((e.pos += s.length - a.length), !0);
}
var ya,
  ba = t(() => {
    ya = /(?:^|[^a-z0-9.+-])([a-z][a-z0-9.+-]*)$/i;
  });
function xa(e, t) {
  let n = e.pos;
  if (e.src.charCodeAt(n) !== 10) return !1;
  let r = e.pending.length - 1,
    i = e.posMax;
  if (!t)
    if (r >= 0 && e.pending.charCodeAt(r) === 32)
      if (r >= 1 && e.pending.charCodeAt(r - 1) === 32) {
        let t = r - 1;
        for (; t >= 1 && e.pending.charCodeAt(t - 1) === 32;) t--;
        ((e.pending = e.pending.slice(0, t)), e.push(`hardbreak`, `br`, 0));
      } else ((e.pending = e.pending.slice(0, -1)), e.push(`softbreak`, `br`, 0));
    else e.push(`softbreak`, `br`, 0);
  for (n++; n < i && Y(e.src.charCodeAt(n));) n++;
  return ((e.pos = n), !0);
}
var Sa = t(() => {
  X();
});
function Ca(e, t) {
  let n = e.pos,
    r = e.posMax;
  if (e.src.charCodeAt(n) !== 92 || (n++, n >= r)) return !1;
  let i = e.src.charCodeAt(n);
  if (i === 10) {
    for (t || e.push(`hardbreak`, `br`, 0), n++; n < r && ((i = e.src.charCodeAt(n)), Y(i));) n++;
    return ((e.pos = n), !0);
  }
  if (i === 32) {
    if (!t) {
      let t = e.push(`text_special`, ``, 0);
      ((t.content = `\\`), (t.markup = `\\`), (t.info = `escape`));
    }
    return ((e.pos = n), !0);
  }
  let a = e.src[n];
  if (i >= 55296 && i <= 56319 && n + 1 < r) {
    let t = e.src.charCodeAt(n + 1);
    t >= 56320 && t <= 57343 && ((a += e.src[n + 1]), n++);
  }
  let o = `\\` + a;
  if (!t) {
    let t = e.push(`text_special`, ``, 0);
    (i < 256 && wa[i] !== 0 ? (t.content = a) : (t.content = o),
      (t.markup = o),
      (t.info = `escape`));
  }
  return ((e.pos = n + 1), !0);
}
var wa,
  Ta = t(() => {
    (X(), (wa = []));
    for (let e = 0; e < 256; e++) wa.push(0);
    `\\!"#$%&'()*+,./:;<=>?@[]^_\`{|}~-`.split(``).forEach(function (e) {
      wa[e.charCodeAt(0)] = 1;
    });
  });
function Ea(e, t) {
  let n = e.pos;
  if (e.src.charCodeAt(n) !== 96) return !1;
  let r = n;
  n++;
  let i = e.posMax;
  for (; n < i && e.src.charCodeAt(n) === 96;) n++;
  let a = e.src.slice(r, n),
    o = a.length;
  if (e.backticksScanned && (e.backticks[o] || 0) <= r)
    return (t || (e.pending += a), (e.pos += o), !0);
  let s = n,
    c;
  for (; (c = e.src.indexOf("`", s)) !== -1;) {
    for (s = c + 1; s < i && e.src.charCodeAt(s) === 96;) s++;
    let r = s - c;
    if (r === o) {
      if (!t) {
        let t = e.push(`code_inline`, `code`, 0);
        ((t.markup = a),
          (t.content = e.src
            .slice(n, c)
            .replace(/\n/g, ` `)
            .replace(/^ (.+) $/, `$1`)));
      }
      return ((e.pos = s), !0);
    }
    e.backticks[r] = c;
  }
  return ((e.backticksScanned = !0), t || (e.pending += a), (e.pos += o), !0);
}
var Da = t(() => {});
function Oa(e, t) {
  let n = e.pos,
    r = e.src.charCodeAt(n);
  if (t || r !== 126) return !1;
  let i = e.scanDelims(e.pos, !0),
    a = i.length,
    o = String.fromCharCode(r);
  if (a < 2) return !1;
  let s;
  a % 2 && ((s = e.push(`text`, ``, 0)), (s.content = o), a--);
  for (let t = 0; t < a; t += 2)
    ((s = e.push(`text`, ``, 0)),
      (s.content = o + o),
      e.delimiters.push({
        marker: r,
        length: 0,
        token: e.tokens.length - 1,
        end: -1,
        open: i.can_open,
        close: i.can_close,
      }));
  return ((e.pos += i.length), !0);
}
function ka(e, t) {
  let n,
    r = [],
    i = t.length;
  for (let a = 0; a < i; a++) {
    let i = t[a];
    if (i.marker !== 126 || i.end === -1) continue;
    let o = t[i.end];
    ((n = e.tokens[i.token]),
      (n.type = `s_open`),
      (n.tag = `s`),
      (n.nesting = 1),
      (n.markup = `~~`),
      (n.content = ``),
      (n = e.tokens[o.token]),
      (n.type = `s_close`),
      (n.tag = `s`),
      (n.nesting = -1),
      (n.markup = `~~`),
      (n.content = ``),
      e.tokens[o.token - 1].type === `text` &&
        e.tokens[o.token - 1].content === `~` &&
        r.push(o.token - 1));
  }
  for (; r.length;) {
    let t = r.pop(),
      i = t + 1;
    for (; i < e.tokens.length && e.tokens[i].type === `s_close`;) i++;
    (i--, t !== i && ((n = e.tokens[i]), (e.tokens[i] = e.tokens[t]), (e.tokens[t] = n)));
  }
}
function Aa(e) {
  let t = e.tokens_meta,
    n = e.tokens_meta.length;
  ka(e, e.delimiters);
  for (let r = 0; r < n; r++) t[r] && t[r].delimiters && ka(e, t[r].delimiters);
}
var ja,
  Ma = t(() => {
    ja = { tokenize: Oa, postProcess: Aa };
  });
function Na(e, t) {
  let n = e.pos,
    r = e.src.charCodeAt(n);
  if (t || (r !== 95 && r !== 42)) return !1;
  let i = e.scanDelims(e.pos, r === 42);
  for (let t = 0; t < i.length; t++) {
    let t = e.push(`text`, ``, 0);
    ((t.content = String.fromCharCode(r)),
      e.delimiters.push({
        marker: r,
        length: i.length,
        token: e.tokens.length - 1,
        end: -1,
        open: i.can_open,
        close: i.can_close,
      }));
  }
  return ((e.pos += i.length), !0);
}
function Pa(e, t) {
  let n = t.length;
  for (let r = n - 1; r >= 0; r--) {
    let n = t[r];
    if ((n.marker !== 95 && n.marker !== 42) || n.end === -1) continue;
    let i = t[n.end],
      a =
        r > 0 &&
        t[r - 1].end === n.end + 1 &&
        t[r - 1].marker === n.marker &&
        t[r - 1].token === n.token - 1 &&
        t[n.end + 1].token === i.token + 1,
      o = String.fromCharCode(n.marker),
      s = e.tokens[n.token];
    ((s.type = a ? `strong_open` : `em_open`),
      (s.tag = a ? `strong` : `em`),
      (s.nesting = 1),
      (s.markup = a ? o + o : o),
      (s.content = ``));
    let c = e.tokens[i.token];
    ((c.type = a ? `strong_close` : `em_close`),
      (c.tag = a ? `strong` : `em`),
      (c.nesting = -1),
      (c.markup = a ? o + o : o),
      (c.content = ``),
      a &&
        ((e.tokens[t[r - 1].token].content = ``),
        (e.tokens[t[n.end + 1].token].content = ``),
        r--));
  }
}
function Fa(e) {
  let t = e.tokens_meta,
    n = e.tokens_meta.length;
  Pa(e, e.delimiters);
  for (let r = 0; r < n; r++) t[r] && t[r].delimiters && Pa(e, t[r].delimiters);
}
var Ia,
  La = t(() => {
    Ia = { tokenize: Na, postProcess: Fa };
  });
function Ra(e, t) {
  let n,
    r,
    i,
    a,
    o = ``,
    s = ``,
    c = e.pos,
    l = !0;
  if (e.src.charCodeAt(e.pos) !== 91) return !1;
  let u = e.pos,
    d = e.posMax,
    f = e.pos + 1,
    p = e.md.helpers.parseLinkLabel(e, e.pos, !0);
  if (p < 0) return !1;
  let m = p + 1;
  if (m < d && e.src.charCodeAt(m) === 40) {
    for (l = !1, m++; m < d && ((n = e.src.charCodeAt(m)), !(!Y(n) && n !== 10)); m++);
    if (m >= d) return !1;
    if (((c = m), (i = e.md.helpers.parseLinkDestination(e.src, m, e.posMax)), i.ok)) {
      for (
        o = e.md.normalizeLink(i.str), e.md.validateLink(o) ? (m = i.pos) : (o = ``), c = m;
        m < d && ((n = e.src.charCodeAt(m)), !(!Y(n) && n !== 10));
        m++
      );
      if (((i = e.md.helpers.parseLinkTitle(e.src, m, e.posMax)), m < d && c !== m && i.ok))
        for (s = i.str, m = i.pos; m < d && ((n = e.src.charCodeAt(m)), !(!Y(n) && n !== 10)); m++);
    }
    ((m >= d || e.src.charCodeAt(m) !== 41) && (l = !0), m++);
  }
  if (l) {
    if (e.env.references === void 0) return !1;
    if (
      (m < d && e.src.charCodeAt(m) === 91
        ? ((c = m + 1),
          (m = e.md.helpers.parseLinkLabel(e, m)),
          m >= 0 ? (r = e.src.slice(c, m++)) : (m = p + 1))
        : (m = p + 1),
      (r ||= e.src.slice(f, p)),
      (a = e.env.references[br(r)]),
      !a)
    )
      return ((e.pos = u), !1);
    ((o = a.href), (s = a.title));
  }
  if (!t) {
    ((e.pos = f), (e.posMax = p));
    let t = e.push(`link_open`, `a`, 1),
      n = [[`href`, o]];
    ((t.attrs = n),
      s && n.push([`title`, s]),
      e.linkLevel++,
      e.md.inline.tokenize(e),
      e.linkLevel--,
      e.push(`link_close`, `a`, -1));
  }
  return ((e.pos = m), (e.posMax = d), !0);
}
var za = t(() => {
  X();
});
function Ba(e, t) {
  let n,
    r,
    i,
    a,
    o,
    s,
    c,
    l,
    u = ``,
    d = e.pos,
    f = e.posMax;
  if (e.src.charCodeAt(e.pos) !== 33 || e.src.charCodeAt(e.pos + 1) !== 91) return !1;
  let p = e.pos + 2,
    m = e.md.helpers.parseLinkLabel(e, e.pos + 1, !1);
  if (m < 0) return !1;
  if (((a = m + 1), a < f && e.src.charCodeAt(a) === 40)) {
    for (a++; a < f && ((n = e.src.charCodeAt(a)), !(!Y(n) && n !== 10)); a++);
    if (a >= f) return !1;
    for (
      l = a,
        s = e.md.helpers.parseLinkDestination(e.src, a, e.posMax),
        s.ok && ((u = e.md.normalizeLink(s.str)), e.md.validateLink(u) ? (a = s.pos) : (u = ``)),
        l = a;
      a < f && ((n = e.src.charCodeAt(a)), !(!Y(n) && n !== 10));
      a++
    );
    if (((s = e.md.helpers.parseLinkTitle(e.src, a, e.posMax)), a < f && l !== a && s.ok))
      for (c = s.str, a = s.pos; a < f && ((n = e.src.charCodeAt(a)), !(!Y(n) && n !== 10)); a++);
    else c = ``;
    if (a >= f || e.src.charCodeAt(a) !== 41) return ((e.pos = d), !1);
    a++;
  } else {
    if (e.env.references === void 0) return !1;
    if (
      (a < f && e.src.charCodeAt(a) === 91
        ? ((l = a + 1),
          (a = e.md.helpers.parseLinkLabel(e, a)),
          a >= 0 ? (i = e.src.slice(l, a++)) : (a = m + 1))
        : (a = m + 1),
      (i ||= e.src.slice(p, m)),
      (o = e.env.references[br(i)]),
      !o)
    )
      return ((e.pos = d), !1);
    ((u = o.href), (c = o.title));
  }
  if (!t) {
    r = e.src.slice(p, m);
    let t = [];
    e.md.inline.parse(r, e.md, e.env, t);
    let n = e.push(`image`, `img`, 0),
      i = [
        [`src`, u],
        [`alt`, ``],
      ];
    ((n.attrs = i), (n.children = t), (n.content = r), c && i.push([`title`, c]));
  }
  return ((e.pos = a), (e.posMax = f), !0);
}
var Va = t(() => {
  X();
});
function Ha(e, t) {
  let n = e.pos;
  if (e.src.charCodeAt(n) !== 60) return !1;
  let r = e.pos,
    i = e.posMax;
  for (;;) {
    if (++n >= i) return !1;
    let t = e.src.charCodeAt(n);
    if (t === 60) return !1;
    if (t === 62) break;
  }
  let a = e.src.slice(r + 1, n);
  if (Wa.test(a)) {
    let n = e.md.normalizeLink(a);
    if (!e.md.validateLink(n)) return !1;
    if (!t) {
      let t = e.push(`link_open`, `a`, 1);
      ((t.attrs = [[`href`, n]]), (t.markup = `autolink`), (t.info = `auto`));
      let r = e.push(`text`, ``, 0);
      r.content = e.md.normalizeLinkText(a);
      let i = e.push(`link_close`, `a`, -1);
      ((i.markup = `autolink`), (i.info = `auto`));
    }
    return ((e.pos += a.length + 2), !0);
  }
  if (Ua.test(a)) {
    let n = e.md.normalizeLink(`mailto:` + a);
    if (!e.md.validateLink(n)) return !1;
    if (!t) {
      let t = e.push(`link_open`, `a`, 1);
      ((t.attrs = [[`href`, n]]), (t.markup = `autolink`), (t.info = `auto`));
      let r = e.push(`text`, ``, 0);
      r.content = e.md.normalizeLinkText(a);
      let i = e.push(`link_close`, `a`, -1);
      ((i.markup = `autolink`), (i.info = `auto`));
    }
    return ((e.pos += a.length + 2), !0);
  }
  return !1;
}
var Ua,
  Wa,
  Ga = t(() => {
    ((Ua =
      /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/),
      (Wa = /^([a-zA-Z][a-zA-Z0-9+.-]{1,31}):([^<>\x00-\x20]*)$/));
  });
function Ka(e) {
  return /^<a[>\s]/i.test(e);
}
function qa(e) {
  return /^<\/a\s*>/i.test(e);
}
function Ja(e) {
  let t = e | 32;
  return t >= 97 && t <= 122;
}
function Ya(e, t) {
  if (!e.md.options.html) return !1;
  let n = e.posMax,
    r = e.pos;
  if (e.src.charCodeAt(r) !== 60 || r + 2 >= n) return !1;
  let i = e.src.charCodeAt(r + 1);
  if (i !== 33 && i !== 63 && i !== 47 && !Ja(i)) return !1;
  let a = e.src.slice(r).match(Qi);
  if (!a) return !1;
  if (!t) {
    let t = e.push(`html_inline`, ``, 0);
    ((t.content = a[0]), Ka(t.content) && e.linkLevel++, qa(t.content) && e.linkLevel--);
  }
  return ((e.pos += a[0].length), !0);
}
var Xa = t(() => {
  ea();
});
function Za(e, t) {
  let n = e.pos,
    r = e.posMax;
  if (e.src.charCodeAt(n) !== 38 || n + 1 >= r) return !1;
  if (e.src.charCodeAt(n + 1) === 35) {
    let r = e.src.slice(n).match(Qa);
    if (r) {
      if (!t) {
        let t = r[1][0].toLowerCase() === `x` ? parseInt(r[1].slice(1), 16) : parseInt(r[1], 10),
          n = e.push(`text_special`, ``, 0);
        ((n.content = cr(t) ? lr(t) : lr(65533)), (n.markup = r[0]), (n.info = `entity`));
      }
      return ((e.pos += r[0].length), !0);
    }
  } else {
    let r = e.src.slice(n).match($a);
    if (r) {
      let n = Kn(r[0]);
      if (n !== r[0]) {
        if (!t) {
          let t = e.push(`text_special`, ``, 0);
          ((t.content = n), (t.markup = r[0]), (t.info = `entity`));
        }
        return ((e.pos += r[0].length), !0);
      }
    }
  }
  return !1;
}
var Qa,
  $a,
  eo = t(() => {
    (tr(), X(), (Qa = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i), ($a = /^&([a-z][a-z0-9]{1,31});/i));
  });
function to(e) {
  let t = {},
    n = e.length;
  if (!n) return;
  let r = 0,
    i = -2,
    a = [];
  for (let o = 0; o < n; o++) {
    let n = e[o];
    if (
      (a.push(0),
      (e[r].marker !== n.marker || i !== n.token - 1) && (r = o),
      (i = n.token),
      (n.length = n.length || 0),
      !n.close)
    )
      continue;
    t.hasOwnProperty(n.marker) || (t[n.marker] = [-1, -1, -1, -1, -1, -1]);
    let s = t[n.marker][(n.open ? 3 : 0) + (n.length % 3)],
      c = r - a[r] - 1,
      l = c;
    for (; c > s; c -= a[c] + 1) {
      let t = e[c];
      if (t.marker === n.marker && t.open && t.end < 0) {
        let r = !1;
        if (
          ((t.close || n.open) &&
            (t.length + n.length) % 3 == 0 &&
            (t.length % 3 != 0 || n.length % 3 != 0) &&
            (r = !0),
          !r)
        ) {
          let r = c > 0 && !e[c - 1].open ? a[c - 1] + 1 : 0;
          ((a[o] = o - c + r),
            (a[c] = r),
            (n.open = !1),
            (t.end = o),
            (t.close = !1),
            (l = -1),
            (i = -2));
          break;
        }
      }
    }
    l !== -1 && (t[n.marker][(n.open ? 3 : 0) + ((n.length || 0) % 3)] = l);
  }
}
function no(e) {
  let t = e.tokens_meta,
    n = e.tokens_meta.length;
  to(e.delimiters);
  for (let e = 0; e < n; e++) t[e] && t[e].delimiters && to(t[e].delimiters);
}
var ro = t(() => {});
function io(e) {
  let t,
    n,
    r = 0,
    i = e.tokens,
    a = e.tokens.length;
  for (t = n = 0; t < a; t++)
    (i[t].nesting < 0 && r--,
      (i[t].level = r),
      i[t].nesting > 0 && r++,
      i[t].type === `text` && t + 1 < a && i[t + 1].type === `text`
        ? (i[t + 1].content = i[t].content + i[t + 1].content)
        : (t !== n && (i[n] = i[t]), n++));
  t !== n && (i.length = n);
}
var ao = t(() => {});
function oo() {
  this.ruler = new Z();
  for (let e = 0; e < so.length; e++) this.ruler.push(so[e][0], so[e][1]);
  this.ruler2 = new Z();
  for (let e = 0; e < co.length; e++) this.ruler2.push(co[e][0], co[e][1]);
}
var so,
  co,
  lo = t(() => {
    (Ur(),
      ma(),
      _a(),
      ba(),
      Sa(),
      Ta(),
      Da(),
      Ma(),
      La(),
      za(),
      Va(),
      Ga(),
      Xa(),
      eo(),
      ro(),
      ao(),
      (so = [
        [`text`, ga],
        [`linkify`, va],
        [`newline`, xa],
        [`escape`, Ca],
        [`backticks`, Ea],
        [`strikethrough`, ja.tokenize],
        [`emphasis`, Ia.tokenize],
        [`link`, Ra],
        [`image`, Ba],
        [`autolink`, Ha],
        [`html_inline`, Ya],
        [`entity`, Za],
      ]),
      (co = [
        [`balance_pairs`, no],
        [`strikethrough`, ja.postProcess],
        [`emphasis`, Ia.postProcess],
        [`fragments_join`, io],
      ]),
      (oo.prototype.skipToken = function (e) {
        let t = e.pos,
          n = this.ruler.getRules(``),
          r = n.length,
          i = e.md.options.maxNesting,
          a = e.cache;
        if (a[t] !== void 0) {
          e.pos = a[t];
          return;
        }
        let o = !1;
        if (e.level < i) {
          for (let i = 0; i < r; i++)
            if ((e.level++, (o = n[i](e, !0)), e.level--, o)) {
              if (t >= e.pos) throw Error(`inline rule didn't increment state.pos`);
              break;
            }
        } else e.pos = e.posMax;
        (o || e.pos++, (a[t] = e.pos));
      }),
      (oo.prototype.tokenize = function (e) {
        let t = this.ruler.getRules(``),
          n = t.length,
          r = e.posMax,
          i = e.md.options.maxNesting;
        for (; e.pos < r;) {
          let a = e.pos,
            o = !1;
          if (e.level < i) {
            for (let r = 0; r < n; r++)
              if (((o = t[r](e, !1)), o)) {
                if (a >= e.pos) throw Error(`inline rule didn't increment state.pos`);
                break;
              }
          }
          if (o) {
            if (e.pos >= r) break;
            continue;
          }
          e.pending += e.src[e.pos++];
        }
        e.pending && e.pushPending();
      }),
      (oo.prototype.parse = function (e, t, n, r) {
        let i = new this.State(e, t, n, r);
        this.tokenize(i);
        let a = this.ruler2.getRules(``),
          o = a.length;
        for (let e = 0; e < o; e++) a[e](i);
      }),
      (oo.prototype.State = pa));
  });
function uo(e) {
  let t = {};
  ((e ||= {}),
    (t.src_Any = _n.source),
    (t.src_Cc = yn.source),
    (t.src_Z = Dn.source),
    (t.src_P = Cn.source),
    (t.src_ZPCc = [t.src_Z, t.src_P, t.src_Cc].join(`|`)),
    (t.src_ZCc = [t.src_Z, t.src_Cc].join(`|`)));
  let n = `[><｜]`;
  return (
    (t.src_pseudo_letter = `(?:(?!${n}|${t.src_ZPCc})${t.src_Any})`),
    (t.src_ip4 = `(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)`),
    (t.src_auth = `(?:(?:(?!${t.src_ZCc}|[@/\\[\\]()]).){1,50}@)?`),
    (t.src_port = `(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?`),
    (t.src_host_terminator = `(?=$|${n}|${t.src_ZPCc})(?!${e[`---`] ? `-(?!--)|` : `-|`}_|:\\d|\\.-|\\.(?!$|${t.src_ZPCc}))`),
    (t.src_path =
      `(?:[/?#](?:(?!${t.src_ZCc}|${n}|[()[\\]{}.,"'?!\\-;]).|\\[(?:(?!${t.src_ZCc}|\\]).)*\\]|\\((?:(?!${t.src_ZCc}|[)]).)*\\)|\\{(?:(?!${t.src_ZCc}|[}]).)*\\}|\\"(?:(?!${t.src_ZCc}|["]).)+\\"|\\'(?:(?!${t.src_ZCc}|[']).)+\\'|\\'(?=${t.src_pseudo_letter}|[-])|\\.{2,}[a-zA-Z0-9%/&]|\\.(?!${t.src_ZCc}|[.]|$)|` +
      (e[`---`] ? `\\-(?!--(?:[^-]|$))(?:-*)|` : `\\-+|`) +
      `,(?!${t.src_ZCc}|$)|;(?!${t.src_ZCc}|$)|\\!+(?!${t.src_ZCc}|[!]|$)|\\?(?!${t.src_ZCc}|[?]|$))+|\\/)?`),
    (t.src_email_name = `[\\-;:&=\\+\\$,\\.a-zA-Z0-9_][\\-;:&=\\+\\$,\\"\\.a-zA-Z0-9_]{0,63}`),
    (t.src_xn = `xn--[a-z0-9\\-]{1,59}`),
    (t.src_domain_root = `(?:` + t.src_xn + `|${t.src_pseudo_letter}{1,63})`),
    (t.src_domain =
      `(?:` +
      t.src_xn +
      `|(?:${t.src_pseudo_letter})|(?:${t.src_pseudo_letter}(?:-|${t.src_pseudo_letter}){0,61}${t.src_pseudo_letter}))`),
    (t.src_host = `(?:(?:(?:(?:${t.src_domain})\\.)*${t.src_domain}))`),
    (t.tpl_host_fuzzy = `(?:` + t.src_ip4 + `|(?:(?:(?:${t.src_domain})\\.)+(?:%TLDS%)))`),
    (t.tpl_host_no_ip_fuzzy = `(?:(?:(?:${t.src_domain})\\.)+(?:%TLDS%))`),
    (t.src_host_strict = t.src_host + t.src_host_terminator),
    (t.tpl_host_fuzzy_strict = t.tpl_host_fuzzy + t.src_host_terminator),
    (t.src_host_port_strict = t.src_host + t.src_port + t.src_host_terminator),
    (t.tpl_host_port_fuzzy_strict = t.tpl_host_fuzzy + t.src_port + t.src_host_terminator),
    (t.tpl_host_port_no_ip_fuzzy_strict =
      t.tpl_host_no_ip_fuzzy + t.src_port + t.src_host_terminator),
    (t.tpl_host_fuzzy_test = `localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:${t.src_ZPCc}|>|$))`),
    (t.tpl_email_fuzzy = `(^|${n}|"|\\(|${t.src_ZCc})(${t.src_email_name}@${t.tpl_host_fuzzy_strict})`),
    (t.tpl_link_fuzzy = `(^|(?![.:/\\-_@])(?:[$+<=>^\`|\uff5c]|${t.src_ZPCc}))((?![$+<=>^\`|\uff5c])${t.tpl_host_port_fuzzy_strict}${t.src_path})`),
    (t.tpl_link_no_ip_fuzzy = `(^|(?![.:/\\-_@])(?:[$+<=>^\`|\uff5c]|${t.src_ZPCc}))((?![$+<=>^\`|\uff5c])${t.tpl_host_port_no_ip_fuzzy_strict}${t.src_path})`),
    t
  );
}
var fo = t(() => {
  An();
});
function po(e) {
  return (
    Array.prototype.slice.call(arguments, 1).forEach(function (t) {
      t &&
        Object.keys(t).forEach(function (n) {
          e[n] = t[n];
        });
    }),
    e
  );
}
function mo(e) {
  return Object.prototype.toString.call(e);
}
function ho(e) {
  return mo(e) === `[object String]`;
}
function go(e) {
  return mo(e) === `[object Object]`;
}
function _o(e) {
  return mo(e) === `[object RegExp]`;
}
function vo(e) {
  return mo(e) === `[object Function]`;
}
function yo(e) {
  return e.replace(/[.?*+^$[\]\\(){}|-]/g, `\\$&`);
}
function bo(e) {
  return Object.keys(e || {}).reduce(function (e, t) {
    return e || To.hasOwnProperty(t);
  }, !1);
}
function xo(e) {
  return function (t, n) {
    let r = t.slice(n);
    return e.test(r) ? r.match(e)[0].length : 0;
  };
}
function So() {
  return function (e, t) {
    t.normalize(e);
  };
}
function Co(e) {
  let t = (e.re = uo(e.__opts__)),
    n = e.__tlds__.slice();
  (e.onCompile(), e.__tlds_replaced__ || n.push(Do), n.push(t.src_xn), (t.src_tlds = n.join(`|`)));
  function r(e) {
    return e.replace(`%TLDS%`, t.src_tlds);
  }
  ((t.email_fuzzy = RegExp(r(t.tpl_email_fuzzy), `i`)),
    (t.email_fuzzy_global = RegExp(r(t.tpl_email_fuzzy), `ig`)),
    (t.link_fuzzy = RegExp(r(t.tpl_link_fuzzy), `i`)),
    (t.link_fuzzy_global = RegExp(r(t.tpl_link_fuzzy), `ig`)),
    (t.link_no_ip_fuzzy = RegExp(r(t.tpl_link_no_ip_fuzzy), `i`)),
    (t.link_no_ip_fuzzy_global = RegExp(r(t.tpl_link_no_ip_fuzzy), `ig`)),
    (t.host_fuzzy_test = RegExp(r(t.tpl_host_fuzzy_test), `i`)));
  let i = [];
  e.__compiled__ = {};
  function a(e, t) {
    throw Error(`(LinkifyIt) Invalid schema "${e}": ${t}`);
  }
  (Object.keys(e.__schemas__).forEach(function (t) {
    let n = e.__schemas__[t];
    if (n === null) return;
    let r = { validate: null, link: null };
    if (((e.__compiled__[t] = r), go(n))) {
      (_o(n.validate)
        ? (r.validate = xo(n.validate))
        : vo(n.validate)
          ? (r.validate = n.validate)
          : a(t, n),
        vo(n.normalize)
          ? (r.normalize = n.normalize)
          : n.normalize
            ? a(t, n)
            : (r.normalize = So()));
      return;
    }
    if (ho(n)) {
      i.push(t);
      return;
    }
    a(t, n);
  }),
    i.forEach(function (t) {
      e.__compiled__[e.__schemas__[t]] &&
        ((e.__compiled__[t].validate = e.__compiled__[e.__schemas__[t]].validate),
        (e.__compiled__[t].normalize = e.__compiled__[e.__schemas__[t]].normalize));
    }),
    (e.__compiled__[``] = { validate: null, normalize: So() }));
  let o = Object.keys(e.__compiled__)
    .filter(function (t) {
      return t.length > 0 && e.__compiled__[t];
    })
    .map(yo)
    .join(`|`);
  ((e.re.schema_test = RegExp(`(^|(?!_)(?:[><\uff5c]|${t.src_ZPCc}))(${o})`, `i`)),
    (e.re.schema_search = RegExp(`(^|(?!_)(?:[><\uff5c]|${t.src_ZPCc}))(${o})`, `ig`)),
    (e.re.schema_at_start = RegExp(`^${e.re.schema_search.source}`, `i`)),
    (e.re.pretest = RegExp(
      `(${e.re.schema_test.source})|(${e.re.host_fuzzy_test.source})|@`,
      `i`,
    )));
}
function wo(e, t, n, r) {
  let i = e.slice(n, r);
  ((this.schema = t.toLowerCase()),
    (this.index = n),
    (this.lastIndex = r),
    (this.raw = i),
    (this.text = i),
    (this.url = i));
}
function Q(e, t) {
  if (!(this instanceof Q)) return new Q(e, t);
  (t || (bo(e) && ((t = e), (e = {}))),
    (this.__opts__ = po({}, To, t)),
    (this.__schemas__ = po({}, Eo, e)),
    (this.__compiled__ = {}),
    (this.__tlds__ = Oo),
    (this.__tlds_replaced__ = !1),
    (this.re = {}),
    Co(this));
}
var To,
  Eo,
  Do,
  Oo,
  ko = t(() => {
    (fo(),
      (To = { fuzzyLink: !0, fuzzyEmail: !0, fuzzyIP: !1 }),
      (Eo = {
        "http:": {
          validate: function (e, t, n) {
            let r = e.slice(t);
            return (
              n.re.http ||
                (n.re.http = RegExp(
                  `^\\/\\/${n.re.src_auth}${n.re.src_host_port_strict}${n.re.src_path}`,
                  `i`,
                )),
              n.re.http.test(r) ? r.match(n.re.http)[0].length : 0
            );
          },
        },
        "https:": `http:`,
        "ftp:": `http:`,
        "//": {
          validate: function (e, t, n) {
            let r = e.slice(t);
            return (
              n.re.no_http ||
                (n.re.no_http = RegExp(
                  `^` +
                    n.re.src_auth +
                    `(?:localhost|(?:(?:${n.re.src_domain})\\.)+${n.re.src_domain_root})` +
                    n.re.src_port +
                    n.re.src_host_terminator +
                    n.re.src_path,
                  `i`,
                )),
              n.re.no_http.test(r)
                ? (t >= 3 && e[t - 3] === `:`) || (t >= 3 && e[t - 3] === `/`)
                  ? 0
                  : r.match(n.re.no_http)[0].length
                : 0
            );
          },
        },
        "mailto:": {
          validate: function (e, t, n) {
            let r = e.slice(t);
            return (
              n.re.mailto ||
                (n.re.mailto = RegExp(`^${n.re.src_email_name}@${n.re.src_host_strict}`, `i`)),
              n.re.mailto.test(r) ? r.match(n.re.mailto)[0].length : 0
            );
          },
        },
      }),
      (Do = `a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]`),
      (Oo = `biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф`.split(
        `|`,
      )),
      (Q.prototype.add = function (e, t) {
        return ((this.__schemas__[e] = t), Co(this), this);
      }),
      (Q.prototype.set = function (e) {
        return ((this.__opts__ = po(this.__opts__, e)), this);
      }),
      (Q.prototype.test = function (e) {
        if (!e.length) return !1;
        let t, n;
        if (this.re.schema_test.test(e)) {
          for (n = this.re.schema_search, n.lastIndex = 0; (t = n.exec(e)) !== null;)
            if (this.testSchemaAt(e, t[2], n.lastIndex)) return !0;
        }
        return !!(
          (this.__opts__.fuzzyLink &&
            this.__compiled__[`http:`] &&
            e.search(this.re.host_fuzzy_test) >= 0 &&
            e.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy) !==
              null) ||
          (this.__opts__.fuzzyEmail &&
            this.__compiled__[`mailto:`] &&
            e.indexOf(`@`) >= 0 &&
            e.match(this.re.email_fuzzy) !== null)
        );
      }),
      (Q.prototype.pretest = function (e) {
        return this.re.pretest.test(e);
      }),
      (Q.prototype.testSchemaAt = function (e, t, n) {
        return this.__compiled__[t.toLowerCase()]
          ? this.__compiled__[t.toLowerCase()].validate(e, n, this)
          : 0;
      }),
      (Q.prototype.match = function (e) {
        let t = [],
          n = [],
          r = [],
          i = [],
          a,
          o,
          s;
        function c(e, t) {
          return e
            ? t
              ? e.index === t.index
                ? e.lastIndex >= t.lastIndex
                  ? e
                  : t
                : e.index < t.index
                  ? e
                  : t
              : e
            : t;
        }
        if (!e.length) return null;
        if (this.re.schema_test.test(e))
          for (s = this.re.schema_search, s.lastIndex = 0; (a = s.exec(e)) !== null;)
            ((o = this.testSchemaAt(e, a[2], s.lastIndex)),
              o &&
                n.push({
                  schema: a[2],
                  index: a.index + a[1].length,
                  lastIndex: a.index + a[0].length + o,
                }));
        if (this.__opts__.fuzzyLink && this.__compiled__[`http:`])
          for (
            s = this.__opts__.fuzzyIP ? this.re.link_fuzzy_global : this.re.link_no_ip_fuzzy_global,
              s.lastIndex = 0;
            (a = s.exec(e)) !== null;
          )
            r.push({ schema: ``, index: a.index + a[1].length, lastIndex: a.index + a[0].length });
        if (this.__opts__.fuzzyEmail && this.__compiled__[`mailto:`])
          for (s = this.re.email_fuzzy_global, s.lastIndex = 0; (a = s.exec(e)) !== null;)
            i.push({
              schema: `mailto:`,
              index: a.index + a[1].length,
              lastIndex: a.index + a[0].length,
            });
        let l = [0, 0, 0],
          u = 0;
        for (;;) {
          let a = [n[l[0]], i[l[1]], r[l[2]]],
            o = c(c(a[0], a[1]), a[2]);
          if (!o) break;
          if ((o === a[0] ? l[0]++ : o === a[1] ? l[1]++ : l[2]++, o.index < u)) continue;
          let s = new wo(e, o.schema, o.index, o.lastIndex);
          (this.__compiled__[s.schema].normalize(s, this), t.push(s), (u = o.lastIndex));
        }
        return t.length ? t : null;
      }),
      (Q.prototype.matchAtStart = function (e) {
        if (!e.length) return null;
        let t = this.re.schema_at_start.exec(e);
        if (!t) return null;
        let n = this.testSchemaAt(e, t[2], t[0].length);
        if (!n) return null;
        let r = new wo(e, t[2], t.index + t[1].length, t.index + t[0].length + n);
        return (this.__compiled__[r.schema].normalize(r, this), r);
      }),
      (Q.prototype.tlds = function (e, t) {
        return (
          (e = Array.isArray(e) ? e : [e]),
          t
            ? ((this.__tlds__ = this.__tlds__
                .concat(e)
                .sort()
                .filter(function (e, t, n) {
                  return e !== n[t - 1];
                })
                .reverse()),
              Co(this),
              this)
            : ((this.__tlds__ = e.slice()), (this.__tlds_replaced__ = !0), Co(this), this)
        );
      }),
      (Q.prototype.normalize = function (e) {
        (e.schema || (e.url = `http://${e.url}`),
          e.schema === `mailto:` && !/^mailto:/i.test(e.url) && (e.url = `mailto:${e.url}`));
      }),
      (Q.prototype.onCompile = function () {}));
  });
function Ao(e) {
  throw RangeError(Ko[e]);
}
function jo(e, t) {
  let n = [],
    r = e.length;
  for (; r--;) n[r] = t(e[r]);
  return n;
}
function Mo(e, t) {
  let n = e.split(`@`),
    r = ``;
  (n.length > 1 && ((r = n[0] + `@`), (e = n[1])), (e = e.replace(Go, `.`)));
  let i = jo(e.split(`.`), t).join(`.`);
  return r + i;
}
function No(e) {
  let t = [],
    n = 0,
    r = e.length;
  for (; n < r;) {
    let i = e.charCodeAt(n++);
    if (i >= 55296 && i <= 56319 && n < r) {
      let r = e.charCodeAt(n++);
      (r & 64512) == 56320 ? t.push(((i & 1023) << 10) + (r & 1023) + 65536) : (t.push(i), n--);
    } else t.push(i);
  }
  return t;
}
var Po,
  Fo,
  Io,
  Lo,
  Ro,
  zo,
  Bo,
  Vo,
  Ho,
  Uo,
  Wo,
  Go,
  Ko,
  qo,
  Jo,
  Yo,
  Xo,
  Zo,
  Qo,
  $o,
  es,
  ts,
  ns,
  rs,
  is,
  as = t(() => {
    ((Po = 2147483647),
      (Fo = 36),
      (Io = 1),
      (Lo = 26),
      (Ro = 38),
      (zo = 700),
      (Bo = 72),
      (Vo = 128),
      (Ho = `-`),
      (Uo = /^xn--/),
      (Wo = /[^\0-\x7F]/),
      (Go = /[\x2E\u3002\uFF0E\uFF61]/g),
      (Ko = {
        overflow: `Overflow: input needs wider integers to process`,
        "not-basic": `Illegal input >= 0x80 (not a basic code point)`,
        "invalid-input": `Invalid input`,
      }),
      (qo = Fo - Io),
      (Jo = Math.floor),
      (Yo = String.fromCharCode),
      (Xo = (e) => String.fromCodePoint(...e)),
      (Zo = function (e) {
        return e >= 48 && e < 58
          ? 26 + (e - 48)
          : e >= 65 && e < 91
            ? e - 65
            : e >= 97 && e < 123
              ? e - 97
              : Fo;
      }),
      (Qo = function (e, t) {
        return e + 22 + 75 * (e < 26) - ((t != 0) << 5);
      }),
      ($o = function (e, t, n) {
        let r = 0;
        for (e = n ? Jo(e / zo) : e >> 1, e += Jo(e / t); e > 455; r += Fo) e = Jo(e / qo);
        return Jo(r + (36 * e) / (e + Ro));
      }),
      (es = function (e) {
        let t = [],
          n = e.length,
          r = 0,
          i = Vo,
          a = Bo,
          o = e.lastIndexOf(Ho);
        o < 0 && (o = 0);
        for (let n = 0; n < o; ++n)
          (e.charCodeAt(n) >= 128 && Ao(`not-basic`), t.push(e.charCodeAt(n)));
        for (let s = o > 0 ? o + 1 : 0; s < n;) {
          let o = r;
          for (let t = 1, i = Fo; ; i += Fo) {
            s >= n && Ao(`invalid-input`);
            let o = Zo(e.charCodeAt(s++));
            (o >= Fo && Ao(`invalid-input`), o > Jo((Po - r) / t) && Ao(`overflow`), (r += o * t));
            let c = i <= a ? Io : i >= a + Lo ? Lo : i - a;
            if (o < c) break;
            let l = Fo - c;
            (t > Jo(Po / l) && Ao(`overflow`), (t *= l));
          }
          let c = t.length + 1;
          ((a = $o(r - o, c, o == 0)),
            Jo(r / c) > Po - i && Ao(`overflow`),
            (i += Jo(r / c)),
            (r %= c),
            t.splice(r++, 0, i));
        }
        return String.fromCodePoint(...t);
      }),
      (ts = function (e) {
        let t = [];
        e = No(e);
        let n = e.length,
          r = Vo,
          i = 0,
          a = Bo;
        for (let n of e) n < 128 && t.push(Yo(n));
        let o = t.length,
          s = o;
        for (o && t.push(Ho); s < n;) {
          let n = Po;
          for (let t of e) t >= r && t < n && (n = t);
          let c = s + 1;
          (n - r > Jo((Po - i) / c) && Ao(`overflow`), (i += (n - r) * c), (r = n));
          for (let n of e)
            if ((n < r && ++i > Po && Ao(`overflow`), n === r)) {
              let e = i;
              for (let n = Fo; ; n += Fo) {
                let r = n <= a ? Io : n >= a + Lo ? Lo : n - a;
                if (e < r) break;
                let i = e - r,
                  o = Fo - r;
                (t.push(Yo(Qo(r + (i % o), 0))), (e = Jo(i / o)));
              }
              (t.push(Yo(Qo(e, 0))), (a = $o(i, c, s === o)), (i = 0), ++s);
            }
          (++i, ++r);
        }
        return t.join(``);
      }),
      (ns = function (e) {
        return Mo(e, function (e) {
          return Uo.test(e) ? es(e.slice(4).toLowerCase()) : e;
        });
      }),
      (rs = function (e) {
        return Mo(e, function (e) {
          return Wo.test(e) ? `xn--` + ts(e) : e;
        });
      }),
      (is = {
        version: `2.3.1`,
        ucs2: { decode: No, encode: Xo },
        decode: es,
        encode: ts,
        toASCII: rs,
        toUnicode: ns,
      }));
  }),
  os,
  ss = t(() => {
    os = {
      options: {
        html: !1,
        xhtmlOut: !1,
        breaks: !1,
        langPrefix: `language-`,
        linkify: !1,
        typographer: !1,
        quotes: `“”‘’`,
        highlight: null,
        maxNesting: 100,
      },
      components: { core: {}, block: {}, inline: {} },
    };
  }),
  cs,
  ls = t(() => {
    cs = {
      options: {
        html: !1,
        xhtmlOut: !1,
        breaks: !1,
        langPrefix: `language-`,
        linkify: !1,
        typographer: !1,
        quotes: `“”‘’`,
        highlight: null,
        maxNesting: 20,
      },
      components: {
        core: { rules: [`normalize`, `block`, `inline`, `text_join`] },
        block: { rules: [`paragraph`] },
        inline: { rules: [`text`], rules2: [`balance_pairs`, `fragments_join`] },
      },
    };
  }),
  us,
  ds = t(() => {
    us = {
      options: {
        html: !0,
        xhtmlOut: !0,
        breaks: !1,
        langPrefix: `language-`,
        linkify: !1,
        typographer: !1,
        quotes: `“”‘’`,
        highlight: null,
        maxNesting: 20,
      },
      components: {
        core: { rules: [`normalize`, `block`, `inline`, `text_join`] },
        block: {
          rules: [
            `blockquote`,
            `code`,
            `fence`,
            `heading`,
            `hr`,
            `html_block`,
            `lheading`,
            `list`,
            `reference`,
            `paragraph`,
          ],
        },
        inline: {
          rules: [
            `autolink`,
            `backticks`,
            `emphasis`,
            `entity`,
            `escape`,
            `html_inline`,
            `image`,
            `link`,
            `newline`,
            `text`,
          ],
          rules2: [`balance_pairs`, `emphasis`, `fragments_join`],
        },
      },
    };
  });
function fs(e) {
  let t = e.trim().toLowerCase();
  return gs.test(t) ? _s.test(t) : !0;
}
function ps(e) {
  let t = en(e, !0);
  if (t.hostname && (!t.protocol || vs.indexOf(t.protocol) >= 0))
    try {
      t.hostname = is.toASCII(t.hostname);
    } catch {}
  return K(Zt(t));
}
function ms(e) {
  let t = en(e, !0);
  if (t.hostname && (!t.protocol || vs.indexOf(t.protocol) >= 0))
    try {
      t.hostname = is.toUnicode(t.hostname);
    } catch {}
  return Gt(Zt(t), Gt.defaultChars + `%`);
}
function $(e, t) {
  if (!(this instanceof $)) return new $(e, t);
  (t || ir(e) || ((t = e || {}), (e = `default`)),
    (this.inline = new oo()),
    (this.block = new ua()),
    (this.core = new Ti()),
    (this.renderer = new Br()),
    (this.linkify = new Q()),
    (this.validateLink = fs),
    (this.normalizeLink = ps),
    (this.normalizeLinkText = ms),
    (this.utils = nr),
    (this.helpers = or({}, Rr)),
    (this.options = {}),
    this.configure(e),
    t && this.set(t));
}
var hs,
  gs,
  _s,
  vs,
  ys = t(() => {
    (X(),
      zr(),
      Hr(),
      Di(),
      fa(),
      lo(),
      ko(),
      gn(),
      as(),
      ss(),
      ls(),
      ds(),
      (hs = { default: os, zero: cs, commonmark: us }),
      (gs = /^(vbscript|javascript|file|data):/),
      (_s = /^data:image\/(gif|png|jpeg|webp);/),
      (vs = [`http:`, `https:`, `mailto:`]),
      ($.prototype.set = function (e) {
        return (or(this.options, e), this);
      }),
      ($.prototype.configure = function (e) {
        let t = this;
        if (ir(e)) {
          let t = e;
          if (((e = hs[t]), !e)) throw Error('Wrong `markdown-it` preset "' + t + `", check name`);
        }
        if (!e) throw Error("Wrong `markdown-it` preset, can't be empty");
        return (
          e.options && t.set(e.options),
          e.components &&
            Object.keys(e.components).forEach(function (n) {
              (e.components[n].rules && t[n].ruler.enableOnly(e.components[n].rules),
                e.components[n].rules2 && t[n].ruler2.enableOnly(e.components[n].rules2));
            }),
          this
        );
      }),
      ($.prototype.enable = function (e, t) {
        let n = [];
        (Array.isArray(e) || (e = [e]),
          [`core`, `block`, `inline`].forEach(function (t) {
            n = n.concat(this[t].ruler.enable(e, !0));
          }, this),
          (n = n.concat(this.inline.ruler2.enable(e, !0))));
        let r = e.filter(function (e) {
          return n.indexOf(e) < 0;
        });
        if (r.length && !t) throw Error(`MarkdownIt. Failed to enable unknown rule(s): ` + r);
        return this;
      }),
      ($.prototype.disable = function (e, t) {
        let n = [];
        (Array.isArray(e) || (e = [e]),
          [`core`, `block`, `inline`].forEach(function (t) {
            n = n.concat(this[t].ruler.disable(e, !0));
          }, this),
          (n = n.concat(this.inline.ruler2.disable(e, !0))));
        let r = e.filter(function (e) {
          return n.indexOf(e) < 0;
        });
        if (r.length && !t) throw Error(`MarkdownIt. Failed to disable unknown rule(s): ` + r);
        return this;
      }),
      ($.prototype.use = function (e) {
        let t = [this].concat(Array.prototype.slice.call(arguments, 1));
        return (e.apply(e, t), this);
      }),
      ($.prototype.parse = function (e, t) {
        if (typeof e != `string`) throw Error(`Input data should be a String`);
        let n = new this.core.State(e, this, t);
        return (this.core.process(n), n.tokens);
      }),
      ($.prototype.render = function (e, t) {
        return ((t ||= {}), this.renderer.render(this.parse(e, t), this.options, t));
      }),
      ($.prototype.parseInline = function (e, t) {
        let n = new this.core.State(e, this, t);
        return ((n.inlineMode = !0), this.core.process(n), n.tokens);
      }),
      ($.prototype.renderInline = function (e, t) {
        return ((t ||= {}), this.renderer.render(this.parseInline(e, t), this.options, t));
      }));
  }),
  bs = t(() => {
    ys();
  }),
  xs = r((e, t) => {
    var n = !0,
      r = !1,
      i = !1;
    t.exports = function (e, t) {
      (t && ((n = !t.enabled), (r = !!t.label), (i = !!t.labelAfter)),
        e.core.ruler.after(`inline`, `github-task-lists`, function (e) {
          for (var t = e.tokens, r = 2; r < t.length; r++)
            s(t, r) &&
              (c(t[r], e.Token),
              a(t[r - 2], `class`, `task-list-item` + (n ? `` : ` enabled`)),
              a(t[o(t, r - 2)], `class`, `contains-task-list`));
        }));
    };
    function a(e, t, n) {
      var r = e.attrIndex(t),
        i = [t, n];
      r < 0 ? e.attrPush(i) : (e.attrs[r] = i);
    }
    function o(e, t) {
      for (var n = e[t].level - 1, r = t - 1; r >= 0; r--) if (e[r].level === n) return r;
      return -1;
    }
    function s(e, t) {
      return p(e[t]) && m(e[t - 1]) && h(e[t - 2]) && g(e[t]);
    }
    function c(e, t) {
      if (
        (e.children.unshift(l(e, t)),
        (e.children[1].content = e.children[1].content.slice(3)),
        (e.content = e.content.slice(3)),
        r)
      )
        if (i) {
          e.children.pop();
          var n = `task-item-` + Math.ceil(1e4 * 1e3 * Math.random() - 1e3);
          ((e.children[0].content = e.children[0].content.slice(0, -1) + ` id="` + n + `">`),
            e.children.push(f(e.content, n, t)));
        } else (e.children.unshift(u(t)), e.children.push(d(t)));
    }
    function l(e, t) {
      var r = new t(`html_inline`, ``, 0),
        i = n ? ` disabled="" ` : ``;
      return (
        e.content.indexOf(`[ ] `) === 0
          ? (r.content = `<input class="task-list-item-checkbox"` + i + `type="checkbox">`)
          : (e.content.indexOf(`[x] `) === 0 || e.content.indexOf(`[X] `) === 0) &&
            (r.content =
              `<input class="task-list-item-checkbox" checked=""` + i + `type="checkbox">`),
        r
      );
    }
    function u(e) {
      var t = new e(`html_inline`, ``, 0);
      return ((t.content = `<label>`), t);
    }
    function d(e) {
      var t = new e(`html_inline`, ``, 0);
      return ((t.content = `</label>`), t);
    }
    function f(e, t, n) {
      var r = new n(`html_inline`, ``, 0);
      return (
        (r.content = `<label class="task-list-item-label" for="` + t + `">` + e + `</label>`),
        (r.attrs = [{ for: t }]),
        r
      );
    }
    function p(e) {
      return e.type === `inline`;
    }
    function m(e) {
      return e.type === `paragraph_open`;
    }
    function h(e) {
      return e.type === `list_item_open`;
    }
    function g(e) {
      return (
        e.content.indexOf(`[ ] `) === 0 ||
        e.content.indexOf(`[x] `) === 0 ||
        e.content.indexOf(`[X] `) === 0
      );
    }
  });
export {
  at as A,
  dt as C,
  ot as D,
  V as E,
  Ge as F,
  Ke as I,
  He as L,
  Xe as M,
  qe as N,
  B as O,
  Je as P,
  Ve as R,
  ft as S,
  st as T,
  Tt as _,
  Qi as a,
  St as b,
  Ht as c,
  zt as d,
  jt as f,
  Et as g,
  Dt as h,
  ys as i,
  Ye as j,
  Ze as k,
  Vt as l,
  Ot as m,
  bs as n,
  ea as o,
  kt as p,
  $ as r,
  Ut as s,
  xs as t,
  Bt as u,
  wt as v,
  H as w,
  xt as x,
  Ct as y,
};
//# sourceMappingURL=markdown-runtime-BBD8XmVB.js.map
