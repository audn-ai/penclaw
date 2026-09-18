import { a as normalizeDiscordSlug } from "./allow-list-DdPHme1x.js";
import { r as fetchDiscord } from "./api-BRW47agJ.js";
import { t as normalizeDiscordToken } from "./token-3J3M7UAn.js";
//#region extensions/discord/src/guilds.ts
async function listGuilds(token, fetcher, options) {
  return (await fetchDiscord("/users/@me/guilds", token, fetcher, options))
    .filter((guild) => typeof guild.id === "string" && typeof guild.name === "string")
    .map((guild) => ({
      id: guild.id,
      name: guild.name,
      slug: normalizeDiscordSlug(guild.name),
    }));
}
//#endregion
//#region extensions/discord/src/resolve-allowlist-common.ts
function resolveDiscordAllowlistToken(token) {
  return normalizeDiscordToken(token, "channels.discord.token");
}
function buildDiscordUnresolvedResults(entries, buildResult) {
  return entries.map(buildResult);
}
function findDiscordGuildByName(guilds, input) {
  const slug = normalizeDiscordSlug(input);
  if (!slug) return;
  return guilds.find((guild) => guild.slug === slug);
}
function filterDiscordGuilds(guilds, params) {
  if (params.guildId) return guilds.filter((guild) => guild.id === params.guildId);
  if (params.guildName) {
    const match = findDiscordGuildByName(guilds, params.guildName);
    return match ? [match] : [];
  }
  return guilds;
}
//#endregion
export {
  listGuilds as i,
  filterDiscordGuilds as n,
  resolveDiscordAllowlistToken as r,
  buildDiscordUnresolvedResults as t,
};
