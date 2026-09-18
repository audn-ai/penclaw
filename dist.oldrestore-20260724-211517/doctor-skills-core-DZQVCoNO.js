//#region src/commands/doctor-skills-core.ts
/** Returns allowed skills that are unusable in the current runtime environment. */
function collectUnavailableAgentSkills(report) {
  return report.skills.filter(
    (skill) =>
      !skill.eligible &&
      !skill.disabled &&
      !skill.blockedByAllowlist &&
      !skill.blockedByAgentFilter &&
      !skill.platformIncompatible,
  );
}
function formatMissingSkillSummary(skill) {
  const missing = [];
  if (skill.missing.bins.length > 0) missing.push(`bins: ${skill.missing.bins.join(", ")}`);
  if (skill.missing.anyBins.length > 0)
    missing.push(`any bins: ${skill.missing.anyBins.join(", ")}`);
  if (skill.missing.env.length > 0) missing.push(`env: ${skill.missing.env.join(", ")}`);
  if (skill.missing.config.length > 0) missing.push(`config: ${skill.missing.config.join(", ")}`);
  if (skill.missing.os.length > 0) missing.push(`os: ${skill.missing.os.join(", ")}`);
  return missing.join("; ") || "unknown requirement";
}
/** Disables unavailable skills in config while preserving existing skill entries. */
function disableUnavailableSkillsInConfig(config, skills) {
  if (skills.length === 0) return config;
  const entries = { ...config.skills?.entries };
  for (const skill of skills)
    entries[skill.skillKey] = {
      ...entries[skill.skillKey],
      enabled: false,
    };
  return {
    ...config,
    skills: {
      ...config.skills,
      entries,
    },
  };
}
//#endregion
export {
  disableUnavailableSkillsInConfig as n,
  formatMissingSkillSummary as r,
  collectUnavailableAgentSkills as t,
};
