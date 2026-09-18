import { s as resolveFeishuAccount } from "./accounts-upJPqv8I.js";
import "./directory-runtime-VSo_cGzY.js";
import {
  c as listDirectoryUserEntriesFromAllowFrom,
  l as listDirectoryUserEntriesFromAllowFromAndMapKeys,
  s as listDirectoryGroupEntriesFromMapKeysAndAllowFrom,
  t as applyDirectoryQueryAndLimit,
} from "./directory-config-helpers-6PdjajJm.js";
import {
  f as renderMessagePresentationChartFallbackText,
  m as renderMessagePresentationTableFallbackText,
  p as renderMessagePresentationFallbackText,
} from "./payload-BFbDi85B.js";
import {
  D as createFeishuCardInteractionEnvelope,
  f as isFeishuGroupReadAllowed,
} from "./send-result-BY9GGIVt.js";
import { r as normalizeFeishuTarget } from "./targets-5VnlkfaZ.js";
//#region extensions/feishu/src/directory.static.ts
function toFeishuDirectoryPeers(ids) {
  return ids.map((id) => ({
    kind: "user",
    id,
  }));
}
function toFeishuDirectoryGroups(ids) {
  return ids.map((id) => ({
    kind: "group",
    id,
  }));
}
async function listFeishuDirectoryPeers(params) {
  const account = resolveFeishuAccount({
    cfg: params.cfg,
    accountId: params.accountId,
  });
  return toFeishuDirectoryPeers(
    listDirectoryUserEntriesFromAllowFromAndMapKeys({
      allowFrom: account.config.allowFrom,
      map: account.config.dms,
      query: params.query,
      limit: params.limit,
      normalizeAllowFromId: (entry) => normalizeFeishuTarget(entry) ?? entry,
      normalizeMapKeyId: (entry) => normalizeFeishuTarget(entry) ?? entry,
    }).map((entry) => entry.id),
  );
}
async function listFeishuDirectoryGroups(params) {
  const account = resolveFeishuAccount({
    cfg: params.cfg,
    accountId: params.accountId,
  });
  return toFeishuDirectoryGroups(
    listDirectoryGroupEntriesFromMapKeysAndAllowFrom({
      groups: account.config.groups,
      allowFrom: account.config.groupAllowFrom,
      query: params.query,
      limit: params.limit,
    }).map((entry) => entry.id),
  );
}
async function listAuthorizedFeishuDirectoryPeers(params) {
  return toFeishuDirectoryPeers(
    listDirectoryUserEntriesFromAllowFrom({
      allowFrom: resolveFeishuAccount({
        cfg: params.cfg,
        accountId: params.accountId,
      }).config.allowFrom,
      query: params.query,
      limit: params.limit,
      normalizeId: (entry) => normalizeFeishuTarget(entry) ?? entry,
    }).map((entry) => entry.id),
  );
}
async function listAuthorizedFeishuDirectoryGroups(params) {
  const account = resolveFeishuAccount({
    cfg: params.cfg,
    accountId: params.accountId,
  });
  return toFeishuDirectoryGroups(
    applyDirectoryQueryAndLimit(
      listDirectoryGroupEntriesFromMapKeysAndAllowFrom({
        groups: Object.fromEntries(
          Object.entries(account.config.groups ?? {}).filter(
            ([, group]) => group?.enabled !== false,
          ),
        ),
        allowFrom: account.config.groupAllowFrom,
      })
        .filter((entry) => isFeishuGroupReadAllowed(params.cfg, account, entry.id, false))
        .map((entry) => entry.id),
      params,
    ),
  );
}
//#endregion
//#region extensions/feishu/src/presentation-card.ts
const FEISHU_CARD_MAX_BYTES = 30 * 1024;
const FEISHU_CARD_MAX_ELEMENTS = 200;
function countFeishuCardElements(value, ancestors = /* @__PURE__ */ new Set()) {
  if (Array.isArray(value))
    return value.reduce((count, entry) => count + countFeishuCardElements(entry, ancestors), 0);
  if (!value || typeof value !== "object") return 0;
  if (ancestors.has(value)) return 201;
  ancestors.add(value);
  const record = value;
  let count = typeof record.tag === "string" ? 1 : 0;
  for (const entry of Object.values(record)) {
    count += countFeishuCardElements(entry, ancestors);
    if (count > FEISHU_CARD_MAX_ELEMENTS) break;
  }
  ancestors.delete(value);
  return count;
}
function isFeishuCardWithinEnvelope(card) {
  try {
    return (
      Buffer.byteLength(JSON.stringify(card), "utf8") <= FEISHU_CARD_MAX_BYTES &&
      countFeishuCardElements(card) <= FEISHU_CARD_MAX_ELEMENTS
    );
  } catch {
    return false;
  }
}
function assertFeishuCardWithinEnvelope(card, label = "Feishu card") {
  if (!isFeishuCardWithinEnvelope(card))
    throw new Error(`${label} exceeds the 30 KB or 200-element API limit.`);
}
function escapeFeishuCardMarkdownText(text) {
  return text.replace(/[&<>]/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      default:
        return char;
    }
  });
}
function resolveSafeFeishuButtonUrl(url) {
  const trimmed = url?.trim();
  if (!trimmed) return;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? trimmed : void 0;
  } catch {
    return;
  }
}
function resolveFeishuButtonUrl(button) {
  if (button.action?.type === "url" || button.action?.type === "web-app") return button.action.url;
  if (button.action) return;
  return button.url ?? button.webApp?.url ?? button.web_app?.url;
}
function resolveFeishuCommandButtonValue(button) {
  if (button.action?.type === "command") return button.action.command;
  if (button.action) return;
  return button.value;
}
function mapFeishuButtonType(style) {
  if (style === "primary" || style === "success") return "primary";
  if (style === "danger") return "danger";
  return "default";
}
function buildFeishuPayloadButton(button) {
  const behaviors = [];
  const rendered = {
    tag: "button",
    text: {
      tag: "plain_text",
      content: button.label,
    },
    type: mapFeishuButtonType(button.style),
  };
  const url = resolveFeishuButtonUrl(button);
  if (url) {
    const safeUrl = resolveSafeFeishuButtonUrl(url);
    if (safeUrl)
      behaviors.push({
        type: "open_url",
        default_url: safeUrl,
      });
  }
  const value = resolveFeishuCommandButtonValue(button);
  if (value)
    behaviors.push({
      type: "callback",
      value: createFeishuCardInteractionEnvelope({
        k: "quick",
        a: "feishu.payload.button",
        q: value,
      }),
    });
  if (behaviors.length === 0) return;
  rendered.behaviors = behaviors;
  return rendered;
}
function buildFeishuCardElementsForBlock(block) {
  if (block.type === "text")
    return [
      {
        tag: "markdown",
        content: escapeFeishuCardMarkdownText(block.text),
      },
    ];
  if (block.type === "context")
    return [
      {
        tag: "markdown",
        content: `<font color='grey'>${escapeFeishuCardMarkdownText(block.text)}</font>`,
      },
    ];
  if (block.type === "divider") return [{ tag: "hr" }];
  if (block.type === "buttons")
    return block.buttons
      .map((button) => buildFeishuPayloadButton(button))
      .filter((button) => Boolean(button));
  if (block.type === "chart")
    return [
      {
        tag: "markdown",
        content: escapeFeishuCardMarkdownText(renderMessagePresentationChartFallbackText(block)),
      },
    ];
  if (block.type === "table")
    return [
      {
        tag: "markdown",
        content: escapeFeishuCardMarkdownText(renderMessagePresentationTableFallbackText(block)),
      },
    ];
  const labels = block.options.map((option) => `- ${option.label}`).join("\n");
  return [
    {
      tag: "markdown",
      content: `${escapeFeishuCardMarkdownText(block.placeholder?.trim() || "Options")}:\n${escapeFeishuCardMarkdownText(labels)}`,
    },
  ];
}
function resolvePresentationHeaderTemplate(tone) {
  if (tone === "danger") return "red";
  if (tone === "warning") return "orange";
  if (tone === "success") return "green";
  return "blue";
}
function buildFeishuPresentationCardElements(params) {
  const elements = [];
  const fallbackText = params.fallbackText?.trim();
  if (fallbackText)
    elements.push({
      tag: "markdown",
      content: escapeFeishuCardMarkdownText(fallbackText),
    });
  for (const block of params.presentation.blocks)
    for (const element of buildFeishuCardElementsForBlock(block)) elements.push(element);
  if (elements.length > 0) return elements;
  return [
    {
      tag: "markdown",
      content: renderMessagePresentationFallbackText({
        text: params.fallbackText,
        presentation: params.presentation.title
          ? {
              ...(params.presentation.tone ? { tone: params.presentation.tone } : {}),
              blocks: params.presentation.blocks,
            }
          : params.presentation,
      }),
    },
  ];
}
function buildFeishuPresentationCard(params) {
  return {
    schema: "2.0",
    config: { width_mode: "fill" },
    ...(params.presentation.title
      ? {
          header: {
            title: {
              tag: "plain_text",
              content: params.presentation.title,
            },
            template: resolvePresentationHeaderTemplate(params.presentation.tone),
          },
        }
      : {}),
    body: { elements: buildFeishuPresentationCardElements(params) },
  };
}
//#endregion
export {
  listAuthorizedFeishuDirectoryGroups as a,
  listFeishuDirectoryPeers as c,
  isFeishuCardWithinEnvelope as i,
  buildFeishuPresentationCard as n,
  listAuthorizedFeishuDirectoryPeers as o,
  buildFeishuPresentationCardElements as r,
  listFeishuDirectoryGroups as s,
  assertFeishuCardWithinEnvelope as t,
};
