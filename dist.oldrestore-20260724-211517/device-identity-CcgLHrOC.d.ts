//#region src/infra/device-identity.d.ts
/** Gateway/device Ed25519 identity used for APNs relay and gateway authentication. */
type DeviceIdentity = {
  deviceId: string;
  publicKeyPem: string;
  privateKeyPem: string;
};
//#endregion
export { DeviceIdentity as t };
