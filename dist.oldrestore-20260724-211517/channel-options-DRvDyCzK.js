import { t as readCliStartupMetadata } from "./startup-metadata-CCK-kryO.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
//#region src/cli/channel-options.ts
let precomputedChannelOptions;
function loadPrecomputedChannelOptions() {
  if (precomputedChannelOptions !== void 0) return precomputedChannelOptions;
  try {
    const parsed = readCliStartupMetadata(import.meta.url);
    if (parsed && Array.isArray(parsed.channelOptions)) {
      precomputedChannelOptions = uniqueStrings(
        parsed.channelOptions.filter((value) => typeof value === "string" && Boolean(value)),
      );
      return precomputedChannelOptions;
    }
  } catch {}
  precomputedChannelOptions = null;
  return null;
}
function resolveCliChannelOptions() {
  return loadPrecomputedChannelOptions() ?? [];
}
function formatCliChannelOptions(extra = []) {
  const options = [...extra, ...resolveCliChannelOptions()];
  return options.length > 0 ? options.join("|") : "channel";
}
//#endregion
export { resolveCliChannelOptions as n, formatCliChannelOptions as t };
