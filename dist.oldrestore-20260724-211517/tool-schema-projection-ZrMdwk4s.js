import {
  projectRuntimeToolInputSchema,
  projectRuntimeToolInputSchema as projectRuntimeToolInputSchema$1,
} from "@openclaw/ai/internal/openai";
//#region src/agents/tool-schema-projection.ts
function unreadableRuntimeToolEntry(toolIndex) {
  return {
    ok: false,
    diagnostic: {
      toolName: `tool[${toolIndex}]`,
      toolIndex,
      violations: [`tool[${toolIndex}] is unreadable`],
    },
  };
}
function readRuntimeToolEntries(tools) {
  let length;
  try {
    length = tools.length;
  } catch {
    return [unreadableRuntimeToolEntry(0)];
  }
  const entries = [];
  for (let toolIndex = 0; toolIndex < length; toolIndex += 1)
    try {
      const tool = tools.at(toolIndex);
      entries.push(
        tool === void 0
          ? unreadableRuntimeToolEntry(toolIndex)
          : {
              ok: true,
              tool,
              toolIndex,
            },
      );
    } catch {
      entries.push(unreadableRuntimeToolEntry(toolIndex));
    }
  return entries;
}
function readToolProjectionField(tool, field) {
  try {
    return {
      readable: true,
      value: tool[field],
    };
  } catch {
    return { readable: false };
  }
}
function inspectToolSchema(tool, toolIndex, mode) {
  const nameRead = readToolProjectionField(tool, "name");
  const toolName =
    nameRead.readable && typeof nameRead.value === "string" && nameRead.value
      ? nameRead.value
      : `tool[${toolIndex}]`;
  const descriptorViolations = nameRead.readable ? [] : [`${toolName}.name is unreadable`];
  const parametersRead = readToolProjectionField(tool, "parameters");
  if (!parametersRead.readable)
    return {
      toolName,
      toolIndex,
      violations: [...descriptorViolations, `${toolName}.parameters is unreadable`],
    };
  if (mode === "provider-normalizable" && parametersRead.value === void 0)
    return descriptorViolations.length > 0
      ? {
          toolName,
          toolIndex,
          violations: descriptorViolations,
        }
      : void 0;
  const schemaPath = `${toolName}.parameters`;
  const projection = projectRuntimeToolInputSchema(parametersRead.value, schemaPath);
  const projectionViolations =
    mode === "runtime"
      ? projection.violations
      : projection.violations.filter(
          (violation) =>
            violation !== `${schemaPath}.$dynamicRef` &&
            violation !== `${schemaPath}.$dynamicAnchor` &&
            !violation.endsWith(".$dynamicRef") &&
            !violation.endsWith(".$dynamicAnchor"),
        );
  const violations = [...descriptorViolations, ...projectionViolations];
  return violations.length > 0
    ? {
        toolName,
        toolIndex,
        violations,
      }
    : void 0;
}
function inspectToolEntries(entries, mode) {
  const diagnostics = [];
  const compatibleTools = [];
  for (const entry of entries) {
    if (!entry.ok) {
      diagnostics.push(entry.diagnostic);
      continue;
    }
    const diagnostic = inspectToolSchema(entry.tool, entry.toolIndex, mode);
    if (diagnostic) {
      diagnostics.push(diagnostic);
      continue;
    }
    compatibleTools.push(entry.tool);
  }
  return {
    tools: compatibleTools,
    diagnostics,
  };
}
/** Inspects runtime tool schemas and returns diagnostics without filtering tools. */
function inspectRuntimeToolInputSchemas(tools) {
  return [...inspectToolEntries(readRuntimeToolEntries(tools), "runtime").diagnostics];
}
/** Filters tools to those with schemas accepted by the runtime as-is. */
function filterRuntimeCompatibleTools(tools) {
  return inspectToolEntries(readRuntimeToolEntries(tools), "runtime");
}
/** Filters tools to those that providers can normalize before dispatch. */
function filterProviderNormalizableTools(tools) {
  return inspectToolEntries(readRuntimeToolEntries(tools), "provider-normalizable");
}
//#endregion
export {
  projectRuntimeToolInputSchema$1 as i,
  filterRuntimeCompatibleTools as n,
  inspectRuntimeToolInputSchemas as r,
  filterProviderNormalizableTools as t,
};
