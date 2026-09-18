import { R as ChannelResolveResult } from "./types.adapters-BND_5Qr-.js";

//#region src/channels/plugins/target-resolvers.d.ts
/**
 * Builds unresolved target results with one common note.
 */
declare function buildUnresolvedTargetResults(
  inputs: string[],
  note: string,
): ChannelResolveResult[];
/**
 * Resolves targets only when a required token is available.
 */
declare function resolveTargetsWithOptionalToken<TResult>(params: {
  token?: string | null;
  inputs: string[];
  missingTokenNote: string;
  resolveWithToken: (params: { token: string; inputs: string[] }) => Promise<TResult[]>;
  mapResolved: (entry: TResult) => ChannelResolveResult;
}): Promise<ChannelResolveResult[]>;
//#endregion
export { resolveTargetsWithOptionalToken as n, buildUnresolvedTargetResults as t };
