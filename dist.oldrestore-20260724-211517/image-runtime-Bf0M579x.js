import {
  n as createLazyRuntimeMethodBinder,
  r as createLazyRuntimeModule,
} from "./lazy-runtime-B-Fc-m0I.js";
//#region src/media-understanding/image-runtime.ts
const bindImageRuntime = createLazyRuntimeMethodBinder(
  createLazyRuntimeModule(() => import("./image-DiVZyLXR.js")),
);
/** Describes one image through the configured media runtime. */
const describeImageWithModel = bindImageRuntime((runtime) => runtime.describeImageWithModel);
/** Describes multiple images through the configured media runtime. */
const describeImagesWithModel = bindImageRuntime((runtime) => runtime.describeImagesWithModel);
/** Describes one image after applying the runtime payload transform. */
const describeImageWithModelPayloadTransform = bindImageRuntime(
  (runtime) => runtime.describeImageWithModelPayloadTransform,
);
/** Describes multiple images after applying the runtime payload transform. */
const describeImagesWithModelPayloadTransform = bindImageRuntime(
  (runtime) => runtime.describeImagesWithModelPayloadTransform,
);
//#endregion
export {
  describeImagesWithModelPayloadTransform as i,
  describeImageWithModelPayloadTransform as n,
  describeImagesWithModel as r,
  describeImageWithModel as t,
};
