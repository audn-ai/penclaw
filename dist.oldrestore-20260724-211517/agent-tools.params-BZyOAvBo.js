//#region src/agents/agent-tools.params.ts
const RETRY_GUIDANCE_SUFFIX = " Supply correct parameters before retrying.";
const XML_ARG_VALUE_SUFFIX_RE = /<\/arg_value>>+$/;
const FILE_TOOL_PATH_PARAM_KEYS = /* @__PURE__ */ new Set(["path"]);
const HALLUCINATED_OFFICE_PATH_EXTENSION_RE = /\.(doc|ppt|xls)(?:odex|codex|xodex|xcodex)$/i;
const OFFICE_EXTENSION_BY_FAMILY = {
  doc: ".docx",
  ppt: ".pptx",
  xls: ".xlsx",
};
function parameterValidationError(message) {
  return /* @__PURE__ */ new Error(`${message}.${RETRY_GUIDANCE_SUFFIX}`);
}
function describeReceivedParamValue(value, allowEmpty = false) {
  if (value === void 0 || value === null) return;
  if (typeof value === "string") {
    if (allowEmpty || value.trim().length > 0) return;
    return "<empty-string>";
  }
  if (Array.isArray(value)) return "<array>";
  return `<${typeof value}>`;
}
function formatReceivedParamHint(record, groups) {
  const allowEmptyKeys = /* @__PURE__ */ new Set();
  for (const group of groups)
    if (group.allowEmpty) for (const key of group.keys) allowEmptyKeys.add(key);
  const received = [];
  for (const key of Object.keys(record)) {
    const detail = describeReceivedParamValue(record[key], allowEmptyKeys.has(key));
    if (record[key] === void 0 || record[key] === null) continue;
    received.push(detail ? `${key}=${detail}` : key);
  }
  return received.length > 0 ? ` (received: ${received.join(", ")})` : "";
}
function isValidEditReplacement(value) {
  if (!value || typeof value !== "object") return false;
  const record = value;
  return (
    typeof record.oldText === "string" &&
    record.oldText.trim().length > 0 &&
    typeof record.newText === "string"
  );
}
function hasValidEditReplacements(record) {
  const edits = record.edits;
  return (
    Array.isArray(edits) &&
    edits.length > 0 &&
    edits.every((entry) => isValidEditReplacement(entry))
  );
}
/** Required parameter groups for file-style tools that need retry guidance. */
const REQUIRED_PARAM_GROUPS = {
  read: [
    {
      keys: ["path"],
      label: "path",
    },
  ],
  write: [
    {
      keys: ["path"],
      label: "path",
    },
    {
      keys: ["content"],
      label: "content",
    },
  ],
  edit: [
    {
      keys: ["path"],
      label: "path",
    },
    {
      keys: ["edits"],
      label: "edits",
      validator: hasValidEditReplacements,
    },
  ],
};
/** Return a record view of model-supplied tool params when possible. */
function getToolParamsRecord(params) {
  return params && typeof params === "object" ? params : void 0;
}
/** Strip extra closing markers sometimes produced in XML arg_value path params. */
function stripMalformedXmlArgValueSuffix(value) {
  return value.includes("</arg_value>") ? value.replace(XML_ARG_VALUE_SUFFIX_RE, "") : value;
}
/** Normalize known model-hallucinated Office/codex path extensions. */
function normalizeHallucinatedOfficePathExtension(value) {
  return value.replace(HALLUCINATED_OFFICE_PATH_EXTENSION_RE, (_match, family) => {
    return OFFICE_EXTENSION_BY_FAMILY[family.toLowerCase()] ?? _match;
  });
}
/** Normalize model-supplied file-tool path params without touching payload text. */
function normalizeFileToolPathParam(value) {
  return normalizeHallucinatedOfficePathExtension(stripMalformedXmlArgValueSuffix(value));
}
/** Strip malformed XML suffixes from selected string fields without mutating input. */
function stripMalformedXmlArgValueSuffixFromKeys(record, keys) {
  let normalized;
  for (const key of keys) {
    const value = record[key];
    if (typeof value !== "string") continue;
    const stripped = stripMalformedXmlArgValueSuffix(value);
    if (stripped !== value) {
      normalized ??= { ...record };
      normalized[key] = stripped;
    }
  }
  return normalized ?? record;
}
/** Normalize selected file-tool path fields without mutating input. */
function normalizeFileToolPathParamsFromKeys(record, keys) {
  let normalized;
  for (const key of keys) {
    const value = record[key];
    if (typeof value !== "string") continue;
    const normalizedValue = normalizeFileToolPathParam(value);
    if (normalizedValue !== value) {
      normalized ??= { ...record };
      normalized[key] = normalizedValue;
    }
  }
  return normalized ?? record;
}
function resolveFileToolPathParamKeys(groups) {
  const keys = /* @__PURE__ */ new Set();
  for (const group of groups ?? [])
    for (const key of group.keys) if (FILE_TOOL_PATH_PARAM_KEYS.has(key)) keys.add(key);
  return [...keys];
}
/** Throw actionable retry guidance when required tool params are missing. */
function assertRequiredParams(record, groups, toolName) {
  if (!record || typeof record !== "object")
    throw parameterValidationError(`Missing parameters for ${toolName}`);
  const missingLabels = [];
  for (const group of groups)
    if (
      !(
        group.validator?.(record) ??
        group.keys.some((key) => {
          if (!(key in record)) return false;
          const value = record[key];
          if (typeof value !== "string") return false;
          if (group.allowEmpty) return true;
          return value.trim().length > 0;
        })
      )
    ) {
      const label = group.label ?? group.keys.join(" or ");
      missingLabels.push(label);
    }
  if (missingLabels.length > 0) {
    const joined = missingLabels.join(", ");
    throw parameterValidationError(
      `Missing required ${missingLabels.length === 1 ? "parameter" : "parameters"}: ${joined}${formatReceivedParamHint(record, groups)}`,
    );
  }
}
/** Wrap a tool execute function with required-parameter validation. */
function wrapToolParamValidation(tool, requiredParamGroups) {
  return {
    ...tool,
    execute: async (toolCallId, params, signal, onUpdate) => {
      const record = getToolParamsRecord(params);
      const pathKeys = resolveFileToolPathParamKeys(requiredParamGroups);
      const normalizedParams =
        record && pathKeys.length > 0
          ? normalizeFileToolPathParamsFromKeys(record, pathKeys)
          : params;
      if (requiredParamGroups?.length)
        assertRequiredParams(getToolParamsRecord(normalizedParams), requiredParamGroups, tool.name);
      return tool.execute(toolCallId, normalizedParams, signal, onUpdate);
    },
  };
}
//#endregion
export {
  normalizeFileToolPathParamsFromKeys as a,
  normalizeFileToolPathParam as i,
  assertRequiredParams as n,
  stripMalformedXmlArgValueSuffixFromKeys as o,
  getToolParamsRecord as r,
  wrapToolParamValidation as s,
  REQUIRED_PARAM_GROUPS as t,
};
