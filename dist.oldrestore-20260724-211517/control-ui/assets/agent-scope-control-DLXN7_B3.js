import { Hn as r, Pr as i, Rn as a, jr as o } from "./control-ui-core-BcbHa4vB.js";
import { o as s, t as c } from "./control-ui-core-CwQmiouz.js";
import { at as t, et as n } from "./lit-runtime-DkvDG939.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
function l(e) {
  let n = e.selection.state.scopeId ?? ``,
    a = new Map(
      e.agents.map((e) => {
        let t = r(e.id);
        return [t, t === e.id ? e : { ...e, id: t }];
      }),
    );
  for (let t of e.additionalAgentIds ?? []) {
    if (!t.trim()) continue;
    let e = r(t);
    a.has(e) || a.set(e, { id: e });
  }
  let o = [...a.values()].toSorted((e, t) => i(e).localeCompare(i(t))),
    c = n && !o.some((e) => e.id === n);
  return t`
    <label class="agent-scope-control">
      <span class="agent-scope-control__label">${s(`agentScope.label`)}</span>
      <select
        class="agent-scope-control__select"
        aria-label=${s(`agentScope.label`)}
        .value=${n}
        @change=${(t) => {
          let n = t.currentTarget.value;
          e.selection.setScope(n || null);
        }}
      >
        <option value="">${s(`agentScope.allAgents`)}</option>
        ${c ? t`<option value=${n}>${n}</option>` : null}
        ${o.map((e) => t`<option value=${e.id}>${i(e)}</option>`)}
      </select>
    </label>
  `;
}
var u = e(() => {
  (n(), c(), o(), a());
});
export { l as n, u as t };
//# sourceMappingURL=agent-scope-control-DLXN7_B3.js.map
