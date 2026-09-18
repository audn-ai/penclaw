import crypto from "node:crypto";
import { t as appendFileTransferAudit } from "./audit-Be1mkcpD.js";
import { h as readPositiveIntegerParam } from "./common-DyDSUect.js";
import "./security-runtime-CraX8Pqe.js";
import "./media-store-CLUM1Syr.js";
import "./param-readers-8wnI_A3p.js";
import {
  c as FILE_FETCH_TOOL_DESCRIPTOR,
  l as FILE_TRANSFER_SUBDIR,
  s as FILE_FETCH_HARD_MAX_BYTES,
} from "./descriptors-CAImVwMw.js";
import { a as wrapExternalContent } from "./external-content-rRQGoatE.js";
import { r as TEXT_INLINE_MIME_SET, t as IMAGE_MIME_INLINE_SET } from "./mime-DxNHI5sD.js";
import {
  n as readRequiredNodePath,
  r as humanSize,
  t as invokeNodeToolPayload,
} from "./node-tool-invoke-6NAP_BDT.js";
import { u as saveMediaBuffer } from "./store-BfbXoJVN.js";
//#region extensions/file-transfer/src/tools/file-fetch-tool.ts
function createFileFetchTool() {
  return {
    ...FILE_FETCH_TOOL_DESCRIPTOR,
    execute: async (_toolCallId, args) => {
      const params = args;
      const { node, requestedPath: filePath } = readRequiredNodePath(params);
      const requestedMax = readPositiveIntegerParam(params, "maxBytes") ?? 8388608;
      const { nodeId, nodeDisplayName, payload, startedAt } = await invokeNodeToolPayload({
        node,
        params,
        command: "file.fetch",
        commandParams: {
          path: filePath,
          maxBytes: Math.max(1, Math.min(requestedMax, FILE_FETCH_HARD_MAX_BYTES)),
        },
        requestedPath: filePath,
      });
      const canonicalPath = typeof payload.path === "string" ? payload.path : "";
      const size = typeof payload.size === "number" ? payload.size : -1;
      const mimeType = typeof payload.mimeType === "string" ? payload.mimeType : "";
      const hasBase64 = typeof payload.base64 === "string";
      const base64 = hasBase64 ? payload.base64 : "";
      const sha256 = typeof payload.sha256 === "string" ? payload.sha256 : "";
      if (!canonicalPath || size < 0 || !mimeType || !hasBase64 || !sha256)
        throw new Error("invalid file.fetch payload (missing fields)");
      const buffer = Buffer.from(base64, "base64");
      if (buffer.byteLength !== size)
        throw new Error(
          `file.fetch size mismatch: payload says ${size} bytes, decoded ${buffer.byteLength}`,
        );
      if (crypto.createHash("sha256").update(buffer).digest("hex") !== sha256)
        throw new Error("file.fetch sha256 mismatch (integrity failure)");
      const saved = await saveMediaBuffer(
        buffer,
        mimeType,
        FILE_TRANSFER_SUBDIR,
        FILE_FETCH_HARD_MAX_BYTES,
      );
      const localPath = saved.path;
      const shortHash = sha256.slice(0, 12);
      const isInlineImage = IMAGE_MIME_INLINE_SET.has(mimeType) && base64.length > 0;
      const isInlineText = TEXT_INLINE_MIME_SET.has(mimeType) && size <= 8192;
      const content = [];
      if (isInlineImage)
        content.push({
          type: "image",
          data: base64,
          mimeType,
        });
      else if (isInlineText) {
        const text = buffer.toString("utf-8");
        const wrappedText = wrapExternalContent(
          `Fetched ${canonicalPath} (${humanSize(size)}, ${mimeType}, sha256:${shortHash}) saved at ${localPath}\n\n--- contents ---\n${text}`,
          { source: "unknown" },
        );
        content.push({
          type: "text",
          text: wrappedText,
        });
      } else {
        const wrappedText = wrapExternalContent(
          `Fetched ${canonicalPath} (${humanSize(size)}, ${mimeType}, sha256:${shortHash}) saved at ${localPath}`,
          { source: "unknown" },
        );
        content.push({
          type: "text",
          text: wrappedText,
        });
      }
      await appendFileTransferAudit({
        op: "file.fetch",
        nodeId,
        nodeDisplayName,
        requestedPath: filePath,
        canonicalPath,
        decision: "allowed",
        sizeBytes: size,
        sha256,
        durationMs: Date.now() - startedAt,
      });
      return {
        content,
        details: {
          path: canonicalPath,
          size,
          mimeType,
          sha256,
          localPath,
          mediaId: saved.id,
          media: { mediaUrls: [localPath] },
        },
      };
    },
  };
}
//#endregion
export { createFileFetchTool };
