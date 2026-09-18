import { t as ChannelId } from "./channel-id.types-DjYEl-_2.js";
import { x as ChannelDirectoryAdapter } from "./types.adapters-BND_5Qr-.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region src/channels/read-only-account-inspect.d.ts
type ReadOnlyInspectedAccount = Record<string, unknown>;
/** Inspects channel account config without loading mutable runtime surfaces. */
declare function inspectReadOnlyChannelAccount(params: {
  channelId: ChannelId;
  cfg: OpenClawConfig;
  accountId?: string | null;
}): Promise<ReadOnlyInspectedAccount | null>;
//#endregion
//#region src/channels/plugins/directory-adapters.d.ts
declare const nullChannelDirectorySelf: NonNullable<ChannelDirectoryAdapter["self"]>;
declare const emptyChannelDirectoryList: NonNullable<ChannelDirectoryAdapter["listPeers"]>;
/** Build a channel directory adapter with a null self resolver by default. */
declare function createChannelDirectoryAdapter(
  params?: Omit<ChannelDirectoryAdapter, "self"> & {
    self?: ChannelDirectoryAdapter["self"];
  },
): ChannelDirectoryAdapter;
/** Build the common empty directory surface for channels without directory support. */
declare function createEmptyChannelDirectoryAdapter(): ChannelDirectoryAdapter;
//#endregion
//#region src/plugin-sdk/directory-runtime.d.ts
declare function resolveDirectoryAllowlistEntries<
  TParsed extends {
    id?: string;
  },
  TLookup,
  TResult,
>(params: {
  entries: readonly string[];
  lookup: readonly TLookup[];
  parseInput: (input: string) => TParsed;
  findById: (lookup: readonly TLookup[], id: string) => TLookup | undefined;
  buildIdResolved: (params: { input: string; parsed: TParsed; match?: TLookup }) => TResult;
  resolveNonId: (params: {
    input: string;
    parsed: TParsed;
    lookup: readonly TLookup[];
  }) => TResult | undefined;
  buildUnresolved: (input: string) => TResult;
}): TResult[];
//#endregion
export {
  nullChannelDirectorySelf as a,
  emptyChannelDirectoryList as i,
  createChannelDirectoryAdapter as n,
  ReadOnlyInspectedAccount as o,
  createEmptyChannelDirectoryAdapter as r,
  inspectReadOnlyChannelAccount as s,
  resolveDirectoryAllowlistEntries as t,
};
