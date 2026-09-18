//#region src/status/status-plugin-health.ts
/** Keeps the first record per key; later duplicates are dropped. */
function dedupeBy(items, keyOf) {
  const seen = /* @__PURE__ */ new Map();
  for (const item of items) {
    const key = keyOf(item);
    if (!seen.has(key)) seen.set(key, item);
  }
  return [...seen.values()];
}
function dedupePluginDiagnostics(diagnostics) {
  return dedupeBy(diagnostics, (entry) =>
    JSON.stringify([entry.level, entry.pluginId ?? "", entry.code ?? "", entry.message]),
  );
}
function dedupeChannelPluginFailures(failures) {
  return dedupeBy(failures, (entry) =>
    JSON.stringify([entry.channelId, entry.pluginId ?? "", entry.message]),
  );
}
function dedupeCompatibilityNotices(notices) {
  return dedupeBy(notices, (entry) =>
    JSON.stringify([entry.pluginId, entry.severity, entry.code ?? "", entry.message]),
  );
}
function mergePluginRecords(installed, runtime) {
  const merged = /* @__PURE__ */ new Map();
  for (const plugin of installed) merged.set(plugin.id, plugin);
  for (const plugin of runtime) {
    const existing = merged.get(plugin.id);
    merged.set(plugin.id, {
      id: plugin.id,
      status: plugin.status ?? existing?.status,
      enabled: plugin.enabled ?? existing?.enabled,
      error: plugin.error ?? existing?.error,
      dependencyStatus: plugin.dependencyStatus ?? existing?.dependencyStatus,
      failurePhase: plugin.failurePhase ?? existing?.failurePhase,
    });
  }
  return [...merged.values()];
}
function mergeStatusPluginHealthSnapshots(installed, runtime) {
  return {
    plugins: mergePluginRecords(installed.plugins, runtime.plugins),
    diagnostics: dedupePluginDiagnostics([...installed.diagnostics, ...runtime.diagnostics]),
    contextEngineQuarantines: [
      ...installed.contextEngineQuarantines,
      ...runtime.contextEngineQuarantines,
    ],
    runtimeToolQuarantines: [
      ...(installed.runtimeToolQuarantines ?? []),
      ...(runtime.runtimeToolQuarantines ?? []),
    ],
    channelPluginFailures: dedupeChannelPluginFailures([
      ...(installed.channelPluginFailures ?? []),
      ...(runtime.channelPluginFailures ?? []),
    ]),
    compatibilityNotices: dedupeCompatibilityNotices([
      ...(installed.compatibilityNotices ?? []),
      ...(runtime.compatibilityNotices ?? []),
    ]),
    runtimeLoadedPluginIds: runtime.runtimeLoadedPluginIds,
  };
}
function hasDependencyIssue(plugin) {
  return (
    plugin.enabled !== false &&
    plugin.dependencyStatus?.hasDependencies === true &&
    plugin.dependencyStatus.requiredInstalled === false
  );
}
function shouldSuppressChannelPluginDiagnostic(diagnostic, channelPluginFailures) {
  if (!isChannelPluginFailureDiagnostic(diagnostic)) return false;
  return channelPluginFailures.some(
    (failure) =>
      failure.message === diagnostic.message &&
      (failure.pluginId == null ||
        diagnostic.pluginId == null ||
        failure.pluginId === diagnostic.pluginId),
  );
}
function getReportableDiagnostics(snapshot) {
  const channelPluginFailures = snapshot.channelPluginFailures ?? [];
  return snapshot.diagnostics.filter(
    (entry) => !shouldSuppressChannelPluginDiagnostic(entry, channelPluginFailures),
  );
}
function countProblemDiagnostics(diagnostics) {
  return {
    errors: diagnostics.filter((entry) => entry.level === "error").length,
    warnings: diagnostics.filter((entry) => entry.level === "warn").length,
  };
}
function isChannelPluginFailureDiagnostic(diagnostic) {
  return diagnostic.level === "error" && diagnostic.code === "channel-setup-failure";
}
function formatCount(count, noun) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}
function formatCompactPluginHealthLine(snapshot) {
  const loadErrors = snapshot.plugins.filter((plugin) => plugin.status === "error").length;
  const dependencyIssues = snapshot.plugins.filter(hasDependencyIssue).length;
  const diagnosticErrors = countProblemDiagnostics(getReportableDiagnostics(snapshot)).errors;
  const quarantines = snapshot.contextEngineQuarantines.length;
  const runtimeToolQuarantines = snapshot.runtimeToolQuarantines?.length ?? 0;
  const channelPluginFailures = snapshot.channelPluginFailures?.length ?? 0;
  const parts = [
    loadErrors > 0 ? formatCount(loadErrors, "plugin error") : null,
    quarantines > 0 ? formatCount(quarantines, "context engine quarantine") : null,
    runtimeToolQuarantines > 0
      ? formatCount(runtimeToolQuarantines, "runtime tool quarantine")
      : null,
    channelPluginFailures > 0 ? formatCount(channelPluginFailures, "channel plugin failure") : null,
    dependencyIssues > 0 ? formatCount(dependencyIssues, "dependency issue") : null,
    diagnosticErrors > 0 ? formatCount(diagnosticErrors, "diagnostic error") : null,
  ].filter((part) => Boolean(part));
  return parts.length === 0 ? void 0 : `⚠️ Plugins: ${parts.join(" · ")}`;
}
function formatPluginList(ids, limit) {
  if (ids.length === 0) return "none";
  const visible = ids.slice(0, limit).join(", ");
  return ids.length > limit ? `${visible}, +${ids.length - limit} more` : visible;
}
function byLocale(left, right) {
  return left.localeCompare(right);
}
function formatDetailedPluginHealth(snapshot) {
  const statusLoaded = snapshot.plugins.filter((plugin) => plugin.status === "loaded");
  const runtimeLoadedIds = snapshot.runtimeLoadedPluginIds;
  const runtimeLoaded = runtimeLoadedIds ? new Set(runtimeLoadedIds) : void 0;
  const loaded = (runtimeLoadedIds ?? statusLoaded.map((plugin) => plugin.id)).toSorted(byLocale);
  const explainedPluginIds = new Set(
    snapshot.plugins
      .filter((plugin) => plugin.status === "error" || plugin.status === "disabled")
      .map((plugin) => plugin.id),
  );
  const shouldRunNotLoaded =
    snapshot.shouldRunPluginIds && runtimeLoaded
      ? snapshot.shouldRunPluginIds
          .filter((id) => !runtimeLoaded.has(id) && !explainedPluginIds.has(id))
          .toSorted(byLocale)
      : [];
  const shouldRunNotLoadedSet = new Set(shouldRunNotLoaded);
  const installedNotActive = runtimeLoaded
    ? statusLoaded
        .filter((plugin) => !runtimeLoaded.has(plugin.id))
        .map((plugin) => plugin.id)
        .filter((id) => !shouldRunNotLoadedSet.has(id))
        .toSorted(byLocale)
    : [];
  const disabledPlugins = snapshot.plugins
    .filter((plugin) => plugin.status === "disabled")
    .toSorted((left, right) => byLocale(left.id, right.id));
  const errors = snapshot.plugins
    .filter((plugin) => plugin.status === "error")
    .toSorted((left, right) => byLocale(left.id, right.id));
  const dependencyIssues = snapshot.plugins
    .filter(hasDependencyIssue)
    .toSorted((left, right) => byLocale(left.id, right.id));
  const diagnostics = getReportableDiagnostics(snapshot);
  const diagnosticCounts = countProblemDiagnostics(diagnostics);
  const contextEngineQuarantines = snapshot.contextEngineQuarantines.toSorted((left, right) =>
    byLocale(left.engineId, right.engineId),
  );
  const runtimeToolQuarantines = (snapshot.runtimeToolQuarantines ?? []).toSorted((left, right) =>
    byLocale(left.toolName, right.toolName),
  );
  const compatibilityNotices = (snapshot.compatibilityNotices ?? []).toSorted((left, right) =>
    byLocale(left.pluginId, right.pluginId),
  );
  const channelPluginFailures = (snapshot.channelPluginFailures ?? []).toSorted((left, right) =>
    byLocale(left.channelId, right.channelId),
  );
  const unregisteredMemoryProviders = (
    snapshot.unregisteredMemoryEmbeddingProviders ?? []
  ).toSorted(
    (left, right) =>
      byLocale(left.configuredId, right.configuredId) || byLocale(left.source, right.source),
  );
  const lines = [
    formatCompactPluginHealthLine(snapshot) ?? "🔌 Plugins: OK",
    `Loaded: ${loaded.length}${loaded.length > 0 ? ` (${formatPluginList(loaded, 8)})` : ""}`,
    `Disabled: ${disabledPlugins.length}`,
  ];
  if (disabledPlugins.length > 0) {
    const disabledByReason = /* @__PURE__ */ new Map();
    for (const plugin of disabledPlugins) {
      const reason = plugin.error ?? "disabled";
      const ids = disabledByReason.get(reason);
      if (ids) ids.push(plugin.id);
      else disabledByReason.set(reason, [plugin.id]);
    }
    const reasonEntries = [...disabledByReason.entries()].toSorted((left, right) =>
      byLocale(left[0], right[0]),
    );
    lines.push(
      ...reasonEntries
        .slice(0, 8)
        .map(([reason, ids]) => `- ${reason}: ${ids.length} (${formatPluginList(ids, 8)})`),
    );
    if (reasonEntries.length > 8) lines.push(`- +${reasonEntries.length - 8} more reasons`);
  }
  if (installedNotActive.length > 0)
    lines.push(
      `Installed (not active): ${installedNotActive.length} (${formatPluginList(installedNotActive, 8)})`,
    );
  if (shouldRunNotLoaded.length > 0)
    lines.push(
      `Configured to run but not loaded: ${shouldRunNotLoaded.length} (${formatPluginList(shouldRunNotLoaded, 8)})`,
    );
  if (unregisteredMemoryProviders.length > 0) {
    const display = unregisteredMemoryProviders.map(
      (entry) => `${entry.configuredId} (memorySearch.${entry.source})`,
    );
    lines.push(
      `Configured memory provider not registered: ${unregisteredMemoryProviders.length} (${formatPluginList(display, 8)})`,
    );
  }
  if (errors.length > 0)
    lines.push(
      `Errors: ${errors.length}`,
      ...errors.slice(0, 8).map((plugin) => {
        const phase = plugin.failurePhase ? ` [${plugin.failurePhase}]` : "";
        return `- ${plugin.id}${phase}: ${plugin.error ?? "failed to load"}`;
      }),
    );
  if (contextEngineQuarantines.length > 0)
    lines.push(
      `Context engine quarantines: ${contextEngineQuarantines.length}`,
      ...contextEngineQuarantines.slice(0, 8).map((entry) => {
        const owner = entry.owner ? ` owner=${entry.owner}` : "";
        return `- ${entry.engineId}${owner} during ${entry.operation}: ${entry.reason}`;
      }),
    );
  if (runtimeToolQuarantines.length > 0)
    lines.push(
      `Runtime tool quarantines: ${runtimeToolQuarantines.length}`,
      ...runtimeToolQuarantines.slice(0, 8).map((entry) => {
        const owner = entry.owner ? ` owner=${entry.owner}` : "";
        return `- ${entry.toolName}${owner}: ${entry.reason}`;
      }),
    );
  if (channelPluginFailures.length > 0)
    lines.push(
      `Channel plugin failures: ${channelPluginFailures.length}`,
      ...channelPluginFailures.slice(0, 8).map((entry) => {
        const plugin = entry.pluginId ? ` plugin=${entry.pluginId}` : "";
        const source = entry.source ? ` [${entry.source}]` : "";
        return `- ${entry.channelId}${plugin}${source}: ${entry.message}`;
      }),
    );
  if (dependencyIssues.length > 0)
    lines.push(
      `Dependency issues: ${dependencyIssues.length}`,
      ...dependencyIssues.slice(0, 8).map((plugin) => {
        const missing = plugin.dependencyStatus?.missing ?? [];
        return `- ${plugin.id}: missing ${missing.join(", ") || "required dependencies"}`;
      }),
    );
  if (diagnosticCounts.errors > 0 || diagnosticCounts.warnings > 0) {
    lines.push(
      `Diagnostics: ${diagnosticCounts.errors} errors · ${diagnosticCounts.warnings} warnings`,
    );
    for (const diagnostic of diagnostics.slice(0, 8)) {
      const target = diagnostic.pluginId ? `${diagnostic.pluginId}: ` : "";
      lines.push(`- ${diagnostic.level.toUpperCase()} ${target}${diagnostic.message}`);
    }
  }
  if (compatibilityNotices.length > 0)
    lines.push(
      `Compatibility notices: ${compatibilityNotices.length}`,
      ...compatibilityNotices.slice(0, 8).map((notice) => {
        const code = notice.code ? ` [${notice.code}]` : "";
        return `- ${notice.severity.toUpperCase()} ${notice.pluginId}${code}: ${notice.message}`;
      }),
    );
  lines.push("Full inventory: /plugins list");
  return lines.join("\n");
}
//#endregion
export {
  isChannelPluginFailureDiagnostic as a,
  formatDetailedPluginHealth as i,
  dedupePluginDiagnostics as n,
  mergeStatusPluginHealthSnapshots as o,
  formatCompactPluginHealthLine as r,
  dedupeChannelPluginFailures as t,
};
