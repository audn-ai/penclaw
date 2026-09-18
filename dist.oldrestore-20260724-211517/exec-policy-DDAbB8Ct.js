import { $ as resolveExecPolicyForMode } from "./exec-approvals-Bz218bS2.js";
//#region src/infra/exec-policy.ts
function applyExecPolicyLayer(base, layer) {
  if (!layer) return base;
  if (layer.mode)
    return {
      ...base,
      mode: layer.mode,
      ...resolveExecPolicyForMode(layer.mode),
    };
  if (layer.security !== void 0 || layer.ask !== void 0) {
    const { mode: _mode, ...baseWithoutMode } = base;
    return {
      ...baseWithoutMode,
      security: layer.security ?? base.security,
      ask: layer.ask ?? base.ask,
    };
  }
  return base;
}
//#endregion
export { applyExecPolicyLayer as t };
