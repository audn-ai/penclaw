import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import "./text-utility-runtime-CJESZCN5.js";
//#region extensions/line/src/flex-templates/common.ts
function attachFooterText(bubble, footer) {
  bubble.footer = {
    type: "box",
    layout: "vertical",
    contents: [
      {
        type: "text",
        text: footer,
        size: "xs",
        color: "#AAAAAA",
        wrap: true,
        align: "center",
      },
    ],
    paddingAll: "lg",
    backgroundColor: "#FAFAFA",
  };
}
//#endregion
//#region extensions/line/src/flex-templates/basic-cards.ts
/**
 * Create an info card with title, body, and optional footer
 *
 * Editorial design: Clean hierarchy with accent bar, generous spacing,
 * and subtle background zones for visual separation.
 */
function createInfoCard(title, body, footer) {
  const bubble = {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "box",
              layout: "vertical",
              contents: [],
              width: "4px",
              backgroundColor: "#06C755",
              cornerRadius: "2px",
            },
            {
              type: "text",
              text: title,
              weight: "bold",
              size: "xl",
              color: "#111111",
              wrap: true,
              flex: 1,
              margin: "lg",
            },
          ],
        },
        {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: body,
              size: "md",
              color: "#444444",
              wrap: true,
              lineSpacing: "6px",
            },
          ],
          margin: "xl",
          paddingAll: "lg",
          backgroundColor: "#F8F9FA",
          cornerRadius: "lg",
        },
      ],
      paddingAll: "xl",
      backgroundColor: "#FFFFFF",
    },
  };
  if (footer) attachFooterText(bubble, footer);
  return bubble;
}
/**
 * Create a list card with title and multiple items
 *
 * Editorial design: Numbered/bulleted list with clear visual hierarchy,
 * accent dots for each item, and generous spacing.
 */
function createListCard(title, items) {
  const itemContents = items.slice(0, 8).map((item, index) => {
    const itemContentsLocal = [
      {
        type: "text",
        text: item.title,
        size: "md",
        weight: "bold",
        color: "#1a1a1a",
        wrap: true,
      },
    ];
    if (item.subtitle)
      itemContentsLocal.push({
        type: "text",
        text: item.subtitle,
        size: "sm",
        color: "#888888",
        wrap: true,
        margin: "xs",
      });
    const itemBox = {
      type: "box",
      layout: "horizontal",
      contents: [
        {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "box",
              layout: "vertical",
              contents: [],
              width: "8px",
              height: "8px",
              backgroundColor: index === 0 ? "#06C755" : "#DDDDDD",
              cornerRadius: "4px",
            },
          ],
          width: "20px",
          alignItems: "center",
          paddingTop: "sm",
        },
        {
          type: "box",
          layout: "vertical",
          contents: itemContentsLocal,
          flex: 1,
        },
      ],
      margin: index > 0 ? "lg" : void 0,
    };
    if (item.action) itemBox.action = item.action;
    return itemBox;
  });
  return {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: title,
          weight: "bold",
          size: "xl",
          color: "#111111",
          wrap: true,
        },
        {
          type: "separator",
          margin: "lg",
          color: "#EEEEEE",
        },
        {
          type: "box",
          layout: "vertical",
          contents: itemContents,
          margin: "lg",
        },
      ],
      paddingAll: "xl",
      backgroundColor: "#FFFFFF",
    },
  };
}
/**
 * Create an image card with image, title, and optional body text
 */
function createImageCard(imageUrl, title, body, options) {
  const bubble = {
    type: "bubble",
    hero: {
      type: "image",
      url: imageUrl,
      size: "full",
      aspectRatio: options?.aspectRatio ?? "20:13",
      aspectMode: options?.aspectMode ?? "cover",
      action: options?.action,
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: title,
          weight: "bold",
          size: "xl",
          wrap: true,
        },
      ],
      paddingAll: "lg",
    },
  };
  if (body && bubble.body)
    bubble.body.contents.push({
      type: "text",
      text: body,
      size: "md",
      wrap: true,
      margin: "md",
      color: "#666666",
    });
  return bubble;
}
/**
 * Create an action card with title, body, and action buttons
 */
