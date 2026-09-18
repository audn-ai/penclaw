import { t as formatMatrixErrorMessage } from "../../errors-DJRnBTUk.js";
import { r as createLazyRuntimeModule } from "../../lazy-runtime-B-Fc-m0I.js";
import "../../string-coerce-runtime-BUe4iD0r.js";
import { c as normalizeOptionalString } from "../../string-coerce-DW4mBlAt.js";
//#region extensions/matrix/src/plugin-entry.runtime.ts
const loadMatrixVerificationRuntime = createLazyRuntimeModule(
  () => import("../../verification-BoPaf0Jw.js"),
);
function sendError(respond, err) {
  respond(false, { error: formatMatrixErrorMessage(err) });
}
async function handleVerifyRecoveryKey({ params, respond }) {
  try {
    const { verifyMatrixRecoveryKey } = await loadMatrixVerificationRuntime();
    const key = normalizeOptionalString(params?.key);
    if (!key) {
      respond(false, { error: "key required" });
      return;
    }
    const result = await verifyMatrixRecoveryKey(key, {
      accountId: normalizeOptionalString(params?.accountId),
    });
    respond(result.success, result);
  } catch (err) {
    sendError(respond, err);
  }
}
async function handleVerificationBootstrap({ params, respond }) {
  try {
    const { bootstrapMatrixVerification } = await loadMatrixVerificationRuntime();
    const result = await bootstrapMatrixVerification({
      accountId: normalizeOptionalString(params?.accountId),
      recoveryKey: typeof params?.recoveryKey === "string" ? params.recoveryKey : void 0,
      forceResetCrossSigning: params?.forceResetCrossSigning === true,
    });
    respond(result.success, result);
  } catch (err) {
    sendError(respond, err);
  }
}
async function handleVerificationStatus({ params, respond }) {
  try {
    const { getMatrixVerificationStatus } = await loadMatrixVerificationRuntime();
    respond(
      true,
      await getMatrixVerificationStatus({
        accountId: normalizeOptionalString(params?.accountId),
        includeRecoveryKey: params?.includeRecoveryKey === true,
      }),
    );
  } catch (err) {
    sendError(respond, err);
  }
}
//#endregion
export { handleVerificationBootstrap, handleVerificationStatus, handleVerifyRecoveryKey };
