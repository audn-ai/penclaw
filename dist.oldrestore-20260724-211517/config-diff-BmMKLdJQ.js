import { isDeepStrictEqual } from "node:util";
import "./utils-DtcDeqWS.js";
import { t as isPlainObject } from "./plain-object-jVBUx3XB.js";
//#region src/gateway/config-diff.ts
/** Return dotted config paths whose values differ between two config snapshots. */
function diffConfigPaths(prev, next, prefix = "") {
  if (prev === next) return [];
  if (isPlainObject(prev) && isPlainObject(next)) {
    const keys = /* @__PURE__ */ new Set([...Object.keys(prev), ...Object.keys(next)]);
    const paths = [];
    for (const key of keys) {
      const prevValue = prev[key];
      const nextValue = next[key];
      if (prevValue === void 0 && nextValue === void 0) continue;
      const childPaths = diffConfigPaths(prevValue, nextValue, prefix ? `${prefix}.${key}` : key);
      if (childPaths.length > 0) paths.push(...childPaths);
    }
    return paths;
  }
  if (Array.isArray(prev) && Array.isArray(next)) {
    if (isDeepStrictEqual(prev, next)) return [];
  }
  return [prefix || "<root>"];
}
/** Preserve startup-only restart boundaries hidden by whole-object config changes. */
function diffGatewayReloadPaths(prevConfig, nextConfig) {
  const changedPaths = diffConfigPaths(prevConfig, nextConfig);
  if (!changedPaths.includes("mcp")) return changedPaths;
  return [
    ...changedPaths,
    ...diffConfigPaths(
      { mcp: { apps: prevConfig.mcp?.apps } },
      { mcp: { apps: nextConfig.mcp?.apps } },
    ),
  ];
}
//#endregion
export { diffGatewayReloadPaths as n, diffConfigPaths as t };
