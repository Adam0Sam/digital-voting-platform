export type WithValuesAsStrings<T> = {
  [K in keyof T]: string;
};
export type ReadonlyStringLiteralObject<T extends { [key: string]: string }> = {
  readonly [K in keyof T]: T[K];
};

export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type WithDatesAsStrings<T> = {
  [K in keyof T]: T[K] extends Date | undefined ? string : T[K];
};

export function withDatesAsStrings<T extends Record<string, unknown>>(
  obj: T
): WithDatesAsStrings<T> {
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    if (value instanceof Date) {
      return { ...acc, [key]: value.toISOString() };
    }
    return { ...acc, [key]: value };
  }, {} as WithDatesAsStrings<T>);
}
