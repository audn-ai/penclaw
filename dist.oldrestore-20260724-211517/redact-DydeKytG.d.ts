import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/logging/redact.d.ts
type RedactSensitiveMode = "off" | "tools";
type RedactPattern = string | RegExp;
type LoggingConfig = OpenClawConfig["logging"];
type RedactOptions = {
  mode?: RedactSensitiveMode;
  patterns?: RedactPattern[];
};
type ResolvedRedactOptions = {
  mode: RedactSensitiveMode;
  patterns: RegExp[];
  redactFormBodies: boolean;
};
declare function computeSensitiveRedactionBitmap(
  text: string,
  resolved: ResolvedRedactOptions,
): boolean[];
declare function resolveRedactOptions(options?: RedactOptions): ResolvedRedactOptions;
declare function redactSensitiveText(text: string, options?: RedactOptions): string;
declare function redactToolDetail(detail: string): string;
declare function redactToolPayloadText(text: string): string;
declare function redactToolPayloadTextWithConfig(
  text: string,
  loggingConfig?: LoggingConfig,
): string;
declare function isSensitiveFieldKey(key: string): boolean;
declare function redactSensitiveFieldValue(
  key: string,
  value: string,
  options?: RedactOptions,
): string;
declare function redactSensitiveFieldValueWithConfig(
  key: string,
  value: string,
  loggingConfig?: LoggingConfig,
): string;
declare function redactSecrets<T>(value: T): T;
declare function getDefaultRedactPatterns(): string[];
declare function redactSensitiveLines(lines: string[], resolved: ResolvedRedactOptions): string[];
//#endregion
export {
  computeSensitiveRedactionBitmap as a,
  redactSecrets as c,
  redactSensitiveLines as d,
  redactSensitiveText as f,
  resolveRedactOptions as g,
  redactToolPayloadTextWithConfig as h,
  ResolvedRedactOptions as i,
  redactSensitiveFieldValue as l,
  redactToolPayloadText as m,
  RedactPattern as n,
  getDefaultRedactPatterns as o,
  redactToolDetail as p,
  RedactSensitiveMode as r,
  isSensitiveFieldKey as s,
  RedactOptions as t,
  redactSensitiveFieldValueWithConfig as u,
};
