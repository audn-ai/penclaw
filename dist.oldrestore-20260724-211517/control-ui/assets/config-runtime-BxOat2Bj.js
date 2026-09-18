import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
function t(e, n, r) {
  let i = e[n];
  if (typeof i == `object` && i)
    if (Array.isArray(i))
      for (let e = 0; e < i.length; e++) {
        let n = String(e),
          a = t(i, n, r);
        a === void 0
          ? delete i[n]
          : Object.defineProperty(i, n, {
              value: a,
              writable: !0,
              enumerable: !0,
              configurable: !0,
            });
      }
    else
      for (let e in i) {
        let n = t(i, e, r);
        n === void 0
          ? delete i[e]
          : Object.defineProperty(i, e, {
              value: n,
              writable: !0,
              enumerable: !0,
              configurable: !0,
            });
      }
  return r.call(e, n, i);
}
function n() {
  for (b = `default`, x = ``, S = !1, C = 1; ;) {
    w = r();
    let e = ue[b]();
    if (e) return e;
  }
}
function r() {
  if (ae[oe]) return String.fromCodePoint(ae.codePointAt(oe));
}
function i() {
  let e = r();
  return (
    e ===
    `
`
      ? (_++, (v = 0))
      : e
        ? (v += e.length)
        : v++,
    e && (oe += e.length),
    e
  );
}
function a(e, t) {
  return { type: e, value: t, line: _, column: v };
}
function o(e) {
  for (let t of e) {
    if (r() !== t) throw f(i());
    i();
  }
}
function s() {
  switch (r()) {
    case `b`:
      return (i(), `\b`);
    case `f`:
      return (i(), `\f`);
    case `n`:
      return (
        i(),
        `
`
      );
    case `r`:
      return (i(), `\r`);
    case `t`:
      return (i(), `	`);
    case `v`:
      return (i(), `\v`);
    case `0`:
      if ((i(), m.isDigit(r()))) throw f(i());
      return `\0`;
    case `x`:
      return (i(), c());
    case `u`:
      return (i(), l());
    case `
`:
    case `\u2028`:
    case `\u2029`:
      return (i(), ``);
    case `\r`:
      return (
        i(),
        r() ===
          `
` && i(),
        ``
      );
    case `1`:
    case `2`:
    case `3`:
    case `4`:
    case `5`:
    case `6`:
    case `7`:
    case `8`:
    case `9`:
      throw f(i());
    case void 0:
      throw f(i());
  }
  return i();
}
function c() {
  let e = ``,
    t = r();
  if (!m.isHexDigit(t) || ((e += i()), (t = r()), !m.isHexDigit(t))) throw f(i());
  return ((e += i()), String.fromCodePoint(parseInt(e, 16)));
}
function l() {
  let e = ``,
    t = 4;
  for (; t-- > 0;) {
    let t = r();
    if (!m.isHexDigit(t)) throw f(i());
    e += i();
  }
  return String.fromCodePoint(parseInt(e, 16));
}
function u() {
  let e;
  switch (y.type) {
    case `punctuator`:
      switch (y.value) {
        case `{`:
          e = {};
          break;
        case `[`:
          e = [];
          break;
      }
      break;
    case `null`:
    case `boolean`:
    case `numeric`:
    case `string`:
      e = y.value;
      break;
  }
  if (ce === void 0) ce = e;
  else {
    let t = g[g.length - 1];
    Array.isArray(t)
      ? t.push(e)
      : Object.defineProperty(t, se, { value: e, writable: !0, enumerable: !0, configurable: !0 });
  }
  if (typeof e == `object` && e)
    (g.push(e), (h = Array.isArray(e) ? `beforeArrayValue` : `beforePropertyName`));
  else {
    let e = g[g.length - 1];
    h = e == null ? `end` : Array.isArray(e) ? `afterArrayValue` : `afterPropertyValue`;
  }
}
function d() {
  g.pop();
  let e = g[g.length - 1];
  h = e == null ? `end` : Array.isArray(e) ? `afterArrayValue` : `afterPropertyValue`;
}
function f(e) {
  return re(
    e === void 0
      ? `JSON5: invalid end of input at ${_}:${v}`
      : `JSON5: invalid character '${ne(e)}' at ${_}:${v}`,
  );
}
function p() {
  return re(`JSON5: invalid end of input at ${_}:${v}`);
}
function ee() {
  return ((v -= 5), re(`JSON5: invalid identifier character at ${_}:${v}`));
}
function te(e) {
  console.warn(`JSON5: '${ne(e)}' in strings is not valid ECMAScript; consider escaping`);
}
function ne(e) {
  let t = {
    "'": `\\'`,
    '"': `\\"`,
    "\\": `\\\\`,
    "\b": `\\b`,
    "\f": `\\f`,
    "\n": `\\n`,
    "\r": `\\r`,
    "	": `\\t`,
    "\v": `\\v`,
    "\0": `\\0`,
    "\u2028": `\\u2028`,
    "\u2029": `\\u2029`,
  };
  if (t[e]) return t[e];
  if (e < ` `) {
    let t = e.charCodeAt(0).toString(16);
    return `\\x` + (`00` + t).substring(t.length);
  }
  return e;
}
function re(e) {
  let t = SyntaxError(e);
  return ((t.lineNumber = _), (t.columnNumber = v), t);
}
var ie,
  m,
  ae,
  h,
  g,
  oe,
  _,
  v,
  y,
  se,
  ce,
  le,
  b,
  x,
  S,
  C,
  w,
  ue,
  de,
  fe,
  pe = e(() => {
    ((ie = {
      Space_Separator: /[\u1680\u2000-\u200A\u202F\u205F\u3000]/,
      ID_Start:
        /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE83\uDE86-\uDE89\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]/,
      ID_Continue:
        /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09FC\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D00-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF9\u1D00-\u1DF9\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDE00-\uDE3E\uDE47\uDE50-\uDE83\uDE86-\uDE99\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/,
    }),
      (m = {
        isSpaceSeparator(e) {
          return typeof e == `string` && ie.Space_Separator.test(e);
        },
        isIdStartChar(e) {
          return (
            typeof e == `string` &&
            ((e >= `a` && e <= `z`) ||
              (e >= `A` && e <= `Z`) ||
              e === `$` ||
              e === `_` ||
              ie.ID_Start.test(e))
          );
        },
        isIdContinueChar(e) {
          return (
            typeof e == `string` &&
            ((e >= `a` && e <= `z`) ||
              (e >= `A` && e <= `Z`) ||
              (e >= `0` && e <= `9`) ||
              e === `$` ||
              e === `_` ||
              e === `‌` ||
              e === `‍` ||
              ie.ID_Continue.test(e))
          );
        },
        isDigit(e) {
          return typeof e == `string` && /[0-9]/.test(e);
        },
        isHexDigit(e) {
          return typeof e == `string` && /[0-9A-Fa-f]/.test(e);
        },
      }),
      (le = function (e, r) {
        ((ae = String(e)),
          (h = `start`),
          (g = []),
          (oe = 0),
          (_ = 1),
          (v = 0),
          (y = void 0),
          (se = void 0),
          (ce = void 0));
        do ((y = n()), de[h]());
        while (y.type !== `eof`);
        return typeof r == `function` ? t({ "": ce }, ``, r) : ce;
      }),
      (ue = {
        default() {
          switch (w) {
            case `	`:
            case `\v`:
            case `\f`:
            case ` `:
            case `\xA0`:
            case `﻿`:
            case `
`:
            case `\r`:
            case `\u2028`:
            case `\u2029`:
              i();
              return;
            case `/`:
              (i(), (b = `comment`));
              return;
            case void 0:
              return (i(), a(`eof`));
          }
          if (m.isSpaceSeparator(w)) {
            i();
            return;
          }
          return ue[h]();
        },
        comment() {
          switch (w) {
            case `*`:
              (i(), (b = `multiLineComment`));
              return;
            case `/`:
              (i(), (b = `singleLineComment`));
              return;
          }
          throw f(i());
        },
        multiLineComment() {
          switch (w) {
            case `*`:
              (i(), (b = `multiLineCommentAsterisk`));
              return;
            case void 0:
              throw f(i());
          }
          i();
        },
        multiLineCommentAsterisk() {
          switch (w) {
            case `*`:
              i();
              return;
            case `/`:
              (i(), (b = `default`));
              return;
            case void 0:
              throw f(i());
          }
          (i(), (b = `multiLineComment`));
        },
        singleLineComment() {
          switch (w) {
            case `
`:
            case `\r`:
            case `\u2028`:
            case `\u2029`:
              (i(), (b = `default`));
              return;
            case void 0:
              return (i(), a(`eof`));
          }
          i();
        },
        value() {
          switch (w) {
            case `{`:
            case `[`:
              return a(`punctuator`, i());
            case `n`:
              return (i(), o(`ull`), a(`null`, null));
            case `t`:
              return (i(), o(`rue`), a(`boolean`, !0));
            case `f`:
              return (i(), o(`alse`), a(`boolean`, !1));
            case `-`:
            case `+`:
              (i() === `-` && (C = -1), (b = `sign`));
              return;
            case `.`:
              ((x = i()), (b = `decimalPointLeading`));
              return;
            case `0`:
              ((x = i()), (b = `zero`));
              return;
            case `1`:
            case `2`:
            case `3`:
            case `4`:
            case `5`:
            case `6`:
            case `7`:
            case `8`:
            case `9`:
              ((x = i()), (b = `decimalInteger`));
              return;
            case `I`:
              return (i(), o(`nfinity`), a(`numeric`, 1 / 0));
            case `N`:
              return (i(), o(`aN`), a(`numeric`, NaN));
            case `"`:
            case `'`:
              ((S = i() === `"`), (x = ``), (b = `string`));
              return;
          }
          throw f(i());
        },
        identifierNameStartEscape() {
          if (w !== `u`) throw f(i());
          i();
          let e = l();
          switch (e) {
            case `$`:
            case `_`:
              break;
            default:
              if (!m.isIdStartChar(e)) throw ee();
              break;
          }
          ((x += e), (b = `identifierName`));
        },
        identifierName() {
          switch (w) {
            case `$`:
            case `_`:
            case `‌`:
            case `‍`:
              x += i();
              return;
            case `\\`:
              (i(), (b = `identifierNameEscape`));
              return;
          }
          if (m.isIdContinueChar(w)) {
            x += i();
            return;
          }
          return a(`identifier`, x);
        },
        identifierNameEscape() {
          if (w !== `u`) throw f(i());
          i();
          let e = l();
          switch (e) {
            case `$`:
            case `_`:
            case `‌`:
            case `‍`:
              break;
            default:
              if (!m.isIdContinueChar(e)) throw ee();
              break;
          }
          ((x += e), (b = `identifierName`));
        },
        sign() {
          switch (w) {
            case `.`:
              ((x = i()), (b = `decimalPointLeading`));
              return;
            case `0`:
              ((x = i()), (b = `zero`));
              return;
            case `1`:
            case `2`:
            case `3`:
            case `4`:
            case `5`:
            case `6`:
            case `7`:
            case `8`:
            case `9`:
              ((x = i()), (b = `decimalInteger`));
              return;
            case `I`:
              return (i(), o(`nfinity`), a(`numeric`, C * (1 / 0)));
            case `N`:
              return (i(), o(`aN`), a(`numeric`, NaN));
          }
          throw f(i());
        },
        zero() {
          switch (w) {
            case `.`:
              ((x += i()), (b = `decimalPoint`));
              return;
            case `e`:
            case `E`:
              ((x += i()), (b = `decimalExponent`));
              return;
            case `x`:
            case `X`:
              ((x += i()), (b = `hexadecimal`));
              return;
          }
          return a(`numeric`, C * 0);
        },
        decimalInteger() {
          switch (w) {
            case `.`:
              ((x += i()), (b = `decimalPoint`));
              return;
            case `e`:
            case `E`:
              ((x += i()), (b = `decimalExponent`));
              return;
          }
          if (m.isDigit(w)) {
            x += i();
            return;
          }
          return a(`numeric`, C * Number(x));
        },
        decimalPointLeading() {
          if (m.isDigit(w)) {
            ((x += i()), (b = `decimalFraction`));
            return;
          }
          throw f(i());
        },
        decimalPoint() {
          switch (w) {
            case `e`:
            case `E`:
              ((x += i()), (b = `decimalExponent`));
              return;
          }
          if (m.isDigit(w)) {
            ((x += i()), (b = `decimalFraction`));
            return;
          }
          return a(`numeric`, C * Number(x));
        },
        decimalFraction() {
          switch (w) {
            case `e`:
            case `E`:
              ((x += i()), (b = `decimalExponent`));
              return;
          }
          if (m.isDigit(w)) {
            x += i();
            return;
          }
          return a(`numeric`, C * Number(x));
        },
        decimalExponent() {
          switch (w) {
            case `+`:
            case `-`:
              ((x += i()), (b = `decimalExponentSign`));
              return;
          }
          if (m.isDigit(w)) {
            ((x += i()), (b = `decimalExponentInteger`));
            return;
          }
          throw f(i());
        },
        decimalExponentSign() {
          if (m.isDigit(w)) {
            ((x += i()), (b = `decimalExponentInteger`));
            return;
          }
          throw f(i());
        },
        decimalExponentInteger() {
          if (m.isDigit(w)) {
            x += i();
            return;
          }
          return a(`numeric`, C * Number(x));
        },
        hexadecimal() {
          if (m.isHexDigit(w)) {
            ((x += i()), (b = `hexadecimalInteger`));
            return;
          }
          throw f(i());
        },
        hexadecimalInteger() {
          if (m.isHexDigit(w)) {
            x += i();
            return;
          }
          return a(`numeric`, C * Number(x));
        },
        string() {
          switch (w) {
            case `\\`:
              (i(), (x += s()));
              return;
            case `"`:
              if (S) return (i(), a(`string`, x));
              x += i();
              return;
            case `'`:
              if (!S) return (i(), a(`string`, x));
              x += i();
              return;
            case `
`:
            case `\r`:
              throw f(i());
            case `\u2028`:
            case `\u2029`:
              te(w);
              break;
            case void 0:
              throw f(i());
          }
          x += i();
        },
        start() {
          switch (w) {
            case `{`:
            case `[`:
              return a(`punctuator`, i());
          }
          b = `value`;
        },
        beforePropertyName() {
          switch (w) {
            case `$`:
            case `_`:
              ((x = i()), (b = `identifierName`));
              return;
            case `\\`:
              (i(), (b = `identifierNameStartEscape`));
              return;
            case `}`:
              return a(`punctuator`, i());
            case `"`:
            case `'`:
              ((S = i() === `"`), (b = `string`));
              return;
          }
          if (m.isIdStartChar(w)) {
            ((x += i()), (b = `identifierName`));
            return;
          }
          throw f(i());
        },
        afterPropertyName() {
          if (w === `:`) return a(`punctuator`, i());
          throw f(i());
        },
        beforePropertyValue() {
          b = `value`;
        },
        afterPropertyValue() {
          switch (w) {
            case `,`:
            case `}`:
              return a(`punctuator`, i());
          }
          throw f(i());
        },
        beforeArrayValue() {
          if (w === `]`) return a(`punctuator`, i());
          b = `value`;
        },
        afterArrayValue() {
          switch (w) {
            case `,`:
            case `]`:
              return a(`punctuator`, i());
          }
          throw f(i());
        },
        end() {
          throw f(i());
        },
      }),
      (de = {
        start() {
          if (y.type === `eof`) throw p();
          u();
        },
        beforePropertyName() {
          switch (y.type) {
            case `identifier`:
            case `string`:
              ((se = y.value), (h = `afterPropertyName`));
              return;
            case `punctuator`:
              d();
              return;
            case `eof`:
              throw p();
          }
        },
        afterPropertyName() {
          if (y.type === `eof`) throw p();
          h = `beforePropertyValue`;
        },
        beforePropertyValue() {
          if (y.type === `eof`) throw p();
          u();
        },
        beforeArrayValue() {
          if (y.type === `eof`) throw p();
          if (y.type === `punctuator` && y.value === `]`) {
            d();
            return;
          }
          u();
        },
        afterPropertyValue() {
          if (y.type === `eof`) throw p();
          switch (y.value) {
            case `,`:
              h = `beforePropertyName`;
              return;
            case `}`:
              d();
          }
        },
        afterArrayValue() {
          if (y.type === `eof`) throw p();
          switch (y.value) {
            case `,`:
              h = `beforeArrayValue`;
              return;
            case `]`:
              d();
          }
        },
        end() {},
      }),
      (fe = {
        parse: le,
        stringify: function (e, t, n) {
          let r = [],
            i = ``,
            a,
            o,
            s = ``,
            c;
          if (
            (typeof t == `object` &&
              t &&
              !Array.isArray(t) &&
              ((n = t.space), (c = t.quote), (t = t.replacer)),
            typeof t == `function`)
          )
            o = t;
          else if (Array.isArray(t)) {
            a = [];
            for (let e of t) {
              let t;
              (typeof e == `string`
                ? (t = e)
                : (typeof e == `number` || e instanceof String || e instanceof Number) &&
                  (t = String(e)),
                t !== void 0 && a.indexOf(t) < 0 && a.push(t));
            }
          }
          return (
            n instanceof Number ? (n = Number(n)) : n instanceof String && (n = String(n)),
            typeof n == `number`
              ? n > 0 && ((n = Math.min(10, Math.floor(n))), (s = `          `.substr(0, n)))
              : typeof n == `string` && (s = n.substr(0, 10)),
            l(``, { "": e })
          );
          function l(e, t) {
            let n = t[e];
            switch (
              (n != null &&
                (typeof n.toJSON5 == `function`
                  ? (n = n.toJSON5(e))
                  : typeof n.toJSON == `function` && (n = n.toJSON(e))),
              o && (n = o.call(t, e, n)),
              n instanceof Number
                ? (n = Number(n))
                : n instanceof String
                  ? (n = String(n))
                  : n instanceof Boolean && (n = n.valueOf()),
              n)
            ) {
              case null:
                return `null`;
              case !0:
                return `true`;
              case !1:
                return `false`;
            }
            if (typeof n == `string`) return u(n, !1);
            if (typeof n == `number`) return String(n);
            if (typeof n == `object`) return Array.isArray(n) ? p(n) : d(n);
          }
          function u(e) {
            let t = { "'": 0.1, '"': 0.2 },
              n = {
                "'": `\\'`,
                '"': `\\"`,
                "\\": `\\\\`,
                "\b": `\\b`,
                "\f": `\\f`,
                "\n": `\\n`,
                "\r": `\\r`,
                "	": `\\t`,
                "\v": `\\v`,
                "\0": `\\0`,
                "\u2028": `\\u2028`,
                "\u2029": `\\u2029`,
              },
              r = ``;
            for (let i = 0; i < e.length; i++) {
              let a = e[i];
              switch (a) {
                case `'`:
                case `"`:
                  (t[a]++, (r += a));
                  continue;
                case `\0`:
                  if (m.isDigit(e[i + 1])) {
                    r += `\\x00`;
                    continue;
                  }
              }
              if (n[a]) {
                r += n[a];
                continue;
              }
              if (a < ` `) {
                let e = a.charCodeAt(0).toString(16);
                r += `\\x` + (`00` + e).substring(e.length);
                continue;
              }
              r += a;
            }
            let i = c || Object.keys(t).reduce((e, n) => (t[e] < t[n] ? e : n));
            return ((r = r.replace(new RegExp(i, `g`), n[i])), i + r + i);
          }
          function d(e) {
            if (r.indexOf(e) >= 0) throw TypeError(`Converting circular structure to JSON5`);
            r.push(e);
            let t = i;
            i += s;
            let n = a || Object.keys(e),
              o = [];
            for (let t of n) {
              let n = l(t, e);
              if (n !== void 0) {
                let e = f(t) + `:`;
                (s !== `` && (e += ` `), (e += n), o.push(e));
              }
            }
            let c;
            if (o.length === 0) c = `{}`;
            else {
              let e;
              if (s === ``) ((e = o.join(`,`)), (c = `{` + e + `}`));
              else {
                let n =
                  `,
` + i;
                ((e = o.join(n)),
                  (c =
                    `{
` +
                    i +
                    e +
                    `,
` +
                    t +
                    `}`));
              }
            }
            return (r.pop(), (i = t), c);
          }
          function f(e) {
            if (e.length === 0) return u(e, !0);
            let t = String.fromCodePoint(e.codePointAt(0));
            if (!m.isIdStartChar(t)) return u(e, !0);
            for (let n = t.length; n < e.length; n++)
              if (!m.isIdContinueChar(String.fromCodePoint(e.codePointAt(n)))) return u(e, !0);
            return e;
          }
          function p(e) {
            if (r.indexOf(e) >= 0) throw TypeError(`Converting circular structure to JSON5`);
            r.push(e);
            let t = i;
            i += s;
            let n = [];
            for (let t = 0; t < e.length; t++) {
              let r = l(String(t), e);
              n.push(r === void 0 ? `null` : r);
            }
            let a;
            if (n.length === 0) a = `[]`;
            else if (s === ``) a = `[` + n.join(`,`) + `]`;
            else {
              let e =
                  `,
` + i,
                r = n.join(e);
              a =
                `[
` +
                i +
                r +
                `,
` +
                t +
                `]`;
            }
            return (r.pop(), (i = t), a);
          }
        },
      }));
  });
