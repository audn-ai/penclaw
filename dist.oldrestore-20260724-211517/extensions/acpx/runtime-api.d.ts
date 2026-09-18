import { t as tryDispatchAcpReplyHook } from "../../acp-runtime-backend-BSWlmULn.js";
import { n as AcpRuntimeError, r as AcpRuntimeErrorCode } from "../../errors-Buu3ylDF.js";
import {
  at as PluginHookReplyDispatchContext,
  ot as PluginHookReplyDispatchEvent,
  st as PluginHookReplyDispatchResult,
} from "../../hook-types-BPL4xByC.js";
import {
  A as OpenClawPluginServiceContext,
  W as PluginLogger,
  g as OpenClawPluginApi,
  k as OpenClawPluginService,
  v as OpenClawPluginConfigSchema,
} from "../../plugin-entry-DPCR66aO.js";
import {
  i as omitEnvKeysCaseInsensitive,
  r as listKnownProviderAuthEnvVarNames,
} from "../../provider-env-vars-D_E_Txif.js";
import {
  a as unregisterAcpRuntimeBackend,
  n as getAcpRuntimeBackend,
  r as registerAcpRuntimeBackend,
} from "../../registry-CpUYxH9H.js";
import {
  a as AcpRuntimeEnsureInput,
  d as AcpRuntimeTurn,
  f as AcpRuntimeTurnAttachment,
  g as AcpSessionUpdateTag,
  h as AcpRuntimeTurnResultError,
  i as AcpRuntimeDoctorReport,
  m as AcpRuntimeTurnResult,
  n as AcpRuntimeCapabilities,
  o as AcpRuntimeEvent,
  p as AcpRuntimeTurnInput,
  s as AcpRuntimeHandle,
  t as AcpRuntime,
  u as AcpRuntimeStatus,
} from "../../types-D85xy4rc.js";
import {
  c as WindowsSpawnResolution,
  d as materializeWindowsSpawnProgram,
  l as applyWindowsSpawnProgramPolicy,
  m as resolveWindowsSpawnProgramCandidate,
  o as WindowsSpawnProgram,
  s as WindowsSpawnProgramCandidate,
} from "../../windows-spawn-BDUvnqY7.js";
export {
  type AcpRuntime,
  type AcpRuntimeCapabilities,
  type AcpRuntimeDoctorReport,
  type AcpRuntimeEnsureInput,
  AcpRuntimeError,
  type AcpRuntimeErrorCode,
  type AcpRuntimeEvent,
  type AcpRuntimeHandle,
  type AcpRuntimeStatus,
  type AcpRuntimeTurn,
  type AcpRuntimeTurnAttachment,
  type AcpRuntimeTurnInput,
  type AcpRuntimeTurnResult,
  type AcpRuntimeTurnResultError,
  type AcpSessionUpdateTag,
  type OpenClawPluginApi,
  type OpenClawPluginConfigSchema,
  type OpenClawPluginService,
  type OpenClawPluginServiceContext,
  type PluginHookReplyDispatchContext,
  type PluginHookReplyDispatchEvent,
  type PluginHookReplyDispatchResult,
  type PluginLogger,
  type WindowsSpawnProgram,
  type WindowsSpawnProgramCandidate,
  type WindowsSpawnResolution,
  applyWindowsSpawnProgramPolicy,
  getAcpRuntimeBackend,
  listKnownProviderAuthEnvVarNames,
  materializeWindowsSpawnProgram,
  omitEnvKeysCaseInsensitive,
  registerAcpRuntimeBackend,
  resolveWindowsSpawnProgramCandidate,
  tryDispatchAcpReplyHook,
  unregisterAcpRuntimeBackend,
};
