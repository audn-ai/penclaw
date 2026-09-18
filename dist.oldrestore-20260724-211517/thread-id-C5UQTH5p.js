import { l as normalizeOptionalStringifiedId } from "./string-coerce-DW4mBlAt.js";
//#region src/infra/outbound/thread-id.ts
/** Normalizes channel thread/topic ids before outbound payload construction. */
function normalizeOutboundThreadId(value) {
  return normalizeOptionalStringifiedId(value);
}
//#endregion
export { normalizeOutboundThreadId as t };
