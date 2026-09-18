import { Compile } from "typebox/compile";
import { Value } from "typebox/value";
//#region packages/llm-core/src/utils/event-stream.ts
/** Generic async-iterable event stream with a separately awaited final result. */
var EventStream = class {
  constructor(isComplete, extractResult) {
    this.queue = [];
    this.waiting = [];
    this.done = false;
    this.isComplete = isComplete;
    this.extractResult = extractResult;
    const resolvers = [];
    this.finalResultPromise = new Promise((resolve) => {
      resolvers.push(resolve);
    });
    const resolveFinalResult = resolvers.at(0);
    if (!resolveFinalResult)
      throw new Error("event stream result promise did not initialize its resolver");
    this.resolveFinalResult = resolveFinalResult;
  }
  push(event) {
    if (this.done) return;
    if (this.isComplete(event)) {
      this.done = true;
      this.resolveFinalResult(this.extractResult(event));
    }
    const waiter = this.waiting.shift();
    if (waiter)
      waiter({
        value: event,
        done: false,
      });
    else this.queue.push(event);
  }
  end(result) {
    this.done = true;
    if (result !== void 0) this.resolveFinalResult(result);
    while (this.waiting.length > 0) {
      const waiter = this.waiting.shift();
      if (!waiter) break;
      waiter({
        value: void 0,
        done: true,
      });
    }
  }
  async *[Symbol.asyncIterator]() {
    while (true)
      if (this.queue.length > 0) for (const event of this.queue.splice(0, 1)) yield event;
      else if (this.done) return;
      else {
        const result = await new Promise((resolve) => {
          this.waiting.push(resolve);
        });
        if (result.done) return;
        yield result.value;
      }
  }
  result() {
    return this.finalResultPromise;
  }
};
/** Assistant-message event stream that resolves on done/error terminal events. */
var AssistantMessageEventStream = class extends EventStream {
  constructor() {
    super(
      (event) => event.type === "done" || event.type === "error",
      (event) => {
        if (event.type === "done") return event.message;
        else if (event.type === "error") return event.error;
        throw new Error("Unexpected event type for final result");
      },
    );
  }
};
/** Creates an assistant-message stream for provider and plugin adapters. */
function createAssistantMessageEventStream() {
  return new AssistantMessageEventStream();
}
//#endregion
//#region packages/llm-core/src/validation.ts
const validatorCache = /* @__PURE__ */ new WeakMap();
const TYPEBOX_KIND = Symbol.for("TypeBox.Kind");
/** Maximum string length accepted for schema-gated JSON coercion. */
const MAX_JSON_COERCE_LENGTH = 64 * 1024;
function isRecord(value) {
  return typeof value === "object" && value !== null;
}
function isJsonSchemaObject(value) {
  return isRecord(value);
}
function hasTypeBoxMetadata(schema) {
  return isRecord(schema) && Object.getOwnPropertySymbols(schema).includes(TYPEBOX_KIND);
}
function getSchemaTypes(schema) {
  if (typeof schema.type === "string") return [schema.type];
  if (Array.isArray(schema.type)) return schema.type.filter((type) => typeof type === "string");
  return [];
}
function matchesJsonType(value, type) {
  switch (type) {
    case "number":
      return typeof value === "number";
    case "integer":
      return typeof value === "number" && Number.isInteger(value);
    case "boolean":
      return typeof value === "boolean";
    case "string":
      return typeof value === "string";
    case "null":
      return value === null;
    case "array":
      return Array.isArray(value);
    case "object":
      return isRecord(value) && !Array.isArray(value);
    default:
      return false;
  }
}
function isValidatorSchema(value) {
  return isRecord(value);
}
const JSON_NUMBER_TOKEN_RE = /^[+-]?(?:(?:\d+\.?\d*)|(?:\.\d+))(?:e[+-]?\d+)?$/iu;
function parseJsonNumberString(value) {
  const trimmed = value.trim();
  if (!trimmed || !JSON_NUMBER_TOKEN_RE.test(trimmed)) return;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : void 0;
}
function parseJsonIntegerString(value) {
  const parsed = parseJsonNumberString(value);
  return parsed !== void 0 && Number.isSafeInteger(parsed) ? parsed : void 0;
}
function getSubSchemaValidator(schema) {
  if (!isValidatorSchema(schema)) return;
  try {
    return getValidator(schema);
  } catch {
    return;
  }
}
function coercePrimitiveByType(value, type) {
  switch (type) {
    case "number":
      if (value === null) return 0;
      if (typeof value === "string" && value.trim() !== "") {
        const parsed = parseJsonNumberString(value);
        if (parsed !== void 0) return parsed;
      }
      if (typeof value === "boolean") return value ? 1 : 0;
      return value;
    case "integer":
      if (value === null) return 0;
      if (typeof value === "string" && value.trim() !== "") {
        const parsed = parseJsonIntegerString(value);
        if (parsed !== void 0) return parsed;
      }
      if (typeof value === "boolean") return value ? 1 : 0;
      return value;
    case "boolean":
      if (value === null) return false;
      if (typeof value === "string") {
        if (value === "true") return true;
        if (value === "false") return false;
      }
      if (typeof value === "number") {
        if (value === 1) return true;
        if (value === 0) return false;
      }
      return value;
    case "string":
      if (value === null) return "";
      if (typeof value === "number" || typeof value === "boolean") return String(value);
      return value;
    case "array":
      if (
        typeof value === "string" &&
        value.trim() !== "" &&
        value.length <= MAX_JSON_COERCE_LENGTH
      )
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) return parsed;
        } catch {}
      return value;
    case "object":
      if (
        typeof value === "string" &&
        value.trim() !== "" &&
        value.length <= MAX_JSON_COERCE_LENGTH
      )
        try {
          const parsed = JSON.parse(value);
          if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed))
            return parsed;
        } catch {}
      return value;
    case "null":
      if (value === "" || value === 0 || value === false) return null;
      return value;
    default:
      return value;
  }
}
function applySchemaObjectCoercion(value, schema) {
  const properties = schema.properties;
  const definedKeys = new Set(properties ? Object.keys(properties) : []);
  if (properties) {
    for (const [key, propertySchema] of Object.entries(properties))
      if (key in value) value[key] = coerceWithJsonSchema(value[key], propertySchema);
  }
  if (schema.additionalProperties && isJsonSchemaObject(schema.additionalProperties)) {
    for (const [key, propertyValue] of Object.entries(value))
      if (!definedKeys.has(key))
        value[key] = coerceWithJsonSchema(propertyValue, schema.additionalProperties);
  }
}
function applySchemaArrayCoercion(value, schema) {
  if (Array.isArray(schema.items)) {
    for (let index = 0; index < value.length; index++) {
      const itemSchema = schema.items[index];
      if (itemSchema) value[index] = coerceWithJsonSchema(value[index], itemSchema);
    }
    return;
  }
  if (isJsonSchemaObject(schema.items))
    for (let index = 0; index < value.length; index++)
      value[index] = coerceWithJsonSchema(value[index], schema.items);
}
function coerceWithUnionSchema(value, schemas) {
  if (value === null) {
    for (const schema of schemas)
      if (getSchemaTypes(schema).includes("null")) {
        const validator = getSubSchemaValidator(schema);
        if (!validator || validator.Check(value)) return value;
      }
  }
  for (const schema of schemas) {
    const coerced = coerceWithJsonSchema(structuredClone(value), schema);
    if (getSubSchemaValidator(schema)?.Check(coerced)) return coerced;
  }
  return value;
}
function coerceWithJsonSchema(value, schema) {
  let nextValue = value;
  if (Array.isArray(schema.allOf))
    for (const nested of schema.allOf) nextValue = coerceWithJsonSchema(nextValue, nested);
  if (Array.isArray(schema.anyOf)) nextValue = coerceWithUnionSchema(nextValue, schema.anyOf);
  if (Array.isArray(schema.oneOf)) nextValue = coerceWithUnionSchema(nextValue, schema.oneOf);
  const schemaTypes = getSchemaTypes(schema);
  const matchesUnionMember =
    schemaTypes.length > 1 &&
    schemaTypes.some((schemaType) => matchesJsonType(nextValue, schemaType));
  if (schemaTypes.length > 0 && !matchesUnionMember)
    for (const schemaType of schemaTypes) {
      const candidate = coercePrimitiveByType(nextValue, schemaType);
      if (candidate !== nextValue) {
        nextValue = candidate;
        break;
      }
    }
  if (schemaTypes.includes("object") && isRecord(nextValue) && !Array.isArray(nextValue))
    applySchemaObjectCoercion(nextValue, schema);
  if (schemaTypes.includes("array") && Array.isArray(nextValue))
    applySchemaArrayCoercion(nextValue, schema);
  return nextValue;
}
function getValidator(schema) {
  const key = schema;
  const cached = validatorCache.get(key);
  if (cached) return cached;
  const validator = Compile(schema);
  validatorCache.set(key, validator);
  return validator;
}
function formatValidationPath(error) {
  if (error.keyword === "required") {
    const requiredProperty = error.params.requiredProperties?.[0];
    if (requiredProperty) {
      const basePath = error.instancePath.replace(/^\//, "").replace(/\//g, ".");
      return basePath ? `${basePath}.${requiredProperty}` : requiredProperty;
    }
  }
  return error.instancePath.replace(/^\//, "").replace(/\//g, ".") || "root";
}
/** Finds the target tool and validates/coerces a model-emitted tool call. */
function validateToolCall(tools, toolCall) {
  const tool = tools.find((t) => t.name === toolCall.name);
  if (!tool) throw new Error(`Tool "${toolCall.name}" not found`);
  return validateToolArguments(tool, toolCall);
}
/** Validates tool arguments against TypeBox or plain JSON-schema parameters. */
function validateToolArguments(tool, toolCall) {
  const args = structuredClone(toolCall.arguments);
  Value.Convert(tool.parameters, args);
  const validator = getValidator(tool.parameters);
  if (!hasTypeBoxMetadata(tool.parameters) && isJsonSchemaObject(tool.parameters)) {
    const coerced = coerceWithJsonSchema(args, tool.parameters);
    if (coerced !== args)
      if (isRecord(args) && isRecord(coerced)) {
        for (const key of Object.keys(args)) delete args[key];
        Object.assign(args, coerced);
      } else return validator.Check(coerced) ? coerced : args;
  }
  if (validator.Check(args)) return args;
  const errors =
    validator
      .Errors(args)
      .map((error) => `  - ${formatValidationPath(error)}: ${error.message}`)
      .join("\n") || "Unknown validation error";
  throw new Error(
    `Validation failed for tool "${toolCall.name}":\n${errors}\n\nReceived arguments:\n${JSON.stringify(toolCall.arguments, null, 2)}`,
  );
}
//#endregion
export {
  createAssistantMessageEventStream as i,
  validateToolCall as n,
  AssistantMessageEventStream as r,
  validateToolArguments as t,
};
