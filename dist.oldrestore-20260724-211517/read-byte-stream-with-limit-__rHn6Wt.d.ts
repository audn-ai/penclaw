//#region packages/media-core/src/read-byte-stream-with-limit.d.ts
/** Details passed to byte-stream overflow error factories. */
type ByteStreamLimitOverflow = {
  size: number;
  maxBytes: number;
};
/** Options for reading an async byte stream under a hard byte cap. */
type ReadByteStreamWithLimitOptions = {
  maxBytes: number;
  onOverflow?: (params: ByteStreamLimitOverflow) => Error;
};
/** Reads and concatenates an async byte stream, throwing once the byte cap is exceeded. */
declare function readByteStreamWithLimit(
  stream: AsyncIterable<unknown>,
  opts: ReadByteStreamWithLimitOptions,
): Promise<Buffer>;
//#endregion
export {
  ReadByteStreamWithLimitOptions as n,
  readByteStreamWithLimit as r,
  ByteStreamLimitOverflow as t,
};