function T(e, t, n) {
  function r(n, r) {
    if (
      (n._zod ||
        Object.defineProperty(n, "_zod", {
          value: { def: r, constr: o, traits: new Set() },
          enumerable: !1,
        }),
      n._zod.traits.has(e))
    )
      return;
    (n._zod.traits.add(e), t(n, r));
    let i = o.prototype,
      a = Object.keys(i);
    for (let e = 0; e < a.length; e++) {
      let t = a[e];
      t in n || (n[t] = i[t].bind(n));
    }
  }
  let i = n?.Parent ?? Object;
  class a extends i {}
  Object.defineProperty(a, "name", { value: e });
  function o(e) {
    var t;
    let i = n?.Parent ? new a() : this;
    (r(i, e), (t = i._zod).deferred ?? (t.deferred = []));
    for (let e of i._zod.deferred) e();
    return i;
  }
  return (
    Object.defineProperty(o, "init", { value: r }),
    Object.defineProperty(o, Symbol.hasInstance, {
      value: (t) => (n?.Parent && t instanceof n.Parent ? !0 : t?._zod?.traits?.has(e)),
    }),
    Object.defineProperty(o, "name", { value: e }),
    o
  );
}
function E(e) {
  return (e && Object.assign(ge, e), ge);
}
var me,
  D,
  he,
  ge,
  O = e(() => {
    ((D = class extends Error {
      constructor() {
        super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
      }
    }),
      (he = class extends Error {
        constructor(e) {
          (super(`Encountered unidirectional transform during encode: ${e}`),
            (this.name = `ZodEncodeError`));
        }
      }),
      (me = globalThis).__zod_globalConfig ?? (me.__zod_globalConfig = {}),
      (ge = globalThis.__zod_globalConfig));
  });
function _e(e) {
  let t = Object.values(e).filter((e) => typeof e == `number`);
  return Object.entries(e)
    .filter(([e, n]) => t.indexOf(+e) === -1)
    .map(([e, t]) => t);
}
function ve(e, t = `|`) {
  return e.map((e) => Oe(e)).join(t);
}
function ye(e, t) {
  return typeof t == `bigint` ? t.toString() : t;
}
function be(e) {
  return {
    get value() {
      {
        let t = e();
        return (Object.defineProperty(this, "value", { value: t }), t);
      }
      throw Error(`cached value already set`);
    },
  };
}
function xe(e) {
  return e == null;
}
function Se(e) {
  let t = +!!e.startsWith(`^`),
    n = e.endsWith(`$`) ? e.length - 1 : e.length;
  return e.slice(t, n);
}
function Ce(e, t) {
  let n = e / t,
    r = Math.round(n),
    i = 2 ** -52 * Math.max(Math.abs(n), 1);
  return Math.abs(n - r) < i ? 0 : n - r;
}
function k(e, t, n) {
  let r;
  Object.defineProperty(e, t, {
    get() {
      if (r !== Ve) return (r === void 0 && ((r = Ve), (r = n())), r);
    },
    set(n) {
      Object.defineProperty(e, t, { value: n });
    },
    configurable: !0,
  });
}
function A(e, t, n) {
  Object.defineProperty(e, t, { value: n, writable: !0, enumerable: !0, configurable: !0 });
}
function j(...e) {
  let t = {};
  for (let n of e) {
    let e = Object.getOwnPropertyDescriptors(n);
    Object.assign(t, e);
  }
  return Object.defineProperties({}, t);
}
function we(e) {
  return JSON.stringify(e);
}
function Te(e) {
  return e
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, ``)
    .replace(/[\s_-]+/g, `-`)
    .replace(/^-+|-+$/g, ``);
}
function Ee(e) {
  return typeof e == `object` && !!e && !Array.isArray(e);
}
function M(e) {
  if (Ee(e) === !1) return !1;
  let t = e.constructor;
  if (t === void 0 || typeof t != `function`) return !0;
  let n = t.prototype;
  return !(Ee(n) === !1 || Object.prototype.hasOwnProperty.call(n, `isPrototypeOf`) === !1);
}
function De(e) {
  return M(e)
    ? { ...e }
    : Array.isArray(e)
      ? [...e]
      : e instanceof Map
        ? new Map(e)
        : e instanceof Set
          ? new Set(e)
          : e;
}
function N(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
}
function P(e, t, n) {
  let r = new e._zod.constr(t ?? e._zod.def);
  return ((!t || n?.parent) && (r._zod.parent = e), r);
}
function F(e) {
  let t = e;
  if (!t) return {};
  if (typeof t == `string`) return { error: () => t };
  if (t?.message !== void 0) {
    if (t?.error !== void 0) throw Error("Cannot specify both `message` and `error` params");
    t.error = t.message;
  }
  return (delete t.message, typeof t.error == `string` ? { ...t, error: () => t.error } : t);
}
function Oe(e) {
  return typeof e == `bigint` ? e.toString() + `n` : typeof e == `string` ? `"${e}"` : `${e}`;
}
function ke(e) {
  return Object.keys(e).filter(
    (t) => e[t]._zod.optin === `optional` && e[t]._zod.optout === `optional`,
  );
}
function Ae(e, t) {
  let n = e._zod.def,
    r = n.checks;
  if (r && r.length > 0)
    throw Error(`.pick() cannot be used on object schemas containing refinements`);
  return P(
    e,
    j(e._zod.def, {
      get shape() {
        let e = {};
        for (let r in t) {
          if (!(r in n.shape)) throw Error(`Unrecognized key: "${r}"`);
          t[r] && (e[r] = n.shape[r]);
        }
        return (A(this, `shape`, e), e);
      },
      checks: [],
    }),
  );
}
function je(e, t) {
  let n = e._zod.def,
    r = n.checks;
  if (r && r.length > 0)
    throw Error(`.omit() cannot be used on object schemas containing refinements`);
  return P(
    e,
    j(e._zod.def, {
      get shape() {
        let r = { ...e._zod.def.shape };
        for (let e in t) {
          if (!(e in n.shape)) throw Error(`Unrecognized key: "${e}"`);
          t[e] && delete r[e];
        }
        return (A(this, `shape`, r), r);
      },
      checks: [],
    }),
  );
}
function Me(e, t) {
  if (!M(t)) throw Error(`Invalid input to extend: expected a plain object`);
  let n = e._zod.def.checks;
  if (n && n.length > 0) {
    let n = e._zod.def.shape;
    for (let e in t)
      if (Object.getOwnPropertyDescriptor(n, e) !== void 0)
        throw Error(
          "Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.",
        );
  }
  return P(
    e,
    j(e._zod.def, {
      get shape() {
        let n = { ...e._zod.def.shape, ...t };
        return (A(this, `shape`, n), n);
      },
    }),
  );
}
function Ne(e, t) {
  if (!M(t)) throw Error(`Invalid input to safeExtend: expected a plain object`);
  return P(
    e,
    j(e._zod.def, {
      get shape() {
        let n = { ...e._zod.def.shape, ...t };
        return (A(this, `shape`, n), n);
      },
    }),
  );
}
function Pe(e, t) {
  if (e._zod.def.checks?.length)
    throw Error(
      `.merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.`,
    );
  return P(
    e,
    j(e._zod.def, {
      get shape() {
        let n = { ...e._zod.def.shape, ...t._zod.def.shape };
        return (A(this, `shape`, n), n);
      },
      get catchall() {
        return t._zod.def.catchall;
      },
      checks: t._zod.def.checks ?? [],
    }),
  );
}
function Fe(e, t, n) {
  let r = t._zod.def.checks;
  if (r && r.length > 0)
    throw Error(`.partial() cannot be used on object schemas containing refinements`);
  return P(
    t,
    j(t._zod.def, {
      get shape() {
        let r = t._zod.def.shape,
          i = { ...r };
        if (n)
          for (let t in n) {
            if (!(t in r)) throw Error(`Unrecognized key: "${t}"`);
            n[t] && (i[t] = e ? new e({ type: `optional`, innerType: r[t] }) : r[t]);
          }
        else for (let t in r) i[t] = e ? new e({ type: `optional`, innerType: r[t] }) : r[t];
        return (A(this, `shape`, i), i);
      },
      checks: [],
    }),
  );
}
function Ie(e, t, n) {
  return P(
    t,
    j(t._zod.def, {
      get shape() {
        let r = t._zod.def.shape,
          i = { ...r };
        if (n)
          for (let t in n) {
            if (!(t in i)) throw Error(`Unrecognized key: "${t}"`);
            n[t] && (i[t] = new e({ type: `nonoptional`, innerType: r[t] }));
          }
        else for (let t in r) i[t] = new e({ type: `nonoptional`, innerType: r[t] });
        return (A(this, `shape`, i), i);
      },
    }),
  );
}
function I(e, t = 0) {
  if (e.aborted === !0) return !0;
  for (let n = t; n < e.issues.length; n++) if (e.issues[n]?.continue !== !0) return !0;
  return !1;
}
function Le(e, t = 0) {
  if (e.aborted === !0) return !0;
  for (let n = t; n < e.issues.length; n++) if (e.issues[n]?.continue === !1) return !0;
  return !1;
}
function L(e, t) {
  return t.map((t) => {
    var n;
    return ((n = t).path ?? (n.path = []), t.path.unshift(e), t);
  });
}
function Re(e) {
  return typeof e == `string` ? e : e?.message;
}
function R(e, t, n) {
  let r = e.message
      ? e.message
      : (Re(e.inst?._zod.def?.error?.(e)) ??
        Re(t?.error?.(e)) ??
        Re(n.customError?.(e)) ??
        Re(n.localeError?.(e)) ??
        `Invalid input`),
    { inst: i, continue: a, input: o, ...s } = e;
  return ((s.path ??= []), (s.message = r), t?.reportInput && (s.input = o), s);
}
function ze(e) {
  return Array.isArray(e) ? `array` : typeof e == `string` ? `string` : `unknown`;
}
function Be(e) {
  let t = typeof e;
  switch (t) {
    case `number`:
      return Number.isNaN(e) ? `nan` : `number`;
    case `object`: {
      if (e === null) return `null`;
      if (Array.isArray(e)) return `array`;
      let t = e;
      if (t && Object.getPrototypeOf(t) !== Object.prototype && `constructor` in t && t.constructor)
        return t.constructor.name;
    }
  }
  return t;
}
function z(...e) {
  let [t, n, r] = e;
  return typeof t == `string` ? { message: t, code: `custom`, input: n, inst: r } : { ...t };
}
var Ve,
  He,
  Ue,
  We,
  Ge,
  B = e(() => {
    (O(),
      (Ve = Symbol(`evaluating`)),
      (He = `captureStackTrace` in Error ? Error.captureStackTrace : (...e) => {}),
      (Ue = be(() => {
        if (ge.jitless || (typeof navigator < `u` && navigator?.userAgent?.includes(`Cloudflare`)))
          return !1;
        try {
          return (Function(``), !0);
        } catch {
          return !1;
        }
      })),
      (We = new Set([`string`, `number`, `symbol`])),
      (Ge = {
        safeint: [-(2 ** 53 - 1), 2 ** 53 - 1],
        int32: [-2147483648, 2147483647],
        uint32: [0, 4294967295],
        float32: [-34028234663852886e22, 34028234663852886e22],
        float64: [-Number.MAX_VALUE, Number.MAX_VALUE],
      }));
  });
function Ke(e, t = (e) => e.message) {
  let n = {},
    r = [];
  for (let i of e.issues)
    i.path.length > 0
      ? ((n[i.path[0]] = n[i.path[0]] || []), n[i.path[0]].push(t(i)))
      : r.push(t(i));
  return { formErrors: r, fieldErrors: n };
}
function qe(e, t = (e) => e.message) {
  let n = { _errors: [] },
    r = (e, i = []) => {
      for (let a of e.issues)
        if (a.code === `invalid_union` && a.errors.length)
          a.errors.map((e) => r({ issues: e }, [...i, ...a.path]));
        else if (a.code === `invalid_key`) r({ issues: a.issues }, [...i, ...a.path]);
        else if (a.code === `invalid_element`) r({ issues: a.issues }, [...i, ...a.path]);
        else {
          let e = [...i, ...a.path];
          if (e.length === 0) n._errors.push(t(a));
          else {
            let r = n,
              i = 0;
            for (; i < e.length;) {
              let n = e[i];
              (i === e.length - 1
                ? ((r[n] = r[n] || { _errors: [] }), r[n]._errors.push(t(a)))
                : (r[n] = r[n] || { _errors: [] }),
                (r = r[n]),
                i++);
            }
          }
        }
    };
  return (r(e), n);
}
var Je,
  Ye,
  Xe,
  Ze = e(() => {
    (O(),
      B(),
      (Je = (e, t) => {
        ((e.name = `$ZodError`),
          Object.defineProperty(e, "_zod", { value: e._zod, enumerable: !1 }),
          Object.defineProperty(e, "issues", { value: t, enumerable: !1 }),
          (e.message = JSON.stringify(t, ye, 2)),
          Object.defineProperty(e, "toString", { value: () => e.message, enumerable: !1 }));
      }),
      (Ye = T(`$ZodError`, Je)),
      (Xe = T(`$ZodError`, Je, { Parent: Error })));
  }),
  Qe,
  $e,
  V,
  et,
  H,
  tt,
  nt,
  rt,
  it,
  at,
  ot,
  st,
  ct,
  lt,
  ut = e(() => {
    (O(),
      Ze(),
      B(),
      (Qe = (e) => (t, n, r, i) => {
        let a = r ? { ...r, async: !1 } : { async: !1 },
          o = t._zod.run({ value: n, issues: [] }, a);
        if (o instanceof Promise) throw new D();
        if (o.issues.length) {
          let t = new (i?.Err ?? e)(o.issues.map((e) => R(e, a, E())));
          throw (He(t, i?.callee), t);
        }
        return o.value;
      }),
      ($e = (e) => async (t, n, r, i) => {
        let a = r ? { ...r, async: !0 } : { async: !0 },
          o = t._zod.run({ value: n, issues: [] }, a);
        if ((o instanceof Promise && (o = await o), o.issues.length)) {
          let t = new (i?.Err ?? e)(o.issues.map((e) => R(e, a, E())));
          throw (He(t, i?.callee), t);
        }
        return o.value;
      }),
      (V = (e) => (t, n, r) => {
        let i = r ? { ...r, async: !1 } : { async: !1 },
          a = t._zod.run({ value: n, issues: [] }, i);
        if (a instanceof Promise) throw new D();
        return a.issues.length
          ? { success: !1, error: new (e ?? Ye)(a.issues.map((e) => R(e, i, E()))) }
          : { success: !0, data: a.value };
      }),
      (et = V(Xe)),
      (H = (e) => async (t, n, r) => {
        let i = r ? { ...r, async: !0 } : { async: !0 },
          a = t._zod.run({ value: n, issues: [] }, i);
        return (
          a instanceof Promise && (a = await a),
          a.issues.length
            ? { success: !1, error: new e(a.issues.map((e) => R(e, i, E()))) }
            : { success: !0, data: a.value }
        );
      }),
      (tt = H(Xe)),
      (nt = (e) => (t, n, r) => {
        let i = r ? { ...r, direction: `backward` } : { direction: `backward` };
        return Qe(e)(t, n, i);
      }),
      (rt = (e) => (t, n, r) => Qe(e)(t, n, r)),
      (it = (e) => async (t, n, r) => {
        let i = r ? { ...r, direction: `backward` } : { direction: `backward` };
        return $e(e)(t, n, i);
      }),
      (at = (e) => async (t, n, r) => $e(e)(t, n, r)),
      (ot = (e) => (t, n, r) => {
        let i = r ? { ...r, direction: `backward` } : { direction: `backward` };
        return V(e)(t, n, i);
      }),
      (st = (e) => (t, n, r) => V(e)(t, n, r)),
      (ct = (e) => async (t, n, r) => {
        let i = r ? { ...r, direction: `backward` } : { direction: `backward` };
        return H(e)(t, n, i);
      }),
      (lt = (e) => async (t, n, r) => H(e)(t, n, r)));
  });
