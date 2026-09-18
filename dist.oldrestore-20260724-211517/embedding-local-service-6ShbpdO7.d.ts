//#region extensions/memory-core/src/memory/embedding-local-service.d.ts
type MemoryCoreAcquireLocalService = (
  target: {
    providerId: string;
    baseUrl: string;
    headers?: HeadersInit;
  },
  signal?: AbortSignal | null,
) => Promise<
  | {
      release: () => void;
    }
  | undefined
>;
type MemoryCoreLocalServiceHost = {
  acquireLocalService?: MemoryCoreAcquireLocalService;
};
//#endregion
export { MemoryCoreLocalServiceHost as n, MemoryCoreAcquireLocalService as t };
