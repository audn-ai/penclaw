import fs from "node:fs/promises";
import path from "node:path";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import "./agent-scope-y9xQv_q1.js";
import {
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import { u as runGit } from "./git-CvJkUhVJ.js";
import { d as readResponseWithLimit } from "./http-body-aoMvQQlg.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { c as parseAgentSessionKey } from "./session-key-utils-B8sNp9l4.js";
import "./src-CIJf1lT0.js";
import { u as loadSessionEntry } from "./session-utils-DjTWBI0J.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/gateway/control-ui-github-api.ts
const GITHUB_API_ORIGIN = "https://api.github.com";
const GITHUB_JSON_MAX_BYTES = 256 * 1024;
const GITHUB_REQUEST_TIMEOUT_MS = 8e3;
const GITHUB_API_VERSION = "2022-11-28";
const GITHUB_API_MAX_REDIRECTS = 3;
var ControlUiGitHubError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = "ControlUiGitHubError";
    this.statusCode = statusCode;
  }
};
function requiredString(record, key) {
  const value = record[key];
  if (typeof value !== "string" || !value.trim())
    throw new ControlUiGitHubError(502, `GitHub response omitted ${key}`);
  return value;
}
function optionalString(record, key) {
  const value = record[key];
  return typeof value === "string" && value.trim() ? value : void 0;
}
function optionalNumber(record, key) {
  const value = record[key];
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function githubApiToken() {
  return process.env.GH_TOKEN?.trim() || process.env.GITHUB_TOKEN?.trim() || void 0;
}
function githubApiHeaders(token) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "OpenClaw-Control-UI",
    "X-GitHub-Api-Version": GITHUB_API_VERSION,
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}
function isGitHubApiRedirect(status) {
  return status === 301 || status === 302 || status === 303 || status === 307 || status === 308;
}
function safeGitHubApiUrl(raw, base) {
  try {
    const url = new URL(raw, base);
    if (url.origin !== "https://api.github.com" || url.username || url.password || url.port)
      return null;
    return url;
  } catch {
    return null;
  }
}
async function fetchGitHubApi(rawUrl, fetchImpl, token, beforeRedirect) {
  const initialUrl = safeGitHubApiUrl(rawUrl);
  if (!initialUrl) throw new ControlUiGitHubError(502, "Invalid GitHub API URL");
  let url = initialUrl;
  const signal = AbortSignal.timeout(GITHUB_REQUEST_TIMEOUT_MS);
  for (let redirects = 0; ; redirects += 1) {
    const response = await fetchImpl(url.href, {
      headers: githubApiHeaders(token),
      redirect: "manual",
      signal,
    });
    if (!isGitHubApiRedirect(response.status)) return response;
    const location = response.headers.get("location");
    const nextUrl = location ? safeGitHubApiUrl(location, url) : null;
    if (!nextUrl || redirects >= GITHUB_API_MAX_REDIRECTS) {
      await discardResponse(response);
      throw new ControlUiGitHubError(502, "GitHub API returned an unsafe redirect");
    }
    await discardResponse(response);
    await beforeRedirect?.(nextUrl);
    url = nextUrl;
  }
}
async function discardResponse(response) {
  await response.body?.cancel().catch(() => {});
}
async function readBoundedResponse(response, maxBytes) {
  try {
    return await readResponseWithLimit(response, maxBytes);
  } finally {
    await discardResponse(response);
  }
}
function upstreamErrorStatus(status) {
  if (status === 404) return 404;
  if (status === 403 || status === 429) return 429;
  return 502;
}
function isGitHubRateLimitResponse(response) {
  if (response.status === 429) return true;
  return (
    response.status === 403 &&
    (response.headers.get("x-ratelimit-remaining") === "0" || response.headers.has("retry-after"))
  );
}
function jsonErrorStatus(response) {
  if (isGitHubRateLimitResponse(response)) return 429;
  if (response.status === 404 || response.status === 403) return response.status;
  return 502;
}
/** Fetch a GitHub API JSON document with bounded size and normalized errors. */
async function fetchGitHubJson(rawUrl, fetchImpl, token) {
  const response = await fetchGitHubApi(rawUrl, fetchImpl, token);
  if (!response.ok) {
    const status = jsonErrorStatus(response);
    await discardResponse(response);
    throw new ControlUiGitHubError(status, `GitHub request failed (${response.status})`);
  }
  const body = await readBoundedResponse(response, GITHUB_JSON_MAX_BYTES);
  try {
    return JSON.parse(body.toString("utf8"));
  } catch {
    throw new ControlUiGitHubError(502, "GitHub response was not valid JSON");
  }
}
//#endregion
//#region src/gateway/control-ui-github-preview.ts
const GITHUB_AVATAR_HOST = "avatars.githubusercontent.com";
const GITHUB_AVATAR_MAX_BYTES = 256 * 1024;
const AUTHENTICATED_SUCCESS_CACHE_MS = 5 * 6e4;
const ANONYMOUS_SUCCESS_CACHE_MS = 60 * 6e4;
const FAILURE_CACHE_MS$1 = 3e4;
const CACHE_LIMIT$1 = 200;
const previewCache = /* @__PURE__ */ new Map();
function isValidOwner(value) {
  return /^(?=.{1,39}$)[a-z\d](?:[a-z\d-]*[a-z\d])?$/iu.test(value);
}
function isValidRepo(value) {
  return value !== "." && value !== ".." && /^[a-z\d_.-]{1,100}$/iu.test(value);
}
function parseControlUiGitHubPreviewTarget(value) {
  if (!isRecord(value)) return null;
  const kind = value.kind;
  const owner = typeof value.owner === "string" ? value.owner.trim() : "";
  const repo = typeof value.repo === "string" ? value.repo.trim() : "";
  const number = value.number;
  if (
    (kind !== "issue" && kind !== "pull") ||
    !isValidOwner(owner) ||
    !isValidRepo(repo) ||
    typeof number !== "number" ||
    !Number.isSafeInteger(number) ||
    number < 1 ||
    number > 9999999999
  )
    return null;
  return {
    kind,
    number,
    owner,
    repo,
  };
}
function previewApiUrl(target) {
  const collection = target.kind === "pull" ? "pulls" : "issues";
  return `${GITHUB_API_ORIGIN}/repos/${encodeURIComponent(target.owner)}/${encodeURIComponent(target.repo)}/${collection}/${target.number}`;
}
function repositoryApiUrl(target) {
  return `${GITHUB_API_ORIGIN}/repos/${encodeURIComponent(target.owner)}/${encodeURIComponent(target.repo)}`;
}
async function assertPublicRepositoryUrl(repositoryUrl, fetchImpl, token) {
  const response = await fetchGitHubApi(repositoryUrl, fetchImpl, token);
  if (!response.ok) {
    await discardResponse(response);
    throw new ControlUiGitHubError(
      upstreamErrorStatus(response.status),
      `GitHub repository request failed (${response.status})`,
    );
  }
  const body = await readBoundedResponse(response, GITHUB_JSON_MAX_BYTES);
  let parsed;
  try {
    parsed = JSON.parse(body.toString("utf8"));
  } catch {
    throw new ControlUiGitHubError(502, "GitHub repository response was not valid JSON");
  }
  if (!isRecord(parsed) || parsed.private !== false)
    throw new ControlUiGitHubError(404, "GitHub repository is not public");
}
function redirectedRepositoryApiUrl(target, url) {
  const segments = url.pathname.split("/").filter(Boolean);
  const collection = target.kind === "pull" ? "pulls" : "issues";
  if (
    segments.length === 5 &&
    segments[0] === "repos" &&
    segments[1] &&
    segments[2] &&
    segments[3] === collection &&
    /^\d+$/u.test(segments[4] ?? "")
  )
    return `${GITHUB_API_ORIGIN}/repos/${segments[1]}/${segments[2]}`;
  if (
    segments.length === 4 &&
    segments[0] === "repositories" &&
    /^\d+$/u.test(segments[1] ?? "") &&
    segments[2] === collection &&
    /^\d+$/u.test(segments[3] ?? "")
  )
    return `${GITHUB_API_ORIGIN}/repositories/${segments[1]}`;
  return null;
}
function previewRepositoryApiUrl(target, value) {
  if (target.kind === "issue") return requiredString(value, "repository_url");
  const base = isRecord(value.base) ? value.base : {};
  return requiredString(isRecord(base.repo) ? base.repo : {}, "url");
}
function parseGitHubResponse(target, value) {
  if (!isRecord(value)) throw new ControlUiGitHubError(502, "GitHub response was not an object");
  const user = isRecord(value.user) ? value.user : {};
  return {
    preview: {
      ...target,
      additions: optionalNumber(value, "additions"),
      changedFiles: optionalNumber(value, "changed_files"),
      closedAt: optionalString(value, "closed_at"),
      comments: optionalNumber(value, "comments"),
      createdAt: requiredString(value, "created_at"),
      deletions: optionalNumber(value, "deletions"),
      draft: typeof value.draft === "boolean" ? value.draft : void 0,
      login: optionalString(user, "login") ?? "ghost",
      mergedAt: optionalString(value, "merged_at"),
      state: requiredString(value, "state"),
      stateReason: optionalString(value, "state_reason"),
      title: requiredString(value, "title"),
      updatedAt: requiredString(value, "updated_at"),
    },
    avatarUrl: optionalString(user, "avatar_url"),
  };
}
function safeAvatarUrl(raw) {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (
      url.protocol !== "https:" ||
      url.hostname !== GITHUB_AVATAR_HOST ||
      url.username ||
      url.password ||
      url.port
    )
      return null;
    url.searchParams.set("s", "64");
    return url;
  } catch {
    return null;
  }
}
async function fetchAvatarDataUrl(rawUrl, fetchImpl) {
  const url = safeAvatarUrl(rawUrl);
  if (!url) return;
  try {
    const response = await fetchImpl(url, {
      headers: { Accept: "image/webp,image/png,image/jpeg,image/gif" },
      redirect: "error",
      signal: AbortSignal.timeout(GITHUB_REQUEST_TIMEOUT_MS),
    });
    const contentType = response.headers.get("content-type")?.split(";", 1)[0]?.trim();
    if (
      !response.ok ||
      !contentType ||
      !["image/gif", "image/jpeg", "image/png", "image/webp"].includes(contentType)
    ) {
      await discardResponse(response);
      return;
    }
    return `data:${contentType};base64,${(await readBoundedResponse(response, GITHUB_AVATAR_MAX_BYTES)).toString("base64")}`;
  } catch {
    return;
  }
}
async function fetchPreview(target, fetchImpl, token) {
  if (token) await assertPublicRepositoryUrl(repositoryApiUrl(target), fetchImpl, token);
  const response = await fetchGitHubApi(
    previewApiUrl(target),
    fetchImpl,
    token,
    token
      ? async (url) => {
          const repositoryUrl = redirectedRepositoryApiUrl(target, url);
          if (!repositoryUrl)
            throw new ControlUiGitHubError(502, "GitHub item returned an unsafe redirect");
          await assertPublicRepositoryUrl(repositoryUrl, fetchImpl, token);
        }
      : void 0,
  );
  if (!response.ok) {
    await discardResponse(response);
    throw new ControlUiGitHubError(
      upstreamErrorStatus(response.status),
      `GitHub request failed (${response.status})`,
    );
  }
  const body = await readBoundedResponse(response, GITHUB_JSON_MAX_BYTES);
  let parsed;
  try {
    parsed = JSON.parse(body.toString("utf8"));
  } catch {
    throw new ControlUiGitHubError(502, "GitHub response was not valid JSON");
  }
  if (!isRecord(parsed)) throw new ControlUiGitHubError(502, "GitHub response was not an object");
  if (token)
    await assertPublicRepositoryUrl(previewRepositoryApiUrl(target, parsed), fetchImpl, token);
  const { preview, avatarUrl } = parseGitHubResponse(target, parsed);
  const avatarDataUrl = await fetchAvatarDataUrl(avatarUrl, fetchImpl);
  return avatarDataUrl
    ? {
        ...preview,
        avatarDataUrl,
      }
    : preview;
}
function cacheKey(target) {
  return `${target.kind}:${target.owner.toLowerCase()}/${target.repo.toLowerCase()}#${target.number}`;
}
function loadControlUiGitHubPreview(target, fetchImpl = fetch) {
  const key = cacheKey(target);
  const now = Date.now();
  const cached = previewCache.get(key);
  if (cached && cached.expiresAt > now) {
    previewCache.delete(key);
    previewCache.set(key, cached);
    return cached.promise;
  }
  if (cached) previewCache.delete(key);
  const token = githubApiToken();
  const entry = {
    expiresAt: now + (token ? AUTHENTICATED_SUCCESS_CACHE_MS : ANONYMOUS_SUCCESS_CACHE_MS),
    promise: fetchPreview(target, fetchImpl, token).catch((error) => {
      entry.expiresAt = Date.now() + FAILURE_CACHE_MS$1;
      throw error;
    }),
  };
  previewCache.set(key, entry);
  while (previewCache.size > CACHE_LIMIT$1) {
    const oldestKey = previewCache.keys().next().value;
    if (!oldestKey) break;
    previewCache.delete(oldestKey);
  }
  return entry.promise;
}
//#endregion
//#region src/gateway/github-remote.ts
/** Parse a GitHub remote in HTTPS, SSH URL, or scp-like form. */
function parseGitHubRemoteUrl(raw) {
  const trimmed = raw.trim();
  let path;
  const scpMatch = /^git@github\.com:(.+)$/i.exec(trimmed);
  if (scpMatch) path = scpMatch[1];
  else
    try {
      const url = new URL(trimmed);
      if (
        !(url.protocol === "https:" || url.protocol === "http:" || url.protocol === "ssh:") ||
        url.hostname.toLowerCase() !== "github.com"
      )
        return null;
      path = url.pathname;
    } catch {
      return null;
    }
  const segments = (path ?? "").split("/").filter(Boolean);
  const owner = segments[0];
  const repo = segments[1]?.replace(/\.git$/i, "");
  if (segments.length !== 2 || !owner || !repo) return null;
  return {
    owner,
    repo,
  };
}
//#endregion
//#region src/gateway/control-ui-session-prs.ts
const SUCCESS_CACHE_MS = 6e4;
const RATE_LIMIT_CACHE_MS = 5 * 6e4;
const FAILURE_CACHE_MS = 3e4;
const CACHE_LIMIT = 100;
const MAX_PULL_REQUESTS = 3;
const branchCache = /* @__PURE__ */ new Map();
function parseControlUiSessionPullRequestsParams(value) {
  if (!isRecord(value)) return null;
  const sessionKey = typeof value.sessionKey === "string" ? value.sessionKey.trim() : "";
  if (!sessionKey) return null;
  const agentId = typeof value.agentId === "string" ? value.agentId.trim() : "";
  return agentId
    ? {
        sessionKey,
        agentId,
      }
    : { sessionKey };
}
async function gitOutput(cwd, args) {
  try {
    const result = await runGit(cwd, args);
    return result.code === 0 ? result.stdout.trim() || null : null;
  } catch {
    return null;
  }
}
/**
 * Resolves the GitHub repo + branch a session works on. Returns null for
 * unknown sessions, non-git roots, detached HEADs, non-GitHub remotes, and
 * the remote default branch (no PR can have the default branch as head from
 * the same checkout, and skipping it protects the anonymous GitHub quota for
 * plain sessions).
 */
