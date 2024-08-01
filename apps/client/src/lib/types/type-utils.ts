export type WithValuesAsStrings<T> = {
  [K in keyof T]: string;
};
export type ReadonlyStringLiteralObject<T extends { [key: string]: string }> = {
  readonly [K in keyof T]: T[K];
};

export function isType<T>(
  value: unknown,
  validationFn: (value: unknown) => boolean,
): value is T {
  return validationFn(value);
}

export function isKeyOfLiteralObj<T extends { [key: string]: string }>(
  item: unknown,
  literalObj: ReadonlyStringLiteralObject<T>,
) {
  return isType<keyof T>(item, item => {
    if (typeof item === 'string') {
      return Object.values(literalObj).includes(item);
    }
    return false;
  });
}

export function isTypeArray<T>(
  value: unknown,
  validationFn: (value: unknown) => value is T,
): value is T[] {
  return Array.isArray(value) && value.every(validationFn);
}
