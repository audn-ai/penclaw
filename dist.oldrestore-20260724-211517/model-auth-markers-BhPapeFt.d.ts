import { g as SecretRefSource } from "./types.secrets-C15Z_eLX.js";

//#region src/agents/model-auth-markers.d.ts
/** @deprecated MiniMax provider-owned marker; do not use from third-party plugins. */
declare const MINIMAX_OAUTH_MARKER = "minimax-oauth";
/** Prefix for persisted OAuth-backed API-key marker values. */
declare const OAUTH_API_KEY_MARKER_PREFIX = "oauth:";
/** Marker for local Ollama auth that does not use a real API key. */
declare const OLLAMA_LOCAL_AUTH_MARKER = "ollama-local";
/** @deprecated Bundled local-provider marker; do not use from third-party plugins. */
declare const CUSTOM_LOCAL_AUTH_MARKER = "custom-local";
/** @deprecated Codex provider-owned marker; do not use from third-party plugins. */
declare const CODEX_APP_SERVER_AUTH_MARKER = "codex-app-server";
/** Marker for Google Vertex credentials resolved outside plain API-key env vars. */
declare const GCP_VERTEX_CREDENTIALS_MARKER = "gcp-vertex-credentials";
/** Marker for a secret-ref-managed credential that is not stored as an env var. */
declare const NON_ENV_SECRETREF_MARKER = "secretref-managed";
/** Prefix for secret-ref header markers that name an env-backed source. */
declare const SECRETREF_ENV_HEADER_MARKER_PREFIX = "secretref-env:";
/** List non-secret auth markers known from core and bundled plugin manifests. */
declare function listKnownNonSecretApiKeyMarkers(): string[];
/** Return true for AWS SDK env marker values that represent ambient auth. */
declare function isAwsSdkAuthMarker(value: string): boolean;
/** Return true for recognized env-var API-key placeholders, excluding AWS SDK markers. */
declare function isKnownEnvApiKeyMarker(value: string): boolean;
/** Build the persisted OAuth marker for one provider id. */
declare function resolveOAuthApiKeyMarker(providerId: string): string;
/** Return true when a marker value points at provider OAuth auth. */
declare function isOAuthApiKeyMarker(value: string): boolean;
/** Resolve the API-key placeholder for a non-env secret-ref source. */
declare function resolveNonEnvSecretRefApiKeyMarker(_source: SecretRefSource): string;
/** Resolve the header-value placeholder for a non-env secret-ref source. */
declare function resolveNonEnvSecretRefHeaderValueMarker(_source: SecretRefSource): string;
/** Resolve the header-value placeholder for an env-backed secret-ref source. */
declare function resolveEnvSecretRefHeaderValueMarker(envVarName: string): string;
/** Return true for secret-ref placeholders used in auth header values. */
declare function isSecretRefHeaderValueMarker(value: string): boolean;
/** Return true for persisted non-secret placeholders that should not be treated as real keys. */
declare function isNonSecretApiKeyMarker(
  value: string,
  opts?: {
    includeEnvVarName?: boolean;
  },
): boolean;
//#endregion
export {
  resolveNonEnvSecretRefHeaderValueMarker as _,
  NON_ENV_SECRETREF_MARKER as a,
  SECRETREF_ENV_HEADER_MARKER_PREFIX as c,
  isNonSecretApiKeyMarker as d,
  isOAuthApiKeyMarker as f,
  resolveNonEnvSecretRefApiKeyMarker as g,
  resolveEnvSecretRefHeaderValueMarker as h,
  MINIMAX_OAUTH_MARKER as i,
  isAwsSdkAuthMarker as l,
  listKnownNonSecretApiKeyMarkers as m,
  CUSTOM_LOCAL_AUTH_MARKER as n,
  OAUTH_API_KEY_MARKER_PREFIX as o,
  isSecretRefHeaderValueMarker as p,
  GCP_VERTEX_CREDENTIALS_MARKER as r,
  OLLAMA_LOCAL_AUTH_MARKER as s,
  CODEX_APP_SERVER_AUTH_MARKER as t,
  isKnownEnvApiKeyMarker as u,
  resolveOAuthApiKeyMarker as v,
};
