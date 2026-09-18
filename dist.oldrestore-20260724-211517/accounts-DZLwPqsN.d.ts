//#region extensions/zalouser/src/types.d.ts
type ZcaUserInfo = {
  userId: string;
  displayName: string;
  avatar?: string;
};
type ZalouserToolConfig = {
  allow?: string[];
  deny?: string[];
};
type ZalouserGroupConfig = {
  enabled?: boolean;
  requireMention?: boolean;
  tools?: ZalouserToolConfig;
};
type ZalouserSharedConfig = {
  enabled?: boolean;
  name?: string;
  profile?: string;
  dangerouslyAllowNameMatching?: boolean;
  dmPolicy?: "pairing" | "allowlist" | "open" | "disabled";
  allowFrom?: Array<string | number>;
  historyLimit?: number;
  groupAllowFrom?: Array<string | number>;
  groupPolicy?: "open" | "allowlist" | "disabled";
  groups?: Record<string, ZalouserGroupConfig>;
  messagePrefix?: string;
  responsePrefix?: string;
};
type ZalouserAccountConfig = ZalouserSharedConfig;
type ResolvedZalouserAccount = {
  accountId: string;
  name?: string;
  enabled: boolean;
  profile: string;
  authenticated: boolean;
  config: ZalouserAccountConfig;
};
//#endregion
export { ZcaUserInfo as n, ResolvedZalouserAccount as t };
