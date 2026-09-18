//#region src/infra/exec-approval-policy-snapshot.ts
const utf8Encoder = new TextEncoder();
function compareUtf8(left, right) {
  const leftBytes = utf8Encoder.encode(left);
  const rightBytes = utf8Encoder.encode(right);
  const sharedLength = Math.min(leftBytes.length, rightBytes.length);
  for (let index = 0; index < sharedLength; index += 1) {
    const difference = (leftBytes[index] ?? 0) - (rightBytes[index] ?? 0);
    if (difference !== 0) return difference;
  }
  return leftBytes.length - rightBytes.length;
}
function compareOptionalUtf8(left, right) {
  if (left === void 0) return right === void 0 ? 0 : -1;
  if (right === void 0) return 1;
  return compareUtf8(left, right);
}
/** Cross-runtime order: tuple fields, absent before present, UTF-8 byte lexicographic. */
function compareExecApprovalPolicyRules(left, right) {
  return (
    compareUtf8(left.pattern, right.pattern) ||
    compareOptionalUtf8(left.argPattern, right.argPattern) ||
    compareOptionalUtf8(left.source, right.source)
  );
}
function buildExecApprovalPolicyRuleKey(rule) {
  return JSON.stringify([rule.pattern, rule.argPattern ?? null, rule.source ?? null]);
}
function canonicalizeExecApprovalPolicyRules(rules) {
  return [
    ...new Map(rules.map((rule) => [buildExecApprovalPolicyRuleKey(rule), rule])).values(),
  ].toSorted(compareExecApprovalPolicyRules);
}
function normalizeExecApprovalPolicySnapshot(value) {
  if (value === void 0) return;
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const candidate = value;
  const security = candidate.security;
  const ask = candidate.ask;
  const askFallback = candidate.askFallback;
  const autoAllowSkills = candidate.autoAllowSkills;
  const allowlistRules = candidate.allowlistRules;
  if (
    (security !== "deny" && security !== "allowlist" && security !== "full") ||
    (ask !== "off" && ask !== "on-miss" && ask !== "always") ||
    (askFallback !== "deny" && askFallback !== "allowlist" && askFallback !== "full") ||
    typeof autoAllowSkills !== "boolean" ||
    !Array.isArray(allowlistRules)
  )
    return null;
  const normalizedRules = [];
  for (const rawRule of allowlistRules) {
    if (!rawRule || typeof rawRule !== "object" || Array.isArray(rawRule)) return null;
    const rule = rawRule;
    if (
      typeof rule.pattern !== "string" ||
      (rule.argPattern !== void 0 && typeof rule.argPattern !== "string") ||
      (rule.source !== void 0 && rule.source !== "allow-always")
    )
      return null;
    normalizedRules.push({
      pattern: rule.pattern,
      ...(typeof rule.argPattern === "string" ? { argPattern: rule.argPattern } : {}),
      ...(rule.source === "allow-always" ? { source: rule.source } : {}),
    });
  }
  return {
    security,
    ask,
    askFallback,
    autoAllowSkills,
    allowlistRules: canonicalizeExecApprovalPolicyRules(normalizedRules),
  };
}
//#endregion
export { normalizeExecApprovalPolicySnapshot as n, canonicalizeExecApprovalPolicyRules as t };
