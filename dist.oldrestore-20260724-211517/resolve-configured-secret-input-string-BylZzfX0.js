import { l as secretRefKey } from "./ref-contract-DVV0zYUk.js";
import { i as resolveSecretRefValues } from "./resolve-Dvpn9c2h.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { g as resolveSecretInputRef } from "./types.secrets-BV0ywRAy.js";
//#region src/gateway/resolve-configured-secret-input-string.ts
function buildUnresolvedReason(params) {
  if (params.style === "generic")
    return `${params.path} SecretRef is unresolved (${params.refLabel}).`;
  if (params.kind === "non-string")
    return `${params.path} SecretRef resolved to a non-string value.`;
  if (params.kind === "empty") return `${params.path} SecretRef resolved to an empty value.`;
  return `${params.path} SecretRef is unresolved (${params.refLabel}).`;
}
async function resolveConfiguredSecretInputString(params) {
  const style = params.unresolvedReasonStyle ?? "generic";
  const { ref } = resolveSecretInputRef({
    value: params.value,
    defaults: params.config.secrets?.defaults,
  });
  if (!ref) return { value: normalizeOptionalString(params.value) };
  const refLabel = `${ref.source}:${ref.provider}:${ref.id}`;
  try {
    const resolvedValue = (
      await resolveSecretRefValues([ref], {
        config: params.config,
        env: params.env,
        ...(params.manifestRegistry ? { manifestRegistry: params.manifestRegistry } : {}),
      })
    ).get(secretRefKey(ref));
    if (typeof resolvedValue !== "string")
      return {
        unresolvedRefReason: buildUnresolvedReason({
          path: params.path,
          style,
          kind: "non-string",
          refLabel,
        }),
      };
    const trimmed = normalizeOptionalString(resolvedValue);
    if (!trimmed)
      return {
        unresolvedRefReason: buildUnresolvedReason({
          path: params.path,
          style,
          kind: "empty",
          refLabel,
        }),
      };
    return { value: trimmed };
  } catch {
    return {
      unresolvedRefReason: buildUnresolvedReason({
        path: params.path,
        style,
        kind: "unresolved",
        refLabel,
      }),
    };
  }
}
async function resolveConfiguredSecretRefOnlyInputString(params) {
  const { ref } = resolveSecretInputRef({
    value: params.value,
    defaults: params.config.secrets?.defaults,
  });
  if (!ref) return { refConfigured: false };
  return {
    refConfigured: true,
    ...(await resolveConfiguredSecretInputString({
      config: params.config,
      env: params.env,
      value: params.value,
      path: params.path,
      ...(params.manifestRegistry ? { manifestRegistry: params.manifestRegistry } : {}),
      unresolvedReasonStyle: params.unresolvedReasonStyle,
    })),
  };
}
async function resolveConfiguredSecretInputWithFallback(params) {
  const resolved = await resolveConfiguredSecretRefOnlyInputString(params);
  const readNormalizedFallback = () => normalizeOptionalString(params.readFallback?.());
  const configValue = !resolved.refConfigured ? normalizeOptionalString(params.value) : void 0;
  if (configValue)
    return {
      value: configValue,
      source: "config",
      secretRefConfigured: false,
    };
  if (!resolved.refConfigured) {
    const fallback = readNormalizedFallback();
    if (fallback)
      return {
        value: fallback,
        source: "fallback",
        secretRefConfigured: false,
      };
    return { secretRefConfigured: false };
  }
  if (resolved.value)
    return {
      value: resolved.value,
      source: "secretRef",
      secretRefConfigured: true,
    };
  const fallback = readNormalizedFallback();
  if (fallback)
    return {
      value: fallback,
      source: "fallback",
      secretRefConfigured: true,
    };
  return {
    unresolvedRefReason: resolved.unresolvedRefReason,
    secretRefConfigured: true,
  };
}
async function resolveRequiredConfiguredSecretRefInputString(params) {
  const resolved = await resolveConfiguredSecretRefOnlyInputString(params);
  if (!resolved.refConfigured) return;
  if (resolved.value) return resolved.value;
  throw new Error(resolved.unresolvedRefReason ?? `${params.path} resolved to an empty value.`);
}
//#endregion
export {
  resolveConfiguredSecretInputWithFallback as n,
  resolveRequiredConfiguredSecretRefInputString as r,
  resolveConfiguredSecretInputString as t,
};
