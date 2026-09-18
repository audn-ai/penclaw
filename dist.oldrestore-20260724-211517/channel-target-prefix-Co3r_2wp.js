import { n as normalizeMessageChannel } from "./message-channel-core-CgTCmAZC.js";
import { t as getActivePluginChannelRegistryFromState } from "./runtime-channel-state-DFG20Bn5.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
//#region src/infra/outbound/channel-target-prefix.ts
const TARGET_KIND_PREFIXES = /* @__PURE__ */ new Set([
  "channel",
  "conversation",
  "dm",
  "group",
  "room",
  "thread",
  "user",
]);
/** Removes a selected channel/provider prefix from an outbound target string. */
function stripTargetProviderPrefix(raw, ...providers) {
  const trimmed = raw.trim();
  const lower = normalizeOptionalLowercaseString(trimmed) ?? "";
  for (const provider of providers) {
    const normalizedProvider = normalizeOptionalLowercaseString(provider);
    if (normalizedProvider && lower.startsWith(`${normalizedProvider}:`))
      return trimmed.slice(normalizedProvider.length + 1).trim();
  }
  return trimmed;
}
/** Removes generic target-kind prefixes such as room:, thread:, or user:. */
function stripTargetKindPrefix(
  raw,
  kinds = ["channel", "conversation", "dm", "group", "room", "thread", "user"],
) {
  const kindPattern = kinds
    .map((kind) => normalizeOptionalLowercaseString(kind))
    .filter((kind) => Boolean(kind))
    .join("|");
  return kindPattern ? raw.replace(new RegExp(`^(${kindPattern}):`, "i"), "").trim() : raw.trim();
}
/** Strips plugin topic suffixes while preserving ordinary colon-containing targets. */
function stripTargetTopicSuffix(raw, options = {}) {
  const trimmed = raw.trim();
  const numericTopicMatch = options.allowNumericShorthand ? /^(-?\d+):(\d+)$/.exec(trimmed) : null;
  if (numericTopicMatch?.[1]) return numericTopicMatch[1];
  return trimmed.replace(/:topic:.*$/i, "").trim();
}
function resolvePluginTargetPrefix(prefix) {
  const normalizedPrefix = normalizeOptionalLowercaseString(prefix);
  if (!normalizedPrefix) return;
  const registry = getActivePluginChannelRegistryFromState();
  for (const entry of registry?.channels ?? []) {
    const plugin = entry.plugin;
    const channelId = normalizeOptionalLowercaseString(plugin.id);
    const candidates = plugin.messaging?.targetPrefixes ?? [];
    if (
      channelId &&
      candidates.some(
        (candidate) => normalizeOptionalLowercaseString(candidate) === normalizedPrefix,
      )
    )
      return channelId;
  }
}
function resolveChannelTargetProviderPrefix(raw) {
  const prefix = normalizeOptionalLowercaseString(/^\s*([a-z][a-z0-9_-]*):/i.exec(raw ?? "")?.[1]);
  if (!prefix || TARGET_KIND_PREFIXES.has(prefix)) return;
  const channel = resolvePluginTargetPrefix(prefix);
  return channel
    ? {
        prefix,
        channel,
      }
    : void 0;
}
/** Resolves the channel implied by a plugin-owned target prefix, if any. */
function resolveTargetPrefixedChannel(raw) {
  return resolveChannelTargetProviderPrefix(raw)?.channel;
}
/** Rejects targets whose plugin-owned prefix belongs to a different selected channel. */
function validateTargetProviderPrefix(params) {
  const selectedChannel =
    normalizeMessageChannel(params.channel) ?? normalizeOptionalLowercaseString(params.channel);
  if (!selectedChannel || selectedChannel === "last") return;
  const prefixed = resolveChannelTargetProviderPrefix(params.to);
  if (!prefixed || prefixed.channel === selectedChannel) return;
  return /* @__PURE__ */ new Error(
    `Target prefix "${prefixed.prefix}:" belongs to ${prefixed.channel}, not ${selectedChannel}.`,
  );
}
//#endregion
export {
  validateTargetProviderPrefix as a,
  stripTargetTopicSuffix as i,
  stripTargetKindPrefix as n,
  stripTargetProviderPrefix as r,
  resolveTargetPrefixedChannel as t,
};
