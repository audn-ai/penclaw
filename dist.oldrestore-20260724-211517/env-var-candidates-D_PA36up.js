//#region src/shared/env-var-candidates.ts
/** Appends normalized, unique environment-variable candidates to a keyed bucket. */
function appendUniqueEnvVarCandidates(target, ownerId, keys) {
  const normalizedOwnerId = ownerId.trim();
  if (!normalizedOwnerId || keys.length === 0) return;
  const bucket = (target[normalizedOwnerId] ??= []);
  const seen = new Set(bucket);
  for (const key of keys) {
    const normalizedKey = key.trim();
    if (!normalizedKey || seen.has(normalizedKey)) continue;
    seen.add(normalizedKey);
    bucket.push(normalizedKey);
  }
}
//#endregion
export { appendUniqueEnvVarCandidates as t };
