import { t as JsonSchemaObject } from "./json-schema.types-z_ZXZBRr.js";

//#region src/channels/plugins/types.config.d.ts
/** Optional UI metadata for a JSON Schema property. */
type ChannelConfigUiHint = {
  label?: string;
  help?: string;
  tags?: string[];
  advanced?: boolean;
  sensitive?: boolean;
  placeholder?: string;
  itemTemplate?: unknown;
};
/** Normalized validation issue emitted by a channel runtime parser. */
type ChannelConfigRuntimeIssue = {
  path?: Array<string | number>;
  message?: string;
  code?: string;
} & Record<string, unknown>;
/** Minimal safeParse result shape accepted from channel-owned validators. */
type ChannelConfigRuntimeParseResult =
  | {
      success: true;
      data: unknown;
    }
  | {
      success: false;
      issues: ChannelConfigRuntimeIssue[];
    };
/** Runtime validator contract paired with the JSON Schema config surface. */
type ChannelConfigRuntimeSchema = {
  safeParse: (value: unknown) => ChannelConfigRuntimeParseResult;
};
/** Complete channel config schema description exposed to host tooling. */
type ChannelConfigSchema = {
  schema: JsonSchemaObject;
  uiHints?: Record<string, ChannelConfigUiHint>;
  runtime?: ChannelConfigRuntimeSchema;
};
//#endregion
export { ChannelConfigSchema as n, ChannelConfigUiHint as r, ChannelConfigRuntimeSchema as t };
