import "./agent-scope-y9xQv_q1.js";
import fs from "node:fs";
import fs$1 from "node:fs/promises";
import { n as listAgentIds, o as resolveAgentWorkspaceDir } from "./agent-scope-config-DVIR1nBa.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import { t as ADMIN_SCOPE } from "./operator-scopes-CpPJIv7P.js";
import {
  a as WorktreeSnapshotError,
  o as managedWorktrees,
  s as resolveWorktreeCleanupLimits,
} from "./service-Dhl824Yp.js";
import {
  $i as validateWorktreesBranchesParams,
  ea as validateWorktreesCreateParams,
  ia as validateWorktreesRestoreParams,
  na as validateWorktreesListParams,
  ra as validateWorktreesRemoveParams,
  ta as validateWorktreesGcParams,
} from "./src-CIJf1lT0.js";
import { t as isManagedWorktreeOwnerActive } from "./worktree-owner-activity-DHiwt9iO.js";
//#region src/gateway/server-methods/worktrees.ts
function invalidParams(respond) {
  respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid worktrees parameters"));
}
function createWorktreesHandlers(service) {
  return {
    "worktrees.list": async ({ params, respond }) => {
      if (!validateWorktreesListParams(params)) {
        invalidParams(respond);
        return;
      }
      try {
        respond(true, { worktrees: await service.list() }, void 0);
      } catch (error) {
        respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error)));
      }
    },
    "worktrees.create": async ({ params, respond }) => {
      if (!validateWorktreesCreateParams(params)) {
        invalidParams(respond);
        return;
      }
      try {
        respond(
          true,
          await service.create({
            repoRoot: params.repoRoot,
            name: params.name,
            baseRef: params.baseRef,
            ownerKind: "manual",
          }),
          void 0,
        );
      } catch (error) {
        respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error)));
      }
    },
    "worktrees.remove": async ({ params, respond }) => {
      if (!validateWorktreesRemoveParams(params)) {
        invalidParams(respond);
        return;
      }
      try {
        const result = await service.remove({
          id: params.id,
          reason: "manual-delete",
          force: params.force,
        });
        respond(
          true,
          {
            removed: result.removed,
            ...(result.snapshotRef ? { snapshotRef: result.snapshotRef } : {}),
            ...(result.snapshotError ? { snapshotError: result.snapshotError } : {}),
          },
          void 0,
        );
      } catch (error) {
        if (error instanceof WorktreeSnapshotError) {
          respond(
            true,
            {
              removed: false,
              snapshotError: error.snapshotError,
            },
            void 0,
          );
          return;
        }
        respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error)));
      }
    },
    "worktrees.restore": async ({ params, respond }) => {
      if (!validateWorktreesRestoreParams(params)) {
        invalidParams(respond);
        return;
      }
      try {
        respond(true, await service.restore({ id: params.id }), void 0);
      } catch (error) {
        respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error)));
      }
    },
    "worktrees.branches": async ({ params, respond, context, client }) => {
      if (!validateWorktreesBranchesParams(params)) {
        invalidParams(respond);
        return;
      }
      if (
        !(Array.isArray(client?.connect.scopes) ? client.connect.scopes : []).includes(
          "operator.admin",
        )
      ) {
        const cfg = context.getRuntimeConfig();
        const requested = await fs$1.realpath(params.repoRoot).catch(() => null);
        if (
          !(
            requested !== null &&
            listAgentIds(cfg).some((agentId) => {
              try {
                return fs.realpathSync(resolveAgentWorkspaceDir(cfg, agentId)) === requested;
              } catch {
                return false;
              }
            })
          )
        ) {
          respond(
            false,
            void 0,
            errorShape(
              ErrorCodes.INVALID_REQUEST,
              `worktrees.branches outside configured agent workspaces requires gateway scope: ${ADMIN_SCOPE}`,
            ),
          );
          return;
        }
      }
      try {
        respond(true, await service.listRepositoryBranches(params.repoRoot), void 0);
      } catch (error) {
        respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error)));
      }
    },
    "worktrees.gc": async ({ params, respond, context }) => {
      if (!validateWorktreesGcParams(params)) {
        invalidParams(respond);
        return;
      }
      try {
        const limits = resolveWorktreeCleanupLimits(context.getRuntimeConfig().worktrees);
        respond(
          true,
          await service.gc({
            limits,
            isOwnerActive: isManagedWorktreeOwnerActive,
          }),
          void 0,
        );
      } catch (error) {
        respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error)));
      }
    },
  };
}
const worktreesHandlers = createWorktreesHandlers(managedWorktrees);
//#endregion
export { createWorktreesHandlers, worktreesHandlers };
