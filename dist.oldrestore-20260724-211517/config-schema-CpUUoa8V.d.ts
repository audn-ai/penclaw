import { i as ZodRawShape } from "./compat-Cv0f0P7B.js";
import { t as JsonSchemaObject } from "./json-schema.types-z_ZXZBRr.js";
import {
  C as ZodEnum,
  Q as ZodOptional,
  Y as ZodNumber,
  Z as ZodObject,
  bt as ZodUnion,
  c as ZodBoolean,
  mt as ZodType,
  r as ZodArray,
  ra as $strip,
  st as ZodString,
} from "./schemas-CkRCGSfd.js";
import { n as ChannelConfigSchema, r as ChannelConfigUiHint } from "./types.config-D1pSqbn8.js";

//#region src/channels/plugins/config-schema.d.ts
type ExtendableZodObject = ZodType & {
  extend: (shape: Record<string, ZodType>) => ZodType;
};
/** Optional allowlist array used by channel config schema builders. */
declare const AllowFromListSchema: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
/** Build the common nested DM config block used by channel account schemas. */
declare function buildNestedDmConfigSchema(extraShape?: ZodRawShape): ZodOptional<
  ZodObject<
    {
      enabled: ZodOptional<ZodBoolean>;
      policy: ZodOptional<
        ZodEnum<{
          disabled: "disabled";
          allowlist: "allowlist";
          pairing: "pairing";
          open: "open";
        }>
      >;
      allowFrom: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
    },
    $strip
  >
>;
/** Add `accounts` catchall and `defaultAccount` fields to a channel account schema. */
declare function buildCatchallMultiAccountChannelSchema<T extends ExtendableZodObject>(
  accountSchema: T,
): T;
type BuildChannelConfigSchemaOptions = {
  uiHints?: Record<
    string,
    ChannelConfigUiHint
  > /** Select input mode when transforms must expose accepted config values to editors. */;
  jsonSchemaMode?: "input" | "output";
};
type BuildJsonChannelConfigSchemaOptions = {
  cacheKey?: string;
  uiHints?: Record<string, ChannelConfigUiHint>;
  runtime?: ChannelConfigSchema["runtime"];
};
/** Build a channel config schema from JSON Schema with runtime validation/default support. */
declare function buildJsonChannelConfigSchema(
  schema: JsonSchemaObject,
  options?: BuildJsonChannelConfigSchemaOptions,
): ChannelConfigSchema;
/** Build a channel config schema from Zod, exporting JSON Schema when available. */
declare function buildChannelConfigSchema(
  schema: ZodType,
  options?: BuildChannelConfigSchemaOptions,
): ChannelConfigSchema;
/** Return a channel config schema for channels that intentionally accept no config keys. */
declare function emptyChannelConfigSchema(): ChannelConfigSchema;
//#endregion
export {
  buildNestedDmConfigSchema as a,
  buildJsonChannelConfigSchema as i,
  buildCatchallMultiAccountChannelSchema as n,
  emptyChannelConfigSchema as o,
  buildChannelConfigSchema as r,
  AllowFromListSchema as t,
};
