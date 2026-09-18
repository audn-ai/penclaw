//#region packages/normalization-core/src/agent-id.d.ts
/** Normalizes an OpenClaw agent id to its filesystem-safe canonical form. */
declare function normalizeAgentId(value: string | undefined | null): string;
/** Returns whether a value is already a canonical agent-id input. */
declare function isValidAgentId(value: string | undefined | null): boolean;
//#endregion
export { normalizeAgentId as n, isValidAgentId as t };
