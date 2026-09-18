import { confirm, select } from "@clack/prompts";
import {
  n as resolveDoctorRepairMode,
  r as shouldAutoApproveDoctorFix,
} from "./doctor-repair-mode-DtuLXARs.js";
import { a as guardCancel } from "./onboard-helpers-CUS3BGDx.js";
import { t as styleSelectParams } from "./prompt-select-styled-params-CvMQXWIw.js";
import { n as stylePromptMessage } from "./prompt-style-BQVvtDcR.js";
//#region src/commands/doctor-prompter.ts
/** Doctor prompt adapter that centralizes repair, force, update, and noninteractive behavior. */
/** Creates a doctor prompter honoring --fix, --yes, --force, noninteractive, and update modes. */
function createDoctorPrompter(params) {
  const repairMode = resolveDoctorRepairMode(params.options);
  const confirmDefault = async (p) => {
    if (shouldAutoApproveDoctorFix(repairMode)) return true;
    if (repairMode.nonInteractive) return false;
    if (!repairMode.canPrompt) return p.initialValue ?? false;
    return guardCancel(
      await confirm({
        ...p,
        message: stylePromptMessage(p.message),
      }),
      params.runtime,
      130,
    );
  };
  return {
    confirm: confirmDefault,
    confirmAutoFix: confirmDefault,
    confirmAggressiveAutoFix: async (p) => {
      if (shouldAutoApproveDoctorFix(repairMode, { requiresForce: true })) return true;
      if (repairMode.nonInteractive) return false;
      if (repairMode.shouldRepair && !repairMode.shouldForce) return false;
      if (!repairMode.canPrompt) return p.initialValue ?? false;
      return guardCancel(
        await confirm({
          ...p,
          message: stylePromptMessage(p.message),
        }),
        params.runtime,
        130,
      );
    },
    confirmRuntimeRepair: async (p) => {
      const { requiresInteractiveConfirmation, ...confirmParams } = p;
      if (
        requiresInteractiveConfirmation !== true &&
        shouldAutoApproveDoctorFix(repairMode, { blockDuringUpdate: true })
      )
        return true;
      if (requiresInteractiveConfirmation === true && !repairMode.canPrompt) return false;
      if (repairMode.nonInteractive) return false;
      if (!repairMode.canPrompt) return confirmParams.initialValue ?? false;
      return guardCancel(
        await confirm({
          ...confirmParams,
          message: stylePromptMessage(confirmParams.message),
        }),
        params.runtime,
        130,
      );
    },
    select: async (p, fallback) => {
      if (!repairMode.canPrompt || repairMode.shouldRepair) return fallback;
      return guardCancel(await select(styleSelectParams(p)), params.runtime, 130);
    },
    shouldRepair: repairMode.shouldRepair,
    shouldForce: repairMode.shouldForce,
    repairMode,
  };
}
//#endregion
export { createDoctorPrompter };
