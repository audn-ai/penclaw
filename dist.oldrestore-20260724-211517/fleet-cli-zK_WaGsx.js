import { InvalidArgumentError } from "commander";
import { y as validateDiskSize } from "./cell-profile-C89hQfv6.js";
import { r as parseStrictPositiveIntOption, t as collectOption } from "./helpers-WGaRKVcg.js";
import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
//#region src/cli/fleet-cli/register.ts
const fleetRuntimeLoader = createLazyImportLoader(() => import("./commands.runtime-ALf93BSe.js"));
function loadFleetRuntime() {
  return fleetRuntimeLoader.load();
}
function parseContainerRuntime(value) {
  if (value === "docker" || value === "podman") return value;
  throw new InvalidArgumentError("--runtime must be docker or podman.");
}
function parsePort(value) {
  const port = parseStrictPositiveIntOption(value, "--port");
  if (port > 65535) throw new InvalidArgumentError("--port must be between 1 and 65535.");
  return port;
}
function parseCpus(value) {
  const cpus = Number(value);
  if (!Number.isFinite(cpus) || cpus <= 0)
    throw new InvalidArgumentError("--cpus must be a positive number.");
  return value;
}
function parseDisk(value) {
  try {
    return validateDiskSize(value);
  } catch (error) {
    throw new InvalidArgumentError(
      error instanceof Error ? error.message : "Invalid --disk value.",
    );
  }
}
function parseNetwork(value) {
  if (value === "bridge" || value === "internal") return value;
  throw new InvalidArgumentError("--network must be bridge or internal.");
}
function registerFleetCli(program) {
  const fleet = program
    .command("fleet")
    .description("Provision and manage isolated tenant cells (experimental)");
  fleet
    .command("create")
    .description("Create an isolated tenant cell")
    .argument("<tenant>", "Tenant slug")
    .option("--image <ref>", "Container image", "ghcr.io/openclaw/openclaw:latest")
    .option(
      "--runtime <runtime>",
      "Container runtime (docker or podman)",
      parseContainerRuntime,
      "docker",
    )
    .option("--port <port>", "Host loopback port (default: allocate from 19100)", parsePort)
    .option("--memory <limit>", "Container memory limit", "2g")
    .option("--cpus <count>", "Container CPU limit", parseCpus, "2")
    .option(
      "--disk <size>",
      "Cap the container writable layer (requires overlay2+XFS pquota, btrfs, or zfs)",
      parseDisk,
    )
    .option(
      "--network <mode>",
      "Container egress network (bridge or internal)",
      parseNetwork,
      "bridge",
    )
    .option(
      "--pids-limit <count>",
      "Container process limit",
      (value) => parseStrictPositiveIntOption(value, "--pids-limit"),
      512,
    )
    .option("--env <KEY=VAL>", "Pass an environment variable to the cell", collectOption, [])
    .option("--gateway-token <token>", "Use an existing Gateway token")
    .option("--no-start", "Create the container without starting it")
    .option("--json", "Output JSON", false)
    .action(async (tenant, options) => {
      await (
        await loadFleetRuntime()
      ).runFleetCreateCommand({
        tenant,
        ...options,
      });
    });
  fleet
    .command("backup")
    .description("Back up one tenant cell as a host operator (archive contains secrets)")
    .argument("<tenant>", "Tenant slug")
    .option("--out <path>", "Archive output path or directory")
    .option("--max-bytes <bytes>", "Maximum archive input bytes", (value) =>
      parseStrictPositiveIntOption(value, "--max-bytes"),
    )
    .option("--json", "Output JSON", false)
    .action(async (tenant, options) => {
      await (
        await loadFleetRuntime()
      ).runFleetBackupCommand({
        tenant,
        ...options,
      });
    });
  fleet
    .command("restore")
    .description("Restore one tenant cell as a host operator (archive contains secrets)")
    .argument("<tenant>", "Tenant slug")
    .requiredOption("--from <path>", "Fleet backup archive")
    .option("--force", "Stop a running cell and replace its state", false)
    .option("--max-bytes <bytes>", "Maximum extracted bytes", (value) =>
      parseStrictPositiveIntOption(value, "--max-bytes"),
    )
    .option("--json", "Output JSON", false)
    .action(async (tenant, options) => {
      await (
        await loadFleetRuntime()
      ).runFleetRestoreCommand({
        tenant,
        ...options,
      });
    });
  fleet
    .command("doctor")
    .description("Audit fleet cells without changing them")
    .argument("[tenant]", "Tenant slug")
    .option("--json", "Output JSON", false)
    .action(async (tenant, options) => {
      await (
        await loadFleetRuntime()
      ).runFleetDoctorCommand({
        tenant,
        ...options,
      });
    });
  fleet
    .command("list")
    .alias("ls")
    .description("List tenant cells")
    .option("--json", "Output JSON", false)
    .action(async (options) => {
      await (await loadFleetRuntime()).runFleetListCommand(options);
    });
  fleet
    .command("status")
    .description("Show tenant cell status")
    .argument("<tenant>", "Tenant slug")
    .option("--json", "Output JSON", false)
    .action(async (tenant, options) => {
      await (
        await loadFleetRuntime()
      ).runFleetStatusCommand({
        tenant,
        ...options,
      });
    });
  fleet
    .command("logs")
    .description("Stream tenant cell container logs")
    .argument("<tenant>", "Tenant slug")
    .option("--follow", "Follow log output", false)
    .option("--tail <count>", "Number of lines to show", (value) =>
      parseStrictPositiveIntOption(value, "--tail"),
    )
    .option("--since <value>", "Show logs since a duration or timestamp")
    .action(async (tenant, options) => {
      await (
        await loadFleetRuntime()
      ).runFleetLogsCommand({
        tenant,
        ...options,
      });
    });
  for (const action of ["start", "stop", "restart"])
    fleet
      .command(action)
      .description(`${action[0]?.toUpperCase()}${action.slice(1)} a tenant cell`)
      .argument("<tenant>", "Tenant slug")
      .action(async (tenant) => {
        await (
          await loadFleetRuntime()
        ).runFleetLifecycleCommand({
          action,
          tenant,
        });
      });
  fleet
    .command("upgrade")
    .description("Replace a tenant cell with a freshly pulled image")
    .argument("<tenant>", "Tenant slug")
    .option("--image <ref>", "Replacement image (default: recorded image)")
    .action(async (tenant, options) => {
      await (
        await loadFleetRuntime()
      ).runFleetUpgradeCommand({
        tenant,
        ...options,
      });
    });
  fleet
    .command("rm")
    .description("Remove a tenant cell")
    .argument("<tenant>", "Tenant slug")
    .option("--purge-data", "Delete the tenant data directory", false)
    .option("--force", "Remove a running cell", false)
    .action(async (tenant, options) => {
      await (
        await loadFleetRuntime()
      ).runFleetRemoveCommand({
        tenant,
        ...options,
      });
    });
}
//#endregion
export { registerFleetCli };
