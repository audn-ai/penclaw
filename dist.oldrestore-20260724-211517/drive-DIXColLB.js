import { Type } from "typebox";
import {
  b as parseFeishuCommentTarget,
  d as extractReplyText,
  f as formatFeishuApiError,
  g as readString,
  i as listFeishuAccountIds,
  l as resolveFeishuRuntimeAccount,
  p as isRecord,
  r as listEnabledFeishuAccounts,
  s as resolveFeishuAccount,
  u as encodeQuery,
} from "./accounts-upJPqv8I.js";
import { n as createFeishuClient } from "./client-BCjLU970.js";
import { h as readPositiveIntegerParam } from "./common-DyDSUect.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import "./error-runtime-BIAwr399.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./channel-actions-C9vNf9jw.js";
import "./param-readers-8wnI_A3p.js";
import {
  c as assertFeishuChatReadAllowed,
  l as authorizeFeishuChatMemberRead,
  m as resolveFeishuChatReadPreliminaryAuthorization,
  w as resolveFeishuChatType,
} from "./send-result-BY9GGIVt.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as jsonResult } from "./tool-results-BCM3fdVS.js";
import { a as optionalPositiveIntegerSchema } from "./typebox-D411BFJf.js";
//#region extensions/feishu/src/tools-config.ts
/**
 * Default tool configuration.
 * - doc, chat, wiki, drive, scopes, bitable/base: enabled by default
 * - perm: disabled by default (sensitive operation)
 */
const DEFAULT_TOOLS_CONFIG = {
  doc: true,
  chat: true,
  wiki: true,
  drive: true,
  perm: false,
  scopes: true,
  bitable: true,
  base: true,
};
/**
 * Resolve tools config with defaults.
 *
 * `base` is a backward-compatible alias for the Bitable tool family. When both
 * keys are present, the explicit `bitable` value wins and `base` mirrors it.
 */
