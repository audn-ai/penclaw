import { f as AgentToolResult } from "./types-JQFrjdua.js";
//#region src/agents/tools/tool-results.d.ts
declare function textResult<TDetails>(text: string, details: TDetails): AgentToolResult<TDetails>;
declare function jsonResult<TDetails>(payload: TDetails): AgentToolResult<TDetails>;
//#endregion
export { textResult as n, jsonResult as t };
