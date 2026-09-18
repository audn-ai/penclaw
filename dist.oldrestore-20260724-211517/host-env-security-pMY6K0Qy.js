import { r as markOpenClawExecEnv } from "./openclaw-exec-env-BmbZ1aqS.js";
import { g as sortUniqueStrings } from "./string-normalization-CRyoFBPt.js";
//#region src/infra/host-env-security-policy.json
var host_env_security_policy_default = {
  blockedEverywhereKeys: [
    "NODE_OPTIONS",
    "NODE_PATH",
    "NODE_REDIRECT_WARNINGS",
    "NODE_REPL_EXTERNAL_MODULE",
    "NODE_REPL_HISTORY",
    "NODE_V8_COVERAGE",
    "PYTHONHOME",
    "PYTHONPATH",
    "PERL5LIB",
    "PERL5OPT",
    "RUBYLIB",
    "RUBYOPT",
    "BASHOPTS",
    "BASH_ENV",
    "ENV",
    "KSH_ENV",
    "BROWSER",
    "GIT_ALLOW_PROTOCOL",
    "GIT_EDITOR",
    "GIT_EXTERNAL_DIFF",
    "GIT_DIR",
    "GIT_WORK_TREE",
    "GIT_COMMON_DIR",
    "GIT_EXEC_PATH",
    "GIT_INDEX_FILE",
    "GIT_OBJECT_DIRECTORY",
    "GIT_ALTERNATE_OBJECT_DIRECTORIES",
    "GIT_NAMESPACE",
    "GIT_PROTOCOL_FROM_USER",
    "GIT_SEQUENCE_EDITOR",
    "GIT_TEMPLATE_DIR",
    "GIT_SSL_NO_VERIFY",
    "GIT_SSL_CAINFO",
    "GIT_SSL_CAPATH",
    "CC",
    "CXX",
    "CARGO_BUILD_RUSTC",
    "CARGO_BUILD_RUSTC_WRAPPER",
    "CARGO_BUILD_RUSTC_WORKSPACE_WRAPPER",
    "CARGO_BUILD_RUSTDOC",
    "RUSTC",
    "RUSTC_WRAPPER",
    "RUSTC_WORKSPACE_WRAPPER",
    "RUSTDOC",
    "CMAKE_C_COMPILER",
    "CMAKE_CXX_COMPILER",
    "SHELL",
    "SHELLOPTS",
    "PS4",
    "GCONV_PATH",
    "IFS",
    "SSLKEYLOGFILE",
    "JAVA_OPTS",
    "JAVA_TOOL_OPTIONS",
    "_JAVA_OPTIONS",
    "JDK_JAVA_OPTIONS",
    "PYTHONBREAKPOINT",
    "DOTNET_STARTUP_HOOKS",
    "DOTNET_ADDITIONAL_DEPS",
    "FPATH",
    "GLIBC_TUNABLES",
    "MAVEN_OPTS",
    "MAKE",
    "MAKEFLAGS",
    "MFLAGS",
    "SBT_OPTS",
    "GRADLE_OPTS",
    "ANT_OPTS",
    "HGRCPATH",
    "HGEDITOR",
    "HGMERGE",
    "EXINIT",
    "VIMINIT",
    "MYVIMRC",
    "GVIMINIT",
    "LUA_INIT",
    "LUA_INIT_5_1",
    "LUA_INIT_5_2",
    "LUA_INIT_5_3",
    "LUA_INIT_5_4",
    "EMACSLOADPATH",
    "RUBYSHELL",
    "GIT_HOOK_PATH",
    "SVN_EDITOR",
    "SVN_SSH",
    "BZR_EDITOR",
    "BZR_SSH",
    "BZR_PLUGIN_PATH",
    "SUDO_ASKPASS",
    "JULIA_EDITOR",
    "CONFIG_SITE",
    "CONFIG_SHELL",
    "CMAKE_TOOLCHAIN_FILE",
    "CATALINA_OPTS",
    "CORECLR_PROFILER",
    "HELM_PLUGINS",
    "PACKER_PLUGIN_PATH",
    "VAGRANT_VAGRANTFILE",
    "ERL_AFLAGS",
    "ERL_FLAGS",
    "ERL_ZFLAGS",
    "ELIXIR_ERL_OPTIONS",
    "R_ENVIRON",
    "R_PROFILE",
    "R_ENVIRON_USER",
    "R_PROFILE_USER",
    "TCLLIBPATH",
    "HOSTALIASES",
  ],
  blockedOverrideOnlyKeys: [
    "HOME",
    "GRADLE_USER_HOME",
    "ZDOTDIR",
    "GIT_DIR",
    "GIT_WORK_TREE",
    "GIT_COMMON_DIR",
    "GIT_INDEX_FILE",
    "GIT_OBJECT_DIRECTORY",
    "GIT_ALTERNATE_OBJECT_DIRECTORIES",
    "GIT_NAMESPACE",
    "GIT_SSH_COMMAND",
    "GIT_SSH",
    "GIT_PROXY_COMMAND",
    "GIT_ASKPASS",
    "GIT_SSL_NO_VERIFY",
    "GIT_SSL_CAINFO",
    "GIT_SSL_CAPATH",
    "SSH_ASKPASS",
    "LESSOPEN",
    "LESSCLOSE",
    "PAGER",
    "MANPAGER",
    "GIT_PAGER",
    "EDITOR",
    "VISUAL",
    "FCEDIT",
    "SUDO_EDITOR",
    "PROMPT_COMMAND",
    "HISTFILE",
    "PERL5DB",
    "PERL5DBCMD",
    "OPENSSL_CONF",
    "OPENSSL_ENGINES",
    "PYTHONSTARTUP",
    "WGETRC",
    "CURL_HOME",
    "CLASSPATH",
    "CFLAGS",
    "CGO_CFLAGS",
    "CGO_LDFLAGS",
    "GOFLAGS",
    "MAKEFLAGS",
    "MFLAGS",
    "CORECLR_PROFILER_PATH",
    "PHPRC",
    "PHP_INI_SCAN_DIR",
    "DENO_DIR",
    "BUN_CONFIG_REGISTRY",
    "YARN_RC_FILENAME",
    "HTTP_PROXY",
    "HTTPS_PROXY",
    "ALL_PROXY",
    "NO_PROXY",
    "NODE_TLS_REJECT_UNAUTHORIZED",
    "NODE_EXTRA_CA_CERTS",
    "SSL_CERT_FILE",
    "SSL_CERT_DIR",
    "REQUESTS_CA_BUNDLE",
    "CURL_CA_BUNDLE",
    "DOCKER_HOST",
    "DOCKER_TLS_VERIFY",
    "DOCKER_CERT_PATH",
    "PIP_INDEX_URL",
    "PIP_PYPI_URL",
    "PIP_EXTRA_INDEX_URL",
    "PIP_CONFIG_FILE",
    "PIP_FIND_LINKS",
    "PIP_TRUSTED_HOST",
    "UV_INDEX",
    "UV_INDEX_URL",
    "UV_PYTHON",
    "UV_EXTRA_INDEX_URL",
    "UV_DEFAULT_INDEX",
    "DOCKER_CONTEXT",
    "LIBRARY_PATH",
    "LDFLAGS",
    "CPATH",
    "C_INCLUDE_PATH",
    "CPLUS_INCLUDE_PATH",
    "OBJC_INCLUDE_PATH",
    "GOPROXY",
    "GONOSUMCHECK",
    "GONOSUMDB",
    "GONOPROXY",
    "GOPRIVATE",
    "GOENV",
    "GOPATH",
    "HGRCPATH",
    "PYTHONUSERBASE",
    "RUSTC_WRAPPER",
    "RUSTFLAGS",
    "RUSTUP_DIST_ROOT",
    "RUSTUP_DIST_SERVER",
    "RUSTUP_HOME",
    "RUSTUP_TOOLCHAIN",
    "RUSTUP_UPDATE_ROOT",
    "CARGO_HOME",
    "VIRTUAL_ENV",
    "LUA_PATH",
    "LUA_CPATH",
    "GEM_HOME",
    "GEM_PATH",
    "BUNDLE_GEMFILE",
    "COMPOSER_HOME",
    "CONDA_DEFAULT_ENV",
    "CONDA_PREFIX",
    "CARGO_BUILD_RUSTC_WRAPPER",
    "XDG_CACHE_HOME",
    "XDG_CONFIG_DIRS",
    "XDG_CONFIG_HOME",
    "XDG_DATA_DIRS",
    "XDG_DATA_HOME",
    "XDG_RUNTIME_DIR",
    "XDG_STATE_HOME",
    "AWS_CONFIG_FILE",
    "KUBECONFIG",
    "GOOGLE_APPLICATION_CREDENTIALS",
    "AWS_SHARED_CREDENTIALS_FILE",
    "AWS_WEB_IDENTITY_TOKEN_FILE",
    "AZURE_AUTH_LOCATION",
    "HELM_HOME",
    "ANSIBLE_CONFIG",
    "ANSIBLE_LIBRARY",
    "ANSIBLE_CALLBACK_PLUGINS",
    "ANSIBLE_COLLECTIONS_PATH",
    "ANSIBLE_CONNECTION_PLUGINS",
    "ANSIBLE_FILTER_PLUGINS",
    "ANSIBLE_INVENTORY_PLUGINS",
    "ANSIBLE_LOOKUP_PLUGINS",
    "ANSIBLE_MODULE_UTILS",
    "ANSIBLE_REMOTE_TEMP",
    "ANSIBLE_ROLES_PATH",
    "ANSIBLE_STRATEGY_PLUGINS",
    "R_LIBS_USER",
    "TF_CLI_CONFIG_FILE",
    "TF_PLUGIN_CACHE_DIR",
    "AMQP_URL",
    "AWS_ACCESS_KEY_ID",
    "AWS_CONTAINER_CREDENTIALS_FULL_URI",
    "AWS_CONTAINER_CREDENTIALS_RELATIVE_URI",
    "AWS_SECRET_ACCESS_KEY",
    "AWS_SECURITY_TOKEN",
    "AWS_SESSION_TOKEN",
    "AZURE_CLIENT_ID",
    "AZURE_CLIENT_SECRET",
    "DATABASE_URL",
    "GH_TOKEN",
    "GITHUB_TOKEN",
    "GITLAB_TOKEN",
    "MONGODB_URI",
    "NODE_AUTH_TOKEN",
    "NPM_TOKEN",
    "REDIS_URL",
    "SSH_AUTH_SOCK",
    "SYSTEMROOT",
    "WINDIR",
  ],
  allowedInheritedOverrideOnlyKeys: [
    "ALL_PROXY",
    "AWS_CONFIG_FILE",
    "AWS_SHARED_CREDENTIALS_FILE",
    "AWS_WEB_IDENTITY_TOKEN_FILE",
    "AZURE_AUTH_LOCATION",
    "CURL_CA_BUNDLE",
    "DOCKER_CERT_PATH",
    "DOCKER_CONTEXT",
    "DOCKER_HOST",
    "DOCKER_TLS_VERIFY",
    "GIT_PAGER",
    "GOOGLE_APPLICATION_CREDENTIALS",
    "GRADLE_USER_HOME",
    "HISTFILE",
    "HOME",
    "HTTPS_PROXY",
    "HTTP_PROXY",
    "KUBECONFIG",
    "MANPAGER",
    "NODE_EXTRA_CA_CERTS",
    "NODE_TLS_REJECT_UNAUTHORIZED",
    "NO_PROXY",
    "PAGER",
    "REQUESTS_CA_BUNDLE",
    "RUSTUP_DIST_ROOT",
    "RUSTUP_DIST_SERVER",
    "RUSTUP_HOME",
    "RUSTUP_TOOLCHAIN",
    "RUSTUP_UPDATE_ROOT",
    "SSH_AUTH_SOCK",
    "SSL_CERT_DIR",
    "SSL_CERT_FILE",
    "SYSTEMROOT",
    "WINDIR",
    "XDG_CACHE_HOME",
    "XDG_CONFIG_DIRS",
    "XDG_CONFIG_HOME",
    "XDG_DATA_DIRS",
    "XDG_DATA_HOME",
    "XDG_RUNTIME_DIR",
    "XDG_STATE_HOME",
    "ZDOTDIR",
  ],
  blockedOverridePrefixes: ["GIT_CONFIG_", "NPM_CONFIG_", "CARGO_REGISTRIES_", "TF_VAR_"],
  blockedPrefixes: ["DYLD_", "LD_", "BASH_FUNC_"],
};
//#endregion
//#region src/infra/host-env-security-policy.js
function sortUniqueUppercase(values) {
  return Object.freeze(
    Array.from(new Set(values.map((value) => value.toUpperCase()))).toSorted((left, right) =>
      left < right ? -1 : left > right ? 1 : 0,
    ),
  );
}
function derivePolicyArrays(policy) {
  const blockedEverywhereKeys = policy.blockedEverywhereKeys ?? [];
  const blockedOverrideOnlyKeys = policy.blockedOverrideOnlyKeys ?? [];
  const allowedInheritedOverrideOnlyKeys = policy.allowedInheritedOverrideOnlyKeys ?? [];
  const allowedInheritedOverrideOnlyUpper = new Set(
    allowedInheritedOverrideOnlyKeys.map((value) => value.toUpperCase()),
  );
  const blockedPrefixes = policy.blockedPrefixes ?? [];
  const blockedOverridePrefixes = policy.blockedOverridePrefixes ?? [];
  const blockedInheritedPrefixes = policy.blockedInheritedPrefixes ?? blockedPrefixes;
  return {
    blockedInheritedKeys: sortUniqueUppercase([
      ...blockedEverywhereKeys,
      ...blockedOverrideOnlyKeys.filter(
        (value) => !allowedInheritedOverrideOnlyUpper.has(value.toUpperCase()),
      ),
    ]),
    blockedInheritedPrefixes: sortUniqueUppercase(blockedInheritedPrefixes),
    blockedKeys: sortUniqueUppercase(blockedEverywhereKeys),
    blockedOverrideKeys: sortUniqueUppercase(blockedOverrideOnlyKeys),
    blockedPrefixes: sortUniqueUppercase(blockedPrefixes),
    blockedOverridePrefixes: sortUniqueUppercase(blockedOverridePrefixes),
  };
}
/**
 * Normalizes raw host environment policy JSON into immutable lookup arrays.
 */
