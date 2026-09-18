//#region src/infra/exec-safe-bin-policy-profiles.d.ts
type SafeBinProfile = {
  minPositional?: number;
  maxPositional?: number;
  allowedValueFlags?: ReadonlySet<string>;
  allowedBooleanFlags?: ReadonlySet<string>;
  deniedFlags?: ReadonlySet<string>;
  knownLongFlags?: readonly string[];
  knownLongFlagsSet?: ReadonlySet<string>;
  longFlagPrefixMap?: ReadonlyMap<string, string | null>;
};
type SafeBinProfileFixture = {
  minPositional?: number;
  maxPositional?: number;
  allowedValueFlags?: readonly string[];
  deniedFlags?: readonly string[];
};
//#endregion
export { SafeBinProfileFixture as n, SafeBinProfile as t };
