//#region src/config/sessions/transcript-tree.ts
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function readNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0 ? value : void 0;
}
function isCanonicalSessionEntryType(value) {
  switch (value) {
    case "message":
    case "thinking_level_change":
    case "model_change":
    case "compaction":
    case "branch_summary":
    case "custom":
    case "custom_message":
    case "label":
    case "session_info":
      return true;
    default:
      return false;
  }
}
function isCanonicalSessionTranscriptEntry(record) {
  return isRecord(record) && isCanonicalSessionEntryType(record.type);
}
function isSessionTranscriptSideAppendEntry(record) {
  return isCanonicalSessionTranscriptEntry(record) && record.appendMode === "side";
}
function isSessionTranscriptLeafControl(record) {
  return (
    isRecord(record) && record.type === "leaf" && parseSessionTranscriptTreeEntry(record) !== void 0
  );
}
/**
 * Parse one parent-linked transcript row.
 *
 * Leaf rows are navigation controls: they select targetId as the active leaf,
 * and descendants that reference the marker continue through that same target.
 */
function parseSessionTranscriptTreeEntry(record) {
  if (!isRecord(record) || record.type === "session" || !Object.hasOwn(record, "parentId")) return;
  const id = readNonEmptyString(record.id);
  const parentId =
    record.parentId === null ? null : (readNonEmptyString(record.parentId) ?? void 0);
  if (!id || parentId === void 0) return;
  if (record.type === "leaf") {
    const targetId =
      record.targetId === null ? null : (readNonEmptyString(record.targetId) ?? void 0);
    const appendParentId =
      record.appendParentId === void 0
        ? targetId
        : record.appendParentId === null
          ? null
          : (readNonEmptyString(record.appendParentId) ?? void 0);
    const appendMode =
      record.appendMode === void 0 ? void 0 : record.appendMode === "side" ? "side" : null;
    return targetId === void 0 || appendParentId === void 0 || appendMode === null
      ? void 0
      : {
          id,
          parentId: targetId,
          leafId: targetId,
          appendParentId,
          ...(appendMode ? { appendMode } : {}),
        };
  }
  return {
    id,
    parentId,
    leafId: isCanonicalSessionTranscriptEntry(record) && record.appendMode !== "side" ? id : void 0,
    appendParentId: id,
    ...(record.appendMode === "side" ? { appendMode: record.appendMode } : {}),
  };
}
function parseParentlessCanonicalEntry(record, parentId) {
  if (!isCanonicalSessionTranscriptEntry(record) || Object.hasOwn(record, "parentId")) return;
  const id = readNonEmptyString(record.id);
  return id
    ? {
        id,
        parentId,
        leafId: record.appendMode === "side" ? void 0 : id,
        appendParentId: id,
        ...(record.appendMode === "side" ? { appendMode: record.appendMode } : {}),
      }
    : void 0;
}
function resolveCanonicalParentId(parentId, byId) {
  const seen = /* @__PURE__ */ new Set();
  let currentId = parentId;
  while (currentId !== null) {
    if (seen.has(currentId)) return currentId;
    seen.add(currentId);
    const parent = byId.get(currentId);
    if (!parent || !isSessionTranscriptLeafControl(parent.entry)) return currentId;
    currentId = parent.parentId;
  }
  return null;
}
/**
 * Resolve transcript navigation state in file order.
 *
 * Current-version transcripts can contain parentless canonical rows written by
 * older appenders. Treat those rows as a linear continuation of the current
 * append cursor so a later leaf control can still address their full history.
 */
