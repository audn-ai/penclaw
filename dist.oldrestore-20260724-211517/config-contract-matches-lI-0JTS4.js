import { t as parseConfigPathArrayIndex } from "./path-array-index-CvEcUJa-.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import "./utils-DtcDeqWS.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
//#region src/plugins/config-contract-matches.ts
function normalizePathPattern(pathPattern) {
  return normalizeStringEntries(pathPattern.split("."));
}
function appendPathSegment(path, segment) {
  if (!path) return segment;
  return /^\d+$/.test(segment) ? `${path}[${segment}]` : `${path}.${segment}`;
}
function parseCanonicalArrayIndex(segment, length) {
  const index = parseConfigPathArrayIndex(segment);
  return index !== void 0 && index < length ? index : null;
}
/** Collect concrete config values that match a plugin contract path pattern. */
function collectPluginConfigContractMatches(params) {
  const pattern = normalizePathPattern(params.pathPattern);
  if (pattern.length === 0) return [];
  let states = [
    {
      segments: [],
      value: params.root,
    },
  ];
  for (const segment of pattern) {
    const nextStates = [];
    for (const state of states) {
      if (segment === "*") {
        if (Array.isArray(state.value)) {
          for (const [index, value] of state.value.entries())
            nextStates.push({
              segments: [...state.segments, String(index)],
              value,
            });
          continue;
        }
        if (isRecord(state.value))
          for (const [key, value] of Object.entries(state.value))
            nextStates.push({
              segments: [...state.segments, key],
              value,
            });
        continue;
      }
      if (Array.isArray(state.value)) {
        const index = parseCanonicalArrayIndex(segment, state.value.length);
        if (index !== null)
          nextStates.push({
            segments: [...state.segments, segment],
            value: state.value[index],
          });
        continue;
      }
      if (!isRecord(state.value) || !Object.hasOwn(state.value, segment)) continue;
      nextStates.push({
        segments: [...state.segments, segment],
        value: state.value[segment],
      });
    }
    states = nextStates;
    if (states.length === 0) break;
  }
  return states.map((state) => ({
    path: state.segments.reduce(appendPathSegment, ""),
    value: state.value,
  }));
}
//#endregion
export { collectPluginConfigContractMatches as t };
