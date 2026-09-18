//#region extensions/device-pair/pairing-qr-channel-data.d.ts
type DevicePairPairingQrChannelData = {
  setupCode: string;
  expiresAtMs: number;
};
declare function buildDevicePairPairingQrChannelData(
  params: DevicePairPairingQrChannelData,
): Record<string, unknown>;
//#endregion
export { buildDevicePairPairingQrChannelData };
