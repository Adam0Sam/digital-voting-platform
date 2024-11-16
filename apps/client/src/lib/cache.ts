class ValidCache<T> {
  constructor(
    private cacheStore: Map<string, { value: T; timestamp: number }>,
    private maxCacheSize = 100,
    private validCacheTime = 1000 * 60 * 5,
  ) {}

  private validateSize() {
    if (this.cacheStore.size > this.maxCacheSize) {
      const oldestKey = Array.from(this.cacheStore.entries()).reduce(
        (oldest, [key, { timestamp }]) => {
          if (timestamp < oldest.timestamp) {
            return { key, timestamp };
          }
          return oldest;
        },
        { key: '', timestamp: Date.now() },
      );
      this.cacheStore.delete(oldestKey.key);
    }
  }

  getOrSet(key: string, producer: () => T): T {
    const cached = this.get(key);
    if (cached) return cached;
    const value = producer();
    this.set(key, value);
    return value;
  }

  get(key: string) {
    if (
      this.cacheStore.has(key) &&
      Date.now() - this.cacheStore.get(key)!.timestamp < this.validCacheTime
    ) {
      return this.cacheStore.get(key)!.value;
    }
  }

  set(key: string, value: T) {
    this.validateSize();
    this.cacheStore.set(key, { value, timestamp: Date.now() });
  }
}

export function cacheFunction<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => TResult,
) {
  const validCache = new ValidCache<TResult>(new Map());
  return function (...args: TArgs) {
    return validCache.getOrSet(JSON.stringify(args), () => fn(...args));
  };
}
