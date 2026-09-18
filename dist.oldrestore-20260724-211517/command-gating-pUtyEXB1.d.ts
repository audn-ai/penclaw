//#region src/channels/command-gating.d.ts
/**
 * Shared text-control command authorization policy for channel runtimes.
 *
 * These helpers are re-exported through the plugin SDK so built-in and external
 * channels make the same access-groups decisions for native command text.
 */
/** One channel-specific authorization source for text control commands. */
type CommandAuthorizer = {
  /** True when this channel/user identity has an access-group rule configured. */ configured: boolean /** True when the configured rule permits the command. Ignored when unconfigured. */;
  allowed: boolean;
};
/** Fallback policy for channels that have access groups globally disabled. */
type CommandGatingModeWhenAccessGroupsOff = "allow" | "deny" | "configured";
/** Resolves whether any configured authorizer permits a control command. */
declare function resolveCommandAuthorizedFromAuthorizers(params: {
  /** Global access-group switch for the channel/runtime. */ useAccessGroups: boolean /** Independent authorization sources, such as sender id and actor id. */;
  authorizers: CommandAuthorizer[] /** Policy used only when `useAccessGroups` is false. Defaults to open. */;
  modeWhenAccessGroupsOff?: CommandGatingModeWhenAccessGroupsOff;
}): boolean;
/** Resolves command authorization and whether the current text command should be blocked. */
declare function resolveControlCommandGate(params: {
  /** Global access-group switch for the channel/runtime. */ useAccessGroups: boolean /** Authorization sources checked by this channel command. */;
  authorizers: CommandAuthorizer[] /** Channel setting that enables text commands as an input surface. */;
  allowTextCommands: boolean /** True when the current inbound message parsed as a control command. */;
  hasControlCommand: boolean /** Policy used only when `useAccessGroups` is false. Defaults to open. */;
  modeWhenAccessGroupsOff?: CommandGatingModeWhenAccessGroupsOff;
}): {
  commandAuthorized: boolean;
  shouldBlock: boolean;
};
/** Convenience gate for channels that check primary and secondary text command identities. */
declare function resolveDualTextControlCommandGate(params: {
  /** Global access-group switch for the channel/runtime. */ useAccessGroups: boolean /** Whether the primary identity has an access-group rule. */;
  primaryConfigured: boolean /** Whether the primary configured rule permits the command. */;
  primaryAllowed: boolean /** Whether the secondary identity has an access-group rule. */;
  secondaryConfigured: boolean /** Whether the secondary configured rule permits the command. */;
  secondaryAllowed: boolean /** True when the current inbound message parsed as a control command. */;
  hasControlCommand: boolean /** Policy used only when `useAccessGroups` is false. Defaults to open. */;
  modeWhenAccessGroupsOff?: CommandGatingModeWhenAccessGroupsOff;
}): {
  commandAuthorized: boolean;
  shouldBlock: boolean;
};
//#endregion
export {
  resolveDualTextControlCommandGate as a,
  resolveControlCommandGate as i,
  CommandGatingModeWhenAccessGroupsOff as n,
  resolveCommandAuthorizedFromAuthorizers as r,
  CommandAuthorizer as t,
};
