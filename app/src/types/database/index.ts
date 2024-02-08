export type JsonDoc<T> = {
  [TKey in keyof T]: T[TKey] extends Date | null | undefined ? string : T[TKey];
};
