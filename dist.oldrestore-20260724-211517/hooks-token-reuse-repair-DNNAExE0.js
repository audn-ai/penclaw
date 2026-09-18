import {
  r as materializeGatewayAuthSecretRefs,
  t as canMaterializeGatewayAuthSecretRefsWithoutExec,
} from "./auth-config-utils-CD1fFT1Z.js";
import "./auth-D-Aebsmj.js";
import { n as resolveGatewayAuth } from "./auth-resolve-PY0Y7GYi.js";
import { t as randomToken } from "./random-token-B1woZa_H.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/commands/doctor/shared/hooks-token-reuse-repair.ts
function activeGatewaySharedSecret(auth) {
  if (auth.mode === "token") return normalizeOptionalString(auth.token) ?? "";
  if (auth.mode === "password" || auth.mode === "trusted-proxy")
    return normalizeOptionalString(auth.password) ?? "";
  return "";
}
/** Rotate hooks.token when it matches the active Gateway token/password shared secret. */
function repairHooksTokenReuseGatewayAuth(cfg, env = process.env, createToken = randomToken) {
  return repairHooksTokenReuseGatewayAuthAfterMaterializingRefs(cfg, env, createToken);
}
async function materializeDoctorGatewayAuthRefs(cfg, env) {
  const materializeParams = {
    cfg,
    env,
    mode: cfg.gateway?.auth?.mode,
    hasTokenCandidate: Boolean(normalizeOptionalString(env.OPENCLAW_GATEWAY_TOKEN)),
    hasPasswordCandidate: Boolean(normalizeOptionalString(env.OPENCLAW_GATEWAY_PASSWORD)),
  };
  if (!canMaterializeGatewayAuthSecretRefsWithoutExec(materializeParams)) return cfg;
  try {
    return await materializeGatewayAuthSecretRefs(materializeParams);
  } catch {
    return cfg;
  }
}
async function repairHooksTokenReuseGatewayAuthAfterMaterializingRefs(cfg, env, createToken) {
  const hooksToken = normalizeOptionalString(cfg.hooks?.token) ?? "";
  if (cfg.hooks?.enabled !== true || !hooksToken)
    return {
      config: cfg,
      changes: [],
    };
  const materializedCfg = await materializeDoctorGatewayAuthRefs(cfg, env);
  if (
    hooksToken !==
    activeGatewaySharedSecret(
      resolveGatewayAuth({
        authConfig: materializedCfg.gateway?.auth,
        tailscaleMode: materializedCfg.gateway?.tailscale?.mode ?? "off",
        env,
      }),
    )
  )
    return {
      config: cfg,
      changes: [],
    };
  const nextHooksToken = createToken();
  return {
    config: {
      ...cfg,
      hooks: {
        ...cfg.hooks,
        token: nextHooksToken,
      },
    },
    changes: [
      "Rotated hooks.token because it reused active Gateway shared-secret auth. Update external hook senders to use the new hooks.token.",
    ],
  };
}
//#endregion
export { repairHooksTokenReuseGatewayAuth };