function loadHostEnvSecurityPolicy(rawPolicy = host_env_security_policy_default) {
  const derived = derivePolicyArrays(rawPolicy);
  return Object.freeze({
    blockedEverywhereKeys: Object.freeze(rawPolicy.blockedEverywhereKeys ?? []),
    blockedOverrideOnlyKeys: Object.freeze(rawPolicy.blockedOverrideOnlyKeys ?? []),
    allowedInheritedOverrideOnlyKeys: Object.freeze(
      rawPolicy.allowedInheritedOverrideOnlyKeys ?? [],
    ),
    blockedInheritedKeys: derived.blockedInheritedKeys,
    blockedInheritedPrefixes: derived.blockedInheritedPrefixes,
    blockedPrefixes: derived.blockedPrefixes,
    blockedOverridePrefixes: derived.blockedOverridePrefixes,
    blockedKeys: derived.blockedKeys,
    blockedOverrideKeys: derived.blockedOverrideKeys,
  });
}
/**
 * Process-wide host environment security policy derived from generated JSON.
 */
const HOST_ENV_SECURITY_POLICY = loadHostEnvSecurityPolicy();
//#endregion
//#region src/infra/host-env-security.ts
const PORTABLE_ENV_VAR_KEY = /^[A-Za-z_][A-Za-z0-9_]*$/;
const WINDOWS_COMPAT_OVERRIDE_ENV_VAR_KEY = /^[A-Za-z_][A-Za-z0-9_()]*$/;
const HOST_DANGEROUS_ENV_KEY_VALUES = Object.freeze([...HOST_ENV_SECURITY_POLICY.blockedKeys]);
const HOST_DANGEROUS_ENV_PREFIXES = Object.freeze([...HOST_ENV_SECURITY_POLICY.blockedPrefixes]);
const HOST_DANGEROUS_INHERITED_ENV_KEY_VALUES = Object.freeze([
  ...HOST_ENV_SECURITY_POLICY.blockedInheritedKeys,
]);
const HOST_DANGEROUS_INHERITED_ENV_PREFIXES = Object.freeze([
  ...HOST_ENV_SECURITY_POLICY.blockedInheritedPrefixes,
]);
const HOST_DANGEROUS_OVERRIDE_ENV_KEY_VALUES = Object.freeze([
  ...HOST_ENV_SECURITY_POLICY.blockedOverrideKeys,
]);
const HOST_DANGEROUS_OVERRIDE_ENV_PREFIXES = Object.freeze([
  ...HOST_ENV_SECURITY_POLICY.blockedOverridePrefixes,
]);
const HOST_SHELL_WRAPPER_ALLOWED_OVERRIDE_ENV_KEY_VALUES = Object.freeze([
  "TERM",
  "LANG",
  "LC_ALL",
  "LC_CTYPE",
  "LC_MESSAGES",
  "COLORTERM",
  "NO_COLOR",
  "FORCE_COLOR",
]);
const HOST_SHELL_WRAPPER_ALLOWED_OVERRIDE_ENV_PREFIX_VALUES = Object.freeze(["LC_"]);
const HOST_DANGEROUS_ENV_KEYS = new Set(HOST_DANGEROUS_ENV_KEY_VALUES);
const HOST_DANGEROUS_INHERITED_ENV_KEYS = new Set(HOST_DANGEROUS_INHERITED_ENV_KEY_VALUES);
const HOST_DANGEROUS_OVERRIDE_ENV_KEYS = new Set(HOST_DANGEROUS_OVERRIDE_ENV_KEY_VALUES);
const HOST_SHELL_WRAPPER_ALLOWED_OVERRIDE_ENV_KEYS = new Set(
  HOST_SHELL_WRAPPER_ALLOWED_OVERRIDE_ENV_KEY_VALUES,
);
const CARGO_TARGET_EXECUTABLE_OVERRIDE_ENV_KEY = /^CARGO_TARGET_[A-Z0-9_]+_(?:LINKER|RUNNER)$/;
const GIT_ALLOW_PROTOCOL_ENV_KEY = "GIT_ALLOW_PROTOCOL";
const GIT_PROTOCOL_FROM_USER_ENV_KEY = "GIT_PROTOCOL_FROM_USER";
const GIT_PROTOCOL_FROM_USER_DISABLED_VALUE = "0";
const GIT_DEFAULT_ALWAYS_ALLOWED_PROTOCOLS = /* @__PURE__ */ new Set([
  "git",
  "http",
  "https",
  "ssh",
]);
function isShellWrapperAllowedOverrideEnvVarName(rawKey) {
  const key = normalizeEnvVarKey(rawKey, { portable: true });
  if (!key) return false;
  const upper = key.toUpperCase();
  if (HOST_SHELL_WRAPPER_ALLOWED_OVERRIDE_ENV_KEYS.has(upper)) return true;
  return HOST_SHELL_WRAPPER_ALLOWED_OVERRIDE_ENV_PREFIX_VALUES.some((prefix) =>
    upper.startsWith(prefix),
  );
}
function normalizeEnvVarKey(rawKey, options) {
  const key = rawKey.trim();
  if (!key) return null;
  if (options?.portable && !PORTABLE_ENV_VAR_KEY.test(key)) return null;
  return key;
}
function normalizeHostOverrideEnvVarKey(rawKey) {
  const key = normalizeEnvVarKey(rawKey);
  if (!key) return null;
  if (PORTABLE_ENV_VAR_KEY.test(key) || WINDOWS_COMPAT_OVERRIDE_ENV_VAR_KEY.test(key)) return key;
  return null;
}
function isDangerousHostEnvVarName(rawKey) {
  const key = normalizeEnvVarKey(rawKey);
  if (!key) return false;
  const upper = key.toUpperCase();
  if (HOST_DANGEROUS_ENV_KEYS.has(upper)) return true;
  return HOST_DANGEROUS_ENV_PREFIXES.some((prefix) => upper.startsWith(prefix));
}
function isDangerousHostInheritedEnvVarName(rawKey) {
  const key = normalizeEnvVarKey(rawKey);
  if (!key) return false;
  const upper = key.toUpperCase();
  if (HOST_DANGEROUS_INHERITED_ENV_KEYS.has(upper)) return true;
  return HOST_DANGEROUS_INHERITED_ENV_PREFIXES.some((prefix) => upper.startsWith(prefix));
}
function isDangerousHostEnvOverrideVarName(rawKey) {
  const key = normalizeEnvVarKey(rawKey);
  if (!key) return false;
  const upper = key.toUpperCase();
  if (HOST_DANGEROUS_OVERRIDE_ENV_KEYS.has(upper)) return true;
  if (CARGO_TARGET_EXECUTABLE_OVERRIDE_ENV_KEY.test(upper)) return true;
  return HOST_DANGEROUS_OVERRIDE_ENV_PREFIXES.some((prefix) => upper.startsWith(prefix));
}
function listNormalizedEnvEntries(source, options) {
  const entries = [];
  for (const [rawKey, value] of Object.entries(source)) {
    if (typeof value !== "string") continue;
    const key = normalizeEnvVarKey(rawKey, options);
    if (!key) continue;
    entries.push([key, value]);
  }
  return entries;
}
function isPermissiveGitProtocolFromUserValue(value) {
  const normalized = value.trim().toLowerCase();
  if (normalized === "true" || normalized === "yes" || normalized === "on") return true;
  if (/^[+-]?\d+$/.test(normalized) && !/^[+-]?0+$/.test(normalized)) return true;
  return false;
}
function sanitizeInheritedGitAllowProtocolValue(value) {
  const normalized = value.trim();
  if (!normalized) return "";
  return normalized
    .split(":")
    .filter((protocol) => GIT_DEFAULT_ALWAYS_ALLOWED_PROTOCOLS.has(protocol))
    .join(":");
}
function sanitizeHostInheritedEnvEntry(rawKey, value) {
  const key = normalizeEnvVarKey(rawKey);
  if (!key) return null;
  if (key.toUpperCase() === GIT_ALLOW_PROTOCOL_ENV_KEY)
    return [key, sanitizeInheritedGitAllowProtocolValue(value)];
  if (key.toUpperCase() === GIT_PROTOCOL_FROM_USER_ENV_KEY)
    return [
      key,
      isPermissiveGitProtocolFromUserValue(value) ? GIT_PROTOCOL_FROM_USER_DISABLED_VALUE : value,
    ];
  if (isDangerousHostInheritedEnvVarName(key)) return null;
  return [key, value];
}
function sanitizeHostEnvOverridesWithDiagnostics(params) {
  const overrides = params?.overrides ?? void 0;
  if (!overrides)
    return {
      acceptedOverrides: void 0,
      rejectedOverrideBlockedKeys: [],
      rejectedOverrideInvalidKeys: [],
    };
  const blockPathOverrides = params?.blockPathOverrides ?? true;
  const acceptedOverrides = {};
  const rejectedBlocked = [];
  const rejectedInvalid = [];
  for (const [rawKey, value] of Object.entries(overrides)) {
    if (typeof value !== "string") continue;
    const normalized = normalizeHostOverrideEnvVarKey(rawKey);
    if (!normalized) {
      const candidate = rawKey.trim();
      rejectedInvalid.push(candidate || rawKey);
      continue;
    }
    const upper = normalized.toUpperCase();
    if (blockPathOverrides && upper === "PATH") {
      rejectedBlocked.push(upper);
      continue;
    }
    if (isDangerousHostEnvVarName(upper) || isDangerousHostEnvOverrideVarName(upper)) {
      rejectedBlocked.push(upper);
      continue;
    }
    acceptedOverrides[normalized] = value;
  }
  return {
    acceptedOverrides,
    rejectedOverrideBlockedKeys: sortUniqueStrings(rejectedBlocked),
    rejectedOverrideInvalidKeys: sortUniqueStrings(rejectedInvalid),
  };
}
function sanitizeHostExecEnvWithDiagnostics(params) {
  const baseEnv = params?.baseEnv ?? process.env;
  const merged = {};
  for (const [key, value] of listNormalizedEnvEntries(baseEnv)) {
    const sanitizedEntry = sanitizeHostInheritedEnvEntry(key, value);
    if (!sanitizedEntry) continue;
    const [sanitizedKey, sanitizedValue] = sanitizedEntry;
    merged[sanitizedKey] = sanitizedValue;
  }
  const overrideResult = sanitizeHostEnvOverridesWithDiagnostics({
    overrides: params?.overrides ?? void 0,
    blockPathOverrides: params?.blockPathOverrides ?? true,
  });
  if (overrideResult.acceptedOverrides)
    for (const [key, value] of Object.entries(overrideResult.acceptedOverrides))
      merged[key] = value;
  return {
    env: markOpenClawExecEnv(merged),
    rejectedOverrideBlockedKeys: overrideResult.rejectedOverrideBlockedKeys,
    rejectedOverrideInvalidKeys: overrideResult.rejectedOverrideInvalidKeys,
  };
}
function inspectHostExecEnvOverrides(params) {
  const result = sanitizeHostEnvOverridesWithDiagnostics(params);
  return {
    rejectedOverrideBlockedKeys: result.rejectedOverrideBlockedKeys,
    rejectedOverrideInvalidKeys: result.rejectedOverrideInvalidKeys,
  };
}
function sanitizeHostExecEnv(params) {
  return sanitizeHostExecEnvWithDiagnostics(params).env;
}
function sanitizeSystemRunEnvOverrides(params) {
  const overrides = params?.overrides ?? void 0;
  if (!overrides) return;
  if (!params?.shellWrapper) return overrides;
  const filtered = {};
  for (const [key, value] of listNormalizedEnvEntries(overrides, { portable: true })) {
    if (!isShellWrapperAllowedOverrideEnvVarName(key)) continue;
    filtered[key] = value;
  }
  return Object.keys(filtered).length > 0 ? filtered : void 0;
}
//#endregion
export {
  normalizeEnvVarKey as a,
  sanitizeHostExecEnvWithDiagnostics as c,
  isDangerousHostInheritedEnvVarName as i,
  sanitizeSystemRunEnvOverrides as l,
  isDangerousHostEnvOverrideVarName as n,
  normalizeHostOverrideEnvVarKey as o,
  isDangerousHostEnvVarName as r,
  sanitizeHostExecEnv as s,
  inspectHostExecEnvOverrides as t,
};
