import { t as getActiveRuntimePluginRegistry } from "./active-runtime-registry-BeyJcjvw.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
//#region src/agents/stream-iterator-wrapper.ts
/** Wraps an async iterator with custom next/return/throw behavior. */
function createStreamIteratorWrapper(params) {
  return {
    async next() {
      return params.next(params.iterator);
    },
    async return(value) {
      return (
        (await params.onReturn?.(params.iterator, value)) ??
        (await params.iterator.return?.(value)) ?? {
          done: true,
          value: void 0,
        }
      );
    },
    async throw(error) {
      return (
        (await params.onThrow?.(params.iterator, error)) ??
        (await params.iterator.throw?.(error)) ?? {
          done: true,
          value: void 0,
        }
      );
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };
}
//#endregion
//#region src/agents/plugin-text-transforms.ts
/** Merge multiple plugin text-transform sets. */
function mergePluginTextTransforms(...transforms) {
  const input = transforms.flatMap((entry) => entry?.input ?? []);
  const output = transforms.flatMap((entry) => entry?.output ?? []);
  if (input.length === 0 && output.length === 0) return;
  return {
    ...(input.length > 0 ? { input } : {}),
    ...(output.length > 0 ? { output } : {}),
  };
}
/** Apply sequential plugin text replacements to one string. */
function applyPluginTextReplacements(text, replacements) {
  if (!replacements || replacements.length === 0 || !text) return text;
  let next = text;
  for (const replacement of replacements) next = next.replace(replacement.from, replacement.to);
  return next;
}
function transformContentText(content, replacements) {
  if (typeof content === "string") return applyPluginTextReplacements(content, replacements);
  if (Array.isArray(content))
    return content.map((entry) => transformContentText(entry, replacements));
  if (!isRecord(content)) return content;
  const next = { ...content };
  if (typeof next.text === "string")
    next.text = applyPluginTextReplacements(next.text, replacements);
  if (Object.hasOwn(next, "content"))
    next.content = transformContentText(next.content, replacements);
  if (next.type === "toolCall" && Object.hasOwn(next, "arguments"))
    next.arguments = transformToolCallArgumentText(next.arguments, replacements);
  return next;
}
function transformMessageText(message, replacements) {
  if (!isRecord(message)) return message;
  const next = { ...message };
  if (Object.hasOwn(next, "content"))
    next.content = transformContentText(next.content, replacements);
  if (typeof next.errorMessage === "string")
    next.errorMessage = applyPluginTextReplacements(next.errorMessage, replacements);
  return next;
}
function transformToolCallArgumentText(value, replacements) {
  if (typeof value === "string") return applyPluginTextReplacements(value, replacements);
  if (Array.isArray(value))
    return value.map((entry) => transformToolCallArgumentText(entry, replacements));
  if (!isRecord(value)) return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [
      key,
      transformToolCallArgumentText(entry, replacements),
    ]),
  );
}
/** Apply input text replacements to a stream context. */
function transformStreamContextText(context, replacements, options) {
  if (!replacements || replacements.length === 0) return context;
  return {
    ...context,
    systemPrompt:
      options?.systemPrompt !== false && typeof context.systemPrompt === "string"
        ? applyPluginTextReplacements(context.systemPrompt, replacements)
        : context.systemPrompt,
    messages: Array.isArray(context.messages)
      ? context.messages.map((message) => transformMessageText(message, replacements))
      : context.messages,
  };
}
function transformAssistantEventText(event, replacements) {
  if (!isRecord(event) || !replacements || replacements.length === 0) return event;
  const next = { ...event };
  if (next.type === "text_delta" && typeof next.delta === "string")
    next.delta = applyPluginTextReplacements(next.delta, replacements);
  if (next.type === "text_end" && typeof next.content === "string")
    next.content = applyPluginTextReplacements(next.content, replacements);
  if (
    next.type === "toolcall_end" &&
    isRecord(next.toolCall) &&
    Object.hasOwn(next.toolCall, "arguments")
  )
    next.toolCall = {
      ...next.toolCall,
      arguments: transformToolCallArgumentText(next.toolCall.arguments, replacements),
    };
  if (Object.hasOwn(next, "partial"))
    next.partial = transformMessageText(next.partial, replacements);
  if (Object.hasOwn(next, "message"))
    next.message = transformMessageText(next.message, replacements);
  if (Object.hasOwn(next, "error")) next.error = transformMessageText(next.error, replacements);
  return next;
}
function wrapStreamTextTransforms(stream, replacements) {
  if (!replacements || replacements.length === 0) return stream;
  const originalResult = stream.result.bind(stream);
  stream.result = async () => transformMessageText(await originalResult(), replacements);
  const originalAsyncIterator = stream[Symbol.asyncIterator].bind(stream);
  stream[Symbol.asyncIterator] = function () {
    return createStreamIteratorWrapper({
      iterator: originalAsyncIterator(),
      next: async (streamIterator) => {
        const result = await streamIterator.next();
        return result.done
          ? result
          : {
              done: false,
              value: transformAssistantEventText(result.value, replacements),
            };
      },
    });
  };
  return stream;
}
/** Wrap a stream function with plugin input/output text transforms. */
function wrapStreamFnTextTransforms(params) {
  return (model, context, options) => {
    const nextContext = transformStreamContextText(context, params.input, {
      systemPrompt: params.transformSystemPrompt,
    });
    const maybeStream = params.streamFn(model, nextContext, options);
    if (maybeStream && typeof maybeStream === "object" && "then" in maybeStream)
      return Promise.resolve(maybeStream).then((stream) =>
        wrapStreamTextTransforms(stream, params.output),
      );
    return wrapStreamTextTransforms(maybeStream, params.output);
  };
}
//#endregion
//#region src/plugins/text-transforms.runtime.ts
/** Resolves merged text transforms from the active runtime plugin registry. */
function resolveRuntimeTextTransforms() {
  const registry = getActiveRuntimePluginRegistry();
  return mergePluginTextTransforms(
    ...(Array.isArray(registry?.textTransforms)
      ? registry.textTransforms.map((entry) => entry.transforms)
      : []),
  );
}
//#endregion
export {
  createStreamIteratorWrapper as a,
  wrapStreamFnTextTransforms as i,
  applyPluginTextReplacements as n,
  mergePluginTextTransforms as r,
  resolveRuntimeTextTransforms as t,
};
