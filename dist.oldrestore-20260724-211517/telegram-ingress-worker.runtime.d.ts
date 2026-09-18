import { A as TelegramNetworkConfig } from "./types.channels-CYB_Xphv.js";
//#region extensions/telegram/src/telegram-ingress-worker.d.ts
type TelegramIngressWorkerMessage =
  | {
      type: "poll-start";
      offset: number | null;
      startedAt: number;
    }
  | {
      type: "poll-success";
      offset: number | null;
      count: number;
      finishedAt: number;
    }
  | {
      type: "poll-error";
      message: string /** Telegram Bot API error_code (e.g. 409 for getUpdates conflicts). */;
      errorCode?: number;
      finishedAt: number;
    }
  | {
      type: "spooled";
      updateId: number;
      queued: number;
    }
  | {
      type: "update";
      requestId: string;
      update: unknown;
      queued: number;
    };
type TelegramIngressWorkerCommand =
  | {
      type: "stop";
    }
  | {
      type: "spool-ack";
      requestId: string;
      result:
        | {
            ok: true;
            updateId: number;
          }
        | {
            ok: false;
            message: string;
          };
    };
type TelegramIngressWorkerOptions = {
  token: string;
  accountId: string;
  initialUpdateId: number | null;
  spoolDir: string;
  apiRoot?: string;
  timeoutSeconds?: number;
  network?: TelegramNetworkConfig;
  proxy?: string;
};
//#endregion
//#region extensions/telegram/src/telegram-ingress-worker.runtime.d.ts
type TelegramIngressRuntimePort = {
  postMessage(message: TelegramIngressWorkerMessage): void;
  onMessage(listener: (message: TelegramIngressWorkerCommand) => void): void;
  close(): void;
};
type TelegramIngressRuntimeDeps = {
  fetch?: typeof fetch;
  closeTransport?: () => Promise<void>;
};
declare function runTelegramIngressWorkerRuntime(params: {
  options: TelegramIngressWorkerOptions;
  port: TelegramIngressRuntimePort;
  deps?: TelegramIngressRuntimeDeps;
}): Promise<void>;
//#endregion
export { runTelegramIngressWorkerRuntime };
