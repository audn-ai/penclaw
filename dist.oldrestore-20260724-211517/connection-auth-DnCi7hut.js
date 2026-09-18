import { n as resolveGatewayCredentialsWithSecretInputs } from "./credentials-secret-inputs-CzaPJ-pp.js";
//#region src/gateway/connection-auth.ts
function toGatewayCredentialOptions(params) {
  const { config, ...rest } = params;
  return {
    cfg: config,
    ...rest,
  };
}
/** Resolves gateway connection credentials, including configured SecretRef inputs. */
async function resolveGatewayConnectionAuth(params) {
  return await resolveGatewayCredentialsWithSecretInputs({
    config: params.config,
    ...toGatewayCredentialOptions(params),
  });
}
//#endregion
export { resolveGatewayConnectionAuth as t };
