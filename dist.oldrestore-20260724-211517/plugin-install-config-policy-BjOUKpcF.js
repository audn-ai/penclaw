import fs from "node:fs";
import path from "node:path";
import "./utils-DtcDeqWS.js";
import { t as findBundledPluginSource } from "./bundled-sources-D7CuFv_v.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import "./json-files-CTWRDHag.js";
import { c as tryReadJsonSync } from "./json-7OTJmMaB.js";
import { i as loadPluginManifest } from "./manifest-DnFAzqZi.js";
import { s as parseRegistryNpmSpec } from "./npm-registry-spec-CqBTTiC9.js";
import {
  d as resolveOfficialExternalPluginInstall,
  s as listOfficialExternalPluginCatalogEntries,
  u as resolveOfficialExternalPluginId,
} from "./official-external-plugin-catalog-B2V9K3em.js";
import {
  c as parseNpmPrefixSpec,
  l as resolveFileNpmSpecToLocalPath,
} from "./plugins-command-helpers-DFgsS_UB.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
//#region src/cli/plugin-install-config-policy.ts
function isPluginInstallCommand(commandPath) {
  return commandPath[0] === "plugins" && commandPath[1] === "install";
}
function readBundledInstallRecoveryMetadata(rootDir) {
  const packageJsonPath = path.join(rootDir, "package.json");
  if (!fs.existsSync(packageJsonPath)) return { allowInvalidConfigRecovery: false };
  const manifest = loadPluginManifest(rootDir, false);
  const pluginId = manifest.ok ? manifest.manifest.id : void 0;
  const parsed = tryReadJsonSync(packageJsonPath);
  return {
    ...(pluginId ? { pluginId } : {}),
    allowInvalidConfigRecovery: parsed?.openclaw?.install?.allowInvalidConfigRecovery === true,
  };
}
function resolveBundledInstallRecoveryMetadata(request) {
  if (request.marketplace) return {};
  if (request.resolvedPath && fs.existsSync(path.join(request.resolvedPath, "package.json"))) {
    const direct = readBundledInstallRecoveryMetadata(request.resolvedPath);
    if (direct.pluginId || direct.allowInvalidConfigRecovery) return direct;
  }
  if (
    resolveFileNpmSpecToLocalPath(request.rawSpec) !== null ||
    (request.resolvedPath !== void 0 && fs.existsSync(request.resolvedPath))
  )
    return {};
  const rawNpmPrefixSpec = parseNpmPrefixSpec(request.rawSpec);
  const normalizedNpmPrefixSpec = parseNpmPrefixSpec(request.normalizedSpec);
  for (const value of [
    request.rawSpec.trim(),
    request.normalizedSpec.trim(),
    rawNpmPrefixSpec ?? "",
    normalizedNpmPrefixSpec ?? "",
  ]) {
    if (!value) continue;
    const bundled = findBundledPluginSource({
      lookup: {
        kind: "npmSpec",
        value,
      },
    });
    if (!bundled) continue;
    const recovered = readBundledInstallRecoveryMetadata(bundled.localPath);
    return {
      pluginId: recovered.pluginId ?? bundled.pluginId,
      allowInvalidConfigRecovery: recovered.allowInvalidConfigRecovery,
    };
  }
  return {};
}
function resolveOfficialExternalInstallRecoveryMetadata(request) {
  if (request.marketplace) return {};
  if (resolveFileNpmSpecToLocalPath(request.rawSpec) !== null) return {};
  if (fs.existsSync(resolveUserPath(request.rawSpec))) return {};
  const rawNpmPrefixSpec = parseNpmPrefixSpec(request.rawSpec);
  const normalizedNpmPrefixSpec = parseNpmPrefixSpec(request.normalizedSpec);
  const values = new Set(
    normalizeStringEntries([
      request.rawSpec,
      request.normalizedSpec,
      rawNpmPrefixSpec ?? "",
      normalizedNpmPrefixSpec ?? "",
      parseRegistryNpmSpec(request.rawSpec)?.name ?? "",
      parseRegistryNpmSpec(request.normalizedSpec)?.name ?? "",
      rawNpmPrefixSpec ? parseRegistryNpmSpec(rawNpmPrefixSpec)?.name : "",
      normalizedNpmPrefixSpec ? parseRegistryNpmSpec(normalizedNpmPrefixSpec)?.name : "",
    ]),
  );
  if (values.size === 0) return {};
  for (const entry of listOfficialExternalPluginCatalogEntries()) {
    const install = resolveOfficialExternalPluginInstall(entry);
    const npmSpec = install?.npmSpec?.trim() || entry.name?.trim();
    if (!npmSpec || !values.has(npmSpec)) continue;
    const pluginId = resolveOfficialExternalPluginId(entry);
    return {
      ...(pluginId ? { pluginId } : {}),
      allowInvalidConfigRecovery: install?.allowInvalidConfigRecovery === true,
    };
  }
  return {};
}
function resolvePluginInstallArgvTokens(commandPath, argv) {
  const args = argv.slice(2);
  let cursor = 0;
  for (const segment of commandPath) {
    while (cursor < args.length && args[cursor] !== segment) cursor += 1;
    if (cursor >= args.length) return [];
    cursor += 1;
  }
  return args.slice(cursor);
}
function resolvePluginInstallArgvRequest(commandPath, argv) {
  if (!isPluginInstallCommand(commandPath)) return null;
  const tokens = resolvePluginInstallArgvTokens(commandPath, argv);
  let rawSpec = null;
  let marketplace;
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens.at(index);
    if (token === void 0) break;
    if (token.startsWith("--marketplace=")) {
      marketplace = token.slice(14);
      continue;
    }
    if (token === "--marketplace") {
      const value = tokens[index + 1];
      if (typeof value === "string") {
        marketplace = value;
        index += 1;
      }
      continue;
    }
    if (token.startsWith("-")) continue;
    rawSpec ??= token;
  }
  return rawSpec
    ? {
        rawSpec,
        marketplace,
      }
    : null;
}
/** Resolve install metadata from the raw spec before Commander action handlers mutate config. */
function resolvePluginInstallRequestContext(params) {
  if (params.marketplace)
    return {
      ok: true,
      request: {
        rawSpec: params.rawSpec,
        normalizedSpec: params.rawSpec,
        installKind: "plugin",
        marketplace: params.marketplace,
      },
    };
  const fileSpec = resolveFileNpmSpecToLocalPath(params.rawSpec);
  if (fileSpec && !fileSpec.ok)
    return {
      ok: false,
      error: fileSpec.error,
    };
  const normalizedSpec = fileSpec && fileSpec.ok ? fileSpec.path : params.rawSpec;
  const bundledRecovered = resolveBundledInstallRecoveryMetadata({
    rawSpec: params.rawSpec,
    normalizedSpec,
    resolvedPath: resolveUserPath(normalizedSpec),
    marketplace: params.marketplace,
  });
  const officialRecovered = resolveOfficialExternalInstallRecoveryMetadata({
    rawSpec: params.rawSpec,
    normalizedSpec,
    marketplace: params.marketplace,
  });
  const recovered =
    officialRecovered.pluginId || officialRecovered.allowInvalidConfigRecovery !== void 0
      ? officialRecovered
      : bundledRecovered;
  return {
    ok: true,
    request: {
      rawSpec: params.rawSpec,
      normalizedSpec,
      resolvedPath: resolveUserPath(normalizedSpec),
      ...(params.installKind === "plugin" || recovered.pluginId ? { installKind: "plugin" } : {}),
      ...(recovered.pluginId ? { bundledPluginId: recovered.pluginId } : {}),
      ...(recovered.allowInvalidConfigRecovery !== void 0
        ? { allowInvalidConfigRecovery: recovered.allowInvalidConfigRecovery }
        : {}),
    },
  };
}
/** Recover the plugin install request from Commander state plus raw argv fallback parsing. */
function resolvePluginInstallPreactionRequest(params) {
  if (!isPluginInstallCommand(params.commandPath)) return null;
  const argvRequest = resolvePluginInstallArgvRequest(params.commandPath, params.argv);
  const opts = params.actionCommand.opts();
  const marketplace =
    (typeof opts.marketplace === "string" && opts.marketplace.trim()
      ? opts.marketplace
      : argvRequest?.marketplace) || void 0;
  const rawSpec =
    (typeof params.actionCommand.processedArgs?.[0] === "string"
      ? params.actionCommand.processedArgs[0]
      : argvRequest?.rawSpec) ?? null;
  if (!rawSpec) return null;
  const request = resolvePluginInstallRequestContext({
    rawSpec,
    marketplace,
  });
  return request.ok ? request.request : null;
}
/** Decide whether invalid config should block a command before plugin recovery can run. */
function resolvePluginInstallInvalidConfigPolicy(request) {
  if (!request) return "deny";
  return request.allowInvalidConfigRecovery === true ? "allow-plugin-recovery" : "deny";
}
//#endregion
export {
  resolvePluginInstallPreactionRequest as n,
  resolvePluginInstallRequestContext as r,
  resolvePluginInstallInvalidConfigPolicy as t,
};
