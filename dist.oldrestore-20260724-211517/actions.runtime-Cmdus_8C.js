import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import "./temp-path-DYqJUh96.js";
import "./number-runtime-B-n-wjMn.js";
import { t as createIMessageRpcClient } from "./client-B2SbygAK.js";
import {
  n as runIMessageCliJsonCommand,
  t as extractMarkdownFormatRuns,
} from "./markdown-format-Cu_wLFV4.js";
import {
  c as normalizeDirectChatIdentifier,
  u as resolveIMessageMessageId,
} from "./monitor-reply-cache-BmVsaTWs.js";
import {
  C as resolveExpiresAtMsFromDurationMs,
  o as asDateTimestampMs,
  v as parseStrictInteger,
} from "./number-coercion-CJQ8TR--.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-uPgNO8da.js";
//#region extensions/imessage/src/actions.runtime.ts
function asChatList(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  const chats = value.chats;
  if (!Array.isArray(chats)) return [];
  return chats.filter((chat) => chat != null && typeof chat === "object" && !Array.isArray(chat));
}
function numberFromUnknown(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return parseStrictInteger(value);
}
function stringFromUnknown(value) {
  return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
const CHAT_LIST_CACHE_TTL_MS = 30 * 1e3;
const chatListCache = /* @__PURE__ */ new Map();
function chatListCacheKey(cliPath, dbPath) {
  return `${cliPath}\0${dbPath ?? ""}`;
}
function chatListCacheGet(cliPath, dbPath) {
  const key = chatListCacheKey(cliPath, dbPath);
  const entry = chatListCache.get(key);
  if (!entry) return null;
  const now = asDateTimestampMs(Date.now());
  if (now === void 0 || entry.expiresAt <= now) {
    chatListCache.delete(key);
    return null;
  }
  return entry.list;
}
function chatListCacheSet(cliPath, dbPath, list) {
  const expiresAt = resolveExpiresAtMsFromDurationMs(CHAT_LIST_CACHE_TTL_MS);
  if (expiresAt === void 0) return;
  chatListCache.set(chatListCacheKey(cliPath, dbPath), {
    list,
    expiresAt,
  });
}
/**
 * Strip the iMessage;-;/SMS;-;/any;-; service prefix that Messages uses
 * for direct DM chats. Different layers report direct DMs in different
 * forms — the action surface synthesizes `iMessage;-;<phone>` from a
 * handle target, while imsg's chats.list returns `identifier: <phone>`
 * and `guid: any;-;<phone>`. Comparing the raw strings would falsely
 * miss the match.
 */
function normalizeDirectChatIdentifierForTest(raw) {
  return normalizeDirectChatIdentifier(raw);
}
function findChatGuidForTest(chats, target) {
  return findChatGuid(chats, target);
}
function findChatGuid(chats, target) {
  if (target.kind === "chat_id") {
    for (const chat of chats) {
      const id = numberFromUnknown(chat.id);
      const guid = stringFromUnknown(chat.guid);
      if (id === target.chatId && guid) return guid;
    }
    return null;
  }
  const wanted = normalizeDirectChatIdentifier(target.chatIdentifier);
  for (const chat of chats) {
    const identifier = stringFromUnknown(chat.identifier);
    const guid = stringFromUnknown(chat.guid);
    if (!guid) continue;
    if (
      identifier === target.chatIdentifier ||
      guid === target.chatIdentifier ||
      (identifier && normalizeDirectChatIdentifier(identifier) === wanted) ||
      normalizeDirectChatIdentifier(guid) === wanted
    )
      return guid;
  }
  return null;
}
async function runIMessageCliJson(args, options) {
  return await runIMessageCliJsonCommand({
    args,
    cliPath: options.cliPath,
    dbPath: options.dbPath,
    timeoutMs: options.timeoutMs,
  });
}
function resolveMessageId(result) {
  return (
    (typeof result.messageGuid === "string" && result.messageGuid.trim()) ||
    (typeof result.messageId === "string" && result.messageId.trim()) ||
    (typeof result.guid === "string" && result.guid.trim()) ||
    (typeof result.id === "string" && result.id.trim()) ||
    "ok"
  );
}
async function withTempFile(input, fn) {
  const dir = await mkdtemp(join(resolvePreferredOpenClawTmpDir(), "openclaw-imessage-"));
  const filePath = join(dir, `upload${extname(input.filename).slice(0, 16) || ".bin"}`);
  try {
    await writeFile(filePath, input.buffer);
    return await fn(filePath);
  } finally {
    await rm(dir, {
      recursive: true,
      force: true,
    });
  }
}
const imessageActionsRuntime = {
  resolveIMessageMessageId,
  async resolveChatGuidForTarget(params) {
    const cached = chatListCacheGet(params.options.cliPath, params.options.dbPath);
    if (cached) return findChatGuid(cached, params.target);
    const client = await createIMessageRpcClient({
      cliPath: params.options.cliPath,
      dbPath: params.options.dbPath,
    });
    try {
      const list = asChatList(
        await client.request("chats.list", { limit: 1e3 }, { timeoutMs: params.options.timeoutMs }),
      );
      chatListCacheSet(params.options.cliPath, params.options.dbPath, list);
      return findChatGuid(list, params.target);
    } finally {
      await client.stop();
    }
  },
  async sendReaction(params) {
    await runIMessageCliJson(
      [
        "tapback",
        "--chat",
        params.chatGuid,
        "--message",
        params.messageId,
        "--kind",
        params.reaction,
        "--part",
        String(params.partIndex ?? 0),
        ...(params.remove ? ["--remove"] : []),
      ],
      params.options,
    );
  },
  async editMessage(params) {
    await runIMessageCliJson(
      [
        "edit",
        "--chat",
        params.chatGuid,
        "--message",
        params.messageId,
        "--new-text",
        params.text,
        "--bc-text",
        params.backwardsCompatMessage ?? params.text,
        "--part",
        String(params.partIndex ?? 0),
      ],
      params.options,
    );
  },
  async unsendMessage(params) {
    await runIMessageCliJson(
      [
        "unsend",
        "--chat",
        params.chatGuid,
        "--message",
        params.messageId,
        "--part",
        String(params.partIndex ?? 0),
      ],
      params.options,
    );
  },
  async sendRichMessage(params) {
    const formatted = extractMarkdownFormatRuns(params.text);
    const buildArgs = (filePath) => [
      "send-rich",
      "--chat",
      params.chatGuid,
      "--text",
      formatted.text,
      "--part",
      String(params.partIndex ?? 0),
      ...(params.effectId ? ["--effect", params.effectId] : []),
      ...(params.replyToMessageId ? ["--reply-to", params.replyToMessageId] : []),
      ...(formatted.ranges.length > 0 ? ["--format", JSON.stringify(formatted.ranges)] : []),
      ...(filePath ? ["--file", filePath] : []),
    ];
    if (params.attachment)
      return await withTempFile(
        {
          buffer: params.attachment.buffer,
          filename: params.attachment.filename,
        },
        async (filePath) => {
          return {
            messageId: resolveMessageId(
              await runIMessageCliJson(buildArgs(filePath), params.options),
            ),
          };
        },
      );
    return { messageId: resolveMessageId(await runIMessageCliJson(buildArgs(), params.options)) };
  },
  async renameGroup(params) {
    await runIMessageCliJson(
      ["chat-name", "--chat", params.chatGuid, "--name", params.displayName],
      params.options,
    );
  },
  async setGroupIcon(params) {
    await withTempFile(
      {
        buffer: params.buffer,
        filename: params.filename,
      },
      async (filePath) => {
        await runIMessageCliJson(
          ["chat-photo", "--chat", params.chatGuid, "--file", filePath],
          params.options,
        );
      },
    );
  },
  async addParticipant(params) {
    await runIMessageCliJson(
      ["chat-add-member", "--chat", params.chatGuid, "--address", params.address],
      params.options,
    );
  },
  async removeParticipant(params) {
    await runIMessageCliJson(
      ["chat-remove-member", "--chat", params.chatGuid, "--address", params.address],
      params.options,
    );
  },
  async leaveGroup(params) {
    await runIMessageCliJson(["chat-leave", "--chat", params.chatGuid], params.options);
  },
  async sendPoll(params) {
    return {
      messageId: resolveMessageId(
        await runIMessageCliJson(
          [
            "poll",
            "send",
            "--chat",
            params.chatGuid,
            "--question",
            params.question,
            ...params.choices.flatMap((choice) => ["--option", choice]),
            ...(params.replyToMessageId ? ["--reply-to", params.replyToMessageId] : []),
          ],
          params.options,
        ),
      ),
    };
  },
  async sendPollVote(params) {
    const selector = params.optionId
      ? ["--option-id", params.optionId]
      : params.optionIndex !== void 0
        ? ["--option-index", String(params.optionIndex)]
        : params.optionText
          ? ["--option", params.optionText]
          : [];
    const result = await runIMessageCliJson(
      ["poll", "vote", "--chat", params.chatGuid, "--poll", params.pollGuid, ...selector],
      params.options,
    );
    const optionText = typeof result.optionText === "string" ? result.optionText.trim() : "";
    return {
      messageId: resolveMessageId(result),
      ...(optionText ? { optionText } : {}),
    };
  },
  async sendAttachment(params) {
    return await withTempFile(
      {
        buffer: params.buffer,
        filename: params.filename,
      },
      async (filePath) => {
        return {
          messageId: resolveMessageId(
            await runIMessageCliJson(
              [
                "send-attachment",
                "--chat",
                params.chatGuid,
                "--file",
                filePath,
                ...(params.asVoice ? ["--audio"] : []),
              ],
              params.options,
            ),
          ),
        };
      },
    );
  },
};
//#endregion
export { findChatGuidForTest, imessageActionsRuntime, normalizeDirectChatIdentifierForTest };