function createActionCard(title, body, actions, options) {
  const bubble = {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: title,
          weight: "bold",
          size: "xl",
          wrap: true,
        },
        {
          type: "text",
          text: body,
          size: "md",
          wrap: true,
          margin: "md",
          color: "#666666",
        },
      ],
      paddingAll: "lg",
    },
    footer: {
      type: "box",
      layout: "vertical",
      contents: actions.slice(0, 4).map((action, index) => ({
        type: "button",
        action: action.action,
        style: index === 0 ? "primary" : "secondary",
        margin: index > 0 ? "sm" : void 0,
      })),
      paddingAll: "md",
    },
  };
  if (options?.imageUrl)
    bubble.hero = {
      type: "image",
      url: options.imageUrl,
      size: "full",
      aspectRatio: options.aspectRatio ?? "20:13",
      aspectMode: "cover",
    };
  return bubble;
}
/**
 * Create a carousel container from multiple bubbles
 * LINE allows max 12 bubbles in a carousel
 */
function createCarousel(bubbles) {
  return {
    type: "carousel",
    contents: bubbles.slice(0, 12),
  };
}
/**
 * Create a notification bubble (for alerts, status updates)
 *
 * Editorial design: Bold status indicator with accent color,
 * clear typography, optional icon for context.
 */
function createNotificationBubble(text, options) {
  const typeColors = {
    info: {
      accent: "#3B82F6",
      bg: "#EFF6FF",
    },
    success: {
      accent: "#06C755",
      bg: "#F0FDF4",
    },
    warning: {
      accent: "#F59E0B",
      bg: "#FFFBEB",
    },
    error: {
      accent: "#EF4444",
      bg: "#FEF2F2",
    },
  }[options?.type ?? "info"];
  const contents = [];
  contents.push({
    type: "box",
    layout: "vertical",
    contents: [],
    width: "4px",
    backgroundColor: typeColors.accent,
    cornerRadius: "2px",
  });
  const textContents = [];
  if (options?.title)
    textContents.push({
      type: "text",
      text: options.title,
      size: "md",
      weight: "bold",
      color: "#111111",
      wrap: true,
    });
  textContents.push({
    type: "text",
    text,
    size: options?.title ? "sm" : "md",
    color: options?.title ? "#666666" : "#333333",
    wrap: true,
    margin: options?.title ? "sm" : void 0,
  });
  contents.push({
    type: "box",
    layout: "vertical",
    contents: textContents,
    flex: 1,
    paddingStart: "lg",
  });
  return {
    type: "bubble",
    body: {
      type: "box",
      layout: "horizontal",
      contents,
      paddingAll: "xl",
      backgroundColor: typeColors.bg,
    },
  };
}
//#endregion
//#region extensions/line/src/flex-templates/schedule-cards.ts
function buildTitleSubtitleHeader(params) {
  const { title, subtitle } = params;
  const headerContents = [
    {
      type: "text",
      text: title,
      weight: "bold",
      size: "xl",
      color: "#111111",
      wrap: true,
    },
  ];
  if (subtitle)
    headerContents.push({
      type: "text",
      text: subtitle,
      size: "sm",
      color: "#888888",
      margin: "sm",
      wrap: true,
    });
  return headerContents;
}
function buildCardHeaderSections(headerContents) {
  return [
    {
      type: "box",
      layout: "vertical",
      contents: headerContents,
      paddingBottom: "lg",
    },
    {
      type: "separator",
      color: "#EEEEEE",
    },
  ];
}
function createMegaBubbleWithFooter(params) {
  const bubble = {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      contents: params.bodyContents,
      paddingAll: "xl",
      backgroundColor: "#FFFFFF",
    },
  };
  if (params.footer) attachFooterText(bubble, params.footer);
  return bubble;
}
/**
 * Create a receipt/summary card (for orders, transactions, data tables)
 *
 * Editorial design: Clean table layout with alternating row backgrounds,
 * prominent total section, and clear visual hierarchy.
 */