function dt() {
  return new RegExp(Tt, `u`);
}
function ft(e) {
  let t = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
  return typeof e.precision == `number`
    ? e.precision === -1
      ? `${t}`
      : e.precision === 0
        ? `${t}:[0-5]\\d`
        : `${t}:[0-5]\\d\\.\\d{${e.precision}}`
    : `${t}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function pt(e) {
  return RegExp(`^${ft(e)}$`);
}
function mt(e) {
  let t = ft({ precision: e.precision }),
    n = [`Z`];
  (e.local && n.push(``), e.offset && n.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`));
  let r = `${t}(?:${n.join(`|`)})`;
  return RegExp(`^${Pt}T(?:${r})$`);
}
var ht,
  gt,
  _t,
  vt,
  yt,
  bt,
  xt,
  St,
  Ct,
  wt,
  Tt,
  Et,
  Dt,
  Ot,
  kt,
  At,
  jt,
  Mt,
  Nt,
  Pt,
  Ft,
  It,
  Lt,
  Rt,
  zt,
  Bt,
  Vt,
  Ht,
  Ut,
  Wt = e(() => {
    ((ht = /^[cC][0-9a-z]{6,}$/),
      (gt = /^[0-9a-z]+$/),
      (_t = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/),
      (vt = /^[0-9a-vA-V]{20}$/),
      (yt = /^[A-Za-z0-9]{27}$/),
      (bt = /^[a-zA-Z0-9_-]{21}$/),
      (xt =
        /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/),
      (St = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/),
      (Ct = (e) =>
        e
          ? RegExp(
              `^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`,
            )
          : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/),
      (wt =
        /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/),
      (Tt = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`),
      (Et =
        /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/),
      (Dt =
        /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/),
      (Ot =
        /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/),
      (kt =
        /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/),
      (At = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/),
      (jt = /^[A-Za-z0-9_-]*$/),
      (Mt = /^https?$/),
      (Nt = /^\+[1-9]\d{6,14}$/),
      (Pt = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`),
      (Ft = RegExp(`^${Pt}$`)),
      (It = (e) => {
        let t = e ? `[\\s\\S]{${e?.minimum ?? 0},${e?.maximum ?? ``}}` : `[\\s\\S]*`;
        return RegExp(`^${t}$`);
      }),
      (Lt = /^-?\d+$/),
      (Rt = /^-?\d+(?:\.\d+)?$/),
      (zt = /^(?:true|false)$/i),
      (Bt = /^null$/i),
      (Vt = /^undefined$/i),
      (Ht = /^[^A-Z]*$/),
      (Ut = /^[^a-z]*$/));
  }),
  U,
  Gt,
  Kt,
  qt,
  Jt,
  Yt,
  Xt,
  Zt,
  Qt,
  $t,
  en,
  tn,
  nn,
  rn,
  an,
  on,
  sn,
  cn = e(() => {
    (O(),
      Wt(),
      B(),
      (U = T(`$ZodCheck`, (e, t) => {
        var n;
        ((e._zod ??= {}), (e._zod.def = t), (n = e._zod).onattach ?? (n.onattach = []));
      })),
      (Gt = { number: `number`, bigint: `bigint`, object: `date` }),
      (Kt = T(`$ZodCheckLessThan`, (e, t) => {
        U.init(e, t);
        let n = Gt[typeof t.value];
        (e._zod.onattach.push((e) => {
          let n = e._zod.bag,
            r = (t.inclusive ? n.maximum : n.exclusiveMaximum) ?? 1 / 0;
          t.value < r && (t.inclusive ? (n.maximum = t.value) : (n.exclusiveMaximum = t.value));
        }),
          (e._zod.check = (r) => {
            (t.inclusive ? r.value <= t.value : r.value < t.value) ||
              r.issues.push({
                origin: n,
                code: `too_big`,
                maximum: typeof t.value == `object` ? t.value.getTime() : t.value,
                input: r.value,
                inclusive: t.inclusive,
                inst: e,
                continue: !t.abort,
              });
          }));
      })),
      (qt = T(`$ZodCheckGreaterThan`, (e, t) => {
        U.init(e, t);
        let n = Gt[typeof t.value];
        (e._zod.onattach.push((e) => {
          let n = e._zod.bag,
            r = (t.inclusive ? n.minimum : n.exclusiveMinimum) ?? -1 / 0;
          t.value > r && (t.inclusive ? (n.minimum = t.value) : (n.exclusiveMinimum = t.value));
        }),
          (e._zod.check = (r) => {
            (t.inclusive ? r.value >= t.value : r.value > t.value) ||
              r.issues.push({
                origin: n,
                code: `too_small`,
                minimum: typeof t.value == `object` ? t.value.getTime() : t.value,
                input: r.value,
                inclusive: t.inclusive,
                inst: e,
                continue: !t.abort,
              });
          }));
      })),
      (Jt = T(`$ZodCheckMultipleOf`, (e, t) => {
        (U.init(e, t),
          e._zod.onattach.push((e) => {
            var n;
            (n = e._zod.bag).multipleOf ?? (n.multipleOf = t.value);
          }),
          (e._zod.check = (n) => {
            if (typeof n.value != typeof t.value)
              throw Error(`Cannot mix number and bigint in multiple_of check.`);
            (typeof n.value == `bigint`
              ? n.value % t.value === BigInt(0)
              : Ce(n.value, t.value) === 0) ||
              n.issues.push({
                origin: typeof n.value,
                code: `not_multiple_of`,
                divisor: t.value,
                input: n.value,
                inst: e,
                continue: !t.abort,
              });
          }));
      })),
      (Yt = T(`$ZodCheckNumberFormat`, (e, t) => {
        (U.init(e, t), (t.format = t.format || `float64`));
        let n = t.format?.includes(`int`),
          r = n ? `int` : `number`,
          [i, a] = Ge[t.format];
        (e._zod.onattach.push((e) => {
          let r = e._zod.bag;
          ((r.format = t.format), (r.minimum = i), (r.maximum = a), n && (r.pattern = Lt));
        }),
          (e._zod.check = (o) => {
            let s = o.value;
            if (n) {
              if (!Number.isInteger(s)) {
                o.issues.push({
                  expected: r,
                  format: t.format,
                  code: `invalid_type`,
                  continue: !1,
                  input: s,
                  inst: e,
                });
                return;
              }
              if (!Number.isSafeInteger(s)) {
                s > 0
                  ? o.issues.push({
                      input: s,
                      code: `too_big`,
                      maximum: 2 ** 53 - 1,
                      note: `Integers must be within the safe integer range.`,
                      inst: e,
                      origin: r,
                      inclusive: !0,
                      continue: !t.abort,
                    })
                  : o.issues.push({
                      input: s,
                      code: `too_small`,
                      minimum: -(2 ** 53 - 1),
                      note: `Integers must be within the safe integer range.`,
                      inst: e,
                      origin: r,
                      inclusive: !0,
                      continue: !t.abort,
                    });
                return;
              }
            }
            (s < i &&
              o.issues.push({
                origin: `number`,
                input: s,
                code: `too_small`,
                minimum: i,
                inclusive: !0,
                inst: e,
                continue: !t.abort,
              }),
              s > a &&
                o.issues.push({
                  origin: `number`,
                  input: s,
                  code: `too_big`,
                  maximum: a,
                  inclusive: !0,
                  inst: e,
                  continue: !t.abort,
                }));
          }));
      })),
      (Xt = T(`$ZodCheckMaxLength`, (e, t) => {
        var n;
        (U.init(e, t),
          (n = e._zod.def).when ??
            (n.when = (e) => {
              let t = e.value;
              return !xe(t) && t.length !== void 0;
            }),
          e._zod.onattach.push((e) => {
            let n = e._zod.bag.maximum ?? 1 / 0;
            t.maximum < n && (e._zod.bag.maximum = t.maximum);
          }),
          (e._zod.check = (n) => {
            let r = n.value;
            if (r.length <= t.maximum) return;
            let i = ze(r);
            n.issues.push({
              origin: i,
              code: `too_big`,
              maximum: t.maximum,
              inclusive: !0,
              input: r,
              inst: e,
              continue: !t.abort,
            });
          }));
      })),
      (Zt = T(`$ZodCheckMinLength`, (e, t) => {
        var n;
        (U.init(e, t),
          (n = e._zod.def).when ??
            (n.when = (e) => {
              let t = e.value;
              return !xe(t) && t.length !== void 0;
            }),
          e._zod.onattach.push((e) => {
            let n = e._zod.bag.minimum ?? -1 / 0;
            t.minimum > n && (e._zod.bag.minimum = t.minimum);
          }),
          (e._zod.check = (n) => {
            let r = n.value;
            if (r.length >= t.minimum) return;
            let i = ze(r);
            n.issues.push({
              origin: i,
              code: `too_small`,
              minimum: t.minimum,
              inclusive: !0,
              input: r,
              inst: e,
              continue: !t.abort,
            });
          }));
      })),
      (Qt = T(`$ZodCheckLengthEquals`, (e, t) => {
        var n;
        (U.init(e, t),
          (n = e._zod.def).when ??
            (n.when = (e) => {
              let t = e.value;
              return !xe(t) && t.length !== void 0;
            }),
          e._zod.onattach.push((e) => {
            let n = e._zod.bag;
            ((n.minimum = t.length), (n.maximum = t.length), (n.length = t.length));
          }),
          (e._zod.check = (n) => {
            let r = n.value,
              i = r.length;
            if (i === t.length) return;
            let a = ze(r),
              o = i > t.length;
            n.issues.push({
              origin: a,
              ...(o
                ? { code: `too_big`, maximum: t.length }
                : { code: `too_small`, minimum: t.length }),
              inclusive: !0,
              exact: !0,
              input: n.value,
              inst: e,
              continue: !t.abort,
            });
          }));
      })),
      ($t = T(`$ZodCheckStringFormat`, (e, t) => {
        var n, r;
        (U.init(e, t),
          e._zod.onattach.push((e) => {
            let n = e._zod.bag;
            ((n.format = t.format),
              t.pattern && ((n.patterns ??= new Set()), n.patterns.add(t.pattern)));
          }),
          t.pattern
            ? ((n = e._zod).check ??
              (n.check = (n) => {
                ((t.pattern.lastIndex = 0),
                  !t.pattern.test(n.value) &&
                    n.issues.push({
                      origin: `string`,
                      code: `invalid_format`,
                      format: t.format,
                      input: n.value,
                      ...(t.pattern ? { pattern: t.pattern.toString() } : {}),
                      inst: e,
                      continue: !t.abort,
                    }));
              }))
            : ((r = e._zod).check ?? (r.check = () => {})));
      })),
      (en = T(`$ZodCheckRegex`, (e, t) => {
        ($t.init(e, t),
          (e._zod.check = (n) => {
            ((t.pattern.lastIndex = 0),
              !t.pattern.test(n.value) &&
                n.issues.push({
                  origin: `string`,
                  code: `invalid_format`,
                  format: `regex`,
                  input: n.value,
                  pattern: t.pattern.toString(),
                  inst: e,
                  continue: !t.abort,
                }));
          }));
      })),
      (tn = T(`$ZodCheckLowerCase`, (e, t) => {
        ((t.pattern ??= Ht), $t.init(e, t));
      })),
      (nn = T(`$ZodCheckUpperCase`, (e, t) => {
        ((t.pattern ??= Ut), $t.init(e, t));
      })),
      (rn = T(`$ZodCheckIncludes`, (e, t) => {
        U.init(e, t);
        let n = N(t.includes),
          r = new RegExp(typeof t.position == `number` ? `^.{${t.position}}${n}` : n);
        ((t.pattern = r),
          e._zod.onattach.push((e) => {
            let t = e._zod.bag;
            ((t.patterns ??= new Set()), t.patterns.add(r));
          }),
          (e._zod.check = (n) => {
            n.value.includes(t.includes, t.position) ||
              n.issues.push({
                origin: `string`,
                code: `invalid_format`,
                format: `includes`,
                includes: t.includes,
                input: n.value,
                inst: e,
                continue: !t.abort,
              });
          }));
      })),
      (an = T(`$ZodCheckStartsWith`, (e, t) => {
        U.init(e, t);
        let n = RegExp(`^${N(t.prefix)}.*`);
        ((t.pattern ??= n),
          e._zod.onattach.push((e) => {
            let t = e._zod.bag;
            ((t.patterns ??= new Set()), t.patterns.add(n));
          }),
          (e._zod.check = (n) => {
            n.value.startsWith(t.prefix) ||
              n.issues.push({
                origin: `string`,
                code: `invalid_format`,
                format: `starts_with`,
                prefix: t.prefix,
                input: n.value,
                inst: e,
                continue: !t.abort,
              });
          }));
      })),
      (on = T(`$ZodCheckEndsWith`, (e, t) => {
        U.init(e, t);
        let n = RegExp(`.*${N(t.suffix)}$`);
        ((t.pattern ??= n),
          e._zod.onattach.push((e) => {
            let t = e._zod.bag;
            ((t.patterns ??= new Set()), t.patterns.add(n));
          }),
          (e._zod.check = (n) => {
            n.value.endsWith(t.suffix) ||
              n.issues.push({
                origin: `string`,
                code: `invalid_format`,
                format: `ends_with`,
                suffix: t.suffix,
                input: n.value,
                inst: e,
                continue: !t.abort,
              });
          }));
      })),
      (sn = T(`$ZodCheckOverwrite`, (e, t) => {
        (U.init(e, t),
          (e._zod.check = (e) => {
            e.value = t.tx(e.value);
          }));
      })));
  }),
  ln,
  un = e(() => {
    ln = class {
      constructor(e = []) {
        ((this.content = []), (this.indent = 0), this && (this.args = e));
      }
      indented(e) {
        ((this.indent += 1), e(this), --this.indent);
      }
      write(e) {
        if (typeof e == `function`) {
          (e(this, { execution: `sync` }), e(this, { execution: `async` }));
          return;
        }
        let t = e
            .split(`
`)
            .filter((e) => e),
          n = Math.min(...t.map((e) => e.length - e.trimStart().length)),
          r = t.map((e) => e.slice(n)).map((e) => ` `.repeat(this.indent * 2) + e);
        for (let e of r) this.content.push(e);
      }
      compile() {
        let e = Function,
          t = this?.args,
          n = [...(this?.content ?? [``]).map((e) => `  ${e}`)];
        return new e(
          ...t,
          n.join(`
`),
        );
      }
    };
  }),
  dn,
  fn = e(() => {
    dn = { major: 4, minor: 4, patch: 3 };
  });
