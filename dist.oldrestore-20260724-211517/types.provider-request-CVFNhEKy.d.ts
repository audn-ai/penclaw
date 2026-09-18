import { d as SecretInput } from "./types.secrets-C15Z_eLX.js";

//#region src/config/types.sandbox.d.ts
type SandboxDockerSettings = {
  /** Docker image to use for sandbox containers. */ image?: string /** Prefix for sandbox container names. */;
  containerPrefix?: string /** Container workdir mount path (default: /workspace). */;
  workdir?: string /** Run container rootfs read-only. */;
  readOnlyRoot?: boolean /** Extra tmpfs mounts for read-only containers. */;
  tmpfs?: string[] /** Container network mode (bridge|none|custom). */;
  network?: string;
  /**
   * OCI runtime selector ("runc" | "runsc" | etc.). Defaults to docker daemon's
   * runc. Set to "runsc" to route container syscalls through gVisor's userspace
   * kernel — neutralizes host kernel-CVE escape paths because tenant syscalls
   * never reach the host kernel. [INCIDENT-2026-05-02 gVisor]
   */
  runtime?: string /** Container user (uid:gid). */;
  user?: string /** Drop Linux capabilities. */;
  capDrop?: string[] /** Add Linux capabilities (e.g. NET_ADMIN for VPN). */;
  capAdd?: string[] /** Pass host devices into the container (e.g. /dev/ppp:/dev/ppp). */;
  devices?: string[] /** Explicit environment variables for sandbox container creation and exec. */;
  env?: Record<
    string,
    string
  > /** Optional setup command run once after container creation (array entries are joined by newline). */;
  setupCommand?: string /** Limit container PIDs (0 = Docker default). */;
  pidsLimit?: number /** Limit container memory (e.g. 512m, 2g, or bytes as number). */;
  memory?: string | number /** Limit container memory swap (same format as memory). */;
  memorySwap?: string | number /** Limit container CPU shares (e.g. 0.5, 1, 2). */;
  cpus?: number /** GPU devices to expose via Docker --gpus (e.g. "all", "device=GPU-uuid"). */;
  gpus?: string;
  /**
   * Set ulimit values by name (e.g. nofile, nproc).
   * Use "soft:hard" string, a number, or { soft, hard }.
   */
  ulimits?: Record<
    string,
    | string
    | number
    | {
        soft?: number;
        hard?: number;
      }
  > /** Seccomp profile (path or profile name). */;
  seccompProfile?: string /** AppArmor profile name. */;
  apparmorProfile?: string /** DNS servers (e.g. ["1.1.1.1", "8.8.8.8"]). */;
  dns?: string[] /** Extra host mappings (e.g. ["api.local:10.0.0.2"]). */;
  extraHosts?: string[] /** Publish container ports to the host (e.g. ["4444:4444", "8080:8080"]). Maps to docker -p flags. */;
  ports?: string[] /** Additional bind mounts (host:container:mode format, e.g. ["/host/path:/container/path:rw"]). */;
  binds?: string[];
  /**
   * Dangerous override: allow bind mounts that target reserved container paths
   * like /workspace or /agent.
   */
  dangerouslyAllowReservedContainerTargets?: boolean;
  /**
   * Dangerous override: allow bind mount sources outside runtime allowlisted roots
   * (workspace + agent workspace roots).
   */
  dangerouslyAllowExternalBindSources?: boolean;
  /**
   * Dangerous override: allow Docker `network: "container:<id>"` namespace joins.
   * Default behavior blocks container namespace joins to preserve sandbox isolation.
   */
  dangerouslyAllowContainerNamespaceJoin?: boolean;
};
type SandboxBrowserSettings = {
  enabled?: boolean;
  image?: string;
  containerPrefix?: string /** Docker network for sandbox browser containers (default: openclaw-sandbox-browser). */;
  network?: string;
  cdpPort?: number /** Optional CIDR allowlist for CDP ingress at the container edge (for example: 172.21.0.1/32). */;
  cdpSourceRange?: string;
  vncPort?: number;
  noVncPort?: number;
  headless?: boolean;
  enableNoVnc?: boolean;
  /**
   * Allow sandboxed sessions to target the host browser control server.
   * Default: false.
   */
  allowHostControl?: boolean;
  /**
   * When true (default), sandboxed browser control will try to start/reattach to
   * the sandbox browser container when a tool call needs it.
   */
  autoStart?: boolean /** Max time to wait for CDP to become reachable after auto-start (ms). */;
  autoStartTimeoutMs?: number /** Additional bind mounts for the browser container only. When set, replaces docker.binds for the browser container. */;
  binds?: string[];
};
type SandboxPruneSettings = {
  /** Prune if idle for more than N hours (0 disables). */ idleHours?: number /** Prune if older than N days (0 disables). */;
  maxAgeDays?: number;
};
type SandboxSshSettings = {
  /** SSH target in user@host[:port] form. */ target?: string /** SSH client command. Default: "ssh". */;
  command?: string /** Absolute remote root used for per-scope workspaces. */;
  workspaceRoot?: string /** Enforce host-key verification. Default: true. */;
  strictHostKeyChecking?: boolean /** Allow OpenSSH host-key updates. Default: true. */;
  updateHostKeys?: boolean /** Existing private key path on the host. */;
  identityFile?: string /** Existing SSH certificate path on the host. */;
  certificateFile?: string /** Existing known_hosts file path on the host. */;
  knownHostsFile?: string /** Inline or SecretRef-backed private key contents. */;
  identityData?: SecretInput /** Inline or SecretRef-backed SSH certificate contents. */;
  certificateData?: SecretInput /** Inline or SecretRef-backed known_hosts contents. */;
  knownHostsData?: SecretInput;
};
//#endregion
//#region src/config/types.agents-shared.d.ts
/** Agent model selector: a single provider/model ref or primary+fallback chain. */
type AgentModelConfig =
  | string
  | {
      /** Primary model (provider/model). */ primary?: string /** Per-agent model fallbacks (provider/model). */;
      fallbacks?: string[];
    };
