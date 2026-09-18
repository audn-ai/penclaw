import net from "node:net";
import { o as isErrno } from "./errors-BoHeli7m.js";
//#region src/infra/ports-probe.ts
const PORT_PROBE_HOSTS = ["127.0.0.1", "0.0.0.0", "::1", "::"];
/** Opens and closes a temporary listener to verify that a port can be bound. */
async function tryListenOnPort(params) {
  const listenOptions = { port: params.port };
  if (params.host) listenOptions.host = params.host;
  if (typeof params.exclusive === "boolean") listenOptions.exclusive = params.exclusive;
  await new Promise((resolve, reject) => {
    const tester = net
      .createServer()
      .once("error", (err) => reject(err))
      .once("listening", () => {
        tester.close(() => resolve());
      })
      .listen(listenOptions);
  });
}
async function probePortOnHost(port, host) {
  try {
    await tryListenOnPort({
      port,
      host,
      exclusive: true,
    });
    return "free";
  } catch (err) {
    if (isErrno(err) && err.code === "EADDRINUSE") return "busy";
    if (isErrno(err) && (err.code === "EADDRNOTAVAIL" || err.code === "EAFNOSUPPORT"))
      return "skip";
    return "unknown";
  }
}
/** Checks all supported local address families without resolving listener diagnostics. */
async function probePortUsage(port) {
  let sawUnknown = false;
  for (const host of PORT_PROBE_HOSTS) {
    const result = await probePortOnHost(port, host);
    if (result === "busy") return "busy";
    if (result === "unknown") sawUnknown = true;
  }
  return sawUnknown ? "unknown" : "free";
}
//#endregion
export { tryListenOnPort as n, probePortUsage as t };
