import { r as buildChannelConfigSchema } from "./config-schema-qmCQZl6j.js";
import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import { f as requireChannelOpenAllowFrom } from "./extension-shared-DqZe9psR.js";
import {
  i as createMediaPlayerCard,
  l as createAgendaCard,
  n as createAppleTvRemoteCard,
  r as createDeviceControlCard,
  u as createEventCard,
} from "./flex-templates-BBTGBUm1.js";
import { _ as parseStrictFiniteNumber } from "./number-coercion-CJQ8TR--.js";
import {
  At as boolean,
  Et as array,
  Nn as record,
  Rn as string,
  Tn as object,
  Xn as union,
  wn as number,
  yt as _enum,
} from "./schemas-CBJjibl3.js";
import "./number-runtime-B-n-wjMn.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import "./channel-config-schema-C-vJvjtu.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { U as requireOpenAllowFrom } from "./zod-schema.core-CWTCY1ZZ.js";
//#region extensions/line/src/config-schema.ts
const DmPolicySchema = _enum(["open", "allowlist", "pairing", "disabled"]);
const GroupPolicySchema = _enum(["open", "allowlist", "disabled"]);
const ThreadBindingsSchema = object({
  enabled: boolean().optional(),
  idleHours: number().optional(),
  maxAgeHours: number().optional(),
  spawnSessions: boolean().optional(),
  defaultSpawnContext: _enum(["isolated", "fork"]).optional(),
  spawnSubagentSessions: boolean().optional(),
  spawnAcpSessions: boolean().optional(),
}).strict();
const LineCommonConfigSchemaBase = object({
  enabled: boolean().optional(),
  channelAccessToken: string().optional(),
  channelSecret: string().optional(),
  tokenFile: string().optional(),
  secretFile: string().optional(),
  name: string().optional(),
  allowFrom: array(union([string(), number()])).optional(),
  groupAllowFrom: array(union([string(), number()])).optional(),
  dmPolicy: DmPolicySchema.optional().default("pairing"),
  groupPolicy: GroupPolicySchema.optional().default("allowlist"),
  responsePrefix: string().optional(),
  mediaMaxMb: number().optional(),
  webhookPath: string().optional(),
  threadBindings: ThreadBindingsSchema.optional(),
});
const LineGroupConfigSchema = object({
  enabled: boolean().optional(),
  allowFrom: array(union([string(), number()])).optional(),
  requireMention: boolean().optional(),
  systemPrompt: string().optional(),
  skills: array(string()).optional(),
}).strict();
const LineAccountConfigSchema = LineCommonConfigSchemaBase.extend({
  groups: record(string(), LineGroupConfigSchema.optional()).optional(),
})
  .strict()
  .superRefine((value, ctx) => {
    requireChannelOpenAllowFrom({
      channel: "line",
      policy: value.dmPolicy,
      allowFrom: value.allowFrom,
      ctx,
      requireOpenAllowFrom,
    });
  });
const LineConfigSchema = LineCommonConfigSchemaBase.extend({
  accounts: record(string(), LineAccountConfigSchema.optional()).optional(),
  defaultAccount: string().optional(),
  groups: record(string(), LineGroupConfigSchema.optional()).optional(),
})
  .strict()
  .superRefine((value, ctx) => {
    requireChannelOpenAllowFrom({
      channel: "line",
      policy: value.dmPolicy,
      allowFrom: value.allowFrom,
      ctx,
      requireOpenAllowFrom,
    });
  });
const LineChannelConfigSchema = buildChannelConfigSchema(LineConfigSchema);
//#endregion
//#region extensions/line/src/reply-payload-transform.ts
/**
 * Parse LINE-specific directives from text and extract them into ReplyPayload fields.
 *
 * Supported directives:
 * - [[quick_replies: option1, option2, option3]]
 * - [[location: title | address | latitude | longitude]]
 * - [[confirm: question | yes_label | no_label]]
 * - [[buttons: title | text | btn1:data1, btn2:data2]]
 * - [[media_player: title | artist | source | imageUrl | playing/paused]]
 * - [[event: title | date | time | location | description]]
 * - [[agenda: title | event1_title:event1_time, event2_title:event2_time, ...]]
 * - [[device: name | type | status | ctrl1:data1, ctrl2:data2]]
 * - [[appletv_remote: name | status]]
 */
