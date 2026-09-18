import { TSchema } from "typebox";

//#region src/shared/json-schema.types.d.ts
/** TypeBox schema value widened for generic JSON-schema object transforms. */
type JsonSchemaObject = TSchema & Record<string, unknown>;
//#endregion
export { JsonSchemaObject as t };
