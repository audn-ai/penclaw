import { spawnSync } from "node:child_process";
//#region src/commands/doctor-session-sqlite-github-issue.ts
/** Creates GitHub issues for sanitized session SQLite recovery reports. */
/** Creates an openclaw/openclaw issue through the GitHub CLI using sanitized stdin. */
function createSessionSqliteGithubIssue(issue, spawnGh = defaultSpawnGh) {
  const result = spawnGh(
    ["issue", "create", "--repo", "openclaw/openclaw", "--title", issue.title, "--body-file", "-"],
    { input: issue.body },
  );
  if (!result.error && result.status === 0) {
    const url = String(result.stdout).trim().split(/\r?\n/).at(-1);
    return {
      ok: true,
      url: url && url.length > 0 ? url : "https://github.com/openclaw/openclaw/issues",
    };
  }
  const stderr = String(result.stderr).trim();
  const error = result.error
    ? result.error.message
    : stderr || `gh exited ${result.status ?? "unknown"}`;
  return {
    fallbackUrl: issue.url,
    message: error,
    ok: false,
  };
}
function defaultSpawnGh(args, options) {
  return spawnSync("gh", [...args], {
    encoding: "buffer",
    input: options.input,
    maxBuffer: 1024 * 1024,
  });
}
//#endregion
export { createSessionSqliteGithubIssue };
