import { i as pe, t as me } from "./dist-D9GsM5qA.js";
import { html as he, htmlCompletionSource as ge, t as _e } from "./dist-D_xBiePP.js";
import {
  A as t,
  D as n,
  E as r,
  G as i,
  J as a,
  L as o,
  P as s,
  R as c,
  S as l,
  W as u,
  a as d,
  b as f,
  ct as p,
  dt as m,
  ft as h,
  h as ee,
  i as te,
  j as g,
  k as ne,
  m as re,
  o as ie,
  ot as _,
  pt as ae,
  r as oe,
  rt as se,
  st as ce,
  tt as v,
  u as le,
  ut as ue,
  v as de,
  x as fe,
} from "./dist-DRf-DUop.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
function ve(e, t, n) {
  if (
    n.pos == n.text.length ||
    (e != t.block && n.indent >= t.stack[n.depth + 1].value + n.baseIndent)
  )
    return !0;
  if (n.indent >= n.baseIndent + 4) return !1;
  let r = (e.type == N.OrderedList ? C : S)(n, t, !1);
  return (
    r > 0 &&
    (e.type != N.BulletList || x(n, t, !1) < 0) &&
    n.text.charCodeAt(n.pos + r - 1) == e.value
  );
}
function y(e) {
  return e == 32 || e == 9 || e == 10 || e == 13;
}
function b(e, t = 0) {
  for (; t < e.length && y(e.charCodeAt(t));) t++;
  return t;
}
function ye(e, t, n) {
  for (; t > n && y(e.charCodeAt(t - 1));) t--;
  return t;
}
function be(e) {
  if (e.next != 96 && e.next != 126) return -1;
  let t = e.pos + 1;
  for (; t < e.text.length && e.text.charCodeAt(t) == e.next;) t++;
  if (t < e.pos + 3) return -1;
  if (e.next == 96) {
    for (let n = t; n < e.text.length; n++) if (e.text.charCodeAt(n) == 96) return -1;
  }
  return t;
}
function xe(e) {
  return e.next == 62 ? (e.text.charCodeAt(e.pos + 1) == 32 ? 2 : 1) : -1;
}
function x(e, t, n) {
  if (e.next != 42 && e.next != 45 && e.next != 95) return -1;
  let r = 1;
  for (let t = e.pos + 1; t < e.text.length; t++) {
    let n = e.text.charCodeAt(t);
    if (n == e.next) r++;
    else if (!y(n)) return -1;
  }
  return (n &&
    e.next == 45 &&
    we(e) > -1 &&
    e.depth == t.stack.length &&
    t.parser.leafBlockParsers.indexOf(B.SetextHeading) > -1) ||
    r < 3
    ? -1
    : 1;
}
function Se(e, t) {
  for (let n = e.stack.length - 1; n >= 0; n--) if (e.stack[n].type == t) return !0;
  return !1;
}
function S(e, t, n) {
  return (e.next == 45 || e.next == 43 || e.next == 42) &&
    (e.pos == e.text.length - 1 || y(e.text.charCodeAt(e.pos + 1))) &&
    (!n || Se(t, N.BulletList) || e.skipSpace(e.pos + 2) < e.text.length)
    ? 1
    : -1;
}
function C(e, t, n) {
  let r = e.pos,
    i = e.next;
  for (; i >= 48 && i <= 57;) {
    if ((r++, r == e.text.length)) return -1;
    i = e.text.charCodeAt(r);
  }
  return r == e.pos ||
    r > e.pos + 9 ||
    (i != 46 && i != 41) ||
    (r < e.text.length - 1 && !y(e.text.charCodeAt(r + 1))) ||
    (n &&
      !Se(t, N.OrderedList) &&
      (e.skipSpace(r + 1) == e.text.length || r > e.pos + 1 || e.next != 49))
    ? -1
    : r + 1 - e.pos;
}
function Ce(e) {
  if (e.next != 35) return -1;
  let t = e.pos + 1;
  for (; t < e.text.length && e.text.charCodeAt(t) == 35;) t++;
  if (t < e.text.length && e.text.charCodeAt(t) != 32) return -1;
  let n = t - e.pos;
  return n > 6 ? -1 : n;
}
function we(e) {
  if ((e.next != 45 && e.next != 61) || e.indent >= e.baseIndent + 4) return -1;
  let t = e.pos + 1;
  for (; t < e.text.length && e.text.charCodeAt(t) == e.next;) t++;
  let n = t;
  for (; t < e.text.length && y(e.text.charCodeAt(t));) t++;
  return t == e.text.length ? n : -1;
}
function Te(e, t, n) {
  if (e.next != 60) return -1;
  let r = e.text.slice(e.pos);
  for (let e = 0, t = R.length - +!!n; e < t; e++) if (R[e][0].test(r)) return e;
  return -1;
}
function Ee(e, t) {
  let n = e.countIndent(t, e.pos, e.indent),
    r = e.countIndent(e.skipSpace(t), t, n);
  return r >= n + 5 ? n + 1 : r;
}
function w(e, t, n) {
  let r = e.length - 1;
  r >= 0 && e[r].to == t && e[r].type == N.CodeText ? (e[r].to = n) : e.push(k(N.CodeText, t, n));
}
function T(e, t) {
  for (; t < e.length; t++) {
    let n = e.charCodeAt(t);
    if (n == 10) break;
    if (!y(n)) return -1;
  }
  return t;
}
function De(e, t, n, r, i) {
  let a = e[t].to,
    o = [],
    s = [],
    c = n.from + r;
  function l(n, i) {
    for (; i ? n >= a : n > a;) {
      let i = e[t + 1].from - a;
      ((r += i), (n += i), t++, (a = e[t].to));
    }
  }
  for (let u = n.firstChild; u; u = u.nextSibling) {
    l(u.from + r, !0);
    let n = u.from + r,
      d,
      f = i.get(u.tree);
    (f ? (d = f) : u.to + r > a ? ((d = De(e, t, u, r, i)), l(u.to + r, !1)) : (d = u.toTree()),
      o.push(d),
      s.push(n - c));
  }
  return (l(n.to + r, !1), new m(n.type, o, s, n.to + r - c, n.tree ? n.tree.propValues : void 0));
}
function E(e) {
  return e != null && e.length > 0;
}
function D(e) {
  if (!Array.isArray(e)) return e;
  if (e.length == 0) return null;
  let t = D(e[0]);
  if (e.length == 1) return t;
  let n = D(e.slice(1));
  if (!n || !t) return t || n;
  let r = (e, t) => (e || H).concat(t || H),
    i = t.wrap,
    a = n.wrap;
  return {
    props: r(t.props, n.props),
    defineNodes: r(t.defineNodes, n.defineNodes),
    parseBlock: r(t.parseBlock, n.parseBlock),
    parseInline: r(t.parseInline, n.parseInline),
    remove: r(t.remove, n.remove),
    wrap: i ? (a ? (e, t, n, r) => i(a(e, t, n, r), t, n, r) : i) : a,
  };
}
function O(e, t) {
  let n = e.indexOf(t);
  if (n < 0) throw RangeError(`Position specified relative to unknown parser ${t}`);
  return n;
}
function k(e, t, n, r) {
  return new U(e, t, n, r);
}
function Oe(e, t, n, r, i) {
  let { text: a } = e,
    o = e.char(i),
    s = i;
  if (
    (t.unshift(k(N.LinkMark, r, r + (n == N.Image ? 2 : 1))),
    t.push(k(N.LinkMark, i - 1, i)),
    o == 40)
  ) {
    let n = e.skipSpace(i + 1),
      r = ke(a, n - e.offset, e.offset),
      o;
    (r &&
      ((n = e.skipSpace(r.to)),
      n != r.to && ((o = Ae(a, n - e.offset, e.offset)), o && (n = e.skipSpace(o.to)))),
      e.char(n) == 41 &&
        (t.push(k(N.LinkMark, i, i + 1)),
        (s = n + 1),
        r && t.push(r),
        o && t.push(o),
        t.push(k(N.LinkMark, n, s))));
  } else if (o == 91) {
    let n = je(a, i - e.offset, e.offset, !1);
    n && (t.push(n), (s = n.to));
  }
  return k(n, r, s, t);
}
function ke(e, t, n) {
  if (e.charCodeAt(t) == 60) {
    for (let r = t + 1; r < e.length; r++) {
      let i = e.charCodeAt(r);
      if (i == 62) return k(N.URL, t + n, r + 1 + n);
      if (i == 60 || i == 10) return !1;
    }
    return null;
  } else {
    let r = 0,
      i = t;
    for (let t = !1; i < e.length; i++) {
      let n = e.charCodeAt(i);
      if (y(n)) break;
      if (t) t = !1;
      else if (n == 40) r++;
      else if (n == 41) {
        if (!r) break;
        r--;
      } else n == 92 && (t = !0);
    }
    return i > t ? k(N.URL, t + n, i + n) : i == e.length ? null : !1;
  }
}
function Ae(e, t, n) {
  let r = e.charCodeAt(t);
  if (r != 39 && r != 34 && r != 40) return !1;
  let i = r == 40 ? 41 : r;
  for (let r = t + 1, a = !1; r < e.length; r++) {
    let o = e.charCodeAt(r);
    if (a) a = !1;
    else if (o == i) return k(N.LinkTitle, t + n, r + 1 + n);
    else o == 92 && (a = !0);
  }
  return null;
}
function je(e, t, n, r) {
  for (let i = !1, a = t + 1, o = Math.min(e.length, a + 999); a < o; a++) {
    let o = e.charCodeAt(a);
    if (i) i = !1;
    else if (o == 93) return r ? !1 : k(N.LinkLabel, t + n, a + 1 + n);
    else {
      if ((r && !y(o) && (r = !1), o == 91)) return !1;
      o == 92 && (i = !0);
    }
  }
  return null;
}
function A(e, t) {
  if (!t.length) return e;
  if (!e.length) return t;
  let n = e.slice(),
    r = 0;
  for (let e of t) {
    for (; r < n.length && n[r].to < e.to;) r++;
    if (r < n.length && n[r].from < e.from) {
      let t = n[r];
      t instanceof U && (n[r] = new U(t.type, t.from, t.to, A(t.children, [e])));
    } else n.splice(r++, 0, e);
  }
  return n;
}
function Me(e, t) {
  let n = e;
  for (let r = 1; r < t.length; r++) {
    let i = t[r - 1].to,
      a = t[r].from;
    i < e && (n -= a - i);
  }
  return n;
}
function Ne(e, t, n) {
  let r = [];
  for (let i = e.firstChild, a = t; ; i = i.nextSibling) {
    let e = i ? i.from : n;
    if ((e > a && r.push({ from: a, to: e }), !i)) break;
    a = i.to;
  }
  return r;
}
function Pe(e) {
  let { codeParser: t, htmlParser: n } = e;
  return {
    wrap: ae((e, r) => {
      let i = e.type.id;
      if (t && (i == N.CodeBlock || i == N.FencedCode)) {
        let n = ``;
        if (i == N.FencedCode) {
          let t = e.node.getChild(N.CodeInfo);
          t && (n = r.read(t.from, t.to));
        }
        let a = t(n);
        if (a)
          return {
            parser: a,
            overlay: (e) => e.type.id == N.CodeText,
            bracketed: i == N.FencedCode,
          };
      } else if (n && (i == N.HTMLBlock || i == N.HTMLTag || i == N.CommentBlock))
        return { parser: n, overlay: Ne(e.node, e.from, e.to) };
      return null;
    }),
  };
}
function j(e, t, n = 0, r, i = 0) {
  let a = 0,
    o = !0,
    s = -1,
    c = -1,
    l = !1,
    u = () => {
      r.push(e.elt(`TableCell`, i + s, i + c, e.parser.parseInline(t.slice(s, c), i + s)));
    };
  for (let d = n; d < t.length; d++) {
    let n = t.charCodeAt(d);
    (n == 124 && !l
      ? ((!o || s > -1) && a++,
        (o = !1),
        r && (s > -1 && u(), r.push(e.elt(`TableDelimiter`, d + i, d + i + 1))),
        (s = c = -1))
      : (l || (n != 32 && n != 9)) && (s < 0 && (s = d), (c = d + 1)),
      (l = !l && n == 92));
  }
  return (s > -1 && (a++, r && u()), a);
}
function Fe(e, t) {
  for (let n = t; n < e.length; n++) {
    let t = e.charCodeAt(n);
    if (t == 124) return !0;
    t == 92 && n++;
  }
  return !1;
}
function Ie(e, t, n, r) {
  let i = 0;
  for (let a = t; a < n; a++) e[a] == r && i++;
  return i;
}
function Le(e, t) {
  dt.lastIndex = t;
  let n = dt.exec(e);
  if (!n || ft.exec(n[0])[0].indexOf(`_`) > -1) return -1;
  let r = t + n[0].length;
  for (;;) {
    let n = e[r - 1],
      i;
    if (/[?!.,:*_~]/.test(n) || (n == `)` && Ie(e, t, r, `)`) > Ie(e, t, r, `(`))) r--;
    else if (n == `;` && (i = /&(?:#\d+|#x[a-f\d]+|\w+);$/.exec(e.slice(t, r)))) r = t + i.index;
    else break;
  }
  return r;
}
function Re(e, t) {
  pt.lastIndex = t;
  let n = pt.exec(e);
  if (!n) return -1;
  let r = n[0][n[0].length - 1];
  return r == `_` || r == `-` ? -1 : t + n[0].length - +(r == `.`);
}
function ze(e, t, n) {
  return (r, i, a) => {
    if (i != e || r.char(a + 1) == e) return -1;
    let o = [r.elt(n, a, a + 1)];
    for (let i = a + 1; i < r.end; i++) {
      let s = r.char(i);
      if (s == e) return r.addElement(r.elt(t, a, i + 1, o.concat(r.elt(n, i, i + 1))));
      if ((s == 92 && o.push(r.elt(`Escape`, i, i++ + 2)), y(s))) break;
    }
    return -1;
  };
}
var M,
  N,
  Be,
  Ve,
  P,
  F,
  I,
  L,
  R,
  z,
  He,
  Ue,
  B,
  We,
  Ge,
  Ke,
  V,
  qe,
  H,
  Je,
  U,
  Ye,
  Xe,
  Ze,
  W,
  G,
  K,
  Qe,
  q,
  J,
  Y,
  $e,
  et,
  tt,
  nt,
  rt,
  it,
  at,
  ot,
  st,
  ct,
  lt,
  ut,
  dt,
  ft,
  pt,
  mt,
  ht,
  gt,
  _t,
  vt,
  yt,
  bt = e(() => {
    (h(),
      ne(),
      (M = class e {
        static create(t, n, r, i, a) {
          let o = (i + (i << 8) + t + (n << 4)) | 0;
          return new e(t, n, r, o, a, [], []);
        }
        constructor(e, t, n, r, i, a, o) {
          ((this.type = e),
            (this.value = t),
            (this.from = n),
            (this.hash = r),
            (this.end = i),
            (this.children = a),
            (this.positions = o),
            (this.hashProp = [[_.contextHash, r]]));
        }
        addChild(e, t) {
          (e.prop(_.contextHash) != this.hash &&
            (e = new m(e.type, e.children, e.positions, e.length, this.hashProp)),
            this.children.push(e),
            this.positions.push(t));
        }
        toTree(e, t = this.end) {
          let n = this.children.length - 1;
          return (
            n >= 0 && (t = Math.max(t, this.positions[n] + this.children[n].length + this.from)),
            new m(e.types[this.type], this.children, this.positions, t - this.from).balance({
              makeTree: (e, t, n) => new m(p.none, e, t, n, this.hashProp),
            })
          );
        }
      }),
      (function (e) {
        ((e[(e.Document = 1)] = `Document`),
          (e[(e.CodeBlock = 2)] = `CodeBlock`),
          (e[(e.FencedCode = 3)] = `FencedCode`),
          (e[(e.Blockquote = 4)] = `Blockquote`),
          (e[(e.HorizontalRule = 5)] = `HorizontalRule`),
          (e[(e.BulletList = 6)] = `BulletList`),
          (e[(e.OrderedList = 7)] = `OrderedList`),
          (e[(e.ListItem = 8)] = `ListItem`),
          (e[(e.ATXHeading1 = 9)] = `ATXHeading1`),
          (e[(e.ATXHeading2 = 10)] = `ATXHeading2`),
          (e[(e.ATXHeading3 = 11)] = `ATXHeading3`),
          (e[(e.ATXHeading4 = 12)] = `ATXHeading4`),
          (e[(e.ATXHeading5 = 13)] = `ATXHeading5`),
          (e[(e.ATXHeading6 = 14)] = `ATXHeading6`),
          (e[(e.SetextHeading1 = 15)] = `SetextHeading1`),
          (e[(e.SetextHeading2 = 16)] = `SetextHeading2`),
          (e[(e.HTMLBlock = 17)] = `HTMLBlock`),
          (e[(e.LinkReference = 18)] = `LinkReference`),
          (e[(e.Paragraph = 19)] = `Paragraph`),
          (e[(e.CommentBlock = 20)] = `CommentBlock`),
          (e[(e.ProcessingInstructionBlock = 21)] = `ProcessingInstructionBlock`),
          (e[(e.Escape = 22)] = `Escape`),
          (e[(e.Entity = 23)] = `Entity`),
          (e[(e.HardBreak = 24)] = `HardBreak`),
          (e[(e.Emphasis = 25)] = `Emphasis`),
          (e[(e.StrongEmphasis = 26)] = `StrongEmphasis`),
          (e[(e.Link = 27)] = `Link`),
          (e[(e.Image = 28)] = `Image`),
          (e[(e.InlineCode = 29)] = `InlineCode`),
          (e[(e.HTMLTag = 30)] = `HTMLTag`),
          (e[(e.Comment = 31)] = `Comment`),
          (e[(e.ProcessingInstruction = 32)] = `ProcessingInstruction`),
          (e[(e.Autolink = 33)] = `Autolink`),
          (e[(e.HeaderMark = 34)] = `HeaderMark`),
          (e[(e.QuoteMark = 35)] = `QuoteMark`),
          (e[(e.ListMark = 36)] = `ListMark`),
          (e[(e.LinkMark = 37)] = `LinkMark`),
          (e[(e.EmphasisMark = 38)] = `EmphasisMark`),
          (e[(e.CodeMark = 39)] = `CodeMark`),
          (e[(e.CodeText = 40)] = `CodeText`),
          (e[(e.CodeInfo = 41)] = `CodeInfo`),
          (e[(e.LinkTitle = 42)] = `LinkTitle`),
          (e[(e.LinkLabel = 43)] = `LinkLabel`),
          (e[(e.URL = 44)] = `URL`));
      })((N ||= {})),
      (Be = class {
        constructor(e, t) {
          ((this.start = e), (this.content = t), (this.marks = []), (this.parsers = []));
        }
      }),
      (Ve = class {
        constructor() {
          ((this.text = ``),
            (this.baseIndent = 0),
            (this.basePos = 0),
            (this.depth = 0),
            (this.markers = []),
            (this.pos = 0),
            (this.indent = 0),
            (this.next = -1));
        }
        forward() {
          this.basePos > this.pos && this.forwardInner();
        }
        forwardInner() {
          let e = this.skipSpace(this.basePos);
          ((this.indent = this.countIndent(e, this.pos, this.indent)),
            (this.pos = e),
            (this.next = e == this.text.length ? -1 : this.text.charCodeAt(e)));
        }
        skipSpace(e) {
          return b(this.text, e);
        }
        reset(e) {
          for (
            this.text = e,
              this.baseIndent = this.basePos = this.pos = this.indent = 0,
              this.forwardInner(),
              this.depth = 1;
            this.markers.length;
          )
            this.markers.pop();
        }
        moveBase(e) {
          ((this.basePos = e), (this.baseIndent = this.countIndent(e, this.pos, this.indent)));
        }
        moveBaseColumn(e) {
          ((this.baseIndent = e), (this.basePos = this.findColumn(e)));
        }
        addMarker(e) {
          this.markers.push(e);
        }
        countIndent(e, t = 0, n = 0) {
          for (let r = t; r < e; r++) n += this.text.charCodeAt(r) == 9 ? 4 - (n % 4) : 1;
          return n;
        }
        findColumn(e) {
          let t = 0;
          for (let n = 0; t < this.text.length && n < e; t++)
            n += this.text.charCodeAt(t) == 9 ? 4 - (n % 4) : 1;
          return t;
        }
        scrub() {
          if (!this.baseIndent) return this.text;
          let e = ``;
          for (let t = 0; t < this.basePos; t++) e += ` `;
          return e + this.text.slice(this.basePos);
        }
      }),
      (P = {
        [N.Blockquote](e, t, n) {
          return n.next == 62
            ? (n.markers.push(k(N.QuoteMark, t.lineStart + n.pos, t.lineStart + n.pos + 1)),
              n.moveBase(n.pos + (y(n.text.charCodeAt(n.pos + 1)) ? 2 : 1)),
              (e.end = t.lineStart + n.text.length),
              !0)
            : !1;
        },
        [N.ListItem](e, t, n) {
          return n.indent < n.baseIndent + e.value && n.next > -1
            ? !1
            : (n.moveBaseColumn(n.baseIndent + e.value), !0);
        },
        [N.OrderedList]: ve,
        [N.BulletList]: ve,
        [N.Document]() {
          return !0;
        },
      }),
      (F = /^[ \t]*$/),
      (I = /-->/),
      (L = /\?>/),
      (R = [
        [/^<(?:script|pre|style)(?:\s|>|$)/i, /<\/(?:script|pre|style)>/i],
        [/^\s*<!--/, I],
        [/^\s*<\?/, L],
        [/^\s*<![A-Z]/, />/],
        [/^\s*<!\[CDATA\[/, /\]\]>/],
        [
          /^\s*<\/?(?:address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h1|h2|h3|h4|h5|h6|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul)(?:\s|\/?>|$)/i,
          F,
        ],
        [
          /^\s*(?:<\/[a-z][\w-]*\s*>|<[a-z][\w-]*(\s+[a-z:_][\w-.]*(?:\s*=\s*(?:[^\s"'=<>`]+|'[^']*'|"[^"]*"))?)*\s*>)\s*$/i,
          F,
        ],
      ]),
      (z = {
        LinkReference: void 0,
        IndentedCode(e, t) {
          let n = t.baseIndent + 4;
          if (t.indent < n) return !1;
          let r = t.findColumn(n),
            i = e.lineStart + r,
            a = e.lineStart + t.text.length,
            o = [],
            s = [];
          for (w(o, i, a); e.nextLine() && t.depth >= e.stack.length;)
            if (t.pos == t.text.length) {
              w(s, e.lineStart - 1, e.lineStart);
              for (let e of t.markers) s.push(e);
            } else if (t.indent < n) break;
            else {
              if (s.length) {
                for (let e of s) e.type == N.CodeText ? w(o, e.from, e.to) : o.push(e);
                s = [];
              }
              w(o, e.lineStart - 1, e.lineStart);
              for (let e of t.markers) o.push(e);
              a = e.lineStart + t.text.length;
              let n = e.lineStart + t.findColumn(t.baseIndent + 4);
              n < a && w(o, n, a);
            }
          return (
            s.length &&
              ((s = s.filter((e) => e.type != N.CodeText)),
              s.length && (t.markers = s.concat(t.markers))),
            e.addNode(e.buffer.writeElements(o, -i).finish(N.CodeBlock, a - i), i),
            !0
          );
        },
        FencedCode(e, t) {
          let n = be(t);
          if (n < 0) return !1;
          let r = e.lineStart + t.pos,
            i = t.next,
            a = n - t.pos,
            o = t.skipSpace(n),
            s = ye(t.text, t.text.length, o),
            c = [k(N.CodeMark, r, r + a)];
          o < s && c.push(k(N.CodeInfo, e.lineStart + o, e.lineStart + s));
          for (let n = !0, r = !0, o = !1; e.nextLine() && t.depth >= e.stack.length; n = !1) {
            let s = t.pos;
            if (t.indent - t.baseIndent < 4)
              for (; s < t.text.length && t.text.charCodeAt(s) == i;) s++;
            if (s - t.pos >= a && t.skipSpace(s) == t.text.length) {
              for (let e of t.markers) c.push(e);
              (r && o && w(c, e.lineStart - 1, e.lineStart),
                c.push(k(N.CodeMark, e.lineStart + t.pos, e.lineStart + s)),
                e.nextLine());
              break;
            } else {
              ((o = !0), n || (w(c, e.lineStart - 1, e.lineStart), (r = !1)));
              for (let e of t.markers) c.push(e);
              let i = e.lineStart + t.basePos,
                a = e.lineStart + t.text.length;
              i < a && (w(c, i, a), (r = !1));
            }
          }
          return (
            e.addNode(e.buffer.writeElements(c, -r).finish(N.FencedCode, e.prevLineEnd() - r), r),
            !0
          );
        },
        Blockquote(e, t) {
          let n = xe(t);
          return n < 0
            ? !1
            : (e.startContext(N.Blockquote, t.pos),
              e.addNode(N.QuoteMark, e.lineStart + t.pos, e.lineStart + t.pos + 1),
              t.moveBase(t.pos + n),
              null);
        },
        HorizontalRule(e, t) {
          if (x(t, e, !1) < 0) return !1;
          let n = e.lineStart + t.pos;
          return (e.nextLine(), e.addNode(N.HorizontalRule, n), !0);
        },
        BulletList(e, t) {
          let n = S(t, e, !1);
          if (n < 0) return !1;
          e.block.type != N.BulletList && e.startContext(N.BulletList, t.basePos, t.next);
          let r = Ee(t, t.pos + 1);
          return (
            e.startContext(N.ListItem, t.basePos, r - t.baseIndent),
            e.addNode(N.ListMark, e.lineStart + t.pos, e.lineStart + t.pos + n),
            t.moveBaseColumn(r),
            null
          );
        },
        OrderedList(e, t) {
          let n = C(t, e, !1);
          if (n < 0) return !1;
          e.block.type != N.OrderedList &&
            e.startContext(N.OrderedList, t.basePos, t.text.charCodeAt(t.pos + n - 1));
          let r = Ee(t, t.pos + n);
          return (
            e.startContext(N.ListItem, t.basePos, r - t.baseIndent),
            e.addNode(N.ListMark, e.lineStart + t.pos, e.lineStart + t.pos + n),
            t.moveBaseColumn(r),
            null
          );
        },
        ATXHeading(e, t) {
          let n = Ce(t);
          if (n < 0) return !1;
          let r = t.pos,
            i = e.lineStart + r,
            a = ye(t.text, t.text.length, r),
            o = a;
          for (; o > r && t.text.charCodeAt(o - 1) == t.next;) o--;
          (o == a || o == r || !y(t.text.charCodeAt(o - 1))) && (o = t.text.length);
          let s = e.buffer
            .write(N.HeaderMark, 0, n)
            .writeElements(e.parser.parseInline(t.text.slice(r + n + 1, o), i + n + 1), -i);
          o < t.text.length && s.write(N.HeaderMark, o - r, a - r);
          let c = s.finish(N.ATXHeading1 - 1 + n, t.text.length - r);
          return (e.nextLine(), e.addNode(c, i), !0);
        },
        HTMLBlock(e, t) {
          let n = Te(t, e, !1);
          if (n < 0) return !1;
          let r = e.lineStart + t.pos,
            i = R[n][1],
            a = [],
            o = i != F;
          for (; !i.test(t.text) && e.nextLine();) {
            if (t.depth < e.stack.length) {
              o = !1;
              break;
            }
            for (let e of t.markers) a.push(e);
          }
          o && e.nextLine();
          let s = i == I ? N.CommentBlock : i == L ? N.ProcessingInstructionBlock : N.HTMLBlock,
            c = e.prevLineEnd();
          return (e.addNode(e.buffer.writeElements(a, -r).finish(s, c - r), r), !0);
        },
        SetextHeading: void 0,
      }),
      (He = class {
        constructor(e) {
          ((this.stage = 0),
            (this.elts = []),
            (this.pos = 0),
            (this.start = e.start),
            this.advance(e.content));
        }
        nextLine(e, t, n) {
          if (this.stage == -1) return !1;
          let r =
              n.content +
              `
` +
              t.scrub(),
            i = this.advance(r);
          return i > -1 && i < r.length ? this.complete(e, n, i) : !1;
        }
        finish(e, t) {
          return (this.stage == 2 || this.stage == 3) && b(t.content, this.pos) == t.content.length
            ? this.complete(e, t, t.content.length)
            : !1;
        }
        complete(e, t, n) {
          return (
            e.addLeafElement(t, k(N.LinkReference, this.start, this.start + n, this.elts)), !0
          );
        }
        nextStage(e) {
          return e
            ? ((this.pos = e.to - this.start), this.elts.push(e), this.stage++, !0)
            : (e === !1 && (this.stage = -1), !1);
        }
        advance(e) {
          for (;;)
            if (this.stage == -1) return -1;
            else if (this.stage == 0) {
              if (!this.nextStage(je(e, this.pos, this.start, !0))) return -1;
              if (e.charCodeAt(this.pos) != 58) return (this.stage = -1);
              (this.elts.push(k(N.LinkMark, this.pos + this.start, this.pos + this.start + 1)),
                this.pos++);
            } else if (this.stage == 1) {
              if (!this.nextStage(ke(e, b(e, this.pos), this.start))) return -1;
            } else if (this.stage == 2) {
              let t = b(e, this.pos),
                n = 0;
              if (t > this.pos) {
                let r = Ae(e, t, this.start);
                if (r) {
                  let t = T(e, r.to - this.start);
                  t > 0 && (this.nextStage(r), (n = t));
                }
              }
              return ((n ||= T(e, this.pos)), n > 0 && n < e.length ? n : -1);
            } else return T(e, this.pos);
        }
      }),
      (Ue = class {
        nextLine(e, t, n) {
          let r = t.depth < e.stack.length ? -1 : we(t),
            i = t.next;
          if (r < 0) return !1;
          let a = k(N.HeaderMark, e.lineStart + t.pos, e.lineStart + r);
          return (
            e.nextLine(),
            e.addLeafElement(
              n,
              k(i == 61 ? N.SetextHeading1 : N.SetextHeading2, n.start, e.prevLineEnd(), [
                ...e.parser.parseInline(n.content, n.start),
                a,
              ]),
            ),
            !0
          );
        }
        finish() {
          return !1;
        }
      }),
      (B = {
        LinkReference(e, t) {
          return t.content.charCodeAt(0) == 91 ? new He(t) : null;
        },
        SetextHeading() {
          return new Ue();
        },
      }),
      (We = [
        (e, t) => Ce(t) >= 0,
        (e, t) => be(t) >= 0,
        (e, t) => xe(t) >= 0,
        (e, t) => S(t, e, !0) >= 0,
        (e, t) => C(t, e, !0) >= 0,
        (e, t) => x(t, e, !0) >= 0,
        (e, t) => Te(t, e, !0) >= 0,
      ]),
      (Ge = { text: ``, end: 0 }),
      (Ke = class {
        constructor(e, t, n, r) {
          ((this.parser = e),
            (this.input = t),
            (this.ranges = r),
            (this.line = new Ve()),
            (this.atEnd = !1),
            (this.reusePlaceholders = new Map()),
            (this.stoppedAt = null),
            (this.rangeI = 0),
            (this.to = r[r.length - 1].to),
            (this.lineStart = this.absoluteLineStart = this.absoluteLineEnd = r[0].from),
            (this.block = M.create(N.Document, 0, this.lineStart, 0, 0)),
            (this.stack = [this.block]),
            (this.fragments = n.length ? new et(n, t) : null),
            this.readLine());
        }
        get parsedPos() {
          return this.absoluteLineStart;
        }
        advance() {
          if (this.stoppedAt != null && this.absoluteLineStart > this.stoppedAt)
            return this.finish();
          let { line: e } = this;
          for (;;) {
            for (let t = 0; ;) {
              let n = e.depth < this.stack.length ? this.stack[this.stack.length - 1] : null;
              for (; t < e.markers.length && (!n || e.markers[t].from < n.end);) {
                let n = e.markers[t++];
                this.addNode(n.type, n.from, n.to);
              }
              if (!n) break;
              this.finishContext();
            }
            if (e.pos < e.text.length) break;
            if (!this.nextLine()) return this.finish();
          }
          if (this.fragments && this.reuseFragment(e.basePos)) return null;
          start: for (;;) {
            for (let t of this.parser.blockParsers)
              if (t) {
                let n = t(this, e);
                if (n != 0) {
                  if (n == 1) return null;
                  e.forward();
                  continue start;
                }
              }
            break;
          }
          let t = new Be(this.lineStart + e.pos, e.text.slice(e.pos));
          for (let e of this.parser.leafBlockParsers)
            if (e) {
              let n = e(this, t);
              n && t.parsers.push(n);
            }
          lines: for (; this.nextLine() && e.pos != e.text.length;) {
            if (e.indent < e.baseIndent + 4) {
              for (let n of this.parser.endLeafBlock) if (n(this, e, t)) break lines;
            }
            for (let n of t.parsers) if (n.nextLine(this, e, t)) return null;
            t.content +=
              `
` + e.scrub();
            for (let n of e.markers) t.marks.push(n);
          }
          return (this.finishLeaf(t), null);
        }
        stopAt(e) {
          if (this.stoppedAt != null && this.stoppedAt < e)
            throw RangeError(`Can't move stoppedAt forward`);
          this.stoppedAt = e;
        }
        reuseFragment(e) {
          if (
            !this.fragments.moveTo(this.absoluteLineStart + e, this.absoluteLineStart) ||
            !this.fragments.matches(this.block.hash)
          )
            return !1;
          let t = this.fragments.takeNodes(this);
          return t
            ? ((this.absoluteLineStart += t),
              (this.lineStart = Me(this.absoluteLineStart, this.ranges)),
              this.moveRangeI(),
              this.absoluteLineStart < this.to
                ? (this.lineStart++, this.absoluteLineStart++, this.readLine())
                : ((this.atEnd = !0), this.readLine()),
              !0)
            : !1;
        }
        get depth() {
          return this.stack.length;
        }
        parentType(e = this.depth - 1) {
          return this.parser.nodeSet.types[this.stack[e].type];
        }
        nextLine() {
          return (
            (this.lineStart += this.line.text.length),
            this.absoluteLineEnd >= this.to
              ? ((this.absoluteLineStart = this.absoluteLineEnd),
                (this.atEnd = !0),
                this.readLine(),
                !1)
              : (this.lineStart++,
                (this.absoluteLineStart = this.absoluteLineEnd + 1),
                this.moveRangeI(),
                this.readLine(),
                !0)
          );
        }
        peekLine() {
          return this.scanLine(this.absoluteLineEnd + 1).text;
        }
        moveRangeI() {
          for (
            ;
            this.rangeI < this.ranges.length - 1 &&
            this.absoluteLineStart >= this.ranges[this.rangeI].to;
          )
            (this.rangeI++,
              (this.absoluteLineStart = Math.max(
                this.absoluteLineStart,
                this.ranges[this.rangeI].from,
              )));
        }
        scanLine(e) {
          let t = Ge;
          if (((t.end = e), e >= this.to)) t.text = ``;
          else if (
            ((t.text = this.lineChunkAt(e)), (t.end += t.text.length), this.ranges.length > 1)
          ) {
            let e = this.absoluteLineStart,
              n = this.rangeI;
            for (; this.ranges[n].to < t.end;) {
              n++;
              let r = this.ranges[n].from,
                i = this.lineChunkAt(r);
              ((t.end = r + i.length),
                (t.text = t.text.slice(0, this.ranges[n - 1].to - e) + i),
                (e = t.end - t.text.length));
            }
          }
          return t;
        }
        readLine() {
          let { line: e } = this,
            { text: t, end: n } = this.scanLine(this.absoluteLineStart);
          for (this.absoluteLineEnd = n, e.reset(t); e.depth < this.stack.length; e.depth++) {
            let t = this.stack[e.depth],
              n = this.parser.skipContextMarkup[t.type];
            if (!n) throw Error(`Unhandled block context ` + N[t.type]);
            let r = this.line.markers.length;
            if (!n(t, this, e)) {
              (this.line.markers.length > r &&
                (t.end = this.line.markers[this.line.markers.length - 1].to),
                e.forward());
              break;
            }
            e.forward();
          }
        }
        lineChunkAt(e) {
          let t = this.input.chunk(e),
            n;
          if (this.input.lineChunks)
            n =
              t ==
              `
`
                ? ``
                : t;
          else {
            let e = t.indexOf(`
`);
            n = e < 0 ? t : t.slice(0, e);
          }
          return e + n.length > this.to ? n.slice(0, this.to - e) : n;
        }
        prevLineEnd() {
          return this.atEnd ? this.lineStart : this.lineStart - 1;
        }
        startContext(e, t, n = 0) {
          ((this.block = M.create(
            e,
            n,
            this.lineStart + t,
            this.block.hash,
            this.lineStart + this.line.text.length,
          )),
            this.stack.push(this.block));
        }
        startComposite(e, t, n = 0) {
          this.startContext(this.parser.getNodeType(e), t, n);
        }
        addNode(e, t, n) {
          (typeof e == `number` &&
            (e = new m(this.parser.nodeSet.types[e], H, H, (n ?? this.prevLineEnd()) - t)),
            this.block.addChild(e, t - this.block.from));
        }
        addElement(e) {
          this.block.addChild(e.toTree(this.parser.nodeSet), e.from - this.block.from);
        }
        addLeafElement(e, t) {
          this.addNode(
            this.buffer
              .writeElements(A(t.children, e.marks), -t.from)
              .finish(t.type, t.to - t.from),
            t.from,
          );
        }
        finishContext() {
          let e = this.stack.pop(),
            t = this.stack[this.stack.length - 1];
          (t.addChild(e.toTree(this.parser.nodeSet), e.from - t.from), (this.block = t));
        }
        finish() {
          for (; this.stack.length > 1;) this.finishContext();
          return this.addGaps(this.block.toTree(this.parser.nodeSet, this.lineStart));
        }
        addGaps(e) {
          return this.ranges.length > 1
            ? De(this.ranges, 0, e.topNode, this.ranges[0].from, this.reusePlaceholders)
            : e;
        }
        finishLeaf(e) {
          for (let t of e.parsers) if (t.finish(this, e)) return;
          let t = A(this.parser.parseInline(e.content, e.start), e.marks);
          this.addNode(
            this.buffer.writeElements(t, -e.start).finish(N.Paragraph, e.content.length),
            e.start,
          );
        }
        elt(e, t, n, r) {
          return typeof e == `string` ? k(this.parser.getNodeType(e), t, n, r) : new Ye(e, t);
        }
        get buffer() {
          return new Je(this.parser.nodeSet);
        }
      }),
      (V = class e extends ue {
        constructor(e, t, n, r, i, a, o, s, c) {
          (super(),
            (this.nodeSet = e),
            (this.blockParsers = t),
            (this.leafBlockParsers = n),
            (this.blockNames = r),
            (this.endLeafBlock = i),
            (this.skipContextMarkup = a),
            (this.inlineParsers = o),
            (this.inlineNames = s),
            (this.wrappers = c),
            (this.nodeTypes = Object.create(null)));
          for (let t of e.types) this.nodeTypes[t.name] = t.id;
        }
        createParse(e, t, n) {
          let r = new Ke(this, e, t, n);
          for (let i of this.wrappers) r = i(r, e, t, n);
          return r;
        }
        configure(r) {
          let i = D(r);
          if (!i) return this;
          let { nodeSet: a, skipContextMarkup: o } = this,
            s = this.blockParsers.slice(),
            c = this.leafBlockParsers.slice(),
            l = this.blockNames.slice(),
            u = this.inlineParsers.slice(),
            d = this.inlineNames.slice(),
            f = this.endLeafBlock.slice(),
            m = this.wrappers;
          if (E(i.defineNodes)) {
            o = Object.assign({}, o);
            let e = a.types.slice(),
              r;
            for (let t of i.defineNodes) {
              let {
                name: i,
                block: a,
                composite: s,
                style: c,
              } = typeof t == `string` ? { name: t } : t;
              if (e.some((e) => e.name == i)) continue;
              s && (o[e.length] = (e, t, n) => s(t, n, e.value));
              let l = e.length,
                u = s
                  ? [`Block`, `BlockContext`]
                  : a
                    ? l >= N.ATXHeading1 && l <= N.SetextHeading2
                      ? [`Block`, `LeafBlock`, `Heading`]
                      : [`Block`, `LeafBlock`]
                    : void 0;
              (e.push(p.define({ id: l, name: i, props: u && [[_.group, u]] })),
                c &&
                  ((r ||= {}),
                  Array.isArray(c) || c instanceof n ? (r[i] = c) : Object.assign(r, c)));
            }
            ((a = new ce(e)), r && (a = a.extend(t(r))));
          }
          if ((E(i.props) && (a = a.extend(...i.props)), E(i.remove)))
            for (let e of i.remove) {
              let t = this.blockNames.indexOf(e),
                n = this.inlineNames.indexOf(e);
              (t > -1 && (s[t] = c[t] = void 0), n > -1 && (u[n] = void 0));
            }
          if (E(i.parseBlock))
            for (let e of i.parseBlock) {
              let t = l.indexOf(e.name);
              if (t > -1) ((s[t] = e.parse), (c[t] = e.leaf));
              else {
                let t = e.before ? O(l, e.before) : e.after ? O(l, e.after) + 1 : l.length - 1;
                (s.splice(t, 0, e.parse), c.splice(t, 0, e.leaf), l.splice(t, 0, e.name));
              }
              e.endLeaf && f.push(e.endLeaf);
            }
          if (E(i.parseInline))
            for (let e of i.parseInline) {
              let t = d.indexOf(e.name);
              if (t > -1) u[t] = e.parse;
              else {
                let t = e.before ? O(d, e.before) : e.after ? O(d, e.after) + 1 : d.length - 1;
                (u.splice(t, 0, e.parse), d.splice(t, 0, e.name));
              }
            }
          return (i.wrap && (m = m.concat(i.wrap)), new e(a, s, c, l, f, o, u, d, m));
        }
        getNodeType(e) {
          let t = this.nodeTypes[e];
          if (t == null) throw RangeError(`Unknown node type '${e}'`);
          return t;
        }
        parseInline(e, t) {
          let n = new Y(this, e, t);
          outer: for (let e = t; e < n.end;) {
            let t = n.char(e);
            for (let r of this.inlineParsers)
              if (r) {
                let i = r(n, t, e);
                if (i >= 0) {
                  e = i;
                  continue outer;
                }
              }
            e++;
          }
          return n.resolveMarkers(0);
        }
      }),
      (qe = [p.none]));
    for (let e = 1, t; (t = N[e]); e++)
      qe[e] = p.define({
        id: e,
        name: t,
        props:
          e >= N.Escape
            ? []
            : [[_.group, e in P ? [`Block`, `BlockContext`] : [`Block`, `LeafBlock`]]],
        top: t == `Document`,
      });
    ((H = []),
      (Je = class {
        constructor(e) {
          ((this.nodeSet = e), (this.content = []), (this.nodes = []));
        }
        write(e, t, n, r = 0) {
          return (this.content.push(e, t, n, 4 + r * 4), this);
        }
        writeElements(e, t = 0) {
          for (let n of e) n.writeTo(this, t);
          return this;
        }
        finish(e, t) {
          return m.build({
            buffer: this.content,
            nodeSet: this.nodeSet,
            reused: this.nodes,
            topID: e,
            length: t,
          });
        }
      }),
      (U = class {
        constructor(e, t, n, r = H) {
          ((this.type = e), (this.from = t), (this.to = n), (this.children = r));
        }
        writeTo(e, t) {
          let n = e.content.length;
          (e.writeElements(this.children, t),
            e.content.push(this.type, this.from + t, this.to + t, e.content.length + 4 - n));
        }
        toTree(e) {
          return new Je(e)
            .writeElements(this.children, -this.from)
            .finish(this.type, this.to - this.from);
        }
      }),
      (Ye = class {
        constructor(e, t) {
          ((this.tree = e), (this.from = t));
        }
        get to() {
          return this.from + this.tree.length;
        }
        get type() {
          return this.tree.type.id;
        }
        get children() {
          return H;
        }
        writeTo(e, t) {
          (e.nodes.push(this.tree),
            e.content.push(e.nodes.length - 1, this.from + t, this.to + t, -1));
        }
        toTree() {
          return this.tree;
        }
      }),
      (Xe = { resolve: `Emphasis`, mark: `EmphasisMark` }),
      (Ze = { resolve: `Emphasis`, mark: `EmphasisMark` }),
      (W = {}),
      (G = {}),
      (K = class {
        constructor(e, t, n, r) {
          ((this.type = e), (this.from = t), (this.to = n), (this.side = r));
        }
      }),
      (Qe = `!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~`),
      (q = /[!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~\xA1\u2010-\u2027]/));
    try {
      q = RegExp(`[\\p{S}|\\p{P}]`, `u`);
    } catch {}
    ((J = {
      Escape(e, t, n) {
        if (t != 92 || n == e.end - 1) return -1;
        let r = e.char(n + 1);
        for (let t = 0; t < 32; t++)
          if (Qe.charCodeAt(t) == r) return e.append(k(N.Escape, n, n + 2));
        return -1;
      },
      Entity(e, t, n) {
        if (t != 38) return -1;
        let r = /^(?:#\d+|#x[a-f\d]+|\w+);/i.exec(e.slice(n + 1, n + 31));
        return r ? e.append(k(N.Entity, n, n + 1 + r[0].length)) : -1;
      },
      InlineCode(e, t, n) {
        if (t != 96 || (n && e.char(n - 1) == 96)) return -1;
        let r = n + 1;
        for (; r < e.end && e.char(r) == 96;) r++;
        let i = r - n,
          a = 0;
        for (; r < e.end; r++)
          if (e.char(r) == 96) {
            if ((a++, a == i && e.char(r + 1) != 96))
              return e.append(
                k(N.InlineCode, n, r + 1, [
                  k(N.CodeMark, n, n + i),
                  k(N.CodeMark, r + 1 - i, r + 1),
                ]),
              );
          } else a = 0;
        return -1;
      },
      HTMLTag(e, t, n) {
        if (t != 60 || n == e.end - 1) return -1;
        let r = e.slice(n + 1, e.end),
          i =
            /^(?:[a-z][-\w+.]+:[^\s>]+|[a-z\d.!#$%&'*+/=?^_`{|}~-]+@[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?)*)>/i.exec(
              r,
            );
        if (i)
          return e.append(
            k(N.Autolink, n, n + 1 + i[0].length, [
              k(N.LinkMark, n, n + 1),
              k(N.URL, n + 1, n + i[0].length),
              k(N.LinkMark, n + i[0].length, n + 1 + i[0].length),
            ]),
          );
        let a = /^!--[^>](?:-[^-]|[^-])*?-->/i.exec(r);
        if (a) return e.append(k(N.Comment, n, n + 1 + a[0].length));
        let o = /^\?[^]*?\?>/.exec(r);
        if (o) return e.append(k(N.ProcessingInstruction, n, n + 1 + o[0].length));
        let s =
          /^(?:![A-Z][^]*?>|!\[CDATA\[[^]*?\]\]>|\/\s*[a-zA-Z][\w-]*\s*>|\s*[a-zA-Z][\w-]*(\s+[a-zA-Z:_][\w-.:]*(?:\s*=\s*(?:[^\s"'=<>`]+|'[^']*'|"[^"]*"))?)*\s*(\/\s*)?>)/.exec(
            r,
          );
        return s ? e.append(k(N.HTMLTag, n, n + 1 + s[0].length)) : -1;
      },
      Emphasis(e, t, n) {
        if (t != 95 && t != 42) return -1;
        let r = n + 1;
        for (; e.char(r) == t;) r++;
        let i = e.slice(n - 1, n),
          a = e.slice(r, r + 1),
          o = q.test(i),
          s = q.test(a),
          c = /\s|^$/.test(i),
          l = /\s|^$/.test(a),
          u = !l && (!s || c || o),
          d = !c && (!o || l || s),
          f = u && (t == 42 || !d || o),
          p = d && (t == 42 || !u || s);
        return e.append(new K(t == 95 ? Xe : Ze, n, r, !!f | (p ? 2 : 0)));
      },
      HardBreak(e, t, n) {
        if (t == 92 && e.char(n + 1) == 10) return e.append(k(N.HardBreak, n, n + 2));
        if (t == 32) {
          let t = n + 1;
          for (; e.char(t) == 32;) t++;
          if (e.char(t) == 10 && t >= n + 2) return e.append(k(N.HardBreak, n, t + 1));
        }
        return -1;
      },
      Link(e, t, n) {
        return t == 91 ? e.append(new K(W, n, n + 1, 1)) : -1;
      },
      Image(e, t, n) {
        return t == 33 && e.char(n + 1) == 91 ? e.append(new K(G, n, n + 2, 1)) : -1;
      },
      LinkEnd(e, t, n) {
        if (t != 93) return -1;
        for (let t = e.parts.length - 1; t >= 0; t--) {
          let r = e.parts[t];
          if (r instanceof K && (r.type == W || r.type == G)) {
            if (!r.side || (e.skipSpace(r.to) == n && !/[(\[]/.test(e.slice(n + 1, n + 2))))
              return ((e.parts[t] = null), -1);
            let i = e.takeContent(t),
              a = (e.parts[t] = Oe(e, i, r.type == W ? N.Link : N.Image, r.from, n + 1));
            if (r.type == W)
              for (let n = 0; n < t; n++) {
                let t = e.parts[n];
                t instanceof K && t.type == W && (t.side = 0);
              }
            return a.to;
          }
        }
        return -1;
      },
    }),
      (Y = class {
        constructor(e, t, n) {
          ((this.parser = e), (this.text = t), (this.offset = n), (this.parts = []));
        }
        char(e) {
          return e >= this.end ? -1 : this.text.charCodeAt(e - this.offset);
        }
        get end() {
          return this.offset + this.text.length;
        }
        slice(e, t) {
          return this.text.slice(e - this.offset, t - this.offset);
        }
        append(e) {
          return (this.parts.push(e), e.to);
        }
        addDelimiter(e, t, n, r, i) {
          return this.append(new K(e, t, n, !!r | (i ? 2 : 0)));
        }
        get hasOpenLink() {
          for (let e = this.parts.length - 1; e >= 0; e--) {
            let t = this.parts[e];
            if (t instanceof K && (t.type == W || t.type == G)) return !0;
          }
          return !1;
        }
        addElement(e) {
          return this.append(e);
        }
        resolveMarkers(e) {
          for (let t = e; t < this.parts.length; t++) {
            let n = this.parts[t];
            if (!(n instanceof K && n.type.resolve && n.side & 2)) continue;
            let r = n.type == Xe || n.type == Ze,
              i = n.to - n.from,
              a,
              o = t - 1;
            for (; o >= e; o--) {
              let e = this.parts[o];
              if (
                e instanceof K &&
                e.side & 1 &&
                e.type == n.type &&
                !(
                  r &&
                  (n.side & 1 || e.side & 2) &&
                  (e.to - e.from + i) % 3 == 0 &&
                  ((e.to - e.from) % 3 || i % 3)
                )
              ) {
                a = e;
                break;
              }
            }
            if (!a) continue;
            let s = n.type.resolve,
              c = [],
              l = a.from,
              u = n.to;
            if (r) {
              let e = Math.min(2, a.to - a.from, i);
              ((l = a.to - e), (u = n.from + e), (s = e == 1 ? `Emphasis` : `StrongEmphasis`));
            }
            a.type.mark && c.push(this.elt(a.type.mark, l, a.to));
            for (let e = o + 1; e < t; e++)
              (this.parts[e] instanceof U && c.push(this.parts[e]), (this.parts[e] = null));
            n.type.mark && c.push(this.elt(n.type.mark, n.from, u));
            let d = this.elt(s, l, u, c);
            ((this.parts[o] = r && a.from != l ? new K(a.type, a.from, l, a.side) : null),
              (this.parts[t] = r && n.to != u ? new K(n.type, u, n.to, n.side) : null)
                ? this.parts.splice(t, 0, d)
                : (this.parts[t] = d));
          }
          let t = [];
          for (let n = e; n < this.parts.length; n++) {
            let e = this.parts[n];
            e instanceof U && t.push(e);
          }
          return t;
        }
        findOpeningDelimiter(e) {
          for (let t = this.parts.length - 1; t >= 0; t--) {
            let n = this.parts[t];
            if (n instanceof K && n.type == e && n.side & 1) return t;
          }
          return null;
        }
        takeContent(e) {
          let t = this.resolveMarkers(e);
          return ((this.parts.length = e), t);
        }
        getDelimiterAt(e) {
          let t = this.parts[e];
          return t instanceof K ? t : null;
        }
        skipSpace(e) {
          return b(this.text, e - this.offset) + this.offset;
        }
        elt(e, t, n, r) {
          return typeof e == `string` ? k(this.parser.getNodeType(e), t, n, r) : new Ye(e, t);
        }
      }),
      (Y.linkStart = W),
      (Y.imageStart = G),
      ($e = [N.CodeBlock, N.ListItem, N.OrderedList, N.BulletList]),
      (et = class {
        constructor(e, t) {
          ((this.fragments = e),
            (this.input = t),
            (this.i = 0),
            (this.fragment = null),
            (this.fragmentEnd = -1),
            (this.cursor = null),
            e.length && (this.fragment = e[this.i++]));
        }
        nextFragment() {
          ((this.fragment = this.i < this.fragments.length ? this.fragments[this.i++] : null),
            (this.cursor = null),
            (this.fragmentEnd = -1));
        }
        moveTo(e, t) {
          for (; this.fragment && this.fragment.to <= e;) this.nextFragment();
          if (!this.fragment || this.fragment.from > (e ? e - 1 : 0)) return !1;
          if (this.fragmentEnd < 0) {
            let e = this.fragment.to;
            for (
              ;
              e > 0 &&
              this.input.read(e - 1, e) !=
                `
`;
            )
              e--;
            this.fragmentEnd = e ? e - 1 : 0;
          }
          let n = this.cursor;
          n || ((n = this.cursor = this.fragment.tree.cursor()), n.firstChild());
          let r = e + this.fragment.offset;
          for (; n.to <= r;) if (!n.parent()) return !1;
          for (;;) {
            if (n.from >= r) return this.fragment.from <= t;
            if (!n.childAfter(r)) return !1;
          }
        }
        matches(e) {
          let t = this.cursor.tree;
          return t && t.prop(_.contextHash) == e;
        }
        takeNodes(e) {
          let t = this.cursor,
            n = this.fragment.offset,
            r = this.fragmentEnd - +!!this.fragment.openEnd,
            i = e.absoluteLineStart,
            a = i,
            o = e.block.children.length,
            s = a,
            c = o;
          for (;;) {
            if (t.to - n > r) {
              if (t.type.isAnonymous && t.firstChild()) continue;
              break;
            }
            let i = Me(t.from - n, e.ranges);
            if (t.to - n <= e.ranges[e.rangeI].to) e.addNode(t.tree, i);
            else {
              let n = new m(e.parser.nodeSet.types[N.Paragraph], [], [], 0, e.block.hashProp);
              (e.reusePlaceholders.set(n, t.tree), e.addNode(n, i));
            }
            if (
              (t.type.is(`Block`) &&
                ($e.indexOf(t.type.id) < 0
                  ? ((a = t.to - n), (o = e.block.children.length))
                  : ((a = s), (o = c)),
                (s = t.to - n),
                (c = e.block.children.length)),
              !t.nextSibling())
            )
              break;
          }
          for (; e.block.children.length > o;) (e.block.children.pop(), e.block.positions.pop());
          return a - i;
        }
      }),
      (tt = t({
        "Blockquote/...": g.quote,
        HorizontalRule: g.contentSeparator,
        "ATXHeading1/... SetextHeading1/...": g.heading1,
        "ATXHeading2/... SetextHeading2/...": g.heading2,
        "ATXHeading3/...": g.heading3,
        "ATXHeading4/...": g.heading4,
        "ATXHeading5/...": g.heading5,
        "ATXHeading6/...": g.heading6,
        "Comment CommentBlock": g.comment,
        Escape: g.escape,
        Entity: g.character,
        "Emphasis/...": g.emphasis,
        "StrongEmphasis/...": g.strong,
        "Link/... Image/...": g.link,
        "OrderedList/... BulletList/...": g.list,
        "BlockQuote/...": g.quote,
        "InlineCode CodeText": g.monospace,
        "URL Autolink": g.url,
        "HeaderMark HardBreak QuoteMark ListMark LinkMark EmphasisMark CodeMark":
          g.processingInstruction,
        "CodeInfo LinkLabel": g.labelName,
        LinkTitle: g.string,
        Paragraph: g.content,
      })),
      (nt = new V(
        new ce(qe).extend(tt),
        Object.keys(z).map((e) => z[e]),
        Object.keys(z).map((e) => B[e]),
        Object.keys(z),
        We,
        P,
        Object.keys(J).map((e) => J[e]),
        Object.keys(J),
        [],
      )),
      (rt = { resolve: `Strikethrough`, mark: `StrikethroughMark` }),
      (it = {
        defineNodes: [
          { name: `Strikethrough`, style: { "Strikethrough/...": g.strikethrough } },
          { name: `StrikethroughMark`, style: g.processingInstruction },
        ],
        parseInline: [
          {
            name: `Strikethrough`,
            parse(e, t, n) {
              if (t != 126 || e.char(n + 1) != 126 || e.char(n + 2) == 126) return -1;
              let r = e.slice(n - 1, n),
                i = e.slice(n + 2, n + 3),
                a = /\s|^$/.test(r),
                o = /\s|^$/.test(i),
                s = q.test(r),
                c = q.test(i);
              return e.addDelimiter(rt, n, n + 2, !o && (!c || a || s), !a && (!s || o || c));
            },
            after: `Emphasis`,
          },
        ],
      }),
      (at = /^[>\s]*\|?(\s*:?-+:?\s*\|)+(\s*:?-+:?\s*)?$/),
      (ot = class {
        constructor() {
          this.rows = null;
        }
        nextLine(e, t, n) {
          if (this.rows == null) {
            this.rows = !1;
            let r;
            if (
              (t.next == 45 || t.next == 58 || t.next == 124) &&
              at.test((r = t.text.slice(t.pos)))
            ) {
              let i = [];
              j(e, n.content, 0, i, n.start) == j(e, r, 0) &&
                (this.rows = [
                  e.elt(`TableHeader`, n.start, n.start + n.content.length, i),
                  e.elt(`TableDelimiter`, e.lineStart + t.pos, e.lineStart + t.text.length),
                ]);
            }
          } else if (this.rows) {
            let n = [];
            (j(e, t.text, t.pos, n, e.lineStart),
              this.rows.push(
                e.elt(`TableRow`, e.lineStart + t.pos, e.lineStart + t.text.length, n),
              ));
          }
          return !1;
        }
        finish(e, t) {
          return this.rows
            ? (e.addLeafElement(t, e.elt(`Table`, t.start, t.start + t.content.length, this.rows)),
              !0)
            : !1;
        }
      }),
      (st = {
        defineNodes: [
          { name: `Table`, block: !0 },
          { name: `TableHeader`, style: { "TableHeader/...": g.heading } },
          `TableRow`,
          { name: `TableCell`, style: g.content },
          { name: `TableDelimiter`, style: g.processingInstruction },
        ],
        parseBlock: [
          {
            name: `Table`,
            leaf(e, t) {
              return Fe(t.content, 0) ? new ot() : null;
            },
            endLeaf(e, t, n) {
              if (n.parsers.some((e) => e instanceof ot) || !Fe(t.text, t.basePos)) return !1;
              let r = e.peekLine();
              return at.test(r) && j(e, t.text, t.basePos) == j(e, r, t.basePos);
            },
            before: `SetextHeading`,
          },
        ],
      }),
      (ct = class {
        nextLine() {
          return !1;
        }
        finish(e, t) {
          return (
            e.addLeafElement(
              t,
              e.elt(`Task`, t.start, t.start + t.content.length, [
                e.elt(`TaskMarker`, t.start, t.start + 3),
                ...e.parser.parseInline(t.content.slice(3), t.start + 3),
              ]),
            ),
            !0
          );
        }
      }),
      (lt = {
        defineNodes: [
          { name: `Task`, block: !0, style: g.list },
          { name: `TaskMarker`, style: g.atom },
        ],
        parseBlock: [
          {
            name: `TaskList`,
            leaf(e, t) {
              return /^\[[ xX]\][ \t]/.test(t.content) && e.parentType().name == `ListItem`
                ? new ct()
                : null;
            },
            after: `SetextHeading`,
          },
        ],
      }),
      (ut = /(www\.)|(https?:\/\/)|([\w.+-]{1,100}@)|(mailto:|xmpp:)/gy),
      (dt = /[\w-]+(\.[\w-]+)+(:\d+)?(\/[^\s<]*)?/gy),
      (ft = /[\w-]+\.[\w-]+($|[/:])/),
      (pt = /[\w.+-]+@[\w-]+(\.[\w.-]+)+/gy),
      (mt = /\/[a-zA-Z\d@.]+/gy),
      (ht = {
        parseInline: [
          {
            name: `Autolink`,
            parse(e, t, n) {
              let r = n - e.offset;
              if (r && /\w/.test(e.text[r - 1])) return -1;
              ut.lastIndex = r;
              let i = ut.exec(e.text),
                a = -1;
              return !i ||
                (i[1] || i[2]
                  ? ((a = Le(e.text, r + i[0].length)),
                    a > -1 &&
                      e.hasOpenLink &&
                      (a = r + /([^\[\]]|\[[^\]]*\])*/.exec(e.text.slice(r, a))[0].length))
                  : i[3]
                    ? (a = Re(e.text, r))
                    : ((a = Re(e.text, r + i[0].length)),
                      a > -1 &&
                        i[0] == `xmpp:` &&
                        ((mt.lastIndex = a),
                        (i = mt.exec(e.text)),
                        i && (a = i.index + i[0].length))),
                a < 0)
                ? -1
                : (e.addElement(e.elt(`URL`, n, a + e.offset)), a + e.offset);
            },
          },
        ],
      }),
      (gt = [st, lt, it, ht]),
      (_t = {
        defineNodes: [
          { name: `Superscript`, style: g.special(g.content) },
          { name: `SuperscriptMark`, style: g.processingInstruction },
        ],
        parseInline: [{ name: `Superscript`, parse: ze(94, `Superscript`, `SuperscriptMark`) }],
      }),
      (vt = {
        defineNodes: [
          { name: `Subscript`, style: g.special(g.content) },
          { name: `SubscriptMark`, style: g.processingInstruction },
        ],
        parseInline: [{ name: `Subscript`, parse: ze(126, `Subscript`, `SubscriptMark`) }],
      }),
      (yt = {
        defineNodes: [{ name: `Emoji`, style: g.character }],
        parseInline: [
          {
            name: `Emoji`,
            parse(e, t, n) {
              let r;
              return t != 58 || !(r = /^[a-zA-Z_0-9]+:/.exec(e.slice(n + 1, e.end)))
                ? -1
                : e.addElement(e.elt(`Emoji`, n, n + 1 + r[0].length));
            },
          },
        ],
      }));
  });
function xt(e) {
  let t = /^(?:ATX|Setext)Heading(\d)$/.exec(e.name);
  return t ? +t[1] : void 0;
}
function St(e) {
  return e.name == `OrderedList` || e.name == `BulletList`;
}
function Ct(e, t) {
  let n = e;
  for (;;) {
    let e = n.nextSibling,
      r;
    if (!e || ((r = xt(e.type)) != null && r <= t)) break;
    n = e;
  }
  return n.to;
}
function wt(e) {
  return new oe(X, e, [], `markdown`);
}
function Tt(e, t) {
  return (n) => {
    if (n && e) {
      let t = null;
      if (
        ((n = /\S*/.exec(n)[0]),
        (t = typeof e == `function` ? e(n) : te.matchLanguageName(e, n, !0)),
        t instanceof te)
      )
        return t.support ? t.support.language.parser : ie.getSkippingParser(t.load());
      if (t) return t.parser;
    }
    return t ? t.parser : null;
  };
}
function Et(e, t) {
  let n = [],
    r = [];
  for (let t = e; t; t = t.parent) {
    if (t.name == `FencedCode`) return r;
    (t.name == `ListItem` || t.name == `Blockquote`) && n.push(t);
  }
  for (let e = n.length - 1; e >= 0; e--) {
    let i = n[e],
      a,
      o = t.lineAt(i.from),
      s = i.from - o.from;
    if (i.name == `Blockquote` && (a = /^ *>( ?)/.exec(o.text.slice(s))))
      r.push(new Q(i, s, s + a[0].length, ``, a[1], `>`, null));
    else if (
      i.name == `ListItem` &&
      i.parent.name == `OrderedList` &&
      (a = /^( *)\d+([.)])( *)/.exec(o.text.slice(s)))
    ) {
      let e = a[3],
        t = a[0].length;
      (e.length >= 4 && ((e = e.slice(0, e.length - 4)), (t -= 4)),
        r.push(new Q(i.parent, s, s + t, a[1], e, a[2], i)));
    } else if (
      i.name == `ListItem` &&
      i.parent.name == `BulletList` &&
      (a = /^( *)([-+*])( {1,4}\[[ xX]\])?( +)/.exec(o.text.slice(s)))
    ) {
      let e = a[4],
        t = a[0].length;
      e.length > 4 && ((e = e.slice(0, e.length - 4)), (t -= 4));
      let n = a[2];
      (a[3] && (n += a[3].replace(/[xX]/, ` `)), r.push(new Q(i.parent, s, s + t, a[1], e, n, i)));
    }
  }
  return r;
}
function Dt(e, t) {
  return /^(\s*)(\d+)(?=[.)])/.exec(t.sliceString(e.from, e.from + 10));
}
function Ot(e, t, n, r = 0) {
  for (let i = -1, a = e; ;) {
    if (a.name == `ListItem`) {
      let e = Dt(a, t),
        o = +e[2];
      if (i >= 0) {
        if (o != i + 1) return;
        n.push({ from: a.from + e[1].length, to: a.from + e[0].length, insert: String(i + 2 + r) });
      }
      i = o;
    }
    let e = a.nextSibling;
    if (!e) break;
    a = e;
  }
}
function kt(e, t) {
  let n = /^[ \t]*/.exec(e)[0].length;
  if (!n || t.facet(f) != `	`) return e;
  let r = v(e, 4, n),
    i = ``;
  for (let e = r; e > 0;) e >= 4 ? ((i += `	`), (e -= 4)) : ((i += ` `), e--);
  return i + e.slice(n);
}
function At(e) {
  return e.name == `QuoteMark` || e.name == `ListMark`;
}
function jt(e, t) {
  if (e.name != `OrderedList` && e.name != `BulletList`) return !1;
  let n = e.firstChild,
    r = e.getChild(`ListItem`, `ListItem`);
  if (!r) return !1;
  let i = t.lineAt(n.to),
    a = t.lineAt(r.from),
    o = /^[\s>]*$/.test(i.text);
  return i.number + +!o < a.number;
}
function Mt(e, t, n) {
  let r = ``;
  for (let t = 0, i = e.length - 2; t <= i; t++)
    r += e[t].blank(t < i ? v(n.text, 4, e[t + 1].from) - r.length : null, t < i);
  return kt(r, t);
}
function Nt(e, t) {
  let n = e.resolveInner(t, -1),
    r = t;
  At(n) && ((r = n.from), (n = n.parent));
  for (let e; (e = n.childBefore(r));)
    if (At(e)) r = e.from;
    else if (e.name == `OrderedList` || e.name == `BulletList`) ((n = e.lastChild), (r = n.to));
    else break;
  return n;
}
function Pt(e = {}) {
  let {
    codeLanguages: t,
    defaultCodeLanguage: n,
    addKeymap: r = !0,
    base: { parser: i } = Bt,
    completeHTMLTags: o = !0,
    pasteURLAsLink: s = !0,
    htmlTagLanguage: l = Gt,
  } = e;
  if (!(i instanceof V))
    throw RangeError("Base parser provided to `markdown` should be a Markdown parser");
  let u = e.extensions ? [e.extensions] : [],
    f = [l.support, zt],
    p;
  (s && f.push(qt), n instanceof d ? (f.push(n.support), (p = n.language)) : n && (p = n));
  let m = t || p ? Tt(t, p) : void 0;
  (u.push(Pe({ codeParser: m, htmlParser: l.language.parser })), r && f.push(a.high(c.of(Wt))));
  let h = wt(i.configure(u));
  return (o && f.push(h.data.of({ autocomplete: Ft })), new d(h, f));
}
function Ft(e) {
  let { state: t, pos: n } = e,
    i = /<[:\-\.\w\u00b7-\uffff]*$/.exec(t.sliceDoc(n - 25, n));
  if (!i) return null;
  let a = r(t).resolveInner(n, -1);
  for (; a && !a.type.isTop;) {
    if (
      a.name == `CodeBlock` ||
      a.name == `FencedCode` ||
      a.name == `ProcessingInstructionBlock` ||
      a.name == `CommentBlock` ||
      a.name == `Link` ||
      a.name == `Image`
    )
      return null;
    a = a.parent;
  }
  return { from: n - i[0].length, to: n, options: It(), validFor: /^<[:\-\.\w\u00b7-\uffff]*$/ };
}
function It() {
  if ($) return $;
  let e = ge(new me(i.create({ extensions: Gt }), 0, !0));
  return ($ = e ? e.options : []);
}
var X, Lt, Rt, zt, Bt, Z, Q, Vt, Ht, Ut, Wt, Gt, $, Kt, qt;
e(() => {
  (se(),
    o(),
    fe(),
    pe(),
    bt(),
    _e(),
    h(),
    (X = le({ commentTokens: { block: { open: `<!--`, close: `-->` } } })),
    (Lt = new _()),
    (Rt = nt.configure({
      props: [
        re.add((e) =>
          !e.is(`Block`) || e.is(`Document`) || xt(e) != null || St(e)
            ? void 0
            : (e, t) => ({ from: t.doc.lineAt(e.from).to, to: e.to }),
        ),
        Lt.add(xt),
        de.add({ Document: () => null }),
        l.add({ Document: X }),
      ],
    })),
    (zt = ee.of((e, t, n) => {
      for (let i = r(e).resolveInner(n, -1); i && !(i.from < t); i = i.parent) {
        let e = i.type.prop(Lt);
        if (e == null) continue;
        let t = Ct(i, e);
        if (t > n) return { from: n, to: t };
      }
      return null;
    })),
    (Bt = wt(Rt)),
    (Z = wt(
      Rt.configure([
        gt,
        vt,
        _t,
        yt,
        { props: [re.add({ Table: (e, t) => ({ from: t.doc.lineAt(e.from).to, to: e.to }) })] },
      ]),
    )),
    (Q = class {
      constructor(e, t, n, r, i, a, o) {
        ((this.node = e),
          (this.from = t),
          (this.to = n),
          (this.spaceBefore = r),
          (this.spaceAfter = i),
          (this.type = a),
          (this.item = o));
      }
      blank(e, t = !0) {
        let n = this.spaceBefore + (this.node.name == `Blockquote` ? `>` : ``);
        if (e != null) {
          for (; n.length < e;) n += ` `;
          return n;
        } else {
          for (let e = this.to - this.from - n.length - this.spaceAfter.length; e > 0; e--)
            n += ` `;
          return n + (t ? this.spaceAfter : ``);
        }
      }
      marker(e, t) {
        let n = this.node.name == `OrderedList` ? String(+Dt(this.item, e)[2] + t) : ``;
        return this.spaceBefore + n + this.type + this.spaceAfter;
      }
    }),
    (Vt =
      (e = {}) =>
      ({ state: t, dispatch: n }) => {
        let i = r(t),
          { doc: a } = t,
          o = null,
          s = t.changeByRange((n) => {
            if (!n.empty || (!Z.isActiveAt(t, n.from, -1) && !Z.isActiveAt(t, n.from, 1)))
              return (o = { range: n });
            let r = n.from,
              s = a.lineAt(r),
              c = Et(i.resolveInner(r, -1), a);
            for (; c.length && c[c.length - 1].from > r - s.from;) c.pop();
            if (!c.length) return (o = { range: n });
            let l = c[c.length - 1];
            if (l.to - l.spaceAfter.length > r - s.from) return (o = { range: n });
            let d = r >= l.to - l.spaceAfter.length && !/\S/.test(s.text.slice(l.to));
            if (l.item && d) {
              let n = l.node.firstChild,
                i = l.node.getChild(`ListItem`, `ListItem`);
              if (
                n.to >= r ||
                (i && i.to < r) ||
                (s.from > 0 && !/[^\s>]/.test(a.lineAt(s.from - 1).text)) ||
                e.nonTightLists === !1
              ) {
                let e = c.length > 1 ? c[c.length - 2] : null,
                  t,
                  n = ``;
                e && e.item
                  ? ((t = s.from + e.from), (n = e.marker(a, 1)))
                  : (t = s.from + (e ? e.to : 0));
                let i = [{ from: t, to: r, insert: n }];
                return (
                  l.node.name == `OrderedList` && Ot(l.item, a, i, -2),
                  e && e.node.name == `OrderedList` && Ot(e.item, a, i),
                  { range: u.cursor(t + n.length), changes: i }
                );
              } else {
                let e = Mt(c, t, s);
                return {
                  range: u.cursor(r + e.length + 1),
                  changes: { from: s.from, insert: e + t.lineBreak },
                };
              }
            }
            if (l.node.name == `Blockquote` && d && s.from) {
              let e = a.lineAt(s.from - 1),
                r = />\s*$/.exec(e.text);
              if (r && r.index == l.from) {
                let i = t.changes([
                  { from: e.from + r.index, to: e.to },
                  { from: s.from + l.from, to: s.to },
                ]);
                return { range: n.map(i), changes: i };
              }
            }
            let f = [];
            l.node.name == `OrderedList` && Ot(l.item, a, f);
            let p = l.item && l.item.from < s.from,
              m = ``;
            if (!p || /^[\s\d.)\-+*>]*/.exec(s.text)[0].length >= l.to)
              for (let e = 0, t = c.length - 1; e <= t; e++)
                m +=
                  e == t && !p
                    ? c[e].marker(a, 1)
                    : c[e].blank(e < t ? v(s.text, 4, c[e + 1].from) - m.length : null);
            let h = r;
            for (; h > s.from && /\s/.test(s.text.charAt(h - s.from - 1));) h--;
            return (
              (m = kt(m, t)),
              jt(l.node, t.doc) && (m = Mt(c, t, s) + t.lineBreak + m),
              f.push({ from: h, to: r, insert: t.lineBreak + m }),
              { range: u.cursor(h + m.length + 1), changes: f }
            );
          });
        return o ? !1 : (n(t.update(s, { scrollIntoView: !0, userEvent: `input` })), !0);
      }),
    (Ht = Vt()),
    (Ut = ({ state: e, dispatch: t }) => {
      let n = r(e),
        i = null,
        a = e.changeByRange((t) => {
          let r = t.from,
            { doc: a } = e;
          if (t.empty && Z.isActiveAt(e, t.from)) {
            let t = a.lineAt(r),
              i = Et(Nt(n, r), a);
            if (i.length) {
              let n = i[i.length - 1],
                a = n.to - n.spaceAfter.length + +!!n.spaceAfter;
              if (r - t.from > a && !/\S/.test(t.text.slice(a, r - t.from)))
                return { range: u.cursor(t.from + a), changes: { from: t.from + a, to: r } };
              if (
                r - t.from == a &&
                (!n.item || t.from <= n.item.from || !/\S/.test(t.text.slice(0, n.to)))
              ) {
                let i = t.from + n.from;
                if (n.item && n.node.from < n.item.from && /\S/.test(t.text.slice(n.from, n.to))) {
                  let r = n.blank(v(t.text, 4, n.to) - v(t.text, 4, n.from));
                  return (
                    i == t.from && (r = kt(r, e)),
                    {
                      range: u.cursor(i + r.length),
                      changes: { from: i, to: t.from + n.to, insert: r },
                    }
                  );
                }
                if (i < r) return { range: u.cursor(i), changes: { from: i, to: r } };
              }
            }
          }
          return (i = { range: t });
        });
      return i ? !1 : (t(e.update(a, { scrollIntoView: !0, userEvent: `delete` })), !0);
    }),
    (Wt = [
      { key: `Enter`, run: Ht },
      { key: `Backspace`, run: Ut },
    ]),
    (Gt = he({ matchClosingTags: !1 })),
    ($ = null),
    (Kt = /code|horizontalrule|html|link|comment|processing|escape|entity|image|mark|url/i),
    (qt = s.domEventHandlers({
      paste: (e, t) => {
        let { main: n } = t.state.selection;
        if (n.empty) return !1;
        let i = e.clipboardData?.getData(`text/plain`);
        if (
          !i ||
          !/^(https?:\/\/|mailto:|xmpp:|www\.)/.test(i) ||
          (/^www\./.test(i) && (i = `https://` + i), !Z.isActiveAt(t.state, n.from, 1))
        )
          return !1;
        let a = r(t.state),
          o = !1;
        return (
          a.iterate({
            from: n.from,
            to: n.to,
            enter: (e) => {
              (e.from > n.from || Kt.test(e.name)) && (o = !0);
            },
            leave: (e) => {
              e.to < n.to && (o = !0);
            },
          }),
          o
            ? !1
            : (t.dispatch({
                changes: [
                  { from: n.from, insert: `[` },
                  { from: n.to, insert: `](${i})` },
                ],
                userEvent: `input.paste`,
                scrollIntoView: !0,
              }),
              !0)
        );
      },
    })));
})();
export { Pt as markdown };
//# sourceMappingURL=dist-D4om5K_z.js.map
