//#region src/infra/json-utf8-bytes.ts
/** Returns the UTF-8 byte length of JSON.stringify(value), falling back to String(value). */
function jsonUtf8Bytes(value) {
  try {
    return Buffer.byteLength(JSON.stringify(value), "utf8");
  } catch {
    return Buffer.byteLength(String(value), "utf8");
  }
}
/** Returns JSON UTF-8 byte length, or Infinity when the value cannot serialize safely. */
function jsonUtf8BytesOrInfinity(value) {
  try {
    const serialized = JSON.stringify(value);
    return typeof serialized === "string"
      ? Buffer.byteLength(serialized, "utf8")
      : Number.POSITIVE_INFINITY;
  } catch {
    return Number.POSITIVE_INFINITY;
  }
}
function jsonStringByteLengthUpToLimit(value, remainingBytes) {
  if (value.length + 2 > remainingBytes) return remainingBytes + 1;
  return jsonUtf8BytesOrInfinity(value);
}
function* enumerableOwnEntries(value) {
  const record = value;
  for (const key in record)
    if (Object.prototype.propertyIsEnumerable.call(record, key)) yield [key, record[key]];
}
/** Returns the first enumerable own keys in JavaScript enumeration order. */
function firstEnumerableOwnKeys(value, maxKeys) {
  const keys = [];
  for (const key in value) {
    if (!Object.prototype.propertyIsEnumerable.call(value, key)) continue;
    keys.push(key);
    if (keys.length >= maxKeys) break;
  }
  return keys;
}
/** Counts JSON UTF-8 bytes up to a hard limit without fully serializing large objects. */
function boundedJsonUtf8Bytes(value, maxBytes) {
  let bytes = 0;
  const seen = /* @__PURE__ */ new WeakSet();
  const add = (amount) => {
    bytes += amount;
    if (bytes > maxBytes) throw new Error("json_byte_limit_exceeded");
  };
  const visit = (entry, inArray) => {
    if (entry === null) {
      add(4);
      return;
    }
    switch (typeof entry) {
      case "string":
        add(jsonStringByteLengthUpToLimit(entry, maxBytes - bytes));
        return;
      case "number":
        add(jsonUtf8BytesOrInfinity(Number.isFinite(entry) ? entry : null));
        return;
      case "boolean":
        add(entry ? 4 : 5);
        return;
      case "undefined":
      case "function":
      case "symbol":
        if (inArray) add(4);
        return;
      case "bigint":
        throw new Error("json_byte_length_unsupported");
      case "object":
        break;
    }
    const objectEntry = entry;
    if (seen.has(objectEntry)) throw new Error("json_byte_length_circular");
    if (typeof objectEntry.toJSON === "function" && !(objectEntry instanceof Date))
      throw new Error("json_byte_length_custom_to_json");
    seen.add(objectEntry);
    try {
      if (objectEntry instanceof Date) {
        visit(objectEntry.toJSON(), inArray);
        return;
      }
      if (Array.isArray(objectEntry)) {
        add(1);
        for (let index = 0; index < objectEntry.length; index += 1) {
          if (index > 0) add(1);
          visit(objectEntry[index], true);
        }
        add(1);
        return;
      }
      add(1);
      let wroteField = false;
      for (const [key, field] of enumerableOwnEntries(objectEntry)) {
        if (field === void 0 || typeof field === "function" || typeof field === "symbol") continue;
        if (wroteField) add(1);
        wroteField = true;
        add(jsonStringByteLengthUpToLimit(key, maxBytes - bytes));
        add(1);
        visit(field, false);
      }
      add(1);
    } finally {
      seen.delete(objectEntry);
    }
  };
  try {
    visit(value, false);
    return {
      bytes,
      complete: true,
    };
  } catch {
    return {
      bytes: Math.max(bytes, maxBytes + 1),
      complete: false,
    };
  }
}
//#endregion
export {
  jsonUtf8BytesOrInfinity as i,
  firstEnumerableOwnKeys as n,
  jsonUtf8Bytes as r,
  boundedJsonUtf8Bytes as t,
};
