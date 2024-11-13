import { createAsyncResource } from './async-resource';

export function createCachedAsyncResource<T = unknown>(
  cache: Map<string, ReturnType<typeof createAsyncResource<T>>>,
  cacheKey: string,
) {
  return function (promiseFactory: () => Promise<T>, key: string = cacheKey) {
    if (!cache.has(key)) {
      cache.set(key, createAsyncResource(promiseFactory()));
    }
    return cache.get(key)!;
  };
}

export function getCachedFunction<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => TResult,
) {
  const cache: Record<string, TResult> = {};
  return (...args: TArgs) => {
    const key = JSON.stringify(args);
    if (cache[key]) {
      return cache[key];
    }
    cache[key] = fn(...args);
    return cache[key];
  };
}
