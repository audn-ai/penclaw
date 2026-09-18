import fs from "node:fs";
import path from "node:path";
import {
  i as createConfigIncludeResolutionSession,
  o as readConfigIncludeFileWithGuards,
  r as INCLUDE_KEY,
} from "./includes-C1dGj2Ja.js";
import { t as parseJsonWithJson5Fallback } from "./parse-json-compat-CmZHj-1e.js";
import { p as resolveIncludeRoots } from "./paths-DEklnbzU.js";
//#region src/config/includes-scan.ts
function listDirectIncludes(parsed) {
  const out = [];
  const visit = (value) => {
    if (!value) return;
    if (Array.isArray(value)) {
      for (const item of value) visit(item);
      return;
    }
    if (typeof value !== "object") return;
    const rec = value;
    const includeVal = rec[INCLUDE_KEY];
    if (typeof includeVal === "string") out.push(includeVal);
    else if (Array.isArray(includeVal)) {
      for (const item of includeVal) if (typeof item === "string") out.push(item);
    }
    for (const v of Object.values(rec)) visit(v);
  };
  visit(parsed);
  return out;
}
/** Collects recursively referenced config include files without requiring a valid full config. */
async function collectIncludePathsRecursive(params) {
  const includedPaths = /* @__PURE__ */ new Set();
  const walkedDepthByBase = /* @__PURE__ */ new Map();
  const allowedRoots = params.allowedRoots ?? resolveIncludeRoots(params.env);
  const resolveInclude = createConfigIncludeResolutionSession(params.configPath, allowedRoots);
  const walk = (basePath, parsed, depth) => {
    if (depth >= 10) return;
    for (const includePath of listDirectIncludes(parsed)) {
      let openedBasePath;
      let nestedInclude;
      const resolver = {
        readFile: (candidate) => fs.readFileSync(candidate, "utf-8"),
        readFileWithGuards: (readParams) => {
          return readConfigIncludeFileWithGuards({
            ...readParams,
            onResolvedPath: (resolvedIncludePath) => {
              includedPaths.add(resolvedIncludePath);
              const lexicalBasePath = path.normalize(readParams.resolvedPath);
              const nextDepth = depth + 1;
              const walkedDepth = walkedDepthByBase.get(lexicalBasePath);
              if (walkedDepth !== void 0 && walkedDepth <= nextDepth) return;
              walkedDepthByBase.set(lexicalBasePath, nextDepth);
              openedBasePath = lexicalBasePath;
            },
          });
        },
        parseJson: (raw) => {
          const nestedParsed = parseJsonWithJson5Fallback(raw);
          if (openedBasePath)
            nestedInclude = {
              basePath: openedBasePath,
              parsed: nestedParsed,
            };
          return {};
        },
      };
      try {
        resolveInclude({ [INCLUDE_KEY]: includePath }, basePath, resolver);
      } catch {}
      if (nestedInclude) walk(nestedInclude.basePath, nestedInclude.parsed, depth + 1);
    }
  };
  walk(params.configPath, params.parsed, 0);
  return [...includedPaths];
}
//#endregion
export { collectIncludePathsRecursive as t };
