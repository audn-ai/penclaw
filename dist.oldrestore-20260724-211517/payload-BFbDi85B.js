import { n as isWellFormedApprovalId } from "./approval-id-BTRnO3t1.js";
import { i as asOptionalRecord } from "./record-coerce-DHZ4bFlT.js";
import {
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
//#region src/interactive/payload.ts
function resolveMessagePresentationActionValue(action) {
  if (action?.type === "command") return action.command;
  if (action?.type === "callback") return action.value;
}
function resolveMessagePresentationControlValue(control) {
  if (control.action !== void 0) {
    const action = normalizePresentationAction(control.action);
    return action ? resolveMessagePresentationActionValue(action) : void 0;
  }
  return control.value;
}
/** Resolve a canonical button action, including deprecated boundary inputs. */
function resolveMessagePresentationButtonAction(button) {
  if (button.action !== void 0) return normalizePresentationAction(button.action);
  if (button.url)
    return {
      type: "url",
      url: button.url,
    };
  const webAppUrl = button.webApp?.url ?? button.web_app?.url;
  if (webAppUrl)
    return {
      type: "web-app",
      url: webAppUrl,
    };
  return button.value
    ? {
        type: "callback",
        value: button.value,
      }
    : void 0;
}
/** Resolve a canonical select action, including the deprecated value input. */
function resolveMessagePresentationOptionAction(option) {
  if (option.action !== void 0) {
    const action = normalizePresentationAction(option.action);
    return action?.type === "command" || action?.type === "callback" ? action : void 0;
  }
  return option.value
    ? {
        type: "callback",
        value: option.value,
      }
    : void 0;
}
function normalizeButtonStyle(value) {
  const style = normalizeOptionalLowercaseString(value);
  return style === "primary" || style === "secondary" || style === "success" || style === "danger"
    ? style
    : void 0;
}
function normalizePresentationTone(value) {
  const tone = normalizeOptionalLowercaseString(value);
  return tone === "info" ||
    tone === "success" ||
    tone === "warning" ||
    tone === "danger" ||
    tone === "neutral"
    ? tone
    : void 0;
}
function normalizePresentationAction(raw) {
  const record = asOptionalRecord(raw);
  if (!record) return;
  const type = normalizeOptionalLowercaseString(record.type);
  if (type === "command") {
    const command = normalizeOptionalString(record.command);
    return command
      ? {
          type: "command",
          command,
        }
      : void 0;
  }
  if (type === "callback") {
    const value = normalizeOptionalString(record.value);
    return value
      ? {
          type: "callback",
          value,
        }
      : void 0;
  }
  if (type === "approval") {
    if (record.type !== "approval") return;
    const approvalId = record.approvalId;
    const approvalKind = record.approvalKind;
    const decision = record.decision;
    if (
      typeof approvalId !== "string" ||
      !isWellFormedApprovalId(approvalId) ||
      (approvalKind !== "exec" && approvalKind !== "plugin") ||
      (decision !== "allow-once" && decision !== "allow-always" && decision !== "deny")
    )
      return;
    return {
      type: "approval",
      approvalId,
      approvalKind,
      decision,
    };
  }
  if (type === "url" || type === "web-app") {
    const url = normalizeOptionalString(record.url);
    return url
      ? {
          type,
          url,
        }
      : void 0;
  }
}
function normalizeButton(raw) {
  const record = asOptionalRecord(raw);
  if (!record) return;
  const label = normalizeOptionalString(record.label) ?? normalizeOptionalString(record.text);
  const value =
    normalizeOptionalString(record.value) ??
    normalizeOptionalString(record.callbackData) ??
    normalizeOptionalString(record.callback_data);
  const url = normalizeOptionalString(record.url);
  const webAppUrl = normalizeOptionalString(
    (asOptionalRecord(record.webApp) ?? asOptionalRecord(record.web_app))?.url,
  );
  const action = record.action !== void 0 ? normalizePresentationAction(record.action) : void 0;
  if (!label || (record.action !== void 0 && !action) || (!action && !value && !url && !webAppUrl))
    return;
  const priority =
    typeof record.priority === "number" && Number.isFinite(record.priority)
      ? record.priority
      : void 0;
  return {
    label,
    ...(action ? { action } : {}),
    ...(value ? { value } : {}),
    ...(url ? { url } : {}),
    ...(webAppUrl ? { webApp: { url: webAppUrl } } : {}),
    ...(priority !== void 0 ? { priority } : {}),
    ...(record.disabled === true ? { disabled: true } : {}),
    ...(record.reusable === true ? { reusable: true } : {}),
    style: normalizeButtonStyle(record.style),
  };
}
function normalizeOption(raw) {
  const record = asOptionalRecord(raw);
  if (!record) return;
  const label = normalizeOptionalString(record.label) ?? normalizeOptionalString(record.text);
  const value = normalizeOptionalString(record.value);
  const normalizedAction =
    record.action !== void 0 ? normalizePresentationAction(record.action) : void 0;
  const action =
    normalizedAction?.type === "command" || normalizedAction?.type === "callback"
      ? normalizedAction
      : void 0;
  if (!label || (record.action !== void 0 && !action) || (!action && !value)) return;
  return {
    label,
    ...(action ? { action } : {}),
    ...(value ? { value } : {}),
  };
}
function normalizeList(value, normalizeEntry) {
  return Array.isArray(value)
    ? value.map((entry) => normalizeEntry(entry)).filter((entry) => Boolean(entry))
    : [];
}
function normalizeInteractiveBlock(raw) {
  const record = asOptionalRecord(raw);
  if (!record) return;
  const type = normalizeOptionalLowercaseString(record.type);
  if (type === "text") {
    const text = normalizeOptionalString(record.text);
    return text
      ? {
          type: "text",
          text,
        }
      : void 0;
  }
  if (type === "buttons") {
    const buttons = normalizeList(record.buttons, normalizeButton);
    return buttons.length > 0
      ? {
          type: "buttons",
          buttons,
        }
      : void 0;
  }
  if (type === "select") {
    const options = normalizeList(record.options, normalizeOption);
    return options.length > 0
      ? {
          type: "select",
          placeholder: normalizeOptionalString(record.placeholder),
          options,
        }
      : void 0;
  }
}
function normalizeChartSegments(value) {
  if (!Array.isArray(value) || value.length === 0) return;
  const segments = value.map((entry) => {
    const record = asOptionalRecord(entry);
    const label = normalizeOptionalString(record?.label);
    const segmentValue = record?.value;
    return label && typeof segmentValue === "number" && Number.isFinite(segmentValue)
      ? {
          label,
          value: segmentValue,
        }
      : void 0;
  });
  return segments.every((segment) => Boolean(segment && segment.value > 0)) ? segments : void 0;
}
function normalizeChartCategories(value) {
  if (!Array.isArray(value) || value.length === 0) return;
  const categories = value.map((entry) => normalizeOptionalString(entry));
  if (categories.some((entry) => !entry)) return;
  const normalized = categories;
  return new Set(normalized).size === normalized.length ? normalized : void 0;
}
function normalizeChartSeries(params) {
  if (!Array.isArray(params.value) || params.value.length === 0) return;
  const series = params.value.map((entry) => {
    const record = asOptionalRecord(entry);
    const name = normalizeOptionalString(record?.name);
    const values = record?.values;
    if (
      !name ||
      !Array.isArray(values) ||
      values.length !== params.categoryCount ||
      !values.every((value) => typeof value === "number" && Number.isFinite(value))
    )
      return;
    return {
      name,
      values,
    };
  });
  if (
    !series.every((entry) => Boolean(entry)) ||
    new Set(series.map((entry) => entry.name)).size !== series.length
  )
    return;
  return series;
}
function normalizeChartBlock(record) {
  const title = normalizeOptionalString(record.title);
  const chartType = normalizeOptionalLowercaseString(record.chartType);
  if (!title) return;
  if (chartType === "pie") {
    const segments = normalizeChartSegments(record.segments);
    return segments
      ? {
          type: "chart",
          chartType,
          title,
          segments,
        }
      : void 0;
  }
  if (chartType !== "bar" && chartType !== "area" && chartType !== "line") return;
  const categories = normalizeChartCategories(record.categories);
  if (!categories) return;
  const series = normalizeChartSeries({
    value: record.series,
    categoryCount: categories.length,
  });
  if (!series) return;
  const xLabel = normalizeOptionalString(record.xLabel);
  const yLabel = normalizeOptionalString(record.yLabel);
  return {
    type: "chart",
    chartType,
    title,
    categories,
    series,
    ...(xLabel ? { xLabel } : {}),
    ...(yLabel ? { yLabel } : {}),
  };
}
function normalizeTableBlock(record) {
  const caption = normalizeOptionalString(record.caption);
  if (!caption || !Array.isArray(record.headers) || record.headers.length === 0) return;
  const headers = record.headers.map((header) => normalizeOptionalString(header));
  if (
    !headers.every((header) => Boolean(header)) ||
    new Set(headers).size !== headers.length ||
    !Array.isArray(record.rows) ||
    record.rows.length === 0
  )
    return;
  const rows = record.rows.map((row) => {
    if (!Array.isArray(row) || row.length !== headers.length) return;
    const cells = row.map((cell) => {
      if (typeof cell === "number") return Number.isFinite(cell) ? cell : void 0;
      return normalizeOptionalString(cell);
    });
    return cells.every((cell) => cell !== void 0) ? cells : void 0;
  });
  if (!rows.every((row) => Boolean(row))) return;
  const rowHeaderColumnIndex = record.rowHeaderColumnIndex;
  if (
    rowHeaderColumnIndex !== void 0 &&
    (typeof rowHeaderColumnIndex !== "number" ||
      !Number.isInteger(rowHeaderColumnIndex) ||
      rowHeaderColumnIndex < 0 ||
      rowHeaderColumnIndex >= headers.length)
  )
    return;
  return {
    type: "table",
    caption,
    headers,
    rows,
    ...(typeof rowHeaderColumnIndex === "number" ? { rowHeaderColumnIndex } : {}),
  };
}
/**
 * @deprecated Use normalizeMessagePresentation.
 */
function normalizeInteractiveReply(raw) {
  const record = asOptionalRecord(raw);
  if (!record) return;
  const blocks = normalizeList(record.blocks, normalizeInteractiveBlock);
  return blocks.length > 0 ? { blocks } : void 0;
}
function normalizePresentationBlock(raw) {
  const record = asOptionalRecord(raw);
  if (!record) return;
  const type = normalizeOptionalLowercaseString(record.type);
  if (type === "text" || type === "context") {
    const text = normalizeOptionalString(record.text);
    return text
      ? {
          type,
          text,
        }
      : void 0;
  }
  if (type === "divider") return { type: "divider" };
  if (type === "buttons") {
    const buttons = normalizeList(record.buttons, normalizeButton);
    return buttons.length > 0
      ? {
          type: "buttons",
          buttons,
        }
      : void 0;
  }
  if (type === "select") {
    const options = normalizeList(record.options, normalizeOption);
    return options.length > 0
      ? {
          type: "select",
          placeholder: normalizeOptionalString(record.placeholder),
          options,
        }
      : void 0;
  }
  if (type === "chart") return normalizeChartBlock(record);
  if (type === "table") return normalizeTableBlock(record);
}
function normalizeMessagePresentation(raw) {
  const record = asOptionalRecord(raw);
  if (!record) return;
  const blocks = normalizeList(record.blocks, normalizePresentationBlock);
  const title = normalizeOptionalString(record.title);
  if (!title && blocks.length === 0) return;
  return {
    ...(title ? { title } : {}),
    tone: normalizePresentationTone(record.tone),
    blocks,
  };
}
/**
 * @deprecated Use hasMessagePresentationBlocks.
 */
function hasInteractiveReplyBlocks(value) {
  return Boolean(normalizeInteractiveReply(value));
}
function hasMessagePresentationBlocks(value) {
  return Boolean(normalizeMessagePresentation(value));
}
/**
 * @deprecated Avoid producing InteractiveReply payloads; send MessagePresentation directly.
 */
function presentationToInteractiveReply(presentation) {
  const blocks = [];
  if (presentation.title)
    blocks.push({
      type: "text",
      text: presentation.title,
    });
  for (const block of presentation.blocks) {
    if (block.type === "text" || block.type === "context") {
      blocks.push({
        type: "text",
        text: block.text,
      });
      continue;
    }
    if (block.type === "buttons") {
      const buttons = block.buttons
        .filter((button) => resolveMessagePresentationButtonAction(button))
        .map((button) => {
          const interactiveButton = {
            label: button.label,
            style: button.style,
          };
          if (button.action) {
            interactiveButton.action = button.action;
            const actionValue = resolveMessagePresentationActionValue(button.action);
            if (actionValue) interactiveButton.value = actionValue;
            else if (button.action.type === "url") interactiveButton.url = button.action.url;
            else if (button.action.type === "web-app")
              interactiveButton.webApp = { url: button.action.url };
          } else {
            if (button.value) interactiveButton.value = button.value;
            if (button.url) interactiveButton.url = button.url;
            const webApp = button.webApp ?? button.web_app;
            if (webApp) interactiveButton.webApp = webApp;
          }
          if (button.priority !== void 0) interactiveButton.priority = button.priority;
          if (button.disabled === true) interactiveButton.disabled = true;
          if (button.reusable === true) interactiveButton.reusable = true;
          return interactiveButton;
        });
      if (buttons.length > 0)
        blocks.push({
          type: "buttons",
          buttons,
        });
      continue;
    }
    if (block.type === "chart") {
      blocks.push({
        type: "text",
        text: renderMessagePresentationChartFallbackText(block),
      });
      continue;
    }
    if (block.type === "table") {
      blocks.push({
        type: "text",
        text: renderMessagePresentationTableFallbackText(block),
      });
      continue;
    }
    if (block.type === "select")
      blocks.push({
        type: "select",
        placeholder: block.placeholder,
        options: block.options.map((option) => {
          const interactiveOption = { label: option.label };
          if (option.action !== void 0) {
            const action = resolveMessagePresentationOptionAction(option);
            if (action) {
              interactiveOption.action = action;
              const actionValue = resolveMessagePresentationActionValue(action);
              if (actionValue) interactiveOption.value = actionValue;
            }
          } else if (option.value) interactiveOption.value = option.value;
          return interactiveOption;
        }),
      });
  }
  return blocks.length > 0 ? { blocks } : void 0;
}
function isMessagePresentationInteractiveBlock(block) {
  return block.type === "buttons" || block.type === "select";
}
/**
 * @deprecated Avoid producing InteractiveReply payloads; send MessagePresentation directly.
 */
function presentationToInteractiveControlsReply(presentation) {
  return presentationToInteractiveReply({
    blocks: presentation.blocks.filter(isMessagePresentationInteractiveBlock),
  });
}
/**
 * @deprecated Legacy bridge for old InteractiveReply payloads. New producers should send MessagePresentation.
 */
function interactiveReplyToPresentation(interactive) {
  const blocks = interactive.blocks.map((block) => {
    if (block.type === "text")
      return {
        type: "text",
        text: block.text,
      };
    if (block.type === "buttons")
      return {
        type: "buttons",
        buttons: block.buttons,
      };
    return {
      type: "select",
      placeholder: block.placeholder,
      options: block.options,
    };
  });
  return blocks.length > 0 ? { blocks } : void 0;
}
/**
 * Render presentation blocks as plain-text fallback for channels that do not
 * support native interactive controls.
 *
 * Text and context blocks are rendered as-is. Buttons with a `command`-typed
 * action render as `label: \`command\`` so the value is copyable. URL and web
 * app actions include their user-facing URL. Approval, callback, legacy value,
 * and select actions render label-only to keep transport data private. Disabled
 * buttons render label-only regardless of action type.
 *
 * Downstream consumers should not claim a manual command is available unless
 * they verify one was actually rendered.
 *
 * Exported through the plugin SDK for channel adapters.
 */
function renderMessagePresentationChartFallbackText(block) {
  const lines = [`${block.title} (${block.chartType} chart)`];
  if (block.chartType === "pie") {
    lines.push(...block.segments.map((segment) => `- ${segment.label}: ${String(segment.value)}`));
    return lines.join("\n");
  }
  if (block.xLabel) lines.push(`X axis: ${block.xLabel}`);
  if (block.yLabel) lines.push(`Y axis: ${block.yLabel}`);
  lines.push(
    ...block.series.map(
      (series) =>
        `- ${series.name}: ${block.categories.map((category, index) => `${category}: ${String(series.values[index])}`).join("; ")}`,
    ),
  );
  return lines.join("\n");
}
function renderTableFallbackValue(value) {
  return String(value).replace(/\s+/g, " ").trim();
}
function renderMessagePresentationTableFallbackText(block) {
  const headers = block.headers.map(renderTableFallbackValue);
  const lines = [`${renderTableFallbackValue(block.caption)} (table)`];
  lines.push(
    ...block.rows.map(
      (row) =>
        `- ${row.map((cell, index) => `${headers[index]}: ${renderTableFallbackValue(cell)}`).join("; ")}`,
    ),
  );
  return lines.join("\n");
}
function renderMessagePresentationFallbackText(params) {
  const lines = [];
  const text = normalizeOptionalString(params.text);
  if (text) lines.push(text);
  const presentation = params.presentation;
  if (!presentation) return lines.join("\n\n");
  if (presentation.title) lines.push(presentation.title);
  for (const block of presentation.blocks) {
    if (block.type === "text" || block.type === "context") {
      lines.push(block.text);
      continue;
    }
    if (block.type === "buttons") {
      const labels = block.buttons
        .map((button) => {
          if (button.disabled) return button.label;
          const action = resolveMessagePresentationButtonAction(button);
          if (action?.type === "url" || action?.type === "web-app")
            return `${button.label}: ${action.url}`;
          if (action?.type === "command") return `${button.label}: \`${action.command}\``;
          return button.label;
        })
        .filter(Boolean);
      if (labels.length > 0) lines.push(labels.map((label) => `- ${label}`).join("\n"));
      continue;
    }
    if (block.type === "chart") {
      lines.push(renderMessagePresentationChartFallbackText(block));
      continue;
    }
    if (block.type === "table") {
      lines.push(renderMessagePresentationTableFallbackText(block));
      continue;
    }
    if (block.type === "select") {
      const labels = block.options.map((option) => option.label).filter(Boolean);
      if (labels.length > 0) {
        const heading = block.placeholder ? `${block.placeholder}:` : "Options:";
        lines.push(`${heading}\n${labels.map((label) => `- ${label}`).join("\n")}`);
      }
    }
  }
  return lines.join("\n\n") || normalizeOptionalString(params.emptyFallback) || "";
}
function hasReplyChannelData(value) {
  return Boolean(
    value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length > 0,
  );
}
function hasReplyContent(params) {
  const text = normalizeOptionalString(params.text);
  const mediaUrl = normalizeOptionalString(params.mediaUrl);
  return Boolean(
    text ||
    mediaUrl ||
    params.mediaUrls?.some((entry) => Boolean(normalizeOptionalString(entry))) ||
    hasMessagePresentationBlocks(params.presentation) ||
    hasInteractiveReplyBlocks(params.interactive) ||
    params.hasChannelData ||
    params.extraContent,
  );
}
function hasReplyPayloadContent(payload, options) {
  return hasReplyContent({
    text: options?.trimText ? payload.text?.trim() : payload.text,
    mediaUrl: payload.mediaUrl,
    mediaUrls: payload.mediaUrls,
    interactive: payload.interactive,
    presentation: payload.presentation,
    hasChannelData: options?.hasChannelData ?? hasReplyChannelData(payload.channelData),
    extraContent: options?.extraContent ?? payload.location != null,
  });
}
/**
 * @deprecated Use renderMessagePresentationFallbackText with MessagePresentation.
 */
function resolveInteractiveTextFallback(params) {
  if (normalizeOptionalString(params.text)) return params.text;
  return (
    (params.interactive?.blocks ?? [])
      .filter((block) => block.type === "text")
      .map((block) => block.text.trim())
      .filter(Boolean)
      .join("\n\n") || params.text
  );
}
//#endregion
export {
  resolveMessagePresentationButtonAction as _,
  hasReplyPayloadContent as a,
  normalizeInteractiveReply as c,
  presentationToInteractiveReply as d,
  renderMessagePresentationChartFallbackText as f,
  resolveMessagePresentationActionValue as g,
  resolveInteractiveTextFallback as h,
  hasReplyContent as i,
  normalizeMessagePresentation as l,
  renderMessagePresentationTableFallbackText as m,
  hasMessagePresentationBlocks as n,
  interactiveReplyToPresentation as o,
  renderMessagePresentationFallbackText as p,
  hasReplyChannelData as r,
  isMessagePresentationInteractiveBlock as s,
  hasInteractiveReplyBlocks as t,
  presentationToInteractiveControlsReply as u,
  resolveMessagePresentationControlValue as v,
  resolveMessagePresentationOptionAction as y,
};
