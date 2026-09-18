import { t as expectDefined } from "./expect-CyE8FADM.js";
import { t as explainShellCommand } from "./extract-skAT4q_B.js";
import "./src-Bl7G9qvi.js";
import { t as buildCommandPayloadCandidates } from "./risks-Bhlho1S0.js";
import { N as splitShellArgs } from "./shell-wrapper-resolution-DlXABXcG.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
//#region src/infra/exec-control-command-guard.ts
function parseExecApprovalShellCommand(raw) {
  const match = raw
    .trimStart()
    .match(
      /^\/approve(?:@[^\s]+)?\s+([A-Za-z0-9][A-Za-z0-9._:-]*)\s+(allow-once|allow-always|always|deny)\b/i,
    );
  if (!match) return null;
  return {
    approvalId: expectDefined(match[1], "exec control command guard regex capture 1"),
    decision:
      normalizeLowercaseStringOrEmpty(match[2]) === "always"
        ? "allow-always"
        : normalizeLowercaseStringOrEmpty(match[2]),
  };
}
function normalizeCommandBaseName(token) {
  if (!token) return "";
  return normalizeLowercaseStringOrEmpty(token.split(/[\\/]/u).at(-1)).replace(
    /\.(?:cmd|exe)$/u,
    "",
  );
}
function stripOpenClawPackageRunner(argv) {
  const commandName = normalizeCommandBaseName(argv[0]);
  if (commandName === "openclaw") return argv;
  if (
    (commandName === "pnpm" || commandName === "npm" || commandName === "yarn") &&
    normalizeCommandBaseName(argv[1]) === "openclaw"
  )
    return argv.slice(1);
  if (
    (commandName === "pnpm" || commandName === "npm" || commandName === "yarn") &&
    (argv[1] === "exec" || argv[1] === "dlx" || argv[1] === "run") &&
    normalizeCommandBaseName(argv[2]) === "openclaw"
  )
    return argv.slice(2);
  if (commandName === "npx" || commandName === "bunx") {
    let idx = 1;
    while (idx < argv.length) {
      const token = expectDefined(argv[idx], "argv entry at idx");
      if (token === "--") {
        idx += 1;
        break;
      }
      if (!token.startsWith("-") || token === "-") break;
      idx += 1;
      if ((token === "-p" || token === "--package") && idx < argv.length) idx += 1;
    }
    if (normalizeCommandBaseName(argv[idx]) === "openclaw") return argv.slice(idx);
  }
  return argv;
}
function parseOpenClawChannelsLoginShellCommand(raw) {
  const argv = splitShellArgs(raw);
  if (!argv) return false;
  const openclawArgv = stripOpenClawPackageRunner(argv);
  return (
    normalizeCommandBaseName(openclawArgv[0]) === "openclaw" &&
    (openclawArgv[1] === "channels" || openclawArgv[1] === "channel") &&
    openclawArgv[2] === "login"
  );
}
async function detectUnsafeExecControlShellCommand(command) {
  const rawCommand = command.trim();
  const candidates = await (async () => {
    try {
      const explanation = await explainShellCommand(rawCommand);
      if (explanation.ok)
        return [...explanation.topLevelCommands, ...explanation.nestedCommands].flatMap((step) =>
          buildCommandPayloadCandidates(step.argv),
        );
    } catch {}
    return normalizeStringEntries(rawCommand.split(/\r?\n/)).flatMap((line) => {
      const argv = splitShellArgs(line);
      return argv ? buildCommandPayloadCandidates(argv) : [line];
    });
  })();
  for (const candidate of candidates) {
    if (parseExecApprovalShellCommand(candidate)) return "approve";
    if (parseOpenClawChannelsLoginShellCommand(candidate)) return "channel-login";
  }
  return null;
}
async function rejectUnsafeExecControlShellCommand(command) {
  const unsafeKind = await detectUnsafeExecControlShellCommand(command);
  if (unsafeKind === "approve")
    throw new Error(
      [
        "exec cannot run /approve commands.",
        "Show the /approve command to the user as chat text, or route it through the approval command handler instead of shell execution.",
      ].join(" "),
    );
  if (unsafeKind === "channel-login")
    throw new Error(
      [
        "exec cannot run interactive OpenClaw channel login commands.",
        "Run `openclaw channels login` in a terminal on the gateway host, or use the channel-specific login agent tool when available (for WhatsApp: `whatsapp_login`).",
      ].join(" "),
    );
}
//#endregion
export { rejectUnsafeExecControlShellCommand as n, detectUnsafeExecControlShellCommand as t };
