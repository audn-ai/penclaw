import { t as expectDefined } from "./expect-CyE8FADM.js";
import "./src-Bl7G9qvi.js";
//#region src/hooks/installs.ts
/** Return config with one hook install record merged into hooks.internal.installs. */
function recordHookInstall(cfg, update) {
  const { hookId, ...record } = update;
  const installs = {
    ...cfg.hooks?.internal?.installs,
    [hookId]: {
      ...cfg.hooks?.internal?.installs?.[hookId],
      ...record,
      installedAt: record.installedAt ?? /* @__PURE__ */ new Date().toISOString(),
    },
  };
  return {
    ...cfg,
    hooks: {
      ...cfg.hooks,
      internal: {
        ...cfg.hooks?.internal,
        installs: {
          ...installs,
          [hookId]: expectDefined(installs[hookId], "installs entry at hook id"),
        },
      },
    },
  };
}
//#endregion
export { recordHookInstall as t };
