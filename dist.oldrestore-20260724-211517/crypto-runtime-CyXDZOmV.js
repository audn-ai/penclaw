import { setTimeout as setTimeout$1 } from "node:timers/promises";
import { CryptoEvent } from "matrix-js-sdk/lib/crypto-api/CryptoEvent.js";
import "./number-runtime-B-n-wjMn.js";
import { DecryptionFailureCode } from "matrix-js-sdk/lib/crypto-api/index.js";
import {
  VerificationPhase,
  VerificationRequestEvent,
  VerifierEvent,
} from "matrix-js-sdk/lib/crypto-api/verification.js";
import { MatrixEventEvent } from "matrix-js-sdk/lib/matrix.js";
import { VerificationMethod } from "matrix-js-sdk/lib/types.js";
import { t as ensureMatrixCryptoRuntime } from "./deps-C6pm28wx.js";
import { t as formatMatrixErrorMessage } from "./errors-DJRnBTUk.js";
import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import {
  a as FDBFactory,
  c as FDBDatabase,
  d as FDBRecord,
  f as FDBIndex,
  g as FDBKeyRange,
  h as FDBCursor,
  i as fakeIndexedDB,
  l as FDBTransaction,
  m as FDBCursorWithValue,
  o as FDBVersionChangeEvent,
  p as FDBRequest,
  r as restoreIdbFromDisk,
  s as FDBOpenDBRequest,
  t as persistIdbToDisk,
  u as FDBObjectStore,
} from "./idb-persistence-1FhhVvxZ.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { n as LogService, r as noop } from "./logger--yR0BEhE.js";
import {
  M as resolveTimestampMsToIsoString,
  S as resolveDateTimestampMs,
} from "./number-coercion-CJQ8TR--.js";
import { n as isRepairableSecretStorageAccessError } from "./recovery-key-store-BrFVUF4u.js";
//#region node_modules/fake-indexeddb/auto/index.mjs
var globalVar =
  typeof window !== "undefined"
    ? window
    : typeof WorkerGlobalScope !== "undefined"
      ? self
      : typeof global !== "undefined"
        ? global
        : Function("return this;")();
