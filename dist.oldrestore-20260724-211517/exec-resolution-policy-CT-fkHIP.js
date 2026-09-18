import {
  i as isValidExecSecretRefId,
  r as formatExecSecretRefIdValidationMessage,
} from "./ref-contract-DVV0zYUk.js";
//#region src/secrets/exec-resolution-policy.ts
/**
 * Splits refs by whether the current audit/apply mode is allowed to execute secret providers.
 */
function selectRefsForExecPolicy(params) {
  const refsToResolve = [];
  const skippedExecRefs = [];
  for (const ref of params.refs) {
    if (ref.source === "exec" && !params.allowExec) {
      skippedExecRefs.push(ref);
      continue;
    }
    refsToResolve.push(ref);
  }
  return {
    refsToResolve,
    skippedExecRefs,
  };
}
/**
 * Returns static validation errors for skipped exec refs without resolving the provider command.
 */
function getSkippedExecRefStaticError(params) {
  const id = params.ref.id.trim();
  const refLabel = `${params.ref.source}:${params.ref.provider}:${id}`;
  if (!id) return "Error: Secret reference id is empty.";
  if (!isValidExecSecretRefId(id))
    return `Error: ${formatExecSecretRefIdValidationMessage()} (ref: ${refLabel}).`;
  const providerConfig = params.config.secrets?.providers?.[params.ref.provider];
  if (!providerConfig)
    return `Error: Secret provider "${params.ref.provider}" is not configured (ref: ${refLabel}).`;
  if (providerConfig.source !== params.ref.source)
    return `Error: Secret provider "${params.ref.provider}" has source "${providerConfig.source}" but ref requests "${params.ref.source}".`;
  return null;
}
//#endregion
export { selectRefsForExecPolicy as n, getSkippedExecRefStaticError as t };
