import { i as listChannelPlugins } from "./registry-mc8oBRx8.js";
import {
  S as requireActivePluginChannelRegistry,
  r as getActivePluginChannelRegistryVersion,
} from "./runtime-CcYnX0B4.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import "./plugins-BKdf-5tW.js";
//#region src/auto-reply/commands-text-routing.ts
/** Text-command routing decisions for surfaces that may also support native commands. */
/** Cached native-command surface lookup, invalidated by active plugin-registry version. */
let cachedNativeCommandSurfaces = null;
let cachedNativeCommandSurfacesVersion = -1;
let cachedNativeCommandSurfacesRegistry = null;
/** Returns whether a surface can receive provider-native slash commands. */
function isNativeCommandSurface(surface) {
  const normalized = normalizeOptionalLowercaseString(surface);
  if (!normalized) return false;
  const activeRegistry = requireActivePluginChannelRegistry();
  const registryVersion = getActivePluginChannelRegistryVersion();
  if (
    !cachedNativeCommandSurfaces ||
    cachedNativeCommandSurfacesVersion !== registryVersion ||
    cachedNativeCommandSurfacesRegistry !== activeRegistry
  ) {
    cachedNativeCommandSurfaces = new Set(
      listChannelPlugins()
        .filter((plugin) => plugin.capabilities?.nativeCommands === true)
        .map((plugin) => plugin.id),
    );
    cachedNativeCommandSurfacesVersion = registryVersion;
    cachedNativeCommandSurfacesRegistry = activeRegistry;
  }
  return cachedNativeCommandSurfaces.has(normalized);
}
/** Decides whether text slash commands remain active for the current surface/config pair. */
function shouldHandleTextCommands(params) {
  if (params.commandSource === "native") return true;
  if (params.cfg.commands?.text !== false) return true;
  return !isNativeCommandSurface(params.surface);
}
//#endregion
export { shouldHandleTextCommands as n, isNativeCommandSurface as t };
