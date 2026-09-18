import { createHash, createHmac, randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { homedir, hostname } from "node:os";
import path from "node:path";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { K as resolveExecApprovalsFromFile } from "./exec-approvals-Bz218bS2.js";
import { A as resolvePositiveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import { r as resolveProviderIdForAuth } from "./provider-auth-aliases-RaEzqkSo.js";
import "./number-runtime-B-n-wjMn.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./routing-CwvmVRHd.js";
import {
  An as preprocess,
  At as boolean,
  Et as array,
  Nn as record,
  Rn as string,
  Tn as object,
  Xn as union,
  Zn as unknown,
  dn as literal,
  wn as number,
  yt as _enum,
} from "./schemas-CBJjibl3.js";
import "./exec-approvals-runtime-gbeupxm-.js";
import "./agent-runtime-BiQiwmwD.js";
import { r as buildSecretInputSchema } from "./secret-input-D1aG0n6v.js";
import { d as normalizeTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
import { f as normalizeResolvedSecretInputString } from "./types.secrets-BV0ywRAy.js";
import { n as detectWindowsSpawnCommandInlineArgs } from "./windows-spawn-C5RDaB22.js";
//#region node_modules/smol-toml/dist/date.js
/*!
 * Copyright (c) Squirrel Chat et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
let DATE_TIME_RE =
  /^(\d{4}-\d{2}-\d{2})?[T ]?(?:(\d{2}):\d{2}(?::\d{2}(?:\.\d+)?)?)?(Z|[-+]\d{2}:\d{2})?$/i;
var TomlDate = class TomlDate extends Date {
  #hasDate = false;
  #hasTime = false;
  #offset = null;
  constructor(date) {
    let hasDate = true;
    let hasTime = true;
    let offset = "Z";
    if (typeof date === "string") {
      let match = date.match(DATE_TIME_RE);
      if (match) {
        if (!match[1]) {
          hasDate = false;
          date = `0000-01-01T${date}`;
        }
        hasTime = !!match[2];
        hasTime && date[10] === " " && (date = date.replace(" ", "T"));
        if (match[2] && +match[2] > 23) date = "";
        else {
          offset = match[3] || null;
          date = date.toUpperCase();
          if (!offset && hasTime) date += "Z";
        }
      } else date = "";
    }
    super(date);
    if (!isNaN(this.getTime())) {
      this.#hasDate = hasDate;
      this.#hasTime = hasTime;
      this.#offset = offset;
    }
  }
  isDateTime() {
    return this.#hasDate && this.#hasTime;
  }
  isLocal() {
    return !this.#hasDate || !this.#hasTime || !this.#offset;
  }
  isDate() {
    return this.#hasDate && !this.#hasTime;
  }
  isTime() {
    return this.#hasTime && !this.#hasDate;
  }
  isValid() {
    return this.#hasDate || this.#hasTime;
  }
  toISOString() {
    let iso = super.toISOString();
    if (this.isDate()) return iso.slice(0, 10);
    if (this.isTime()) return iso.slice(11, 23);
    if (this.#offset === null) return iso.slice(0, -1);
    if (this.#offset === "Z") return iso;
    let offset = +this.#offset.slice(1, 3) * 60 + +this.#offset.slice(4, 6);
    offset = this.#offset[0] === "-" ? offset : -offset;
    return (
      /* @__PURE__ */ new Date(this.getTime() - offset * 6e4).toISOString().slice(0, -1) +
      this.#offset
    );
  }
  static wrapAsOffsetDateTime(jsDate, offset = "Z") {
    let date = new TomlDate(jsDate);
    date.#offset = offset;
    return date;
  }
  static wrapAsLocalDateTime(jsDate) {
    let date = new TomlDate(jsDate);
    date.#offset = null;
    return date;
  }
  static wrapAsLocalDate(jsDate) {
    let date = new TomlDate(jsDate);
    date.#hasTime = false;
    date.#offset = null;
    return date;
  }
  static wrapAsLocalTime(jsDate) {
    let date = new TomlDate(jsDate);
    date.#hasDate = false;
    date.#offset = null;
    return date;
  }
};
//#endregion
//#region node_modules/smol-toml/dist/error.js
/*!
 * Copyright (c) Squirrel Chat et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
function getLineColFromPtr(string, ptr) {
  let lines = string.slice(0, ptr).split(/\r\n|\n|\r/g);
  return [lines.length, lines.pop().length + 1];
}
function makeCodeBlock(string, line, column) {
  let lines = string.split(/\r\n|\n|\r/g);
  let codeblock = "";
  let numberLen = (Math.log10(line + 1) | 0) + 1;
  for (let i = line - 1; i <= line + 1; i++) {
    let l = lines[i - 1];
    if (!l) continue;
    codeblock += i.toString().padEnd(numberLen, " ");
    codeblock += ":  ";
    codeblock += l;
    codeblock += "\n";
    if (i === line) {
      codeblock += " ".repeat(numberLen + column + 2);
      codeblock += "^\n";
    }
  }
  return codeblock;
}
var TomlError = class extends Error {
  line;
  column;
  codeblock;
  constructor(message, options) {
    const [line, column] = getLineColFromPtr(options.toml, options.ptr);
    const codeblock = makeCodeBlock(options.toml, line, column);
    super(`Invalid TOML document: ${message}\n\n${codeblock}`, options);
    this.line = line;
    this.column = column;
    this.codeblock = codeblock;
  }
};
//#endregion
//#region node_modules/smol-toml/dist/primitive.js
/*!
 * Copyright (c) Squirrel Chat et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
let INT_REGEX = /^((0x[0-9a-fA-F](_?[0-9a-fA-F])*)|(([+-]|0[ob])?\d(_?\d)*))$/;
let FLOAT_REGEX = /^[+-]?\d(_?\d)*(\.\d(_?\d)*)?([eE][+-]?\d(_?\d)*)?$/;
let LEADING_ZERO = /^[+-]?0[0-9_]/;
function parseString(str, ptr) {
  let c = str[ptr++];
  let first = c;
  let isLiteral = c === "'";
  let isMultiline = c === str[ptr] && c === str[ptr + 1];
  if (isMultiline) {
    if (str[(ptr += 2)] === "\n") ptr++;
    else if (str[ptr] === "\r" && str[ptr + 1] === "\n") ptr += 2;
  }
  let parsed = "";
  let sliceStart = ptr;
  let state = 0;
  for (let i = ptr; i < str.length; i++) {
    c = str[i];
    if (isMultiline && (c === "\n" || (c === "\r" && str[i + 1] === "\n"))) state = state && 3;
    else if ((c < " " && c !== "	") || c === "")
      throw new TomlError("control characters are not allowed in strings", {
        toml: str,
        ptr: i,
      });
    else if (
      (!state || state === 3) &&
      c === first &&
      (!isMultiline || (str[i + 1] === first && str[i + 2] === first))
    ) {
      if (isMultiline) {
        if (str[i + 3] === first) i++;
        if (str[i + 3] === first) i++;
      }
      return [state ? parsed : parsed + str.slice(sliceStart, i), i + (isMultiline ? 3 : 1)];
    } else if (!state) {
      if (!isLiteral && c === "\\") {
        parsed += str.slice(sliceStart, (sliceStart = i));
        state = 1;
      }
    } else if (state === 1)
      if (c === "x" || c === "u" || c === "U") {
        let value = 0;
        let len = c === "x" ? 2 : c === "u" ? 4 : 8;
        for (let j = 0; j < len; j++, i++) {
          let hex = str.charCodeAt(i + 1);
          let digit =
            hex >= 48 && hex <= 57
              ? hex - 48
              : hex >= 65 && hex <= 70
                ? hex - 65 + 10
                : hex >= 97 && hex <= 102
                  ? hex - 97 + 10
                  : -1;
          if (digit < 0)
            throw new TomlError("invalid non-hex character in unicode escape", {
              toml: str,
              ptr: i + 1,
            });
          value = (value << 4) | digit;
        }
        if (value < 0 || value > 1114111 || (value >= 55296 && value <= 57343))
          throw new TomlError("invalid unicode escape", {
            toml: str,
            ptr: i,
          });
        parsed += String.fromCodePoint(value);
        sliceStart = i + 1;
        state = 0;
      } else if (c === " " || c === "	") state = 2;
      else {
        if (c === "b") parsed += "\b";
        else if (c === "t") parsed += "	";
        else if (c === "n") parsed += "\n";
        else if (c === "f") parsed += "\f";
        else if (c === "r") parsed += "\r";
        else if (c === "e") parsed += "\x1B";
        else if (c === '"') parsed += '"';
        else if (c === "\\") parsed += "\\";
        else
          throw new TomlError("unrecognized escape sequence", {
            toml: str,
            ptr: i,
          });
        sliceStart = i + 1;
        state = 0;
      }
    else if (c !== " " && c !== "	") {
      if (state === 2)
        throw new TomlError("invalid escape: only line-ending whitespace may be escaped", {
          toml: str,
          ptr: sliceStart,
        });
      state = !isLiteral && c === "\\" ? 1 : 0;
      sliceStart = i;
    }
  }
  throw new TomlError("unfinished string", {
    toml: str,
    ptr,
  });
}
function parseValue(value, toml, ptr, integersAsBigInt) {
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "-inf") return -Infinity;
  if (value === "inf" || value === "+inf") return Infinity;
  if (value === "nan" || value === "+nan" || value === "-nan") return NaN;
  if (value === "-0") return integersAsBigInt ? 0n : 0;
  let isInt = INT_REGEX.test(value);
  if (isInt || FLOAT_REGEX.test(value)) {
    if (LEADING_ZERO.test(value))
      throw new TomlError("leading zeroes are not allowed", {
        toml,
        ptr,
      });
    value = value.replace(/_/g, "");
    let numeric = +value;
    if (isNaN(numeric))
      throw new TomlError("invalid number", {
        toml,
        ptr,
      });
    if (isInt) {
      if ((isInt = !Number.isSafeInteger(numeric)) && !integersAsBigInt)
        throw new TomlError("integer value cannot be represented losslessly", {
          toml,
          ptr,
        });
      if (isInt || integersAsBigInt === true) numeric = BigInt(value);
    }
    return numeric;
  }
  const date = new TomlDate(value);
  if (!date.isValid())
    throw new TomlError("invalid value", {
      toml,
      ptr,
    });
  return date;
}
//#endregion
//#region node_modules/smol-toml/dist/util.js
/*!
 * Copyright (c) Squirrel Chat et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
function indexOfNewline(str, start = 0, end = str.length) {
  let idx = str.indexOf("\n", start);
  if (str[idx - 1] === "\r") idx--;
  return idx <= end ? idx : -1;
}
function skipComment(str, ptr) {
  for (let i = ptr; i < str.length; i++) {
    let c = str[i];
    if (c === "\n") return i;
    if (c === "\r" && str[i + 1] === "\n") return i + 1;
    if ((c < " " && c !== "	") || c === "")
      throw new TomlError("control characters are not allowed in comments", {
        toml: str,
        ptr,
      });
  }
  return str.length;
}
function skipVoid(str, ptr, banNewLines, banComments) {
  let c;
  while (1) {
    while (
      (c = str[ptr]) === " " ||
      c === "	" ||
      (!banNewLines && (c === "\n" || (c === "\r" && str[ptr + 1] === "\n")))
    )
      ptr++;
    if (banComments || c !== "#") break;
    ptr = skipComment(str, ptr);
  }
  return ptr;
}
function skipUntil(str, ptr, sep, end, banNewLines = false) {
  if (!end) {
    ptr = indexOfNewline(str, ptr);
    return ptr < 0 ? str.length : ptr;
  }
  for (let i = ptr; i < str.length; i++) {
    let c = str[i];
    if (c === "#") i = indexOfNewline(str, i);
    else if (c === sep) return i + 1;
    else if (c === end || (banNewLines && (c === "\n" || (c === "\r" && str[i + 1] === "\n"))))
      return i;
  }
  throw new TomlError("cannot find end of structure", {
    toml: str,
    ptr,
  });
}
//#endregion
//#region node_modules/smol-toml/dist/extract.js
/*!
 * Copyright (c) Squirrel Chat et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
function sliceAndTrimEndOf(str, startPtr, endPtr) {
  let value = str.slice(startPtr, endPtr);
  let commentIdx = value.indexOf("#");
  if (commentIdx > -1) {
    skipComment(str, commentIdx);
    value = value.slice(0, commentIdx);
  }
  return [value.trimEnd(), commentIdx];
}
function extractValue(str, ptr, end, depth, integersAsBigInt) {
  if (depth === 0)
    throw new TomlError("document contains excessively nested structures. aborting.", {
      toml: str,
      ptr,
    });
  let c = str[ptr];
  if (c === "[" || c === "{") {
    let [value, endPtr] =
      c === "["
        ? parseArray(str, ptr, depth, integersAsBigInt)
        : parseInlineTable(str, ptr, depth, integersAsBigInt);
    if (end) {
      endPtr = skipVoid(str, endPtr);
      if (str[endPtr] === ",") endPtr++;
      else if (str[endPtr] !== end)
        throw new TomlError("expected comma or end of structure", {
          toml: str,
          ptr: endPtr,
        });
    }
    return [value, endPtr];
  }
  if (c === '"' || c === "'") {
    let [parsed, endPtr] = parseString(str, ptr);
    if (end) {
      endPtr = skipVoid(str, endPtr);
      if (
        str[endPtr] &&
        str[endPtr] !== "," &&
        str[endPtr] !== end &&
        str[endPtr] !== "\n" &&
        str[endPtr] !== "\r"
      )
        throw new TomlError("unexpected character encountered", {
          toml: str,
          ptr: endPtr,
        });
      if (str[endPtr] === ",") endPtr++;
    }
    return [parsed, endPtr];
  }
  let endPtr = skipUntil(str, ptr, ",", end);
  let slice = sliceAndTrimEndOf(str, ptr, endPtr - (str[endPtr - 1] === "," ? 1 : 0));
  if (!slice[0])
    throw new TomlError("incomplete key-value declaration: no value specified", {
      toml: str,
      ptr,
    });
  if (end && slice[1] > -1) {
    endPtr = skipVoid(str, ptr + slice[1]);
    if (str[endPtr] === ",") endPtr++;
  }
  return [parseValue(slice[0], str, ptr, integersAsBigInt), endPtr];
}
//#endregion
//#region node_modules/smol-toml/dist/struct.js
/*!
 * Copyright (c) Squirrel Chat et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
let KEY_PART_RE = /^[a-zA-Z0-9-_]+[ \t]*$/;
function parseKey(str, ptr, end = "=") {
  let dot = ptr - 1;
  let parsed = [];
  let endPtr = str.indexOf(end, ptr);
  if (endPtr < 0)
    throw new TomlError("incomplete key-value: cannot find end of key", {
      toml: str,
      ptr,
    });
  do {
    let c = str[(ptr = ++dot)];
    if (c !== " " && c !== "	")
      if (c === '"' || c === "'") {
        if (c === str[ptr + 1] && c === str[ptr + 2])
          throw new TomlError("multiline strings are not allowed in keys", {
            toml: str,
            ptr,
          });
        let [part, eos] = parseString(str, ptr);
        dot = str.indexOf(".", eos);
        let strEnd = str.slice(eos, dot < 0 || dot > endPtr ? endPtr : dot);
        let newLine = indexOfNewline(strEnd);
        if (newLine > -1)
          throw new TomlError("newlines are not allowed in keys", {
            toml: str,
            ptr: ptr + dot + newLine,
          });
        if (strEnd.trimStart())
          throw new TomlError("found extra tokens after the string part", {
            toml: str,
            ptr: eos,
          });
        if (endPtr < eos) {
          endPtr = str.indexOf(end, eos);
          if (endPtr < 0)
            throw new TomlError("incomplete key-value: cannot find end of key", {
              toml: str,
              ptr,
            });
        }
        parsed.push(part);
      } else {
        dot = str.indexOf(".", ptr);
        let part = str.slice(ptr, dot < 0 || dot > endPtr ? endPtr : dot);
        if (!KEY_PART_RE.test(part))
          throw new TomlError("only letter, numbers, dashes and underscores are allowed in keys", {
            toml: str,
            ptr,
          });
        parsed.push(part.trimEnd());
      }
  } while (dot + 1 && dot < endPtr);
  return [parsed, skipVoid(str, endPtr + 1, true, true)];
}
function parseInlineTable(str, ptr, depth, integersAsBigInt) {
  let res = {};
  let seen = /* @__PURE__ */ new Set();
  let c;
  ptr++;
  while ((c = str[ptr++]) !== "}" && c)
    if (c === ",")
      throw new TomlError("expected value, found comma", {
        toml: str,
        ptr: ptr - 1,
      });
    else if (c === "#") ptr = skipComment(str, ptr);
    else if (c !== " " && c !== "	" && c !== "\n" && c !== "\r") {
      let k;
      let t = res;
      let hasOwn = false;
      let [key, keyEndPtr] = parseKey(str, ptr - 1);
      for (let i = 0; i < key.length; i++) {
        if (i) t = hasOwn ? t[k] : (t[k] = {});
        k = key[i];
        if ((hasOwn = Object.hasOwn(t, k)) && (typeof t[k] !== "object" || seen.has(t[k])))
          throw new TomlError("trying to redefine an already defined value", {
            toml: str,
            ptr,
          });
        if (!hasOwn && k === "__proto__")
          Object.defineProperty(t, k, {
            enumerable: true,
            configurable: true,
            writable: true,
          });
      }
      if (hasOwn)
        throw new TomlError("trying to redefine an already defined value", {
          toml: str,
          ptr,
        });
      let [value, valueEndPtr] = extractValue(str, keyEndPtr, "}", depth - 1, integersAsBigInt);
      seen.add(value);
      t[k] = value;
      ptr = valueEndPtr;
    }
  if (!c)
    throw new TomlError("unfinished table encountered", {
      toml: str,
      ptr,
    });
  return [res, ptr];
}
function parseArray(str, ptr, depth, integersAsBigInt) {
  let res = [];
  let c;
  ptr++;
  while ((c = str[ptr++]) !== "]" && c)
    if (c === ",")
      throw new TomlError("expected value, found comma", {
        toml: str,
        ptr: ptr - 1,
      });
    else if (c === "#") ptr = skipComment(str, ptr);
    else if (c !== " " && c !== "	" && c !== "\n" && c !== "\r") {
      let e = extractValue(str, ptr - 1, "]", depth - 1, integersAsBigInt);
      res.push(e[0]);
      ptr = e[1];
    }
  if (!c)
    throw new TomlError("unfinished array encountered", {
      toml: str,
      ptr,
    });
  return [res, ptr];
}
//#endregion
//#region node_modules/smol-toml/dist/parse.js
/*!
 * Copyright (c) Squirrel Chat et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
function peekTable(key, table, meta, type) {
  let t = table;
  let m = meta;
  let k;
  let hasOwn = false;
  let state;
  for (let i = 0; i < key.length; i++) {
    if (i) {
      t = hasOwn ? t[k] : (t[k] = {});
      m = (state = m[k]).c;
      if (type === 0 && (state.t === 1 || state.t === 2)) return null;
      if (state.t === 2) {
        let l = t.length - 1;
        t = t[l];
        m = m[l].c;
      }
    }
    k = key[i];
    if ((hasOwn = Object.hasOwn(t, k)) && m[k]?.t === 0 && m[k]?.d) return null;
    if (!hasOwn) {
      if (k === "__proto__") {
        Object.defineProperty(t, k, {
          enumerable: true,
          configurable: true,
          writable: true,
        });
        Object.defineProperty(m, k, {
          enumerable: true,
          configurable: true,
          writable: true,
        });
      }
      m[k] = {
        t: i < key.length - 1 && type === 2 ? 3 : type,
        d: false,
        i: 0,
        c: {},
      };
    }
  }
  state = m[k];
  if (state.t !== type && !(type === 1 && state.t === 3)) return null;
  if (type === 2) {
    if (!state.d) {
      state.d = true;
      t[k] = [];
    }
    t[k].push((t = {}));
    state.c[state.i++] = state = {
      t: 1,
      d: false,
      i: 0,
      c: {},
    };
  }
  if (state.d) return null;
  state.d = true;
  if (type === 1) t = hasOwn ? t[k] : (t[k] = {});
  else if (type === 0 && hasOwn) return null;
  return [k, t, state.c];
}
function parse(toml, { maxDepth = 1e3, integersAsBigInt } = {}) {
  let res = {};
  let meta = {};
  let tbl = res;
  let m = meta;
  for (let ptr = skipVoid(toml, 0); ptr < toml.length;) {
    if (toml[ptr] === "[") {
      let isTableArray = toml[++ptr] === "[";
      let k = parseKey(toml, (ptr += +isTableArray), "]");
      if (isTableArray) {
        if (toml[k[1] - 1] !== "]")
          throw new TomlError("expected end of table declaration", {
            toml,
            ptr: k[1] - 1,
          });
        k[1]++;
      }
      let p = peekTable(k[0], res, meta, isTableArray ? 2 : 1);
      if (!p)
        throw new TomlError("trying to redefine an already defined table or value", {
          toml,
          ptr,
        });
      m = p[2];
      tbl = p[1];
      ptr = k[1];
    } else {
      let k = parseKey(toml, ptr);
      let p = peekTable(k[0], tbl, m, 0);
      if (!p)
        throw new TomlError("trying to redefine an already defined table or value", {
          toml,
          ptr,
        });
      let v = extractValue(toml, k[1], void 0, maxDepth, integersAsBigInt);
      p[1][p[0]] = v[0];
      ptr = v[1];
    }
    ptr = skipVoid(toml, ptr, true);
    if (toml[ptr] && toml[ptr] !== "\n" && toml[ptr] !== "\r")
      throw new TomlError("each key-value declaration must be followed by an end-of-line", {
        toml,
        ptr,
      });
    ptr = skipVoid(toml, ptr);
  }
  return res;
}
//#endregion
//#region extensions/codex/src/app-server/session-discovery-config.ts
const codexSessionCatalogConfigSchema = object({ enabled: boolean().optional() }).strict();
const codexDiscoveryConfigSchema = object({
  enabled: boolean().optional(),
  timeoutMs: number().positive().optional(),
}).strict();
//#endregion
//#region extensions/codex/src/app-server/config.ts
const START_OPTIONS_KEY_SECRET_SYMBOL = Symbol.for("openclaw.codexAppServerStartOptionsKeySecret");
const START_OPTIONS_KEY_SECRET = getStartOptionsKeySecret();
const UNIX_CODEX_REQUIREMENTS_PATH = "/etc/codex/requirements.toml";
const WINDOWS_CODEX_REQUIREMENTS_SUFFIX = "\\OpenAI\\Codex\\requirements.toml";
const CODEX_APP_SERVER_HOME_DIRNAME = "codex-home";
const CODEX_CONFIG_TOML_FILENAME = "config.toml";
const PLAIN_DECIMAL_NUMBER_RE = /^[+-]?(?:(?:\d+\.?\d*)|(?:\.\d+))$/;
const CODEX_PLUGINS_MARKETPLACE_NAME = "openai-curated";
const CODEX_PLUGINS_WORKSPACE_MARKETPLACE_NAME = "workspace-directory";
function shouldAutoApproveCodexAppServerApprovals(appServer) {
  return (
    appServer.networkProxy === void 0 &&
    appServer.approvalPolicy === "never" &&
    appServer.sandbox === "danger-full-access"
  );
}
const DEFAULT_CODEX_COMPUTER_USE_PLUGIN_NAME = "computer-use";
const DEFAULT_CODEX_COMPUTER_USE_MCP_SERVER_NAME = "computer-use";
const DEFAULT_CODEX_COMPUTER_USE_MARKETPLACE_DISCOVERY_TIMEOUT_MS = 6e4;
const DEFAULT_CODEX_COMPUTER_USE_LIVE_TEST_TIMEOUT_MS = 6e4;
const DEFAULT_CODEX_COMPUTER_USE_TOOL_CALL_TIMEOUT_MS = 6e4;
const DEFAULT_CODEX_COMPUTER_USE_HEALTH_CHECK_INTERVAL_MINUTES = 60;
const DEFAULT_CODEX_APP_SERVER_NETWORK_PROXY_PROFILE_PREFIX = "openclaw-network";
const codexAppServerTransportSchema = _enum(["stdio", "websocket", "unix"]);
const codexAppServerHomeScopeSchema = _enum(["agent", "user"]);
const SecretInputSchema = buildSecretInputSchema();
const codexAppServerPolicyModeSchema = _enum(["yolo", "guardian"]);
const codexAppServerApprovalPolicySchema = preprocess(
  (value) => (value === "on-failure" ? "on-request" : value),
  _enum(["never", "on-request", "untrusted"]),
);
const codexAppServerSandboxSchema = _enum(["read-only", "workspace-write", "danger-full-access"]);
const codexAppServerApprovalsReviewerSchema = _enum(["user", "auto_review", "guardian_subagent"]);
const codexDynamicToolsLoadingSchema = _enum(["searchable", "direct"]);
const codexComputerUseHealthIntervalSchema = union([
  literal(30),
  literal(60),
  literal(120),
  literal(240),
]);
const codexComputerUsePluginCacheModeSchema = _enum(["shared", "independent"]);
const codexPluginDestructivePolicySchema = union([boolean(), literal("auto"), literal("ask")]);
const codexAppServerServiceTierSchema = preprocess(
  (value) => (value === null ? null : normalizeCodexServiceTier(value)),
  string().trim().min(1).nullable().optional(),
).optional();
const codexAppServerExperimentalSchema = object({
  sandboxExecServer: boolean().optional(),
}).strict();
const codexAppServerRemoteWorkspaceRootSchema = string().trim().min(1);
const codexAppServerNetworkProxyDomainPermissionSchema = _enum(["allow", "deny"]);
const codexAppServerNetworkProxyUnixSocketPermissionSchema = _enum(["allow", "none"]);
const codexAppServerNetworkProxySchema = object({
  enabled: boolean().optional(),
  profileName: string().trim().min(1).optional(),
  baseProfile: _enum(["read-only", "workspace"]).optional(),
  mode: _enum(["limited", "full"]).optional(),
  domains: record(string(), codexAppServerNetworkProxyDomainPermissionSchema).optional(),
  unixSockets: record(string(), codexAppServerNetworkProxyUnixSocketPermissionSchema).optional(),
  proxyUrl: string().trim().min(1).optional(),
  socksUrl: string().trim().min(1).optional(),
  enableSocks5: boolean().optional(),
  enableSocks5Udp: boolean().optional(),
  allowUpstreamProxy: boolean().optional(),
  allowLocalBinding: boolean().optional(),
  dangerouslyAllowNonLoopbackProxy: boolean().optional(),
  dangerouslyAllowAllUnixSockets: boolean().optional(),
}).strict();
const codexPluginEntryConfigSchema = object({
  enabled: boolean().optional(),
  marketplaceName: _enum([
    CODEX_PLUGINS_MARKETPLACE_NAME,
    CODEX_PLUGINS_WORKSPACE_MARKETPLACE_NAME,
  ]).optional(),
  pluginName: string().trim().min(1).optional(),
  allow_destructive_actions: codexPluginDestructivePolicySchema.optional(),
}).strict();
const codexPluginsConfigSchema = object({
  enabled: boolean().optional(),
  allow_all_plugins: boolean().optional(),
  allow_destructive_actions: codexPluginDestructivePolicySchema.optional(),
  plugins: record(string(), codexPluginEntryConfigSchema).optional(),
}).strict();
const codexSupervisionEndpointSchema = union([
  object({
    id: string().optional(),
    label: string().optional(),
    transport: literal("stdio-proxy").optional(),
    command: string().optional(),
    args: array(string()).optional(),
    cwd: string().optional(),
  }).strict(),
  object({
    id: string().optional(),
    label: string().optional(),
    transport: literal("websocket"),
    url: string(),
    authTokenEnv: string().optional(),
  }).strict(),
]);
const codexSupervisionConfigSchema = object({
  enabled: boolean().optional(),
  endpoints: array(codexSupervisionEndpointSchema).optional(),
  allowRawTranscripts: boolean().optional(),
  allowWriteControls: boolean().optional(),
}).strict();
const codexPluginConfigSchema = object({
  codexDynamicToolsLoading: codexDynamicToolsLoadingSchema.optional(),
  codexDynamicToolsExclude: array(string()).optional(),
  sessionCatalog: codexSessionCatalogConfigSchema.optional(),
  discovery: codexDiscoveryConfigSchema.optional(),
  computerUse: object({
    enabled: boolean().optional(),
    autoInstall: boolean().optional(),
    marketplaceDiscoveryTimeoutMs: number().positive().optional(),
    liveTestTimeoutMs: number().positive().optional(),
    toolCallTimeoutMs: number().positive().optional(),
    healthCheckEnabled: boolean().optional(),
    healthCheckIntervalMinutes: codexComputerUseHealthIntervalSchema.optional(),
    pluginCacheMode: codexComputerUsePluginCacheModeSchema.optional(),
    strictReadiness: boolean().optional(),
    autoRepair: boolean().optional(),
    marketplaceSource: string().optional(),
    marketplacePath: string().optional(),
    marketplaceName: string().optional(),
    pluginName: string().optional(),
    mcpServerName: string().optional(),
  })
    .strict()
    .optional(),
  codexPlugins: unknown().optional(),
  supervision: codexSupervisionConfigSchema.optional(),
  appServer: object({
    mode: codexAppServerPolicyModeSchema.optional(),
    transport: codexAppServerTransportSchema.optional(),
    homeScope: codexAppServerHomeScopeSchema.optional(),
    command: string().optional(),
    args: union([array(string()), string()]).optional(),
    url: string().optional(),
    authToken: SecretInputSchema.optional(),
    headers: record(string(), SecretInputSchema).optional(),
    clearEnv: array(string()).optional(),
    remoteWorkspaceRoot: codexAppServerRemoteWorkspaceRootSchema.optional(),
    codeModeOnly: boolean().optional(),
    requestTimeoutMs: number().positive().optional(),
    turnCompletionIdleTimeoutMs: number().positive().optional(),
    postToolRawAssistantCompletionIdleTimeoutMs: number().positive().optional(),
    approvalPolicy: codexAppServerApprovalPolicySchema.optional(),
    sandbox: codexAppServerSandboxSchema.optional(),
    approvalsReviewer: codexAppServerApprovalsReviewerSchema.optional(),
    serviceTier: codexAppServerServiceTierSchema,
    networkProxy: codexAppServerNetworkProxySchema.optional(),
    defaultWorkspaceDir: string().optional(),
    experimental: codexAppServerExperimentalSchema.optional(),
  })
    .strict()
    .optional(),
}).strict();
function readCodexPluginConfig(value) {
  const parsed = codexPluginConfigSchema.safeParse(value);
  if (!parsed.success) return {};
  const { codexPlugins: rawCodexPlugins, ...config } = parsed.data;
  const plugins = codexPluginsConfigSchema.safeParse(rawCodexPlugins);
  if (!plugins.success) return config;
  return {
    ...config,
    ...(plugins.data ? { codexPlugins: plugins.data } : {}),
  };
}
function isCodexSandboxExecServerEnabled(pluginConfig) {
  return readCodexPluginConfig(pluginConfig).appServer?.experimental?.sandboxExecServer === true;
}
function assertCodexAppServerCommandHasNoInlineArgs(params) {
  const inlineArgs = detectWindowsSpawnCommandInlineArgs(params.command);
  if (!inlineArgs) return;
  const sourceLabel =
    params.source === "env"
      ? "OPENCLAW_CODEX_APP_SERVER_BIN"
      : "plugins.entries.codex.config.appServer.command";
  const argsLabel =
    params.source === "env"
      ? "OPENCLAW_CODEX_APP_SERVER_ARGS"
      : "plugins.entries.codex.config.appServer.args";
  throw new Error(
    `${sourceLabel} must be only the Codex app-server executable path; "${inlineArgs.executable}" was configured with inline arguments "${inlineArgs.arguments}". Move those arguments to ${argsLabel}, or remove the override to use the managed Codex startup path.`,
  );
}
function resolveCodexPluginsPolicy(pluginConfig) {
  const config = readCodexPluginConfig(pluginConfig).codexPlugins;
  const configured = config !== void 0;
  const enabled = config?.enabled === true;
  const destructivePolicy = resolveCodexPluginDestructivePolicy(
    config?.allow_destructive_actions ?? true,
  );
  const pluginPolicies = Object.entries(config?.plugins ?? {})
    .flatMap(([configKey, entry]) => {
      if (!isCodexPluginMarketplaceName(entry.marketplaceName) || !entry.pluginName) return [];
      const entryDestructivePolicy = resolveCodexPluginDestructivePolicy(
        entry.allow_destructive_actions ?? config?.allow_destructive_actions ?? true,
      );
      return [
        {
          configKey,
          marketplaceName: entry.marketplaceName,
          pluginName: entry.pluginName,
          enabled: enabled && entry.enabled !== false,
          allowDestructiveActions: entryDestructivePolicy.allowDestructiveActions,
          destructiveApprovalMode: entryDestructivePolicy.destructiveApprovalMode,
        },
      ];
    })
    .toSorted((left, right) => left.configKey.localeCompare(right.configKey));
  return {
    configured,
    enabled,
    allowAllPlugins: enabled && config?.allow_all_plugins === true,
    allowDestructiveActions: destructivePolicy.allowDestructiveActions,
    destructiveApprovalMode: destructivePolicy.destructiveApprovalMode,
    pluginPolicies,
  };
}
function isCodexPluginMarketplaceName(value) {
  return value === "openai-curated" || value === "workspace-directory";
}
function resolveCodexPluginDestructivePolicy(policy) {
  if (policy === "auto" || policy === "ask")
    return {
      allowDestructiveActions: true,
      destructiveApprovalMode: policy,
    };
  return {
    allowDestructiveActions: policy,
    destructiveApprovalMode: policy ? "allow" : "deny",
  };
}
function resolveCodexAppServerRuntimeOptions(params = {}) {
  const env = params.env ?? process.env;
  const config = readCodexPluginConfig(params.pluginConfig).appServer ?? {};
  const transport = resolveTransport(config.transport);
  const homeScope = config.homeScope ?? "agent";
  const configCommand = readNonEmptyString(config.command);
  const envCommand = readNonEmptyString(env.OPENCLAW_CODEX_APP_SERVER_BIN);
  const command = configCommand ?? envCommand ?? "codex";
  const commandSource = configCommand ? "config" : envCommand ? "env" : "managed";
  if (commandSource === "config" || commandSource === "env")
    assertCodexAppServerCommandHasNoInlineArgs({
      command,
      source: commandSource,
    });
  const args = resolveArgs(config.args, env.OPENCLAW_CODEX_APP_SERVER_ARGS);
  const headers = normalizeHeaders(config.headers);
  const clearEnv = normalizeStringList(config.clearEnv);
  const authToken = normalizeCodexAppServerSecretInput({
    value: config.authToken,
    path: "plugins.entries.codex.config.appServer.authToken",
  });
  const url = readNonEmptyString(config.url) ?? (transport === "unix" ? "unix://" : void 0);
  const connectionClass = inferCodexAppServerConnectionClass({
    transport,
    url,
  });
  const remoteAppsSubstrate = "preconfigured";
  const remoteWorkspaceRoot = normalizeRemoteWorkspaceRoot(config.remoteWorkspaceRoot);
  const execMode = resolveEffectiveOpenClawExecModeForCodexAppServer({
    execMode: params.execMode,
    execPolicy: params.execPolicy,
  });
  assertCodexAppServerAllowedForOpenClawExecMode(execMode);
  const explicitPolicyMode =
    resolvePolicyMode(config.mode) ?? resolvePolicyMode(env.OPENCLAW_CODEX_APP_SERVER_MODE);
  const configuredSandbox =
    resolveSandbox(config.sandbox) ?? resolveSandbox(env.OPENCLAW_CODEX_APP_SERVER_SANDBOX);
  const explicitApprovalsReviewer = resolveApprovalsReviewer(config.approvalsReviewer);
  const normalizedPolicyMode = resolveCodexPolicyModeForOpenClawExecMode(execMode);
  const ignoreLegacyYoloPolicyMode =
    normalizedPolicyMode === "guardian" && explicitPolicyMode === "yolo";
  const canUseModelBackedReviewer = canUseCodexModelBackedApprovalsReviewerForModel({
    modelProvider: params.modelProvider,
    model: params.model,
    config: params.config,
    env,
    agentDir: params.agentDir,
    codexConfigToml: params.codexConfigToml,
    homeScope,
  });
  const forceUserReviewer =
    (!canUseModelBackedReviewer &&
      (explicitApprovalsReviewer === "auto_review" ||
        explicitApprovalsReviewer === "guardian_subagent" ||
        (explicitPolicyMode === "guardian" && explicitApprovalsReviewer !== "user"))) ||
    (execMode !== void 0 &&
      execMode !== "full" &&
      (execMode !== "auto" || !canUseModelBackedReviewer));
  const forceGuardianReviewer = execMode === "auto" && canUseModelBackedReviewer;
  const execModeRequiringPromptingApprovals =
    execMode === "auto" || execMode === "ask" ? execMode : forceUserReviewer ? "ask" : void 0;
  const forceDangerFullAccessSandbox =
    params.execPolicy?.touched === true &&
    params.execPolicy.security === "full" &&
    params.execPolicy.ask === "always";
  const forceRuntimePolicy =
    forceUserReviewer || forceGuardianReviewer || forceDangerFullAccessSandbox;
  const defaultPolicy =
    explicitPolicyMode && !forceRuntimePolicy && !ignoreLegacyYoloPolicyMode
      ? void 0
      : resolveDefaultCodexAppServerPolicy({
          transport,
          env,
          forceGuardian: normalizedPolicyMode === "guardian",
          forceUserReviewer: forceUserReviewer || !canUseModelBackedReviewer,
          execModeRequiringPromptingApprovals,
          requirementsToml: params.requirementsToml,
          requirementsPath: params.requirementsPath,
          readRequirementsFile: params.readRequirementsFile,
          platform: params.platform,
          hostName: params.hostName,
          execModeRequiringUserReviewer: forceUserReviewer ? execMode : void 0,
        });
  const preserveExplicitAutoSandbox = forceGuardianReviewer && configuredSandbox === "read-only";
  const forcedPolicy = forceRuntimePolicy
    ? {
        approvalPolicy: defaultPolicy?.approvalPolicy ?? "on-request",
        sandbox: preserveExplicitAutoSandbox
          ? void 0
          : forceDangerFullAccessSandbox
            ? selectForcedDangerFullAccessSandbox({
                configuredSandbox,
                defaultPolicy,
                openClawSandboxActive: Boolean(params.openClawSandboxActive),
              })
            : selectForcedPromptingSandbox({
                configuredSandbox,
                defaultSandbox: defaultPolicy?.sandbox,
              }),
        approvalsReviewer:
          defaultPolicy?.approvalsReviewer ?? (forceUserReviewer ? "user" : "auto_review"),
      }
    : void 0;
  const policyMode = ignoreLegacyYoloPolicyMode
    ? normalizedPolicyMode
    : (explicitPolicyMode ?? normalizedPolicyMode ?? defaultPolicy?.mode ?? "yolo");
  const serviceTier = normalizeCodexServiceTier(config.serviceTier);
  const resolvedSandbox =
    forcedPolicy?.sandbox ??
    configuredSandbox ??
    defaultPolicy?.sandbox ??
    (policyMode === "guardian" ? "workspace-write" : "danger-full-access");
  if (transport === "websocket" && !url)
    throw new Error(
      "plugins.entries.codex.config.appServer.url is required when appServer.transport is websocket",
    );
  if (transport === "websocket" && homeScope === "user")
    throw new Error(
      "plugins.entries.codex.config.appServer.homeScope=user requires appServer.transport=stdio or unix",
    );
  if (transport === "unix" && homeScope !== "user")
    throw new Error(
      "plugins.entries.codex.config.appServer.transport=unix requires appServer.homeScope=user",
    );
  if (transport === "unix" && !url?.startsWith("unix://"))
    throw new Error(
      "plugins.entries.codex.config.appServer.url must use unix:// when appServer.transport is unix",
    );
  assertCodexAppServerConnectionSecurity({
    transport,
    url,
    authToken,
    headers,
  });
  const configApprovalPolicy = resolveApprovalPolicy(config.approvalPolicy);
  const envApprovalPolicy = resolveApprovalPolicy(env.OPENCLAW_CODEX_APP_SERVER_APPROVAL_POLICY);
  const approvalPolicy =
    configApprovalPolicy ??
    envApprovalPolicy ??
    defaultPolicy?.approvalPolicy ??
    (policyMode === "guardian" ? "on-request" : "never");
  const approvalPolicySource = configApprovalPolicy
    ? "config"
    : envApprovalPolicy
      ? "env"
      : defaultPolicy?.approvalPolicy
        ? "requirements"
        : "implicit";
  const computerUseConfig = resolveCodexComputerUseConfig({
    pluginConfig: params.pluginConfig,
    env,
  });
  const managedCommandOrder =
    params.managedCommandOrder ??
    (homeScope === "user" || computerUseConfig.enabled ? "desktop-first" : "package-first");
  const includeManagedCommandOrder =
    commandSource === "managed" &&
    (managedCommandOrder === "desktop-first" || params.managedCommandOrder === "package-first");
  const managedComputerUsePluginNames = [
    .../* @__PURE__ */ new Set([
      DEFAULT_CODEX_COMPUTER_USE_PLUGIN_NAME,
      computerUseConfig.pluginName,
    ]),
  ];
  return {
    start: {
      transport,
      homeScope,
      command,
      commandSource,
      ...(includeManagedCommandOrder ? { managedCommandOrder } : {}),
      ...(commandSource === "managed" ? { managedComputerUsePluginNames } : {}),
      args: args.length > 0 ? args : ["app-server", "--listen", "stdio://"],
      ...(url ? { url } : {}),
      ...(authToken ? { authToken } : {}),
      headers,
      ...(transport === "stdio" && clearEnv.length > 0 ? { clearEnv } : {}),
    },
    connectionClass,
    remoteAppsSubstrate,
    ...(remoteWorkspaceRoot ? { remoteWorkspaceRoot } : {}),
    codeModeOnly: config.codeModeOnly === true,
    requestTimeoutMs: normalizePositiveNumber(config.requestTimeoutMs, 6e4),
    turnCompletionIdleTimeoutMs: normalizePositiveNumber(config.turnCompletionIdleTimeoutMs, 6e4),
    ...(config.postToolRawAssistantCompletionIdleTimeoutMs !== void 0
      ? {
          postToolRawAssistantCompletionIdleTimeoutMs: normalizePositiveNumber(
            config.postToolRawAssistantCompletionIdleTimeoutMs,
            6e4,
          ),
        }
      : {}),
    approvalPolicy: forcedPolicy?.approvalPolicy ?? approvalPolicy,
    approvalPolicySource,
    sandbox: resolvedSandbox,
    approvalsReviewer:
      forcedPolicy?.approvalsReviewer ??
      explicitApprovalsReviewer ??
      defaultPolicy?.approvalsReviewer ??
      (policyMode === "guardian" ? "auto_review" : "user"),
    ...(serviceTier ? { serviceTier } : {}),
    ...resolveCodexAppServerNetworkProxy(config.networkProxy, resolvedSandbox),
  };
}
/**
 * Rechecks Codex-owned plugin state at the final spawn boundary, where the
 * effective agent home is known, so Computer Use keeps the desktop app's TCC ownership.
 */
