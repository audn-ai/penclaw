//#region extensions/device-pair/pairing-qr-channel-data.ts
const DEVICE_PAIR_PAIRING_QR_CHANNEL_DATA_KEY = "openclawPairingQr";
function buildDevicePairPairingQrChannelData(params) {
  return {
    [DEVICE_PAIR_PAIRING_QR_CHANNEL_DATA_KEY]: {
      setupCode: params.setupCode,
      expiresAtMs: params.expiresAtMs,
    },
  };
}
//#endregion
export { buildDevicePairPairingQrChannelData as t };
