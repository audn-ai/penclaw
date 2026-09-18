//#region src/config/patch-replace-paths.ts
function normalizeConfigPatchReplacePath(value) {
  const trimmed = value.trim();
  if (trimmed.endsWith("[]")) return trimmed.slice(0, -2).replace(/\[\d+\](?=\.)/g, "[]");
  return trimmed.replace(/\[\d+\](?=\.)/g, "[]");
}
function normalizeConfigPatchReplacePaths(values) {
  if (!values) return /* @__PURE__ */ new Set();
  return new Set(
    values
      .filter((value) => typeof value === "string")
      .map(normalizeConfigPatchReplacePath)
      .filter((value) => value.length > 0),
  );
}
//#endregion
export { normalizeConfigPatchReplacePaths as t };
