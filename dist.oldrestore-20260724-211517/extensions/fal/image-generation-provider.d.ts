import { a as fetchWithSsrFGuard } from "../../fetch-guard-BKvfwdRa.js";
import { l as ImageGenerationProvider } from "../../types-CVRxRIni.js";
//#region extensions/fal/image-generation-provider.d.ts
declare function setFalFetchGuardForTesting(impl: typeof fetchWithSsrFGuard | null): void;
declare function buildFalImageGenerationProvider(): ImageGenerationProvider;
//#endregion
export { buildFalImageGenerationProvider, setFalFetchGuardForTesting };
