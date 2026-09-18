import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { t as note } from "./note-Uvqr4R1d.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
//#region src/commands/doctor-command-owner.ts
/** Doctor warning for missing command owners on privileged channel commands. */
function resolveConfiguredCommandOwners(cfg) {
  const owners = cfg.commands?.ownerAllowFrom;
  if (!Array.isArray(owners)) return [];
  return normalizeStringEntries(owners.map((entry) => String(entry ?? "")));
}
/** Returns true when at least one owner sender id is configured. */
function hasConfiguredCommandOwners(cfg) {
  return resolveConfiguredCommandOwners(cfg).length > 0;
}
/** Formats a channel sender id into the commands.ownerAllowFrom entry shape. */
function formatCommandOwnerFromChannelSender(params) {
  const id = normalizeOptionalString(params.id);
  if (!id) return null;
  const separatorIndex = id.indexOf(":");
  if (separatorIndex > 0) {
    if (id.slice(0, separatorIndex).toLowerCase() === String(params.channel).toLowerCase())
      return id;
  }
  return `${params.channel}:${id}`;
}
/** Emits setup guidance when privileged command ownership is not configured. */
function noteCommandOwnerHealth(cfg) {
  if (hasConfiguredCommandOwners(cfg)) return;
  note(
    [
      "No command owner is configured.",
      "A command owner is the human operator account allowed to run owner-only commands and approve dangerous actions, including /diagnostics, /export-trajectory, /config, and exec approvals.",
      "DM pairing only lets someone talk to the bot; it does not make that sender the owner for privileged commands.",
      `Fix: set commands.ownerAllowFrom to your channel user id, for example ${formatCliCommand("openclaw config set commands.ownerAllowFrom '[\"telegram:123456789\"]'")}`,
      "Restart the gateway after changing this if it is already running.",
    ].join("\n"),
    "Command owner",
  );
}
//#endregion
export {
  hasConfiguredCommandOwners as n,
  noteCommandOwnerHealth as r,
  formatCommandOwnerFromChannelSender as t,
};
