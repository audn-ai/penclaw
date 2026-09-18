import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/closed-object.ts
function closedObject(properties) {
  return Type.Object(properties, { additionalProperties: false });
}
//#endregion
export { closedObject as t };
