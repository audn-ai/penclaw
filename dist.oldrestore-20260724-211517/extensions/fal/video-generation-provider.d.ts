import { a as fetchWithSsrFGuard } from "../../fetch-guard-BKvfwdRa.js";
import { s as VideoGenerationProvider } from "../../video-generation-CbPqXC2P.js";
//#region extensions/fal/video-generation-provider.d.ts
declare function setFalVideoFetchGuardForTesting(impl: typeof fetchWithSsrFGuard | null): void;
declare function buildFalVideoGenerationProvider(): VideoGenerationProvider;
//#endregion
export { buildFalVideoGenerationProvider, setFalVideoFetchGuardForTesting };
