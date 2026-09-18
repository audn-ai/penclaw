import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import { t as listHostDirectories } from "./host-directory-listing-Dsq7vChC.js";
import {
  l as resolveNodeCommandAllowlist,
  o as isNodeCommandAllowed,
} from "./node-command-policy-pdhFRd-t.js";
import { s as NODE_FS_LIST_DIR_COMMAND } from "./node-commands-zATGYJg5.js";
import { Nt as validateFsListDirParams, Pt as validateFsListDirResult } from "./src-CIJf1lT0.js";
//#region src/gateway/server-methods/fs.ts
function parseNodePayload(payload, payloadJSON) {
  if (payloadJSON)
    try {
      return JSON.parse(payloadJSON);
    } catch {
      return;
    }
  return payload;
}
const fsHandlers = {
  "fs.listDir": async ({ params, respond, context }) => {
    if (!validateFsListDirParams(params)) {
      respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid fs parameters"));
      return;
    }
    try {
      if (params.nodeId) {
        const node = context.nodeRegistry.get(params.nodeId);
        if (!node) {
          respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "node not connected"));
          return;
        }
        if (!node.commands.includes("fs.listDir")) {
          respond(
            false,
            void 0,
            errorShape(ErrorCodes.INVALID_REQUEST, "node does not support directory browsing"),
          );
          return;
        }
        const allowed = isNodeCommandAllowed({
          command: NODE_FS_LIST_DIR_COMMAND,
          declaredCommands: node.commands,
          allowlist: resolveNodeCommandAllowlist(context.getRuntimeConfig(), {
            ...node,
            approvedCommands: node.commands,
          }),
        });
        if (!allowed.ok) {
          respond(
            false,
            void 0,
            errorShape(
              ErrorCodes.INVALID_REQUEST,
              `node command not allowed: ${NODE_FS_LIST_DIR_COMMAND} (${allowed.reason})`,
              {
                details: {
                  command: NODE_FS_LIST_DIR_COMMAND,
                  reason: allowed.reason,
                },
              },
            ),
          );
          return;
        }
        const result = await context.nodeRegistry.invoke({
          nodeId: params.nodeId,
          expectedConnId: node.connId,
          command: NODE_FS_LIST_DIR_COMMAND,
          params: params.path ? { path: params.path } : {},
        });
        if (!result.ok) {
          respond(
            false,
            void 0,
            errorShape(ErrorCodes.UNAVAILABLE, result.error?.message ?? "node browse failed"),
          );
          return;
        }
        const payload = parseNodePayload(result.payload, result.payloadJSON);
        if (!validateFsListDirResult(payload)) {
          respond(
            false,
            void 0,
            errorShape(ErrorCodes.UNAVAILABLE, "node returned an invalid directory listing"),
          );
          return;
        }
        respond(true, payload, void 0);
        return;
      }
      respond(true, await listHostDirectories(params.path), void 0);
    } catch (error) {
      respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, String(error)));
    }
  },
};
//#endregion
export { fsHandlers };