function pn(e) {
  if (e === ``) return !0;
  if (/\s/.test(e) || e.length % 4 != 0) return !1;
  try {
    return (atob(e), !0);
  } catch {
    return !1;
  }
}
function mn(e) {
  if (!jt.test(e)) return !1;
  let t = e.replace(/[-_]/g, (e) => (e === `-` ? `+` : `/`));
  return pn(t.padEnd(Math.ceil(t.length / 4) * 4, `=`));
}
function hn(e, t = null) {
  try {
    let n = e.split(`.`);
    if (n.length !== 3) return !1;
    let [r] = n;
    if (!r) return !1;
    let i = JSON.parse(atob(r));
    return !((`typ` in i && i?.typ !== `JWT`) || !i.alg || (t && (!(`alg` in i) || i.alg !== t)));
  } catch {
    return !1;
  }
}
function gn(e, t, n) {
  (e.issues.length && t.issues.push(...L(n, e.issues)), (t.value[n] = e.value));
}
function _n(e, t, n, r, i, a) {
  let o = n in r;
  if (e.issues.length) {
    if (i && a && !o) return;
    t.issues.push(...L(n, e.issues));
  }
  if (!o && !i) {
    e.issues.length ||
      t.issues.push({ code: `invalid_type`, expected: `nonoptional`, input: void 0, path: [n] });
    return;
  }
  e.value === void 0 ? o && (t.value[n] = void 0) : (t.value[n] = e.value);
}
function vn(e) {
  let t = Object.keys(e.shape);
  for (let n of t)
    if (!e.shape?.[n]?._zod?.traits?.has(`$ZodType`))
      throw Error(`Invalid element at key "${n}": expected a Zod schema`);
  let n = ke(e.shape);
  return { ...e, keys: t, keySet: new Set(t), numKeys: t.length, optionalKeys: new Set(n) };
}
function yn(e, t, n, r, i, a) {
  let o = [],
    s = i.keySet,
    c = i.catchall._zod,
    l = c.def.type,
    u = c.optin === `optional`,
    d = c.optout === `optional`;
  for (let i in t) {
    if (i === `__proto__` || s.has(i)) continue;
    if (l === `never`) {
      o.push(i);
      continue;
    }
    let a = c.run({ value: t[i], issues: [] }, r);
    a instanceof Promise ? e.push(a.then((e) => _n(e, n, i, t, u, d))) : _n(a, n, i, t, u, d);
  }
  return (
    o.length && n.issues.push({ code: `unrecognized_keys`, keys: o, input: t, inst: a }),
    e.length ? Promise.all(e).then(() => n) : n
  );
}
function bn(e, t, n, r) {
  for (let n of e) if (n.issues.length === 0) return ((t.value = n.value), t);
  let i = e.filter((e) => !I(e));
  return i.length === 1
    ? ((t.value = i[0].value), i[0])
    : (t.issues.push({
        code: `invalid_union`,
        input: t.value,
        inst: n,
        errors: e.map((e) => e.issues.map((e) => R(e, r, E()))),
      }),
      t);
}
function xn(e, t) {
  if (e === t || (e instanceof Date && t instanceof Date && +e == +t))
    return { valid: !0, data: e };
  if (M(e) && M(t)) {
    let n = Object.keys(t),
      r = Object.keys(e).filter((e) => n.indexOf(e) !== -1),
      i = { ...e, ...t };
    for (let n of r) {
      let r = xn(e[n], t[n]);
      if (!r.valid) return { valid: !1, mergeErrorPath: [n, ...r.mergeErrorPath] };
      i[n] = r.data;
    }
    return { valid: !0, data: i };
  }
  if (Array.isArray(e) && Array.isArray(t)) {
    if (e.length !== t.length) return { valid: !1, mergeErrorPath: [] };
    let n = [];
    for (let r = 0; r < e.length; r++) {
      let i = e[r],
        a = t[r],
        o = xn(i, a);
      if (!o.valid) return { valid: !1, mergeErrorPath: [r, ...o.mergeErrorPath] };
      n.push(o.data);
    }
    return { valid: !0, data: n };
  }
  return { valid: !1, mergeErrorPath: [] };
}
function Sn(e, t, n) {
  let r = new Map(),
    i;
  for (let n of t.issues)
    if (n.code === `unrecognized_keys`) {
      i ??= n;
      for (let e of n.keys) (r.has(e) || r.set(e, {}), (r.get(e).l = !0));
    } else e.issues.push(n);
  for (let t of n.issues)
    if (t.code === `unrecognized_keys`)
      for (let e of t.keys) (r.has(e) || r.set(e, {}), (r.get(e).r = !0));
    else e.issues.push(t);
  let a = [...r].filter(([, e]) => e.l && e.r).map(([e]) => e);
  if ((a.length && i && e.issues.push({ ...i, keys: a }), I(e))) return e;
  let o = xn(t.value, n.value);
  if (!o.valid)
    throw Error(`Unmergable intersection. Error path: ${JSON.stringify(o.mergeErrorPath)}`);
  return ((e.value = o.data), e);
}
function Cn(e, t) {
  return t === void 0 && (e.issues.length || e.fallback) ? { issues: [], value: void 0 } : e;
}
function wn(e, t) {
  return (e.value === void 0 && (e.value = t.defaultValue), e);
}
function Tn(e, t) {
  return (
    !e.issues.length &&
      e.value === void 0 &&
      e.issues.push({ code: `invalid_type`, expected: `nonoptional`, input: e.value, inst: t }),
    e
  );
}
function En(e, t, n) {
  return e.issues.length
    ? ((e.aborted = !0), e)
    : t._zod.run({ value: e.value, issues: e.issues, fallback: e.fallback }, n);
}
function Dn(e) {
  return ((e.value = Object.freeze(e.value)), e);
}
function On(e, t, n, r) {
  if (!e) {
    let e = {
      code: `custom`,
      input: n,
      inst: r,
      path: [...(r._zod.def.path ?? [])],
      continue: !r._zod.def.abort,
    };
    (r._zod.def.params && (e.params = r._zod.def.params), t.issues.push(z(e)));
  }
}
var W,
  kn,
  G,
  An,
  jn,
  Mn,
  Nn,
  Pn,
  Fn,
  In,
  Ln,
  Rn,
  zn,
  Bn,
  Vn,
  Hn,
  Un,
  Wn,
  Gn,
  Kn,
  qn,
  Jn,
  Yn,
  Xn,
  Zn,
  Qn,
  $n,
  er,
  tr,
  nr,
  rr,
  ir,
  ar,
  or,
  sr,
  cr,
  lr,
  ur,
  dr,
  fr,
  pr,
  mr,
  hr,
  gr,
  _r,
  vr,
  yr,
  br,
  xr,
  Sr,
  Cr,
  wr,
  Tr,
  Er,
  Dr = e(() => {
    (cn(),
      O(),
      un(),
      ut(),
      Wt(),
      B(),
      fn(),
      (W = T(`$ZodType`, (e, t) => {
        var n;
        ((e ??= {}), (e._zod.def = t), (e._zod.bag = e._zod.bag || {}), (e._zod.version = dn));
        let r = [...(e._zod.def.checks ?? [])];
        e._zod.traits.has(`$ZodCheck`) && r.unshift(e);
        for (let t of r) for (let n of t._zod.onattach) n(e);
        if (r.length === 0)
          ((n = e._zod).deferred ?? (n.deferred = []),
            e._zod.deferred?.push(() => {
              e._zod.run = e._zod.parse;
            }));
        else {
          let t = (e, t, n) => {
              let r = I(e),
                i;
              for (let a of t) {
                if (a._zod.def.when) {
                  if (Le(e) || !a._zod.def.when(e)) continue;
                } else if (r) continue;
                let t = e.issues.length,
                  o = a._zod.check(e);
                if (o instanceof Promise && n?.async === !1) throw new D();
                if (i || o instanceof Promise)
                  i = (i ?? Promise.resolve()).then(async () => {
                    (await o, e.issues.length !== t && (r ||= I(e, t)));
                  });
                else {
                  if (e.issues.length === t) continue;
                  r ||= I(e, t);
                }
              }
              return i ? i.then(() => e) : e;
            },
            n = (n, i, a) => {
              if (I(n)) return ((n.aborted = !0), n);
              let o = t(i, r, a);
              if (o instanceof Promise) {
                if (a.async === !1) throw new D();
                return o.then((t) => e._zod.parse(t, a));
              }
              return e._zod.parse(o, a);
            };
          e._zod.run = (i, a) => {
            if (a.skipChecks) return e._zod.parse(i, a);
            if (a.direction === `backward`) {
              let t = e._zod.parse({ value: i.value, issues: [] }, { ...a, skipChecks: !0 });
              return t instanceof Promise ? t.then((e) => n(e, i, a)) : n(t, i, a);
            }
            let o = e._zod.parse(i, a);
            if (o instanceof Promise) {
              if (a.async === !1) throw new D();
              return o.then((e) => t(e, r, a));
            }
            return t(o, r, a);
          };
        }
        k(e, `~standard`, () => ({
          validate: (t) => {
            try {
              let n = et(e, t);
              return n.success ? { value: n.data } : { issues: n.error?.issues };
            } catch {
              return tt(e, t).then((e) =>
                e.success ? { value: e.data } : { issues: e.error?.issues },
              );
            }
          },
          vendor: `zod`,
          version: 1,
        }));
      })),
      (kn = T(`$ZodString`, (e, t) => {
        (W.init(e, t),
          (e._zod.pattern = [...(e?._zod.bag?.patterns ?? [])].pop() ?? It(e._zod.bag)),
          (e._zod.parse = (n, r) => {
            if (t.coerce)
              try {
                n.value = String(n.value);
              } catch {}
            return (
              typeof n.value == `string` ||
                n.issues.push({
                  expected: `string`,
                  code: `invalid_type`,
                  input: n.value,
                  inst: e,
                }),
              n
            );
          }));
      })),
      (G = T(`$ZodStringFormat`, (e, t) => {
        ($t.init(e, t), kn.init(e, t));
      })),
      (An = T(`$ZodGUID`, (e, t) => {
        ((t.pattern ??= St), G.init(e, t));
      })),
      (jn = T(`$ZodUUID`, (e, t) => {
        if (t.version) {
          let e = { v1: 1, v2: 2, v3: 3, v4: 4, v5: 5, v6: 6, v7: 7, v8: 8 }[t.version];
          if (e === void 0) throw Error(`Invalid UUID version: "${t.version}"`);
          t.pattern ??= Ct(e);
        } else t.pattern ??= Ct();
        G.init(e, t);
      })),
      (Mn = T(`$ZodEmail`, (e, t) => {
        ((t.pattern ??= wt), G.init(e, t));
      })),
      (Nn = T(`$ZodURL`, (e, t) => {
        (G.init(e, t),
          (e._zod.check = (n) => {
            try {
              let r = n.value.trim();
              if (!t.normalize && t.protocol?.source === Mt.source && !/^https?:\/\//i.test(r)) {
                n.issues.push({
                  code: `invalid_format`,
                  format: `url`,
                  note: `Invalid URL format`,
                  input: n.value,
                  inst: e,
                  continue: !t.abort,
                });
                return;
              }
              let i = new URL(r);
              (t.hostname &&
                ((t.hostname.lastIndex = 0),
                t.hostname.test(i.hostname) ||
                  n.issues.push({
                    code: `invalid_format`,
                    format: `url`,
                    note: `Invalid hostname`,
                    pattern: t.hostname.source,
                    input: n.value,
                    inst: e,
                    continue: !t.abort,
                  })),
                t.protocol &&
                  ((t.protocol.lastIndex = 0),
                  t.protocol.test(
                    i.protocol.endsWith(`:`) ? i.protocol.slice(0, -1) : i.protocol,
                  ) ||
                    n.issues.push({
                      code: `invalid_format`,
                      format: `url`,
                      note: `Invalid protocol`,
                      pattern: t.protocol.source,
                      input: n.value,
                      inst: e,
                      continue: !t.abort,
                    })),
                t.normalize ? (n.value = i.href) : (n.value = r));
              return;
            } catch {
              n.issues.push({
                code: `invalid_format`,
                format: `url`,
                input: n.value,
                inst: e,
                continue: !t.abort,
              });
            }
          }));
      })),
      (Pn = T(`$ZodEmoji`, (e, t) => {
        ((t.pattern ??= dt()), G.init(e, t));
      })),
      (Fn = T(`$ZodNanoID`, (e, t) => {
        ((t.pattern ??= bt), G.init(e, t));
      })),
      (In = T(`$ZodCUID`, (e, t) => {
        ((t.pattern ??= ht), G.init(e, t));
      })),
      (Ln = T(`$ZodCUID2`, (e, t) => {
        ((t.pattern ??= gt), G.init(e, t));
      })),
      (Rn = T(`$ZodULID`, (e, t) => {
        ((t.pattern ??= _t), G.init(e, t));
      })),
      (zn = T(`$ZodXID`, (e, t) => {
        ((t.pattern ??= vt), G.init(e, t));
      })),
      (Bn = T(`$ZodKSUID`, (e, t) => {
        ((t.pattern ??= yt), G.init(e, t));
      })),
      (Vn = T(`$ZodISODateTime`, (e, t) => {
        ((t.pattern ??= mt(t)), G.init(e, t));
      })),
      (Hn = T(`$ZodISODate`, (e, t) => {
        ((t.pattern ??= Ft), G.init(e, t));
      })),
      (Un = T(`$ZodISOTime`, (e, t) => {
        ((t.pattern ??= pt(t)), G.init(e, t));
      })),
      (Wn = T(`$ZodISODuration`, (e, t) => {
        ((t.pattern ??= xt), G.init(e, t));
      })),
      (Gn = T(`$ZodIPv4`, (e, t) => {
        ((t.pattern ??= Et), G.init(e, t), (e._zod.bag.format = `ipv4`));
      })),
      (Kn = T(`$ZodIPv6`, (e, t) => {
        ((t.pattern ??= Dt),
          G.init(e, t),
          (e._zod.bag.format = `ipv6`),
          (e._zod.check = (n) => {
            try {
              new URL(`http://[${n.value}]`);
            } catch {
              n.issues.push({
                code: `invalid_format`,
                format: `ipv6`,
                input: n.value,
                inst: e,
                continue: !t.abort,
              });
            }
          }));
      })),
      (qn = T(`$ZodCIDRv4`, (e, t) => {
        ((t.pattern ??= Ot), G.init(e, t));
      })),
      (Jn = T(`$ZodCIDRv6`, (e, t) => {
        ((t.pattern ??= kt),
          G.init(e, t),
          (e._zod.check = (n) => {
            let r = n.value.split(`/`);
            try {
              if (r.length !== 2) throw Error();
              let [e, t] = r;
              if (!t) throw Error();
              let n = Number(t);
              if (`${n}` !== t || n < 0 || n > 128) throw Error();
              new URL(`http://[${e}]`);
            } catch {
              n.issues.push({
                code: `invalid_format`,
                format: `cidrv6`,
                input: n.value,
                inst: e,
                continue: !t.abort,
              });
            }
          }));
      })),
      (Yn = T(`$ZodBase64`, (e, t) => {
        ((t.pattern ??= At),
          G.init(e, t),
          (e._zod.bag.contentEncoding = `base64`),
          (e._zod.check = (n) => {
            pn(n.value) ||
              n.issues.push({
                code: `invalid_format`,
                format: `base64`,
                input: n.value,
                inst: e,
                continue: !t.abort,
              });
          }));
      })),
      (Xn = T(`$ZodBase64URL`, (e, t) => {
        ((t.pattern ??= jt),
          G.init(e, t),
          (e._zod.bag.contentEncoding = `base64url`),
          (e._zod.check = (n) => {
            mn(n.value) ||
              n.issues.push({
                code: `invalid_format`,
                format: `base64url`,
                input: n.value,
                inst: e,
                continue: !t.abort,
              });
          }));
      })),
      (Zn = T(`$ZodE164`, (e, t) => {
        ((t.pattern ??= Nt), G.init(e, t));
      })),
      (Qn = T(`$ZodJWT`, (e, t) => {
        (G.init(e, t),
          (e._zod.check = (n) => {
            hn(n.value, t.alg) ||
              n.issues.push({
                code: `invalid_format`,
                format: `jwt`,
                input: n.value,
                inst: e,
                continue: !t.abort,
              });
          }));
      })),
      ($n = T(`$ZodNumber`, (e, t) => {
        (W.init(e, t),
          (e._zod.pattern = e._zod.bag.pattern ?? Rt),
          (e._zod.parse = (n, r) => {
            if (t.coerce)
              try {
                n.value = Number(n.value);
              } catch {}
            let i = n.value;
            if (typeof i == `number` && !Number.isNaN(i) && Number.isFinite(i)) return n;
            let a =
              typeof i == `number`
                ? Number.isNaN(i)
                  ? `NaN`
                  : Number.isFinite(i)
                    ? void 0
                    : `Infinity`
                : void 0;
            return (
              n.issues.push({
                expected: `number`,
                code: `invalid_type`,
                input: i,
                inst: e,
                ...(a ? { received: a } : {}),
              }),
              n
            );
          }));
      })),
      (er = T(`$ZodNumberFormat`, (e, t) => {
        (Yt.init(e, t), $n.init(e, t));
      })),
      (tr = T(`$ZodBoolean`, (e, t) => {
        (W.init(e, t),
          (e._zod.pattern = zt),
          (e._zod.parse = (n, r) => {
            if (t.coerce)
              try {
                n.value = !!n.value;
              } catch {}
            let i = n.value;
            return (
              typeof i == `boolean` ||
                n.issues.push({ expected: `boolean`, code: `invalid_type`, input: i, inst: e }),
              n
            );
          }));
      })),
      (nr = T(`$ZodUndefined`, (e, t) => {
        (W.init(e, t),
          (e._zod.pattern = Vt),
          (e._zod.values = new Set([void 0])),
          (e._zod.parse = (t, n) => {
            let r = t.value;
            return (
              r === void 0 ||
                t.issues.push({ expected: `undefined`, code: `invalid_type`, input: r, inst: e }),
              t
            );
          }));
      })),
      (rr = T(`$ZodNull`, (e, t) => {
        (W.init(e, t),
          (e._zod.pattern = Bt),
          (e._zod.values = new Set([null])),
          (e._zod.parse = (t, n) => {
            let r = t.value;
            return (
              r === null ||
                t.issues.push({ expected: `null`, code: `invalid_type`, input: r, inst: e }),
              t
            );
          }));
      })),
      (ir = T(`$ZodUnknown`, (e, t) => {
        (W.init(e, t), (e._zod.parse = (e) => e));
      })),
      (ar = T(`$ZodNever`, (e, t) => {
        (W.init(e, t),
          (e._zod.parse = (t, n) => (
            t.issues.push({ expected: `never`, code: `invalid_type`, input: t.value, inst: e }),
            t
          )));
      })),
      (or = T(`$ZodArray`, (e, t) => {
        (W.init(e, t),
          (e._zod.parse = (n, r) => {
            let i = n.value;
            if (!Array.isArray(i))
              return (
                n.issues.push({ expected: `array`, code: `invalid_type`, input: i, inst: e }), n
              );
            n.value = Array(i.length);
            let a = [];
            for (let e = 0; e < i.length; e++) {
              let o = i[e],
                s = t.element._zod.run({ value: o, issues: [] }, r);
              s instanceof Promise ? a.push(s.then((t) => gn(t, n, e))) : gn(s, n, e);
            }
            return a.length ? Promise.all(a).then(() => n) : n;
          }));
      })),
      (sr = T(`$ZodObject`, (e, t) => {
        if ((W.init(e, t), !Object.getOwnPropertyDescriptor(t, `shape`)?.get)) {
          let e = t.shape;
          Object.defineProperty(t, "shape", {
            get: () => {
              let n = { ...e };
              return (Object.defineProperty(t, "shape", { value: n }), n);
            },
          });
        }
        let n = be(() => vn(t));
        k(e._zod, `propValues`, () => {
          let e = t.shape,
            n = {};
          for (let t in e) {
            let r = e[t]._zod;
            if (r.values) {
              n[t] ?? (n[t] = new Set());
              for (let e of r.values) n[t].add(e);
            }
          }
          return n;
        });
        let r = Ee,
          i = t.catchall,
          a;
        e._zod.parse = (t, o) => {
          a ??= n.value;
          let s = t.value;
          if (!r(s))
            return (
              t.issues.push({ expected: `object`, code: `invalid_type`, input: s, inst: e }), t
            );
          t.value = {};
          let c = [],
            l = a.shape;
          for (let e of a.keys) {
            let n = l[e],
              r = n._zod.optin === `optional`,
              i = n._zod.optout === `optional`,
              a = n._zod.run({ value: s[e], issues: [] }, o);
            a instanceof Promise
              ? c.push(a.then((n) => _n(n, t, e, s, r, i)))
              : _n(a, t, e, s, r, i);
          }
          return i ? yn(c, s, t, o, n.value, e) : c.length ? Promise.all(c).then(() => t) : t;
        };
      })),
      (cr = T(`$ZodObjectJIT`, (e, t) => {
        sr.init(e, t);
        let n = e._zod.parse,
          r = be(() => vn(t)),
          i = (e) => {
            let t = new ln([`shape`, `payload`, `ctx`]),
              n = r.value,
              i = (e) => {
                let t = we(e);
                return `shape[${t}]._zod.run({ value: input[${t}], issues: [] }, ctx)`;
              };
            t.write(`const input = payload.value;`);
            let a = Object.create(null),
              o = 0;
            for (let e of n.keys) a[e] = `key_${o++}`;
            t.write(`const newResult = {};`);
            for (let r of n.keys) {
              let n = a[r],
                o = we(r),
                s = e[r],
                c = s?._zod?.optin === `optional`,
                l = s?._zod?.optout === `optional`;
              (t.write(`const ${n} = ${i(r)};`),
                c && l
                  ? t.write(`
        if (${n}.issues.length) {
          if (${o} in input) {
            payload.issues = payload.issues.concat(${n}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${o}, ...iss.path] : [${o}]
            })));
          }
        }
        
        if (${n}.value === undefined) {
          if (${o} in input) {
            newResult[${o}] = undefined;
          }
        } else {
          newResult[${o}] = ${n}.value;
        }
        
      `)
                  : c
                    ? t.write(`
        if (${n}.issues.length) {
          payload.issues = payload.issues.concat(${n}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${o}, ...iss.path] : [${o}]
          })));
        }
        
        if (${n}.value === undefined) {
          if (${o} in input) {
            newResult[${o}] = undefined;
          }
        } else {
          newResult[${o}] = ${n}.value;
        }
        
      `)
                    : t.write(`
        const ${n}_present = ${o} in input;
        if (${n}.issues.length) {
          payload.issues = payload.issues.concat(${n}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${o}, ...iss.path] : [${o}]
          })));
        }
        if (!${n}_present && !${n}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${o}]
          });
        }

        if (${n}_present) {
          if (${n}.value === undefined) {
            newResult[${o}] = undefined;
          } else {
            newResult[${o}] = ${n}.value;
          }
        }

      `));
            }
            (t.write(`payload.value = newResult;`), t.write(`return payload;`));
            let s = t.compile();
            return (t, n) => s(e, t, n);
          },
          a,
          o = Ee,
          s = !ge.jitless,
          c = s && Ue.value,
          l = t.catchall,
          u;
        e._zod.parse = (d, f) => {
          u ??= r.value;
          let p = d.value;
          return o(p)
            ? s && c && f?.async === !1 && f.jitless !== !0
              ? ((a ||= i(t.shape)), (d = a(d, f)), l ? yn([], p, d, f, u, e) : d)
              : n(d, f)
            : (d.issues.push({ expected: `object`, code: `invalid_type`, input: p, inst: e }), d);
        };
      })),
      (lr = T(`$ZodUnion`, (e, t) => {
        (W.init(e, t),
          k(e._zod, `optin`, () =>
            t.options.some((e) => e._zod.optin === `optional`) ? `optional` : void 0,
          ),
          k(e._zod, `optout`, () =>
            t.options.some((e) => e._zod.optout === `optional`) ? `optional` : void 0,
          ),
          k(e._zod, `values`, () => {
            if (t.options.every((e) => e._zod.values))
              return new Set(t.options.flatMap((e) => Array.from(e._zod.values)));
          }),
          k(e._zod, `pattern`, () => {
            if (t.options.every((e) => e._zod.pattern)) {
              let e = t.options.map((e) => e._zod.pattern);
              return RegExp(`^(${e.map((e) => Se(e.source)).join(`|`)})$`);
            }
          }));
        let n = t.options.length === 1 ? t.options[0]._zod.run : null;
        e._zod.parse = (r, i) => {
          if (n) return n(r, i);
          let a = !1,
            o = [];
          for (let e of t.options) {
            let t = e._zod.run({ value: r.value, issues: [] }, i);
            if (t instanceof Promise) (o.push(t), (a = !0));
            else {
              if (t.issues.length === 0) return t;
              o.push(t);
            }
          }
          return a ? Promise.all(o).then((t) => bn(t, r, e, i)) : bn(o, r, e, i);
        };
      })),
      (ur = T(`$ZodDiscriminatedUnion`, (e, t) => {
        ((t.inclusive = !1), lr.init(e, t));
        let n = e._zod.parse;
        k(e._zod, `propValues`, () => {
          let e = {};
          for (let n of t.options) {
            let r = n._zod.propValues;
            if (!r || Object.keys(r).length === 0)
              throw Error(`Invalid discriminated union option at index "${t.options.indexOf(n)}"`);
            for (let [t, n] of Object.entries(r)) {
              e[t] || (e[t] = new Set());
              for (let r of n) e[t].add(r);
            }
          }
          return e;
        });
        let r = be(() => {
          let e = t.options,
            n = new Map();
          for (let r of e) {
            let e = r._zod.propValues?.[t.discriminator];
            if (!e || e.size === 0)
              throw Error(`Invalid discriminated union option at index "${t.options.indexOf(r)}"`);
            for (let t of e) {
              if (n.has(t)) throw Error(`Duplicate discriminator value "${String(t)}"`);
              n.set(t, r);
            }
          }
          return n;
        });
        e._zod.parse = (i, a) => {
          let o = i.value;
          if (!Ee(o))
            return (
              i.issues.push({ code: `invalid_type`, expected: `object`, input: o, inst: e }), i
            );
          let s = r.value.get(o?.[t.discriminator]);
          return s
            ? s._zod.run(i, a)
            : t.unionFallback || a.direction === `backward`
              ? n(i, a)
              : (i.issues.push({
                  code: `invalid_union`,
                  errors: [],
                  note: `No matching discriminator`,
                  discriminator: t.discriminator,
                  options: Array.from(r.value.keys()),
                  input: o,
                  path: [t.discriminator],
                  inst: e,
                }),
                i);
        };
      })),
      (dr = T(`$ZodIntersection`, (e, t) => {
        (W.init(e, t),
          (e._zod.parse = (e, n) => {
            let r = e.value,
              i = t.left._zod.run({ value: r, issues: [] }, n),
              a = t.right._zod.run({ value: r, issues: [] }, n);
            return i instanceof Promise || a instanceof Promise
              ? Promise.all([i, a]).then(([t, n]) => Sn(e, t, n))
              : Sn(e, i, a);
          }));
      })),
      (fr = T(`$ZodRecord`, (e, t) => {
        (W.init(e, t),
          (e._zod.parse = (n, r) => {
            let i = n.value;
            if (!M(i))
              return (
                n.issues.push({ expected: `record`, code: `invalid_type`, input: i, inst: e }), n
              );
            let a = [],
              o = t.keyType._zod.values;
            if (o) {
              n.value = {};
              let s = new Set();
              for (let c of o)
                if (typeof c == `string` || typeof c == `number` || typeof c == `symbol`) {
                  s.add(typeof c == `number` ? c.toString() : c);
                  let o = t.keyType._zod.run({ value: c, issues: [] }, r);
                  if (o instanceof Promise)
                    throw Error(`Async schemas not supported in object keys currently`);
                  if (o.issues.length) {
                    n.issues.push({
                      code: `invalid_key`,
                      origin: `record`,
                      issues: o.issues.map((e) => R(e, r, E())),
                      input: c,
                      path: [c],
                      inst: e,
                    });
                    continue;
                  }
                  let l = o.value,
                    u = t.valueType._zod.run({ value: i[c], issues: [] }, r);
                  u instanceof Promise
                    ? a.push(
                        u.then((e) => {
                          (e.issues.length && n.issues.push(...L(c, e.issues)),
                            (n.value[l] = e.value));
                        }),
                      )
                    : (u.issues.length && n.issues.push(...L(c, u.issues)), (n.value[l] = u.value));
                }
              let c;
              for (let e in i) s.has(e) || ((c ??= []), c.push(e));
              c &&
                c.length > 0 &&
                n.issues.push({ code: `unrecognized_keys`, input: i, inst: e, keys: c });
            } else {
              n.value = {};
              for (let o of Reflect.ownKeys(i)) {
                if (o === `__proto__` || !Object.prototype.propertyIsEnumerable.call(i, o))
                  continue;
                let s = t.keyType._zod.run({ value: o, issues: [] }, r);
                if (s instanceof Promise)
                  throw Error(`Async schemas not supported in object keys currently`);
                if (typeof o == `string` && Rt.test(o) && s.issues.length) {
                  let e = t.keyType._zod.run({ value: Number(o), issues: [] }, r);
                  if (e instanceof Promise)
                    throw Error(`Async schemas not supported in object keys currently`);
                  e.issues.length === 0 && (s = e);
                }
                if (s.issues.length) {
                  t.mode === `loose`
                    ? (n.value[o] = i[o])
                    : n.issues.push({
                        code: `invalid_key`,
                        origin: `record`,
                        issues: s.issues.map((e) => R(e, r, E())),
                        input: o,
                        path: [o],
                        inst: e,
                      });
                  continue;
                }
                let c = t.valueType._zod.run({ value: i[o], issues: [] }, r);
                c instanceof Promise
                  ? a.push(
                      c.then((e) => {
                        (e.issues.length && n.issues.push(...L(o, e.issues)),
                          (n.value[s.value] = e.value));
                      }),
                    )
                  : (c.issues.length && n.issues.push(...L(o, c.issues)),
                    (n.value[s.value] = c.value));
              }
            }
            return a.length ? Promise.all(a).then(() => n) : n;
          }));
      })),
      (pr = T(`$ZodEnum`, (e, t) => {
        W.init(e, t);
        let n = _e(t.entries),
          r = new Set(n);
        ((e._zod.values = r),
          (e._zod.pattern = RegExp(
            `^(${n
              .filter((e) => We.has(typeof e))
              .map((e) => (typeof e == `string` ? N(e) : e.toString()))
              .join(`|`)})$`,
          )),
          (e._zod.parse = (t, i) => {
            let a = t.value;
            return (
              r.has(a) || t.issues.push({ code: `invalid_value`, values: n, input: a, inst: e }), t
            );
          }));
      })),
      (mr = T(`$ZodLiteral`, (e, t) => {
        if ((W.init(e, t), t.values.length === 0))
          throw Error(`Cannot create literal schema with no valid values`);
        let n = new Set(t.values);
        ((e._zod.values = n),
          (e._zod.pattern = RegExp(
            `^(${t.values.map((e) => (typeof e == `string` ? N(e) : e ? N(e.toString()) : String(e))).join(`|`)})$`,
          )),
          (e._zod.parse = (r, i) => {
            let a = r.value;
            return (
              n.has(a) ||
                r.issues.push({ code: `invalid_value`, values: t.values, input: a, inst: e }),
              r
            );
          }));
      })),
      (hr = T(`$ZodTransform`, (e, t) => {
        (W.init(e, t),
          (e._zod.optin = `optional`),
          (e._zod.parse = (n, r) => {
            if (r.direction === `backward`) throw new he(e.constructor.name);
            let i = t.transform(n.value, n);
            if (r.async)
              return (i instanceof Promise ? i : Promise.resolve(i)).then(
                (e) => ((n.value = e), (n.fallback = !0), n),
              );
            if (i instanceof Promise) throw new D();
            return ((n.value = i), (n.fallback = !0), n);
          }));
      })),
      (gr = T(`$ZodOptional`, (e, t) => {
        (W.init(e, t),
          (e._zod.optin = `optional`),
          (e._zod.optout = `optional`),
          k(e._zod, `values`, () =>
            t.innerType._zod.values ? new Set([...t.innerType._zod.values, void 0]) : void 0,
          ),
          k(e._zod, `pattern`, () => {
            let e = t.innerType._zod.pattern;
            return e ? RegExp(`^(${Se(e.source)})?$`) : void 0;
          }),
          (e._zod.parse = (e, n) => {
            if (t.innerType._zod.optin === `optional`) {
              let r = e.value,
                i = t.innerType._zod.run(e, n);
              return i instanceof Promise ? i.then((e) => Cn(e, r)) : Cn(i, r);
            }
            return e.value === void 0 ? e : t.innerType._zod.run(e, n);
          }));
      })),
      (_r = T(`$ZodExactOptional`, (e, t) => {
        (gr.init(e, t),
          k(e._zod, `values`, () => t.innerType._zod.values),
          k(e._zod, `pattern`, () => t.innerType._zod.pattern),
          (e._zod.parse = (e, n) => t.innerType._zod.run(e, n)));
      })),
      (vr = T(`$ZodNullable`, (e, t) => {
        (W.init(e, t),
          k(e._zod, `optin`, () => t.innerType._zod.optin),
          k(e._zod, `optout`, () => t.innerType._zod.optout),
          k(e._zod, `pattern`, () => {
            let e = t.innerType._zod.pattern;
            return e ? RegExp(`^(${Se(e.source)}|null)$`) : void 0;
          }),
          k(e._zod, `values`, () =>
            t.innerType._zod.values ? new Set([...t.innerType._zod.values, null]) : void 0,
          ),
          (e._zod.parse = (e, n) => (e.value === null ? e : t.innerType._zod.run(e, n))));
      })),
      (yr = T(`$ZodDefault`, (e, t) => {
        (W.init(e, t),
          (e._zod.optin = `optional`),
          k(e._zod, `values`, () => t.innerType._zod.values),
          (e._zod.parse = (e, n) => {
            if (n.direction === `backward`) return t.innerType._zod.run(e, n);
            if (e.value === void 0) return ((e.value = t.defaultValue), e);
            let r = t.innerType._zod.run(e, n);
            return r instanceof Promise ? r.then((e) => wn(e, t)) : wn(r, t);
          }));
      })),
      (br = T(`$ZodPrefault`, (e, t) => {
        (W.init(e, t),
          (e._zod.optin = `optional`),
          k(e._zod, `values`, () => t.innerType._zod.values),
          (e._zod.parse = (e, n) => (
            n.direction === `backward` || (e.value === void 0 && (e.value = t.defaultValue)),
            t.innerType._zod.run(e, n)
          )));
      })),
      (xr = T(`$ZodNonOptional`, (e, t) => {
        (W.init(e, t),
          k(e._zod, `values`, () => {
            let e = t.innerType._zod.values;
            return e ? new Set([...e].filter((e) => e !== void 0)) : void 0;
          }),
          (e._zod.parse = (n, r) => {
            let i = t.innerType._zod.run(n, r);
            return i instanceof Promise ? i.then((t) => Tn(t, e)) : Tn(i, e);
          }));
      })),
      (Sr = T(`$ZodCatch`, (e, t) => {
        (W.init(e, t),
          (e._zod.optin = `optional`),
          k(e._zod, `optout`, () => t.innerType._zod.optout),
          k(e._zod, `values`, () => t.innerType._zod.values),
          (e._zod.parse = (e, n) => {
            if (n.direction === `backward`) return t.innerType._zod.run(e, n);
            let r = t.innerType._zod.run(e, n);
            return r instanceof Promise
              ? r.then(
                  (r) => (
                    (e.value = r.value),
                    r.issues.length &&
                      ((e.value = t.catchValue({
                        ...e,
                        error: { issues: r.issues.map((e) => R(e, n, E())) },
                        input: e.value,
                      })),
                      (e.issues = []),
                      (e.fallback = !0)),
                    e
                  ),
                )
              : ((e.value = r.value),
                r.issues.length &&
                  ((e.value = t.catchValue({
                    ...e,
                    error: { issues: r.issues.map((e) => R(e, n, E())) },
                    input: e.value,
                  })),
                  (e.issues = []),
                  (e.fallback = !0)),
                e);
          }));
      })),
      (Cr = T(`$ZodPipe`, (e, t) => {
        (W.init(e, t),
          k(e._zod, `values`, () => t.in._zod.values),
          k(e._zod, `optin`, () => t.in._zod.optin),
          k(e._zod, `optout`, () => t.out._zod.optout),
          k(e._zod, `propValues`, () => t.in._zod.propValues),
          (e._zod.parse = (e, n) => {
            if (n.direction === `backward`) {
              let r = t.out._zod.run(e, n);
              return r instanceof Promise ? r.then((e) => En(e, t.in, n)) : En(r, t.in, n);
            }
            let r = t.in._zod.run(e, n);
            return r instanceof Promise ? r.then((e) => En(e, t.out, n)) : En(r, t.out, n);
          }));
      })),
      (wr = T(`$ZodPreprocess`, (e, t) => {
        Cr.init(e, t);
      })),
      (Tr = T(`$ZodReadonly`, (e, t) => {
        (W.init(e, t),
          k(e._zod, `propValues`, () => t.innerType._zod.propValues),
          k(e._zod, `values`, () => t.innerType._zod.values),
          k(e._zod, `optin`, () => t.innerType?._zod?.optin),
          k(e._zod, `optout`, () => t.innerType?._zod?.optout),
          (e._zod.parse = (e, n) => {
            if (n.direction === `backward`) return t.innerType._zod.run(e, n);
            let r = t.innerType._zod.run(e, n);
            return r instanceof Promise ? r.then(Dn) : Dn(r);
          }));
      })),
      (Er = T(`$ZodCustom`, (e, t) => {
        (U.init(e, t),
          W.init(e, t),
          (e._zod.parse = (e, t) => e),
          (e._zod.check = (n) => {
            let r = n.value,
              i = t.fn(r);
            if (i instanceof Promise) return i.then((t) => On(t, n, r, e));
            On(i, n, r, e);
          }));
      })));
  });