function resolveToolsConfig(cfg) {
  const bitable = cfg?.bitable ?? cfg?.base ?? DEFAULT_TOOLS_CONFIG.bitable;
  return {
    ...DEFAULT_TOOLS_CONFIG,
    ...cfg,
    bitable,
    base: bitable,
  };
}
//#endregion
//#region extensions/feishu/src/tool-account.ts
function resolveImplicitToolAccountId(params) {
  const explicitAccountId = normalizeOptionalString(params.executeParams?.accountId);
  if (explicitAccountId) return explicitAccountId;
  const contextualAccountId = normalizeOptionalString(params.defaultAccountId);
  if (
    contextualAccountId &&
    listFeishuAccountIds(params.api.config).includes(contextualAccountId)
  ) {
    if (
      resolveFeishuAccount({
        cfg: params.api.config,
        accountId: contextualAccountId,
      }).enabled
    )
      return contextualAccountId;
  }
  const configuredDefaultAccountId = normalizeOptionalString(
    params.api.config?.channels?.feishu?.defaultAccount,
  );
  if (configuredDefaultAccountId) return configuredDefaultAccountId;
  if (params.requiredTool && params.api.config)
    for (const accountId of listFeishuAccountIds(params.api.config)) {
      const account = resolveFeishuAccount({
        cfg: params.api.config,
        accountId,
      });
      if (
        account.enabled &&
        account.configured &&
        resolveToolsConfig(account.config.tools)[params.requiredTool.family]
      )
        return accountId;
    }
}
function resolveFeishuToolAccount(params) {
  if (!params.api.config) throw new Error("Feishu config unavailable");
  const account = resolveFeishuRuntimeAccount({
    cfg: params.api.config,
    accountId: resolveImplicitToolAccountId(params),
  });
  if (params.requiredTool && !resolveToolsConfig(account.config.tools)[params.requiredTool.family])
    throw new Error(
      `Feishu ${params.requiredTool.label} tools are disabled for account "${account.accountId}"`,
    );
  return account;
}
function createFeishuToolClient(params) {
  return createFeishuClient(resolveFeishuToolAccount(params));
}
function resolveAnyEnabledFeishuToolsConfig(accounts) {
  const merged = {
    doc: false,
    chat: false,
    wiki: false,
    drive: false,
    perm: false,
    scopes: false,
    bitable: false,
    base: false,
  };
  for (const account of accounts) {
    const cfg = resolveToolsConfig(account.config.tools);
    merged.doc = merged.doc || cfg.doc;
    merged.chat = merged.chat || cfg.chat;
    merged.wiki = merged.wiki || cfg.wiki;
    merged.drive = merged.drive || cfg.drive;
    merged.perm = merged.perm || cfg.perm;
    merged.scopes = merged.scopes || cfg.scopes;
    merged.bitable = merged.bitable || cfg.bitable;
    merged.base = merged.base || cfg.base;
  }
  return merged;
}
//#endregion
//#region extensions/feishu/src/chat-schema.ts
const CHAT_ACTION_VALUES = ["members", "info", "member_info"];
const MEMBER_ID_TYPE_VALUES = ["open_id", "user_id", "union_id"];
const FeishuChatSchema = Type.Object({
  action: Type.Unsafe({
    type: "string",
    enum: [...CHAT_ACTION_VALUES],
    description: "Action to run: members | info | member_info",
  }),
  chat_id: Type.Optional(Type.String({ description: "Chat ID (from URL or event payload)" })),
  member_id: Type.Optional(Type.String({ description: "Member ID for member_info lookups" })),
  page_size: optionalPositiveIntegerSchema({
    maximum: 100,
    description: "Page size (1-100, default 50)",
  }),
  page_token: Type.Optional(Type.String({ description: "Pagination token" })),
  member_id_type: Type.Optional(
    Type.Unsafe({
      type: "string",
      enum: [...MEMBER_ID_TYPE_VALUES],
      description: "Member ID type (default: open_id)",
    }),
  ),
});
//#endregion
//#region extensions/feishu/src/chat.ts
function readChatPageSize(params) {
  return readPositiveIntegerParam(params, "page_size", {
    max: 100,
    message: "page_size must be a positive integer between 1 and 100",
  });
}
function buildFeishuDirectChatMembers(authorization) {
  return {
    chat_id: authorization.chatId,
    has_more: false,
    page_token: void 0,
    members: [
      {
        member_id: authorization.memberId,
        name: void 0,
        tenant_key: void 0,
        member_id_type: authorization.memberIdType,
      },
    ],
  };
}
async function getChatInfo(client, chatId) {
  const res = await client.im.chat.get({ path: { chat_id: chatId } });
  if (res.code !== 0) throw new Error(res.msg);
  const chat = res.data;
  return {
    chat_id: chatId,
    name: chat?.name,
    description: chat?.description,
    owner_id: chat?.owner_id,
    tenant_key: chat?.tenant_key,
    user_count: chat?.user_count,
    chat_mode: chat?.chat_mode,
    chat_type: chat?.chat_type,
    join_message_visibility: chat?.join_message_visibility,
    leave_message_visibility: chat?.leave_message_visibility,
    membership_approval: chat?.membership_approval,
    moderation_permission: chat?.moderation_permission,
    avatar: chat?.avatar,
  };
}
function authorizeFeishuChatInfo(params) {
  assertFeishuChatReadAllowed({
    cfg: params.cfg,
    account: params.account,
    chatId: params.chatId,
    chatType: resolveFeishuChatType(params.chat),
    ctx: params.ctx,
  });
}
async function getAuthorizedFeishuChatInfo(params) {
  const preliminary = resolveFeishuChatReadPreliminaryAuthorization({
    cfg: params.cfg,
    account: params.account,
    chatId: params.chatId,
    ctx: params.ctx,
  });
  if (preliminary.decision === "deny")
    assertFeishuChatReadAllowed({
      cfg: params.cfg,
      account: params.account,
      chatId: preliminary.chatId,
      ctx: params.ctx,
    });
  let chat;
  try {
    chat = await getChatInfo(params.client, preliminary.chatId);
  } catch (error) {
    if (preliminary.decision === "needs-metadata")
      assertFeishuChatReadAllowed({
        cfg: params.cfg,
        account: params.account,
        chatId: preliminary.chatId,
        ctx: params.ctx,
      });
    throw error;
  }
  authorizeFeishuChatInfo({
    cfg: params.cfg,
    account: params.account,
    chatId: preliminary.chatId,
    chat,
    ctx: params.ctx,
  });
  return chat;
}
async function getChatMembers(client, chatId, pageSize, pageToken, memberIdType) {
  const page_size = pageSize ? Math.max(1, Math.min(100, pageSize)) : 50;
  const res = await client.im.chatMembers.get({
    path: { chat_id: chatId },
    params: {
      page_size,
      page_token: pageToken,
      member_id_type: memberIdType ?? "open_id",
    },
  });
  if (res.code !== 0) throw new Error(res.msg);
  return {
    chat_id: chatId,
    has_more: res.data?.has_more,
    page_token: res.data?.page_token,
    members:
      res.data?.items?.map((item) => ({
        member_id: item.member_id,
        name: item.name,
        tenant_key: item.tenant_key,
        member_id_type: item.member_id_type,
      })) ?? [],
  };
}
async function assertFeishuChatMember(client, chatId, memberId, memberIdType = "open_id") {
  let pageToken;
  const seenPageTokens = /* @__PURE__ */ new Set();
  while (true) {
    const members = await getChatMembers(client, chatId, 100, pageToken, memberIdType);
    if (members.members.some((member) => member.member_id === memberId)) return;
    if (!members.has_more || !members.page_token) break;
    if (seenPageTokens.has(members.page_token))
      throw new Error(`Feishu chat member pagination repeated token for chat ${chatId}`);
    seenPageTokens.add(members.page_token);
    pageToken = members.page_token;
  }
  throw new Error(`Member ${memberId} is not a member of chat ${chatId}`);
}
async function getFeishuMemberInfo(client, memberId, memberIdType = "open_id") {
  const res = await client.contact.user.get({
    path: { user_id: memberId },
    params: {
      user_id_type: memberIdType,
      department_id_type: "open_department_id",
    },
  });
  if (res.code !== 0) throw new Error(res.msg);
  const user = res.data?.user;
  return {
    member_id: memberId,
    member_id_type: memberIdType,
    open_id: user?.open_id,
    user_id: user?.user_id,
    union_id: user?.union_id,
    name: user?.name,
    en_name: user?.en_name,
    nickname: user?.nickname,
    email: user?.email,
    enterprise_email: user?.enterprise_email,
    mobile: user?.mobile,
    mobile_visible: user?.mobile_visible,
    status: user?.status,
    avatar: user?.avatar,
    department_ids: user?.department_ids,
    department_path: user?.department_path,
    leader_user_id: user?.leader_user_id,
    city: user?.city,
    country: user?.country,
    work_station: user?.work_station,
    join_time: user?.join_time,
    is_tenant_manager: user?.is_tenant_manager,
    employee_no: user?.employee_no,
    employee_type: user?.employee_type,
    description: user?.description,
    job_title: user?.job_title,
    geo: user?.geo,
  };
}
function registerFeishuChatTools(api) {
  if (!api.config) return;
  const cfg = api.config;
  const accounts = listEnabledFeishuAccounts(cfg);
  if (accounts.length === 0) return;
  if (!resolveAnyEnabledFeishuToolsConfig(accounts).chat) return;
  api.registerTool(
    (toolContext) => ({
      name: "feishu_chat",
      label: "Feishu Chat",
      description: "Feishu chat operations. Actions: members, info, member_info",
      parameters: FeishuChatSchema,
      async execute(_toolCallId, params) {
        const rawParams = params;
        const p = params;
        try {
          const account = resolveFeishuToolAccount({
            api,
            defaultAccountId: toolContext.agentAccountId,
            requiredTool: {
              family: "chat",
              label: "chat",
            },
          });
          const client = createFeishuClient(account);
          switch (p.action) {
            case "members":
              if (!p.chat_id)
                return jsonResult({ error: "chat_id is required for action members" });
              {
                const chat = await getAuthorizedFeishuChatInfo({
                  client,
                  cfg,
                  account,
                  chatId: p.chat_id,
                  ctx: toolContext,
                });
                const authorization = authorizeFeishuChatMemberRead({
                  cfg,
                  account,
                  chatId: p.chat_id,
                  chatType: resolveFeishuChatType(chat),
                  ctx: toolContext,
                  memberIdType: p.member_id_type,
                });
                if (authorization.kind === "direct")
                  return jsonResult(buildFeishuDirectChatMembers(authorization));
              }
              return jsonResult(
                await getChatMembers(
                  client,
                  p.chat_id,
                  readChatPageSize(rawParams),
                  p.page_token,
                  p.member_id_type,
                ),
              );
            case "info":
              if (!p.chat_id) return jsonResult({ error: "chat_id is required for action info" });
              return jsonResult(
                await getAuthorizedFeishuChatInfo({
                  client,
                  cfg,
                  account,
                  chatId: p.chat_id,
                  ctx: toolContext,
                }),
              );
            case "member_info":
              if (!p.member_id)
                return jsonResult({ error: "member_id is required for action member_info" });
              if (!p.chat_id)
                return jsonResult({ error: "chat_id is required for action member_info" });
              {
                const chat = await getAuthorizedFeishuChatInfo({
                  client,
                  cfg,
                  account,
                  chatId: p.chat_id,
                  ctx: toolContext,
                });
                const authorization = authorizeFeishuChatMemberRead({
                  cfg,
                  account,
                  chatId: p.chat_id,
                  chatType: resolveFeishuChatType(chat),
                  ctx: toolContext,
                  memberId: p.member_id,
                  memberIdType: p.member_id_type,
                });
                if (authorization.kind === "group") {
                  const memberIdType = p.member_id_type ?? "open_id";
                  await assertFeishuChatMember(client, p.chat_id, p.member_id, memberIdType);
                  return jsonResult(await getFeishuMemberInfo(client, p.member_id, memberIdType));
                }
                return jsonResult(
                  await getFeishuMemberInfo(
                    client,
                    authorization.memberId,
                    authorization.memberIdType,
                  ),
                );
              }
            default:
              return jsonResult({ error: `Unknown action: ${String(p.action)}` });
          }
        } catch (err) {
          return jsonResult({
            error: formatFeishuApiError(err, { includeNestedErrorLogId: true }),
          });
        }
      },
    }),
    { name: "feishu_chat" },
  );
}
//#endregion
//#region extensions/feishu/src/tool-result.ts
function unknownToolActionResult(action) {
  return jsonResult({ error: `Unknown action: ${String(action)}` });
}
function toolExecutionErrorResult(error) {
  return jsonResult({ error: formatErrorMessage(error) });
}
//#endregion
//#region extensions/feishu/src/comment-reaction.ts
const COMMENT_TYPING_REACTION_TYPE = "Typing";
const COMMENT_REACTION_TIMEOUT_MS = 3e4;
const commentTypingReactionState = /* @__PURE__ */ new Map();
function buildCommentTypingReactionKey(params) {
  return `${params.fileType}:${params.fileToken}:${params.replyId}`;
}
function ensureCommentTypingReactionState(key) {
  const existing = commentTypingReactionState.get(key);
  if (existing) return existing;
  const created = {
    active: false,
    cleaned: false,
    cleanupPromise: void 0,
  };
  commentTypingReactionState.set(key, created);
  return created;
}
async function requestCommentTypingReactionWithClient(params) {
  try {
    const response = await params.client.request({
      method: "POST",
      url:
        `/open-apis/drive/v2/files/${encodeURIComponent(params.fileToken)}/comments/reaction` +
        encodeQuery({ file_type: params.fileType }),
      data: {
        action: params.action,
        reply_id: params.replyId,
        reaction_type: COMMENT_TYPING_REACTION_TYPE,
      },
      timeout: COMMENT_REACTION_TIMEOUT_MS,
    });
    if (response.code === 0) return true;
    params.runtime?.log?.(
      `${params.logPrefix ?? "[feishu]"}: comment typing reaction ${params.action} failed reply=${params.replyId} file=${params.fileType}:${params.fileToken} code=${response.code ?? "unknown"} msg=${response.msg ?? "unknown"} log_id=${response.log_id ?? response.error?.log_id ?? "unknown"}`,
    );
  } catch (error) {
    params.runtime?.log?.(
      `${params.logPrefix ?? "[feishu]"}: comment typing reaction ${params.action} threw reply=${params.replyId} file=${params.fileType}:${params.fileToken} error=${formatCommentReactionFailure(error)}`,
    );
  }
  return false;
}
function formatCommentReactionFailure(error) {
  return formatFeishuApiError(error, { includeNestedErrorLogId: true });
}
async function requestCommentTypingReaction(params) {
  const account = resolveFeishuRuntimeAccount({
    cfg: params.cfg,
    accountId: params.accountId,
  });
  if (!account.configured || !(account.config.typingIndicator ?? true)) return false;
  return requestCommentTypingReactionWithClient({
    client: createFeishuClient(account),
    fileToken: params.fileToken,
    fileType: params.fileType,
    replyId: params.replyId,
    action: params.action,
    runtime: params.runtime,
    logPrefix: `feishu[${account.accountId}]`,
  });
}
async function cleanupCommentTypingReactionByKey(params) {
  const state = ensureCommentTypingReactionState(params.key);
  if (state.cleaned) return false;
  if (state.cleanupPromise) return await state.cleanupPromise;
  const cleanupPromise = (async () => {
    if (!state.active) {
      state.cleaned = true;
      return false;
    }
    const deleted = await params.performDelete();
    if (deleted) {
      state.cleaned = true;
      state.active = false;
    }
    return deleted;
  })();
  state.cleanupPromise = cleanupPromise;
  try {
    return await cleanupPromise;
  } finally {
    state.cleanupPromise = void 0;
    if (state.cleaned) {
      state.active = false;
      commentTypingReactionState.delete(params.key);
    }
  }
}
async function cleanupAmbientCommentTypingReaction(params) {
  const deliveryContext = params.deliveryContext;
  if (
    deliveryContext?.channel &&
    deliveryContext.channel !== "feishu" &&
    deliveryContext.channel !== "feishu-comment"
  )
    return false;
  const target = parseFeishuCommentTarget(deliveryContext?.to);
  const replyId =
    typeof deliveryContext?.threadId === "string" || typeof deliveryContext?.threadId === "number"
      ? String(deliveryContext.threadId).trim()
      : "";
  if (!target || !replyId) return false;
  return cleanupCommentTypingReactionByKey({
    key: buildCommentTypingReactionKey({
      fileToken: target.fileToken,
      fileType: target.fileType,
      replyId,
    }),
    performDelete: () =>
      requestCommentTypingReactionWithClient({
        client: params.client,
        fileToken: target.fileToken,
        fileType: target.fileType,
        replyId,
        action: "delete",
        runtime: params.runtime,
        logPrefix: "[feishu]",
      }),
  });
}
function createCommentTypingReactionLifecycle(params) {
  const key = params.replyId?.trim()
    ? buildCommentTypingReactionKey({
        fileToken: params.fileToken,
        fileType: params.fileType,
        replyId: params.replyId.trim(),
      })
    : void 0;
  const state = key ? ensureCommentTypingReactionState(key) : void 0;
  return {
    start: async () => {
      const replyId = params.replyId?.trim();
      if (!state || state.cleaned || state.active || !replyId) return;
      state.active = await requestCommentTypingReaction({
        cfg: params.cfg,
        fileToken: params.fileToken,
        fileType: params.fileType,
        replyId,
        action: "add",
        accountId: params.accountId,
        runtime: params.runtime,
      });
    },
    cleanup: async () => {
      const replyId = params.replyId?.trim();
      if (!key || !replyId) return;
      await cleanupCommentTypingReactionByKey({
        key,
        performDelete: () =>
          requestCommentTypingReaction({
            cfg: params.cfg,
            fileToken: params.fileToken,
            fileType: params.fileType,
            replyId,
            action: "delete",
            accountId: params.accountId,
            runtime: params.runtime,
          }),
      });
    },
  };
}
//#endregion
//#region extensions/feishu/src/drive-schema.ts
const FileType = Type.Union([
  Type.Literal("doc"),
  Type.Literal("docx"),
  Type.Literal("sheet"),
  Type.Literal("bitable"),
  Type.Literal("folder"),
  Type.Literal("file"),
  Type.Literal("mindnote"),
  Type.Literal("shortcut"),
]);
const CommentFileType = Type.Union([
  Type.Literal("doc"),
  Type.Literal("docx"),
  Type.Literal("sheet"),
  Type.Literal("file"),
  Type.Literal("slides"),
]);
const FeishuDriveSchema = Type.Union([
  Type.Object({
    action: Type.Literal("list"),
    folder_token: Type.Optional(
      Type.String({ description: "Folder token (optional, omit for root directory)" }),
    ),
    page_size: Type.Optional(
      Type.Integer({
        minimum: 1,
        maximum: 200,
        description: "Items per folder page (1-200; requires folder_token)",
      }),
    ),
    page_token: Type.Optional(
      Type.String({
        description: "Continuation token from a prior list result (requires the same folder_token)",
      }),
    ),
  }),
  Type.Object({
    action: Type.Literal("info"),
    file_token: Type.String({ description: "File or folder token" }),
    type: FileType,
  }),
  Type.Object({
    action: Type.Literal("create_folder"),
    name: Type.String({ description: "Folder name" }),
    folder_token: Type.Optional(
      Type.String({ description: "Parent folder token (optional, omit for root)" }),
    ),
  }),
  Type.Object({
    action: Type.Literal("move"),
    file_token: Type.String({ description: "File token to move" }),
    type: FileType,
    folder_token: Type.String({ description: "Target folder token" }),
  }),
  Type.Object({
    action: Type.Literal("delete"),
    file_token: Type.String({ description: "File token to delete" }),
    type: FileType,
  }),
  Type.Object({
    action: Type.Literal("list_comments"),
    file_token: Type.String({ description: "Document token" }),
    file_type: Type.Optional(CommentFileType),
    page_size: Type.Optional(
      Type.Integer({
        minimum: 1,
        maximum: 100,
        description: "Page size",
      }),
    ),
    page_token: Type.Optional(Type.String({ description: "Comment page token" })),
  }),
  Type.Object({
    action: Type.Literal("list_comment_replies"),
    file_token: Type.String({ description: "Document token" }),
    file_type: Type.Optional(CommentFileType),
    comment_id: Type.String({ description: "Comment id" }),
    page_size: Type.Optional(
      Type.Integer({
        minimum: 1,
        maximum: 100,
        description: "Page size",
      }),
    ),
    page_token: Type.Optional(Type.String({ description: "Reply page token" })),
  }),
  Type.Object({
    action: Type.Literal("add_comment"),
    file_token: Type.String({ description: "Document token" }),
    file_type: Type.Optional(
      Type.Union([Type.Literal("doc"), Type.Literal("docx")], {
        description: "Document type. Defaults to docx when omitted.",
      }),
    ),
    content: Type.String({ description: "Comment text content" }),
    block_id: Type.Optional(
      Type.String({
        description:
          "Optional docx block id for a local comment. Omit to create a full-document comment.",
      }),
    ),
  }),
  Type.Object({
    action: Type.Literal("reply_comment"),
    file_token: Type.String({ description: "Document token" }),
    file_type: Type.Optional(CommentFileType),
    comment_id: Type.String({ description: "Comment id" }),
    content: Type.String({ description: "Reply text content" }),
  }),
]);
//#endregion
//#region extensions/feishu/src/drive.ts
var FeishuReplyCommentError = class extends Error {
  constructor(params) {
    super(params.message);
    this.name = "FeishuReplyCommentError";
    this.httpStatus = params.httpStatus;
    this.feishuCode = params.feishuCode;
    this.feishuMsg = params.feishuMsg;
    this.feishuLogId = params.feishuLogId;
  }
};
const FEISHU_DRIVE_REQUEST_TIMEOUT_MS = 3e4;
function getDriveInternalClient(client) {
  return client;
}
function buildReplyElements(content) {
  return [
    {
      type: "text",
      text: content,
    },
  ];
}
async function requestDriveApi(params) {
  return await getDriveInternalClient(params.client).request({
    method: params.method,
    url: params.url,
    params: params.query ?? {},
    data: params.data ?? {},
    timeout: FEISHU_DRIVE_REQUEST_TIMEOUT_MS,
  });
}
function assertDriveApiSuccess(response) {
  if (response.code !== 0) throw new Error(response.msg ?? "Feishu Drive API request failed");
  return response;
}
function normalizeCommentReply(reply) {
  return {
    reply_id: reply.reply_id,
    user_id: reply.user_id,
    create_time: reply.create_time,
    update_time: reply.update_time,
    text: extractReplyText(reply),
  };
}
function normalizeCommentCard(comment) {
  const replies = comment.reply_list?.replies ?? [];
  const rootReply = replies[0];
  return {
    comment_id: comment.comment_id,
    user_id: comment.user_id,
    create_time: comment.create_time,
    update_time: comment.update_time,
    is_solved: comment.is_solved,
    is_whole: comment.is_whole,
    quote: comment.quote,
    text: extractReplyText(rootReply),
    has_more_replies: comment.has_more,
    replies_page_token: comment.page_token,
    replies: replies.slice(1).map(normalizeCommentReply),
  };
}
function normalizeCommentPageSize(pageSize) {
  if (typeof pageSize !== "number" || !Number.isFinite(pageSize)) return;
  return String(Math.min(Math.max(Math.floor(pageSize), 1), 100));
}
function resolveAmbientCommentTarget(context) {
  const deliveryContext = context?.deliveryContext;
  if (deliveryContext?.channel && deliveryContext.channel !== "feishu") return null;
  return parseFeishuCommentTarget(deliveryContext?.to);
}
function applyAmbientCommentDefaults(params, context) {
  const ambient = resolveAmbientCommentTarget(context);
  if (!ambient) return params;
  return {
    ...params,
    file_token: params.file_token?.trim() || ambient.fileToken,
    file_type: params.file_type ?? ambient.fileType,
    comment_id: params.comment_id?.trim() || ambient.commentId,
  };
}
function applyAddCommentAmbientDefaults(params, context) {
  const ambient = resolveAmbientCommentTarget(context);
  if (!ambient || (ambient.fileType !== "doc" && ambient.fileType !== "docx")) return params;
  return {
    ...params,
    file_token: params.file_token?.trim() || ambient.fileToken,
    file_type: params.file_type ?? ambient.fileType,
  };
}
function applyAddCommentDefaults(params) {
  const fileType = params.file_type ?? "docx";
  if (!params.file_type)
    console.info(
      `[feishu_drive] add_comment missing file_type; defaulting to docx file_token=${params.file_token ?? "unknown"}`,
    );
  return {
    ...params,
    file_type: fileType,
  };
}
function applyCommentFileTypeDefault(params, action) {
  const fileType = params.file_type ?? "docx";
  if (!params.file_type)
    console.info(
      `[feishu_drive] ${action} missing file_type; defaulting to docx file_token=${params.file_token ?? "unknown"}`,
    );
  return {
    ...params,
    file_type: fileType,
  };
}
function formatDriveApiError(error) {
  return formatFeishuApiError(error, { includeConfigParams: true });
}
function extractDriveApiErrorMeta(error) {
  if (!isRecord(error))
    return { message: typeof error === "string" ? error : JSON.stringify(error) };
  const response = isRecord(error.response) ? error.response : void 0;
  const responseData = isRecord(response?.data) ? response?.data : void 0;
  return {
    message:
      typeof error.message === "string"
        ? error.message
        : typeof error === "string"
          ? error
          : JSON.stringify(error),
    httpStatus: typeof response?.status === "number" ? response.status : void 0,
    feishuCode:
      typeof responseData?.code === "number" ? responseData.code : readString(responseData?.code),
    feishuMsg: readString(responseData?.msg),
    feishuLogId: readString(responseData?.log_id),
  };
}
function isReplyNotAllowedError(error) {
  if (!(error instanceof FeishuReplyCommentError)) return false;
  return error.feishuCode === 1069302;
}
async function getRootFolderToken(client) {
  const internalClient = getDriveInternalClient(client);
  const domain = internalClient.domain ?? "https://open.feishu.cn";
  const res = await internalClient.httpInstance.get(
    `${domain}/open-apis/drive/explorer/v2/root_folder/meta`,
  );
  if (res.code !== 0) throw new Error(res.msg ?? "Failed to get root folder");
  const token = res.data?.token;
  if (!token) throw new Error("Root folder token not found");
  return token;
}
async function listFolder(client, params = {}) {
  const folderToken = typeof params.folder_token === "string" ? params.folder_token.trim() : void 0;
  const validFolderToken = folderToken && folderToken !== "0" ? folderToken : void 0;
  const pageSize = readPositiveIntegerParam(params, "page_size", {
    max: 200,
    message: "page_size must be a positive integer between 1 and 200",
  });
  const pageToken = typeof params.page_token === "string" ? params.page_token.trim() : void 0;
  const listParams = validFolderToken
    ? {
        folder_token: validFolderToken,
        ...(pageSize ? { page_size: pageSize } : {}),
        ...(pageToken ? { page_token: pageToken } : {}),
      }
    : {};
  const res = await client.drive.file.list({ params: listParams });
  if (res.code !== 0) throw new Error(res.msg);
  return {
    files:
      res.data?.files?.map((f) => ({
        token: f.token,
        name: f.name,
        type: f.type,
        url: f.url,
        created_time: f.created_time,
        modified_time: f.modified_time,
        owner_id: f.owner_id,
      })) ?? [],
    next_page_token: res.data?.next_page_token,
  };
}
async function getRootFileInfo(client, fileToken) {
  const res = await client.drive.file.list({ params: {} });
  if (res.code !== 0) throw new Error(res.msg);
  const file = res.data?.files?.find((candidate) => candidate.token === fileToken);
  if (!file) throw new Error(`File not found: ${fileToken}`);
  return {
    token: file.token,
    name: file.name,
    type: file.type,
    url: file.url,
    created_time: file.created_time,
    modified_time: file.modified_time,
    owner_id: file.owner_id,
  };
}
async function getFileInfo(client, fileToken, type) {
  if (type === "shortcut") return getRootFileInfo(client, fileToken);
  let res;
  try {
    res = await client.drive.meta.batchQuery({
      data: {
        request_docs: [
          {
            doc_token: fileToken,
            doc_type: type,
          },
        ],
        with_url: true,
      },
    });
  } catch (error) {
    if (extractDriveApiErrorMeta(error).feishuCode === 99991672)
      return getRootFileInfo(client, fileToken);
    throw error;
  }
  if (res.code === 99991672) return getRootFileInfo(client, fileToken);
  if (res.code !== 0) throw new Error(res.msg);
  const file = res.data?.metas?.find(
    (meta) => meta.doc_token === fileToken || meta.request_doc_info?.doc_token === fileToken,
  );
  if (!file) throw new Error(`File not found: ${fileToken}`);
  return {
    token: file.doc_token,
    name: file.title,
    type: file.doc_type,
    url: file.url,
    created_time: file.create_time,
    modified_time: file.latest_modify_time,
    owner_id: file.owner_id,
  };
}
async function createFolder(client, name, folderToken) {
  let effectiveToken = folderToken && folderToken !== "0" ? folderToken : "0";
  if (effectiveToken === "0")
    try {
      effectiveToken = await getRootFolderToken(client);
    } catch {}
  const res = await client.drive.file.createFolder({
    data: {
      name,
      folder_token: effectiveToken,
    },
  });
  if (res.code !== 0) throw new Error(res.msg);
  return {
    token: res.data?.token,
    url: res.data?.url,
  };
}
async function moveFile(client, fileToken, type, folderToken) {
  const res = await client.drive.file.move({
    path: { file_token: fileToken },
    data: {
      type,
      folder_token: folderToken,
    },
  });
  if (res.code !== 0) throw new Error(res.msg);
  return {
    success: true,
    task_id: res.data?.task_id,
  };
}
async function deleteFile(client, fileToken, type) {
  const res = await client.drive.file.delete({
    path: { file_token: fileToken },
    params: { type },
  });
  if (res.code !== 0) throw new Error(res.msg);
  return {
    success: true,
    task_id: res.data?.task_id,
  };
}
async function listComments(client, params) {
  const response = assertDriveApiSuccess(
    await requestDriveApi({
      client,
      method: "GET",
      url:
        `/open-apis/drive/v1/files/${encodeURIComponent(params.file_token)}/comments` +
        encodeQuery({
          file_type: params.file_type,
          page_size: normalizeCommentPageSize(params.page_size),
          page_token: params.page_token,
          user_id_type: "open_id",
        }),
    }),
  );
  return {
    has_more: response.data?.has_more ?? false,
    page_token: response.data?.page_token,
    comments: (response.data?.items ?? []).map(normalizeCommentCard),
  };
}
async function listCommentReplies(client, params) {
  const response = assertDriveApiSuccess(
    await requestDriveApi({
      client,
      method: "GET",
      url:
        `/open-apis/drive/v1/files/${encodeURIComponent(params.file_token)}/comments/${encodeURIComponent(params.comment_id)}/replies` +
        encodeQuery({
          file_type: params.file_type,
          page_size: normalizeCommentPageSize(params.page_size),
          page_token: params.page_token,
          user_id_type: "open_id",
        }),
    }),
  );
  return {
    has_more: response.data?.has_more ?? false,
    page_token: response.data?.page_token,
    replies: (response.data?.items ?? []).map(normalizeCommentReply),
  };
}
async function addComment(client, params) {
  if (params.block_id?.trim() && params.file_type !== "docx")
    throw new Error("block_id is only supported for docx comments");
  return {
    success: true,
    ...assertDriveApiSuccess(
      await requestDriveApi({
        client,
        method: "POST",
        url: `/open-apis/drive/v1/files/${encodeURIComponent(params.file_token)}/new_comments`,
        data: {
          file_type: params.file_type,
          reply_elements: buildReplyElements(params.content),
          ...(params.block_id?.trim() ? { anchor: { block_id: params.block_id.trim() } } : {}),
        },
      }),
    ).data,
  };
}
async function queryCommentById(client, params) {
  return assertDriveApiSuccess(
    await requestDriveApi({
      client,
      method: "POST",
      url:
        `/open-apis/drive/v1/files/${encodeURIComponent(params.file_token)}/comments/batch_query` +
        encodeQuery({
          file_type: params.file_type,
          user_id_type: "open_id",
        }),
      data: { comment_ids: [params.comment_id] },
    }),
  ).data?.items?.find((comment) => comment.comment_id?.trim() === params.comment_id);
}
async function replyComment(client, params) {
  const url = `/open-apis/drive/v1/files/${encodeURIComponent(params.file_token)}/comments/${encodeURIComponent(params.comment_id)}/replies`;
  const query = { file_type: params.file_type };
  try {
    const response = await requestDriveApi({
      client,
      method: "POST",
      url,
      query,
      data: {
        content: {
          elements: [
            {
              type: "text_run",
              text_run: { text: params.content },
            },
          ],
        },
      },
    });
    if (response.code === 0)
      return {
        success: true,
        ...response.data,
      };
    console.warn(
      `[feishu_drive] replyComment failed comment=${params.comment_id} file_type=${params.file_type} code=${response.code ?? "unknown"} msg=${response.msg ?? "unknown"} log_id=${response.log_id ?? "unknown"}`,
    );
    throw new FeishuReplyCommentError({
      message: response.msg ?? "Feishu Drive reply comment failed",
      feishuCode: response.code,
      feishuMsg: response.msg,
      feishuLogId: response.log_id,
    });
  } catch (error) {
    if (error instanceof FeishuReplyCommentError) throw error;
    const meta = extractDriveApiErrorMeta(error);
    console.warn(
      `[feishu_drive] replyComment threw comment=${params.comment_id} file_type=${params.file_type} error=${formatDriveApiError(error)}`,
    );
    throw new FeishuReplyCommentError({
      message: meta.message,
      httpStatus: meta.httpStatus,
      feishuCode: meta.feishuCode,
      feishuMsg: meta.feishuMsg,
      feishuLogId: meta.feishuLogId,
    });
  }
}
async function deliverCommentThreadText(client, params) {
  let isWholeComment = params.is_whole_comment;
  if (isWholeComment === void 0)
    try {
      isWholeComment = (await queryCommentById(client, params))?.is_whole === true;
    } catch (error) {
      console.warn(
        `[feishu_drive] comment metadata preflight failed comment=${params.comment_id} file_type=${params.file_type} error=${formatErrorMessage(error)}`,
      );
      isWholeComment = false;
    }
  if (isWholeComment) {
    if (params.file_type !== "doc" && params.file_type !== "docx")
      throw new Error(
        `Whole-document comment follow-ups are only supported for doc/docx (got ${params.file_type})`,
      );
    const wholeCommentFileType = params.file_type;
    console.info(
      `[feishu_drive] whole-comment compatibility path comment=${params.comment_id} file_type=${params.file_type} mode=add_comment`,
    );
    return {
      delivery_mode: "add_comment",
      ...(await addComment(client, {
        file_token: params.file_token,
        file_type: wholeCommentFileType,
        content: params.content,
      })),
    };
  }
  try {
    return {
      delivery_mode: "reply_comment",
      ...(await replyComment(client, params)),
    };
  } catch (error) {
    if (error instanceof FeishuReplyCommentError && isReplyNotAllowedError(error)) {
      if (params.file_type !== "doc" && params.file_type !== "docx") throw error;
      const fallbackFileType = params.file_type;
      console.info(
        `[feishu_drive] reply-not-allowed compatibility path comment=${params.comment_id} file_type=${params.file_type} mode=add_comment log_id=${error.feishuLogId ?? "unknown"}`,
      );
      return {
        delivery_mode: "add_comment",
        ...(await addComment(client, {
          file_token: params.file_token,
          file_type: fallbackFileType,
          content: params.content,
        })),
      };
    }
    throw error;
  }
}
function registerFeishuDriveTools(api) {
  if (!api.config) return;
  const accounts = listEnabledFeishuAccounts(api.config);
  if (accounts.length === 0) return;
  if (!resolveAnyEnabledFeishuToolsConfig(accounts).drive) return;
  api.registerTool(
    (ctx) => {
      const defaultAccountId = ctx.agentAccountId;
      return {
        name: "feishu_drive",
        label: "Feishu Drive",
        description:
          "Feishu cloud storage operations. Actions: list, info, create_folder, move, delete, list_comments, list_comment_replies, add_comment, reply_comment",
        parameters: FeishuDriveSchema,
        async execute(_toolCallId, params) {
          const p = params;
          try {
            const client = createFeishuToolClient({
              api,
              executeParams: p,
              defaultAccountId,
              requiredTool: {
                family: "drive",
                label: "Drive",
              },
            });
            switch (p.action) {
              case "list":
                return jsonResult(
                  await listFolder(client, {
                    folder_token: p.folder_token,
                    page_size: p.page_size,
                    page_token: p.page_token,
                  }),
                );
              case "info":
                return jsonResult(await getFileInfo(client, p.file_token, p.type));
              case "create_folder":
                return jsonResult(await createFolder(client, p.name, p.folder_token));
              case "move":
                return jsonResult(await moveFile(client, p.file_token, p.type, p.folder_token));
              case "delete":
                return jsonResult(await deleteFile(client, p.file_token, p.type));
              case "list_comments":
                return jsonResult(
                  await listComments(
                    client,
                    applyCommentFileTypeDefault(
                      applyAmbientCommentDefaults(p, ctx),
                      "list_comments",
                    ),
                  ),
                );
              case "list_comment_replies":
                return jsonResult(
                  await listCommentReplies(
                    client,
                    applyCommentFileTypeDefault(
                      applyAmbientCommentDefaults(p, ctx),
                      "list_comment_replies",
                    ),
                  ),
                );
              case "add_comment": {
                const resolved = applyAddCommentDefaults(applyAddCommentAmbientDefaults(p, ctx));
                try {
                  return jsonResult(await addComment(client, resolved));
                } finally {
                  cleanupAmbientCommentTypingReaction({
                    client: getDriveInternalClient(client),
                    deliveryContext: ctx.deliveryContext,
                  });
                }
              }
              case "reply_comment": {
                const resolved = applyCommentFileTypeDefault(
                  applyAmbientCommentDefaults(p, ctx),
                  "reply_comment",
                );
                try {
                  return jsonResult(await deliverCommentThreadText(client, resolved));
                } finally {
                  cleanupAmbientCommentTypingReaction({
                    client: getDriveInternalClient(client),
                    deliveryContext: ctx.deliveryContext,
                  });
                }
              }
              default:
                return unknownToolActionResult(p.action);
            }
          } catch (err) {
            return toolExecutionErrorResult(err);
          }
        },
      };
    },
    { name: "feishu_drive" },
  );
}
//#endregion
export {
  toolExecutionErrorResult as a,
  buildFeishuDirectChatMembers as c,
  getFeishuMemberInfo as d,
  registerFeishuChatTools as f,
  resolveToolsConfig as g,
  resolveFeishuToolAccount as h,
  createCommentTypingReactionLifecycle as i,
  getChatInfo as l,
  resolveAnyEnabledFeishuToolsConfig as m,
  registerFeishuDriveTools as n,
  unknownToolActionResult as o,
  createFeishuToolClient as p,
  cleanupAmbientCommentTypingReaction as r,
  assertFeishuChatMember as s,
  deliverCommentThreadText as t,
  getChatMembers as u,
};
