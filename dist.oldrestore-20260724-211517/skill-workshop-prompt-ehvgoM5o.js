//#region src/agents/skill-workshop-prompt.ts
/**
 * System-prompt contribution for routing durable skill edits through the
 * Skill Workshop tool instead of direct filesystem writes.
 */
const SKILL_WORKSHOP_TOOL_NAME = "skill_workshop";
/** Build the system-prompt section for Skill Workshop routing rules. */
function buildSkillWorkshopPromptSection() {
  return [
    "## Skill Workshop",
    "Durable reusable skill/playbook/workflow work: `skill_workshop`; never write proposal/skill files directly.",
    "Generated = pending proposal. Apply/reject/quarantine only explicit user ask.",
    "",
  ];
}
//#endregion
export { buildSkillWorkshopPromptSection as n, SKILL_WORKSHOP_TOOL_NAME as t };
