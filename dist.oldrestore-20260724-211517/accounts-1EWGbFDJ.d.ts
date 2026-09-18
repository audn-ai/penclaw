//#region extensions/raft/src/accounts.d.ts
type ResolvedRaftAccount = {
  accountId: string;
  name: string | undefined;
  enabled: boolean;
  configured: boolean;
  profile: string | null;
};
//#endregion
export { ResolvedRaftAccount as t };
