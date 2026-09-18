import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
async function t(e, t) {
  let n = a.get(e),
    o = Date.now();
  if (!t?.refresh && n?.models && n.expiresAt > o) return n.models;
  if (!t?.refresh && n?.inFlight) return n.inFlight;
  let s = r(e, n?.models)
    .then((t) => {
      let n = a.get(e);
      return (
        (!n || n.inFlight === s) &&
          a.set(e, { expiresAt: t.fresh ? Date.now() + i : 0, models: t.models }),
        t.models
      );
    })
    .finally(() => {
      let t = a.get(e);
      t?.inFlight === s && delete t.inFlight;
    });
  return (a.set(e, { expiresAt: n?.expiresAt ?? 0, models: n?.models ?? [], inFlight: s }), s);
}
function n(e) {
  return Array.isArray(e) ? e : null;
}
async function r(e, t) {
  try {
    return {
      models: (await e.request(`models.list`, { view: `configured` }))?.models ?? [],
      fresh: !0,
    };
  } catch {
    return { models: t ?? [], fresh: !1 };
  }
}
var i,
  a,
  o = e(() => {
    ((i = 6e4), (a = new WeakMap()));
  });
export { o as n, t as r, n as t };
//# sourceMappingURL=models-D3RQvKVl.js.map
