import path from "node:path";
import { o as tryReadJson } from "./json-files-CTWRDHag.js";
import { o as normalizeNullableString } from "./string-coerce-DW4mBlAt.js";
//#region src/infra/package-json.ts
/** Reads package.json as a loose object, returning null for missing or invalid manifests. */
async function readPackageJson(root) {
  const parsed = await tryReadJson(path.join(root, "package.json"));
  return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
}
/** Reads and trims the package version string, returning null for blank or non-string values. */
async function readPackageVersion(root) {
  return normalizeNullableString((await readPackageJson(root))?.version);
}
/** Reads and trims the package name string, returning null for blank or non-string values. */
async function readPackageName(root) {
  return normalizeNullableString((await readPackageJson(root))?.name);
}
/** Reads and trims the packageManager spec, returning null for blank or non-string values. */
async function readPackageManagerSpec(root) {
  return normalizeNullableString((await readPackageJson(root))?.packageManager);
}
//#endregion
export { readPackageName as n, readPackageVersion as r, readPackageManagerSpec as t };