function createReceiptCard(params) {
  const { title, subtitle, items, total, footer } = params;
  const itemRows = items.slice(0, 12).map((item, index) => ({
    type: "box",
    layout: "horizontal",
    contents: [
      {
        type: "text",
        text: item.name,
        size: "sm",
        color: item.highlight ? "#111111" : "#666666",
        weight: item.highlight ? "bold" : "regular",
        flex: 3,
        wrap: true,
      },
      {
        type: "text",
        text: item.value,
        size: "sm",
        color: item.highlight ? "#06C755" : "#333333",
        weight: item.highlight ? "bold" : "regular",
        flex: 2,
        align: "end",
        wrap: true,
      },
    ],
    paddingAll: "md",
    backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#FAFAFA",
  }));
  const bodyContents = [
    ...buildCardHeaderSections(
      buildTitleSubtitleHeader({
        title,
        subtitle,
      }),
    ),
    {
      type: "box",
      layout: "vertical",
      contents: itemRows,
      margin: "md",
      cornerRadius: "md",
      borderWidth: "light",
      borderColor: "#EEEEEE",
    },
  ];
  if (total)
    bodyContents.push({
      type: "box",
      layout: "horizontal",
      contents: [
        {
          type: "text",
          text: total.label,
          size: "lg",
          weight: "bold",
          color: "#111111",
          flex: 2,
        },
        {
          type: "text",
          text: total.value,
          size: "xl",
          weight: "bold",
          color: "#06C755",
          flex: 2,
          align: "end",
        },
      ],
      margin: "xl",
      paddingAll: "lg",
      backgroundColor: "#F0FDF4",
      cornerRadius: "lg",
    });
  return createMegaBubbleWithFooter({
    bodyContents,
    footer,
  });
}
/**
 * Create a calendar event card (for meetings, appointments, reminders)
 *
 * Editorial design: Date as hero, strong typographic hierarchy,
 * color-blocked zones, full text wrapping for readability.
 */
function createEventCard(params) {
  const { title, date, time, location, description, calendar, isAllDay, action } = params;
  const dateBlock = {
    type: "box",
    layout: "vertical",
    contents: [
      {
        type: "text",
        text: date.toUpperCase(),
        size: "sm",
        weight: "bold",
        color: "#06C755",
        wrap: true,
      },
      {
        type: "text",
        text: isAllDay ? "ALL DAY" : (time ?? ""),
        size: "xxl",
        weight: "bold",
        color: "#111111",
        wrap: true,
        margin: "xs",
      },
    ],
    paddingBottom: "lg",
    borderWidth: "none",
  };
  if (!time && !isAllDay)
    dateBlock.contents = [
      {
        type: "text",
        text: date,
        size: "xl",
        weight: "bold",
        color: "#111111",
        wrap: true,
      },
    ];
  const bodyContents = [
    dateBlock,
    {
      type: "box",
      layout: "horizontal",
      contents: [
        {
          type: "box",
          layout: "vertical",
          contents: [],
          width: "4px",
          backgroundColor: "#06C755",
          cornerRadius: "2px",
        },
        {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: title,
              size: "lg",
              weight: "bold",
              color: "#1a1a1a",
              wrap: true,
            },
            ...(calendar
              ? [
                  {
                    type: "text",
                    text: calendar,
                    size: "xs",
                    color: "#888888",
                    margin: "sm",
                    wrap: true,
                  },
                ]
              : []),
          ],
          flex: 1,
          paddingStart: "lg",
        },
      ],
      paddingTop: "lg",
      paddingBottom: "lg",
      borderWidth: "light",
      borderColor: "#EEEEEE",
    },
  ];
  if (location || description) {
    const detailItems = [];
    if (location)
      detailItems.push({
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "text",
            text: "📍",
            size: "sm",
            flex: 0,
          },
          {
            type: "text",
            text: location,
            size: "sm",
            color: "#444444",
            margin: "md",
            flex: 1,
            wrap: true,
          },
        ],
        alignItems: "flex-start",
      });
    if (description)
      detailItems.push({
        type: "text",
        text: description,
        size: "sm",
        color: "#666666",
        wrap: true,
        margin: location ? "lg" : "none",
      });
    bodyContents.push({
      type: "box",
      layout: "vertical",
      contents: detailItems,
      margin: "lg",
      paddingAll: "lg",
      backgroundColor: "#F8F9FA",
      cornerRadius: "lg",
    });
  }
  return {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      contents: bodyContents,
      paddingAll: "xl",
      backgroundColor: "#FFFFFF",
      action,
    },
  };
}
/**
 * Create a calendar agenda card showing multiple events
 *
 * Editorial timeline design: Time-focused left column with event details
 * on the right. Visual accent bars indicate event priority/recency.
 */
