import { Type } from "typebox";
import "./channel-actions-C9vNf9jw.js";
import {
  a as optionalPositiveIntegerSchema,
  i as optionalNonNegativeIntegerSchema,
  r as optionalFiniteNumberSchema,
  s as stringEnum,
} from "./typebox-D411BFJf.js";
//#region extensions/canvas/src/tool-schema.ts
/**
 * Agent-facing Canvas tool schema and allowed action/format enums.
 */
/** Agent tool actions supported by the Canvas plugin. */
const CANVAS_ACTIONS = [
  "present",
  "hide",
  "navigate",
  "eval",
  "snapshot",
  "a2ui_push",
  "a2ui_reset",
];
/** Snapshot formats accepted by the Canvas tool. */
const CANVAS_SNAPSHOT_FORMATS = ["png", "jpg", "jpeg"];
/** Gateway capability required for inline transcript widgets. */
const SHOW_WIDGET_REQUIRED_CLIENT_CAPS = ["inline-widgets"];
/** TypeBox schema for inline web chat widgets. */
const ShowWidgetToolSchema = Type.Object({
  title: Type.String(),
  widget_code: Type.String(),
});
/** TypeBox schema for the model-facing Canvas tool arguments. */
const CanvasToolSchema = Type.Object({
  action: stringEnum(CANVAS_ACTIONS),
  gatewayUrl: Type.Optional(Type.String()),
  gatewayToken: Type.Optional(Type.String()),
  timeoutMs: optionalPositiveIntegerSchema(),
  node: Type.Optional(Type.String()),
  target: Type.Optional(Type.String()),
  x: optionalFiniteNumberSchema(),
  y: optionalFiniteNumberSchema(),
  width: optionalFiniteNumberSchema(),
  height: optionalFiniteNumberSchema(),
  url: Type.Optional(Type.String()),
  javaScript: Type.Optional(Type.String()),
  outputFormat: Type.Optional(stringEnum(CANVAS_SNAPSHOT_FORMATS)),
  maxWidth: optionalPositiveIntegerSchema(),
  quality: optionalFiniteNumberSchema({
    minimum: 0,
    maximum: 1,
  }),
  delayMs: optionalNonNegativeIntegerSchema(),
  jsonl: Type.Optional(Type.String()),
  jsonlPath: Type.Optional(Type.String()),
});
//#endregion
export { SHOW_WIDGET_REQUIRED_CLIENT_CAPS as n, ShowWidgetToolSchema as r, CanvasToolSchema as t };
