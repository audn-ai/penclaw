//#region packages/agent-core/src/errors.ts
const TRANSCRIPT_NOT_CONTINUABLE_ERROR_CODE = "openclaw_transcript_not_continuable";
var TranscriptNotContinuableError = class extends Error {
  constructor(role) {
    super(`Cannot continue from message role: ${role}`);
    this.code = TRANSCRIPT_NOT_CONTINUABLE_ERROR_CODE;
    this.name = "TranscriptNotContinuableError";
    this.role = role;
  }
};
//#endregion
export { TranscriptNotContinuableError as n, TRANSCRIPT_NOT_CONTINUABLE_ERROR_CODE as t };
