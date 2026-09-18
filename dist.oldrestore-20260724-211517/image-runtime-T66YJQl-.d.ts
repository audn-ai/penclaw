import {
  i as ImageDescriptionResult,
  o as ImagesDescriptionRequest,
  r as ImageDescriptionRequest,
  s as ImagesDescriptionResult,
} from "./types-Bp5h7fLi.js";
import { f as Model, u as MaybePromise } from "./types-CqrbBnUB.js";

//#region src/media-understanding/image-runtime.d.ts
/** Describes one image through the configured media runtime. */
declare const describeImageWithModel: (
  params: ImageDescriptionRequest,
) => Promise<ImageDescriptionResult>;
/** Describes multiple images through the configured media runtime. */
declare const describeImagesWithModel: (
  params: ImagesDescriptionRequest,
) => Promise<ImagesDescriptionResult>;
/** Describes one image after applying the runtime payload transform. */
declare const describeImageWithModelPayloadTransform: (
  params: ImageDescriptionRequest,
  onPayload: ((payload: unknown, model: Model) => MaybePromise<unknown>) | undefined,
) => Promise<ImageDescriptionResult>;
/** Describes multiple images after applying the runtime payload transform. */
declare const describeImagesWithModelPayloadTransform: (
  params: ImagesDescriptionRequest,
  onPayload: ((payload: unknown, model: Model) => MaybePromise<unknown>) | undefined,
) => Promise<ImagesDescriptionResult>;
//#endregion
export {
  describeImagesWithModelPayloadTransform as i,
  describeImageWithModelPayloadTransform as n,
  describeImagesWithModel as r,
  describeImageWithModel as t,
};
