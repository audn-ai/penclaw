import { t as parseConfigPathArrayIndex } from "./path-array-index-CvEcUJa-.js";
import { t as validateJsonSchemaValue } from "./schema-validator-BAYKPBuJ.js";
import {
  At as boolean,
  Et as array,
  Rn as string,
  Tn as object,
  Xn as union,
  wn as number,
} from "./schemas-CBJjibl3.js";
import { c as DmPolicySchema } from "./zod-schema.core-CWTCY1ZZ.js";
/** Optional allowlist array used by channel config schema builders. */
const AllowFromListSchema = array(union([string(), number()])).optional();
/** Build the common nested DM config block used by channel account schemas. */
function buildNestedDmConfigSchema(extraShape) {
  const baseShape = {
    enabled: boolean().optional(),
    policy: DmPolicySchema.optional(),
    allowFrom: AllowFromListSchema,
  };
  return object(
    extraShape
      ? {
          ...baseShape,
          ...extraShape,
        }
      : baseShape,
  ).optional();
}
/** Add `accounts` catchall and `defaultAccount` fields to a channel account schema. */
function buildCatchallMultiAccountChannelSchema(accountSchema) {
  return accountSchema.extend({
    accounts: object({}).catchall(accountSchema).optional(),
    defaultAccount: string().optional(),
  });
}
function cloneRuntimeIssue(issue) {
  const record = issue && typeof issue === "object" ? issue : {};
  const path = Array.isArray(record.path)
    ? record.path.filter((segment) => {
        const kind = typeof segment;
        return kind === "string" || kind === "number";
      })
    : void 0;
  return {
    ...record,
    ...(path ? { path } : {}),
  };
}
function safeParseRuntimeSchema(schema, value) {
  const result = schema.safeParse(value);
  if (result.success)
    return {
      success: true,
      data: result.data,
    };
  return {
    success: false,
    issues: result.error.issues.map((issue) => cloneRuntimeIssue(issue)),
  };
}
function toIssuePath(path) {
  if (!path || path === "<root>") return [];
  return path.split(".").map((segment) => {
    return parseConfigPathArrayIndex(segment) ?? segment;
  });
}
function safeParseJsonSchema(schema, cacheKey, value) {
  const result = validateJsonSchemaValue({
    schema,
    cacheKey,
    value,
    applyDefaults: true,
  });
  if (result.ok)
    return {
      success: true,
      data: result.value,
    };
  return {
    success: false,
    issues: result.errors.map((issue) => ({
      path: toIssuePath(issue.path),
      message: issue.message,
    })),
  };
}
/** Build a channel config schema from JSON Schema with runtime validation/default support. */
function buildJsonChannelConfigSchema(schema, options) {
  return {
    schema,
    ...(options?.uiHints ? { uiHints: options.uiHints } : {}),
    runtime: options?.runtime ?? {
      safeParse: (value) =>
        safeParseJsonSchema(schema, options?.cacheKey ?? "channel-config-schema:json", value),
    },
  };
}
/** Build a channel config schema from Zod, exporting JSON Schema when available. */
function buildChannelConfigSchema(schema, options) {
  const schemaWithJson = schema;
  if (typeof schemaWithJson.toJSONSchema === "function")
    return {
      schema: schemaWithJson.toJSONSchema({
        target: "draft-07",
        ...(options?.jsonSchemaMode ? { io: options.jsonSchemaMode } : {}),
        unrepresentable: "any",
      }),
      ...(options?.uiHints ? { uiHints: options.uiHints } : {}),
      runtime: { safeParse: (value) => safeParseRuntimeSchema(schema, value) },
    };
  return {
    schema: {
      type: "object",
      additionalProperties: true,
    },
    ...(options?.uiHints ? { uiHints: options.uiHints } : {}),
    runtime: { safeParse: (value) => safeParseRuntimeSchema(schema, value) },
  };
}
/** Return a channel config schema for channels that intentionally accept no config keys. */
function emptyChannelConfigSchema() {
  return {
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {},
    },
    runtime: {
      safeParse(value) {
        if (value === void 0)
          return {
            success: true,
            data: void 0,
          };
        if (!value || typeof value !== "object" || Array.isArray(value))
          return {
            success: false,
            issues: [
              {
                path: [],
                message: "expected config object",
              },
            ],
          };
        if (Object.keys(value).length > 0)
          return {
            success: false,
            issues: [
              {
                path: [],
                message: "config must be empty",
              },
            ],
          };
        return {
          success: true,
          data: value,
        };
      },
    },
  };
}
//#endregion
export {
  buildNestedDmConfigSchema as a,
  buildJsonChannelConfigSchema as i,
  buildCatchallMultiAccountChannelSchema as n,
  emptyChannelConfigSchema as o,
  buildChannelConfigSchema as r,
  AllowFromListSchema as t,
};