function createAgendaCard(params) {
  const { title, subtitle, events, footer } = params;
  const headerContents = buildTitleSubtitleHeader({
    title,
    subtitle,
  });
  const eventItems = events.slice(0, 6).map((event, index) => {
    const isActive = event.isNow || index === 0;
    const accentColor = isActive ? "#06C755" : "#E5E5E5";
    const timeColumn = {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: event.time ?? "—",
          size: "sm",
          weight: isActive ? "bold" : "regular",
          color: isActive ? "#06C755" : "#666666",
          align: "end",
          wrap: true,
        },
      ],
      width: "65px",
      justifyContent: "flex-start",
    };
    const dotColumn = {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "box",
          layout: "vertical",
          contents: [],
          width: "10px",
          height: "10px",
          backgroundColor: accentColor,
          cornerRadius: "5px",
        },
      ],
      width: "24px",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingTop: "xs",
    };
    const detailContents = [
      {
        type: "text",
        text: event.title,
        size: "md",
        weight: "bold",
        color: "#1a1a1a",
        wrap: true,
      },
    ];
    const secondaryParts = [];
    if (event.location) secondaryParts.push(event.location);
    if (event.calendar) secondaryParts.push(event.calendar);
    if (secondaryParts.length > 0)
      detailContents.push({
        type: "text",
        text: secondaryParts.join(" · "),
        size: "xs",
        color: "#888888",
        wrap: true,
        margin: "xs",
      });
    return {
      type: "box",
      layout: "horizontal",
      contents: [
        timeColumn,
        dotColumn,
        {
          type: "box",
          layout: "vertical",
          contents: detailContents,
          flex: 1,
        },
      ],
      margin: index > 0 ? "xl" : void 0,
      alignItems: "flex-start",
    };
  });
  return createMegaBubbleWithFooter({
    bodyContents: [
      ...buildCardHeaderSections(headerContents),
      {
        type: "box",
        layout: "vertical",
        contents: eventItems,
        paddingTop: "xl",
      },
    ],
    footer,
  });
}
//#endregion
//#region extensions/line/src/actions.ts
const LINE_ACTION_LABEL_LIMIT = 20;
const LINE_ACTION_DATA_LIMIT = 300;
function truncateLineActionLabel(label, limit = LINE_ACTION_LABEL_LIMIT) {
  return truncateUtf16Safe(label, limit);
}
function truncateLineActionData(data) {
  return truncateUtf16Safe(data, LINE_ACTION_DATA_LIMIT);
}
/**
 * Create a message action (sends text when tapped)
 */
function messageAction(label, text) {
  return {
    type: "message",
    label: truncateLineActionLabel(label),
    text: text ?? label,
  };
}
/**
 * Create a URI action (opens a URL when tapped)
 */
function uriAction(label, uri) {
  return {
    type: "uri",
    label: truncateLineActionLabel(label),
    uri,
  };
}
/**
 * Create a postback action (sends data to webhook when tapped)
 */
function postbackAction(label, data, displayText) {
  return {
    type: "postback",
    label: truncateLineActionLabel(label),
    data: truncateLineActionData(data),
    displayText: displayText === void 0 ? void 0 : truncateLineActionData(displayText),
  };
}
/**
 * Create a datetime picker action
 */
function datetimePickerAction(label, data, mode, options) {
  return {
    type: "datetimepicker",
    label: truncateLineActionLabel(label),
    data: truncateLineActionData(data),
    mode,
    initial: options?.initial,
    max: options?.max,
    min: options?.min,
  };
}
//#endregion
//#region extensions/line/src/flex-templates/media-control-cards.ts
/**
 * Create a media player card for Sonos, Spotify, Apple Music, etc.
 *
 * Editorial design: Album art hero with gradient overlay for text,
 * prominent now-playing indicator, refined playback controls.
 */
