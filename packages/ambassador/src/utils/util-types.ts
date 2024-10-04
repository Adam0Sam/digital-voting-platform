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
