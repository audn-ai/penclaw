import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { j as resolveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import "./error-runtime-BIAwr399.js";
import "./number-runtime-B-n-wjMn.js";
import { t as collectZalouserSecurityAuditFindings } from "./security-audit-DC5CKVvi.js";
import { a as sendReactionZalouser, i as sendMessageZalouser } from "./send-Borlm5cl.js";
import {
  a as listZaloGroupMembers,
  b as waitForZaloQrLogin,
  c as logoutZaloProfile,
  i as listZaloFriendsMatching,
  n as getZaloUserInfo,
  s as listZaloGroupsMatching,
  y as startZaloQrLogin,
} from "./zalo-js-CezP7Dd8.js";
//#region extensions/zalouser/src/probe.ts
async function probeZalouser(profile, timeoutMs) {
  try {
    let user;
    if (timeoutMs) {
      let timeout;
      try {
        user = await Promise.race([
          getZaloUserInfo(profile),
          new Promise((resolve) => {
            timeout = setTimeout(() => resolve(null), resolveTimerTimeoutMs(timeoutMs, 1e3, 1e3));
          }),
        ]);
      } finally {
        if (timeout) clearTimeout(timeout);
      }
    } else user = await getZaloUserInfo(profile);
    if (!user)
      return {
        ok: false,
        error: "Not authenticated",
      };
    return {
      ok: true,
      user,
    };
  } catch (error) {
    return {
      ok: false,
      error: formatErrorMessage(error),
    };
  }
}
//#endregion
export {
  collectZalouserSecurityAuditFindings,
  getZaloUserInfo,
  listZaloFriendsMatching,
  listZaloGroupMembers,
  listZaloGroupsMatching,
  logoutZaloProfile,
  probeZalouser,
  sendMessageZalouser,
  sendReactionZalouser,
  startZaloQrLogin,
  waitForZaloQrLogin,
};
