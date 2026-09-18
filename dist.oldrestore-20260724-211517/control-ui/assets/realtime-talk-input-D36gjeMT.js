import { o as t, t as n } from "./control-ui-core-CwQmiouz.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
function r() {
  let e = globalThis.navigator?.mediaDevices;
  if (!e?.enumerateDevices) throw Error(t(`chat.composer.microphoneListUnsupported`));
  return e;
}
function i(e) {
  let n = [],
    r = new Set();
  for (let i of e) {
    let e = i.deviceId.trim();
    i.kind !== `audioinput` ||
      !e ||
      e === "default" ||
      r.has(e) ||
      (r.add(e),
      n.push({
        deviceId: e,
        label:
          i.label.trim() || t(`chat.composer.microphoneFallback`, { number: String(n.length + 1) }),
      }));
  }
  return n;
}
function a(e) {
  let n = e instanceof DOMException ? e.name : ``;
  return t(
    n === `NotAllowedError`
      ? `chat.composer.microphonePermissionBlocked`
      : n === `NotFoundError`
        ? `chat.composer.microphoneNoneFound`
        : n === `NotReadableError`
          ? `chat.composer.microphoneBusy`
          : n === `InvalidStateError`
            ? `chat.composer.microphonePageInactive`
            : `chat.composer.microphoneAccessFailed`,
  );
}
async function o(e) {
  let t, n;
  try {
    ((t = r()), (n = await t.enumerateDevices()));
  } catch (e) {
    return { devices: [], warning: a(e) };
  }
  let o = n.filter((e) => e.kind === `audioinput`),
    s = o.length === 0 || o.some((e) => !e.deviceId || !e.label);
  if (!e || !s || !t.getUserMedia) return { devices: i(n), warning: null };
  try {
    return (
      (await t.getUserMedia({ audio: !0 })).getTracks().forEach((e) => e.stop()),
      (n = await t.enumerateDevices()),
      { devices: i(n), warning: null }
    );
  } catch (e) {
    return { devices: i(n), warning: a(e) };
  }
}
function s(e) {
  let t = e?.trim();
  return {
    autoGainControl: !0,
    echoCancellation: !0,
    noiseSuppression: !0,
    ...(t ? { deviceId: { exact: t } } : {}),
  };
}
async function c(e) {
  let n = globalThis.navigator?.mediaDevices;
  if (!n?.getUserMedia) throw Error(t(`chat.composer.realtimeTalkRequiresMicrophone`));
  try {
    return await n.getUserMedia({ audio: s(e) });
  } catch (n) {
    throw e?.trim() && n instanceof DOMException && n.name === `OverconstrainedError`
      ? Error(t(`chat.composer.selectedMicrophoneUnavailable`), { cause: n })
      : n;
  }
}
var l = e(() => {
  n();
});
export { l as n, c as r, o as t };
//# sourceMappingURL=realtime-talk-input-D36gjeMT.js.map
