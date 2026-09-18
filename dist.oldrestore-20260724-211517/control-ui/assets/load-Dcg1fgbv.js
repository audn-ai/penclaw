import {
  Hi as t,
  J as n,
  Ui as r,
  Vi as i,
  Y as a,
  hi as o,
  on as s,
  pi as c,
  tn as l,
} from "./control-ui-core-BcbHa4vB.js";
import { n as u, r as d } from "./models-D3RQvKVl.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
function f(e) {
  let t = new Date();
  return (
    t.setDate(t.getDate() - e),
    `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, `0`)}-${String(t.getDate()).padStart(2, `0`)}`
  );
}
function p(e) {
  return r(e)
    ? i(`model providers`)
    : e instanceof Error && e.message.trim()
      ? e.message
      : typeof e == `string`
        ? e
        : `request failed`;
}
async function m(e, t) {
  let [n, r, i, c, l, u] = await Promise.all([
    o(e, t).then(
      (e) => ({ ok: !0, result: e }),
      (e) => ({ ok: !1, error: e }),
    ),
    d(e, t).catch(() => null),
    e
      .request(`models.list`, { view: `all`, includeProviderCapabilities: !0 })
      .then((e) => e?.models ?? null)
      .catch(() => null),
    e
      .request(`config.get`, {})
      .then((e) => a(e))
      .catch(() => null),
    e.request(`usage.status`).catch(() => null),
    s(e, { startDate: f(29), endDate: f(0), scope: `family`, timeZone: `local` })
      .then((e) => e?.aggregates?.byProvider ?? null)
      .catch(() => null),
  ]);
  return {
    authStatus: n.ok ? n.result : null,
    models: r,
    catalogModels: i,
    config: c,
    providerUsage: l,
    costByProvider: u,
    updatedAt: Date.now(),
    error: n.ok ? null : p(n.error),
  };
}
var h,
  g = e(() => {
    (n(),
      t(),
      c(),
      l(),
      u(),
      (h = {
        authStatus: null,
        models: null,
        catalogModels: null,
        config: null,
        providerUsage: null,
        costByProvider: null,
        updatedAt: null,
        error: null,
      }));
  });
g();
export { h as EMPTY_MODEL_PROVIDERS_DATA, m as loadModelProvidersData, g as t };
//# sourceMappingURL=load-Dcg1fgbv.js.map