function resolveCodexAppServerStartOptionsForAgent(params) {
  const startOptions = params.startOptions;
  if (
    startOptions.transport !== "stdio" ||
    startOptions.commandSource !== "managed" ||
    startOptions.managedCommandOrder !== void 0
  )
    return startOptions;
  if (startOptions.homeScope === "user")
    return {
      ...startOptions,
      managedCommandOrder: "desktop-first",
    };
  return codexConfigEnablesNativeComputerUse({
    agentDir: params.agentDir,
    codexConfigToml: params.codexConfigToml,
    env: params.env,
    homeScope: "agent",
    pluginNames: startOptions.managedComputerUsePluginNames ?? [
      DEFAULT_CODEX_COMPUTER_USE_PLUGIN_NAME,
    ],
  })
    ? {
        ...startOptions,
        managedCommandOrder: "desktop-first",
      }
    : startOptions;
}
function isCodexAppServerApprovalPolicyAllowedByRequirements(policy, params = {}) {
  const content = readCodexRequirementsToml(params);
  if (content === void 0) return true;
  const allowedApprovalPolicies = parseAllowedApprovalPoliciesFromCodexRequirements(content);
  return allowedApprovalPolicies === void 0 || allowedApprovalPolicies.has(policy);
}
function canUseCodexModelBackedApprovalsReviewerForModel(params) {
  const explicitProvider = params.modelProvider?.trim().toLowerCase();
  const inferredProvider = inferProviderFromModelRef(params.model);
  if (explicitProvider && explicitProvider !== "codex")
    return (
      isTrustedCodexModelBackedApprovalsReviewerProvider(explicitProvider, params) &&
      (inferredProvider === void 0 ||
        isTrustedCodexModelBackedApprovalsReviewerProvider(inferredProvider, params))
    );
  if (inferredProvider !== void 0)
    return isTrustedCodexModelBackedApprovalsReviewerProvider(inferredProvider, params);
  return isTrustedCodexModelBackedApprovalsReviewerProvider(explicitProvider, params);
}
function isTrustedCodexModelBackedOpenAIProvider(params) {
  if (!openAIBaseUrlEnvOverridesAreTrustedForModelBackedReview(params.env)) return false;
  const codexBaseUrlOverrides = readCodexBaseUrlOverridesForModelBackedReview(params);
  if (
    codexBaseUrlOverrides === false ||
    !codexBaseUrlOverrides.openAI.every(isNativeOpenAIBaseUrl) ||
    !codexBaseUrlOverrides.chatGPT.every(isNativeChatGPTBaseUrl)
  )
    return false;
  const openAIProviders = readConfiguredOpenAIProvidersForModelBackedReview(params.config);
  if (openAIProviders.length === 0) return true;
  return openAIProviders.every((openAIProvider) =>
    configuredOpenAIProviderIsTrustedForModelBackedReview(openAIProvider, params.model),
  );
}
function resolveCodexModelBackedReviewerPolicyContext(params) {
  const provider = params.provider?.trim();
  if (provider && provider.toLowerCase() !== "codex")
    return {
      modelProvider: normalizeCodexModelBackedReviewerPolicyProvider(provider),
      model: params.model,
    };
  const bindingModelProvider = params.bindingModelProvider?.trim();
  const currentModel = params.model?.trim();
  const bindingModel = params.bindingModel?.trim();
  if (bindingModelProvider && currentModel && bindingModel && currentModel === bindingModel)
    return {
      modelProvider: normalizeCodexModelBackedReviewerPolicyProvider(bindingModelProvider),
      model: params.model ?? params.bindingModel,
    };
  const currentModelProvider = inferProviderFromModelRef(params.model);
  if (currentModelProvider)
    return {
      modelProvider: normalizeCodexModelBackedReviewerPolicyProvider(currentModelProvider),
      model: params.model,
    };
  if (bindingModelProvider)
    return {
      modelProvider: normalizeCodexModelBackedReviewerPolicyProvider(bindingModelProvider),
      model: params.model ?? params.bindingModel,
    };
  return {
    modelProvider: params.nativeAuthProfile === true ? "openai" : void 0,
    model: params.model ?? params.bindingModel,
  };
}
function resolveCodexComputerUseConfig(params = {}) {
  const env = params.env ?? process.env;
  const config = readCodexPluginConfig(params.pluginConfig).computerUse ?? {};
  const marketplaceSource =
    readNonEmptyString(params.overrides?.marketplaceSource) ??
    readNonEmptyString(config.marketplaceSource) ??
    readNonEmptyString(env.OPENCLAW_CODEX_COMPUTER_USE_MARKETPLACE_SOURCE);
  const marketplacePath =
    readNonEmptyString(params.overrides?.marketplacePath) ??
    readNonEmptyString(config.marketplacePath) ??
    readNonEmptyString(env.OPENCLAW_CODEX_COMPUTER_USE_MARKETPLACE_PATH);
  const marketplaceName =
    readNonEmptyString(params.overrides?.marketplaceName) ??
    readNonEmptyString(config.marketplaceName) ??
    readNonEmptyString(env.OPENCLAW_CODEX_COMPUTER_USE_MARKETPLACE_NAME);
  const configuredPluginName =
    readNonEmptyString(params.overrides?.pluginName) ??
    readNonEmptyString(config.pluginName) ??
    readNonEmptyString(env.OPENCLAW_CODEX_COMPUTER_USE_PLUGIN_NAME);
  const configuredMcpServerName =
    readNonEmptyString(params.overrides?.mcpServerName) ??
    readNonEmptyString(config.mcpServerName) ??
    readNonEmptyString(env.OPENCLAW_CODEX_COMPUTER_USE_MCP_SERVER_NAME);
  const autoInstall =
    params.overrides?.autoInstall ??
    config.autoInstall ??
    readBooleanEnv(env.OPENCLAW_CODEX_COMPUTER_USE_AUTO_INSTALL) ??
    false;
  const marketplaceDiscoveryTimeoutMs = normalizePositiveNumber(
    params.overrides?.marketplaceDiscoveryTimeoutMs ??
      config.marketplaceDiscoveryTimeoutMs ??
      readNumberEnv(env.OPENCLAW_CODEX_COMPUTER_USE_MARKETPLACE_DISCOVERY_TIMEOUT_MS),
    DEFAULT_CODEX_COMPUTER_USE_MARKETPLACE_DISCOVERY_TIMEOUT_MS,
  );
  const liveTestTimeoutMs = normalizePositiveNumber(
    params.overrides?.liveTestTimeoutMs ??
      config.liveTestTimeoutMs ??
      readNumberEnv(env.OPENCLAW_CODEX_COMPUTER_USE_LIVE_TEST_TIMEOUT_MS),
    DEFAULT_CODEX_COMPUTER_USE_LIVE_TEST_TIMEOUT_MS,
  );
  const toolCallTimeoutMs = normalizePositiveNumber(
    params.overrides?.toolCallTimeoutMs ??
      config.toolCallTimeoutMs ??
      readNumberEnv(env.OPENCLAW_CODEX_COMPUTER_USE_TOOL_CALL_TIMEOUT_MS),
    DEFAULT_CODEX_COMPUTER_USE_TOOL_CALL_TIMEOUT_MS,
  );
  const healthCheckIntervalMinutes = normalizeComputerUseHealthCheckIntervalMinutes(
    params.overrides?.healthCheckIntervalMinutes ??
      config.healthCheckIntervalMinutes ??
      readNumberEnv(env.OPENCLAW_CODEX_COMPUTER_USE_HEALTH_CHECK_INTERVAL_MINUTES),
  );
  const healthCheckEnabled =
    params.overrides?.healthCheckEnabled ??
    config.healthCheckEnabled ??
    readBooleanEnv(env.OPENCLAW_CODEX_COMPUTER_USE_HEALTH_CHECK_ENABLED) ??
    false;
  const pluginCacheMode =
    normalizeComputerUsePluginCacheMode(params.overrides?.pluginCacheMode) ??
    normalizeComputerUsePluginCacheMode(config.pluginCacheMode) ??
    normalizeComputerUsePluginCacheMode(env.OPENCLAW_CODEX_COMPUTER_USE_PLUGIN_CACHE_MODE) ??
    "independent";
  const strictReadiness =
    params.overrides?.strictReadiness ??
    config.strictReadiness ??
    readBooleanEnv(env.OPENCLAW_CODEX_COMPUTER_USE_STRICT_READINESS) ??
    false;
  const autoRepair =
    params.overrides?.autoRepair ??
    config.autoRepair ??
    readBooleanEnv(env.OPENCLAW_CODEX_COMPUTER_USE_AUTO_REPAIR) ??
    false;
  return {
    enabled:
      params.overrides?.enabled ??
      config.enabled ??
      readBooleanEnv(env.OPENCLAW_CODEX_COMPUTER_USE) ??
      Boolean(
        autoInstall ||
        marketplaceSource ||
        marketplacePath ||
        marketplaceName ||
        configuredPluginName ||
        configuredMcpServerName,
      ),
    autoInstall,
    marketplaceDiscoveryTimeoutMs,
    liveTestTimeoutMs,
    toolCallTimeoutMs,
    healthCheckEnabled,
    healthCheckIntervalMinutes,
    pluginCacheMode,
    strictReadiness,
    autoRepair,
    pluginName: configuredPluginName ?? DEFAULT_CODEX_COMPUTER_USE_PLUGIN_NAME,
    mcpServerName: configuredMcpServerName ?? DEFAULT_CODEX_COMPUTER_USE_MCP_SERVER_NAME,
    ...(marketplaceSource ? { marketplaceSource } : {}),
    ...(marketplacePath ? { marketplacePath } : {}),
    ...(marketplaceName ? { marketplaceName } : {}),
  };
}
function normalizeComputerUseHealthCheckIntervalMinutes(value) {
  return value === 30 || value === 60 || value === 120 || value === 240
    ? value
    : DEFAULT_CODEX_COMPUTER_USE_HEALTH_CHECK_INTERVAL_MINUTES;
}
function normalizeComputerUsePluginCacheMode(value) {
  return value === "shared" || value === "independent" ? value : null;
}
function codexAppServerStartOptionsKey(options, params = {}) {
  return JSON.stringify({
    transport: options.transport,
    command: options.command,
    commandSource: options.commandSource ?? null,
    managedCommandOrder: options.managedCommandOrder ?? "package-first",
    managedComputerUsePluginNames: [...(options.managedComputerUsePluginNames ?? [])].toSorted(),
    managedFallbackCommandPaths: [...(options.managedFallbackCommandPaths ?? [])],
    args: options.args,
    cwd: options.cwd ?? null,
    url: options.url ?? null,
    authToken: hashSecretForKey(options.authToken, "authToken"),
    headers: Object.entries(options.headers)
      .toSorted(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => [key, hashSecretForKey(value, `header:${key}`)]),
    env: Object.entries(options.env ?? {})
      .toSorted(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => [key, hashSecretForKey(value, `env:${key}`)]),
    clearEnv: [...(options.clearEnv ?? [])].toSorted(),
    authProfileId: params.authProfileId ?? null,
    authBindingFingerprint: params.authBindingFingerprint ?? null,
    agentDir: params.agentDir ?? null,
    fallbackApiKeyCacheKey: params.fallbackApiKeyCacheKey ?? null,
  });
}
function codexSandboxPolicyForTurn(mode, cwd) {
  if (mode === "danger-full-access") return { type: "dangerFullAccess" };
  if (mode === "read-only")
    return {
      type: "readOnly",
      networkAccess: false,
    };
  return {
    type: "workspaceWrite",
    writableRoots: [cwd],
    networkAccess: false,
    excludeTmpdirEnvVar: false,
    excludeSlashTmp: false,
  };
}
/** Resolves the passive supervision control connection without changing harness defaults. */
function resolveCodexSupervisionAppServerRuntimeOptions(params = {}) {
  const pluginConfig = readCodexPluginConfig(params.pluginConfig);
  const appServer = pluginConfig.appServer ?? {};
  const transport = resolveTransport(appServer.transport);
  const homeScope = appServer.homeScope ?? (transport === "websocket" ? "agent" : "user");
  return resolveCodexAppServerRuntimeOptions({
    ...params,
    pluginConfig: {
      ...pluginConfig,
      appServer: {
        ...appServer,
        homeScope,
      },
    },
  });
}
function resolveCodexAppServerNetworkProxy(config, sandbox) {
  if (config?.enabled !== true) return {};
  const fileSystemMode =
    config.baseProfile === "read-only" || (!config.baseProfile && sandbox === "read-only")
      ? "read"
      : "write";
  const networkConfig = removeUndefinedJsonFields({
    enabled: true,
    mode: config.mode,
    domains: normalizeNetworkProxyPermissionMap(config.domains),
    unix_sockets: normalizeNetworkProxyPermissionMap(config.unixSockets),
    proxy_url: readNonEmptyString(config.proxyUrl),
    socks_url: readNonEmptyString(config.socksUrl),
    enable_socks5: config.enableSocks5,
    enable_socks5_udp: config.enableSocks5Udp,
    allow_upstream_proxy: config.allowUpstreamProxy,
    allow_local_binding: config.allowLocalBinding,
    dangerously_allow_non_loopback_proxy: config.dangerouslyAllowNonLoopbackProxy,
    dangerously_allow_all_unix_sockets: config.dangerouslyAllowAllUnixSockets,
  });
  const profile = {
    filesystem: {
      ":minimal": "read",
      ":project_roots": { ".": fileSystemMode },
    },
    network: networkConfig,
  };
  const profileName = resolveNetworkProxyPermissionProfileName(config, profile);
  const configPatch = {
    "features.network_proxy.enabled": true,
    default_permissions: profileName,
    permissions: { [profileName]: profile },
  };
  return {
    networkProxy: {
      profileName,
      configFingerprint: fingerprintCodexAppServerNetworkProxyConfigPatch(configPatch),
      configPatch,
    },
  };
}
function resolveNetworkProxyPermissionProfileName(config, profile) {
  const explicitProfileName = readNonEmptyString(config.profileName);
  if (explicitProfileName) return explicitProfileName;
  const suffix = createHash("sha256")
    .update(
      stableStringifyJson({
        version: 1,
        profile,
      }),
    )
    .digest("hex")
    .slice(0, 16);
  return `${DEFAULT_CODEX_APP_SERVER_NETWORK_PROXY_PROFILE_PREFIX}-${suffix}`;
}
function fingerprintCodexAppServerNetworkProxyConfigPatch(configPatch) {
  return createHash("sha256").update(stableStringifyJson(configPatch)).digest("hex");
}
function normalizeNetworkProxyPermissionMap(value) {
  const entries = Object.entries(value ?? {})
    .map(([key, permission]) => [key.trim(), permission])
    .filter(([key]) => key.length > 0);
  return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
function removeUndefinedJsonFields(value) {
  return Object.fromEntries(Object.entries(value).filter((entry) => entry[1] !== void 0));
}
function stableStringifyJson(value) {
  if (Array.isArray(value)) return `[${value.map((item) => stableStringifyJson(item)).join(",")}]`;
  if (value && typeof value === "object")
    return `{${Object.entries(value)
      .toSorted(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableStringifyJson(item)}`)
      .join(",")}}`;
  return JSON.stringify(value);
}
function withMcpElicitationsApprovalPolicy(policy) {
  if (typeof policy !== "string")
    return {
      granular: {
        ...policy.granular,
        mcp_elicitations: true,
      },
    };
  if (policy === "never")
    return {
      granular: {
        mcp_elicitations: true,
        rules: false,
        sandbox_approval: false,
        request_permissions: false,
        skill_approval: false,
      },
    };
  return {
    granular: {
      mcp_elicitations: true,
      rules: true,
      sandbox_approval: true,
      request_permissions: true,
      skill_approval: true,
    },
  };
}
function resolveTransport(value) {
  return value === "websocket" || value === "unix" ? value : "stdio";
}
function normalizeRemoteWorkspaceRoot(value) {
  return readNonEmptyString(value);
}
function inferCodexAppServerConnectionClass(params) {
  if (params.transport !== "websocket") return "local-loopback";
  return params.url && isLoopbackWebSocketUrl(params.url) ? "local-loopback" : "remote";
}
function assertCodexAppServerConnectionClassConfig(params) {
  if (
    params.connectionClass === "remote" &&
    !hasIdentityBearingWebSocketAuth({
      authToken: params.authToken,
      headers: params.headers,
    })
  )
    throw new Error(
      "remote Codex app-server WebSocket URLs require appServer.authToken or an Authorization header",
    );
}
/** Applies the canonical remote-auth boundary to any Codex AppServer transport. */
function assertCodexAppServerConnectionSecurity(params) {
  assertCodexAppServerConnectionClassConfig({
    connectionClass: inferCodexAppServerConnectionClass(params),
    authToken: params.authToken,
    headers: params.headers,
  });
}
function isLoopbackWebSocketUrl(value) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return false;
  }
  if (parsed.protocol !== "ws:" && parsed.protocol !== "wss:") return false;
  const host = parsed.hostname.toLowerCase();
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    host === "[::1]" ||
    host.startsWith("127.")
  );
}
function hasIdentityBearingWebSocketAuth(params) {
  if (readNonEmptyString(params.authToken)) return true;
  return Object.entries(params.headers).some(
    ([key, value]) =>
      key.trim().toLowerCase() === "authorization" && Boolean(readNonEmptyString(value)),
  );
}
function resolvePolicyMode(value) {
  return value === "guardian" || value === "yolo" ? value : void 0;
}
function resolveDefaultCodexAppServerPolicy(params) {
  if (params.transport !== "stdio")
    return {
      mode: "yolo",
      dangerFullAccessAllowed: true,
    };
  const content = readCodexRequirementsToml(params);
  if (content === void 0) {
    if (!params.forceGuardian)
      return {
        mode: "yolo",
        dangerFullAccessAllowed: true,
      };
    return {
      mode: "guardian",
      dangerFullAccessAllowed: true,
      approvalPolicy: selectGuardianApprovalPolicy(
        void 0,
        params.execModeRequiringPromptingApprovals,
      ),
      approvalsReviewer: params.forceUserReviewer
        ? selectUserApprovalsReviewer(void 0, params.execModeRequiringUserReviewer)
        : selectGuardianApprovalsReviewer(
            void 0,
            params.execModeRequiringPromptingApprovals === "auto" ? "auto" : void 0,
          ),
      sandbox: selectGuardianSandbox(void 0),
    };
  }
  const allowedSandboxModes = parseAllowedSandboxModesFromCodexRequirements(
    content,
    readNonEmptyString(params.hostName) ?? hostname(),
  );
  const allowedApprovalPolicies = parseAllowedApprovalPoliciesFromCodexRequirements(content);
  const allowedApprovalsReviewers = parseAllowedApprovalsReviewersFromCodexRequirements(content);
  const yoloSandboxAllowed =
    allowedSandboxModes === void 0 || allowedSandboxModes.has("danger-full-access");
  const yoloApprovalAllowed =
    allowedApprovalPolicies === void 0 || allowedApprovalPolicies.has("never");
  const yoloReviewerAllowed =
    allowedApprovalsReviewers === void 0 || allowedApprovalsReviewers.has("user");
  if (!params.forceGuardian && yoloSandboxAllowed && yoloApprovalAllowed && yoloReviewerAllowed)
    return {
      mode: "yolo",
      dangerFullAccessAllowed: true,
    };
  return {
    mode: "guardian",
    dangerFullAccessAllowed: yoloSandboxAllowed,
    approvalPolicy: selectGuardianApprovalPolicy(
      allowedApprovalPolicies,
      params.execModeRequiringPromptingApprovals,
    ),
    approvalsReviewer: params.forceUserReviewer
      ? selectUserApprovalsReviewer(allowedApprovalsReviewers, params.execModeRequiringUserReviewer)
      : selectGuardianApprovalsReviewer(
          allowedApprovalsReviewers,
          params.execModeRequiringPromptingApprovals === "auto" ? "auto" : void 0,
        ),
    sandbox: selectGuardianSandbox(allowedSandboxModes),
  };
}
function readCodexRequirementsToml(params) {
  if (params.requirementsToml !== void 0) return params.requirementsToml ?? void 0;
  const requirementsPath =
    readNonEmptyString(params.requirementsPath) ??
    resolveCodexRequirementsPath(params.env ?? process.env, params.platform ?? process.platform);
  try {
    if (params.readRequirementsFile) return params.readRequirementsFile(requirementsPath);
    return readFileSync(requirementsPath, "utf8");
  } catch {
    return;
  }
}
function resolveCodexRequirementsPath(env, platform) {
  if (platform === "win32")
    return `${(readNonEmptyString(env.ProgramData) ?? "C:\\ProgramData").replace(/[\\/]+$/, "")}${WINDOWS_CODEX_REQUIREMENTS_SUFFIX}`;
  return UNIX_CODEX_REQUIREMENTS_PATH;
}
function parseAllowedSandboxModesFromCodexRequirements(content, hostName) {
  const remoteSandboxModes = parseMatchingRemoteSandboxModesFromCodexRequirements(
    content,
    hostName,
  );
  if (remoteSandboxModes !== void 0) return remoteSandboxModes;
  return parseRequirementsSandboxModes(
    parseTopLevelRequirementsStringArray(content, "allowed_sandbox_modes"),
  );
}
function parseAllowedApprovalPoliciesFromCodexRequirements(content) {
  const values = parseTopLevelRequirementsStringArray(content, "allowed_approval_policies");
  if (values === void 0) return;
  const normalizedPolicies = values
    .map((entry) => normalizeRequirementsApprovalPolicy(entry))
    .filter((entry) => entry !== void 0);
  return normalizedPolicies.length > 0 ? new Set(normalizedPolicies) : void 0;
}
function parseAllowedApprovalsReviewersFromCodexRequirements(content) {
  const values = parseTopLevelRequirementsStringArray(content, "allowed_approvals_reviewers");
  if (values === void 0) return;
  const normalizedReviewers = values
    .map((entry) => normalizeRequirementsApprovalsReviewer(entry))
    .filter((entry) => entry !== void 0);
  return normalizedReviewers.length > 0 ? new Set(normalizedReviewers) : void 0;
}
function parseMatchingRemoteSandboxModesFromCodexRequirements(content, hostName) {
  const normalizedHostName = normalizeRequirementsHostName(hostName);
  if (normalizedHostName === void 0) return;
  for (const section of parseTomlArrayTableSections(content, "remote_sandbox_config")) {
    const patterns = parseRequirementsStringArray(section, "hostname_patterns");
    if (!patterns || !requirementsHostNameMatchesAnyPattern(normalizedHostName, patterns)) continue;
    return parseRequirementsSandboxModes(
      parseRequirementsStringArray(section, "allowed_sandbox_modes"),
    );
  }
}
function parseRequirementsSandboxModes(values) {
  if (values === void 0) return;
  const normalizedModes = values
    .map((entry) => normalizeRequirementsSandboxMode(entry))
    .filter((entry) => entry !== void 0);
  return normalizedModes.length > 0 ? new Set(normalizedModes) : void 0;
}
function parseTopLevelRequirementsStringArray(content, key) {
  return parseRequirementsStringArray(
    stripTomlLineComments(content).slice(0, firstTomlTableOffset(content)),
    key,
  );
}
function parseTomlStringValue(content, key) {
  return parseTomlStringAssignmentValue(content, tomlDottedKeyPattern(key));
}
function parseInlineOpenAIModelProviderBaseUrl(content) {
  return parseTomlStringAssignmentValue(
    content,
    `${tomlKeyPattern("model_providers")}\\s*=\\s*\\{[\\s\\S]*?${tomlKeyPattern("openai")}\\s*=\\s*\\{[\\s\\S]*?${tomlKeyPattern("base_url")}`,
  );
}
function parseTomlStringAssignmentValue(content, keyPattern) {
  const assignment = content.match(new RegExp(`(?:^|\\n)\\s*${keyPattern}\\s*=\\s*([^\\r\\n]*)`));
  if (!assignment) return;
  const rawValue = assignment[1]?.trimStart() ?? "";
  if (rawValue.startsWith('"""') || rawValue.startsWith("'''")) return false;
  const match = parseTomlStringAssignment(content, keyPattern);
  return match ? (match[1] ?? match[2] ?? "") : false;
}
function parseTomlStringAssignment(content, keyPattern) {
  return content.match(
    new RegExp(`(?:^|\\n)\\s*${keyPattern}\\s*=\\s*(?:"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"|'([^']*)')`),
  );
}
function tomlDottedKeyPattern(key) {
  return key.split(".").map(tomlKeyPattern).join("\\s*\\.\\s*");
}
function tomlKeyPattern(key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return `(?:"${escaped}"|'${escaped}'|${escaped})`;
}
function parseRequirementsStringArray(content, key) {
  const match = content.match(new RegExp(`(?:^|\\n)\\s*${key}\\s*=\\s*\\[([\\s\\S]*?)\\]`));
  if (!match) return;
  const arrayBody = match[1] ?? "";
  const stringMatches = [...arrayBody.matchAll(/"([^"\\]*(?:\\.[^"\\]*)*)"|'([^']*)'/g)];
  if (stringMatches.length === 0 && arrayBody.trim().length > 0) return;
  return stringMatches.map((entry) => entry[1] ?? entry[2] ?? "");
}
function parseTomlTableSection(content, table) {
  const strippedContent = stripTomlLineComments(content);
  const tablePattern = tomlDottedKeyPattern(table);
  const match = new RegExp(`^\\s*\\[\\s*${tablePattern}\\s*\\]\\s*$`, "m").exec(strippedContent);
  if (!match) return;
  const sectionStart = match.index + match[0].length;
  const rest = strippedContent.slice(sectionStart);
  const nextTableOffset = rest.search(/^\s*\[/m);
  return nextTableOffset === -1 ? rest : rest.slice(0, nextTableOffset);
}
function parseTomlArrayTableSections(content, table) {
  const strippedContent = stripTomlLineComments(content);
  const escapedTable = table.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const headerPattern = new RegExp(`^\\s*\\[\\[\\s*${escapedTable}\\s*\\]\\]\\s*$`, "gm");
  const sections = [];
  for (
    let match = headerPattern.exec(strippedContent);
    match;
    match = headerPattern.exec(strippedContent)
  ) {
    const sectionStart = headerPattern.lastIndex;
    const rest = strippedContent.slice(sectionStart);
    const nextTableOffset = rest.search(/^\s*\[/m);
    sections.push(nextTableOffset === -1 ? rest : rest.slice(0, nextTableOffset));
  }
  return sections;
}
function firstTomlTableOffset(content) {
  return content.match(/^\s*\[[^\]\n]/m)?.index ?? content.length;
}
function stripTomlLineComments(value) {
  let output = "";
  let quote;
  let escaped = false;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index] ?? "";
    if (quote) {
      output += char;
      if (quote === '"' && escaped) {
        escaped = false;
        continue;
      }
      if (quote === '"' && char === "\\") {
        escaped = true;
        continue;
      }
      if (char === quote) quote = void 0;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      output += char;
      continue;
    }
    if (char === "#") {
      while (index < value.length && value[index] !== "\n") index += 1;
      if (value[index] === "\n") output += "\n";
      continue;
    }
    output += char;
  }
  return output;
}
function normalizeRequirementsSandboxMode(value) {
  const compact = value.replace(/[\s_-]/g, "").toLowerCase();
  if (compact === "readonly") return "read-only";
  if (compact === "workspacewrite") return "workspace-write";
  if (compact === "dangerfullaccess") return "danger-full-access";
}
function normalizeRequirementsHostName(value) {
  const normalized = value.trim().replace(/\.+$/g, "").toLowerCase();
  return normalized.length > 0 ? normalized : void 0;
}
function requirementsHostNameMatchesAnyPattern(hostName, patterns) {
  return patterns.some((pattern) => {
    const normalizedPattern = normalizeRequirementsHostName(pattern);
    return normalizedPattern !== void 0 && globPatternMatches(hostName, normalizedPattern);
  });
}
function globPatternMatches(value, pattern) {
  let regex = "^";
  for (const char of pattern)
    if (char === "*") regex += ".*";
    else if (char === "?") regex += ".";
    else regex += char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  regex += "$";
  return new RegExp(regex).test(value);
}
function normalizeRequirementsApprovalPolicy(value) {
  const normalized = value.trim().toLowerCase();
  if (normalized === "on-failure") return "on-request";
  return resolveApprovalPolicy(normalized);
}
function normalizeRequirementsApprovalsReviewer(value) {
  return resolveApprovalsReviewer(value.trim().toLowerCase());
}
function selectGuardianApprovalPolicy(
  allowedApprovalPolicies,
  execModeRequiringPromptingApprovals,
) {
  if (allowedApprovalPolicies === void 0 || allowedApprovalPolicies.has("on-request"))
    return "on-request";
  if (execModeRequiringPromptingApprovals)
    throw new Error(
      `tools.exec.mode=${execModeRequiringPromptingApprovals} requires Codex app-server prompting approvals`,
    );
  if (allowedApprovalPolicies.has("untrusted")) return "untrusted";
  if (allowedApprovalPolicies.has("never")) return "never";
  return "on-request";
}
function selectGuardianApprovalsReviewer(allowedApprovalsReviewers, execModeRequiringAutoReviewer) {
  if (allowedApprovalsReviewers === void 0 || allowedApprovalsReviewers.has("auto_review"))
    return "auto_review";
  if (allowedApprovalsReviewers.has("guardian_subagent")) return "guardian_subagent";
  if (execModeRequiringAutoReviewer)
    throw new Error(
      `tools.exec.mode=${execModeRequiringAutoReviewer} requires Codex app-server auto approvals`,
    );
  if (allowedApprovalsReviewers.has("user")) return "user";
  return "auto_review";
}
function selectUserApprovalsReviewer(allowedApprovalsReviewers, execModeRequiringUserReviewer) {
  if (allowedApprovalsReviewers === void 0 || allowedApprovalsReviewers.has("user")) return "user";
  throw new Error(
    `tools.exec.mode=${execModeRequiringUserReviewer ?? "ask"} requires Codex app-server user approvals`,
  );
}
function isCodexModelBackedApprovalsReviewerProvider(provider) {
  return provider?.trim().toLowerCase() === "openai";
}
function isTrustedCodexModelBackedApprovalsReviewerProvider(provider, params) {
  return (
    isCodexModelBackedApprovalsReviewerProvider(provider) &&
    isTrustedCodexModelBackedOpenAIProvider({
      config: params.config,
      env: params.env,
      model: params.model,
      agentDir: params.agentDir,
      codexConfigToml: params.codexConfigToml,
      homeScope: params.homeScope,
    })
  );
}
function readCodexBaseUrlOverridesForModelBackedReview(params) {
  const configToml = readCodexAppServerConfigToml(params);
  if (configToml === false) return false;
  if (configToml === void 0)
    return {
      openAI: [],
      chatGPT: [],
    };
  const topLevelContent = stripTomlLineComments(configToml).slice(
    0,
    firstTomlTableOffset(configToml),
  );
  const modelProviderOpenAISection = parseTomlTableSection(configToml, "model_providers.openai");
  const openAIBaseUrl = parseTomlStringValue(topLevelContent, "openai_base_url");
  const chatGPTBaseUrl = parseTomlStringValue(topLevelContent, "chatgpt_base_url");
  const openAI = [
    openAIBaseUrl,
    parseTomlStringValue(topLevelContent, "model_providers.openai.base_url"),
    parseInlineOpenAIModelProviderBaseUrl(topLevelContent),
    modelProviderOpenAISection
      ? parseTomlStringValue(modelProviderOpenAISection, "base_url")
      : void 0,
  ];
  const chatGPT = [chatGPTBaseUrl];
  if ([...openAI, ...chatGPT].includes(false)) return false;
  return {
    openAI: openAI.filter((entry) => typeof entry === "string"),
    chatGPT: chatGPT.filter((entry) => typeof entry === "string"),
  };
}
function readCodexAppServerConfigToml(params) {
  if (params.codexConfigToml !== void 0) return params.codexConfigToml ?? void 0;
  const configPath = resolveCodexAppServerConfigPath(params);
  if (!configPath) return;
  try {
    return readFileSync(configPath, "utf8");
  } catch (error) {
    return readErrorCode(error) === "ENOENT" ? void 0 : false;
  }
}
function codexConfigEnablesNativeComputerUse(params) {
  const configToml = readCodexAppServerConfigToml(params);
  if (configToml === false) return true;
  if (configToml === void 0) return false;
  let parsedConfig;
  try {
    parsedConfig = parse(configToml, { integersAsBigInt: true });
  } catch {
    return true;
  }
  const rawPlugins = parsedConfig.plugins;
  if (rawPlugins === void 0) return false;
  const plugins = readRecord(rawPlugins);
  if (!plugins) return true;
  for (const [pluginId, rawPluginConfig] of Object.entries(plugins)) {
    if (
      !params.pluginNames.some(
        (pluginName) => pluginId === pluginName || pluginId.startsWith(`${pluginName}@`),
      )
    )
      continue;
    const pluginConfig = readRecord(rawPluginConfig);
    if (!pluginConfig) return true;
    if (pluginConfig.enabled === false) continue;
    return true;
  }
  return false;
}
function resolveCodexAppServerConfigPath(params) {
  if (params.homeScope === "user")
    return path.join(resolveCodexAppServerUserHomeDir(params.env), CODEX_CONFIG_TOML_FILENAME);
  const agentDir = readNonEmptyString(params.agentDir);
  const codexHome = agentDir
    ? path.join(path.resolve(agentDir), CODEX_APP_SERVER_HOME_DIRNAME)
    : void 0;
  return codexHome ? path.join(codexHome, CODEX_CONFIG_TOML_FILENAME) : void 0;
}
/** Resolves the native user Codex home used by Desktop and the CLI. */
function resolveCodexAppServerUserHomeDir(env = process.env, homedir$1 = homedir) {
  const configured = readNonEmptyString(env.CODEX_HOME);
  return path.resolve(configured ?? path.join(homedir$1(), ".codex"));
}
function readErrorCode(error) {
  return error && typeof error === "object" && "code" in error ? String(error.code) : void 0;
}
function readConfiguredOpenAIProvidersForModelBackedReview(config) {
  const providerRecords = readRecord(readRecord(readRecord(config)?.models)?.providers);
  if (!providerRecords) return [];
  const openAIProviders = [];
  for (const [providerId, providerConfig] of Object.entries(providerRecords)) {
    if (resolveProviderIdForAuth(providerId, { config }) !== "openai") continue;
    const record = readRecord(providerConfig);
    if (record) openAIProviders.push(record);
  }
  return openAIProviders;
}
function configuredOpenAIProviderIsTrustedForModelBackedReview(openAIProvider, modelInput) {
  if (
    readRecord(openAIProvider.localService) ||
    hasNonEmptyRecord(openAIProvider.headers) ||
    hasNonEmptyRecord(openAIProvider.request) ||
    typeof openAIProvider.authHeader === "boolean" ||
    !isNativeOpenAIBaseUrl(openAIProvider.baseUrl)
  )
    return false;
  const models = openAIProvider.models;
  if (!Array.isArray(models)) return true;
  const modelId = normalizeOpenAIModelBackedReviewerModelId(modelInput);
  if (!modelId) return false;
  for (const entry of models) {
    const model = readRecord(entry);
    if (typeof model?.id !== "string" || !matchesConfiguredOpenAIModelId(modelId, model.id))
      continue;
    if (
      hasNonEmptyRecord(model.headers) ||
      hasNonEmptyRecord(model.request) ||
      !isNativeOpenAIBaseUrl(model.baseUrl)
    )
      return false;
  }
  return true;
}
function normalizeOpenAIModelBackedReviewerModelId(modelInput) {
  const normalized = modelInput?.trim() ?? "";
  const authProfileIndex = normalized.indexOf("@");
  const withoutAuthProfile =
    authProfileIndex > 0 ? normalized.slice(0, authProfileIndex) : normalized;
  const slashIndex = withoutAuthProfile.indexOf("/");
  return slashIndex > 0 ? withoutAuthProfile.slice(slashIndex + 1).trim() : withoutAuthProfile;
}
function matchesConfiguredOpenAIModelId(modelId, configuredModelId) {
  const configured = normalizeOpenAIModelBackedReviewerModelId(configuredModelId);
  return Boolean(configured) && (modelId === configured || modelId.startsWith(`${configured}@`));
}
function hasNonEmptyRecord(value) {
  const record = readRecord(value);
  return record !== void 0 && Object.keys(record).length > 0;
}
function isNativeOpenAIBaseUrl(value) {
  if (typeof value !== "string" || !value.trim()) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.toLowerCase() === "api.openai.com";
  } catch {
    return false;
  }
}
function openAIBaseUrlEnvOverridesAreTrustedForModelBackedReview(env) {
  return [env?.OPENAI_BASE_URL, env?.OPENAI_API_BASE].every(isNativeOpenAIBaseUrl);
}
function isNativeChatGPTBaseUrl(value) {
  if (typeof value !== "string" || !value.trim()) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.toLowerCase() === "chatgpt.com";
  } catch {
    return false;
  }
}
function normalizeCodexModelBackedReviewerPolicyProvider(provider) {
  return provider.toLowerCase() === "openai" ? "openai" : provider;
}
function inferProviderFromModelRef(model) {
  const normalized = model?.trim().toLowerCase();
  const slashIndex = normalized?.indexOf("/") ?? -1;
  return slashIndex > 0 ? normalized?.slice(0, slashIndex) : void 0;
}
function selectForcedPromptingSandbox(params) {
  if (params.configuredSandbox === "read-only" || params.defaultSandbox === "read-only")
    return "read-only";
  return params.defaultSandbox ?? "workspace-write";
}
function selectForcedDangerFullAccessSandbox(params) {
  if (params.configuredSandbox === "read-only") return "read-only";
  if (params.defaultPolicy?.dangerFullAccessAllowed === false) {
    if (params.openClawSandboxActive) return params.defaultPolicy.sandbox ?? "workspace-write";
    throw new Error(
      "legacy full exec security with ask requires Codex app-server danger-full-access",
    );
  }
  return "danger-full-access";
}
function selectGuardianSandbox(allowedSandboxModes) {
  if (allowedSandboxModes === void 0 || allowedSandboxModes.has("workspace-write"))
    return "workspace-write";
  if (allowedSandboxModes.has("read-only")) return "read-only";
  if (allowedSandboxModes.has("danger-full-access")) return "danger-full-access";
  return "workspace-write";
}
function resolveApprovalPolicy(value) {
  if (value === "on-failure") return "on-request";
  return value === "on-request" || value === "untrusted" || value === "never" ? value : void 0;
}
function resolveSandbox(value) {
  return value === "read-only" || value === "workspace-write" || value === "danger-full-access"
    ? value
    : void 0;
}
function resolveApprovalsReviewer(value) {
  return value === "auto_review" || value === "guardian_subagent" || value === "user"
    ? value
    : void 0;
}
function resolveOpenClawExecPolicyFromConfig(params) {
  const root = readRecord(params.config);
  const globalExec = readRecord(readRecord(root?.tools)?.exec);
  const globalPolicy = applyOpenClawExecPolicyLayer(createDefaultOpenClawExecPolicy(), globalExec);
  const agentId = params.agentId?.trim();
  if (!agentId) return globalPolicy;
  const agents = readRecord(root?.agents);
  const agentList = Array.isArray(agents?.list) ? agents.list : [];
  const normalizedAgentId = normalizeAgentId(agentId);
  return applyOpenClawExecPolicyLayer(
    globalPolicy,
    readRecord(
      readRecord(
        readRecord(
          agentList.find((entry) => {
            const id = readRecord(entry)?.id;
            return typeof id === "string" && normalizeAgentId(id) === normalizedAgentId;
          }),
        )?.tools,
      )?.exec,
    ),
  );
}
function resolveOpenClawExecPolicyForCodexAppServer(params) {
  const overridePolicy = applyOpenClawExecPolicyLayer(
    resolveOpenClawExecPolicyFromConfig({
      config: params.config,
      agentId: params.agentId,
    }),
    params.execOverrides,
  );
  return applyOpenClawExecApprovalFloors(
    overridePolicy,
    resolveOpenClawExecApprovalFloorsForCodexAppServer({
      approvals: params.approvals,
      agentId: params.agentId,
      policy: overridePolicy,
    }),
  );
}
function resolveEffectiveOpenClawExecModeForCodexAppServer(params) {
  if (params.execPolicy?.touched === true) return params.execPolicy.mode;
  return params.execMode;
}
function resolveCodexPolicyModeForOpenClawExecMode(mode) {
  if (!mode || mode === "full") return;
  return "guardian";
}
function assertCodexAppServerAllowedForOpenClawExecMode(mode) {
  if (mode === "deny" || mode === "allowlist")
    throw new Error(
      `Codex app-server local execution is not available when tools.exec.mode=${mode}`,
    );
}
function createDefaultOpenClawExecPolicy() {
  return {
    security: "full",
    ask: "off",
    touched: false,
  };
}
function applyOpenClawExecPolicyLayer(base, exec) {
  if (!exec) return base;
  const mode = readExecMode(exec.mode);
  if (mode !== void 0)
    return {
      ...resolveOpenClawExecPolicyForMode(mode),
      touched: true,
    };
  const security = readExecSecurity(exec.security);
  const ask = readExecAsk(exec.ask);
  if (security === void 0 && ask === void 0) return base;
  const nextSecurity = security ?? base.security;
  const nextAsk = ask ?? base.ask;
  return {
    mode: resolveOpenClawExecModeFromPolicy({
      security: nextSecurity,
      ask: nextAsk,
    }),
    security: nextSecurity,
    ask: nextAsk,
    touched: true,
  };
}
function resolveOpenClawExecApprovalFloorsForCodexAppServer(params) {
  if (!params.approvals) return;
  return resolveExecApprovalsFromFile({
    file: params.approvals,
    agentId: params.agentId,
    overrides: {
      security: params.policy.security,
      ask: params.policy.ask,
    },
  }).agent;
}
function applyOpenClawExecApprovalFloors(base, approvalFloors) {
  if (!approvalFloors) return base;
  const nextSecurity = approvalFloors.security
    ? minOpenClawExecSecurity(base.security, approvalFloors.security)
    : base.security;
  const nextAsk = approvalFloors.ask ? maxOpenClawExecAsk(base.ask, approvalFloors.ask) : base.ask;
  if (nextSecurity === base.security && nextAsk === base.ask) return base;
  return {
    mode: resolveOpenClawExecModeFromPolicy({
      security: nextSecurity,
      ask: nextAsk,
    }),
    security: nextSecurity,
    ask: nextAsk,
    touched: true,
  };
}
function resolveOpenClawExecPolicyForMode(mode) {
  switch (mode) {
    case "deny":
      return {
        mode,
        security: "deny",
        ask: "off",
      };
    case "allowlist":
      return {
        mode,
        security: "allowlist",
        ask: "off",
      };
    case "ask":
    case "auto":
      return {
        mode,
        security: "allowlist",
        ask: "on-miss",
      };
    case "full":
      return {
        mode,
        security: "full",
        ask: "off",
      };
  }
  return mode;
}
function resolveOpenClawExecModeFromPolicy(params) {
  if (params.security === "deny") return "deny";
  if (params.security === "allowlist" && params.ask === "off") return "allowlist";
  if (params.security === "full" && params.ask !== "always") return "full";
  return "ask";
}
function minOpenClawExecSecurity(left, right) {
  const order = {
    deny: 0,
    allowlist: 1,
    full: 2,
  };
  return order[left] <= order[right] ? left : right;
}
function maxOpenClawExecAsk(left, right) {
  const order = {
    off: 0,
    "on-miss": 1,
    always: 2,
  };
  return order[left] >= order[right] ? left : right;
}
function readExecMode(value) {
  return value === "deny" ||
    value === "allowlist" ||
    value === "ask" ||
    value === "auto" ||
    value === "full"
    ? value
    : void 0;
}
function readRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
function normalizeCodexServiceTier(value) {
  if (typeof value !== "string") return;
  const trimmed = value.trim();
  if (!trimmed) return;
  const normalized = trimmed.toLowerCase();
  if (normalized === "fast" || normalized === "priority") return "priority";
  if (normalized === "flex") return "flex";
  return trimmed;
}
function isCodexFastServiceTier(value) {
  return normalizeCodexServiceTier(value) === "priority";
}
function normalizePositiveNumber(value, fallback) {
  return resolvePositiveTimerTimeoutMs(value, fallback);
}
function normalizeHeaders(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .map(([key, child]) => [
        key.trim(),
        normalizeCodexAppServerSecretInput({
          value: child,
          path: `plugins.entries.codex.config.appServer.headers.${key}`,
        }),
      ])
      .filter((entry) => Boolean(entry[0] && entry[1])),
  );
}
function normalizeCodexAppServerSecretInput(params) {
  return normalizeResolvedSecretInputString(params);
}
function normalizeStringList(value) {
  return normalizeTrimmedStringList(value);
}
function readBooleanEnv(value) {
  if (value === void 0) return;
  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
}
function readExecSecurity(value) {
  return value === "deny" || value === "allowlist" || value === "full" ? value : void 0;
}
function readExecAsk(value) {
  return value === "off" || value === "on-miss" || value === "always" ? value : void 0;
}
function readNumberEnv(value) {
  const trimmed = value?.trim();
  if (!trimmed || !PLAIN_DECIMAL_NUMBER_RE.test(trimmed)) return;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : void 0;
}
function resolveArgs(configArgs, envArgs) {
  if (Array.isArray(configArgs))
    return configArgs.map((entry) => readNonEmptyString(entry)).filter((entry) => entry !== void 0);
  if (typeof configArgs === "string") return splitShellWords(configArgs);
  return splitShellWords(envArgs ?? "");
}
function readNonEmptyString(value) {
  if (typeof value !== "string") return;
  return value.trim() || void 0;
}
function hashSecretForKey(value, label) {
  if (!value) return null;
  return createHmac("sha256", START_OPTIONS_KEY_SECRET)
    .update(label)
    .update("\0")
    .update(value)
    .digest("hex");
}
function getStartOptionsKeySecret() {
  const globalState = globalThis;
  globalState[START_OPTIONS_KEY_SECRET_SYMBOL] ??= randomBytes(32);
  return globalState[START_OPTIONS_KEY_SECRET_SYMBOL];
}
function splitShellWords(value) {
  const words = [];
  let current = "";
  let quote = null;
  for (const char of value) {
    if (quote) {
      if (char === quote) quote = null;
      else current += char;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (/\s/.test(char)) {
      if (current) {
        words.push(current);
        current = "";
      }
      continue;
    }
    current += char;
  }
  if (current) words.push(current);
  return words;
}
//#endregion
export {
  resolveCodexPluginsPolicy as _,
  codexAppServerStartOptionsKey as a,
  shouldAutoApproveCodexAppServerApprovals as b,
  isCodexFastServiceTier as c,
  readCodexPluginConfig as d,
  resolveCodexAppServerRuntimeOptions as f,
  resolveCodexModelBackedReviewerPolicyContext as g,
  resolveCodexComputerUseConfig as h,
  canUseCodexModelBackedApprovalsReviewerForModel as i,
  isCodexSandboxExecServerEnabled as l,
  resolveCodexAppServerUserHomeDir as m,
  CODEX_PLUGINS_WORKSPACE_MARKETPLACE_NAME as n,
  codexSandboxPolicyForTurn as o,
  resolveCodexAppServerStartOptionsForAgent as p,
  assertCodexAppServerConnectionSecurity as r,
  isCodexAppServerApprovalPolicyAllowedByRequirements as s,
  CODEX_PLUGINS_MARKETPLACE_NAME as t,
  normalizeCodexServiceTier as u,
  resolveCodexSupervisionAppServerRuntimeOptions as v,
  withMcpElicitationsApprovalPolicy as x,
  resolveOpenClawExecPolicyForCodexAppServer as y,
};