/** Tool-specific model selector with an optional capability timeout override. */
type AgentToolModelConfig =
  | string
  | {
      /** Primary model (provider/model). */ primary?: string /** Per-tool model fallbacks (provider/model). */;
      fallbacks?: string[] /** Optional provider request timeout in milliseconds for capabilities that support it. */;
      timeoutMs?: number;
    };
/** Runtime selection policy attached to providers, models, and agent defaults. */
type AgentRuntimePolicyConfig = {
  /** Agent runtime id. Omitted uses "openclaw"; "auto" opts into plugin harness auto-selection. */ id?: string;
};
/** Per-agent sandbox policy shared by embedded agents and sandbox backends. */
type AgentSandboxConfig = {
  /** Sandbox activation mode for this agent. */ mode?:
    | "off"
    | "non-main"
    | "all" /** Sandbox runtime backend id. Default: "docker". */;
  backend?: string /** Agent workspace access inside the sandbox. */;
  workspaceAccess?: "none" | "ro" | "rw";
  /**
   * Session tools visibility for sandboxed sessions.
   * - "spawned": only allow session tools to target sessions spawned from this session (default)
   * - "all": allow session tools to target any session
   */
  sessionToolsVisibility?:
    | "spawned"
    | "all" /** Container/workspace scope for sandbox isolation. */;
  scope?:
    | "session"
    | "agent"
    | "shared" /** Host workspace root mounted or copied into the sandbox. */;
  workspaceRoot?: string /** Docker-specific sandbox settings. */;
  docker?: SandboxDockerSettings /** SSH-specific sandbox settings. */;
  ssh?: SandboxSshSettings /** Optional sandboxed browser settings. */;
  browser?: SandboxBrowserSettings /** Auto-prune sandbox settings. */;
  prune?: SandboxPruneSettings;
};
//#endregion
//#region src/config/types.provider-request.d.ts
/** Authentication override applied to provider requests after model/provider defaults resolve. */
type ConfiguredProviderRequestAuth =
  | {
      mode: "provider-default";
    }
  | {
      mode: "authorization-bearer";
      token: SecretInput;
    }
  | {
      mode: "header";
      headerName: string;
      value: SecretInput;
      prefix?: string;
    };
/** TLS material and verification knobs for provider or proxy connections. */
type ConfiguredProviderRequestTls = {
  ca?: SecretInput;
  cert?: SecretInput;
  key?: SecretInput;
  passphrase?: SecretInput;
  serverName?: string;
  insecureSkipVerify?: boolean;
};
/** Proxy selection for provider requests, including optional TLS settings for proxy transport. */
type ConfiguredProviderRequestProxy =
  | {
      mode: "env-proxy";
      tls?: ConfiguredProviderRequestTls;
    }
  | {
      mode: "explicit-proxy";
      url: string;
      tls?: ConfiguredProviderRequestTls;
    };
/** Shared provider request overrides used by model providers and media/tool providers. */
type ConfiguredProviderRequest = {
  headers?: Record<string, SecretInput>;
  auth?: ConfiguredProviderRequestAuth;
  proxy?: ConfiguredProviderRequestProxy;
  tls?: ConfiguredProviderRequestTls;
};
/** Model-provider request overrides plus the private-network opt-in used by model transports. */
type ConfiguredModelProviderRequest = ConfiguredProviderRequest & {
  allowPrivateNetwork?: boolean;
};
//#endregion
export {
  ConfiguredProviderRequestTls as a,
  AgentSandboxConfig as c,
  SandboxDockerSettings as d,
  SandboxPruneSettings as f,
  ConfiguredProviderRequestProxy as i,
  AgentToolModelConfig as l,
  ConfiguredProviderRequest as n,
  AgentModelConfig as o,
  SandboxSshSettings as p,
  ConfiguredProviderRequestAuth as r,
  AgentRuntimePolicyConfig as s,
  ConfiguredModelProviderRequest as t,
  SandboxBrowserSettings as u,
};
