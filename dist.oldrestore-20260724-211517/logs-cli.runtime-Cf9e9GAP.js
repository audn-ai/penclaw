import { o as buildGatewayConnectionDetails } from "./call-BVMO6az_.js";
import { p as resolveGatewaySystemdServiceName } from "./constants-obO8goqF.js";
import { r as runCommandWithTimeout } from "./exec-CXKmx4dL.js";
import { c as readSystemdServiceRuntime } from "./systemd-BI3sgDKJ.js";
//#region src/cli/logs-cli.runtime.ts
const STDERR_MAX_BYTES = 64 * 1024;
async function execFileUtf8Tail(command, args, options) {
  try {
    const result = await runCommandWithTimeout([command, ...args], {
      baseEnv: options.env,
      maxOutputBytes: {
        stdout: options.maxBytes,
        stderr: STDERR_MAX_BYTES,
      },
    });
    return {
      stdout: result.stdout,
      stderr: result.stderr,
      code: result.code ?? 1,
      truncated: Boolean(result.stdoutTruncatedBytes),
    };
  } catch (error) {
    return {
      stdout: "",
      stderr: error instanceof Error ? error.message : String(error),
      code: 1,
      truncated: false,
    };
  }
}
//#endregion
export {
  buildGatewayConnectionDetails,
  execFileUtf8Tail,
  readSystemdServiceRuntime,
  resolveGatewaySystemdServiceName,
};