function Or() {
  return { localeError: kr() };
}
var kr,
  Ar = e(() => {
    (B(),
      (kr = () => {
        let e = {
          string: { unit: `characters`, verb: `to have` },
          file: { unit: `bytes`, verb: `to have` },
          array: { unit: `items`, verb: `to have` },
          set: { unit: `items`, verb: `to have` },
          map: { unit: `entries`, verb: `to have` },
        };
        function t(t) {
          return e[t] ?? null;
        }
        let n = {
            regex: `input`,
            email: `email address`,
            url: `URL`,
            emoji: `emoji`,
            uuid: `UUID`,
            uuidv4: `UUIDv4`,
            uuidv6: `UUIDv6`,
            nanoid: `nanoid`,
            guid: `GUID`,
            cuid: `cuid`,
            cuid2: `cuid2`,
            ulid: `ULID`,
            xid: `XID`,
            ksuid: `KSUID`,
            datetime: `ISO datetime`,
            date: `ISO date`,
            time: `ISO time`,
            duration: `ISO duration`,
            ipv4: `IPv4 address`,
            ipv6: `IPv6 address`,
            mac: `MAC address`,
            cidrv4: `IPv4 range`,
            cidrv6: `IPv6 range`,
            base64: `base64-encoded string`,
            base64url: `base64url-encoded string`,
            json_string: `JSON string`,
            e164: `E.164 number`,
            jwt: `JWT`,
            template_literal: `input`,
          },
          r = { nan: `NaN` };
        return (e) => {
          switch (e.code) {
            case `invalid_type`: {
              let t = r[e.expected] ?? e.expected,
                n = Be(e.input);
              return `Invalid input: expected ${t}, received ${r[n] ?? n}`;
            }
            case `invalid_value`:
              return e.values.length === 1
                ? `Invalid input: expected ${Oe(e.values[0])}`
                : `Invalid option: expected one of ${ve(e.values, `|`)}`;
            case `too_big`: {
              let n = e.inclusive ? `<=` : `<`,
                r = t(e.origin);
              return r
                ? `Too big: expected ${e.origin ?? `value`} to have ${n}${e.maximum.toString()} ${r.unit ?? `elements`}`
                : `Too big: expected ${e.origin ?? `value`} to be ${n}${e.maximum.toString()}`;
            }
            case `too_small`: {
              let n = e.inclusive ? `>=` : `>`,
                r = t(e.origin);
              return r
                ? `Too small: expected ${e.origin} to have ${n}${e.minimum.toString()} ${r.unit}`
                : `Too small: expected ${e.origin} to be ${n}${e.minimum.toString()}`;
            }
            case `invalid_format`: {
              let t = e;
              return t.format === `starts_with`
                ? `Invalid string: must start with "${t.prefix}"`
                : t.format === `ends_with`
                  ? `Invalid string: must end with "${t.suffix}"`
                  : t.format === `includes`
                    ? `Invalid string: must include "${t.includes}"`
                    : t.format === `regex`
                      ? `Invalid string: must match pattern ${t.pattern}`
                      : `Invalid ${n[t.format] ?? e.format}`;
            }
            case `not_multiple_of`:
              return `Invalid number: must be a multiple of ${e.divisor}`;
            case `unrecognized_keys`:
              return `Unrecognized key${e.keys.length > 1 ? `s` : ``}: ${ve(e.keys, `, `)}`;
            case `invalid_key`:
              return `Invalid key in ${e.origin}`;
            case `invalid_union`:
              return e.options && Array.isArray(e.options) && e.options.length > 0
                ? `Invalid discriminator value. Expected ${e.options.map((e) => `'${e}'`).join(` | `)}`
                : `Invalid input`;
            case `invalid_element`:
              return `Invalid value in ${e.origin}`;
            default:
              return `Invalid input`;
          }
        };
      }));
  });
