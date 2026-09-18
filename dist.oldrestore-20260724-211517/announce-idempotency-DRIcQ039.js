//#region src/agents/announce-idempotency.ts
/** Build the persisted announce id for a child session/run pair. */
function buildAnnounceIdFromChildRun(params) {
  return `v1:${params.childSessionKey}:${params.childRunId}`;
}
/** Build the idempotency key used by announce delivery storage. */
function buildAnnounceIdempotencyKey(announceId) {
  return `announce:${announceId}`;
}
//#endregion
export { buildAnnounceIdempotencyKey as n, buildAnnounceIdFromChildRun as t };
