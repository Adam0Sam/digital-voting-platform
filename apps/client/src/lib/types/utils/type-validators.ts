import { ReadonlyStringLiteralObject } from './util-types';

/**
 * Is this a useful abstraction?
 */
export function isType<T>(
  value: unknown,
  validationFn: (value: unknown) => boolean,
): value is T {
  return validationFn(value);
}

export function isKeyOfStringLiteralObj<T extends { [key: string]: string }>(
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
) {
  return isType<T[]>(
    value,
    value => Array.isArray(value) && value.every(validationFn),
  );
}
