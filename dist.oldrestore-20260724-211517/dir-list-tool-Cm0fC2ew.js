import { t as appendFileTransferAudit } from "./audit-Be1mkcpD.js";
import {
  a as DIR_LIST_TOOL_DESCRIPTOR,
  i as DIR_LIST_HARD_MAX_ENTRIES,
} from "./descriptors-CAImVwMw.js";
import {
  a as readClampedInt,
  n as readRequiredNodePath,
  t as invokeNodeToolPayload,
} from "./node-tool-invoke-6NAP_BDT.js";
//#region extensions/file-transfer/src/tools/dir-list-tool.ts
function createDirListTool() {
  return {
    ...DIR_LIST_TOOL_DESCRIPTOR,
    execute: async (_toolCallId, args) => {
      const params = args;
      const { node, requestedPath: dirPath } = readRequiredNodePath(params);
      const maxEntries = readClampedInt({
        input: params,
        key: "maxEntries",
        defaultValue: 200,
        hardMin: 1,
        hardMax: DIR_LIST_HARD_MAX_ENTRIES,
      });
      const { nodeId, nodeDisplayName, payload, startedAt } = await invokeNodeToolPayload({
        node,
        params,
        command: "dir.list",
        commandParams: {
          path: dirPath,
          pageToken:
            typeof params.pageToken === "string" && params.pageToken.trim()
              ? params.pageToken.trim()
              : void 0,
          maxEntries,
        },
        requestedPath: dirPath,
      });
      const canonicalPath = typeof payload.path === "string" ? payload.path : dirPath;
      const entries = Array.isArray(payload.entries) ? payload.entries : [];
      const truncated = payload.truncated === true;
      const nextPageToken =
        typeof payload.nextPageToken === "string" ? payload.nextPageToken : void 0;
      const fileCount = entries.filter((e) => !e.isDir).length;
      const dirCount = entries.filter((e) => e.isDir).length;
      const summary = `Listed ${canonicalPath}: ${fileCount} file${fileCount !== 1 ? "s" : ""}, ${dirCount} subdir${dirCount !== 1 ? "s" : ""}${truncated ? " (more entries available — pass nextPageToken)" : ""}`;
      await appendFileTransferAudit({
        op: "dir.list",
        nodeId,
        nodeDisplayName,
        requestedPath: dirPath,
        canonicalPath,
        decision: "allowed",
        durationMs: Date.now() - startedAt,
      });
      return {
        content: [
          {
            type: "text",
            text: summary,
          },
        ],
        details: {
          path: canonicalPath,
          entries,
          nextPageToken,
          truncated,
        },
      };
    },
  };
}
//#endregion
export { createDirListTool };
