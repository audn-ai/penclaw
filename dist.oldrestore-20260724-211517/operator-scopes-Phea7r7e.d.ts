//#region src/gateway/operator-scopes.d.ts
declare const ADMIN_SCOPE: "operator.admin";
declare const READ_SCOPE: "operator.read";
declare const WRITE_SCOPE: "operator.write";
declare const APPROVALS_SCOPE: "operator.approvals";
declare const PAIRING_SCOPE: "operator.pairing";
declare const TALK_SECRETS_SCOPE: "operator.talk.secrets";
/** Operator privileges advertised by gateway auth and checked by method policy. */
type OperatorScope =
  | typeof ADMIN_SCOPE
  | typeof READ_SCOPE
  | typeof WRITE_SCOPE
  | typeof APPROVALS_SCOPE
  | typeof PAIRING_SCOPE
  | typeof TALK_SECRETS_SCOPE;
//#endregion
export { OperatorScope as t };
