//#region src/shared/path-array-index.ts
/** Upper bound for config path array indexes to reject impractical sparse writes. */
const MAX_CONFIG_PATH_ARRAY_INDEX = 1e5;
const CANONICAL_ARRAY_INDEX_SEGMENT = /^(0|[1-9]\d*)$/;
/** Parses a canonical non-negative array index segment used by config and JSON paths. */
function parseConfigPathArrayIndex(segment) {
  if (!CANONICAL_ARRAY_INDEX_SEGMENT.test(segment)) return;
  const index = Number(segment);
  return Number.isSafeInteger(index) && index <= MAX_CONFIG_PATH_ARRAY_INDEX ? index : void 0;
}
//#endregion
export { parseConfigPathArrayIndex as t };