function createMediaPlayerCard(params) {
  const { title, subtitle, source, imageUrl, isPlaying, progress, controls, extraActions } = params;
  const trackInfo = [
    {
      type: "text",
      text: title,
      weight: "bold",
      size: "xl",
      color: "#111111",
      wrap: true,
    },
  ];
  if (subtitle)
    trackInfo.push({
      type: "text",
      text: subtitle,
      size: "md",
      color: "#666666",
      wrap: true,
      margin: "sm",
    });
  const statusItems = [];
  if (isPlaying !== void 0)
    statusItems.push({
      type: "box",
      layout: "horizontal",
      contents: [
        {
          type: "box",
          layout: "vertical",
          contents: [],
          width: "8px",
          height: "8px",
          backgroundColor: isPlaying ? "#06C755" : "#CCCCCC",
          cornerRadius: "4px",
        },
        {
          type: "text",
          text: isPlaying ? "Now Playing" : "Paused",
          size: "xs",
          color: isPlaying ? "#06C755" : "#888888",
          weight: "bold",
          margin: "sm",
        },
      ],
      alignItems: "center",
    });
  if (source)
    statusItems.push({
      type: "text",
      text: source,
      size: "xs",
      color: "#AAAAAA",
      margin: statusItems.length > 0 ? "lg" : void 0,
    });
  if (progress)
    statusItems.push({
      type: "text",
      text: progress,
      size: "xs",
      color: "#888888",
      align: "end",
      flex: 1,
    });
  const bodyContents = [
    {
      type: "box",
      layout: "vertical",
      contents: trackInfo,
    },
  ];
  if (statusItems.length > 0)
    bodyContents.push({
      type: "box",
      layout: "horizontal",
      contents: statusItems,
      margin: "lg",
      alignItems: "center",
    });
  const bubble = {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      contents: bodyContents,
      paddingAll: "xl",
      backgroundColor: "#FFFFFF",
    },
  };
  if (imageUrl)
    bubble.hero = {
      type: "image",
      url: imageUrl,
      size: "full",
      aspectRatio: "1:1",
      aspectMode: "cover",
    };
  if (controls || extraActions?.length) {
    const footerContents = [];
    if (controls) {
      const controlButtons = [];
      if (controls.previous)
        controlButtons.push({
          type: "button",
          action: {
            type: "postback",
            label: "⏮",
            data: controls.previous.data,
          },
          style: "secondary",
          flex: 1,
          height: "sm",
        });
      if (controls.play)
        controlButtons.push({
          type: "button",
          action: {
            type: "postback",
            label: "▶",
            data: controls.play.data,
          },
          style: isPlaying ? "secondary" : "primary",
          flex: 1,
          height: "sm",
          margin: controls.previous ? "md" : void 0,
        });
      if (controls.pause)
        controlButtons.push({
          type: "button",
          action: {
            type: "postback",
            label: "⏸",
            data: controls.pause.data,
          },
          style: isPlaying ? "primary" : "secondary",
          flex: 1,
          height: "sm",
          margin: controlButtons.length > 0 ? "md" : void 0,
        });
      if (controls.next)
        controlButtons.push({
          type: "button",
          action: {
            type: "postback",
            label: "⏭",
            data: controls.next.data,
          },
          style: "secondary",
          flex: 1,
          height: "sm",
          margin: controlButtons.length > 0 ? "md" : void 0,
        });
      if (controlButtons.length > 0)
        footerContents.push({
          type: "box",
          layout: "horizontal",
          contents: controlButtons,
        });
    }
    if (extraActions?.length)
      footerContents.push({
        type: "box",
        layout: "horizontal",
        contents: extraActions.slice(0, 2).map((action, index) => ({
          type: "button",
          action: {
            type: "postback",
            label: truncateLineActionLabel(action.label, 15),
            data: action.data,
          },
          style: "secondary",
          flex: 1,
          height: "sm",
          margin: index > 0 ? "md" : void 0,
        })),
        margin: "md",
      });
    if (footerContents.length > 0)
      bubble.footer = {
        type: "box",
        layout: "vertical",
        contents: footerContents,
        paddingAll: "lg",
        backgroundColor: "#FAFAFA",
      };
  }
  return bubble;
}
/**
 * Create an Apple TV remote card with a D-pad and control rows.
 */
function createAppleTvRemoteCard(params) {
  const { deviceName, status, actionData } = params;
  const headerContents = [
    {
      type: "text",
      text: deviceName,
      weight: "bold",
      size: "xl",
      color: "#111111",
      wrap: true,
    },
  ];
  if (status)
    headerContents.push({
      type: "text",
      text: status,
      size: "sm",
      color: "#666666",
      wrap: true,
      margin: "sm",
    });
  const makeButton = (label, data, style = "secondary") => ({
    type: "button",
    action: {
      type: "postback",
      label,
      data,
    },
    style,
    height: "sm",
    flex: 1,
  });
  const dpadRows = [
    {
      type: "box",
      layout: "horizontal",
      contents: [{ type: "filler" }, makeButton("↑", actionData.up), { type: "filler" }],
    },
    {
      type: "box",
      layout: "horizontal",
      contents: [
        makeButton("←", actionData.left),
        makeButton("OK", actionData.select, "primary"),
        makeButton("→", actionData.right),
      ],
      margin: "md",
    },
    {
      type: "box",
      layout: "horizontal",
      contents: [{ type: "filler" }, makeButton("↓", actionData.down), { type: "filler" }],
      margin: "md",
    },
  ];
  const menuRow = {
    type: "box",
    layout: "horizontal",
    contents: [makeButton("Menu", actionData.menu), makeButton("Home", actionData.home)],
    margin: "lg",
  };
  const playbackRow = {
    type: "box",
    layout: "horizontal",
    contents: [makeButton("Play", actionData.play), makeButton("Pause", actionData.pause)],
    margin: "md",
  };
  const volumeRow = {
    type: "box",
    layout: "horizontal",
    contents: [
      makeButton("Vol +", actionData.volumeUp),
      makeButton("Mute", actionData.mute),
      makeButton("Vol -", actionData.volumeDown),
    ],
    margin: "md",
  };
  return {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "box",
          layout: "vertical",
          contents: headerContents,
        },
        {
          type: "separator",
          margin: "lg",
          color: "#EEEEEE",
        },
        ...dpadRows,
        menuRow,
        playbackRow,
        volumeRow,
      ],
      paddingAll: "xl",
      backgroundColor: "#FFFFFF",
    },
  };
}
/**
 * Create a device control card for Apple TV, smart home devices, etc.
 *
 * Editorial design: Device-focused header with status indicator,
 * clean control grid with clear visual hierarchy.
 */
