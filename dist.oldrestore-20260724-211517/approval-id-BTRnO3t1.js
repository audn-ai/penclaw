//#region packages/gateway-protocol/src/schema/approval-id.ts
const APPROVAL_ID_WELL_FORMED_UNICODE_PATTERN =
  "^(?!\\.{1,2}$)(?:[^\\uD800-\\uDFFF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF])+$";
/** Whether an approval id is non-empty, path-stable, and contains no unpaired UTF-16 surrogate. */
function isWellFormedApprovalId(value) {
  if (value.length === 0 || value === "." || value === "..") return false;
  for (let index = 0; index < value.length; index += 1) {
    const codeUnit = value.charCodeAt(index);
    if (codeUnit >= 55296 && codeUnit <= 56319) {
      if (index + 1 >= value.length) return false;
      const next = value.charCodeAt(index + 1);
      if (next < 56320 || next > 57343) return false;
      index += 1;
    } else if (codeUnit >= 56320 && codeUnit <= 57343) return false;
  }
  return true;
}
//#endregion
export { isWellFormedApprovalId as n, APPROVAL_ID_WELL_FORMED_UNICODE_PATTERN as t };