function jr() {
  return new Nr();
}
var Mr,
  Nr,
  K,
  Pr = e(() => {
    ((Nr = class {
      constructor() {
        ((this._map = new WeakMap()), (this._idmap = new Map()));
      }
      add(e, ...t) {
        let n = t[0];
        return (
          this._map.set(e, n),
          n && typeof n == `object` && `id` in n && this._idmap.set(n.id, e),
          this
        );
      }
      clear() {
        return ((this._map = new WeakMap()), (this._idmap = new Map()), this);
      }
      remove(e) {
        let t = this._map.get(e);
        return (
          t && typeof t == `object` && `id` in t && this._idmap.delete(t.id),
          this._map.delete(e),
          this
        );
      }
      get(e) {
        let t = e._zod.parent;
        if (t) {
          let n = { ...(this.get(t) ?? {}) };
          delete n.id;
          let r = { ...n, ...this._map.get(e) };
          return Object.keys(r).length ? r : void 0;
        }
        return this._map.get(e);
      }
      has(e) {
        return this._map.has(e);
      }
    }),
      (Mr = globalThis).__zod_globalRegistry ?? (Mr.__zod_globalRegistry = jr()),
      (K = globalThis.__zod_globalRegistry));
  });
function Fr(e, t) {
  return new e({ type: `string`, ...F(t) });
}
function Ir(e, t) {
  return new e({ type: `string`, format: `email`, check: `string_format`, abort: !1, ...F(t) });
}
function Lr(e, t) {
  return new e({ type: `string`, format: `guid`, check: `string_format`, abort: !1, ...F(t) });
}
function Rr(e, t) {
  return new e({ type: `string`, format: `uuid`, check: `string_format`, abort: !1, ...F(t) });
}
function zr(e, t) {
  return new e({
    type: `string`,
    format: `uuid`,
    check: `string_format`,
    abort: !1,
    version: `v4`,
    ...F(t),
  });
}
function Br(e, t) {
  return new e({
    type: `string`,
    format: `uuid`,
    check: `string_format`,
    abort: !1,
    version: `v6`,
    ...F(t),
  });
}
function Vr(e, t) {
  return new e({
    type: `string`,
    format: `uuid`,
    check: `string_format`,
    abort: !1,
    version: `v7`,
    ...F(t),
  });
}
function Hr(e, t) {
  return new e({ type: `string`, format: `url`, check: `string_format`, abort: !1, ...F(t) });
}
function Ur(e, t) {
  return new e({ type: `string`, format: `emoji`, check: `string_format`, abort: !1, ...F(t) });
}
function Wr(e, t) {
  return new e({ type: `string`, format: `nanoid`, check: `string_format`, abort: !1, ...F(t) });
}
function Gr(e, t) {
  return new e({ type: `string`, format: `cuid`, check: `string_format`, abort: !1, ...F(t) });
}
function Kr(e, t) {
  return new e({ type: `string`, format: `cuid2`, check: `string_format`, abort: !1, ...F(t) });
}
function qr(e, t) {
  return new e({ type: `string`, format: `ulid`, check: `string_format`, abort: !1, ...F(t) });
}
function Jr(e, t) {
  return new e({ type: `string`, format: `xid`, check: `string_format`, abort: !1, ...F(t) });
}
function Yr(e, t) {
  return new e({ type: `string`, format: `ksuid`, check: `string_format`, abort: !1, ...F(t) });
}
function Xr(e, t) {
  return new e({ type: `string`, format: `ipv4`, check: `string_format`, abort: !1, ...F(t) });
}
function Zr(e, t) {
  return new e({ type: `string`, format: `ipv6`, check: `string_format`, abort: !1, ...F(t) });
}
function Qr(e, t) {
  return new e({ type: `string`, format: `cidrv4`, check: `string_format`, abort: !1, ...F(t) });
}
function $r(e, t) {
  return new e({ type: `string`, format: `cidrv6`, check: `string_format`, abort: !1, ...F(t) });
}
function ei(e, t) {
  return new e({ type: `string`, format: `base64`, check: `string_format`, abort: !1, ...F(t) });
}
function ti(e, t) {
  return new e({ type: `string`, format: `base64url`, check: `string_format`, abort: !1, ...F(t) });
}
function ni(e, t) {
  return new e({ type: `string`, format: `e164`, check: `string_format`, abort: !1, ...F(t) });
}
function ri(e, t) {
  return new e({ type: `string`, format: `jwt`, check: `string_format`, abort: !1, ...F(t) });
}
function ii(e, t) {
  return new e({
    type: `string`,
    format: `datetime`,
    check: `string_format`,
    offset: !1,
    local: !1,
    precision: null,
    ...F(t),
  });
}
function ai(e, t) {
  return new e({ type: `string`, format: `date`, check: `string_format`, ...F(t) });
}
function oi(e, t) {
  return new e({
    type: `string`,
    format: `time`,
    check: `string_format`,
    precision: null,
    ...F(t),
  });
}
function si(e, t) {
  return new e({ type: `string`, format: `duration`, check: `string_format`, ...F(t) });
}
function ci(e, t) {
  return new e({ type: `number`, checks: [], ...F(t) });
}
function li(e, t) {
  return new e({ type: `number`, check: `number_format`, abort: !1, format: `safeint`, ...F(t) });
}
function ui(e, t) {
  return new e({ type: `boolean`, ...F(t) });
}
function di(e, t) {
  return new e({ type: `undefined`, ...F(t) });
}
function fi(e, t) {
  return new e({ type: `null`, ...F(t) });
}
function pi(e) {
  return new e({ type: `unknown` });
}
function mi(e, t) {
  return new e({ type: `never`, ...F(t) });
}
function hi(e, t) {
  return new Kt({ check: `less_than`, ...F(t), value: e, inclusive: !1 });
}
function gi(e, t) {
  return new Kt({ check: `less_than`, ...F(t), value: e, inclusive: !0 });
}
function _i(e, t) {
  return new qt({ check: `greater_than`, ...F(t), value: e, inclusive: !1 });
}
function vi(e, t) {
  return new qt({ check: `greater_than`, ...F(t), value: e, inclusive: !0 });
}
function yi(e, t) {
  return new Jt({ check: `multiple_of`, ...F(t), value: e });
}
function bi(e, t) {
  return new Xt({ check: `max_length`, ...F(t), maximum: e });
}
function xi(e, t) {
  return new Zt({ check: `min_length`, ...F(t), minimum: e });
}
function Si(e, t) {
  return new Qt({ check: `length_equals`, ...F(t), length: e });
}
function Ci(e, t) {
  return new en({ check: `string_format`, format: `regex`, ...F(t), pattern: e });
}
function wi(e) {
  return new tn({ check: `string_format`, format: `lowercase`, ...F(e) });
}
function Ti(e) {
  return new nn({ check: `string_format`, format: `uppercase`, ...F(e) });
}
function Ei(e, t) {
  return new rn({ check: `string_format`, format: `includes`, ...F(t), includes: e });
}
function Di(e, t) {
  return new an({ check: `string_format`, format: `starts_with`, ...F(t), prefix: e });
}
function Oi(e, t) {
  return new on({ check: `string_format`, format: `ends_with`, ...F(t), suffix: e });
}
function q(e) {
  return new sn({ check: `overwrite`, tx: e });
}
function ki(e) {
  return q((t) => t.normalize(e));
}
function Ai() {
  return q((e) => e.trim());
}
function ji() {
  return q((e) => e.toLowerCase());
}
function Mi() {
  return q((e) => e.toUpperCase());
}
function Ni() {
  return q((e) => Te(e));
}
function Pi(e, t, n) {
  return new e({ type: `array`, element: t, ...F(n) });
}
function Fi(e, t, n) {
  let r = F(n);
  return ((r.abort ??= !0), new e({ type: `custom`, check: `custom`, fn: t, ...r }));
}
function Ii(e, t, n) {
  return new e({ type: `custom`, check: `custom`, fn: t, ...F(n) });
}
function Li(e, t) {
  let n = Ri(
    (t) => (
      (t.addIssue = (e) => {
        if (typeof e == `string`) t.issues.push(z(e, t.value, n._zod.def));
        else {
          let r = e;
          (r.fatal && (r.continue = !1),
            (r.code ??= `custom`),
            (r.input ??= t.value),
            (r.inst ??= n),
            (r.continue ??= !n._zod.def.abort),
            t.issues.push(z(r)));
        }
      }),
      e(t.value, t)
    ),
    t,
  );
  return n;
}
function Ri(e, t) {
  let n = new U({ check: `custom`, ...F(t) });
  return ((n._zod.check = e), n);
}
var zi = e(() => {
  (cn(), B());
});
function Bi(e) {
  let t = e?.target ?? `draft-2020-12`;
  return (
    t === `draft-4` && (t = `draft-04`),
    t === `draft-7` && (t = `draft-07`),
    {
      processors: e.processors ?? {},
      metadataRegistry: e?.metadata ?? K,
      target: t,
      unrepresentable: e?.unrepresentable ?? `throw`,
      override: e?.override ?? (() => {}),
      io: e?.io ?? `output`,
      counter: 0,
      seen: new Map(),
      cycles: e?.cycles ?? `ref`,
      reused: e?.reused ?? `inline`,
      external: e?.external ?? void 0,
    }
  );
}
function J(e, t, n = { path: [], schemaPath: [] }) {
  var r;
  let i = e._zod.def,
    a = t.seen.get(e);
  if (a) return (a.count++, n.schemaPath.includes(e) && (a.cycle = n.path), a.schema);
  let o = { schema: {}, count: 1, cycle: void 0, path: n.path };
  t.seen.set(e, o);
  let s = e._zod.toJSONSchema?.();
  if (s) o.schema = s;
  else {
    let r = { ...n, schemaPath: [...n.schemaPath, e], path: n.path };
    if (e._zod.processJSONSchema) e._zod.processJSONSchema(t, o.schema, r);
    else {
      let n = o.schema,
        a = t.processors[i.type];
      if (!a) throw Error(`[toJSONSchema]: Non-representable type encountered: ${i.type}`);
      a(e, t, n, r);
    }
    let a = e._zod.parent;
    a && ((o.ref ||= a), J(a, t, r), (t.seen.get(a).isParent = !0));
  }
  let c = t.metadataRegistry.get(e);
  return (
    c && Object.assign(o.schema, c),
    t.io === `input` && Y(e) && (delete o.schema.examples, delete o.schema.default),
    t.io === `input` &&
      `_prefault` in o.schema &&
      ((r = o.schema).default ?? (r.default = o.schema._prefault)),
    delete o.schema._prefault,
    t.seen.get(e).schema
  );
}
function Vi(e, t) {
  let n = e.seen.get(t);
  if (!n) throw Error(`Unprocessed schema. This is a bug in Zod.`);
  let r = new Map();
  for (let t of e.seen.entries()) {
    let n = e.metadataRegistry.get(t[0])?.id;
    if (n) {
      let e = r.get(n);
      if (e && e !== t[0])
        throw Error(
          `Duplicate schema id "${n}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`,
        );
      r.set(n, t[0]);
    }
  }
  let i = (t) => {
      let r = e.target === `draft-2020-12` ? `$defs` : `definitions`;
      if (e.external) {
        let n = e.external.registry.get(t[0])?.id,
          i = e.external.uri ?? ((e) => e);
        if (n) return { ref: i(n) };
        let a = t[1].defId ?? t[1].schema.id ?? `schema${e.counter++}`;
        return ((t[1].defId = a), { defId: a, ref: `${i(`__shared`)}#/${r}/${a}` });
      }
      if (t[1] === n) return { ref: `#` };
      let i = `#/${r}/`,
        a = t[1].schema.id ?? `__schema${e.counter++}`;
      return { defId: a, ref: i + a };
    },
    a = (e) => {
      if (e[1].schema.$ref) return;
      let t = e[1],
        { ref: n, defId: r } = i(e);
      ((t.def = { ...t.schema }), r && (t.defId = r));
      let a = t.schema;
      for (let e in a) delete a[e];
      a.$ref = n;
    };
  if (e.cycles === `throw`)
    for (let t of e.seen.entries()) {
      let e = t[1];
      if (e.cycle)
        throw Error(`Cycle detected: #/${e.cycle?.join(`/`)}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
    }
  for (let n of e.seen.entries()) {
    let r = n[1];
    if (t === n[0]) {
      a(n);
      continue;
    }
    if (e.external) {
      let r = e.external.registry.get(n[0])?.id;
      if (t !== n[0] && r) {
        a(n);
        continue;
      }
    }
    if (e.metadataRegistry.get(n[0])?.id) {
      a(n);
      continue;
    }
    if (r.cycle) {
      a(n);
      continue;
    }
    if (r.count > 1 && e.reused === `ref`) {
      a(n);
      continue;
    }
  }
}
function Hi(e, t) {
  let n = e.seen.get(t);
  if (!n) throw Error(`Unprocessed schema. This is a bug in Zod.`);
  let r = (t) => {
    let n = e.seen.get(t);
    if (n.ref === null) return;
    let i = n.def ?? n.schema,
      a = { ...i },
      o = n.ref;
    if (((n.ref = null), o)) {
      r(o);
      let n = e.seen.get(o),
        s = n.schema;
      if (
        (s.$ref &&
        (e.target === `draft-07` || e.target === `draft-04` || e.target === `openapi-3.0`)
          ? ((i.allOf = i.allOf ?? []), i.allOf.push(s))
          : Object.assign(i, s),
        Object.assign(i, a),
        t._zod.parent === o)
      )
        for (let e in i) e === `$ref` || e === `allOf` || e in a || delete i[e];
      if (s.$ref && n.def)
        for (let e in i)
          e === `$ref` ||
            e === `allOf` ||
            (e in n.def && JSON.stringify(i[e]) === JSON.stringify(n.def[e]) && delete i[e]);
    }
    let s = t._zod.parent;
    if (s && s !== o) {
      r(s);
      let t = e.seen.get(s);
      if (t?.schema.$ref && ((i.$ref = t.schema.$ref), t.def))
        for (let e in i)
          e === `$ref` ||
            e === `allOf` ||
            (e in t.def && JSON.stringify(i[e]) === JSON.stringify(t.def[e]) && delete i[e]);
    }
    e.override({ zodSchema: t, jsonSchema: i, path: n.path ?? [] });
  };
  for (let t of [...e.seen.entries()].reverse()) r(t[0]);
  let i = {};
  if (
    (e.target === `draft-2020-12`
      ? (i.$schema = `https://json-schema.org/draft/2020-12/schema`)
      : e.target === `draft-07`
        ? (i.$schema = `http://json-schema.org/draft-07/schema#`)
        : e.target === `draft-04`
          ? (i.$schema = `http://json-schema.org/draft-04/schema#`)
          : e.target,
    e.external?.uri)
  ) {
    let n = e.external.registry.get(t)?.id;
    if (!n) throw Error("Schema is missing an `id` property");
    i.$id = e.external.uri(n);
  }
  Object.assign(i, n.def ?? n.schema);
  let a = e.metadataRegistry.get(t)?.id;
  a !== void 0 && i.id === a && delete i.id;
  let o = e.external?.defs ?? {};
  for (let t of e.seen.entries()) {
    let e = t[1];
    e.def && e.defId && (e.def.id === e.defId && delete e.def.id, (o[e.defId] = e.def));
  }
  e.external ||
    (Object.keys(o).length > 0 &&
      (e.target === `draft-2020-12` ? (i.$defs = o) : (i.definitions = o)));
  try {
    let n = JSON.parse(JSON.stringify(i));
    return (
      Object.defineProperty(n, "~standard", {
        value: {
          ...t[`~standard`],
          jsonSchema: {
            input: Wi(t, `input`, e.processors),
            output: Wi(t, `output`, e.processors),
          },
        },
        enumerable: !1,
        writable: !1,
      }),
      n
    );
  } catch {
    throw Error(`Error converting schema to JSON.`);
  }
}
function Y(e, t) {
  let n = t ?? { seen: new Set() };
  if (n.seen.has(e)) return !1;
  n.seen.add(e);
  let r = e._zod.def;
  if (r.type === `transform`) return !0;
  if (r.type === `array`) return Y(r.element, n);
  if (r.type === `set`) return Y(r.valueType, n);
  if (r.type === `lazy`) return Y(r.getter(), n);
  if (
    r.type === `promise` ||
    r.type === `optional` ||
    r.type === `nonoptional` ||
    r.type === `nullable` ||
    r.type === `readonly` ||
    r.type === "default" ||
    r.type === `prefault`
  )
    return Y(r.innerType, n);
  if (r.type === `intersection`) return Y(r.left, n) || Y(r.right, n);
  if (r.type === `record` || r.type === `map`) return Y(r.keyType, n) || Y(r.valueType, n);
  if (r.type === `pipe`) return e._zod.traits.has(`$ZodCodec`) ? !0 : Y(r.in, n) || Y(r.out, n);
  if (r.type === `object`) {
    for (let e in r.shape) if (Y(r.shape[e], n)) return !0;
    return !1;
  }
  if (r.type === `union`) {
    for (let e of r.options) if (Y(e, n)) return !0;
    return !1;
  }
  if (r.type === `tuple`) {
    for (let e of r.items) if (Y(e, n)) return !0;
    return !!(r.rest && Y(r.rest, n));
  }
  return !1;
}
var Ui,
  Wi,
  Gi = e(() => {
    (Pr(),
      (Ui =
        (e, t = {}) =>
        (n) => {
          let r = Bi({ ...n, processors: t });
          return (J(e, r), Vi(r, e), Hi(r, e));
        }),
      (Wi =
        (e, t, n = {}) =>
        (r) => {
          let { libraryOptions: i, target: a } = r ?? {},
            o = Bi({ ...(i ?? {}), target: a, io: t, processors: n });
          return (J(e, o), Vi(o, e), Hi(o, e));
        }));
  }),
  Ki,
  qi,
  Ji,
  Yi,
  Xi,
  Zi,
  Qi,
  $i,
  ea,
  ta,
  na,
  ra,
  ia,
  aa,
  oa,
  sa,
  ca,
  la,
  ua,
  da,
  fa,
  pa,
  ma,
  ha,
  ga,
  _a = e(() => {
    (Gi(),
      B(),
      (Ki = {
        guid: `uuid`,
        url: `uri`,
        datetime: `date-time`,
        json_string: `json-string`,
        regex: ``,
      }),
      (qi = (e, t, n, r) => {
        let i = n;
        i.type = `string`;
        let { minimum: a, maximum: o, format: s, patterns: c, contentEncoding: l } = e._zod.bag;
        if (
          (typeof a == `number` && (i.minLength = a),
          typeof o == `number` && (i.maxLength = o),
          s &&
            ((i.format = Ki[s] ?? s),
            i.format === `` && delete i.format,
            s === `time` && delete i.format),
          l && (i.contentEncoding = l),
          c && c.size > 0)
        ) {
          let e = [...c];
          e.length === 1
            ? (i.pattern = e[0].source)
            : e.length > 1 &&
              (i.allOf = [
                ...e.map((e) => ({
                  ...(t.target === `draft-07` ||
                  t.target === `draft-04` ||
                  t.target === `openapi-3.0`
                    ? { type: `string` }
                    : {}),
                  pattern: e.source,
                })),
              ]);
        }
      }),
      (Ji = (e, t, n, r) => {
        let i = n,
          {
            minimum: a,
            maximum: o,
            format: s,
            multipleOf: c,
            exclusiveMaximum: l,
            exclusiveMinimum: u,
          } = e._zod.bag;
        typeof s == `string` && s.includes(`int`) ? (i.type = `integer`) : (i.type = `number`);
        let d = typeof u == `number` && u >= (a ?? -1 / 0),
          f = typeof l == `number` && l <= (o ?? 1 / 0),
          p = t.target === `draft-04` || t.target === `openapi-3.0`;
        (d
          ? p
            ? ((i.minimum = u), (i.exclusiveMinimum = !0))
            : (i.exclusiveMinimum = u)
          : typeof a == `number` && (i.minimum = a),
          f
            ? p
              ? ((i.maximum = l), (i.exclusiveMaximum = !0))
              : (i.exclusiveMaximum = l)
            : typeof o == `number` && (i.maximum = o),
          typeof c == `number` && (i.multipleOf = c));
      }),
      (Yi = (e, t, n, r) => {
        n.type = `boolean`;
      }),
      (Xi = (e, t, n, r) => {
        t.target === `openapi-3.0`
          ? ((n.type = `string`), (n.nullable = !0), (n.enum = [null]))
          : (n.type = `null`);
      }),
      (Zi = (e, t, n, r) => {
        if (t.unrepresentable === `throw`)
          throw Error(`Undefined cannot be represented in JSON Schema`);
      }),
      (Qi = (e, t, n, r) => {
        n.not = {};
      }),
      ($i = (e, t, n, r) => {}),
      (ea = (e, t, n, r) => {
        let i = e._zod.def,
          a = _e(i.entries);
        (a.every((e) => typeof e == `number`) && (n.type = `number`),
          a.every((e) => typeof e == `string`) && (n.type = `string`),
          (n.enum = a));
      }),
      (ta = (e, t, n, r) => {
        let i = e._zod.def,
          a = [];
        for (let e of i.values)
          if (e === void 0) {
            if (t.unrepresentable === `throw`)
              throw Error("Literal `undefined` cannot be represented in JSON Schema");
          } else if (typeof e == `bigint`) {
            if (t.unrepresentable === `throw`)
              throw Error(`BigInt literals cannot be represented in JSON Schema`);
            a.push(Number(e));
          } else a.push(e);
        if (a.length !== 0)
          if (a.length === 1) {
            let e = a[0];
            ((n.type = e === null ? `null` : typeof e),
              t.target === `draft-04` || t.target === `openapi-3.0`
                ? (n.enum = [e])
                : (n.const = e));
          } else
            (a.every((e) => typeof e == `number`) && (n.type = `number`),
              a.every((e) => typeof e == `string`) && (n.type = `string`),
              a.every((e) => typeof e == `boolean`) && (n.type = `boolean`),
              a.every((e) => e === null) && (n.type = `null`),
              (n.enum = a));
      }),
      (na = (e, t, n, r) => {
        if (t.unrepresentable === `throw`)
          throw Error(`Custom types cannot be represented in JSON Schema`);
      }),
      (ra = (e, t, n, r) => {
        if (t.unrepresentable === `throw`)
          throw Error(`Transforms cannot be represented in JSON Schema`);
      }),
      (ia = (e, t, n, r) => {
        let i = n,
          a = e._zod.def,
          { minimum: o, maximum: s } = e._zod.bag;
        (typeof o == `number` && (i.minItems = o),
          typeof s == `number` && (i.maxItems = s),
          (i.type = `array`),
          (i.items = J(a.element, t, { ...r, path: [...r.path, `items`] })));
      }),
      (aa = (e, t, n, r) => {
        let i = n,
          a = e._zod.def;
        ((i.type = `object`), (i.properties = {}));
        let o = a.shape;
        for (let e in o) i.properties[e] = J(o[e], t, { ...r, path: [...r.path, `properties`, e] });
        let s = new Set(Object.keys(o)),
          c = new Set(
            [...s].filter((e) => {
              let n = a.shape[e]._zod;
              return t.io === `input` ? n.optin === void 0 : n.optout === void 0;
            }),
          );
        (c.size > 0 && (i.required = Array.from(c)),
          a.catchall?._zod.def.type === `never`
            ? (i.additionalProperties = !1)
            : a.catchall
              ? a.catchall &&
                (i.additionalProperties = J(a.catchall, t, {
                  ...r,
                  path: [...r.path, `additionalProperties`],
                }))
              : t.io === `output` && (i.additionalProperties = !1));
      }),
      (oa = (e, t, n, r) => {
        let i = e._zod.def,
          a = i.inclusive === !1,
          o = i.options.map((e, n) =>
            J(e, t, { ...r, path: [...r.path, a ? `oneOf` : `anyOf`, n] }),
          );
        a ? (n.oneOf = o) : (n.anyOf = o);
      }),
      (sa = (e, t, n, r) => {
        let i = e._zod.def,
          a = J(i.left, t, { ...r, path: [...r.path, `allOf`, 0] }),
          o = J(i.right, t, { ...r, path: [...r.path, `allOf`, 1] }),
          s = (e) => `allOf` in e && Object.keys(e).length === 1;
        n.allOf = [...(s(a) ? a.allOf : [a]), ...(s(o) ? o.allOf : [o])];
      }),
      (ca = (e, t, n, r) => {
        let i = n,
          a = e._zod.def;
        i.type = `object`;
        let o = a.keyType,
          s = o._zod.bag?.patterns;
        if (a.mode === `loose` && s && s.size > 0) {
          let e = J(a.valueType, t, { ...r, path: [...r.path, `patternProperties`, `*`] });
          i.patternProperties = {};
          for (let t of s) i.patternProperties[t.source] = e;
        } else
          ((t.target === `draft-07` || t.target === `draft-2020-12`) &&
            (i.propertyNames = J(a.keyType, t, { ...r, path: [...r.path, `propertyNames`] })),
            (i.additionalProperties = J(a.valueType, t, {
              ...r,
              path: [...r.path, `additionalProperties`],
            })));
        let c = o._zod.values;
        if (c) {
          let e = [...c].filter((e) => typeof e == `string` || typeof e == `number`);
          e.length > 0 && (i.required = e);
        }
      }),
      (la = (e, t, n, r) => {
        let i = e._zod.def,
          a = J(i.innerType, t, r),
          o = t.seen.get(e);
        t.target === `openapi-3.0`
          ? ((o.ref = i.innerType), (n.nullable = !0))
          : (n.anyOf = [a, { type: `null` }]);
      }),
      (ua = (e, t, n, r) => {
        let i = e._zod.def;
        J(i.innerType, t, r);
        let a = t.seen.get(e);
        a.ref = i.innerType;
      }),
      (da = (e, t, n, r) => {
        let i = e._zod.def;
        J(i.innerType, t, r);
        let a = t.seen.get(e);
        ((a.ref = i.innerType), (n.default = JSON.parse(JSON.stringify(i.defaultValue))));
      }),
      (fa = (e, t, n, r) => {
        let i = e._zod.def;
        J(i.innerType, t, r);
        let a = t.seen.get(e);
        ((a.ref = i.innerType),
          t.io === `input` && (n._prefault = JSON.parse(JSON.stringify(i.defaultValue))));
      }),
      (pa = (e, t, n, r) => {
        let i = e._zod.def;
        J(i.innerType, t, r);
        let a = t.seen.get(e);
        a.ref = i.innerType;
        let o;
        try {
          o = i.catchValue(void 0);
        } catch {
          throw Error(`Dynamic catch values are not supported in JSON Schema`);
        }
        n.default = o;
      }),
      (ma = (e, t, n, r) => {
        let i = e._zod.def,
          a = i.in._zod.traits.has(`$ZodTransform`),
          o = t.io === `input` ? (a ? i.out : i.in) : i.out;
        J(o, t, r);
        let s = t.seen.get(e);
        s.ref = o;
      }),
      (ha = (e, t, n, r) => {
        let i = e._zod.def;
        J(i.innerType, t, r);
        let a = t.seen.get(e);
        ((a.ref = i.innerType), (n.readOnly = !0));
      }),
      (ga = (e, t, n, r) => {
        let i = e._zod.def;
        J(i.innerType, t, r);
        let a = t.seen.get(e);
        a.ref = i.innerType;
      }));
  }),
  X = e(() => {
    (O(), ut(), Ze(), Dr(), cn(), fn(), B(), Wt(), Ar(), Pr(), un(), zi(), Gi(), _a(), Gi());
  }),
  va = e(() => {
    X();
  });
