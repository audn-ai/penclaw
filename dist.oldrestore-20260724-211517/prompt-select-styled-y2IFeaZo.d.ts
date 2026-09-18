import { select } from "@clack/prompts";

//#region packages/terminal-core/src/prompt-select-styled.d.ts
/** Run a clack select prompt with styled message and hints. */
declare function selectStyled<T>(params: Parameters<typeof select<T>>[0]): Promise<symbol | T>;
//#endregion
export { selectStyled as t };
