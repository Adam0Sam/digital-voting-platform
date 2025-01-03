import { ReadonlyStringLiteralObject } from "./util-types";

export function isType<T>(
  value: unknown,
  validationFn: (value: unknown) => boolean
): value is T {
  return validationFn(value);
}

export function isTypeArray<T>(
  value: unknown,
  validationFn: (value: unknown) => value is T
) {
  return isType<T[]>(
    value,
    (value) => Array.isArray(value) && value.every(validationFn)
  );
}

export function isKeyOfStringLiteralObj<T extends { [key: string]: string }>(
  item: unknown,
  literalObj: ReadonlyStringLiteralObject<T>
) {
  const isKey = (item: unknown): item is keyof T => {
    if (typeof item === "string") {
      return Object.keys(literalObj).includes(item);
    }
    return false;
  };

  return isType<keyof T>(item, isKey);
}

export function isKeyOfStringLiteralObjArray<
  T extends { [key: string]: string },
>(item: unknown, literalObj: T) {
  const validatorWithLiteralObj = (item: unknown) =>
    isKeyOfStringLiteralObj(item, literalObj);
  return isTypeArray<keyof T>(item, validatorWithLiteralObj);
}

export function atLeastTwo<T>(arr: T[]): [T, T, ...T[]] {
  if (arr.length < 2) {
    throw new Error("Instantiated with fewer than two items");
  }

  return arr as [T, T, ...T[]];
}