const createPropertyDescriptor = (value) => {
  return {
    value,
    enumerable: false,
    configurable: true,
    writable: true,
  };
};
Object.defineProperties(globalVar, {
  indexedDB: createPropertyDescriptor(fakeIndexedDB),
  IDBCursor: createPropertyDescriptor(FDBCursor),
  IDBCursorWithValue: createPropertyDescriptor(FDBCursorWithValue),
  IDBDatabase: createPropertyDescriptor(FDBDatabase),
  IDBFactory: createPropertyDescriptor(FDBFactory),
  IDBIndex: createPropertyDescriptor(FDBIndex),
  IDBKeyRange: createPropertyDescriptor(FDBKeyRange),
  IDBObjectStore: createPropertyDescriptor(FDBObjectStore),
  IDBOpenDBRequest: createPropertyDescriptor(FDBOpenDBRequest),
  IDBRecord: createPropertyDescriptor(FDBRecord),
  IDBRequest: createPropertyDescriptor(FDBRequest),
  IDBTransaction: createPropertyDescriptor(FDBTransaction),
  IDBVersionChangeEvent: createPropertyDescriptor(FDBVersionChangeEvent),
});
//#endregion
//#region extensions/matrix/src/matrix/sdk/fake-indexeddb-prune.ts
const MATRIX_CRYPTO_DATABASE_SUFFIXES = ["::matrix-sdk-crypto", "::matrix-sdk-crypto-meta"];
const PRUNER_INSTALLED = Symbol.for("openclaw.matrix.fakeIndexedDbTransactionPruner");
function isMatrixCryptoDatabase(rawDatabase) {
  return MATRIX_CRYPTO_DATABASE_SUFFIXES.some((suffix) => rawDatabase.name.endsWith(suffix));
}
function pruneFinishedFakeIndexedDbTransactions(rawDatabase) {
  if (!isMatrixCryptoDatabase(rawDatabase)) return 0;
  const transactions = rawDatabase.transactions;
  const activeTransactions = transactions.filter(
    (transaction) => transaction["_state"] !== "finished",
  );
  const removed = transactions.length - activeTransactions.length;
  if (removed > 0) transactions.splice(0, transactions.length, ...activeTransactions);
  return removed;
}
function installFakeIndexedDbTransactionPruner() {
  const databasePrototype = FDBDatabase.prototype;
  if (databasePrototype[PRUNER_INSTALLED]) return;
  Object.defineProperty(databasePrototype, PRUNER_INSTALLED, {
    configurable: false,
    enumerable: false,
    value: true,
  });
  const originalTransaction = Object.getOwnPropertyDescriptor(
    databasePrototype,
    "transaction",
  )?.value;
  databasePrototype.transaction = function patchedMatrixFakeIndexedDbTransaction(...args) {
    const rawDatabase = this["_rawDatabase"];
    pruneFinishedFakeIndexedDbTransactions(rawDatabase);
    const transaction = originalTransaction.apply(this, args);
    if (isMatrixCryptoDatabase(rawDatabase)) {
      const prune = () => {
        pruneFinishedFakeIndexedDbTransactions(rawDatabase);
      };
      transaction.addEventListener("complete", prune);
      transaction.addEventListener("abort", prune);
    }
    return transaction;
  };
}
//#endregion
//#region extensions/matrix/src/matrix/sdk/verification-status.ts
function isMatrixDeviceLocallyVerified(status) {
  return status?.localVerified === true;
}
function isMatrixDeviceOwnerVerified(status) {
  return status?.crossSigningVerified === true;
}
function isMatrixDeviceVerifiedInCurrentClient(status) {
  return (
    status?.isVerified?.() === true ||
    isMatrixDeviceLocallyVerified(status) ||
    isMatrixDeviceOwnerVerified(status)
  );
}
//#endregion
//#region extensions/matrix/src/matrix/sdk/crypto-bootstrap.ts
const CROSS_SIGNING_PUBLICATION_WAIT_MS = 5e3;
var MatrixCryptoBootstrapper = class {
  constructor(deps) {
    this.deps = deps;
    this.verificationHandlerRegistered = false;
  }
  async bootstrap(crypto, options = {}) {
    const strict = options.strict === true;
    const forceReset = options.forceResetCrossSigning === true;
    const deferSecretStorageBootstrapUntilAfterCrossSigning = forceReset;
    if (forceReset && !(await this.deps.canUnlockSecretStorage()))
      throw new Error(
        "Forced cross-signing reset requires the active Matrix recovery key; supply it before retrying",
      );
    this.registerVerificationRequestHandler(crypto);
    if (!deferSecretStorageBootstrapUntilAfterCrossSigning)
      await this.bootstrapSecretStorage(crypto, {
        strict,
        allowSecretStorageRecreateWithoutRecoveryKey:
          options.allowSecretStorageRecreateWithoutRecoveryKey === true,
      });
    const crossSigning = await this.bootstrapCrossSigning(crypto, {
      forceResetCrossSigning: forceReset,
      allowAutomaticCrossSigningReset: options.allowAutomaticCrossSigningReset !== false,
      allowSecretStorageRecreateWithoutRecoveryKey: forceReset
        ? false
        : options.allowSecretStorageRecreateWithoutRecoveryKey === true,
      strict,
    });
    if (forceReset && (!crossSigning.ready || !crossSigning.published))
      return {
        crossSigningReady: crossSigning.ready,
        crossSigningPublished: crossSigning.published,
        ownDeviceVerified: null,
      };
    await this.bootstrapSecretStorage(crypto, {
      strict,
      allowSecretStorageRecreateWithoutRecoveryKey:
        options.allowSecretStorageRecreateWithoutRecoveryKey === true,
    });
    const ownDeviceVerified = await this.ensureOwnDeviceTrust(crypto, { strict });
    return {
      crossSigningReady: crossSigning.ready,
      crossSigningPublished: crossSigning.published,
      ownDeviceVerified,
    };
  }
  createSigningKeysUiAuthCallback(params) {
    return async (makeRequest) => {
      try {
        return await makeRequest(null);
      } catch {
        try {
          return await makeRequest({ type: "m.login.dummy" });
        } catch {
          if (!params.password?.trim())
            throw new Error(
              "Matrix cross-signing key upload requires UIA; provide matrix.password for m.login.password fallback",
            );
          return await makeRequest({
            type: "m.login.password",
            identifier: {
              type: "m.id.user",
              user: params.userId,
            },
            password: params.password,
          });
        }
      }
    };
  }
  async bootstrapCrossSigning(crypto, options) {
    const userId = await this.deps.getUserId();
    const authUploadDeviceSigningKeys = this.createSigningKeysUiAuthCallback({
      userId,
      password: this.deps.getPassword?.(),
    });
    const hasPublishedCrossSigningKeys = async () => {
      if (typeof crypto.userHasCrossSigningKeys !== "function") return true;
      try {
        return await crypto.userHasCrossSigningKeys(userId, true);
      } catch {
        return false;
      }
    };
    const refreshPublishedCrossSigningKeys = async () => {
      if (typeof crypto.userHasCrossSigningKeys !== "function") return;
      try {
        await crypto.userHasCrossSigningKeys(userId, true);
      } catch {}
    };
    const isCrossSigningReady = async () => {
      if (typeof crypto.isCrossSigningReady !== "function") return true;
      try {
        return await crypto.isCrossSigningReady();
      } catch {
        return false;
      }
    };
    const finalize = async () => {
      const ready = await isCrossSigningReady();
      const published = ready
        ? await waitForPublishedCrossSigningKeys()
        : await hasPublishedCrossSigningKeys();
      if (ready && published) {
        LogService.info("MatrixClientLite", "Cross-signing bootstrap complete");
        return {
          ready,
          published,
        };
      }
      const message = "Cross-signing bootstrap finished but server keys are still not published";
      LogService.warn("MatrixClientLite", message);
      if (options.strict) throw new Error(message);
      return {
        ready,
        published,
      };
    };
    const waitForPublishedCrossSigningKeys = async () => {
      const startedAt = Date.now();
      do {
        if (await hasPublishedCrossSigningKeys()) return true;
        await setTimeout$1(250);
      } while (Date.now() - startedAt < CROSS_SIGNING_PUBLICATION_WAIT_MS);
      return false;
    };
    if (options.forceResetCrossSigning) {
      const resetCrossSigning = async () => {
        await crypto.bootstrapCrossSigning({
          setupNewCrossSigning: true,
          authUploadDeviceSigningKeys,
        });
      };
      try {
        await resetCrossSigning();
        await this.trustFreshOwnIdentity(crypto);
      } catch (err) {
        if (
          options.allowSecretStorageRecreateWithoutRecoveryKey &&
          isRepairableSecretStorageAccessError(err)
        ) {
          LogService.warn(
            "MatrixClientLite",
            "Forced cross-signing reset could not unlock secret storage; recreating secret storage and retrying.",
          );
          try {
            await this.deps.recoveryKeyStore.bootstrapSecretStorageWithRecoveryKey(crypto, {
              allowSecretStorageRecreateWithoutRecoveryKey: true,
              forceNewSecretStorage: true,
            });
            await resetCrossSigning();
            await this.trustFreshOwnIdentity(crypto);
          } catch (repairErr) {
            LogService.warn("MatrixClientLite", "Forced cross-signing reset failed:", repairErr);
            if (options.strict)
              throw repairErr instanceof Error ? repairErr : new Error(String(repairErr));
            return {
              ready: false,
              published: false,
            };
          }
          return await finalize();
        }
        LogService.warn("MatrixClientLite", "Forced cross-signing reset failed:", err);
        if (options.strict) {
          if (isRepairableSecretStorageAccessError(err))
            throw new Error(
              "Forced cross-signing reset cannot access secret storage; restore the Matrix recovery key before retrying",
              { cause: err },
            );
          throw err instanceof Error ? err : new Error(String(err));
        }
        return {
          ready: false,
          published: false,
        };
      }
      return await finalize();
    }
    try {
      await refreshPublishedCrossSigningKeys();
      await crypto.bootstrapCrossSigning({ authUploadDeviceSigningKeys });
    } catch (err) {
      if (
        options.allowSecretStorageRecreateWithoutRecoveryKey &&
        isRepairableSecretStorageAccessError(err)
      ) {
        LogService.warn(
          "MatrixClientLite",
          "Cross-signing bootstrap could not unlock secret storage; recreating secret storage during explicit bootstrap and retrying.",
        );
        await this.deps.recoveryKeyStore.bootstrapSecretStorageWithRecoveryKey(crypto, {
          allowSecretStorageRecreateWithoutRecoveryKey: true,
          forceNewSecretStorage: true,
        });
        await crypto.bootstrapCrossSigning({ authUploadDeviceSigningKeys });
      } else if (!options.allowAutomaticCrossSigningReset) {
        LogService.warn(
          "MatrixClientLite",
          "Initial cross-signing bootstrap failed and automatic reset is disabled:",
          err,
        );
        return {
          ready: false,
          published: false,
        };
      } else {
        LogService.warn(
          "MatrixClientLite",
          "Initial cross-signing bootstrap failed, trying reset:",
          err,
        );
        try {
          await crypto.bootstrapCrossSigning({
            setupNewCrossSigning: true,
            authUploadDeviceSigningKeys,
          });
        } catch (resetErr) {
          LogService.warn("MatrixClientLite", "Failed to bootstrap cross-signing:", resetErr);
          if (options.strict)
            throw resetErr instanceof Error ? resetErr : new Error(String(resetErr));
          return {
            ready: false,
            published: false,
          };
        }
      }
    }
    const firstPassReady = await isCrossSigningReady();
    const firstPassPublished = await hasPublishedCrossSigningKeys();
    if (firstPassReady && firstPassPublished) {
      LogService.info("MatrixClientLite", "Cross-signing bootstrap complete");
      return {
        ready: true,
        published: true,
      };
    }
    if (!options.allowAutomaticCrossSigningReset)
      return {
        ready: firstPassReady,
        published: firstPassPublished,
      };
    try {
      await crypto.bootstrapCrossSigning({
        setupNewCrossSigning: true,
        authUploadDeviceSigningKeys,
      });
      await this.trustFreshOwnIdentity(crypto);
    } catch (err) {
      LogService.warn("MatrixClientLite", "Fallback cross-signing bootstrap failed:", err);
      if (options.strict) throw err instanceof Error ? err : new Error(String(err));
      return {
        ready: false,
        published: false,
      };
    }
    return await finalize();
  }
  async trustFreshOwnIdentity(crypto) {
    const ownIdentity =
      typeof crypto.getOwnIdentity === "function"
        ? await crypto.getOwnIdentity().catch(() => void 0)
        : void 0;
    if (!ownIdentity) return;
    try {
      if (typeof ownIdentity.isVerified === "function" && ownIdentity.isVerified()) return;
      await ownIdentity.verify?.();
    } finally {
      ownIdentity.free?.();
    }
  }
  async bootstrapSecretStorage(crypto, options) {
    try {
      await this.deps.recoveryKeyStore.bootstrapSecretStorageWithRecoveryKey(crypto, {
        allowSecretStorageRecreateWithoutRecoveryKey:
          options.allowSecretStorageRecreateWithoutRecoveryKey,
      });
      LogService.info("MatrixClientLite", "Secret storage bootstrap complete");
    } catch (err) {
      LogService.warn("MatrixClientLite", "Failed to bootstrap secret storage:", err);
      if (options.strict) throw err instanceof Error ? err : new Error(String(err));
    }
  }
  registerVerificationRequestHandler(crypto) {
    if (this.verificationHandlerRegistered) return;
    this.verificationHandlerRegistered = true;
    crypto.on(CryptoEvent.VerificationRequestReceived, (request) => {
      const verificationRequest = request;
      try {
        this.deps.verificationManager.trackVerificationRequest(verificationRequest);
      } catch (err) {
        LogService.warn(
          "MatrixClientLite",
          `Failed to track verification request from ${verificationRequest.otherUserId}:`,
          err,
        );
      }
    });
    this.deps.decryptBridge.bindCryptoRetrySignals(crypto);
    LogService.info("MatrixClientLite", "Verification request handler registered");
  }
  async ensureOwnDeviceTrust(crypto, options) {
    const deviceId = this.deps.getDeviceId()?.trim();
    if (!deviceId) return null;
    const userId = await this.deps.getUserId();
    if (
      isMatrixDeviceOwnerVerified(
        typeof crypto.getDeviceVerificationStatus === "function"
          ? await crypto.getDeviceVerificationStatus(userId, deviceId).catch(() => null)
          : null,
      )
    )
      return true;
    if (typeof crypto.setDeviceVerified === "function")
      await crypto.setDeviceVerified(userId, deviceId, true);
    if (typeof crypto.crossSignDevice === "function") {
      if (
        typeof crypto.isCrossSigningReady === "function" ? await crypto.isCrossSigningReady() : true
      )
        await crypto.crossSignDevice(deviceId);
    }
    const verified = isMatrixDeviceOwnerVerified(
      typeof crypto.getDeviceVerificationStatus === "function"
        ? await crypto.getDeviceVerificationStatus(userId, deviceId).catch(() => null)
        : null,
    );
    if (!verified && options.strict)
      throw new Error(
        `Matrix own device ${deviceId} does not have full Matrix identity trust after bootstrap`,
      );
    return verified;
  }
};
//#endregion
//#region extensions/matrix/src/matrix/sdk/crypto-facade.ts
const matrixCryptoNodeRuntimeLoader = createLazyRuntimeModule(
  () => import("./crypto-node.runtime.js"),
);
async function loadMatrixCryptoNodeRuntime() {
  try {
    return await matrixCryptoNodeRuntimeLoader();
  } catch (error) {
    matrixCryptoNodeRuntimeLoader.clear();
    throw error;
  }
}
async function loadMatrixCryptoNodeBindings() {
  await ensureMatrixCryptoRuntime();
  return (await loadMatrixCryptoNodeRuntime()).loadMatrixCryptoNodeBindings();
}
function trackInProgressToDeviceVerifications(deps) {
  const crypto = deps.client.getCrypto();
  const userId = deps.client.getUserId();
  if (!userId || typeof crypto?.getVerificationRequestsToDeviceInProgress !== "function") return;
  for (const request of crypto.getVerificationRequestsToDeviceInProgress(userId))
    deps.verificationManager.trackVerificationRequest(request);
}
function createMatrixCryptoFacade(deps) {
  return {
    prepare: async (_joinedRooms) => {},
    updateSyncData: async (
      _toDeviceMessages,
      _otkCounts,
      _unusedFallbackKeyAlgs,
      _changedDeviceLists,
      _leftDeviceLists,
    ) => {},
    isRoomEncrypted: async (roomId) => {
      if (deps.client.getRoom(roomId)?.hasEncryptionStateEvent()) return true;
      try {
        const event = await deps.getRoomStateEvent(roomId, "m.room.encryption", "");
        return typeof event.algorithm === "string" && event.algorithm.length > 0;
      } catch {
        return false;
      }
    },
    requestOwnUserVerification: async () => {
      const crypto = deps.client.getCrypto();
      return await deps.verificationManager.requestOwnUserVerification(crypto);
    },
    encryptMedia: async (buffer) => {
      const { Attachment } = await loadMatrixCryptoNodeBindings();
      const encrypted = Attachment.encrypt(new Uint8Array(buffer));
      const mediaInfoJson = encrypted.mediaEncryptionInfo;
      if (!mediaInfoJson)
        throw new Error("Matrix media encryption failed: missing media encryption info");
      const parsed = JSON.parse(mediaInfoJson);
      return {
        buffer: Buffer.from(encrypted.encryptedData),
        file: {
          key: parsed.key,
          iv: parsed.iv,
          hashes: parsed.hashes,
          v: parsed.v,
        },
      };
    },
    decryptMedia: async (file, opts) => {
      const encrypted = await deps.downloadContent(file.url, opts);
      const { Attachment, EncryptedAttachment } = await loadMatrixCryptoNodeBindings();
      const metadata = {
        url: file.url,
        key: file.key,
        iv: file.iv,
        hashes: file.hashes,
        v: file.v,
      };
      const attachment = new EncryptedAttachment(
        new Uint8Array(encrypted),
        JSON.stringify(metadata),
      );
      const decrypted = Attachment.decrypt(attachment);
      return Buffer.from(decrypted);
    },
    getRecoveryKey: async () => {
      return deps.recoveryKeyStore.getRecoveryKeySummary();
    },
    listVerifications: async () => {
      trackInProgressToDeviceVerifications(deps);
      return deps.verificationManager.listVerifications();
    },
    ensureVerificationDmTracked: async ({ roomId, userId }) => {
      const crypto = deps.client.getCrypto();
      const request =
        typeof crypto?.findVerificationRequestDMInProgress === "function"
          ? crypto.findVerificationRequestDMInProgress(roomId, userId)
          : void 0;
      if (!request) return null;
      return deps.verificationManager.trackVerificationRequest(request);
    },
    requestVerification: async (params) => {
      const crypto = deps.client.getCrypto();
      return await deps.verificationManager.requestVerification(crypto, params);
    },
    acceptVerification: async (id) => {
      trackInProgressToDeviceVerifications(deps);
      return await deps.verificationManager.acceptVerification(id);
    },
    cancelVerification: async (id, params) => {
      trackInProgressToDeviceVerifications(deps);
      return await deps.verificationManager.cancelVerification(id, params);
    },
    startVerification: async (id, method = "sas") => {
      trackInProgressToDeviceVerifications(deps);
      return await deps.verificationManager.startVerification(id, method);
    },
    generateVerificationQr: async (id) => {
      trackInProgressToDeviceVerifications(deps);
      return await deps.verificationManager.generateVerificationQr(id);
    },
    scanVerificationQr: async (id, qrDataBase64) => {
      trackInProgressToDeviceVerifications(deps);
      return await deps.verificationManager.scanVerificationQr(id, qrDataBase64);
    },
    confirmVerificationSas: async (id) => {
      trackInProgressToDeviceVerifications(deps);
      return await deps.verificationManager.confirmVerificationSas(id);
    },
    mismatchVerificationSas: async (id) => {
      trackInProgressToDeviceVerifications(deps);
      return deps.verificationManager.mismatchVerificationSas(id);
    },
    confirmVerificationReciprocateQr: async (id) => {
      trackInProgressToDeviceVerifications(deps);
      return deps.verificationManager.confirmVerificationReciprocateQr(id);
    },
    getVerificationSas: async (id) => {
      trackInProgressToDeviceVerifications(deps);
      return deps.verificationManager.getVerificationSas(id);
    },
  };
}
//#endregion
//#region extensions/matrix/src/matrix/sdk/decrypt-bridge.ts
const MATRIX_DECRYPT_RETRY_BASE_DELAY_MS = 1500;
const MATRIX_DECRYPT_RETRY_MAX_DELAY_MS = 3e4;
const MATRIX_DECRYPT_RETRY_MAX_ATTEMPTS = 8;
const MATRIX_DECRYPT_EXHAUSTED_RETRY_TTL_MS = 60 * 6e4;
const MATRIX_DECRYPT_EXHAUSTED_RETRY_MAX_ENTRIES = 512;
function resolveDecryptRetryKey(roomId, eventId) {
  if (!roomId || !eventId) return null;
  return `${roomId}|${eventId}`;
}
function isDecryptionFailure(event) {
  return typeof event.isDecryptionFailure === "function" && event.isDecryptionFailure();
}
function getDecryptionFailureReason(event) {
  const reason = event.decryptionFailureReason;
  return typeof reason === "string" && reason in DecryptionFailureCode ? reason : null;
}
function shouldRetryDecryptionFailure(event) {
  if (!isDecryptionFailure(event)) return false;
  const reason = getDecryptionFailureReason(event);
  if (!reason) return true;
  return (
    reason === DecryptionFailureCode.MEGOLM_UNKNOWN_INBOUND_SESSION_ID ||
    reason === DecryptionFailureCode.OLM_UNKNOWN_MESSAGE_INDEX ||
    reason === DecryptionFailureCode.UNKNOWN_ERROR
  );
}
var MatrixDecryptBridge = class {
  constructor(deps) {
    this.deps = deps;
    this.trackedEncryptedEvents = /* @__PURE__ */ new WeakSet();
    this.decryptedMessageDedupe = /* @__PURE__ */ new Map();
    this.decryptRetries = /* @__PURE__ */ new Map();
    this.failedDecryptionsNotified = /* @__PURE__ */ new Set();
    this.exhaustedDecryptRetries = /* @__PURE__ */ new Map();
    this.activeRetryRuns = 0;
    this.retryIdleResolvers = /* @__PURE__ */ new Set();
    this.cryptoRetrySignalsBound = false;
    this.stopped = false;
  }
  shouldEmitUnencryptedMessage(roomId, eventId) {
    if (!eventId) return true;
    const key = `${roomId}|${eventId}`;
    if (this.decryptedMessageDedupe.get(key) === void 0) return true;
    this.decryptedMessageDedupe.delete(key);
    return false;
  }
  attachEncryptedEvent(event, roomId) {
    if (this.stopped) return;
    if (this.trackedEncryptedEvents.has(event)) return;
    this.trackedEncryptedEvents.add(event);
    event.on(MatrixEventEvent.Decrypted, (decryptedEvent, err) => {
      this.handleEncryptedEventDecrypted({
        roomId,
        encryptedEvent: event,
        decryptedEvent,
        err,
      });
    });
    if (shouldRetryDecryptionFailure(event)) {
      const eventId = this.deps.toRaw(event).event_id || event.getId() || "";
      this.scheduleDecryptRetry({
        event,
        roomId,
        eventId,
      });
    }
  }
  retryPendingNow(reason, options) {
    if (this.stopped) return;
    if (options?.includeExhausted) {
      this.pruneExhaustedDecryptRetries(Date.now());
      for (const [retryKey, state] of this.exhaustedDecryptRetries) {
        if (this.decryptRetries.has(retryKey)) continue;
        this.exhaustedDecryptRetries.delete(retryKey);
        this.decryptRetries.set(retryKey, {
          ...state,
          attempts: 0,
          inFlight: false,
          timer: null,
        });
      }
    }
    const pending = Array.from(this.decryptRetries.entries());
    if (pending.length === 0) return;
    LogService.debug("MatrixClientLite", `Retrying pending decryptions due to ${reason}`);
    for (const [retryKey, state] of pending) {
      if (state.timer) {
        clearTimeout(state.timer);
        state.timer = null;
      }
      if (state.inFlight) continue;
      this.runDecryptRetry(retryKey).catch(noop);
    }
  }
  bindCryptoRetrySignals(crypto) {
    if (!crypto || this.cryptoRetrySignalsBound) return;
    this.cryptoRetrySignalsBound = true;
    const trigger = (reason, options) => {
      this.retryPendingNow(reason, options);
    };
    crypto.on(CryptoEvent.KeyBackupDecryptionKeyCached, () => {
      trigger("crypto.keyBackupDecryptionKeyCached", { includeExhausted: true });
    });
    crypto.on(CryptoEvent.RehydrationCompleted, () => {
      trigger("dehydration.RehydrationCompleted", { includeExhausted: true });
    });
    crypto.on(CryptoEvent.DevicesUpdated, () => {
      trigger("crypto.devicesUpdated");
    });
    crypto.on(CryptoEvent.KeysChanged, () => {
      trigger("crossSigning.keysChanged");
    });
  }
  stop() {
    this.stopped = true;
    for (const retryKey of this.decryptRetries.keys()) this.clearDecryptRetry(retryKey);
    this.exhaustedDecryptRetries.clear();
  }
  async drainPendingDecryptions(reason) {
    for (let attempts = 0; attempts < MATRIX_DECRYPT_RETRY_MAX_ATTEMPTS; attempts += 1) {
      if (this.decryptRetries.size === 0) return;
      this.retryPendingNow(reason);
      await this.waitForActiveRetryRunsToFinish();
      if (!Array.from(this.decryptRetries.values()).some((state) => state.timer || state.inFlight))
        return;
    }
  }
  handleEncryptedEventDecrypted(params) {
    if (this.stopped) return;
    const decryptedRoomId = params.decryptedEvent.getRoomId() || params.roomId;
    const decryptedRaw = this.deps.toRaw(params.decryptedEvent);
    const retryEventId = decryptedRaw.event_id || params.encryptedEvent.getId() || "";
    const retryKey = resolveDecryptRetryKey(decryptedRoomId, retryEventId);
    if (params.err) {
      this.emitFailedDecryptionOnce(retryKey, decryptedRoomId, decryptedRaw, params.err);
      if (shouldRetryDecryptionFailure(params.decryptedEvent))
        this.scheduleDecryptRetry({
          event: params.encryptedEvent,
          roomId: decryptedRoomId,
          eventId: retryEventId,
        });
      else if (retryKey) this.clearDecryptRetry(retryKey);
      return;
    }
    if (isDecryptionFailure(params.decryptedEvent)) {
      this.emitFailedDecryptionOnce(
        retryKey,
        decryptedRoomId,
        decryptedRaw,
        /* @__PURE__ */ new Error("Matrix event failed to decrypt"),
      );
      if (shouldRetryDecryptionFailure(params.decryptedEvent))
        this.scheduleDecryptRetry({
          event: params.encryptedEvent,
          roomId: decryptedRoomId,
          eventId: retryEventId,
        });
      else if (retryKey) this.clearDecryptRetry(retryKey);
      return;
    }
    if (retryKey) this.clearDecryptRetry(retryKey);
    this.rememberDecryptedMessage(decryptedRoomId, decryptedRaw.event_id);
    this.deps.emitDecryptedEvent(decryptedRoomId, decryptedRaw);
    this.deps.emitMessage(decryptedRoomId, decryptedRaw);
  }
  emitFailedDecryptionOnce(retryKey, roomId, event, error) {
    if (retryKey) {
      if (this.failedDecryptionsNotified.has(retryKey)) return;
      this.failedDecryptionsNotified.add(retryKey);
    }
    this.deps.emitFailedDecryption(roomId, event, error);
  }
  scheduleDecryptRetry(params) {
    if (this.stopped) return;
    const retryKey = resolveDecryptRetryKey(params.roomId, params.eventId);
    if (!retryKey) return;
    const existing = this.decryptRetries.get(retryKey);
    if (this.exhaustedDecryptRetries.has(retryKey)) return;
    if (existing?.timer || existing?.inFlight) return;
    const attempts = (existing?.attempts ?? 0) + 1;
    if (attempts > MATRIX_DECRYPT_RETRY_MAX_ATTEMPTS) {
      const retry = this.decryptRetries.get(retryKey);
      if (retry?.timer) clearTimeout(retry.timer);
      this.decryptRetries.delete(retryKey);
      const exhaustedAt = Date.now();
      this.exhaustedDecryptRetries.set(retryKey, {
        event: params.event,
        roomId: params.roomId,
        eventId: params.eventId,
        attempts: attempts - 1,
        inFlight: false,
        timer: null,
        exhaustedAt,
      });
      this.pruneExhaustedDecryptRetries(exhaustedAt);
      LogService.debug(
        "MatrixClientLite",
        `Giving up decryption retry for ${params.eventId} in ${params.roomId} after ${attempts - 1} attempts`,
      );
      return;
    }
    const delayMs = Math.min(
      MATRIX_DECRYPT_RETRY_BASE_DELAY_MS * 2 ** (attempts - 1),
      MATRIX_DECRYPT_RETRY_MAX_DELAY_MS,
    );
    const next = {
      event: params.event,
      roomId: params.roomId,
      eventId: params.eventId,
      attempts,
      inFlight: false,
      timer: null,
    };
    next.timer = setTimeout(() => {
      this.runDecryptRetry(retryKey).catch(noop);
    }, delayMs);
    this.decryptRetries.set(retryKey, next);
  }
  async runDecryptRetry(retryKey) {
    const state = this.decryptRetries.get(retryKey);
    if (!state || state.inFlight) return;
    state.inFlight = true;
    state.timer = null;
    this.activeRetryRuns += 1;
    const retryEvent = state.event;
    const retryCrypto = this.deps.client.getCrypto?.();
    const canAttemptDecryption =
      retryCrypto !== void 0 &&
      retryCrypto !== null &&
      typeof retryEvent.attemptDecryption === "function";
    if (!(canAttemptDecryption || typeof this.deps.client.decryptEventIfNeeded === "function")) {
      this.clearDecryptRetry(retryKey);
      this.activeRetryRuns = Math.max(0, this.activeRetryRuns - 1);
      this.resolveRetryIdleIfNeeded();
      return;
    }
    try {
      if (canAttemptDecryption)
        await retryEvent.attemptDecryption?.(retryCrypto, { isRetry: true });
      else await this.deps.client.decryptEventIfNeeded?.(state.event, { isRetry: true });
    } catch {
    } finally {
      state.inFlight = false;
      this.activeRetryRuns = Math.max(0, this.activeRetryRuns - 1);
      this.resolveRetryIdleIfNeeded();
    }
    if (this.decryptRetries.get(retryKey) !== state) return;
    if (this.stopped) return;
    if (isDecryptionFailure(state.event)) {
      if (!shouldRetryDecryptionFailure(state.event)) {
        this.clearDecryptRetry(retryKey);
        return;
      }
      this.scheduleDecryptRetry(state);
      return;
    }
    this.clearDecryptRetry(retryKey);
    const raw = this.deps.toRaw(state.event);
    this.rememberDecryptedMessage(state.roomId, raw.event_id);
    this.deps.emitDecryptedEvent(state.roomId, raw);
    this.deps.emitMessage(state.roomId, raw);
  }
  clearDecryptRetry(retryKey) {
    const state = this.decryptRetries.get(retryKey);
    if (state?.timer) clearTimeout(state.timer);
    this.decryptRetries.delete(retryKey);
    this.exhaustedDecryptRetries.delete(retryKey);
    this.failedDecryptionsNotified.delete(retryKey);
  }
  pruneExhaustedDecryptRetries(now) {
    for (const [retryKey, state] of this.exhaustedDecryptRetries)
      if (now - state.exhaustedAt > MATRIX_DECRYPT_EXHAUSTED_RETRY_TTL_MS)
        this.exhaustedDecryptRetries.delete(retryKey);
    while (this.exhaustedDecryptRetries.size > MATRIX_DECRYPT_EXHAUSTED_RETRY_MAX_ENTRIES) {
      const oldest = this.exhaustedDecryptRetries.keys().next().value;
      if (oldest === void 0) break;
      this.exhaustedDecryptRetries.delete(oldest);
    }
  }
  rememberDecryptedMessage(roomId, eventId) {
    if (!eventId) return;
    const now = Date.now();
    this.pruneDecryptedMessageDedupe(now);
    this.decryptedMessageDedupe.set(`${roomId}|${eventId}`, now);
  }
  pruneDecryptedMessageDedupe(now) {
    const ttlMs = 3e4;
    for (const [key, createdAt] of this.decryptedMessageDedupe)
      if (now - createdAt > ttlMs) this.decryptedMessageDedupe.delete(key);
    const maxEntries = 2048;
    while (this.decryptedMessageDedupe.size > maxEntries) {
      const oldest = this.decryptedMessageDedupe.keys().next().value;
      if (oldest === void 0) break;
      this.decryptedMessageDedupe.delete(oldest);
    }
  }
  async waitForActiveRetryRunsToFinish() {
    if (this.activeRetryRuns === 0) return;
    await new Promise((resolve) => {
      this.retryIdleResolvers.add(resolve);
      if (this.activeRetryRuns === 0) {
        this.retryIdleResolvers.delete(resolve);
        resolve();
      }
    });
  }
  resolveRetryIdleIfNeeded() {
    if (this.activeRetryRuns !== 0) return;
    for (const resolve of this.retryIdleResolvers) resolve();
    this.retryIdleResolvers.clear();
  }
};
//#endregion
//#region extensions/matrix/src/matrix/sdk/verification-manager.ts
const MATRIX_VERIFICATION_PHASES = /* @__PURE__ */ new Set([
  -1,
  VerificationPhase.Unsent,
  VerificationPhase.Requested,
  VerificationPhase.Ready,
  VerificationPhase.Started,
  VerificationPhase.Cancelled,
  VerificationPhase.Done,
]);
function isMatrixVerificationPhase(value) {
  return typeof value === "number" && MATRIX_VERIFICATION_PHASES.has(value);
}
const MAX_TRACKED_VERIFICATION_SESSIONS = 256;
const TERMINAL_SESSION_RETENTION_MS = 1440 * 60 * 1e3;
const SAS_AUTO_CONFIRM_DELAY_MS = 3e4;
var MatrixVerificationManager = class {
  constructor(opts = {}) {
    this.opts = opts;
    this.verificationSessions = /* @__PURE__ */ new Map();
    this.verificationSessionCounter = 0;
    this.trackedVerificationRequests = /* @__PURE__ */ new WeakSet();
    this.trackedVerificationVerifiers = /* @__PURE__ */ new WeakSet();
    this.summaryListeners = /* @__PURE__ */ new Set();
  }
  readRequestValue(_request, reader, fallback) {
    try {
      return reader();
    } catch {
      return fallback;
    }
  }
  readVerificationPhase(request, fallback) {
    const phase = this.readRequestValue(request, () => request.phase, fallback);
    return isMatrixVerificationPhase(phase) ? phase : fallback;
  }
  readVerificationRequestIdentity(request) {
    return {
      transactionId: this.readRequestValue(request, () => request.transactionId?.trim() ?? "", ""),
      roomId: this.readRequestValue(request, () => request.roomId ?? "", ""),
      otherUserId: this.readRequestValue(request, () => request.otherUserId, ""),
      otherDeviceId: this.readRequestValue(request, () => request.otherDeviceId ?? "", ""),
      isSelfVerification: this.readRequestValue(request, () => request.isSelfVerification, false),
      initiatedByMe: this.readRequestValue(request, () => request.initiatedByMe, false),
    };
  }
  isSameLogicalVerificationRequest(left, right) {
    const leftIdentity = this.readVerificationRequestIdentity(left);
    const rightIdentity = this.readVerificationRequestIdentity(right);
    return (
      leftIdentity.transactionId !== "" &&
      leftIdentity.transactionId === rightIdentity.transactionId &&
      leftIdentity.roomId === rightIdentity.roomId &&
      leftIdentity.otherUserId === rightIdentity.otherUserId &&
      this.isSameOptionalIdentityValue(leftIdentity.otherDeviceId, rightIdentity.otherDeviceId) &&
      leftIdentity.isSelfVerification === rightIdentity.isSelfVerification &&
      leftIdentity.initiatedByMe === rightIdentity.initiatedByMe
    );
  }
  isSameOptionalIdentityValue(left, right) {
    return left === "" || right === "" || left === right;
  }
  pruneVerificationSessions(nowMs) {
    for (const [id, session] of this.verificationSessions) {
      const phase = this.readVerificationPhase(session.request, -1);
      if (
        (phase === VerificationPhase.Done || phase === VerificationPhase.Cancelled) &&
        nowMs - session.updatedAtMs > TERMINAL_SESSION_RETENTION_MS
      )
        this.verificationSessions.delete(id);
    }
    if (this.verificationSessions.size <= MAX_TRACKED_VERIFICATION_SESSIONS) return;
    const sortedByAge = Array.from(this.verificationSessions.entries()).toSorted(
      (a, b) => a[1].updatedAtMs - b[1].updatedAtMs,
    );
    const overflow = this.verificationSessions.size - MAX_TRACKED_VERIFICATION_SESSIONS;
    for (let i = 0; i < overflow; i += 1) {
      const entry = sortedByAge[i];
      if (entry) this.verificationSessions.delete(entry[0]);
    }
  }
  getVerificationPhaseName(phase) {
    switch (phase) {
      case VerificationPhase.Unsent:
        return "unsent";
      case VerificationPhase.Requested:
        return "requested";
      case VerificationPhase.Ready:
        return "ready";
      case VerificationPhase.Started:
        return "started";
      case VerificationPhase.Cancelled:
        return "cancelled";
      case VerificationPhase.Done:
        return "done";
      default:
        return `unknown(${phase})`;
    }
  }
  emitVerificationSummary(session) {
    const summary = this.buildVerificationSummary(session);
    for (const listener of this.summaryListeners) listener(summary);
  }
  touchVerificationSession(session) {
    session.updatedAtMs = resolveDateTimestampMs(Date.now());
    this.emitVerificationSummary(session);
  }
  clearSasAutoConfirmTimer(session) {
    if (!session.sasAutoConfirmTimer) return;
    clearTimeout(session.sasAutoConfirmTimer);
    session.sasAutoConfirmTimer = void 0;
  }
  buildVerificationSummary(session) {
    const request = session.request;
    const phase = this.readVerificationPhase(request, VerificationPhase.Requested);
    const accepting = this.readRequestValue(request, () => request.accepting, false);
    const declining = this.readRequestValue(request, () => request.declining, false);
    const pending = this.readRequestValue(request, () => request.pending, false);
    const methodsRaw = this.readRequestValue(request, () => request.methods, []);
    const methods = Array.isArray(methodsRaw)
      ? methodsRaw.filter((entry) => typeof entry === "string")
      : [];
    const sasCallbacks = session.sasCallbacks ?? session.activeVerifier?.getShowSasCallbacks();
    if (sasCallbacks) session.sasCallbacks = sasCallbacks;
    const canAccept = phase < VerificationPhase.Ready && !accepting && !declining;
    return {
      id: session.id,
      transactionId: this.readRequestValue(request, () => request.transactionId, void 0),
      roomId: this.readRequestValue(request, () => request.roomId, void 0),
      otherUserId: this.readRequestValue(request, () => request.otherUserId, "unknown"),
      otherDeviceId: this.readRequestValue(request, () => request.otherDeviceId, void 0),
      isSelfVerification: this.readRequestValue(request, () => request.isSelfVerification, false),
      initiatedByMe: this.readRequestValue(request, () => request.initiatedByMe, false),
      phase,
      phaseName: this.getVerificationPhaseName(phase),
      pending,
      methods,
      chosenMethod: this.readRequestValue(request, () => request.chosenMethod ?? null, null),
      canAccept,
      hasSas: Boolean(sasCallbacks),
      sas: sasCallbacks
        ? {
            decimal: sasCallbacks.sas.decimal,
            emoji: sasCallbacks.sas.emoji,
          }
        : void 0,
      hasReciprocateQr: Boolean(session.reciprocateQrCallbacks),
      completed: phase === VerificationPhase.Done,
      error: session.error,
      createdAt: resolveTimestampMsToIsoString(session.createdAtMs),
      updatedAt: resolveTimestampMsToIsoString(session.updatedAtMs),
    };
  }
  findVerificationSession(id) {
    const direct = this.verificationSessions.get(id);
    if (direct) return direct;
    const transactionMatches = Array.from(this.verificationSessions.values()).filter((session) => {
      return (
        this.readRequestValue(session.request, () => session.request.transactionId?.trim(), "") ===
        id
      );
    });
    if (transactionMatches.length === 1)
      return expectDefined(transactionMatches[0], "single Matrix verification session");
    if (transactionMatches.length > 1)
      throw new Error(
        `Matrix verification request id is ambiguous for transaction ${id}; use the verification id instead`,
      );
    throw new Error(`Matrix verification request not found: ${id}`);
  }
  ensureVerificationRequestTracked(session) {
    const requestObj = session.request;
    if (this.trackedVerificationRequests.has(requestObj)) return;
    this.trackedVerificationRequests.add(requestObj);
    session.request.on(VerificationRequestEvent.Change, () => {
      this.touchVerificationSession(session);
      this.maybeAutoAcceptInboundRequest(session);
      const verifier = this.readRequestValue(session.request, () => session.request.verifier, null);
      if (verifier) this.attachVerifierToVerificationSession(session, verifier);
      this.maybeAutoStartInboundSas(session);
    });
  }
  maybeAutoAcceptInboundRequest(session) {
    if (session.acceptRequested) return;
    const request = session.request;
    const isSelfVerification = this.readRequestValue(
      request,
      () => request.isSelfVerification,
      false,
    );
    const initiatedByMe = this.readRequestValue(request, () => request.initiatedByMe, false);
    const phase = this.readVerificationPhase(request, VerificationPhase.Requested);
    const accepting = this.readRequestValue(request, () => request.accepting, false);
    const declining = this.readRequestValue(request, () => request.declining, false);
    if (isSelfVerification || initiatedByMe) return;
    if (phase !== VerificationPhase.Requested || accepting || declining) return;
    session.acceptRequested = true;
    request
      .accept()
      .then(() => {
        this.touchVerificationSession(session);
      })
      .catch((err) => {
        session.acceptRequested = false;
        session.error = formatMatrixErrorMessage(err);
        this.touchVerificationSession(session);
      });
  }
  maybeAutoStartInboundSas(session) {
    if (session.activeVerifier || session.verifyStarted || session.startRequested) return;
    if (this.readRequestValue(session.request, () => session.request.initiatedByMe, true)) return;
    if (!this.readRequestValue(session.request, () => session.request.isSelfVerification, false))
      return;
    const phase = this.readVerificationPhase(session.request, VerificationPhase.Requested);
    if (phase < VerificationPhase.Ready || phase >= VerificationPhase.Cancelled) return;
    const methodsRaw = this.readRequestValue(session.request, () => session.request.methods, []);
    const methods = Array.isArray(methodsRaw)
      ? methodsRaw.filter((entry) => typeof entry === "string")
      : [];
    const chosenMethod = this.readRequestValue(
      session.request,
      () => session.request.chosenMethod,
      null,
    );
    if (!(methods.includes(VerificationMethod.Sas) || chosenMethod === VerificationMethod.Sas))
      return;
    session.startRequested = true;
    session.request
      .startVerification(VerificationMethod.Sas)
      .then((verifier) => {
        this.attachVerifierToVerificationSession(session, verifier);
        this.touchVerificationSession(session);
      })
      .catch(() => {
        session.startRequested = false;
      });
  }
  attachVerifierToVerificationSession(session, verifier) {
    session.activeVerifier = verifier;
    this.touchVerificationSession(session);
    const maybeSas = verifier.getShowSasCallbacks();
    if (maybeSas) {
      session.sasCallbacks = maybeSas;
      this.maybeAutoConfirmSas(session);
    }
    const maybeReciprocateQr = verifier.getReciprocateQrCodeCallbacks();
    if (maybeReciprocateQr) session.reciprocateQrCallbacks = maybeReciprocateQr;
    const verifierObj = verifier;
    if (this.trackedVerificationVerifiers.has(verifierObj)) {
      this.ensureVerificationStarted(session);
      return;
    }
    this.trackedVerificationVerifiers.add(verifierObj);
    verifier.on(VerifierEvent.ShowSas, (sas) => {
      session.sasCallbacks = sas;
      this.touchVerificationSession(session);
      this.maybeAutoConfirmSas(session);
    });
    verifier.on(VerifierEvent.ShowReciprocateQr, (qr) => {
      session.reciprocateQrCallbacks = qr;
      this.touchVerificationSession(session);
    });
    verifier.on(VerifierEvent.Cancel, (err) => {
      this.clearSasAutoConfirmTimer(session);
      session.error = formatMatrixErrorMessage(err);
      this.touchVerificationSession(session);
    });
    this.ensureVerificationStarted(session);
  }
  maybeAutoConfirmSas(session) {
    if (session.sasAutoConfirmStarted || session.sasAutoConfirmTimer) return;
    if (this.readRequestValue(session.request, () => session.request.initiatedByMe, true)) return;
    const callbacks = session.sasCallbacks ?? session.activeVerifier?.getShowSasCallbacks();
    if (!callbacks) return;
    session.sasCallbacks = callbacks;
    session.sasAutoConfirmTimer = setTimeout(() => {
      session.sasAutoConfirmTimer = void 0;
      if (
        this.readVerificationPhase(session.request, VerificationPhase.Requested) >=
        VerificationPhase.Cancelled
      )
        return;
      session.sasAutoConfirmStarted = true;
      this.confirmSasForSession(session, callbacks, { trustOwnDevice: true })
        .then(() => {
          this.touchVerificationSession(session);
        })
        .catch((err) => {
          session.error = formatMatrixErrorMessage(err);
          this.touchVerificationSession(session);
        });
    }, SAS_AUTO_CONFIRM_DELAY_MS);
  }
  async confirmSasForSession(session, callbacks, opts = { trustOwnDevice: true }) {
    await callbacks.confirm();
    if (opts.trustOwnDevice) await this.trustOwnDeviceAfterConfirmedSas(session);
  }
  ensureVerificationStarted(session) {
    if (!session.activeVerifier || session.verifyStarted) return;
    session.verifyStarted = true;
    session.verifyPromise = session.activeVerifier
      .verify()
      .then(() => {
        this.touchVerificationSession(session);
      })
      .catch((err) => {
        session.error = formatMatrixErrorMessage(err);
        this.touchVerificationSession(session);
      });
  }
  async trustOwnDeviceAfterConfirmedSas(session) {
    if (!this.readRequestValue(session.request, () => session.request.isSelfVerification, false))
      return;
    const deviceId = this.readRequestValue(
      session.request,
      () => session.request.otherDeviceId?.trim(),
      "",
    );
    if (!deviceId || !this.opts.trustOwnDeviceAfterSas) return;
    await this.opts.trustOwnDeviceAfterSas(deviceId);
  }
  onSummaryChanged(listener) {
    this.summaryListeners.add(listener);
    return () => {
      this.summaryListeners.delete(listener);
    };
  }
  trackVerificationRequest(request) {
    this.pruneVerificationSessions(Date.now());
    const requestObj = request;
    for (const existing of this.verificationSessions.values())
      if (existing.request === requestObj) {
        this.touchVerificationSession(existing);
        return this.buildVerificationSummary(existing);
      }
    if (this.readVerificationRequestIdentity(request).transactionId) {
      for (const existing of this.verificationSessions.values())
        if (this.isSameLogicalVerificationRequest(existing.request, request)) {
          existing.request = request;
          this.ensureVerificationRequestTracked(existing);
          const verifier = this.readRequestValue(request, () => request.verifier, null);
          if (verifier) this.attachVerifierToVerificationSession(existing, verifier);
          this.touchVerificationSession(existing);
          return this.buildVerificationSummary(existing);
        }
    }
    const now = resolveDateTimestampMs(Date.now());
    const session = {
      id: `verification-${++this.verificationSessionCounter}`,
      request,
      createdAtMs: now,
      updatedAtMs: now,
      verifyStarted: false,
      startRequested: false,
      acceptRequested: false,
      sasAutoConfirmStarted: false,
    };
    this.verificationSessions.set(session.id, session);
    this.ensureVerificationRequestTracked(session);
    this.maybeAutoAcceptInboundRequest(session);
    const verifier = this.readRequestValue(request, () => request.verifier, null);
    if (verifier) this.attachVerifierToVerificationSession(session, verifier);
    this.maybeAutoStartInboundSas(session);
    this.emitVerificationSummary(session);
    return this.buildVerificationSummary(session);
  }
  async requestOwnUserVerification(crypto) {
    if (!crypto) return null;
    const request = await crypto.requestOwnUserVerification();
    if (!request) return null;
    return this.trackVerificationRequest(request);
  }
  listVerifications() {
    this.pruneVerificationSessions(Date.now());
    return Array.from(this.verificationSessions.values())
      .map((session) => this.buildVerificationSummary(session))
      .toSorted((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
  async requestVerification(crypto, params) {
    if (!crypto) throw new Error("Matrix crypto is not available");
    let request;
    if (params.ownUser) request = await crypto.requestOwnUserVerification();
    else if (params.userId && params.deviceId && crypto.requestDeviceVerification)
      request = await crypto.requestDeviceVerification(params.userId, params.deviceId);
    else if (params.userId && params.roomId && crypto.requestVerificationDM)
      request = await crypto.requestVerificationDM(params.userId, params.roomId);
    else
      throw new Error(
        "Matrix verification request requires one of: ownUser, userId+deviceId, or userId+roomId",
      );
    if (!request) throw new Error("Matrix verification request could not be created");
    return this.trackVerificationRequest(request);
  }
  async acceptVerification(id) {
    const session = this.findVerificationSession(id);
    await session.request.accept();
    this.touchVerificationSession(session);
    return this.buildVerificationSummary(session);
  }
  async cancelVerification(id, params) {
    const session = this.findVerificationSession(id);
    await session.request.cancel(params);
    this.touchVerificationSession(session);
    return this.buildVerificationSummary(session);
  }
  async startVerification(id, method = "sas") {
    const session = this.findVerificationSession(id);
    if (method !== "sas")
      throw new Error("Matrix startVerification currently supports only SAS directly");
    const verifier = await session.request.startVerification(VerificationMethod.Sas);
    this.attachVerifierToVerificationSession(session, verifier);
    this.ensureVerificationStarted(session);
    return this.buildVerificationSummary(session);
  }
  async generateVerificationQr(id) {
    const qr = await this.findVerificationSession(id).request.generateQRCode();
    if (!qr) throw new Error("Matrix verification QR data is not available yet");
    return { qrDataBase64: Buffer.from(qr).toString("base64") };
  }
  async scanVerificationQr(id, qrDataBase64) {
    const session = this.findVerificationSession(id);
    const trimmed = qrDataBase64.trim();
    if (!trimmed) throw new Error("Matrix verification QR payload is required");
    const qrBytes = Buffer.from(trimmed, "base64");
    if (qrBytes.length === 0) throw new Error("Matrix verification QR payload is invalid base64");
    const verifier = await session.request.scanQRCode(new Uint8ClampedArray(qrBytes));
    this.attachVerifierToVerificationSession(session, verifier);
    this.ensureVerificationStarted(session);
    return this.buildVerificationSummary(session);
  }
  async confirmVerificationSas(id) {
    const session = this.findVerificationSession(id);
    const callbacks = session.sasCallbacks ?? session.activeVerifier?.getShowSasCallbacks();
    if (!callbacks)
      throw new Error("Matrix SAS confirmation is not available for this verification request");
    this.clearSasAutoConfirmTimer(session);
    session.sasCallbacks = callbacks;
    session.sasAutoConfirmStarted = true;
    await this.confirmSasForSession(session, callbacks);
    if (session.verifyPromise) await session.verifyPromise;
    this.touchVerificationSession(session);
    return this.buildVerificationSummary(session);
  }
  mismatchVerificationSas(id) {
    const session = this.findVerificationSession(id);
    const callbacks = session.sasCallbacks ?? session.activeVerifier?.getShowSasCallbacks();
    if (!callbacks)
      throw new Error("Matrix SAS mismatch is not available for this verification request");
    this.clearSasAutoConfirmTimer(session);
    session.sasCallbacks = callbacks;
    callbacks.mismatch();
    this.touchVerificationSession(session);
    return this.buildVerificationSummary(session);
  }
  confirmVerificationReciprocateQr(id) {
    const session = this.findVerificationSession(id);
    const callbacks =
      session.reciprocateQrCallbacks ?? session.activeVerifier?.getReciprocateQrCodeCallbacks();
    if (!callbacks)
      throw new Error(
        "Matrix reciprocate-QR confirmation is not available for this verification request",
      );
    session.reciprocateQrCallbacks = callbacks;
    callbacks.confirm();
    this.touchVerificationSession(session);
    return this.buildVerificationSummary(session);
  }
  getVerificationSas(id) {
    const session = this.findVerificationSession(id);
    const callbacks = session.sasCallbacks ?? session.activeVerifier?.getShowSasCallbacks();
    if (!callbacks)
      throw new Error("Matrix SAS data is not available for this verification request");
    session.sasCallbacks = callbacks;
    return {
      decimal: callbacks.sas.decimal,
      emoji: callbacks.sas.emoji,
    };
  }
};
//#endregion
//#region extensions/matrix/src/matrix/sdk/crypto-runtime.ts
installFakeIndexedDbTransactionPruner();
//#endregion
export {
  MatrixCryptoBootstrapper,
  MatrixDecryptBridge,
  MatrixVerificationManager,
  createMatrixCryptoFacade,
  isMatrixDeviceOwnerVerified,
  isMatrixDeviceVerifiedInCurrentClient,
  persistIdbToDisk,
  restoreIdbFromDisk,
};
