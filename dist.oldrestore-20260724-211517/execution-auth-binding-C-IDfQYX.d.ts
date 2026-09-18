import { w as ResolvedProviderAuth } from "./model-auth-DQnRyl6R.js";
import { i as AuthProfileCredential } from "./types-Dzb4Vh4b.js";

//#region src/agents/execution-auth-binding.d.ts
/** Ephemeral proof of the credential or opaque runtime that completed one agent run. */
type AgentExecutionAuthBinding = {
  authProfileId?: string /** Exact embedded harness that completed the successful turn, including openclaw. */;
  agentHarnessId?: string /** Non-reversible identity hash; credential material never leaves the runner. */;
  authFingerprint?: string /** Runtime-owned principal/session shape used when credentials are intentionally opaque. */;
  runtimeOwnerFingerprint?: string /** Exact opaque owner, or plugin harness carrying a credential-backed turn. */;
  runtimeOwnerKind?: OpaqueRuntimeOwnerKind /** Exact backend/harness id that owned the successful turn. */;
  runtimeOwnerId?: string /** Exact CLI or plugin-harness implementation used by the successful turn. */;
  runtimeArtifactFingerprint?: string;
  runtimeArtifactId?: string /** The prepared CLI bridge used only the selected profile, not ambient CLI auth. */;
  skipLocalCredential?: true;
};
type OpaqueRuntimeOwnerKind = "cli-runtime" | "plugin-harness" | "aws-sdk";
/** Fingerprint a profile after materializing its selected SecretRef value. */
declare function fingerprintResolvedAuthProfileCredential(params: {
  profileId: string;
  credential: AuthProfileCredential;
  resolvedAuth: ResolvedProviderAuth | null | undefined;
}): string | undefined;
//#endregion
export {
  OpaqueRuntimeOwnerKind as n,
  fingerprintResolvedAuthProfileCredential as r,
  AgentExecutionAuthBinding as t,
};
