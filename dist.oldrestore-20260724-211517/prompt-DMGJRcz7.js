import { stdin, stdout } from "node:process";
import readline from "node:readline/promises";
import "./errors-BoHeli7m.js";
import { r as toErrorObject } from "./error-coercion-CrJRoLe1.js";
import "./globals-CNUzHTcU.js";
import { n as isYes, t as isVerbose } from "./global-state-BAD7XgmL.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region src/cli/prompt.ts
/** Signals that an interactive prompt lost stdin before a complete answer arrived. */
var PromptInputClosedError = class extends Error {
  constructor() {
    super("Prompt input closed before an answer was received.");
    this.name = "PromptInputClosedError";
  }
};
function questionUntilClose(rl, question) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (complete) => {
      if (settled) return;
      settled = true;
      rl.off("close", onClose);
      complete();
    };
    const onClose = () => finish(() => reject(new PromptInputClosedError()));
    rl.once("close", onClose);
    rl.question(question).then(
      (answer) => finish(() => resolve(answer)),
      (error) => finish(() => reject(toErrorObject(error, "Non-Error rejection"))),
    );
  });
}
/** Prompts for yes/no input, honoring global `--yes` before opening stdin. */
async function promptYesNo(question, defaultYes = false) {
  if (isVerbose() && isYes()) return true;
  if (isYes()) return true;
  const rl = readline.createInterface({
    input: stdin,
    output: stdout,
  });
  const answer = normalizeLowercaseStringOrEmpty(
    await questionUntilClose(rl, `${question}${defaultYes ? " [Y/n] " : " [y/N] "}`).finally(() => {
      rl.close();
    }),
  );
  if (!answer) return defaultYes;
  return answer.startsWith("y");
}
async function promptText(question) {
  const rl = readline.createInterface({
    input: stdin,
    output: stdout,
  });
  return await questionUntilClose(rl, question).finally(() => {
    rl.close();
  });
}
//#endregion
export { promptText as n, promptYesNo as r, PromptInputClosedError as t };
