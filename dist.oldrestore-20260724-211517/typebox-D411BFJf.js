import "./channel-target-Bp_kJEK2.js";
import { Type } from "typebox";
//#region src/agents/schema/string-enum.ts
/**
 * Provider-safe TypeBox string enum helpers.
 *
 * Emits flat `enum` schemas instead of `anyOf` unions so provider tool-schema validators accept them.
 */
function stringEnum(values, options = {}) {
  const enumValues = Array.isArray(values)
    ? values
    : values && typeof values === "object"
      ? Object.values(values).filter((value) => typeof value === "string")
      : [];
  return Type.Unsafe({
    type: "string",
    ...(enumValues.length > 0 ? { enum: [...enumValues] } : {}),
    ...options,
  });
}
function optionalStringEnum(values, options = {}) {
  return Type.Optional(stringEnum(values, options));
}
//#endregion
//#region src/agents/schema/typebox.ts
/**
 * Shared TypeBox schema helpers for agent tools.
 *
 * Tool definitions use these helpers for channel targets and common optional
 * numeric fields so provider-facing schemas stay consistent.
 */
/** Builds a schema for one outbound channel target. */
function channelTargetSchema(options) {
  return Type.String({
    description:
      options?.description ??
      "Recipient/channel: E.164 for WhatsApp/Signal, Telegram chat id/@username, Discord/Slack/Mattermost <channelId|user:ID|channel:ID>, or iMessage handle/chat_id",
  });
}
/** Builds a schema for multiple outbound channel targets. */
function channelTargetsSchema(options) {
  return Type.Array(
    channelTargetSchema({
      description:
        options?.description ??
        "Recipient/channel targets (same format as --target); accepts ids or names when the directory is available.",
    }),
  );
}
/** Builds an optional finite number schema with caller-provided metadata. */
function optionalFiniteNumberSchema(options = {}) {
  return Type.Optional(Type.Number(options));
}
/** Builds an optional positive integer schema. */
function optionalPositiveIntegerSchema(options = {}) {
  return Type.Optional(
    Type.Integer({
      minimum: 1,
      ...options,
    }),
  );
}
/** Builds an optional non-negative integer schema. */
function optionalNonNegativeIntegerSchema(options = {}) {
  return Type.Optional(
    Type.Integer({
      minimum: 0,
      ...options,
    }),
  );
}
//#endregion
export {
  optionalPositiveIntegerSchema as a,
  optionalNonNegativeIntegerSchema as i,
  channelTargetsSchema as n,
  optionalStringEnum as o,
  optionalFiniteNumberSchema as r,
  stringEnum as s,
  channelTargetSchema as t,
};
