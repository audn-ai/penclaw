import { i as readFileWithinRoot, o as writeFileWithinRoot } from "../fs-safe-D8PM9Nw8.js";
import {
  a as safeFileURLToPath,
  n as basenameFromMediaSource,
} from "../local-file-access-D90E6wj_.js";
import { t as readLocalFileFromRoots } from "../local-roots-D7NlqhKK.js";
import { c as root } from "../root-impl-D9lbqUdh.js";

//#region src/infra/fs-safe-remove.d.ts
declare function removePathWithinRoot(params: {
  rootDir: string;
  relativePath: string;
  recursive?: boolean;
  force?: boolean;
}): Promise<void>;
//#endregion
export {
  basenameFromMediaSource,
  readFileWithinRoot,
  readLocalFileFromRoots,
  removePathWithinRoot,
  root,
  safeFileURLToPath,
  writeFileWithinRoot,
};