function scanSessionTranscriptTree(entries) {
  const nodes = [];
  const byId = /* @__PURE__ */ new Map();
  let leafId = null;
  let appendParentId = null;
  let hasLeafControl = false;
  let hasLeafUpdate = false;
  let hasExplicitLeafUpdate = false;
  let hasInvalidLeafControl = false;
  const invalidLeafControlIds = /* @__PURE__ */ new Set();
  for (const [index, entry] of entries.entries()) {
    const explicitTreeEntry = parseSessionTranscriptTreeEntry(entry);
    const isKnownLeafReference = (id) =>
      id === null || (byId.has(id) && !invalidLeafControlIds.has(id));
    if (
      explicitTreeEntry?.leafId !== void 0 &&
      isSessionTranscriptLeafControl(entry) &&
      (!isKnownLeafReference(explicitTreeEntry.leafId) ||
        !isKnownLeafReference(explicitTreeEntry.appendParentId))
    ) {
      hasInvalidLeafControl = true;
      invalidLeafControlIds.add(explicitTreeEntry.id);
      const rawParentId = entry.parentId;
      const node = {
        ...explicitTreeEntry,
        parentId: rawParentId,
        leafId: void 0,
        appendParentId,
        entry,
        index,
      };
      nodes.push(node);
      byId.set(node.id, node);
      continue;
    }
    let treeEntry = explicitTreeEntry ?? parseParentlessCanonicalEntry(entry, leafId);
    if (treeEntry && isCanonicalSessionTranscriptEntry(entry)) {
      const canonicalParentIsStale =
        explicitTreeEntry &&
        treeEntry.parentId !== null &&
        !byId.has(treeEntry.parentId) &&
        leafId !== null;
      const normalizedParentId = resolveCanonicalParentId(
        treeEntry.appendMode !== "side" && canonicalParentIsStale
          ? leafId
          : explicitTreeEntry &&
              treeEntry.appendMode !== "side" &&
              treeEntry.parentId === appendParentId &&
              leafId !== appendParentId
            ? leafId
            : treeEntry.parentId,
        byId,
      );
      if (normalizedParentId !== treeEntry.parentId)
        treeEntry = {
          ...treeEntry,
          parentId: normalizedParentId,
        };
    }
    if (!treeEntry) continue;
    const node = {
      ...treeEntry,
      entry,
      index,
    };
    nodes.push(node);
    byId.set(node.id, node);
    appendParentId = node.appendParentId;
    if (node.leafId !== void 0) {
      leafId = node.leafId;
      hasLeafUpdate = true;
      if (explicitTreeEntry) hasExplicitLeafUpdate = true;
    }
    if (isSessionTranscriptLeafControl(entry)) hasLeafControl = true;
  }
  return {
    nodes,
    byId,
    leafId,
    appendParentId,
    hasLeafControl,
    hasLeafUpdate,
    hasExplicitLeafUpdate,
    hasInvalidLeafControl,
  };
}
/** Select one normalized path, retaining a reachable suffix after missing ancestors. */
function selectSessionTranscriptTreePathNodes(tree, leafId) {
  if (leafId === null) return [];
  const path = [];
  const seen = /* @__PURE__ */ new Set();
  let currentId = leafId;
  while (currentId) {
    if (seen.has(currentId)) return [];
    seen.add(currentId);
    const current = tree.byId.get(currentId);
    if (!current) break;
    if (!isSessionTranscriptLeafControl(current.entry)) path.unshift(current);
    currentId = current.parentId;
  }
  return path;
}
/** Merge normalized paths in original file order and expose their retained parent links. */
function mergeSessionTranscriptTreePaths(paths) {
  const selectedById = /* @__PURE__ */ new Map();
  for (const path of paths) {
    let selectedParentId = null;
    for (const node of path) {
      selectedById.set(node.id, {
        ...node,
        selectedParentId,
      });
      selectedParentId = node.id;
    }
  }
  return [...selectedById.values()].toSorted((left, right) => left.index - right.index);
}
/**
 * Build a copy-safe branch from the visible path and the opaque append suffix.
 *
 * Hidden canonical append ancestors must not leak into forks or repairs. Keep
 * only opaque cursor records after the last canonical ancestor and reparent
 * that suffix onto the selected visible path.
 */
function mergeSessionTranscriptVisiblePathWithOpaqueAppendPath(params) {
  const nodes = mergeSessionTranscriptTreePaths([params.visiblePath]);
  const selectedIds = new Set(nodes.map((node) => node.id));
  const opaqueSuffix = [];
  for (let index = params.appendPath.length - 1; index >= 0; index -= 1) {
    const node = params.appendPath[index];
    if (!node || selectedIds.has(node.id) || isCanonicalSessionTranscriptEntry(node.entry)) break;
    opaqueSuffix.unshift(node);
  }
  let selectedParentId = nodes.at(-1)?.id ?? null;
  for (const node of opaqueSuffix) {
    nodes.push({
      ...node,
      selectedParentId,
    });
    selectedIds.add(node.id);
    selectedParentId = node.id;
  }
  return {
    nodes,
    appendParentId:
      params.appendParentId === null
        ? null
        : selectedIds.has(params.appendParentId)
          ? params.appendParentId
          : (nodes.at(-1)?.id ?? null),
  };
}
/**
 * Select the effective branch only when the transcript contains leaf controls.
 *
 * Legacy flat readers can keep their existing behavior when this returns
 * undefined. Once navigation controls exist, returning the selected path keeps
 * side branches out of prompts and hooks even after later active-branch appends.
 */
function selectSessionTranscriptLeafControlledPath(entries) {
  const tree = scanSessionTranscriptTree(entries);
  if (!tree.hasLeafControl) return;
  return selectSessionTranscriptTreePathNodes(tree, tree.leafId).map((node) => {
    if (!isRecord(node.entry) || node.entry.parentId === node.parentId) return node.entry;
    return Object.assign({}, node.entry, { parentId: node.parentId });
  });
}
//#endregion
export {
  mergeSessionTranscriptVisiblePathWithOpaqueAppendPath as a,
  selectSessionTranscriptLeafControlledPath as c,
  mergeSessionTranscriptTreePaths as i,
  selectSessionTranscriptTreePathNodes as l,
  isSessionTranscriptLeafControl as n,
  parseSessionTranscriptTreeEntry as o,
  isSessionTranscriptSideAppendEntry as r,
  scanSessionTranscriptTree as s,
  isCanonicalSessionTranscriptEntry as t,
};
