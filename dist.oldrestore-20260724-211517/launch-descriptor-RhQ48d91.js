import path from "node:path";
import "./version-CwNT1gaY.js";
import { Value } from "typebox/value";
import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-Br1guPTt.js";
import { i as isWorkerTranscriptMessageFrameSafe } from "./transcript-message-widVBq0t.js";
import {
  V as WorkerTranscriptMessageSchema,
  b as WorkerConnectRequestFrameSchema,
} from "./worker-admission-BAoXlOyb.js";
import {
  _ as WorkerInferenceOptionsSchema,
  g as WorkerInferenceModelRefSchema,
} from "./worker-inference-y83k6oxW.js";
//#region src/worker/launch-descriptor.ts
const LAUNCH_VERSION = 1;
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function hasExactKeys(value, required, optional = []) {
  const allowed = /* @__PURE__ */ new Set([...required, ...optional]);
  return (
    required.every((key) => key in value) && Object.keys(value).every((key) => allowed.has(key))
  );
}
function isIdentifier(value) {
  return (
    typeof value === "string" && value.trim() === value && value.length > 0 && value.length <= 256
  );
}
function isSafeSequence(value, minimum) {
  return Number.isSafeInteger(value) && typeof value === "number" && value >= minimum;
}
function isInferenceOptions(value) {
  return Value.Check(WorkerInferenceOptionsSchema, value);
}
function parseAssignment(value) {
  if (
    !isRecord(value) ||
    !hasExactKeys(
      value,
      [
        "runId",
        "turnId",
        "prompt",
        "suppressPromptTranscript",
        "workspaceDir",
        "modelRef",
        "inferenceOptions",
        "initialMessages",
        "transcript",
        "liveEvents",
      ],
      ["systemPrompt"],
    )
  )
    return;
  if (
    !isIdentifier(value.runId) ||
    !isIdentifier(value.turnId) ||
    typeof value.prompt !== "string" ||
    typeof value.suppressPromptTranscript !== "boolean" ||
    !isIdentifier(value.workspaceDir) ||
    !path.isAbsolute(value.workspaceDir) ||
    (value.systemPrompt !== void 0 && typeof value.systemPrompt !== "string") ||
    !Array.isArray(value.initialMessages) ||
    value.initialMessages.length > 1024 ||
    !value.initialMessages.every((message) => Value.Check(WorkerTranscriptMessageSchema, message))
  )
    return;
  if (
    !Value.Check(WorkerInferenceModelRefSchema, value.modelRef) ||
    !isInferenceOptions(value.inferenceOptions)
  )
    return;
  if (
    !isRecord(value.transcript) ||
    !hasExactKeys(value.transcript, ["baseLeafId", "nextSeq"]) ||
    (value.transcript.baseLeafId !== null && !isIdentifier(value.transcript.baseLeafId)) ||
    !isSafeSequence(value.transcript.nextSeq, 1)
  )
    return;
  if (
    !isRecord(value.liveEvents) ||
    !hasExactKeys(value.liveEvents, ["ackedSeq", "nextSeq"]) ||
    !isSafeSequence(value.liveEvents.ackedSeq, 0) ||
    !isSafeSequence(value.liveEvents.nextSeq, 1) ||
    value.liveEvents.nextSeq !== value.liveEvents.ackedSeq + 1
  )
    return;
  return value;
}
function buildWorkerConnectParams(descriptor) {
  return {
    minProtocol: 4,
    maxProtocol: 4,
    client: {
      id: GATEWAY_CLIENT_IDS.WORKER,
      version: descriptor.admission.handshake.openclawVersion,
      platform: process.platform,
      mode: GATEWAY_CLIENT_MODES.WORKER,
    },
    role: "worker",
    admission: {
      ...descriptor.admission,
      runId: descriptor.assignment.runId,
    },
  };
}
function parseWorkerLaunchDescriptor(value) {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, ["version", "socketPath", "admission", "assignment"]) ||
    value.version !== LAUNCH_VERSION ||
    !isIdentifier(value.socketPath) ||
    !path.isAbsolute(value.socketPath)
  )
    throw new Error("invalid worker launch descriptor");
  const assignment = parseAssignment(value.assignment);
  if (!assignment || !isRecord(value.admission))
    throw new Error("invalid worker launch descriptor");
  const candidate = {
    version: LAUNCH_VERSION,
    socketPath: value.socketPath,
    admission: value.admission,
    assignment,
  };
  const frame = {
    type: "req",
    id: "launch-validation",
    method: "connect",
    params: buildWorkerConnectParams(candidate),
  };
  if (
    !Value.Check(WorkerConnectRequestFrameSchema, frame) ||
    candidate.admission.sessionId === null ||
    candidate.admission.ownerEpoch < 1 ||
    !isWorkerTranscriptMessageFrameSafe({
      role: "user",
      content: [
        {
          type: "text",
          text: candidate.assignment.prompt,
        },
      ],
      timestamp: Number.MAX_SAFE_INTEGER,
    })
  )
    throw new Error("invalid worker launch descriptor");
  return candidate;
}
//#endregion
export { parseWorkerLaunchDescriptor as n, buildWorkerConnectParams as t };
