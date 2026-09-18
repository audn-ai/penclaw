//#region src/flows/types.ts
/** Sorts UI flow contributions deterministically by visible label, then value. */
function sortFlowContributionsByLabel(contributions) {
  return [...contributions].toSorted(
    (left, right) =>
      left.option.label.localeCompare(right.option.label) ||
      left.option.value.localeCompare(right.option.value),
  );
}
//#endregion
export { sortFlowContributionsByLabel as t };