function ya(e) {
  return ii(Ca, e);
}
function ba(e) {
  return ai(wa, e);
}
function xa(e) {
  return oi(Ta, e);
}
function Sa(e) {
  return si(Ea, e);
}
var Ca,
  wa,
  Ta,
  Ea,
  Da = e(() => {
    (X(),
      _s(),
      (Ca = T(`ZodISODateTime`, (e, t) => {
        (Vn.init(e, t), $.init(e, t));
      })),
      (wa = T(`ZodISODate`, (e, t) => {
        (Hn.init(e, t), $.init(e, t));
      })),
      (Ta = T(`ZodISOTime`, (e, t) => {
        (Un.init(e, t), $.init(e, t));
      })),
      (Ea = T(`ZodISODuration`, (e, t) => {
        (Wn.init(e, t), $.init(e, t));
      })));
  }),
  Oa,
  Z,
  ka = e(() => {
    (X(),
      B(),
      (Oa = (e, t) => {
        (Ye.init(e, t),
          (e.name = `ZodError`),
          Object.defineProperties(e, {
            format: { value: (t) => qe(e, t) },
            flatten: { value: (t) => Ke(e, t) },
            addIssue: {
              value: (t) => {
                (e.issues.push(t), (e.message = JSON.stringify(e.issues, ye, 2)));
              },
            },
            addIssues: {
              value: (t) => {
                (e.issues.push(...t), (e.message = JSON.stringify(e.issues, ye, 2)));
              },
            },
            isEmpty: {
              get() {
                return e.issues.length === 0;
              },
            },
          }));
      }),
      (Z = T(`ZodError`, Oa, { Parent: Error })));
  }),
  Aa,
  ja,
  Ma,
  Na,
  Pa,
  Fa,
  Ia,
  La,
  Ra,
  za,
  Ba,
  Va,
  Ha = e(() => {
    (X(),
      ka(),
      (Aa = Qe(Z)),
      (ja = $e(Z)),
      (Ma = V(Z)),
      (Na = H(Z)),
      (Pa = nt(Z)),
      (Fa = rt(Z)),
      (Ia = it(Z)),
      (La = at(Z)),
      (Ra = ot(Z)),
      (za = st(Z)),
      (Ba = ct(Z)),
      (Va = lt(Z)));
  });
