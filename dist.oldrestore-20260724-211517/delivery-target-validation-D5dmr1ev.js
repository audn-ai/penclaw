//#region src/cron/delivery-target-validation.ts
function assertNonBlankStringField(field, value) {
  if (value === void 0 || value === null) return;
  if (typeof value !== "string" || !value.trim())
    throw new Error(`${field} must be a non-empty string`);
}
function assertCronDeliveryInputNonBlankFields(delivery, fieldPrefix = "delivery") {
  if (!delivery || typeof delivery !== "object") return;
  const deliveryRecord = delivery;
  assertNonBlankStringField(`${fieldPrefix}.channel`, deliveryRecord.channel);
  assertNonBlankStringField(`${fieldPrefix}.to`, deliveryRecord.to);
  const failureDestination = deliveryRecord.failureDestination;
  if (failureDestination && typeof failureDestination === "object") {
    const failureRecord = failureDestination;
    assertNonBlankStringField(`${fieldPrefix}.failureDestination.channel`, failureRecord.channel);
    assertNonBlankStringField(`${fieldPrefix}.failureDestination.to`, failureRecord.to);
  }
  const completionDestination = deliveryRecord.completionDestination;
  if (completionDestination && typeof completionDestination === "object") {
    const completionRecord = completionDestination;
    assertNonBlankStringField(`${fieldPrefix}.completionDestination.to`, completionRecord.to);
  }
}
//#endregion
export { assertCronDeliveryInputNonBlankFields as t };
