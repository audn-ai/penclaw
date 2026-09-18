import { t as formatTerminalLink } from "./terminal-link-GrnqEUaJ.js";
//#region packages/terminal-core/src/links.ts
function resolveDocsRoot() {
  return "https://docs.openclaw.ai";
}
const ABSOLUTE_HTTP_URL_RE = /^https?:\/\//i;
function formatDocsLink(path, label, opts) {
  const docsRoot = resolveDocsRoot();
  const trimmed = typeof path === "string" ? path.trim() : "";
  const url = trimmed
    ? ABSOLUTE_HTTP_URL_RE.test(trimmed)
      ? trimmed
      : `${docsRoot}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`
    : docsRoot;
  return formatTerminalLink(label ?? url, url, {
    fallback: opts?.fallback ?? url,
    force: opts?.force,
  });
}
//#endregion
export { formatDocsLink as t };
