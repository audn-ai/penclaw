import { t as replaceFileAtomic } from "./replace-file-DfwQ8_Mi.js";
//#region node_modules/@openclaw/fs-safe/dist/text-atomic.js
async function writeTextAtomic(filePath, content, options) {
  const payload = options?.trailingNewline && !content.endsWith("\n") ? `${content}\n` : content;
  const durable = options?.durable ?? true;
  await replaceFileAtomic({
    filePath,
    content: payload,
    mode: options?.mode ?? 384,
    dirMode: options?.dirMode ?? 511 & ~process.umask(),
    copyFallbackOnPermissionError: true,
    syncTempFile: durable,
    syncParentDir: durable,
  });
}
//#endregion
export { writeTextAtomic as t };
