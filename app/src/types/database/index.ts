export type JsonDoc<T> = {
  [TKey in keyof T]: T[TKey] extends Date | null | undefined ? string : T[TKey];
};

export type RxDoc<T> = {
  [TKey in keyof Omit<T, 'isDeleted'>]: T[TKey] extends Date | null | undefined
    ? string
    : T[TKey];
} & {
  _deleted: boolean;
};