async function resolveSessionPullRequestGitContext(params) {
  const { cfg, entry, storePath, canonicalKey } = loadSessionEntry(params.sessionKey, {
    agentId: params.agentId,
  });
  if (!entry?.sessionId || !storePath) return null;
  const agentId = normalizeAgentId(
    parseAgentSessionKey(canonicalKey)?.agentId ??
      params.agentId ??
      parseAgentSessionKey(params.sessionKey)?.agentId ??
      resolveDefaultAgentId(cfg),
  );
  const root =
    normalizeOptionalString(entry.spawnedCwd) ??
    normalizeOptionalString(entry.spawnedWorkspaceDir) ??
    normalizeOptionalString(resolveAgentWorkspaceDir(cfg, agentId));
  if (!root) return null;
  const branch = await gitOutput(root, ["rev-parse", "--abbrev-ref", "HEAD"]);
  if (!branch || branch === "HEAD") return null;
  const remoteUrl = await gitOutput(root, ["remote", "get-url", "origin"]);
  const remote = remoteUrl ? parseGitHubRemoteUrl(remoteUrl) : null;
  if (!remote) return null;
  const defaultBranch = (
    await gitOutput(root, ["symbolic-ref", "--short", "refs/remotes/origin/HEAD"])
  )?.replace(/^origin\//, "");
  if (defaultBranch === branch) return null;
  return {
    ...remote,
    branch,
    root,
    ...(defaultBranch ? { defaultBranch } : {}),
  };
}
function branchCreateUrl(context) {
  return `https://github.com/${encodeURIComponent(context.owner)}/${encodeURIComponent(context.repo)}/pull/new/${context.branch.split("/").map(encodeURIComponent).join("/")}`;
}
const SHORTSTAT_FILES = /(\d+) files? changed/;
const SHORTSTAT_INSERTIONS = /(\d+) insertion/;
const SHORTSTAT_DELETIONS = /(\d+) deletion/;
const MAX_UNTRACKED_STAT_FILES = 100;
const MAX_UNTRACKED_STAT_BYTES = 512 * 1024;
/**
 * Line count for one untracked file, computed in-process: this runs on the
 * chat view's 60s poll, so it must not spawn one git subprocess per path.
 * lstat gates on regular files so FIFOs/sockets can never block the RPC and
 * symlinks never resolve outside the checkout; only a line count is exposed,
 * so sessions-diff's hardlink content guard is unnecessary here.
 */
async function untrackedFileAdditions(root, filePath) {
  try {
    const abs = path.resolve(root, filePath);
    const info = await fs.lstat(abs);
    if (!info.isFile() || info.size === 0 || info.size > MAX_UNTRACKED_STAT_BYTES) return 0;
    const body = await fs.readFile(abs);
    if (body.subarray(0, 8192).includes(0)) return 0;
    let lines = 0;
    for (const byte of body) if (byte === 10) lines += 1;
    return body[body.length - 1] === 10 ? lines : lines + 1;
  } catch {
    return 0;
  }
}
async function untrackedStats(root) {
  const paths = (
    (await gitOutput(root, ["ls-files", "--others", "--exclude-standard", "-z"])) ?? ""
  )
    .split("\0")
    .filter(Boolean);
  let additions = 0;
  for (const filePath of paths.slice(0, MAX_UNTRACKED_STAT_FILES))
    additions += await untrackedFileAdditions(root, filePath);
  return {
    additions,
    files: paths.length,
  };
}
/**
 * Working-tree diff counts vs the merge base with the remote default branch,
 * untracked files included: the size the PR would have if the current work
 * were committed and pushed; changedFiles decides row visibility for
 * unpushed branches. Unlike bare `git diff`, diffing against an explicit
 * base counts unmerged (conflict) paths, so conflict-only trees still show.
 */
async function loadBranchDiffStats(root, defaultBranch) {
  const mergeBase = await gitOutput(root, [
    "merge-base",
    `refs/remotes/origin/${defaultBranch}`,
    "HEAD",
  ]);
  if (!mergeBase) return null;
  try {
    const result = await runGit(root, [
      "diff",
      "--shortstat",
      "--no-ext-diff",
      "--no-textconv",
      mergeBase,
    ]);
    if (result.code !== 0) return null;
    const summary = result.stdout.trim();
    const untracked = await untrackedStats(root);
    return {
      additions: Number(SHORTSTAT_INSERTIONS.exec(summary)?.[1] ?? 0) + untracked.additions,
      deletions: Number(SHORTSTAT_DELETIONS.exec(summary)?.[1] ?? 0),
      changedFiles: Number(SHORTSTAT_FILES.exec(summary)?.[1] ?? 0) + untracked.files,
    };
  } catch {
    return null;
  }
}
/**
 * GitHub's pull/new page only has something to offer once the pushed branch
 * carries commits the default branch lacks; unpushed or fully-merged remote
 * branches get "nothing to compare" (or a 404), so createUrl is withheld and
 * the row only reports local changed files. Rename-only commits still count —
 * this gate keys on commits, not line counts.
 */
async function branchHasCreatablePullRequest(root, context) {
  if (!context.defaultBranch) return false;
  const remoteRef = `refs/remotes/origin/${context.branch}`;
  if (!(await gitOutput(root, ["rev-parse", "--verify", "--quiet", remoteRef]))) return false;
  const ahead = await gitOutput(root, [
    "rev-list",
    "--count",
    `refs/remotes/origin/${context.defaultBranch}..${remoteRef}`,
  ]);
  return ahead === null || Number(ahead) > 0;
}
async function resolveSessionBranch(context) {
  const creatable = !context.root || (await branchHasCreatablePullRequest(context.root, context));
  const stats =
    context.root && context.defaultBranch
      ? await loadBranchDiffStats(context.root, context.defaultBranch)
      : null;
  if (!creatable && !(stats && stats.changedFiles > 0)) return;
  return {
    owner: context.owner,
    repo: context.repo,
    branch: context.branch,
    ...(creatable ? { createUrl: branchCreateUrl(context) } : {}),
    ...(stats
      ? {
          additions: stats.additions,
          deletions: stats.deletions,
        }
      : {}),
  };
}
function derivePullState(value) {
  if (optionalString(value, "merged_at")) return "merged";
  if (value.state !== "open") return "closed";
  return value.draft === true ? "draft" : "open";
}
function parsePullListItem(value) {
  if (!isRecord(value)) return null;
  const number = optionalNumber(value, "number");
  const title = optionalString(value, "title");
  const url = optionalString(value, "html_url");
  const base = isRecord(value.base) ? value.base : {};
  const baseRepo = isRecord(base.repo) ? base.repo : {};
  const owner = optionalString(isRecord(baseRepo.owner) ? baseRepo.owner : {}, "login");
  const repo = optionalString(baseRepo, "name");
  const head = isRecord(value.head) ? value.head : {};
  if (!number || !Number.isSafeInteger(number) || number < 1 || !title || !url || !owner || !repo)
    return null;
  return {
    number,
    title,
    url,
    owner,
    repo,
    state: derivePullState(value),
    headSha: optionalString(head, "sha"),
  };
}
function parsePullList(value) {
  if (!Array.isArray(value)) return [];
  return value.map(parsePullListItem).filter((item) => item !== null);
}
function pullsByHeadUrl(owner, repo, head) {
  return `${GITHUB_API_ORIGIN}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/pulls?head=${encodeURIComponent(head)}&state=all&sort=updated&direction=desc&per_page=5`;
}
async function fetchParentRepo(owner, repo, fetchImpl, token) {
  const value = await fetchGitHubJson(
    `${GITHUB_API_ORIGIN}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
    fetchImpl,
    token,
  );
  if (!isRecord(value) || value.fork !== true || !isRecord(value.parent)) return null;
  const parentLogin = optionalString(
    isRecord(value.parent.owner) ? value.parent.owner : {},
    "login",
  );
  const parentName = optionalString(value.parent, "name");
  return parentLogin && parentName
    ? {
        owner: parentLogin,
        repo: parentName,
      }
    : null;
}
function rethrowRateLimit(error) {
  if (error instanceof ControlUiGitHubError && error.statusCode === 429) throw error;
}
async function fetchDiffCounts(item, fetchImpl, token) {
  const url = `${GITHUB_API_ORIGIN}/repos/${encodeURIComponent(item.owner)}/${encodeURIComponent(item.repo)}/pulls/${item.number}`;
  try {
    const value = await fetchGitHubJson(url, fetchImpl, token);
    if (!isRecord(value)) return {};
    return {
      additions: optionalNumber(value, "additions"),
      deletions: optionalNumber(value, "deletions"),
    };
  } catch (error) {
    rethrowRateLimit(error);
    return {};
  }
}
const FAILING_CHECK_CONCLUSIONS = /* @__PURE__ */ new Set([
  "failure",
  "timed_out",
  "cancelled",
  "action_required",
  "startup_failure",
]);
function rollupCheckRuns(value) {
  if (!isRecord(value) || !Array.isArray(value.check_runs) || value.check_runs.length === 0) return;
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  let running = 0;
  for (const runValue of value.check_runs) {
    const run = isRecord(runValue) ? runValue : {};
    const conclusion = optionalString(run, "conclusion");
    if (conclusion && FAILING_CHECK_CONCLUSIONS.has(conclusion)) {
      failed += 1;
      continue;
    }
    if (run.status !== "completed" || conclusion === "stale") {
      running += 1;
      continue;
    }
    if (conclusion === "skipped") {
      skipped += 1;
      continue;
    }
    passed += 1;
  }
  return {
    state: failed > 0 ? "failing" : running > 0 ? "pending" : "passing",
    passed,
    failed,
    skipped,
    running,
  };
}
async function fetchChecks(item, fetchImpl, token) {
  if (!item.headSha || !/^[0-9a-f]{40}$/i.test(item.headSha)) return;
  const url = `${GITHUB_API_ORIGIN}/repos/${encodeURIComponent(item.owner)}/${encodeURIComponent(item.repo)}/commits/${item.headSha}/check-runs?per_page=100`;
  try {
    return rollupCheckRuns(await fetchGitHubJson(url, fetchImpl, token));
  } catch (error) {
    rethrowRateLimit(error);
    return;
  }
}
async function finishPullRequest(item, branch, fetchImpl, token) {
  const chip = {
    number: item.number,
    owner: item.owner,
    repo: item.repo,
    branch,
    title: item.title,
    url: item.url,
    state: item.state,
  };
  if (item.state !== "open" && item.state !== "draft") return chip;
  const [counts, checks] = await Promise.all([
    fetchDiffCounts(item, fetchImpl, token),
    fetchChecks(item, fetchImpl, token),
  ]);
  return {
    ...chip,
    ...counts,
    ...(checks
      ? {
          checks,
          checksUrl: `${item.url}/checks`,
        }
      : {}),
  };
}
async function fetchBranchPullRequests(context, fetchImpl, token) {
  const head = `${context.owner}:${context.branch}`;
  let items = parsePullList(
    await fetchGitHubJson(pullsByHeadUrl(context.owner, context.repo, head), fetchImpl, token),
  );
  if (items.length === 0) {
    const parent = await fetchParentRepo(context.owner, context.repo, fetchImpl, token);
    if (parent)
      items = parsePullList(
        await fetchGitHubJson(pullsByHeadUrl(parent.owner, parent.repo, head), fetchImpl, token),
      );
  }
  const capped = items.slice(0, MAX_PULL_REQUESTS);
  try {
    return {
      pullRequests: await Promise.all(
        capped.map((item) => finishPullRequest(item, context.branch, fetchImpl, token)),
      ),
      rateLimited: false,
    };
  } catch (error) {
    if (!(error instanceof ControlUiGitHubError && error.statusCode === 429)) throw error;
    return {
      pullRequests: capped.map((item) => ({
        number: item.number,
        owner: item.owner,
        repo: item.repo,
        branch: context.branch,
        title: item.title,
        url: item.url,
        state: item.state,
      })),
      rateLimited: true,
    };
  }
}
async function refreshBranchPullRequests(context, fetchImpl, entry) {
  try {
    const result = await fetchBranchPullRequests(context, fetchImpl, githubApiToken());
    entry.lastGood = result.pullRequests;
    if (result.rateLimited) entry.expiresAt = Date.now() + RATE_LIMIT_CACHE_MS;
    return result;
  } catch (error) {
    const rateLimited = error instanceof ControlUiGitHubError && error.statusCode === 429;
    entry.expiresAt = Date.now() + (rateLimited ? RATE_LIMIT_CACHE_MS : FAILURE_CACHE_MS);
    if (rateLimited)
      return {
        pullRequests: entry.lastGood ?? [],
        rateLimited: true,
      };
    if (entry.lastGood)
      return {
        pullRequests: entry.lastGood,
        rateLimited: false,
      };
    throw error;
  }
}
async function loadControlUiSessionPullRequests(params, deps = {}) {
  const context = await (deps.resolveGitContext ?? resolveSessionPullRequestGitContext)(params);
  if (!context)
    return {
      pullRequests: [],
      rateLimited: false,
    };
  const [branch, snapshot] = await Promise.all([
    resolveSessionBranch(context),
    cachedBranchPullRequests(context, deps),
  ]);
  return branch
    ? {
        ...snapshot,
        branch,
      }
    : snapshot;
}
function cachedBranchPullRequests(context, deps) {
  const key = `${context.owner.toLowerCase()}/${context.repo.toLowerCase()}#${context.branch}`;
  const cached = branchCache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    branchCache.delete(key);
    branchCache.set(key, cached);
    return cached.promise;
  }
  const entry = cached ?? {
    expiresAt: 0,
    promise: Promise.resolve({
      pullRequests: [],
      rateLimited: false,
    }),
  };
  entry.expiresAt = Date.now() + SUCCESS_CACHE_MS;
  entry.promise = refreshBranchPullRequests(context, deps.fetchImpl ?? fetch, entry);
  branchCache.delete(key);
  branchCache.set(key, entry);
  while (branchCache.size > CACHE_LIMIT) {
    const oldestKey = branchCache.keys().next().value;
    if (!oldestKey) break;
    branchCache.delete(oldestKey);
  }
  return entry.promise;
}
//#endregion
//#region src/gateway/server-methods/control-ui.ts
function createControlUiHandlers(
  loadGitHubPreview = loadControlUiGitHubPreview,
  loadSessionPullRequests = loadControlUiSessionPullRequests,
) {
  return {
    "controlUi.githubPreview": async ({ params, respond }) => {
      const target = parseControlUiGitHubPreviewTarget(params);
      if (!target) {
        respond(
          false,
          void 0,
          errorShape(ErrorCodes.INVALID_REQUEST, "invalid controlUi.githubPreview params"),
        );
        return;
      }
      try {
        respond(true, await loadGitHubPreview(target), void 0);
      } catch (error) {
        const statusCode = error instanceof ControlUiGitHubError ? error.statusCode : void 0;
        respond(
          false,
          void 0,
          errorShape(ErrorCodes.UNAVAILABLE, "GitHub preview unavailable", {
            retryable: statusCode === 429 || statusCode === 502,
          }),
        );
      }
    },
    "controlUi.sessionPullRequests": async ({ params, respond }) => {
      const parsed = parseControlUiSessionPullRequestsParams(params);
      if (!parsed) {
        respond(
          false,
          void 0,
          errorShape(ErrorCodes.INVALID_REQUEST, "invalid controlUi.sessionPullRequests params"),
        );
        return;
      }
      try {
        respond(true, await loadSessionPullRequests(parsed), void 0);
      } catch (error) {
        const statusCode = error instanceof ControlUiGitHubError ? error.statusCode : void 0;
        respond(
          false,
          void 0,
          errorShape(ErrorCodes.UNAVAILABLE, "session pull requests unavailable", {
            retryable: statusCode === 429 || statusCode === 502,
          }),
        );
      }
    },
  };
}
const controlUiHandlers = createControlUiHandlers();
//#endregion
export { controlUiHandlers, createControlUiHandlers };