function createDeviceControlCard(params) {
  const { deviceName, deviceType, status, isOnline, imageUrl, controls } = params;
  const headerContents = [
    {
      type: "box",
      layout: "horizontal",
      contents: [
        {
          type: "box",
          layout: "vertical",
          contents: [],
          width: "10px",
          height: "10px",
          backgroundColor: isOnline !== false ? "#06C755" : "#FF5555",
          cornerRadius: "5px",
        },
        {
          type: "text",
          text: deviceName,
          weight: "bold",
          size: "xl",
          color: "#111111",
          wrap: true,
          flex: 1,
          margin: "md",
        },
      ],
      alignItems: "center",
    },
  ];
  if (deviceType)
    headerContents.push({
      type: "text",
      text: deviceType,
      size: "sm",
      color: "#888888",
      margin: "sm",
    });
  if (status)
    headerContents.push({
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: status,
          size: "sm",
          color: "#444444",
          wrap: true,
        },
      ],
      margin: "lg",
      paddingAll: "md",
      backgroundColor: "#F8F9FA",
      cornerRadius: "md",
    });
  const bubble = {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      contents: headerContents,
      paddingAll: "xl",
      backgroundColor: "#FFFFFF",
    },
  };
  if (imageUrl)
    bubble.hero = {
      type: "image",
      url: imageUrl,
      size: "full",
      aspectRatio: "16:9",
      aspectMode: "cover",
    };
  if (controls.length > 0) {
    const rows = [];
    const limitedControls = controls.slice(0, 6);
    for (let i = 0; i < limitedControls.length; i += 2) {
      const rowButtons = [];
      for (const [offset, ctrl] of limitedControls.slice(i, i + 2).entries()) {
        const buttonLabel = ctrl.icon ? `${ctrl.icon} ${ctrl.label}` : ctrl.label;
        rowButtons.push({
          type: "button",
          action: {
            type: "postback",
            label: truncateLineActionLabel(buttonLabel, 18),
            data: ctrl.data,
          },
          style: ctrl.style ?? "secondary",
          flex: 1,
          height: "sm",
          margin: offset > 0 ? "md" : void 0,
        });
      }
      if (rowButtons.length === 1) rowButtons.push({ type: "filler" });
      rows.push({
        type: "box",
        layout: "horizontal",
        contents: rowButtons,
        margin: i > 0 ? "md" : void 0,
      });
    }
    bubble.footer = {
      type: "box",
      layout: "vertical",
      contents: rows,
      paddingAll: "lg",
      backgroundColor: "#FAFAFA",
    };
  }
  return bubble;
}
//#endregion
//#region extensions/line/src/flex-templates/message.ts
/**
 * Wrap a FlexContainer in a FlexMessage
 */
function toFlexMessage(altText, contents) {
  return {
    type: "flex",
    altText,
    contents,
  };
}
//#endregion
export {
  createNotificationBubble as _,
  datetimePickerAction as a,
  uriAction as c,
  createReceiptCard as d,
  createActionCard as f,
  createListCard as g,
  createInfoCard as h,
  createMediaPlayerCard as i,
  createAgendaCard as l,
  createImageCard as m,
  createAppleTvRemoteCard as n,
  messageAction as o,
  createCarousel as p,
  createDeviceControlCard as r,
  postbackAction as s,
  toFlexMessage as t,
  createEventCard as u,
};
