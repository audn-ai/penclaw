//#region src/wizard/prompts.ts
var WizardCancelledError = class extends Error {
  constructor(message = "wizard cancelled") {
    super(message);
    this.name = "WizardCancelledError";
  }
};
var WizardNavigationError = class extends Error {
  constructor(direction) {
    super(`wizard navigate ${direction}`);
    this.direction = direction;
    this.name = "WizardNavigationError";
  }
};
//#endregion
export { WizardNavigationError as n, WizardCancelledError as t };
