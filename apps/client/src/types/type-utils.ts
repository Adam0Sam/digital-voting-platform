export type WithValuesAsStrings<T> = {
  [K in keyof T]: string;
};
