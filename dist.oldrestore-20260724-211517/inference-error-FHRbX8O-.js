//#region src/crestodian/inference-error.ts
/** Safe public error for a Crestodian turn that could not complete with intelligence. */
var CrestodianInferenceUnavailableError = class extends Error {
  constructor(stage, failures = []) {
    super(
      "Crestodian could not reach working inference. Run `openclaw onboard` to reconnect and live-test AI, then try again.",
    );
    this.stage = stage;
    this.failures = failures;
    this.code = "CRESTODIAN_INFERENCE_UNAVAILABLE";
    this.name = "CrestodianInferenceUnavailableError";
  }
};
function isCrestodianInferenceUnavailableError(error) {
  return (
    error instanceof CrestodianInferenceUnavailableError ||
    (error instanceof Error && "code" in error && error.code === "CRESTODIAN_INFERENCE_UNAVAILABLE")
  );
}
//#endregion
export { isCrestodianInferenceUnavailableError as n, CrestodianInferenceUnavailableError as t };
