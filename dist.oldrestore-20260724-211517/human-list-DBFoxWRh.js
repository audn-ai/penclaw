import { t as expectDefined } from "./expect-CyE8FADM.js";
import "./src-Bl7G9qvi.js";
//#region src/shared/human-list.ts
function formatHumanList(values) {
  if (values.length === 0) return "";
  if (values.length === 1) return expectDefined(values[0], "values entry at 0");
  if (values.length === 2) return `${values[0]} or ${values[1]}`;
  return `${values.slice(0, -1).join(", ")}, or ${values.at(-1)}`;
}
//#endregion
export { formatHumanList as t };
