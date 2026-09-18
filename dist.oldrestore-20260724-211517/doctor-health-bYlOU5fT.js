import { intro, outro } from "@clack/prompts";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { r as stylePromptTitle } from "./prompt-style-BQVvtDcR.js";
//#region src/flows/doctor-health.ts
const intro$1 = (message) => intro(stylePromptTitle(message) ?? message);
const outro$1 = (message) => outro(stylePromptTitle(message) ?? message);
const loadConfigModule = createLazyRuntimeModule(() => import("./config/config.js"));
/** Runs the full interactive doctor flow against the provided or default runtime. */
async function doctorCommand(runtime, options = {}) {
  const effectiveRuntime = runtime ?? (await import("./runtime-Dvam4E8I.js")).defaultRuntime;
  if (options.repair === true || options.yes === true || options.generateGatewayToken === true) {
    const { assertConfigWriteAllowedInCurrentMode } = await loadConfigModule();
    assertConfigWriteAllowedInCurrentMode();
  }
  const { createDoctorPrompter } = await import("./doctor-prompter-D74ZLThu.js");
  const prompter = createDoctorPrompter({
    runtime: effectiveRuntime,
    options,
  });
  intro$1("OpenClaw doctor");
  const { resolveOpenClawPackageRoot } = await import("./openclaw-root-BTdHor8F.js");
  const root = await resolveOpenClawPackageRoot({
    moduleUrl: import.meta.url,
    argv1: process.argv[1],
    cwd: process.cwd(),
  });
  const { maybeOfferUpdateBeforeDoctor } = await import("./doctor-update-DmzpPlKD.js");
  if (
    (
      await maybeOfferUpdateBeforeDoctor({
        runtime: effectiveRuntime,
        options,
        root,
        confirm: (p) => prompter.confirm(p),
        outro: outro$1,
      })
    ).handled
  )
    return;
  const { maybeRepairUiProtocolFreshness } = await import("./doctor-ui-FhlW7Ynm.js");
  const { noteSourceInstallIssues } = await import("./doctor-install-BvMnUYv1.js");
  const { noteStalePluginRuntimeSymlinks } = await import("./plugin-runtime-symlinks-DNYzdFo-.js");
  const { noteStartupOptimizationHints } = await import("./doctor-platform-notes-CRE_5TcP.js");
  await maybeRepairUiProtocolFreshness(effectiveRuntime, prompter);
  noteSourceInstallIssues(root);
  await noteStalePluginRuntimeSymlinks(root);
  noteStartupOptimizationHints();
  const { loadAndMaybeMigrateDoctorConfig } = await import("./doctor-config-flow-RZKLU137.js");
  const configResult = await loadAndMaybeMigrateDoctorConfig({
    options,
    confirm: (p) => prompter.confirm(p),
    runtime: effectiveRuntime,
    prompter,
  });
  const { CONFIG_PATH } = await loadConfigModule();
  const ctx = {
    runtime: effectiveRuntime,
    options,
    prompter,
    configResult,
    cfg: configResult.cfg,
    cfgForPersistence: structuredClone(configResult.cfg),
    sourceConfigValid: configResult.sourceConfigValid ?? true,
    configPath: configResult.path ?? CONFIG_PATH,
  };
  const { runDoctorHealthContributions } =
    await import("./doctor-health-contributions-BKpQv2gh.js");
  await runDoctorHealthContributions(ctx);
  if (ctx.postInstallDoctorResult) {
    const {
      UPDATE_POST_INSTALL_DOCTOR_ADVISORY_EXIT_CODE,
      UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV,
      writeUpdatePostInstallDoctorResult,
    } = await import("./update-doctor-result-DwVp1JR5.js");
    const resultPath = process.env[UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV]?.trim();
    if (resultPath) {
      await writeUpdatePostInstallDoctorResult({
        resultPath,
        result: ctx.postInstallDoctorResult,
      });
      effectiveRuntime.exit(UPDATE_POST_INSTALL_DOCTOR_ADVISORY_EXIT_CODE);
      return;
    }
  }
  outro$1("Doctor complete.");
}
//#endregion
export { doctorCommand };
