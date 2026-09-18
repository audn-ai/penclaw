//#region extensions/migrate-hermes/secret-mappings.d.ts
type SecretCredentialMode = "api_key" | "token";
type SecretMapping = {
  envVar: string;
  provider: string;
  profileId: string;
  mode?: SecretCredentialMode;
};
declare const SECRET_MAPPINGS: readonly SecretMapping[];
//#endregion
export { SECRET_MAPPINGS, SecretCredentialMode, SecretMapping };
