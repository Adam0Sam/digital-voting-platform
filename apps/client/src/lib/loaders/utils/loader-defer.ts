import { defer } from 'react-router-dom';
import { LOADER_IDS, LOADER_ID_MAP, LoaderReturnType } from './loader-map';

export declare class DeferredData<T = unknown> {
  private pendingKeysSet;
  private controller;
  private abortPromise;
  private unlistenAbortSignal;
  private subscribers;
  data: Record<'data', T>;
  init?: ResponseInit;
  deferredKeys: string[];
  constructor(data: Record<'data', T>, responseInit?: ResponseInit);
  private trackPromise;
  private onSettle;
  private emit;
  subscribe(fn: (aborted: boolean, settledKey?: string) => void): () => boolean;
  cancel(): void;
  resolveData(signal: AbortSignal): Promise<boolean>;
  get done(): boolean;
  get unwrappedData(): object;
  get pendingKeys(): string[];
}

export const loaderDefer: <T extends keyof typeof LOADER_IDS>(
  id: T,
) => DeferredData<LoaderReturnType<typeof id>> = id => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const promise = LOADER_ID_MAP[id]({ request: {} } as any);
  return defer({
    data: promise,
  }) as unknown as DeferredData<LoaderReturnType<typeof id>>;
};
