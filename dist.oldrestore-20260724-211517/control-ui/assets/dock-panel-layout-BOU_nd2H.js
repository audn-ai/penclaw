import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
function t(e) {
  let t = { open: !1, dock: e.defaultDock, height: e.defaultHeight, width: e.defaultWidth },
    n = () => Math.max(e.minHeight, Math.floor((globalThis.innerHeight || 800) * 0.8)),
    r = () => Math.max(e.minWidth, Math.floor((globalThis.innerWidth || 1280) * 0.8)),
    i = (e, t, n, r) => Math.min(typeof e == `number` && Number.isFinite(e) && e >= t ? e : r, n);
  return {
    defaults: t,
    minHeight: e.minHeight,
    minWidth: e.minWidth,
    maxHeight: n,
    maxWidth: r,
    load() {
      try {
        let a = globalThis.localStorage?.getItem(e.storageKey);
        if (!a) return { ...t };
        let o = JSON.parse(a);
        return {
          open: !!o.open,
          dock: o.dock === `bottom` || o.dock === `right` ? o.dock : t.dock,
          height: i(o.height, e.minHeight, n(), t.height),
          width: i(o.width, e.minWidth, r(), t.width),
        };
      } catch {
        return { ...t };
      }
    },
    save(t) {
      try {
        globalThis.localStorage?.setItem(e.storageKey, JSON.stringify(t));
      } catch {}
    },
  };
}
var n = e(() => {});
export { n, t };
//# sourceMappingURL=dock-panel-layout-BOU_nd2H.js.map
