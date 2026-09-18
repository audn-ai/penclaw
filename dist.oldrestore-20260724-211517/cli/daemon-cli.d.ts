import { Command } from "commander";

//#region src/cli/daemon-cli/register.d.ts
/** Register the legacy daemon command group. */
declare function registerDaemonCli(program: Command): void;
//#endregion
//#region src/cli/daemon-cli/register-service-commands.d.ts
/** Attach Gateway service status/install/lifecycle subcommands to a parent command. */
declare function addGatewayServiceCommands(
  parent: Command,
  opts?: {
    statusDescription?: string;
  },
): void;
//#endregion
//#region src/daemon/inspect.d.ts
type FindExtraGatewayServicesOptions = {
  deep?: boolean;
};
//#endregion
//#region src/cli/daemon-cli/types.d.ts
/** RPC probe options accepted by Gateway service status commands. */
type GatewayRpcOpts = {
  url?: string;
  token?: string;
  password?: string;
  timeout?: string;
  json?: boolean;
};
/** Full option bag for Gateway service status. */
type DaemonStatusOptions = {
  rpc: GatewayRpcOpts;
  probe: boolean;
  requireRpc: boolean;
  json: boolean;
} & FindExtraGatewayServicesOptions;
/** Options for installing or rewriting the Gateway service. */
type DaemonInstallOptions = {
  port?: string | number;
  runtime?: string;
  token?: string;
  wrapper?: string;
  force?: boolean;
  json?: boolean;
};
/** Options shared by service start/stop/restart/uninstall commands. */
type DaemonLifecycleOptions = {
  json?: boolean;
  force?: boolean;
  safe?: boolean;
  skipDeferral?: boolean;
  wait?: string;
  disable?: boolean;
};
//#endregion
//#region src/cli/daemon-cli/install.d.ts
/** Install or refresh the managed Gateway service. */
declare function runDaemonInstall(opts: DaemonInstallOptions): Promise<void>;
//#endregion
//#region src/cli/daemon-cli/lifecycle.d.ts
/** Uninstall the managed Gateway service after stopping it. */
declare function runDaemonUninstall(opts?: DaemonLifecycleOptions): Promise<void>;
/** Start the managed Gateway service, repairing stale service definitions when possible. */
declare function runDaemonStart(opts?: DaemonLifecycleOptions): Promise<void>;
/** Stop the managed Gateway service or verified unmanaged listener fallback. */
declare function runDaemonStop(opts?: DaemonLifecycleOptions): Promise<void>;
/** Restart the Gateway service or a verified unmanaged listener, then prove health. */
declare function runDaemonRestart(opts?: DaemonLifecycleOptions): Promise<boolean>;
//#endregion
//#region src/cli/daemon-cli/status.d.ts
/** Run Gateway status diagnostics and apply --require-rpc exit behavior. */
declare function runDaemonStatus(opts: DaemonStatusOptions): Promise<void>;
//#endregion
export {
  type DaemonInstallOptions,
  type DaemonStatusOptions,
  type GatewayRpcOpts,
  addGatewayServiceCommands,
  registerDaemonCli,
  runDaemonInstall,
  runDaemonRestart,
  runDaemonStart,
  runDaemonStatus,
  runDaemonStop,
  runDaemonUninstall,
};
