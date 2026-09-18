import { n as getActivePluginChannelRegistry } from "./runtime-CcYnX0B4.js";
import {
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
//#region src/auto-reply/reply/channel-context.ts
/** Resolves channel and account context for command handlers. */
/** Resolves the command surface channel from inbound context and command state. */
function resolveCommandSurfaceChannel(params) {
  return (
    normalizeOptionalLowercaseString(
      params.ctx.OriginatingChannel ??
        params.command.channel ??
        params.ctx.Surface ??
        params.ctx.Provider,
    ) ?? ""
  );
}
/** Resolves command account id, falling back to plugin default account config. */
function resolveChannelAccountId(params) {
  const accountId = normalizeOptionalString(params.ctx.AccountId) ?? "";
  if (accountId) return accountId;
  const channel = resolveCommandSurfaceChannel(params);
  const plugin = getActivePluginChannelRegistry()?.channels.find(
    (entry) => entry.plugin.id === channel,
  )?.plugin;
  return normalizeOptionalString(plugin?.config.defaultAccountId?.(params.cfg)) || "default";
}
//#endregion
export { resolveCommandSurfaceChannel as n, resolveChannelAccountId as t };
