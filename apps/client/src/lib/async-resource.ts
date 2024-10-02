export function createAsyncResource<T = unknown>(promise: Promise<T>) {
  let status: 'pending' | 'success' | 'error' = 'pending';
  let result: T;
  let error: Error;

  promise.then(
    res => {
      status = 'success';
      result = res;
    },
    err => {
      status = 'error';
      error = err;
    },
  );

  return {
    read() {
      if (status === 'pending') {
        throw promise;
      } else if (status === 'error') {
        throw error;
      } else if (status === 'success') {
        return result;
      }
    },
  };
}

export function createCachedAsyncResource<T = unknown>(
  cache: Map<string, ReturnType<typeof createAsyncResource<T>>>,
  cacheKey: string,
) {
  return function (
    promiseFactory: () => Promise<T> | Promise<T>,
    key: string = cacheKey,
  ) {
    if (!cache.has(key)) {
      cache.set(key, createAsyncResource(promiseFactory()));
    }
    return cache.get(key)!;
  };
}
