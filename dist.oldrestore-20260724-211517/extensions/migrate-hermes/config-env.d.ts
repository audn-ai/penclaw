//#region extensions/migrate-hermes/config-env.d.ts
declare const MCP_ENV_REFERENCE_RE: RegExp;
declare function resolveMcpEnvReferences(
  value: unknown,
  env: Record<string, string>,
): {
  unresolved: boolean;
  value: unknown;
};
declare function mcpValueHasEnvReferences(value: unknown): boolean;
//#endregion
export { MCP_ENV_REFERENCE_RE, mcpValueHasEnvReferences, resolveMcpEnvReferences };
