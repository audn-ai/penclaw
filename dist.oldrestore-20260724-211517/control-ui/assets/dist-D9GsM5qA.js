import {
  $ as t,
  B as n,
  E as r,
  F as i,
  J as a,
  K as o,
  L as s,
  M as c,
  P as l,
  Q as u,
  R as d,
  W as f,
  X as p,
  Y as m,
  Z as h,
  b as g,
  q as _,
  rt as v,
  x as y,
} from "./dist-DRf-DUop.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
function b(e) {
  let t = Object.keys(e).join(``),
    n = /\w/.test(t);
  return (n && (t = t.replace(/\w/g, ``)), `[${n ? `\\w` : ``}${t.replace(/[^\w\s]/g, `\\$&`)}]`);
}
function x(e) {
  let t = Object.create(null),
    n = Object.create(null);
  for (let { label: r } of e) {
    t[r[0]] = !0;
    for (let e = 1; e < r.length; e++) n[r[e]] = !0;
  }
  let r = b(t) + b(n) + `*$`;
  return [RegExp(`^` + r), new RegExp(r)];
}
function S(e) {
  let t = e.map((e) => (typeof e == `string` ? { label: e } : e)),
    [n, r] = t.every((e) => /^\w+$/.test(e.label)) ? [/\w*$/, /\w+$/] : x(t);
  return (e) => {
    let i = e.matchBefore(r);
    return i || e.explicit ? { from: i ? i.from : e.pos, options: t, validFor: n } : null;
  };
}
function C(e, t) {
  return (n) => {
    for (let t = r(n.state).resolveInner(n.pos, -1); t; t = t.parent) {
      if (e.indexOf(t.name) > -1) return null;
      if (t.type.isTop) break;
    }
    return t(n);
  };
}
function w(e, t) {
  let { source: n } = e,
    r = t && n[0] != `^`,
    i = n[n.length - 1] != `$`;
  return !r && !i
    ? e
    : RegExp(`${r ? `^` : ``}(?:${n})${i ? `$` : ``}`, e.flags ?? (e.ignoreCase ? `i` : ``));
}
function T(e, t) {
  return f.create(e.filter((e) => e.field == t).map((e) => f.range(e.from, e.to)));
}
function E(e) {
  let n = P.parse(e);
  return (e, r, i, a) => {
    let { text: o, ranges: s } = n.instantiate(e.state, i),
      { main: c } = e.state.selection,
      l = {
        changes: { from: i, to: a == c.from ? c.to : a, insert: u.of(o) },
        scrollIntoView: !0,
        annotations: r ? [A.of(r), t.userEvent.of(`input.complete`)] : void 0,
      };
    if ((s.length && (l.selection = T(s, 0)), s.some((e) => e.field > 0))) {
      let t = new L(s, 0),
        n = (l.effects = [R.of(t)]);
      e.state.field(B, !1) === void 0 && n.push(p.appendConfig.of([B, K, q, j]));
    }
    e.dispatch(e.state.update(l));
  };
}
function D(e) {
  return ({ state: t, dispatch: n }) => {
    let r = t.field(B, !1);
    if (!r || (e < 0 && r.active == 0)) return !1;
    let i = r.active + e,
      a = e > 0 && !r.ranges.some((t) => t.field == i + e);
    return (
      n(
        t.update({
          selection: T(r.ranges, i),
          effects: R.of(a ? null : new L(r.ranges, i)),
          scrollIntoView: !0,
        }),
      ),
      !0
    );
  };
}
function O(e, t) {
  return { ...t, apply: E(e) };
}
var k,
  A,
  j,
  M,
  N,
  P,
  F,
  I,
  L,
  R,
  z,
  B,
  V,
  H,
  U,
  W,
  G,
  K,
  q,
  J,
  Y = e(() => {
    (v(),
      s(),
      y(),
      (k = class {
        constructor(e, t, n, r) {
          ((this.state = e),
            (this.pos = t),
            (this.explicit = n),
            (this.view = r),
            (this.abortListeners = []),
            (this.abortOnDocChange = !1));
        }
        tokenBefore(e) {
          let t = r(this.state).resolveInner(this.pos, -1);
          for (; t && e.indexOf(t.name) < 0;) t = t.parent;
          return t
            ? {
                from: t.from,
                to: this.pos,
                text: this.state.sliceDoc(t.from, this.pos),
                type: t.type,
              }
            : null;
        }
        matchBefore(e) {
          let t = this.state.doc.lineAt(this.pos),
            n = Math.max(t.from, this.pos - 250),
            r = t.text.slice(n - t.from, this.pos - t.from),
            i = r.search(w(e, !1));
          return i < 0 ? null : { from: n + i, to: this.pos, text: r.slice(i) };
        }
        get aborted() {
          return this.abortListeners == null;
        }
        addEventListener(e, t, n) {
          e == `abort` &&
            this.abortListeners &&
            (this.abortListeners.push(t), n && n.onDocChange && (this.abortOnDocChange = !0));
        }
      }),
      (A = n.define()),
      typeof navigator == `object` && navigator.platform,
      (j = l.baseTheme({
        ".cm-tooltip.cm-tooltip-autocomplete": {
          "& > ul": {
            fontFamily: `monospace`,
            whiteSpace: `nowrap`,
            overflow: `hidden auto`,
            maxWidth_fallback: `700px`,
            maxWidth: `min(700px, 95vw)`,
            minWidth: `250px`,
            maxHeight: `10em`,
            height: `100%`,
            listStyle: `none`,
            margin: 0,
            padding: 0,
            "& > li, & > completion-section": { padding: `1px 3px`, lineHeight: 1.2 },
            "& > li": { overflowX: `hidden`, textOverflow: `ellipsis`, cursor: `pointer` },
            "& > completion-section": {
              display: `list-item`,
              borderBottom: `1px solid silver`,
              paddingLeft: `0.5em`,
              opacity: 0.7,
            },
          },
        },
        "&light .cm-tooltip-autocomplete ul li[aria-selected]": {
          background: `#17c`,
          color: `white`,
        },
        "&light .cm-tooltip-autocomplete-disabled ul li[aria-selected]": { background: `#777` },
        "&dark .cm-tooltip-autocomplete ul li[aria-selected]": {
          background: `#347`,
          color: `white`,
        },
        "&dark .cm-tooltip-autocomplete-disabled ul li[aria-selected]": { background: `#444` },
        ".cm-completionListIncompleteTop:before, .cm-completionListIncompleteBottom:after": {
          content: `"···"`,
          opacity: 0.5,
          display: `block`,
          textAlign: `center`,
          cursor: `pointer`,
        },
        ".cm-tooltip.cm-completionInfo": {
          position: `absolute`,
          padding: `3px 9px`,
          width: `max-content`,
          maxWidth: `400px`,
          boxSizing: `border-box`,
          whiteSpace: `pre-line`,
        },
        ".cm-completionInfo.cm-completionInfo-left": { right: `100%` },
        ".cm-completionInfo.cm-completionInfo-right": { left: `100%` },
        ".cm-completionInfo.cm-completionInfo-left-narrow": { right: `30px` },
        ".cm-completionInfo.cm-completionInfo-right-narrow": { left: `30px` },
        "&light .cm-snippetField": { backgroundColor: `#00000022` },
        "&dark .cm-snippetField": { backgroundColor: `#ffffff22` },
        ".cm-snippetFieldPosition": {
          verticalAlign: `text-top`,
          width: 0,
          height: `1.15em`,
          display: `inline-block`,
          margin: `0 -0.7px -.7em`,
          borderLeft: `1.4px dotted #888`,
        },
        ".cm-completionMatchedText": { textDecoration: `underline` },
        ".cm-completionDetail": { marginLeft: `0.5em`, fontStyle: `italic` },
        ".cm-completionIcon": {
          fontSize: `90%`,
          width: `.8em`,
          display: `inline-block`,
          textAlign: `center`,
          paddingRight: `.6em`,
          opacity: `0.6`,
          boxSizing: `content-box`,
        },
        ".cm-completionIcon-function, .cm-completionIcon-method": { "&:after": { content: `'ƒ'` } },
        ".cm-completionIcon-class": { "&:after": { content: `'○'` } },
        ".cm-completionIcon-interface": { "&:after": { content: `'◌'` } },
        ".cm-completionIcon-variable": { "&:after": { content: `'𝑥'` } },
        ".cm-completionIcon-constant": { "&:after": { content: `'𝐶'` } },
        ".cm-completionIcon-type": { "&:after": { content: `'𝑡'` } },
        ".cm-completionIcon-enum": { "&:after": { content: `'∪'` } },
        ".cm-completionIcon-property": { "&:after": { content: `'□'` } },
        ".cm-completionIcon-keyword": { "&:after": { content: `'🔑︎'` } },
        ".cm-completionIcon-namespace": { "&:after": { content: `'▢'` } },
        ".cm-completionIcon-text": {
          "&:after": { content: `'abc'`, fontSize: `50%`, verticalAlign: `middle` },
        },
      })),
      (M = class {
        constructor(e, t, n, r) {
          ((this.field = e), (this.line = t), (this.from = n), (this.to = r));
        }
      }),
      (N = class e {
        constructor(e, t, n) {
          ((this.field = e), (this.from = t), (this.to = n));
        }
        map(t) {
          let n = t.mapPos(this.from, -1, _.TrackDel),
            r = t.mapPos(this.to, 1, _.TrackDel);
          return n == null || r == null ? null : new e(this.field, n, r);
        }
      }),
      (P = class e {
        constructor(e, t) {
          ((this.lines = e), (this.fieldPositions = t));
        }
        instantiate(e, t) {
          let n = [],
            r = [t],
            i = e.doc.lineAt(t),
            a = /^\s*/.exec(i.text)[0];
          for (let i of this.lines) {
            if (n.length) {
              let n = a,
                o = /^\t*/.exec(i)[0].length;
              for (let t = 0; t < o; t++) n += e.facet(g);
              (r.push(t + n.length - o), (i = n + i.slice(o)));
            }
            (n.push(i), (t += i.length + 1));
          }
          return {
            text: n,
            ranges: this.fieldPositions.map(
              (e) => new N(e.field, r[e.line] + e.from, r[e.line] + e.to),
            ),
          };
        }
        static parse(t) {
          let n = [],
            r = [],
            i = [],
            a;
          for (let e of t.split(/\r\n?|\n/)) {
            for (; (a = /[#$]\{(?:(\d+)(?::([^{}]*))?|((?:\\[{}]|[^{}])*))\}/.exec(e));) {
              let t = a[1] ? +a[1] : null,
                o = a[2] || a[3] || ``,
                s = -1;
              t === 0 && (t = 1e9);
              let c = o.replace(/\\[{}]/g, (e) => e[1]);
              for (let e = 0; e < n.length; e++)
                (t == null ? c && n[e].name == c : n[e].seq == t) && (s = e);
              if (s < 0) {
                let e = 0;
                for (; e < n.length && (t == null || (n[e].seq != null && n[e].seq < t));) e++;
                (n.splice(e, 0, { seq: t, name: c }), (s = e));
                for (let e of i) e.field >= s && e.field++;
              }
              for (let e of i)
                if (e.line == r.length && e.from > a.index) {
                  let t = a[2] ? 3 + (a[1] || ``).length : 2;
                  ((e.from -= t), (e.to -= t));
                }
              (i.push(new M(s, r.length, a.index, a.index + c.length)),
                (e = e.slice(0, a.index) + o + e.slice(a.index + a[0].length)));
            }
            ((e = e.replace(/\\([{}])/g, (e, t, n) => {
              for (let e of i) e.line == r.length && e.from > n && (e.from--, e.to--);
              return t;
            })),
              r.push(e));
          }
          return new e(r, i);
        }
      }),
      (F = c.widget({
        widget: new (class extends i {
          toDOM() {
            let e = document.createElement(`span`);
            return ((e.className = `cm-snippetFieldPosition`), e);
          }
          ignoreEvent() {
            return !1;
          }
        })(),
      })),
      (I = c.mark({ class: `cm-snippetField` })),
      (L = class e {
        constructor(e, t) {
          ((this.ranges = e),
            (this.active = t),
            (this.deco = c.set(
              e.map((e) => (e.from == e.to ? F : I).range(e.from, e.to)),
              !0,
            )));
        }
        map(t) {
          let n = [];
          for (let e of this.ranges) {
            let r = e.map(t);
            if (!r) return null;
            n.push(r);
          }
          return new e(n, this.active);
        }
        selectionInsideField(e) {
          return e.ranges.every((e) =>
            this.ranges.some((t) => t.field == this.active && t.from <= e.from && t.to >= e.to),
          );
        }
      }),
      (R = p.define({
        map(e, t) {
          return e && e.map(t);
        },
      })),
      (z = p.define()),
      (B = h.define({
        create() {
          return null;
        },
        update(e, t) {
          for (let n of t.effects) {
            if (n.is(R)) return n.value;
            if (n.is(z) && e) return new L(e.ranges, n.value);
          }
          return (
            e && t.docChanged && (e = e.map(t.changes)),
            e && t.selection && !e.selectionInsideField(t.selection) && (e = null),
            e
          );
        },
        provide: (e) => l.decorations.from(e, (e) => (e ? e.deco : c.none)),
      })),
      (V = ({ state: e, dispatch: t }) =>
        e.field(B, !1) ? (t(e.update({ effects: R.of(null) })), !0) : !1),
      (H = D(1)),
      (U = D(-1)),
      (W = [
        { key: `Tab`, run: H, shift: U },
        { key: `Escape`, run: V },
      ]),
      (G = o.define({
        combine(e) {
          return e.length ? e[0] : W;
        },
      })),
      (K = a.highest(d.compute([G], (e) => e.facet(G)))),
      (q = l.domEventHandlers({
        mousedown(e, t) {
          let n = t.state.field(B, !1),
            r;
          if (!n || (r = t.posAtCoords({ x: e.clientX, y: e.clientY })) == null) return !1;
          let i = n.ranges.find((e) => e.from <= r && e.to >= r);
          return !i || i.field == n.active
            ? !1
            : (t.dispatch({
                selection: T(n.ranges, i.field),
                effects: R.of(
                  n.ranges.some((e) => e.field > i.field) ? new L(n.ranges, i.field) : null,
                ),
                scrollIntoView: !0,
              }),
              !0);
        },
      })),
      (J = new (class extends m {})()),
      (J.startSide = 1),
      (J.endSide = -1),
      typeof navigator == `object` && navigator.userAgent);
  });
export { O as a, Y as i, S as n, C as r, k as t };
//# sourceMappingURL=dist-D9GsM5qA.js.map
