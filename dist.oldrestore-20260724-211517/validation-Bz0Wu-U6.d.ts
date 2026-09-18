import {
  O as Tool,
  a as AssistantMessageEventStreamContract,
  i as AssistantMessageEvent,
  k as ToolCall,
  r as AssistantMessage,
} from "./types-CqrbBnUB.js";

//#region packages/llm-core/src/utils/event-stream.d.ts
/** Generic async-iterable event stream with a separately awaited final result. */
declare class EventStream<T, R = T> implements AsyncIterable<T> {
  private queue;
  private waiting;
  private done;
  private finalResultPromise;
  private resolveFinalResult;
  private isComplete;
  private extractResult;
  constructor(isComplete: (event: T) => boolean, extractResult: (event: T) => R);
  push(event: T): void;
  end(result?: R): void;
  [Symbol.asyncIterator](): AsyncIterator<T>;
  result(): Promise<R>;
}
/** Assistant-message event stream that resolves on done/error terminal events. */
declare class AssistantMessageEventStream
  extends EventStream<AssistantMessageEvent, AssistantMessage>
  implements AssistantMessageEventStreamContract
{
  constructor();
}
/** Creates an assistant-message stream for provider and plugin adapters. */
declare function createAssistantMessageEventStream(): AssistantMessageEventStream;
//#endregion
//#region packages/llm-core/src/validation.d.ts
/** Finds the target tool and validates/coerces a model-emitted tool call. */
declare function validateToolCall(tools: Tool[], toolCall: ToolCall): unknown;
/** Validates tool arguments against TypeBox or plain JSON-schema parameters. */
declare function validateToolArguments(tool: Tool, toolCall: ToolCall): unknown;
//#endregion
export {
  createAssistantMessageEventStream as a,
  EventStream as i,
  validateToolCall as n,
  AssistantMessageEventStream as r,
  validateToolArguments as t,
};
