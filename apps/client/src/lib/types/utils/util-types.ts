export type WithValuesAsStrings<T> = {
  [K in keyof T]: string;
};
export type ReadonlyStringLiteralObject<T extends { [key: string]: string }> = {
  readonly [K in keyof T]: T[K];
};
