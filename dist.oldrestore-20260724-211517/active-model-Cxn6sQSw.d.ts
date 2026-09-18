//#region packages/media-understanding-common/src/active-model.d.ts
/** Provider/model pair selected for one media-understanding request. */
type ActiveMediaModel = {
  provider: string;
  model?: string;
};
//#endregion
export { ActiveMediaModel as t };
