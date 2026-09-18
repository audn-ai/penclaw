import { c as callGateway } from "./call-BVMO6az_.js";
import { r as stripToolMessages } from "./chat-history-text-BrNFNoZX.js";
import { y as parseStrictNonNegativeInteger } from "./number-coercion-CJQ8TR--.js";
import {
  l as stopWithText,
  n as formatLogLines,
  s as resolveSubagentEntryForToken,
} from "./shared-ClQdRzRz.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { t as formatRunLabel } from "./subagents-utils--q1dbPqc.js";
//#region src/auto-reply/reply/commands-subagents/action-log.ts
async function handleSubagentsLogAction(ctx) {
  const { runs, restTokens } = ctx;
  const target = restTokens[0];
  if (!target) return stopWithText("📜 Usage: /subagents log <id|#> [limit]");
  const includeTools = restTokens.some(
    (token) => normalizeLowercaseStringOrEmpty(token) === "tools",
  );
  const parsedLimit = parseStrictNonNegativeInteger(
    restTokens.slice(1).find((token) => parseStrictNonNegativeInteger(token) !== void 0),
  );
  const limit = parsedLimit === void 0 ? 20 : Math.min(200, Math.max(1, parsedLimit));
  const targetResolution = resolveSubagentEntryForToken(runs, target);
  if ("reply" in targetResolution) return targetResolution.reply;
  const history = await callGateway({
    method: "chat.history",
    params: {
      sessionKey: targetResolution.entry.childSessionKey,
      limit,
    },
  });
  const rawMessages = Array.isArray(history?.messages) ? history.messages : [];
  const lines = formatLogLines(includeTools ? rawMessages : stripToolMessages(rawMessages));
  const header = `📜 Subagent log: ${formatRunLabel(targetResolution.entry)}`;
  if (lines.length === 0) return stopWithText(`${header}\n(no messages)`);
  return stopWithText([header, ...lines].join("\n"));
}
//#endregion
export { handleSubagentsLogAction };
