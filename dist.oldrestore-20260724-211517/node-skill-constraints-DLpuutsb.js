//#region src/shared/node-skill-constraints.ts
const NODE_SKILL_MAX_CONTENT_BYTES = 64 * 1024;
const NODE_SKILL_MAX_TOTAL_BYTES = 512 * 1024;
const NODE_SKILL_MAX_DESCRIPTION_LENGTH = 1024;
const NODE_SKILL_NAME_RE = /^(?!.*--)[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;
//#endregion
export {
  NODE_SKILL_NAME_RE as i,
  NODE_SKILL_MAX_DESCRIPTION_LENGTH as n,
  NODE_SKILL_MAX_TOTAL_BYTES as r,
  NODE_SKILL_MAX_CONTENT_BYTES as t,
};
