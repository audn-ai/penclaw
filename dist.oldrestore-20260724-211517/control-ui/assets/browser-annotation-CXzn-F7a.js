import { o as r, t as i } from "./control-ui-core-CwQmiouz.js";
import { I as t, P as n } from "./control-ui-foundation-s2wA1PVE.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
function a(e) {
  let t = new CustomEvent(g, { detail: e, cancelable: !0 });
  return (window.dispatchEvent(t), t.defaultPrevented);
}
function o(e) {
  return Math.min(1, Math.max(0, e));
}
function s(e) {
  if (e.points.length === 0) return null;
  let t = 1,
    n = 1,
    r = 0,
    i = 0;
  for (let a of e.points)
    ((t = Math.min(t, o(a.x))),
      (n = Math.min(n, o(a.y))),
      (r = Math.max(r, o(a.x))),
      (i = Math.max(i, o(a.y))));
  return { x: t, y: n, width: r - t, height: i - n };
}
function c(e) {
  return String(Math.round(o(e) * 100));
}
function l(e, n = 80) {
  return t(e.replace(/\s+/g, ` `).trim(), n);
}
function u(e, t = 40) {
  return e.replace(/[^\w-]/g, ``).slice(0, t);
}
function d(e) {
  let t = e.classes
      .slice(0, 3)
      .map((e) => u(e))
      .filter((e) => e.length > 0)
      .map((e) => `.${e}`)
      .join(``),
    n = u(e.tag) || `element`,
    r = u(e.id),
    i = `${n}${r ? `#${r}` : ``}${t}`,
    a = l(e.name);
  return `${i}${a ? ` "${a}"` : ``}${e.role ? ` (role=${l(e.role, 40)})` : ``}`;
}
function f(e) {
  let t = l(e.title),
    n = [
      t
        ? r(`browser.annotatePrompt.introTitled`, { url: e.url, title: t })
        : r(`browser.annotatePrompt.introUntitled`, { url: e.url }),
    ],
    i = e.strokes.flatMap((e) => s(e) ?? []);
  return (
    i.slice(0, _).forEach((e, t) => {
      n.push(
        r(`browser.annotatePrompt.region`, {
          index: String(t + 1),
          x: c(e.x + e.width / 2),
          y: c(e.y + e.height / 2),
          width: c(e.width),
          height: c(e.height),
        }),
      );
    }),
    i.length > _ &&
      n.push(r(`browser.annotatePrompt.moreRegions`, { count: String(i.length - _) })),
    e.element &&
      n.push(
        r(`browser.annotatePrompt.elementDetail`, {
          descriptor: d(e.element),
          width: String(Math.round(e.element.rect.width)),
          height: String(Math.round(e.element.rect.height)),
          x: String(Math.round(e.element.rect.x)),
          y: String(Math.round(e.element.rect.y)),
        }),
      ),
    n.push(r(`browser.annotatePrompt.outro`)),
    n.join(`
`)
  );
}
function p(e) {
  return Math.max(4, Math.round(e * 0.005));
}
function m(e, t) {
  ((e.lineCap = `round`), (e.lineJoin = `round`), (e.strokeStyle = v), (e.lineWidth = p(t.width)));
  for (let n of t.strokes)
    if (n.points.length !== 0) {
      if (
        (e.beginPath(),
        n.points.forEach((n, r) => {
          let i = o(n.x) * t.width,
            a = o(n.y) * t.height;
          r === 0 ? e.moveTo(i, a) : e.lineTo(i, a);
        }),
        n.points.length === 1)
      ) {
        let r = n.points[0];
        r && e.lineTo(o(r.x) * t.width + 0.1, o(r.y) * t.height);
      }
      e.stroke();
    }
  if (t.highlight) {
    let { x: n, y: r, width: i, height: a } = t.highlight;
    e.strokeRect(
      o(n) * t.width,
      o(r) * t.height,
      Math.max(2, i * t.width),
      Math.max(2, a * t.height),
    );
  }
}
function h(e) {
  let t = document.createElement(`canvas`);
  ((t.width = e.width), (t.height = e.height));
  let n = t.getContext(`2d`);
  if (!n) throw Error(`canvas 2d context unavailable`);
  return (n.drawImage(e.image, 0, 0, e.width, e.height), m(n, e), t.toDataURL(`image/png`));
}
var g,
  _,
  v,
  y = e(() => {
    (n(), i(), (g = `openclaw:browser-annotation`), (_ = 8), (v = `#e0442d`));
  });
export { y as a, a as i, f as n, m as o, h as r, g as t };
//# sourceMappingURL=browser-annotation-CXzn-F7a.js.map