function Ua(e, t, n) {
  let r = Object.getPrototypeOf(e),
    i = So.get(r);
  if ((i || ((i = new Set()), So.set(r, i)), !i.has(t))) {
    i.add(t);
    for (let e in n) {
      let t = n[e];
      Object.defineProperty(r, e, {
        configurable: !0,
        enumerable: !1,
        get() {
          let n = t.bind(this);
          return (
            Object.defineProperty(this, e, {
              configurable: !0,
              writable: !0,
              enumerable: !0,
              value: n,
            }),
            n
          );
        },
        set(t) {
          Object.defineProperty(this, e, {
            configurable: !0,
            writable: !0,
            enumerable: !0,
            value: t,
          });
        },
      });
    }
  }
}
function Wa(e) {
  return Fr(wo, e);
}
function Ga(e) {
  return ci(Wo, e);
}
function Ka(e) {
  return li(Go, e);
}
function qa(e) {
  return ui(Ko, e);
}
function Ja(e) {
  return di(qo, e);
}
function Ya(e) {
  return fi(Jo, e);
}
function Xa() {
  return pi(Yo);
}
function Za(e) {
  return mi(Xo, e);
}
function Qa(e, t) {
  return Pi(Zo, e, t);
}
function $a(e, t) {
  let n = { type: `object`, shape: e ?? {}, ...F(t) };
  return new Qo(n);
}
function eo(e, t) {
  return new Qo({ type: `object`, shape: e, catchall: Xa(), ...F(t) });
}
function to(e, t) {
  return new $o({ type: `union`, options: e, ...F(t) });
}
function no(e, t, n) {
  return new es({ type: `union`, options: t, discriminator: e, ...F(n) });
}
function ro(e, t) {
  return new ts({ type: `intersection`, left: e, right: t });
}
function io(e, t, n) {
  return !t || !t._zod
    ? new ns({ type: `record`, keyType: Wa(), valueType: e, ...F(t) })
    : new ns({ type: `record`, keyType: e, valueType: t, ...F(n) });
}
function ao(e, t) {
  let n = Array.isArray(e) ? Object.fromEntries(e.map((e) => [e, e])) : e;
  return new rs({ type: `enum`, entries: n, ...F(t) });
}
function oo(e, t) {
  return new is({ type: `literal`, values: Array.isArray(e) ? e : [e], ...F(t) });
}
function so(e) {
  return new as({ type: `transform`, transform: e });
}
function co(e) {
  return new os({ type: `optional`, innerType: e });
}
function lo(e) {
  return new ss({ type: `optional`, innerType: e });
}
function uo(e) {
  return new cs({ type: `nullable`, innerType: e });
}
function fo(e, t) {
  return new ls({
    type: `default`,
    innerType: e,
    get defaultValue() {
      return typeof t == `function` ? t() : De(t);
    },
  });
}
function po(e, t) {
  return new us({
    type: `prefault`,
    innerType: e,
    get defaultValue() {
      return typeof t == `function` ? t() : De(t);
    },
  });
}
function mo(e, t) {
  return new ds({ type: `nonoptional`, innerType: e, ...F(t) });
}
function ho(e, t) {
  return new fs({ type: `catch`, innerType: e, catchValue: typeof t == `function` ? t : () => t });
}
function go(e, t) {
  return new ps({ type: `pipe`, in: e, out: t });
}
function _o(e) {
  return new hs({ type: `readonly`, innerType: e });
}
function vo(e, t) {
  return Fi(gs, e ?? (() => !0), t);
}
function yo(e, t = {}) {
  return Ii(gs, e, t);
}
function bo(e, t) {
  return Li(e, t);
}
function xo(e, t) {
  return new ms({ type: `pipe`, in: so(e), out: t });
}
var So,
  Q,
  Co,
  wo,
  $,
  To,
  Eo,
  Do,
  Oo,
  ko,
  Ao,
  jo,
  Mo,
  No,
  Po,
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
  as,
  os,
  ss,
  cs,
  ls,
  us,
  ds,
  fs,
  ps,
  ms,
  hs,
  gs,
  _s = e(() => {
    (X(),
      _a(),
      Gi(),
      va(),
      Da(),
      Ha(),
      (So = new WeakMap()),
      (Q = T(
        `ZodType`,
        (e, t) => (
          W.init(e, t),
          Object.assign(e[`~standard`], {
            jsonSchema: { input: Wi(e, `input`), output: Wi(e, `output`) },
          }),
          (e.toJSONSchema = Ui(e, {})),
          (e.def = t),
          (e.type = t.type),
          Object.defineProperty(e, "_def", { value: t }),
          (e.parse = (t, n) => Aa(e, t, n, { callee: e.parse })),
          (e.safeParse = (t, n) => Ma(e, t, n)),
          (e.parseAsync = async (t, n) => ja(e, t, n, { callee: e.parseAsync })),
          (e.safeParseAsync = async (t, n) => Na(e, t, n)),
          (e.spa = e.safeParseAsync),
          (e.encode = (t, n) => Pa(e, t, n)),
          (e.decode = (t, n) => Fa(e, t, n)),
          (e.encodeAsync = async (t, n) => Ia(e, t, n)),
          (e.decodeAsync = async (t, n) => La(e, t, n)),
          (e.safeEncode = (t, n) => Ra(e, t, n)),
          (e.safeDecode = (t, n) => za(e, t, n)),
          (e.safeEncodeAsync = async (t, n) => Ba(e, t, n)),
          (e.safeDecodeAsync = async (t, n) => Va(e, t, n)),
          Ua(e, `ZodType`, {
            check(...e) {
              let t = this.def;
              return this.clone(
                j(t, {
                  checks: [
                    ...(t.checks ?? []),
                    ...e.map((e) =>
                      typeof e == `function`
                        ? { _zod: { check: e, def: { check: `custom` }, onattach: [] } }
                        : e,
                    ),
                  ],
                }),
                { parent: !0 },
              );
            },
            with(...e) {
              return this.check(...e);
            },
            clone(e, t) {
              return P(this, e, t);
            },
            brand() {
              return this;
            },
            register(e, t) {
              return (e.add(this, t), this);
            },
            refine(e, t) {
              return this.check(yo(e, t));
            },
            superRefine(e, t) {
              return this.check(bo(e, t));
            },
            overwrite(e) {
              return this.check(q(e));
            },
            optional() {
              return co(this);
            },
            exactOptional() {
              return lo(this);
            },
            nullable() {
              return uo(this);
            },
            nullish() {
              return co(uo(this));
            },
            nonoptional(e) {
              return mo(this, e);
            },
            array() {
              return Qa(this);
            },
            or(e) {
              return to([this, e]);
            },
            and(e) {
              return ro(this, e);
            },
            transform(e) {
              return go(this, so(e));
            },
            default(e) {
              return fo(this, e);
            },
            prefault(e) {
              return po(this, e);
            },
            catch(e) {
              return ho(this, e);
            },
            pipe(e) {
              return go(this, e);
            },
            readonly() {
              return _o(this);
            },
            describe(e) {
              let t = this.clone();
              return (K.add(t, { description: e }), t);
            },
            meta(...e) {
              if (e.length === 0) return K.get(this);
              let t = this.clone();
              return (K.add(t, e[0]), t);
            },
            isOptional() {
              return this.safeParse(void 0).success;
            },
            isNullable() {
              return this.safeParse(null).success;
            },
            apply(e) {
              return e(this);
            },
          }),
          Object.defineProperty(e, "description", {
            get() {
              return K.get(e)?.description;
            },
            configurable: !0,
          }),
          e
        ),
      )),
      (Co = T(`_ZodString`, (e, t) => {
        (kn.init(e, t), Q.init(e, t), (e._zod.processJSONSchema = (t, n, r) => qi(e, t, n, r)));
        let n = e._zod.bag;
        ((e.format = n.format ?? null),
          (e.minLength = n.minimum ?? null),
          (e.maxLength = n.maximum ?? null),
          Ua(e, `_ZodString`, {
            regex(...e) {
              return this.check(Ci(...e));
            },
            includes(...e) {
              return this.check(Ei(...e));
            },
            startsWith(...e) {
              return this.check(Di(...e));
            },
            endsWith(...e) {
              return this.check(Oi(...e));
            },
            min(...e) {
              return this.check(xi(...e));
            },
            max(...e) {
              return this.check(bi(...e));
            },
            length(...e) {
              return this.check(Si(...e));
            },
            nonempty(...e) {
              return this.check(xi(1, ...e));
            },
            lowercase(e) {
              return this.check(wi(e));
            },
            uppercase(e) {
              return this.check(Ti(e));
            },
            trim() {
              return this.check(Ai());
            },
            normalize(...e) {
              return this.check(ki(...e));
            },
            toLowerCase() {
              return this.check(ji());
            },
            toUpperCase() {
              return this.check(Mi());
            },
            slugify() {
              return this.check(Ni());
            },
          }));
      })),
      (wo = T(`ZodString`, (e, t) => {
        (kn.init(e, t),
          Co.init(e, t),
          (e.email = (t) => e.check(Ir(To, t))),
          (e.url = (t) => e.check(Hr(Oo, t))),
          (e.jwt = (t) => e.check(ri(Uo, t))),
          (e.emoji = (t) => e.check(Ur(ko, t))),
          (e.guid = (t) => e.check(Lr(Eo, t))),
          (e.uuid = (t) => e.check(Rr(Do, t))),
          (e.uuidv4 = (t) => e.check(zr(Do, t))),
          (e.uuidv6 = (t) => e.check(Br(Do, t))),
          (e.uuidv7 = (t) => e.check(Vr(Do, t))),
          (e.nanoid = (t) => e.check(Wr(Ao, t))),
          (e.guid = (t) => e.check(Lr(Eo, t))),
          (e.cuid = (t) => e.check(Gr(jo, t))),
          (e.cuid2 = (t) => e.check(Kr(Mo, t))),
          (e.ulid = (t) => e.check(qr(No, t))),
          (e.base64 = (t) => e.check(ei(Bo, t))),
          (e.base64url = (t) => e.check(ti(Vo, t))),
          (e.xid = (t) => e.check(Jr(Po, t))),
          (e.ksuid = (t) => e.check(Yr(Fo, t))),
          (e.ipv4 = (t) => e.check(Xr(Io, t))),
          (e.ipv6 = (t) => e.check(Zr(Lo, t))),
          (e.cidrv4 = (t) => e.check(Qr(Ro, t))),
          (e.cidrv6 = (t) => e.check($r(zo, t))),
          (e.e164 = (t) => e.check(ni(Ho, t))),
          (e.datetime = (t) => e.check(ya(t))),
          (e.date = (t) => e.check(ba(t))),
          (e.time = (t) => e.check(xa(t))),
          (e.duration = (t) => e.check(Sa(t))));
      })),
      ($ = T(`ZodStringFormat`, (e, t) => {
        (G.init(e, t), Co.init(e, t));
      })),
      (To = T(`ZodEmail`, (e, t) => {
        (Mn.init(e, t), $.init(e, t));
      })),
      (Eo = T(`ZodGUID`, (e, t) => {
        (An.init(e, t), $.init(e, t));
      })),
      (Do = T(`ZodUUID`, (e, t) => {
        (jn.init(e, t), $.init(e, t));
      })),
      (Oo = T(`ZodURL`, (e, t) => {
        (Nn.init(e, t), $.init(e, t));
      })),
      (ko = T(`ZodEmoji`, (e, t) => {
        (Pn.init(e, t), $.init(e, t));
      })),
      (Ao = T(`ZodNanoID`, (e, t) => {
        (Fn.init(e, t), $.init(e, t));
      })),
      (jo = T(`ZodCUID`, (e, t) => {
        (In.init(e, t), $.init(e, t));
      })),
      (Mo = T(`ZodCUID2`, (e, t) => {
        (Ln.init(e, t), $.init(e, t));
      })),
      (No = T(`ZodULID`, (e, t) => {
        (Rn.init(e, t), $.init(e, t));
      })),
      (Po = T(`ZodXID`, (e, t) => {
        (zn.init(e, t), $.init(e, t));
      })),
      (Fo = T(`ZodKSUID`, (e, t) => {
        (Bn.init(e, t), $.init(e, t));
      })),
      (Io = T(`ZodIPv4`, (e, t) => {
        (Gn.init(e, t), $.init(e, t));
      })),
      (Lo = T(`ZodIPv6`, (e, t) => {
        (Kn.init(e, t), $.init(e, t));
      })),
      (Ro = T(`ZodCIDRv4`, (e, t) => {
        (qn.init(e, t), $.init(e, t));
      })),
      (zo = T(`ZodCIDRv6`, (e, t) => {
        (Jn.init(e, t), $.init(e, t));
      })),
      (Bo = T(`ZodBase64`, (e, t) => {
        (Yn.init(e, t), $.init(e, t));
      })),
      (Vo = T(`ZodBase64URL`, (e, t) => {
        (Xn.init(e, t), $.init(e, t));
      })),
      (Ho = T(`ZodE164`, (e, t) => {
        (Zn.init(e, t), $.init(e, t));
      })),
      (Uo = T(`ZodJWT`, (e, t) => {
        (Qn.init(e, t), $.init(e, t));
      })),
      (Wo = T(`ZodNumber`, (e, t) => {
        ($n.init(e, t),
          Q.init(e, t),
          (e._zod.processJSONSchema = (t, n, r) => Ji(e, t, n, r)),
          Ua(e, `ZodNumber`, {
            gt(e, t) {
              return this.check(_i(e, t));
            },
            gte(e, t) {
              return this.check(vi(e, t));
            },
            min(e, t) {
              return this.check(vi(e, t));
            },
            lt(e, t) {
              return this.check(hi(e, t));
            },
            lte(e, t) {
              return this.check(gi(e, t));
            },
            max(e, t) {
              return this.check(gi(e, t));
            },
            int(e) {
              return this.check(Ka(e));
            },
            safe(e) {
              return this.check(Ka(e));
            },
            positive(e) {
              return this.check(_i(0, e));
            },
            nonnegative(e) {
              return this.check(vi(0, e));
            },
            negative(e) {
              return this.check(hi(0, e));
            },
            nonpositive(e) {
              return this.check(gi(0, e));
            },
            multipleOf(e, t) {
              return this.check(yi(e, t));
            },
            step(e, t) {
              return this.check(yi(e, t));
            },
            finite() {
              return this;
            },
          }));
        let n = e._zod.bag;
        ((e.minValue = Math.max(n.minimum ?? -1 / 0, n.exclusiveMinimum ?? -1 / 0) ?? null),
          (e.maxValue = Math.min(n.maximum ?? 1 / 0, n.exclusiveMaximum ?? 1 / 0) ?? null),
          (e.isInt = (n.format ?? ``).includes(`int`) || Number.isSafeInteger(n.multipleOf ?? 0.5)),
          (e.isFinite = !0),
          (e.format = n.format ?? null));
      })),
      (Go = T(`ZodNumberFormat`, (e, t) => {
        (er.init(e, t), Wo.init(e, t));
      })),
      (Ko = T(`ZodBoolean`, (e, t) => {
        (tr.init(e, t), Q.init(e, t), (e._zod.processJSONSchema = (t, n, r) => Yi(e, t, n, r)));
      })),
      (qo = T(`ZodUndefined`, (e, t) => {
        (nr.init(e, t), Q.init(e, t), (e._zod.processJSONSchema = (t, n, r) => Zi(e, t, n, r)));
      })),
      (Jo = T(`ZodNull`, (e, t) => {
        (rr.init(e, t), Q.init(e, t), (e._zod.processJSONSchema = (t, n, r) => Xi(e, t, n, r)));
      })),
      (Yo = T(`ZodUnknown`, (e, t) => {
        (ir.init(e, t), Q.init(e, t), (e._zod.processJSONSchema = (t, n, r) => $i(e, t, n, r)));
      })),
      (Xo = T(`ZodNever`, (e, t) => {
        (ar.init(e, t), Q.init(e, t), (e._zod.processJSONSchema = (t, n, r) => Qi(e, t, n, r)));
      })),
      (Zo = T(`ZodArray`, (e, t) => {
        (or.init(e, t),
          Q.init(e, t),
          (e._zod.processJSONSchema = (t, n, r) => ia(e, t, n, r)),
          (e.element = t.element),
          Ua(e, `ZodArray`, {
            min(e, t) {
              return this.check(xi(e, t));
            },
            nonempty(e) {
              return this.check(xi(1, e));
            },
            max(e, t) {
              return this.check(bi(e, t));
            },
            length(e, t) {
              return this.check(Si(e, t));
            },
            unwrap() {
              return this.element;
            },
          }));
      })),
      (Qo = T(`ZodObject`, (e, t) => {
        (cr.init(e, t),
          Q.init(e, t),
          (e._zod.processJSONSchema = (t, n, r) => aa(e, t, n, r)),
          k(e, `shape`, () => t.shape),
          Ua(e, `ZodObject`, {
            keyof() {
              return ao(Object.keys(this._zod.def.shape));
            },
            catchall(e) {
              return this.clone({ ...this._zod.def, catchall: e });
            },
            passthrough() {
              return this.clone({ ...this._zod.def, catchall: Xa() });
            },
            loose() {
              return this.clone({ ...this._zod.def, catchall: Xa() });
            },
            strict() {
              return this.clone({ ...this._zod.def, catchall: Za() });
            },
            strip() {
              return this.clone({ ...this._zod.def, catchall: void 0 });
            },
            extend(e) {
              return Me(this, e);
            },
            safeExtend(e) {
              return Ne(this, e);
            },
            merge(e) {
              return Pe(this, e);
            },
            pick(e) {
              return Ae(this, e);
            },
            omit(e) {
              return je(this, e);
            },
            partial(...e) {
              return Fe(os, this, e[0]);
            },
            required(...e) {
              return Ie(ds, this, e[0]);
            },
          }));
      })),
      ($o = T(`ZodUnion`, (e, t) => {
        (lr.init(e, t),
          Q.init(e, t),
          (e._zod.processJSONSchema = (t, n, r) => oa(e, t, n, r)),
          (e.options = t.options));
      })),
      (es = T(`ZodDiscriminatedUnion`, (e, t) => {
        ($o.init(e, t), ur.init(e, t));
      })),
      (ts = T(`ZodIntersection`, (e, t) => {
        (dr.init(e, t), Q.init(e, t), (e._zod.processJSONSchema = (t, n, r) => sa(e, t, n, r)));
      })),
      (ns = T(`ZodRecord`, (e, t) => {
        (fr.init(e, t),
          Q.init(e, t),
          (e._zod.processJSONSchema = (t, n, r) => ca(e, t, n, r)),
          (e.keyType = t.keyType),
          (e.valueType = t.valueType));
      })),
      (rs = T(`ZodEnum`, (e, t) => {
        (pr.init(e, t),
          Q.init(e, t),
          (e._zod.processJSONSchema = (t, n, r) => ea(e, t, n, r)),
          (e.enum = t.entries),
          (e.options = Object.values(t.entries)));
        let n = new Set(Object.keys(t.entries));
        ((e.extract = (e, r) => {
          let i = {};
          for (let r of e)
            if (n.has(r)) i[r] = t.entries[r];
            else throw Error(`Key ${r} not found in enum`);
          return new rs({ ...t, checks: [], ...F(r), entries: i });
        }),
          (e.exclude = (e, r) => {
            let i = { ...t.entries };
            for (let t of e)
              if (n.has(t)) delete i[t];
              else throw Error(`Key ${t} not found in enum`);
            return new rs({ ...t, checks: [], ...F(r), entries: i });
          }));
      })),
      (is = T(`ZodLiteral`, (e, t) => {
        (mr.init(e, t),
          Q.init(e, t),
          (e._zod.processJSONSchema = (t, n, r) => ta(e, t, n, r)),
          (e.values = new Set(t.values)),
          Object.defineProperty(e, "value", {
            get() {
              if (t.values.length > 1)
                throw Error(
                  "This schema contains multiple valid literal values. Use `.values` instead.",
                );
              return t.values[0];
            },
          }));
      })),
      (as = T(`ZodTransform`, (e, t) => {
        (hr.init(e, t),
          Q.init(e, t),
          (e._zod.processJSONSchema = (t, n, r) => ra(e, t, n, r)),
          (e._zod.parse = (n, r) => {
            if (r.direction === `backward`) throw new he(e.constructor.name);
            n.addIssue = (r) => {
              if (typeof r == `string`) n.issues.push(z(r, n.value, t));
              else {
                let t = r;
                (t.fatal && (t.continue = !1),
                  (t.code ??= `custom`),
                  (t.input ??= n.value),
                  (t.inst ??= e),
                  n.issues.push(z(t)));
              }
            };
            let i = t.transform(n.value, n);
            return i instanceof Promise
              ? i.then((e) => ((n.value = e), (n.fallback = !0), n))
              : ((n.value = i), (n.fallback = !0), n);
          }));
      })),
      (os = T(`ZodOptional`, (e, t) => {
        (gr.init(e, t),
          Q.init(e, t),
          (e._zod.processJSONSchema = (t, n, r) => ga(e, t, n, r)),
          (e.unwrap = () => e._zod.def.innerType));
      })),
      (ss = T(`ZodExactOptional`, (e, t) => {
        (_r.init(e, t),
          Q.init(e, t),
          (e._zod.processJSONSchema = (t, n, r) => ga(e, t, n, r)),
          (e.unwrap = () => e._zod.def.innerType));
      })),
      (cs = T(`ZodNullable`, (e, t) => {
        (vr.init(e, t),
          Q.init(e, t),
          (e._zod.processJSONSchema = (t, n, r) => la(e, t, n, r)),
          (e.unwrap = () => e._zod.def.innerType));
      })),
      (ls = T(`ZodDefault`, (e, t) => {
        (yr.init(e, t),
          Q.init(e, t),
          (e._zod.processJSONSchema = (t, n, r) => da(e, t, n, r)),
          (e.unwrap = () => e._zod.def.innerType),
          (e.removeDefault = e.unwrap));
      })),
      (us = T(`ZodPrefault`, (e, t) => {
        (br.init(e, t),
          Q.init(e, t),
          (e._zod.processJSONSchema = (t, n, r) => fa(e, t, n, r)),
          (e.unwrap = () => e._zod.def.innerType));
      })),
      (ds = T(`ZodNonOptional`, (e, t) => {
        (xr.init(e, t),
          Q.init(e, t),
          (e._zod.processJSONSchema = (t, n, r) => ua(e, t, n, r)),
          (e.unwrap = () => e._zod.def.innerType));
      })),
      (fs = T(`ZodCatch`, (e, t) => {
        (Sr.init(e, t),
          Q.init(e, t),
          (e._zod.processJSONSchema = (t, n, r) => pa(e, t, n, r)),
          (e.unwrap = () => e._zod.def.innerType),
          (e.removeCatch = e.unwrap));
      })),
      (ps = T(`ZodPipe`, (e, t) => {
        (Cr.init(e, t),
          Q.init(e, t),
          (e._zod.processJSONSchema = (t, n, r) => ma(e, t, n, r)),
          (e.in = t.in),
          (e.out = t.out));
      })),
      (ms = T(`ZodPreprocess`, (e, t) => {
        (ps.init(e, t), wr.init(e, t));
      })),
      (hs = T(`ZodReadonly`, (e, t) => {
        (Tr.init(e, t),
          Q.init(e, t),
          (e._zod.processJSONSchema = (t, n, r) => ha(e, t, n, r)),
          (e.unwrap = () => e._zod.def.innerType));
      })),
      (gs = T(`ZodCustom`, (e, t) => {
        (Er.init(e, t), Q.init(e, t), (e._zod.processJSONSchema = (t, n, r) => na(e, t, n, r)));
      })));
  }),
  vs,
  ys = e(() => {
    (X(), (vs ||= {}));
  }),
  bs = e(() => {
    (X(), _s(), va(), ka(), Ha(), ys(), Ar(), _a(), Pr(), va(), Da(), _s(), B(), E(Or()));
  }),
  xs = e(() => {
    (bs(), bs());
  }),
  Ss = e(() => {
    (bs(), bs());
  }),
  Cs = e(() => {
    Ss();
  }),
  ws = e(() => {
    X();
  }),
  Ts = e(() => {}),
  Es = e(() => {
    X();
  }),
  Ds = e(() => {
    (X(), ws(), Ts(), Es(), _a(), B(), Ar(), Ts());
  }),
  Os = e(() => {
    Ds();
  });
export {
  pe as A,
  Xa as C,
  et as D,
  ut as E,
  E as O,
  to as S,
  Da as T,
  $a as _,
  Ya as a,
  io as b,
  qa as c,
  _s as d,
  ro as f,
  Ga as g,
  Za as h,
  ao as i,
  fe as j,
  O as k,
  vo as l,
  eo as m,
  Cs as n,
  Ja as o,
  oo as p,
  xs as r,
  Qa as s,
  Os as t,
  no as u,
  co as v,
  ya as w,
  Wa as x,
  xo as y,
};
//# sourceMappingURL=config-runtime-BxOat2Bj.js.map
