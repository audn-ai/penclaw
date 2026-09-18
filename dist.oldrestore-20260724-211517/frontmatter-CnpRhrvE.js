import YAML from "yaml";
//#region packages/markdown-core/src/frontmatter.ts
function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  )
    return value.slice(1, -1);
  return value;
}
function coerceYamlFrontmatterValue(value) {
  if (value === null || value === void 0) return;
  if (typeof value === "string")
    return {
      value: value.trim(),
      kind: "scalar",
    };
  if (typeof value === "number" || typeof value === "boolean")
    return {
      value: String(value),
      kind: "scalar",
    };
  if (typeof value === "object")
    try {
      return {
        value: JSON.stringify(value),
        kind: "structured",
      };
    } catch {
      return;
    }
}
function parseYamlFrontmatter(block) {
  try {
    const parsed = YAML.parse(block, { schema: "core" });
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const result = {};
    for (const [rawKey, value] of Object.entries(parsed)) {
      const key = rawKey.trim();
      if (!key) continue;
      const coerced = coerceYamlFrontmatterValue(value);
      if (!coerced) continue;
      result[key] = coerced;
    }
    return result;
  } catch {
    return null;
  }
}
function extractMultiLineValue(lines, startIndex) {
  const valueLines = [];
  let i = startIndex + 1;
  while (i < lines.length) {
    const line = lines.at(i);
    if (line === void 0) break;
    if (line.length > 0 && !line.startsWith(" ") && !line.startsWith("	")) break;
    valueLines.push(line);
    i += 1;
  }
  return {
    value: valueLines.join("\n").trim(),
    linesConsumed: i - startIndex,
  };
}
function parseLineFrontmatter(block) {
  const result = {};
  const lines = block.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines.at(i);
    if (line === void 0) break;
    const match = line.match(/^([\w-]+):\s*(.*)$/);
    if (!match) {
      i += 1;
      continue;
    }
    const [, key, rawInlineValue] = match;
    if (!key || rawInlineValue === void 0) {
      i += 1;
      continue;
    }
    const inlineValue = rawInlineValue.trim();
    if (!inlineValue && i + 1 < lines.length) {
      const nextLine = lines.at(i + 1);
      if (nextLine?.startsWith(" ") || nextLine?.startsWith("	")) {
        const { value, linesConsumed } = extractMultiLineValue(lines, i);
        if (value)
          result[key] = {
            value,
            kind: "multiline",
            rawInline: inlineValue,
          };
        i += linesConsumed;
        continue;
      }
    }
    const value = stripQuotes(inlineValue);
    if (value)
      result[key] = {
        value,
        kind: "inline",
        rawInline: inlineValue,
      };
    i += 1;
  }
  return result;
}
function lineFrontmatterToPlain(parsed) {
  const result = {};
  for (const [key, entry] of Object.entries(parsed)) result[key] = entry.value;
  return result;
}
function isYamlBlockScalarIndicator(value) {
  return /^[|>][+-]?(\d+)?[+-]?$/.test(value);
}
function shouldPreferInlineLineValue(params) {
  const { lineEntry, yamlValue } = params;
  if (yamlValue.kind !== "structured") return false;
  if (lineEntry.kind !== "inline") return false;
  if (isYamlBlockScalarIndicator(lineEntry.rawInline)) return false;
  return lineEntry.value.includes(":");
}
function normalizeFrontmatterContent(content) {
  return content
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");
}
function isFrontmatterDelimiterLine(line) {
  return line.trimEnd() === "---";
}
function extractFrontmatterBlockFromNormalized(normalized) {
  const firstLineEnd = normalized.indexOf("\n");
  if (
    !isFrontmatterDelimiterLine(
      firstLineEnd === -1 ? normalized : normalized.slice(0, firstLineEnd),
    )
  )
    return;
  if (firstLineEnd === -1) return;
  const blockStart = firstLineEnd + 1;
  let lineStart = blockStart;
  while (lineStart <= normalized.length) {
    const lineEnd = normalized.indexOf("\n", lineStart);
    const currentLineEnd = lineEnd === -1 ? normalized.length : lineEnd;
    if (isFrontmatterDelimiterLine(normalized.slice(lineStart, currentLineEnd))) {
      const blockEnd = lineStart > blockStart ? lineStart - 1 : lineStart;
      const bodyStart = lineEnd === -1 ? normalized.length : lineEnd + 1;
      return {
        block: normalized.slice(blockStart, blockEnd),
        body: normalized.slice(bodyStart),
      };
    }
    if (lineEnd === -1) break;
    lineStart = lineEnd + 1;
  }
}
/** Splits a complete leading YAML frontmatter block from its Markdown body. */
function extractFrontmatterBlock(content) {
  return extractFrontmatterBlockFromNormalized(normalizeFrontmatterContent(content));
}
/** Removes a leading YAML frontmatter block and returns the remaining Markdown body. */
function stripFrontmatterBlock(content) {
  const normalized = normalizeFrontmatterContent(content);
  return (extractFrontmatterBlockFromNormalized(normalized)?.body ?? normalized).trim();
}
/** Parses leading YAML frontmatter into string values used by skill and metadata loaders. */
function parseFrontmatterBlock(content) {
  const block = extractFrontmatterBlock(content)?.block;
  if (!block) return {};
  const lineParsed = parseLineFrontmatter(block);
  const yamlParsed = parseYamlFrontmatter(block);
  if (yamlParsed === null) return lineFrontmatterToPlain(lineParsed);
  const merged = {};
  for (const [key, yamlValue] of Object.entries(yamlParsed)) {
    merged[key] = yamlValue.value;
    const lineEntry = lineParsed[key];
    if (!lineEntry) continue;
    if (
      shouldPreferInlineLineValue({
        lineEntry,
        yamlValue,
      })
    )
      merged[key] = lineEntry.value;
  }
  for (const [key, lineEntry] of Object.entries(lineParsed))
    if (!Object.hasOwn(merged, key)) merged[key] = lineEntry.value;
  return merged;
}
//#endregion
export { parseFrontmatterBlock as n, stripFrontmatterBlock as r, extractFrontmatterBlock as t };
