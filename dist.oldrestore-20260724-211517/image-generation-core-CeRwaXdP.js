import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import "./subsystem-Nlw-XKx1.js";
import "./provider-env-vars-BZiQzob_.js";
import "./failover-error-CYvhrluQ.js";
import "./runtime-shared-BteOJ5rc.js";
import "./provider-registry-De0ZcoY9.js";
import "./provider-model-shared-CYlCpWlu.js";
//#region src/plugin-sdk/image-generation-core.ts
/** Default OpenAI image model used when image-generation provider config omits one. */
const OPENAI_DEFAULT_IMAGE_MODEL = "gpt-image-2";
const loadImageGenerationCoreAuthRuntime = createLazyRuntimeModule(
  () => import("./image-generation-core.auth.runtime.js"),
);
/** Resolve image-generation provider API keys through the lazy auth runtime helper. */
async function resolveApiKeyForProvider(...args) {
  return (await loadImageGenerationCoreAuthRuntime()).resolveApiKeyForProvider(...args);
}
//#endregion
export { resolveApiKeyForProvider as n, OPENAI_DEFAULT_IMAGE_MODEL as t };
