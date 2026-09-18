import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region src/cron/isolated-agent/subagent-followup-hints.ts
/** Detects interim cron replies that should wait for or retry subagent work. */
const SUBAGENT_FOLLOWUP_HINTS = [
  "subagent spawned",
  "spawned a subagent",
  "auto-announce when done",
  "both subagents are running",
  "wait for them to report back",
];
const INTERIM_CRON_HINTS = [
  "on it",
  "pulling everything together",
  "give me a few",
  "give me a few min",
  "few minutes",
  "let me compile",
  "i'll gather",
  "i will gather",
  "working on it",
  "retrying now",
  "should be about",
  "should have your summary",
  "it'll auto-announce when done",
  "it will auto-announce when done",
  ...SUBAGENT_FOLLOWUP_HINTS,
];
function normalizeHintText(value) {
  return normalizeLowercaseStringOrEmpty(value).replace(/\s+/g, " ");
}
/** Detects short cron replies that probably announce work continuing elsewhere. */
function isLikelyInterimCronMessage(value) {
  const normalized = normalizeHintText(value);
  if (!normalized) return false;
  return (
    normalized.split(" ").filter(Boolean).length <= 45 &&
    INTERIM_CRON_HINTS.some((hint) => normalized.includes(hint))
  );
}
/** Detects cron replies that explicitly promise a subagent follow-up message. */
function expectsSubagentFollowup(value) {
  const normalized = normalizeHintText(value);
  return Boolean(normalized && SUBAGENT_FOLLOWUP_HINTS.some((hint) => normalized.includes(hint)));
}
//#endregion
export { isLikelyInterimCronMessage as n, expectsSubagentFollowup as t };
