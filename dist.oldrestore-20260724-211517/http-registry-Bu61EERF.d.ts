import { IncomingMessage, ServerResponse } from "node:http";
import { t as PluginHttpRouteRegistration } from "./registry-BfvmasfL.js";
import { n as PluginRegistry } from "./registry-types-zrUDhE8t.js";

//#region src/plugins/http-registry.d.ts
type PluginHttpRouteHandler = (
  req: IncomingMessage,
  res: ServerResponse,
) => Promise<boolean | void> | boolean | void;
declare function withPluginHttpRouteRegistry<T>(registry: PluginRegistry, run: () => T): T;
declare function registerPluginHttpRoute(params: {
  path?: string | null;
  fallbackPath?: string | null;
  handler: PluginHttpRouteHandler;
  auth: PluginHttpRouteRegistration["auth"];
  match?: PluginHttpRouteRegistration["match"];
  gatewayRuntimeScopeSurface?: PluginHttpRouteRegistration["gatewayRuntimeScopeSurface"];
  replaceExisting?: boolean;
  pluginId?: string;
  source?: string;
  accountId?: string;
  log?: (message: string) => void;
  registry?: PluginRegistry;
}): () => void;
//#endregion
export {
  registerPluginHttpRoute as n,
  withPluginHttpRouteRegistry as r,
  PluginHttpRouteHandler as t,
};