function parseLineDirectives(payload) {
  let text = payload.text;
  if (!text) return payload;
  const result = { ...payload };
  const lineData = { ...result.channelData?.line };
  const toSlug = (value) =>
    normalizeLowercaseStringOrEmpty(value)
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "") || "device";
  const lineActionData = (action, extras) => {
    const base = [`line.action=${encodeURIComponent(action)}`];
    if (extras)
      for (const [key, value] of Object.entries(extras))
        base.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    return base.join("&");
  };
  const parseConfirmAction = (part) => {
    const colonIndex = part.indexOf(":");
    if (colonIndex === -1)
      return {
        label: part,
        data: normalizeLowercaseStringOrEmpty(part),
      };
    return {
      label: part.slice(0, colonIndex).trim(),
      data: part.slice(colonIndex + 1).trim(),
    };
  };
  const quickRepliesMatch = text.match(/\[\[quick_replies:\s*([^\]]+)\]\]/i);
  if (quickRepliesMatch) {
    const options = normalizeStringEntries(
      expectDefined(quickRepliesMatch[1], "quick replies directive body").split(","),
    );
    if (options.length > 0) lineData.quickReplies = [...(lineData.quickReplies || []), ...options];
    text = text.replace(quickRepliesMatch[0], "").trim();
  }
  const locationMatch = text.match(/\[\[location:\s*([^\]]+)\]\]/i);
  if (locationMatch && !lineData.location) {
    const parts = expectDefined(locationMatch[1], "location directive body")
      .split("|")
      .map((s) => s.trim());
    if (parts.length >= 4) {
      const title = expectDefined(parts[0], "location title field");
      const address = expectDefined(parts[1], "location address field");
      const latStr = expectDefined(parts[2], "location latitude field");
      const lonStr = expectDefined(parts[3], "location longitude field");
      const latitude = parseStrictFiniteNumber(latStr);
      const longitude = parseStrictFiniteNumber(lonStr);
      if (latitude !== void 0 && longitude !== void 0)
        lineData.location = {
          title: title || "Location",
          address: address || "",
          latitude,
          longitude,
        };
    }
    text = text.replace(locationMatch[0], "").trim();
  }
  const confirmMatch = text.match(/\[\[confirm:\s*([^\]]+)\]\]/i);
  if (confirmMatch && !lineData.templateMessage) {
    const parts = expectDefined(confirmMatch[1], "confirm directive body")
      .split("|")
      .map((s) => s.trim());
    if (parts.length >= 3) {
      const question = expectDefined(parts[0], "confirm question field");
      const yesPart = expectDefined(parts[1], "confirm yes field");
      const noPart = expectDefined(parts[2], "confirm no field");
      const yesAction = parseConfirmAction(yesPart);
      const noAction = parseConfirmAction(noPart);
      if (question && yesAction.label && noAction.label)
        lineData.templateMessage = {
          type: "confirm",
          text: question,
          confirmLabel: yesAction.label,
          confirmData: yesAction.data,
          cancelLabel: noAction.label,
          cancelData: noAction.data,
          altText: question,
        };
    }
    text = text.replace(confirmMatch[0], "").trim();
  }
  const buttonsMatch = text.match(/\[\[buttons:\s*([^\]]+)\]\]/i);
  if (buttonsMatch && !lineData.templateMessage) {
    const parts = expectDefined(buttonsMatch[1], "buttons directive body")
      .split("|")
      .map((s) => s.trim());
    if (parts.length >= 3) {
      const title = expectDefined(parts[0], "buttons title field");
      const bodyText = expectDefined(parts[1], "buttons text field");
      const actions = expectDefined(parts[2], "buttons actions field")
        .split(",")
        .map((actionStr) => {
          const trimmed = actionStr.trim();
          const colonIndex = (() => {
            const index = trimmed.indexOf(":");
            if (index === -1) return -1;
            const lower = normalizeLowercaseStringOrEmpty(trimmed);
            if (lower.startsWith("http://") || lower.startsWith("https://")) return -1;
            return index;
          })();
          let label;
          let data;
          if (colonIndex === -1) {
            label = trimmed;
            data = trimmed;
          } else {
            label = trimmed.slice(0, colonIndex).trim();
            data = trimmed.slice(colonIndex + 1).trim();
          }
          if (data.startsWith("http://") || data.startsWith("https://"))
            return {
              type: "uri",
              label,
              uri: data,
            };
          if (data.includes("="))
            return {
              type: "postback",
              label,
              data,
            };
          return {
            type: "message",
            label,
            data: data || label,
          };
        })
        .filter((action) => action.label);
      if (actions.length > 0 && bodyText)
        lineData.templateMessage = {
          type: "buttons",
          ...(title ? { title } : {}),
          text: bodyText,
          actions: actions.slice(0, 4),
          altText: title ? `${title}: ${bodyText}` : bodyText,
        };
    }
    text = text.replace(buttonsMatch[0], "").trim();
  }
  const mediaPlayerMatch = text.match(/\[\[media_player:\s*([^\]]+)\]\]/i);
  if (mediaPlayerMatch && !lineData.flexMessage) {
    const parts = expectDefined(mediaPlayerMatch[1], "media player directive body")
      .split("|")
      .map((s) => s.trim());
    if (parts.length >= 1) {
      const title = expectDefined(parts[0], "media player title field");
      const [, artist, source, imageUrl, statusStr] = parts;
      const isPlaying = normalizeLowercaseStringOrEmpty(statusStr) === "playing";
      const validImageUrl = imageUrl?.startsWith("https://") ? imageUrl : void 0;
      const deviceKey = toSlug(source || title || "media");
      const card = createMediaPlayerCard({
        title: title || "Unknown Track",
        subtitle: artist || void 0,
        source: source || void 0,
        imageUrl: validImageUrl,
        isPlaying: statusStr ? isPlaying : void 0,
        controls: {
          previous: { data: lineActionData("previous", { "line.device": deviceKey }) },
          play: { data: lineActionData("play", { "line.device": deviceKey }) },
          pause: { data: lineActionData("pause", { "line.device": deviceKey }) },
          next: { data: lineActionData("next", { "line.device": deviceKey }) },
        },
      });
      lineData.flexMessage = {
        altText: `🎵 ${title}${artist ? ` - ${artist}` : ""}`,
        contents: card,
      };
    }
    text = text.replace(mediaPlayerMatch[0], "").trim();
  }
  const eventMatch = text.match(/\[\[event:\s*([^\]]+)\]\]/i);
  if (eventMatch && !lineData.flexMessage) {
    const parts = expectDefined(eventMatch[1], "event directive body")
      .split("|")
      .map((s) => s.trim());
    if (parts.length >= 2) {
      const title = expectDefined(parts[0], "event title field");
      const date = expectDefined(parts[1], "event date field");
      const time = parts[2];
      const location = parts[3];
      const description = parts[4];
      const card = createEventCard({
        title: title || "Event",
        date: date || "TBD",
        time: time || void 0,
        location: location || void 0,
        description: description || void 0,
      });
      lineData.flexMessage = {
        altText: `📅 ${title} - ${date}${time ? ` ${time}` : ""}`,
        contents: card,
      };
    }
    text = text.replace(eventMatch[0], "").trim();
  }
  const appleTvMatch = text.match(/\[\[appletv_remote:\s*([^\]]+)\]\]/i);
  if (appleTvMatch && !lineData.flexMessage) {
    const parts = expectDefined(appleTvMatch[1], "Apple TV directive body")
      .split("|")
      .map((s) => s.trim());
    if (parts.length >= 1) {
      const deviceName = expectDefined(parts[0], "Apple TV device name field");
      const [, status] = parts;
      const deviceKey = toSlug(deviceName || "apple_tv");
      const card = createAppleTvRemoteCard({
        deviceName: deviceName || "Apple TV",
        status: status || void 0,
        actionData: {
          up: lineActionData("up", { "line.device": deviceKey }),
          down: lineActionData("down", { "line.device": deviceKey }),
          left: lineActionData("left", { "line.device": deviceKey }),
          right: lineActionData("right", { "line.device": deviceKey }),
          select: lineActionData("select", { "line.device": deviceKey }),
          menu: lineActionData("menu", { "line.device": deviceKey }),
          home: lineActionData("home", { "line.device": deviceKey }),
          play: lineActionData("play", { "line.device": deviceKey }),
          pause: lineActionData("pause", { "line.device": deviceKey }),
          volumeUp: lineActionData("volume_up", { "line.device": deviceKey }),
          volumeDown: lineActionData("volume_down", { "line.device": deviceKey }),
          mute: lineActionData("mute", { "line.device": deviceKey }),
        },
      });
      lineData.flexMessage = {
        altText: `📺 ${deviceName || "Apple TV"} Remote`,
        contents: card,
      };
    }
    text = text.replace(appleTvMatch[0], "").trim();
  }
  const agendaMatch = text.match(/\[\[agenda:\s*([^\]]+)\]\]/i);
  if (agendaMatch && !lineData.flexMessage) {
    const parts = expectDefined(agendaMatch[1], "agenda directive body")
      .split("|")
      .map((s) => s.trim());
    if (parts.length >= 2) {
      const title = expectDefined(parts[0], "agenda title field");
      const events = expectDefined(parts[1], "agenda events field")
        .split(",")
        .map((eventStr) => {
          const trimmed = eventStr.trim();
          const colonIdx = trimmed.lastIndexOf(":");
          if (colonIdx > 0)
            return {
              title: trimmed.slice(0, colonIdx).trim(),
              time: trimmed.slice(colonIdx + 1).trim(),
            };
          return { title: trimmed };
        });
      const card = createAgendaCard({
        title: title || "Agenda",
        events,
      });
      lineData.flexMessage = {
        altText: `📋 ${title} (${events.length} events)`,
        contents: card,
      };
    }
    text = text.replace(agendaMatch[0], "").trim();
  }
  const deviceMatch = text.match(/\[\[device:\s*([^\]]+)\]\]/i);
  if (deviceMatch && !lineData.flexMessage) {
    const parts = expectDefined(deviceMatch[1], "device directive body")
      .split("|")
      .map((s) => s.trim());
    if (parts.length >= 1) {
      const deviceName = expectDefined(parts[0], "device name field");
      const [, deviceType, status, controlsStr] = parts;
      const deviceKey = toSlug(deviceName || "device");
      const controls = controlsStr
        ? controlsStr.split(",").map((ctrlStr) => {
            const controlParts = ctrlStr.split(":").map((s) => s.trim());
            const label = expectDefined(controlParts[0], "device control label");
            const action =
              controlParts[1] || normalizeLowercaseStringOrEmpty(label).replace(/\s+/g, "_");
            return {
              label,
              data: lineActionData(action, { "line.device": deviceKey }),
            };
          })
        : [];
      const card = createDeviceControlCard({
        deviceName: deviceName || "Device",
        deviceType: deviceType || void 0,
        status: status || void 0,
        controls,
      });
      lineData.flexMessage = {
        altText: `📱 ${deviceName}${status ? `: ${status}` : ""}`,
        contents: card,
      };
    }
    text = text.replace(deviceMatch[0], "").trim();
  }
  text = text.replace(/\n{3,}/g, "\n\n").trim();
  result.text = text || void 0;
  if (Object.keys(lineData).length > 0)
    result.channelData = {
      ...result.channelData,
      line: lineData,
    };
  return result;
}
function hasLineDirectives(text) {
  return /\[\[(quick_replies|location|confirm|buttons|media_player|event|agenda|device|appletv_remote):/i.test(
    text,
  );
}
//#endregion
export {
  LineConfigSchema as i,
  parseLineDirectives as n,
  LineChannelConfigSchema as r,
  hasLineDirectives as t,
};
