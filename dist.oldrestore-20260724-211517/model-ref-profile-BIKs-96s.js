//#region src/agents/model-ref-profile.ts
/**
 * Model ref auth-profile suffix parser.
 * Splits `provider/model@profile` while preserving model-version and local
 * quantization suffixes that legitimately contain `@`.
 */
/** Split a trailing auth profile suffix from a model ref when one is present. */
function splitTrailingAuthProfile(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return { model: "" };
  const lastSlash = trimmed.lastIndexOf("/");
  let profileDelimiter = trimmed.indexOf("@", lastSlash + 1);
  if (profileDelimiter <= 0) return { model: trimmed };
  const suffixAfterDelimiter = () => trimmed.slice(profileDelimiter + 1);
  if (/^\d{8}(?:@|$)/.test(suffixAfterDelimiter())) {
    const nextDelimiter = trimmed.indexOf("@", profileDelimiter + 9);
    if (nextDelimiter < 0) return { model: trimmed };
    profileDelimiter = nextDelimiter;
  }
  if (/^(?:i?q\d+(?:_[a-z0-9]+)*|\d+bit)(?:@|$)/i.test(suffixAfterDelimiter())) {
    const nextDelimiter = trimmed.indexOf("@", profileDelimiter + 1);
    if (nextDelimiter < 0) return { model: trimmed };
    profileDelimiter = nextDelimiter;
  }
  const model = trimmed.slice(0, profileDelimiter).trim();
  const profile = trimmed.slice(profileDelimiter + 1).trim();
  if (!model || !profile) return { model: trimmed };
  return {
    model,
    profile,
  };
}
//#endregion
export { splitTrailingAuthProfile as t };
